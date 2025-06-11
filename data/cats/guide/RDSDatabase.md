# RDS Databases 

Amazon Relational Database Service (RDS) is a managed database service provided by Amazon Web Services (AWS) that simplifies the setup, operation, and scaling of a relational database in the cloud. It supports several database engines, including PostgreSQL, MySQL, MariaDB, Oracle, and Microsoft SQL Server, allowing users to choose the one that best fits their needs. RDS handles routine database tasks such as provisioning, patching, backup, recovery, and scaling, enabling developers to focus on their applications rather than on database management.

[Resource](https://instances.vantage.sh/rds/) to calculate what kind of DB you want to use and how much it will cost.

### Recommended PostgreSQL Engine Version

When provisioning a PostgreSQL RDS instance via Crossplane, we strongly recommend using "**15.9**" as the engine version. This version is widely adopted, stable, and most compatible with the majority of PostgreSQL management tools, including pgAdmin.

#### Why 15.9?

- **Stability**: It’s a mature release frequently updated and patched by AWS.
- **Ecosystem Compatibility**: Many client libraries, frameworks, and admin tools have thoroughly tested integration with PostgreSQL 15.x.
- **PGAdmin Compatibility**: Versions above 16.0 currently present known issues when used with pgAdmin; users may be unable to connect or interact properly with RDS instances. If your workflow relies on pgAdmin, avoid specifying any 16.x engine version until pgAdmin provides official support.

### Application Access to RDS Instance
To enable traffic from your application in the cluster to reach the RDS instance, you must attach the cluster’s security group to the `vpcSecurityGroupIds` field in your `RDSInstance` configuration. This ensures that the RDS instance allows inbound traffic from the specified security group. An example configuration of an `RDSInstance` object is provided below.

**Important**: Be sure to use the correct security group for the environment (Dev, QA, or Prod) where your application and RDS instance are deployed.

| Environment | Cluster Security Group |
|-------------|------------------------|
| Dev         | sg-0fbc2281bb1d4a235   |
| QA          | sg-0da01d6b76e594051   |
| Prod        | sg-0fc1ecf123aa058f0   |


## Dev/QA Config Example
Template:

```yaml
apiVersion: database.aws.crossplane.io/v1beta1
kind: RDSInstance
metadata:
  name: <Your db name, must be unique across all apps & DNS safe>
  namespace: <Your Namespace>
spec:
  providerConfigRef:
    name: "default"
  forProvider:
    dbInstanceClass: db.t2.small
    masterUsername: postgres
    allocatedStorage: 20
    region: us-east-2
    engine: postgres
    engineVersion: "15.9"
    skipFinalSnapshotBeforeDeletion: true
    autoMinorVersionUpgrade: false
    storageEncrypted: true
    deletionProtection: false
    dbSubnetGroupName: light-rds-subnet-group
    # Currently referencing the AWS Cluster SG directly, future update to use label refs, etc.  For now seems like crossplane does not fully support this.
    vpcSecurityGroupIds:
      - sg-0fc1ecf123aa058f0
  writeConnectionSecretToRef:
    namespace: <Your Namespace>
    name: <Name of the secret which will be created in your namespace containing db connection / credential info>
```


## PRD Config Example 

template:

```yaml
apiVersion: database.aws.crossplane.io/v1beta1
kind: RDSInstance
metadata:
  name: <Your db name, must be unique across all apps & DNS safe>
  namespace: <Your Namespace>
spec:
  providerConfigRef:
    name: "default"
  forProvider:
    dbInstanceClass: db.t2.small
    masterUsername: postgres
    allocatedStorage: 20
    region: us-east-2
    engine: postgres
    engineVersion: "15.9"
    skipFinalSnapshotBeforeDeletion: true
    autoMinorVersionUpgrade: false
    storageEncrypted: true
    deletionProtection: true
    enablePerformanceInsights: true
    backupRetentionPeriod: 7
    dbSubnetGroupName: light-rds-subnet-group
    # Currently referencing the AWS Cluster SG directly, future update to use label refs, etc.  For now seems like crossplane does not fully support this.
    vpcSecurityGroupIds:
      - sg-0fc1ecf123aa058f0
  writeConnectionSecretToRef:
    namespace: <Your Namespace>
    name: <Name of the secret which will be created in your namespace containing db connection / credential info>
```

This configuration will create a RDS Postgresql database & set the connection info in a secret it creates in the namespace referenced with the ```writeConnectionSecretToRef``` property.

This secret follows the structure:

```yaml
endpoint: <RDS Host>
password: <RDS Main user password>
port: <RDS Port>
username: <RDS Main Username>
```

These configurations can be viewed in the K8s Dashboard under the crossplane rds custom resource [Click Here] (https://k8s-dashboard.apps.lrl.lilly.com/#/customresourcedefinition/rdsinstances.database.aws.crossplane.io?namespace=_all)


## OnPrem Access (Mobius / BI tool) 

For use cases such as Mobius or BI tool access which requires a direct DB connection, there is a pre-provisioned security group which provides OnPrem access to RDS Postgresql DBs.  NOTE: this should only be added when necessary for the above use cases.

In your crossplane resource, add the following security group to the ```vpcSecurityGroupIds``` parameter
```yaml
vpcSecurityGroupIds:
 ...
 - sg-01c9259fe1ed54f5f 
```

<br />

## Cross Account RDS Connection

#### Step 1:
Create a secret in external AWS account's secrets manger

#### Step 2:
Create a cross account role in the non-CATS aws account that cats can use to connect to the non-CATS AWS account that is housing the RDS database you wish to connect to.

#### Step 3:
Create an external secret in your solution's deployment files within the applicable CATS infra_apps repo.

This is an example of the external secret that the CLUWE team has created to enable connection to a RDS database housed in the AWS Account 490262564977.

Following this pattern should work for your solution as well! 

```yaml
---
apiVersion: "kubernetes-client.io/v1"
kind: ExternalSecret
metadata:
  name: cluwe-secret
  namespace: cluwe-qa
spec:
  backendType: secretsManager
  roleArn: arn:aws:iam::490262564977:role/lrl-cluwe-cats-cross-connection
  region: us-east-2
  data:
    - key: cluwe-dev/rds/secret
      name: username
      property: rds_username
    - key: cluwe-dev/rds/secret
      name: password
      property: rds_password
    - key: cluwe-dev/rds/secret
      name: endpoint
      property: rds_host
```
#### Step 4:
Go into the AWS console and find the EC2 security group associated with your solutions namespace. Security group should look something like this: `sg-07b45033d6584cdb2`

#### Step 5:
Add this security group to the inbound rules for the RDS database you are trying to target in the non CATS AWS Account. 