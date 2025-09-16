# Reaper

## Description

Our SIEM alerted us to a suspicious logon event which needs to be looked at immediately . The alert details were that the IP Address and the Source Workstation name were a mismatch .You are provided a network capture and event logs from the surrounding time around the incident timeframe. Corelate the given evidence and report back to your SOC Manager.
## Files

```bash
└─$ 7z x Reaper.zip -P'hacktheblue'
 
└─$ /bin/ls -Alh Reaper
total 1.4M
-rwxrwx--- 1 root vboxsf 308K Jul 31 00:56 ntlmrelay.pcapng
-rwxrwx--- 1 root vboxsf 1.1M Jul 31 01:10 Security.evtx
```
## Tasks

### Task 1. What is the IP Address for Forela-Wkstn001?

My initial thought was to query DNS for IPs, but only `FORELA-WKSTN001`. We can use NetBIOS to resolve hostnames of internal network computers.

```bash
➜ tshark -Y "nbns" -T fields -e nbns.addr -e nbns.name -r .\ntlmrelay.pcapng | Sort-Object | Get-Unique | Select-String wkst

172.17.79.129   FORELA-WKSTN001<00>,FORELA-WKSTN001<00> (Workstation/Redirector)
172.17.79.129   FORELA-WKSTN001<20>,FORELA-WKSTN001<20> (Server service)
172.17.79.136   FORELA-WKSTN002<00>,FORELA-WKSTN002<00> (Workstation/Redirector)
172.17.79.136   FORELA-WKSTN002<20>,FORELA-WKSTN002<20> (Server service)
```

::: tip :bulb: Answer
`172.17.79.129`
:::

### Task 2. What is the IP Address for Forela-Wkstn002?

::: tip :bulb: Answer
`172.17.79.136`
:::

### Task 3. Which user account's hash was stolen by attacker?

Because we have `ntlmrelay` we should look into `LLMNR` protocol which in a nutshell is next generation NetBIOS protocol. We can see requests going not to DC, but external IP

![Writeup.png](/assets/soc/sherlocks/reaper/Writeup.png)

Filtering for `NTLMSSP` shows unsuccessful authorization requests, but the relay must have stolen user hashes from these requests.

![Writeup-1.png](/assets/soc/sherlocks/reaper/Writeup-1.png)

The victim is `FORELA\arthur.kyle` user

::: tip :bulb: Answer
`arthur kyle`
:::

### Task 4. What is the IP Address of Unknown Device used by the attacker to intercept credentials?

::: tip :bulb: Answer
`172.17.79.135`
:::

### Task 5. What was the fileshare navigated by the victim user account?

Filter smb for connection requests:

![Writeup-2.png](/assets/soc/sherlocks/reaper/Writeup-2.png)

> Hint: _Filter for smb2 traffic in Wireshark. Search for keywords "BAD_NETWORK_NAME" in packet details._

::: tip :bulb: Answer
`\\DC01\Trip`
:::

### Task 6. What is the source port used to logon to target workstation using the compromised account?



The `NTLMSSP` request from source port of `40252` was successful login.

![Writeup-3.png](/assets/soc/sherlocks/reaper/Writeup-3.png)

The event can also be found in `evtx` file by filtering for event [4624(S): An account was successfully logged on](https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-10/security/threat-protection/auditing/event-4624)

```powershell
➜ .\chainsaw\chainsaw.exe search -t 'Event.System.EventID: =4624' -t 'Event.EventData.LogonType: =3' -t 'Event.EventData.AuthenticationPackageName: NTLM' .\Security.evtx

 ██████╗██╗  ██╗ █████╗ ██╗███╗   ██╗███████╗ █████╗ ██╗    ██╗
██╔════╝██║  ██║██╔══██╗██║████╗  ██║██╔════╝██╔══██╗██║    ██║
██║     ███████║███████║██║██╔██╗ ██║███████╗███████║██║ █╗ ██║
██║     ██╔══██║██╔══██║██║██║╚██╗██║╚════██║██╔══██║██║███╗██║
╚██████╗██║  ██║██║  ██║██║██║ ╚████║███████║██║  ██║╚███╔███╔╝
 ╚═════╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝╚═╝  ╚═══╝╚══════╝╚═╝  ╚═╝ ╚══╝╚══╝
    By WithSecure Countercept (@FranticTyping, @AlexKornitzer)

[+] Loading forensic artefacts from: .\Security.evtx
[+] Loaded 1 forensic files (1.1 MB)
[+] Searching forensic artefacts...
---
Event:
  EventData:
    AuthenticationPackageName: NTLM
    ElevatedToken: '%%1843'
    ImpersonationLevel: '%%1833'
    IpAddress: 172.17.79.135
    IpPort: '40252'
    KeyLength: 128
    LmPackageName: NTLM V2
    LogonGuid: 00000000-0000-0000-0000-000000000000
    LogonProcessName: 'NtLmSsp '
    LogonType: 3
    ProcessId: '0x0'
    ProcessName: '-'
    RestrictedAdminMode: '-'
    SubjectDomainName: '-'
    SubjectLogonId: '0x0'
    SubjectUserName: '-'
    SubjectUserSid: S-1-0-0
    TargetDomainName: FORELA
    TargetLinkedLogonId: '0x0'
    TargetLogonId: '0x64a799'
    TargetOutboundDomainName: '-'
    TargetOutboundUserName: '-'
    TargetUserName: arthur.kyle
    TargetUserSid: S-1-5-21-3239415629-1862073780-2394361899-1601
    TransmittedServices: '-'
    VirtualAccount: '%%1843'
    WorkstationName: FORELA-WKSTN002
  System:
    Channel: Security
    Computer: Forela-Wkstn001.forela.local
    Correlation_attributes:
      ActivityID: FFEDC1A7-E2F8-0005-25C2-EDFFF8E2DA01
    EventID: 4624
    EventRecordID: 14610
    Execution_attributes:
      ProcessID: 784
      ThreadID: 9120
    Keywords: '0x8020000000000000'
    Level: 0
    Opcode: 0
    Provider_attributes:
      Guid: 54849625-5478-4994-A5BA-3E3B0328C30D
      Name: Microsoft-Windows-Security-Auditing
    Security: null
    Task: 12544
    TimeCreated_attributes:
      SystemTime: 2024-07-31T04:55:16.240589Z
    Version: 2
Event_attributes:
  xmlns: http://schemas.microsoft.com/win/2004/08/events/event

[+] Found 1 hits
```

::: tip :bulb: Answer
`40252`
:::

### Task 7. What is the Logon ID for the malicious session?

```powershell
➜ .\chainsaw\chainsaw.exe search -t 'Event.System.EventID: =4624' -t 'Event.EventData.LogonType: =3' -t 'Event.EventData.AuthenticationPackageName: NTLM' -q .\Security.evtx | sls Logon

    LogonGuid: 00000000-0000-0000-0000-000000000000
    LogonProcessName: 'NtLmSsp '
    LogonType: 3
    SubjectLogonId: '0x0'
    TargetLinkedLogonId: '0x0'
    TargetLogonId: '0x64a799'
```

::: tip :bulb: Answer
`0x64a799`
:::

### Task 8. The detection was based on the mismatch of hostname and the assigned IP Address.What is the workstation name and the source IP Address from which the malicious logon occur?

```powershell
➜ .\chainsaw\chainsaw.exe search -t 'Event.System.EventID: =4624' -t 'Event.EventData.LogonType: =3' -t 'Event.EventData.AuthenticationPackageName: NTLM' -q .\Security.evtx | sls 'IP|WorkstationName|TargetUsername'

    IpAddress: 172.17.79.135
    IpPort: '40252'
    TargetUserName: arthur.kyle
    WorkstationName: FORELA-WKSTN002
```

::: tip :bulb: Answer
`FORELA-WKSTN002, 172.17.79.135`
:::

### Task 9. When did the malicious logon happened. Please make sure the timestamp is in UTC?

The `SystemTime` event property shows timestamp in UTC.

```powershell
➜ .\chainsaw\chainsaw.exe search -t 'Event.System.EventID: =4624' -t 'Event.EventData.LogonType: =3' -t 'Event.EventData.AuthenticationPackageName: NTLM' -q .\Security.evtx | sls SystemTime

      SystemTime: 2024-07-31T04:55:16.240589Z
```

::: tip :bulb: Answer
`2024-07-31 04:55:16`
:::

### Task 10. What is the share Name accessed as part of the authentication process by the malicious tool used by the attacker?

If we follow the stream from Task 6, we can observe that malicious actor visited share on `\\172.17.79.129\IPC$`, but that the format is incorrect.

![Writeup-4.png](/assets/soc/sherlocks/reaper/Writeup-4.png)

Events log shows that after successful logon `\\*\IPC$` was accessed.

![Writeup-5.png](/assets/soc/sherlocks/reaper/Writeup-5.png)

- `*` is a wildcard that can refer to **any available server or computer** on the network.
- **`IPC$`**: This is a hidden administrative share used for Inter-Process Communication (IPC) between networked computers. The `$` at the end signifies that it's a hidden share, meaning it won't appear in standard network share listings.

::: tip :bulb: Answer
`\\*\IPC$`
:::

