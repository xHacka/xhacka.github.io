# Misc Challenges

## Fun

WTF is [This](https://aupctf.s3.eu-north-1.amazonaws.com/f.txt)

### Solution

_[JSFuck](https://jsfuck.com) - Write any JavaScript with 6 Characters: \[\]\(\)!+_
::: tip Flag
`aupCTF{j4v45c1pt_but_f*ck3d}`
:::

<!-- SEPERATOR -->

## Sanity check

Have you checked the [Rules](https://aupctf.live/)

### Solution

_Flags are in the format: aupCTF{5an1ty-ch3ck} except if specified differently._
::: tip Flag
`aupCTF{5an1ty-ch3ck}`
:::

<!-- SEPERATOR -->

## Zoo

when was the first ever video uploaded on youtube?.

Flag format: aupCTF{epoch}

### Solution

_"Me at the zoo" is the first ever video uploaded to YouTube, on April 23, 2005, 8:31:52 p.m. PDT, or April 24, 2005, at 03:31:52 UTC._([source](https://www.wikiwand.com/en/Me_at_the_zoo))

Using [epochConverter](https://www.epochconverter.com) to convert _Human date to Timestamp_ `April 24, 2005 03:31:52 UTC` we get the flag answer.
::: tip Flag
`aupCTF{1114313512}`
:::

<!-- SEPERATOR -->

## Frequency

My friend was making a call on his iconic Nokia 3310. Can you figure out who he was calling?

Challenge: [rec](https://aupctf.s3.eu-north-1.amazonaws.com/rec.wav)

### Solution

I used [dtmf-decoder](https://github.com/ribt/dtmf-decoder) to decode get the keys pressed from recording.

```bash
└─$ dtmf rec.wav                                            
009234586060484
```
::: tip Flag
`aupCTF{00923456060484}`
:::
::: info :information_source:
There'stool on web at <http://dialabc.com/sound/detect/> (without download)
:::

<!-- SEPERATOR -->

## pHash

Challenges: [login](https://challs.aupctf.live/phash/) [source](https://aupctf.s3.eu-north-1.amazonaws.com/logic.py)

### Analysis

```py
from django.shortcuts import render
from django.contrib import messages
import hashlib
import random

with open('marvel.txt', 'r', encoding='utf-8', errors='ignore') as file:
    wordlist = file.read().splitlines()

random_word = random.choice(wordlist)
random_md5 = hashlib.md5(random_word.encode('utf-8')).hexdigest()

def login(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')

        if username == 'admin' and password == random_md5:
            messages.success(request, 'Congratulations! Here is your flag [REDACTED]')
        else:
            messages.error(request, 'Invalid username or password.')

    return render(request, 'phash.html')
```

Application opens [marvel.txt](https://github.com/JacksonBates/wordlists/blob/master/marvel.txt) wordlist, gets random line, converts to md5 which ends up being the password.

### Solution

Since I didn't know _who was the character that fans speculated would appear in a "Marvel Show" but ultimately did not make an appearance_, I decided to just try all characters.

```py
import re
import asyncio
import aiohttp
from hashlib import md5

URL = "https://challs.aupctf.live/phash/"
marvel = set()

with open('marvel.txt') as f:
    for line in f.readlines():
        line = (  # Filter Out Comments
            line.strip() if '(' not in line
            else re.search(r"(.*) \(", line).group(1) 
        ).lower() # Convert To Lowercase
        marvel.add(line) # Filter Duplicates
            

async def make_request(session, character):
    phash = md5(character.encode()).hexdigest()      # Calculate Hash
    data = {'username': 'admin', 'password': phash}  # Create the request data
    async with session.post(URL, data=data) as resp: # Send the request
        response_text = await resp.text()
        if 'Invalid username or password.' not in response_text:  # Check Success
            return character, re.findall(r'aupCTF\{.*\}', response_text)[0]

async def main():
    async with aiohttp.ClientSession() as session:
        tasks = []
        for character in marvel:
            tasks.append(make_request(session, character))

        results = await asyncio.gather(*tasks)
        for result in results:
            if result:
                print(result)
                break

loop = asyncio.get_event_loop()
loop.run_until_complete(main())
```
::: tip Flag
`aupCTF{y0u-ar3-a-tru3-m4rv3l-f4n}`
:::
::: info :information_source:
Forthe sake of reducing bruteforce attempts character is "mephisto" (794th)
:::

<!-- SEPERATOR -->

## The Circle Of Life

This message was intercepted by our secret agent but we don't know how to read it. Help us to find secret of the circle.

Challenge: [file](https://aupctf.s3.eu-north-1.amazonaws.com/circle.gcode)

### Solution

_G-code, short for "Geometric Code," is a programming language used in computer numerical control (CNC) machines to control their movements and operations. It consists of a series of instructions that tell the machine how to perform specific tasks, such as moving the tool along a particular path, cutting or shaping materials, and controlling various machine functions._

There's a great tool to visualize gcode at <https://ncviewer.com>.

![the-circle-of-life-1](/assets/ctf/aupctf/the-circle-of-life-1.png)
::: tip Flag
`aupCTF{Ti3_i3_fu9_rig4ht}`
:::

<!-- SEPERATOR -->

## Mr white

Yeah, science!

[alchemist.wav](https://aupctf.s3.eu-north-1.amazonaws.com/alchemist.wav) [doc.jpg](https://aupctf.s3.eu-north-1.amazonaws.com/doc.jpg)

### Analysis

```bash
└─$ exiftool doc.jpg
...
Comment                         : where did the protagonist lived ?
```

_Walter and Skyler's home on the show, located at "308 Negra Arroyo Lane" is a private residence actually located at 3828 Piermont Dr, Albuquerque, NM._

```bash
└─$ steghide extract -sf doc.jpg -p "albuquerque"
wrote extracted data to "wordlist.txt".

└─$ cat wordlist.txt
isaac
aaron
matthew
taylor
henry
elan
oliver
noah
ethan
william
hunter
owen
kevin
nathaniel
olivia
claire
keira
skyler
```

Looks like we got first hint. Opening `wav` file it's clear that start of the audio is Morse Code, but then sound gets weird.. as if its reversed? I opened file in [audacity](https://www.audacityteam.org) and tried to reverse => Ctrl+A -> Effects -> Special -> Reverse.

I cut out the morse code and listened to it, turns out it was a hint from the start. If you listen to original file and decode with [Morse Audio Decoder](https://morsecode.world/international/decoder/audio-decoder-adaptive.html).

```
REVERSE THE AUDIO AND LISTEN TO IT CAREFULLY
```
<small>Note: Words joined for more verbosity, tool can't do it</small>

I could't make use of clip nor wordlist in any way, looking at flag format on TryHackMe flag length is 17, same as wordlist. Extracting first letter of each word -> `iamtheonewhoknocks` (Another famous scene from Breaking Bad).
::: tip Flag
`aupCTF{iamtheonewhoknocks}`
:::
