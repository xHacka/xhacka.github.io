# keygen

## Description

rev/keygen (by hmmm) | 304 points

A file: what's the key?

[keygen](https://hsctf-10-resources.storage.googleapis.com/uploads/d1f4fd3e4a0935e25ef630ca70bd74d54372b84b9a86d214d731f7979b2bce9a/keygen)

## Analysis

Opening program in Ghidra gives us pseudo code of main.

```c
int main(int argc,long argv) {
  size_t sVar1;
  byte *flag;
  byte *input;
  
  // Program requires command line argument
  // Argument length should be 42
  if ((argc == 2) && (sVar1 = strlen(*(char **)(argv + 8)), sVar1 == 42)) {
    puts("dfdfdf"); // Gets printed if conditions are met
    input = *(byte **)(argv + 8); // Pointer to argument
    flag = &DAT_00102008;         // Flag somewhere in memory
    while( true ) {
      if (*input == 0) { // If fully iterated
        puts("Correct");
        return 0;
      }
      // Check if `input` XOR-ed with `10` is same as flag.
      if ((*input ^ 10) != *flag) break;
      input = input + 1; // Get next character address
      flag = flag + 1;   // Get next character address
    }
    puts("Wrong");
    return 1;
  }
  puts("Wrong");
  return 1;
}
```
<small>Note: Variable names edited for more readability</small>

So in short flag is taken from somewhere in program, input gets XOR-ed with key `10` and compared to flag character by character.

We can view the memory location in Ghidra by double clicking `&DAT_*`
![keygen-1](/assets/ctf/hsctf/keygen-1.png)

I always like to run `strings` first on ELF files for string values, at first I thought it had garbage, but seems like it contained an encrypted flag.

```sh
└─$ strings -d -n 10 keygen
/lib64/ld-linux-x86-64.so.2
__libc_start_main
__cxa_finalize
GLIBC_2.2.5
GLIBC_2.34
_ITM_deregisterTMCloneTable
__gmon_start__
_ITM_registerTMCloneTable
lfkmq<8=?=>?l'==<2'<;=>'?l<i'<l<9<h9l::::w
```

## Solution
 
Using CyberChef we can decode value (since XOR is symmetric encryption)
![keygen-2](/assets/ctf/hsctf/keygen-2.png)