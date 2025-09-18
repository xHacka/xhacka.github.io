# Criminal Excel

## Description

Looking for secrets in Excel

[document.xls](https://ctf-spcs.mf.grsu.by/files/a7d3aece9569de65509ced4af95742b6/document.xls?token=eyJ1c2VyX2lkIjo2NzksInRlYW1faWQiOjM3NCwiZmlsZV9pZCI6OTJ9.ZaTJiA.lkvMeBmdYtbtYySKy4wlqqYNbrY)

## Solution

### Get encrypted flag with Strings

```bash
➜ strings .\document.xls -n 16
Ludovik                                                                                                      B
_-* #,##0_-;\-* #,##0_-;_-* "-"_-;_-@_-
_-* #,##0.00_-;\-* #,##0.00_-;_-* "-"??_-;_-@_-
koqhys bzgpp_cqvprpkg_tw_ogew
[Content_Types].xml
theme/theme/themeManager.xml
theme/theme/theme1.xml
theme/theme/_rels/themeManager.xml.rels
[Content_Types].xmlPK
theme/theme/themeManager.xmlPK
theme/theme/theme1.xmlPK
theme/theme/_rels/themeManager.xml.relsPK
&C&"Times New Roman,Regular"&12&A
&C&"Times New Roman,Regular"&12Page &P
Microsoft Excel 2003
```

### Get encrypted flag with Excel (or LibreCalc)

![criminal-excel-2](/assets/ctf/spcsctf/criminal-excel-2.png)

### Decode flag

`koqhys bzgpp_cqvprpkg_tw_ogew` looks like a flag. From the looks of it it seems [ROT13](https://www.wikiwand.com/en/ROT13), but nothing. [Vigenere Cipher](https://www.wikiwand.com/en/Vigenère_cipher) is also common cipher which utilizes ROT13 (or [Ceaser Cipher](https://www.wikiwand.com/en/Caesar_cipher))

This encryption is weak and can be bruteforced: <https://www.dcode.fr/vigenere-cipher>

![criminal-excel-1](/assets/ctf/spcsctf/criminal-excel-1.png)
::: tip Flag
`grodno{excel_forensic_is_real}`
:::