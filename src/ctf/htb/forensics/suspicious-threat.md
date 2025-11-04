# Forensics

## Description

Our SSH server is showing strange library linking errors, and critical folders seem to be missing despite their confirmed existence. Investigate the anomalies in the library loading process and filesystem. Look for hidden manipulations that could indicate a userland rootkit. 

::: tip Creds
`root:hackthebox`
:::
## Solution

```bash
➜ ssh root@94.237.61.58 -p 34802
root@94.237.61.58 password: hackthebox
root@ng-932570-forensicssuspiciousthreatmp-u0ybi-7fcf567d47-vwbdt:~# id
uid=0(root) gid=0(root) groups=0(root)
```

To identify linking errors we can use `ldconfig`:
```bash
root@ng-932570-forensicssuspiciousthreatmp-u0ybi-7fcf567d47-vwbdt:~# ldconfig -v
/sbin/ldconfig.real: Can't stat /usr/local/lib/x86_64-linux-gnu: No such file or directory
/sbin/ldconfig.real: Path `/usr/lib/x86_64-linux-gnu' given more than once
(from /etc/ld.so.conf.d/x86_64-linux-gnu.conf:4 and /etc/ld.so.conf.d/x86_64-linux-gnu.conf:3)
/sbin/ldconfig.real: Path `/lib/x86_64-linux-gnu' given more than once
(from <builtin>:0 and /etc/ld.so.conf.d/x86_64-linux-gnu.conf:3)
/sbin/ldconfig.real: Path `/usr/lib/x86_64-linux-gnu' given more than once
(from <builtin>:0 and /etc/ld.so.conf.d/x86_64-linux-gnu.conf:3)
/sbin/ldconfig.real: Path `/usr/lib' given more than once
(from <builtin>:0 and <builtin>:0)
/usr/local/lib: (from /etc/ld.so.conf.d/libc.conf:2)
/lib/x86_64-linux-gnu: (from /etc/ld.so.conf.d/x86_64-linux-gnu.conf:3)
        libgirepository-1.0.so.1 -> libgirepository-1.0.so.1.0.0
        libdevmapper.so.1.02.1 -> libdevmapper.so.1.02.1
```

`x86_64-linux-gnu` appears more then once, find it:
```bash
root@ng-932570-forensicssuspiciousthreatmp-u0ybi-7fcf567d47-vwbdt:~# cat /etc/ld.so.conf.d/x86_64-linux-gnu.conf
# Multiarch support
/usr/local/lib/x86_64-linux-gnu
/lib/x86_64-linux-gnu
/usr/lib/x86_64-linux-gnu

root@ng-932570-forensicssuspiciousthreatmp-u0ybi-7fcf567d47-vwbdt:~# find / -name x86_64-linux-gnu 2>/dev/null
/usr/share/gdb/auto-load/usr/lib/x86_64-linux-gnu
/usr/lib/x86_64-linux-gnu
```

Easiest way I found to detect malicious library was to compare them to existing, like my files.
```bash
# Copy contents from remote machine
root@ng-932570-forensicssuspiciousthreatmp-u0ybi-7fcf567d47-vwbdt:~# find /usr/lib/x86_64-linux-gnu -type f ! -type l -name '*.so.*' > htb_box_so_files.txt
└─$ find /usr/lib/x86_64-linux-gnu -type f ! -type l -name '*.so.*' > my_so_files.txt

# Get lines that we dont have
└─$ comm -23 <(sort htb_box_so_files.txt) <(sort my_so_files.txt)
/usr/lib/x86_64-linux-gnu/libapparmor.so.1.17.1
/usr/lib/x86_64-linux-gnu/libbsd.so.0.12.1
/usr/lib/x86_64-linux-gnu/libc.hook.so.6
/usr/lib/x86_64-linux-gnu/libcryptsetup.so.12.10.0
/usr/lib/x86_64-linux-gnu/libexpat.so.1.9.1
/usr/lib/x86_64-linux-gnu/libexpatw.so.1.9.1
/usr/lib/x86_64-linux-gnu/libgio-2.0.so.0.8000.0
/usr/lib/x86_64-linux-gnu/libglib-2.0.so.0.8000.0
/usr/lib/x86_64-linux-gnu/libgmodule-2.0.so.0.8000.0
/usr/lib/x86_64-linux-gnu/libgnutls.so.30.37.1
/usr/lib/x86_64-linux-gnu/libgobject-2.0.so.0.8000.0
/usr/lib/x86_64-linux-gnu/libgthread-2.0.so.0.8000.0
/usr/lib/x86_64-linux-gnu/libicudata.so.74.2
/usr/lib/x86_64-linux-gnu/libicui18n.so.74.2
/usr/lib/x86_64-linux-gnu/libicuio.so.74.2
/usr/lib/x86_64-linux-gnu/libicutest.so.74.2
/usr/lib/x86_64-linux-gnu/libicutu.so.74.2
/usr/lib/x86_64-linux-gnu/libicuuc.so.74.2
/usr/lib/x86_64-linux-gnu/liblber.so.2.0.200
/usr/lib/x86_64-linux-gnu/libldap.so.2.0.200
/usr/lib/x86_64-linux-gnu/libunistring.so.5.0.0
```

`libc.hook.so.6` stands out from others.

Turns out library files have a naming convention: [https://stackoverflow.com/a/21462448](https://stackoverflow.com/a/21462448)
```cpp
  Real name  libfoo.so.1.2.3
     Soname  libfoo.so.1
Linker name  libfoo.so
```

The file naming was also an indicator?
```bash
root@ng-932570-forensicssuspiciousthreatmp-u0ybi-7fcf567d47-vwbdt:~# find /usr/lib/x86_64-linux-gnu -type f ! -type l -name '*.so.*' -printf "%f\n" | awk -F'.' '{print($2)}' | sort | uniq -c
      6 0
      1 12
      1 hook
    136 so
```

[Malware analysis libc.hook.so.6 Malicious activity](https://any.run/report/1f9f64f021be6a0e02d30c2adfa47af8849fee023d60a6f6e69083da04fb0a06/bcebb62c-8fc6-4bba-bb7b-5b3faec65be6)

```bash
└─$ scp -P 34802 root@94.237.61.58:/usr/lib/x86_64-linux-gnu/libc.hook.so.6 .
└─$ ghidra_auto -t libc.hook.so.6
[*] File Ouput:
        ELF 64-bit LSB shared object
        x86-64
        version 1 (SYSV)
        dynamically linked
        BuildID[sha1]=515ea3f306c349f2ef11399cbebd3900fab188d1
        not stripped
[*] Running Analysis...
...
```

![suspicious-threat.png](/assets/ctf/htb/forensics/suspicious-threat.png)

Program is looking for `pr3l04d_` directory, but `fopen` is looking for `lp.so.preload`

![suspicious-threat-1.png](/assets/ctf/htb/forensics/suspicious-threat-1.png)

The search is unsuccessful
```bash
root@ng-932570-forensicssuspiciousthreatmp-u0ybi-7fcf567d47-vwbdt:/# find / -iname '*pr3l04d*' 2>/dev/null
root@ng-932570-forensicssuspiciousthreatmp-u0ybi-7fcf567d47-vwbdt:/# find / -iname '*ld.so.preload*' 2>/dev/null
```

[/etc/ld.so.preload](https://book.hacktricks.xyz/linux-hardening/privilege-escalation/write-to-root#etc-ld.so.preload) is a way to elevate privileges by hijacking **LD_PRELOAD** env variable. By moving the file the directories/files are created:
```bash
root@ng-932570-forensicssuspiciousthreatmp-u0ybi-7fcf567d47-vwbdt:/# mv /usr/lib/x86_64-linux-gnu/libc.hook.so.6 /dev/shm
root@ng-932570-forensicssuspiciousthreatmp-u0ybi-7fcf567d47-vwbdt:/# find / -iname '*pr3l04d*' 2>/dev/null
/var/pr3l04d_
root@ng-932570-forensicssuspiciousthreatmp-u0ybi-7fcf567d47-vwbdt:/# find / -iname '*ld.so.preload*' 2>/dev/null
/etc/ld.so.preload
root@ng-932570-forensicssuspiciousthreatmp-u0ybi-7fcf567d47-vwbdt:/# cat /etc/ld.so.preload
ERROR: ld.so: object '/lib/x86_64-linux-gnu/libc.hook.so.6' from /etc/ld.so.preload cannot be preloaded (cannot open shared object file): ignored.
/lib/x86_64-linux-gnu/libc.hook.so.6
root@ng-932570-forensicssuspiciousthreatmp-u0ybi-7fcf567d47-vwbdt:/# ls /var/pr3l04d_
ERROR: ld.so: object '/lib/x86_64-linux-gnu/libc.hook.so.6' from /etc/ld.so.preload cannot be preloaded (cannot open shared object file): ignored.
flag.txt
root@ng-932570-forensicssuspiciousthreatmp-u0ybi-7fcf567d47-vwbdt:/# cat /var/pr3l04d_/flag.txt
ERROR: ld.so: object '/lib/x86_64-linux-gnu/libc.hook.so.6' from /etc/ld.so.preload cannot be preloaded (cannot open shared object file): ignored.
HTB{Us3rL4nd_R00tK1t_R3m0v3dd!}
```

> Flag: `HTB{Us3rL4nd_R00tK1t_R3m0v3dd!}`

