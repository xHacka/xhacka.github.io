# Aetherion Dynamics 

## Description

Aetherion Dynamics | 50  points | By `Thomas and Puhalenthi`

Aetherion Dynamics is a cutting-edge company operating under the highest levels of secrecy. We've managed to get our hands on one of their top-secret memos, but it's redacted! You need to help us find their secret password.

Static resources: [SecretFacilityAccess.pdf](https://storage.googleapis.com/bcactf/aetherion-dynamics/SecretFacilityAccess.pdf)

## Solution

Using strings and reading header details we can see that PDF contains an image inside `/Subtype /Image`

```sh
└─$ strings -d -n 6 SecretFacilityAccess.pdf | head -40
%PDF-1.3
1 0 obj
/Type /Pages
/Count 1
/Kids [ 4 0 R ]
endobj
2 0 obj
/Producer (pypdf)
endobj
3 0 obj
/Type /Catalog
/Pages 1 0 R
endobj
4 0 obj
/Type /Page
/Resources <<
/XObject <<
/Im1 5 0 R
/ProcSet [ /ImageB /ImageC /ImageI /PDF /Text ]
/Contents 8 0 R
/MediaBox [ 0 0 591.36000000000001 774.96000000000004 ]
/Annots [ ]
/Parent 1 0 R
endobj
5 0 obj
/Type /XObject
/Subtype /Image
/Width 2464
/Height 3229
/Interpolate true
/ColorSpace 6 0 R
/Intent /Perceptual
/BitsPerComponent 8
/Filter /DCTDecode
/Length 458212
stream
8Photoshop 3.0
%&'()*456789:CDEFGHIJSTUVWXYZcdefghijstuvwxyz
&'()*56789:CDEFGHIJSTUVWXYZcdefghijstuvwxyz
""""""''''',,,,,,,,,,

└─$ binwalk --dd='.*' SecretFacilityAccess.pdf 
DECIMAL       HEXADECIMAL     DESCRIPTION
--------------------------------------------------------------------------------
0             0x0             PDF document, version: "1.3"
571           0x23B           JPEG image data, JFIF standard 1.01
601           0x259           TIFF image data, big-endian, offset of first image directory: 8
                                                                                                                                                                                                                  
└─$ mv _SecretFacilityAccess.pdf.extracted/23B some.jpeg
                                                                                                                                                                                                                  
└─$ display some.jpeg                                
```


![aetherion-dynamics-1](/assets/ctf/bcactf/aetherion-dynamics-1.png)

Flag: `bcactf{n0t_S0_5Ecre7_ANyMorE}`