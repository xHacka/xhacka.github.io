# Level 8

## Solution

```bash
hacka@Level8:~$ resources
who.png
hacka@Level8:~$ open who.png
Loading image...
```

![level-8-who.png](/assets/ctf/promptriddle/level-8-who.png)

The image doesn't contain any metadata, can be checked with [Exiftool](https://www.kali.org/tools/libimage-exiftool-perl/).<br>
Using Google Reverse Image Lookup we can try to find the source of image. I ended up on [The History of Email](https://www.historyofemail.com).

```bash
hacka@Level8:~$ password Shiva Ayyadurai [CREATOR]
Verifying password...Yeah, thats me... However, my name does not matter. What I did does.
hacka@Level8:~$ password email [OF_WHAT]
Verifying password...Yeah, thats what I did, now what?
```


::: details Hints
1. [subject].html
:::

```bash
hacka@Level8:~$ password cyber [HTML]
Verifying password...Sure, that's the subject
```

If you notice we have extra tab, Contact Us. We can use the form to send an email to us with following fields:

![level-8-1.png](/assets/ctf/promptriddle/level-8-1.png)

As of `17.07.2024 17:26:46` the email service doesn't send an email! Another player provided me with email which should have been received:

![level-8.png](/assets/ctf/promptriddle/level-8.png)

> Password: `communication`

