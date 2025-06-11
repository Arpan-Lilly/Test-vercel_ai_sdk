
# Helm Release 
This documentation describes how to create a helm release Kubernetes resource. 

This resource specifies various parameters for the release, including the source of the Helm chart, the release name, and custom values for the chart.


## What is a Helm Release 

A Helm release is a concept in Helm, a package manager for Kubernetes, used for deploying and managing applications or services on a Kubernetes cluster. It represents a specific instance or deployment of a Helm chart, which is a collection of pre-configured Kubernetes resources (such as pods, services, config maps, and more) packaged together. A Helm chart describes how to deploy a particular application, including its dependencies and configuration.

**Key components of a Helm release include:**

***Release Name:*** A user-defined name that identifies the specific instance of the application or service deployed using the Helm chart. The release name is used to manage and track the release.

***Chart:*** The Helm chart that provides the application's configuration, Kubernetes resources, and other necessary information. When you create a Helm release, you specify the chart you want to use. This chart is stored in a github repository and pointed to via the Helm Release Kubernetes resource definition we create. Template below.

***Values:*** Custom configuration options and values that can be passed to the Helm chart to customize the behavior and settings of the deployed application. Values are typically defined in a values file within the Helm Chart or provided directly when installing the chart.

***Namespace:*** The Kubernetes namespace where the Helm release and its associated resources are created. This allows you to isolate and manage different releases in separate namespaces.

***Release Status:*** Helm tracks the status of each release, indicating whether it is in a deployed, failed, or deleted state, among others.



## Configuration Template 
Config Template:
```yaml

apiVersion: helm.fluxcd.io/v1
kind: HelmRelease
metadata:
  name: your-app-helm
  namespace: your-app
spec:
  releaseName: your-app-release-name
  chart:
    git: https://github.com/EliLillyCo/helm-chart-repo-location.git
    ref: 09478598234             // Update hash to your hash
    path: charts/your-chart/     // Update Path
    secretRef:
      name: your-secret-name
  values:
    image:
      ecrBase: 283234040926.dkr.ecr.us-east-2.amazonaws.com // CATS prod account
      repository: your-repo
      tag: latest
    ingress:
      annotations: 
        // add security groups here if neccessary| example: 'lilly.com/security_groups': '[{"Route":"/.*", "ADGroups": ["global_research_it_all", "lrl_cats_access_non_rids", "SPE_Research_Global_Cherba"]}]',
        // add info headers here if necessary| example: 'lilly.com/user_info_headers': '[{"attribute": "id", "header": "X-WEBAUTH-USER"}, {"attribute": "name", "header": "X-USER-NAME"}, {"attribute": "email", "header": "X-WEBAUTH-EMAIL"}, {"attribute": "groups", "header": "X-WEBAUTH-GROUPS"}]',

```


**Here's a breakdown of the HelmRelease resource:**


| Field         | Description                                                                           |
| ------------- | ------------------------------------------------------------------------------------- |
| `apiVersion`  | Specifies the API version for HelmRelease, which is `helm.fluxcd.io/v1`.              |
| `kind`        | Defines the kind of resource, which is `HelmRelease`.                                 |
| `metadata`    | Contains metadata for the HelmRelease resource, including the name and namespace.     |
| `name`      | Name of the HelmRelease resource. Customize as needed.                                  |
| `namespace` | Namespace in which the HelmRelease will be deployed. Customize as needed.               |
| `spec`        | Describes the specifications for the Helm release.                                    |
| `releaseName` | Name for the Helm release. Customize as needed.                                       |
| `chart`     | Defines the source of the Helm chart and its location.                                  |
| `git`     | Specifies the Git repository URL where the Helm chart is located.                         |
| `ref`     | Specify the Git branch, commit hash, or reference for the chart. Update with the desired reference. |
| `path`    | Indicates the directory path within the Git repository where the Helm chart is located.   |
| `secretRef` | Specifies the name of the secret  that contains the credentials to access the Git repository. This is important for private repositories. |
| `values`     | Allows you to set custom values for the Helm chart.                                    |
| `image`  | Specifies custom values for the chart, particularly related to container images.           |
| `ecrBase` | Base URL of the Amazon Elastic Container Registry (ECR) where container images are hosted. example is CATS production aws account |
| `repository` | Name of the ECR repository for your application's container images.                    |
| `tag`   | Specifies the container image tag to use, which is 'latest' in this example.                |
| `ingress`  | Configures settings related to Kubernetes Ingress.                                       |
| `annotations` | Adds annotations to the Ingress resource.                                             |


This HelmRelease resource is responsible for deploying the specified Helm chart from the specified Git repository with the defined configurations. Make sure that the Git repository and path are correctly set up, and the secret contains the necessary credentials to access the Git repository where the chart is stored. Additionally, ensure that the Helm chart in the Git repository is available and compatible with your Kubernetes cluster and Helm version.


## Git Mirror 

Setting up a Git mirror is needed when the Helm Chart is located in a private repository. For Helm charts setting up a Git Mirror is typically done using a GitOps tool like Flux, which is used for managing Kubernetes resources and Helm releases in a GitOps fashion. A Git mirror is essentially a copy of a Git repository that's kept in sync with the source repository. This can help improve reliability and performance when deploying applications from Git repositories. To set up a Git mirror for Helm charts, you can follow these general steps:

**Git Mirror Configuration:** In your GitOps tool's configuration, you'll specify the Git mirror settings for your Helm charts. In the case of Flux and Helm Operator, you typically include this information in the HelmRelease resource.

***Git Section:*** This specifies the URL of your Git repository (the source) and the desired path to the charts.

***Git Mirror Secret:*** If your source Git repository is private, you may need to provide credentials to access it. You can create a Kubernetes secret containing your Git credentials (SSH key or personal access token), and then reference this secret in your GitOps tool's configuration.


## Deploying via Helm Release in CATS

*TODO: coming soon* 