# Level 13   Backup

[http://suninatas.com/challenge/web13/web13.asp](http://suninatas.com/challenge/web13/web13.asp)

![level-13---misc.png](/assets/ctf/suninatas/misc/level-13-misc.png)

Try downloading [http://suninatas.com/challenge/web13/web13.zip](http://suninatas.com/challenge/web13/web13.zip) (?)

It's a success, but it's password proteced.
```bash
└─$ curl http://suninatas.com/challenge/web13/web13.zip -LO
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100 73649  100 73649    0     0  46437      0  0:00:01  0:00:01 --:--:-- 46436

└─$ unzip web13.zip
Archive:  web13.zip
[web13.zip] whitehack1.jpg password: 
```

```bash
└─$ zip2john web13.zip | tee web13.hash
web13.zip:$pkzip$5*1*1*0*8*24*4a3c*fbc3801ab16804b8b1511d2abdd40a065686bc39f951d1061558f7ca0bf1b8adf140c0ac*1*0*8*24*b132*fbc3801ab16804b8b1511358a763de830c1f53d33747025d8a0ea79915a3173d8b8d6b18*1*0*8*24*e402*fbc3801ab16804b8b15123ad29f2878981c4551e7f6f7a7cc3d2b320c308b3a97650f807*1*0*8*24*efa4*fbc3801ab16804b8b15185f3e7774bb635c23e916859e05ae64f2da2331ffff1f66faeb4*2*0*35*24*f3e4e327*11df4*35*8*35*f3e4*fbc3801ab16804b8b151c51c311292a47cede4d9dd82a4c3f42c7b5872daf579c6e4aa2af761b8107d80fb1ae9ce257b831b807687*$/pkzip$::web13.zip:4ڸ.txt, whitehack3.jpg, whitehack1.jpg, whitehack4.jpg, whitehack2.jpg:web13.zip

└─$ john ./web13.hash $rockyou
7642             (web13.zip)

└─$ unzip -P 7642 web13.zip -d out

Archive:  web13.zip
  inflating: out/whitehack1.jpg
  inflating: out/whitehack2.jpg
  inflating: out/whitehack3.jpg
  inflating: out/whitehack4.jpg
error:  cannot create out/+Ӧ+4++-+.txt
        Invalid argument
```

The file is troublesome to extract, let's take a look at images.

Images look normal, let's look inside
```bash
└─$ strings * | less # Preview
└─$ strings * | grep key
first key : 3nda192n
second key : 84ed1cae
third key: 8abg9295
fourth key : cf9eda4d
```

```bash
└─$ strings * | grep key | cut -d':' -f2 | tr -d ' ' | paste -sd ''
3nda192n84ed1cae8abg9295cf9eda4d
```

> Flag: `3nda192n84ed1cae8abg9295cf9eda4d`

