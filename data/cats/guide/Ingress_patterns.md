# Ingress Patterns and Visualization

In Kubernetes environments, understanding ingress traffic routing patterns can be challenging. This guide introduces visualization tools and common patterns to help you better understand how ingress resources direct traffic to your services.

## Ingress Diagram Tool

The Kubernetes Ingress Diagrams tool provides comprehensive visualization of ingress resources, services, and endpoints in your Kubernetes clusters. It automatically identifies AWS Application Load Balancer (ALB) configurations when present, clearly showing how external traffic flows through your cluster's network architecture.

### Accessing the Tool

The ingress diagram visualization tool is deployed and accessible at:
- [https://hangar-ingress-diagram-generator.apps-d.lrl.lilly.com](https://hangar-ingress-diagram-generator.apps-d.lrl.lilly.com)

### Example Use Cases

**View traffic routing for a specific namespace with endpoints:**  
[https://hangar-ingress-diagram-generator.apps-d.lrl.lilly.com/api/ingress/diagrams?namespace=llm-dev&endpoints=true](https://hangar-ingress-diagram-generator.apps-d.lrl.lilly.com/api/ingress/diagrams?namespace=llm-dev&endpoints=true)

**View all ingresses with a specific host pattern:**  
[https://hangar-ingress-diagram-generator.apps-d.lrl.lilly.com/api/ingress/diagrams?host=.*apps-d\.lrl\.lilly\.com&endpoints=true](https://hangar-ingress-diagram-generator.apps-d.lrl.lilly.com/api/ingress/diagrams?host=.*apps-d\.lrl\.lilly\.com&endpoints=true)

**View specific namespaces with endpoint details:**  
[https://hangar-ingress-diagram-generator.apps-d.lrl.lilly.com/api/ingress/diagrams?namespace=aads-legal-intakes-dev&endpoints=true](https://hangar-ingress-diagram-generator.apps-d.lrl.lilly.com/api/ingress/diagrams?namespace=aads-legal-intakes-dev&endpoints=true)

## Common Ingress Patterns

The system identifies five main ingress pattern types:

### 1. Simple Path Routing Pattern

* Routes all traffic to a single service
* Has a single hostname and path
* The simplest form of ingress configuration
* Used when an application is served by a single backend service

**Example:** An ingress with one host (like app.example.com) and one path (/) pointing to a single service

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: simple-path-ingress
spec:
  rules:
  - host: app.example.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: my-service
            port:
              number: 80
```

### 2. Host-Based Routing Pattern

* Routes traffic based on the hostname in the request
* Multiple hostnames route to different services
* Allows hosting multiple applications on the same infrastructure using different domain names
* Detected when an ingress has more than one host rule

**Example:** Different hosts like app1.example.com and app2.example.com routing to different backend services

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: host-based-ingress
spec:
  rules:
  - host: api.example.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: api-service
            port:
              number: 80
  - host: web.example.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: web-service
            port:
              number: 80
```

### 3. Path-Based Routing Pattern

* Routes traffic based on the URL path
* Different paths route to different services under the same hostname
* Allows exposing multiple services under the same hostname
* Detected when an ingress has multiple paths but only one host

**Example:** example.com/api goes to an API service while example.com/app goes to a frontend service

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: path-based-ingress
spec:
  rules:
  - host: myapp.example.com
    http:
      paths:
      - path: /api
        pathType: Prefix
        backend:
          service:
            name: api-service
            port:
              number: 80
      - path: /app
        pathType: Prefix
        backend:
          service:
            name: frontend-service
            port:
              number: 80
```

### 4. Fanout (Multiple Services) Pattern

* Also known as path-based fan-out
* Routes different URL paths to different services
* Creates a unified API gateway from multiple microservices
* Detected when there are multiple backend services in a single ingress

**Example:** Routing /api/users to a user service, /api/products to a product service, etc.

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: fanout-ingress
spec:
  rules:
  - host: api.example.com
    http:
      paths:
      - path: /api/users
        pathType: Prefix
        backend:
          service:
            name: user-service
            port:
              number: 80
      - path: /api/products
        pathType: Prefix
        backend:
          service:
            name: product-service
            port:
              number: 80
      - path: /api/orders
        pathType: Prefix
        backend:
          service:
            name: order-service
            port:
              number: 80
```

### 5. Default Backend Pattern

* Uses a default backend with no specific routing rules
* Used for catch-all services or fallback endpoints
* Detected when an ingress has no rules defined
* Provides a consistent experience for unmatched requests

**Example:** A generic 404 page or a service that handles all unmatched requests

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: default-backend-ingress
spec:
  defaultBackend:
    service:
      name: default-service
      port:
        number: 80
```
              number: 80
  - host: web.example.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: web-service
            port:
              number: 80
```

### 4. TLS/SSL Termination

Adding TLS certificate for secure connections:

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: tls-ingress
spec:
  tls:
  - hosts:
    - secure.example.com
    secretName: tls-secret
  rules:
  - host: secure.example.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: secure-service
            port:
              number: 80
```

## Visualizing Ingress Flow

The following diagram shows a typical traffic flow through Kubernetes ingress:

![Ingress Flow Diagram](/img/ingress_patterns_example.png)


## Reading Diagram Elements

When using the Hangar Ingress Diagram Tool, you'll see these components:

1. **External Clients**: Shown at the top, representing external traffic sources
2. **Hostnames/Domains**: The domain names configured in your ingress resources
3. **ALB/Ingress Controllers**: Shows AWS Application Load Balancers and ingress controllers
4. **Services**: Kubernetes services that receive traffic from ingress rules
5. **Endpoints**: When enabled (`endpoints=true`), shows the actual pods behind each service

### Diagram Color Legend

- **Blue Boxes**: External components (clients, hostnames)
- **Green Boxes**: Kubernetes ingress resources
- **Yellow Boxes**: Kubernetes services
- **Purple Boxes**: Kubernetes pods/endpoints
- **Arrows**: Traffic flow direction with path/port information

## API Usage

For more complex scenarios, you can interact with the Ingress Diagram Tool's API:

### Summary Endpoints

```
# Summary of all ingress resources
https://hangar-ingress-diagram-generator.apps-d.lrl.lilly.com/api/ingress/summary

# Summary filtered by namespace
https://hangar-ingress-diagram-generator.apps-d.lrl.lilly.com/api/ingress/summary?namespace=your-namespace

# Summary with endpoints data
https://hangar-ingress-diagram-generator.apps-d.lrl.lilly.com/api/ingress/summary?endpoints=true
```

### Diagram Endpoints

```
# Mermaid diagrams for all ingress resources
https://hangar-ingress-diagram-generator.apps-d.lrl.lilly.com/api/ingress/diagrams

# Diagrams in Markdown format (instead of HTML)
https://hangar-ingress-diagram-generator.apps-d.lrl.lilly.com/api/ingress/diagrams?format=md

# Diagrams with limited pods displayed (default is all)
https://hangar-ingress-diagram-generator.apps-d.lrl.lilly.com/api/ingress/diagrams?max_pods=3
```

## Troubleshooting Ingress Configurations

When troubleshooting ingress issues:

1. Verify your ingress resource is correctly defined
2. Check that referenced services exist in the correct namespace
3. Confirm that service selectors match your pod labels
4. Validate that port mappings are consistent through the chain
5. Use the Ingress Diagram Tool to visualize the current configuration
6. Check Ingress Controller logs if traffic isn't flowing as expected

---

For more information, contact the Hangar Team or visit [the project repository](https://github.com/EliLillyCo/hangar-k8s-ingress-diagrams).
