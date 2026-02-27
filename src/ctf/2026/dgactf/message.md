# Message

## Description

[business_opportunity.eml](https://dgactf.com/files/f37e75b18d505e8f5afffb9269f33855/business_opportunity.eml?token=eyJ1c2VyX2lkIjoyMCwidGVhbV9pZCI6bnVsbCwiZmlsZV9pZCI6MTB9.aZH5_w.V54HcZIZgq4Dl5_1sJGfz0yTKQA)

```http
From: marketing@dgactl.com
To: recipient@dgactf.com
Subject: Exclusive Business Opportunity Just For You!
Date: Sun, 8 Feb 2026 00:49:35 +0000
Content-Type: text/plain; charset="utf-8"
Content-Transfer-Encoding: 7bit
Host: mail.dgactf.com
MIME-Version: 1.0

<!-- mail.dgactf.com -->

Dear Friend , Thank-you for your interest in our publication 
! We will comply with all removal requests . This mail 
is being sent in compliance with Senate bill 2516 ; 
Title 7 ; Section 301 ! This is different than anything 
else you've seen ! Why work for somebody else when 
you can become rich within 55 weeks . Have you ever 
noticed nobody is getting any younger and people love 
convenience ! Well, now is your chance to capitalize 
on this . We will help you turn your business into 
an E-BUSINESS and turn your business into an E-BUSINESS 
! You can begin at absolutely no cost to you . But 
don't believe us . Prof Simpson who resides in Utah 
tried us and says "I was skeptical but it worked for 
me" ! We are licensed to operate in all states ! You 
will blame yourself forever if you don't order now 
. Sign up a friend and you get half off ! Thanks ! 
Dear Salaryman ; Especially for you - this breath-taking 
news ! We will comply with all removal requests . This 
mail is being sent in compliance with Senate bill 1619 
; Title 1 , Section 302 . This is not multi-level marketing 
! Why work for somebody else when you can become rich 
in 47 DAYS ! Have you ever noticed people will do almost 
anything to avoid mailing their bills and people will 
do almost anything to avoid mailing their bills ! Well, 
now is your chance to capitalize on this . We will 
help you turn your business into an E-BUSINESS & use 
credit cards on your website . You can begin at absolutely 
no cost to you . But don't believe us . Mrs Ames who 
resides in Indiana tried us and says "Now I'm rich, 
Rich, RICH" ! This offer is 100% legal ! DO NOT DELAY 
- order today . Sign up a friend and you'll get a discount 
of 80% ! Warmest regards . Dear Internet user , Especially 
for you - this cutting-edge information ! We will comply 
with all removal requests ! This mail is being sent 
in compliance with Senate bill 2416 , Title 1 ; Section 
304 . THIS IS NOT A GET RICH SCHEME ! Why work for 
somebody else when you can become rich within 29 weeks 
. Have you ever noticed people love convenience & nearly 
every commercial on television has a .com on in it 
! Well, now is your chance to capitalize on this . 
We will help you increase customer response by 160% 
and deliver goods right to the customer's doorstep 
! You can begin at absolutely no cost to you ! But 
don't believe us . Mr Jones of California tried us 
and says "My only problem now is where to park all 
my cars" ! We are licensed to operate in all states 
. We implore you - act now ! Sign up a friend and you 
get half off . Thanks .
```

## Solution

We're given a `.eml` file containing what appears to be generic spam. 
The **From** domain `dgactl.com` and **To** domain `dgactf.com` confirm it's CTF-related, but the body looks like a typical junk marketing email.

**Key observations**:
1. The email body has a very specific repetitive structure -- three paragraphs, each following the exact same template:
- "Dear \[name\]..."
- "We will comply with all removal requests"
- "This mail is being sent in compliance with Senate bill XXXX"
- "Why work for somebody else when you can become rich..."
- "Have you ever noticed..."
- "Sign up a friend and you get half off"

2. The slight variations between paragraphs (different bill numbers, names, dollar amounts) are not random -- they encode data.

3. This pattern matches the output of `spammimic`, a steganography tool that encodes secret messages inside realistic-looking spam emails. Each variation in the template (bill number, name, state, etc.) represents encoded bits.

Paste the email body into the decoder at [https://www.spammimic.com/decode.shtml](https://www.spammimic.com/decode.shtml) to reveal the hidden flag.

::: tip Flag
`DGA{1S_TH15_Sp4M_0R_N0t_^$%22TF}`
:::