# Old 54    Misc

URL: [https://webhacking.kr/challenge/bonus-14/](https://webhacking.kr/challenge/bonus-14/)

The character on website keeps changing:
![old-54-1.png](/assets/ctf/webhacking.kr/old-54-1.png)

Can also be observed in Network:

IMAGE

In the source:
```js
x=run();
function answer(i){
  x.open('GET','?m='+i,false);
  x.send(null);
  aview.innerHTML=x.responseText;
  i++;
  if(x.responseText) setTimeout("answer("+i+")",20);
  if(x.responseText=="") aview.innerHTML="?";
}
```

```powershell
curl "https://webhacking.kr/challenge/bonus-14/?m=[0-40]" `
  -H "Cookie: PHPSESSID=3052403292" `
  -H "Referer: https://webhacking.kr/challenge/bonus-14/"

FLAG{a7981201c48d0ece288afd01ca43c55b}
```
