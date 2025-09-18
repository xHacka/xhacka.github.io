# Do You Hear That?

# do you hear that?

## Description

I'm not sure why, but when I look at this image I can hear some sort of faint sound. Do you hear it too?

[help.png](https://nbctf.com/uploads?key=45cfdb6afde3e7612fd21abbce7216d07270023d7864e1859d8f3363f89a304f%2Fhelp.png)

![help.png](/assets/ctf/nbctf/help.png)

Author: kroot

## Solution

Since we are given PNG let's first check metadata:

```bash
└─$ exiftool help.png 
<snip>
File Name     : help.png
File Size     : 353 kB
Warning       : [minor] Text/EXIF chunk(s) found after PNG IDAT (may be ignored by some readers) 
<snip>
```

Binwalk didnt find anything hidden:

```bash
└─$ binwalk --dd='.*' ./help.png 

DECIMAL       HEXADECIMAL     DESCRIPTION
--------------------------------------------------------------------------------
0             0x0             PNG image, 639 x 639, 8-bit/color RGBA, non-interlaced
41            0x29            Zlib compressed data, compressed
35334         0x8A06          TIFF image data, big-endian, offset of first image directory: 8
```

Manual check for extra file:

```bash
└─$ xxd help.png | grep IEND -A 10
00008a10: 0000 0000 00d2 5393 0000 0000 4945 4e44  ......S.....IEND
00008a20: ae42 6082 5249 4646 74d8 0400 5741 5645  .B`.RIFFt...WAVE
00008a30: 666d 7420 1000 0000 0100 0100 44ac 0000  fmt ........D...
00008a40: 8858 0100 0200 1000 6461 7461 50d8 0400  .X......dataP...
00008a50: 0000 0000 0100 0300 0500 0800 0a00 0b00  ................
00008a60: 0b00 0900 0600 0200 feff f9ff f6ff f4ff  ................
00008a70: f5ff f7ff fbff 0000 0400 0800 0900 0600  ................
00008a80: 0000 f7ff ecff e0ff d5ff cdff c8ff c8ff  ................
00008a90: ceff d7ff e3ff f0ff fbff 0300 0500 0100  ................
00008aa0: f7ff e9ff d8ff c9ff beff b9ff bdff cbff  ................
00008ab0: e0ff fdff 1b00 3900 5100 6000 6400 5c00  ......9.Q.`.d.\.
```

RIFF? Checking the [Magic Bytes](https://www.wikiwand.com/en/List_of_file_signatures) we find [Waveform Audio File Format](https://www.wikiwand.com/en/Waveform_Audio_File_Format). So lets manually carve it for us to use.

```bash
└─$ dd if=help.png of=flag.wav skip=35364 bs=1 
317564+0 records in
317564+0 records out
317564 bytes (318 kB, 310 KiB) copied, 1.20534 s, 263 kB/s

└─$ xxd flag.wav | head                         
00000000: 5249 4646 74d8 0400 5741 5645 666d 7420  RIFFt...WAVEfmt 
00000010: 1000 0000 0100 0100 44ac 0000 8858 0100  ........D....X..
00000020: 0200 1000 6461 7461 50d8 0400 0000 0000  ....dataP.......
00000030: 0100 0300 0500 0800 0a00 0b00 0b00 0900  ................
00000040: 0600 0200 feff f9ff f6ff f4ff f5ff f7ff  ................
00000050: fbff 0000 0400 0800 0900 0600 0000 f7ff  ................
00000060: ecff e0ff d5ff cdff c8ff c8ff ceff d7ff  ................
00000070: e3ff f0ff fbff 0300 0500 0100 f7ff e9ff  ................
00000080: d8ff c9ff beff b9ff bdff cbff e0ff fdff  ................
00000090: 1b00 3900 5100 6000 6400 5c00 4b00 3200  ..9.Q.`.d.\.K.2.
```
::: info :information_source:
Why 35364 bytes? xxd offset: 0x00008a20 + 4 bytes (till RIFF) -> converted to int 
:::

![do-you-hear-that-2](/assets/ctf/nbctf/do-you-hear-that-2.png)
::: tip Flag
`nbctf{y0u_h4v3_s0m3_g00d_34rs}`
:::