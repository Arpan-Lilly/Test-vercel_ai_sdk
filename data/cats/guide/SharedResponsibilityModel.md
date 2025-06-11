# Shared Responsibility Model

A shared responsibility model is a framework that defines and distinguishes the responsibilities between different parties involved in managing and operating a system, platform, or service. This model helps clarify what each party is responsible for, ensuring that all aspects of the system are covered without overlap or confusion.

In the context of cloud computing and platforms like AWS, Kubernetes, or even internal platforms (like CATS), a shared responsibility model typically divides responsibilities between the service provider (e.g., AWS, the CATS Platform Team) and the users or customers (e.g., Lilly Application Development Teams). It ensures that both sides understand their roles in maintaining security, functionality, and performance.

![Pod Icon](screenshots/SharedResponsibilityModel.png)

<br />

## Working Agreement

By proceeding with the use of the CATS platform, application teams acknowledge and agree to abide by the shared responsibility model outlined herein. Application teams are fully responsible for maintaining their own configurations, containerizing their applications, and addressing any issues related to their deployments. The platform team will not be held responsible for problems stemming from misconfigurations, application errors, or improperly maintained CI/CD workflows within individual applications. It is the responsibility of each app team to resolve these issues independently, ensuring that their applications function correctly within the platform's infrastructure.

<br />

## Platform Team Responsibilities:

**Infrastructure Management:**

- Full responsibility for maintaining the AWS EKS cluster, worker nodes, and scaling through tools like Karpenter.
- Monitor and ensure the health of the platform’s infrastructure (nodes, autoscaling, etc.).

**GitHub Validation and Compliance:**

- Maintain the validation pipeline in GitHub, ensuring that all config changes (e.g., Kubernetes YAML files) go through proper checks before merging.
- Establish policies and enforce guidelines to ensure that app teams' configurations meet best practices before deployment.

**Networking and Security:**

- Route53: Manage DNS configurations, create and maintain DNS entries for ingress routing.
- Ingress Controller: Maintain ingress controllers, load balancers, and ensure proper routing and security for incoming traffic.
- Networking Policies: Implement and maintain security group policies, service meshes (if applicable in the future), and any VPC configurations to ensure secure network traffic.
- TLS/SSL Certificate Management: Ensure that all external-facing services are secured with SSL/TLS certificates.

**System Services Maintenance:**

- Argo CD and Flux: Ensure proper functioning and continuous updates of GitOps tools like Argo CD and Flux for application deployment.
- Monitoring Tools: Maintain observability services like Grafana, Prometheus, and custom dashboards to monitor cluster health and application performance.
- Authentication Services: Maintain and update the Bouncer authentication service to ensure seamless integration with AD Groups for app team access.
- Logging and Audit: Ensure that centralized logging (e.g., using ELK stack, Loki) and audit trails are enabled for all deployments.

**CI/CD Workflows:**

- Maintain the CI/CD pipeline that allows Kubernetes configurations to be automatically deployed to the cluster when pushed to the GitHub repo.
- Ensure that deployment pipelines have proper rollback strategies and notifications on failure.
- Support:
Ensure system uptime, provide support for platform-level bugs, and monitor platform services like the cluster, networking, and key system services (Argo CD, Ingress, etc.).
- Support Tier 2/3 for infrastructure issues but not app-specific issues.

**Platform Updates:**

- Perform regular updates, security patches, and scaling optimizations for Kubernetes and platform services (e.g., EKS version upgrades, system service upgrades like Argo CD).

**Validation Package:**

- The CATS Platform Team is responsible for managing the validation documentation required for the overall platform.
- The platform maintains the GCP Neutral status via the "CATS - Qualification Plan", ensuring that all necessary validation efforts are conducted to meet and uphold this qualification.
- The team manages and maintains the "CATS - Security Plan and Administration SOP" to ensure the platform’s security practices are well-documented and in compliance with Lilly standards.
- Platform-level validation efforts include infrastructure, networking, security measures, and system services, ensuring that the platform meets the necessary compliance and operational standards.
- **Out of Scope:** The platform validation documents are focused solely on the CATS platform infrastructure, services, and security measures. The content, performance, or validation of individual applications fall under the purview of the app teams.

<br />

## Application Team Responsibilities:

**Kubernetes Configuration Maintenance:**

- Write, maintain, and update their Kubernetes resource files (e.g., Deployments, Services, Ingress, Secrets, ConfigMaps).
- Ensure configurations adhere to best practices and are validated against the platform’s GitHub Validator before merging to the main branch.

**Application Containerization:**

- Create, maintain, and update Dockerfiles to containerize their applications.
Ensure that images are secure, optimized, and follow platform guidelines (e.g., using the latest stable base images).

**Solution's CI/CD Workflows:**

- Write and manage their GitHub Actions or equivalent workflows that trigger their app deployments.
- Ensure their workflows follow platform templates but take responsibility for customizing and debugging issues with their specific CI/CD pipelines.

**App Debugging and Resolution:**
- Application Failures: Handle debugging and resolution of application-specific issues, such as 404 errors, application crashes, or misconfigurations that lead to failed deployments.
- Ingress and Routing: Ensure that Ingress routing is properly configured and is aligned with the platform’s network policies.
- Resource Management: Manage the resources their apps consume (e.g., CPU, memory limits), ensuring that they scale appropriately.

**Identity and Access Management (IAM):**

- App teams are responsible for managing IAM roles and permissions for their applications. This includes defining who can access their resources and what actions they can perform. 
- Teams must ensure that IAM policies are correctly configured to protect sensitive data and comply with organizational security requirements. This responsibility also encompasses the creation and maintenance of service accounts, which are essential for enabling applications to interact securely with other services and resources. 
- Proper management of IAM roles, permissions, and service accounts is crucial for maintaining application security and integrity within the CATS platform.

**App-Specific Monitoring:**

- Set up and maintain their application-level monitoring and alerting (e.g., using custom Grafana dashboards) to track app performance and health.
- The platform team provides system-level dashboards, but app teams must create specific monitoring for their apps via provided services such as the Metrics Dashboard. 

**Security Compliance:**

- Ensure application images are free of vulnerabilities and scanned before being pushed to AWS ECR (e.g., using tools like Github's Automated Security Scanning tool).
- Manage application-level secrets using appropriate Kubernetes tools (e.g., Secrets or external secret management systems like AWS Secrets Manager). We provide guidence on how to effectively manage your solution's secretes but the creation, maintenence and overall management of the secretes is on the application team. 

**Application Ownership:**

- App teams are fully responsible for managing their service’s lifecycle, updates, and retirement, ensuring that resources are cleaned up when no longer needed.
Ensure application resiliency (e.g., proper health checks, liveness/readiness probes) to avoid platform-wide disruptions.

**Validation Package:**

- Each individual app team is responsible for maintaining their own validation documents for their specific applications.
- The platform team's validation efforts do not extend to how individual applications are built, deployed, or operated.
- App teams must ensure that their applications comply with any validation requirements specific to their operations, industry regulations, or internal Lilly processes.

