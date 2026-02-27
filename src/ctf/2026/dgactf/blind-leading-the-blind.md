# Blind Leading the Blind

## Description

[breach_08_01_2026.pcapng](https://dgactf.com/files/cd9df40b1e2c6e8a823fa9fde9930396/breach_08_01_2026.pcapng?token=eyJ1c2VyX2lkIjoyMCwidGVhbV9pZCI6bnVsbCwiZmlsZV9pZCI6OX0.aY93Mg.MEDmnxeso7ZNjYlCTyfXG6m5PBw)

## Solution

The given traffic is almost all HTTP

![blind-leading-the-blind.png](/assets/ctf/dgactf/blind-leading-the-blind.png)

By the looks of it traffic is Blind SQL Injection using SQLMap. Most likely the flag is inside exfiltrated data :D

I exported HTTP objects via Wireshark and checked for responses. 
```bash
└─$ for file in *; do cat $file; echo; done | sort | uniq -c
    458 <pre>User ID exists in the database.</pre>        # True
    591 <pre>User ID is MISSING from the database. </pre> # False
```

::: info Note
You can extract objects in Linux, Windows filename won't allow such names.
:::

Now we just need to parse out attack to determine what the hackers got in output...

::: details solver.py
```python
import itertools
import subprocess
import sys
import threading
import time
from collections import defaultdict
from urllib.parse import unquote
import re

PCAP = "breach_08_01_2026.pcapng"
NOT_ORD_RE = re.compile(r"OR NOT ORD\(MID\((\(.+?\)),(\d+),1\)\)>(\d+)--", re.I)
ORD_RE = re.compile(r"OR ORD\(MID\((\(.+?\)),(\d+),1\)\)>(\d+)--", re.I)


def _spinner(stop_event, msg):
    chars = itertools.cycle(r"/-\|")
    while not stop_event.is_set():
        sys.stdout.write(f"\r  {msg} {next(chars)}   ")
        sys.stdout.flush()
        time.sleep(0.1)
    sys.stdout.write(f"\r  {msg} done.\n")
    sys.stdout.flush()


def run_tshark(*args, progress_msg=None):
    cmd = ["tshark", "-r", PCAP] + list(args)
    stop = threading.Event()
    if progress_msg:
        t = threading.Thread(target=_spinner, args=(stop, progress_msg), daemon=True)
        t.start()
    try:
        resp = subprocess.run(cmd, capture_output=True, text=True)
    finally:
        if progress_msg:
            stop.set()
            t.join()
    if resp.returncode != 0 and resp.stderr:
        print(resp.stderr, file=sys.stderr)
        sys.exit(1)
    return resp.stdout


def parse_requests():
    """Extract HTTP requests: stream -> [(frame, uri)]"""
    out = run_tshark(
        "-Y", "http.request.method==GET",
        "-T", "fields", "-E", "separator=\t",
        "-e", "frame.number", "-e", "tcp.stream", "-e", "http.request.uri",
        progress_msg="[1/3] Extracting HTTP requests"
    )
    stream_requests = defaultdict(list)
    for line in out.strip().split("\n"):
        if not line: continue
        
        parts = line.split("\t", 2)
        if len(parts) < 3: continue
        
        try:
            frame = int(parts[0])
            stream = int(parts[1])
            uri = unquote(parts[2].strip()) if parts[2].strip() else ""
        except (ValueError, IndexError):
            continue
        
        stream_requests[stream].append((frame, uri))

    return stream_requests


def extract_responses(stream_requests):
    """Run tshark for TRUE/FALSE packets, match to requests. Returns [(uri, result)]"""
    response_true = run_tshark(
        "-Y", 'frame contains "exists in the database"',
        "-T", "fields", "-E", "separator=\t",
        "-e", "frame.number", "-e", "tcp.stream",
        progress_msg="[2/3] Extracting TRUE responses"
    )
    response_false = run_tshark(
        "-Y", 'frame contains "MISSING from the database"',
        "-T", "fields", "-E", "separator=\t",
        "-e", "frame.number", "-e", "tcp.stream",
        progress_msg="[3/3] Extracting FALSE responses"
    )

    responses = {}
    for response, result in [(response_true, "TRUE"), (response_false, "FALSE")]:
        for line in response.strip().split("\n"):
            if not line: continue

            parts = line.split("\t")
            if len(parts) < 2: continue
            
            try:
                response_frame, stream = map(int, parts)
            except (ValueError, IndexError):
                continue

            requests = stream_requests.get(stream, [])
            best = None
            for request_frame, uri in requests:
                if request_frame < response_frame and (best is None or request_frame > best[0]):
                    best = (request_frame, uri)
            
            if best:
                request_frame, uri = best
                responses[(stream, request_frame)] = result

    requests_with_resp = []
    for stream, requests in stream_requests.items():
        for request_frame, uri in requests:
            response = responses.get((stream, request_frame))
            if response:
                requests_with_resp.append((uri, response))

    return requests_with_resp


def extract_searches(requests_with_resp):
    """Parse ORD(MID(...)) from URIs. Returns (query, pos) -> [(num, op)]"""
    searches = defaultdict(list)
    for uri, resp in requests_with_resp:
        m = NOT_ORD_RE.search(uri)
        if m:
            q, pos, num = m.group(1), int(m.group(2)), int(m.group(3))
            searches[(q, pos)].append((num, "<=" if resp == "TRUE" else ">"))
            continue
        m = ORD_RE.search(uri)
        if m:
            q, pos, num = m.group(1), int(m.group(2)), int(m.group(3))
            searches[(q, pos)].append((num, ">" if resp == "TRUE" else "<="))
    return searches


def resolve_chars(searches):
    """Convert binary search bounds to characters. Returns query -> {pos: char}"""
    queries = defaultdict(dict)
    for (query, pos), comparisons in searches.items():
        lower, upper = 0, 127
        for num, op in comparisons:
            if op == ">":
                lower = max(lower, num)
            else:
                upper = min(upper, num)
                
        val = upper if upper >= lower else lower
        if val == 0:
            continue
        if 32 <= val <= 126:
            queries[query][pos] = chr(val)
        else:
            queries[query][pos] = f"[{val}]"
            
    return queries


def main():
    stream_requests = parse_requests()
    requests_with_resp = extract_responses(stream_requests)

    total_reqs = sum(len(v) for v in stream_requests.values())
    print(f"Requests: {total_reqs}, Matched: {len(requests_with_resp)}")

    print("  Parsing injection payloads...", flush=True)
    searches = extract_searches(requests_with_resp)
    queries = resolve_chars(searches)

    print(f"\n=== LEAKED DATA ({len(queries)} queries) ===")
    for query in sorted(queries.keys(), key=lambda q: min(queries[q].keys())):
        positions = queries[query]
        result = "".join(positions[k] for k in sorted(positions))
        short = query[:80] + "..." if len(query) > 80 else query
        print(f"\nQuery: {short}")
        print(f"Data:  {result}")


if __name__ == "__main__":
    if len(sys.argv) > 1:
        PCAP = sys.argv[1]
    main()
```
:::

::: details solver.log
```bash
  [1/3] Extracting HTTP requests done.
  [2/3] Extracting TRUE responses done.
  [3/3] Extracting FALSE responses done.
Requests: 5943, Matched: 5857
  Parsing injection payloads...

=== LEAKED DATA (85 queries) ===

Query: (SELECT IFNULL(CAST(COUNT(DISTINCT(schema_name)) AS NCHAR),0x20) FROM INFORMATIO...
Data:  2[9]

Query: (SELECT DISTINCT(IFNULL(CAST(schema_name AS NCHAR),0x20)) FROM INFORMATION_SCHEM...
Data:  information_schema[1]

Query: (SELECT DISTINCT(IFNULL(CAST(schema_name AS NCHAR),0x20)) FROM INFORMATION_SCHEM...
Data:  dvwa[1]

Query: (SELECT IFNULL(CAST(COUNT(table_name) AS NCHAR),0x20) FROM INFORMATION_SCHEMA.TA...
Data:  3[9]

Query: (SELECT IFNULL(CAST(table_name AS NCHAR),0x20) FROM INFORMATION_SCHEMA.TABLES WH...
Data:  guestbook[1]

Query: (SELECT IFNULL(CAST(table_name AS NCHAR),0x20) FROM INFORMATION_SCHEMA.TABLES WH...
Data:  users[1]

Query: (SELECT IFNULL(CAST(table_name AS NCHAR),0x20) FROM INFORMATION_SCHEMA.TABLES WH...
Data:  secrets[1]

Query: (SELECT IFNULL(CAST(COUNT(column_name) AS NCHAR),0x20) FROM INFORMATION_SCHEMA.C...
Data:  3[9]

Query: (SELECT IFNULL(CAST(column_name AS NCHAR),0x20) FROM INFORMATION_SCHEMA.COLUMNS ...
Data:  comment_id[1]

Query: (SELECT IFNULL(CAST(column_name AS NCHAR),0x20) FROM INFORMATION_SCHEMA.COLUMNS ...
Data:  comment[1]

Query: (SELECT IFNULL(CAST(column_name AS NCHAR),0x20) FROM INFORMATION_SCHEMA.COLUMNS ...
Data:  name[1]

Query: (SELECT IFNULL(CAST(COUNT(*) AS NCHAR),0x20) FROM dvwa.guestbook)
Data:  1[9]

Query: (SELECT IFNULL(CAST(`comment` AS NCHAR),0x20) FROM dvwa.guestbook ORDER BY `name...
Data:  This is a test comment.[1]

Query: (SELECT IFNULL(CAST(`name` AS NCHAR),0x20) FROM dvwa.guestbook ORDER BY `name` L...
Data:  test[1]

Query: (SELECT IFNULL(CAST(comment_id AS NCHAR),0x20) FROM dvwa.guestbook ORDER BY `nam...
Data:  1[1]

Query: (SELECT IFNULL(CAST(COUNT(column_name) AS NCHAR),0x20) FROM INFORMATION_SCHEMA.C...
Data:  8[9]

Query: (SELECT IFNULL(CAST(column_name AS NCHAR),0x20) FROM INFORMATION_SCHEMA.COLUMNS ...
Data:  user_id[1]

Query: (SELECT IFNULL(CAST(column_name AS NCHAR),0x20) FROM INFORMATION_SCHEMA.COLUMNS ...
Data:  first_name[1]

Query: (SELECT IFNULL(CAST(column_name AS NCHAR),0x20) FROM INFORMATION_SCHEMA.COLUMNS ...
Data:  last_name[1]

Query: (SELECT IFNULL(CAST(column_name AS NCHAR),0x20) FROM INFORMATION_SCHEMA.COLUMNS ...
Data:  user[1]

Query: (SELECT IFNULL(CAST(column_name AS NCHAR),0x20) FROM INFORMATION_SCHEMA.COLUMNS ...
Data:  password[1]

Query: (SELECT IFNULL(CAST(column_name AS NCHAR),0x20) FROM INFORMATION_SCHEMA.COLUMNS ...
Data:  avatar[1]

Query: (SELECT IFNULL(CAST(column_name AS NCHAR),0x20) FROM INFORMATION_SCHEMA.COLUMNS ...
Data:  last_login[1]

Query: (SELECT IFNULL(CAST(column_name AS NCHAR),0x20) FROM INFORMATION_SCHEMA.COLUMNS ...
Data:  failed_login[1]

Query: (SELECT IFNULL(CAST(COUNT(*) AS NCHAR),0x20) FROM dvwa.users)
Data:  5[9]

Query: (SELECT IFNULL(CAST(`user` AS NCHAR),0x20) FROM dvwa.users ORDER BY `user` LIMIT...
Data:  1337[1]

Query: (SELECT IFNULL(CAST(avatar AS NCHAR),0x20) FROM dvwa.users ORDER BY `user` LIMIT...
Data:  /hackable/users/1337.jpg[1]

Query: (SELECT IFNULL(CAST(failed_login AS NCHAR),0x20) FROM dvwa.users ORDER BY `user`...
Data:  0[1]

Query: (SELECT IFNULL(CAST(first_name AS NCHAR),0x20) FROM dvwa.users ORDER BY `user` L...
Data:  Hack[1]

Query: (SELECT IFNULL(CAST(last_login AS NCHAR),0x20) FROM dvwa.users ORDER BY `user` L...
Data:  2026-01-08 01:53:48[1]

Query: (SELECT IFNULL(CAST(last_name AS NCHAR),0x20) FROM dvwa.users ORDER BY `user` LI...
Data:  Me[1]

Query: (SELECT IFNULL(CAST(password AS NCHAR),0x20) FROM dvwa.users ORDER BY `user` LIM...
Data:  8d3533d75ae2c3966d7e0d4fcc69216b[1]

Query: (SELECT IFNULL(CAST(user_id AS NCHAR),0x20) FROM dvwa.users ORDER BY `user` LIMI...
Data:  3[1]

Query: (SELECT IFNULL(CAST(`user` AS NCHAR),0x20) FROM dvwa.users ORDER BY `user` LIMIT...
Data:  admin[1]

Query: (SELECT IFNULL(CAST(avatar AS NCHAR),0x20) FROM dvwa.users ORDER BY `user` LIMIT...
Data:  /hackable/users/admin.jpg[1]

Query: (SELECT IFNULL(CAST(failed_login AS NCHAR),0x20) FROM dvwa.users ORDER BY `user`...
Data:  0[1]

Query: (SELECT IFNULL(CAST(first_name AS NCHAR),0x20) FROM dvwa.users ORDER BY `user` L...
Data:  admin[1]

Query: (SELECT IFNULL(CAST(last_login AS NCHAR),0x20) FROM dvwa.users ORDER BY `user` L...
Data:  2026-01-08 01:53:48[1]

Query: (SELECT IFNULL(CAST(last_name AS NCHAR),0x20) FROM dvwa.users ORDER BY `user` LI...
Data:  admin[1]

Query: (SELECT IFNULL(CAST(password AS NCHAR),0x20) FROM dvwa.users ORDER BY `user` LIM...
Data:  5f4dcc3b5aa765d61d8327deb882cf99[1]

Query: (SELECT IFNULL(CAST(user_id AS NCHAR),0x20) FROM dvwa.users ORDER BY `user` LIMI...
Data:  1[1]

Query: (SELECT IFNULL(CAST(`user` AS NCHAR),0x20) FROM dvwa.users ORDER BY `user` LIMIT...
Data:  gordonb[1]

Query: (SELECT IFNULL(CAST(avatar AS NCHAR),0x20) FROM dvwa.users ORDER BY `user` LIMIT...
Data:  /hackable/users/gordonb.jpg[1]

Query: (SELECT IFNULL(CAST(failed_login AS NCHAR),0x20) FROM dvwa.users ORDER BY `user`...
Data:  0[1]

Query: (SELECT IFNULL(CAST(first_name AS NCHAR),0x20) FROM dvwa.users ORDER BY `user` L...
Data:  Gordon[1]

Query: (SELECT IFNULL(CAST(last_login AS NCHAR),0x20) FROM dvwa.users ORDER BY `user` L...
Data:  2026-01-08 01:53:48[1]

Query: (SELECT IFNULL(CAST(last_name AS NCHAR),0x20) FROM dvwa.users ORDER BY `user` LI...
Data:  Brown[1]

Query: (SELECT IFNULL(CAST(password AS NCHAR),0x20) FROM dvwa.users ORDER BY `user` LIM...
Data:  e99a18c428cb38d5f260853678922e03[1]

Query: (SELECT IFNULL(CAST(user_id AS NCHAR),0x20) FROM dvwa.users ORDER BY `user` LIMI...
Data:  2[1]

Query: (SELECT IFNULL(CAST(`user` AS NCHAR),0x20) FROM dvwa.users ORDER BY `user` LIMIT...
Data:  pablo[1]

Query: (SELECT IFNULL(CAST(avatar AS NCHAR),0x20) FROM dvwa.users ORDER BY `user` LIMIT...
Data:  /hackable/users/pablo.jpg[1]

Query: (SELECT IFNULL(CAST(failed_login AS NCHAR),0x20) FROM dvwa.users ORDER BY `user`...
Data:  0[1]

Query: (SELECT IFNULL(CAST(first_name AS NCHAR),0x20) FROM dvwa.users ORDER BY `user` L...
Data:  Pablo[1]

Query: (SELECT IFNULL(CAST(last_login AS NCHAR),0x20) FROM dvwa.users ORDER BY `user` L...
Data:  2026-01-08 01:53:48[1]

Query: (SELECT IFNULL(CAST(last_name AS NCHAR),0x20) FROM dvwa.users ORDER BY `user` LI...
Data:  Picasso[1]

Query: (SELECT IFNULL(CAST(password AS NCHAR),0x20) FROM dvwa.users ORDER BY `user` LIM...
Data:  0d107d09f5bbe40cade3de5c71e9e9b7[1]

Query: (SELECT IFNULL(CAST(user_id AS NCHAR),0x20) FROM dvwa.users ORDER BY `user` LIMI...
Data:  4[1]

Query: (SELECT IFNULL(CAST(`user` AS NCHAR),0x20) FROM dvwa.users ORDER BY `user` LIMIT...
Data:  smithy[1]

Query: (SELECT IFNULL(CAST(avatar AS NCHAR),0x20) FROM dvwa.users ORDER BY `user` LIMIT...
Data:  /hackable/users/smithy.jpg[1]

Query: (SELECT IFNULL(CAST(failed_login AS NCHAR),0x20) FROM dvwa.users ORDER BY `user`...
Data:  0[1]

Query: (SELECT IFNULL(CAST(first_name AS NCHAR),0x20) FROM dvwa.users ORDER BY `user` L...
Data:  Bob[1]

Query: (SELECT IFNULL(CAST(last_login AS NCHAR),0x20) FROM dvwa.users ORDER BY `user` L...
Data:  2026-01-08 01:53:48[1]

Query: (SELECT IFNULL(CAST(last_name AS NCHAR),0x20) FROM dvwa.users ORDER BY `user` LI...
Data:  Smith[1]

Query: (SELECT IFNULL(CAST(password AS NCHAR),0x20) FROM dvwa.users ORDER BY `user` LIM...
Data:  5f4dcc3b5aa765d61d8327deb882cf99[1]

Query: (SELECT IFNULL(CAST(user_id AS NCHAR),0x20) FROM dvwa.users ORDER BY `user` LIMI...
Data:  5[1]

Query: (SELECT IFNULL(CAST(COUNT(column_name) AS NCHAR),0x20) FROM INFORMATION_SCHEMA.C...
Data:  3[9]

Query: (SELECT IFNULL(CAST(column_name AS NCHAR),0x20) FROM INFORMATION_SCHEMA.COLUMNS ...
Data:  id[1]

Query: (SELECT IFNULL(CAST(column_name AS NCHAR),0x20) FROM INFORMATION_SCHEMA.COLUMNS ...
Data:  hacker[1]

Query: (SELECT IFNULL(CAST(column_name AS NCHAR),0x20) FROM INFORMATION_SCHEMA.COLUMNS ...
Data:  secret[1]

Query: (SELECT IFNULL(CAST(COUNT(*) AS NCHAR),0x20) FROM dvwa.secrets)
Data:  5[9]

Query: (SELECT IFNULL(CAST(hacker AS NCHAR),0x20) FROM dvwa.secrets ORDER BY id LIMIT 0...
Data:  alice[1]

Query: (SELECT IFNULL(CAST(id AS NCHAR),0x20) FROM dvwa.secrets ORDER BY id LIMIT 0,1)
Data:  1[1]

Query: (SELECT IFNULL(CAST(secret AS NCHAR),0x20) FROM dvwa.secrets ORDER BY id LIMIT 0...
Data:  admin_password=Winter2024![1]

Query: (SELECT IFNULL(CAST(hacker AS NCHAR),0x20) FROM dvwa.secrets ORDER BY id LIMIT 1...
Data:  bob[1]

Query: (SELECT IFNULL(CAST(id AS NCHAR),0x20) FROM dvwa.secrets ORDER BY id LIMIT 1,1)
Data:  2[1]

Query: (SELECT IFNULL(CAST(secret AS NCHAR),0x20) FROM dvwa.secrets ORDER BY id LIMIT 1...
Data:  api_key=AKIA_TEST_123456[1]

Query: (SELECT IFNULL(CAST(hacker AS NCHAR),0x20) FROM dvwa.secrets ORDER BY id LIMIT 2...
Data:  charlie[1]

Query: (SELECT IFNULL(CAST(id AS NCHAR),0x20) FROM dvwa.secrets ORDER BY id LIMIT 2,1)
Data:  3[1]

Query: (SELECT IFNULL(CAST(secret AS NCHAR),0x20) FROM dvwa.secrets ORDER BY id LIMIT 2...
Data:  DGA{6l1nd_sql1_m45t3ry}[1]

Query: (SELECT IFNULL(CAST(hacker AS NCHAR),0x20) FROM dvwa.secrets ORDER BY id LIMIT 3...
Data:  eve[1]

Query: (SELECT IFNULL(CAST(id AS NCHAR),0x20) FROM dvwa.secrets ORDER BY id LIMIT 3,1)
Data:  4[1]

Query: (SELECT IFNULL(CAST(secret AS NCHAR),0x20) FROM dvwa.secrets ORDER BY id LIMIT 3...
Data:  ssh_private_key_leaked[1]

Query: (SELECT IFNULL(CAST(hacker AS NCHAR),0x20) FROM dvwa.secrets ORDER BY id LIMIT 4...
Data:  mallory[1]

Query: (SELECT IFNULL(CAST(id AS NCHAR),0x20) FROM dvwa.secrets ORDER BY id LIMIT 4,1)
Data:  5[1]

Query: (SELECT IFNULL(CAST(secret AS NCHAR),0x20) FROM dvwa.secrets ORDER BY id LIMIT 4...
Data:  db_backup_location=/var/backups/db.sql[1]

real	34.52s
user	32.82s
sys	1.15s
cpu	98%
```
:::

::: tip Flag
`DGA{6l1nd_sql1_m45t3ry}`
:::

