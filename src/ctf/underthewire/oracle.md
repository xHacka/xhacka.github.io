# UnderTheWire - Oracle

## CTF Link

[https://underthewire.tech/oracle](https://underthewire.tech/oracle)

## Oracle1

### Desciption

The password for oracle2 is the timezone in which this system is set to.

**NOTE:**\
– The password is the abbreviation of the timezone. For example, if it is listed as being in the Eastern timezone, the answer is est.\
– The password will be lowercase no matter how it appears on the screen.

### Solution

```powershell
➜ ssh oracle.underthewire.tech -l oracle1 # Password: oracle1

PS C:\users\Oracle1\desktop> Get-TimeZone

Id                         : UTC
DisplayName                : (UTC) Coordinated Universal Time
StandardName               : Coordinated Universal Time
DaylightName               : Coordinated Universal Time
BaseUtcOffset              : 00:00:00
SupportsDaylightSavingTime : False
```

::: tip
oracle2 Password: utc
:::

## Oracle2

### Desciption

The password for oracle3 is the last five digits of the MD5 hash, from the hashes of files on the desktop that appears twice.

**NOTE:**\
– The password will be lowercase no matter how it appears on the screen.

### Solution

```powershell
PS C:\users\Oracle2\desktop> $fileHashes = Get-FileHash -Algorithm MD5 ./*
PS C:\users\Oracle2\desktop> $fileHashDuplicate = $fileHashes | Group Hash | Where { $_.Count -gt 1 }
PS C:\users\Oracle2\desktop> $fileHashDuplicateHash = $fileHashDuplicate.Name ; $fileHashDuplicateHash
5BE11FF0037EED156F77213658C2F5C4  
PS C:\users\Oracle2\desktop> $fileHashDuplicateHash.Substring($fileHashDuplicateHash.Length - 5).ToLower()
2f5c4
```

::: tip
oracle3 Password: 2f5c4
:::




## Oracle3

### Desciption

The password for oracle4 is the date that the system logs were last wiped as depicted in the event logs on the desktop.

**NOTE:**\
– The format for the password is 2 digit month, 2 digit day, 4 digit year. Ex: 5 Jan 2015 would be 01/05/2015.

### Solution

```powershell
PS C:\users\Oracle3\desktop> Get-WinEvent -Path .\Oracle3_Security.evtx | ? { $_.Message -like "*clear*" }


   ProviderName: Microsoft-Windows-Eventlog

TimeCreated                     Id LevelDisplayName Message
-----------                     -- ---------------- -------
5/9/2017 11:36:05 PM          1102 Information      The audit log was cleared....
```

::: tip
oracle4 Password: 05/09/2017
:::




## Oracle4

### Desciption

The password for oracle5 is the name of the GPO that was last created **PLUS** the name of the file on the user’s desktop.

**NOTE:**\
– If the GPO name is “blob” and the file on the desktop is named “1234”, the password would be “blob1234”.\
– The password will be lowercase no matter how it appears on the screen.

### Solution

```powershell
PS C:\users\Oracle4\desktop> $lastCreated = (Get-GPO -All | Sort-Object -Property CreationTime | Select -Last 1) ; $lastCreated
 
DisplayName      : Alpha
DomainName       : underthewire.tech
Owner            : underthewire\Domain Admins
Id               : 49401c32-4145-463f-b5e7-816926d4f78d
GpoStatus        : AllSettingsEnabled
Description      : Are you there?
CreationTime     : 1/13/2019 9:40:20 PM
ModificationTime : 1/13/2019 9:40:20 PM
UserVersion      : AD Version: 0, SysVol Version: 0
ComputerVersion  : AD Version: 0, SysVol Version: 0
WmiFilter        :
    
PS C:\users\Oracle4\desktop> ($lastCreated.DisplayName + (ls).Name).ToLower()
alpha83
```

::: tip
oracle5 Password: alpha83
:::




## Oracle5

### Desciption

The password for oracle6 is the name of the GPO that contains a description of “I\_AM\_GROOT” **PLUS** the name of the file on the user’s desktop.

**NOTE:**\
– If you are using SSH, you MUST do a Help on the cmdlet needed to solve this. For example, if the cmdlet is “get-something” type “help get-something” first, this will make the cmdlet available for you to use. This is a bug in the SSH software used.\
– If the GPO description is “blob” and the file on the desktop is named “1234”, the password would be “blob1234”.\
– The password will be lowercase no matter how it appears on the screen.

### Solution

```powershell
PS C:\users\Oracle5\desktop> $grootGPO = Get-GPO -All | ? { $_.Description -like "*I_AM_GROOT*" } ; $grootGPO 

DisplayName      : Charlie
DomainName       : underthewire.tech
Owner            : underthewire\Domain Admins
Id               : 44080cf1-1053-467d-b000-2ea3f27dbbfa
GpoStatus        : AllSettingsEnabled
Description      : I_am_Groot
CreationTime     : 11/20/2018 12:18:09 AM
ModificationTime : 11/20/2018 12:18:08 AM
UserVersion      : AD Version: 0, SysVol Version: 0
ComputerVersion  : AD Version: 0, SysVol Version: 0
WmiFilter        :
 
PS C:\users\Oracle5\desktop> ($grootGPO.DisplayName + (ls).Name).ToLower()
charlie1337
```

::: tip
oracle6 Password: charlie1337
:::




## Oracle6

### Desciption

The password for oracle7 is the name of the OU that doesn’t have a GPO linked to it **PLUS** the name of the file on the user’s desktop.

**NOTE:**\
– The password will be lowercase no matter how it appears on the screen.\
– Exclude the “Groups” OU.

### Solution

```powershell
PS C:\users\Oracle6\desktop> Get-ADOrganizationalUnit -Filter * -Properties * | ? { $_.LinkedGroupPolicyObjects.Count -eq 0 } | Select Name, ou

Name   ou
----   --
T-50   {T-50}
Groups {Groups} 

PS C:\users\Oracle6\desktop> ls 
    Directory: C:\users\Oracle6\desktop
  
Mode                LastWriteTime         Length Name
----                -------------         ------ ----
-a----        8/30/2018  10:50 AM              0 _97
```

::: tip
oracle7 Password: t-50\_97
:::




## Oracle7

### Desciption

The password for oracle8 is the name of the domain that a trust is built with **PLUS** the name of the file on the user’s desktop.

**NOTE:**\
– The password will be lowercase no matter how it appears on the screen.\
– If the name of the trust is “blob” and the file on the desktop is named “1234”, the password would be “blob1234”.

### Solution

```powershell
PS C:\users\Oracle7\desktop> $trustedDomain=(Get-ADTrust -Filter *) ; $trustedDomain

...
Name                    : multiverse
ObjectClass             : trustedDomain
...

PS C:\users\Oracle7\desktop> ($trustedDomain.Name + (ls).Name).ToLower()
multiverse111
```

::: tip
oracle8 Password: multiverse111
:::




## Oracle8

### Desciption

The password for oracle9 is the name of the file in the GET Request from \<www.guardian.galaxy.com> within the log file on the desktop.

**NOTE:**\
– Don’t include the extension.\
– The password will be lowercase no matter how it appears on the screen.

### Solution

```powershell
PS C:\users\Oracle8\desktop> sls "guardian.galaxy.com" .\logs.txt

logs.txt:2156:guardian.galaxy.com - - [28/Jul/1995:13:03:55 -0400] "GET /images/star-lord.gif HTTP/1.0" 200 786 
```

::: tip
oracle9 Password: star-lord
:::




## Oracle9

### Desciption

The password for oracle10 is the computer name of the DNS record of the mail server listed in the UnderTheWire.tech zone **PLUS** the name of the file on the user’s desktop.

**NOTE:**\
– If the server name is “some\_blob” and the file on the desktop is named “1234”, the password would be “some\_blob1234”.\
– Only submit the computer name and not the fully qualified domain name.\
– The password will be lowercase no matter how it appears on the screen.

### Solution

```powershell
PS C:\users\Oracle9\desktop> $mail=(Get-DnsServerResourceRecord -ZoneName UnderTheWire.tech -RRType MX); $mail

HostName                  RecordType Type       Timestamp            TimeToLive      RecordData
--------                  ---------- ----       ---------            ----------      ----------
utw_exch                  MX         15         0                    01:00:00        [10][mail.utw_exch.]

PS C:\users\Oracle9\desktop> ($mail.Hostname + (ls).Name).ToLower()
utw_exch9229
```

::: tip
oracle10 Password: utw\_exch9229
:::




## Oracle10

### Desciption

The password for oracle11 is the .biz site the user has previously navigated to.

**NOTE:**\
– Don’t include the extension.\
– The password will be lowercase no matter how it appears on the screen.

### Solution

```powershell
PS C:\users\Oracle10\desktop> ls 
    Directory: C:\users\Oracle10\desktop
 
Mode                LastWriteTime         Length Name
----                -------------         ------ ----
-a----        9/28/2022  10:39 PM        1519886 meuk.txt
-a----         7/9/2022  11:51 AM              0 res.txt
-a----        11/3/2021   6:20 AM         580380 temp
 
PS C:\users\Oracle10\desktop> sls ".biz" ./*

meuk.txt:2641:                               url6 : http://yondu.biz
temp:1808:    url6    REG_SZ    http://yondu.biz
```

::: tip
oracle11 Password: yondu
:::




## Oracle11

### Desciption

The password for oracle12 is the drive letter associated with the mapped drive that this user has.

**NOTE:**– Submission should be one letter and lowercase.

### Solution

```powershell
# Get all the drives that are supported by the Windows PowerShell file system provider
PS C:\users\Oracle11\desktop> Get-PSDrive -PSProvider FileSystem

Name           Used (GB)     Free (GB) Provider      Root          CurrentLocation
----           ---------     --------- --------      ----          ---------------
C                  25.89         23.77 FileSystem    C:\    users\Oracle11\desktop

PS C:\users\Oracle11\desktop> net use
New connections will be remembered.

Status       Local     Remote                    Network
-------------------------------------------------------------------------------
Unavailable  M:        \\127.0.0.1\WsusContent   Microsoft Windows Network
The command completed successfully.
```

::: tip
oracle12 Password: m
:::




## Oracle12

### Desciption

The password for oracle13 is the IP of the system that this user has previously established a remote desktop with.

### Solution

```powershell
# This registry key stores various settings and configuration 
# information related to the Remote Desktop Connection client. 
# It keeps track of remote desktop connections made by users, 
# including the IP addresses or machine names of the remote systems.
PS C:\users\oracle12\desktop> $registryPath = "HKCU:\Software\Microsoft\Terminal Server Client"

PS C:\users\oracle12\desktop> ls $registryPath
    Hive: HKEY_CURRENT_USER\Software\Microsoft\Terminal Server Client

Name                           Property
----                           --------
192.168.2.3                    UsernameHint : MyServer\raccoon 
```

::: tip
oracle13 Password: 192.168.2.3
:::




## Oracle13

### Desciption

The password for oracle14 is the name of the user who created the Galaxy security group as depicted in the event logs on the desktop **PLUS** the name of the text file on the user’s desktop.

**NOTE:**\
– If the user’s name is “randy” and the file on the desktop is named “1234”, the password would be “randy1234”.\
– The password will be lowercase no matter how it appears on the screen.

### Solution

```powershell
PS C:\users\Oracle13\desktop> ls
    Directory: C:\users\Oracle13\desktop
    
Mode                LastWriteTime         Length Name
----                -------------         ------ ----
-a----        8/30/2018  10:51 AM              0 88
-a----        8/30/2018   5:52 AM        2166784 security.evtx

PS C:\users\Oracle13\desktop> Get-WinEvent -Path .\security.evtx | ? { $_.Message -like "*Galaxy*" }
 
   ProviderName: Microsoft-Windows-Security-Auditing

TimeCreated                     Id LevelDisplayName Message
-----------                     -- ---------------- -------
5/19/2017 1:19:28 AM          4728 Information      A member was added to a security-enabled global group....
5/19/2017 1:19:28 AM          4737 Information      A security-enabled global group was changed....
5/19/2017 1:18:26 AM          4727 Information      A security-enabled global group was created....

# Two events created same group, but ID=4727 came first.
PS C:\users\Oracle13\desktop> Get-WinEvent -Path .\security.evtx | ? { $_.Id -eq 4727 } | Format-List
 
TimeCreated  : 5/19/2017 1:18:26 AM
ProviderName : Microsoft-Windows-Security-Auditing
Id           : 4727
Message      : A security-enabled global group was created.

               Subject:
                Security ID:            S-1-5-21-2268727836-2773903800-2952248001-1621
                Account Name:           gamora
                Account Domain:         UNDERTHEWIRE
                Logon ID:               0xBC24FF

               New Group:
                Security ID:            S-1-5-21-2268727836-2773903800-2952248001-1626
                Group Name:             Galaxy
                Group Domain:           UNDERTHEWIRE

               Attributes:
                SAM Account Name:       Galaxy
                SID History:            -

               Additional Information:
                Privileges:             -
```

::: tip
oracle14 Password: gamora88
:::




## Oracle14

### Desciption

The password for oracle15 is the name of the user who added the user Bereet to the Galaxy security group as depicted in the event logs on the desktop **PLUS** the name of the text file on the user’s desktop.

**NOTE:**\
– If the script name is “randy” and the file on the desktop is named “1234”, the password would be “randy1234”.\
– The password will be lowercase no matter how it appears on the screen.

### Solution

```powershell
PS C:\users\Oracle14\desktop> ls
    Directory: C:\users\Oracle14\desktop

Mode                LastWriteTime         Length Name
----                -------------         ------ ----
-a----        8/30/2018  10:51 AM              0 2112
-a----        8/30/2018   5:52 AM        2166784 security.evtx

PS C:\users\Oracle14\desktop> Get-WinEvent -Path .\security.evtx | ? { $_.Message -like "*Galaxy*" }
   ProviderName: Microsoft-Windows-Security-Auditing

TimeCreated                     Id LevelDisplayName Message
-----------                     -- ---------------- -------
5/19/2017 1:19:28 AM          4728 Information      A member was added to a security-enabled global group....
5/19/2017 1:19:28 AM          4737 Information      A security-enabled global group was changed....
5/19/2017 1:18:26 AM          4727 Information      A security-enabled global group was created....

PS C:\users\Oracle14\desktop> Get-WinEvent -Path .\security.evtx | ? { $_.Message -like "*Galaxy*" -and $_.Id -eq 4728 } | Format-List

TimeCreated  : 5/19/2017 1:19:28 AM
ProviderName : Microsoft-Windows-Security-Auditing
Id           : 4728
Message      : A member was added to a security-enabled global group.

               Subject:
                Security ID:            S-1-5-21-2268727836-2773903800-2952248001-1622
                Account Name:           nebula
                Account Domain:         UNDERTHEWIRE
                Logon ID:               0xBD8CC7

               Member:
                Security ID:            S-1-5-21-2268727836-2773903800-2952248001-1623
                Account Name:           CN=Bereet,OU=Morag,DC=UNDERTHEWIRE,DC=TECH

               Group:
                Security ID:            S-1-5-21-2268727836-2773903800-2952248001-1626
                Group Name:             Galaxy
                Group Domain:           UNDERTHEWIRE

               Additional Information:
                Privileges:             -
```

::: tip
oracle15 Password: nebula2112
:::




## All Passwords

| Username |    Password     |
| :------: | :-------------: |
|  oracle1 |    `oracle1`    |
|  oracle2 |      `utc`      |
|  oracle3 |     `2f5c4`     |
|  oracle4 |   `05/09/2017`  |
|  oracle5 |    `alpha83`    |
|  oracle6 |  `charlie1337`  |
|  oracle7 |    `t-50_97`    |
|  oracle8 | `multiverse111` |
|  oracle9 |   `star-lord`   |
| oracle10 | `utw_exch9229`  |
| oracle11 |     `yondu`     |
| oracle12 |       `m`       |
| oracle13 |  `192.168.2.3`  |
| oracle14 |    `gamora88`   |
| oracle15 |   `nebula2112`  |
