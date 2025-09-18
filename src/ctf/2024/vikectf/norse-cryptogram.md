# Norse Cryptogram

## Description

Delve into the realm of Norse mythology and unlock the secrets of the runic script in this cryptic challenge. Armed with your wits and keen eye, decrypt the ancient messages hidden within the runes. Will you prove yourself worthy of Odin's wisdom or fall prey to the tricks of Loki? Prepare to embark on a journey through Viking lore as you unravel the Runebound Riddles!

[runicTranscript.txt](https://ctf.vikesec.ca/files/638138de061c08f5573843fe7a70b3c2/runicTranscript.txt?token=eyJ1c2VyX2lkIjo1NDcsInRlYW1faWQiOjQwNSwiZmlsZV9pZCI6Mn0.Ze4M7Q.hDT0_qXIiGfR9cFnW-KYUJfeJxo)

## Solution

The given cipher is 9 levels deep.. It's best to use Cyberchef for this and cook as you go deeper.<br>
If you're unsure what something is you can use Magic (Cyberchef) or [Cipher Identifier](https://www.dcode.fr/cipher-identifier).

[Cyberchef Recipe](https://gchq.github.io/CyberChef/#recipe=From_Binary('Space',8)From_Base64('A-Za-z0-9%2B/%3D',true,false)From_Base64('A-Za-z0-9%2B/%3D',true,false)From_Decimal('Space',false)From_Base64('A-Za-z0-9%2B/%3D',true,false)From_Hex('Auto')From_Hexdump()From_Base32('A-Z2-7%3D',true)ROT13(true,true,false,14))

Steps: 
1. From Binary
2. From Base64
3. From Base64
4. From Decimal
5. From Base64
6. From Hex
7. From Hexdump
8. From Base32
9. ROT13 (14)
::: tip Flag
`vikeCTF{r41D3r5_0F_rUN1C_KN0W13D63}`
::: 