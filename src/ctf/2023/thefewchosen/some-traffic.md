# Some Traffic

## Description

By `skyv3il`

Our SOC analysts said that in the last few days, some of our employees started to upload a lot of photos on random sites. Check it out.  
  
Flag Format: TFCCTF{...}.  

Downloads: [sus.pcapng](https://drive.google.com/file/d/1YDtMUdKeNbv6QAIknzJdu9eMi6fvG3J7/view?usp=sharing)

## Solution

Since description mentions uploads of photos, let's extract HTTP objects.

`File -> Export Objects -> HTTP`

First let's clean up.
```bash
└─$ file *   
%5c:       HTML document, ASCII text
upload:    data
upload(1): HTML document, ASCII text
upload(2): data
upload(3): HTML document, ASCII text
upload(4): data
upload(5): HTML document, ASCII text

└─$ for filename in $(/bin/ls); do 
    if [[ "$(file $filename)" =~ "HTML" ]]; then 
        rm $filename; 
    fi; 
done;
```

`data` files are actually png files or rather contain images, but there's weird header text and footer, let's also clean them up.

I wrote a small bash script to do this for us. What it basically does is grabs lines from START till END.

```bash
#!/bin/bash

file=$1

lines=$(wc -l $file | cut -d " " -f 1)

start=5
end=$(( $lines - 1 ))

sed -n "$start,$end p" "$file" > "$file.png"
```

After getting proper images I tried to use [zsteg](https://github.com/zed-0xff/zsteg) and I couldn't find anything. By default `zsteg` tries common patterns, let's go boyond that. By using `-a` tool _tries all known methods_.

```bash
└─$ zsteg ./upload.png -a | grep TFCCTF        
[?] 2 bytes of extra data after image end (IEND), offset = 0x1658d
b8,g,lsb,yx         .. text: "FCCTF{H1dd3n_d4t4_1n_p1x3ls_i5n't_f4n_4nd_e4sy_to_f1nd!}TFCCTF{H1dd3n_d4t4_1n_p1x3ls_i5n't_f4n_4nd_e4sy_to_f1nd!}TFCCTF{H1dd3n_d4t4_1n_p1x3ls_i5n't_f4n_4nd_e4sy_to_f1nd!}TFCCTF{H1dd3n_d4t4_1n_p1x3ls_i5n't_f4n_4nd_e4sy_to_f1nd!}TFCCTF{H1dd3n_d4t4_1n_p1x3ls_"
```
::: tip Flag
`TFCCTF{H1dd3n_d4t4_1n_p1x3ls_i5n't_f4n_4nd_e4sy_to_f1nd!}`
:::