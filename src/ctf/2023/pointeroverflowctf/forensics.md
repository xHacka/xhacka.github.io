# Forensics Challenges

## If You Don't, Remember Me

### Description

Here is a PDF file that seems to have some problems. I'm not sure what it used to be, but that's not important. I know it contains the flag, but I'm sure you can find it and drag it out of the file somehow. This is a two-step flag as you will find it partially encoded.

[Download DF1.pdf](https://uwspedu-my.sharepoint.com/:b:/g/personal/cjohnson_uwsp_edu/EdhtgZup9QFLkuc2N5IzwpgBV4VRkYZoVLBuonJJ0qfpsg?e=alTbB0)

### Solution

The downloaded pdf can't be viewed, the second thing I tried is running [strings](https://linux.die.net/man/1/strings)

```bash
└─$ strings -d -n 10 DF1.pdf 
9"h(@J#>\u
`h0Nf<kI*N
uB*Mm!qo~S
poctf(uwsp_77333163306D335F37305F3768335F39346D33}
```
::: tip Flag
`poctf(uwsp_77333163306D335F37305F3768335F39346D33}`
:::

## A Petty Wage in Regret

### Description

Here is a very interesting image. The flag has been broken up into several parts and embedded within it, so it will take a variety of skills to assemble it.

[Download DF2.jpg](https://uwspedu-my.sharepoint.com/:i:/g/personal/cjohnson_uwsp_edu/EUU6XEnKsk1BopS8Iz0JAD8B1yHWrVJZXYnmbCqhIPYVHw?e=sLK92J)

### Solution

#### Part 1

First let's view the metadata of image using [exiftool](https://linux.die.net/man/1/exiftool)

```bash
└─$ exiftool ./DF2.jpg 
ExifTool Version Number         : 12.60
File Name                       : DF2.jpg
...
Artist                          : Jeff Lee Johnson
Copyright                       : 2023
User Comment                    : 3A3A50312F323A3A20706F6374667B757773705F3768335F7730726C645F683464
Compression                     : JPEG (old-style)
Thumbnail Offset                : 418
Thumbnail Length                : 7000
...
```

Using [xxd](https://linux.die.net/man/1/xxd) convert hex to ascii

```bash
└─$ echo -n '3A3A50312F323A3A20706F6374667B757773705F3768335F7730726C645F683464' | xxd -r -p
::P1/2:: poctf{uwsp_7h3_w0rld_h4d    
```

#### Part 2

If you open the image and look at it you'll notice some weird strokes, like writing on frozen glass. The strokes are clear and outside seems blurred. I wasnt sure what to use to reveal the strokes.

Using [FotoForensics](https://fotoforensics.com/analysis.php?id=1eeead1953598312d07b200cbc6d11093e66c33b.358717) I was able uncover the strokes using ELA (Error Level Analysis)

![a-petty-wage-in-regret-1.png](/assets/ctf/pointeroverflowctf/a-petty-wage-in-regret-1.png)
::: tip Flag
`poctf{uwsp_7h3_w0rld_h4d_17_f1257}`
:::


## Better to Burn in the Light

### Description

This is an image of a disk that once contained several files. They were deleted prior to imaging, unfortunately. To find the flag, we're going to need to bring some of them back from the dead. The flag is actually broken up between two of them. Carve the files out of the image and restore any missing file headers to find the pieces to reassemble.

[Download DF3.001](https://uwspedu-my.sharepoint.com/:u:/g/personal/cjohnson_uwsp_edu/Efkglq1V9PtAqZxOU5IEoFABx3eLJ2x383ume8dllMiSqQ?e=LOhNdP) 

### Analysis

Basic file check:
 
```bash
└─$ file DF3.001 
DF3.001: DOS/MBR boot sector, code offset 0x3c+2, OEM-ID "MSDOS5.0", sectors/cluster 2, reserved sectors 2, root entries 512, Media descriptor 0xf8, sectors/FAT 199, sectors/track 1, heads 1, sectors 101888 (volumes > 32 MB), reserved 0x1, serial number 0x92cceb28, unlabeled, FAT (16 bit)
```

Mount the device: 

```
└─$ sudo mount -o loop -t vfat DF3.001 /mnt/tmpmount
```

Let's see what we have

```bash
└─$ type lta
lta is an alias for eza -al --icons --tree

└─$ lta /mnt/tmpmount 
drwxr-xr-x    - root  1 Jan  1970  /mnt/tmpmount
drwxr-xr-x    - root 25 Nov  2020 ├──  $RECYCLE.BIN
.rwxr-xr-x   46 root 25 Nov  2020 │  ├──  $I1JT6ML
.rwxr-xr-x   70 root 25 Nov  2020 │  ├──  $I1RUIJS.jfif
.rwxr-xr-x   46 root 25 Nov  2020 │  ├──  $I4K6JU8.doc
.rwxr-xr-x   46 root 25 Nov  2020 │  ├──  $I6U19JT
.rwxr-xr-x   46 root 25 Nov  2020 │  ├──  $I78DQZ4.doc
.rwxr-xr-x   46 root 25 Nov  2020 │  ├──  $ILLD6JM.pdf
.rwxr-xr-x   46 root 25 Nov  2020 │  ├──  $ILVJHWX
.rwxr-xr-x   70 root 25 Nov  2020 │  ├──  $IMZ3DC2.jfif
.rwxr-xr-x   46 root 25 Nov  2020 │  ├──  $IN367L5.jpg
.rwxr-xr-x   46 root 25 Nov  2020 │  ├──  $IR2JURS.pdf
.rwxr-xr-x   72 root 25 Nov  2020 │  ├──  $IR8C3JL.jfif
.rwxr-xr-x   46 root 25 Nov  2020 │  ├──  $IRCQ0TS.doc
.rwxr-xr-x   46 root 25 Nov  2020 │  ├──  $ISVTOM0.jpg
.rwxr-xr-x   46 root 25 Nov  2020 │  ├──  $IU8JFWN.jpg
.rwxr-xr-x   72 root 25 Nov  2020 │  ├──  $IV17FNH.jfif
.rwxr-xr-x   46 root 25 Nov  2020 │  ├──  $IV52S0Q.doc
.rwxr-xr-x 8.2k root 25 Nov  2020 │  ├──  $R1JT6ML
.rwxr-xr-x 329k root 25 Nov  2020 │  ├──  $R1RUIJS.jfif
.rwxr-xr-x 9.3k root 25 Nov  2020 │  ├──  $R4K6JU8.doc
.rwxr-xr-x 8.2k root 25 Nov  2020 │  ├──  $R6U19JT
.rwxr-xr-x  10k root 25 Nov  2020 │  ├──  $R78DQZ4.doc
.rwxr-xr-x 2.7k root 25 Nov  2020 │  ├──  $RLLD6JM.pdf
.rwxr-xr-x 8.2k root 25 Nov  2020 │  ├──  $RLVJHWX
.rwxr-xr-x 186k root 25 Nov  2020 │  ├──  $RMZ3DC2.jfif
.rwxr-xr-x 7.3k root 25 Nov  2020 │  ├──  $RN367L5.jpg
.rwxr-xr-x 3.1k root 25 Nov  2020 │  ├──  $RR2JURS.pdf
.rwxr-xr-x  30k root 25 Nov  2020 │  ├──  $RR8C3JL.jfif
.rwxr-xr-x  10k root 25 Nov  2020 │  ├──  $RRCQ0TS.doc
.rwxr-xr-x 8.2k root 25 Nov  2020 │  ├──  $RSVTOM0.jpg
.rwxr-xr-x 8.2k root 25 Nov  2020 │  ├──  $RU8JFWN.jpg
.rwxr-xr-x  34k root 25 Nov  2020 │  ├──  $RV17FNH.jfif
.rwxr-xr-x  10k root 25 Nov  2020 │  ├──  $RV52S0Q.doc
.rwxr-xr-x  129 root 25 Nov  2020 │  └──  desktop.ini
.rwxr-xr-x  10k root 25 Nov  2020 ├──  1.doc
.rwxr-xr-x  10k root 25 Nov  2020 ├──  5.doc
.rwxr-xr-x 8.2k root 25 Nov  2020 ├──  6.jpg
.rwxr-xr-x  10k root 25 Nov  2020 ├──  9.doc
.rwxr-xr-x  10k root 25 Nov  2020 ├──  A.doc
.rwxr-xr-x 275k root 25 Nov  2020 ├──  alibis.pdf
.rwxr-xr-x 880k root 25 Nov  2020 ├──  Apple_2_Disk_Drive_Sound_Simulator__v1,1b.zip
.rwxr-xr-x 249k root 25 Nov  2020 ├──  astclock__v1,6f.zip
.rwxr-xr-x 8.2k root 25 Nov  2020 ├──  b.jpg
.rwxr-xr-x 255k root 25 Nov  2020 ├──  bigmouse__v1,4f.zip
.rwxr-xr-x 3.1k root 25 Nov  2020 ├──  c.pdf
.rwxr-xr-x  40k root 25 Nov  2020 ├──  download (1).jfif
.rwxr-xr-x 341k root 25 Nov  2020 ├──  download (3).jfif
.rwxr-xr-x 110k root 25 Nov  2020 ├──  download (4).jfif
.rwxr-xr-x  51k root 25 Nov  2020 ├──  download (5).jfif
.rwxr-xr-x  42k root 25 Nov  2020 ├──  download (7).jfif
.rwxr-xr-x  56k root 25 Nov  2020 ├──  download (8).jfif
.rwxr-xr-x  59k root 25 Nov  2020 ├──  download (9).jfif
.rwxr-xr-x 100k root 25 Nov  2020 ├──  download (10).jfif
.rwxr-xr-x  39k root 25 Nov  2020 ├──  download (11).jfif
.rwxr-xr-x  94k root 25 Nov  2020 ├──  download (12).jfif
.rwxr-xr-x  17k root 25 Nov  2020 ├──  download (14).jfif
.rwxr-xr-x  87k root 25 Nov  2020 ├──  download (15).jfif
.rwxr-xr-x 8.1k root 25 Nov  2020 ├──  download (16).jfif
.rwxr-xr-x  43k root 25 Nov  2020 ├──  download (18).jfif
.rwxr-xr-x  76k root 25 Nov  2020 ├──  download.jfif
.rwxr-xr-x 149k root 25 Nov  2020 ├──  droppings.zip
.rwxr-xr-x  10k root 25 Nov  2020 ├──  f.doc
.rwxr-xr-x 3.3M root 25 Nov  2020 ├──  HxDSetup.zip
.rwxr-xr-x  10k root 25 Nov  2020 ├──  k.doc
.rwxr-xr-x 281k root 25 Nov  2020 ├──  lies.docx
.rwxr-xr-x 1.2M root 25 Nov  2020 ├──  Mousotronsetup.exe
.rwxr-xr-x  10k root 25 Nov  2020 ├──  P.doc
.rwxr-xr-x 1.7M root 25 Nov  2020 ├──  PaperAirplane.zip
.rwxr-xr-x    9 root 25 Nov  2020 ├──  password.txt
.rwxr-xr-x  10k root 25 Nov  2020 ├──  q.doc
.rwxr-xr-x 8.2k root 25 Nov  2020 ├──  r.jpg
.rwxr-xr-x  25k root 25 Nov  2020 ├──  secrets.docx
drwxr-xr-x    - root 25 Nov  2020 ├──  System Volume Information
.rwxr-xr-x   12 root 25 Nov  2020 │  └──  WPSettings.dat
.rwxr-xr-x 8.2k root 25 Nov  2020 ├──  V.jpg
.rwxr-xr-x 3.1k root 25 Nov  2020 ├──  x.pdf
.rwxr-xr-x  10k root 25 Nov  2020 ├──  Y.doc
.rwxr-xr-x 8.2k root 25 Nov  2020 └──  Z.jpg
```

We have too much files, since I wasnt sure what I was looking for I tried to dig information from exifdata.

While browsing through the files I found interesting comment:
```bash
└─$ exiftool /mnt/tmpmount/* | less
...
======== /mnt/tmpmount/$RECYCLE.BIN/$RN367L5.jpg
ExifTool Version Number         : 12.60
File Name                       : $RN367L5.jpg
Directory                       : /mnt/tmpmount/$RECYCLE.BIN
File Size                       : 7.3 kB
...
File Type                       : JPEG
File Type Extension             : jpg
MIME Type                       : image/jpeg 
...
Camera Model Name               : NU75
User Comment                    : CLUE 2 - 1 / 2 == 0.5a | 0.5b && 0.5a / 2 == 0.5a | 0.5c
Compression                     : JPEG (old-style)
Thumbnail Offset                : 210
Thumbnail Length                : 1138
```

Since flag was broken up into 2 pieces I tried recursive grep:

```bash
└─$ grep "CLUE" /mnt/tmpmount -Rain
/mnt/tmpmount/$RECYCLE.BIN/$R4K6JU8.doc:1:JFIF,,��ExifII2NU75i�8�Ligma��JASCIICLUE 1 - Missing header�P����JFIF,,��C
/mnt/tmpmount/$RECYCLE.BIN/$RN367L5.jpg:1:����JFIF,,��.ExifII2NU75i�8�Ligma��@JASCIICLUE 2 - 1 / 2 == 0.5a | 0.5b && 0.5a / 2 == 0.5a | 0.5c�r����JFIF,,��C
```

### Solution

#### File 1: `$R4K6JU8.doc`

The file seems have `doc` extensions, but seems to be a JFIF (or jpeg) type.

Magic bytes: <https://www.wikiwand.com/en/List_of_file_signatures>

Looking into the magic bytes (or file signatures) we see that the file seems to be missing first 4 bytes, without these 4 bytes its invalid.

![better-to-burn-in-the-light-1](/assets/ctf/pointeroverflowctf/better-to-burn-in-the-light-1.png)

![better-to-burn-in-the-light-2](/assets/ctf/pointeroverflowctf/better-to-burn-in-the-light-2.png)

Im using VSCode [Hex Editor](https://marketplace.visualstudio.com/items?itemName=ms-vscode.hexeditor) to edit the image. Since we can't copy the bytes as UTF8 I'll use Base64 to insert the bytes.

```bash
# Hex -> Characters -> Base64
└─$ echo -n 'FF D8 FF E0' | xxd -r -p | base64
/9j/4A==
```

![better-to-burn-in-the-light-3](/assets/ctf/pointeroverflowctf/better-to-burn-in-the-light-3.png)

![better-to-burn-in-the-light-4](/assets/ctf/pointeroverflowctf/better-to-burn-in-the-light-4.png)

Change extension to `jpg` or `jpeg`

![better-to-burn-in-the-light-5](/assets/ctf/pointeroverflowctf/better-to-burn-in-the-light-5.jpg)

#### File 2: `$RN367L5.jpg`

Oddly enough `VSCode` couldnt open it or ImageMagick. Using [Ristretto Image Viewer](https://docs.xfce.org/apps/ristretto/start) I was able to view the image normally.

![better-to-burn-in-the-light-6](/assets/ctf/pointeroverflowctf/better-to-burn-in-the-light-6.png)
::: tip Flag
`poctf{uwsp_5h1v3r_m3_71mb3r5}`
:::


> Dont forget to unmount the device
> ```bash
> └─$ sudo umount /mnt/tmpmount::: danger :no_entry:
```
:::