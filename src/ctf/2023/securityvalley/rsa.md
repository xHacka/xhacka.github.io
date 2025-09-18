# RSA

## Description

Level: 3 Score 40 Category crypto

We have again capture a bunch of numbers in a list. That makes no sense at all. But a whisteblower has leak that it can be a RSA encrypted block and has published a piece of code.

**Link**: [SecurityValley/PublicCTFChallenges/crypto/rsa](https://github.com/SecurityValley/PublicCTFChallenges/tree/master/crypto/rsa)

# Analysis

Challenge gives us simple [RSA](https://www.wikiwand.com/simple/RSA_algorithm#introduction) encryption and to decrypt it we have to do following:

1. Obtain the private exponent `d` and the modulus `n` from the decryption key.
    * The private exponent `d` can be calculated using the modular multiplicative inverse of `e` modulo `φ(n)`, where `φ(n)` represents Euler's totient function applied to `n`.
2. Iterate through each element `c` in the encrypted message.
3. Calculate the decrypted value `m` using the formula: `m = (c ** d) % n`.
4. Convert the decrypted value `m` back to the original character using the `chr()` function.
5. Concatenate the characters obtained to form the original message.

## Solution

```py
from sympy import mod_inverse, prime

def get_keys():
    p, q = prime(50), prime(60)
    n = p * q
    phi = (p-1)*(q-1)
    e = 47

    return e, n, phi

def decrypt_msg(msg):
    e, n, phi = get_keys()
    d = mod_inverse(e, phi) # Private Exponent
    
    # 1. Calculate decrypted value 
    # 2. Value into character
    # 3. Concatenate
    #            3        2    1
    enc_msg = ''.join(map(chr, [pow(c, d, n) for c in msg]))

    return enc_msg


msg = [5129, 10327, 42284, 57695, 5730, 64016, 31008, 40005,
       63768, 46371, 7692, 48194, 9075, 32422, 35191, 63230]
print(decrypt_msg(msg))
```

<small>
Note: If you dont want to install `sympy` library, you can always use online <em>[SymPy Live Shell](https://live.sympy.org)</em>
</small>