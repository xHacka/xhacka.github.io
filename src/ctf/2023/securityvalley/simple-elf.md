# Simple Elf

## Description

Level: 1 Score 5 Category reversing

Can you deal with dwarfs and elfs

**Link:** [SecurityValley/PublicCTFChallenges/reversing/the_elf](https://github.com/SecurityValley/PublicCTFChallenges/tree/master/reversing/the_elf)

## Analysis
```sh
└─$ chmod u+x crackme-01        

└─$ ./crackme-01                
Sometimes, there is something inside me. Can you get it?
S 
Whoops, that was weird??
```

## Solution

Program says `there is something inside me.` so I tried running `strings` on the file.
```sh
└─$ strings -d -n 6 ./crackme-01
/lib64/ld-linux-x86-64.so.2
__cxa_finalize
__libc_start_main
printf
libc.so.6
GLIBC_2.2.5
GLIBC_2.34
_ITM_deregisterTMCloneTable
__gmon_start__
_ITM_registerTMCloneTable
SecVal{REDACTED}
Whoops, that was weird?? 
Sometimes, there is something inside me. Can you get it?
```