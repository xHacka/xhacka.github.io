# Elizabeth Feinler

##  Elizabeth Feinler

[Elizabeth Jocelyn "Jake" Feinler](https://en.wikipedia.org/wiki/Elizabeth_J._Feinler)  (born March 2, 1931) is an American information scientist. From 1972 until 1989 she was director of the Network Information Systems Center at the Stanford Research Institute (SRI International). Her group operated the Network Information Center (NIC) for the ARPANET as it evolved into the Defense Data Network (DDN) and the Internet. -  [Wikipedia Entry](https://en.wikipedia.org/wiki/Elizabeth_J._Feinler)

## Description

Chal: We found this PCAP but we did not know what to name it. Return the flag to this  [Internet Hall of Famer](https://www.youtube.com/watch?v=idb-7Z3qk_o)

Author:  [Rusheel](https://github.com/Rusheelraj)

[NoName.pcap](https://cyberheroines.ctfd.io/files/34b02e792b5194a6b5755d6c0c8dc1cf/NoName.pcap?token=eyJ1c2VyX2lkIjo1ODQsInRlYW1faWQiOm51bGwsImZpbGVfaWQiOjEyfQ.ZP4ZKw.1rxYIoKwaFG6vceS_MCO4RroXyA "NoName.pcap")

## Solution

![Elizabeth-Feinler-1](/assets/ctf/cyberheroinesctf/elizabeth-feinler-1.png)

We are given a Wireshark file which only contains DNS traffic. The subdomains look like they are ASCII Code characters. 

First we need to extract the names.

"tshark" makes it easy for us, I used powershell to extract the names.

```powershell
➜ $res = "";
➜ tshark -r .\NoName.pcap -T fields -e _ws.col.Info | % {
>     $domain = $_.Split()[4]
>     $subdomain = $domain.split('.')[0]
>     $res += "$subdomain "
> };
➜ echo $res;
143 150 143 164 146 173 143 162 63 141 164 60 162 137 60 146 137 144 60 155 141 151 156 137 156 64 155 63 137 163 171 163 164 63 155 175
```

The numbers look like ASCII Codes from Base10, but after many conversions it was not it.

What if the numbers are different base? Maybe Base8 (Octal)?

```py
➜ py
Python 3.9.5 (tags/v3.9.5:0a7dcbd, May  3 2021, 17:27:52) [MSC v.1928 64 bit (AMD64)] on win32
Type "help", "copyright", "credits" or "license" for more information.
>>> "\143\150\143\164\146\173\143\162\63\141\164\60\162\137\60\146\137\144\60\155\141\151\156\137\156\64\155\63\137\163\171\163\164\63\155\175"
'chctf{cr3at0r_0f_d0main_n4m3_syst3m}'
```
::: tip Flag
`chctf{cr3at0r_0f_d0main_n4m3_syst3m}`
:::