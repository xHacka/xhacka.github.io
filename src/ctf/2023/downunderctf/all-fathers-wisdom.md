# All Father's Wisdom

# All Father's Wisdom

### Description

We found this binary in the backroom, its been marked as "The All Fathers Wisdom" - See hex for further details. Not sure if its just old and hex should be text, or they mean the literal hex.

Anyway can you get this 'wisdom' out of the binary for us?

Author: pix

Download: [the-all-fathers-wisdom](https://play.duc.tf/files/e77f79222d27103c0b510e2922ce8a27/the-all-fathers-wisdom?token=eyJ1c2VyX2lkIjoyNDI4LCJ0ZWFtX2lkIjoxMjc1LCJmaWxlX2lkIjo5OH0.ZPRXvQ.a1-qVwKr9D6M4j6KLj9Oz0zOB2M)

### Solution

In Ghidra we see `print_flag`function and buffer of characters:

```c
  local_8 = 0x75;
  local_10 = 0x26;
  local_18 = 0x31;
  local_20 = 0x22;
  local_28 = 0x25;
  local_30 = 0x31;
  local_38 = 0x77;
  local_40 = 0x24;
  local_48 = 0x31;
  local_50 = 0x25;
  local_58 = 0x26;
  local_60 = 0x31;
  local_68 = 0x21;
  local_70 = 0x22;
  local_78 = 0x31;
  local_80 = 0x74;
  local_88 = 0x25;
  local_90 = 0x31;
  local_98 = 0x75;
  local_a0 = 0x23;
  local_a8 = 0x31;
  local_b0 = 0x22;
  local_b8 = 0x24;
  local_c0 = 0x31;
  local_c8 = 0x20;
  local_d0 = 0x22;
  local_d8 = 0x31;
  local_e0 = 0x77;
  local_e8 = 0x24;
  local_f0 = 0x31;
  local_f8 = 0x74;
  local_100 = 0x27;
  local_108 = 0x31;
  local_110 = 0x20;
  local_118 = 0x22;
  local_120 = 0x31;
  local_128 = 0x25;
  local_130 = 0x27;
  local_138 = 0x31;
  local_140 = 0x77;
  local_148 = 0x25;
  local_150 = 0x31;
  local_158 = 0x73;
  local_160 = 0x26;
  local_168 = 0x31;
  local_170 = 0x27;
  local_178 = 0x25;
  local_180 = 0x31;
  local_188 = 0x25;
  local_190 = 0x24;
  local_198 = 0x31;
  local_1a0 = 0x22;
  local_1a8 = 0x25;
  local_1b0 = 0x31;
  local_1b8 = 0x24;
  local_1c0 = 0x24;
  local_1c8 = 0x31;
  local_1d0 = 0x25;
  local_1d8 = 0x25;
```

`print_flag` - Line 137:\
In here each character is getting XOR-ed with 0x11. Statement looks confusing, because it's pseudo code and indexing with pointers (essesnitally iteration happens over buffer but at low level).

```c
charDecoded = *(uint *)(j + i2) ^ 0x11;
```

![all-father-wisdom-1](/assets/ctf/ductf/all-father-wisdom-1.png)

```
d7 34 f5 47 03 e4 d2 35 13 f5 e6 13 46 f4 b7 64 45 34 55 44
```

The output wasn't making sense, it was't hex so I used [Cipher Identifier](https://www.dcode.fr/cipher-identifier) and found [Circular Bit Shift](https://www.dcode.fr/circular-bit-shift).

![all-father-wisdom-2](/assets/ctf/ductf/all-father-wisdom-2.png)

```
➜ py
Python 3.9.5 (tags/v3.9.5:0a7dcbd, May  3 2021, 17:27:52) [MSC v.1928 64 bit (AMD64)] on win32
Type "help", "copyright", "credits" or "license" for more information.
>>> '}C_t0N-S1_n1dO{FTCUD'[::-1]
'DUCTF{Od1n_1S-N0t_C}'
```

::: tip Flag
`DUCTF{Od1n\_1S-N0t\_C}`
:::

### Note

I logically assumed buffer layoat to be `local_8 -> local_1d8`, turns out its reverse.

Correct order:

```bash
0x25 0x25 0x31 0x24 0x24 0x31 0x25 0x22 0x31 0x24 0x25 0x31 0x25 0x27 0x31 0x26 0x73 0x31 0x25 0x77 0x31 0x27 0x25 0x31 0x22 0x20 0x31 0x27 0x74 0x31 0x24 0x77 0x31 0x22 0x20 0x31 0x24 0x22 0x31 0x23 0x75 0x31 0x25 0x74 0x31 0x22 0x21 0x31 0x26 0x25 0x31 0x24 0x77 0x31 0x25 0x22 0x31 0x26 0x75
```

Cyberchef Recipe:\


1. From Hex
2. XOR 0x11 (Hex)
3. From Hex
