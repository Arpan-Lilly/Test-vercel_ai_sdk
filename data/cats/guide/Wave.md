# **Wave : Auto Deployment Tool**

Enable auto deploy of app on secret change

By default, K8s does not re-deploy the pods in a deployment if a secret referenced in an environment variable or mounted in a container changes.

[Wave](https://github.com/wave-k8s/wave) is a controller that handles this update process.  It has been deployed in this cluster & can be used by apps.

To enable Wave's syncing process for your app, add the below annotation to your deployment config:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  annotations:
    wave.pusher.com/update-on-config-change: "true"
```
