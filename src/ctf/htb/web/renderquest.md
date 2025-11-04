# Web

## Description

URL: [https://app.hackthebox.com/challenges/RenderQuest](https://app.hackthebox.com/challenges/RenderQuest)

You've found a website that lets you input remote templates for rendering. Your task is to exploit this system's vulnerabilities to access and retrieve a hidden flag. Good luck!

## Source

`entrypoint.sh`
```bash
#!/bin/ash

# Change flag name
mv /flag.txt /flag$(cat /dev/urandom | tr -cd 'a-f0-9' | head -c 10).txt

# Secure entrypoint
chmod 600 /entrypoint.sh

# Start application
/usr/bin/supervisord -c /etc/supervisord.conf
```

`main.go`
```go
package main

import (
	"encoding/json"
	"fmt"
	"html/template"
	"io"
	"net/http"
	"os"
	"os/exec"
	"path/filepath"
	"strings"
)

const WEB_PORT = "1337"
const TEMPLATE_DIR = "./templates"

type LocationInfo struct {
	IpVersion     int     `json:"ipVersion"`
	IpAddress     string  `json:"ipAddress"`
	Latitude      float64 `json:"latitude"`
	Longitude     float64 `json:"longitude"`
	CountryName   string  `json:"countryName"`
	CountryCode   string  `json:"countryCode"`
	TimeZone      string  `json:"timeZone"`
	ZipCode       string  `json:"zipCode"`
	CityName      string  `json:"cityName"`
	RegionName    string  `json:"regionName"`
	Continent     string  `json:"continent"`
	ContinentCode string  `json:"continentCode"`
}

type MachineInfo struct {
	Hostname      string
	OS            string
	KernelVersion string
	Memory        string
}

type RequestData struct {
	ClientIP     string
	ClientUA     string
	ServerInfo   MachineInfo
	ClientIpInfo LocationInfo `json:"location"`
}

func (p RequestData) FetchServerInfo(command string) string {
	out, err := exec.Command("sh", "-c", command).Output()
	if err != nil {
		return ""
	}
	return string(out)
}

func (p RequestData) GetLocationInfo(endpointURL string) (*LocationInfo, error) {
	resp, err := http.Get(endpointURL)
	if err != nil {
		return nil, err
	}

	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("HTTP request failed with status code: %d", resp.StatusCode)
	}

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}

	var locationInfo LocationInfo
	if err := json.Unmarshal(body, &locationInfo); err != nil {
		return nil, err
	}

	return &locationInfo, nil
}

func isSubdirectory(basePath, path string) bool {
	rel, err := filepath.Rel(basePath, path)
	if err != nil {
		return false
	}
	return !strings.HasPrefix(rel, ".."+string(filepath.Separator))
}

func readFile(filepath string, basePath string) (string, error) {
	if !isSubdirectory(basePath, filepath) {
		return "", fmt.Errorf("Invalid filepath")
	}

	data, err := os.ReadFile(filepath)
	if err != nil {
		return "", err
	}
	return string(data), nil
}

func readRemoteFile(url string) (string, error) {
	response, err := http.Get(url)
	if err != nil {
		return "", err
	}

	defer response.Body.Close()

	if response.StatusCode != http.StatusOK {
		return "", fmt.Errorf("HTTP request failed with status code: %d", response.StatusCode)
	}

	content, err := io.ReadAll(response.Body)
	if err != nil {
		return "", err
	}

	return string(content), nil
}

func getIndex(w http.ResponseWriter, r *http.Request) {
	http.Redirect(w, r, "/render?page=index.tpl", http.StatusMovedPermanently)
}

func getTpl(w http.ResponseWriter, r *http.Request) {
	var page string = r.URL.Query().Get("page")
	var remote string = r.URL.Query().Get("use_remote")

	if page == "" {
		http.Error(w, "Missing required parameters", http.StatusBadRequest)
		return
	}

	reqData := &RequestData{}

	userIPCookie, err := r.Cookie("user_ip")
	clientIP := ""

	if err == nil {
		clientIP = userIPCookie.Value
	} else {
		clientIP = strings.Split(r.RemoteAddr, ":")[0]
	}

	userAgent := r.Header.Get("User-Agent")

	locationInfo, err := reqData.GetLocationInfo("https://freeipapi.com/api/json/" + clientIP)

	if err != nil {
		fmt.Println(err)
		http.Error(w, "Could not fetch IP location info", http.StatusInternalServerError)
		return
	}

	reqData.ClientIP = clientIP
	reqData.ClientUA = userAgent
	reqData.ClientIpInfo = *locationInfo
	reqData.ServerInfo.Hostname = reqData.FetchServerInfo("hostname")
	reqData.ServerInfo.OS = reqData.FetchServerInfo("cat /etc/os-release | grep PRETTY_NAME | cut -d '\"' -f 2")
	reqData.ServerInfo.KernelVersion = reqData.FetchServerInfo("uname -r")
	reqData.ServerInfo.Memory = reqData.FetchServerInfo("free -h | awk '/^Mem/{print $2}'")

	var tmplFile string

	if remote == "true" {
		tmplFile, err = readRemoteFile(page)

		if err != nil {
			http.Error(w, "Internal Server Error", http.StatusInternalServerError)
			return
		}
	} else {
		tmplFile, err = readFile(TEMPLATE_DIR+"/"+page, "./")

		if err != nil {
			http.Error(w, "Internal Server Error", http.StatusInternalServerError)
			return
		}
	}

	tmpl, err := template.New("page").Parse(tmplFile)
	if err != nil {
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}

	err = tmpl.Execute(w, reqData)
	if err != nil {
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}
}

func main() {
	mux := http.NewServeMux()

	mux.HandleFunc("/", getIndex)
	mux.HandleFunc("/render", getTpl)
	mux.Handle("/static/", http.StripPrefix("/static/", http.FileServer(http.Dir("static"))))

	fmt.Println("Server started at port " + WEB_PORT)
	http.ListenAndServe(":"+WEB_PORT, mux)
}
```
## Solution

![renderquest.png](/assets/ctf/htb/web/renderquest.png)

We can render "templates" from URLs

[http://83.136.251.216:49900/render?use_remote=true&page=http://google.com](http://83.136.251.216:49900/render?use_remote=true&page=http://google.com)

![renderquest-1.png](/assets/ctf/htb/web/renderquest-1.png)

The `/render` endpoint is the main endpoint of application as even `getIndex` refers to `/render` template. 
```go
mux.HandleFunc("/", getIndex)
mux.HandleFunc("/render", getTpl)
```

The app allows us to control the `page` which is just url where server request is made and later is parsed by `template` module.
```go
func getTpl(w http.ResponseWriter, r *http.Request) {
	var page string = r.URL.Query().Get("page")
	var remote string = r.URL.Query().Get("use_remote")
...
    if remote == "true" {
        tmplFile, err = readRemoteFile(page)
...
	tmpl, err := template.New("page").Parse(tmplFile)
	err = tmpl.Execute(w, reqData)

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 

func readRemoteFile(url string) (string, error) {
    response, err := http.Get(url)
    defer response.Body.Close()
    content, err := io.ReadAll(response.Body)
    return string(content), nil
}
```

This smells like SSTI: [https://book.hacktricks.xyz/pentesting-web/ssti-server-side-template-injection#ssti-in-go](https://book.hacktricks.xyz/pentesting-web/ssti-server-side-template-injection#ssti-in-go)

_For RCE via SSTI in Go, object methods can be invoked. For example, if the provided object has a `System` method executing commands, it can be exploited like <span v-pre>`{{ .System "ls" }}`</span>._

`FetchServerInfo` is the perfect target!
```go
func (p RequestData) FetchServerInfo(command string) string {
	out, err := exec.Command("sh", "-c", command).Output()
	if err != nil {
		return ""
	}
	return string(out)
}
```

I didn't want to use `ngrok` so I just use `pastebin` lol

![renderquest-2.png](/assets/ctf/htb/web/renderquest-2.png)

And it worked!

![renderquest-3.png](/assets/ctf/htb/web/renderquest-3.png)

Get the flag:

![renderquest-4.png](/assets/ctf/htb/web/renderquest-4.png)

> Flag: `HTB{qu35t_f0r_th3_f0rb1dd3n_t3mpl4t35!!}`

