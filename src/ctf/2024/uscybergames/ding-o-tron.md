# Ding-O-Tron

## Description

Ding-O-Tron

What came first? The ding...or the flag?

[https://uscybercombine-s4-web-ding-o-tron.chals.io/](https://uscybercombine-s4-web-ding-o-tron.chals.io/)

Author: [tsuto](https://github.com/jselliott)

## Solution

The application let's you ring the bell and that seems to be it. If we look into source code it's loading Wasm (Web Assembly)

![Ding-O-Tron](/assets/ctf/uscybergames/ding-o-tron.png)

At the end of `main.js` we see commented function:
```bash
runWasm();

// giveFlag();
```

If we activate this function we get trolled by Emotional Damage wav
```js
> giveFlag()
wasm_exec.js:22 [LOL] Did you think it would be that easy? Can you find my secret hidden function?
```

First I tried to debug the `wasm` with [The WebAssembly Binary Toolkit](https://github.com/WebAssembly/wabt), but `wasm2c` generate 900'000+ lines of code and that was pain. Since javascript is expsed to client let's see what functions we have:

```js
> let prop, i = 0;
for (prop in window) {
  if (typeof window[prop] == "function") {
    console.log(i++, prop);
  }
}

VM3603:5 0 'alert'
VM3603:5 1 'atob'
VM3603:5 2 'blur'
VM3603:5 3 'btoa'
...
VM3603:5 197 'runWasm'
VM3603:5 198 'pad'
VM3603:5 199 'playSound'
VM3603:5 200 'updateCount'
VM3603:5 201 'yay'
VM3603:5 202 'winner'
VM3603:5 203 'ding'
VM3603:5 204 'giveFlag'
VM3603:5 205 'superSecretFunction_312e4c286bcb2ad0'
...
```

![Ding-O-Tron-1](/assets/ctf/uscybergames/ding-o-tron-1.png)
::: tip Flag
`**SIVUSCG{d1ng_d1ng_d1ng_d1ng}**`
:::
