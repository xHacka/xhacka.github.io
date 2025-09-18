# Hidden Valor

## Description

Decode the secrets of our Viking legacy hidden within the depths of our emblem. Unveil the hidden message to reveal the path to glory!

[vikeCTF-logo.jpeg](https://ctf.vikesec.ca/files/6fd53fe1466b3587002be4b934c5e8ba/vikeCTF-logo.jpeg?token=eyJ1c2VyX2lkIjo1NDcsInRlYW1faWQiOjQwNSwiZmlsZV9pZCI6MTF9.Ze4IvQ.Yml9YQdSe2IvYSaPAhCfGfFJWYc)

## Solution

If given `jpeg` is really big in size you gotta start suspecting stuff D: <br>
`binwalk --dd=.* vikeCTF-logo.jpeg` had no results, so the only option left was steganography. The most popular stego tool for jpeg is [steghide](https://www.kali.org/tools/steghide/).

Without much expanation the challenge appeared to be `steghide` [Matryoshka doll](https://www.wikiwand.com/en/Matryoshka_doll). 3x steghide without password.

```bash 
└─$ la
Permissions Size User  Group Date Modified Name
.rw-r--r--   10M woyag woyag 10 Mar 23:26   vikeCTF-logo.jpeg
 
└─$ steghide extract -sf vikeCTF-logo.jpeg -p ''
wrote extracted data to "haxor-cat.jpeg".
 
└─$ steghide extract -sf haxor-cat.jpeg -p ''
wrote extracted data to "pencil.jpeg".
 
└─$ steghide extract -sf pencil.jpeg -p ''
wrote extracted data to "payload".

┌──(woyag㉿kraken)-[~/…/2024/misc/Hidden Valor/t]
└─$ cat payload
MDAxMTAxMTAgMDAxMTEwMDEgMDAxMDAwMDAgMDAxMTAxMTEgMDAxMTAxMTAgMDAxMDAwMDAgMDAxMTAxMTEgMDAxMTEwMDAgMDAxMDAwMDAgMDAxMTAxMTEgMDAxMTAwMTAgMDAxMDAwMDAgMDAxMTAxMDEgMDAxMTAwMDAgMDAxMDAwMDAgMDAxMTAxMDAgMDAxMTAxMTEgMDAxMDAwMDAgMDAxMTAxMDEgMDAxMTAwMTEgMDAxMDAwMDAgMDAxMTAxMTEgMDExMDAwMTAgMDAxMDAwMDAgMDAxMTAwMTEgMDAxMTAxMDEgMDAxMDAwMDAgMDAxMTAxMTAgMDAxMTAxMTEgMDAxMDAwMDAgMDAxMTAwMTEgMDAxMTAwMTEgMDAxMDAwMDAgMDAxMTAxMTEgMDAxMTAxMDAgMDAxMDAwMDAgMDAxMTAwMTEgMDAxMTAwMDAgMDAxMDAwMDAgMDAxMTAxMTAgMDAxMTAwMDEgMDAxMDAwMDAgMDAxMTAwMTEgMDAxMTAwMDAgMDAxMDAwMDAgMDAxMTAxMTEgMDAxMTAxMDAgMDAxMDAwMDAgMDAxMTAxMTAgMDAxMTAxMDEgMDAxMDAwMDAgMDAxMTAwMTEgMDAxMTAxMDAgMDAxMDAwMDAgMDAxMTAxMTAgMDAxMTAwMTEgMDAxMDAwMDAgMDAxMTAxMTEgMDAxMTAxMDEgMDAxMDAwMDAgMDAxMTAxMTAgMDExMDAwMTEgMDAxMDAwMDAgMDAxMTAwMTAgMDAxMTAwMDEgMDAxMDAwMDAgMDAxMTAxMTEgMDExMDAxMDA=
```

[CyberChef Recipe](https://gchq.github.io/CyberChef/#recipe=From_Base64('A-Za-z0-9%2B/%3D',true,false)From_Binary('Space',8)From_Hex('Space')ROT13(true,true,false,13)&input=TURBeE1UQXhNVEFnTURBeE1URXdNREVnTURBeE1EQXdNREFnTURBeE1UQXhNVEVnTURBeE1UQXhNVEFnTURBeE1EQXdNREFnTURBeE1UQXhNVEVnTURBeE1URXdNREFnTURBeE1EQXdNREFnTURBeE1UQXhNVEVnTURBeE1UQXdNVEFnTURBeE1EQXdNREFnTURBeE1UQXhNREVnTURBeE1UQXdNREFnTURBeE1EQXdNREFnTURBeE1UQXhNREFnTURBeE1UQXhNVEVnTURBeE1EQXdNREFnTURBeE1UQXhNREVnTURBeE1UQXdNVEVnTURBeE1EQXdNREFnTURBeE1UQXhNVEVnTURFeE1EQXdNVEFnTURBeE1EQXdNREFnTURBeE1UQXdNVEVnTURBeE1UQXhNREVnTURBeE1EQXdNREFnTURBeE1UQXhNVEFnTURBeE1UQXhNVEVnTURBeE1EQXdNREFnTURBeE1UQXdNVEVnTURBeE1UQXdNVEVnTURBeE1EQXdNREFnTURBeE1UQXhNVEVnTURBeE1UQXhNREFnTURBeE1EQXdNREFnTURBeE1UQXdNVEVnTURBeE1UQXdNREFnTURBeE1EQXdNREFnTURBeE1UQXhNVEFnTURBeE1UQXdNREVnTURBeE1EQXdNREFnTURBeE1UQXdNVEVnTURBeE1UQXdNREFnTURBeE1EQXdNREFnTURBeE1UQXhNVEVnTURBeE1UQXhNREFnTURBeE1EQXdNREFnTURBeE1UQXhNVEFnTURBeE1UQXhNREVnTURBeE1EQXdNREFnTURBeE1UQXdNVEVnTURBeE1UQXhNREFnTURBeE1EQXdNREFnTURBeE1UQXhNVEFnTURBeE1UQXdNVEVnTURBeE1EQXdNREFnTURBeE1UQXhNVEVnTURBeE1UQXhNREVnTURBeE1EQXdNREFnTURBeE1UQXhNVEFnTURFeE1EQXdNVEVnTURBeE1EQXdNREFnTURBeE1UQXdNVEFnTURBeE1UQXdNREVnTURBeE1EQXdNREFnTURBeE1UQXhNVEVnTURFeE1EQXhNREE9DQo): Base64 -> Binary -> ROT13 (13)

![valor-1](/assets/ctf/vikectf/valor-1.png)
::: tip Flag
`vikeCTF{5t3g0n0gr4phy!}`
:::