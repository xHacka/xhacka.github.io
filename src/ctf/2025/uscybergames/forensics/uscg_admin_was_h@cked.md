# USCG Admin was H@cked

## Description

One of the US Cyber Games administrators had their system hacked. There is a malicious startup Application set to run when a user logs in. Can you help find it?

Download: [registry.7z](https://ctf.uscybergames.com/files/b9c254f8f8ebfb7d26b8c3a5f4a642a3/registry.7z?token=eyJ1c2VyX2lkIjoxMDY4LCJ0ZWFtX2lkIjpudWxsLCJmaWxlX2lkIjo0MH0.aE0wDA.BsyZLM2ypHzRuA2WGgjWb5eGVbM)

Author: JesseV

## Solution

I knew nothing, after quick Google this came up: [Blue Team-System Live Analysis [Part 11\]- Windows: User Account Forensics- NTUSER.DAT Rules, Tools, Structure, and Dirty Hives!](https://nothingcyber.medium.com/blue-team-system-live-analysis-part-11-windows-user-account-forensics-ntuser-dat-495ab41393db)

Download **Registry Explorer** and open `Users/uscgadmin/NTUSER.DAT`

Then lookup one of these common locations for startup applications: 
- `NTUSER.DAT\Software\Microsoft\Windows\CurrentVersion\Run`
- `NTUSER.DAT\Software\Microsoft\Windows\CurrentVersion\RunOnce`
- `NTUSER.DAT\Software\Microsoft\Windows\CurrentVersion\Policies\Explorer\Run`

![USCG_Admin_was_H@cked.png](/assets/ctf/uscybergames/uscg_admin_was_h@cked.png)

::: tip Flag
`SVUSCG{uf0undme}`
:::

