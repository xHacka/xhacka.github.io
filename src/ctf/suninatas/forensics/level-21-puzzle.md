# Level 21   Puzzle

[http://suninatas.com/challenge/web21/web21.asp](http://suninatas.com/challenge/web21/web21.asp)

![level-21---puzzle.png](/assets/ctf/suninatas/forensics/level-21-puzzle.png)

Not positive, but might have to recover the text via image only..
```bash
└─$ curl -LOs http://suninatas.com/challenge/web21/monitor.jpg

└─$ file monitor.jpg
monitor.jpg: JPEG image data, Exif standard: [TIFF image data, little-endian, direntries=11, description=SAMSUNG            , manufacturer=SAMSUNG            , model=SHW-M110S, orientation=upper-left, xresolution=196, yresolution=204, resolutionunit=2, software=fw 49.01 prm 49.104, datetime=2012:05:02 03:23:52], baseline, precision 8, 640x480, components 3

└─$ /bin/ls -lh monitor.jpg
-rwxrwx--- 1 root vboxsf 1.5M Jun 25 13:21 monitor.jpg
```

```
Solution Key Is H4----N_TH3_MIDD33_4TT4CK
```

I thought this was Steganography challenge so I tried running `stegsolve` and it failed, because jpg was not valid.

Check for hidden files:
```bash
└─$ foremost -i monitor.jpg
└─$ tree output
├── audit.txt
└── jpg
    ├── 00000000.jpg
    ├── 00000383.jpg
    ├── 00000765.jpg
    ├── 00001148.jpg
    ├── 00001532.jpg
    ├── 00001914.jpg
    ├── 00002297.jpg
    └── 00002681.jpg
```

![level-21---puzzle-1.png](/assets/ctf/suninatas/forensics/level-21-puzzle-1.png)

::: tip Flag
`H4CC3R_IN_TH3_MIDD33_4TT4CK`
:::