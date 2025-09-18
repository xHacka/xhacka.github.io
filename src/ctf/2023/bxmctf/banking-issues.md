# Banking Issue

## Description

Author: JW

You're at the bank with your girlfriend, she's upset  
She's going off about your empty bank balance  
'Cause she doesn't get your money like I do

Unfortunately, you only have $16 left in your bank account. Feeling too poor to even sing along to Taylor Swift in the car (after all, the radio needs power, which costs money), you wonder,  _if only there was a way for me to pull off a bank heist and get a hundred thousand dollars…_

[pwn1.zip](https://ctfmgci.jonathanw.dev/dl/bxmctf2023/pwn1.zip)

## Analysis

```py
#!/usr/local/bin/python

import os

balances = [10, 20, 50, 16, 29, 52, 100000]
PERMS_ADMIN = { "MAX_INDEX": len(balances) - 1 }
PERMS_AGENT = { "MAX_INDEX": len(balances) - 2 }

def main():
    perms = PERMS_AGENT
    wallet = 0
    idx = int(input("Which account would you like to withdraw from? "))
    if idx > perms["MAX_INDEX"]:
        print("Unauthorized")
        return
    wallet += balances[idx]
    balances[idx] = 0

    print(f"You now have ${wallet} in your wallet.\n")

    if wallet >= 100000:
        print("Thanks for storing a lot of $$ at our bank.")
        print("You qualify for free wealth management services.")
        print(f"To access this service, please email {os.getenv('FLAG')}@bxmctf.bank.\n")

    print("Thank you for banking with BxMCTF Bank.")


if __name__ == "__main__":
  main()
```
The program is simple, there's possible balances we can access and permissions. Program grants us `PERMS_AGENT` meaning we cannot make a withdraw of `$100'000`, or can we? 

Index is only checked for positive numbers, but python supports negative indexing (going backwards). What will happen if we withdraw for `-1` index?

## Solution
```sh
└─$ nc <SERVER_IP> <SERVER_PORT>
Which account would you like to withdraw from? -1 # <-- Input
You now have $100000 in your wallet.

Thanks for storing a lot of $$ at our bank.
You qualify for free wealth management services.
To access this service, please email ctf{REDACTED}@bxmctf.bank.

Thank you for banking with BxMCTF Bank.
``` 