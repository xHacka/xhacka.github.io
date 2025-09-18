# The Way Out Is Through

## Description

The first Web challenge of the contest and I am so excited to reveal this one! In this challenge you'll run through a simulated web-based cybersecurity training course a la the DoD Cyber Exchange Awareness Challenge. There's just one problem... The cybersecurity training is... Vulnerable??! Oh, the irony! Can YOU handle the HACK OF THE CENTURY??? Head here to find out!  
  
[Don't Let Jeff Down!](http://nvstgt.com/TTiOT/index.html)

## Solution

Visiting url gives 404: [http://nvstgt.com/TTiOT/index.html](http://nvstgt.com/TTiOT/index.html)

![The Way Out is Through.png](/assets/ctf/uwsp-pointer-overflow/2024/web/The Way Out is Through.png)

View Source:
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TTiOT</title>
</head>
<body>
    <h1>Not Found</h1>
    <p>The requested URL /snazzy-dump-pics.html was not found on this server.</p>
    <hr>
    <p><i>Apache/1.1.3 (Ubuntu) Server at localhost Port 1337</i></p>
    
    <script>
        let part_1 = [112, 111, 99, 116].map(x => String.fromCharCode(x)).join('');
        let part_2 = atob("Znt1d3NwXw==");
        let part_3 = "document.cookie";
        let part_4 = "XzdydTdoXw==";
        let part_5_hex = [0x31, 0x35, 0x5f, 0x30, 0x75, 0x37, 0x5f, 0x37, 0x68, 0x33, 0x72, 0x33, 0x7d];

        console.log("The Tooth is Over There.");
        document.cookie = "\u0037\u0068\u0033";
    </script>
</body>
</html>
```

Piece together the scattered/obfuscated flag:
```js
> console.log(
	part_1 +
	part_2 + 
	eval(part_3) +
	atob(part_4) +
	part_5_hex.map(v => String.fromCharCode(v)).join('')
)
poctf{uwsp_7h3_7ru7h_15_0u7_7h3r3}
```

> Flag: `poctf{uwsp_7h3_7ru7h_15_0u7_7h3r3}`


