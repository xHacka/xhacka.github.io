# Sekur Julius

## Description

Hidden deep in the forest was an ancient scroll, rumored to grant immense power to anyone who could read its shifting symbols. On Halloween, a curious traveler found the scroll, its letters strangely out of order. As they deciphered the message, the words slowly rearranged themselves, revealing a dark spell. But with the final shift, the traveler felt a cold presence behind them, whispering, "You were never meant to understand." The forest grew silent, but the spell was already cast.

## Source

`source.py`
```python
from random import choices

def julius_encrypt(msg, shift):
    ct = ''
    for p in msg:
        if p == ' ':
            ct += '0'
        elif not ord('A') <= ord(p) <= ord('Z'):
            ct += p
        else:
            o = ord(p) - 65
            ct += chr(65 + (o + shift) % 26)
    return ct

def encrypt(msg, key):
    for shift in key:
        msg = julius_encrypt(msg, shift)
    return msg

msg = open('secret.txt').read().upper()
secure_key = os.urandom(1337)

with open('output.txt', 'w') as f:
    f.write(encrypt(msg, secure_key))
```

`output.txt`
```bash
LTARDBT0ID0WPRZIWTQDD0ILDIWDJHPCSILTCINUDJG!0IWXH0XH0P0EGDDU0DU0RDCRTEI0ID0EGDKT0NDJ0IWPI0IWT0RPTHPG0RXEWTG0XH0XCHTRJGT0CD0BPIITG0WDL0BPCN0IXBTH0NDJ0PEEAN0XI.0IWT0HTRJGXIN0DU0P0IWDJHPCS0SXHIXCRI0HWXUIH0XH0TKTCIJPAAN0IWT0HPBT0PH0IWPI0DU0P0HXCVAT0HWXUI.0TCDJVW0BJBQAXCV,0IPZT0NDJG0UAPV0PCS0TCYDN0IWT0GTHI0DU0IWT0RDCITHI.0BPZT0HJGT0NDJ0LGPE0IWT0UDAADLXCV0ITMI0LXIW0IWT0WIQ0UAPV0UDGBPI0HTRJGXINDUPIWDJHPCSDGHTRJGXINDUPHXCVAT.
```

## Solution

In substitution cipher the key length or reuse doesn't matter that much, cipher function keeps rotating cipher, so it will end up on plaintext with certain rotation. 1337 length is just overhead.

To reverse we can just bruteforce the rotation:
```python
def julius_decrypt(message, shift):
    ciphertext = ''
    for char in message:
        if char == '0': # Change space replacement
            ciphertext += ' '
        elif not ord('A') <= ord(char) <= ord('Z'):
            ciphertext += char
        else:
            char_n = ord(char) - 65
            ciphertext += chr(65 + (char_n + shift) % 26)
    
    return ciphertext

with open('output.txt') as f:
    ciphertext = f.read().upper()

for i in range(256):
    dec = julius_decrypt(ciphertext, i)
    if 'HTB' in dec:
        print(i, dec)
```

```bash
11 WELCOME TO HACKTHEBOO TWOTHOUSANDTWENTYFOUR! THIS IS A PROOF OF CONCEPT TO PROVE YOU THAT THE CAESAR CIPHER IS INSECURE NO MATTER HOW MANY TIMES YOU APPLY IT. THE SECURITY OF A THOUSAND DISTINCT SHIFTS IS EVENTUALLY THE SAME AS THAT OF A SINGLE SHIFT. ENOUGH MUMBLING, TAKE YOUR FLAG AND ENJOY THE REST OF THE CONTEST. MAKE SURE YOU WRAP THE FOLLOWING TEXT WITH THE HTB FLAG FORMAT SECURITYOFATHOUSANDORSECURITYOFASINGLE.
37 WELCOME TO HACKTHEBOO TWOTHOUSANDTWENTYFOUR! THIS IS A PROOF OF CONCEPT TO PROVE YOU THAT THE CAESAR CIPHER IS INSECURE NO MATTER HOW MANY TIMES YOU APPLY IT. THE SECURITY OF A THOUSAND DISTINCT SHIFTS IS EVENTUALLY THE SAME AS THAT OF A SINGLE SHIFT. ENOUGH MUMBLING, TAKE YOUR FLAG AND ENJOY THE REST OF THE CONTEST. MAKE SURE YOU WRAP THE FOLLOWING TEXT WITH THE HTB FLAG FORMAT SECURITYOFATHOUSANDORSECURITYOFASINGLE.
63 WELCOME TO HACKTHEBOO TWOTHOUSANDTWENTYFOUR! THIS IS A PROOF OF CONCEPT TO PROVE YOU THAT THE CAESAR CIPHER IS INSECURE NO MATTER HOW MANY TIMES YOU APPLY IT. THE SECURITY OF A THOUSAND DISTINCT SHIFTS IS EVENTUALLY THE SAME AS THAT OF A SINGLE SHIFT. ENOUGH MUMBLING, TAKE YOUR FLAG AND ENJOY THE REST OF THE CONTEST. MAKE SURE YOU WRAP THE FOLLOWING TEXT WITH THE HTB FLAG FORMAT SECURITYOFATHOUSANDORSECURITYOFASINGLE.
```

> Flag: `HTB{SECURITYOFATHOUSANDORSECURITYOFASINGLE}`