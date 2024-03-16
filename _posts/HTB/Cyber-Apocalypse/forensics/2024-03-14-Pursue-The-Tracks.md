---
title: HTB Cyber Apocalypse - Pursue The Tracks
date: Sat Mar 14 10:38:23 PM +04 2024
categories: [Writeup]
tags: [ctf,htb,htb2024,htb_cyber_apocalypse_2024,forensics,mft]
---

## Description

POINTS: 450<br>
DIFFICULTY: easy

Luxx, leader of The Phreaks, immerses himself in the depths of his computer, tirelessly pursuing the secrets of a file he obtained accessing an opposing faction member workstation. With unwavering determination, he scours through data, putting together fragments of information trying to take some advantage on other factions. To get the flag, you need to answer the questions from the docker instance.

## Solution

We are given raw [MFT](https://learn.microsoft.com/en-us/windows/win32/fileio/master-file-table) file which we have to parse and then submit answers using netcat.

Till last question I used: [analyzeMFT](https://github.com/dkovar/analyzeMFT) to parse the results. (`-o` flag is important to output files! RTFM)<br>
For last question I was getting nowhere, I hardly found any docs mentioning the information needed and then I found <https://github.com/omerbenamram/mft> parser, which mostly displays all information about MFT.

```py
from pwn import remote, context
import sys

context.log_level = 'DEBUG'

IP = sys.argv[1]
PORT = sys.argv[2]

io = remote(IP, PORT)
io.sendlineafter(b'> ', b'2023,2024')
io.sendlineafter(b'> ', b'Final_Annual_Report.xlsx')
io.sendlineafter(b'> ', b'Marketing_Plan.xlsx') # Inactive
io.sendlineafter(b'> ', b'1') # Dot File
io.sendlineafter(b'> ', b'credentials.txt')
io.sendlineafter(b'> ', b'Financial_Statement_draft.xlsx') # Probably Copy
io.sendlineafter(b'> ', b'Project_Proposal.pdf') # ??? ~5files 
io.sendlineafter(b'> ', b'Annual_Report.xlsx') 
io.sendlineafter(b'> ', b'57344')

io.interactive()

# HTB{p4rs1ng_mft_1s_v3ry_1mp0rt4nt_s0m3t1m3s}
```

{::options parse_block_html="true" /}

<details>
<summary markdown="span">interaction.log</summary>

```bash
└─$ py solve.py 83.136.255.230 47156
[+] Opening connection to 83.136.255.230 on port 47156: Done
[DEBUG] Received 0x552 bytes:
    b'\n'
    b'+-------------------+---------------------------------------------------------------------------------------------------------------------------------------------------+\n'
    b'|       Title       |                                                                    Description                                                                    |\n'
    b'+-------------------+---------------------------------------------------------------------------------------------------------------------------------------------------+\n'
    b'| Pursue The Tracks |                                    Luxx, leader of The Phreaks, immerses himself in the depths of his computer,                                   |\n'
    b'|                   |                      tirelessly pursuing the secrets of a file he obtained accessing an opposing faction member workstation.                      |\n'
    b'|                   | With unwavering determination, he scours through data, putting together fragments of information trying to take some advantage on other factions. |\n'
    b'|                   |                                    To get the flag, you need to answer the questions from the docker instance.                                    |\n'
    b'+-------------------+---------------------------------------------------------------------------------------------------------------------------------------------------+\n'
    b'\n'
[DEBUG] Received 0x55 bytes:
    00000000  1b 5b 39 35  6d 46 69 6c  65 73 20 61  72 65 20 72  │·[95│mFil│es a│re r│
    00000010  65 6c 61 74  65 64 20 74  6f 20 74 77  6f 20 79 65  │elat│ed t│o tw│o ye│
    00000020  61 72 73 2c  20 77 68 69  63 68 20 61  72 65 20 74  │ars,│ whi│ch a│re t│
    00000030  68 6f 73 65  3f 20 28 66  6f 72 20 65  78 61 6d 70  │hose│? (f│or e│xamp│
    00000040  6c 65 3a 20  31 39 39 33  2c 31 39 39  35 29 0a 1b  │le: │1993│,199│5)··│
    00000050  5b 30 6d 3e  20                                     │[0m>│ │
    00000055
[DEBUG] Sent 0xa bytes:
    b'2023,2024\n'
[DEBUG] Received 0x18 bytes:
    00000000  1b 5b 39 32  6d 5b 2b 5d  20 43 6f 72  72 65 63 74  │·[92│m[+]│ Cor│rect│
    00000010  21 0a 0a 1b  5b 39 35 6d                            │!···│[95m│
    00000018
[DEBUG] Received 0x70 bytes:
    00000000  1b 5b 39 35  6d 54 68 65  72 65 20 61  72 65 20 73  │·[95│mThe│re a│re s│
    00000010  6f 6d 65 20  64 6f 63 75  6d 65 6e 74  73 2c 20 77  │ome │docu│ment│s, w│
    00000020  68 69 63 68  20 69 73 20  74 68 65 20  6e 61 6d 65  │hich│ is │the │name│
    00000030  20 6f 66 20  74 68 65 20  66 69 72 73  74 20 66 69  │ of │the │firs│t fi│
    00000040  6c 65 20 77  72 69 74 74  65 6e 3f 20  28 66 6f 72  │le w│ritt│en? │(for│
    00000050  20 65 78 61  6d 70 6c 65  3a 20 72 61  6e 64 6f 6d  │ exa│mple│: ra│ndom│
    00000060  6e 61 6d 65  2e 70 64 66  29 0a 1b 5b  30 6d 3e 20  │name│.pdf│)··[│0m> │
    00000070
[DEBUG] Sent 0x19 bytes:
    b'Final_Annual_Report.xlsx\n'
[DEBUG] Received 0x18 bytes:
    00000000  1b 5b 39 32  6d 5b 2b 5d  20 43 6f 72  72 65 63 74  │·[92│m[+]│ Cor│rect│
    00000010  21 0a 0a 1b  5b 39 35 6d                            │!···│[95m│
    00000018
[DEBUG] Received 0x41 bytes:
    00000000  1b 5b 39 35  6d 57 68 69  63 68 20 66  69 6c 65 20  │·[95│mWhi│ch f│ile │
    00000010  77 61 73 20  64 65 6c 65  74 65 64 3f  20 28 66 6f  │was │dele│ted?│ (fo│
    00000020  72 20 65 78  61 6d 70 6c  65 3a 20 72  61 6e 64 6f  │r ex│ampl│e: r│ando│
    00000030  6d 6e 61 6d  65 2e 70 64  66 29 0a 1b  5b 30 6d 3e  │mnam│e.pd│f)··│[0m>│
    00000040  20                                                  │ │
    00000041
[DEBUG] Sent 0x14 bytes:
    b'Marketing_Plan.xlsx\n'
[DEBUG] Received 0x18 bytes:
    00000000  1b 5b 39 32  6d 5b 2b 5d  20 43 6f 72  72 65 63 74  │·[92│m[+]│ Cor│rect│
    00000010  21 0a 0a 1b  5b 39 35 6d                            │!···│[95m│
    00000018
[DEBUG] Received 0x4c bytes:
    00000000  1b 5b 39 35  6d 48 6f 77  20 6d 61 6e  79 20 6f 66  │·[95│mHow│ man│y of│
    00000010  20 74 68 65  6d 20 68 61  76 65 20 62  65 65 6e 20  │ the│m ha│ve b│een │
    00000020  73 65 74 20  69 6e 20 48  69 64 64 65  6e 20 6d 6f  │set │in H│idde│n mo│
    00000030  64 65 3f 20  28 66 6f 72  20 65 78 61  6d 70 6c 65  │de? │(for│ exa│mple│
    00000040  3a 20 34 33  29 0a 1b 5b  30 6d 3e 20               │: 43│)··[│0m> │
    0000004c
[DEBUG] Sent 0x2 bytes:
    b'1\n'
[DEBUG] Received 0x18 bytes:
    00000000  1b 5b 39 32  6d 5b 2b 5d  20 43 6f 72  72 65 63 74  │·[92│m[+]│ Cor│rect│
    00000010  21 0a 0a 1b  5b 39 35 6d                            │!···│[95m│
    00000018
[DEBUG] Received 0x6b bytes:
    00000000  1b 5b 39 35  6d 57 68 69  63 68 20 69  73 20 74 68  │·[95│mWhi│ch i│s th│
    00000010  65 20 66 69  6c 65 6e 61  6d 65 20 6f  66 20 74 68  │e fi│lena│me o│f th│
    00000020  65 20 69 6d  70 6f 72 74  61 6e 74 20  54 58 54 20  │e im│port│ant │TXT │
    00000030  66 69 6c 65  20 74 68 61  74 20 77 61  73 20 63 72  │file│ tha│t wa│s cr│
    00000040  65 61 74 65  64 3f 20 28  66 6f 72 20  65 78 61 6d  │eate│d? (│for │exam│
    00000050  70 6c 65 3a  20 72 61 6e  64 6f 6d 6e  61 6d 65 2e  │ple:│ ran│domn│ame.│
    00000060  74 78 74 29  0a 1b 5b 30  6d 3e 20                  │txt)│··[0│m> │
    0000006b
[DEBUG] Sent 0x10 bytes:
    b'credentials.txt\n'
[DEBUG] Received 0x18 bytes:
    00000000  1b 5b 39 32  6d 5b 2b 5d  20 43 6f 72  72 65 63 74  │·[92│m[+]│ Cor│rect│
    00000010  21 0a 0a 1b  5b 39 35 6d                            │!···│[95m│
    00000018
[DEBUG] Received 0x5c bytes:
    00000000  1b 5b 39 35  6d 41 20 66  69 6c 65 20  77 61 73 20  │·[95│mA f│ile │was │
    00000010  61 6c 73 6f  20 63 6f 70  69 65 64 2c  20 77 68 69  │also│ cop│ied,│ whi│
    00000020  63 68 20 69  73 20 74 68  65 20 6e 65  77 20 66 69  │ch i│s th│e ne│w fi│
    00000030  6c 65 6e 61  6d 65 3f 20  28 66 6f 72  20 65 78 61  │lena│me? │(for│ exa│
    00000040  6d 70 6c 65  3a 20 72 61  6e 64 6f 6d  6e 61 6d 65  │mple│: ra│ndom│name│
    00000050  2e 70 64 66  29 0a 1b 5b  30 6d 3e 20               │.pdf│)··[│0m> │
    0000005c
[DEBUG] Sent 0x1f bytes:
    b'Financial_Statement_draft.xlsx\n'
[DEBUG] Received 0x18 bytes:
    00000000  1b 5b 39 32  6d 5b 2b 5d  20 43 6f 72  72 65 63 74  │·[92│m[+]│ Cor│rect│
    00000010  21 0a 0a 1b  5b 39 35 6d                            │!···│[95m│
    00000018
[DEBUG] Received 0x51 bytes:
    00000000  1b 5b 39 35  6d 57 68 69  63 68 20 66  69 6c 65 20  │·[95│mWhi│ch f│ile │
    00000010  77 61 73 20  6d 6f 64 69  66 69 65 64  20 61 66 74  │was │modi│fied│ aft│
    00000020  65 72 20 63  72 65 61 74  69 6f 6e 3f  20 28 66 6f  │er c│reat│ion?│ (fo│
    00000030  72 20 65 78  61 6d 70 6c  65 3a 20 72  61 6e 64 6f  │r ex│ampl│e: r│ando│
    00000040  6d 6e 61 6d  65 2e 70 64  66 29 0a 1b  5b 30 6d 3e  │mnam│e.pd│f)··│[0m>│
    00000050  20                                                  │ │
    00000051
[DEBUG] Sent 0x15 bytes:
    b'Project_Proposal.pdf\n'
[DEBUG] Received 0x18 bytes:
    00000000  1b 5b 39 32  6d 5b 2b 5d  20 43 6f 72  72 65 63 74  │·[92│m[+]│ Cor│rect│
    00000010  21 0a 0a 1b  5b 39 35 6d                            │!···│[95m│
    00000018
[DEBUG] Received 0x63 bytes:
    00000000  1b 5b 39 35  6d 57 68 61  74 20 69 73  20 74 68 65  │·[95│mWha│t is│ the│
    00000010  20 6e 61 6d  65 20 6f 66  20 74 68 65  20 66 69 6c  │ nam│e of│ the│ fil│
    00000020  65 20 6c 6f  63 61 74 65  64 20 61 74  20 72 65 63  │e lo│cate│d at│ rec│
    00000030  6f 72 64 20  6e 75 6d 62  65 72 20 34  35 3f 20 28  │ord │numb│er 4│5? (│
    00000040  66 6f 72 20  65 78 61 6d  70 6c 65 3a  20 72 61 6e  │for │exam│ple:│ ran│
    00000050  64 6f 6d 6e  61 6d 65 2e  70 64 66 29  0a 1b 5b 30  │domn│ame.│pdf)│··[0│
    00000060  6d 3e 20                                            │m> │
    00000063
[DEBUG] Sent 0x13 bytes:
    b'Annual_Report.xlsx\n'
[DEBUG] Received 0x18 bytes:
    00000000  1b 5b 39 32  6d 5b 2b 5d  20 43 6f 72  72 65 63 74  │·[92│m[+]│ Cor│rect│
    00000010  21 0a 0a 1b  5b 39 35 6d                            │!···│[95m│
    00000018
[DEBUG] Received 0x59 bytes:
    00000000  1b 5b 39 35  6d 57 68 61  74 20 69 73  20 74 68 65  │·[95│mWha│t is│ the│
    00000010  20 73 69 7a  65 20 6f 66  20 74 68 65  20 66 69 6c  │ siz│e of│ the│ fil│
    00000020  65 20 6c 6f  63 61 74 65  64 20 61 74  20 72 65 63  │e lo│cate│d at│ rec│
    00000030  6f 72 64 20  6e 75 6d 62  65 72 20 34  30 3f 20 28  │ord │numb│er 4│0? (│
    00000040  66 6f 72 20  65 78 61 6d  70 6c 65 3a  20 31 33 33  │for │exam│ple:│ 133│
    00000050  37 29 0a 1b  5b 30 6d 3e  20                        │7)··│[0m>│ │
    00000059
[DEBUG] Sent 0x6 bytes:
    b'57344\n'
[*] Switching to interactive mode
[DEBUG] Received 0x60 bytes:
    00000000  1b 5b 39 32  6d 5b 2b 5d  20 43 6f 72  72 65 63 74  │·[92│m[+]│ Cor│rect│
    00000010  21 0a 0a 1b  5b 39 35 6d  1b 5b 39 32  6d 5b 2b 5d  │!···│[95m│·[92│m[+]│
    00000020  20 48 65 72  65 20 69 73  20 74 68 65  20 66 6c 61  │ Her│e is│ the│ fla│
    00000030  67 3a 20 48  54 42 7b 70  34 72 73 31  6e 67 5f 6d  │g: H│TB{p│4rs1│ng_m│
    00000040  66 74 5f 31  73 5f 76 33  72 79 5f 31  6d 70 30 72  │ft_1│s_v3│ry_1│mp0r│
    00000050  74 34 6e 74  5f 73 30 6d  33 74 31 6d  33 73 7d 0a  │t4nt│_s0m│3t1m│3s}·│
    00000060
[+] Correct!

[+] Here is the flag: HTB{p4rs1ng_mft_1s_v3ry_1mp0rt4nt_s0m3t1m3s}
[*] Got EOF while reading in interactive
$
[*] Interrupted
[*] Closed connection to 83.136.255.230 port 47156
```

</details>

{::options parse_block_html="false" /}

> Flag: HTB{p4rs1ng_mft_1s_v3ry_1mp0rt4nt_s0m3t1m3s}
{: .prompt-tip }