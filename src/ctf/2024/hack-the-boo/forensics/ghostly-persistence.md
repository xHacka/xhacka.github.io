# Ghostly Persistence

## Description

On a quiet Halloween night, when the world outside was wrapped in shadows, an intrusion alert pierced through the calm. The alert, triggered by an internal monitoring system, pinpointed unusual activity on a specific workstation. Can you illuminate the darkness and uncover what happened during this intrusion? 

> **Note**: flag is split into two parts

## Solution

We are given 429 `evtx` log files to analyze... 

![Ghostly Persistence.png](/assets/ctf/htb/ghostly-persistence.png)

Most of the files are same size so I decided to just parse all the events, using Windows Event Viewer will be too slow but [https://github.com/WithSecureLabs/chainsaw](https://github.com/WithSecureLabs/chainsaw) can help

Parse all the events:
```powershell
.\chainsaw\chainsaw.exe search '.*' .\forensics_ghostly_persistence\Logs\ --json -q -o events.json
```

After going through the json common pattern appeared and I automated the grabbing of interesting fields:
```python
import json
from pathlib import Path

shellcraft = Path('./shellcraft')
shellcraft.mkdir(exist_ok=True)

with open('./events.json') as f:
    events = json.load(f)

cache = set()
for event in events:
    event = event['Event']
    if 'EventData' in event:
        event = event['EventData']
        if not event:
            continue
        
        if 'ScriptBlockText' in event:
            command_id = event['ScriptBlockId']
            command = event['ScriptBlockText']
        elif 'Data' in event:
            data = event['Data']
            if not data or len(data) != 3:
                continue
        
            data = data[-1].split('\r\n\t')
            command_id = data[5].split('=')[1]
            command = data[6].split('=')[1]
        else:
            print(f'Unknown case: {event}')
            continue
    else:
        continue

    command = (
        command
        .replace('\r\n', '\n')
        .replace('; ', '; \n')
        .strip()
    )

    hash_ = hash(command)
    if hash_ in cache: # Avoid duplicate file contents
        continue
    else:
        cache.add(hash_)

    with open(shellcraft / f'{command_id}.ps1', 'w') as f:
        f.write(command)
```

`shellcraft/72187be7-469a-440d-ac5f-44d1f81d3de5.ps1`
```powershell
Get-PSDrive -Name C -Verbose
Get-ItemProperty -Path "HKCU:\Software\Microsoft\Windows\CurrentVersion" -Verbose

New-Item -Path "HKCU:\Software\cPdQnixceg" -Force
New-ItemProperty -Path "HKCU:\Software\cPdQnixceg" -Name "cPdQnixceg" -Value "X1c0c19SM3YzNGwzZH0=" -PropertyType String
Get-ScheduledTask -Verbose
```

`shellcraft/677529ad-da67-4f73-a7b3-b3385eaed86b.ps1`
```powershell
Get-ChildItem -Path "$env:TEMP" -Verbose
Get-Process -Verbose

$action = New-ScheduledTaskAction -Execute "powershell.exe" -Argument "-EncodedCommand JHRlbXBQYXRoID0gIiRlbnY6d2luZGlyXHRlbXBcR2gwc3QudHh0IgoiSFRCe0doMHN0X0wwYzR0MTBuIiB8IE91dC1GaWxlIC1GaWxlUGF0aCAkdGVtcFBhdGggLUVuY29kaW5nIHV0Zjg="
$trigger = New-ScheduledTaskTrigger -AtStartup
Register-ScheduledTask -Action $action -Trigger $trigger -TaskName "MaintenanceTask" -Description ""
```

```bash
└─$ base64 -d <<<'JHRlbXBQYXRoID0gIiRlbnY6d2luZGlyXHRlbXBcR2gwc3QudHh0IgoiSFRCe0doMHN0X0wwYzR0MTBuIiB8IE91dC1GaWxlIC1GaWxlUGF0aCAkdGVtcFBhdGggLUVuY29kaW5nIHV0Zjg='
$tempPath = "$env:windir\temp\Gh0st.txt"
"HTB{Gh0st_L0c4t10n" | Out-File -FilePath $tempPath -Encoding utf8                                                                                                                                                
└─$ base64 -d <<<'X1c0c19SM3YzNGwzZH0='
_W4s_R3v34l3d} 
```

::: tip Flag
`HTB{Gh0st_L0c4t10n_W4s_R3v34l3d}`
:::