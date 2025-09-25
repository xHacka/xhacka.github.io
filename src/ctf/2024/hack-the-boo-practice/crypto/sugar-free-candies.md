# Sugar Free Candies

## Description

For years, strange signals pulsed through the air on the eve of October 31st. Some said it was the voice of an ancient witch, others believed it was a message from something far darker. A cryptic message, scattered in three parts, was intercepted by a daring group of villagers. Legend spoke of a deal made between the witch and a shadowy figure, but the true intent of their secret could only be revealed by those brave enough to decipher it before midnight, when the veil between worlds would thin.

## Source

`source.py`
```python
from Crypto.Util.number import bytes_to_long

FLAG = open("flag.txt", "rb").read()

step = len(FLAG) // 3
candies = [bytes_to_long(FLAG[i:i+step]) for i in range(0, len(FLAG), step)]

cnd1, cnd2, cnd3 = candies

with open('output.txt', 'w') as f:
    f.write(f'v1 = {cnd1**3 + cnd3**2 + cnd2}\n')
    f.write(f'v2 = {cnd2**3 + cnd1**2 + cnd3}\n')
    f.write(f'v3 = {cnd3**3 + cnd2**2 + cnd1}\n')
    f.write(f'v4 = {cnd1 + cnd2 + cnd3}\n')
```

```bash
v1 = 4196604293528562019178729176959696479940189487937638820300425092623669070870963842968690664766177268414970591786532318240478088400508536
v2 = 11553755018372917030893247277947844502733193007054515695939193023629350385471097895533448484666684220755712537476486600303519342608532236
v3 = 14943875659428467087081841480998474044007665197104764079769879270204055794811591927815227928936527971132575961879124968229204795457570030
v4 = 6336816260107995932250378492551290960420748628
```

## Solution

First we need to recover the original numbers, this seems like a math problem which sympy can help with. 

Drop the code in [https://live.sympy.org](https://live.sympy.org) and get output: (or install library)
```python
import sympy as sp

cnd1, cnd2, cnd3 = sp.symbols('cnd1 cnd2 cnd3')

v1 = 4196604293528562019178729176959696479940189487937638820300425092623669070870963842968690664766177268414970591786532318240478088400508536 
v2 = 11553755018372917030893247277947844502733193007054515695939193023629350385471097895533448484666684220755712537476486600303519342608532236 
v3 = 14943875659428467087081841480998474044007665197104764079769879270204055794811591927815227928936527971132575961879124968229204795457570030 
v4 = 6336816260107995932250378492551290960420748628 

eq1 = sp.Eq(cnd1**3 + cnd3**2 + cnd2, v1)
eq2 = sp.Eq(cnd2**3 + cnd1**2 + cnd3, v2)
eq3 = sp.Eq(cnd3**3 + cnd2**2 + cnd1, v3)
eq4 = sp.Eq(cnd1 + cnd2 + cnd3, v4)

solution = sp.solve([eq1, eq2, eq3, eq4], (cnd1, cnd2, cnd3))

print(solution)
```

Convert longs to bytes and get flag:
```python
from Crypto.Util.number import long_to_bytes

nums = [1612993708938936929835517754497931126786454632, 2260690199455691264676123410341531247524997487, 2463132351713367737738737327711828586109296509]

for num in nums:
    print(long_to_bytes(num).decode(), end='')
print()
```

::: tip Flag
`HTB{__protecting_the_secret_in_equations_is_not_secure__}`
:::

