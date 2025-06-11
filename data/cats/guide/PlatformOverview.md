# Platform Overview

To help you embark on your journey with CATS, we offer three separate clusters to application teams:

<br />

## Environments

SBX Environment: [SBX Cluster](https://github.com/EliLillyCo/LRL_light_k8s_infra_apps_sbx)

Development Environment: [DEV Cluster](https://github.com/EliLillyCo/LRL_light_k8s_infra_apps_test)

QA Environment: [QA Cluster](https://github.com/EliLillyCo/LRL_light_k8s_infra_apps_qa)

Production Environment: [PRD Cluster](https://github.com/EliLillyCo/LRL_light_k8s_infra_apps)


The CATS Platform is composed of four Kubernetes clusters, each designed for a specific use case. We recommend that application teams deploy their solutions in the Production Cluster, which offers high stability. Within this cluster, solutions can be organized using folder and namespace suffixes (e.g., namespace-dev, namespace-qa, namespace-prd) for efficient management.

**Please note**: The Development (DEV) Cluster does not come with any stability guarantees. Despite our efforts to stabilize it through the introduction of the Sandbox (SBX) Cluster, the DEV Cluster remains prone to occasional disruptions. The SBX Cluster is exclusively for the CATS Platform Team to carry out platform development, and as a result, it may experience instability due to ongoing work. Platform components are initially developed and tested in the SBX Cluster to reduce the frequency of cluster-breaking changes in the DEV Cluster, though such incidents may still occur.

Both the DEV and SBX Clusters are subject to periodic wipes, downtime, and unforeseen issues. Only the CATS Platform Team should be working in the SBX Cluster.

For most use cases, especially when your application does not require a VPCE (Virtual Private Cloud Endpoint), deploying in the Production Cluster is strongly encouraged due to its higher stability. Please refer to the table below to select the most suitable cluster for your application.

Review the below table to better understand how each application deployment repo maps to a different amazon account on a different VPC. Many users run into VPC issues so please ensure you are developing your solution in the correct environment. See our [documentation on AWS VPCs](./AwsVpc.md) for further detailis on which VPC you may be working with. 

**Different Cluster Details:**

|Cluster | App Deployment Repo | AWS Account Name | AWS Account ID |  VPC Access |
|--------------------|--------------------------------------------------------------------------------|-------------------------------------|--------------|------------------------|
|Production Cluster  | [infra_apps](https://github.com/EliLillyCo/LRL_light_k8s_infra_apps)           | prod-igw-dx-researchit-light        | 283234040926 | vpc-0ea80082460c43671 // vpce-03bee17f69c9802b9 |
|QA Cluster          | [infra_apps_qa](https://github.com/EliLillyCo/LRL_light_k8s_infra_apps_qa)     | qa-igw-dx-researchit-light          | 474366589702 | vpc-0d4e782cbe86eb07c // vpce-058757a9c034d181c |
|Development Cluster | [infra_apps_test](https://github.com/EliLillyCo/LRL_light_k8s_infra_apps_test) | dev-igw-dx-researchit-light         | 408787358807 | vpc-06a3d8f2cdafb8a6e // vpce-069388414a9f87f40 |
|Sandbox Cluster     | [infra_apps_sbx](https://github.com/EliLillyCo/LRL_light_k8s_infra_apps_sbx)   | dev-igw-dx-lrl-researchit-light-sbx | 891377229906 | vpc-06a3d8f2cdafb8a6e // vpce-069388414a9f87f40 |



<br /> 

### Development Cluster for Beginners

For those who are new to CATS and eager to experiment, our **development cluster** is the perfect spot to unleash your creativity as it gives you full flexibility and admin access to the cluster. Get your hands dirty without any fear of breaking things:

- **Explore and Experiment**: Visit the [Apps Test Repo](https://github.com/EliLillyCo/LRL_light_k8s_infra_apps_test) to start playing around in a safe, isolated environment.

> :warning: **IMPORTANT**: The playground cluster is inherently unstable and is not intended for production use. Any work you do here may be lost at any time, so be sure to **back up your data locally** before deploying. This ensures that you won't lose your work during any unexpected incidents.

<br />

### QA Cluster for Testing

If you're already acquainted with the basics and ready for quality assurance testing, the **GitHub Repo** is your gateway: [Apps Test QA Repo](https://github.com/EliLillyCo/LRL_light_k8s_infra_apps_qa)

- **Deploy with Confidence**: The QA cluster is an exact copy of the production cluster where you can accurately test your solution without being in the production environment. 

When the CATS platform team schedules platform upgrades, we request our users use the QA cluster to test their solutions against our changes to ensure stability. We provide a **TWO DAY** QA testing window for all updates. 

<br />

### Production Cluster for Official Deployment

If you're already acquainted with the basics and ready for the real action, the official **GitHub Repo** is your gateway: [Apps Repo](https://github.com/EliLillyCo/LRL_light_k8s_infra_apps)

- **Deploy with Confidence**: This is our production cluster so feel confident that it is a secure and stable environment for your solution. 

By setting up these three environments, we aim to provide a seamless and accommodating development experience, regardless of your expertise level with CATS.

<br /> 

### Cross AWS Account Connections

When planning a connection between two AWS accounts the first thing that should be verified is if the accounts are on the same VPC. Below you can find a table that outlines the deployment repo your solution is deployed in on the CATS platform and which AWS account that deployment maps too along with the VPC the AWS account is on.

See our [documentation on AWS VPCs](./AwsVpc.md) for further detailis on which VPC you may be working with.

|Cluster | App Deployment Repo | AWS Account Name | AWS Account ID |  VPC Access |
|--------------------|--------------------------------------------------------------------------------|-------------------------------------|--------------|------------------------|
|Production Cluster  | [infra_apps](https://github.com/EliLillyCo/LRL_light_k8s_infra_apps)           | prod-igw-dx-researchit-light        | 283234040926 | vpc-03bee17f69c9802b9 |
|QA Cluster          | [infra_apps_qa](https://github.com/EliLillyCo/LRL_light_k8s_infra_apps_qa)     | qa-igw-dx-researchit-light          | 474366589702 | vpc-058757a9c034d181c |
|Development Cluster | [infra_apps_test](https://github.com/EliLillyCo/LRL_light_k8s_infra_apps_test) | dev-igw-dx-researchit-light         | 408787358807 | vpc-069388414a9f87f40 |
|Sandbox Cluster     | [infra_apps_sbx](https://github.com/EliLillyCo/LRL_light_k8s_infra_apps_sbx)   | dev-igw-dx-lrl-researchit-light-sbx | 891377229906 | vpc-069388414a9f87f40 |

If the AWS Account housing your AWS Resources is NOT on the same VPC as the AWS account where your solution is deployed, **then you CANNOT communicate between those two accounts**.

There are two solutions if this happens to you.

1. Create a new AWS account that is on one of the thee VPCs that one of the CATS Clusters is on.
2. Re-Deploy your solution to one of the CATS AWS Accounts that has a VPC that maps to your non CATS AWS Account.


In Summary:

- AWS Dev account can only connect to other AWS Dev accounts on the VPC `069388414a9f87f40`.
- AWS QA account can only connect to other AWS QA accounts on the VPC `058757a9c034d181c`.
- AWS Prod account can only connect to other AWS Prod accounts on the VPC `03bee17f69c9802b9`.

## Basic System Services Available

CATS is equipped with a comprehensive suite of services designed to empower our application teams, providing a rich, out-of-the-box experience that facilitates development, deployment, and monitoring. Here's what you can expect:

- **CATS Agent**: The CATS Agent enhances platform operations by combining documentation insights with real-time Kubernetes intelligence. It uses live resource data in the cluster to perform context-aware diagnostics and provide actionable insights, enabling users to troubleshoot and optimize deployments efficiently within the platform.

    - CATS Agent can be found [HERE](https://chat.lilly.com/cortex/chat/spe-platforms-model)

- **CATSbot Virtual Assistant**: The CATSbot is an intelligent chat bot designed to assist users in understanding and utilizing the CATS Platform. 

    - CATSbot can be found [HERE](https://chat.lilly.com/cortex/chat/catsbot)

- **Kubernetes Dashboard**: Gain insights and manage your Kubernetes resources with an intuitive, web-based user interface. This is the most important dashboard for the average user. Please try accessing one of the links below, ***if you do not have access*** to the dashboard you can request access via the [Developer Front Door](https://dev.lilly.com/docs/platforms-and-tools/cats/). After being added to the group it will take around 24 hours for the changes to be reflected on your end. 


    - [Production Environment Dashboard](https://k8s-dashboard.apps.lrl.lilly.com/)
    - [QA Environment Dashboard](https://k8s-dashboard.apps-q.lrl.lilly.com/)
    - [Dev Environment Dashboard](https://k8s-dashboard.apps-d.lrl.lilly.com/)

- **Ingress Dashboard (Traefik)**: Simplify the management of external access to your services with a versatile Ingress controller, featuring a user-friendly dashboard for easy configuration.

    - [Production Environment Dashboard](https://traefik-dashboard.apps.lrl.lilly.com/dashboard/#/)
    - [QA Environment Dashboard](https://traefik-dashboard.apps-q.lrl.lilly.com/dashboard/#/)
    - [Dev Environment Dashboard](https://traefik-dashboard.apps-d.lrl.lilly.com/dashboard/#/)

- **GitOps (Automated CI/CD via Argo )**: Embrace the principles of GitOps for continuous integration and deployment, automating your pipeline for increased efficiency and reliability.

    - [Production Environment Dashboard](https://argocd.apps.lrl.lilly.com/)
    - [QA Environment Dashboard](https://argocd.apps-q.lrl.lilly.com/)
    - [Dev Environment Dashboard](https://argocd.apps-d.lrl.lilly.com/)

- **Metrics Dashboard (Grafana/Prometheus)**: Monitor your application's health and performance with detailed metrics visualized through Grafana, powered by Prometheus's robust monitoring capabilities.

    - [Production Environment Dashboard](https://metrics.apps.lrl.lilly.com/dashboards)
    - [Qa Environment Dashboard](https://metrics.apps-q.lrl.lilly.com/dashboards)
    - [Dev Environment Dashboard](https://metrics.apps-d.lrl.lilly.com/d/2LaqbJ0Zk/k8s-app-team-cost-and-resource-overview?orgId=1&refresh=5m)

- **Logging Dashboard (OpenObserve)**: Access and analyze logs from your applications and infrastructure in one centralized dashboard, enhancing observability.

    - [Production Environment Dashboard](https://logging.apps.lrl.lilly.com/web/)
    - [QA Environment Dashboard](https://logging.apps-q.lrl.lilly.com/web/)
    - [Dev Environment Dashboard](https://logging.apps-d.lrl.lilly.com/web/)

- **Cost Monitoring (Kubecost)**: Keep your cloud expenses in check with detailed insights into your Kubernetes costs, helping you optimize resource allocation and spending.

    - [Dev Environment Dashboard](https://kubecost.apps-d.lrl.lilly.com/allocations)
    - [Qa Environment Dashboard](https://kubecost.apps-q.lrl.lilly.com/allocations)
    - [Production Environment Dashboard](https://kubecost.apps.lrl.lilly.com/allocations)

- **S3 UI Tool (CloudBrowser)**: Interact with AWS S3 buckets effortlessly using CloudBrowser, a graphical interface that streamlines storage management.

    - [Production Environment Dashboard](https://cloud-browser.apps.lrl.lilly.com/)
    - [QA Environment Dashboard](https://cloud-browser.apps-q.lrl.lilly.com/)
    - [Dev Environment Dashboard](https://cloud-browser.apps-d.lrl.lilly.com/)

- **Auto Resource Deployer (Crossplane)**: Automate the deployment of cloud resources across multiple providers with Crossplane, simplifying cloud-native application management.

    - Additional Documentation on Crossplane: [HERE](https://www.crossplane.io/)

- **Authentication Service (Bouncer)**: Secure your applications with Bouncer, providing robust authentication services to safeguard access.

    - Bouncer Repository Source Code located: [HERE](https://github.com/EliLillyCo/LRL_light_k8s_infra_go_bouncer)

- **Restful SDK**:
    - **Python Light Client Service**: Integrate your Python applications seamlessly with our platform using the lightweight client SDK.
        - Library is located [HERE](https://client-python.apps.lrl.lilly.com/)
    - **R Light Client Service**: Leverage the R language for statistical computing and graphics with our easy-to-use client SDK.
        - Library is located [HERE](https://client-r.apps.lrl.lilly.com/)

Each service is designed to enhance your productivity and streamline your operations, ensuring you have the tools you need to succeed. Embrace the full potential of CATS and transform your application development and deployment processes.

