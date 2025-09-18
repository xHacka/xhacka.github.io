# I Have Written Down My Secrets

## Description

Summer breaks are great, but I can't stand the downtime. I need to keep my mind occupied. I need a project, a puzzle, a challenge. It's not about staying productive, per se. I just need to keep this mind moving or I'll get bored. I've found the hobby that is presently perfect without being too invested: Learning languages. Simple, no-pressure, infinitely valuable, and a great intellectual challenge. This summer I went a little overboard and overindulged in Duo's offerings. I spent at least a few hours every day learning Spanish, French, German, Italian, Russian, Mandarin, Arabic, Finnish, Hindi and Swedish. I know, that's obviously way too many languages to attempt at once, but it's easy to over-commit and spread myself thin when there are so many wonderful options available. French was actually my focus this summer. I had so much fun learning that I would over-zealously do extra lessons. Is Duo the best way to learn? Non! Am I really learning all that much in the end? Occupez-vous de vos oignons! After a summer of learning am I able to even communicate at all in French? Absolument pas! Je te dis, c'était mieux que de mater les JO à Paris cet été.  
  
Clic Droit, Enregistrer Sous... [Crack100-2.pdf](https://pointeroverflowctf.com/static/Crack100-2.pdf)  
MD5 checksum: 978A017C772FAA17A0DBFC25561A499D

## Solution

```bash
└─$ pdf2john Crack100-2.pdf
Crack100-2.pdf:$pdf$4*4*128*-3392*1*16*24b80f855bbab2110a0067458b6bc623*32*0dbacd4861c337a7c7f05e607f998e2f00000000000000000000000000000000*32*d7ab363be9a422b7d644a8503c76d25b4124a60d9090cddcc5a9562087844101
```

Rockyou was unsuccessful at cracking this password.
```bash
➜ .\john-1.9.0-jumbo-1-win64\run\john.exe --wordlist=.\rockyou.txt .\hashes
Using default input encoding: UTF-8
Loaded 1 password hash (PDF [MD5 SHA2 RC4/AES 32/64])
Cost 1 (revision) is 4 for all loaded hashes
Will run 8 OpenMP threads
Press 'q' or Ctrl-C to abort, almost any other key for status
0g 0:00:01:14 DONE (2024-10-24 13:20) 0g/s 191500p/s 191500c/s 191500C/s  0 0 0..♦*♥7¡Vamos!♥
Session completed
```