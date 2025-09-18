# Migraine

## Description

Something is wrong with my head... I forgot everything!

And tomorrow I have a tourist route...

[tourist_rout.jpg](https://ctf-spcs.mf.grsu.by/files/444f67d67b98d2a84b00fd177c28e22a/tourist_rout.jpg?token=eyJ1c2VyX2lkIjo2NzksInRlYW1faWQiOjM3NCwiZmlsZV9pZCI6OTR9.ZaWP7g.uNFDKYisig-pq_EhL0C77xATDHI)

## Solution

The file is awfully big for image...
```bash
└─$ la
Permissions Size User  Group  Date Modified Name
.rwxrwx---   18M woyag vboxsf 16 Jan 00:05   tourist_rout.jpg
```

If you try to view the image you cant because something is broken.

```bash
└─$ file tourist_rout.jpg
tourist_rout.jpg: JPEG image data

└─$ xxd tourist_rout.jpg | head
00000000: ffd8 ffe0 104a 460a 0000 000d 4948 4452  .....JF.....IHDR
00000010: 0000 0a2c 0000 1210 0806 0000 007f d248  ...,...........H
00000020: b400 0000 0467 414d 4100 00b1 8f0b fc61  .....gAMA......a
00000030: 0500 0000 0970 4859 7300 000e c400 000e  .....pHYs.......
00000040: c401 952b 0e1b 0000 000f 7445 5874 536f  ...+......tEXtSo
00000050: 7572 6365 0053 4d2d 4137 3235 4631 3f32  urce.SM-A725F1?2
00000060: a800 0000 1674 4558 7453 6f66 7477 6172  .....tEXtSoftwar
00000070: 6500 4137 3235 4658 5855 3141 5542 3419  e.A725FXXU1AUB4.
00000080: a2f8 8c00 0000 0774 494d 4507 e507 120e  .......tIME.....
00000090: 2531 71de 9e42 0000 0020 7445 5874 4372  %1q..B... tEXtCr

└─$ xxd tourist_rout.jpg | tail -n 1
0115dea0: 0049 454e 44ae 4260 82                   .IEND.B`
```

The `file` command identifies image as JPG, but we see common PNG headers. This means the given file is corrupted PNG and header should be fixed.

For [File Signatures](https://www.wikiwand.com/en/List_of_file_signatures) (or Magic Bytes) you can refer to wikipedia.

[Example](https://www.wikiwand.com/en/Portable_Network_Graphics#Examples) always the best

By using `dd` we can replace the first bytes with PNG signature so we can open image (or you can use any hex editor).
```bash
└─$ echo -ne '\x89\x50\x4e\x47\x0d\x0a\x1a\x0a' | dd conv=notrunc bs=1 count=8 of=./tourist_rout.jpg
```

![migraine-1](/assets/ctf/spcsctf/migraine-1.png)
::: tip Flag
`grodno{tourist_rout_(2,7_km)_"FOREST_SPRING"_}`
:::