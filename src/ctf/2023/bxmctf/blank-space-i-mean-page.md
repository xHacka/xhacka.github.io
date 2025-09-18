# Blank Space - I mean Page

## Description

Author: Mani

Have fun finding the flag…regardless if you're capable of solving CAPTCHAs or not.

[https://bxmweb1.jonathanw.dev/](https://bxmweb1.jonathanw.dev/)

## Analysis

When we visited the website its blank, no content.
```html
<!DOCTYPE html>
<html>
  <head>
    <title>Welcome to the website</title>
  </head>
  <body>
  </body>
</html>
```

Let's check `robots.txt` for any information
```
User-agent: *
Disallow: /very-secretly-hidden
```

## Solution
```sh
└─$ curl https://bxmweb1.jonathanw.dev/very-secretly-hidden/
ctf{REDACTED}
```
<small>Note: You can also view flag from browser</small>