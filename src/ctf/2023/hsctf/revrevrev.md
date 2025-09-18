# revrevrev

## Desciption

rev/revrevrev (by Jaysu) | 362 points

Your friend is trying to pass this car game that he made. Sadly, they have long term memory loss and they don't remember the inputs or the goal of the game. All they have is the code. You should help them, as something hidden (like a flag?) will display if you find the correct inputs.

_Note: if you have a flag that works on the challenge file but isn't accepted, please DM the author (or another organizer)._

[revrevrev.py](https://hsctf-10-resources.storage.googleapis.com/uploads/a95cfe259e3d1119e706d50998e369913ac1044784122a3eb03eee4580077818/revrevrev.py)

## Analysis

Program does some mathematical operations and checks if `if  x  ==  168  and  y  ==  32`, if condition is true then it's the flag. 

Only 3 characters are allowed `'r', 'L', 'R'` and answer length must be 20.

## Solution

After fiddling around the program I found out that changing last values has most impact, so I iterate over every possible permutation and create answer with length of 20.

```py
from itertools import product

# Product creates permutations from charset with length of 5
for ins in product("rRL", repeat=5): 
    ins  =  'r' *  15  +  ''.join(ins) # Concatenate answer
    s, a, x, y = 0, 0, 0, 0
    for c in ins:
        if c == 'r':  # rev
            s += 1
        elif c == 'L':  # left
            a = (a + 1) % 4
        elif c == 'R':  # right
            a = (a + 3) % 4
        else:
            print("this character is not necessary for the solution.")

        if   a == 0: x += s
        elif a == 1: y += s
        elif a == 2: x -= s
        elif a == 3: y -= s
    
    ::: raw
    if x == 168 and y == 32:
        print("(%d, %d) flag{%s}" % (x, y, ins)) # fStrings and curly braces tricky
    else:
        print(f"({x}, {y}) incorrect sadly", end='\r')
    :::
```

Two matches found.
```
(168, 32) flag{rrrrrrrrrrrrrrrrLRLR}
(168, 32) flag{rrrrrrrrrrrrrrrLRrrL}
```

I first tried submitting first answer and it was a correct one, second flag didnt work.

<small>Flag not redacted since it's a bit tricky</small>