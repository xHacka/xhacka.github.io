# Just Look At It

## Description

[@tsuto](https://github.com/jselliott)

Hot take: they were _always_ actually pretty good

[lookatthis.jpg](https://ctf.uscybergames.com/files/fa77a137c0da4090c7155f17a46a18c2/lookatthis.jpg?token=eyJ1c2VyX2lkIjoxMDY4LCJ0ZWFtX2lkIjpudWxsLCJmaWxlX2lkIjo0OX0.aE1mOA.D0Ml0IF-QpWIfNFD_0GORzha6g0)

## Solution

```bash
└─$ file lookatthis.jpg
lookatthis.jpg: JPEG image data, JFIF standard 1.01, aspect ratio, density 1x1, segment length 16, baseline, precision 8, 1000x563, components 3

└─$ /bin/ls -lh lookatthis.jpg
-rwxrwx--- 1 root vboxsf 136K Jun 14 08:09 lookatthis.jpg
```

I had a feeling there would be a stegano challenge, as I left `stegseek` in background it found the flag relatively quickly.
```bash
└─$ stegseek lookatthis.jpg $rockyou
StegSeek 0.6 - https://github.com/RickdeJager/StegSeek

[i] Found passphrase: "ilovenickelback5"
[i] Original filename: "flag.txt".
[i] Extracting to "lookatthis.jpg.out".
```

```bash
└─$ cat lookatthis.jpg.out
SVUSCG{l00k_4t_th1s_gr44444444444ph}
```

::: tip Flag
`SVUSCG{l00k_4t_th1s_gr44444444444ph}`
:::

