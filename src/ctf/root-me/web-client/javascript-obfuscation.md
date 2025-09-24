# Javascript Obfuscation

## Obfuscation 1

### Description

[Start the challenge](http://challenge01.root-me.org/web-client/ch4/ch4.html)

### Solution

![javascript---obfuscation.png](/assets/ctf/root-me/javascript-obfuscation.png)

Password is URL Encoded, since `pass` is loaded we can use it in Console tab, or directly decode it. 
```js
> unescape(pass)
'cpasbiendurpassword'
> unescape('%63%70%61%73%62%69%65%6e%64%75%72%70%61%73%73%77%6f%72%64')
'cpasbiendurpassword'
```

> Flag: `cpasbiendurpassword`

## Obfuscation 2

### Description

[Start the challenge](http://challenge01.root-me.org/web-client/ch12/ch12.html)

### Solution

![javascript---obfuscation-1.png](/assets/ctf/root-me/javascript-obfuscation-1.png)

Use console to get the value
```js
> pass
'unescape("String.fromCharCode%28104%2C68%2C117%2C102%2C106%2C100%2C107%2C105%2C49%2C53%2C54%29")'
> eval(pass)
'String.fromCharCode(104,68,117,102,106,100,107,105,49,53,54)'
> eval(eval(pass))
'hDufjdki156'
```

> Flag: `hDufjdki156`

## Obfuscation 3

### Description

[Start the challenge](http://challenge01.root-me.org/web-client/ch13/ch13.html)

### Solution

Source deobfuscated with [https://deobfuscate.relative.im](https://deobfuscate.relative.im)
```js
function dechiffre(pass_enc) {
  var pass = '70,65,85,88,32,80,65,83,83,87,79,82,68,32,72,65,72,65'
  var tab = pass_enc.split(',')
  var tab2 = pass.split(',')
  var i, j, k, n, o, p = ''
  i = 0
  j = tab.length
  k = j + 0 + (n = 0)
  n = tab2.length
  for (i = o = 0; i < (k = j = n); i++) {
	o = tab[i - 0]
	p += String.fromCharCode((o = tab2[i]))
	if (i == 5) { break }
  }
  for (i = o = 0; i < (k = j = n); i++) {
	o = tab[i - 0]
	if (i > 5 && i < k - 1) {
	  p += String.fromCharCode((o = tab2[i]))
	}
  }
  p += String.fromCharCode(tab2[17])
  pass = p
  return pass
}
String.fromCharCode(dechiffre('55,56,54,79,115,69,114,116,107,49,50'))
h = window.prompt('Entrez le mot de passe / Enter password')
alert(dechiffre(h))
```

The deobfuscator abuse unescaped the characters, if we do that and then convert each number to character we get a password. Everything else defaults to `FAUX PASSWORD HAHA`
```js
> unescape("\x35\x35\x2c\x35\x36\x2c\x35\x34\x2c\x37\x39\x2c\x31\x31\x35\x2c\x36\x39\x2c\x31\x31\x34\x2c\x31\x31\x36\x2c\x31\x30\x37\x2c\x34\x39\x2c\x35\x30")
'55,56,54,79,115,69,114,116,107,49,50'
> String.fromCharCode(55,56,54,79,115,69,114,116,107,49,50)
'786OsErtk12'
```

> Flag: `786OsErtk12`

## Obfuscation 4

### Description

Find the password.

> NB : You will have to enable popups in order to solve this challenge!

[Start the challenge](http://challenge01.root-me.org/web-client/ch17/ch17.html)

### Solution

Source deobfuscated with [https://deobfuscate.relative.im](https://deobfuscate.relative.im) and renamed variables/functions manually:
```js
var encryptedString = 'q\x11$Y\x8Dmq\x115\x16\x8Cmq\r9G\x1F6ñ/96\x8E<K95\x12\x87|\xA3\x10tX\x16ÇqVhQ,\x8CsE2[\x8C*ñ/?Wn\x04=\x16ug\x16Om\x1Cn@\x016\x93Y3V\x04>{:pP\x16\x04=\x18s7\xAC$áVb[\x8C*ñE\x7F\x86\x07>cG'

function xorOperation(x, y) {
  return x ^ y
}

function generateBitMask(y) {
  var mask = 0
  for (var i = 0; i < y; i++) { mask += Math.pow(2, i) }
  return mask
}

function generateInverseBitMask(y) {
  var mask = 0
  for (var i = 8 - y; i < 8; i++) { mask += Math.pow(2, i) }
  return mask
}

function rotateRight(x, y) {
  y = y % 8
  var mask = generateBitMask(y)
  mask = (x & mask) << (8 - y)
  return mask + (x >> y)
}

function rotateLeft(x, y) {
  y = y % 8
  var mask = generateInverseBitMask(y)
  mask = (x & mask) >> (8 - y)
  return (mask + (x << y)) & 255
}

function encryptCharacter(x, y) { return rotateLeft(x, y) }

function decryptString(encrypted, key) {
  var decrypted = ''
  for (var i = 0; i < encrypted.length; i++) {
    var charCode = encrypted.charCodeAt(i)
    var decryptedChar

    if (i !== 0) {
      var toggle = decrypted.charCodeAt(i - 1) % 2
      switch (toggle) {
        case 0: decryptedChar = xorOperation(charCode, key.charCodeAt(i % key.length)); break
        case 1: decryptedChar = encryptCharacter(charCode, key.charCodeAt(i % key.length)); break
      }
    } else {
      decryptedChar = xorOperation(charCode, key.charCodeAt(i % key.length))
    }
    
    decrypted += String.fromCharCode(decryptedChar)
  }
  return decrypted
}

function validatePassword(password) {
  var checksum = 0
  for (var i = 0; i < password.length; i++) {
    checksum += password.charCodeAt(i)
  }
  if (checksum === 8932) {
    var newWindow = window.open('', '', 'width=300,height=20')
    newWindow.document.write(password)
  } else {
    alert('Mauvais mot de passe!')
  }
}

validatePassword(decryptString(encryptedString, prompt('Mot de passe?')))
```

`rotateRight` and `generateBitMask` functions are not used so they can be discarded.

The application wants a password, then it uses password as key to decrypt the hardcoded encrypted string in the code. If sum of characters after decryption is 8932 then password was correct.

If the previous character code is even then XOR is performed, otherwise it's using `rotateLeft` function which is just binary left shift. 
```js
> (65).toString(2)
'1000001'

> for (let i=0;i<10;i++){console.log(i, ______(65, i).toString(2).padStart(8, '0'))} // rotateLeft
0 '01000001'
1 '10000010'
2 '00000101'
3 '00001010'
4 '00010100'
5 '00101000'
6 '01010000'
7 '10100000'
8 '01000001'
9 '10000010'
```

The first thought was to bruteforce, but it took too long.
```js
let charset = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~";

function calculateChecksum(str) { return str.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0); }
function generatePermutations(characters, length) {
    const result = [];

    function permute(currentPermutation) {
        if (currentPermutation.length === length) {
            result.push(currentPermutation.join(""));
            return;
        }

        for (let i = 0; i < characters.length; i++) {
            currentPermutation.push(characters[i]);
            permute(currentPermutation);
            currentPermutation.pop();
        }
    }

    permute([]);
    return result;
}

const max_length = 4;
let key, length;
for (length = 1; length <= max_length; length++) {
    for (key of generatePermutations(charset, length)) {
        if (calculateChecksum(decryptString(encryptedString, key)) == 8932) {
          console.log(key)
        }
    }
}
```

But we did get few keys to try and see what output looks like.
```bash
3#
3+
k0
+3
+;
0Ay
3*0
48D
```

![javascript---obfuscation-2.png](/assets/ctf/root-me/javascript-obfuscation-2.png)

Considering the length of the encrypted string we can guess what the plaintext is, hence we can do Crib Attack (or Known Plaintext Attack). 

The flag is written in new window and `write` method writes html into new windows. Circling back to length, we can deduct that it starts with `<html>...` (Deducting because modern browsers don't really care about what you write, if you replicate this and write anything new window will already have html, head, body tags automatically..)
```js
    var newWindow = window.open('', '', 'width=300,height=20')
    newWindow.document.write(password)
```

Bruteforce the key
```js
let charset = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~";
const guess = "<html><head>";
let key, decrypted, decryptedKey = "", foundNewChar = false;

for (char of guess) {
    foundNewChar = false;
    for (key of charset) {
        decrypted = decryptString(encryptedString, decryptedKey + key).substring(decryptedKey.length, decryptedKey.length + 1);
        if (decrypted == char) {
            if (!foundNewChar) { decryptedKey += key; }
            foundNewChar = true;
            console.log(decryptedKey.length, key)
        }
    }
    console.log(Array(10).fill('-').join(' '))

    if (!foundNewChar) { console.log('Char not found from guess'); break; };
}

console.log(decryptedKey)
```

```js
1 M
1 -
- - - - - - - - - -
2 y
2 L
- - - - - - - - - -
3 P
3 -
- - - - - - - - - -
4 4
- - - - - - - - - -
5 3
- - - - - - - - - -
6 S
- - - - - - - - - -
7 M
7 -
- - - - - - - - - -
8 y
8 ]
- - - - - - - - - -
9 P
- - - - - - - - - -
10 4
- - - - - - - - - -
11 3
- - - - - - - - - -
12 S
- - - - - - - - - -
MyP43SMyP43S
```

The key repeats hence the key is `MyP43S`, but the checksum doesn't match
```js
function calculateChecksum(str) { return str.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0); }
console.log(calculateChecksum(decryptString(encryptedString, 'MyP43S')))
// 8548
```

The password is 99% correct, but some character is invalid..
```html
<html><head><tit,e>Victoire!</titl%></head><body>Vous pouv%z ent2er ce mot d% passe!</body></h4ml>
```

The 5th character in key is wrong
```
< t i t , e
^ ^ ^ ^ ^ ^
1 2 3 4 5 6
v v v v v v
M y P 4 3 S
```

```js
for (char of charset) {
    key = `MyP4${char}S`;
    if (calculateChecksum(decryptString(encryptedString, key)) == 8932) {
        console.log(char, key);
        console.log(decryptString(encryptedString, key))
    }
}
// s MyP4sS
// <html><head><title>Victoire!</title></head><body>Vous pouvez entrer ce mot de passe!</body></html>
```

Not positive why `3` was not found in the first loop 🤔

> Flag: `MyP4sS`

## Obfuscation 5 - NOPE

### Description

Find the password.

[Start the challenge](http://challenge01.root-me.org/web-client/ch15/)

### Solution

If my deobfuscation was successful, this should be the source code:
```js
// Initial function definition: recfn0
function recfn0() { return 0; }

// String to hold generated functions
let functionDefinitions = '';

// Loop to create multiple recursive functions (recfn1, recfn2, ... recfn100)
for (let i = 0; i < 100; i++) {
  functionDefinitions += `function recfn${i + 1}(){ return recfn${i}(); }`;
}

// Evaluate and execute the generated functions
eval(functionDefinitions);

// Call the 100th function (recfn100), which recursively calls all previous functions
eval(recfn100());

// Assign 'this' context to a variable
let context = this;

// Iterate over properties of 'this'
for (let key in context) {
  // Check if the key's length is 10 and has specific character codes at positions 0 and 9
  if (key.length === 10) {
    if (key.charCodeAt(0) === 115) { // s
      if (key.charCodeAt(9) === 116) { // t
        break; // Stop loop if the conditions are met
      }
    }
  }
}

// The following block seems to execute some code involving a login password value
context[key]('processLogin("' + login.password.value + '")', 2000);

// This function appears to encode a string based on certain logic, possibly related to base64 encoding
function processLogin(input1, input2) {
  let encodedStr = '8aZ{E$+rT yU}1#2(IOP<qs,DFg.)H*Jk~L6M7]W;X%VxB:N!^-03/9[4&5|"?Kz';
  let input3 = input2 + input1 + 'eDer'
  let encodedOutput = '';
  let charCode1, charCode2, charCode3;

  let i = 0;
  while (i < input3.length) {
    charCode1 = input3.charCodeAt(i++);
    charCode2 = input3.charCodeAt(i++);
    charCode3 = input3.charCodeAt(i++);
    
    // Perform bitwise operations and transformations
    let part3 = charCode1 >> 2;
    let part1 = ((charCode1 & 3) << 4) | (charCode2 >> 4);
    let part2 = ((charCode2 & 15) << 2) | (charCode3 >> 6);
    let part0 = charCode3 & 63;

    // Handle NaN cases
    if (isNaN(charCode2)) {
      part2 = part0 = 64;
    } else if (isNaN(charCode3)) {
      part0 = 64;
    }

    // Append characters from charset
    encodedOutput += encodedStr.charAt(part3) + encodedStr.charAt(part1) + encodedStr.charAt(part2) + encodedStr.charAt(part0);
  }
  
  // Check if the encoded output matches the expected value and redirect accordingly
  if (encodedOutput === "p5rdEr87pT}dp'[Ap^2d2S*,~:JLESF0 ('7p(,5J'<,2prFE/W") {
    window.location.href = input1 + '.php';
  } else {
    alert('MOUHAHAHAHHAHAHAHAHA');
  }
}
```

Before `processLogin` 