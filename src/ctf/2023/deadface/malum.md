# Malum

![malum-1](/assets/ctf/deadface/malum-1.jpg)

## Description

Created by: **RP-01?**

Well, it happened. The ransomware event took us out but we are recovering. It's Tuesday now and time to head into the office. As you arrive your boss walks into the SOC with a sigh and look right to you; here we go. He drops a USB on your desk and says "I need you to go through all the logs to find out HOW these guys got valid credentials to attack us". Can you identify the threat vector that was used to gain persistence into the network by reading through security logs? What you find will be the flag.

Submit the flag as  `flag{flagText}`

[Download File](https://tinyurl.com/yj8wr4dh)  
SHA1:  `557c6ea508dd7ca7891fb254e5d137a7786fcc4e`

## Solution

I used `Event Viewer` on my Windows machine to open the logs.

`Event Viewer -> Open -> Open Saved Log...`

![malum-2](/assets/ctf/deadface/malum-2.png)

After browsing the events you should notice some failed logon attempts, specifically event by id [4625](https://learn.microsoft.com/en-us/windows/security/threat-protection/auditing/event-4625).

`Filter Current Log... -> 4625 (in <All Event IDs>)`

![malum-3](/assets/ctf/deadface/malum-3.png)

One of the account names are suspicious so I tried subimitting it as a flag.
::: tip Flag
`flag{stabBingStabber1}`
:::

## Note

Some people mentioned using [python-evtx](https://github.com/williballenthin/python-evtx) to read Event Logs without Windows.