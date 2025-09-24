# Venus

## Description

```bash
Host: venus.hackmyvm.eu
Port: 5000
User: hacker
Pass: havefun!
```

## Level 1

```bash
➜ ssh venus.hackmyvm.eu -p 5000 -l hacker
hacker@venus:~$ id
uid=1052(hacker) gid=1052(hacker) groups=1052(hacker)
hacker@venus:~$ find . -type f -ls
   668972      4 -rw-r--r--   1 hacker   hacker        220 Apr 23  2023 ./.bash_logout
   668973      4 -rwxr-xr-x   1 hacker   hacker       3653 Jul 24 00:48 ./.bashrc
   668974      4 -rw-r-----   1 root     hacker         16 Apr  5  2024 ./.myhiddenpazz
   668977      4 -rw-r-----   1 root     hacker       2542 Apr  5  2024 ./readme.txt
   668976      4 -rw-r-----   1 root     hacker        287 Apr  5  2024 ./mission.txt
   668971      4 -rw-r-----   1 root     hacker         31 Apr  5  2024 ./...
   668975      0 -rw-r--r--   1 hacker   hacker          0 Jun 20 00:35 ./.profile
```

```bash
hacker@venus:~$ cat readme.txt
Hello hax0r,
Welcome to the HMVLab Chapter 1: Venus!
This is a CTF for beginners where you can practice your skills with Linux and CTF
so lets start! :)
First of all, the home of each user is in /pwned/USER and in it you will find a file called mission.txt which will contain
the mission to complete to get the password of the next user.
It will also contain the flagz.txt file, which if you are registered at https://hackmyvm.eu you can enter to participate in the ranking (optional).
And for a bit of improvisation, there are secret levels and hidden flags: D
You will not have write permissions in most folders so if you need to write a script or something
use /tmp folder, keep in mind that it is frequently deleted ...

And last (and not least) some users can modify the files that are in the
folder /www, these files are accessible from http://venus.hackmyvm.eu so if you get a user
that can modify the file /www/hi.txt, you can put a message and it will be reflected in http://venus.hackmyvm.eu/hi.txt.

If you have questions/ideas or want to comment us anything you can join
to our Discord: https://discord.gg/DxDFQrJ

Remember there are more people playing so be respectful.
Hack & Fun!
```

```bash
hacker@venus:~$ cat mission.txt
################
# MISSION 0x01 #
################
User sophia has saved her password in a hidden file in this folder. Find it and log in as sophia.

hacker@venus:~$ cat .myhiddenpazz
Y1o645M3mR84ejc
```

> Creds: `sophia:Y1o645M3mR84ejc`

## Level 2

```bash
# ➜ ssh venus.hackmyvm.eu -p 5000 -l sophia
# # or
# su - sophia
sophia@venus:~$ id
uid=1002(sophia) gid=1002(sophia) groups=1002(sophia)
sophia@venus:~$ find . -type f -ls
   669141      4 -rw-r--r--   1 sophia   sophia        220 Apr 23  2023 ./.bash_logout
   669142      4 -rw-r--r--   1 sophia   sophia       3526 Apr 23  2023 ./.bashrc
   669144      4 -rw-r-----   1 root     sophia         31 Apr  5  2024 ./flagz.txt
   669145      4 -rw-r-----   1 root     sophia        359 Apr  5  2024 ./mission.txt
   669143      4 -rw-r--r--   1 sophia   sophia        808 Mar 22 13:29 ./.profile
```

```bash
sophia@venus:~$ cat mission.txt
################
# MISSION 0x02 #
################
The user angela has saved her password in a file but she does not remember where ... she only remembers that the file was called whereismypazz.txt
```

```bash
sophia@venus:~$ find / -type f -name whereismypazz.txt 2>/dev/null
/usr/share/whereismypazz.txt
sophia@venus:~$ cat /usr/share/whereismypazz.txt
oh5p9gAABugHBje
```

> Creds: `angela:oh5p9gAABugHBje`

## Level 3

```bash
angela@venus:~$ id
uid=1003(angela) gid=1003(angela) groups=1003(angela),1054(www3)
angela@venus:~$ find . -type f -ls
   668801      4 -rw-r--r--   1 angela   angela        220 Apr 23  2023 ./.bash_logout
   668802      4 -rw-r--r--   1 angela   angela       3526 Apr 23  2023 ./.bashrc
   668804     76 -rw-r-----   1 root     angela      73888 Apr  5  2024 ./findme.txt
   668805      4 -rw-r-----   1 root     angela         31 Apr  5  2024 ./flagz.txt
   668806      4 -rw-r-----   1 root     angela        216 Apr  5  2024 ./mission.txt
   668803      4 -rw-r--r--   1 angela   angela        807 Apr 23  2023 ./.profile
```

```bash
angela@venus:~$ cat mission.txt
################
# MISSION 0x03 #
################
The password of the user emma is in line 4069 of the file findme.txt
```

```bash
angela@venus:~$ sed -n '4069p' findme.txt
fIvltaGaq0OUH8O
angela@venus:~$ awk 'NR==4069' findme.txt
fIvltaGaq0OUH8O
```

> Creds: `emma:fIvltaGaq0OUH8O`

## Level 4

```bash
emma@venus:~$ id
uid=1004(emma) gid=1004(emma) groups=1004(emma)
emma@venus:~$ find . -type f -ls
   668934      4 -rw-r--r--   1 emma     emma          220 Apr 23  2023 ./.bash_logout
   668935      4 -rw-r--r--   1 emma     emma         3526 Apr 23  2023 ./.bashrc
   668933      4 -rw-r-----   1 root     emma           16 Apr  5  2024 ./-
   668937      4 -rw-r-----   1 root     emma           31 Apr  5  2024 ./flagz.txt
   668938      4 -rw-r-----   1 root     emma          170 Apr  5  2024 ./mission.txt
   668936      4 -rw-r--r--   1 emma     emma          807 Apr 23  2023 ./.profile
```

```bash
emma@venus:~$ cat mission.txt
################
# MISSION 0x04 #
################
## EN ##
User mia has left her password in the file -.
```

```bash
emma@venus:~$ cat ./-
iKXIYg0pyEH2Hos
```

> Creds: `mia:iKXIYg0pyEH2Hos`

## Level 5

```bash
mia@venus:~$ id
fuid=1005(mia) gid=1005(mia) groups=1005(mia)i
mia@venus:~$ find . -type f -ls
   669094      4 -rw-r--r--   1 mia      mia           220 Apr 23  2023 ./.bash_logout
   669095      4 -rw-r--r--   1 mia      mia          3526 Apr 23  2023 ./.bashrc
   669097      4 -rw-r-----   1 root     mia            31 Apr  5  2024 ./flagz.txt
   669098      4 -rw-r-----   1 root     mia           244 Apr  5  2024 ./mission.txt
   669096      4 -rw-r--r--   1 mia      mia           807 Apr 23  2023 ./.profile
```

```bash
mia@venus:~$ cat mission.txt
################
# MISSION 0x05 #
################
It seems that the user camila has left her password inside a folder called hereiam
```

```bash
mia@venus:~$ find / -type d -name hereiam 2>/dev/null
/opt/hereiam
mia@venus:~$ ls /opt/hereiam/ -Alh
total 4.0K
-rw-r--r-- 1 root root 16 Apr  5  2024 .here
mia@venus:~$ cat /opt/hereiam/.here
F67aDmCAAgOOaOc
```

> Creds: `camila:F67aDmCAAgOOaOc`

## Level 6

```bash
camila@venus:~$ id
uid=1006(camila) gid=1006(camila) groups=1006(camila)f
camila@venus:~$ find . -type f -ls
   668834      4 -rw-r--r--   1 camila   camila        220 Apr 23  2023 ./.bash_logout
   668835      4 -rw-r--r--   1 camila   camila       3526 Apr 23  2023 ./.bashrc
   668837      4 -rw-r-----   1 root     camila         31 Apr  5  2024 ./flagz.txt
   668838      4 -rw-r-----   1 root     camila        226 Apr  5  2024 ./mission.txt
   918328      4 -rw-r-----   1 root     camila         16 Apr  5  2024 ./muack/111/111/muack
   668836      4 -rw-r--r--   1 camila   camila        807 Apr 23  2023 ./.profile
```

```bash
camila@venus:~$ cat mission.txt
################
# MISSION 0x06 #
################
The user luna has left her password in a file inside the muack folder.
```

```bash
camila@venus:~$ cat ./muack/111/111/muack
j3vkuoKQwvbhkMc
```

> Creds: `luna:j3vkuoKQwvbhkMc`

## Level 7

```bash
luna@venus:~$ id; find . -type f -ls
uid=1007(luna) gid=1007(luna) groups=1007(luna)
   669068      4 -rw-r--r--   1 luna     luna          220 Apr 23  2023 ./.bash_logout
   669069      4 -rw-r--r--   1 luna     luna         3526 Apr 23  2023 ./.bashrc
   669071      4 -rw-r-----   1 root     luna           31 Apr  5  2024 ./flagz.txt
   669072      4 -rw-r-----   1 root     luna          224 Apr  5  2024 ./mission.txt
   669070      4 -rw-r--r--   1 luna     luna          807 Apr 23  2023 ./.profile
```

```bash
luna@venus:~$ cat mission.txt
################
# MISSION 0x07 #
################
The user eleanor has left her password in a file that occupies 6969 bytes.
```

```bash
luna@venus:~$ find / -type f -size 6969c 2>/dev/null
/usr/share/moon.txt
luna@venus:~$ cat /usr/share/moon.txt
UNDchvln6Bmtu7b
```

> Creds: `eleanor:UNDchvln6Bmtu7b`

## Level 8

```bash
eleanor@venus:~$ id; find . -type f -ls
uid=1008(eleanor) gid=1008(eleanor) groups=1008(eleanor)
   668907      4 -rw-r--r--   1 eleanor  eleanor       220 Apr 23  2023 ./.bash_logout
   668908      4 -rw-r--r--   1 eleanor  eleanor      3526 Apr 23  2023 ./.bashrc
   668910      4 -rw-r-----   1 root     eleanor        31 Apr  5  2024 ./flagz.txt
   668911      4 -rw-r-----   1 root     eleanor       265 Apr  5  2024 ./mission.txt
   668909      4 -rw-r--r--   1 eleanor  eleanor       807 Apr 23  2023 ./.profile
```

```bash
eleanor@venus:~$ cat mission.txt
################
# MISSION 0x08 #
################
The user victoria has left her password in a file in which the owner is the user violin.
```

```bash
eleanor@venus:~$ find / -user violin -readable 2>/dev/null
/usr/local/games/yo
eleanor@venus:~$ cat /usr/local/games/yo
pz8OqvJBFxH0cSj
```

> Creds: `victoria:pz8OqvJBFxH0cSj`

## Level 9

```bash
victoria@venus:~$ id; find . -type f -ls
uid=1009(victoria) gid=1009(victoria) groups=1009(victoria)
   669153      4 -rw-r--r--   1 victoria victoria      220 Apr 23  2023 ./.bash_logout
   669154      4 -rw-r-----   1 root     victoria     3569 Apr  5  2024 ./.bashrc
   669156      4 -rw-r-----   1 root     victoria       31 Apr  5  2024 ./flagz.txt
   669157      4 -rw-r-----   1 root     victoria      179 Apr  5  2024 ./mission.txt
   669158      4 -rw-r-----   1 root     victoria      220 Apr  5  2024 ./passw0rd.zip
   669155      4 -rw-r--r--   1 victoria victoria      807 Apr 23  2023 ./.profile
```

```bash
victoria@venus:~$ cat mission.txt
################
# MISSION 0x09 #
################
The user isla has left her password in a zip file.
```

```bash
victoria@venus:~$ mktemp -d
/tmp/tmp.uR5HVe2UYU
victoria@venus:~$ unzip passw0rd.zip -d /tmp/tmp.uR5HVe2UYU
Archive:  passw0rd.zip
 extracting: /tmp/tmp.uR5HVe2UYU/pwned/victoria/passw0rd.txt
victoria@venus:~$ cat /tmp/tmp.uR5HVe2UYU/pwned/victoria/passw0rd.txt
D3XTob0FUImsoBb
```

> Creds: `isla:D3XTob0FUImsoBb`

## Level 10

```bash
isla@venus:~$ id; find . -type f -ls
uid=1010(isla) gid=1010(isla) groups=1010(isla)
   669006      4 -rw-r--r--   1 isla     isla          220 Apr 23  2023 ./.bash_logout
   669007      4 -rw-r--r--   1 isla     isla         3526 Apr 23  2023 ./.bashrc
   669011     20 -rw-r-----   1 root     isla        16968 Apr  5  2024 ./passy
   669009      4 -rw-r-----   1 root     isla           31 Apr  5  2024 ./flagz.txt
   669010      4 -rw-r-----   1 root     isla          318 Apr  5  2024 ./mission.txt
   669008      4 -rw-r--r--   1 isla     isla          807 Apr 23  2023 ./.profile
```

```bash
isla@venus:~$ cat mission.txt
################
# MISSION 0x10 #
################
The password of the user violet is in the line that begins with a9HFX (these 5 characters are not part of her password.).
```

```bash
isla@venus:~$ grep ^a9HFX passy --color=auto
a9HFXWKINVzNQLKLDVAc
isla@venus:~$ grep -oP '^a9HFX\K.*' passy
WKINVzNQLKLDVAc
```

> Creds: `violet:WKINVzNQLKLDVAc`

## Level 11

```bash
violet@venus:~$ id; find . -type f -ls
uid=1011(violet) gid=1011(violet) groups=1011(violet)
   669160      4 -rw-r--r--   1 violet   violet        220 Apr 23  2023 ./.bash_logout
   669161      4 -rw-r--r--   1 violet   violet       3526 Apr 23  2023 ./.bashrc
   669163     20 -rw-r-----   1 root     violet      16947 Apr  5  2024 ./end
   669164      4 -rw-r-----   1 root     violet         31 Apr  5  2024 ./flagz.txt
   669165      4 -rw-r-----   1 root     violet        327 Apr  5  2024 ./mission.txt
   669162      4 -rw-r--r--   1 violet   violet        807 Apr 23  2023 ./.profile
```

```bash
violet@venus:~$ cat mission.txt
################
# MISSION 0x11 #
################
The password of the user lucy is in the line that ends with 0JuAZ (these last 5 characters are not part of her password)
```

```bash
violet@venus:~$ grep '0JuAZ$' end
OCmMUjebG53giud0JuAZ
violet@venus:~$ grep '0JuAZ$' end | sed 's/0JuAZ//'
OCmMUjebG53giud
```

> Creds: `lucy:OCmMUjebG53giud`

## Level 12

```bash
lucy@venus:~$ id; find . -type f -ls
uid=1012(lucy) gid=1012(lucy) groups=1012(lucy)
   669061      4 -rw-r--r--   1 lucy     lucy          220 Apr 23  2023 ./.bash_logout
   669062      4 -rw-r--r--   1 lucy     lucy         3526 Apr 23  2023 ./.bashrc
   669065      4 -rw-r-----   1 root     lucy           31 Apr  5  2024 ./flagz.txt
   669066      4 -rw-r-----   1 root     lucy          205 Apr  5  2024 ./mission.txt
   669064     16 -rw-r-----   1 root     lucy        12720 Apr  5  2024 ./file.yo
   669063      4 -rw-r--r--   1 lucy     lucy          807 Apr 23  2023 ./.profile
```

```bash
lucy@venus:~$ cat mission.txt
################
# MISSION 0x12 #
################
The password of the user elena is between the characters fu and ck
```

```bash
lucy@venus:~$ grep 'fu.*ck' file.yo
fu4xZ5lIKYmfPLg9tck
lucy@venus:~$ grep -Po 'fu\K.*?(?=ck)' file.yo
4xZ5lIKYmfPLg9t
```

> Creds: `elena:4xZ5lIKYmfPLg9t`

## Level 13

```bash
elena@venus:~$ id; find . -type f -ls
uid=1013(elena) gid=1013(elena) groups=1013(elena)
   668913      4 -rw-r--r--   1 elena    elena         220 Apr 23  2023 ./.bash_logout
   668914      4 -rw-r-----   1 root     elena        3554 Apr  5  2024 ./.bashrc
   668916      4 -rw-r-----   1 root     elena          31 Apr  5  2024 ./flagz.txt
   668917      4 -rw-r-----   1 root     elena         189 Apr  5  2024 ./mission.txt
   668915      4 -rwxr-xr-x   1 elena    elena         820 May 13 20:16 ./.profile
```

```bash
elena@venus:~$ cat mission.txt
################
# MISSION 0x13 #
################
The user alice has her password is in an environment variable.
```

```bash
elena@venus:~$ env | grep PASS
PASS=Cgecy2MY2MWbaqt
elena@venus:~$ echo $PASS
Cgecy2MY2MWbaqt
```

> Creds: `alice:Cgecy2MY2MWbaqt`

## Level 14

```bash
alice@venus:~$ id; find . -type f -ls
uid=1014(alice) gid=1014(alice) groups=1014(alice)
   668788      4 -rw-r--r--   1 alice    alice         220 Apr 23  2023 ./.bash_logout
   668789      4 -rw-r--r--   1 alice    alice        3524 Sep  5  2024 ./.bashrc
   668791      4 -rw-r-----   1 root     alice          31 Apr  5  2024 ./flagz.txt
   668792      4 -rw-r-----   1 root     alice         231 Apr  5  2024 ./mission.txt
   668790      4 -rw-r--r--   1 alice    alice         807 Apr 23  2023 ./.profile
```

```
alice@venus:~$ cat mission.txt
################
# MISSION 0x14 #
################
The admin has left the password of the user anna as a comment in the file passwd.
```

```bash
alice@venus:~$ grep alice /etc/passwd
alice:x:1014:1014:w8NvY27qkpdePox:/pwned/alice:/bin/bash
```

> Creds: `anna:w8NvY27qkpdePox`

## Level 15

```bash
anna@venus:~$ id; find . -type f -ls
uid=1015(anna) gid=1015(anna) groups=1015(anna)
   668808      4 -rw-r--r--   1 anna     anna          220 Apr 23  2023 ./.bash_logoutca
   668809      4 -rw-r--r--   1 anna     anna         3526 Apr 23  2023 ./.bashrc
   668811      4 -rw-r-----   1 root     anna           31 Apr  5  2024 ./flagz.txt
   668812      4 -rw-r-----   1 root     anna          152 Apr  5  2024 ./mission.txt
   668810      4 -rw-r--r--   1 anna     anna          807 Apr 23  2023 ./.profilet
```

```bash
anna@venus:~$ cat mission.txt
################
# MISSION 0x15 #
################
Maybe sudo can help you to be natalia.
```

```bash
anna@venus:~$ sudo -l
Matching Defaults entries for anna on venus:
    env_reset, mail_badpass, secure_path=/usr/local/sbin\:/usr/local/bin\:/usr/sbin\:/usr/bin\:/sbin\:/bin, use_pty

User anna may run the following commands on venus:
    (natalia) NOPASSWD: /bin/bash
anna@venus:~$ sudo -u natalia /bin/bash -p
natalia@venus:/pwned/anna$ cd
natalia@venus:~$ cat nataliapass.txt
NMuc4DkYKDsmZ5z
```

> Creds: `natalia:NMuc4DkYKDsmZ5z`

## Level 16

```bash
natalia@venus:~$ id; find . -type f -ls
uid=1016(natalia) gid=1016(natalia) groups=1016(natalia)
   669100      4 -rw-r--r--   1 natalia  natalia       220 Apr 23  2023 ./.bash_logout
   669101      4 -rw-r--r--   1 natalia  natalia      3526 Apr 23  2023 ./.bashrc
   669104      4 -rw-r-----   1 root     natalia        31 Apr  5  2024 ./flagz.txt
   669105      4 -rw-r-----   1 root     natalia       189 Apr  5  2024 ./mission.txt
   669106      4 -rw-r-----   1 root     natalia        16 Apr  5  2024 ./nataliapass.txt
   669103      4 -rw-r-----   1 root     natalia        25 Apr  5  2024 ./base64.txt
   669102      4 -rw-r--r--   1 natalia  natalia       807 Apr 23  2023 ./.profile
```

```bash
natalia@venus:~$ cat mission.txt
################
# MISSION 0x16 #
################
The password of user eva is encoded in the base64.txt file
```

```bash
natalia@venus:~$ base64 -d base64.txt
upsCA3UFu10fDAO
```

> Creds: `eva:upsCA3UFu10fDAO`

## Level 17

```bash
eva@venus:~$ id; find . -type f -ls
uid=1017(eva) gid=1017(eva) groups=1017(eva)
   668940      4 -rw-r--r--   1 eva      eva           220 Apr 23  2023 ./.bash_logout
   668941      4 -rw-r--r--   1 eva      eva          3526 Apr 23  2023 ./.bashrc
   668943      4 -rw-r-----   1 root     eva            31 Apr  5  2024 ./flagz.txt
   668944      4 -rw-r-----   1 root     eva           240 Apr  5  2024 ./mission.txt
   668942      4 -rw-r--r--   1 eva      eva           807 Apr 23  2023 ./.profile
```

```bash
eva@venus:~$ cat mission.txt
################
# MISSION 0x17 #
################
The password of the clara user is found in a file modified on May 1, 1968.
```

This feels like a trick question, because Linux uses epoch time which starts in 1970!

```bash
eva@venus:~$ find /usr -newermt "1968-05-01" ! -newermt "1980-05-02" 2>/dev/null
/usr/lib/cmdo
eva@venus:~$ stat /usr/lib/cmdo
  File: /usr/lib/cmdo
  Size: 16              Blocks: 8          IO Block: 4096   regular file
Device: 0,40    Inode: 669651      Links: 1
Access: (0644/-rw-r--r--)  Uid: (    0/    root)   Gid: (    0/    root)
Access: 1970-01-01 00:00:00.000000000 +0000
Modify: 1970-01-01 00:00:00.000000000 +0000
Change: 2024-04-05 06:29:48.679315614 +0000
 Birth: 2024-04-05 06:29:48.679315614 +0000
eva@venus:~$ cat /usr/lib/cmdo
39YziWp5gSvgQN9
```

> Creds: `clara:39YziWp5gSvgQN9`

## Level 18

```bash
clara@venus:~$ id; find . -type f -ls
uid=1018(clara) gid=1018(clara) groups=1018(clara)
   668894      4 -rw-r--r--   1 clara    clara         220 Apr 23  2023 ./.bash_logout
   668895      4 -rw-r--r--   1 clara    clara        3526 Apr 23  2023 ./.bashrc
   668897      4 -rw-r-----   1 root     clara          31 Apr  5  2024 ./flagz.txt
   668899      4 -rw-r-----   1 root     clara         244 Apr  5  2024 ./protected.zip
   668898      4 -rw-r-----   1 root     clara         247 Apr  5  2024 ./mission.txt
   668896      4 -rw-r--r--   1 clara    clara         807 Apr 23  2023 ./.profile
```

```bash
clara@venus:~$ cat mission.txt
################
# MISSION 0x18 #
################
The password of user frida is in the password-protected zip (rockyou.txt can help you)
```

```powershell
➜ scp -P 5000 clara@venus.hackmyvm.eu:protected.zip .
protected.zip                100%  244     0.5KB/s   00:00

➜ zip2john.exe .\protected.zip | tee -FilePath C:\Users\Public\hashes.txt
ver 1.0 efh 5455 efh 7875 protected.zip/pwned/clara/protected.txt PKZIP Encr: 2b chk, TS_chk, cmplen=28, decmplen=16, crc=239F7473
protected.zip/pwned/clara/protected.txt:$pkzip2$1*2*2*0*1c*10*239f7473*0*53*0*1c*239f*3383*9cfee439d840fcbd24e570e37e84cdaf04ae9c5dab3a6257087fff6b*$/pkzip2$:pwned/clara/protected.txt:protected.zip::.\protected.zip

➜ john.exe \Users\Public\hashes.txt --wordlist=\Users\Public\rockyou.txt
pass123          (protected.zip/pwned/clara/protected.txt)

➜ 7z x .\protected.zip -p'pass123'

➜ cat .\pwned\clara\protected.txt
Ed4ErEUJEaMcXli
```

> Creds: `frida:Ed4ErEUJEaMcXli`

## Level 19

```bash
frida@venus:~$ id; find . -type f -ls
uid=1019(frida) gid=1019(frida) groups=1019(frida)
   668962     72 -rw-r-----   1 root     frida       73456 Apr  5  2024 ./repeated.txt
   668957      4 -rw-r--r--   1 frida    frida         220 Apr 23  2023 ./.bash_logout
   668958      4 -rw-r--r--   1 frida    frida        3526 Apr 23  2023 ./.bashrc
   668960      4 -rw-r-----   1 root     frida          31 Apr  5  2024 ./flagz.txt
   668961      4 -rw-r-----   1 root     frida         250 Apr  5  2024 ./mission.txt
   668959      4 -rw-r--r--   1 frida    frida         807 Apr 23  2023 ./.profile
```

```bash
frida@venus:~$ cat mission.txt
################
# MISSION 0x19 #
################
The password of eliza is the only string that is repeated (unsorted) in repeated.txt.
```

```bash
frida@venus:~$ uniq -d ./repeated.txt
Fg6b6aoksceQqB9
```

> Creds: `eliza:Fg6b6aoksceQqB9`

## Level 20

```bash
eliza@venus:~$  id; find . -type f -ls
uid=1020(eliza) gid=1020(eliza) groups=1020(eliza)
   668919      4 -rw-r--r--   1 eliza    eliza         220 Apr 23  2023 ./.bash_logout
   668920      4 -rw-r--r--   1 eliza    eliza        3526 Apr 23  2023 ./.bashrc
   668923      4 -rw-r-----   1 root     eliza          31 Apr  5  2024 ./flagz.txt
   668924      4 -rw-r-----   1 root     eliza         143 Apr  5  2024 ./mission.txt
   668921      4 -rw-r-----   1 root     eliza        2602 Apr  5  2024 ./.iris_key
   668922      4 -rw-r--r--   1 eliza    eliza         807 Apr 23  2023 ./.profile
```

```bash
eliza@venus:~$ cat mission.txt
################
# MISSION 0x20 #
################
## EN ##
The user iris has left me her key.
```

```bash
eliza@venus:~$ cat .iris_key
-----BEGIN OPENSSH PRIVATE KEY-----
b3BlbnNzaC1rZXktdjEAAAAABG5vbmUAAAAEbm9uZQAAAAAAAAABAAABlwAAAAdzc2gtcn
NhAAAAAwEAAQAAAYEAstTtUVotXEIF5+w37pKse/YGLEMMMnMB2DQQ1EF/KP7ey72FhO9S
Jk4wPtBZ6+pPKefUA2uSJHGhHia++uBOcuWt3SAdR5gUqxpdFTgYqZczWEgCDoY/L0rUQG
pT97RRAQRXlWsw4J1voDFUzYc6AKe3iD9win/km0fZ1CWJkCWQmPzbOd29KR6wS2YH3S9A
D8e+y0tGGItPbH9NNMO8Q5ysZOMjheHlkdfO5k1ALlshvNp5KBIAutZ9HGn0MYGegdhPBy
Bxtq0pn8goGW2TXB7WoyPiDHhNsXh6tW+JxZ5EOpjotbCCMtA1mAOxUyUhO3Tfl+1GtuYo
KsQ7By/BR0u2y06IQTaApoT4c6KaVwkcwO87uBd7UmN+m4OdCP5MiHF6y7nHWIBSN9FFfq
Dnpn+IzwPOliT3dn3jjUcrUgxCXrdaDBgQm46YUE6F6K+4GDZKij6s0FT+RD1twi8gA8oJ
QXJZy7lMdptAAh5eTdvX/LN0DuTY5RkFWH6QACf3AAAFiP3FQub9xULmAAAAB3NzaC1yc2
EAAAGBALLU7VFaLVxCBefsN+6SrHv2BixDDDJzAdg0ENRBfyj+3su9hYTvUiZOMD7QWevq
Tynn1ANrkiRxoR4mvvrgTnLlrd0gHUeYFKsaXRU4GKmXM1hIAg6GPy9K1EBqU/e0UQEEV5
VrMOCdb6AxVM2HOgCnt4g/cIp/5JtH2dQliZAlkJj82zndvSkesEtmB90vQA/HvstLRhiL
T2x/TTTDvEOcrGTjI4Xh5ZHXzuZNQC5bIbzaeSgSALrWfRxp9DGBnoHYTwcgcbatKZ/IKB
ltk1we1qMj4gx4TbF4erVvicWeRDqY6LWwgjLQNZgDsVMlITt035ftRrbmKCrEOwcvwUdL
tstOiEE2gKaE+HOimlcJHMDvO7gXe1JjfpuDnQj+TIhxesu5x1iAUjfRRX6g56Z/iM8Dzp
Yk93Z9441HK1IMQl63WgwYEJuOmFBOheivuBg2Soo+rNBU/kQ9bcIvIAPKCUFyWcu5THab
QAIeXk3b1/yzdA7k2OUZBVh+kAAn9wAAAAMBAAEAAAGBAI8RBWLF7/AU6cCnHAAC23a4Vi
vm38UkeN9MmAIW+/ICJJ9+WWkGRQRcHQDDkozIANkXnGe4EUySk0EZ4kO2W0xULwnufT4f
jrlr9/fXzvMuAWepA+w2vinJhZCa/931JbDYlnD1Nj8b9IeFr8BVZLPNeWjIx/IlavBHRR
8RgMIPK2UZNRFQMdrJsGRBlhz/hhKZzCu7ZrKQENRN66hAx0aX+tsjU/HxzMUmj2Fzf9sW
ESGS7sZ90JOosKKgqTlJ5fr7MNuDMVm7bMpOL5AqUpdhck4G1tggTQCobI+F1nqLAuIkFK
CswF1GEbhQm4Z3F1KDFyjxckoyfeOUeefZR5Hi+D9AaGDlv1LjnvhvtXuh5Jql4zHcIcYn
/i60dsiOHtIXKBWMgI+w9C96YpcCxQ08AsB1LQEB63P8FGTtZGBGJaBwd4Zn0dZ/gnYZEI
uvBEhhzBFabjVnmqEKZeAKzqRlXxP5ugyB96cVyWQVkxv3MENOg0PaNCFqEkYvPgTcsQAA
AMBWOQgVViGjMvfREIyiwEOZZi9iljyLKWDIpJI894Ws5Puo3DQB7TlLAauR7XT2cgirCo
hepmVWaaS6YdIQJm+NE6lkR6bwCx/jyl6JjsvZHUXQZhGGe2QsjAjvfrESSHHuIQKyo+5l
vArCKlcJ/PjJoFcVbhNagpkRBbn1SnetnsIZR823N1r+wpP72+7KmG91clPUHL9lo9llrm
9YoGbCSHeIf29ScoKRIUCXBBNFwWW1qeBrjO5GgZvOSY9kgigAAADBAOz6W7txdINoaQy7
wuPyXkqxpncoGn6rXK+58hOEr/lcNr6KUmYoACGd7yf8X06D2BkFJrs78HKLNrIzo68GV7
AYE9ZCSwY0uPXp5aijEpVBGmaTgAIJ4pAWW+hXqNhVmxta1g3S8KgdCfJHWZTusEFuVt36
2BOgGCHLPvUAxi/S+01dkMyhG+fAtJv+mJqCLIVXpmUq/xV0utl+liXz/P8DYGUHykhVxo
s9O++PjFlRB1jb9TcOBlt3kEhgbDWkpQAAAMEAwS+6BKPXr9UNk28sS2A4x8aSipDLl5Hz
8QdZLsMHB4RX0C5jqeLBPUt5jD++4ya2Hks6/GNkrrdX0mAbxXrKVy1WU7hdry9xJVE1Zr
lExP9FO8pMQoWdg2nLm89IX2RKG24mgsJzw7nGa0J8vxpENPymFETY1Pa8FoYXYdf7JsMY
4mNxvGMLA8a8jAhBa7/rQg+Dy9QUJntd90i8KFd2f0hswhW1et+NfgHbhHTyHW20BmPyzj
QLA0b9+37deEtrAAAAC3Rlc3RlQGRlYjExAQIDBAUGBw==
-----END OPENSSH PRIVATE KEY-----

eliza@venus:~$ ssh iris@localhost -i .iris_key

iris@venus:~$ cat irispass.txt
kYjyoLcnBZ9EJdz
```

> Cred: `iris:kYjyoLcnBZ9EJdz`

## Level 21

```bash
iris@venus:~$  id; find . -type f -ls
uid=1021(iris) gid=1021(iris) groups=1021(iris)
   668988      4 -rw-r--r--   1 iris     iris          220 Apr 23  2023 ./.bash_logout
   668989      4 -rw-r--r--   1 iris     iris         3526 Apr 23  2023 ./.bashrc
   668992      4 -rw-r-----   1 root     iris          568 Apr  5  2024 ./.ssh/authorized_keys
   668993      4 -rw-r-----   1 root     iris         2602 Apr  5  2024 ./.ssh/id_rsa
   668995      4 -rw-r-----   1 root     iris           31 Apr  5  2024 ./flagz.txt
   668996      4 -rw-r-----   1 root     iris           16 Apr  5  2024 ./irispass.txt
   668997      4 -rw-r-----   1 root     iris          195 Apr  5  2024 ./mission.txt
   668994     20 -rw-r-----   1 root     iris        17484 Apr  5  2024 ./eloise
   668990      4 -rw-r--r--   1 iris     iris          807 Apr 23  2023 ./.profile
iris@venus:~$ cat mission.txt
################
# MISSION 0x21 #
################
User eloise has saved her password in a particular way.
```

```bash
iris@venus:~$ head -c 40 eloise ;echo
/9j/4AAQSkZJRgABAQEAYABgAAD/4RDSRXhpZgAA
iris@venus:~$ base64 -d eloise | head -c 20; echo
����JFIF``
iris@venus:~$ base64 -d eloise > /tmp/image.jpg
```

> Cred: `eloise:yOUJlV0SHOnbSPm`

## Level 22

```bash
eloise@venus:~$ id; find . -type f -ls
uid=1022(eloise) gid=1022(eloise) groups=1022(eloise)
   668930      4 -rw-r-----   1 root     eloise         50 Apr  5  2024 ./hi
   668926      4 -rw-r--r--   1 eloise   eloise        220 Apr 23  2023 ./.bash_logout
   668927      4 -rw-r--r--   1 eloise   eloise       3526 Apr 23  2023 ./.bashrc
   668929      4 -rw-r-----   1 root     eloise         31 Apr  5  2024 ./flagz.txt
   668931      4 -rw-r-----   1 root     eloise        194 Apr  5  2024 ./mission.txt
   668928      4 -rw-r--r--   1 eloise   eloise        807 Apr 23  2023 ./.profile
```

```bash
eloise@venus:~$ cat mission.txt
################
# MISSION 0x22 #
################
User lucia has been creative in saving her password.
```

```bash
eloise@venus:~$ cat hi
00000000: 7576 4d77 4644 5172 5157 504d 6547 500a
eloise@venus:~$ cat hi | xxd -r -p
uvMwFDQrQWPMeGP
```

> Creds: `lucia:uvMwFDQrQWPMeGP`

## Level 23

```bash
lucia@venus:~$ id; find . -type f -ls
uid=1023(lucia) gid=1023(lucia) groups=1023(lucia)
   669057      4 -rw-r-----   1 root     lucia        1998 Apr  5  2024 ./dict.txt
   669054      4 -rw-r--r--   1 lucia    lucia         220 Apr 23  2023 ./.bash_logout
   669055      4 -rw-r--r--   1 lucia    lucia        3526 Apr 23  2023 ./.bashrc
   669058      4 -rw-r-----   1 root     lucia          31 Apr  5  2024 ./flagz.txt
   669059      4 -rw-r-----   1 root     lucia         397 Apr  5  2024 ./mission.txt
   669056      4 -rw-r--r--   1 lucia    lucia         807 Apr 23  2023 ./.profile
```

```bash
lucia@venus:~$ cat mission.txt
################
# MISSION 0x23 #
################
The user isabel has left her password in a file in the /etc/xdg folder but she does not remember the name, however she has dict.txt that can help her to remember.
```

```bash
lucia@venus:~$ for file in $(cat dict.txt); do file=/etc/xdg/$file; if [ -f $file ]; then echo $file; cat $file; fi; done;
/etc/xdg/readme
H5ol8Z2mrRsorC0
```

> Creds: `isabel:H5ol8Z2mrRsorC0`

## Level 24

```bash
isabel@venus:~$ id; find . -type f -ls
uid=1024(isabel) gid=1024(isabel) groups=1024(isabel)
   668999      4 -rw-r--r--   1 isabel   isabel        220 Apr 23  2023 ./.bash_logout
   669000      4 -rw-r--r--   1 isabel   isabel       3526 Apr 23  2023 ./.bashrc
   669003      4 -rw-r-----   1 root     isabel         31 Apr  5  2024 ./flagz.txt
   669004      4 -rw-r-----   1 root     isabel        245 Apr  5  2024 ./mission.txt
   669002    148 -rw-r-----   1 root     isabel     150544 Apr  5  2024 ./different.txt
   669001      4 -rw-r--r--   1 isabel   isabel        807 Apr 23  2023 ./.profile
```

```bash
isabel@venus:~$ cat mission.txt
################
# MISSION 0x24 #
################
The password of the user freya is the only string that is not repeated in different.txt
```

```bash
isabel@venus:~$ uniq -u different.txt
EEDyYFDwYsmYawj
```

> Creds: `freya:EEDyYFDwYsmYawj`

## Level 25

```bash
freya@venus:~$ id; find . -type f -ls
uid=1025(freya) gid=1025(freya) groups=1025(freya)
   668951      4 -rw-r--r--   1 freya    freya         220 Apr 23  2023 ./.bash_logoutcat
   668952      4 -rw-r--r--   1 freya    freya        3526 Apr 23  2023 ./.bashrc
   668954      4 -rw-r-----   1 root     freya          31 Apr  5  2024 ./flagz.txt
   668955      4 -rw-r-----   1 root     freya         262 Apr  5  2024 ./mission.txt
   668953      4 -rw-r--r--   1 freya    freya         807 Apr 23  2023 ./.profilem
```


```bash
freya@venus:~$ cat mission.txt
################
# MISSION 0x25 #
################
User alexa puts her password in a .txt file in /free every minute and then deletes it.
```

```bash
while true; do
    if ls /free/*.txt 2>/dev/null; then
        cat /free/*.txt
        break
    fi
    sleep 1
done
```

```bash
freya@venus:~$ while true; do if ls /free/*.txt 2>/dev/null; then cat /free/*.txt; break; fi; sleep 1; done
/free/beer.txt
mxq9O3MSxxX9Q3S
```

> Creds: `alexa:mxq9O3MSxxX9Q3S`

## Level 26

```bash
alexa@venus:~$ id; find . -type f -ls
uid=1026(alexa) gid=1026(alexa) groups=1026(alexa)
   668782      4 -rw-r--r--   1 alexa    alexa         220 Apr 23  2023 ./.bash_logoutc
   668783      4 -rw-r--r--   1 alexa    alexa        3526 Apr 23  2023 ./.bashrc
   668785      4 -rw-r-----   1 root     alexa          31 Apr  5  2024 ./flagz.txt
   668786      4 -rw-r-----   1 root     alexa         172 Apr  5  2024 ./mission.txt
   668784      4 -rw-r--r--   1 alexa    alexa         807 Apr 23  2023 ./.profile
```

```bash
alexa@venus:~$ cat mission.txt
################
# MISSION 0x26 #
################
The password of the user ariel is online! (HTTP)
```

```bash
alexa@venus:~$ ss -tunlp4
-bash: /usr/bin/ss: Permission denied
alexa@venus:~$ netstat
-bash: netstat: command not found
alexa@venus:~$ curl 0 # curl localhost, since it had HTTP
33EtHoz9a0w2Yqo
```

> Creds: `ariel:33EtHoz9a0w2Yqo`

## Level 27

```bash
ariel@venus:~$ id; find . -type f -ls
uid=1027(ariel) gid=1027(ariel) groups=1027(ariel)
   668814      4 -rw-r--r--   1 ariel    ariel         220 Apr 23  2023 ./.bash_logoutat
   668815      4 -rw-r--r--   1 ariel    ariel        3526 Apr 23  2023 ./.bashrc
   668818      4 -rw-r-----   1 root     ariel          31 Apr  5  2024 ./flagz.txt
   668819      4 -rw-r-----   1 root     ariel         254 Apr  5  2024 ./mission.txt
   668816     12 -rw-r-----   1 root     ariel       12288 Apr  5  2024 ./.goas.swp
   668817      4 -rw-r--r--   1 ariel    ariel         807 Apr 23  2023 ./.profile
```

```bash
ariel@venus:~$ cat mission.txt
################
# MISSION 0x27 #
################
Seems that ariel dont save the password for lola, but there is a temporal file.
```

```bash
ariel@venus:~$ vi -r ./.goas.swpq
Using swap file "./.goas.swp"
"~teste/goas" [New DIRECTORY]
Recovery completed. You should check if everything is OK.
(You might want to write out this file under another name
and run diff with the original file to check for changes)
You may want to delete the .swp file now.

Thats my little DIc with my old and current passw0rds:
-->ppkJjqYvSCIyAhK
-->cOXlRYXtJWnVQEG
--rxhKeFKveeKqpwp
-->RGBEMbZHZRgXZnu 
-->IaOpTdAuhSjGZnu
-->NdnszvjulNellbK
-->GBUguuSpXVjpxLc
-->rSkPlPhymYcerMJ
-->PEOppdOkSqJZweH
-->EKvJoTBYlwtwFmv
-->d3LieOzRGX5wud6
-->mYhQVLDKdJrsIwG
-->DabEJLmAbOQxEnD
-->LkWReDaaLCMDlLf
-->cbjYGSvqAsqIvdg
-->QsymOOVbzSaKmRm
-->bnQgcXYamhSDSff
-->VVjqJGRrnfKmcgD

ariel@venus:~$ nano /tmp/passwords.txt
# Brute `su`
ariel@venus:~$ while read -r pass; do echo "$(date): $pass"; echo "$pass" | su - lola -c 'echo SUCCESS' 2>/dev/null && echo "Found: $pass" && break; done < /tmp/passwords.txt
Wed Jul 30 09:52:48 UTC 2025: ppkJjqYvSCIyAhK
Wed Jul 30 09:53:04 UTC 2025: cOXlRYXtJWnVQEG
Wed Jul 30 09:53:18 UTC 2025: rxhKeFKveeKqpwp
Wed Jul 30 09:53:31 UTC 2025: RGBEMbZHZRgXZnu
Wed Jul 30 09:53:45 UTC 2025: IaOpTdAuhSjGZnu
Wed Jul 30 09:54:00 UTC 2025: NdnszvjulNellbK
Wed Jul 30 09:54:14 UTC 2025: GBUguuSpXVjpxLc
Wed Jul 30 09:54:28 UTC 2025: rSkPlPhymYcerMJ
Wed Jul 30 09:54:43 UTC 2025: PEOppdOkSqJZweH
Wed Jul 30 09:54:57 UTC 2025: EKvJoTBYlwtwFmv
Wed Jul 30 09:55:12 UTC 2025: d3LieOzRGX5wud6
SUCCESS
Found: d3LieOzRGX5wud6
```

> Creds: `lola:d3LieOzRGX5wud6`

## Level 28

```bash
lola@venus:~$ id; find . -type f -ls
uid=1028(lola) gid=1028(lola) groups=1028(lola)
   669047      4 -rw-r--r--   1 lola     lola          220 Apr 23  2023 ./.bash_logout
   669048      4 -rw-r--r--   1 lola     lola         3526 Apr 23  2023 ./.bashrc
   669050      4 -rw-r-----   1 root     lola           31 Apr  5  2024 ./flagz.txt
   669051      4 -rw-r-----   1 root     lola          272 Apr  5  2024 ./mission.txt
   669052      4 -rw-r-----   1 root     lola         1438 Apr  5  2024 ./pages.txt
   669049      4 -rw-r--r--   1 lola     lola          807 Apr 23  2023 ./.profile
```

```bash
lola@venus:~$ cat mission.txt
################
# MISSION 0x28 #
################
The user celeste has left a list of names of possible .html pages where to find her password.
```

We can list files in webserver so bruteforce not really required
```bash
lola@venus:~$ ls /var/www/html
cebolla.html  index.html  index.nginx-debian.html  key.php  method.php  waiting.php
lola@venus:~$ curl 0/cebolla.html
VLSNMTKwSV2o8Tn
```

curl was very slow, so use PHP to bruteforce the filename
```php
<?php
$pages = file('pages.txt', FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
$host = '0';
$port = 80;
$connections = [];

foreach ($pages as $filename) {
    $filename = trim($filename);
    if (!$filename) continue;
    
    $fp = @stream_socket_client("$host:$port", $errno, $errstr, 1, STREAM_CLIENT_ASYNC_CONNECT);
    if (!$fp) continue;
    
    stream_set_blocking($fp, false);
    fwrite($fp, "HEAD /{$filename}.html HTTP/1.1\r\nHost: $host\r\nConnection: Close\r\n\r\n");
    $connections[(int)$fp] = ['fp' => $fp, 'url' => "/{$filename}.html", 'data' => ''];
}

while ($connections) {
    $read = array_column($connections, 'fp');
    $write = $except = null;
    
    if (stream_select($read, $write, $except, 1)) {
        foreach ($read as $fp) {
            $key = (int)$fp;
            $data = fread($fp, 1024);
            
            if (!$data) {
                fclose($fp);
                unset($connections[$key]);
                continue;
            }
            
            $connections[$key]['data'] .= $data;
            
            if (strpos($connections[$key]['data'], "\r\n\r\n") !== false) {
                if (strpos($connections[$key]['data'], 'HTTP/1.1 200') === 0) {
                    echo "http://$host{$connections[$key]['url']}\n";
                }
                fclose($fp);
                unset($connections[$key]);
            }
        }
    }
}
```

```bash
lola@venus:~$ php /tmp/b.php
http://0/cebolla.html
lola@venus:~$ curl http://0/cebolla.html
VLSNMTKwSV2o8Tn
```

> Creds: `celeste:VLSNMTKwSV2o8Tn`

## Level 29

```bash
celeste@venus:~$ id; find . -type f -ls
uid=1029(celeste) gid=1029(celeste) groups=1029(celeste)
   668888      4 -rw-r--r--   1 celeste  celeste       220 Apr 23  2023 ./.bash_logout
   668889      4 -rw-r--r--   1 celeste  celeste      3542 Jun 18 21:46 ./.bashrc
   668891      4 -rw-r-----   1 root     celeste        31 Apr  5  2024 ./flagz.txt
   668892      4 -rw-r-----   1 root     celeste       179 Apr  5  2024 ./mission.txt
   668890      4 -rw-r--r--   1 celeste  celeste       807 Apr 23  2023 ./.profile
```

```
celeste@venus:~$ cat mission.txt
################
# MISSION 0x29 #
################
The user celeste has access to mysql but for what?
```

```bash
celeste@venus:~$ mysql -u'celeste' -p'VLSNMTKwSV2o8Tn' -e 'SHOW DATABASES;'
+--------------------+
| Database           |
+--------------------+
| information_schema |
| venus              |
+--------------------+
celeste@venus:~$ mysql -u'celeste' -p'VLSNMTKwSV2o8Tn' venus -e 'SHOW TABLES;'
+-----------------+
| Tables_in_venus |
+-----------------+
| people          |
+-----------------+
celeste@venus:~$ mysql -u'celeste' -p'VLSNMTKwSV2o8Tn' venus -e 'SELECT * FROM people WHERE LENGTH(pazz)=15;'
+-----------+----------+-----------------+
| id_people | uzer     | pazz            |
+-----------+----------+-----------------+
|        16 | sfdfdsml | ixpeqdsfsdfdsfW |
|        44 | yuio     | ixpgbvcbvcbeqdW |
|        54 | crom     | ixpefdbvvcbrqdW |
|        58 | bael     | ixpesdvsdvsdqdW |
|        74 | nina     | ixpeqdWuvC5N9kG |
|        77 | dsar     | ixpeF43F3F34qdW |
|        78 | yop      | ixpeqdWCSDFDSFD |
|        79 | loco     | ixpeF43F34F3qdW |
+-----------+----------+-----------------+
```

> Creds: `nina:ixpeqdWuvC5N9kG`

## Level 30

```bash
➜ sshpass.exe -p "ixpeqdWuvC5N9kG" ssh nina@venus.hackmyvm.eu -p 5000
nina@venus:~$ id; find . -type f -ls
uid=1030(nina) gid=1030(nina) groups=1030(nina)
   669108      4 -rw-r--r--   1 nina     nina          220 Apr 23  2023 ./.bash_logout
   669109      4 -rw-r--r--   1 nina     nina         3526 Apr 23  2023 ./.bashrc
   669111      4 -rw-r-----   1 root     nina           31 Apr  5  2024 ./flagz.txt
   669112      4 -rw-r-----   1 root     nina          197 Apr  5  2024 ./mission.txt
   669110      4 -rw-r--r--   1 nina     nina          807 Apr 23  2023 ./.profile
```

```bash
nina@venus:~$ cat mission.txt
################
# MISSION 0x30 #
################
The user kira is hidding something in http://localhost/method.php
```

```bash
nina@venus:~$ curl 0/method.php            ==> I dont like this method!
nina@venus:~$ curl 0/method.php -X OPTIONS ==> I dont like this method!
nina@venus:~$ curl 0/method.php -X POST    ==> I dont like this method!
nina@venus:~$ curl 0/method.php -X PUT     ==> tPlqxSKuT4eP3yr
```

> Creds: `kira:tPlqxSKuT4eP3yr`

## Level 31

```bash
kira@venus:~$ id; find . -type f -ls
uid=1031(kira) gid=1031(kira) groups=1031(kira)
   669028      4 -rw-r--r--   1 kira     kira          220 Apr 23  2023 ./.bash_logout
   669029      4 -rw-r--r--   1 kira     kira         3526 Apr 23  2023 ./.bashrc
   669031      4 -rw-r-----   1 root     kira           31 Apr  5  2024 ./flagz.txt
   669032      4 -rw-r-----   1 root     kira          191 Apr  5  2024 ./mission.txt
   669030      4 -rw-r--r--   1 kira     kira          807 Apr 23  2023 ./.profile
```

```bash
kira@venus:~$ cat mission.txt
################
# MISSION 31 #
################
The user veronica visits a lot http://localhost/waiting.php
```

```bash
kira@venus:~$ curl 0/waiting.php
Im waiting for the user-agent PARADISE.

kira@venus:~$ curl 0/waiting.php -A PARADISE
QTOel6BodTx2cwX
```

> Creds: `veronica:QTOel6BodTx2cwX`

## Level 32

```bash
veronica@venus:~$ id; find . -type f -ls
uid=1032(veronica) gid=1032(veronica) groups=1032(veronica)
   669147      4 -rw-r--r--   1 veronica veronica      220 Apr 23  2023 ./.bash_logoutat
   669148      4 -rw-r--r--   1 veronica veronica     3559 Apr  5  2024 ./.bashrc
   669150      4 -rw-r-----   1 root     veronica       31 Apr  5  2024 ./flagz.txt
   669151      4 -rw-r-----   1 root     veronica      228 Apr  5  2024 ./mission.txt
   669149      4 -rw-r--r--   1 veronica veronica      807 Apr 23  2023 ./.profile
```

```bash
veronica@venus:~$ cat mission.txt
################
# MISSION 0x32 #
################
The user veronica uses a lot the password from lana, so she created an alias.
```

```bash
veronica@venus:~$ alias
alias lanapass='UWbc0zNEVVops1v'
alias ls='ls --color=auto'
```

> Creds: `lana:UWbc0zNEVVops1v`

## Level 33

```bash
lana@venus:~$ id; find . -type f -ls
uid=1033(lana) gid=1033(lana) groups=1033(lana)
   669034      4 -rw-r--r--   1 lana     lana          220 Apr 23  2023 ./.bash_logout
   669039     12 -rw-r-----   1 root     lana        10240 Apr  5  2024 ./zip.gz
   669035      4 -rw-r--r--   1 lana     lana         3526 Apr 23  2023 ./.bashrc
   669037      4 -rw-r-----   1 root     lana           31 Apr  5  2024 ./flagz.txt
   669038      4 -rw-r-----   1 root     lana          161 Apr  5  2024 ./mission.txt
   669036      4 -rw-r--r--   1 lana     lana          807 Apr 23  2023 ./.profile
```

```bash
lana@venus:~$ cat mission.txt
################
# MISSION 0x33 #
################
The user noa loves to compress her things.
```

```bash
lana@venus:~$ file zip.gz
zip.gz: POSIX tar archive (GNU)
lana@venus:~$ tar -xvf zip.gz -C /tmp/tmp.hL8HJ17OM5
pwned/lana/zip
lana@venus:~$ cat /tmp/tmp.hL8HJ17OM5/pwned/lana/zip
9WWOPoeJrq6ncvJ
```

> Creds: `noa:9WWOPoeJrq6ncvJ`

## Level 34

```bash
noa@venus:~$ id; find . -type f -ls
uid=1034(noa) gid=1034(noa) groups=1034(noa)
   669114      4 -rw-r--r--   1 noa      noa           220 Apr 23  2023 ./.bash_logout
   669115      4 -rw-r--r--   1 noa      noa          3526 Apr 23  2023 ./.bashrc
   669117      4 -rw-r-----   1 root     noa            31 Apr  5  2024 ./flagz.txt
   669118      4 -rw-r-----   1 root     noa           159 Apr  5  2024 ./mission.txt
   669119      4 -rw-r-----   1 root     noa          3818 Apr  5  2024 ./trash
   669116      4 -rw-r--r--   1 noa      noa           807 Apr 23  2023 ./.profile
```

```bash
noa@venus:~$ cat mission.txt
################
# MISSION 0x34 #
################
The password of maia is surrounded by trash
```

```bash
noa@venus:~$ file trash
trash: data
noa@venus:~$ strings trash -n 14
\nh1hnDPHpydEjoEN
```

> Creds: `maia:h1hnDPHpydEjoEN`

## Level 35

```bash
maia@venus:~$ id; find . -type f -ls
uid=1035(maia) gid=1035(maia) groups=1035(maia)
   669078      4 -rw-r-----   1 root     maia           16 Apr  5  2024 ./forget
   669074      4 -rw-r--r--   1 maia     maia          220 Apr 23  2023 ./.bash_logout
   669075      4 -rw-r--r--   1 maia     maia         3526 Apr 23  2023 ./.bashrc
   669077      4 -rw-r-----   1 root     maia           31 Apr  5  2024 ./flagz.txt
   669079      4 -rw-r-----   1 root     maia          317 Apr  5  2024 ./mission.txt
   669076      4 -rw-r--r--   1 maia     maia          807 Apr 23  2023 ./.profile
```

```bash
maia@venus:~$ cat mission.txt
################
# MISSION 0x35 #
################
The user gloria has forgotten the last 2 characters of her password ... They only remember that they were 2 lowercase letters.
```

```bash
maia@venus:~$ cat forget
v7xUVE2e5bjUc??
maia@venus:~$ for a in {a..z}; do for b in {a..z}; do echo "v7xUVE2e5bjUc$a$b"; done; done > /tmp/passwords2.txt
maia@venus:~$ nano /tmp/b.sh
#!/bin/bash

username="$1"
password_file="$2"

if [[ -z "$username" || -z "$password_file" ]]; then
    echo "Usage: $0 <username> <password_file>"
    exit 1
fi

echo "Testing passwords for user $username..."

while read -r password; do
    echo "Trying: $password"
    
    if echo "$password" | su -c 'echo Success' "$username" 2>/dev/null; then
        echo -e "\e[32m[+] Success: $password\e[0m"
        break
    else
        echo -e "\e[31m[-] Failed: $password\e[0m"
    fi
    
done < "$password_file"
# ---------------
# Or just 1 liner
maia@venus:~$ while read -r p; do echo "$p" | su -c 'echo Success' gloria 2>/dev/null && echo -e "\e[32m[+] Success: $p\e[0m" && break || echo -e "\e[31m[-] Failed: $p\e[0m"; done < /tmp/passwords2.txt
...
[-] Failed: v7xUVE2e5bjUcxu
[-] Failed: v7xUVE2e5bjUcxv
Success
[+] Success: v7xUVE2e5bjUcxw
```

> Creds: `gloria:v7xUVE2e5bjUcxw`

## Level 36

```bash
gloria@venus:~$ id; find . -type f -ls
uid=1036(gloria) gid=1036(gloria) groups=1036(gloria)
   668968      4 -rw-r-----   1 root     gloria       1713 Apr  5  2024 ./image
   668964      4 -rw-r--r--   1 gloria   gloria        220 Apr 23  2023 ./.bash_logout
   668965      4 -rw-r--r--   1 gloria   gloria       3526 Apr 23  2023 ./.bashrc
   668967      4 -rw-r-----   1 root     gloria         31 Apr  5  2024 ./flagz.txt
   668969      4 -rw-r-----   1 root     gloria        222 Apr  5  2024 ./mission.txt
   668966      4 -rw-r--r--   1 gloria   gloria        807 Apr 23  2023 ./.profile
```
   
```bash
gloria@venus:~$ cat mission.txt
################
# MISSION 0x36 #
################
User alora likes drawings, that's why she saved her password as ...
```

```bash
gloria@venus:~$ file image
image: ASCII text
gloria@venus:~$ cat image

##########################################################
##########################################################
##########################################################
##########################################################
########              ##########  ##              ########
########  ##########  ##    ##  ####  ##########  ########
########  ##      ##  ##  ##  ######  ##      ##  ########
########  ##      ##  ####  ########  ##      ##  ########
########  ##      ##  ##        ####  ##      ##  ########
########  ##########  ##        ####  ##########  ########
########              ##  ##  ##  ##              ########
########################  ####  ##########################
########    ##  ####    ####  ##  ##      ##    ##########
############    ######  ##    ##      ##          ########
########    ##    ##  ##  ##            ####  ##  ########
##############      ##  ##    ######  ##    ####  ########
############    ##      ##  ########    ##  ##  ##########
########################    ####    ##  ##  ####  ########
########              ##    ####            ##  ##########
########  ##########  ######  ##########  ####  ##########
########  ##      ##  ####  ##      ######        ########
########  ##      ##  ##    ##  ######  ##  ####  ########
########  ##      ##  ####          ##    ##  ##  ########
########  ##########  ##      ####  ##  ##################
########              ##  ##                    ##########
##########################################################
##########################################################
##########################################################
##########################################################
```

Convert ASCII to PNG  and decode it with smth like [https://qrcode-decoder.com](https://qrcode-decoder.com)
```python
from PIL import Image

with open('image') as f:
    ascii_art = f.read().split('\n')

width, height = len(ascii_art[0]), len(ascii_art)
white, black = (255, 255, 255), (0, 0, 0)
cell_width, cell_height = height, height * 2

img = Image.new("RGB", (width * cell_width, height * cell_height), "white")
pixels = img.load()

for y, line in enumerate(ascii_art):
    for x, char in enumerate(line):
        color = white if char == '#' else black
        for i in range(cell_width):
            for j in range(cell_height):
                pixels[x * cell_width + i, y * cell_height + j] = color

# img.save('output.png')
img.show()
```

> Creds: `alora:mhrTFCoxGoqUxtw`

## Level 37

```bash
alora@venus:~$ id; find . -type f -ls
uid=1037(alora) gid=1037(alora) groups=1037(alora)
   668794      4 -rw-r--r--   1 alora    alora         220 Apr 23  2023 ./.bash_logout
   668795      4 -rw-r--r--   1 alora    alora        3526 Apr 23  2023 ./.bashrc
   668799    352 -rw-r-----   1 root     alora      360448 Apr  5  2024 ./music.iso
   668797      4 -rw-r-----   1 root     alora          31 Apr  5  2024 ./flagz.txt
   668798      4 -rw-r-----   1 root     alora         176 Apr  5  2024 ./mission.txt
   668796      4 -rw-r--r--   1 alora    alora         807 Apr 23  2023 ./.profile
```

```bash
alora@venus:~$ cat mission.txt
################
# MISSION 0x37 #
################
The user julie has created an iso with her password.
```

```bash
alora@venus:~$ file music.iso
music.iso: ISO 9660 CD-ROM filesystem data 'CDROM'
```

The proper way would be to mount iso on `/mnt` and then read files, but without sudo that's not possible. Either you have to export file or "cheat" with strings.
```bash
alora@venus:~$ strings music.iso | grep -E '^.{15}$' --color=auto
sjDf4i2MSNgSvOv
```

> Creds: `julie:sjDf4i2MSNgSvOv`

## Level 38

```bash
julie@venus:~$ id; find . -type f -ls
uid=1038(julie) gid=1038(julie) groups=1038(julie)
   669017      8 -rw-r-----   1 root     julie        4802 Apr  5  2024 ./2.txt
   669013      4 -rw-r--r--   1 julie    julie         220 Apr 23  2023 ./.bash_logout
   669014      4 -rw-r--r--   1 julie    julie        3526 Apr 23  2023 ./.bashrc
   669018      4 -rw-r-----   1 root     julie          31 Apr  5  2024 ./flagz.txt
   669019      4 -rw-r-----   1 root     julie         192 Apr  5  2024 ./mission.txt
   669016      8 -rw-r-----   1 root     julie        4802 Apr  5  2024 ./1.txt
   669015      4 -rw-r--r--   1 julie    julie         807 Apr 23  2023 ./.profile
```

```bash
julie@venus:~$ cat mission.txt
################
# MISSION 0x38 #
################
The user irene believes that the beauty is in the difference.
```

```bash
julie@venus:~$ paste 1.txt 2.txt | head

UHsjpyRBpRZVRMW UHsjpyRBpRZVRMW
pEYslxXPFLsOAZC pEYslxXPFLsOAZC
cyeezcUuoJcFowM cyeezcUuoJcFowM
oFcvWVwuDOdEHkv oFcvWVwuDOdEHkv
yhejxcHgDAofhQm yhejxcHgDAofhQm
nzwQHHcZeLZIjNG nzwQHHcZeLZIjNG
VkezyrKeLKkHfUn VkezyrKeLKkHfUn
HkfXGPxaygEMAbE HkfXGPxaygEMAbE
TgOYToetkaDkUvt TgOYToetkaDkUvt
julie@venus:~$ diff 1.txt 2.txt
174c174
< 8VeRLEFkBpe2DSD
---
> aNHRdohjOiNizlU
```

> Creds; `irene:8VeRLEFkBpe2DSD`

## Level 39

```bash
irene@venus:~$ id; find . -type f -ls
uid=1039(irene) gid=1039(irene) groups=1039(irene)
   668986      4 -rw-r-----   1 root     irene         256 Apr  5  2024 ./pass.enc
   668983      4 -rw-r-----   1 root     irene        1704 Apr  5  2024 ./id_rsa.pem
   668979      4 -rw-r--r--   1 irene    irene         220 Apr 23  2023 ./.bash_logout
   668980      4 -rw-r--r--   1 irene    irene        3526 Apr 23  2023 ./.bashrc
   668984      4 -rw-r-----   1 root     irene         451 Apr  5  2024 ./id_rsa.pub
   668982      4 -rw-r-----   1 root     irene          31 Apr  5  2024 ./flagz.txt
   668985      4 -rw-r-----   1 root     irene         178 Apr  5  2024 ./mission.txt
   668981      4 -rw-r--r--   1 irene    irene         807 Apr 23  2023 ./.profile
```

```bash
irene@venus:~$ cat mission.txt
################
# MISSION 0x39 #
################
The user adela has lent her password to irene.
```

We have encrypted file, along with public and private keys so let's use them to decrypt the file.
```bash
irene@venus:~$ openssl pkeyutl -decrypt -inkey id_rsa.pem -in pass.enc
nbhlQyKuaXGojHx
```

## Level 40

```bash
adela@venus:~$ id; find . -type f -ls
uid=1040(adela) gid=1040(adela) groups=1040(adela)
   668775      4 -rw-r--r--   1 adela    adela         220 Apr 23  2023 ./.bash_logout
   668776      4 -rw-r--r--   1 adela    adela        3526 Apr 23  2023 ./.bashrc
   668778      4 -rw-r-----   1 root     adela          31 Apr  5  2024 ./flagz.txt
   668779      4 -rw-r-----   1 root     adela         213 Apr  5  2024 ./mission.txt
   668780      4 -rw-r-----   1 root     adela          44 Apr  5  2024 ./wtf
   668777      4 -rw-r--r--   1 adela    adela         807 Apr 23  2023 ./.profile
```

```bash
adela@venus:~$ cat mission.txt
################
# MISSION 0x40 #
################
User sky has saved her password to something that can be listened to.
```

```bash
adela@venus:~$ file wtf
wtf: ASCII text
adela@venus:~$ cat wtf
.--. .- .--. .- .--. .- .-. .- -.. .. ... .
```

[CyberChef Morse Code to Lowercase](https://gchq.github.io/CyberChef/#recipe=From_Morse_Code('Space','Line%20feed')To_Lower_case()&input=Li0tLiAuLSAuLS0uIC4tIC4tLS4gLi0gLi0uIC4tIC0uLiAuLiAuLi4gLg)

```bash
adela@venus:~$ echo "PAPAPARADISE" | su -c 'echo Success' "sky" 2>/dev/null
adela@venus:~$ echo "papaparadise" | su -c 'echo Success' "sky" 2>/dev/null
Success
```

> Creds: `sky:papaparadise`

## Level 41

```bash
sky@venus:~$ id; find . -type f -ls
uid=1041(sky) gid=1041(sky) groups=1041(sky)
   669134      4 -rw-r-----   1 root     sky            31 Apr  5  2024 ./.bash_history
   669135      4 -rw-r--r--   1 sky      sky           220 Apr 23  2023 ./.bash_logout
   669136      4 -rw-r--r--   1 sky      sky          3526 Apr 23  2023 ./.bashrc
   669138      4 -rw-r-----   1 root     sky            31 Apr  5  2024 ./flagz.txt
   669139      4 -rw-r-----   1 root     sky           184 Apr  5  2024 ./mission.txt
   669137      4 -rw-r--r--   1 sky      sky           807 Apr 23  2023 ./.profile
```

```bash
sky@venus:~$ cat mission.txt
################
# MISSION 0x41 #
################
User sarah uses header in http://localhost/key.php
```

```bash
sky@venus:~$ curl 0/key.php
Key header is true?

sky@venus:~$ curl 0/key.php -H 'Key: true';echo
LWOHeRgmIxg7fuS
```

> Creds: `sarah:LWOHeRgmIxg7fuS`

## Level 42

```bash
sarah@venus:~$ id; find . -type f -ls
uid=1042(sarah) gid=1042(sarah) groups=1042(sarah)
   669128      4 -rw-r--r--   1 sarah    sarah         220 Apr 23  2023 ./.bash_logout
   669129      4 -rw-r--r--   1 sarah    sarah        3526 Apr 23  2023 ./.bashrc
   669131      4 -rw-r-----   1 root     sarah          31 Apr  5  2024 ./flagz.txt
   669132      4 -rw-r-----   1 root     sarah         175 Apr  5  2024 ./mission.txt
   669127      4 -rw-r-----   1 root     sarah          16 Apr  5  2024 ./...
   669130      4 -rw-r--r--   1 sarah    sarah         807 Apr 23  2023 ./.profile
```

```bash
sarah@venus:~$ cat mission.txt ke
################
# MISSION 0x42 #
################
The password of mercy is hidden in this directory.
```

```bash
sarah@venus:~$ cat ./...
ym5yyXZ163uIS8L
```

> Creds: `mercy:ym5yyXZ163uIS8L`

## Level 43

```bash
mercy@venus:~$ id; find . -type f -ls
uid=1043(mercy) gid=1043(mercy) groups=1043(mercy)
   669087      4 -rw-r-----   1 root     mercy         133 Apr  5  2024 ./.bash_history
   669088      4 -rw-r--r--   1 mercy    mercy         220 Apr 23  2023 ./.bash_logout
   669089      4 -rw-r--r--   1 mercy    mercy        3526 Apr 23  2023 ./.bashrc
   669091      4 -rw-r-----   1 root     mercy          31 Apr  5  2024 ./flagz.txt
   669092      4 -rw-r-----   1 root     mercy         190 Apr  5  2024 ./mission.txt
   669090      4 -rw-r--r--   1 mercy    mercy         807 Apr 23  2023 ./.profile
```

```bash
mercy@venus:~$ cat mission.txt  
################
# MISSION 0x43 #
################
User mercy is always wrong with the password of paula.
```

```bash
mercy@venus:~$ cat .bash_history
ls -A
ls
rm /
ps
sudo -l
watch tv
vi /etc/logs
su paula
dlHZ6cvX6cLuL8p
history
history -c
logout
ssh paula@localhost
```

> Creds: `paula:dlHZ6cvX6cLuL8p`

## Level  44

```bash
paula@venus:~$ id; find . -type f -ls
uid=1044(paula) gid=1044(paula) groups=1044(paula),1053(hidden)
   669121      4 -rw-r--r--   1 paula    paula         220 Apr 23  2023 ./.bash_logout
   669122      4 -rw-r--r--   1 paula    paula        3526 Apr 23  2023 ./.bashrc
   669124      4 -rw-r-----   1 root     paula          31 Apr  5  2024 ./flagz.txt
   669125      4 -rw-r-----   1 root     paula         197 Apr  5  2024 ./mission.txt
   669123      4 -rw-r--r--   1 paula    paula         807 Apr 23  2023 ./.profile
```

```bash
paula@venus:~$ cat mission.txt
################
# MISSION 0x44 #
################
The user karla trusts me, she is part of my group of friends.
```

Find files owned by `hidden` and exclude `/proc, /sys, /lib`
```bash
paula@venus:~$ find / \( -path /proc -o -path /sys -o -path /lib \) -prune -o -group hidden -print 2>/dev/null
/usr/src/.karl-a
paula@venus:~$ cat /usr/src/.karl-a
gYAmvWY3I7yDKRf
```

> Creds: `karla:gYAmvWY3I7yDKRf`

## Level 45

```bash
karla@venus:~$ id; find . -type f -ls
uid=1045(karla) gid=1045(karla) groups=1045(karla)
   669021      4 -rw-r--r--   1 karla    karla         220 Apr 23  2023 ./.bash_logout
   669022      4 -rw-r--r--   1 karla    karla        3526 Apr 23  2023 ./.bashrc
   669024      4 -rw-r-----   1 root     karla          31 Apr  5  2024 ./flagz.txt
   669025      4 -rw-r-----   1 root     karla         176 Apr  5  2024 ./mission.txt
   669026     36 -rw-r-----   1 root     karla       32946 Apr  5  2024 ./yuju.jpg
   669023      4 -rw-r--r--   1 karla    karla         807 Apr 23  2023 ./.profile
```

```bash
karla@venus:~$ cat mission.txt
################
# MISSION 0x45 #
################
User denise has saved her password in the image.
```

I thought the password was image itself, however it's not. It's actually embedded in Metadata. You can use `exifool` to dump Exiftool (since I copied file on Windows I used exe, but same can be done on machine).
```bash
karla@venus:~$ file yuju.jpg
yuju.jpg: JPEG image data, JFIF standard 1.01, resolution (DPI), density 96x96, segment length 16, Exif Standard: [TIFF image data, big-endian, direntries=4], baseline, precision 8, 442x463, components 3

➜ sshpass -p 'gYAmvWY3I7yDKRf' scp -P 5000 karla@venus.hackmyvm.eu:yuju.jpg .
yuju.jpg                   100%   32KB  80.4KB/s   00:00

➜ exiftool.exe .\yuju.jpg
...
About                           : pFg92DpGucMWccA
...

karla@venus:~$ exiftool yuju.jpg
...
About                           : pFg92DpGucMWccA
...
```

> Creds: `denise:pFg92DpGucMWccA`

## Level 46

```bash
denise@venus:~$ id; find . -type f -ls
uid=1046(denise) gid=1046(denise) groups=1046(denise)
   668901      4 -rw-r--r--   1 denise   denise        220 Apr 23  2023 ./.bash_logout
   668902      4 -rw-r--r--   1 denise   denise       3526 Apr 23  2023 ./.bashrc
   668904      4 -rw-r-----   1 root     denise         31 Apr  5  2024 ./flagz.txt
   668905      4 -rw-r-----   1 root     denise        144 Apr  5  2024 ./mission.txt
   668903      4 -rw-r--r--   1 denise   denise        807 Apr 23  2023 ./.profile
```

```bash
denise@venus:~$ cat mission.txt
################
# MISSION 0x46 #
################
The user zora is screaming doas!
```

```bash
denise@venus:~$ cat /etc/doas.conf
permit denise as zora

denise@venus:~$ doas -u zora bash
doas (denise@venus) password: pFg92DpGucMWccA
zora@venus:/pwned/denise$ cd
zora@venus:~$ pwd
/pwned/zora
zora@venus:~$ ls
flagz.txt  mission.txt  zora_pass.txt
zora@venus:~$ cat zora_pass.txt
BWm1R3jCcb53riO
```

> Creds: `zora:BWm1R3jCcb53riO`

## Level 47

```bash
zora@venus:~$ id; find . -type f -ls
uid=1047(zora) gid=1047(zora) groups=1047(zora)
   669175      4 -rw-r--r--   1 zora     zora          220 Apr 23  2023 ./.bash_logout
   669176      4 -rw-r--r--   1 zora     zora         3526 Apr 23  2023 ./.bashrc
   669178      4 -rw-r-----   1 root     zora           31 Apr  5  2024 ./flagz.txt
   669179      4 -rw-r-----   1 root     zora          173 Apr  5  2024 ./mission.txt
   669180      4 -rw-r-----   1 root     zora           16 Apr  5  2024 ./zora_pass.txt
   669177      4 -rw-r--r--   1 zora     zora          807 Apr 23  2023 ./.profile
```

```bash
zora@venus:~$ cat mission.txt
################
# MISSION 0x47 #
################
The user belen has left her password in venus.hmv
```

```bash
# No readable file called venus.hmv
zora@venus:~$ find / -name venus.hmv -print 2>/dev/null
# It turned out to be a host
zora@venus:~$ getent hosts venus.hmv
172.66.0.10     venus.hmv
zora@venus:~$ curl venus.hmv
2jA0E8bQ4WrGwWZ
```

> Creds: `belen:2jA0E8bQ4WrGwWZ`

## Level 48

```bash
belen@venus:~$ id; find . -type f -ls
uid=1048(belen) gid=1048(belen) groups=1048(belen)
   668832      4 -rw-r-----   1 root     belen          32 Apr  5  2024 ./stolen.txt
   668827      4 -rw-r--r--   1 belen    belen         220 Apr 23  2023 ./.bash_logout
   668828      4 -rw-r--r--   1 belen    belen        3526 Apr 23  2023 ./.bashrc
   668830      4 -rw-r-----   1 root     belen          31 Apr  5  2024 ./flagz.txt
   668831      4 -rw-r-----   1 root     belen         197 Apr  5  2024 ./mission.txt
   668829      4 -rw-r--r--   1 belen    belen         807 Apr 23  2023 ./.profile
```

```bash
belen@venus:~$ cat mission.txt
################
# MISSION 0x48 #
################
It seems that belen has stolen the password of the user leona...
```

```bash
belen@venus:~$ cat stolen.txt
$1$leona$lhWp56YnWAMz6z32Bw53L0

➜ john.exe \Users\Public\hashes.txt --wordlist=\Users\Public\rockyou.txt
freedom          (?)
```

> Creds: `leona:freedom`

## Level 49

```bash
leona@venus:~$ id; find . -type f -ls
uid=1049(leona) gid=1049(leona) groups=1049(leona)
   669041      4 -rw-r--r--   1 leona    leona         220 Apr 23  2023 ./.bash_logout
   669042      4 -rw-r--r--   1 leona    leona        3526 Apr 23  2023 ./.bashrc
   669044      4 -rw-r-----   1 root     leona          31 Apr  5  2024 ./flagz.txt
   669045      4 -rw-r-----   1 root     leona         195 Apr  5  2024 ./mission.txt
   669043      4 -rw-r--r--   1 leona    leona         807 Apr 23  2023 ./.profile
```

```bash
leona@venus:~$ cat mission.txt
################
# MISSION 0x49 #
################
User ava plays a lot with the DNS of venus.hmv lately...
```

```bash
# DNS doesn't seem to show anything
leona@venus:~$ dig +short ANY venus.hmv

# Nothing in local DNS
leona@venus:~$ cat /etc/hosts
127.0.0.1       localhost
::1     localhost ip6-localhost ip6-loopback
fe00::0 ip6-localnet
ff00::0 ip6-mcastprefix
ff02::1 ip6-allnodes
ff02::2 ip6-allrouters
172.66.0.10     venus
leona@venus:~$ cat /etc/resolv.conf | grep -vE '# |^$'
nameserver 127.0.0.11
search .
options edns0 trust-ad ndots:0

# Enumerate the local DNS service configuration
leona@venus:~$ ls /etc/bind
bind.keys  db.255    db.venus.hmv              named.conf.local    zones.rfc1918
db.0       db.empty  named.conf                named.conf.options
db.127     db.local  named.conf.default-zones  rndc.key
leona@venus:~$ cat /etc/bind/named.conf
// This is the primary configuration file for the BIND DNS server named.
...
include "/etc/bind/named.conf.options";
include "/etc/bind/named.conf.local";
include "/etc/bind/named.conf.default-zones";
leona@venus:~$ cat /etc/bind/db.venus.hmv
...
;@      IN      NS      localhost.
;@      IN      A       127.0.0.1
;@      IN      AAAA    ::1
@       IN      NS      ns1.venus.hmv.

;IP address of Name Server

ns1     IN      A       127.0.0.1
ava IN      TXT     oCXBeeEeYFX34NU
```

> Creds: `ava:oCXBeeEeYFX34NU`

## Level 50

```bash
ava@venus:~$ id; find . -type f -ls
uid=1050(ava) gid=1050(ava) groups=1050(ava)
   668821      4 -rw-r--r--   1 ava      ava           220 Apr 23  2023 ./.bash_logout
   668822      4 -rw-r--r--   1 ava      ava          3526 Apr 23  2023 ./.bashrc
   668824      4 -rw-r-----   1 root     ava            31 Apr  5  2024 ./flagz.txt
   668825      4 -rw-r-----   1 root     ava           153 Apr  5  2024 ./mission.txt
   668823      4 -rw-r--r--   1 ava      ava           807 Apr 23  2023 ./.profile
```

```bash
ava@venus:~$ cat mission.txt
################
# MISSION 0x50 #
################
The password of maria is somewhere...
```

Global search for readable files (by us too) which is owned by Maria comes up empty.
```bash
ava@venus:~$ find / -user maria -readable 2>/dev/null
```

It could be password reuse as many files were actually passwords, so I tried bruteforcing other user's password for Maria but no luck.
```bash
ava@venus:~$ while read -r p; do echo "$p" | su -c 'echo Success' maria 2>/dev/null && echo -e "\e[32m
[+] Success: $p\e[0m" && break || echo -e "\e[31m[-] Failed: $p\e[0m"; done < /tmp/allpasswords.txt
```

There were few instances that required decoding the password, one such was Morse Code.... and it works as a password. Not decoded, but raw Morse Code...
```bash
ava@venus:~$ echo '.--. .- .--. .- .--. .- .-. .- -.. .. ... .' | su -c 'echo Success' maria 2>/dev/nu
ll
Success
```

> Flag: `maria:.--. .- .--. .- .--. .- .-. .- -.. .. ... .`

## Level 51

Totally not BS to get in \\o/
```bash
maria@venus:~$ id; find . -type f -ls
uid=1051(maria) gid=1051(maria) groups=1051(maria)
   669081      4 -rw-r--r--   1 maria    maria         220 Apr 23  2023 ./.bash_logout
   669082      4 -rw-r--r--   1 maria    maria        3526 Apr 23  2023 ./.bashrc
   669084      4 -rw-r-----   1 root     maria          31 Apr  5  2024 ./flagz.txt
   669085      4 -rw-r-----   1 root     maria          96 Apr  5  2024 ./mission.txt
   669083      4 -rw-r--r--   1 maria    maria         807 Apr 23  2023 ./.profile
```

```bash
maria@venus:~$ cat mission.txt
################
# MISSION 0x51 #
################
Congrats!
```

## Hidden Flags

### 0xK

Flag hidden in MySQL
```bash
celeste@venus:~$ mysql -u'celeste' -p'VLSNMTKwSV2o8Tn' venus -e 'SELECT * FROM people WHERE LENGTH(pazz)=30;'
+-----------+------+--------------------------------+
| id_people | uzer | pazz                           |
+-----------+------+--------------------------------+
|        35 | haha | 8===xKmPDsJSKpHLzkqKXyjx===D~~ |
+-----------+------+--------------------------------+
```

### 0xH

```bash
# Find any file that $USER has access to
# Exclude /proc, /sys, /lib (takes too long)
hacker@venus:~$ find / \( -path /proc -o -path /sys -o -path /lib \) -prune -o \( -user $USER -o -group $USER \) -ls 2>/dev/null
        9      0 crw--w----   1 hacker   tty      136,   6 Jul 30 13:29 /dev/pts/6
        8      0 crw--w----   1 hacker   tty      136,   5 Jul 30 13:29 /dev/pts/5
   659027     12 -rw-------   1 hacker   hacker      12288 Jun 28 18:13 /var/tmp/hi.txt.swo
   658222     12 -rw-------   1 hacker   hacker      12288 Oct  8  2024 /var/tmp/.myhiddenpazz.swp
   658243     12 -rw-------   1 hacker   hacker      12288 Oct 12  2024 /var/tmp/readme.txt.swp
   659042 136644 -rw-r--r--   1 hacker   hacker   139921497 Jul  7 19:52 /var/tmp/mat
   658801      4 -rwxr-xr-x   1 hacker   hacker        2758 Mar 30 17:46 /var/tmp/prueba_1.sh
   658955    168 -rwxr-xr-x   1 hacker   hacker      169360 May 21 10:40 /var/tmp/exploit
   658792     12 -rw-------   1 hacker   hacker       12288 Mar 26 07:27 /var/tmp/mission.txt.swp
   668970      8 drwxr-x---   1 root     hacker        4096 Apr  5  2024 /pwned/hacker
   668972      4 -rw-r--r--   1 hacker   hacker         220 Apr 23  2023 /pwned/hacker/.bash_logout
   668973      4 -rwxr-xr-x   1 hacker   hacker        3653 Jul 24 00:48 /pwned/hacker/.bashrc
   668974      4 -rw-r-----   1 root     hacker          16 Apr  5  2024 /pwned/hacker/.myhiddenpazz
   668977      4 -rw-r-----   1 root     hacker        2542 Apr  5  2024 /pwned/hacker/readme.txt
   668976      4 -rw-r-----   1 root     hacker         287 Apr  5  2024 /pwned/hacker/mission.txt
   668971      4 -rw-r-----   1 root     hacker          31 Apr  5  2024 /pwned/hacker/...
   668975      0 -rw-r--r--   1 hacker   hacker           0 Jun 20 00:35 /pwned/hacker/.profile
hacker@venus:~$ cat /pwned/hacker/...
8===skQEDuHXLkIUVlPqZqyE===D~~
```

### Other Flags

You probably could use the same technique (`find`), but auth is so slow it will take ages to do so, skipping~ :|

