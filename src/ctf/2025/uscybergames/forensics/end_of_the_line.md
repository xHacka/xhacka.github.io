# End of The Line

## Description

SIV Pipeline Forensics Group 3

[EndOfTheLine.wav](https://ctf.uscybergames.com/files/e87372b06566b70cbcaf02a6bffd02be/EndOfTheLine.wav?token=eyJ1c2VyX2lkIjoxMDY4LCJ0ZWFtX2lkIjpudWxsLCJmaWxlX2lkIjo5fQ.aExJzA.xLt1DJZ8ZtPFpdrY_98xGoMCVt0)

## Solution

If you listen to audio it's just small and long beeps, similar to morse code (?)

Feed it to decoder: [https://morsecode.world/international/decoder/audio-decoder-expert.html](https://morsecode.world/international/decoder/audio-decoder-expert.html)

![End_of_The_Line.png](/assets/ctf/uscybergames/end_of_the_line.png)

Message looks like nothing the flag, common technique is to reverse the audio and then decode: [https://mp3cut.net/reverse-audio](https://mp3cut.net/reverse-audio)

![End_of_The_Line-1.png](/assets/ctf/uscybergames/end_of_the_line-1.png)

::: tip Flag
`SVBRG{AUDACITYROCKS}`
:::

