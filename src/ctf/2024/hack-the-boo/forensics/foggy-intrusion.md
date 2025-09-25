# Foggy Intrusion

## Description

On a fog-covered Halloween night, a secure site experienced unauthorized access under the veil of darkness. With the world outside wrapped in silence, an intruder bypassed security protocols and manipulated sensitive areas, leaving behind traceable yet perplexing clues in the logs. Can you piece together the fragments of this nocturnal breach?

## Solution

We are given a pcap file which contains only HTTP traffic:

![Foggy Intrusion.png](/assets/ctf/htb/foggy-intrusion.png)

Probably redundant method, but I started looking at exportable HTTP objects and after few 404/403 pages I ended up on some PHP code which uses `shell_exec(base64_decode(BLOB))`

![Foggy Intrusion-1.png](/assets/ctf/htb/foggy-intrusion-1.png)

It's executing powershell commands, compressing it with gzip and then base64 encoding output.

![Foggy Intrusion-2.png](/assets/ctf/htb/foggy-intrusion-2.png)

Automatically parse the communication:
```python
from base64 import b64decode
from subprocess import check_output
import zlib

TSHARK = 'tshark -r capture.pcap -Y "tcp.stream eq 3" -T fields -e http.file_data'

http_traffic = [
    bytes.fromhex(line).decode().strip() 
    for line in check_output(TSHARK, shell=True, text=True).split('\n') 
    if line
]
request_responses = list(zip(http_traffic[::2], http_traffic[1::2]))

for i, (req, resp) in enumerate(request_responses):
    payload = b64decode(req.split("'")[1]).decode()
    command = payload.split('$bytes')[0].split('"', maxsplit=1)[1]

    output = zlib.decompressobj(-15).decompress(b64decode(resp)).decode()

    print(f'{command=}\n{output=}\n')
```

```powershell
command='$output = Get-ChildItem -Path C:; '
output='dashboard img webalizer xampp applications.html bitnami.css config.php favicon.ico index.php'

command='$output = Get-ChildItem -Path C:\\xampp; '
output='anonymous apache cgi-bin contrib htdocs img install licenses locale mailoutput mailtodisk mysql php src tmp webdav apache_start.bat apache_stop.bat catalina_service.bat catalina_start.bat catalina_stop.bat ctlscript.bat filezilla_setup.bat filezilla_start.bat filezilla_stop.bat killprocess.bat mercury_start.bat mercury_stop.bat mysql_start.bat mysql_stop.bat passwords.txt properties.ini readme_de.txt readme_en.txt service.exe setup_xampp.bat test_php.bat uninstall.dat uninstall.exe xampp-control.exe xampp-control.ini xampp_shell.bat xampp_start.exe xampp_stop.exe'

command='$output = Get-Content -Path C:\\xampp\\properties.ini; '
output='[General] installdir=C:\\xampp base_stack_name=XAMPP base_stack_key= base_stack_version=8.1.25-0 base_stack_platform=windows-x64 [Apache] apache_server_port=80 apache_server_ssl_port=443 apache_root_directory=/xampp/apache apache_htdocs_directory=C:\\xampp/htdocs apache_domainname=127.0.0.1 apache_configuration_directory=C:\\xampp/apache/conf apache_unique_service_name= [MySQL] mysql_port=3306 mysql_host=localhost mysql_root_directory=C:\\xampp\\mysql mysql_binary_directory=C:\\xampp\\mysql\\bin mysql_data_directory=C:\\xampp\\mysql\\data mysql_configuration_directory=C:\\xampp/mysql/bin mysql_arguments=-u root -P 3306 mysql_unique_service_name= [PHP] php_binary_directory=C:\\xampp\\php php_configuration_directory=C:\\xampp\\php php_extensions_directory=C:\\xampp\\php\\ext'

command='$output = Get-Content -Path C:\\xampp\\htdocs\\config.php; '
output='<?php define(\'DB_SERVER\', \'db\'); define(\'DB_USERNAME\', \'db_user\'); define(\'DB_PASSWORD\', \'HTB{f06_d154pp34r3d_4nd_fl46_w4s_f0und!}\'); define(\'DB_DATABASE\', \'a5BNadf\');  $mysqli = new mysqli(DB_SERVER, DB_USERNAME, DB_PASSWORD, DB_DATABASE);  if ($mysqli->connect_error) {     die("Connection failed: " . $mysqli->connect_error); }  $mysqli->set_charset(\'utf8\'); ?>'

command='$output = whoami; '
output='desktop-pmoil0d\\usr01'
```

::: tip Flag
`HTB{f06_d154pp34r3d_4nd_fl46_w4s_f0und!}`
:::

