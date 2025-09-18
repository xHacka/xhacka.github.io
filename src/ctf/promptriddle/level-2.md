# Promptriddle

## Description

This is Level 2
From now on, you can use the 'Text Reader'<br>
Use the 'resources' command to see the files you have access to<br>
Once you know the name of the file, just use the 'open' command to open it

## Solution

```bash
hacka@Level2:~$ resources
readable.txt
hacka@Level2:~$ open readable.txt
Loading text document...
```

The string first seemed to be [ROT13](https://www.wikiwand.com/en/ROT13), but after going through all shifts I wasnt able to get anything readable.<br> 
If you look carefully the text seems to be reversed, last word `eht` -> `the`. I used Python to reverse the string.

```py
>>> s='llihc ot yrt ,taht ekil leef uoy fi ,[REDACTED] :si level siht rof drowssap eht'
>>> s[::-1]
'the password for this level is: [REDACTED], if you feel like that, try to chill'
```

```bash
hacka@Level2:~$ password [REDACTED]
Verifying password...mirror
hacka@Level2:~$ password [REDACTED_REVERSED]
Verifying password...Loading level...
```