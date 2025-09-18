# Compact XORs

## Description

By `skittles1412`

I found some hex in a file called fleg, but I'm not sure how it's encoded. I'm pretty sure it's some kind of xor...

Downloads: [fleg](https://amateurs-prod.storage.googleapis.com/uploads/cb78d86dedfe86b539015fa1a81086bbf80c4b56471a3c2799352254dd9d8aab/fleg)

## Analysis

Since XOR is used and we know how the flag starts I'll utilize crib attack.

CyberChef has XOR Bruteforce which will be helpful.

![compact-xors-1](/assets/ctf/amateursctf/compact-xors-1.png) 

![compact-xors-2](/assets/ctf/amateursctf/compact-xors-2.png)

![compact-xors-3](/assets/ctf/amateursctf/compact-xors-3.png)

Ok, There seems to be a pattern `char1, char2 ^ char1, ...`. First char is not encoded and is the key for second one.

## Solution

```py
from textwrap import wrap

s = '610c6115651072014317463d73127613732c73036102653a6217742b701c61086e1a651d742b69075f2f6c0d69075f2c690e681c5f673604650364023944'
bytes_ = wrap(s, 4) # Group into "{char1}{char2}"
flag = ""
for byte in bytes_:
    x, y = map(lambda i: int(i,16) , wrap(byte, 2)) # Hex to int
    flag += chr(x)     # Add plaintext
    flag += chr(y ^ x) # Add decoded

print(flag)
```

::: tip Flag
`amateursCTF{saves_space_but_plaintext_in_plain_sight_862efdf9}`
:::