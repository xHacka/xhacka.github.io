# Smug-Dino

## Description

Don't you know it's wrong to smuggle dinosaurs... and other things?

Author:  `rollingcoconut`

Application: [http://web.csaw.io:3009/](http://web.csaw.io:3009/)

## Analysis

![Smug-Dino-1](/assets/ctf/csawctf/smug-dino-1.png)

The application has 3 routes: home, hint and flag.

If we request the flag we are redirected to localhost.
```powershell
➜ curl -I http://web.csaw.io:3009/flag # Get Headers Only
HTTP/1.1 302 Moved Temporarily
Server: nginx/1.17.6
Date: Sun, 17 Sep 2023 16:10:45 GMT
Content-Type: text/html
Content-Length: 145
Connection: keep-alive
Location: http://localhost:3009/flag.txt
```

Hint:

![Smug-Dino-2](/assets/ctf/csawctf/smug-dino-2.png)

If we enter `nginx` and `1.17.6` we are redirected to `/succeed_hint`:

```md
HINT: #1

We believe the item you seek is only accessible to localhost clients on the server; 
All other requests to /flag will be processed as a 401. 

It seems the server is issuing 302 redirections to handle 401 erors...
Is it possible to use the redirection somehow to get the localhost flag?

HINT: #2

CVE 2019-....
```

Doing a quick google dorking query with known keywords: `"cve" "2019" "nginx" "1.17.6"` I found [CVE-2019-20372: nginx Error Page request smuggling](https://vuldb.com/?id.148519)

![Smug-Dino-3](/assets/ctf/csawctf/smug-dino-3.png)

> _NGINX before 1.17.7, with certain error_page configurations, allows HTTP request smuggling, as demonstrated by the ability of an attacker to read unauthorized web pages in environments where NGINX is being fronted by a load balancer._

PoC demonstration: <https://youtu.be/jimGQpftYWs> by [vulnmachines](https://www.youtube.com/@vulnmachines).

## Solution

Here you can see I'm making request with BurpSuite, most headers are not important and hence have been removed for exploit. It's important that first request connection is "keep-alive" so we can smuggle second (or more) requests.

![Smug-Dino-4](/assets/ctf/csawctf/smug-dino-4.png)
::: tip Flag
`csawctf{d0nt\_smuggl3\_Fla6s\_!}`
:::