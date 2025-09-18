# WayWitch

## Description

Hidden in the shadows, a coven of witches communicates through arcane tokens, their messages cloaked in layers of dark enchantments. These enchanted tokens safeguard their cryptic conversations, masking sinister plots that threaten to unfold under the veil of night. However, whispers suggest that their protective spells are flawed, allowing outsiders to forge their own charms. Can you exploit the weaknesses in their mystical seals, craft a token of your own, and infiltrate their circle to thwart their nefarious plans before the next moon rises?

> NOTE: Access through `https://[IP]:[PORT]/`  

## Source

`src/index.js`
```js
const express = require("express");
const https = require("https");
const fs = require("fs");
const app = express();
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const nunjucks = require("nunjucks");
const routes = require("./routes");
const Database = require("./database");

const db = new Database("party.db");

const privateKey = fs.readFileSync("/tmp/server.key", "utf8");
const certificate = fs.readFileSync("/tmp/server.cert", "utf8");
const credentials = { key: privateKey, cert: certificate };

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
nunjucks.configure("views", { autoescape: true, express: app });
app.set("views", "./views");
app.use("/static", express.static("./static"));
app.use(routes(db));
app.all("*", (req, res) => { return res.status(404).send({ message: "404 page not found", }); });
app.use(function (err, req, res, next) { res.status(500).json({ message: "Something went wrong!" }); });

(async () => {
  await db.connect();
  await db.migrate();

  https.createServer(credentials, app).listen(1337, "0.0.0.0", () => {
    console.log("HTTPS Server listening on port 1337");
  });
})();
```

```js
const sqlite = require("sqlite-async");
const fs = require("fs");

class Database {
  constructor(db_file) {
    this.db_file = db_file;
    this.db = undefined;
  }

  async connect() { this.db = await sqlite.open(this.db_file); }

  async migrate() {
    let flag;
    fs.readFile("/flag.txt", "utf8", function (err, data) { flag = data; });

    await this.db.exec(`
          DROP TABLE IF EXISTS tickets;

          CREATE TABLE tickets(
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              name VARCHAR(255) NOT NULL,
              username VARCHAR(255) NOT NULL,
              content TEXT NOT NULL
          );
      `);

    await this.db.exec(`
          INSERT INTO tickets (name, username, content) VALUES
          ('John Doe', 'guest_1234', 'I need help with my account.'),
          ('Jane Smith', 'guest_5678', 'There is an issue with my subscription.'),
          ('Admin', 'admin', 'Top secret: The Halloween party is at the haunted mansion this year. Use this code to enter ${flag}'),
          ('Paul Blake', 'guest_9012', 'Can someone assist with resetting my password?'),
          ('Alice Cooper', 'guest_3456', 'The app crashes every time I try to upload a picture.');
      `);
  }

  async add_ticket(name, username, content) {
    return new Promise(async (resolve, reject) => {
      try {
        let stmt = await this.db.prepare("INSERT INTO tickets (name, username, content) VALUES (?, ?, ?)");
        resolve(await stmt.run(name, username, content));
      } catch (e) {
        reject(e);
      }
    });
  }

  async get_tickets() {
    return new Promise(async (resolve, reject) => {
      try {
        let stmt = await this.db.prepare("SELECT * FROM tickets");
        resolve(await stmt.all());
      } catch (e) {
        reject(e);
      }
    });
  }
}

module.exports = Database;
```

`src/routes/index.js`
```js
const express = require("express");
const router = express.Router({ caseSensitive: true });
const { getUsernameFromToken } = require("../util");

let db;

const response = (data) => ({ message: data });

router.get("/", (req, res) => { return res.render("index.html"); });

router.get("/tickets", async (req, res) => {
  const sessionToken = req.cookies.session_token;
  if (!sessionToken) { return res.status(401).json(response("No session token provided")); }

  try {
    const username = getUsernameFromToken(sessionToken);

    if (username === "admin") {
      try {
        const tickets = await db.get_tickets();
        return res.status(200).json({ tickets });
      } catch (err) {
        return res.status(500).json(response("Error fetching tickets: " + err.message));
      }
    } else {
      return res.status(403).json(response("Access denied. Admin privileges required."));
    }
  } catch (err) {
    return res.status(400).json(response(err.message));
  }
});

router.post("/submit-ticket", async (req, res) => {
  const sessionToken = req.cookies.session_token;
  if (!sessionToken) { return res.status(401).json(response("No session token provided")); }

  let username;
  try { username = getUsernameFromToken(sessionToken); } 
  catch (err) { return res.status(400).json(response(err.message)); }

  const { name, description } = req.body;
  if (!name || !description) { return res.status(400).json(response("Name and description are required")); }

  try {
    await db.add_ticket(name, username, description);
    return res.status(200).json(response("Ticket submitted successfully"));
  } catch (err) {
    return res.status(500).json(response("Error submitting ticket: " + err.message));
  }
});

module.exports = (database) => { db = database; return router };
```

`src/util.js`
```js
const jwt = require("jsonwebtoken");

function getUsernameFromToken(token) {
  const secret = "[REDACTED]";
  try { return jwt.verify(token, secret).username; } 
  catch (err) { throw new Error("Invalid token: " + err.message); }
}

module.exports = { getUsernameFromToken, };
```

## Solution

The only functionality from frontend is to submit a ticket, but we can't view tickets.

![WayWitch.png](/assets/ctf/htb/waywitch.png)

Right from the start source code is odd, we are assigned JWT tokens by frontend Javascript.
```html
<script>
        function getCookie(name) {
            const value = `; ${document.cookie}`;
            const parts = value.split(`; ${name}=`);
            if (parts.length === 2) return parts.pop().split(";").shift();
        }

        async function generateJWT() {
            const existingToken = getCookie("session_token");
            if (existingToken) { console.log("Session token already exists:", existingToken); return; }

            const randomNumber = Math.floor(Math.random() * 10000);
            const guestUsername = "guest_" + randomNumber;

            const header = { alg: "HS256", typ: "JWT" };
            const payload = { username: guestUsername, iat: Math.floor(Date.now() / 1000), };
            const secretKey = await crypto.subtle.importKey(
                "raw",
                new TextEncoder().encode("[REDACTED]"),
                { name: "HMAC", hash: "SHA-256" },
                false,
                ["sign"]
            );

            const headerBase64  = btoa(JSON.stringify(header)) .replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
            const payloadBase64 = btoa(JSON.stringify(payload)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");

            const dataToSign = `${headerBase64}.${payloadBase64}`;
            const signatureArrayBuffer = await crypto.subtle.sign(
                { name: "HMAC" },
                secretKey,
                new TextEncoder().encode(dataToSign)
            );

            const signatureBase64 = btoa(String.fromCharCode.apply(null, new Uint8Array(signatureArrayBuffer))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
            const token = `${dataToSign}.${signatureBase64}`;

            document.cookie = `session_token=${token}; path=/; max-age=${60 * 60 * 24}; Secure`;
            console.log("Generated JWT Session Token:", token);
        }

        document
            .getElementById("submit-btn")
            .addEventListener("click", async (event) => {
                event.preventDefault();

                const name = document.getElementById("ticket-name").value;
                const description = document.getElementById("ticket-desc").value;

                const response = await fetch("/submit-ticket", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ name, description }),
                });

                const result = await response.json();
                document.getElementById("message-display").textContent =
                    result.message
                        ? result.message
                        : "Ticket submitted successfully!";
            });

        window.addEventListener("load", generateJWT);
    </script>
```

JWT tokens are verified with `jsonwebtoken` library. It's missing third argument and is defaulted to `HS256`, signing custom tokens with algorithm of `none` doesn't work.
```js
function getUsernameFromToken(token) {
  const secret = "[REDACTED]";
  try { return jwt.verify(token, secret).username; } 
  catch (err) { throw new Error("Invalid token: " + err.message); }
}
```

`submit-ticket` route doesn't seem to have any injection points, username is validated from JWT (still suspicious) and all SQL queries are parameterized meaning no SQLi.
```js
router.post("/submit-ticket", async (req, res) => {
  const sessionToken = req.cookies.session_token;
  if (!sessionToken) { return res.status(401).json(response("No session token provided")); }

  let username;
  try { username = getUsernameFromToken(sessionToken); } 
  catch (err) { return res.status(400).json(response(err.message)); }

  const { name, description } = req.body;
  if (!name || !description) { return res.status(400).json(response("Name and description are required")); }

  try {
    await db.add_ticket(name, username, description);
    return res.status(200).json(response("Ticket submitted successfully"));
  } catch (err) {
    return res.status(500).json(response("Error submitting ticket: " + err.message));
  }
});
```

The `/tickets` route has all tickets, but to view them we must be `admin`.

In `index.html` the Javascript signs the JWTs with hardcoded key, it's not visible in given source code
```js
            const secretKey = await crypto.subtle.importKey(
                "raw",
                new TextEncoder().encode("[REDACTED]"),
                { name: "HMAC", hash: "SHA-256" },
                false,
                ["sign"]
            );
```

but it's visible in production.
```js
                const secretKey = await crypto.subtle.importKey(
                    "raw",
                    new TextEncoder().encode("halloween-secret"),
                    { name: "HMAC", hash: "SHA-256" },
                    false,
                    ["sign"],
                );
```

Verify with [https://jwt.io](https://jwt.io), "*signature verified*" indicates that this is production key.

![WayWitch-1.png](/assets/ctf/htb/waywitch-1.png)

1. Change `username` to `admin`
2. Change cookie to new forged cookie
3. Visit `/tickets`
4. Profit

```json
{
	"id": 3,
	"name": "Admin",
	"username": "admin",
	"content": "Top secret: The Halloween party is at the haunted mansion this year. Use this code to enter HTB{k33p_jwt_s3cr3t_s4f3_br0_030ead857c45d72b4180d57241819b8c}"
},
```

> Flag: `HTB{k33p_jwt_s3cr3t_s4f3_br0_030ead857c45d72b4180d57241819b8c}`

