---
title: aupCTF 2023 - Forensics Challenges
date: Sat Jul  1 01:38:46 PM +04 2023
categories: [Writeup]
tags: [ctf,aupctf,forensics]
---

## Thread

Tom had always been curious about programming, and one day he stumbled upon a new coding language that he had never heard of before. Excited to learn more, he asked ChatGPT for some resources to get started. ChatGPT provided a link to a website that had some useful tutorials and code samples. But when Tom tried to download one of the files, his computer started behaving strangely. After running the commands md5sum tutorial.pdf > result.txt and cat result.txt, the following output is received: d0ee6ffc8ce0e7f21cdcbd5e98c2dd4174a5d1b0266ec7f69075a0d9bea14757

Flag Format: aupCTF{popular threat label}

### Solution

Since computer started behaving strangely, we may be dealing with a virus, to check this hypothesis we can go to [VirusTotal](https://www.virustotal.com/gui/home/search) and search with hash.

<https://www.virustotal.com/gui/file/d0ee6ffc8ce0e7f21cdcbd5e98c2dd4174a5d1b0266ec7f69075a0d9bea14757><br>
![thread-1](/assets/images/aupCTF/2023/thread-1.png)

> Flag: aupCTF{trojan.nanocore/msil}
{: .prompt-tip }

<!-- SEPERATOR -->

## I Love Math

Challenge: [math](https://aupctf.s3.eu-north-1.amazonaws.com/math.pdf)

### Solution

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

We open the document, but its empty! `I can't see anything here`. I tried selecting all text (Ctrl+A) to reveal potentially invisible text.
![i-love-math-1](/assets/images/aupCTF/2023/i-love-math-1.png)

Let's remember some math from school D:

2x + 4y = 16 \|&nbsp; 3 \|&nbsp; 6x + 12y =&nbsp; 48<br>
3x + 7y = 25 \| -2 \| -6x - 14y = -50

If we add equasions we get: -2y = -2 => y = 1<br>
2x + 4y = 16 => 2x + 4 = 16 => 2x = 12 => x = 6

> Flag: aupCTF{I_Love_Math_6_1}
{: .prompt-tip }

<!-- SEPERATOR -->

## Password Recovery

We stumble upon a lost smartphone that holds crucial data for an ongoing investigation. Unfortunately, the owner seems to have forgotten the screen lock password, but there is a glimmer of hope. The victim, in an attempt to remember the password, left a clue on the phone's lock screen. use your forensics skills to find the password.

[file](https://aupctf.s3.eu-north-1.amazonaws.com/locked.tar.gz)

Flag format: aupCTF{password}

Hint: _In android lock screen info is saved in a database_

### Solution

Unarchiving can take some time, file inside is ~5.51GB

```bash
└─$ file Challenge.dd                                                                                             
Challenge.dd: DOS/MBR boot sector; GRand Unified Bootloader, stage1 version 0x3                                     
```

Unarchiving gives us a [DD file](https://www.whatisfileextension.com/dd/) which is a disk image file and replica of a hard disk drive.<br>
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

> Multiplying the **starting sector** by the **sector size** gives you the total number of bytes to skip to reach the beginning of the partition.
{: .prompt-info }

```bash
└─$ sudo find tmpmount -type f -name "*db"
...
tmpmount/system/locksettings.db

└─$ sqlitebrowser tmpmount/system/locksettings.db
```

![password-recovery-1](/assets/images/aupCTF/2023/password-recovery-1.png)

Looks like Base64...

```bash
└─$ echo -n 'cDQkc3cwMDByZENMVTM=' | base64 -d
p4$sw000rdCLU3
```                                        

> Flag: aupCTF{p4$sw000rdCLU3}
{: .prompt-tip }

> Notice '=' (padding) at the end, Base64 encoding always produces a string with a length that is a multiple of 4.
{: .prompt-info }

> Don't forget to unmount the device `sudo umount tmpmount`.
{: .prompt-warning }

<!-- SEPERATOR -->

## Kingsman

Welcome to Kingsman, the world's most elite intelligence agency where we pride ourselves on our cutting-edge technology. However, it appears that our highly sophisticated security system has been breached by an unknown hacker. Even our state-of-the-art AI, Merlin, has failed to protect our system against this intrusion. Your mission, if you choose to accept it, is to use your advanced decryption skills to bypass our highly flawed password policy and uncover the secrets that lie within. Get ready for the ultimate test of your intelligence as you embark on this daring mission to decrypt the hidden message that awaits. Only by cracking the code will you be able to claim your victory and prove yourself worthy of becoming a Kingsman agent. So, are you ready to accept this challenge?

The password requirements are as follows:
+ [ ] The first character must be a digit.
+ [ ] The second character must be a special character. " ! @ $ % ^ & * ( ) "
+ [ ] A pet name should follow the special character.
+ [ ] An uppercase letter comes next.
+ [ ] Finally, a lowercase letter.

Remember, Your objective is to crack the encryption and reveal the hidden message. -- John

Challenge file: [encrypted.7z](https://aupctf.s3.eu-north-1.amazonaws.com/encrypted.7z)

<details> 
  <summary>Hint: </summary>
   Don't tell anyone that i gave you names of the <em><strong><a href="https://aupctf.s3.eu-north-1.amazonaws.com/pets.txt">pets</a></strong></em>
</details>

### Solution

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

> Flag: aupCTF{j0hncr4ck5pa55w0rd5}
{: .prompt-tip }

> Zip Password: `9 + " + roxy + F + k` -> `9"roxyFk`
{: .prompt-info }

<!-- SEPERATOR -->

## MemDump

... Still Thinking ...