# Campfire-2

#windows #evtx #kerberos #dfir 
## Description

Forela's Network is constantly under attack. The security system raised an alert about an old admin account requesting a ticket from KDC on a domain controller. Inventory shows that this user account is not used as of now so you are tasked to take a look at this. This may be an AsREP roasting attack as anyone can request any user's ticket which has preauthentication disabled.

### AS-REP Roasting Attack

In the MITRE ATT&CK Framework, the AS-REP Roasting attack is categorized as [**T1558.004**](https://attack.mitre.org/techniques/T1558/004/) under the 'Steal or Forge Kerberos Tickets' attack technique. It exploits a vulnerability in Kerberos when the 'Do not require Kerberos preauthentication' setting is enabled. **This vulnerability allows adversaries to extract user hashes, enabling them to decrypt passwords offline.** This attack poses a significant threat to IT networks worldwide, as it can provide unauthorized access to domain resources.

Source: [AS-REP Roasting Attack Explained - MITRE ATT&CK T1558.004](https://www.picussecurity.com/resource/blog/as-rep-roasting-attack-explained-mitre-attack-t1558.004)

### Detection Methods for the AS-REP Roasting Attack

Detection of AS-REP Roasting attacks is crucial in order to mitigate the risk of password theft. One way to detect such attacks is to monitor for changes to the setting that controls whether Kerberos preauthentication is enabled. 

**Event ID 4738** - A user account was changed.
- Key Description Fields:  Security ID, Account Name, Account Domain, Logon ID,  Security ID, Account Name 

For instance, during this kind of an attack, the Event ID 4738 is generated. This event indicates a Kerberos authentication service ticket request and will contain parameters such as the Ticket Encryption Type (**0x17**), Ticket Options (0x40800010), and Service Name (**krbtgt**). If these parameters are found in the event logs, it may indicate that an AS-REP Roasting attack is taking place, as this event is generated during the manipulation of domain objects by the attacker.

![file|700](https://lh7-us.googleusercontent.com/3z7WB7R3R0-U4MZ-tGVCboVvHuidVTTPtk5tYm0A_ESZlHsj4UR8iQOI4MjS7YQJFz6ypgcpcOhyMkcBA60SIFLDBFr5QxI1X6yuBJtmTbEiIP5e8RqBAbunII7roWpXoNqdHbmV5uBOgYTknK8xUxo)

**Event ID 5136** - A directory service object was modified.
- Key Description Fields: Security ID, Account Name, Account Domain, Logon ID, DN, GUID, Class, LDAP Display Name

Another option is to monitor Event ID 5136, which provides information about changes made to user accounts within a Windows environment. By analyzing the logs from this event, it is possible to identify any user accounts that have had the setting for Kerberos preauthentication changed.

### Reading

1. [Detecting Active Directory Kerberos Attacks: Threat Research Release, March 2022](https://www.splunk.com/en_us/blog/security/detecting-active-directory-kerberos-attacks-threat-research-release-march-2022.html)
2. [AS-REP Roasting Attack Explained - MITRE ATT&CK T1558.004](https://www.picussecurity.com/resource/blog/as-rep-roasting-attack-explained-mitre-attack-t1558.004)
3. [Windows Security Log Event ID 4769](https://www.ultimatewindowssecurity.com/securitylog/encyclopedia/event.aspx?eventid=4769)

## Files

We are given `evtx` file which is Windows System Events Logs file.

```powershell
➜ 7z l .\campfire-2.zip

7-Zip 22.01 (x64) : Copyright (c) 1999-2022 Igor Pavlov : 2022-07-15

   Date      Time    Attr         Size   Compressed  Name
------------------- ----- ------------ ------------  ------------------------
2024-05-29 10:41:29 ....A      1118208        24839  Security.evtx
------------------- ----- ------------ ------------  ------------------------
2024-05-29 10:41:29            1118208        24839  1 files
➜ 7z x .\campfire-2.zip -p"hacktheblue"
```

`evtx` can be converted to `csv` via powershell and analyzed in TimelineExplorer.
```powershell
➜ Get-WinEvent -Path .\Security.evtx | Export-Csv -Path .\Security.csv
```

![Writeup.png](/assets/soc/sherlocks/campfire-2/Writeup.png)

> Note: `Ctrl+R` to reset sizes of columns (so you don't have Message column stretching over the horizon).
## Tasks

### Task 1. When did the ASREP Roasting attack occur, and when did the attacker request the Kerberos ticket for the vulnerable user?

We are looking for an indicator of ASREP.  In [[#Detection Methods for the AS-REP Roasting Attack]] section it's mentioned that if "*Encryption Type (**0x17**), Ticket Options (0x40800010), and Service Name (**krbtgt**)*" is found it may indicate that we are dealing with ASREP attack.

![Writeup-1.png](/assets/soc/sherlocks/campfire-2/Writeup-1.png)

For the answer I had to consult `evtx` file itself via Windows Event Viewer.

![Writeup-2.png](/assets/soc/sherlocks/campfire-2/Writeup-2.png)

We can see SystemTime is off by 4hours in csv.

::: tip :bulb: Answer
`2024-05-29 06:36:40`
:::

### Task 2. Please confirm the User Account that was targeted by the attacker.

```
A Kerberos authentication ticket (TGT) was requested.

Account Information:
	Account Name:		    arthur.kyle
	Supplied Realm Name:	forela.local
	User ID:			    S-1-5-21-3239415629-1862073780-2394361899-1601

Service Information:
	Service Name:		krbtgt
	Service ID:		    S-1-5-21-3239415629-1862073780-2394361899-502

Network Information:
	Client Address:		::ffff:172.17.79.129
	Client Port:		61965

Additional Information:
	Ticket Options:		     0x40800010
	Result Code:		     0x0
	Ticket Encryption Type:	 0x17
	Pre-Authentication Type: 0

Certificate Information:
	Certificate Issuer Name:		
	Certificate Serial Number:	
	Certificate Thumbprint:		

Certificate information is only provided if a certificate was used for pre-authentication.

Pre-authentication types, ticket options, encryption types and result codes are defined in RFC 4120.
```

::: tip :bulb: Answer
`arthur.kyle`
:::

### Task 3. What was the SID of the account?

::: tip :bulb: Answer
`S-1-5-21-3239415629-1862073780-2394361899-1601`
:::

### Task 4. It is crucial to identify the compromised user account and the workstation responsible for this attack. Please list the internal IP address of the compromised asset to assist our threat-hunting team.

::: tip :bulb: Answer
`172.17.79.129`
:::

### Task 5. We do not have any artifacts from the source machine yet. Using the same DC Security logs, can you confirm the user account used to perform the ASREP Roasting attack so we can contain the compromised account/s?

After the ASREP event we can see Kerberos service ticket being requested. `Failure Code: 0x0` indicates successful logon.

![Writeup-3.png](/assets/soc/sherlocks/campfire-2/Writeup-3.png)

::: tip :bulb: Answer
`happy.grunwald`
:::


