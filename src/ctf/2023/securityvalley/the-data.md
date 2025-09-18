# The Data

## Description

Level: 1 Score 10 Category network

There is pcapng file. Can you, again, reveal the flag ?

**Link:** [SecurityValley/PublicCTFChallenges/network/the_data](https://github.com/SecurityValley/PublicCTFChallenges/tree/master/network/the_data)

## Analysis

We are given file with a small network traffic which can be opened using [Wireshark](https://www.wireshark.org/)

## Solution

Traffic shows that `/flag.png` was requested
![the-data-1](/assets/ctf/securityvalley/the-data-1.png)

Wireshark allows us to view the objects from traffic.
`File > Export Objects > HTTP`

You can either `Preview` the image or `Save` and open locally
