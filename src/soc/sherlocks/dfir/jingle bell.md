# Jingle bell

#windows #notifications 
## Description

Torrin is suspected to be an insider threat in Forela. He is believed to have leaked some data and removed certain applications from their workstation. They managed to bypass some controls and installed unauthorized software. Despite the forensic team's efforts, no evidence of data leakage was found. As a senior incident responder, you have been tasked with investigating the incident to determine the conversation between the two parties involved.
## Files

```bash
└─$ 7z l jinglebell.zip

7-Zip 23.01 (x64) : Copyright (c) 1999-2023 Igor Pavlov : 2023-06-20

   Date      Time    Attr         Size   Compressed  Name
------------------- ----- ------------ ------------  ------------------------
2023-04-20 10:39:04 .....      1507952       368814  Torrincase/C/Users/Appdata/Local/Microsoft/Windows/Notifications/wpndatabase.db-wal
2023-04-20 10:13:28 .....      1048576       105941  Torrincase/C/Users/Appdata/Local/Microsoft/Windows/Notifications/wpndatabase.db
2023-02-01 01:43:02 D....            0            0  Torrincase/C/Users/Appdata/Local/Microsoft/Windows/Notifications/wpnidm
2023-04-20 10:13:58 .....        32768         1133  Torrincase/C/Users/Appdata/Local/Microsoft/Windows/Notifications/wpndatabase.db-shm
------------------- ----- ------------ ------------  ------------------------
2023-04-20 10:49:24            2589296       475888  3 files, 9 folders

└─$ 7z x jinglebell.zip -o"jinglebell" -p"hacktheblue"

└─$ file *
wpndatabase.db:     SQLite 3.x database, user version 7, last written using SQLite version 3029000, writer version 2, read version 2, file counter 19, database pages 103, 1st free page 103, free pages 5, cookie 0x13, schema 4, UTF-8, version-valid-for 19
wpndatabase.db-shm: SQLite Write-Ahead Log shared memory, counter 29, page size 4096, 366 frames, 256 pages, frame checksum 0x417d2405, salt 0x29ea098e4bde10de, header checksum 0xb256fda3, read-mark[1] 0x16e
wpndatabase.db-wal: SQLite Write-Ahead Log, version 3007000
wpnidm:             directory
```

Useful information and scripts for parsing the database. [https://github.com/kacos2000/Win10/blob/master/Notifications/readme.md](https://github.com/kacos2000/Win10/blob/master/Notifications/readme.md)

```bash
└─$ sqlite3 -header -csv ./wpndatabase.db < Notifications.sql > Notifications.csv
```

## Tasks

### Task 1. Which software/application did Torrin use to leak Forela's secrets?

Group by `Tag` column. We have few application which was could have been used to leak the secrets. From these list it's either Slack or Mail.

![Writeup.png](/assets/soc/sherlocks/jingle bell/Writeup.png)

Opening the very first `Toast` Notification we see Cyberjunkie user is part of `forela-secrets-leak` channel!

![Writeup-1.png](/assets/soc/sherlocks/jingle bell/Writeup-1.png)

```xml
<toast activationType="protocol"
    launch="slack://channel?id=C05451QSQM8&amp;message=1681987020.043589&amp;team=T054518ADUJ&amp;origin=notification">
    <header id="T054518ADUJ" title="PrimeTech Innovations" activationType="protocol" arguments="slack://channel?team=T054518ADUJ"></header>
    <visual>
        <binding template="ToastGeneric">
            <text hint-wrap="false" hint-maxLines="1">New message in #forela-secrets-leak</text>
            <text hint-maxLines="10" hint-style="bodySubtle" hint-wrap="true">Cyberjunkie-PrimeTechDev:
                Bank Account Number: 03135905179789Sent 10
                000 £ to the above account as promised
                cheers</text>
            <image placement="appLogoOverride" hint-crop="circle"
                src="C:/Users/CYBERJ~1/AppData/Local/Temp/Notification Cache/5ad0b5f5ad7976cea80bb0ae6af2cebf.png" />
        </binding>
    </visual>
    <audio silent="true" />
</toast>
```

::: tip :bulb: Answer
`Slack`
:::

### Task 2. What's the name of the rival company to which Torrin leaked the data?

In the `header` tag we can see the title of company:
```xml
<header id="T054518ADUJ" title="PrimeTech Innovations" activationType="protocol" arguments="slack://channel?team=T054518ADUJ"></header>
```

::: tip :bulb: Answer
`PrimeTech Innovations`
:::

### Task 3. What is the username of the person from the competitor organization whom Torrin shared information with?

In the `text` section we can see who wrote Torrin.
```xml
<text hint-maxLines="10" hint-style="bodySubtle" hint-wrap="true">Cyberjunkie-PrimeTechDev: ...</text>
```

::: tip :bulb: Answer
`Cyberjunkie-PrimeTechDev`
:::

### Task 4. What's the channel name in which they conversed with each other?

::: tip :bulb: Answer
`forela-secrets-leak`
:::

### Task 5. What was the password for the archive server?

![Writeup-2.png](/assets/soc/sherlocks/jingle bell/Writeup-2.png)

```xml
<text hint-maxLines="10" hint-style="bodySubtle" hint-wrap="true">
Cyberjunkie-PrimeTechDev: Just to confirm as we dont want forela's IT team to get suspiciousPassword for the archive server is :"Tobdaf8Qip$re@1"
</text>
```

::: tip :bulb: Answer
`Tobdaf8Qip$re@1`
:::

### Task 6. What was the URL provided to Torrin to upload stolen data to?

In the row with `Order=63`:
```xml
<toast activationType="protocol"
    launch="slack://channel?id=C05451QSQM8&amp;message=1681986889.660179&amp;team=T054518ADUJ&amp;origin=notification">
    <header id="T054518ADUJ" title="PrimeTech Innovations" activationType="protocol"
        arguments="slack://channel?team=T054518ADUJ"></header>
    <visual>
        <binding template="ToastGeneric">
            <text hint-wrap="false" hint-maxLines="1">New message in #forela-secrets-leak</text>
            <text hint-maxLines="10" hint-style="bodySubtle" hint-wrap="true">Cyberjunkie-PrimeTechDev:
                https://drive.google.com/drive/folders/1vW97VBmxDZUIEuEUG64g5DLZvFP-Pdll?usp=sharing
                , remember to upload the documents and pdfs too</text>
            <image placement="appLogoOverride" hint-crop="circle"
                src="C:/Users/CYBERJ~1/AppData/Local/Temp/Notification Cache/5ad0b5f5ad7976cea80bb0ae6af2cebf.png" />
        </binding>
    </visual>
    <audio silent="true" />
</toast>
```
::: tip :bulb: Answer
`https://drive.google.com/drive/folders/1vW97VBmxDZUIEuEUG64g5DLZvFP-Pdll?usp=sharing`
:::

### Task 7. When was the above link shared with Torrin?

In the `toast` tag `launch` attribute there's `message=timestamp` which indicates when message was sent, parse it as human readable format:
```bash
└─$ py
Python 3.11.9 (main, Apr 10 2024, 13:16:36) [GCC 13.2.0] on linux
Type "help", "copyright", "credits" or "license" for more information.
>>> from datetime import datetime
>>> str(datetime.fromtimestamp(1681986889.660179))
'2023-04-20 06:34:49.660179'
>>> str(datetime.utcfromtimestamp(1681986889.660179))
'2023-04-20 10:34:49.660179'
```

::: tip :bulb: Answer
`2023-04-20 10:34:49`
:::

::: info Note
Datetimes should be taken as UTC.
:::
### Task 8. For how much money did Torrin leak Forela's secrets?

Latest notification (Question 1) mentions the payment:
```xml
<text hint-maxLines="10" hint-style="bodySubtle" hint-wrap="true">
Cyberjunkie-PrimeTechDev: Bank Account Number: 03135905179789Sent 10000 £ to the above account as promised cheers
</text>
```

> Answer `£10000`

