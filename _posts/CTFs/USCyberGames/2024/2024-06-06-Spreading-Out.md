---
title: US Cyber Games [Season 4] - Spreading Out
date: Thu Jun  6 12:22:13 PM EDT 2024
categories: [Writeup]
tags: [ctf,uscybergames,uscybergames2024,web,misc]
---

## Description

Spreading Out [Web]

ARIA is going out and touching files it shouldn't, can you track down where all it has gone?

[https://uscybercombine-s4-spreading-out.chals.io/](https://uscybercombine-s4-spreading-out.chals.io/)

_Note: Fuzzing web directories is allowed._

## Solution

Looking into source code there's no comments or anything useful

![Spreading Out](/assets/images/USCyberGames/2024/Spreading Out.png)

Part 1 found in `robots.txt`
```bash
➜ curl https://uscybercombine-s4-spreading-out.chals.io/robots.txt
1/5: SIVBGR{ARIA_1s
```

Since fuzzing is explicitly allowed let's do that.
```bash
└─$ feroxbuster -u https://uscybercombine-s4-spreading-out.chals.io -w /usr/share/seclists/Discovery/Web-Content/common.txt
by Ben "epi" Risher 🤓                 ver: 2.10.3
───────────────────────────┬──────────────────────
 🎯  Target Url            │ https://uscybercombine-s4-spreading-out.chals.io
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
404      GET        5l       31w      207c Auto-filtering found 404-like response and created new filter; toggle off with --dont-filter
200      GET       56l      222w     1956c https://uscybercombine-s4-spreading-out.chals.io/static/can.js
200      GET       28l      102w      989c https://uscybercombine-s4-spreading-out.chals.io/
200      GET        1l        2w       16c https://uscybercombine-s4-spreading-out.chals.io/readme
200      GET        1l        2w       19c https://uscybercombine-s4-spreading-out.chals.io/robots.txt
200      GET        1l        2w       15c https://uscybercombine-s4-spreading-out.chals.io/sitemap.xml
403      GET        1l        3w       22c https://uscybercombine-s4-spreading-out.chals.io/wwwlog
[####################] - 4m      4730/4730    0s      found:6       errors:1301
[####################] - 4m      4728/4728    18/s    https://uscybercombine-s4-spreading-out.chals.io/
```

```bash
➜ curl https://uscybercombine-s4-spreading-out.chals.io/readme
3/5: _4lw4ys_4nd

➜ curl https://uscybercombine-s4-spreading-out.chals.io/sitemap.xml
4/5: _c4nnot_b3
```

```bash
└─$ declare -f goscan # Just a utility function, because Im lazy lol
goscan () {
        local wordlist="${2:-1}"
        if [[ wordlist -eq 1 ]]
        then
                wordlist='/usr/share/seclists/Discovery/Web-Content/common.txt'
        elif [[ wordlist -eq 2 ]]
        then
                wordlist='/usr/share/seclists/Discovery/Web-Content/raft-medium-directories.txt'
        fi
        local logfile=$(echo "$1" | sed 's#https\?://##')
        gobuster dir -u $1 -w $wordlist -t 30 ${*:2} | tee -a "gobuster_scan_$logfile"
}

└─$ goscan https://uscybercombine-s4-spreading-out.chals.io/wwwlog 1 -x log,txt
===============================================================
Gobuster v3.6
by OJ Reeves (@TheColonial) & Christian Mehlmauer (@firefart)
===============================================================
[+] Url:                     https://uscybercombine-s4-spreading-out.chals.io/wwwlog
[+] Method:                  GET
[+] Threads:                 30
[+] Wordlist:                /usr/share/seclists/Discovery/Web-Content/common.txt
[+] Negative Status codes:   404
[+] User Agent:              gobuster/3.6
[+] Extensions:              log,txt
[+] Timeout:                 10s
===============================================================
Starting gobuster in directory enumeration mode
===============================================================
/development.log      (Status: 200) [Size: 14]

➜ curl https://uscybercombine-s4-spreading-out.chals.io/wwwlog/development.log
5/5: _st0pp3d}
```

After some hardcore enumeration I finally found it:
```bash
➜ curl https://uscybercombine-s4-spreading-out.chals.io/.env
2/5: _spreading_3v3rywh3r3
```

> Flag: **SIVBGR{ARIA_1s_spreading_3v3rywh3r3_4lw4ys_4nd_c4nnot_b3_st0pp3d}**
{: .prompt-tip }