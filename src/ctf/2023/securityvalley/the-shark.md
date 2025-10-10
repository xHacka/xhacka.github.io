# The Shark

## Description

Level: 1 Score 5 Category network

There is pcapng file. Can you reveal the authentication credentials?

**Link:** [SecurityValley/PublicCTFChallenges/network/the_shark](https://github.com/SecurityValley/PublicCTFChallenges/tree/master/network/the_shark)

## Analysis

We are given file with a small network traffic which can be opened using [Wireshark](https://www.wireshark.org/)

## Solution

Traffic is relatively small, so if we follow the first packet we can learn more about the conversation.
![the-shark-1](/assets/ctf/securityvalley/the-shark-1.png)
```http
GET /api/v1/auth HTTP/1.1
Authorization: Basic c2VjdmFsOlNlY1ZhbHs4NDVJYzR1N2hfaTVfNVVQM1JfNWhJN30=
User-Agent: PostmanRuntime/7.26.8
Accept: */*
Postman-Token: 4a8745d5-69b5-4024-97c6-e4058a6bc3bd
Host: localhost:7777
Accept-Encoding: gzip, deflate, br
Connection: keep-alive
```

```sh
# Decode basic authorization
└─$ echo -n 'c2VjdmFsOlNlY1ZhbHs4NDVJYzR1N2hfaTVfNVVQM1JfNWhJN30=' | base64 -d 
secval:SecVal{REDACTED} 
```

