# Fuzzing

## (VHost) Domain fuzzing

```bash
# HTTP
domain='domain.tld'; ffuf -u "http://$domain/" -H "Host: FUZZ.$domain" -w /usr/share/seclists/Discovery/DNS/subdomains-top1million-20000.txt -mc all -fl CHANGE_FOR_COMMON_LINE_NUMBER

# HTTPs
domain='domain.tld'; ffuf -k -u "https://$domain/" -H "Host: FUZZ.$domain" -w /usr/share/seclists/Discovery/DNS/subdomains-top1million-20000.txt -mc all -fl CHANGE_FOR_COMMON_LINE_NUMBER
```

## FeroxBuster

```bash
# HTTP
feroxbuster -u 'http://domain.tld/' -w /usr/share/seclists/Discovery/Web-Content/common.txt --thorough -n -D -C 404,403,400 -S 0,34

# HTTPs
feroxbuster -u 'https://domain.tld/' -k -w /usr/share/seclists/Discovery/Web-Content/quickhits.txt --thorough -n -D -C 404,403,400 -S 0,34
```

## Param Fuzzing

```bash
ffuf -u 'http://example.tld/?FUZZ=id' -w /usr/share/seclists/Discovery/Web-Content/burp-parameter-names.txt -mc all -fs 0
...
cmd                     [Status: 200, Size: 72, Words: 1, Lines: 1, Duration: 758ms]
...
```