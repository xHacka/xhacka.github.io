# Heartbreaker-denouement

## Description

Your digital forensics expertise is critical to determine whether data exfiltration has occurred from the customer’s environment. Initial findings include a compromised AWS credential, indicating a potential unauthorized access. This investigation follows from a customer report of leaked data allegedly for sale on the darknet market. By examining the compromised server and analyzing the provided AWS logs, it will not only validate the customer's breach report but also provide valuable insights into the attacker's tactics, enabling a more comprehensive response.
## Files

```bash
└─$ 7z x HeartBreakerDenouement.zip -p'hacktheblue'
└─$ find . -maxdepth 2
.
./AWS
./AWS/ap-northeast-1
./AWS/ap-northeast-2
./AWS/ap-south-1
./AWS/ap-southeast-1
./AWS/ap-southeast-2
./AWS/ca-central-1
./AWS/eu-central-1
./AWS/eu-north-1
./AWS/eu-west-1
./AWS/eu-west-2
./AWS/eu-west-3
./AWS/me-south-1
./AWS/sa-east-1
./AWS/us-east-1
./AWS/us-east-2
./AWS/us-west-1
./AWS/us-west-2
./uac-uswebapp00-linux-20240313145552.tar.gz
└─$ find . -empty -delete
└─$ mkdir uac-uswebapp00 && tar -xvzf uac-uswebapp00-linux-20240313145552.tar.gz -C uac-uswebapp00
└─$ find ./uac-uswebapp00 -maxdepth 2
./uac-uswebapp00
./uac-uswebapp00/bodyfile
./uac-uswebapp00/bodyfile/bodyfile.txt
./uac-uswebapp00/bodyfile/bodyfile.txt.stderr
./uac-uswebapp00/chkrootkit
./uac-uswebapp00/chkrootkit/chkrootkit_-n_-r.txt.stderr
./uac-uswebapp00/chkrootkit/chkrootkit_-n_-r_-x.txt.stderr
./uac-uswebapp00/hash_executables
./uac-uswebapp00/hash_executables/hash_executables.md5
./uac-uswebapp00/hash_executables/hash_executables.sha1
./uac-uswebapp00/hash_executables/list_of_executable_files.txt
./uac-uswebapp00/live_response
./uac-uswebapp00/live_response/containers
./uac-uswebapp00/live_response/hardware
./uac-uswebapp00/live_response/network
./uac-uswebapp00/live_response/packages
./uac-uswebapp00/live_response/process
./uac-uswebapp00/live_response/storage
./uac-uswebapp00/live_response/system
./uac-uswebapp00/live_response/vms
./uac-uswebapp00/uac.log
./uac-uswebapp00/uac.log.stderr
./uac-uswebapp00/[root]
./uac-uswebapp00/[root]/etc
./uac-uswebapp00/[root]/home
./uac-uswebapp00/[root]/lib
./uac-uswebapp00/[root]/root
./uac-uswebapp00/[root]/run
./uac-uswebapp00/[root]/tmp
./uac-uswebapp00/[root]/var
```
## Tasks

### Task 1. What type of scanning technique was used to discover the web path of the victim's web server? Specify the name of the corresponding MITRE sub-technique.

Examining the access log of apache2, we can see same filenames with different extensions:
```log
35.169.66.138 - - [13/Mar/2024:13:58:29 +0000] "GET /php.7z HTTP/1.1" 404 396 "-" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36"
35.169.66.138 - - [13/Mar/2024:13:58:29 +0000] "GET /html.backup HTTP/1.1" 404 396 "-" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36"
35.169.66.138 - - [13/Mar/2024:13:58:29 +0000] "GET /php.backup HTTP/1.1" 404 396 "-" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36"
35.169.66.138 - - [13/Mar/2024:13:58:29 +0000] "GET /js.backup HTTP/1.1" 404 396 "-" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36"
35.169.66.138 - - [13/Mar/2024:13:58:29 +0000] "GET /php.bak HTTP/1.1" 404 396 "-" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36"
35.169.66.138 - - [13/Mar/2024:13:58:29 +0000] "GET /js.bak HTTP/1.1" 404 396 "-" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36"
35.169.66.138 - - [13/Mar/2024:13:58:29 +0000] "GET /html.bak HTTP/1.1" 404 396 "-" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36"
35.169.66.138 - - [13/Mar/2024:13:58:29 +0000] "GET /html.conf HTTP/1.1" 404 396 "-" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36"
35.169.66.138 - - [13/Mar/2024:13:58:29 +0000] "GET /php.conf HTTP/1.1" 404 396 "-" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36"
```

[https://attack.mitre.org/tactics/TA0043/](https://attack.mitre.org/tactics/TA0043/)

![Writeup.png](/assets/soc/sherlocks/heartbreaker-denouement/Writeup.png)

The attacker used Active Scanning method and was bruteforcing directory path, so [Active Scanning: Wordlist Scanning](https://attack.mitre.org/techniques/T1595/003/)

::: tip :bulb: Answer
`Wordlist Scanning`
:::

### Task 2. It seems a web request possibly could have been rerouted, potentially revealing the web server's web path to the Threat Actor. What specific HTML status code might have provided this information?

[301 Moved Permanently - HTTP - MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/301)
[Redirections in HTTP](https://developer.mozilla.org/en-US/docs/Web/HTTP/Redirections)

```log
35.169.66.138 - - [13/Mar/2024:13:59:27 +0000] "GET /index.php HTTP/1.1" 301 514 "-" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36"
```

::: tip :bulb: Answer
`301`
:::

### Task 3. What was the initial payload submitted by the threat actor to exploit weakness of the web server?

Filter out status code that start with `4`, server error indicates that attacker's action was unsuccessful. `wb-loanapp-tracker` get's lots of request after successful redirect request, but method is POST and we can't see what was sent.

![Writeup-1.png](/assets/soc/sherlocks/heartbreaker-denouement/Writeup-1.png)

::: info Note
Logs were parsed using [Apache-Access-Log-to-CSV-Converter](https://github.com/mboynes/Apache-Access-Log-to-CSV-Converter)
:::

Looking into the `error.log` we can identify what the attacker submitted. First malicious input is `file:///etc/passwd`
```log
[Wed Mar 13 14:02:38.936007 2024] [php7:notice] [pid 430] [client 35.169.66.138:57878] Request: GET /wb-loanapp-tracker.php Input: 
[Wed Mar 13 14:03:17.482267 2024] [php7:notice] [pid 399] [client 35.169.66.138:35892] Request: POST /wb-loanapp-tracker.php Input: , referer: http://3.144.237.152/wb-loanapp-tracker.php
[Wed Mar 13 14:03:21.501887 2024] [php7:notice] [pid 399] [client 35.169.66.138:35892] Request: POST /wb-loanapp-tracker.php Input: , referer: http://3.144.237.152/wb-loanapp-tracker.php
[Wed Mar 13 14:05:05.451538 2024] [php7:notice] [pid 408] [client 35.169.66.138:42982] Request: POST /wb-loanapp-tracker.php Input: askdjmzxcnqw3e, referer: http://3.144.237.152/wb-loanapp-tracker.php
[Wed Mar 13 14:05:17.635598 2024] [php7:notice] [pid 410] [client 35.169.66.138:48240] Request: POST /wb-loanapp-tracker.php Input: file:///etc/passwd, referer: http://3.144.237.152/wb-loanapp-tracker.php
[Wed Mar 13 14:05:48.612192 2024] [php7:notice] [pid 23239] [client 35.169.66.138:50362] Request: POST /wb-loanapp-tracker.php Input: file:///etc/nginx/nginx.conf, referer: http://3.144.237.152/wb-loanapp-tracker.php
```

::: tip :bulb: Answer
`file:///etc/passwd`
:::

### Task 4. What is the name of the vulnerability exploited by the Threat Actor?

```log
[Wed Mar 13 14:07:29.324690 2024] [php7:notice] [pid 399] [client 35.169.66.138:40632] Request: POST /wb-loanapp-tracker.php Input: http://169.254.169.254/latest/meta-data/identity-credentials/ec2/security-credentials/, referer: http://3.144.237.152/wb-loanapp-tracker.php
[Wed Mar 13 14:07:40.641033 2024] [php7:notice] [pid 408] [client 35.169.66.138:53194] Request: POST /wb-loanapp-tracker.php Input: http://169.254.169.254/latest/meta-data/identity-credentials/ec2/security-credentials/ec2-instance, referer: http://3.144.237.152/wb-loanapp-tracker.php
[Wed Mar 13 14:08:28.660610 2024] [php7:notice] [pid 410] [client 35.169.66.138:43118] Request: POST /wb-loanapp-tracker.php Input: http://169.254.169.254/latest/meta-data/identity-credentials/iam, referer: http://3.144.237.152/wb-loanapp-tracker.php
[Wed Mar 13 14:08:28.664143 2024] [php7:warn] [pid 410] [client 35.169.66.138:43118] PHP Warning:  file_get_contents(http://169.254.169.254/latest/meta-data/identity-credentials/iam): failed to open stream: HTTP request failed! HTTP/1.0 404 Not Found\r\n in /var/www/html/wb-loanapp-tracker.php on line 107, referer: http://3.144.237.152/wb-loanapp-tracker.php
[Wed Mar 13 14:08:36.079559 2024] [php7:notice] [pid 23239] [client 35.169.66.138:48376] Request: POST /wb-loanapp-tracker.php Input: http://169.254.169.254/latest/meta-data/, referer: http://3.144.237.152/wb-loanapp-tracker.php
[Wed Mar 13 14:08:49.553476 2024] [php7:notice] [pid 414] [client 35.169.66.138:53008] Request: POST /wb-loanapp-tracker.php Input: http://169.254.169.254/latest/meta-data/iam/, referer: http://3.144.237.152/wb-loanapp-tracker.php
[Wed Mar 13 14:08:58.343489 2024] [php7:notice] [pid 412] [client 35.169.66.138:51922] Request: POST /wb-loanapp-tracker.php Input: http://169.254.169.254/latest/meta-data/iam/info, referer: http://3.144.237.152/wb-loanapp-tracker.php
[Wed Mar 13 14:09:22.753326 2024] [php7:notice] [pid 415] [client 35.169.66.138:49666] Request: POST /wb-loanapp-tracker.php Input: http://169.254.169.254/latest/meta-data/identity-credentials/iam, referer: http://3.144.237.152/wb-loanapp-tracker.php
[Wed Mar 13 14:09:22.766748 2024] [php7:warn] [pid 415] [client 35.169.66.138:49666] PHP Warning:  file_get_contents(http://169.254.169.254/latest/meta-data/identity-credentials/iam): failed to open stream: HTTP request failed! HTTP/1.0 404 Not Found\r\n in /var/www/html/wb-loanapp-tracker.php on line 107, referer: http://3.144.237.152/wb-loanapp-tracker.php
[Wed Mar 13 14:09:42.923115 2024] [php7:notice] [pid 404] [client 35.169.66.138:43554] Request: POST /wb-loanapp-tracker.php Input: http://169.254.169.254/latest/meta-data/iam/security-credentials, referer: http://3.144.237.152/wb-loanapp-tracker.php
[Wed Mar 13 14:09:54.303441 2024] [php7:notice] [pid 401] [client 35.169.66.138:44866] Request: POST /wb-loanapp-tracker.php Input: http://169.254.169.254/latest/meta-data/iam/security-credentials/EC2DatabaseConnection, referer: http://3.144.237.152/wb-loanapp-tracker.php
```

In the at the end of `error.log` we see request input are different server and the attacker navigates up to `/latest/meta-data/iam/security-credentials/EC2DatabaseConnection`. What's odd is that path used doesn't belong to server (`3.144.237.152`) rather it's on different server (`169.254.169.254`). There are some 404 errors indicating incorrect movement of attacker, but at the end it's successful. Attacker was making request server (`3.144.237.152`) to a different server (`169.254.169.254`) most likely internally to leak the information.

::: tip :bulb: Answer
`Server Side Request Forgery`
:::

### Task 5. At what time (UTC) did the Threat Actor first realize they could access the cloud metadata of the web server instance?

Entries which access metadata:
```log
[Wed Mar 13 14:06:21.695943 2024] /wb-loanapp-tracker.php Input: http://169.254.169.254, 
[Wed Mar 13 14:06:30.584637 2024] /wb-loanapp-tracker.php Input: http://169.254.169.254/latest, 
[Wed Mar 13 14:06:40.887829 2024] /wb-loanapp-tracker.php Input: http://169.254.169.254/latest/meta-data, 
```

It seems like when SSRF was successful the attacker realized what could have been done, after that almost each path is successful request.

Check timezone of machine:
```bash
└─$ pwd && cat timezone
/media/sf_VBoxShare/uac-uswebapp00/[root]/etc
Etc/UTC
```

So no need to change timezone since it's already UTC.

```python
>>> from datetime import datetime
>>> ts = 'Wed Mar 13 14:06:40.887829 2024'
>>> dt = datetime.strptime(ts, '%a %b %d %H:%M:%S.%f %Y')
>>> print(dt)
2024-03-13 14:06:40.887829
```

Answer: `2024-03-13 14:06:21`
### Task 6. For a clearer insight into the Database content that could have been exposed, could you provide the name of at least one of its possible tables?

I was able to find `mysql_history` for the user on server
```bash
└─$ cat "[root]/home/ubuntu/.mysql_history" | sed 's/\\040/ /g'
_HiStOrY_V2_
SHOW DATABASES;
USE CUSTOMER_DATA;
SHOW TABLES;
SHOW INDEX FROM CustomerInfo;
CHECK TABLE CustomerInfo;
OPTIMIZE TABLE CustomerInfo;
REPAIR TABLE CustomerInfo;
ANALYZE TABLE CustomerInfo;
SHOW DATABASES;
exit
```

::: tip :bulb: Answer
`CustomerInfo`
:::

### Task 7. Which AWS API call functions similarly to the 'whoami' command in Windows or Linux?

[GetCallerIdentity](https://docs.aws.amazon.com/STS/latest/APIReference/API_GetCallerIdentity.html): _Returns details about the IAM user or role whose credentials are used to call the operation._

::: tip :bulb: Answer
`GetCallerIdentity`
:::

### Task 8. It seems that the reported compromised AWS IAM credential has been exploited by the Threat Actor. Can you identify the regions where these credentials were used successfully? Separate regions by comma and in ascending order.

First find the trace of attacker in AWS:
```bash
└─$ zgrep -no '35.169.66.138' $(find . -name '*.gz') | cut -d':' -f1 | sort | uniq -c | sort -nr | tee 35.169.66.138.trace
     24 ./us-east-1/2024/03/13/949622803460_CloudTrail_us-east-1_20240313T1350Z_7o2VpnkLIiANoJVw.json.gz
     20 ./us-west-1/2024/03/13/949622803460_CloudTrail_us-west-1_20240313T1350Z_zlXMQhq0f5i4yAXx.json.gz
     20 ./me-south-1/2024/03/13/949622803460_CloudTrail_me-south-1_20240313T1350Z_0mhJH1nDasLMnDKJ.json.gz
     20 ./eu-west-3/2024/03/13/949622803460_CloudTrail_eu-west-3_20240313T1350Z_9XYeWM0qC393GcP1.json.gz
     20 ./eu-west-2/2024/03/13/949622803460_CloudTrail_eu-west-2_20240313T1350Z_XdbAVZJLBl7qPhkC.json.gz
     20 ./eu-west-1/2024/03/13/949622803460_CloudTrail_eu-west-1_20240313T1350Z_yEGx1GCInwQfX0ur.json.gz
     20 ./ca-central-1/2024/03/13/949622803460_CloudTrail_ca-central-1_20240313T1350Z_GhjeWAgEzrzHxwt1.json.gz
     20 ./ap-southeast-2/2024/03/13/949622803460_CloudTrail_ap-southeast-2_20240313T1350Z_4bCzlZrP7G1825Rh.json.gz
     20 ./ap-south-1/2024/03/13/949622803460_CloudTrail_ap-south-1_20240313T1350Z_qxWdxWN8usdJZGFR.json.gz
     20 ./ap-northeast-2/2024/03/13/949622803460_CloudTrail_ap-northeast-2_20240313T1350Z_O49qPWfAY1uOdv8k.json.gz
     20 ./ap-northeast-1/2024/03/13/949622803460_CloudTrail_ap-northeast-1_20240313T1350Z_r8lDhFD1w8jJ2vmD.json.gz
     19 ./eu-north-1/2024/03/13/949622803460_CloudTrail_eu-north-1_20240313T1350Z_R0CeakNofHTSKI1R.json.gz
     17 ./us-west-2/2024/03/13/949622803460_CloudTrail_us-west-2_20240313T1350Z_A50rjM2n7shI8AZy.json.gz
     16 ./eu-central-1/2024/03/13/949622803460_CloudTrail_eu-central-1_20240313T1350Z_LbPUoFKssU0TB1ar.json.gz
     15 ./sa-east-1/2024/03/13/949622803460_CloudTrail_sa-east-1_20240313T1350Z_2R3LrYA96SoP1x0j.json.gz
     14 ./us-east-2/2024/03/13/949622803460_CloudTrail_us-east-2_20240313T1350Z_E3zctMkacs4Wewur.json.gz
     13 ./ap-southeast-1/2024/03/13/949622803460_CloudTrail_ap-southeast-1_20240313T1350Z_wGrRQPi1zCfLIOdG.json.gz
      7 ./ap-southeast-1/2024/03/13/949622803460_CloudTrail_ap-southeast-1_20240313T1350Z_5ybR5c1VzJ5UVnsp.json.gz
      6 ./us-east-2/2024/03/13/949622803460_CloudTrail_us-east-2_20240313T1400Z_fdBEfDu1vCjUWbWK.json.gz
      6 ./us-east-2/2024/03/13/949622803460_CloudTrail_us-east-2_20240313T1345Z_l9uzQOYmv63RqAog.json.gz
      6 ./eu-central-1/2024/03/13/949622803460_CloudTrail_eu-central-1_20240313T1345Z_JbwB6hVh2off9SZL.json.gz
      5 ./us-east-1/2024/03/13/949622803460_CloudTrail_us-east-1_20240313T1400Z_cGFp8xKJ3TT5CgY4.json.gz
      3 ./us-west-2/2024/03/13/949622803460_CloudTrail_us-west-2_20240313T1355Z_ZVobEP2urdCfm3jH.json.gz
      3 ./us-west-1/2024/03/13/949622803460_CloudTrail_us-west-1_20240313T1355Z_DBGb1Cglc7JgNJoR.json.gz
      3 ./us-east-1/2024/03/13/949622803460_CloudTrail_us-east-1_20240313T1355Z_P9vNXa5Do7RYJAau.json.gz
      3 ./sa-east-1/2024/03/13/949622803460_CloudTrail_sa-east-1_20240313T1355Z_nyTACtaHVHOUDrd2.json.gz
      3 ./sa-east-1/2024/03/13/949622803460_CloudTrail_sa-east-1_20240313T1345Z_qkQBPnyUtka9ag2H.json.gz
      3 ./me-south-1/2024/03/13/949622803460_CloudTrail_me-south-1_20240313T1355Z_oBhNXjpSmkmpXz8E.json.gz
      3 ./eu-west-3/2024/03/13/949622803460_CloudTrail_eu-west-3_20240313T1355Z_yVoxmrtMLUEqodj7.json.gz
      3 ./eu-west-2/2024/03/13/949622803460_CloudTrail_eu-west-2_20240313T1355Z_J0hwUSKX0G2rcxNh.json.gz
      3 ./eu-west-1/2024/03/13/949622803460_CloudTrail_eu-west-1_20240313T1355Z_8stUEVSMvVIhn0UD.json.gz
      3 ./eu-north-1/2024/03/13/949622803460_CloudTrail_eu-north-1_20240313T1350Z_nWriqa1ZjMYV3v2E.json.gz
      3 ./ca-central-1/2024/03/13/949622803460_CloudTrail_ca-central-1_20240313T1355Z_2W5ECZ7ktWG2euvg.json.gz
      3 ./ap-southeast-2/2024/03/13/949622803460_CloudTrail_ap-southeast-2_20240313T1355Z_BNpsbzdhqtqwxUKP.json.gz
      3 ./ap-south-1/2024/03/13/949622803460_CloudTrail_ap-south-1_20240313T1355Z_YFnc2cT5yafC1rgF.json.gz
      3 ./ap-northeast-2/2024/03/13/949622803460_CloudTrail_ap-northeast-2_20240313T1355Z_ffeHyiCcYiz7pWox.json.gz
      3 ./ap-northeast-1/2024/03/13/949622803460_CloudTrail_ap-northeast-1_20240313T1355Z_7al7fHyrjsLxz7iz.json.gz
      2 ./us-west-2/2024/03/13/949622803460_CloudTrail_us-west-2_20240313T1400Z_Fr4Z2B6oyRNl0cgn.json.gz
      2 ./us-west-2/2024/03/13/949622803460_CloudTrail_us-west-2_20240313T1345Z_pDL4MlzSEyvZuyay.json.gz
      2 ./us-west-1/2024/03/13/949622803460_CloudTrail_us-west-1_20240313T1400Z_WMI5BYf5PawP0hHK.json.gz
      2 ./us-east-2/2024/03/13/949622803460_CloudTrail_us-east-2_20240313T1355Z_DjxYSNmTPSWY2kEX.json.gz
      2 ./us-east-2/2024/03/12/949622803460_CloudTrail_us-east-2_20240312T0745Z_p4bNyeDDvjjsjTEQ.json.gz
      2 ./us-east-1/2024/03/13/949622803460_CloudTrail_us-east-1_20240313T1415Z_qSYWM4sB77zBSZJU.json.gz
      2 ./sa-east-1/2024/03/13/949622803460_CloudTrail_sa-east-1_20240313T1400Z_CBeZ7oO2WTRHTBLK.json.gz
      2 ./sa-east-1/2024/03/13/949622803460_CloudTrail_sa-east-1_20240313T1345Z_2qAYchCaIhRnJeIC.json.gz
      2 ./me-south-1/2024/03/13/949622803460_CloudTrail_me-south-1_20240313T1400Z_O6cbTw1Fl9SYTbi3.json.gz
      2 ./eu-west-3/2024/03/13/949622803460_CloudTrail_eu-west-3_20240313T1400Z_qnu23iA0SQISFLaO.json.gz
      2 ./eu-west-2/2024/03/13/949622803460_CloudTrail_eu-west-2_20240313T1400Z_rHCIZQWXEpxasCEZ.json.gz
      2 ./eu-west-1/2024/03/13/949622803460_CloudTrail_eu-west-1_20240313T1400Z_iXSSQDFSVCxnpH30.json.gz
      2 ./eu-north-1/2024/03/13/949622803460_CloudTrail_eu-north-1_20240313T1400Z_QI9jKuyWJ6tITVxz.json.gz
      2 ./eu-central-1/2024/03/13/949622803460_CloudTrail_eu-central-1_20240313T1400Z_qSfW15SOhrN6fosX.json.gz
      2 ./ca-central-1/2024/03/13/949622803460_CloudTrail_ca-central-1_20240313T1400Z_cD7fD96oiHxTJbzz.json.gz
      2 ./ap-southeast-2/2024/03/13/949622803460_CloudTrail_ap-southeast-2_20240313T1400Z_bYfE0ty5UVl0UY3s.json.gz
      2 ./ap-southeast-1/2024/03/13/949622803460_CloudTrail_ap-southeast-1_20240313T1400Z_Srd1obdEqJB4sFPT.json.gz
      2 ./ap-southeast-1/2024/03/13/949622803460_CloudTrail_ap-southeast-1_20240313T1350Z_dw5XHmuJhsW0aBfX.json.gz
      2 ./ap-south-1/2024/03/13/949622803460_CloudTrail_ap-south-1_20240313T1400Z_fdU2hg4zZzJTe4Jg.json.gz
      2 ./ap-northeast-2/2024/03/13/949622803460_CloudTrail_ap-northeast-2_20240313T1400Z_hI20DWmupyFA0LG9.json.gz
      2 ./ap-northeast-1/2024/03/13/949622803460_CloudTrail_ap-northeast-1_20240313T1400Z_Z9DVqdfnKx3wdfKg.json.gz
      1 ./us-west-2/2024/03/13/949622803460_CloudTrail_us-west-2_20240313T1355Z_9zJT7jogX9Qk2ml6.json.gz
      1 ./us-west-2/2024/03/13/949622803460_CloudTrail_us-west-2_20240313T1345Z_Q3eGegkScRVyNh9G.json.gz
      1 ./us-west-1/2024/03/13/949622803460_CloudTrail_us-west-1_20240313T1355Z_uSFmJTZouM32cf79.json.gz
      1 ./us-east-2/2024/03/13/949622803460_CloudTrail_us-east-2_20240313T1405Z_Cp5JalSm17eu2kdg.json.gz
      1 ./us-east-2/2024/03/13/949622803460_CloudTrail_us-east-2_20240313T1355Z_IRDQCb3Vi2goGw6s.json.gz
      1 ./us-east-1/2024/03/13/949622803460_CloudTrail_us-east-1_20240313T1355Z_4U3v4wYgz06yTlir.json.gz
      1 ./sa-east-1/2024/03/13/949622803460_CloudTrail_sa-east-1_20240313T1355Z_ezqcFiHFDhtEgSFB.json.gz
      1 ./me-south-1/2024/03/13/949622803460_CloudTrail_me-south-1_20240313T1355Z_gK7XXTE1YGLBq2rJ.json.gz
      1 ./eu-west-3/2024/03/13/949622803460_CloudTrail_eu-west-3_20240313T1355Z_Ps1R8bsguAxSqXwR.json.gz
      1 ./eu-west-2/2024/03/13/949622803460_CloudTrail_eu-west-2_20240313T1355Z_qr80jPJB6Hh7hm5P.json.gz
      1 ./eu-west-1/2024/03/13/949622803460_CloudTrail_eu-west-1_20240313T1355Z_tFpze9WG8rTZDRkd.json.gz
      1 ./eu-north-1/2024/03/13/949622803460_CloudTrail_eu-north-1_20240313T1355Z_rf2f7N8lLwrkqsoQ.json.gz
      1 ./eu-north-1/2024/03/13/949622803460_CloudTrail_eu-north-1_20240313T1355Z_HCPAjP6MNwSqH28Y.json.gz
      1 ./eu-central-1/2024/03/13/949622803460_CloudTrail_eu-central-1_20240313T1400Z_FTcUMv024l1doQhW.json.gz
      1 ./eu-central-1/2024/03/13/949622803460_CloudTrail_eu-central-1_20240313T1355Z_KCv2IIGfBpJIAjpC.json.gz
      1 ./ca-central-1/2024/03/13/949622803460_CloudTrail_ca-central-1_20240313T1355Z_JpEGWE4vn0YpMNqs.json.gz
      1 ./ap-southeast-2/2024/03/13/949622803460_CloudTrail_ap-southeast-2_20240313T1355Z_vZslOpNC5urBSvQi.json.gz
      1 ./ap-southeast-1/2024/03/13/949622803460_CloudTrail_ap-southeast-1_20240313T1355Z_yxHcW6dMFDmrftXd.json.gz
      1 ./ap-southeast-1/2024/03/13/949622803460_CloudTrail_ap-southeast-1_20240313T1355Z_8q88ChL7Jjjw91n9.json.gz
      1 ./ap-south-1/2024/03/13/949622803460_CloudTrail_ap-south-1_20240313T1355Z_bkIETcb6h6XOi7KP.json.gz
      1 ./ap-northeast-2/2024/03/13/949622803460_CloudTrail_ap-northeast-2_20240313T1355Z_PCiQbpIaOCEhsF5f.json.gz
      1 ./ap-northeast-1/2024/03/13/949622803460_CloudTrail_ap-northeast-1_20240313T1355Z_hrlyLCG7Fp5CqYm7.json.gz
```

Get files that made `GetCallerIdentity` call
```bash
└─$ cut 35.169.66.138.trace -d' ' -f8 > 35.169.66.138.trace.files
└─$ for file in $(cat 35.169.66.138.trace.files); do if zgrep -q "GetCallerIdentity" $file; then echo $file; fi; done;
./us-east-1/2024/03/13/949622803460_CloudTrail_us-east-1_20240313T1415Z_qSYWM4sB77zBSZJU.json.gz
```

Inspect the file:
```json
{
  "Records": [
    {
      "eventVersion": "1.08",
      "userIdentity": {
        "type": "AssumedRole",
        "principalId": "949622803460:aws:ec2-instance:i-0bdf91168b50e943e",
        "arn": "arn:aws:sts::949622803460:assumed-role/aws:ec2-instance/i-0bdf91168b50e943e",
        "accountId": "949622803460",
        "accessKeyId": "ASIA52GPOBQCD6DF76FQ",
        "sessionContext": {
          "sessionIssuer": {
            "type": "Role",
            "principalId": "949622803460:aws:ec2-instance",
            "arn": "arn:aws:iam::949622803460:role/aws:ec2-instance",
            "accountId": "949622803460",
            "userName": "aws:ec2-instance"
          },
          "webIdFederationData": {},
          "attributes": {
            "creationDate": "2024-03-13T13:08:12Z",
            "mfaAuthenticated": "false"
          },
          "ec2RoleDelivery": "1.0"
        }
      },
      "eventTime": "2024-03-13T14:12:16Z",
      "eventSource": "sts.amazonaws.com",
      "eventName": "GetCallerIdentity",
      "awsRegion": "us-east-1",
      "sourceIPAddress": "35.169.66.138",
      "userAgent": "aws-cli/1.29.54 md/Botocore#1.31.54 md/awscrt#1.0.0.dev0 ua/2.0 os/linux#6.3.0-kali1-cloud-amd64 md/arch#x86_64 lang/python#3.11.8 md/pyimpl#CPython cfg/retry-mode#legacy botocore/1.31.54",
      "requestParameters": null,
      "responseElements": null,
      "requestID": "d4b8759c-1d59-4136-a7eb-ac0e225b6d3e",
      "eventID": "c6aabfd0-4b68-47b9-be0b-9c08e2dd2eb6",
      "readOnly": true,
      "eventType": "AwsApiCall",
      "managementEvent": true,
      "recipientAccountId": "949622803460",
      "eventCategory": "Management",
      "tlsDetails": {
        "tlsVersion": "TLSv1.3",
        "cipherSuite": "TLS_AES_128_GCM_SHA256",
        "clientProvidedHostHeader": "sts.amazonaws.com"
      }
    },
    {
      "eventVersion": "1.08",
      "userIdentity": {
        "type": "AssumedRole",
        "principalId": "949622803460:aws:ec2-instance:i-0bdf91168b50e943e",
        "arn": "arn:aws:sts::949622803460:assumed-role/aws:ec2-instance/i-0bdf91168b50e943e",
        "accountId": "949622803460",
        "accessKeyId": "ASIA52GPOBQCD6DF76FQ",
        "sessionContext": {
          "sessionIssuer": {
            "type": "Role",
            "principalId": "949622803460:aws:ec2-instance",
            "arn": "arn:aws:iam::949622803460:role/aws:ec2-instance",
            "accountId": "949622803460",
            "userName": "aws:ec2-instance"
          },
          "webIdFederationData": {},
          "attributes": {
            "creationDate": "2024-03-13T13:08:12Z",
            "mfaAuthenticated": "false"
          },
          "ec2RoleDelivery": "1.0"
        }
      },
      "eventTime": "2024-03-13T14:12:34Z",
      "eventSource": "sts.amazonaws.com",
      "eventName": "GetCallerIdentity",
      "awsRegion": "us-east-1",
      "sourceIPAddress": "35.169.66.138",
      "userAgent": "aws-cli/1.16.219 Python/3.7.0 Windows/10 botocore/1.12.209 Botocore/1.31.54",
      "requestParameters": null,
      "responseElements": null,
      "requestID": "6206490d-ea94-48e8-b8e5-db95a6287153",
      "eventID": "471af4ca-4f9b-49c2-9004-c94240d0ab90",
      "readOnly": true,
      "eventType": "AwsApiCall",
      "managementEvent": true,
      "recipientAccountId": "949622803460",
      "eventCategory": "Management",
      "tlsDetails": {
        "tlsVersion": "TLSv1.3",
        "cipherSuite": "TLS_AES_128_GCM_SHA256",
        "clientProvidedHostHeader": "sts.amazonaws.com"
      }
    }
  ]
}
```

From HTB it was suggested to use this script for parsing AWS files: [philhagen/sof-elk/supporting-scripts/aws-cloudtrail2sof-elk.py](https://raw.githubusercontent.com/philhagen/sof-elk/main/supporting-scripts/aws-cloudtrail2sof-elk.py)

```bash
└─$ py ./aws-cloudtrail2sof-elk.py -r ./AWS -w output.json -f
└─$ ls -lh output.json
Permissions Size User Date Modified Name
.rwxrwx---   86M root 26 Aug 13:51  output.json
```

Let's focus on IP and filter out any error codes that indicate unsuccessful commands:
```bash
└─$ grep '35.169.66.138' ./output.json | grep -v 'errorCode' | jq '.awsRegion' | sort -u | tr -d '"' | tr '\n' ','
us-east-1,us-east-2,
```

::: tip :bulb: Answer
`us-east-1,us-east-2`
:::

### Task 9. Discovering that the compromised IAM account was used prior to the web server attack, this suggests the threat actor might have obtained the public IP  addresses of running instances. Could you specify the API call the could have exposed this information?

Get command names that were ran:
```bash
└─$ grep '35.169.66.138' ./output.json | grep -v 'errorCode' | jq '.eventName' | sort | uniq -c | sort -nr
      7 "DescribeInstanceAttribute"
      4 "GetCallerIdentity"
      4 "DescribeInstances"
      2 "DescribeVpcs"
      2 "DescribeVpcEndpoints"
      2 "DescribeSubnets"
      2 "DescribeSecurityGroups"
      2 "DescribeRouteTables"
      2 "DescribeNetworkInterfaces"
      2 "DescribeNetworkAcls"
      2 "DescribeNatGateways"
      2 "DescribeLaunchTemplates"
      2 "DescribeHosts"
      2 "DescribeCustomerGateways"
      2 "DescribeAddresses"
      1 "AuthorizeSecurityGroupIngress"
```

The compromised account is most probably the `user/devops-ash`:
```bash
└─$ grep '35.169.66.138' ./output.json | grep -v 'errorCode' | jq '.userIdentity.arn' | sort | uniq -c | sort -nr
     37 "arn:aws:iam::949622803460:user/devops-ash"
      2 "arn:aws:sts::949622803460:assumed-role/aws:ec2-instance/i-0bdf91168b50e943e"
      1 "arn:aws:iam::949622803460:user/devops-alex"
```

[describe-instances](https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-instances.html) - _Describes the specified instances or all instances._

::: tip :bulb: Answer
`DescribeInstances`
:::

### Task 10. Looks like the Threat Actor didn’t only use a single IP address. What is the total number of  unsuccessful requests made by the Threat Actor?

To find the malicious IP knowing the previous IP characteristics wasn't enough. Let's do some statistics and find source IPs with errors:
```bash
└─$ jq -c '[.sourceIPAddress,.errorCode]' ./output.json | grep -vE 'amazon|null' | sort | uniq -c | sort -nr
    210 ["35.169.66.138","Client.UnauthorizedOperation"]
    206 ["35.169.66.138","AccessDenied"]
    187 ["34.202.84.37","Client.UnauthorizedOperation"]
    139 ["34.202.84.37","AccessDenied"]
      7 ["213.244.223.123","AccessDenied"]
      2 ["52.74.8.80","AccessDenied"]
      2 ["209.9.166.237","AccessDenied"]
      1 ["52.74.8.80","OptInRequiredException"]
      1 ["52.74.8.80","InvalidAccessException"]
      1 ["46.232.81.55","AccessDenied"]
      1 ["211.5.104.80","AccessDenied"]
      1 ["196.89.51.2","NoSuchKey"]
      1 ["116.215.103.18","NoSuchKey"]
```

The first IP (`35.169.66.138`) is already known, but `34.202.84.37` IP is new. Because it's known that malicious user used different IP it's safe to say in this case that second IP is them too.

The total unsuccessful request count:
```bash
└─$ jq -c '[.sourceIPAddress,.errorCode]' ./output.json | grep -vE 'amazon|null' | sort | uniq -c | sort -nr | head -4 | awk '{print $1}' | paste -sd+ | bc
742
```

::: tip :bulb: Answer
`742`
:::

### Task 11. Can you identify the Amazon Resource Names (ARNs) associated with successful API calls that might have revealed details about the victim's cloud infrastructure? Separate ARNs by comma and in ascending order.

So filter logs based on malicious actors IPs, then filter out any unsuccessful actions, then filter for any verb that gets you information and finally get unique arn names.
```bash
└─$ grep -E '"(34.202.84.37|35.169.66.138)"' ./output.json | grep -v errorCode | jq 'select(.eventName | test("Describe|List|Get|View")) | .userIdentity.arn' | sort -u
"arn:aws:iam::949622803460:user/devops-ash"
"arn:aws:sts::949622803460:assumed-role/aws:ec2-instance/i-0bdf91168b50e943e"
"arn:aws:sts::949622803460:assumed-role/EC2DatabaseConnection/i-0bdf91168b50e943e"
└─$ grep -E '"(34.202.84.37|35.169.66.138)"' ./output.json | grep -v errorCode | jq 'select(.eventName | test("Describe|List|Get|View")) | .userIdentity.arn' | sort -u | grep -v 'ec2' | tr -d '"' | paste -sd,
arn:aws:iam::949622803460:user/devops-ash,arn:aws:sts::949622803460:assumed-role/EC2DatabaseConnection/i-0bdf91168b50e943e
```

The prefix `aws:ec2-instance` in an Amazon Resource Name (ARN) typically refers to an IAM role that is automatically assigned to an EC2 instance, often when that instance needs to access AWS services or resources (e.g., to upload logs to S3, read from DynamoDB, etc.). These ARNs are not associated with individual users but rather with the specific EC2 instances themselves hence they are filtered out.

::: tip :bulb: Answer
`arn:aws:iam::949622803460:user/devops-ash,arn:aws:sts::949622803460:assumed-role/EC2DatabaseConnection/i-0bdf91168b50e943e`
:::

### Task 12. Evidence suggests another database was targeted. Identify all snapshot names created. Separate names by comma and in ascending order.

```bash
└─$ grep -E '"(34.202.84.37|35.169.66.138)"' ./output.json | grep -v errorCode | jq 'select(.eventName | test("Describe|List|Get|View") | not) | .eventName' | sort -u
"CreateDBSnapshot"
"ModifyDBSnapshotAttribute"
└─$ grep -E '"(34.202.84.37|35.169.66.138)"' ./output.json | grep -v errorCode | jq -c 'select(.eventName | test("Describe|List|Get|View") | not) | .requestParameters'
{"dBSnapshotIdentifier":"wb-customerdb-prod-2024-03-13-07-59","attributeName":"restore","valuesToAdd":["143637014344"]}
{"dBSnapshotIdentifier":"transactiondb-prod-2024-03-13-06-53","dBInstanceIdentifier":"transactiondb-prod"}
{"dBSnapshotIdentifier":"transactiondb-prod-2024-03-13-06-53","attributeName":"restore","valuesToAdd":["143637014344"]}
{"dBSnapshotIdentifier":"wb-customerdb-prod-2024-03-13-07-59","dBInstanceIdentifier":"wb-customerdb-prod"}
└─$ grep -E '"(34.202.84.37|35.169.66.138)"' ./output.json | grep -v errorCode | jq -c 'select(.eventName | test("Describe|List|Get|View") | not) | .requestParameters.dBSnapshotIdentifier' | sort -u | tr -d '"'
 | paste -sd,
transactiondb-prod-2024-03-13-06-53,wb-customerdb-prod-2024-03-13-07-59
```

::: tip :bulb: Answer
`transactiondb-prod-2024-03-13-06-53,wb-customerdb-prod-2024-03-13-07-59`
:::

### Task 13. The Threat Actor successfully exfiltrated the data to their account. Could you specify the account ID that was used?

If we filter for attacker IP and then get all events that are not descriptive we are left with 3 events.
```bash
└─$ grep -E '"(34.202.84.37|35.169.66.138)"' ./output.json | grep -vE 'errorCode|Describe' | jq '.eventName' | sort -u
"CreateDBSnapshot"
"GetCallerIdentity"
"ModifyDBSnapshotAttribute"
```

We also know that the attackers created database snapshots, but no `GetObject` event indicates they didn't directly download it. The `ModifyDBSnapshotAttribute` suggests that they changed something and then created snapshots.

[modify-db-snapshot-attribute](https://docs.aws.amazon.com/cli/latest/reference/rds/modify-db-snapshot-attribute.html) - _Adds an attribute and values to, or removes an attribute and values from, a manual DB snapshot._

**To share a manual DB snapshot with other Amazon Web Services accounts**, specify `restore` as the `AttributeName` and use the `ValuesToAdd` parameter to add a list of IDs of the Amazon Web Services accounts that are authorized to restore the manual DB snapshot. Uses the value `all` to make the manual DB snapshot public, which means it can be copied or restored by all Amazon Web Services accounts.

```bash
└─$ grep -E '"(34.202.84.37|35.169.66.138)"' ./output.json | grep -vE 'errorCode|Describe' | jq 'select(.eventName == "ModifyDBSnapshotAttribute") | {"AccountID": .userIdentity.accountId, "RequestParams": .requestParameters}'
{
  "AccountID": "949622803460",
  "RequestParams": {
    "dBSnapshotIdentifier": "wb-customerdb-prod-2024-03-13-07-59",
    "attributeName": "restore",
    "valuesToAdd": [
      "143637014344"
    ]
  }
}
{
  "AccountID": "949622803460",
  "RequestParams": {
    "dBSnapshotIdentifier": "transactiondb-prod-2024-03-13-06-53",
    "attributeName": "restore",
    "valuesToAdd": [
      "143637014344"
    ]
  }
}
```

The attackers added themselves to shared AWS accounts who can access the taken snapshot.

::: tip :bulb: Answer
`143637014344`
:::

### Task 14. Which MITRE Technique ID corresponds to the activity described in Question 13?

[T1537](https://attack.mitre.org/techniques/T1537)
[Transfer Data to Cloud Account](https://attack.mitre.org/techniques/T1537)
_Adversaries may exfiltrate data by transferring the data, including through sharing/syncing and creating backups of cloud environments, to another cloud account they control on the same service._

::: tip :bulb: Answer
`T1537`
:::
