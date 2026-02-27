# I Hate Direct Reading

## Description

This should be easy enough!

 [I_Hate_Direct_Reading.rar](https://dgactf.com/files/9c62b21a0ed50676a66495437b833c70/I_Hate_Direct_Reading.rar?token=eyJ1c2VyX2lkIjoyMCwidGVhbV9pZCI6bnVsbCwiZmlsZV9pZCI6OH0.aYyn9g.p0qokMvphgOEjX2Ya53mkO3CR7c)

## Solution

```bash
└─$ 7z x I_Hate_Direct_Reading.rar
└─$ ls -Alh
Permissions Size User Date Modified Name
.rwxrwx---  415k root 10 Feb 02:48   I_Hate_Direct_Reading.png
.rwxrwx---  403k root 11 Feb 11:02   I_Hate_Direct_Reading.rar

└─$ file I_Hate_Direct_Reading.png
I_Hate_Direct_Reading.png: PNG image data, 900 x 900, 8-bit/color RGB, non-interlaced
```

![i_hate_direct_reading.png](/assets/ctf/dgactf/i_hate_direct_reading.png)

No hidden files
```bash
└─$ binwalk --dd='.*' I_Hate_Direct_Reading.png

DECIMAL       HEXADECIMAL     DESCRIPTION
--------------------------------------------------------------------------------
0             0x0             PNG image, 900 x 900, 8-bit/color RGB, non-interlaced
116           0x74            Zlib compressed data, best compression
```

I ran the `zsteg` first, but nothing.

Then I started analysis with this tool
- [https://fotoforensics.com/analysis.php?id=0ca2e03242709c904c304c1e23d13559ac296cec.415254](https://fotoforensics.com/analysis.php?id=0ca2e03242709c904c304c1e23d13559ac296cec.415254)

And what do you know, the PNG is longer then it appears to be!

![i-hate-direct-reading.png](/assets/ctf/dgactf/i-hate-direct-reading.png)

QR decodes to
```bash
A/MNCoyqiWljAAAAAAAAAAABAAAAQAAAAHMNAAAAZAAAhAAAWgAAZAEAUygCAAAAYwAAAAADAAAAEgAAAEMAAABzbAAAAGQBAGQCAGQDAGQEAGQFAGQGAGQFAGQHAGQIAGQJAGQKAGQLAGQMAGQNAGQHAGQOAGQGAGQPAGcSAH0AAGQQAH0BAHgeAHwAAERdFgB9AgB8AQB0AAB8AgCDAQA3fQEAcUkAV3wBAEdIZAAAUygRAAAATmlEAAAAaUcAAABpQQAAAGl7AAAAaUMAAABpUgAAAGlfAAAAaUIAAABpaQAAAGluAAAAaWEAAABpcgAAAGl5AAAAaVEAAABpfQAAAHQAAAAAKAEAAAB0AwAAAGNocigDAAAAdAMAAABzdHJ0BAAAAGZsYWd0AQAAAGkoAAAAACgAAAAAcwcAAABmbGFnLnB5UgMAAAAEAAAAcywAAAAAAQMBAwEDAQMBAwEDAQMBAwEDAQMBAwEDAQMBAwEDAQMBAwEJAQYBDQEUAk4oAQAAAFIDAAAAKAAAAAAoAAAAACgAAAAAcwcAAABmbGFnLnB5dAgAAAA8bW9kdWxlPgQAAABSAAAAAA==
```

```bash
└─$ file secret.pyc
secret: python 2.7 byte-compiled
```

This doesn't seem to help?
```bash
└─$ uncompyle6 secret.pyc
# uncompyle6 version 3.9.3
# Python bytecode version base 2.7 (62211)
# Decompiled from: Python 3.13.11 (main, Dec  8 2025, 11:43:54) [GCC 15.2.0]
# Embedded file name: flag.py
# Compiled at: 2026-02-09 04:36:12
def flag():
    str = [1,2,3,4,5,6,5,7,8,9,10,11,12,13,7,14,6,15]
    flag = ''
    for i in str:
        flag += chr(i)

    print flag
    return

return

# okay decompiling secret.pyc
```

Decompile with assembly output too
```bash
└─$ uncompyle6 -A secret.pyc
...
 22:          51 LOAD_CONST           (125) ; TOS = 125
              54 BUILD_LIST           18 ; TOS = [68, 71, 65, 123, 67, 82, 67, 95, 66, 105, 110, 97, 114, 121, 95, 81, 82, 125]
              57 STORE_FAST           (str) ; str = [68, 71, 65, 123, 67, 82, 67, 95, 66, 105, 110, 97, 114, 121, 95, 81, 82, 125]
...
```

```bash
└─$ py -c "print(''.join(chr(i) for i in [68, 71, 65, 123, 67, 82, 67, 95, 66, 105, 110, 97, 114, 121, 95, 81, 82, 125]))"
DGA{CRC_Binary_QR}
```

::: tip Flag
`DGA{CRC_Binary_QR}`
:::

### P.S.

To analyze the hidden pixels we can use IDAT chunks
```python
import struct
import zlib

with open("./ihate/I_Hate_Direct_Reading.png", "rb") as f:
    data = bytearray(f.read())

# IHDR is always at fixed offsets
width = struct.unpack(">I", data[16:20])[0]  # width @ 16
height = struct.unpack(">I", data[20:24])[0] # height @ 20
print(f"Declared: {width}x{height}")

# Collect and decompress all IDAT chunks to find true height
position, idat = 8, b""
while position < len(data):
    chunk_length = struct.unpack(">I", data[position:position+4])[0]

    if data[position+4:position+8] == b"IDAT":
        idat += data[position+8:position+8+chunk_length]

    position += 12 + chunk_length

row_bytes = 1 + width * 3  # filter byte + RGB
true_height = len(zlib.decompress(idat)) // row_bytes
print(f"True height: {true_height} ({true_height - height} hidden rows)")

# Patch height and fix IHDR CRC
data[20:24] = struct.pack(">I", true_height)
data[29:33] = struct.pack(">I", zlib.crc32(data[12:29]) & 0xffffffff)

with open("I_Hate_Direct_Reading_FIXED.png", "wb") as f:
    f.write(data)
```

```bash
Declared: 900x900
True height: 1600 (700 hidden rows)
```

