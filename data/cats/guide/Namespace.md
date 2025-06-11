
# Namespace

In Kubernetes, namespaces provides a mechanism for isolating groups of resources within a single cluster. Names of resources need to be unique within a namespace, but not across namespaces. Namespace-based scoping is applicable only for namespaced objects (e.g. Deployments, Services, etc.) and not for cluster-wide objects (e.g. StorageClass, Nodes, PersistentVolumes, etc.).

When to Use Multiple Namespaces

Namespaces are intended for use in environments with many users spread across multiple teams, or projects. For clusters with a few to tens of users, you should not need to create or think about namespaces at all. Start using namespaces when you need the features they provide.

Namespaces provide a scope for names. Names of resources need to be unique within a namespace, but not across namespaces. Namespaces cannot be nested inside one another and each Kubernetes resource can only be in one namespace.

Namespaces are a way to divide cluster resources between multiple users (via resource quota).

It is not necessary to use multiple namespaces to separate slightly different resources, such as different versions of the same software: use labels to distinguish resources within the same namespace.


## CATS Namespace Template

```yaml
# Define Namespace
apiVersion: v1
kind: Namespace
metadata:
  name: <namespace-name>
  labels:
    cost-center: <costcenterID>
  annotations:
    app.lrl.lilly.com/compute: <serverless> or <hybrid> 
    lilly.com/cloud-browser-auth: <authconfigs> #optional
    app.lilly.com/sg-rule: <interface> #optional
    app.lilly.com/argo.automated: "true"
    app.lilly.com/argo.config: |-
            {
                "roles": {
                    "readADGroups": [ "<dev-group>" ],
                    "adminADGroups": [ "<admin-group>" ]
                }
            }

```

You need to replace the placeholder values with your desired configurations. Here's an explanation of the placeholders:

| Placeholder                        | Description                                       |
|------------------------------------|---------------------------------------------------|
| `<namespace-name>`                 | The name of your namespace.                                                                             |
| `<costcenterID>`                   | The ID of the cost center associated with the namespace.                                                |
| `<serverless>`                     | The default solution.                                                                                   |
| `<hybrid>`                         | The application config will be using Fargate and EC2.                                                   |
| `<authconfigs>`                    | This line relates to the cloud browser solution. Remove line if you are not using this feature.         |
| `<interface>`                      | The annotation will contain the interface used to define your ingress and egress rules for all resources in your namespace. |
| `<dev-group>`    |  This represents the AD group you would like to have read only access to your namespaces resources in the Argo Dashboard|
| `<admin-group>`  | This represents the AD group you would like to have Admin access to your namespaces resources in the Argo Dashboard|

Note: Remember to remove the angle brackets (`<>`) when replacing the placeholder values. Additionally, this template assumes you are using the apps/v1 API version for the Deployment resource.  

<br /> 

## Labels and Annotations

### 1. labels: explained

`cost-center:` - This label maps your namespace to your area's cost center. This is used by our kubecost solution to congregate namespaces into large groups to better understand how many resources each group is using. This label is a string. If your cost center contains all numbers such as 654321 then you can simply put it in quotes. `"654321"`

<br /> 

### 2. annotations: explained

`app.lilly.com/compute:`

There are two types of compute supported. The primary type is Fargate. The second type is AWS EC2 instances. To configure your namespace to use Fargate / EC2 instances, you must place the annotation: `app.lrl.lilly.com/compute` with a value of either 'serverless' to allow using only Fargate OR 'hybrid' to allow using both EC2 or Fargate. 

NOTE: If you chose hybrid you must label your containers to allow them to run on Fargate, while if you chose serverless all your containers will run on Fargate without special config. 

A more detailed explanation can be found [here](/guide/ComputeAndWorkloadScheduling).

<br />

`lilly.com/cloud-browser-auth:`

This allows setting s3 auth roles for s3 resources associated with the associated namespace.

The value for this annotation is a JSON object in string format.  The simplest config allows setting a list of users providing read only access to the default S3 path for this namespace.  This default bucket / S3 prefix path will be 's3://lly-light-prod/namespace-name/'

```
annotations:
  app.lrl.lilly.com/cloud-browser-auth: '{"authConfigs": [{ "users": ["A123456", "B7891011"]}]}'
```

A more detailed explanation can be found [here](/guide/CloudBrowser).

<br />

`app.lilly.com/sg-rule:`

This is an optional annotation that outlines the interface you will populate in order to apply specific ingress and egress rules to your namespace. These rules will then apply to all resources within your namespace.

ingress rules interface:
```
app.lilly.com/sg-rule: |-
{
  "ingress_rules": [
    {
      "namespace_allow_from": "<other-namespace>",
      "port": <your-ingress-port>
    }
  ],
  "egress_rules": [
    {
      "prefix_list": "<your-prefix-list>",
      "port": <your-egress-port>
    },
    {
      "sg_id": "<security-group-ID>",
      "sg_account": "<security-group-account>",
      "port": <your-egress-port>
    }
  ]
}
```

Note: You do not need to use this annotation. There is a default security group policy that is applied automatically to a namespace upon creation, called sg-main. This default policy allows the following activities:
 - Restrict namespace to not allow outbound traffic
 - Allow self referencing. Allows communication between pods within your own namespace
 - Allow udp and tcp lookup on cluster DNS service
 - Allow namespace to connect to RDS
 - Allow namespace to connect to EFS
 - Allow communication to control plane
 - Allow all traffic from core cluster services. cluster can communicate over all TCP ports.
 - Allow all Lilly specific egress are except on prem
 - Allow all AWS APIs
 - Allow all AWS DB RDS
 - Allow all AWS DB redshift
 - Allow access to AWS managed Kafka
 - Allow access to Schrodinger License
 - Allow access to MOE license
 - Allow access to all Lilly http based URLs
 - Allow access to Microsoft private link
 

 For more detailed information on the security group rule annotation, see our extensive documentation [here](/guide/Namespace#security-group-rule).
 For a detailed Architecture diagram of how the security groups are handled in CATS, see our diagram [here](https://github.com/EliLillyCo/LRL_light_k8s_infra_apps/blob/main/docs/security_group_controller.svg).
 

 <br />

 <br />

`app.lilly.com/argo.config:`

This is a required annotation that ensures configuration of permissions for the Argo CD dashboard based off of the AD groups you assign to both the Read-Only section and the Admin section. Configure this by customizing and managing your own AD groups that contain your project's developers or users. 

Use this interface to set your AD Groups by replacing `<dev-group>` and `<admin-group>` with strings that are names of the AD groups you have configured: 

```yaml
{
    "roles": {
        "readADGroups": [ "<dev-group>" ],
        "adminADGroups": [ "<admin-group>" ]
    }
}
```

You can easily use existing AD Groups for the `roles` interface or create new existing groups by navigating to the Lilly [idmportal](https://idmportal.rf.lilly.com/IdentityManagement/default.aspx) and select "Create a new Group". 

For information on permissions provided by `readADGroups` and `adminADGroups` roles, navigate [HERE](/guide/Argo)

For details on the Argo Dashboard please navigate [HERE](/guide/Argo#argo-dashboard)

<br />

## Security Group Rule

The `sg-rule` annotation is an optional annotation on a namespace. This annotation contains an interface that you will populate with details that are specific to the solution that you are deploying. Before adding `sg-rule` as an annotation on your namespace please review the two policies below to ensure they do no already cover your use case. 

You will need the `sg-rule` annotation if you are attempting to enable namespace1 to namespace2 communication.


### default sg-main policy

Most developers will not need to use this annotation as without it your namespace will automatically be added to the default security group sg-main via our automation. The sg-main security group policy will allow/restrict the following scenarios:
 - Restrict namespace to not allow outbound traffic
 - Allow self referencing. Allows communication between pods within your own namespace
 - Allow udp and tcp lookup on cluster DNS service
 - Allow namespace to connect to RDS
 - Allow namespace to connect to EFS
 - Allow communication to control plane
 - Allow all traffic from core cluster services. cluster can communicate over all TCP ports.
 - Allow all Lilly specific egress are except on prem
 - Allow all AWS APIS
 - Allow all AWS DB RDS
 - Allow all AWS DB redshift
 - Allow access to AWS managed Kafka
 - Allow access to Schrodinger License
 - Allow access to MOE license
 - Allow access to all Lilly http based URLs
 - Allow access to Microsoft private link



### sg-onprem policy

If you are using an on prem node group solution you will have labeled your node as "onpremis" this designation will automatically add the sg-onprem security group policy to your namespace instead of the sg-main policy. The sg-onprem security group policy will allow/restrict the following scenarios:
 - Restrict namespace to not allow outbound traffic
 - Allow self referencing. Allows communication between pods within your own namespace, on the same security group.
 - Allow udp and tcp lookup on cluster DNS service
 - Allow namespace to connect to RDS
 - Allow namespace to connect to EFS
 - Allow communication to control plane
 - Allow all outbound traffic



### sg-rule Interface Template:

```
app.lilly.com/sg-rule: |-
{
  "ingress_rules": [
    {
      "namespace_allow_from": "<other-namespace>",
      "port": <your-ingress-port>
    }
  ],
  "egress_rules": [
    {
      "prefix_list": "<your-prefix-list>",
      "port": <your-egress-port>
    },
    {
      "sg_id": "<security-group-ID>",
      "sg_account": "<security-group-account>",
      "port": <your-egress-port>
    }
  ]
}
```

This template is made up of two sections, `ingress_rules:` and `egress_rules:`.

<br />

**ingress_rules:**

This part of the interface is optional. If you would like to allow traffic into your namespace, from another namespace, you will fill out the following fields with the applicable information. In most cases developers are not allowing traffic from other namespaces and therefore can remove this section.

```
"ingress_rules": [
    {
      "namespace_allow_from": "<other-namespace>",
      "port": <your-ingress-port>
    }
  ],
```
| Placeholder                        | Description                                       |
|------------------------------------|---------------------------------------------------|
| `<other-namespace>`                | (string) The name of namespace you want to allow connection from. Remove line if you are not using this feature. |
| `<your-ingress-port>`              | (int) The port that incoming traffic is targeting.                                                            |

<br />

Example - No ingress rules used:
```
app.lilly.com/sg-rule: |-
{
  "ingress_rules": [],
  "egress_rules": [
    {
      "prefix_list": "<your-prefix-list>",
      "port": <your-egress-port>
    },
    {
      "sg_id": "<security-group-ID>",
      "sg_account": "<security-group-account>",
      "port": <your-egress-port>
    }
  ]
}
```

<br />

**egress_rules:**

This part of the interface is made up of two sections, one for designating a prefix list, and one for designating the security group information that will apply to all resources in your namespace. If you are not using a prefix list that section can be removed from the 'egress_rules:' section. 

<br />

*prefix lists explained:* 

An AWS (Amazon Web Services) prefix list is a collection of CIDR (Classless Inter-Domain Routing) blocks that are specified in a single list. These CIDR blocks represent IP address ranges used by AWS services. AWS prefix lists are primarily used in networking and security configurations, such as in AWS Identity and Access Management (IAM) policies, route tables, and security group rules.

Using prefix lists allows you to simplify the management of IP address ranges associated with AWS services. Instead of individually specifying multiple IP ranges for different services, you can refer to a single prefix list that encapsulates all the relevant CIDR blocks.

If your solution's use case requires a custom prefix list to be created reach out to Cole Thomas or Ross Grinvalds and we will help you get one set up. 

```
"egress_rules": [
    {
      "prefix_list": "<your-prefix-list>",
      "port": <your-egress-port>
    },
]
```


| Placeholder                        | Description                                       |
|------------------------------------|---------------------------------------------------|
| `<your-prefix-list>`               | (string) Optional field that you can fill out if you are using prefix lists.                                           |
| `<your-egress-port>`               | (int) Optional field that specifies the destination port that the outgoing traffic from your namespace is targeting.|


The prefix list details are not required fields. If you are not using prefix lists in your solution then this section can be removed. 

Example - No prefix list and no ingress rules used: 

```
app.lilly.com/sg-rule: |-
{
  "ingress_rules": [],
  "egress_rules": [
    {
      "sg_id": "<security-group-ID>",
      "sg_account": "<security-group-account>",
      "port": <your-egress-port>
    }
  ]
}
```

<br />

*Security Group Details section explained:* 

If you decide to define an egress rule, then this part of the interface is required. In it you are designating the information surrounding the security group your namespace is associated with. 

```
"egress_rules": [
    {
      "sg_id": "<security-group-ID>",
      "sg_account": "<security-group-account>",
      "port": <your-egress-port>
    }
]
```
| Placeholder                        | Description                                       |
|------------------------------------|---------------------------------------------------|
| `<security-group-ID>`              | (string) The ID of the security group you are using.                                                             |
| `<security-group-account>`         | (string) The AWS account that owns the security group you specified in `<security-group-ID>`                     |
| `<your-sg-egress-port>`            | (int) The destination port that outgoing traffic from your namespace is targeting                             |

<br />

### Basic sg-rule Interface Template:

The following template contains the bare minimum required if using the `sg-rule:` annotation. The template does not allow traffic from other namespaces and is not using a prefix list. this template would allow traffic out of the namespace via the port specified in 'your-egress-port'.

```
app.lilly.com/sg-rule: |-
{
  "ingress_rules": [],
  "egress_rules": [
    {
      "sg_id": "<security-group-ID>",
      "sg_account": "<security-group-account>",
      "port": <your-egress-port>
    }
  ]
}
```


## IAM Permissions for your app

You can assign AWS IAM permission to any of your app deployment pods.  See the sections below for a few different permission patterns.


### General

There are two steps to adding permissions to your app.

1. Define in an annotation, a role/service account & policy annotation in your namespace.

    This annotation follows the pattern app.lrl.lilly.com/aws-role.\{service account name\}

    The value of the annotation can be either ```policy``` or ```s3```.  See below for information about each of these.

2. Associate service account with your Deployment pod

This will create a role in AWS associated with a k8s service account following the pattern:

+ Service Account Created ```{service account name from above}```
+ Assume Role IAM Role ARN Created (USE IF AWS AUTH OF CUSTOM LILLY SERVICE) ```arn:aws:iam::{Account ID see below}:role/lrl-light-apps-{namespace name}-{service account name from above}```
+ Resource IAM Role ARN Created (USE IF TRUSTING FROM ANOTHER ACCOUNT) ```arn:aws:iam::{Account ID see below}:role/lrl-light-apps/lrl-light-apps-{namespace name}-{service account name from above}```

There are two different ARNs above because when performing STS calls, the path segment is stripped from the ARN of the IAM role with only the IAM role name remaining. Note the missing /lrl-light-apps/ infix when AUTHENTICATING WITH LILLY CUSTOM SERVICE.


| Cluster | Account IDS |
| :-- | :-- |
| Main (prod) default | 283234040926 |
| QA | 474366589702 | 
| DEV | 408787358807 |

NOTE: Make sure that the length of the resulting AWS role name after replacing the values in ```lrl-light-apps-{namespace name}-{service account name from above}``` is equal or less than 64 characters, otherwise the automation will fail to create the AWS role. The namespace will be created and deployed but the AWS role will not be created. For example, this is an invalid AWS role name because the length is 69 characters: lrl-light-apps-spe-eli-labs-assay-catalog-dev-assay-catalog-svc-acct

### S3 Policy

Create add an annotation to your namespace & provide the value s3, this will
auto create a policy with access to a path prefix in our platform s3 bucket with the pattern ```s3://lly-light-prod/{your namespace name}/*```

```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: my-app-namespace-dev
  labels:
    cost-center: your-apps-cost-center-id
  annotations:
    app.lrl.lilly.com/aws-role.my-service-account: s3
```

Add the service account created above to the ```serviceAccountName```.  This
attaches the k8s service account & the associated IAM role to your pod.

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-app
  namespace: my-app-namespace-dev
spec:
  selector:
    matchLabels:
      app.kubernetes.io/name: my-app
  template:
    metadata:
      labels:
        app.kubernetes.io/name: my-app
    spec:
      containers:
      ...
      serviceAccountName: my-service-account
```

You can now access the bucket: ```s3://lly-light-prod/my-app-namespace-dev/*```, with [full permission for the specified S3 path](https://github.com/EliLillyCo/LRL_light_k8s_infra_manager/blob/12120fb0c2ff509e832dab2a0705240fcb6f0749/Namespace/index.js#L65-L77).


### Custom Permission

***Important Note: custom policies are a powerful method of setting any AWS IAM permission.  Because of this, they have potential to be misconfigured / misused.  To protect against this, any namespace with a custom IAM policy must be created in a ```namespace.yml``` file.  This allows our GitHub CODEOWNERS to flag this namespace & associated policy changes for additional review.***

You can set custom permissions by creating an annotation with the value policy & 
adding a ```.policy``` annotation with the custom policy to associate with this role.

```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: my-app-namespace-dev
  labels:
    cost-center: your-apps-cost-center-id
  annotations:
    app.lrl.lilly.com/aws-role.my-service-account: policy
    app.lrl.lilly.com/aws-role.my-service-account.policy: |
      {
          "Version": "2012-10-17",
          "Statement": [
              ... IAM Policy Statements Here ...
          ]
      }
```

From there, you can add service account created above to the ```serviceAccountName```.  This
attaches the k8s service account & the associated IAM role to your pod.

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-app
  namespace: my-app-namespace-dev
spec:
  selector:
    matchLabels:
      app.kubernetes.io/name: my-app
  template:
    metadata:
      labels:
        app.kubernetes.io/name: my-app
    spec:
      containers:
      ...
      serviceAccountName: my-service-account
```

Your pod will now have the permission defined in the custom policy.


### Research Data cross account roles

If you have data in Research Data not in an API that you need to access from
your app, you can use a custom policy as above with a specific policy statement

```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: my-app-namespace-dev
  labels:
    cost-center: your-apps-cost-center-id
  annotations:
    app.lrl.lilly.com/aws-role.my-service-account: policy
    app.lrl.lilly.com/aws-role.my-service-account.policy: |
      {
          "Version": "2012-10-17",
          "Statement": [
              {
              "Action": "sts:AssumeRole",
              "Effect": "Allow",
              "Resource": "arn:aws:iam::014508419436:role/aws_resd_{your data domain}_{your role label}"
              }
          ]
      }
```

This policy allows your app to assume into the given Research Data role.  To create this role, you must update the data domain definitions here: [Click here] (https://github.com/EliLillyCo/LRL_research_data_security/blob/main/data_domain_definitions/data_domains_prd.json).

For the example above, you would need to add the following configuration & create a PR to the main branch (If you have questions or need access, ask one of the Research Data Security approvers) [Click here] (https://github.com/orgs/EliLillyCo/teams/lrl-resdata-security-approvers/members):

```json
{
    "data_domain": "{your data domain}",
    "roles": [
    {
        "label": "{your label}",
        "assume_role_policy": "role_policy_nologin.json",
        "additional_policy_statements": [
            {
            "Action": "sts:AssumeRole",
            "Principal": {
                "AWS": "arn:aws:iam::283234040926:role/lrl-light-apps/lrl-light-apps-{your-namespace}-{your service account name}"
            },
            "Effect": "Allow"
            }
        ],
        "policies": [
              ... Research Data Policies ...
        ]
    }
    ]
},
```

From there, you can add service account created above to the ```serviceAccountName```.  This
attaches the k8s service account & the associated IAM role to your pod.

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-app
  namespace: my-app-namespace-dev
spec:
  selector:
    matchLabels:
      app.kubernetes.io/name: my-app
  template:
    metadata:
      labels:
        app.kubernetes.io/name: my-app
    spec:
      containers:
      ...
      serviceAccountName: my-service-account
```

Your pod will now have permission to assume into the research data role you specified. 

