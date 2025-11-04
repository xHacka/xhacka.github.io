# Web

## Description

Welcome back to Insomnia Factory, where you might have to work under the enchanting glow of the moon, crafting dreams and weaving sleepless tales.

URL: [https://app.hackthebox.com/challenges/Insomnia](https://app.hackthebox.com/challenges/Insomnia)

## Source

`entrypoint.sh`
```bash
#!/bin/bash

# Initialize SQLite database with a table and an initial user
touch /var/www/html/Insomnia/database/insomnia.db
chmod 666 /var/www/html/Insomnia/database/insomnia.db

sqlite3 /var/www/html/Insomnia/database/insomnia.db <<'EOF'
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY,
    username TEXT NOT NULL,
    password TEXT NOT NULL
);
INSERT INTO users (username, password) VALUES ('administrator', LOWER(hex(randomblob(16))));
EOF

# Create JWT secret key
echo "JWT_SECRET='$(openssl rand -hex 32)'" >> /var/www/html/Insomnia/.env

# Start Apache server
apache2-foreground
```

`apache.conf`
```xml
<VirtualHost *:80>
    ServerAdmin webmaster@localhost
    DocumentRoot "/var/www/html/Insomnia/public"
    ServerName localhost
    <Directory "/var/www/html/Insomnia/public/">
        AllowOverride all
    </Directory>
</VirtualHost>
```

`web_insomnia/Insomnia/app/Controllers/ProfileController.php`
```php
<?php

namespace App\Controllers;

use App\Controllers\BaseController;
use CodeIgniter\HTTP\ResponseInterface;
use Config\Paths;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class ProfileController extends BaseController {
    public function index() {
        $token = (string) $_COOKIE["token"] ?? null;
        $flag = file_get_contents(APPPATH . "/../flag.txt");
        if (isset($token)) {
            $key = (string) getenv("JWT_SECRET");
            $jwt_decode = JWT::decode($token, new Key($key, "HS256"));
            $username = $jwt_decode->username;
            if ($username == "administrator") {
                return view("ProfilePage", [
                    "username" => $username,
                    "content" => $flag,
                ]);
            } else {
                $content = "Haven't seen you for a while";
                return view("ProfilePage", [
                    "username" => $username,
                    "content" => $content,
                ]);
            }
        }
    }
}
```

`web_insomnia/Insomnia/app/Controllers/UserController.php`
```php
<?php

namespace App\Controllers;

use CodeIgniter\Controller;
use CodeIgniter\API\ResponseTrait;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class UserController extends Controller {
    use ResponseTrait;

    public function LoginIndex() {
        return View("LoginPage");
    }
    public function login() {
        $db = db_connect();
        $json_data = request()->getJSON(true);
        if (!count($json_data) == 2) {
            return $this->respond("Please provide username and password", 404);
        }
        $query = $db->table("users")->getWhere($json_data, 1, 0);
        $result = $query->getRowArray();
        if (!$result) {
            return $this->respond("User not found", 404);
        } else {
            $key = (string) getenv("JWT_SECRET");
            $iat = time();
            $exp = $iat + 36000;
            $headers = [ "alg" => "HS256", "typ" => "JWT" ];
            $payload = [ "iat" => $iat, "exp" => $exp, "username" => $result["username"] ];
            $token = JWT::encode($payload, $key, "HS256");

            $response = [ "message" => "Login Succesful", "token" => $token ];
            return $this->respond($response, 200);
        }
    }

    public function RegisterIndex() {
        return View("RegisterPage");
    }
    public function register() {
        $db = db_connect();
        $json_data = request()->getJSON(true);
        $username = $json_data["username"] ?? null;
        $password = $json_data["password"] ?? null;

        if (!($username && $password)) {
            return $this->respond("Empty username or password", 404);
        } else {
            // Check if the username already exists
            $existingUser = $db
                ->table("users")
                ->where("username", $username)
                ->get()
                ->getRow();

            if ($existingUser) {
                return $this->respond("Username already exists", 400);
            }

            // Insert the new user if the username is unique
            $db->table("users")->insert([
                "username" => $username,
                "password" => $password,
            ]);

            if ($db->affectedRows() > 0) {
                return $this->respond("Registration successful for user: " . $username, 200);
            } else {
                return $this->respond("Registration failed", 404);
            }
        }
    }
}
```
## Solution

![insomnia.png](/assets/ctf/htb/web/insomnia.png)

If we register with creds `x:y` we get redirected to `/profile`

![insomnia-1.png](/assets/ctf/htb/web/insomnia-1.png)

I thought this would be SQLi, but all query statements are prepared queries so we can't do anything about it.

But the application is JWT based, and in login code we see some wacky statement:
```php
$json_data = request()->getJSON(true);
if (!count($json_data) == 2) {
	return $this->respond("Please provide username and password", 404);
}
$query = $db->table("users")->getWhere($json_data, 1, 0);
```

The condition is almost always the False, so in the SQL query we can query the username since they are unique and become any user.

```php
└─$ php -a
Interactive shell
php > $arr1 = [1];
php > $arr2 = [1,2];
php > $arr3 = [1,2,3];
php > echo count($arr1) . PHP_EOL . count($arr2) . PHP_EOL . count($arr3);
1
2
3
php > echo (var_dump(!count($arr1) == 2)) . PHP_EOL . (var_dump(!count($arr2) == 2)) . PHP_EOL . (var_dump(!count($arr3) == 2));
bool(false)
bool(false)
bool(false)
```

![insomnia-2.png](/assets/ctf/htb/web/insomnia-2.png)

Set the cookie and visit `/index.php/profile`

![insomnia-3.png](/assets/ctf/htb/web/insomnia-3.png)

> Flag: `HTB{I_just_want_to_sleep_a_little_bit!!!!!}`