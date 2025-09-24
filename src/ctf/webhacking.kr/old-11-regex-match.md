# Old 11    RegEx Match

URL: [https://webhacking.kr/challenge/code-2/?view_source=1](https://webhacking.kr/challenge/code-2/?view_source=1)

![old-11.png](/assets/ctf/webhacking.kr/old-11.png)


```php
<?php
include "../../config.php";
if ($_GET["view_source"]) { view_source(); }
?>
...
<?php
$pat = "/[1-3][a-f]{5}_.*$_SERVER[REMOTE_ADDR].*\tp\ta\ts\ts/";
if (preg_match($pat, $_GET["val"])) {
    solve(11);
} else {
    echo "<h2>Wrong</h2>";
}
echo "<br><br>";
?>
...
```

```
Pattern: [1-3][a-f]{5}_.*<IP>.*\tp\ta\ts\ts
Match:   2abcde_123<IP>32131	p	a	s	s
```

[Regex101](https://regex101.com/r/9z49tx/1)

![old-11-1.png](/assets/ctf/webhacking.kr/old-11-1.png)

```bash
https://webhacking.kr/challenge/code-2/?val=2abcde_123<YOUR_IP>32131%09p%09a%09s%09s
```