# Think Like a Hacker

### Description

One of our contributors has created a promo video for BDSec CTF 2023. He sent me a zip file containing the promo video and a readme.txt file. He told me, if I think like a hacker, I'll find something cool! Can you think like a hacker?

**Download Link :**  [Download](https://drive.google.com/file/d/1uFt2lNK5d4vb6CpixnWJPHugF6uYhMv5/view?usp=sharing)

_**Author : NomanProdhan**_

### Solution

There's not much hidden in video or txt file, but if you run `strings` and look at the tail:
```
└─$ strings BDSecCTF_2023_Promo.mp4 | tail -16           
|40.< 
Wqyu
`TtX:
.D<Pb
:8 +
`0P)
"Hacking is not about breaking into something; it's about bending reality." - Frank Abagnale
OQFRP{
OQFrp_
PGS_
2023_
Ce0z0_
I1Q30_
sY4T}
"The best way to predict the future is to create it." - Peter Drucker
"Hacking involves a different way of looking at problems that no one's thought of." - Walter O'Brien
```

Some extra quotes and there are some values sandwiched between.<br>
Looks like flag format: `OQFRP{OQFrp_PGS_2023_Ce0z0_I1Q30_sY4T}`

Most likely transposition cipher was applied and let's try the classic [ROT13](https://rot13.com)
::: tip Flag
`BDSEC{BDSec_CTF_2023_Pr0m0_V1D30_fL4G}`
:::