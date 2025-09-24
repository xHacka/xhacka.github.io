# UnderTheWire - Groot

## CTF Link

[https://underthewire.tech/groot](https://underthewire.tech/groot)

## Groot1

### Desciption

The password for groot2 is the last five alphanumeric characters of the MD5 hash of this system’s hosts file.

**NOTE:**\
– The password will be lowercase no matter how it appears on the screen.

### Solution

```powershell
➜ ssh groot.underthewire.tech -l groot1 # Password: groot1

PS C:\users\Groot1\desktop> $hostsFile="$ENV:SystemRoot\System32\Drivers\etc\hosts" ; $hostsFile
C:\Windows\System32\Drivers\etc\hosts

PS C:\users\Groot1\desktop> $hostsFileHash = (Get-FileHash -Algorithm MD5 -Path $hostsFile).Hash ; $hostsFileHash
6EEC08310BD5328FFC8FB72CD8E464C3

PS C:\users\Groot1\desktop> $hostsFileHash.Substring($hostsFileHash.Length - 5).ToLower()
464c3
```

::: tip
groot2 Password: 464c3
:::




## Groot2

### Desciption

The password for groot3 is the word that is made up from the letters in the range of 1,481,110 to 1,481,117 within the file on the desktop.

**NOTE:**\
– The password will be lowercase no matter how it appears on the screen.

### Solution

```powershell
PS C:\users\Groot2\desktop> $elements = cat .\elements.txt

# Solution 1
PS C:\users\Groot2\desktop> for ($i=0; $i -lt $elements.Length; $i++) {
>>                             if ($i -ge $start -and $i -le $end) { # ge=Greater Than or Equal, le=Less Than or Equal
>>                                Write-Host -NoNewline $elements[$i];   } }
>>
 hiding

# Solution 2
PS C:\users\Groot2\desktop> $elements.Substring($start, $end - $start + 1).Trim()
hiding

# Solution 3
PS C:\users\Groot2\desktop> ($elements[$start..$end] -Join "").Trim()
hiding
```

::: tip
groot3 Password: hiding
:::




## Groot3

### Desciption

The password for groot4 is the number of times the word “beetle” is listed in the file on the desktop.

### Solution

```powershell
PS C:\users\Groot3\desktop> (sls "beetle" .\words.txt -AllMatches).Matches.Count
5
```

::: tip
groot4 Password: 5
:::




## Groot4

### Desciption

The password for groot5 is the name of the Drax subkey within the HKEY\_CURRENT\_USER (HKCU) registry hive.

NOTE:\
– The password will be lowercase no matter how it appears on the screen.

### Solution

```powershell
PS C:\users\Groot4\desktop> ls -Path Registry::HKCU -Recurse -ErrorAction SilentlyContinue | sls drax

HKEY_CURRENT_USER\Software\Microsoft\Assistance\Drax
HKEY_CURRENT_USER\Software\Microsoft\Assistance\Drax\destroyer
```

::: tip
groot5 Password: destroyer
:::




## Groot5

### Desciption

The password for groot6 is the name of the workstation that the user with a username of “baby.groot” can log into as depicted in Active Directory **PLUS** the name of the file on the desktop

**NOTE:**\
– If the workstation is “system1” and the file on the desktop is named “\_log”, the password would be “system1\_log”.\
– The password will be lowercase no matter how it appears on the screen.

### Solution

```powershell
PS C:\users\Groot5\desktop> Get-ADUser -Filter { LogonWorkstations -like "*" } -Properties LogonWorkstations 

DistinguishedName : CN=Groot \ ,OU=T-65,OU=X-Wing,DC=underthewire,DC=tech
Enabled           : False
GivenName         : Baby
LogonWorkstations : wk11
Name              : Groot
ObjectClass       : user
ObjectGUID        : c938286d-f672-45b7-97ee-b371f0e39836
SamAccountName    : baby.groot
SID               : S-1-5-21-758131494-606461608-3556270690-2175
Surname           : Groot
UserPrincipalName : baby.groot

PS C:\users\Groot5\desktop> ls 
    Directory: C:\users\Groot5\desktop 

Mode                LastWriteTime         Length Name
----                -------------         ------ ----
-a----        9/20/2020   3:38 PM              0 _enterprise 
```

::: tip
groot6 Password: wk11\_enterprise
:::




## Groot6

### Desciption

The password for groot7 is the name of the program that is set to start when this user logs in **PLUS** the name of the file on the desktop.

**NOTE:**\
– Omit the executable extension.\
– If the program is “mspaint” and the file on the desktop is named “\_log”, the password would be “mspaint\_log”.\
– The password will be lowercase no matter how it appears on the screen.

### Solution

```powershell
PS C:\users\Groot6\desktop> Get-CimInstance -ClassName Win32_StartupCommand

Command          User                Caption
-------          ----                -------
                 underthewire\Groot6 New Value #1
                 underthewire\Groot6 New Value #2
                 underthewire\Groot6 New Value #3
                 underthewire\Groot6 New Value #4
C:\star-lord.exe underthewire\Groot6 star-lord
 
PS C:\users\Groot6\desktop> ls 
    Directory: C:\users\Groot6\desktop
 
Mode                LastWriteTime         Length Name
----                -------------         ------ ----
-a----        8/21/2020   1:24 PM              0 _rules
```

::: tip
groot7 Password: star-lord\_rules
:::




## Groot7

### Desciption

The password for groot8 is the name of the dll, as depicted in the registry, associated with the “applockerfltr” service **PLUS** the name of the file on the desktop.

**NOTE:**\
– The password will be lowercase no matter how it appears on the screen.\
– If the name of the dll is “abc.dll” and the file on the desktop is named “\_1234”, the password would be “abc\_1234”.

### Solution

```powershell
PS C:\users\Groot7\desktop> $service = "applockerfltr"
PS C:\users\Groot7\desktop> $serviceKeyPath = "HKLM:\SYSTEM\CurrentControlSet\Services\$service" ; $serviceKeyPath
HKLM:\SYSTEM\CurrentControlSet\Services\applockerfltr
PS C:\users\Groot7\desktop> Get-ItemProperty -Path $serviceKeyPath
 
DisplayName     : @%systemroot%\system32\srpapi.dll,-102
ErrorControl    : 1
ImagePath       : system32\drivers\applockerfltr.sys
Start           : 3
Type            : 1
Description     : @%systemroot%\system32\srpapi.dll,-103
DependOnService : {FltMgr, AppID, AppIDSvc}
PSPath          : Microsoft.PowerShell.Core\Registry::HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\applockerfltr
PSParentPath    : Microsoft.PowerShell.Core\Registry::HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services
PSChildName     : applockerfltr
PSDrive         : HKLM
PSProvider      : Microsoft.PowerShell.Core\Registry

PS C:\users\Groot7\desktop> ls
    Directory: C:\users\Groot7\desktop

Mode                LastWriteTime         Length Name
----                -------------         ------ ----
-a----        5/31/2021   5:13 PM              0 _home 
```

::: tip
groot8 Password: srpapi\_home
:::




## Groot8

### Desciption

The password for groot9 is the description of the firewall rule blocking MySQL **PLUS** the name of the file on the desktop.

**NOTE:**\
– If the description of the rule is “blue” and the file on the desktop is named “\_bob”, the password would be “blue\_bob”.\
– The password will be lowercase no matter how it appears on the screen.

### Solution

```powershell
PS C:\users\Groot8\desktop> Get-NetFirewallRule -DisplayName "*mysql*"
 
Name                  : {8ce6b97d-5c1d-4347-a7fd-1792feb42355}
DisplayName           : MySQL
Description           : call_me
DisplayGroup          :
Group                 :
Enabled               : True
Profile               : Any
Platform              : {}
Direction             : Inbound
Action                : Block
EdgeTraversalPolicy   : Block
LooseSourceMapping    : False
LocalOnlyMapping      : False
Owner                 :
PrimaryStatus         : OK
Status                : The rule was parsed successfully from the store. (65536)
EnforcementStatus     : NotApplicable
PolicyStoreSource     : PersistentStore
PolicyStoreSourceType : Local
 
PS C:\users\Groot8\desktop> ls 
    Directory: C:\users\Groot8\desktop
 
Mode                LastWriteTime         Length Name
----                -------------         ------ ----
-a----        8/30/2018  10:51 AM              0 _starlord 
```

::: tip
groot9 Password: call\_me\_starlord
:::




## Groot9

### Desciption

The password for groot10 is the name of the OU that doesn’t have accidental deletion protection enabled **PLUS** the name of the file on the desktop.

**NOTE:**\
– If the name of the OU is called “blue” and the file on the desktop is named “\_bob”, the password would be “blue\_bob”.\
– The password will be lowercase no matter how it appears on the screen.

### Solution

```powershell
PS C:\users\Groot9\desktop> Get-ADOrganizationalUnit -Filter * -Properties ProtectedFromAccidentalDeletion |
>> % { # For Loop
>>     if ($_.ProtectedFromAccidentalDeletion -eq $false) { # Get Objects Where Field False
>>         echo $_; 
>>     }
>> }
>>
 
City                            :
Country                         :
DistinguishedName               : OU=T-25,OU=X-Wing,DC=underthewire,DC=tech
LinkedGroupPolicyObjects        : {cn={49401C32-4145-463F-B5E7-816926D4F78D},cn=policies,cn=system,DC=underthewire,DC=t
                                  ech}
ManagedBy                       :
Name                            : T-25
ObjectClass                     : organizationalUnit
ObjectGUID                      : fc15c303-dd9a-4c44-a941-314cc6fdd394
PostalCode                      :
ProtectedFromAccidentalDeletion : False
State                           :
StreetAddress                   :

PS C:\users\Groot9\desktop> ls
    Directory: C:\users\Groot9\desktop

Mode                LastWriteTime         Length Name
----                -------------         ------ ----
-a----        8/30/2018  10:51 AM              0 _tester
```

::: tip
groot10 Password: t-25\_tester
:::




## Groot10

### Desciption

The password for groot11 is the one word that makes the two files on the desktop different.

**NOTE:**\
– The password will be lowercase no matter how it appears on the screen.

### Solution

```powershell
PS C:\users\Groot10\desktop> Compare-Object -ReferenceObject (cat .\old.txt) -DifferenceObject (cat .\new.txt)

InputObject SideIndicator
----------- -------------
taserface   =>
```

::: tip
groot11 Password: taserface
:::




## Groot11

### Desciption

The password for groot12 is within an alternate data stream (ADS) somewhere on the desktop.

**NOTE:**\
– The password will be lowercase no matter how it appears on the screen.

### Solution

```powershell
PS C:\users\Groot11\desktop> Get-Item * -Stream * | Select FileName, Stream

FileName                                    Stream
--------                                    ------
C:\users\Groot11\desktop\TPS_Reports01.txt  :$DATA
C:\users\Groot11\desktop\TPS_Reports02.doc  :$DATA
C:\users\Groot11\desktop\TPS_Reports03.txt  :$DATA
C:\users\Groot11\desktop\TPS_Reports04.pdf  :$DATA
C:\users\Groot11\desktop\TPS_Reports04.pdf  secret
C:\users\Groot11\desktop\TPS_Reports05.xlsx :$DATA
C:\users\Groot11\desktop\TPS_Reports06.pptx :$DATA

PS C:\users\Groot11\desktop> cat TPS_Reports04.pdf -Stream secret
spaceships	
```

::: tip
groot12 Password: spaceships
:::




## Groot12

### Desciption

The password for groot13 is the owner of the Nine Realms folder on the desktop.

**NOTE:**\
– Exclude the Administrator, the Administrators group, and System.\
– The password will be lowercase with no punctuation no matter how it appears on the screen. For example, if the owner is “john.doe”, it would be “johndoe”.

### Solution

```powershell
PS C:\users\Groot12\desktop> Get-Acl '.\Nine Realms' | Format-List

Path   : Microsoft.PowerShell.Core\FileSystem::C:\users\Groot12\desktop\Nine Realms
Owner  : underthewire\Airwolf
Group  : underthewire\Domain Users
Access : NT AUTHORITY\SYSTEM Allow  FullControl
         BUILTIN\Administrators Allow  FullControl
         underthewire\Groot12 Allow  ReadAndExecute, Synchronize
Audit  :
Sddl   : O:S-1-5-21-758131494-606461608-3556270690-2176G:DUD:AI(A;OICIID;FA;;;SY)(A;OICIID;FA;;;BA)(A;OICIID;0x1200a9;;;S-1-5-21-758131494-606461608-3556270690-1175)
```

::: tip
groot13 Password: airwolf
:::




## Groot13

### Desciption

The password for groot14 is the name of the Registered Owner of this system as depicted in the Registry **PLUS** the name of the file on the desktop.

**NOTE:**\
– If the Registered Owner is “Elroy” and the file on the desktop is named “\_bob”, the password would be “elroy\_bob”.\
– The password will be lowercase no matter how it appears on the screen.

### Solution

```powershell
PS C:\users\Groot13\desktop> $path=”HKLM:\Software\Microsoft\Windows NT\CurrentVersion”
PS C:\users\Groot13\desktop> $reg=Get-ItemProperty $path 
PS C:\users\Groot13\desktop> ($reg.RegisteredOwner + (ls).Name).ToLower()
utw_team_ned 
```

::: tip
groot14 Password: utw\_team\_ned
:::

{% hint style="info" %}
[https://jdhitsolutions.com/blog/powershell/49/reading-the-registry-in-powershell/](https://jdhitsolutions.com/blog/powershell/49/reading-the-registry-in-powershell/)
:::




## Groot14

### Desciption

The password for groot15 is the description of the share whose name contains “task” in it **PLUS** the name of the file on the desktop.

**NOTE:**\
– If the description is “frozen\_pizza” and the file on the desktop is named “\_sucks”, the password would be “frozen\_pizza\_sucks”.\
– The password will be lowercase no matter how it appears on the screen.

### Solution

```powershell
PS C:\users\Groot14\desktop> Get-SmbShare

Name           ScopeName Path Description
----           --------- ---- -----------
ADMIN$         *              Remote Admin
C$             *              Default share
IPC$           *              Remote IPC
NETLOGON       *              Logon server share
shoretroopers$ *              Nothing to see here # <--
SYSVOL         *              Logon server share
Tasker         *              scheduled_things
```

::: tip
groot15 Password: shoretroopers
:::

## All Passwords

| Username |      Password      |
| :------: | :----------------: |
|  groot1  |       groot1       |
|  groot2  |        464c3       |
|  groot3  |       hiding       |
|  groot4  |          5         |
|  groot5  |      destroyer     |
|  groot6  |  wk11\_enterprise  |
|  groot7  |  star-lord\_rules  |
|  groot8  |    srpapi\_home    |
|  groot9  | call\_me\_starlord |
|  groot10 |    t-25\_tester    |
|  groot11 |      taserface     |
|  groot12 |     spaceships     |
|  groot13 |       airwolf      |
|  groot14 |   utw\_team\_ned   |
|  groot15 |    shoretroopers   |
