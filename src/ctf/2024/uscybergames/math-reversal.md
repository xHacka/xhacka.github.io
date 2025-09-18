# Math Reversal

# Math Reversal

### Description

Math Reversal \[Reverse Engineering]

Do some calculations to find the correct flag

&#x20;[beginnerREChal\_1](https://ctfd.uscybergames.com/files/278ac25b3b73811bb4dd255be528b81a/beginnerREChal_1?token=eyJ1c2VyX2lkIjozMDg2LCJ0ZWFtX2lkIjpudWxsLCJmaWxlX2lkIjoyMzF9.Zl7ZvQ.Kf3hn8k4wc1z9k1B3Zz4pFT378g)\
&#x20;

### Solution

```bash
└─$ file beginnerREChal_1
beginnerREChal_1: ELF 64-bit LSB pie executable, x86-64, version 1 (SYSV), dynamically linked, interpreter /lib64/ld-linux-x86-64.so.2, BuildID[sha1]=c8fd3350ec8609c47517e5f42c5c4f3c76dc5cc8, for GNU/Linux 3.2.0, not stripped
```

Using `ghidra_auto` open file and analyze the binary.

```bash
└─$ ghidra_auto -t beginnerREChal_1
[*] File Ouput:
        ELF 64-bit LSB pie executable
        x86-64
        version 1 (SYSV)
        dynamically linked
        interpreter /lib64/ld-linux-x86-64.so.2
        BuildID[sha1]=c8fd3350ec8609c47517e5f42c5c4f3c76dc5cc8
        for GNU/Linux 3.2.0
        not stripped
[*] Running Analysis...
Picked up _JAVA_OPTIONS: -Dawt.useSystemAAFontSettings=on -Dswing.aatext=true
Picked up _JAVA_OPTIONS: -Dawt.useSystemAAFontSettings=on -Dswing.aatext=true
Picked up _JAVA_OPTIONS: -Dawt.useSystemAAFontSettings=on -Dswing.aatext=true
openjdk version "21.0.2" 2024-01-16
OpenJDK Runtime Environment (build 21.0.2+13-Debian-2)
OpenJDK 64-Bit Server VM (build 21.0.2+13-Debian-2, mixed mode)
[+] Analysis Complete
[*] Opening Ghidra...
Picked up _JAVA_OPTIONS: -Dawt.useSystemAAFontSettings=on -Dswing.aatext=true
Picked up _JAVA_OPTIONS: -Dawt.useSystemAAFontSettings=on -Dswing.aatext=true
[*] Project Directory: /tmp/tmppzkstyg6
[*] Project File: /tmp/tmppzkstyg6/beginnerREChal_1.gpr
```

`main` function:

![Math Reversal](/assets/ctf/uscybergames/math_reversal.png)

`checkflag`:

![Math Reversal-1](/assets/ctf/uscybergames/math_reversal-1.png)

`flagCheck` seems to be a dynamic variable which can't be previewed by static analysis.

We can use IDA Free to dynamically analyze the binary, setting breakpoint to this function and going few steps in we can see `flagCheck` is initialized:![Math Reversal-2](/assets/ctf/uscybergames/math_reversal-2.png)

```python
➜ py
Python 3.11.6 (tags/v3.11.6:8b6ee5b, Oct  2 2023, 14:57:12) [MSC v.1935 64 bit (AMD64)] on win32
Type "help", "copyright", "credits" or "license" for more information.
>>> s='2D, 37, 2A, 3E, 39, 2E, 5, 0A, 4D, 0E, 7, 21, 1C, 4F, 1A, 1A, 4F, 1D, 0B, 14, 0C, 21, 10, 1F, 0D, 0D, 9, 50, 0E, 1C, 3'.split(', ')
>>> len(s)
31
>>> ''.join(
...     map(
...         lambda i: chr(0x80 - int(i, 16)),
...         s
...     )
... )
'SIVBGR{v3ry_d1ff1cult_passw0rd}'
```

::: tip Flag
`**SIVBGR{v3ry\_d1ff1cult\_passw0rd}**`
:::
