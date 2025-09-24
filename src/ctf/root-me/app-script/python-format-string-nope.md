# Python Format String Nope

## Statement

Identify and exploit the vulnerability in the following script to extract validation’s password.
## Source

```python
#!/usr/bin/python3
 
SECRET = open("/challenge/app-script/ch25/.passwd").read()
 
class Sandbox:
   
    def ask_age(self):
        self.age = input("How old are you ? ")
        self.width = input("How wide do you want the nice box to be ? ")
   
    def ask_secret(self):
        if input("What is the secret ? ") == SECRET:
            print("You found the secret ! I thought this was impossible.")
        else:
            print("Wrong secret")
 
    def run(self):
        while True:
            self.ask_age()
            to_format = f"""
Printing a {self.width}-character wide box:
[Age: {{self.age:{self.width}}} ]"""
            print(to_format.format(self=self))
            self.ask_secret()
 
Sandbox().run()
```

[Download](https://www.root-me.org/local/cache-code/1f7acb564c4b7faf70c1d211a8472701.txt)
## Challenge connection information

| Key        | Value                                                                                                                                                                                                                                                                                                                                 |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Host       | challenge02.root-me.org                                                                                                                                                                                                                                                                                                               |
| Protocol   | SSH                                                                                                                                                                                                                                                                                                                                   |
| Port       | 2222                                                                                                                                                                                                                                                                                                                                  |
| SSH access | [ssh -p 2222 app-script-ch25@challenge02.root-me.org](ssh://app-script-ch25:app-script-ch25@challenge02.root-me.org:2222 "SSH access")     [![](https://www.root-me.org/squelettes/img/webssh.png?1454749832) WebSSH](http://webssh.root-me.org/?location=WebSSH_2868&ssh=ssh://app-script-ch25:app-script-ch25@challenge02 "WebSSH") |
| Username   | app-script-ch25                                                                                                                                                                                                                                                                                                                       |
| Password   | app-script-ch25                                                                                                                                                                                                                                                                                                                       |
## Solution

