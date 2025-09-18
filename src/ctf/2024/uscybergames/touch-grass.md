# Touch Grass

## Description

Touch-Grass [Web]

ARIA has ordered you to touch grass. Now you actually have to do it. Make up for all the times you havent touched it.

https://uscybercombine-touch-grass.chals.io/

## Solution

On `/login` we have a sign in/up page:
![Touch Grass](/assets/ctf/uscybergames/touch_grass.png)

Creds: `test01:test01`

![Touch Grass-1](/assets/ctf/uscybergames/touch_grass-1.png)  

All links are `javascript:void(0)`, but in the source we see:
```html
       <h4 style="color:red">!Important!</h4>
        <p>The following is your grass touch counter. You need over 100000 to successfully make up for the times you havent touched grass.</p>
        <h4>Touch Count: 0</h4>
        <!-- Put clickable image of grass here. Need javascript to send POST when clicked-->
        <!-- New click API at /api/click, remove the admin version ASAP -->
```

Playing with API:
![Touch Grass-2](/assets/ctf/uscybergames/touch_grass-2.png)  

Send json:
![Touch Grass-3](/assets/ctf/uscybergames/touch_grass-3.png)  

Send username:
![Touch Grass-4](/assets/ctf/uscybergames/touch_grass-4.png)  

After some guessing:
![Touch Grass-5](/assets/ctf/uscybergames/touch_grass-5.png)  

I thought this might have been SQLi, but after few attempts I gave up. Then I noticed login in through API, but we have 2 apis.
![Touch Grass-6](/assets/ctf/uscybergames/touch_grass-6.png)  

Create new user though `admin` api:
![Touch Grass-7](/assets/ctf/uscybergames/touch_grass-7.png)  

Make request:
![Touch Grass-8](/assets/ctf/uscybergames/touch_grass-8.png)  

Get all the touches you need:
![Touch Grass-9](/assets/ctf/uscybergames/touch_grass-9.png)  

Profit:
![Touch Grass-10](/assets/ctf/uscybergames/touch_grass-10.png)
::: tip Flag
`**SIVBGR{T0uch_1t}**`
:::
