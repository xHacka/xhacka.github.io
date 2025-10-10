# TYPicalBoss

## Description

My boss just implemented his first PHP website. He mentioned that he managed to calculate a hash that is equal to 0??? I suppose he is not very experienced in PHP yet. 

Author: @moaath

[http://52.59.124.14:10022/index.php](http://52.59.124.14:10022/index.php)

## Solution

As soon as I read the description attack vector became clear. Combination of [Type Juggling](https://github.com/swisskyrepo/PayloadsAllTheThings/blob/master/Type%20Juggling/README.md) and [Hash Collision](https://www.wikiwand.com/en/Hash_collision).

Fortunately hash collision is easy, because it has already been found.

This repo contains most of the hashes: <https://github.com/spaze/hashes>.

My first guess was that it was MD5, then I tried SHA1 (common php hash functions).

Using username of `admin` and any SHA1 magic hash as password we can login with ease.

```md
# Flag Page
This is the sensitive information accessible to logged-in users only.

ENO{m4ny_th1ng5_c4n_g0_wr0ng_1f_y0u_d0nt_ch3ck_typ35}
```
::: tip Flag
`ENO{m4ny_th1ng5_c4n_g0_wr0ng_1f_y0u_d0nt_ch3ck_typ35}`
:::

### Note

Turns out if you just visit <http://52.59.124.14:10022> you get `Index Of` page with file listing,  one of the file being the database.

```sql
sqlite> SELECT * FROM users;
1 | admin | 0e12345678912345678920202020202020202020
2 | maria | 2F59FE7952F272182D771C9516F4F2D70F35B462
3 | mike  | F1DB68C4A85C6B18D2955D39B512C40F8096C142
```

If you're still wandering why the hash attack worked it's because `0e...` 

```php
php > echo "Scientific Notation: " . 0e10;
Scientific Notation: 0
php > echo "Scientific Notation: " . 1e10;
Scientific Notation: 10000000000
```