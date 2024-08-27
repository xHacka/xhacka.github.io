---
title: US Cyber Games [Season 4] - Redundant
date: Wed Jun  5 03:21:22 PM EDT 2024
categories: [Writeup]
tags: [ctf,uscybergames,uscybergames2024,forensics]
---

## Description

Redundant

My meme got corrupted somehow and cut off the punchline. Can you help?

Author: [tsuto](https://github.com/jselliott)

 [redundant.png](https://ctfd.uscybergames.com/files/4ffaad6d228a1cf8642910e3648dbd0d/redundant.png?token=eyJ1c2VyX2lkIjozMDg2LCJ0ZWFtX2lkIjpudWxsLCJmaWxlX2lkIjoyODV9.ZmCvsA.k3dI4pAxIhArp0dT3qmsKD98-8U)

## Solution

Corrupted image:

![Redundant](/assets/images/USCyberGames/2024/Redundant.png)

```bash
└─$ pngcheck -c redundant.png
zlib warning:  different version (expected 1.2.13, using 1.3)

redundant.png  CRC error in chunk IDAT (computed 1ca1c693, expected 4c4f4c21)
ERROR: redundant.png
```

Welp Idk why VSCode failed to open the image properly. (My) One conclusion is that Windows opened Thumbnail image which wasn't corrupted and no more forensics was required 

![Redundant-1](/assets/images/USCyberGames/2024/Redundant-1.png)

> Flag: **SIVUSCG{1nv4l1d_chunk5_l0l}**
{: .prompt-tip }
