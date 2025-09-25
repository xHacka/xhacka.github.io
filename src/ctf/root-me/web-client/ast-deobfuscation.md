# Ast Deobfuscation

## Description

HessKamai has released version 2.0, and they believe that nothing and nobody will be able to reproduce the sensor generation. Your friend has sent you an AST, so it’s up to you to prove to them that their anti-bot is reversible.

[Download the challenge](https://static.root-me.org/web-client/ch38/ch38.json)

## Solution

We are given [AST](https://www.wikiwand.com/en/articles/Abstract_syntax_tree) code, but in json format. To make it readable we have to convert it to back to Javascript

Tools like [astring](https://www.npmjs.com/package/astring) can be used to deobfuscate.

```bash
└─$ npm install -g astring
└─$ curl https://static.root-me.org/web-client/ch38/ch38.json -s | astring
(() => {
  let d = [1856, 1824, 1776, 1728, 1776, 1728, 1776];
  d = d.map(c => String.fromCharCode(c >> 4));
  console.log(d);
})();
function l33t() {
  console.log("vive le reverse d'AST");
}
function gen_sensor() {
  let sens = [10] + [45] + [65] + [78] + [47];
  if ((sens >>= 4) == 20) {
    sens << 4;
  }
  let sensor = (function () {
    return [65353704, 65353663, 65353663, 65353707, 65353680, 65353701, 65353663, 65353709, 65353680, 65353706, 65353710, 65353724, 65353718, 65353680, 65353707, 65353706, 65353696, 65353709, 65353705, 65353722, 65353724, 65353708, 65353710, 65353723, 65353702, 65353696, 65353697];
  })().map(c => String.fromCharCode(c ^ sens)).join('');
  return sensor;
}
let sensor = gen_sensor();
console.log(sensor);
Error: this[statement.type] is not a function
```

Code logs the output so it can be directly passed to NodeJS

```bash
└─$ curl https://static.root-me.org/web-client/ch38/ch38.json -s | astring | node
Error: this[statement.type] is not a function
[ 't', 'r', 'o', 'l', 'o', 'l', 'o' ]
g00d_j0b_easy_deobfuscation
```

::: tip Flag
`g00d_j0b_easy_deobfuscation`
:::

