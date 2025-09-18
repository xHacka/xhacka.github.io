# The Magic of Bytes

## Description

I heard my friend wants to prepare for the new AP Cybersecurity CollegeBoard is adding soon, so I prepared a challenge with two python reverse engineering techniques. He insisted on it having an ELF binary though, so I also included it. Can you solve the challenge?

1. [chall.py](https://ctf.uscybergames.com/files/b75ab3ca86cd787cb18f8acf7a0cb336/chall.py?token=eyJ1c2VyX2lkIjoxMDY4LCJ0ZWFtX2lkIjpudWxsLCJmaWxlX2lkIjoxNn0.aExqGA.wzSdZQBne2J87fOLwPoRnC99LOc)
2. [bytes.txt](https://ctf.uscybergames.com/files/b35426bf7bb7efbaab0d116abd1e4a6f/bytes.txt?token=eyJ1c2VyX2lkIjoxMDY4LCJ0ZWFtX2lkIjpudWxsLCJmaWxlX2lkIjoxN30.aExqGA.cIhBBSOnlQsOlzkzZoqPHkv9-i0)

## Solution

`chall.py`:
```python
ELF_bytes = #"REDACTED"
key = #REDACTED
def not_so_fast(ELF_bytes,key):
    message = ""
    for i in range(len(ELF_bytes)):
        message += chr(ord(ELF_bytes[i]) + key)
    return message

with open("bytes.txt","a") as file:
    file.write("You want your ELF challenge so bad? Well here it is!\n")
    file.write(not_so_fast(ELF_bytes,key))
```

`bytes.txt` is too long to paste, so here's the portion

![The_Magic_of_Bytes.png](/assets/ctf/uscybergames/the_magic_of_bytes.png)

`ELF_bytes` must be the bytearray of ELF file itself, and the key might be fixed value so output is masked as something else.

After lots of trials and error, bruteforcing the index and reading the output I realized that key 9 gave output it hex, but not bytes... raw hex.
```python
def rev_not_so_fast(ELF_bytes,key):
    return "".join(chr(ord(c) - key) for c in ELF_bytes)

elf_header = "\x7fELF"
elf_header_hex = "7F454C46"
elf_bytes = "@O=>=L=?9;"

for key in range(1, 256):
    try:
        decoded = rev_not_so_fast(elf_bytes, key)
        if decoded.startswith(elf_header) or decoded.startswith(elf_header_hex):
            print(f"[+] Key found: {key}")
    except Exception as e:
        ...

# [+] Key found: 9
```

Get the ELF file:
```python
def rev_not_so_fast(ELF_bytes, key):
    return "".join(chr(ord(c) - key) for c in ELF_bytes)

with open("bytes.txt") as enc, open("bytes.elf", 'wb') as dec:
    dec.write(
        bytes.fromhex(
            rev_not_so_fast(
                ELF_bytes=enc.readlines()[1].strip(),
                key=9
            )
        )
    )
```

Validate elf:
```bash
└─$ file bytes.elf
bytes.elf: ELF 64-bit LSB pie executable, x86-64, version 1 (SYSV), dynamically linked, interpreter /lib64/ld-linux-x86-64.so.2, BuildID[sha1]=685074170013163fb95e0e5f8a0716c6666cba7e, for GNU/Linux 3.2.0, not stripped
```

[https://dogbolt.org/?id=41fbcb8d-1021-4bdf-be34-88419ad6b2e4#Ghidra=1136&Hex-Rays=152&BinaryNinja=89](https://dogbolt.org/?id=41fbcb8d-1021-4bdf-be34-88419ad6b2e4#Ghidra=1136&Hex-Rays=152&BinaryNinja=89)

![The_Magic_of_Bytes-1.png](/assets/ctf/uscybergames/the_magic_of_bytes-1.png)

Decode hex once more:
```python
hex_string = (
    "550D0D0A 00000000 41322968 48010000 E3000000 00000000 00000000 00000000 00030000 00400000 00738E00 00006400 64016C00"
    " 5A006402 64038400 5A016404 64058400 5A026406 64078400 5A036408 64098400 5A04640A 640B8400 5A05640C 640D8400 5A06640"
    "E 640F8400 5A076410 64118400 5A086412 64138400 5A09650A 65068300 65038300 17006502 83001700 65048300 17006501 830017"
    "00 65058300 17006508 83001700 65098300 17006507 83001700 83010100 64015300 2914E900 0000004E 63000000 00000000 00000"
    "000 00000000 00010000 00430000 00730400 00006401 53002902 4E5A0335 5F49A900 72020000 00720200 00007202 000000FA 0677"
    "696E 2E7079DA 02733103 00000073 02000000 00017204 00000063 00000000 00000000 00000000 00000000 01000000 43000000 730"
    "40000 00640153 0029024E 5A033331 31720200 00007202 00000072 02000000 72020000 00720300 0000DA02 73320600 00007302 00"
    "000000 01720500 00006300 00000000 00000000 00000000 00000001 00000043 00000073 04000000 64015300 29024E7A 027B5772 0"
    "2000000 72020000 00720200 00007202 00000072 03000000 DA027333 09000000 73020000 00000172 06000000 63000000 00000000 "
    "00000000 00000000 00010000 00430000 00730400 00006401 53002902 4E5A045F 54683172 02000000 72020000 00720200 00007202"
    " 00000072 03000000 DA027334 0C000000 73020000 00000172 07000000 63000000 00000000 00000000 00000000 00010000 0043000"
    "0 00730400 00006401 53002902 4E5A0435 5F416E72 02000000 72020000 00720200 00007202 00000072 03000000 DA027335 0F0000"
    "00 73020000 00000172 08000000 63000000 00000000 00000000 00000000 00010000 00430000 00730400 00006401 53002902 4E5A0"
    "553 56424752 72020000 00720200 00007202 00000072 02000000 72030000 00DA0273 36120000 00730200 00000001 72090000 0063"
    "0000 00000000 00000000 00000000 00000100 00004300 00007304 00000064 01530029 024E7A03 31317D72 02000000 72020000 007"
    "20200 00007202 00000072 03000000 DA027337 15000000 73020000 00000172 0A000000 63000000 00000000 00000000 00000000 00"
    "010000 00430000 00730400 00006401 53002902 4E5A055F 354C465F 72020000 00720200 00007202 00000072 02000000 72030000 0"
    "0DA0273 38180000 00730200 00000001 720B0000 00630000 00000000 00000000 00000000 00000100 00004300 00007304 00000064 "
    "01530029 024E5A03 43484172 02000000 72020000 00720200 00007202 00000072 03000000 DA027339 1B000000 73020000 00000172"
    " 0C000000 290B5A0A 70795F63 6F6D7069 6C657204 00000072 05000000 72060000 00720700 00007208 00000072 09000000 720A000"
    "0 00720B00 0000720C 000000DA 05707269 6E747202 00000072 02000000 72020000 00720300 0000DA08 3C6D6F64 756C653E 010000"
    "00 73140000 00080208 03080308 03080308 03080308 03080308 03"
)
with open("flag.txt", 'wb') as dec:
    dec.write(bytes.fromhex(hex_string))
```

Check file:
```bash
└─$ file flag.txt
flag.txt: Byte-compiled Python module for CPython 3.8, timestamp-based, .py timestamp: Sun May 18 01:05:05 2025 UTC, .py size: 328 bytes
```

Decompile with [uncompyle6](https://github.com/rocky/python-uncompyle6)
```bash
└─$ mv flag.txt flag.pyc
└─$ uncompyle6 flag.pyc
# uncompyle6 version 3.9.2
# Python bytecode version base 3.8.0 (3413)
# Decompiled from: Python 3.11.9 (main, Apr 10 2024, 13:16:36) [GCC 13.2.0]
# Embedded file name: win.py
# Compiled at: 2025-05-17 21:05:05
# Size of source mod 2**32: 328 bytes
import py_compile

def s1(): return "5_I"
def s2(): return "311"
def s3(): return "{W"
def s4(): return "_Th1"
def s5(): return "5_An"
def s6(): return "SVBGR"
def s7(): return "11}"
def s8(): return "_5LF_"
def s9(): return "CHA"
print(s6() + s3() + s2() + s4() + s1() + s5() + s8() + s9() + s7())
# okay decompiling flag.pyc
```

::: tip Flag
`SVBGR{W311_Th15_I5_An_5LF_CHA11}`
:::

