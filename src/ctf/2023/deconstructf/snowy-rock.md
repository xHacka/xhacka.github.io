# Snowy Rocks

## Description

am loves puzzles and his dad working in alaska sent a message hidden within for him to uncover  
Can you decode it?  
  
**Author**: Rakhul

## Solution

```bash
└─$ binwalk --dd='.*' ./snowy_rock_fi.jpg 

DECIMAL       HEXADECIMAL     DESCRIPTION
--------------------------------------------------------------------------------
0             0x0             JPEG image data, JFIF standard 1.01
13250         0x33C2          TIFF image data, big-endian, offset of first image directory: 8
28624         0x6FD0          Copyright string: "Copyright (c) 1998 Hewlett-Packard Company"
248341        0x3CA15         Zip archive data, encrypted at least v2.0 to extract, compressed size: 1037, uncompressed size: 2289, name: snowyrock.txt
249548        0x3CECC         End of Zip archive, footer length: 22
                                                      
└─$ mv _snowy_rock_fi.jpg.extracted/3CA15 hidden.zip
                                                                   
└─$ unzip hidden.zip  
Archive:  hidden.zip
[hidden.zip] snowyrock.txt password: 
   skipping: snowyrock.txt           incorrect password
                                                       
└─$ zip2john hidden.zip > hidden.hash    
ver 2.0 efh 5455 efh 7875 hidden.zip/snowyrock.txt PKZIP Encr: TS_chk, cmplen=1037, decmplen=2289, crc=B0E1F308 ts=B3AC cs=b3ac type=8
                                                      
└─$ john hidden.hash --wordlist=$rockyou
...
11snowbird       (hidden.zip/snowyrock.txt)     
...

└─$ unzip hidden.zip
Archive:  hidden.zip
[hidden.zip] snowyrock.txt password: 
  inflating: snowyrock.txt                                
```

![snowy-rock-1](/assets/ctf/deconstructf/snowy-rock-1.png)

The text in extracted file looks weird, compared to original peom [Snow Day](https://www.poetryfoundation.org/poems/46707/snow-day) by Billy Collins.

Hint:

```
//////////////snow/flag/
*Something about friday the ......... :P*
///////////////////
```

After analyzing text nothing was making sense, I thought it was whitespace language but no. Hint wasnt helping. I decided to start looking for tools related to snow, as everything was pointing to it. 

<https://darkside.com.au/snow/>

_**Whitespace steganography**_

_The program SNOW is used to conceal messages in ASCII text by appending whitespace to the end of lines. Because spaces and tabs are generally not visible in text viewers, the message is effectively hidden from casual observers. And if the built-in encryption is used, the message cannot be read even if it is detected._

You can either download the binary or `sudo apt install stegsnow` <https://www.kali.org/tools/stegsnow/>

```bash
└─$ ./snow/snow -C ./snowyrock.txt 
OFTHA62GMFBGUX3FIJYFQZS7ONBGKX3FGM2HS7I=                                                                                                 
```

This is where I fell into the rabbithole. Looks like Base64 right? It's not... The worst part is this tool supports password, so the rabbithole got deeper.

The solution is to decode from Base**32**...

![snowy-rock-2](/assets/ctf/deconstructf/snowy-rock-2.png)
::: tip Flag
`dsc{SnOw_rOcKs_fOr_r34l}`
:::