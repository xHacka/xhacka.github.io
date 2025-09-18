# Margaret Hamilton

## Margaret Hamilton

[Margaret Elaine Hamilton]([https://en.wikipedia.org/wiki/Margaret_Hamilton_(software_engineer)](https://en.wikipedia.org/wiki/Margaret_Hamilton_(software_engineer))  (née Heafield; born August 17, 1936) is an American computer scientist, systems engineer, and business owner. She was director of the Software Engineering Division of the MIT Instrumentation Laboratory, which developed on-board flight software for NASA's Apollo program. She later founded two software companies—Higher Order Software in 1976 and Hamilton Technologies in 1986, both in Cambridge, Massachusetts. - [Wikipedia Entry]([https://en.wikipedia.org/wiki/Margaret_Hamilton_(software_engineer)](https://en.wikipedia.org/wiki/Margaret_Hamilton_(software_engineer))

## Description

Chal: Return the flag to  [NASAs first software engineer](https://www.youtube.com/watch?v=kYCZPXSVvOQ).

Author:  [Rusheel](https://github.com/Rusheelraj)

[Apollo-Mystery.jpg](https://cyberheroines.ctfd.io/files/6b8f48228d273557a865e1d4b918a3cd/Apollo-Mystery.jpg?token=eyJ1c2VyX2lkIjo1ODQsInRlYW1faWQiOm51bGwsImZpbGVfaWQiOjExfQ.ZP4XFg.7DQ2KXxehsSfwSRX1JeTcdZa4wc "Apollo-Mystery.jpg")

## Solution

Running `exiftool` we see the following comment in the image.

```bash
└─$ exiftool Apollo-Mystery.jpg 
ExifTool Version Number         : 12.60
File Name                       : Apollo-Mystery.jpg
Directory                       : .
File Size                       : 1022 kB
File Modification Date/Time     : 2023:09:10 16:20:05+04:00
File Access Date/Time           : 2023:09:10 17:59:53+04:00
File Inode Change Date/Time     : 2023:09:10 16:20:38+04:00
File Permissions                : -rwxrwx---
File Type                       : JPEG
File Type Extension             : jpg
MIME Type                       : image/jpeg
JFIF Version                    : 1.01
Resolution Unit                 : None
X Resolution                    : 1
Y Resolution                    : 1
Comment                         : Possibility of a secret flag - https://www.youtube.com/shorts/y3I-mbNCC80
Image Width                     : 1000
Image Height                    : 750
Encoding Process                : Progressive DCT, Huffman coding
Bits Per Sample                 : 8
Color Components                : 3
Y Cb Cr Sub Sampling            : YCbCr4:2:0 (2 2)
Image Size                      : 1000x750
Megapixels                      : 0.750
```

After watching the video I thought the challenge was steganography, which was a deep rabbit hole.

After no password was working for `steghide` I gave up and tried different solution. What if there's no protection? Can we extract file without `steghide`? I used `binwalk` to search for files within JPG:

```bash
└─$ binwalk --dd='.*' Apollo-Mystery.jpg 

DECIMAL       HEXADECIMAL     DESCRIPTION
--------------------------------------------------------------------------------
0             0x0             JPEG image data, JFIF standard 1.01
98309         0x18005         Zip archive data, at least v2.0 to extract, compressed size: 923047, uncompressed size: 932086, name: margaret_flag.png
1021518       0xF964E         End of Zip archive, footer length: 22
                                                                                                                                                                                      
└─$ mv _Apollo-Mystery.jpg.extracted/18005 secret.zip
     
└─$ unzip secret.zip 
Archive:  secret.zip
  inflating: margaret_flag.png       
```

![margaret_flag](/assets/ctf/cyberheroinesctf/margaret_flag.png)
::: tip Flag
`chctf{i_wr1t3_code_by_h4nd}`
:::