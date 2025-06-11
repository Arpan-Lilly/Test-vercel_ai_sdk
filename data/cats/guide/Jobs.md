
# Jobs 

A Job creates one or more Pods and will continue to retry execution of the Pods until a specified number of them successfully terminate. As pods successfully complete, the Job tracks the successful completions. When a specified number of successful completions is reached, the task (ie, Job) is complete. Deleting a Job will clean up the Pods it created. Suspending a Job will delete its active Pods until the Job is resumed again.

A simple case is to create one Job object in order to reliably run one Pod to completion. The Job object will start a new Pod if the first Pod fails or is deleted (for example due to a node hardware failure or a node reboot).

You can also use a Job to run multiple Pods in parallel.

If you want to run a Job (either a single task, or several in parallel) on a schedule, see CronJob.


## Example Job 

Here is an example Job config. It computes π to 2000 places and prints it out. It takes around 10s to complete.

```yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: pi
spec:
  template:
    spec:
      containers:
      - name: pi
        image: perl:5.34.0
        command: ["perl",  "-Mbignum=bpi", "-wle", "print bpi(2000)"]
      restartPolicy: Never
  backoffLimit: 4
```

To Run this Job you could either use a CronJob or Kubectl.

Search the [infra_apps repo](https://github.com/EliLillyCo/LRL_light_k8s_infra_apps) for examples to see how our current users are utilizing and defining Jobs resources.

> **Note:** A spec of ttlSecondsAfterFinished of 14400s (4 Hours) is added to every job generated in the cluster. This will result in cleanup of jobs and pods 4 hours post completion.