# Level 11   Dynamic Analysis

[http://suninatas.com/challenge/web11/web11.asp](http://suninatas.com/challenge/web11/web11.asp)

[Download](http://suninatas.com/challenge/web11/Unregister.zip)

We have to decompile the EXE (Probably C or C++)
```bash
└─$ file Project1.exe
Project1.exe: PE32 executable (GUI) Intel 80386, for MS Windows, 8 sections
```

![level-11---rev.png](/assets/ctf/suninatas/rev/level-11-rev.png)

[https://dogbolt.org/?id=e0dbf036-9c8d-44c7-83e4-686d1826cde2#Hex-Rays=4791](https://dogbolt.org/?id=e0dbf036-9c8d-44c7-83e4-686d1826cde2#Hex-Rays=4791)

![level-11---rev-1.png](/assets/ctf/suninatas/rev/level-11-rev-1.png)

```c
_strings str_2V[1] = { { -1, 2, "2V" } }; // weak
_strings str_XS[1] = { { -1, 2, "XS" } }; // weak
_strings str_B6[1] = { { -1, 2, "B6" } }; // weak
_strings str_H1[1] = { { -1, 2, "H1" } }; // weak
_strings str_0F[1] = { { -1, 2, "0F" } }; // weak

int __fastcall TForm1_Button1Click(int a1) {
  int v2; // ecx
  char v3; // zf
  const CHAR *v4; // eax
  unsigned int v6[2]; // [esp-10h] [ebp-18h] BYREF
  int *v7; // [esp-8h] [ebp-10h]
  int v8; // [esp+0h] [ebp-8h] BYREF
  int v9; // [esp+4h] [ebp-4h] BYREF
  int savedregs; // [esp+8h] [ebp+0h] BYREF

  v9 = 0;
  v8 = 0;
  v7 = &savedregs;
  v6[1] = (unsigned int)&loc_4503D1;
  v6[0] = (unsigned int)NtCurrentTeb()->NtTib.ExceptionList;
  __writefsdword(0, (unsigned int)v6);

  System::__linkproc__ LStrAsg(a1 + 784, &str_2V[1]);
  System::__linkproc__ LStrAsg(a1 + 788, &str_XS[1]);
  System::__linkproc__ LStrAsg(a1 + 792, &str_B6[1]);
  System::__linkproc__ LStrAsg(a1 + 796, &str_H1[1]);
  System::__linkproc__ LStrAsg(a1 + 800, &str_0F[1]);
  System::__linkproc__ LStrCatN(
    a1 + 816,
    5,
    v2,
    *(_DWORD *)(a1 + 792),
    *(_DWORD *)(a1 + 796),
    *(_DWORD *)(a1 + 788),
    *(_DWORD *)(a1 + 800));
  Controls::TControl::GetText(*(Controls::TControl **)(a1 + 756));
  System::__linkproc__ LStrCmp(v9, *(_DWORD *)(a1 + 816));
  if ( v3 )
  {
    System::__linkproc__ LStrCat3((int)&v8, *(void **)(a1 + 812), *(void **)(a1 + 804));
    v4 = (const CHAR *)System::__linkproc__ LStrToPChar();
    MessageBoxA_0(0, v4, "Congratulation!", 0);
  }
  Controls::TControl::SetText(*(Controls::TControl **)(a1 + 756), 0);
  System::__linkproc__ LStrAsg(a1 + 812, &str_Authkey___[1]);
  __writefsdword(0, v6[0]);
  v7 = (int *)&loc_4503D8;
  System::__linkproc__ LStrClr(&v8);
  return System::__linkproc__ LStrClr(&v9);
}
```

From the code it was somewhat obvious that the code was something like `2VXSB6H10F` or `B6H1XS0F`, but none worked.

![level-11---rev-2.png](/assets/ctf/suninatas/rev/level-11-rev-2.png)

You can hover over the values or use IDC:
```c
IDC> Message("EAX: %s\nEDX: %s\n", GetString(GetRegValue("EAX"), -1, ASCSTR_C), GetString(GetRegValue("EDX"), -1, ASCSTR_C));
EAX: letmein
EDX: 2VB6H1XS0F
```

If we use EDX as the key we get Authkey

![level-11---rev-3.png](/assets/ctf/suninatas/rev/level-11-rev-3.png)

> Flag: `2abbe4b681aae92244536ca0e32fa0de`