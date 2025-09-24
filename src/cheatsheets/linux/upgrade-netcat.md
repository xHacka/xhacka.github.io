# Upgrade Netcat

1. Get PTY
	* `python3 -c 'import pty;pty.spawn("/bin/bash")'` 
		* or
	* `script /dev/null -qc /bin/bash`
2. Background the process
	* `Ctrl+Z`
3. Get your terminals rows and columns
	* `tput lines;tput cols`
4. Enter command and then press ENTER twice to bring the session back
	* `stty raw -echo;fg` 
5. For better text wrapping
	 * `stty rows <rows> cols <columns>` 
6.  To be able to use the clear command
	* `export TERM=xterm`

-

```bash
python3 -c 'import pty;pty.spawn("/bin/bash")'
script /dev/null -qc /bin/bash
---
stty raw -echo;fg;

stty rows 47 cols 211;export TERM=xterm
```

> **Note**: This doesn't work with [rlwrap](https://github.com/hanslub42/rlwrap)!

More methods: [https://book.hacktricks.wiki/en/generic-hacking/reverse-shells/full-ttys.html](https://book.hacktricks.wiki/en/generic-hacking/reverse-shells/full-ttys.html)