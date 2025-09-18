# Broke

## Description

country: Australia

I guess you guys aren't ready for that, yet. But your kids are gonna love it.

[challenge](https://ctf.cert.unlp.edu.ar/files/0d5c92874ab81d8e80e9c3bf352b3b69/challenge?token=eyJ1c2VyX2lkIjo3MDYsInRlYW1faWQiOjM3MywiZmlsZV9pZCI6MjYyfQ.ZTpCMQ.ooTyFt7PxnMtWKn89Lfr4hEXRnA)

## Solution

![broke-1](/assets/ctf/metared/broke-1.jpg)

We are given a JPG image with some text on it. 
::: info :information_source:
Text on image: `piensenporustedesmismos`. Google translate: [Spanish] `piensen por ustedes mismos` -> [English] `think for yourselves`.
:::

The challange has 2 different movies inside, so it made me think there's hidden file inside.

```bash
└─$ binwalk --dd='.*' challenge.jpg 

DECIMAL       HEXADECIMAL     DESCRIPTION
--------------------------------------------------------------------------------
0             0x0             JPEG image data, JFIF standard 1.01
30            0x1E            TIFF image data, little-endian offset of first image directory: 8
316           0x13C           JPEG image data, JFIF standard 1.01
206831        0x327EF         Zip archive data, encrypted at least v2.0 to extract, compressed size: 105, uncompressed size: 109, name: flag.txt
207096        0x328F8         End of Zip archive, footer length: 22
```

and yes, there's hidden zip file inside image.

```bash
└─$ mv _challenge.jpg.extracted/327EF secret.zip
                                                                       
└─$ unzip -P piensenporustedesmismos secret.zip 
Archive:  secret.zip
  inflating: flag.txt              

└─$ bat flag.txt 
───────┬──────────────────────────────────────────────────────────────────────────────────────────────────────────────
       │ File: flag.txt
───────┼──────────────────────────────────────────────────────────────────────────────────────────────────────────────
   1   │ flag{Nadie_existe_a_propósito.Nadie_pertenece_a_ninguna_parte.Todos_vamos_a_morir.Ven_a_ver_la_televisión}
───────┴──────────────────────────────────────────────────────────────────────────────────────────────────────────────
```

Using the word from initial image `piensenporustedesmismos` as password we can extract the flag.
::: tip Flag
`flag{Nadie_existe_a_propósito.Nadie_pertenece_a_ninguna_parte.Todos_vamos_a_morir.Ven_a_ver_la_televisión}`
:::