## Description

One of the US Cyber Games administrators forgot their password to the FTP Server a lot of times. How many times did they forget it according to the IIS Windows log file?

_The flag format is `SVUSCG{<number>}`_ 

[ex250604.log](https://ctf.uscybergames.com/files/66f8a5204064ddb971d6b6a298cd9fe2/ex250604.log?token=eyJ1c2VyX2lkIjoxMDY4LCJ0ZWFtX2lkIjpudWxsLCJmaWxlX2lkIjo0MX0.aE1TOw.EvnfZHVMEJ3lwN6_AIaFO3ci6Jg)

## Solution

```bash
└─$ file ex250604.log
ex250604.log: ASCII text, with CRLF line terminators

└─$ head ex250604.log
#Software: Microsoft Internet Information Services 7.0
#Version: 1.0
#Date: 2025-06-04 15:21:56
#Fields: time c-ip cs-method cs-uri-stem sc-status sc-win32-status
15:21:56 192.168.1.250 [2]USER administrator 331 0
15:21:56 192.168.1.250 [3]USER administrator 331 0
15:21:56 192.168.1.250 [4]USER administrator 331 0
15:21:56 192.168.1.250 [5]USER administrator 331 0
15:21:56 192.168.1.250 [1]USER administrator 331 0
15:21:56 192.168.1.250 [3]PASS - 530 1326
```

Convert to csv
```bash
└─$ echo "time,c-ip,cs-method,cs-uri-stem,sc-status,sc-win32-status" > output.csv
grep -av '^#' ex250604.log | awk '{print $1","$2","$3","$4","$5","$6}' >> output.csv
```

There's only 3 status codes: 230, 331 and 530

![Logged.png](/assets/ctf/uscybergames/logged.png)

- [230 User logged in, proceed.](https://www.solarwinds.com/serv-u/tutorials/225-226-227-230-ftp-response-codes)
- [331 User name okay, need password.](https://www.solarwinds.com/serv-u/tutorials/331-332-334-336-350-ftp-response-codes)
- [530 Not logged in.](https://www.solarwinds.com/serv-u/tutorials/530-532-533-534-535-ftp-response-codes)

[sc-win32-status](https://learn.microsoft.com/en-us/windows/win32/debug/system-error-codes?redirectedfrom=MSDN) codes
- 1326 - ERROR_LOGON_FAILURE - The user name or password is incorrect.

Microsoft docs confusion level is over 9000 🥴🥴 [https://learn.microsoft.com/en-us/windows/win32/http/w3c-logging](https://learn.microsoft.com/en-us/windows/win32/http/w3c-logging)

We need to know how many times the admin failed to enter correct password. I thought I could follow up `331` status codes with `530`, but there's `331` -> `530` -> `230` which doesn't make sense.

![Logged-1.png](/assets/ctf/uscybergames/logged-1.png)

Something else that doesn't make sense is `[INDEX]FTP_COMMAND`, it's probably `[SESSION_ID]FTP_COMMAND`

It turned out much simpler than I thought. Just grep for status code and that's it.
```bash
└─$ grep -a '530' ./ex250604.log | wc -l
306737
```

::: tip Flag
`SVUSCG{306737}`
:::
