# Level 17   QRCode

[http://suninatas.com/challenge/web17/web17.asp](http://suninatas.com/challenge/web17/web17.asp)

![level-17---qrcode.png](/assets/ctf/suninatas/misc/level-17-qrcode.png)

As a forensic analyst, one of the key features that makes QR codes recoverable, even when partially damaged, is their built-in **error correction**, based on the **Reed-Solomon algorithm**. This allows the code to remain scannable even if significant portions are missing, blurred, or obstructed.

Depending on the error correction level used in the QR code (L, M, Q, or H), up to **30% of the data can be reconstructed** without access to the missing pieces. This makes it possible to extract usable content from **incomplete screenshots, low-resolution video stills, or even partially redacted images**.

In practical terms, this means that during forensic analysis, you don’t need the full QR code to attempt a recovery. With just one or two visible finder patterns and enough surviving data cells, decoding libraries can often reconstruct the original content. Tools like `zbar`, `zxing`, or OpenCV-based decoders will leverage this error correction automatically during scanning.

This robustness is a double-edged sword: it helps during recovery, but it also means QR codes can contain useful evidence even when they appear too degraded at first glance.

Use something like Photoshop or [https://www.photopea.com](https://www.photopea.com)

![level-17---qrcode-1.png](/assets/ctf/suninatas/misc/level-17-qrcode-1.png)

Then do your best to recover the black pixels from smudged red

![level-17---qrcode-2.png](/assets/ctf/suninatas/misc/level-17-qrcode-2.png)

[https://qrcode-decoder.com](https://qrcode-decoder.com)

![level-17---qrcode-3.png](/assets/ctf/suninatas/misc/level-17-qrcode-3.png)

```
Good Job! Congraturation! AuthKey is YouAreQRCodeMaster~!
```

::: tip Flag
`YouAreQRCodeMaster~!`
:::

