# Some Assembly Required

## Some Assembly Required 1

Author:  Sears Schulz

### Description

[http://mercury.picoctf.net:36152/index.html](http://mercury.picoctf.net:36152/index.html)

### Solution

We are given a page, without description. Page is simple submit form.

```html
<html>
<head>
	<meta charset="UTF-8">
	<script src="G82XCw5CX3.js"></script>
</head>
<body>
	<h4>Enter flag:</h4>
	<input type="text" id="input"/>
	<button onclick="onButtonPress()">Submit</button>
	<p id="result"></p>
</body>
</html>
```

Let's view what javascript is doing. The Javascript is obfuscated... after some analysis in VSCode this is what I ended up with.

```js
const dictionary = ['value', '2wfTpTR', 'instantiate', '275341bEPcme', 'innerHTML', '1195047NznhZg', '1qfevql', 'input', '1699808QuoWhA', 'Correct!', 'check_flag', 'Incorrect!', './JIFxzHyW8W', '23SMpAuA', '802698XOMSrr', 'charCodeAt', '474547vVoGDO', 'getElementById', 'instance', 'copy_char', '43591XxcWUl', '504454llVtzW', 'arrayBuffer', '2NIQmVj', 'result'];
const getDictValue = function(index, placeholder) {
    index -= 0x1d6;
    let dictKey = dictionary[index];
    return dictKey;
};

(function(dict, result) {
    const value = getDictValue;
    while (!![]) { // While resultVal is not equal to result keep rearranging array.
        try {
            const resultVal = // Try To Get `result` From Dictionary
            -parseInt(value(0x1eb)) +  parseInt(value(0x1ed)) + 
            -parseInt(value(0x1db)) * -parseInt(value(0x1d9)) + 
            -parseInt(value(0x1e2)) * -parseInt(value(0x1e3)) + 
            -parseInt(value(0x1de)) *  parseInt(value(0x1e0)) + 
             parseInt(value(0x1d8)) *  parseInt(value(0x1ea)) + 
            -parseInt(value(0x1e5));
            if (resultVal === result)
                break;
            else
                dict['push'](dict['shift']()); // Remove last item and insert at the start
        } catch (err) {
            dict['push'](dict['shift']());     // Remove last item and insert at the start
        }
    }
}(dictionary, 0x994c3));

// > functions
// [
//   'instance',       'copy_char',
//   '43591XxcWUl',    '504454llVtzW',
//   'arrayBuffer',    '2NIQmVj',
//   'result',         'value',
//   '2wfTpTR',        'instantiate',
//   '275341bEPcme',   'innerHTML',
//   '1195047NznhZg',  '1qfevql',
//   'input',          '1699808QuoWhA',
//   'Correct!',       'check_flag',
//   'Incorrect!',     './JIFxzHyW8W',
//   '23SMpAuA',       '802698XOMSrr',
//   'charCodeAt',     '474547vVoGDO',
//   'getElementById'
// ]

let exports;
(async() => {
    const value = getDictValue;
    //                            ./JIFxzHyW8W
    let fetchResult = await fetch(value(0x1e9));
    //                                        instantiate                     arrayBuffer
    let webAssemblyResult = await WebAssembly[value(0x1df)](await fetchResult[value(0x1da)]());
    //                                        instance
    let webAssemblyValue = webAssemblyResult[value(0x1d6)];
    exports = webAssemblyValue['exports'];
})();

function onButtonPress() {
    const value = getDictValue;
    //                                            input         value
    let inputElement = document['getElementById'](value(0x1e4))[value(0x1dd)];
    for (let i = 0x0; i < inputElement['length']; i++) {
        //      copy_char                  charCodeAt
        exports[value(0x1d7)](inputElement[value(0x1ec)](i), i);
    }
    exports['copy_char'](0x0, inputElement['length']),
    
    //      check_flag                        
    exports[value(0x1e7)]() == 0x1 ? // If-else but with ternary 
    //           getElementById   result     innerHTML       Correct!
        document[value(0x1ee)](value(0x1dc))[value(0x1e1)] = value(0x1e6) // If true  
        : 
    //           getElementById   result     innerHTML       Incorrect!
        document[value(0x1ee)](value(0x1dc))[value(0x1e1)] = value(0x1e8) // If false
    ;
}
```
Note: You can view this values from `console` tab in `Developer Tools` without running script, but you'll have to use original names.

So script gets some file, collects imports (some functions), calls `copy_char` a lot and finally checks if flag is correct. The file it gets is WebAssembly.

```powershell
➜ file ./JIFxzHyW8W 
JIFxzHyW8W: WebAssembly (wasm) binary module version 0x1 (MVP)

➜ strings .\JIFxzHyW8W
memory
__wasm_call_ctors
strcmp
check_flag
input
        copy_char
__dso_handle
__data_end
__global_base
__heap_base
__memory_base
__table_base
j!
  F!!A
!" ! "q!# #
!% $ %q!&
!( ' (q!) & )k!*
!+ +
        q!
+picoCTF{d88090e679c48f3945fcaa6a7d6d70c5}
```

Without diving too much into assembly we can view flag with `strings`.
::: tip Flag
`picoCTF{d88090e679c48f3945fcaa6a7d6d70c5}`
:::

## Some Assembly Required 2 

### Description

[http://mercury.picoctf.net:7319/index.html](http://mercury.picoctf.net:7319/index.html)

### Analysis

We are given almost same code (I converted it for more readability). Reorder array -> Get Wasm (Web Assembly) -> Use assembly functions -> Compare to flag -> Profit.

```js
const dictionary = ["copy_char",  "value",  "207aLjBod",  "1301420SaUSqf",  "233ZRpipt",  "2224QffgXU",  "check_flag",  "408533hsoVYx",  "instance",  "278338GVFUrH",  "Correct!",  "549933ZVjkwI",  "innerHTML",  "charCodeAt",  "./aD8SvhyVkb",  "result",  "977AzKzwq",  "Incorrect!",  "exports",  "length",  "getElementById",  "1jIrMBu",  "input",  "615361geljRK"];
const getDictValue = function (key, placeholder) {
    key -= 0xc3;
    let value = dictionary[key];
    return value;
};

(function (_0x12fd07, _0x4e9d05) {
    // Keeps rearranging array till the condition is satisfied
    const _0x4f7b75 = getDictValue;
    while (!![]) {
        try {
            const _0x1bb902 = -parseInt(_0x4f7b75(0xc8)) * -parseInt(_0x4f7b75(0xc9)) + -parseInt(_0x4f7b75(0xcd)) + parseInt(_0x4f7b75(0xcf)) + parseInt(_0x4f7b75(0xc3)) + -parseInt(_0x4f7b75(0xc6)) * parseInt(_0x4f7b75(0xd4)) + parseInt(_0x4f7b75(0xcb)) + -parseInt(_0x4f7b75(0xd9)) * parseInt(_0x4f7b75(0xc7));
            if (_0x1bb902 === _0x4e9d05) break;
            else _0x12fd07["push"](_0x12fd07["shift"]());
        } catch (_0x4f8a) {
            _0x12fd07["push"](_0x12fd07["shift"]());
        }
    }
})(dictionary, 0x4bb06);

let exports;
(async () => {
    const value = getDictValue;
    let _0x1adb5f = await fetch(value(0xd2)); // URI = ./aD8SvhyVkb <---- Assembly Code Location
    let _0x355961 = await WebAssembly["instantiate"](await _0x1adb5f["arrayBuffer"]());
    let _0x5c0ffa = _0x355961[value(0xcc)];
    exports = _0x5c0ffa[value(0xd6)];
})();

function onButtonPress() {
    const value = getDictValue;
    let inputElement = document[value(0xd8)](value(0xda))[value(0xc5)];
    for (let i = 0x0; i < inputElement["length"]; i++) {
        exports[value(0xc4)](inputElement[value(0xd1)](i), i);
    }
    exports["copy_char"](0x0, inputElement[value(0xd7)]); // `copy_char` copies flag somewhere..

    exports[value(0xca)]() == 0x1 ?
        (document["getElementById"](value(0xd3))[value(0xd0)] = value(0xce)) // Correct
        : 
        (document[value(0xd8)](value(0xd3))["innerHTML"] = value(0xd5)); // Incorrect
}
```

Downloading [wasm](http://mercury.picoctf.net:7319/aD8SvhyVkb) from server and running `strings` shows:
```powershell
➜ strings .\aD8SvhyVkb
memory
__wasm_call_ctors
strcmp
check_flag
input
        copy_char
...
+xakgK\Ns9=8:9l1?im8i<89?00>88k09=nj9kimnu
```

Looking at the last line it seems like flag, but encrypted, 110% bet it's an XOR.

Opening wasm into [wasm2wat](https://webassembly.github.io/wabt/demo/wasm2wat/) gives us somewhat readable code. Searching for XOR `(local.set  $l8 (i32.xor(local.get $l6)  (local.get  $l7)))`, now it's clear that XOR is involved, but which one is the key and which one is the flag.

Instructions before XOR are following. In XOR key is constant so the KEY must be 8.
```
(local.set  $l6 (i32.load offset=12 (local.get $l4)))
(local.set  $l7 (i32.const 8))
```

### Solution

![some-assembly-required-2-1](/assets/ctf/picoctf/some-assembly-required-2-1.png)

Clean up encryption a bit.

![some-assembly-required-2-2](/assets/ctf/picoctf/some-assembly-required-2-2.png)
::: tip Flag
`picoCTF{15021d97ae0a401788600c815fb1caef}`
:::

## Some Assembly Required 3 

### Description

[http://mercury.picoctf.net:47240/index.html](http://mercury.picoctf.net:47240/index.html)

### Analysis

Viewing JavaScript the file looks the same as previous ones, but URI is provided to us without obfuscating. `let  _0x487b31  =  await  fetch("./qCCYI0ajpD")`

In `wasm2wat` we can see some odd values, probably flag and key (XOR operation can be found in code):
```
(data $d0 (i32.const 1024) "\9dn\93\c8\b2\b9A\8b\94\c6\df3\c0\c5\95\de7\c3\9f\93\df?\c9\c3\c2\8c2\93\90\c1\8ee\95\9f\c2\8c6\c8\95\c0\90\00\00")
(data $d1 (i32.const 1067) "\f1\a7\f0\07\ed"))
```

Using [WATB](https://github.com/WebAssembly/wabt) to decompile the code:
```bash
└─$ ./wasm-decompile code.wasm
...

function copy(a:int, b:int) {
  var c:int = g_a;
  var d:int = 16;
  var e:int_ptr = c - d;
  e[3] = a; // Input?
  e[2] = b; // Key?
  var f:int = e[3];
  if (eqz(f)) goto B_a;
  var g:int = 4;
  var h:int = e[2];
  var i:int = 5;
  var j:int = h % i; // Key % 5?
  var k:ubyte_ptr = g - j;
  var l:int = k[1067];
  var m:int = 24;
  var n:int = l << m;
  var o:int = n >> m;
  var p:int = e[3];
  var q:int = p ^ o; // XOR Operation
  e[3] = q;
  label B_a:
  var r:int = e[3];
  var s:byte_ptr = e[2];
  s[1072] = r;
}
```

While it's not 100% clear what the code is doing, it's understandable that `input` gets XOR-ed with `key` and this key get cycled through, as commonly seen in XOR ciphers.

### Solution

```py
cipher = "\x9dn\x93\xc8\xb2\xb9A\x8b\x94\xc6\xdf3\xc0\xc5\x95\xde7\xc3\x9f\x93\xdf?\xc9\xc3\xc2\x8c2\x93\x90\xc1\x8ee\x95\x9f\xc2\x8c6\xc8\x95\xc0\x90\x00\x00"
key = "\xf1\xa7\xf0\x07\xed"
key_len = len(key)

flag = ""
for i, byte in enumerate(cipher):
    cipher_byte = ord(cipher[i])
    key_byte = ord(key[(key_len - 1) - (i % key_len)])
    flag += chr(cipher_byte ^ key_byte)

print(flag)
```
::: tip Flag
`picoCTF{37240bd3038b289d3a5c70cbe83a1821}`
::: 