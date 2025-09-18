# You Have Mail

# You Have Mail

### Description

You Have Mail \[Forensics]

This challenge is composed of an email, more specifically a `.eml` file. The email introduces the theme for the forensics group, which is a whistleblower announcing that alien life exists on Earth, and the government knows about it.

&#x20;[URGENT\_Proof\_of\_UFO\_Read\_in\_a\_secure\_location.eml](https://ctfd.uscybergames.com/files/3679aeb619d8182d54e43d4d46b0b4fc/URGENT_Proof_of_UFO_Read_in_a_secure_location.eml?token=eyJ1c2VyX2lkIjozMDg2LCJ0ZWFtX2lkIjpudWxsLCJmaWxlX2lkIjoyMzN9.Zl4WkA.1TZtZC6zJYvhlFaz0T9YWMFmY4Y)

### Solution

The most important stuff are embeds in emails:

```bash
--000000000000cd98100617e8acef
Content-Type: application/zip; name="evidence.zip"
Content-Disposition: attachment; filename="evidence.zip"
Content-Transfer-Encoding: base64
X-Attachment-Id: f_lvx8qxe70
Content-ID: <f_lvx8qxe70>

UEsDBAoACQAAADewp1gfngtKRAAAADgAAAAMABwAZXZpZGVuY2UudHh0VVQJAAMZ6zpm6Oo6ZnV4
CwABBOgDAAAEAAAAADeIlKHufvfLJvJ/Ed32cRwF755eiG+bw1NAIL3UPKn+4WIMkSPXJInVFxLM
CrGuacbTdG6AcqrqzDiXWVhqKv6WuHlKUEsHCB+eC0pEAAAAOAAAAFBLAQIeAwoACQAAADewp1gf
ngtKRAAAADgAAAAMABgAAAAAAAEAAACkgQAAAABldmlkZW5jZS50eHRVVAUAAxnrOmZ1eAsAAQTo
AwAABAAAAABQSwUGAAAAAAEAAQBSAAAAmgAAAAAA
--000000000000cd98100617e8acef--
```

```bash
└─$ cat evidence.zip.base64 | base64 -d > evidence.zip

└─$ file evidence.zip
evidence.zip: Zip archive data, at least v1.0 to extract, compression method=store

└─$ unzip evidence.zip
Archive:  evidence.zip
[evidence.zip] evidence.txt password:
   skipping: evidence.txt            incorrect password
```

Well, the email also included the password but in hex so that's second most important piece of information from email![You Have Mail](/assets/ctf/uscybergames/you_have_mail.png)

[Recipe](https://gchq.github.io/CyberChef/#recipe=From_Hex\('Auto'\)\&input=NTMgNjUgNjMgNzUgNzIgNjUgNWYgNDMgNmYgNjQgNjUgM2ENCjRmIDcyIDY0IDY1IDcyIDVmIDM2IDM2Lg\&ieol=CRLF\&oeol=CRLF)

```bash
└─$ unzip -P 'Secure_Code:Order_66' evidence.zip
Archive:  evidence.zip
 extracting: evidence.txt

└─$ cat evidence.txt
You found the evidence!

 SIVBGR{th3_ev1d3nc3_1s_h3r3}
```

::: tip Flag
`**SIVBGR{th3\_ev1d3nc3\_1s\_h3r3}**`
:::
