# Promptriddle

## Description

This is Level 6
I'm from somewhere else

> Title says: Extension

## Solution

```bash
hacka@Level6:~$ resources
coordinates.txt
hacka@Level6:~$ open coordinates.txt
Loading text document...
```

Document gives: `052 046 049 032 078 032 049 048 046 053 032 069`, which to me first seemed like [Octal Numbers](https://www.wikiwand.com/en/Octal), but after it didnt work I tried converting numbers to their [Ascii](https://www.wikiwand.com/en/Ascii) representation which finally gives us coordinates, googling the numbers gives us point of interest.

```bash
hacka@Level6:~$ password [LOCATION_OF_COORDINATES]
Verifying password...Loading level...
```