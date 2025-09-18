# Corny Kernel

# Corny Kernel

### Description

Use our corny little driver to mess with the Linux kernel at runtime! (author: Nitya)

`$ socat file:$(tty),raw,echo=0 tcp:corny-kernel.chal.uiuc.tf:1337`

[pwnmod](https://2023.uiuc.tf/files/50c78a71356747e5826df90ea04d6d3a/pwnymodule.c?token=eyJ1c2VyX2lkIjoxNzUyLCJ0ZWFtX2lkIjo5NTAsImZpbGVfaWQiOjg5OX0.ZKF2Bg.80GyLHayM88Bo-cCyFO0B-_hnMo)

### Analysis

We are given a driver code, which is already compiled on server.

Driver has 2 functions:

* [ ] pwny\_init
  * [ ] Sends alert message, which will be visible in stdout.
  * [ ] Is ran when module is loaded.
* [ ] pwny\_exit:
  * [ ] Sends info message,  which will not be visible in stdout.
  * [ ] Is ran when module is unloaded.

```c
// SPDX-License-Identifier: GPL-2.0-only

#define pr_fmt(fmt) KBUILD_MODNAME ": " fmt

#include <linux/module.h>
#include <linux/init.h>
#include <linux/kernel.h>

extern const char *flag1, *flag2;

static int __init pwny_init(void) {
	pr_alert("%s\n", flag1);
	return 0;
}

static void __exit pwny_exit(void) {
	pr_info("%s\n", flag2);
}

module_init(pwny_init);
module_exit(pwny_exit);

MODULE_AUTHOR("Nitya");
MODULE_DESCRIPTION("UIUCTF23");
MODULE_LICENSE("GPL");
MODULE_VERSION("0.1");
```

### Solution

```bash
└─$ socat file:$(tty),raw,echo=0 tcp:corny-kernel.chal.uiuc.tf:1337                      
== proof-of-work: disabled ==
                             + mount -n -t proc -o nosuid,noexec,nodev proc /proc/
+ mkdir -p /dev /sys /etc
+ mount -n -t devtmpfs -o 'mode=0755,nosuid,noexec' devtmpfs /dev
+ mount -n -t sysfs -o nosuid,noexec,nodev sys /sys
+ cd /root
+ exec setsid cttyhack ash -l
$ ls # Check for files
pwnymodule.ko.gz

$ gzip -d pwnymodule.ko.gz # Unzip 

$ insmod pwnymodule.ko # Load driver
[   52.945794] pwnymodule: uiuctf{m4ster_

$ rmmod pwnymodule # Remove driver

$ dmesg | tail # Check kernel messages
[    0.183484] Freeing unused kernel image (rodata/data gap) memory: 1452K
[    0.183488] Run /init as init process
[    0.183489]   with arguments:
[    0.183490]     /init
[    0.183490]   with environment:
[    0.183491]     HOME=/
[    0.183491]     TERM=linux
[    0.191419] mount (31) used greatest stack depth: 13464 bytes left
[   52.945794] pwnymodule: uiuctf{m4ster_
[  104.825354] pwnymodule: k3rNE1_haCk3r}
$ exit
```

::: tip Flag
`uiuctf{m4ster\_k3rNE1\_haCk3r}`
:::
