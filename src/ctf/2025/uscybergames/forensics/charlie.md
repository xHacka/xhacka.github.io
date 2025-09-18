# Charlie

## Description

SIV Pipeline Forensics Group 5

[charlie.jpg](https://ctf.uscybergames.com/files/85a24081168818b5e32f789cf30f0c8c/charlie.jpg?token=eyJ1c2VyX2lkIjoxMDY4LCJ0ZWFtX2lkIjpudWxsLCJmaWxlX2lkIjoxOH0.aExCeA.EetyuVjia8JTlMqhnBgDfZSkpVU)

## Solution

Awfully big JPG file d:
```bash
└─$ file charlie.jpg
charlie.jpg: JPEG image data, JFIF standard 1.01, aspect ratio, density 1x1, segment length 16, baseline, precision 8, 3024x4032, components 3

└─$ ls -hl charlie.jpg
-rwxrwx--- 1 root vboxsf 4.3M Jun 13 11:26 charlie.jpg
```

Extract files within the JPG with `foremost` (or binwalk)
```bash
└─$ foremost -i charlie.jpg -o out
└─$ tree out
out
├── audit.txt
├── jpg
│   └── 00000000.jpg
└── zip
    └── 00008744.zip
└─$ unzip out/zip/00008744.zip
Archive:  out/zip/00008744.zip
  inflating: flag.txt

└─$ cat flag.txt
/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBA...R0HJDn5iPujbQB//9k=
```

Decode and open
```bash
└─$ base64 -d flag.txt > flag
└─$ file flag
flag: JPEG image data, JFIF standard 1.01, aspect ratio, density 1x1, segment length 16, baseline, precision 8, 1000x1000, components 3
```

![Charlie.png](/assets/ctf/uscybergames/charlie.png)

::: tip Flag
`SVBGR{B1NW4LK_F7N}`
:::