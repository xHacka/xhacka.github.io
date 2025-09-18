# Flag+

## Description

Flag+ | 100  points | By  `Marvin`

I've been trying to find a flag on this site, but it looks like you have to pay to get it...

Web servers: [challs.bcactf.com:30313](http://challs.bcactf.com:30313/) 

## Analysis

When trying to visit `/flag.html` we get message `Looks like you clicked here from the free tier portal...`

## Solution

I used BurpSuite to inspect the requests. When `/flag.html` is requested there's interesting header.
```
Referer: http://challs.bcactf.com:30313/free.html
```
If we change it to `/paid.html` (which doesnt exist) `/flag.html` shows the flag.

Flag: `bcactf{fl4g_r3ferr3d_gn3vhx75}`