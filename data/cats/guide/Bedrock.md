# AWS Bedrock Overview

Amazon Bedrock is a fully managed service that streamlines the integration and utilization of high-performing foundation models (FMs) from top AI companies, including Amazon, for building generative AI applications. This service offers a unified API through which users can access a wide selection of foundation models to best fit their specific needs. Additionally, Amazon Bedrock provides a comprehensive set of capabilities necessary for developing generative AI applications with a focus on security, privacy, and the principles of responsible AI, making it a versatile tool for businesses and developers aiming to harness the power of AI in their operations​.

<br />

**Before utilizing any of the Bedrock Models please review the following:**
- Please review the Responsible Use of AI guidelines outlined by AI at Lilly. These guidelines can be found here: [Responsible Use of AI](https://ai.lilly.com/assets/pdfs/Guidelines_for_Responsible_Use_of_AI.pdf).
- You may proceed with development using green data only. However, for production and for the use of higher sensitive data, please ensure that you have an approved AI use case. To request approval for an AI use case please follow the process outlined in the [AI Hub](https://collab.lilly.com/sites/GenerativeAI/SitePages/Contact-Us.aspx?ref=cortex.lilly.com).

## Models Available

#### Bedrock Models are available in the following CATS AWS Accounts: 
- prod-igw-dx-researchit-light 283234040926 
- qa-igw-dx-researchit-light 474366589702 
- dev-igw-dx-researchit-light 408787358807

<br />

#### Bedrock Models are **ONLY** available in the following Regions:
- Europe (Frankfurt)
- US West (Oregon)
- Europe (Paris)
- Asia Pacific (Tokyo)
- Asia Pacific (Singapore)
- Asia Pacific (Sydney)
- US East (N. Virginia)

*Note: We suggest using the region closest to you.* 

<br />

#### US East (N. Virginia) Models Available in Production Account 283234040926:

There are currently **35** models avaialable for us via the CATS Platform. 

<br />

| Model Name                            | Access Status       |
|---------------------------------------|---------------------|
| **AI21 Labs**                         |                     |
| Jurassic-2 Ultra                      | Access granted      |
| Jurassic-2 Mid                        | Access granted      |
| Jamba 1.5 Mini                        | Available to request|
| Jamba 1.5 Large                       | Available to request|
| Jamba-Instruct                        | Available to request|
| **Amazon**                            |                     |
| Titan Embeddings G1 - Text            | Access granted      |
| Titan Text G1 - Lite                  | Access granted      |
| Titan Text G1 - Express               | Access granted      |
| Titan Text G1 - Premier               | Access granted      |
| Titan Text Embeddings V2              | Access granted      |
| Titan Image Generator G1 v2           | Access granted      |
| Titan Image Generator G1              | Access granted      |
| Titan Multimodal Embeddings G1        | Access granted      |
| **Anthropic**                         |                     |
| Claude 3.5 Sonnet                     | Access granted      |
| Claude 3 Opus                         | Access granted      |
| Claude 3 Sonnet                       | Access granted      |
| Claude 3 Haiku                        | Access granted      |
| Claude                                | Access granted      |
| Claude Instant                        | Access granted      |
| **Cohere**                            |                     |
| Command                               | Access granted      |
| Command Light                         | Access granted      |
| Embed English                         | Access granted      |
| Embed Multilingual                    | Access granted      |
| Command R                             | Available to request|
| Command R+                            | Available to request|
| **Meta**                              |                     |
| Llama 3.2 1B Instruct                 | Access granted      |
| Llama 3.2 3B Instruct                 | Access granted      |
| Llama 3.2 11B Vision Instruct         | Access granted      |
| Llama 3.2 90B Vision Instruct         | Access granted      |
| Llama 3 8B Instruct                   | Access granted      |
| Llama 3 70B Instruct                  | Access granted      |
| Llama 2 Chat 13B                      | Access granted      |
| Llama 2 Chat 70B                      | Access granted      |
| Llama 2 13B                           | Access granted      |
| Llama 2 70B                           | Access granted      |
| **Mistral AI**                        |                     |
| Mistral 7B Instruct                   | Access granted      |
| Mixtral 8x7B Instruct                 | Access granted      |
| Mistral Large (24.02)                 | Access granted      |
| Mistral Small (24.02)                 | Access granted      |
| **Stability AI**                      |                     |
| SDXL 1.0                              | Access granted      |



<br />

#### To see the models available in other regions and environments:

1. [Log into the account](https://lilly-aws-login.awsapps.com/start/#/?tab=accounts) associated with the environment you are working in. When logging in select the aws_light_devs role. In order to log in you will need a [-CA account](https://elilillyco.stackenterprise.co/articles/481) and have the aws_light_devs role. To get this role you can request access via the [Developer Front Door](https://dev.lilly.com/docs/platforms-and-tools/cats/) 

2. Select the region you would like to work in. This option is at the top of the screen on the right side.

3. Navigate to the AWS Bedrock service by searching "Amazon Bedrock" in the search box at the top of the screen. 

4. Click the orange "Get started" button. 

5. On the left side of the screen select "Model access" to see the full list of models that are available. If a model is not available that you want to use please reach out to Cole Thomas and he will work with you to get it enabled. 

## Getting Started

### Add Bedrock Policy to Namespace

#### Namespace Policy Template:

To get started using AWS Bedrock models you will need to add the following policy to the namespace you are working in. 

```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: <your-namespace>
  labels:
    cost-center: <your-cost-center>
  annotations:
    app.lrl.lilly.com/compute: <serverless> / <hybrid>
    app.lrl.lilly.com/aws-role.lmm-data: policy
    app.lrl.lilly.com/aws-role.lmm-data.policy: |
    {
            "Version": "2012-10-17",
            "Statement": [
            {
                "Sid": "BedrockAll",
                "Effect": "Allow",
                "Action": [
                "bedrock:*"
                ],
                "Resource": "*"
            },
            {
                "Sid": "DescribeKey",
                "Effect": "Allow",
                "Action": [
                "kms:DescribeKey"
                ],
                "Resource": "arn:*:kms:*:::*"
            },
            {
                "Sid": "APIsWithAllResourceAccess",
                "Effect": "Allow",
                "Action": [
                "iam:ListRoles",
                "ec2:DescribeVpcs",
                "ec2:DescribeSubnets",
                "ec2:DescribeSecurityGroups"
                ],
                "Resource": "*"
            },
            {
                "Sid": "PassRoleToBedrock",
                "Effect": "Allow",
                "Action": [
                "iam:PassRole"
                ],
                "Resource": "arn:aws:iam::*:role/*AmazonBedrock*",
                "Condition": {
                "StringEquals": {
                    "iam:PassedToService": [
                        "bedrock.amazonaws.com"
                        ]
                    }
                }
            }
        ]
    }
```

#### Permissions Granted in Policy Explained:

**Access to Amazon Bedrock Services:** This policy grants comprehensive permissions (`bedrock:*`) to all Amazon Bedrock services. Amazon Bedrock offers fully managed foundational models for building and deploying generative AI applications. With these permissions, you can leverage any aspect of the Bedrock services, including model training, deployment, and inference capabilities.

**Key Management Service (KMS) Access:** The policy includes permissions for `kms:DescribeKey`, allowing your applications to retrieve information about AWS KMS keys. This is crucial for applications that require encryption and decryption capabilities, ensuring that your application can securely manage and use encryption keys for data protection.

**AWS Resource Descriptions:** Permissions are granted for listing IAM roles (`iam:ListRoles`) and describing AWS Virtual Private Cloud (VPC) resources (`ec2:DescribeVpcs`, `ec2:DescribeSubnets`, `ec2:DescribeSecurityGroups`). These permissions enable your applications to query information about the IAM roles and networking resources in your AWS environment, facilitating resource management and configuration.

**Role Delegation to Amazon Bedrock:** Specifically tailored to interactions with Amazon Bedrock, the policy allows your applications to pass IAM roles (`iam:PassRole`) to Amazon Bedrock services under certain conditions. This capability is restricted to roles intended for Amazon Bedrock (`arn:aws:iam::*:role/*AmazonBedrock*`), and only when the role is being passed to `bedrock.amazonaws.com`, ensuring that role delegation is securely managed and scoped to intended use cases.

### Calling Bedrock via API

Here is a code block that shows how to use a get headers function to get into aws us-east-1 where bedrock is located. 

```python
from boto3 import Session
import psycopg2
from botocore.awsrequest import AWSRequest
from botocore.compat import HTTPHeaders
from botocore.hooks import HierarchicalEmitter
from botocore.model import ServiceId
from botocore.signers import RequestSigner
import boto3
import pymsteams
import requests
import os
import json

def get_aws_header(**kwargs):
    session = Session(**kwargs)
    credentials = session.get_credentials()
    emitter = HierarchicalEmitter()
    signer = RequestSigner(ServiceId("BEDROCK"), 'us-east-1', "bedrock", "v4", credentials, emitter)

    url = "https://bedrock.amazonaws.com/"

    headers = HTTPHeaders()
    headers.add_header("Content-Type", content_type)
    request = AWSRequest("POST", url, headers,
                         data=request_parameters, params={})
    signer.sign("GetCallerIdentity", request)
    return request.headers
```

<br />

Now that you have made connection to bedrock within the AWS account you can implement your specific use case! Good luck ✌️
