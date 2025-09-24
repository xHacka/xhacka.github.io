# Level 26   Cipher III

[http://suninatas.com/challenge/web26/web26.asp](http://suninatas.com/challenge/web26/web26.asp)

![level-26---cipher-iii.png](/assets/ctf/suninatas/forensics/level-26-cipher-iii.png)

_quipqiup_ is a fast and automated cryptogram solver by [Edwin Olson](http://april.eecs.umich.edu/people/ebolson). It can solve simple substitution ciphers often found in newspapers, including puzzles like cryptoquips (in which word boundaries are preserved) and patristocrats (inwhi chwor dboun darie saren t).

![level-26---cipher-iii-1.png](/assets/ctf/suninatas/forensics/level-26-cipher-iii-1.png)

```
kim yuna is a south korean figure skater she is the olympic champion in ladies singles 
the world champion the four continents champion a three time grand prix final champion 
the world junior champion the junior grand prix final champion and a four time south korean 
national champion kim is the first south korean figure skater to win a medal at an isu junior 
or senior grand prix event is u championship and the olympic games she is the first female skater 
to win the olympic games the world championships the four continents championships and the grand 
prix finals he is one of the most highly recognized athletes and media figures in south korea as 
of april this year she is ranked second in the world by the international skating union she is 
the current record holder for ladies in the short program the free skating and the combined total 
under the isu judging systems he is also the first female skater to surpass the two hu dread point 
mark under the isu judging systems he has never been placed off the podium in her entire career
```

Text successfully recovered, but where flag?

Whole text doesn't work as flag. Considering the challenge author it's probably girl's name
- `kim yuna` doesn't work
- `kimyuna` works

> Flag: `kimyuna`

