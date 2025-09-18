# Inept Reverser

## Description

Mikhas wanted to solve the reversing problem. But instead of an answer, I received something incomprehensible.

Maybe it’s because Mikhas is a philologist?

[unknown](https://ctf-spcs.mf.grsu.by/files/dce4e47c5991063788fc482bcea73ef2/unknown?token=eyJ1c2VyX2lkIjo2NzksInRlYW1faWQiOjM3NCwiZmlsZV9pZCI6MTQzfQ.ZaUqRw.45AOes4ZtXsqbIAdg58wYpsLDRQ)

## Solution

Viewing the contents with `strings` reveals what seems to be flag:

```bash
└─$ strings unknown | bat
		 ...
  30   │ "$3*:
  31   │ }d3tr3vn1_t0N_S1_d3sr3v3r{ondorg
  32   │ dilav ton llun tcurtsnoc_M_::gnirts_cisab
  33   │ .retal uoy ees .kO
		 ...
```

Reverse the program: 

```bash
└─$ strings unknown | rev | grep grodno
grodno{r3v3rs3d_1S_N0t_1nv3rt3d}
```
::: tip Flag
`grodno{r3v3rs3d_1S_N0t_1nv3rt3d}`
:::