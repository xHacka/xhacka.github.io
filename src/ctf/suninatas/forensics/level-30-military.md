# Level 30   Military

[http://suninatas.com/challenge/web30/web30.asp](http://suninatas.com/challenge/web30/web30.asp)

## Description

![level-30---military.png](/assets/ctf/suninatas/forensics/level-30-military.png)

**[Download #1](https://docs.google.com/uc?id=0B8im6SjxeHFLOW5QRG1QZlA2aGM) or [Download #2](https://drive.google.com/file/d/0B8im6SjxeHFLOW5QRG1QZlA2aGM/view?usp=sharing&resourcekey=0-NBR3awuUcNb49Zd8hG6OpA)**

```bash
└─$ file MemoryDump\(SuNiNaTaS\)
MemoryDump(SuNiNaTaS): data

└─$ /bin/ls -lh MemoryDump\(SuNiNaTaS\)
-rwxrwx--- 1 root vboxsf 1.0G Jun 27 13:05 'MemoryDump(SuNiNaTaS)'
```

## Q1 : IP Address of General Kim's PC  

[Volatility 3 CheatSheet](https://blog.onfvp.com/post/volatility-cheatsheet/)

```bash
└─$ vol3 -f 'MemoryDump(SuNiNaTaS)' windows.netscan | tee windows.netscan.log

Volatility 3 Framework 2.7.0    PDB scanning finished

Offset	Proto	LocalAddr	LocalPort	ForeignAddr	ForeignPort	State	PID	Owner	Created

0x3da576b0	UDPv4	127.0.0.1	62171	*	0		2432	iexplore.exe	2016-05-24 09:35:40.000000
0x3dd557e8	TCPv4	0.0.0.0	445	0.0.0.0	0	LISTENING	4	System	N/A
0x3dd557e8	TCPv6	::	445	::	0	LISTENING	4	System	N/A
0x3dd629d8	TCPv4	0.0.0.0	49156	0.0.0.0	0	LISTENING	460	services.exe	N/A
0x3dd62f60	TCPv4	0.0.0.0	49156	0.0.0.0	0	LISTENING	460	services.exe	N/A
0x3dd62f60	TCPv6	::	49156	::	0	LISTENING	460	services.exe	N/A
0x3de20588	UDPv4	127.0.0.1	63029	*	0		1840	iexplore.exe	2016-05-24 09:34:53.000000
0x3de3e008	TCPv4	192.168.197.138	49174	23.49.155.27	80	CLOSED	-	-	-
0x3de61548	TCPv4	192.168.197.138	49247	113.29.189.142	80	ESTABLISHED	-	-	-
0x3de6e0f0	UDPv4	0.0.0.0	5355	*	0		1184	svchost.exe	2016-05-24 09:37:27.000000
0x3de6e0f0	UDPv6	::	5355	*	0		1184	svchost.exe	2016-05-24 09:37:27.000000
0x3de88008	TCPv4	0.0.0.0	49154	0.0.0.0	0	LISTENING	892	svchost.exe	N/A
0x3de88008	TCPv6	::	49154	::	0	LISTENING	892	svchost.exe	N/A
0x3debf540	UDPv4	0.0.0.0	0	*	0		1184	svchost.exe	2016-05-24 09:22:27.000000
0x3debf540	UDPv6	::	0	*	0		1184	svchost.exe	2016-05-24 09:22:27.000000
0x3ded4168	UDPv4	0.0.0.0	5355	*	0		1184	svchost.exe	2016-05-24 09:37:27.000000
0x3dfd8948	TCPv4	0.0.0.0	49155	0.0.0.0	0	LISTENING	476	lsass.exe	N/A
0x3dfd8948	TCPv6	::	49155	::	0	LISTENING	476	lsass.exe	N/A
0x3dfd8aa8	TCPv4	0.0.0.0	49155	0.0.0.0	0	LISTENING	476	lsass.exe	N/A
0x3e155848	TCPv4	0.0.0.0	49152	0.0.0.0	0	LISTENING	360	wininit.exe	N/A
0x3e181710	TCPv4	0.0.0.0	135	0.0.0.0	0	LISTENING	684	svchost.exe	N/A
0x3e183d98	TCPv4	0.0.0.0	135	0.0.0.0	0	LISTENING	684	svchost.exe	N/A
0x3e183d98	TCPv6	::	135	::	0	LISTENING	684	svchost.exe	N/A
0x3e188a68	TCPv4	0.0.0.0	49152	0.0.0.0	0	LISTENING	360	wininit.exe	N/A
0x3e188a68	TCPv6	::	49152	::	0	LISTENING	360	wininit.exe	N/A
0x3e1c1918	TCPv4	0.0.0.0	49153	0.0.0.0	0	LISTENING	732	svchost.exe	N/A
0x3e1c1918	TCPv6	::	49153	::	0	LISTENING	732	svchost.exe	N/A
0x3e1c2a30	TCPv4	0.0.0.0	49153	0.0.0.0	0	LISTENING	732	svchost.exe	N/A
0x3e1e2008	TCPv4	192.168.197.138	49252	61.111.58.11	80	ESTABLISHED	-	-	-
0x3e1f0340	TCPv4	0.0.0.0	49154	0.0.0.0	0	LISTENING	892	svchost.exe	N/A
0x3ee4f9e8	TCPv4	192.168.197.138	49173	23.43.5.163	80	CLOSED	-	-	-
0x3ee7d688	TCPv4	192.168.197.138	49163	211.233.62.122	80	ESTABLISHED	-	-	-
0x3ee7d910	TCPv4	192.168.197.138	49167	121.189.57.82	80	ESTABLISHED	-	-	-
0x3f26e5f0	UDPv4	192.168.197.138	138	*	0		4	System	2016-05-24 09:22:27.000000
0x3f270450	TCPv4	192.168.197.138	139	0.0.0.0	0	LISTENING	4	System	N/A
0x3f270768	UDPv4	192.168.197.138	137	*	0		4	System	2016-05-24 09:22:27.000000
0x3f430b70	TCPv4	192.168.197.138	49168	216.58.197.132	80	ESTABLISHED	-	-	-
0x3f7854b8	TCPv4	192.168.197.138	49164	211.233.62.122	80	ESTABLISHED	-	-	-
0x3f78bd68	TCPv4	192.168.197.138	49179	59.18.34.167	443	ESTABLISHED	-	-	-
0x3f7deb30	TCPv4	192.168.197.138	49184	114.108.157.50	80	ESTABLISHED	-	-	-
0x3fc5f998	TCPv4	192.168.197.138	49178	59.18.34.167	443	ESTABLISHED	-	-	-
0x3fc6d638	TCPv4	192.168.197.138	49172	172.217.25.67	443	ESTABLISHED	-	-	-
0x3fc77df8	TCPv4	192.168.197.138	49176	172.217.25.67	443	ESTABLISHED	-	-	-
0x3fc84348	TCPv4	192.168.197.138	49169	216.58.197.132	80	ESTABLISHED	-	-	-
0x3fc86008	TCPv4	192.168.197.138	49175	59.18.35.55	80	CLOSED	-	-	-
0x3fc8b5f0	TCPv4	192.168.197.138	49251	61.111.58.11	80	ESTABLISHED	-	-	-
0x3fc8d4a0	TCPv4	192.168.197.138	49177	172.217.25.67	443	ESTABLISHED	-	-	-
0x3fc90df8	TCPv4	192.168.197.138	49265	59.18.44.44	80	ESTABLISHED	-	-	-
0x3fc98738	TCPv4	192.168.197.138	49182	59.18.44.226	443	ESTABLISHED	-	-	-
0x3fc9fbe8	TCPv4	192.168.197.138	49181	59.18.44.226	443	ESTABLISHED	-	-	-
0x3fca8828	TCPv4	192.168.197.138	49180	59.18.35.55	80	CLOSED	-	-	-
0x3fcbbbb0	TCPv4	192.168.197.138	49237	180.70.93.13	80	CLOSED	-	-	-
0x3fcbd7e0	TCPv4	192.168.197.138	49263	13.76.43.41	443	CLOSED	-	-	-
0x3fcd4908	TCPv4	192.168.197.138	49190	180.70.93.96	80	CLOSED	-	-	-
0x3fcd9740	TCPv4	192.168.197.138	49195	183.110.25.243	80	CLOSED	-	-	-
0x3fce2008	TCPv4	192.168.197.138	49230	23.49.155.27	80	ESTABLISHED	-	-	-
0x3fcec460	TCPv4	192.168.197.138	49229	23.49.149.163	80	ESTABLISHED	-	-	-
0x3fcef5f0	TCPv4	192.168.197.138	49228	23.49.149.163	80	ESTABLISHED	-	-	-
0x3fcf3008	TCPv4	192.168.197.138	49233	23.49.155.27	80	ESTABLISHED	-	-	-
0x3fcf4870	TCPv4	192.168.197.138	49231	23.49.155.27	80	ESTABLISHED	-	-	-
0x3fcf6b10	TCPv4	192.168.197.138	49232	23.43.11.27	80	ESTABLISHED	-	-	-
0x3fd09c90	TCPv4	192.168.197.138	49264	59.18.44.44	80	ESTABLISHED	-	-	-
0x3fd0a3d0	TCPv4	192.168.197.138	49239	222.239.129.69	80	CLOSED	-	-	N/A
0x3fd1b620	TCPv4	192.168.197.138	49248	113.29.189.142	80	ESTABLISHED	-	-	-
0x3fdc3c90	TCPv4	192.168.197.138	49264	59.18.44.44	80	ESTABLISHED	-	-	-
0x3fdc43d0	TCPv4	192.168.197.138	49239	222.239.129.69	80	CLOSED	-	-	N/A
0x3fdd5620	TCPv4	192.168.197.138	49248	113.29.189.142	80	ESTABLISHED	-	-	-
```

> Flag 1: `192.168.197.138`

## Q2 : Which secret document did Hacker read?  

```bash
└─$ vol3 -f 'MemoryDump(SuNiNaTaS)' windows.cmdline | tee windows.cmdline.log
└─$ cat windows.cmdline.log | grep 'Users'
3728	notepad.exe	notepad  C:\Users\training\Desktop\SecreetDocumen7.txt
1260	DumpIt.exe	"C:\Users\training\Desktop\DumpIt.exe"
```

> Flag 2: `SecreetDocumen7.txt`

## Q3 : What is content of secret document? There is a "Key"  

```bash
└─$ vol3 -f 'MemoryDump(SuNiNaTaS)' windows.filescan | tee windows.filescan.log
└─$ grep SecreetDocumen7 windows.filescan.log
0x3df2ddd8      \Users\training\Desktop\SecreetDocumen7.txt 128
0x3f775c80      \Users\training\AppData\Roaming\Microsoft\Windows\Recent\SecreetDocumen7.lnk    128

└─$ vol3 -o ./out -f 'MemoryDump(SuNiNaTaS)' windows.dumpfiles --physaddr 0x3df2ddd8
Volatility 3 Framework 2.7.0
Progress:  100.00               PDB scanning finished
Cache   FileObject      FileName        Result

DataSectionObject       0x3df2ddd8      SecreetDocumen7.txt file.0x3df2ddd8.0x85d7d150.DataSectionObject.SecreetDocumen7.txt.dat

└─$ cat ./out/file.0x3df2ddd8.0x85d7d150.DataSectionObject.SecreetDocumen7.txt.dat
Hello, Nice to meet you.
Do you wanna get a Key?
Here is the Key you want.
Key is "4rmy_4irforce_N4vy" 
```

> Flag 3: `4rmy_4irforce_N4vy`

## Flag 

```python
from hashlib import md5

flags = [
    '192.168.197.138',
    'SecreetDocumen7.txt',
    '4rmy_4irforce_N4vy'
]

# 192.168.197.138SecreetDocumen7.txt4rmy_4irforce_N4vy
flag = ''.join(flags)

# Auth Key = lowercase(MD5(Answer of Q1+Answer of Q2+Key of Q3))
print(md5(flag.encode()).hexdigest())
```

::: tip Flag
`c152e3fb5a6882563231b00f21a8ed5f`
:::

