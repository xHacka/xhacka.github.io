# No Statics

## Description

Level: 1 Score 10 Category reversing

This time there is no static value inside...but you are the best. So crack it baby!

**Link:** [SecurityValley/PublicCTFChallenges/reversing/no_static](https://github.com/SecurityValley/PublicCTFChallenges/tree/master/reversing/no_static)

## Solution

```sh
└─$ file ./crackme-02        
./crackme-02: ELF 64-bit LSB pie executable, x86-64, version 1 (SYSV), dynamically linked, interpreter /lib64/ld-linux-x86-64.so.2, BuildID[sha1]=48fbe31f3c3d1c08d56dde0bb64eb27804d8b9e4, for GNU/Linux 3.2.0, not stripped

└─$  chmod  u+x  crackme-02

└─$ ./crackme-02             
Again, there is something inside me!
enter your passphrase, please!
Test # <-- Input
try:Test
 ........ 
mySecret 
WRONG!

└─$ ./crackme-02
Again, there is something inside me!
enter your passphrase, please!
mySecret # <-- Input
try:mySecret ........ 
mySecret 
SecVal{REDACTED} 
```