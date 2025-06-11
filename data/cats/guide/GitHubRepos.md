# **GitHub**
The source code for CATS is spanned across multiple GitHub repositories. Check out the list of repositories [here.](https://github.com/orgs/EliLillyCo/teams/lrl_light_k8s_infra_write/repositories)

Access is controlled through GitHub Team memberships.  See https://github.com/EliLillyCo/LRL_light_k8s_infra_apps_docs/blob/main/docs/guide/GitHubTeams.md for more details. 

## Application Deployment Repos

| Environment | Repository | Description |
| --- | --- |---|
| Development | [LRL_light_k8s_infra_apps_test](https://github.com/EliLillyCo/LRL_light_k8s_infra_apps_test) | Application deployment repo that allows customers to deploy their solutions into our Dev Cluster |
|QA | [LRL_light_k8s_infra_apps_qa](https://github.com/EliLillyCo/LRL_light_k8s_infra_apps_qa) |  Application deployment repo that allows customers to deploy their solutions into our QA Cluster |
| Production | [LRL_light_k8s_infra_apps](https://github.com/EliLillyCo/LRL_light_k8s_infra_apps) | Application deployment repo that allows customers to deploy their solutions into our PRD Cluster  |

<br />

## Platform Infrastructure Repos

The following list of github repositories contain parts of the CATS infrastructure in some way or another. 


| Repository URL | Description |
| -------------- | ----------- |
| [LRL_light_k8s_infra](https://github.com/EliLillyCo/LRL_light_k8s_infra) | **Main infrastructure code for CATS**. Largest repo that majority of source code is housed in. Likely references other repos with smaller components.  |
| [LRL_light_k8s_infra_apps_docs](https://github.com/EliLillyCo/LRL_light_k8s_infra_apps_docs) | Contains the source code for this Docs Site! |
| [LRL_light_k8s_infra_CATSbot](https://github.com/EliLillyCo/LRL_light_k8s_infra_CATSbot) | This repository contains automation that periodically retrains the CatsBot using updated content from the Cats Documentation Repository. By continuously aligning with the latest changes on the documentation site, the bot is able to provide users with accurate and current information. |
| [LRL_light_k8s_infra_app_client_python](https://github.com/EliLillyCo/LRL_light_k8s_infra_app_client_python) | Python-based client libraries for interacting with Kubernetes apps in the Light infra. |
| [LRL_light_k8s_infra_app_client_r](https://github.com/EliLillyCo/LRL_light_k8s_infra_app_client_r) | R-based client libraries for Kubernetes applications on the Light infrastructure. |
| [LRL_light_k8s_infra_apps_validator](https://github.com/EliLillyCo/LRL_light_k8s_infra_apps_validator) | Will contain tools and automation scripts designed to validate applications within the Light Kubernetes infrastructure. This validation process includes automated tests, configuration checks, and compliance verifications, ensuring each application meets the required standards before deployment. By continuously monitoring and validating applications, this repository helps maintain quality, stability, and compliance across the Kubernetes environment. In Development still. |
| [LRL_light_k8s_infra_go_bouncer](https://github.com/EliLillyCo/LRL_light_k8s_infra_go_bouncer) | Bouncer is an authorization service that uses Microsoft Graph & K8s to provide easy authorization for microservice applications. This version is written in GO. |
| [LRL_light_k8s_infra_bouncer](https://github.com/EliLillyCo/LRL_light_k8s_infra_bouncer) | Deprecated - Original Bouncer Service that handled authentication services for the cluster |
| [LRL_light_k8s_infra_credential_service](https://github.com/EliLillyCo/LRL_light_k8s_infra_credential_service) | This repo contains a simple service designed to be deployed as a K8s cron job that periodically pushes ECR temporary docker credentials to the github actions secret store. |
| [LRL_light_k8s_infra_echo](https://github.com/EliLillyCo/LRL_light_k8s_infra_echo) | This repo contains RESTFUL API's to check networking inside of a k8s pod |
| [LRL_light_k8s_infra_healthcheck](https://github.com/EliLillyCo/LRL_light_k8s_infra_healthcheck) | Health-check service for monitoring CATS Kubernetes infrastructure status. |
| [LRL_light_k8s_infra_manager](https://github.com/EliLillyCo/LRL_light_k8s_infra_manager) | This project manages the Light K8s custom infrastructure resources. This includes managing syncing AppRunner with the cluster ingress for external access, managing compute profiles per annotations on the namespace object, and provisioning roles in AWS with connection to k8s. |
| [spe-platforms-agent](https://github.com/EliLillyCo/spe-platforms-agent) | This repo contains the source code for the CATS Platform Agent toolkit server |
| [LRL_cats_argocd_test](https://github.com/EliLillyCo/LRL_cats_argocd_test) | Test configurations for deploying applications using ArgoCD in the CATS environment. |
| [LRL_eks_cert_manager](https://github.com/EliLillyCo/LRL_eks_cert_manager) | cert-manager is a Kubernetes addon to automate the management and issuance of TLS certificates from various issuing sources. It will ensure certificates are valid and up to date periodically, and attempt to renew certificates at an appropriate time before expiry. |
| [LRL_light_aws-smtp-relay](https://github.com/EliLillyCo/LRL_light_aws-smtp-relay) | SMTP server to relay emails via Amazon SES or Amazon Pinpoint using IAM roles. |
| [LRL_light_livedesign](https://github.com/EliLillyCo/LRL_light_livedesign) | This repository contains the CDK stacks to deploy livedesign AWS infrastructure |
| [LRL_light_omics_docs](https://github.com/EliLillyCo/LRL_light_omics_docs) | Documentation and resources for the Omics solution. |
| [LRL_light_security](https://github.com/EliLillyCo/LRL_light_security) |This repository contains python automation code to create LIGHT security controlls. The automation is designed to be idempotent. It will always try to make the AWS Account where it's run match the data domain definitions defined in the repository. |
| [LRL_light_traefik-forward-auth](https://github.com/EliLillyCo/LRL_light_traefik-forward-auth) | A minimal forward authentication service that provides OAuth/SSO login and authentication for the traefik reverse proxy/load balancer. |
| [aws-efs-csi-pv-provisioner](https://github.com/EliLillyCo/aws-efs-csi-pv-provisioner) | Kubernetes CSI driver to dynamically provisions Persistent Volumes (PVs) in response to user-requested Persistent Volume Clains (PVCs). Each PV / PVC is a subdirectory on a single, cluster-wide EFS file system. Works in conjunction with the AWS EFS CSI driver. |
| [aws-fsx-ontap-configs](https://github.com/EliLillyCo/aws-fsx-ontap-configs) | Maintain the CF and other configurations for Amazon FSX for ONTAP |
| [crossplane](https://github.com/EliLillyCo/crossplane) | Crossplane configurations for managing cloud-native Kubernetes resources. |
| [crossplane-contrib_provider-aws](https://github.com/EliLillyCo/crossplane-contrib_provider-aws) | This provider-aws repository is the Crossplane infrastructure provider for Amazon Web Services (AWS). The provider that is built from the source code in this repository can be installed into a Crossplane control plane |
| [eks-charts](https://github.com/EliLillyCo/eks-charts) | Helm charts for deploying resources and services on AWS EKS. |
| [flux](https://github.com/EliLillyCo/flux) | Flux GitOps configurations for Kubernetes clusters. |
| [fluxcd-community_helm-charts](https://github.com/EliLillyCo/fluxcd-community_helm-charts) | Community-contributed Helm charts for FluxCD deployments. |
| [fluxcd_flux2](https://github.com/EliLillyCo/fluxcd_flux2) | Flux v2 configurations and controllers for GitOps deployments in Kubernetes. |
| [fluxcd_helm-controller](https://github.com/EliLillyCo/fluxcd_helm-controller) | Helm controller for FluxCD to manage Helm releases in GitOps workflows. |
| [fluxcd_image-automation-controller](https://github.com/EliLillyCo/fluxcd_image-automation-controller) | FluxCD controller for automating container image updates. |
| [fluxcd_image-reflector-controller](https://github.com/EliLillyCo/fluxcd_image-reflector-controller) | Reflects container image metadata for FluxCD automation. |
| [fluxcd_notification-controller](https://github.com/EliLillyCo/fluxcd_notification-controller) | Notification controller for alerting and event-based actions in FluxCD. |
| [grafana-helm-charts](https://github.com/EliLillyCo/grafana-helm-charts) | Helm charts for deploying and configuring Grafana in Kubernetes. |
| [kedacore-charts](https://github.com/EliLillyCo/kedacore-charts) | Helm charts for KEDA, an event-driven autoscaler for Kubernetes. |
| [lrl-aws-tools](https://github.com/EliLillyCo/lrl-aws-tools) | Standard docker tools for AWS & K8s. Collection of AWS tools and utilities used within the LRL infrastructure. |
| [lrl-cloud-browser](https://github.com/EliLillyCo/lrl-cloud-browser) | This repository contains the API and web application for browsing cloud object stores. |
| [lrl-cloud-browser-1](https://github.com/EliLillyCo/lrl-cloud-browser-1) | Deprecated - Legacy version of the LRL cloud resource browser. |
| [lrl-cloud-patterns](https://github.com/EliLillyCo/lrl-cloud-patterns) | This repository is designed to provide guides, templates, and code samples for common cloud patterns in Lilly RIDS. |
| [lrl-cluwe-cli-api-solutions](https://github.com/EliLillyCo/lrl-cluwe-cli-api-solutions) | this repository use to keep api for fsx api via cli access. |
| [lrl-pgadmin](https://github.com/EliLillyCo/lrl-pgadmin) | This repo contains code that extends PG Admin server to securly auto refresh database credentials from a kubernetes environment scoped to named users. This allows secure remote access to postgresql databases isolated in a kubernetes cluster deployment. |
| [openobserve](https://github.com/EliLillyCo/openobserve) | Observability and monitoring resources for Kubernetes clusters. |
| [openobserve-helm-chart](https://github.com/EliLillyCo/openobserve-helm-chart) | Helm chart for deploying OpenObserve observability tools. |
| [prometheus-community-helm-charts](https://github.com/EliLillyCo/prometheus-community-helm-charts) | Helm charts for Prometheus monitoring systems. |
| [FairwindsOps/gemini](https://github.com/FairwindsOps/gemini) | Gemini is a Kubernetes CRD and operator for managing VolumeSnapshots. This allows you to create a snapshot of the data on your PersistentVolumes on a regular schedule, retire old snapshots, and restore snapshots with minimal downtime. |
| [rds_database_creation](https://github.com/EliLillyCo/rds_database_creation)  | This repository contains information on the process as well as the CloudFormation template that is required when restoring a relational database from a backup or a snapshot. This template can also be used for the initial RDS setup. Please note that this would be independent of your application CI/CD pipeline and would only be used for either creating a new DB instance or restoring an RDS instance from snapshot.|
| [elastic_cloud-on-k8s](https://github.com/EliLillyCo/elastic_cloud-on-k8s)   | Elasticsearch              |
| [cert-manager_cert-manager](https://github.com/EliLillyCo/cert-manager_cert-manager) | New Cert Manager           |
| [grafana_mimir?tab=readme-ov-file](https://github.com/EliLillyCo/grafana_mimir?tab=readme-ov-file) | Mimir                      |
| [jaeger_helm-charts](https://github.com/EliLillyCo/jaeger_helm-charts)       | Jaeger                     |
| [grafana-helm-charts/commits/main/](https://github.com/EliLillyCo/grafana-helm-charts/commits/main/) | Promtail + Loki (Old Grafana Helm) |

