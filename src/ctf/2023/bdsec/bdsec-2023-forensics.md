# Forensics

## SYSTEM CHECK 

### Description

My friend David, who is a manager at company XYX, handles all types of calculations and user data on his exceptionally fast computer. Due to its speed and the abundance of data it contains, his computer became a common target for Black hat hackers seeking to compromise high-performance systems with valuable information. As a result, hackers targeted David's computer. However, it wasn't just one hacker involved; there was another hacker aiming to gain physical access to the computer using a rubber ducky.

Both hackers managed to successfully breach the computer's security and install their own software as desired. Upon starting his computer, David noticed TWO unusual pop-ups and experienced a significant decrease in system performance. Worried about the situation, he checked the task manager and observed abnormal resource usage.

In response to David's concern, he informed me, and I conducted some forensic investigation. David provided me with the .ova file to analyze further. With this information, I will thoroughly research the Windows system, identify the extent of the compromise, and recommend appropriate remediation steps to alleviate the effects of the hacking incident. Rest assured, I will do my best to assist my friend David and help him restore his computer's security and normal functionality.

As a White hat hacker Can you please help me to find out some thing?
::: warning :warning:
Config Note: __Uncheck additional options: Import Hard drives as VDI__ And __Don't Press any key when It need boot from CD AND DVD__
:::
::: info :information_source:
.ova file password: bdsec
:::

**Download Link :**  [Link](https://drive.google.com/file/d/1u8dg25_mlsOsK89b999uMoOia_42m9-s/view?usp=sharing)<br>
**Alternative Download Link:**  [Link](https://drive.google.com/drive/folders/1dAf_Vyv0gqBYmuyP-LCy4dcaP_muB4SS?usp=sharing)

When Last system audit policy was changed?

Flag Format:BDSEC{MM/DD/YEAR_Hour:Minute:Second_Am/PM}<br>
Example: BDSEC{01/01/2001_01:01:01_PM}

_Author : pmsiam0_

### Solution

After reading this really long backstory first thing we need to do is open system in virtual box. Import the ova file and let it boot up.

![system-check-1](/assets/ctf/bdsec/system-check-1.png)

Ah.. Nostalgic D:

Anyway, we need to find _when last system audit policy was changed_ so let's go to Event Viewer. Security logs should have events about audits.

![system-check-2](/assets/ctf/bdsec/system-check-2.png)

Use `Filter` to filter for [4719(S): System audit policy was changed.](https://learn.microsoft.com/en-us/windows/security/threat-protection/auditing/event-4719)<br>
Filter Current Log -> 4719 (Inside All Event Ids\>)

![system-check-3](/assets/ctf/bdsec/system-check-3.png)
::: tip Flag
`BDSEC{07/20/2023_07:12:17_AM}`
:::

## Maintain schedule 

### Description

My friend highly maintains a schedule and takes regular actions. However, sometimes he forgets to do certain tasks. As a good friend, I want to help him by finding out about his work. Can you please assist me to find his today's work?
::: info :information_source:
Use the first challenge file to solve all the forensics challenges.
:::

**Author: Siam**

### Solution

Since schedule is mentioned we probably should look into [Task Scheduler](https://learn.microsoft.com/en-us/windows/win32/taskschd/about-the-task-scheduler).

![maintain-schedule-1](/assets/ctf/bdsec/maintain-schedule-1.png)

After navigating to tasks we see ctf related tasks. First event is disabled, so other must be what "friend's today's work" is. <br>
Go to `task properties -> actions -> edit` to view task details.

![maintain-schedule-2](/assets/ctf/bdsec/maintain-schedule-2.png)

::: tip Flag
`BDSEC{You_Are_L3g3nd_#proved}`
:::

## Hacker destination file

### Description

Second hacker who accessed physically he is quit smart but not too much.He set a path destination but file is missing. But it must be noticed that CPU power consume constrantly. You Must need to find that file which is missing from folder.

_Author : pmsiam0_

### Solution

The malicious file must have been put in startup programs. In Windows 7 open **MSConfig** and navigate to startup.

![hacker-destination-file-1](/assets/ctf/bdsec/hacker-destination-file-1.png)

For this challenge we need second startup program, which is located at:

![hacker-destination-file-2](/assets/ctf/bdsec/hacker-destination-file-2.png)

The txt file contains a shell object which executes command.

![hacker-destination-file-3](/assets/ctf/bdsec/hacker-destination-file-3.png)

The executable being run is hidden, I used `cmd` to list hidden files/directories.

![hacker-destination-file-4](/assets/ctf/bdsec/hacker-destination-file-4.png)
::: tip Flag
`BDSEC{Y3s#_y0U#_g0T#_F14G}`
:::

## Hackers username and email

### Description

First hacker Much more intelligent.But he somehow mistake something. When I investigate this things. I see something jussy things which is Hackers Username and his Email address. Can you also find this?

Flag Format: BDSEC{username_email}

**Author: Siam**

### Solution

Going back to previous challenge there was second program in Startup Programs.<br>
By navigating to that directory we find ___[XMRig Miner](https://xmrig.com)___ (crytocurrency miner). For it to run correctly there should be credentials stored somewhere.

![hackers-username-and-email-1](/assets/ctf/bdsec/hackers-username-and-email-1.png)

Notepad showed terribly unformatted json so I used `cmd` command `more config.json` to get nice output. After scrolling down a bit we see username and email.

![hackers-username-and-email-2](/assets/ctf/bdsec/hackers-username-and-email-2.png)
::: tip Flag
`BDSEC{comando1337_blbna@mail2tor.com}`
:::

## Find Values

### Description

Find The SHA 1 value of the Windows 7 ovf and vmdk file

Flag format: BDSEC{value1_value2}

**Author: Siam**

For this challenge we don't need VM anymore, but we need OVA file. OVA can actually be opened with archive software, like 7z.

![find-values-1](/assets/ctf/bdsec/find-values-1.png)

I used Powershell to get file hashes.

```powershell
PS C:\Users\...\Downloads\Windows 7> Get-FileHash -Algorithm SHA1 * | Format-List

Algorithm : SHA1
Hash      : 2A3760CBF758C78BF5EC18A5C547B7DA31E44D35
Path      : C:\Users\...\Downloads\Windows 7\Windows 7-disk001.vmdk

Algorithm : SHA1
Hash      : 639DED7BA3889E627CEC08AEF95C609AF52C18BB
Path      : C:\Users\...\Downloads\Windows 7\Windows 7.mf

Algorithm : SHA1
Hash      : 11BC7CC41D7BA2FD92724500F4CBEC3F6D44108A
Path      : C:\Users\...\Downloads\Windows 7\Windows 7.ovf
```
::: tip Flag
`BDSEC{11BC7CC41D7BA2FD92724500F4CBEC3F6D44108A_2A3760CBF758C78BF5EC18A5C547B7DA31E44D35}`
:::
