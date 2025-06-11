# Configuration Overview

The configuration section is all about helping our users configure their deployment resources appropriately for their projects. See the below table of contents for a quick look at the sections available as well as what information is in each section:


| Section                                    | Description |
|--------------------------------------------|-------------|
| [**Namespace**](./Namespace.md)                 | Discuss what is a namespace as well as the labels and annotations used to configure a namespace correctly. IAM permissions and Cluster Security Groups are handled via namespace configuration. |
| [**Deployment**](./Deployment.md)                 | Discuss what a deployment is and how to configure a deployment resource for your specific solution.  |
| [**Service**](./Service.md)                 | Discuss what is a Service is and how it maps to an ingress.  |
| [**Ingress**](./Ingress.md)                 | Discuss what is an Ingress is, how to configure an ingress for your solution, and Routing, Authorization and Authentication within the cluster. |
| [**Compute and Workload Scheduling**](./ComputeAndWorkloadScheduling.md)                                | Covers the two types of compute supported: Fargate and AWS EC2 instances, including how to configure namespaces for each. |
| [**Scaling**](./Scaling.md)                                | Discusses horizontal scaling for pod replicas related to deployments or stateful sets. |
| [**Storage**](./Storage.md)                                | Discusses the options available for storing data such as S3, EFS, or EBS. |
| [**Cron Job**](./CronJob.md)                               | Explains CronJobs in Kubernetes for scheduling jobs. |
| [**Jobs**](./Jobs.md)                                   | Describes how Jobs manage Pods to completion, including an example Job configuration. |
| [**Rate Limit**](./RateLimit.md)                                   | Describes how to control the Number of Requests Going to a Service |
| [**External Secrets**](./ExternalSecrets.md)                       | Introduces the concept of managing secrets externally, not directly within Kubernetes. |
| [**Helm Release**](./HelmRelease.md)                           | Describes creating Helm release resources for managing applications or services on Kubernetes. |
| [**Graph User Info**](./GraphUserInfo.md)                        | Explains how to access graph-based user information via a built-in integration in CATS. |
| [**Makefile**](./Makefile.md)                | Discuss what a makefile is and why it is important. Template provided |

