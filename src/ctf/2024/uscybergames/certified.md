# Certified

# Certified

### Description

Certified

One of our machines was recently hit with malware and appears to have opened a backdoor. We were able to get this PCAP from around the time when it was accessed but aren't sure what was exfiltrated from the network. Take a look and see if you can make sense of it!

Author: [tsuto](https://github.com/jselliott)

&#x20;[certified.pcapng](https://ctfd.uscybergames.com/files/6f9d8cad46a69ec3408cc68560d9cf64/certified.pcapng?token=eyJ1c2VyX2lkIjozMDg2LCJ0ZWFtX2lkIjpudWxsLCJmaWxlX2lkIjoyODR9.ZmColQ.HGXYVsF03X7mt1rz0PWHrwvVcBk)

### Solution

Given traffic contains HTTP and HTTPs

![Certified](/assets/ctf/uscybergames/certified.png)

HTTP traffic:

```http
POST /backdoor.php HTTP/1.1
Host: localhost:8888
User-Agent: python-requests/2.28.1
Accept-Encoding: gzip, deflate, br
Accept: */*
Connection: keep-alive
Content-Length: 5410
Content-Type: multipart/form-data; boundary=6588ce418d45bf464a1ee7ed890aa03f

--6588ce418d45bf464a1ee7ed890aa03f
Content-Disposition: form-data; name="key"; filename="key.pem"

-----BEGIN RSA PRIVATE KEY-----
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
-----END RSA PRIVATE KEY-----

--6588ce418d45bf464a1ee7ed890aa03f
Content-Disposition: form-data; name="cert"; filename="cert.pem"

-----BEGIN CERTIFICATE-----
MIIFXTCCA0UCFGNVypqX5RhI+Y0aHTo1elh13R7KMA0GCSqGSIb3DQEBCwUAMGsx
CzAJBgNVBAYTAlVTMR0wGwYDVQQIDBREaXN0cmljdCBvZiBDb2x1bWJpYTETMBEG
A1UEBwwKV2FzaGluZ3RvbjEPMA0GA1UECgwGSGF4b3JzMRcwFQYDVQQDDA5sb2wu
dWdvdC5wd25lZDAeFw0yNDA0MzAwMDMxMDlaFw0yNzAxMjYwMDMxMDlaMGsxCzAJ
BgNVBAYTAlVTMR0wGwYDVQQIDBREaXN0cmljdCBvZiBDb2x1bWJpYTETMBEGA1UE
BwwKV2FzaGluZ3RvbjEPMA0GA1UECgwGSGF4b3JzMRcwFQYDVQQDDA5sb2wudWdv
dC5wd25lZDCCAiIwDQYJKoZIhvcNAQEBBQADggIPADCCAgoCggIBAMRpe2MLJG7K
sYrCsJEdqw69DB9l71T74fgO01V8eRqX5eAe4/VfmWzZlxaptVeuZv7m+bifk7Wz
XAg3q5tIxzRTHqSt4pFGxX/r13UDCglrVet3vqvA3r3Y82ZEFxyVDpyM3CUuudWh
t4IOWb+5Yvoa8OsXEWTN5AEHY9NUUZhmm83dHJ4l5iVob6KuWfz1WMPdaj3nGhyQ
HPdVpQUNlKCaBRE/yGSoWxEmBNuiAme9hwfYPUpupbECP5j0uMGraIf2ThBSrxGi
QxuxzscVRphDc2l+Oh5i7+xACLKiG6mgoj3RM34Y6ccFF+wF9gWP2Jqkq2E9f7V0
Viv5QfRv1d69Z7XQNATnPCKIsCvUKs+zE+b0TJzH+zcJHR97s47ymub1TNtW0Uwd
7wBDuAtuB0fkP4sjfxcy+yFzw/cFUOkWD/VCRxYvrNkZ8T1uWZYmir/NG9eaq7/n
/or3SCJ6U2gTw7bhcN3/zgqwmftA9rTbJ2Q7YWcB/PHhWh8HT1BbAqSigjn6zRGV
n8xym8DLFyMM0PqJQwQyhhLogtAIN/MRar8iSzRF1KnneF5MXBy75bkbarlRMHa2
tnrkFXDZMdlYpaphfPMtTAgRBXU9sWu8JAfxj6vklKxmy0Jbmaw5JEXmwurV1O5T
fv5kmj+DpOs6detOGxSMaZ6Uy8Sy7N0jAgMBAAEwDQYJKoZIhvcNAQELBQADggIB
AHuFoPzZHDNsUWBydJqDBtOgPfrSxYduYa7+/3d3onovKu/yQcuRmzu1JZ+dTyGg
+mcpfKfn4HT7LP9qYBmRkduldAqTTq7vQc6c8hjlpVMTbuBxBqZLOg6NE189Ofug
ubUrs6PXqHQ69nh6aZHfmdX4vTd23D89pTMowxM8Mh0jiz8nEchf6IuXWgc8xoCg
LuDrh2EcKsMYngGnFJWDxkzLMGCf4h78dpPiSUm3cAR5P/BWOt4iRQOEukEVpT01
d20Pd6pVZzgw4CO58X6jP8ECnKyg8gY8o6Ir6mZDhmRGjaLU81yJVoMvKsZUowVA
T7mZa6gkoZNvzWuagYmsDzhipls5NgdPtOS/mdV31x5gOY7N162Eb+0XkdIA/G3+
AXsDNQfLR7s0NZZyLnCiM5vMiKliOnUFwajiHitcl/0oQJgim0n+PTNgd4mb/mqJ
X0QdS3oF92cEQdc4VIBG6aaEYo7jwfjTVbLLKaE3wGruX9Qe2pHMhTEoj7nkCQQk
IgoSPn6SjVadnvzw97m7MdccMbspHi7JDbDbOaJQJdovMDA/oWHCdKAGMMQifQTC
zNPhRavXnukPafS6TS64KV8sZoa1NakR9ck8FvE1rT1VmEwLKb0WJFGV9pB80x3x
84XHCyKwAkZEadVJrJoyNmX+EDHz4DFwCVSL6B9lcfot
-----END CERTIFICATE-----

--6588ce418d45bf464a1ee7ed890aa03f--
HTTP/1.1 200 OK
Server: nginx
Date: Sat, 01 Jun 2024 04:02:28 GMT
Content-Type: text/plain
Content-Length: 20
Connection: keep-alive

Exploit completed...
```

We will be needing `key.pem` to decrypt TLS communication

Edit > Edit Preferences > Protocols > TLS > RSA keys list >

![Certified-1](/assets/ctf/uscybergames/certified-1.png)

::: info :information_source:
[https://help.salesforce.com/s/articleView?id=001115271\&type=1](https://help.salesforce.com/s/articleView?id=001115271\&type=1)
:::

Now follow the second HTTP stream and it should be visible as plaintext

![Certified-2](/assets/ctf/uscybergames/certified-2.png)

```http
GET / HTTP/1.1
Host: localhost:9999
User-Agent: python-requests/2.28.1
Accept-Encoding: gzip, deflate, br
Accept: */*
Connection: keep-alive

HTTP/1.1 200 OK
Server: nginx
Date: Sat, 01 Jun 2024 04:02:28 GMT
Content-Type: text/plain
Content-Length: 88
Connection: keep-alive

Agent J, here is the code you need to access the mainframe: SIVUSCG{c3rtif1abl3_h4ck3rs}
```

::: tip Flag
`**SIVUSCG{c3rtif1abl3\_h4ck3rs}**`
:::
