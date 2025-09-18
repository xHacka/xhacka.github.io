# Easy Reverse

### Description

Nothing special

Flag in format:  **grodno{text}**

[easy_reverse](https://ctf-spcs.mf.grsu.by/files/1b2ca348eace7c571d291ba3b360dd47/easy_reverse?token=eyJ1c2VyX2lkIjo2NzksInRlYW1faWQiOjM3NCwiZmlsZV9pZCI6MTQ0fQ.ZaUsFg.yvK1IDjbXYkwcH9i9i4LJCvciBE)

## Solution

Viewing the contents with `strings` reveals what seems to be flag stored as plaintext:

```bash
└─$ file easy_reverse
easy_reverse: PE32 executable (console) Intel 80386, for MS Windows, 9 sections

└─$ strings easy_reverse | bat
		 ...
 247   │ string too long
 248   │ bad cast
 249   │ Wrong
 250   │ Correct
 251   │ D0nT_st0r3_str1nGs_1n_pla1nt3xt
 252   │ Input flag:
 253   │ invalid string position
		 ...
```
::: tip Flag
`grodno{D0nT_st0r3_str1nGs_1n_pla1nt3xt}`
:::