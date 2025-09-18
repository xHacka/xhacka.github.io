# Phreaky

# Phreaky

### Description

In the shadowed realm where the Phreaks hold sway,
\
A mole lurks within, leading them astray.
\
Sending keys to the Talents, so sly and so slick,
\
A network packet capture must reveal the trick.
\
Through data and bytes, the sleuth seeks the sign,
\
Decrypting messages, crossing the line.
\
The traitor unveiled, with nowhere to hide,
\
Betrayal confirmed, they'd no longer abide.

### Solution

We are given a pcap file which can be inspected with Wireshark. After going through some conversations we notice emails being sent back and forth.

![phreaky-1](/assets/ctf/htb/phreaky-1.png)

The emails can be export from Wireshark: File -> Export Objects -> IMF

One of the emails:

```http
Date: Wed, 06 Mar 2024 15:07:13 +0000
From: caleb@thephreaks.com(Caleb)
To: resources@thetalents.com
Subject: Secure File Transfer
Message-ID: <20240306150713.uqhXU%caleb@thephreaks.com>
User-Agent: s-nail v14.9.23
MIME-Version: 1.0
Content-Type: multipart/mixed;
 boundary="=-=PJMhsiMW4GxMH5HQTcPgvJuR3R4576ZygzO3=-="

This is a multi-part message in MIME format.

--=-=PJMhsiMW4GxMH5HQTcPgvJuR3R4576ZygzO3=-=
Content-Type: text/plain; charset=us-ascii
Content-Disposition: inline
Content-ID: <20240306150713.z_oac%caleb@thephreaks.com>

Attached is a part of the file. Password: AdtJYhF4sFgv

--=-=PJMhsiMW4GxMH5HQTcPgvJuR3R4576ZygzO3=-=

Content-Type: application/zip
Content-Transfer-Encoding: base64
Content-Disposition: attachment; 
 filename*0="76b329245795e409d5d9cf1aaa026f8541bb216b4064562bf7684f9b35e";
 filename*1="a2736.zip"
Content-ID: <20240306150713.8ij5_%caleb@thephreaks.com>

UEsDBAoACQAAAGZ3ZlhKc9CT6QAAAN0AAAAWABwAcGhyZWFrc19wbGFuLnBkZi5wYXJ0NVVUCQAD
wIToZcCE6GV1eAsAAQToAwAABOgDAACgXw6/ilp0wNpzWRKketbF/ZStw53n68tQVXonvsbCXld2
+hEU8oOGDJmNqJPxK7b6qScipwQBuaP7aisMHTGpC5otz0y3zSHKPIRjphFkQPHDEU9gCHmSfNTI
c/kWvaDyDWFJY7rfz2QOkQnmY4Wa8uefTXU/0O9X1FCh77dlADxvUoTXwIfMJ/7c6L+cD76gC3BN
h5ajhYC6o+4p3XXCaum4x1ETaNUyc44hPHEr6tykoaBawkqaQ+qU39Z89cJRUeYWTr8sKjGPN+f0
fa72ALXAxdCEzfZV4rvVTgJTq+IjyScxniKdYFBLBwhKc9CT6QAAAN0AAABQSwECHgMKAAkAAABm
d2ZYSnPQk+kAAADdAAAAFgAYAAAAAAAAAAAAtIEAAAAAcGhyZWFrc19wbGFuLnBkZi5wYXJ0NVVU
BQADwIToZXV4CwABBOgDAAAE6AMAAFBLBQYAAAAAAQABAFwAAABJAQAAAAA=

--=-=PJMhsiMW4GxMH5HQTcPgvJuR3R4576ZygzO3=-=--
```

The emails contain Base64 blob which are zip files with password, in total of 15 parts and 15 passwords.

![phreaky-2](/assets/ctf/htb/phreaky-2.png)

```py
import re
from pathlib import Path
from zipfile import ZipFile
from base64 import b64decode
from io import BytesIO

def sorter(pair):
    filename, value = pair
    return int(filename.split('part')[1])

extracted_files = {}
files = Path('./files').glob('*')
for file in files:
    with open(file.resolve()) as f:
        data = f.read()

    boundary = re.search(r'boundary="(.*)"', data).group(1)
    password = re.search(r'Password: (.*)' , data).group(1)
    filename = re.search(r'filename\*1="(.*)"' , data).group(1)
    contents = ''.join(data.split(boundary)[-2].split('\n\n')[-2].split('\n'))

    contents = b64decode(contents)
    with ZipFile(BytesIO(contents), 'r') as f:
        f.setpassword(password.encode('utf-8'))
        extracted_files.update({name: f.read(name) for name in f.namelist()})

extracted_files = sorted(extracted_files.items(), key=sorter)
with open('phreaks_plan.pdf', 'wb') as f:
    for filename, contents in extracted_files:
        f.write(contents)
```

Iterate over files, read, parse, unzip, save, sort and finally merge into one file.

![phreaky-3](/assets/ctf/htb/phreaky-3.png)

::: tip Flag
`HTB{Th3Phr3aksReadyT0Att4ck}`
:::
