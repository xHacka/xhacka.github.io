# Trios

## Description

crypto/trios (by Dread) | 439 points

what number is a trio?

Downloads: [trios.py](https://hsctf-10-resources.storage.googleapis.com/uploads/d7476fa8c0bff6df5bf4c7b5e8f904b3a494742e91812f90e87999c9185cb7d6/trios.py), [data.txt](https://hsctf-10-resources.storage.googleapis.com/uploads/b146449ba52a8c6b751004dd366540893b03ea6db98b13261c425a730998aa8c/data.txt)

## Analysis

We are given `data.txt` which seems to contain a flag (text between `{...}`). 

Python script creates `alphabet` of length 26, with each character being length of 3. Since text is large enough we can use [Frequency Analysis](https://www.101computing.net/frequency-analysis/) to decrypt the message. Using provided script to decode the encryption would be nearly impossible due to randomness.

## Solution

Using the `most_frequent` letters wasn't enough to decode the encryption, so I ended up manually guessing the text. `flag` was already known and using `freq` it was time to guess the letters. 

```py
import string
from textwrap import wrap
from collections import Counter

chars = list(string.ascii_letters + string.digits) # Simplify `chars` array
most_frequent = list('etaoinshrdlcumwfgypbvkjxqz') # Most frequent chars in english

data = '''
8wnAPR2svyje{RbcAPRRbczwtwDE2svphjIqr}. uZbphjRbc 4mL2sv8rv IqruZb BRzuZbAPRzr1Rbc 2svphj RbcphjoZYQHJ8rvzwtIqrRbcHu0 InbRbcBRzBRz2svyjeRbc, tKO8wn 4mLRbc JEzphjuZb4mL tKOIqrBRz APR2svphjyje4zD2svyjeRbc, tKOBRz IqruZb 8wntKOphjHu0 2sv Hu0tKO8wn8wnRbcQHJRbcphjIqr zwtAPR2svtKOphjIqrRbcGawIqr uZb8wn IqrwDERbc BRz2svInbRbc APR2svphjyje4zD2svyjeRbc APRuZbphjyje RbcphjuZb4zDyjewDE IqruZb 8wntKOAPRAPR uZbphjRbc BRzwDERbcRbcIqr uZbQHJ BRzuZb, 2svphjHu0 IqrwDERbcphj 4mLRbc oZYuZb4zDphjIqr IqrwDERbc uZboZYoZY4zDQHJQHJRbcphjoZYRbcBRz uZb8wn Rbc2svoZYwDE APRRbcIqrIqrRbcQHJ. IIqrBRz tKOAPRAPRRbcyje2svAPR IqruZb uZb4mLphj k7j4zDBRzIqr uZbphjRbc yje4zDtKOphjRbc2sv zwttKOyje tKOphj S4mLtKOIqr2stRbcQHJAPR2svphjHu0.
'''.strip()

# Extract only letters present in `chars`
data_chars = ''.join(c for c in data if c in chars) 

# Extract letters of length 3
encoded_chars = wrap(data_chars, 3) 

# Count frequency of encoded chars
# Map counter values to `most_frequent` chars
counter = Counter(encoded_chars) 
counter = dict(sorted(counter.items(), key=lambda k: k[1], reverse=True)) 

# Frequency table
freq = {key: char for key, char in zip(counter, most_frequent)} 

# Known Plaintext Attack
crib = {
    **freq, # Unpack Freqency
    "8wn": "f", 
    "APR": "l",
    "2sv": "a",
    "yje": "g",
    "uZb": "o",
    "Rbc": "e", 
    "phj": "n",
    "Iqr": "t",
    "QHJ": "r",
    "tKO": "i",
    "4mL": "w",
    "JEz": "k",
    "BRz": "s",
    "4zD": "u",
    "Hu0": "d",
    "zr1": "v",
    "oZY": "c",
    "8rv": "y",
    "zwt": "p",
    "Inb": "m",
    "Gaw": "x",
    "2st": "z",
    "wDE": "h",
    "k7j": "j",
}

for c in encoded_chars:
    # try: data = data.replace(c, f"<{crib[c]}>") # Debug
    try: data = data.replace(c, f"{crib[c]}")
    except: ...

for key in crib:
    data = data.replace(key, f"{crib[key]}") # Extra chars not replaced

print(data)
```

```
flag{REDACTED}. one way to solve an encrypted message, if we know its language, is to find a different plaintext of the same language long enough to fill one sheet or so, and then we count the occurrences of each letter. Its illegal to own just one guinea pig in Switzerland.
```