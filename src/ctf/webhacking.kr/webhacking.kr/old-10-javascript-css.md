# Old 10    Javascript (CSS)

URL: [https://webhacking.kr/challenge/code-1/](https://webhacking.kr/challenge/code-1/)

![old-10.png](/assets/ctf/webhacking.kr/old-10.png)

Looks like we have to reach some point with `O` character to get the flag.

```html
<html>
    <head><title>Challenge 10</title></head>
    <body>
        <hr style="height: 100; background: brown" />
        <table border="0" width="1800" style="background: gray"><tr><td>
			<a
				id="hackme"
				style="position: relative; left: 0; top: 0"
				onclick="this.style.left=parseInt(this.style.left,10)+1+'px';if(this.style.left=='1600px')this.href='?go='+this.style.left"
				onmouseover="this.innerHTML='yOu'"
				onmouseout="this.innerHTML='O'">O</a><br />
			<font style="position: relative; left: 1600; top: 0"color="gold">
				|<br />|<br />|<br />|<br />Goal
			</font>
		</td></tr></table>
        <hr style="height: 100; background: brown" />
    </body>
</html>
```

Clicking the `O` makes it move by 1px.

If we visit the link raw [https://webhacking.kr/challenge/code-1/?go=1600px](https://webhacking.kr/challenge/code-1/?go=1600px) we get `no hack`, probably because of Referer header or something.

We can solve it via Javascript Console:
```js
> document.querySelector('#hackme').style.left = '1599px'
---
Then click on `O`
Then click on `O` for redirect
```
