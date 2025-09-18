# Two Path

# Two Path

### Description

Logan gave me this image file before disappearing..\
I've been breaking my head over it for long\
Can you decode it?

**Author**: Rakhul

Downloads: [hello.jpg](https://traboda-arena-87.s3.amazonaws.com/files/attachments/hello_572b0cb9-f30b-4d41-8dec-55d313b4e45b.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256\&X-Amz-Credential=AKIA6GUFVMV6HO3NYL6Z%2F20230806%2Fap-south-1%2Fs3%2Faws4_request\&X-Amz-Date=20230806T101347Z\&X-Amz-Expires=3600\&X-Amz-SignedHeaders=host\&X-Amz-Signature=8d4a68beebda405afcf0d41adc132f5ce22d3948608a267203f400939df84d1c)

### Solution

```bash
└─$ la
Permissions Size User Date Modified Name
.rwxrwx---   42M kali  5 Aug 22:39   hello.jpg
```

Image file is awfully huge, so first I tried `binwalk`

```bash
└─$ binwalk --dd='.*' ./hello.jpg

DECIMAL       HEXADECIMAL     DESCRIPTION
--------------------------------------------------------------------------------
0             0x0             JPEG image data, JFIF standard 1.01
30            0x1E            TIFF image data, little-endian offset of first image directory: 8
1801          0x709           Copyright string: "Copyright (c) 1998 Hewlett-Packard Company"
86856         0x15348         Zip archive data, at least v2.0 to extract, compressed size: 151849, uncompressed size: 152413, name: greenpill.jpg
238726        0x3A486         End of Zip archive, footer length: 22
238748        0x3A49C         Zip archive data, at least v1.0 to extract, compressed size: 41267125, uncompressed size: 41267125, name: redpill.jpg
41505892      0x2795464       End of Zip archive, footer length: 22
41506102      0x2795536       End of Zip archive, footer length: 22

└─$ mv _hello.jpg.extracted/3A49C red.zip # <https://youtu.be/zE7PKRjrid4>

└─$ unzip red.zip # Didnt work

└─$ 7z x red.zip # Worked (Showed some errors, but file got extracted)

└─$ la
Permissions Size User Date Modified Name
.rw-r--r--   41M kali 25 May  2022   redpill.jpg # Again huge image

└─$ binwalk --dd='.*' ./redpill.jpg 

DECIMAL       HEXADECIMAL     DESCRIPTION
--------------------------------------------------------------------------------
0             0x0             JPEG image data, JFIF standard 1.01
68806         0x10CC6         Zip archive data, at least v2.0 to extract, compressed size: 1228, uncompressed size: 175644, name: morse.wav
70073         0x111B9         Zip archive data, at least v1.0 to extract, compressed size: 41196805, uncompressed size: 41196805, name: secrett.zip
41266897      0x275AED1       End of Zip archive, footer length: 22
41267103      0x275AF9F       End of Zip archive, footer length: 22

└─$ mv _redpill.jpg.extracted/10CC6 hidden.zip

└─$ unzip hidden.zip 
Archive:  hidden.zip
  inflating: morse.wav               
 extracting: secrett.zip             
```

`secrett.zip` requires a password, so let's open `morse.wav`.

We can decode `morse` using [https://morsecode.world/international/decoder/audio-decoder-adaptive.html](https://morsecode.world/international/decoder/audio-decoder-adaptive.html)

![two-path-1](/assets/ctf/deconstructf/two-path-1.png)

::: info :information_source:
THE PASSWORD IS THE HOVERCRAFT OF MORPHEUS
:::

_The hovercraft is a vehicle that Morpheus uses to travel between the Matrix and the real world._\
&#xNAN;_&#x54;he hovercraft of Morpheus is called the Nebuchadnezzar. It is a heavily modified Sikorsky S-92A chopper that is used by Morpheus and his crew to travel between the Matrix and the real world. The Nebuchadnezzar is equipped with a variety of weapons and sensors, and it is also capable of underwater travel._\
&#xNAN;_&#x54;he name Nebuchadnezzar is a reference to the king of Babylon who was known for his wisdom and power. The name is fitting for the hovercraft, as it is a powerful and versatile vehicle that is used by Morpheus to carry out his mission to free humanity from the Matrix._

Ok, enough backstory. The password should be `nebuchadnezzar`

```bash
└─$ 7z x ./secrett.zip                  
... 
Enter password (will not be echoed): # Enter password
Everything is Ok      
...

└─$ la
Permissions Size User Date Modified Name
.rwxr--r--   55M kali 25 May  2022   deep_secret.wav
```

Hmm... Pretty good beats for a challenge, but no secret message, no spectogram... `deep_secret`... [Deep Sound](https://wiki.bi0s.in/steganography/deep-sound/)?

::: info :information_source:
DeepSound only works on Windows
:::

![two-path-2](/assets/ctf/deconstructf/two-path-2.png)

::: tip Flag
`dsc{u\_ch053\_THE\_cOrr3Ct\_pill!}`
:::
