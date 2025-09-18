# Space Ahoy

## Description

Brian tries to send some crucial information from the spacestation about an impending disaster through a super secure line to his friend through a picture.  
Help his friend uncover the truth...  
  
**Author**: Rakhul

Downloads: [super_secret.jpg](https://traboda-arena-87.s3.amazonaws.com/files/attachments/super_secret_4bfed2fc-09d7-460e-a46a-09827cfeb2d7.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIA6GUFVMV6HO3NYL6Z%2F20230806%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Date=20230806T091853Z&X-Amz-Expires=3600&X-Amz-SignedHeaders=host&X-Amz-Signature=2787546f8a53084af90a64292acc92fbb246017cbeef5bcc35dbd3ff261efc89)

## Solution

So we get an image and... it's awfully big o_o <br>
10mb image? I used binwalk right away and there's archive inside.

```bash
└─$ la 
Permissions Size User Date Modified Name
.rwxr-x---  9.9M kali  6 Aug 13:19   super_secret.jpg
                                                                               
└─$ binwalk --dd='.*' ./super_secret.jpg 

DECIMAL       HEXADECIMAL     DESCRIPTION
--------------------------------------------------------------------------------
0             0x0             JPEG image data, JFIF standard 1.01
166246        0x28966         Zip archive data, at least v1.0 to extract, compressed size: 9725992, uncompressed size: 9725992, name: hidden.jpg
9892256       0x96F1A0        End of Zip archive, footer length: 22
9892370       0x96F212        End of Zip archive, footer length: 22

└─$ mv _super_secret.jpg.extracted/28966 hidden.zip
                                                                                                       
└─$ unzip hidden.zip 
Archive:  hidden.zip
 extracting: hidden.jpg              
                                                                                                       
└─$ la
Permissions Size User Date Modified Name
drwxr-xr-x     - kali  6 Aug 13:25   _super_secret.jpg.extracted
.rw-r--r--  9.7M kali 19 Apr  2022   hidden.jpg # Extracted Image, Again Really Huge
.rw-r--r--  9.7M kali  6 Aug 13:20   hidden.zip
.rwxr-x---  9.9M kali  6 Aug 13:19   super_secret.jpg

└─$ binwalk --dd='.*' ./hidden.jpg      

DECIMAL       HEXADECIMAL     DESCRIPTION
--------------------------------------------------------------------------------
0             0x0             JPEG image data, JFIF standard 1.01
30            0x1E            TIFF image data, little-endian offset of first image directory: 8
39697         0x9B11          Zip archive data, at least v2.0 to extract, compressed size: 9686117, uncompressed size: 10611338, name: SupEr_s3CrET_AuD10.wav
9725970       0x946812        End of Zip archive, footer length: 22

                                                                                                       
└─$ mv _hidden.jpg.extracted/9B11 super_secret.zip                      
                                                                                                       
└─$ unzip super_secret.zip 
Archive:  super_secret.zip
  inflating: SupEr_s3CrET_AuD10.wav  
```

I opened the `wav` file in [Sonic Visualiser](https://www.sonicvisualiser.org) and got some garbage audio.. It feels like radio audio? Combined with title I found QSSTV tool and a really interesting tutorial.

[Ham Radio and Linux - Using QSSTV to decode from captured audio files](https://youtu.be/sVLcImKryvE)

Turns out the `wav` file is from space! This is how astronauts send pictures (or messages).

Setup `QSSTV` and use it to decode the `wav`.

![space-ahoy-1](/assets/ctf/deconstructf/space-ahoy-1.png)

Using online [QR Decoder](https://qrcode-decoder.com) we get the flag.
::: tip Flag
`dsc{un5af3_sp4C3_coD3}`
:::