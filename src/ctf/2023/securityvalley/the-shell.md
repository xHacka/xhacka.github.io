# The Shell

## Description

Level: 1 Score 5 Category network

There is pcapng file. Can you reveal the flag ?

**Link:** [SecurityValley/PublicCTFChallenges/network/the_shell](https://github.com/SecurityValley/PublicCTFChallenges/tree/master/network/the_shell)

## Analysis 

We are given file with a small network traffic which can be opened using [Wireshark](https://www.wireshark.org/)

## Solution

Traffic is relatively small, so if we follow the first packet we can learn more about the conversation.
Packet > Follow > TCP Stream ⬇

```bash
$ cat flag.txt 
SecVal{REDACTED}
```