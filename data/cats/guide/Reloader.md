# Reloader

## Overview

Reloader is a Kubernetes operator that automatically updates pods when changes are made to their `ConfigMaps` and `Secrets`. It watches for changes and performs rolling upgrades on dependent resources, automating the process of applying configuration changes. This ensures applications always run with the latest configurations without manual intervention. 

## Reloader Configuration in Kubernetes

### Usage
Reloader supports several annotations to control its behavior, focusing on automatic reloading for all `ConfigMaps` and `Secrets` or specific ones. 

#### 1. Auto Reload for All ConfigMaps and Secrets
To automatically reload a `Deployment`, `StatefulSet`, or `DaemonSet` when any `ConfigMap` or `Secret` it depends on is updated, use: 
```yaml
reloader.stakater.com/auto: "true"
```
Example:
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-application
  annotations:
    reloader.stakater.com/auto: "true"
spec:
  ...
```
#### 2. Specific ConfigMap or Secret Reload
For reloading only when specific `ConfigMaps` or `Secrets` are updated: 

For a specific ConfigMap:
```yaml
configmap.reloader.stakater.com/reload: "my-configmap-name"
```

For a specific Secret:
```yaml
secret.reloader.stakater.com/reload: "my-secret-name"
```

Example:
```yaml 
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-specific-app
  annotations:
    configmap.reloader.stakater.com/reload: "my-configmap-name"
    secret.reloader.stakater.com/reload: "my-secret-name"
spec:
  ...
```

### Configuring Your Application to Use Reloader
Applications should consume configurations from `ConfigMaps` or `Secrets`, either mounted as volumes or exposed as environment variables. 

#### Using ConfigMaps and Secrets as Volumes:
Mount a ConfigMap as a volume: 
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-app-using-volume
  annotations:
    reloader.stakater.com/auto: "true"
spec:
  template:
    spec:
      containers:
      - name: my-app
        image: my-app-image
        volumeMounts:
        - name: config-volume
          mountPath: /etc/config
      volumes:
      - name: config-volume
        configMap:
          name: my-configmap-name
```

#### Using ConfigMaps and Secrets as Environment Variables:
```yaml
Expose ConfigMap or Secret data as environment variables:
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-app-using-env
  annotations:
    reloader.stakater.com/auto: "true"
spec:
  template:
    spec:
      containers:
      - name: my-app
        image: my-app-image
        envFrom:
        - configMapRef:
            name: my-configmap-name
        - secretRef:
            name: my-secret-name
```
