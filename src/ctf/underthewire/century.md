# UnderTheWire - Century

## CTF Link

[https://underthewire.tech/century](https://underthewire.tech/century)

## Century1

### Desciption

The password for Century2 is the **build version** of the instance of PowerShell installed on this system.

**NOTE:**

* The format is as follows: \*\*\*\*.\*.\*\*\*\*\*.\*\*\*\*\*\*
* Include all periods
* Be sure to look for build version and NOT PowerShell version

### Solution

```powershell
➜ ssh century.underthewire.tech -l century1 # Password: century1
PS C:\users\century1\desktop> $PSVersionTable

Name                           Value
----                           -----
PSVersion                      5.1.14393.5127
PSEdition                      Desktop
PSCompatibleVersions           {1.0, 2.0, 3.0, 4.0...}
BuildVersion                   10.0.14393.5127
CLRVersion                     4.0.30319.42000
WSManStackVersion              3.0
PSRemotingProtocolVersion      2.3
SerializationVersion           1.1.0.1
```

::: tip
century2 Password: 10.0.14393.5127
:::




## Century2

### Desciption

The password for Century3 is the name of the built-in cmdlet that performs the wget like function within PowerShell **PLUS** the name of the file on the desktop.

**NOTE:**

* If the name of the cmdlet is “get-web” and the file on the desktop is named “1234”, the password would be “get-web1234”.
* The password will be lowercase no matter how it appears on the screen.

### Solution

```powershell
PS C:\users\century2\desktop> gal gal,wget,ls # Get Aliases

CommandType     Name                                               Version    Source
-----------     ----                                               -------    ------
Alias           gal -> Get-Alias
Alias           wget -> Invoke-WebRequest
Alias           ls -> Get-ChildItem

PS C:\users\century2\desktop> ls

    Directory: C:\users\century2\desktop
    
Mode                LastWriteTime         Length Name
----                -------------         ------ ----
-a----        8/30/2018   3:29 AM            693 443
```

::: tip
century3 Password: invoke-webrequest443
:::




## Century3

### Desciption

The password for Century4 is the number of files on the desktop.

### Solution

```powershell
PS C:\users\century3\desktop> gal ls,measure

CommandType     Name                                               Version    Source
-----------     ----                                               -------    ------
Alias           ls -> Get-ChildItem
Alias           measure -> Measure-Object

PS C:\users\century3\desktop> ls | measure

Count    : 123
Average  :
Sum      :
Maximum  :
Minimum  :
Property :
```

::: tip
century4 Password: 123
:::




## Century4

### Desciption

The password for Century5 is the name of the file within a directory on the desktop that has spaces in its name.

**NOTE:**

* The password will be lowercase no matter how it appears on the screen.

### Solution

```powershell
PS C:\users\century4\desktop> gal ls,cat

CommandType     Name                                               Version    Source
-----------     ----                                               -------    ------
Alias           ls -> Get-ChildItem
Alias           cat -> Get-Content

PS C:\users\century4\desktop> ls -Filter "* *"
    Directory: C:\users\century4\desktop
    
Mode                LastWriteTime         Length Name
----                -------------         ------ ----
d-----        6/23/2022  10:30 PM                Can you open me

PS C:\users\century4\desktop> ls '.\Can you open me'
    Directory: C:\users\century4\desktop\Can you open me

Mode                LastWriteTime         Length Name
----                -------------         ------ ----
-a----        6/23/2022  10:24 PM             24 49125
```

::: tip
century5 Password: 49125
:::




## Century5

### Desciption

The password for Century6 is the short name of the domain in which this system resides in **PLUS** the name of the file on the desktop.

**NOTE:**

* If the short name of the domain is “blob” and the file on the desktop is named “1234”, the password would be “blob1234”.
* The password will be lowercase no matter how it appears on the screen.

### Solution

utw

```powershell
PS C:\users\century5\desktop> hostname
utw 
  
PS C:\users\century5\desktop> echo $ENV:USERDOMAIN
underthewire

PS C:\users\century5\desktop> ls 
    Directory: C:\users\century5\desktop
 
Mode                LastWriteTime         Length Name
----                -------------         ------ ----
-a----        8/30/2018   3:29 AM             54 3347 
```

::: tip
century6 Password: underthewire3347
:::




## Century6

### Desciption

The password for Century7 is the number of folders on the desktop.

### Solution

```powershell
PS C:\users\century6\desktop> gal ls,measure

CommandType     Name                                               Version    Source
-----------     ----                                               -------    ------
Alias           ls -> Get-ChildItem
Alias           measure -> Measure-Object

PS C:\users\century6\desktop> (ls -Directory | measure).Count
197
```

::: tip
century7 Password: 197
:::




## Century7

### Desciption

The password for Century8 is in a readme file somewhere within the contacts, desktop, documents, downloads, favorites, music, or videos folder in the user’s profile.

**NOTE:**

* The password will be lowercase no matter how it appears on the screen.

### Solution

```powershell
PS C:\users\century7\desktop> Get-ChildItem -Path .. -Recurse -File -Filter "readme*"


    Directory: C:\users\century7\Downloads


Mode                LastWriteTime         Length Name
----                -------------         ------ ----
-a----        8/30/2018   3:29 AM              7 Readme.txt


PS C:\users\century7\desktop> Get-ChildItem -Path .. -Recurse -File -Filter "readme*" | cat
7points
```

::: tip
century8 Password: 7points
:::




## Century8

### Desciption

The password for Century9 is the number of unique entries within the file on the desktop.

### Solution

```powershell
PS C:\users\century8\desktop> (Get-Content .\unique.txt | Sort-Object | Get-Unique | Measure-Object).Count
696
```

::: tip
century9 Password: 696
:::




## Century9

### Desciption

The password for Century10 is the **161st** word within the file on the desktop.

**NOTE:**

* The password will be lowercase no matter how it appears on the screen.

### Solution

```powershell
# 161st => Index 160
PS C:\users\century9\desktop> (cat .\Word_File.txt).Split(" ")[160]
pierid
```

::: tip
century10 Password: pierid
:::




## Century10

### Desciption

The password for Century11 is the **10th** and **8th** word of the Windows Update service description combined PLUS the name of the file on the desktop.

**NOTE:**

* The password will be lowercase no matter how it appears on the screen.
* If the 10th and 8th word of the service description is “apple” and “juice” and the name of the file on the desktop is “88”, the password would be “applejuice88”.

### Solution

```powershell
PS C:\users\century10\desktop> Get-Service -DisplayName "*Windows Update*"

Status   Name               DisplayName
------   ----               -----------
Stopped  UsoSvc             Update Orchestrator Service for Win...
Stopped  wuauserv           Windows Update

PS C:\users\century10\desktop> $WinUpdateDesc=(Get-WmiObject -Class Win32_Service -Filter "Name='wuauserv'").Description
PS C:\users\century10\desktop> $WinUpdateDescWords=$WinUpdateDesc.Split(" ")
# 10th Word => Index 9 ; 8th Word => Index 7
PS C:\users\century10\desktop> ($WinUpdateDescWords[9] + $WinUpdateDescWords[7]).ToLower()
windowsupdates
PS C:\users\century10\desktop> ls 
    Directory: C:\users\century10\desktop
 
Mode                LastWriteTime         Length Name
----                -------------         ------ ----
-a----        8/30/2018   3:34 AM             43 110
```

::: tip
century11 Password: windowsupdates110
:::




## Century11

### Desciption

The password for Century12 is the name of the hidden file within the contacts, desktop, documents, downloads, favorites, music, or videos folder in the user’s profile.

**NOTE:**

* Exclude “desktop.ini”.
* The password will be lowercase no matter how it appears on the screen.

### Solution

```powershell
➜ gal cd,ls,%

CommandType     Name                                               Version    Source
-----------     ----                                               -------    ------
Alias           cd -> Set-Location
Alias           ls -> Get-ChildItem
Alias           % -> ForEach-Object

PS C:\users\century11\desktop> cd ..
PS C:\users\century11> ls | % { ls -Path $_ -Recurse -File -Hidden -Exclude "desktop.ini"}

    Directory: C:\users\century11\Downloads

Mode                LastWriteTime         Length Name
----                -------------         ------ ----
--rh--        8/30/2018   3:34 AM             30 secret_sauce
```

::: tip
century12 Password: secret\_sauce
:::




## Century12

### Desciption

The password for Century13 is the description of the computer designated as a Domain Controller within this domain **PLUS** the name of the file on the desktop.

**NOTE:**

* The password will be lowercase no matter how it appears on the screen.
* If the description “today\_is” and the file on the desktop is named “\_cool”, the password would be “today\_is\_cool”.

### Solution

```powershell
PS C:\users\century12\desktop> (Get-ADDomainController).Name
UTW

PS C:\users\century12\desktop> Get-ADComputer -Filter { Name -eq "UTW" } -Properties Description

Description       : i_authenticate
...

PS C:\users\century12\desktop> ls
    Directory: C:\users\century12\desktop

Mode                LastWriteTime         Length Name
----                -------------         ------ ----
-a----        8/30/2018   3:34 AM             30 _things
```

::: tip
century13 Password: i\_authenticate\_things
:::




## Century13

### Desciption

The password for Century14 is the number of words within the file on the desktop.

### Solution

```powershell
PS C:\users\century13\desktop> gal cat,measure

CommandType     Name                                               Version    Source
-----------     ----                                               -------    ------
Alias           cat -> Get-Content
Alias           measure -> Measure-Object

PS C:\users\century13\desktop> ((cat .\countmywords).Split() | measure).Count
755
```

::: tip
century14 Password: 755
:::




## Century14

### Desciption

The password for Century15 is the number of times the word “polo” appears within the file on the desktop.

**NOTE:**

* You should count the instances of the **whole word** only..

### Solution

```powershell
PS C:\users\century14\desktop> gal cat,sls,measure

CommandType     Name                                               Version    Source
-----------     ----                                               -------    ------
Alias           cat -> Get-Content
Alias           sls -> Select-String # grep Equivalent
Alias           measure -> Measure-Object

PS C:\users\century14\desktop> ((cat .\countpolos).Split() | sls "^polo$" | measure).Count
153
```

::: tip
century15 Password: 153
:::




## All Passwords

|    Name   |         Password        |
| :-------: | :---------------------: |
|  century1 |         century1        |
|  century2 |     10.0.14393.5127     |
|  century3 |   invoke-webrequest443  |
|  century4 |           123           |
|  century5 |          49125          |
|  century6 |     underthewire3347    |
|  century7 |           197           |
|  century8 |         7points         |
|  century9 |           696           |
| century10 |          pierid         |
| century11 |    windowsupdates110    |
| century12 |      secret\_sauce      |
| century13 | i\_authenticate\_things |
| century14 |           755           |
| century15 |           153           |
