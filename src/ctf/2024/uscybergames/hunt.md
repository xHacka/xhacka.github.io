# Hunt

## Description

Hunt [Web]

Agent, it looks like ARIA has spun up a simple website. Is there anything you can find to give more information about it's plans?

[https://uscybercombine-s4-hunt.chals.io/](https://uscybercombine-s4-hunt.chals.io/)

## Solution

Nothing interesting on `index.html`, but in comments we have part of flag:
```html
    <!-- Don't forget to check in on the bots! -->
    <!-- p1: SIVBGR{r1s3_ -->
```

```bash
➜ curl https://uscybercombine-s4-hunt.chals.io/robots.txt
<p>User-agent: Humans</p>
<p>Disallow: /secret-bot-spot</p>

<p>p2: 0f_th3_</p>
```

```bash
➜ curl https://uscybercombine-s4-hunt.chals.io/secret-bot-spot
<body>
	...
    <section>
        <img id="robot" src="/static/img/robot.jpeg" />
    </section>
	...
    <script src="/static/js/robot.js"></script>
</body>
➜ curl https://uscybercombine-s4-hunt.chals.io/static/js/robot.js
...
// p3: r0b0ts!}
```
::: tip Flag
`**SIVBGR{r1s3_0f_th3_r0b0ts!}**`
:::