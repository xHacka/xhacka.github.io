# Shuffle


## Description 

country: Borneo

[challenge](https://ctf.cert.unlp.edu.ar/files/6ac3e692ff1e251f27cc4155d324056c/challenge?token=eyJ1c2VyX2lkIjo3MDYsInRlYW1faWQiOjM3MywiZmlsZV9pZCI6MjY1fQ.ZTpEzg._Q9EkqsslY92aWirWi_pmiAuBYQ "challenge")

## Solution

![shuffle-1](/assets/ctf/metared/shuffle-1.png)

If you take a closer look at broken image with hex editor (I use VSCode Hex Editor) and compare to any png image you'll notice that some bytes are swapped. 

Let's say original is: `00 11 22 33 44 55 66 77`, Corrupted image: `00 11 44 55 22 33 66 77`

![shuffle-2](/assets/ctf/metared/shuffle-2.png)

Using this python script convert corrupted image to flag:

```py
chunks = []
with open('./challenge.png', 'rb') as image:
    while (byte := image.read(2)):
        chunks.append(byte)


with open('./solve.png', 'wb') as png:
    swapped = False
    for i in range(len(chunks)):
        if i % 3 == 0 : # Skip every 3rd chunk
            png.write(chunks[i])
        elif swapped: # If already swapped ignore
            swapped = False
        else: # Do swap
            png.write(chunks[i+1])
            png.write(chunks[i])
            swapped = True 
```

![shuffle-3](/assets/ctf/metared/shuffle-3.png)
::: tip Flag
`flag{come_and_pl4y_w1th_us}`
:::