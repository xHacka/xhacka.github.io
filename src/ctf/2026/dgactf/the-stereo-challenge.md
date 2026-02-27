# The Stereo Challenge

## Description

Required information:
1. Sensitivity threshold is 0.6
2. -n2 -b 16384
 
[The_Stereo_Challenge.rar](https://dgactf.com/files/113286a7052a0e9f01fd4d08893c07db/The_Stereo_Challenge.rar?token=eyJ1c2VyX2lkIjoyMCwidGVhbV9pZCI6bnVsbCwiZmlsZV9pZCI6Nn0.aYBSXg.RxK_sBhcpGU9QNp_coJuiSgmB0g)

## Solution

When listening to audio I noticed it used DTMF 
- [https://dtmf.netlify.app](https://dtmf.netlify.app)

The analysis returns `342777338777666` which decodes to `DGARETRO`

![the-stereo-challenge.png](/assets/ctf/dgactf/the-stereo-challenge.png)

This is not the flag, more information is required.

Separate the channels
```bash
└─$ ffprobe -v error -show_entries stream=channels -of default=nw=1:nk=1 havefun.wav
2

└─$ ffmpeg -i havefun.wav -af "pan=mono|c0=c0" channel0.wav
└─$ ffmpeg -i havefun.wav -af "pan=mono|c0=c1" channel1.wav
```

`channel1.wav` seems to be extracted from [Rammstein - Sonne (Official Video)](https://youtu.be/StZcUAPRRac)

I think we can ignore this. There's some difference in compared to original exported from Youtube, but it's definitely masked to create noise in original file.

![the-stereo-challenge-1.png](/assets/ctf/dgactf/the-stereo-challenge-1.png)

I started exploring some tools related to Steganography and came across this
- [https://0xrick.github.io/lists/stego/#wavsteg](https://0xrick.github.io/lists/stego/#wavsteg)

```bash
└─$ stegolsb wavsteg -r -i havefun.wav  -o here.txt -n 2 -b 16384
└─$ stegolsb wavsteg -r -i channel0.wav  -o chan0.txt -n 2 -b 16384
└─$ stegolsb wavsteg -r -i channel1.wav  -o chan1.txt -n 2 -b 16384
└─$ file *.txt
chan0.txt: data
chan1.txt: RAR archive data, v5
here.txt:  data
```

Oh?!

```bash
└─$ unrar x chan1.rar

UNRAR 7.20 beta 2 freeware      Copyright (c) 1993-2025 Alexander Roshal

Extracting from chan1.rar

Enter password (will not be echoed) for LSB/Flag.docx: DGARETRO # From DTMF

The specified password is incorrect.
Enter password (will not be echoed) for LSB/Flag.docx: RETRO # Only word

The specified password is incorrect.
Enter password (will not be echoed) for LSB/Flag.docx: dgaretro # Lowercase

Creating    LSB                                                       OK
Extracting  LSB/Flag.docx                                             OK
LSB/Password.txt - use current password? [Y]es, [N]o, [A]ll A

Extracting  LSB/Password.txt                                          OK
All OK
```

> Password: `dgaretro`

```bash
└─$ cat Password.txt
name the song that caused a dos issue in 2022 write the answer in lowercase with no spaces 
```

Google: That's the famous Janet Jackson - "Rhythm Nation" incident. In 2022, it was revealed (and assigned CVE-2022-38392) that playing this song could crash certain 5400 RPM laptop hard drives because the music video contained a frequency matching their natural resonant frequency. Literally a song causing a denial of service.

> Password: `rhythmnation`

![the-stereo-challenge-2.png](/assets/ctf/dgactf/the-stereo-challenge-2.png)

::: tip Flag
`DGA{Music_Is_The_Key}`
:::


