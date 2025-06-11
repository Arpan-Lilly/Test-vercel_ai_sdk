# Smarter Device Manager

## Overview
Smarter Device Manager runs as a `DaemonSet` within the cluster, exposing hardware devices (linux device drivers) to your pods. It uses a `ConfigMap` to define the devices it should manage and then allows pods to request these devices. To learn more about Smarter Device Manager, please refer to this [repository](https://github.com/smarter-project/smarter-device-manager) or [article](https://community.arm.com/arm-research/b/articles/posts/a-smarter-device-manager-for-kubernetes-on-the-edge). Here's how to set it up for Filesystem in Userspace (FUSE) as an example. 

## Usage
### Configuring Devices with a ConfigMap
The list of devices that are available to pods are managed by the CATS core team through a `ConfigMap` in the kube-system `Namespace` (view the list [here](https://github.com/EliLillyCo/LRL_light_k8s_infra/blob/6a7dac8855c282d844dbb9b94b50b601e629d467/aws/lib/stacks/k8s/smarter-device-manager.ts#L16)). If you would like to access any other additional devices, please contact the CATS team and we have them added to our list. 

### Requesting Devices in a Pod Deployment
To request access to these devices for your pods, you'll need to modify the pod's deployment configuration. Here's how to request the FUSE device in a `Deployment` by adding the device in your resource’s limits and request: 

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: echo-server-reflector
  namespace: admin-testing-smarter-device-manager-dev
  labels:
    app: echo-server-reflector
spec:
  replicas: 1
  selector:
    matchLabels:
      app: echo-server-reflector
  template:
    metadata:
      labels:
        app: echo-server-reflector
    spec:
      containers:
      - name: echo-server-reflector
        image: 283234040926.dkr.ecr.us-east-2.amazonaws.com/lrl_light_k8s_infra_echo:dev-sha-a34f51d
        command: ["uvicorn"]
        args: ["app.main:app", "--reload", "--host", "0.0.0.0", "--port", "8080",
          "--proxy-headers", "--root-path", "/"]
        resources:
          limits:
            memory: "2Gi"
            cpu: "1"
            smarter-devices/fuse: 1 # Limit 1 FUSE device to be accessed at a time
          requests:
            memory: "2Gi"
            cpu: "1"
            smarter-devices/fuse: 1 # Request 1 FUSE device to be accessed 
        ports:
        - containerPort: 8080
```

Once the `Deployment` is up in the cluster, your pods should be able to access the specific devices as requested. 