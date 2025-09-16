# Rogueone

## Description

Your SIEM system generated multiple alerts in less than a minute, indicating potential C2 communication from Simon Stark's workstation. Despite Simon not noticing anything unusual, the IT team had him share screenshots of his task manager to check for any unusual processes. No suspicious processes were found, yet alerts about C2 communications persisted. The SOC manager then directed the immediate containment of the workstation and a memory dump for analysis. As a memory forensics expert, you are tasked with assisting the SOC team at Forela to investigate and resolve this urgent incident.
## Files

```powershell
➜ 7z l .\RogueOne.zip

7-Zip 22.01 (x64) : Copyright (c) 1999-2022 Igor Pavlov : 2022-07-15

   Date      Time    Attr         Size   Compressed  Name
------------------- ----- ------------ ------------  ------------------------
2023-08-10 15:32:30 ....A   5368709120   1368046879  20230810.mem
------------------- ----- ------------ ------------  ------------------------
2023-08-10 15:32:30         5368709120   1368046879  1 files
➜ 7z x .\RogueOne.zip -p"hacktheblue"
```
## Tasks

### Task 1. Please identify the malicious process and confirm process id of malicious process.

```powershell
➜ vol.exe -f .\20230810.mem windows.malfind.Malfind | tee malfind.log
➜ cat .\malfind.log | select -First 3
Volatility 3 Framework 2.7.0

PID     Process Start VPN       End VPN Tag     Protection      CommitCharge    PrivateMemory   File output     Notes   Hexdump Disasm
➜ cat .\malfind.log | sls '\.exe'

3136    MsMpEng.exe     0x2bb32980000   0x2bb32980fff   VadS    PAGE_EXECUTE_READWRITE  1       1       Disabled       Function prologue
3136    MsMpEng.exe     0x2bb331f0000   0x2bb331f0fff   VadS    PAGE_EXECUTE_READWRITE  1       1       Disabled       Function prologue
3136    MsMpEng.exe     0x2bb335b0000   0x2bb335b0fff   VadS    PAGE_EXECUTE_READWRITE  1       1       Disabled       Function prologue
3136    MsMpEng.exe     0x2bb333f0000   0x2bb333f0fff   VadS    PAGE_EXECUTE_READWRITE  1       1       Disabled       Function prologue
3136    MsMpEng.exe     0x2bb33400000   0x2bb33401fff   VadS    PAGE_EXECUTE_READWRITE  2       1       Disabled       Function prologue
3136    MsMpEng.exe     0x2bb33490000   0x2bb33492fff   VadS    PAGE_EXECUTE_READWRITE  3       1       Disabled       Function prologue
3136    MsMpEng.exe     0x2bb334a0000   0x2bb334a0fff   VadS    PAGE_EXECUTE_READWRITE  1       1       Disabled       Function prologue
3136    MsMpEng.exe     0x2bb33510000   0x2bb33511fff   VadS    PAGE_EXECUTE_READWRITE  2       1       Disabled       Function prologue
3136    MsMpEng.exe     0x2bb335f0000   0x2bb335f7fff   VadS    PAGE_EXECUTE_READWRITE  8       1       Disabled       Function prologue
3136    MsMpEng.exe     0x2bb34f70000   0x2bb3506ffff   VadS    PAGE_EXECUTE_READWRITE  256     1       Disabled       Function prologue
3136    MsMpEng.exe     0x2bb360e0000   0x2bb362dffff   VadS    PAGE_EXECUTE_READWRITE  512     1       Disabled       Function prologue
6812    svchost.exe     0x1b0000        0x1e1fff        VadS    PAGE_EXECUTE_READWRITE  50      1       Disabled       MZ header
```

The `malfind` plugin finds malicious programs and dumps details about them. What we should look for is `MZ Header`. `MZ` is Windows executable file signature (Magic Bytes if you will). If `malfind` identified the process as malicious and there's no other `MZ` headers then this program is definitely malicious.

::: tip :bulb: Answer
`6812`
:::

### Task 2. The SOC team believe the malicious process may spawned another process which enabled threat actor to execute commands. What is the process ID of that child process?

From [Hacktricks](https://book.hacktricks.xyz/generic-methodologies-and-resources/basic-forensic-methodology/memory-dump-analysis/volatility-cheatsheet#list-processes):
```bash
python3 vol.py -f file.dmp windows.pstree.PsTree # Get processes tree (not hidden)
python3 vol.py -f file.dmp windows.pslist.PsList # Get process list (EPROCESS)
python3 vol.py -f file.dmp windows.psscan.PsScan # Get hidden process list(malware)
```

```powershell
➜ vol.exe -f .\20230810.mem windows.psscan.PsScan | Tee-Object -FilePath psscan.log
Volatility 3 Framework 2.7.0    PDB scanning finished

PID     PPID    ImageFileName   Offset(V)       Threads Handles SessionId       Wow64   CreateTime      ExitTime        File output
➜ cat .\psscan.log | sls 6812

6812    7436    svchost.exe     0x9e8b87762080  3       -       1       False   2023-08-10 11:30:03.000000      N/A     Disabled
4364    6812    cmd.exe 0x9e8b8b6ef080  1       -       1       False   2023-08-10 11:30:57.000000      N/A     Disabled
```

Filtering by PID reveals `cmd.exe` being spawned from `svchost.exe`

::: tip :bulb: Answer
`4364`
:::

### Task 3. The reverse engineering team need the malicious file sample to analyze. Your SOC manager instructed you to find the hash of the file and then forward the sample to reverse engineering team. What's the md5 hash of the malicious file?

```powershell
➜ $dirname='dumpfiles.6812'; mkdir "$dirname"; vol.exe -f .\20230810.mem -o "$dirname" windows.dumpfiles.DumpFiles --pid 6812 | Tee-Object -FilePath "$dirname/$dirname.log" 
Volatility 3 Framework 2.7.0    PDB scanning finished

Cache   FileObject      FileName        Result

DataSectionObject       0x9e8b894b5de0  SortDefault.nls Error dumping file
DataSectionObject       0x9e8b886f89d0  locale.nls      Error dumping file
DataSectionObject       0x9e8b91ec0140  svchost.exe     Error dumping file
ImageSectionObject      0x9e8b91ec0140  svchost.exe     file.0x9e8b91ec0140.0x9e8b957f24c0.ImageSectionObject.svchost.exe.img
ImageSectionObject      0x9e8b886c3d40  crypt32.dll     file.0x9e8b886c3d40.0x9e8b886726e0.ImageSectionObject.crypt32.dll.img
ImageSectionObject      0x9e8b894d2d00  mswsock.dll     file.0x9e8b894d2d00.0x9e8b8943da20.ImageSectionObject.mswsock.dll.img
ImageSectionObject      0x9e8b8a4e3460  winmm.dll       file.0x9e8b8a4e3460.0x9e8b8a60d920.ImageSectionObject.winmm.dll.img
ImageSectionObject      0x9e8b8b0708b0  wininet.dll     file.0x9e8b8b0708b0.0x9e8b8a2a3d20.ImageSectionObject.wininet.dll.img
ImageSectionObject      0x9e8b8a4e4270  mpr.dll         file.0x9e8b8a4e4270.0x9e8b8a656d00.ImageSectionObject.mpr.dll.img
ImageSectionObject      0x9e8b8ae25140  cscapi.dll      file.0x9e8b8ae25140.0x9e8b8a7e5a20.ImageSectionObject.cscapi.dll.img
ImageSectionObject      0x9e8b894d69f0  rsaenh.dll      file.0x9e8b894d69f0.0x9e8b89492d20.ImageSectionObject.rsaenh.dll.img
ImageSectionObject      0x9e8b89f9e870  winhttp.dll     file.0x9e8b89f9e870.0x9e8b889f3a70.ImageSectionObject.winhttp.dll.img
ImageSectionObject      0x9e8b8a4de640  netapi32.dll    file.0x9e8b8a4de640.0x9e8b8a6062b0.ImageSectionObject.netapi32.dll.img
ImageSectionObject      0x9e8b89de26e0  dhcpcsvc6.dll   file.0x9e8b89de26e0.0x9e8b89e02050.ImageSectionObject.dhcpcsvc6.dll.img
ImageSectionObject      0x9e8b89de1740  dhcpcsvc.dll    file.0x9e8b89de1740.0x9e8b89daf7f0.ImageSectionObject.dhcpcsvc.dll.img
ImageSectionObject      0x9e8b894d2850  IPHLPAPI.DLL    file.0x9e8b894d2850.0x9e8b89442cf0.ImageSectionObject.IPHLPAPI.DLL.img
ImageSectionObject      0x9e8b894d50f0  wkscli.dll      file.0x9e8b894d50f0.0x9e8b89491a20.ImageSectionObject.wkscli.dll.img
ImageSectionObject      0x9e8b894d3980  dnsapi.dll      file.0x9e8b894d3980.0x9e8b89442a20.ImageSectionObject.dnsapi.dll.img
ImageSectionObject      0x9e8b886e03e0  ucrtbase.dll    file.0x9e8b886e03e0.0x9e8b88575990.ImageSectionObject.ucrtbase.dll.img
ImageSectionObject      0x9e8b89399400  sspicli.dll     file.0x9e8b89399400.0x9e8b88af3d30.ImageSectionObject.sspicli.dll.img
ImageSectionObject      0x9e8b894b4b20  cryptsp.dll     file.0x9e8b894b4b20.0x9e8b8941bcc0.ImageSectionObject.cryptsp.dll.img
ImageSectionObject      0x9e8b894b4cb0  cryptbase.dll   file.0x9e8b894b4cb0.0x9e8b8943ba20.ImageSectionObject.cryptbase.dll.img
ImageSectionObject      0x9e8b894b3860  msasn1.dll      file.0x9e8b894b3860.0x9e8b88a9ad80.ImageSectionObject.msasn1.dll.img
ImageSectionObject      0x9e8b893998b0  userenv.dll     file.0x9e8b893998b0.0x9e8b88ac1d30.ImageSectionObject.userenv.dll.img
ImageSectionObject      0x9e8b893990e0  profapi.dll     file.0x9e8b893990e0.0x9e8b882f9d30.ImageSectionObject.profapi.dll.img
ImageSectionObject      0x9e8b886c4830  msvcp_win.dll   file.0x9e8b886c4830.0x9e8b88680d20.ImageSectionObject.msvcp_win.dll.img
ImageSectionObject      0x9e8b886c4b50  KernelBase.dll  file.0x9e8b886c4b50.0x9e8b88677b20.ImageSectionObject.KernelBase.dll.img
ImageSectionObject      0x9e8b878da700  kernel32.dll    file.0x9e8b878da700.0x9e8b88562c20.ImageSectionObject.kernel32.dll.img
ImageSectionObject      0x9e8b885f5b50  advapi32.dll    file.0x9e8b885f5b50.0x9e8b881a9c00.ImageSectionObject.advapi32.dll.img
ImageSectionObject      0x9e8b885f4570  bcrypt.dll      file.0x9e8b885f4570.0x9e8b87cbe3b0.ImageSectionObject.bcrypt.dll.img
ImageSectionObject      0x9e8b885f5510  gdi32full.dll   file.0x9e8b885f5510.0x9e8b885c4ce0.ImageSectionObject.gdi32full.dll.img
ImageSectionObject      0x9e8b885f4d40  bcryptprimitives.dll    file.0x9e8b885f4d40.0x9e8b885764d0.ImageSectionObject.bcryptprimitives.dll.img
ImageSectionObject      0x9e8b885f56a0  win32u.dll      file.0x9e8b885f56a0.0x9e8b88576010.ImageSectionObject.win32u.dll.img
ImageSectionObject      0x9e8b885f4250  psapi.dll       file.0x9e8b885f4250.0x9e8b88576990.ImageSectionObject.psapi.dll.img
ImageSectionObject      0x9e8b878daed0  sechost.dll     file.0x9e8b878daed0.0x9e8b878d7ca0.ImageSectionObject.sechost.dll.img
ImageSectionObject      0x9e8b878da890  shlwapi.dll     file.0x9e8b878da890.0x9e8b885b7bf0.ImageSectionObject.shlwapi.dll.img
ImageSectionObject      0x9e8b878db1f0  gdi32.dll       file.0x9e8b878db1f0.0x9e8b878d6920.ImageSectionObject.gdi32.dll.img
ImageSectionObject      0x9e8b878da570  nsi.dll         file.0x9e8b878da570.0x9e8b88576bf0.ImageSectionObject.nsi.dll.img
ImageSectionObject      0x9e8b884f7570  user32.dll      file.0x9e8b884f7570.0x9e8b884bacc0.ImageSectionObject.user32.dll.img
ImageSectionObject      0x9e8b885206a0  ws2_32.dll      file.0x9e8b885206a0.0x9e8b8855fd00.ImageSectionObject.ws2_32.dll.img
DataSectionObject       0x9e8b8851f890  ole32.dll       Error dumping file
ImageSectionObject      0x9e8b8851f890  ole32.dll       file.0x9e8b8851f890.0x9e8b88560d00.ImageSectionObject.ole32.dll.img
ImageSectionObject      0x9e8b88520830  combase.dll     file.0x9e8b88520830.0x9e8b8855bc10.ImageSectionObject.combase.dll.img
ImageSectionObject      0x9e8b885201f0  msvcrt.dll      file.0x9e8b885201f0.0x9e8b88164d40.ImageSectionObject.msvcrt.dll.img
DataSectionObject       0x9e8b88520380  oleaut32.dll    Error dumping file
ImageSectionObject      0x9e8b88520380  oleaut32.dll    file.0x9e8b88520380.0x9e8b8853ebb0.ImageSectionObject.oleaut32.dll.img
ImageSectionObject      0x9e8b884f70c0  rpcrt4.dll      file.0x9e8b884f70c0.0x9e8b884b3a20.ImageSectionObject.rpcrt4.dll.img
DataSectionObject       0x9e8b884f8ce0  imm32.dll       Error dumping file
ImageSectionObject      0x9e8b884f8ce0  imm32.dll       file.0x9e8b884f8ce0.0x9e8b884baa20.ImageSectionObject.imm32.dll.img
ImageSectionObject      0x9e8b882ca920  ntdll.dll       file.0x9e8b882ca920.0x9e8b882e4010.ImageSectionObject.ntdll.dll.img
```

Get the MD5 hash:
```powershell
➜ Get-FileHash ./$dirname/file.0x9e8b91ec0140.0x9e8b957f24c0.ImageSectionObject.svchost.exe.img -Algorithm MD5

Algorithm       Hash                                                                   Path
---------       ----                                                                   ----
MD5             5BD547C6F5BFC4858FE62C8867ACFBB5                                       ~\dumpfiles.6812\file.0x9e8b91ec0140.0x9e8b957f24c0.ImageSectionObject.svchost.exe.img
```

::: tip :bulb: Answer
`5BD547C6F5BFC4858FE62C8867ACFBB5`
:::

### Task 4. In order to find the scope of the incident, the SOC manager has deployed a threat hunting team to sweep across the environment for any indicator of compromise. It would be a great help to the team if you are able to confirm the C2 IP address and ports so our team can utilize these in their sweep.

```powershell
➜ vol.exe -f .\20230810.mem windows.netscan.NetScan | Tee-Object -FilePath netscan.log
Volatility 3 Framework 2.7.0    PDB scanning finished

Offset  Proto   LocalAddr       LocalPort       ForeignAddr     ForeignPort     State   PID     Owner   Created
...
➜ cat .\netscan.log | sls 6812 # PID of svchost.exe process
0x9e8b8cb58010  TCPv4   172.17.79.131   64254   13.127.155.166  8888    ESTABLISHED     6812    svchost.exe     2023-08-10 11:30:03.000000
```

::: tip :bulb: Answer
`13.127.155.166:8888`
:::

### Task 5. We need a timeline to help us scope out the incident and help the wider DFIR team to perform root cause analysis. Can you confirm time the process was executed and C2 channel was established?

The connection `Created` column can be seen in `netscan.log`

::: tip :bulb: Answer
`10/08/2023 11:30:03`
:::

### Task 6. What is the memory offset of the malicious process?

`psscan.log` contains program offset in hex.

```bash
└─$ grep '^6812' *.log -ain
malfind.log:728:6812    svchost.exe     0x1b0000        0x1e1fff        VadS    PAGE_EXECUTE_READWRITE  50      1       Disabled        MZ header
psscan.log:9:6812       7436    svchost.exe     0x9e8b87762080  3       -       1       False   2023-08-10 11:30:03.000000      N/A     Disabled
```

::: tip :bulb: Answer
`0x9e8b87762080`
:::

### Task 7. You successfully analyzed a memory dump and received praise from your manager. The following day, your manager requests an update on the malicious file. You check VirusTotal and find that the file has already been uploaded, likely by the reverse engineering team. Your task is to determine when the sample was first submitted to VirusTotal.

From "Task 3" we got the hash of malicious program. We can use it to search the VirusTotal with `5BD547C6F5BFC4858FE62C8867ACFBB5` hash for already known malicious programs.

[https://www.virustotal.com/gui/file/eaf09578d6eca82501aa2b3fcef473c3795ea365a9b33a252e5dc712c62981ea/details](https://www.virustotal.com/gui/file/eaf09578d6eca82501aa2b3fcef473c3795ea365a9b33a252e5dc712c62981ea/details)

![Writeup.png](/assets/soc/sherlocks/rogueone/Writeup.png)

We're interested in `First Submission` datetime.

::: tip :bulb: Answer
`10/08/2023 11:58:10`
:::

