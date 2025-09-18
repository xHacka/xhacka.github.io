# Not Today

## Description
 
Not Today | 75  points | By  `Mudasir Ali`

This website gives you the flag sometimes. When it feels like it. In a special time zone. Time Zone:  `GMT+∀ (BCA Special Time)`  Date Time:  `Wed Jun 07 2023 06:09:42`

Web servers: [challs.bcactf.com:30603](http://challs.bcactf.com:30603/)

## Analysis   

The `index.html` contains this script which makes call to api and returns flag. 

::: raw
```js
<script>
    const today = new Date();
    fetch('/api', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({date: today.toString()})
    })
    .then(response => response.json())
    .then(data => { document.getElementById('flag').innerHTML = data.flag; });
</script>
```
:::

## Solution

As described by above it needs a specific time. Open console on the same page and run.

```js
fetch('/api', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({date: "Wed Jun 07 2023 06:09:42 GMT+∀ (BCA Special Time)"})
})
.then(response => response.json())
.then(data => { console.log(data.flag);});
```

Flag: `bcactf{y0U_m@d3_hT7p_H!$70rY?!_HDU38rndu8}`