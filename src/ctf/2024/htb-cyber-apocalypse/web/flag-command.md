# Flag Command

# Flag Command

### Description

POINTS: 375\

\
DIFFICULTY: very easy

Embark on the "Dimensional Escape Quest" where you wake up in a mysterious forest maze that's not quite of this world. Navigate singing squirrels, mischievous nymphs, and grumpy wizards in a whimsical labyrinth that may lead to otherworldly surprises. Will you conquer the enchanted maze or find yourself lost in a different dimension of magical challenges? The journey unfolds in this mystical escape!

### Solution

The application on given server seems to be CLI game:

![flag-command-1](/assets/ctf/htb/flag-command-1.png)

If we take a look at source code we can see linked scripts:

```html
<script src="/static/terminal/js/commands.js" type="module"></script>
<script src="/static/terminal/js/main.js" type="module"></script>
<script src="/static/terminal/js/game.js" type="module"></script>
```

`main.js` seems interesting, probably handles all user input.

Since the appication is client side it must make requests to server to display updated information.\

\
Searching for `fetch(` reveals few endpoints:

```js
...
await fetch('/api/monitor', {
...
fetch('/api/options')
...
```

Inspect the request using Dev Tools or just `curl`.

![flag-command-2](/assets/ctf/htb/flag-command-2.png)

```plaintext
>> start

YOU WAKE UP IN A FOREST.

You have 4 options!

HEAD NORTH
HEAD SOUTH
HEAD EAST
HEAD WEST

>> Blip-blop, in a pickle with a hiccup! Shmiggity-shmack

HTB{D3v3l0p3r_t00l5_4r3_b35t_wh4t_y0u_Th1nk??!}

You escaped the forest and won the game! Congratulations! Press restart to play again.
```

::: tip Flag
`HTB{D3v3l0p3r\_t00l5\_4r3\_b35t\_wh4t\_y0u\_Th1nk??!}`
:::
