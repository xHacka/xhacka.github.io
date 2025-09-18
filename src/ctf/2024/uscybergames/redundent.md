# Redundant

# Redundant

### Description

Redundant

My meme got corrupted somehow and cut off the punchline. Can you help?

Author: [tsuto](https://github.com/jselliott)

&#x20;[redundant.png](https://ctfd.uscybergames.com/files/4ffaad6d228a1cf8642910e3648dbd0d/redundant.png?token=eyJ1c2VyX2lkIjozMDg2LCJ0ZWFtX2lkIjpudWxsLCJmaWxlX2lkIjoyODV9.ZmCvsA.k3dI4pAxIhArp0dT3qmsKD98-8U)

### Solution

Corrupted image:

![Redundant](/assets/ctf/uscybergames/redundant.png)

```bash
└─$ pngcheck -c redundant.png
zlib warning:  different version (expected 1.2.13, using 1.3)

redundant.png  CRC error in chunk IDAT (computed 1ca1c693, expected 4c4f4c21)
ERROR: redundant.png
```

Welp Idk why VSCode failed to open the image properly. (My) One conclusion is that Windows opened Thumbnail image which wasn't corrupted and no more forensics was required

![Redundant-1](/assets/ctf/uscybergames/redundant-1.png)

::: tip Flag
`**SIVUSCG{1nv4l1d\_chunk5\_l0l}**`
:::
