# Connecting To AWS Resources in Non-CATS AWS Accounts

Many application teams want to take advantage of AWS Services like Lambda, Glue, Redshift, Aurora Databases, Sagemaker and so on. App Teams are free to use AWS resource like these if they are set up in a stand alone AWS account. Users can get an AWS Account to hold these resources and then connect them with their deployments in the CATS Cluster. In this section we outline some patterns for connecting to different types of AWS Resources that are held in AWS Accounts External to the CATS Platform. 

In cases where application teams define resources like Glue jobs, Lambda functions, or SageMaker models in an external AWS accounts and want to trigger or interact with those resources within the CATS AWS account, certain permissions, trust relationships, and network configurations are required.

## Common Considerations for All Services

1. **Cross-Account Role Assumption**:
- The CATS AWS account must be able to assume a role in the user's external AWS account to trigger resources like Glue jobs, Lambda functions, or Redshift queries.
- This requires the external AWS account to create an IAM role that trusts the CATS AWS account and grants necessary permissions for specific services. 
- More details on cross-account role permission setup in the next section.

2. **Networking**:
- If the interaction involves VPC-based resources (e.g., accessing an RDS database from SageMaker in a different account), you need to ensure network connectivity. The simplest way to avoid additional networking configurations is to ensure that the two resources are on the same VPC.

3. **Resource Policies**:
- For services like Lambda or S3 that require resource-based policies, the external AWS account must set appropriate policies to allow access or invocation from the CATS account.

4. **S3 Access**:
- If resources in either account need to access S3 buckets (for data storage, model artifacts, etc.), ensure the S3 bucket policies allow cross-account access.

## General Cross-Account IAM Role and Trust Policy Setup
The following general IAM role and trust relationship configurations must be set up. These steps apply to all services, with service-specific details addressed later.
**Steps**:

1. **Role Creation in External Account**:
- Create an IAM role in their external AWS account that grants service-related permissions (e.g., `glue:StartJobRun`) and trusts the CATS platform’s AWS account.

2. **Role Creation in CATS Account**:
- Create an IAM role in the CATS AWS account that allows the CATS platform to invoke the user’s Lambda function in the external account. Look at the [`Namespace` section](./Namespace/#custom-permission) to create an ServiceAccount using IRSA.

3. **Attach Trust Policy to IAM Role in the External Account**:
- Create a trust policy that will be attached to the trust relationship of the IAM role in the external account.
- Example `Trust Policy` defined for the IAM role in external account:
```json
{
  "Effect": "Allow",
  "Principal": {
    "AWS": "<CATS-IAM-role-arn>"
  },
  "Action": "sts:AssumeRole"
}
```

4. **IAM Policy/Permissions in External Account**:
- The user’s IAM role in the external account should allow the IAM Role in CATS to perform specific actions and access any necessary resources from the AWS service.
- Example IAM Policy attached to IAM Role in external account:
```json
{
  "Effect": "Allow",
  "Action": [
    <service>:<ActionAllowed>
  ],
  "Resource": "<resource-arn>"
}
```

5. **Next Steps**:
- After setting up the generic cross-account role permissions, look for the AWS service you are trying to interact from within the CATS account below for more information and custom configurations.   

## Glue
To allow your deployment in CATS to trigger a Glue job defined in an external AWS account:

**Step 1: IAM Policy/Permissions in External Account**:
- The user’s IAM role in the external account should allow the IAM Role in CATS to start the Glue job and access any necessary Glue resources (databases, crawlers, etc.).
- Example IAM Policy attached to IAM Role in external account:
```json
{
  "Effect": "Allow",
  "Action": [
    "glue:StartJobRun",
    "glue:GetJob",
    "glue:GetJobRun"
  ],
  "Resource": "arn:aws:glue:<region>:<user-account-id>:job/<job-name>"
}
```

**Step 2: Create a Cronjob/Deployment to Trigger the Glue Job**:
- Create a `Cronjob`/`Deployment` that will trigger the Glue job function with the right AWS configurations: 
```yaml
apiVersion: batch/v1
kind: CronJob
metadata:
  name: lambda-trigger-cronjob
spec:
  schedule: "0 0 * * *"  # Adjust the schedule as needed
  jobTemplate:
    spec:
      template:
        spec:
          containers:
          - name: lambda-trigger
            image: 283234040926.dkr.ecr.us-east-2.amazonaws.com/lrl-aws-tools:k8s_aws_cli-87bee64
            command: ["/bin/sh", "-c"]
            args:
              - |
                GLUE_JOB_NAME="your-glue-job-name"
                
                # Start the Glue job
                aws glue start-job-run --job-name $GLUE_JOB_NAME
                
                # Check if the invocation was successful
                if [ $? -eq 0 ]; then
                  echo "Lambda function invoked successfully."
                else
                  echo "Failed to invoke Lambda function."
                fi
            env:
            - name: AWS_PROFILE
              value: "<external-account-profile>"
            - name: AWS_DEFAULT_REGION
              value: "<your-aws-region>"
            - name: AWS_CONFIG_FILE
              value: "/home/run_user/aws-custom-config"
            volumeMounts:
            - name: "aws-config-volume"
              mountPath: "/home/run_user/aws-custom-config"
              subPath: "aws-config"
            - name: "tmp"
              mountPath: "/tmp"
          restartPolicy: OnFailure
          volumes:
          - name: "aws-config-volume"
            configMap:
              name: "aws-config"
          - name: "tmp"
            emptyDir: {}
---
apiVersion: v1
kind: ConfigMap
metadata:
  name: aws-config
data:
  aws-config: |
    [profile <cats-account-profile>]
    role_arn = <cats-account-iam-role-arn>
    web_identity_token_file = /var/run/secrets/eks.amazonaws.com/serviceaccount/token
    region=<your-aws-region>

    [profile <external-account-profile>]
    role_arn = <external-account-iam-role-arn>
    role_session_name = lambda-trigger
    source_profile = <cats-account-profile>
    region = <your-aws-region>
```

## SageMaker
To allow the CATS platform to interact with a SageMaker endpoint or run training jobs in an external AWS account:

**Interaction**: Use a Kubernetes `Deployment` to invoke SageMaker operations. You can invoke an endpoint or start a training job.

**Step 1: IAM Policy in External Account**:
- Attach a policy to the IAM role in the external account that grants permission to invoke SageMaker endpoints or start training jobs.
- Example IAM Policy attached to IAM Role in external account:
```json
{
  "Effect": "Allow",
  "Action": [
    "sagemaker:InvokeEndpoint",
    "sagemaker:CreateTrainingJob",
    "sagemaker:DescribeTrainingJob"
  ],
  "Resource": "*"
}
```
**Step 2: Create a Deployment to Invoke the  SageMaker Endpoint**:
- Create a `Deployment` that will trigger the SageMaker job function with the right AWS configurations: 
```yaml
apiVersion: batch/v1
kind: Deployment
metadata:
  name: sagemaker-trigger
  labels:
    app: sagemaker-trigger
spec:
  replicas: 1
  selector:
    matchLabels:
      app: sagemaker-trigger
  template:
    metadata:
      labels:
        app: sagemaker-trigger
    spec:
      containers:
      - name: sagemaker-trigger-container
        image: 283234040926.dkr.ecr.us-east-2.amazonaws.com/lrl-aws-tools:k8s_aws_cli-87bee64
        command: ["/bin/sh", "-c"]
        args:
          - |            
            # Invoke sagemaker endpoint
            aws sagemaker-runtime invoke-endpoint --endpoint-name "<sagemaker-endpoint>" --body "<input-payload>" --region "<aws-region>" /tmp/sagemaker_output.txt
            cat /tmp/sagemaker_output.txt

        env:
        - name: AWS_PROFILE
          value: "<external-account-profile>"
        - name: AWS_DEFAULT_REGION
          value: "<your-aws-region>"
        - name: AWS_CONFIG_FILE
          value: "/home/run_user/aws-custom-config"
        volumeMounts:
        - name: "aws-config-volume"
          mountPath: "/home/run_user/aws-custom-config"
          subPath: "aws-config"
        - name: "tmp"
          mountPath: "/tmp"
      restartPolicy: Always
      volumes:
      - name: "aws-config-volume"
        configMap:
          name: "aws-config"
      - name: "tmp"
        emptyDir: {}
---
apiVersion: v1
kind: ConfigMap
metadata:
  name: aws-config
data:
  aws-config: |
    [profile <cats-account-profile>]
    role_arn = <cats-account-iam-role-arn>
    web_identity_token_file = /var/run/secrets/eks.amazonaws.com/serviceaccount/token
    region=<your-aws-region>

    [profile <external-account-profile>]
    role_arn = <external-account-iam-role-arn>
    role_session_name = lambda-trigger
    source_profile = <cats-account-profile>
    region = <your-aws-region>
```

## Aurora Database

***Cross Account Aurora Database Connection Instructions***

In progress

## Lambda
To allow your `Deployment`/`Cronjob` in CATS to trigger a Lambda function defined in an external AWS account:

**Step 1: Lambda Role Creation in External Account**:
- Users need to create an IAM role in their external AWS account that will be assumed by the Lambda service to execute the function. This role must have a trust policy that allows the Lambda service to assume the role.
- Example `Trust Policy` attached to the IAM role:
```json
{
  "Effect": "Allow",
  "Principal": {
    "Service": "lambda.amazonaws.com"
  },
  "Action": "sts:AssumeRole"
}
```

**Step 2: IAM Policy/Permissions in External Account**:
- The IAM role in the external account should grant permissions for the Lambda service to execute the function. 
- Example IAM Policy attached to IAM Role in external account:
```json
{
  "Effect": "Allow",
  "Action": [
    "lambda:InvokeFunction"
  ],
  "Resource": "arn:aws:lambda:<region>:<user-account-id>:function:<function-name>"
}
```

**Step 3: Create a Cronjob/Deployment to Trigger the Lambda Function**:
- Create a `Cronjob`/`Deployment` that will trigger the lambda function with the right AWS configurations:
```yaml
apiVersion: batch/v1
kind: CronJob
metadata:
  name: lambda-trigger-cronjob
spec:
  schedule: "0 0 * * *"  # Adjust the schedule as needed
  jobTemplate:
    spec:
      template:
        spec:
          containers:
          - name: lambda-trigger
            image: 283234040926.dkr.ecr.us-east-2.amazonaws.com/lrl-aws-tools:k8s_aws_cli-87bee64
            command: ["/bin/sh", "-c"]
            args:
              - |
                LAMBDA_FUNCTION_NAME="your-lambda-function-name"
                
                # Invoke the Lambda function using AWS CLI
                aws lambda invoke \
                  --function-name $LAMBDA_FUNCTION_NAME \
                  --payload '{}' \
                  /dev/null
                
                # Check if the invocation was successful
                if [ $? -eq 0 ]; then
                  echo "Lambda function invoked successfully."
                else
                  echo "Failed to invoke Lambda function."
                fi
            env:
            - name: AWS_PROFILE
              value: "<external-account-profile>"
            - name: AWS_DEFAULT_REGION
              value: "<your-aws-region>"
            - name: AWS_CONFIG_FILE
              value: "/home/run_user/aws-custom-config"
            volumeMounts:
            - name: "aws-config-volume"
              mountPath: "/home/run_user/aws-custom-config"
              subPath: "aws-config"
            - name: "tmp"
              mountPath: "/tmp"
          restartPolicy: OnFailure
          volumes:
          - name: "aws-config-volume"
            configMap:
              name: "aws-config"
          - name: "tmp"
            emptyDir: {}
---
apiVersion: v1
kind: ConfigMap
metadata:
  name: aws-config
data:
  aws-config: |
    [profile <cats-account-profile>]
    role_arn = <cats-account-iam-role-arn>
    web_identity_token_file = /var/run/secrets/eks.amazonaws.com/serviceaccount/token
    region=<your-aws-region>

    [profile <external-account-profile>]
    role_arn = <external-account-iam-role-arn>
    role_session_name = lambda-trigger
    source_profile = <cats-account-profile>
    region = <your-aws-region>
```

## Redshift
To allow your `Job` in CATS to trigger a Redshift operation for a resource defined in an external AWS account:

**Step 1: IAM Policy/Permissions in External Account**:
- The IAM role in the external account should allow certain actions to be done with specific Redshift resources, such as executing SQL queries, retrieving data, and listing schemas and tables.
  - Example policy for the IAM role in the external account:
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "redshift:GetClusterCredentials",
        "redshift:DescribeClusters",
        "redshift-data:ExecuteStatement",
        "redshift-data:GetStatementResult",
        "redshift-data:ListDatabases",
        "redshift-data:ListSchemas",
        "redshift-data:ListTables",
        "redshift-data:DescribeStatement",
        "redshift-data:CancelStatement"
      ],
      "Resource": [
        "arn:aws:redshift:<region>:<user-account-id>:cluster/<cluster-name>",
        "arn:aws:redshift:<region>:<user-account-id>:dbuser/<db-user>"
      ]
    }
  ]
}
```

**Step 2: Create a Job to Trigger Redshift Query**:
```yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: redshift-query-trigger
  labels:
    app: redshift-query-trigger
spec:
  template:
    metadata:
      labels:
        app: redshift-query-trigger
    spec:
      containers:
      - name: redshift-query-container
        image: 283234040926.dkr.ecr.us-east-2.amazonaws.com/lrl-aws-tools:k8s_aws_cli-87bee64
        command:
          - /bin/bash
          - -c
          - |
            aws redshift-data execute-statement --cluster-identifier "<redshift-cluster-name>" --database "<database-name>" --sql "<sql-query>" --region "<aws-region>"
            echo "Query executed on Redshift cluster: <redshift-cluster-name>"
        env:
        - name: AWS_PROFILE
          value: "<external-account-profile>"
        - name: AWS_DEFAULT_REGION
          value: "<your-aws-region>"
        - name: AWS_CONFIG_FILE
          value: "/home/run_user/aws-custom-config"
        volumeMounts:
        - name: "aws-config-volume"
          mountPath: "/home/run_user/aws-custom-config"
          subPath: "aws-config"
        - name: "tmp"
          mountPath: "/tmp"
      restartPolicy: Never
      volumes:
      - name: "aws-config-volume"
        configMap:
          name: "aws-config"
      - name: "tmp"
        emptyDir: {}
---
apiVersion: v1
kind: ConfigMap
metadata:
  name: aws-config
data:
  aws-config: |
    [profile <cats-account-profile>]
    role_arn = <cats-account-iam-role-arn>
    web_identity_token_file = /var/run/secrets/eks.amazonaws.com/serviceaccount/token
    region=<your-aws-region>

    [profile <external-account-profile>]
    role_arn = <external-account-iam-role-arn>
    role_session_name = lambda-trigger
    source_profile = <cats-account-profile>
    region = <your-aws-region>

```

## RDS Database

***Cross Account RDS Database Connection Instructions***

**Step 1:**
Create a secret in external AWS account's secrets manger

**Step 2:**
Create a cross account role in the non-CATS aws account that cats can use to connect to the non-CATS AWS account that is housing the RDS database you wish to connect to.

**Step 3:**
Create an external secret in your solution's deployment files within the applicable CATS infra_apps repo.

This is an example of the external secret that the CLUWE team has created to enable connection to a RDDS database housed in the AWS Account 490262564977.

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
**Step 4:**
Go into the AWS console and find the EC2 security group associated with your solutions namespace. Security group should look something like this: `sg-07b45033d6584cdb2`

**Step 5:**
Add this security group to the inbound rules for the RDS database you are trying to target in the non CATS AWS Account. 