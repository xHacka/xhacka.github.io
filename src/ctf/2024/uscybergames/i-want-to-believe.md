# I Want to Believe

## Description

I Want to Believe [Forensics]

We've received a GIFt from what appears to be a signal coming from extraterrestrial life! Although, it appears they've used steganography to hide it inside of this .gif file. All we know is that it's in the form of a text file named 'iwanttobelieve.txt'. Can you recover it?

[gift.gif](https://ctfd.uscybergames.com/files/aa1be7fa6f980477e5752966bd950df3/gift.gif?token=eyJ1c2VyX2lkIjozMDg2LCJ0ZWFtX2lkIjpudWxsLCJmaWxlX2lkIjoyMjl9.Zl3zmQ.yBLrTGAK75h6uvAy3ZsV2K9tfDU)

## Solution

After checking metadata/strings and `binwalk` nothing came up. The description has emphasis on `GIFt`, so there must be a tool which was used. 

After some google searches I found: [https://github.com/dtmsecurity/gift](https://github.com/dtmsecurity/gift)

```bash
└─$ git clone https://github.com/dtmsecurity/gift.git

└─$ py gift/gift-cli.py --source gift.gif recover iwanttobelieve.txt
Recovering files from gift.gif
Recovering iwanttobelieve.txt

└─$ cat iwanttobelieve.txt
HELLO HUMANS. WE COME IN PEACE.

MY NAME IS J0K3 AND I AM BROADCASTING THIS MESSAGE FROM SIGMA CENTAVRI.

WE FORMALLY APOLOGIZE FOR ABDUCTING SO MANY OF YOUR KIND. AND ALSO THE COWS.

WE HOPE YOU ACCEPT THIS TOKEN OF ATONEMENT.

OUR RESEARCH SHOWS IT IS HIGHLY PRIZED BY YOUR KIND.

 ___________________________
< SIVBGR{y0ur_g1ft_1s_h3r3} >
 ---------------------------
        \   ^__^
         \  (oo)\_______
            (__)\       )\/\
                ||----w |
                ||     ||


PS: THE HUMANS WERE DROPPED OFF IN BORNEO.
ALSO, WE ARE KEEPING THE COWS. I NAMED THIS ONE "ANTHONY".
```
::: tip Flag
`**SIVBGR{y0ur_g1ft_1s_h3r3}**`
:::
