# Future of SWE

## Description

Our founder is convinced that ChatGPT will replace all sofware engineers in the future. Perhaps related, but it appears the ClippyGPT SaaS he's signed up for has deleted his documents. Can you help recover them?

Download: [future_of_swe.raw.001.zip](https://ctf.uscybergames.com/files/db73a5ba42744c77f51ecbada8f4c5d7/future_of_swe.raw.001.zip?token=eyJ1c2VyX2lkIjoxMDY4LCJ0ZWFtX2lkIjpudWxsLCJmaWxlX2lkIjoyN30.aE0lZw.9o7Q6W0AXnjSDxDeNixj-uwogsE)

Author: Chris Haller

## Solution

```bash
└─$ unzip future_of_swe.raw.001.zip

└─$ file future_of_swe.raw.001
future_of_swe.raw.001: DOS/MBR boot sector, code offset 0x3c+2, OEM-ID "MSDOS5.0", sectors/cluster 4, reserved sectors 8, root entries 512, Media descriptor 0xf8, sectors/FAT 256, sectors/track 63, heads 255, sectors 262144 (volumes > 32 MB), serial number 0xfa653f79, unlabeled, FAT (16 bit)

└─$ fdisk -l future_of_swe.raw.001
Disk future_of_swe.raw.001: 128 MiB, 134217728 bytes, 262144 sectors
Units: sectors of 1 * 512 = 512 bytes
Sector size (logical/physical): 512 bytes / 512 bytes
I/O size (minimum/optimal): 512 bytes / 512 bytes
Disklabel type: dos
Disk identifier: 0x6f20736b

Device                  Boot      Start        End    Sectors   Size Id Type
future_of_swe.raw.001p1       778135908 1919645538 1141509631 544.3G 72 unknown
future_of_swe.raw.001p2       168689522 2104717761 1936028240 923.2G 65 Novell Netware 386
future_of_swe.raw.001p3      1869881465 3805909656 1936028192 923.2G 79 unknown
future_of_swe.raw.001p4               0 3637226495 3637226496   1.7T  d unknown

Partition table entries are not in disk order.
```

File is 128mb, but the file seems to be damaged.

```bash
└─$ testdisk future_of_swe.raw.001

> Disk future_of_swe.raw.001 - 134 MB / 128 MiB
> [None] Non partitioned media
>   P FAT16                    0   0  1    16  81  1     262144 [NO NAME]

At the bottom, choose List (Right Arrow)
```

![Future_of_SWE.png](/assets/ctf/uscybergames/future_of_swe.png)

Then press `C` to copy file, then `C` again to where (folder), then `C` on all files to save them.

```bash
└─$ cat meeting_notes.txt
=== 18-May-2025 Staff Sync ===
- Agenda: ClippyGPT post-deployment triage
- Action: Investigate why ClippyGPT replaced CEO password with "password123"
- Reminder: ProjectNextBigThing.docx was “encrypted” during cleanup.
  Password stored in passwords.xlsx, Sheet2, row 4.

=== 18-May-2025 Ad-hoc ===
- Determine if AI deleting files actually improves productivity...
```

![Future_of_SWE-2.png](/assets/ctf/uscybergames/future_of_swe-2.png)

Row 4 was a lie.. It's row 2: `clippyisawesome`

![Future_of_SWE-1.png](/assets/ctf/uscybergames/future_of_swe-1.png)

If you double click flag is revealed without special effects.

![Future_of_SWE-3.png](/assets/ctf/uscybergames/future_of_swe-3.png)

::: tip Flag
`SVUSCG{th3_futur3_is_look1n_br1ght}`
:::

