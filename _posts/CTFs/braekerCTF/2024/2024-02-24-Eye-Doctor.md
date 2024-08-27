---
title: BraekerCTF 2024 - Eye doctor
date: Sat Feb 24 07:35:36 PM +04 2024
categories: [Writeup]
tags: [ctf,braekerctf,braekerctf2024,misc,forensics]
---

## Description

A creaky old bot is zooming in and out of an eye chart. "Can you read the bottom line?" the doctor asks. "No way, " the bot replies. "At a certain distance my view becomes convoluted. Here, I'll make a screenshot."    

You and the doctor look at the screenshot. Can you tell what's wrong with the bot's visual processor?  
  
![eye_doctor.jpeg](/assets/images/braekerctf/2024/eye_doctor.jpeg)

Challenge: [approach.png](https://braekerctf.ctfd.io/files/37b8c85b01210190d9912ea4c0650cc4/approach.png?token=eyJ1c2VyX2lkIjoxNjE5LCJ0ZWFtX2lkIjo5MDAsImZpbGVfaWQiOjY4fQ.ZdoUSg.vA4ah5Fdpu6XmAyOK6J71-Xy4kA)

## Solution

I used [29a.ch](https://29a.ch/photo-forensics/#pca), played around the settings and got this.

![settings](/assets/images/braekerctf/2024/settings.png)

![flag.jpeg](/assets/images/braekerctf/2024/flag.png)

> Flag: brck{4ppr04ch1tfr0M4D1ff3r3ntAngl3}
{: .prompt-tip }