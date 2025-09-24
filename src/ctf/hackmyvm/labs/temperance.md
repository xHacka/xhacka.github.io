# Temperance

## Level 0

### Description

**Codename**: levelx00
**Mission**: On this mission you will receive an string and you should send the same string.
The code to solve this level in Python can be found [here.](https://downloads.hackmyvm.eu/levelx00.py)

**Example**: 
- HMV(Input): HMVLOVESYOU
- Hacker(Output): HMVLOVESYOU

### Solution

```python
└─$ curl https://downloads.hackmyvm.eu/levelx00.py
import socket
import base64

HOST = "temperance.hackmyvm.eu"
PORT = 9988

with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
    s.connect((HOST, PORT))

    # Connect to the host and receive the message / Conecta al host y recibes la intro general.
    print('Receiving Intro')
    data = s.recv(1024)
    print(data)

    # Send "levelx00" to choose the level / Envia levelx00 para elegir el nivel.
    s.send(b'levelx00')

    # Receive the challenge / Recibe el challenge.
    print('Receiving challenge.')
    data2 = s.recv(1024)
    print(data2)

    # Send the challenge solved / Envia el resultado del challenge.
    print('Envio reto')
    s.send(data2)

    # Receive the flag / Recibe la flag.
    print('Recibo flag')
    data3 = s.recv(1024)
    print(data3)
```

```bash
└─$ curl https://downloads.hackmyvm.eu/levelx00.py -s | py
Receiving Intro
b'\n[== HMVLabs Chapter 3: Temperance ==]\nRespect & Have fun!\n|https://hackmyvm.eu|\n\nLevel:\n'
Receiving challenge.
b'HMVLOVESYOU'
Envio reto
Recibo flag
b'Flag: HMV{hell0friendz}'
```

> Flag: `HMV{hell0friendz}`

## Level 1

### Description

**Codename**: levelx01
**Mission**: This mission is similar to the previous one, but adding a minimum of complexity :)
You will receive a string, you must return the same string and you will 
receive another string which you must also return.

**Example**: 
HMV(Input): ImString1!
Hacker(Output): ImString1!

HMV(Input): ImString2!
Hacker(Output): ImString2!

### Solution

Just add 1 more `send` to the original code and will return flag
```python
import socket
import logging

HOST, PORT = 'temperance.hackmyvm.eu', 9988
logging.basicConfig(
    format="[%(levelname)s] %(asctime)s: %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
    level=logging.INFO
)

with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as io:
    io.connect((HOST, PORT))

    data = io.recv(1024) # Welcome message
    io.send(b'levelx01')

    data = io.recv(1024)
    logging.info(data.decode())
    io.send(data)

    data = io.recv(1024)
    logging.info(data.decode())
    io.send(data)
    
    data = io.recv(1024)
    logging.info(data.decode())
```

```bash
[INFO] 2025-08-17 00:44:08: HMVTEACHING
[INFO] 2025-08-17 00:44:09: NOOBSKILLZ
[INFO] 2025-08-17 00:44:09: Flag: HMV{3ch03zlol}
```

> Flag: `HMV{3ch03zlol}`

## Level 2

### Description

**Codename**: levelx02
**Mission**: In this mission you will receive a string and you must return the same string but converted to uppercase.

**Example**: 
```
HMV(Input): wegomakeittrue
Hacker(Output): WEGOMAKEITTRUE
```

### Solution

```python
import socket
import logging

HOST, PORT = 'temperance.hackmyvm.eu', 9988
logging.basicConfig(format="[%(levelname)s] %(asctime)s: %(message)s", datefmt="%Y-%m-%d %H:%M:%S", level=logging.DEBUG)

with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as io:
    io.connect((HOST, PORT))

    data = io.recv(1024) # Welcome message
    io.send(b'levelx02')

    data = io.recv(1024)
    logging.info(data.decode())
    io.send(data.upper())
    
    data = io.recv(1024)
    logging.info(data.decode())
```

```bash
[INFO] 2025-08-17 00:47:16: ZvXew
[INFO] 2025-08-17 00:47:17: Flag: HMV{uPP3rc4z3z}
```

> Flag: `HMV{uPP3rc4z3z}`

## Level 3

### Description

**Codename**: levelx03
**Mission**: In this mission you will receive a string in base64, you must do the decode and return the result.

**Example**: 
```
HMV(Input): eW91bWFrZW1lY3J5Cg==
Hacker(Output): youmakemecry
```

### Solution

```python
import socket
import logging
from base64 import b64decode as bd

HOST, PORT = 'temperance.hackmyvm.eu', 9988
logging.basicConfig(format="[%(levelname)s] %(asctime)s: %(message)s", datefmt="%Y-%m-%d %H:%M:%S", level=logging.DEBUG)

with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as io:
    io.connect((HOST, PORT))

    data = io.recv(1024) # Welcome message
    io.send(b'levelx03')

    data = bd(io.recv(1024))
    logging.info(data.decode())
    io.send(data)
    
    data = io.recv(1024)
    logging.info(data.decode())
```

```bash
[INFO] 2025-08-17 00:50:16: xsXQHcfxBZoXtYTUItcpGQEij
[INFO] 2025-08-17 00:50:16: Flag: HMV{baz364WTF}
```

> Flag: `HMV{baz364WTF}`

## Level 4

### Description

**Codename**: levelx04
**Mission**: In this mission you will receive a string and you must return it in reverse.

**Example**: 
```
HMV(Input): crazycrazycrazycrazy
Hacker(Output): yzarcyzarcyzarcyzarc
```

### Solution

```python
import socket
import logging

HOST, PORT = 'temperance.hackmyvm.eu', 9988
logging.basicConfig(format="[%(levelname)s] %(asctime)s: %(message)s", datefmt="%Y-%m-%d %H:%M:%S", level=logging.DEBUG)

with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as io:
    io.connect((HOST, PORT))

    data = io.recv(1024) # Welcome message
    io.send(b'levelx04')

    data = io.recv(1024)
    logging.info(data.decode())
    io.send(data[::-1])
    
    data = io.recv(1024)
    logging.info(data.decode())
```

```bash
[INFO] 2025-08-17 00:51:47: cTIHHDWLNwYqFChjfDJJiQnmc
[INFO] 2025-08-17 00:51:47: Flag: HMV{r3vr3vr3v}
```

> Flag: `HMV{r3vr3vr3v}`

## Level 5

### Description

**Codename**: levelx05
**Mission**: In this mission you will receive a string and you must return the last 5 chars.

**Example**: 
```
HMV(Input): IDKWhyimdoingthisshit
Hacker(Output): sshit
```

### Solution

```python
import socket
import logging

HOST, PORT = 'temperance.hackmyvm.eu', 9988
logging.basicConfig(format="[%(levelname)s] %(asctime)s: %(message)s", datefmt="%Y-%m-%d %H:%M:%S", level=logging.DEBUG)

with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as io:
    io.connect((HOST, PORT))

    data = io.recv(1024) # Welcome message
    io.send(b'levelx05')

    data = io.recv(1024)
    logging.info(data.decode())
    io.send(data[-5:])
    
    data = io.recv(1024)
    logging.info(data.decode())
```

```bash
[INFO] 2025-08-17 00:53:32: zemLhLwLsHbwZjpMsCODdIHnj
[INFO] 2025-08-17 00:53:32: Flag: HMV{l4ztf1v3wh0t}
```

> Flag: `HMV{l4ztf1v3wh0t}`

## Level 6 

### Description

**Codename**: levelx06
**Mission**: In this mission you will receive a string and you must return its length. (as string, not as int).

**Example**: 
```
HMV(Input): hehehewhf
Hacker(Output): 9
```

### Solution

```python
import socket
import logging

HOST, PORT = 'temperance.hackmyvm.eu', 9988
logging.basicConfig(format="[%(levelname)s] %(asctime)s: %(message)s", datefmt="%Y-%m-%d %H:%M:%S", level=logging.DEBUG)

with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as io:
    io.connect((HOST, PORT))

    data = io.recv(1024) # Welcome message
    io.send(b'levelx06')

    data = io.recv(1024)
    logging.info(data.decode())
    io.send(str(len(data)).encode())
    
    data = io.recv(1024)
    logging.info(data.decode())
```

```bash
[INFO] 2025-08-17 00:55:44: PMHHxdTrlAYpBvxbHalcvNgYQikqbCYsrFXzKrAarlxKdWstBoGGfNeUhbWTNYsGqTbd
[INFO] 2025-08-17 00:55:44: Flag: HMV{idkl3ng7hzZz}
```

> Flag: `HMV{idkl3ng7hzZz}`

## Level 7

### Description

**Codename**: levelx07
**Mission**: In this mission you will receive a string in hexadecimal format, you must return it converted to ascii.

**Example**: 
```
HMV(Input): 68374d4c68434872315843476e384d4e49787258336a376979
Hacker(Output): h7MLhCHr1XCGn8MNIxrX3j7iy
````

### Solution

```python
import socket
import logging

HOST, PORT = 'temperance.hackmyvm.eu', 9988
logging.basicConfig(format="[%(levelname)s] %(asctime)s: %(message)s", datefmt="%Y-%m-%d %H:%M:%S", level=logging.DEBUG)

with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as io:
    io.connect((HOST, PORT))

    data = io.recv(1024) # Welcome message
    io.send(b'levelx07')

    data = io.recv(1024).decode()
    logging.info(f'Challenge: {data}')

    data = bytes.fromhex(data)
    logging.info(f'From hex: {data.decode()}')
    io.send(data)
    
    data = io.recv(1024)
    logging.info(data.decode())
```

```bash
[INFO] 2025-08-17 00:58:45: Challenge: 45514a58626e50466c734a4363574f4377434c65735a6f6452
[INFO] 2025-08-17 00:58:45: From hex: EQJXbnPFlsJCcWOCwCLesZodR
[INFO] 2025-08-17 00:58:45: Flag: HMV{zup3rh3x4haha}
```

> Flag: `HMV{zup3rh3x4haha}`

## Level 8

### Description

**Codename**: levelx08
**Mission**: In this mission you will receive 2 numbers, you must return the result of adding both.

**Example**: 
```
HMV(Input): 45 77
Hacker(Output): 122
```

### Solution

```python
import socket
import logging

HOST, PORT = 'temperance.hackmyvm.eu', 9988
logging.basicConfig(format="[%(levelname)s] %(asctime)s: %(message)s", datefmt="%Y-%m-%d %H:%M:%S", level=logging.DEBUG)

with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as io:
    io.connect((HOST, PORT))

    data = io.recv(1024) # Welcome message
    io.send(b'levelx08')

    data = io.recv(1024).decode()
    logging.info(f'Challenge: {data}')

    x, y = map(int, data.split())
    data = x + y
    logging.info(f'Result: {data}')
    io.send(str(data).encode())
    
    data = io.recv(1024)
    logging.info(data.decode())
```

```bash
[INFO] 2025-08-17 01:04:04: Challenge: 15 60
[INFO] 2025-08-17 01:04:04: Result: 75
[INFO] 2025-08-17 01:04:04: Flag: HMV{1l34rnzum}
```

> Flag: `HMV{1l34rnzum}`

## Level 9

### Description

**Codename**: levelx09
**Mission**: In this mission you will receive a string encrypted with ROT13, you must decode it and return the result.

**Example**: 
```
HMV(Input): ToaZRw5uyWrk4CaZ1tuKxYWR6
Hacker(Output): GbnMEj5hlJex4PnM1ghXkLJE6
```

### Solution

Not sure if intended or not, but expected results sometimes include \` and @ symbol. After few tries I got challenge without said symbols and got flag.
```python
import socket
import logging
import string

HOST, PORT = 'temperance.hackmyvm.eu', 9988
logging.basicConfig(format="[%(levelname)s] %(asctime)s: %(message)s", datefmt="%Y-%m-%d %H:%M:%S", level=logging.DEBUG)

ROT13 = str.maketrans(
    string.ascii_letters,
    string.ascii_lowercase[13:] + string.ascii_lowercase[:13] + string.ascii_uppercase[13:] + string.ascii_uppercase[:13]
)

with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as io:
    io.connect((HOST, PORT))

    data = io.recv(1024) # Welcome message
    io.send(b'levelx09')

    data = io.recv(1024).decode()
    logging.info(f'Challenge: {data}')

    data = data.translate(ROT13)
    logging.info(f'Result: {data}')
    io.send(str(data).encode())
    
    data = io.recv(1024)
    logging.info(data.decode())
```

```bash
[INFO] 2025-08-17 01:24:56: Challenge: XKiptxuCFRyYyGIIOulSSNEDK
[INFO] 2025-08-17 01:24:56: Result: KXvcgkhPSElLlTVVBhyFFARQX
[INFO] 2025-08-17 01:24:56: Flag: HMV{r0t13izmyfr1end}
```

> Flag: `HMV{r0t13izmyfr1end}`

## Level 10

### Description

**Codename**: levelx10
**Mission**: In this mission you will receive numbers separated by spaces, you must return them in order from 
smallest to largest and without separating them with spaces.

**Example**: 
```
HMV(Input): 80 37 67 41 31
Hacker(Output): 3137416780
```

### Solution

```python
import socket
import logging

HOST, PORT = 'temperance.hackmyvm.eu', 9988
logging.basicConfig(format="[%(levelname)s] %(asctime)s: %(message)s", datefmt="%Y-%m-%d %H:%M:%S", level=logging.DEBUG)


with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as io:
    io.connect((HOST, PORT))

    data = io.recv(1024) # Welcome message
    io.send(b'levelx10')

    data = io.recv(1024).decode()
    logging.info(f'Challenge: {data}')

    data = ''.join(map(str, sorted(map(int, data.split()))))
    logging.info(f'Result: {data}')
    io.send(str(data).encode())
    
    data = io.recv(1024)
    logging.info(data.decode())
```

```bash
[INFO] 2025-08-17 01:28:27: Challenge: 60 83 39 87 57
[INFO] 2025-08-17 01:28:27: Result: 3957608387
[INFO] 2025-08-17 01:28:27: Flag: HMV{1mthez0rt3r}
```

> Flag: `HMV{1mthez0rt3r}`

## Level 11

### Description

**Codename**: levelx11
**Mission**: In this mission you will receive a string in Morse code, you must decode it and return it.

**Example**: 
```
HMV(Input): .-- ...- .-. --.. -... --.. ... ..- ...-- .... ..--- -.- ...  .-- --... .-- .... ---.. -..- ..-. .... .. ----. .-. ....
Hacker(Output): WVRZBZSU3H2KSW7WH8XFHI9RH`
```

### Solution

[How to decode morse code in a more pythonic way](https://stackoverflow.com/questions/71099952/how-to-decode-morse-code-in-a-more-pythonic-way)

```python
import socket
import logging

HOST, PORT = 'temperance.hackmyvm.eu', 9988
logging.basicConfig(format="[%(levelname)s] %(asctime)s: %(message)s", datefmt="%Y-%m-%d %H:%M:%S", level=logging.DEBUG)

MORSE_CODE = {
    'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.',
    'F': '..-.', 'G': '--.', 'H': '....', 'I': '..', 'J': '.---',
    'K': '-.-', 'L': '.-..', 'M': '--', 'N': '-.', 'O': '---',
    'P': '.--.', 'Q': '--.-', 'R': '.-.', 'S': '...', 'T': '-',
    'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-', 'Y': '-.--',
    'Z': '--..',
    '0': '-----', '1': '.----', '2': '..---', '3': '...--', '4': '....-',
    '5': '.....', '6': '-....', '7': '--...', '8': '---..', '9': '----.',
    ' ': ' '
}
MORSE_CODE_REV = {v: k for k, v in MORSE_CODE.items()}

with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as io:
    io.connect((HOST, PORT))

    data = io.recv(1024) # Welcome message
    io.send(b'levelx11')

    data = io.recv(1024).decode()
    logging.info(f'Challenge: {data}')

    data = ''.join([MORSE_CODE_REV.get(char, '') for char in data.split() if char in MORSE_CODE_REV])
    logging.info(f'Result: {data}')
    io.send(str(data).encode())
    
    data = io.recv(1024)
    logging.info(data.decode())
```

```bash
[INFO] 2025-08-17 01:34:45: Challenge: -. -.. . .-. -- - .... ... -.-- -.-- ... .--- -.-. .-.. -..- --- .... .... .... - --- ..- .-. --.. .--.
[INFO] 2025-08-17 01:34:45: Result: NDERMTHSYYSJCLXOHHHTOURZP
[INFO] 2025-08-17 01:34:45: Flag: HMV{d0tz4ndashez}
```

> Flag: `HMV{d0tz4ndashez}`

## Level 12

### Description

**Codename**: levelx12
**Mission**: In this mission you receive a string and a number, you must return the string repeated n number of times.

**Example**: 
```
HMV(Input): JwSIK 17
Hacker(Output): JwSIKJwSIKJwSIKJwSIKJwSIKJwSIKJwSIKJwSIKJwSIKJwSIKJwSIKJwSIKJwSIKJwSIKJwSIKJwSIKJwSIK
```

### Solution

```python
import socket
import logging

HOST, PORT = 'temperance.hackmyvm.eu', 9988
logging.basicConfig(format="[%(levelname)s] %(asctime)s: %(message)s", datefmt="%Y-%m-%d %H:%M:%S", level=logging.DEBUG)

with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as io:
    io.connect((HOST, PORT))

    data = io.recv(1024) # Welcome message
    io.send(b'levelx12')

    data = io.recv(1024).decode()
    logging.info(f'Challenge: {data}')

    string, number = data.split()
    data = string * int(number)
    logging.info(f'Result: {data}')
    io.send(str(data).encode())
    
    data = io.recv(1024)
    logging.info(data.decode())
```

```bash
[INFO] 2025-08-17 01:37:36: Challenge: SCPIN 23
[INFO] 2025-08-17 01:37:36: Result: SCPINSCPINSCPINSCPINSCPINSCPINSCPINSCPINSCPINSCPINSCPINSCPINSCPINSCPINSCPINSCPINSCPINSCPINSCPINSCPINSCPINSCPINSCPIN
[INFO] 2025-08-17 01:37:36: Flag: HMV{ztr1ngc0nc4444t3nat3}
```

> Flag: `HMV{ztr1ngc0nc4444t3nat3}`

## Level 13

### Description

**Codename**: levelx13
**Mission**: In this mission you receive a list of strings, you must sort them alphabetically and return the last string in the list.
The characters "\[" and "\]" must be removed.

**Example**: 
```
HMV(Input): [QJIFc brxkaCWxRDNRMjMDNQBcYPi wpzZBxlRMrvchppNmZcsSsqnSxQd nWxEVnDjUIWObjfZ gfsqzTsgfYYVjx wDeVgobCvrlaM cLFTLXrpnmSYsVaaTDnVArG 
dRbEsX KenQzY ZhDilcASluwhjcHlOrrX nPVXUIZELLdcm RsSrmYVHvonLJnv]
Hacker(Output): wpzZBxlRMrvchppNmZcsSsqnSxQd
```

### Solution

```python
import socket
import logging

HOST, PORT = 'temperance.hackmyvm.eu', 9988
logging.basicConfig(format="[%(levelname)s] %(asctime)s: %(message)s", datefmt="%Y-%m-%d %H:%M:%S", level=logging.DEBUG)

with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as io:
    io.connect((HOST, PORT))

    data = io.recv(1024) # Welcome message
    io.send(b'levelx13')

    data = io.recv(1024).decode()
    logging.info(f'Challenge: {data}')

    data = sorted(data.strip('[]').split())[-1]
    logging.info(f'Result: {data}')
    io.send(str(data).encode())
    
    data = io.recv(1024)
    logging.info(data.decode())
```

```bash
[INFO] 2025-08-17 01:41:35: Challenge: [UkEcDIpfhLJESoDillr ggdrqedch jcTCGznCasSft kmtcgungciVgrZfYuYBJHGNANRp SJoOi eEUabGBXWz DMUqIkiduPWqHDvFhExTV jkhYDvqshPAjzFfncDgvGXZvFTGL ldIqqmUFMvpTm qHoTEypdNjeBnlMbIsvtNBRj aNiEvbftWFOOSwAGrIXy vpyLiIRYJadXdBRgMITVr]
[INFO] 2025-08-17 01:41:35: Result: vpyLiIRYJadXdBRgMITVr
[INFO] 2025-08-17 01:41:35: Flag: HMV{WTF1zthatl3vel}
```

> Flag: `HMV{WTF1zthatl3vel}`

## Level 14

### Description

**Codename**: levelx14
**Mission**: In this mission you receive a string and a character, you must return the number 
of times the character is repeated in the string.

**Example**: 
```
HMV(Input): Kd5vfizCyqgwN2HlEWq2ZOMkaZmar7rmyCl0ssGf078aJ5J3FJKvLzijiqSbsK8ChhLZ1AI3GVhWnYXixY7J4q7KqKSA8t
VYsQo0LHjjsGSyLHM9lwi8nVhQA7EUBFo1MJ2gPGo2Nywsz7qlq9C7cKC2xyTdVXVhciK6gMVgRdlOktkx5IMXcnHOSbsnagqDBM56CF87MBT2X
MvUAPRbiEuZsMSIFGpFcNYAPOGD04def3j6a15xCVosZ9wLJI5cAk07aUxULniLYzWjCk64ZDsvisGlG2wqIFpMwnMG24T52yHCQlwYYRNrTsLs
awZzcUfeutE00WRvcAPyRAYsJRXqaFX9m9teOIA1UqoZfLkRdur3pla6cJxYGl1hi1REClkarFwCFmOAflXN2BZL8mzzK9wixxsvqx7iCL5ky79
0pF74MRXt8t09z2zW20qJTLg2UiAvl1ZQ8uB7JhVojRFY4LdW8bS6rQQ4iQGJwyeAzkNaPzwlQIFLdgt9UhdXIstPo7TotSSG60g1ln9G6w1OPU
K951lrGrKmrCKEUvoGyL3HkToZtkywcL0eYyrW1BrkPTs95TvoUhLjp5Es3mqE x

Hacker(Output): 9
```

### Solution

```python
import socket
import logging

HOST, PORT = 'temperance.hackmyvm.eu', 9988
logging.basicConfig(format="[%(levelname)s] %(asctime)s: %(message)s", datefmt="%Y-%m-%d %H:%M:%S", level=logging.DEBUG)

with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as io:
    io.connect((HOST, PORT))

    data = io.recv(1024) # Welcome message
    io.send(b'levelx14')

    data = io.recv(1024).decode()
    logging.info(f'Challenge: {data}')

    string, character = data.split()
    data = string.count(character)
    logging.info(f'Result: {data}')
    io.send(str(data).encode())
    
    data = io.recv(1024)
    logging.info(data.decode())
```

```bash
[INFO] 2025-08-17 01:43:48: Challenge: TQZpvUSXKfpqYLnQwemxSLLBZtPRtaYVgmCjtafQEqtRTAaTXaplrbvCFsoAnzZQNKxgAeFvRPWSomYOrmoanAxJZLgRMNmBwsnKtZekYCVYjpctCWhbPoYUGfxyNBYYOCfArwojYrkRDGnclxBteNnZhuvsqDkVnUAkudVuCdCbBJLMXxPEzRpxPLPCZSBbXECiaBqfnwWAaMRytaKIlpSGwkAAGlbJkouuXfFwHIpBvaoBneEAYnEajNoDHxkPGxUGnfUOJQHbjfhXMLajxzojwDpvnDSSnpCXjCJRWqMyjwLxcNbgpAvMOfMAncNlWiTGyliJYVOcQUqSXlZcwKiIIdeYdjHsdvdZDaIDfDtbqreatSTTbcWfGQCiItIaceBfGSIejpZUrZreCmGjeCvmUwWwOJRwwcFbpeJNploHNfUOUTRKjqnLyykugMxoKxygMyNQzVsCyrlRfPQPcNTPuUZwUFDVSGAtPRGsCzprhUsWINpCFjxdfLbKyPQpgXJmubfPVQBCbgnXnIkLtzeOeZFbkAuQPqTLUwTFFqLnUXYoFMcvkDcYUrlESDsQWErqiFEePpBrwkxtTuqWimvU P
[INFO] 2025-08-17 01:43:48: Result: 15
[INFO] 2025-08-17 01:43:48: Flag: HMV{f1ndthec0rrectch4r}
```

> Flag: `HMV{f1ndthec0rrectch4r}`

## Level 15

### Description

**Codename**: levelx15
**Mission**: In this mission you receive a series of numbers, you must return what the next number in the series would be.

**Example**: 
```
HMV(Input): 59 140 221 302 383
Hacker(Output): 464
```

### Solution

```python
import socket
import logging

HOST, PORT = 'temperance.hackmyvm.eu', 9988
logging.basicConfig(format="[%(levelname)s] %(asctime)s: %(message)s", datefmt="%Y-%m-%d %H:%M:%S", level=logging.DEBUG)

with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as io:
    io.connect((HOST, PORT))

    data = io.recv(1024) # Welcome message
    io.send(b'levelx15')

    data = io.recv(1024).decode()
    logging.info(f'Challenge: {data}')

    sequence = list(map(int, data.split()))
    diffs = [sequence[i+1] - sequence[i] for i in range(len(sequence)-1)]
    if all(d == diffs[0] for d in diffs): # Arithmetic check
        data = sequence[-1] + diffs[0]
    else:
        print("Not a simple arithmetic sequence")
        data = -1

    logging.info(f'Result: {data}')
    io.send(str(data).encode())
    
    data = io.recv(1024)
    logging.info(data.decode())
```

```bash
[INFO] 2025-08-17 01:58:33: Challenge: 36 124 212 300 388
[INFO] 2025-08-17 01:58:33: Result: 476
[INFO] 2025-08-17 01:58:33: Flag: HMV{s3qu3nz3123}
```

> Flag: `HMV{s3qu3nz3123}`

## Level 16

### Description

**Codename**: levelx16
**Mission**: In this mission you receive a png encoded in base64, you must decode it and return 
the size in pixels of its width and height.

**Example**: 
```
HMV(Input): iVBORw0KGgoAAAANSUhEUgAAADQAAABeCAYAAABsFzfXAAAAfUlEQVR4nOzPAQkAMBBFobH+oa/G46MN/G+MUJ1QnVCdU
J1QnVCdUJ1QnVCdUJ1QnVCdUJ1QnVCdUJ1QnVCdUJ1QnVCdUJ1QnVCdUJ1QnVCdUJ1QnVCdUJ1QnVCdUJ1QnVCdUJ1QnVCdUJ1QnVCdUJ1QnVC
dUN1c6AIAAP//yOQAvaQI2KYAAAAASUVORK5CYII=

Hacker(Output): 52x94`
```

### Solution

[https://en.wikipedia.org/wiki/PNG#Critical_chunks](https://en.wikipedia.org/wiki/PNG#Critical_chunks)

```python
import socket
import logging
from base64 import b64decode as bd

HOST, PORT = 'temperance.hackmyvm.eu', 9988
logging.basicConfig(format="[%(levelname)s] %(asctime)s: %(message)s", datefmt="%Y-%m-%d %H:%M:%S", level=logging.DEBUG)

with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as io:
    io.connect((HOST, PORT))

    data = io.recv(1024) # Welcome message
    io.send(b'levelx16')

    data = io.recv(1024).decode()
    logging.info(f'Challenge: {data}')

    png = bd(data + '==') # Fix padding
    width = int.from_bytes(png[16:20], 'big')
    height = int.from_bytes(png[20:24], 'big')
    data = f'{width}x{height}'
    logging.info(f'Result: {data}')
    io.send(str(data).encode())
    
    data = io.recv(1024)
    logging.info(data.decode())
```

```bash
[INFO] 2025-08-17 02:08:25: Challenge: iVBORw0KGgoAAAANSUhEUgAAAA0AAAA9CAYAAAB2kePRAAAAKUlEQVR4nOzLMQ0AAAwCsGX+ReOBhK/9+1eQJEmSJEmSJElapAQAAP//G8wAexNOXMwAAAAASUVORK5CYII=
[INFO] 2025-08-17 02:08:25: Result: 13x61
[INFO] 2025-08-17 02:08:25: Flag: HMV{p4int3rPNGfile}
```

> Flag: `HMV{p4int3rPNGfile}`

## Level 17

### Description

**Codename**: levelx17
**Mission**: In this mission you receive a 1 pixel png encoded in base64, you must decode it and return the last RGBA value.

**Example**: 
```
HMV(Input): iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAEUlEQVR4nGI6OPmFIiAAAP//Br0CYI/JSpAAAAAASUVORK5CYII=

Hacker(Output): 33
````

### Solution

I could have used Pillow to make life easier, but I decided to parse out the pixels manually.

Good resource: [Writing a (simple) PNG decoder might be easier than you think](https://pyokagan.name/blog/2019-10-14-png)

Unpack was kind of odd to understand, so here's a small breakdown:
`struct.unpack(fmt, bytes)` takes raw bytes and interprets them as binary data.
- `'>I4s'` means:
    - `>` = big-endian (network byte order)
    - `I` = 4-byte unsigned int
    - `4s` = 4-byte string (exactly 4 characters)

```python
chunk_length, chunk_type = struct.unpack('>I4s', f.read(8))
```

reads:
- First 4 bytes = integer (the length of the chunk’s data)
- Next 4 bytes = ASCII chunk type (`b'IHDR'`, `b'IDAT'`, etc.)

```python
import socket
import logging
from base64 import b64decode as bd
import struct
import zlib

HOST, PORT = 'temperance.hackmyvm.eu', 9988
logging.basicConfig(format="[%(levelname)s] %(asctime)s: %(message)s", datefmt="%Y-%m-%d %H:%M:%S", level=logging.DEBUG)


def read_chunks(data: bytes):
    position = 8  # skip PNG signature
    chunks = []
    while position < len(data):
        # Read length (4 bytes) + type (4 bytes)
        length, ctype = struct.unpack(">I4s", data[position:position+8])
        position += 8

        # Read chunk data
        chunk_data = data[position:position+length]
        position += length

        # Read CRC
        expected_crc, = struct.unpack(">I", data[position:position+4])
        position += 4

        # calculate actual CRC
        actual_crc = zlib.crc32(chunk_data, zlib.crc32(ctype))
        if expected_crc != actual_crc:
            raise Exception(f"CRC mismatch in {ctype}")

        chunks.append((ctype, chunk_data))
        if ctype == b"IEND":
            break

    return chunks


def paeth_predictor(a, b, c):
    p = a + b - c
    pa, pb, pc = abs(p-a), abs(p-b), abs(p-c)
    if pa <= pb and pa <= pc:
        return a
    elif pb <= pc:
        return b
    else:
        return c


def unfilter_scanlines(idat, width, height, bpp):
    stride = width * bpp
    pixels = []
    i = 0
    prev = b"\x00" * stride
    for _ in range(height):
        filter_type = idat[i]
        i += 1
        scan = bytearray(idat[i:i+stride])
        i += stride

        if filter_type == 1:    # Sub
            for x in range(bpp, stride):
                scan[x] = (scan[x] + scan[x-bpp]) & 0xff
        elif filter_type == 2:  # Up
            for x in range(stride):
                scan[x] = (scan[x] + prev[x]) & 0xff
        elif filter_type == 3:  # Average
            for x in range(stride):
                left = scan[x-bpp] if x >= bpp else 0
                up = prev[x]
                scan[x] = (scan[x] + ((left+up)//2)) & 0xff
        elif filter_type == 4:  # Paeth
            for x in range(stride):
                left = scan[x-bpp] if x >= bpp else 0
                up = prev[x]
                up_left = prev[x-bpp] if x >= bpp else 0
                scan[x] = (scan[x] + paeth_predictor(left, up, up_left)) & 0xff

        pixels.append(bytes(scan))
        prev = scan
    return b"".join(pixels)


with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as io:
    io.connect((HOST, PORT))

    data = io.recv(1024)  # Welcome message
    io.send(b'levelx17')

    data = io.recv(1024).decode()
    logging.info(f'Challenge: {data}')

    png = bd(data + '==')  # Fix padding
    png_chunks = read_chunks(png)
    width, height, bit_depth, color_type, compression, filter_, interlace = struct.unpack(">IIBBBBB", png_chunks[0][1])
    bytes_per_pixel = 4  # Assuming RGBA format
    idat = zlib.decompress(png_chunks[1][1])  # Decode IDAT chunk
    pixel_bytes = unfilter_scanlines(idat, width, height, bytes_per_pixel)
    pixels = [tuple(pixel_bytes[i:i+4]) for i in range(0, len(pixel_bytes), 4)]
    data = pixels[-1][-1] # Send very last RGBA value

    logging.info(f'Result: {data}')
    io.send(str(data).encode())

    data = io.recv(1024)
    logging.info(data.decode())
```

```bash
[INFO] 2025-08-19 16:41:16: Challenge: iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAEUlEQVR4nGISKQr3AQQAAP//Aq8BLDLIUboAAAAASUVORK5CYII=
[INFO] 2025-08-19 16:41:16: Result: 76
[INFO] 2025-08-19 16:41:16: Flag: HMV{RGBAsteg0u}
```

> Flag: `HMV{RGBAsteg0u}`

## Level 18

### Description

**Codename**: levelx18
**Mission**: In this mission you receive a string and you must return the string converted to binary.

**Example**: 
```
HMV(Input): gEmcaIqBNT1z7ikGg1y0RlWZ4ApGvzmOrMBNtHQuycspIMoWDk

Hacker(Output): 0110011101000101011011010110001101100001010010010111000101000010010011100101010000
110001011110100011011101101001011010110100011101100111001100010111100100110000010100100110110001010
111010110100011010001000001011100000100011101110110011110100110110101001111011100100100110101000010
010011100111010001001000010100010111010101111001011000110111001101110000010010010100110101101111010
101110100010001101011
```

### Solution

```python
import socket
import logging

HOST, PORT = 'temperance.hackmyvm.eu', 9988
logging.basicConfig(format='[%(levelname)s] %(asctime)s: %(message)s', datefmt='%Y-%m-%d %H:%M:%S', level=logging.DEBUG)

def int_to_bin(n, length=8):
    bits = []
    while n > 0:
        bits.append(str(n % 2))  # remainder (0 or 1)
        n //= 2                  # divide by 2
        
    return ''.join(reversed(bits)).zfill(length)


with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as io:
    io.connect((HOST, PORT))

    data = io.recv(1024)  # Welcome message
    io.send(b'levelx18')

    data = io.recv(1024)
    logging.info(f'Challenge: {data.decode()}')

	### One of following methods will work
    # data = ''.join([(int_to_bin(c)) for c in data])
    # data = ''.join([format(c, '08b') for c in data])
    data = ''.join([f'{c:08b}' for c in data])
    logging.info(f'Result: {data}')
    io.send(str(data).encode())

    data = io.recv(1024)
    logging.info(data.decode())
```

```bash
[INFO] 2025-08-19 16:57:19: Challenge: rXcfnRlKbmOOMOKKvrPapcgoRxCjNtJfMOcFTCcCWpeEHybfaV
[INFO] 2025-08-19 16:57:19: Result: 0111001001011000011000110110011001101110010100100110110001001011011000100110110101001111010011110100110101001111010010110100101101110110011100100101000001100001011100000110001101100111011011110101001001111000010000110110101001001110011101000100101001100110010011010100111101100011010001100101010001000011011000110100001101010111011100000110010101000101010010000111100101100010011001100110000101010110
[INFO] 2025-08-19 16:57:19: Flag: HMV{0n3sandz3r0esuhm}
```

> Flag: `HMV{0n3sandz3r0esuhm}`

## Level 19

### Description

**Codename**: levelx19
**Mission**: In this mission you will receive a zip file encoded in base64, the zip file contains a .txt file 
which contains a string inside. You should return the string inside the .txt file.

**Example**: 
```
HMV(Input): UEsDBBQACAAIAAAAAAAAAAAAAAAAAAAAAAAHAAAASE1WLnR4dKpMCg7NTk5yC6+qCnANyckzt0j1Mwp2KgpK9
kg1yw4K8TLNdPPPzjExqKzMyQlNLTfLAgQAAP//UEsHCMc6NsY4AAAAMgAAAFBLAQIUABQACAAIAAAAAADHOjbGOAAAADIAAAAHAAA
AAAAAAAAAAAAAAAAAAABITVYudHh0UEsFBgAAAAABAAEANQAAAG0AAAAAAA==

Hacker(Output): ybSUkcbFWzzPETln78eN2SBrRcHe6kRTJ5iFOkl40yyllUew6j
```

### Solution

```python
import socket
import logging
from zipfile import ZipFile
from io import BytesIO
from base64 import b64decode as bd

HOST, PORT = 'temperance.hackmyvm.eu', 9988
logging.basicConfig(format='[%(levelname)s] %(asctime)s: %(message)s', datefmt='%Y-%m-%d %H:%M:%S', level=logging.DEBUG)

with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as io:
    io.connect((HOST, PORT))

    data = io.recv(1024)  # Welcome message
    io.send(b'levelx19')

    data = io.recv(1024).decode()
    logging.info(f'Challenge: {data}')

    data = BytesIO(bd(data))
    with ZipFile(data) as zf:
        for name in zf.namelist():
            logging.info(f'Extracting: {name}')
            if name.endswith('.txt'):
                with zf.open(name) as f:
                    content = f.read()
                    logging.info(f'Content of {name}: {content.decode()}')
                    io.send(content)

    data = io.recv(1024)
    logging.info(data.decode())
```

```bash
[INFO] 2025-08-19 17:06:58: Challenge: UEsDBBQACAAIAAAAAAAAAAAAAAAAAAAAAAAHAAAASE1WLnR4dPJ38nUuynMvTk4PjEhzLnAudnL1TXHPSc1NCctxcysIcHcJ8MqOcMrPD0ny8Uz1z6hwBQQAAP//UEsHCI7er004AAAAMgAAAFBLAQIUABQACAAIAAAAAACO3q9NOAAAADIAAAAHAAAAAAAAAAAAAAAAAAAAAABITVYudHh0UEsFBgAAAAABAAEANQAAAG0AAAAAAA==
[INFO] 2025-08-19 17:06:58: Extracting: HMV.txt
[INFO] 2025-08-19 17:06:58: Content of HMV.txt: OBMCrnGscgQXfCpCsBEMdGlemdVlFFpPGDPJkXBooTbLIeOhxE
[INFO] 2025-08-19 17:06:58: Flag: HMV{z1pandtxtar3h3r3}
```

> Flag: `HMV{z1pandtxtar3h3r3}`

## Level 20

### Description

**Codename**: levelx20
**Mission**: In this mission you receive some of the first 50 words from the Rockyou dictionary in MD5.
You must send which word the md5 corresponds to.

**Example**: 
```
HMV(Input): f25a2fc72690b780b2a14e140ef6a9e0

Hacker(Output): iloveyou
```

### Solution

```python
from hashlib import md5
from pathlib import Path
import logging
import requests
import socket
import tempfile

HOST, PORT = 'temperance.hackmyvm.eu', 9988
logging.basicConfig(format='[%(levelname)s] %(asctime)s: %(message)s', datefmt='%Y-%m-%d %H:%M:%S', level=logging.DEBUG)
logging.getLogger('requests').setLevel(logging.CRITICAL)
logging.getLogger("urllib3").setLevel(logging.CRITICAL)

ROCKYOU = 'https://github.com/brannondorsey/naive-hashcat/releases/download/data/rockyou.txt'
ROCKYOU_50 = Path(tempfile.gettempdir()) / 'rockyou_50.txt'

if ROCKYOU_50.exists():
    logging.info(f'Using cached rockyou file: {ROCKYOU_50}')
    with ROCKYOU_50.open("rb") as f:
        passwords = f.readlines()
else:
    logging.info(f"Downloading rockyou's first 50 words from {ROCKYOU}")
    passwords = []
    with requests.get(ROCKYOU, stream=True) as resp:
        for chunk in resp.iter_content(chunk_size=1024):
            for password in chunk.splitlines():
                if password:
                    passwords.append(password)
                    if len(passwords) >= 50:
                        break
            if len(passwords) >= 50:
                break

    with ROCKYOU_50.open("wb") as f:
        f.writelines(passwords)

with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as io:
    io.connect((HOST, PORT))

    data = io.recv(1024)  # Welcome message
    io.send(b'levelx20')

    data = io.recv(1024).decode()
    logging.info(f'Challenge: {data}')

    for password in passwords:
        password = password.strip()
        password_hash = md5(password).hexdigest()
        logging.debug(f'Trying password: {password.decode():<10} with hash: {password_hash}')
        if password_hash == data:
            logging.info(f'Found password: {password.decode()}')
            io.send(password)
            break

    data = io.recv(1024)
    logging.info(data.decode())
```

```bash
[INFO] 2025-08-19 17:32:00: Downloading rockyous first 50 words from https://github.com/brannondorsey/naive-hashcat/releases/download/data/rockyou.txt
[INFO] 2025-08-19 17:32:58: Challenge: 0acf4539a14b3aa27deeb4cbdf6e989f
[DEBUG] 2025-08-19 17:32:58: Trying password: 123456     with hash: e10adc3949ba59abbe56e057f20f883e
[DEBUG] 2025-08-19 17:32:58: Trying password: 12345      with hash: 827ccb0eea8a706c4c34a16891f84e7b
[DEBUG] 2025-08-19 17:32:58: Trying password: 123456789  with hash: 25f9e794323b453885f5181f1b624d0b
[DEBUG] 2025-08-19 17:32:58: Trying password: password   with hash: 5f4dcc3b5aa765d61d8327deb882cf99
[DEBUG] 2025-08-19 17:32:58: Trying password: iloveyou   with hash: f25a2fc72690b780b2a14e140ef6a9e0
[DEBUG] 2025-08-19 17:32:58: Trying password: princess   with hash: 8afa847f50a716e64932d995c8e7435a
[DEBUG] 2025-08-19 17:32:58: Trying password: 1234567    with hash: fcea920f7412b5da7be0cf42b8c93759
[DEBUG] 2025-08-19 17:32:58: Trying password: rockyou    with hash: f806fc5a2a0d5ba2471600758452799c
[DEBUG] 2025-08-19 17:32:58: Trying password: 12345678   with hash: 25d55ad283aa400af464c76d713c07ad
[DEBUG] 2025-08-19 17:32:58: Trying password: abc123     with hash: e99a18c428cb38d5f260853678922e03
[DEBUG] 2025-08-19 17:32:58: Trying password: nicole     with hash: fc63f87c08d505264caba37514cd0cfd
[DEBUG] 2025-08-19 17:32:58: Trying password: daniel     with hash: aa47f8215c6f30a0dcdb2a36a9f4168e
[DEBUG] 2025-08-19 17:32:58: Trying password: babygirl   with hash: 67881381dbc68d4761230131ae0008f7
[DEBUG] 2025-08-19 17:32:58: Trying password: monkey     with hash: d0763edaa9d9bd2a9516280e9044d885
[DEBUG] 2025-08-19 17:32:58: Trying password: lovely     with hash: 061fba5bdfc076bb7362616668de87c8
[DEBUG] 2025-08-19 17:32:58: Trying password: jessica    with hash: aae039d6aa239cfc121357a825210fa3
[DEBUG] 2025-08-19 17:32:58: Trying password: 654321     with hash: c33367701511b4f6020ec61ded352059
[DEBUG] 2025-08-19 17:32:58: Trying password: michael    with hash: 0acf4539a14b3aa27deeb4cbdf6e989f
[INFO] 2025-08-19 17:32:58: Found password: michael
[INFO] 2025-08-19 17:32:59: Flag: HMV{r0ckur0ckme}
```

> Flag: `HMV{r0ckur0ckme}`

## Level 21

### Description

**Codename**: levelx21
**Mission**: In this mission you will receive a number and you must return what amount of KB that number corresponds to.

**Example**: 
```
HMV(Input): 52321

Hacker(Output): 51.09KB
```
### Solution

```python
import logging
import socket

HOST, PORT = 'temperance.hackmyvm.eu', 9988
logging.basicConfig(format='[%(levelname)s] %(asctime)s: %(message)s', datefmt='%Y-%m-%d %H:%M:%S', level=logging.DEBUG)

with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as io:
    io.connect((HOST, PORT))

    data = io.recv(1024)  # Welcome message
    io.send(b'levelx21')

    data = io.recv(1024).decode()
    logging.info(f'Challenge: {data}')

    data = format(int(data) / 1024, '.2f') + 'KB'
    logging.info(f'Result: {data}')
    io.send(str(data).encode())

    data = io.recv(1024)
    logging.info(data.decode())
```

```bash
[INFO] 2025-08-19 17:50:00: Challenge: 84700
[INFO] 2025-08-19 17:50:00: Result: 82.71KB
[INFO] 2025-08-19 17:50:01: Flag: HMV{k1l0b33tz}
```

> Flag: `HMV{k1l0b33tz}`

## Level 22

### Description

**Codename**: levelx22
**Mission**: In this mission you will receive a list of decimal numbers, you must return them converted into their value to ASCII.

**Example**: 
```
HMV(Input): 56 116 110 76 90 70 119 49 103 66

Hacker(Output): 8tnLZFw1gB
```

### Solution

```python
import logging
import socket

HOST, PORT = 'temperance.hackmyvm.eu', 9988
logging.basicConfig(format='[%(levelname)s] %(asctime)s: %(message)s', datefmt='%Y-%m-%d %H:%M:%S', level=logging.DEBUG)

with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as io:
    io.connect((HOST, PORT))

    data = io.recv(1024)  # Welcome message
    io.send(b'levelx22')

    data = io.recv(1024).decode()
    logging.info(f'Challenge: {data}')

    data = ''.join([chr(int(i)) for i in data.split()])
    logging.info(f'Result: {data}')
    io.send(str(data).encode())

    data = io.recv(1024)
    logging.info(data.decode())
```

```bash
[INFO] 2025-08-19 17:52:39: Challenge: 111 109 104 99 83 67 82 75 69 122
[INFO] 2025-08-19 17:52:39: Result: omhcSCRKEz
[INFO] 2025-08-19 17:52:39: Flag: HMV{4sc111sg00d}
```

> Flag: `HMV{4sc111sg00d}`

## Level 23

### Description

**Codename**: levelx23
**Mission**: In this mission you will receive a 5x1 pixel png encoded in base64, you must read the last RGBA 
value of each pixel, convert it to ascii and return the result.

**Example**: 
```
HMV(Input): iVBORw0KGgoAAAANSUhEUgAAAAUAAAABCAYAAAAW/mTzAAAAIklEQVR4nGJpk+BMd+Jkvbf
n02/lr5f+c1U+5TwOCAAA//9bkgoL6P+/xQAAAABJRU5ErkJggg==

Hacker(Output): gEhr9
```

### Solution

Update the source code of Level 17:
```python
...
    pixels = [tuple(pixel_bytes[i:i+4]) for i in range(0, len(pixel_bytes), 4)]
    logging.debug(f'Image size: {width}x{height}, Pixels: {len(pixels)}')
    logging.debug(f'Pixels: {pixels}...')
    data = ''.join(chr(pixel[-1]) for pixel in pixels) # Cocnat rgbA values
...
```

```bash
[INFO] 2025-08-19 17:58:52: Challenge: iVBORw0KGgoAAAANSUhEUgAAAAUAAAABCAYAAAAW/mTzAAAAIklEQVR4nGL5cOtuoL6I6M/s/XtlnOXkPrIxMf8HBAAA//9pNgjLLSrHIQAAAABJRU5ErkJggg==
[DEBUG] 2025-08-19 17:58:52: Image size: 5x1, Pixels: 5
[DEBUG] 2025-08-19 17:58:52: Pixels: [(240, 218, 221, 81), (31, 238, 242, 74), (138, 173, 175, 102), (205, 203, 205, 87), (211, 205, 208, 86)]...
[INFO] 2025-08-19 17:58:52: Result: QJfWV
[INFO] 2025-08-19 17:58:52: Flag: HMV{n00bzt3g0}
```

> Flag: `HMV{n00bzt3g0}`

## Level 24

### Description

**Codename**: levelx24
**Mission**: In this mission you will receive a URL which you must visit, you must return the string found on the web.

**Example**: 
```
HMV(Input): http://temperance.hackmyvm.eu:8090/uwu/3312

Hacker(Output): 4441514
```

### Solution

```python
import socket
import logging
import requests

HOST, PORT = 'temperance.hackmyvm.eu', 9988
logging.basicConfig(format="[%(levelname)s] %(asctime)s: %(message)s", datefmt="%Y-%m-%d %H:%M:%S", level=logging.DEBUG)

with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as io:
    io.connect((HOST, PORT))

    data = io.recv(1024)  # Welcome message
    io.send(b'levelx24')

    url = io.recv(1024).decode()
    logging.info(f'Challenge: {url}')

    resp = requests.get(url).text
    logging.info(f'Result: {resp}')
    io.send(str(resp).encode())

    data = io.recv(1024)
    logging.info(data.decode())
```

```bash
[INFO] 2025-08-19 18:04:54: Challenge: http://temperance.hackmyvm.eu:8090/uwu/8890
[DEBUG] 2025-08-19 18:04:54: Starting new HTTP connection (1): temperance.hackmyvm.eu:8090
[DEBUG] 2025-08-19 18:04:54: http://temperance.hackmyvm.eu:8090 "GET /uwu/8890 HTTP/1.1" 301 45
[DEBUG] 2025-08-19 18:04:54: http://temperance.hackmyvm.eu:8090 "GET /uwu/8890/ HTTP/1.1" 200 8
[INFO] 2025-08-19 18:04:54: Result: 11899300
[INFO] 2025-08-19 18:04:54: Flag: HMV{1nt3rn3tw0w}
```

> Flag: `HMV{1nt3rn3tw0w}`

## Level 25

### Description

**Codename**: levelx25
**Mission**: In this mission you will receive a URL which you must visit, you must return 
the value found in a header (HMV-Header).

**Example**: 
```
HMV(Input): http://temperance.hackmyvm.eu:8090/head/673

Hacker(Output): 917182
```

### Solution

```python
import socket
import logging
import requests

HOST, PORT = 'temperance.hackmyvm.eu', 9988
logging.basicConfig(format="[%(levelname)s] %(asctime)s: %(message)s", datefmt="%Y-%m-%d %H:%M:%S", level=logging.DEBUG)

with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as io:
    io.connect((HOST, PORT))

    data = io.recv(1024)  # Welcome message
    io.send(b'levelx25')

    url = io.recv(1024).decode()
    logging.info(f'Challenge: {url}')

    resp = requests.get(url)
    logging.debug(f'Headers: {resp.headers}')
    data = resp.headers['Hmv-Code']
    logging.info(f'Result: {data}')
    io.send(str(data).encode())

    data = io.recv(1024)
    logging.info(data.decode())
```

```bash
[INFO] 2025-08-19 18:07:49: Challenge: http://temperance.hackmyvm.eu:8090/head/397
[DEBUG] 2025-08-19 18:07:49: Starting new HTTP connection (1): temperance.hackmyvm.eu:8090
[DEBUG] 2025-08-19 18:07:49: http://temperance.hackmyvm.eu:8090 "GET /head/397 HTTP/1.1" 301 45
[DEBUG] 2025-08-19 18:07:49: http://temperance.hackmyvm.eu:8090 "GET /head/397/ HTTP/1.1" 200 3
[DEBUG] 2025-08-19 18:07:49: Headers: {'Hmv-Code': '548170', 'Date': 'Tue, 19 Aug 2025 14:07:48 GMT', 'Content-Length': '3', 'Content-Type': 'text/plain; charset=utf-8'}
[INFO] 2025-08-19 18:07:49: Result: 548170
[INFO] 2025-08-19 18:07:49: Flag: HMV{h3ad3rc0ntr0l}
```

> Flag: `HMV{h3ad3rc0ntr0l}`

## Level 26

### Description

**Codename**: levelx26
**Mission**: In this mission you will receive a png encoded in base64, you must decode it and send the number found in the image.

**Example**: 
```
HMV(Input): iVBORw0KGgoAAAANSUhEUgAAAJYAAAAyCAYAAAC+jCIaAAABL0lEQVR4nOzYQU6zQBiA4fbPfxWX3v8gL
j1MTRcmhBQ6VN5azPNs1BkzkvAGv/LvBAFhkRAWCWGREBYJYZEQFglhkRAWCWGREBYJYZEQFglhkRAWCWGREBYJYZEQFglhkRA
Wif97H3h5f7vcWj9/fJ7nvzNd27K3dN6WvZHr5MVNb+LS91v27q1/r63tjZ7Fi1qL5TQYwdYYHglLVPtKZ6zrzXr2v5ZHnki/c
Z1/3e4zVunWjHX9Ol+fzmlLe7SysPZ+CszPm/689nfuXYOnVeMwrxvcfIbnnNFPhXsN4aOfNPm5p89Y8xloZO/WbLT0rmp+5to
ecDCHmbE4FmGREBYJYZEQFglhkRAWCWGREBYJYZEQFglhkRAWCWGREBYJYZEQFglhkRAWia8AAAD//6oWtSXo+kn1AAAAAElFTkSuQmCC

Hacker(Output): 7006997
```

### Solution

Install Tesseract: [https://stackoverflow.com/questions/50951955/pytesseract-tesseractnotfound-error-tesseract-is-not-installed-or-its-not-i](https://stackoverflow.com/questions/50951955/pytesseract-tesseractnotfound-error-tesseract-is-not-installed-or-its-not-i)

```python
import socket
import logging
import pytesseract
from PIL import Image
from base64 import b64decode as bd
from io import BytesIO

HOST, PORT = 'temperance.hackmyvm.eu', 9988
logging.basicConfig(format="[%(levelname)s] %(asctime)s: %(message)s", datefmt="%Y-%m-%d %H:%M:%S", level=logging.DEBUG)

with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as io:
    io.connect((HOST, PORT))

    data = io.recv(1024)  # Welcome message
    io.send(b'levelx26')

    data = io.recv(1024).decode() + '=='
    logging.info(f'Challenge: {data}')

    img = Image.open(BytesIO(bd(data)))
    data = pytesseract.image_to_string(img)
    logging.info(f'Result: {data}')
    io.send(str(data).encode())

    data = io.recv(1024)
    logging.info(data.decode())
```

```bash
[INFO] 2025-08-19 18:42:31: Challenge: iVBORw0KGgoAAAANSUhEUgAAAJYAAAAyCAYAAAC+jCIaAAABRUlEQVR4nOzYTU6DQABAYWu8ikvvfxCXHqamiyYNGf5qX8X4fRsNQwcSHjDh9QUCwiIhLBLCIiEsEsIiISwSwiIhLBLCIiEsEsIiISwSwiIhLBLCIiEsEsIiISwSwiIhLBJv1cTnj/fz9f/T59dptH3r2HT72vjtnHPnsjYnBzR30Ubbr9uWxpbmWvvd0hx7jsc+D38VXi5OfddvPcaec3nGef8nh11jLT31bgN4RAyierynrrEuf+fWQ9Ox0b5bj7tljTUdE9fBXS7QNIifrqO27jvaf+8cc2Pskzyxnn3nLz1tPIV+x6HXWNNPEaNI7n2FeTq1krv5nm9V07HRWmgurNE5bPnGtfb9CziYw74K+duERUJYJIRFQlgkhEVCWCSERUJYJIRFQlgkhEVCWCSERUJYJIRFQlgkhEVCWCS+AwAA//99Gr9EDVScswAAAABJRU5ErkJggg====
[DEBUG] 2025-08-19 18:42:31: STREAM b'IHDR' 16 13
[DEBUG] 2025-08-19 18:42:31: STREAM b'IDAT' 41 325
[DEBUG] 2025-08-19 18:42:31: ['tesseract', 'C:\\Users\\xxx\\AppData\\Local\\Temp\\tess_3nxa6m33_input.PNG', 'C:\\Users\\xxx\\AppData\\Local\\Temp\\tess_3nxa6m33', 'txt']
[INFO] 2025-08-19 18:42:32: Result: 6897263
[INFO] 2025-08-19 18:42:32: Flag: HMV{c4ptchm3numb3rz}
```

> Flag: `HMV{c4ptchm3numb3rz}`

## Level 27

### Description

**Codename**: levelx27
**Mission**: In this mission you will receive a URL which you must visit, in the body of the
URL there is data from a /etc/passwd file, you must return the UID of the proxy user.

**Example**: 
```
HMV(Input): http://temperance.hackmyvm.eu:8090/cumment/3390/
HMV(Web Body): ---SNIP--- proxy:x:4735654:13:proxy:/bin:/usr/sbin/nologin ---SNIP---

Hacker(Output): 4735654
```

### Solution

```bash
[INFO] 2025-08-19 18:59:27: Challenge: http://temperance.hackmyvm.eu:8090/cumment/9722
[DEBUG] 2025-08-19 18:59:27: Starting new HTTP connection (1): temperance.hackmyvm.eu:8090
[DEBUG] 2025-08-19 18:59:28: http://temperance.hackmyvm.eu:8090 "GET /cumment/9722 HTTP/1.1" 301 49
[DEBUG] 2025-08-19 18:59:28: http://temperance.hackmyvm.eu:8090 "GET /cumment/9722/ HTTP/1.1" 200 631
[DEBUG] 2025-08-19 18:59:28: Processing line: root:x:0:0:root:/root:/bin/bash
[INFO] 2025-08-19 18:59:28: Username: root, UID: 0, GID: 0, Gecos: root, Home: /root, Shell: /bin/bash
...
[DEBUG] 2025-08-19 18:59:28: Processing line: proxy:x:13018369:13:proxy:/bin:/usr/sbin/nologin
[INFO] 2025-08-19 18:59:28: Username: proxy, UID: 13018369, GID: 13, Gecos: proxy, Home: /bin, Shell: /usr/sbin/nologin
[INFO] 2025-08-19 18:59:28: Result: 13018369
[INFO] 2025-08-19 18:59:28: Flag: HMV{pr0xykn0wur1d}
```

> Flag: `HMV{pr0xykn0wur1d}`

## Level 28

### Description

**Codename**: levelx28
**Mission**: In this mission you receive a JWT token. You must decode it and send the value of the HMVKey. (Default key).

**Example**: 
```
HMV(Input): eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJITVZLZXkiOiJVbHFlc0h0bHZIQVdEYVAifQ.65O1aZHiVaGep-QA0-LZRnWXcDF8bZT_E7BXvXaYMUI

Hacker(Output): UlqesHtlvHAWDaP
```

### Solution

```python
import socket
import logging
from base64 import b64decode as bd
from ast import literal_eval

HOST, PORT = 'temperance.hackmyvm.eu', 9988
logging.basicConfig(format="[%(levelname)s] %(asctime)s: %(message)s", datefmt="%Y-%m-%d %H:%M:%S", level=logging.DEBUG)

with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as io:
    io.connect((HOST, PORT))

    data = io.recv(1024)  # Welcome message
    io.send(b'levelx28')

    data = io.recv(1024).decode()
    logging.info(f'Challenge: {data}')

    header, payload, singature = data.split('.')
    payload = literal_eval(bd(payload + '==').decode()) # Convert base64 to dict
    logging.info(f'JWT Payload: {payload}')
    data = payload['HMVKey'].encode()
    io.send(data)

    data = io.recv(1024)
    logging.info(data.decode())
```

```bash
[INFO] 2025-08-19 19:04:59: Challenge: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJITVZLZXkiOiJheFlndnlTamlhTGVZaUoifQ.sGZxECt6ACwbsl4UqLaU6QXvFdhVA7rgMFakXBD5_H0
[INFO] 2025-08-19 19:04:59: JWT Payload: {'HMVKey': 'axYgvySjiaLeYiJ'}
[INFO] 2025-08-19 19:04:59: Flag: HMV{jWth4f4ck}
```

> Flag: `HMV{jWth4f4ck}`

## Level 29

**Codename**: levelx29
**Mission**: In this mission you receive 2 coordinates, you must calculate how many KM there are between them 
and return the result (with 3 decimal).

**Example**: 
```
HMV(Input): Lat: 23 Lon: 21 - Lat: 25 Lon: 16

Hacker(Output): 554.830
```

### Solution

Originally I thought of using this formula: [Haversine formula to find distance between two points on a sphere](https://www.geeksforgeeks.org/dsa/haversine-formula-to-find-distance-between-two-points-on-a-sphere), however for `Lat: 23 Lon: 21 - Lat: 25 Lon: 16` returns **554.400** but they expect **554.830**

The small difference comes from **which Earth model** you’re using:
- The **plain haversine formula** assumes the Earth is a perfect sphere (radius ≈ 6371 km).
- But challenge’s expected answer (`554.830`) is using the **WGS-84 ellipsoid** (Earth is squished at the poles).

```python
# ➜ pip install geopy
from geopy.distance import geodesic
import socket
import logging
import re

HOST, PORT = 'temperance.hackmyvm.eu', 9988
logging.basicConfig(format="[%(levelname)s] %(asctime)s: %(message)s", datefmt="%Y-%m-%d %H:%M:%S", level=logging.DEBUG)

with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as io:
    io.connect((HOST, PORT))

    data = io.recv(1024)  # Welcome message
    io.send(b'levelx29')

    data = io.recv(1024).decode()
    logging.info(f'Challenge: {data}')

    lat1, lon1, lat2, lon2 = map(int, re.findall(r'\d+', data))
    
    lat1 = ((lat1 + 90) % 180) - 90
    lat2 = ((lat2 + 90) % 180) - 90
    
    distance = round(geodesic((lat1, lon1), (lat2, lon2)).km, 3)
    logging.info(f'Coordinates: ({lat1}, {lon1}), ({lat2}, {lon2}); Calculated distance: {distance}')
    io.send(str(distance).encode())

    data = io.recv(1024)
    logging.info(data.decode())
```

```bash
[INFO] 2025-08-19 21:21:10: Challenge: Lat: 48 Lon: 34 - Lat: 68 Lon: 54
[INFO] 2025-08-19 21:21:10: Coordinates: (48, 34), (68, 54); Calculated distance: 2495.195
[INFO] 2025-08-19 21:21:10: Flag: HMV{wh3r314ml0st}
```

> Flag: `HMV{wh3r314ml0st}`

## Level 30

### Description

**Codename**: levelx30
**Mission**: In this mission we must use XOR and send the resulting string (key=HMV).

**Example**: 
```
HMV(Input): <49#0,)'%;:!0.!,
,�"?!/

Hacker(Output): tyMafELksowokYfddVZjsswwxcwdDJMGsMKaENYVaLMJDjrRib
```

### Solution

```python
import socket
import logging

HOST, PORT = 'temperance.hackmyvm.eu', 9988
KEY = b'HMV'
logging.basicConfig(format="[%(levelname)s] %(asctime)s: %(message)s", datefmt="%Y-%m-%d %H:%M:%S", level=logging.DEBUG)

def xor(data, key):
    return bytes([b ^ key[i % len(key)] for i, b in enumerate(data)])

with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as io:
    io.connect((HOST, PORT))

    data = io.recv(1024)  # Welcome message
    io.send(b'levelx30')

    data = io.recv(1024)
    logging.info(f'Challenge: {data.decode()}')

    data = xor(data, KEY)
    logging.info(f'Result: {data.decode()}')
    io.send(data)

    data = io.recv(1024)
    logging.info(data.decode())
```

```bash
[INFO] 2025-08-19 21:26:18: Challenge: :!51"◄¶↔∟☺")'▼↑↔↕18/2¶♣'8+#$)▼♣<
♠/♠./♣!↑5
[INFO] 2025-08-19 21:26:18: Result: rlcyoGSYjUQWSvtajIPVusPDyuyzYQMjncnraRStGPgKxgHwPx
[INFO] 2025-08-19 21:26:19: Flag: HMV{x0rmex0ru}
```

> Flag: `HMV{x0rmex0ru}`

## Level 31

### Description

**Codename**: levelx31
**Mission**: In this mission you receive a png encoded in base64, you must decode it, read the QR code found inside
and return the string that indicates the QR.

**Example**: 
```
HMV(Input): iVBORw0KGgoAAAANSUhEUgAAAGQAAABkEAAAAAAFGRbLAAABn0lEQVR4nOyazW7EMAiEm2rf/5W3J1+IED8mzXg033GbxhnhERjz+
X5/KPh9+wOmkBA0JAQNCUHjY3+4rt6LvHy03hf9fXc9mohICBo3jyyyNZi3x6037HP2/bvr0UREQtBwPbLw9mQ3b0ReqK63oImIhKARemSXyDNT0EREQtB
4zCPZGmwKmohICBqhR7p72Z5Dst7orkcTEQlBw/VIt9/kYT1jvbC7Hk1EJASNa7rm+a/zh4UmIhKChns/4vVsPdbzUX7o5g/1tU6DRkg6j0zt9YjoPsXLU
zQRkRA02ueRqie8PZ69D4lqOJqISAga5VmU6kyJ54VqXlKtdRo0Qm4eiWoaS7ZPlX1vNn+p1kKHRsj2vFa1JvLY9Q5NRCQEjfG5324+6XpyQRMRCUFjfO4
3u/e7s42qtU6BRsj43K/9v6iflZ2dV1/rNGiEPDbTmO1nRbWY/d2DJiISgsbjc79RPvCeq575aSIiIWiMz/1m+1LReaP6HTQRkRA0xud+s3eJ1fyi88hp0
AgZn/t9C5qISAgaEoKGhKDxFwAA//9Pk6bevZKZBwAAAABJRU5ErkJggg==

Hacker(Output): xfZfsIM
```

### Solution

```python
import socket
import logging
from pyzbar.pyzbar import decode
from PIL import Image
from io import BytesIO
from base64 import b64decode as bd

HOST, PORT = 'temperance.hackmyvm.eu', 9988
logging.basicConfig(format="[%(levelname)s] %(asctime)s: %(message)s", datefmt="%Y-%m-%d %H:%M:%S", level=logging.DEBUG)

with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as io:
    io.connect((HOST, PORT))

    data = io.recv(1024)  # Welcome message
    io.send(b'levelx31')

    data = io.recv(1024)
    logging.info(f'Challenge: {data.decode()}')

    img = Image.open(BytesIO(bd(data)))
    data = decode(img)[0].data
    logging.info(f'Result: {data.decode()}')
    io.send(data)

    data = io.recv(1024)
    logging.info(data.decode())
```

```bash
[INFO] 2025-08-19 21:31:17: Challenge: iVBORw0KGgoAAAANSUhEUgAAAGQAAABkEAAAAAAFGRbLAAABqklEQVR4nOyawY6EMAxDl9X8/y/PnnIpipymQWssv+NMKVhuaBPy+X5/JPj97weYwkLYsBA2LISNz/rDdfUmiv0orl/3p3XedXz3foGMIxbCxi1GguoZrLr2UUx07xfIOGIhbKQxEpyu6XUedF33fjKOWAgbMEZ2QWenaqzsIuOIhbAxHiNBlp908w+EjCMWwgaMkan3fXX/6N5PxhELYSONken3/W7daxcZRyyEjVuMTOcJU/UshIwjFsJG+n0kW7vV/ALFRHXfyPYbfx9hR0bI1a3FBmgNd/cP9H3FMcKOjBAYI+mFh7GD5qleH8g4YiFswLNWtjbRWSybLxt3mpfIOGIhbJTrWt2ek9P6VXW8jCMWwsZxXWv3TIRA+5bzkbcgI2S87zebJ4uZ3V5G5yNvQUbIY32/6//VcdlzrPN4H2FHRsh43y963++ezaq1ZBlHLISN8Z5G1Mu4/o7GV785yjhiIWw81vcbVM9YWSxUawAyjlgIG4/1/e7WgE/rYTKOWAgb432/3dx8/b96BgtkHLEQNtq9KGzIOGIhbFgIGxbCxl8AAAD//yliqujxgDirAAAAAElFTkSuQmCC
[DEBUG] 2025-08-19 21:31:17: STREAM b'IHDR' 16 13
[DEBUG] 2025-08-19 21:31:17: STREAM b'IDAT' 41 426
[INFO] 2025-08-19 21:31:17: Result: YUCNNPc
[INFO] 2025-08-19 21:31:20: Flag: HMV{4rtQRc0d3z}
```

> Flag: `HMV{4rtQRc0d3z}`

## Level 32

### Description

**Codename**: levelx32
**Mission**: In this mission you receive an md5 and a string. You must permute the string until it matches md5 and return the string.

**Example**: 
```
HMV(Input): c142e7e8b1d42f4d6f36dfa760174b3a KOSltuvxy

Hacker(Output): OSylutxKv
```

### Solution

For this challenge I initially used Python, but after many hours I just gave up.. It was too slow, like hours slow to calculate and compare all MD5 hashes; So I used C# as my next language (Windows).
```cs
using System;
using System.Net.Sockets;
using System.Security.Cryptography;
using System.Text;
using System.Diagnostics;
using System.Runtime.InteropServices;

namespace TemperanceClient {
    class Program {
        const string HOST = "temperance.hackmyvm.eu";
        const int PORT = 9988;

        static void Main(string[] args) {
            try {
                Console.WriteLine("Framework: " + RuntimeInformation.FrameworkDescription);
                Console.WriteLine("CLR Version: " + Environment.Version);

                using (var client = new TcpClient()) {
                    Console.WriteLine($"[INFO] Connecting to {HOST}:{PORT} ...");
                    client.Connect(HOST, PORT);

                    using (var stream = client.GetStream()) {
                        var buffer = new byte[1024];
                        stream.Read(buffer, 0, buffer.Length); // Welcome message

                        byte[] msg = Encoding.UTF8.GetBytes("levelx32");
                        stream.Write(msg, 0, msg.Length);

                        // Receive target hash + charset
                        int len = stream.Read(buffer, 0, buffer.Length);
                        string[] parts = Encoding.UTF8.GetString(buffer, 0, len).Trim().Split(' ');
                        string targetHash = parts[0];
                        string chars = parts[1];
                        Console.WriteLine($"[INFO] MD5 Target: {targetHash}, Characters: {chars}");

                        string solution = BruteForce(chars, targetHash);

                        if (solution != String.Empty) {
                            Console.WriteLine($"[INFO] Found solution: {solution}");
                            byte[] sol = Encoding.UTF8.GetBytes(solution);
                            stream.Write(sol, 0, sol.Length);

                            // Read final server response
                            len = stream.Read(buffer, 0, buffer.Length);
                            string resp = Encoding.UTF8.GetString(buffer, 0, len).Trim();
                            Console.WriteLine($"[INFO] Server says: {resp}");
                        } else {
                            Console.WriteLine("[WARN] No solution found!");
                        }
                    }
                }
            } catch (Exception ex) {
                Console.WriteLine($"[ERROR] {ex.Message}");
            }
        }

        static string BruteForce(string chars, string targetHash) {
            char[] arr = chars.ToCharArray();
            int len = arr.Length;

            var stopwatch = Stopwatch.StartNew();

            // iterate all permutations of length "len"
            foreach (var perm in GetPermutations(arr, 0, len - 1)) {
                string candidate = new string(perm);
                string hash = ComputeMD5(candidate);

                if (hash.Equals(targetHash, StringComparison.OrdinalIgnoreCase)) {
                    stopwatch.Stop();
                    Console.WriteLine($"[INFO] Match found in {stopwatch.Elapsed.TotalSeconds:F2}s");
                    return candidate;
                }
            }

            return String.Empty;
        }

        static string ComputeMD5(string input) {
            byte[] bytes = Encoding.UTF8.GetBytes(input);
            byte[] hash = MD5.HashData(bytes);
            return Convert.ToHexString(hash).ToLowerInvariant();
        }

        // Generate all permutations of given characters
        static IEnumerable<char[]> GetPermutations(char[] array, int start, int end) {
            if (start == end) {
                yield return (char[])array.Clone();
            } else {
                for (int i = start; i <= end; i++) {
                    Swap(ref array[start], ref array[i]);
                    foreach (var perm in GetPermutations(array, start + 1, end)) { yield return perm; }
                    Swap(ref array[start], ref array[i]);
                }
            }
        }

        static void Swap(ref char a, ref char b) {
            (a, b) = (b, a);
        }
    }
}
```

Done in a flash.... :dies:
```bash
Framework: .NET 8.0.5
CLR Version: 8.0.5
[INFO] Connecting to temperance.hackmyvm.eu:9988 ...
[INFO] MD5 Target: 94ba5cd3e5f6d9c9d6d6870e42ebd43f, Characters: CHKXehhjm
[INFO] Match found in 0,22s
[INFO] Found solution: XmhjeKChH
[INFO] Server says: Flag: HMV{p3rmut4t10n0np3r}
```

> Flag: `HMV{p3rmut4t10n0np3r}`

