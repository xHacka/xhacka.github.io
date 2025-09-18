# Free Utilities

## Description

Everyone loves free utilities, don't you? Can you bypass the payment and read other people's bills instead?

## Solution

![Free Utilities.png](/assets/ctf/idex.ctf.ae/free-utilities.png)

`/login` to login
`/register` to register

> Creds: `test02@ctf.ae:test02@ctf.ae`

Only working route is `/pay_fees`

![Free Utilities-1.png](/assets/ctf/idex.ctf.ae/free-utilities-1.png)

![Free Utilities-2.png](/assets/ctf/idex.ctf.ae/free-utilities-2.png)

We are supposed to pay $10k, but we only have $0. Temper with the request and change amount to negative. Now our account has enough money to pay fees.

![Free Utilities-3.png](/assets/ctf/idex.ctf.ae/free-utilities-3.png)

Giving us money yields no result of flag.

We are redirected to `/checkout/<id:int>` to see the receipt, but also not much.

Tempering with IDOR `/checkout/0` we get the flag

![Free Utilities-4.png](/assets/ctf/idex.ctf.ae/free-utilities-4.png)

> Flag: `flag{xOkSO52gXsC2ROhZlylpvYEN1SaUJwgm}`

