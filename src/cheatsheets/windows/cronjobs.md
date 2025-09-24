# Cronjobs

## Start the job

```powershell
Start-Job -ScriptBlock { & "./program.exe"; }

Start-Job -ScriptBlock { & "./chisel.exe" client 10.10.14.43:36000 R:socks; }

$job = Start-Job -ScriptBlock {
    & "./chisel.exe" client 10.10.14.43:36000 R:socks
}
```

## Check the status of the job

[Get-Job](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/get-job?view=powershell-7.4)

```powershell
Get-Job $id

Get-Job $job
```

## Get the output of the job

[Receive-Job](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/Receive-Job?view=powershell-7.4)

```powershell
Receive-Job -Keep $id

Receive-Job -Keep $job
```
## Stop the job if needed

[Stop-Job](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/Stop-Job?view=powershell-7.4)

```powershell
Stop-Job $id

Stop-Job $job
```

## Remove the job from the job list

[Remove-Job](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/Remove-Job?view=powershell-7.4)

```powershell
Remove-Job $id

Remove-Job $job
```