# Frognado in Valdoria - NOPE

## Frognado in Valdoria

Challenge: [https://kc7cyber.com/challenges/227](https://kc7cyber.com/challenges/227)

## Section 1: Maybe it's just a tadpole? 😢👀

### Q2: What is the MITRE ATT&CK ID for defacement?

Home > Techniques > Enterprise > Defacement > [T1491](https://attack.mitre.org/techniques/T1491/)

> Flag: `T1491`

### Q3. Who is the Web Administrator? (Paste the full name.)

```sql
Employees
| where role == 'Web Administrator'
| project name
```

> Flag: `Anita Bath`

### Q4: What is the hostname of the Web Administrator machine?

```sql
Employees
| where role == 'Web Administrator'
| project hostname
```

> Flag: `MYZB-LAPTOP`

### Q5: When did the defacement happen exactly? (Paste the full timestamp.)

```sql
ProcessEvents
| where hostname == 'MYZB-LAPTOP'
| where process_commandline has 'Shadow Truth'
| project timestamp, process_commandline
```

```powershell
cmd.exe /C echo ^
^<html^>^
^<head^>^
^<title^>Hacked by Shadow Truth^</title^>^
^</head^>^
^<body^>^
^<h1^>Hacked by Shadow Truth!^</h1^>^
^<p^>Your security is a joke. We have exposed your secrets for all to see.^</p^>^
^<p^>Enjoy the memes!^</p^>^
^<img src="images/frog_mall_meme1.jpg" alt="Hacked Meme"^>^
^<img src="images/frog_mall_meme2.jpg" alt="Hacked Meme"^>^
^</body^>^
^</html^> ^
> \\\\web-server\\inetpub\\wwwroot\\index.html
```

> Flag: `2024-07-10T11:45:50Z`

### Q6: When was the first image uploaded? (Paste the full timestamp.)

```sql
let anitaHostname = 'MYZB-LAPTOP';
ProcessEvents
| where hostname == anitaHostname
| where process_commandline contains 'frog_mall_meme'
| project timestamp, process_commandline
```

> Flag: `2024-07-10T10:53:37Z`

### Q7: What is the Sha256 hash of the first meme that was uploaded to the webserver?

```sql
FileCreationEvents
| where filename == 'frog_mall_meme1.jpg'
| project timestamp, sha256, path
```

> Flag: `9880c2d74afb2e57c7de7b9d6d0976112887502bb80344d35df34e774628dba0`

### Q8: What domain were the images downloaded from?

```sql
let anitaIP = Employees 
| where role == 'Web Administrator' 
| project ip_addr;
OutboundNetworkEvents
| where src_ip == toscalar(anitaIP)
| where url contains 'frog_mall_meme'
| distinct tostring(parse_url(url).Host)
```

> Flag: `ronniesdankmemes.com`

### Q9: Which command did the attacker use to look for files containing passwords?

```sql
let anitaHostname = 'MYZB-LAPTOP';
ProcessEvents
| where hostname == anitaHostname
| where process_commandline has 'password'
| project timestamp, process_commandline
```

> Flag: `Get-ChildItem -Path C:\Users\anbath\Documents\* -Include *password* -Recurse`

### Q10: What is the name of the file containing passwords?

```sql
let anitaHostname = 'MYZB-LAPTOP';
let anitaIP = '10.10.0.8';
ProcessEvents
| where hostname == anitaHostname
| where timestamp > datetime('2024-07-09T15:41:29Z')
| where process_name in ('powershell.exe', 'cmd.exe')
| project timestamp, process_commandline
```

```bash
curl[.]exe -o C:\ProgramData\Heartburn\mypasswordsnstuff[.]txt hxxps[://]newdevelopmentupdates[.]org/mypasswordsnstuff[.]txt
```

> Flag: `mypasswordsnstuff.txt`

### Q11: What is the name of that domain?

Information was found in Q10.

> Flag: `newdevelopmentupdates.org`

### Q12: What is the last IP address that the domain you found in Q11 resolve to?

```sql
let c2server = 'newdevelopmentupdates.org';
PassiveDns
| where domain == c2server;
```

> Flag: `239.72.6.37`

### Q13: Do the IPs found in Q11 resolve to other domains? 

*...If they do, answer with the domain. If not, type no.*

```sql
let c2server = 'newdevelopmentupdates.org';
PassiveDns
| where domain == c2server
| distinct ip
| lookup PassiveDns on ip
| distinct domain
```

> Flag: `greenprojectnews.net`

### Q14: What version of Firefox is the threat actor using?

```sql
let anitaHostname = 'MYZB-LAPTOP';
let c2domains = dynamic([
    'newdevelopmentupdates.org',
    'greenprojectnews.net'
]);
let c2server_ips = PassiveDns | where domain in (c2domains) | distinct ip;
AuthenticationEvents
| where src_ip in (c2server_ips)
| where hostname == anitaHostname;
```

```http
Mozilla/5.0 (Macintosh; U; PPC Mac OS X 10_9_3; rv:1.9.6.20) Gecko/2022-06-30 19:57:20 Firefox/3.6.11
```

> Flag: `3.6.11`

### Q15: What is Anita’s email address?

```sql
let anitaHostname = 'MYZB-LAPTOP';
Employees
| where hostname == anitaHostname
| project email_addr
```

> Flag: `anita_bath@framtidxdevcorp.com`

### Q16: What is the subject of the email she received?

```sql
let anitaEmail = 'anita_bath@framtidxdevcorp.com';
let c2domains = dynamic([
    'newdevelopmentupdates.org',
    'greenprojectnews.net'
]);
Email
| where recipient == anitaEmail
| where link has_any (c2domains)
```

> Flag: `Web Server Credentials Update`

### Q17: What is the link attached to that email?

Information was found in Q16.

> Flag: `https://greenprojectnews.net/share/modules/files/share/enter`

### Q18: When did Anita click on the link? (Paste the full timestamp.)"

```sql
let anitaIP = '10.10.0.8';
let maliciousURL = 'https://greenprojectnews.net/share/modules/files/share/enter';
OutboundNetworkEvents
| where src_ip == anitaIP
| where url == maliciousURL;
```

> Flag: `2024-06-26T15:24:20Z`

### Q19: What is the full url showing her doing just that?

```sql
let anitaIP = '10.10.0.8';
let maliciousDomain = 'https://greenprojectnews.net';
OutboundNetworkEvents
| where src_ip == anitaIP
| where url has maliciousDomain;
```

> Flag: `https://greenprojectnews.net/share/modules/files/share/enter?username=anbath&password=**********`

### Q20: Who sent Anita the mail?

Information was found in Q16.

> Flag: `alex_johnson@framtidxdevcorp.com`

## Section 2: KQL 101 📚

Skipped...

## Section 3: Alright it’s definitely an angry frog or two 🥵😨

### Q1: What is the name of Erik Bjorn’s colleague?

```sql
Employees
| where role == 'Chief Architect'
```

> Flag: `Sofia Lindgren`

### Q2: What is the subject of these emails?

```sql
let architectEmails = Employees
| where role == 'Chief Architect'
| project email_addr;
let c2domains = dynamic([
    'newdevelopmentupdates.org',
    'greenprojectnews.net'
]);
Email
| where recipient has_any (architectEmails)
| where link has_any (c2domains)
```

> Flag: `Important: Architectural Plan Changes`

### Q3: Which domain is the page hosted on?

Information was found in Q2.

> Flag: `greenprojectnews.net`

### Q4: What type of phishing attack is this?

The attackers targeted `Chief Architect`s with `Important: Architectural Plan Changes` subject emails. Spearphishing *in the simplest terms, these are highly personalized cyberattacks that target specific individuals or companies*. [src](https://www.kaspersky.com/resource-center/definitions/spear-phishing)

> Flag: `Spearphishing`

### Q5: How many distinct pages on the company’s website did the threat actor browse to?

```sql

```

> Flag: `xxx`

### Q1: 

```sql

```

> Flag: `xxx`

### Q1: 

```sql

```

> Flag: `xxx`

### Q1: 

```sql

```

> Flag: `xxx`

### Q1: 

```sql

```

> Flag: `xxx`

### Q1: 

```sql

```

> Flag: `xxx`

### Q1: 

```sql

```

> Flag: `xxx`

### Q1: 

```sql

```

> Flag: `xxx`

### Q1: 

```sql

```

> Flag: `xxx`

### Q1: 

```sql

```

> Flag: `xxx`

### Q1: 

```sql

```

> Flag: `xxx`

### Q1: 

```sql

```

> Flag: `xxx`

### Q1: 

```sql

```

> Flag: `xxx`

### Q1: 

```sql

```

> Flag: `xxx`

### Q1: 

```sql

```

> Flag: `xxx`

## Section 4: Nope, it’s a full on frognado!!!! 🐸🌪️😱