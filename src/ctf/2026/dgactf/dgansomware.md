# DGAnsomware

### Description

None, only file
- [DGAnsomware.rar](https://dgactf.com/files/05d79936ba5d5aadfc12fa23b5603957/DGAnsomware.rar?token=eyJ1c2VyX2lkIjoyMCwidGVhbV9pZCI6bnVsbCwiZmlsZV9pZCI6NX0.aXnlxg.zLBnMVTTaovywGpCLs5uCSdSyhQ)

## Solution

Once extracted we get 4 files
```bash
└─$ file *
flag.rans:        data
software:         MS Windows registry file, NT/2000 or above
system:           MS Windows registry file, NT/2000 or above
VerySafeFile.exe: PE32 executable for MS Windows 6.00 (console), Intel i386 Mono/.Net assembly, 3 sections
```

Lucky for us program is written in C# which is easy to recover source code from.

![dgansomware.png](/assets/ctf/dgactf/dgansomware.png)

```cs
// Project5, Version=0.0.0.0, Culture=neutral, PublicKeyToken=null
// CTF_Ransomware_Challenge.Program
using System;
using System.Globalization;
using System.IO;
using System.Security.Cryptography;
using System.Text;

private static void Main(string[] args) {
  string folderPath = Environment.GetFolderPath(Environment.SpecialFolder.Desktop);
  string path = Path.Combine(folderPath, "flag.txt");
  string path2 = Path.Combine(folderPath, "flag.rans");
  if (!File.Exists(path)) {
    Console.WriteLine("[-] Target 'flag.txt' not found.");
    return;
  }
  try {
    double num = new Random((int) DateTime.UtcNow.Ticks).NextDouble();
    string text = Environment.GetEnvironmentVariable("PROCESSOR_IDENTIFIER") ?? "UnknownCPU";
    string userDomainName = Environment.UserDomainName;
    string userName = Environment.UserName;
    string s = string.Format(CultureInfo.InvariantCulture, "{0}_{1}_{2}_{3}", text, userDomainName, userName, num);
    byte[] key;
    using(SHA256 sHA = SHA256.Create()) { key = sHA.ComputeHash(Encoding.UTF8.GetBytes(s)); }
    byte[] array = File.ReadAllBytes(path);
    using(Aes aes = Aes.Create()) {
      aes.Key = key;
      aes.Mode = CipherMode.CBC;
      aes.Padding = PaddingMode.PKCS7;
      aes.GenerateIV();
      byte[] iV = aes.IV;
      using ICryptoTransform cryptoTransform = aes.CreateEncryptor();
      byte[] array2 = cryptoTransform.TransformFinalBlock(array, 0, array.Length);
      using FileStream fileStream = new FileStream(path2, FileMode.Create);
      fileStream.Write(iV, 0, iV.Length);
      fileStream.Write(array2, 0, array2.Length);
    }
    File.Delete(path);
    Console.WriteLine("Your Flag Has Been Ransomed. Pay or Lose Your Data ;)");
  } catch (Exception ex) {
    Console.WriteLine("[-] Error: " + ex.Message);
  }
}
```

Get necessary values for `key`
```bash
└─$ regripper -r system -p environment | grep PROCESSOR_IDENTIFIER
Launching environment v.20200512
PROCESSOR_IDENTIFIER      Intel64 Family 6 Model 151 Stepping 2, GenuineIntel
```

```bash
└─$ regripper -r software -p profilelist
Launching profilelist v.20200518
profilelist v.20200518
(Software) Get content of ProfileList key

Microsoft\Windows NT\CurrentVersion\ProfileList

Path      : %systemroot%\system32\config\systemprofile
SID       : S-1-5-18
LastWrite : 2019-12-07 09:17:27Z

Path      : %systemroot%\ServiceProfiles\LocalService
SID       : S-1-5-19
LastWrite : 2019-12-07 09:17:27Z

Path      : %systemroot%\ServiceProfiles\NetworkService
SID       : S-1-5-20
LastWrite : 2019-12-07 09:17:27Z

Path      : C:\Users\Ransomed
SID       : S-1-5-21-2244773869-1603391100-2577093994-1000
LastWrite : 2026-01-22 09:27:20Z

Domain Accounts
```

```bash
└─$ regripper -r system -p compname
Launching compname v.20090727
compname v.20090727
(System) Gets ComputerName and Hostname values from System hive

ComputerName    = DESKTOP-A9TR5MI
TCP/IP Hostname = DESKTOP-A9TR5MI
```

```bash
└─$ stat flag.rans
  File: flag.rans
  Size: 64        	Blocks: 1          IO Block: 1048576 regular file
Device: 0,49	Inode: 121         Links: 1
Access: (0770/-rwxrwx---)  Uid: (    0/    root)   Gid: (  131/  vboxsf)
Access: 2026-01-28 05:58:32.349782100 -0500
Modify: 2026-01-27 07:39:24.095124900 -0500
Change: 2026-01-28 05:33:40.481306600 -0500
 Birth: 2026-01-28 05:33:40.475275700 -0500
```

```bash
└─$ regripper -r system -p timezone
Launching timezone v.20200518
timezone v.20200518
(System) Get TimeZoneInformation key contents

TimeZoneInformation key
ControlSet001\Control\TimeZoneInformation
LastWrite Time 2026-01-22 20:26:06Z
  DaylightName   -> @tzres.dll,-1831
  StandardName   -> @tzres.dll,-1832
  Bias           -> -180 (-3 hours)
  ActiveTimeBias -> -180 (-3 hours)
  TimeZoneKeyName-> Russian Standard Time
```

I was actively trying to not bruteforce the full INT range, but after too many unsuccessful attempts I just said F it 😠💢

::: details solver_brute.cs
```cs
using System;
using System.Globalization;
using System.IO;
using System.Security.Cryptography;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

class Program {
  static volatile bool found = false;
  static long progress = 0;

  static void Main(string[] args) {
    string path = "flag.rans";
    if (!File.Exists(path)) {
      Console.WriteLine("[-] flag.rans not found.");
      return;
    }

    byte[] data = File.ReadAllBytes(path);
    byte[] iv = new byte[16];
    byte[] ciphertext = new byte[data.Length - 16];
    Array.Copy(data, 0, iv, 0, 16);
    Array.Copy(data, 16, ciphertext, 0, ciphertext.Length);

    Console.WriteLine($"File: {data.Length} bytes (IV: 16, CT: {ciphertext.Length})");

    string cpu = "Intel64 Family 6 Model 151 Stepping 2, GenuineIntel";
    string domain = "DESKTOP-A9TR5MI";
    string user = "Ransomed";
    string prefix = cpu + "_" + domain + "_" + user + "_";

    // Full brute force of ALL 2^32 seeds
    // For each seed: try default (.NET 6), G15 (.NET FW), G17 (round-trip)
    // Print ALL padding-valid results, highlight DGA{

    Console.WriteLine($"\nFull brute-force: all 2^32 seeds, {Environment.ProcessorCount} threads");
    Console.WriteLine("Looking for DGA{ in decrypted output...\n");

    var sw = System.Diagnostics.Stopwatch.StartNew();
    long total = 4294967296 L;
    int hits = 0;

    Parallel.For(0 L, total,
      new ParallelOptions {
        MaxDegreeOfParallelism = Environment.ProcessorCount
      },
      () => new LocalState(),
      (i, loopState, local) => {
        if (found) {
          loopState.Stop();
          return local;
        }

        int seed = unchecked((int)(uint) i);
        double num = new Random(seed).NextDouble();

        // Default format (.NET 6)
        string nd = num.ToString(CultureInfo.InvariantCulture);
        if (TryKey(prefix + nd, local, iv, ciphertext, seed, "default", nd, ref hits)) {
          found = true;
          loopState.Stop();
          return local;
        }

        // G15 format (.NET Framework)
        string n15 = num.ToString("G15", CultureInfo.InvariantCulture);
        if (n15 != nd) {
          if (TryKey(prefix + n15, local, iv, ciphertext, seed, "G15", n15, ref hits)) {
            found = true;
            loopState.Stop();
            return local;
          }
        }

        // G17 format
        string n17 = num.ToString("G17", CultureInfo.InvariantCulture);
        if (n17 != nd && n17 != n15) {
          if (TryKey(prefix + n17, local, iv, ciphertext, seed, "G17", n17, ref hits)) {
            found = true;
            loopState.Stop();
            return local;
          }
        }

        long p = Interlocked.Increment(ref progress);
        if (p % 10_000_000 == 0) {
          double elapsed = sw.Elapsed.TotalSeconds;
          double speed = p / elapsed;
          double etaSec = (total - p) / speed;
          var eta = TimeSpan.FromSeconds(etaSec);
          Console.Write($"\r{p:N0} / {total:N0} ({100.0 * p / total:F2}%) | {speed:N0}/s | ETA: {eta:hh\\:mm\\:ss} | hits: {hits}    ");
        }

        return local;
      },
      local => local.Dispose()
    );

    Console.WriteLine();
    if (!found) { Console.WriteLine($"\n[-] No DGA{{ flag found. Total padding-valid hits: {hits}"); }
    Console.WriteLine($"Elapsed: {sw.Elapsed}");
  }

  static bool TryKey(string keyStr, LocalState local, byte[] iv, byte[] ciphertext,
    int seed, string fmt, string numStr, ref int hits) {
    byte[] key = local.Sha.ComputeHash(Encoding.UTF8.GetBytes(keyStr));

    local.Aes.Key = key;
    local.Aes.IV = iv;

    byte[] dec;
    using(var d = local.Aes.CreateDecryptor())
    dec = d.TransformFinalBlock(ciphertext, 0, ciphertext.Length);

    // Manual PKCS7 check
    byte pad = dec[dec.Length - 1];
    if (pad < 1 || pad > 16) return false;
    for (int i = dec.Length - pad; i < dec.Length; i++)
      if (dec[i] != pad) return false;

    int len = dec.Length - pad;
    if (len <= 0) return false;

    Interlocked.Increment(ref hits);

    // Check printability
    int ok = 0;
    for (int i = 0; i < len; i++) {
      byte b = dec[i];
      if ((b >= 32 && b <= 126) || b == 10 || b == 13 || b == 9) ok++;
    }

    string text = Encoding.UTF8.GetString(dec, 0, len);
    bool hasFlag = text.Contains("DGA{") || text.Contains("dga{");
    bool printable = (double) ok / len >= 0.75;

    if (hasFlag) {
      Console.WriteLine($"\n\n *** FLAG FOUND! ***");
      Console.WriteLine($"  Seed: {seed}  Format: {fmt}  Num: {numStr}");
      Console.WriteLine($"  Flag: {text}");
      File.WriteAllText("decrypted_flag.txt", text);
      Console.WriteLine($"  Saved to decrypted_flag.txt");
      return true;
    }

    // Also print printable hits (could be the flag in unexpected format)
    if (printable) { Console.WriteLine($"\n[printable hit] Seed: {seed} Fmt: {fmt} Text: [{text}]"); }
    
    return false;
  }

  class LocalState: IDisposable {
    public SHA256 Sha { get; }
    public Aes Aes { get; }
    public LocalState() { Sha = SHA256.Create(); Aes = Aes.Create(); Aes.Mode = CipherMode.CBC; Aes.Padding = PaddingMode.None; }
    public void Dispose() { Sha.Dispose(); Aes.Dispose(); }
  }
}
```
:::

```bash
File: 64 bytes (IV: 16, CT: 48)

Full brute-force: all 2^32 seeds, 8 threads
Looking for DGA{ in decrypted output...

800 000 000 / 4 294 967 296 (18,63%) | 213 556/s | ETA: 04:32:45 | hits: 8056389    

 *** FLAG FOUND! ***
  Seed: -436487174  Format: G15  Num: 0.74271999753207
  Flag: DGA{r4nd0m_0r_n0t_r4nd0m_th4ts_th3_qu3st10n}
  Saved to decrypted_flag.txt

Elapsed: 01:02:34.5813110
```

C:\Users\luka\Desktop\ubuntu-24.04.3-desktop-amd64.iso