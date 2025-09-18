# 1black0white

## Description

We received this file of seemingly random numbers, but the person that sent it is adamant that it is a QR code. Can you figure it out for us?

Author:  `robert-todora`

Downloads: [qr_code.txt](https://ctf.csaw.io/files/16eba095d35568ecc9212b974699453f/qr_code.txt?token=eyJ1c2VyX2lkIjoyODEzLCJ0ZWFtX2lkIjoxMTI0LCJmaWxlX2lkIjozfQ.ZQcasQ.MJzLZnrk6x9eqbtyhT0L2ljpp5A "qr_code.txt")

## Analysis

We are given a list of numbers and huge hint from the start, file is called `qr_code.txt` and it has 29 lines.
* We are dealing with QR Code
* The size of QR Code will probably be 29x29 (29 lines)

```
533258111
274428993
391005533
391777629
390435677
273999169
534074751
99072
528317354
446173689
485174588
490627992
105525542
421383123
132446300
431853817
534345998
496243321
365115424
302404521
289808374
1437979
534308692
272742168
391735804
391385911
391848254
273838450
534645340
```

I converted the numbers to binary and analyzed the results:

```py
with open('qr_code.txt') as f:
    qr_code = f.read().split('\n')
    for number in qr_code:
        print(f"{int(number):029b}") # Int -> Binary (Zero Pad To Length 29)

11111110010001101111101111111
10000010110110111010001000001
10111010011100100010101011101
10111010110100000110101011101
10111010001011001001101011101
10000010101001110010101000001
11111110101010101010101111111
00000000000011000001100000000
11111011111010111101110101010
11010100110000001000111111001
11100111010110010110100111100
11101001111100110001110011000
00110010010100011000100100110
11001000111011100101111010011
00111111001001111100001011100
11001101111011001000011111001
11111110110010111100100001110
11101100101000001001001111001
10101110000110011100000100000
10010000001100101001110101001
10001010001100001111111110110
00000000101011111000100011011
11111110110001110011101010100
10000010000011011011100011000
10111010110010110100111111100
10111010101000001001100110111
10111010110110010000100111110
10000010100100111000101110010
11111110111100000101001011100
```

If you look closely you will see that first 7 lines look like QR Code blocks, 🔳 1 -> Black, 0 -> White (also the name of challenge).

## Solution

![1black0white-1.png](/assets/ctf/csawctf/1black0white-1.png)

```py
import matplotlib.pyplot as plt
from matplotlib.colors import ListedColormap
from PIL import Image
from pyzbar.pyzbar import decode as qr_decode
import os

QRCODE = "qrcode.png" # Output file

with open('qr_code.txt') as f:
    numbers = f.read().split('\n')

# Convert binary data to a list of lists representing black (1) and white (0) cells
matrix = []
for number in numbers: 
    binary = f'{int(number):029b}' # Integer -> Binary (Length=29)
    matrix.append( # String Bits -> Integer List
        list(
            map(
                int, list(binary)
            )
        )
    )

# Create a plot for the QR code
plt.matshow(matrix, cmap=ListedColormap(['white', 'black']))

# Remove labels
plt.xticks([])
plt.yticks([])

# Save image
plt.savefig(QRCODE, bbox_inches='tight', pad_inches=0, format='png')

# Display the QR code
plt.show()

image = Image.open(QRCODE)
data = qr_decode(image)[0].data.decode()
print(data)

# Remove file
os.remove(QRCODE)
```
::: tip Flag
`csawctf{1_d1dnt_kn0w_th1s_w0uld_w0rk}`
:::

## Note

Dcode also has tool for such cases: <https://www.dcode.fr/binary-image>, but image produced is really small.