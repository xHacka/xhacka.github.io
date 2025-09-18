# Ransomware

## \[★☆☆\] Recovery 1

### Description

You've been contacted by a movie production company that has been hit by ransomware. They need your help recovering the script for the next episode of a long-awaited series. It's urgent—millions (and possibly billions) of impatient fans are waiting.

[recovery_1.zip](https://ctf-world.cybergame.sk/files/f588b623fae4a7239ab3f4bacd8feb2e/recovery_1.zip?token=eyJ1c2VyX2lkIjoyOTQsInRlYW1faWQiOm51bGwsImZpbGVfaWQiOjl9.aD2q9g.UEG876ZY4sCxS7jNZBpq-jzv5wU)

### Solution

```powershell
➜ 7z l .\recovery_1.zip
   Date      Time    Attr         Size   Compressed  Name
------------------- ----- ------------ ------------  ------------------------
2025-03-28 12:18:40 D....            0            0  files
2025-03-28 12:18:40 .....         3918         3384  files\inescapable_storyception_of_doom.txt.enc
2025-03-28 12:18:40 .....       183540       183502  files\slon.png.enc
2025-03-28 12:18:13 .....          723          328  ransomware.py
------------------- ----- ------------ ------------  ------------------------
2025-03-28 12:18:40             188181       187214  3 files, 1 folders
```

```python
import os
from itertools import cycle

TARGET_DIR = "./files/"

def encrypt(filename, key):
    orig_bytes = None
    encrypted_bytes = bytearray()
    with open(TARGET_DIR + filename, "rb") as f:
        orig_bytes = bytearray(f.read())
    encrypted_bytes = bytes(a ^ b for a, b in zip(orig_bytes, cycle(key)))

    with open(TARGET_DIR + filename, "wb") as f:
        f.write(encrypted_bytes)

    os.rename(TARGET_DIR + filename, TARGET_DIR + filename + ".enc")

    print(f"[+] Encrypted {TARGET_DIR + filename}")


if __name__ == "__main__":
    key = os.urandom(16)
    for subdir, dirs, files in os.walk(TARGET_DIR):
        for file in files:
            print(f"file name: {file}")
            encrypt(file, key)
```

The `ransomeware.py` creates a random 16 byte key and then proceeds to encrypt the file using the key with XOR. Luckily there's more then 1 file and since the key has been reused the process should be reversible.

We know that [PNG](https://www.wikiwand.com/en/articles/PNG) always starts with `89 50 4E 47 0D 0A 1A 0A`, so we have partial key.
```powershell
➜ Format-Hex .\files\slon.png.enc | select -First 5
          Offset Bytes                                           Ascii
                 00 01 02 03 04 05 06 07 08 09 0A 0B 0C 0D 0E 0F
          ------ ----------------------------------------------- -----
0000000000000000 0A D2 9C D9 08 53 D5 65 21 BE 0C BF B0 36 1D 07 �Ò�Ù�SÕe!¾�¿°6��
0000000000000010 83 82 D7 9E 05 59 CB 6F 29 BD 0C B2 F9 F7 14 51 ��×��YËo)½�²ù÷�Q
0000000000000020 F2 82 D2 9E AD 09 83 3B 64 F9 7C FE EE 6B 4B 5F ò�Ò�­��;dù|þîkK_
0000000000000030 8A 8A C1 8F 0A 4B C0 63 21 BE 0C B2 F9 7E 5F 50 ��Á��KÀc!¾�²ù~_P
0000000000000040 87 83 D2 9E 05 59 CF 6D 23 BC 04 B5 FE D4 C8 20 ��Ò��YÏm#¼�µþÔÈ

➜ Format-Hex .\files\inescapable_storyception_of_doom.txt.enc | select -First 5
          Offset Bytes                                           Ascii
                 00 01 02 03 04 05 06 07 08 09 0A 0B 0C 0D 0E 0F
          ------ ----------------------------------------------- -----
0000000000000000 A0 A2 80 F7 66 32 EF 0E 4F DA 2C FF 96 0C 2D 2C  ¢�÷f2ï�OÚ,ÿ��-,
0000000000000010 A3 E3 BC FA 25 2D A7 0A 01 F7 62 D7 8A 1D 38 25 £ã¼ú%-§��÷b×��8%
0000000000000020 E2 E0 BE FB 25 0A BB 00 53 C7 6F D7 89 0A 30 3A âà¾û%�» SÇo×��0:
0000000000000030 ED A2 BD F8 25 1D A0 00 4C B4 45 C6 D9 0D 2D 34 í¢½ø%�  L´EÆÙ�-4
0000000000000040 F1 F6 B7 FA 25 35 A6 04 44 9E 6D DC 80 5E 36 21 ñö·ú%5¦�D�mÜ�^6!
```

```bash
ENC PNG: 0A D2 9C D9 08 53 D5 65
    PNG: 89 50 4E 47 0D 0A 1A 0A
XOR
    Key: 83 82 d2 9e 05 59 cf 6f (Partial)
```

![Ransomware.png](/assets/ctf/cybergame/ransomware.png)

If we go over some decoded text we can see word Morty: `# Rick and morty` fits perfectly in the first half.

![Ransomware-1.png](/assets/ctf/cybergame/ransomware-1.png)

Get the key: `83 82 d2 9e 05 59 cf 6f 21 be 0c b2 f9 7e 59 55`

![Ransomware-2.png](/assets/ctf/cybergame/ransomware-2.png)

![Ransomware-3.png](/assets/ctf/cybergame/ransomware-3.png)

> Flag: `SK-CERT{7r1v14l_r4n50mw4r3_f0r_7h3_574r7}`

## \[★☆☆\] Recovery 2

### Description

The producer did not upgrade their infrastructure, and their servers were encrypted again. The attackers used slightly modified malware, but it should not be too hard to decrypt.

[recovery_2.zip](https://ctf-world.cybergame.sk/files/814e9d703562068589950fabffa45fda/recovery_2.zip?token=eyJ1c2VyX2lkIjoyOTQsInRlYW1faWQiOm51bGwsImZpbGVfaWQiOjEwfQ.aD25QA.Vi4Y5BBDGthlYHtHzVAN4vg1Ay8)

### Solution

```powershell
➜ 7z l .\recovery_2.zip
   Date      Time    Attr         Size   Compressed  Name
------------------- ----- ------------ ------------  ------------------------
2025-03-28 16:41:10 .....         3082         2720  files\slopes_of_the_unknowable.txt.enc
2025-03-28 16:41:10 .....       183540       183522  files\slon.png.enc
2025-03-28 16:53:26 .....         1515          625  ransomware.py
------------------- ----- ------------ ------------  ------------------------
2025-03-28 16:53:26             188137       186867  3 files
```

```python
import os

TARGET_DIR = "./files/"

def rotate_left(byte, bits):
    return ((byte << bits) & 0xff) | (byte >> (8 - bits))

def rotate_right(byte, bits):
    return ((byte >> bits) & 0xff) | ((byte << (8 - bits)) & 0xff)

def encrypt(filename, key):
    block_size = len(key)
    with open(TARGET_DIR + filename, "rb") as f:
        print(f"Reading from {TARGET_DIR + filename}")
        data = f.read()

    encrypted = bytearray()
    num_blocks = (len(data) + block_size - 1) // block_size

    for i in range(num_blocks):
        block = data[i * block_size : (i + 1) * block_size]
        if i == 0:
            enc_block = bytearray()
            for j, b in enumerate(block):
                t = b ^ key[j]
                random_lower = os.urandom(1)[0] & 0x01
                new_val = (t & 0xFE) | random_lower
                enc_block.append(new_val)
        else:
            offset = i % block_size
            rotated_key = key[offset:] + key[:offset]
            xor_result = bytes(b ^ k for b, k in zip(block, rotated_key))
            enc_block = bytes(rotate_left(b, 3) for b in xor_result)
        encrypted.extend(enc_block)

    out_filename = TARGET_DIR + filename + ".enc"
    with open(out_filename, "wb") as f:
        f.write(encrypted)
    print(f"[+] Encrypted file written to {out_filename}")


if __name__ == "__main__":
    key = os.urandom(16)
    print(bytes(key).hex())
    for subdir, dirs, files in os.walk(TARGET_DIR):
        for file in files:
            encrypt(file, key)
```

Looks like the XOR was obfuscated with shifts and dash of randomness in the first block.

The very first block introduces 1-bit of randomness (only LSB) in each byte of the first block; 1 byte -> 2 possibilities (Feasible to brute-force).

Subsequent blocks use rotated keys and `rotate_left` shift, but never `rotate_right` meaning this can also be reversed.

Let:
- `C1` = encrypted version of `P1`
- `C2` = encrypted version of `P2`

If the encryption is:
```
C = ROTL3(P ⊕ key)
      |
      v
ROTR3(C) = P ⊕ key
      |
      v
ROTR3(C1) ⊕ ROTR3(C2) = (P1 ⊕ key) ⊕ (P2 ⊕ key) = P1 ⊕ P2

# 🥴🥴🥴
```

We cancel the key out and get `P1 ⊕ P2`. Then we guess the parts and recover the plaintext.

```python
def rotate_right(byte, bits):
    return ((byte >> bits) & 0xFF) | ((byte << (8 - bits)) & 0xFF)

def xor(b1, b2):
    return bytes(a ^ b for a, b in zip(b1, b2))

file1 = "./files/slopes_of_the_unknowable.txt.enc"
file2 = "./files/slon.png.enc"
block_size = 16 # Key length

with open(file1, 'rb') as f1, open(file2, 'rb') as f2:
    data1, data2 = f1.read(), f2.read()

num_blocks = len(data1) // block_size

for i in range(1, num_blocks):
    start, end = i * block_size, (i + 1) * block_size
    block1, block2 = data1[start:end], data2[start:end]

    rot1 = bytes(rotate_right(b, 3) for b in block1)
    rot2 = bytes(rotate_right(b, 3) for b in block2)

    xored = xor(rot1, rot2).decode('utf-8', errors='ignore')
    if xored.isprintable():
        print(f"Block {i:>3}: {block1.hex()} | {block2.hex()} | {xored_str}")

# ...
# Block  19: 1da1b06fc82d1637860eb0d1505e2732 | f6d56c24835e2d46871c1b72512d5c91 | }iing. But not
# Block  20: 3bb88f18fd2c4df4d7a0317abe77f00b | 3aeb24835e2d46871c1b72512d5c911c |  just anywhere,
# Block  21: efc882cc665ddc1d8011fabecfba3f5b | eb24835e2d46871c1b72512d5c911c3a |  Rick slurred,
# Block  22: 2598554e0d948f10d11a5e6790bf79c0 | 24835e2d46871c1b72512d5c911c3aeb |  calibrating the
# Block  23: 8265863586a750d1122c27e2373ba82f | 835e2d46871c1b72512d5c911c3aeb24 |  gun with one ha
# Block  24: 2d0e473c5f50117a2cdfeab7a9a057b8 | 5e2d46871c1b72512d5c911c3aeb2483 | nd while pouring
# Block  25: 2cdd9c5f6879d2aec7905749485f821d | 2d46871c1b72512d5c911c3aeb24835e |  schnapps into h
# ...
```

Recover potential key:
```python
def rotate_right(byte, bits):
    return ((byte >> bits) & 0xFF) | ((byte << (8 - bits)) & 0xFF)

def recover_key(block_index: int, plaintext: bytes, ciphertext: bytes) -> bytes:
    assert len(plaintext) == 16 and len(ciphertext) == 16
    offset = block_index % 16

    # Step 1: rotate_right the cipher bytes and XOR with plaintext to get rotated_key
    rotated_key = bytes(
        pt ^ rotate_right(ct, 3) for pt, ct in zip(plaintext, ciphertext)
    )

    # Step 2: unrotate the rotated key to get original key
    key = rotated_key[-offset:] + rotated_key[:-offset] if offset != 0 else rotated_key
    return key


plaintext = b" gun with one ha"
cipher_hex = "8265863586a750d1122c27e2373ba82f"
ciphertext = bytes.fromhex(cipher_hex)
block_index = 23

key = recover_key(block_index, plaintext, ciphertext)
print("Recovered key:", key.hex())

# Recovered key: a58b3283477d8470cba5c8f083634e2a
```

Few bytes are off...

![Ransomware-4.png](/assets/ctf/cybergame/ransomware-4.png)

# NOT SOLVED