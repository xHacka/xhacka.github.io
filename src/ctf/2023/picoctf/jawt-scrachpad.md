# JaWT Scrachpad

## Description

AUTHOR:  JOHN HAMMOND

Check the admin scratchpad!  `https://jupiter.challenges.picoctf.org/problem/63090/`  or http://jupiter.challenges.picoctf.org:63090

::: info
Internal server errors can be intentionally returned by this challenge. If you experience one, try clearing your cookies.
:::

## Analysis

Our goal is to become admin and see what he has.

* _You will need to log in to access the JaWT scratchpad. You can use any name, other than `admin`... because the `admin` user gets a special scratchpad!_

We also get a hint, JohnTheRipper. To forge new JWT token we need a secret_key and john will be useful in this field.
* _If you don't like your name, use a short and cool one like [John](https://github.com/magnumripper/JohnTheRipper)!_

Our JWT token can be found in cookies. You can use tool like <https://jwt.io> to inspect tokens. Algorithm is HS256 = HMAC-SHA256.

## Solution

```bash
└─$ john --wordlist=$rockyou jwt.token --format=HMAC-SHA256
Using default input encoding: UTF-8
Loaded 1 password hash (HMAC-SHA256 [password is key, SHA256 256/256 AVX2 8x])
Will run 4 OpenMP threads
Press 'q' or Ctrl-C to abort, almost any other key for status
ilovepico        (?)     
1g 0:00:00:03 DONE (2023-07-06 15:01) 0.3215g/s 2378Kp/s 2378Kc/s 2378KC/s ilovetitor..ilovemymother@
Use the "--show" option to display all of the cracked passwords reliably
Session completed. 
```

I used same tool to forge new token with known secret key. 

![jawt-scrachpad-1](/assets/ctf/picoctf/jawt-scrachpad-1.png)

![jawt-scrachpad-2](/assets/ctf/picoctf/jawt-scrachpad-2.png)
::: tip Flag
`picoCTF{jawt_was_just_what_you_thought_f859ab2f}`
:::