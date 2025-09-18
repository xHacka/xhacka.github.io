# Cookie 

## Solution

No description, just URL.

![Cookie.png](/assets/ctf/uscybergames/cookie.png)

```bash
└─$ echo 'QWZ0ZXIgaW5zcGVjdGluZyB0aGUgY29udGVudHMsIGhlJ2xsIGhvcCBvbiB0aGUgUk9CT1QgdmFjY3V1bSBwaWNraW5nIHVwIHRoZSBjcnVtYnMgaGUgbWFkZS4KQ3J1bWIgMTogZFY5Q1FHc3paRjloVA==' | base64 -d
After inspecting the contents, he'll hop on the ROBOT vaccuum picking up the crumbs he made.
Crumb 1: dV9CQGszZF9hT 
```

```bash
└─$ curl https://bcraagww.web.ctf.uscybergames.com/robots.txt
User-agent: *
Disallow: /admin

# The robot vaccuum arrives at a locked door, which naturally he'll want to get inside
# Crumb 2: jB0SDNSX2MwMG 
```

```bash
└─$ curl https://bcraagww.web.ctf.uscybergames.com/admin
...
    <script>
        const ADMIN_USER = 'admin';
        const CRUMB_3 = 'sxM19mT3JfZEF';
        function login() {
            const user = document.getElementById('username').value;
            const pass = document.getElementById('password').value;
            if (user === ADMIN_USER && pass === CRUMB_3) {
                window.location.href = '/kitchen';
            } else {
                document.getElementById('error').style.display = 'block';
            }
        }
    </script>
...
```

Gives bunch of files, download recursively:
```bash
└─$ wget -r https://bcraagww.web.ctf.uscybergames.com/kitchen
└─$ grep 'CRUMB' . -Rain
./floor/aNoteFallenFromTheFridge.txt:4:- 4 Crumbs
./floor/aNoteFallenFromTheFridge.txt:17:2) Assemble all 4 crumbs in order from 1 to 4.
./floor/aNoteFallenFromTheFridge.txt:18:3) Place assembled crumbs into the oven for 20 minutes to bake into a cookie.
./README.txt:3:Crumb 3? Try the password on the door.
./refrigerator/Milk.js:9:    var crumb4 = "fTW9VNWUhISE=";
```

```bash
└─$ echo 'dV9CQGszZF9hTjB0SDNSX2MwMGsxM19mT3JfZEFfTW9VNWUhISE=' | base64 -d
u_B@k3d_aN0tH3R_c00k13_fOr_dA_MoU5e!!!

└─$ cat floor/aNoteFallenFromTheFridge.txt
...
Instructions:
1) Preheat oven to 320 degrees.
2) Assemble all 4 crumbs in order from 1 to 4.
3) Place assembled crumbs into the oven for 20 minutes to bake into a cookie.
4) Decode the assembled cookie using Base64 until nice and golden.
5) Use Cookie Editor to edit the original cookie with our new assembled cookie.
6) Refresh the home page.
7) Enjoy your FLAG cookie~! 
```

![Cookie-1.png](/assets/ctf/uscybergames/cookie-1.png)

::: tip Flag
`SVBRG{he_w1ll_g!v3_y0u_A_fL@g_a5_tH4nk5!}`
:::

