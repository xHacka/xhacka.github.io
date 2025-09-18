# Down Bad

## Description

by `Hiumee`

The flag is right there! 

[down_bad.png](https://drive.google.com/file/d/1k16yKbV_6fgrSFjg0GVuEVWDvqwCPpok/view?usp=drive_link)

## Solution

```bash
# Let's try opening png
└─$ display ./down_bad.png # Fails To Open
                                        
└─$ pngcheck ./down_bad.png 
./down_bad.png  CRC error in chunk IHDR (computed 1d9c52c0, expected a9d5455b)
ERROR: ./down_bad.png
```
 
Step 1: Fix CRC

![https://www.wikiwand.com/en/PNG#Examples](/assets/ctf/tfcctf/down-bad-1.png)

![down-bad-2](/assets/ctf/tfcctf/down-bad-2.png)

![down-bad-3](/assets/ctf/tfcctf/down-bad-3.png)

Where flag? :(

The challenge name `down_bad`, word "down" and the woman downvoting us made me thing it's like Tunnel Vision from PicoCTF. Image height bytes could have been manipulated to not see some chunks. So let's try to extend the image!

![down-bad-4](/assets/ctf/tfcctf/down-bad-4.png)

![down-bad-5](/assets/ctf/tfcctf/down-bad-5.png)
::: tip Flag
`TFCCTF{28ae25c96850245ffdd70a880158f9f3}`
:::
::: info :information_source:
TIL: Surprisingly Windows doesn't care about CRC as much as Linux, so if you were on Windows you could open the file, and after you changed height without touching CRC it's still openable.
:::