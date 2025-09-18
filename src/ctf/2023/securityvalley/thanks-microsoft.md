# Thanks Microsoft

#  Thanks Microsoft

##  Description

Level: 3 Score 20 Category crypto

During our hack we have stolen a pieces of weird and old C code. But it seems that this was only the encoder...please reverse it and reveal the secret message

**Link:** [SecurityValley/PublicCTFChallenges/crypto/thanks_microsoft](https://github.com/SecurityValley/PublicCTFChallenges/tree/master/crypto/thanks_microsoft)

## Analysis

1. Program takes in command line argument as input
2. Input is getting encoded character by character
3. Encryption is using bitwise operations 
4. Output is in hex

## Solution

Encryption seems to be very complex. Reversing the output into input would be really hard, but we could build a dictionary of encoded characters which correspond to (not encoded) character, this way we can easily get flag.

```py
import string 
from textwrap import wrap

# Minified version of C function
def encode_char(char):
    ln = ord(char) & 0x0F
    hn = ord(char) >> 4 & 0x0F

    x = 11 if hn <= 9 else 26
    y = 14 if ln <= 9 else 26

    if(hn > 9): hn -= 9
    if(ln > 9): ln -= 9 

    return (((((0x0E << 6) | y) << 4) | ln) << 6 | x) << 4 | hn

ALPHABET = string.ascii_letters + string.digits + "{_}!" # Create alphabet
CIPHER = {encode_char(c): c for c in ALPHABET} # Build dictionary
msg = "e38cb5e394b6e38cb6e398b5e384b6e68cb6e688b7e68cb6e698b6e68cb6e698b5e390b7e3a0b6e384b4e390b7e698b5e39cb7e384b6e38cb7e698b5e694b6e698b6e698b5e394b6e694b6e38cb6e388b7e3a4b7e380b7e390b7e384b3e698b6e694b6e690b7"

# In C code output is printed as %x (hex) which seems to be 6 in length (1 Chunk)
# Chunk is converted to integer using `int`
# Encoded character is being looked up in dictionary
# Finally everything gets joined in one string
print("".join(CIPHER[int(chunk, 16)] for chunk in wrap(msg, 6)))
```