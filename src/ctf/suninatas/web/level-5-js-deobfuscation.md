# Level 5   JS Deobfuscation

Challenge: [http://suninatas.com/challenge/web05/web05.asp](http://suninatas.com/challenge/web05/web05.asp)

![level-5.png](/assets/ctf/suninatas/web/level-5.png)

Key is checked with Javascript, but the code is obfuscated.
```html
<script>
	eval(function(p,a,c,k,e,r){e=function(c){return c.toString(a)};if(!''.replace(/^/,String)){while(c--)r[e(c)]=k[c]||e(c);k=[function(e){return r[e]}];e=function(){return'\\w+'};c=1};while(c--)if(k[c])p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c]);return p}('g l=m o(\'0\',\'1\',\'2\',\'3\',\'4\',\'5\',\'6\',\'7\',\'8\',\'9\',\'a\',\'b\',\'c\',\'d\',\'e\',\'f\');p q(n){g h=\'\';g j=r;s(g i=t;i>0;){i-=4;g k=(n>>i)&u;v(!j||k!=0){j=w;h+=l[k]}}x(h==\'\'?\'0\':h)}',34,34,'||||||||||||||||var|result||start|digit|digitArray|new||Array|function|PASS|true|for|32|0xf|if|false|return'.split('|'),0,{}))
</script>
	...
<!--Hint : 12342046413275659 -->
<!-- M@de by 2theT0P -->
```

We can use deobfuscator apps, or we can try to get function code.

Use snippet to get all the defined functions (from Console tab):
```js
> Object.keys(window).forEach((key, index)=>{if(typeof window[key]==='function'){console.log(`${index}: ${key}`);}});
...
219: PASS
220: init
```

`PASS` seems like our target, `toString` method can show the function code itself:
```js
> PASS.toString()
"function PASS(n){var result='';var start=true;for(var i=32;i>0;){i-=4;var digit=(n>>i)&0xf;if(!start||digit!=0){start=false;result+=digitArray[digit]}}return(result==''?'0':result)}"
```

Beautify code [https://beautifier.io](https://beautifier.io)
```js
function PASS(n) {
    var result = '';
    var start = true;
    for (var i = 32; i > 0;) {
        i -= 4;
        var digit = (n >> i) & 0xf;
        if (!start || digit != 0) {
            start = false;
            result += digitArray[digit]
        }
    }
    return (result == '' ? '0' : result)
}
```

`digitArray` variable is just hex digits.
```js
> window['digitArray']
(16) ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f']
```

The function is converting given integers to hex digits, it can be verified with Javascript built-in function too.
```js
> console.log(PASS(1000))
3e8
> console.log((1000).toString(16))
3e8
```

Using the hint provided in html we get some hex string, if it's used as Key in the input we get the flag.
```js
> console.log(PASS(12342046413275659))
9c43c20c
```

> Authkey: `Unp@cking j@vaScript`