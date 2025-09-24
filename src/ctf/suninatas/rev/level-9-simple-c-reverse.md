# Level 9   Simple C Reverse

Challenge: [http://suninatas.com/challenge/web09/web09.asp](http://suninatas.com/challenge/web09/web09.asp)

![level-9---rev.png](/assets/ctf/suninatas/rev/level-9-rev.png)

```bash
└─$ curl -LOs 'http://suninatas.com/challenge/web09/SuNiNaTaS.zip'
└─$ 7z x SuNiNaTaS.zip -p'suninatas'
└─$ file Project1.exe
Project1.exe: PE32 executable (GUI) Intel 80386, for MS Windows, 8 sections
```

Since it's a `exe` file static analysis wouldn't be best solution, so I went with dynamic analysis in my Windows VM with `x32dbg`. After following the execution we see program popping up:

![level-9---rev-1.png](/assets/ctf/suninatas/rev/level-9-rev-1.png)

The windows debugger was not making sense so I left the challenge for time.

After coming back I first tried something simpler: [https://dogbolt.org/?id=197edda4-b5a7-46b9-93e6-c16085a94972#Snowman=4&RetDec=10&Reko=8&RecStudio=8&Hex-Rays=4852&Boomerang=10](https://dogbolt.org/?id=197edda4-b5a7-46b9-93e6-c16085a94972#Snowman=4&RetDec=10&Reko=8&RecStudio=8&Hex-Rays=4852&Boomerang=10)

IDA as always shows the best decompiled version of code.

Find the code for `Button Click` action (I searched for common string)

![level-9---rev-2.png](/assets/ctf/suninatas/rev/level-9-rev-2.png)

Following the `LStrCmp` variables I found what seems to be the key our input is being compared to. 

![level-9---rev-3.png](/assets/ctf/suninatas/rev/level-9-rev-3.png)

![level-9---rev-4.png](/assets/ctf/suninatas/rev/level-9-rev-4.png)

> Flag: `913465`

