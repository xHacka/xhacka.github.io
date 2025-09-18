# Dizzy

## Description

By `hofill`

Embark on 'Dizzy', a carousel ride through cryptography! This warmup challenge spins you around the basics of ciphers and keys. Sharpen your mind, find the flag, and remember - in crypto, it's fun to get a little dizzy!  
  
`T4 l16 _36 510 _27 s26 _11 320 414 {6 }39 C2 T0 m28 317 y35 d31 F1 m22 g19 d38 z34 423 l15 329 c12 ;37 19 h13 _30 F5 t7 C3 325 z33 _21 h8 n18 132 k24`

## Solution

[Cipher Identifier](https://www.dcode.fr/cipher-identifier) by dCode shows that it's highly likely to be [Letters Positions](https://www.dcode.fr/letter-positions).

Decryption returns:

```
TFCCTF{th_chllng_mks_m_dzzy_;d}
```

Flag is incomplete.

```py
>>> len("T4 l16 _36 510 _27 s26 _11 320 414 {6 }39 C2 T0 m28 317 y35 d31 F1 m22 g19 d38 z34 423 l15 329 c12 ;37 19 h13 _30 F5 t7 C3 325 z33 _21 h8 n18 132 k24".split())
40
>>> len("TFCCTF{th_chllng_mks_m_dzzy_;d}")
31
```

Let's try to implement decoder ourselfves:

```py
>>> cipher = 'T4 l16 _36 510 _27 s26 _11 320 414 {6 }39 C2 T0 m28 317 y35 d31 F1 m22 g19 d38 z34 423 l15 329 c12 ;37 19 h13 _30 F5 t7 C3 325 z33 _21 h8 n18 132 k24'.split()
>>> flag = [''] * len(cipher)
>>> flag
['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '']
>>> for pair in cipher:
...     char, pos = pair[0], int(pair[1:])
...     flag[pos] = char
...
>>> ''.join(flag)
'TFCCTF{th15_ch4ll3ng3_m4k3s_m3_d1zzy_;d}'
```
::: tip Flag
`TFCCTF{th15_ch4ll3ng3_m4k3s_m3_d1zzy_;d}`
:::