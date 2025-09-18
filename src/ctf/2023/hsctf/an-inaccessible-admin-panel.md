# an-inaccessible-admin-panel

## Description

web/an-inaccessible-admin-panel (by Ketchup306) | 234  points

The Joker is on the loose again in Gotham City! Police have found a web application where the Joker had allegedly tampered with. This mysterious web application has login page, but it has been behaving abnormally lately. Some time ago, an admin panel was created, but unfortunately, the password was lost to time. Unless you can find it...

Can you prove that the Joker had tampered with the website?

Default login info: Username: default Password: password123

Link to login page:  [https://login-web-challenge.hsctf.com/](https://login-web-challenge.hsctf.com/)

## Analysis

When opening page we are greeted with simple login.

By viewing source code we can find javascript file in header.
```html
<script src="login.js"></script>
```

There's 2 possible ways of authentication.
1. Admin (Actual user)
2. Default (Fake user)

```js
if (username === "Admin" && validatePassword(password)) {
    alert("Login successful. Redirecting to admin panel...");
    window.location.href = "admin_panel.html";
}
else if (username === "default" && password === "password123") {
    var websiteNames = ["Google", "YouTube", "Minecraft", "Discord", "Twitter"];
    var websiteURLs = ["https://www.google.com", "https://www.youtube.com", "https://www.minecraft.net", "https://www.discord.com", "https://www.twitter.com"];
    var randomNum = Math.floor(Math.random() * websiteNames.length);
    alert("Login successful. Redirecting to " + websiteNames[randomNum] + "...");
    window.location.href = websiteURLs[randomNum];
} else {
    alert("Invalid credentials. Please try again.");
}
```

If we login as `Admin` we are redirected to `admin_panel.html`, let's try visiting it.

![an-inaccessible-admin-panel-1](/assets/ctf/hsctf/an-inaccessible-admin-panel-1.png)

To get the flag we need a password. `login.js` contains `validatePassword` function which validates the password on client side.
```js
function fii(num) { return num / 2 + fee(num); }
function fee(num) { return foo(num * 5, square(num)); }
function foo(x, y) { return x * x + y * y + 2 * x * y; }
function square(num) { return num * num; }

var key = [
  32421672.5, 160022555, 197009354, 184036413, 165791431.5, 110250050,
  203747134.5, 106007665.5, 114618486.5, 1401872, 20702532.5, 1401872, 37896374,
  133402552.5, 197009354, 197009354, 148937670, 114618486.5, 1401872,
  20702532.5, 160022555, 97891284.5, 184036413, 106007665.5, 128504948,
  232440576.5, 4648358, 1401872, 58522542.5, 171714872, 190440057.5,
  114618486.5, 197009354, 1401872, 55890618, 128504948, 114618486.5, 1401872,
  26071270.5, 190440057.5, 197009354, 97891284.5, 101888885, 148937670,
  133402552.5, 190440057.5, 128504948, 114618486.5, 110250050, 1401872,
  44036535.5, 184036413, 110250050, 114618486.5, 184036413, 4648358, 1401872,
  20702532.5, 160022555, 110250050, 1401872, 26071270.5, 210656255, 114618486.5,
  184036413, 232440576.5, 197009354, 128504948, 133402552.5, 160022555,
  123743427.5, 1401872, 21958629, 114618486.5, 106007665.5, 165791431.5,
  154405530.5, 114618486.5, 190440057.5, 1401872, 23271009.5, 128504948,
  97891284.5, 165791431.5, 190440057.5, 1572532.5, 1572532.5,
];

function validatePassword(password) {
  var encryption = password.split("").map(function (char) { return char.charCodeAt(0); });
  
  var checker = [];
  for (var i = 0; i < encryption.length; i++) {
    var a = encryption[i];
    var b = fii(a);
    checker.push(b);
  }

  if (key.length !== checker.length) { return false; }

  for (var i = 0; i < key.length; i++) {
    if (key[i] !== checker[i]) { return false; }
  }
  
  return true;
}
```

Encryption takes in a string, converts it into character array, then ascii codes array, performs some mathmatical operation and if `key` matches encrypted `input` then input is the password.

## Solution

Reversing the logic seems a bit hard, so I tried to matching outputs.

```py
import string

def fii(num): return num / 2 + fee(num)
def fee(num): return foo(num * 5, square(num))
def foo(x, y): return x*x + y*y + 2*x*y
def square(num): return num * num

key = [ ... ]

ALPHABET = string.printable
CIPHER = { # Create "encode_char: char" dictionary
	fii(ord(c)): c 
	for c in ALPHABET
} 

print(
    "".join( # Join decoded characters
        CIPHER[encoded_char] # Get value of `encoded_char`
        for encoded_char in key
    )
)
```

Flag: `flag{Admin, [DECODED_KEY]}`