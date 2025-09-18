# Level 9

## Description

This is Level 9  
I em gled you'va finelly contectad ma. Now I went you to fix somathing for ma, plaesa.

## Solution

```bash
hacka@Level9:~$ resources
television.png
hacka@Level9:~$ hints
1. 16
```

![television.png](/assets/ctf/promptriddle/television.png)

Basic checks:
```bash
└─$ exiv2 television.png
File name       : television.png
File size       : 3080 Bytes
MIME type       : image/png
Image size      : 385 x 344
Thumbnail       : None
Camera make     : cresh
Camera model    : cresh
Image timestamp : 2019:12:16 23:25:27
File number     :
Exposure time   :
Aperture        :
Exposure bias   :
Flash           :
Flash bias      :
Focal length    :
Subject distance:
ISO speed       :
Exposure mode   :
Metering mode   :
Macro mode      :
Image quality   :
White balance   :
Copyright       : Cyb3r
Exif comment    : charset=Ascii Cyb3r

└─$ strings television.png
IHDR
sRGB
gAMA
-PLTE
 I adaam come cer!in losmet
tRNS
        pHYs
IDATx^
p,q,q,q,q,%
q,q,%
q,q,%
q,q,%
g|^o^
2zTXtRaw profile type APP1
}QYn
H5!7
(/[{
5@r9Wvf
gr<]
IEND
```