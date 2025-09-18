# Many Time Pad

## Description

I heard that one-time pads are unbreakable! I'm going to use it for everything!!

Static resources:
* [many-time-pad.py](https://storage.googleapis.com/bcactf/many-time-pad/many-time-pad.py)
* [many-time-pad.out](https://storage.googleapis.com/bcactf/many-time-pad/many-time-pad.out)
* [grocery-list.out](https://storage.googleapis.com/bcactf/many-time-pad/grocery-list.out)

## Solution

Given python code performs xor operation on bytes. <br> Since XOR is symetical encryption we can easily reverse it.

```py
from Crypto.Util.number import long_to_bytes, bytes_to_long

def encrypt(plaintext, key):
    return long_to_bytes(bytes_to_long(plaintext) ^ bytes_to_long(key))
 
groceries = b"I need to buy 15 eggs, 1.7 kiloliters of milk, 11000 candles, 12 cans of asbestos-free cereal, and 0.7 watermelons."
with open('./grocery-list.out',  'rb') as f: grocery_list = f.read()
with open('./many-time-pad.out', 'rb') as f: many_pads    = f.read()

key = encrypt(groceries, grocery_list)
flag = encrypt(many_pads, key)

print(flag.decode())
```

Flag: `bcactf{y3a_0nly_uS3_th3sE_1_tim3}`