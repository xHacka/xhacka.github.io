# Crypt Of The Undead

## Description

All my important files have been zombified by the notorious Zombie Cybercrime Gang. Can you lay them to rest and bring my files back?

## Solution

Open program in Ghidra:
```bash
└─$ ghidra_auto crypt
[*] File Ouput:
        ELF 64-bit LSB pie executable
        x86-64
        version 1 (SYSV)
        dynamically linked
        interpreter /lib64/ld-linux-x86-64.so.2
        BuildID[sha1]=5ac213d86cdb95af5f911c357cdc45c66b6bffc1
        for GNU/Linux 4.4.0
        not stripped
[*] Running Analysis...
```

The `encrypt_buf` is the heart of the program, to decode we must take steps backwards. Nonce is `0`, remember that.

![CryptOfTheUndead.png](/assets/ctf/htb/cryptoftheundead.png)

Source of the chacha20 functions: https://github.com/Ginurx/chacha20-c/blob/master/chacha20.c

The key is hardcoded into the program:

![CryptOfTheUndead-1.png](/assets/ctf/htb/cryptoftheundead-1.png)

Decode:
```python
from Crypto.Cipher import ChaCha20 

with open('./flag.txt.undead', 'rb') as f:
    ciphertext = f.read()

key = b'BRAAAAAAAAAAAAAAAAAAAAAAAAAINS!!'
nonce = b'\x00' * 8

cipher = ChaCha20.new(key=key, nonce=nonce)
plaintext = cipher.decrypt(ciphertext)
print("Decrypted data:", plaintext.decode())
```

::: tip Flag
`HTB{und01ng_th3_curs3_0f_und34th}`
:::