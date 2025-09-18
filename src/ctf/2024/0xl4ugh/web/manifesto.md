# Manifesto

## Description

This is an easy challenge, except... it's written in Clojure. Can you find your way through all of these parentheses and come out victorious? - @aelmo

Source: [https://master-platform-bucket.s3.amazonaws.com/challenges/cd6be806-1412-4aa9-9108-ef0ac3ea2f0c/public.zip](https://master-platform-bucket.s3.amazonaws.com/challenges/cd6be806-1412-4aa9-9108-ef0ac3ea2f0c/public.zip)
## Source

`Dockerfile`:
```bash
FROM clojure:lein-alpine

WORKDIR /app

COPY project.clj .
RUN lein deps

COPY src/ src/
COPY resources/ resources/

ENV CLOJURE_PORT 80
ENV FLAG '0xL4ugh{this_is_a_fake_flag}'

EXPOSE 80

ENTRYPOINT ["lein", "run"]

```

`project.clj`:
```clojure
(ns manifesto.core
  (:require [clojure.java.io :as io]
            [clojure.core :refer [str read-string]]
            [ring.adapter.jetty :refer [run-jetty]]
            [ring.util.response :as r]
            [ring.middleware.resource :refer [wrap-resource]]
            [ring.middleware.params :refer [wrap-params]]
            [ring.middleware.session :refer [wrap-session]]
            [selmer.parser :refer [render-file]]
            [cheshire.core :as json]
            [environ.core :refer [env]]))

;; thread-safe stores powered by clojure atoms
(defonce server (atom nil))
(def users (atom {}))

;; configure selmer path
(selmer.parser/set-resource-path! (io/resource "templates"))

;; records
(defrecord User [username password gists])

;; services
(defn insert-user
  ;; clojure's multiple-arity functions are elegant and allow code reuse
  ([username password] (insert-user username password []))
  ([username password gists] (swap! users assoc username (->User username password gists))))
(defn insert-gist [username gist] (if (contains? @users username)
                                    (swap! users assoc-in [username :gists]
                                           (conj (get-in @users [username :gists]) gist)) nil))

;; utilities
(defn json-response [m] {:headers {"Content-Type" "application/json"}
                         :body (json/generate-string m)})

(:password (@users "admin"))
[(defn routes [{:keys [request-method uri session query-params form-params]}]
   (cond
     ;; index route
     (re-matches #"/" uri)
     (-> (r/response
          (render-file "index.html"
                       {:prefer (or (query-params "prefer") (session "prefer") "light")
                        :username (session "username")
                        :url uri}))
         (assoc :session (merge {"prefer" "light"} session query-params)))

     ;; display user gists, protected for now
     (re-matches #"/gists" uri)
     (cond (not= (session "username") "admin")
           (json-response {:error "You do not have enough privileges"})

           (= request-method :get)
           (r/response
            (render-file "gists.html"
                         {:prefer (session "prefer")
                          :username (session "username")
                          :gists (get-in @users [(session "username") :gists])
                          :url uri}))

           (= request-method :post)
           (let [{:strs [gist]} form-params]
             ;; clojure has excellent error handling capabilities
             (try
               (insert-gist (session "username") (read-string gist))
               (r/redirect "/gists")
               (catch Exception _ (json-response {:error "Something went wrong..."}))))

           :else
           (json-response {:error "Something went wrong..."}))

     ;; login route
     (re-matches #"/login" uri)
     (cond
       (session "username")
       (r/redirect "/")

       (= request-method :get)
       (r/response
        (render-file "login.html"
                     {:prefer (session "prefer")
                      :user (@users (session "username"))
                      :url uri}))
       (= request-method :post)
       (let [{:strs [username password]} form-params]
         (cond
           (empty? (remove empty? [username password]))
           (json-response
            {:error "Missing fields"
             :fields (filter #(empty? (form-params %)) ["username" "password"])})
           :else
           ;; get user by username
           (let [user (@users username)]
             ;; check password
             (if (and user (= password (:password user)))
               ;; login
               (-> (r/redirect "/gists")
                   (assoc :session
                          (merge session {"username" username})))
               ;; invalid username or password
               (json-response {:error "Invalid username or password"})))))
       :else (json-response {:error "Unknown method"}))

     ;; logout route
     (re-matches #"/logout" uri)
     (-> (r/redirect "/") (assoc :session {}))

     ;; detect trailing slash java interop go brr
     (.endsWith uri "/")
     ;; remove trailing slash thread-last macro go brr
     (r/redirect (->> uri reverse rest reverse (apply str)))

     ;; catch all
     :else
     (-> (r/response "404 Not Found")
         (r/status 404))))

 ;; define app and apply middleware
 (def app (-> routes
              (wrap-resource "public")
              (wrap-params)
              (wrap-session {:cookie-name "session" :same-site :strict})))]

;; server utilities
(defn start-server []
  (reset! server (run-jetty (fn [req] (app req))
                            {:host (or (env :clojure-host) "0.0.0.0")
                             :port (Integer/parseInt (or (env :clojure-port) "8080"))
                             :join? false})))

(defn stop-server []
  (when-some [s @server]
    (.stop s)
    (reset! server nil)))

;; convenience repl shortcuts
(comment
  (start-server)
  (stop-server))

;; initialize

(defn -main []
  ((do (insert-user "admin" (str (random-uuid)))
       (insert-gist "admin" "self-reminder #1: with clojure, you get to closure")
       (insert-gist "admin" "self-reminder #2: clojure gives me composure")
       (insert-gist "admin" "self-reminder #3: i 💖 clojure")
       start-server)))
```

## Solution

From Dockerfile we know that flag lives in Environment and we have to leak it somehow.

[Clojure](https://clojure.org) syntax is somewhat hell, so before trying to read it it's better to get visual feeling which will make understanding a bit more easeir.

![Manifesto.png](/assets/ctf/0xl4ugh/manifesto.png)

Main page has some dummy data

`/login` requires credentials

`/gists` requires authorization

[Lisp in 100 Seconds](https://www.youtube.com/@Fireship)
[Learn X in Y minutes](https://learnxinyminutes.com/) -> Where X=[Clojure](https://learnxinyminutes.com/clojure/)

There's only single user `admin` and password is `uuid4` which can never be guessed.

Main page has Redirect Vulnerability, we can trigger XSS but not sure if it's useful anyhow.
```html
  <script>
    let queryString = new URL(location.href).search
    if (queryString) location = new URLSearchParams(queryString).get('redirect') || '/'
  </script>
```

XSS PoC: [https://7ab6a925e26832ee212cfea2a4fa8eb2.chal.ctf.ae/?prefer=light&redirect=javascript:alert(1)](https://7ab6a925e26832ee212cfea2a4fa8eb2.chal.ctf.ae/?prefer=light&redirect=javascript:alert(1))


Following line is vulnerable to Mass Assignment vulnerability; It's not only updating `prefer`, but any key inside session. 
```clojure
(assoc :session (merge {"prefer" "light"} session query-params)))
```

[https://7ab6a925e26832ee212cfea2a4fa8eb2.chal.ctf.ae/?prefer=light&username=admin](https://7ab6a925e26832ee212cfea2a4fa8eb2.chal.ctf.ae/?prefer=light&username=admin)

![Manifesto-1.png](/assets/ctf/0xl4ugh/manifesto-1.png)

Now we are admin, so what?... 💭

This is starting to smell like SSTI, so I started playing around with common payloads. It doesn't like `{{7*7}}` or like just `{{ANYTHING}}` and dies right away with exception. Then I tried `${{7*7}}` but that only outputs `$` and nothing else.  

![Manifesto-2.png](/assets/ctf/0xl4ugh/manifesto-2.png)

Parser used by the application -> [Selmer](https://github.com/yogthos/Selmer): A fast, Django inspired template system in Clojure.

`gists.html` template:
```html
{% extends "layout.html" %} {% block main %}
<p class="delims">clojure memes</p>
<img src="https://imgs.xkcd.com/comics/lisp_cycles.png" alt="" />
<p class="delims">gists</p>
<div class="gists">
    {% for gist in gists %}
    <p>{{gist}}</p>

    {% endfor %}
</div>
<hr style="margin: 1.5rem 0" />
<form method="POST" action="/gists">
    <label for="gist">Gist:</label>
    <textarea name="gist"></textarea>
    <input type="submit" value="Submit gist" />
</form>
<p class="delims">end of section</p>
{% endblock %}
```

```bash
{{7*7}}letmein # Error
letmein{{7*7}} # letmein, SSTI cut off
letme{{7*7}}in # letme, SSTI and "in" cut off
```

[ANN: NEVER use clojure.core/read or read-string for reading untrusted data](https://groups.google.com/g/clojure/c/YBkUaIaRaow) -> [https://clojuredocs.org/clojure.core/read](https://clojuredocs.org/clojure.core/read)

![Manifesto-3.png](/assets/ctf/0xl4ugh/manifesto-3.png)

It doesn't like the PoC given above, but its definitely evaluating our code!

![Manifesto-4.png](/assets/ctf/0xl4ugh/manifesto-4.png)

To read Environment Variable in clojure you use `#=(System/getenv "FLAG")`, but for some reason it wasn't working?....

To read files in 1 command we can use [slurp](https://clojuredocs.org/clojure.core/slurp)

Dump environment manually `#=(slurp "/proc/self/environ")`

![Manifesto-5.png](/assets/ctf/0xl4ugh/manifesto-5.png)

> Flag: `flag{eENYXJGL2gnkZbMaPIKZzyPzFH3oBjri}`