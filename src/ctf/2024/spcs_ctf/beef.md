# BEEF

## Description 

Waiter, I ordered BEEF and this is ~̡͆Q͍̓̆͟q̨̖͖̎̽̃͜͝x͍̕n̨̞̼̻̯̾͋̈́̏̓

Find flag.

[BEEF](https://ctf-spcs.mf.grsu.by/files/1bb6f8a0c2580dfa393fbd0ff91c5149/BEEF?token=eyJ1c2VyX2lkIjo2NzksInRlYW1faWQiOjM3NCwiZmlsZV9pZCI6MTQ2fQ.ZaUtOQ.VpFurJqgA0kXOCvagvno4ahvf7o)

## Solution

Using [ghidra_auto](https://gist.github.com/xHacka/10c22906e0819a8ba3f6e44d7bab2f71) I opened the project to view the pseudo source code:

::: raw
```c
/* WARNING: Function: __i686.get_pc_thunk.bx replaced with injection: get_pc_thunk_bx */

int main(void) {
  int cmp_result;
  undefined4 enc;
  undefined4 enc2;
  undefined2 enc3;
  undefined local_2d;
  char input [16];
  char input2 [4];
  int enc_char;
  uint i;
  undefined *stack;
  
  stack = &stack0x00000004;
  puts("Input:");
  gets(input);
  cmp_result = strncmp(input2,"BEEF",4);
  if (cmp_result == 0) {
    enc = 0x66303361;
    enc2 = 0x62637165;
    enc3 = 0x783a;
    local_2d = 0xf5;
    enc_char = 0;
    for (i = 0; i < 11; i = i + 1) {
      enc_char = (*(byte *)((int)&enc + i) ^ i) + 1;
      *(char *)((int)&enc + i) = (char)enc_char;
    }
    printf("Good BEEF! grodno{%s}\n",&enc);
  }
  else {
    printf("Try again, %s not BEEF\n",input2);
  }
  return 0;
}
```
:::
::: info :information_source:
Variables have been renamed. Use `L` to rename.
:::

There's 2 ways of solving the challenge:
1. Buffer Overflow
2. XOR Yourself

### Buffer Overflow

```c
  ...
  char input [16];
  char input2 [4];
  ...
  puts("Input:");
  gets(input);
  cmp_result = strncmp(input2,"BEEF",4);
  if (cmp_result == 0) {
  ...
```

First `gets` is used, which is a dangerous function prone to buffer overflows and second `input2` gets checked that its equal to BEEF, thats impossible due to it never being set.<br>
Using `gets` we can overflow into the `input2` array and overwrite whatever is there.

```bash
└─$ ./BEEF
Input:
AAAABBBBCCCCDDDDBEEF
Good BEEF! grodno{b33fbuff3r}
```

#### XOR:
::: raw
```py
from itertools import chain

enc_chunks = [ '66303361', '62637165', '783a' ]
enc = bytes(
    chain(
        *(  # <- Asterisk
            # Hex -> Bytes -> Reverse Byte Order -> Join As One Byte String
            reversed(bytes.fromhex(enc_chunk)) 
            for enc_chunk in enc_chunks
        )
    )
)
mid = ''.join( # XOR
    chr((byte ^ i) + 1)
    for i, byte in enumerate(enc)
)
flag = 'grodno{%s}' % mid
print(flag)
```
:::
::: tip Flag
`grodno{b33fbuff3r}`
:::