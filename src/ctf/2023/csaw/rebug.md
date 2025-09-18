# Rebug

## Rebug 1

### Description

Can't seem to print out the flag :( Can you figure out how to get the flag with this binary?

Author:  `Mahmoud Shabana`

Downloads: [test.out](https://ctf.csaw.io/files/edee5dee14fceffc9f43af617eb4e92c/test.out?token=eyJ1c2VyX2lkIjoyODEzLCJ0ZWFtX2lkIjoxMTI0LCJmaWxlX2lkIjozNn0.ZQcwhQ.O5mE6HnUNSvj2V6x0B56RmcyE6I)

### Solution

The solution is quite disappointing, if input length is 12 then flag is printed out to us. 

Ghidra code, main function:

::: raw
```c
int main(void) {
  EVP_MD *type;
  char local_448 [44];
  uint _16;
  byte flag [16];
  char input [1008];
  EVP_MD_CTX *evp_md_ctx;
  int j;
  int i;
  
  printf("Enter the String: ");
  __isoc99_scanf("%s",input);
  for (i = 0; input[i] != '\0'; i = i + 1) {}
  if (i == 12) {
    puts("that\'s correct!");
    evp_md_ctx = (EVP_MD_CTX *)EVP_MD_CTX_new();
    type = EVP_md5();
    EVP_DigestInit_ex(evp_md_ctx,type,(ENGINE *)0x0);
    EVP_DigestUpdate(evp_md_ctx,"12",2);
    _16 = 16;
    EVP_DigestFinal_ex(evp_md_ctx,flag,&_16);
    EVP_MD_CTX_free(evp_md_ctx);
    for (j = 0; j < 16; j = j + 1) {
      sprintf(local_448 + j * 2,"%02x",(ulong)flag[j]);
    }
    printf("csawctf{%s}\n",local_448);
  }
  else {
    printf("that isn\'t correct, im sorry!");
  }
  return 0;
}
```
:::

```bash
└─$ perl -e 'print "A"x12' | ./test.out 
Enter the String: that's correct!
csawctf{c20ad4d76fe97759aa27a0c99bff6710}
```
::: tip Flag
`csawctf{c20ad4d76fe97759aa27a0c99bff6710}`
:::

## Rebug 2

### Description 

No input this time ;) Try to get the flag from the binary. When you find the answer of the program, please submit the flag in the following format:  `csawctf{output}`

`Author: Mahmoud Shabana`

Downloads: [bin.out](https://ctf.csaw.io/files/986b915bb5346d055963f03b092375a1/bin.out?token=eyJ1c2VyX2lkIjoyODEzLCJ0ZWFtX2lkIjoxMTI0LCJmaWxlX2lkIjo3fQ.ZQc4SQ.m21MeSxISv1QuzQfCYiHwWfXIiA)

### Solution

The program has no output or user input, it has hardcoded hex values which get processed in odd way. `main -> printbinchar -> xoring`

xoring:

```c

int xoring(long param_1) {
  undefined8 param1_tail;
  undefined8 local_30;
  undefined8 param1_head;
  undefined8 local_20;
  int j;
  int i;
  
  param1_head = 0;
  local_20 = 0;
  param1_tail = 0;
  local_30 = 0;
  for (i = 0; i < 4; i = i + 1) {
    // *(undefined4 *)((long)&param1_head + (long)i * 4) = *(undefined4 *)(param_1 + (long)i * 4);
    // *(undefined4 *)((long)&param1_tail + (long)i * 4) = *(undefined4 *)(param_1 + ((long)i + 4) * 4);
    param1_head[i] = param_1[i];
    param1_tail[i] = param_1[i + 4];
  }
  for (j = 0; j < 4; j = j + 1) {
    // if (*(int *)((long)&param1_head + (long)j * 4) == *(int *)((long)&param1_tail + (long)j * 4))
    if param1_head[i] == param1_tail[i]
    {
      flag[index_flag] = '0';
    }
    else {
      flag[index_flag] = '1';
    }
    index_flag = index_flag + 1;
  }
  return 0;
}
```

Inspecting in the IDA before exit function: 

![Rebug-2-1](/assets/ctf/csawctf/rebug-2-1.png)
::: tip Flag
`csawctf{01011100010001110000}`
:::