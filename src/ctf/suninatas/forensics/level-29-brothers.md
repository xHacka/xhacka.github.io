# Level 29   Brothers

[http://suninatas.com/challenge/web29/web29.asp](http://suninatas.com/challenge/web29/web29.asp)

![level-29---brothers.png](/assets/ctf/suninatas/forensics/level-29-brothers.png)

[Download #1](https://docs.google.com/uc?id=0B8im6SjxeHFLMDlKc1JsVFJTZEk) or [Download #2](https://drive.google.com/file/d/0B8im6SjxeHFLMDlKc1JsVFJTZEk/view?usp=sharing&resourcekey=0-K7ExADDBUKv-QG2-nmp2Ww)

## VM Import

We are given an EGG file, which after lot's of research is kind of compression algorithm. Zip would have been nice :/
```bash
└─$ file Windows7\(SuNiNaTaS\)
Windows7(SuNiNaTaS): EGG archive data, version 1.0
```

**[UnEgg](https://github.com/dterracino/UnEgg)** can be used to unarchive the file, [download](https://github.com/dterracino/UnEgg/raw/refs/heads/master/Source/unegg/release-x64/unegg) for linux.

```bash
└─$ curl -LOs https://github.com/dterracino/UnEgg/raw/refs/heads/master/Source/unegg/release-x64/unegg
└─$ file unegg
unegg: ELF 64-bit LSB executable, x86-64, version 1 (SYSV), dynamically linked, interpreter /lib64/ld-linux-x86-64.so.2, for GNU/Linux 2.6.15, BuildID[sha1]=761c0ea75b7b6d23e2914806ab6f42da07763858, not stripped

└─$ ./unegg -x ./Windows7\(SuNiNaTaS\) ./out
...
100 % - caches/GuestAppsCache/appData/f6baad293a6188d9e4bf4e293e550738.appicon - CRC ok.
100 % - caches/GuestAppsCache/appData/f6baad293a6188d9e4bf4e293e550738.appinfo - CRC ok.
100 % - caches/GuestAppsCache/appData/version - CRC ok.
100 % - vmware-0.log - CRC ok.
100 % - vmware.log - CRC ok.
100 % - Windows 7-000001.vmdk - CRC ok.
100 % - Windows 7-Snapshot2.vmem - CRC ok.
100 % - Windows 7-Snapshot2.vmsn - CRC ok.
100 % - Windows 7.nvram - CRC ok.
100 % - Windows 7.vmdk - CRC ok.
100 % - Windows 7.vmsd - CRC ok.
100 % - Windows 7.vmx - CRC ok.
100 % - Windows 7.vmxf - CRC ok.

Total: 105 File(s)
```

Boot up the virtual machine with VMWare Workstation

Wow... this is nostalgic 🤣 But also cursed because I can't read Korean

![level-29---brothers-1.png](/assets/ctf/suninatas/forensics/level-29-brothers-1.png)

## Q1 : When you surf "[https://www.naver.com](https://www.naver.com)", Web browser shows something wrong. Fix it and you can find a Key

We can guess what the problem is: DNS. If you tinkered with `/etc/hosts` on Linux it's clear that we can manipulate DNS locally. On Windows it's located at `C:\Windows\System32\drivers\etc\hosts` (no extension)

![level-29---brothers-2.png](/assets/ctf/suninatas/forensics/level-29-brothers-2.png)

The file was hidden in Explorer. I ticked the box under blue box in properties On and then Off to reveal it. Alternatively use Cmd/Powershell.

> Flag 1: `what_the_he11_1s_keey`

## Q2 : Installed Keylogger's location & filename(All character is lower case)

- **Startup Folder for All Users:** `C:\ProgramData\Microsoft\Windows\Start Menu\Programs\StartUp` contains shortcuts for programs that will run at startup for all users on the computer. 
- **Startup Folder for Current User:** `C:\Users\<Username>\AppData\Roaming\Microsoft\Windows\Start Menu\Programs\Startup`, is specific to the currently logged-in user and contains shortcuts for programs that will run only when that user logs in.

Both directories are empty. Current user directory contains the instructions.txt

Alternatively: Win+R -> `shell:startup` -> Get startup location

Scheduled tasks is also empty (`taskschd.msc`)

![level-29---brothers-3.png](/assets/ctf/suninatas/forensics/level-29-brothers-3.png)

Task Manager (`taskmgr`) can't be opened: *The administrator has disabled Task Manager*.

![level-29---brothers-4.png](/assets/ctf/suninatas/forensics/level-29-brothers-4.png)

Explorer shows downloaded files, but they don't exist anymore.

![level-29---brothers-5.png](/assets/ctf/suninatas/forensics/level-29-brothers-5.png)

Get the running processes with Command Line
```powershell
PS C:\> wmic process get "name,executablepath" | Select-String -NotMatch "System32|^$"

ExecutablePath                                                        Name
                                                                      System Idle Process
                                                                      System
                                                                      smss.exe
C:\Program Files\VMware\VMware Tools\vmacthlp.exe                     vmacthlp.exe
C:\Program Files\VMware\VMware Tools\VMware VGAuth\VGAuthService.exe  VGAuthService.exe
C:\Program Files\VMware\VMware Tools\vmtoolsd.exe                     vmtoolsd.exe
C:\Windows\Explorer.EXE                                               explorer.exe
C:\Program Files\VMware\VMware Tools\vmtoolsd.exe                     vmtoolsd.exe
C:\Windows\explorer.exe                                               explorer.exe
C:\v196vv8\v1tvr0.exe                                                 v1tvr0.exe
C:\Program Files\Internet Explorer\iexplore.exe                       iexplore.exe
```

`C:\v196vv8\v1tvr0.exe` has very unusual name and location.

This is clearly the malware which logs everything we do 🧐

![level-29---brothers-6.png](/assets/ctf/suninatas/forensics/level-29-brothers-6.png)

> Flag 2: `C:\v196vv8\v1tvr0.exe`

## Q3 : Download time of Keylogger \[e.g.: 2016-05-27_22:00:00 (yyyy-mm-dd_hh:mm:ss)\]

Use something like [BrowsingHistoryView](https://www.nirsoft.net/utils/browsing_history_view.html) to view Edge History easier.

![level-29---brothers-7.png](/assets/ctf/suninatas/forensics/level-29-brothers-7.png)

> Flag 3: `2016-05-24_04:25:06`

## Q4 : What did Keylogger detect and save? There is a Key

Some digging around:
```powershell
PS C:\v196vv8\v1valv\Computer1\24052016 #training> cat .\z1.dat

오전 4:31:48    19
오전 4:37:57    How did you know pAsS\orD? Wow... Kee22 ls "blackkey is a Good man"
오전 4:38:58    notepd
```

> Flag 4: `blackkey is a Good man`

## Flag

```python
from hashlib import md5

flags = [
	"what_the_he11_1s_keey",
	r"C:\v196vv8\v1tvr0.exe".lower(),
	"2016-05-24_04:25:06",
	"blackkey is a Good man",
]

# 'what_the_he11_1s_keeyc:\\v196vv8\\v1tvr0.exe2016-05-24_04:25:06blackkey is a Good man'
flag = ''.join(flags)
print(md5(flag.encode()).hexdigest())
```

::: tip Flag
`970f891e3667fce147b222cc9a8699d4`
:::

