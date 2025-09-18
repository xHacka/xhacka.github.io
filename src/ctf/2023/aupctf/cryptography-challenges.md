# Cryptography Challenges

## Rotation

We've employed a unique technique to encode the message, one that goes beyond the traditional limits of the Caesar cipher. Keep your wits about you and explore every possible avenue - the answer may be closer than you think

Challenge: `0*%pgs8.K*H5K*#3H"N:`

### Solution

From the description we know that we are dealing with rotation ciphers. After fiddling around a lot in [CyberChef](https://gchq.github.io/CyberChef/) I found that its first ROT47 and then ROT13.

![rotation-1](/assets/ctf/aupctf/rotation-1.png)
::: tip Flag
`aupCTF{y0u-f0und-m3}`
:::

## Ancient Cipher

Meet Bob, the world's worst cryptographer. His encryption skills are so bad that his messages are basically gibberish. One time, he tried to send a secret message to his friend Alice, but it was so poorly encrypted that his dog was able to decode it. Needless to say, Bob's not winning any cryptography awards anytime soon.

Challenge: `rlgTKW{S0s'j_Sru_Tipgk0xirgyp_5b1ccj}`

### Solution

Not a classic Caesar cipher, after cycling through we get the flag.

![ancient-cipher-1](/assets/ctf/aupctf/ancient-cipher-1.png)
::: tip Flag
`aupCTF{B0b's_Bad_Crypt0graphy_5k1lls}`
:::

## Enigma

I found an old enigma machine and was messing around with it. can you decipher it

MACHINE TYPE: kriegsmarine 3 rotors
REFLECTOR: B
ROTORS: I, II, III
INITIAL POSITIONS OF THE ROTORS: X, Y, Z
POSITION OF THE ALPHABET WHEEL: A, B, C
PLUGBOARD: AT BS DE FM IR KN LZ OW PV XY
CIPHER: LXFUZLVHEJLEWZRIXIS

_remember to put the flag in format: aupCTF{answer} answer in UPPERCASE_

### Solution

Plug the given values inside [dcode](https://www.dcode.fr/enigma-machine-cipher).
::: tip Flag
`aupCTF{ENIGMAISFASCINATING}`
:::

## Disorder

Challenge: `utsa}Ts0aXa{1_eC1ngXph__XF_tmX`

### Solution

We are dealing with transposition cipher. There's a great tool for getting flag on [dcode](https://www.dcode.fr/transposition-cipher). Bruteforcing the string reveals flag in results.

`2,5,1,4,3,6	aupCTF{th1s_1s_n0t_a_game}XXXX`
::: tip Flag
`aupCTF{th1s_1s_n0t_a_game}`
:::

## RSA

Just remember, the key to success is staying calm, cool, and collected. Oh, and maybe a little bit of math.

Challenge Files: [output.txt](https://aupctf.s3.eu-north-1.amazonaws.com/output.txt) [rsa.py](https://aupctf.s3.eu-north-1.amazonaws.com/rsa.py)

### Solution

```py
from Crypto.Util.number import long_to_bytes

n = 114451512782061350994183549689132403225242966062482357218929786202609314635625168402975465116960672539381904935689924074978793017604108838426275397024126351435336388859375577638687615733448645699186377194544704879027804400841223407182597828299190404980916587708863068950664207317360099871904794302327240026597
e = 0x10001
c = 77973874950946982309998238055233832655056168217930252243355819182449120246116674359138553216317477143768434108918799869104308920311195408379262816485377057853246446992573203590942762693635615621774057306679349618708293741847308966437868706668452083656318895155238523224237514077565164105837790895618179891869
p_plus_q =  21400959789031198835597502268226110838410793429486235013163818172148759394109297013195530163943463063090162742198192075506990494863858727035693527345539878
p_minus_q =  441620610348849769847261104024471204541391170160225757260110727514761526074769013762749528928112909396341014808517549368576708910310103233373547986477636

# Step 1: Calculate p And q
p = (p_plus_q + p_minus_q) // 2
q = p_plus_q - p

# Step 2: Calculate The Private Key `d`
phi = (p - 1) * (q - 1)
d = pow(e, -1, phi)

# Step 3: Decrypt Ciphertext
m = pow(c, d, n)

# Step 4: Print Flag
print(f"Flag: {long_to_bytes(m).decode()}")
```
::: tip Flag
`aupCTF{3a5y_tw0_3quat10n5_and_hax3d_3}`
:::

## Swiss Army Knife 

Challenge: [decode.txt](https://aupctf.s3.eu-north-1.amazonaws.com/decode.txt)

### Solution

I used CyberChef to decode the chained encodings. 

The chain: `Replace: X->0 Y->1` -> `From Binary` -> `From Base64` -> `From Morse` -> `From Base32` -> `ROT13 (7) [Only Chars]`
::: tip Flag
`aupCTF{mu1tip13-3nc0d1ng5-u53d}`
:::
::: info :information_source:
Ifyou don't know which encoding is used, try [Cipher Identifier](https://www.dcode.fr/cipher-identifier).
:::

## Battista's Bet

My friend is a big fan of the famous Italian cryptographer Giovan Battista Bellaso, he has challenged me to crack this ciphertext. I have been struggling to decode it, Can you help me out

Challenge: `syrTXY{T3pnr50A0ndhD3Gv0nv}`

### Solution

_The Vigenère cipher is named after Blaise de Vigenère, although [Giovan Battista Bellaso](https://www.wikiwand.com/en/Giovan_Battista_Bellaso) had invented it before Vigenère described his autokey cipher._

Vigenère cipher is usually easy to solve, I was having trouble with dcode and couldn't find the correct key, but then I found another tool [Vigenère cipher breaker](https://planetcalc.com/7956/).

Great thing about this tool is `Show another possible solutions -> Guess Key`. Since we know that flag always starts with `aupCTF` we can possible get the key.

![battistas-bet-1](/assets/ctf/aupctf/battistas-bet-1.png)

![battistas-bet-2](/assets/ctf/aupctf/battistas-bet-2.png)
::: tip Flag
`aupCTF{B3lla50W0uldB3Pr0ud}`
:::