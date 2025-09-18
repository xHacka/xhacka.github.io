# Where Snakes Die

## Description

Author: cg

The flag to this challenge is all lowercase, with no underscores.

[crypto2.zip](https://ctfmgci.jonathanw.dev/dl/bxmctf2023/crypto2.zip)

## Analysis 

We are given a `clue.txt`. If opened with normal editor we can only see `|` symbols seperated by spaces, but using VSCode we can render whitespaces.

![where-snake-die-1](/assets/ctf/mgci-ctf-club/where-snake-die-1.png)

<small>Note: To render whitespaces: `F1 -> View: Toggle Render Whitespace`</small>

## Solution

Rendered tab and space icons make me think this is morse code. First I checked unique symbols and then I translated characters into morse code characters.

```py
with open("clue.txt") as f:
    clue = f.read()

unique_chars = set(clue)
print(f"Unique Characters: {unique_chars}")

morse = (
    clue.
    replace('\t', '-').  # Replace tabs with dashes
    replace(' ', '.').   # Replace spaces with dots
    replace('|', ' / '). # Change pipe to slash
    strip()              # Remove excess whitespaces
)
print(morse)
```

Using dcode [Morse Decoder](https://www.dcode.fr/morse-code) we can easily get the flag. 

Dont forget! flag has to have ctf format, all lowercase and no underscores. 
