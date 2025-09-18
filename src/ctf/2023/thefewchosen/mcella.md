# MCELLA

## Description
  
By `Mcsky23` 

-Hey man, I think you forgot to install ls on your new linux distro. Here's the binary to make your life easier.  
  
-What in the world are you talking about?  

Downloads: [ls](https://drive.google.com/file/d/11FaT-qJP4hB9GAmmKr1rq2KfbwUB_W-3/view?usp=drive_link)

## Solution

I tried running the program and it worked just like `ls`. The I tried to compare them using `file`:

```bash
└─$ file /bin/ls
/bin/ls: ELF 64-bit LSB pie executable, x86-64, version 1 (SYSV), dynamically linked, interpreter /lib64/ld-linux-x86-64.so.2, BuildID[sha1]=15dfff3239aa7c3b16a71e6b2e3b6e4009dab998, for GNU/Linux 3.2.0, stripped
               
└─$ file ./ls                                                                                   
./ls: ELF 64-bit LSB pie executable, x86-64, version 1 (SYSV), dynamically linked, interpreter /lib64/ld-linux-x86-64.so.2, BuildID[sha1]=15dfff3239aa7c3b16a71e6b2e3b6e4009dab998, for GNU/Linux 3.2.0, stripped
```

`file` commands shows that binaries are exactly the same, but is that the case?...

Using command let's see difference: `diff <(hexdump -C /bin/ls) <(hexdump -C ./ls) | bat`

![mcella-1](/assets/ctf/tfcctf/mcella-1.png)

It looks like some kind of steganography, because some bytes are changed, just like LSB steganography in images. But is there steganography for binaries?

Some google searching led me to [steg86](https://github.com/woodruffw/steg86): _steg86 is a format-agnostic steganographic tool for x86 and AMD64 binaries._

```bash
└─$ steg86 extract ./ls
TFCCTF{2_th1ngs_I_n3v3r_seen_a_fella_that_b3at_a_gun_and_a_B_I_need}
```
::: tip Flag
`TFCCTF{2_th1ngs_I_n3v3r_seen_a_fella_that_b3at_a_gun_and_a_B_I_need}`
:::