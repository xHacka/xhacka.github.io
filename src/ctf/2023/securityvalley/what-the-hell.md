# What The Hell

## Description 

Level: 2 Score 30 Category coding

All hell is breaking loose. Once again a frontend developer went completely nuts and left us with a JavaScript project that nobody understands anymore...typical, these frontend developers...surely you can help us, right? Find the flag!

**Link:** [http://pwnme.org:8666](http://pwnme.org:8666/)

## Analysis

1. When visiting website we have a simple input which requires a key.
2. Viewing source code of website (Ctrl+U or Right Click) we find ***[hell.js](http://pwnme.org:8666/hell.js)***
3. hell.js is obfuscated program. Cmd variable contains hex values which is XOR-ed with key `0x0A`
	* Using CyberChef we can take this hex values, decode and XOR with key `0x0A`
	* Due to this line `if (window.hell_key == "666")` if we enter the code `666` this process is done automatically by website.
4. After entering `666` we get `message_from_hell.txt`
```js
// used algo -  can you reverse it?
const a = "???"
let out = ""
for(let i = 0; i < a.length; i++) {
    let temp = a.charCodeAt(i) & 0xFF
    let l = temp & 0x0F
    let h = (temp >> 4) & 0xFF;

    if ((i+1) == a.length) {
        out += l +":"+ h
    } else {
        out += l +":"+ h+"-"
    }
}
```
5. Going back to `cmd` variable, if we decode second hex value we get 
```js
window.flag = "Mzo1LTU6Ni0zOjYtNjo1LTE6Ni0xMjo2LTExOjctMTA6Ni0zOjctMTU6NS05OjYtMzo3LTE1OjUtODo2LTU6Ni0xMjo2LTEyOjYtMTU6NS0yOjYtNTo3LTQ6Ny0xNTo1LTY6Ni01OjctMTQ6Ni0xOjItMTM6Nw=="
```
`==` At the end indicates that this is a [Base64](https://www.wikiwand.com/en/Base64#introduction) encoded text.
6. Decoding this value (using [CyberChef](https://gchq.github.io/CyberChef/)) returns weird text. Text seems to be constructed from `message_from_hell.txt` Algorithm.
```
3:5-5:6-3:6-6:5-1:6-12:6-11:7-10:6-3:7-15:5-9:6-3:7-15:5-8:6-5:6-12:6-12:6-15:5-2:6-5:7-4:7-15:5-6:6-5:7-14:6-1:2-13:7
```
 
## Solution 

To solve the challenge we must reverse the encryption process of flag.
```py
import string

FLAG = "3:5-5:6-3:6-6:5-1:6-12:6-11:7-10:6-3:7-15:5-9:6-3:7-15:5-8:6-5:6-12:6-12:6-15:5-2:6-5:7-4:7-15:5-6:6-5:7-14:6-1:2-13:7"
ALPHABET = string.ascii_letters + string.digits + "{_}!"
values = {}

for char in ALPHABET:
    temp = ord(char) & 0xFF
    l = temp & 0x0F
    h = (temp >> 4) & 0xFF
    encrypted = f"{l}:{h}"
    values[encrypted] = char

print("".join(values[chunk] for chunk in FLAG.split('-')))
```