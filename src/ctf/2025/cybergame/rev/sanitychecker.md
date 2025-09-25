# Sanity Checker

## \[☆☆☆\] Sleepy python

### Description

I found some Python code on my computer, but I don't know what it's doing. I tried to run it, but it doesn't seem to do anything. Flag is in format SK-CERT{...} and is hidden in command that is executed using os.system(...). This scenario is for environment with BASH.

Download: [1.py](https://ctf-world.cybergame.sk/files/68e02d09e1c56ca3f2a3191d5d30bfd6/1.py?token=eyJ1c2VyX2lkIjoyOTQsInRlYW1faWQiOm51bGwsImZpbGVfaWQiOjI1fQ.aBe9Dg.6kYIk157ta35O4jeZnYkQvIfakc "1.py")

### Solution

Change the `os.system` to `print` and that's the easiest way to debug the program. Deobfuscation functions are already in place.
```python
# time.sleep(31536000)

with open("lol.sh", "w") as f:
    f.write(data)

print(command1)
print(command2)
```

```powershell
➜ py .\1.py
chmod +x lol.sh
./lol.sh #SK-CERT{0bfu5c4710n_4nd_5l33p}
```

::: tip Flag
`SK-CERT{0bfu5c4710n_4nd_5l33p}`
:::

## \[☆☆☆\] Bash dropper

### Description

It looks like the python script created new bash file. Take a look. Flag is in format SK-CERT{...} and is hidden inside bash script.

### Solution

The deobfuscated file writes `lol.sh` script:
```bash
#!/bin/bash
# SK-CERT{1_w1ll_l34v3_y0u_50m37h1n6_h3r3}

echo -n 'f0VMRgIBA...AAAAAAAA=' | base64 -d > ./malw
while true; do
    echo "You are hacked!"
    sleep 1
done
```

::: tip Flag
`SK-CERT{1_w1ll_l34v3_y0u_50m37h1n6_h3r3}`
:::

## \[☆☆☆\] Password protected

### Description

It appears that the bash script left another executable on your system. It also seems to be password-protected. I don't know the password, but I'm really curious about what secrets this file holds. The flag is in the format SK-CERT{...}. There are multiple ways to obtain the flag. For example, you can use static analysis of the binary to either read the flag from its data or find a hardcoded password. Alternatively, you can use dynamic analysis or binary patching.

## Solution

Decode the base64 blob and analyze `malw`
```powershell
➜ file .\malw
.\malw: ELF 64-bit LSB shared object, x86-64, version 1 (SYSV), dynamically linked, interpreter /lib64/ld-linux-x86-64.so.2, BuildID[sha1]=936a030852e16e5bfbf7b0f5400ec23be955eaab, for GNU/Linux 3.2.0, 
not stripped
```

Ideally you would want to use Ghidra or Ida to analyze the file, but since sample is very small [https://dogbolt.org/?id=e3a6edf8-64d9-417b-bd9d-16b0a8c2edc3](https://dogbolt.org/?id=e3a6edf8-64d9-417b-bd9d-16b0a8c2edc3) will do

![SanityChecker.png](/assets/ctf/cybergame/sanitychecker.png)

::: tip Flag
`SK-CERT{h4rdc0d3d_pl41n73x7}`
:::

