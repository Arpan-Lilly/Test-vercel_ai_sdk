# **Restful SDK**: 

## Python:

Light client handles Oauth Azure AD authentication using the Azure AD Device Flow authentication pattern.

It caches refresh tokens locally so re-authentication is only required after ~30 days of inactivity.

Refreshing access tokens is handled transparently to users of this library.

### Getting Started

#### Install

#### Install From Github

```bash
pip install git+https://github.com/EliLillyCo/LRL_light_k8s_infra_app_client_python.git
```

#### Install From HPC Artifactory

```bash
pip install light-client -i https://artifactory.am.lilly.com/artifactory/api/pypi/lrl-pypi/simple
```


### Example Usage

```python
from light_client import LIGHTClient
client = LIGHTClient()
# client matches standard HTTP methods from requests library (e.g. get, post, put, etc.).
# It also accepts the corresponding requests method parameters (e.g. client.get == requests.get)
re = client.get("https://test.apps.lrl.lilly.com/")
# Follow prompt to authenticate (after first authentication, refresh tokens are cached locally so reauthentication is infrequent)
# re is a requests Response object
# NOTE: The above URL is not a "real" app, so expect a 404 response from the server.
```

## Command Line Token Access

```sh
>  light_auth --help
usage: light_auth [-h] [-e {DEV,QA,PRD}] [-H] [option]

Prints authentication token for light hosted applications

positional arguments:
  option                
                        refresh-login   wipe existing tokens & re-fetch tokens to ensure interactive authentication prompt will not be displayed in subsequent commands
                        token           get token (default)
                        namespaces      returns list of namespaces allowed based on scoped s3-credentials
                        buckets         returns list of buckets allowed based on scoped s3-credentials
                        prefixes        returns list of prefixes allowed based on scoped s3-credentials
                        creds           return access tokens that allow scoped access to s3. Can also pass {bucket, namespace in that order} get more specificly scoped credentials. This can be used in an AWS profile as a credential provider
                        setup           setup AWS profile in ~/.aws/config to use light_auth as a credential provider

options:
  -h, --help            show this help message and exit
  -e {DEV,QA,PRD}, --env {DEV,QA,PRD}
                        authentication environment (default=PRD)
  -H, --header          return the full header
  -p [PROFILE], --profile [PROFILE], --profile_name [PROFILE]
                        supply a profile name to create a named profile
  -b [BUCKET], --bucket [BUCKET]
                        supply an s3 bucket name
  -n [NAMESPACE], --namespace [NAMESPACE]
                        supply a kubernetes namespace name
  -P [PREFIX], --prefix [PREFIX]
                        supply an s3 key prefix
  -s [SERVICE], --service [SERVICE]
                        supply an AWS service (currently only S3 is supported)
```

```sh
$ light_auth buckets | jq
{
  "buckets": [
    "lly-light-prod",
  ]
}
$ light_auth prefixes --bucket lly-light-prod | jq
{
  "prefixes": [
    "",
    "uat-folder/readonly/",
    "uat-folder/writeonly/",
    "uat-folder/readwrite/",
    "uat-folder/deleteonly/"
  ]
}
$ light_auth creds --bucket lly-light-prod --prefix uat-folder/readonly | jq
{
  "AccessKeyId": "ASIAUD4QQPRPPKIIUMOV",
  "SecretAccessKey": <redacted>,
  "SessionToken": <redacted>,
  "Expiration": "2023-11-13T22:20:11+00:00",
  "Version": 1
}

```

## S3 Browser Example

Set light client as an AWS credential provider.  This will allow you to use all the standard AWS s3 cli commands without re-authenticating with AWS each time.  Login period will be the same as with the standard light client tokens.

You can now directly use the light client to set scoped s3 credentials and a named profile:

~/.aws/config
```
[myprofile]
credential_process = light_auth setup -n my_namespace -p myprofile
```



NOTE: if auth fails, you may need to run ```light_auth s3-credentials``` to refresh cached tokens & re-login.

## AWS Auth Example

If calling a CATS hosted app from AWS & you want to use AWS Authentication, the Light client has a helper function to fetch the required auth headers.

### Example Usage

```
from light_client import LIGHTClient, AUTH_METHOD_AWS
client = LIGHTClient(auth_method=AUTH_METHOD_AWS)
# Will fetch AWS credentials & use them to authenticate the CATS request using the default boto3 credential chain: https://boto3.amazonaws.com/v1/documentation/api/latest/guide/credentials.html
re = client.get("https://test.apps.lrl.lilly.com/")
```

OR

You can add an OS environment variable LIGHT_CLIENT_AUTH_PROVIDER in your environment and set its value to AUTH_METHOD_AWS .

```
from light_client import LIGHTClient
client = LIGHTClient()
# Will fetch AWS crednetials & use them to authenticate the CATS request using the default boto3 credential chain: https://boto3.amazonaws.com/v1/documentation/api/latest/guide/credentials.html
re = client.get("https://test.apps.lrl.lilly.com/")
```


## R:

R-based client libraries for interacting with Kubernetes apps in the Light infra.

Client Library for Applications Hosted on [LIGHT Platform (Lilly LRL LIGHT)](https://github.com/EliLillyCo/LRL_light_k8s_infra_apps)


## Install 

### On Lilly Network

```R
install.packages("LIGHTClient", repos = c("https://artifactory.am.lilly.com/artifactory/lrl-cran/"))
```

### Github

```R
devtools::install_github("EliLillyCo/LRL_light_k8s_infra_app_client_r", auth_token="<github personal access token>", ref="main")
```

