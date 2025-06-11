# Deployment Overview

**NOTE: If you are trying to deploy and have not completed the necessary [prerequisites](./Prerequisites.md) please do so before proceeding!**


This comprehensive guide is structured to equip you with the essential knowledge and steps required to deploy your solutions using CATS (Cloud Applications and Technology as a Service). The deployment process is streamlined through the integration of three core technologies: **Containerization**, **Github Actions** and **Kubernetes**. These technologies form the backbone of our platform, facilitating the automation of the deployment processes.

The simple steps required to deploy a solution are the following:
1. Build your Solution
2. Containerize the Application via Dockerfile
3. Configure Git Actions workflow to build image and push to ECR
4. Write Kubernetes Deployment files for all needed resources
5. Solution is LIVE

Have a question? Ask [Cats Agent](https://chat.lilly.com/cortex/chat/spe-platforms-model) or [CatsBot](https://chat.lilly.com/cortex/chat/catsbot)!

Often application teams prefer consuming content in video format so we have a application deployment demo available for you to watch: [Link to Recording](https://mydrive.lilly.com/personal/thomas_cole_e_lilly_com/_layouts/15/stream.aspx?id=%2Fpersonal%2Fthomas%5Fcole%5Fe%5Flilly%5Fcom%2FDocuments%2FBackup%20Files%2FRecordings%2FCATS%20Club%2D20240605%5F101339%2DMeeting%20Recording%2Emp4&referrer=StreamWebApp%2EWeb&referrerScenario=AddressBarCopied%2Eview%2E36f311f1%2D62f7%2D4142%2Db833%2Dc5e7ca9d804b)

Now let's ensure you're equipped with the basics:


## Build Your Solution 

You as the application development team can decide when you are ready to deploy your solution. You do not need to be in a production ready state to deploy as CATS can allow for continuous automated deployments as you iterate through your solution! so feel free to start your deployment early in your development lifecycle.


## Containerization 

Containerization is a lightweight, efficient form of virtualization. It allows you to package your application and its dependencies into a 'container' that can run consistently across any environment. This process eliminates the "it works on my machine" problem by providing a clear separation between your application and the underlying system. Containers are portable, easy to deploy, and less resource-intensive compared to traditional virtual machines.

For example, to containerize a simple web application using Docker, you would create a `Dockerfile`: 

```Dockerfile
# Use an official Python runtime as a parent image
FROM python:3.8

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy the current directory contents into the container at /usr/src/app
COPY . .

# Install any needed packages specified in requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Make port 80 available to the world outside this container
EXPOSE 80

# Define environment variable
ENV NAME World

# Run app.py when the container launches
CMD ["python", "app.py"]
```

With the Dockerfile created, you build the container image and run it:

```bash
docker build -t my-python-app .
docker run -p 4000:80 my-python-app
```

This Dockerfile defines an environment based on a Python 3.8 image, installs dependencies, and specifies how to run your app. The docker run command then runs the app in a new container, mapping port 4000 on your host to port 80 in the container.



## GitHub Actions 

### Load Credentials into GITHUB repository secrets

The `load_credentials` GitHub Actions workflow template is designed to load ECR credentials into repository secrets. This documentation provides a detailed explanation of the workflow's structure and guides you through each section to ensure a clear understanding of how the load_credentials action file operates.
### Template to Load Credentials

```yaml
name: Load Credentials through GitHub Actions

on:
  workflow_dispatch:
    inputs:
      environment:
        description: 'Select the environment to load credentials for'
        required: true
        default: 'prd'

  pull_request:
    branches:
      - main
  push:
    branches:
      - main
    tags:
      - v*

jobs:
  Load-Credentials:
    uses: EliLillyCo/hangar/.github/workflows/load-credentials.yaml@main
    with:
      environment: ${{ github.event.inputs.environment || 'prd'}}
```


#### Workflow Overview

This GitHub Actions workflow is designed to load credentials into a repository's secrets for a specified environment. It provides a streamlined way to manage credentials securely and automate their usage in deployment pipelines.

##### Workflow Triggers

The workflow is triggered by the following events:

1. **Manual Dispatch (workflow_dispatch)**:
   - Allows users to manually trigger the workflow via the GitHub Actions UI.
   - Accepts an input parameter environment to specify the target environment (default: `prd`).

2. **Pull Request (pull_request)**:
   - Automatically triggers the workflow when a pull request is made to the `main` branch.

3. **Push to main Branch (push)**:
   - Automatically triggers the workflow when changes are pushed to the `main` branch.

4. **Tag Creation (push with tags)**:
   - Triggers the workflow when a tag matching the pattern v* (e.g., v1.0.0) is pushed.


##### Job: Load-Credentials

This workflow uses a reusable workflow from the `EliLillyCo/actions` repository to load credentials. The job is defined as follows:

###### Job Configuration

- **uses**: References the reusable workflow located at .github/workflows/load-credentials.yml in the actions.
- **with**: Passes the environment input to the reusable workflow. The value is dynamically set based on the workflow_dispatch input or defaults to prd.

### Build and Push Docker Image

The `build_push_image` GitHub Actions workflow template provided is designed to automate the building and pushing of a Docker image based on events such as pull requests, pushes to the main branch, or the creation of tags. This documentation will guide you through the structure of the workflow and explain each section, ensuring a clear understanding of how the build push action file works.


### Template using build-push-action@v4 

```yaml
name: Build and Push Docker Image

on:
  pull_request:
    branches:
      - main
  push:
    branches:
      - main
    tags:
      - v*

jobs:
  build:
    runs-on: ubuntu-latest
    timeout-minutes: 30
    env:
      ENVIRONMENT: ""
      LOWERCASE_REPO: ""
    steps:
    - uses: actions/checkout@v3
      with:
        fetch-depth: 0
    - name: Get name for ECR repo #(used in image name)
      run: echo "LOWERCASE_REPO=$(echo ${{ github.event.repository.name }} | tr [A-Z] [a-z])" >> $GITHUB_ENV

    - name: if DEV, set dev variables
      id: set-dev-variables  
      shell: bash
      if: github.event_name == 'pull_request'
      run: |
        echo "ENVIRONMENT=dev" >> $GITHUB_ENV;
    
    - name: if QA, set qa variables
      id: set-qa-variables
      shell: bash
      if: github.event_name == 'push' && github.ref_type != 'tag'
      run: |
        echo "ENVIRONMENT=qa" >> $GITHUB_ENV; 
    
    - name: if PROD, set prod variables
      id: set-prod-variables
      shell: bash
      if: github.ref_type == 'tag'
      run: |
        echo "ENVIRONMENT=prod" >> $GITHUB_ENV; 

    - name: Generate Docker Metadata
      id: meta
      uses: docker/metadata-action@v5
      env:
        DOCKER_METADATA_PR_HEAD_SHA: true
      with:
        # list of Docker images to use as base name for tags
        images: |
          ${{ secrets.LIGHT_DOCKER_REPOSITORY_URL }}/${{ env.LOWERCASE_REPO }}    
        # generate Docker tags based on the following events/attributes
        tags: |
          type=sha,prefix=sha-
          type=sha,prefix=sha-,format=short
          type=sha,prefix=${{ env.ENVIRONMENT }}-sha-,format=short
          type=ref,event=pr
          type=ref,event=branch
          type=ref,event=tag
            
    - name: Login to LIGHT AWS ECR
      uses: docker/login-action@v3
      with:
        username: ${{ secrets.LIGHT_DOCKER_USER }}
        password: ${{ secrets.LIGHT_DOCKER_TOKEN }}
        registry: ${{ secrets.LIGHT_DOCKER_REPOSITORY_URL }}
        ecr: false # TODO: fix as this is misleading, set to false to enable use of LIGHT_DOCKER_TOKEN to auth with registry

    - name: Build and push docker images
      uses: docker/build-push-action@v4
      with:
        tags: ${{ steps.meta.outputs.tags }}
        push: true
        provenance: false
```



### Workflow Overview 

This GitHub Actions workflow is designed to automate the process of building Docker images from your repository and pushing them to a Docker registry. It is triggered on pull requests and pushes to the main branch, as well as on version tags (v*).

The workflow consists of several jobs and steps, each fulfilling a specific role—from setting environmental variables based on the type of trigger (development, QA, production) to building and pushing the Docker image.

#### Workflow Triggers 

This workflow is triggered by two GitHub events:
- **Pull Request:** Triggered when a pull request is opened or updated on the `main` branch.
- **Push:** Triggered when changes are pushed to the `main` branch or when a tag starting with "v" is created.

##### Additional Trigger Options: 

- **Schedule:** Allows users to schedule workflows at specified intervals. This is beneficial for periodic tasks such as nightly builds or other scheduled processes.

- **Repository Dispatch:** Enables external events to trigger workflows using the GitHub API. This is useful for integrating with external systems or triggering workflows from external events.

- **Workflow Dispatch:** Allows manual triggering of workflows through the GitHub UI or API. This is helpful when users want to initiate workflows on-demand.

- **Webhooks:** GitHub Actions can be triggered by custom webhooks, providing flexibility for integration with various external systems and services.

- **Push to Branch:** Users can customize the push trigger to target specific branches other than just `main`. This is useful for scenarios where separate branches need individualized build and push actions.

- **Tag Creation:** Apart from the specific "v*" tag condition, users can customize tag triggers based on specific patterns or conditions.

These trigger options provide flexibility and customization for different use cases. Users can choose the most appropriate trigger combination based on their workflow requirements.


#### Job Structure 

The job named build constitutes the core of this workflow, specifying the runtime environment, timeout settings, and a set of environment variables essential for its execution. These variables include ENVIRONMENT, LOWERCASE_REPO, among others, ensuring that each job run is contextualized and correctly configured.



##### Job Environment Variables 

Several environment variables are defined to capture information about the repository, the current branch or tag, and the Docker image version. These variables include:

- `ENVIRONMENT`: The environment for which the Docker image is being built (dev, qa, or prod). This variable is dynamically set based on the type of GitHub event that triggers the workflow. For instance, it is set to "dev" for pull requests, "qa" for pushes to the main branch (excluding tags), and "prod" for tagged pushes, indicating the build target environment.
- `LOWERCASE_REPO`: The lowercase name of the GitHub repository. This variable is crucial for naming conventions in Docker images and repositories, which often require lowercase. It is generated by converting the repository name from the GitHub context to lowercase, ensuring compatibility with Docker and other systems that might be case-sensitive.
- `GITHUB_ENV`: A special GitHub Actions environment file that allows you to set environment variables for use in subsequent steps of the same job. When you write to this file (using the echo command with redirection, for example), the environment variable is available to every subsequent step in the job. This is used to dynamically set and pass variables like ENVIRONMENT and LOWERCASE_REPO across different steps within the job, ensuring that actions such as building and pushing Docker images can use the most current and relevant environment settings.



#### Workflow Steps 

1. **Get name for ECR repo:**
   - Action: `echo "LOWERCASE_REPO=$(echo ${{ github.event.repository.name }} | tr [A-Z] [a-z])" >> $GITHUB_ENV`
   - Purpose: This step dynamically generates the lowercase name of the GitHub repository and assigns it to the LOWERCASE_REPO environment variable. It is used to ensure the Docker image name conforms to naming conventions that may require lowercase.

2. **if DEV, set dev variables:**
   - Action: `echo "ENVIRONMENT=dev" >> $GITHUB_ENV;`
   - Purpose:  Sets the ENVIRONMENT variable to dev for Docker image builds triggered by pull requests. This indicates that the build is intended for the development environment.

3. **if QA, set qa variables:**
   - Action: `echo "ENVIRONMENT=qa" >> $GITHUB_ENV;`
   - Purpose:  Configures the ENVIRONMENT variable to qa for Docker image builds triggered by pushes to the main branch (excluding tags). This denotes that the build targets the QA (Quality Assurance) environment.

4. **if PRD, set PRD variables:**
   - Action: `echo "ENVIRONMENT=prod" >> $GITHUB_ENV;`
   - Purpose: Adjusts the ENVIRONMENT variable to prod for Docker image builds triggered by tag pushes. This specifies that the build is meant for the production environment. Note: In your template, it says "if PROD," but in your request, you wrote "if PRD." For consistency with your template, I used "PROD."

5. **Generate Docker Metadata:**
   - Action: `docker/metadata-action@v5`
   - Purpose: Utilizes the docker/metadata-action@v5 to generate metadata for the Docker image, including tags derived from the SHA, PR, branch, or tag events. This metadata is crucial for versioning and tracking the Docker image across different environments.

5. **Login to LIGHT AWS ECR:**
   - Action: `docker/login-action@v3`
   - Purpose: Authenticates with LIGHT AWS ECR using the provided username and token. This step is essential for pushing the Docker image to the repository securely.
   - To login you will need to complete the [Prerequisites](./Prerequisites.md). Please do so before proceeding!

6. **Build and Push Docker Images:**
   - Action: `docker/build-push-action@v4`
   - Purpose: Builds the Docker image based on the generated metadata tags and pushes the image to the configured Docker registry. This automates the deployment of new or updated Docker images to the appropriate environments.

note: `provenance: false` This option controls whether or not to include provenance information when building and pushing Docker images. Provenance information in the context of Docker images refers to metadata that describes the origin and history of an image, including details about how it was built, its layers, and any dependencies. It can be useful for tracking the authenticity and security of an image, especially in situations where you need to ensure the image's trustworthiness. In our cluster if you do not include this line the automation may create 'image index' artifacts in our ECR that will cause errors so please ensure you include the line `provenance: false`.

When you set provenance to false, as seen in your code, you are instructing the docker/build-push-action to exclude this provenance information from the Docker image.


### Sha Tag Overview

The **Generate Docker Metadata** step in our GitHub Actions workflow template uses the `docker/metadata-action@v5` to create Docker tags based on certain events and attributes. The configuration provided in your workflow will result in the generation of the following types of Docker tags:

#### SHA Tags:

- Tags prefixed with `sha-`, including the full SHA of the commit. This provides a unique identifier for every commit.
- Short SHA tags prefixed with `sha-`, which are shorter versions of the full SHA tags for convenience and readability.

#### Environment-SHA Tags:

- These tags include the environment name (`dev`, `qa`, `prod`) followed by `-sha-` and the short SHA of the commit. For example, a tag for a development environment might look like `dev-sha-abc123`.

#### Pull Request (PR) Tags:

- Tags generated for pull requests. These are useful for identifying images built from PRs.

#### Branch Tags:

- Tags that correspond to the name of the branch for non-tag pushes. This allows for easy identification of images built from specific branches.

#### Sha Tag Pattern Breakdown:

- For pushes that include tags, the tag itself will be used as the Docker tag. This is particularly useful for production releases and versioning.

Here’s a breakdown of the tag types and their formats as specified in your workflow:

- `type=sha,prefix=sha-`: Full SHA of the commit prefixed with `sha-`.
- `type=sha,prefix=sha-,format=short`: Shortened SHA of the commit, also prefixed with `sha-`.
- `type=sha,prefix=${{ env.ENVIRONMENT }}-sha-,format=short`: The environment name followed by `-sha-` and the short SHA. The environment is dynamically set based on the event that triggered the workflow.
- `type=ref,event=pr`: Tags for pull requests.
- `type=ref,event=branch`: Tags that reflect the branch name for branch pushes.
- `type=ref,event=tag`: Tags that directly use the git tag for tag pushes.

This configuration ensures that the Docker images built and pushed by this GitHub Actions workflow can be accurately identified and tracked across different environments and development stages, based on the nature of the git action that triggered the build. 

**Note: The sha pattern output by your GitHub actions file MUST match the pattern you declare in your Kubernetes deployment file that you are about to write in order for our automation to properly detect changes in your build and automatically deploy them for you.**


### References 

See the official documentation around GitHub Actions [here](https://docs.github.com/en/actions)

See official docker build-push-action documentation [here](https://github.com/docker/build-push-action?tab%253Dreadme-ov-file#inputs)


## Kubernetes 

Kubernetes, often abbreviated as K8s, is an open-source platform designed to automate deploying, scaling, and operating application containers. It groups containers that make up an application into logical units for easy management and discovery. Kubernetes scales with your application's needs, manages resources efficiently, and integrates with the CI/CD pipeline. 

See the official Kubernetes Documentation here: [Kubernetes Documentation](https://kubernetes.io/docs/home/)


### **Creating your Kubernetes namespace file** 

The next step towards getting your solution deployed is creating your `namespace.yaml` file. This file is where you define your namespace and give it a unique name. Create the namespace file in the `<project-name>-dev` folder you just created.

namespace.yaml Template:
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
    app.lilly.com/cloud-browser-auth: <authconfigs> #optional
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
| `<dev-group>`    |  String that represents the AD group you would like to have read only access to your namespaces resources in the Argo Dashboard|
| `<admin-group>`  | String that represents the AD group you would like to have Admin access to your namespaces resources in the Argo Dashboard|

Note: Remember to remove the angle brackets (\<\>) when replacing the placeholder values. Additionally, this template assumes you are using the apps/v1 API version for the Deployment resource.


<br />

#### 1. labels: explained 

`cost-center:` - This label maps your namespace to your area's cost center. This is used by our kubecost solution to congregate namespaces into large groups to better understand how many resources each group is using.


<br />

#### 2. annotations: explained 

`app.lilly.com/compute:`

There are two types of compute supported. The primary type is Fargate. The second type is AWS EC2 instances. To configure your namespace to use Fargate / EC2 instances, you must place the annotation: `app.lrl.lilly.com/compute` with a value of either 'serverless' to allow using only Fargate OR 'hybrid' to allow using both EC2 or Fargate. 

NOTE: If you chose hybrid you must label your containers to allow them to run on Fargate, while if you chose serverless all your containers will run on Fargate without special config. 

A more detailed explanation can be found [here](/guide/ComputeAndWorkloadScheduling).


<br />

`app.lilly.com/cloud-browser-auth:`

This allows setting s3 auth roles for s3 resources associated with the associated namespace.

The value for this annotation is a JSON object in string format.  The simplest config allows setting a list of users providing read only access to the default S3 path for this namespace.  This default bucket / S3 prefix path will be 's3://lly-light-prod/namespace-name/'

```yaml
annotations:
  app.lrl.lilly.com/cloud-browser-auth: '{"authConfigs": [{ "users": ["A123456", "B7891011"]}]}'
```

A more detailed explanation can be found [here](/guide/CloudBrowser).


<br />

`app.lilly.com/sg-rule:`

This is an optional annotation that outlines the interface you will populate in order to apply specific ingress and egress rules to your namespace. These rules will then apply to all resources within your namespace.

ingress rules interface:
```yaml
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
 

 For more detailed information on the security group rule annotation, see our extensive documentation [here](/guide/Namespace#sg-rule-interface-template).
 For a detailed Architecture diagram of how the security groups are handled in CATS, see our diagram [here](https://github.com/EliLillyCo/LRL_light_k8s_infra_apps/blob/main/docs/security_group_controller.svg).
 

<br />

`app.lilly.com/argo.config:`

This is a required annotation that ensures configuration of permissions for the Argo CD dashboard based off of the AD groups you assign to both the Read-Only section and the Admin section. Configure this by customizing and managing your own AD groups that contain your project's developers or users. 

Whenever you make an initial deployment, that task is handled by [Argo CD](/guide/Argo). Later on you will configure annotations related to Flux. [Flux](/guide/Flux) handles the continuous deployment of resources via sha diffs in the AWS ECR. This ensures updates to your container's image are automatically identified and rolled out quickly. 

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

***

### **Creating your Kubernetes deployment file** 


Final step, and this one is the most challenging step, you will need to create a `deploy.yaml` file which describes the application that you want to deploy in Kubernetes. This yaml configuration file is what is used for the instructions on how to deploy your application, what resources it needs, and where to get your Docker image from. 

For most solutions, this `deploy.yaml` file, along with your `namespace.yaml` file, will be the only two resources needed by the CATS app repository under `projects/dev/<project-name>-dev/` to get your web application fully deployed and functional on CATS. 

Luckily we have plenty of examples for you to look through to help with creating your deployment configuration. E.g. [nextjs](https://github.com/EliLillyCo/LRL_light_k8s_infra_apps/tree/main/projects/dev/light-app-poc-dev/example-next-js).  


Template for a Kubernetes deployment file in YAML

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

---
# Define a Service
apiVersion: v1
kind: Service
metadata:
  name: <service-name>
  namespace: <namespace-name>
spec:
  selector:
    app: <app-label>
  ports:
    - protocol: TCP
      port: <service-port>
      targetPort: <container-port>

---
# Define an Ingress
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: <ingress-name>
  namespace: <namespace-name>
spec:
  rules:
    - host: <ingress-host>
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: <service-name>
                port:
                  number: <service-port>

```

You need to replace the placeholder values with your desired configurations. Here's an explanation of the placeholders:

| Placeholder                        | Description                                       |
|------------------------------------|---------------------------------------------------|
| `<namespace-name>`                 | The name of your namespace.                       |
| `<deployment-name>`                | The name of your deployment.                      |
| `<app-label>`                      | A label to identify your application.             |
| `<aws-account-number>`             | Default to "283234040926" for AWS Prod Cluster.   |
| `<your-repo-name-in-ecr>`          | The name of your repository in AWS ECR            |
| `<policy-name>`                    | A unique policy name within your namespace. Chosen by you. It is arbitrary. Avoid special characters. |
| `<tag-pattern`                     | This is where you declare the sha tagging pattern you are using in your git workflow file. Example: "sha-.*" |
| `<replica-count>`                  | The number of replicas you want to run.           |
| `<container-name>`                 | The name of your container within the pod.        |
| `<container-image>`                | The image for your container (e.g., your-registry/your-image:tag). |
| `<container-port>`                 | The port on which your container listens.         |
| `<additional-container-configuration>` | You can add any additional container configuration (e.g., environment variables, volumes, etc.). |
| `<additional-pod-configuration>`       | You can add any additional pod-level configuration (e.g., volumes, secrets, etc.).               |
| `<service-name>`                       | The name of your service.                                                                        |
| `<service-port>`                       | The port on which your service listens.                                                          |
| `<ingress-name>`                       | The name of your ingress resource.                                                               |
| `<ingress-host>`                       | The host/domain associated with your ingress. See Ingress Route Information below for more details.     |


Note: Remember to remove the angle brackets (\<\>) when replacing the placeholder values. Additionally, this template assumes you are using the apps/v1 API version for the Deployment resource.
<br />

#### Container Image Explanation: 
You can find the name of your image by following these steps.
1. Navigating to your repository and go to the Actions Tab
2. Select the workflow the is building your desired image and open it.
3. Click on the button that has a green checkmark and is labeled `build`
4. Expand the section labeled `build and push docker image`
5. Scroll through the logs and look for a line that says something like this: `writing image sha256:a1fa199272cae6ec8747f905aa5624666be61e38db0aff5b9e2763f07df072d8 done` this is the default name of your image. This is not what you want to use. You want to use the Image name that matches the tag that you define in your workflow file. so something like `sha-e10271b` or `qa-sha-e10271b`. This is your `<image sha tag>` Here is an example of an actual image that is being deployed:  `283234040926.dkr.ecr.us-east-2.amazonaws.com/lrl_light_k8s_infra_apps_docs:dev-sha-e10271b`

For docker images built with the above automation, check the github actions build to see the docker image URL.  The image URL will always start with ```283234040926.dkr.ecr.us-east-2.amazonaws.com/<your-lower-case-repo-name>:<your-image-tag>```. See example [here](https://github.com/EliLillyCo/LRL_light_k8s_infra_apps/blob/5a408520d8c2225b65a067f5d3ffb1da52675b3b/projects/dev/abarp-dev/deploy.yml#L20).


If using generic images (e.g. pgadmin) use Artifactory to avoid DockerHub rate limiting. E.g. `pgadmin:4` becomes `elilillyco-lilly-docker.jfrog.io/pgadmin:4`. You also need to make sure that an entry for the image is present in [allowed images](https://github.com/EliLillyCo/LRL_light_k8s_infra_apps/blob/main/validation/allowed_images.yaml).


#### note on `glob:<pattern>`

Please note that for Flux V1 glob patterns were supported. However now in Flux V2, the pattern expected in the flux.simple annotation is a regex pattern. This is a known change in Flux V2. We encourage all app teams to use the `-.*`. We may change the nomenclature to clarify confusion in a future release.

Historically users deployed images with the sha pattern declared in their workflow file example: `dev-sha-.*`. Now that we have moved to Flux V2 this pattern needs to be updated in the annotation to `dev-sha-.*`

#### Annotations Explanation: 
The following lines enable flux to automatically find your latest image in the ECR and deploy it to a new pod. If the deployment is successful the old pod will be deleted and a seamless transition between the two images will happen. If you did not make any changes when implementing the git actions automation code above, then the pattern `sha-.*` should work out of the box:


```yaml
  annotations:
    app.lilly.com/flux.automated: "true"
    app.lilly.com/flux.simple.<policy-name>: "<aws-account-number>;<your-repo-name-in-ecr>;glob:<tag-pattern>"
    # Example: app.lilly.com/flux.simple.docs-policy: "283234040926;lrl_light_k8s_infra_apps_catsdocs;glob:sha-.*"
    wave.pusher.com/update-on-config-change: "true"
```

`<aws-account-number>` - Default to "283234040926" for AWS Prod Cluster. You may use a different account number if you are pulling from a non CATS AWS Account's ECR. It is possible to pull your solutions image from any ECR... BUT if you do that the CATS Support team is severely  limited in our ability to troubleshoot issues that may arise. We **HIGHLY** suggest pushing your image to the CATS PRD Account `283234040926`.

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

The pattern expected in the `flux.simple` annotation is a regex pattern. This is a known change in Flux V2. We encourage all app teams to use the `-.*` pattern until we have a better solution in place. 

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

#### Ingress Route Information

There are three types of ingress routes available on the CATS Platform

1. `*.apps.lrl.lilly.com` - This is a **browser based route** that allows a user to be on or off the lilly network and requires the user to authenticate upon accessing.

2. `*.apps-internal.lrl.lilly.com` - This is a **browser based route** that requires a user to be on the lilly network but does not force the user to authenticate. 

3. `*.apps-api.lrl.lilly.com` - This is a **programmatic / script based route**. If you are accessing an endpoint in CATS via a script, you will need to target this route. This route is not set up for browser based access. If you access an endpoint on this route via your browser, you will get an "invalid token" response. 

Customize the host based off of deployment environment with help from the table below: 

| top domain           |  Route            |        DEV Cluster            |        QA Cluster             |              PROD Cluster   |
|----------------------|-------------------|-------------------------------|-------------------------------|-----------------------------|
| lrl.lilly.com        |  Authenticated    |  *.apps-d.lrl.lilly.com            |  *.apps-q.lrl.lilly.com            |  *.apps.lrl.lilly.com            |
| lrl.lilly.com        |  Un-Authenticated |  *.apps-internal-d.lrl.lilly.com   |  *.apps-internal-q.lrl.lilly.com   |  *.apps-internal.lrl.lilly.com   |
| lrl.lilly.com        |  API Route        |  *.apps-api-d.lrl.lilly.com        |  *.apps-api-q.lrl.lilly.com        |  *.apps-api.lrl.lilly.com        |

For full information on how to configure your ingress based off of route type and cluster you are deploying in see our [docs here](./Ingress.md#out-of-the-box-options). 

#### Resource Name Configuration: 
Resource names should not contain environment suffixes (dev, qa, prd), unless there is a really good reason for those. These are implicitly contained in namespace names. Convention for namespaces is enforced by validation.

The above templates are the very minimum required for a deployment. Depending on your solution you may need to include additional fields or make customized changes. Please see the [Deployment Configuration](/guide/Deployment) Section on our DocSite for more extensive details around configuring deployment resources.


## Dashboards

Now that you have finished staging your deployment the automation is working in the background to bring your solution online. Head on over to our [Dashboards Section](./DeploymentDashboard.md) to find a variaty of dashboards available for troublshooting issues and monitoring logs, cost, and resource health. 

## Continuous Deployment 

Now that you have added in your Kubernetes config file it should be deployed immediately via Argo CD, *give or take a few minutes for the resources to start up on Fargate*.

Once that happens the magic of automation kicks in! Now anytime that you push an updated docker image tag with a new version to the ECR, Flux will automatically identify the new image and deploy that image for you! Flux's automation will even update your Kubernetes yaml config showing you which specific image tag is currently deployed.

The only thing you need to worry about now is defining your own release cycle management for your application. One recommendation is to follow the [GitHub Flow](https://guides.github.com/introduction/flow/) pattern.


## CODEOWNERS

You can use our CODEOWNERS file to define individuals or teams that are responsible for code in a repository.

Code owners are automatically requested for review when someone opens a pull request that modifies code that they own. Code owners are not automatically requested to review draft pull requests.

See our [Docs](./Codeowners.md) on setting up CODEOWNERS in CATS! 

## Developing more complex Kubernetes Infrastructure 

Our main cluster infra_apps, has many restrictions as it must fulfil production requirements to allow use of real data & has more guarantees of stability.  If you are developing complex Kubernetes infrastructure, this slows development significantly.  To solve this, we have another cluster deployed into a DEV AWS account.  This cluster has no stability guarantees (may be wiped at any time), but gives full flexibility to developers & full admin access to the cluster. The Dev cluster is the location that the Platform team does development work in. This can cause issues for application teams who are trying to deploy new solutions while the Platform team is working on new features for users! 

When possible please do you development in the production cluster, [infra_apps](https://github.com/EliLillyCo/LRL_light_k8s_infra_apps)

To access the cluster via terminal, you must have a [-CA account](https://elilillyco.stackenterprise.co/articles/481) & be a member of the  ```aws_light_devs``` group (request in myaccess).

Follow this guide to setup Lilly AWS Auth on your local machine (this allows local machine AWS account login): https://github.com/EliLillyCo/lrl-cloud-patterns/wiki/Lilly-AWS-Accounts#aws-cli-httpsgithubcomelilillycolilly_aws_auth

Follow this guide to access the cluster: https://github.com/EliLillyCo/lrl-cloud-patterns/wiki/Lilly-AWS-Accounts#accessing-the-light-account-for-infra-development

Once you have done this, you will have full kubectl access to each cluster with the role designated in the matrix below:
|Cluster | Role |
|-------|-------| 
|[Production Cluster](https://github.com/EliLillyCo/LRL_light_k8s_infra_apps) | Read-Only | 
|[QA Cluster](https://github.com/EliLillyCo/LRL_light_k8s_infra_apps_qa) | Read-Only |
|[Development Cluster](https://github.com/EliLillyCo/LRL_light_k8s_infra_apps_test) | Read-Only |



