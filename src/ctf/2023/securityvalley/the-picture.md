# The Picture

## Description

Level: 1 Score 5 Category miscellaneous

WTF... we need a forensic specialist here

**Link:** [SecurityValley/PublicCTFChallenges/miscellaneous/the_picture](https://github.com/SecurityValley/PublicCTFChallenges/tree/master/miscellaneous/the_picture)

## Analysis 

![the_picture](https://github.com/SecurityValley/PublicCTFChallenges/blob/master/miscellaneous/the_picture/challenge.png?raw=true)
1. `strings` has nothing such as flag
2. `Exifdata` has nothing such as flag 
3. File's too small for hidden files (`binwalk`)
4. Flag could be hidden in pixels

## Solution

We can use [zsteg](https://github.com/zed-0xff/zsteg) to detect stegano-hidden data
```sh
└─$ zsteg challenge.png                                                   
b1,r,lsb,xy         .. text: "vwpR&?|"
b1,rgb,lsb,xy       .. text: "SecVal{REDACTED}"
b1,rgba,msb,xy      .. file: OpenPGP Public Key
```