# Deleted

## Description

One of the US Cyber Games administrators deleted a File that they need for the season 5 that they need to give to Brad. Recover the deleted file from the image and provide us with the flag for this file that Brad and Jessica paid a Graphic Artist to create.

Download: [SVUSCG.dd-001.001 (3.3gb)](https://drive.google.com/file/d/1FIvq5mvT-4KszBCU9MO5HzHu8nCu--k0/view?usp=sharing)

Author: JesseV

## Solution

```bash
└─$ file SVUSCG.dd-001.001
SVUSCG.dd-001.001: DOS/MBR boot sector; partition 1 : ID=0x7, active, start-CHS (0x0,32,33), end-CHS (0x1e6,254,63), startsector 2048, 7829504 sectors
```

The easiest way to recover the deleted file is probably with FTK Imager

![Deleted.png](/assets/ctf/uscybergames/deleted.png)

Alternatively [tsk_recover](https://www.sleuthkit.org/sleuthkit/man/tsk_recover.html) can be used to extract the files, but it takes really long time.
```bash
└─$ mmls SVUSCG.dd-001.001
DOS Partition Table
Offset Sector: 0
Units are in 512-byte sectors

      Slot      Start        End          Length       Description
000:  Meta      0000000000   0000000000   0000000001   Primary Table (#0)
001:  -------   0000000000   0000002047   0000002048   Unallocated
002:  000:000   0000002048   0007831551   0007829504   NTFS / exFAT (0x07)

└─$ tsk_recover -e -o 2048 ./SVUSCG.dd-001.001 out
Files Recovered: 895

└─$ ls -alh out/2025-06-04_11-48-36.jpg
Permissions Size User Date Modified Name
.rwxrwx---   55k root 14 Jun 06:47   out/2025-06-04_11-48-36.jpg
```

::: tip Flag
`SVUSCG{FILE_DELETE_2025}`
:::

