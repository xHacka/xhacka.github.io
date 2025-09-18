# where-are-the-cookies

## Description

Tom is feeling especially snacky during the CTF, can you find where the cookies are?

Note: This challenge works best on Chrome

## Solution

Website: __Welcome to the kitchen! Where are the cookies? 🤔__

First place to check would be `Developer Tools > Application > Cookies`, but it's empty. Since the website is completely empty and nowhere to navigate I decided to check `robots.txt`

```
User-agent: *
Disallow: /cookiesaretotallynothere
```

`/cookiesaretotallynothere`: __No cookies for you today!__

Looking into inpector again we see a new cookie: `caniseethecookie : bm8==`

Decoding Base64 `bm8==` -> `no` . Let's try changing it to `eWVz` (yes in Base64). 

Resfresh: __You found the cookie! 🍪 Oh, I also found this unrelated string, might be useful to you: dsc{c0Ok135_4r3_th3_c0oL35t}__
::: tip Flag
`dsc{c0Ok135_4r3_th3_c0oL35t}`
:::