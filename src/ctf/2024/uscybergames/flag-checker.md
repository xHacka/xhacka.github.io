# Flag Checker

# Flag Checker

### Description

Flag Checker \[Reverse Engineering]

We found this cryptic Python script that validates the user's flag, but we're having trouble understanding the code. Can you find the correct flag that passes through the program?

&#x20;[pyrev.py](https://ctfd.uscybergames.com/files/71e420830af892b599f352becc087cf9/pyrev.py?token=eyJ1c2VyX2lkIjozMDg2LCJ0ZWFtX2lkIjpudWxsLCJmaWxlX2lkIjoyMzB9.Zl7L9Q.8-Iga16WqQDEG7tWcH5HVO68NtM)

### Solution

Clean up the script and decrypt:

```python
def enc(flag):
    if isinstance(flag, str): 
        flag = [(ord(c) - 27) ^ 15 for c in flag]
    else:
        flag = [(c - 27) ^ 15 for c in flag]

    return flag

def dec(flag):
    if isinstance(flag, str): 
        flag = [(ord(c) ^ 15) + 27 for c in flag]
    else:
        flag = [(c ^ 15) + 27 for c in flag]
        
    return flag

def swap(flag):
    a, b, c, d, e, f = 6, 17, 8, 10, 12, 9
    flag[a], flag[f] = flag[f], flag[a]
    flag[d], flag[c] = flag[c], flag[d]
    flag[b], flag[e] = flag[e], flag[b]
    return flag

def rev(flag):
    return flag[0: len(flag) // 2] + flag[len(flag) // 2: len(flag)][::-1]

def tostr(flag):
    return ''.join(map(chr, flag))


flag_enc = [55, 33, 52, 40, 35, 56, 86, 90, 66, 111, 81, 26, 23, 75, 109, 26, 88, 90, 75, 67, 92, 25, 87, 88, 92, 84, 23, 88]
flag = dec(flag_enc) # Step 1 
flag = rev(flag)     # Step 2
flag = swap(flag)    # Step 3
flag = tostr(flag)
print(flag)
```

Note: To reverse the encyption of the script actions must be done in backwards.

::: tip Flag
`**SIVBGR{pyth0n\_r3v3rs1ng\_pr0}**`
:::
