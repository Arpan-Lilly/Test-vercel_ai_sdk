# AWS Secrets Manager

AWS Secrets Manager is a fully managed service that helps you securely store, manage, and retrieve sensitive information like database credentials, API keys, and other secrets. It allows you to control access to secrets using fine-grained permissions and integrates with AWS Identity and Access Management (IAM) for secure access.

Key features of AWS Secrets Manager:

- Automatic Rotation: It supports automatic rotation of secrets for supported AWS services (like RDS databases) without disrupting your applications.
- Secure Storage: Secrets are encrypted using AWS KMS (Key Management Service) for protection.
- Easy Retrieval: Secrets can be programmatically retrieved via the AWS SDK, CLI, or API in applications, ensuring credentials aren’t hard-coded in codebases.
- Versioning: Secrets Manager keeps track of multiple versions of your secrets, allowing rollback if needed.
- Integration with AWS Services: It integrates with services like Amazon RDS, Redshift, and DocumentDB for automatic secret rotation.

## Using Secrets Manager with CATS

The CATS Platform team strongly recommends using AWS Secrets Manager as the central, secure location for storing sensitive information such as API keys, database credentials, and other secrets.

These secrets are automatically synchronized with a Kubernetes resource called an "External Secret," enabling seamless access to secrets by applications deployed within the Kubernetes cluster.

For detailed instructions on setting up and using External Secrets in CATS, refer to our full guide [here](./ExternalSecrets.md). 

## Amazon Documentation

For a more detailed look at the Secrets Manager service please review the official amazon documentation [here](https://docs.aws.amazon.com/secretsmanager/).