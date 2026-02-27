# Chess

## Description

Move, move, move...

1. Na3 c6 2. ?

[91vAoeMa.gif](https://dgactf.com/files/958a6e5108c096de1dc4bb3095aed98a/91vAoeMa.gif?token=eyJ1c2VyX2lkIjoyMCwidGVhbV9pZCI6bnVsbCwiZmlsZV9pZCI6Mn0.aYA4zw.bjzgCSE3EVWxWOSht4gwwh8Hpps)

## Solution

First I converted the GIF to frames
```bash
└─$ mkdir frames
└─$ ffmpeg -i 91vAoeMa.gif frames/frame_%d.png
```

I tried emulating the game, but it doesn't finish

![chess.png](/assets/ctf/dgactf/chess.png)

```
# FEN
rn1q2n1/1b3kbr/p2p1p2/1PP1p2p/7p/NP2PPP1/P4BB1/QR1K2NR b - - 1 25

# PGN
1. Na3 c6 2. c4 f6 3. d3 b6 4. g3 h5 5. f3 g5 6. Be3 Rh6 7. Rb1 b5 8. h3 Ba6 9. Qc1 Rh7 10. Qc3 Rh6 11. Bf2 Kf7 12. Qc1 Rh7 13. h4 Qe8 14. Qd2 d6 15. b3 gxh4 16. Bg2 c5 17. cxb5 e6 18. Qc1 Rh6 19. e3 Qd8 20. d4 Rh7 21. dxc5 Bb7 22. Kd1 a6 23. Qc4 Bg7 24. Qc3 e5 25. Qa1
```

After looking some similar challenges on internet I came to this
- [https://incoherency.co.uk/chess-steg/](https://incoherency.co.uk/chess-steg/)

![chess-1.png](/assets/ctf/dgactf/chess-1.png)

::: tip Flag
`DGA{CH355_15_N0T_JU5T_4_G4M3}`
:::