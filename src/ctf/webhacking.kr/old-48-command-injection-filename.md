# Old 48    Command Injection (Filename)

URL: [http://webhacking.kr:10006](http://webhacking.kr:10006)

![old-48.png](/assets/ctf/webhacking.kr/old-48.png)

Application seems to be simple chat server which allows us to send message, delete message and upload something, but upload doesn't say anything if it was successful or not..

`/upload` gives `Forbidden` instead of `Not Found`... 

![old-48-1.png](/assets/ctf/webhacking.kr/old-48-1.png)

Looks like if you `upload` + `message` then file is successfully uploaded and can be viewed.

![old-48-3.png](/assets/ctf/webhacking.kr/old-48-3.png)

After uploading php shell we get php as text.

![old-48-2.png](/assets/ctf/webhacking.kr/old-48-2.png)

I tried overwriting `.htaccess` to allow php execution, but unsuccessful.

The request which deletes files is somewhat interesting...

![old-48-4.png](/assets/ctf/webhacking.kr/old-48-4.png)

Since the filename is the only read foothold we should focus on that. We could try performing Command Injection via filenames?

Upload file named `;ls`

![old-48-6.png](/assets/ctf/webhacking.kr/old-48-6.png)

Delete file:

![old-48-5.png](/assets/ctf/webhacking.kr/old-48-5.png)

> Flag: `FLAG{i_think_this_chall_is_cool}`

