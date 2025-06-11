# Release Notes 2025

## 4.4.1 Cost management, ExternalSecrets, and Scheduling 

Released April 21st :::
[Github Release Notes](https://github.com/EliLillyCo/LRL_light_k8s_infra/releases/tag/v4.4.1)

🚀 New and Upcoming Enhancements
AI Cluster Agents
Enables querying of live production cluster state using CATS cluster agents.
Admission Webhook Controller
Introduces feature toggles in preparation for Kyverno-generated Flux resources.
ArgoCD
Upgraded to version 2.14.7.
Supports fine-grained roles and enables publishing managed resources to Application pages.
Cert-Manager
Deployed ClusterIssuer to support system-wide service certificate management.
Credential Services
Rolled out a new workflow running on self-hosted runners (in-cluster) for on-demand credential generation.
📅 Documentation and architecture will be published on April 21.
Kafka
Initial assets staged for a platform-wide Kafka service.
Kyverno
ArgoCD generators now offer finer-grained control over policy-driven resources.
📈 Observability Enhancements
OpenTelemetry
Initial release of the OpenTelemetry operator for dynamic observability routing.
Prometheus Blackbox Exporter
Launched to monitor system service health with cluster service scraping.
Grafana
New dashboards for Blackbox Exporter.
Introduced “Hangar” dashboards for utilization and cost metrics.
OpenCost
Bugfixes implemented for Infrastructure as Code IAM roles.
🔐 Secrets Management
External Secrets Operator v2
Now leverages ClusterIssuer for improved namespace independence and certificate management.
⚙️ Workload Scheduling
Karpenter
Increased vCPU limits for default NodePools.
Minimum node size set to 47 vCPUs.
Baseline ephemeral storage set to 500Gi.
New “compute” node type added to support compute-heavy workloads.
🛠 Self-Hosted Runners
Prepped for upcoming changes supporting the new credential services workflow.
🔎 Issue References
[CATS-138], [CATS-1571], [CATS-1629], [CATS-1631], [CATS-1632], [CATS-1633], [CATS-1638], [CATS-1639], [CATS-1669], [CATS-1718], [CATS-1719], [CATS-1722], [CATS-1723], [CATS-1744], [CATS-1777]
🌐 Impact Summary
New CRDs
instrumentations.opentelemetry.io/v1alpha1
opentelemetrycollectors.opentelemetry.io/v1alpha1
opentelemetrycollectors.opentelemetry.io/v1beta1
Namespaces Affected
argocd, credential-services, external-secrets, k8s-manager, kafka, kyverno, kube-system, kubecost, logging, self-hosted-runners
As always, your feedback and collaboration are essential to improving the CATS Platform. Stay tuned for further updates and documentation as we continue delivering new capabilities!
We appreciate your continued partnership as we work to improve and evolve our platform.
(Lilly Flow) CATS Club
(Lilly Flow) Ask a Question
(Jira) Project Board
(Jira) Make a Triage Request
(SNOW) Report an Issue
CATS Docs
 
Thank you all for being valued customers! 
 
CATS Platform Team


Meow  🐈
 ----------------------------------------------------
Unsubscribe:  If you do not want to continue receiving these emails, please feel free to unsubscribe. You can unsubscribe from the mailing list by navigating to the Developer Frontdoor and clicking “Remove My Access” under the CATS Mailing List section. 
Documentation:  For more information on the CATS Platform and our extensive documentation please navigate to our DocSite! 
Support:  If you need support, please submit an issue in ServiceNow. If you need assistance with a project and/or have questions around your deployment, please post a question in CATS Club on Lilly Flow. The platform team will answer ASAP!
----------------------------------------------------

## 4.3.1 - Temporal, Prometheus Upgrade, Kyverno, Kubecost

Released March 10th :::
[Github Release Notes](https://github.com/EliLillyCo/LRL_light_k8s_infra/releases/tag/v4.3.1)

### Temporal Server
- Build & Deploy Temporal Workflows: Teams can now build and deploy their Temporal workflows on our platform. More information can be found in the CATS documentation.
- New TemporalNamespace CustomResource: Implements dedicated namespaces for improved workflow isolation.
- Complete Workflow Orchestration: Offers enhanced management and visibility across all workflows.

### Prometheus Upgrade
- Prometheus version has been upgraded to v2.55.1 for improved monitoring and performance.

### Spot vs On-Demand Kyverno Mutation Policy
- This mutation policy automatically handles Spot vs. OnDemand node requests, enhancing our resource allocation and cost management.

### Kubecost Changes
- We have officially discontinued the Kubecost Enterprise license and removed the data federation component as it is not supported in the free-tier plan.

:::note

The Kubecost dashboard is no longer federating data across multiple clusters. Each cluster now has its own standalone Kubecost instance, so please be sure to monitor the instance specific to the cluster(s) that host your application.

:::


## 4.2.2 - Devops, Argocd Improvements, and Kyverno

Released February 24th :::
[Github Release Notes](https://github.com/EliLillyCo/LRL_light_k8s_infra/releases/tag/v4.2.2)

### Kyverno:

 - More Stable Generation of ArgoCD Applications:
   - We have improved the stability of ArgoCD applications by utilizing Kyverno resource generators instead of custom controllers. This change ensures a more reliable and consistent application deployment process.
 - Cluster Cleanup with Kyverno Policies:
   - We have deployed new Kyverno policies to clean up old pods and job pods. This automated cleanup process helps maintain a tidy and efficient cluster environment, reducing resource wastage and potential conflicts.

### ArgoCD:
 - Exposing ArgoCD Scrape Metrics:
   - We have exposed ArgoCD scrape metrics to monitor application health. This allows for better visibility and monitoring of the health and performance of your applications. 
 - ArgoCD Application AutoSync:
   - By default, ArgoCD application autosync is turned off to improve the speed of our ArgoCD server. This change helps in reducing the load and improving the overall performance of the server.
   - ACTION REQUIRED application teams will need to manage the sync settings on their own applications. Please see the cats documentation for configuration an admin argocd role to manage applications.  https://cats.lilly.com/guide/Namespace

### Grafana:
 - Grafana Plugins Persistence:
   - Grafana plugins will now be persisted on restart via in-cluster volumes. This enhancement ensures that all your custom plugins remain intact and functional even after a system restart, providing a seamless monitoring experience.

### Security Enhancements:
 - Hardened System Service Image Security:
   - To enhance the security of our system services, we are now using JFrog Proxy for all images. This measure ensures that all images are scanned and verified, reducing the risk of vulnerabilities and ensuring a more secure platform.


## 4.2.1 - Kyverno Adoption and Hotfixes

Released February 10th :::
[Github Release Notes](https://github.com/EliLillyCo/LRL_light_k8s_infra/releases/tag/v4.2.1)


1. **Hotfix:** Read Access for QA/PRD kubectl. Fixed read access issues for `kubectl` in QA and production clusters.

2. **Hotfix:** AWS ALB Idle Timeout. Fixed a "504 Gateway Timeout" issue by adjusting the AWS ALB idle timeout to 10 minutes across all clusters (dev, qa, prod). The idle timeout has been restored to 10 minutes, preventing 504 errors.

3. Enabled H100 for Cortex.

4. **Kyverno Adoption:** ArgoCD CR Generation. Replaced the ArgoCD handler in the admission webhook controller with Kyverno for better policy management and stability. New Kyverno ClusterPolicy validates namespace annotations and generates ArgoCD CRs.

5. **Security Update:** ELB Security Policy. Updated the ELB security policy to `ELBSecurityPolicy-TLS13-1-2-Res-2021-06` to strengthen encryption and align with security requirements.

6. MD3 Model Scale Out. Scaled out the MD3 model as part of ongoing performance improvements.

7. Automatic Cleanup of Stale PRs. Automatic closure of pull requests that have been inactive for 30 days. The action will automatically close stale PRs and add appropriate labels. Runs every day at 5:00 PM EST.

8. Grafana Plugin Persistence Issue. Resolved an issue where Grafana plugins were not persisting after a production restart.

9. Prometheus Upgrade. Upgraded Prometheus to support new metrics features, enhancing monitoring capabilities. Improved ArgoCD metrics scraping.

10. Admission Webhook Controller Replacement. Replaced the admission webhook controller for ArgoCD application generation with Kyverno. Kyverno policies now handle the generation of ArgoCD applications, deprecating the admission webhook controller.

11. AWS Load Balancer Idle Timeout Fix. Restored the idle timeout to 10 minutes for all clusters, preventing 504 errors for long-running requests.

12. Argocd CR Permissions for Kyverno Controller. Added the necessary permissions for the Kyverno service account to manipulate ArgoCD resources. Policies implemented by Kyverno service account.



## 4.1.2 - SLA Go-Live and General Enhancements

Released January 31st :::
[Github Release Notes](https://github.com/EliLillyCo/LRL_light_k8s_infra/releases/tag/v4.1.2)

1. Service Level Agreements Go-Live
The SLA section of the documentation site now features a dedicated page designed to provide clear and accurate information about SLA Exclusions, Review and Revisions, and Monitoring and Reporting. A new "SLA Reports" section has been added under the News category to enhance transparency and accessibility. These updates ensure that users have a comprehensive understanding of SLA processes and reporting, reinforcing the commitment to maintaining high service standards.

2. Fix Grafana Alert Links with Port Issues  
Grafana alert links and generated dashboard links were appending a port (e.g., `<url>:3000`), causing broken URLs. To resolve this, the `grafana.ini` root_url was updated to use absolute URLs corresponding to the environment ingress.  

3. EFS Throughput Mode Change in CATS Dev Cluster  
The EFS throughput mode in the CATS dev cluster was updated from "Bursting" to "Enhanced" to improve performance for workloads in the `livedesign` namespace that were experiencing timeouts.  

4. Update RDS Instance Documentation  
The RDS documentation was updated to recommend using PostgreSQL 15.0 as the preferred version, with a note explaining that PostgreSQL 16.0 is available but should be avoided when using PGadmin.  

5. Optimize ArgoCD Sync Parallelism  
To address long ArgoCD sync times, configuration changes were made to increase sync parallelism, significantly reducing the time required for these operations.  

6. Reinstate Missing Grafana Data Sources  
The Azure Monitor datasource in the Main Grafana organization was missing, affecting monitoring functionality. This was resolved by reinstating the datasource and exposing the decryption secret.  

7. Improve Concurrency for Release Mergebacks  
GitHub Actions runners were being cancelled during mergebacks due to insufficiently unique concurrency pools. A unique string combining `head_ref` and `base_ref` was added to ensure pools are uniquely associated and prevent cancellations.  

8. Support Section on Docsite Reworked.   
The Support section has been significantly improved to enhance usability and organization, including a complete rework of the "Standard Support Offering" page, a reorganized sidebar for better navigation, and the addition of a table of contents for streamlined access to key topics. The "Ticket Template" page was renamed "Submit a Ticket" and linked to the updated ServiceNow request form, with a new "Submit a Ticket" button added for quick access. Admin-related documentation has been moved to a new Admin section to improve content organization, and a new Feature Request page was introduced to guide users in submitting and tracking feature requests. Additional UI enhancements, such as the "Catsbot" button and a "Submit a Support Ticket" button at the top of the site, improve functionality, while the "GitHub" button was split into three separate buttons for each environment to clarify deployment differences. These updates align with the latest Docusaurus version for consistency, and shortcuts were added to the makefile to streamline formatting fixes with Prettier and simplify the validation process.


## 4.1.1 - Fargate Restructure / Observability Enhancement

Released January 19th :::
[Github Release Notes](https://github.com/EliLillyCo/LRL_light_k8s_infra/releases/tag/v4.1.1)

1. **Fargate Profile Restructuring and Workload Restarts:** We have restructured the Fargate profiles in the cluster, which will cause some serverless (Fargate) workloads to restart.  

      - **Impact:** Brief interruptions in applications may occur during the process.  
      - **Action Required:** No action is needed.  

2. **Grafana Upgrade & Configuration Changes (PLG):** We are upgrading Grafana in production. Since Grafana currently lacks persistent storage, all configurations stored in memory will be cleared as we transition to a new persistent storage solution.  
    
    - **Action Required:** Export and save any custom dashboards or settings in production **BEFORE THE UPGRADE.**  
    - **Action Required:** Re-import your dashboards and settings into the newly persistent Grafana setup **after the upgrade.**  

3. Observability Tools: Jaeger & Loki  
We are enhancing the observability stack to improve monitoring and debugging capabilities.  

    - **Jaeger (Distributed Tracing):**  
      View and analyze distributed traces for your services at [Jaeger UI](https://tracing.apps-d.lrl.lilly.com/search).  
      - Understand service call patterns and pinpoint performance bottlenecks.  

    - **Loki (Logs):**  
      Query structured Loki logs directly through Grafana.  
      - Use Grafana-Loki integration to search and filter logs centrally for streamlined troubleshooting.  

4. View System Service Infrastructure via ArgoCD  
We’ve improved visibility into system service infrastructure resources via ArgoCD.  

    - **Capabilities:**  
      - View infrastructure resources for system services.  
      - Identify the status and health of key platform services.  
    - **Benefits:**  
      - Better understanding of service dependencies.  
      - Faster troubleshooting of platform-related issues.  

5. Introducing New Domain Patterns  
We are rolling out new domain patterns for applications:  
 
  - `bu.lilly.com`  
  - `cats.lilly.com`  
  - `chat.lilly.com`  
  - `cortex.lilly.com`  
  - `dh.lilly.com`  
  - `gs.lilly.com`  
  - `is.lilly.com`  
  - `lrl.lilly.com`  
  - `mq.lilly.com`  



  Recommended Ingress Host Patterns  

  - `<my-app>.dev.<domain>` for **development**  
  - `<my-app>.qa.<domain>` for **QA**  
  - `<my-app>.<domain>` for **production**  

  The existing/legacy domains (`apps.lrl.lilly.com`, `apps-internal.lrl.lilly.com`, `apps-api.lrl.lilly.com`) will remain supported.  
