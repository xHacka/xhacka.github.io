# XOR Pain

Level: 3 Score 30 Category crypto

There is a piece of code and a text file. Make it work!!

**Link:** [SecurityValley/PublicCTFChallenges/crypto/xor_hell](https://github.com/SecurityValley/PublicCTFChallenges/tree/master/crypto/xor_hell)

## Analysis

1. [xor_hell.py](https://github.com/SecurityValley/PublicCTFChallenges/blob/master/crypto/xor_hell/xor_hell.py "xor_hell.py") performs standard XOR operation on the flag
2. We have the output (in hex format)
3. Key is `0`. It's not a real key, but rather redacted value

## Solution

Since we know that XOR is a symmetrical encryption we can abuse that.  

By using [Crib Attack](https://www.wikiwand.com/en/Known-plaintext_attack#introduction) method we can find the key and then decrypt the flag.
We can utilize the crib attack since we know that flag always starts with `SecVal{`

![Cyberchef](/assets/ctf/securityvalley/xor-hell-1.png)

<small>Note: Bruteforcing whole flag from Cyberchef will take ages, doing chunk by chunk is faster</small>

After doing it for other parts
```
Key = 6f6d: Se
Key = 676f: cV
Key = 6d67: al

6f6d676f6d67
```

key=6f6d67 in hex (we know this because key gets repeated).

To test the key we can use XOR from CyberChef and get the flag
![Cyberchef](/assets/ctf/securityvalley/xor-hell-2.png)