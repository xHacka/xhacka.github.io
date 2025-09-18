# Silent Signal

## Description

SIV Pipeline Forensics Group 4

[SilentSignal.pcap](https://ctf.uscybergames.com/files/0d72e6f28e13f1b39e89c7cbed0a8597/SilentSignal.pcap?token=eyJ1c2VyX2lkIjoxMDY4LCJ0ZWFtX2lkIjpudWxsLCJmaWxlX2lkIjo4fQ.aExD6g.9XneQtd6KRH4YLGPs7a7oTsrtG4)

## Solution

The whole traffic seems to be in ICMP or Ping requests.

![Silent_Signal.png](/assets/ctf/uscybergames/silent_signal.png)

There's 28 almost identical ping requests...

Extract with `tshark` and inspect all fields
```powershell
➜ tshark -r SilentSignal.pcap -T json > SilentSignal.json
```

The only difference is the delta time, if we convert first delta to character it's S, which is first character of flag.

![Silent_Signal-1.png](/assets/ctf/uscybergames/silent_signal-1.png)

```powershell
➜ (tshark -r SilentSignal.pcap -T fields -e frame.time_delta | % { [char][int]$_ }) -join ''
SVBRG{tim3_tr4v3l_v1a_p1ng}
```

::: tip Flag
`SVBRG{tim3_tr4v3l_v1a_p1ng}`
:::

