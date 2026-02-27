# Baby nyanCat

## Description

[nyancat.mp4](https://dgactf.com/files/6fd0936f3277b6ff1015110eff9e97bc/nyancat.mp4?token=eyJ1c2VyX2lkIjoyMCwidGVhbV9pZCI6bnVsbCwiZmlsZV9pZCI6MTN9.aZsXqA.mJ1OSZcJs2sXFfpxHFY5G7-z6FE)

## Solution

I started seeing weird flashed in the right top corner and it was just spewing letters :D

![baby-nyancat.png](/assets/ctf/dgactf/baby-nyancat.png)

Extract frames
```bash
└─$ mkdir -p frames && ffmpeg -i nyancat.mp4 frames/frame_%d.png
```

It reads
```
two seeds in nyanCat: fix the picture first, then use the second to find it
```

![baby-nyancat-1.png](/assets/ctf/dgactf/baby-nyancat-1.png)

![baby-nyancat-2.png](/assets/ctf/dgactf/baby-nyancat-2.png)

![baby-nyancat-3.png](/assets/ctf/dgactf/baby-nyancat-3.png)

We can extract the flag from images, however the letters in the corner is most definitely hint for `nyanCat`.

::: tip Flag
`DGA{You_migHt_W4nt_t0_l00k_at_the_corners_of_everY_3th_frame}`
:::