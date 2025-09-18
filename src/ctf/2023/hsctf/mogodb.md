# Mogodb

## Description

web/mogodb (by hmmm) | 355 points

The web-scale DB of the future!

[http://mogodb.hsctf.com/](http://mogodb.hsctf.com/)

Downloads: [mogodb.zip](https://hsctf-10-resources.storage.googleapis.com/uploads/16cab5257f60879bf4075c98ebfe616b6fe3c072a02ac4be86cbd4886b0d1b3f/mogodb.zip)

## Analysis

We need to login in the application with `admin` username, but we dont have a password.

We need to perform a [NoSQLi](https://book.hacktricks.xyz/pentesting-web/nosql-injection) to login without password.

```py
user = db.users.find_one(
	{
	"$where":
		f"this.user === '{request.form['user']}' && this.password === '{request.form['password']}'"
	}
)
```

## Solution

I used `' == '` as payload to login as admin.
Essentially the query becomes this `this.password === '' == ''"`
![mogodb-1](/assets/ctf/hsctf/mogodb-1.png)

I found [This Answer](https://security.stackexchange.com/a/83234) most helpful 