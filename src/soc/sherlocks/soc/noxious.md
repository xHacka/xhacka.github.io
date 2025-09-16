# Noxious

## Scenario

The IDS device alerted us to a possible rogue device in the internal Active Directory network. The Intrusion Detection System also indicated signs of LLMNR traffic, which is unusual. It is suspected that an LLMNR poisoning attack occurred. The LLMNR traffic was directed towards Forela-WKstn002, which has the IP address 172.17.79.136. A limited packet capture from the surrounding time is provided to you, our Network Forensics expert. Since this occurred in the Active Directory VLAN, it is suggested that we perform network threat hunting with the Active Directory attack vector in mind, specifically focusing on LLMNR poisoning.
## Files

We are given quite a huge pcap capture file.
```bash
└─$ 7z l noxious.zip

   Date      Time    Attr         Size   Compressed  Name
------------------- ----- ------------ ------------  ------------------------
2024-06-24 07:44:14 ....A    137211904    135790375  capture.pcap
------------------- ----- ------------ ------------  ------------------------
2024-06-24 07:44:14          137211904    135790375  1 files

└─$ 7z x noxious.zip -P'hacktheblue'
└─$ ls -lah
Permissions Size User Date Modified Name
.rwxrwx---  137M root 24 Jun 07:44  capture.pcap
.rwxrwx---  136M root 27 Aug 08:59  noxious.zip
```

## Tasks

### Task 1. Its suspected by the security team that there was a rogue device in Forela's internal network running responder tool to perform an LLMNR Poisoning attack. Please find the malicious IP Address of the machine.  

[HackTheBox: LLMNR poisoning attack detection](https://www.hackthebox.com/blog/llmnr-poisoning-attack-detection)

First we should filter for `LLMNR` protocol, which is a service like DNS, but for IPv4 and IPv6 addresses on local network.

![Writeup.png](/assets/soc/sherlocks/noxious/Writeup.png)

Some user on network made a request to `DCC01`, which was probably a typo for `DC01`. Since DNS failed, LLMNR queries were issues. Everything seems fine until another IP on the network also responds to these queries.

We can confirm the malicious actors IP address to be `172.17.79.135` by DHCP request, hostname field.

![Writeup-1.png](/assets/soc/sherlocks/noxious/Writeup-1.png)

::: tip :bulb: Answer
`172.17.79.135`
:::

### Task 2. What is the hostname of the rogue machine?  

::: tip :bulb: Answer
`kali`
:::

### Task 3. Now we need to confirm whether the attacker captured the user's hash and it is crackable!! What is the username whose hash was captured?  

Because we know that Responder is being used and most common target is SMB shares we can filter for that.

![Writeup-2.png](/assets/soc/sherlocks/noxious/Writeup-2.png)

Authentication requests for `FORELA\john.deacon` can be observed. 

_By default we cannot see the IPs, so to view that go to View > Name resolution and enable Resolve Network Addresses. This will now display hostnames._ DCC01 is Kali machine as it doesn't actually exist, but Kali machine responded to that query.

`ntlmssp` is the protocol that holds all NTLM authentication requests/responses. 

![Writeup-3.png](/assets/soc/sherlocks/noxious/Writeup-3.png)

**[NTLMRawUnHide](https://github.com/mlgualtieri/NTLMRawUnHide)** tool can be used to extract the NTLM hashes from pcap.

```powershell
➜ py \NTLMRawUnHide.py -i .\ntlm.pcap

Searching .\ntlm.pcap for NTLMv2 hashes...

Found NTLMSSP Message Type 1 : Negotiation

Found NTLMSSP Message Type 2 : Challenge
    > Server Challenge       : 601019d191f054f1 

Found NTLMSSP Message Type 3 : Authentication
    > Domain                 : FORELA 
    > Username               : john.deacon 
    > Workstation            : FORELA-WKSTN002 

NTLMv2 Hash recovered:
john.deacon::FORELA:601019d191f054f1:c0cc803a6d9fb5a9082253a04dbd4cd4:010100000000000080e4d59406c6da01cc3dcfc0de9b5f2600000000020008004e0042004600590001001e00570049004e002d00360036004100530035004c003100470052005700540004003400570049004e002d00360036004100530035004c00310047005200570054002e004e004200460059002e004c004f00430041004c00030014004e004200460059002e004c004f00430041004c00050014004e004200460059002e004c004f00430041004c000700080080e4d59406c6da0106000400020000000800300030000000000000000000000000200000eb2ecbc5200a40b89ad5831abf821f4f20a2c7f352283a35600377e1f294f1c90a001000000000000000000000000000000000000900140063006900660073002f00440043004300300031000000000000000000
```

There are multiple hashes, but all resolve to same password because different challenges server sends.

```powershell
➜ .\hashcat.exe -a 0 -m 5600 .\hashes .\rockyou.txt
...
JOHN.DEACON::FORELA:2faeeb3264962720:d6db5b50a84de5c2ff8e2e455875d000:01010000000.....000000000000000:NotMyPassword0k?
...
```

The intercepted hash is crackable!

::: tip :bulb: Answer
`john.deacon`
:::

### Task 4. In NTLM traffic we can see that the victim credentials were relayed multiple times to the attacker's machine. When were the hashes captured the First time?  

_Go to View > Time display format > UTC DATE. Now the time column will show the time in UTC format._

![Writeup-4.png](/assets/soc/sherlocks/noxious/Writeup-4.png)

::: tip :bulb: Answer
`2024-06-24 11:18:30`
:::

### Task 5. What was the typo made by the victim when navigating to the file share that caused his credentials to be leaked?  

  ::: tip :bulb: Answer
`DCC01`
:::

### Task 6. To get the actual credentials of the victim user we need to stitch together multiple values from the NTLM negotiation packets. What is the NTLM server challenge value?  

We already found necessary information in [[Labs/HackTheBox/Sherlocks/SOC/Noxious/Writeup#Task 3. Now we need to confirm whether the attacker captured the user's hash and it is crackable!! What is the username whose hash was captured?|Task3]]

  ::: tip :bulb: Answer
`601019d191f054f1`
:::

### Task 7. Now doing something similar find the NTProofStr value.  

We already found necessary information in [[Labs/HackTheBox/Sherlocks/SOC/Noxious/Writeup#Task 3. Now we need to confirm whether the attacker captured the user's hash and it is crackable!! What is the username whose hash was captured?|Task3]]

::: tip :bulb: Answer
`c0cc803a6d9fb5a9082253a04dbd4cd4`
:::

### Task 8. To test the password complexity, try recovering the password from the information found from packet capture. This is a crucial step as this way we can find whether the attacker was able to crack this and how quickly.  

::: tip :bulb: Answer
`NotMyPassword0k?`
:::

### Task 9. Just to get more context surrounding the incident, what is the actual file share that the victim was trying to navigate to?

We can filter smb for connection requests and the odd one out is `\\DC01\DC-Confidential` as users mostly don't connect to `IPC$` shares.

![Writeup-5.png](/assets/soc/sherlocks/noxious/Writeup-5.png)

::: tip :bulb: Answer
`\\DC01\DC-Confidential`
:::

