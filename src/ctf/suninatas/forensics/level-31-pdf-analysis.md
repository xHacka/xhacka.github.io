# Level 31   PDF Analysis

[http://suninatas.com/challenge/web31/web31.asp](http://suninatas.com/challenge/web31/web31.asp)

![level-31---pdf-analysis.png](/assets/ctf/suninatas/forensics/level-31-pdf-analysis.png)

[download](http://suninatas.com/challenge/web31/Hello_SuNiNaTaS.pdf)

If opened it's just a simple page

![level-31---pdf-analysis-1.png](/assets/ctf/suninatas/forensics/level-31-pdf-analysis-1.png)

Check basic info and metadata
```bash
└─$ file Hello_SuNiNaTaS.pdf
Hello_SuNiNaTaS.pdf: PDF document, version 1.4, 1 page(s)

└─$ /bin/ls -lh Hello_SuNiNaTaS.pdf
-rwxrwx--- 1 root vboxsf 25K Jun 27 12:04 Hello_SuNiNaTaS.pdf

└─$ exiftool Hello_SuNiNaTaS.pdf -v
  ExifToolVersion = 12.76
  FileName = Hello_SuNiNaTaS.pdf
  Directory = .
  FileSize = 25232
  FileModifyDate = 1751040297
  FileAccessDate = 1751040482
  FileInodeChangeDate = 1751040297
  FilePermissions = 33272
  FileType = PDF
  FileTypeExtension = PDF
  MIMEType = application/pdf
  PDFVersion = 1.4
  Linearized = false
PDF dictionary (1 of 2) with 5 entries:
  0)  Size = 41
  1)  Info (SubDirectory) -->
  + [Info directory with 7 entries]
  | 0)  Title = (find the key)
  | 1)  Author = (capcorps)
  | 2)  Creator = (Hancom PDF 1.3.0.480)
  | 3)  Producer = (Hancom PDF 1.3.0.480)
  | 4)  CreateDate = (D:20160526050544+09'00')
  | 5)  ModifyDate = (D:20160526070004+09'00')
  | 6)  PDFVersion = (1.4)
  2)  Root (SubDirectory) -->
  + [Root directory with 8 entries]
  | 0)  Type = /Catalog
  | 1)  Pages (SubDirectory) -->
  | + [Pages directory with 3 entries]
  | | 0)  Type = /Pages
  | | 1)  PageCount = 1
  | | 2)  Kids (SubDirectory) -->
  | | + [Kids directory with 7 entries]
  | | | 0)  Type = /Page
  | | | 1)  Parent = ref(1 0 R)
  | | | 2)  MediaBox = [0,0,595,841]
  | | | 3)  TrimBox = [0,0,595,841]
  | | | 4)  BleedBox = [0,0,595,841]
  | | | 5)  Resources (SubDirectory) -->
  | | | + [Resources directory with 3 entries]
  | | | | 0)  Font (SubDirectory) -->
  | | | | + [Font directory with 1 entries]
  | | | | | 0)  F1 (SubDirectory) -->
  | | | | | + [F1 directory with 7 entries]
  | | | | | | 0)  Type = /Font
  | | | | | | 1)  Subtype = /Type0
  | | | | | | 2)  Name = /F1
  | | | | | | 3)  BaseFont = /INPILL+HCRBatang
  | | | | | | 4)  Encoding = /Identity-H
  | | | | | | 5)  DescendantFonts (SubDirectory) -->
  | | | | | | + [DescendantFonts directory with 8 entries]
  | | | | | | | 0)  Type = /Font
  | | | | | | | 1)  BaseFont = /INPILL+HCRBatang
  | | | | | | | 2)  CIDToGIDMap = /Identity
  | | | | | | | 3)  Subtype = /CIDFontType2
  | | | | | | | 4)  CIDSystemInfo (SubDirectory) -->
  | | | | | | | + [CIDSystemInfo directory with 3 entries]
  | | | | | | | | 0)  Registry = (Adobe)
  | | | | | | | | 1)  Ordering = (UCS)
  | | | | | | | | 2)  Supplement = 0
  | | | | | | | 5)  FontDescriptor (SubDirectory) -->
  | | | | | | | + [FontDescriptor directory with 11 entries]
  | | | | | | | | 0)  Type = /FontDescriptor
  | | | | | | | | 1)  FontName = /INPILL+HCRBatang
  | | | | | | | | 2)  FontBBox = [-1283,-426,3268,1082]
  | | | | | | | | 3)  Flags = 32
  | | | | | | | | 4)  CapHeight = 0
  | | | | | | | | 5)  Ascent = 830
  | | | | | | | | 6)  Descent = -170
  | | | | | | | | 7)  ItalicAngle = 0
  | | | | | | | | 8)  StemV = 0
  | | | | | | | | 9)  FontFile2 (SubDirectory) -->
  | | | | | | | | + [FontFile2 directory with 4 entries]
  | | | | | | | | | 0)  Length = 3475
  | | | | | | | | | 1)  Length1 = 6136
  | | | | | | | | | 2)  Filter = /FlateDecode
  | | | | | | | | | 3)  Metadata (SubDirectory) -->
  | | | | | | | | | + [Metadata directory with 3 entries]
  | | | | | | | | | | 0)  Type = /Metadata
  | | | | | | | | | | 1)  Subtype = /XML
  | | | | | | | | | | 2)  Length = 680
  | | | | | | | | 10) CIDSet (SubDirectory) -->
  | | | | | | | | + [CIDSet directory with 2 entries]
  | | | | | | | | | 0)  Length = 13
  | | | | | | | | | 1)  Filter = /FlateDecode
  | | | | | | | 6)  DW = 1000
  | | | | | | | 7)  W = [0,[970,970,0,300,320,734,536,287,588,734,552,287,356,907,320,6[snip]
  | | | | | | 6)  ToUnicode (SubDirectory) -->
  | | | | | | + [ToUnicode directory with 2 entries]
  | | | | | | | 0)  Length = 326
  | | | | | | | 1)  Filter = /FlateDecode
  | | | | 1)  ProcSet = [/PDF,/ImageB,/ImageC,/Text]
  | | | | 2)  XObject (SubDirectory) -->
  | | | | + [XObject directory with 1 entries]
  | | | | | 0)  Im1 (SubDirectory) -->
  | | | | | + [Im1 directory with 9 entries]
  | | | | | | 0)  Type = /XObject
  | | | | | | 1)  Subtype = /Image
  | | | | | | 2)  Name = /Im1
  | | | | | | 3)  Length = 4067
  | | | | | | 4)  Width = 205
  | | | | | | 5)  Height = 79
  | | | | | | 6)  BitsPerComponent = 8
  | | | | | | 7)  ColorSpace = /DeviceRGB
  | | | | | | 8)  Filter = /DCTDecode
  | | | 6)  Contents (SubDirectory) -->
  | | | + [Contents directory with 2 entries]
  | | | | 0)  Length = 333
  | | | | 1)  Filter = /FlateDecode
  | 2)  MarkInfo (SubDirectory) -->
  | + [MarkInfo directory with 1 entries]
  | | 0)  TaggedPDF = false
  | 3)  Language = (ko-KR)
  | 4)  PageLayout = /SinglePage
  | 5)  Metadata (SubDirectory) -->
  | + [Metadata directory with 3 entries]
  | | 0)  Type = /Metadata
  | | 1)  Subtype = /XML
  | | 2)  Length = 1524
  | | + [XMP directory, 1524 bytes]
  | | | XMPToolkit = Adobe XMP Core 4.2.1-c041 52.342996, 2008/05/07-20:48:00
  | | | PDFVersion = 1.4
  | | | Producer = Hancom PDF 1.3.0.480
  | | | CreatorTool = Hancom PDF 1.3.0.480
  | | | CreateDate = 2016-05-26T05:05:44+09:00
  | | | ModifyDate = 2016-05-26T07:00:04+09:00
  | | | MetadataDate = 2016-05-26T07:00:04+09:00
  | | | Format = application/pdf
  | | | Creator = capcorps
  | | | Title = find the key
  | | | Date = 2016-05-26T05:05:44+09:00
  | | | DocumentID = 454E4DB4-BDF1-4A9E-B8A8-703E025E677F
  | | | InstanceID = uuid:D639B5D2-55FA-4BDE-A1A7-54B91E185101
  | | | [adding XMP-pdfaid:part]
  | | | Part = 1
  | | | [adding XMP-pdfaid:conformance]
  | | | Conformance = B
  | 6)  OutputIntents (SubDirectory) -->
  | + [OutputIntents directory with 5 entries]
  | | 0)  Type = /OutputIntent
  | | 1)  S = /GTS_PDFA1
  | | 2)  OutputConditionIdentifier = (sRGB IEC61966-2.1)
  | | 3)  Info = (sRGB IEC61966-2.1)
  | | 4)  DestOutputProfile (SubDirectory) -->
  | | + [DestOutputProfile directory with 3 entries]
  | | | 0)  N = 3
  | | | 1)  Length = 2596
  | | | 2)  Filter = /FlateDecode
  | 7)  Names (SubDirectory) -->
  | + [Names directory with 2 entries]
  | | 0)  JavaScript (SubDirectory) -->
  | | + [JavaScript directory with 1 entries]
  | | | 0)  Names = [(DongBo),ref(35 0 R)]
  | | 1)  EmbeddedFiles (SubDirectory) -->
  | | + [EmbeddedFiles directory with 1 entries]
  | | | 0)  Names = [(Untitled Object 0),HASH(0x563b54241f28)]
  3)  Prev = 15797
  4)  ID = [<fffe454e4db4bdf14a9eb8a8703e025e677f>,<08ee799fe02cf57a04081855561279d2>]
PDF dictionary (2 of 2) with 4 entries:
  5)  Size = 30
  6)  Root (SubDirectory) -->
  7)  Info (SubDirectory) -->
  8)  ID = [<FFFE454E4DB4BDF14A9EB8A8703E025E677F>,<FFFED639B5D255FA4BDEA1A754B91E185101>]
```

Check for any hidden files
```
└─$ binwalk -e --dd='.*' Hello_SuNiNaTaS.pdf

DECIMAL       HEXADECIMAL     DESCRIPTION
--------------------------------------------------------------------------------
0             0x0             PDF document, version: "1.4"
234           0xEA            Zlib compressed data, default compression
5323          0x14CB          Zlib compressed data, default compression
9123          0x23A3          Copyright string: "Copyright>Unknown</xmpRights:Copyright><xmpRights:Marked>True</xmpRights:Marked><xmpRights:Owner>Unknown</xmpRights:Owner><xmpRi"
9152          0x23C0          Copyright string: "Copyright><xmpRights:Marked>True</xmpRights:Marked><xmpRights:Owner>Unknown</xmpRights:Owner><xmpRights:UsageTerms>Unknown</xmpR"
9466          0x24FA          Zlib compressed data, default compression
13019         0x32DB          Zlib compressed data, default compression
13432         0x3478          Zlib compressed data, default compression
```

Binwalk failed to extract the file, but  `pdfdetach` was able to extract another PDF (Smth Javascript block related)
```bash
└─$ pdfdetach -saveall Hello_SuNiNaTaS.pdf
└─$ /bin/ls -lh object\ 2
-rwxrwx--- 1 root vboxsf 823 Jun 27 12:09 'object 2'
└─$ file object\ 2
object 2: PDF document, version 1.7, 1 page(s)
```

It's password protected

![level-31---pdf-analysis-2.png](/assets/ctf/suninatas/forensics/level-31-pdf-analysis-2.png)

Password seems to be nothing...?
```bash
└─$ pdf2john "object 2" | tee obj.hash
object 2:$pdf$2*3*128*1073741823*1*32*3164333163626164626435356634383539666363316463626431623161373965*32*c238812fbcce2ac0bf31debf23e20d1273fb95387e72f56b736cd89d3be5b2d3*32*36451bd39d753b7c1d10922c28e6665aa4f3353fb0348b536893e3b1db5c579b
└─$ john obj.hash --wordlist=$rockyou
Using default input encoding: UTF-8
Loaded 1 password hash (PDF [MD5 SHA2 RC4/AES 32/64])
No password hashes left to crack (see FAQ)

└─$ john obj.hash --show | xxd -c 52
00000000: 6f62 6a65 6374 2032 3a0a 0a31 2070 6173 7377 6f72 6420 6861 7368 2063 7261 636b 6564 2c20 3020 6c65 6674 0a                        object 2:..1 password hash cracked, 0 left.
```

But the recovered PDF is empty

![level-31---pdf-analysis-3.png](/assets/ctf/suninatas/forensics/level-31-pdf-analysis-3.png)

Back to the  binwalk output 
```bash
└─$ grep PDF _Hello_SuNiNaTaS.pdf.extracted -Rano | cut -d':' -f1 | sort | uniq | cut -d' ' -f7 | xargs file
_Hello_SuNiNaTaS.pdf.extracted/0:         PDF document, version 1.4, 1 page(s)
_Hello_SuNiNaTaS.pdf.extracted/14CB.zlib: zlib compressed data
_Hello_SuNiNaTaS.pdf.extracted/23A3:      data
_Hello_SuNiNaTaS.pdf.extracted/23C0:      data
_Hello_SuNiNaTaS.pdf.extracted/24FA.zlib: zlib compressed data
_Hello_SuNiNaTaS.pdf.extracted/32DB.zlib: zlib compressed data
_Hello_SuNiNaTaS.pdf.extracted/3478.zlib: zlib compressed data
_Hello_SuNiNaTaS.pdf.extracted/EA.zlib:   zlib compressed data
```

```bash
└─$ exiftool object\ 2.pdf
ExifTool Version Number         : 12.76
File Name                       : object 2.pdf
Directory                       : .
File Size                       : 823 bytes
File Modification Date/Time     : 2025:06:27 12:09:44-04:00
File Access Date/Time           : 2025:06:27 12:23:26-04:00
File Inode Change Date/Time     : 2025:06:27 12:14:10-04:00
File Permissions                : -rwxrwx---
File Type                       : PDF
File Type Extension             : pdf
MIME Type                       : application/pdf
PDF Version                     : 1.7
Linearized                      : No
Encryption                      : Standard V2.3 (128-bit)
User Access                     : Print, Modify, Copy, Annotate, Fill forms, Extract, Assemble, Print high-res
Page Count                      : 1

└─$ pdf-parser -c Hello_SuNiNaTaS.pdf | grep PDF -i
PDF Comment '%PDF-1.4\n'
PDF Comment '%\xaa\xab\xac\xad\n'
    /ProcSet [ /PDF /ImageB /ImageC /Text ]
/ProcSet [ /PDF /ImageB /ImageC /Text ]
    /Creator (Hancom PDF 1.3.0.480)
    /Producer (Hancom PDF 1.3.0.480)
    /PDFVersion (1.4)
/Creator (Hancom PDF 1.3.0.480)
/Producer (Hancom PDF 1.3.0.480)
/PDFVersion (1.4)
    /S /GTS_PDFA1
/S /GTS_PDFA1
 '<?xpacket begin="\xef\xbb\xbf" id="W5M0MpCehiHzreSzNTczkc9d"?><x:xmpmeta xmlns:x="adobe:ns:meta/" x:xmptk="Adobe XMP Core 4.0-c316 44.253921, Sun Oct 01 2006 17:14:39"><rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"><rdf:Description rdf:about="" xmlns:pdf="http://ns.adobe.com/pdf/1.3/"><pdf:PDFVersion>1.4</pdf:PDFVersion><pdf:Producer>Hancom PDF 1.3.0.480</pdf:Producer></rdf:Description><rdf:Description rdf:about="" xmlns:xap="http://ns.adobe.com/xap/1.0/"><xap:CreatorTool>Hancom PDF 1.3.0.480</xap:CreatorTool><xap:CreateDate>2016-05-26T05:05:44+09:00</xap:CreateDate><xap:ModifyDate>2016-05-26T05:05:44+09:00</xap:ModifyDate><xap:MetadataDate>2016-05-26T05:05:44+09:00</xap:MetadataDate></rdf:Description><rdf:Description rdf:about="" xmlns:dc="http://purl.org/dc/elements/1.1/"><dc:format>application/pdf</dc:format><dc:creator><rdf:Seq><rdf:li>capcorps</rdf:li></rdf:Seq></dc:creator><dc:title><rdf:Seq><rdf:li>find the key</rdf:li></rdf:Seq></dc:title><dc:date><rdf:Seq><rdf:li>2016-05-26T05:05:44+09:00</rdf:li></rdf:Seq></dc:date></rdf:Description><rdf:Description rdf:about="" xmlns:xapMM="http://ns.adobe.com/xap/1.0/mm/"><xapMM:DocumentID>454E4DB4-BDF1-4A9E-B8A8-703E025E677F</xapMM:DocumentID><xapMM:InstanceID>uuid:D639B5D2-55FA-4BDE-A1A7-54B91E185101</xapMM:InstanceID></rdf:Description><rdf:Description rdf:about="" xmlns:pdfaid="http://www.aiim.org/pdfa/ns/id/">\n<pdfaid:part>1</pdfaid:part>\n<pdfaid:conformance>B</pdfaid:conformance>\n</rdf:Description></rdf:RDF></x:xmpmeta><?xpacket end="w"?>\n'
    /ProcSet [ /PDF ]
/ProcSet [ /PDF ]
PDF Comment '%%EOF\n'
    /Creator (Hancom PDF 1.3.0.480)
    /Producer (Hancom PDF 1.3.0.480)
    /PDFVersion (1.4)
<</Title(find the key)/Author(capcorps)/Creator(Hancom PDF 1.3.0.480)/Producer(Hancom PDF 1.3.0.480)/CreationDate(D:20160526050544+09'00')/ModDate(D:20160526070004+09'00')/PDFVersion(1.4)>>
 '<?xpacket begin="\xef\xbb\xbf" id="W5M0MpCehiHzreSzNTczkc9d"?>\r\n<x:xmpmeta xmlns:x="adobe:ns:meta/" x:xmptk="Adobe XMP Core 4.2.1-c041 52.342996, 2008/05/07-20:48:00        ">\r\n\t<rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">\r\n\t\t<rdf:Description rdf:about="" xmlns:pdf="http://ns.adobe.com/pdf/1.3/"><pdf:PDFVersion>1.4</pdf:PDFVersion><pdf:Producer>Hancom PDF 1.3.0.480</pdf:Producer></rdf:Description><rdf:Description rdf:about="" xmlns:xap="http://ns.adobe.com/xap/1.0/"><xap:CreatorTool>Hancom PDF 1.3.0.480</xap:CreatorTool><xap:CreateDate>2016-05-26T05:05:44+09:00</xap:CreateDate><xap:ModifyDate>2016-05-26T07:00:04+09:00</xap:ModifyDate><xap:MetadataDate>2016-05-26T07:00:04+09:00</xap:MetadataDate></rdf:Description><rdf:Description rdf:about="" xmlns:dc="http://purl.org/dc/elements/1.1/"><dc:format>application/pdf</dc:format><dc:creator><rdf:Seq><rdf:li>capcorps</rdf:li></rdf:Seq></dc:creator><dc:title><rdf:Alt><rdf:li xml:lang="x-default">find the key</rdf:li></rdf:Alt></dc:title><dc:date>2016-05-26T05:05:44+09:00</dc:date></rdf:Description><rdf:Description rdf:about="" xmlns:xapMM="http://ns.adobe.com/xap/1.0/mm/"><xapMM:DocumentID>454E4DB4-BDF1-4A9E-B8A8-703E025E677F</xapMM:DocumentID><xapMM:InstanceID>uuid:D639B5D2-55FA-4BDE-A1A7-54B91E185101</xapMM:InstanceID></rdf:Description><rdf:Description rdf:about="" xmlns:pdfaid="http://www.aiim.org/pdfa/ns/id/"><pdfaid:part>1</pdfaid:part><pdfaid:conformance>B</pdfaid:conformance></rdf:Description></rdf:RDF>\r\n</x:xmpmeta>\r\n\r\n<?xpacket end="w"?>\r\n'
PDF Comment '%%EOF\r'
```

We can try to manually carve it out
```bash
└─$ strings -t d Hello_SuNiNaTaS.pdf | grep '%%EOF'
  16554 %%EOF
  25226 %%EOF

└─$ dd if=Hello_SuNiNaTaS.pdf bs=1 skip=16554 of=hidden.pdf
8678+0 records in
8678+0 records out
8678 bytes (8.7 kB, 8.5 KiB) copied, 1.21185 s, 7.2 kB/s

└─$ cat hidden.pdf
...
Base64.decode("'Vm0'+'wd2Qy'+'UXlW'+'a1pP'+'VldS'+'WFYw'+'ZG9WV'+'ll3W'+'kc5V'+'01Wb'+'DNXa2'+'M1VjF'+'Kc2JET'+'lhhMU'+'pUV'+'mpGS'+'2RHVk'+'dX'+'bFpOY'+'WtFe'+'FZtc'+'EdZV'+'1JIV'+'mtsa'+'QpSb'+'VJPW'+'W14R'+'00x'+'WnR'+'NWH'+'BsU'+'m1S'+'SVZ'+'tdF'+'dVZ'+'3Bp'+'Umx'+'wd1'+'ZXM'+'TRkM'+'VZX'+'WkZ'+'kYV'+'JGS'+'lVU'+'V3N'+'4Tk'+'ZaS'+'E5V'+'OVhR'+'WEJ'+'wVW'+'01Q'+'1dW'+'ZHNa'+'RFJa'+'ClYx'+'WlhWM'+'jVLVm1'+'FeVVtR'+'ldh'+'a1p'+'MVj'+'BaV'+'2RF'+'NVZ'+'PV2'+'hSV'+'0VK'+'VVd'+'XeG'+'FTM'+'VpX'+'V2t'+'kVm'+'EwN'+'VVD'+'azF'+'XV2'+'xoV'+'01X'+'aHZ'+'WMG'+'RLU'+'jJO'+'SVR'+'sWm'+'kKV'+'0do'+'NlZ'+'HeG'+'FZV'+'k5I'+'VWt'+'oU2'+'JXa'+'FdW'+'MFZ'+'LVl'+'ZkW'+'E1U'+'QlR'+'NV1'+'JYV'+'jI1'+'U2Fs'+'SllV'+'bkJEY'+'XpGV1'+'kwWm'+'9XR0'+'V4Y'+'0hK'+'V01'+'uTjN'+'aVmR'+'HUjJ'+'GRwp'+'WbGN'+'LWW'+'toQm'+'VsZH'+'NaR'+'FJa'+'Vms1'+'R1R'+'sWm'+'tZV'+'kp1U'+'WxkV'+'01GW'+'kxWb'+'FprV'+'0Ux'+'VVF'+'sUk'+'5WbH'+'BJVm'+'pKMG'+'ExZH'+'RWbk'+'pYYm'+'tKRV'+'lYcE'+'dWMW'+'t3Cl'+'dtOV'+'hSMF'+'Y1WV'+'VWN'+'FYw'+'MUh'+'Va3'+'hXT'+'VZw'+'WFl'+'6Rm'+'Fjd3'+'BqUj'+'J0T'+'FZXM'+'DFRM'+'kl4W'+'khOY'+'VJGS'+'mFWa'+'kZLU'+'1ZadG'+'RHOV'+'ZSbH'+'AxV'+'Vd4'+'a1Y'+'wMU'+'cKV'+'2t4'+'V2J'+'GcH'+'JWMG'+'RTU'+'jFw'+'SGR'+'FNV'+'diS'+'EJK'+'Vmp'+'KMF'+'lXS'+'XlS'+'WGh'+'UV0'+'dSW'+'Vlt'+'dGF'+'SVm'+'xzV'+'m5k'+'WFJ'+'sbD'+'VDb'+'VJI'+'T1Z'+'oU0'+'1GW'+'TFX'+'VlZ'+'hVT'+'FZeA'+'pTWH'+'BoU0'+'VwV1'+'lsaE'+'5lRl'+'pxUm'+'xkam'+'QzQn'+'FVak'+'owVE'+'ZaWE'+'1UUm'+'tNa'+'2w0'+'VjJ'+'4a1'+'ZtR'+'XlV'+'bGh'+'VVm'+'xae'+'lRr'+'WmF'+'kR1'+'ZJV'+'Gxw'+'V2E'+'zQj'+'VWa'+'ko0'+'CmE'+'xWX'+'lTb'+'lVL'+'VVc'+'1V1'+'ZXS'+'kZW'+'VFZ'+'WUm'+'tVN'+'VVG'+'RTl'+'QUT'+'09'");
...
```

Rabbit hole :(
```python
import base64

string = 'Vm0'+'wd2Qy'+'UXlW'+'a1pP'+'VldS'+'WFYw'+'ZG9WV'+'ll3W'+'kc5V'+'01Wb'+'DNXa2'+'M1VjF'+'Kc2JET'+'lhhMU'+'pUV'+'mpGS'+'2RHVk'+'dX'+'bFpOY'+'WtFe'+'FZtc'+'EdZV'+'1JIV'+'mtsa'+'QpSb'+'VJPW'+'W14R'+'00x'+'WnR'+'NWH'+'BsU'+'m1S'+'SVZ'+'tdF'+'dVZ'+'3Bp'+'Umx'+'wd1'+'ZXM'+'TRkM'+'VZX'+'WkZ'+'kYV'+'JGS'+'lVU'+'V3N'+'4Tk'+'ZaS'+'E5V'+'OVhR'+'WEJ'+'wVW'+'01Q'+'1dW'+'ZHNa'+'RFJa'+'ClYx'+'WlhWM'+'jVLVm1'+'FeVVtR'+'ldh'+'a1p'+'MVj'+'BaV'+'2RF'+'NVZ'+'PV2'+'hSV'+'0VK'+'VVd'+'XeG'+'FTM'+'VpX'+'V2t'+'kVm'+'EwN'+'VVD'+'azF'+'XV2'+'xoV'+'01X'+'aHZ'+'WMG'+'RLU'+'jJO'+'SVR'+'sWm'+'kKV'+'0do'+'NlZ'+'HeG'+'FZV'+'k5I'+'VWt'+'oU2'+'JXa'+'FdW'+'MFZ'+'LVl'+'ZkW'+'E1U'+'QlR'+'NV1'+'JYV'+'jI1'+'U2Fs'+'SllV'+'bkJEY'+'XpGV1'+'kwWm'+'9XR0'+'V4Y'+'0hK'+'V01'+'uTjN'+'aVmR'+'HUjJ'+'GRwp'+'WbGN'+'LWW'+'toQm'+'VsZH'+'NaR'+'FJa'+'Vms1'+'R1R'+'sWm'+'tZV'+'kp1U'+'WxkV'+'01GW'+'kxWb'+'FprV'+'0Ux'+'VVF'+'sUk'+'5WbH'+'BJVm'+'pKMG'+'ExZH'+'RWbk'+'pYYm'+'tKRV'+'lYcE'+'dWMW'+'t3Cl'+'dtOV'+'hSMF'+'Y1WV'+'VWN'+'FYw'+'MUh'+'Va3'+'hXT'+'VZw'+'WFl'+'6Rm'+'Fjd3'+'BqUj'+'J0T'+'FZXM'+'DFRM'+'kl4W'+'khOY'+'VJGS'+'mFWa'+'kZLU'+'1ZadG'+'RHOV'+'ZSbH'+'AxV'+'Vd4'+'a1Y'+'wMU'+'cKV'+'2t4'+'V2J'+'GcH'+'JWMG'+'RTU'+'jFw'+'SGR'+'FNV'+'diS'+'EJK'+'Vmp'+'KMF'+'lXS'+'XlS'+'WGh'+'UV0'+'dSW'+'Vlt'+'dGF'+'SVm'+'xzV'+'m5k'+'WFJ'+'sbD'+'VDb'+'VJI'+'T1Z'+'oU0'+'1GW'+'TFX'+'VlZ'+'hVT'+'FZeA'+'pTWH'+'BoU0'+'VwV1'+'lsaE'+'5lRl'+'pxUm'+'xkam'+'QzQn'+'FVak'+'owVE'+'ZaWE'+'1UUm'+'tNa'+'2w0'+'VjJ'+'4a1'+'ZtR'+'XlV'+'bGh'+'VVm'+'xae'+'lRr'+'WmF'+'kR1'+'ZJV'+'Gxw'+'V2E'+'zQj'+'VWa'+'ko0'+'CmE'+'xWX'+'lTb'+'lVL'+'VVc'+'1V1'+'ZXS'+'kZW'+'VFZ'+'WUm'+'tVN'+'VVG'+'RTl'+'QUT'+'09'

i = 0
while True:    
    try:
        string = base64.b64decode(string).decode().replace('\n', '')
        print(f'[{i}] {string}')
        i += 1
    except:
        break

# [10] I am sorry, This is not Key~!!
```

> Note: After some tinkering with encodings I was able to extract following code with strings too: `strings -e l Hello_SuNiNaTaS.pdf`

Remove encryption, or tools like [https://smallpdf.com/unlock-pdf](https://smallpdf.com/unlock-pdf)
```bash
└─$ qpdf --password= --decrypt './object 2.pdf' out.pdf
└─$ ls -alh "object 2.pdf" out.pdf
Permissions Size User Date Modified Name
.rwxrwx---   823 root 27 Jun 12:09  'object 2.pdf'
.rwxrwx---   696 root 27 Jun 13:34  out.pdf
```

Again the PDF is empty, but PDF keeps data in compressed format; Lookup any available streams: 
```bash
└─$ pdf-parser out.pdf | grep -e '^obj' -e 'Contains stream'
obj 1 0
obj 2 0
obj 3 0
obj 4 0
 Contains stream
obj 5 0
```

```bash
└─$ pdf-parser out.pdf -o 4 -f 2>/dev/null
This program has not been tested with this version of Python (3.11.9)
Should you encounter problems, please use Python version 3.11.1
obj 4 0
 Type:
 Referencing:
 Contains stream

  <<
    /Filter /FlateDecode
    /Length 45
  >>

 b'"HERE IS FLAGS SunINatAsGOodWeLL!@#$"'
```

Another good tool worth mentioning is **[pdfstreamdumper](https://github.com/zha0/pdfstreamdumper)**

![level-31---pdf-analysis-4.png](/assets/ctf/suninatas/forensics/level-31-pdf-analysis-4.png)

```bash
└─$ echo -n 'SunINatAsGOodWeLL!@#$' | md5sum
13d45a1e25471e72d2acc46f8ec46e95  -
```

> Flag: `13d45a1e25471e72d2acc46f8ec46e95`

