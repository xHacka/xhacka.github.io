# French

## Description

Level: 2 Score 10 Category crypto

Haha, tu n'y arriveras jamais... this old french men thinks he can troll us. He sends messages and messages again. Show him that you are awesome by breaking the message. Hint: Flag content should be lowercase.

**Link:** [SecurityValley/PublicCTFChallenges/crypto/french](https://github.com/SecurityValley/PublicCTFChallenges/blob/master/crypto/french/message.txt)

## Analysis 

1. Using [dcode cipher identifier](https://www.dcode.fr/cipher-identifier) we see many possible cipher, but from the title we can guess that it's a French cipher.
2. [Vigenère_cipher](https://www.wikiwand.com/en/Vigen%C3%A8re_cipher#introduction) is most likely the candidate.

 
## Solution

We can decode the text using [dcode](https://www.dcode.fr/vigenere-cipher). The cipher needs a key which we don't know, that's not a problem since Vigenere is known to be a weak cipher. dcode has automatic decryption method.

I used a simple PowerShell commands to grab the result in correct format

```powershell
PS > Select-String -Pattern "YOUCOULDUSE(.*?)ASFLAG" decoded.txt | % { $match= $_.Matches.Groups[1].Value.ToLower(); echo "SecVal{${match}}" }
```

<small>If you don't want to write decoded content into file you could use `-InputObject "DECODED_STR"`</small>