# Punched

## Description

![punched-1](/assets/ctf/ekoparty/punched-1.png)

<http://go.ctf.site:10070/TOOLS/punch.zip>

## Solution

We are given bunch of [Punched Cards](https://www.wikiwand.com/en/Punched_card) (COBOL).

```bash
└─$ ls ./punch
0.jpg  3.jpg  6.jpg  9.jpg  c.jpg  f.jpg  i.jpg  l.jpg	o.jpg  r.jpg  u.jpg  x.jpg
1.jpg  4.jpg  7.jpg  a.jpg  d.jpg  g.jpg  j.jpg  m.jpg	p.jpg  s.jpg  v.jpg  y.jpg
2.jpg  5.jpg  8.jpg  b.jpg  e.jpg  h.jpg  k.jpg  n.jpg	q.jpg  t.jpg  w.jpg  z.jpg                                   
```

I found a tool on github to convert images to code at: <https://github.com/digitaltrails/punchedcardreader>

```bash
┌──()-[~/…/ekopartyctf/2023/punched/punchedcardreader]
└─$ for file in $(/bin/ls ../punch -t); do py ./punchedCardReader.py "../punch/$file" >> punch.log; done;
```

```cobol
               MOVE FUNCTION REVERSE("CN") TO WS-FLAG(21:2)                      
       01 WS-USERINPUT     PIC X(12).                                            
               MOVE FUNCTION REVERSE("UP") TO WS-FLAG(19:2)                      
       PROGRAM-ID. CHALLENGE.                                                    
               MOVE FUNCTION REVERSE("DR") TO WS-FLAG(15:2)                      
       01 WS-FLAG P9C X(32).                                                     
       01 WS-SECRETKEY     PIC X(12) VALUE 'G1V3M3ACC3ZZ'.                       
           DISPLAY "CHECKING YOUR SECRET"                                        
       WORKING-STORAGE SECTION.                                                  
       IDENTIFICATION DIVISION.                                                  
           DISPLAY "WELCOME TO EKO, WHAT IS YOUR SECRET: "                       
       MAIN.                                                                     
               MOVE FUNCTION REVERSE("_D") TO WS-FLAG(11:2)                      
               MOVE FUNCTION "HE" TO WS-FLAG(9:2)                                
               MOVE FUNCTION REVERSE("_H") TO WS-FLAG(23:2)                      
               MOVE FUNCTION "MY" TO WS-FLAG(25:2)                               
               MOVE FUNCTION "_F" TO WS-FLAG(27:2)                               
       PROCEDURE DIVISION.                                                       
               MOVE FUNCTION REVERSE("C4") TO WS-FLAG(29:2)                      
               MOVE FUNCTION REVERSE(")3") TO WS-FLAG(31:2)                      
               DISPLAY "OKAY! OKAY! YOU ARE RIGHT"                               
       DATA DIVISION.                                                            
           IF WS-SECRETKEY = WS-USERINPUT THEN                                   
               MOVE FUNCTION "S_" TO WS-FLAG(17:2)                               
               MOVE FUNCTION REVERSE("4C") TO WS-FLAG(13:2)                      
           ACCEPT WS-USERINPUT.                                                  
               MOVE FUNCTION "XX" TO WS-FLAG(25:2)                               
           STOP RUN.                                                             
           END-IF.                                                               
               DISPLAY "NOPE!, YOUR SECRET IS WRONG!"                            
           ELSE                                                                  
               DISPLAY WS-FLAG                                                   
               MOVE FUNCTION REVERSE("KE") TO WS-FLAG(1:2)                       
               MOVE FUNCTION REVERSE("(O") TO WS-FLAG(3:2)                       
               MOVE FUNCTION "PU" TO WS-FLAG(5:2)                                
               MOVE FUNCTION REVERSE("CN") TO WS-FLAG(7:2)                       
```

After slowing going through and sorting the letters by their indexes: `EK0(PUNCHED_C4RDS_PUNCH_MY_F4C3)`
::: tip Flag
`EKO{PUNCHED_C4RDS_PUNCH_MY_F4C3}`
:::
