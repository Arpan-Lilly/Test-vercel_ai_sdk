---
hide_table_of_contents: true
tags:
  - containers
  - decision-guide
---

# Containerization

:::info Guide Status

- Lifecycle: Draft
- Last Update: 2024-12-16
- Capability Owner: Josh Bloxsome
- EBA Lead: Karl Mayer
- Contributors & Reviewers: Josh Bloxsome, Chris Tornatta, Ross Grinvalds, Todd Walters, Sonia Gurdian, Karl Mayer

:::

A decision guide for common containerization and container orchestration use cases.

:::tip Local Containerization Options

For local workstation and container development options, see
<ExternalLink>[What is our position on using Docker Desktop?](https://elilillyco.stackenterprise.co/questions/265)</ExternalLink>

:::

| Use Case/Scenario                                                                         | Tech Recommendation                                                                                                     | Positioning        | Complexity | Notable Integration/Interop                                        | Owning Org/Team | Next Step                                                                                                                                                                         |
| ----------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- | ------------------ | ---------- | ----------------------------------------------------------------- | --------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Internal apps & APIs; containerized 'high compute' workloads**                          | **[CATS](https://cats.lilly.com)** (backed by [AWS EKS](https://aws.amazon.com/eks/))                                   | **Strategic Core** | Low        | AWS[^1]; cloud resources; HTTPS connectivity to on-prem resources | SPE             | [CATS](https://cats.lilly.com) self-service guide; <ExternalLink>[for tech questions](https://elilillyco.stackenterprise.co/questions/ask?tags=CATS)</ExternalLink>               |
| **Public-facing apps/APIs; multi-region deployment**                                      | **[Kubed](https://kubed.lilly.com/)** (backed by [AWS ROSA](https://aws.amazon.com/rosa/))                              | **Strategic Core** | Low        | AWS                                                               | SPE             | [Kubed](https://kubed.lilly.com/) self-service guide; <ExternalLink>[for tech questions](https://elilillyco.stackenterprise.co/questions/ask?tags=lilly-kubed)</ExternalLink>     |
| App/API/workloads needing full on-prem connectivity                                       | [OpenShift](https://dev.lilly.com/docs/platforms-and-tools/openshift/)                                                  | Core               | Medium     | on-prem & cloud resources                                         | SPE             |
| fully-managed container orchestration with serverless execution                           | AWS ECS Fargate + AWS ECR                                                                                               | Specialized        | High       | AWS                                                               | Cloud           | [CAST architecture review](https://collab.lilly.com/sites/EnterpriseCloud/Lists/Cloud%20Architecture%20Reviews/AllItems.aspx?viewid=25bd9f50%2D60f1%2D488b%2Daa13%2D233eb682631b) |
| Your own Kubernetes cluster with serverless execution                                     | AWS EKS Fargate + AWS ECR                                                                                               | Specialized        | High       | AWS                                                               | Cloud           | [CAST architecture review](https://collab.lilly.com/sites/EnterpriseCloud/Lists/Cloud%20Architecture%20Reviews/AllItems.aspx?viewid=25bd9f50%2D60f1%2D488b%2Daa13%2D233eb682631b) |
| Lambda functions packaged as container images (serverless workloads with custom runtimes) | [AWS Lambda + AWS SAM](https://aws.amazon.com/blogs/compute/using-container-image-support-for-aws-lambda-with-aws-sam/) | Specialized        | Medium     | AWS                                                               | Cloud           |
| OpenShift container workloads in Azure                                                    | [Azure Red Hat OpenShift](https://azure.microsoft.com/en-us/products/openshift)                                         | Emerging           | High       | _Azure[^2] TBD_                                                   | SPE             |
| Other containerization in Azure                                                           | [Azure Container Services](https://azure.microsoft.com/en-us/products/category/containers)                              | Emerging           | High       | _Azure TBD_                                                       | SPE & Cloud     |

:::warning

Unless vendor-specified, container workloads on self-managed, VM-based Docker or Kubernetes is not recommended.

:::

[^1]:
    Manage access to AWS resources with
    [AWS IAM](https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies.html).

[^2]:
    Manage access to Azure resources with
    [Azure Entra ID](https://learn.microsoft.com/en-us/azure/container-apps/authentication-entra).
