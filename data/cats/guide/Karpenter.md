# Karpenter

## Overview

Karpenter is an open-source Kubernetes cluster autoscaler designed to automatically adjust cluster capacity based on the workload's needs. It dynamically provisions and scales nodes by considering pod specifications and optimizing for cost, performance, and scheduling efficiency. Unlike traditional Kubernetes autoscalers, Karpenter directly integrates with the cloud provider (in our case AWS) to provision the right instance types and sizes, ensuring that workloads are placed on appropriately scaled infrastructure without manual intervention. This helps improve resource utilization, lower costs, and reduce latency in scaling operations.

[`CLICK HERE`](https://karpenter.sh/docs/) to see the official Karpenter Documentation. 

## Resources
### Ec2NodeClass
Node Classes enable configuration of AWS specific settings. Each NodePool must reference an EC2NodeClass using spec.template.spec.nodeClassRef. Multiple NodePools may point to the same EC2NodeClass. This resource will always be managed by the CATS Platform team as it is analagous to EC2 Launch Templates, which control setting related to node security, allowed AMI images, and networking.

### NodePool
NodePools set constraints on the nodes that can be created by Karpenter and the pods that can run on those nodes. A NodePool can be set to do things like:

 - Define taints to limit the pods that can run on nodes Karpenter creates
 - Define any startup taints to inform Karpenter that it should taint the node initially, but that the taint is temporary.
 - Limit node creation to certain zones, instance types, and computer architectures
 - Set defaults for node expiration

#### Default NodePools
A set of default NodePool resources is made available to all application teams of the CATS platform. These NodePools always select Bottlerocket-enabled Ec2NodeClasses to provide enhanced security for scheduled workloads. Two sets of NodePools are configured, one for general-purpose workloads and another for accelerated (GPU-enabled) workloads. A list of the available configurations is maintained in our [system-services repository here](https://github.com/EliLillyCo/LRL_light_k8s_infra_system_services/tree/main/kube-system/karpenter/NodePool). NodePools prefixed with `system-service` identify the defaults.

#### Custom NodePools
Custom NodePools may be enabled for application teams using our [infrastructure as code Karpenter manifest generator](https://github.com/EliLillyCo/LRL_light_k8s_infra/blob/main/aws/lib/stacks/manifests-karpenter.ts). These requests are handled by the platform team on behalf of application teams. Requests for custom NodePools may be sent to CATS_Support@lilly.com. In order to best understand your needs, the minimum amount of information is required:

 - limit of total vCPU
 - limit of total memory (in Gi)
 - limit of total GPUs
 - suggested instance families ([see this AWS document for reference](https://docs.aws.amazon.com/eks/latest/userguide/choosing-instance-type.html))
 - extra node taints
 - extra node labels for selectors to leverage

**Wherever possible, we recommend leveraging the default NodePools as this provides a more efficient utilization of provisioned cluster resources.** The platform team may help to make recommendations based on additional constraints and security requirements.

## Using Karpenter With CATS
### Scheduling
See [Compute and Workload Scheduling](./ComputeAndWorkloadScheduling.md) for information on how to use AWS Karpenter nodes.

### Self-guided Workshop
To get started with Karpenter on the CATS platform, we recommend first completing the self-guided workshop provided by the platform team. This workshop is designed to help new application developers gain a comprehensive understanding of Karpenter and how to leverage it effectively for various use cases. The workshop includes a GitHub repository that you will clone locally and work through. Detailed instructions are available in the README.md file within the repository, guiding you through the process step by step. Completion of this workshop will equip you with the necessary knowledge to successfully utilize Karpenter on the CATS platform.

[`CLICK HERE`](https://github.com/EliLillyCo/LRL_light_k8s_infra_apps_examples/tree/main/karpenter/workshop) to navigate to the CATS Karpenter Workshop. 
