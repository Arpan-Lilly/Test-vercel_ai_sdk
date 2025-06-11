# Deployment

A Deployment provides declarative updates for Pods and ReplicaSets.

You describe a desired state in a Deployment, and the Deployment Controller changes the actual state to the desired state at a controlled rate. You can define Deployments to create new ReplicaSets, or to remove existing Deployments and adopt all their resources with new Deployments.


## CATS Deployment Template: 
```yaml
# Define Deployment
apiVersion: apps/v1
kind: Deployment
metadata:
  name: <deployment-name>
  namespace: <namespace-name>
  labels:
    app: <app-label>
  annotations:
    app.lilly.com/flux.automated: "true"
    app.lilly.com/flux.simple.<policy-name>: "<aws-account-number>;<your-repo-name-in-ecr>;glob:<tag-pattern>"
    # Example: app.lilly.com/flux.simple.docs-policy: "283234040926;lrl_light_k8s_infra_apps_catsdocs;glob:sha-.*"
    wave.pusher.com/update-on-config-change: "true"
spec:
  replicas: <replica-count>
  selector:
    matchLabels:
      app: <app-label>
  template:
    metadata:
      labels:
        app: <app-label>
    spec:
      containers:
        - name: <container-name>
          image: <container-image> # {"$imagepolicy": "<namespace-name>:<policy-name>"}
          ports:
            - containerPort: <container-port>
          <additional-container-configuration>
      <additional-pod-configuration>

```

You need to replace the placeholder values with your desired configurations. Here's an explanation of the placeholders:

| Placeholder | Description |
|-------------|-------------|
| `<namespace-name>` | The namespace where your deployment will be created. |
| `<deployment-name>` | The name of your Kubernetes deployment. |
| `<app-label>` | A label that identifies your application components within Kubernetes. |
| `<aws-account-number>`             | Default to "283234040926" for AWS Prod Cluster.   |
| `<your-repo-name-in-ecr>`          | The name of your repository in AWS ECR            |
| `<policy-name>`                    | A unique policy name within your namespace. chosen by you. It is arbitrary. Avoid special characters. |
| `<tag-pattern`                     | This is where you declare the sha tagging pattern you are using in your git workflow file. Example: "sha-.*" |
| `<replica-count>` | The number of pod replicas you want for your deployment. |
| `<container-name>` | The name assigned to the container within your pod. |
| `<container-image>` | The Docker image for your container (e.g., `your-registry/your-image:tag`). |
| `<container-port>` | The port that your container listens on. |
| `<additional-container-configuration>` | Any additional container configuration (e.g., environment variables, volumes, etc.). |
| `<additional-pod-configuration>` | Any additional pod-level configuration (e.g., volumes, secrets, etc.). |


<br />

## Find Your Container Image Name: 
You can find the name of your image by following these steps.
1. Navigating to your repository and go to the Actions Tab
2. Select the workflow the is building your desired image and open it.
3. Click on the button that has a green checkmark and is labeled `build`
4. Expand the section labeled `build and push docker image`
5. Scroll through the logs and look for a line that says something like this: `writing image sha256:a1fa199272cae6ec8747f905aa5624666be61e38db0aff5b9e2763f07df072d8 done` this is `<your-image-tag>`

If using generic images (e.g. pgadmin) use Artifactory to avoid DockerHub rate limiting. E.g. `pgadmin:4` becomes `elilillyco-lilly-docker.jfrog.io/pgadmin:4`. You also need to make sure that an entry for the image is present in [allowed images](https://github.com/EliLillyCo/LRL_light_k8s_infra_apps/blob/main/validation/allowed_images.yaml).




## Annotations Explanation: 
The following lines enable flux to automatically find your latest image in the ECR and deploy it to a new pod. If the deploy is successful the old pod will be deleted and a seamless transition between the two images will happen. If you did not make any changes when implementing the git actions automation code above, then the pattern `sha-.*` should work out of the box:


```yaml
  annotations:
    app.lilly.com/flux.automated: "true"
    app.lilly.com/flux.simple.<policy-name>: "<aws-account-number>;<your-repo-name-in-ecr>;glob:<tag-pattern>"
    # Example: app.lilly.com/flux.simple.docs-policy: "283234040926;lrl_light_k8s_infra_apps_catsdocs;glob:sha-.*"
    wave.pusher.com/update-on-config-change: "true"
```

`<aws-account-number>` - Default to "283234040926" for AWS Prod Cluster. You may use a different account number if you are pulling from a non CATS AWS Account's ECR. It is possible to pull your solutions image from any ECR... BUT if you do that the CATS Support team is severely limited in our ability to troubleshoot issues that may arise. We **HIGHLY** suggest pushing your image to the CATS PRD Account `283234040926`.

<br />

`<your-repo-name-in-ecr>` - This is the name of your repository in AWS ECR. In the example you can see we are using the catsdocs repo name. 

Your projects ECR repo name will usually be the github repository name in lowercase.  Sometimes special characters such as spaces can be changed to underscores. 

To find your specific name if you are not sure, you can navigate to your github actions tab and go to the "Build and Push Image" step. 

To be 100 percent certain what your name is you can log into the AWS console, navigate to ECR, and look up your repo there. This method requires a [CA account](https://elilillyco.stackenterprise.co/articles/481). 

<br />

`<policy-name>` - A unique policy name within your namespace. Chosen by you. It is arbitrary. Avoid special characters. 

<br />

`<tag-pattern` - This is where you declare the sha tagging pattern you are using in your git workflow file. Example: "sha-.*" 

This pattern must match the pattern you are using in your workflow file or the automation will not work. 

The pattern expected in the flux.simple annotation is a regex pattern. This is a known change in Flux V2. We encourage all app teams to use the `-.*` pattern until we have a better solution in place. 

Historically users deployed images with the sha pattern declared in their workflow file example: `dev-sha-.*`. Now that we have moved to Flux V2 this pattern needs to be updated in the annotation to `dev-sha-.*`

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


## Resource Name Configuration: 
Resource names should not contain environment suffixes (dev, qa, prd), unless there is a really good reason for those. These are implicitly contained in namespace names. Convention for namespaces is enforced by validation.

The above templates are the very minimum required for a deployment. Depending on your solution you may need to include additional fields or make customized changes. Please see our [examples folder](https://github.com/EliLillyCo/LRL_light_k8s_infra_apps/tree/main/examples) for more extensive documentation.


## Continuous Deployment 

Now that you have added in your Kubernetes config file it should be deployed immediately, *give or take a few minutes for the resources to start up on Fargate*.

Once that happens the magic of Flux kicks in! Now anytime that you update your docker image tag with a new version Flux will automatically deploy that newly built image for you! It will even update your Kubernetes yaml config showing you which specific image tag is deployed.

The only thing you need to worry about now is defining your own release cycle management for your application. One recommendation is to follow the [GitHub Flow](https://guides.github.com/introduction/flow/) pattern.
