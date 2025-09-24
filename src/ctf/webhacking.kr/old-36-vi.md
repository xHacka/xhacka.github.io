# Old 36    Vi

URL: [https://webhacking.kr/challenge/bonus-8/](https://webhacking.kr/challenge/bonus-8/)

```html
While editing index.php file using vi editor in the current directory, a power outage caused the source code to disappear.
Please help me recover.
```

If you're familiar or ever used `vi` you must know that it keeps backups of file. They are called swap files, usually hidden and with `swp` extension.

```bash
➜ curl 'https://webhacking.kr/challenge/bonus-8/.index.php.swp' -b 'PHPSESSID=3052403292' --output -
U3210#"! Utpad�����??>  $flag = "FLAG{what_about_the_nano_editor?}";<?php
```