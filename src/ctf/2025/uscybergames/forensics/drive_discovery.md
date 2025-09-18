# Drive Discovery

## Description

SIV Pipeline Forensics Group 1

[drivediscovery.zip](https://ctf.uscybergames.com/files/3fcada93af9e766aacd1c200a62c3819/drivediscovery.zip?token=eyJ1c2VyX2lkIjoxMDY4LCJ0ZWFtX2lkIjpudWxsLCJmaWxlX2lkIjo2fQ.aEw-wg.s1fhjWxTZnDPChuz1FSGLcleG40)

## Solution

```bash
└─$ cat DriveDiscoveryDescriptionPUBLIC.txt
We took an image of a suspicious USB drive - can you investigate it in more detail?
We think the user may have tried to cover their tracks. 
```

```bash
└─$ file nothinginterestinghere.001
nothinginterestinghere.001: DOS/MBR boot sector MS-MBR Windows 7 english at offset 0x163 "Invalid partition table" at offset 0x17b "Error loading operating system" at offset 0x19a "Missing operating system"; partition 1 : ID=0xee, start-CHS (0x0,0,2), end-CHS (0x0,254,63), startsector 1, 4294967295 sectors
```

Mount the device and inspect contents
```bash
└─$ sudo kpartx -av nothinginterestinghere.001
add map loop0p1 (254:0): 0 16384 linear 7:0 128

└─$ sudo mount /dev/mapper/loop0p1 /mnt/tmpmount
The disk contains an unclean file system (0, 0).
Metadata kept in Windows cache, refused to mount.
Falling back to read-only mount because the NTFS partition is in an
unsafe state. Please resume and shutdown Windows fully (no hibernation
or fast restarting.)
Could not mount read-write, trying read-only

└─$ lta
drwxrwxrwx     - root  5 May 10:27  .
drwxrwxrwx     - root  5 May 10:20 ├──  $RECYCLE.BIN
drwxrwxrwx     - root  5 May 10:20 │  └──  S-1-5-21-639041105-3361198938-2770361221-1000
.rwxrwxrwx   129 root  5 May 10:20 │     └──  desktop.ini
drwxrwxrwx     - root  5 May 10:24 ├── 󰉏 Pictures
.rwxrwxrwx@  28k root  5 May 10:23 │  ├──  image1.jpg
.rwxrwxrwx@  37k root  5 May 10:23 │  ├──  image2.png
.rwxrwxrwx@  63k root  5 May 10:24 │  └──  image3.png
drwxrwxrwx     - root  5 May 10:21 ├──  Recipes
.rwxrwxrwx  1.1k root  5 May 10:21 │  ├──  'Chickpea & Spinach Stir-Fry over Quinoa'
.rwxrwxrwx   853 root  5 May 10:21 │  ├──  'Greek-Style Chicken & Avocado Wraps'
.rwxrwxrwx   934 root  5 May 10:21 │  └──  'Sheet-Pan Salmon & Veggies in Foil'
drwxrwxrwx     - root  5 May 10:28 ├──  Secrets
.rwxrwxrwx   187 root  5 May 10:26 │  └──  'note to self.txt'
drwxrwxrwx     - root  5 May 10:21 └──  'System Volume Information'
.rwxrwxrwx    12 root  5 May 10:21    └──  WPSettings.dat
```

Hmmm
```bash
└─$ cat Secrets/note\ to\ self.txt
NOTES:
1. Make sure to delete flag.txt before giving this USB drive to anyone.
2. Apparently there's a really secure type of encryption called Base64, I should look into using that. 
```

Use strings 
```bash
└─$ strings nothinginterestinghere.001 | grep NOTES -A5
NOTES:
1. Make sure to delete flag.txt before giving this USB drive to anyone.
2. Apparently there's a really secure type of encryption called Base64, I should look into using that.
FILE0
U1ZCUkd7ZDNsMzczZF9uMDdfZjByNjA3NzNuXzI4MzAyOTM4Mn0=
FILE0
```

Decode
```bash
└─$ echo 'U1ZCUkd7ZDNsMzczZF9uMDdfZjByNjA3NzNuXzI4MzAyOTM4Mn0=' | base64 -d
SVBRG{d3l373d_n07_f0r60773n_283029382} 
```

::: tip Flag
`SVBRG{d3l373d_n07_f0r60773n_283029382}`
:::

Cleanup
```bash
# 1. Unmount the mount point
└─$ sudo umount /mnt/tmpmount

# 2. Delete the device mappings created by kpartx
└─$ sudo kpartx -dv  nothinginterestinghere.001
del devmap : loop0p1
loop deleted : /dev/loop0

# 3. (Optional) Detach the loop device if it's still mapped
sudo losetup -D
```