# Overview

Observability is the practice of gaining insight into the internal state of systems by collecting and analyzing external outputs, such as logs, metrics, and traces. It allows teams to monitor the health, performance, and reliability of their applications and infrastructure in real time. By implementing strong observability practices, organizations can proactively detect issues, understand system behavior, and respond to problems before they impact users. In modern cloud-native environments, where systems are often distributed and complex, observability is crucial for ensuring operational visibility, optimizing performance, and maintaining reliability at scale.

- Metrics ([Prometheus](./Prometheus.md)): Prometheus collects and stores time-series metrics (e.g., CPU, memory usage). Metrics provide numerical insight into system health and performance.

- Logs ([Loki](./Loki.md)): Logs provide detailed records of events occurring within applications and infrastructure, which help debug specific issues or trace problems through system interactions. 

- Logs ([OpenObserve](./OpenObserve.md)): Openobserve was our original solution to providing logs to users. It is still active in the cluster but Loki is the new and improved Service Offering we provide. 

- Visualization ([Grafana](./Grafana.md)): Grafana is used to visualize logs, metrics, and traces together in a unified dashboard, helping teams to quickly analyze system behavior and diagnose issues.

- Traces ([Jaeger](./Jaeger.md)): Traces capture the lifecycle of requests as they move through different services and systems, helping to identify bottlenecks in distributed systems. 

## Disclaimer

The CATS Team provides a robust platform with system-level services designed to be generic and usable by all customers. While we strive to ensure these services meet a wide range of needs, certain customizations and feature extensions fall outside the scope of our responsibilities. Please review the following guidelines to understand the boundaries of our support:

**Platform Team Responsibilities:**

- The CATS Team ensures that services like Grafana are set up in a way that is broadly usable for all teams.

- Core platform functionality and documentation are maintained to support the most common use cases.

**Application Team Responsibilities:**

- Customizations beyond the provided platform capabilities, such as adding new data sources in Grafana, are the responsibility of the application development teams.

- If your team wishes to extend platform features, you are expected to take ownership of the implementation and troubleshooting of those changes.

**Feature Requests:**

If you identify a platform feature that would benefit all customers, [Submit A Feature Request](../support/FeatureRequest.md). These requests will be added to our backlog and prioritized with other planned work.

**Continuous Documentation Improvements:**

- We value collaboration to enhance our documentation. If you encounter gaps while using the platform, we encourage you to work with us to address them.

- As you resolve challenges specific to your customizations, please propose improvements to the documentation to help future users.

**Out of Scope:**

Continuous support for customizations or extended use cases that go beyond the default platform capabilities is not within the scope of the CATS Team.

Teams are expected to independently research and implement such changes if desired.

## Table Of Contents

| Observability                                        | Description                                                                                                     |
|-----------------------------------------------------|-----------------------------------------------------------------------------------------------------------------|
| [**Grafana**](./Grafana.md)                        | Powerful visualization tool for monitoring system performance using customizable dashboards and metrics.        |
| [**Jaeger**](./Jaeger.md)                              | Traces capture the lifecycle of requests as they move through different services and systems.  |
| [**Loki**](./Loki.md)                              | Log aggregation system that integrates seamlessly with Grafana, allowing for efficient log analysis and search.  |
| [**OpenObserve**](./OpenObserve.md)                | Centralized observability platform for managing logs, metrics, and traces in a unified interface.                |
| [**Prometheus**](./Prometheus.md)                  | Metrics monitoring and alerting toolkit that integrates with Grafana for real-time insights into system performance. |

<br />
<br />

Note: Our observability components are closely linked to our [Dashboard Offerings](./DashboardOverview.md). 