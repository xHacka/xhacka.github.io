# Old 14    JavaScript (Auth)

URL: [https://webhacking.kr/challenge/js-1/](https://webhacking.kr/challenge/js-1/)

![old-14-1.png](/assets/ctf/webhacking.kr/old-14-1.png)

```html
<html>
<head>
<title>Challenge 14</title>
<style type="text/css">
body { background:black; color:white; font-size:10pt; }
</style>
</head>
<body>
<br><br>
<form name=pw onsubmit="ck();return false"><input type=text name=input_pwd><input type=button value="check" onclick=ck()></form>
<script>
function ck(){
  var ul=document.URL;
  ul=ul.indexOf(".kr");
  ul=ul*30;
  if(ul==pw.input_pwd.value) { location.href="?"+ul*pw.input_pwd.value; }
  else { alert("Wrong"); }
  return false;
}
</script>
</body>
</html>
```

Get the value via JavaScript:
```js
var ul=document.URL;
ul=ul.indexOf(".kr");
ul=ul*30;

console.log(ul)
540
```

![old-14-2.png](/assets/ctf/webhacking.kr/old-14-2.png)