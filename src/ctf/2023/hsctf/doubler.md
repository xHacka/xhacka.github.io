# Doubler

## Description

pwn/doubler (by hmmm) | 392 points

A very simple program.

`nc doubler.hsctf.com 1337`

Downloads:  [chall](https://hsctf-10-resources.storage.googleapis.com/uploads/1419382e0e052a5b4ccf31d9f6cc1a858d02b168013629b538fffbf5e0e3cd20/chall),  [chall.c](https://hsctf-10-resources.storage.googleapis.com/uploads/d7da0dd8713bef707ea1c835be05d858a1417677eb19b7734046df3f2b60c113/chall.c)

## Analysis

Program wants value of `-100`, but input cannot be negative number.

Since program is written in C (Statically typed language), we can cause an overflow of type int which when overflowed will cycle to lowest number (negative 2**31)  

## Solution

```c
#include <stdio.h>
#include <limits.h>

int main() {
    int max = INT_MAX, doubled;
    for (int i=0; i < 100; i++) {
        doubled = (max - i) * 2;
        if (doubled == -100) {
            printf("%d\n", max - i);  
            break;
        } 
    }
    
    return 0;
}
```
<small>Note: You can use an [Online Compiler](https://www.programiz.com/c-programming/online-compiler/) to run the program</small>

```sh
└─$ gcc solve.c -o solve
./solve
{OUTPUT}

└─$ nc doubler.hsctf.com 1337
Input: {OUTPUT}
Doubled: -100
flag{REDACTED}
```
