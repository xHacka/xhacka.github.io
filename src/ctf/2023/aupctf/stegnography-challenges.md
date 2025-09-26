# Stegnography Challenges

## Syrio Forel

Challenge: [dump](https://aupctf.s3.eu-north-1.amazonaws.com/dump.txt)

Flag format: aupCTF{\*\*\*\_\*\*\*\*\*}

### Analysis

When we try to read the file we get a huge output (the file is one line), it seems giberish but looks to be Base64 encoding. To check that its Base64 let's try decoding.

::: raw
```bash
└─$ cat dump.txt | base64 -d > unknown

└─$ file unknown
unknown: JPEG image data, JFIF standard 1.01, aspect ratio, density 1x1, segment length 16, Exif Standard: [TIFF image data, little-endian, direntries=6, orientation=upper-left, xresolution=176, yresolution=184, resolutionunit=2], baseline, precision 8, 500x500, components 3

└─$ mv unknown unknown.jpeg

└─$ display unknown.jpeg
```
:::

![syrio-forel-1](/assets/ctf/aupctf/syrio-forel-1.jpeg)

### Solution

I was fiddling around a lot trying to find flag in picture (with strings and etc) with no luck, turns out the flag was right in front of me.

_Before Arya runs off to take her place in the Godswood, the Red Woman says some familiar words to spur Arya into action: "[What do we say to the God of Death?](https://www.popsugar.com/entertainment/what-do-we-say-god-death-quote-game-thrones-46090483)" The answer, as Arya knows all too well, is, "Not today." But she wouldn't know these words if not for her water dancing instructor, Syrio Forel._
::: tip Flag
`aupCTF{not_today}`
:::

## Masterpeice

chahat has something for you listen carefully till the end.

[masterpiece.wav](https://aupctf.s3.eu-north-1.amazonaws.com/masterpiece.wav)

Flag format: aupCTF{...}

### Solution

First thing I do with mp3 steganography is to look for [Spectrogram](https://www.wikiwand.com/en/Spectrogram). I used [sonic-visualiser](https://www.sonicvisualiser.org) to do this.

`sonic-visualiser masterpiece.wav` -> Layer -> Add Spectrogram -> All Channels Mixed -> Scroll To The End (-> Adjust Horizontal Wheel A Bit)

![masterpiece-1](/assets/ctf/aupctf/masterpiece-1.png)
::: tip Flag
`aupCTF{Sp3ct0gr4m_ri4ght}`
:::

## LSB

you got this...[file](https://aupctf.s3.eu-north-1.amazonaws.com/naruto.png)

### Solution

From the title we can probably guess that we are dealing with hidden data within LSB.

```bash
└─$ zsteg naruto.png
imagedata           .. text: "$:;`VV(-1"
b1,b,lsb,xy         .. file: OpenPGP Secret Key
b1,rgb,lsb,xy       .. text: "aupCTF{zst1g-1s-c00l_rig3ht}"
b2,rgb,lsb,xy       .. file: big endian ispell 3.0 hash file, and 13698 string characters
```
::: tip Flag
`aupCTF{zst1g-1s-c00l_rig3ht}`
:::

## Deep

Challenge: [truefan.wav](https://aupctf.s3.eu-north-1.amazonaws.com/truefan.wav)

Flag format: aupCTF{\*\*\*\*\_\*\*\*\*}

Hint: looking for password ? well thats the iconic dialogue of iron man

### Solution

The audio file starts by saying [a quote from Iron Man 2](https://quotecatalog.com/quote/justin-theroux-my-bond-is-with-R1k29ea) and then [quote from Iron Man 3](https://www.reddit.com/r/marvelstudios/comments/3ra89l/little_joke_i_just_noticed_in_iron_man_3/), but it's unclear what it has to do with the puzzle. 

Hint mentions password, but there's nothing that requires password unless `steghide` or alternative. I tried searching around Audio Steganography combined with Deep and found [Deep Sound](https://wiki.bi0s.in/steganography/deep-sound/). Luckily John has a tool _*deepsound2john*_.

```bash
└─$ deepsound2john truefan.wav > truefan.hash

└─$ john --wordlist=$rockyou truefan.hash
Using default input encoding: UTF-8
Loaded 1 password hash (dynamic_1529 [sha1($p null_padded_to_len_32) (DeepSound) 256/256 AVX2 8x1])
Warning: no OpenMP support for this hash type, consider --fork=4
Press 'q' or Ctrl-C to abort, almost any other key for status
iamironman       (truefan.wav)
1g 0:00:00:00 DONE (2023-06-29 18:50) 1.562g/s 551250p/s 551250c/s 551250C/s julian24..hotchick13
Use the "--show --format=dynamic_1529" options to display all of the cracked passwords reliably
Session completed.
```

Deep Sound only works on windows, so I jumped in and extracted the hidden data using password from file.

![truefan-1](/assets/ctf/aupctf/truefan-1.png)

![truefan-2](/assets/ctf/aupctf/truefan-2.png)

Windows was kind enough to identify that executable is a python executable file. Using [PyInstaller Extractor](https://github.com/extremecoders-re/pyinstxtractor) we can get the source code.

```bash
└─$ python3 pyinstxtractor.py ../marvel.exe
[+] Processing ../marvel.exe
[+] Pyinstaller version: 2.1+
[+] Python version: 3.10
[+] Length of package: 6342224 bytes
[+] Found 61 files in CArchive
[+] Beginning extraction...please standby
[+] Possible entry point: pyiboot01_bootstrap.pyc
[+] Possible entry point: pyi_rth_inspect.pyc
[+] Possible entry point: marvel.pyc
[!] Warning: This script is running in a different Python version than the one used to build the executable.
[!] Please run this script in Python 3.10 to prevent extraction errors during unmarshalling
[!] Skipping pyz extraction
[+] Successfully extracted pyinstaller archive: ../marvel.exe

You can now use a python decompiler on the pyc files within the extracted directory

└─$ strings marvel.exe_extracted/marvel.pyc
Nz2How much does Morgan Starks love her dad? [number]
3000)
question
answerz&What is the full form of J.A.R.V.I.S.?z%Just A Rather Very Intelligent Systemz7What is the full form of AI that replaced J.A.R.V.I.S.?z6Female Replacement Intelligent Digital Assistant Youthc
input
lower)
user_answer
        marvel.py
ask_question
Incorrect answer!r
Congratulations! You are a true Marvel Nerd like Me ;/zUFlag format: iron man first appearance year underscore last appearance year in moviesz
Press any key to exit...)
        questionsr
print
exitr
main
__main__)
__name__r
<module>
```

_Flag format: iron man first appearance year underscore last appearance year in movies_

First appearance: Iron Man, 2008
Last appearance: Avengers: Endgame, 2019
::: tip Flag
`aupCTF{2008_2019}`
:::

## Obfuscated

Challenge: [download file](https://aupctf.s3.eu-north-1.amazonaws.com/flag.jpg)

### Analysis

We have a broken JPG image so let's try to fix it!

First lets find [magic bytes](https://www.wikiwand.com/en/List_of_file_signatures)

![obfuscated-1](/assets/ctf/aupctf/obfuscated-1.png)

Im going to cut to the chase and directly approach the problem.
Flag Header: `FF 8D FF 0E 00 01 A4 64 94 64 00 10`
JFIF Header: `FF D8 FF E0 00 10 4A 46 49 46 00 01`

Do you see what's wrong? Because it's actually f\*ing cool D: The hex values are reversed! And the thing is that it's not limited to the header, it's whole file!

### Solution

```py
# Open flag to read and new file to write
with open("./flag.jpg", "rb") as f, open("flag_new.jpg", "wb") as new:
    # Read each byte from flag till EOF
    for byte in iter(lambda: f.read(1), b''):
        byte = ord(byte) # byte -> int

        # This is where the *magic* happens, it's shifting the values and doing a swap
        byte_swap = ((byte & 0xF0) >> 4) | ((byte & 0x0F) << 4)

        # Finally write swapped byte (int needs to be converted to byte)
        new.write(byte_swap.to_bytes(1, 'little'))
```

![obfuscated-2](/assets/ctf/aupctf/obfuscated-2.png)
::: tip Flag
`aupCTF{sw4p3d_w0w453?5422asd!1}`
:::
::: info :information_source:
Ifyou're tired of writing flags from images (or finding good online OCR-s) you could use [tesseract](https://github.com/tesseract-ocr/tesseract)
:::

## XOR

Challenge: [img1](https://aupctf.s3.eu-north-1.amazonaws.com/img1.png) [img2](https://aupctf.s3.eu-north-1.amazonaws.com/img2.png)

### Solution

We are given two images and title says XOR and solution is pretty straightforward, xor images and get the flag.

```py
import numpy as np
from PIL import Image

# Load the images
image1 = Image.open("img1.png")
image2 = Image.open("img2.png")

# Convert images to NumPy arrays
array1 = np.array(image1)
array2 = np.array(image2)

# Perform XOR operation
xor_result = np.bitwise_xor(array1, array2)

# Create a new Image object from the XOR result array
xor_image = Image.fromarray(xor_result)

# Save the XOR image
xor_image.save("xor_image.png")
```
::: info :information_source:
Alternativelyyou could use [stegsolve](https://github.com/Giotino/stegsolve/releases/) to solve the challenge, if you prefer GUI tool.
:::

![xor-1](/assets/ctf/aupctf/xor-1.png)
::: tip
ShortsID: LYkCU8Kn3a8
:::

As someone who (sadly) watches ton of youtube shorts... it was obvious where to look. [almost there](https://www.youtube.com/shorts/LYkCU8Kn3a8)

Description: some kind of cipher i guess
I found [hexahue](https://www.dcode.fr/hexahue-cipher) cipher and tried decoding.
First we need to split video into images

```bash
└─$ mkdir output && ffmpeg -i "almost there.mp4" -vf fps=1 output/frame%d.png
```

Using the tool above I entered images by frames to get the message > `WW00WGGRAARAAPSS`

If you notice output has duplicates and that's due not perfect split using [ffmpeg](https://ffmpeg.org)
::: tip Flag
`aupCTF{W0WGRARAPS}`
:::

## Arcane

In the city of Piltover, chaos reigns supreme as Jinx, the mischievous troublemaker, roams the streets. Armed with her deadly arsenal and a wicked grin, she sets the city ablaze with her explosive antics. navigate Jinx's twisted mind, decipher her puzzles, and outsmart her at every turn to uncover the hidden flag. Will you be able to tame the chaos and triumph over Jinx's mischief?

[arcane.exe](https://aupctf.s3.eu-north-1.amazonaws.com/arcane.exe)

### Analysis

First let's take a look at file.

```bash
└─$ file arcane.exe
arcane.exe: ELF 64-bit LSB pie executable, x86-64, version 1 (SYSV), dynamically linked, interpreter /lib64/ld-linux-x86-64.so.2, BuildID[sha1]=8e560e56d7a2f51f749b1eae13f127bb5805cfc2, for GNU/Linux 3.2.0, stripped
```

So `exe` is just a deception... let's trying running the file. When ran the program generates directory called `arcane` with 1000 `jpg` images, `img` png (broken) and `786_dba.jpg`.

```bash
└─$ exiftool arcane/786_dba.jpg
...
File Name                       : 786_dba.jpg
Directory                       : arcane
File Size                       : 78 kB
Comment                         : don't be the database enginner that enter data manually
...
```

_don't be the database enginner that enter data manually_ ? What does it mean...?

Let's try to fix `img` which is PNG, and the best way to fix PNG is to compare it to another valid PNG. (I used random png -> [dice](https://en.wikipedia.org/wiki/PNG#/media/File:PNG_transparency_demonstration_1.png)).

After changing only PNG chunk image didnt open, so I tried copying first line from `dice.png` to `img` and it worked! _Dont forget to change extension to png!_

![arcane-1](/assets/ctf/aupctf/arcane-1.png)

The image is white? Let's open it in [stegsolve](https://github.com/Giotino/stegsolve/releases/)

![arcane-2](/assets/ctf/aupctf/arcane-2.png)
::: info :information_source:
Funtrick: you can use MSPaint bucket tool to reveal same data.
:::

Hmmm... I wasn't looking for password, but now I am. Is there <strong>[steghide](https://www.kali.org/tools/steghide/)</strong> tool involved?

We have too many similar images, what if they are just duplicates? I decided to filter out files by hash.

```py
import os
from hashlib import md5

arcane_dir = "arcane"
known_hashes = {}
files = sorted(
    os.listdir(arcane_dir), # Get all the files from arcane and sort them by numerical order
    key=lambda f: int(f.split('.')[0]) if f.split('.')[0].isnumeric() else -1
)

for file in files:
    with open(f"{arcane_dir}/{file}", "rb") as f:
        # Compute hashes
        hash_ = md5(f.read()).hexdigest()

    # Record unknown hashes (eliminate duplicates)
    if hash_ not in known_hashes:
        known_hashes[hash_] = file

for k,v in known_hashes.items():
    print(k, v) # Print hash:file
```

| MD5Sum                           | File        | Status     |
| -------------------------------- | ----------- | ---------- |
| 897782c73bdc5a7c7a2e78641a4097eb | img         | Expected   |
| d2c255e28d329713ca8eba5679e71921 | 786_dba.jpg | Expected   |
| 375fa576de8f9cafa59baba700a4e722 | 1.jpg       | Expected   |
| 2a43c34ddf5dc950792b94d282083815 | 2.jpg       | Expected   |
| 90477a828f52384b3b69b80417ac8f33 | 869.jpg     | Unexpected |

- [ ] Hints
    + [ ] 786_dba.jpg: don't be the database enginner that enter data manually.
    + [ ] img: Looking for password? Look no further than the name of the character - it holds the key you seek.
    + [ ] Possibly one of the images has data hidden inside using `steghide` which needs password.
    + [ ] 869.jpg: same image as 1.jpg, different hash, different modification time.

### Solution

```
└─$ steghide extract -sf arcane/869.jpg -p jinx
wrote extracted data to "flag.txt".

└─$ cat flag.txt
aupCTF{JinxTheArcaneTrickster}
```
::: tip Flag
`aupCTF{JinxTheArcaneTrickster}`
:::