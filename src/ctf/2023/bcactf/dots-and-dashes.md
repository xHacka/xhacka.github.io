# Dots and Dashes

## Description

Dots and Dashes | 25 points | By  `Parth`

My friend sent me a message by flashing his flashlight, and I recorded it using .'s and -'s. Can you help me decode it?

Static resources: [code.txt](https://storage.googleapis.com/bcactf/dots-and-dashes/code.txt)

## Analysis

`code.txt` contains text which seems to be `morse` code, but after trying to decode it no valid results. It can't be morse since there's hardly any seperation of characters.

The other option could be that it's binary data.

## Solution

```py
from textwrap import wrap

enc = '''
-..---.--..---..-..----.-..---..-...-.---..--..--....-..-..-...---..-----.-.-.---.-.....-.-.---.-.-.-.-.--.----.-...-.----..--..-.-.....-.--..-.--..-----...--.---..-.-.-.---.-.-.-.....--...--.--...-----..---.--..-.----..-.-.--..-.---.....-.
'''.strip() # Remove trailing spaces

enc = enc.replace("-", "0").replace(".", "1") # Replace chars with binary values
for byte in wrap(enc, 8): # 8bit -> 1byte
    # str -> int (base 2) -> chr
    print(chr(int(byte, 2)), end='')
```

```sh
➜ py .\solve.py
bcactf{n0T_QU!t3_M0r5E_981454}
```