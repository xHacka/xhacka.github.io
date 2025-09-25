# Javascript Native Code

## Description

No clue.

[Start the challenge](http://challenge01.root-me.org/web-client/ch16/ch16.html)

## Solution

![javascript---native-code.png](/assets/ctf/root-me/javascript-native-code.png)

You can paste the source code inside Console tab **without ()** and get readable source code: 

![javascript---native-code-1.png](/assets/ctf/root-me/javascript-native-code-1.png)

or use tool like: [https://www.dcode.fr/javascript-unobfuscator](https://www.dcode.fr/javascript-unobfuscator)

```js
function anonymous( ) { a=prompt('Entrez le mot de passe');if(a=='toto123lol'){alert('bravo');}else{alert('fail...');} }
```

::: tip Flag
`toto123lol`
:::

