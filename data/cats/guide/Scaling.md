
# Scaling

The documentation here is about Horizontal Scaling (scaling the number of pod replicas related to a specific deployment or stateful set).


## HorizontalPodScaler 
This autoscaler scales out your application when average CPU usage if more than 50% of the CPU requests, and scale in when CPU usage is below.

"The HorizontalPodAutoscaler controller operates on the ratio between desired metric value and current metric value", see [the scaling algorithm](https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale/#algorithm-details) for more details.


```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: your-app
  namespace: your-app-namespace-dev
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: your-app
  minReplicas: 2
  maxReplicas: 6
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 50
```

A walkthrough of HorizontalPodAutoscaler is available here: https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale-walkthrough/

## Add separate node groups 

Applications might have special compute need (usage of SPOT instances, GPU, or specific EC2 instance types), those can be added as customized node groups here: 


https://github.com/EliLillyCo/LRL_light_k8s_infra/blob/1fb8f68fc19bea5e182a50842e77f6ed05c7dd61/aws/lib/stacks/eks-nodegroups.ts#L281-L302

*Note: Work with the CATS Platform team to get these changes included in the infra stack.*

### Examples 
A node group of dedicated instances (maximum of 5 c6i.xlarge2 on-demand instances):
```typescript
addASG(this, "dev", { instanceType: ec2.InstanceType.of(ec2.InstanceClass.C6I, ec2.InstanceSize.XLARGE2) }, { available: 0, rootVolSize: 50 }, { "app": "your-app:NoExecute" }, { "app": "your-app", "node.kubernetes.io/compute.capacity": "ON_DEMAND" }, "_your_app", availabilityZone, undefined, false, 5) // dedicated on-demand instances for your app
```

A node group of Spot instances (cheaper but can be interrupted, maximum of  5 c6i.xlarge2 Spot instances):
```typescript
addASG(this, "dev", { instanceType: ec2.InstanceType.of(ec2.InstanceClass.C6I, ec2.InstanceSize.XLARGE2) }, { available: 0, rootVolSize: 50 }, { "app": "your-app:NoExecute" }, { "app": "your-app", "node.kubernetes.io/compute.capacity": "SPOT" }, "_your_app", availabilityZone, 2, false, 5) // dedicated Spot instances for your app
```

To use the dedicated instances, you need to modify your nodeSelctor and tolerations field of your deployment pod template. An example using the above dedicated on-demand EC2 instances:
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: your-app
  namespace: your-app-namespace-dev
  annotations:
    app.lilly.com/flux.automated: "true"
    app.lilly.com/flux.simple.<policy-name>: "<aws-account-number>;<your-repo-name-in-ecr>;glob:<tag-pattern>"
    # Example: app.lilly.com/flux.simple.docs-policy: "283234040926;lrl_light_k8s_infra_apps_catsdocs;glob:sha-.*"
    wave.pusher.com/update-on-config-change: "true"
spec:
  selector:
    matchLabels:
      app.kubernetes.io/name: your-app
  template:
    metadata:
      labels:
        app.kubernetes.io/name: your-app
    spec:
      containers:
      - image: 283234040926.dkr.ecr.us-east-2.amazonaws.com/lrl_new_app:sha-a431842 # {"$imagepolicy": "<namespace-name>:<policy-name>"}
        name: your-app
        resources:
          limits:
            cpu: 3
            memory: 40G
          requests:
            cpu: 3
            memory: 40G
        ports:
        - containerPort: 3838
      # Use node selector to specify the run environment (dev/qa/prd)
      nodeSelector:
        node.kubernetes.io/compute.capacity: ON_DEMAND
        app.lrl.lilly.com/env: dev
      tolerations:
      - key: app
        value: your-app
        effect: NoExecute
      - key: dedicated
        value: "ec2"
        effect: NoExecute
```

<br />
