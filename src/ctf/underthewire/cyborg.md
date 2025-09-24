# UnderTheWire - Cyborg

## CTF Link

[https://underthewire.tech/cyborg](https://underthewire.tech/cyborg)

## Cyborg1

### Desciption

The password for cyborg2 is the state that the user Chris Rogers is from as stated within Active Directory.

**NOTE:**\
– The password will be lowercase no matter how it appears on the screen.\
– “State” refers to the location within the country and NOT the “state” of the account (enabled/disabled).

### Solution

```powershell
➜ ssh cyborg.underthewire.tech -l cyborg1 # Password: cyborg1

PS C:\users\cyborg1\desktop> Get-ADUser -Filter { Name -like "*Rogers*" } -Properties State

DistinguishedName : CN=Rogers\, Chris\ ,OU=T-65,OU=X-Wing,DC=underthewire,DC=tech
Enabled           : False
GivenName         : Chris
Name              : Rogers, Chris
ObjectClass       : user
ObjectGUID        : ee6450f8-cf70-4b1d-b902-a837839632bd
SamAccountName    : chris.rogers
SID               : S-1-5-21-758131494-606461608-3556270690-2177
State             : kansas
Surname           : Rogers
UserPrincipalName : chris.rogers

PS C:\users\cyborg1\desktop> $user = Get-ADUser -Filter { Name -like "*Rogers*" } -Properties State
PS C:\users\cyborg1\desktop> $user_state = $user.State
PS C:\users\cyborg1\desktop> echo $user_state
kansas
```

::: tip
cyborg2 Password: kansas
:::




## Cyborg2

### Desciption

The password for cyborg3 is the host A record IP address for CYBORG718W100N **PLUS** the name of the file on the desktop.

**NOTE:**\
– If the IP is “10.10.1.5” and the file on the desktop is called “\_address”, then the password is “10.10.1.5\_address”.\
– The password will be lowercase no matter how it appears on the screen.

### Solution

```powershell
PS C:\users\cyborg2\desktop> Resolve-DnsName -Name CYBORG718W100N
Name                                           Type   TTL   Section    IPAddress
----                                           ----   ---   -------    ---------
CYBORG718W100N.underthewire.tech               A      3600  Answer     172.31.45.167
 
PS C:\users\cyborg2\desktop> ls
    Directory: C:\users\cyborg2\desktop

Mode                LastWriteTime         Length Name
----                -------------         ------ ----
-a----        2/26/2022   2:14 PM              0 _ipv4
```

::: tip
cyborg3 Password: 172.31.45.167\_ipv4
:::

{% hint style="info" %}
[nslookup](https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/nslookup) Can Also Be Used.
:::




## Cyborg3

### Desciption

The password for cyborg4 is the number of users in the Cyborg group within Active Directory **PLUS** the name of the file on the desktop.

**NOTE:**\
– If the number of users is “20” and the file on the desktop is called “\_users”, then the password is “20\_users”.\
– The password will be lowercase no matter how it appears on the screen.

### Solution

```powershell
PS C:\users\cyborg3\desktop> Get-ADGroup -Filter { Name -eq "Cyborg" } -Properties Members

DistinguishedName : CN=cyborg,OU=Groups,DC=underthewire,DC=tech
GroupCategory     : Distribution
GroupScope        : Global
Members           : {CN=Garibay\, Ona  \ ,OU=T-65,OU=X-Wing,DC=underthewire,DC=tech, CN=Garibaldo\, Omer  \
                    ,OU=T-65,OU=X-Wing,DC=underthewire,DC=tech, CN=Garibaldi\, Omega  \
                    ,OU=T-65,OU=X-Wing,DC=underthewire,DC=tech, CN=Garibai\, Omar  \
                    ,OU=T-65,OU=X-Wing,DC=underthewire,DC=tech...}
Name              : cyborg
ObjectClass       : group
ObjectGUID        : e9511d2f-b09b-40ef-a5b2-180e162ee4a7
SamAccountName    : cyborg
SID               : S-1-5-21-758131494-606461608-3556270690-2180

PS C:\users\cyborg3\desktop> (Get-ADGroup -Filter { Name -eq "Cyborg" } -Properties Members).Members.Count
88

PS C:\users\cyborg3\desktop> ls 
    Directory: C:\users\cyborg3\desktop
 
Mode                LastWriteTime         Length Name
----                -------------         ------ ----
-a----        2/26/2022   2:14 PM              0 _objects
```

::: tip
cyborg4 Password: 88\_objects
:::




## Cyborg4

### Desciption

The password for cyborg5 is the PowerShell module name with a version number of 8.9.8.9 **PLUS** the name of the file on the desktop.

**NOTE:**\
– If the module name is “bob” and the file on the desktop is called “\_settings”, then the password is “bob\_settings”.\
– The password will be lowercase no matter how it appears on the screen.

### Solution

```powershell
PS C:\users\cyborg4\desktop> Get-Module -List| Where-Object { $_.Version -eq "8.9.8.9" }
    Directory: C:\Windows\system32\WindowsPowerShell\v1.0\Modules

ModuleType Version    Name                                ExportedCommands
---------- -------    ----                                ----------------
Manifest   8.9.8.9    bacon                               Get-bacon

PS C:\users\cyborg4\desktop> ls
    Directory: C:\users\cyborg4\desktop

Mode                LastWriteTime         Length Name
----                -------------         ------ ----
-a----        8/30/2018  10:45 AM              0 _eggs
```

::: tip
cyborg5 Password: bacon\_eggs
:::




## Cyborg5

### Desciption

The password for cyborg6 is the last name of the user who has logon hours set on their account **PLUS** the name of the file on the desktop.

**NOTE:**\
– If the last name is “fields” and the file on the desktop is called “\_address”, then the password is “fields\_address”.\
– The password will be lowercase no matter how it appears on the screen.

### Solution

```powershell
PS C:\users\cyborg5\desktop> Get-ADUser -Filter { LogonHours -like "*" } -Properties LogonHours
 
DistinguishedName : CN=Administrator,CN=Users,DC=underthewire,DC=tech
Enabled           : True
GivenName         :
LogonHours        : {255, 255, 255, 255...}
Name              : Administrator
ObjectClass       : user
ObjectGUID        : 427058c2-1d57-4e49-a23d-204865b502ae
SamAccountName    : Administrator
SID               : S-1-5-21-758131494-606461608-3556270690-500
Surname           :
UserPrincipalName :

DistinguishedName : CN=Rowray\, Benny  \ ,OU=T-85,OU=X-Wing,DC=underthewire,DC=tech
Enabled           : False
GivenName         : Benny
LogonHours        : {0, 0, 0, 0...}
Name              : Rowray, Benny
ObjectClass       : user
ObjectGUID        : c9aad4f3-3e4f-46b5-84db-2bb7105796dd
SamAccountName    : Benny.Rowray
SID               : S-1-5-21-758131494-606461608-3556270690-1647
Surname           : Rowray # <- Last Name
UserPrincipalName : Benny.Rowray

PS C:\users\cyborg5\desktop> ls
    Directory: C:\users\cyborg5\desktop

Mode                LastWriteTime         Length Name
----                -------------         ------ ----
-a----        8/30/2018  10:45 AM              0 _timer
```

::: tip
cyborg6 Password: rowray\_timer
:::




## Cyborg6

### Desciption

The password for cyborg7 is the decoded text of the string within the file on the desktop.

**NOTE:**\
– The password is the last word of the string. For example, if it is “I like PowerShell”, the password would be “powershell”.\
– The password will be lowercase no matter how it appears on the screen.\
– There are no spaces in the answer.

### Solution

```powershell
PS C:\users\cyborg6\desktop> cat .\cypher.txt
YwB5AGIAZQByAGcAZQBkAGQAbwBuAA== # "==" Indicates Base64 Encoding

PS C:\users\cyborg6\desktop> $cypher = (cat .\cypher.txt)
PS C:\users\cyborg6\desktop> $base64decoded = [Convert]::FromBase64String($cypher)
PS C:\users\cyborg6\desktop> $plaintext = [System.Text.Encoding]::UTF8.GetString($base64decoded)
PS C:\users\cyborg6\desktop> echo $plaintext
cybergeddon
# or Just Write Oneliner
PS C:\users\cyborg6\desktop> [System.Text.Encoding]::UTF8.GetString(
>     [Convert]::FromBase64String(
>         $(cat .\cypher.txt)
>     )
> )
cybergeddon
```

::: tip
cyborg7 Password: cybergeddon
:::




## Cyborg7

### Desciption

The password for cyborg8 is the executable name of a program that will start automatically when cyborg7 logs in.

**NOTE:**\
– The password will be lowercase no matter how it appears on the screen.

### Solution

```powershell
PS C:\users\cyborg7\desktop> Get-CimInstance -ClassName Win32_StartupCommand

Command                            User                 Caption
-------                            ----                 -------
C:\program files\SkyNet\skynet.exe underthewire\cyborg7 SKYNET
```

::: tip
cyborg8 Password: skynet
:::




## Cyborg8

### Desciption

The password for cyborg9 is the Internet zone that the picture on the desktop was downloaded from.

**NOTE:**\
– The password will be lowercase no matter how it appears on the screen.

### Solution

```powershell
PS C:\users\cyborg8\desktop> Get-Item -Path .\1_qs5nwlcl7f_-SwNlQvOrAw.png -Stream * | Select -Property Filename, Stream
, Length

FileName                                              Stream          Length
--------                                              ------          ------
C:\users\cyborg8\desktop\1_qs5nwlcl7f_-SwNlQvOrAw.png :$DATA           60113
C:\users\cyborg8\desktop\1_qs5nwlcl7f_-SwNlQvOrAw.png Zone.Identifier     26

PS C:\users\cyborg8\desktop> Get-Content -Path .\1_qs5nwlcl7f_-SwNlQvOrAw.png -Stream Zone.Identifier
[ZoneTransfer]
ZoneId=4
```

::: tip
cyborg9 Password: 4
:::

{% hint style="info" %}
[_Alternate Data Streams_](https://www.digital-detective.net/forensic-analysis-of-zone-identifier-stream/)
:::




## Cyborg9

### Desciption

The password for cyborg10 is the first name of the user with the phone number of 876-5309 listed in Active Directory **PLUS** the name of the file on the desktop.

**NOTE:**\
– If the first name “chris” and the file on the desktop is called “23”, then the password is “chris23”.\
– The password will be lowercase no matter how it appears on the screen.

### Solution

```powershell
PS C:\users\cyborg9\desktop> Get-ADUser -Filter { TelephoneNumber -eq "876-5309" }
 
DistinguishedName : CN=Garick\, Onita  \ ,OU=T-65,OU=X-Wing,DC=underthewire,DC=tech
Enabled           : False
GivenName         : Onita
Name              : Garick, Onita
ObjectClass       : user
ObjectGUID        : 5fc5bb5b-272a-4b70-877a-ed774029e247
SamAccountName    : Onita.Garick
SID               : S-1-5-21-758131494-606461608-3556270690-2124
Surname           : Garick
UserPrincipalName : Onita.Garick
 
PS C:\users\cyborg9\desktop> ls 
    Directory: C:\users\cyborg9\desktop
 
Mode                LastWriteTime         Length Name
----                -------------         ------ ----
-a----        8/30/2018  10:45 AM              0 99
```

::: tip
cyborg10 Password: onita99
:::




## Cyborg10

### Desciption

The password for cyborg11 is the description of the Applocker Executable deny policy for ill\_be\_back.exe **PLUS** the name of the file on the desktop.

**NOTE:**\
– If the description is “green$” and the file on the desktop is called “28”, then the password is “green$28”.\
– The password will be lowercase no matter how it appears on the screen.

### Solution

```powershell
PS C:\users\cyborg10\desktop> Get-AppLockerPolicy -Effective -XML
<AppLockerPolicy Version="1">
  <RuleCollection Type="Appx" EnforcementMode="NotConfigured" />
  <RuleCollection Type="Dll" EnforcementMode="NotConfigured" />
  <RuleCollection Type="Exe" EnforcementMode="NotConfigured">
    <FilePathRule
      Id="cf7f9744-e5de-4189-8499-236666a32796"
      Name="C:\Users\cyborg10\Documents\ill_be_back.exe"
      Description="terminated!"
      UserOrGroupSid="S-1-1-0"
      Action="Deny"
    >
      <Conditions>
        <FilePathCondition Path="C:\Users\cyborg10\Documents\ill_be_back.exe" />
      </Conditions>
    </FilePathRule>
  </RuleCollection>
  <RuleCollection Type="Msi" EnforcementMode="NotConfigured" />
  <RuleCollection Type="Script" EnforcementMode="NotConfigured" />
</AppLockerPolicy>

PS C:\users\cyborg10\desktop> ls
    Directory: C:\users\cyborg10\desktop

Mode                LastWriteTime         Length Name
----                -------------         ------ ----
-a----        8/30/2018  10:45 AM              0 99
```

::: tip
cyborg11 Password: terminated!99
:::

{% hint style="warning" %}
`Get-AppLockerPolicy -Effective -XML` Cmdlet Doesn't Output Formatted XML.
:::




## Cyborg11

### Desciption

The password for cyborg12 is located in the IIS log. The password is not Mozilla or Opera.

**NOTE:**\
– The password will be lowercase no matter how it appears on the screen.

### Solution

```powershell
PS C:\users\cyborg11\desktop> cat C:\inetpub\logs\logfiles\w3svc1\u_ex160413.log | sls "Mozilla|Opera" -NotMatch

#Software: Microsoft Internet Information Services 8.5
#Version: 1.0
#Date: 2016-04-13 04:14:01
#Fields: date time s-sitename s-computername s-ip cs-method cs-uri-stem cs-uri-query s-port cs-username c-ip
cs-version cs(User-Agent) cs(Cookie) cs(Referer) cs-host sc-status sc-substatus sc-win32-status sc-bytes cs-bytes
time-taken
2016-04-13 04:14:12 W3SVC1 Century 172.31.45.65 GET / - 80 - 172.31.45.65 HTTP/1.1
LordHelmet/5.0+(CombTheDesert)+Password+is:spaceballs - - century.underthewire.tech 200 0 0 925 118 0
```

::: tip
cyborg12 Password: spaceballs
:::




## Cyborg12

### Desciption

The password for cyborg13 is the first four characters of the base64 encoded full path to the file that started the i\_heart\_robots service **PLUS** the name of the file on the desktop.

**NOTE:**\
– An example of a full path would be ‘c:\some\_folder\test.exe’.\
– _**Be sure to use ‘unicode’ in your encoding.**_\
– If the encoded base64 is “rwmed2fdreewrt34t” and the file on the desktop is called “\_address”, then the password is “rwme\_address”.\
– The password will be lowercase no matter how it appears on the screen.

### Solution

```powershell
PS C:\users\cyborg12\desktop> $serviceName = "i_heart_robots"
PS C:\users\cyborg12\desktop> $service = Get-CimInstance -ClassName Win32_Service -Filter "Name = '$serviceName'"
PS C:\users\cyborg12\desktop> $service | Get-Member -Type Properties | sls path

string PathName {get;}

PS C:\users\cyborg12\desktop> $servicePath = $service.PathName ; $servicePath
c:\windows\system32\cmd.exe
PS C:\users\cyborg12\desktop> $pathEncoded = [Convert]::ToBase64String([System.Text.Encoding]::Unicode.GetBytes($service
Path)) ; $pathEncoded
YwA6AFwAdwBpAG4AZABvAHcAcwBcAHMAeQBzAHQAZQBtADMAMgBcAGMAbQBkAC4AZQB4AGUA
PS C:\users\cyborg12\desktop> $pathEncoded.Substring(0, 4).ToLower()
qzpc
PS C:\users\cyborg12\desktop> ls
    Directory: C:\users\cyborg12\desktop

Mode                LastWriteTime         Length Name
----                -------------         ------ ----
-a----        8/30/2018  10:45 AM              0 _heart

PS C:\users\cyborg12\desktop> $pathEncoded.Substring(0, 4).ToLower() + (ls).Name
ywa6_heart
```

::: tip
cyborg13 Password: ywa6\_heart
:::




## Cyborg13

### Desciption

The password cyborg14 is the number of days the refresh interval is set to for DNS aging for the underthewire.tech zone **PLUS** the name of the file on the desktop.

**NOTE:**\
– If the days are set to “08:00:00:00” and the file on the desktop is called “\_tuesday”, then the password is “8\_tuesday”.\
– The password will be lowercase no matter how it appears on the screen.

### Solution

```powershell
PS C:\users\cyborg13\desktop> Get-Command -Name "Get-Dns*"

CommandType     Name                                               Version    Source
-----------     ----                                               -------    ------
...
Function        Get-DnsServerZoneAging                             2.0.0.0    DnsServer
...

PS C:\users\cyborg13\desktop> Get-DnsServerZoneAging -Name "underthewire.tech"

ZoneName             : underthewire.tech
AgingEnabled         : True
AvailForScavengeTime : 9/21/2018 10:00:00 AM
RefreshInterval      : 22.00:00:00
NoRefreshInterval    : 7.00:00:00
ScavengeServers      :

PS C:\users\cyborg13\desktop> ls 
    Directory: C:\users\cyborg13\desktop 

Mode                LastWriteTime         Length Name
----                -------------         ------ ----
-a----        8/30/2018  10:45 AM              0 _days
```

::: tip
cyborg14 Password: 22\_days
:::




## Cyborg14

### Desciption

The password for cyborg15 is the caption for the DCOM application setting for application ID {59B8AFA0-229E-46D9-B980-DDA2C817EC7E} **PLUS** the name of the file on the desktop.

**NOTE:**\
– If the caption is “dcom” and the file on the desktop is called “\_address”, then the password is “dcom\_address”.\
– The password will be lowercase no matter how it appears on screen.

### Solution

```powershell
PS C:\users\cyborg14\desktop> $appID = "{59B8AFA0-229E-46D9-B980-DDA2C817EC7E}"

PS C:\users\cyborg14\desktop> Get-CimInstance -Class Win32_DCOMApplication -Filter "AppID = '$appID'" -Property *
  
Name                  : propshts
Status                :
Caption               : propshts
Description           : propshts
InstallDate           :
AppID                 : {59B8AFA0-229E-46d9-B980-DDA2C817EC7E}
PSComputerName        :
CimClass              : root/cimv2:Win32_DCOMApplication
CimInstanceProperties : {Caption, Description, InstallDate, Name...}
CimSystemProperties   : Microsoft.Management.Infrastructure.CimSystemProperties

PS C:\users\cyborg14\desktop> $appCaption = (Get-CimInstance -Class Win32_DCOMApplication -Filter "AppID = '$appID'" -Property *).Caption
PS C:\users\cyborg14\desktop> ls 
    Directory: C:\users\cyborg14\desktop 
    
Mode                LastWriteTime         Length Name
----                -------------         ------ ----
-a----        8/30/2018  10:45 AM              0 _objects
 
PS C:\users\cyborg14\desktop> $appCaption + (ls).Name
propshts_objects
```

::: tip
cyborg15 Password: propshts\_objects
:::




## All Passwords

::: tip
cyborg15 Password: propshts\_objects
:::

| Username |       Password      |
| :------: | :-----------------: |
|  cyborg1 |       cyborg1       |
|  cyborg2 |        kansas       |
|  cyborg3 | 172.31.45.167\_ipv4 |
|  cyborg4 |     88\_objects     |
|  cyborg5 |     bacon\_eggs     |
|  cyborg6 |    rowray\_timer    |
|  cyborg7 |     cybergeddon     |
|  cyborg8 |        skynet       |
|  cyborg9 |          4          |
| cyborg10 |       onita99       |
| cyborg11 |    terminated!99    |
| cyborg12 |      spaceballs     |
| cyborg13 |     ywa6\_heart     |
| cyborg14 |       22\_days      |
| cyborg15 |  propshts\_objects  |
