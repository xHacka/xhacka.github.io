# Minute

## Description

[Challenge](https://minute.ctf.cert.unlp.edu.ar)

## Solution

![minute-1](/assets/ctf/metared/minute-1.png)

The website is nothing special, in the header there's weird collection of headers. 

```html
<div class="color-container">
    <!--                                             XXXXXX                                                                           -->
    <div class="color-box" style="background-color: #89504e;"></div>
    <div class="color-box" style="background-color: #470d0a;"></div>
    <div class="color-box" style="background-color: #1a0a00;"></div>
    <div class="color-box" style="background-color: #00000d;"></div>
...
```

Hex colors seemed suspicious so I parsed all the hex colors, passed it into `xxd` and got a QR code.

The trickiest part of the challenge was identifing changing colors, every minute colors changed (hence challenge name) meaning different QR codes.

```py
import requests
from bs4 import BeautifulSoup as BS
from PIL import Image
from pyzbar.pyzbar import decode
import os
import re
from datetime import datetime
from time import sleep
 
URL = 'https://minute.ctf.cert.unlp.edu.ar'

filename = "out.png"
while True:
    resp = requests.get(URL)
    colors = BS(resp.text, 'html.parser').find_all('div', {'class': 'color-box'})
    colors = re.findall(r"#(.*?);", resp.text)
    with open(filename, 'wb') as f:
        for color in colors:
            f.write(bytes.fromhex(color))
    
    qr_data = decode(Image.open(filename))
    print(datetime.now(), '|', qr_data[0].data.decode())
    os.remove(filename)
    sleep(55)
    
'''
2023-10-26 01:23:12.129176 | Marty McFly: "Doc, you don't just walk into a store and-and buy plutonium. Did you rip that off?" Dr. Emmett Brown: "Of course. From a group 
of Libyan nationalists. They wanted me to build them a bomb, so I took their plutonium and, in turn, gave them a shiny bomb-casing full of used pinball machine parts!"     
2023-10-26 01:24:12.412898 | Dr. Emmett Brown: "The time-traveling is just too dangerous. Better that I devote myself to study the other great mystery of the universe: women!" Marty McFly: "The future, Unbelievable."
2023-10-26 01:25:12.104980 | Biff Tannen: "What are you looking at, butthead?" Marty McFly: "Chicken?"
2023-10-26 01:26:12.137556 | Griff Tannen: "What's wrong, McFly. Chicken?" Marty McFly: "Nobody calls me chicken."
2023-10-26 01:27:12.063561 | "I guess you guys aren't ready for that, yet. But your kids are gonna love it." - Marty McFly
2023-10-26 01:28:13.300715 | "I foresee two possibilities. One, coming face to face with herself 30 years older would put her into shock and she'd simply pass out. Or two, the encounter could create a time paradox, the results of which could cause a chain reaction that would unravel the very fabric of the space time continuum, and destroy the entire universe! Granted, that's a worse case scenario. The destruction might in fact be very localized, limited to merely our own galaxy." - Dr. Emmett Brown
2023-10-26 01:29:13.253370 | "Then tell me, future boy, who's President of the United States in 1985?" - Dr. Emmett Brown
2023-10-26 01:30:13.096751 | flag{T1emp0=00_aLT1EmP0_My_Fr13nd}
'''
```
::: tip Flag
`flag{T1emp0=00_aLT1EmP0_My_Fr13nd}`
:::