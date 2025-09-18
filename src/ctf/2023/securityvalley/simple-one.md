# Simple One

## Desciption

Level: 1 Score 5 Category web

Our administrators have forgotten a file on our web server. This file is very important for us. Unfortunately, our admin also forgot the location of the file. Can you find this file?

Link: <https://pwnme.org/>

## Solution

`/robots.txt` wasnt found on server, so I started enumerating directories.

```bash
└─$ gobuster dir -u https://pwnme.org/ -w /usr/share/wordlists/dirb/common.txt --exclude-length 3885
===============================================================
Gobuster v3.5
by OJ Reeves (@TheColonial) & Christian Mehlmauer (@firefart)
===============================================================
[+] Url:                     https://pwnme.org/
[+] Method:                  GET
[+] Threads:                 10
[+] Wordlist:                /usr/share/wordlists/dirb/common.txt
[+] Negative Status codes:   404
[+] Exclude Length:          3885
[+] User Agent:              gobuster/3.5
[+] Timeout:                 10s
===============================================================
2023/07/03 00:59:08 Starting gobuster in directory enumeration mode
===============================================================
/assets               (Status: 301) [Size: 162] [--> http://frontend:8080/assets/]
/favicon.ico          (Status: 200) [Size: 948]
/toolkit              (Status: 200) [Size: 27]
...
```

![simple-1](/assets/ctf/securityvalley/simple-one-1.png)