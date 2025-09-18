# OSINT Challenges

# OSINT Challenges

### **Git**

Do You Know! The current CTF you're participating in is actually running on my BSCS final year project, called [**fypCTF**](https://github.com/asadse7en/fypCTF). Why not take a peek and see if you can find anything interesting?

Flag format: aupCTF{your-answer}

#### Solution

![git-1](/assets/ctf/aupctf/git-1.png)

::: tip Flag
`aupCTF{5t4r-th3-r3p0}`
:::

### **Ash**

Throughout my gaming journey, I have achieved the incredible feat of being a two-time back-to-back Combo Breaker Champion. I'm curious if you can find the exact count of tournaments I have emerged victorious in my primary game.

Flag format: aupCTF{count}

#### Solution

After some googling: [_Arslan Ash lifts second Combo Breaker title for Tekken 7_](https://a-sports.tv/arslan-ash-clinches-second-combo-breaker-championship/)

Results of Tekken 7: [https://liquipedia.net/fighters/Arslan\_Ash/Results](https://liquipedia.net/fighters/Arslan_Ash/Results). He came first 19 times.

::: tip Flag
`aupCTF{19}`
:::

### **Records**

Our website has been hacked, and the attackers have hidden a flag in an unexpected location in a txt. To find the flag, you'll need to look beyond the usual pages and directories on our website. Keep in mind that the attackers may have used clever tricks to hide the flag, so you'll need to be creative in your search. Remember, the flag may be hiding in plain sight, but you'll need to know where to look. Good luck!

[website](https://iasad.me/)

#### Solution

It's unlikely that we have to bruteforce web directories to search for flag. Records and txt, TXT Records?

```powershell
➜ nslookup -query=TXT iasad.me
...
iasad.me        text =

        "aupCTF{st0p-l00k1ing-my-dns-r3c0rds}"
...
```

::: tip Flag
`aupCTF{st0p-l00k1ing-my-dns-r3c0rds}`
:::

### **Centurion**

One of the oldest Institution created by the person in the photo. Your task is to find the institution created by him and find the first ever-batch strength and the date it opened.

[centurion.png](https://aupctf.s3.eu-north-1.amazonaws.com/Centurion.png)

Flag Format: aupCTF{dd/mm/yy\_strengthofthebatch}

#### Solution

Doing reverse search with Google Lens I found the names of people in picture.

![centurion-1](/assets/ctf/aupctf/centurion-1.png)

[File:1917 Darband, SIR GEORGE ROOSE KEPPEL, SAHIBAZADA SIR ABDUL QAYUM.jpg](https://en.wikipedia.org/wiki/File:1917_Darband,_SIR_GEORGE_ROOSE_KEPPEL,_SAHIBAZADA_SIR_ABDUL_QAYUM.jpg)

[_He is perhaps best known for establishing Islamia College, Peshawar on the mould of Sir Syed Ahmad Khan's policy of educating Muslims._](https://kp.gov.pk/page/khan_bahadur_sahibzada_sir_abdul_qayyum_khan/page_type/This%20Page%20officers%20Basic%20Information%20about%20all%20Government%20Departments%20of%20Khyber%20Pakhtunkhwa)

[Historical Background](https://icp.edu.pk/page.php?abc=201506230501115)\
&#xNAN;_&#x54;he College began its instructional activities, six months later i.e on 1st October 1913._

[Islamia College, Peshawar](https://www.topuniversities.com/universities/islamia-college-peshawar)\
&#xNAN;_&#x54;he college, which began its educational voyage with just 33 students in 1913, became a full-fledged University in 2008._

::: tip Flag
`aupCTF{1/10/1913\_33}`
:::

### **Wisdom**

I was curious to discover the total number of books present within our library. help me find it\
[photo](https://aupctf.s3.eu-north-1.amazonaws.com/view.jpg)

Flag format: aupCTF{TotalBooks-TotalJournals}

#### Solution

Doing reverse search with Google Lens I found facebook post by [Agriculture University Pheshwar](https://www.facebook.com/107842807372644/posts/library-/202264251263832/)

Quick google search about university library: [http://www.aup.edu.pk/library.php](http://www.aup.edu.pk/library.php)

| S.No | Details                                            | Total | G.Total  |
| ---- | -------------------------------------------------- | ----- | -------- |
| 1.   | Books                                              |       | 1,13,600 |
| 2.   | Journals                                           |       | ---      |
|      | Journals subscribed (Foreign)                      | 19    | ---      |
|      | Journals subscribed (Local)                        | 9     | ---      |
|      | Journals received through exchange (SJA) (Local)   | 25    | ---      |
|      | Journals received through exchange (SJA) (Foreign) | 3     | ---      |
|      | Gifted journals (Local)                            | 26    | ---      |
|      | Gifted journals (Foreign)                          | 20    | ---      |
|      | Total                                              |       | 102      |
| 3.   | Journals on Microfilms                             |       | 13       |
|      | Journals on Microform                              |       | 11490    |
| 4.   | Newspapers                                         |       | 8        |

::: tip Flag
`aupCTF{113600-11605}`
:::

### **Don't copyvo me**

I love Wikipedia because it's free and open source to view - but I also hate it because people can remove content if they think it's a "copyright violation" - even if it's not. Our University kept having that happen to us - but thankfully our page looks pretty great right now!

Can you tell me who kept doing that to the university and the total bytes of data they deleted? Don't use any commas.

#### Solution

[CTFTime](https://ctftime.org/event/2025/) mentions: _Presented by: Students of Agriculture University Peshawar_

[Agriculture University Peshawar Wikipedia History](https://en.wikipedia.org/w/index.php?title=University_of_Agriculture,_Peshawar\&action=history\&offset=\&limit=500)

My inital answer was `copyright violation` -> User: Justlettersandnumbers, Total Bytes Deleted: 13793, but it was incorrect. I then tried to search for `copy` and there was a match -> User: Joelmills, Total Bytes Deleted: 19969.

::: tip Flag
`aupCTF{Joelmills\_19969}`
:::

### **About-Face**

I'd love to work for a social media company when they're just starting out. Imagine getting a job at thefacebook, I mean facebook, I mean Meta - whatever they want to go by these days, way back when?

Come to think of it, dropping the from their name was probably the smartest idea they ever had. My uncle said he applied for a role with their Network Operations team after he heard that they dropped 'the' from their name, but never heard back and thinks it's because the person he emailed left their job.

I don't believe him, but he told me I can always reach out to the person he emailed to confirm. I doubt they still work there, but can you tell me the role he applied for and the first name of the person he reached out to? He said it should be easy to figure out - that team had only one role available that year and he applied before December.

Flag Format: aupCTF{role\_title\_firstname} All lowercase.

#### Soluton

_The company dropped 'The' from its name after purchasing the domain name facebook.com in 2005 for $200,000. The following year, the platform was made available for high school students, and in 2006, it became accessible to the general public._

We know that facebook changed domain in 2005, meaning we should look into facebook before 2005 and as description mentioned before December. Jumping into [Wayback Machine](https://web.archive.org) and looking up `facebook.com` we see tons of snapshots. We are intersted in 2005, before December. I opened [_NOVEMBER 27, 2005_](https://web.archive.org/web/20051127012934/http://www.facebook.com/).

![about-face-1](/assets/ctf/aupctf/about-face-1.png)

![about-face-2](/assets/ctf/aupctf/about-face-2.png)

::: tip Flag
`aupCTF{senior\_linux\_systems\_administrator\_robin}`
:::
