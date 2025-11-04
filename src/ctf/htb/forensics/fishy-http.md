# Forensics

## Description

I found a suspicious program on my computer making HTTP requests to a web server. Please review the provided traffic capture and executable file for analysis. (Note: Flag has two parts)

## Files

```bash
➜ 7z l '.\Fishy HTTP.zip'

7-Zip 22.01 (x64) : Copyright (c) 1999-2022 Igor Pavlov : 2022-07-15
 
   Date      Time    Attr         Size   Compressed  Name
------------------- ----- ------------ ------------  ------------------------
2024-05-07 11:23:07 .....     67515744     29593550  smphost.exe
2024-05-07 13:42:42 .....        81484        25365  sustraffic.pcapng
------------------- ----- ------------ ------------  ------------------------
2024-05-07 13:42:42           67597228     29618915  2 files

➜ 7z x '.\Fishy HTTP.zip' -o"FishyHTTP" -p"hackthebox"
```

```bash
└─$ file smphost.exe
smphost.exe: PE32+ executable (console) x86-64, for MS Windows, 10 sections
```

## Solution

If we run `strings` on the file we can notice C# like objects, [dnSpy](https://github.com/dnSpy/dnSpy) is my goto tool for C# decompilation but it didn't work this time, so I used [ILSpy](https://github.com/icsharpcode/ILSpy):

![fishy-http.png](/assets/ctf/htb/forensics/fishy-http.png)

It has 2 main functions about traffic, decode and encode:
```cs
static string DecodeData(string data) {
	StringBuilder stringBuilder2 = new StringBuilder();
	string[] array4 = new Regex("<body>(.*?)</body>", RegexOptions.Singleline).Match(data).Groups[1].Value.Split(new string[1] { Environment.NewLine }, StringSplitOptions.RemoveEmptyEntries);
	foreach (Match item in new Regex("<(\\w+)[\\s>]", RegexOptions.Singleline).Matches(array4[0])) {
		if (item.Success) {
			GroupCollection groups = item.Groups;
			if (groups[1].Value != "li") {
				stringBuilder2.Append(tagHex[groups[1].Value]);
			}
		}
	}
	return HexStringToBytes(stringBuilder2.ToString());
}
```

Traffic which needs to be decoded looks like this:

![fishy-http-1.png](/assets/ctf/htb/forensics/fishy-http-1.png)

Basically code parses all tags and maps tag names to values from dictionary:

![fishy-http-2.png](/assets/ctf/htb/forensics/fishy-http-2.png)

---

Encoded data looks like:

![fishy-http-3.png](/assets/ctf/htb/forensics/fishy-http-3.png)

Code that does encoding:
```cs
string EncodeData(string data) {
	string text3 = Convert.ToBase64String(Encoding.UTF8.GetBytes(data));
	StringBuilder stringBuilder = new StringBuilder();
	Random random = new Random();
	string text4 = text3;
	for (int j = 0; j < text4.Length; j++) {
		char value3 = text4[j];
		if (wordsDict.ContainsKey(value3.ToString().ToLower())) {
			string value4 = wordsDict[value3.ToString().ToLower()][random.Next(0, 10)];
			stringBuilder.Append(value3);
			stringBuilder.Append(value4);
			stringBuilder.Append(" ");
		} else {
			stringBuilder.Append(value3);
			stringBuilder.Append(" ");
		}
	}
	return stringBuilder.ToString();
}
```

TLDR is that program extends base64 string into weird combinations of words and digits.

Extract the http traffic info file:
```powershell
➜ tshark.exe -r .\sustraffic.pcapng -T json -Y 'data-text-lines' | jq '.[]._source.layers.http.\"http.file_data\"' > t.html
```

Decode the traffic:
```python
from bs4 import BeautifulSoup as BS
from base64 import b64decode as bd

tag_hex = { # tagHex variale 
    "cite": "0",
    "h1": "1",
    "p": "2",
    "a": "3",
    "img": "4",
    "ul": "5",
    "ol": "6",
    "button": "7",
    "div": "8",
    "span": "9",
    "label": "a",
    "textarea": "b",
    "nav": "c",
    "b": "d",
    "i": "e",
    "blockquote": "f"
}


def decode_base64(words):
    encoded = ''
    for word in words:
        if word.isdigit(): encoded += word
        else:              encoded += word[0]

    return bd(encoded).decode()


def decode(html):
    result = ''
    for tag in BS(html, 'html.parser').find_all(True):
        result += tag_hex.get(tag.name, '')

    if result:
        return bytes.fromhex(result).decode()

    text = html.split('feedback: ')[1]
    return decode_base64(text.split())


with open('./t.html') as f:
    for line in f:
        contents = line[1:-2].replace(':', '')
        line = bytes.fromhex(contents).decode()
        line = decode(line)
        print(line)
```

```log
➜ py .\t.py
whoami
windows-instanc\pakcyberbot

systeminfo
...
dir && cd \Users\pakcyberbot\Documents\ && type HTB{Th4ts_d07n37_
 Volume in drive C has no label.
 Volume Serial Number is A079-ADFB

 Directory of C:\Temp

05/07/2024  09:22 AM    <DIR>          .
05/07/2024  09:22 AM    <DIR>          ..
05/07/2024  07:23 AM        67,515,744 smphost.exe
               1 File(s)     67,515,744 bytes
               2 Dir(s)  29,638,520,832 bytes free
'h77P_s73417hy_revSHELL}'

dir && cd \Users\pakcyberbot && echo 'you are hacked' > notes.txt
 Volume in drive C has no label.
 Volume Serial Number is A079-ADFB

 Directory of C:\Temp

05/07/2024  09:22 AM    <DIR>          .
05/07/2024  09:22 AM    <DIR>          ..
05/07/2024  07:23 AM        67,515,744 smphost.exe
               1 File(s)     67,515,744 bytes
               2 Dir(s)  29,638,385,664 bytes free
```

> Flag: `HTB{Th4ts_d07n37_h77P_s73417hy_revSHELL}`

