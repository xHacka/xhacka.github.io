# Hardware

#squashfs
## Description

We've located the adversary's location and must now secure access to their Optical Network Terminal to disable their internet connection. Fortunately, we've obtained a copy of the device's firmware, which is suspected to contain hardcoded credentials. Can you extract the password from it?

## Solution

In the given zip file we find SquashFS which is mountable readonly mountable image

::: info Note
[Understanding SquashFS and How to Mount a SquashFS Filesystem](https://www.baeldung.com/linux/squashfs-filesystem-mount)
:::

```bash
└─$ tree
.
├── ONT
│   ├── fwu_ver
│   ├── hw_ver
│   └── rootfs
├── Photon Lockdown.zip
└── zip_password # hackthebox

└─$ cat fwu_ver
3.0.5

└─$ cat hw_ver
X1

└─$ file rootfs
rootfs: Squashfs filesystem, little endian, version 4.0, zlib compressed, 10936182 bytes, 910 inodes, blocksize: 131072 bytes, created: Sun Oct  1 07:02:43 2023

```

Mount the device on desired location
```bash
└─$ sudo mount --type="squashfs" --options="loop" --source="./rootfs" --target="/mnt/tmpmount"
└─$ ls -l
Permissions Size User Date Modified Name
drwxrwxr-x     - root  9 Aug  2022  bin
lrwxrwxrwx     - root  9 Aug  2022  config -> ./var/config/
drwxrwxr-x     - root  9 Aug  2022  dev
drwxrwxr-x     - root  1 Oct  2023  etc
drwxrwxr-x     - root  1 Oct  2023  home
drwxrwxr-x     - root  1 Oct  2023  image
drwxrwxr-x     - root  9 Aug  2022  lib
lrwxrwxrwx     - root  9 Aug  2022  mnt -> /var/mnt
drwxrwxr-x     - root  9 Aug  2022  overlay
drwxrwxr-x     - root  9 Aug  2022  proc
drwxrwxr-x     - root  9 Aug  2022  run
lrwxrwxrwx     - root  9 Aug  2022  sbin -> /bin
drwxrwxr-x     - root  9 Aug  2022  sys
lrwxrwxrwx     - root  9 Aug  2022  tmp -> /var/tmp
drwxrwxr-x     - root  9 Aug  2022  usr
drwxrwxr-x     - root  9 Aug  2022  var
```

Home directory had nothing, just hidden directory with `keep going` text note.

After doing a global search we can find the "password":
```bash
└─$ grep 'password' . -Rin 2>/dev/null
./config_default.xml:39:<Value Name="USER_PASSWORD" Value="user"/>
./config_default.xml:111:<Value Name="RS_PASSWORD" Value=""/>
./config_default.xml:117:<Value Name="ACCOUNT_RS_PASSWORD" Value=""/>
./config_default.xml:188:<Value Name="WLAN1_RS_PASSWORD" Value=""/>
./config_default.xml:194:<Value Name="WLAN1_ACCOUNT_RS_PASSWORD" Value=""/>
./config_default.xml:244:<Value Name="SUSER_PASSWORD" Value="HTB{N0w_Y0u_C4n_L0g1n}"/>
./config_default.xml:253:<Value Name="CWMP_ACS_PASSWORD" Value="password"/>
./config_default.xml:258:<Value Name="CWMP_CONREQ_PASSWORD" Value=""/>
./config_default.xml:275:<Value Name="CWMP_CERT_PASSWORD" Value="client"/>
./config_default.xml:524: <Value Name="rsPassword" Value=""/>
...
./smb.conf:11:  # encrypt passwords = true
./wscd.conf:28:device_password_id = 0
```

**Dont forget to unmount the device!**
```bash
└─$ sudo umount /mnt/tmpmount
```