# Helpless

# Helpless

### Description

I accidentally set my system shell to the Python `help()` function! Help!!

The flag is at `/home/ductf/flag.txt`.\
The password for the `ductf` user is `ductf`.

Author: hashkitten

`ssh ductf@2023.ductf.dev -p30022`

### Solution

Python's help is using `less` command under the hood to view large files with pager.

GTFOBins -> [https://gtfobins.github.io/gtfobins/less/](https://gtfobins.github.io/gtfobins/less/)

_less /etc/profile_\
&#xNAN;_:e file\_to\_read_

1. Connect to ssh
2. Type something like `str` (or other method/class)
3. Type `:e /home/ductf/flag.txt`
4. `DUCTF{sometimes_less_is_more}`

::: tip Flag
`DUCTF{sometimes\_less\_is\_more}`
:::
