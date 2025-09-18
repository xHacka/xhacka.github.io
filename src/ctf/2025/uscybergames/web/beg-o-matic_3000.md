# Beg-o-Matic 3000

## Description

Ever wish someone would just GIVE you the flag if you asked nicely?

Source: [beg-o-matic.zip](https://ctf.uscybergames.com/files/bc8363519bd815002236f77f326178e8/beg-o-matic.zip?token=eyJ1c2VyX2lkIjoxMDY4LCJ0ZWFtX2lkIjpudWxsLCJmaWxlX2lkIjozfQ.aEsKcA.CsOadBMPZmDohqrxUVL0HmGYm84)

Author: [@tsuto](https://github.com/jselliott)

## Solution

As the name suggest we have to beg for flags 🤣

![Beg-o-Matic_3000.png](/assets/ctf/uscybergames/beg-o-matic_3000.png)

From given source quick glance at `middleware.js` gives us attack vector idea: XSS
```js
import { NextResponse } from 'next/server'
 
export function middleware(request) {
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64')
  const cspHeader = `
    default-src 'self';
    script-src 'self' 'nonce-${nonce}';
    style-src 'self' 'unsafe-inline' *;
    img-src 'self' 'unsafe-inline' *;
    font-src 'self';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
`
  // Replace newline characters and spaces
  const contentSecurityPolicyHeaderValue = cspHeader.replace(/\s{2,}/g, ' ').trim()
 
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-nonce', nonce)
  requestHeaders.set('Content-Security-Policy', contentSecurityPolicyHeaderValue)
 
  const response = NextResponse.next({ request: { headers: requestHeaders, }, })
  response.headers.set('Content-Security-Policy', contentSecurityPolicyHeaderValue)
 
  return response
}
```

`utils/bot.js` is used to emulate the admin
```js
import puppeteer from 'puppeteer';
import {setTimeout} from "node:timers/promises";
import dotenv from 'dotenv';
dotenv.config();

const botSecret = process.env.BOT_SECRET;

export async function launchBot(id) {
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'], });
  const page = await browser.newPage();
  await page.setExtraHTTPHeaders({ 'X-Bot-Auth': botSecret, });
  console.log(`[BOT] Visiting submission ID: ${id}`)
  await page.goto(`http://localhost:3000/admin/${id}`, { waitUntil: 'networkidle2', });
  await setTimeout(3000);
  await browser.close();
  console.log(`[BOT] Done!`)
}
```

`/api/list` endpoint returns the flag only if the post is approved by the bot, so if we manage to approve the post can leak the flag.

![Beg-o-Matic_3000-1.png](/assets/ctf/uscybergames/beg-o-matic_3000-1.png)

`app/admin/[id]/page.js`:
```js
import { getSubmissionById } from "../../../db/actions";
import { approveBegging } from "@/app/actions";
import { headers } from "next/headers";

import dotenv from "dotenv";
dotenv.config();

const botSecret = process.env.BOT_SECRET;

console.log(`[BOT] Bot secret is: ${botSecret}`);

export default async function AdminPage({ params }) {
    const { id } = await params;
    const page_headers = await headers();
    const authHeader = await page_headers.get("x-bot-auth");
    const isDev = process.env.NODE_ENV === "development";

    if (!isDev && authHeader !== botSecret) {
        return <div>404 Not Found</div>; // or redirect to home
    }

    const submission = getSubmissionById(id);
    if (!submission) return <div>Submission not found</div>;

    return (
        <div className="p-8">
            <h1 className="text-xl font-bold">Admin Review</h1>
            <form action={approveBegging}>
                <input type="hidden" name="id" value={submission.id} />
                <button type="submit" className="mt-4 bg-green-600 text-white px-4 py-2 rounded"> Approve </button>
            </form>
            <div dangerouslySetInnerHTML={{ __html: submission.msg }} />
        </div>
    );
}
```

When bot views our submission React uses [dangerouslySetInnerHTML](https://legacy.reactjs.org/docs/dom-elements.html#dangerouslysetinnerhtml) to render our message, exposing bot to XSS attack as long as we can bypass the CSP.

This might not be so easy as it sounds...
```
default-src 'self'; script-src 'self' 'nonce-ZTg0ODI1MDYtYTc2Mi00OTRmLWIzZTgtODRlZTg0YzI5YTY2'; style-src 'self' 'unsafe-inline' *; img-src 'self' 'unsafe-inline' *; font-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; upgrade-insecure-requests;
```

![Beg-o-Matic_3000-2.png](/assets/ctf/uscybergames/beg-o-matic_3000-2.png)

Similar challenges (research~):
1. [https://blog.arkark.dev/2023/12/28/seccon-finals/](https://blog.arkark.dev/2023/12/28/seccon-finals/)
2. [https://blog.huli.tw/2022/08/21/en/corctf-2022-modern-blog-writeup/](https://blog.huli.tw/2022/08/21/en/corctf-2022-modern-blog-writeup/)
3. [https://waituck.sg/2023/12/11/0ctf-2023-newdiary-writeup.html](https://waituck.sg/2023/12/11/0ctf-2023-newdiary-writeup.html)
4. [https://brycec.me/posts/corctf_2022_challenges](https://brycec.me/posts/corctf_2022_challenges)

The solution was easier then expected, I was just overthinking about leaking the tokens with CSS, but you just needed header that bot head 💀. **Dont overthink**.

Solution by other players: [USCG Beg-o-matic 3000 (CSRF)](https://youtu.be/2s5uSGwzZGk?list=PLjBNfu8qubAaQXCzEQV-wdU6pnldGaDka) by [FlagHoarders](https://www.youtube.com/@flaghoarders)

`@clovismint` solution:

![Beg-o-Matic_3000-3.png](/assets/ctf/uscybergames/beg-o-matic_3000-3.png)