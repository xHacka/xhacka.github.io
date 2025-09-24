# XSS Dom Based Vic

## Description

Log on as an administrator by retrieving the admin session cookie.

[Start the challenge](http://challenge01.root-me.org/web-client/ch24/)

## Solution

Introduction:

![xss---dom-based-(vic).png](/assets/ctf/root-me/xss-dom-based-vic.png)

The nickname parameter is taken from user, after clicking the link we are redirected on same page with `nickname`, `color`, `p` parameters.

![xss---dom-based-(vic)-1.png](/assets/ctf/root-me/xss-dom-based-vic-1.png)

`p` seems to denote which page to include, e.g.: [http://challenge01.root-me.org/web-client/ch24/?nickname=Test02&color=23e&p=contact](http://challenge01.root-me.org/web-client/ch24/?nickname=Test02&color=23e&p=contact) shows contact page.

```html
<script src="xor4096.min.js"></script>
<script>
function Random(){
	this.url = "http://challenge01.root-me.org/web-client/ch24/?p=win";

	this.youwon = function(url){ window.location = url; return true; };
	this.youlost = function() { document.getElementById("disclaimer").innerHTML = "You just lost the game! Did you really think you could win this game of chance?"; return true; };
	
	this.try = function() {
		result = Math.abs(this.prng.double() - this.prng.double()); 
		this.won = result >= 0 && result < 1e-42;
		if (this.won) { this.data.callbacks.win(this.url); }
		else { this.data.callbacks.lose(); }
	};

	this.won = !1;
	this.data = {
		"color": "aaf", // Loaded from `color` parameter, but only 3 characters
		"callbacks": {
			"win": this.youwon,
			"lose": this.youlost
		},
		"seed": "Test02" // Loaded from `nickname`, but filters are applied
	};

	this.prng = new xor4096(this.data.color + this.data.seed);
}

var rng = new Random();
if(rng.data.callbacks.lose.toString().length == 205 && rng.try.toString().length == 315) {
	rng.try();
}

document.getElementById("form").onsubmit = function() {
	var colorel = document.getElementById("color");
	var color = parseInt(colorel.value, 16);
	var shortened = Math.round(((color & 0xff0000) >> 16) / 17).toString(16) +
					Math.round(((color & 0x00ff00) >> 8)  / 17).toString(16) +
					Math.round( (color & 0x0000ff)        / 17).toString(16) ;
	colorel.value = shortened;
	return true;
};

</script>
<script src="jscolor.min.js"></script>
```

**xor4096**, by Richard Brent, is a 4096-bit xor-shift with a very long period that also adds a Weyl generator. It also passes BigCrush with no systematic failures. Its long period may be useful if you have many generators and need to avoid collisions. (Source: [xsrand](https://github.com/davidbau/xsrand) )

I doubt this matters, but it's returning random number based on seed from `color + nickname` which is between 0 and 1. Shouldn't matter because you cant visit `?p=win`, but no XSS there.
```js
> xor4096('abc' + 'Test02')()
0.5157841949258
```

The `color` parameter is always 3 characters long, so hard to inject there.
```powershell
➜ curl 'http://challenge01.root-me.org/web-client/ch24/?nickname=x&color=410&p=game' -s | sls '"color":'
"color": "410",

➜ curl 'http://challenge01.root-me.org/web-client/ch24/?nickname=x&color=<h1>410</h1>&p=game' -s | sls '"color":'
"color": "<h1",
```

Quick script to test values
```python
import re
from requests import Session

URL = 'http://challenge01.root-me.org/web-client/ch24/'

with Session() as session:
    while True:
        xss = (input("Inject: "))
        resp = session.get(URL, params={'nickname': xss, 'color': '123', 'p': 'game'})
        value = re.findall(r'"seed":.*?\n', resp.text, re.DOTALL)
        if value:
            print(value[0])
        else:
            print('Something went wrong...')
            print(resp.text)
```

```bash
> Inject: xs><
"seed": "xs"

> Inject: 0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!#$%&*+,-./:=?@[\]^_{|}~"'();<>`
"seed": "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!#$%&*+,-./:=?@[\]^_{|}~"
```

Following characters are replaced with nothing 
```r
" ' ( ) ; < > `
```

Since it's PHP I thought I could outsmart filters, but arrays just cause errors.
```bash
http://challenge01.root-me.org/web-client/ch24/?nickname[]=Test&color[]=x&p=game

Warning: trim() expects parameter 1 to be string, array given in /challenge/web-client/ch24/game.inc.php on line 6
Warning: substr() expects parameter 1 to be string, array given in /challenge/web-client/ch24/game.inc.php on line 11
```