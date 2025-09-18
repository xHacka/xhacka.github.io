# Missing

## Description
 
Jason todd went missing and all alfred was able to recover from his pc was this file  
Help Alfred find Jason  
  
**Author**: Rakhul

Downloads: [jason.rar](https://traboda-arena-87.s3.amazonaws.com/files/attachments/jason_73601a3a-498f-42fc-9d94-5f376b21eaea.rar?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIA6GUFVMV6HO3NYL6Z%2F20230806%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Date=20230806T162604Z&X-Amz-Expires=3600&X-Amz-SignedHeaders=host&X-Amz-Signature=6700ca61c40eaa9a35ba55e67fd5912f6a1c63ba7c2f6fd888c5d8e81ddaa9ac)

## Solution 

```bash
└─$ unrar x jason.rar
Enter password (will not be echoed) for cryptic-tod-secure/.git/config: 

└─$ rar2john jason.rar > jason.hash

└─$ john jason.hash --wordlist=$rockyou
...
jason.rar:1983
...
```

I couldn't extract with `unrar`, so I just drag and dropped from GUI with cracked password.

```bash
└─$ la
Permissions Size User Date Modified Name
drwxr-xr-x     - kali  1 Jun  2022   cryptic-tod-secure
.rwxr-x---   44k kali  6 Aug 20:32   jason.rar
drwxr-xr-x     - kali  1 Jun  2022   nothing_here_to_look_at
```

First I decided to look inside `nothing_here_to_look_at` (because of the name).

```bash
└─$ la ./nothing_here_to_look_at 
Permissions Size User Date Modified Name
drwxr-xr-x     - kali  6 Aug 20:50   .git
.rw-r--r--   180 kali  1 Jun  2022   empty.txt
.rw-r--r--    90 kali  1 Jun  2022   encoded.txt
.rw-r--r--   805 kali  1 Jun  2022   secret.txt

# Above files had nothing interesting so I decided to look into git commits.

└─$ git log --oneline
65e36b3 (HEAD -> main, origin/main, origin/HEAD) Create encoded.txt
c707cc5 Create secret.txt
38daa61 Update empty.txt
f50086b something for u
                                                                       
└─$ git reset --hard f50086b
HEAD is now at f50086b something for u
                                                                                                                                                                                                                  
└─$ la                           
Permissions Size User Date Modified Name
drwxr-xr-x     - kali  6 Aug 20:52   .git
.rw-r--r--   137 kali  6 Aug 20:52   empty.txt
                                                                                                                                                                                                                  
└─$ cat empty.txt 
this link might be interesting
...
aHR0cHM6Ly93d3cuaW5zdGFncmFtLmNvbS90b2RkX2phc29uX3NlY3VyZS8=
...

└─$ echo -n 'aHR0cHM6Ly93d3cuaW5zdGFncmFtLmNvbS90b2RkX2phc29uX3NlY3VyZS8=' | base64 -d
https://www.instagram.com/todd_jason_secure/         
```

<https://www.instagram.com/p/CeQvnKyr5uK/>:

![missing-1](/assets/ctf/deconstructf/missing-1.png)

<https://www.instagram.com/p/CeQvw7SrCBY/>:

![missing-2](/assets/ctf/deconstructf/missing-2.png)

Twitter: <https://twitter.com/toddjasonsecure>

[Second Post](https://twitter.com/toddjasonsecure/status/1530077483424714752?s=20)

![missing-3](/assets/ctf/deconstructf/missing-3.png)

Encoding looked like Base64, but it failed so I tried Base32 because of leading `===`.

![missing-4](/assets/ctf/deconstructf/missing-4.png)
::: tip Flag
`dsc{h4vINg_FuN_w17h_O5INT_@Nd_m4p5}`
:::