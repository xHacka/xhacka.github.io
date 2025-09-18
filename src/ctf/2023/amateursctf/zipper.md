# Zipper

## Description

by `flocto`

Stare into the zip and the zip stares back.

Downloads: [flag.zip](https://amateurs-prod.storage.googleapis.com/uploads/099a4db822b67c8a5f8fec4fc7e79c33b24ccd13a6c1b7c63cc0ff7aaa92ea87/flag.zip)

## Solution

We are given a zip file, first let's check metadata:

```bash
└─$ exiftool flag.zip 
...
Comment                         : So many flags... So many choices....Part 1: amateursCTF{z1PP3d_
...
Zip File Name                   : flag/
Zip File Comment                : Part 3: laY3r_0f
...
```

Nice we got 2 parts of the flag. The other parts must be somewhere in zip files.

```bash
└─$ unzip -B flag.zip # -B flag automatically renames duplicates
...

# R - Search recursively
# a - All types of files
# i - Case insensitive
# n - Display line number
└─$ grep 'part' ./flag -Rain
./flag/flag201.txt~:1:Part 4: _Zips}
```

The `Part 2` was biggest struggle. I tried using _[zgrep](https://linux.die.net/man/1/zgrep) - search possibly compressed files for a regular expression_, when I should have used _[zipgrep](https://linux.die.net/man/1/zipgrep) - search files in a ZIP archive for lines matching a pattern_.

```bash
└─$ zipgrep 'Part' flag.zip
flag/:Part 2: in5id3_4_
flag/flag201.txt:Part 4: _Zips}mUPPiWo7w9VFtbofzkCQw7OYVmPs48TCYgXBozFxaXBSl6rrnU
flag/:Part 2: in5id3_4_
flag/flag201.txt:Part 4: _Zips}mUPPiWo7w9VFtbofzkCQw7OYVmPs48TCYgXBozFxaXBSl6rrnU
```

+ [ ] Part 1: amateursCTF{z1PP3d_
+ [ ] Part 2: in5id3_4_
+ [ ] Part 3: laY3r_0f
+ [ ] Part 4: _Zips}

::: tip Flag
`amateursCTF{z1PP3d_in5id3_4_laY3r_0f_Zips}`
:::