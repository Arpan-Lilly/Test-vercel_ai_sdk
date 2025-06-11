# System Service Overview

CATS is equipped with a comprehensive suite of services designed to empower our application teams, providing a rich, out-of-the-box experience that facilitates development, deployment, and monitoring. 

Each service is designed to enhance your productivity and streamline your operations, ensuring you have the tools you need to succeed. Embrace the full potential of CATS and transform your application development and deployment processes.


Use the below table for a quick look at what Services we have available and the purpose of each service. 

| System Service                                      | Description                                                                                                     |
|-----------------------------------------------------|-----------------------------------------------------------------------------------------------------------------|
| [**Argo**](./Argo.md)                               | Auto Deployment Tool. Declarative, GitOps continuous delivery tool for Kubernetes, automating application deployments.               |
| [**Backstage**](./Backstage.md)                     | A developer portal Lilly is utilizing to catalog software assets for re-use, speed up software development with accelerators, and more.   |
| [**Bouncer**](./Bouncer.md)                         | Authentication Service. Provides robust authentication services to secure application access.                                           |
| [**Crossplane**](./Crossplane.md)                   | Auto Resource Deployer. Automates the deployment of cloud resources across multiple providers, simplifying cloud-native application management. |
| [**Self Service Toolkit**](./ClusterSelfServiceToolkit.md)                   | A toolkit that provides easy self-service access and management capabilities for external resources within the cluster |
| [**Flux**](./Flux.md)                               | Auto Deployment Tool. Automates deployment to Kubernetes, monitoring Git repositories for changes and applying them.                 |
| [**Github Repositories**](./GitHubRepos.md)         | Lists all GitHub repositories associated with the platform.                                                     |
| [**Kafka**](./Kafka.md)                             | A powerful distributed streaming platform that facilitates high-throughput, fault-tolerant messaging systems.                |
| [**Karpenter**](./Karpenter.md)                     | A Kubernetes-native node autoscaler that provisions nodes based on workload demands, optimizing cluster efficiency.                |
| [**PGadmin**](./PGAdmin.md)                         | A web-based administration tool for managing PostgreSQL databases deployed on the platform.                                          |
| [**Reloader**](./Reloader.md)                       | A Kubernetes operator that automatically updates pods when changes are made to their `ConfigMaps` and `Secrets`.                |
| [**Restful SDK**](./RestfulSDK.md)                  | Provides lightweight SDKs for integrating Python and R applications with the platform.                                          |
| [**Smarter Device Manager**](./SmarterDeviceManager.md) | Runs as a `DaemonSet` within the cluster, exposing hardware devices (Linux device drivers) to your pods.                    |
| [**Send Emails**](./Emails.md)                      | Enables applications to send emails using configured SMTP services, integrated with your deployments.                      |
| [**Wave**](./Wave.md)                               | Auto Deployment Tool. Enables automatic deployment of apps on secret changes, with a controller to handle updates.           |


## Requesting New Services

We invite you to communicate any requests for system-level services not currently available within our cluster to the CATS Platform Team. To ensure effective prioritization and allocation of our resources, we kindly request the submission of a comprehensive business case alongside endorsements from multiple application teams for each request. This collaborative approach allows us to confirm the broader utility and ensures our efforts are aligned with supporting the collective needs of our users, rather than focusing on singular application teams.

Our goal is to maximize the impact of our work by catering to the requirements that benefit a wide array of teams. We appreciate your understanding and cooperation in providing the necessary details for your requests. 