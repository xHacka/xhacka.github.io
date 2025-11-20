# Linux Things

## Find all the SUID/SGID executables:

```bash
find / -perm -4000 -ls 2>/dev/null
find / -a \( -perm -u+s -o -perm -g+s \) -ls 2>/dev/null
```

## Port Scan with Bash

```bash
host=127.0.0.1
port=4444
(echo >/dev/tcp/${host}/${port}) &>/dev/null && echo "open" || echo "closed"
```