# List


## Description

By `Luma`

Who knew RCE was this useful?

Downloads: [list.zip](https://drive.google.com/file/d/1t0iQfAZc9MkBra0B3_XVrzURtePu6UcF/view?usp=drive_link)

## Solution

When we open wireshark we are met with huge traffic. Looking over it with quick glance we see tons of GET requests. That made me think to look into HTTP objects. First we need to export this objects.

`File -> Export Objects -> HTTP`

I wasnt sure what to look for so I saved all the objects.

After looking over some files it became clear that cleanup was needed. I used to powershell since Im on Windows.

```powershell
foreach ($file in $(ls)) {
    $contents = $(cat $file)
    if ($contents -match "<title>404 Not Found</title>"   -or # Delete invalid pages
        $contents -match "<title>403 Forbidden</title>"   -or # Delete invalid pages
        $contents -match "<title>400 Bad Request</title>" -or # Delete invalid pages
        $contents -match "<pre></pre>"                    -or # Delete empty php scripts
        $contents -match ".*\..*"                             # Delete anything without extension
    ) {
        rm $file
    }
}
```

Now we are left with php scripts. Let's examine what's it doing.

```powershell
➜ cat '.\index(68).php'
command=echo+%22ZmluZCAvaG9tZS9jdGYgLXR5cGUgZiAtbmFtZSAiVCIgMj4vZGV2L251bGw%3D%22+%7C+base64+-d+%7C+bash

# URL Decode
➜ [System.Web.HttpUtility]::UrlDecode($(cat '.\index(68).php'))
command=echo "ZmluZCAvaG9tZS9jdGYgLXR5cGUgZiAtbmFtZSAiVCIgMj4vZGV2L251bGw=" | base64 -d | bash

# One of my utility functions
# Decodes Base64, but it's really long in powershell D:
function BD($base64) { [System.Text.Encoding]::UTF8.GetString([Convert]::FromBase64String($base64))  }

➜ bd ZmluZCAvaG9tZS9jdGYgLXR5cGUgZiAtbmFtZSAiVCIgMj4vZGV2L251bGw=
find /home/ctf -type f -name "T" 2>/dev/null
```

After observing other files it became clear that flag characters are being sent to void. Let's extract them.

```py
from pathlib import Path
from urllib.parse import unquote 
from base64 import b64decode as bd
import re

# Get only php scripts and sort them numerically, not alphanumerically.
php_scripts = [p.name for p in Path().glob("./index*.php")]
# From`index(70).php` we are getting what's inside parentheses with regex.
php_scripts.sort(key=lambda p: int(re.search(r"\((\d+)\)", p).group(1)))

for php_script in php_scripts:
    with open(php_script) as f:
        payload = unquote(f.read()) # URLDecode
        if 'base64' in payload: # Check for base64 convesion (Some scripts dont have it)
	        # Get Base64 string from payload and decode.
            base64str = bd(re.search(r'"(.+)"', payload).group(1)).decode()
            # Profit
            flag = re.search(r'"(.+)"', base64str).group(1)
            print(flag, end='')
```
::: tip Flag
`TFCCTF{b4s3_64_isnt_that_g00d}`
:::