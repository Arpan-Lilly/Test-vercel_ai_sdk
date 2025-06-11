
# Storage 

There are three main types of storage supported in CATS.  The first (and recommended) is S3 object storage.  
The second is EFS (NFS filesystem).  
The third us EBS (block storage).

## S3

See [Adding Permissions to your app](/guide/Namespace#iam-permissions-for-your-app) for more information about how to grant S3 permission


## EFS

Example EFS config

```
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: <volume name>
  namespace: <namespace>
spec:
  accessModes:
  - ReadWriteMany
  resources:
    requests:
      storage: 1Gi # Since this using the default EFS volume class, storage requests although required does not limit storage used.
```

Backups are automatically taken daily

## EBS

Example EBS volume

```
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: <volume name>
  namespace: <namespace>
spec:
  accessModes:
  - ReadWriteOnce
  resources:
    requests:
      storage: 10Gi
  storageClassName: standard-block-v2
```

Backups must be configured

```
apiVersion: gemini.fairwinds.com/v1
kind: SnapshotGroup
metadata:
  name: <volume name>
  namespace: <namespace>
spec:
  persistentVolumeClaim:
    claimName: <volume name (from above)>
  schedule:
    - every: 1 hour #time interval for snapshotting
      keep: 5
    - every: 1 day #time interval for snapshotting
      keep: 10
  template:
    spec:
      volumeSnapshotClassName: csi-aws-vsc
```

## Backup/Restore Process

## EBS

To restore from backups follow this procedure (cluster CLI is required):

1. Decide on which snapshot to restore from (time based).  Snapshots can be viewed in the following dashboards:

```bash
kubectl -n <namespace> get volumesnapshots
```

Example
```
NAME                              READYTOUSE   SOURCEPVC              SOURCESNAPSHOTCONTENT   RESTORESIZE   SNAPSHOTCLASS   SNAPSHOTCONTENT                                    CREATIONTIME   AGE
data-es-cluster-v2-0-1710954169   true         data-es-cluster-v2-0                           100Gi         csi-aws-vsc     snapcontent-5c114724-ae4f-40b3-8286-6743ea59f7c4   101m           101m
data-es-cluster-v2-0-1710954769   true         data-es-cluster-v2-0                           100Gi         csi-aws-vsc     snapcontent-b24083af-9311-442b-9b11-d9605c72c779   91m            91m
data-es-cluster-v2-0-1710955369   true         data-es-cluster-v2-0                           100Gi         csi-aws-vsc     snapcontent-f11deed6-1933-49d5-a311-688a1e210c94   81m            81m
data-es-cluster-v2-0-1710955969   true         data-es-cluster-v2-0                           100Gi         csi-aws-vsc     snapcontent-a8dd1829-8256-4b01-8377-c3cd54d21144   71m            71m
data-es-cluster-v2-0-1710956569   true         data-es-cluster-v2-0                           100Gi         csi-aws-vsc     snapcontent-c461e387-cd2d-4b92-a21c-b999d366db45   61m            61m
data-es-cluster-v2-0-1710957169   true         data-es-cluster-v2-0                           100Gi         csi-aws-vsc     snapcontent-dcbf0b1a-9c73-4ac2-a5b4-38d19c98ffd7   51m            51m
data-es-cluster-v2-0-1710957769   true         data-es-cluster-v2-0                           100Gi         csi-aws-vsc     snapcontent-098c3f80-8e58-46f9-8179-f645f02f12c5   41m            41m
data-es-cluster-v2-0-1710958369   true         data-es-cluster-v2-0                           100Gi         csi-aws-vsc     snapcontent-6b047533-58ab-44af-9fb0-4e192ff6426d   31m            31m
data-es-cluster-v2-0-1710958969   true         data-es-cluster-v2-0                           100Gi         csi-aws-vsc     snapcontent-640451e6-ac67-4f97-a54c-579321145a4a   21m            21m
data-es-cluster-v2-0-1710959569   true         data-es-cluster-v2-0                           100Gi         csi-aws-vsc     snapcontent-58243f8a-784d-4ab9-b41a-e56aa29124f9   11m            11m
data-es-cluster-v2-0-1710960169   true         data-es-cluster-v2-0                           100Gi         csi-aws-vsc     snapcontent-9039ddfe-8553-4d76-b2f2-f9c1cda2851a   67s            68s
```

Select the timestamp corresponding to the snapshot to restore from.  In the example above, if restoring to snapsot ```data-es-cluster-v2-0-1710955369``` select timestamp ```1710955369```


2. Scale down pods using EBS


3. Update Snapshot restore

```bash
kubectl -n <namespace> annotate snapshotgroup <volume name> --overwrite \
  "gemini.fairwinds.com/restore=<timestamp from above>"
```

4. Confirm snapshot restore

Should see namespaces in terminating state (may take a few seconds to couple minutes)
```bash
kubectl -n <namespace> get pvc
```
Exmaple
```
NAME                   STATUS        VOLUME                                     CAPACITY   ACCESS MODES   STORAGECLASS        AGE
data-es-cluster-v2-0   Terminating   pvc-7bc9525d-5dad-4c40-b566-d05c56582e25   100Gi      RWO            standard-block-v2   13d
```

Once complete, new pvc should be added with the same name & status Bound

```bash
kubectl -n <namespace> get pvc
```

```
NAME                   STATUS   VOLUME                                     CAPACITY   ACCESS MODES   STORAGECLASS        AGE
data-es-cluster-v2-0   Bound    pvc-0e96a46e-9ace-4413-ab56-6c82c77555e6   100Gi      RWO            standard-block-v2   76s
```

4. Clean annotation

```bash
kubectl -n <namespace> annotate snapshotgroup <volume name> gemini.fairwinds.com/restore-
```

5. Scale back up pods using EBS


Notes:

In testing observed behavior occasionally where snapshot/backup creation controller gets into a restore loop after restoring from backup, 
triggering restore periodically even after already restored.  
Seemed to resolve after restarting the controller, even with this backups/restore operated correctly, 
adding this note to note observed behavior for future investigation & perhaps upstream patch if continue to observe.

# Policy on Deleting PVCs

As a general rule, the CATS Team does not delete Persistent Volume Claims (PVCs) due to the significant risks involved. Deleting a PVC can result in permanent data loss, application failures, and potential disruption to stateful workloads. In some cases, it may also leave orphaned storage volumes that are difficult to manage.

If you need a PVC to be deleted, please add it to the list below along with the date of your request. To ensure ample time for consideration, the CATS Team will wait one year before performing the deletion. This delay gives you the opportunity to change your mind, as once a PVC is deleted, all associated data will be permanently lost.

*Click the pen and you can update the list below*  

|PVC Name      | Date Requested | 
|--------------|----------------|
|              |                |
|              |                |
|              |                |
|              |                |
|              |                |
|              |                |

