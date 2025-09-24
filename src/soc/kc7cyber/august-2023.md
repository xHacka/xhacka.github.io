# August 2023

## 9: August 1, 2023

### 1. You've heard of the recent malicious AI model from the July 26, 2023 questions. What is the new AI model that people are describing as its successor and is being actively sold on the darkweb?

[The Dark Side of Generative AI: Five Malicious LLMs Found on the Dark Web](https://www.infosecurityeurope.com/en-gb/blog/threat-vectors/generative-ai-dark-web-bots.html)

As far as I remember **WormGPT** was the first malicious LLM model that was found, blog next talks about **FraudGPT** so that must be it.

> Flag: `FraudGPT`
### 2. What common digital forensics tool is used to extract metadata from file formats?

[Exiftool: website](https://exiftool.org)
[Exiftool: man](https://linux.die.net/man/1/exiftool)

> Flag: `exiftool`

## 10: August 2, 2023

### 1. A hacker group has been targeting organizations using a backdoor codenamed EyeShell. What is the name of this group?

[Patchwork Hackers Use Eyeshell Backdoor To Launch Hacking Campaign Against China](https://blog.koddos.net/patchwork-hackers-use-eyeshell-backdoor-to-launch-hacking-campaign-against-china/)

> Flag: `Patchwork`

### 2. Where is this group suspected to originate from?

[Patchwork](https://attack.mitre.org/groups/G0040) is a cyber espionage group that was first observed in December 2015. While the group has not been definitively attributed, circumstantial evidence suggests the group may be a pro-Indian or Indian entity.

> Flag: `India`

### 3. They've using another backdoor implant recently this year. What was it called?

[Dark Web Profile: Patchwork APT](https://socradar.io/dark-web-profile-patchwork-apt/)

[Patchwork](https://attack.mitre.org/groups/G0040/) is an Indian threat actor that has been active since December 2015 and usually targets Pakistan via spear phishing attacks. In its most recent campaign from late November to early December 2021, Patchwork has used malicious RTF files to drop a variant of the **BADNEWS** (Ragnatela) Remote Administration Trojan (RAT). [Source](https://www.threatdown.com/blog/patchwork-apt-caught-in-its-own-web/)

> Answer: `BADNEWS`

### 4. What is the common encryption key used to decrypt the 32-byte chunks of the embedded files on the implant?

[Patchwork Continues to Deliver BADNEWS to the Indian Subcontinent](https://unit42.paloaltonetworks.com/unit42-patchwork-continues-deliver-badnews-indian-subcontinent/)

After lots of keyword google searches I ended up on: [https://pub-7cb8ac806c1b4c4383e585c474a24719.r2.dev/b910f06ecd66d0a297e2043369b82a29cf770eee.txt](https://pub-7cb8ac806c1b4c4383e585c474a24719.r2.dev/b910f06ecd66d0a297e2043369b82a29cf770eee.txt)

```bash
MONSOON – ANALYSIS OF AN APT CAMPAIGN

Revision: 1.07 | TLP-WHITE | 17/57

Forcepoint™ Security Labs™ | Special Investigations
The decryption routine uses the encryption key "ludos" 7 to decrypt 32-byte chunks of the embedded files:
```

The document which is shown as TXT is [MONSOON - Analysis Of An APT Campaign](https://www.forcepoint.com/sites/default/files/resources/files/forcepoint-security-labs-monsoon-analysis-report.pdf) ([src](https://app.tidalcyber.com/references/ea64a3a5-a248-44bb-98cd-f7e3d4c23d4e))

![august-2023.png](/assets/soc/kc7cyber/daily/august-2023.png)

> Answer: `ludos`
## 11: August 3, 2023

### 1: What is the common file extension used by virtual disk images created using software from the company VMWare?

common **VMware file extensions** and their purposes:

1.  **.vmx**: These are **configuration files** for virtual machines. They contain settings and specifications for the virtual hardware, such as CPU, memory, and network adapters.
2.  **.vmdk**: These files are **virtual disk files** that store the actual data of the virtual machines. They represent the hard drive or storage for the VM.
3.  **.vmwarevm**: Specifically used by **VMware Fusion** on Macs, these files contain all the information necessary for a virtual machine. They bundle together the configuration, virtual disk, and other related files.
4.  **.vmsn**, **.vmsd**, **.delta.vmdk**: These files are related to **snapshots** of virtual machines. Snapshots allow you to capture the state of a VM at a specific point in time, including memory and disk contents.
5.  **.vmem**, **.nvram**: The **.vmem** file stores the **memory state** of a virtual machine, while the **.nvram** file holds the **BIOS settings** for the VM.
6.  **.log**: These are **log files** that record events and activities related to the virtual machine. They can be helpful for troubleshooting and diagnosing issues.

> Flag: `vmdk`
### 2: What is the practice of concealing information, typically in a digital photograph or other type of digital visualization file?

[**Steganography**](https://www.wikiwand.com/en/Steganography) is the art of hiding information within other seemingly innocuous data. It conceals messages or files within images, audio, or text, making them imperceptible to casual observers. By subtly altering the carrier medium, steganography ensures that the hidden content remains undetected unless specifically sought out. 🕵️‍♂️🔍

Recommended read: [Steganography - A list of useful tools and resources - 0xRick’s Blog](https://0xrick.github.io/lists/stego/)

> Flag: `Steganography` or `stego`
### 3: What's the well known Linux tool that verifies the integrity of several media files, including the popular PNG file type?

[pngcheck](https://linuxcommandlibrary.com/man/pngcheck#tldr): Print detailed information about and verify PNG, JNG, and MNG files.

Recommended read: [Pngcheck - bi0s wiki](https://wiki.bi0s.in/steganography/pngcheck/)

> Flag: `pngcheck`
## 12: August 4, 2023

### 1: A recent mobile management software company disclosed a critical zero day vulnerability. What is the name of this company?

Some OSINT required. I used google filter to limit search results around `August 4`. 
Ended up on: [Ivanti EPMM zero-day vulnerability exploited in wild | TechTarget](https://www.techtarget.com/searchsecurity/news/366545659/Ivanti-EPMM-zero-day-vulnerability-exploited-in-wild)

> Flag: `Ivanti`

### 2: What was the CVE ID of the zero day vulnerability?

From last post we learned CVE ID.

Detailed Report: [CVE-2023-35078: Ivanti Endpoint Manager Mobile (EPMM) / MobileIron Core Unauthenticated API Access Vulnerability - Blog | Tenable](https://www.tenable.com/blog/cve-2023-35078-ivanti-endpoint-manager-mobile-epmm-mobileiron-core-unauthenticated-api-access)

> Flag: `CVE-2023-35078`

### 3: A secondy zero day vulnerability was announcing shortly after from the same company. What was its CVE ID?

Report from previous includes the follow up CVE ID.

> Flag: `CVE-2023-35081`

## 13: August 5, 2023

### 1: What does VPN stand for?

From a hacker’s perspective, a VPN ([Virtual Private Network](https://www.wikiwand.com/en/Virtual_private_network)) is a tool for obfuscation and protection. It masks your IP address, making your online actions harder to trace back to you. It encrypts your data, protecting it from interception during transmission. It can also bypass geo-restrictions and firewalls, providing access to otherwise inaccessible content or systems. However, remember that ethical and legal use of such tools is crucial. Misuse can lead to serious consequences. Always respect privacy and laws.
 
> Flag: `Virtual Private Network`

### 2: What does TOR stand for?

[The Onion Router](https://www.torproject.org/) (TOR) is a network that enables anonymous communication. It routes internet traffic through a series of volunteer-operated servers worldwide, making the tracking of internet activity extremely difficult. It can also access the dark web, a part of the internet not indexed by traditional search engines. However, it’s important to note that while TOR provides anonymity, it doesn’t guarantee security. Ethical and legal use is paramount.

> Flag: `The Onion Router`

### 3: Is it illegal to use VPNs or Tor? Yay or nay.

Using VPNs and Tor is generally legal, but the legality varies by country and the activities conducted. In many countries, VPNs are legal and widely used for privacy and security, but in some restrictive regimes, they may be illegal. Similarly, the Tor browser is legal in most countries, but using it for illegal activities can result in legal consequences. From a hacker's perspective, VPNs may offer some anonymity, but Tor is seen as more anonymous. Combining Tor with a VPN can enhance privacy. Ultimately, responsible and lawful use of these tools is crucial to avoid legal issues and ensure online safety and privacy.

More about Privacy and Anonymity: [Internet privacy and security course](https://book.cyberyozh.com/?fl=en) by [CyberYozh](https://cyberyozh.com/).

> Flag: `nay` (_Generally_)

## 14: August 6, 2023

### 1: Who is widely credited for creating the first computer?

[Charles Babbage | Biography, Computers, Inventions, & Facts | Britannica](https://www.britannica.com/biography/Charles-Babbage)
 
> Flag: `Charles Babbage`

### 2: What did they call it at the time?

From 1 post:

_During the mid-1830s Babbage developed plans for the [Analytical Engine](https://www.britannica.com/technology/Analytical-Engine), the forerunner of the modern digital computer. In that device he [envisioned](https://www.merriam-webster.com/dictionary/envisioned) the capability of performing any arithmetical operation on the basis of instructions from punched cards, a memory unit in which to store numbers, sequential control, and most of the other basic elements of the present-day computer._

> Flag: `Analytical Engine`

### 3: Who realized that it could be used outside of what it was originally intended for, which led to the imagination of the modern day computer?

From 1 post:

_In 1843 Babbage’s friend mathematician [Ada Lovelace](https://www.britannica.com/biography/Ada-Lovelace) translated a French paper about the Analytical Engine and, in her own [annotations](https://www.merriam-webster.com/dictionary/annotations), published how it could perform a sequence of calculations, the first [computer program](https://www.britannica.com/technology/computer-program)._

> Flag: `Ada Lovelace`

## 15: August 7, 2023

### 1: Which programming language is named after an old comedy sketch series?

Source: [History of Python](https://www.wikiwand.com/en/History_of_Python)

Python was named after the [BBC TV](https://www.wikiwand.com/en/BBC_TV "BBC TV") show _[Monty Python's Flying Circus](https://www.wikiwand.com/en/Monty_Python's_Flying_Circus "Monty Python's Flying Circus")_. 

> Flag: `Python`

### 2: What common module used by this language is useful for data analytics and working with large amounts of structured data to create dataframes?

[pandas - Python Data Analysis Library](https://pandas.pydata.org/docs/user_guide/index.html)

> The name “Pandas” was derived from the term “Panel Data”, an econometrics term for multidimensional structured data sets.

> Flag: `pandas`

### 3: What application is useful to create a notebook of sorts for this programming language? 

[Jupyter Notebook](https://jupyter.org/) is a web application for creating and sharing documents. It supports live code, visualizations, and text. It’s used for data cleaning, transformation, statistical modeling, visualization, and machine learning. It supports multiple languages, primarily Python. It’s open-source and widely used.

> Flag: `Jupyter`

## 16: August 8, 2023

### 1: Which reverse engineering tool has a logo of a red dragon?

[Ghidra](https://github.com/NationalSecurityAgency/ghidra) is a software reverse engineering tool developed by the National Security Agency (NSA). It helps analyze malicious code and malware like viruses, and can give cybersecurity professionals a better understanding of potential vulnerabilities in their networks. It’s open-source and free to use.

> Flag: `Ghidra`

### 2: Who developed it?

Discussed in 1.

> Flag: `NSA`

### 3: What is the decompiler component written in?

GitHub repository in 1.

Surprisingly (to me) the decompiler is written in C++ and not Java (Java 85.6%, C++ 6.9%). You can search function to find `cpp` files usage.

> **Fun Fact**: Press `.` while in GitHub repository to open project in `github.dev` (Live VSCode) \[*Requires To Be Logged In*\]
> **or** you can use `github1s.com` to open project in Live VSCode (just add `1s` to url next to `github`.

> Flag: `C++`

## 17: August 9, 2023

### 1: Which penetration testing distribution is also the name of a major Hindu goddess?

The penetration testing distribution that is also the name of a major Hindu goddess is **[Kali](https://www.kali.org/)**. Kali Linux is a Debian-derived Linux distribution designed for digital forensics and penetration testing. It is maintained and funded by Offensive Security Ltd. In Hinduism, Kali is a goddess associated with empowerment and destruction.

> Flag: `Kali`

### 2: Who maintains this distribution?

Discussed in 1.

> Flag: `Offensive Security`

### 3: Which penetration testing framework is included with this distribution that's developed by the company Rapid7?

The penetration testing framework developed by Rapid7 that is included with Kali Linux is **[Metasploit](https://www.metasploit.com/)**. Metasploit is an open-source tool used for developing, testing, and executing exploit code against target systems. It's widely used in cybersecurity to find vulnerabilities in networks, systems, and applications¹². It's important to use such tools responsibly and ethically, as misuse can lead to legal consequences. Always respect privacy and laws. 

> Flag: `Metasploit`

## 18: August 10, 2023

### 1: What is the linux command to get the manual of an application?

[man](https://www.man7.org/linux/man-pages/man1/man.1.html) - an interface to the system reference manuals

_When in doubt [RTFM](https://www.wikiwand.com/en/RTFM)_

> Flag: `man`

### 2: What is a common linux command to search text data that match a regular expression?

[grep](https://www.man7.org/linux/man-pages/man1/grep.1.html) - print lines that match patterns.

While regular expressions are scary, its a very useful tool in your arsenal.

> Flag: `grep`

## 19: August 11, 2023

### 1: (HARD) - `ZTQgZjQgMzQgNjQgNTQgNDQgNDUgMTQgNTQgMjUgMTQgNTQgNzU=`

1. From Base64: `e4 f4 34 64 54 44 45 14 54 25 14 54 75`
2. Rev: `57 45 41 52 45 41 54 44 45 46 43 4f 4e`
3. From Hex: `WEAREATDEFCON`

[Recipe](https://gchq.github.io/CyberChef/#recipe=From_Base64('A-Za-z0-9%2B/%3D',true,false)Reverse('Character')From_Hex('Auto')&input=WlRRZ1pqUWdNelFnTmpRZ05UUWdORFFnTkRVZ01UUWdOVFFnTWpVZ01UUWdOVFFnTnpVPSA&ieol=CRLF)

> Flag: `WEAREATDEFCON`

## 20: August 12, 2023

### 1. What is the MITRE ATT&CK ID for Phishing?

[Techniques > Enterprise > Phishing > T1566](https://attack.mitre.org/techniques/T1566/)

> Flag: `T1566`

### 2. What tactic is phishing according to MITRE?

It's listed in the T1566.

> Flag: `Initial Access`

### 3. What's the ID for that tactic?

[Tactics > Enterprise > Initial Access > TA0001](https://attack.mitre.org/tactics/TA0001/)

> Flag: `TA0001`

## 21: August 13, 2023

### 1. What command line tool can be used to look for printable characters of 4 or more in a file?

[https://linux.die.net/man/1/strings](https://linux.die.net/man/1/strings)

> Flag: `strings`

### 2. In reverse engineering, what type of analysis is used to investigate applications or files without executing them?

> Flag: `static`

### 3. In reverse engineering, what type of analysis is used to investigate applications or files by observing their behavior once executed?

> Flag: `dynamic`

## 22: August 14, 2023

### 1. Using the Metasploit framework, what command is used to view all available exploit modules?

[https://www.offsec.com/metasploit-unleashed/msfconsole-commands/#exploits](https://www.offsec.com/metasploit-unleashed/msfconsole-commands/#exploits)

> Flag: `show exploits`
### 2. What common tool is used to enumerate Active Directory in order to find attack paths?

[BloodHound CE](https://github.com/SpecterOps/BloodHound)

> Flag: `bloodhound`
### 3. What file in Linux contains information about a user's password? Provide the full path.

`/etc/passwd` contains user database. Second column is password and `*` means value is taken from `/etc/shadow` as it's only readable/writeable by root.

> Flag: `/etc/shadow`

## 23: August 15, 2023

### 1. On the day Russia invaded Ukraine, a satellite communications company was hacked. What was the name of the company?

The **[Viasat hack](https://www.wikiwand.com/en/articles/Viasat_hack)** was a cyberattack against the satellite internet system of American communications company Viasat which affected their [KA-SAT](https://www.wikiwand.com/en/articles/KA-SAT) network. The hack happened on the day of [Russia's invasion of Ukraine](https://www.wikiwand.com/en/articles/Russian_invasion_of_Ukraine). Only the broadband customers were targeted.

> Flag: `Viasat`

### 2. A wiper malware was associated with this event. What was it called?

_[New variant of AcidRain modem viper that hit Viasat spotted in the wild](https://www.cybersecurity-help.cz/blog/3873.html)_

> Flag: `AcidRain`
### 3. It was loosely similar to what other piece of malware?

From the same blog post: _AcidRain is an ELF MIPS malware designed to wipe modems and routers. Security researchers identified some similarities between AcidRain and the [VPNFilter](https://www.cybersecurity-help.cz/blog/1881.html) malware linked to the Russian state-backed threat actor Sandworm._

> Flag: `VPNFilter`

## 24: August 16, 2023

### 1. What is the full image URL of the KC7 logo on the top left of the page?

> Flag: `https://kc7cyber.com/static/images/kc7logo.png`

### 2. What is the md5 hash of the URL?

```bash
└─$ echo -n 'https://kc7cyber.com/static/images/kc7logo.png' | md5sum
fc7efd8e1da69efa638d0dd7f3b94738  -
```

> Flag: `fc7efd8e1da69efa638d0dd7f3b94738`

## 25: August 17, 2023

### 1. What forensic artifact contains a user's view preferences for folder in Windows?

[Windows.Forensics.Shellbags](https://docs.velociraptor.app/artifact_references/pages/windows.forensics.shellbags/): _Windows uses the Shellbag keys to store user preferences for GUI folder display within Windows Explorer._

> Flag: `Shellbags`

### 2. What file is this artifact located in (Windows 7 or later)?

[Windows ShellBag Forensics in Depth](https://www.giac.org/paper/gcfa/9576/windows-shellbag-forensics-in-depth/128522)

_The UsrClass. dat stores the ShellBag information for the Desktop, ZIP files, remote folders, local folders, Windows special folders and virtual folders. ShellBag registry keys and values in Windows 7, 8 and 8.1 can be found in files below. `%UserProfile%\AppData\Local\Microsoft\Windows\UsrClass`._

Velociraptor also contained this file in parameters: `C:/Users/*/AppData/Local/Microsoft/Windows/UsrClass.dat`

> Flag: `UsrClass.dat`

## 26: August 18, 2023

### 1. According to MaxMind, which country is the IP address 185.220.102.6 located in?

[GeoIP databases demo | MaxMind](https://www.maxmind.com/en/geoip-demo)

| IP Address    | Location             | Network          | Postal Code | Approximate Latitude / Longitude*, and Accuracy Radius | ISP / Organization            | Domain         | Connection Type |
| ------------- | -------------------- | ---------------- | ----------- | ------------------------------------------------------ | ----------------------------- | -------------- | --------------- |
| 185.220.102.6 | Germany (DE), Europe | 185.220.102.0/27 | -           | 51.2993, 9.491 (200 km)                                | Stiftung Erneuerbare Freiheit | torservers.net | Corporate       |
> Flag: `Germany`

### 2. What domain is it associated with (as of 15 August 2023)?

> Flag: `torservers.net`

### 3. What was the first issuer CN for the SSL certificate of this domain?

[https://crt.sh/?q=torservers.net](https://crt.sh/?q=torservers.net)

> Flag: `StartCom Class 1 Primary Intermediate Server CA`

## 27: August 19, 2023

### 1. Which information stealing malware recently came back after a hiatus? Two words

[Raccoon Stealer malware returns with new stealthier version](https://www.bleepingcomputer.com/news/security/raccoon-stealer-malware-returns-with-new-stealthier-version/)

> Flag: `Raccoon Stealer`

### 2. What's the newest version number as of August 19?

> Flag: `2.3.0`

### 3. In 2022, one of the developers was arrested. What was their name?

> Flag: `Mark Sokolovsky`

## 28: August 20, 2023

### 1. On August 16, 2023, CISA added a CVE to its known exploited vulnerabilities catalog. Which CVE was this?

[CISA Adds One Known Exploited Vulnerability to Catalog](https://www.cisa.gov/news-events/alerts/2023/08/16/cisa-adds-one-known-exploited-vulnerability-catalog) (Release Date: August 16, 2023)

> Flag: `CVE-2023-24489`

### 2. Which specific product is targeted by this CVE?

[CVE-2023-24489](https://nvd.nist.gov/vuln/detail/CVE-2023-24489) Detail: _A vulnerability has been discovered in the customer-managed ShareFile storage zones controller which, if exploited, could allow an unauthenticated attacker to remotely compromise the customer-managed ShareFile storage zones controller._

> Flag: `ShareFile`

## 29: August 21, 2023

### 1. Which NMAP flag is used for OS detection?

```bash
└─$ man nmap
...
   OS DETECTION:
	 -O: Enable OS detection
	 --osscan-limit: Limit OS detection to promising targets
	 --osscan-guess: Guess OS more aggressively
...
```

> Flag: `-O`
### 2. Which NMAP flag is used for ACK scans?

```bash
└─$ man nmap
...
   -sA (TCP ACK scan)
	   This scan is different than the others discussed so far in that it never determines open (or
	   even open|filtered) ports. It is used to map out firewall rulesets, determining whether they are
	   stateful or not and which ports are filtered.

	   The ACK scan probe packet has only the ACK flag set (unless you use --scanflags). When scanning
	   unfiltered systems, open and closed ports will both return a RST packet. Nmap then labels them
	   as unfiltered, meaning that they are reachable by the ACK packet, but whether they are open or
	   closed is undetermined. Ports that don't respond, or send certain ICMP error messages back (type
	   3, code 0, 1, 2, 3, 9, 10, or 13), are labeled filtered.
...
```

> Flag: `-sA`

## 30: August 22, 2023

### 1. What model, developed by David J Bianco, is used to model effectiveness of certain indicators to counter adversaries?

[AttackIQ > Glossary > What is the Pyramid of Pain?](https://www.attackiq.com/glossary/pyramid-of-pain/)

> Flag: `Pyramid of Pain`

### 2. What is the toughest indicator?

![blog-pyramid-pain-01-768x432](https://www.attackiq.com/wp-content/uploads/2019/06/blog-pyramid-pain-01-768x432.jpg)

> Flag: `TTPs`

### 3. What is the most trivial indicator?

> Flag; `Hash Values`

## 31: August 23, 2023

### 1. What major cyber adversary-focused conference was announced recently, to be hosted in November 2023?

_[CYBERWARCON](https://www.cyberwarcon.com) is a one-day conference in Arlington, VA focused on the specter of destruction, disruption, and malicious influence on our society through cyber capabilities._

> Flag: `CYBERWARCON`

### 2. Who talked last year about China's efforts to stand up its cybersecurity talent and pooling pipeline?

[China’s CyberAI Talent Pipeline](https://cset.georgetown.edu/publication/chinas-cyberai-talent-pipeline/)
Author: Dakota Cary
Date: July 2021

> Flag: `Dakota Cary`

### 3. What primary color were the socks sent to some people in the cybersecurity industry this year?

Source: guessing 🥴

> Flag: `Pink`

## 32: August 24, 2023

### 1. `1f 8b 08 00 6d e2 de 64 00 ff 05 40 41 0a 00 30 08 7a ab b0 0e 23 57 81 83 be 2f 73 c9 de 0f e6 c3 a9 90 0c f9 0a 5b cb 11 00 00 00`

After trying few expected combinations I was unsuccessful. Then I tried `Magic` from CyberChef and it solved almost immediately.

`From Hex -> Gunzip -> pillowtalkmadness`

[Recipe](https://gchq.github.io/CyberChef/#recipe=From_Hex('Space')Gunzip()&ieol=CRLF)

> Flag: `pillowtalkmadness`

## 33: August 25, 2023

### 1. `48 40 48 4a 40 46 32 43 36 41 36 43 44 3a 44 45 36 3f 45`

`From Hex -> ROT47 -> wowyouarepersistent`

> Flag: `wowyouarepersistent`

## 34: August 26, 2023

### 1. `00111001 00110000 00100000 00111001 00110100 00100000 00111001 00110011 00100000 00111001 01100001 00100000 00111000 01100010 00100000 00111000 01100011 00100000 00111000 01100010 00100000 00111000 01100100 00100000 00111000 00110110 00100000 00111000 01100010 00100000 00111001 00110111 00100000 00111001 00110110 00100000 00111000 01100011 00100000 00111001 00110001 00100000 00111001 00110000 00100000 00111000 00111000 00100000 01100011 00110000`

```
From Binary -> 90 94 93 9a 8b 8c 8b 8d 86 8b 97 96 8c 91 90 88 c0
From Hex    -> Garbage
```

The hint mentions `FFine`, which is probably for [Affine Cipher](https://www.wikiwand.com/en/articles/Affine_cipher). Going through few iterations didn't work, so I decided to brute all the values.

```python
def affine_decrypt(ciphertext, a, b):
    m = 256  # Byte range (0-255)
    a_inv = pow(a, -1, m)
    return bytes([(a_inv * (byte - b)) % m for byte in ciphertext])

def brute_force_affine(ciphertext):
    m = 256 # Max value 
    for a in range(1, m):
        try:
            for b in range(m):
                decrypted = affine_decrypt(ciphertext, a, b).decode("utf-8", errors="ignore")
                yield f'a={a}, b={b}: {decrypted}'
        except ValueError:
            continue

    return results


ciphertext = bytes.fromhex('9094939a8b8c8b8d868b97968c919088c0')
results = brute_force_affine(ciphertext)
for result in results:
    if result.isprintable() and result.isascii():
        print(result)
```

At the end we see something that looks like a flag:
```bash
...
a=255, b=253: mijcrqrpwrfgqlmu=
a=255, b=254: njkdsrsqxsghrmnv>
a=255, b=255: okletstrythisnow?
```

> Flag: `okletstrythisnow?`

## 35: August 27, 2023

### 1. In reverse engineering malware, which import function is typically associated with internet connections? For example, something like "Internet Open"

[WinINet](https://learn.microsoft.com/en-us/windows/win32/wininet/about-wininet): _The Windows Internet (WinINet) application programming interface (API) enables your application to interact with FTP and HTTP protocols to access Internet resources. As standards evolve, these functions handle the changes in underlying protocols, enabling them to maintain consistent behavior._

> Flag: `WinINet`

### 2. Which import function is typically used to make changes to the registry?

My initial answer was `Winreg` as [RegSetValue](https://learn.microsoft.com/en-us/windows/win32/api/winreg/nf-winreg-regsetvaluea) is from that module, but it didn't like that.

Some OSINT:
- [Cheatsheet: Windows Malware Analysis and Reversing](https://fareedfauzi.github.io/2022/08/08/Malware-analysis-cheatsheet.html)
- [Practical Malware Analysis — Chapter 6 Labs](https://ellisstannard.medium.com/practical-malware-analysis-chapter-6-labs-d02de4a890d4): _ADVAPI32.DLL is the Advanced API services library which is a utility that is designed to support APIs including registry and security calls._
	- [Server Core Functions by DLL](https://learn.microsoft.com/en-us/previous-versions/windows/desktop/legacy/ee391633(v=vs.85))

`ADVAPI32` module also supports the same registry functions.

> Flag: `advapi32`

## 36: August 28, 2023

### 1. In Windows Operating Systems, one or more \_\_ may run in context within a running process.

> Flag: `Threads`

## 37: August 29, 2023

### 1. How many bits are in an MD5 hash?

_Each MD5 hash looks like 32 numbers and letters, but each digit is in hexadecimal and represents four bits. Since a single character represents eight bits (to form a byte), the total bit count of an MD5 hash is **128 bits**._ ([source](www.avast.com/c-md5-hashing-algorithm))

> Flag: `128`

### 2. Who designed the MD5 hash?

[RFC1321](https://datatracker.ietf.org/doc/html/rfc1321): The MD5 Message-Digest Algorithm

Network Working Group         R. Rivest

> Flag: `Ronald Rivest`

## 38: August 30, 2023

### 1. The United States White House supported which village at DEFCON 31?

[TheWhiteHouse > Red-Teaming Large Language Models to Identify Novel AI Risks](https://www.whitehouse.gov/ostp/news-updates/2023/08/29/red-teaming-large-language-models-to-identify-novel-ai-risks/): _The event was held at the AI Village during DEF CON 31, one of the world’s leading cybersecurity conferences, and organized by AI Village, SeedAI, Humane Intelligence, and their partners._

> Flag: `AI Village`

## 39: August 31, 2023

### 1. Which KQL function takes a string, interprets it as JSON, and returns the value as dynamic?

[parse_json()](https://learn.microsoft.com/en-us/kusto/query/parse-json-function?view=microsoft-fabric)

> Flag: `parse_json`

### 2. What's the other KQL function that returns the JSON value as a specific type?

[extract_json()](https://learn.microsoft.com/en-us/kusto/query/extract-json-function?view=microsoft-fabric)

> Flag: `extract_json`

