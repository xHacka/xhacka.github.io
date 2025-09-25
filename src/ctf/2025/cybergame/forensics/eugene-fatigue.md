# Eugene Fatigue

## \[★★☆\] FATigue

### Description

National hero and local legend, Eugene "Gene" Securewitz, famous for single-handedly preventing the Great Cyber Catastrophe by unplugging the internet router at City Hall, has suddenly vanished. Rumor has it he's fled his apartment to escape fans, bill collectors, and overly enthusiastic historians.

The "Committee for the Preservation of Gene's Greatness" (CPGG) desperately wants to immortalize Gene's groundbreaking research. It's up to you, the city's most underpaid forensic expert, to unravel the mysteries hidden on Gene’s USB stick - which reportedly includes profound insights about the universe, meticulously detailed recipes, and an eclectic collection of heartfelt poems.

Just remember: the fate of national pride - and perhaps the location of Gene’s secret cookie stash - is in your hands. 
- Download and unzip the [diskimage.bin](https://files.cybergame.sk/fatigue-eaaf2057-1b0d-4cc4-be2a-5d231b5fc4d4/diskimage.bin.gz)
- SHA256 after uncompression: **720d7a3167fd3de3d96b4180cc3d30c5efa005dd572fa9642c5063565b085c9a**

### Solution

Unzip and check integrity
```bash
└─$ gzip -d diskimage.bin.gz
└─$ sha256sum diskimage.bin
720d7a3167fd3de3d96b4180cc3d30c5efa005dd572fa9642c5063565b085c9a  diskimage.bin
```

We are given a USB stick
```bash
└─$ file diskimage.bin
diskimage.bin: DOS/MBR boot sector, code offset 0x58+2, OEM-ID "mkfs.fat", Media descriptor 0xf8, sectors/track 32, heads 8, sectors 204800 (volumes > 32 MB), FAT (32 bit), sectors/FAT 1576, serial number 0x23c18835, unlabeled

└─$ fdisk -l diskimage.bin
Disk diskimage.bin: 100 MiB, 104857600 bytes, 204800 sectors
Units: sectors of 1 * 512 = 512 bytes
Sector size (logical/physical): 512 bytes / 512 bytes
I/O size (minimum/optimal): 512 bytes / 512 bytes
Disklabel type: dos
Disk identifier: 0x00000000
```

Mount the device and check files
```bash
└─$ sudo mount -o loop,umask=000 diskimage.bin /mnt
└─$ cd /mnt
└─$ ls -alh
Permissions Size User Date Modified Name
.rwxrwxrwx    75 root 31 Mar 11:18   recipe.txt
└─$ cat recipe.txt
This feels like FX-PREG{cy41a_5vTu7} to me. Cannot hide my best work here.
```

Looks like ROT13 again
```bash
└─$ cat recipe.txt | tr 'A-Za-z' 'N-ZA-Mn-za-m'
Guvf srryf yvxr SK-CERT{pl41n_5iGh7} gb zr. Pnaabg uvqr zl orfg jbex urer.

└─$ sudo umount /mnt # Dont forget to umount
```

::: tip Flag
`SK-CERT{pl41n_5iGh7}`
:::

## \[★★☆\] Is that it?

### Description

You can’t believe your eyes. Gene was more secretive than you can imagine. Can you recover the hidden stash of wisdom?

### Solution

The file is very big to be holding simple TXT file
```bash
└─$ ls -hl diskimage.bin
-rwxrwx--- 1 root vboxsf 100M May  3 13:16 diskimage.bin
```

If you run `strings` you'll find bits of information about embedded PDF header and stuff about more flags.

Check for hidden files with `binwalk`
```bash
└─$ binwalk --dd=".*" diskimage.bin

DECIMAL       HEXADECIMAL     DESCRIPTION
--------------------------------------------------------------------------------
1630720       0x18E200        Zip archive data, at least v2.0 to extract, compressed size: 130929, uncompressed size: 130936, name: file
1761711       0x1AE1AF        Zip archive data, at least v2.0 to extract, compressed size: 776, uncompressed size: 1262, name: fifth.txt
1766068       0x1AF2B4        JPEG image data, EXIF standard
1766080       0x1AF2C0        TIFF image data, big-endian, offset of first image directory: 8
1879290       0x1CACFA        Zip archive data, at least v2.0 to extract, compressed size: 653, uncompressed size: 825, name: fourth-flag.aes.b64.txt
1880270       0x1CB0CE        End of Zip archive, footer length: 22
└─$ file _diskimage.bin.extracted/*
_diskimage.bin.extracted/1AF2B4: JPEG image data, Exif standard: [TIFF image data, big-endian, direntries=9, description=This REALLY is not it, orientation=upper-left, xresolution=144, yresolution=152, resolutionunit=2, datetime=1942:01:08 09:14:44, GPS-Data], baseline, precision 8, 800x248, components 3
_diskimage.bin.extracted/1AF2C0: TIFF image data, big-endian, direntries=9, description=This REALLY is not it, orientation=upper-left, xresolution=144, yresolution=152, resolutionunit=2, datetime=1942:01:08 09:14:44, GPS-Data
_diskimage.bin.extracted/1CB0CE: Zip archive data (empty)
_diskimage.bin.extracted/18E200: Zip archive data, at least v2.0 to extract, compression method=deflate
```

![Eugene’s FATigue.png](/assets/ctf/cybergame/eugene-fatigue.png)

Something went wrong with extracting the files. You can open JPEG, but it still has excess data from diskimage
```bash
└─$ /bin/ls -Alh _diskimage.bin.extracted
total 394M
-rwxrwx--- 1 root vboxsf 99M May  3 13:27 18E200
-rwxrwx--- 1 root vboxsf 99M May  3 13:27 1AF2B4
-rwxrwx--- 1 root vboxsf 99M May  3 13:27 1AF2C0
-rwxrwx--- 1 root vboxsf 99M May  3 13:27 1CB0CE
```

`-e` did somewhat better job
```bash
└─$ binwalk -e diskimage.bin 
└─$ ls -alh _diskimage.bin.extracted
Permissions Size User Date Modified Name
.rwxrwx---  103M root  3 May 13:43   18E200.zip
.rwxrwx---     0 root  3 May 13:43   fifth.txt
.rwxrwx---  131k root 31 Mar 11:18   file
```

> `file` is for third flag.

`foremost` did kinda better job at extracting the files.
```bash
└─$ foremost -i diskimage.bin
└─$ cd output; tree
.
├── audit.txt
├── jpg
│   └── 00003449.jpg
├── pdf
│   └── 00003441.pdf
└── zip
    ├── 00003185.zip
    ├── fifth.txt # Unziped
    ├── file # Unziped
    └── fourth-flag.aes.b64.txt # Unziped

6 directories, 7 files
```

`Zip` file contains 4th and 5th flag, so for second challenge we will ignore it.

PDF is just decoy?

![Eugene’s FATigue-1.png](/assets/ctf/cybergame/eugene-fatigue-1.png)

The image extracted by `foremost` is very insistent upon that this is not it
```bash
└─$ exiftool 00003449.jpg | grep -E 'Description|Caption'
Image Description               : This REALLY is not it
Rdf Description Description Alt Li: This TRULY isn't it..
Rdf Description Title Alt Li    : CG25
Rdf Description Create Date     : 1856:06:10 00:00:15
Rdf Description Modify Date     : 1943:01:07 09:02:22
Rdf Description Date Created    : 1856:06:10 00:00:44+02:00
Profile Description             : Apple Wide Color Sharing Profile
Caption-Abstract                : This ALSO is not it..
```

No more hidden files
```bash
└─$ binwalk --dd=.* 00003449.jpg

DECIMAL       HEXADECIMAL     DESCRIPTION
--------------------------------------------------------------------------------
0             0x0             JPEG image data, EXIF standard
12            0xC             TIFF image data, big-endian, offset of first image directory: 8
```

The image does contain weird string which is usually not seen:
```bash
└─$ strings 00003449.jpg -n 48
<x:xmpmeta xmlns:x="adobe:ns:meta/" x:xmptk="XMP Core 6.0.0">
   <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns">
      <rdf:Description xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:xmp="http://ns.adobe.com/xap/1.0/"><dc:description><rdf:Alt><rdf:li>This TRULY isnt it..</rdf:li></rdf:Alt></dc:description><dc:title><rdf:Alt><rdf:li>CG25</rdf:li></rdf:Alt></dc:title><xmp:CreateDate>1856-06-10T00:00:15</xmp:CreateDate><xmp:ModifyDate>1943-01-07T09:02:22</xmp:ModifyDate><photoshop:DateCreated>1856-06-10T00:00:44+02:00</photoshop:DateCreated></rdf:Description></rdf:RDF></x:xmpmeta><!--
_^@VuwtuTeEEf9uthkAwc1_zzpRq9x4c/LV0TOw5x6a_U0stQ0VSVHs3aDFzX1dBU18xN19hZnRlcl9hbGx9$EucR/FqMoVaZvjx3OvGT_EV4u/Y7EDwDeA/w9QO3+^ALYXhvTD3R1JcGJUgKFi_mhzkezdqaIHzm261y9IQ_EV4u/Y7EDwDeA/w9QO3+
```

The string was very very out of place, so after playing around we get following outputs:
```python
import re
import base64

wierd_string = """_^@VuwtuTeEEf9uthkAwc1_zzpRq9x4c/LV0TOw5x6a_U0stQ0VSVHs3aDFzX1dBU18xN19hZnRlcl9hbGx9$EucR/FqMoVaZvjx3OvGT_EV4u/Y7EDwDeA/w9QO3+"""

# Step 1: Extract potential base64-like substrings
b64_candidates = re.findall(r"[A-Za-z0-9+/=]{16,}", wierd_string)

# Step 2: Decode chunks
for i, chunk in enumerate(b64_candidates):
    try:
        decoded = base64.b64decode(chunk).decode(errors='ignore')
        print(f"\n[{i}] Base64: {chunk}\nDecoded: {decoded}")
    except Exception as e:
        print(f"\n[{i}] Invalid base64: {chunk} ({e})")

# [0] Invalid base64: VuwtuTeEEf9uthkAwc1 (Incorrect padding)

# [1] Base64: zzpRq9x4c/LV0TOw5x6a
# Decoded: :Qxs3▲

# [2] Base64: U0stQ0VSVHs3aDFzX1dBU18xN19hZnRlcl9hbGx9
# Decoded: SK-CERT{7h1s_WAS_17_after_all}

# [3] Base64: EucR/FqMoVaZvjx3OvGT
# Decoded: ↕◄ZV<w:

# [4] Base64: EV4u/Y7EDwDeA/w9QO3+
# Decoded: ◄^.☼♥=@
```

**Quick note**: `fatcat` or `fls` can be used to list the files with deleted ones too. PDF above is called `AUCE.PDF`
```bash
└─$ fatcat diskimage.bin -l / -d
Listing path /
Directory cluster: 2
f 31/3/2025 15:18:20  AUCE.PDF                                           c=259 s=116450 (113.721K) d
f 31/3/2025 15:18:20  recipe.txt (RECIPE.TXT)                            c=491 s=75 (75B)
└─$ fls diskimage.bin -a
r/r * 6:	_AUCE.PDF
r/r 8:	recipe.txt
v/v 3225859:	$MBR
v/v 3225860:	$FAT1
v/v 3225861:	$FAT2
V/V 3225862:	$OrphanFiles
└─$ tsk_recover -e diskimage.bin tsk && ls -alh ./tsk
Files Recovered: 2
Permissions Size User Date Modified Name
.rwxrwx---  116k root 30 May 13:38   _AUCE.PDF
.rwxrwx---    75 root 30 May 13:38   recipe.txt
# or 
└─$ icat diskimage.bin 6 > _AUCE.PDF
```

 > Flag: `SK-CERT{7h1s_WAS_17_after_all}`

## \[★★☆\] Was that the only file?

### Description

You have a persistent feeling there must be more to it. We are still searching for Gene’s recipe. Keep recovering.

### Solution

From `Is that it?` we found file called `file`, use strings to read ASCII values:
```bash
└─$ strings file | head
Begin by gently whispering to a fresh beetroot, ensuring it's thoroughly startled before peeling. Simmer beef slices under moonlight until they hum softly, indicating readiness. Combine with precisely three beetroot dreams, diced finely, and a pinch of yesterday
s laughter. Allow the mixture to philosophize in an oven preheated to curiosity. Occasionally stir with a skeptical spoon, preferably wooden, until the aroma resembles purple jazz. Serve only after garnishing with a sprinkle of questions unanswered, paired with a side dish of a saut
ed third flag SK-CERT{R3c0V3r3D_R3cip3}.
-E'L
xU#!
BGif
`F6L
}*aN
zeLm
>A_#
```

::: tip Flag
`SK-CERT{R3c0V3r3D_R3cip3}`
:::

## \[★★☆\] It tastes like a poem

### Description

So, turns out, Gene is also a skilled CyberChef! Some of his best inventions were so sensitive he has hidden them under layers of military grade encryption.

### Solution

Onto the 4th flag...

From `Is that it?` part again using `foremost` we got a zip file, which contained `fourth-flag.aes.b64.txt`

```bash
└─$ cat fourth-flag.aes.b64.txt
fXBsoOOs2NIxDOeDo1b4yzmiPEFINDfo6SyNCUF0hCWM7SpolOR2Q8UMKJI0/QEH
C9pWgCv3mNhL7lLKRm88Iz5hK//9Q77bx9Bkdmi1XbPUTdtyb8fJLB9gmHoO5Azy
xP6zlaMPNo/vTzTi/Pb2SDt9gFNLGHrxOudv5ReAuJQtI/qXfLGQrJDuuaIc6XtB
ZWlisB28fKeyH17LZy1A+X3jedCrBT3cbHNNZZybFcg8neCVtQKwo0C0nppI96+N
U9iMB1TfSNg0w2mf0ldhmSyxjWXdIZLOUAIJyPXK6i3F4At7kYIP8ddxJjC3NbTD
Iy+xS5DPK2GW6iHJW4gKcaUBixK8f9H1CYb8G3RsnhuXLlCPTa61oAQNOPjiwNj4
h4HSu/T4sMpUiqt+42a3JfHhVmIrfX5XVnwx4LtSGLX+E1FS56l77vOWTSXtOkCL
XXyYgWusTYW3vX4+diCsaLcNGYVxojVsrG9d+1PWXLjuwB7e8rBk4xwDEsh+RRzF
f6gzGCR55FGLckKQMt8MTcKALSF6Qm8lu7A5QGq26GBBq6NJnDFcLgVYTOE62Mng
LlaRA8k3MS9MyJWapnQ9n3HAebTLeMhZOktHPgNdDYhkr/w6sr7tOg5GQYoH82dl
JACwIN3WNo0TnfxWuK2wsT3tyZ7vppjValXT5ckcxIoD4zsZTj4McoazkVq83Y+n
aRya8eSmy5FSLqrj99G+DDr2BAxBYseEG6DnTQf6nvyvkeRwf0gzeCBYiBZKis6v
8ilN6XIP5/QlmNlpga8nSgRSVU6Dk0fNm/+Uf8yFW2E=
└─$ cat fourth-flag.aes.b64.txt | base64 -d > fourth-flag.aes.txt
└─$ file fourth-flag.aes.txt
fourth-flag.aes.txt: data
```

My first idea was to use AES-256, but in ECB mode meaning no IV; but after like 10minutes I called quits.
```python
from Crypto.Cipher import AES
from Crypto.Util.Padding import unpad
import sys

ciphertext_path, dictionary_path = sys.argv[1], sys.argv[2]

with open(ciphertext_path, "rb") as f:
    ciphertext = f.read()

with open(dictionary_path, "r", encoding="latin-1") as f:
    for password in f:
        try:
            # Pad or hash password to 32 bytes (for AES-256)
            key = password.strip().encode().ljust(32, b'\0')[:32]

            cipher = AES.new(key, AES.MODE_ECB)
            decrypted = cipher.decrypt(ciphertext)
            plaintext = unpad(decrypted, AES.block_size)
            
            if b'SK-CERT' in plaintext:
                print(f"[+] Password found: {password}")
                print("Decrypted message:", plaintext)
                break
        except Exception:
            print(f"[-] Password not found: {password}")
            continue
```

But with CBC mode, so with IV it was successful!
```python
from Crypto.Cipher import AES
from Crypto.Util.Padding import unpad
import sys

ciphertext_path, dictionary_path = sys.argv[1], sys.argv[2]

with open(ciphertext_path, "rb") as f:
    full_data = f.read()

iv = full_data[:16]
ciphertext = full_data[16:]

with open(dictionary_path, "r", encoding="latin-1") as f:
    for password in f:
        try:
            # Pad or truncate password to 32 bytes for AES-256
            key = password.strip().encode().ljust(32, b'\0')[:32]

            cipher = AES.new(key, AES.MODE_CBC, iv)
            decrypted = cipher.decrypt(ciphertext)
            plaintext = unpad(decrypted, AES.block_size)

            if b'SK-CERT' in plaintext:
                print(f"[+] Password found: {password.strip()}")
                print("Decrypted message:", plaintext.decode(errors="replace"))
                break
        except Exception:
            continue
```

```bash
└─$ python ../../../../t.py ./fourth-flag.aes.txt $rockyou
[+] Password found:
Decrypted message:  of knitted cheese,
the spoons recite old Greek decrees.
A purple horse with wings of bread,
plays chess against a talking shed.

Gravity sneezes, stars run late,
the soup complains about its fate.
On Tuesdays clocks wear hats and sigh,
bananas teaching clouds to fly.

My socks debate philosophy,
while hummingbirds drink cups of tea.
A mailbox dreams of being king,
whenever cabbages loudly sing.

So here we float in jelly seas,
a pickle reading prophecies.
Reality slipped on buttered floor—
just nonsense knocking at the door.

SK-CERT{d0esnt_m4ke_s3nse_7o_d0_f0rensics_anym0r3}
```

::: tip Flag
`SK-CERT{d0esnt_m4ke_s3nse_7o_d0_f0rensics_anym0r3}`
:::

From discord: `key='0'*63, iv='0'*31`

![Eugene’s FATigue-2.png](/assets/ctf/cybergame/eugene-fatigue-2.png)

## \[★★☆\] Wrapping it up

### Description

We have recovered it all; all the Gene’s knowledge. That is - with the exception of the most precious study on time travel, hidden in the secret file “fifth.txt”. You have a strong feeling you’re on the edge of groundbreaking discovery.

### Solution

Last flag, so the fifth flag. 

From `Is that it?` part again using `foremost` we got a zip file, which contained `fifth.txt`, but when we try to extract the file it's corrupted and we can't read it properly.

```bash
└─$ sha256sum 00003185.zip
82816e2b2f83f35b63e4739ccab5349c5838738d5d1e00a39d62fbcf25376d5e  00003185.zip
└─$ 7z l 00003185.zip
Scanning the drive for archives: 1 file, 249572 bytes (244 KiB)
Listing archive: 00003185.zip
--
Path = 00003185.zip
Type = zip
ERRORS: Headers Error
Unconfirmed start of archive
WARNINGS: There are data after the end of archive
Physical Size = 131838
Tail Size = 117734
Characteristics = Local

   Date      Time    Attr         Size   Compressed  Name
------------------- ----- ------------ ------------  ------------------------
2025-03-31 11:18:19 .....       130936       130929  file
2025-03-31 11:18:19 .....         1262          776  fifth.txt
------------------- ----- ------------ ------------  ------------------------
2025-03-31 11:18:19             132198       131705  2 files

Warnings: 1
Errors: 1
└─$ unzip -l 00003185.zip
Archive:  00003185.zip
warning [00003185.zip]:  116736 extra bytes at beginning or within zipfile
  (attempting to process anyway)
  Length      Date    Time    Name
---------  ---------- -----   ----
   130936  2025-03-31 11:18   file
     1262  2025-03-31 11:18   fifth.txt
      825  2025-03-31 11:18   fourth-flag.aes.b64.txt
---------                     -------
   133023                     3 files
```

7zip and unzip show 2 different outputs, which is weird...

During unzip we get an error about extra bytes, so use `zip -FF` flag to fix some parts of zip and get rid of error.
```bash
└─$ unzip -t 00003185.zip
Archive:  00003185.zip
warning [00003185.zip]:  116736 extra bytes at beginning or within zipfile
  (attempting to process anyway)
file #1:  bad zipfile offset (local header sig):  116736
  (attempting to re-compensate)
    testing: file                     OK
    testing: fifth.txt
  error:  invalid compressed data to inflate
file #3:  bad zipfile offset (local header sig):  131834
  (attempting to re-compensate)
    testing: fourth-flag.aes.b64.txt   OK
At least one error was detected in 00003185.zip.

└─$ zip -FF 00003185.zip --out fixed.zip
Fix archive (-FF) - salvage what can
 Found end record (EOCDR) - says expect single disk archive
Scanning for entries...
 copying: file  (130929 bytes)
 copying: fifth.txt  (776 bytes)
 copying: fourth-flag.aes.b64.txt  (653 bytes)
Central Directory found...
EOCDR found ( 1 249550)...

└─$ unzip -t fixed.zip
Archive:  fixed.zip
    testing: file                     OK
    testing: fifth.txt
  error:  invalid compressed data to inflate
    testing: fourth-flag.aes.b64.txt   OK
At least one error was detected in fixed.zip.
└─$ ls -lAh
total 376K
-rwxrwx--- 1 root vboxsf 244K May 31 15:23 00003185.zip
-rwxrwx--- 1 root vboxsf 130K May 31 15:23 fixed.zip
└─$ sha256sum *
82816e2b2f83f35b63e4739ccab5349c5838738d5d1e00a39d62fbcf25376d5e  00003185.zip
61b5650de74a2e42d828c0ebfcc78a661ae97d1595c90ebd1d7c47c1e99aba68  fixed.zip
```

> Could be helpful: [https://users.cs.jmu.edu/buchhofp/forensics/formats/pkzip.html](https://users.cs.jmu.edu/buchhofp/forensics/formats/pkzip.html)
