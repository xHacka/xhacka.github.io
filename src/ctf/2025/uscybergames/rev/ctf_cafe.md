# CTF Cafe

## Description

SIV Pipeline RE Group 3

Welcome to the CTF Cafe, where we serve only the finest menu items! We pride ourselves in our secret sauce, which is exclusive or something along those lines. At least, I think it is...

[ctf_cafe](https://ctf.uscybergames.com/files/763beb1cfac9017e76bb12c49e40df6e/ctf_cafe?token=eyJ1c2VyX2lkIjoxMDY4LCJ0ZWFtX2lkIjpudWxsLCJmaWxlX2lkIjoxMn0.aExojw.M_dJfLoTzlGrFnldxR9uFowi-5o)

## Solution

Too much RE is not required. Drop binary into your favorite decompiler or [https://dogbolt.org/?id=601ed0ed-a964-4a07-8d6b-f3586ab3a447#Ghidra=184&Hex-Rays=68&BinaryNinja=153](https://dogbolt.org/?id=601ed0ed-a964-4a07-8d6b-f3586ab3a447#Ghidra=184&Hex-Rays=68&BinaryNinja=153)

![CTF_Cafe.png](/assets/ctf/uscybergames/ctf_cafe.png)

```python
secret_sauce = [
    0xC8, 0x84, 0x85, 0x1D, 0x1B, 0xBF, 0x8B, 0xD8,
    0xF8, 0xE2, 0xAA, ord('*'), ord('x'), 0xA8, 0xDC, 0x99,
    0xE8, 0x8D, 0xAA, ord('n'), ord('"'), 0xF7, 0xB0, 0x87,
    0xAA, 0xB4, 0xF4, 0x05, ord('z'), 0xF0, 0x9C, 0x92,
    0xE6, 0, 0, 0, 0, 0, 0, 0
]
size = [0x9B, 0xD2, 0xC7, ord('Z'), ord('I'), 0xC4, 0xEF, 0xEB]
for i in range(0x21):
    print(chr(secret_sauce[i] ^ size[i % 8]), end="")
```

::: tip Flag
`SVBGR{d3c0mp1l3rs_m4k3_l1f3_34sy}`
:::

