# The Archive

# Description

Level: 1 Score 5 Category miscellaneous

I've forgotten my archive password. Help me restore it

**Link:** [SecurityValley/PublicCTFChallenges/miscellaneous/the_archive](https://github.com/SecurityValley/PublicCTFChallenges/tree/master/miscellaneous/the_archive)

## Analysis

We are given a zip file with a flag in it, but its requires a password

## Solution

```sh
└─$ zip2john archive.zip > archive.hash   
ver 1.0 efh 5455 efh 7875 archive.zip/flag.txt PKZIP Encr: 2b chk, TS_chk, cmplen=43, decmplen=31, crc=58198341 ts=96EA cs=96ea type=0

└─$ john --wordlist=$rockyou archive.hash
Using default input encoding: UTF-8
Loaded 1 password hash (PKZIP [32/64])
Will run 4 OpenMP threads
Press 'q' or Ctrl-C to abort, almost any other key for status
psychedelicfurs  (archive.zip/flag.txt)     
1g 0:00:00:00 DONE (2023-06-04 10:20) 2.631g/s 3621Kp/s 3621Kc/s 3621KC/s quaheem..princess-xx
Use the "--show" option to display all of the cracked passwords reliably
Session completed. 

└─$ unzip archive.zip
Archive:  archive.zip
[archive.zip] flag.txt password:      # Password Not Visible When Entering
 extracting: flag.txt                
```

I used `zip2john` to convert hash to format which ***[john](https://www.kali.org/tools/john/)*** recognizes.<br>
Then we run `john` with wordlist `rockyou.txt` on the hash file.<br>
Within few seconds we get password `psychedelicfurs (archive.zip/flag.txt)`<br>
We then extract the zip and finally `cat` to read the flag.