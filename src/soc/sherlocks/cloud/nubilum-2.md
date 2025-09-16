# Nubilum-2

## Description

Leading telecoms provider Forela uses AWS S3 as an essential part of their infrastructure. They can deploy applications quickly and do effective analytics on their sizable dataset thanks to it acting as both an application storage and a data lake storage. Recently, a user reported an urgent issue to the helpdesk: an inability to access files within a designated S3 directory. This disruption has not only impeded critical operations but has also raised immediate security concerns. The urgency of this situation demands a security-focused approach. Reports of a misconfigured S3 Bucket policy for the forela-fileshare bucket, resulting in unintended public access, highlight a potential security vulnerability that calls for immediate corrective measures. Consequently, a thorough investigation is paramount.
## Files

```bash
└─$ 7z x nubilum_2.zip -p'hacktheblue'
└─$ find . -empty -delete
```

We are given CloudTrail json files. 
```bash
nubilum_2/949622803460/CloudTrail/us-west-2/XX/949622803460_CloudTrail_us-west-2_*.json
```

Bucket exists in following clouds:
```bash
└─$ grep 'forela-fileshare' -Raino | cut -d'/' -f1 | sort | uniq -c
      1 ap-southeast-1
   1663 us-east-1
```
## Tasks

### Task 1. What was the originating IP address the Threat Actor (TA) used to infiltrate the Forela’s AWS account?

There seems to be only 1 successful logon and where bucket is mentioned.
```bash
└─$ grep 'forela-fileshare.*AwsConsoleSignIn' . -Rain | cut -d ':' -f3- | jq
{
  "Records": [
    {
      "eventVersion": "1.08",
      "userIdentity": {
        "type": "IAMUser",
        "principalId": "AIDA52GPOBQCMZGBDCDL6",
        "arn": "arn:aws:iam::949622803460:user/forela-superuser",
        "accountId": "949622803460",
        "userName": "forela-superuser"
      },
      "eventTime": "2023-11-02T13:24:34Z",
      "eventSource": "signin.amazonaws.com",
      "eventName": "ConsoleLogin",
      "awsRegion": "ap-southeast-1",
      "sourceIPAddress": "52.77.60.127",
      "userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36",
      "requestParameters": null,
      "responseElements": {
        "ConsoleLogin": "Success"
      },
      "additionalEventData": {
        "LoginTo": "https://s3.console.aws.amazon.com/s3/buckets/forela-fileshare?region=us-east-1&state=hashArgs%23&tab=permissions&isauthcode=true",
        "MobileVersion": "No",
        "MFAUsed": "No"
      },
      "eventID": "878b9818-e73d-43b9-87b7-5d7e5b183eab",
      "readOnly": false,
      "eventType": "AwsConsoleSignIn",
      "managementEvent": true,
      "recipientAccountId": "949622803460",
      "eventCategory": "Management",
      "tlsDetails": {
        "tlsVersion": "TLSv1.3",
        "cipherSuite": "TLS_AES_128_GCM_SHA256",
        "clientProvidedHostHeader": "ap-southeast-1.signin.aws.amazon.com"
      }
    }
  ]
}
```

::: tip :bulb: Answer
`52.77.60.127`
:::

### Task 2. What was the time, filename, and Account ID of the first recorded s3 object accessed by the TA?


### Task 3. How many Access Keys were compromised, at a minimum?


### Task 4. The TA executed a command to filter EC2 instances. What were the name and value used for filtering?


### Task 5. Can you provide the count of unsuccessful discovery and privilege escalation attempts made by the TA before gaining elevated access with the compromised keys?


### Task 6. Which IAM user successfully gained elevated privileges in this incident?


### Task 7. Which event name permitted the threat actor to generate an admin-level policy?


### Task 8. What is the name and statement of the policy that was created that gave a standard user account elevated privileges?


### Task 9. What was the ARN (Amazon Resource Name) used to encrypt the files?


### Task 10. What was the name of the file that the TA uploaded to the S3 bucket?


### Task 11. Which IAM user account did the TA modify in order to gain additional persistent access?


### Task 12. What action was the user not authorized to perform to view or download the file in the S3 bucket?



