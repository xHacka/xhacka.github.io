# Deep Cover  

## Description

As the Viking ship sailed across the vast North Sea, its crew encountered unexpected turbulence in the form of a message. Amidst the rugged expanse of the waters, a messenger bird descended, bearing a weather report inscribed in Cyrillic script. With furrowed brows, the Norsemen deciphered the ominous tidings, seeking the hidden meaning within.

[ciphertext.txt](https://ctf.vikesec.ca/files/4c5478cf136d054e93c9b52338c9e82c/ciphertext.txt?token=eyJ1c2VyX2lkIjo1NDcsInRlYW1faWQiOjQwNSwiZmlsZV9pZCI6NX0.Ze4Otg.Y3StsQV83L31dd4HQSztBgKRFh0)


::: details ciphertext.txt
```plaintext
** Vfyhrfz Zftkzh: Skqmkv **

Qkdzmf: ZFNYMHFN

------------------------

Qdanyx: Tfzbknq kg qakv fanbao pfgkzf skzabao hrfa mlkdnx vbhr 30 tfzmfah mryamf kg gldzzbfq. Yskdah 2 hk 4 ms. Vban dt hk 15 us/r. Lkv sbadq 9. Vban mrbll afyz sbadq 14.

Skanyx: Mlkdnx vbhr 30 tfzmfah mryamf kg gldzzbfq fyzlx ba hrf skzabao. Mlfyzbao ba hrf skzabao. Vban dt hk 15 us/r. Rbor sbadq 5. Vban mrbll sbadq 14 ba hrf skzabao yan sbadq 9 ba hrf yghfzakka.

Hdfqnyx: Qdaax. Rbor tldq 2.

Vfnafqnyx: Qdaax. Rbor tldq 4.

Hrdzqnyx: Y gfv mlkdnq. Vban pfmksbao qkdhr 30 us/r yghfz sbnaborh. Lkv sbadq 18. Vban mrbll sbadq 19 hrbq fcfabao yan sbadq 30 kcfzaborh. Zbqu kg gzkqhpbhf.

Gzbnyx: Mlkdnx. 60 tfzmfah mryamf kg lborh qakv ba hrf yghfzakka. Vban qkdhr 40 us/r odqhbao hk 60. Rbor sbadq 7. Vban mrbll sbadq 26 ba hrf skzabao yan sbadq 18 ba hrf yghfzakka.

Qyhdznyx: Rfycx qakv pfobaabao ba hrf skzabao. Yskdah 40 hk 45 ms. Vban akzhrfyqh 30 us/r cbufMHG{6d5hbao_7k_50_US_t3z_r0dz}. Hfstfzyhdzf zbqbao hk sbadq 10 px fcfabao. Vban mrbll afyz sbadq 21.
```
:::


## Solution

We kind of see the flag in the last sentence, but its in incorrect format. Rot ciphers like ROT13, ROT47 didnt work, nor vigenere nor atbash. <br>
The given cipher is really big, so the next idea was [Frequency Analysis](https://www.wikiwand.com/en/Frequency_analysis)

There's a great tool called [quipqiup](https://www.quipqiup.com) for this kind of task.




::: details decoded.txt
```plaintext
Flsx isoyvl aows isoyvl vpajwvodv suvoj. Krs Whg.
** Weather Report: Moscow ** 
Source: REDACTED 
------------------------ 
Sunday: Periods of snow ending before morning then cloudy with 30 percent chance of flurries. Amount 2 to 4 cm. Wind up to 15 km/h. Low minus 9. Wind chill near minus 14. 
Monday: Cloudy with 30 percent chance of flurries early in the morning. Clearing in the morning. Wind up to 15 km/h. High minus 5. Wind chill minus 14 in the morning and minus 9 in the afternoon. 
Tuesday: Sunny. High plus 2. 
Wednesday: Sunny. High plus 4. 
Thursday: A few clouds. Wind becoming south 30 km/h after midnight. Low minus 18. Wind chill minus 19 this evening and minus 30 overnight. Risk of frostbite. 
Friday: Cloudy. 60 percent chance of light snow in the afternoon. Wind south 40 km/h gusting to 60. High minus 7. Wind chill minus 26 in the morning and minus 18 in the afternoon. 
Saturday: Heavy snow beginning in the morning. Amount 40 to 45 cm. Wind northeast 30 km/h vikeCTF{6u5ting_7o_50_KM_p3r_h0ur}. Temperature rising to minus 10 by evening. Wind chill near minus 21.
```
:::

::: tip Flag
`vikeCTF{6u5ting_7o_50_KM_p3r_h0ur}`
:::