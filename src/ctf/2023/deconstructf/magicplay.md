# Magicplay

## Description

Dwayne's mischevious nephew played around in his pc and corrupted a very important file..  
Help dwayne recover it!  
  
**Author**: Rakhul

Downloads: [magic_play.png](https://traboda-arena-87.s3.amazonaws.com/files/attachments/magic_play_c6ba0860-8218-480c-9cdd-dc597f3ab5df.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIA6GUFVMV6HO3NYL6Z%2F20230806%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Date=20230806T094145Z&X-Amz-Expires=3600&X-Amz-SignedHeaders=host&X-Amz-Signature=2d68f349c3ab207cd429df35a631ae9441bf228e91e815e9e98682ddfa740b01)

## Solution

```bash
└─$ display ./magic_play.png 
display-im6.q16: improper image header './magic_play.png' @ error/png.c/ReadPNGImage/4107.

└─$ pngcheck -v ./magic_play.png
File: ./magic_play.png (250137 bytes)
  this is neither a PNG or JNG image nor a MNG stream
ERRORS DETECTED in ./magic_play.png
```

Looking into the header with Hex Editor:

![magicplay-1](/assets/ctf/deconstructf/magicplay-1.png)

It looks like header chunks are messed up, so let's fix them.

Correct chunk names can be found in wikipedia: <https://www.wikiwand.com/en/PNG#Critical_chunks>

Fixed image:

![magicplay-2](/assets/ctf/deconstructf/magicplay-2.png)

![magicplay-3](/assets/ctf/deconstructf/magicplay-3.png)
::: tip Flag
`dsc{COrrupt3d_M4g1C_f1Ag}`
:::