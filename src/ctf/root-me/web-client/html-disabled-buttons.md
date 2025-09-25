# Html Disabled Buttons

## Description

This form is disabled and can not be used. It’s up to you to find a way to use it.

[Start the challenge](http://challenge01.root-me.org/web-client/ch25/)

## Solution

Input fields are disabled with HTML, frontend restrictions are very easy to bypass. 

![html---disabled-buttons.png](/assets/ctf/root-me/html-disabled-buttons.png)

In this case we can just edit HTML and remove `disabled` property from `input` tags to make them usable on frontend.

![html---disabled-buttons-1.png](/assets/ctf/root-me/html-disabled-buttons-1.png)

![html---disabled-buttons-2.png](/assets/ctf/root-me/html-disabled-buttons-2.png)

Alternatively just `curl`. Most of the times variable names that server processes in backend responds to form element `name` attributes.
```bash
└─$ curl http://challenge01.root-me.org/web-client/ch25/ -d 'auth-login=1&authbutton=2' -s | grep Member
<div class='success'>Member access granted! The validation password is HTMLCantStopYou</div>    </body>
```

`auth-login` can be anything for this challenge, as long as it's not empty.

::: tip Flag
`HTMLCantStopYou`
:::

