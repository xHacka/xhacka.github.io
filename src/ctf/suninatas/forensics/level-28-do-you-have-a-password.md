# Level 28   Do You Have a Password

[http://suninatas.com/challenge/web28/web28.asp](http://suninatas.com/challenge/web28/web28.asp)

![level-28---do-you-have-a-password.png](/assets/ctf/suninatas/forensics/level-28-do-you-have-a-password.png)

[down](http://suninatas.com/challenge/web28/So_Simple.zip)

Every file is encrypted

![level-28---do-you-have-a-password-1.png](/assets/ctf/suninatas/forensics/level-28-do-you-have-a-password-1.png)

Encryption method is `ZipCrypto Deflate` which is known to be vulnerable to crib attacks via [bkcrack](https://github.com/kimci86/bkcrack)
```bash
└─$ 7z l -slt So_Simple.zip | grep -i -e 'Method' -e 'Encrypted'
Encrypted = +
Method = ZipCrypto Deflate
Encrypted = +
Method = ZipCrypto Deflate
Encrypted = +
Method = ZipCrypto Deflate
```

We can recover zip with this method, but not other txt files.

`bkcrack` was introduced in 2020, challenge is from 2013 so there must be simpler way.

[The structure of a PKZip file by Florian Buchholz](https://users.cs.jmu.edu/buchhofp/forensics/formats/pkzip.html) 

![level-28---do-you-have-a-password-2.png](/assets/ctf/suninatas/forensics/level-28-do-you-have-a-password-2.png)

```bash
└─$ xxd So_Simple.zip | head -1
00000000: 504b 0304 1400 0908 0800 fd78 5543 2313  PK.........xUC#.

└─$ xxd t.zip | head -1
00000000: 504b 0304 1400 0000 0800 482e db5a e687  PK........H..Z..
```

In given file the flags byte is `0908`:

| Bit   | Meaning                  | Value | Explanation                           |
| ----- | ------------------------ | ----- | ------------------------------------- |
| 0     | File is encrypted        | ✅ 1   | Encrypted (uses ZipCrypto)            |
| 1     | Compression option bit 1 | ❌ 0   | Not set                               |
| 2     | Compression option bit 2 | ❌ 0   | Not set                               |
| 3     | Data descriptor present  | ❌ 0   | CRC/size stored in central directory  |
| 4     | Enhanced deflation       | ❌ 0   | Not used                              |
| 5     | Compressed patched data  | ❌ 0   | Not used                              |
| 6     | Strong encryption        | ❌ 0   | ❌ Not AES (this would be set for AES) |
| 7     | Unused                   | ✅ 1   | Just reserved (likely benign)         |
| 8-10  | Unused                   | ❌ 0   | Not set                               |
| 11    | UTF-8 file names         | ✅ 1   | Filename is stored in UTF-8           |
| 12    | Reserved                 | ❌ 0   | Not set                               |
| 13    | Mask header values       | ❌ 0   | Not set                               |
| 14-15 | Reserved                 | ❌ 0   | Not set                               |
Changing the  bytes to `0000` removes the encryption 

![level-28---do-you-have-a-password-3.png](/assets/ctf/suninatas/forensics/level-28-do-you-have-a-password-3.png)

If you open file with Windows Zip explorer it doesn't work, however 7z was able to open the zip inside, but not key2

![level-28---do-you-have-a-password-4.png](/assets/ctf/suninatas/forensics/level-28-do-you-have-a-password-4.png)

![level-28---do-you-have-a-password-5.png](/assets/ctf/suninatas/forensics/level-28-do-you-have-a-password-5.png)

The ZIP file was marked as encrypted using ZipCrypto, indicated by bit 0 of the general purpose bit flag (`0x0809`). By flipping this flag to `0x0000` in a hex editor, we disabled the encryption flag, tricking unzip tools into extracting the raw (still encrypted) data without prompting for a password.

::: tip Flag
`dGE1dHlfSDR6M2xudXRfY29mZmVl`
:::
