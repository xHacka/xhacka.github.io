# Character

## Description

Security through Induced Boredom is a personal favourite approach of mine. Not as exciting as something like The Fray, but I love making it as tedious as possible to see my secrets, so you can only get one character at a time!

## Solution

Challenge gives us netcat port to connect to and by passing index we get part of flag:

```bash
➜ ncat 94.237.62.149 59156
Which character (index) of the flag do you want? Enter an index: 0
Character at Index 0: H
Which character (index) of the flag do you want? Enter an index: 1
Character at Index 1: T
Which character (index) of the flag do you want? Enter an index: 2
Character at Index 2: B
Which character (index) of the flag do you want? Enter an index:
```

Automate the process:

```py
from pwn import remote, context

IP = '94.237.62.149' 
PORT = 59156

context.log_level = 'WARNING'

io = remote(IP, PORT)
flag = ""

i = 0 
while True:
    io.sendlineafter(b'index: ', str(i).encode())
    char = io.recvline().decode().split(': ')[1].strip()
    flag += char
    print(flag)
    if char == '}': break
    i += 1
```
::: tip Flag
`HTB{tH15_1s_4_r3aLly_l0nG_fL4g_i_h0p3_f0r_y0Ur_s4k3_tH4t_y0U_sCr1pTEd_tH1s_oR_els3_iT_t0oK_qU1t3_l0ng!!}`
:::