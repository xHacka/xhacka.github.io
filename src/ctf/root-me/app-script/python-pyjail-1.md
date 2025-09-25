# Python Pyjail 1

URL: [https://www.root-me.org/en/Challenges/App-Script/Python-PyJail-1](https://www.root-me.org/en/Challenges/App-Script/Python-PyJail-1)

## Statement

Retrieve validation password to get out of this jail.
## Challenge connection information

| Key        | Value                                                                                                                                                                                                                                                                                                                           |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Host       | challenge02.root-me.org                                                                                                                                                                                                                                                                                                         |
| Protocol   | SSH                                                                                                                                                                                                                                                                                                                             |
| Port       | 2222                                                                                                                                                                                                                                                                                                                            |
| SSH access | [ssh -p 2222 app-script-ch8@challenge02.root-me.org](ssh://app-script-ch8:app-script-ch8@challenge02.root-me.org:2222 "SSH access")     [![](https://www.root-me.org/squelettes/img/webssh.png?1454749832) WebSSH](http://webssh.root-me.org/?location=WebSSH_451&ssh=ssh://app-script-ch8:app-script-ch8@challenge02 "WebSSH") |
| Username   | app-script-ch8                                                                                                                                                                                                                                                                                                                  |
| Password   | app-script-ch8                                                                                                                                                                                                                                                                                                                  |
## Solution

The challenge seems to be revolved around `exit` function:
```bash
Welcome to my Python sandbox! Everything is in exit() function (arg == get the flag!)
```

I found that easiest way to detect which python version is used is to `print` 
```python
>>> print(1+1) # Python 3
2
>>> print 1+1  # Python 2
2 
```

Most functions were disabled and `__` also was disabled.

Enumerate locally:
```python
└─$ python2
Python 2.7.18 (default, Aug  1 2022, 06:23:55)
[GCC 12.1.0] on linux2
Type "help", "copyright", "credits" or "license" for more information.
# Create a dummy function
>>> def fn(x): return x*x
...
# Enumerate functions accessible that dont start with __
>>> [f for f in dir(fn) if not f.startswith('__')]
['func_closure', 'func_code', 'func_defaults', 'func_dict', 'func_doc', 'func_globals', 'func_name']
# Enumerate the `func_code` further
>>> [f for f in dir(fn.func_code) if not f.startswith('__')]
['co_argcount', 'co_cellvars', 'co_code', 'co_consts', 'co_filename', 'co_firstlineno', 'co_flags', 'co_freevars', 'co_lnotab', 'co_name', 'co_names', 'co_nlocals', 'co_stacksize', 'co_varnames']
```

Exploit the `exit` function:
```python
>>> print exit.func_code.co_consts
(None, 'flag-WQ0dSFrab3LGADS1ypA1', -1, 'cat .passwd', 'You cannot escape !')
>>> exit(exit.func_code.co_consts[1])
Well done flag : YjHRUZEa9irCPS2llubR
```

::: tip Flag
`YjHRUZEa9irCPS2llubR`
:::

