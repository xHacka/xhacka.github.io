# Historical Fiction

## Description

One of the US Cyber Games administrators is an avid reader and one of the coaches suggested that she gets a book to learn more about cybersecurity. They can’t remember what the title of the book or that ISBN was but if you examine their Chrome History, you can find the flag which is the book’s ISBN number. It is important to note that they won’t buy a hard cover book or a kindle edition, just the paperback one.

_Flag Format: `SVUSCG{ISBN}`_

[Google.7z](https://ctf.uscybergames.com/files/762e7563c838a54cd8c710f412297393/Google.7z?token=eyJ1c2VyX2lkIjoxMDY4LCJ0ZWFtX2lkIjpudWxsLCJmaWxlX2lkIjo0Mn0.aE1inQ.qUx3NRFnTR6Kvlvx0yL726dQrE8)

Author: JesseV

## Solution

Get `History` database usually located in:
```swift
/Users/<username>/AppData/Local/Google/Chrome/User Data/Default/History   # Windows 
~/.config/google-chrome/Default/History                                   # Linux
```

![Historical_Fiction.png](/assets/ctf/uscybergames/historical_fiction.png)

Visit the [Amazon url](https://www.amazon.com/Hack-Back-Techniques-Hackers-Their/dp/1032818530), change to Paperback and copy ISBN-13 code. 

![Historical_Fiction-1.png](/assets/ctf/uscybergames/historical_fiction-1.png)

::: tip Flag
`SVUSCG{978-1032818535}`
:::