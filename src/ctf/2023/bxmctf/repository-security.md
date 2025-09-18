# Repository Security

## Description

Author: Mani

[Supply chain attacks](https://en.wikipedia.org/wiki/SolarWinds#2019%E2%80%932020_supply_chain_attacks)?  [Code leaks](https://arstechnica.com/information-technology/2023/05/leak-of-msi-uefi-signing-keys-stokes-concerns-of-doomsday-supply-chain-attack/)? Never heard of those.

Here at Example.com, we store our entire production environment on GitHub! Our code monkeys are so talented that they would never do anything stupid that would get accounts compromised or anything like that.

[web2.zip](https://ctfmgci.jonathanw.dev/dl/bxmctf2023/web2.zip)

## Analysis

```py
   5   │ my_users = {
   6   │     "chuck":  {"password": "norris",  "roles": ["admin"]},
   7   │     "lee":    {"password": "douglas", "roles": []},
   8   │     "mary":   {"password": "jane",    "roles": []},
   9   │     "steven": {"password": "wilson",  "roles": ["admin"]},
  10   │ }
```
Looks like leaked source code contains users database.

## Solution

1. Open Instance
2. Use one of the admin's credentials
3. Visit `Secret` page for flag
```
This is secret!! You can see only because you are <admin>
the flag is ctf{REDACTED}
```