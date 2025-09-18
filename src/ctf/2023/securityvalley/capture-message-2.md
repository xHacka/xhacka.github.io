# Capture Message (2)

## Description

Level: 1 Score 10 Category crypto

Hm hm hm. We have seen this before... a long time ago. But we are to stupid to crack it...help us, again! I guess the original content of this weird garbage is english. Maybe that help's you to break it! Hint: Flag content should be lowercase.

**Link:** [SecurityValley/PublicCTFChallenges/crypto/weird_but_old](https://github.com/SecurityValley/PublicCTFChallenges/blob/master/crypto/weird_but_old/message.txt)

## Analysis

1. We are given a `message.txt` which is all uppercase.
2. [dcode cipher identifier](https://www.dcode.fr/cipher-identifier) doesn't give us much.
3. Since text is large we could be dealing with [Frequency](https://www.101computing.net/frequency-analysis/) cipher.

## Solution

There's a great Cryptogram Solver online by [Edwin Olson](http://april.eecs.umich.edu/people/ebolson) called [_quipqiup_](https://quipqiup.com/)<br>
By using `statistics` solver the tool quickly generates possible results and most likely the first result is going to be what we need. 

When reading the text we come across line
```
YOU SHOULD USE {REDACTED} AS FLAG PLEASE FORMAT THE FLAG BEFORE SUBMITTINGTHERE
```

Final flag: SecVal{REDACTED_WORD_**LOWERCASE**}