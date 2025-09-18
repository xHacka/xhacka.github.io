# PixelPerfect

## Description

PixelPerfect | 128 points

Wait, should this file be that large? I thought my phone was perfect?

Downloads: [PixelPerfect.tar.gz](https://ctf.kitctf.de/files/f11ffdb3d28838e1864843dc26f0a4ab/PixelPerfect.tar.gz?token=eyJ1c2VyX2lkIjo4MzksInRlYW1faWQiOjUwNCwiZmlsZV9pZCI6NjN9.ZISQbg.Et51u2XvHLBxWXXqLPKdvWfmahk)

## Analysis

Challenge file is a screenshot image which seems broken. <br> `strings` shows nothing of interest.

But `exiftool` on the other hand shows us a warning
```
Warning                         : [minor] Trailer data after PNG IEND chunk
```

`zsteg` shows more details about trailing chunk.
```sh
└─$ zsteg PXL5_SREENSHOT.png   
[?] 161095 bytes of extra data after image end (IEND), offset = 0x446d9
```

I looked up the value and the image contains 2 `IEND` parts, which shouldn't be there, every PNG file should have single `IEND` to indicate EOF.

Even if we extract the excess data it would be really hard to create proper header, there must be something else...

Lurking around google to find something useful I came across a glaring bold text...
![pixel-perfect-1](/assets/ctf/gnp-ctf/pixel-perfect-1.png)

[**_CVE-2023-21036_**](https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2023-21036)
> In BitmapExport.java, there is a possible failure to truncate images due to a logic error in the code.Product: AndroidVersions: Android kernelAndroid ID: A-264261868References: N/A

[**The Post**](https://arstechnica.com/gadgets/2023/03/google-pixel-bug-lets-you-uncrop-the-last-four-years-of-screenshots/) goes into more details.

## Solution

Post also contains proof-of-concept tool: <a href="https://acropalypse.app/">https://acropalypse.app/</a> 

![pixel-perfect-2](/assets/ctf/gnp-ctf/pixel-perfect-2.png)

`GPNCTF{N0t_s0_p3rf3ct_aft3rall}`