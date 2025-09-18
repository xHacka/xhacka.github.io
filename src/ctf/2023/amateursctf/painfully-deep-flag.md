# Painfully Deep Flag

## Description

By `smashmaster`

This one is a bit deep in the stack.

Downloads: [flag.pdf](https://amateurs-prod.storage.googleapis.com/uploads/f80e99a7a081fa3fd0af3ae292ae8aeb0aa3e58dd053db6ba7c7a6162f0dc11a/flag.pdf)

## Solution

Let's inspect metadata:

```bash
└─$ exiftool flag.pdf                                                           
ExifTool Version Number         : 12.63
File Name                       : flag.pdf
...
File Type                       : PDF
File Type Extension             : pdf
MIME Type                       : application/pdf
PDF Version                     : 1.5
...
Producer                        : LibreOffice 6.4
Creator Tool                    : Draw
...
Creator                         : Draw
```

I then tried to open pdf with LibreOffice

![painfully-deep-flag-1](/assets/ctf/amateursctf/painfully-deep-flag-1.png)

::: tip Flag
`amateursCTF{0ut_0f_b0unds}`
:::