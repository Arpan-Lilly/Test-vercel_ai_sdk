# Intoduction To Dashboards

- **Ingress Dashboard (Traefik)**: Simplify the management of external access to your services with a versatile Ingress controller, featuring a user-friendly dashboard for easy configuration.

    - [Production Environment Dashboard](https://traefik-dashboard.apps.lrl.lilly.com/dashboard/#/)
    - [QA Environment Dashboard](https://traefik-dashboard.apps-q.lrl.lilly.com/dashboard/#/)
    - [Dev Environment Dashboard](https://traefik-dashboard.apps-d.lrl.lilly.com/dashboard/#/)

- **Deployment Dashboard (Automated CI/CD via Argo )**: Embrace the principles of GitOps for continuous integration and deployment, automating your pipeline for increased efficiency and reliability.

    - [Production Environment Dashboard](https://argocd.apps.lrl.lilly.com/)
    - [QA Environment Dashboard](https://argocd.apps-q.lrl.lilly.com/)
    - [Dev Environment Dashboard](https://argocd.apps-d.lrl.lilly.com/)

- **Grafana Observability Dashboards (Prometheus/Loki/Jaeger)**: Monitor your application's health and performance with detailed metrics visualized through Grafana, powered by Prometheus's robust monitoring capabilities.

    - [Production Environment Dashboard](https://metrics.apps.lrl.lilly.com)
    - [Qa Environment Dashboard](https://metrics.apps-q.lrl.lilly.com)
    - [Dev Environment Dashboard](https://metrics.apps-d.lrl.lilly.com)

- **Tracing Dashboard (Jaeger)**: Monitor your applications requests through microservice architectures. Find bottlenecks in your applications requests by comparing tracing information.

    - [Production Environment Dashboard](https://tracing.apps.lrl.lilly.com)
    - [Qa Environment Dashboard](https://tracing.apps-q.lrl.lilly.com)
    - [Dev Environment Dashboard](https://tracing.apps-d.lrl.lilly.com)

- **Cost Monitoring (Kubecost)**: Keep your cloud expenses in check with detailed insights into your Kubernetes costs, helping you optimize resource allocation and spending.

    - [Dev Environment Dashboard](https://kubecost.apps-d.lrl.lilly.com/allocations)
    - [Qa Environment Dashboard](https://kubecost.apps-q.lrl.lilly.com/allocations)
    - [Production Environment Dashboard](https://kubecost.apps.lrl.lilly.com/allocations)

- **Fargate Logging Dashboard (OpenObserve)**: Access and analyze logs from your legacy fargate applications. This is a deprioritized service and will not receive dedicated support.

    - [Production Environment Dashboard](https://logging.apps.lrl.lilly.com/web/)
    - [QA Environment Dashboard](https://logging.apps-q.lrl.lilly.com/web/)
    - [Dev Environment Dashboard](https://logging.apps-d.lrl.lilly.com/web/)

- **Kubernetes Dashboard**: Gain insights and manage your Kubernetes resources with an intuitive, web-based user interface. This is the most important dashboard for the average user. Please try accessing one of the links below, ***if you do not have access*** to the dashboard you can request access via the [Developer Front Door](https://dev.lilly.com/docs/platforms-and-tools/cats/). After being added to the group it will take around 24 hours for the changes to be reflected on your end. 


    - [Production Environment Dashboard](https://k8s-dashboard.apps.lrl.lilly.com/)
    - [QA Environment Dashboard](https://k8s-dashboard.apps-q.lrl.lilly.com/)
    - [Dev Environment Dashboard](https://k8s-dashboard.apps-d.lrl.lilly.com/)
    

## Table of Contents 

| Dashboard Offering                                   | Description                                                                                                     |
|-----------------------------------------------------|-----------------------------------------------------------------------------------------------------------------|
| [**Overview**](./DashboardOverview.md)             | General overview of the dashboard offerings available on the CATS platform, including monitoring and management tools. |
| [**Argo Deployment Dashboard**](./DeploymentDashboard.md) | Provides a visual interface for tracking and managing Argo CD deployments, offering insight into the deployment status and health. |
| [**Metrics Dashboard**](./Grafana.md)     | Grafana. Monitors application health and performance through Prometheus-powered metrics visualized in Grafana. |
| [**Cost Monitoring Dashboard**](./Kubecost.md)     | Kubecost. Provides detailed insights into Kubernetes costs to help optimize resource allocation and manage spending effectively. |
| [**Ingress Dashboard**](./IngressDashboard.md)     | Traefik. Versatile Ingress controller with a user-friendly dashboard for managing external access to applications. |
| [**Logging Dashboard (Depricated)**](./LoggingDashboard.md)     | Centralized dashboard (OpenObserve) for viewing and analyzing application and infrastructure logs. Please use Grafana features and datasources instead of this dashboard.|
| [**Kubernetes Dashboard (Depricated)**](./KubernetesDashboard.md) | The old web-based interface for real-time insights and management of Kubernetes resources and workloads. Please use Argo instead of this dashboard. |
