# Irish Repo Name


## Irish-Name-Repo 1

### Description

AUTHOR:  CHRIS HENSLER

There is a website running at  `https://jupiter.challenges.picoctf.org/problem/33850/`  ([link](https://jupiter.challenges.picoctf.org/problem/33850/)) or http://jupiter.challenges.picoctf.org:33850. Do you think you can log us in? Try to see if you can login!

### Solution

When we visit `Support` someone complains that they're getting SQL error because of `Conan O'Brien`.

![irish-name-repo-1-1](/assets/ctf/picoctf/irish-name-repo-1-1.png)

We got to `Login` page and try basic SQLi payload `' or 1=1 --` and we get in.
::: tip Flag
`picoCTF{s0m3_SQL_f8adf3fb}`
:::

## Irish-Name-Repo 2

### Description

AUTHOR: XINGYANG PAN

There is a website running at  `https://jupiter.challenges.picoctf.org/problem/64649/`  ([link](https://jupiter.challenges.picoctf.org/problem/64649/)). Someone has bypassed the login before, and now it's being strengthened. Try to see if you can still login! or http://jupiter.challenges.picoctf.org:64649

### Solution

Same payload isn't working, since `OR` is being filtered. We can try to login with `AND`. Payload `admin' AND 1=1 --`
::: tip Flag
`picoCTF{m0R3_SQL_plz_aee925db}`
:::

## Irish-Name-Repo 3

### Description

AUTHOR: XINGYANG PAN

There is a secure website running at  `https://jupiter.challenges.picoctf.org/problem/54253/`  ([link](https://jupiter.challenges.picoctf.org/problem/54253/)) or http://jupiter.challenges.picoctf.org:54253. Try to see if you can login as admin!

### Solution

Trying previous payloads doesn't work. Looking into HTML source code there's odd element.

```html
<input type="hidden" name="debug" value="0">
```

Hidden debug? I changed the value from 0 to 1 directly from Developer Tools, also you can remove `type="password"` from password input to see what you're writing.

```html
password: ' OR 1=1 --
SQL query: SELECT * FROM admin where password = '' BE 1=1 --'
```

The characters are transpositioned, OR became BE. Inspecting the difference between characters we get delimiter of 13, [ROT13](https://rot13.com)?

```powershell
➜ py
Python 3.9.5 (tags/v3.9.5:0a7dcbd, May  3 2021, 17:27:52) [MSC v.1928 64 bit (AMD64)] on win32
Type "help", "copyright", "credits" or "license" for more information.
>>> ord("O"), ord("B")
(79, 66)
>>> 79  - 66
13
>>> chr(ord("R")-13)
'E'
```

![irish-name-repo-3-1](/assets/ctf/picoctf/irish-name-repo-3-1.png)

Final payload = `' BE 1=1 --`
::: tip Flag
`picoCTF{3v3n_m0r3_SQL_7f5767f6}`
:::