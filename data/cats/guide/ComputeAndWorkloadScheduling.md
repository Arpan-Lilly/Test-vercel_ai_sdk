
# Compute and Workload Scheduling 

There are three types of provisioned nodes supported by the platform:

 - Fargate (serverless) nodes
 - Nodes via EC2 Autoscaling Groups
 - Nodes via AWS Karpenter

## Services that Schedule Workloads
### Fargate (planned for obsolescence in 2025)
Fargate has been the main provisioned node kind since the first release of CATS. It supports a configurable array of compute types [shown here](https://docs.aws.amazon.com/eks/latest/userguide/fargate-pod-configuration.html), and scales relatively well for many workloads. These nodes are managed by AWS and the CATS platform is unable to support many new upcoming services as the control of the nodes themselves are not fully available to our team. As the platform continues to expand its adoption of the AWS Karpenter node scheduler, the usage of Fargate will be reduced and eventually replaced over time.

### EC2 Autoscaling Groups and Managed EKS NodeGroups
These node schedulers leverage EC2 Autoscaling Groups to provision EC2 instances that are joined to the CATS cluster. This pattern was suggested for custom EC2 node configuration from the beginning of the CATS platform through 2024. This method of provisioning compute has been mainly replaced by the features of AWS Karpenter, and existing use cases will be shifted to AWS Karpenter over time. For an up-to-date list of existing configurations, please see our infra code repo here: [Click here](https://github.com/EliLillyCo/LRL_light_k8s_infra/blob/main/aws/lib/stacks/eks-fargate.ts)

### AWS Karpenter
This node scheduling technology will be leveraged in Q4 2024 onward and provides a comprehensive and robust scheduling tool for nodes. This is the preferred mechanism for custom nodes for application teams and additional information can be found in our [AWS Karpenter documentation](./Karpenter.md). The CATS platform is in an early phase of its adoption of Karpenter and does not currently support automation to enable Karpenter for scheduling. Guidance for scheduling is provided on this page in the examples.

## Node Networking Configurations
### On-premise Network Connected Nodes
When using this method to schedule pods, the pods themselves are not hosted on-premises but this method facilitates connections to on-prem hosted services and/or databases.

In addition to implementing the below template, please ensure that the `compute` annotation on your namespace is set to `hybrid`. See further details on how to do implement this configuration change [here](/guide/Namespace#2-annotations-explained).

By scheduling your pod on the OnPremis node group your security policy will NOT be the default security group sg-main. Instead your pod will be a part of the sg-onprem security group. further details about these security groups and their differences can be found [here](/guide/Namespace#security-group-rule).

When a pod is scheduled on the onPrem nodegroup you cannot directly talk to other resources deployed on the CATS Platform. This was a trade off we had to make to comply with security requirmeents. Please see the below diagram to better undertand how you may want to talk with other resources in your namespace. 

![onPrem Diagram](screenshots/OnpremDiagram.png)

## Configuration Options
### Configure Workload Scheduling via Namespace Annotation
To configure your namespace to use Fargate / EC2 instances, you must place the annotation: ```app.lrl.lilly.com/compute``` with a value of either ```serverless``` to allow using only Fargate OR ```hybrid``` to allow using both EC2 or Fargate.  NOTE: If you chose ```hybrid``` you must label your containers to allow them to run on Fargate, while if you chose ```serverless``` all your containers will run on Fargate without special config.

**NOTE on AWS Karpenter Scheduling: this feature does not automatically schedule workloads to AWS Karpenter nodes. In order to schedule to AWS Karpenter nodes, the ```hybrid``` option must be selected.**

### Affinities, Selectors, Tolerations, and Topologies, "Oh My!"
The Kubernetes development team provides rich documentation around concepts for workload scheduling. The CATS team does not provide active consulting or training related to leveraging these features, and it is expected that application teams wanting to use scheduling features educate themselves scheduling techniques by reading the docs posted here:

 - [Assigning Pods to Nodes](https://kubernetes.io/docs/concepts/scheduling-eviction/assign-pod-node/)
   + provides information on `nodeSelector` usage
   + provides information on `affinity` and `*AntiAffinity` usage
 - [Taints and Tolerations](https://kubernetes.io/docs/concepts/scheduling-eviction/taint-and-toleration/)
   + provides information on node `taints` used to constrain scheduling and execution
   + provides information on `tolerations` used to accept node `taints`

## Examples
### Karpenter
#### Deployment Scheduled on General-Purpose Node
Note that a combination of spec.nodeSelector and spec.tolerations for the Pod template is required for scheduling. Example application running on EC2 within a hybrid namespace:
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: your-app
  namespace: your-app-namespace-dev
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
        app.lilly.com/env: [dev|qa|prd] # **NOTE: this is different from the older `app.lrl.lilly.com/env: [dev|qa|prd]` nodeSelector label key!** 
        app.lilly.com/node-kind: general-purpose
      tolerations:
      - key: app.lilly.com/env
        value: "[dev|qa|prd]"
        effect: "NoSchedule"
```

#### Deployment Scheduled on Accelerated (GPU-enabled) Node
Note that a combination of spec.nodeSelector and spec.tolerations for the Pod template is required for scheduling. Example application running on EC2 within a hybrid namespace:
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: your-app
  namespace: your-app-namespace-dev
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
        app.lilly.com/env: [dev|qa|prd] # **NOTE: this is different from the older `app.lrl.lilly.com/env: [dev|qa|prd]` nodeSelector label key!** 
        app.lilly.com/node-kind: accelerated
      tolerations:
      - key: app.lilly.com/env
        value: "[dev|qa|prd]"
        effect: "NoSchedule"
      - key: nvidia.com/gpu
        value: "true"
        effect: "NoSchedule"
```

## Namespace Configuration
### Fargate Only Namespace (`serverless` namespace)
Note the ```app.lrl.lilly.com/compute: serverless``` annotation on the namespace.

```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: your-app-namespace-dev
  labels:
    cost-center: your-apps-cost-center-id
  annotations:
    app.lrl.lilly.com/compute: serverless
```

### EC2 or Fargate Namespace (`hybrid` namespace)
Note the ```app.lrl.lilly.com/compute: hybrid``` tag on the namespace annotation. The ```app.lrl.lilly.com/compute: serverless``` metadata.label for the Pod template will be required for workloads defined in this particular namespace to use Fargate.
```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: your-app-namespace-dev
  labels:
    cost-center: your-apps-cost-center-id
  annotations:
    app.lrl.lilly.com/compute: hybrid
```

## Scheduling Workloads
### Deployment Scheduled on Fargate in `serverless` Namespace 
Note that ```app.lrl.lilly.com/compute: serverless``` metadata.label for the Pod template **is not required** in this instance as it will be applied from the namespace configuration. Template for app running on fargate inside of a serverless namespace:
```yaml

apiVersion: apps/v1
kind: Deployment
metadata:
  name: your-app
  namespace: your-app-namespace-dev
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
            cpu: 1
            memory: 10G
          requests:
            cpu: 1
            memory: 10G
```


### Deployment Scheduled on Fargate in `hybrid` Namespace 
Note that ```app.lrl.lilly.com/compute: serverless``` metadata.label for the Pod template **is required** in this instance. Example application running on fargate within a hybrid namespace:
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: your-app
  namespace: your-app-namespace-dev
spec:
  selector:
    matchLabels:
      app.kubernetes.io/name: your-app
  template:
    metadata:
      labels:
        app.kubernetes.io/name: your-app
        app.lrl.lilly.com/compute: serverless
    spec:
      containers:
      - image: 283234040926.dkr.ecr.us-east-2.amazonaws.com/lrl_new_app:sha-a431842 # {"$imagepolicy": "<namespace-name>:<policy-name>"}
        name: your-app
        resources:
          limits:
            cpu: 1
            memory: 10G
          requests:
            cpu: 1
            memory: 10G
```

### Deployment Scheduled on Default EC2 in `hybrid` Namespace 
Note that a combination of spec.nodeSelector and spec.tolerations for the Pod template is required for scheduling. Example application running on EC2 within a hybrid namespace:
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: your-app
  namespace: your-app-namespace-dev
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
        app.lrl.lilly.com/env: dev
      tolerations:
      - key: dedicated
        value: "ec2"
        effect: "NoExecute"
```

### Deployment Scheduled on Default On-premise Connected EC2 in `hybrid` Namespace
Note that a combination of spec.nodeSelector and spec.tolerations for the Pod template is required for scheduling. Template for applications to follow in order to schedule nodes on the pre defined OnPrem node group:

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
            cpu: 1
            memory: 10G
          requests:
            cpu: 1
            memory: 10G
        ports:
        - containerPort: 3838
      nodeSelector:
        nodeGroup: onPremise
        app.lrl.lilly.com/env: dev
      tolerations:
      - key: nodeGroup
        value: "onPremise"
        effect: NoExecute
      - key: dedicated
        value: "ec2"
        effect: "NoExecute"

```

### Deployment Scheduled on Custom Dedicated EC2 Instance
The following template will help users select the an existing ASG dedicated instance for their application. Note that tolerations and node selectors will depend on the particular configuration of the autoscaling group.

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: your-app
  namespace: your-app-namespace-dev
spec:
  selector:
    matchLabels:
      app.kubernetes.io/name: your-app-label
  template:
    metadata:
      labels:
        app.kubernetes.io/name: your-app-label
    spec:
      containers:
      - image: 283234040926.dkr.ecr.us-east-2.amazonaws.com/lrl_new_app:sha-a431842 # {"$imagepolicy": "<namespace-name>:<policy-name>"}
        name: your-app
        resources:
          limits:
            cpu: # Specify cpus, example: 2
            memory: # Specify memory. example: 8G
            nvidia.com/gpu: # set this field to "1" if scheduling for gpus, else remove the field
          requests:
            cpu: # Specify cpu. example: 2
            memory: # Specify memory. example: 8G
            nvidia.com/gpu: # set this field to "1" if scheduling for gpus, else remove the field
      nodeSelector:
        app: [ASG app name](https://github.com/EliLillyCo/LRL_light_k8s_infra/blob/main/aws/lib/stacks/eks-nodegroups.ts)
        app.lrl.lilly.com/env: [ASG env, i.e. dev|qa|prd](https://github.com/EliLillyCo/LRL_light_k8s_infra/blob/main/aws/lib/stacks/eks-nodegroups.ts)
      tolerations: # <-- this will vary depending on the configuration of the ASG!
      - key: nvidia.com/gpu
        effect: NoSchedule
      - key: dedicated
        value: "ec2"
        effect: "NoExecute"
      - key: app
        value: [ASG taint name, typically same as ASG app name](https://github.com/EliLillyCo/LRL_light_k8s_infra/blob/main/aws/lib/stacks/eks-nodegroups.ts)
        effect: "NoExecute"
```

<br />
