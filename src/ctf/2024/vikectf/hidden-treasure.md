# Hidden Treasure
  
## Description

As the dense fog shrouded the rocky coastline, a group of fearless Vikings set sail in their sturdy longship, their eyes gleaming with anticipation. Guided by ancient maps and whispered legends, they embarked on a perilous quest in search of a fabled treasure hidden deep within uncharted lands. With the wind at their backs and the crashing waves echoing their determined hearts, they ventured forth into the unknown, ready to conquer any obstacle that stood in their way in pursuit of untold riches and glory.

We received an image of the target's computer, and we have reason to believe they know the credentials to the website.

Download the image from here and find out how to access  _the flag_:  [https://pub-2145e7fa138e484eb3462e0474545de9.r2.dev/vikectf2024%2Fvikebox.img.gz](https://pub-2145e7fa138e484eb3462e0474545de9.r2.dev/vikectf2024%2Fvikebox.img.gz)

[http://35.94.129.106:3005](http://35.94.129.106:3005/)

## Solution

Since we are given a target's computer then the target must have been logged inside website we are trying to reach. 

Let's mount the drive and explore:

```bash
└─$ file vikectf2024_vikebox.img
vikectf2024_vikebox.img: DOS/MBR boot sector, extended partition table (last)

└─$ fdisk -l vikectf2024_vikebox.img
Disk vikectf2024_vikebox.img: 15 GiB, 16106127360 bytes, 31457280 sectors
Units: sectors of 1 * 512 = 512 bytes
Sector size (logical/physical): 512 bytes / 512 bytes
I/O size (minimum/optimal): 512 bytes / 512 bytes
Disklabel type: gpt
Disk identifier: 1B23F900-9049-4FA9-A7AC-B8A548AB08A3

Device                     Start      End  Sectors  Size Type
vikectf2024_vikebox.img1    2048     4095     2048    1M BIOS boot
vikectf2024_vikebox.img2    4096  1054719  1050624  513M EFI System
vikectf2024_vikebox.img3 1054720 31455231 30400512 14.5G Linux filesystem

└─$ py 
Python 3.11.6 (main, Nov 14 2023, 09:36:21) [GCC 13.2.1 20230801] on linux
Type "help", "copyright", "credits" or "license" for more information.
>>> 1054720 * 512
540016640

└─$ sudo mount -o loop,offset=540016640 vikectf2024_vikebox.img vikebox
```
::: info :information_source:
You can refer to [forum thread](https://www.linuxquestions.org/questions/linux-software-2/how-to-mount-dos-img-file-4175430554/) for more details about mounting dos image.
:::

1. First enumerate users
2. Enumerate what files they have on home directory.<br>
I used my `tree` like alias to enumerate the existing files. 
```bash
└─# type lta
lta is an alias for eza -al --icons --tree
```

The most interesting folder to me was Firefox, because we need credentials or cookies to access the website, were else then browser itself?

The best tool to find information from mozilla profiles is [dumpzilla](https://github.com/Busindre/dumpzilla).

Dump cookies:

```bash
└─# pwd # Firefox location
/media/sf_VBoxShare/vikebox/home/viktor/snap/firefox/common/.mozilla/firefox

└─# dumpzilla ./gafhcvjb.default --Cookies
...

Host: 35.94.129.106
Name: session
Value: 6090a4914358dc1fce139aa4e11df13009c2eda2b75d35d537706d7313237389
Path: /
Expiry: 2024-03-08 12:07:55
Last Access: 2024-03-07 12:09:01
Creation Time: 2024-03-07 12:08:00
Secure: No
HttpOnly: No

...
```

And we have a session cookie for the user. Go to <http://35.94.129.106:3005>, set `session` to cookie value and refresh. Profit.
::: tip
vikeCTF{sh0rtbr3@d_c1nn@m0n_br0w53r}
:::
::: danger :no_entry:
Dont forget to umount! `└─$ sudo umount yourMountDirectory` 
:::