# Advanced Decryption Standard

## \[☆☆☆\] Codebook

### Description

You know that feeling—waking up after a wild night of gambling, pockets full of keys you’re sure are yours, but somehow every single one feels wrong, and you can’t, for the life of you, remember which one fits where, or even what it’s supposed to unlock?

Now imagine being a novice cryptographer after that same night. You’ve got the keys—sure—but absolutely no clue what they open, how they work, or why you even have them in the first place. Welcome to the hangover of cryptography.

You think this file should contain a flag encrypted using... AES? Also, the letters ECB come to mind although you don’t know what it is. The flag should be in the usual format SK-CERT{something}.

key (hex format): 00000000000000000000000000000000

[ecb.dat](https://ctf-world.cybergame.sk/files/987d62845f4bfeacfa6e3e5eef5d80d3/ecb.dat?token=eyJ1c2VyX2lkIjoyOTQsInRlYW1faWQiOm51bGwsImZpbGVfaWQiOjIyfQ.aBfL6Q.zldW3Fu5ebS0tyAgYfVt-NaZSsQ "ecb.dat")

### Solution

Just AES (ECB mode) decrypt with given key

![Advanced Decryption Standard.png](/assets/ctf/cybergame/2025/crypto/Advanced Decryption Standard.png)

> Flag: `SK-CERT{f1r57_15_3cb}`

## \[☆☆☆\] Blockchain

### Description

You can’t, for the life of you, remember why each flag ended up with a different chaining method. Must’ve been one heck of a night...

This file contains the flag encrypted using AES with mode CBC.

key (hex format): 00000000000000000000000000000000 iv (hex format): 01020304050607080102030405060708

[cbc.dat](https://ctf-world.cybergame.sk/files/c0bebcb3599fdb95fc8bd80d4d470890/cbc.dat?token=eyJ1c2VyX2lkIjoyOTQsInRlYW1faWQiOm51bGwsImZpbGVfaWQiOjIzfQ.aBfOJw.aCPntPv5SvDp3oFlIbVOPoVHZ6Q "cbc.dat")

### Solution

![Advanced Decryption Standard-1.png](/assets/ctf/cybergame/2025/crypto/Advanced Decryption Standard-1.png)

> Flag: `SK-CERT{cbc_m0d3_15_n3x7}`

## \[☆☆☆\] Easy like counting up to three

### Description

EN: The math of this is beyond your comprehension, but you just know this file contains a third flag, encrypted using AES with CTR (counter) mode.

key (hex format): 11111111111111111111111111111111 iv (hex format): 99999999999999999999999999999999

[ctr.dat](https://ctf-world.cybergame.sk/files/9313a66ea45e8b85be7ca55b67ff2b4a/ctr.dat?token=eyJ1c2VyX2lkIjoyOTQsInRlYW1faWQiOm51bGwsImZpbGVfaWQiOjI0fQ.aBfOaw.ztklfKQxpxOLFbGZr98u8Dm4Vd4 "ctr.dat")

### Solution

![Advanced Decryption Standard-2.png](/assets/ctf/cybergame/2025/crypto/Advanced Decryption Standard-2.png)

> Flag: `SK-CERT{4nd_7h3_l457_15_c7r}`

