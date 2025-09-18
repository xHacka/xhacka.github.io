# Timing is Everything

# Timing is Everything

### Description

Timing is Everything

Timing is everything....

Author: r0m

&#x20;[timingiseverything.pcap](https://ctfd.uscybergames.com/files/ebbe8c4961c5e168fb40c2719390cc71/timingiseverything.pcap?token=eyJ1c2VyX2lkIjozMDg2LCJ0ZWFtX2lkIjpudWxsLCJmaWxlX2lkIjozMTZ9.ZmKfCg.Ba0zsPkWD8FNjwgedbQJ5FTLefM)

### Solution

The given PCAP only has ping requests

![Timing is Everything](/assets/ctf/uscybergames/timing_is_everything.png)

I used `tshark` to extract data about PCAP. JSON format shows more data so it's good to take a look

```bash
└─$ tshark -r timingiseverything.pcap -T json > timingiseverything.json
```

Because of description I focused on time that frames were sent

```bash
└─$ cat timingiseverything.json | jq '.[]._source.layers.frame."frame.time"'|clip
```

During my test stage I was trying to see if time difference had to do anything with chars

```python
>>> chr(82) # "Jan  1, 2000 05:56:55.203186000 EST" -> 0.08299994468688965
'R'
>>> chr(73) # "Jan  1, 2000 05:56:55.286186000 EST" -> 0.07300007343292236
'I'
>>> chr(85) # "Jan  1, 2000 05:56:55.359186000 EST" -> 0.08599996566772461
'U'
>>> ord('S')
83
>>> ord('I')
73
>>> ord('V')
86
```

On first try I converted rounded numbers (to lowest) to respective characters. Then I checked order of flag characters and if you notice the numbers are rounded to the closest numbers.

Solve script:

```python
import pytz
from datetime import datetime

def todatetime(timestamp):
    dt_naive = datetime.strptime(timestamp[:-7], '%b %d, %Y %H:%M:%S.%f')
    est = pytz.timezone('US/Eastern')
    return est.localize(dt_naive)

timestamps = '''
"Jan  1, 2000 05:56:55.203186000 EST"
"Jan  1, 2000 05:56:55.286186000 EST"
"Jan  1, 2000 05:56:55.359186000 EST"
"Jan  1, 2000 05:56:55.445186000 EST"
"Jan  1, 2000 05:56:55.530186000 EST"
"Jan  1, 2000 05:56:55.613186000 EST"
"Jan  1, 2000 05:56:55.680186000 EST"
"Jan  1, 2000 05:56:55.751186000 EST"
"Jan  1, 2000 05:56:55.874186000 EST"
"Jan  1, 2000 05:56:55.958186000 EST"
"Jan  1, 2000 05:56:56.007186000 EST"
"Jan  1, 2000 05:56:56.116186000 EST"
"Jan  1, 2000 05:56:56.165186000 EST"
"Jan  1, 2000 05:56:56.275186000 EST"
"Jan  1, 2000 05:56:56.332186000 EST"
"Jan  1, 2000 05:56:56.427186000 EST"
"Jan  1, 2000 05:56:56.476186000 EST"
"Jan  1, 2000 05:56:56.529186000 EST"
"Jan  1, 2000 05:56:56.624186000 EST"
"Jan  1, 2000 05:56:56.675186000 EST"
"Jan  1, 2000 05:56:56.793186000 EST"
"Jan  1, 2000 05:56:56.844186000 EST"
"Jan  1, 2000 05:56:56.958186000 EST"
"Jan  1, 2000 05:56:57.079186000 EST"
"Jan  1, 2000 05:56:57.195186000 EST"
"Jan  1, 2000 05:56:57.299186000 EST"
"Jan  1, 2000 05:56:57.348186000 EST"
"Jan  1, 2000 05:56:57.458186000 EST"
"Jan  1, 2000 05:56:57.515186000 EST"
"Jan  1, 2000 05:56:57.640186000 EST"
'''.strip().replace('"', '').split('\n')

dttimestamps = [todatetime(timestamp) for timestamp in timestamps]

for i in range(1, len(dttimestamps)):
    a, b = dttimestamps[i-1].timestamp(), dttimestamps[i].timestamp()
    delta = b - a
    char = round(delta * 1000)
    print(chr(char), end='')
```

::: tip Flag
`**SIVUSCG{T1m1n9\_15\_3v3ryth1n9}**`
:::
