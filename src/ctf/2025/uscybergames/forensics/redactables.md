# Redactables

## Description

My friend redacted this file, but I think they made a mistake. Can you find it? The MD5 hash of the provided file is **05f6b8c32740c785e07432d5dbd7cb7e**

Download: [redactable.pdf](https://ctf.uscybergames.com/files/f08017158404d9fffc8942649076363b/redactable.pdf?token=eyJ1c2VyX2lkIjoxMDY4LCJ0ZWFtX2lkIjpudWxsLCJmaWxlX2lkIjoyOH0.aE0p4A.Kq03Lkn-A1gRIbLKjMTrPV8v_8U)

Author: Chris Haller

## Solution

Password is required to open pdf:

![Redactables.png](/assets/ctf/uscybergames/redactables.png)

Crack the password
```bash
└─$ pdf2john redactable.pdf | tee redactable.hash
redactable.pdf:$pdf$5*6*256*-1028*1*16*11034633a5ecf94eb093665068b146cb*48*830dc3604f6a30e445f73a7f84d0ac57e3a4b8c8e7680bb3c2c400151fa44cfb99639bc06010f3b880a5d33a2164e795*48*3f07119ad41f55aba390965050c10b6d3fae89cbb824c2a990d51f8d7e196a5d53acc983097e4db23ff34e202133ae60*32*055ec514f95e917e6e1a481a0a21f862b93930969daaaf6520e7767d0898b656*32*e809d956274b5facea7c0cd7f07f873d50bb7b84d5e74bc23ac533449cda9792
```

```powershell
➜ .\john-1.9.0-jumbo-1-win64\run\john.exe .\hashes.txt --wordlist=.\rockyou.txt
Using default input encoding: UTF-8
Loaded 1 password hash (PDF [MD5 SHA2 RC4/AES 32/64])
Cost 1 (revision) is 6 for all loaded hashes
Will run 8 OpenMP threads
Press 'q' or Ctrl-C to abort, almost any other key for status
friends4eva      (redactable.pdf)
1g 0:00:00:07 DONE (2025-06-14 11:54) 0.1373g/s 1230p/s 1230c/s 1230C/s summer2..010106
Use the "--show --format=PDF" opt
```

Extract images:
```bash
└─$ pdfimages -opw friends4eva -png redactable.pdf out
```

(Optional) Remove password from PDF and use Libreoffice Calc to remove the image.
```bash
└─$ qpdf --password=friends4eva --decrypt ./redactable.pdf out.pdf
```

Upload to [Photopea](https://www.photopea.com) and Unswirl (Filter -> Distort -> Twirl)

![Redactables-1.png](/assets/ctf/uscybergames/redactables-1.png)

::: tip Flag
`SVUSCG{oops_i_did_it_again_i_didnt_redact}`
:::