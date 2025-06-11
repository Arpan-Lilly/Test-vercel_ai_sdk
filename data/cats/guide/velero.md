# Velero Kubernetes Backup System - Deployment & Usage Guide

## Overview

Velero is a backup solution for Kubernetes that enables you to back up and restore cluster resources, persistent volumes, and perform disaster recovery. This document provides an overview of the infrastructure code used to deploy and configure Velero, as well as common commands for managing backups.

## Key Files and Components

### 1. `LRL_light_k8s_infra/aws/lib/services/velero.ts`

This is the main TypeScript file responsible for deploying Velero to the Kubernetes cluster. It includes:

- **Namespace**: Creates a namespace called `backup` for all Velero resources
- **ServiceAccount Creation**: Defines a Kubernetes ServiceAccount named `velero` in the `backup` namespace
- **IAM Role Setup**: Creates an AWS IAM Role with the necessary permissions to access S3 for storing backups and manage EBS snapshots
- **ArgoCD Application Configuration**: Defines the ArgoCD Application that deploys and manages the Velero Helm chart
- **Default Backup Schedule**: Configures a daily backup schedule running at 1:00 AM

### 2. `LRL_light_k8s_infra/aws/config/accountDetails.ts`

Contains environment-specific configuration for Velero, including:

- **S3 Bucket Names**: Defines the S3 buckets for each environment where backups are stored:
  - sbx: "lly-velero-backups-sbx-dev"
  - dev: "lly-light-velero-backups-dev"
  - qa: "lly-light-velero-backups-qa"
  - prd: "lly-light-velero-backups-prd"

### 3. IAM Role with Permissions

Creates an AWS IAM Role with policies to:
- Manage EBS snapshots and volumes:
  - `ec2:DescribeVolumes`
  - `ec2:DescribeSnapshots`
  - `ec2:CreateTags`
  - `ec2:CreateVolume`
  - `ec2:CreateSnapshot`
  - `ec2:DeleteSnapshot`
- Access the S3 bucket for storing backups:
  - `s3:AbortMultipartUpload`
  - `s3:GetObject`
  - `s3:DeleteObject`
  - `s3:PutObject`
  - `s3:ListMultipartUploadParts`
  - `s3:ListBucket`
  - Plus a separate statement with broader `s3:*` permissions

### 4. Kubernetes Resources Created

When deployed, the following Kubernetes resources are created:

1. **Namespace**: `backup`
2. **ServiceAccount**: `velero` in the `backup` namespace
3. **IAM Role**: `velero-s3-backup-role` with necessary permissions
4. **BackupStorageLocation**: Defines where backups are stored in S3
5. **VolumeSnapshotLocation**: Defines where volume snapshots are stored (AWS)
6. **Schedule**: Daily backup schedule at 1:00 AM
7. **Deployment**: Velero server
8. **DaemonSet**: Velero node-agent for handling volume snapshots

### 5. Configuration Settings

Notable configuration values:
- **Backup TTL**: 240 hours (10 days)
- **Operation Timeout**: 4 hours
- **Default Storage Location**: AWS S3
- **Schedule**: Daily at 1:00 AM
- **Excluded Namespaces**: kube-system, velero
- **AWS Region**: us-east-2
- **Resource Requests/Limits**:
  - Requests: 750m CPU, 256Mi memory
  - Limits: 2000m CPU, 1024Mi memory
- **Node Selector**:
  - `kubernetes.io/os`: linux
  - `app.lilly.com/compute`: node
  - `app.lilly.com/system-service`: true

## AWS Resources Used

1. **S3 Bucket**: Environment-specific buckets for storing backup data
2. **IAM Roles**: 
   - IAM Role for service account (IRSA) 
   - AWS permissions for S3 access and EBS snapshots
3. **EBS Snapshots**: For persistent volume backups

## Installation Process

1. **Prerequisite**: Ensure you have:
   - Access to the AWS account
   - Kubectl access to the Kubernetes cluster
   - The appropriate S3 bucket created in AWS
   - Proper IAM permissions

2. **Deployment Method**:
   - Velero is deployed through ArgoCD as defined in the `velero.ts` file
   - The code creates:
     - AWS IAM role with appropriate permissions
     - Kubernetes service account linked to the IAM role
     - ArgoCD application that deploys the Velero Helm chart

3. **Verification**:
   - Verify the installation with: `kubectl get pods -n backup`
   - Check the status of the Velero deployment: `kubectl get deployment -n backup velero`
   - Verify the backup schedule: `kubectl get schedule -n backup`

## Common Velero CLI Commands

### Installation

```bash
# Install Velero CLI locally (macOS)
brew install velero

# Install Velero CLI locally (Linux)
wget https://github.com/vmware-tanzu/velero/releases/latest/download/velero-linux-amd64.tar.gz
tar -xvf velero-linux-amd64.tar.gz
sudo mv velero-linux-amd64/velero /usr/local/bin/
```

### Backup Operations

```bash
# Create a manual backup of specific namespaces
velero backup create <backup-name> --include-namespaces=<namespace1>,<namespace2> --namespace backup

# Create a backup with specific resource types
velero backup create <backup-name> --include-resources=deployments,services --namespace backup

# Create a backup with volume snapshots
velero backup create <backup-name> --include-namespaces=<namespace> --snapshot-volumes --namespace backup

# Check backup status
velero backup describe <backup-name> --namespace backup

# View backup logs
velero backup logs <backup-name> --namespace backup

# List all backups
velero backup get --namespace backup
```

### Restore Operations

```bash
# Restore an entire backup
velero restore create --from-backup=<backup-name> --namespace backup

# Restore specific resources
velero restore create --from-backup=<backup-name> --include-resources=deployments,configmaps --namespace backup

# Restore to a different namespace
velero restore create --from-backup=<backup-name> --namespace-mappings original-ns:new-ns --namespace backup

# Check restore status
velero restore describe <restore-name> --namespace backup

# View restore logs
velero restore logs <restore-name> --namespace backup

# List all restores
velero restore get --namespace backup
```

### Schedule Management

```bash
# List backup schedules
velero schedule get --namespace backup

# Create a new schedule (if needed beyond the default)
velero schedule create <schedule-name> --schedule="0 3 * * *" --include-namespaces=<namespace> --namespace backup

# View schedule details
velero schedule describe <schedule-name> --namespace backup

# Delete a schedule
velero schedule delete <schedule-name> --namespace backup
```

### Storage Location Management

```bash
# View backup storage locations
velero backup-location get --namespace backup

# Set a backup storage location as default
velero backup-location set <location-name> --default --namespace backup

# Check backup storage location status
velero backup-location describe aws --namespace backup
```

### System Status

```bash
# Check Velero server status
kubectl get deployment -n backup velero

# Check Velero server logs
kubectl logs deployment/velero -n backup

# Check Velero client version
velero version
```

## Best Practices

1. **Regular Testing**: Periodically test the restore process to ensure backups are viable
2. **Monitor Backup Jobs**: Set up alerts for failed backup jobs
3. **Resource Exclusions**: Consider excluding high-volume temporary data from backups
4. **Access Control**: Limit who can create/delete backups and perform restores
5. **Retention Policy**: Adjust the backup TTL (currently 10 days) based on your requirements
6. **Disaster Recovery Plan**: Document the complete restore procedure for disaster recovery
7. **Version Compatibility**: Ensure Velero version is compatible with your Kubernetes version

## Troubleshooting

1. **Failed Backups**:
   - Check the backup logs: `velero backup logs <backup-name> --namespace backup`
   - Verify IAM permissions for the Velero service account
   - Check S3 bucket accessibility

2. **Failed Restores**:
   - Check the restore logs: `velero restore logs <restore-name> --namespace backup`
   - Verify that the backup exists and is in a completed state
   - Check for namespace conflicts or resource validation errors

3. **Storage Issues**:
   - Verify the backup storage location is accessible: `velero backup-location describe aws --namespace backup`
   - Check the S3 bucket permissions and accessibility
   - Ensure the bucket exists in the correct AWS region (us-east-2)

4. **Volume Snapshot Issues**:
   - Verify that the EBS snapshots are being created in AWS console
   - Check the VolumeSnapshotLocation configuration
   - Ensure the IAM role has the necessary EC2 snapshot permissions
