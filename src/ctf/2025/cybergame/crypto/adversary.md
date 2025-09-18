# Adversary

## \[★☆☆\] Almost Classic

### Description

We've captured communication of two adversaries. We need to decrypt it.

[communication.txt](https://ctf-world.cybergame.sk/files/d064fb5cd683d59b3e2bd6d364ff7b5a/communication.txt?token=eyJ1c2VyX2lkIjoyOTQsInRlYW1faWQiOm51bGwsImZpbGVfaWQiOjV9.aBfPCg.yVXbAMkWWik6_Yy9J7vMR7Ai3-k)

### Solution

```bash
X: Ovgh xlliwrmzgv gsv wilk klrmg.
Y: Ztivvw yfg dv szev gl yv xzivufo. Lfi xibkgltizksvih dzimvw fh zylfg gsrh nvgslw. Gsvb hzb rg dlmg slow uli olmt.
X: Dv wlmg szev grnv gl hvg fk zmbgsrmt yvggvi. Xlnv gl gsv fhfzo kozxv rm gsv Kvmgztlm, Hgzeyzihpz 42. Gsv yzigvmwvi droo trev blf gsv kzxpztv. 
Y: Urmv yfg ru dv tvg xlnkilnrhvw yvxzfhv lu gsv xrksvi blf szev gl wlfyov blfi hgzpvh. HP-XVIG{szev_blf_vevi_svziw_zylfg_z_yolxp_xrksvi???}
```

[https://www.dcode.fr/cipher-identifier](https://www.dcode.fr/cipher-identifier) -> [https://www.dcode.fr/atbash-cipher](https://www.dcode.fr/atbash-cipher)

```bash
C: Lets coordinate the drop point.
B: Agreed but we have to be careful. Our cryptographers warned us about this method. They say it wont hold for long.
C: We dont have time to set up anything better. Come to the usual place in the Pentagon, Stavbarska 42. The bartender will give you the package.
B: Fine but if we get compromised because of the cipher you have to double your stakes. SK-CERT{have_you_ever_heard_about_a_block_cipher???}
```

> Flag: `SK-CERT{have_you_ever_heard_about_a_block_cipher???}`

## \[★☆☆\] 3AES

### Description

We have intercepted a ciphertext along with a presumed key exchange in plaintext. Our sources informed us that the adversary is using a custom-made cipher they call "3AES".

[intercept.txt](https://ctf-world.cybergame.sk/files/b816c38d0b04507f0393cdef0087d79f/intercept.txt?token=eyJ1c2VyX2lkIjoyOTQsInRlYW1faWQiOm51bGwsImZpbGVfaWQiOjZ9.aBfPxA.FX3A-SDx5-4e1TLCrigFHLJyAYc)

### Solution

After some googling I come upon this website: [https://www.devglan.com/online-tools/triple-des-encrypt-decrypt](https://www.devglan.com/online-tools/triple-des-encrypt-decrypt), but I couldn't enter 3 keys so had to write a script:
```python
from base64 import b64decode
from Crypto.Cipher import AES
from Crypto.Util.Padding import unpad

KEY1 = b64decode("h+NvKyaJFRhpn7lRWo0JGGcSk7TOd2ltibSSI1CGDCk=")
KEY2 = b64decode("CznIYU0rBgmzSb7WyqYfj+WKyDSXbbnsa8Wp/IRvUOc=")
KEY3 = b64decode("ihpLsXPURUTwH4ULO9/87rHRCQibQO6+V4/QKJL7Bgg=")

conversation = [
    b64decode("t+WZSn6H1mA9XUQJrQ2xxt33nVh6orKFygb7Q+8xMe9JSk7XgMdZ8Fwq9rSMw9SuCZWoIJ8qYOSOKwmyyvMmW7/kkPDoWNEezfme08HmEWi3DrPAefIpNVVewbfVzt5j"),
    b64decode("rOkz0hogqrrjVXe8KhfwPmTXqy0NI5BaaVRwg8g4490Gi//XIIYY6t7pMpw/0DN4V26tcdwmmOOne75oEt4/oQ=="),
    b64decode("k8JzsMNxiG5KPGSdM/YjGjW7y8dzgG8vsQ3RB062Kz1/EzwUaWz5Sr2UFNuq0jcWqDdj3Y9I0UKz0rYdZuTxMHZ+oKVEqI8Xv9CuvOmOzkdBoBgsjaWT9ke6+BPcMH9Kpwq/jgoYVQ7SfJDKx5GCAxzSLyyS6tXGIZRrUny6jiU="),
    b64decode("dNMxxcWRHkxNxHu17gw5g5IE/Jf6tNmxw4OfBHEXfRv0cx4pKVKYjZofSRAgFspLnWcdR5GGasKxCgpOANPyS4liypMrPFKlXy/pm2BG7bM="),
]

def decrypt_3aes_triple_des_logic(ciphertext, key1, key2, key3):
    plaintext = (
        AES.new(key1, AES.MODE_ECB).decrypt(
            AES.new(key2, AES.MODE_ECB).encrypt(
                AES.new(key3, AES.MODE_ECB).decrypt(ciphertext)
            )
        )
    )
    try:
        return unpad(plaintext, AES.block_size)
    except ValueError:
        return plaintext 

for line in conversation:
    decrypted = decrypt_3aes_triple_des_logic(line, KEY1, KEY2, KEY3).decode()
    print(f"Decrypted bytes: {decrypted}")
```

```
Decrypted bytes: It should be fine now. We switched to a custom cipher based on the AES standard.
Decrypted bytes: The meeting was compromised. They were waiting for us.
Decrypted bytes: We had to flee. Our guy will wait for you near Slavin. Come right at noon. SK-CERT{1_w0nd3r_why_th3y_d0nt_us3_7h1s_1rl}
Decrypted bytes: FINE but if this fails again I pick the crypto we use! What is the drop point?
```

> Flag: `SK-CERT{1_w0nd3r_why_th3y_d0nt_us3_7h1s_1rl}`

## \[★☆☆\] Key exchange

### Description

The adversary started using a new algorithm for key exchange. We were able to get its schema from our source. We attach the communication where we suspect the adversary might be agreeing upon a key and then using the 3AES encryption we've seen previously.

[exchange.png](https://ctf-world.cybergame.sk/files/55ee4f423b785f39d181ac06234d95bb/exchange.png?token=eyJ1c2VyX2lkIjoyOTQsInRlYW1faWQiOm51bGwsImZpbGVfaWQiOjd9.aBfXDA.pgJpk7Y2p0sm-aBOswcJZFt6Ohs "exchange.png")

[messages.txt](https://ctf-world.cybergame.sk/files/6f036aaef3eaf3c9ae11fc2e24ebd4bd/messages.txt?token=eyJ1c2VyX2lkIjoyOTQsInRlYW1faWQiOm51bGwsImZpbGVfaWQiOjh9.aBfXDA.7lEQXGWL2jf5o5j7YbvWDX8moBs "messages.txt")

### Solution

### Key Exchange Steps:

1. X sends **S1⊕Key** to Y.
2. Y sends **S2⊕S1⊕Key** back to X.
3. X sends **S2⊕Key** to Y.
4. Y recovers the key by computing: **Key = (S2⊕Key)⊕S2**

```python
import base64

def xor_bytes(a, b): return bytes(x ^ y for x, y in zip(a, b))

msg1_b64 = "tL90zeX19A2CLF9PH9oMQEuAPURmv7rp+oQ/DWiXEwTTQ6Ry/yDBHgqBGAa+OCaoI5JfdGYqhM2SHCWQyVdKJPj8HTY3gkxG38JEaET+CgX7h3cPQrufwYG8UOH6scrk1+guWvLOIAb/VJZ7pbjnEeORtN9C91EvxhNAO7r9pSFczo2TCGyFSaNOsvzN6C88Gw+4eXMTtVw="
msg2_b64 = "mBpf0ZTjWUczik9rrfwdM4wgVrN4I+++PGQSctBkAliziynxXJxYT0KnWxf5q8f1utv9ERPaWsJ+e/fENymhCWELXAnXGFaF8LHLzl9N1TWxu4b1CPPsU2pi2Rar9pm9FLfN4x/yYfP7daqKD7Rvq67wRu9+jsrgQKFj7687mZA4I9s11NpQQ7TSrEVr8Xx0d8FIZsV4x9M="
msg3_b64 = "R8BSLUs24ieC8nV22ER/HYDYE7ltrz548dNMJeC+SwsOrcXFmuTdYHlSCnor9NU28nSoDhCJ7DXMDL5gzEiPWsikIgeM30CNfyH2ny/A6H0eZrOyLiEK8ZOS79hoFDsbiA3IidA2KpB9EgbRz1vRzXoOsAhUTa27/Px3nlCOboZRhXnTruzsPnKpWYjvXRQLKKW/d4Y4BbI="

A = base64.b64decode(msg1_b64)
B = base64.b64decode(msg2_b64)
C = base64.b64decode(msg3_b64)

# Step 1: Recover S2 = A ⊕ B
S2 = xor_bytes(A, B)

# Step 2: Recover Key = C ⊕ S2
Key = xor_bytes(C, S2)

# Output the key in hex and base64
print(f"Recovered Keys:\n{Key.decode()}")

# Recovered Keys:
# key1: Om3TeRjbnnGxxNs3k/73aZXMZWneHF9XD11tIklg4kk=
# key2: kl426dwQSc8lEZNPRy94s7MTZBHdiycxLf/9ShBKR+0=
# key3: eWYw7oB8h46tzNTJEHR75h/urZ94e5G1IDGCDkOh0Sw=
```

Not that we recovered keys it's the same process as last challenge with 3DES (or 3AES..)
```python
from base64 import b64decode
from Crypto.Cipher import AES
from Crypto.Util.Padding import unpad

key1 = b64decode('Om3TeRjbnnGxxNs3k/73aZXMZWneHF9XD11tIklg4kk=')
key2 = b64decode('kl426dwQSc8lEZNPRy94s7MTZBHdiycxLf/9ShBKR+0=')
key3 = b64decode('eWYw7oB8h46tzNTJEHR75h/urZ94e5G1IDGCDkOh0Sw=')

convertsation = [
    b64decode('xl24Q/q0QOTK0hl1zOrSLgOEfbg+pzUf2FLNfS4OJD8k+R5hviqHb+DFSO2m1gXzkNoQa2guDRSRtKmHqigFKB/azqdEahvEnbH/wUImMc5UeC1FjOwsc7MBrhELI2M+rpo0z2RvzX+2VF0fCQWGm8by5D7yyJL8VHsE6acQjGSvkz0L+kRNtAQXh4ywjAet3rxnSlyu1kO9N4BPjCpCYNtfuPbnccMUCWiePiyj+GXh838frFEDdzL9gVOA4CZSNIOOgIJ0Re1c3dPQBdxhqpeXXyoj4PUK1W1Q6ZjOr362SoD8PwUU55nQTPUW50cp'),
    b64decode('CuU+OFj7FoHmmT1Ppsfn+kbLwwQF9A9hvdLgE8sEIi6D6RyCr6b2E+YxQi2x9qkECPJkiuSeYypnDifjavlhvTez6hM2JbZV4WrrzmePjWd/a63ZBgTs/JR9j0XdO0xoXCi5Y0rPDjj0oJsfLilu34PXtO8t1Y2MnlPQ/aRvhn+xe3mKauDuDtPjI+N3Tood'),
    b64decode('AYdjr4yUpFrQC23EKtj0+w5m6Qq5QnxHcCC8WeU9GUPH6rAig0auAEKMVyfGnj/qxHKXuFSnWX+9Z04hY3RYLw==')
]

def decrypt_3aes(ciphertext, key1, key2, key3):
    plaintext = (
        AES.new(key1, AES.MODE_ECB).decrypt(
            AES.new(key2, AES.MODE_ECB).encrypt(
                AES.new(key3, AES.MODE_ECB).decrypt(ciphertext)
            )
        )
    )
    try:
        return unpad(plaintext, AES.block_size)
    except ValueError:
        return plaintext 
    
for line in convertsation:
    decrypted = decrypt_3aes(line, key1, key2, key3)
    print(decrypted.decode())

# They were there again.  Exchanging keys in the plaintext is not something a sensible person would do! We cannot make rookie mistakes like this again. The key exchange algo I made is 100% secure as it's 
based on Diffie Hellman.
# Okay Mr. Robot. Since they've busted all our people I'll be waiting for you on the corner of Priehradna and Modricova tomorrow at 15:30
# Agreed. SK-CERT{d1ff13_h3llm4n_15_n07_7h47_51mpl3_l0l}
```

> Flag: `SK-CERT{d1ff13_h3llm4n_15_n07_7h47_51mpl3_l0l}`

