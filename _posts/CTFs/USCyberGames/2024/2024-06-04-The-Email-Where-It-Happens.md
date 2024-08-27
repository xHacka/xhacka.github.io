---
title: US Cyber Games [Season 4] - The Email Where It Happens
date: Tue Jun  4 04:05:51 AM EDT 2024
categories: [Writeup]
tags: [ctf,uscybergames,uscybergames2024,forensics,dns]
---

## Description

The Email Where It Happens [Forensics]

Howdy Truth Seekers! It seems that some malware that was strategically shared has begun to phone back home! We believe that this might have some very important information that could help lead us to finally getting to the bottom of this conspiracy regarding extraterrestrial life. Unfortunately the original developer of this _tool_ was recently promoted to customer status and is no longer on good terms with the organization. This means that we don't have any information on how to decode this traffic. Unfortunately all I have is a PCAP. Can you help us out here?

 [intercepted_communication.pcap](https://ctfd.uscybergames.com/files/b694602c1b73e94e94d82977a9acbed9/intercepted_communication.pcap?token=eyJ1c2VyX2lkIjozMDg2LCJ0ZWFtX2lkIjpudWxsLCJmaWxlX2lkIjoyMzV9.Zl7IaQ.64tkN7BMN7b6N58T7YTXThmJDTw)

## Solution

The given pcap only contains dns communication. The requests are going to weird sub domains and each of them are unique:
![The Email Where It Happens](/assets/images/USCyberGames/2024/The Email Where It Happens.png)

This seems to be DNS Exfiltration attack, where DNS subdomains act as chunk of data encoded and sent to server in incremental order.

The encoding looked like Base64, but it turned out to be Base32. [cipher-identifier](https://www.dcode.fr/cipher-identifier)

```bash
└─$ tshark -r ./intercepted_communication.pcap -T fields -e dns.qry.name | cut -d'.' -f1 | base32 -d
*!*!*!*!*!*!*!*!*
INTERCEPTED ELECTRONIC MAIL COMMUNICATION
*!*!*!*!*!*!*!*!*
TO: brian.riggs@area51.cloud
FROM: illuminati@secrets.us
DATE: 5/14/2024@16:33
SUBJ: RE: CONFIRMED EXTRATERRESTRIAL LIFE
BODY:
Hello Brian,

We appreciate the information you have provided us regarding your discovery and prompt detention of extraterrestrial life on Earth. This is fantastic news and puts us in position for us to begin phase two of our plan for world domination. We understand you have stored the lifeform in the agreed upon location and set the lock to utilize the password to "SIVBGR{wh0_n33ds_32_b4s3s}". We will follow up after investigating the provided lifeform with further instructions.

Salutations,
Triangle Bois
*!*!*!*!*!*!*!*!*
END TRANSMISSION
*!*!*!*!*!*!*!*!*
```

> Flag: **SIVBGR{wh0_n33ds_32_b4s3s}**
{: .prompt-tip }