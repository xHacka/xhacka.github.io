# First Contact

## \[☆☆☆\] Hard choices

### Description

The sky tore open as the ship descended, a gleaming monolith against the midday sun. Without warning, every screen flickered - phones, billboards, watches - replaced by a single message: "You are invited." A voice followed: "This is the first contact. Your species has been selected to participate in CyberGame, an interstellar CTF. Success grants you access to galactic science, post-scarcity tech, and diplomatic recognition. Failure means we proceed with scheduled construction of a hyperspace bypass that, regrettably, requires the demolition of your planet. Here is Message One."

Then a stream of cryptic data pulsed across the screens - elegant, alien, and waiting.

Additional instructions from the Earth Command:

- download the file,
- find a hidden message,
- the messages are in the format SK-CERT{something} unless stated otherwise. Enter the full flag from the first "S" to the last "}".
- do not write anything else into the answer field; the aliens expect the exact flag.

 [part1.txt](https://ctf-world.cybergame.sk/files/047ab5a3cfa53f6a6d73e9b51da890d5/part1.txt?token=eyJ1c2VyX2lkIjoyOTQsInRlYW1faWQiOm51bGwsImZpbGVfaWQiOjI2fQ.aBZC_g.68jU2NAl-yNO-REbgsVBtaj_6ic "part1.txt")

### Solution

Just download file (?) 😳
```
The flag is SK-CERT{th1s-w0rks-w3ll}. This first part is easy.
```

> Flag: `SK-CERT{th1s-w0rks-w3ll}`

## \[☆☆☆\] In competition with jellyfish

### Description

EN The alien ship projected a new message: "Congratulations, Earthlings. The first part has been successfully solved by three people, fifteen orcas, one octopus, a colony of ants, and two jellyfish. Let's make it harder!". It almost sounded like an insult.

> [https://files.cybergame.sk/first-contact-f610c0c9-f16b-476a-8ffe-b87460e29677/part2.html](https://files.cybergame.sk/first-contact-f610c0c9-f16b-476a-8ffe-b87460e29677/part2.html)

Additional instructions from the Earth Command:

- click the link
- find a hidden message
- you need to dig deeper. Lots of options here - see the source, or download the file and open it in a text editor.
- it will be in the SK-CERT{something} format, you know the drill

### Solution

Lots of `span` tag usage, but no CSS or anything.

![First Contact.png](/assets/ctf/cybergame/2025/forensics/First Contact.png)

In the console tab:
```bash
> console.log([...document.querySelectorAll('span')].map(node => node.innerText).join(''));
SK-CERT{hello}
```

> Flag: `SK-CERT{hello}`

## \[☆☆☆\] So long, but wait, we’re still playing!

### Description

EN The alien ship updated their omnipresent dashboards after the second flag: ants are out. One last jellyfish remains in the game. One octopus. And you. Meanwhile, the orcas fled the planet. No pressure, right?

New day, new challenge. The message says:

> Jura vg pbzrf gb pryrfgvny zbirzragf, FX-PREG{ebg4gv0a} vf cvibgny.

Additional instruction from the jellyfish:

- do NOT enter dumb stuff. The flag is in the form SK-CERT{something}, not FX-PREG.
- this time you may need CyberChef

### Solution

Looks ROT13 so that's the first thing I tried

![First Contact-1.png](/assets/ctf/cybergame/2025/forensics/First Contact-1.png)

> [https://rot13.com](https://rot13.com)

```
When it comes to celestial movements, SK-CERT{rot4ti0n} is pivotal.
```

> Flag: `SK-CERT{rot4ti0n}`

## \[☆☆☆\] Still fighting

### Description

The alien ship fell eerily silent for a moment. Then, in a deep sarcastic tone: *"Congratulations, human. You've managed to outwit jellyfish. The galaxy is... impressed."*

A single clap echoed through every smart speaker on Earth. It almost felt like the sound was made with just one hand, but that's impossible, right? Right?

Then the voice continued: *"One jellyfish short of a leaderboard and still you persist. Very well. Let's see if you covered all your bases."*

```
Once upon a time, there was an encoded message VGhlIGVuY29kZWQgbWVzc2FnZSBzYWlkIGRHaGxJR1pzWVdjZ2FYTWdhR2xrWkdWdUlHUmxaWEJsY2lCaVdGWnFZVU5DYTFwWFZuZGFXRWxuV1d4b1YyRnRSa1JrTW1ScFYwWmFjVmxWVGtOaE1YQllWbTVrWVZkRmJHNVdiWFJyWWpKS1JtSkZhRTVXTTJoeFZGUkJNV0l4WkhGVGJGcGhUV3RhV2xaR1VtRlRiRXB5VGxVeFZWSnNXbEJWYlhoWFl6RldjVnBGT1ZOTk1tZ3pWa1pTU2sxV2JGZGhSRnBWWW14YVlWcFhkRXRqYkZKVlVsUlNUazFyV2taVlZ6VnpWR3hPUjFkdVZscFdWMUV3VmpJeFlWWkZOVWhhUm1Sb1RXeEtNbGRYZEZkak1VNUhWMjVXVjJKVldsTmFWM2hMVkZaRmVWbDZiRkZWVnpnNVEyYzlQUW89Cg==
```

Additional instruction from the orcas, transmitting back home from the nearest star cluster:

- CyberChef is your friend.

### Solution

![First Contact-2.png](/assets/ctf/cybergame/2025/forensics/First Contact-2.png)

![First Contact-3.png](/assets/ctf/cybergame/2025/forensics/First Contact-3.png)

This got very repetitive so I just looped over using CyberChef

![First Contact-4.png](/assets/ctf/cybergame/2025/forensics/First Contact-4.png)

[Recipe](https://gchq.github.io/CyberChef/#recipe=Label\('start'\)From_Base64\('A-Za-z0-9%2B/%3D',true,false\)Regular_expression\('Strings','%5BA-Za-z%5C%5Cd/%5C%5C-:.,_$%25%5C%5Cx27%22\(\)%3C%3E%3D!%5C%5C%5B%5C%5C%5D%7B%7D@%5D%7B10,%7D',true,true,false,false,false,false,'List%20matches'\)Jump\('start',4\)&input=VkdobElHVnVZMjlrWldRZ2JXVnpjMkZuWlNCellXbGtJR1JIYUd4SlIxcHpXVmRqWjJGWVRXZGhSMnhyV2tkV2RVbEhVbXhhV0VKc1kybENhVmRHV25GWlZVNURZVEZ3V0ZadVpHRlhSV3h1VjFkNGIxWXlSblJTYTFKclRXMVNjRll3V21GalZteFdWR3RPYUUxWVFsbFdiVFZyV1Zaa1JtSkhOVmRpV0ZKeVdXcEtTMUp0U2taaFJUVlhUVEpvZUZaR1VrSk5WMGw0V2toR1ZHSkdjR2hVVjNSaFYyeGFSMVZ0UmxSaVJYQjVWR3hWZUZaV1NuTlhiRUpXWWxob1dGbDZSbGRqVm5CR1QxWk9UazF0WjNwV2ExcFRVMnN4VjJKR1pHaFNSbkJXV1cxNFlWbFdjRmhrUlhScVlrWktWbFZzVWxOVWF6RnlWMnRhVmxaNlZucFdSM2hQVWpGa2RWWnNjRmRXTVVWM1ZtcEplRmxXV2taT1ZXaGhVbTFTYjFSWGVFdE5iR1JZWkVaa2FrMVZOVWhXTWpWWFZqSktWbGRzVG1GV00yaE1Wa1phUm1WV2JEWmlSa1pXVm5wbk5WRXlZemxRVVc4OUNnPT0)

> Flag: `SK-CERT{4li3nZ_3nc0d3_7h0r0ughlY}`

## \[☆☆☆\] Between 15 and 17

### Description

The whole wider galactic society knows the universe is nothing but numbers. You are the only competitor still standing, human, but we have to say, the octopus was DELICIOUS! Decrypt this flag, given to you in hexadecimal format.

Additional instruction from the orcas, transmitting back home from the nearest star cluster:

- what we said earlier.

```
53 4b 2d 43 45 52 54 7b 36 33 37 5f 75 35 33 64 5f 37 30 5f 68 33 78 34 64 33 63 31 6d 34 6c 7d
```
### Solution

If you paste Input CyberChef automatically identifies it as Hex (Wand will appear)

![First Contact-5.png](/assets/ctf/cybergame/2025/forensics/First Contact-5.png)

> Flag: `SK-CERT{637_u53d_70_h3x4d3c1m4l}`

## \[☆☆☆\] A Day in the Strife

### Desciption

Orcas were right from day one. Turns out these aliens were not friendly AT ALL. Having eaten all the other competitors, they tried to eat you as well. Luckily, we intercepted their comms in binary saying:

```
01010011 01001011 00101101 01000011 01000101 01010010 01010100 01111011 00110011 00110100 00110111 01011111 00110111 01101000 00110011 01011111 01101000 01110101 01101101 00110100 01101110 00110101 00101100 01011111 00110111 01101000 00110011 01111001 01011111 01101011 01101110 00110000 01110111 01011111 00110111 00110000 00110000 01011111 01101101 01110101 01100011 01101000 01111101
```

## Solution

![First Contact-6.png](/assets/ctf/cybergame/2025/forensics/First Contact-6.png)

> Flag: `SK-CERT{347_7h3_hum4n5,_7h3y_kn0w_700_much}`

## \[☆☆☆\] Independence day

### Description

Mankind started coordinating a response. Since these aliens are incredibly technologically advanced, and also have seen all our movies, the idea of using morse code is burned. We needed to use something else. This link will save our planet: [https://v2.cryptii.com/](https://v2.cryptii.com/)

```
LXXXIII LXXV XLV LXVII LXIX LXXXII LXXXIV CXXIII LXXXIV CIV CXIV CXI CXIX LXXIV XCVII CXVIII CI CVIII CV CX CXV LXXIX CX LXXXIV CIV CI CIX CXXV
```

### Solution

Ideally we want decimals and the only thing decimals may convert to is ASCII values.
```python
def from_roman(s):
    romans = {
        'M': 1000, 'CM': 900, 'D': 500, 'CD': 400, 'C': 100, 
        'XC': 90, 'L': 50, 'XL': 40, 'X': 10, 
        'IX': 9, 'V': 5, 'IV': 4, 'I': 1
    }
    i = res = 0
    while i < len(s):
        if i+1 < len(s) and s[i:i+2] in romans:
            res += romans[s[i:i+2]]
            i += 2
        else:
            res += romans[s[i]]
            i += 1
    return res


cipher = 'LXXXIII LXXV XLV LXVII LXIX LXXXII LXXXIV CXXIII LXXXIV CIV CXIV CXI CXIX LXXIV XCVII CXVIII CI CVIII CV CX CXV LXXIX CX LXXXIV CIV CI CIX CXXV'
for letter in cipher.split():
    decimal = from_roman(letter)
    print(chr(decimal), end='')
```

> Flag: `SK-CERT{ThrowJavelinsOnThem}`

## \[☆☆☆\] Or hack their mainframe...

### Description

Even though we contracted the best javelin thrower in the whole world, the alien spaceship seems to have a force field. Switching to plan B - we must hack their mainframe. We know their computer would shut down if we pass the right keyword. However, the keyword is verified by a regular expression (regex). Can you find the correct string?

```
^(?:S[K])-(?:C(?:E|E{0})R)(?:T){v(?:3)r[y]_[5]7r(?:4)n6(?:3)_r3(?:6)3x}$
```

### Solution

First I thought it was a cipher, but upon closer inspection it's just Regex.

Make AI struggle instead of you and unregex~ d:

![First Contact-7.png](/assets/ctf/cybergame/2025/forensics/First Contact-7.png)

It has extra T, fix it and submit.

> Flag: `SK-CERT{v3ry_57r4n63_r363x}`

