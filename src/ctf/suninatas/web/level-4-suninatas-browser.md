# Level 4   SuNiNaTaS Browser

Challenge: [http://suninatas.com/challenge/web04/web04.asp](http://suninatas.com/challenge/web04/web04.asp)

![level-4.png](/assets/ctf/suninatas/web/level-4.png)

```html
<!-- Hint : Make your point to 50 & 'SuNiNaTaS' -->
<!-- M@de by 2theT0P -->
```

Challenge wants us to get 50 points, which means we have to click button 50 times or just `curl` and automate it.
```bash
➜ curl 'http://suninatas.com/challenge/web04/web04_ck.asp?x=[1-50]' -H 'Cookie: ASP.NET_SessionId=rrcvgq2pu1nnz1ezi35dgzac; ASPSESSIONIDQCRCTCAD=KIFNCODBIAKOGECFEFOEINLN' -d 'total=1'
```

On 25th point it no longer goes up and says:
```html
    <script>alert("I like the SuNiNaTaS browser!");location.href="./web04.asp";</script>
```

Make 25 more requests to get 50 points and get flag:
```bash
➜ curl 'http://suninatas.com/challenge/web04/web04_ck.asp?x=[1-25]' -H 'Cookie: ASPSESSIONIDQCRCTCAD=OIFNCODBGDJCPIJJLIAAPKFA' -d 'total=1' -A 'SuNiNaTaS'
```

> Authkey: `Change your Us3r Ag3ent`

