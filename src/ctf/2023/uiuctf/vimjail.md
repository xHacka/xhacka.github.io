# VimJail

## VimJail 1.0

### Description

Connect with `socat file:$(tty),raw,echo=0 tcp:vimjail1.chal.uiuc.tf:1337` | 50 Points | Author: richard

[Dockerfile](https://2023.uiuc.tf/files/fef8b310031a05cae5611e2690b1e56d/Dockerfile?token=eyJ1c2VyX2lkIjoxNzUyLCJ0ZWFtX2lkIjo5NTAsImZpbGVfaWQiOjkxMH0.ZKF6jw.ucl-MTrveMmeeEKpk8ISQnQHSOU)<br>
[entry.sh](https://2023.uiuc.tf/files/9ab066e6d8dc34b582242cd0ee5b54b8/entry.sh?token=eyJ1c2VyX2lkIjoxNzUyLCJ0ZWFtX2lkIjo5NTAsImZpbGVfaWQiOjkxMX0.ZKF6jw._sihBRutYWrNmQSg9heQYRysKgs)<br>
[nsjail.cfg](https://2023.uiuc.tf/files/55e629783aaddfeb0725477795ac4156/nsjail.cfg?token=eyJ1c2VyX2lkIjoxNzUyLCJ0ZWFtX2lkIjo5NTAsImZpbGVfaWQiOjkxMn0.ZKF6jw.sSXYTNHcOoSY7irNgOPlniSPKOk)<br>
[vimrc](https://2023.uiuc.tf/files/73a3a3658313279c33f2fc69b50c45cf/vimrc?token=eyJ1c2VyX2lkIjoxNzUyLCJ0ZWFtX2lkIjo5NTAsImZpbGVfaWQiOjkxM30.ZKF6jw.uUPuGztmaMtDp54Qc0q9w6krNcY)

### Analysis

Entry file removed read access from flag and runs vim with following options:
    * -R: Opens Vim in read-only mode, preventing accidental modifications to files.
    * -M: Starts Vim in "modifiable" mode, allowing editing of text.
    * -Z: Restores the terminal's original screen contents upon exiting Vim.
    * -u /home/user/vimrc: Specifies a custom vimrc file (/home/user/vimrc) to use for Vim's configuration.
    
```bash
#!/usr/bin/env sh

chmod -r /flag.txt

vim -R -M -Z -u /home/user/vimrc
```

vimrc

```bash
# This command disables Vim's compatibility mode, ensuring that Vim uses its own enhanced features and behavior rather than emulating older versions of Vi.
set nocompatible
# This command sets Vim to always start in insert mode, allowing you to immediately start inserting text when opening a file.
set insertmode

# These commands define insert mode mappings for the specified key combinations:
inoremap <c-o> nope
inoremap <c-l> nope
inoremap <c-z> nope
inoremap <c-\><c-n> nope
```

### Solution

1. Escape Insert mode: `Ctrl+\` -> `Ctrl+n` -> `Ctrl+V`
    * Executing this payload was troublesome, With some delays between keys I was able to enter Visual Mode
2. Edit flag.txt -> Press `:` -> Type `:edit flag.txt`
3. Profit
::: tip Flag
`uiuctf{n0_3sc4p3_f0r_y0u_8613a322d0eb0628}`
:::

## VimJail2

Connect with `socat file:$(tty),raw,echo=0 tcp:vimjail2.chal.uiuc.tf:1337` | 50 Points | Author: richard

[Dockerfile](https://2023.uiuc.tf/files/cb580adb6d8c38488bc29a2e55912505/Dockerfile?token=eyJ1c2VyX2lkIjoxNzUyLCJ0ZWFtX2lkIjo5NTAsImZpbGVfaWQiOjkxOX0.ZKG_zA.otL6mo8_Gy7lsspIb7IAAfF3Omg)<br>
[entry.sh](https://2023.uiuc.tf/files/62b21acdeb6002bd9031cb569c43c8d4/entry.sh?token=eyJ1c2VyX2lkIjoxNzUyLCJ0ZWFtX2lkIjo5NTAsImZpbGVfaWQiOjkyMH0.ZKG_zA.mITiw7LKyAe30k5k0JjLGszzRFM)<br>
[nsjail.cfg](https://2023.uiuc.tf/files/7787cd00e0f101d9680a52caee6b142a/nsjail.cfg?token=eyJ1c2VyX2lkIjoxNzUyLCJ0ZWFtX2lkIjo5NTAsImZpbGVfaWQiOjkyMX0.ZKG_zA.h9SHRgxjp7qAKAqnUWfCSlVe_D4)<br>
[vimrc](https://2023.uiuc.tf/files/35c5ace464a7bfa666295c14a2f8a9ed/vimrc?token=eyJ1c2VyX2lkIjoxNzUyLCJ0ZWFtX2lkIjo5NTAsImZpbGVfaWQiOjkyMn0.ZKG_zA.ZYzW_7jJI8Z2em06Gd9qg4yG1w0)<br>
[viminfo](https://2023.uiuc.tf/files/bf3c336737319e16887d1b411234ae2f/viminfo?token=eyJ1c2VyX2lkIjoxNzUyLCJ0ZWFtX2lkIjo5NTAsImZpbGVfaWQiOjkyM30.ZKG_zA.dSKgc8k0C29T3jdPc0hv-G5TlOM)

### Analysis

Same vimfile, but now it converts almost any character in command line mode to `_` with the exception of `q`.

```bash
#!/usr/bin/env sh

vim -R -M -Z -u /home/user/vimrc -i /home/user/viminfo

cat /flag.txt
```

### Solution

Same trick as previous.

1. Escape Insert mode: `Ctrl+\` -> `Ctrl+n` -> `Ctrl+V`
    * Executing this payload was troublesome, With some delays between keys I was able to enter Visual Mode
2. Type `:q` to quit
3. Hit enter (If flag not printed)
3. Profit
::: tip Flag
`uiuctf{<left><left><left><left>_c364201e0d86171b}`
:::
