# Easy Authentication

## Description 

Level: 1 Score 5 Category coding

Let's start simple in this game. We have collected a piece of javascript. There is a validate function but we don't know the password... can you hack it?

**Link:** [SecurityValley/PublicCTFChallenges/coding/easy_authentication](https://github.com/SecurityValley/PublicCTFChallenges/blob/master/coding/easy_authentication)

## Analysis

We are given an array of numbers, which seem like ascii character codes.
```js
const pass = [106,117,115,116,95,119,97,114,109,105,110,103,95,117,112];
```

Validation happens on this line of code which checks that each character in password is same as defined in `pass`. 
```js
if(pa[i].charCodeAt(0)  !==  pass[i])
```


## Solution

We can easily translate ascii codes into characters.
```py
>>> pass_ = [106,117,115,116,95,119,97,114,109,105,110,103,95,117,112]
>>> "".join(map(chr, pass_)) # Map each ascii code to character using `chr` 
'just_warming_up'
```

Finally we submit answer to the API
```sh
curl -X POST http://ctf.securityvalley.org:7777/api/v1/validate -H 'Content-Type: application/json' -d '{"pass": "just_warming_up"}'
```

## Flag

{"Value":"SecVal{REDACTED}"}