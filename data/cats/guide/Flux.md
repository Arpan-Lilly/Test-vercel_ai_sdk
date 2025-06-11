# **Flux : Auto Deployment Tool**

Flux V2 is an open source second iteration of the Flux gitops toolkit. The service provides a full gitops suite but we have relegated most of the GitHub repository syncing to [ArgoCD](https://argocd.apps.lrl.lilly.com/). Specifically we utilize two specific aspects of Flux V2 namely the image repository and the image reflector to create custom resource definitions to enable automatic image rollout based on diffs in the AWS ECR.

**Repositories Related to Flux Implementation:**

Helm Charts -> 
https://github.com/EliLillyCo/fluxcd-community_helm-charts

Image reflector Controller -> 
https://github.com/EliLillyCo/fluxcd_image-reflector-controller/tree/main

<br />
<br />
<br />

## Simple Flux Annotation

The following lines enable Flux to automatically find your latest image in the ECR and deploy it to a new pod. If the deploy is successful the old pod will be deleted and a seamless transition between the two images will happen. If you did not make any changes when implementing the GitHub actions automation code above, then the pattern `sha-.*` should work out of the box:


```yaml
  annotations:
    app.lilly.com/flux.automated: "true"
    app.lilly.com/flux.simple.<policy-name>: "<aws-account-number>;<your-repo-name-in-ecr>;glob:<tag-pattern>"
    # Example: app.lilly.com/flux.simple.docs-policy: "283234040926;lrl_light_k8s_infra_apps_catsdocs;glob:sha-.*"
    wave.pusher.com/update-on-config-change: "true"
```
`<aws-account-number>` - Default to "283234040926" for AWS Prod Cluster. You may use a different account number if you are pulling from a non CATS AWS Account's ECR. It is possible to pull your solutions image from any ECR... BUT if you do that the CATS Support team is severely limited in our ability to troubleshoot issues that may arise. We **HIGHLY** suggest pushing your image to one of the following accounts:

```yaml
    - PRD ACCOUNT : 283234040926
    - QA ACCOUNT : 474366589702
    - DEV ACCOUNT : 408787358807
```

<br />

`<your-repo-name-in-ecr>` - This is the name of your repository in AWS ECR. In the example you can see we are using the catsdocs repo name. 

Your projects ECR repo name will usually be the GitHub repository name in lowercase. Sometimes special characters such as spaces can be changed to underscores. 

To find your specific name if you are not sure, you can navigate to your GitHub actions tab and go to the "Build and Push Image" step. 

To be 100 percent certain what your name is you can log into the [AWS console](https://lilly-aws-login.awsapps.com/), navigate to ECR, and look up your repo there. This method requires a [CA account](https://elilillyco.stackenterprise.co/articles/481). 

<br />

`<policy-name>` - A unique policy name within your namespace. Chosen by you. It is arbitrary. Avoid special characters. 

<br />

`<tag-pattern>` - This is where you declare the sha tagging pattern you are using in your GitHub workflow file. Example: "sha-.*" 

This pattern must match the pattern you are using in your workflow file or the automation will not work. 

<br />

`<$imagepolicy>` - Update the comment with your namespace name and image policy you define in the flux annotation to properly allow automated deployments. This comment is used by the Light Account butler. He needs the info for commit messages to work correctly.

Template: 
```yaml
  image: <container-image> # {"$imagepolicy": "<namespace-name>:<policy-name>"}
```

Example:
```yaml
  image: 283234040926.dkr.ecr.us-east-2.amazonaws.com/lrl_falcon_bartender:qa-sha-06c5953 # {"$imagepolicy": "falcon-qa:my-policy-bartender"}
```

<br />

## Custom Flux Annotation

The following annotation is a custom version of the simple annotation. This custom annotation allows you to manually provision repositories and repository policies if a more custom implementation is needed. 99% of users will not need to use this and should stick with the simple annotation pattern. 

```
annotations:
        app.lilly.com/flux.automated: "true"
        app.lilly.com/flux.v2.repos: |
            [
                {
                    "name": "repo-1",
                    "image": "408787358807.dkr.ecr.us-east-2.amazonaws.com/flux-testing",
                    "injectCreatedAt": "true",
                    "provider": "aws", optional
                    "policies": [
                        "policy-1"
                    ]
                }
            ]
        app.lilly.com/flux.v2.policies: |
            [
                {
                    "name": "policy-1",
                    "policy": {
                        "alphabetical": {
                            "order": "asc"
                        }
                    },
                    "filterTags": {
                        "pattern": "^dev-(?P<timestamp>\d+)$",
                        "extract": "$timestamp"
                    }
                }
            ]
```


