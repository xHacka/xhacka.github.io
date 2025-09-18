# Malicious Traffic

## Description

Level: 2 Score 20 Category network

Strange things are happening here, help! Someone stole my flag. I only remember that I clicked on a file called "ICQ_PASSWORD_CRACKER.EXE", after that everything was gone... I only know that my key was "bad". Can you repeat my flag for me?

**Link:** [SecurityValley/PublicCTFChallenges/network/malicious_traffic](https://github.com/SecurityValley/PublicCTFChallenges/tree/master/network/malicious_traffic)

## Analysis

1. We are given file with a small network traffic which can be opened using [Wireshark](https://www.wireshark.org/)
2. Main traffic seems to be DNS 
3. Using Wireshark we can filter by `dns`
4. Filtered subdomains look odd

## Solution

I used `tshark` to extract the DNS traffic and only took domains from the output
```sh
└─$ tshark -r ./traffic.pcapng -Y "dns" | awk '{ print($12) }'
4530234dsf3.cdn.aws.com
4530234dsf3.cdn.aws.com
4530234dsf3.cdn.aws.com
4530234dsf3.cdn.aws.com
0xAABgQXCRULEkwW.4530234dsf3.cdn.aws.com
EA8KFgsOPgANAQUB.4530234dsf3.cdn.aws.com
FGxu0xFF.4530234dsf3.cdn.aws.com
4530234dsf3.cdn.aws.com
4530234dsf3.cdn.aws.com
4530234dsf3.cdn.aws.com
4530234dsf3.cdn.aws.com
0xAAMQQHNAAIGSwr.4530234dsf3.cdn.aws.com
ISotLCY7ICg2Jhxp.4530234dsf3.cdn.aws.com
aA==0xFF.4530234dsf3.cdn.aws.com
4530234dsf3.cdn.aws.com
```

I used CyberChef to create proper data

Replace regex = `\.?4530234dsf3\.cdn\.aws\.com|0xAA|0xFF|\n`
![the-data-1](/assets/ctf/securityvalley/malicious-traffic-1.png)
![the-data-2](/assets/ctf/securityvalley/malicious-traffic-2.png)

The challenge requires one more step. The description mentions that `I only know that my key was "bad".`, so I tried XOR-ing the result.
![the-data-3](/assets/ctf/securityvalley/malicious-traffic-3.png)

<small>Note: Key is in `LATIN1` format</small>