---
title: aupCTF 2023 - Web Challenges
date: Mon Jun 26 03:23:49 PM +04 2023
categories: [Writeup]
tags: [ctf,aupctf,web]
---

## Starter

mera tu sir chakra raha tum dekh lo ... [random](https://challs.aupctf.live/starter/)<br>
<small>From Hindi: My head is spinning, you see...</small>

### Solution

The flag characters are scrambled all over the place and we have to reassamble. Viewing source code we can see that span elements contain flag characters.

```py
import requests
from bs4 import BeautifulSoup as BS

URL = "https://challs.aupctf.live/starter/"
html = BS(requests.get(URL).text, 'html.parser')
for span in html.find_all('span'):
	print(span.text, end='')
```

> Flag: aupCTF{w45n't-th47-h4rd-r1gh7}
{: .prompt-tip }

## SQLi - 1

Challenge: [Click Here](https://challs.aupctf.live/sqli-1/)

### Solution

Website is a simple login form and from the title we must perform SQLi to login.

By using most basic payload: `' or 1=1 --` we are able to get in.

> Flag: `aupCTF{3a5y-sql-1nj3cti0n}`
{: .prompt-tip }
## SQLi - 2

Challenge: [Click Here](https://challs.aupctf.live/sqli-2/)

### Solution

Same challenge as previous. I tried the previous payload but it didnt work. `' or '1'='1` payload didnt work, but `' OR '1'='1` worked (probably some filter).

> Flag: `aupCTF{m3d1um-sql-1nj3cti0n}`
{: .prompt-tip }

## Header

Carefully analyze the source code  
  
Challenge:  [Click Here](https://challs.aupctf.live/header/)

### Solution

```py
def headar_easy(request):
    if request.META.get('HTTP_GETFLAG') == 'yes':
        context = {
            'flag': '[REDACTED]',
        }
        
        return render(request, 'aa/flag.html', context)
    
    return render(request, 'aa/index.html')
```
_[request.META](https://docs.djangoproject.com/en/4.2/ref/request-response/#django.http.HttpRequest.META) is a dictionary containing all available HTTP headers. Available headers depend on the client and server._

Documentation also says: _Any HTTP headers in the request are converted to `META` keys by converting all characters to uppercase, replacing any hyphens with underscores and adding an `HTTP_` prefix to the name. So, for example, a header called `X-Bender` would be mapped to the `META` key `HTTP_X_BENDER`._

To get the flag we must send request to server with `GETFLAG` header.

```powershell
➜ curl -H "GETFLAG: yes" https://challs.aupctf.live/header/
aupCTF{cust0m-he4d3r-r3qu3st}
```

> Flag: `aupCTF{cust0m-he4d3r-r3qu3st}`
{: .prompt-tip }

## Time Heist

Use your time travel skills to recover the hidden flag

Challenge:  [Click Here](https://iasad.me/tags)

### Solution

Time travel is unlikely _(for now)_, but there's a great time web machine we can utilize, AKA [Wayback Machine](https://web.archive.org). <br>
Let's paste the challenge url and find the flag. We get a lot of matches, most likely the flag was created on first snapshot which is at `MAY 28, 2023`. Visiting the webiste at that time we can see huge tag: `Flag` with blog `You Deserve the Flag`.

<https://web.archive.org/web/20230528105942/https://iasad.me/blogs/flag/>

Finally view source to find the flag.

> Flag: aupCTF{y0u-ar3-4-tru3-t1m3-tr4v3l3r}
{: .prompt-tip }

## Directory

The flag is buried in one of the directory  
  
Source: [Click Here](https://challs.aupctf.live/dir/)

### Solution

Website contains 1000 pages and somewhere is flag inside.

```py
import requests

URL = "https://challs.aupctf.live/dir/page/%d/"
err = "No flag for you"

for page in range(1001):
    resp = requests.get(URL % page) # Old School Formatting
    if err not in resp.text: # If error not in page flag is found
        print(f"Flag found inside page: {page}\nHTML:") 
        print(resp.text)
        break
    print(f"{page=}", end='\r') # Status Bar
```
> Just for the sake of time flag is at page `712`
{: .prompt-info }

> Flag: aupCTF{d1r3ct0r13s-tr1v14l-fl4g}
{: .prompt-tip }

## Conundrum

Challenge: [Superuser](https://challs.aupctf.live/conundrum/)

### Solution

After trying every possible SQLi I could, I was ready to give up on SQLi. Then I tried making post request manually and I got

```html
<head>
  <meta http-equiv="content-type" content="text/html; charset=utf-8">
  <meta name="robots" content="NONE,NOARCHIVE">
  <title>403 Forbidden</title>
```

I was so focused on SQLi that I forgot to check `/robots.txt`, and the huge SQLi rabbithole was patched.

```html
User-agent: *
Disallow: /usernames/
Disallow: /passwords/
```

I parsed and downloaded the information and will try to bruteforce the logic with _Burpsuite Intruder (Clusterbomb Attack)_

```py
import requests
from bs4 import BeautifulSoup as BS

URL = "https://challs.aupctf.live/conundrum/%s/"

for page in ("usernames", "passwords"):
    html = BS(requests.get(URL % page).text, 'html.parser')
    with open(page, 'w') as f: 
        for item in html.find_all('li'):
            f.write(f'{item.text}\n')
```

![conundrum-1](/assets/images/aupCTF/2023/conundrum-1.png)

> Username: starlord69 Password: 1A8$5k7!eR
{: .prompt-info }

![conundrum-2](/assets/images/aupCTF/2023/conundrum-2.png)

Ughh... Couldn't be that easy... `logout` button takes us to `/phash` which is not logout, but rather new login form...

*~~Cool, new login form doesn’t accept any previous usernames/passwords.~~* Another rabbit hole, `/phash` is a different challenge.

I couldn't find a solution for last step on my own, after browsing web I found a [solution on gist](https://gist.github.com/Xib3rR4dAr/32b30234dda814a50361364bfe9aa1e7) by <strong>[Xib3rR4dAr](https://github.com/Xib3rR4dAr)</strong>.

By adding `admin=true` in POST request via burp we are able to login as admin. 

```
srfmiddlewaretoken=TOKEN&username=starlord69&password=1A8$5k7!eR&admin=true
```

> Flag: aupCTF{V1ct0ri0usChall3ng3r!}
{: .prompt-tip }