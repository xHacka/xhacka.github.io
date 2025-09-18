# Brevi Moduli

## Description

On a cold Halloween night, five adventurers gathered at the entrance of an ancient crypt. The Cryptkeeper appeared from the shadows, his voice a chilling whisper: "Five locks guard the treasure inside. Crack them, and the crypt is yours." One by one, they unlocked the crypt's secrets, but as the final door creaked open, the Cryptkeeper's eerie laughter filled the air. "Beware, for not all who enter leave unchanged."

## Source

`server.py`
```python
from Crypto.Util.number import isPrime, getPrime, bytes_to_long
from Crypto.PublicKey import RSA

rounds = 5
e = 65537

for i in range(rounds):
    print('*'*10, f'Round {i+1}/{rounds}', '*'*10)

    pumpkin1 = getPrime(110)
    pumpkin2 = getPrime(110)
    n = pumpkin1 * pumpkin2
    large_pumpkin = RSA.construct((n, e)).exportKey()
    print(f'\n🎃Can you crack this pumpkin🎃?\n{large_pumpkin.decode()}\n')

    assert isPrime(_pmp1 := int(input('enter your first pumpkin = '))), exit()
    assert isPrime(_pmp2 := int(input('enter your second pumpkin = '))), exit()

    if n != _pmp1 * _pmp2:
        print('wrong! bye...')
        exit()

    print()

print(open('flag.txt').read())
```

## Solution

I decided to use `sage` for getting prime numbers, because sympy wasn't so nice.

`rsa.sage`
```python
import sys

n = ZZ(int(sys.argv[1]))
e = 65537

factors = n.factor()
p, q = factors[0][0], factors[1][0]  # Assuming n is the product of two primes

print(f"{p} {q}")
```

`Dockerfile`
```bash
FROM sagemath/sagemath
COPY rsa.sage /home/sage/rsa.sage
ENTRYPOINT ["sage", "/home/sage/rsa.sage"]
```

```bash
└─$ docker pull sagemath/sagemath
└─$ docker build -t brevi_moduli .
```

`exploit.py`
```python
from subprocess import check_output
import time
from Crypto.PublicKey import RSA
from pwn import remote, info, context, debug

io = remote('83.136.255.10', 33707)
# context.log_level = 'DEBUG'

for i in range(5):
    resp = io.recvline()
    # debug(resp)
    if b'wrong!' in resp:
        print('Something went wrong... exiting...')
        exit(1)
        
    pem = io.recvline()
    while not b'BEGIN' in pem:
        # debug(pem)
        pem = io.recvline()

    pem = pem.decode() + '\n' + '\n'.join(io.recvlinesS(4))
    key = RSA.import_key(pem)
    info(f'n={key.n}')

    info('Starting p and q caluclation.... this will take some time')
    start = time.monotonic()
    docker_output = check_output(f'docker run --rm --user root brevi_moduli {key.n}', shell=True, timeout=3600)
    end = time.monotonic()
    p, q = docker_output.strip().split()    
    info(f'Took {end-start:.3f} seconds')
    info(f'{p=}\n{q=}')

    io.sendlineafter(b'enter your first pumpkin = ', p)
    io.sendlineafter(b'enter your second pumpkin = ', q)
    info(f'[{i+1}] Round done...\n')

# io.interactive()
print(io.recvallS())
```

```bash
[+] Opening connection to 83.136.255.10 on port 33707: Done
[*] n=838009332399843357020834232597218644040977039202410997771920786787
[*] Starting p and q caluclation.... this will take some time
[*] Took 73.983 seconds
[*] p=b'857101375389624332016756102718537'
    q=b'977724871831990652140916703282251'
[*] [1] Round done...
[*] n=453985595612663147603262256249560367895029020284141348989194614839
[*] Starting p and q caluclation.... this will take some time
[*] Took 84.731 seconds
[*] p=b'651843506359835871843992063639591'
    q=b'696464091738685487409670218383729'
[*] [2] Round done...
[*] n=1426468033270297596246381923448209972035491611307287248683146580073
[*] Starting p and q caluclation.... this will take some time
[*] Took 88.543 seconds
[*] p=b'1182849298759103662621701291147193'
    q=b'1205959233155709684823623637274161'
[*] [3] Round done...
[*] n=1273347876788506764298780644706137297150596349439004860451483980429
[*] Starting p and q caluclation.... this will take some time
[*] Took 85.904 seconds
[*] p=b'998020670054637479099672271252709'
    q=b'1275873250920540820279582666579081'
[*] [4] Round done...
[*] n=1021341247618335727336887353078024675490735934038708708251015457557
[*] Starting p and q caluclation.... this will take some time
[*] Took 82.693 seconds
[*] p=b'902452308610000829112912207204377'
    q=b'1131739858022473444217784643445341'
[*] [5] Round done...
[+] Receiving all data: Done (125B)
[*] Closed connection to 83.136.255.10 port 33707

HTB{this_was_a_warmup_to_get_you_used_to_integer_factoring_and_parsing_pem_formatted_keys_d5c1bffac9d33457e38bdf2ff457c069}
```

> Flag: `HTB{this_was_a_warmup_to_get_you_used_to_integer_factoring_and_parsing_pem_formatted_keys_2567a40af997e3c63d271a6d43f09552}`
