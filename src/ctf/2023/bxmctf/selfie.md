# Selfie

## Description

Author: clides

One day, clides secretly plugged a rubber ducky into Claudio Pacheco's laptop and gained control. While browsing through his files, he found this selfie which contains some secret information.

Can you help him find the secret information hidden in the selfie?

[foren1.zip](https://ctfmgci.jonathanw.dev/dl/bxmctf2023/foren1.zip)

## Analysis

1. `strings` has nothing interesting.
2. `Exiftool` has something odd inside
```sh
License : Y3Rme25xaUoyQnQyaVZEa2d6fQ
```

## Solution 

Licence looks like Base64, so let's decode it!
```sh
└─$ echo -n 'Y3Rme25xaUoyQnQyaVZEa2d6fQ==' | base64 -d
ctf{REDACTED} 
```
<small>Note: If you dont add `==` at the end the value will still get decoded but will throw an error</small>
