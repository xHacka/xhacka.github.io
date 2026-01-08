# Misc

## Description

Let's see if you're a QuickR soldier as you pretend to be
## Solution

We are given IP:PORT to connect to:

![quickr.png](/assets/ctf/htb/misc/quickr.png)

Looks like we will have to decode QR code from ASCII, specifically ANSI colors: [https://gist.github.com/JBlond/2fea43a3049b38287e5e9cefc87b2124](https://gist.github.com/JBlond/2fea43a3049b38287e5e9cefc87b2124)

Repeated patterns are:
```bash
\x1b[7m  
\x1b[0m
\x1b[7m  
\x1b[0m
\x1b[7m  
\x1b[0m
\x1b[41m  
\x1b[0m
\x1b[41m  
\x1b[0m
\x1b[41m  
\x1b[0m
```

`0m` is to reset color, `41m` is red background, `7m` wasn't found in table and it's probably black background.

```python
from pwn import remote, info, context
import re
from PIL import Image, ImageDraw
from pyzbar.pyzbar import decode


def matrix2qr(matrix, scale=10):
    # Image dimensions
    rows = len(matrix)
    cols = len(matrix[0])
    img_size = (cols * scale, rows * scale)

    # Empty white image
    img = Image.new('RGB', img_size, 'white')
    draw = ImageDraw.Draw(img)

    for y, row in enumerate(matrix):
        for x, value in enumerate(row):
            if value == 1:  # Draw Black
                x0, y0 = x * scale, y * scale
                x1, y1 = x0 + scale, y0 + scale
                draw.rectangle([x0, y0, x1, y1], fill='black')

    return img


IP = '94.237.56.229'
PORT = 54467
ANSI_CODES = re.compile(r'\x1b\[(\d*)m')

io = remote(IP, PORT)

qr_data = []
while True:
    line = io.recvline().decode()
    if '[+]' in line:
        break

    data = []
    for color_code in ANSI_CODES.findall(line):
        if   color_code == '0':  continue       # Reset
        elif color_code == '7':  data.append(0) # Black
        elif color_code == '41': data.append(1) # Red

    if data:
        qr_data.append(data)

qr_image = matrix2qr(qr_data)
qr_text = decode(qr_image)[0].data.decode()
answer = eval(qr_text[:-2].replace('x', '*'))

info(f'{qr_text=}')
info(f'{answer=}')

io.sendline(str(answer).encode())

print(io.recvallS())

io.close()
```

> Flag: `HTB{@lriGh7_1_tH1nK_y0u``r3_QuickR_s0ldi3r}`

::: info Note
Flag middle part should have 1 tilde... formatting issue in obsidian soo...
:::