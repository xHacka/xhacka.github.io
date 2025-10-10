# Logjammer

## Description

You have been presented with the opportunity to work as a junior DFIR consultant for a big consultancy. However, they have provided a technical assessment for you to complete. The consultancy Forela-Security would like to gauge your Windows Event Log Analysis knowledge. We believe the Cyberjunkie user logged in to his computer and may have taken malicious actions. Please analyze the given event logs and report back.
## Files

```powershell
➜ 7z l ..\logjammer.zip

   Date      Time    Attr         Size   Compressed  Name
------------------- ----- ------------ ------------  ------------------------
2023-07-21 19:33:40 D....            0            0  Event-Logs
2023-03-27 23:00:12 .....     12652544       797786  Event-Logs\Powershell-Operational.evtx
2023-03-27 22:53:06 .....      1118208        15850  Event-Logs\Security.evtx
2023-03-27 23:02:26 .....      2166784       186994  Event-Logs\System.evtx
2023-03-27 22:53:48 .....      1118208        49178  Event-Logs\Windows Defender-Operational.evtx
2023-03-27 22:53:28 .....      1118208        90743  Event-Logs\Windows Firewall-Firewall.evtx
------------------- ----- ------------ ------------  ------------------------
2023-07-21 19:33:40           18173952      1140551  5 files, 1 folders
➜ 7z x .\logjammer.zip -p'hacktheblue'^C
```
## Tasks

### Task 1. When did the cyberjunkie user first successfully log into his computer? (UTC)

[4624: An account was successfully logged on](https://www.ultimatewindowssecurity.com/securitylog/encyclopedia/event.aspx?eventid=4624) _This is a highly valuable event since it documents each and every successful attempt to logon to the local computer regardless of logon type, location of the user or type of account.  You can tie this event to logoff events [4634](https://www.ultimatewindowssecurity.com/securitylog/encyclopedia/event.aspx?eventID=4634) and [4647](https://www.ultimatewindowssecurity.com/securitylog/encyclopedia/event.aspx?eventID=4647) using Logon ID._

```powershell
➜ ~\source\repos\chainsaw\chainsaw.exe search -e 'CyberJunkie' -t 'Event.System.EventID: =4624' .\Security.evtx -j  | jq '.[] | {TargetUserName: .Event.EventData.TargetUserName, SystemTime: .Event.System.TimeCreated_attributes.SystemTime}'

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
[+] Found 4 hits
{
  "TargetUserName": "CyberJunkie",
  "SystemTime": "2023-03-27T14:37:09.879891Z" # <--
}
{
  "TargetUserName": "CyberJunkie",
  "SystemTime": "2023-03-27T14:37:09.879940Z"
}
{
  "TargetUserName": "CyberJunkie",
  "SystemTime": "2023-03-27T14:38:32.937423Z"
}
{
  "TargetUserName": "CyberJunkie",
  "SystemTime": "2023-03-27T14:38:32.937458Z"
}
```

::: tip :bulb: Answer
`27/03/2023 14:37:09` (DD/MM/YYYY HH:mm:ss)
:::

### Task 2. The user tampered with firewall settings on the system. Analyze the firewall event logs to find out the Name of the firewall rule added?

After opening `Windows Firewall-Firewall.evtx` the very first event I saw was `Event ID: 2004` which states that `A rule has been added to the Windows Defender Firewall exception list.` and the rule name is `Metasploit C2 Bypass`.

![Writeup.png](/assets/soc/sherlocks/logjammer/Writeup.png)

```powershell
➜ ~\source\repos\chainsaw\chainsaw.exe search '.' '.\Windows Firewall-Firewall.evtx' -j | jq '.[].Event.System.EventID' | Sort-Object | Get-Unique

    By WithSecure Countercept (@FranticTyping, @AlexKornitzer)

[+] Loading forensic artefacts from: .\Windows Firewall-Firewall.evtx
[+] Loaded 1 forensic files (1.1 MB)
[+] Searching forensic artefacts...
[+] Found 929 hits
2004: A rule has been added to the Windows Defender Firewall exception list.
2005: A rule has been modified in the Windows Defender Firewall exception list.
2006: A rule has been deleted in the Windows Defender Firewall exception list.
2010: Network profile changed on an interface.
2033: All rules have been deleted from the Windows Defender Firewall configuration on this computer.
2051: Tenant Restrictions Policy Update
```

::: info Note
The command only shows unique event ids, descriptions was added manually from evtx.
:::

::: tip :bulb: Answer
`Metasploit C2 Bypass`
:::

### Task 3. What's the direction of the firewall rule?

In the XML direction is 2 (`<Data Name="Direction">2</Data>`) which means Outbound. In the General tab we can see it in a nicer format.

![Writeup-1.png](/assets/soc/sherlocks/logjammer/Writeup-1.png)

::: tip :bulb: Answer
`Outbound`
:::

### Task 4. The user changed audit policy of the computer. What's the Subcategory of this changed policy?

[4719: System audit policy was changed](https://www.ultimatewindowssecurity.com/securitylog/encyclopedia/event.aspx?eventid=4719)

![Writeup-2.png](/assets/soc/sherlocks/logjammer/Writeup-2.png)

::: tip :bulb: Answer
`Other Object Access Events`
:::

### Task 5. The user "cyberjunkie" created a scheduled task. What's the name of this task?

[4698: A scheduled task was created](https://www.ultimatewindowssecurity.com/securitylog/encyclopedia/event.aspx?eventid=4698)

![Writeup-3.png](/assets/soc/sherlocks/logjammer/Writeup-3.png)

::: tip :bulb: Answer
`HTB-AUTOMATION`
:::

### Task 6. What's the full path of the file which was scheduled for the task?

```xml
<Actions Context="Author">
<Exec>
  <Command>C:\Users\CyberJunkie\Desktop\Automation-HTB.ps1</Command>
  <Arguments>-A cyberjunkie@hackthebox.eu</Arguments>
</Exec>
</Actions>
```

::: tip :bulb: Answer
`C:\Users\CyberJunkie\Desktop\Automation-HTB.ps1`
:::

### Task 7. What are the arguments of the command?

::: tip :bulb: Answer
`-A cyberjunkie@hackthebox.eu`
:::

### Task 8. The antivirus running on the system identified a threat and performed actions on it. Which tool was identified as malware by antivirus?

[Review event logs and error codes to troubleshoot issues with Microsoft Defender Antivirus](https://learn.microsoft.com/en-us/defender-endpoint/troubleshoot-microsoft-defender-antivirus)

[Event ID 1117](https://learn.microsoft.com/en-us/defender-endpoint/troubleshoot-microsoft-defender-antivirus#event-id-1117): _The antimalware platform performed an action to protect your system from malware or other potentially unwanted software._

![Writeup-4.png](/assets/soc/sherlocks/logjammer/Writeup-4.png)

::: tip :bulb: Answer
`Sharphound`
:::

### Task 9. What's the full path of the malware which raised the alert?

```xml
<Data Name="Path">
containerfile:
	_C:\Users\CyberJunkie\Downloads\SharpHound-v1.1.0.zip;
file:
	_C:\Users\CyberJunkie\Downloads\SharpHound-v1.1.0.zip->SharpHound.exe;
webfile:
    _C:\Users\CyberJunkie\Downloads\SharpHound-v1.1.0.zip|
    https://objects.githubusercontent.com/github-production-release-asset-2e65be/385323486/70d776cc-8f83-44d5-b226-2dccc4f7c1e3?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAIWNJYAX4CSVEH53A%2F20230327%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20230327T144228Z&X-Amz-Expires=300&X-Amz-Signature=f969ef5ca3eec150dc1e23623434adc1e4a444ba026423c32edf5e85d881a771&X-Amz-SignedHeaders=host&actor_id=0&key_id=0&repo_id=385323486&response-content-disposition=attachment%3B%20filename%3DSharpHound-v1.1.0.zip&response-content-type=application%2Foctet-stream|
    pid:3532,
    ProcessStart:133244017530289775
</Data> 
```

::: tip :bulb: Answer
`C:\Users\CyberJunkie\Downloads\SharpHound-v1.1.0.zip`
:::

### Task 10. What action was taken by the antivirus?

```xml
Action: Quarantine
Action Status:  No additional actions required
```

::: tip :bulb: Answer
`Quarantine`
:::

### Task 11. The user used Powershell to execute commands. What command was executed by the user?

First we filter for `4104` event which logs command executions. Event that caught my eye was `Get-FileHash` command:

![Writeup-5.png](/assets/soc/sherlocks/logjammer/Writeup-5.png)

There were scripts being executed so I narrowed down search by Powershell ScriptBlockText length and got all commands issued. Only "command" we see is `Get-FileHash`, others define variables but never execute something.
```bash
➜ ~\source\repos\chainsaw\chainsaw.exe search -t 'Event.System.EventID: =4104' '.\Powershell-Operational.evtx' -j | jq '.[].Event.EventData.ScriptBlockText | select (. | length < 200)'
    By WithSecure Countercept (@FranticTyping, @AlexKornitzer)

[+] Loading forensic artefacts from: .\Powershell-Operational.evtx
[+] Loaded 1 forensic files (12.7 MB)
[+] Searching forensic artefacts...
[+] Found 381 hits
"$aes_var = New-Object System.Security.Cryptography.AesManaged;"
"$aes_var.Mode = [System.Security.Cryptography.CipherMode]::CBC;"
"$aes_var.Padding = [System.Security.Cryptography.PaddingMode]::PKCS7;"
"$decryptor_var = $aes_var.CreateDecryptor();"
"$payload_var = $decryptor_var.TransformFinalBlock($payload_var, 0, $payload_var.Length);"
"$msi_var = New-Object System.IO.MemoryStream(, $payload_var);"
"$mso_var = New-Object System.IO.MemoryStream;"
"$aes_var = New-Object System.Security.Cryptography.AesManaged;"
"$aes_var.Mode = [System.Security.Cryptography.CipherMode]::CBC;"
"$aes_var.Padding = [System.Security.Cryptography.PaddingMode]::PKCS7;"
"$decryptor_var = $aes_var.CreateDecryptor();"
"$payload_var = $decryptor_var.TransformFinalBlock($payload_var, 0, $payload_var.Length);"
"$msi_var = New-Object System.IO.MemoryStream(, $payload_var);"
"$mso_var = New-Object System.IO.MemoryStream;"
"prompt"
"Get-FileHash -Algorithm md5 .\\Desktop\\Automation-HTB.ps1"
"prompt"
```

::: tip :bulb: Answer
`Get-FileHash -Algorithm md5 .\Desktop\Automation-HTB.ps1`
:::

### Task 12. We suspect the user deleted some event logs. Which Event log file was cleared?

In the Security log we notice [1102: The audit log was cleared](https://www.ultimatewindowssecurity.com/securitylog/encyclopedia/event.aspx?eventid=1102)

![Writeup-6.png](/assets/soc/sherlocks/logjammer/Writeup-6.png)

The event happened before Logon event, so malicious actor couldn't have done this.

```powershell
➜ ~\source\repos\chainsaw\chainsaw.exe search -t 'Event.System.EventID: =104' '.\System.evtx' | sls channel

    By WithSecure Countercept (@FranticTyping, @AlexKornitzer)

[+] Loading forensic artefacts from: .\System.evtx
[+] Loaded 1 forensic files (2.2 MB)
[+] Searching forensic artefacts...

    Channel: System
      Channel: Microsoft-Windows-Sysmon/Operational
    Channel: System
      Channel: Microsoft-Windows-Sysmon/Operational
    Channel: System
      Channel: Microsoft-Windows-Sysmon/Operational
    Channel: System
      Channel: Microsoft-Windows-Sysmon/Operational
    Channel: System
      Channel: Microsoft-Windows-Sysmon/Operational
    Channel: System
      Channel: Microsoft-Windows-Sysmon/Operational
    Channel: System
      Channel: Microsoft-Windows-Sysmon/Operational
    Channel: System
      Channel: Microsoft-Windows-Sysmon/Operational
    Channel: System
      Channel: Microsoft-Windows-Sysmon/Operational
    Channel: System
      Channel: Microsoft-Windows-Sysmon/Operational
    Channel: System
      Channel: Microsoft-Windows-Sysmon/Operational
    Channel: System
      Channel: Microsoft-Windows-Sysmon/Operational
    Channel: System
      Channel: Microsoft-Windows-Sysmon/Operational
    Channel: System
      Channel: Microsoft-Windows-Sysmon/Operational
    Channel: System
      Channel: Microsoft-Windows-Windows Firewall With Advanced Security/Firewall
[+] Found 15 hits
```

The event with Channel name `Microsoft-Windows-Windows Firewall With Advanced Security/Firewall` seems the most probable and it also happens after Logon.

![Writeup-7.png](/assets/soc/sherlocks/logjammer/Writeup-7.png)

::: tip :bulb: Answer
`Microsoft-Windows-Windows Firewall With Advanced Security/Firewall`
:::

