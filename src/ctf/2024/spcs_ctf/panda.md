# Panda

## Description

I wanted to convey a message to my friend, but so that no one would guess. I archived it, but forgot the password...

[Panda.zip](https://ctf-spcs.mf.grsu.by/files/9d111ba9b3f9374232c24ae2bc563b0f/Panda.zip?token=eyJ1c2VyX2lkIjo2NzksInRlYW1faWQiOjM3NCwiZmlsZV9pZCI6MTE0fQ.ZaWE5A._gj_-Yp4mdP8W7wvznK2OUFBVW8)

## Solution

Since there's a password on zip first lets get password.

```bash
└─$ zip2john Panda.zip > Panda.hash

└─$ john --wordlist=$rockyou Panda.hash
Warning: detected hash type "ZIP", but the string is also recognized as "ZIP-opencl"
Use the "--format=ZIP-opencl" option to force loading these as that type instead
Using default input encoding: UTF-8
Loaded 1 password hash (ZIP, WinZip [PBKDF2-SHA1 128/128 AVX 4x])
Will run 2 OpenMP threads
Press 'q' or Ctrl-C to abort, almost any other key for status
2611             (Panda.zip/panda.jpg)
1g 0:00:00:28 DONE (2024-01-15 23:21) 0.03522g/s 15726p/s 15726c/s 15726C/s 27032008..1z2z3z4z
Use the "--show" option to display all of the cracked passwords reliably
Session completed

└─$ 7z x Panda.zip -p2611

7-Zip [64] 17.05 : Copyright (c) 1999-2021 Igor Pavlov : 2017-08-28
p7zip Version 17.05 (locale=en_US.UTF-8,Utf16=on,HugeFiles=on,64 bits,2 CPUs x64)

Scanning the drive for archives:
1 file, 156191 bytes (153 KiB)

Extracting archive: Panda.zip
--
Path = Panda.zip
Type = zip
Physical Size = 156191

Everything is Ok

Files: 2
Size:       156068
Compressed: 156191
```

![panda](/assets/ctf/spcsctf/panda.jpg)

![panda1](/assets/ctf/spcsctf/panda1.jpg)

The second image seems to be same image but distorted, so I tried checking the difference.

Cool trick I picked up from [RobertElderSoftware](https://www.youtube.com/@RobertElderSoftware) ([The 'comm' Command In Linux](https://youtu.be/x47s05sVNr8?list=PLp31D6HATKfeEHEFqFo5hlCOYwHi4Sl9O&t=14)), but applied to `diff`.

```bash
fdiff() { # Compare files
  if (( $# < 3 )); then echo "Usage: fdiff <command> <file1> <file2> [options...]"; return; fi;
  local command=(eval $1)
  diff ${@:4} <($command "$2") <($command "$3")
}
```

Anyway lets see the difference:

```bash
└─$ fdiff strings panda.jpg panda1.jpg
2c2
< $3br
---
> $gro
92a93
> dno{
256a258
> kun-
498a501
> Dfu_w
562c565
< i$bI
---
> p4nd4}

└─$ fdiff strings panda.jpg panda1.jpg | grep '>' | sed -z 's/[> \n]//g'
$grodno{kun-Dfu_wp4nd4}                                                                                       
```

At this point I straight up guess the flag: `grodno{kung_fu_p4nd4}` <!-- Lol? -->
::: tip Flag
`grodno{kung_fu_p4nd4}`
:::