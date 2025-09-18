# Good Authentication

## Description

After your first strike, the development team has increased the power of there login function. Are you strong enough to break it again?

**Link:** [SecurityValley/PublicCTFChallenges/coding/good_authentication](https://github.com/SecurityValley/PublicCTFChallenges/tree/master/coding/good_authentication)

## Analysis

1. Password length must be 12
2. Password is split into 3 chucks (blocks)
3. Each blocks gets [XOR](https://www.wikiwand.com/en/Bitwise_operation#XOR)-ed with some constant number
4. Final password is `sontTbxTjffe`

## Solution

XOR operation is a little special because it can be used to encrypt data and decrypted with the same key. For us the keys are already known. To make this even simpler we can reverse the logic of the code, pass the password to loop and get the password.

```js
password  =  "sontTbxTjffe";

const  block  = [
	Array.from(password).slice(0, 4),
	Array.from(password).slice(4, 8),
	Array.from(password).slice(8, 12)
]

let  crafted  =  "";

for (let  i  =  0; i  <  block.length; i++) {
  for (let  a  =  0; a  <  block[i].length; a++) {
    if (i  ==  0) {
      crafted  +=  String.fromCharCode(String(block[i][a]).charCodeAt(0) ^  7)
    } else  if (i  ==  1) {
      crafted  +=  String.fromCharCode(String(block[i][a]).charCodeAt(0) ^  11)
    } else {
      crafted  +=  String.fromCharCode(String(block[i][a]).charCodeAt(0) ^  9)
    }
  }
}

console.log(crafted)

>>> this_is_cool
```

Finally we submit answer to the API
```sh
curl -X POST http://ctf.securityvalley.org:7777/api/v1/validate -H 'Content-Type: application/json' -d '{"pass": "this_is_cool"}'
```

## Flag

{"Value":"SecVal{REDACTED}"}