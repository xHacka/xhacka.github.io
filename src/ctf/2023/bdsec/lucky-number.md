# Lucky Number


## Lucky Number

### Description

Find the lucky number and get your rewards :D

**Download Link :**  [lucky_number.run](https://drive.google.com/file/d/126sZgvZd0k5WQhAQW7hwftL7oyv5DVEM/view?usp=sharing)

**MD5 of the file :**  4fc64afc55f6aac260254cf4ef944ed0

**Flag Format :**  BDSEC{lucky_number_here}

**Example Flag :**  BDSEC{2023}

_**Author : NomanProdhan**_

### Solution

After opening file in ghidra and navigating to main function we get pseudo code:
```c
  ...
  printf("Enter a number to check if its a lucky number: ");
  scanf("%llu",&userInput);
  userInput = reverseNumber(userInput);
  luckyNumberGen(&luckyNumber);
  if (luckyNumber == userInput) {
    puts("Wow ! You guessed the lucky number.");
    puts("Now submit the lucky number to get your points");
  }
  else {
    puts("Damn ! You are unlucky like me :( ");
  }
  ...
```

I already renamed the functions and variables. First function `reverseNumber` is a standard for loop which reverses the number mathematically. [reading](https://www.programiz.com/c-programming/examples/reverse-number)

```c
long reverseNumber(ulong param_1) {
  ulong i;
  long result;
  
  result = 0;
  for (i = param_1; i != 0; i = i / 10) {
    result = result * 10 + i % 10;
  }
  return result;
}
```

Replicate `luckyNumberGen`:

```py
def luckyNumberGen():
    x = 0
    y = 1
    result = 0
    for _ in range(50):
        result += x
        x, y = y, y + x 

    return result

lucky = luckyNumberGen()
print(f"Lucky = {lucky}\nWin   = {str(lucky)[::-1]}") 
```

```bash
└─$ py ./gen_lucky.py
Lucky = 20365011073
Win   = 37011056302

└─$ ./lucky_number.run                                                                  
 _                _            _   _                 _                
| |              | |          | \ | |               | |               
| |    _   _  ___| | ___   _  |  \| |_   _ _ __ ___ | |__   ___ _ __  
| |   | | | |/ __| |/ / | | | | . ` | | | | '_ ` _ \| '_ \ / _ \ '__| 
| |___| |_| | (__|   <| |_| | | |\  | |_| | | | | | | |_) |  __/ |    
\_____/\__,_|\___|_|\_\__, | \_| \_/\__,_|_| |_| |_|_.__/ \___|_|    
                        __/ |                                         
                       |___/                                          
 
Enter a number to check if its a lucky number: 37011056302
Wow ! You guessed the lucky number.
Now submit the lucky number to get your points
```
::: tip Flag
`BDSEC{37011056302}`
:::