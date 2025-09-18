# Forensics Challenges

# Forensics Challenges

### Thread

Tom had always been curious about programming, and one day he stumbled upon a new coding language that he had never heard of before. Excited to learn more, he asked ChatGPT for some resources to get started. ChatGPT provided a link to a website that had some useful tutorials and code samples. But when Tom tried to download one of the files, his computer started behaving strangely. After running the commands md5sum tutorial.pdf > result.txt and cat result.txt, the following output is received: d0ee6ffc8ce0e7f21cdcbd5e98c2dd4174a5d1b0266ec7f69075a0d9bea14757

Flag Format: aupCTF{popular threat label}

#### Solution

Since computer started behaving strangely, we may be dealing with a virus, to check this hypothesis we can go to [VirusTotal](https://www.virustotal.com/gui/home/search) and search with hash.

[https://www.virustotal.com/gui/file/d0ee6ffc8ce0e7f21cdcbd5e98c2dd4174a5d1b0266ec7f69075a0d9bea14757](https://www.virustotal.com/gui/file/d0ee6ffc8ce0e7f21cdcbd5e98c2dd4174a5d1b0266ec7f69075a0d9bea14757)\
![thread-1](/assets/ctf/aupctf/thread-1.png)

::: tip Flag
`aupCTF{trojan.nanocore/msil}`
:::

### I Love Math

Challenge: [math](https://aupctf.s3.eu-north-1.amazonaws.com/math.pdf)

#### Solution

The challenge file is a pdf, with password.

Crack the password with john

```bash
└─$ pdf2john math.pdf > math.hash

└─$ john --wordlist=$rockyou math.hash
Using default input encoding: UTF-8
Loaded 1 password hash (PDF [MD5 SHA2 RC4/AES 32/64])
Cost 1 (revision) is 6 for all loaded hashes
Will run 4 OpenMP threads
Press 'q' or Ctrl-C to abort, almost any other key for status
naruto           (math.pdf)     
1g 0:00:00:00 DONE (2023-06-26 15:38) 4.347g/s 556.5p/s 556.5c/s 556.5C/s 123456..diamond
Use the "--show --format=PDF" options to display all of the cracked passwords reliably
Session completed.              
```

We open the document, but its empty! `I can't see anything here`. I tried selecting all text (Ctrl+A) to reveal potentially invisible text.![i-love-math-1](/assets/ctf/aupctf/i-love-math-1.png)

Let's remember some math from school D:

2x + 4y = 16 |  3 |  6x + 12y =  48\
3x + 7y = 25 | -2 | -6x - 14y = -50

If we add equasions we get: -2y = -2 => y = 1\
2x + 4y = 16 => 2x + 4 = 16 => 2x = 12 => x = 6

::: tip Flag
`aupCTF{I\_Love\_Math\_6\_1}`
:::

### Password Recovery

We stumble upon a lost smartphone that holds crucial data for an ongoing investigation. Unfortunately, the owner seems to have forgotten the screen lock password, but there is a glimmer of hope. The victim, in an attempt to remember the password, left a clue on the phone's lock screen. use your forensics skills to find the password.

[file](https://aupctf.s3.eu-north-1.amazonaws.com/locked.tar.gz)

Flag format: aupCTF{password}

Hint: _In android lock screen info is saved in a database_

#### Solution

Unarchiving can take some time, file inside is \~5.51GB

```bash
└─$ file Challenge.dd                                                                                             
Challenge.dd: DOS/MBR boot sector; GRand Unified Bootloader, stage1 version 0x3                                     
```

Unarchiving gives us a [DD file](https://www.whatisfileextension.com/dd/) which is a disk image file and replica of a hard disk drive.\
To view the information on file first list partitions.

```bash
└─$ fdisk -l Challenge.dd
Disk Challenge.dd: 5.51 GiB, 5915017216 bytes, 11552768 sectors
Units: sectors of 1 * 512 = 512 bytes
Sector size (logical/physical): 512 bytes / 512 bytes
I/O size (minimum/optimal): 512 bytes / 512 bytes
Disklabel type: dos
Disk identifier: 0x00000000

Device        Boot   Start      End  Sectors  Size Id Type
Challenge.dd1         2048  1050623  1048576  512M 83 Linux
Challenge.dd2      1050624  1067007    16384    8M 83 Linux
Challenge.dd3      1067008 12999999 11932992  5.7G 83 Linux
```

The most interesting would be `dd3`, so let's mount it and explore the filesystem.

```bash
└─$ sudo mdkir tmpmount

└─$ sudo mount -o loop,offset=$(perl -e 'print 1067008 * 512') Challenge.dd tmpmount
```

::: info :information_source:
Multiplyingthe **starting sector** by the **sector size** gives you the total number of bytes to skip to reach the beginning of the partition.
:::

```bash
└─$ sudo find tmpmount -type f -name "*db"
...
tmpmount/system/locksettings.db

└─$ sqlitebrowser tmpmount/system/locksettings.db
```

![password-recovery-1](/assets/ctf/aupctf/password-recovery-1.png)

Looks like Base64...

```bash
└─$ echo -n 'cDQkc3cwMDByZENMVTM=' | base64 -d
p4$sw000rdCLU3
```

::: tip Flag
`aupCTF{p4$sw000rdCLU3}`
:::

::: info :information_source:
Notice'=' (padding) at the end, Base64 encoding always produces a string with a length that is a multiple of 4.
:::

::: warning :warning:
Don'tforget to unmount the device `sudo umount tmpmount`.
:::

### Kingsman

Welcome to Kingsman, the world's most elite intelligence agency where we pride ourselves on our cutting-edge technology. However, it appears that our highly sophisticated security system has been breached by an unknown hacker. Even our state-of-the-art AI, Merlin, has failed to protect our system against this intrusion. Your mission, if you choose to accept it, is to use your advanced decryption skills to bypass our highly flawed password policy and uncover the secrets that lie within. Get ready for the ultimate test of your intelligence as you embark on this daring mission to decrypt the hidden message that awaits. Only by cracking the code will you be able to claim your victory and prove yourself worthy of becoming a Kingsman agent. So, are you ready to accept this challenge?

The password requirements are as follows:

* [ ] The first character must be a digit.
* [ ] The second character must be a special character. " ! @ $ % ^ & \* ( ) "
* [ ] A pet name should follow the special character.
* [ ] An uppercase letter comes next.
* [ ] Finally, a lowercase letter.

Remember, Your objective is to crack the encryption and reveal the hidden message. -- John

Challenge file: [encrypted.7z](https://aupctf.s3.eu-north-1.amazonaws.com/encrypted.7z)

<details>

<summary>Hint:</summary>

Don't tell anyone that i gave you names of the [_**pets**_](https://aupctf.s3.eu-north-1.amazonaws.com/pets.txt)

</details>

#### Solution

First lets get hash to crack and start cracking.

```bash
7z2john encrypted.7z > encrypted.hash
```

I'll be using `hashcat` to crack the hash so I'll delete the name portion (text till `$7z$`) and only leave hash.

Now let's create a wordlist

```py
import string
import itertools

special_chars = '"!@$%^&*()' # " (Quotes) Included
pets = ['max', 'charlie', 'cooper', 'jack', 'rocky', 'bear', 'roxy', 'lucy', 'duke', 'toby']
passwords = itertools.product(
    string.digits, 
    special_chars, 
    pets, 
    string.ascii_uppercase, 
    string.ascii_lowercase
)

with open("passwords", "w") as f:
    for password in passwords:
        f.write(''.join(password) + '\n')
```

```bash
└─$ hashcat --show encrypted.hash # Get Attack Mode
11600 | 7-Zip | Archive

└─$ hashcat -m 11600 encrypted.hash passwords # Start Cracking
...
{7zHash}:9"roxyFk                             # "
...

└─$ 7z x encrypted.7z # Extract Zip
...

└─$ cat flag.txt
Congratulations on cracking this password! Password cracking is a complex and time-consuming task that requires skill and patience. By successfully completing this challenge, you have proven that you have what it takes to be a top-notch security professional. Keep up the good work and continue learning and exploring the fascinating world of cybersecurity.
Here is your Reward  YXVwQ1RGe2owaG5jcjRjazVwYTU1dzByZDUhfQ==

└─$ echo -n 'YXVwQ1RGe2owaG5jcjRjazVwYTU1dzByZDUhfQ==' | base64 -d
aupCTF{j0hncr4ck5pa55w0rd5!}
```

::: tip Flag
`aupCTF{j0hncr4ck5pa55w0rd5}`
:::

::: info :information_source:
ZipPassword: `9 + " + roxy + F + k` -> `9"roxyFk`
:::

### MemDump

You are investigating a potential security incident within your organization. Malicious activity has been detected on one of the company's servers. To gather more information, you need to analyze a memory image of the affected server. You are provided with a memory image of the infected host.

you need to download the memory image from this link: [download file](https://aupctf.s3.eu-north-1.amazonaws.com/memdump2.mem)

Your goal is to find the flag, which consists of the process name of the malicious activity.

Flag format: `aupCTF{processname.exe}`

#### Solution

I was having trouble opening the file, huge thank you to the [author of aupCTF](https://github.com/asadse7en) for recommending [Volatility](https://www.volatilityfoundation.org)

I found a great post demonstrating how to use tool at [https://www.varonis.com/blog/how-to-use-volatility](https://www.varonis.com/blog/how-to-use-volatility)

`windows.malfind` _displays a list of processes that Volatility suspects may contain injected code based on the header_.

```bash
└─$ py vol.py -f ../memdump2.mem windows.malfind | tee output_malfind.log
Volatility 3 Framework 2.4.2    PDB scanning finished

PID     Process Start VPN       End VPN Tag     Protection      CommitCharge    PrivateMemory   File output     Hexdump Disasm

5964    notepad.exe     0x20c91fd0000   0x20c92018fff   VadS    PAGE_EXECUTE_READWRITE  73      1       Disabled
4d 5a 41 52 55 48 89 e5 MZARUH..
48 81 ec 20 00 00 00 48 H......H
8d 1d ea ff ff ff 48 89 ......H.
df 48 81 c3 a4 6e 01 00 .H...n..
ff d3 41 b8 f0 b5 a2 56 ..A....V
68 04 00 00 00 5a 48 89 h....ZH.
f9 ff d0 00 00 00 00 00 ........
00 00 00 00 10 01 00 00 ........        

5964    notepad.exe     0x20c92590000   0x20c925e5fff   VadS    PAGE_EXECUTE_READWRITE  86      1       Disabled
4d 5a 41 52 55 48 89 e5 MZARUH..
48 81 ec 20 00 00 00 48 H......H
8d 1d ea ff ff ff 48 89 ......H.
df 48 81 c3 a4 6e 01 00 .H...n..
ff d3 41 b8 f0 b5 a2 56 ..A....V
68 04 00 00 00 5a 48 89 h....ZH.
f9 ff d0 00 00 00 00 00 ........
00 00 00 00 10 01 00 00 ........        
```

```bash
└─$ py vol.py -f ../memdump2.mem windows.pstree | tee output_pstree.log
PID     PPID    ImageFileName   Offset(V)       Threads Handles SessionId       Wow64   CreateTime      ExitTime
...
2384	2176	EC2Launch.exe	0x9781f7f96080	0	-	0	False	2023-03-27 15:48:57.000000 	2023-03-27 15:49:17.000000
3536	2564	csrss.exe	0x9781f7f90080	10	-	2	False	2023-03-27 16:00:33.000000 	N/A
3352	2564	winlogon.exe	0x9781f7f9a080	3	-	2	False	2023-03-27 16:00:33.000000 	N/A
* 3520	3352	fontdrvhost.ex	0x9781f5143080	5	-	2	False	2023-03-27 16:00:34.000000 	N/A
* 1112	3352	userinit.exe	0x9781f8f5b0c0	0	-	2	False	2023-03-27 16:00:42.000000 	2023-03-27 16:01:24.000000
** 3420	1112	explorer.exe	0x9781f8f60080	51	-	2	False	2023-03-27 16:00:42.000000 	N/A
*** 4504	3420	win32calc.exe	0x9781fafed0c0	3	-	2	False	2023-03-27 17:06:34.000000 	N/A
*** 5964	3420	notepad.exe	0x9781f9932080	4	-	2	False	2023-03-27 17:06:25.000000 	N/A
*** 7052	3420	cmd.exe	0x9781fa67d080	1	-	2	False	2023-03-27 17:09:24.000000 	N/A
**** 7072	7052	conhost.exe	0x9781fa849080	3	-	2	False	2023-03-27 17:09:24.000000 	N/A
*** 6000	3420	msedge.exe	0x9781fa0b1380	33	-	2	False	2023-03-27 17:07:12.000000 	N/A
...
*** 4408	3420	Taskmgr.exe	0x9781f9921080	12	-	2	False	2023-03-27 16:19:31.000000 	N/A
*** 4668	3420	powershell.exe	0x9781f8f613c0	9	-	2	False	2023-03-27 17:09:16.000000 	N/A
**** 5828	4668	conhost.exe	0x9781f9d28080	4	-	2	False	2023-03-27 17:09:16.000000 	N/A
...
```

DLL injection is a technique that allows code to be inserted into a running process. From `pstree` we see that first `notepad.exe` is opened, followed up with `cmd.exe`. It's unclear whether injection happened via `cmd` or `powershell`. I found a [post](https://tbhaxor.com/createremotethread-process-injection/) demonstrating this technique and it's highly likely that `powershell` was used.

::: tip Flag
`aupCTF{notepad.exe}`
:::
