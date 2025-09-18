# Capture Message (1)

## Description 
 
Level: 1 Score 5 Category crypto

We have captured a message. But what is the content??? Help us, please!

**Link:** [SecurityValley/PublicCTFChallenges/crypto/old_history](https://github.com/SecurityValley/PublicCTFChallenges/blob/master/crypto/old_history/message.txt)
 
## Analysis 

1. We are given encrypted message`message.txt`
2. Using [dcode cipher identifier](https://www.dcode.fr/cipher-identifier) we find that cipher is either [ROT13](https://www.wikiwand.com/en/ROT13#introduction) or [Caesar Cipher](https://www.wikiwand.com/en/Caesar_cipher#introduction)
	* Note: Ciphers are technically the same since they both use rotation as encryption.

## Solution

I used [Caesar Cipher](https://www.dcode.fr/caesar-cipher) from dcode to solve the challenge

Output gives proper readable text. Reading the text we find the flag hint.
`You can use REDACTED as flag but dont forget to format`.

Final flag would be: SecVal{REDACTED}