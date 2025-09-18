# The Loader

## The loader

## Description

Level: 3 Score 30 Category reversing

I've seen that in malware before. There must be something inside

**Link:** [SecurityValley/PublicCTFChallenges/reversing/the_loader](https://github.com/SecurityValley/PublicCTFChallenges/tree/master/reversing/the_loader) 

## Analysis 

```bash
└─$ file ./crackme-03                  
./crackme-03: ELF 64-bit LSB pie executable, x86-64, version 1 (SYSV), dynamically linked, interpreter /lib64/ld-linux-x86-64.so.2, BuildID[sha1]=ea682044081d67c91cecfc045521f43e40bd9330, for GNU/Linux 3.2.0, not stripped

└─$  chmod  u+x  crackme-03

└─$ ./crackme-03                       
0.\0/
/ \ 

Wouldn't it be cool to be able to look into the memory?

1./0\
/ \ 

Wouldn't it be cool to be able to look into the memory?

...
```

So let't take a look inside the program. 

I'll be using [Ghidra](https://github.com/NationalSecurityAgency/ghidra) and [ghidra_auto](https://gist.github.com/liba2k/d522b4f20632c4581af728b286028f8f) script to quickly create a project.
```sh
└─$ ghidra_auto --temp crackme-03    
```

Most programs have a `main` function which is essentially start of the program.  To view main function navigate to `Symbol Tree (tab on the left corner) > Functions >  main`
```c
  data = &DAT_00102018;
  counter = 0;
  do {
    adjustCounter(&counter);
    hopStr = getHop(counter);
    printf("%d.%s \n\nWouldn\'t it be cool to be able to look into the memory?\n\n"(ulong)counter, hopStr);
    huuu(data);
    counter = counter + 1;
    sleep(1);
  } while( true );
```
<small>Note: I have changed variables for more readability (by using lowercase `L`)</small>

When we ran the program we saw that output was simple printf, so we can ignore it. What's interesting is `huuu(data)`. `data` is a memory which gets loaded from program. Let's take a look at `huuu` (double click to jump to pseudo source code)
```c
void huuu(undefined8 data) {
  undefined8 loadedMemory;
  undefined8 loadedMemorySize;
  
  loadedMemory = load_s_mem(data,0xfe);
  loadedMemorySize = get_str_size(loadedMemory);
  unload_mem(loadedMemory,loadedMemorySize);
  return;
}
```
Looks like the function does absolutely nothing, it loads the memory and unloads it. But what does it load?
```c

void * load_s_mem(void *data, byte key) {
  size_t __size;
  void *__dest;
  int i;
  
  __size = get_str_size(data);
  __dest = malloc(__size);
  memcpy(__dest,data,__size);
  for (i = 0; (ulong)(long)i < __size; i = i + 1) {
    *(byte *)((long)__dest + (long)i) = *(byte *)((long)__dest + (long)i) ^ key;
  }
  *(undefined *)(__size + (long)__dest) = 0;
  return __dest;
}
```
What actually happens in this function? and why does the code look so scary? 
* Simple Answer: Each item in data gets xor-ed with the key and finally is returned
* Long Answer: 
	1. `__dest =  malloc(__size);` Memory is getting allocated with size of data
	2. `memcpy(__dest,data,__size);` Data is getting copied inside `__dest` (buffer)
	3. Standard `for` loop
	4. `*(byte *)((long)__dest +  (long)i)`
		1. `(long)__dest + (long)i` moves the `__dest` base pointer by `i` bytes
		2. `(byte *)` then pointer is type casted to `byte` pointer (`malloc` return void pointer)
		3. `*` finally the pointer is getting dereferenced and byte value stored at that address gets retrieved . 
	5. On the right side of expression byte value is getting XOR-ed with param_2 (key)
		* `^` = XOR
	6. `*(undefined *)(__size +  (long)__dest)  =  0;` Finally the last byte is getting assigned null byte to mark the end of buffer.

Ok, XOR is simple to reverse. We have key, but we dont have the data. Ghidra makes it easy to view some regions of memory. Let's go back to main.
```c
data = &DAT_00102018;
```
<small>Note: Double click <strong>&DAT_*</strong> to jump to address</small>

![the-loader-1](/assets/ctf/securityvalley/the-loader-1.png)

Extracted data: `ad9b9da89f928589caa7a1c9cea196ca8cbaa1b8ceaca1a7ceab830000000000`

## Solution

![the-loader-2](/assets/ctf/securityvalley/the-loader-2.png)