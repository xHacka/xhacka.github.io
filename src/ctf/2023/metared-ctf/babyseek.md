# Babyseek

## Description

No Description After CTF Ended...

## Solution

We are given simple website which functions as `Uppercase Encoder`.

![babyseek-1](/assets/ctf/metared/babyseek-1.png)

Checking what technology is used with **[Wappalyzer](https://www.wappalyzer.com)** we find it's Python, which should be a hint for possible SSTI.

![babyseek-2](/assets/ctf/metared/babyseek-2.png)

Giving a quick SSTI test:

![babyseek-3](/assets/ctf/metared/babyseek-3.png)

First lets find where flag is:

![babyseek-4](/assets/ctf/metared/babyseek-4.png)

Profit:

![babyseek-5](/assets/ctf/metared/babyseek-5.png)
::: tip Flag
`FLAG{N1C3!UR_4_B4BY!}`
:::