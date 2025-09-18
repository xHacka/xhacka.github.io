# Secrets

## Description

Author: clides

Being the APT (advanced persistent troll) he is, clides continued to play around with Claudio Pacheco's laptop without him knowing. He even gained access to Claudio's friend's device. On that device, he found this strange looking file and he wants to know what it contains.

Can you help clides retrieve hidden info from this file?

[foren3.zip](https://ctfmgci.jonathanw.dev/dl/bxmctf2023/foren3.zip)

## Analysis

We are given a file without extension
```sh
└─$ file BxM_Foren3                                                                   
BxM_Foren3: data
```

Using `exiftool` shows us
```sh
File Type                       : BMP
File Type Extension             : bmp
MIME Type                       : image/bmp
```

Let's change the extension and try to open it
```sh
└─$ mv BxM_Foren3 BxM_Foren3.bmp 

└─$ display ./BxM_Foren3.bmp 
```
![secrets-1](/assets/ctf/mgci-ctf-club/secrets-1.png)

Image is distorted and contains a fake flag (from sarcasm). So where is the flag? Since file looks damaged we should restore it. 

The easiest way is to fix image files are to compare them to "not broken" images.
![secrets-2](/assets/ctf/mgci-ctf-club/secrets-2.png)

I have outlined interesting bytes, interesting because it says `DEAD` (has to do something with damage to file) and it repeats twice. I replaced the values from the right (image) and when we reopen image something changes!
![secrets-3](/assets/ctf/mgci-ctf-club/secrets-3.png)

Ok.. The colors are fixed but image is still distorted. What did we change to effect image?

Let's look at the BMP anatomy [here](https://www.wikiwand.com/en/BMP_file_format#Bitmap_file_header)

1\. First part which we changed was `The offset`

| Offset hex | Offset dec | Size    | Purpose                                                                                                | 
| 0A         | 10         | 4 bytes | The offset, i.e. starting address, of the byte where the bitmap image data (pixel array) can be found. | 

2\. The second part `Header Size`

| Offset (hex) | Offset (dec) | Size (bytes) | OS/2 1.x BITMAPCOREHEADER          |
| 0E           | 14           | 4            | The size of this header (12 bytes) |

## Solution

After fiddling around the bits and bytes I found that manipulating the 3rd & 4th byte shift the image vertically. The best bytes that worked are `The offset = 01 00 03 00`
![secrets-4](/assets/ctf/mgci-ctf-club/secrets-4.png)

### PS

Looks like I found a "not intended" way to solve the challenge.

Similar challenge can be found on PicoCTF, [tunn3l_v1s10n](https://github.com/apoirrier/CTFs-writeups/blob/master/PicoCTF/Forensics/tunn3l_v1s10n.md) writeup with "intended" (or correct) way to solve it.