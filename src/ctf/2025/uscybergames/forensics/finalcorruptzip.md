# FinalCorruptZip

## Description

BGR

[FinalCorruptZip.zip](https://ctf.uscybergames.com/files/7298bae467c6a9d45ab81979b62d57fe/FinalCorruptZip.zip?token=eyJ1c2VyX2lkIjoxMDY4LCJ0ZWFtX2lkIjpudWxsLCJmaWxlX2lkIjoxMH0.aExMbQ.LLWolX5-hZAwnMqJxbMjOyYclFI)

## Solution

Oddly enough 7z is not able to open the above zip, but windows archive was able to?... NANIII

Anyway, the zip files always start with PK so header is corrupted.

![FinalCorruptZip.png](/assets/ctf/uscybergames/finalcorruptzip.png)

Lookup **Magic Bytes** or [**List of file signatures**](https://en.wikipedia.org/wiki/List_of_file_signatures)

If you're using latest version of [Hex Editor](https://marketplace.visualstudio.com/items?itemName=ms-vscode.hexeditor) -> Select 41 (first byte) -> press Insert -> type 50 -> Save -> Unzip

![FinalCorruptZip-1.png](/assets/ctf/uscybergames/finalcorruptzip-1.png)

```bash
└─$ unzip FinalCorruptZip.zip
└─$ file CorruptPNG.png
CorruptPNG.png: data
```

![FinalCorruptZip-2.png](/assets/ctf/uscybergames/finalcorruptzip-2.png)

Edit first bytes as Signature indicates

![FinalCorruptZip-3.png](/assets/ctf/uscybergames/finalcorruptzip-3.png)

![FinalCorruptZip-4.png](/assets/ctf/uscybergames/finalcorruptzip-4.png)

To make life easier use OCR:
```bash
└─$ sudo apt install tesseract-ocr -y
└─$ tesseract CorruptPNG.png out
└─$ cat out.txt
SVBGR{m4g1C_B1t3s_yUmmmmm}
```

>Flag: `SVBGR{m4g1C_B1t3s_yUmmmmm}`

