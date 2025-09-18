# Stop Drop and Roll

## Description

The Fray: The Video Game is one of the greatest hits of the last... well, we don't remember quite how long. Our "computers" these days can't run much more than that, and it has a tendency to get repetitive...

## Solution

Challenge gives us netcat port:

```bash
➜ ncat 94.237.62.149 47495
===== THE FRAY: THE VIDEO GAME =====
Welcome!
This video game is very simple
You are a competitor in The Fray, running the GAUNTLET
I will give you one of three scenarios: GORGE, PHREAK or FIRE
You have to tell me if I need to STOP, DROP or ROLL
If I tell you there's a GORGE, you send back STOP
If I tell you there's a PHREAK, you send back DROP
If I tell you there's a FIRE, you send back ROLL
Sometimes, I will send back more than one! Like this:
GORGE, FIRE, PHREAK
In this case, you need to send back STOP-ROLL-DROP!
Are you ready? (y/n) y
Ok then! Let's go!
GORGE, PHREAK, GORGE
What do you do? exit
Unfortunate! You died!
```

We must respond to questions in given format, doing this by hand would take too much so need a script to automate process.

```py
from pwn import remote, context

IP = '94.237.62.149'
PORT = 47495
context.log_level = 'DEBUG'

io = remote(IP, PORT)

io.sendlineafter(b'(y/n) ', b'y')
io.recvline() # Ok then! Let's go!

answers = {
    'GORGE': 'STOP',
    'PHREAK': 'DROP',
    'FIRE': 'ROLL',
}

while True:
    prompt = io.recvline().decode().strip()
    answer = '-'.join(map(lambda q: answers[q], prompt.split(', ')))
    io.sendlineafter(b'? ', answer.encode())
```
::: tip Flag
`HTB{1_wiLl_sT0p_dR0p_4nD_r0Ll_mY_w4Y_oUt!}`
:::