# Here's my Hamsta 

## Description

Here's my Hamsta | 50 points | By `Andrew`

I forgot the flag, yet, somehow my hamster remembers it. The further he runs, the more of the flag is revealed!

I did my best to add limits to prevent him from getting tired out and revealing the flag, hopefully there's no bugs

Netcat Links: `nc challs.bcactf.com 30435`

## Analysis

`Awesome, (1 <= 11) is true, so my hamster's ready to run!`
Program limits input up to 11 (positive number)

Entering `0` gives no flag, so the condition must be checking if input becomes 0 and each "run" decrements input by 1.

## Solution

I tried negative input `-1` and flag kept coming.

```sh
➜ ncat challs.bcactf.com 30435
...
Hi there. This is my my hamster. He LOVES to run.
The further he runs, the more of the flag you get
How many miles do you want him to run? -1          # Input
...
Flag is: bcactf{w3lcom3_TT0_PWN;__h4mster_8e9d89a}
```
<small>Note: use `ncat` on Windows (requires install), `nc` on Linux</small>