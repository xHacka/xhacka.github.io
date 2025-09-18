# Too Fast

## Description
 
Too Fast | 100 points | By `Mudasir`

I found this QR code, but I can't seem to scan it.

Static resources: [ctf.gif](https://storage.googleapis.com/bcactf/too-fast/ctf.gif)

## Analysis    

As name suggests GIF is too fast to be scanner, so I tried getting each frame.
```sh
└─$ ffmpeg -i ctf.gif -vsync 0 frame%d.png
```
ffmpeg will produce 5 images. None of the images can be scanned to get the flag.  
 
## Solution

Since QR code is blocked by colors I used Photoshop to remove them. First I imported all images, selected specific color, masked the selection and inversed the mask (so only color gets hidden). Repeated for all images and result:

![too-fast-1.png](/assets/ctf/bcactf/too-fast-1.png)

Then decoded using online [QR scanner](https://webqr.com/index.html)

Flag: `bcactf{y0U_@lm0$7_m!$s3D_!7_e3idwind}`