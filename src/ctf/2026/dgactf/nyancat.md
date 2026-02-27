# nyanCat - Unsolved (TBU)

## Description

[rar.rar](https://dgactf.com/files/e3c56c1b6b12857a5688a0b84a76eace/rar.rar?token=eyJ1c2VyX2lkIjoyMCwidGVhbV9pZCI6bnVsbCwiZmlsZV9pZCI6MTF9.aZQgHA.nfodbIcDkF2_L6AJv2PHUhKPwaM)

![nyancat_hint.png](/assets/ctf/dgactf/nyancat_hint.png)

![nyancat_final.png](/assets/ctf/dgactf/nyancat_final.png)

## Solution

I thought `About` would lead me to Desmos image, but it's just red herring.
```bash
└─$ exiftool hint.png
...
File Size                       : 44 kB
File Modification Date/Time     : 2026:02:15 07:40:20-05:00
File Access Date/Time           : 2026:02:17 03:06:43-05:00
File Inode Change Date/Time     : 2026:02:17 03:06:43-05:00
...
Image Width                     : 852
Image Height                    : 823
Bit Depth                       : 8
Color Type                      : RGB with Alpha
...
Pixel Units                     : meters
About                           : uuid:faf5bdd5-ba3d-11da-ad31-d33d75182f1b
Orientation                     : Horizontal (normal)
Image Size                      : 852x823
Megapixels                      : 0.701
```

If we solve the `hint.png`

The values are roughly
```bash
Red:  1337=100x+y # 70%  sure
Blue: 4242=100x+y # 100% sure
```

![nyancat-1.png](/assets/ctf/dgactf/nyancat-1.png)

While doing research and doing many thing I came across this writeup
- [IRON CTF 2024 - Random Pixels](https://hackmd.io/@xtasyyy/rkYXX4eJ1x)

The concept seemed very similar so I started working around the encryption method.

This worked!
```python
import random
import numpy as np
from PIL import Image
from pathlib import Path

img = np.array(Image.open("final.png"))
h, w, c = img.shape
n_pixels = h * w
Path("out").mkdir(parents=True, exist_ok=True)


def unshuffle(img, seed):
    """Reverse shuffle: encrypted[j] = original[perm[j]] -> original[i] = encrypted[inv[i]]"""
    # Each row = one pixel (R,G,B)
    flat = img.reshape(n_pixels, 3)  
    random.seed(seed)

    # Same sequence as encryption
    perm = list(range(n_pixels))
    random.shuffle(perm)  

    # Build inverse: inv[perm[j]] = j, so original[i] = encrypted[inv[i]]
    inv = [0] * n_pixels
    for i, j in enumerate(perm):
        inv[j] = i

    return flat[np.array(inv)].reshape(h, w, c)


# From hint coords (13,37) and (42,42)
SEED_RED, SEED_BLUE = 1337, 4242  

for seed in [SEED_RED, SEED_BLUE]:
    out = unshuffle(img, seed)
    Image.fromarray(out).save(f"out/{seed}.png")
```

I mean kinda...

![nyancat-2.png](/assets/ctf/dgactf/nyancat-2.png)

The **nyan cat** image has `22372` unique colors which is also very odd, for such a simple image it should be less. But there's also previous shuffling step which may or may not affect this output.

![nyancat-3.png](/assets/ctf/dgactf/nyancat-3.png)

- [https://fotoforensics.com/analysis.php?id=9e8333b2481c5e5b4c5532c50487ff609ccf168f.447919](https://fotoforensics.com/analysis.php?id=9e8333b2481c5e5b4c5532c50487ff609ccf168f.447919)

Tried many LSB related tools, but nothing came up with information about flag.

Ok, Im back after doing `Baby nyanCat`. It left a hint
```
two seeds in nyanCat: fix the picture first, then use the second to find it
```

## TBU

...in the possible future...