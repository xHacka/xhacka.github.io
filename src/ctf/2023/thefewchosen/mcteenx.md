# MCTEENX

## Description

By `Mcsky23`

I fly in the sky, I got wings on my feet.

Downloads: [red.zip](https://drive.google.com/file/d/1lnDtdAReV84FWOBimA3WZQmnG2YST5M-/view?usp=drive_link)

## Solution

After downloading the zip, we are unable to extract due to password. 

Since I used 7zip I saw something interesting

![mcteenx-1](/assets/ctf/tfcctf/mcteenx-1.png)

Googling `ZipCrypto Store` got me directly to exploits.

I followed this post <https://www.anter.dev/posts/plaintext-attack-zipcrypto/> to get the file from zip.

```bash
└─$ bat plain.bin
───────┬──────────────────────
       │ File: plain.bin
───────┼──────────────────────   
   1   │ #!/bin/bash
───────┴──────────────────────

# "bkrack" output is a bit wacky because I messed up progress bar, but keys are good.
└─$ ./bkcrack-1.5.0-Linux/bkcrack -C red.zip -c script.sh -p plain.bin 
bkcrack 1.5.0 - 2022-07-07
[20:58:25] Z reduction using 5 bytes of known plaintext
[20:58:25] Attack on 1218664 Z values at index 6
bkcrack 1.5.0 - 2022-07-07                                                                                                                                                                                        
88.7 % (1081129 / 1218664)                                                                                                                                                                                        
100.0 % (5 / 5)
[23:02:03] Keys                                                                                                                                                                                                   
c0b1bc78 c3206dfc e7e5bae1                                                                                                                                                                                        
              
└─$ ./bkcrack-1.5.0-Linux/bkcrack -C red.zip -c script.sh -k c0b1bc78 c3206dfc e7e5bae1 -d script.extracted.sh
bkcrack 1.5.0 - 2022-07-07
[00:11:54] Writing deciphered data script.extracted.sh (maybe compressed)
Wrote deciphered data.
```

_<small>Yes, my CPU almost died. Lul</small>_

`script.sh` produces image. `echo '<ReallyLongBase64String> | base64 -d  > red.png`

Since we are most likely dealing with Steganography let's try steganography tools. 

`strings` and `exiftool` came empty handed. Since it's PNG `steghide` or such tools won't work. But what about [zsteg](https://github.com/zed-0xff/zsteg)?

```bash
└─$ zsteg ./red.png                            
b1,r,lsb,xy         .. text: "BGwFnCo#fFbfbcc"
b1,b,lsb,xy         .. file: OpenPGP Public Key
b1,rgb,lsb,xy       .. text: "030a111418142c783b39380d397c0d25293324231c66220d367d3c23133c6713343e343b3931"
b2,r,msb,xy         .. text: "}}]}}u}}}u}"
b3,abgr,msb,xy      .. file: MPEG ADTS, layer I, v2, 256 kbps, Monaural
```

0w0 Really long hex string? 

Unfortunately decoding from hex to ascii doesnt give us flag. 

I had encountered similar challenge on [SecurityValley](https://ctftime.org/ctf/865). By similar I mean decoding hex. If it's cryptographically "secured" let's try XOR, in this case XOR with Crib (plaintext) attack.

Since XOR is symetical encryption we need to find key. To find key we try to use Crib Drag attack, where we compare portion of encoded flag to known flag. 

I started cooking in CyberChef:

![mcteenx-2](/assets/ctf/tfcctf/mcteenx-2.png)

![mcteenx-3](/assets/ctf/tfcctf/mcteenx-3.png)

![mcteenx-4](/assets/ctf/tfcctf/mcteenx-4.png)

Key = 574c: TF<br>
Key = 5257: CC<br>
Key = 4c52: TF

Full Key: 574c52574c52<br>
XOR  Key: 574c52

Since key got repeated we know for sure that `574c52` is the key.

![mcteenx-5](/assets/ctf/tfcctf/mcteenx-5.png)
::: tip Flag
`TFCCTF{4int_n0_reasoN1n_a1nt_n0_fixin}`
:::