# Steganography Challenges

## Absence Makes Hearts Go Yonder

### Description

Sometimes the oldest and simplest tricks can be the most fun. Here's an old stego tactic that requires no special software - just a little knowledge and maybe a keen eye.

![stego1.gif](https://pointeroverflowctf.com/stego1.gif)

### Solution

First thing I tried was `strings`:
```
└─$ strings stego1.gif -d -n 6 | tail
B~BBX~|
VY_q*I
[j	*T9
NC"<(x
$uYhUE8 
]hNrrU
A!bGDR@o~ 
^<>k(8
flag.txtpoctf{uwsp_h342d_y0u_7h3_f1257_71m3} PK
flag.txtPK
```

We already have the flag, but `PK` indicates that there's zip file inside image. Using `binwalk` we can extract hidden files.

```bash
└─$ la # => ls -lah
Permissions Size User  Date Modified Name
.rw-r--r--  562k woyag  2 Jun 05:00   stego1.gif
                                                                                                                                                                                            
└─$ binwalk --dd='.*' stego1.gif            

DECIMAL       HEXADECIMAL     DESCRIPTION
--------------------------------------------------------------------------------
0             0x0             GIF image data, version "89a", 210 x 138
561650        0x891F2         Zip archive data, at least v2.0 to extract, compressed size: 37, uncompressed size: 37, name: flag.txt
561779        0x89273         End of Zip archive, footer length: 22
                                                                                                                                                                                            
└─$ mv _stego1.gif.extracted/891F2 flag.zip

└─$ unzip flag.zip 
Archive:  flag.zip
 extracting: flag.txt

└─$ cat flag.txt 
poctf{uwsp_h342d_y0u_7h3_f1257_71m3} 
```
::: tip Flag
`poctf{uwsp_h342d_y0u_7h3_f1257_71m3} `
:::

## An Invincible Summer

### Description 

I seem to have misplaced the flag for this challenge. I know that it's in one of these files. I just can't remember which one... And why would I have two copies of each image in different formats... I swear, I'd forget my head if I didn't have SQL constantly orbiting it.

Archive password: poctf2023

HINT: This challenge is giving a lot of people trouble. I've double checked everything, and I can unequivocally say it's all picsel perfect.

[Download stego1.7z](https://uwspedu-my.sharepoint.com/:u:/g/personal/cjohnson_uwsp_edu/EVy7Qi5SwQ1HqFeEsMdWnHMBjPkAbYPK_fQYoOUcgRvGEQ?e=6VimhW)

### Solution

I couldn't solve the challenge by myself and relied on hint. Personally I think that the challenge was (or stegano challenges in general) platform dependant. 

Using tool [SSuite Picsel Security](https://www.ssuiteoffice.com/software/ssuitepicselsecurity.htm) you can extract the hidden data. Works only on Windows.

![an-invincible-summer-1](/assets/ctf/pointeroverflowctf/an-invincible-summer-1.png)
::: tip Flag
`poctf{uwsp_1_h4v3_n0_m0u7hh_4nd_1_mu57_5cr34m}`
:::

## Between Secrets and Lies

### Descirption

Picture stego sure is a lot of fun. It's not exactly a party conversation starter, but once someone mentions hiding data I can't help but open that big can of beans. Here - you try!

![bean can](https://pointeroverflowctf.com/bean.png)

### Solution

The given image is PNG and steghide or such tools wont work. Image steganography mostly uses LSB (Least Significant Bit) to hide the data, unfortunatelly since this is not JPG we can't run `zsteg` on it.

For PNG there's tool [StegOnline](https://stegonline.georgeom.net/upload) by [Ge0rg3](https://github.com/Ge0rg3). 

`Upload -> Extract Files/Data`<br>
I thought this would be hard and would have to try all combinations, but after selecting only Red 7 and default values (MSB Order) I was able to extract the secret message.

![between-secrets-and-lies-1](/assets/ctf/pointeroverflowctf/between-secrets-and-lies-1.png)
::: tip Flag
`poctf{uwsp_m0r3_hum4n_7h4n_hum4n_15_0ur_m0770}`
:::