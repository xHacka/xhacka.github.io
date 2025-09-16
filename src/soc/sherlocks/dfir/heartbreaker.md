# Heartbreaker

## Description

Delicate situation alert! The customer has just been alerted about concerning reports indicating a potential breach of their database, with information allegedly being circulated on the darknet market. As the Incident Responder, it's your responsibility to get to the bottom of it. Your task is to conduct an investigation into an email received by one of their employees, comprehending the implications, and uncovering any possible connections to the data breach. Focus on examining the artifacts provided by the customer to identify significant events that have occurred on the victim's workstation.
## Files

We are given quite an extensive zip file. It contains fraction of Windows system files, with prefetches, logs, Events logs, user data, etc.

```bash
└─$ 7z x HeartBreaker.zip -P'hacktheblue'
```
## Tasks

### Task 1. The victim received an email from an unidentified sender. What email address was used for the suspicious email?

```bash
└─$ find . -iname '*mail*'
./wb-ws-01/C/Users/ash.williams/AppData/Local/Microsoft/Outlook/ashwilliams012100@gmail.com.ost
└─$ cd ./wb-ws-01/C/Users/ash.williams/AppData/Local/Microsoft/Outlook
└─$ file ashwilliams012100@gmail.com.ost
ashwilliams012100@gmail.com.ost: Microsoft Outlook Offline Storage (>=2003, Unicode, version 36), dwReserved1=0x78, dwReserved2=0x12ff86, bidUnused=0000000000000000, dwUnique=0x164f, 16818176 bytes, CRC32 0x28f18ca3
└─$ pffexport ashwilliams012100@gmail.com.ost # https://unix.stackexchange.com/a/611130
└─$ find . -empty -delete # Cleanup
└─$ tree -h -L 1
[4.0K]  .
├── [4.0K]  Contacts (This computer only)
├── [4.0K]  [Gmail]
└── [4.0K]  Inbox

4 directories, 0 files
```

After going through few mails in Inbox few can notice a suspicious email. Embedded file has double extension, is being served on IP rather then domain, port 9000 is also a bit sketchy and finally the sender pressures us to get it as soon as possible.

![Writeup.png](/assets/soc/sherlocks/heartbreaker/Writeup.png)

```bash
┌──(woyag㉿kraken)-[~/…/Outlook/ashwilliams012100@gmail.com.ost.export/Root - Mailbox/IPM_SUBTREE]
└─$ cat Inbox/Message00004/OutlookHeaders.txt
Message:
Client submit time:                     Mar 13, 2024 08:37:12.000000000 UTC
Delivery time:                          Mar 13, 2024 08:37:26.000000000 UTC
Creation time:                          Mar 13, 2024 10:43:24.699736200 UTC
Size:                                   690607
Flags:                                  0x00030011 (Read, Has attachments, Unknown: 0x00030000)
Conversation topic:                     Fingers crossed you'll notice..
Subject:                                Fingers crossed you'll notice..
Sender name:                            It's Me
Sender email address:                   ImSecretlyYours@proton.me
Sent representing name:                 It's Me
Sent representing email address:        ImSecretlyYours@proton.me
Importance:                             Normal
```

::: tip :bulb: Answer
`ImSecretlyYours@proton.me`
:::

### Task 2. It appears there's a link within the email. Can you provide the complete URL where the malicious binary file was hosted?

::: tip :bulb: Answer
`http://44.206.187.144:9000/Superstar_MemberCard.tiff.exe`
:::

### Task 3. The threat actor managed to identify the victim's AWS credentials. From which file type did the threat actor extract these credentials?

From CTF challenges I participated the AWS key always started with AKIA after searching for it we end up on Draft email with Access keys!

![Writeup-1.png](/assets/soc/sherlocks/heartbreaker/Writeup-1.png)

The extension is `.ost` because that's the file contents we are reading right now in verbose mode (like a zip file).

::: tip :bulb: Answer
`.ost`
:::

### Task 4. Provide the actual IAM credentials of the victim found within the artifacts.

::: tip :bulb: Answer
`AKIA52GPOBQCK73P2PXL:OFqG/yLZYaudty0Rma6arxVuHFTGQuM6St8SWySj`
:::

### Task 5. When (UTC) was the malicious binary activated on the victim's workstation?

For this type of information we can refer to Master File Table. Parse the MFT with `MFTECmd`:
```powershell
➜ .\MFTECmd\MFTECmd\bin\Debug\net6.0\MFTECmd.exe -f '.\$MFT' --csv . --csvf mft.csv
```

- **Created0x10**: STANDARD_INFO created timestamp
- **Created0x30**: FILE_NAME created timestamp
[[Labs/HackTheBox/Sherlocks/DFIR/BFT/Writeup#Task 4. Analyze the $Created0x30 timestamp for the previously identified file. When was this file created on disk?|BFT Writeup]]

![Writeup-2.png](/assets/soc/sherlocks/heartbreaker/Writeup-2.png)

Usually the MFT holds the all information about file access, but the timestamps was not accepting. We can look info Prefetch file with `PECmd`:
```bash
└─$ find . -iname '*tiff\.exe*'
./Windows/prefetch/SUPERSTAR_MEMBERCARD.TIFF.EXE-C2488B05.pf
---
➜ .\PECmd\PECmd\bin\Debug\net6.0\PECmd.exe -f .\SUPERSTAR_MEMBERCARD.TIFF.EXE-C2488B05.pf
PECmd version 1.5.0.0

Author: Eric Zimmerman (saericzimmerman@gmail.com)
https://github.com/EricZimmerman/PECmd

Command line: -f .\SUPERSTAR_MEMBERCARD.TIFF.EXE-C2488B05.pf
Keywords: temp, tmp
Processing .\SUPERSTAR_MEMBERCARD.TIFF.EXE-C2488B05.pf

Created on: 2024-07-04 19:52:05
Modified on: 2024-07-04 19:52:05
Last accessed on: 2024-07-04 19:52:48

Executable name: SUPERSTAR_MEMBERCARD.TIFF.EXE
Hash: C2488B05
File size (bytes): 244 988
Version: Windows 10 or Windows 11

Run count: 1
Last run: 2024-03-13 10:45:02

Volume information:

#0: Name: \VOLUME{01da694d2d1e2a56-562d2f1c} Serial: 562D2F1C Created: 2024-02-27 07:18:35 Directories: 114 File references: 1 635

Directories referenced: 114
```

Looks like the timestamp was 10 seconds off..

::: tip :bulb: Answer
`2024-03-13 10:45:02`
:::

### Task 6. Following the download and execution of the binary file, the victim attempted to search for specific keywords on the internet. What were those keywords?

![Writeup-3.png](/assets/soc/sherlocks/heartbreaker/Writeup-3.png)

```bash
└─$ find . -name '*History*'
./Users/svcaccount/AppData/Local/Microsoft/Edge/User Data/Default/History
./Users/svcaccount/AppData/Local/Microsoft/Edge/User Data/Default/History-journal
./Users/administrator/AppData/Local/Microsoft/Windows/History
./Users/ash.williams/AppData/Local/Microsoft/Edge/User Data/Default/History
./Users/ash.williams/AppData/Local/Microsoft/Edge/User Data/Default/History-journal
./Windows/System32/Tasks/Microsoft/Windows/FileHistory
./Windows/System32/Tasks/Microsoft/Windows/FileHistory/File History (maintenance mode)
```

![Writeup-4.png](/assets/soc/sherlocks/heartbreaker/Writeup-4.png)

[nxlog: Browser history logs](https://docs.nxlog.co/integrate/browser-history.html)

![Writeup-5.png](/assets/soc/sherlocks/heartbreaker/Writeup-5.png)

```bash
└─$ find . -iname '*place*'
./Users/ash.williams/AppData/Roaming/Mozilla/Firefox/Profiles/hy42b1gc.default-release/places.sqlite
./Windows/System32/Tasks/Microsoft/Windows/Workplace Join
```

Looks like Firefox was used to download malware.

![Writeup-6.png](/assets/soc/sherlocks/heartbreaker/Writeup-6.png)

![Writeup-7.png](/assets/soc/sherlocks/heartbreaker/Writeup-7.png)

After malware download the user searched for `Superstar cafe membership`

::: tip :bulb: Answer
`Superstar cafe membership`
:::

### Task 7. At what time (UTC) did the binary successfully send an identical malicious email from the victim's machine to all the contacts?

Searching for malware name we end up on `Message00005` which contains all contacts that user had.

![Writeup-8.png](/assets/soc/sherlocks/heartbreaker/Writeup-8.png)

![Writeup-9.png](/assets/soc/sherlocks/heartbreaker/Writeup-9.png)

`Mar 13, 2024 10:47:51.000000000 UTC` -> `2024-05-13 10:47:51`

::: tip :bulb: Answer
`2024-03-13 10:47:51`
:::

### Task 8. How many recipients were targeted by the distribution of the said email excluding the victim's email account?

```bash
└─$ cat 'Users/ash.williams/AppData/Local/Microsoft/Outlook/ashwilliams012100@gmail.com.ost.export/Root - Mailbox/IPM_SUBTREE/[Gmail]/Sent Mail/Message00005/Recipients.txt' | grep Email | wc -l
59
```

::: tip :bulb: Answer
`58` (-1 victim)
:::

### Task 9. Which legitimate program was utilized to obtain details regarding the domain controller?

The Windows Events Log should have what we are looking for, but there are too many.
```bash
└─$ find . -name '*.evtx' -print -quit
./Windows/System32/winevt/logs/Microsoft-Windows-Resource-Exhaustion-Detector%4Operational.evtx

┌──(woyag㉿kraken)-[~/…/Sherlock/Heartbreaker/wb-ws-01/C]
└─$ find . -name '*.evtx' | wc
    113     129    9123
```

We can use Chainsaw to parse the events based on regex and find relevant info.

It was hard to filter all the events, so I focused on Event providers. `Sysmon` is more precise event for this task.

```powershell
➜ (.\chainsaw\chainsaw.exe search "Superstar_MemberCard.tiff.exe" .\logs -q | sls 'provider_' -Context 1,2 | findstr Name | group).name
        Name: Microsoft-Windows-PowerShell
        Name: Microsoft-Windows-Sysmon
        Name: Microsoft-Windows-Windows Defender
        Name: PowerShell
```

```powershell
➜ .\chainsaw\chainsaw.exe search "Superstar_MemberCard.tiff.exe" .\logs\Microsoft-Windows-Sysmon%4Operational.evtx -q | sls 'TargetImage' | group | ft -Property Name

Name
----
    TargetImage: C:\Program Files\Microsoft Office\Office16\OUTLOOK.EXE
    TargetImage: C:\ProgramData\Microsoft\Windows Defender\Platform\4.18.24020.7-0\MsMpEng.exe
    TargetImage: C:\Users\ash.williams\Downloads\Superstar_MemberCard.tiff.exe
    TargetImage: C:\Users\Public\HelpDesk-Tools\WinSCP.com
    TargetImage: C:\Windows\system32\gpresult.exe
    TargetImage: C:\Windows\system32\nltest.exe
    TargetImage: C:\Windows\System32\Wbem\WMIC.exe
```

You can use **[nltest.exe](https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-server-2012-r2-and-2012/cc731935(v=ws.11)#nltestexe)** to:
- Get a list of domain controllers
- Force a remote shutdown
- Query the status of trust
- Test trust relationships and the state of domain controller replication in a Windows domain
- Force a user-account database to synchronize on Windows NT version 4.0 or earlier domain controllers

```powershell
➜ .\chainsaw\chainsaw.exe search -t 'Event.EventData.TargetImage: "*nltest.exe*"' .\logs\Microsoft-Windows-Sysmon%4Operational.evtx -q
---
Event:
  EventData:
    CallTrace: C:\Windows\SYSTEM32\ntdll.dll+9e664|C:\Windows\System32\KERNELBASE.dll+8e73|C:\Windows\System32\KERNELBASE.dll+71a6|C:\Windows\System32\KERNEL32.dll+1cbb4|C:\Windows\assembly\NativeImages_v4.0.30319_64\System\372e9962a41f186f070f1cb9f93273ee\System.ni.dll+384146|C:\Windows\assembly\NativeImages_v4.0.30319_64\System\372e9962a41f186f070f1cb9f93273ee\System.ni.dll+2c4809|C:\Windows\assembly\NativeImages_v4.0.30319_64\System\372e9962a41f186f070f1cb9f93273ee\System.ni.dll+2c4179|C:\Windows\assembly\NativeImages_v4.0.30319_64\System.Manaa57fc8cc#\31f3ff18d2438832c5c159e78f145c47\System.Management.Automation.ni.dll+111dec9|C:\Windows\assembly\NativeImages_v4.0.30319_64\System.Manaa57fc8cc#\31f3ff18d2438832c5c159e78f145c47\System.Management.Automation.ni.dll+10750ca|C:\Windows\assembly\NativeImages_v4.0.30319_64\System.Manaa57fc8cc#\31f3ff18d2438832c5c159e78f145c47\System.Management.Automation.ni.dll+10ff7bd|C:\Windows\assembly\NativeImages_v4.0.30319_64\System.Manaa57fc8cc#\31f3ff18d2438832c5c159e78f145c47\System.Management.Automation.ni.dll+10ff47b|C:\Windows\assembly\NativeImages_v4.0.30319_64\System.Manaa57fc8cc#\31f3ff18d2438832c5c159e78f145c47\System.Management.Automation.ni.dll+12028bf|UNKNOWN(00007FFC93466B41)
    GrantedAccess: '0x1fffff'
    RuleName: technique_id=T1055.001,technique_name=Dynamic-link Library Injection
    SourceImage: C:\Users\ash.williams\Downloads\Superstar_MemberCard.tiff.exe
    SourceProcessGUID: 8B118F18-83AE-65F1-8903-000000000900
    SourceProcessId: 7252
    SourceThreadId: 7312
    SourceUser: WORK\ash.williams
    TargetImage: C:\Windows\system32\nltest.exe
    TargetProcessGUID: 8B118F18-83B3-65F1-8C03-000000000900
    TargetProcessId: 7516
    TargetUser: WORK\ash.williams
    UtcTime: 2024-03-13 10:45:07.010
  System:
    Channel: Microsoft-Windows-Sysmon/Operational
    Computer: wb-ws-01.work.com
    Correlation: null
    EventID: 10
    EventRecordID: 5437
    Execution_attributes:
      ProcessID: 2352
      ThreadID: 3188
    Keywords: '0x8000000000000000'
    Level: 4
    Opcode: 0
    Provider_attributes:
      Guid: 5770385F-C22A-43E0-BF4C-06F5698FFBD9
      Name: Microsoft-Windows-Sysmon
    Security_attributes:
      UserID: S-1-5-18
    Task: 10
    TimeCreated_attributes:
      SystemTime: 2024-03-13T10:45:07.024319Z
    Version: 3
Event_attributes:
  xmlns: http://schemas.microsoft.com/win/2004/08/events/event
```

::: tip :bulb: Answer
`nltest.exe`
:::

### Task 10. Specify the domain (including sub-domain if applicable) that was used to download the tool for exfiltration.

[Sysmon > Event ID 22: DNSEvent (DNS query)](https://learn.microsoft.com/en-us/sysinternals/downloads/sysmon#event-id-22-dnsevent-dns-query)

```powershell
➜ .\chainsaw\chainsaw.exe search -t 'Event.System.EventID: =22' -t 'Event.EventData.Image: "*Superstar*"' .\logs\Microsoft-Windows-Sysmon%4Operational.evtx -q
---
Event:
  EventData:
    Image: C:\Users\ash.williams\Downloads\Superstar_MemberCard.tiff.exe
    ProcessGuid: 8B118F18-83AE-65F1-8903-000000000900
    ProcessId: 7252
    QueryName: us.softradar.com
    QueryResults: ::ffff:104.26.11.119;::ffff:172.67.69.160;::ffff:104.26.10.119;
    QueryStatus: '0'
    RuleName: '-'
    User: WORK\ash.williams
    UtcTime: 2024-03-13 10:45:20.904
  System:
    Channel: Microsoft-Windows-Sysmon/Operational
    Computer: wb-ws-01.work.com
    Correlation: null
    EventID: 22
    EventRecordID: 5495
    Execution_attributes:
      ProcessID: 2352
      ThreadID: 3200
    Keywords: '0x8000000000000000'
    Level: 4
    Opcode: 0
    Provider_attributes:
      Guid: 5770385F-C22A-43E0-BF4C-06F5698FFBD9
      Name: Microsoft-Windows-Sysmon
    Security_attributes:
      UserID: S-1-5-18
    Task: 22
    TimeCreated_attributes:
      SystemTime: 2024-03-13T10:45:23.285133Z
    Version: 5
Event_attributes:
  xmlns: http://schemas.microsoft.com/win/2004/08/events/event
```

::: tip :bulb: Answer
`us.softradar.com`
:::

### Task 11. The threat actor attempted to conceal the tool to elude suspicion. Can you specify the name of the folder used to store and hide the file transfer program?

[Sysmon > Event ID 11: FileCreate](https://learn.microsoft.com/en-us/sysinternals/downloads/sysmon#event-id-11-filecreate)

```powershell
➜ .\chainsaw\chainsaw.exe search -t 'Event.System.EventID: =11' -t 'Event.EventData.Image: "*Superstar*"' .\logs\Microsoft-Windows-Sysmon%4Operational.evtx -q | sls TargetFilenam

    TargetFilename: C:\Users\ash.williams\AppData\Local\Temp\__PSScriptPolicyTest_urg0otbo.gwe.ps1
    TargetFilename: C:\Users\ash.williams\Downloads\Superstar_MemberCard.tiff
    TargetFilename: C:\Users\Public\Public Files
    TargetFilename: C:\Users\Public\Public Files\username.txt
    TargetFilename: C:\Users\Public\Public Files\DCinfo.txt
    TargetFilename: C:\Users\Public\Public Files\localusers.txt
    TargetFilename: C:\Users\Public\Public Files\AVinfo.txt
    TargetFilename: C:\Users\Public\Public Files\UserProcesses.txt
    TargetFilename: C:\Users\Public\Public Files\ashwilliams012100@gmail.com.ost
    TargetFilename: C:\Users\Public\Public Files\Personal Requirements.docx
    TargetFilename: C:\Users\Public\Public Files\Server_Inventory.xlsx
    TargetFilename: C:\Users\Public\Public Files\Incident_Log.xls
    TargetFilename: C:\Users\Public\Public Files\Incident_Report.pdf
    TargetFilename: C:\Users\Public\Public Files\Configuration_Management.xlsx
    TargetFilename: C:\Users\Public\Public Files\Performance_Metrics.xlsx
    TargetFilename: C:\Users\Public\Public Files\Cloud_Architecture.pdf
    TargetFilename: C:\Users\Public\Public Files\Deployment_Plan.docx
    TargetFilename: C:\Users\ash.williams\AppData\Local\Temp\__PSScriptPolicyTest_pyju3jku.gc4.ps1
    TargetFilename: C:\Users\Public\Public Files\Shareinfo.txt
    TargetFilename: C:\Users\Public\Public Files\GPinfo.txt
    TargetFilename: C:\Users\Public\Public Files\WB-WS-01.zip
    TargetFilename: C:\Users\Public\Public Files\WinSCP.zip
    TargetFilename: C:\Users\Public\HelpDesk-Tools
    TargetFilename: C:\Users\Public\HelpDesk-Tools\license.txt
    TargetFilename: C:\Users\Public\HelpDesk-Tools\readme.txt
    TargetFilename: C:\Users\Public\HelpDesk-Tools\WinSCP.com
    TargetFilename: C:\Users\Public\HelpDesk-Tools\WinSCP.exe
    TargetFilename: C:\Users\Public\HelpDesk-Tools\maintenanceScript.txt
    TargetFilename: C:\Users\Public\Public Files\Contacts.csv
```

[WinSCP](https://winscp.net/eng/docs/introduction#:~:text=WinSCP%20is%20an%20open%20source,and%20basic%20file%20manager%20functionality.) is an open source free SFTP client, FTP client, WebDAV client, S3 client and SCP client and file manager for Windows. Its main function is **file transfer between a local and a remote computer**. Beyond this, **WinSCP offers scripting and basic file manager functionality**

::: tip :bulb: Answer
`HelpDesk-Tools`
:::

### Task 12. Under which MITRE ATT&CK technique does the action described in question #11 fall?

Easiest way if probably Google, lol D:

![Writeup-10.png](/assets/soc/sherlocks/heartbreaker/Writeup-10.png)

[Masquerading](https://attack.mitre.org/techniques/T1036/) fits the profile of attacker TTP.

::: tip :bulb: Answer
`Masquerading`
:::

### Task 13: Can you determine the minimum number of files that were compressed before they were extracted?

```powershell
➜ .\chainsaw\chainsaw.exe search -t 'Event.EventData.Image: "*Superstar*"' .\logs\Microsoft-Windows-Sysmon%4Operational.evtx -q | sls TargetFilename | sort | get-unique | sls files

    TargetFilename: C:\Users\Public\Public Files
    TargetFilename: C:\Users\Public\Public Files\ashwilliams012100@gmail.com.ost
    TargetFilename: C:\Users\Public\Public Files\AVinfo.txt
    TargetFilename: C:\Users\Public\Public Files\Change_Management_Policy.docx
    TargetFilename: C:\Users\Public\Public Files\Cloud_Architecture.pdf
    TargetFilename: C:\Users\Public\Public Files\Compliance_Checklist.pdf
    TargetFilename: C:\Users\Public\Public Files\Configuration_Management.xlsx
    TargetFilename: C:\Users\Public\Public Files\Contacts.csv
    TargetFilename: C:\Users\Public\Public Files\Continuous_Integration_Strategy.docx
    TargetFilename: C:\Users\Public\Public Files\DCinfo.txt
    TargetFilename: C:\Users\Public\Public Files\Deployment_Plan.docx
    TargetFilename: C:\Users\Public\Public Files\DevOps_Best_Practices.pdf
    TargetFilename: C:\Users\Public\Public Files\Disaster_Recovery_Plan.docx
    TargetFilename: C:\Users\Public\Public Files\GPinfo.txt
    TargetFilename: C:\Users\Public\Public Files\Incident_Log.xls
    TargetFilename: C:\Users\Public\Public Files\Incident_Report.pdf
    TargetFilename: C:\Users\Public\Public Files\Incident_Response_Protocol.docx
    TargetFilename: C:\Users\Public\Public Files\Infrastructure_Architecture.docx
    TargetFilename: C:\Users\Public\Public Files\localusers.txt
    TargetFilename: C:\Users\Public\Public Files\Network_Security_Policy.pdf
    TargetFilename: C:\Users\Public\Public Files\Performance_Metrics.xlsx
    TargetFilename: C:\Users\Public\Public Files\Personal Requirements.docx
    TargetFilename: C:\Users\Public\Public Files\Server_Inventory.xlsx
    TargetFilename: C:\Users\Public\Public Files\Service_Level_Agreement.docx
    TargetFilename: C:\Users\Public\Public Files\Shareinfo.txt
    TargetFilename: C:\Users\Public\Public Files\username.txt
    TargetFilename: C:\Users\Public\Public Files\UserProcesses.txt
    TargetFilename: C:\Users\Public\Public Files\WB-WS-01.zip
    TargetFilename: C:\Users\Public\Public Files\WinSCP.zip

➜ .\chainsaw\chainsaw.exe search -t 'Event.EventData.Image: "*Superstar*"' .\logs\Microsoft-Windows-Sysmon%4Operational.evtx -q | sls TargetFilename | sort | get-unique | sls files | measure | ft -Property count

Count
-----
   29
```

`Public Files` directory, `WB-WS-01.zip` and `WinSCP.zip` can be excluded from the list as they are not relevant to exfiltration. 29 - 3 = 26 files exfiltrated from "Staging folder": _Staging in this case means: the folder where the attacker works from._

::: tip :bulb: Answer
`26`
:::

### Task 14: To exfiltrate data from the victim's workstation, the binary executed a command. Can you provide the complete command used for this action?

```powershell
➜ .\chainsaw\chainsaw.exe search -t 'Event.EventData.CommandLine: "*maintenanceScript.txt*"' .\logs\Microsoft-Windows-Sysmon%4Operational.evtx -q
---
Event:
  EventData:
    CommandLine: '"C:\Users\Public\HelpDesk-Tools\WinSCP.com" /script="C:\Users\Public\HelpDesk-Tools\maintenanceScript.txt" '
    Company: Martin Prikryl
    CurrentDirectory: C:\Users\ash.williams\Downloads\
    Description: Console interface for WinSCP
    FileVersion: 5.0.1.9730
    Hashes: SHA1=224434759482423B3E3C75E06F6AB3A4FA193A33,MD5=F5AABAC14BE9EE43E22E840B6421938F,SHA256=BA7419F0AC2DFF1826217FABA581AF207F61A094144A4EBD381558BA38CC6601,IMPHASH=4930629D52BBA909DC99B790C62376E0
    Image: C:\Users\Public\HelpDesk-Tools\WinSCP.com
    IntegrityLevel: Medium
    LogonGuid: 8B118F18-7F0A-65F1-0DDA-050000000000
    LogonId: '0x5da0d'
    OriginalFileName: winscp.com
    ParentCommandLine: '"C:\Users\ash.williams\Downloads\Superstar_MemberCard.tiff.exe" '
    ParentImage: C:\Users\ash.williams\Downloads\Superstar_MemberCard.tiff.exe
    ParentProcessGuid: 8B118F18-83AE-65F1-8903-000000000900
    ParentProcessId: 7252
    ParentUser: WORK\ash.williams
    ProcessGuid: 8B118F18-83C5-65F1-9103-000000000900
    ProcessId: 7984
    Product: WinSCP
    RuleName: technique_id=T1083,technique_name=File and Directory Discovery
    TerminalSessionId: 1
    User: WORK\ash.williams
    UtcTime: 2024-03-13 10:45:25.669
  System:
    Channel: Microsoft-Windows-Sysmon/Operational
...
```

::: tip :bulb: Answer
`"C:\Users\Public\HelpDesk-Tools\WinSCP.com" /script="C:\Users\Public\HelpDesk-Tools\maintenanceScript.txt"`
:::