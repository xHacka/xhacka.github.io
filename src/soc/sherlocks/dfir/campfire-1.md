# Campfire-1

#windows #evtx #prefetch #kerberos #dfir 
## Description

Alonzo Spotted Weird files on his computer and informed the newly assembled SOC Team. Assessing the situation it is believed a Kerberoasting attack may have occurred in the network. It is your job to confirm the findings by analyzing the provided evidence. You are provided with: 1- Security Logs from the Domain Controller 2- PowerShell-Operational Logs from the affected workstation 3- Prefetch Files from the affected workstation

> Zip Password: hacktheblue
## Files

We are given `evtx` (Windows Logs) and prefetch files (`*.pf`)

```
➜ tree /f | sls -NotMatch .pf

Folder PATH listing
Volume serial number is BC69-C561
C:.
└───Triage
    ├───Domain Controller
    │       SECURITY-DC.evtx
    │
    └───Workstation
        │   Powershell-Operational.evtx
        │
        └───2024-05-21T033012_triage_asset
            └───C
                └───Windows
                    └───prefetch
```

## Tasks

### 1. Analyzing Domain Controller Security Logs, can you confirm the date & time when the kerberoasting activity occurred?

[Detecting Kerberoasting Activity](https://adsecurity.org/?p=3458) 

Event we should try to look for:

![Writeup.png](/assets/soc/sherlocks/campfire-1/Writeup.png)

Here we filter for event with ID: 4769 and look for Ticket Operation Type 0x17:

![Writeup-1.png](/assets/soc/sherlocks/campfire-1/Writeup-1.png)

Double click the event to get detailed information, the Details tab and then we find TimeCreated field which specifies when the event was generated.

![Writeup-2.png](/assets/soc/sherlocks/campfire-1/Writeup-2.png)

::: tip :bulb: Answer
**2024-05-21 03:18:09**
:::

> Hint: _In Security Logs, Filter for Event ID 4769. Now Look for any event where the service name is NOT( krbtgt or ends with $ (For e.g DC01$ ) ). The ticket type should be 0x17 which is for RC4 type encryption. The failure code should be 0x0. The event that matches all the above conditions is the event detailing information about the kerberoasting attack activity._
### 2. What is the Service Name that was targeted?

The ServiceName can be found in event details:

![Writeup-3.png](/assets/soc/sherlocks/campfire-1/Writeup-3.png)

::: tip :bulb: Answer
**MSSQLService**
:::

### 3. It is really important to identify the Workstation from which this activity occurred. What is the IP Address of the workstation?

IP can be found in Event Details

::: tip :bulb: Answer
**172.17.79.129**
:::

### 4. Now that we have identified the workstation, a triage including PowerShell logs and Prefetch files are provided to you for some deeper insights so we can understand how this activity occurred on the endpoint. What is the name of the file used to Enumerate Active directory objects and possibly find Kerberoastable accounts in the network?

The second log `Powershell-Operational.evtx` contains powershell logs and in the events we can wee `powerview.ps1` being executed.

**[PowerView](https://github.com/PowerShellMafia/PowerSploit/tree/master/Recon#powerview)** is series of functions that performs network and Windows domain enumeration and exploitation.

![Writeup-4.png](/assets/soc/sherlocks/campfire-1/Writeup-4.png)

::: tip :bulb: Answer
`powerview.ps1`
:::

> Hint: Use PowerShell logs and filter for event ID 4104. We can see all the contents of the script executed and its name as well.

### 5. When was this script executed?

The start of powershell script execution starts `Creating Scriptblock` event: 

![Writeup-5.png](/assets/soc/sherlocks/campfire-1/Writeup-5.png)

::: tip :bulb: Answer
2024-05-21 03:16:32
:::

### 6. What is the full path of the tool used to perform the actual kerberoasting attack?

[PECmd: Prefetch Explorer Command Line](https://github.com/EricZimmerman/PECmd/tree/master) can be used to parsed prefetch files into easily readable format:
```powershell
~/VBoxShare/campfire-1/Triage/Workstation ➜ ~\source\repos\PECmd\PECmd\bin\Debug\net6.0\PECmd.exe -d .\2024-05-21T033012_triage_asset\C\Windows\prefetch --csv .\parsed --csvf parsed.csv
...
CSV output will be saved to .\parsed\parsed.csv
CSV time line output will be saved to .\parsed\parsed_Timeline.csv
~/VBoxShare/campfire-1/Triage/Workstation ➜ ls .\parsed\

    Directory: ~\VBoxShare\campfire-1\Triage\Workstation\parsed

Mode                 LastWriteTime         Length Name
----                 -------------         ------ ----
-a---          22.06.2024    20:32          79715 parsed_Timeline.csv
-a---          22.06.2024    20:32        3055107 parsed.csv
```

After some filtering I first extracted all Executable Names from `parsed.csv`

```powershell
APPLICATIONFRAMEHOST.EXE
BACKGROUNDTASKHOST.EXE
CMD.EXE
COMPATTELRUNNER.EXE
CONHOST.EXE
CONSENT.EXE
CTFMON.EXE
DEFRAG.EXE
DWM.EXE
ELEVATION_SERVICE.EXE
EXCEL.EXE
FILECOAUTH.EXE
FILESYNCCONFIG.EXE
FIREFOX INSTALLER.EXE
GPUPDATE.EXE
GUP.EXE
IDENTITY_HELPER.EXE
KMS_VL_ALL_AIO.EXE
LOGONUI.EXE
MICROSOFT.SHAREPOINT.EXE
MICROSOFTEDGEUPDATE.EXE
MMC.EXE
MOBSYNC.EXE
MOUSOCOREWORKER.EXE
MPSIGSTUB.EXE
MSCORSVW.EXE
MSINFO32.EXE
NOTEPAD.EXE
NOTEPAD++.EXE
OBS64.EXE
OFFICEC2RCLIENT.EXE
OFFICECLICKTORUN.EXE
ONEDRIVE.EXE
ONEDRIVESETUP.EXE
Op-EXPLORER.EXE-D5E97654
Op-MSEDGE.EXE-37D25F9A
POWERPNT.EXE
POWERSHELL.EXE
POWERSHELL_ISE.EXE
REGEDIT.EXE
RUBEUS.EXE
RUNDLL32.EXE
RUNONCE.EXE
RUNTIMEBROKER.EXE
SEARCHAPP.EXE
SEARCHPROTOCOLHOST.EXE
SECHEALTHUI.EXE
SECURITYHEALTHHOST.EXE
SETUP.EXE
SETUP64.EXE
SGRMBROKER.EXE
SHELLEXPERIENCEHOST.EXE
SIHOST.EXE
SMARTSCREEN.EXE
SPPSVC.EXE
STARTMENUEXPERIENCEHOST.EXE
SYSTEMPROPERTIESADVANCED.EXE
SYSTEMSETTINGS.EXE
SYSTEMSETTINGSADMINFLOWS.EXE
TASKHOSTW.EXE
TASKKILL.EXE
TASKMGR.EXE
TEAMS.EXE
TEXTINPUTHOST.EXE
VSSVC.EXE
WERFAULT.EXE
WERMGR.EXE
WEVTUTIL.EXE
WINRAR.EXE
WINRAR-X64-621.EXE
WINSAT.EXE
WINWORD.EXE
WLRMDR.EXE
WMIADAP.EXE
WMIPRVSE.EXE
```

After going over the list we notice [RUBEUS.EXE](https://github.com/GhostPack/Rubeus): _Rubeus is a C# toolset for raw Kerberos interaction and abuses_

In `FilesLoaded` column we can see the location the file was saved to:
```
\VOLUME{01d951602330db46-52233816}\USERS\ALONZO.SPIRE\DOWNLOADS\RUBEUS.EXE
```

::: tip :bulb: Answer
`C:\USERS\ALONZO.SPIRE\DOWNLOADS\RUBEUS.EXE`
:::

### 7. When was the tool executed to dump credentials?

`LastRun` column contains the data `21.05.2024 03:18`

::: tip :bulb: Answer
2024-05-21 03:18:08
:::
