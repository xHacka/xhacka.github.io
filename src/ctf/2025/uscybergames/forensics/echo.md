# Echo

## Description

SIV Pipeline Forensics Group 3

[Echo.jpg](https://ctf.uscybergames.com/files/ca192acdf28c26ab8ea72b485bef1ccd/Echo.jpg?token=eyJ1c2VyX2lkIjoxMDY4LCJ0ZWFtX2lkIjpudWxsLCJmaWxlX2lkIjoxOX0.aExLGg.xFFFE75h7yqh0zZaOzzgCQTyO5Q)

## Solution

We are given a JPG file of a cat.

```bash
└─$ file Echo.jpg
Echo.jpg: JPEG image data, JFIF standard 1.01, resolution (DPI), density 300x300, segment length 16, Exif Standard: [TIFF image data, big-endian, direntries=11, manufacturer=NIKON CORPORATION, model=NIKON D80, orientation=upper-left, xresolution=2234, yresolution=2242, resolutionunit=2, software=Microsoft Windows Photo Viewer 6.1.7600.16385, datetime=2010:11:21 21:00:18], baseline, precision 8, 1795x2397, components 3

└─$ /bin/ls -hl Echo.jpg
-rwxrwx--- 1 root vboxsf 2.8M Jun 13 12:00 Echo.jpg
```

Simple `strings` reveals the flag at the end.
```bash
└─$ strings Echo.jpg | tail -1
SVBRG{HEXEDITING}
```

::: tip Flag
`SVBRG{HEXEDITING}`
:::

