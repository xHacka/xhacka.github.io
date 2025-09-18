# Weird Code

## Description 

Level: 2 Score 15 Category coding

I've found a weird piece of code in the internet. That looks strange....but there is a flag inside. I believe that! Help me, plz.

**Link:** [SecurityValley/PublicCTFChallenges/coding/weird_code](https://github.com/SecurityValley/PublicCTFChallenges/tree/master/coding/weird_code)

## Analysis

1. We are given what seems to be a disassambled code.
2. Its not Assembly
3. Searching around we can find that this is a python byte code using `dis` module
4. [Python `dis` Module](https://docs.python.org/3/library/dis.html)
5. `k\\PbYUHDAM[[VJlVAMVk[VWQE` seems to be encrypted password

## Solution

After fiddling around with `dis.dis()` I came to solution which looks like this. A standard XOR (as well seen in previous challenges)
```py
import dis

def enc():
    flag = "k\\PbYUHDAM[[VJlVAMVk[VWQE"
    key = "8934"
    out = ""
    for i in range(len(flag)):
        out += chr(ord(flag[i]) ^ ord(key[i % len(key)]))
    
    print(out)

print(dis.dis(enc)) # Debug

# enc() # Uncomment for flag
```
