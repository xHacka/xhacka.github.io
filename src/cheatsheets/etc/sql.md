# MySQL Enumeration With Language

## PHP

### PDO

```php
// Get databases
$p=new PDO("mysql:host=db","root","root");foreach($p->query("SHOW DATABASES")as$r)echo$r["Database"]."\n";

// Select database and get tables
$p=new PDO("mysql:host=db;dbname=cybermonday","root","root");foreach($p->query("SHOW TABLES")as$r)echo$r[0]."\n";

// Select database and dump table
$p=new PDO("mysql:host=db;dbname=cybermonday","root","root");foreach($p->query("SELECT * FROM users")as$r)print_r($r)."\n";
```

```bash
(remote) www-data@070370e2cdc4:/var/www/html$ php -r '$p=new PDO("mysql:host=db","root","root");foreach($p->query("SHOW DATABASES")as$r)echo$r["Database"]."\n";'
cybermonday
information_schema
mysql
performance_schema
sys
webhooks_api
(remote) www-data@070370e2cdc4:/var/www/html$ php -r '$p=new PDO("mysql:host=db;dbname=cybermonday","root","root");foreach($p->query("SHOW TABLES")as$r)echo$r[0]."\n";'
failed_jobs
migrations
password_resets
personal_access_tokens
products
users
(remote) www-data@070370e2cdc4:/var/www/html$ php -r '$p=new PDO("mysql:host=db;dbname=cybermonday","root","root");foreach($p->query("SELECT * FROM users")as$r)print_r($r)."\n";'
Array
(
    [id] => 1
    [0] => 1
    [username] => admin
    [1] => admin
    [email] => admin@cybermonday.htb
    [2] => admin@cybermonday.htb
    [password] => $2y$10$6kJuFazZjtlrAvBNvg4bpO2fQSunL56QFbodCKG6.Qjw87Z8.fYnG
    [3] => $2y$10$6kJuFazZjtlrAvBNvg4bpO2fQSunL56QFbodCKG6.Qjw87Z8.fYnG
    [isAdmin] => 1
    [4] => 1
    [remember_token] =>
    [5] =>
    [created_at] => 2023-05-29 04:10:36
    [6] => 2023-05-29 04:10:36
    [updated_at] => 2023-05-29 04:14:22
    [7] => 2023-05-29 04:14:22
)
```

### MySQLi

```php
$c=new mysqli("172.17.0.1","wp_user","wp_password");foreach($c->query("SHOW DATABASES")as$r){echo $r["Database"]."\n";};$c->close();
$c=new mysqli("172.17.0.1","wp_user","wp_password","wordpress");foreach($c->query("SHOW TABLES")->fetch_all()as$r)echo$r[0]."\n";
# Doesnt include headers
$c=new mysqli("172.17.0.1","wp_user","wp_password","wordpress");foreach($c->query("SELECT * FROM wp_users")->fetch_all()as$r)echo$r[0]."\n";
# Includes headers
$c=new mysqli("172.17.0.1","wp_user","wp_password","wordpress");$q=$c->query("SELECT * FROM wp_users");while($r=$q->fetch_assoc())print_r($r)."\n";
```

```bash
php -r '$c=new mysqli("172.17.0.1","wp_user","wp_password");foreach($c->query("SHOW DATABASES")as$r){echo $r["Database"]."\n";};$c->close();'
php -r '$c=new mysqli("172.17.0.1","wp_user","wp_password","wordpress");foreach($c->query("SHOW TABLES")->fetch_all()as$r)echo$r[0]."\n";'
php -r '$c=new mysqli("172.17.0.1","wp_user","wp_password","wordpress");foreach($c->query("SELECT * FROM wp_users")->fetch_all()as$r)echo$r[0]."\n";'
php -r '$c=new mysqli("172.17.0.1","wp_user","wp_password","wordpress");$q=$c->query("SELECT * FROM wp_users");while($r=$q->fetch_assoc())print_r($r)."\n";'
```

## Python

### flask_sqlalchemy

```python
# Get databases
from sqlalchemy import create_engine,text; print([db[0] for db in create_engine('mysql://username:password@host:port/').connect().execute(text('SHOW DATABASES')).fetchall()])

# Get tables
from sqlalchemy import create_engine, text; print([tb[0] for tb in create_engine('mysql://username:password@host:port/database').connect().execute(text('SHOW TABLES')).fetchall()])

# Get rows
from sqlalchemy import create_engine, text; [print(row) for row in create_engine('mysql://username:password@host:port/database').connect().execute(text('SELECT * FROM table')).fetchall()]
```

```bash
atlas@sandworm:/var/www/html/SSA/SSA/submissions$ python3 -c "from sqlalchemy import create_engine,text; print([db[0] for db in create_engine('mysql://atlas:GarlicAndOnionZ42@127.0.0.1:3306/SSA').connect().execute(text('SHOW DATABASES')).fetchall()])"
['SSA', 'information_schema', 'performance_schema']

atlas@sandworm:/var/www/html/SSA/SSA/submissions$ python3 -c "from sqlalchemy import create_engine, text; print([tb[0] for tb in create_engine('mysql://atlas:GarlicAndOnionZ42@127.0.0.1:3306/SSA').connect().execute(text('SHOW TABLES')).fetchall()])"
['users']

atlas@sandworm:/var/www/html/SSA/SSA/submissions$ python3 -c "from sqlalchemy import create_engine, text; [print(row) for row in create_engine('mysql://atlas:GarlicAndOnionZ42@127.0.0.1:3306/SSA').connect().execute(text('SELECT * FROM users')).fetchall()]"
(1, 'Odin', 'pbkdf2:sha256:260000$q0WZMG27Qb6XwVlZ$12154640f87817559bd450925ba3317f93914dc22e2204ac819b90d60018bc1f')
(2, 'silentobserver', 'pbkdf2:sha256:260000$kGd27QSYRsOtk7Zi$0f52e0aa1686387b54d9ea46b2ac97f9ed030c27aac4895bed89cb3a4e09482d')
```

### SQLite3

```python
# Get tables
conn=__import__('sqlite3').connect('database.db'); print([t[0] for t in conn.execute('SELECT name FROM sqlite_master WHERE type="table"').fetchall()])

# Get rows
conn=__import__('sqlite3').connect('database.db'); [print(row) for row in conn.execute('SELECT * FROM table_name').fetchall()]

# Get columns
conn=__import__('sqlite3').connect('database.db'); print([c[1] for c in conn.execute('PRAGMA table_info(table_name)').fetchall()])
```

```bash
# Get tables
blackbot@comet:~/../database$ python3 -c "import sqlite3; conn=sqlite3.connect('database.db'); print([t[0] for t in conn.execute('SELECT name FROM sqlite_master WHERE type=\"table\"').fetchall()])"
['users']

# Get rows
blackbot@comet:~/../database$ python3 -c "import sqlite3; conn=sqlite3.connect('database.db'); [print(row) for row in conn.execute('SELECT * FROM users').fetchall()]"
('71719fd7-c694-4066-ab9a-b41d330c6d43', 'notorious', 'notorious.hackerz@gmail.com', '$2a$14$EaH/vHO2TK6dvxj84veaQ.g1ka6MtPmujPtUj/qJNAxgzMg/fT7oa', 1, 1)

# Get columns
blackbot@comet:~/../database$ python3 -c "import sqlite3; conn=sqlite3.connect('database.db'); print([c[1] for c in conn.execute('PRAGMA table_info(users)').fetchall()])"
['id', 'username', 'email', 'password', 'is_admin', 'is_premium']
```
