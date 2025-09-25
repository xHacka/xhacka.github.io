# Level 14   Crack Password

[http://suninatas.com/challenge/web14/web14.asp](http://suninatas.com/challenge/web14/web14.asp)

![level-14---forensics.png](/assets/ctf/suninatas/forensics/level-14-forensics.png)

[Download](http://suninatas.com/challenge/web14/evidence.tar)

```bash
└─$ curl http://suninatas.com/challenge/web14/evidence.tar -LOs

└─$ tar -xvf evidence.tar
passwd
shadow

└─$ cat passwd
root:x:0:0:root:/root:/bin/bash
daemon:x:1:1:daemon:/usr/sbin:/bin/sh
bin:x:2:2:bin:/bin:/bin/sh
sys:x:3:3:sys:/dev:/bin/sh
sync:x:4:65534:sync:/bin:/bin/sync
games:x:5:60:games:/usr/games:/bin/sh
man:x:6:12:man:/var/cache/man:/bin/sh
lp:x:7:7:lp:/var/spool/lpd:/bin/sh
mail:x:8:8:mail:/var/mail:/bin/sh
news:x:9:9:news:/var/spool/news:/bin/sh
uucp:x:10:10:uucp:/var/spool/uucp:/bin/sh
proxy:x:13:13:proxy:/bin:/bin/sh
www-data:x:33:33:www-data:/var/www:/bin/sh
backup:x:34:34:backup:/var/backups:/bin/sh
list:x:38:38:Mailing List Manager:/var/list:/bin/sh
irc:x:39:39:ircd:/var/run/ircd:/bin/sh
gnats:x:41:41:Gnats Bug-Reporting System (admin):/var/lib/gnats:/bin/sh
libuuid:x:100:101::/var/lib/libuuid:/bin/sh
syslog:x:101:103::/home/syslog:/bin/false
sshd:x:102:65534::/var/run/sshd:/usr/sbin/nologin
landscape:x:103:108::/var/lib/landscape:/bin/false
messagebus:x:104:112::/var/run/dbus:/bin/false
nobody:x:65534:65534:nobody:/nonexistent:/bin/sh
mysql:x:105:113::/var/lib/mysql:/bin/false
avahi:x:106:114::/var/run/avahi-daemon:/bin/false
snort:x:107:115:Snort IDS:/var/log/snort:/bin/false
statd:x:108:65534::/var/lib/nfs:/bin/false
usbmux:x:109:46::/home/usbmux:/bin/false
pulse:x:110:116::/var/run/pulse:/bin/false
rtkit:x:111:117::/proc:/bin/false
festival:x:112:29::/home/festival:/bin/false
postgres:x:1000:1000::/home/postgres:/bin/sh
haldaemon:x:113:122:Hardware abstraction layer,,,:/var/run/hald:/bin/false
suninatas:x:1001:1001::/home/suninatas:/bin/sh

└─$ cat shadow
root:$6$E2loH6yC$0lcZ0hG/b.YqlsPhawt5NtX2jJkSFBK6eaF/wa46d8/3KPs6d45jNHgNoJOl7X1RsOrYsZ.J/BBexJ93ECVfW.:15426:0:99999:7:::
daemon:x:15426:0:99999:7:::
bin:x:15426:0:99999:7:::
sys:x:15426:0:99999:7:::
sync:x:15426:0:99999:7:::
games:x:15426:0:99999:7:::
man:x:15426:0:99999:7:::
lp:x:15426:0:99999:7:::
mail:x:15426:0:99999:7:::
news:x:15426:0:99999:7:::
uucp:x:15426:0:99999:7:::
proxy:x:15426:0:99999:7:::
www-data:x:15426:0:99999:7:::
backup:x:15426:0:99999:7:::
list:x:15426:0:99999:7:::
irc:x:15426:0:99999:7:::
gnats:x:15426:0:99999:7:::
libuuid:x:15426:0:99999:7:::
syslog:x:15426:0:99999:7:::
sshd:x:15426:0:99999:7:::
landscape:x:15426:0:99999:7:::
messagebus:x:15426:0:99999:7:::
nobody:x:15426:0:99999:7:::
mysql:!:15426:0:99999:7:::
avahi:*:15426:0:99999:7:::
snort:*:15426:0:99999:7:::
statd:*:15426:0:99999:7:::
usbmux:*:15426:0:99999:7:::
pulse:*:15426:0:99999:7:::
rtkit:*:15426:0:99999:7:::
festival:*:15426:0:99999:7:::
postgres:!:15426:0:99999:7:::
haldaemon:*:15426:0:99999:7:::
suninatas:$6$QlRlqGhj$BZoS9PuMMRHZZXz1Gde99W01u3kD9nP/zYtl8O2dsshdnwsJT/1lZXsLar8asQZpqTAioiey4rKVpsLm/bqrX/:15427:0:99999:7:::
```

Looks like we will need to crack the password.

```powershell
➜ .\john-1.9.0-jumbo-1-win64\run\john.exe .\hashes.txt --wordlist=.\rockyou.txt
iloveu1          (?)
```

::: tip Flag
`iloveu1`
:::

