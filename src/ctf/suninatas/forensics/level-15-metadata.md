# Level 15   Metadata

[http://suninatas.com/challenge/web15/web15.asp](http://suninatas.com/challenge/web15/web15.asp)

![level-15--.png](/assets/ctf/suninatas/forensics/level-15-.png)

[Play the Music](http://suninatas.com/challenge/web15/diary.mp3)

```bash
└─$ curl -LO http://suninatas.com/challenge/web15/diary.mp3
└─$ exiftool diary.mp3
ExifTool Version Number         : 12.76
File Name                       : diary.mp3
Directory                       : .
File Size                       : 6.2 MB
File Modification Date/Time     : 2025:06:25 03:30:19-04:00
File Access Date/Time           : 2025:06:25 03:32:43-04:00
File Inode Change Date/Time     : 2025:06:25 03:32:37-04:00
File Permissions                : -rwxrwx---
File Type                       : MP3
File Type Extension             : mp3
MIME Type                       : audio/mpeg
MPEG Audio Version              : 1
Audio Layer                     : 3
Sample Rate                     : 44100
Channel Mode                    : Joint Stereo
MS Stereo                       : On
Intensity Stereo                : Off
Copyright Flag                  : False
Original Media                  : False
Emphasis                        : None
VBR Frames                      : 8112
VBR Bytes                       : 6186059
VBR Scale                       : 100
Encoder                         : LAME3.98r
Lame VBR Quality                : 0
Lame Quality                    : 0
Lame Method                     : VBR (new/mtrh)
Lame Low Pass Filter            : 19.5 kHz
Lame Bitrate                    : 32 kbps
Lame Stereo Mode                : Joint Stereo
ID3 Size                        : 14464
Band                            : ³ªºñ
Title                           : ´ÙÀÌ¾î¸®
Album                           : ´ÙÀÌ¾î¸®
Year                            : 2011
Track                           : 1
User Defined URL                : http://ihoneydew.com/
Picture MIME Type               : image/jpeg
Picture Type                    : Front Cover
Picture Description             :
Picture                         : (Binary data 13289 bytes, use -b option to extract)
Comment (kor)                   : kpop.321.cn
Genre                           : kpop.321.cn
Conductor                       : GoodJobMetaTagSearch
Artist                          : ³ªºñ
Comment                         : kpop.321.cn
Date/Time Original              : 2011
Audio Bitrate                   : 234 kbps
Duration                        : 0:03:32 (approx)
```

Flag turned out to  be `Conductor` tag value

::: tip Flag
`GoodJobMetaTagSearch`
:::

