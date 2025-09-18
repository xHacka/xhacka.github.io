# Web

## Description

by `Eth007`

We recovered this file from the disk of a potential threat actor. Can you find out what they were up to?

**Attachments**: [web.zip](https://imaginaryctf.org/r/y1V79#web.zip)

## Solution

Using [dumpzilla](https://www.dumpzilla.org) explore the profile I stumbled something interesting.

```bash
└─$ py dumpzilla.py ./.mozilla/firefox/8ubdbl3q.default/ --History

Execution time: 2023-07-23 19:35:42.503972
Mozilla Profile: ./.mozilla/firefox/8ubdbl3q.default/
...

Last visit: 2023-07-10 02:53:53
Title: PALMS Backchannel Chat | The new alternative to Todaysmeet
URL: https://yoteachapp.com/supersecrethackerhideout
Frequency: 2

...
```

After viting URL and enter username we are redirected to <https://yoteachapp.com/password/64ab39b5b13dfb00148ea72f> and we are asked for password.

After going through the files we find `logins.json`

```json
{
  "nextId": 2,
  "logins": [
    {
      "id": 1,
      "hostname": "https://yoteachapp.com",
      "httpRealm": null,
      "formSubmitURL": "https://yoteachapp.com",
      "usernameField": "",
      "passwordField": "",
      "encryptedUsername": "MDIEEPgAAAAAAAAAAAAAAAAAAAEwFAYIKoZIhvcNAwcECJs6PTFwzrMiBAiRmXcD4tn3bw==",
      "encryptedPassword": "MGIEEPgAAAAAAAAAAAAAAAAAAAEwFAYIKoZIhvcNAwcECBZPCW+NjkpUBDieso9w5lPvD85RNcErLbGTXdamyji7ZKcL9FHxjnvt1WqwcVCsOETgCWCgwCg1jJmAW/MYugOoqQ==",
      "guid": "{8ee7f027-974b-48cb-b9aa-29fc5a728c39}",
      "encType": 1,
      "timeCreated": 1688943236140,
      "timeLastUsed": 1688943236140,
      "timePasswordChanged": 1688943236140,
      "timesUsed": 1,
      "encryptedUnknownFields": null
    }
  ],
  "potentiallyVulnerablePasswords": [],
  "dismissedBreachAlertsByLoginGUID": {},
  "version": 3
}
```

Luckily for us there's [Firefox Decrypt](https://github.com/unode/firefox_decrypt) tool.

```bash
└─$ py firefox_decrypt/firefox_decrypt.py ./.mozilla/firefox/     

Website:   https://yoteachapp.com
Username: ''
Password: 'UeMBYIbgPqNiSWzOVguTbccMOnLirDoEGTjgiqNrbOvwzynbyN'
```

Great, let's login. And we are in.

Ctrl+F to search for `ictf`

```
[*] flag found: ictf{behold_th3_forensics_g4untlet_827b3f13}
```
::: tip Flag
`ictf{behold_th3_forensics_g4untlet_827b3f13}`
:::

### Note

I found the stored username in given path, but it wasn't required.

```bash
└─$ sqlite3 ./.mozilla/firefox/8ubdbl3q.default/storage/default/https+++yoteachapp.com/ls/data.sqlite 
SQLite version 3.40.1 2022-12-28 14:03:47
Enter ".help" for usage hints.
sqlite> .tables
data      database
sqlite> SELECT * FROM data;
YoLoginJWT@https://yoteach-cloud.herokuapp.com/|29|1|0|0|{"JWT":false,"Profile":false}
yo/chatter|65|1|0|0|{"name":"hacker42","uuid":"c876d4f0-31bc-4a62-866a-0d8fd26e75d9"}
restore-send-field|65|1|0|0|how did they get you to be so realistic lol. you almost fooled me
```