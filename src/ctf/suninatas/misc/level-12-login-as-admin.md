# Level 12   Login as Admin

[http://suninatas.com/challenge/web12/web12.asp](http://suninatas.com/challenge/web12/web12.asp)

![level-12---misc.png](/assets/ctf/suninatas/misc/level-12-misc.png)

To login as admin we will need admin panel, try the most common location: [http://suninatas.com/admin/](http://suninatas.com/admin/)

![level-12---misc-1.png](/assets/ctf/suninatas/misc/level-12-misc-1.png)

Decode: [https://qrcode-decoder.com](https://qrcode-decoder.com)

```
mecard:N:;TEL:;EMAIL:;NOTE:;URL:http://suninatas.com/admin/admlogin.asp;ADR:;
```

Flash in 2025 💀

![level-12---misc-2.png](/assets/ctf/suninatas/misc/level-12-misc-2.png)

Download [suninatas.com/admin/admlogin.swf](suninatas.com/admin/admlogin.swf)

Decompile: [https://pdfrecover.herokuapp.com/swfdecompiler/](https://pdfrecover.herokuapp.com/swfdecompiler/) and export as Scripts

`scripts/DefineButton2_9/on(release).as`:
```c
on(release) {
   function receipt() {
      if(flashid != "admin" or flashpw != "myadmin!@") {
         flashmessage = "Wrong ID or PW";
         play();
      } else {
         flashmessage = "Auth : \"Today is a Good day~~~\"";
         play();
      }
   }
   receipt();
}
```

> Flag: `Today is a Good day~~~`


