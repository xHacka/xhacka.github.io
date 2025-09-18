# Promptriddle

## Description

This is Level 5
I need more tools

## Solution

```bash
hacka@Level5:~$ resources
magnifying-glass.pdf
hacka@Level5:~$ download magnifying-glass.pdf
Downloading file...
```

We are given a PDF file, but its password protected! We can refer to our good friend [john](https://www.kali.org/tools/john/) and crack the password using [rockyou](https://github.com/danielmiessler/SecLists/blob/master/Passwords/Leaked-Databases/rockyou.txt.tar.gz) dictionary. 

```bash
└─$ type $rockyou
/usr/share/seclists/Passwords/Leaked-Databases/rockyou.txt

└─$ pdf2john magnifying-glass.pdf > pdf.hash

└─$ john --wordlist=$rockyou pdf.hash
Using default input encoding: UTF-8
Loaded 1 password hash (PDF [MD5 SHA2 RC4/AES 32/64])
Cost 1 (revision) is 4 for all loaded hashes
Will run 2 OpenMP threads
Press 'q' or Ctrl-C to abort, almost any other key for status
[REDACTED]      (magnifying-glass.pdf)
1g 0:00:00:10 DONE (2024-03-02 01:09) 0.09784g/s 74589p/s 74589c/s 74589C/s union123..unfinished
Use the "--show --format=PDF" options to display all of the cracked passwords reliably
Session completed
```

```bash
hacka@Level5:~$ password [REDACTED]
Verifying password...Not that easy...
```

If we open the document using the password we are given a yellow page with 2 float numbers... They most certainly look like coordinates you find on Google Maps, if you google the numbers you end up on exact location. The answer is the City, which this coordinates are in.

```bash
hacka@Level5:~$ password [CITY_NAME]
Verifying password...Loading level...
```
