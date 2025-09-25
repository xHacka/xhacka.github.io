# Gibberish

## Description

NASA receive a weird transmission yesterday but they were't able to decode it. I mean, it's just a bunch of gibberish. The only thing they have cracked was one word "goodbye"  
They have no clue what that means though. Can you help them?

Downloads: [flag.txt](https://traboda-arena-87.s3.amazonaws.com/files/attachments/flag_f7ebc314-f788-4942-9719-55bc7aac3825.txt?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIA6GUFVMV6HO3NYL6Z%2F20230806%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Date=20230806T085358Z&X-Amz-Expires=3600&X-Amz-SignedHeaders=host&X-Amz-Signature=fdf4660a73ed4921bf0ad9801f53e1b4a9b7e140cc74ca4c58058a1e41b2df8c)

## Solution

`flag.txt` is a giant blob of Base64 string. Let's decode.

```bash
└─$ cat flag.txt | base64 -d -i > flag.out
```

::: info Note
`-i` to ignore some errors in the base64 decoding.
::: 

```bash
└─$ file flag.out 
flag.out: ELF 64-bit LSB pie executable, x86-64, version 1 (SYSV), dynamically linked, interpreter /lib64/ld-linux-x86-64.so.2, BuildID[sha1]=c49ab6b10a428c61e3da7c28a3a1b6a465dfb9a6, for GNU/Linux 3.2.0, not stripped
                                                                                                                                                                                                                  
└─$ ./flag.out           
Password: LETMEIN
Wrong password.
```

Since it's a binary I decided to open it in Ghidra, but before doing that I simply ran Strings:

```bash
└─$ strings -d -n 6 ./flag.out                   
...
[]A\A]A^A_
Password: 
goodbye
mlh{nc_c4n_4ls0_trnsmit_f1les}
Wrong password.
```

The flag looks weird... I changed prefix and submitted, and it worked!...
::: tip Flag
`dsc{nc_c4n_4ls0_trnsmit_f1les}`
:::