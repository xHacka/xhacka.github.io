# Level 32   Terrorist

[http://suninatas.com/challenge/web32/web32.asp](http://suninatas.com/challenge/web32/web32.asp)

![level-32---terrorist.png](/assets/ctf/suninatas/forensics/level-32-terrorist.png)

**[Download #1](https://docs.google.com/uc?id=0B8im6SjxeHFLb2I5MzFtazNJWU0) or [Download #2](https://drive.google.com/file/d/0B8im6SjxeHFLb2I5MzFtazNJWU0/view?usp=sharing&resourcekey=0-tY7plHrnoCSkV3BpHooqeg)**

## Recovery

The 

```bash
└─$ file 'USB_Image(SuNiNaTaS)'
USB_Image(SuNiNaTaS): DOS/MBR boot sector, code offset 0x58+2, OEM-ID "MSDOS5.0", sectors/cluster 8, reserved sectors 4480, Media descriptor 0xf8, sectors/track 63, heads 255, hidden sectors 2, sectors 1908096 (volumes > 32 MB), FAT (32 bit), sectors/FAT 1856, serial number 0xde96e00a, unlabeled

└─$ fdisk -l 'USB_Image(SuNiNaTaS)'
Disk USB_Image(SuNiNaTaS): 931.69 MiB, 976944640 bytes, 1908095 sectors
Units: sectors of 1 * 512 = 512 bytes
Sector size (logical/physical): 512 bytes / 512 bytes
I/O size (minimum/optimal): 512 bytes / 512 bytes

└─$ fatcat -i 'USB_Image(SuNiNaTaS)'
FAT Filesystem information

Filesystem type: FAT32
OEM name: MSDOS5.0
Total sectors: 1908096
Total data clusters: 237568
Data size: 973078528 (928M)
Disk size: 976945152 (931.688M)
Bytes per sector: 512
Sectors per cluster: 8
Bytes per cluster: 4096
Reserved sectors: 4480
Sectors per FAT: 1856
Fat size: 950272 (928K)
FAT1 start address: 0000000000230000
FAT2 start address: 0000000000318000
Data start address: 0000000000400000
Root directory cluster: 2
Disk label: NO NAME

Free clusters: 236394/237568 (99.5058%)
Free space: 968269824 (923.414M)
Used space: 4808704 (4.58594M)

└─$ sudo fsck.fat 'USB_Image(SuNiNaTaS)'
fsck.fat 4.2 (2021-01-31)
Failed to read sector 1908095.
```

I usually go to [https://en.wikipedia.org/wiki/List_of_file_signatures](https://en.wikipedia.org/wiki/List_of_file_signatures) for signatures, but I wasn't able to find anything related to FAT32 or Boot Sector.

Looking into the [Microsoft FAT Specification](https://academy.cba.mit.edu/classes/networking_communications/SD/FAT.pdf) the signature for Boot Sector must end with `0x55AA` at the position `510-511` (or `0xFE-0xFF`)

![level-32---terrorist-1.png](/assets/ctf/suninatas/forensics/level-32-terrorist-1.png)

> Im using **[ImHex](https://github.com/WerWolv/ImHex)** to view the file as hex (Linux).

As you can see the signature is way off, we can push the bytes using padding with null bytes.

![level-32---terrorist-2.png](/assets/ctf/suninatas/forensics/level-32-terrorist-2.png)

Inject 216 bytes from anywhere after **BOOTMGR** string

![level-32---terrorist-3.png](/assets/ctf/suninatas/forensics/level-32-terrorist-3.png)

	The file is now somewhat readable
```bash
└─$ fdisk -l 'USB_Image(SuNiNaTaS)'
Disk USB_Image(SuNiNaTaS): 931.69 MiB, 976945152 bytes, 1908096 sectors
Units: sectors of 1 * 512 = 512 bytes
Sector size (logical/physical): 512 bytes / 512 bytes
I/O size (minimum/optimal): 512 bytes / 512 bytes
Disklabel type: dos
Disk identifier: 0x6f20736b

Device                Boot      Start        End    Sectors   Size Id Type
USB_Image(SuNiNaTaS)1       778135908 1919645538 1141509631 544.3G 72 unknown
USB_Image(SuNiNaTaS)2       168689522 2104717761 1936028240 923.2G 65 Novell Netware 386
USB_Image(SuNiNaTaS)3      1869881465 3805909656 1936028192 923.2G 79 unknown
USB_Image(SuNiNaTaS)4      2885681152 2885736650      55499  27.1M  d unknown

Partition table entries are not in disk order.
```

Checking with `fsck.fat` it suggested a fix.
```bash
└─$ sudo fsck.fat 'USB_Image(SuNiNaTaS)' -v
fsck.fat 4.2 (2021-01-31)
There are differences between boot sector and its backup.
This is mostly harmless. Differences: (offset:original/backup)
  134:ff/2d, 135:81/8a, 136:c3/56, 137:00/40, 138:02/b4, 139:66/08, 140:40/cd
  ...
  , 369:00/20, 370:00/20, 371:00/20
1) Copy original to backup
2) Copy backup to original
3) No action
[123?q]? 2 # Choose
Boot sector contents:
System ID "MSDOS5.0"
Media byte 0xf8 (hard disk)
       512 bytes per logical sector
      4096 bytes per cluster
      4480 reserved sectors
First FAT starts at byte 2293760 (sector 4480)
         2 FATs, 32 bit entries
    950272 bytes per FAT (= 1856 sectors)
Root directory start at cluster 2 (arbitrary size)
Data area starts at byte 4194304 (sector 8192)
    237488 data clusters (972750848 bytes)
63 sectors/track, 255 heads
         2 hidden sectors
   1908096 sectors total
Checking for unused clusters.
Checking free cluster summary.
*** Filesystem was changed ***
The changes have not yet been written, you can still choose to leave the
filesystem unmodified:
4) Write changes
5) Leave filesystem unchanged
[12?q]? 1
USB_Image(SuNiNaTaS): 46 files, 1172/237488 clusters
```

It added the following chunk to primary boot loader.

![level-32---terrorist-4.png](/assets/ctf/suninatas/forensics/level-32-terrorist-4.png)

- **FAT32 maintains a backup of the boot sector**.
- The **primary** boot sector is at sector 0.
- The **backup** is usually at sector 6 (though this can vary).
- `fsck.fat` offers to synchronize  _these two sectors differ byte-for-byte_.

```bash
└─$ fls 'USB_Image(SuNiNaTaS)'
r/r 3:  NO NAME     (Volume Label Entry)
d/d 5:  관광지   # Tourist attractions
d/d 7:  대학교   # University
d/d 9:  중앙부처 # Central government
r/r 11: 2차 테러 계획.hwp # 2nd terrorist plan.hwp
r/r 15: Terrorism Report-2013-North  Korea.pdf
r/r 19: Terrorism Report-2013-South Korea.pdf
v/v 30398467:   $MBR
v/v 30398468:   $FAT1
v/v 30398469:   $FAT2
V/V 30398470:   $OrphanFiles

└─$ sudo mount -o loop,uid=$(id -u),gid=$(id -g) 'USB_Image(SuNiNaTaS)' /mnt/tmpmount
└─$ ls /mnt/tmpmount
 '2차 테러 계획.hwp'   'Terrorism Report-2013-North  Korea.pdf'   'Terrorism Report-2013-South Korea.pdf'   관광지   대학교   중앙부처
```

## Q1 : What is modified date/time of the file which contains next terror plan. (UTC+9)

FTKImager would have been nice, but we are going with just linux commands.

```bash
└─$ TZ=UTC-9 stat '2차 테러 계획.hwp'
  File: 2차 테러 계획.hwp
  Size: 9728            Blocks: 24         IO Block: 4096   regular file
Device: 7,0     Inode: 290         Links: 1
Access: (0755/-rwxr-xr-x)  Uid: ( 1001/   woyag)   Gid: ( 1001/   woyag)
Access: 2016-05-30 09:00:00.000000000 +0900
Modify: 2016-05-30 11:44:02.000000000 +0900
Change: 2016-05-30 11:44:02.000000000 +0900
 Birth: 2016-05-30 11:50:41.140000000 +0900
```

> Flag 1: `2016-05-30_11:44:02`

## Q2 : Where is the next terror target.

[hwp file viewer](https://www.reddit.com/r/Living_in_Korea/comments/orcp0x/hwp_file_viewer/) -> [https://hwp.polarisoffice.com](https://hwp.polarisoffice.com)

![level-32---terrorist-5.png](/assets/ctf/suninatas/forensics/level-32-terrorist-5.png)

> Flag 2: `Rose Park`

## Flag

```python
from hashlib import md5

flags = [
    '2016-05-30_11:44:02',
    'Rose Park'
]

# 2016-05-30_11:44:02_Rose Park
flag = '_'.join(flags)

# Auth Key = lowercase(MD5(YYYY-MM-DD_HH:MM:SS_place)
print(md5(flag.encode()).hexdigest())
```

> Flag: `8ce84f2f0568e3c70665167d44e53c2a`