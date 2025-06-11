# Prometheus

Prometheus is a powerful open-source monitoring and alerting toolkit designed for recording real-time metrics in a time-series database. Our implementation of Prometheus serves as the backbone of our [Grafana](./Grafana.md) dashboard visualization tool. Prometheus is continuously scraping metrics from various sources, including applications, infrastructure components, and Kubernetes clusters. This enables teams to gain deep insights into system performance, resource utilization, and overall health. Prometheus’s robust querying capabilities allow users to create custom metrics visualizations and set alerts based on key performance indicators (KPIs). With its efficient data collection and storage model, Prometheus ensures that our users have access to the critical information needed for proactive monitoring and optimization of their applications on the CATS platform.

## How to use Prometheus in CATS

As there is no user interface for Prometheus, the only way to query Loki for metrics is through Grafana. Please see the [Grafana](./Grafana.md) documentation for utilizing the tool.

## Official Documentation

For more information please review the offical [Prometheus Documentation](https://prometheus.io/docs/introduction/overview/) on their webiste. 