# Baby's First Foren

## Description

Baby's First Foren | 50  points | By  `Marvin`

I found this beginner's guide to forensics.

Static resources: [babys-first-foren.png](https://storage.googleapis.com/bcactf/babys-first-foren/babys-first-foren.png)

## Solution

Picture instructs us how to find the flag.

1\. Investigate metadata -> `exiftool`
```sh
└─$ exiftool babys-first-foren.png    
Author                          : bcactf{i_h0P3_y0u_
Warning                         : [minor] Trailer data after PNG IEND chunk 
```

2\. Looking for embeded files -> `binwalk`

```sh
└─$ binwalk --dd='.*' babys-first-foren.png   

DECIMAL       HEXADECIMAL     DESCRIPTION
--------------------------------------------------------------------------------
0             0x0             PNG image, 1000 x 1000, 8-bit/color RGBA, non-interlaced
78            0x4E            Zlib compressed data, compressed
70323         0x112B3         Zip archive data, at least v2.0 to extract, compressed size: 464, uncompressed size: 838, name: temp.txt
70931         0x11513         End of Zip archive, footer length: 22

                                         
└─$ mv _babys-first-foren.png.extracted/112B3 hidden.zip

└─$ unzip hidden.zip      
Archive:  hidden.zip
  inflating: temp.txt                

└─$ cat temp.txt 
...
The part you're looking for is leaRN3d_s0m3th1nG_.                                                                           
```

3\. Examine manipulated pixels -> `zsteg`

```sh
└─$ zsteg babys-first-foren.png 
meta Author         .. text: "bcactf{i_h0P3_y0u_"
b1,rgb,lsb,xy       .. text: "b9cvG8nf}"
```

Flag: `bcactf{i_h0P3_y0u_leaRN3d_s0m3th1nG_b9cvG8nf}`