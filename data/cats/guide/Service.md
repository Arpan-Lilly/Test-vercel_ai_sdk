
# Service

In Kubernetes, a Service is a method for exposing a network application that is running as one or more Pods in your cluster.

A key aim of Services in Kubernetes is that you don't need to modify your existing application to use an unfamiliar service discovery mechanism. You can run code in Pods, whether this is a code designed for a cloud-native world, or an older app you've containerized. You use a Service to make that set of Pods available on the network so that clients can interact with it.

If you use a Deployment to run your app, that Deployment can create and destroy Pods dynamically. From one moment to the next, you don't know how many of those Pods are working and healthy; you might not even know what those healthy Pods are named. Kubernetes Pods are created and destroyed to match the desired state of your cluster. Pods are ephemeral resources (you should not expect that an individual Pod is reliable and durable).

Each Pod gets its own IP address (Kubernetes expects network plugins to ensure this). For a given Deployment in your cluster, the set of Pods running in one moment in time could be different from the set of Pods running that application a moment later.

This leads to a problem: if some set of Pods (call them "backends") provides functionality to other Pods (call them "frontends") inside your cluster, how do the frontends find out and keep track of which IP address to connect to, so that the frontend can use the backend part of the workload?


## CATS Service Template
```yaml
# Define a Service
apiVersion: v1
kind: Service
metadata:
  name: <service-name>
  namespace: <namespace-name>
spec:
  selector:
    app: <app-label>
  ports:
    - protocol: TCP
      port: <service-port>
      targetPort: <container-port>
```
You need to replace the placeholder values with your desired configurations. Here's an explanation of the placeholders:

| Placeholder | Description |
|-------------|-------------|
| `<namespace-name>` | The namespace where your service will be created. |
| `<service-name>` | The name of your Kubernetes service. |
| `<app-label>` | A label to match the pods with the service. |
| `<service-port>` | The port on which your service is exposed. |
| `<container-port>` | The target port on the container that the service directs traffic to. |


<br />

## How Service interacts with Ingress
