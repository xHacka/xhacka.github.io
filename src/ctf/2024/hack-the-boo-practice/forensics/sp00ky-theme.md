# Sp00ky Theme

## Description

I downloaded a very nice haloween global theme for my Plasma installation and a couple of widgets! It was supposed to keep the bad spirits away while I was improving my ricing skills... Howerver, now strange things are happening and I can't figure out why...

## Solution

`PLASMOID_UPDATE_SOURCE` looks sus

![Sp00ky Theme.png](/assets/ctf/htb/sp00ky-theme.png)

```bash
└─$ echo 952MwBHNo9lb0M2X0FzX/Eycz02MoR3X5J2XkNjb3B3eCRFS | rev | base64 -d
HTB{pwn3d_by_th3m3s!?_1t_c4n_h4pp3n}
```

> Flag: `HTB{pwn3d_by_th3m3s!?_1t_c4n_h4pp3n}`

