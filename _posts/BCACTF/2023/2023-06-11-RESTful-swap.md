---
title: BCACTF 2023 - RESTful swap 
date: Sun Jun 11 08:36:05 PM +04 2023
categories: [Writeup]
tags: [ctf,bcactf2023,web]
---

## Description

RESTful swap | 100  points | By  `Mudasir`

I made this server that lets you read my files, except my private ones. Anything with these file extensions is not allowed: 'py', 'php', 'java', 'md', 'sh'. I'm working on adding the flag to the server, but you can still take a look around until then.

Web servers: [challs.bcactf.com:31452](http://challs.bcactf.com:31452/)

## Analysis

Website is serving simple files.
1. server.py - Can't open that
2. .vimrc - Vim configuration (nothing interesting)
	* Must be using vim as text editor.
3. hello world - Junk file

<br>

Hint in html
```html
<li style="display:none">Hidden files not shown</li>
```

## Solution

Ok, if admin is using `vim` as editor there must be a [swap file](https://www.baeldung.com/linux/vim-swap-files#:~:text=While%20editing%20a%20file%20with,copy%20of%20the%20edited%20file.)

```powershell
➜ wget http://challs.bcactf.com:31452/.server.py.swp

➜ strings -d -n 10 C:\Users\pvpga\Downloads\server.py.swp
...
flag = 'h!dDen_f!le$$!!_3bh5j7'
...
```

Flag: `bcactf{h!dDen_f!le$$!!_3bh5j7}`