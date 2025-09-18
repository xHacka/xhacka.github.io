# Crypto Challenges

## Unquestioned and Unrestrained

### Description

First crypto challenge so we have to keep it easy. Here's the flag, but it's encoded. All you have to do is figure out which method was used. Luckily, it's a common one.

`cG9jdGZ7dXdzcF80MTFfeTB1Ml84NDUzXzQyM184MzEwbjlfNzBfdTV9`

### Solution

The string looks like Base64 encoding, so lets decode:

```bash
└─$ echo -n 'cG9jdGZ7dXdzcF80MTFfeTB1Ml84NDUzXzQyM184MzEwbjlfNzBfdTV9' | base64 -d
poctf{uwsp_411_y0u2_8453_423_8310n9_70_u5}                                                                                            
```
::: tip Flag
`poctf{uwsp_411_y0u2_8453_423_8310n9_70_u5}`
:::

### Note

[Cipher Identifier](https://www.dcode.fr/cipher-identifier) by dCode is a great tool for crypto.

## A Pale, Violet Light

### Description

```
e = 5039
N = 34034827
C = 933969 15848125 24252056 5387227 5511551 10881790 3267174 14500698 28242580 933969 32093017 18035208 2594090 2594090 9122397 21290815 15930721 4502231 5173234 21290815 23241728 2594090 21290815 18035208 10891227 15930721 202434 202434 21290815 5511551 202434 4502231 5173234 25243036
```

### Solution

The description doesnt mention anything, we are given `e`, `N`, `C` values which are common RSA values used in Cryptography.

Do a standard [RSA](https://www.wikiwand.com/en/RSA_(cryptosystem)#Decryption) decoding for each ciphered character:

```py
from Crypto.Util.number import long_to_bytes as l2b

e = 5039
N = 34034827
C = [933969,15848125,24252056,5387227,5511551,10881790,3267174,14500698,28242580,933969,32093017,18035208,2594090,2594090,9122397,21290815,15930721,4502231,5173234,21290815,23241728,2594090,21290815,18035208,10891227,15930721,202434,202434,21290815,5511551,202434,4502231,5173234,25243036]

p, q = 5807, 5861 # http://factordb.com/index.php?query=34034827

phi = (q-1) * (p-1)
d = pow(e, -1, phi)

flag = ""
for c in C:
    c = pow(c, d, N)
    flag += l2b(c).decode()

print(flag.replace(' ', '_'))
```
::: tip Flag
`poctf{uwsp_533k_4nd_y3_5h411_f1nd}`
:::

## Missing and Missed

### Description

A little cerebral fornication to round out the crypto challenges.

```
++++++++++[>+>+++>+++++++>++++++++++<<<<-]>>>>++++++++++++.-.------------.+++++++++++++++++.--------------.+++++++++++++++++++++.------.++.----.---.-----------------.<<++++++++++++++++++++.-.++++++++.>>+++++++++.<<--.>>---------.++++++++++++++++++++++++.<<-----.--.>>---------.<<+++++++++.>>---------------.<<---------.++.>>.+++++++.<<--.++.+++++++.---------.+++++++..----.>>++++++++.+++++++++++++++.
```

### Solution

[Brainf**k in 100 Seconds](https://youtu.be/hdHjjBS4cs8)

Using [Brainf**k Interpreter](https://copy.sh/brainfuck/) get flag.
::: tip Flag
`poctf{uwsp_219h7_w20n9_02_f0290773n}`
:::