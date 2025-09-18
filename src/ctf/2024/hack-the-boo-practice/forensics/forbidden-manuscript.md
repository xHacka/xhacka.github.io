# Forbidden Manuscript

## Description

On the haunting night of Halloween, the website of "Shadowbrook Library"—a digital vault of forbidden and arcane manuscripts—was silently breached by an unknown entity. Though the site appears unaltered, unsettling anomalies suggest something sinister has been stolen from its cryptic depths. Ominous network traffic logs from the time of the intrusion have emerged. Your task is to delve into this data and uncover any dark secrets that were exfiltrated.

## Solution

PCAP file is given to investigate, mostly HTTP traffic.

![Forbidden Manuscript.png](/assets/ctf/htb/hack-the-boo-2024-practice/forensics/Forbidden Manuscript.png)

Usually `Data` is point of interest in this type of traffic, as it's plaintext conversation which can be observed. After following few TCP streams we find reverse shell communication. Before last command reads the flag which is in hex format.

![Forbidden Manuscript-1.png](/assets/ctf/htb/hack-the-boo-2024-practice/forensics/Forbidden Manuscript-1.png)

```bash
└─$ echo '4854427b66307262316464336e5f6d346e753563723170375f31355f316e5f3768335f77316c647d' | xxd -r -p
HTB{f0rb1dd3n_m4nu5cr1p7_15_1n_7h3_w1ld}       
```

> Flag: `HTB{f0rb1dd3n_m4nu5cr1p7_15_1n_7h3_w1ld}`

