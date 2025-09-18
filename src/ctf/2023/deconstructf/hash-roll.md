# Hash Roll

## Description 

Augustine's friend took a important file of augustine and stashed it.  
He was able to grab all the files from his friend's machine but he is worried that the files are encrypted.  
Help him get the file back  
  
**Author**: Rakhul

Downloads: [encrypted1.zip](https://traboda-arena-87.s3.amazonaws.com/files/attachments/encrypted1_f1eac44e-2ee8-46d1-97fc-b689c1f055b5.zip?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIA6GUFVMV6HO3NYL6Z%2F20230806%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Date=20230806T100311Z&X-Amz-Expires=3600&X-Amz-SignedHeaders=host&X-Amz-Signature=de59aeab880d5b53e5b875f51ff21cd94452314afc2d0fbd42da7eb49dd0fbe8), [nothing.pdf](https://traboda-arena-87.s3.amazonaws.com/files/attachments/nothing_24d233e3-e3a4-4ec6-b4ed-75c30a37ea42.pdf?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIA6GUFVMV6HO3NYL6Z%2F20230806%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Date=20230806T100336Z&X-Amz-Expires=3600&X-Amz-SignedHeaders=host&X-Amz-Signature=0237510aae0e6788c98d992a95b9f736b019fb21831a88474c9583b668061263)

## Solution

Before opening zip I decided to checkout the PDF. It's some rick roll lyrics... but if we select all text something gets revealed.

![hash-roll-1](/assets/ctf/deconstructf/hash-roll-1.png)

> 29ebf2f279da44f69a35206885cd2dbc might be something you need

Hmm... looks like a hash.

Using [CrackStation](https://crackstation.net) it decoded to md5 hash of `diosesamor`.

```bash
└─$ unzip encrypted1.zip # unzip didn't work...  
Archive:  encrypted1.zip
   skipping: flag.jpg                need PK compat. v5.1 (can do v4.6)
                                                                                                                                                                                                                  
└─$ 7z x encrypted1.zip 

7-Zip [64] 16.02 : Copyright (c) 1999-2016 Igor Pavlov : 2016-05-21
p7zip Version 16.02 (locale=en_US.UTF-8,Utf16=on,HugeFiles=on,64 bits,4 CPUs Intel(R) Core(TM) i7-5700HQ CPU @ 2.70GHz (40671),ASM,AES-NI)

Scanning the drive for archives:
1 file, 143908 bytes (141 KiB)

Extracting archive: encrypted1.zip
--
Path = encrypted1.zip
Type = zip
Physical Size = 143908

    
Enter password (will not be echoed): # Enter password from PDF
Everything is Ok

Size:       146035
Compressed: 143908

└─$ ls
 encrypted1.zip   flag.jpg
```

![hash-roll-2](/assets/ctf/deconstructf/hash-roll-2.png)
::: tip Flag
`dsc{N3v3r_9OnNA_gIv3_y0u_up}`
:::