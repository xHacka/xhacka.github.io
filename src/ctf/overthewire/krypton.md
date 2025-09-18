# Krypton

## PARTIALLY SOLVED

## Level 1

Welcome to Krypton! The first level is easy. The following string encodes the password using Base64:

```
S1JZUFRPTklTR1JFQVQ=
```

Use this password to log in to krypton.labs.overthewire.org with username krypton1 using SSH on port 2231. You can find the files for other levels in /krypton/

```bash
$ echo S1JZUFRPTklTR1JFQVQ= | base64 -d
KRYPTONISGREAT
```

```bash
➜ ssh krypton.labs.overthewire.org -p 2231 -l krypton1
# Password: KRYPTONISGREAT

krypton1@bandit:~$ ls /krypton/krypton1/
krypton2  README
```

```bash
krypton1@bandit:~$ cat /krypton/krypton1/README
...
The first level is easy.  The password for level 2 is in the file
'krypton2'.  It is 'encrypted' using a simple rotation called ROT13.
It is also in non-standard ciphertext format.  When using alpha characters for
cipher text it is normal to group the letters into 5 letter clusters,
regardless of word boundaries.  This helps obfuscate any patterns.

This file has kept the plain text word boundaries and carried them to
the cipher text.
```

ROT13 with bash
```bash
krypton1@bandit:~$ cat /krypton/krypton1/krypton2
YRIRY GJB CNFFJBEQ EBGGRA

krypton1@bandit:~$ cat /krypton/krypton1/krypton2 | tr 'A-Za-z' 'N-ZA-Mn-za-m'
LEVEL TWO PASSWORD ROTTEN
```


> Password: `ROTTEN`

## Level 2

```bash
➜ ssh krypton.labs.overthewire.org -p 2231 -l krypton2
# Password: ROTTEN

krypton2@bandit:~$ cat /krypton/krypton2/README
Krypton 2

ROT13 is a simple substitution cipher.

Substitution ciphers are a simple replacement algorithm.  In this example
of a substitution cipher, we will explore a 'monoalphebetic' cipher.
Monoalphebetic means, literally, "one alphabet" and you will see why.

This level contains an old form of cipher called a 'Caesar Cipher'.
A Caesar cipher shifts the alphabet by a set number.  For example:

plain:  a b c d e f g h i j k ...
cipher: G H I J K L M N O P Q ...

In this example, the letter 'a' in plaintext is replaced by a 'G' in the
ciphertext so, for example, the plaintext 'bad' becomes 'HGJ' in ciphertext.

The password for level 3 is in the file krypton3.  It is in 5 letter
group ciphertext.  It is encrypted with a Caesar Cipher.  Without any
further information, this cipher text may be difficult to break.  You do
not have direct access to the key, however you do have access to a program
that will encrypt anything you wish to give it using the key.
If you think logically, this is completely easy.

One shot can solve it!

Have fun.

Additional Information:

The `encrypt` binary will look for the keyfile in your current working
directory. Therefore, it might be best to create a working direcory in /tmp
and in there a link to the keyfile. As the `encrypt` binary runs setuid
`krypton3`, you also need to give `krypton3` access to your working directory.

Here is an example:

krypton2@melinda:~$ mktemp -d
/tmp/tmp.Wf2OnCpCDQ
krypton2@melinda:~$ cd /tmp/tmp.Wf2OnCpCDQ
krypton2@melinda:/tmp/tmp.Wf2OnCpCDQ$ ln -s /krypton/krypton2/keyfile.dat
krypton2@melinda:/tmp/tmp.Wf2OnCpCDQ$ ls
keyfile.dat
krypton2@melinda:/tmp/tmp.Wf2OnCpCDQ$ chmod 777 .
krypton2@melinda:/tmp/tmp.Wf2OnCpCDQ$ /krypton/krypton2/encrypt /etc/issue
krypton2@melinda:/tmp/tmp.Wf2OnCpCDQ$ ls
ciphertext  keyfile.dat
```

Since we know that cipher used is `Caesar` we can brute all the shifts and not use the given binary.
```python
from argparse import ArgumentParser

OFFSET_UPPERCASE = 65 # ord('A')
OFFSET_LOWERCASE = 97 # ord('a')

def caesar(text, shift):
    shift_letter = lambda offset: chr((ord(c) - offset + shift) % 26 + offset)
    decoded = ''
    for c in text:
        if c.isupper():
            decoded += shift_letter(OFFSET_UPPERCASE)
        elif c.islower():
            decoded += shift_letter(OFFSET_LOWERCASE)
        else:
            decoded += c

    return decoded

parser = ArgumentParser()
parser.add_argument('ciphertext', type=str, help='The ciphertext to decode')
parser.add_argument('-s', '--shift', type=int, default=13, help='The shift value for the Caesar cipher')
parser.add_argument('-b', '--brute', action='store_true', help='Brute force all shifts')

args = parser.parse_args()
if args.brute:
    for shift in range(1, 26):
        decoded = caesar(args.ciphertext, shift)
        print(f"Shift {shift:02}: {decoded}")
else:
    decoded = caesar(args.ciphertext, args.shift)
    print(f"Shift {args.shift:02}: {decoded}")

# ➜ py .\brute.py 'OMQEMDUEQMEK' -b   
# ...
# Shift 14: CAESARISEASY
# ...
```

> Password: `CAESARISEASY`

## Level 3

```bash
➜ ssh krypton.labs.overthewire.org -p 2231 -l krypton3
# Password: CAESARISEASY

krypton3@bandit:/krypton/krypton3$ ls -Alh
total 28K
-rw-r----- 1 krypton3 krypton3 1.6K Apr 10 14:24 found1
-rw-r----- 1 krypton3 krypton3 2.1K Apr 10 14:24 found2
-rw-r----- 1 krypton3 krypton3  560 Apr 10 14:24 found3
-rw-r----- 1 krypton3 krypton3   56 Apr 10 14:24 HINT1
-rw-r----- 1 krypton3 krypton3   37 Apr 10 14:24 HINT2
-rw-r----- 1 krypton3 krypton3   42 Apr 10 14:24 krypton4
-rw-r----- 1 krypton3 krypton3  785 Apr 10 14:24 README
krypton3@bandit:/krypton/krypton3$ cat README
Well done.  Youve moved past an easy substitution cipher.

Hopefully you just encrypted the alphabet a plaintext
to fully expose the key in one swoop.

The main weakness of a simple substitution cipher is
repeated use of a simple key.  In the previous exercise
you were able to introduce arbitrary plaintext to expose
the key.  In this example, the cipher mechanism is not
available to you, the attacker.

However, you have been lucky.  You have intercepted more
than one message.  The password to the next level is found
in the file 'krypton4'.  You have also found 3 other files.
(found1, found2, found3)

You know the following important details:

- The message plaintexts are in English (*** very important)
- They were produced from the same key (*** even better!)


Enjoy.
```

Given messages are big and very repetitive. Because the plaintext is in English we can use **Frequency Analysis** to get the original message. 

The easiest way is to just use [https://quipqiup.com](https://quipqiup.com) tool.

![Krypton.png](/assets/ctf/overthewire/krypton.png)

```python
encoded = 'CGZNLYJBENQYDLQZQSUQNZCYDSNQVUBFGBKGQUQZQSUQNUZCYDSNJDSUDCXJZCYDSNZQSUQNUZBWSBNZQSUQNUDCXJCUBGSBXJDSUCTYVSUJQGWTBUJKCWSVLFGBKGSGZNLYJCBGJSZDGCHMSUCJCUQJLYSBXUMAUJCJMJCBGZCYDSNCGKDCZDSQZDVSJJSNCGJDSYVQCGJSOJCUNSYVQZSWALQVSJJSNUBTSXCOSWGMTASNBXYBUCJCBGUWBKGJDSQVYDQASJXBNSOQTYVSKCJDQUDCXJBXQKBMVWASNSYVQZSWALWAKBMVWASZBTSSQGWUBBGJDSTSJDBWCUGQTSWQXJSNRMVCMUZQSUQNKDBMUSWCJJBZBTTMGCZQJSKCJDDCUESGSNQVUJDSSGZNLYJCBGUJSYYSNXBNTSWALQZQSUQNZCYDSNCUBXJSGCGZBNYBNQJSWQUYQNJBXTBNSZBTYVSOUZDSTSUUMZDQUJDSICESGNSZCYDSNQGWUJCVVDQUTBWSNGQYYVCZQJCBGCGJDSNBJULUJSTQUKCJDQVVUCGEVSQVYDQASJUMAUJCJMJCBGZCYDSNUJDSZQSUQNZCYDSNCUSQUCVLANBFSGQGWCGYNQZJCZSBXXSNUSUUSGJCQVVLGBZBTTMGCZQJCBGUSZMNCJLUDQFSUYSQNSYNBWMZSWTBUJBXDCUFGBKGKBNFASJKSSGQGWDCUSQNVLYVQLUKSNSTQCGVLZBTSWCSUQGWDCUJBNCSUESGNSUDSNQCUSWJBJDSYSQFBXUBYDCUJCZQJCBGQGWQNJCUJNLALJDSSGWBXJDSUCOJSSGJDZSGJMNLGSOJDSKNBJSTQCGVLJNQESWCSUMGJCVQABMJCGZVMWCGEDQTVSJFCGEVSQNQGWTQZASJDZBGUCWSNSWUBTSBXJDSXCGSUJSOQTYVSUCGJDSSGEVCUDVQGEMQESCGDCUVQUJYDQUSDSKNBJSJNQECZBTSWCSUQVUBFGBKGQUNBTQGZSUQGWZBVVQABNQJSWKCJDBJDSNYVQLKNCEDJUTQGLBXDCUYVQLUKSNSYMAVCUDSWCGSWCJCBGUBXIQNLCGEHMQVCJLQGWQZZMNQZLWMNCGEDCUVCXSJCTSQGWCGJKBBXDCUXBNTSNJDSQJNCZQVZBVVSQEMSUYMAVCUDSWJDSXCNUJXBVCBQZBVVSZJSWSWCJCBGBXDCUWNQTQJCZKBNFUJDQJCGZVMWSWQVVAMJJKBBXJDSYVQLUGBKNSZBEGCUSWQUUDQFSUYSQNSU'
decoded = 'INCRYPTOGRAPHYACAESARCIPHERALSOKNOWNASACAESARSCIPHERTHESHIFTCIPHERCAESARSCODEORCAESARSHIFTISONEOFTHESIMPLESTANDMOSTWIDELYKNOWNENCRYPTIONTECHNIQUESITISATYPEOFSUBSTITUTIONCIPHERINWHICHEACHLETTERINTHEPLAINTEJTISREPLACEDBYALETTERSOMEFIJEDNUMBEROFPOSITIONSDOWNTHEALPHABETFOREJAMPLEWITHASHIFTOFAWOULDBEREPLACEDBYDBWOULDBECOMEEANDSOONTHEMETHODISNAMEDAFTERZULIUSCAESARWHOUSEDITTOCOMMUNICATEWITHHISGENERALSTHEENCRYPTIONSTEPPERFORMEDBYACAESARCIPHERISOFTENINCORPORATEDASPARTOFMORECOMPLEJSCHEMESSUCHASTHEVIGENRECIPHERANDSTILLHASMODERNAPPLICATIONINTHEROTSYSTEMASWITHALLSINGLEALPHABETSUBSTITUTIONCIPHERSTHECAESARCIPHERISEASILYBROKENANDINPRACTICEOFFERSESSENTIALLYNOCOMMUNICATIONSECURITYSHAKESPEAREPRODUCEDMOSTOFHISKNOWNWORKBETWEENANDHISEARLYPLAYSWEREMAINLYCOMEDIESANDHISTORIESGENRESHERAISEDTOTHEPEAKOFSOPHISTICATIONANDARTISTRYBYTHEENDOFTHESIJTEENTHCENTURYNEJTHEWROTEMAINLYTRAGEDIESUNTILABOUTINCLUDINGHAMLETKINGLEARANDMACBETHCONSIDEREDSOMEOFTHEFINESTEJAMPLESINTHEENGLISHLANGUAGEINHISLASTPHASEHEWROTETRAGICOMEDIESALSOKNOWNASROMANCESANDCOLLABORATEDWITHOTHERPLAYWRIGHTSMANYOFHISPLAYSWEREPUBLISHEDINEDITIONSOFVARYINGQUALITYANDACCURACYDURINGHISLIFETIMEANDINTWOOFHISFORMERTHEATRICALCOLLEAGUESPUBLISHEDTHEFIRSTFOLIOACOLLECTEDEDITIONOFHISDRAMATICWORKSTHATINCLUDEDALLBUTTWOOFTHEPLAYSNOWRECOGNISEDASSHAKESPEARES'

cipher = []
for e, d in zip(encoded, decoded):
    if (e, d) not in cipher:
        cipher.append((e, d))

x = ''.join([e for e, d in cipher])
y = ''.join([d for e, d in cipher])

print(f'{x}={y}') # CGZNLYJBEQDSUVFKXWTHMAORI=INCRYPTOGAHESLKWFDMQUBJZV
```

![Krypton-1.png](/assets/ctf/overthewire/krypton-1.png)

> Password: `BRUTE`

## Level 4

```bash
➜ ssh krypton.labs.overthewire.org -p 2231 -l krypton4
# Password: BRUTE

krypton4@bandit:/krypton/krypton4$ ls -Alh
total 20K
-rw-r----- 1 krypton4 krypton4 1.7K Apr 10 14:24 found1
-rw-r----- 1 krypton4 krypton4 2.9K Apr 10 14:24 found2
-rw-r----- 1 krypton4 krypton4  287 Apr 10 14:24 HINT
-rw-r----- 1 krypton4 krypton4   10 Apr 10 14:24 krypton5
-rw-r----- 1 krypton4 krypton4 1.4K Apr 10 14:24 README
krypton4@bandit:/krypton/krypton4$ cat README
Good job!

You more than likely used frequency analysis and some common sense
to solve that one.

So far we have worked with simple substitution ciphers.  They have
also been 'monoalphabetic', meaning using a fixed key, and
giving a one to one mapping of plaintext (P) to ciphertext (C).
Another type of substitution cipher is referred to as 'polyalphabetic',
where one character of P may map to many, or all, possible ciphertext
characters.

An example of a polyalphabetic cipher is called a Vigenere Cipher.  It works
like this:

If we use the key(K)  'GOLD', and P = PROCEED MEETING AS AGREED, then "add"
P to K, we get C.  When adding, if we exceed 25, then we roll to 0 (modulo 26).


P     P R O C E   E D M E E   T I N G A   S A G R E   E D
K     G O L D G   O L D G O   L D G O L   D G O L D   G O

becomes:

P     15 17 14 2  4  4  3 12  4 4  19  8 13 6  0  18 0  6 17 4 4   3
K     6  14 11 3  6 14 11  3  6 14 11  3  6 14 11  3 6 14 11 3 6  14
C     21 5  25 5 10 18 14 15 10 18  4 11 19 20 11 21 6 20  2 8 10 17

So, we get a ciphertext of:

VFZFK SOPKS ELTUL VGUCH KR

This level is a Vigenere Cipher.  You have intercepted two longer, english
language messages.  You also have a key piece of information.  You know the
key length!

For this exercise, the key length is 6.  The password to level five is in the usual
place, encrypted with the 6 letter key.

Have fun!
```

Some theory for manual decryption: [Five Ways to Crack a Vigenère Cipher brought to you by The Mad Doctor ("madness")](https://www.cipherchallenge.org/wp-content/uploads/2020/12/Five-ways-to-crack-a-Vigenere-cipher.pdf)

1. Automatic decryption: [https://www.dcode.fr/vigenere-cipher](https://www.dcode.fr/vigenere-cipher)  
2. **found1** or **found2** text
3. Knowing the key-length/size, number of letters: **6** 
4. **FREKEY**
5. Ciphertext: **HCIKV RJOX** 
6. Knowing the Key/Password: **FREKEY**
7. **CLEAR TEXT**

> Password: `CLEARTEXT`

## Level 5

```bash
➜ ssh krypton.labs.overthewire.org -p 2231 -l krypton5
# Password: CLEARTEXT

krypton5@bandit:/krypton/krypton5$ ls -lAh
total 20K
-rw-r----- 1 krypton5 krypton5 1.8K Apr 10 14:24 found1
-rw-r----- 1 krypton5 krypton5 1.9K Apr 10 14:24 found2
-rw-r----- 1 krypton5 krypton5 2.1K Apr 10 14:24 found3
-rw-r----- 1 krypton5 krypton5    7 Apr 10 14:24 krypton6
-rw-r----- 1 krypton5 krypton5  151 Apr 10 14:24 README
krypton5@bandit:/krypton/krypton5$ cat README
Frequency analysis can break a known key length as well.  Lets try one
last polyalphabetic cipher, but this time the key length is unknown.
```

Vigenere cipher, but we don't know the key length. This tool worked better to bruteforce the key: [https://www.guballa.de/vigenere-solver](https://www.guballa.de/vigenere-solver)

![Krypton-2.png](/assets/ctf/overthewire/krypton-2.png)

![Krypton-3.png](/assets/ctf/overthewire/krypton-3.png)

> Password: `RANDOM`

## Level 6

```bash
➜ ssh krypton.labs.overthewire.org -p 2231 -l krypton6
# Password: RANDOM

```

> Password: `xxx`

## Level 7

```bash
➜ ssh krypton.labs.overthewire.org -p 2231 -l krypton1
# Password: xxx

krypton6@bandit:/krypton/krypton6$ ls -lAh
total 48K
-rwsr-x--- 1 krypton7 krypton6  17K Apr 10 14:24 encrypt6
-rw-r----- 1 krypton6 krypton6  164 Apr 10 14:24 HINT1
-rw-r----- 1 krypton6 krypton6   11 Apr 10 14:24 HINT2
-rw-r----- 1 krypton7 krypton7   11 Apr 10 14:24 keyfile.dat
-rw-r----- 1 krypton6 krypton6   15 Apr 10 14:24 krypton7
drwxr-xr-x 2 root     root     4.0K Apr 10 14:24 onetime
-rw-r----- 1 krypton6 krypton6 4.3K Apr 10 14:24 README
krypton6@bandit:/krypton/krypton6$ cat README
Hopefully by now its obvious that encryption using repeating keys
is a bad idea.  Frequency analysis can destroy repeating/fixed key
substitution crypto.

A feature of good crypto is random ciphertext.  A good cipher must
not reveal any clues about the plaintext.  Since natural language
plaintext (in this case, English) contains patterns, it is left up
to the encryption key or the encryption algorithm to add the
'randomness'.

Modern ciphers are similar to older plain substitution
ciphers, but improve the 'random' nature of the key.

An example of an older cipher using a complex, random, large key
is a vigniere using a key of the same size of the plaintext.  For
example, imagine you and your confident have agreed on a key using
the book 'A Tale of Two Cities' as your key, in 256 byte blocks.

The cipher works as such:

Each plaintext message is broken into 256 byte blocks.  For each
block of plaintext, a corresponding 256 byte block from the book
is used as the key, starting from the first chapter, and progressing.
No part of the book is ever re-used as key.  The use of a key of the
same length as the plaintext, and only using it once is called a "One Time Pad".

Look in the krypton6/onetime  directory.  You will find a file called 'plain1', a 256
byte block.  You will also see a file 'key1', the first 256 bytes of
'A Tale of Two Cities'.  The file 'cipher1' is the cipher text of
plain1.  As you can see (and try) it is very difficult to break
the cipher without the key knowledge.

(NOTE - it is possible though.  Using plain language as a one time pad
key has a weakness.  As a secondary challenge, open README in that directory)

If the encryption is truly random letters, and only used once, then it
is impossible to break.  A truly random "One Time Pad" key cannot be
broken.  Consider intercepting a ciphertext message of 1000 bytes.  One
could brute force for the key, but due to the random key nature, you would
produce every single valid 1000 letter plaintext as well.  Who is to know
which is the real plaintext?!?

Choosing keys that are the same size as the plaintext is impractical.
Therefore, other methods must be used to obscure ciphertext against
frequency analysis in a simple substitution cipher.  The
impracticality of an 'infinite' key means that the randomness, or
entropy, of the encryption is introduced via the method.

We have seen the method of 'substitution'.  Even in modern crypto,
substitution is a valid technique.  Another technique is 'transposition',
or swapping of bytes.

Modern ciphers break into two types; symmetric and asymmetric.

Symmetric ciphers come in two flavours: block and stream.

Until now, we have been playing with classical ciphers, approximating
'block' ciphers.  A block cipher is done in fixed size blocks (suprise!).
For example, in the previous paragraphs we discussed breaking text and keys
into 256 byte blocks, and working on those blocks.  Block ciphers use a
fixed key to perform substituion and transposition ciphers on each
block discretely.

Its time to employ a stream cipher.  A stream cipher attempts to create
an on-the-fly 'random' keystream to encrypt the incoming plaintext one
byte at a time.  Typically, the 'random' key byte is xor-d with the
plaintext to produce the ciphertext.  If the random keystream can be
replicated at the recieving end, then a further xor will produce the
plaintext once again.

From this example forward, we will be working with bytes, not ASCII
text, so a hex editor/dumper like hexdump is a necessity.  Now is the
right time to start to learn to use tools like cryptool.

In this example, the keyfile is in your directory, however it is
not readable by you.  The binary 'encrypt6' is also available.
It will read the keyfile and encrypt any message you desire, using
the key AND a 'random' number.  You get to perform a 'known ciphertext'
attack by introducing plaintext of your choice.  The challenge here is
not simple, but the 'random' number generator is weak.

As stated, it is now that we suggest you begin to use public tools, like cryptool,
to help in your analysis.  You will most likely need a hint to get going.
See 'HINT1' if you need a kicktstart.

If you have further difficulty, there is a hint in 'HINT2'.

The password for level 7 (krypton7) is encrypted with 'encrypt6'.

Good Luck!
```

> Password: `xxx`




