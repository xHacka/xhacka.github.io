# Tin Baloon

## Tin Balloon 

Created by: **Shamel**

We've discovered that DEADFACE was somehow able to extract a fair amount of data from Techno Global Research Industries. We are still working out the details, but we believe they crafted custom malware to gain access to one of TGRI's systems. We intercepted a Word document that we believe mentions the name of the malware, in addition to an audio file that was part of the same conversation. We're not sure what the link is between the two files, but I'm sure you can figure it out!

Submit the flag as:  `flag{executable_name}`. Example:  `flag{malware.exe}`.

[Download ZIP](https://tinyurl.com/y2wcd4wv)  
SHA1:  `19d82c3dc14b342c3e3bd1e5761378ab821475e4`

## Solution 

Zip file has 2 files, audio and word document. Word document is password protected so there must be password in the audio.

The audio file is just some music file. If something is hidden then its inside the wav. Using `sonic-visualizer` I opened the audio and used `Spectogram` (`Layer -> Add Spectogram -> All Layers`)

Somewhere in the middle you should find some kind of text:

![tin-balloon-1](/assets/ctf/deadface/tin-balloon-1.png)
::: info :information_source:
Password: `Gr33dK1Lzz@11Wh0Per5u3`
:::

Open the protected word document with password.

![tin-balloon-2](/assets/ctf/deadface/tin-balloon-2.png)
::: tip Flag
`flag{Wh1t3_N01Z3.exe}`
:::
