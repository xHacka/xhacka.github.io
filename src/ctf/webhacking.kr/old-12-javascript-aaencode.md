# Old 12    Javascript (AAEncode)

URL: [https://webhacking.kr/challenge/code-3/](https://webhacking.kr/challenge/code-3/)

As title challenge suggests we are dealing with Javascript:
```html
...
        <script>
            ﾟωﾟﾉ = /｀ｍ´）ﾉ ~┻━┻   / /*´∇｀*/["_"];
            o = ﾟｰﾟ = _ = 3;
            c = ﾟΘﾟ = ﾟｰﾟ - ﾟｰﾟ;
            ﾟДﾟ = ﾟΘﾟ = (o ^ _ ^ o) / (o ^ _ ^ o);
            ﾟДﾟ = {
                ﾟΘﾟ: "_",
                ﾟωﾟﾉ: ((ﾟωﾟﾉ == 3) + "_")[ﾟΘﾟ],
                ﾟｰﾟﾉ: (ﾟωﾟﾉ + "_")[o ^ _ ^ (o - ﾟΘﾟ)],
                ﾟДﾟﾉ: ((ﾟｰﾟ == 3) + "_")[ﾟｰﾟ],
            };
            ﾟДﾟ[ﾟΘﾟ] = ((ﾟωﾟﾉ == 3) + "_")[c ^ _ ^ o];
            ﾟДﾟ;
        </script>
        <font size="2">javascript challenge</font>
...
```

The Javascript doesn't seem normal and VSCode formatter seems to did a fine job of formatting it in a code way.

Googling some portion of code lead me to AAEncoding:

![old-12.png](/assets/ctf/webhacking.kr/old-12.png)

aadecode - Decode encoded-as-_[aaencode](http://utf-8.jp/public/aaencode.html)_ JavaScript program.
[https://cat-in-136.github.io/2010/12/aadecode-decode-encoded-as-aaencode.html](https://cat-in-136.github.io/2010/12/aadecode-decode-encoded-as-aaencode.html)

![old-12-1.png](/assets/ctf/webhacking.kr/old-12-1.png)

```js
var enco = ''
var enco2 = 126
var enco3 = 33
var ck = document.URL.substr(document.URL.indexOf('='))
for (i = 1; i < 122; i++) {
  enco = enco + String.fromCharCode(i, 0)
}
function enco_(x) {
  return enco.charCodeAt(x)
}
if (
  ck == '=' +
    String.fromCharCode(enco_(240)) +
    String.fromCharCode(enco_(220)) +
    String.fromCharCode(enco_(232)) +
    String.fromCharCode(enco_(192)) +
    String.fromCharCode(enco_(226)) +
    String.fromCharCode(enco_(200)) +
    String.fromCharCode(enco_(204)) +
    String.fromCharCode(enco_(220)) +
    String.fromCharCode(enco_(198)) +
    '~~~~~~' +
    String.fromCharCode(enco2) +
    String.fromCharCode(enco3)
) {
  location.href = './' + ck.replace('=', '') + '.php'
}
```

Paste in the Console tab:

![old-12-2.png](/assets/ctf/webhacking.kr/old-12-2.png)

[webhacking.kr/challenge/code-3/youaregod\~\~\~\~\~\~\~!.php](webhacking.kr/challenge/code-3/youaregod~~~~~~~!.php)

![old-12-3.png](/assets/ctf/webhacking.kr/old-12-3.png)

