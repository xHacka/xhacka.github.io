# Unit42

#windows #evtx 
## Description

In this Sherlock, you will familiarize yourself with Sysmon logs and various useful EventIDs for identifying and analyzing malicious activities on a Windows system. Palo Alto's Unit42 recently conducted research on an UltraVNC campaign, wherein attackers utilized a backdoored version of UltraVNC to maintain access to systems. This lab is inspired by that campaign and guides participants through the initial access stage of the campaign.

## Files 

We are given `evtx` file. The Windows XML EventLog (EVTX) format is used by Microsoft Windows to store system log information.

```powershell
➜ 7z x .\unit42.zip -p"hacktheblue" -o"unit42"
➜ ls .\unit42\

    Directory: ~\VBoxShare\unit42

Mode                 LastWriteTime         Length Name
----                 -------------         ------ ----
-a---          14.02.2024    07:43        1118208 Microsoft-Windows-Sysmon-Operational.evtx
```

![Writeup.png](/assets/soc/sherlocks/unit42/Writeup.png)
## Tasks
### 1. How many Event logs are there with Event ID 11?

[Sysmon Event ID 11](https://www.ultimatewindowssecurity.com/securitylog/encyclopedia/event.aspx?eventid=90011): File create operations are logged when a file is created or overwritten. This event is useful for monitoring autostart locations, like the Startup folder, as well as temporary and download directories, which are common places malware drops during initial infection.

Filter and in the topbar we see `56` is number of events.

![Writeup-1.png](/assets/soc/sherlocks/unit42/Writeup-1.png)

::: tip :bulb: Answer
`56`
:::

### 2. Whenever a process is created in memory, an event with Event ID 1 is recorded with details such as command line, hashes, process path, parent process path, etc. This information is very useful for an analyst because it allows us to see all programs executed on a system, which means we can spot any malicious processes being executed. What is the malicious process that infected the victim's system?

[Sysmon Event ID 1](https://www.ultimatewindowssecurity.com/securitylog/encyclopedia/event.aspx?eventid=90001): The process creation event provides extended information about a newly created process. The full command line provides context on the process execution. The ProcessGUID field is a unique value for this process across a domain to make event correlation easier. The hash is a full hash of the file with the algorithms in the HashType field.

After filtering we see few [C:\Windows\System32\msiexec.exe](https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/msiexec) processes, and as Microsoft describes msiexec _provides the means to install, modify, and perform operations on Windows Installer from the command line_.  

We also see `C:\Program Files\Mozilla Firefox\pingsender.exe`. 
_Pingsender.exe's name is a bit concerning because it sounds like your PC is sending out pings somehow to other servers, and most people don't want their PC to do that without permission. Fortunately though this .exe is **a part of Mozilla's Firefox browser and it's not a dangerous app**._ [src](https://www.glasswire.com/process/pingsender.exe.html#:~:text=Pingsender.exe%27s%20name%20is%20a,it%27s%20not%20a%20dangerous%20app.)

Lastly we are left with `"C:\Users\CyberJunkie\Downloads\Preventivo24.02.14.exe.exe"` which tripe downs on  suspicious. First of all we have double `exe` extension and user is `CyberJunkie`. (We met this suspicious username on [[Labs/HackTheBox/Sherlocks/DFIR/Brutus/Writeup|Brutus]] too)

![Writeup-2.png](/assets/soc/sherlocks/unit42/Writeup-2.png)

::: tip :bulb: Answer
`C:\Users\CyberJunkie\Downloads\Preventivo24.02.14.exe.exe`
:::

### 3. Which Cloud drive was used to distribute the malware?

[Sysmon Event ID 22](https://www.ultimatewindowssecurity.com/securitylog/encyclopedia/event.aspx?eventid=90022) (DNSEvent): Malware uses DNS in the traditional way to locate components of the attacker infrastructure such as command and control servers.  Attackers can also leverage the DNS protocol for communication between components such as by embedding check-in data in the query and commands to carry out in the query response.  

Using [chainsaw](https://github.com/WithSecureLabs/chainsaw) we can speed up analysis with command line. Here we filter for EventID=22 which is DNSEvent. Since the log is small it's safe to assume that `dropbox` was the cloud storage that was used by attacker.
```powershell
➜ ~\source\chainsaw\chainsaw.exe search -t 'Event.System.EventID: =22' ./Microsoft-Windows-Sysmon-Operational.evtx | sls 'Image|QueryName|SystemTime'

 ██████╗██╗  ██╗ █████╗ ██╗███╗   ██╗███████╗ █████╗ ██╗    ██╗
██╔════╝██║  ██║██╔══██╗██║████╗  ██║██╔════╝██╔══██╗██║    ██║
██║     ███████║███████║██║██╔██╗ ██║███████╗███████║██║ █╗ ██║
██║     ██╔══██║██╔══██║██║██║╚██╗██║╚════██║██╔══██║██║███╗██║
╚██████╗██║  ██║██║  ██║██║██║ ╚████║███████║██║  ██║╚███╔███╔╝
 ╚═════╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝╚═╝  ╚═══╝╚══════╝╚═╝  ╚═╝ ╚══╝╚══╝
    By WithSecure Countercept (@FranticTyping, @AlexKornitzer)

[+] Loading forensic artefacts from: ./Microsoft-Windows-Sysmon-Operational.evtx
[+] Loaded 1 forensic files (1.1 MB)
[+] Searching forensic artefacts...

    Image: C:\Program Files\Mozilla Firefox\firefox.exe
    QueryName: uc2f030016253ec53f4953980a4e.dl.dropboxusercontent.com
      SystemTime: 2024-02-14T03:41:26.444119Z
    Image: C:\Program Files\Mozilla Firefox\firefox.exe
    QueryName: d.dropbox.com
      SystemTime: 2024-02-14T03:41:45.779318Z
    Image: C:\Users\CyberJunkie\Downloads\Preventivo24.02.14.exe.exe
    QueryName: www.example.com
      SystemTime: 2024-02-14T03:41:58.764837Z
[+] Found 3 hits
```

::: tip :bulb: Answer
`Dropbox`
:::

> Hint: Event ID 22 can be used to look for any DNS Queries made by the system. Do not filter for any specific event ID; start analyzing the events from the oldest available event. If you see events related to the malicious file being created, look for an Event ID 22 event surrounding that event.

### 4. The initial malicious file time-stamped (a defense evasion technique, where the file creation date is changed to make it appear old) many files it created on disk. What was the timestamp changed to for a PDF file?

Sysmon has [Event ID 2: A process changed a file creation time](https://learn.microsoft.com/en-us/sysinternals/downloads/sysmon#event-id-2-a-process-changed-a-file-creation-time): The change file creation time event is registered when a file creation time is explicitly modified by a process. This event helps tracking the real creation time of a file. Attackers may change the file creation time of a backdoor to make it look like it was installed with the operating system. Note that many processes legitimately change the creation time of a file; it does not necessarily indicate malicious activity.

Filter for events and look for pdf. I narrowed down the search to some fields and what we need is `CreationUtcTime`
```powershell
➜ ~\source\chainsaw\chainsaw.exe search -t 'Event.System.EventID: =2' ./Microsoft-Windows-Sysmon-Operational.evtx | sls 'CreationUtcTime|Image|TargetFilename|PreviousCreationUtcTime'
...
    CreationUtcTime: 2024-01-14 08:10:06.029
    Image: C:\Users\CyberJunkie\Downloads\Preventivo24.02.14.exe.exe
    PreviousCreationUtcTime: 2024-02-14 03:41:58.404
    TargetFilename: C:\Users\CyberJunkie\AppData\Roaming\Photo and Fax Vn\Photo and vn 1.1.2\install\F97891C\TempFolder\~.pdf
...
```

::: tip :bulb: Answer
`2024-01-14 08:10:06`
:::

> Hint: Filter for Event ID 2. This event ID records any file creation time changes on any files on the system.
### 5. The malicious file dropped a few files on disk. Where was "once.cmd" created on disk? Please answer with the full path along with the filename.

[Event ID 11: FileCreate](https://learn.microsoft.com/en-us/sysinternals/downloads/sysmon#event-id-11-filecreate) can be used to identify where and when the file was created.

```powershell
➜ ~\source\chainsaw\chainsaw.exe search -t 'Event.System.EventID: =11' .\Microsoft-Windows-Sysmon-Operational.evtx | sls once.cmd

    By WithSecure Countercept (@FranticTyping, @AlexKornitzer)

[+] Loading forensic artefacts from: .\Microsoft-Windows-Sysmon-Operational.evtx
[+] Loaded 1 forensic files (1.1 MB)
[+] Searching forensic artefacts...

    TargetFilename: C:\Users\CyberJunkie\AppData\Roaming\Photo and Fax Vn\Photo and vn 1.1.2\install\F97891C\WindowsVolume\Games\once.cmd
    TargetFilename: C:\Games\once.cmd
[+] Found 56 hits
```

::: tip :bulb: Answer
`C:\Users\CyberJunkie\AppData\Roaming\Photo and Fax Vn\Photo and vn 1.1.2\install\F97891C\WindowsVolume\Games\once.cmd`
:::

> Hint: Filter for Event ID 11 and note the files created where the Image name is the name of the malicious file.

### 6. The malicious file attempted to reach a dummy domain, most likely to check the internet connection status. What domain name did it try to connect to?

In the Question 3 query we saw `Preventivo24.02.14.exe.exe` binary making DNS request to `example.com` probably to test connection.

```powershell
    Image: C:\Users\CyberJunkie\Downloads\Preventivo24.02.14.exe.exe
    QueryName: www.example.com
      SystemTime: 2024-02-14T03:41:58.764837Z
```

::: tip :bulb: Answer
`www.example.com`
:::

### 7. Which IP address did the malicious process try to reach out to?

[Event ID 3: Network connection](https://learn.microsoft.com/en-us/sysinternals/downloads/sysmon#event-id-11-filecreate): The network connection event logs TCP/UDP connections on the machine. It is disabled by default. Each connection is linked to a process through the `ProcessId` and `ProcessGuid` fields. The event also contains the source and destination host names IP addresses, port numbers and IPv6 status.

```powershell
➜ ~\source\chainsaw\chainsaw.exe search -t 'Event.System.EventID: =3' .\Microsoft-Windows-Sysmon-Operational.evtx | sls "Dest|Source"

    By WithSecure Countercept (@FranticTyping, @AlexKornitzer)

[+] Loading forensic artefacts from: .\Microsoft-Windows-Sysmon-Operational.evtx
[+] Loaded 1 forensic files (1.1 MB)
[+] Searching forensic artefacts...

    DestinationHostname: '-'
    DestinationIp: 93.184.216.34
    DestinationIsIpv6: false
    DestinationPort: 80
    DestinationPortName: '-'
    SourceHostname: '-'
    SourceIp: 172.17.79.132
    SourceIsIpv6: false
    SourcePort: 61177
    SourcePortName: '-'
[+] Found 1 hits
```

![Writeup-3.png](/assets/soc/sherlocks/unit42/Writeup-3.png)

::: tip :bulb: Answer
`93.184.216.34`
:::

> Hint: Look for Event ID 3. It records the IP address, port, and the process trying to make the connection.
### 8. The malicious process terminated itself after infecting the PC with a backdoored variant of UltraVNC. When did the process terminate itself?

[Event ID 5: Process terminated](https://learn.microsoft.com/en-us/sysinternals/downloads/sysmon#event-id-5-process-terminated)

```powershell
➜ ~\source\chainsaw\chainsaw.exe search -t 'Event.System.EventID: =5' .\Microsoft-Windows-Sysmon-Operational.evtx

    By WithSecure Countercept (@FranticTyping, @AlexKornitzer)

[+] Loading forensic artefacts from: .\Microsoft-Windows-Sysmon-Operational.evtx
[+] Loaded 1 forensic files (1.1 MB)
[+] Searching forensic artefacts...
---
Event:
  EventData:
    Image: C:\Users\CyberJunkie\Downloads\Preventivo24.02.14.exe.exe
    ProcessGuid: 817BDDF3-3684-65CC-2D02-000000001900
    ProcessId: 10672
    RuleName: '-'
    User: DESKTOP-887GK2L\CyberJunkie
    UtcTime: 2024-02-14 03:41:58.795
  System:
    Channel: Microsoft-Windows-Sysmon/Operational
    Computer: DESKTOP-887GK2L
    Correlation: null
    EventID: 5
    EventRecordID: 118907
    Execution_attributes:
      ProcessID: 3028
      ThreadID: 4412
    Keywords: '0x8000000000000000'
    Level: 4
    Opcode: 0
    Provider_attributes:
      Guid: 5770385F-C22A-43E0-BF4C-06F5698FFBD9
      Name: Microsoft-Windows-Sysmon
    Security_attributes:
      UserID: S-1-5-18
    Task: 5
    TimeCreated_attributes:
      SystemTime: 2024-02-14T03:41:58.799651Z
    Version: 3
Event_attributes:
  xmlns: http://schemas.microsoft.com/win/2004/08/events/event

[+] Found 1 hits
```

::: tip :bulb: Answer
`2024-02-14 03:41:58`
:::