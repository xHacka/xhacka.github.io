# Javascript Webpack

## Description

Find the password.

[Start the challenge](http://challenge01.root-me.org/web-client/ch27/)

## Solution

There's additional tab inside Sources called `webpack://`

![javascript---webpack.png](/assets/ctf/root-me/javascript-webpack.png)

Application is built with Vue JS and the source is disclosed to public. In `src/router/index.js` we can see routes available in application and commented route (secret)

Component itself doesn't contain anything in it's current state. But `*.js.map` files contain original source code we can potentially leak [JavaScript Source Maps](https://www.redsentry.com/blog/javascript-source-maps)

```bash
└─$ curl http://challenge01.root-me.org/web-client/ch27/static/js/app.a92c5074dafac0cb6365.js -s | tail -1
//# sourceMappingURL=app.a92c5074dafac0cb6365.js.map 
```

```bash
└─$ curl http://challenge01.root-me.org/web-client/ch27/static/js/app.a92c5074dafac0cb6365.js.map -s | sed 's/\\n/\n/g'
<script>
export default {
  name: 'Duck',
  data () {
    return {
        // Did you know that comment are readable by the end user ?
        // Well, this because I build the application with the source maps enabled !!!
        // So please, disable source map when you build for production
        // Here is your flag : BecauseSourceMapsAreGreatForDebuggingButNotForProduction
        'msg': 'Quack quack !! :).'
    }
  }
}
</script>
```

::: tip Flag
`BecauseSourceMapsAreGreatForDebuggingButNotForProduction`
:::

