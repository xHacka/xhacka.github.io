# Level 4

## Description

This is Level 4
Sometimes hidden stuff are useful...

## Solution

```bash
hacka@Level4:~$ resources
picture_a.mp3
hacka@Level4:~$ open picture_a.mp3
Error 404 File does not exist
```

`resources` command shows file with title `picture`, but extension `mp3`. `mp3` is sound file extension and also it doesnt exist. The most logical thing is to try different extension, because (most commonly) image files are in `png`, `jpg`, `gif` format.

```bash
hacka@Level4:~$ open picture_a.png
Loading image...
```

![level-4-picture_a.png](/assets/ctf/promptriddle/level-4-picture_a.png)

```bash
hacka@Level4:~$ open picture_a.jpeg
Error 404 File does not exist
hacka@Level4:~$ open picture_a.jpg
Error 404 File does not exist
hacka@Level4:~$ open picture_a.gif
Error 404 File does not exist
hacka@Level4:~$ open picture_b.png
Loading image...
```

![level-4-picture_b.png](/assets/ctf/promptriddle/level-4-picture_b.png)

```bash
hacka@Level4:~$ open picture_c.png
Error 404 File does not exist
```

Im sure you're already familiar with [Morse Code](https://www.wikiwand.com/en/Morse_code), assemble the letters to their positions from picture_a and decode the morse. <br>
I would recommend [CyberChef](https://gchq.github.io/CyberChef/) if you're not already familiar with tool.
