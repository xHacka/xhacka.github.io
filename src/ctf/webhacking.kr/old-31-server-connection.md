# Old 31    Server Connection

URL: [https://webhacking.kr/challenge/web-16/?server=MY_PULBIC_IP](https://webhacking.kr/challenge/web-16/?server=MY_PULBIC_IP)

![old-31-1.png](/assets/ctf/webhacking.kr/old-31-1.png)

The challenge connects to us on open port and gives us the flag. 

Setup port forwarding:

![old-31.png](/assets/ctf/webhacking.kr/old-31.png)

```powershell
➜ ncat -lvnp 4444
Ncat: Version 7.92 ( https://nmap.org/ncat )
Ncat: Listening on :::4444
Ncat: Listening on 0.0.0.0:4444
Ncat: Connection from 202.182.106.159.
Ncat: Connection from 202.182.106.159:33442.
GET /FLAG{i_have_a_big_and_beautiful_server} HTTP/1.0
Host: your_ip
```

---

Alternatively you could have used `ngrok` since we are allowed to specify the server IP.

![old-31-2.png](/assets/ctf/webhacking.kr/old-31-2.png)