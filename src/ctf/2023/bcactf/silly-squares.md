# Silly Squares 

## Description

Silly Squares | 25 points | By `Andreas Bratu`

I found this marvelous painting of these squares over a red background. It is quite a piece of art. I don't know why I found them so funny, but I can't stop laughing at them. My teacher told me I have to find the flag or I fail. However, the squares are so silly that I can't stop myself from laughing for long enough to find the flag. Can you please find them for me?

Static resources: [Silly_Squares.png?](https://storage.googleapis.com/bcactf/silly-squares/Silly_Squares.png)

## Analysis

The image is simple, its canvas with 4 blocks. First block has a flag and others seem to have flag too, but are covered by a different color.

## Solution

I used [online-image-editor](https://www.online-image-editor.com) to manipulate image colors. 

`Upload -> Basics -> Color Change -> Equalize`
![silly-squares-1](/assets/ctf/bcactf/silly-squares-1.png)

```
bcactf{th1s_is_a_r34l_flag}
```

#### PS

For the kicks MSPaint can also be used to uncover the flag using bucket tool D: 

![silly-squares-2](/assets/ctf/bcactf/silly-squares-2.png)
