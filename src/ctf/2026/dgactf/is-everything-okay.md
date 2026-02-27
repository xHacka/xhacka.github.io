# Is everything okay?

## Description

None, only the file is given
- [2026_suspicious_activity.pcapng](https://dgactf.com/files/67c105bde56389306c101748faa66bb3/2026_suspicious_activity.pcapng?token=eyJ1c2VyX2lkIjoyMCwidGVhbV9pZCI6bnVsbCwiZmlsZV9pZCI6M30.aXe0Iw.Yg8Aws_Xxu8mT_rdU1zUEj9hk6A)

## Solution

The **Protocol Hierarchy** shows that TLS, FTP and ICMP protocols were used.

![is-everything-okay.png](/assets/ctf/dgactf/is-everything-okay.png)

If we follow the first stream we have FTP connection and commands executed, with tshark:
```bash
└─$ tshark -r 2026_suspicious_activity.pcapng -Y "ftp" -T fields -e ftp.request.command -e ftp.request.arg -e ftp.response.code -e ftp.response.arg
		220	(vsFTPd 3.0.5)
USER	anonymous		
		331	Please specify the password.
PASS			
		230	Login successful.
SYST			
		215	UNIX Type: L8
FEAT			
		211	Features:
			 EPRT
			 PASV
EPSV			
		229	Entering Extended Passive Mode (|||39091|)
LIST	-al		
		150	Here comes the directory listing.
		226	Directory send OK.
TYPE	I		
		200	Switching to Binary mode.
SIZE	secured.zip		
		213	215
EPSV			
		229	Entering Extended Passive Mode (|||45718|)
RETR	secured.zip		
		150	Opening BINARY mode data connection for secured.zip (215 bytes).
		226	Transfer complete.
MDTM	secured.zip		
		213	20260108073900
QUIT			
		221	Goodbye.
```

`secured.zip` contains `flag.txt`, but it's password protected.

ICMP packets are oddly very big, some small, some big...

![is-everything-okay-1.png](/assets/ctf/dgactf/is-everything-okay-1.png)

XOR brute
```python
import subprocess

hex_data = subprocess.check_output("tshark -r 2026_suspicious_activity.pcapng -Y icmp.data -T fields -e icmp.data", shell=True,).decode().split()
data = bytes.fromhex("".join(hex_data))

def mostly_printable(s, threshold=0.9):
    printable = sum(32 <= ord(c) <= 126 or c in "\n\r\t" for c in s)
    return printable / len(s) >= threshold

print(f"Trying {len(data)} bytes...")

for key in range(256):
    decoded = bytes((b - key) % 256 for b in data)
    try:
        text = decoded.decode("latin1")
    except UnicodeDecodeError:
        continue

    if mostly_printable(text):
        print(f"\n[+] Key found: {key}")
        print("-" * 40)
        print(text)
        open("recovered_data.txt", "w").write(text)
        print("-" * 40)
```

Bruteforced decoded text looks like this:
```bash
<SNIP>
[+] Key found: 192
----------------------------------------
ls -al
total 24
drwxrwxr-x 5 kali kali 4096 Jan  8 07:45 .
drwxrwxr-x 3 kali kali 4096 Jan  8 08:06 ..
-rw-rw-r-- 1 kali kali   97 Jan  8 07:18 2026_plans.txt
drwxrwxr-x 2 kali kali 4096 Jan  8 07:20 Documents
drwxrwxr-x 2 kali kali 4096 Jan  8 07:26 Secrets
drwxrwxr-x 2 kali kali 4096 Jan  8 07:23 Spies

ls -al
total 752
drwxrwxr-x 2 kali kali   4096 Jan  8 07:20 .
drwxrwxr-x 5 kali kali   4096 Jan  8 07:45 ..
-rw-rw-r-- 1 kali kali  49672 Nov  8 13:43 sample-local-pdf.pdf
-rw-rw-r-- 1 kali kali 707824 Jan  3  2022 WVP Example PHDS ProviderQualityReport.pdf

ls -al Spies/
ls -al Spies/
total 16
drwxrwxr-x 2 kali kali 4096 Jan  8 07:23 .
drwxrwxr-x 5 kali kali 4096 Jan  8 07:45 ..
-rw-rw-r-- 1 kali kali  156 Jan  8 07:23 2025_Spies.txt
-rw-rw-r-- 1 kali kali  149 Jan  8 07:23 2026_Spies.txt

ls -al Secrets/
ls -al Secrets/
total 12
drwxrwxr-x 2 kali kali 4096 Jan  8 07:26 .
drwxrwxr-x 5 kali kali 4096 Jan  8 07:45 ..
-rw-rw-r-- 1 kali kali 1051 Jan  8 07:26 Employee-Passwords.txt
----------------------------------------
```

While going over similar challenges I came across this [Network Eazy – Google Cloud](https://blog.shuye.dev/2020/07/cybrics-ctf-writeup/)
- [gcloud.ipynb](https://gist.github.com/yechs/eb464d8b530286f3aa24cb3d4da4a43a)

Tweak a bit
```python
from scapy.all import *

key = 192
file = '2026_suspicious_activity.pcapng'
packets = rdpcap(file)
print(packets)

for i, packet in enumerate(packets):
    try:
        data = packet['ICMP']['Raw'].load
        decrypted = bytes((byte_ - key) % 256 for byte_ in data) 
        decrypted_text = decrypted.decode(errors='ignore').replace('\n\n', '\n')
        print(f"[ICMP Packet {i}]\n{decrypted_text}\n{'- ' * 20}")
    except:
        ...
```

I managed to recover something like this
```bash
<2026_suspicious_activity.pcapng: TCP:79 UDP:0 ICMP:21 Other:0>
[ICMP Packet 60]
ls -al
- - - - - - - - - - - - - - - - - - - - 
[ICMP Packet 61]
ls -al
- - - - - - - - - - - - - - - - - - - - 
[ICMP Packet 62]
total 24
drwxrwxr-x 5 kali kali 4096 Jan  8 07:45 .
drwxrwxr-x 3 kali kali 4096 Jan  8 08:06 ..
-rw-rw-r-- 1 kali kali   97 Jan  8 07:18 2026_plans.txt
drwxrwxr-x 2 kali kali 4096 Jan  8 07:20 Documents
drwxrwxr-x 2 kali kali 4096 Jan  8 07:26 Secrets
drwxrwxr-x 2 kali kali 4096 Jan  8 07:23 Spies
- - - - - - - - - - - - - - - - - - - - 
[ICMP Packet 63]
ls -al Documents/
- - - - - - - - - - - - - - - - - - - - 
[ICMP Packet 64]
ls -al Documents/
- - - - - - - - - - - - - - - - - - - - 
[ICMP Packet 65]
total 752
drwxrwxr-x 2 kali kali   4096 Jan  8 07:20 .
drwxrwxr-x 5 kali kali   4096 Jan  8 07:45 ..
-rw-rw-r-- 1 kali kali  49672 Nov  8 13:43 sample-local-pdf.pdf
-rw-rw-r-- 1 kali kali 707824 Jan  3  2022 WVP Example PHDS ProviderQualityReport.pdf
- - - - - - - - - - - - - - - - - - - - 
[ICMP Packet 66]
ls -al Spies/
- - - - - - - - - - - - - - - - - - - - 
[ICMP Packet 67]
ls -al Spies/
- - - - - - - - - - - - - - - - - - - - 
[ICMP Packet 68]
total 16
drwxrwxr-x 2 kali kali 4096 Jan  8 07:23 .
drwxrwxr-x 5 kali kali 4096 Jan  8 07:45 ..
-rw-rw-r-- 1 kali kali  156 Jan  8 07:23 2025_Spies.txt
-rw-rw-r-- 1 kali kali  149 Jan  8 07:23 2026_Spies.txt
- - - - - - - - - - - - - - - - - - - - 
[ICMP Packet 69]
cat Spies/2025_Spies.txt
- - - - - - - - - - - - - - - - - - - - 
[ICMP Packet 70]
cat Spies/2025_Spies.txt
- - - - - - - - - - - - - - - - - - - - 
[ICMP Packet 71]
Ivan Ivanov
Dmitry Petrov
Alexey Smirnov
Sergey Kuznetsov
Mikhail Popov
Andrey Sokolov
Nikolay Lebedev
Vladimir Kozlov
Pavel Novikov
Roman Morozov
- - - - - - - - - - - - - - - - - - - - 
[ICMP Packet 73]
cat Spies/2026_Spies.txt
- - - - - - - - - - - - - - - - - - - - 
[ICMP Packet 74]
cat Spies/2026_Spies.txt
- - - - - - - - - - - - - - - - - - - - 
[ICMP Packet 75]
Ali Rezaei
Mohammad Hosseini
Amir Karimi
Reza Ahmadi
Hossein Rahimi
Mehdi Mohammadi
Saeed Moradi
Farhad Ghasemi
Arash Najafi
Kaveh Ebrahimi
- - - - - - - - - - - - - - - - - - - - 
[ICMP Packet 79]
ls -al Secrets/
- - - - - - - - - - - - - - - - - - - - 
[ICMP Packet 80]
ls -al Secrets/
- - - - - - - - - - - - - - - - - - - - 
[ICMP Packet 81]
total 12
drwxrwxr-x 2 kali kali 4096 Jan  8 07:26 .
drwxrwxr-x 5 kali kali 4096 Jan  8 07:45 ..
-rw-rw-r-- 1 kali kali 1051 Jan  8 07:26 Employee-Passwords.txt
- - - - - - - - - - - - - - - - - - - - 
[ICMP Packet 87]
cat Secrets/Employee-Passwords.txt
- - - - - - - - - - - - - - - - - - - - 
[ICMP Packet 89]
cat Secrets/Employee-Passwords.txt
- - - - - - - - - - - - - - - - - - - - 
[ICMP Packet 90]
F9!rQ2@Lm8Zx
T$7aP1vN#4eK
8Qm!Z@R5xC2P
V3@kM9!sA#T
X!7R@qP2L8M
A9#P!L7M2xQ@
rT8@!2F#KZ9M
Z@9!QK2M#x8P
M8!@KZ9Q#P2x
Q@Z8M9#K!2Px
P!9QZ@M2#K8x
@K9M!ZQ#2P8x
9QZ@!M#K2P8x
xM9!@QZ#K2P8
!ZQ9@M#K2P8x
KZ9@!Q#M2P8x
2P8xKZ9@!Q#M
8x2P!ZQ@K9#M
#MZ9@Q!2Px8K
@!ZQ9#M2P8xK
M2P8x@!ZQ9#K
K2P8xMZ9@!Q#
x8K2P@!ZQ9#M
!@ZQ9#M2P8xK
9#MZQ@!2P8xK
P8xK2M@!ZQ9#
xK2P8@!ZQ9#M
@M!ZQ9#2P8xK
ZQ@!9#M2P8xK
8xK2PZQ@!9#M
#M2P8xKZQ@!9
!ZQ@9#M2P8xK
P8xK2@!ZQ9#M
xK2P8M@!ZQ9#
9@!ZQ#M2P8xK
#ZQ@!9M2P8xK
K2P8x#ZQ@!9M
M2P8xK@!ZQ9#
@!ZQ9#K2P8xM
ZQ@!9#K2P8xM
8xK2P@ZQ!9#M
M2P8xKZQ@!9#
#ZQ@!9K2P8xM
!@ZQ9#K2P8xM
2P8xM@!ZQ9#K
K2P8xMZQ@!9#
9#KZQ@!2P8xM
P8xM2K@!ZQ9#
xK2P8@!9ZQ#M
!ZQ@9#2P8xMK
M2P8xK@ZQ!9#
@!9ZQ#M2P8xK
ZQ@!9M#2P8xK
8xK2P@!9ZQ#M
#MZQ@!92P8xK
!@9ZQ#M2P8xK
K2P8xMZQ@!9#
9#ZQ@!M2P8xK
P8xMK2@!9ZQ#
xK2P8@ZQ!9#M
@!ZQ9#M2P8Kx
ZQ@!9#M2P8Kx
8Kx2P@!ZQ9#M
M2P8KxZQ@!9#
#ZQ@!9M2P8Kx
!@ZQ9#K2P8Mx
2P8MxM@!ZQ9#K
K2P8MxMZQ@!9#
9#KZQ@!2P8MxM
P8MxM2K@!ZQ9#
xK2P8Mx@!9ZQ#
!ZQ@9#2P8MxMK
M2P8MxK@ZQ!9#
@!9ZQ#M2P8MxK
ZQ@!9M#2P8MxK
8MxK2P@!9ZQ#
#MZQ@!92P8MxK
!@9ZQ#M2P8MxK
K2P8MxMZQ@!9#
9#ZQ@!M2P8MxK
- - - - - - - - - - - - - - - - - - - - 
```

 I don't know why **Scapy** managed to get more data and **tshark** failed, but anyways it worked! Use passwords as potential zip passwords
```bash
└─$ zip2john secured.zip > hash
└─$ john --wordlist=passwords.txt hash
!ZQ@9#2P8xMK     (secured.zip/flag.txt)
```

Pwned
```bash
└─$ 7z x secured.zip -p'!ZQ@9#2P8xMK'
└─$ cat flag.txt
DGA{1CMP_D4T4_3XF1L}
```

::: tip Flag
`DGA{1CMP_D4T4_3XF1L}`
:::


